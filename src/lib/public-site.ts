import { createClient } from "@supabase/supabase-js";
import {
  LegacyPageRecord,
  LegacyPostRecord,
  LegacySiteRecord,
  mapLegacyPageToPageConfig,
  mapLegacyPostToPostConfig,
} from "./builder-pages";
import { hydrateMenuTree } from "./menu-tree";
import { MenuConfig, PageConfig, PostConfig, SiteConfig } from "./supabase-content";

const contentSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const contentServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY!;

const PAGE_SELECT =
  "id, title, slug, content, meta_title, meta_description, meta_keywords, updated_at, created_at, hero_title, hero_subtitle, hero_description, hero_image_url, status, intro_text, comparison_content, testimonial_quote, testimonial_author, cta_title, cta_text, cta_button_text, cta_button_link, features_section_title, products_section_title, site_id, excerpt";
const POST_SELECT =
  "id, title, slug, menu_title, meta_title, meta_description, meta_keywords, author, published_date, hero_title, hero_subtitle, excerpt, content, featured_image_url, status, updated_at, created_at, site_id";

function getAdminClient() {
  return createClient(contentSupabaseUrl, contentServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeHost(host: string | null | undefined) {
  if (!host) {
    return null;
  }

  return host.split(":")[0]?.trim().toLowerCase() || null;
}

export async function resolveSiteForPublicRequest(input: {
  host?: string | null;
  siteHint?: string | null;
}) {
  const adminClient = getAdminClient();

  if (input.siteHint) {
    const { data: hintedSite } = await adminClient
      .from("sites")
      .select("id, org_id, slug, name, domain, business_name, created_at, updated_at")
      .eq("id", input.siteHint)
      .maybeSingle();

    return (hintedSite as SiteConfig | null) ?? null;
  }

  const normalizedHost = normalizeHost(input.host);
  const appHost = normalizeHost(process.env.NEXT_PUBLIC_SITE_URL);

  if (!normalizedHost || normalizedHost === "localhost" || normalizedHost === appHost) {
    return null;
  }

  const hostCandidates = normalizedHost.startsWith("www.")
    ? [normalizedHost, normalizedHost.slice(4)]
    : [normalizedHost, `www.${normalizedHost}`];

  const { data: sites } = await adminClient
    .from("sites")
    .select("id, org_id, slug, name, domain, business_name, created_at, updated_at")
    .in("domain", hostCandidates)
    .limit(1);

  return ((sites ?? [])[0] as SiteConfig | undefined) ?? null;
}

export async function loadPublicSiteBundle(siteId: string) {
  const adminClient = getAdminClient();
  const [{ data: site }, { data: pages }, { data: posts }, { data: menus }] =
    await Promise.all([
      adminClient
        .from("sites")
        .select("id, org_id, slug, name, domain, business_name, created_at, updated_at")
        .eq("id", siteId)
        .maybeSingle(),
      adminClient
        .from("pages")
        .select(PAGE_SELECT)
        .eq("site_id", siteId)
        .order("updated_at", { ascending: false }),
      adminClient
        .from("posts")
        .select(POST_SELECT)
        .eq("site_id", siteId)
        .order("updated_at", { ascending: false }),
      adminClient
        .from("menus")
        .select("id, site_id, name, slug, description, created_at, updated_at")
        .eq("site_id", siteId)
        .order("updated_at", { ascending: false }),
    ]);

  const resolvedSite = (site as LegacySiteRecord | null) ?? null;
  const resolvedPages = (pages || [])
    .map((page) =>
      mapLegacyPageToPageConfig(page as LegacyPageRecord, resolvedSite),
    )
    .filter((page): page is PageConfig => Boolean(page));
  const resolvedPosts = (posts || [])
    .map((post) =>
      mapLegacyPostToPostConfig(post as LegacyPostRecord, resolvedSite),
    )
    .filter((post): post is PostConfig => Boolean(post));
  const resolvedMenus = await Promise.all(
    (menus || []).map(async (menu) => {
      const { data: items } = await adminClient
        .from("menu_items")
        .select(
          "id, menu_id, parent_item_id, label, target_type, page_id, post_id, url, open_in_new_tab, sort_order",
        )
        .eq("menu_id", menu.id)
        .order("sort_order", { ascending: true });

      return {
        ...menu,
        items: hydrateMenuTree(items || []),
      } satisfies MenuConfig;
    }),
  );

  return {
    site: resolvedSite,
    pages: resolvedPages,
    posts: resolvedPosts,
    menus: resolvedMenus,
  };
}

export async function loadPublicPageBySlug(siteId: string, slug: string) {
  const bundle = await loadPublicSiteBundle(siteId);
  const page = bundle.pages.find((candidate) => candidate.slug === slug) || null;

  return {
    ...bundle,
    page,
  };
}

export async function loadPublicPostBySlug(siteId: string, slug: string) {
  const bundle = await loadPublicSiteBundle(siteId);
  const post = bundle.posts.find((candidate) => candidate.slug === slug) || null;

  return {
    ...bundle,
    post,
  };
}
