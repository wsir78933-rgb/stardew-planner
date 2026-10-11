import { getCatalogSidebarReferenceEntry } from "./catalog-sidebar-model";
import type { CatalogItem } from "./catalog-types";
import { getPlannerMapById } from "../maps/map-catalog";
import { isInteriorDecorSupportedMapId } from "../interior-decor/interior-decor-catalog";

export type CatalogItemSceneAvailability =
  | "available"
  | "indoor-only"
  | "outdoor-only";

export function getCatalogItemSceneAvailability(
  catalogItem: CatalogItem,
  mapId: string,
): CatalogItemSceneAvailability {
  assertCatalogItemAndMapId(catalogItem, mapId);
  const plannerMap = getPlannerMapById(mapId);
  const isInteriorMap = isInteriorPlannerMapCategory(plannerMap.category);

  if (
    isGreenhouseLikeMapFile(plannerMap.mapFile) &&
    isTreeCatalogItemId(catalogItem.id)
  ) {
    return "available";
  }

  const referenceEntry = getCatalogSidebarReferenceEntry(catalogItem.id);

  if (referenceEntry !== undefined) {
    assertScenePermissions(catalogItem.id, referenceEntry);
    return getSceneAvailabilityFromPermissions(
      catalogItem.id,
      referenceEntry,
      isInteriorMap,
    );
  }

  const furnitureMetadata = catalogItem.renderingMetadata;

  if (furnitureMetadata?.kind !== "furniture") {
    return "available";
  }

  return getSceneAvailabilityFromPermissions(
    catalogItem.id,
    furnitureMetadata,
    isInteriorMap,
  );
}

export function isCatalogItemVisibleOnMap(
  catalogItem: CatalogItem,
  mapId: string,
): boolean {
  assertCatalogItemAndMapId(catalogItem, mapId);
  getPlannerMapById(mapId);

  if (catalogItem.interiorDecorKind === undefined) {
    return true;
  }
  if (
    catalogItem.interiorDecorKind !== "wallpaper" &&
    catalogItem.interiorDecorKind !== "flooring"
  ) {
    throw new TypeError(
      `Catalog item ${JSON.stringify(catalogItem.id)} has an unsupported interior decor kind ${JSON.stringify(catalogItem.interiorDecorKind)}.`,
    );
  }

  return isInteriorDecorSupportedMapId(mapId);
}

function isInteriorPlannerMapCategory(
  mapCategory: ReturnType<typeof getPlannerMapById>["category"],
): boolean {
  switch (mapCategory) {
    case "interior":
    case "community-interior":
      return true;
    case "farm":
    case "exterior":
    case "community-farm":
      return false;
    default: {
      const unexpectedMapCategory: never = mapCategory;
      throw new TypeError(
        `Planner map category must identify an interior or outdoor map; received ${describeValue(unexpectedMapCategory)}.`,
      );
    }
  }
}

function isGreenhouseLikeMapFile(mapFile: string): boolean {
  return mapFile === "Greenhouse.tmx" || mapFile === "grandpas-shed-2.tmx";
}

function isTreeCatalogItemId(itemId: string): boolean {
  return itemId.startsWith("fruittree_") || itemId.startsWith("wildtree_");
}

function assertCatalogItemAndMapId(
  catalogItem: unknown,
  mapId: unknown,
): asserts catalogItem is CatalogItem {
  if (typeof catalogItem !== "object" || catalogItem === null) {
    throw new TypeError(
      `Catalog scene availability item must be an object; received ${describeValue(catalogItem)}.`,
    );
  }
  const itemRecord = catalogItem as Record<string, unknown>;
  if (typeof itemRecord.id !== "string" || itemRecord.id.length === 0) {
    throw new TypeError(
      `Catalog scene availability item ID must be a non-empty string; received ${describeValue(itemRecord.id)}.`,
    );
  }
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Catalog scene availability map ID must be a non-empty string; received ${describeValue(mapId)}.`,
    );
  }
}

type CatalogScenePermissions = Readonly<{
  indoors: boolean;
  outdoors: boolean;
}>;

function getSceneAvailabilityFromPermissions(
  itemId: string,
  scenePermissions: CatalogScenePermissions,
  isInteriorMap: boolean,
): CatalogItemSceneAvailability {
  assertScenePermissions(itemId, scenePermissions);

  const isAvailableOnMap = isInteriorMap
    ? scenePermissions.indoors
    : scenePermissions.outdoors;

  if (isAvailableOnMap) {
    return "available";
  }

  return isInteriorMap ? "outdoor-only" : "indoor-only";
}

function assertScenePermissions(
  itemId: string,
  scenePermissions: CatalogScenePermissions,
): void {
  if (typeof scenePermissions.indoors !== "boolean") {
    throw new TypeError(
      `Catalog item ${JSON.stringify(itemId)} indoors permission must be a boolean; received ${describeValue(scenePermissions.indoors)}.`,
    );
  }
  if (typeof scenePermissions.outdoors !== "boolean") {
    throw new TypeError(
      `Catalog item ${JSON.stringify(itemId)} outdoors permission must be a boolean; received ${describeValue(scenePermissions.outdoors)}.`,
    );
  }
  if (!scenePermissions.indoors && !scenePermissions.outdoors) {
    throw new RangeError(
      `Catalog item ${JSON.stringify(itemId)} is marked unavailable both indoors and outdoors.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
