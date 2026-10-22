import { describe, expect, it } from "vitest";
import {
  projectRankedSeasonCrop,
  rankSeasonCrops,
  type SeasonCropProfitInput,
} from "@/src/crop-tools/profit/rank-season-crops";
import { countFinishedMachineBatches } from "@/src/crop-tools/profit/schedule-processing-route";

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

  it("inherits the Tiller bonus through Artisan and Agriculturist", () => {
    const artisanPotato = projectRankedSeasonCrop(
      { ...springYearOnePierre, profession: "artisan" },
      "potato",
    );
    const agriculturistPotato = projectRankedSeasonCrop(
      { ...springYearOnePierre, profession: "agriculturist" },
      "potato",
    );

    expect(artisanPotato).toMatchObject({
      routeId: "sell-raw",
      netGold: 9600,
      expectedUnits: 200,
      processedUnits: 0,
      backlogUnits: 200,
    });
    expect(agriculturistPotato).toMatchObject({
      routeId: "sell-raw",
      netGold: 12000,
      processedUnits: 0,
    });
    expect(agriculturistPotato.processedUnits + agriculturistPotato.backlogUnits).toBe(
      agriculturistPotato.expectedUnits,
    );
  });

  it("only lists festival strawberry seeds from spring day 13 in the all-shops option", () => {
    const allShopsInput: SeasonCropProfitInput = {
      ...springYearOnePierre,
      seedShop: "pierre-oasis-festival",
    };
    const springDayOne = rankSeasonCrops(allShopsInput).rows;
    const springDayThirteen = rankSeasonCrops({
      ...allShopsInput,
      plantingDay: 13,
    }).rows;

    expect(springDayOne.map((row) => row.cropId)).not.toContain("strawberry");
    expect(springDayThirteen.find((row) => row.cropId === "strawberry")).toMatchObject({
      seedPrice: 100,
    });
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

describe("countFinishedMachineBatches", () => {
  it("fails fast with invalid scheduler values in the error", () => {
    const validSchedule = [1];
    const validUnitsPerHarvest = 1;
    const validBatchSize = 1;
    const validDurationDays = 1;
    const validMachineCount = 1;
    const validDeadlineAbsoluteDay = 2;

    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        validBatchSize,
        validDurationDays,
        Number.POSITIVE_INFINITY,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("machineCount is invalid: Infinity");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        validBatchSize,
        validDurationDays,
        Number.NaN,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("machineCount is invalid: NaN");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        validBatchSize,
        validDurationDays,
        -1,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("machineCount is invalid: -1");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        validBatchSize,
        0,
        validMachineCount,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("durationDays is invalid: 0");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        0,
        validDurationDays,
        validMachineCount,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("batchSize is invalid: 0");
    expect(() =>
      countFinishedMachineBatches(
        [Number.POSITIVE_INFINITY],
        validUnitsPerHarvest,
        validBatchSize,
        validDurationDays,
        validMachineCount,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("harvestAbsoluteDays[0] is invalid: Infinity");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        Number.NaN,
        validBatchSize,
        validDurationDays,
        validMachineCount,
        validDeadlineAbsoluteDay,
      ),
    ).toThrow("unitsPerHarvest is invalid: NaN");
    expect(() =>
      countFinishedMachineBatches(
        validSchedule,
        validUnitsPerHarvest,
        validBatchSize,
        validDurationDays,
        validMachineCount,
        Number.POSITIVE_INFINITY,
      ),
    ).toThrow("deadlineAbsoluteDay is invalid: Infinity");
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
