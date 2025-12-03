'use client';

import { Clock, Zap, TrendingUp } from 'lucide-react';

interface TimeSavedCardProps {
    wordCount: number;
    type?: 'humanize' | 'detect'; // Type of feature
}

export function TimeSavedCard({ wordCount, type = 'humanize' }: TimeSavedCardProps) {
    // Calculate time saved using different formulas:
    // Humanize: Total Words / 25
    // Detect: Total Words / 150
    const divisor = type === 'detect' ? 150 : 25;
    const timeSaved = Math.max(1, Math.ceil(wordCount / divisor));

    const messages = [
        `You're crushing it! 🚀`,
        `Time is money! 💰`,
        `Productivity expert! ⚡`,
        `You're on fire! 🔥`,
        `Efficiency unlocked! 🎯`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-sm">
            {/* Header with Icon */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                    <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-purple-900">Time Saved!</h3>
                    <p className="text-sm text-purple-600">{randomMessage}</p>
                </div>
            </div>

            {/* Time Display */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {timeSaved}
                    </span>
                    <span className="text-xl text-gray-600">min</span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-1">saved from manual checking</p>
            </div>

            {/* Small Stats */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    <span>80% faster</span>
                </div>
                <div className="text-purple-600 font-medium">
                    {wordCount} words checked ✓
                </div>
            </div>

            {/* Encouraging note */}
            <p className="text-center text-xs text-gray-500 mt-3 pt-3 border-t border-purple-100">
                Keep going! Every check saves you time 💪
            </p>
        </div>
    );
}
