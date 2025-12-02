'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ToneSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Tone
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer transition-all"
                >
                    <option value="standard">Standard</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="academic">Academic</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
