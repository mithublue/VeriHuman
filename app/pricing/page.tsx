import { Header } from '@/components/Header';
import { Sparkles, Bell, Mail } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm animate-scale-in">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 animate-fade-in-up animate-delay-100">
                            Pricing Plans
                        </h1>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
                            We're working on the perfect pricing structure for you.
                        </p>
                    </div>
                </section>

                {/* Coming Soon Section */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fade-in-up">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                                    <Bell className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Pricing Coming Soon
                                </h2>
                                <p className="text-purple-100 text-lg">
                                    We're currently in beta and working on our pricing structure
                                </p>
                            </div>

                            {/* Content */}
                            <div className="px-8 py-12">
                                <div className="text-center mb-12">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        What We're Planning
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        We're carefully designing pricing plans that offer great value while keeping VeriHuman accessible to everyone. Our goal is to create flexible options that work for individuals, teams, and enterprises.
                                    </p>
                                </div>

                                {/* Features Preview */}
                                <div className="grid md:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">Free</div>
                                        <div className="text-gray-600">For individuals getting started</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-center transform scale-105 shadow-xl">
                                        <div className="text-3xl font-bold text-white mb-2">Pro</div>
                                        <div className="text-purple-100">For power users and professionals</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">Enterprise</div>
                                        <div className="text-gray-600">For teams and organizations</div>
                                    </div>
                                </div>

                                {/* Current Status */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                        🎉 Currently Free to Use!
                                    </h4>
                                    <p className="text-gray-700 text-center leading-relaxed">
                                        While we finalize our pricing, VeriHuman is completely free to use. Enjoy unlimited access to all features including AI humanization, detection, and dashboard analytics.
                                    </p>
                                </div>

                                {/* Notify Me Form */}
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                                        Get Notified When Pricing Launches
                                    </h4>
                                    <p className="text-gray-600 mb-6">
                                        Be the first to know about our pricing plans and exclusive launch offers.
                                    </p>

                                    <div className="max-w-md mx-auto">
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                                />
                                            </div>
                                            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
                                                Notify Me
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-3">
                                            We'll never spam you. Unsubscribe anytime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">When will pricing be available?</h4>
                                    <p className="text-gray-600">We're targeting Q2 2026 for our official pricing launch. Sign up for notifications to be the first to know!</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">Will there be a free plan?</h4>
                                    <p className="text-gray-600">Yes! We're committed to keeping a generous free tier so everyone can benefit from VeriHuman's core features.</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">What happens to current users?</h4>
                                    <p className="text-gray-600">All current users will receive special early adopter benefits and exclusive pricing when we launch. Your support means everything to us!</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">Can I use VeriHuman for free now?</h4>
                                    <p className="text-gray-600">Absolutely! VeriHuman is completely free to use during our beta period. No credit card required, no hidden fees.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Start Using VeriHuman Today
                        </h2>
                        <p className="text-xl text-purple-100 mb-8">
                            No payment required. Full access to all features.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2026 VeriHuman. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
