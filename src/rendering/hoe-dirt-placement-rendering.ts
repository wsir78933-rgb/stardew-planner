import type { CatalogItem, CatalogSeason } from "../catalog";
import {
  assertHoeDirtRenderingMetadata,
  getFloorCatalogPlacementRequirement,
  hoeDirtCatalogItemId,
  hoeDirtRenderingMetadata,
} from "../catalog";
import type {
  PlacementCrop,
  PlacementItem,
  PlacementSnapshot,
} from "../placement/placement-snapshot";
import { getPlacementItemZIndex } from "../placement/placement-item-z-order";
import { isGardenPotAtTile } from "../placement/garden-pot-placement";

export type HoeDirtPlacementRenderLayer = Readonly<{
  catalogItem: CatalogItem;
  frame: Readonly<{
    x: number;
    y: number;
    width: 16;
    height: 16;
  }>;
  key: string;
  shouldApplySelectionTint: boolean;
  textureLocalPath: string;
  tileX: number;
  tileY: number;
  zIndex?: number;
}>;

type HoeDirtCoordinateSource = Readonly<{
  catalogItem: CatalogItem;
  key: string;
  shouldApplySelectionTint: boolean;
  tileX: number;
  tileY: number;
  zIndex?: number;
}>;

const frameIndexByCardinalMask = [
  0, 12, 13, 9, 4, 8, 1, 5, 15, 11, 14, 10, 3, 7, 2, 6,
] as const;

export function createHoeDirtPlacementRenderLayers(
  placementSnapshot: PlacementSnapshot,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  season: CatalogSeason,
): readonly HoeDirtPlacementRenderLayer[] {
  const coordinateSourcesByKey = new Map<string, HoeDirtCoordinateSource>();
  const connectedCoordinateKeys = new Set<string>();
  const wateredCoordinateKeys = new Set<string>();

  for (const placementCrop of placementSnapshot.crops) {
    if (isGardenPotAtTile(placementSnapshot.items, placementCrop)) {
      continue;
    }

    addCropCoordinate(
      placementCrop,
      catalogItemsById,
      coordinateSourcesByKey,
      connectedCoordinateKeys,
    );
  }

  for (const placementItem of placementSnapshot.items) {
    if (placementItem.itemId !== hoeDirtCatalogItemId) continue;

    addHoeDirtItemCoordinate(
      placementItem,
      catalogItemsById,
      coordinateSourcesByKey,
      connectedCoordinateKeys,
      wateredCoordinateKeys,
    );
  }

  return [...coordinateSourcesByKey.entries()].flatMap(
    ([coordinateKey, coordinateSource]) =>
      createCoordinateRenderLayers(
        coordinateKey,
        coordinateSource,
        connectedCoordinateKeys,
        wateredCoordinateKeys,
        season,
      ),
  );
}

export function createCropHoeDirtPlacementPreviewRenderLayers(
  placementSnapshot: PlacementSnapshot,
  placementCrop: PlacementCrop,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  season: CatalogSeason,
): readonly HoeDirtPlacementRenderLayer[] {
  if (isGardenPotAtTile(placementSnapshot.items, placementCrop)) return [];

  const { connectedCoordinateKeys, wateredCoordinateKeys } =
    createHoeDirtContextCoordinateKeys(placementSnapshot);
  const coordinateKey = createCoordinateKey(placementCrop.x, placementCrop.y);
  const cropCatalogItem = catalogItemsById.get(placementCrop.cropId);
  if (cropCatalogItem === undefined) {
    throw new Error(
      `HoeDirt preview cannot draw crop catalog item ID ${JSON.stringify(placementCrop.cropId)} because it is unavailable.`,
    );
  }
  connectedCoordinateKeys.add(coordinateKey);

  return createCoordinateRenderLayers(
    coordinateKey,
    {
      catalogItem: cropCatalogItem,
      key: `crop:${String(placementCrop.x)},${String(placementCrop.y)}`,
      shouldApplySelectionTint: false,
      tileX: placementCrop.x,
      tileY: placementCrop.y,
    },
    connectedCoordinateKeys,
    wateredCoordinateKeys,
    season,
  );
}

export function createItemHoeDirtPlacementPreviewRenderLayers(
  placementSnapshot: PlacementSnapshot,
  placementItem: PlacementItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  season: CatalogSeason,
): readonly HoeDirtPlacementRenderLayer[] {
  const { connectedCoordinateKeys, wateredCoordinateKeys } =
    createHoeDirtContextCoordinateKeys(placementSnapshot);
  const coordinateSourcesByKey = new Map<string, HoeDirtCoordinateSource>();
  addHoeDirtItemCoordinate(
    placementItem,
    catalogItemsById,
    coordinateSourcesByKey,
    connectedCoordinateKeys,
    wateredCoordinateKeys,
  );
  const coordinateKey = createCoordinateKey(placementItem.x, placementItem.y);
  const coordinateSource = coordinateSourcesByKey.get(coordinateKey);
  if (coordinateSource === undefined) {
    throw new Error(
      `HoeDirt preview did not create a render source for item at ${JSON.stringify(coordinateKey)}.`,
    );
  }

  return createCoordinateRenderLayers(
    coordinateKey,
    coordinateSource,
    connectedCoordinateKeys,
    wateredCoordinateKeys,
    season,
  );
}

function createHoeDirtContextCoordinateKeys(
  placementSnapshot: PlacementSnapshot,
): Readonly<{
  connectedCoordinateKeys: Set<string>;
  wateredCoordinateKeys: Set<string>;
}> {
  const connectedCoordinateKeys = new Set<string>();
  const wateredCoordinateKeys = new Set<string>();

  for (const placementCrop of placementSnapshot.crops) {
    if (!isGardenPotAtTile(placementSnapshot.items, placementCrop)) {
      connectedCoordinateKeys.add(
        createCoordinateKey(placementCrop.x, placementCrop.y),
      );
    }
  }
  for (const placementItem of placementSnapshot.items) {
    if (placementItem.itemId !== hoeDirtCatalogItemId) continue;
    const coordinateKey = createCoordinateKey(placementItem.x, placementItem.y);
    connectedCoordinateKeys.add(coordinateKey);
    if (placementItem.variant === 1) wateredCoordinateKeys.add(coordinateKey);
  }

  return { connectedCoordinateKeys, wateredCoordinateKeys };
}

function addCropCoordinate(
  placementCrop: PlacementCrop,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  coordinateSourcesByKey: Map<string, HoeDirtCoordinateSource>,
  connectedCoordinateKeys: Set<string>,
): void {
  const coordinateKey = createCoordinateKey(placementCrop.x, placementCrop.y);
  const cropCatalogItem = catalogItemsById.get(placementCrop.cropId);

  if (cropCatalogItem === undefined) {
    throw new Error(
      `HoeDirt rendering cannot draw crop catalog item ID ${JSON.stringify(placementCrop.cropId)} because it is unavailable.`,
    );
  }

  if (!coordinateSourcesByKey.has(coordinateKey)) {
    coordinateSourcesByKey.set(coordinateKey, {
      catalogItem: cropCatalogItem,
      key: `crop:${String(placementCrop.x)},${String(placementCrop.y)}`,
      shouldApplySelectionTint: false,
      tileX: placementCrop.x,
      tileY: placementCrop.y,
    });
  }
  connectedCoordinateKeys.add(coordinateKey);
}

function addHoeDirtItemCoordinate(
  placementItem: PlacementItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  coordinateSourcesByKey: Map<string, HoeDirtCoordinateSource>,
  connectedCoordinateKeys: Set<string>,
  wateredCoordinateKeys: Set<string>,
): void {
  const placementKey = `item:${String(placementItem.instanceId)}`;
  assertHoeDirtPlacementItem(placementItem, placementKey);
  const hoeDirtCatalogItem = catalogItemsById.get(hoeDirtCatalogItemId);

  if (hoeDirtCatalogItem === undefined) {
    throw new Error(
      `HoeDirt rendering cannot draw catalog item ID ${JSON.stringify(hoeDirtCatalogItemId)} because it is unavailable.`,
    );
  }

  getFloorCatalogPlacementRequirement(hoeDirtCatalogItem);
  const renderingMetadata = hoeDirtCatalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "hoe-dirt") {
    throw new TypeError(
      `HoeDirt rendering catalog item ${JSON.stringify(hoeDirtCatalogItem.id)} metadata must have kind "hoe-dirt"; received ${describeValue(renderingMetadata)}.`,
    );
  }
  assertHoeDirtRenderingMetadata(renderingMetadata, hoeDirtCatalogItem.id);

  const coordinateKey = createCoordinateKey(placementItem.x, placementItem.y);
  const existingCoordinateSource = coordinateSourcesByKey.get(coordinateKey);
  if (
    existingCoordinateSource === undefined
    || existingCoordinateSource.catalogItem.category === "crop"
  ) {
    coordinateSourcesByKey.set(coordinateKey, {
      catalogItem: hoeDirtCatalogItem,
      key: placementKey,
      shouldApplySelectionTint: true,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: getPlacementItemZIndex(placementItem),
    });
  }
  connectedCoordinateKeys.add(coordinateKey);
  if (placementItem.variant === 1) wateredCoordinateKeys.add(coordinateKey);
}

function assertHoeDirtPlacementItem(
  placementItem: PlacementItem,
  placementKey: string,
): void {
  if (placementItem.layer !== "path") {
    throw new TypeError(
      `HoeDirt rendering ${JSON.stringify(placementKey)} layer must be "path"; received ${describeValue(placementItem.layer)}.`,
    );
  }

  if (placementItem.variant !== 0 && placementItem.variant !== 1) {
    throw new TypeError(
      `HoeDirt rendering ${JSON.stringify(placementKey)} variant must be 0 or 1; received ${describeValue(placementItem.variant)}.`,
    );
  }
}

function createCoordinateRenderLayers(
  coordinateKey: string,
  coordinateSource: HoeDirtCoordinateSource,
  connectedCoordinateKeys: ReadonlySet<string>,
  wateredCoordinateKeys: ReadonlySet<string>,
  season: CatalogSeason,
): readonly HoeDirtPlacementRenderLayer[] {
  const textureLocalPath = getHoeDirtTextureLocalPath(
    coordinateSource.catalogItem,
    season,
  );
  const baseMask = createCardinalMask(
    coordinateSource.tileX,
    coordinateSource.tileY,
    connectedCoordinateKeys,
  );
  const baseLayer = createRenderLayer(
    coordinateSource,
    textureLocalPath,
    baseMask,
    0,
  );

  if (!wateredCoordinateKeys.has(coordinateKey)) return [baseLayer];

  const wateredMask = createCardinalMask(
    coordinateSource.tileX,
    coordinateSource.tileY,
    wateredCoordinateKeys,
  );
  return [
    baseLayer,
    createRenderLayer(
      coordinateSource,
      textureLocalPath,
      wateredMask,
      64,
    ),
  ];
}

function getHoeDirtTextureLocalPath(
  catalogItem: CatalogItem,
  season: CatalogSeason,
): string {
  if (catalogItem.id !== hoeDirtCatalogItemId) {
    return hoeDirtRenderingMetadata.seasonalTextureLocalPaths[season];
  }

  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "hoe-dirt") {
    throw new TypeError(
      `HoeDirt rendering catalog item ${JSON.stringify(catalogItem.id)} metadata must have kind "hoe-dirt"; received ${describeValue(renderingMetadata)}.`,
    );
  }
  assertHoeDirtRenderingMetadata(renderingMetadata, catalogItem.id);
  return renderingMetadata.seasonalTextureLocalPaths[season];
}

function createCardinalMask(
  tileX: number,
  tileY: number,
  connectedCoordinateKeys: ReadonlySet<string>,
): number {
  let cardinalMask = 0;
  if (connectedCoordinateKeys.has(createCoordinateKey(tileX, tileY - 1))) {
    cardinalMask |= 1;
  }
  if (connectedCoordinateKeys.has(createCoordinateKey(tileX + 1, tileY))) {
    cardinalMask |= 2;
  }
  if (connectedCoordinateKeys.has(createCoordinateKey(tileX, tileY + 1))) {
    cardinalMask |= 4;
  }
  if (connectedCoordinateKeys.has(createCoordinateKey(tileX - 1, tileY))) {
    cardinalMask |= 8;
  }
  return cardinalMask;
}

function createRenderLayer(
  coordinateSource: HoeDirtCoordinateSource,
  textureLocalPath: string,
  cardinalMask: number,
  xOffset: number,
): HoeDirtPlacementRenderLayer {
  const frameIndex = frameIndexByCardinalMask[cardinalMask];
  if (frameIndex === undefined) {
    throw new RangeError(
      `HoeDirt rendering cardinal mask must be from 0 through 15; received ${describeValue(cardinalMask)}.`,
    );
  }

  return {
    ...coordinateSource,
    frame: {
      x: (frameIndex % 4) * 16 + xOffset,
      y: Math.floor(frameIndex / 4) * 16,
      width: 16,
      height: 16,
    },
    textureLocalPath,
  };
}

function createCoordinateKey(tileX: number, tileY: number): string {
  return `${String(tileX)},${String(tileY)}`;
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  return JSON.stringify(value);
}
