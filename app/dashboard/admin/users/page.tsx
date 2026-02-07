import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UsersTable } from '@/components/dashboard/UsersTable';

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

    // Fetch all users with verification status
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            isActive: true,
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
                        <UsersTable users={users} currentUserEmail={session.user.email} />
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
