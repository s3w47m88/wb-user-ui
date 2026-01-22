'use client';

import React from 'react';

export type BadgeComponentProps = {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
};

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
  text,
  variant = 'default',
  size = 'md',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-block font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {text}
    </span>
  );
};

export const badgeComponentConfig = {
  type: 'badge',
  name: 'Badge',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjEyMCIgeT0iNzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjM2I4MmY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iPk5ldzwvdGV4dD48L3N2Zz4=',
  defaultProps: {
    text: 'New',
    variant: 'default',
    size: 'md',
  },
  propsSchema: {
    text: { type: 'text', label: 'Badge Text' },
    variant: { type: 'select', label: 'Variant', options: ['default', 'success', 'warning', 'danger', 'info'] },
    size: { type: 'select', label: 'Size', options: ['sm', 'md', 'lg'] },
  },
};
