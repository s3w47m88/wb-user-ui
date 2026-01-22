'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentData } from '@/lib/supabase';
import { getBlockComponent } from '@/lib/block-registry';
import { useEditorStore } from '@/store/editor-store';
import { GripVertical, Trash2 } from 'lucide-react';

type SortableBlockProps = {
  component: ComponentData;
  disabled?: boolean;
};

export const SortableBlock: React.FC<SortableBlockProps> = ({ component, disabled = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    disabled,
  });

  const { selectComponent, removeComponent, selectedComponentId } = useEditorStore();

  const BlockComponent = getBlockComponent(component.type);

  if (!BlockComponent) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        Unknown component type: {component.type}
      </div>
    );
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedComponentId === component.id;

  if (disabled) {
    return (
      <div ref={setNodeRef}>
        <BlockComponent {...component.props} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {/* Drag handle and controls */}
      <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 z-10">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
          className="p-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Component content */}
      <div className="pointer-events-none">
        <BlockComponent {...component.props} />
      </div>

      {/* Selection overlay */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
      )}
    </div>
  );
};
