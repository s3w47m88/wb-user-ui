import { NextResponse } from "next/server";
import {
  LegacyPageRecord,
  LegacyPostRecord,
  mapLegacyPageToPageConfig,
  mapLegacyPostToPostConfig,
} from "@/lib/builder-pages";
import { hydrateMenuTree } from "@/lib/menu-tree";
import {
  getContentAdminClient,
  loadMenuAndItems,
  loadSite,
  MENU_SELECT,
  PAGE_SELECT,
  POST_SELECT,
} from "@/app/api/pages/helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const site = await loadSite(adminClient, id);

    if (!site) {
      return NextResponse.json({ message: "Site not found." }, { status: 404 });
    }

    const [{ data: pages }, { data: posts }, { data: menus }] = await Promise.all([
      adminClient
        .from("pages")
        .select(PAGE_SELECT)
        .eq("site_id", id)
        .order("updated_at", { ascending: false }),
      adminClient
        .from("posts")
        .select(POST_SELECT)
        .eq("site_id", id)
        .order("updated_at", { ascending: false }),
      adminClient
        .from("menus")
        .select(MENU_SELECT)
        .eq("site_id", id)
        .order("updated_at", { ascending: false }),
    ]);

    const mappedMenus = await Promise.all(
      (menus || []).map(async (menu) => {
        const menuWithItems = await loadMenuAndItems(adminClient, menu.id);

        return {
          ...menu,
          items: hydrateMenuTree(menuWithItems.items),
        };
      }),
    );

    return NextResponse.json({
      site,
      pages: (pages || [])
        .map((page) =>
          mapLegacyPageToPageConfig(page as LegacyPageRecord, site),
        )
        .filter((page): page is NonNullable<typeof page> => Boolean(page)),
      posts: (posts || [])
        .map((post) =>
          mapLegacyPostToPostConfig(post as LegacyPostRecord, site),
        )
        .filter((post): post is NonNullable<typeof post> => Boolean(post)),
      menus: mappedMenus,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
