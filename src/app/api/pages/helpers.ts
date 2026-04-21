import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  LegacyPageRecord,
  LegacyPostRecord,
  LegacySiteRecord,
  ensureUniqueSlug,
  normalizePageId,
  slugify,
  toDatabasePageId,
} from "@/lib/builder-pages";
import { FlatMenuItemRecord } from "@/lib/menu-tree";
import { normalizeSiteBrandSettings } from "@/lib/site-branding";

const contentSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const contentServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY!;
const controlSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
const controlPublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!;
const controlServiceKey = process.env.SUPABASE_CONTROL_SECRET_KEY!;

export const SITE_SELECT =
  "id, org_id, slug, name, domain, business_name, logo_url, brand_settings, created_at, updated_at";
export const PAGE_SELECT =
  "id, title, slug, content, meta_title, meta_description, meta_keywords, updated_at, created_at, hero_title, hero_subtitle, hero_description, hero_image_url, status, intro_text, comparison_content, testimonial_quote, testimonial_author, cta_title, cta_text, cta_button_text, cta_button_link, features_section_title, products_section_title, site_id, excerpt";
export const POST_SELECT =
  "id, title, slug, menu_title, meta_title, meta_description, meta_keywords, author, published_date, hero_title, hero_subtitle, excerpt, content, featured_image_url, status, updated_at, created_at, site_id";
export const MENU_SELECT =
  "id, site_id, name, slug, description, created_at, updated_at";
export const MENU_ITEM_SELECT =
  "id, menu_id, parent_item_id, label, target_type, page_id, post_id, url, open_in_new_tab, sort_order";

export function getContentAdminClient() {
  return createClient(contentSupabaseUrl, contentServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getControlAuthClient() {
  return createClient(controlSupabaseUrl, controlPublishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getControlAdminClient() {
  return createClient(controlSupabaseUrl, controlServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!accessToken) {
    return {
      user: null,
      error: NextResponse.json(
        { message: "Missing access token." },
        { status: 401 },
      ),
    };
  }

  const authClient = getControlAuthClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(accessToken);

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { message: error?.message || "Unauthorized." },
        { status: 401 },
      ),
    };
  }

  return { user, error: null };
}

export async function assertOrganizationMembership(
  request: Request,
  organizationId: string | null | undefined,
) {
  const authenticated = await getAuthenticatedUser(request);

  if (authenticated.error || !authenticated.user) {
    return { user: null, error: authenticated.error };
  }

  if (!organizationId) {
    return {
      user: null,
      error: NextResponse.json(
        { message: "Organization access is not configured for this resource." },
        { status: 403 },
      ),
    };
  }

  const controlAdminClient = getControlAdminClient();
  const { data: membership, error } = await controlAdminClient
    .from("user_organizations")
    .select("org_id")
    .eq("org_id", organizationId)
    .eq("user_id", authenticated.user.id)
    .maybeSingle();

  if (error) {
    return {
      user: null,
      error: NextResponse.json({ message: error.message }, { status: 500 }),
    };
  }

  if (!membership) {
    return {
      user: null,
      error: NextResponse.json(
        { message: "Organization not found." },
        { status: 404 },
      ),
    };
  }

  return { user: authenticated.user, error: null };
}

export async function loadSite(
  adminClient: ReturnType<typeof getContentAdminClient>,
  siteId: string | null | undefined,
) {
  if (!siteId) {
    return null;
  }

  const { data: site } = await adminClient
    .from("sites")
    .select(SITE_SELECT)
    .eq("id", siteId)
    .maybeSingle();

  return (site as LegacySiteRecord | null) ?? null;
}

export async function ensureSiteAccess(
  request: Request,
  adminClient: ReturnType<typeof getContentAdminClient>,
  siteId: string | null | undefined,
) {
  const site = await loadSite(adminClient, siteId);

  if (!site) {
    return {
      site: null,
      error: NextResponse.json({ message: "Site not found." }, { status: 404 }),
    };
  }

  const access = await assertOrganizationMembership(request, site.org_id);

  if (access.error) {
    return {
      site: null,
      error: access.error,
    };
  }

  return {
    site,
    error: null,
  };
}

export async function loadLegacyPageAndSite(
  adminClient: ReturnType<typeof getContentAdminClient>,
  rawId: string,
) {
  const pageId = normalizePageId(rawId);

  if (!pageId) {
    return { page: null, site: null };
  }

  const { data: page, error } = await adminClient
    .from("pages")
    .select(PAGE_SELECT)
    .eq("id", toDatabasePageId(pageId))
    .maybeSingle();

  if (error || !page) {
    return { page: null, site: null };
  }

  const site = await loadSite(adminClient, page.site_id);

  return {
    page: page as LegacyPageRecord,
    site,
  };
}

export async function loadLegacyPostAndSite(
  adminClient: ReturnType<typeof getContentAdminClient>,
  rawId: string,
) {
  const postId = normalizePageId(rawId);

  if (!postId) {
    return { post: null, site: null };
  }

  const { data: post, error } = await adminClient
    .from("posts")
    .select(POST_SELECT)
    .eq("id", toDatabasePageId(postId))
    .maybeSingle();

  if (error || !post) {
    return { post: null, site: null };
  }

  const site = await loadSite(adminClient, post.site_id);

  return {
    post: post as LegacyPostRecord,
    site,
  };
}

export async function createSiteRecord(
  adminClient: ReturnType<typeof getContentAdminClient>,
  input: {
    organizationId: string;
    siteName: string;
    siteDomain: string | null;
    logoUrl?: string | null;
    brandSettings?: Record<string, unknown> | null;
  },
) {
  const baseSlug = slugify(input.siteName);
  const { data: existingSites } = await adminClient
    .from("sites")
    .select("slug")
    .eq("org_id", input.organizationId);
  const siteSlug = ensureUniqueSlug(
    baseSlug,
    (existingSites ?? []).map((site) => site.slug || ""),
  );

  const { data, error } = await adminClient
    .from("sites")
    .insert({
      org_id: input.organizationId,
      slug: siteSlug,
      name: input.siteName,
      business_name: input.siteName,
      domain: input.siteDomain,
      logo_url: input.logoUrl?.trim() || null,
      brand_settings: normalizeSiteBrandSettings(input.brandSettings),
    })
    .select(SITE_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create site.");
  }

  return data as LegacySiteRecord;
}

export async function getSiteIdsForOrganization(
  adminClient: ReturnType<typeof getContentAdminClient>,
  organizationId: string,
) {
  const { data, error } = await adminClient
    .from("sites")
    .select("id")
    .eq("org_id", organizationId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((site) => site.id);
}

export async function ensureUniqueRecordSlug(
  adminClient: ReturnType<typeof getContentAdminClient>,
  input: {
    table: "pages" | "posts" | "menus";
    siteId: string;
    desiredSlug: string;
    currentId?: string | null;
  },
) {
  const normalizedBase = slugify(input.desiredSlug);
  const { data, error } = await adminClient
    .from(input.table)
    .select("id, slug")
    .eq("site_id", input.siteId);

  if (error) {
    throw new Error(error.message);
  }

  const takenSlugs = (data ?? [])
    .filter((record) => normalizePageId(record.id) !== input.currentId)
    .map((record) => record.slug || "");

  return ensureUniqueSlug(normalizedBase, takenSlugs);
}

export async function loadMenuAndItems(
  adminClient: ReturnType<typeof getContentAdminClient>,
  menuId: string,
) {
  const { data: menu, error: menuError } = await adminClient
    .from("menus")
    .select(MENU_SELECT)
    .eq("id", menuId)
    .maybeSingle();

  if (menuError || !menu) {
    return {
      menu: null,
      items: [],
      site: null,
    };
  }

  const { data: items, error: itemError } = await adminClient
    .from("menu_items")
    .select(MENU_ITEM_SELECT)
    .eq("menu_id", menuId)
    .order("sort_order", { ascending: true });

  if (itemError) {
    throw new Error(itemError.message);
  }

  const site = await loadSite(adminClient, menu.site_id);

  return {
    menu,
    items: (items ?? []) as FlatMenuItemRecord[],
    site,
  };
}
