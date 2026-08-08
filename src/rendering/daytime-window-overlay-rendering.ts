import type { CatalogItem } from "../catalog";
import {
  createPersistentPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderFrame,
} from "./placement-rendering";

const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const tileSize = 16;
const daytimeWindowOverlayFrame: Exclude<PlacementRenderFrame, null> = {
  x: 21,
  y: 1695,
  width: 41,
  height: 67,
};

export type DaytimeWindowOverlayDescriptor = Readonly<{
  frame: Exclude<PlacementRenderFrame, null>;
  itemInstanceId: number;
  pixelGeometry: PlacementPixelGeometry;
  textureLocalPath: string;
}>;

export type CreateDaytimeWindowOverlayDescriptorsInput = Readonly<{
  catalogItems: readonly Pick<CatalogItem, "id" | "renderingMetadata">[];
  isDaytime: boolean;
  placementSnapshot: PlacementSnapshot;
}>;

export function createDaytimeWindowOverlayDescriptors(
  input: CreateDaytimeWindowOverlayDescriptorsInput,
): readonly DaytimeWindowOverlayDescriptor[] {
  assertCreateDaytimeWindowOverlayDescriptorsInput(input);
  const windowCatalogItemIds = createWindowCatalogItemIds(input.catalogItems);
  const placementSnapshot = createPersistentPlacementSnapshot(input.placementSnapshot);

  if (!input.isDaytime) {
    return [];
  }

  return placementSnapshot.items.flatMap((placementItem) => (
    windowCatalogItemIds.has(placementItem.itemId)
      ? [createDaytimeWindowOverlayDescriptor(placementItem)]
      : []
  ));
}

export function createDaytimeWindowOverlayDescriptorForPlacementItem(
  catalogItem: Pick<CatalogItem, "id" | "renderingMetadata">,
  placementItem: PlacementItem,
  isDaytime: boolean,
): DaytimeWindowOverlayDescriptor | null {
  assertDaytimeWindowCatalogItem(catalogItem);
  if (typeof isDaytime !== "boolean") {
    throw new TypeError(
      `Daytime window isDaytime must be a boolean; received ${describeValue(isDaytime)}.`,
    );
  }

  if (
    !isDaytime
    || catalogItem.renderingMetadata?.kind !== "furniture"
    || catalogItem.renderingMetadata.isWindow !== true
  ) {
    return null;
  }

  return createDaytimeWindowOverlayDescriptor(placementItem);
}

function assertCreateDaytimeWindowOverlayDescriptorsInput(
  input: CreateDaytimeWindowOverlayDescriptorsInput,
): void {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(
      `Daytime window overlay input must be a non-null object; received ${describeValue(input)}.`,
    );
  }
  if (!Array.isArray(input.catalogItems)) {
    throw new TypeError(
      `Daytime window catalog items must be an array; received ${describeValue(input.catalogItems)}.`,
    );
  }
  if (typeof input.isDaytime !== "boolean") {
    throw new TypeError(
      `Daytime window isDaytime must be a boolean; received ${describeValue(input.isDaytime)}.`,
    );
  }
}

function createWindowCatalogItemIds(
  catalogItems: readonly Pick<CatalogItem, "id" | "renderingMetadata">[],
): ReadonlySet<string> {
  const catalogItemIds = new Set<string>();
  const windowCatalogItemIds = new Set<string>();

  for (const catalogItem of catalogItems) {
    assertDaytimeWindowCatalogItem(catalogItem);
    if (catalogItemIds.has(catalogItem.id)) {
      throw new Error(
        `Daytime window catalog items must not contain duplicate id ${describeValue(catalogItem.id)}.`,
      );
    }
    catalogItemIds.add(catalogItem.id);

    if (
      catalogItem.renderingMetadata?.kind === "furniture"
      && catalogItem.renderingMetadata.isWindow === true
    ) {
      windowCatalogItemIds.add(catalogItem.id);
    }
  }

  return windowCatalogItemIds;
}

function assertDaytimeWindowCatalogItem(
  catalogItem: Pick<CatalogItem, "id" | "renderingMetadata">,
): void {
  if (typeof catalogItem !== "object" || catalogItem === null) {
    throw new TypeError(
      `Daytime window catalog item must be a non-null object; received ${describeValue(catalogItem)}.`,
    );
  }
  if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
    throw new TypeError(
      `Daytime window catalog item id must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
    );
  }

  const furnitureRenderingMetadata = catalogItem.renderingMetadata;
  if (furnitureRenderingMetadata?.kind !== "furniture") {
    return;
  }

  const isFurnitureWindow = furnitureRenderingMetadata.furnitureType === "window";
  if (isFurnitureWindow !== (furnitureRenderingMetadata.isWindow === true)) {
    throw new Error(
      `Daytime window catalog item ${describeValue(catalogItem.id)} furniture Type ${describeValue(furnitureRenderingMetadata.furnitureType)} requires isWindow ${String(isFurnitureWindow)}; received ${describeValue(furnitureRenderingMetadata.isWindow)}.`,
    );
  }
  if (isFurnitureWindow && !furnitureRenderingMetadata.wallMounted) {
    throw new Error(
      `Daytime window catalog item ${describeValue(catalogItem.id)} furniture Type "window" requires wallMounted true; received ${describeValue(furnitureRenderingMetadata.wallMounted)}.`,
    );
  }
}

function createDaytimeWindowOverlayDescriptor(
  placementItem: PlacementSnapshot["items"][number],
): DaytimeWindowOverlayDescriptor {
  return {
    frame: daytimeWindowOverlayFrame,
    itemInstanceId: placementItem.instanceId,
    pixelGeometry: {
      anchorX: 4.75 / daytimeWindowOverlayFrame.width,
      anchorY: 5.5 / daytimeWindowOverlayFrame.height,
      horizontalScale: 1,
      positionX: placementItem.x * tileSize - tileSize / 2,
      positionY: placementItem.y * tileSize,
    },
    textureLocalPath: cursorTextureLocalPath,
  };
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
