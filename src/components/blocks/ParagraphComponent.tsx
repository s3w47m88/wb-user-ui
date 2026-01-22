'use client';

import React from 'react';

export type ParagraphComponentProps = {
  text: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  color?: string;
};

export const ParagraphComponent: React.FC<ParagraphComponentProps> = ({
  text,
  alignment = 'left',
  fontSize = 'base',
  color = '#4b5563',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <p
      className={`${alignmentClasses[alignment]} ${sizeClasses[fontSize]} leading-relaxed`}
      style={{ color }}
    >
      {text}
    </p>
  );
};

export const paragraphComponentConfig = {
  type: 'paragraph',
  name: 'Paragraph',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxsaW5lIHgxPSIyMCIgeTE9IjUwIiB4Mj0iMzAwIiB5Mj0iNTAiIHN0cm9rZT0iIzRiNTU2MyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjIwIiB5MT0iNzAiIHgyPSIzMDAiIHkyPSI3MCIgc3Ryb2tlPSIjNGI1NTYzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSI5MCIgeDI9IjMwMCIgeTI9IjkwIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyMCIgeTE9IjExMCIgeDI9IjI1MCIgeTI9IjExMCIgc3Ryb2tlPSIjNGI1NTYzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
  defaultProps: {
    text: 'Add your paragraph text here. This is a simple text component that you can customize.',
    alignment: 'left',
    fontSize: 'base',
    color: '#4b5563',
  },
  propsSchema: {
    text: { type: 'textarea', label: 'Text' },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center', 'right', 'justify'] },
    fontSize: { type: 'select', label: 'Font Size', options: ['sm', 'base', 'lg', 'xl'] },
    color: { type: 'color', label: 'Text Color' },
  },
};
