'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Wand2 } from 'lucide-react';

type ImageUploaderProps = {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (url: string) => void;
  currentImageUrl?: string;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isOpen,
  onClose,
  onImageSelected,
  currentImageUrl,
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'ai'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Calculate new dimensions (max 1920x1080)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1080;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with quality 0.85
          canvas.toBlob(
            (blob) => {
              if (!blob) return;

              // Create object URL for preview
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
              setImageUrl(url);
              setIsProcessing(false);
            },
            'image/webp',
            0.85
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setPreviewUrl(imageUrl);
    }
  };

  const handleApply = () => {
    if (previewUrl) {
      onImageSelected(previewUrl);
      onClose();
    }
  };

  const handleClose = () => {
    setImageUrl('');
    setPreviewUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Upload Image</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="inline mr-2" size={16} />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'url'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="inline mr-2" size={16} />
              Image URL
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'ai'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wand2 className="inline mr-2" size={16} />
              Generate with AI
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg font-medium mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Images will be automatically resized and converted to WebP for optimal performance
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  <span className="ml-3 text-gray-600">Processing image...</span>
                </div>
              )}

              {previewUrl && !isProcessing && (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✓ Image optimized: Resized to fit 1920x1080 and converted to WebP format
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleUrlSubmit}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview Image
              </button>

              {previewUrl && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => {
                      alert('Failed to load image. Please check the URL.');
                      setPreviewUrl('');
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🚀 AI image generation is available! Click the "Generate with AI" button in the property panel to create custom images using text prompts.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                This feature uses Stable Diffusion to generate high-quality images based on your descriptions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Apply Image
          </button>
        </div>
      </div>
    </div>
  );
};
