'use client';

import React from 'react';

export type HeroBlockProps = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
};

export const HeroBlock: React.FC<HeroBlockProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}) => {
  return (
    <div
      className="relative flex items-center justify-center min-h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse" />

      <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up animation-delay-200">{subtitle}</p>
        <a
          href={ctaLink}
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-slide-up animation-delay-400"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export const heroBlockConfig = {
  type: 'hero',
  name: 'Hero Section',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzYjgyZjY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SGVybyBUaXRsZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3VidGl0bGU8L3RleHQ+PHJlY3QgeD0iMTIwIiB5PSIxMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIzMCIgcng9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  defaultProps: {
    title: 'Welcome to Your Website',
    subtitle: 'Build beautiful pages with our visual editor',
    ctaText: 'Get Started',
    ctaLink: '#',
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    ctaText: { type: 'text', label: 'Button Text' },
    ctaLink: { type: 'text', label: 'Button Link' },
    backgroundImage: { type: 'image', label: 'Background Image' },
  },
};
