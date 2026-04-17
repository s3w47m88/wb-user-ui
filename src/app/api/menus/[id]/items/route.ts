import { NextResponse } from "next/server";
import { flattenMenuTree, hydrateMenuTree, sanitizeMenuTree } from "@/lib/menu-tree";
import { MenuItemConfig } from "@/lib/supabase-content";
import {
  ensureSiteAccess,
  getContentAdminClient,
  loadMenuAndItems,
  MENU_ITEM_SELECT,
} from "../../../pages/helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const inputItems = Array.isArray(body?.items)
      ? (body.items as MenuItemConfig[])
      : [];
    const adminClient = getContentAdminClient();
    const { menu, site } = await loadMenuAndItems(adminClient, id);

    if (!menu || !site) {
      return NextResponse.json({ message: "Menu not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const sanitizedItems = sanitizeMenuTree(
      inputItems.map((item) => ({
        id: item.id,
        label: item.label,
        target_type: item.target_type,
        page_id: item.page_id,
        post_id: item.post_id,
        url: item.url,
        open_in_new_tab: item.open_in_new_tab,
        children: item.children.map((child) => ({
          id: child.id,
          label: child.label,
          target_type: child.target_type,
          page_id: child.page_id,
          post_id: child.post_id,
          url: child.url,
          open_in_new_tab: child.open_in_new_tab,
          children: [],
        })),
      })),
    );
    const flattened = flattenMenuTree(menu.id, sanitizedItems);

    const { error: deleteError } = await adminClient
      .from("menu_items")
      .delete()
      .eq("menu_id", menu.id);

    if (deleteError) {
      return NextResponse.json(
        { message: deleteError.message, code: deleteError.code, error: deleteError },
        { status: 400 },
      );
    }

    if (flattened.length > 0) {
      const { error: insertError } = await adminClient
        .from("menu_items")
        .insert(flattened);

      if (insertError) {
        return NextResponse.json(
          { message: insertError.message, code: insertError.code, error: insertError },
          { status: 400 },
        );
      }
    }

    const { data: items, error: selectError } = await adminClient
      .from("menu_items")
      .select(MENU_ITEM_SELECT)
      .eq("menu_id", menu.id)
      .order("sort_order", { ascending: true });

    if (selectError) {
      return NextResponse.json(
        { message: selectError.message, code: selectError.code, error: selectError },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ...menu,
      items: hydrateMenuTree(items || []),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
