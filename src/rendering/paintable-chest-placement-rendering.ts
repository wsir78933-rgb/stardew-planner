import type { CatalogItem } from "../catalog";
import { getLockedPaintableChestMetadata } from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderFrame,
} from "./placement-rendering";

const tileSize = 16;

const chestFramesByRecordId: Readonly<Record<string, Readonly<{
  body: Exclude<PlacementRenderFrame, null>;
  lid: Exclude<PlacementRenderFrame, null>;
  lock: Exclude<PlacementRenderFrame, null>;
}>>> = {
  "130": { body: { x: 0, y: 672, width: 16, height: 32 }, lid: { x: 0, y: 704, width: 16, height: 32 }, lock: { x: 0, y: 725, width: 16, height: 11 } },
  "232": { body: { x: 0, y: 928, width: 16, height: 32 }, lid: { x: 0, y: 960, width: 16, height: 32 }, lock: { x: 0, y: 981, width: 16, height: 11 } },
  BigChest: { body: { x: 0, y: 1248, width: 16, height: 32 }, lid: { x: 0, y: 1280, width: 16, height: 32 }, lock: { x: 0, y: 1301, width: 16, height: 11 } },
  BigStoneChest: { body: { x: 0, y: 1312, width: 16, height: 32 }, lid: { x: 0, y: 1344, width: 16, height: 32 }, lock: { x: 0, y: 1365, width: 16, height: 11 } },
};

export type PaintableChestPlacementRenderLayer = Readonly<{
  frame: Exclude<PlacementRenderFrame, null>;
  pixelGeometry: PlacementPixelGeometry;
  shouldApplySelectionTint: false;
  tintColor?: string;
}>;

export function createPaintableChestPlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): readonly PaintableChestPlacementRenderLayer[] | null {
  const recordId = getBigCraftableRecordId(catalogItem.id);
  const lockedMetadata = recordId === null
    ? undefined
    : getLockedPaintableChestMetadata(recordId);

  if (recordId === null || lockedMetadata === undefined) {
    if (catalogItem.paintableChest !== undefined) {
      throw new Error(`Paintable chest catalog item ${describeValue(catalogItem.id)} is not in the locked chest ID set.`);
    }
    return null;
  }
  if (catalogItem.paintableChest?.kind !== lockedMetadata.kind) {
    throw new Error(`Paintable chest catalog item ${describeValue(catalogItem.id)} requires locked paintable chest metadata; received ${describeValue(catalogItem.paintableChest)}.`);
  }
  const chestFrames = chestFramesByRecordId[recordId];
  if (chestFrames === undefined) {
    throw new Error(`Paintable chest record ID ${describeValue(recordId)} has no locked composite frames.`);
  }
  const positionX = placementItem.x * tileSize;
  const positionY = placementItem.y * tileSize - tileSize;

  return [
    { frame: chestFrames.body, pixelGeometry: createPixelGeometry(positionX, positionY), shouldApplySelectionTint: false, tintColor: placementItem.tintColor },
    { frame: chestFrames.lock, pixelGeometry: createPixelGeometry(positionX, positionY + 21), shouldApplySelectionTint: false },
    { frame: chestFrames.lid, pixelGeometry: createPixelGeometry(positionX, positionY), shouldApplySelectionTint: false },
  ];
}

function getBigCraftableRecordId(catalogItemId: string): string | null {
  const prefix = "big-craftable:";
  return catalogItemId.startsWith(prefix) ? catalogItemId.slice(prefix.length) : null;
}

function createPixelGeometry(positionX: number, positionY: number): PlacementPixelGeometry {
  return { anchorX: 0, anchorY: 0, horizontalScale: 1, positionX, positionY };
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
