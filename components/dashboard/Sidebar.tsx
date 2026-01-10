'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut, Home, Shield } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin (client-side check for UI only)
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('/api/admin/check');
                if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
                }
            } catch (error) {
                console.error('Failed to check admin status:', error);
            }
        };
        checkAdmin();
    }, []);

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    // Add admin item if user is admin
    if (isAdmin) {
        navItems.push({ href: '/dashboard/admin', label: 'Admin Panel', icon: Shield });
    }

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout', {
                method: 'POST',
            });
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </nav>
        </aside>
    );
}
