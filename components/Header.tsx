import React from 'react';
import { Sparkles } from 'lucide-react';

export function Header() {
    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">HumanizeAI</span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Pricing
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                            API
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                            About
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                            Sign In
                        </button>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
