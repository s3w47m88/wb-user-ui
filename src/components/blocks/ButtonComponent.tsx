'use client';

import React from 'react';
import { useEditorStore } from '@/store/editor-store';

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
  const theme = useEditorStore((state) => state.theme);
  const primaryColor = theme.colors.primary || '#2563eb';
  const secondaryColor = theme.colors.secondary || '#6b7280';

  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'bg-transparent border-2',
  };

  const variantStyles = {
    primary: { backgroundColor: primaryColor, color: '#ffffff' },
    secondary: { backgroundColor: secondaryColor, color: '#ffffff' },
    outline: { borderColor: primaryColor, color: primaryColor, backgroundColor: 'transparent' },
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
      style={{
        ...variantStyles[variant],
        fontFamily: theme.fonts.body,
      }}
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
