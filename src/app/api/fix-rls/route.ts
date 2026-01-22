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

    // Drop the problematic policy
    const dropResult = await adminClient.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members'
    });

    console.log('Drop policy result:', dropResult);

    // Create the new policy
    const createResult = await adminClient.rpc('exec_sql', {
      sql: `CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = organization_members.organization_id
      AND organizations.created_by = auth.uid()
    )
  )`
    });

    console.log('Create policy result:', createResult);

    return NextResponse.json({
      success: true,
      message: 'RLS policy fixed successfully'
    });
  } catch (error: any) {
    console.error('Fix RLS error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
