import assert from "node:assert/strict";
import test from "node:test";
import {
  buildImageUploadPath,
  replaceImageFileExtension,
  sanitizeImageFileName,
  validateImageFile,
} from "./image-upload";

test("sanitizeImageFileName strips punctuation and extension", () => {
  assert.equal(
    sanitizeImageFileName("My Campaign Hero (Final).png"),
    "my-campaign-hero-final",
  );
});

test("replaceImageFileExtension normalizes extension", () => {
  assert.equal(
    replaceImageFileExtension("Candidate.Headshot.JPG", "webp"),
    "candidate-headshot.webp",
  );
});

test("buildImageUploadPath uses sanitized site, page, and file name", () => {
  assert.equal(
    buildImageUploadPath({
      extension: "webp",
      now: new Date("2026-04-16T21:00:00.000Z"),
      originalName: "Hero Banner!!.png",
      pageId: "Page Alpha",
      siteId: "Site Bravo",
      uuid: "fixed-id",
    }),
    "site-bravo/page-alpha/2026/04/fixed-id-hero-banner.webp",
  );
});

test("validateImageFile rejects unsupported mime types", () => {
  assert.equal(
    validateImageFile({ size: 512, type: "application/pdf" }),
    "Use PNG, JPG, WEBP, GIF, or AVIF image file.",
  );
});

test("validateImageFile rejects files larger than 10MB", () => {
  assert.equal(
    validateImageFile({ size: 10 * 1024 * 1024 + 1, type: "image/png" }),
    "Image must be 10MB or smaller.",
  );
});

test("validateImageFile accepts supported image files within size limit", () => {
  assert.equal(validateImageFile({ size: 1024, type: "image/webp" }), null);
});
