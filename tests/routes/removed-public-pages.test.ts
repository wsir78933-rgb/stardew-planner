import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { plannerMaps } from "../../src/maps/map-catalog";

const removedCanonicalPaths = [
  "/farm-comparison",
  "/mods",
  "/farm/standard",
  "/farm/riverland",
  "/farm/forest",
  "/farm/hilltop",
  "/farm/wilderness",
  "/farm/four-corners",
  "/farm/beach",
  "/farm/meadowlands",
] as const;

const expectedPlannerFarmMapIds = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

const removedLocalizedPaths = removedCanonicalPaths.flatMap((canonicalPath) => [
  canonicalPath,
  `/zh${canonicalPath}`,
]);

function listHtmlFiles(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap(
    (directoryEntry) => {
      const entryPath = join(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return listHtmlFiles(entryPath);
      }

      return directoryEntry.name.endsWith(".html") ? [entryPath] : [];
    },
  );
}

function listJavaScriptFiles(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap(
    (directoryEntry) => {
      const entryPath = join(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return listJavaScriptFiles(entryPath);
      }

      return directoryEntry.name.endsWith(".js") ? [entryPath] : [];
    },
  );
}

describe("removed public guide pages", () => {
  it("keeps every planner farm map while removing guide identities", () => {
    const plannerFarmMapIds = plannerMaps
      .filter(({ category, id }) =>
        category === "farm" && expectedPlannerFarmMapIds.includes(id as never),
      )
      .map(({ id }) => id);

    expect(plannerFarmMapIds).toEqual(expectedPlannerFarmMapIds);
    expect(canonicalPublicPaths).toHaveLength(8);
    expect(getLocalizedPublicRouteEntries()).toHaveLength(16);
    expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(6);

    for (const removedCanonicalPath of removedCanonicalPaths) {
      expect(canonicalPublicPaths).not.toContain(removedCanonicalPath);
    }
  });

  it("does not export or advertise any removed English or Chinese page", () => {
    const outputDirectory = join(process.cwd(), "out");
    const sitemapXml = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");
    const llmsText = readFileSync(join(outputDirectory, "llms.txt"), "utf8");
    const exportedHtmlFiles = listHtmlFiles(outputDirectory);

    expect([...sitemapXml.matchAll(/<loc>/g)]).toHaveLength(6);

    for (const removedLocalizedPath of removedLocalizedPaths) {
      const removedStaticPagePath = join(
        outputDirectory,
        `${removedLocalizedPath.slice(1)}.html`,
      );

      expect(
        existsSync(removedStaticPagePath),
        `Unexpected removed page artifact: ${removedStaticPagePath}`,
      ).toBe(false);
      expect(sitemapXml).not.toContain(
        `https://stardewvalleyplanner.art${removedLocalizedPath}`,
      );
      expect(llmsText).not.toContain(
        `https://stardewvalleyplanner.art${removedLocalizedPath}`,
      );

      for (const exportedHtmlFile of exportedHtmlFiles) {
        const exportedHtml = readFileSync(exportedHtmlFile, "utf8");

        expect(
          exportedHtml,
          `Unexpected href to ${removedLocalizedPath} in ${relative(
            outputDirectory,
            exportedHtmlFile,
          )}`,
        ).not.toContain(`href="${removedLocalizedPath}"`);
      }
    }
  });

  it("does not ship retired page copy in static client assets", () => {
    const staticDirectory = join(process.cwd(), "out", "_next", "static");
    const staticJavaScriptFiles = listJavaScriptFiles(staticDirectory);

    for (const retiredCopy of [
      "Choose a farm type before you plan",
      "规划前先选择农场类型",
      "Stardew Valley Farm Types: Compare All 8 Maps",
      "Stardew Valley Farm Map Mods | Stardew Planner",
      "星露谷物语农场类型对比：8 种地图怎么选",
      "星露谷物语农场地图 Mod | 星露谷规划器",
    ]) {
      const copiedToStaticAsset = staticJavaScriptFiles.some((filePath) =>
        readFileSync(filePath, "utf8").includes(retiredCopy),
      );

      expect(
        copiedToStaticAsset,
        `Retired copy was emitted to a static client asset: ${retiredCopy}`,
      ).toBe(false);
    }
  });
});
