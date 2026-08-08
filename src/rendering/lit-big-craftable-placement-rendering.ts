import type {
  CatalogItem,
  CatalogLitBigCraftableFlameLayer,
  CatalogLitBigCraftableRenderingMetadata,
} from "../catalog";
import { getLockedLitBigCraftableRenderingMetadata } from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderFrame,
} from "./placement-rendering";

const lockedTileSize = 16;
const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const flameFrames = [0, 1, 2, 3].map((frameIndex) => ({
  x: 276 + frameIndex * 12,
  y: 1985,
  width: 12,
  height: 11,
}));
const glowFrame = { x: 88, y: 1779, width: 30, height: 30 };

export type LitBigCraftablePlacementRenderLayer = Readonly<{
  animation?: PlacementRenderAnimation;
  frame: PlacementRenderFrame;
  opacity?: number;
  pixelGeometry: PlacementPixelGeometry;
  textureLocalPath?: string;
  tintColor?: string;
}>;

export function createLitBigCraftablePlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseFrame: PlacementRenderFrame,
): readonly LitBigCraftablePlacementRenderLayer[] | null {
  const recordId = getBigCraftableRecordId(catalogItem.id);
  const lockedRenderingMetadata = recordId === null
    ? undefined
    : getLockedLitBigCraftableRenderingMetadata(recordId);

  if (recordId === null || lockedRenderingMetadata === undefined) {
    if (catalogItem.renderingMetadata?.kind === "lit-big-craftable") {
      throw new Error(
        `Lit BigCraftable catalog item ${describeValue(catalogItem.id)} is not in the locked rendering ID set; received ${describeValue(catalogItem.renderingMetadata)}.`,
      );
    }

    return null;
  }

  assertLockedRenderingMetadata(
    catalogItem.id,
    catalogItem.renderingMetadata,
    lockedRenderingMetadata,
  );
  assertLitBigCraftableVariant(placementItem);
  assertLitBigCraftableBaseFrame(catalogItem, recordId, baseFrame);

  const baseLayer = createBaseLayer(placementItem, baseFrame);

  if (placementItem.variant === 1) {
    return [baseLayer];
  }

  return [
    baseLayer,
    ...lockedRenderingMetadata.flameLayers.map((flameLayer) =>
      createFlameLayer(placementItem, flameLayer)
    ),
    createGlowLayer(placementItem),
  ];
}

function createBaseLayer(
  placementItem: PlacementItem,
  baseFrame: Exclude<PlacementRenderFrame, null>,
): LitBigCraftablePlacementRenderLayer {
  return {
    frame: baseFrame,
    pixelGeometry: createPixelGeometry(
      placementItem.x * lockedTileSize,
      placementItem.y * lockedTileSize - lockedTileSize,
    ),
  };
}

function createFlameLayer(
  placementItem: PlacementItem,
  flameLayer: CatalogLitBigCraftableFlameLayer,
): LitBigCraftablePlacementRenderLayer {
  return {
    animation: {
      frameDurationMilliseconds: 100,
      frames: flameFrames,
      kind: "frame-cycle",
      timeOffsetMilliseconds:
        createFlamePositionTimeOffset(placementItem.x, placementItem.y)
        + flameLayer.timeOffsetMilliseconds,
    },
    frame: flameFrames[0],
    pixelGeometry: createPixelGeometry(
      placementItem.x * lockedTileSize + flameLayer.offsetX,
      placementItem.y * lockedTileSize + flameLayer.offsetY,
      0,
      0,
      flameLayer.scale,
    ),
    textureLocalPath: cursorTextureLocalPath,
  };
}

function createGlowLayer(
  placementItem: PlacementItem,
): LitBigCraftablePlacementRenderLayer {
  return {
    animation: {
      baseScale: 0.6,
      kind: "scale-pulse",
      phaseOffsetMilliseconds: createGlowPositionPhaseOffset(
        placementItem.x,
        placementItem.y,
      ),
      pulseAmplitude: 0.2,
      timeDivisorMilliseconds: 1000,
      timeModuloMilliseconds: 3140,
    },
    frame: glowFrame,
    opacity: 0.35,
    pixelGeometry: createPixelGeometry(
      placementItem.x * lockedTileSize + 8,
      placementItem.y * lockedTileSize,
      0.5,
      0.5,
      0.6,
    ),
    textureLocalPath: cursorTextureLocalPath,
    tintColor: "#eee8aa",
  };
}

function createPixelGeometry(
  positionX: number,
  positionY: number,
  anchorX = 0,
  anchorY = 0,
  uniformScale?: number,
): PlacementPixelGeometry {
  return {
    anchorX,
    anchorY,
    horizontalScale: 1,
    positionX,
    positionY,
    ...(uniformScale === undefined ? {} : { uniformScale }),
  };
}

function createFlamePositionTimeOffset(x: number, y: number): number {
  return ((x * 3047 + y * 88 + x * y * 31) ^ 1502) % 400;
}

function createGlowPositionPhaseOffset(x: number, y: number): number {
  return ((x * 777 + y * 9746 + x * y * 31) ^ 25214903917) % 3140;
}

function assertLockedRenderingMetadata(
  catalogItemId: string,
  renderingMetadata: CatalogItem["renderingMetadata"],
  lockedRenderingMetadata: CatalogLitBigCraftableRenderingMetadata,
): asserts renderingMetadata is CatalogLitBigCraftableRenderingMetadata {
  if (renderingMetadata?.kind !== "lit-big-craftable") {
    throw new Error(
      `Lit BigCraftable catalog item ${describeValue(catalogItemId)} requires locked rendering metadata; received ${describeValue(renderingMetadata)}.`,
    );
  }

  if (!hasEqualFlameLayers(renderingMetadata, lockedRenderingMetadata)) {
    throw new Error(
      `Lit BigCraftable catalog item ${describeValue(catalogItemId)} rendering metadata must match the locked definition; received ${describeValue(renderingMetadata)}.`,
    );
  }
}

function hasEqualFlameLayers(
  renderingMetadata: CatalogLitBigCraftableRenderingMetadata,
  lockedRenderingMetadata: CatalogLitBigCraftableRenderingMetadata,
): boolean {
  if (
    !Array.isArray(renderingMetadata.flameLayers)
    || renderingMetadata.flameLayers.length
      !== lockedRenderingMetadata.flameLayers.length
  ) {
    return false;
  }

  return renderingMetadata.flameLayers.every((flameLayer, layerIndex) => {
    const lockedFlameLayer = lockedRenderingMetadata.flameLayers[layerIndex];

    return typeof flameLayer === "object"
      && flameLayer !== null
      && lockedFlameLayer !== undefined
      && flameLayer.offsetX === lockedFlameLayer.offsetX
      && flameLayer.offsetY === lockedFlameLayer.offsetY
      && flameLayer.scale === lockedFlameLayer.scale
      && flameLayer.timeOffsetMilliseconds
        === lockedFlameLayer.timeOffsetMilliseconds;
  });
}

function assertLitBigCraftableVariant(placementItem: PlacementItem): void {
  if (placementItem.variant !== 0 && placementItem.variant !== 1) {
    throw new TypeError(
      `Lit BigCraftable placement item ${describeValue(placementItem.itemId)} variant must equal 0 or 1; received ${describeValue(placementItem.variant)}.`,
    );
  }
}

function assertLitBigCraftableBaseFrame(
  catalogItem: CatalogItem,
  recordId: string,
  baseFrame: PlacementRenderFrame,
): asserts baseFrame is Exclude<PlacementRenderFrame, null> {
  const lockedSpriteIndex = Number(recordId);
  if (
    catalogItem.sprite.kind !== "sprite-index"
    || catalogItem.sprite.index !== lockedSpriteIndex
  ) {
    throw new Error(
      `Lit BigCraftable catalog item ${describeValue(catalogItem.id)} sprite index must equal locked record ID ${String(lockedSpriteIndex)}; received ${catalogItem.sprite.kind === "sprite-index" ? describeValue(catalogItem.sprite.index) : describeValue(catalogItem.sprite)}.`,
    );
  }

  if (
    catalogItem.textureLocalPath
      !== "/game-assets/1.6.15/tilesheets/craftables.png"
    || baseFrame === null
    || baseFrame.width !== 16
    || baseFrame.height !== 32
  ) {
    throw new Error(
      `Lit BigCraftable catalog item ${describeValue(catalogItem.id)} must use a locked 16x32 craftables sprite-index frame; received texture ${describeValue(catalogItem.textureLocalPath)}, sprite ${describeValue(catalogItem.sprite)}, and frame ${describeValue(baseFrame)}.`,
    );
  }
}

function getBigCraftableRecordId(catalogItemId: string): string | null {
  const prefix = "big-craftable:";
  return catalogItemId.startsWith(prefix)
    ? catalogItemId.slice(prefix.length)
    : null;
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value);
}
