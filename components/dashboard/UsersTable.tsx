'use client';

import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { EditUserModal } from '@/components/dashboard/EditUserModal';
import { isAdmin } from '@/lib/admin';

interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
    isActive: boolean;
}

interface UsersTableProps {
    users: User[];
    currentUserEmail: string;
}

export function UsersTable({ users, currentUserEmail }: UsersTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [localUsers, setLocalUsers] = useState(users);

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to delete user');
                return;
            }

            // Remove user from local state
            setLocalUsers(localUsers.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert('An error occurred while deleting the user');
        }
    };

    const handleEditSuccess = () => {
        // Refresh the page to get updated data
        window.location.reload();
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {localUsers.map((user) => (
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
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-1">
                                        {user.isActive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                                <CheckCircle className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                                                <XCircle className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        )}
                                        {user.emailVerified ? (
                                            <span className="text-xs text-green-600">✓ Verified</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Not verified</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit user"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={user.email === currentUserEmail}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={user.email === currentUserEmail ? "Can't delete yourself" : "Delete user"}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}
