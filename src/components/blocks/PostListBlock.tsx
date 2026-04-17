"use client";

import Link from "next/link";
import React from "react";
import { useCmsData } from "@/components/cms/CmsDataContext";

export type PostListBlockProps = {
  title?: string;
  layout?: "cards" | "list";
  limit?: number;
  showExcerpt?: boolean;
  showFeaturedImage?: boolean;
  showMeta?: boolean;
  anchorId?: string;
};

export const PostListBlock: React.FC<PostListBlockProps> = ({
  title = "Latest Posts",
  layout = "cards",
  limit = 6,
  showExcerpt = true,
  showFeaturedImage = true,
  showMeta = true,
  anchorId,
}) => {
  const { posts } = useCmsData();
  const visiblePosts = [...posts]
    .sort((left, right) => {
      const leftDate = left.published_date || left.updated_at || left.created_at || "";
      const rightDate =
        right.published_date || right.updated_at || right.created_at || "";

      return rightDate.localeCompare(leftDate);
    })
    .slice(0, Math.max(1, limit));

  return (
    <section id={anchorId} className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
              Blog
            </p>
            <h2 className="mt-2 text-4xl font-bold text-gray-900">{title}</h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            View all posts
          </Link>
        </div>

        {visiblePosts.length > 0 ? (
          <div
            className={
              layout === "list"
                ? "flex flex-col divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white"
                : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            }
          >
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className={
                  layout === "list"
                    ? "flex flex-col gap-3 px-6 py-5"
                    : "overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                }
              >
                {showFeaturedImage && post.featured_image_url && (
                  <div
                    className={
                      layout === "list"
                        ? "h-52 w-full rounded-2xl bg-cover bg-center"
                        : "h-52 w-full bg-cover bg-center"
                    }
                    style={{
                      backgroundImage: `url(${post.featured_image_url})`,
                    }}
                  />
                )}

                <div className={layout === "list" ? "" : "p-6"}>
                  {showMeta && (
                    <div className="mb-3 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                      {post.published_date && <span>{post.published_date}</span>}
                      {post.author && <span>{post.author}</span>}
                    </div>
                  )}

                  <h3 className="text-2xl font-semibold text-gray-900">
                    <Link href={`/blog/${post.slug}`}>{post.title || post.name}</Link>
                  </h3>

                  {showExcerpt && post.excerpt && (
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
                  >
                    Read post
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            Create your first blog post to populate this section.
          </div>
        )}
      </div>
    </section>
  );
};

export const postListBlockConfig = {
  type: "post-list",
  name: "Post List",
  category: "sections",
  defaultProps: {
    title: "Latest Posts",
    layout: "cards",
    limit: 6,
    showExcerpt: true,
    showFeaturedImage: true,
    showMeta: true,
    anchorId: "",
  },
  propsSchema: {
    title: { type: "text", label: "Title" },
    layout: {
      type: "select",
      label: "Layout",
      options: ["cards", "list"],
    },
    limit: { type: "number", label: "Post limit", min: 1, max: 24 },
    showExcerpt: { type: "boolean", label: "Show excerpt" },
    showFeaturedImage: { type: "boolean", label: "Show featured image" },
    showMeta: { type: "boolean", label: "Show post meta" },
    anchorId: { type: "text", label: "Anchor ID" },
  },
};
