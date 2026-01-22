'use client';

import React from 'react';

export type TextBlockProps = {
  content: string;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
};

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  alignment = 'left',
  fontSize = 'md',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div
          className={`prose prose-lg ${alignmentClasses[alignment]} ${fontSizeClasses[fontSize]}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export const textBlockConfig = {
  type: 'text',
  name: 'Text Content',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjIwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFmMjkzNyI+VGV4dCBDb250ZW50PC90ZXh0PjxsaW5lIHgxPSIyMCIgeTE9Ijc1IiB4Mj0iMzAwIiB5Mj0iNzUiIHN0cm9rZT0iIzRiNTU2MyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjIwIiB5MT0iOTUiIHgyPSIzMDAiIHkyPSI5NSIgc3Ryb2tlPSIjNGI1NTYzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIxMTUiIHgyPSIyNTAiIHkyPSIxMTUiIHN0cm9rZT0iIzRiNTU2MyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  defaultProps: {
    content: '<p>Add your text content here. You can use rich text formatting.</p>',
    alignment: 'left',
    fontSize: 'md',
  },
  propsSchema: {
    content: { type: 'richtext', label: 'Content' },
    alignment: {
      type: 'select',
      label: 'Alignment',
      options: ['left', 'center', 'right'],
    },
    fontSize: {
      type: 'select',
      label: 'Font Size',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};
