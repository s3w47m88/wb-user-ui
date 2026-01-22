'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { getAllPages, deletePage, loadPage } from '@/lib/page-service';
import { PageConfig } from '@/lib/supabase';

type SitesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
};

export const SitesPanel: React.FC<SitesPanelProps> = ({ isOpen, onClose, onCreateNew }) => {
  const [sites, setSites] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { loadPage: loadPageToStore, currentPageId } = useEditorStore();

  useEffect(() => {
    if (isOpen) {
      // Always reload sites when panel opens to ensure fresh data
      loadSites();
    }
  }, [isOpen, currentPageId]); // Re-fetch when current page changes

  const loadSites = async () => {
    setLoading(true);
    try {
      const pages = await getAllPages();
      setSites(pages);
    } catch (error) {
      console.error('Failed to load sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSite = async (site: PageConfig) => {
    try {
      const fullPage = await loadPage(site.id);
      loadPageToStore(fullPage);
      onClose();
    } catch (error) {
      console.error('Failed to load site:', error);
    }
  };

  const handleDeleteSite = async (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this site?')) return;

    try {
      await deletePage(siteId);
      setSites(sites.filter(s => s.id !== siteId));

      // If we deleted the current page, reset the editor
      if (siteId === currentPageId) {
        useEditorStore.getState().resetEditor();
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Campaign Sites</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No sites yet. Create your first campaign site!</p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={20} />
                Create Your First Site
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Create New Card */}
              <button
                onClick={handleCreateNew}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-400 hover:bg-red-50 transition-colors flex flex-col items-center justify-center min-h-[200px] group"
              >
                <Plus size={48} className="text-gray-400 group-hover:text-red-600 mb-3" />
                <span className="font-semibold text-gray-700 group-hover:text-red-700">Create New Site</span>
              </button>

              {/* Existing Sites */}
              {sites.map((site) => (
                <div
                  key={site.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative group ${
                    site.id === currentPageId
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                  }`}
                  onClick={() => handleSelectSite(site)}
                >
                  {/* Color Preview */}
                  <div
                    className="h-24 rounded mb-4 bg-gradient-to-br"
                    style={{
                      background: `linear-gradient(135deg, ${site.theme.colors.primary} 0%, ${site.theme.colors.secondary} 100%)`
                    }}
                  />

                  {/* Site Name */}
                  <h3 className="font-bold text-lg mb-2 truncate">{site.name}</h3>

                  {/* Component Count */}
                  <p className="text-sm text-gray-600 mb-4">
                    {site.components.length} component{site.components.length !== 1 ? 's' : ''}
                  </p>

                  {/* Current Badge */}
                  {site.id === currentPageId && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Current
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`/preview/${site.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink size={14} />
                      Preview
                    </a>
                    <button
                      onClick={(e) => handleDeleteSite(site.id, e)}
                      className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
