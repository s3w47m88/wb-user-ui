import { NextResponse } from "next/server";
import {
  BUILDER_PAGE_SLUG,
  LegacyPageRecord,
  mapLegacyPageToPageConfig,
  serializeBuilderPagePayload,
} from "@/lib/builder-pages";
import {
  assertOrganizationMembership,
  createSiteRecord,
  getContentAdminClient,
  SITE_SELECT,
  PAGE_SELECT,
} from "../pages/helpers";
import { normalizeSiteBrandSettings } from "@/lib/site-branding";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");

    if (!organizationId) {
      return NextResponse.json([]);
    }

    const access = await assertOrganizationMembership(request, organizationId);

    if (access.error) {
      return access.error;
    }

    const adminClient = getContentAdminClient();
    const { data, error } = await adminClient
      .from("sites")
      .select(SITE_SELECT)
      .eq("org_id", organizationId)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 },
      );
    }

    return NextResponse.json(data || []);
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
      organization_id,
      name,
      domain,
      use_temporary_domain,
      initial_page,
    } = body || {};

    if (!organization_id || !name) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const access = await assertOrganizationMembership(request, organization_id);

    if (access.error) {
      return access.error;
    }

    const adminClient = getContentAdminClient();
    const site = await createSiteRecord(adminClient, {
      organizationId: organization_id,
      siteName: name,
      siteDomain: use_temporary_domain === true ? null : domain?.trim() || null,
      logoUrl: null,
      brandSettings: normalizeSiteBrandSettings({
        fonts: initial_page?.theme?.fonts,
      }),
    });

    const payload = serializeBuilderPagePayload({
      name: initial_page?.name?.trim() || name.trim(),
      components: initial_page?.components,
      theme: initial_page?.theme,
      siteDomain: site.domain ?? null,
      useTemporaryDomain: !Boolean(site.domain?.trim()),
    });

    const { data: page, error: pageError } = await adminClient
      .from("pages")
      .insert({
        site_id: site.id,
        title: initial_page?.name?.trim() || name.trim(),
        slug: BUILDER_PAGE_SLUG,
        content: payload,
        meta_title: initial_page?.name?.trim() || name.trim(),
        meta_description: null,
        meta_keywords: null,
        excerpt: null,
        status: "draft",
      })
      .select(PAGE_SELECT)
      .single();

    if (pageError || !page) {
      return NextResponse.json(
        {
          message: pageError?.message || "Failed to create site home page.",
          code: pageError?.code,
          error: pageError,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      site,
      home_page: mapLegacyPageToPageConfig(page as LegacyPageRecord, site),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
