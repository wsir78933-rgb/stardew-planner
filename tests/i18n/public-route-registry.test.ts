import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("maps public identities, including legal routes, to Chinese paths", () => {
  expect(canonicalPublicPaths).toHaveLength(13);
  expect(canonicalPublicPaths).toContain("/privacy");
  expect(canonicalPublicPaths).toContain("/terms");
  expect(getLocalizedPublicPath("en", "/farm/standard")).toBe("/farm/standard");
  expect(getLocalizedPublicPath("zh-CN", "/")).toBe("/zh");
  expect(getLocalizedPublicPath("en", "/privacy")).toBe("/privacy");
  expect(getLocalizedPublicPath("zh-CN", "/privacy")).toBe("/zh/privacy");
  expect(getLocalizedPublicPath("en", "/terms")).toBe("/terms");
  expect(getLocalizedPublicPath("zh-CN", "/terms")).toBe("/zh/terms");
  expect(getLocalizedPublicPath("zh-CN", "/farm/standard")).toBe(
    "/zh/farm/standard",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(26);
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
