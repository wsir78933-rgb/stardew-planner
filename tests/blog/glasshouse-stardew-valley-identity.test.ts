import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared glasshouse article identity for both locales", () => {
  expect(isBlogPostSlug("glasshouse-stardew-valley")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/glasshouse-stardew-valley/");
  expect(blogPostCanonicalPaths).toContain("/zh/glasshouse-stardew-valley/");
});
