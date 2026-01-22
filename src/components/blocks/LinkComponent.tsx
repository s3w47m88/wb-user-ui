'use client';

import React from 'react';

export type LinkComponentProps = {
  text: string;
  url: string;
  openInNewTab?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
};

export const LinkComponent: React.FC<LinkComponentProps> = ({
  text,
  url,
  openInNewTab = false,
  underline = true,
  color = '#3b82f6',
  fontSize = 'base',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <a
      href={url}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className={`${sizeClasses[fontSize]} hover:opacity-80 transition-opacity ${underline ? 'underline' : 'no-underline'}`}
      style={{ color }}
    >
      {text}
    </a>
  );
};

export const linkComponentConfig = {
  type: 'link',
  name: 'Link',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMzYjgyZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHQtZGVjb3JhdGlvbj0idW5kZXJsaW5lIj5DbGljayBoZXJlPC90ZXh0Pjwvc3ZnPg==',
  defaultProps: {
    text: 'Click here',
    url: '#',
    openInNewTab: false,
    underline: true,
    color: '#3b82f6',
    fontSize: 'base',
  },
  propsSchema: {
    text: { type: 'text', label: 'Link Text' },
    url: { type: 'text', label: 'URL' },
    openInNewTab: { type: 'boolean', label: 'Open in New Tab' },
    underline: { type: 'boolean', label: 'Underline' },
    color: { type: 'color', label: 'Color' },
    fontSize: { type: 'select', label: 'Font Size', options: ['sm', 'base', 'lg', 'xl'] },
  },
};
