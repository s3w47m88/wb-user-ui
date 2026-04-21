import {
  SiteBrandReferenceImage,
  SiteBrandSettings,
  SiteConfig,
  ThemeConfig,
} from "./supabase-content";

export const BRAND_FONT_OPTIONS = [
  "Inter",
  "Manrope",
  "Outfit",
  "Space Grotesk",
  "IBM Plex Sans",
  "Merriweather",
  "Source Serif 4",
  "Playfair Display",
  "DM Serif Display",
  "Nunito Sans",
] as const;

const DEFAULT_FONT = "Inter";

export const defaultSiteBrandSettings: SiteBrandSettings = {
  tagline: "",
  description: "",
  audience: "",
  voice: "",
  visual_direction: "",
  fonts: {
    heading: DEFAULT_FONT,
    body: DEFAULT_FONT,
  },
  reference_images: [],
};

const sanitizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export function normalizeSiteBrandReferenceImages(
  value: unknown,
): SiteBrandReferenceImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<SiteBrandReferenceImage[]>((images, item, index) => {
      if (typeof item !== "object" || item === null) {
        return images;
      }

      const url =
        "url" in item && typeof item.url === "string" ? item.url.trim() : "";

      if (!url) {
        return images;
      }

      const id =
        "id" in item && typeof item.id === "string" && item.id.trim()
          ? item.id.trim()
          : `reference-${index + 1}`;

      const label =
        "label" in item && typeof item.label === "string"
          ? item.label.trim()
          : "";

      images.push({
        id,
        url,
        label: label || null,
      });

      return images;
    }, []);
}

export function normalizeSiteBrandSettings(
  value?: Partial<SiteBrandSettings> | null,
): SiteBrandSettings {
  return {
    tagline: sanitizeText(value?.tagline),
    description: sanitizeText(value?.description),
    audience: sanitizeText(value?.audience),
    voice: sanitizeText(value?.voice),
    visual_direction: sanitizeText(value?.visual_direction),
    fonts: {
      heading: sanitizeText(value?.fonts?.heading) || DEFAULT_FONT,
      body: sanitizeText(value?.fonts?.body) || DEFAULT_FONT,
    },
    reference_images: normalizeSiteBrandReferenceImages(
      value?.reference_images,
    ),
  };
}

export function getSiteBrandSettings(site?: SiteConfig | null) {
  return normalizeSiteBrandSettings(site?.brand_settings ?? null);
}

export function buildSiteBrandContext(
  site?: SiteConfig | null,
  theme?: ThemeConfig | null,
) {
  const brand = getSiteBrandSettings(site);
  const lines = [
    site?.name?.trim() ? `Site name: ${site.name.trim()}` : null,
    brand.tagline ? `Tagline: ${brand.tagline}` : null,
    brand.description ? `Brand description: ${brand.description}` : null,
    brand.audience ? `Audience: ${brand.audience}` : null,
    brand.voice ? `Voice and tone: ${brand.voice}` : null,
    brand.visual_direction
      ? `Visual direction: ${brand.visual_direction}`
      : null,
    site?.logo_url?.trim() ? `Logo reference: ${site.logo_url.trim()}` : null,
    theme
      ? `Theme colors: primary ${theme.colors.primary}, secondary ${theme.colors.secondary}, accent ${theme.colors.accent}, background ${theme.colors.background}, text ${theme.colors.text}.`
      : null,
    theme
      ? `Theme fonts: heading ${theme.fonts.heading}, body ${theme.fonts.body}.`
      : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n");
}

export function buildImageGenerationPrompt(input: {
  prompt: string;
  site?: SiteConfig | null;
  theme?: ThemeConfig | null;
}) {
  const brandContext = buildSiteBrandContext(input.site, input.theme);

  if (!brandContext) {
    return input.prompt.trim();
  }

  return [
    "Use this site brand context when generating the image.",
    brandContext,
    `Requested image: ${input.prompt.trim()}`,
  ].join("\n\n");
}
