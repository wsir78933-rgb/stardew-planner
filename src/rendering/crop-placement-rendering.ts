import {
  formatCropTintColor,
  getCropRenderingMetadata,
  getCropTintColorAt,
  type CatalogItem,
} from "../catalog";
import type { PlacementCrop } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderFrame,
} from "./placement-rendering";

const cropTilePixelSize = 16;
const forageShadowTextureLocalPath =
  "/game-assets/1.6.15/sprites/shadow.png";

export type CropPlacementRenderLayer = Readonly<{
  frame: PlacementRenderFrame;
  opacity?: number;
  pixelGeometry?: PlacementPixelGeometry;
  shouldApplySelectionTint?: false;
  textureLocalPath: string;
  tintColor?: string;
}>;

export type CropPlacementRenderingContext = Readonly<{
  isInGardenPot: boolean;
}>;

export function createCropPlacementRenderLayers(
  catalogItem: CatalogItem,
  crop: PlacementCrop,
  renderingContext: CropPlacementRenderingContext,
): readonly CropPlacementRenderLayer[] {
  const cropRenderingMetadata = getCropRenderingMetadata(catalogItem);
  const zOrderedLayers: CropPlacementRenderLayer[] = [];
  const gardenPotPixelGeometry = renderingContext.isInGardenPot
    ? createGardenPotCropPixelGeometry(crop, cropRenderingMetadata.hasForageShadow)
    : undefined;

  if (cropRenderingMetadata.hasForageShadow && !renderingContext.isInGardenPot) {
    zOrderedLayers.push({
      frame: null,
      opacity: 0.5,
      pixelGeometry: {
        anchorX: 0.5,
        anchorY: 0.5,
        horizontalScale: 1,
        positionX: crop.x * cropTilePixelSize + 8,
        positionY: crop.y * cropTilePixelSize + 13.25,
      },
      shouldApplySelectionTint: false,
      textureLocalPath: forageShadowTextureLocalPath,
    });
  }

  zOrderedLayers.push({
    frame: toPlacementRenderFrame(cropRenderingMetadata.fullyGrownRect),
    ...(gardenPotPixelGeometry === undefined
      ? {}
      : { pixelGeometry: gardenPotPixelGeometry }),
    textureLocalPath: catalogItem.textureLocalPath,
  });

  if (cropRenderingMetadata.coloredRect !== undefined) {
    const tintColor = getCropTintColorAt(
      cropRenderingMetadata,
      crop.x,
      crop.y,
    );
    if (tintColor === undefined) {
      throw new Error(
        `Crop catalog item ${JSON.stringify(catalogItem.id)} has a colored frame without a tint color.`,
      );
    }
    zOrderedLayers.push({
      frame: toPlacementRenderFrame(cropRenderingMetadata.coloredRect),
      ...(gardenPotPixelGeometry === undefined
        ? {}
        : { pixelGeometry: gardenPotPixelGeometry }),
      textureLocalPath: catalogItem.textureLocalPath,
      tintColor: formatCropTintColor(tintColor),
    });
  }

  return zOrderedLayers;
}

function createGardenPotCropPixelGeometry(
  crop: PlacementCrop,
  hasForageShadow: boolean,
): PlacementPixelGeometry {
  return {
    anchorX: 0,
    anchorY: 0,
    horizontalScale: 1,
    positionX: crop.x * cropTilePixelSize,
    positionY: crop.y * cropTilePixelSize - (hasForageShadow ? 6 : 22),
  };
}

function toPlacementRenderFrame(
  sourceRect: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
): PlacementRenderFrame {
  return {
    x: sourceRect.x,
    y: sourceRect.y,
    width: sourceRect.width,
    height: sourceRect.height,
  };
}
