import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { FileText, Search, Clock, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/auth/signin');
    }

    // Fetch user stats directly from database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            totalWordsHumanized: true,
            totalDetections: true,
            createdAt: true,
        },
    });

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
        .filter((a: any) => a.type === 'humanize')
        .reduce((sum: number, a: any) => sum + (a._sum.wordCount || 0), 0);

    const thisMonthDetections = thisMonthActivities
        .filter((a: any) => a.type === 'detect')
        .reduce((sum: number, a: any) => sum + a._count, 0);

    // Get recent activities
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

    // Calculate total time saved from ALL activities
    // Fetch all successful activities
    const allActivities = await prisma.activityLog.findMany({
        where: {
            user: { email: session.user.email },
            status: 'success',
        },
        select: {
            type: true,
            wordCount: true,
        },
    });

    // Calculate total time saved using formulas:
    // Humanize: wordCount / 25
    // Detect: wordCount / 150
    let totalTimeSavedMinutes = 0;
    allActivities.forEach(activity => {
        if (activity.type === 'humanize') {
            totalTimeSavedMinutes += activity.wordCount / 25;
        } else if (activity.type === 'detect') {
            totalTimeSavedMinutes += activity.wordCount / 150;
        }
    });

    // Convert to hours and minutes
    const savedHours = Math.floor(totalTimeSavedMinutes / 60);
    const remainingMinutes = Math.ceil(totalTimeSavedMinutes % 60);

    const stats = {
        totalWordsHumanized: user?.totalWordsHumanized || 0,
        totalDetections: user?.totalDetections || 0,
        thisMonthWords,
        thisMonthDetections,
        savedTime: {
            formatted: savedHours > 0
                ? `${savedHours}h ${remainingMinutes}m`
                : `${remainingMinutes}m`,
        },
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {session.user.name || session.user.email}!
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Words Humanized"
                        value={stats.totalWordsHumanized.toLocaleString()}
                        icon={<FileText className="w-6 h-6" />}
                        color="purple"
                        trend={stats.thisMonthWords > 0 ? `+${stats.thisMonthWords} this month` : undefined}
                    />

                    <StatsCard
                        title="Detection Checks"
                        value={stats.totalDetections.toLocaleString()}
                        icon={<Search className="w-6 h-6" />}
                        color="blue"
                        trend={stats.thisMonthDetections > 0 ? `+${stats.thisMonthDetections} this month` : undefined}
                    />

                    <StatsCard
                        title="Time Saved"
                        value={stats.savedTime.formatted}
                        icon={<Clock className="w-6 h-6" />}
                        color="green"
                    />

                    <StatsCard
                        title="This Month"
                        value={stats.thisMonthWords.toLocaleString()}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="orange"
                        trend="words"
                    />
                </div>

                {/* Activity Table */}
                <ActivityTable activities={activities.map(a => ({
                    ...a,
                    createdAt: a.createdAt.toISOString(),
                }))} />

                {/* Upgrade Section - Commented out until Pro feature is ready
                <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Current Plan: Free Tier</h3>
                            <p className="text-purple-100">
                                Enjoying VeriHuman? Upgrade to Pro for unlimited access!
                            </p>
                        </div>
                        <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
                */}
            </main>
        </div>
    );
}
