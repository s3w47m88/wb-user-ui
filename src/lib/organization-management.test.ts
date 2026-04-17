import test from "node:test";
import assert from "node:assert/strict";
import {
  canManageOrganization,
  getNextSelectedOrganizationId,
  normalizeOrganizationName,
} from "./organization-management";

test("normalizeOrganizationName trims valid names", () => {
  assert.equal(normalizeOrganizationName("  The Portland Company  "), "The Portland Company");
  assert.equal(normalizeOrganizationName(""), "");
  assert.equal(normalizeOrganizationName(null), "");
});

test("canManageOrganization only allows owners", () => {
  assert.equal(canManageOrganization({ role: "owner" }), true);
  assert.equal(canManageOrganization({ role: "member" }), false);
  assert.equal(canManageOrganization({ role: null }), false);
});

test("getNextSelectedOrganizationId keeps selection when another org deleted", () => {
  assert.equal(
    getNextSelectedOrganizationId(
      [{ id: "org-1" }, { id: "org-2" }, { id: "org-3" }],
      "org-2",
      "org-1",
    ),
    "org-1",
  );
});

test("getNextSelectedOrganizationId falls to first remaining org", () => {
  assert.equal(
    getNextSelectedOrganizationId(
      [{ id: "org-1" }, { id: "org-2" }, { id: "org-3" }],
      "org-2",
      "org-2",
    ),
    "org-1",
  );
  assert.equal(
    getNextSelectedOrganizationId([{ id: "org-1" }], "org-1", "org-1"),
    null,
  );
});
