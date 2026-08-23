import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("publishes the Stardew Valley NPC guide in both supported locales", () => {
  expect(isBlogPostSlug("stardew-valley-npc")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/stardew-valley-npc/");
  expect(blogPostCanonicalPaths).toContain("/zh/stardew-valley-npc/");
});
