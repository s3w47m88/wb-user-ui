import { NextResponse } from "next/server";
import {
  BUILDER_BLOG_SLUG,
  LegacyPageRecord,
  LegacyPostRecord,
  createDefaultBlogPageDocument,
  createDefaultPostDocument,
  isValidUuid,
  mapLegacyPostToPostConfig,
  serializeBuilderPagePayload,
  serializeBuilderPostPayload,
  slugify,
} from "@/lib/builder-pages";
import {
  assertOrganizationMembership,
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  getSiteIdsForOrganization,
  PAGE_SELECT,
  POST_SELECT,
  SITE_SELECT,
} from "../pages/helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

async function ensureBlogIndexPage(
  adminClient: ReturnType<typeof getContentAdminClient>,
  site: { id?: string | null; name?: string | null; domain?: string | null },
) {
  const { data: existingPage } = await adminClient
    .from("pages")
    .select(PAGE_SELECT)
    .eq("site_id", site.id)
    .eq("slug", BUILDER_BLOG_SLUG)
    .maybeSingle();

  if (existingPage) {
    return existingPage as LegacyPageRecord;
  }

  const blogDocument = createDefaultBlogPageDocument(site.name || "Blog");
  const { data: createdPage, error } = await adminClient
    .from("pages")
    .insert({
      site_id: site.id,
      title: blogDocument.name,
      slug: BUILDER_BLOG_SLUG,
      content: serializeBuilderPagePayload({
        name: blogDocument.name,
        components: blogDocument.components,
        theme: blogDocument.theme,
        siteDomain: site.domain ?? null,
        useTemporaryDomain: !Boolean(site.domain?.trim()),
        editor: { isBlogIndex: true },
      }),
      meta_title: `${site.name || "Site"} Blog`,
      meta_description: "Latest posts and updates.",
      meta_keywords: null,
      excerpt: "Latest posts and updates.",
      status: "draft",
    })
    .select(PAGE_SELECT)
    .single();

  if (error || !createdPage) {
    throw new Error(error?.message || "Failed to create default blog page.");
  }

  return createdPage as LegacyPageRecord;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");
    const siteId = searchParams.get("site_id");
    const adminClient = getContentAdminClient();

    if (isValidUuid(siteId)) {
      const access = await ensureSiteAccess(request, adminClient, siteId);

      if (access.error) {
        return access.error;
      }

      const { data: posts, error } = await adminClient
        .from("posts")
        .select(POST_SELECT)
        .eq("site_id", siteId)
        .order("updated_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { message: error.message, code: error.code, error },
          { status: 400 },
        );
      }

      const postConfigs = (posts || [])
        .map((post) =>
          mapLegacyPostToPostConfig(
            post as LegacyPostRecord,
            access.site,
          ),
        )
        .filter((post): post is NonNullable<typeof post> => Boolean(post));

      return NextResponse.json(postConfigs);
    }

    if (!isValidUuid(organizationId)) {
      return NextResponse.json([]);
    }

    const access = await assertOrganizationMembership(request, organizationId);

    if (access.error) {
      return access.error;
    }

    const siteIds = await getSiteIdsForOrganization(adminClient, organizationId);

    if (siteIds.length === 0) {
      return NextResponse.json([]);
    }

    const [{ data: posts, error: postsError }, { data: sites, error: sitesError }] =
      await Promise.all([
        adminClient
          .from("posts")
          .select(POST_SELECT)
          .in("site_id", siteIds)
          .order("updated_at", { ascending: false }),
        adminClient.from("sites").select(SITE_SELECT).in("id", siteIds),
      ]);

    if (postsError || sitesError) {
      return NextResponse.json(
        {
          message: postsError?.message || sitesError?.message || "Failed to load posts.",
          code: postsError?.code || sitesError?.code,
          error: postsError || sitesError,
        },
        { status: 400 },
      );
    }

    const siteMap = new Map(
      (sites || []).map((site) => [site.id, site]),
    );

    const postConfigs = (posts || [])
      .map((post) =>
        mapLegacyPostToPostConfig(
          post as LegacyPostRecord,
          siteMap.get(post.site_id),
        ),
      )
      .filter((post): post is NonNullable<typeof post> => Boolean(post));

    return NextResponse.json(postConfigs);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      site_id,
      name,
      slug,
      menu_title,
      meta_title,
      meta_description,
      meta_keywords,
      excerpt,
      status,
      author,
      published_date,
      featured_image_url,
      components,
      theme,
    } = body || {};

    if (!site_id || !name) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const adminClient = getContentAdminClient();
    const access = await ensureSiteAccess(request, adminClient, site_id);

    if (access.error || !access.site) {
      return access.error;
    }

    await ensureBlogIndexPage(adminClient, access.site);

    const postDocument = createDefaultPostDocument(name);
    const postSlug = await ensureUniqueRecordSlug(adminClient, {
      table: "posts",
      siteId: site_id,
      desiredSlug: slug?.trim() || slugify(name),
    });
    const postName = name.trim();
    const payload = serializeBuilderPostPayload({
      name: postName,
      components: components ?? postDocument.components,
      theme: theme ?? postDocument.theme,
      siteDomain: access.site.domain ?? null,
      useTemporaryDomain: !Boolean(access.site.domain?.trim()),
    });

    const { data, error } = await adminClient
      .from("posts")
      .insert({
        site_id,
        title: postName,
        slug: postSlug,
        menu_title: menu_title || postName,
        meta_title: meta_title || postName,
        meta_description: meta_description || excerpt || null,
        meta_keywords: meta_keywords || null,
        excerpt: excerpt || null,
        status: status || "draft",
        author: author || null,
        published_date: published_date || null,
        featured_image_url: featured_image_url || null,
        content: payload,
      })
      .select(POST_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to create post.", code: error?.code, error },
        { status: 400 },
      );
    }

    const post = mapLegacyPostToPostConfig(data as LegacyPostRecord, access.site);
    return NextResponse.json(post);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
