import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Users, FileText, Search, TrendingUp, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

// Force dynamic rendering - don't try to build this page statically
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await auth();

    // Check authentication
    if (!session?.user?.email) {
        redirect('/auth/signin');
    }

    // Check admin access
    if (!isAdmin(session.user.email)) {
        redirect('/dashboard');
    }

    // Fetch admin statistics directly
    const totalUsers = await prisma.user.count();

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

    // Get model usage
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

    // Get current hour usage
    const currentHourStart = new Date();
    currentHourStart.setMinutes(0, 0, 0);

    const currentHourActivities = await prisma.activityLog.groupBy({
        by: ['type'],
        where: {
            createdAt: {
                gte: currentHourStart,
            },
        },
        _count: true,
    });

    const currentHourHumanizations = currentHourActivities.find(a => a.type === 'humanize')?._count || 0;
    const currentHourDetections = currentHourActivities.find(a => a.type === 'detect')?._count || 0;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        System analytics and usage statistics
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Users"
                        value={totalUsers.toLocaleString()}
                        icon={<Users className="w-6 h-6" />}
                        color="purple"
                    />

                    <StatsCard
                        title="Total Humanizations"
                        value={totalHumanizations.toLocaleString()}
                        icon={<FileText className="w-6 h-6" />}
                        color="blue"
                    />

                    <StatsCard
                        title="Total Detections"
                        value={totalDetections.toLocaleString()}
                        icon={<Search className="w-6 h-6" />}
                        color="green"
                    />

                    <StatsCard
                        title="Words Processed"
                        value={totalWordsProcessed.toLocaleString()}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="orange"
                    />
                </div>

                {/* Current Hour Usage */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                        Current Hour Usage
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Humanizations</p>
                            <p className="text-3xl font-bold text-purple-600">{currentHourHumanizations}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Detections</p>
                            <p className="text-3xl font-bold text-blue-600">{currentHourDetections}</p>
                        </div>
                    </div>
                </div>

                {/* Model Usage Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Model Usage</h2>

                    {modelStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Requests</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usage Bar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modelStats.map((model, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium text-gray-900">{model.provider}</td>
                                            <td className="py-3 px-4 text-right text-gray-700">{model.count.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right text-gray-700">{model.percentage}%</td>
                                            <td className="py-3 px-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-600 h-2 rounded-full"
                                                        style={{ width: `${model.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No model usage data available yet</p>
                    )}
                </div>
            </main>
        </div>
    );
}
