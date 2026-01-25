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

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      site_id,
      name,
      components,
      theme,
      site_domain,
      use_temporary_domain,
    } = body || {};

    const updates: Record<string, any> = {};
    if (isValidUuid(site_id)) updates.site_id = site_id;
    if (name !== undefined) {
      updates.name = name;
      updates.title = name;
    }
    if (components !== undefined) updates.components = components;
    if (theme !== undefined) updates.theme = theme;
    if (site_domain !== undefined) updates.site_domain = site_domain;
    if (use_temporary_domain !== undefined) {
      updates.use_temporary_domain = Boolean(use_temporary_domain);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: 'No updates provided.' },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: 'Page not found.' },
        { status: 404 }
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
