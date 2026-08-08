import {
  assertCrabPotCatalogItem,
  crabPotCatalogItemId,
  type CatalogItem,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import type { PlacementPixelGeometry } from "./placement-rendering";

const tilePixelSize = 16;

export function createCrabPotPixelGeometry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  mapPlacementGrid: MapPlacementGrid | undefined,
): PlacementPixelGeometry | null {
  if (catalogItem.id !== placementItem.itemId) {
    throw new Error(
      `Crab Pot placement item ID ${describeValue(placementItem.itemId)} does not match catalog item ID ${describeValue(catalogItem.id)}.`,
    );
  }

  assertCrabPotCatalogItem(catalogItem);
  if (catalogItem.id !== crabPotCatalogItemId) {
    return null;
  }
  if (mapPlacementGrid === undefined) {
    return null;
  }

  const horizontalOffset = getCrabPotHorizontalOffset(placementItem, mapPlacementGrid);
  const verticalOffset = getCrabPotVerticalOffset(
    placementItem,
    mapPlacementGrid,
    horizontalOffset,
  );
  return {
    anchorX: 0,
    anchorY: 0,
    horizontalScale: 1,
    positionX: placementItem.x * tilePixelSize + horizontalOffset,
    positionY: placementItem.y * tilePixelSize + verticalOffset,
  };
}

function getCrabPotHorizontalOffset(
  placementItem: PlacementItem,
  mapPlacementGrid: MapPlacementGrid,
): number {
  let horizontalOffset = 0;
  if (isCrabPotNeighborBlocked(mapPlacementGrid, placementItem.x - 1, placementItem.y)) horizontalOffset += 8;
  if (isCrabPotNeighborBlocked(mapPlacementGrid, placementItem.x + 1, placementItem.y)) horizontalOffset -= 8;
  return horizontalOffset;
}

function getCrabPotVerticalOffset(
  placementItem: PlacementItem,
  mapPlacementGrid: MapPlacementGrid,
  horizontalOffset: number,
): number {
  let verticalOffset = 0;
  if (horizontalOffset !== 0 && isCrabPotNeighborBlocked(mapPlacementGrid, placementItem.x + Math.sign(horizontalOffset), placementItem.y + 1)) verticalOffset -= 10;
  if (isCrabPotNeighborBlocked(mapPlacementGrid, placementItem.x, placementItem.y - 1)) verticalOffset += 8;
  if (isCrabPotNeighborBlocked(mapPlacementGrid, placementItem.x, placementItem.y + 1)) verticalOffset -= 10;
  return verticalOffset;
}

function isCrabPotNeighborBlocked(
  mapPlacementGrid: MapPlacementGrid,
  x: number,
  y: number,
): boolean {
  if (x < 0 || y < 0 || x >= mapPlacementGrid.width || y >= mapPlacementGrid.height) return true;
  return mapPlacementGrid.capabilitiesByTile[y * mapPlacementGrid.width + x]?.water !== true;
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
