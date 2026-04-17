"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FilePlus2,
  FolderOpen,
  LayoutTemplate,
  MenuSquare,
  Newspaper,
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";
import {
  createPage,
  createPost,
  createSite,
  listSites,
  loadSiteResources,
  loadPage,
  loadPost,
} from "@/lib/cms-service";
import { createDefaultHomePageDocument } from "@/lib/builder-pages";
import { MenuConfig, PageConfig, PostConfig, SiteConfig } from "@/lib/supabase-content";
import { useEditorStore } from "@/store/editor-store";
import { MenuBuilderModal } from "./MenuBuilderModal";

type CmsNavigatorProps = {
  isOpen: boolean;
  onClose: () => void;
  onCmsMutated: () => void;
};

type NavigatorTab = "pages" | "posts" | "menus";

type CreateMode = "site" | "page" | "post" | null;

type CreateDraft = {
  name: string;
  domain: string;
  useTemporaryDomain: boolean;
};

const INITIAL_DRAFT: CreateDraft = {
  name: "",
  domain: "",
  useTemporaryDomain: true,
};

export const CmsNavigator: React.FC<CmsNavigatorProps> = ({
  isOpen,
  onClose,
  onCmsMutated,
}) => {
  const {
    siteId: currentSiteId,
    currentPageId,
    documentType,
    loadPage: loadPageToStore,
    loadPost: loadPostToStore,
    setSiteId,
  } = useEditorStore();
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(currentSiteId);
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [posts, setPosts] = useState<PostConfig[]>([]);
  const [menus, setMenus] = useState<MenuConfig[]>([]);
  const [tab, setTab] = useState<NavigatorTab>("pages");
  const [loading, setLoading] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [draft, setDraft] = useState<CreateDraft>(INITIAL_DRAFT);
  const [menuBuilderId, setMenuBuilderId] = useState<string | null>(null);
  const activeSite =
    sites.find((site) => site.id === selectedSiteId) || null;

  const refreshAll = useCallback(
    async (nextSiteId?: string | null) => {
      setLoading(true);

      try {
        const nextSites = await listSites();
        setSites(nextSites);

        const resolvedSiteId =
          nextSiteId ||
          selectedSiteId ||
          currentSiteId ||
          nextSites[0]?.id ||
          null;

        setSelectedSiteId(resolvedSiteId);

        if (resolvedSiteId) {
          const { pages: nextPages, posts: nextPosts, menus: nextMenus } =
            await loadSiteResources(resolvedSiteId);

          setPages(nextPages);
          setPosts(nextPosts);
          setMenus(nextMenus);
        } else {
          setPages([]);
          setPosts([]);
          setMenus([]);
        }
      } catch (error) {
        console.error("Failed to refresh CMS navigator:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentSiteId, selectedSiteId],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void refreshAll();
  }, [isOpen, refreshAll]);

  const selectedItems = useMemo(() => {
    if (tab === "pages") {
      return pages;
    }

    if (tab === "posts") {
      return posts;
    }

    return menus;
  }, [menus, pages, posts, tab]);

  if (!isOpen) {
    return null;
  }

  const handleSelectPage = async (page: PageConfig) => {
    const fullPage = await loadPage(page.id);
    setSiteId(fullPage.site_id || null);
    loadPageToStore(fullPage);
    onCmsMutated();
    onClose();
  };

  const handleSelectPost = async (post: PostConfig) => {
    const fullPost = await loadPost(post.id);
    setSiteId(fullPost.site_id || null);
    loadPostToStore(fullPost);
    onCmsMutated();
    onClose();
  };

  const handleCreate = async () => {
    if (!draft.name.trim()) {
      return;
    }

    try {
      if (createMode === "site") {
        const defaultPage = createDefaultHomePageDocument(draft.name);
        const createdSite = await createSite({
          name: draft.name.trim(),
          domain: draft.useTemporaryDomain ? null : draft.domain.trim(),
          use_temporary_domain: draft.useTemporaryDomain,
          initial_page: {
            name: draft.name.trim(),
            components: defaultPage.components,
            theme: defaultPage.theme,
          },
        });

        setSiteId(createdSite.site.id || null);
        loadPageToStore(createdSite.home_page);
        setCreateMode(null);
        setDraft(INITIAL_DRAFT);
        await refreshAll(createdSite.site.id || null);
        onCmsMutated();
        onClose();
        return;
      }

      if (!selectedSiteId) {
        return;
      }

      if (createMode === "page") {
        const createdPage = await createPage({
          site_id: selectedSiteId,
          name: draft.name.trim(),
          components: [],
          theme: useEditorStore.getState().theme,
        });
        loadPageToStore(createdPage);
      }

      if (createMode === "post") {
        const createdPost = await createPost({
          site_id: selectedSiteId,
          name: draft.name.trim(),
          components: [],
          theme: useEditorStore.getState().theme,
        });
        loadPostToStore(createdPost);
      }

      setCreateMode(null);
      setDraft(INITIAL_DRAFT);
      await refreshAll(selectedSiteId);
      onCmsMutated();
      onClose();
    } catch (error) {
      console.error("Failed to create CMS resource:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-6xl overflow-hidden rounded-l-[2rem] border-l border-gray-200 bg-white shadow-2xl">
        <div className="flex w-80 flex-col border-r border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">CMS Navigator</h2>
                <p className="text-sm text-gray-500">
                  Sites, pages, posts, and menus.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <button
              onClick={() => {
                setCreateMode("site");
                setDraft(INITIAL_DRAFT);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus size={14} />
              New Site
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    setSelectedSiteId(site.id || null);
                    setSiteId(site.id || null);
                    void refreshAll(site.id || null);
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selectedSiteId === site.id
                      ? "border-gray-900 bg-white"
                      : "border-transparent bg-transparent hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
                      <FolderOpen size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-gray-900">
                        {site.name}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        {site.domain || site.slug}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {sites.length === 0 && !loading ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-sm text-gray-500">
                  No sites yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {activeSite?.name || "Select a site"}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeSite?.domain || activeSite?.slug || "Choose a site to manage content."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => void refreshAll()}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  <RefreshCcw size={14} />
                  Refresh
                </button>

                {selectedSiteId ? (
                  <>
                    <button
                      onClick={() => {
                        setCreateMode("page");
                        setDraft(INITIAL_DRAFT);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <FilePlus2 size={14} />
                      New Page
                    </button>
                    <button
                      onClick={() => {
                        setCreateMode("post");
                        setDraft(INITIAL_DRAFT);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                      <Newspaper size={14} />
                      New Post
                    </button>
                    <button
                      onClick={() => setMenuBuilderId("")}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                      <MenuSquare size={14} />
                      Build Menu
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { id: "pages", label: "Pages", icon: LayoutTemplate },
                { id: "posts", label: "Posts", icon: Newspaper },
                { id: "menus", label: "Menus", icon: MenuSquare },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id as NavigatorTab)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedSiteId ? (
              <div className="space-y-3">
                {tab === "pages" &&
                  pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => void handleSelectPage(page)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                        documentType === "page" && currentPageId === page.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-900"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {page.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          /{page.slug}
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        {page.status}
                      </div>
                    </button>
                  ))}

                {tab === "posts" &&
                  posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => void handleSelectPost(post)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                        documentType === "post" && currentPageId === post.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-900"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {post.title || post.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          /blog/{post.slug}
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        {post.status}
                      </div>
                    </button>
                  ))}

                {tab === "menus" &&
                  menus.map((menu) => (
                    <button
                      key={menu.id}
                      onClick={() => setMenuBuilderId(menu.id)}
                      className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-left transition-colors hover:border-gray-900"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {menu.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          /{menu.slug}
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        {menu.items.length} items
                      </div>
                    </button>
                  ))}

                {selectedItems.length === 0 && !loading ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-20 text-center text-sm text-gray-500">
                    No {tab} yet for this site.
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-20 text-center text-sm text-gray-500">
                Select a site to manage pages, posts, and menus.
              </div>
            )}
          </div>
        </div>
      </div>

      {createMode ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {createMode === "site"
                  ? "Create Site"
                  : createMode === "page"
                    ? "Create Page"
                    : "Create Post"}
              </h3>
              <button
                onClick={() => {
                  setCreateMode(null);
                  setDraft(INITIAL_DRAFT);
                }}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </label>

              {createMode === "site" ? (
                <>
                  <label className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={draft.useTemporaryDomain}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          useTemporaryDomain: event.target.checked,
                        }))
                      }
                    />
                    Use temporary domain
                  </label>
                  {!draft.useTemporaryDomain ? (
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">
                        Domain
                      </span>
                      <input
                        value={draft.domain}
                        onChange={(event) =>
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            domain: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                      />
                    </label>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCreateMode(null);
                  setDraft(INITIAL_DRAFT);
                }}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreate()}
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MenuBuilderModal
        isOpen={menuBuilderId !== null}
        siteId={selectedSiteId}
        pages={pages}
        posts={posts}
        menus={menus}
        initialMenuId={menuBuilderId || null}
        onClose={() => setMenuBuilderId(null)}
        onSaved={() => {
          void refreshAll(selectedSiteId);
          onCmsMutated();
        }}
      />
    </>
  );
};
