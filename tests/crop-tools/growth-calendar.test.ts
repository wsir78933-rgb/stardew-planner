import { describe, expect, it } from "vitest";
import {
  getCropCatalogEntry,
  listPurchasableFieldCrops,
} from "@/src/crop-tools/catalog/crop-catalog";
import { projectCropHarvests } from "@/src/crop-tools/growth/project-crop-harvests";

const PARSNIP_SPRING_DAY_ONE = {
  cropId: "parsnip",
  season: "spring",
  plantingDay: 1,
  speedGro: "none",
  agriculturist: false,
  missedWateringDays: 0,
  location: "outdoor",
  afterHarvest: "no-replant",
} as const;

describe("purchasable field crop catalog", () => {
  it("lists ValleyMath purchasable field crops and rejects an unknown id", () => {
    const crops = listPurchasableFieldCrops();
    const cropIds = crops.map((crop) => crop.id);

    expect(crops).toHaveLength(31);
    expect(cropIds).toEqual(
      expect.arrayContaining(["carrot", "summer-squash", "broccoli", "powdermelon"]),
    );
    for (const excludedCropId of [
      "ancient-fruit",
      "coffee-bean",
      "sweet-gem-berry",
      "tulip",
      "blue-jazz",
      "sunflower",
      "rice-shoot",
      "taro-tuber",
    ]) {
      expect(cropIds).not.toContain(excludedCropId);
    }

    const parsnip = getCropCatalogEntry("parsnip");
    expect(parsnip.sellPrice).toBe(35);
    expect(parsnip.pierreYear1SeedPrice).toBe(20);
    expect(parsnip.pierreYear2SeedPrice).toBe(20);
    expect(parsnip.keg).toEqual({ price: 78, processingMinutes: 6_000 });
    expect(parsnip.jar).toEqual({ price: 120, processingMinutes: 4_000 });
    expect(parsnip.dehydrator).toBeNull();

    const grape = getCropCatalogEntry("grape");
    expect(grape.dehydrator).toEqual({
      price: 600,
      processingMinutes: 1_750,
      batchSize: 5,
    });

    expect(() => getCropCatalogEntry("not-a-real-crop")).toThrow(/not-a-real-crop/);
  });
});

describe("crop growth calendar", () => {
  it("projects a parsnip planted Spring 1 to Spring 5", () => {
    const projection = projectCropHarvests(PARSNIP_SPRING_DAY_ONE);

    expect(projection.growthDays).toBe(4);
    expect(projection.regrowIntervalDays).toBeNull();
    expect(projection.firstHarvest).toEqual({ season: "spring", day: 5 });
    expect(projection.harvests).toEqual([
      { season: "spring", day: 5, replantedSameDay: false },
    ]);
    expect(projection.harvestCount).toBe(1);
    expect(projection.outdoorSeasonDeadlineDay).toBe(28);
    expect(projection.lastSafePlantingDay).toBe(24);
    expect(projection.seasonCheck).toBe("harvestable");
  });

  it("keeps the blueberry regrow gap at 4 days when Speed-Gro shortens first growth", () => {
    const blueberryInput = {
      cropId: "blueberry",
      season: "summer",
      plantingDay: 1,
      agriculturist: false,
      missedWateringDays: 0,
      location: "outdoor",
      afterHarvest: "regrow",
    } as const;
    const plain = projectCropHarvests({ ...blueberryInput, speedGro: "none" });
    const spedUp = projectCropHarvests({ ...blueberryInput, speedGro: "speed-gro" });

    expect(plain.regrowIntervalDays).toBe(4);
    expect(spedUp.regrowIntervalDays).toBe(4);
    expect(plain.growthDays).toBe(13);
    expect(spedUp.growthDays).toBe(11);
    expect(plain.harvests.map((harvest) => harvest.day)).toEqual([14, 18, 22, 26]);
    expect(spedUp.harvests.map((harvest) => harvest.day)).toEqual([12, 16, 20, 24, 28]);
  });

  it("continues outdoor corn from Summer into Fall", () => {
    const projection = projectCropHarvests({
      cropId: "corn",
      season: "summer",
      plantingDay: 1,
      speedGro: "none",
      agriculturist: false,
      missedWateringDays: 0,
      location: "outdoor",
      afterHarvest: "regrow",
    });

    expect(projection.firstHarvest).toEqual({ season: "summer", day: 15 });
    expect(projection.harvests).toEqual([
      { season: "summer", day: 15, replantedSameDay: false },
      { season: "summer", day: 19, replantedSameDay: false },
      { season: "summer", day: 23, replantedSameDay: false },
      { season: "summer", day: 27, replantedSameDay: false },
      { season: "fall", day: 3, replantedSameDay: false },
      { season: "fall", day: 7, replantedSameDay: false },
      { season: "fall", day: 11, replantedSameDay: false },
      { season: "fall", day: 15, replantedSameDay: false },
      { season: "fall", day: 19, replantedSameDay: false },
      { season: "fall", day: 23, replantedSameDay: false },
      { season: "fall", day: 27, replantedSameDay: false },
    ]);
    expect(projection.harvestCount).toBe(11);
    expect(projection.seasonCheck).toBe("harvestable");
  });

  it("keeps a fall pumpkin alive into winter in the greenhouse", () => {
    const pumpkinInput = {
      cropId: "pumpkin",
      season: "fall",
      plantingDay: 20,
      speedGro: "none",
      agriculturist: false,
      missedWateringDays: 0,
      afterHarvest: "no-replant",
    } as const;
    const outdoor = projectCropHarvests({ ...pumpkinInput, location: "outdoor" });
    const greenhouse = projectCropHarvests({ ...pumpkinInput, location: "greenhouse" });

    expect(outdoor.seasonCheck).toBe("past-deadline");
    expect(outdoor.firstHarvest).toBeNull();
    expect(outdoor.harvestCount).toBe(0);
    expect(outdoor.lastSafePlantingDay).toBe(15);
    expect(greenhouse.seasonCheck).toBe("harvestable");
    expect(greenhouse.outdoorSeasonDeadlineDay).toBeNull();
    expect(greenhouse.firstHarvest).toEqual({ season: "winter", day: 5 });
    expect(greenhouse.harvestCount).toBe(1);
  });

  it("throws when the crop id is unknown", () => {
    expect(() =>
      projectCropHarvests({
        ...PARSNIP_SPRING_DAY_ONE,
        cropId: "not-a-real-crop",
      }),
    ).toThrow(/not-a-real-crop/);
  });

  it("throws when plantingDay is 0 or 29", () => {
    expect(() =>
      projectCropHarvests({
        ...PARSNIP_SPRING_DAY_ONE,
        plantingDay: 0,
      }),
    ).toThrow(/0/);
    expect(() =>
      projectCropHarvests({
        ...PARSNIP_SPRING_DAY_ONE,
        plantingDay: 29,
      }),
    ).toThrow(/29/);
  });
});
