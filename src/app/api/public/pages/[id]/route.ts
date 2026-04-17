import { NextResponse } from "next/server";
import { mapLegacyPageToPageConfig } from "@/lib/builder-pages";
import { stripPrivateFormSettingsFromComponents } from "@/lib/form-delivery";
import {
  getContentAdminClient,
  loadLegacyPageAndSite,
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
    const { page, site } = await loadLegacyPageAndSite(adminClient, id);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const builderPage = mapLegacyPageToPageConfig(page, site);

    if (!builderPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...builderPage,
      components: stripPrivateFormSettingsFromComponents(builderPage.components),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
