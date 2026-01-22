'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { getAllBlockConfigs, getCategories } from '@/lib/block-registry';
import { Plus, Eye, EyeOff, Palette, Layout, Share2, Blocks, Briefcase, FolderOpen, Building2, LogOut } from 'lucide-react';
import { ThemePanel } from './ThemePanel';
import { TemplateSelector } from './TemplateSelector';
import { ShareLink } from './ShareLink';
import { BrandPanel } from './BrandPanel';
import { SitesPanel } from './SitesPanel';
import { OrganizationSwitcher } from './OrganizationSwitcher';
import { loadPage } from '@/lib/page-service';
import { PageTemplate } from '@/lib/templates';
import { useSearchParams } from 'next/navigation';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type ToolbarProps = {
  onCreateNewSite?: () => void;
};

type DraggableBlockButtonProps = {
  blockType: string;
  blockName: string;
  category: string;
  defaultProps: Record<string, any>;
  onClick: () => void;
};

const DraggableBlockButton: React.FC<DraggableBlockButtonProps> = ({
  blockType,
  blockName,
  category,
  defaultProps,
  onClick
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-block-${blockType}`,
    data: {
      type: 'NEW_BLOCK',
      blockType,
      defaultProps
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group hover:shadow-md"
    >
      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {blockName}
      </div>
      <div className="text-xs text-gray-500 mt-1 capitalize">{category}</div>
    </button>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({ onCreateNewSite }) => {
  const { addComponent, isEditing, setEditing, components, theme, pageName, currentPageId, setPageName, setCurrentPageId, loadPage: loadPageToStore, resetEditor, isSaving } = useEditorStore();
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showSitesPanel, setShowSitesPanel] = useState(false);
  const searchParams = useSearchParams();

  const categories = getCategories();
  const blocks = getAllBlockConfigs();

  // Load page from URL parameter on mount
  useEffect(() => {
    const pageId = searchParams.get('page');
    if (pageId) {
      loadPage(pageId).then((page) => {
        loadPageToStore(page);
      }).catch((err) => {
        console.error('Failed to load page from URL:', err);
      });
    }
  }, [searchParams, loadPageToStore]);

  const handleAddBlock = (type: string, defaultProps: Record<string, any>) => {
    addComponent(type, defaultProps);
    // Keep panel open when clicking to add
  };

  const handleSelectTemplate = (template: PageTemplate) => {
    loadPageToStore({
      id: currentPageId || crypto.randomUUID(),
      name: pageName || template.name,
      components: template.components,
      theme: template.theme,
    });
    setShowTemplateSelector(false);
  };

  const handleCreateNewSite = () => {
    resetEditor();
    setShowSitesPanel(false);
    if (onCreateNewSite) {
      onCreateNewSite();
    }
  };

  const [showBrandPanel, setShowBrandPanel] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);

  const handleOrganizationChange = (organizationId: string) => {
    // When organization changes, reload sites for that organization
    // This will be handled in the SitesPanel component
    console.log('Organization changed to:', organizationId);
  };

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/auth-service');
    const result = await signOut();
    if (result.success) {
      // Clear any local storage
      localStorage.removeItem('currentPageId');
      localStorage.removeItem('selectedOrganizationId');
      // Redirect to login
      window.location.href = '/auth';
    } else {
      alert('Failed to logout: ' + result.error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-red-600 focus:outline-none px-2 py-1"
            placeholder="Campaign Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOrgSwitcher(true)}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            title="Organization"
          >
            <Building2 size={16} className="flex-shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap">Organization</span>
          </button>

          <button
            onClick={() => setShowSitesPanel(true)}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            title="Sites"
            data-sites-button
          >
            <FolderOpen size={16} className="flex-shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap">Sites</span>
          </button>

          <button
            onClick={() => setShowBrandPanel(true)}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            title="Brand"
          >
            <Briefcase size={16} className="flex-shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap">Brand</span>
          </button>

          <button
            onClick={() => setShowTemplateSelector(true)}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            title="Templates"
          >
            <Layout size={16} className="flex-shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap">Templates</span>
          </button>

          <button
            onClick={() => setShowThemePanel(true)}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            title="Theme"
          >
            <Palette size={16} className="flex-shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap">Theme</span>
          </button>

          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <button
            onClick={handleLogout}
            className="group flex items-center overflow-hidden px-3 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all"
            title="Logout"
          >
            <LogOut size={16} className="flex-shrink-0 text-gray-600 group-hover:text-red-600" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap text-gray-600 group-hover:text-red-600">Logout</span>
          </button>
        </div>
      </div>

      {/* Organization Switcher */}
      <OrganizationSwitcher
        isOpen={showOrgSwitcher}
        onClose={() => setShowOrgSwitcher(false)}
        onOrganizationChange={handleOrganizationChange}
      />

      {/* Sites Panel */}
      <SitesPanel
        isOpen={showSitesPanel}
        onClose={() => setShowSitesPanel(false)}
        onCreateNew={handleCreateNewSite}
      />

      {/* Brand Panel */}
      <BrandPanel isOpen={showBrandPanel} onClose={() => setShowBrandPanel(false)} />

      {/* Theme Panel */}
      <ThemePanel isOpen={showThemePanel} onClose={() => setShowThemePanel(false)} />

      {/* Template Selector */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Share Link */}
      <ShareLink isOpen={showShareLink} onClose={() => setShowShareLink(false)} />
    </div>
  );
};

// Export BlockLibraryPanel as a separate component
type BlockLibraryPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BlockLibraryPanel: React.FC<BlockLibraryPanelProps> = ({ isOpen, onClose }) => {
  const { addComponent } = useEditorStore();
  const categories = getCategories();
  const blocks = getAllBlockConfigs();

  const handleAddBlock = (type: string, defaultProps: Record<string, any>) => {
    addComponent(type, defaultProps);
  };

  return (
    <div className={`h-full flex flex-col bg-white border-l border-gray-200 ${isOpen ? 'w-96' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <h2 className="text-xl font-bold">Add Component</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3 px-2">{category}</h3>
            <div className="space-y-2">
              {blocks
                .filter((block) => block.category === category)
                .map((block) => (
                  <DraggableBlockButton
                    key={block.type}
                    blockType={block.type}
                    blockName={block.name}
                    category={block.category}
                    defaultProps={block.defaultProps}
                    onClick={() => handleAddBlock(block.type, block.defaultProps)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
