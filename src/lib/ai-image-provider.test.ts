import assert from "node:assert/strict";
import test from "node:test";
import {
  getConfiguredXAiApiKey,
  resolveXAiAspectRatio,
  resolveXAiResolution,
} from "@/lib/ai-image-provider";

test("getConfiguredXAiApiKey trims configured key", () => {
  assert.equal(
    getConfiguredXAiApiKey({ XAI_API_KEY: "  xai-key  " }),
    "xai-key",
  );
  assert.equal(getConfiguredXAiApiKey({ XAI_API_KEY: " " }), null);
});

test("resolveXAiAspectRatio maps square, landscape, portrait, and missing sizes", () => {
  assert.equal(resolveXAiAspectRatio({}), "auto");
  assert.equal(resolveXAiAspectRatio({ width: 1024, height: 1024 }), "1:1");
  assert.equal(resolveXAiAspectRatio({ width: 1536, height: 1024 }), "3:2");
  assert.equal(resolveXAiAspectRatio({ width: 1024, height: 1536 }), "2:3");
});

test("resolveXAiResolution maps larger images to 2k", () => {
  assert.equal(resolveXAiResolution({}), "1k");
  assert.equal(resolveXAiResolution({ width: 1024, height: 1024 }), "1k");
  assert.equal(resolveXAiResolution({ width: 1536, height: 1024 }), "2k");
});
