import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFormEmailText,
  getDefaultIncludedFieldKeys,
  normalizeEmailList,
  parseIncludedFieldKeys,
  stripPrivateFormSettingsFromComponents,
} from "./form-delivery";

test("normalizeEmailList trims, validates, and deduplicates addresses", () => {
  assert.deepEqual(
    normalizeEmailList(
      " Campaign@Example.com,team@example.com\nteam@example.com;invalid ",
    ),
    ["campaign@example.com", "team@example.com"],
  );
});

test("parseIncludedFieldKeys falls back to defaults when config is invalid", () => {
  assert.deepEqual(
    parseIncludedFieldKeys("contact-form", "badKey"),
    getDefaultIncludedFieldKeys("contact-form"),
  );
});

test("buildFormEmailText only includes selected submitted fields", () => {
  const text = buildFormEmailText({
    formType: "volunteer-form",
    pageName: "Campaign Alpha",
    formTitle: "Join Our Team",
    intro: "New lead received.",
    includedFieldKeys: ["firstName", "email"],
    submission: {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      zipCode: "97201",
    },
  });

  assert.match(text, /New lead received\./);
  assert.match(text, /First Name: Ada/);
  assert.match(text, /Email: ada@example\.com/);
  assert.doesNotMatch(text, /Last Name:/);
  assert.doesNotMatch(text, /Zip Code:/);
});

test("stripPrivateFormSettingsFromComponents removes recipient settings from form blocks only", () => {
  const components = stripPrivateFormSettingsFromComponents([
    {
      id: "1",
      type: "contact-form",
      order: 0,
      props: {
        title: "Contact",
        notificationTo: "hidden@example.com",
        notificationCc: "cc@example.com",
      },
    },
    {
      id: "2",
      type: "hero",
      order: 1,
      props: {
        title: "Visible",
      },
    },
  ]);

  assert.equal("notificationTo" in components[0].props, false);
  assert.equal("notificationCc" in components[0].props, false);
  assert.equal(components[1].props.title, "Visible");
});
