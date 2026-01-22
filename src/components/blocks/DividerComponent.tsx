'use client';

import React from 'react';

export type DividerComponentProps = {
  style?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  spacing?: 'sm' | 'md' | 'lg';
};

export const DividerComponent: React.FC<DividerComponentProps> = ({
  style = 'solid',
  thickness = 1,
  color = '#e5e7eb',
  spacing = 'md',
}) => {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  };

  return (
    <hr
      className={spacingClasses[spacing]}
      style={{
        borderTop: `${thickness}px ${style} ${color}`,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    />
  );
};

export const dividerComponentConfig = {
  type: 'divider',
  name: 'Divider',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxsaW5lIHgxPSI0MCIgeTE9IjkwIiB4Mj0iMjgwIiB5Mj0iOTAiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+',
  defaultProps: {
    style: 'solid',
    thickness: 1,
    color: '#e5e7eb',
    spacing: 'md',
  },
  propsSchema: {
    style: { type: 'select', label: 'Style', options: ['solid', 'dashed', 'dotted'] },
    thickness: { type: 'number', label: 'Thickness (px)', min: 1, max: 10 },
    color: { type: 'color', label: 'Color' },
    spacing: { type: 'select', label: 'Spacing', options: ['sm', 'md', 'lg'] },
  },
};
