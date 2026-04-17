import { NextRequest, NextResponse } from "next/server";
import { isValidUuid } from "@/lib/builder-pages";
import { normalizeOrganizationName } from "@/lib/organization-management";
import {
  getAdminClient,
  getAuthenticatedUser,
  getOrganizationMembership,
} from "../helpers";

function getRouteOrganizationId(params: { id: string }) {
  return params.id;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authenticated = await getAuthenticatedUser(request);

    if (authenticated.error || !authenticated.user) {
      return authenticated.error;
    }

    const organizationId = getRouteOrganizationId(await params);

    if (!isValidUuid(organizationId)) {
      return NextResponse.json(
        { success: false, error: "Invalid organization id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const trimmedName = normalizeOrganizationName(body?.name);

    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: "Organization name is required" },
        { status: 400 },
      );
    }

    const adminClient = getAdminClient();
    const membership = await getOrganizationMembership(adminClient, {
      organizationId,
      userId: authenticated.user.id,
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 },
      );
    }

    if (membership.role !== "owner") {
      return NextResponse.json(
        { success: false, error: "Only owners can edit organizations" },
        { status: 403 },
      );
    }

    const { data: organization, error: updateError } = await adminClient
      .from("organizations")
      .update({ name: trimmedName })
      .eq("id", organizationId)
      .select("*")
      .single();

    if (updateError || !organization) {
      return NextResponse.json(
        {
          success: false,
          error: updateError?.message || "Failed to update organization",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      organization: {
        ...organization,
        role: membership.role,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Update organization error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authenticated = await getAuthenticatedUser(request);

    if (authenticated.error || !authenticated.user) {
      return authenticated.error;
    }

    const organizationId = getRouteOrganizationId(await params);

    if (!isValidUuid(organizationId)) {
      return NextResponse.json(
        { success: false, error: "Invalid organization id" },
        { status: 400 },
      );
    }

    const adminClient = getAdminClient();
    const membership = await getOrganizationMembership(adminClient, {
      organizationId,
      userId: authenticated.user.id,
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 },
      );
    }

    if (membership.role !== "owner") {
      return NextResponse.json(
        { success: false, error: "Only owners can delete organizations" },
        { status: 403 },
      );
    }

    const { error: deleteError } = await adminClient
      .from("organizations")
      .delete()
      .eq("id", organizationId);

    if (deleteError) {
      return NextResponse.json(
        {
          success: false,
          error: deleteError.message || "Failed to delete organization",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      deletedOrganizationId: organizationId,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Delete organization error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
