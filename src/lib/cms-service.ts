import {
  CmsDocument,
  CmsDocumentBundle,
  DocumentType,
  MenuConfig,
  MenuItemConfig,
  PageConfig,
  PostConfig,
  SiteConfig,
} from "./supabase-content";

type PageServiceError = Error & {
  code?: string;
};

export type SiteCreateInput = {
  name: string;
  domain?: string | null;
  use_temporary_domain?: boolean;
  initial_page?: {
    name?: string;
    components?: PageConfig["components"];
    theme?: PageConfig["theme"];
  };
};

export type SiteUpdateInput = {
  name?: string | null;
  business_name?: string | null;
  logo_url?: string | null;
  brand_settings?: SiteConfig["brand_settings"];
};

export type PageSaveInput = {
  site_id: string;
  name: string;
  slug?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  excerpt?: string | null;
  status?: string | null;
  components: PageConfig["components"];
  theme: PageConfig["theme"];
};

export type PostSaveInput = {
  site_id: string;
  name: string;
  slug?: string;
  menu_title?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  excerpt?: string | null;
  status?: string | null;
  author?: string | null;
  published_date?: string | null;
  featured_image_url?: string | null;
  components: PostConfig["components"];
  theme: PostConfig["theme"];
};

export type MenuSaveInput = {
  site_id: string;
  name: string;
  slug?: string;
  description?: string | null;
};

type DocumentQuery = {
  siteId?: string | null;
  organizationId?: string | null;
};

type SiteResources = {
  pages: PageConfig[];
  posts: PostConfig[];
  menus: MenuConfig[];
};

export function getSelectedOrganizationId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

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
    const { getSupabaseControl } = await import("./supabase-control");
    const supabaseControl = getSupabaseControl();
    const {
      data: { session },
    } = await supabaseControl.auth.getSession();

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error("Failed to read auth session for CMS request:", error);
  }

  return headers;
}

async function parseJsonResponse<T>(response: Response) {
  const result = (await response.json()) as T & {
    message?: string;
    code?: string;
  };

  if (!response.ok) {
    const error: PageServiceError = new Error(
      result?.message || "Unexpected request failure.",
    );
    error.code = result?.code;
    throw error;
  }

  return result;
}

function buildQueryString(input: DocumentQuery) {
  const params = new URLSearchParams();

  if (input.siteId) {
    params.set("site_id", input.siteId);
  }

  if (input.organizationId) {
    params.set("organization_id", input.organizationId);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function resolveSiteResources(siteId: string): Promise<SiteResources> {
  const [pagesResult, postsResult, menusResult] = await Promise.allSettled([
    getPages({ siteId }),
    getPosts({ siteId }),
    getMenus(siteId),
  ]);

  if (pagesResult.status === "rejected") {
    console.error("Failed to load pages for site:", siteId, pagesResult.reason);
  }

  if (postsResult.status === "rejected") {
    console.error("Failed to load posts for site:", siteId, postsResult.reason);
  }

  if (menusResult.status === "rejected") {
    console.error("Failed to load menus for site:", siteId, menusResult.reason);
  }

  return {
    pages: pagesResult.status === "fulfilled" ? pagesResult.value : [],
    posts: postsResult.status === "fulfilled" ? postsResult.value : [],
    menus: menusResult.status === "fulfilled" ? menusResult.value : [],
  };
}

export async function listSites(organizationId = getSelectedOrganizationId()) {
  if (!organizationId) {
    return [];
  }

  const response = await fetch(
    `/api/sites?organization_id=${encodeURIComponent(organizationId)}`,
    {
      method: "GET",
      headers: await buildAuthenticatedHeaders(),
    },
  );

  return parseJsonResponse<SiteConfig[]>(response);
}

export async function createSite(input: SiteCreateInput) {
  const organizationId = getSelectedOrganizationId();

  if (!organizationId) {
    throw new Error("No organization selected. Please select an organization first.");
  }

  const response = await fetch("/api/sites", {
    method: "POST",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify({
      organization_id: organizationId,
      ...input,
    }),
  });

  return parseJsonResponse<{ site: SiteConfig; home_page: PageConfig }>(response);
}

export async function loadSite(id: string) {
  const response = await fetch(`/api/sites/${id}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<SiteConfig>(response);
}

export async function updateSite(id: string, input: SiteUpdateInput) {
  const response = await fetch(`/api/sites/${id}`, {
    method: "PATCH",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<SiteConfig>(response);
}

export async function getPages(query: DocumentQuery = {}) {
  const response = await fetch(`/api/pages${buildQueryString(query)}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<PageConfig[]>(response);
}

export async function createPage(input: PageSaveInput) {
  const response = await fetch("/api/pages", {
    method: "POST",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<PageConfig>(response);
}

export async function loadPage(id: string) {
  const response = await fetch(`/api/pages/${id}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<PageConfig>(response);
}

export async function updatePage(id: string, input: Partial<PageSaveInput>) {
  const response = await fetch(`/api/pages/${id}`, {
    method: "PATCH",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<PageConfig>(response);
}

export async function deletePage(id: string) {
  const response = await fetch(`/api/pages/${id}`, {
    method: "DELETE",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<{ success: boolean }>(response);
}

export async function loadPublicPage(id: string) {
  const response = await fetch(`/api/public/pages/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return parseJsonResponse<PageConfig>(response);
}

export async function getPosts(query: DocumentQuery = {}) {
  const response = await fetch(`/api/posts${buildQueryString(query)}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<PostConfig[]>(response);
}

export async function createPost(input: PostSaveInput) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<PostConfig>(response);
}

export async function loadPost(id: string) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<PostConfig>(response);
}

export async function updatePost(id: string, input: Partial<PostSaveInput>) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<PostConfig>(response);
}

export async function deletePost(id: string) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<{ success: boolean }>(response);
}

export async function loadPublicPost(id: string) {
  const response = await fetch(`/api/public/posts/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return parseJsonResponse<PostConfig>(response);
}

export async function getMenus(siteId: string) {
  const response = await fetch(`/api/menus?site_id=${encodeURIComponent(siteId)}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<MenuConfig[]>(response);
}

export async function createMenu(input: MenuSaveInput) {
  const response = await fetch("/api/menus", {
    method: "POST",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<MenuConfig>(response);
}

export async function loadMenu(id: string) {
  const response = await fetch(`/api/menus/${id}`, {
    method: "GET",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<MenuConfig>(response);
}

export async function updateMenu(id: string, input: Partial<MenuSaveInput>) {
  const response = await fetch(`/api/menus/${id}`, {
    method: "PATCH",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify(input),
  });

  return parseJsonResponse<MenuConfig>(response);
}

export async function deleteMenu(id: string) {
  const response = await fetch(`/api/menus/${id}`, {
    method: "DELETE",
    headers: await buildAuthenticatedHeaders(),
  });

  return parseJsonResponse<{ success: boolean }>(response);
}

export async function replaceMenuItems(id: string, items: MenuItemConfig[]) {
  const response = await fetch(`/api/menus/${id}/items`, {
    method: "PUT",
    headers: await buildAuthenticatedHeaders(true),
    body: JSON.stringify({ items }),
  });

  return parseJsonResponse<MenuConfig>(response);
}

export async function loadDocumentBundle(
  documentType: DocumentType,
  documentId: string,
): Promise<CmsDocumentBundle> {
  const document =
    documentType === "post"
      ? ((await loadPost(documentId)) as CmsDocument)
      : ((await loadPage(documentId)) as CmsDocument);

  const siteId = document.site_id;

  if (!siteId) {
    return {
      site: null,
      document,
      pages: document.document_type === "page" ? [document] : [],
      posts: document.document_type === "post" ? [document] : [],
      menus: [],
    };
  }

  const [sites, siteResources] = await Promise.all([
    listSites(),
    resolveSiteResources(siteId),
  ]);

  return {
    site: sites.find((site) => site.id === siteId) ?? null,
    document,
    pages: siteResources.pages,
    posts: siteResources.posts,
    menus: siteResources.menus,
  };
}

export async function loadSiteResources(siteId: string) {
  return resolveSiteResources(siteId);
}
