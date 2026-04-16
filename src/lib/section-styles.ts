export const SECTION_BACKGROUND_MODES = [
  { value: "inherit", label: "Use Block Default" },
  { value: "color", label: "Color" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
] as const;

export const SECTION_WIDTH_MODES = [
  { value: "full", label: "Full Width" },
  { value: "fixed", label: "Fixed Width" },
] as const;

export const SECTION_HEIGHT_MODES = [
  { value: "auto", label: "Auto" },
  { value: "custom", label: "Custom" },
] as const;

export const SECTION_GRADIENT_DIRECTIONS = [
  { value: "to right", label: "Left to Right" },
  { value: "to left", label: "Right to Left" },
  { value: "to bottom", label: "Top to Bottom" },
  { value: "to top", label: "Bottom to Top" },
  { value: "to bottom right", label: "Diagonal Down" },
  { value: "to top right", label: "Diagonal Up" },
] as const;

export const SECTION_BACKGROUND_SIZES = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "auto", label: "Auto" },
] as const;

export const SECTION_BACKGROUND_POSITIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
] as const;

export type SectionBackgroundMode =
  (typeof SECTION_BACKGROUND_MODES)[number]["value"];
export type SectionWidthMode = (typeof SECTION_WIDTH_MODES)[number]["value"];
export type SectionHeightMode = (typeof SECTION_HEIGHT_MODES)[number]["value"];
export type SectionGradientDirection =
  (typeof SECTION_GRADIENT_DIRECTIONS)[number]["value"];
export type SectionBackgroundSize =
  (typeof SECTION_BACKGROUND_SIZES)[number]["value"];
export type SectionBackgroundPosition =
  (typeof SECTION_BACKGROUND_POSITIONS)[number]["value"];

export type SectionStyleConfig = {
  widthMode: SectionWidthMode;
  maxWidth: string;
  padding: string;
  marginTop: string;
  marginBottom: string;
  heightMode: SectionHeightMode;
  customHeight: string;
  backgroundMode: SectionBackgroundMode;
  backgroundColor: string;
  backgroundOpacity: number;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: SectionGradientDirection;
  backgroundImage: string;
  backgroundSize: SectionBackgroundSize;
  backgroundPosition: SectionBackgroundPosition;
};

type SectionBackgroundFallback = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
};

const VALID_BACKGROUND_MODES = new Set<SectionBackgroundMode>(
  SECTION_BACKGROUND_MODES.map(({ value }) => value),
);
const VALID_WIDTH_MODES = new Set<SectionWidthMode>(
  SECTION_WIDTH_MODES.map(({ value }) => value),
);
const VALID_HEIGHT_MODES = new Set<SectionHeightMode>(
  SECTION_HEIGHT_MODES.map(({ value }) => value),
);
const VALID_GRADIENT_DIRECTIONS = new Set<SectionGradientDirection>(
  SECTION_GRADIENT_DIRECTIONS.map(({ value }) => value),
);
const VALID_BACKGROUND_SIZES = new Set<SectionBackgroundSize>(
  SECTION_BACKGROUND_SIZES.map(({ value }) => value),
);
const VALID_BACKGROUND_POSITIONS = new Set<SectionBackgroundPosition>(
  SECTION_BACKGROUND_POSITIONS.map(({ value }) => value),
);

export const defaultSectionStyleConfig: SectionStyleConfig = {
  widthMode: "full",
  maxWidth: "1280px",
  padding: "",
  marginTop: "",
  marginBottom: "",
  heightMode: "auto",
  customHeight: "",
  backgroundMode: "inherit",
  backgroundColor: "#111827",
  backgroundOpacity: 100,
  gradientFrom: "#111827",
  gradientTo: "#374151",
  gradientDirection: "to right",
  backgroundImage: "",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function clampOpacity(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.min(100, Math.max(0, parsed));
    }
  }

  return defaultSectionStyleConfig.backgroundOpacity;
}

function getStringValue(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function getEnumValue<T extends string>(
  value: unknown,
  validValues: Set<T>,
  fallback: T,
) {
  return typeof value === "string" && validValues.has(value as T)
    ? (value as T)
    : fallback;
}

type HexColor = {
  red: number;
  green: number;
  blue: number;
};

function parseHexColor(value: string): HexColor | null {
  const normalized = value.trim().replace("#", "");
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized)) {
    return null;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((digit) => `${digit}${digit}`)
          .join("")
      : normalized;

  return {
    red: Number.parseInt(expanded.slice(0, 2), 16),
    green: Number.parseInt(expanded.slice(2, 4), 16),
    blue: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

export function withOpacity(color: string, opacity: number) {
  const parsed = parseHexColor(color);
  if (!parsed) {
    return color;
  }

  const alpha = Math.min(100, Math.max(0, opacity)) / 100;
  return `rgba(${parsed.red}, ${parsed.green}, ${parsed.blue}, ${alpha})`;
}

export function getSectionStyleConfig(
  props: Record<string, unknown>,
): SectionStyleConfig {
  const rawValue = props.sectionStyle;
  const rawConfig =
    rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? (rawValue as Record<string, unknown>)
      : {};

  return {
    widthMode: getEnumValue(
      rawConfig.widthMode,
      VALID_WIDTH_MODES,
      defaultSectionStyleConfig.widthMode,
    ),
    maxWidth: getStringValue(
      rawConfig.maxWidth,
      defaultSectionStyleConfig.maxWidth,
    ),
    padding: getStringValue(
      rawConfig.padding,
      defaultSectionStyleConfig.padding,
    ),
    marginTop: getStringValue(
      rawConfig.marginTop,
      defaultSectionStyleConfig.marginTop,
    ),
    marginBottom: getStringValue(
      rawConfig.marginBottom,
      defaultSectionStyleConfig.marginBottom,
    ),
    heightMode: getEnumValue(
      rawConfig.heightMode,
      VALID_HEIGHT_MODES,
      defaultSectionStyleConfig.heightMode,
    ),
    customHeight: getStringValue(
      rawConfig.customHeight,
      defaultSectionStyleConfig.customHeight,
    ),
    backgroundMode: getEnumValue(
      rawConfig.backgroundMode,
      VALID_BACKGROUND_MODES,
      defaultSectionStyleConfig.backgroundMode,
    ),
    backgroundColor: getStringValue(
      rawConfig.backgroundColor,
      defaultSectionStyleConfig.backgroundColor,
    ),
    backgroundOpacity: clampOpacity(rawConfig.backgroundOpacity),
    gradientFrom: getStringValue(
      rawConfig.gradientFrom,
      defaultSectionStyleConfig.gradientFrom,
    ),
    gradientTo: getStringValue(
      rawConfig.gradientTo,
      defaultSectionStyleConfig.gradientTo,
    ),
    gradientDirection: getEnumValue(
      rawConfig.gradientDirection,
      VALID_GRADIENT_DIRECTIONS,
      defaultSectionStyleConfig.gradientDirection,
    ),
    backgroundImage: getStringValue(
      rawConfig.backgroundImage,
      defaultSectionStyleConfig.backgroundImage,
    ),
    backgroundSize: getEnumValue(
      rawConfig.backgroundSize,
      VALID_BACKGROUND_SIZES,
      defaultSectionStyleConfig.backgroundSize,
    ),
    backgroundPosition: getEnumValue(
      rawConfig.backgroundPosition,
      VALID_BACKGROUND_POSITIONS,
      defaultSectionStyleConfig.backgroundPosition,
    ),
  };
}

export function buildSectionContainerStyle(
  config: SectionStyleConfig,
  defaultMinHeight?: string,
) {
  const style: Record<string, string> = {};

  if (config.padding.trim()) {
    style.padding = config.padding.trim();
  }

  if (config.marginTop.trim()) {
    style.marginTop = config.marginTop.trim();
  }

  if (config.marginBottom.trim()) {
    style.marginBottom = config.marginBottom.trim();
  }

  if (config.widthMode === "fixed") {
    style.width = "100%";
    style.maxWidth =
      config.maxWidth.trim() || defaultSectionStyleConfig.maxWidth;
    style.marginLeft = "auto";
    style.marginRight = "auto";
  }

  if (config.heightMode === "custom" && config.customHeight.trim()) {
    style.minHeight = config.customHeight.trim();
  } else if (defaultMinHeight) {
    style.minHeight = defaultMinHeight;
  }

  return style;
}

export function buildSectionBackgroundStyle(
  config: SectionStyleConfig,
  fallback: SectionBackgroundFallback = {},
) {
  if (config.backgroundMode === "inherit") {
    return fallback;
  }

  if (config.backgroundMode === "color") {
    return {
      backgroundColor: withOpacity(
        config.backgroundColor,
        config.backgroundOpacity,
      ),
      backgroundImage: "none",
    };
  }

  if (config.backgroundMode === "gradient") {
    return {
      backgroundColor: "transparent",
      backgroundImage: `linear-gradient(${config.gradientDirection}, ${withOpacity(
        config.gradientFrom,
        config.backgroundOpacity,
      )}, ${withOpacity(config.gradientTo, config.backgroundOpacity)})`,
    };
  }

  const imageUrl = config.backgroundImage.trim();
  if (!imageUrl) {
    return fallback;
  }

  const overlay = withOpacity(config.backgroundColor, config.backgroundOpacity);
  return {
    backgroundColor: config.backgroundColor,
    backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${imageUrl})`,
    backgroundSize: config.backgroundSize,
    backgroundPosition: config.backgroundPosition,
    backgroundRepeat: "no-repeat",
  };
}
