import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Only allow on localhost
    const host = request.headers.get('host') || '';
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return NextResponse.json(
        { success: false, error: 'This endpoint is only available on localhost' },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Look up user by email using admin client (works even if email not confirmed)
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json(
        { success: false, error: `Failed to list users: ${listError.message}` },
        { status: 500 }
      );
    }

    const user = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user.id;

    // Get organizations created by this user
    const { data: orgs } = await adminClient
      .from('organizations')
      .select('id')
      .eq('created_by', userId);

    // Delete pages associated with user's organizations
    if (orgs && orgs.length > 0) {
      const orgIds = orgs.map(org => org.id);
      const { error: pagesError } = await adminClient
        .from('pages')
        .delete()
        .in('organization_id', orgIds);

      if (pagesError) {
        console.error('Error deleting pages:', pagesError);
      }
    }

    // Delete organization invitations
    const { error: invitesError } = await adminClient
      .from('organization_invitations')
      .delete()
      .eq('invited_by', userId);

    if (invitesError) {
      console.error('Error deleting invitations:', invitesError);
    }

    // Delete organization members
    const { error: membersError } = await adminClient
      .from('organization_members')
      .delete()
      .eq('user_id', userId);

    if (membersError) {
      console.error('Error deleting members:', membersError);
    }

    // Delete organizations created by user
    const { error: orgsError } = await adminClient
      .from('organizations')
      .delete()
      .eq('created_by', userId);

    if (orgsError) {
      console.error('Error deleting organizations:', orgsError);
    }

    // Delete user profile
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
    }

    // Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError);
      return NextResponse.json(
        { success: false, error: `Failed to delete user: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete test user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
