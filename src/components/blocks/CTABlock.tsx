'use client';

import React from 'react';

export type CTABlockProps = {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
};

export const CTABlock: React.FC<CTABlockProps> = ({
  heading,
  description,
  buttonText,
  buttonLink,
  backgroundColor = '#3b82f6',
}) => {
  return (
    <div
      className="py-16 px-6 text-center relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float animation-delay-1000" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">{heading}</h2>
        <p className="text-xl text-white/90 mb-8 animate-fade-in animation-delay-200">{description}</p>
        <a
          href={buttonLink}
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in animation-delay-400"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export const ctaBlockConfig = {
  type: 'cta',
  name: 'Call to Action',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FsbCB0byBBY3Rpb248L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRlc2NyaXB0aW9uPC90ZXh0PjxyZWN0IHg9IjExMCIgeT0iMTEwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjM1IiByeD0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  defaultProps: {
    heading: 'Ready to Get Started?',
    description: 'Join thousands of users building amazing websites',
    buttonText: 'Start Now',
    buttonLink: '#',
    backgroundColor: '#3b82f6',
  },
  propsSchema: {
    heading: { type: 'text', label: 'Heading' },
    description: { type: 'text', label: 'Description' },
    buttonText: { type: 'text', label: 'Button Text' },
    buttonLink: { type: 'text', label: 'Button Link' },
    backgroundColor: { type: 'color', label: 'Background Color' },
  },
};
