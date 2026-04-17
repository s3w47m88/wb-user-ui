import { NextResponse } from "next/server";
import {
  createDefaultHomePageDocument,
  LegacyPageRecord,
  mapLegacyPageToPageConfig,
  normalizePageId,
  serializeBuilderPagePayload,
  slugify,
  toDatabasePageId,
} from "@/lib/builder-pages";
import {
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  loadLegacyPageAndSite,
  PAGE_SELECT,
} from "../helpers";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error.";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminClient = getContentAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, id);

    if (!page || !site) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const builderPage = mapLegacyPageToPageConfig(page, site);

    if (!builderPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    return NextResponse.json(builderPage);
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
    const pageId = normalizePageId(id);

    if (!pageId) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const body = await request.json();
    const adminClient = getContentAdminClient();
    const { page: existingPage, site } = await loadLegacyPageAndSite(
      adminClient,
      pageId,
    );

    if (!existingPage || !site) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const existingBuilderPage = mapLegacyPageToPageConfig(existingPage, site);
    const defaultDocument = createDefaultHomePageDocument(
      existingBuilderPage?.name || existingPage.title || site.name || "Untitled Page",
    );
    const pageName =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : existingBuilderPage?.name ||
          existingPage.title ||
          site.name ||
          "Untitled Page";
    const nextSlug =
      body.slug !== undefined
        ? await ensureUniqueRecordSlug(adminClient, {
            table: "pages",
            siteId: site.id!,
            desiredSlug: body.slug?.trim() || slugify(pageName),
            currentId: pageId,
          })
        : existingPage.slug || slugify(pageName);
    const payload = serializeBuilderPagePayload({
      name: pageName,
      components:
        body.components ??
        existingBuilderPage?.components ??
        defaultDocument.components,
      theme: body.theme ?? existingBuilderPage?.theme ?? defaultDocument.theme,
      siteDomain: site.domain ?? null,
      useTemporaryDomain: !Boolean(site.domain?.trim()),
    });

    const { data, error } = await adminClient
      .from("pages")
      .update({
        title: pageName,
        slug: nextSlug,
        content: payload,
        meta_title:
          body.meta_title !== undefined
            ? body.meta_title || null
            : existingBuilderPage?.meta_title || pageName,
        meta_description:
          body.meta_description !== undefined
            ? body.meta_description || null
            : existingBuilderPage?.meta_description || null,
        meta_keywords:
          body.meta_keywords !== undefined
            ? body.meta_keywords || null
            : existingBuilderPage?.meta_keywords || null,
        excerpt:
          body.excerpt !== undefined
            ? body.excerpt || null
            : existingBuilderPage?.excerpt || null,
        status:
          body.status !== undefined
            ? body.status || "draft"
            : existingBuilderPage?.status || "draft",
      })
      .eq("id", toDatabasePageId(pageId))
      .select(PAGE_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to update page.", code: error?.code, error },
        { status: 400 },
      );
    }

    const page = mapLegacyPageToPageConfig(data as LegacyPageRecord, site);
    return NextResponse.json(page);
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
    const pageId = normalizePageId(id);

    if (!pageId) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const adminClient = getContentAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, pageId);

    if (!page || !site) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const { error } = await adminClient
      .from("pages")
      .delete()
      .eq("id", toDatabasePageId(pageId));

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
