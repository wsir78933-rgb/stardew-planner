import type {
  CatalogFurnitureRotationSprite,
  CatalogItem,
  CatalogSeason,
  CatalogSourceRect,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import {
  getBuildingPaintMaskLocalPath,
  type BuildingPaintColors,
} from "../paint/building-paint";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";

export type PlacementRenderFrame = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}> | null;

export type PlacementRenderEntry = Readonly<{
  buildingPaint?: Readonly<{
    colors: BuildingPaintColors;
    paintMaskLocalPath: string;
  }>;
  key: string;
  catalogItem: CatalogItem;
  tileX: number;
  tileY: number;
  frame: PlacementRenderFrame;
  rotationQuarterTurns: number;
  textureLocalPath?: string;
  isFlipped?: boolean;
  isTree?: boolean;
  tintColor?: string;
}>;

type ItemRenderProperties = {
  frame: PlacementRenderFrame;
  rotationQuarterTurns: number;
  textureLocalPath?: string;
  isFlipped?: boolean;
  isTree?: boolean;
  tintColor?: string;
};

export function createPlacementRenderEntries(
  placementSnapshot: PlacementSnapshot,
  catalogItems: readonly CatalogItem[],
  season: CatalogSeason = "spring",
): readonly PlacementRenderEntry[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const catalogItemsById = createCatalogItemsById(catalogItems);

  return [
    ...persistentPlacementSnapshot.buildings.map((building) => {
      const catalogItem = getRequiredCatalogItem(
        catalogItemsById,
        `building:${building.buildingId}`,
      );

      const paintMaskLocalPath =
        building.paintColors === undefined
          ? null
          : getBuildingPaintMaskLocalPath(building.buildingId);

      if (building.paintColors !== undefined && paintMaskLocalPath === null) {
        throw new Error(
          `Placement rendering building ${describeValue(building.buildingId)} has paint colors but no locked paint mask.`,
        );
      }

      return {
        ...(paintMaskLocalPath === null || building.paintColors === undefined
          ? {}
          : {
              buildingPaint: {
                colors: building.paintColors,
                paintMaskLocalPath,
              },
            }),
        key: `building:${String(building.instanceId)}`,
        catalogItem,
        tileX: building.x,
        tileY: building.y,
        frame: getCatalogItemFrame(catalogItem),
        rotationQuarterTurns: 0,
      };
    }),
    ...persistentPlacementSnapshot.crops.map((crop) => {
      const catalogItem = getRequiredCatalogItem(catalogItemsById, crop.cropId);

      return {
        key: `crop:${String(crop.x)},${String(crop.y)}`,
        catalogItem,
        tileX: crop.x,
        tileY: crop.y,
        frame: getCatalogItemFrame(catalogItem),
        rotationQuarterTurns: 0,
      };
    }),
    ...persistentPlacementSnapshot.items.map((item) => {
      const catalogItem = getRequiredCatalogItem(catalogItemsById, item.itemId);
      const itemRenderProperties = getItemRenderProperties(
        catalogItem,
        item,
        season,
      );

      return {
        key: `item:${String(item.instanceId)}`,
        catalogItem,
        tileX: item.x,
        tileY: item.y,
        ...itemRenderProperties,
      };
    }),
  ];
}

function getItemRenderProperties(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  season: CatalogSeason,
): ItemRenderProperties {
  const defaultFrame = getCatalogItemFrame(catalogItem);
  const defaultRotationQuarterTurns = placementItem.layer === "item"
    ? getNormalizedQuarterTurns(placementItem.rotation)
    : 0;
  const renderingMetadata = catalogItem.renderingMetadata;
  const itemRenderProperties: ItemRenderProperties = {
    frame: defaultFrame,
    rotationQuarterTurns: defaultRotationQuarterTurns,
  };

  if (placementItem.tintColor !== "#ffffff") {
    itemRenderProperties.tintColor = placementItem.tintColor;
  }

  if (renderingMetadata?.kind === "furniture") {
    const rotationSprite = getFurnitureRotationSprite(
      renderingMetadata.rotationSprites,
      defaultRotationQuarterTurns,
    );

    if (rotationSprite !== null) {
      itemRenderProperties.frame = rotationSprite.sprite;
      itemRenderProperties.rotationQuarterTurns = 0;

      if (isHorizontallyFlipped(placementItem.flipped, rotationSprite.flipped)) {
        itemRenderProperties.isFlipped = true;
      }

      return itemRenderProperties;
    }
  }

  if (renderingMetadata?.kind === "wild-tree") {
    itemRenderProperties.textureLocalPath =
      renderingMetadata.seasonalTextureLocalPaths[season];
    itemRenderProperties.isTree = true;
  }

  if (renderingMetadata?.kind === "fruit-tree") {
    itemRenderProperties.isTree = true;
  }

  if (placementItem.flipped) {
    itemRenderProperties.isFlipped = true;
  }

  return itemRenderProperties;
}

function getFurnitureRotationSprite(
  rotationSprites: readonly CatalogFurnitureRotationSprite[] | undefined,
  rotationQuarterTurns: number,
): CatalogFurnitureRotationSprite | null {
  if (rotationSprites === undefined || rotationSprites.length === 0) {
    return null;
  }

  return rotationSprites[rotationQuarterTurns % rotationSprites.length] ?? null;
}

function isHorizontallyFlipped(
  placementItemFlipped: boolean,
  rotationSpriteFlipped: true | undefined,
): boolean {
  return placementItemFlipped !== (rotationSpriteFlipped === true);
}

function getNormalizedQuarterTurns(rotation: number): number {
  return ((rotation % 4) + 4) % 4;
}

function createCatalogItemsById(
  catalogItems: readonly CatalogItem[],
): ReadonlyMap<string, CatalogItem> {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Placement rendering catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }

  const catalogItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of catalogItems) {
    assertCatalogItem(catalogItem);

    if (catalogItemsById.has(catalogItem.id)) {
      throw new Error(
        `Placement rendering catalog has duplicate item ID ${describeValue(catalogItem.id)}.`,
      );
    }

    catalogItemsById.set(catalogItem.id, catalogItem);
  }

  return catalogItemsById;
}

function getRequiredCatalogItem(
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  catalogItemId: string,
): CatalogItem {
  const catalogItem = catalogItemsById.get(catalogItemId);

  if (catalogItem === undefined) {
    throw new Error(
      `Placement rendering cannot draw persistent catalog item ID ${describeValue(catalogItemId)} because it is unavailable in the locked catalog.`,
    );
  }

  return catalogItem;
}

function getCatalogItemFrame(catalogItem: CatalogItem): PlacementRenderFrame {
  if (catalogItem.sprite.kind === "source-rect") {
    return getSourceRectFrame(catalogItem);
  }

  return getSpriteIndexFrame(catalogItem, catalogItem.sprite.index);
}

function getSourceRectFrame(catalogItem: CatalogItem): PlacementRenderFrame {
  const sourceRect = catalogItem.sprite as CatalogSourceRect;

  if (sourceRect.width === 0 || sourceRect.height === 0) {
    return null;
  }

  if (catalogItem.category === "floor" || catalogItem.category === "fence") {
    return {
      x: sourceRect.x,
      y: sourceRect.y,
      width: 16,
      height: 16,
    };
  }

  return {
    x: sourceRect.x,
    y: sourceRect.y,
    width: sourceRect.width,
    height: sourceRect.height,
  };
}

function getSpriteIndexFrame(
  catalogItem: CatalogItem,
  spriteIndex: number,
): PlacementRenderFrame {
  if (catalogItem.textureLocalPath.endsWith("/crops.png")) {
    return createIndexedFrame(spriteIndex, 16, 16, 32);
  }

  if (catalogItem.textureLocalPath.endsWith("/craftables.png")) {
    return createIndexedFrame(spriteIndex, 8, 16, 32);
  }

  if (catalogItem.textureLocalPath.endsWith("/springobjects.png")) {
    return createIndexedFrame(spriteIndex, 24, 16, 16);
  }

  throw new Error(
    `Placement rendering has no sprite-index frame layout for catalog item ID ${describeValue(catalogItem.id)} with local texture ${describeValue(catalogItem.textureLocalPath)}.`,
  );
}

function createIndexedFrame(
  spriteIndex: number,
  columns: number,
  frameWidth: number,
  frameHeight: number,
): PlacementRenderFrame {
  return {
    x: (spriteIndex % columns) * frameWidth,
    y: Math.floor(spriteIndex / columns) * frameHeight,
    width: frameWidth,
    height: frameHeight,
  };
}

function assertCatalogItem(catalogItem: CatalogItem): void {
  if (typeof catalogItem !== "object" || catalogItem === null) {
    throw new TypeError(
      `Placement rendering catalog item must be a non-null object; received ${describeValue(catalogItem)}.`,
    );
  }

  if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
    throw new TypeError(
      `Placement rendering catalog item ID must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
