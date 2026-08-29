import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("publishes the SVE bachelors guide in both supported locales", () => {
  expect(isBlogPostSlug("stardew-valley-expanded-bachelors-and-bachelorettes")).toBe(
    true,
  );
  expect(blogPostCanonicalPaths).toContain(
    "/stardew-valley-expanded-bachelors-and-bachelorettes/",
  );
  expect(blogPostCanonicalPaths).toContain(
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes/",
  );
});
