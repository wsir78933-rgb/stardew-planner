import { expect, it } from "vitest";
import { canonicalPublicPaths } from "../../src/seo/canonical-public-routes";

const expectedBlogCanonicalPaths = [
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
] as const;

it("derives the remaining content and legal paths without planner query URLs", () => {
  expect(canonicalPublicPaths).toHaveLength(8);
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
  expect(new Set(canonicalPublicPaths).size).toBe(canonicalPublicPaths.length);
  expect(canonicalPublicPaths.every((pathname) => !/[?#]/.test(pathname))).toBe(
    true,
  );
});
