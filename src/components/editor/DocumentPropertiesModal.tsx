"use client";

import React from "react";
import { FileText, X } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { BrandedSelect } from "@/components/ui/BrandedSelect";

type DocumentPropertiesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DocumentPropertiesModal: React.FC<
  DocumentPropertiesModalProps
> = ({ isOpen, onClose }) => {
  const {
    documentType,
    pageName,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    excerpt,
    status,
    menuTitle,
    author,
    publishedDate,
    featuredImageUrl,
    setPageName,
    updateDocumentMeta,
    saveNow,
  } = useEditorStore();

  if (!isOpen) {
    return null;
  }

  const isPost = documentType === "post";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-white">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isPost ? "Post Properties" : "Page Properties"}
              </h2>
              <p className="text-sm text-gray-500">
                Control browser title, search metadata, and publishing details.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              value={pageName}
              onChange={(event) => setPageName(event.target.value)}
              onBlur={saveNow}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              value={slug}
              onChange={(event) =>
                updateDocumentMeta({ slug: event.target.value })
              }
              onBlur={saveNow}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">
              Browser Title / Meta Title
            </span>
            <input
              value={metaTitle}
              onChange={(event) =>
                updateDocumentMeta({ metaTitle: event.target.value })
              }
              onBlur={saveNow}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">
              Meta Description
            </span>
            <textarea
              value={metaDescription}
              onChange={(event) =>
                updateDocumentMeta({ metaDescription: event.target.value })
              }
              onBlur={saveNow}
              rows={4}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">
              Meta Keywords
            </span>
            <input
              value={metaKeywords}
              onChange={(event) =>
                updateDocumentMeta({ metaKeywords: event.target.value })
              }
              onBlur={saveNow}
              placeholder="keyword one, keyword two"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(event) =>
                updateDocumentMeta({ excerpt: event.target.value })
              }
              onBlur={saveNow}
              rows={4}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <BrandedSelect
              value={status}
              onChange={(event) =>
                updateDocumentMeta({
                  status: event.target.value as
                    | "draft"
                    | "published"
                    | "archived",
                })
              }
              onBlur={saveNow}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </BrandedSelect>
          </label>

          {isPost ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Menu Title
                </span>
                <input
                  value={menuTitle}
                  onChange={(event) =>
                    updateDocumentMeta({ menuTitle: event.target.value })
                  }
                  onBlur={saveNow}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Author
                </span>
                <input
                  value={author}
                  onChange={(event) =>
                    updateDocumentMeta({ author: event.target.value })
                  }
                  onBlur={saveNow}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Published Date
                </span>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(event) =>
                    updateDocumentMeta({ publishedDate: event.target.value })
                  }
                  onBlur={saveNow}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">
                  Featured Image URL
                </span>
                <input
                  value={featuredImageUrl}
                  onChange={(event) =>
                    updateDocumentMeta({
                      featuredImageUrl: event.target.value,
                    })
                  }
                  onBlur={saveNow}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </label>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
