import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  blogPostSlugs,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("publishes the Stardew Valley NPC guide in both supported locales", () => {
  expect(blogPostSlugs).toEqual([
    "carpenter-stardew",
    "where-is-robin-stardew-valley",
    "stardew-valley-npc",
  ]);
  expect(isBlogPostSlug("stardew-valley-npc")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/stardew-valley-npc/");
  expect(blogPostCanonicalPaths).toContain("/zh/stardew-valley-npc/");
});
