import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      marketingOptIn,
      organizationName,
      companyEmail,
      companyPhone,
    } = await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !organizationName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL!;
    const supabaseServiceKey = process.env.SUPABASE_CONTROL_SECRET_KEY!;

    // Create admin client with service role key to bypass RLS
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create regular client for signup (to trigger confirmation email)
    const regularClient = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // 1. Create auth user using regular signUp (this triggers confirmation email)
    const { data: authData, error: authError } =
      await regularClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            marketing_opt_in: Boolean(marketingOptIn),
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth`,
        },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: authError?.message || "Failed to create user account",
        },
        { status: 400 },
      );
    }

    const userId = authData.user.id;

    // 2. Create user profile (using admin client to bypass RLS)
    const { error: profileError } = await adminClient
      .from("user_profiles")
      .insert({
        user_id: userId,
        preferences: {
          firstName,
          lastName,
          phone: phone || null,
          marketingOptIn: Boolean(marketingOptIn),
          companyEmail: companyEmail || null,
          companyPhone: companyPhone || null,
        },
      });

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
      // Clean up: delete the auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, error: "Failed to create user profile" },
        { status: 500 },
      );
    }

    // 3. Create organization (using admin client to bypass RLS)
    const { data: orgData, error: orgError } = await adminClient
      .from("organizations")
      .insert({
        name: organizationName,
      })
      .select()
      .single();

    if (orgError || !orgData) {
      console.error("Failed to create organization:", orgError);
      // Clean up: delete profile and auth user
      await adminClient.from("user_profiles").delete().eq("user_id", userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, error: "Failed to create organization" },
        { status: 500 },
      );
    }

    const { error: membershipError } = await adminClient
      .from("user_organizations")
      .insert({
        org_id: orgData.id,
        user_id: userId,
        role: "owner",
      });

    if (membershipError) {
      console.error(
        "Failed to create organization membership:",
        membershipError,
      );
      await adminClient.from("organizations").delete().eq("id", orgData.id);
      await adminClient.from("user_profiles").delete().eq("user_id", userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, error: "Failed to create organization membership" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      organizationId: orgData.id,
      message: "Please check your email to confirm your account",
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
