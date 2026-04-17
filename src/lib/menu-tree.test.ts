import test from "node:test";
import assert from "node:assert/strict";
import { flattenMenuTree, hydrateMenuTree, sanitizeMenuTree } from "./menu-tree";

test("hydrateMenuTree builds a two-level tree", () => {
  const tree = hydrateMenuTree([
    {
      id: "child-1",
      menu_id: "menu-1",
      parent_item_id: "root-1",
      label: "Child",
      target_type: "url",
      page_id: null,
      post_id: null,
      url: "/child",
      open_in_new_tab: false,
      sort_order: 0,
    },
    {
      id: "root-1",
      menu_id: "menu-1",
      parent_item_id: null,
      label: "Root",
      target_type: "page",
      page_id: "page-1",
      post_id: null,
      url: null,
      open_in_new_tab: false,
      sort_order: 0,
    },
  ]);

  assert.equal(tree.length, 1);
  assert.equal(tree[0]?.children.length, 1);
  assert.equal(tree[0]?.children[0]?.label, "Child");
});

test("flattenMenuTree preserves ordering and parent links", () => {
  const flattened = flattenMenuTree("menu-1", [
    {
      id: "root-1",
      label: "Root",
      target_type: "page",
      page_id: "page-1",
      post_id: null,
      url: null,
      open_in_new_tab: false,
      children: [
        {
          id: "child-1",
          label: "Child",
          target_type: "post",
          page_id: null,
          post_id: "post-1",
          url: null,
          open_in_new_tab: false,
          children: [],
        },
      ],
    },
  ]);

  assert.equal(flattened.length, 2);
  assert.equal(flattened[0]?.parent_item_id, null);
  assert.equal(flattened[1]?.parent_item_id, "root-1");
  assert.equal(flattened[1]?.sort_order, 0);
});

test("sanitizeMenuTree removes blank items", () => {
  const sanitized = sanitizeMenuTree([
    {
      id: "root-1",
      label: " ",
      target_type: "url",
      url: "/ignored",
      open_in_new_tab: false,
      children: [],
    },
    {
      id: "root-2",
      label: "Root",
      target_type: "url",
      url: " /root ",
      open_in_new_tab: true,
      children: [
        {
          id: "child-1",
          label: " ",
          target_type: "url",
          url: "/ignored-child",
          open_in_new_tab: false,
          children: [],
        },
      ],
    },
  ]);

  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0]?.url, "/root");
  assert.equal(sanitized[0]?.children.length, 0);
});
