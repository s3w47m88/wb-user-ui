'use client';

import React, { useState } from 'react';
import { X, Link2, Copy, Check, ExternalLink } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

type ShareLinkProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ShareLink: React.FC<ShareLinkProps> = ({ isOpen, onClose }) => {
  const { currentPageId } = useEditorStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = currentPageId ? `${baseUrl}/preview/${currentPageId}` : '';
  const editUrl = currentPageId ? `${baseUrl}/?page=${currentPageId}` : '';

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPreview = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold">Share Your Page</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!currentPageId ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Please save your page first before sharing. Make some edits or add components to create a page.
              </p>
            </div>
          ) : (
            <>
              {/* Preview Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Public Preview Link
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Share this link to let others view your page (read-only)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopy(shareUrl)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleOpenPreview}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* Edit Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Edit Link
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Use this link to continue editing this page
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopy(editUrl)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Sharing Options:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Preview Link:</strong> Share with anyone to view the page (no editing)</li>
                  <li>• <strong>Edit Link:</strong> Continue editing from any device or browser</li>
                  <li>• All changes are saved automatically and persist across sessions</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
