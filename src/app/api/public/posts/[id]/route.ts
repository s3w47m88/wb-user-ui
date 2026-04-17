import { NextResponse } from "next/server";
import { mapLegacyPostToPostConfig } from "@/lib/builder-pages";
import {
  getContentAdminClient,
  loadLegacyPostAndSite,
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
    const { post, site } = await loadLegacyPostAndSite(adminClient, id);

    if (!post) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
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
