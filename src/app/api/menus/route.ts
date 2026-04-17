import { NextResponse } from "next/server";
import { slugify } from "@/lib/builder-pages";
import { hydrateMenuTree } from "@/lib/menu-tree";
import { MenuConfig } from "@/lib/supabase-content";
import {
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  loadMenuAndItems,
  MENU_SELECT,
} from "../pages/helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

function toMenuConfig(record: {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}) {
  return {
    id: record.id,
    site_id: record.site_id,
    name: record.name,
    slug: record.slug,
    description: record.description ?? null,
    items: [],
    created_at: record.created_at ?? null,
    updated_at: record.updated_at ?? null,
  } satisfies MenuConfig;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("site_id");

    if (!siteId) {
      return NextResponse.json([]);
    }

    const adminClient = getContentAdminClient();
    const access = await ensureSiteAccess(request, adminClient, siteId);

    if (access.error || !access.site) {
      return access.error;
    }

    const { data: menus, error } = await adminClient
      .from("menus")
      .select(MENU_SELECT)
      .eq("site_id", siteId)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 },
      );
    }

    const menuConfigs = await Promise.all(
      (menus || []).map(async (menu) => {
        const { items } = await loadMenuAndItems(adminClient, menu.id);

        return {
          ...toMenuConfig(menu),
          items: hydrateMenuTree(items),
        };
      }),
    );

    return NextResponse.json(menuConfigs);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { site_id, name, slug, description } = body || {};

    if (!site_id || !name) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const adminClient = getContentAdminClient();
    const access = await ensureSiteAccess(request, adminClient, site_id);

    if (access.error || !access.site) {
      return access.error;
    }

    const menuSlug = await ensureUniqueRecordSlug(adminClient, {
      table: "menus",
      siteId: site_id,
      desiredSlug: slug?.trim() || slugify(name),
    });

    const { data, error } = await adminClient
      .from("menus")
      .insert({
        site_id,
        name: name.trim(),
        slug: menuSlug,
        description: description?.trim() || null,
      })
      .select(MENU_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to create menu.", code: error?.code, error },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ...toMenuConfig(data),
      items: [],
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
