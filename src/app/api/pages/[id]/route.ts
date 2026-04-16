import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  BUILDER_PAGE_SLUG,
  isValidUuid,
  LegacyPageRecord,
  LegacySiteRecord,
  mapLegacyPageToPageConfig,
  normalizePageId,
  serializeBuilderPagePayload,
  toDatabasePageId,
} from "@/lib/builder-pages";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const supabaseServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY!;
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function loadLegacyPageAndSite(
  adminClient: ReturnType<typeof getAdminClient>,
  rawId: string,
) {
  const pageId = normalizePageId(rawId);
  if (!pageId) {
    return { page: null, site: null };
  }

  const { data: page, error } = await adminClient
    .from("pages")
    .select("id, title, slug, content, site_id, created_at, updated_at")
    .eq("id", toDatabasePageId(pageId))
    .single();

  if (error || !page) {
    return { page: null, site: null };
  }

  const { data: site } = page.site_id
    ? await adminClient
        .from("sites")
        .select("id, org_id, slug, name, domain")
        .eq("id", page.site_id)
        .single()
    : { data: null };

  return {
    page: page as LegacyPageRecord,
    site: (site as LegacySiteRecord | null) ?? null,
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminClient = getAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, id);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const builderPage = mapLegacyPageToPageConfig(page, site);

    if (!builderPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    return NextResponse.json(builderPage);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const pageId = normalizePageId(id);
    if (!pageId) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const body = await request.json();
    const {
      site_id,
      name,
      components,
      theme,
      site_domain,
      use_temporary_domain,
    } = body || {};

    if (
      name === undefined &&
      components === undefined &&
      theme === undefined &&
      site_domain === undefined &&
      use_temporary_domain === undefined &&
      site_id === undefined
    ) {
      return NextResponse.json(
        { message: "No updates provided." },
        { status: 400 },
      );
    }

    const adminClient = getAdminClient();
    const { page: existingPage, site: existingSite } =
      await loadLegacyPageAndSite(adminClient, pageId);

    if (!existingPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const existingBuilderPage = mapLegacyPageToPageConfig(
      existingPage,
      existingSite,
    );
    const normalizedSiteId = isValidUuid(site_id)
      ? site_id
      : existingPage.site_id;
    const normalizedSiteDomain =
      typeof site_domain === "string" && site_domain.trim()
        ? site_domain.trim()
        : null;
    const pageName =
      typeof name === "string" && name.trim()
        ? name.trim()
        : existingSite?.name || existingPage.title || "Untitled Page";
    const payload = serializeBuilderPagePayload({
      name: pageName,
      components: components ?? existingBuilderPage?.components,
      theme: theme ?? existingBuilderPage?.theme,
      siteDomain:
        site_domain !== undefined
          ? normalizedSiteDomain
          : (existingSite?.domain ?? undefined),
      useTemporaryDomain:
        use_temporary_domain !== undefined
          ? Boolean(use_temporary_domain)
          : !(existingSite?.domain && existingSite.domain.trim()),
    });

    if (
      existingSite &&
      (name !== undefined ||
        site_domain !== undefined ||
        use_temporary_domain !== undefined)
    ) {
      const { error: siteError } = await adminClient
        .from("sites")
        .update({
          ...(name !== undefined
            ? { name: pageName, business_name: pageName }
            : {}),
          ...(site_domain !== undefined || use_temporary_domain !== undefined
            ? {
                domain:
                  use_temporary_domain === undefined
                    ? normalizedSiteDomain
                    : Boolean(use_temporary_domain)
                      ? null
                      : normalizedSiteDomain,
              }
            : {}),
        })
        .eq("id", existingSite.id);

      if (siteError) {
        return NextResponse.json(
          {
            message: siteError.message,
            code: siteError.code,
            error: siteError,
          },
          { status: 400 },
        );
      }
    }

    const { data, error } = await adminClient
      .from("pages")
      .update({
        site_id: normalizedSiteId,
        title: pageName,
        slug: existingPage.slug || BUILDER_PAGE_SLUG,
        content: payload,
        meta_title: pageName,
        meta_description: `Website builder page for ${pageName}`,
        excerpt: `Website builder page for ${pageName}`,
      })
      .eq("id", toDatabasePageId(pageId))
      .select("id, title, slug, content, site_id, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const { site: updatedSite } = await loadLegacyPageAndSite(
      adminClient,
      pageId,
    );
    const builderPage = mapLegacyPageToPageConfig(
      data as LegacyPageRecord,
      updatedSite ?? existingSite,
    );

    return NextResponse.json(builderPage);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const pageId = normalizePageId(id);

    if (!pageId) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const adminClient = getAdminClient();
    const { page } = await loadLegacyPageAndSite(adminClient, pageId);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const { error: pageDeleteError } = await adminClient
      .from("pages")
      .delete()
      .eq("id", toDatabasePageId(pageId));

    if (pageDeleteError) {
      return NextResponse.json(
        {
          message: pageDeleteError.message,
          code: pageDeleteError.code,
          error: pageDeleteError,
        },
        { status: 400 },
      );
    }

    if (page.site_id) {
      const { count } = await adminClient
        .from("pages")
        .select("id", { count: "exact", head: true })
        .eq("site_id", page.site_id);

      if ((count || 0) === 0) {
        await adminClient.from("sites").delete().eq("id", page.site_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
