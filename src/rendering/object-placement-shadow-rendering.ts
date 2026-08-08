import {
  isLockedObjectPlacementShadowCatalogItemId,
  objectPlacementShadowMetadata,
  type CatalogItem,
  type CatalogPlacementShadowMetadata,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type { PlacementPixelGeometry, PlacementRenderFrame } from "./placement-rendering";

const tilePixelSize = 16;

export type ObjectPlacementShadowRenderLayer = Readonly<{
  frame: PlacementRenderFrame;
  opacity: number;
  pixelGeometry: PlacementPixelGeometry;
  shouldApplySelectionTint: false;
  textureLocalPath: string;
}>;

export function createObjectPlacementShadowRenderLayer(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): ObjectPlacementShadowRenderLayer | null {
  if (catalogItem.id !== placementItem.itemId) {
    throw new Error(
      `Object placement shadow item ID ${describeValue(placementItem.itemId)} does not match catalog item ID ${describeValue(catalogItem.id)}.`,
    );
  }

  const placementShadow = catalogItem.placementShadow;
  const isLockedShadowItem = isLockedObjectPlacementShadowCatalogItemId(
    catalogItem.id,
  );
  if (!isLockedShadowItem) {
    if (placementShadow !== undefined) {
      throw new Error(
        `Object placement shadow catalog item ${describeValue(catalogItem.id)} is not in the locked shadow ID set; received ${describeValue(placementShadow)}.`,
      );
    }
    return null;
  }

  assertLockedObjectPlacementShadowMetadata(catalogItem.id, placementShadow);
  return {
    frame: null,
    opacity: placementShadow.alpha,
    pixelGeometry: {
      anchorX: 0.5,
      anchorY: 0.5,
      horizontalScale: 1,
      positionX: placementItem.x * tilePixelSize + 8,
      positionY: placementItem.y * tilePixelSize + 13.75,
    },
    shouldApplySelectionTint: false,
    textureLocalPath: placementShadow.textureLocalPath,
  };
}

function assertLockedObjectPlacementShadowMetadata(
  catalogItemId: string,
  placementShadow: CatalogPlacementShadowMetadata | undefined,
): asserts placementShadow is CatalogPlacementShadowMetadata {
  if (
    placementShadow?.alpha !== objectPlacementShadowMetadata.alpha ||
    placementShadow.textureLocalPath !== objectPlacementShadowMetadata.textureLocalPath
  ) {
    throw new Error(
      `Object placement shadow catalog item ${describeValue(catalogItemId)} requires metadata ${describeValue(objectPlacementShadowMetadata)}; received ${describeValue(placementShadow)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
