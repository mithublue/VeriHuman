import { Header } from '@/components/Header';
import { Rocket, Target, Zap, TrendingUp, Cpu, Globe, DollarSign, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Investor Pitch | VeriHuman',
    description: 'The future of undetectable AI content - VeriHuman Investor Pitch Deck.',
};

export default function PitchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
                            <Rocket className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium pr-2">Investor Presentation</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                            VeriHuman: The Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                Undetectable AI Content
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto font-light leading-relaxed">
                            Reclaiming the Human Touch in the Age of AI.
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Problem & Solution */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Target className="w-24 h-24 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">1.</span>
                                The Problem
                            </h2>
                            <p className="text-gray-600 mb-4 font-semibold text-lg">The "AI-Detected" Wall</p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                As AI usage explodes, detectors are becoming the new gatekeepers. Content creators face:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'SEO Penalties & Search Suppression',
                                    'Academic Risk & False Positives',
                                    'Lack of Personality & Dry Output'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-24 h-24 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">2.</span>
                                The Solution
                            </h2>
                            <p className="text-gray-600 mb-4 font-semibold text-lg">Science-Backed Humanization</p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                VeriHuman is a linguistic transformation engine targeting mathematical markers:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Consistent 0-20% AI Scores',
                                    'Deep Multilingual Mastery (EN, BN, AR)',
                                    'E-commerce & SEO Professional Grade'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* The IVEM Model */}
                    <section className="mb-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
                                        <Cpu className="w-4 h-4 mr-2" />
                                        Proprietary Algorithm
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">3. The Secret Sauce: IVEM</h2>
                                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                        The <strong>Inverse Variance-Entropy Model (IVEM)</strong> exploits the predictability filters of modern detectors by injecting "human-like" unpredictability and syntactic variation.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <h4 className="font-bold mb-2 text-blue-400">Variable Perplexity</h4>
                                            <p className="text-sm text-gray-400">Injects unpredictable word choices naturally.</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <h4 className="font-bold mb-2 text-purple-400">Syntactic Burstiness</h4>
                                            <p className="text-sm text-gray-400">Mixes complex and simple sentence structures.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm self-stretch flex items-center justify-center font-mono text-blue-400">
                                    <div className="text-center">
                                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Core Formula</p>
                                        <div className="text-2xl md:text-3xl italic">
                                            S_AI = σ ( α/P(T)^λ + β/B(T)^μ + ... )
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Market & Roadmap */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                                4. Market Opportunity
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'E-commerce', market: '$5.5T', desc: 'Merchants needing humanized descriptions at scale.' },
                                    { title: 'Content Marketing', market: '$600B+', desc: 'Agencies moving to hybrid AI-first workflows.' },
                                    { title: 'SEO Agencies', market: 'Global', desc: 'High demand for bypass content.' }
                                ].map((m, i) => (
                                    <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="font-bold text-purple-600 text-lg min-w-[70px]">{m.market}</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{m.title}</h4>
                                            <p className="text-sm text-gray-500">{m.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <Rocket className="w-6 h-6 mr-3 text-blue-600" />
                                5. Product Features
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    { title: 'Marketing Copy Engine', status: 'Core' },
                                    { title: 'Vision-to-Text Layer', status: 'Roadmap' },
                                    { title: 'Tone & Style Controls', status: 'Live' },
                                    { title: 'Shopify/WooCommerce Plugins', status: 'Development' }
                                ].map((f, i) => (
                                    <li key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                        <span className="text-gray-700 font-medium">{f.title}</span>
                                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${f.status === 'Live' ? 'bg-green-100 text-green-700' :
                                                f.status === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {f.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* The Ask */}
                    <section className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-[2.5rem] p-8 md:p-12 text-center mb-20">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl mb-6 shadow-sm">
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">7. The Ask: $200,000</h2>
                        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                            Seeking pre-seed funding for an 18-month runway to scale infrastructure, build the e-commerce suite, and expand into the MENA market.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {[
                                { label: 'Infrastructure', val: '40%' },
                                { label: 'Engineering', val: '30%' },
                                { label: 'Marketing', val: '20%' },
                                { label: 'Legal/OPs', val: '10%' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/60 p-4 rounded-2xl border border-white/80">
                                    <div className="text-2xl font-bold text-gray-900">{item.val}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Milestones */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">18-Month Milestones</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                { title: '1,000+ Paid Subs', icon: <Users className="w-5 h-5" /> },
                                { title: 'Global MENA Launch', icon: <Globe className="w-5 h-5" /> },
                                { title: 'Shopify/Woo Platform', icon: <Zap className="w-5 h-5" /> }
                            ].map((m, i) => (
                                <div key={i} className="text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-gray-900">{m.title}</h4>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Bottom CTA */}
                    <div className="text-center py-12 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">"AI is here to stay. VeriHuman ensures it sounds like you."</h3>
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <Link href="/">
                                <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
                                    Try the Beta
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="px-8 py-3 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-colors">
                                    Meet the Team
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; 2026 VeriHuman. Investor Relations Presentation.
                </div>
            </footer>
        </div>
    );
}

function Users({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
