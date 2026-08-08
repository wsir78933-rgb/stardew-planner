import { gateCatalogItemId, gateRenderingMetadata, type CatalogItem } from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type { PlacementPixelGeometry, PlacementRenderFrame } from "./placement-rendering";

const fenceItemIds = new Set(["fence:298", "fence:322", "fence:323", "fence:324"]);

export type GatePlacementRenderLayer = Readonly<{
  frame: PlacementRenderFrame;
  pixelGeometry: PlacementPixelGeometry;
  textureLocalPath: string;
}>;

export function createGatePlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  placementItems: readonly PlacementItem[],
): readonly GatePlacementRenderLayer[] | null {
  if (catalogItem.id !== placementItem.itemId) {
    throw new Error(`Gate placement item ID ${JSON.stringify(placementItem.itemId)} does not match catalog item ID ${JSON.stringify(catalogItem.id)}.`);
  }
  if (catalogItem.id !== gateCatalogItemId) {
    if (catalogItem.renderingMetadata?.kind === "gate") {
      throw new Error(`Gate catalog item ${JSON.stringify(catalogItem.id)} must use exact ID ${JSON.stringify(gateCatalogItemId)}; received ${JSON.stringify(catalogItem.renderingMetadata)}.`);
    }
    return null;
  }
  if (catalogItem.category !== "fence" || catalogItem.renderingMetadata?.kind !== "gate" || catalogItem.renderingMetadata.textureLocalPath !== gateRenderingMetadata.textureLocalPath) {
    throw new Error(`Gate catalog item ${JSON.stringify(catalogItem.id)} requires fence category and metadata ${JSON.stringify(gateRenderingMetadata)}; received category ${JSON.stringify(catalogItem.category)} and metadata ${JSON.stringify(catalogItem.renderingMetadata)}.`);
  }
  const fenceCoordinates = new Set(placementItems.filter((item) => item.layer === "fence" && fenceItemIds.has(item.itemId)).map((item) => `${item.x},${item.y}`));
  const hasNorth = fenceCoordinates.has(`${placementItem.x},${placementItem.y - 1}`);
  const hasEast = fenceCoordinates.has(`${placementItem.x + 1},${placementItem.y}`);
  const hasSouth = fenceCoordinates.has(`${placementItem.x},${placementItem.y + 1}`);
  const hasWest = fenceCoordinates.has(`${placementItem.x - 1},${placementItem.y}`);
  const mask = (hasNorth ? 1000 : 0) + (hasEast ? 100 : 0) + (hasSouth ? 500 : 0) + (hasWest ? 10 : 0);
  return getGateFrames(mask).map((frame) => ({
    frame: { x: frame.x, y: frame.y, width: frame.width, height: frame.height },
    pixelGeometry: { anchorX: 0, anchorY: 0, horizontalScale: 1, positionX: placementItem.x * 16 + frame.offsetX, positionY: placementItem.y * 16 + frame.offsetY },
    textureLocalPath: gateRenderingMetadata.textureLocalPath,
  }));
}

type GateFrame = Readonly<{ x:number;y:number;width:number;height:number;offsetX:number;offsetY:number }>;
function getGateFrames(mask: number): readonly GateFrame[] {
  switch (mask) {
    case 110: return [{ x: 0, y: 128, width: 24, height: 32, offsetX: -4, offsetY: -16 }];
    case 1500: return [{ x: 0, y: 160, width: 16, height: 16, offsetX: 5, offsetY: -21 }, { x: 0, y: 176, width: 16, height: 16, offsetX: 5, offsetY: -5 }];
    case 10: return [{ x: 0, y: 192, width: 24, height: 48, offsetX: -4, offsetY: -32 }];
    case 100: return [{ x: 0, y: 240, width: 24, height: 48, offsetX: -4, offsetY: -32 }];
    case 1000: return [{ x: 0, y: 288, width: 24, height: 32, offsetX: 5, offsetY: -21 }];
    case 500: return [{ x: 0, y: 320, width: 24, height: 32, offsetX: 5, offsetY: -21 }];
    default: return [{ x: 32, y: 160, width: 16, height: 32, offsetX: 0, offsetY: -16 }];
  }
}
