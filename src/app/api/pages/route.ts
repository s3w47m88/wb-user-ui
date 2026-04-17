import { NextResponse } from "next/server";
import {
  BUILDER_PAGE_SLUG,
  isValidUuid,
  LegacyPageRecord,
  LegacySiteRecord,
  mapLegacyPageToPageConfig,
  serializeBuilderPagePayload,
  slugify,
} from "@/lib/builder-pages";
import {
  assertOrganizationMembership,
  getContentAdminClient,
} from "./helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

async function createSite(
  adminClient: ReturnType<typeof getContentAdminClient>,
  input: {
    organizationId: string;
    siteName: string;
    siteDomain: string | null;
  },
) {
  const baseSlug = slugify(input.siteName);
  const slugCandidates = [
    baseSlug,
    `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`,
  ];
  let lastError: { message: string } | null = null;

  for (const candidate of slugCandidates) {
    const { data, error } = await adminClient
      .from("sites")
      .insert({
        org_id: input.organizationId,
        slug: candidate,
        name: input.siteName,
        business_name: input.siteName,
        domain: input.siteDomain,
      })
      .select("id, org_id, slug, name, domain")
      .single();

    if (!error) {
      return data as LegacySiteRecord;
    }

    lastError = error;
    if (error.code !== "23505") {
      break;
    }
  }

  throw new Error(lastError?.message || "Failed to create site.");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");

    if (!isValidUuid(organizationId)) {
      return NextResponse.json([], { status: 200 });
    }

    const access = await assertOrganizationMembership(request, organizationId);

    if (access.error) {
      return access.error;
    }

    const adminClient = getContentAdminClient();
    const { data: sites, error: sitesError } = await adminClient
      .from("sites")
      .select("id, org_id, slug, name, domain")
      .eq("org_id", organizationId);

    if (sitesError) {
      return NextResponse.json(
        {
          message: sitesError.message,
          code: sitesError.code,
          error: sitesError,
        },
        { status: 400 },
      );
    }

    if (!sites || sites.length === 0) {
      return NextResponse.json([]);
    }

    const siteMap = new Map<string, LegacySiteRecord>(
      sites.map((site) => [site.id, site as LegacySiteRecord]),
    );
    const { data: pages, error: pagesError } = await adminClient
      .from("pages")
      .select("id, title, slug, content, site_id, created_at, updated_at")
      .in(
        "site_id",
        sites.map((site) => site.id),
      )
      .order("updated_at", { ascending: false });

    if (pagesError) {
      return NextResponse.json(
        {
          message: pagesError.message,
          code: pagesError.code,
          error: pagesError,
        },
        { status: 400 },
      );
    }

    const builderPages = (pages || [])
      .map((page) =>
        mapLegacyPageToPageConfig(
          page as LegacyPageRecord,
          siteMap.get(page.site_id),
        ),
      )
      .filter((page): page is NonNullable<typeof page> => Boolean(page));

    return NextResponse.json(builderPages);
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
      title,
      slug,
      components,
      theme,
      organization_id,
      site_domain,
      use_temporary_domain,
    } = body || {};

    if (!name || !components || !theme) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const adminClient = getContentAdminClient();
    const normalizedSiteDomain =
      typeof site_domain === "string" && site_domain.trim()
        ? site_domain.trim()
        : null;
    let site: LegacySiteRecord | null = null;

    if (isValidUuid(site_id)) {
      const { data: existingSite, error: siteError } = await adminClient
        .from("sites")
        .select("id, org_id, slug, name, domain")
        .eq("id", site_id)
        .single();

      if (siteError || !existingSite) {
        return NextResponse.json(
          { message: siteError?.message || "Site not found." },
          { status: 404 },
        );
      }

      const access = await assertOrganizationMembership(
        request,
        existingSite.org_id,
      );

      if (access.error) {
        return access.error;
      }

      site = existingSite as LegacySiteRecord;
    } else if (isValidUuid(organization_id)) {
      const access = await assertOrganizationMembership(request, organization_id);

      if (access.error) {
        return access.error;
      }

      site = await createSite(adminClient, {
        organizationId: organization_id,
        siteName: name,
        siteDomain: Boolean(use_temporary_domain) ? null : normalizedSiteDomain,
      });
    }

    if (!site) {
      return NextResponse.json(
        { message: "Missing organization_id to create a new site." },
        { status: 400 },
      );
    }

    const payload = serializeBuilderPagePayload({
      name,
      components,
      theme,
      siteDomain: site.domain ?? normalizedSiteDomain,
      useTemporaryDomain: Boolean(use_temporary_domain),
    });
    const { data, error } = await adminClient
      .from("pages")
      .insert({
        site_id: site.id,
        title: title || name,
        slug: slug || BUILDER_PAGE_SLUG,
        content: payload,
        status: "draft",
        meta_title: title || name,
        meta_description: `Website builder page for ${name}`,
        excerpt: `Website builder page for ${name}`,
      })
      .select("id, title, slug, content, site_id, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
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
