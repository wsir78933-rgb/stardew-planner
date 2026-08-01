import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import {
  generateStaticParams,
  officialFarmTypes,
} from "../../app/(en)/farm/[type]/page";

const expectedOfficialFarmTypes = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

const expectedStaticPageFiles = [
  "index.html",
  "farm-comparison.html",
  "farm/standard.html",
  "farm/riverland.html",
  "farm/forest.html",
  "farm/hilltop.html",
  "farm/wilderness.html",
  "farm/four-corners.html",
  "farm/beach.html",
  "farm/meadowlands.html",
  "mods.html",
  "zh.html",
  "zh/farm-comparison.html",
  "zh/farm/standard.html",
  "zh/farm/riverland.html",
  "zh/farm/forest.html",
  "zh/farm/hilltop.html",
  "zh/farm/wilderness.html",
  "zh/farm/four-corners.html",
  "zh/farm/beach.html",
  "zh/farm/meadowlands.html",
  "zh/mods.html",
] as const;

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected static page file does not exist: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

describe("static reference-runtime routes", () => {
  it("exports static files without image optimization", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.images?.unoptimized).toBe(true);
  });

  it("generates exactly the eight official farm guide paths", () => {
    expect(officialFarmTypes).toEqual(expectedOfficialFarmTypes);
    expect(generateStaticParams()).toEqual(
      expectedOfficialFarmTypes.map((type) => ({ type })),
    );
  });

  it(
    "exports every static information route without an eager reference-runtime bootstrap",
    () => {
      for (const staticPageFile of expectedStaticPageFiles) {
        const staticPageHtml = readStaticPageHtml(staticPageFile);

        expect(staticPageHtml).not.toContain('id="reference-runtime-root"');
        expect(staticPageHtml).not.toContain(
          'src="/reference-runtime/bootstrap.mjs"',
        );
      }

      expect(existsSync(join(process.cwd(), "out", "privacy.html"))).toBe(false);
      expect(existsSync(join(process.cwd(), "out", "terms.html"))).toBe(false);
    },
  );
});
