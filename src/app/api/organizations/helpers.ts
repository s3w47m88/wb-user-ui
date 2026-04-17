import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.SUPABASE_CONTROL_SECRET_KEY!;

export function getAuthClient() {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!accessToken) {
    return {
      accessToken: null,
      user: null,
      error: NextResponse.json(
        { success: false, error: "Missing access token" },
        { status: 401 },
      ),
    };
  }

  const authClient = getAuthClient();
  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      accessToken: null,
      user: null,
      error: NextResponse.json(
        { success: false, error: userError?.message || "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  return {
    accessToken,
    user,
    error: null,
  };
}

export async function getOrganizationMembership(
  adminClient: ReturnType<typeof getAdminClient>,
  input: {
    organizationId: string;
    userId: string;
  },
) {
  const { data, error } = await adminClient
    .from("user_organizations")
    .select("org_id, role")
    .eq("org_id", input.organizationId)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
