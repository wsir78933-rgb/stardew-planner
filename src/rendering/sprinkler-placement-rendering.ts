import {
  getLockedSprinklerBaseRadius,
  type CatalogItem,
  type CatalogSprinklerRenderingMetadata,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";

const lockedTilePixelSize = 16;
const springObjectsTextureLocalPath =
  "/game-assets/1.6.15/tilesheets/springobjects.png";

export type SprinklerCoverageTile = Readonly<{
  x: number;
  y: number;
}>;

export type SprinklerAttachmentRenderLayer = Readonly<{
  frame: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  pixelGeometry: Readonly<{
    anchorX: number;
    anchorY: number;
    horizontalScale: 1;
    positionX: number;
    positionY: number;
  }>;
  textureLocalPath: string;
}>;

export function createSprinklerCoverageTiles(
  placementItem: PlacementItem,
): readonly SprinklerCoverageTile[] | null {
  const baseRadius = getLockedSprinklerBaseRadius(placementItem.itemId);

  if (baseRadius === null) {
    return null;
  }

  assertSprinklerVariant(placementItem);
  const coverageRadius = baseRadius + (placementItem.variant === 1 ? 1 : 0);

  if (coverageRadius === 0) {
    return [
      { x: placementItem.x, y: placementItem.y - 1 },
      { x: placementItem.x, y: placementItem.y + 1 },
      { x: placementItem.x - 1, y: placementItem.y },
      { x: placementItem.x + 1, y: placementItem.y },
    ];
  }

  return createSquareCoverageTiles(placementItem, coverageRadius);
}

export function createSprinklerAttachmentRenderLayer(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): SprinklerAttachmentRenderLayer | null {
  if (catalogItem.id !== placementItem.itemId) {
    throw new Error(
      `Sprinkler placement item ID ${describeValue(placementItem.itemId)} does not match catalog item ID ${describeValue(catalogItem.id)}.`,
    );
  }

  const baseRadius = getLockedSprinklerBaseRadius(catalogItem.id);

  if (baseRadius === null) {
    assertOrdinaryCatalogItemHasNoSprinklerMetadata(catalogItem);
    return null;
  }

  assertExactSprinklerMetadata(catalogItem, baseRadius);
  assertSprinklerVariant(placementItem);

  if (placementItem.variant === 0) {
    return null;
  }

  const isPressureNozzle = placementItem.variant === 1;

  return {
    frame: {
      x: isPressureNozzle ? 64 : 32,
      y: 608,
      width: 16,
      height: 16,
    },
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: placementItem.x * lockedTilePixelSize,
      positionY:
        placementItem.y * lockedTilePixelSize
        + (isPressureNozzle ? 0 : -5),
    },
    textureLocalPath: springObjectsTextureLocalPath,
  };
}

function createSquareCoverageTiles(
  placementItem: PlacementItem,
  coverageRadius: number,
): readonly SprinklerCoverageTile[] {
  const coverageTiles: SprinklerCoverageTile[] = [];

  for (let offsetY = -coverageRadius; offsetY <= coverageRadius; offsetY += 1) {
    for (let offsetX = -coverageRadius; offsetX <= coverageRadius; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      coverageTiles.push({
        x: placementItem.x + offsetX,
        y: placementItem.y + offsetY,
      });
    }
  }

  return coverageTiles;
}

function assertSprinklerVariant(placementItem: PlacementItem): void {
  if (
    !Number.isInteger(placementItem.variant)
    || placementItem.variant < 0
    || placementItem.variant > 2
  ) {
    throw new RangeError(
      `Sprinkler placement item ${describeValue(placementItem.itemId)} variant must be an integer from 0 through 2; received ${describeValue(placementItem.variant)}.`,
    );
  }
}

function assertExactSprinklerMetadata(
  catalogItem: CatalogItem,
  baseRadius: number,
): asserts catalogItem is CatalogItem & Readonly<{
  renderingMetadata: CatalogSprinklerRenderingMetadata;
}> {
  const expectedRenderingMetadata: CatalogSprinklerRenderingMetadata = {
    kind: "sprinkler",
    baseRadius,
  };
  const renderingMetadata = catalogItem.renderingMetadata;

  if (
    renderingMetadata?.kind !== "sprinkler"
    || renderingMetadata.baseRadius !== baseRadius
  ) {
    throw new Error(
      `Sprinkler catalog item ${describeValue(catalogItem.id)} requires rendering metadata ${describeValue(expectedRenderingMetadata)}; received ${describeValue(renderingMetadata)}.`,
    );
  }
}

function assertOrdinaryCatalogItemHasNoSprinklerMetadata(
  catalogItem: CatalogItem,
): void {
  if (catalogItem.renderingMetadata?.kind === "sprinkler") {
    throw new Error(
      `Catalog item ${describeValue(catalogItem.id)} cannot use sprinkler rendering metadata; received ${describeValue(catalogItem.renderingMetadata)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  const jsonValue = JSON.stringify(value);
  return jsonValue === undefined ? String(value) : jsonValue;
}
