import type { CatalogItem } from "../catalog";
import {
  createPersistentPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export type FarmSummaryRow = Readonly<{
  category: string;
  count: number;
  name: string;
}>;

export type FarmSummaryMapContext = Readonly<{
  baseMapId: string;
  displayName: string;
  season: TilesheetSeason;
}>;

export type FarmSummary = Readonly<{
  mapContext: FarmSummaryMapContext;
  rows: readonly FarmSummaryRow[];
  totalItems: number;
}>;

export type FarmSummaryCsvFile = Readonly<{
  filename: string;
  mimeType: "text/csv";
  contents: string;
}>;

type MutableFarmSummaryRow = {
  category: string;
  count: number;
  name: string;
};

export function createFarmSummary(
  placementSnapshot: PlacementSnapshot,
  catalogItems: readonly CatalogItem[],
  farmSummaryMapContext: FarmSummaryMapContext,
): FarmSummary {
  const validatedFarmSummaryMapContext = createFarmSummaryMapContext(
    farmSummaryMapContext,
  );
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const catalogItemsById = createCatalogItemsById(catalogItems);
  const summaryRowsById = new Map<string, MutableFarmSummaryRow>();

  for (const placementBuilding of persistentPlacementSnapshot.buildings) {
    const buildingCatalogItem = catalogItemsById.get(
      `building:${placementBuilding.buildingId}`,
    );
    appendFarmSummaryRow(
      summaryRowsById,
      placementBuilding.buildingId,
      buildingCatalogItem?.name ?? formatUnknownCatalogItemName(placementBuilding.buildingId),
      "Buildings",
    );
  }

  for (const placementItem of persistentPlacementSnapshot.items) {
    if (placementItem.locked) {
      continue;
    }

    const catalogItem = catalogItemsById.get(placementItem.itemId);
    appendFarmSummaryRow(
      summaryRowsById,
      placementItem.itemId,
      catalogItem?.name ?? formatUnknownCatalogItemName(placementItem.itemId),
      getFarmSummaryItemCategory(placementItem),
    );
  }

  for (const placementCrop of persistentPlacementSnapshot.crops) {
    const cropCatalogItem = catalogItemsById.get(placementCrop.cropId);
    appendFarmSummaryRow(
      summaryRowsById,
      placementCrop.cropId,
      cropCatalogItem?.name ?? formatUnknownCatalogItemName(placementCrop.cropId),
      "Crops",
    );
  }

  const rows = [...summaryRowsById.values()].sort(
    (firstRow, secondRow) =>
      firstRow.category !== secondRow.category
        ? firstRow.category.localeCompare(secondRow.category)
        : secondRow.count - firstRow.count,
  );

  return {
    mapContext: validatedFarmSummaryMapContext,
    rows,
    totalItems: rows.reduce((totalItems, summaryRow) => totalItems + summaryRow.count, 0),
  };
}

export function createFarmSummaryCsvFile(
  farmSummaryRows: readonly FarmSummaryRow[],
  dateStamp: string,
): FarmSummaryCsvFile {
  assertFarmSummaryRows(farmSummaryRows);
  assertDateStamp(dateStamp);
  const csvHeader = "Category,Item,Count";
  const csvRows = farmSummaryRows.map(
    (farmSummaryRow) =>
      `${farmSummaryRow.category},"${farmSummaryRow.name.replace(/"/g, '""')}",${String(farmSummaryRow.count)}`,
  );

  return {
    filename: `farm-summary-${dateStamp}.csv`,
    mimeType: "text/csv",
    contents: [csvHeader, ...csvRows].join("\n"),
  };
}

function createCatalogItemsById(
  catalogItems: readonly CatalogItem[],
): ReadonlyMap<string, CatalogItem> {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Farm summary catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }

  const catalogItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of catalogItems) {
    if (
      typeof catalogItem !== "object" ||
      catalogItem === null ||
      typeof catalogItem.id !== "string" ||
      catalogItem.id.length === 0 ||
      typeof catalogItem.name !== "string" ||
      catalogItem.name.length === 0
    ) {
      throw new TypeError(
        `Farm summary catalog item must have non-empty string ID and name; received ${describeValue(catalogItem)}.`,
      );
    }

    if (catalogItemsById.has(catalogItem.id)) {
      throw new Error(
        `Farm summary catalog contains duplicate item ID ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    catalogItemsById.set(catalogItem.id, catalogItem);
  }

  return catalogItemsById;
}

function createFarmSummaryMapContext(
  farmSummaryMapContext: unknown,
): FarmSummaryMapContext {
  if (
    typeof farmSummaryMapContext !== "object" ||
    farmSummaryMapContext === null ||
    Array.isArray(farmSummaryMapContext)
  ) {
    throw new TypeError(
      `Farm summary map context must be an object; received ${describeValue(farmSummaryMapContext)}.`,
    );
  }

  const rawMapContext = farmSummaryMapContext as Readonly<Record<string, unknown>>;
  const baseMapId = rawMapContext.baseMapId;
  const displayName = rawMapContext.displayName;
  const season = rawMapContext.season;

  if (typeof baseMapId !== "string" || baseMapId.trim().length === 0) {
    throw new TypeError(
      `Farm summary map context baseMapId must be a non-empty string; received ${describeValue(baseMapId)}.`,
    );
  }

  if (typeof displayName !== "string" || displayName.trim().length === 0) {
    throw new TypeError(
      `Farm summary map context displayName must be a non-empty string; received ${describeValue(displayName)}.`,
    );
  }

  if (!isFarmSummarySeason(season)) {
    throw new TypeError(
      `Farm summary map context season must be one of "spring", "summer", "fall", "winter"; received ${describeValue(season)}.`,
    );
  }

  return {
    baseMapId,
    displayName,
    season,
  };
}

function isFarmSummarySeason(value: unknown): value is TilesheetSeason {
  return (
    value === "spring" ||
    value === "summer" ||
    value === "fall" ||
    value === "winter"
  );
}

function appendFarmSummaryRow(
  summaryRowsById: Map<string, MutableFarmSummaryRow>,
  summaryItemId: string,
  name: string,
  category: string,
): void {
  const existingSummaryRow = summaryRowsById.get(summaryItemId);

  if (existingSummaryRow !== undefined) {
    existingSummaryRow.count += 1;
    return;
  }

  summaryRowsById.set(summaryItemId, { category, count: 1, name });
}

function getFarmSummaryItemCategory(placementItem: PlacementItem): string {
  if (placementItem.layer === "path") {
    return "Paths";
  }

  if (placementItem.layer === "fence") {
    return "Fences";
  }

  if (placementItem.itemId.startsWith("furniture_")) {
    return "Furniture";
  }

  if (
    placementItem.itemId.startsWith("wildtree_") ||
    placementItem.itemId.startsWith("fruittree_")
  ) {
    return "Trees";
  }

  return "Items";
}

function formatUnknownCatalogItemName(catalogItemId: string): string {
  return catalogItemId
    .replace(/^(object|furniture|giant)_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (firstCharacter) => firstCharacter.toUpperCase());
}

function assertFarmSummaryRows(
  farmSummaryRows: readonly FarmSummaryRow[],
): void {
  if (!Array.isArray(farmSummaryRows)) {
    throw new TypeError(
      `Farm summary CSV rows must be an array; received ${describeValue(farmSummaryRows)}.`,
    );
  }

  for (const [rowIndex, farmSummaryRow] of farmSummaryRows.entries()) {
    if (
      typeof farmSummaryRow !== "object" ||
      farmSummaryRow === null ||
      typeof farmSummaryRow.category !== "string" ||
      farmSummaryRow.category.length === 0 ||
      typeof farmSummaryRow.name !== "string" ||
      farmSummaryRow.name.length === 0 ||
      !Number.isSafeInteger(farmSummaryRow.count) ||
      farmSummaryRow.count <= 0
    ) {
      throw new TypeError(
        `Farm summary CSV row ${String(rowIndex)} must contain non-empty category/name and positive integer count; received ${describeValue(farmSummaryRow)}.`,
      );
    }
  }
}

function assertDateStamp(dateStamp: string): void {
  if (typeof dateStamp !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStamp)) {
    throw new TypeError(
      `Farm summary CSV date stamp must match YYYY-MM-DD; received ${describeValue(dateStamp)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[array length ${String(value.length)}]`;
  }

  return JSON.stringify(value);
}
