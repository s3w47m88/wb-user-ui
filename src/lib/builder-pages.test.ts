import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultTheme,
  mapLegacyPageToPageConfig,
  normalizePageId,
  parseBuilderPagePayload,
  serializeBuilderPagePayload,
} from "./builder-pages";

test("serialize and parse builder payload round-trip", () => {
  const content = serializeBuilderPagePayload({
    name: "Campaign Alpha",
    components: [
      { id: "1", type: "hero", props: { title: "Hello" }, order: 0 },
    ],
    theme: {
      ...defaultTheme,
      colors: { ...defaultTheme.colors, primary: "#ff0000" },
    },
    siteDomain: "alpha.example.com",
    useTemporaryDomain: false,
  });
  const payload = parseBuilderPagePayload(content);

  assert.ok(payload);
  assert.equal(payload.name, "Campaign Alpha");
  assert.equal(payload.components.length, 1);
  assert.equal(payload.theme.colors.primary, "#ff0000");
  assert.equal(payload.siteDomain, "alpha.example.com");
  assert.equal(payload.useTemporaryDomain, false);
});

test("mapLegacyPageToPageConfig ignores non-builder content", () => {
  const mapped = mapLegacyPageToPageConfig({
    id: 12,
    title: "Legacy Page",
    slug: "legacy",
    content: "<div>legacy html</div>",
    site_id: "946e24cb-3190-47d8-bc16-281986d7baf7",
  });

  assert.equal(mapped, null);
});

test("normalizePageId accepts numeric and uuid ids only", () => {
  assert.equal(normalizePageId(42), "42");
  assert.equal(normalizePageId("123"), "123");
  assert.equal(
    normalizePageId("946e24cb-3190-47d8-bc16-281986d7baf7"),
    "946e24cb-3190-47d8-bc16-281986d7baf7",
  );
  assert.equal(normalizePageId("preview"), null);
  assert.equal(normalizePageId(""), null);
});
