'use client';

import React from 'react';

export type DisclaimerBlockProps = {
  paidForBy: string;
  pacId: string;
  textColor?: string;
  backgroundColor?: string;
};

export const DisclaimerBlock: React.FC<DisclaimerBlockProps> = ({
  paidForBy,
  pacId,
  textColor = '#6b7280',
  backgroundColor = '#f9fafb',
}) => {
  return (
    <div
      className="py-4 px-6 text-center text-sm border-t"
      style={{
        color: textColor,
        backgroundColor: backgroundColor
      }}
    >
      <p>
        Paid for by {paidForBy} | PAC ID: {pacId}
      </p>
    </div>
  );
};

export const disclaimerBlockConfig = {
  type: 'disclaimer',
  name: 'Disclaimer',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjAiIHk9IjYwIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjlmYWZiIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjUwJSIgeT0iODUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFpZCBmb3IgYnkgQW1lcmljYW5zIGZvciBQcm9ncmVzcyBQQUM8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI5IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QQUMgSUQ6IEMwMDEyMzQ1NjwvdGV4dD48L3N2Zz4=',
  defaultProps: {
    paidForBy: 'Americans for Progress PAC',
    pacId: 'C00123456',
    textColor: '#6b7280',
    backgroundColor: '#f9fafb',
  },
  propsSchema: {
    paidForBy: { type: 'text', label: 'Paid For By' },
    pacId: { type: 'text', label: 'PAC ID' },
    textColor: { type: 'color', label: 'Text Color' },
    backgroundColor: { type: 'color', label: 'Background Color' },
  },
};
