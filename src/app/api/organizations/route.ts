import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.SUPABASE_CONTROL_SECRET_KEY!;

function getAuthClient() {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getAuthenticatedUser(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  try {
    const authenticated = await getAuthenticatedUser(request);

    if (authenticated.error || !authenticated.user) {
      return authenticated.error;
    }

    const adminClient = getAdminClient();
    const { data: memberships, error: membershipsError } = await adminClient
      .from("user_organizations")
      .select("org_id, role")
      .eq("user_id", authenticated.user.id);

    if (membershipsError) {
      return NextResponse.json(
        {
          success: false,
          error: membershipsError.message || "Failed to load memberships",
        },
        { status: 500 },
      );
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ success: true, organizations: [] });
    }

    const orgIds = memberships.map((membership) => membership.org_id);
    const { data: organizations, error: organizationsError } = await adminClient
      .from("organizations")
      .select("*")
      .in("id", orgIds)
      .order("created_at", { ascending: true });

    if (organizationsError) {
      return NextResponse.json(
        {
          success: false,
          error: organizationsError.message || "Failed to load organizations",
        },
        { status: 500 },
      );
    }

    const organizationsWithRoles = (organizations || []).map((organization) => {
      const membership = memberships.find(
        (item) => item.org_id === organization.id,
      );
      return {
        ...organization,
        role: membership?.role,
      };
    });

    return NextResponse.json({
      success: true,
      organizations: organizationsWithRoles,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("List organizations error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await getAuthenticatedUser(request);

    if (authenticated.error || !authenticated.user) {
      return authenticated.error;
    }

    const { name } = await request.json();
    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: "Organization name is required" },
        { status: 400 },
      );
    }

    const adminClient = getAdminClient();

    const { data: organization, error: organizationError } = await adminClient
      .from("organizations")
      .insert({
        name: trimmedName,
      })
      .select()
      .single();

    if (organizationError || !organization) {
      return NextResponse.json(
        {
          success: false,
          error: organizationError?.message || "Failed to create organization",
        },
        { status: 500 },
      );
    }

    const { error: membershipError } = await adminClient
      .from("user_organizations")
      .insert({
        org_id: organization.id,
        user_id: authenticated.user.id,
        role: "owner",
      });

    if (membershipError) {
      await adminClient
        .from("organizations")
        .delete()
        .eq("id", organization.id);
      return NextResponse.json(
        {
          success: false,
          error: membershipError.message || "Failed to create membership",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Create organization error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
