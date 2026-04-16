"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, LoaderCircle, Upload } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import {
  ACCEPTED_IMAGE_UPLOAD_INPUT,
  prepareAndUploadImage,
} from "@/lib/image-upload";

type ImageUploadFieldProps = {
  label: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  placeholder?: string;
  value: string;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Image upload failed.";

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onChange,
  onSave,
  placeholder = "https://example.com/image.webp",
  value,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentPageId, siteId } = useEditorStore();

  const handleUpload = async (file: File | null | undefined) => {
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

      onChange(uploadedImage.url);
      onSave?.();
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        className={`rounded-xl border border-dashed p-4 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50/70"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (
            event.currentTarget.contains(event.relatedTarget as Node | null)
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
          setIsDragging(false);
          void handleUpload(event.dataTransfer.files?.[0]);
        }}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-gray-500 shadow-sm">
            {isUploading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Drag image here or click upload
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, WEBP, GIF, or AVIF. Images are resized and converted to
              WebP automatically.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={15} />
              {isUploading ? "Uploading..." : "Upload image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_UPLOAD_INPUT}
              className="hidden"
              onChange={(event) => {
                void handleUpload(event.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </div>

      <input
        type="text"
        value={value}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
        }}
        onBlur={onSave}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />

      {value && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <div className="aspect-video bg-gray-100">
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
            <ImageIcon size={14} />
            Live preview
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
