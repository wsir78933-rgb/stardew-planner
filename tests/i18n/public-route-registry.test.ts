import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("maps public identities to Chinese paths without legal routes", () => {
  expect(canonicalPublicPaths).toHaveLength(11);
  expect(canonicalPublicPaths).not.toContain("/privacy");
  expect(canonicalPublicPaths).not.toContain("/terms");
  expect(getLocalizedPublicPath("en", "/farm/standard")).toBe("/farm/standard");
  expect(getLocalizedPublicPath("zh-CN", "/")).toBe("/zh");
  expect(getLocalizedPublicPath("zh-CN", "/farm/standard")).toBe(
    "/zh/farm/standard",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(22);
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
  expect(() => getLocalizedPublicPath("en", "/privacy" as never)).toThrow(
    'Received: "/privacy"',
  );
});
