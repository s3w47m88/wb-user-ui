import {
  ComponentData,
  DocumentType,
  PageConfig,
  PostConfig,
  SiteConfig,
  ThemeConfig,
} from "./supabase-content";

export const BUILDER_PAGE_MARKER = true;
export const BUILDER_PAGE_VERSION = 2;
export const BUILDER_PAGE_SLUG = "home";
export const BUILDER_BLOG_SLUG = "blog";

type BuilderDocumentPayload = {
  __wb_builder: true;
  version: number;
  kind: DocumentType;
  name: string;
  components: ComponentData[];
  theme: ThemeConfig;
  siteDomain: string | null;
  useTemporaryDomain: boolean;
  editor?: {
    isBlogIndex?: boolean;
  };
};

export type LegacyPageRecord = {
  id: number | string;
  title: string | null;
  slug: string | null;
  content: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_image_url?: string | null;
  status?: string | null;
  intro_text?: string | null;
  comparison_content?: string | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  cta_title?: string | null;
  cta_text?: string | null;
  cta_button_text?: string | null;
  cta_button_link?: string | null;
  features_section_title?: string | null;
  products_section_title?: string | null;
  site_id: string | null;
  excerpt?: string | null;
};

export type LegacyPostRecord = {
  id: number | string;
  title: string | null;
  slug: string | null;
  menu_title?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  author?: string | null;
  published_date?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  excerpt?: string | null;
  content: string | null;
  featured_image_url?: string | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  site_id: string | null;
};

export type LegacySiteRecord = SiteConfig;

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

export function ensureUniqueSlug(baseSlug: string, takenSlugs: Iterable<string>) {
  const normalizedBase = slugify(baseSlug);
  const normalizedTaken = new Set(
    Array.from(takenSlugs, (slug) => slug.trim().toLowerCase()).filter(Boolean),
  );

  if (!normalizedTaken.has(normalizedBase)) {
    return normalizedBase;
  }

  let attempt = 2;
  while (normalizedTaken.has(`${normalizedBase}-${attempt}`)) {
    attempt += 1;
  }

  return `${normalizedBase}-${attempt}`;
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

export function serializeBuilderDocumentPayload(input: {
  kind: DocumentType;
  name: string;
  components?: ComponentData[] | null;
  theme?: Partial<ThemeConfig> | null;
  siteDomain?: string | null;
  useTemporaryDomain?: boolean;
  editor?: BuilderDocumentPayload["editor"];
}) {
  const payload: BuilderDocumentPayload = {
    __wb_builder: BUILDER_PAGE_MARKER,
    version: BUILDER_PAGE_VERSION,
    kind: input.kind,
    name: input.name.trim() || "Untitled Page",
    components: normalizeComponents(input.components),
    theme: normalizeTheme(input.theme),
    siteDomain: input.siteDomain?.trim() || null,
    useTemporaryDomain:
      input.useTemporaryDomain ??
      !(input.siteDomain && input.siteDomain.trim()),
    editor: input.editor,
  };

  return JSON.stringify(payload);
}

export function serializeBuilderPagePayload(input: {
  name: string;
  components?: ComponentData[] | null;
  theme?: Partial<ThemeConfig> | null;
  siteDomain?: string | null;
  useTemporaryDomain?: boolean;
  editor?: BuilderDocumentPayload["editor"];
}) {
  return serializeBuilderDocumentPayload({
    ...input,
    kind: "page",
  });
}

export function serializeBuilderPostPayload(input: {
  name: string;
  components?: ComponentData[] | null;
  theme?: Partial<ThemeConfig> | null;
  siteDomain?: string | null;
  useTemporaryDomain?: boolean;
}) {
  return serializeBuilderDocumentPayload({
    ...input,
    kind: "post",
  });
}

export function parseBuilderDocumentPayload(
  content: string | null | undefined,
  fallbackKind: DocumentType = "page",
) {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as Partial<BuilderDocumentPayload> | null;

    if (!parsed || parsed.__wb_builder !== BUILDER_PAGE_MARKER) {
      return null;
    }

    return {
      __wb_builder: BUILDER_PAGE_MARKER,
      version:
        typeof parsed.version === "number"
          ? parsed.version
          : BUILDER_PAGE_VERSION,
      kind: parsed.kind === "post" ? "post" : fallbackKind,
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
      editor:
        parsed.editor && typeof parsed.editor === "object"
          ? {
              isBlogIndex:
                parsed.editor.isBlogIndex === true ? true : undefined,
            }
          : undefined,
    } satisfies BuilderDocumentPayload;
  } catch {
    return null;
  }
}

export function parseBuilderPagePayload(content: string | null | undefined) {
  return parseBuilderDocumentPayload(content, "page");
}

function buildTextComponent(content: string, order: number): ComponentData {
  return {
    id: crypto.randomUUID(),
    type: "text",
    order,
    props: {
      content,
      alignment: "left",
      fontSize: "lg",
    },
  };
}

function buildHeroComponent(input: {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}): ComponentData {
  const subtitleParts = [input.subtitle, input.description]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ");

  return {
    id: crypto.randomUUID(),
    type: "hero",
    order: 0,
    props: {
      title: input.title?.trim() || "Welcome",
      subtitle:
        subtitleParts || "Create beautiful pages with the visual editor.",
      ctaText: "Get Started",
      ctaLink: "#",
      ...(input.imageUrl?.trim() ? { backgroundImage: input.imageUrl.trim() } : {}),
    },
  };
}

function buildCtaComponent(input: {
  title?: string | null;
  text?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}): ComponentData {
  return {
    id: crypto.randomUUID(),
    type: "cta",
    order: 0,
    props: {
      heading: input.title?.trim() || "Ready to take the next step?",
      description:
        input.text?.trim() || "Tell visitors exactly what you want them to do.",
      buttonText: input.buttonText?.trim() || "Learn More",
      buttonLink: input.buttonLink?.trim() || "#",
      backgroundColor: defaultTheme.colors.primary,
    },
  };
}

export function createDefaultHomePageDocument(siteName = "Untitled Site") {
  return {
    name: siteName,
    slug: BUILDER_PAGE_SLUG,
    components: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        order: 0,
        props: {
          title: siteName,
          subtitle: "Build and publish pages from one CMS workspace.",
          ctaText: "Explore",
          ctaLink: "#",
        },
      },
      buildTextComponent(
        "<h2 class=\"text-3xl font-bold mb-4\">Start with your story</h2><p>Use the CMS navigator to add pages, blog posts, and menus for this site.</p>",
        1,
      ),
      {
        id: crypto.randomUUID(),
        type: "footer",
        order: 2,
        props: {
          companyName: siteName,
          tagline: "Built with Website Builder",
          links: [],
          socialLinks: [],
        },
      },
    ] satisfies ComponentData[],
    theme: defaultTheme,
  };
}

export function createDefaultBlogPageDocument(siteName = "Untitled Site") {
  return {
    name: "Blog",
    slug: BUILDER_BLOG_SLUG,
    components: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        order: 0,
        props: {
          title: `${siteName} Blog`,
          subtitle: "News, updates, and insights from the team.",
          ctaText: "Read Latest Posts",
          ctaLink: "#posts",
        },
      },
      {
        id: crypto.randomUUID(),
        type: "post-list",
        order: 1,
        props: {
          title: "Latest Posts",
          layout: "cards",
          limit: 6,
          showExcerpt: true,
          showFeaturedImage: true,
          showMeta: true,
          anchorId: "posts",
        },
      },
      {
        id: crypto.randomUUID(),
        type: "footer",
        order: 2,
        props: {
          companyName: siteName,
          tagline: "Latest from the blog",
          links: [],
          socialLinks: [],
        },
      },
    ] satisfies ComponentData[],
    theme: defaultTheme,
  };
}

export function createDefaultPostDocument(title = "Untitled Post") {
  return {
    name: title,
    components: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        order: 0,
        props: {
          title,
          subtitle: "Write your post summary here.",
          ctaText: "Back to Blog",
          ctaLink: "/blog",
        },
      },
      buildTextComponent(
        "<p>Start writing your post content here.</p>",
        1,
      ),
    ] satisfies ComponentData[],
    theme: defaultTheme,
  };
}

function synthesizeLegacyPagePayload(
  page: LegacyPageRecord,
  site?: LegacySiteRecord | null,
) {
  const components: ComponentData[] = [];
  const hasHeroContent = Boolean(
    page.hero_title?.trim() ||
      page.hero_subtitle?.trim() ||
      page.hero_description?.trim() ||
      page.hero_image_url?.trim(),
  );

  if (hasHeroContent) {
    components.push(
      buildHeroComponent({
        title: page.hero_title || page.title,
        subtitle: page.hero_subtitle,
        description: page.hero_description,
        imageUrl: page.hero_image_url,
      }),
    );
  }

  const introContent = page.intro_text?.trim();
  if (introContent) {
    components.push(buildTextComponent(`<p>${introContent}</p>`, components.length));
  }

  const htmlContent = page.content?.trim();
  if (htmlContent) {
    components.push(buildTextComponent(htmlContent, components.length));
  }

  if (page.comparison_content?.trim()) {
    components.push(
      buildTextComponent(page.comparison_content.trim(), components.length),
    );
  }

  if (page.testimonial_quote?.trim()) {
    components.push({
      id: crypto.randomUUID(),
      type: "quote",
      order: components.length,
      props: {
        quote: page.testimonial_quote.trim(),
        author: page.testimonial_author?.trim() || "",
      },
    });
  }

  if (
    page.cta_title?.trim() ||
    page.cta_text?.trim() ||
    page.cta_button_text?.trim() ||
    page.cta_button_link?.trim()
  ) {
    const cta = buildCtaComponent({
      title: page.cta_title,
      text: page.cta_text,
      buttonText: page.cta_button_text,
      buttonLink: page.cta_button_link,
    });
    cta.order = components.length;
    components.push(cta);
  }

  if (components.length === 0) {
    return {
      ...createDefaultHomePageDocument(site?.name || page.title || "Untitled Page"),
      name: page.title?.trim() || site?.name || "Untitled Page",
    };
  }

  return {
    name: page.title?.trim() || site?.name || "Untitled Page",
    components: components.map((component, index) => ({
      ...component,
      order: index,
    })),
    theme: defaultTheme,
  };
}

function synthesizeLegacyPostPayload(post: LegacyPostRecord) {
  const components: ComponentData[] = [];
  const hasHeroContent = Boolean(
    post.hero_title?.trim() ||
      post.hero_subtitle?.trim() ||
      post.featured_image_url?.trim(),
  );

  if (hasHeroContent) {
    components.push(
      buildHeroComponent({
        title: post.hero_title || post.title,
        subtitle: post.hero_subtitle || post.excerpt,
        imageUrl: post.featured_image_url,
      }),
    );
  }

  const htmlContent = post.content?.trim();
  if (htmlContent) {
    components.push(buildTextComponent(htmlContent, components.length));
  }

  if (components.length === 0) {
    return createDefaultPostDocument(post.title?.trim() || "Untitled Post");
  }

  return {
    name: post.title?.trim() || "Untitled Post",
    components: components.map((component, index) => ({
      ...component,
      order: index,
    })),
    theme: defaultTheme,
  };
}

export function mapLegacyPageToPageConfig(
  page: LegacyPageRecord,
  site?: LegacySiteRecord | null,
): PageConfig | null {
  const id = normalizePageId(page.id);
  const payload =
    parseBuilderDocumentPayload(page.content, "page") ??
    (() => {
      const synthesized = synthesizeLegacyPagePayload(page, site);

      return {
        __wb_builder: BUILDER_PAGE_MARKER,
        version: BUILDER_PAGE_VERSION,
        kind: "page" as const,
        name: synthesized.name,
        components: synthesized.components,
        theme: synthesized.theme,
        siteDomain: site?.domain ?? null,
        useTemporaryDomain: !Boolean(site?.domain?.trim()),
      };
    })();

  if (!id) {
    return null;
  }

  return {
    id,
    document_type: "page",
    site_id: page.site_id || site?.id || undefined,
    name: payload.name || site?.name || page.title || "Untitled Page",
    title: page.title || payload.name,
    slug: page.slug || BUILDER_PAGE_SLUG,
    meta_title: page.meta_title || page.title || payload.name,
    meta_description: page.meta_description || page.excerpt || null,
    meta_keywords: page.meta_keywords || null,
    excerpt: page.excerpt || null,
    status:
      page.status === "published" || page.status === "archived"
        ? page.status
        : "draft",
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

export function mapLegacyPostToPostConfig(
  post: LegacyPostRecord,
  site?: LegacySiteRecord | null,
): PostConfig | null {
  const id = normalizePageId(post.id);
  const payload =
    parseBuilderDocumentPayload(post.content, "post") ??
    (() => {
      const synthesized = synthesizeLegacyPostPayload(post);

      return {
        __wb_builder: BUILDER_PAGE_MARKER,
        version: BUILDER_PAGE_VERSION,
        kind: "post" as const,
        name: synthesized.name,
        components: synthesized.components,
        theme: synthesized.theme,
        siteDomain: site?.domain ?? null,
        useTemporaryDomain: !Boolean(site?.domain?.trim()),
      };
    })();

  if (!id) {
    return null;
  }

  return {
    id,
    document_type: "post",
    site_id: post.site_id || site?.id || undefined,
    name: payload.name || post.title || "Untitled Post",
    title: post.title || payload.name,
    slug: post.slug || slugify(post.title || payload.name || "post"),
    menu_title: post.menu_title || post.title || payload.name,
    meta_title: post.meta_title || post.title || payload.name,
    meta_description: post.meta_description || post.excerpt || null,
    meta_keywords: post.meta_keywords || null,
    excerpt: post.excerpt || null,
    status:
      post.status === "published" || post.status === "archived"
        ? post.status
        : "draft",
    author: post.author || null,
    published_date: post.published_date || null,
    featured_image_url: post.featured_image_url || null,
    components: payload.components,
    theme: payload.theme,
    site_domain: site?.domain ?? payload.siteDomain,
    use_temporary_domain:
      typeof site?.domain === "string" && site.domain.trim()
        ? false
        : payload.useTemporaryDomain,
    created_at: post.created_at || undefined,
    updated_at: post.updated_at || undefined,
  };
}
