import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function UsersListPage() {
    const session = await auth();

    // Check authentication
    if (!session?.user?.email) {
        redirect('/auth/signin');
    }

    // Check admin access
    if (!isAdmin(session.user.email)) {
        redirect('/dashboard');
    }

    // Fetch all users
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mr-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Registered Users</h1>
                            <p className="text-gray-600 mt-1">
                                Total: {users.length} {users.length === 1 ? 'user' : 'users'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name || 'User'}
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                            <span className="text-purple-600 font-semibold text-sm">
                                                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {user.name || 'No name'}
                                                        </p>
                                                        {isAdmin(user.email) && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No users found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
