'use client';

import React from 'react';
import { BarChart3, FileText, Clock, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: 'purple' | 'blue' | 'green' | 'orange';
}

const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
};

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
