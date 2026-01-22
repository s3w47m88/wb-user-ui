'use client';

import React from 'react';

export type ButtonComponentProps = {
  text: string;
  link?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  text,
  link = '#',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <a
      href={link}
      className={`inline-block font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full text-center' : ''}`}
    >
      {text}
    </a>
  );
};

export const buttonComponentConfig = {
  type: 'button',
  name: 'Button',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjkwIiB5PSI2NSIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI1MCIgcng9IjgiIGZpbGw9IiMzYjgyZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+Q2xpY2sgTWU8L3RleHQ+PC9zdmc+',
  defaultProps: {
    text: 'Click Me',
    link: '#',
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
  propsSchema: {
    text: { type: 'text', label: 'Button Text' },
    link: { type: 'text', label: 'Link URL' },
    variant: { type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline'] },
    size: { type: 'select', label: 'Size', options: ['sm', 'md', 'lg'] },
    fullWidth: { type: 'boolean', label: 'Full Width' },
  },
};
