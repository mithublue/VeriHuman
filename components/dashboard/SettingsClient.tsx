'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Trash2 } from 'lucide-react';

interface SettingsClientProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function SettingsClient({ user }: SettingsClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            // TODO: Implement delete account API call
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Account deleted successfully');
                router.push('/');
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            alert('An error occurred while deleting your account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                <div className="space-y-6">
                    {/* Profile Picture */}
                    {user.image && (
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.image}
                                alt={user.name || 'User'}
                                className="w-20 h-20 rounded-full border-4 border-primary-100"
                            />
                            <div>
                                <p className="text-sm text-gray-500">Profile Picture</p>
                                <p className="text-sm text-gray-400 mt-1">From your OAuth provider</p>
                            </div>
                        </div>
                    )}

                    {/* Name */}
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <p className="text-gray-900">{user.name || 'Not provided'}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-600">
                            Once you delete your account, there is no going back. All your data, including activity history and stats, will be permanently deleted.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="ml-6 inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </>
    );
}
