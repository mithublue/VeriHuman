import { Header } from '@/components/Header';
import { Sparkles, Shield, Zap, Globe, Brain, TrendingUp, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FeaturesPage() {
    const features = [
        {
            icon: <Brain className="w-12 h-12" />,
            title: "Advanced AI Humanization",
            description: "Transform AI-generated text into natural, human-like content that passes detection tools with ease.",
            benefits: [
                "Multi-language support (English, Bengali, Arabic)",
                "Preserves original meaning and context",
                "Maintains emojis and special characters",
                "High sentence variation (burstiness)"
            ],
            color: "purple"
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "AI Detection Technology",
            description: "Powered by the Inverse Variance-Entropy Model (IVEM) for accurate AI content detection.",
            benefits: [
                "Advanced perplexity analysis",
                "Burstiness detection",
                "Keyword pattern recognition",
                "Detailed confidence scoring"
            ],
            color: "blue"
        },
        {
            icon: <Zap className="w-12 h-12" />,
            title: "Lightning Fast Processing",
            description: "Get results in seconds with our optimized AI pipeline and cascading fallback system.",
            benefits: [
                "Real-time text processing",
                "Multiple AI provider fallbacks",
                "99.9% uptime guarantee",
                "Instant results delivery"
            ],
            color: "orange"
        },
        {
            icon: <Globe className="w-12 h-12" />,
            title: "Multi-Language Support",
            description: "Work seamlessly across multiple languages without losing context or quality.",
            benefits: [
                "English, Bengali, Arabic support",
                "Language preservation guarantee",
                "No unwanted translations",
                "Cultural context awareness"
            ],
            color: "green"
        },
        {
            icon: <TrendingUp className="w-12 h-12" />,
            title: "Tone Customization",
            description: "Choose from multiple writing tones to match your specific needs and audience.",
            benefits: [
                "Standard, Casual, Formal, Academic",
                "Context-aware adjustments",
                "Consistent voice throughout",
                "Professional output quality"
            ],
            color: "pink"
        },
        {
            icon: <Lock className="w-12 h-12" />,
            title: "Privacy & Security",
            description: "Your data is encrypted and never stored. We prioritize your privacy above all.",
            benefits: [
                "End-to-end encryption",
                "No data retention policy",
                "Secure OAuth authentication",
                "GDPR compliant"
            ],
            color: "indigo"
        }
    ];

    const colorClasses = {
        purple: {
            bg: "bg-purple-50",
            icon: "text-purple-600",
            border: "border-purple-200",
            check: "text-purple-600"
        },
        blue: {
            bg: "bg-blue-50",
            icon: "text-blue-600",
            border: "border-blue-200",
            check: "text-blue-600"
        },
        orange: {
            bg: "bg-orange-50",
            icon: "text-orange-600",
            border: "border-orange-200",
            check: "text-orange-600"
        },
        green: {
            bg: "bg-green-50",
            icon: "text-green-600",
            border: "border-green-200",
            check: "text-green-600"
        },
        pink: {
            bg: "bg-pink-50",
            icon: "text-pink-600",
            border: "border-pink-200",
            check: "text-pink-600"
        },
        indigo: {
            bg: "bg-indigo-50",
            icon: "text-indigo-600",
            border: "border-indigo-200",
            check: "text-indigo-600"
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm animate-scale-in">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 animate-fade-in-up animate-delay-100">
                            Powerful Features for Perfect Content
                        </h1>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 animate-fade-in-up animate-delay-200">
                            Everything you need to humanize AI text and detect AI-generated content with precision and ease.
                        </p>
                        <div className="animate-fade-in-up animate-delay-300">
                            <Link
                                href="/"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                Try It Free
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-fade-in-up">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Everything You Need, All in One Place
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                VeriHuman combines cutting-edge AI technology with user-friendly design to deliver exceptional results.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const colors = colorClasses[feature.color as keyof typeof colorClasses];
                                const delay = `animate-delay-${(index + 1) * 100}` as const;
                                return (
                                    <div
                                        key={index}
                                        className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-8 hover-lift shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${delay}`}
                                    >
                                        <div className={`${colors.icon} mb-6`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-700 mb-6">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-3">
                                            {feature.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <CheckCircle className={`w-5 h-5 ${colors.check} mr-3 mt-0.5 flex-shrink-0`} />
                                                    <span className="text-gray-700">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-800 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
                            Ready to Transform Your Content?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8 animate-fade-in animate-delay-100">
                            Join thousands of users who trust VeriHuman for their content needs.
                        </p>
                        <div className="animate-fade-in animate-delay-200">
                            <Link
                                href="/auth/signin"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                Get Started Free
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
