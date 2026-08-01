import { describe, expect, it } from "vitest";
import { metadata as plannerMetadata } from "../../app/(en)/page";
import { farmComparisonMetadata } from "../../app/(en)/farm-comparison/page";
import { generateMetadata } from "../../app/(en)/farm/[type]/page";
import { modsMetadata } from "../../app/(en)/mods/page";
import { metadata as chinesePlannerMetadata } from "../../app/zh/page";
import { farmComparisonMetadata as chineseFarmComparisonMetadata } from "../../app/zh/farm-comparison/page";
import {
  dynamicParams as chineseFarmDynamicParams,
  generateMetadata as generateChineseFarmMetadata,
  generateStaticParams as generateChineseFarmStaticParams,
} from "../../app/zh/farm/[type]/page";
import { modsMetadata as chineseModsMetadata } from "../../app/zh/mods/page";
import {
  officialFarmGuides,
  officialFarmTypes,
} from "../../src/reference/official-farm-guides";

const fixedInformationPageMetadataExpectations = [
  [
    farmComparisonMetadata,
    "Stardew Valley Farm Types Compared",
    "Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.",
    "https://stardewvalleyplanner.art/farm-comparison",
  ],
  [
    modsMetadata,
    "Modded Stardew Valley Farms",
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    "https://stardewvalleyplanner.art/mods",
  ],
] as const;

const publicPageMetadataExpectations = [
  [plannerMetadata, "/"],
  [farmComparisonMetadata, "/farm-comparison"],
  [modsMetadata, "/mods"],
] as const;

function createExpectedLanguageAlternates(pathname: string) {
  const englishUrl = `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;
  const chineseUrl = `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`;

  return {
    en: englishUrl,
    "zh-CN": chineseUrl,
    "x-default": englishUrl,
  };
}

describe("public route metadata", () => {
  it("uses exact title, description, and canonical metadata for fixed information pages", () => {
    for (const [pageMetadata, title, description, canonical] of fixedInformationPageMetadataExpectations) {
      expect(pageMetadata).toMatchObject({
        title,
        description,
        alternates: { canonical },
      });
    }
  });

  it("generates exact metadata for every official farm guide", async () => {
    for (const farmType of officialFarmTypes) {
      const farmGuide = officialFarmGuides[farmType];

      await expect(
        generateMetadata({ params: Promise.resolve({ type: farmType }) }),
      ).resolves.toMatchObject({
        title: `${farmGuide.title} | Stardew Valley Farm Planner`,
        description: `${farmGuide.title} farm guide. ${farmGuide.bestFor}`,
        alternates: {
          canonical: `https://stardewvalleyplanner.art/farm/${farmType}`,
        },
      });
    }
  });

  it("publishes paired language alternates for every English public route", async () => {
    for (const [pageMetadata, pathname] of publicPageMetadataExpectations) {
      expect(pageMetadata.alternates).toMatchObject({
        canonical: `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`,
        languages: createExpectedLanguageAlternates(pathname),
      });
    }

    for (const farmType of officialFarmTypes) {
      await expect(
        generateMetadata({ params: Promise.resolve({ type: farmType }) }),
      ).resolves.toMatchObject({
        alternates: {
          canonical: `https://stardewvalleyplanner.art/farm/${farmType}`,
          languages: createExpectedLanguageAlternates(`/farm/${farmType}`),
        },
      });
    }
  });

  it("assigns Chinese fixed public pages their localized canonicals and language alternates", () => {
    for (const [pageMetadata, pathname] of [
      [chinesePlannerMetadata, "/"],
      [chineseFarmComparisonMetadata, "/farm-comparison"],
      [chineseModsMetadata, "/mods"],
    ] as const) {
      expect(pageMetadata.alternates).toMatchObject({
        canonical: `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`,
        languages: createExpectedLanguageAlternates(pathname),
      });
    }
  });

  it("generates every Chinese official farm metadata entry at its localized path", async () => {
    expect(generateChineseFarmStaticParams()).toEqual(
      officialFarmTypes.map((type) => ({ type })),
    );
    expect(chineseFarmDynamicParams).toBe(false);

    for (const farmType of officialFarmTypes) {
      await expect(
        generateChineseFarmMetadata({
          params: Promise.resolve({ type: farmType }),
        }),
      ).resolves.toMatchObject({
        alternates: {
          canonical: `https://stardewvalleyplanner.art/zh/farm/${farmType}`,
          languages: createExpectedLanguageAlternates(`/farm/${farmType}`),
        },
      });
    }
  });
});
