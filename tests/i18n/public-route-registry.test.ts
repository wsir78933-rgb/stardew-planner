import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";

it("maps public identities, including legal and noindex contact routes, to Chinese paths", () => {
  expect(canonicalPublicPaths).toHaveLength(18);
  expect(canonicalPublicPaths).toContain("/privacy");
  expect(canonicalPublicPaths).toContain("/terms");
  expect(canonicalPublicPaths).toContain("/contact");
  expect(getLocalizedPublicPath("en", "/farm/standard")).toBe("/farm/standard");
  expect(getLocalizedPublicPath("zh-CN", "/")).toBe("/zh");
  expect(getLocalizedPublicPath("en", "/privacy")).toBe("/privacy");
  expect(getLocalizedPublicPath("zh-CN", "/privacy")).toBe("/zh/privacy");
  expect(getLocalizedPublicPath("en", "/terms")).toBe("/terms");
  expect(getLocalizedPublicPath("zh-CN", "/terms")).toBe("/zh/terms");
  expect(getLocalizedPublicPath("en", "/contact")).toBe("/contact");
  expect(getLocalizedPublicPath("zh-CN", "/contact")).toBe("/zh/contact");
  expect(getLocalizedPublicPath("zh-CN", "/farm/standard")).toBe(
    "/zh/farm/standard",
  );
  expect(getLocalizedPublicPath("en", "/blog")).toBe("/blog");
  expect(getLocalizedPublicPath("zh-CN", "/blog")).toBe("/zh/blog");
  expect(getLocalizedPublicPath("en", "/blog/archive")).toBe("/blog/archive");
  expect(getLocalizedPublicPath("zh-CN", "/blog/archive")).toBe(
    "/zh/blog/archive",
  );
  expect(getLocalizedPublicPath("en", "/carpenter-stardew")).toBe(
    "/carpenter-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/where-is-robin-stardew-valley")).toBe(
    "/zh/where-is-robin-stardew-valley",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(36);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(34);
  expect(
    getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => pathname),
  ).not.toContain("/contact");
});

it("registers the direct-entry blog routes without adding them to the public navigation", () => {
  expect(canonicalPublicPaths).toEqual(
    expect.arrayContaining([
      "/blog",
      "/blog/archive",
      "/carpenter-stardew",
      "/where-is-robin-stardew-valley",
    ]),
  );

  for (const locale of ["en", "zh-CN"] as const) {
    expect(getPublicPageCopy(locale).navigation.map(({ path }) => path)).not.toContain(
      "/blog",
    );
  }
});

it("returns absolute paired language alternates", () => {
  expect(createPublicLanguageAlternates("/mods")).toEqual({
    en: "https://stardewvalleyplanner.art/mods",
    "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
    "x-default": "https://stardewvalleyplanner.art/mods",
  });
});

it("rejects locale and canonical path values outside the public registry", () => {
  expect(() => getLocalizedPublicPath("fr" as never, "/mods")).toThrow(
    'Received: "fr"',
  );
  expect(() => getLocalizedPublicPath("en", "/missing" as never)).toThrow(
    'Received: "/missing"',
  );
});
