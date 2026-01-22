'use client';

import React from 'react';
import { Eye, Pencil, Share2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

type FloatingEditButtonProps = {
  onShareClick: () => void;
};

export const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ onShareClick }) => {
  const { isEditing, setEditing } = useEditorStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Share Button */}
      <button
        onClick={onShareClick}
        className="w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title="Share"
        aria-label="Share website"
      >
        <Share2 size={24} className="transition-transform group-hover:scale-110" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Share
        </span>
      </button>

      {/* Edit/Preview Toggle Button */}
      <button
        onClick={() => setEditing(!isEditing)}
        className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title={isEditing ? 'Preview Mode' : 'Edit Mode'}
        aria-label={isEditing ? 'Switch to Preview Mode' : 'Switch to Edit Mode'}
      >
        {isEditing ? (
          <Eye size={24} className="transition-transform group-hover:scale-110" />
        ) : (
          <Pencil size={24} className="transition-transform group-hover:scale-110" />
        )}

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isEditing ? 'Preview Mode' : 'Edit Mode'}
        </span>
      </button>
    </div>
  );
};
