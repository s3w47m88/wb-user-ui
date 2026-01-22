import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

    // Create admin client with service role key to bypass RLS
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create regular client for signup (to trigger confirmation email)
    const regularClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Create auth user using regular signUp (this triggers confirmation email)
    const { data: authData, error: authError } = await regularClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth`
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Failed to create user account' },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Create user profile (using admin client to bypass RLS)
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        marketing_opt_in: marketingOptIn || false,
      });

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      // Clean up: delete the auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // 3. Create organization (using admin client to bypass RLS)
    const { data: orgData, error: orgError } = await adminClient
      .from('organizations')
      .insert({
        name: organizationName,
        company_email: companyEmail || null,
        company_phone: companyPhone || null,
        created_by: userId,
      })
      .select()
      .single();

    if (orgError || !orgData) {
      console.error('Failed to create organization:', orgError);
      // Clean up: delete profile and auth user
      await adminClient.from('user_profiles').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    // Note: organization_members entry is created automatically via trigger

    return NextResponse.json({
      success: true,
      userId,
      organizationId: orgData.id,
      message: 'Please check your email to confirm your account'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
