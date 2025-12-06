'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, AlertTriangle, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { TimeSavedCard } from './TimeSavedCard';

interface AIDetectorProps {
    onHumanize?: (text: string) => void;
}

interface DetectionResult {
    score: number;
    verdict: 'Likely AI' | 'Likely Human' | 'Mixed';
    perplexity_analysis: string;
    burstiness_analysis: string;
    reason: string;
    provider: string;
}

export function AIDetector({ onHumanize }: AIDetectorProps) {
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [error, setError] = useState('');

    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setIsAnalyzing(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze text');
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score <= 30) return 'text-green-600';
        if (score <= 69) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score <= 30) return 'bg-green-100';
        if (score <= 69) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getVerdictColor = (verdict: string) => {
        if (verdict === 'Likely Human') return 'bg-green-100 text-green-800 border-green-200';
        if (verdict === 'Mixed') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getVerdictIcon = (verdict: string) => {
        if (verdict === 'Likely Human') return <CheckCircle className="w-5 h-5" />;
        if (verdict === 'Mixed') return <AlertTriangle className="w-5 h-5" />;
        return <AlertTriangle className="w-5 h-5" />;
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        AI CONTENT DETECTOR
                    </h3>
                </div>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your text here to check if it's AI-generated..."
                    className="w-full h-48 p-4 text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
                />
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{wordCount} words</span>
                    <button
                        onClick={handleAnalyze}
                        disabled={!inputText.trim() || isAnalyzing}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {isAnalyzing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Analyze Text
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isAnalyzing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                    <p className="text-sm text-blue-800 text-center">
                        🔍 Analyzing linguistic patterns...
                    </p>
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                    <p className="text-sm text-red-800">{error}</p>
                </motion.div>
            )}

            {/* Results Dashboard */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* Main Score Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Circular Progress */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        {/* Background circle */}
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        {/* Progress circle */}
                                        <motion.circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeLinecap="round"
                                            className={getScoreColor(result.score)}
                                            initial={{ strokeDashoffset: 440 }}
                                            animate={{ strokeDashoffset: 440 - (440 * result.score) / 100 }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{
                                                strokeDasharray: 440,
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: 'spring' }}
                                            className={`text-4xl font-bold ${getScoreColor(result.score)}`}
                                        >
                                            {result.score}
                                        </motion.span>
                                        <span className="text-sm text-gray-500">AI Score</span>
                                    </div>
                                </div>

                            </div>

                            {/* Scale Legend - No Verdict Badge */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span>0-30</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span>31-69</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span>70-100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Saved Card */}
                    <TimeSavedCard wordCount={wordCount} type="detect" />

                    {/* Analysis Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vocabulary Pattern Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900">Perplexity Analysis</h4>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {result.perplexity_analysis}
                            </p>
                        </motion.div>

                        {/* Sentence Structure Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900">Burstiness Analysis</h4>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {result.burstiness_analysis}
                            </p>
                        </motion.div>
                    </div>

                    {/* Humanize Button - Always Show */}
                    {onHumanize && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 text-center"
                        >
                            <p className="text-gray-700 mb-4">
                                Want to make it humanize?
                            </p>
                            <button
                                onClick={() => onHumanize(inputText)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                ✨ Humanize This Content (Free)
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
