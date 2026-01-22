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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: { schema: 'public' }
    });

    // Step 1: Create a security definer function to check membership
    await adminClient.rpc('exec_sql', {
      sql: `CREATE OR REPLACE FUNCTION user_is_org_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id AND organization_members.user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
    });

    // Step 2: Drop and recreate organizations policy using the function
    await adminClient.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations'
    });

    await adminClient.rpc('exec_sql', {
      sql: `CREATE POLICY "Users can view organizations they belong to"
  ON organizations FOR SELECT
  USING (user_is_org_member(id, auth.uid()))`
    });

    // Step 3: Simplify organization_members policy
    await adminClient.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members'
    });

    await adminClient.rpc('exec_sql', {
      sql: `CREATE POLICY "Users can view their own memberships"
  ON organization_members FOR SELECT
  USING (user_id = auth.uid())`
    });

    return NextResponse.json({
      success: true,
      message: 'RLS policies simplified to avoid recursion'
    });
  } catch (error: any) {
    console.error('Fix RLS error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
