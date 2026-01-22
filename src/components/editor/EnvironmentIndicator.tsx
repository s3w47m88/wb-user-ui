'use client';

import React from 'react';

export const EnvironmentIndicator: React.FC = () => {
  const getEnvironment = () => {
    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return {
        name: 'Localhost',
        color: 'green',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-600',
        textColor: 'text-green-600',
      };
    }

    if (hostname.includes('staging') || hostname.includes('railway.app')) {
      return {
        name: 'Staging',
        color: 'orange',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-600',
        textColor: 'text-orange-600',
      };
    }

    return null; // Production - no indicator
  };

  const env = getEnvironment();

  if (!env) return null;

  return (
    <>
      {/* Border around entire viewport */}
      <div
        className={`fixed inset-0 pointer-events-none z-[9999] border ${env.borderColor}`}
        style={{ borderWidth: '1px' }}
      />

      {/* Environment Tag */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
        <div className={`${env.bgColor} text-white px-4 py-1 text-sm font-semibold shadow-lg rounded-t-md`}>
          Environment: {env.name}
        </div>
      </div>
    </>
  );
};
