import { ComponentData, PageConfig, ThemeConfig } from "./supabase-content";

export const BUILDER_PAGE_MARKER = true;
export const BUILDER_PAGE_VERSION = 1;
export const BUILDER_PAGE_SLUG = "home";

type BuilderPagePayload = {
  __wb_builder: true;
  version: number;
  name: string;
  components: ComponentData[];
  theme: ThemeConfig;
  siteDomain: string | null;
  useTemporaryDomain: boolean;
};

export type LegacyPageRecord = {
  id: number | string;
  title: string | null;
  slug: string | null;
  content: string | null;
  site_id: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type LegacySiteRecord = {
  id: string;
  org_id?: string | null;
  slug?: string | null;
  name?: string | null;
  domain?: string | null;
};

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#ffffff",
    text: "#1f2937",
    accent: "#f59e0b",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  mode: "light",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value?: string | null): value is string {
  return Boolean(value && value !== "undefined" && uuidPattern.test(value));
}

export function normalizePageId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed) || uuidPattern.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function toDatabasePageId(value: string) {
  return /^\d+$/.test(value) ? Number(value) : value;
}

export function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return slug || `page-${Date.now().toString(36)}`;
}

function normalizeTheme(theme?: Partial<ThemeConfig> | null): ThemeConfig {
  return {
    colors: {
      ...defaultTheme.colors,
      ...(theme?.colors || {}),
    },
    fonts: {
      ...defaultTheme.fonts,
      ...(theme?.fonts || {}),
    },
    mode: theme?.mode === "dark" ? "dark" : "light",
  };
}

function normalizeComponents(components?: ComponentData[] | null) {
  return Array.isArray(components) ? components : [];
}

export function serializeBuilderPagePayload(input: {
  name: string;
  components?: ComponentData[] | null;
  theme?: Partial<ThemeConfig> | null;
  siteDomain?: string | null;
  useTemporaryDomain?: boolean;
}) {
  const payload: BuilderPagePayload = {
    __wb_builder: BUILDER_PAGE_MARKER,
    version: BUILDER_PAGE_VERSION,
    name: input.name.trim() || "Untitled Page",
    components: normalizeComponents(input.components),
    theme: normalizeTheme(input.theme),
    siteDomain: input.siteDomain?.trim() || null,
    useTemporaryDomain:
      input.useTemporaryDomain ??
      !(input.siteDomain && input.siteDomain.trim()),
  };

  return JSON.stringify(payload);
}

export function parseBuilderPagePayload(content: string | null | undefined) {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as Partial<BuilderPagePayload> | null;
    if (!parsed || parsed.__wb_builder !== BUILDER_PAGE_MARKER) {
      return null;
    }

    return {
      __wb_builder: BUILDER_PAGE_MARKER,
      version:
        typeof parsed.version === "number"
          ? parsed.version
          : BUILDER_PAGE_VERSION,
      name:
        typeof parsed.name === "string" && parsed.name.trim()
          ? parsed.name.trim()
          : "Untitled Page",
      components: normalizeComponents(parsed.components),
      theme: normalizeTheme(parsed.theme),
      siteDomain:
        typeof parsed.siteDomain === "string" && parsed.siteDomain.trim()
          ? parsed.siteDomain.trim()
          : null,
      useTemporaryDomain:
        typeof parsed.useTemporaryDomain === "boolean"
          ? parsed.useTemporaryDomain
          : !(
              typeof parsed.siteDomain === "string" && parsed.siteDomain.trim()
            ),
    };
  } catch {
    return null;
  }
}

export function mapLegacyPageToPageConfig(
  page: LegacyPageRecord,
  site?: LegacySiteRecord | null,
): PageConfig | null {
  const id = normalizePageId(page.id);
  const payload = parseBuilderPagePayload(page.content);

  if (!id || !payload) {
    return null;
  }

  return {
    id,
    site_id: page.site_id || site?.id || undefined,
    name: payload.name || site?.name || page.title || "Untitled Page",
    title: page.title || payload.name,
    slug: page.slug || BUILDER_PAGE_SLUG,
    components: payload.components,
    theme: payload.theme,
    site_domain: site?.domain ?? payload.siteDomain,
    use_temporary_domain:
      typeof site?.domain === "string" && site.domain.trim()
        ? false
        : payload.useTemporaryDomain,
    created_at: page.created_at || undefined,
    updated_at: page.updated_at || undefined,
  };
}
