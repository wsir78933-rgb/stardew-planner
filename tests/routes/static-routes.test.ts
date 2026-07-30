import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import {
  generateStaticParams,
  officialFarmTypes,
} from "../../app/(en)/farm/[type]/page";
import {
  localizedStaticPages,
  readStaticPageHtml,
  staticExportDirectoryPath,
} from "./static-export-test-support";

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

describe("static localized routes", () => {
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

  it("exports every English and Chinese physical page with its declared locale without an /en tree", () => {
    expect(localizedStaticPages).toHaveLength(22);

    for (const staticPage of localizedStaticPages) {
      expect(readStaticPageHtml(staticPage.outputPath)).toContain(
        `<html lang="${staticPage.locale}"`,
      );
    }

    expect(existsSync(join(staticExportDirectoryPath, "en.html"))).toBe(false);
    expect(existsSync(join(staticExportDirectoryPath, "privacy.html"))).toBe(false);
    expect(existsSync(join(staticExportDirectoryPath, "terms.html"))).toBe(false);
    expect(existsSync(join(staticExportDirectoryPath, "zh/privacy.html"))).toBe(false);
    expect(existsSync(join(staticExportDirectoryPath, "zh/terms.html"))).toBe(false);
  });

  it("exports native localized markup without the frozen runtime bootstrap", () => {
    const englishFarmGuideHtml = readStaticPageHtml("farm/standard.html");
    const chineseFarmGuideHtml = readStaticPageHtml("zh/farm/standard.html");

    expect(englishFarmGuideHtml).toContain("Standard Farm");
    expect(chineseFarmGuideHtml).toContain("标准农场");
    expect(englishFarmGuideHtml).not.toContain("reference-runtime/bootstrap.mjs");
    expect(chineseFarmGuideHtml).not.toContain("reference-runtime/bootstrap.mjs");
  });
});
