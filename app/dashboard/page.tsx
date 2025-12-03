import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { FileText, Search, Clock, TrendingUp } from 'lucide-react';

async function getStats() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/stats`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

async function getActivity() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/activity`, {
        cache: 'no-store',
    });
    if (!res.ok) return { activities: [] };
    return res.json();
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/auth/signin');
    }

    const statsData = await getStats();
    const activityData = await getActivity();

    const stats = statsData?.stats || {
        totalWordsHumanized: 0,
        totalDetections: 0,
        thisMonthWords: 0,
        thisMonthDetections: 0,
        savedTime: { formatted: '0m' },
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
                <ActivityTable activities={activityData.activities || []} />

                {/* Upgrade Section */}
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
            </main>
        </div>
    );
}
