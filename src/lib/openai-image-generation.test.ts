import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGeneratedImageFileName,
  extractGeneratedImageBase64,
  getConfiguredOpenAiApiKey,
  resolveOpenAiImageSize,
} from "@/lib/openai-image-generation";

test("resolveOpenAiImageSize respects explicit supported size", () => {
  assert.equal(
    resolveOpenAiImageSize({ size: "1024x1536", width: 1536, height: 1024 }),
    "1024x1536",
  );
});

test("resolveOpenAiImageSize maps landscape and portrait dimensions", () => {
  assert.equal(
    resolveOpenAiImageSize({ width: 1600, height: 900 }),
    "1536x1024",
  );
  assert.equal(
    resolveOpenAiImageSize({ width: 900, height: 1600 }),
    "1024x1536",
  );
  assert.equal(
    resolveOpenAiImageSize({ width: 1200, height: 1200 }),
    "1024x1024",
  );
});

test("extractGeneratedImageBase64 returns first GPT image payload", () => {
  assert.equal(
    extractGeneratedImageBase64({
      data: [{ b64_json: "abc123" }],
    }),
    "abc123",
  );
  assert.equal(extractGeneratedImageBase64({ data: [{}] }), null);
});

test("buildGeneratedImageFileName sanitizes prompt text", () => {
  assert.equal(
    buildGeneratedImageFileName("Bold hero image for launch page!!!"),
    "bold-hero-image-for-launch-page.webp",
  );
});

test("getConfiguredOpenAiApiKey prefers OPENAI_API_KEY and trims whitespace", () => {
  assert.equal(
    getConfiguredOpenAiApiKey({
      OPENAI_API_KEY: "  sk-live-openai  ",
      REPLICATE_API_TOKEN: "legacy-token",
    }),
    "sk-live-openai",
  );
  assert.equal(
    getConfiguredOpenAiApiKey({
      OPENAI_API_KEY: "   ",
      REPLICATE_API_TOKEN: " legacy-token ",
    }),
    "legacy-token",
  );
  assert.equal(getConfiguredOpenAiApiKey({ OPENAI_API_KEY: "" }), null);
});
