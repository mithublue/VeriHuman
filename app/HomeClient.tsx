'use client';

import React, { useState, useEffect } from 'react';
import { ToneSelector } from '@/components/ToneSelector';
import { TextAreaCard } from '@/components/TextAreaCard';
import { AIDetector } from '@/components/AIDetector';
import { Sparkles, Wand2, Search, Lock } from 'lucide-react';
import Link from 'next/link';

type TabType = 'humanize' | 'detect';

export function HomeClient() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('humanize');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [selectedTone, setSelectedTone] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState('');
    const [error, setError] = useState('');

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                console.log('Session data:', data); // Debug log
                setIsSignedIn(!!data?.user);
            } catch (error) {
                console.error('Auth check error:', error);
                setIsSignedIn(false);
            } finally {
                setIsLoaded(true);
            }
        };
        checkAuth();
    }, []);

    const inputWordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
    const outputWordCount = outputText.trim().split(/\s+/).filter(Boolean).length;

    const handleHumanize = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setError('');
        setOutputText('');
        setProvider('');

        try {
            const response = await fetch('/api/humanize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    text: inputText,
                    tone: selectedTone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to humanize text');
            }

            setOutputText(data.humanizedText);
            setProvider(data.provider);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle humanize from AI Detector
    const handleHumanizeFromDetector = (text: string) => {
        setInputText(text);
        setActiveTab('humanize');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="space-y-8">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center justify-center p-2 bg-primary-50 rounded-full mb-4">
                        <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                        <span className="text-primary-700 font-medium text-sm">AI to Human Text Converter</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Transform AI content into natural human text.
                    </h1>
                    <p className="text-lg text-gray-600">
                        Bypass AI detection and refine your content with our advanced humanization engine. Select your tone and get started.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('humanize')}
                            className={`inline-flex items-center px-6 py-2.5 rounded-md font-medium transition-all ${activeTab === 'humanize'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Humanizer
                        </button>
                        <button
                            onClick={() => setActiveTab('detect')}
                            className={`inline-flex items-center px-6 py-2.5 rounded-md font-medium transition-all ${activeTab === 'detect'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            AI Detector
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'humanize' ? (
                    <div className="space-y-8">
                        {/* Settings Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 max-w-4xl mx-auto">
                            <div className="w-full sm:w-64">
                                <ToneSelector value={selectedTone} onChange={setSelectedTone} />
                            </div>
                            {isLoaded && !isSignedIn ? (
                                <Link href="/auth/signin">
                                    <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm">
                                        <Lock className="w-5 h-5 mr-2" />
                                        Sign In to Humanize
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleHumanize}
                                    disabled={!inputText.trim() || isLoading || !isSignedIn}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Humanizing...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5 mr-2" />
                                            Humanize Text
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Editor Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] lg:h-[500px]">
                            <TextAreaCard
                                title="AI GENERATED TEXT"
                                placeholder="Paste your AI-generated text here (ChatGPT, Gemini, Claude, etc)..."
                                value={inputText}
                                onChange={setInputText}
                                wordCount={inputWordCount}
                            />

                            <TextAreaCard
                                title="HUMANIZED OUTPUT"
                                placeholder={isLoading ? "Humanizing your text..." : "Your humanized content will appear here..."}
                                value={outputText}
                                onChange={setOutputText}
                                readOnly={true}
                                wordCount={outputWordCount}
                                provider={provider}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <AIDetector onHumanize={handleHumanizeFromDetector} />
                    </div>
                )}

            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} VeriHuman. Built for quality content.
                    </p>
                </div>
            </footer>
        </main>
    );
}
