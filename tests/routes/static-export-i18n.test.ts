import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  localizedStaticPages,
  readStaticPageHtml,
  staticExportDirectoryPath,
} from "./static-export-test-support";

type NativePublicPageSeoExpectation = Readonly<{
  outputPath: string;
  locale: "en" | "zh-CN";
  canonicalUrl: string;
  structuredDataType: "WebApplication" | "CollectionPage" | "Article";
}>;

const nativePublicPageSeoExpectations: readonly NativePublicPageSeoExpectation[] = [
  {
    outputPath: "index.html",
    locale: "en",
    canonicalUrl: "https://stardewvalleyplanner.art/",
    structuredDataType: "WebApplication",
  },
  {
    outputPath: "farm-comparison.html",
    locale: "en",
    canonicalUrl: "https://stardewvalleyplanner.art/farm-comparison",
    structuredDataType: "CollectionPage",
  },
  {
    outputPath: "farm/standard.html",
    locale: "en",
    canonicalUrl: "https://stardewvalleyplanner.art/farm/standard",
    structuredDataType: "Article",
  },
  {
    outputPath: "mods.html",
    locale: "en",
    canonicalUrl: "https://stardewvalleyplanner.art/mods",
    structuredDataType: "CollectionPage",
  },
  {
    outputPath: "zh.html",
    locale: "zh-CN",
    canonicalUrl: "https://stardewvalleyplanner.art/zh",
    structuredDataType: "WebApplication",
  },
  {
    outputPath: "zh/farm-comparison.html",
    locale: "zh-CN",
    canonicalUrl: "https://stardewvalleyplanner.art/zh/farm-comparison",
    structuredDataType: "CollectionPage",
  },
  {
    outputPath: "zh/farm/standard.html",
    locale: "zh-CN",
    canonicalUrl: "https://stardewvalleyplanner.art/zh/farm/standard",
    structuredDataType: "Article",
  },
  {
    outputPath: "zh/mods.html",
    locale: "zh-CN",
    canonicalUrl: "https://stardewvalleyplanner.art/zh/mods",
    structuredDataType: "CollectionPage",
  },
] as const;

function expectNativePlannerStaticPage(
  staticPageFile: string,
  workspaceLabel: string,
): void {
  const staticPageHtml = readStaticPageHtml(staticPageFile);

  expect(staticPageHtml).toContain(`aria-label="${workspaceLabel}"`);
  expect(staticPageHtml).toContain("data-planner-workspace");
  expect(staticPageHtml).not.toContain("reference-runtime-root");
  expect(staticPageHtml).not.toContain("/reference-runtime/bootstrap.mjs");
  expect(staticPageHtml).not.toContain("<iframe");
}

describe("localized static export", () => {
  it("exports English and Chinese planner pages as native workspaces without bootstrapping the frozen runtime", () => {
    expectNativePlannerStaticPage("index.html", "Stardew Planner");
    expectNativePlannerStaticPage("zh.html", "星露谷规划器");
  });

  it("exports canonical and hreflang metadata for English and Chinese farm guides", () => {
    const englishFarmGuideHtml = readStaticPageHtml("farm/standard.html");
    const chineseFarmGuideHtml = readStaticPageHtml("zh/farm/standard.html");

    expect(englishFarmGuideHtml).toContain(
      '<link rel="canonical" href="https://stardewvalleyplanner.art/farm/standard"',
    );
    expect(chineseFarmGuideHtml).toContain(
      '<link rel="canonical" href="https://stardewvalleyplanner.art/zh/farm/standard"',
    );

    const alternateReferences = [
      ['en', 'https://stardewvalleyplanner.art/farm/standard'],
      ['zh-CN', 'https://stardewvalleyplanner.art/zh/farm/standard'],
      ['x-default', 'https://stardewvalleyplanner.art/farm/standard'],
    ] as const;

    for (const farmGuideHtml of [englishFarmGuideHtml, chineseFarmGuideHtml]) {
      for (const [alternateLocale, alternateHref] of alternateReferences) {
        expect(farmGuideHtml).toContain(
          `hrefLang="${alternateLocale}" href="${alternateHref}"`,
        );
      }
    }
  });

  it("exports localized metadata and one matching JSON-LD schema for every representative native public page", () => {
    for (const pageExpectation of nativePublicPageSeoExpectations) {
      const staticPageHtml = readStaticPageHtml(pageExpectation.outputPath);

      expect(staticPageHtml).toContain(`<html lang="${pageExpectation.locale}"`);
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${pageExpectation.canonicalUrl}"`,
      );
      expect(staticPageHtml).toContain('hrefLang="en"');
      expect(staticPageHtml).toContain('hrefLang="zh-CN"');
      expect(staticPageHtml).toContain('<meta name="robots" content="index, follow"');
      expect(staticPageHtml).toContain(
        `<meta property="og:url" content="${pageExpectation.canonicalUrl}"`,
      );
      expect(staticPageHtml).toContain('name="twitter:card" content="summary"');
      expect(staticPageHtml).toContain('<link rel="icon" href="/favicon.png"');
      expect(staticPageHtml.match(/type="application\/ld\+json"/g)).toHaveLength(1);
      expect(staticPageHtml).toContain(`"@type":"${pageExpectation.structuredDataType}"`);
      expect(staticPageHtml).not.toContain("reference-runtime/bootstrap.mjs");
      expect(staticPageHtml).not.toContain("stardewplan.com");
      expect(staticPageHtml).not.toContain('property="og:image"');
      expect(staticPageHtml).not.toContain('name="twitter:image"');
    }
  });

  it("retains exactly the 22 native public pages and excludes the removed legal exports", () => {
    expect(localizedStaticPages).toHaveLength(22);

    for (const staticPage of localizedStaticPages) {
      expect(existsSync(join(staticExportDirectoryPath, staticPage.outputPath))).toBe(
        true,
      );
    }

    for (const removedLegalOutputPath of [
      "privacy.html",
      "terms.html",
      "zh/privacy.html",
      "zh/terms.html",
    ]) {
      expect(
        existsSync(join(staticExportDirectoryPath, removedLegalOutputPath)),
      ).toBe(false);
    }
  });

  it("exports the required localized social metadata without social image tags", () => {
    const englishComparisonHtml = readStaticPageHtml("farm-comparison.html");
    const chineseFarmGuideHtml = readStaticPageHtml("zh/farm/standard.html");
    const englishModsHtml = readStaticPageHtml("mods.html");

    expect(englishComparisonHtml).toContain(
      'property="og:description" content="Compare every official Stardew Valley farm map before planning your layout."',
    );
    expect(chineseFarmGuideHtml).toContain('type="application/ld+json"');
    expect(chineseFarmGuideHtml).toContain('"@type":"Article"');
    expect(englishModsHtml).toContain('name="twitter:card" content="summary"');
    expect(englishModsHtml).not.toContain('property="og:image"');
    expect(englishModsHtml).not.toContain('name="twitter:image"');
  });

  it("retains frozen runtime assets as fixtures without making them production page dependencies", () => {
    expect(
      existsSync(join(process.cwd(), "public", "reference-runtime", "bootstrap.mjs")),
    ).toBe(true);
    expect(
      existsSync(join(process.cwd(), "public", "_app", "immutable")),
    ).toBe(true);
  });
});
