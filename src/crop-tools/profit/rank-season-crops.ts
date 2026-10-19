import {
  getCropCatalogEntry,
  listPurchasableFieldCrops,
  type CropCatalogEntry,
} from "@/src/crop-tools/catalog/crop-catalog";
import { projectCropHarvests } from "@/src/crop-tools/growth/project-crop-harvests";
import {
  readDehydratorBatch,
  readJarBatch,
  readKegBatch,
  selectSeedUnitPrice,
} from "./read-purchasable-crop";
import {
  chooseWinningRoute,
  quoteMachineRoute,
  quoteSellRawRoute,
  rawCropUnitPrice,
} from "./schedule-processing-route";
import {
  assertSeasonCropProfitInput,
  processingExtensionDays,
  type CropSeasonName,
  type SeasonCropProfitInput,
  type SeasonProfitRouteId,
} from "./season-profit-input";

export type { CropSeasonName, SeasonCropProfitInput, SeasonProfitRouteId } from "./season-profit-input";

export type SeasonCalendarDay = {
  readonly season: CropSeasonName;
  readonly day: number;
};

export type SeasonCropProfitRow = {
  readonly cropId: string;
  readonly growthDays: number;
  readonly harvestCount: number;
  readonly expectedUnits: number;
  readonly routeId: SeasonProfitRouteId;
  readonly netGold: number;
  readonly goldPerTilePerDay: number;
  readonly seedPrice: number;
  readonly seedCost: number;
  readonly fertilizerCost: number;
  readonly firstHarvest: SeasonCalendarDay;
  readonly lastHarvest: SeasonCalendarDay;
};

export type SeasonCropProfitRanking = {
  readonly rows: readonly SeasonCropProfitRow[];
  readonly selected: SeasonCropProfitRow | null;
};

const SEASON_ORDER = ["spring", "summer", "fall", "winter"] as const;
const SEASON_LENGTH_DAYS = 28;

export function rankSeasonCrops(input: SeasonCropProfitInput): SeasonCropProfitRanking {
  const profitInput = assertSeasonCropProfitInput(input);
  const rows = listPurchasableFieldCrops()
    .map((listedCrop) => rankPurchasableCrop(getCropCatalogEntry(listedCrop.id), profitInput))
    .filter((row): row is SeasonCropProfitRow => row !== null)
    .sort(compareSeasonProfitRows);
  return {
    rows,
    selected: rows[0] ?? null,
  };
}

export function projectRankedSeasonCrop(input: SeasonCropProfitInput, cropId: string): SeasonCropProfitRow {
  if (typeof cropId !== "string" || cropId.length === 0) {
    throw new Error(`cropId is invalid: ${JSON.stringify(cropId)}`);
  }
  const ranking = rankSeasonCrops(input);
  const rankedCrop = ranking.rows.find((row) => row.cropId === cropId);
  if (rankedCrop === undefined) {
    throw new Error(`cropId is not in the season ranking: ${JSON.stringify(cropId)}`);
  }
  return rankedCrop;
}

function rankPurchasableCrop(crop: CropCatalogEntry, input: SeasonCropProfitInput): SeasonCropProfitRow | null {
  if (!crop.seasons.includes(input.season)) return null;
  const seedPrice = selectSeedUnitPrice(crop, input.seedShop, input.farmYear);
  if (seedPrice === null) return null;

  const projection = readHarvestProjection(
    projectCropHarvests({
      cropId: crop.id,
      season: input.season,
      plantingDay: input.plantingDay,
      speedGro: input.speedGro,
      agriculturist: input.profession === "agriculturist",
      missedWateringDays: 0,
      location: "outdoor",
      afterHarvest: crop.regrowDays === null ? "replant-same-day" : "regrow",
    }),
    crop.id,
  );
  if (projection.seasonCheck !== "harvestable") return null;
  const harvests = harvestsDuringPlantingSeason(projection.harvests, input.season);
  const firstHarvest = harvests[0];
  const lastHarvest = harvests[harvests.length - 1];
  if (firstHarvest === undefined || lastHarvest === undefined) return null;
  return buildSeasonCropProfitRow(crop, input, seedPrice, projection.growthDays, harvests, firstHarvest, lastHarvest);
}

function buildSeasonCropProfitRow(
  crop: CropCatalogEntry,
  input: SeasonCropProfitInput,
  seedPrice: number,
  growthDays: number,
  harvests: readonly SeasonCalendarDay[],
  firstHarvest: SeasonCalendarDay,
  lastHarvest: SeasonCalendarDay,
): SeasonCropProfitRow {
  const harvestCount = harvests.length;
  const averageYield = (crop.yieldMin + crop.yieldMax) / 2;
  const expectedUnits = averageYield * harvestCount * input.tileCount;
  const unitsPerHarvest = averageYield * input.tileCount;
  const plantingsPerTile = crop.regrowDays === null ? harvestCount : 1;
  const seedCost = seedPrice * input.tileCount * plantingsPerTile;
  const fertilizerCost = input.fertilizerCostPerTile * input.tileCount;
  const rawUnitPrice = rawCropUnitPrice(crop.sellPrice, input.profession);
  const harvestAbsoluteDays = [...harvests]
    .sort(compareCalendarDays)
    .map((harvest) => absoluteSeasonDay(harvest.season, harvest.day));
  const deadlineAbsoluteDay = absoluteSeasonDay(input.season, SEASON_LENGTH_DAYS) + processingExtensionDays(input.processingDeadline);
  const winningRoute = chooseWinningRoute([
    quoteSellRawRoute(expectedUnits, rawUnitPrice, seedCost, fertilizerCost),
    ...listedMachineRoutes(
      crop,
      input,
      harvestAbsoluteDays,
      unitsPerHarvest,
      rawUnitPrice,
      seedCost,
      fertilizerCost,
      deadlineAbsoluteDay,
    ),
  ]);

  return {
    cropId: crop.id,
    growthDays,
    harvestCount,
    expectedUnits,
    routeId: winningRoute.routeId,
    netGold: winningRoute.netGold,
    goldPerTilePerDay: roundGoldPerTilePerDay(winningRoute.netGold, input.tileCount),
    seedPrice,
    seedCost,
    fertilizerCost,
    firstHarvest,
    lastHarvest,
  };
}

function listedMachineRoutes(
  crop: CropCatalogEntry,
  input: SeasonCropProfitInput,
  harvestAbsoluteDays: readonly number[],
  unitsPerHarvest: number,
  rawUnitPrice: number,
  seedCost: number,
  fertilizerCost: number,
  deadlineAbsoluteDay: number,
) {
  return [
    quoteMachineRoute(
      "keg",
      readKegBatch(crop),
      input.kegCount,
      harvestAbsoluteDays,
      unitsPerHarvest,
      rawUnitPrice,
      input.profession,
      seedCost,
      fertilizerCost,
      deadlineAbsoluteDay,
    ),
    quoteMachineRoute(
      "jar",
      readJarBatch(crop),
      input.jarCount,
      harvestAbsoluteDays,
      unitsPerHarvest,
      rawUnitPrice,
      input.profession,
      seedCost,
      fertilizerCost,
      deadlineAbsoluteDay,
    ),
    quoteMachineRoute(
      "dehydrator",
      readDehydratorBatch(crop),
      input.dehydratorCount,
      harvestAbsoluteDays,
      unitsPerHarvest,
      rawUnitPrice,
      input.profession,
      seedCost,
      fertilizerCost,
      deadlineAbsoluteDay,
    ),
  ].filter((route) => route !== null);
}

function roundGoldPerTilePerDay(netGold: number, tileCount: number): number {
  return Math.round((netGold / tileCount / SEASON_LENGTH_DAYS) * 10) / 10;
}

function compareSeasonProfitRows(left: SeasonCropProfitRow, right: SeasonCropProfitRow): number {
  if (left.netGold !== right.netGold) return right.netGold - left.netGold;
  if (left.goldPerTilePerDay !== right.goldPerTilePerDay) return right.goldPerTilePerDay - left.goldPerTilePerDay;
  return left.cropId.localeCompare(right.cropId);
}

function compareCalendarDays(left: SeasonCalendarDay, right: SeasonCalendarDay): number {
  return absoluteSeasonDay(left.season, left.day) - absoluteSeasonDay(right.season, right.day);
}

function absoluteSeasonDay(season: CropSeasonName, day: number): number {
  const seasonIndex = SEASON_ORDER.indexOf(season);
  if (seasonIndex < 0 || !Number.isInteger(day)) {
    throw new Error(`calendar day is invalid: ${JSON.stringify({ season, day })}`);
  }
  return seasonIndex * SEASON_LENGTH_DAYS + day;
}

type HarvestProjection = {
  readonly growthDays: number;
  readonly seasonCheck: "harvestable" | "past-deadline";
  readonly harvests: readonly SeasonCalendarDay[];
};

function readHarvestProjection(value: unknown, cropId: string): HarvestProjection {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${cropId} harvest projection is invalid: ${JSON.stringify(value)}`);
  }
  const projection = value as Record<string, unknown>;
  const seasonCheck = projection.seasonCheck;
  if (seasonCheck !== "harvestable" && seasonCheck !== "past-deadline") {
    throw new Error(`${cropId} seasonCheck is invalid: ${JSON.stringify(seasonCheck)}`);
  }
  const growthDays = projection.growthDays;
  if (typeof growthDays !== "number" || !Number.isInteger(growthDays) || growthDays < 1) {
    throw new Error(`${cropId} growthDays is invalid: ${JSON.stringify(growthDays)}`);
  }
  if (seasonCheck === "past-deadline") {
    return { growthDays, seasonCheck, harvests: [] };
  }
  if (!Array.isArray(projection.harvests)) {
    throw new Error(`${cropId} harvests is invalid: ${JSON.stringify(projection.harvests)}`);
  }
  return {
    growthDays,
    seasonCheck,
    harvests: projection.harvests.map((harvest) => readCalendarDay(harvest, cropId)),
  };
}

function readCalendarDay(value: unknown, cropId: string): SeasonCalendarDay {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${cropId} harvest is invalid: ${JSON.stringify(value)}`);
  }
  const harvest = value as Record<string, unknown>;
  const season = typeof harvest.season === "string" ? harvest.season.toLowerCase() : harvest.season;
  if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") {
    throw new Error(`${cropId} harvest season is invalid: ${JSON.stringify(harvest.season)}`);
  }
  if (typeof harvest.day !== "number" || !Number.isInteger(harvest.day) || harvest.day < 1 || harvest.day > 28) {
    throw new Error(`${cropId} harvest day is invalid: ${JSON.stringify(harvest.day)}`);
  }
  return { season, day: harvest.day };
}

function harvestsDuringPlantingSeason(
  harvests: readonly SeasonCalendarDay[],
  plantingSeason: CropSeasonName,
): readonly SeasonCalendarDay[] {
  return harvests
    .filter((harvest) => harvest.season === plantingSeason)
    .sort(compareCalendarDays);
}
