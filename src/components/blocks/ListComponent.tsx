'use client';

import React from 'react';

export type ListComponentProps = {
  items: string[];
  type?: 'bullet' | 'numbered';
  color?: string;
  fontSize?: 'sm' | 'base' | 'lg';
};

export const ListComponent: React.FC<ListComponentProps> = ({
  items,
  type = 'bullet',
  color = '#4b5563',
  fontSize = 'base',
}) => {
  const Tag = type === 'bullet' ? 'ul' : 'ol';

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const listStyle = type === 'bullet' ? 'list-disc' : 'list-decimal';

  return (
    <Tag className={`${listStyle} ${sizeClasses[fontSize]} space-y-2 pl-6`} style={{ color }}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
};

export const listComponentConfig = {
  type: 'list',
  name: 'List',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQiIGZpbGw9IiM0YjU1NjMiLz48bGluZSB4MT0iNzUiIHkxPSI2MCIgeDI9IjI2MCIgeTI9IjYwIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iOTAiIHI9IjQiIGZpbGw9IiM0YjU1NjMiLz48bGluZSB4MT0iNzUiIHkxPSI5MCIgeDI9IjI2MCIgeTI9IjkwIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMTIwIiByPSI0IiBmaWxsPSIjNGI1NTYzIi8+PGxpbmUgeDE9Ijc1IiB5MT0iMTIwIiB4Mj0iMjYwIiB5Mj0iMTIwIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
  defaultProps: {
    items: ['First item', 'Second item', 'Third item'],
    type: 'bullet',
    color: '#4b5563',
    fontSize: 'base',
  },
  propsSchema: {
    items: { type: 'array', label: 'List Items' },
    type: { type: 'select', label: 'List Type', options: ['bullet', 'numbered'] },
    color: { type: 'color', label: 'Text Color' },
    fontSize: { type: 'select', label: 'Font Size', options: ['sm', 'base', 'lg'] },
  },
};
