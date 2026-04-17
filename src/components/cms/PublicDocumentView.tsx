import React from "react";
import Link from "next/link";
import { CmsDataProvider } from "./CmsDataContext";
import { EditableBlock } from "@/components/editor/EditableBlock";
import { CmsDocument, MenuConfig, PageConfig, PostConfig, SiteConfig } from "@/lib/supabase-content";

type PublicDocumentViewProps = {
  document: CmsDocument;
  site: SiteConfig | null;
  pages: PageConfig[];
  posts: PostConfig[];
  menus: MenuConfig[];
};

export const PublicDocumentView: React.FC<PublicDocumentViewProps> = ({
  document,
  site,
  pages,
  posts,
  menus,
}) => {
  return (
    <CmsDataProvider site={site} pages={pages} posts={posts} menus={menus}>
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200 bg-gray-900 px-6 py-4 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                {document.document_type}
              </p>
              <h1 className="mt-1 text-lg font-semibold">
                {document.title || document.name}
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              Open CMS
            </Link>
          </div>
        </div>

        {document.components
          .slice()
          .sort((left, right) => left.order - right.order)
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
  );
};
