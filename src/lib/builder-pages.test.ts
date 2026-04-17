import test from "node:test";
import assert from "node:assert/strict";
import {
  BUILDER_BLOG_SLUG,
  createDefaultBlogPageDocument,
  defaultTheme,
  ensureUniqueSlug,
  mapLegacyPageToPageConfig,
  mapLegacyPostToPostConfig,
  normalizePageId,
  parseBuilderDocumentPayload,
  parseBuilderPagePayload,
  serializeBuilderDocumentPayload,
  serializeBuilderPagePayload,
} from "./builder-pages";

test("serialize and parse builder page payload round-trip", () => {
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
  assert.equal(payload.kind, "page");
});

test("serialize and parse builder post payload round-trip", () => {
  const content = serializeBuilderDocumentPayload({
    kind: "post",
    name: "Release Notes",
    components: [
      { id: "1", type: "text", props: { content: "<p>Hello</p>" }, order: 0 },
    ],
    theme: defaultTheme,
  });
  const payload = parseBuilderDocumentPayload(content, "post");

  assert.ok(payload);
  assert.equal(payload.kind, "post");
  assert.equal(payload.name, "Release Notes");
});

test("mapLegacyPageToPageConfig hydrates legacy html pages", () => {
  const mapped = mapLegacyPageToPageConfig(
    {
      id: 12,
      title: "Legacy Page",
      slug: "legacy",
      content: "<div>legacy html</div>",
      site_id: "946e24cb-3190-47d8-bc16-281986d7baf7",
      meta_title: "Legacy SEO Title",
      meta_description: "Legacy SEO Description",
      meta_keywords: "legacy, page",
      status: "published",
      excerpt: "Legacy summary",
    },
    {
      id: "946e24cb-3190-47d8-bc16-281986d7baf7",
      name: "Legacy Site",
      domain: "legacy.example.com",
    },
  );

  assert.ok(mapped);
  assert.equal(mapped.document_type, "page");
  assert.equal(mapped.slug, "legacy");
  assert.equal(mapped.meta_title, "Legacy SEO Title");
  assert.equal(mapped.components.length, 1);
  assert.equal(mapped.components[0]?.type, "text");
});

test("mapLegacyPostToPostConfig hydrates legacy html posts", () => {
  const mapped = mapLegacyPostToPostConfig({
    id: 8,
    title: "Legacy Post",
    slug: "legacy-post",
    content: "<p>Legacy post body</p>",
    site_id: "946e24cb-3190-47d8-bc16-281986d7baf7",
    excerpt: "Legacy post summary",
    author: "Editor",
    status: "published",
  });

  assert.ok(mapped);
  assert.equal(mapped.document_type, "post");
  assert.equal(mapped.slug, "legacy-post");
  assert.equal(mapped.author, "Editor");
  assert.equal(mapped.components[0]?.type, "text");
});

test("createDefaultBlogPageDocument includes post-list block", () => {
  const document = createDefaultBlogPageDocument("Acme");

  assert.equal(document.slug, BUILDER_BLOG_SLUG);
  assert.ok(document.components.some((component) => component.type === "post-list"));
});

test("ensureUniqueSlug increments duplicate slugs", () => {
  assert.equal(ensureUniqueSlug("about", ["about", "about-2"]), "about-3");
  assert.equal(ensureUniqueSlug("about", ["contact"]), "about");
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
