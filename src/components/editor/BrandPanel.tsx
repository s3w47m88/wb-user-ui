"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Save,
  Type,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { updateSite } from "@/lib/cms-service";
import {
  BRAND_FONT_OPTIONS,
  getSiteBrandSettings,
} from "@/lib/site-branding";
import {
  ACCEPTED_IMAGE_UPLOAD_INPUT,
  prepareAndUploadImage,
  sanitizeImageFileName,
} from "@/lib/image-upload";
import { BrandedSelect } from "@/components/ui/BrandedSelect";
import { SiteBrandReferenceImage } from "@/lib/supabase-content";

type BrandPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

type BrandDraft = {
  siteName: string;
  logoUrl: string;
  tagline: string;
  description: string;
  audience: string;
  voice: string;
  visualDirection: string;
  headingFont: string;
  bodyFont: string;
  referenceImages: SiteBrandReferenceImage[];
};

type BrandTab = "identity" | "assets" | "ai" | "type";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const buildDraft = (
  input: ReturnType<typeof getSiteBrandSettings>,
  siteName: string,
  logoUrl: string,
): BrandDraft => ({
  siteName,
  logoUrl,
  tagline: input.tagline,
  description: input.description,
  audience: input.audience,
  voice: input.voice,
  visualDirection: input.visual_direction,
  headingFont: input.fonts.heading,
  bodyFont: input.fonts.body,
  referenceImages: input.reference_images,
});

const IdentityField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows }) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {rows ? (
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
      />
    ) : (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
      />
    )}
  </label>
);

export const BrandPanel: React.FC<BrandPanelProps> = ({ isOpen, onClose }) => {
  const {
    currentPageId,
    site,
    siteId,
    setSite,
    updateTheme,
  } = useEditorStore();
  const [activeTab, setActiveTab] = useState<BrandTab>("identity");
  const [draft, setDraft] = useState<BrandDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingReferences, setIsUploadingReferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const siteBrand = useMemo(() => getSiteBrandSettings(site), [site]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(
      buildDraft(siteBrand, site?.name?.trim() || "", site?.logo_url?.trim() || ""),
    );
    setError(null);
  }, [isOpen, site, siteBrand]);

  if (!isOpen) {
    return null;
  }

  const updateDraft = (patch: Partial<BrandDraft>) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...patch,
      };
    });
  };

  const handleUploadLogo = async (file: File | null | undefined) => {
    if (!file || !siteId) {
      return;
    }

    setIsUploadingLogo(true);
    setError(null);

    try {
      const uploaded = await prepareAndUploadImage(file, {
        pageId: currentPageId,
        siteId,
      });
      updateDraft({ logoUrl: uploaded.url });
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      setIsUploadingLogo(false);
    }
  };

  const handleUploadReferences = async (files: FileList | null) => {
    if (!files?.length || !siteId || !draft) {
      return;
    }

    setIsUploadingReferences(true);
    setError(null);

    try {
      const uploadedImages: SiteBrandReferenceImage[] = [];

      for (const file of Array.from(files)) {
        const uploaded = await prepareAndUploadImage(file, {
          pageId: currentPageId,
          siteId,
        });

        uploadedImages.push({
          id: crypto.randomUUID(),
          url: uploaded.url,
          label: sanitizeImageFileName(file.name).replace(/-/g, " ") || null,
        });
      }

      updateDraft({
        referenceImages: [...draft.referenceImages, ...uploadedImages],
      });
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      if (referenceInputRef.current) {
        referenceInputRef.current.value = "";
      }
      setIsUploadingReferences(false);
    }
  };

  const handleSave = async () => {
    if (!siteId || !draft) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedSite = await updateSite(siteId, {
        name: draft.siteName.trim() || site?.name || "Untitled Site",
        business_name: draft.siteName.trim() || site?.business_name || null,
        logo_url: draft.logoUrl.trim() || null,
        brand_settings: {
          tagline: draft.tagline,
          description: draft.description,
          audience: draft.audience,
          voice: draft.voice,
          visual_direction: draft.visualDirection,
          fonts: {
            heading: draft.headingFont,
            body: draft.bodyFont,
          },
          reference_images: draft.referenceImages,
        },
      });

      setSite(updatedSite);
      updateTheme({
        fonts: {
          heading: draft.headingFont,
          body: draft.bodyFont,
        },
      });
      onClose();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: Array<{
    id: BrandTab;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
  }> = [
    { id: "identity", name: "Identity", icon: FileText },
    { id: "assets", name: "Assets", icon: ImageIcon },
    { id: "ai", name: "AI Context", icon: Wand2 },
    { id: "type", name: "Typography", icon: Type },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl">
        <div className="w-72 border-r border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Brand Kit</h2>
                <p className="text-sm text-gray-500">
                  Site-wide identity and AI context.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {!siteId || !draft ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
                Pick a site in CMS first, then brand settings live here.
              </div>
            ) : null}

            {siteId && draft && activeTab === "identity" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <IdentityField
                  label="Site Name"
                  value={draft.siteName}
                  onChange={(siteName) => updateDraft({ siteName })}
                  placeholder="Northwind Logistics"
                />
                <IdentityField
                  label="Tagline"
                  value={draft.tagline}
                  onChange={(tagline) => updateDraft({ tagline })}
                  placeholder="Ship with confidence"
                />
                <div className="md:col-span-2">
                  <IdentityField
                    label="Brand Description"
                    value={draft.description}
                    onChange={(description) => updateDraft({ description })}
                    rows={5}
                    placeholder="What this company does, what makes it different, and the feeling the visuals should carry."
                  />
                </div>
              </div>
            ) : null}

            {siteId && draft && activeTab === "assets" ? (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div className="space-y-3 rounded-3xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Logo
                        </h3>
                        <p className="text-sm text-gray-500">
                          Used by footer branding and AI image context.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUploadingLogo ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Upload size={16} />
                        )}
                        {isUploadingLogo ? "Uploading" : "Upload logo"}
                      </button>
                    </div>

                    <div
                      className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {draft.logoUrl ? (
                        <img
                          src={draft.logoUrl}
                          alt={`${draft.siteName || "Site"} logo`}
                          className="max-h-32 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-sm text-gray-500">
                          <Upload className="mx-auto mb-3" size={28} />
                          Drop or click to upload a logo
                        </div>
                      )}
                    </div>

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept={ACCEPTED_IMAGE_UPLOAD_INPUT}
                      className="hidden"
                      onChange={(event) => {
                        void handleUploadLogo(event.target.files?.[0]);
                      }}
                    />

                    <IdentityField
                      label="Logo URL"
                      value={draft.logoUrl}
                      onChange={(logoUrl) => updateDraft({ logoUrl })}
                      placeholder="https://example.com/logo.webp"
                    />
                  </div>

                  <div className="space-y-3 rounded-3xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Reference Photos
                        </h3>
                        <p className="text-sm text-gray-500">
                          Saved and pre-selected for AI image generation.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => referenceInputRef.current?.click()}
                        disabled={isUploadingReferences}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUploadingReferences ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Upload size={16} />
                        )}
                        {isUploadingReferences ? "Uploading" : "Add photos"}
                      </button>
                    </div>

                    <label className="flex min-h-[140px] cursor-pointer items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
                      <div>
                        <Upload className="mx-auto mb-3" size={28} />
                        Upload team photos, product shots, textures, spaces, or any visual references the AI should borrow from.
                      </div>
                      <input
                        ref={referenceInputRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_UPLOAD_INPUT}
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          void handleUploadReferences(event.target.files);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {draft.referenceImages.length ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {draft.referenceImages.map((image) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
                      >
                        <div className="aspect-[4/3] bg-gray-100">
                          <img
                            src={image.url}
                            alt={image.label || "Reference image"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-3 p-4">
                          <IdentityField
                            label="Label"
                            value={image.label || ""}
                            onChange={(label) =>
                              updateDraft({
                                referenceImages: draft.referenceImages.map((item) =>
                                  item.id === image.id ? { ...item, label } : item,
                                ),
                              })
                            }
                            placeholder="Warm warehouse lighting"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateDraft({
                                referenceImages: draft.referenceImages.filter(
                                  (item) => item.id !== image.id,
                                ),
                              })
                            }
                            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {siteId && draft && activeTab === "ai" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <IdentityField
                  label="Audience"
                  value={draft.audience}
                  onChange={(audience) => updateDraft({ audience })}
                  rows={4}
                  placeholder="Who this site speaks to."
                />
                <IdentityField
                  label="Voice and Tone"
                  value={draft.voice}
                  onChange={(voice) => updateDraft({ voice })}
                  rows={4}
                  placeholder="Direct, warm, premium, playful, technical..."
                />
                <div className="md:col-span-2">
                  <IdentityField
                    label="Visual Direction"
                    value={draft.visualDirection}
                    onChange={(visualDirection) => updateDraft({ visualDirection })}
                    rows={6}
                    placeholder="Describe lighting, composition, textures, mood, subjects, and any recurring visual rules for generated images."
                  />
                </div>
              </div>
            ) : null}

            {siteId && draft && activeTab === "type" ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="space-y-5 rounded-3xl border border-gray-200 p-5">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Heading Font
                    </span>
                    <BrandedSelect
                      value={draft.headingFont}
                      onChange={(event) =>
                        updateDraft({ headingFont: event.target.value })
                      }
                    >
                      {BRAND_FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </BrandedSelect>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Body Font
                    </span>
                    <BrandedSelect
                      value={draft.bodyFont}
                      onChange={(event) =>
                        updateDraft({ bodyFont: event.target.value })
                      }
                    >
                      {BRAND_FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </BrandedSelect>
                  </label>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                  <p
                    className="text-sm uppercase tracking-[0.24em] text-gray-500"
                    style={{ fontFamily: draft.bodyFont }}
                  >
                    Live Preview
                  </p>
                  <h3
                    className="mt-4 text-4xl font-bold text-gray-900"
                    style={{ fontFamily: draft.headingFont }}
                  >
                    {draft.siteName || "Your site headline"}
                  </h3>
                  <p
                    className="mt-3 text-lg text-gray-600"
                    style={{ fontFamily: draft.bodyFont }}
                  >
                    {draft.tagline || "Your tagline lands here."}
                  </p>
                  <p
                    className="mt-6 text-sm leading-7 text-gray-600"
                    style={{ fontFamily: draft.bodyFont }}
                  >
                    {draft.description ||
                      "Brand description preview. This copy also feeds AI image generation so the system understands the company, mood, and visual direction."}
                  </p>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
              Logo, site brief, and references also feed AI image generation.
            </p>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!siteId || !draft || isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSaving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? "Saving" : "Save Brand Kit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
