'use client';

import React, { useState } from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { ComponentPicker } from './ComponentPicker';

type SectionLayout = {
  columns: number;
  rows: number;
  gap: number;
};

type SectionStyle = {
  padding: string;
  margin: string;
  backgroundColor: string;
};

type SectionProps = {
  id: string;
  layout: SectionLayout;
  style: SectionStyle;
  children?: React.ReactNode;
  onAddSection: (position: 'above' | 'below') => void;
  onAddComponent: (slotIndex: number, componentType: string, defaultProps: any) => void;
  onDelete: () => void;
  onUpdateLayout: (layout: SectionLayout) => void;
  onUpdateStyle: (style: SectionStyle) => void;
};

export const Section: React.FC<SectionProps> = ({
  id,
  layout,
  style,
  children,
  onAddSection,
  onAddComponent,
  onDelete,
  onUpdateLayout,
  onUpdateStyle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const totalSlots = layout.columns * layout.rows;
  const childrenArray = React.Children.toArray(children);

  const handleAddComponent = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowComponentPicker(true);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Add Section Above */}
      {isHovered && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddSection('above')}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={14} />
            Add Section Above
          </button>
        </div>
      )}

      {/* Section Container */}
      <div
        className={`relative border-2 transition-all ${
          isHovered ? 'border-blue-500 border-dashed' : 'border-transparent'
        }`}
        style={{
          padding: style.padding,
          margin: style.margin,
          backgroundColor: style.backgroundColor,
        }}
      >
        {/* Section Controls */}
        {isHovered && (
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-md"
              title="Section Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 shadow-md"
              title="Delete Section"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        )}

        {/* Section Settings Panel */}
        {showSettings && (
          <div className="absolute top-14 right-2 z-30 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
            <h3 className="font-bold text-lg mb-4">Section Settings</h3>

            {/* Layout Controls */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Layout</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={layout.columns}
                    onChange={(e) => onUpdateLayout({ ...layout, columns: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={layout.rows}
                    onChange={(e) => onUpdateLayout({ ...layout, rows: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Style Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Padding</label>
                <select
                  value={style.padding}
                  onChange={(e) => onUpdateStyle({ ...style, padding: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="0">None</option>
                  <option value="1rem">Small (1rem)</option>
                  <option value="2rem">Medium (2rem)</option>
                  <option value="4rem">Large (4rem)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Margin</label>
                <select
                  value={style.margin}
                  onChange={(e) => onUpdateStyle({ ...style, margin: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="0">None</option>
                  <option value="1rem 0">Small (1rem)</option>
                  <option value="2rem 0">Medium (2rem)</option>
                  <option value="4rem 0">Large (4rem)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Background</label>
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => onUpdateStyle({ ...style, backgroundColor: e.target.value })}
                  className="w-full h-10 rounded"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}

        {/* Section Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, minmax(200px, auto))`,
            gap: `${layout.gap}px`,
          }}
        >
          {Array.from({ length: totalSlots }).map((_, index) => (
            <div
              key={index}
              className="relative border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              {childrenArray[index] || (
                <button
                  onClick={() => handleAddComponent(index)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Plus size={16} />
                  Add Component
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Section Below */}
      {isHovered && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddSection('below')}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={14} />
            Add Section Below
          </button>
        </div>
      )}

      {/* Component Picker Modal */}
      {showComponentPicker && selectedSlot !== null && (
        <ComponentPicker
          isOpen={showComponentPicker}
          onClose={() => {
            setShowComponentPicker(false);
            setSelectedSlot(null);
          }}
          onSelectComponent={(componentType, defaultProps) => {
            onAddComponent(selectedSlot, componentType, defaultProps);
            setShowComponentPicker(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};
