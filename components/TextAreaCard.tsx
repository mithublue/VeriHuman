'use client';

import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface TextAreaCardProps {
    title: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder: string;
    readOnly?: boolean;
    wordCount?: number;
    provider?: string;
}

export function TextAreaCard({
    title,
    value,
    onChange,
    placeholder,
    readOnly = false,
    wordCount = 0,
    provider,
}: TextAreaCardProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
    };

    const handleClear = () => {
        if (onChange) {
            onChange('');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{wordCount} words</span>
                    <button
                        onClick={handleCopy}
                        disabled={!value}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    {!readOnly && (
                        <button
                            onClick={handleClear}
                            disabled={!value}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Clear text"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Textarea */}
            <textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
                className="flex-1 w-full p-4 text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
            />
        </div>
    );
}
