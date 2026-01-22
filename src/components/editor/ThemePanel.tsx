'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { X } from 'lucide-react';
import tinycolor from 'tinycolor2';

type ThemePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const prebuiltThemes = [
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#f59e0b',
    },
    mode: 'light' as const,
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    mode: 'light' as const,
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    mode: 'light' as const,
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#eab308',
    },
    mode: 'light' as const,
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#111827',
      text: '#f9fafb',
      accent: '#f59e0b',
    },
    mode: 'dark' as const,
  },
  {
    name: 'Cyberpunk',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      background: '#0f172a',
      text: '#e2e8f0',
      accent: '#06b6d4',
    },
    mode: 'dark' as const,
  },
  {
    name: 'Midnight',
    colors: {
      primary: '#6366f1',
      secondary: '#818cf8',
      background: '#1e293b',
      text: '#f1f5f9',
      accent: '#fbbf24',
    },
    mode: 'dark' as const,
  },
  {
    name: 'Gradient Bliss',
    colors: {
      primary: '#06b6d4',
      secondary: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    mode: 'light' as const,
  },
];

export const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, onClose }) => {
  const { theme, updateTheme } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'prebuilt' | 'custom'>('prebuilt');

  if (!isOpen) return null;

  const handleColorChange = (colorKey: string, value: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [colorKey]: value,
      },
    });
  };

  const generatePalette = (baseColor: string) => {
    const base = tinycolor(baseColor);
    const analogous = base.analogous();
    const complement = base.complement();

    updateTheme({
      colors: {
        primary: baseColor,
        secondary: analogous[2].toHexString(),
        background: theme.mode === 'dark' ? '#111827' : '#ffffff',
        text: theme.mode === 'dark' ? '#f9fafb' : '#1f2937',
        accent: complement.toHexString(),
      },
    });
  };

  const applyTheme = (prebuiltTheme: typeof prebuiltThemes[0]) => {
    updateTheme({
      colors: prebuiltTheme.colors,
      mode: prebuiltTheme.mode,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Theme Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('prebuilt')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'prebuilt'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pre-built Themes
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'custom'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Colors
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'prebuilt' && (
            <div className="grid grid-cols-2 gap-4">
              {prebuiltThemes.map((prebuiltTheme) => (
                <button
                  key={prebuiltTheme.name}
                  onClick={() => applyTheme(prebuiltTheme)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
                >
                  <div className="font-semibold mb-3">{prebuiltTheme.name}</div>
                  <div className="flex gap-2">
                    {Object.entries(prebuiltTheme.colors).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-10 h-10 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={key}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              {/* Color Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateTheme({ mode: 'light' })}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      theme.mode === 'light'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => updateTheme({ mode: 'dark' })}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      theme.mode === 'dark'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Color Palette Generator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generate Palette from Color
                </label>
                <input
                  type="color"
                  onChange={(e) => generatePalette(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pick a color to generate a complementary palette
                </p>
              </div>

              {/* Individual Color Controls */}
              <div className="space-y-4">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
