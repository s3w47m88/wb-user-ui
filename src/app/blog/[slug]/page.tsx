import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicDocumentView } from "@/components/cms/PublicDocumentView";
import {
  loadPublicPostBySlug,
  resolveSiteForPublicRequest,
} from "@/lib/public-site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ site?: string }>;
};

async function loadBlogPostState(props: BlogPostPageProps) {
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

  const bundle = await loadPublicPostBySlug(site.id, slug);

  if (!bundle.post) {
    return null;
  }

  return bundle;
}

export async function generateMetadata(
  props: BlogPostPageProps,
): Promise<Metadata> {
  const state = await loadBlogPostState(props);

  if (!state?.post) {
    return {};
  }

  return {
    title: state.post.meta_title || state.post.title || state.post.name,
    description: state.post.meta_description || state.post.excerpt || undefined,
    keywords: state.post.meta_keywords || undefined,
  };
}

export default async function BlogPostRoute(props: BlogPostPageProps) {
  const state = await loadBlogPostState(props);

  if (!state?.post) {
    notFound();
  }

  return (
    <PublicDocumentView
      document={state.post}
      site={state.site}
      pages={state.pages}
      posts={state.posts}
      menus={state.menus}
    />
  );
}
