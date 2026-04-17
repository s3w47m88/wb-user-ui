import { NextResponse } from "next/server";
import {
  LegacyPostRecord,
  createDefaultPostDocument,
  mapLegacyPostToPostConfig,
  normalizePageId,
  serializeBuilderPostPayload,
  slugify,
  toDatabasePageId,
} from "@/lib/builder-pages";
import {
  ensureSiteAccess,
  ensureUniqueRecordSlug,
  getContentAdminClient,
  loadLegacyPostAndSite,
  POST_SELECT,
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
    const { post, site } = await loadLegacyPostAndSite(adminClient, id);

    if (!post || !site) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const builderPost = mapLegacyPostToPostConfig(post, site);

    if (!builderPost) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(builderPost);
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
    const postId = normalizePageId(id);

    if (!postId) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const body = await request.json();
    const adminClient = getContentAdminClient();
    const { post: existingPost, site } = await loadLegacyPostAndSite(
      adminClient,
      postId,
    );

    if (!existingPost || !site) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const existingBuilderPost = mapLegacyPostToPostConfig(existingPost, site);
    const defaultDocument = createDefaultPostDocument(
      existingBuilderPost?.name || existingPost.title || "Untitled Post",
    );
    const postName =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : existingBuilderPost?.name || existingPost.title || "Untitled Post";
    const nextSlug =
      body.slug !== undefined
        ? await ensureUniqueRecordSlug(adminClient, {
            table: "posts",
            siteId: site.id!,
            desiredSlug: body.slug?.trim() || slugify(postName),
            currentId: postId,
          })
        : existingPost.slug || slugify(postName);
    const payload = serializeBuilderPostPayload({
      name: postName,
      components:
        body.components ??
        existingBuilderPost?.components ??
        defaultDocument.components,
      theme: body.theme ?? existingBuilderPost?.theme ?? defaultDocument.theme,
      siteDomain: site.domain ?? null,
      useTemporaryDomain: !Boolean(site.domain?.trim()),
    });

    const { data, error } = await adminClient
      .from("posts")
      .update({
        title: postName,
        slug: nextSlug,
        menu_title:
          body.menu_title !== undefined
            ? body.menu_title || null
            : existingBuilderPost?.menu_title || postName,
        meta_title:
          body.meta_title !== undefined
            ? body.meta_title || null
            : existingBuilderPost?.meta_title || postName,
        meta_description:
          body.meta_description !== undefined
            ? body.meta_description || null
            : existingBuilderPost?.meta_description || null,
        meta_keywords:
          body.meta_keywords !== undefined
            ? body.meta_keywords || null
            : existingBuilderPost?.meta_keywords || null,
        excerpt:
          body.excerpt !== undefined
            ? body.excerpt || null
            : existingBuilderPost?.excerpt || null,
        status:
          body.status !== undefined
            ? body.status || "draft"
            : existingBuilderPost?.status || "draft",
        author:
          body.author !== undefined
            ? body.author || null
            : existingBuilderPost?.author || null,
        published_date:
          body.published_date !== undefined
            ? body.published_date || null
            : existingBuilderPost?.published_date || null,
        featured_image_url:
          body.featured_image_url !== undefined
            ? body.featured_image_url || null
            : existingBuilderPost?.featured_image_url || null,
        content: payload,
      })
      .eq("id", toDatabasePageId(postId))
      .select(POST_SELECT)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to update post.", code: error?.code, error },
        { status: 400 },
      );
    }

    const post = mapLegacyPostToPostConfig(data as LegacyPostRecord, site);
    return NextResponse.json(post);
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
    const postId = normalizePageId(id);

    if (!postId) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const adminClient = getContentAdminClient();
    const { post, site } = await loadLegacyPostAndSite(adminClient, postId);

    if (!post || !site) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const access = await ensureSiteAccess(request, adminClient, site.id);

    if (access.error) {
      return access.error;
    }

    const { error } = await adminClient
      .from("posts")
      .delete()
      .eq("id", toDatabasePageId(postId));

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
