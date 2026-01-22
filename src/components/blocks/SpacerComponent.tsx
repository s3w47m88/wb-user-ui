'use client';

import React from 'react';

export type SpacerComponentProps = {
  height?: string;
};

export const SpacerComponent: React.FC<SpacerComponentProps> = ({
  height = '40px',
}) => {
  return <div style={{ height }} />;
};

export const spacerComponentConfig = {
  type: 'spacer',
  name: 'Spacer',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjEyMCIgeT0iNjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUsMiIvPjxsaW5lIHgxPSIxNjAiIHkxPSI1MCIgeDI9IjE2MCIgeTI9IjYwIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIxNjAiIHkxPSIxMjAiIHgyPSIxNjAiIHkyPSIxMzAiIHN0cm9rZT0iIzljYTNhZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBvbHlnb24gcG9pbnRzPSIxNTUsNTUgMTYwLDUwIDE2NSw1NSIgZmlsbD0iIzljYTNhZiIvPjxwb2x5Z29uIHBvaW50cz0iMTU1LDEyNSAxNjAsMTMwIDE2NSwxMjUiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4=',
  defaultProps: {
    height: '40px',
  },
  propsSchema: {
    height: { type: 'text', label: 'Height (e.g., 40px, 2rem)' },
  },
};
