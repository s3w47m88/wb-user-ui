"use client";

import React from "react";
import {
  Image as ImageIcon,
  LayoutTemplate,
  Paintbrush,
  RotateCcw,
  X,
} from "lucide-react";
import {
  defaultSectionStyleConfig,
  SECTION_BACKGROUND_MODES,
  SECTION_BACKGROUND_POSITIONS,
  SECTION_BACKGROUND_SIZES,
  SECTION_GRADIENT_DIRECTIONS,
  SECTION_HEIGHT_MODES,
  SECTION_HERO_EFFECTS,
  SectionStyleConfig,
  SECTION_WIDTH_MODES,
} from "@/lib/section-styles";
import { ImageUploadField } from "./ImageUploadField";
import { BrandedSelect } from "@/components/ui/BrandedSelect";

type SectionSettingsPanelProps = {
  value: SectionStyleConfig;
  onChange: (nextValue: SectionStyleConfig) => void;
  onClose: () => void;
  onSave: () => void;
};

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
};

const ColorField: React.FC<ColorFieldProps> = ({
  label,
  value,
  onChange,
  onSave,
}) => {
  const swatchValue = /^#(?:[0-9a-f]{3}){1,2}$/i.test(value)
    ? value
    : "#000000";

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={swatchValue}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onSave}
          className="h-10 w-12 rounded border border-gray-300 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onSave}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export const SectionSettingsPanel: React.FC<SectionSettingsPanelProps> = ({
  value,
  onChange,
  onClose,
  onSave,
}) => {
  const setBackgroundMode = (
    nextMode: "inherit" | "color" | "gradient" | "image",
  ) => {
    const nextValue: SectionStyleConfig = {
      ...value,
      backgroundMode: nextMode,
    };

    // Image mode should default to showing the uploaded asset, not a solid overlay.
    if (nextMode === "image" && value.backgroundOpacity === 100) {
      nextValue.backgroundOpacity = 0;
    }

    onChange(nextValue);
  };

  const updateField = <K extends keyof SectionStyleConfig>(
    key: K,
    fieldValue: SectionStyleConfig[K],
  ) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  const handleReset = () => {
    onChange(defaultSectionStyleConfig);
    onSave();
  };

  return (
    <div
      className="absolute left-16 top-4 z-[60] w-[24rem] max-w-[calc(100vw-5rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Section Settings
          </h3>
          <p className="text-xs text-gray-500">
            Background, spacing, width, and height.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Reset section settings"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              onSave();
              onClose();
            }}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Close section settings"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[32rem] space-y-5 overflow-y-auto px-4 py-4">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <LayoutTemplate size={16} />
            Layout
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Width
              </label>
              <BrandedSelect
                value={value.widthMode}
                onChange={(event) =>
                  updateField(
                    "widthMode",
                    event.target.value as "full" | "fixed",
                  )
                }
                onBlur={onSave}
                chromeSize="sm"
              >
                {SECTION_WIDTH_MODES.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </BrandedSelect>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Height
              </label>
              <BrandedSelect
                value={value.heightMode}
                onChange={(event) =>
                  updateField(
                    "heightMode",
                    event.target.value as "auto" | "custom",
                  )
                }
                onBlur={onSave}
                chromeSize="sm"
              >
                {SECTION_HEIGHT_MODES.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </BrandedSelect>
            </div>
          </div>

          {value.widthMode === "fixed" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Width
              </label>
              <input
                type="text"
                value={value.maxWidth}
                onChange={(event) =>
                  updateField("maxWidth", event.target.value)
                }
                onBlur={onSave}
                placeholder="1280px"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {value.heightMode === "custom" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Height Value
              </label>
              <input
                type="text"
                value={value.customHeight}
                onChange={(event) =>
                  updateField("customHeight", event.target.value)
                }
                onBlur={onSave}
                placeholder="640px"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Paintbrush size={16} />
            Spacing
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Padding
            </label>
            <input
              type="text"
              value={value.padding}
              onChange={(event) => updateField("padding", event.target.value)}
              onBlur={onSave}
              placeholder="4rem 1.5rem"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Margin Top
              </label>
              <input
                type="text"
                value={value.marginTop}
                onChange={(event) =>
                  updateField("marginTop", event.target.value)
                }
                onBlur={onSave}
                placeholder="2rem"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Margin Bottom
              </label>
              <input
                type="text"
                value={value.marginBottom}
                onChange={(event) =>
                  updateField("marginBottom", event.target.value)
                }
                onBlur={onSave}
                placeholder="2rem"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <ImageIcon size={16} />
            Background
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Background Type
            </label>
            <BrandedSelect
              value={value.backgroundMode}
              onChange={(event) =>
                setBackgroundMode(
                  event.target.value as
                    | "inherit"
                    | "color"
                    | "gradient"
                    | "image",
                )
              }
              onBlur={onSave}
              chromeSize="sm"
            >
              {SECTION_BACKGROUND_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </BrandedSelect>
          </div>

          {value.backgroundMode !== "inherit" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {value.backgroundMode === "image"
                  ? "Overlay Strength"
                  : "Transparency"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value.backgroundOpacity}
                  onChange={(event) =>
                    updateField(
                      "backgroundOpacity",
                      Number.parseInt(event.target.value, 10),
                    )
                  }
                  onMouseUp={onSave}
                  onTouchEnd={onSave}
                  className="flex-1"
                />
                <span className="w-12 text-right text-sm text-gray-500">
                  {value.backgroundOpacity}%
                </span>
              </div>
            </div>
          )}

          {value.backgroundMode === "color" && (
            <ColorField
              label="Background Color"
              value={value.backgroundColor}
              onChange={(fieldValue) =>
                updateField("backgroundColor", fieldValue)
              }
              onSave={onSave}
            />
          )}

          {value.backgroundMode === "gradient" && (
            <>
              <ColorField
                label="Gradient From"
                value={value.gradientFrom}
                onChange={(fieldValue) =>
                  updateField("gradientFrom", fieldValue)
                }
                onSave={onSave}
              />
              <ColorField
                label="Gradient To"
                value={value.gradientTo}
                onChange={(fieldValue) => updateField("gradientTo", fieldValue)}
                onSave={onSave}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Direction
                </label>
                <BrandedSelect
                  value={value.gradientDirection}
                  onChange={(event) =>
                    updateField(
                      "gradientDirection",
                      event.target.value as
                        | "to right"
                        | "to left"
                        | "to bottom"
                        | "to top"
                        | "to bottom right"
                        | "to top right",
                    )
                  }
                  onBlur={onSave}
                  chromeSize="sm"
                >
                  {SECTION_GRADIENT_DIRECTIONS.map((direction) => (
                    <option key={direction.value} value={direction.value}>
                      {direction.label}
                    </option>
                  ))}
                </BrandedSelect>
              </div>
            </>
          )}

          {value.backgroundMode === "image" && (
            <>
              <ImageUploadField
                label="Background Image"
                value={value.backgroundImage}
                onChange={(fieldValue) =>
                  onChange({
                    ...value,
                    backgroundImage: fieldValue,
                    backgroundOpacity:
                      value.backgroundOpacity === 100
                        ? 0
                        : value.backgroundOpacity,
                  })
                }
                onSave={onSave}
                placeholder="https://example.com/hero.webp"
              />

              <ColorField
                label="Overlay Color"
                value={value.backgroundColor}
                onChange={(fieldValue) =>
                  updateField("backgroundColor", fieldValue)
                }
                onSave={onSave}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <BrandedSelect
                    value={value.backgroundSize}
                    onChange={(event) =>
                      updateField(
                        "backgroundSize",
                        event.target.value as "cover" | "contain" | "auto",
                      )
                    }
                    onBlur={onSave}
                    chromeSize="sm"
                  >
                    {SECTION_BACKGROUND_SIZES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </BrandedSelect>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <BrandedSelect
                    value={value.backgroundPosition}
                    onChange={(event) =>
                      updateField(
                        "backgroundPosition",
                        event.target.value as
                          | "center"
                          | "top"
                          | "bottom"
                          | "left"
                          | "right",
                      )
                    }
                    onBlur={onSave}
                    chromeSize="sm"
                  >
                    {SECTION_BACKGROUND_POSITIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </BrandedSelect>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Hero Effect
                </label>
                <BrandedSelect
                  value={value.heroEffect}
                  onChange={(event) =>
                    updateField(
                      "heroEffect",
                      event.target.value as
                        | "none"
                        | "darken"
                        | "blur"
                        | "pulse"
                        | "cinematic",
                    )
                  }
                  onBlur={onSave}
                  chromeSize="sm"
                >
                  {SECTION_HERO_EFFECTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </BrandedSelect>
                <p className="mt-2 text-xs text-gray-500">
                  Only hero sections use this. Choose no effect to show the raw
                  background image.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
