import { Header } from '@/components/Header';
import { Target, Users, Lightbulb, Heart, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Precision",
            description: "We're committed to delivering the most accurate AI humanization and detection technology available."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Privacy",
            description: "Your data security is our top priority. We never store or share your content."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Innovation",
            description: "Constantly evolving our technology to stay ahead of AI detection algorithms."
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "User-First",
            description: "Every feature is designed with your needs and experience in mind."
        }
    ];

    const stats = [
        { number: "10K+", label: "Active Users" },
        { number: "1M+", label: "Words Processed" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
                                Making AI Content More Human
                            </h1>
                            <p className="text-xl text-purple-100 leading-relaxed animate-fade-in-up animate-delay-100">
                                VeriHuman was born from a simple observation: AI-generated content is powerful, but it lacks the natural flow and authenticity of human writing. We set out to bridge that gap.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 animate-scale-in">
                                    <Lightbulb className="w-8 h-8 text-purple-600" />
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-100">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                                    We believe in the power of AI to enhance human creativity, not replace it. Our mission is to provide tools that help you leverage AI technology while maintaining the authentic, human touch that makes content truly engaging.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Whether you're a content creator, student, researcher, or business professional, VeriHuman empowers you to work smarter while staying true to your unique voice.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why VeriHuman?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                                        <span className="text-gray-700">Built by AI researchers and linguists who understand both technology and language</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                                        <span className="text-gray-700">Continuously updated to stay ahead of detection algorithms</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                                        <span className="text-gray-700">Trusted by thousands of users worldwide</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                                        <span className="text-gray-700">Committed to ethical AI use and transparency</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-fade-in-up">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Our Core Values
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                These principles guide everything we do at VeriHuman.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className={`text-center p-6 rounded-xl hover:bg-purple-50 transition-all duration-300 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 text-purple-600">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-purple-100 text-lg">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Built by Experts
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Our team combines expertise in artificial intelligence, natural language processing, and user experience design to create the best possible tools for you.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 border-2 border-purple-200 text-center">
                            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                                We're a passionate team of developers, researchers, and designers dedicated to making AI technology more accessible and human-friendly. Every day, we work to improve VeriHuman based on your feedback and the latest advancements in AI.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Try VeriHuman Today
                            </Link>
                        </div>
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
