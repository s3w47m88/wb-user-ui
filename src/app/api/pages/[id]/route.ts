import { NextResponse } from "next/server";
import {
  BUILDER_PAGE_SLUG,
  LegacyPageRecord,
  mapLegacyPageToPageConfig,
  normalizePageId,
  serializeBuilderPagePayload,
  toDatabasePageId,
} from "@/lib/builder-pages";
import {
  assertOrganizationMembership,
  getContentAdminClient,
  loadLegacyPageAndSite,
} from "../helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, id);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await assertOrganizationMembership(request, site?.org_id);

    if (access.error) {
      return access.error;
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

    const adminClient = getContentAdminClient();
    const { page: existingPage, site: existingSite } =
      await loadLegacyPageAndSite(adminClient, pageId);

    if (!existingPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await assertOrganizationMembership(
      request,
      existingSite?.org_id,
    );

    if (access.error) {
      return access.error;
    }

    const existingBuilderPage = mapLegacyPageToPageConfig(
      existingPage,
      existingSite,
    );
    let normalizedSiteId = existingPage.site_id;

    if (typeof site_id === "string" && site_id.trim()) {
      const { data: nextSite, error: siteError } = await adminClient
        .from("sites")
        .select("id, org_id")
        .eq("id", site_id)
        .single();

      if (siteError || !nextSite) {
        return NextResponse.json(
          { message: siteError?.message || "Site not found." },
          { status: 404 },
        );
      }

      const siteAccess = await assertOrganizationMembership(
        request,
        nextSite.org_id,
      );

      if (siteAccess.error) {
        return siteAccess.error;
      }

      normalizedSiteId = nextSite.id;
    }

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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const pageId = normalizePageId(id);

    if (!pageId) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const adminClient = getContentAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, pageId);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await assertOrganizationMembership(request, site?.org_id);

    if (access.error) {
      return access.error;
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
