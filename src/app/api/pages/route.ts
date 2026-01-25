import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTENT_URL!;
const supabaseServiceKey = process.env.SUPABASE_CONTENT_SECRET_KEY!;

function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const isValidUuid = (value?: string | null) =>
  Boolean(
    value &&
      value !== 'undefined' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      site_id,
      name,
      title,
      slug,
      components,
      theme,
      organization_id,
      site_domain,
      use_temporary_domain,
    } = body || {};

    if (!isValidUuid(site_id) || !name || !components || !theme) {
      return NextResponse.json(
        { message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from('pages')
      .insert({
        site_id,
        name,
        title: title || name,
        slug,
        components,
        theme,
        organization_id,
        site_domain: site_domain || null,
        use_temporary_domain: Boolean(use_temporary_domain),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Unexpected error.' },
      { status: 500 }
    );
  }
}
