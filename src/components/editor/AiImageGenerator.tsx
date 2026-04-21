"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Wand2 } from "lucide-react";
import {
  AI_IMAGE_PROVIDERS,
  AiImageProvider,
} from "@/lib/ai-image-provider";
import { generateImage } from "@/lib/image-generation";
import { useEditorStore } from "@/store/editor-store";
import { getSiteBrandSettings } from "@/lib/site-branding";

type AiImageGeneratorProps = {
  onImageGenerated?: (url: string) => void;
  onUseImage?: (url: string) => void;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Failed to generate image.";

export const AiImageGenerator: React.FC<AiImageGeneratorProps> = ({
  onImageGenerated,
  onUseImage,
}) => {
  const [provider, setProvider] = useState<AiImageProvider>("openai");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentPageId, site, siteId, theme } = useEditorStore();
  const siteBrand = useMemo(() => getSiteBrandSettings(site), [site]);
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    setSelectedReferenceIds(
      siteBrand.reference_images.map((image) => image.id),
    );
  }, [siteBrand.reference_images]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage({
        prompt: prompt.trim(),
        pageId: currentPageId,
        provider,
        referenceImageIds: selectedReferenceIds,
        siteId,
        theme,
      });

      setGeneratedImage(imageUrl);
      onImageGenerated?.(imageUrl);
    } catch (generationError) {
      setGeneratedImage(null);
      setError(getErrorMessage(generationError));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {site ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Brand Context
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            {site.name || "Untitled Site"}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {siteBrand.tagline || "No tagline saved yet."}
          </p>
          {siteBrand.description ? (
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {siteBrand.description}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-gray-500">
            Saved site brief, fonts, theme colors, logo, and selected reference photos are added to the generation request automatically.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Provider</p>
        <div className="grid grid-cols-2 gap-2">
          {AI_IMAGE_PROVIDERS.map((providerOption) => {
            const isSelected = provider === providerOption.id;

            return (
              <button
                key={providerOption.id}
                type="button"
                onClick={() => {
                  setError(null);
                  setGeneratedImage(null);
                  setProvider(providerOption.id);
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {providerOption.label}
              </button>
            );
          })}
        </div>
      </div>

      {siteBrand.reference_images.length ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Reference Photos
              </p>
              <p className="text-xs text-gray-500">
                Selected references are used by default. Turn off anything not needed for this image.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedReferenceIds(
                  selectedReferenceIds.length
                    ? []
                    : siteBrand.reference_images.map((image) => image.id),
                )
              }
              className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {selectedReferenceIds.length ? "Clear All" : "Use All"}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {siteBrand.reference_images.map((image) => {
              const isSelected = selectedReferenceIds.includes(image.id);

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedReferenceIds((current) =>
                      current.includes(image.id)
                        ? current.filter((id) => id !== image.id)
                        : [...current, image.id],
                    )
                  }
                  className={`overflow-hidden rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-blue-600 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-[4/3] bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.label || "Reference image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {image.label || "Reference image"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isSelected ? "Included in prompt" : "Not used"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        isSelected
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isSelected ? "On" : "Off"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Describe the image you want to generate
        </label>
        <textarea
          value={prompt}
          onChange={(event) => {
            setError(null);
            setGeneratedImage(null);
            setPrompt(event.target.value);
          }}
          placeholder="A dramatic hero image for a modern SaaS landing page, cinematic lighting, crisp details..."
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          void handleGenerate();
        }}
        disabled={isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isGenerating ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Wand2 size={18} />
        )}
        {isGenerating ? "Generating..." : `Generate with ${provider === "openai" ? "OpenAI" : "Grok"}`}
      </button>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {generatedImage ? (
        <div className="space-y-3">
          <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img
              src={generatedImage}
              alt="Generated"
              className="h-full w-full object-contain"
            />
          </div>

          {onUseImage ? (
            <button
              type="button"
              onClick={() => onUseImage(generatedImage)}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700"
            >
              Use This Image
            </button>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Generated image saved to storage. Apply it to use this image.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
