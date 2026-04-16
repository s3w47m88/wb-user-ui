"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link as LinkIcon, LoaderCircle, Upload, Wand2, X } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import {
  ACCEPTED_IMAGE_UPLOAD_INPUT,
  prepareAndUploadImage,
} from "@/lib/image-upload";

type ImageUploaderProps = {
  currentImageUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (url: string) => void;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Image upload failed.";

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  isOpen,
  onClose,
  onImageSelected,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "ai">("upload");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentPageId, siteId } = useEditorStore();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextUrl = currentImageUrl || "";
    setActiveTab(nextUrl ? "url" : "upload");
    setError(null);
    setImageUrl(nextUrl);
    setIsDragging(false);
    setIsUploading(false);
    setPreviewUrl(nextUrl);
  }, [currentImageUrl, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFileUpload = async (file: File | null | undefined) => {
    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const uploadedImage = await prepareAndUploadImage(file, {
        pageId: currentPageId,
        siteId,
      });

      setActiveTab("upload");
      setImageUrl(uploadedImage.url);
      setPreviewUrl(uploadedImage.url);
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsDragging(false);
      setIsUploading(false);
    }
  };

  const handleApply = () => {
    if (!previewUrl) {
      setError("Choose or paste an image first.");
      return;
    }

    onImageSelected(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Upload className="mr-2 inline" size={16} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === "url"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <LinkIcon className="mr-2 inline" size={16} />
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === "ai"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Wand2 className="mr-2 inline" size={16} />
              Generate with AI
            </button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  if (
                    event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  ) {
                    return;
                  }

                  setIsDragging(false);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  void handleFileUpload(event.dataTransfer.files?.[0]);
                }}
              >
                {isUploading ? (
                  <LoaderCircle
                    className="mx-auto mb-4 animate-spin text-blue-600"
                    size={48}
                  />
                ) : (
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                )}
                <p className="mb-2 text-lg font-medium">
                  Click to upload or drag from desktop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP, GIF, or AVIF up to 10MB
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Images are resized and converted to WebP automatically.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_UPLOAD_INPUT}
                onChange={(event) => {
                  void handleFileUpload(event.target.files?.[0]);
                }}
                className="hidden"
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => {
                    setError(null);
                    setImageUrl(event.target.value);
                  }}
                  placeholder="https://example.com/image.webp"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!imageUrl.trim()) {
                    setError("Paste an image URL first.");
                    return;
                  }

                  setError(null);
                  setPreviewUrl(imageUrl.trim());
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Preview Image
              </button>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  AI image generation is available in the property panel. Use
                  the generate button there to create custom images from text
                  prompts.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Generated images can still be applied here after they have a
                real URL.
              </p>
            </div>
          )}

          {previewUrl && (
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={() => {
                    setError("Could not load preview. Check the image source.");
                    setPreviewUrl("");
                  }}
                />
              </div>
              {activeTab === "upload" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    Image uploaded and optimized. Apply it to save this image to
                    the block.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!previewUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Apply Image
          </button>
        </div>
      </div>
    </div>
  );
};
