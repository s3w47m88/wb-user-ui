'use client';

import React from 'react';

export type StatsBlockProps = {
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  backgroundColor?: string;
};

export const StatsBlock: React.FC<StatsBlockProps> = ({
  stats,
  backgroundColor = '#f9fafb',
}) => {
  return (
    <div className="py-16 px-6" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {stat.icon && <div className="text-5xl mb-3">{stat.icon}</div>}
              <div className="text-5xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const statsBlockConfig = {
  type: 'stats',
  name: 'Statistics',
  category: 'content',
  defaultProps: {
    stats: [
      { value: '10K+', label: 'Happy Customers', icon: '👥' },
      { value: '99.9%', label: 'Uptime', icon: '⚡' },
      { value: '50M+', label: 'Requests Served', icon: '🚀' },
      { value: '24/7', label: 'Support', icon: '💬' },
    ],
    backgroundColor: '#f9fafb',
  },
  propsSchema: {
    stats: { type: 'array', label: 'Statistics' },
    backgroundColor: { type: 'color', label: 'Background Color' },
  },
};
