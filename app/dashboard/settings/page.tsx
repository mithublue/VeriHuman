import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SettingsClient } from '@/components/dashboard/SettingsClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/auth/signin');
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <SettingsClient user={session.user} />
            </main>
        </div>
    );
}
