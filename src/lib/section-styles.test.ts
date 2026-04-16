import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSectionBackgroundStyle,
  buildSectionContainerStyle,
  defaultSectionStyleConfig,
  getSectionStyleConfig,
  withOpacity,
} from "./section-styles";

test("getSectionStyleConfig normalizes malformed section settings", () => {
  const config = getSectionStyleConfig({
    sectionStyle: {
      widthMode: "fixed",
      maxWidth: "960px",
      backgroundMode: "gradient",
      backgroundOpacity: 245,
      gradientDirection: "to bottom",
      backgroundSize: "contain",
      backgroundPosition: "top",
      heroEffect: "fog",
    },
  });

  assert.equal(config.widthMode, "fixed");
  assert.equal(config.maxWidth, "960px");
  assert.equal(config.backgroundMode, "gradient");
  assert.equal(config.backgroundOpacity, 100);
  assert.equal(config.gradientDirection, "to bottom");
  assert.equal(config.backgroundSize, "contain");
  assert.equal(config.backgroundPosition, "top");
  assert.equal(config.heroEffect, "none");
});

test("getSectionStyleConfig keeps valid hero effect values", () => {
  const config = getSectionStyleConfig({
    sectionStyle: {
      backgroundMode: "image",
      heroEffect: "cinematic",
    },
  });

  assert.equal(config.backgroundMode, "image");
  assert.equal(config.heroEffect, "cinematic");
});

test("buildSectionContainerStyle centers fixed width sections and preserves min height", () => {
  const config = {
    ...defaultSectionStyleConfig,
    widthMode: "fixed" as const,
    maxWidth: "1040px",
    marginTop: "2rem",
    marginBottom: "3rem",
    padding: "1rem 2rem",
  };

  assert.deepEqual(buildSectionContainerStyle(config, "500px"), {
    padding: "1rem 2rem",
    marginTop: "2rem",
    marginBottom: "3rem",
    width: "100%",
    maxWidth: "1040px",
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: "500px",
  });
});

test("buildSectionBackgroundStyle returns explicit gradient and image overrides", () => {
  const gradientStyle = buildSectionBackgroundStyle({
    ...defaultSectionStyleConfig,
    backgroundMode: "gradient",
    gradientFrom: "#112233",
    gradientTo: "#445566",
    gradientDirection: "to bottom",
    backgroundOpacity: 60,
  });

  assert.deepEqual(gradientStyle, {
    backgroundColor: "transparent",
    backgroundImage:
      "linear-gradient(to bottom, rgba(17, 34, 51, 0.6), rgba(68, 85, 102, 0.6))",
  });

  const imageStyle = buildSectionBackgroundStyle({
    ...defaultSectionStyleConfig,
    backgroundMode: "image",
    backgroundImage: "https://example.com/bg.jpg",
    backgroundColor: "#000000",
    backgroundOpacity: 30,
  });

  assert.deepEqual(imageStyle, {
    backgroundColor: "#000000",
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://example.com/bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  });
});

test("withOpacity keeps unknown color strings untouched", () => {
  assert.equal(withOpacity("var(--surface)", 40), "var(--surface)");
});
