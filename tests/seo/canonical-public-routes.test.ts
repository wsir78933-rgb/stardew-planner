import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  japaneseHomepagePathname,
} from "../../src/seo/canonical-public-routes";

const expectedBlogCanonicalPaths = [
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
  "/stardew-valley-trees",
  "/maple-tree-stardew",
  "/best-spring-crop-stardew",
  "/how-to-earn-money-stardew",
  "/rancher-or-tiller-stardew",
  "/summer-crops-stardew",
  "/fall-crops-stardew",
  "/do-you-have-to-water-trees-stardew",
  "/how-to-level-up-farming-stardew",
  "/last-day-to-plant-stardew",
  "/pine-tree-stardew",
  "/profit-margin-stardew",
  "/oak-tree-vs-maple-stardew",
  "/how-to-harvest-stardew-valley",
  "/how-to-get-gold-star-crops-stardew-valley",
  "/house-upgrade-stardew",
] as const;

it("derives the remaining content and legal paths without planner query URLs", () => {
  expect(canonicalPublicPaths).toHaveLength(60);
  expect(canonicalPublicPaths).toEqual(
    expect.arrayContaining([...expectedBlogCanonicalPaths]),
  );
  expect(canonicalPublicPaths).not.toContain("/?farmType=standard");
  expect(canonicalPublicPaths).not.toContain("/farm-comparison");
  expect(canonicalPublicPaths).not.toContain("/mods");
  expect(canonicalPublicPaths).not.toContain("/farm/meadowlands");
  expect(canonicalPublicPaths).toContain("/privacy");
  expect(canonicalPublicPaths).toContain("/terms");
  expect(canonicalPublicPaths).toContain("/contact");
  expect(canonicalPublicPaths).toContain("/tools");
  expect(canonicalPublicPaths).toContain("/tools/crop-profit");
  expect(canonicalPublicPaths).toContain("/tools/crop-growth");
  expect(canonicalPublicPaths).toContain("/tools/basic-processing-profit");
  expect(canonicalPublicPaths).toContain("/tools/machine-comparison");
  expect(canonicalPublicPaths).toContain("/tools/keg-processing");
  expect(canonicalPublicPaths).toContain("/tools/preserves-jar-processing");
  expect(canonicalPublicPaths).toContain("/tools/dehydrator-processing");
  expect(canonicalPublicPaths).toContain("/tools/keg-ingredient-ranking");
  expect(canonicalPublicPaths).toContain("/tools/cask-aging");
  expect(canonicalPublicPaths).toContain("/stardew-valley-beach-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-fish-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-river-farm-layout");
  expect(canonicalPublicPaths).toContain("/meadowlands-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-forest-farm-layout");
  expect(canonicalPublicPaths).toContain(
    "/stardew-valley-four-corners-farm-layout",
  );
  expect(canonicalPublicPaths).toContain(
    "/stardew-valley-frontier-farm-layout",
  );
  expect(canonicalPublicPaths).toContain("/stardew-valley-expanded-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-hilltop-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-wilderness-farm-layout");
  expect(canonicalPublicPaths).toContain("/stardew-greenhouse-layout");
  expect(canonicalPublicPaths).toContain("/stardew-valley-sprinkler-layout");
  expect(canonicalPublicPaths).toContain(
    "/stardew-valley-iridium-sprinkler-layout",
  );
  expect(canonicalPublicPaths).toContain(
    "/stardew-valley-quality-sprinkler-layout",
  );
  expect(canonicalPublicPaths).toContain("/stardew-valley-fruit-tree-layout");
  expect(canonicalPublicPaths).toContain("/stardew-greenhouse-tree-layout");
  expect(canonicalPublicPaths).toContain("/sprinkler-stardew");
  expect(new Set(canonicalPublicPaths).size).toBe(canonicalPublicPaths.length);
  expect(canonicalPublicPaths.every((pathname) => !/[?#]/.test(pathname))).toBe(
    true,
  );
  expect(japaneseHomepagePathname).toBe("/ja");
  expect(canonicalPublicPaths).not.toContain(japaneseHomepagePathname);
});
