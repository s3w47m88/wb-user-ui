import { isValidUuid, normalizePageId, slugify } from "./builder-pages";
import { PageConfig } from "./supabase-content";
import { getSupabaseControl } from "./supabase-control";

type PageServiceError = Error & {
  code?: string;
};

/**
 * Get the currently selected organization ID from localStorage
 */
function getSelectedOrganizationId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedOrganizationId");
}

async function buildAuthenticatedHeaders(contentType = false) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const supabaseControl = getSupabaseControl();
    const {
      data: { session },
    } = await supabaseControl.auth.getSession();

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error("Failed to read auth session for page request:", error);
  }

  return headers;
}

export async function savePage(
  pageConfig: Omit<PageConfig, "id" | "created_at" | "updated_at">,
) {
  const organizationId = getSelectedOrganizationId();

  if (!organizationId) {
    throw new Error(
      "No organization selected. Please select an organization first.",
    );
  }

  const slug = pageConfig.slug?.trim() || slugify(pageConfig.name || "page");

  const response = await fetch("/api/pages", {
    method: "POST",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify({
      ...(isValidUuid(pageConfig.site_id)
        ? { site_id: pageConfig.site_id }
        : {}),
      name: pageConfig.name,
      title: pageConfig.name,
      slug,
      components: pageConfig.components,
      theme: pageConfig.theme,
      organization_id: organizationId,
      site_domain: pageConfig.site_domain || null,
      use_temporary_domain: Boolean(pageConfig.use_temporary_domain),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Error saving page:", {
      error: result?.error,
      organizationId,
      status: response.status,
      message: result?.message,
    });
    throw new Error(
      `Failed to save page: ${result?.message || "Unknown error"}`,
    );
  }

  return result as PageConfig;
}

export async function updatePage(id: string, pageConfig: Partial<PageConfig>) {
  const siteId = isValidUuid(pageConfig.site_id)
    ? pageConfig.site_id
    : undefined;
  const pageId = normalizePageId(id);

  if (!pageId) {
    const error: PageServiceError = new Error("Invalid page ID.");
    error.code = "NOT_FOUND";
    throw error;
  }

  const response = await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify({
      ...(siteId ? { site_id: siteId } : {}),
      name: pageConfig.name,
      components: pageConfig.components,
      theme: pageConfig.theme,
      site_domain: pageConfig.site_domain,
      use_temporary_domain: pageConfig.use_temporary_domain,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: PageServiceError = new Error(
      `Failed to update page: ${result?.message || "Unknown error"}`,
    );
    error.code = response.status === 404 ? "NOT_FOUND" : result?.code;
    console.error("Error updating page:", {
      error: result?.error,
      pageId: id,
      code: error.code,
      message: result?.message,
      status: response.status,
    });
    throw error;
  }

  return result as PageConfig;
}

export async function loadPage(id: string) {
  const pageId = normalizePageId(id);

  if (!pageId) {
    throw new Error("Invalid page ID.");
  }

  const response = await fetch(`/api/pages/${pageId}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error("Error loading page:", {
      status: response.status,
      message: result?.message,
    });
    throw new Error(result?.message || "Failed to load page");
  }

  return result as PageConfig;
}

export async function loadPublicPage(id: string) {
  const pageId = normalizePageId(id);

  if (!pageId) {
    throw new Error("Invalid page ID.");
  }

  const response = await fetch(`/api/public/pages/${pageId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const result = await response.json();

  if (!response.ok) {
    console.error("Error loading public page:", {
      status: response.status,
      message: result?.message,
    });
    throw new Error(result?.message || "Failed to load page");
  }

  return result as PageConfig;
}

export async function listPages() {
  const pages = await getAllPages();
  return pages.map(({ id, name, created_at, updated_at }) => ({
    id,
    name,
    created_at,
    updated_at,
  }));
}

export async function getAllPages() {
  const organizationId = getSelectedOrganizationId();

  if (!organizationId) {
    return [];
  }

  const response = await fetch(
    `/api/pages?organization_id=${encodeURIComponent(organizationId)}`,
    {
      method: "GET",
      headers: await buildAuthenticatedHeaders(),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    console.error("Error getting all pages:", {
      status: response.status,
      message: result?.message,
    });
    return [];
  }

  return result as PageConfig[];
}

export async function deletePage(id: string) {
  const pageId = normalizePageId(id);

  if (!pageId) {
    throw new Error("Invalid page ID.");
  }

  const response = await fetch(`/api/pages/${pageId}`, {
    method: "DELETE",
    headers: await buildAuthenticatedHeaders(),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error("Error deleting page:", {
      status: response.status,
      message: result?.message,
    });
    throw new Error(result?.message || "Failed to delete page");
  }
}
