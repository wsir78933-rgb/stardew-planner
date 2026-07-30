import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const englishRouteFiles = [
  "app/(en)/layout.tsx",
  "app/(en)/page.tsx",
  "app/(en)/farm-comparison/page.tsx",
  "app/(en)/farm/[type]/page.tsx",
  "app/(en)/mods/page.tsx",
] as const;

const chineseRouteFiles = [
  "app/zh/layout.tsx",
  "app/zh/page.tsx",
  "app/zh/farm-comparison/page.tsx",
  "app/zh/farm/[type]/page.tsx",
  "app/zh/mods/page.tsx",
] as const;

const removedLegalRouteFiles = [
  "app/(en)/privacy/page.tsx",
  "app/(en)/terms/page.tsx",
  "app/zh/privacy/page.tsx",
  "app/zh/terms/page.tsx",
] as const;

describe("physical locale route trees", () => {
  it("keeps English at bare paths and provides matching /zh route files", () => {
    for (const routeFile of [...englishRouteFiles, ...chineseRouteFiles]) {
      expect(existsSync(join(process.cwd(), routeFile))).toBe(true);
    }

    expect(existsSync(join(process.cwd(), "app/en"))).toBe(false);

    for (const removedLegalRouteFile of removedLegalRouteFiles) {
      expect(existsSync(join(process.cwd(), removedLegalRouteFile))).toBe(false);
    }
  });
});
