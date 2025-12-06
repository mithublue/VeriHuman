import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { isAdmin } from '@/lib/admin';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        // Check authentication and admin status
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!isAdmin(session.user.email)) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        // Get total users
        const totalUsers = await prisma.user.count();

        // Get total activities
        const totalActivities = await prisma.activityLog.groupBy({
            by: ['type'],
            _count: true,
            _sum: {
                wordCount: true,
            },
        });

        const totalHumanizations = totalActivities.find(a => a.type === 'humanize')?._count || 0;
        const totalDetections = totalActivities.find(a => a.type === 'detect')?._count || 0;
        const totalWordsProcessed = totalActivities.reduce((sum, a) => sum + (a._sum.wordCount || 0), 0);

        // Get model usage statistics
        const modelUsage = await prisma.activityLog.groupBy({
            by: ['provider'],
            _count: true,
            where: {
                provider: {
                    not: null,
                },
            },
            orderBy: {
                _count: {
                    provider: 'desc',
                },
            },
        });

        const totalRequests = modelUsage.reduce((sum, m) => sum + m._count, 0);
        const modelStats = modelUsage.map(m => ({
            provider: m.provider || 'Unknown',
            count: m._count,
            percentage: totalRequests > 0 ? Math.round((m._count / totalRequests) * 100) : 0,
        }));

        // Get daily usage for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyActivities = await prisma.activityLog.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                type: true,
                createdAt: true,
            },
        });

        // Group by date
        const dailyStats: { [key: string]: { humanizations: number; detections: number } } = {};
        dailyActivities.forEach(activity => {
            const date = activity.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) {
                dailyStats[date] = { humanizations: 0, detections: 0 };
            }
            if (activity.type === 'humanize') {
                dailyStats[date].humanizations++;
            } else if (activity.type === 'detect') {
                dailyStats[date].detections++;
            }
        });

        const dailyUsage = Object.entries(dailyStats).map(([date, stats]) => ({
            date,
            ...stats,
        })).sort((a, b) => a.date.localeCompare(b.date));

        // Get current hour usage
        const currentHourStart = new Date();
        currentHourStart.setMinutes(0, 0, 0);

        const currentHourActivities = await prisma.activityLog.groupBy({
            by: ['type', 'provider'],
            where: {
                createdAt: {
                    gte: currentHourStart,
                },
            },
            _count: true,
        });

        const currentHourUsage = {
            humanizations: currentHourActivities
                .filter(a => a.type === 'humanize')
                .reduce((sum, a) => sum + a._count, 0),
            detections: currentHourActivities
                .filter(a => a.type === 'detect')
                .reduce((sum, a) => sum + a._count, 0),
            byModel: currentHourActivities.map(a => ({
                type: a.type,
                provider: a.provider || 'Unknown',
                count: a._count,
            })),
        };

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                totalHumanizations,
                totalDetections,
                totalWordsProcessed,
                modelUsage: modelStats,
                dailyUsage,
                currentHourUsage,
            },
        });

    } catch (error) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin stats' },
            { status: 500 }
        );
    }
}
