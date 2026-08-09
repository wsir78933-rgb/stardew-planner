import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FarmComparisonContent } from "../../src/components/farm-comparison-content";
import { FarmGuideContent } from "../../src/components/farm-guide-content";
import { ModMapCardGrid } from "../../src/components/mod-map-card-grid";
import {
  officialFarmGuides,
  officialFarmTypes,
} from "../../src/reference/official-farm-guides";
import { plannerMaps } from "../../src/maps/map-catalog";

function getStaticMarkupText(text: string): string {
  return text.replaceAll("'", "&#x27;");
}

describe("public farm pages", () => {
  it("renders every official farm with its local preview and planner entry point", () => {
    const comparisonMarkup = renderToStaticMarkup(
      createElement(FarmComparisonContent, { locale: "en" }),
    );

    expect(comparisonMarkup).toContain("Quick comparison");

    for (const farmType of officialFarmTypes) {
      const farmGuide = officialFarmGuides[farmType];

      expect(comparisonMarkup).toContain(`id="${farmType}"`);
      expect(comparisonMarkup).toContain(farmGuide.title);
      expect(comparisonMarkup).toContain(farmGuide.previewSource);
      expect(comparisonMarkup).toContain(`href="/?farmType=${farmType}"`);
      expect(comparisonMarkup).toContain(`href="/farm/${farmType}"`);
    }
  });

  it("renders every available community map with a local preview and planner entry point", () => {
    const modMapMarkup = renderToStaticMarkup(
      createElement(ModMapCardGrid, { locale: "en" }),
    );
    const communityMaps = plannerMaps.filter(
      (plannerMap) =>
        plannerMap.category === "community-farm" ||
        plannerMap.category === "community-interior",
    );

    for (const plannerMap of communityMaps) {
      expect(modMapMarkup).toContain(`id="${plannerMap.id}"`);
      expect(modMapMarkup).toContain(
        getStaticMarkupText(plannerMap.displayName),
      );
      expect(modMapMarkup).toContain(
        `/game-assets/1.6.15/${plannerMap.previewOutputPath}`,
      );
      expect(modMapMarkup).toContain(`href="/?farmType=${plannerMap.id}"`);
    }

    expect(modMapMarkup).not.toMatch(/ko[\s-]*fi|support|feedback/i);
  });

  it("renders one farm guide with its breadcrumb, map stats, features, and planner entry point", () => {
    const standardFarmGuide = officialFarmGuides.standard;
    const guideMarkup = renderToStaticMarkup(
      createElement(FarmGuideContent, {
        locale: "en",
        farmGuide: standardFarmGuide,
        otherFarmGuides: Object.values(officialFarmGuides).filter(
          (farmGuide) => farmGuide.id !== standardFarmGuide.id,
        ),
      }),
    );

    expect(guideMarkup).toContain('aria-label="Breadcrumb"');
    expect(guideMarkup).toContain(standardFarmGuide.previewSource);
    expect(guideMarkup).toContain("Tillable tiles");
    expect(guideMarkup).toContain("What makes it different");
    expect(guideMarkup).toContain(
      'href="/">Stardew Valley Farm Planner</a>',
    );
    expect(guideMarkup).toContain(`href="/?farmType=${standardFarmGuide.id}"`);
  });

  it("keeps Chinese planner links on the Chinese homepage while localizing public farm links", () => {
    const comparisonMarkup = renderToStaticMarkup(
      createElement(FarmComparisonContent, { locale: "zh-CN" }),
    );
    const guideMarkup = renderToStaticMarkup(
      createElement(FarmGuideContent, {
        locale: "zh-CN",
        farmGuide: officialFarmGuides.standard,
        otherFarmGuides: Object.values(officialFarmGuides).filter(
          (farmGuide) => farmGuide.id !== "standard",
        ),
      }),
    );
    const modMapMarkup = renderToStaticMarkup(
      createElement(ModMapCardGrid, { locale: "zh-CN" }),
    );

    expect(comparisonMarkup).toContain("标准农场");
    expect(comparisonMarkup).toContain('href="/zh/farm/standard"');
    expect(comparisonMarkup).toContain('href="/zh?farmType=standard"');
    expect(guideMarkup).toContain('href="/zh">星露谷规划器</a>');
    expect(guideMarkup).toContain('href="/zh/farm-comparison"');
    expect(guideMarkup).toContain('href="/zh/farm/riverland"');
    expect(guideMarkup).toContain('href="/zh?farmType=standard"');

    for (const plannerMap of plannerMaps) {
      if (
        plannerMap.category !== "community-farm" &&
        plannerMap.category !== "community-interior"
      ) {
        continue;
      }

      expect(modMapMarkup).toContain(`href="/zh?farmType=${plannerMap.id}"`);
    }

    expect(comparisonMarkup).not.toContain('href="/?farmType=');
    expect(guideMarkup).not.toContain('href="/?farmType=');
    expect(modMapMarkup).not.toContain('href="/?farmType=');
  });

  it("rejects an omitted locale instead of rendering an English comparison", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(
          FarmComparisonContent,
          {} as ComponentProps<typeof FarmComparisonContent>,
        ),
      ),
    ).toThrow("Unsupported public locale. Received: undefined.");
  });

  it("requires locale props at the type boundary", () => {
    // @ts-expect-error FarmComparisonContent must not infer an English locale.
    void <FarmComparisonContent />;
    // @ts-expect-error ModMapCardGrid must not infer an English locale.
    void <ModMapCardGrid />;
    // @ts-expect-error FarmGuideContent must not infer an English locale.
    void <FarmGuideContent farmGuide={officialFarmGuides.standard} otherFarmGuides={[]} />;
  });
});
