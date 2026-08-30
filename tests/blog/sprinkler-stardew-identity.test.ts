import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared sprinkler article identity for both locales", () => {
  expect(isBlogPostSlug("sprinkler-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/sprinkler-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/sprinkler-stardew/");
});
