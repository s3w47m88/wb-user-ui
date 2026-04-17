import {
  createPage,
  createSite,
  deletePage as deletePageDocument,
  getPages,
  loadPage,
  loadPublicPage,
  updatePage,
} from "./cms-service";
import { slugify } from "./builder-pages";
import { PageConfig } from "./supabase-content";

export {
  loadPage,
  loadPublicPage,
  updatePage,
};

export async function savePage(
  pageConfig: Omit<PageConfig, "id" | "created_at" | "updated_at" | "document_type">,
) {
  if (pageConfig.site_id) {
    return createPage({
      site_id: pageConfig.site_id,
      name: pageConfig.name,
      slug: pageConfig.slug?.trim() || slugify(pageConfig.name || "page"),
      meta_title: pageConfig.meta_title,
      meta_description: pageConfig.meta_description,
      meta_keywords: pageConfig.meta_keywords,
      excerpt: pageConfig.excerpt,
      status: pageConfig.status,
      components: pageConfig.components,
      theme: pageConfig.theme,
    });
  }

  const createdSite = await createSite({
    name: pageConfig.name,
    domain: pageConfig.site_domain ?? null,
    use_temporary_domain: pageConfig.use_temporary_domain,
    initial_page: {
      name: pageConfig.name,
      components: pageConfig.components,
      theme: pageConfig.theme,
    },
  });

  return createdSite.home_page;
}

export async function listPages(siteId?: string) {
  const pages = await getAllPages(siteId);

  return pages.map(({ id, name, created_at, updated_at, site_id }) => ({
    id,
    name,
    site_id,
    created_at,
    updated_at,
  }));
}

export async function getAllPages(siteId?: string) {
  return getPages(siteId ? { siteId } : {});
}

export async function deletePage(id: string) {
  return deletePageDocument(id);
}
