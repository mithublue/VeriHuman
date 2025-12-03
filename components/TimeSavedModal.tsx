'use client';

import { useEffect, useState } from 'react';
import { X, Clock, Zap, TrendingUp, CheckCircle } from 'lucide-react';

interface TimeSavedModalProps {
    isOpen: boolean;
    onClose: () => void;
    wordCount: number;
}

export function TimeSavedModal({ isOpen, onClose, wordCount }: TimeSavedModalProps) {
    const [show, setShow] = useState(false);

    // Calculate time saved (assuming reading speed of 200 words/min, detection saves 80% of manual check time)
    const readingTime = Math.ceil(wordCount / 200);
    const timeSaved = Math.max(1, Math.ceil(readingTime * 0.8));

    const messages = [
        `You're crushing it! 🚀`,
        `Time is money, and you're saving both! 💰`,
        `Productivity level: Expert! ⚡`,
        `Keep going, you're on fire! 🔥`,
        `Efficiency unlocked! 🎯`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
                className={`relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Celebration Icon */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                            <Clock className="w-12 h-12 text-white animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Time Saved! 🎉
                    </h2>
                    <p className="text-gray-600 text-lg">{randomMessage}</p>
                </div>

                {/* Time Saved Display */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-purple-100">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
                        <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {timeSaved}
                        </div>
                        <span className="text-2xl text-gray-600">min</span>
                    </div>
                    <p className="text-center text-gray-500 text-sm">saved from manual checking</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
                        <div className="flex items-center justify-center mb-1">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-gray-500">Words Checked</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{wordCount}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
                        <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-500">Efficiency</span>
                        </div>
                        <div className="text-2xl font-bold text-pink-600">80%</div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Awesome! Keep Going 🚀
                </button>

                {/* Encouraging Message */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Every check makes you more productive! 💪
                </p>
            </div>
        </div>
    );
}
