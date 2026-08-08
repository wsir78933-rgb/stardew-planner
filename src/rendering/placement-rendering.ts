import type {
  CatalogFurnitureRotationSprite,
  CatalogItem,
  CatalogSeason,
  CatalogSourceRect,
  CatalogTileSize,
} from "../catalog";
import {
  getCropRenderingMetadata,
  getSeasonalPlaceableFrame,
  hoeDirtCatalogItemId,
} from "../catalog";
import { getFurnitureBedType } from "../catalog/furniture";
import type { BuildingPaintColors } from "../paint/building-paint";
import {
  createPersistentPlacementSnapshot,
  type PlacementHeldItem,
  type PlacementItem,
  type PlacementSnapshot,
  type PlacementSnapshotAction,
} from "../placement/placement-snapshot";
import { getPlacementItemZIndex } from "../placement/placement-item-z-order";
import { getBedPlacementSemantics } from "../placement/bed-placement-semantics";
import { isGardenPotAtTile } from "../placement/garden-pot-placement";
import {
  createTreePlacementRenderLayers,
} from "./tree-placement-rendering";
import {
  createCropHoeDirtPlacementPreviewRenderLayers,
  createHoeDirtPlacementRenderLayers,
  createItemHoeDirtPlacementPreviewRenderLayers,
} from "./hoe-dirt-placement-rendering";
import { createSprinklerAttachmentRenderLayer } from "./sprinkler-placement-rendering";
import { createLitBigCraftablePlacementRenderLayers } from "./lit-big-craftable-placement-rendering";
import { createPaintableChestPlacementRenderLayers } from "./paintable-chest-placement-rendering";
import { createFurnitureCompositePlacementRenderLayers } from "./furniture-composite-placement-rendering";
import { createBuildingMultilayerPlacementRenderEntries } from "./building-multilayer-placement-rendering";
import { createCrabPotPixelGeometry } from "./crab-pot-placement-rendering";
import {
  createObjectPlacementShadowRenderLayer,
  type ObjectPlacementShadowRenderLayer,
} from "./object-placement-shadow-rendering";
import { createGatePlacementRenderLayers } from "./gate-placement-rendering";
import { createFurnitureFirePlacementRenderLayers } from "./furniture-fire-placement-rendering";
import { createDaytimeWindowOverlayDescriptorForPlacementItem } from "./daytime-window-overlay-rendering";
import { createCropPlacementRenderLayers } from "./crop-placement-rendering";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import { createGrassPlacementRenderLayers } from "./grass-placement-rendering";

export type PlacementRenderFrame = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}> | null;

export type PlacementPixelGeometry = Readonly<{
  anchorX: number;
  anchorY: number;
  horizontalMirrorCenterX?: number;
  horizontalScale: 1 | -1;
  positionX: number;
  positionY: number;
  uniformScale?: number;
}>;

export type PlacementFrameCycleAnimation = Readonly<{
  frameDurationMilliseconds: number;
  frames: readonly Exclude<PlacementRenderFrame, null>[];
  kind: "frame-cycle";
  timeOffsetMilliseconds: number;
}>;

export type PlacementScalePulseAnimation = Readonly<{
  baseScale: number;
  kind: "scale-pulse";
  phaseOffsetMilliseconds: number;
  pulseAmplitude: number;
  timeDivisorMilliseconds: number;
  timeModuloMilliseconds: number;
}>;

export type PlacementRenderAnimation =
  | PlacementFrameCycleAnimation
  | PlacementScalePulseAnimation;

export type PlacementRenderEntry = Readonly<{
  animation?: PlacementRenderAnimation;
  buildingPaint?: Readonly<{
    colors: BuildingPaintColors;
    paintMaskLocalPath: string;
  }>;
  effectiveFootprint: CatalogTileSize;
  key: string;
  layerId?: string;
  catalogItem: CatalogItem;
  tileX: number;
  tileY: number;
  frame: PlacementRenderFrame;
  pixelGeometry?: PlacementPixelGeometry;
  rotationQuarterTurns: number;
  opacity?: number;
  shouldApplySelectionTint?: boolean;
  textureLocalPath?: string;
  isFlipped?: boolean;
  tintColor?: string;
  zIndex?: number;
}>;

type ItemRenderProperties = {
  frame: PlacementRenderFrame;
  rotationQuarterTurns: number;
  textureLocalPath?: string;
  isFlipped?: boolean;
  tintColor?: string;
};

export function createPlacementRenderEntries(
  placementSnapshot: PlacementSnapshot,
  catalogItems: readonly CatalogItem[],
  season: CatalogSeason = "spring",
  mapId = "standard",
  mapPlacementGrid?: MapPlacementGrid,
  isNightMode = false,
): readonly PlacementRenderEntry[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );

  return createPlacementRenderEntriesFromSnapshot(
    persistentPlacementSnapshot,
    catalogItems,
    season,
    mapId,
    mapPlacementGrid,
    isNightMode,
  );
}

export function createTransientPlacementRenderEntries(
  placementSnapshot: PlacementSnapshot,
  previewAction: PlacementSnapshotAction,
  catalogItems: readonly CatalogItem[],
  season: CatalogSeason = "spring",
  mapId = "standard",
  mapPlacementGrid?: MapPlacementGrid,
  isNightMode = false,
): readonly PlacementRenderEntry[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const transientInstanceId = -1;
  const catalogItemsById = createCatalogItemsById(catalogItems);
  let transientRenderEntries: readonly PlacementRenderEntry[];

  switch (previewAction.type) {
    case "add-building": {
      const transientBuilding = {
        ...previewAction.building,
        instanceId: transientInstanceId,
      };
      const catalogItem = getRequiredCatalogItem(
        catalogItemsById,
        `building:${transientBuilding.buildingId}`,
      );
      transientRenderEntries = createBuildingMultilayerPlacementRenderEntries(
        catalogItem,
        transientBuilding,
        season,
        persistentPlacementSnapshot.items,
      );
      break;
    }
    case "add-crop": {
      const catalogItem = getRequiredCatalogItem(
        catalogItemsById,
        previewAction.crop.cropId,
      );
      const isInGardenPot = isGardenPotAtTile(
        persistentPlacementSnapshot.items,
        previewAction.crop,
      );
      const cropZIndex =
        (previewAction.crop.y + 1) * 2 - (isInGardenPot ? 0.5 : 1);
      transientRenderEntries = [
        ...createCropHoeDirtPlacementPreviewRenderLayers(
          persistentPlacementSnapshot,
          previewAction.crop,
          catalogItemsById,
          season,
        ).map((renderLayer) => ({
          ...renderLayer,
          effectiveFootprint: { width: 1, height: 1 },
          rotationQuarterTurns: 0,
        })),
        ...createCropPlacementRenderLayers(catalogItem, previewAction.crop, {
          isInGardenPot,
        }).map((renderLayer) => ({
          ...renderLayer,
          key: `crop:${String(previewAction.crop.x)},${String(previewAction.crop.y)}`,
          catalogItem,
          effectiveFootprint: catalogItem.tileSize,
          tileX: previewAction.crop.x,
          tileY: previewAction.crop.y,
          rotationQuarterTurns: 0,
          zIndex: cropZIndex,
        })),
      ];
      break;
    }
    case "add-item": {
      const transientItem = {
        ...previewAction.item,
        instanceId: transientInstanceId,
      };
      transientRenderEntries = transientItem.itemId === hoeDirtCatalogItemId
        ? createItemHoeDirtPlacementPreviewRenderLayers(
            persistentPlacementSnapshot,
            transientItem,
            catalogItemsById,
            season,
          ).map((renderLayer) => ({
            ...renderLayer,
            effectiveFootprint: { width: 1, height: 1 },
            rotationQuarterTurns: 0,
          }))
        : createItemAndHeldPlacementRenderEntries(
            transientItem,
            catalogItemsById,
            season,
            mapId,
            mapPlacementGrid,
            [...persistentPlacementSnapshot.items, transientItem],
            !isNightMode,
          );
      break;
    }
    case "attach-held-item": {
      const targetParentItem = persistentPlacementSnapshot.items.find(
        (placementItem) =>
          placementItem.instanceId === previewAction.parentInstanceId,
      );
      if (targetParentItem === undefined) {
        throw new Error(
          `Placement preview attachment requires parent instanceId ${String(previewAction.parentInstanceId)}; received ${describeValue(persistentPlacementSnapshot.items.map((placementItem) => placementItem.instanceId))}.`,
        );
      }
      const parentCatalogItem = getRequiredCatalogItem(
        catalogItemsById,
        targetParentItem.itemId,
      );
      transientRenderEntries = [createHeldItemPlacementRenderEntry(
        targetParentItem,
        parentCatalogItem,
        { ...previewAction.item, instanceId: transientInstanceId },
        catalogItemsById,
      )];
      break;
    }
    default:
      throw new TypeError(
        `Placement preview action must add a building, crop, item, or held item; received ${describeValue(previewAction.type)}.`,
      );
  }

  return transientRenderEntries.map((renderEntry) => ({
    ...renderEntry,
    key: "placement-preview",
  }));
}

function createPlacementRenderEntriesFromSnapshot(
  persistentPlacementSnapshot: PlacementSnapshot,
  catalogItems: readonly CatalogItem[],
  season: CatalogSeason,
  mapId: string,
  mapPlacementGrid: MapPlacementGrid | undefined,
  isNightMode: boolean,
): readonly PlacementRenderEntry[] {
  const catalogItemsById = createCatalogItemsById(catalogItems);

  return [
    ...persistentPlacementSnapshot.buildings.flatMap((building) => {
      const catalogItem = getRequiredCatalogItem(
        catalogItemsById,
        `building:${building.buildingId}`,
      );
      const multilayerRenderEntries =
        createBuildingMultilayerPlacementRenderEntries(
          catalogItem,
          building,
          season,
          persistentPlacementSnapshot.items,
        );
      return multilayerRenderEntries;
    }),
    ...createHoeDirtPlacementRenderLayers(
      persistentPlacementSnapshot,
      catalogItemsById,
      season,
    ).map((hoeDirtRenderLayer) => ({
      ...hoeDirtRenderLayer,
      effectiveFootprint: { width: 1, height: 1 },
      rotationQuarterTurns: 0,
    })),
    ...persistentPlacementSnapshot.crops.flatMap((crop) => {
      const catalogItem = getRequiredCatalogItem(catalogItemsById, crop.cropId);
      const isInGardenPot = isGardenPotAtTile(
        persistentPlacementSnapshot.items,
        crop,
      );
      const cropZIndex = (crop.y + 1) * 2 - (isInGardenPot ? 0.5 : 1);

      return createCropPlacementRenderLayers(catalogItem, crop, {
        isInGardenPot,
      }).map((renderLayer) => ({
        ...renderLayer,
        key: `crop:${String(crop.x)},${String(crop.y)}`,
        catalogItem,
        effectiveFootprint: catalogItem.tileSize,
        tileX: crop.x,
        tileY: crop.y,
        rotationQuarterTurns: 0,
        zIndex: cropZIndex,
      }));
    }),
    ...persistentPlacementSnapshot.items
      .filter((item) => item.itemId !== hoeDirtCatalogItemId)
      .flatMap(
        (item): readonly PlacementRenderEntry[] =>
          createItemAndHeldPlacementRenderEntries(
            item,
            catalogItemsById,
            season,
            mapId,
            mapPlacementGrid,
            persistentPlacementSnapshot.items,
            !isNightMode,
          ),
      ),
  ];
}

function createItemAndHeldPlacementRenderEntries(
  placementItem: PlacementItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  season: CatalogSeason,
  mapId: string,
  mapPlacementGrid: MapPlacementGrid | undefined,
  placementItems: readonly PlacementItem[],
  isDaytime: boolean,
): readonly PlacementRenderEntry[] {
  const parentRenderEntries = createItemPlacementRenderEntries(
    placementItem,
    catalogItemsById,
    season,
    mapId,
    mapPlacementGrid,
    placementItems,
  );

  if (placementItem.heldItem === undefined) {
    return appendDaytimeWindowOverlayRenderEntry(
      parentRenderEntries,
      placementItem,
      catalogItemsById,
      isDaytime,
    );
  }

  const parentCatalogItem = getRequiredCatalogItem(
    catalogItemsById,
    placementItem.itemId,
  );

  return [
    ...appendDaytimeWindowOverlayRenderEntry(
      parentRenderEntries,
      placementItem,
      catalogItemsById,
      isDaytime,
    ),
    createHeldItemPlacementRenderEntry(
      placementItem,
      parentCatalogItem,
      placementItem.heldItem,
      catalogItemsById,
    ),
  ];
}

function appendDaytimeWindowOverlayRenderEntry(
  parentRenderEntries: readonly PlacementRenderEntry[],
  placementItem: PlacementItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  isDaytime: boolean,
): readonly PlacementRenderEntry[] {
  const catalogItem = getRequiredCatalogItem(catalogItemsById, placementItem.itemId);
  const daytimeWindowOverlayDescriptor =
    createDaytimeWindowOverlayDescriptorForPlacementItem(
      catalogItem,
      placementItem,
      isDaytime,
    );

  if (daytimeWindowOverlayDescriptor === null) {
    return parentRenderEntries;
  }

  return [
    ...parentRenderEntries,
    {
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      frame: daytimeWindowOverlayDescriptor.frame,
      key: `item:${String(daytimeWindowOverlayDescriptor.itemInstanceId)}`,
      pixelGeometry: daytimeWindowOverlayDescriptor.pixelGeometry,
      rotationQuarterTurns: 0,
      shouldApplySelectionTint: false,
      textureLocalPath: daytimeWindowOverlayDescriptor.textureLocalPath,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: getPlacementItemZIndex(placementItem),
    },
  ];
}

function createItemPlacementRenderEntries(
  placementItem: PlacementItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  season: CatalogSeason,
  mapId: string,
  mapPlacementGrid: MapPlacementGrid | undefined,
  placementItems: readonly PlacementItem[],
): readonly PlacementRenderEntry[] {
  const catalogItem = getRequiredCatalogItem(
    catalogItemsById,
    placementItem.itemId,
  );
  assertPlacementItemFurnitureClassification(catalogItem, placementItem);
  const placementItemZIndex = getPlacementItemZIndex(placementItem);
  const grassPlacementRenderLayers = createGrassPlacementRenderLayers(
    catalogItem,
    placementItem,
    season,
  );
  const crabPotPixelGeometry = createCrabPotPixelGeometry(
    catalogItem,
    placementItem,
    mapPlacementGrid,
  );
  const objectPlacementShadowRenderLayer =
    createObjectPlacementShadowRenderLayer(catalogItem, placementItem);
  const litBigCraftablePlacementRenderLayers =
    createLitBigCraftablePlacementRenderLayers(
      catalogItem,
      placementItem,
      getCatalogItemFrame(catalogItem),
    );
  const paintableChestPlacementRenderLayers =
    createPaintableChestPlacementRenderLayers(catalogItem, placementItem);
  const furnitureFirePlacementRenderLayers =
    createFurnitureFirePlacementRenderLayers(catalogItem, placementItem);

  if (grassPlacementRenderLayers !== null) {
    return grassPlacementRenderLayers.map((renderLayer) => ({
      ...renderLayer,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      key: `item:${String(placementItem.instanceId)}`,
      rotationQuarterTurns: 0,
      tileX: placementItem.x,
      tileY: placementItem.y,
    }));
  }
  if (litBigCraftablePlacementRenderLayers !== null) {
    return litBigCraftablePlacementRenderLayers.map((renderLayer) => ({
      ...renderLayer,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      key: `item:${String(placementItem.instanceId)}`,
      rotationQuarterTurns: 0,
      shouldApplySelectionTint: true,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: placementItemZIndex,
    }));
  }
  if (paintableChestPlacementRenderLayers !== null) {
    return paintableChestPlacementRenderLayers.map((renderLayer) => ({
      ...renderLayer,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      key: `item:${String(placementItem.instanceId)}`,
      rotationQuarterTurns: 0,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: placementItemZIndex,
    }));
  }
  if (furnitureFirePlacementRenderLayers !== null) {
    return [
      createDefaultItemPlacementRenderEntry(catalogItem, placementItem),
      ...furnitureFirePlacementRenderLayers.map((renderLayer) => ({
        ...renderLayer,
        catalogItem,
        effectiveFootprint: placementItem.footprint,
        key: `item:${String(placementItem.instanceId)}`,
        rotationQuarterTurns: 0,
        tileX: placementItem.x,
        tileY: placementItem.y,
        zIndex: placementItemZIndex,
      })),
    ];
  }
  const gatePlacementRenderLayers = createGatePlacementRenderLayers(
    catalogItem,
    placementItem,
    placementItems,
  );
  if (gatePlacementRenderLayers !== null) {
    return gatePlacementRenderLayers.map((gatePlacementRenderLayer) => ({
      ...gatePlacementRenderLayer,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      key: `item:${String(placementItem.instanceId)}`,
      rotationQuarterTurns: 0,
      shouldApplySelectionTint: true,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: placementItemZIndex,
    }));
  }
  const furnitureCompositePlacementRenderLayers =
    createFurnitureCompositePlacementRenderLayers(catalogItem, placementItem);

  if (furnitureCompositePlacementRenderLayers !== null) {
    return furnitureCompositePlacementRenderLayers.map((renderLayer) => ({
      ...renderLayer,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      key: `item:${String(placementItem.instanceId)}`,
      rotationQuarterTurns: 0,
      tileX: placementItem.x,
      tileY: placementItem.y,
      zIndex: placementItemZIndex,
    }));
  }
  const sprinklerAttachmentRenderLayer =
    createSprinklerAttachmentRenderLayer(catalogItem, placementItem);

  if (sprinklerAttachmentRenderLayer !== null) {
    return [
      ...createObjectPlacementShadowRenderEntries(
        objectPlacementShadowRenderLayer,
        catalogItem,
        placementItem,
        placementItemZIndex,
      ),
      createDefaultItemPlacementRenderEntry(catalogItem, placementItem),
      {
        key: `item:${String(placementItem.instanceId)}`,
        catalogItem,
        effectiveFootprint: placementItem.footprint,
        tileX: placementItem.x,
        tileY: placementItem.y,
        frame: sprinklerAttachmentRenderLayer.frame,
        pixelGeometry: sprinklerAttachmentRenderLayer.pixelGeometry,
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: true,
        textureLocalPath: sprinklerAttachmentRenderLayer.textureLocalPath,
        zIndex: placementItemZIndex,
      },
    ];
  }

  const treePlacementRenderLayers = createTreePlacementRenderLayers({
    catalogItem,
    mapId,
    placementItem,
    season,
  });

  if (treePlacementRenderLayers !== null) {
    return treePlacementRenderLayers.map((treePlacementRenderLayer) => ({
      key: `item:${String(placementItem.instanceId)}`,
      catalogItem,
      effectiveFootprint: placementItem.footprint,
      tileX: placementItem.x,
      tileY: placementItem.y,
      frame: treePlacementRenderLayer.frame,
      pixelGeometry: treePlacementRenderLayer.pixelGeometry,
      rotationQuarterTurns: 0,
      shouldApplySelectionTint:
        treePlacementRenderLayer.shouldApplySelectionTint,
      textureLocalPath: treePlacementRenderLayer.textureLocalPath,
      zIndex: placementItemZIndex,
    }));
  }

  return [
    ...createObjectPlacementShadowRenderEntries(
      objectPlacementShadowRenderLayer,
      catalogItem,
      placementItem,
      placementItemZIndex,
    ),
    {
      ...createDefaultItemPlacementRenderEntry(catalogItem, placementItem, season),
      ...(crabPotPixelGeometry === null ? {} : { pixelGeometry: crabPotPixelGeometry }),
    },
  ];
}

function createObjectPlacementShadowRenderEntries(
  objectPlacementShadowRenderLayer: ObjectPlacementShadowRenderLayer | null,
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  placementItemZIndex: number,
): readonly PlacementRenderEntry[] {
  if (objectPlacementShadowRenderLayer === null) {
    return [];
  }

  return [{
    ...objectPlacementShadowRenderLayer,
    catalogItem,
    effectiveFootprint: placementItem.footprint,
    key: `item:${String(placementItem.instanceId)}`,
    rotationQuarterTurns: 0,
    tileX: placementItem.x,
    tileY: placementItem.y,
    zIndex: placementItemZIndex,
  }];
}

function createDefaultItemPlacementRenderEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  season: CatalogSeason = "spring",
): PlacementRenderEntry {
  return {
    key: `item:${String(placementItem.instanceId)}`,
    catalogItem,
    effectiveFootprint: placementItem.footprint,
    tileX: placementItem.x,
    tileY: placementItem.y,
    zIndex: getPlacementItemZIndex(placementItem),
    ...getItemRenderProperties(catalogItem, placementItem, season),
  };
}

function createHeldItemPlacementRenderEntry(
  parentPlacementItem: PlacementItem,
  parentCatalogItem: CatalogItem,
  heldPlacementItem: PlacementHeldItem,
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
): PlacementRenderEntry {
  const heldCatalogItem = getRequiredCatalogItem(
    catalogItemsById,
    heldPlacementItem.itemId,
  );
  assertHeldItemCatalogMetadata(heldCatalogItem, heldPlacementItem);
  const heldItemRenderProperties = getItemRenderProperties(
    heldCatalogItem,
    heldPlacementItem,
  );
  const heldItemFrame = heldItemRenderProperties.frame;

  if (heldItemFrame === null) {
    throw new Error(
      `Placement rendering held item instanceId ${String(heldPlacementItem.instanceId)} catalog item ${describeValue(heldCatalogItem.id)} requires a non-empty furniture frame; received ${describeValue(heldItemFrame)}.`,
    );
  }

  const parentCenterX = parentPlacementItem.x * 16
    + parentPlacementItem.footprint.width * 8;
  const parentCenterY = parentPlacementItem.y * 16
    + parentPlacementItem.footprint.height * 8;
  const isTeaTable = containsTea(parentPlacementItem.itemId)
    || containsTea(parentCatalogItem.name);

  return {
    key: `item:${String(heldPlacementItem.instanceId)}`,
    catalogItem: heldCatalogItem,
    effectiveFootprint: { width: 1, height: 1 },
    tileX: parentPlacementItem.x,
    tileY: parentPlacementItem.y,
    frame: heldItemFrame,
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: parentCenterX - 8,
      positionY: parentCenterY - heldItemFrame.height - (isTeaTable ? -4 : 4),
    },
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: true,
    zIndex: getPlacementItemZIndex(parentPlacementItem) + 0.001,
  };
}

function assertHeldItemCatalogMetadata(
  heldCatalogItem: CatalogItem,
  heldPlacementItem: PlacementHeldItem,
): void {
  if (heldCatalogItem.renderingMetadata?.kind !== "furniture") {
    throw new Error(
      `Placement rendering held item instanceId ${String(heldPlacementItem.instanceId)} requires furniture catalog metadata for item ${describeValue(heldCatalogItem.id)}; received ${describeValue(heldCatalogItem.renderingMetadata)}.`,
    );
  }

  assertPlacementItemFurnitureClassification(heldCatalogItem, heldPlacementItem);
}

function containsTea(value: string): boolean {
  return value.toLowerCase().includes("tea");
}

function assertPlacementItemFurnitureClassification(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): void {
  const renderingMetadata = catalogItem.renderingMetadata;
  const catalogIsRug =
    renderingMetadata?.kind === "furniture"
    && renderingMetadata.furnitureType === "rug";

  if (
    renderingMetadata?.kind === "furniture"
    && renderingMetadata.isRug !== catalogIsRug
  ) {
    throw new Error(
      `Placement rendering catalog item ${describeValue(catalogItem.id)} furniture Type ${describeValue(renderingMetadata.furnitureType)} requires isRug ${String(catalogIsRug)}; received ${describeValue(renderingMetadata.isRug)}.`,
    );
  }

  if (placementItem.isRug !== catalogIsRug) {
    const catalogType = renderingMetadata?.kind === "furniture"
      ? renderingMetadata.furnitureType
      : "non-furniture";
    throw new Error(
      `Placement rendering placement isRug must match catalog Type ${describeValue(catalogType)} for item ${describeValue(catalogItem.id)}; expected ${String(catalogIsRug)}, received ${describeValue(placementItem.isRug)}.`,
    );
  }

  const catalogBedType = renderingMetadata?.kind === "furniture"
    ? getFurnitureBedType(renderingMetadata.furnitureType)
    : null;

  if (
    renderingMetadata?.kind === "furniture"
    && renderingMetadata.bedType !== catalogBedType
  ) {
    throw new Error(
      `Placement rendering catalog item ${describeValue(catalogItem.id)} furniture Type ${describeValue(renderingMetadata.furnitureType)} requires bedType ${describeValue(catalogBedType)}; received ${describeValue(renderingMetadata.bedType)}.`,
    );
  }

  if (placementItem.bedType !== catalogBedType) {
    const catalogType = renderingMetadata?.kind === "furniture"
      ? renderingMetadata.furnitureType
      : "non-furniture";
    throw new Error(
      `Placement rendering placement bedType must match catalog Type ${describeValue(catalogType)} for item ${describeValue(catalogItem.id)}; expected ${describeValue(catalogBedType)}, received ${describeValue(placementItem.bedType)}.`,
    );
  }

  if (catalogBedType !== null) {
    getBedPlacementSemantics({
      bedType: catalogBedType,
      footprint: placementItem.footprint,
      rotation: placementItem.rotation,
    });
  }
}

function getItemRenderProperties(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  season: CatalogSeason = "spring",
): ItemRenderProperties {
  const seasonalSourceRect = getSeasonalPlaceableFrame(catalogItem, season);
  const seasonalFrame = seasonalSourceRect === null
    ? null
    : {
        x: seasonalSourceRect.x,
        y: seasonalSourceRect.y,
        width: seasonalSourceRect.width,
        height: seasonalSourceRect.height,
      };
  const defaultFrame = seasonalFrame ?? (
    catalogItem.category === "crop"
      ? getCropFullyGrownFrame(catalogItem)
      : getCatalogItemFrame(catalogItem)
  );
  const defaultRotationQuarterTurns = placementItem.layer === "item"
    ? getNormalizedQuarterTurns(placementItem.rotation)
    : 0;
  const renderingMetadata = catalogItem.renderingMetadata;
  const itemRenderProperties: ItemRenderProperties = {
    frame: defaultFrame,
    rotationQuarterTurns: defaultRotationQuarterTurns,
  };

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

  if (placementItem.flipped) {
    itemRenderProperties.isFlipped = true;
  }

  return itemRenderProperties;
}

function getCropFullyGrownFrame(catalogItem: CatalogItem): PlacementRenderFrame {
  const fullyGrownRect = getCropRenderingMetadata(catalogItem).fullyGrownRect;

  return {
    x: fullyGrownRect.x,
    y: fullyGrownRect.y,
    width: fullyGrownRect.width,
    height: fullyGrownRect.height,
  };
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
