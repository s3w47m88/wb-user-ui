"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ExternalLink,
  MenuSquare,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { slugify } from "@/lib/builder-pages";
import { BrandedSelect } from "@/components/ui/BrandedSelect";
import { createMenu, replaceMenuItems, updateMenu } from "@/lib/cms-service";
import {
  MenuConfig,
  MenuItemConfig,
  PageConfig,
  PostConfig,
} from "@/lib/supabase-content";

type MenuBuilderModalProps = {
  isOpen: boolean;
  siteId: string | null;
  pages: PageConfig[];
  posts: PostConfig[];
  menus: MenuConfig[];
  initialMenuId?: string | null;
  onClose: () => void;
  onSaved: () => void;
};

type MenuBuilderStep = 1 | 2 | 3;

function createEmptyItem(): MenuItemConfig {
  return {
    id: crypto.randomUUID(),
    label: "",
    target_type: "page",
    page_id: null,
    post_id: null,
    url: null,
    open_in_new_tab: false,
    sort_order: 0,
    children: [],
  };
}

function reorder<T>(items: T[], currentIndex: number, direction: -1 | 1) {
  const nextIndex = currentIndex + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(currentIndex, 1);
  nextItems.splice(nextIndex, 0, item);
  return nextItems;
}

function resolvePreviewHref(
  item: MenuItemConfig,
  pages: PageConfig[],
  posts: PostConfig[],
) {
  if (item.target_type === "page") {
    const page = pages.find((candidate) => candidate.id === item.page_id);
    return page ? (page.slug === "home" ? "/" : `/${page.slug}`) : "#";
  }

  if (item.target_type === "post") {
    const post = posts.find((candidate) => candidate.id === item.post_id);
    return post ? `/blog/${post.slug}` : "#";
  }

  return item.url || "#";
}

type MenuItemEditorProps = {
  item: MenuItemConfig;
  pages: PageConfig[];
  posts: PostConfig[];
  onChange: (item: MenuItemConfig) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddChild?: () => void;
};

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  item,
  pages,
  posts,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddChild,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">Menu Item</h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            className="rounded-full border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-full border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Label
          </span>
          <input
            value={item.label}
            onChange={(event) =>
              onChange({
                ...item,
                label: event.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Target type
          </span>
          <BrandedSelect
            value={item.target_type}
            onChange={(event) =>
              onChange({
                ...item,
                target_type: event.target
                  .value as MenuItemConfig["target_type"],
                page_id: null,
                post_id: null,
                url: null,
              })
            }
          >
            <option value="page">Page</option>
            <option value="post">Post</option>
            <option value="url">Custom URL</option>
          </BrandedSelect>
        </label>

        {item.target_type === "page" ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              Page target
            </span>
            <BrandedSelect
              value={item.page_id || ""}
              onChange={(event) =>
                onChange({
                  ...item,
                  page_id: event.target.value || null,
                })
              }
            >
              <option value="">Select page</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </BrandedSelect>
          </label>
        ) : null}

        {item.target_type === "post" ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              Post target
            </span>
            <BrandedSelect
              value={item.post_id || ""}
              onChange={(event) =>
                onChange({
                  ...item,
                  post_id: event.target.value || null,
                })
              }
            >
              <option value="">Select post</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title || post.name}
                </option>
              ))}
            </BrandedSelect>
          </label>
        ) : null}

        {item.target_type === "url" ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              URL
            </span>
            <input
              value={item.url || ""}
              onChange={(event) =>
                onChange({
                  ...item,
                  url: event.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </label>
        ) : null}

        <label className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 md:col-span-2">
          <input
            type="checkbox"
            checked={item.open_in_new_tab === true}
            onChange={(event) =>
              onChange({
                ...item,
                open_in_new_tab: event.target.checked,
              })
            }
          />
          Open in new tab
        </label>
      </div>

      {onAddChild ? (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              Submenu items
            </h5>
            <button
              type="button"
              onClick={onAddChild}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-2 text-xs font-semibold text-white"
            >
              <Plus size={12} />
              Add submenu
            </button>
          </div>

          <div className="space-y-3">
            {item.children.map((child, childIndex) => (
              <MenuItemEditor
                key={child.id}
                item={child}
                pages={pages}
                posts={posts}
                onChange={(nextChild) =>
                  onChange({
                    ...item,
                    children: item.children.map((currentChild) =>
                      currentChild.id === nextChild.id
                        ? nextChild
                        : currentChild,
                    ),
                  })
                }
                onRemove={() =>
                  onChange({
                    ...item,
                    children: item.children.filter(
                      (currentChild) => currentChild.id !== child.id,
                    ),
                  })
                }
                onMoveUp={() =>
                  onChange({
                    ...item,
                    children: reorder(item.children, childIndex, -1),
                  })
                }
                onMoveDown={() =>
                  onChange({
                    ...item,
                    children: reorder(item.children, childIndex, 1),
                  })
                }
              />
            ))}

            {item.children.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
                No submenu items yet.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const MenuBuilderModal: React.FC<MenuBuilderModalProps> = ({
  isOpen,
  siteId,
  pages,
  posts,
  menus,
  initialMenuId,
  onClose,
  onSaved,
}) => {
  const [step, setStep] = useState<MenuBuilderStep>(1);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<MenuItemConfig[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialMenuId) {
      const initialMenu =
        menus.find((menu) => menu.id === initialMenuId) || null;

      if (initialMenu) {
        setSelectedMenuId(initialMenu.id);
        setName(initialMenu.name);
        setSlug(initialMenu.slug);
        setDescription(initialMenu.description || "");
        setItems(initialMenu.items);
        setStep(2);
        return;
      }
    }

    setSelectedMenuId("");
    setName("");
    setSlug("");
    setDescription("");
    setItems([]);
    setStep(1);
  }, [initialMenuId, isOpen, menus]);

  if (!isOpen) {
    return null;
  }

  const handleSelectMenu = (menu: MenuConfig) => {
    setSelectedMenuId(menu.id);
    setName(menu.name);
    setSlug(menu.slug);
    setDescription(menu.description || "");
    setItems(menu.items);
    setStep(2);
  };

  const handleStartNewMenu = () => {
    setSelectedMenuId("");
    setName("");
    setSlug("");
    setDescription("");
    setItems([]);
    setStep(2);
  };

  const handleSave = async () => {
    if (!siteId || !name.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const savedMenu = selectedMenuId
        ? await updateMenu(selectedMenuId, {
            name: name.trim(),
            slug: slug.trim() || slugify(name),
            description: description.trim() || null,
          })
        : await createMenu({
            site_id: siteId,
            name: name.trim(),
            slug: slug.trim() || slugify(name),
            description: description.trim() || null,
          });

      await replaceMenuItems(savedMenu.id, items);
      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to save menu:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canPreview = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <MenuSquare size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Menu Builder
                </h2>
                <p className="text-sm text-gray-500">
                  Build reusable, two-level navigation for this site.
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

          <div className="mt-5 flex items-center gap-3 text-sm">
            {[1, 2, 3].map((value) => (
              <React.Fragment key={value}>
                <button
                  type="button"
                  onClick={() => {
                    if (value === 3 && !canPreview) {
                      return;
                    }
                    setStep(value as MenuBuilderStep);
                  }}
                  className={`rounded-full px-4 py-2 font-medium transition-colors ${
                    step === value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {value === 1
                    ? "Choose Menu"
                    : value === 2
                      ? "Edit Items"
                      : "Preview"}
                </button>
                {value < 3 ? (
                  <ChevronRight size={16} className="text-gray-300" />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {step === 1 ? (
            <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
              <div className="rounded-3xl border border-gray-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Existing Menus
                  </h3>
                  <button
                    type="button"
                    onClick={handleStartNewMenu}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Plus size={14} />
                    New Menu
                  </button>
                </div>

                <div className="space-y-3">
                  {menus.map((menu) => (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() => handleSelectMenu(menu)}
                      className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-gray-900"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {menu.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          /{menu.slug}
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        {menu.items.length} items
                      </span>
                    </button>
                  ))}

                  {menus.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
                      No menus yet.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Create New Menu
                </h3>
                <div className="space-y-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Name
                    </span>
                    <input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setSlug(slugify(event.target.value));
                      }}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Slug
                    </span>
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Description
                    </span>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!name.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Continue
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Menu Name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Slug
                  </span>
                  <input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Description
                  </span>
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Menu Items
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create primary navigation items and optional one-level
                    submenus.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setItems((currentItems) => [
                      ...currentItems,
                      createEmptyItem(),
                    ])
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus size={14} />
                  Add item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <MenuItemEditor
                    key={item.id}
                    item={item}
                    pages={pages}
                    posts={posts}
                    onChange={(nextItem) =>
                      setItems((currentItems) =>
                        currentItems.map((currentItem) =>
                          currentItem.id === nextItem.id
                            ? nextItem
                            : currentItem,
                        ),
                      )
                    }
                    onRemove={() =>
                      setItems((currentItems) =>
                        currentItems.filter(
                          (currentItem) => currentItem.id !== item.id,
                        ),
                      )
                    }
                    onMoveUp={() =>
                      setItems((currentItems) =>
                        reorder(currentItems, index, -1),
                      )
                    }
                    onMoveDown={() =>
                      setItems((currentItems) =>
                        reorder(currentItems, index, 1),
                      )
                    }
                    onAddChild={() =>
                      setItems((currentItems) =>
                        currentItems.map((currentItem) =>
                          currentItem.id === item.id
                            ? {
                                ...currentItem,
                                children: [
                                  ...currentItem.children,
                                  createEmptyItem(),
                                ],
                              }
                            : currentItem,
                        ),
                      )
                    }
                  />
                ))}

                {items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-16 text-center text-sm text-gray-500">
                    Add your first top-level menu item.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-3xl border border-gray-200 p-6">
                <div className="mb-6">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                    Preview
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {name}
                  </h3>
                  {description ? (
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                  ) : null}
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <MenuSquare size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {item.label || "Untitled item"}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          {resolvePreviewHref(item, pages, posts)}
                        </span>
                        {item.open_in_new_tab ? (
                          <ExternalLink size={14} className="text-gray-400" />
                        ) : null}
                      </div>
                      {item.children.length > 0 ? (
                        <div className="mt-4 ml-8 space-y-3 border-l border-gray-200 pl-4">
                          {item.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center gap-3 text-sm text-gray-600"
                            >
                              <ChevronRight
                                size={14}
                                className="text-gray-300"
                              />
                              <span>
                                {child.label || "Untitled submenu item"}
                              </span>
                              <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                {resolvePreviewHref(child, pages, posts)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
                      No items to preview yet.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Save Menu
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Save this menu and reuse it across any page with the Menu
                  component.
                </p>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between gap-3">
                    <span>Name</span>
                    <span className="font-medium text-gray-900">
                      {name || "Untitled Menu"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Slug</span>
                    <span className="font-medium text-gray-900">
                      {slug || slugify(name || "menu")}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Items</span>
                    <span className="font-medium text-gray-900">
                      {items.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !name.trim()}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Save size={14} />
                  {isSaving ? "Saving..." : "Save Menu"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
