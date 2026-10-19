import { describe, expect, it } from "vitest";
import {
  projectRankedSeasonCrop,
  rankSeasonCrops,
  type SeasonCropProfitInput,
} from "@/src/crop-tools/profit/rank-season-crops";

const springYearOnePierre: SeasonCropProfitInput = {
  season: "spring",
  plantingDay: 1,
  farmYear: 1,
  tileCount: 40,
  seedShop: "pierre",
  profession: "none",
  speedGro: "none",
  fertilizerCostPerTile: 0,
  kegCount: 0,
  jarCount: 0,
  dehydratorCount: 0,
  processingDeadline: "plus-28",
};

describe("rankSeasonCrops", () => {
  it("matches the ValleyMath spring default top five", () => {
    const ranking = rankSeasonCrops(springYearOnePierre);

    expect(ranking.rows.slice(0, 5).map(summarizeRankedCrop)).toEqual([
      {
        cropId: "potato",
        growthDays: 6,
        harvestCount: 4,
        expectedUnits: 200,
        routeId: "sell-raw",
        netGold: 8000,
        goldPerTilePerDay: 7.1,
        seedPrice: 50,
      },
      {
        cropId: "cauliflower",
        growthDays: 12,
        harvestCount: 2,
        expectedUnits: 80,
        routeId: "sell-raw",
        netGold: 7600,
        goldPerTilePerDay: 6.8,
        seedPrice: 80,
      },
      {
        cropId: "green-bean",
        growthDays: 10,
        harvestCount: 6,
        expectedUnits: 240,
        routeId: "sell-raw",
        netGold: 7200,
        goldPerTilePerDay: 6.4,
        seedPrice: 60,
      },
      {
        cropId: "kale",
        growthDays: 6,
        harvestCount: 4,
        expectedUnits: 160,
        routeId: "sell-raw",
        netGold: 6400,
        goldPerTilePerDay: 5.7,
        seedPrice: 70,
      },
      {
        cropId: "parsnip",
        growthDays: 4,
        harvestCount: 6,
        expectedUnits: 240,
        routeId: "sell-raw",
        netGold: 3600,
        goldPerTilePerDay: 3.2,
        seedPrice: 20,
      },
    ]);
    expect(ranking.selected).toMatchObject({
      cropId: "potato",
      firstHarvest: { season: "spring", day: 7 },
      lastHarvest: { season: "spring", day: 25 },
      seedCost: 8000,
      fertilizerCost: 0,
    });
  });

  it("throws when the crop is not in the ranking and includes the id", () => {
    expect(() => projectRankedSeasonCrop(springYearOnePierre, "not-a-crop")).toThrow(
      /not-a-crop/,
    );
  });

  it("throws the bad planting day, tile count, machine count, and fertilizer cost", () => {
    expect(() => rankSeasonCrops({ ...springYearOnePierre, plantingDay: 0 })).toThrow(/0/);
    expect(() => rankSeasonCrops({ ...springYearOnePierre, tileCount: 0 })).toThrow(/0/);
    expect(() => rankSeasonCrops({ ...springYearOnePierre, kegCount: -1 })).toThrow(/-1/);
    expect(() => rankSeasonCrops({ ...springYearOnePierre, jarCount: 1.5 })).toThrow(/1\.5/);
    expect(() => rankSeasonCrops({ ...springYearOnePierre, dehydratorCount: -2 })).toThrow(/-2/);
    expect(() => rankSeasonCrops({ ...springYearOnePierre, fertilizerCostPerTile: -3 })).toThrow(/-3/);
  });
});

function summarizeRankedCrop(row: ReturnType<typeof rankSeasonCrops>["rows"][number]) {
  return {
    cropId: row.cropId,
    growthDays: row.growthDays,
    harvestCount: row.harvestCount,
    expectedUnits: row.expectedUnits,
    routeId: row.routeId,
    netGold: row.netGold,
    goldPerTilePerDay: row.goldPerTilePerDay,
    seedPrice: row.seedPrice,
  };
}
