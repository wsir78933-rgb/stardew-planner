import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readStaticPageHtml } from "./static-export-test-support";

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

  it("retains frozen runtime assets as fixtures without making them production page dependencies", () => {
    expect(
      existsSync(join(process.cwd(), "public", "reference-runtime", "bootstrap.mjs")),
    ).toBe(true);
    expect(
      existsSync(join(process.cwd(), "public", "_app", "immutable")),
    ).toBe(true);
  });
});
