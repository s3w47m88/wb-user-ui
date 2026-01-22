'use client';

import React, { useState } from 'react';
import { Plus, Minus, Settings, Trash2 } from 'lucide-react';
import { ComponentPicker } from '../editor/ComponentPicker';
import { getBlockComponent } from '@/lib/block-registry';

export type GridCell = {
  id: string;
  componentType?: string;
  componentProps?: Record<string, any>;
};

export type GridBlockProps = {
  title?: string;
  rows: number;
  columns: number;
  cells: GridCell[];
  gap?: number;
  padding?: string;
  editable?: boolean;
  onUpdateCells?: (cells: GridCell[]) => void;
  onUpdateGrid?: (rows: number, columns: number) => void;
};

export const GridBlock: React.FC<GridBlockProps> = ({
  title,
  rows,
  columns,
  cells,
  gap = 16,
  padding = '2rem',
  editable = false,
  onUpdateCells,
  onUpdateGrid,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [localRows, setLocalRows] = useState(rows);
  const [localColumns, setLocalColumns] = useState(columns);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);

  // Get cell for specific position or create empty one
  const getCell = (rowIndex: number, colIndex: number): GridCell => {
    const cellIndex = rowIndex * columns + colIndex;
    return cells[cellIndex] || {
      id: `cell-${rowIndex}-${colIndex}`,
    };
  };

  const handleAddComponent = (rowIndex: number, colIndex: number) => {
    const cellIndex = rowIndex * columns + colIndex;
    setSelectedCellIndex(cellIndex);
    setShowComponentPicker(true);
  };

  const handleSelectComponent = (componentType: string, componentProps: any) => {
    if (selectedCellIndex === null || !onUpdateCells) return;

    const updatedCells = [...cells];
    updatedCells[selectedCellIndex] = {
      id: `cell-${Math.floor(selectedCellIndex / columns)}-${selectedCellIndex % columns}`,
      componentType,
      componentProps,
    };

    onUpdateCells(updatedCells);
    setShowComponentPicker(false);
    setSelectedCellIndex(null);
  };

  const handleRemoveComponent = (cellIndex: number) => {
    if (!onUpdateCells) return;

    const updatedCells = [...cells];
    updatedCells[cellIndex] = {
      id: `cell-${Math.floor(cellIndex / columns)}-${cellIndex % columns}`,
    };

    onUpdateCells(updatedCells);
  };

  const handleAddRow = () => {
    const newRows = rows + 1;
    onUpdateGrid?.(newRows, columns);
  };

  const handleRemoveRow = () => {
    if (rows <= 1) return;
    const newRows = rows - 1;
    // Remove cells from last row
    const newCells = cells.slice(0, newRows * columns);
    onUpdateCells?.(newCells);
    onUpdateGrid?.(newRows, columns);
  };

  const handleAddColumn = () => {
    const newColumns = columns + 1;
    onUpdateGrid?.(rows, newColumns);
  };

  const handleRemoveColumn = () => {
    if (columns <= 1) return;
    const newColumns = columns - 1;
    // Rebuild cells array without last column in each row
    const newCells: GridCell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < newColumns; c++) {
        const oldIndex = r * columns + c;
        if (cells[oldIndex]) {
          newCells.push(cells[oldIndex]);
        }
      }
    }
    onUpdateCells?.(newCells);
    onUpdateGrid?.(rows, newColumns);
  };

  const applySettings = () => {
    onUpdateGrid?.(localRows, localColumns);
    setShowSettings(false);
  };

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
            {title}
          </h2>
        )}

        {/* Grid Controls (only in edit mode) */}
        {editable && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <span className="text-sm font-medium text-gray-700">Rows:</span>
              <button
                onClick={handleRemoveRow}
                className="p-1 bg-white rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={rows <= 1}
              >
                <Minus size={16} className="text-red-600" />
              </button>
              <span className="text-sm font-bold w-8 text-center">{rows}</span>
              <button
                onClick={handleAddRow}
                className="p-1 bg-white rounded hover:bg-green-50"
              >
                <Plus size={16} className="text-green-600" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <span className="text-sm font-medium text-gray-700">Columns:</span>
              <button
                onClick={handleRemoveColumn}
                className="p-1 bg-white rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={columns <= 1}
              >
                <Minus size={16} className="text-red-600" />
              </button>
              <span className="text-sm font-bold w-8 text-center">{columns}</span>
              <button
                onClick={handleAddColumn}
                className="p-1 bg-white rounded hover:bg-green-50"
              >
                <Plus size={16} className="text-green-600" />
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Grid Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {editable && showSettings && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-bold text-lg mb-4">Grid Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={localRows}
                  onChange={(e) => setLocalRows(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={localColumns}
                  onChange={(e) => setLocalColumns(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                onClick={applySettings}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
            padding,
          }}
        >
          {Array.from({ length: rows }).map((_, rowIndex) =>
            Array.from({ length: columns }).map((_, colIndex) => {
              const cell = getCell(rowIndex, colIndex);
              const cellIndex = rowIndex * columns + colIndex;
              const hasComponent = !!cell.componentType;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`min-h-[200px] rounded-lg transition-all relative ${
                    editable
                      ? 'border-2 border-dashed border-gray-300 hover:border-blue-500 bg-transparent'
                      : 'bg-transparent'
                  }`}
                >
                  {/* Empty Cell - Show Add Component Button */}
                  {!hasComponent && editable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleAddComponent(rowIndex, colIndex)}
                        className="flex flex-col items-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <Plus size={24} className="text-gray-400 group-hover:text-blue-600" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                          Add Component
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Filled Cell - Show Component */}
                  {hasComponent && (
                    <div className="relative h-full">
                      {editable && (
                        <button
                          onClick={() => handleRemoveComponent(cellIndex)}
                          className="absolute -top-2 -right-2 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                          title="Remove component"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="h-full">
                        {(() => {
                          const Component = getBlockComponent(cell.componentType!);
                          return Component ? <Component {...cell.componentProps} /> : null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Component Picker Modal - Only show components, not sections */}
        <ComponentPicker
          isOpen={showComponentPicker}
          onClose={() => {
            setShowComponentPicker(false);
            setSelectedCellIndex(null);
          }}
          onSelectComponent={handleSelectComponent}
          filterCategory="components"
        />
      </div>
    </div>
  );
};

export const gridBlockConfig = {
  type: 'grid',
  name: 'Grid Section',
  category: 'sections',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjcwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUsMiIvPjxyZWN0IHg9IjExNSIgeT0iMjAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI3MCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDIiLz48cmVjdCB4PSIyMTAiIHk9IjIwIiB3aWR0aD0iOTAiIGhlaWdodD0iNzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSwyIi8+PHJlY3QgeD0iMjAiIHk9IjkwIiB3aWR0aD0iOTAiIGhlaWdodD0iNzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSwyIi8+PHJlY3QgeD0iMTE1IiB5PSI5MCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjcwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUsMiIvPjxyZWN0IHg9IjIxMCIgeT0iOTAiIHdpZHRoPSI5MCIgaGVpZ2h0PSI3MCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDIiLz48L3N2Zz4=',
  defaultProps: {
    title: '',
    rows: 2,
    columns: 3,
    cells: [],
    gap: 16,
    padding: '2rem',
  },
  propsSchema: {
    title: { type: 'text', label: 'Grid Title' },
    rows: { type: 'number', label: 'Rows', min: 1, max: 12 },
    columns: { type: 'number', label: 'Columns', min: 1, max: 12 },
    gap: { type: 'number', label: 'Gap (px)', min: 0, max: 64 },
    padding: { type: 'text', label: 'Padding' },
  },
};
