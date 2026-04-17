"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadPublicPage } from "@/lib/page-service";
import { loadPublicPost } from "@/lib/cms-service";
import {
  CmsDocument,
  MenuConfig,
  PageConfig,
  PostConfig,
  SiteConfig,
} from "@/lib/supabase-content";
import { EditableBlock } from "@/components/editor/EditableBlock";
import { CmsDataProvider } from "@/components/cms/CmsDataContext";

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [document, setDocument] = useState<CmsDocument | null>(null);
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [posts, setPosts] = useState<PostConfig[]>([]);
  const [menus, setMenus] = useState<MenuConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const pageId = params.id as string;
        const requestedType = searchParams.get("type");
        const pageData =
          requestedType === "post"
            ? await loadPublicPost(pageId)
            : await loadPublicPage(pageId);
        setDocument(pageData);

        if (pageData.site_id) {
          const bundleResponse = await fetch(
            `/api/public/sites/${pageData.site_id}/bundle`,
          );

          if (bundleResponse.ok) {
            const bundle = (await bundleResponse.json()) as {
              site: SiteConfig | null;
              pages: PageConfig[];
              posts: PostConfig[];
              menus: MenuConfig[];
            };
            setSite(bundle.site);
            setPages(bundle.pages);
            setPosts(bundle.posts);
            setMenus(bundle.menus);
          }
        } else {
          setSite(null);
          setPages([]);
          setPosts([]);
          setMenus([]);
        }
      } catch (err) {
        console.error("Error loading page:", err);
        setError("Failed to load page. Please check the link and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The page you are looking for does not exist."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">{document.name}</span>
        </div>
        <Link
          href="/"
          className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Create Your Own
        </Link>
      </div>

      {/* Page Content */}
      <CmsDataProvider site={site} pages={pages} posts={posts} menus={menus}>
        <div>
          {document.components
            .sort((a, b) => a.order - b.order)
            .map((component) => (
              <EditableBlock
                key={component.id}
                component={component}
                disabled
                pageId={document.id}
                themeOverride={document.theme}
              />
            ))}
        </div>
      </CmsDataProvider>
    </div>
  );
}
