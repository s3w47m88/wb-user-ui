import { MenuItemConfig, MenuTargetType } from "./supabase-content";

export type FlatMenuItemRecord = {
  id: string;
  menu_id: string;
  parent_item_id: string | null;
  label: string;
  target_type: MenuTargetType;
  page_id: string | null;
  post_id: string | null;
  url: string | null;
  open_in_new_tab: boolean | null;
  sort_order: number | null;
};

export type MenuItemDraft = {
  id: string;
  label: string;
  target_type: MenuTargetType;
  page_id?: string | null;
  post_id?: string | null;
  url?: string | null;
  open_in_new_tab?: boolean;
  children: MenuItemDraft[];
};

export function hydrateMenuTree(items: FlatMenuItemRecord[]) {
  const byId = new Map<string, MenuItemConfig>();
  const roots: MenuItemConfig[] = [];

  const sortedItems = [...items].sort((left, right) => {
    const leftOrder = left.sort_order ?? 0;
    const rightOrder = right.sort_order ?? 0;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.label.localeCompare(right.label);
  });

  for (const item of sortedItems) {
    byId.set(item.id, {
      id: item.id,
      label: item.label,
      target_type: item.target_type,
      page_id: item.page_id,
      post_id: item.post_id,
      url: item.url,
      open_in_new_tab: item.open_in_new_tab === true,
      sort_order: item.sort_order ?? 0,
      children: [],
    });
  }

  for (const item of sortedItems) {
    const current = byId.get(item.id);

    if (!current) {
      continue;
    }

    if (item.parent_item_id) {
      const parent = byId.get(item.parent_item_id);
      if (parent) {
        parent.children.push(current);
        continue;
      }
    }

    roots.push(current);
  }

  return roots;
}

export function flattenMenuTree(menuId: string, items: MenuItemDraft[]) {
  const flattened: Array<
    Omit<FlatMenuItemRecord, "sort_order"> & { sort_order: number }
  > = [];

  items.forEach((item, index) => {
    flattened.push({
      id: item.id,
      menu_id: menuId,
      parent_item_id: null,
      label: item.label.trim(),
      target_type: item.target_type,
      page_id: item.page_id ?? null,
      post_id: item.post_id ?? null,
      url: item.url?.trim() || null,
      open_in_new_tab: item.open_in_new_tab === true,
      sort_order: index,
    });

    item.children.forEach((child, childIndex) => {
      flattened.push({
        id: child.id,
        menu_id: menuId,
        parent_item_id: item.id,
        label: child.label.trim(),
        target_type: child.target_type,
        page_id: child.page_id ?? null,
        post_id: child.post_id ?? null,
        url: child.url?.trim() || null,
        open_in_new_tab: child.open_in_new_tab === true,
        sort_order: childIndex,
      });
    });
  });

  return flattened;
}

export function sanitizeMenuTree(items: MenuItemDraft[]) {
  return items
    .map((item) => ({
      ...item,
      label: item.label.trim(),
      url: item.url?.trim() || null,
      open_in_new_tab: item.open_in_new_tab === true,
      children: item.children
        .map((child) => ({
          ...child,
          label: child.label.trim(),
          url: child.url?.trim() || null,
          open_in_new_tab: child.open_in_new_tab === true,
          children: [],
        }))
        .filter((child) => child.label),
    }))
    .filter((item) => item.label);
}
