"use client";

import Link from "next/link";
import React from "react";
import { useCmsData } from "@/components/cms/CmsDataContext";
import { MenuItemConfig } from "@/lib/supabase-content";

export type MenuBlockProps = {
  menuId?: string;
  variant?: "inline" | "stacked" | "pills";
  alignment?: "left" | "center" | "right";
  showChildren?: boolean;
};

function buildHref(
  item: MenuItemConfig,
  lookup: {
    pageHref: Map<string, string>;
    postHref: Map<string, string>;
  },
) {
  if (item.target_type === "page") {
    return lookup.pageHref.get(item.page_id || "") || "#";
  }

  if (item.target_type === "post") {
    return lookup.postHref.get(item.post_id || "") || "#";
  }

  return item.url || "#";
}

function MenuLinkList({
  items,
  showChildren,
  variant,
  alignment,
  lookup,
}: {
  items: MenuItemConfig[];
  showChildren: boolean;
  variant: NonNullable<MenuBlockProps["variant"]>;
  alignment: NonNullable<MenuBlockProps["alignment"]>;
  lookup: {
    pageHref: Map<string, string>;
    postHref: Map<string, string>;
  };
}) {
  const justifyClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "right"
        ? "justify-end"
        : "justify-start";
  const itemClass =
    variant === "pills"
      ? "rounded-full border border-gray-300 px-4 py-2 hover:border-gray-900 hover:text-gray-900"
      : variant === "stacked"
        ? "rounded-lg px-3 py-2 hover:bg-gray-100"
        : "px-1 py-2 hover:text-gray-900";

  return (
    <div className={`flex flex-wrap gap-3 ${justifyClass}`}>
      {items.map((item) => {
        const href = buildHref(item, lookup);

        return (
          <div key={item.id} className="flex flex-col gap-2">
            <Link
              href={href}
              target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
              className={`text-sm font-medium text-gray-600 transition-colors ${itemClass}`}
            >
              {item.label}
            </Link>

            {showChildren && item.children.length > 0 && (
              <div className="ml-4 flex flex-col gap-2 border-l border-gray-200 pl-4">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={buildHref(child, lookup)}
                    target={child.open_in_new_tab ? "_blank" : undefined}
                    rel={
                      child.open_in_new_tab ? "noreferrer noopener" : undefined
                    }
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const MenuBlock: React.FC<MenuBlockProps> = ({
  menuId,
  variant = "inline",
  alignment = "left",
  showChildren = true,
}) => {
  const { menus, pages, posts } = useCmsData();
  const menu = menus.find((candidate) => candidate.id === menuId) ?? null;
  const pageHref = new Map(
    pages.map((page) => [
      page.id,
      page.slug === "home" ? "/" : `/${page.slug}`,
    ]),
  );
  const postHref = new Map(
    posts.map((post) => [post.id, `/blog/${post.slug}`]),
  );

  return (
    <nav className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      {menu ? (
        <MenuLinkList
          items={menu.items}
          showChildren={showChildren}
          variant={variant}
          alignment={alignment}
          lookup={{ pageHref, postHref }}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 px-5 py-4 text-sm text-gray-500">
          Select a menu to render navigation here.
        </div>
      )}
    </nav>
  );
};

export const menuBlockConfig = {
  type: "menu",
  name: "Menu",
  category: "components",
  defaultProps: {
    menuId: "",
    variant: "inline",
    alignment: "left",
    showChildren: true,
  },
  propsSchema: {
    menuId: { type: "menu-select", label: "Menu" },
    variant: {
      type: "select",
      label: "Variant",
      options: ["inline", "stacked", "pills"],
    },
    alignment: {
      type: "select",
      label: "Alignment",
      options: ["left", "center", "right"],
    },
    showChildren: { type: "boolean", label: "Show submenus" },
  },
};
