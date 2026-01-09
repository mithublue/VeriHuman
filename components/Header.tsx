import React from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '@/auth';
import { signOut } from '@/auth';
import Link from 'next/link';

export async function Header() {
    const session = await auth();

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img
                            src="/logo.png"
                            alt="VeriHuman Logo"
                            className="w-8 h-8"
                        />
                        <span className="text-xl font-bold text-gray-900">VeriHuman</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {session?.user && (
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                                Dashboard
                            </Link>
                        )}
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                            Pricing
                        </a>
                        <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                            About
                        </a>
                    </nav>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {session?.user ? (
                            <div className="flex items-center gap-3">
                                {/* User Info */}
                                <div className="flex items-center gap-2">
                                    {session.user.image && (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full border-2 border-primary-200"
                                        />
                                    )}
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {session.user.name}
                                    </span>
                                </div>

                                {/* Sign Out Button */}
                                <form
                                    action={async () => {
                                        'use server';
                                        await signOut({ redirectTo: '/' });
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign Out</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
