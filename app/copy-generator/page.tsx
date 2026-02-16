import { Header } from '@/components/Header';
import CopyGenerator from '@/components/copy-gen/CopyGenerator';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export default async function CopyGeneratorPage() {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <Header />
                <div className="flex-grow pb-20">
                    {/* Hero Section */}
                    <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <div className="inline-flex items-center justify-center p-2 mb-6 bg-white rounded-full shadow-sm border border-indigo-100">
                                <span className="px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
                                    New Feature
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                    AI-Powered Sales Copy Generator
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 heading-gradient">
                                Turn Product Photos into <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    High-Converting Sales Copy
                                </span>
                            </h1>

                            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                                Upload a photo or describe your product, and let our AI generate SEO-optimized descriptions for Amazon, Shopify, Instagram, and more.
                            </p>
                        </div>

                        {/* Background Elements */}
                        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <CopyGenerator />
                    </div>
                </div>
            </div>
        </SessionProvider>
    );
}
