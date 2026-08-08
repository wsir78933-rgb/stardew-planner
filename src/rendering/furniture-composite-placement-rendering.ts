import type { CatalogItem } from "../catalog";
import { decodeFurnitureCompositeVariant } from "../catalog/furniture-composite-sprite";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderFrame,
} from "./placement-rendering";

export type FurnitureCompositePlacementRenderLayer = Readonly<{
  frame: Exclude<PlacementRenderFrame, null>;
  pixelGeometry: PlacementPixelGeometry;
  shouldApplySelectionTint: true;
  tintColor?: string;
}>;

const placementTileSize = 16;

export function createFurnitureCompositePlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): readonly FurnitureCompositePlacementRenderLayer[] | null {
  const renderingMetadata = catalogItem.renderingMetadata;

  if (
    renderingMetadata?.kind !== "furniture"
    || renderingMetadata.compositeSprite === null
    || placementItem.variant <= 0
  ) {
    return null;
  }

  const compositeSprite = renderingMetadata.compositeSprite;
  const layerVariants = decodeFurnitureCompositeVariant(
    compositeSprite,
    placementItem.variant,
  );

  return compositeSprite.layers.map((layer, layerIndex) => {
    const layerVariant = layerVariants[layerIndex];

    if (layerVariant === undefined) {
      throw new Error(
        `Furniture composite placement item ${JSON.stringify(placementItem.itemId)} has no decoded variant for layer ${String(layerIndex)}.`,
      );
    }

    const sourceColumn = layerVariant % compositeSprite.columns;
    const sourceRow = Math.floor(layerVariant / compositeSprite.columns);

    return {
      frame: {
        x: sourceColumn * compositeSprite.pieceSize,
        y: layer.baseY + sourceRow * compositeSprite.pieceSize,
        width: compositeSprite.pieceSize,
        height: compositeSprite.pieceSize,
      },
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: placementItem.x * placementTileSize,
        positionY: placementItem.y * placementTileSize + layer.offsetY,
      },
      shouldApplySelectionTint: true,
      ...(placementItem.tintColor === "#ffffff"
        ? {}
        : { tintColor: placementItem.tintColor }),
    };
  });
}
