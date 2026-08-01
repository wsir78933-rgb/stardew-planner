import { expect, it } from "vitest";
import { canonicalPublicPaths } from "../../src/seo/canonical-public-routes";

it("derives eight guide paths without planner query URLs", () => {
  expect(canonicalPublicPaths).toHaveLength(11);
  expect(canonicalPublicPaths).toContain("/farm/meadowlands");
  expect(canonicalPublicPaths).not.toContain("/?farmType=standard");
  expect(canonicalPublicPaths).not.toContain("/privacy");
  expect(canonicalPublicPaths).not.toContain("/terms");
  expect(new Set(canonicalPublicPaths).size).toBe(canonicalPublicPaths.length);
  expect(canonicalPublicPaths.every((pathname) => !/[?#]/.test(pathname))).toBe(
    true,
  );
});
