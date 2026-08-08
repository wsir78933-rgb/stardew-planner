import type { MapTileCoordinates } from "./map-placement-grids";
import type { PlacementItem } from "./placement-snapshot";

export const gardenPotCatalogItemId = "big-craftable:62";

export function isGardenPotAtTile(
  placementItems: readonly PlacementItem[],
  tile: MapTileCoordinates,
): boolean {
  return placementItems.some(
    (placementItem) =>
      placementItem.itemId === gardenPotCatalogItemId
      && tile.x >= placementItem.x
      && tile.x < placementItem.x + placementItem.footprint.width
      && tile.y >= placementItem.y
      && tile.y < placementItem.y + placementItem.footprint.height,
  );
}
