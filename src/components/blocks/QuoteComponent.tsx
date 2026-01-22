'use client';

import React from 'react';

export type QuoteComponentProps = {
  text: string;
  author?: string;
  style?: 'simple' | 'fancy' | 'bordered';
  alignment?: 'left' | 'center';
};

export const QuoteComponent: React.FC<QuoteComponentProps> = ({
  text,
  author,
  style = 'simple',
  alignment = 'left',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  const containerClasses = {
    simple: 'border-l-4 border-blue-500 pl-4',
    fancy: 'bg-gray-50 p-6 rounded-lg shadow-md',
    bordered: 'border-2 border-gray-200 p-6 rounded-lg',
  };

  return (
    <blockquote className={`${containerClasses[style]} ${alignmentClasses[alignment]} my-4`}>
      <p className="text-lg italic text-gray-700 mb-2">&ldquo;{text}&rdquo;</p>
      {author && (
        <cite className="text-sm text-gray-600 not-italic font-medium">— {author}</cite>
      )}
    </blockquote>
  );
};

export const quoteComponentConfig = {
  type: 'quote',
  name: 'Quote',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjQwIiB5PSI1MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI4MCIgcng9IjgiIGZpbGw9IiNmM2Y0ZjYiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNDAiIHk9IjUwIiB3aWR0aD0iNiIgaGVpZ2h0PSI4MCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9IjYwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmb250LXN0eWxlPSJpdGFsaWMiIGZpbGw9IiM0YjU1NjMiPiJJbnNwaXJpbmcgcXVvdGUgaGVyZSIgPC90ZXh0Pjx0ZXh0IHg9IjYwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZiNzI4MCI+4oCUIEF1dGhvcjwvdGV4dD48L3N2Zz4=',
  defaultProps: {
    text: 'This is an inspiring quote that will motivate your visitors.',
    author: 'John Doe',
    style: 'simple',
    alignment: 'left',
  },
  propsSchema: {
    text: { type: 'textarea', label: 'Quote Text' },
    author: { type: 'text', label: 'Author' },
    style: { type: 'select', label: 'Style', options: ['simple', 'fancy', 'bordered'] },
    alignment: { type: 'select', label: 'Alignment', options: ['left', 'center'] },
  },
};
