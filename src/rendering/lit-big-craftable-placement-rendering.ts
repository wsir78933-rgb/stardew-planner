import type {
  CatalogItem,
  CatalogLitBigCraftableFlameLayer,
  CatalogLitBigCraftableRenderingMetadata,
} from "../catalog";
import { getLockedLitBigCraftableRenderingMetadata } from "../catalog";
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

const lockedTileSize = 16;
const cursorTextureLocalPath = resolveLocalGameAssetPath("sprites/Cursors.png");
const craftablesTextureLocalPath = resolveLocalGameAssetPath(
  "tilesheets/craftables.png",
);

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
      frames: fireAnimationFrames,
      kind: "frame-cycle",
      timeOffsetMilliseconds:
        resolveFireAnimationTimeOffset(placementItem.x, placementItem.y)
        + flameLayer.timeOffsetMilliseconds,
    },
    frame: fireAnimationFrames[0],
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
      phaseOffsetMilliseconds: resolveFireGlowPhaseOffset(
        placementItem.x,
        placementItem.y,
      ),
      pulseAmplitude: 0.2,
      timeDivisorMilliseconds: 1000,
      timeModuloMilliseconds: 3140,
    },
    frame: fireGlowFrame,
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
    catalogItem.textureLocalPath !== craftablesTextureLocalPath
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
