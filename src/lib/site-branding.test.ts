import assert from "node:assert/strict";
import test from "node:test";
import {
  buildImageGenerationPrompt,
  normalizeSiteBrandReferenceImages,
  normalizeSiteBrandSettings,
} from "./site-branding";

test("normalizeSiteBrandSettings fills empty brand settings", () => {
  assert.deepEqual(normalizeSiteBrandSettings(null), {
    tagline: "",
    description: "",
    audience: "",
    voice: "",
    visual_direction: "",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    reference_images: [],
  });
});

test("normalizeSiteBrandReferenceImages keeps valid references only", () => {
  assert.deepEqual(
    normalizeSiteBrandReferenceImages([
      { id: "logo-board", url: "https://example.com/logo.webp", label: "Logo board" },
      { id: "", url: "   ", label: "Ignore me" },
      "bad",
    ]),
    [
      {
        id: "logo-board",
        url: "https://example.com/logo.webp",
        label: "Logo board",
      },
    ],
  );
});

test("buildImageGenerationPrompt appends site brand context", () => {
  const prompt = buildImageGenerationPrompt({
    prompt: "A homepage hero image for launch week",
    site: {
      id: "site-1",
      name: "Northwind",
      logo_url: "https://example.com/logo.webp",
      brand_settings: {
        tagline: "Ship with confidence",
        description: "Freight software for modern teams",
        audience: "Operations leaders at mid-market logistics companies",
        voice: "Direct, calm, premium",
        visual_direction: "Industrial photography with high contrast and warm highlights",
        fonts: { heading: "Space Grotesk", body: "Inter" },
        reference_images: [],
      },
    },
    theme: {
      colors: {
        primary: "#111827",
        secondary: "#2563eb",
        background: "#ffffff",
        text: "#111827",
        accent: "#f59e0b",
      },
      fonts: {
        heading: "Space Grotesk",
        body: "Inter",
      },
      mode: "light",
    },
  });

  assert.match(prompt, /Site name: Northwind/);
  assert.match(prompt, /Requested image: A homepage hero image for launch week/);
});
