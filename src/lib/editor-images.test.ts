import assert from "node:assert/strict";
import test from "node:test";
import {
  buildImageUpdate,
  getEditableImageUrl,
  normalizeImagesProp,
} from "./editor-images";

test("normalizeImagesProp leaves raw image URLs unchanged", () => {
  const url = "https://cdn.example.com/image.jpg";

  assert.equal(normalizeImagesProp(url), url);
});

test("normalizeImagesProp parses JSON gallery payloads", () => {
  const parsed = normalizeImagesProp(
    '[{"url":"https://cdn.example.com/one.jpg","alt":"One"}]',
  );

  assert.deepEqual(parsed, [
    { url: "https://cdn.example.com/one.jpg", alt: "One" },
  ]);
});

test("buildImageUpdate replaces only the selected gallery image", () => {
  const props = {
    title: "Gallery",
    images: [
      { url: "https://cdn.example.com/one.jpg", alt: "One" },
      { url: "https://cdn.example.com/two.jpg", alt: "Two" },
      { url: "https://cdn.example.com/three.jpg", alt: "Three" },
    ],
  };

  const update = buildImageUpdate(
    props,
    { key: "images", index: 1 },
    "https://cdn.example.com/replaced.jpg",
  );

  assert.deepEqual(update, {
    images: [
      { url: "https://cdn.example.com/one.jpg", alt: "One" },
      { url: "https://cdn.example.com/replaced.jpg", alt: "Two" },
      { url: "https://cdn.example.com/three.jpg", alt: "Three" },
    ],
  });
});

test("getEditableImageUrl reads gallery image URLs by index", () => {
  const props = {
    images: [
      { url: "https://cdn.example.com/one.jpg", alt: "One" },
      { url: "https://cdn.example.com/two.jpg", alt: "Two" },
    ],
  };

  assert.equal(
    getEditableImageUrl(props, { key: "images", index: 1 }),
    "https://cdn.example.com/two.jpg",
  );
});
