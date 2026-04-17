"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { getBlockConfig } from "@/lib/block-registry";
import { X, Wand2 } from "lucide-react";
import { ImageGenerator } from "./ImageGenerator";
import { ImageUploadField } from "./ImageUploadField";

type PropertySchema = {
  type: string;
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
};

export const PropertyPanel: React.FC = () => {
  const {
    selectedComponentId,
    components,
    updateComponent,
    selectComponent,
    saveNow,
  } = useEditorStore();
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [currentImageProp, setCurrentImageProp] = useState<string | null>(null);

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId,
  );

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-400 mt-20">
          <p>No component selected</p>
          <p className="text-sm mt-2">
            Click on a component to edit its properties
          </p>
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

  const handlePropertyChange = (key: string, value: unknown) => {
    updateComponent(selectedComponent.id, { [key]: value });
  };
  const getStringValue = (key: string, fallback = "") => {
    const value = selectedComponent.props[key];
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
    return fallback;
  };
  const getNumberValue = (key: string) => {
    const value = selectedComponent.props[key];
    return typeof value === "number" ? value : "";
  };
  const getBooleanValue = (key: string) => selectedComponent.props[key] === true;
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
        {Object.entries(
          blockConfig.propsSchema as Record<string, PropertySchema>,
        ).map(([key, schema]) => (
          <div key={key}>
            {schema.type !== "image" && (
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {schema.label}
              </label>
            )}

            {schema.type === "text" && (
              <input
                type="text"
                value={getStringValue(key)}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                onBlur={saveNow}
                placeholder={schema.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {schema.type === "textarea" && (
              <textarea
                value={getStringValue(key)}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                onBlur={saveNow}
                rows={4}
                placeholder={schema.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {schema.type === "richtext" && (
              <textarea
                value={getStringValue(key)}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                onBlur={saveNow}
                rows={6}
                placeholder={schema.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            )}

            {schema.type === "number" && (
              <input
                type="number"
                value={getNumberValue(key)}
                onChange={(e) =>
                  handlePropertyChange(key, parseInt(e.target.value))
                }
                onBlur={saveNow}
                min={schema.min}
                max={schema.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {schema.type === "color" && (
              <div className="flex gap-2">
                <input
                  type="color"
                  value={getStringValue(key, "#000000")}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  onBlur={saveNow}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={getStringValue(key)}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  onBlur={saveNow}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {schema.type === "boolean" && (
              <button
                type="button"
                onClick={() => {
                  handlePropertyChange(key, !getBooleanValue(key));
                  saveNow();
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
                  getBooleanValue(key)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                <span className="text-sm font-medium">
                  {getBooleanValue(key) ? "Enabled" : "Disabled"}
                </span>
                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    getBooleanValue(key) ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      getBooleanValue(key) ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
            )}

            {schema.type === "select" && (
              <select
                value={getStringValue(key)}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                onBlur={saveNow}
                aria-label={schema.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {(schema.options ?? []).map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {schema.type === "image" && (
              <div className="space-y-2">
                <ImageUploadField
                  label={schema.label}
                  value={getStringValue(key)}
                  onChange={(value) => handlePropertyChange(key, value)}
                  onSave={saveNow}
                  placeholder="https://example.com/image.webp"
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
              </div>
            )}

            {schema.description && (
              <p className="mt-2 text-xs text-gray-500">{schema.description}</p>
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
