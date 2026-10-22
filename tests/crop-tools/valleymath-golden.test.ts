import { describe, expect, it } from "vitest";
import { projectCropHarvests } from "@/src/crop-tools/growth/project-crop-harvests";
import { rankSeasonCrops } from "@/src/crop-tools/profit/rank-season-crops";

const VALLEYMATH_SPRING_PROFIT_INPUT = {
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
} as const;

const AUTUMN_ARTISAN_PROFIT_INPUT = {
  season: "fall",
  plantingDay: 15,
  farmYear: 2,
  tileCount: 80,
  seedShop: "pierre",
  profession: "artisan",
  speedGro: "speed-gro",
  fertilizerCostPerTile: 0,
  kegCount: 12,
  jarCount: 12,
  dehydratorCount: 4,
  processingDeadline: "plus-14",
} as const;

const PARSNIP_NO_REPLANT_INPUT = {
  cropId: "parsnip",
  season: "spring",
  plantingDay: 1,
  speedGro: "none",
  agriculturist: false,
  missedWateringDays: 0,
  location: "outdoor",
  afterHarvest: "no-replant",
} as const;

const SPRING_TOP_FIVE_NET_GOLD = [8000, 7600, 7200, 6400, 3600] as const;
const SPRING_TOP_FIVE_CROP_WORDS = [
  "potato",
  "cauliflower",
  "greenbean",
  "kale",
  "parsnip",
] as const;
const CROP_IDENTITY_KEYS = [
  "englishName",
  "name",
  "cropName",
  "displayName",
  "cropId",
  "id",
] as const;
const RANKED_ROW_KEYS = ["rankedRows", "rows", "rankings", "crops"] as const;

function readRankedCropRows(rankResult: unknown): readonly Record<string, unknown>[] {
  if (Array.isArray(rankResult)) {
    return rankResult as Record<string, unknown>[];
  }

  if (rankResult !== null && typeof rankResult === "object") {
    const rankRecord = rankResult as Record<string, unknown>;
    for (const key of RANKED_ROW_KEYS) {
      const rankedRows = rankRecord[key];
      if (Array.isArray(rankedRows)) {
        return rankedRows as Record<string, unknown>[];
      }
    }
  }

  throw new Error(
    `rankSeasonCrops did not return ranked rows; received ${JSON.stringify(rankResult)}.`,
  );
}

function readCropNetGold(rankedCrop: Record<string, unknown>): number {
  if (typeof rankedCrop.netGold !== "number") {
    throw new Error(
      `ranked crop netGold must be a number; received ${JSON.stringify(rankedCrop)}.`,
    );
  }

  return rankedCrop.netGold;
}

function readCropRouteId(rankedCrop: Record<string, unknown>): unknown {
  if ("routeId" in rankedCrop) {
    return rankedCrop.routeId;
  }

  if ("route" in rankedCrop) {
    return rankedCrop.route;
  }

  throw new Error(
    `ranked crop is missing routeId; received ${JSON.stringify(rankedCrop)}.`,
  );
}

function readCropIdentityText(rankedCrop: Record<string, unknown>): string {
  const identityParts: string[] = [];
  for (const key of CROP_IDENTITY_KEYS) {
    const identityValue = rankedCrop[key];
    if (typeof identityValue === "string") {
      identityParts.push(identityValue);
    }
  }

  return identityParts.join(" ");
}

function normalizeCropIdentity(identityText: string): string {
  return identityText.toLowerCase().replace(/[^a-z]/g, "");
}

function readFirstHarvestPosition(projection: unknown): {
  season: unknown;
  day: unknown;
} {
  if (projection === null || typeof projection !== "object") {
    throw new Error(
      `projectCropHarvests did not return an object; received ${JSON.stringify(projection)}.`,
    );
  }

  const projectionRecord = projection as Record<string, unknown>;
  const firstHarvest = projectionRecord.firstHarvest;
  if (firstHarvest !== null && typeof firstHarvest === "object") {
    const firstHarvestRecord = firstHarvest as Record<string, unknown>;
    return {
      season: firstHarvestRecord.season,
      day: firstHarvestRecord.day,
    };
  }

  const harvests = projectionRecord.harvests;
  const firstListedHarvest = Array.isArray(harvests) ? harvests[0] : undefined;
  if (firstListedHarvest !== null && typeof firstListedHarvest === "object") {
    const harvestRecord = firstListedHarvest as Record<string, unknown>;
    return {
      season: harvestRecord.season,
      day: harvestRecord.day,
    };
  }

  throw new Error(
    `projectCropHarvests did not expose a first harvest; received ${JSON.stringify(projection)}.`,
  );
}

describe("valleymath planting golden cases", () => {
  it("projects a spring parsnip planted on day 1 to one harvest on spring day 5", () => {
    const projection = projectCropHarvests(PARSNIP_NO_REPLANT_INPUT);

    expect(readFirstHarvestPosition(projection)).toEqual({
      season: "spring",
      day: 5,
    });
    expect(projection.harvestCount).toBe(1);
  });

  it("ranks spring day-1 Pierre crops as the valleymath top five raw sales", () => {
    const rankedRows = readRankedCropRows(
      rankSeasonCrops(VALLEYMATH_SPRING_PROFIT_INPUT),
    );
    const topFive = rankedRows.slice(0, 5);

    expect(topFive).toHaveLength(5);
    expect(topFive.map(readCropNetGold)).toEqual([...SPRING_TOP_FIVE_NET_GOLD]);
    expect(topFive.map(readCropRouteId)).toEqual([
      "sell-raw",
      "sell-raw",
      "sell-raw",
      "sell-raw",
      "sell-raw",
    ]);

    const cropIdentities = topFive.map((rankedCrop) =>
      normalizeCropIdentity(readCropIdentityText(rankedCrop)),
    );
    const exposesCropName = cropIdentities.some((identity, index) =>
      identity.includes(SPRING_TOP_FIVE_CROP_WORDS[index]),
    );
    if (exposesCropName) {
      expect(cropIdentities[0]).toContain("potato");
      expect(cropIdentities[1]).toContain("cauliflower");
      expect(cropIdentities[2]).toContain("greenbean");
      expect(cropIdentities[3]).toContain("kale");
      expect(cropIdentities[4]).toContain("parsnip");
    }
  });

  it("conserves crop units and applies Tiller inheritance to unfinished fall batches", () => {
    const rankedRows = rankSeasonCrops(AUTUMN_ARTISAN_PROFIT_INPUT).rows;
    const rankedRowsById = new Map(rankedRows.map((row) => [row.cropId, row]));
    const pumpkin = rankedRowsById.get("pumpkin");
    const amaranth = rankedRowsById.get("amaranth");
    const wheat = rankedRowsById.get("wheat");
    const cranberries = rankedRowsById.get("cranberries");

    if (!pumpkin || !amaranth || !wheat || !cranberries) {
      throw new Error("Autumn ranking is missing a golden-case crop.");
    }

    expect(pumpkin).toMatchObject({
      routeId: "jar",
      netGold: 57000,
      processedUnits: 60,
      backlogUnits: 20,
      goldPerTilePerDay: 50.9,
    });
    expect(amaranth).toMatchObject({
      routeId: "jar",
      netGold: 42500,
      processedUnits: 84,
      backlogUnits: 76,
    });
    expect(wheat).toMatchObject({
      routeId: "keg",
      netGold: 41872,
      processedUnits: 144,
      backlogUnits: 176,
    });
    expect(cranberries).toMatchObject({
      routeId: "dehydrator",
      netGold: 33344,
      processedUnits: 320,
      backlogUnits: 0,
    });
    expect((cranberries.netGold + cranberries.seedCost) / (cranberries.processedUnits / 5)).toBe(821);

    for (const row of [pumpkin, amaranth, wheat, cranberries]) {
      expect(row.processedUnits + row.backlogUnits).toBe(row.expectedUnits);
    }
  });

  it("rejects plantingDay 0 and includes 0 in the error", () => {
    expect(() =>
      projectCropHarvests({
        ...PARSNIP_NO_REPLANT_INPUT,
        plantingDay: 0,
      }),
    ).toThrow(/0/);
    expect(() =>
      rankSeasonCrops({
        ...VALLEYMATH_SPRING_PROFIT_INPUT,
        plantingDay: 0,
      }),
    ).toThrow(/0/);
  });
});
