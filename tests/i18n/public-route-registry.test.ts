import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";

it("maps public identities, including contact-only noindex routes, to Chinese paths", () => {
  expect(canonicalPublicPaths).toHaveLength(9);
  expect(canonicalPublicPaths).toContain("/privacy");
  expect(canonicalPublicPaths).toContain("/terms");
  expect(canonicalPublicPaths).toContain("/contact");
  expect(getLocalizedPublicPath("zh-CN", "/")).toBe("/zh");
  expect(getLocalizedPublicPath("en", "/privacy")).toBe("/privacy");
  expect(getLocalizedPublicPath("zh-CN", "/privacy")).toBe("/zh/privacy");
  expect(getLocalizedPublicPath("en", "/terms")).toBe("/terms");
  expect(getLocalizedPublicPath("zh-CN", "/terms")).toBe("/zh/terms");
  expect(getLocalizedPublicPath("en", "/contact")).toBe("/contact");
  expect(getLocalizedPublicPath("zh-CN", "/contact")).toBe("/zh/contact");
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
  expect(getLocalizedPublicPath("en", "/stardew-valley-npc")).toBe(
    "/stardew-valley-npc",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-npc")).toBe(
    "/zh/stardew-valley-npc",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(18);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(16);
  const indexablePathnames = getLocalizedIndexablePublicRouteEntries().map(
    ({ pathname }) => pathname,
  );
  expect(indexablePathnames).not.toContain("/contact");
  expect(indexablePathnames).not.toContain("/zh/contact");
  expect(indexablePathnames).toContain("/blog");
  expect(indexablePathnames).toContain("/zh/blog");
  expect(indexablePathnames).toContain("/carpenter-stardew");
  expect(indexablePathnames).toContain("/zh/carpenter-stardew");
  expect(indexablePathnames).toContain("/stardew-valley-npc");
  expect(indexablePathnames).toContain("/zh/stardew-valley-npc");
});

it("registers the direct-entry blog routes without adding them to the public navigation", () => {
  expect(canonicalPublicPaths).toEqual(
    expect.arrayContaining([
      "/blog",
      "/blog/archive",
      "/carpenter-stardew",
      "/where-is-robin-stardew-valley",
      "/stardew-valley-npc",
    ]),
  );

  for (const locale of ["en", "zh-CN"] as const) {
    expect(getPublicPageCopy(locale).navigation.map(({ path }) => path)).not.toContain(
      "/blog",
    );
  }
});

it("returns absolute paired language alternates", () => {
  expect(createPublicLanguageAlternates("/privacy")).toEqual({
    en: "https://stardewvalleyplanner.art/privacy",
    "zh-CN": "https://stardewvalleyplanner.art/zh/privacy",
    "x-default": "https://stardewvalleyplanner.art/privacy",
  });
});

it("rejects locale and canonical path values outside the public registry", () => {
  expect(() => getLocalizedPublicPath("fr" as never, "/privacy")).toThrow(
    'Received: "fr"',
  );
  expect(() => getLocalizedPublicPath("en", "/missing" as never)).toThrow(
    'Received: "/missing"',
  );
});
