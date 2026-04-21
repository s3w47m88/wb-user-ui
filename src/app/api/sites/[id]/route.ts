import { NextResponse } from "next/server";
import {
  assertOrganizationMembership,
  getContentAdminClient,
  loadSite,
  SITE_SELECT,
} from "../../pages/helpers";
import { normalizeSiteBrandSettings } from "@/lib/site-branding";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const site = await loadSite(adminClient, id);

    if (!site) {
      return NextResponse.json({ message: "Site not found." }, { status: 404 });
    }

    const access = await assertOrganizationMembership(request, site.org_id);

    if (access.error) {
      return access.error;
    }

    return NextResponse.json(site);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const site = await loadSite(adminClient, id);

    if (!site) {
      return NextResponse.json({ message: "Site not found." }, { status: 404 });
    }

    const access = await assertOrganizationMembership(request, site.org_id);

    if (access.error) {
      return access.error;
    }

    const body = (await request.json().catch(() => null)) as
      | {
          name?: string | null;
          business_name?: string | null;
          logo_url?: string | null;
          brand_settings?: Record<string, unknown> | null;
        }
      | null;

    const nextName = body?.name?.trim();

    const { data, error } = await adminClient
      .from("sites")
      .update({
        name: nextName || site.name || null,
        business_name:
          body?.business_name !== undefined
            ? body.business_name?.trim() || null
            : nextName || site.business_name || site.name || null,
        logo_url:
          body?.logo_url !== undefined
            ? body.logo_url?.trim() || null
            : site.logo_url || null,
        brand_settings:
          body?.brand_settings !== undefined
            ? normalizeSiteBrandSettings(body.brand_settings)
            : normalizeSiteBrandSettings(site.brand_settings ?? null),
      })
      .eq("id", id)
      .select(SITE_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to update site.", code: error?.code },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
