import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared trees article identity for both locales", () => {
  expect(isBlogPostSlug("stardew-valley-trees")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/stardew-valley-trees/");
  expect(blogPostCanonicalPaths).toContain("/zh/stardew-valley-trees/");
});
