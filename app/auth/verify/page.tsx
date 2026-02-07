'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing');
            return;
        }

        // Verify the email
        fetch(`/api/auth/verify?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setStatus('error');
                    setMessage(data.error);
                } else if (data.alreadyVerified) {
                    setStatus('already-verified');
                    setMessage(data.message);
                } else {
                    setStatus('success');
                    setMessage(data.message);
                }
            })
            .catch(err => {
                setStatus('error');
                setMessage('An error occurred during verification');
            });
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="max-w-md w-full mx-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                        <img
                            src="/logo.png"
                            alt="VeriHuman Logo"
                            className="w-16 h-16"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
                </div>

                {/* Verification Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                            <p className="text-gray-600">Verifying your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Link
                                href="/auth/signin"
                                className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                            >
                                Continue to Sign In
                            </Link>
                        </div>
                    )}

                    {status === 'already-verified' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Verified</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Link
                                href="/auth/signin"
                                className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                            >
                                Continue to Sign In
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                            <p className="text-red-600 mb-6">{message}</p>
                            <div className="space-y-3">
                                <Link
                                    href="/auth/signup"
                                    className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                                >
                                    Register Again
                                </Link>
                                <Link
                                    href="/auth/signin"
                                    className="inline-block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-all"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
