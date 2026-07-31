import { describe, expect, it } from "vitest";
import { farmComparisonMetadata } from "../../app/farm-comparison/page";
import { generateMetadata } from "../../app/farm/[type]/page";
import { modsMetadata } from "../../app/mods/page";
import { privacyMetadata } from "../../app/privacy/page";
import { termsMetadata } from "../../app/terms/page";
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
  [
    privacyMetadata,
    "Privacy Policy",
    "Learn how this browser-local planner handles projects, preferences, and local data.",
    "https://stardewvalleyplanner.art/privacy",
  ],
  [
    termsMetadata,
    "Terms of Service",
    "Read the terms for this browser-local Stardew Valley farm planning tool.",
    "https://stardewvalleyplanner.art/terms",
  ],
] as const;

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
});
