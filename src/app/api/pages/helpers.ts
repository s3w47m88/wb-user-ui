import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  LegacyPageRecord,
  LegacySiteRecord,
  normalizePageId,
  toDatabasePageId,
} from "@/lib/builder-pages";

const contentSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const contentServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY!;
const controlSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
const controlPublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!;
const controlServiceKey = process.env.SUPABASE_CONTROL_SECRET_KEY!;

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
        { message: "Organization access is not configured for this page." },
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
