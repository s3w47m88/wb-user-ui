'use client';

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { getAllBlockConfigs, getCategories } from '@/lib/block-registry';

type ComponentPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: string, defaultProps: Record<string, any>) => void;
  filterCategory?: string; // Optional: only show blocks from this category
};

export const ComponentPicker: React.FC<ComponentPickerProps> = ({
  isOpen,
  onClose,
  onSelectComponent,
  filterCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'All');

  const categories = filterCategory ? [filterCategory] : ['All', ...getCategories()];
  const blocks = getAllBlockConfigs();

  const filteredBlocks = blocks.filter((block) => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory
      ? block.category === filterCategory
      : (selectedCategory === 'All' || block.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filterCategory === 'sections' ? 'Add Section' :
             filterCategory === 'components' ? 'Add Component' :
             'Add Component'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Component Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No components found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredBlocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => onSelectComponent(block.type, block.defaultProps)}
                  className="group border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                    {block.thumbnail ? (
                      <img src={block.thumbnail} alt={block.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                    {block.name}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize">{block.category}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
