import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering - don't statically pre-render
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

        // Clean up old logs (older than 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        await prisma.activityLog.deleteMany({
            where: {
                createdAt: { lt: sevenDaysAgo },
            },
        });

        // Get recent activities (last 10)
        const activities = await prisma.activityLog.findMany({
            where: {
                user: { email: session.user.email },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            select: {
                id: true,
                type: true,
                wordCount: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            activities,
        });

    } catch (error) {
        console.error('Dashboard Activity API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}
