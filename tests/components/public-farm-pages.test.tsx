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
      <FarmComparisonContent locale="en" />,
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
    const modMapMarkup = renderToStaticMarkup(<ModMapCardGrid locale="en" />);
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
      <FarmGuideContent locale="en" farmType="standard" />,
    );

    expect(guideMarkup).toContain('aria-label="Breadcrumb"');
    expect(guideMarkup).toContain(standardFarmGuide.previewSource);
    expect(guideMarkup).toContain("Tillable tiles");
    expect(guideMarkup).toContain("What makes it different");
    expect(guideMarkup).toContain(`href="/?farmType=${standardFarmGuide.id}"`);
    expect(guideMarkup).toContain("full comparison</a>.");
  });

  it("renders Chinese farm content and localized public entry points", () => {
    const comparisonMarkup = renderToStaticMarkup(
      <FarmComparisonContent locale="zh-CN" />,
    );
    const guideMarkup = renderToStaticMarkup(
      <FarmGuideContent locale="zh-CN" farmType="standard" />,
    );
    const modMapMarkup = renderToStaticMarkup(<ModMapCardGrid locale="zh-CN" />);

    expect(comparisonMarkup).toContain("快速对比");
    expect(comparisonMarkup).toContain("标准农场");
    expect(comparisonMarkup).toContain('href="/zh?farmType=standard"');
    expect(comparisonMarkup).toContain('href="/zh/farm/standard"');
    expect(guideMarkup).toContain("规划此农场");
    expect(guideMarkup).toContain('href="/zh?farmType=standard"');
    expect(modMapMarkup).toContain("沉浸式农场 2");
    expect(modMapMarkup).toContain("多人游戏");
    expect(modMapMarkup).toContain('href="/zh?farmType=if2r"');
  });
});
