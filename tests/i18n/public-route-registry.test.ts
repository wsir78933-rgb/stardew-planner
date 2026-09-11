import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("maps public identities, including contact-only noindex routes, to Chinese paths", () => {
  expect(canonicalPublicPaths).toHaveLength(15);
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
  expect(getLocalizedPublicPath("en", "/stardew-valley-town-map")).toBe(
    "/stardew-valley-town-map",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-town-map")).toBe(
    "/zh/stardew-valley-town-map",
  );
  expect(getLocalizedPublicPath("en", "/where-is-stardew-valley-located")).toBe(
    "/where-is-stardew-valley-located",
  );
  expect(
    getLocalizedPublicPath("zh-CN", "/where-is-stardew-valley-located"),
  ).toBe("/zh/where-is-stardew-valley-located");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-expanded-bachelors-and-bachelorettes"),
  ).toBe("/stardew-valley-expanded-bachelors-and-bachelorettes");
  expect(
    getLocalizedPublicPath(
      "zh-CN",
      "/stardew-valley-expanded-bachelors-and-bachelorettes",
    ),
  ).toBe("/zh/stardew-valley-expanded-bachelors-and-bachelorettes");
  expect(getLocalizedPublicPath("en", "/sprinkler-stardew")).toBe(
    "/sprinkler-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/sprinkler-stardew")).toBe(
    "/zh/sprinkler-stardew",
  );
  expect(getLocalizedPublicPath("en", "/glasshouse-stardew-valley")).toBe(
    "/glasshouse-stardew-valley",
  );
  expect(getLocalizedPublicPath("zh-CN", "/glasshouse-stardew-valley")).toBe(
    "/zh/glasshouse-stardew-valley",
  );
  expect(getLocalizedPublicPath("en", "/oak-tree-stardew")).toBe(
    "/oak-tree-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/oak-tree-stardew")).toBe(
    "/zh/oak-tree-stardew",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(30);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(28);
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
  expect(indexablePathnames).toContain("/stardew-valley-town-map");
  expect(indexablePathnames).toContain("/zh/stardew-valley-town-map");
  expect(indexablePathnames).toContain("/where-is-stardew-valley-located");
  expect(indexablePathnames).toContain("/zh/where-is-stardew-valley-located");
  expect(indexablePathnames).toContain(
    "/stardew-valley-expanded-bachelors-and-bachelorettes",
  );
  expect(indexablePathnames).toContain(
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes",
  );
  expect(indexablePathnames).toContain("/sprinkler-stardew");
  expect(indexablePathnames).toContain("/zh/sprinkler-stardew");
  expect(indexablePathnames).toContain("/glasshouse-stardew-valley");
  expect(indexablePathnames).toContain("/zh/glasshouse-stardew-valley");
  expect(indexablePathnames).toContain("/oak-tree-stardew");
  expect(indexablePathnames).toContain("/zh/oak-tree-stardew");
});

it("registers the direct-entry blog routes", () => {
  expect(canonicalPublicPaths).toEqual(
    expect.arrayContaining([
      "/blog",
      "/blog/archive",
      "/carpenter-stardew",
      "/where-is-robin-stardew-valley",
      "/stardew-valley-npc",
      "/stardew-valley-town-map",
      "/where-is-stardew-valley-located",
      "/stardew-valley-expanded-bachelors-and-bachelorettes",
      "/sprinkler-stardew",
      "/glasshouse-stardew-valley",
      "/oak-tree-stardew",
    ]),
  );
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
