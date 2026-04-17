import { NextResponse } from "next/server";
import {
  createDefaultHomePageDocument,
  isValidUuid,
  LegacyPageRecord,
  mapLegacyPageToPageConfig,
  serializeBuilderPagePayload,
  slugify,
} from "@/lib/builder-pages";
import {
  assertOrganizationMembership,
  createSiteRecord,
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  getSiteIdsForOrganization,
  PAGE_SELECT,
  SITE_SELECT,
} from "./helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

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

      const { data: pages, error } = await adminClient
        .from("pages")
        .select(PAGE_SELECT)
        .eq("site_id", siteId)
        .order("updated_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { message: error.message, code: error.code, error },
          { status: 400 },
        );
      }

      const pageConfigs = (pages || [])
        .map((page) =>
          mapLegacyPageToPageConfig(
            page as LegacyPageRecord,
            access.site,
          ),
        )
        .filter((page): page is NonNullable<typeof page> => Boolean(page));

      return NextResponse.json(pageConfigs);
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

    const [{ data: pages, error: pagesError }, { data: sites, error: sitesError }] =
      await Promise.all([
        adminClient
          .from("pages")
          .select(PAGE_SELECT)
          .in("site_id", siteIds)
          .order("updated_at", { ascending: false }),
        adminClient.from("sites").select(SITE_SELECT).in("id", siteIds),
      ]);

    if (pagesError || sitesError) {
      return NextResponse.json(
        {
          message: pagesError?.message || sitesError?.message || "Failed to load pages.",
          code: pagesError?.code || sitesError?.code,
          error: pagesError || sitesError,
        },
        { status: 400 },
      );
    }

    const siteMap = new Map(
      (sites || []).map((site) => [site.id, site]),
    );

    const pageConfigs = (pages || [])
      .map((page) =>
        mapLegacyPageToPageConfig(
          page as LegacyPageRecord,
          siteMap.get(page.site_id),
        ),
      )
      .filter((page): page is NonNullable<typeof page> => Boolean(page));

    return NextResponse.json(pageConfigs);
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
      organization_id,
      name,
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      excerpt,
      status,
      components,
      theme,
      site_domain,
      use_temporary_domain,
    } = body || {};

    if (!name || (!site_id && !organization_id)) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const adminClient = getContentAdminClient();
    let site = null;

    if (isValidUuid(site_id)) {
      const access = await ensureSiteAccess(request, adminClient, site_id);

      if (access.error) {
        return access.error;
      }

      site = access.site;
    } else if (isValidUuid(organization_id)) {
      const access = await assertOrganizationMembership(request, organization_id);

      if (access.error) {
        return access.error;
      }

      site = await createSiteRecord(adminClient, {
        organizationId: organization_id,
        siteName: name,
        siteDomain:
          use_temporary_domain === true ? null : site_domain?.trim() || null,
      });
    }

    if (!site) {
      return NextResponse.json(
        { message: "Site not found." },
        { status: 404 },
      );
    }

    const defaultDocument = createDefaultHomePageDocument(name);
    const pageSlug = await ensureUniqueRecordSlug(adminClient, {
      table: "pages",
      siteId: site.id!,
      desiredSlug: slug?.trim() || slugify(name),
    });
    const pageName = name.trim();
    const payload = serializeBuilderPagePayload({
      name: pageName,
      components: components ?? defaultDocument.components,
      theme: theme ?? defaultDocument.theme,
      siteDomain: site.domain ?? null,
      useTemporaryDomain:
        use_temporary_domain === undefined
          ? !Boolean(site.domain?.trim())
          : Boolean(use_temporary_domain),
    });

    const { data, error } = await adminClient
      .from("pages")
      .insert({
        site_id: site.id,
        title: pageName,
        slug: pageSlug,
        content: payload,
        meta_title: meta_title || pageName,
        meta_description: meta_description || excerpt || null,
        meta_keywords: meta_keywords || null,
        excerpt: excerpt || null,
        status: status || "draft",
      })
      .select(PAGE_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to create page.", code: error?.code, error },
        { status: 400 },
      );
    }

    const page = mapLegacyPageToPageConfig(data as LegacyPageRecord, site);
    return NextResponse.json(page);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
