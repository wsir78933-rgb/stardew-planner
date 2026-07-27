import { createElement } from "react";
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
      createElement(FarmComparisonContent),
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
    const modMapMarkup = renderToStaticMarkup(createElement(ModMapCardGrid));
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
    expect(guideMarkup).toContain(`href="/?farmType=${standardFarmGuide.id}"`);
  });
});
