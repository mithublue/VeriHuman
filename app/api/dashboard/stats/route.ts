import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                totalWordsHumanized: true,
                totalDetections: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate this month's stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthActivities = await prisma.activityLog.groupBy({
            by: ['type'],
            where: {
                user: { email: session.user.email },
                createdAt: { gte: startOfMonth },
            },
            _sum: {
                wordCount: true,
            },
            _count: true,
        });

        const thisMonthWords = thisMonthActivities
            .filter(a => a.type === 'humanize')
            .reduce((sum, a) => sum + (a._sum.wordCount || 0), 0);

        const thisMonthDetections = thisMonthActivities
            .filter(a => a.type === 'detect')
            .reduce((sum, a) => sum + a._count, 0);

        // Calculate saved time (assuming 200 words per minute reading speed)
        const savedMinutes = Math.floor(user.totalWordsHumanized / 200);
        const savedHours = Math.floor(savedMinutes / 60);
        const remainingMinutes = savedMinutes % 60;

        return NextResponse.json({
            success: true,
            stats: {
                totalWordsHumanized: user.totalWordsHumanized,
                totalDetections: user.totalDetections,
                thisMonthWords,
                thisMonthDetections,
                savedTime: {
                    hours: savedHours,
                    minutes: remainingMinutes,
                    formatted: savedHours > 0
                        ? `${savedHours}h ${remainingMinutes}m`
                        : `${remainingMinutes}m`,
                },
                memberSince: user.createdAt,
            },
        });

    } catch (error) {
        console.error('Dashboard Stats API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
