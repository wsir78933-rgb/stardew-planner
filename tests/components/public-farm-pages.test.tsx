import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FarmComparisonContent } from "../../src/components/farm-comparison-content";
import { FarmGuideContent } from "../../src/components/farm-guide-content";
import { ModMapCardGrid } from "../../src/components/mod-map-card-grid";
import { getLocalizedOfficialFarmComparisonCards } from "../../src/i18n/public-page-content";
import {
  officialFarmGuides,
  officialFarmTypes,
} from "../../src/reference/official-farm-guides";
import { getModFarmCards } from "../../src/reference/mod-farm-cards";
import { plannerMaps } from "../../src/maps/map-catalog";

function getStaticMarkupText(text: string): string {
  return text.replaceAll("'", "&#x27;");
}

describe("public farm pages", () => {
  it("renders every official farm with its local preview and planner entry point", () => {
    const comparisonMarkup = renderToStaticMarkup(
      createElement(FarmComparisonContent, { locale: "en" }),
    );

    expect(comparisonMarkup).toContain("Quick picks by play style");
    expect(comparisonMarkup.match(/data-farm-recommendation=/g)).toHaveLength(6);
    expect(comparisonMarkup).toContain("Quick comparison");
    expect(comparisonMarkup).toContain("How to read this comparison");
    expect(comparisonMarkup).toContain(
      'href="https://wiki.stardewvalley.net/Farm_Maps"',
    );
    expect(comparisonMarkup.match(/<strong>Best for:<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/<strong>Trade-off:<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/<strong>Plan around:<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/>Read farm guide<\/a>/g)).toHaveLength(8);

    const comparisonCards = getLocalizedOfficialFarmComparisonCards("en");

    for (const [index, farmType] of officialFarmTypes.entries()) {
      const farmGuide = officialFarmGuides[farmType];
      const comparisonCard = comparisonCards[index];

      expect(comparisonMarkup).toContain(`id="${farmType}"`);
      expect(comparisonMarkup).toContain(farmGuide.title);
      expect(comparisonMarkup).toContain(farmGuide.previewSource);
      expect(farmGuide.previewSource).toMatch(
        /^\/public-previews\/1\.6\.15\/.+\.webp$/,
      );
      expect(comparisonMarkup).toContain(`href="/?farmType=${farmType}"`);
      expect(comparisonMarkup).toContain(`href="/farm/${farmType}"`);
      expect(comparisonMarkup).toContain(getStaticMarkupText(comparisonCard.summary));
      expect(comparisonMarkup).toContain(getStaticMarkupText(comparisonCard.tradeoff));
      expect(comparisonMarkup).toContain(getStaticMarkupText(comparisonCard.planningNote));
      expect(comparisonMarkup.match(new RegExp(`href="/farm/${farmType}"`, "g"))).toHaveLength(2);
    }

    expect(
      comparisonMarkup.match(
        /<img(?=[^>]*loading="lazy")(?=[^>]*decoding="async")[^>]*>/g,
      ),
    ).toHaveLength(8);
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
    const modFarmCards = getModFarmCards();
    const farmSectionMarkup = modMapMarkup.match(
      /<section[^>]*data-mod-map-kind="farm"[\s\S]*?<\/section>/,
    )?.[0];
    const interiorSectionMarkup = modMapMarkup.match(
      /<section[^>]*data-mod-map-kind="interior"[\s\S]*?<\/section>/,
    )?.[0];

    expect(farmSectionMarkup).toBeDefined();
    expect(interiorSectionMarkup).toBeDefined();
    expect(farmSectionMarkup).toContain("Farm map mods");
    expect(interiorSectionMarkup).toContain("SVE interior spaces");
    expect(farmSectionMarkup?.match(/class="mod-farm-card"/g)).toHaveLength(18);
    expect(interiorSectionMarkup?.match(/class="mod-farm-card"/g)).toHaveLength(3);
    expect(modMapMarkup.match(/<strong>Best for:<\/strong>/g)).toHaveLength(21);
    expect(modMapMarkup.match(/<strong>Plan around:<\/strong>/g)).toHaveLength(21);
    expect(modMapMarkup.match(/>View source<\/a>/g)).toHaveLength(21);

    for (const plannerMap of communityMaps) {
      expect(modMapMarkup).toContain(`id="${plannerMap.id}"`);
      expect(modMapMarkup).toContain(
        getStaticMarkupText(plannerMap.displayName),
      );
      expect(modMapMarkup).toContain(`href="/?farmType=${plannerMap.id}"`);
    }

    for (const modFarmCard of modFarmCards) {
      expect(modFarmCard.previewSource).toMatch(
        /^\/public-previews\/1\.6\.15\/.+\.webp$/,
      );
      expect(modMapMarkup).toContain(modFarmCard.previewSource);
    }

    expect(
      modMapMarkup.match(
        /<img(?=[^>]*loading="lazy")(?=[^>]*decoding="async")[^>]*>/g,
      ),
    ).toHaveLength(21);

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

    expect(modMapMarkup).toContain("农场地图 Mod");
    expect(modMapMarkup).toContain("SVE 室内空间");
    expect(modMapMarkup.match(/<strong>适合：<\/strong>/g)).toHaveLength(21);
    expect(modMapMarkup.match(/<strong>规划时注意：<\/strong>/g)).toHaveLength(21);
    expect(modMapMarkup.match(/>查看来源<\/a>/g)).toHaveLength(21);

    expect(comparisonMarkup).toContain("标准农场");
    expect(comparisonMarkup).toContain("按玩法快速选择");
    expect(comparisonMarkup.match(/data-farm-recommendation=/g)).toHaveLength(6);
    expect(comparisonMarkup).toContain("本页数据说明");
    expect(comparisonMarkup.match(/<strong>适合：<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/<strong>取舍：<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/<strong>规划时注意：<\/strong>/g)).toHaveLength(8);
    expect(comparisonMarkup.match(/>查看农场指南<\/a>/g)).toHaveLength(8);
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
