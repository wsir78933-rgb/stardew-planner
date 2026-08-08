import type { CatalogFurnitureFireRenderingMetadata, CatalogItem } from "../catalog";
import { getLockedFurnitureFireRenderingMetadata } from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderFrame,
} from "./placement-rendering";

const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const largeFlameFrames = [0, 1, 2, 3].map((frameIndex) => ({
  x: 276 + frameIndex * 12,
  y: 1985,
  width: 12,
  height: 11,
}));
const glowFrame = { x: 88, y: 1779, width: 30, height: 30 };

export type FurnitureFirePlacementRenderLayer = Readonly<{
  animation?: PlacementRenderAnimation;
  frame: PlacementRenderFrame;
  opacity?: number;
  pixelGeometry: PlacementPixelGeometry;
  shouldApplySelectionTint: false;
  textureLocalPath: string;
  tintColor: "#ffffff" | "#eee8aa";
}>;

export function createFurnitureFirePlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): readonly FurnitureFirePlacementRenderLayer[] | null {
  const recordId = getFurnitureRecordId(catalogItem.id);
  const lockedRenderingMetadata = recordId === null
    ? undefined
    : getLockedFurnitureFireRenderingMetadata(recordId);

  if (lockedRenderingMetadata === undefined) {
    if (catalogItem.furnitureFire !== undefined) {
      throw new Error(
        `Furniture fire catalog item ${describeValue(catalogItem.id)} is not in the locked ${catalogItem.furnitureFire.kind} ID set; received ${describeValue(catalogItem.furnitureFire)}.`,
      );
    }
    return null;
  }

  assertLockedFurnitureFireRenderingMetadata(
    catalogItem.id,
    catalogItem.furnitureFire,
    lockedRenderingMetadata,
  );

  if (placementItem.variant === 1) {
    return [];
  }

  return lockedRenderingMetadata.kind === "fireplace"
    ? createFireplaceRenderLayers(placementItem)
    : [createTorchFlameLayer(placementItem)];
}

function createFireplaceRenderLayers(
  placementItem: PlacementItem,
): readonly FurnitureFirePlacementRenderLayer[] {
  return [
    createFlameLayer(placementItem, 13, -8, 0),
    createFlameLayer(placementItem, 7, -8, 200),
    createGlowLayer(placementItem),
  ];
}

function createTorchFlameLayer(
  placementItem: PlacementItem,
): FurnitureFirePlacementRenderLayer {
  return createFlameLayer(placementItem, 3, -18, 0);
}

function createFlameLayer(
  placementItem: PlacementItem,
  offsetX: number,
  offsetY: number,
  timeOffsetMilliseconds: number,
): FurnitureFirePlacementRenderLayer {
  return {
    animation: {
      frameDurationMilliseconds: 100,
      frames: largeFlameFrames,
      kind: "frame-cycle",
      timeOffsetMilliseconds:
        createFlamePositionTimeOffset(placementItem.x, placementItem.y)
        + timeOffsetMilliseconds,
    },
    frame: largeFlameFrames[0],
    pixelGeometry: createPixelGeometry(
      placementItem.x * 16 + offsetX,
      placementItem.y * 16 + offsetY,
      0,
      0,
      1,
    ),
    shouldApplySelectionTint: false,
    textureLocalPath: cursorTextureLocalPath,
    tintColor: "#ffffff",
  };
}

function createGlowLayer(
  placementItem: PlacementItem,
): FurnitureFirePlacementRenderLayer {
  return {
    animation: {
      baseScale: 0.8,
      kind: "scale-pulse",
      phaseOffsetMilliseconds: createGlowPositionPhaseOffset(placementItem.x, placementItem.y),
      pulseAmplitude: 0.25,
      timeDivisorMilliseconds: 1000,
      timeModuloMilliseconds: 3140,
    },
    frame: glowFrame,
    opacity: 0.35,
    pixelGeometry: createPixelGeometry(
      placementItem.x * 16 + 16,
      placementItem.y * 16 - 8,
      0.5,
      0.5,
      0.8,
    ),
    shouldApplySelectionTint: false,
    textureLocalPath: cursorTextureLocalPath,
    tintColor: "#eee8aa",
  };
}

function createPixelGeometry(
  positionX: number,
  positionY: number,
  anchorX: number,
  anchorY: number,
  uniformScale: number,
): PlacementPixelGeometry {
  return { anchorX, anchorY, horizontalScale: 1, positionX, positionY, uniformScale };
}

function getFurnitureRecordId(catalogItemId: string): string | null {
  const prefix = "furniture_";
  if (!catalogItemId.startsWith(prefix)) {
    return null;
  }
  return catalogItemId.slice(prefix.length);
}

function assertLockedFurnitureFireRenderingMetadata(
  catalogItemId: string,
  renderingMetadata: CatalogItem["furnitureFire"],
  lockedRenderingMetadata: CatalogFurnitureFireRenderingMetadata,
): asserts renderingMetadata is CatalogFurnitureFireRenderingMetadata {
  if (renderingMetadata?.kind !== lockedRenderingMetadata.kind) {
    throw new Error(`Furniture fire catalog item ${describeValue(catalogItemId)} rendering metadata must match the locked definition; received ${describeValue(renderingMetadata)}.`);
  }
}

function createFlamePositionTimeOffset(x: number, y: number): number {
  return ((x * 3047 + y * 88 + x * y * 31) ^ 1502) % 400;
}

function createGlowPositionPhaseOffset(x: number, y: number): number {
  return ((x * 777 + y * 9746 + x * y * 31) ^ 25214903917) % 3140;
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
