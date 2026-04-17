import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicDocumentView } from "@/components/cms/PublicDocumentView";
import {
  loadPublicPageBySlug,
  resolveSiteForPublicRequest,
} from "@/lib/public-site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ site?: string }>;
};

async function loadRouteState(props: PageProps) {
  const [{ slug }, searchParams, headerStore] = await Promise.all([
    props.params,
    props.searchParams,
    headers(),
  ]);
  const site = await resolveSiteForPublicRequest({
    host: headerStore.get("host"),
    siteHint: searchParams.site,
  });

  if (!site?.id) {
    return null;
  }

  const bundle = await loadPublicPageBySlug(site.id, slug);

  if (!bundle.page) {
    return null;
  }

  return bundle;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const state = await loadRouteState(props);

  if (!state?.page) {
    return {};
  }

  return {
    title: state.page.meta_title || state.page.title || state.page.name,
    description: state.page.meta_description || state.page.excerpt || undefined,
    keywords: state.page.meta_keywords || undefined,
  };
}

export default async function PublicPageRoute(props: PageProps) {
  const state = await loadRouteState(props);

  if (!state?.page) {
    notFound();
  }

  return (
    <PublicDocumentView
      document={state.page}
      site={state.site}
      pages={state.pages}
      posts={state.posts}
      menus={state.menus}
    />
  );
}
