'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { EditableBlock } from './EditableBlock';
import { ComponentPicker } from './ComponentPicker';
import { useEditorStore } from '@/store/editor-store';

export const Canvas: React.FC = () => {
  const { components, isEditing, addComponent, reorderComponents } = useEditorStore();
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  const handleAddSectionClick = (position: number) => {
    setInsertPosition(position);
    setShowSectionPicker(true);
  };

  const handleSelectSection = (componentType: string, defaultProps: any) => {
    if (insertPosition === null) return;

    // Create new component
    const newComponent = {
      id: crypto.randomUUID(),
      type: componentType,
      props: defaultProps,
      order: insertPosition,
    };

    // Insert component at the specified position
    const updatedComponents = [...components];
    updatedComponents.splice(insertPosition, 0, newComponent);

    // Reorder all components
    const reorderedComponents = updatedComponents.map((comp, index) => ({
      ...comp,
      order: index,
    }));

    reorderComponents(reorderedComponents);
    setShowSectionPicker(false);
    setInsertPosition(null);
  };

  // Preview mode - no editing
  if (!isEditing) {
    return (
      <div className="min-h-screen bg-white">
        {components
          .sort((a, b) => a.order - b.order)
          .map((component) => (
            <EditableBlock key={component.id} component={component} disabled />
          ))}
      </div>
    );
  }

  // Editing mode
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Empty state */}
      {components.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-semibold text-gray-700 mb-4">Start building your page</p>
          <p className="text-gray-500 mb-8">Add your first section or choose a template</p>
          <button
            onClick={() => handleAddSectionClick(0)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all"
          >
            <Plus size={20} />
            Add First Section
          </button>
        </div>
      ) : (
        <div>
          {/* Add section divider at top */}
          <SectionDivider onClick={() => handleAddSectionClick(0)} />

          {/* Existing sections with dividers between */}
          {sortedComponents.map((component, index) => (
            <React.Fragment key={component.id}>
              <EditableBlock component={component} />
              <SectionDivider onClick={() => handleAddSectionClick(index + 1)} />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Section Picker Modal */}
      <ComponentPicker
        isOpen={showSectionPicker}
        onClose={() => {
          setShowSectionPicker(false);
          setInsertPosition(null);
        }}
        onSelectComponent={handleSelectSection}
        filterCategory="sections"
      />
    </div>
  );
};

// Section Divider - appears on hover to add sections
const SectionDivider: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-12 group flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Hover line and button */}
      <div
        className={`transition-all duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full h-0.5 bg-blue-400 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-lg whitespace-nowrap transition-colors"
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
};
