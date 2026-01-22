'use client';

import React from 'react';

export type HeadingComponentProps = {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment?: 'left' | 'center' | 'right';
  color?: string;
};

export const HeadingComponent: React.FC<HeadingComponentProps> = ({
  text,
  level = 'h2',
  alignment = 'left',
  color = '#1f2937',
}) => {
  const Tag = level;

  const sizeClasses = {
    h1: 'text-5xl font-bold',
    h2: 'text-4xl font-bold',
    h3: 'text-3xl font-bold',
    h4: 'text-2xl font-semibold',
    h5: 'text-xl font-semibold',
    h6: 'text-lg font-semibold',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <Tag
      className={`${sizeClasses[level]} ${alignmentClasses[alignment]} mb-4`}
      style={{ color }}
    >
      {text}
    </Tag>
  );
};

export const headingComponentConfig = {
  type: 'heading',
  name: 'Heading',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjIwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFmMjkzNyI+WW91ciBIZWFkaW5nPC90ZXh0Pjwvc3ZnPg==',
  defaultProps: {
    text: 'Your Heading Here',
    level: 'h2',
    alignment: 'left',
    color: '#1f2937',
  },
  propsSchema: {
    text: { type: 'text', label: 'Heading Text' },
    level: { type: 'select', label: 'Level', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
    color: { type: 'color', label: 'Text Color' },
  },
};
