import { rankSeasonCrops } from "@/src/crop-tools/profit/rank-season-crops";
import type { CropProfitForm } from "./crop-profit-form";
import {
  readHarvestDate,
  type HarvestDate,
} from "./planting-field-values";
import { parseProfitRouteId, type ProfitRouteId } from "./profit-route";

export type { ProfitRouteId } from "./profit-route";

export type SeasonCropProfitRow = Readonly<{
  cropId: string;
  harvestCount: number;
  expectedUnits: number;
  routeId: ProfitRouteId;
  netGold: number;
  goldPerTilePerDay: number;
  firstHarvest: HarvestDate | null;
  lastHarvest: HarvestDate | null;
  seedCost: number;
  fertilizerCost: number;
  hasHarvestDetail: boolean;
}>;

export type SeasonCropRanking = Readonly<{
  rows: readonly SeasonCropProfitRow[];
}>;

function readFiniteNumber(rawValue: unknown, fieldName: string): number {
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    throw new Error(
      `Season crop ranking field ${fieldName} must be a finite number. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

function readOptionalHarvestDetail(
  record: Record<string, unknown>,
): Pick<
  SeasonCropProfitRow,
  "firstHarvest" | "lastHarvest" | "seedCost" | "fertilizerCost" | "hasHarvestDetail"
> {
  const hasHarvestDetail =
    Object.hasOwn(record, "firstHarvest") &&
    Object.hasOwn(record, "lastHarvest") &&
    Object.hasOwn(record, "seedCost") &&
    Object.hasOwn(record, "fertilizerCost");

  if (!hasHarvestDetail) {
    return {
      firstHarvest: null,
      lastHarvest: null,
      seedCost: 0,
      fertilizerCost: 0,
      hasHarvestDetail: false,
    };
  }

  return {
    firstHarvest: readHarvestDate(record.firstHarvest, "firstHarvest"),
    lastHarvest: readHarvestDate(record.lastHarvest, "lastHarvest"),
    seedCost: readFiniteNumber(record.seedCost, "seedCost"),
    fertilizerCost: readFiniteNumber(record.fertilizerCost, "fertilizerCost"),
    hasHarvestDetail: true,
  };
}

function readSeasonCropProfitRow(rawValue: unknown, rowIndex: number): SeasonCropProfitRow {
  if (typeof rawValue !== "object" || rawValue === null) {
    throw new Error(
      `Season crop ranking row ${rowIndex} must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const cropId = record.cropId;
  if (typeof cropId !== "string" || cropId.trim().length === 0) {
    throw new Error(
      `Season crop ranking row ${rowIndex} cropId must be a non-empty string. Received: ${JSON.stringify(cropId)}.`,
    );
  }

  return {
    cropId,
    harvestCount: readFiniteNumber(record.harvestCount, "harvestCount"),
    expectedUnits: readFiniteNumber(record.expectedUnits, "expectedUnits"),
    routeId: parseProfitRouteId(record.routeId),
    netGold: readFiniteNumber(record.netGold, "netGold"),
    goldPerTilePerDay: readFiniteNumber(record.goldPerTilePerDay, "goldPerTilePerDay"),
    ...readOptionalHarvestDetail(record),
  };
}

function readRankingRowList(rawValue: unknown): unknown[] {
  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (typeof rawValue === "object" && rawValue !== null && Array.isArray((rawValue as { rows?: unknown }).rows)) {
    return (rawValue as { rows: unknown[] }).rows;
  }

  throw new Error(
    `Season crop ranking must be an array or an object with rows. Received: ${JSON.stringify(rawValue)}.`,
  );
}

function readResultHarvestDetail(rawValue: unknown): Pick<
  SeasonCropProfitRow,
  "firstHarvest" | "lastHarvest" | "seedCost" | "fertilizerCost" | "hasHarvestDetail"
> | null {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    return null;
  }

  return readOptionalHarvestDetail(rawValue as Record<string, unknown>);
}

export function readSeasonCropRanking(rawValue: unknown): SeasonCropRanking {
  const rowList = readRankingRowList(rawValue);
  const rows = rowList.map((row, rowIndex) => readSeasonCropProfitRow(row, rowIndex));
  const resultDetail = readResultHarvestDetail(rawValue);
  const firstRow = rows[0];

  if (firstRow !== undefined && !firstRow.hasHarvestDetail && resultDetail?.hasHarvestDetail) {
    const rowsWithFirstDetail: SeasonCropProfitRow[] = [
      {
        ...firstRow,
        firstHarvest: resultDetail.firstHarvest,
        lastHarvest: resultDetail.lastHarvest,
        seedCost: resultDetail.seedCost,
        fertilizerCost: resultDetail.fertilizerCost,
        hasHarvestDetail: true,
      },
      ...rows.slice(1),
    ];

    return { rows: rowsWithFirstDetail };
  }

  return { rows };
}

export function rankCropProfitForm(form: CropProfitForm): SeasonCropRanking {
  return readSeasonCropRanking(
    rankSeasonCrops({
      season: form.season,
      plantingDay: form.plantingDay,
      farmYear: form.farmYear,
      tileCount: form.tileCount,
      seedShop: form.seedShop,
      profession: form.profession,
      speedGro: form.speedGro,
      fertilizerCostPerTile: form.fertilizerCostPerTile,
      kegCount: form.kegCount,
      jarCount: form.jarCount,
      dehydratorCount: form.dehydratorCount,
      processingDeadline: form.processingDeadline,
    }),
  );
}

export function readSelectedSeasonCropRow(
  ranking: SeasonCropRanking,
  cropId: string,
): SeasonCropProfitRow {
  const row = ranking.rows.find((candidate) => candidate.cropId === cropId);
  if (row === undefined) {
    throw new Error(
      `Selected crop is not in the season ranking. Received: ${JSON.stringify(cropId)}.`,
    );
  }

  if (!row.hasHarvestDetail) {
    throw new Error(
      `Season crop ranking row is missing harvest cost detail. Received: ${JSON.stringify(row)}.`,
    );
  }

  return row;
}

export function formatGoldAmount(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error(`Gold amount must be a finite number. Received: ${JSON.stringify(amount)}.`);
  }

  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function formatGoldPerTilePerDay(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error(
      `Gold per tile per day must be a finite number. Received: ${JSON.stringify(amount)}.`,
    );
  }

  return amount.toFixed(1);
}

