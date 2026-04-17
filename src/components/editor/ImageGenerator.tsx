"use client";

import React from "react";
import { X } from "lucide-react";
import { AiImageGenerator } from "./AiImageGenerator";

type ImageGeneratorProps = {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (url: string) => void;
};

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  isOpen,
  onClose,
  onImageGenerated,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Generate Image with AI</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <AiImageGenerator
            onUseImage={(url) => {
              onImageGenerated(url);
              handleClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
