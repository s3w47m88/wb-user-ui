'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { getBlockConfig } from '@/lib/block-registry';
import { X, Wand2 } from 'lucide-react';
import { ImageGenerator } from './ImageGenerator';

export const PropertyPanel: React.FC = () => {
  const { selectedComponentId, components, updateComponent, selectComponent } = useEditorStore();
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [currentImageProp, setCurrentImageProp] = useState<string | null>(null);

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-400 mt-20">
          <p>No component selected</p>
          <p className="text-sm mt-2">Click on a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const blockConfig = getBlockConfig(selectedComponent.type);

  if (!blockConfig) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <p className="text-red-500">Unknown component type</p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, { [key]: value });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="font-semibold">{blockConfig.name}</h3>
        <button
          onClick={() => selectComponent(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {Object.entries(blockConfig.propsSchema).map(([key, schema]: [string, any]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {schema.label}
            </label>

            {schema.type === 'text' && (
              <input
                type="text"
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {schema.type === 'richtext' && (
              <textarea
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            )}

            {schema.type === 'number' && (
              <input
                type="number"
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handlePropertyChange(key, parseInt(e.target.value))}
                min={schema.min}
                max={schema.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {schema.type === 'color' && (
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedComponent.props[key] || '#000000'}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedComponent.props[key] || ''}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {schema.type === 'select' && (
              <select
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {schema.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {schema.type === 'image' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedComponent.props[key] || ''}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    setCurrentImageProp(key);
                    setShowImageGenerator(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Wand2 size={16} />
                  Generate with AI
                </button>
                {selectedComponent.props[key] && (
                  <img
                    src={selectedComponent.props[key]}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Generator Modal */}
      <ImageGenerator
        isOpen={showImageGenerator}
        onClose={() => {
          setShowImageGenerator(false);
          setCurrentImageProp(null);
        }}
        onImageGenerated={(url) => {
          if (currentImageProp && selectedComponent) {
            handlePropertyChange(currentImageProp, url);
          }
        }}
      />
    </div>
  );
};
