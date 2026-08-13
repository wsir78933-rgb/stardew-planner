import type { CatalogFurnitureFireRenderingMetadata, CatalogItem } from "../catalog";
import { getLockedFurnitureFireRenderingMetadata } from "../catalog";
import { resolveLocalGameAssetPath } from "../assets/local-game-asset-path";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderFrame,
} from "./placement-rendering";
import {
  fireAnimationFrames,
  fireGlowFrame,
  resolveFireAnimationTimeOffset,
  resolveFireGlowPhaseOffset,
} from "./fire-rendering-primitives";

const cursorTextureLocalPath = resolveLocalGameAssetPath("sprites/Cursors.png");

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
      frames: fireAnimationFrames,
      kind: "frame-cycle",
      timeOffsetMilliseconds:
        resolveFireAnimationTimeOffset(placementItem.x, placementItem.y)
        + timeOffsetMilliseconds,
    },
    frame: fireAnimationFrames[0],
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
      phaseOffsetMilliseconds: resolveFireGlowPhaseOffset(
        placementItem.x,
        placementItem.y,
      ),
      pulseAmplitude: 0.25,
      timeDivisorMilliseconds: 1000,
      timeModuloMilliseconds: 3140,
    },
    frame: fireGlowFrame,
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

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
