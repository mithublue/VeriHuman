import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Server, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-1" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                    </div>
                    <span className="text-sm text-gray-500">Last details update: October 26, 2024</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Title Section */}
                    <div className="px-8 py-10 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            At VeriHuman, we take your privacy seriously. This policy explains how we collect, use, and protect your data when you use our AI Humanizer & Detector services.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 pl-14">
                                <p>We collect minimal data to provide and improve our services:</p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <strong>Input Text:</strong> Text you submit for AI detection or humanization is processed to provide results but is not permanently stored or used to train our models without your explicit consent.
                                    </li>
                                    <li>
                                        <strong>Usage Data:</strong> We collect anonymous metrics (e.g., number of words processed, features used) to analyze system performance and improve user experience.
                                    </li>
                                    <li>
                                        <strong>Account Information:</strong> If you verify an account, we store your email address and authentication credentials securely.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Server className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Data</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 pl-14">
                                <p>Your data is used solely for the following purposes:</p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>To provide the AI detection and humanization services you request.</li>
                                    <li>To maintain and improve the security and performance of our platform.</li>
                                    <li>To communicate with you regarding service updates or support inquiries.</li>
                                </ul>
                                <p className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                    <strong>Note:</strong> We do NOT sell your personal data to third parties or use your submitted content to train public AI models.
                                </p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">3. Data Security</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 pl-14">
                                <p>
                                    We implement industry-standard security measures to protect your data. All data transmission occurs over secure SSL/TLS encrypted connections.
                                </p>
                                <p>
                                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">4. Chrome Extension Privacy</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 pl-14">
                                <p>
                                    Our Chrome Extension (VeriHuman) requires permission to access the content of the active tab to perform AI detection or humanization functions tailored to your current context.
                                </p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>Data analysis happens only when you explicitly trigger an action (e.g., clicking "Analyze" or "Humanize").</li>
                                    <li>We do not passively track your browsing history or collect data from websites you visit without your interaction.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">5. Third-Party Services</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 pl-14">
                                <p>
                                    We may use trusted third-party services for hosting, analytics, and authentication (e.g., Vercel, Supabase, Google Analytics). These parties have access to your data only to perform specific tasks on our behalf and are obligated not to disclose or use it for other purposes.
                                </p>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section className="pt-8 border-t border-gray-100">
                            <div className="bg-gray-50 rounded-xl p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Mail className="w-6 h-6 text-gray-700" />
                                    <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    If you have any questions about this Privacy Policy, please contact us anywhere.
                                </p>
                                <a href="mailto:support@cybercraftit.com" className="text-blue-600 font-medium hover:underline">
                                    support@cybercraftit.com
                                </a>
                            </div>
                        </section>

                    </div>
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} VeriHuman. All rights reserved.
                </footer>
            </main>
        </div>
    );
}
