import {
  getCatalogSidebarCategory,
  getCatalogSidebarReferenceEntry,
} from "./catalog-sidebar-model";
import type { CatalogItem } from "./catalog-types";
import {
  getPlannerMapById,
  type PlannerMap,
} from "../maps/map-catalog";
import { isInteriorDecorSupportedMapId } from "../interior-decor/interior-decor-catalog";

export type CatalogItemSceneAvailability =
  | "available"
  | "indoor-only"
  | "outdoor-only"
  | "not-buildable-here"
  | "not-plantable-here"
  | "not-placeable-here";

export type CatalogMapPlacementCapabilities = Readonly<{
  buildable: boolean;
  decoratable: boolean;
  giantCrops: boolean;
  isGreenhouse: boolean;
  isInterior: boolean;
  papered: boolean;
  bedsAllowed: boolean;
  plantable: boolean;
  trees: boolean;
}>;

const plantableMapIds = new Set([
  "ginger-island",
  "greenhouse",
  "sve-grandpas-shed-2",
]);

const additionalTreeMapIds = new Set(["railroad"]);

const decoratableMapIds = new Set([
  "farmhouse-0",
  "farmhouse-1",
  "farmhouse-2",
  "shed",
  "big-shed",
  "slime-hutch",
  "island-farmhouse",
]);

const greenhouseMapFiles = new Set([
  "Greenhouse.tmx",
  "grandpas-shed-2.tmx",
]);

export function getCatalogMapPlacementCapabilities(
  mapId: string,
): CatalogMapPlacementCapabilities {
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Catalog map capability ID must be a non-empty string; received ${describeValue(mapId)}.`,
    );
  }

  const plannerMap = getPlannerMapById(mapId);
  const isInterior = isInteriorPlannerMapCategory(plannerMap.category);
  const buildable = isBuildablePlannerMap(plannerMap);
  const plantable = buildable || plantableMapIds.has(plannerMap.id);
  const trees = plantable || additionalTreeMapIds.has(plannerMap.id);

  return {
    buildable,
    decoratable: decoratableMapIds.has(plannerMap.id),
    giantCrops: buildable,
    isGreenhouse: greenhouseMapFiles.has(plannerMap.mapFile),
    isInterior,
    papered: isInteriorDecorSupportedMapId(plannerMap.id),
    bedsAllowed: plannerMap.id !== "farmhouse-cellar",
    plantable,
    trees,
  };
}

export function getCatalogItemSceneAvailability(
  catalogItem: CatalogItem,
  mapId: string,
): CatalogItemSceneAvailability {
  assertCatalogItemAndMapId(catalogItem, mapId);
  const mapCapabilities = getCatalogMapPlacementCapabilities(mapId);

  if (catalogItem.interiorDecorKind !== undefined) {
    assertInteriorDecorKind(catalogItem);
    return mapCapabilities.papered ? "available" : "not-placeable-here";
  }

  if (catalogItem.category === "building") {
    return mapCapabilities.buildable ? "available" : "not-buildable-here";
  }

  if (catalogItem.category === "crop") {
    return getCropSceneAvailability(catalogItem, mapCapabilities);
  }

  return getPlaceableSceneAvailability(catalogItem, mapCapabilities);
}

export function isCatalogItemVisibleOnMap(
  catalogItem: CatalogItem,
  mapId: string,
): boolean {
  assertCatalogItemAndMapId(catalogItem, mapId);
  const mapCapabilities = getCatalogMapPlacementCapabilities(mapId);

  if (catalogItem.interiorDecorKind !== undefined) {
    assertInteriorDecorKind(catalogItem);
    return mapCapabilities.papered;
  }

  const sidebarCategory = getCatalogSidebarCategory(catalogItem);
  if (sidebarCategory === "buildings") {
    return mapCapabilities.buildable;
  }
  if (sidebarCategory === "crops") {
    return mapCapabilities.plantable ||
      mapCapabilities.isInterior ||
      mapCapabilities.trees;
  }
  if (sidebarCategory === "trees") {
    return !mapCapabilities.isInterior || mapCapabilities.isGreenhouse;
  }

  return true;
}

function getCropSceneAvailability(
  catalogItem: CatalogItem,
  mapCapabilities: CatalogMapPlacementCapabilities,
): CatalogItemSceneAvailability {
  if (!mapCapabilities.plantable && !mapCapabilities.isInterior) {
    return mapCapabilities.trees
      ? "not-placeable-here"
      : "not-plantable-here";
  }

  if (
    (catalogItem.tileSize.width > 1 || catalogItem.tileSize.height > 1) &&
    !mapCapabilities.giantCrops
  ) {
    return "not-placeable-here";
  }

  return "available";
}

function getPlaceableSceneAvailability(
  catalogItem: CatalogItem,
  mapCapabilities: CatalogMapPlacementCapabilities,
): CatalogItemSceneAvailability {
  const scenePermissions = getCatalogScenePermissions(catalogItem);
  const isTeaSapling = catalogItem.id === "object:251";
  const isBush = catalogItem.id.startsWith("bush:");
  const isFruitTree = catalogItem.id.startsWith("fruittree_");
  const isWildTree = catalogItem.id.startsWith("wildtree_");
  const furnitureMetadata = catalogItem.renderingMetadata?.kind === "furniture"
    ? catalogItem.renderingMetadata
    : undefined;
  const wallMounted = furnitureMetadata?.wallMounted ?? false;
  const isBed = furnitureMetadata?.bedType !== undefined &&
    furnitureMetadata.bedType !== null;

  if (isBush) {
    return mapCapabilities.buildable ? "available" : "not-placeable-here";
  }

  if (scenePermissions === null) {
    return isTeaSapling && !mapCapabilities.trees && !mapCapabilities.isInterior
      ? "not-placeable-here"
      : "available";
  }

  assertScenePermissions(catalogItem.id, scenePermissions);

  if (
    mapCapabilities.isInterior &&
    ((wallMounted && !mapCapabilities.decoratable) ||
      (isBed && !mapCapabilities.bedsAllowed))
  ) {
    return "not-placeable-here";
  }

  if (
    (isTeaSapling || isFruitTree) &&
    !mapCapabilities.trees &&
    !mapCapabilities.isInterior
  ) {
    return "not-placeable-here";
  }

  if (mapCapabilities.isGreenhouse) {
    return isFruitTree || isWildTree || scenePermissions.indoors || isTeaSapling
      ? "available"
      : "not-placeable-here";
  }

  if (mapCapabilities.isInterior) {
    return scenePermissions.indoors || wallMounted || isTeaSapling
      ? "available"
      : "outdoor-only";
  }

  if (!scenePermissions.outdoors) {
    return "indoor-only";
  }
  return wallMounted ? "not-placeable-here" : "available";
}

function getCatalogScenePermissions(
  catalogItem: CatalogItem,
): CatalogScenePermissions | null {
  const referenceEntry = getCatalogSidebarReferenceEntry(catalogItem.id);
  if (referenceEntry !== undefined) {
    return {
      indoors: referenceEntry.indoors,
      outdoors: referenceEntry.outdoors,
    };
  }

  const furnitureMetadata = catalogItem.renderingMetadata;
  if (furnitureMetadata?.kind !== "furniture") {
    return null;
  }

  return {
    indoors: furnitureMetadata.indoors,
    outdoors: furnitureMetadata.outdoors,
  };
}

function isBuildablePlannerMap(plannerMap: PlannerMap): boolean {
  if (plannerMap.category === "community-farm") {
    return true;
  }
  return plannerMap.category === "farm" && plannerMap.id !== "ginger-island";
}

function isInteriorPlannerMapCategory(
  mapCategory: PlannerMap["category"],
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

function assertInteriorDecorKind(catalogItem: CatalogItem): void {
  if (
    catalogItem.interiorDecorKind !== "wallpaper" &&
    catalogItem.interiorDecorKind !== "flooring"
  ) {
    throw new TypeError(
      `Catalog item ${JSON.stringify(catalogItem.id)} has an unsupported interior decor kind ${JSON.stringify(catalogItem.interiorDecorKind)}.`,
    );
  }
}

type CatalogScenePermissions = Readonly<{
  indoors: boolean;
  outdoors: boolean;
}>;

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
