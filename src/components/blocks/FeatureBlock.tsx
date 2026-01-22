'use client';

import React from 'react';

export type FeatureBlockProps = {
  title: string;
  subtitle: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
};

export const FeatureBlock: React.FC<FeatureBlockProps> = ({
  title,
  subtitle,
  features,
}) => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">{title}</h2>
          <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const featureBlockConfig = {
  type: 'feature',
  name: 'Feature Grid',
  category: 'content',
  defaultProps: {
    title: 'Our Features',
    subtitle: 'Everything you need to succeed',
    features: [
      { icon: '⚡', title: 'Fast Performance', description: 'Lightning-fast load times and optimized delivery' },
      { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security for your peace of mind' },
      { icon: '📱', title: 'Responsive', description: 'Perfect on every device, from mobile to desktop' },
    ],
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    features: { type: 'array', label: 'Features' },
  },
};
