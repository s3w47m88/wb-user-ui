import { NextResponse } from "next/server";
import { hydrateMenuTree } from "@/lib/menu-tree";
import {
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  loadMenuAndItems,
  MENU_SELECT,
} from "../../pages/helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const { menu, items, site } = await loadMenuAndItems(adminClient, id);

    if (!menu || !site) {
      return NextResponse.json({ message: "Menu not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    return NextResponse.json({
      ...menu,
      items: hydrateMenuTree(items),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const adminClient = getContentAdminClient();
    const { menu, items, site } = await loadMenuAndItems(adminClient, id);

    if (!menu || !site) {
      return NextResponse.json({ message: "Menu not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const nextSlug =
      body.slug !== undefined
        ? await ensureUniqueRecordSlug(adminClient, {
            table: "menus",
            siteId: site.id!,
            desiredSlug: body.slug?.trim() || menu.slug,
            currentId: menu.id,
          })
        : menu.slug;

    const { data, error } = await adminClient
      .from("menus")
      .update({
        name:
          typeof body.name === "string" && body.name.trim()
            ? body.name.trim()
            : menu.name,
        slug: nextSlug,
        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : menu.description,
      })
      .eq("id", menu.id)
      .select(MENU_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to update menu.", code: error?.code, error },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ...data,
      items: hydrateMenuTree(items),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const { menu, site } = await loadMenuAndItems(adminClient, id);

    if (!menu || !site) {
      return NextResponse.json({ message: "Menu not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const { error } = await adminClient.from("menus").delete().eq("id", menu.id);

    if (error) {
      return NextResponse.json(
        { message: error.message, code: error.code, error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
