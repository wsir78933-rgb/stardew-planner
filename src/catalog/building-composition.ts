import { getLockedBuildingPaintDefinition } from "../paint/building-paint";
import { createFishPondCatalogProperties } from "./fish-pond";
import type {
  CatalogBuildingMultilayerLayer,
  CatalogBuildingMultilayerRenderingMetadata,
  CatalogItem,
  CatalogPresentationCapabilities,
  CatalogSeason,
  CatalogSourceRect,
  CatalogTileSize,
} from "./catalog-types";

export type FrozenBuildingCompositionSource = Readonly<{
  buildingId: string;
  drawOffset: Readonly<{ x: number; y: number }>;
  drawShadow: boolean;
  isRawBuildingRecord: boolean;
  sourceDrawLayers: readonly CatalogBuildingMultilayerLayer[];
  sourceRect: CatalogSourceRect;
  sortTileOffset: number;
  textureLocalPath: string;
  tileSize: CatalogTileSize;
}>;

export type FrozenBuildingCompositionCatalogProperties = Readonly<{
  presentationCapabilities?: CatalogPresentationCapabilities;
  renderingMetadata: CatalogBuildingMultilayerRenderingMetadata;
  sprite: CatalogSourceRect;
}>;

export type BuildingThumbnailCompositionLayer = Readonly<{
  frame: CatalogSourceRect;
  layer: CatalogBuildingMultilayerLayer;
}>;

const renderingTileSize = 16;
const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const mailboxTextureLocalPath = "/game-assets/1.6.15/buildings/Mailbox.png";
const springOutdoorsTextureLocalPath =
  "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png";

const fullBuildingTextureHeightByFilename: Readonly<Record<string, number>> = {
  "Big Shed.png": 128,
  "Desert Obelisk.png": 128,
  "Earth Obelisk.png": 128,
  "Gold Clock.png": 80,
  "Island Obelisk.png": 128,
  "Shed.png": 128,
  "Shipping Bin.png": 32,
  "Silo.png": 128,
  "Stable.png": 96,
  "Water Obelisk.png": 128,
  "Well.png": 80,
} as const;

const thumbnailExcludedLayerNameFragments = [
  "Shadow",
  "Entrance",
  "WaterTile",
  "Bubbles",
] as const;

export function createFrozenBuildingCompositionCatalogProperties(
  source: FrozenBuildingCompositionSource,
): FrozenBuildingCompositionCatalogProperties {
  assertFrozenBuildingCompositionSource(source);

  const fishPondProperties = createFishPondCatalogProperties(
    source.buildingId,
    source.textureLocalPath,
  );
  if (
    fishPondProperties.renderingMetadata !== undefined &&
    fishPondProperties.sprite !== undefined
  ) {
    return {
      ...(fishPondProperties.presentationCapabilities === undefined
        ? {}
        : { presentationCapabilities: fishPondProperties.presentationCapabilities }),
      renderingMetadata: fishPondProperties.renderingMetadata,
      sprite: fishPondProperties.sprite,
    };
  }

  const sourceRect = source.buildingId === "Junimo Hut"
    ? createSourceRect(0, 0, 48, 64)
    : source.sourceRect;
  const baseTextureHeight = getBaseTextureHeight(source, sourceRect);
  const baseOffset = {
    x: source.drawOffset.x,
    y: source.tileSize.height * renderingTileSize - baseTextureHeight + source.drawOffset.y,
  };
  const behindLayers = [
    ...createGreenhouseShadowLayer(source, baseOffset),
    ...createBuildingShadowLayers(source),
  ];
  const baseLayer: CatalogBuildingMultilayerLayer = {
    frame: sourceRect,
    id: "Base",
    offsetX: baseOffset.x,
    offsetY: baseOffset.y,
    ...(source.buildingId === "Junimo Hut"
      ? { seasonalFrames: createJunimoHutSeasonalFrames() }
      : {}),
  };
  const frontLayers = [
    ...source.sourceDrawLayers.map((layer) => ({
      ...layer,
      offsetX: baseOffset.x + layer.offsetX,
      offsetY: baseOffset.y + layer.offsetY,
    })),
    ...createShippingBinLidLayer(source, baseOffset),
    ...createGreenhouseEntranceLayers(source, baseOffset),
    ...createFarmhouseMailboxLayer(source, baseOffset, sourceRect.height),
  ];
  const paintDefinition = getLockedBuildingPaintDefinition(source.buildingId);

  return {
    renderingMetadata: {
      buildingId: source.buildingId,
      kind: "building-multilayer",
      layers: [...behindLayers, baseLayer, ...frontLayers],
      ...(paintDefinition === null
        ? {}
        : {
            paintMaskLocalPath: paintDefinition.paintMaskLocalPath,
            paintRegions: paintDefinition.channels,
          }),
      sortTileOffset: source.sortTileOffset,
    },
    sprite: sourceRect,
  };
}

export function getBuildingThumbnailCompositionLayers(
  catalogItem: CatalogItem,
  season: CatalogSeason,
  variant: number,
): readonly BuildingThumbnailCompositionLayer[] {
  if (catalogItem.category !== "building") {
    throw new TypeError(
      `Building thumbnail composition requires a building catalog item; received ${JSON.stringify(catalogItem.id)} with category ${JSON.stringify(catalogItem.category)}.`,
    );
  }
  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "building-multilayer") {
    throw new Error(
      `Building thumbnail ${JSON.stringify(catalogItem.id)} requires frozen building composition metadata.`,
    );
  }

  return renderingMetadata.layers.flatMap((layer) => {
    if (thumbnailExcludedLayerNameFragments.some((fragment) =>
      layer.id.includes(fragment)
    )) {
      return [];
    }
    const frame = getBuildingCompositionLayerFrame(layer, season, variant);
    return frame === null ? [] : [{ frame, layer }];
  });
}

export function getBuildingCompositionLayerFrame(
  layer: CatalogBuildingMultilayerLayer,
  season: CatalogSeason,
  variant: number,
): CatalogSourceRect | null {
  if (layer.variantFrames !== undefined) {
    const normalizedVariant = normalizeVariant(variant, layer.variantFrames.length);
    return layer.variantFrames[normalizedVariant] ?? null;
  }
  return layer.seasonalFrames?.[season] ?? layer.frame;
}

function createBuildingShadowLayers(
  source: FrozenBuildingCompositionSource,
): readonly CatalogBuildingMultilayerLayer[] {
  if (!source.isRawBuildingRecord || !source.drawShadow) {
    return [];
  }

  return Array.from({ length: source.tileSize.width }, (_, columnIndex) => ({
    frame: createSourceRect(
      columnIndex === 0
        ? 656
        : columnIndex === source.tileSize.width - 1
          ? 688
          : 672,
      394,
      16,
      16,
    ),
    id: columnIndex === 0
      ? "Shadow_left"
      : columnIndex === source.tileSize.width - 1
        ? "Shadow_right"
        : `Shadow_mid_${String(columnIndex)}`,
    offsetX: columnIndex * renderingTileSize,
    offsetY: source.tileSize.height * renderingTileSize,
    textureLocalPath: cursorTextureLocalPath,
  }));
}

function createGreenhouseShadowLayer(
  source: FrozenBuildingCompositionSource,
  baseOffset: Readonly<{ x: number; y: number }>,
): readonly CatalogBuildingMultilayerLayer[] {
  if (source.buildingId !== "Greenhouse") {
    return [];
  }

  return [{
    frame: createSourceRect(112, 144, 128, 144),
    id: "GreenhouseShadow",
    offsetX: baseOffset.x - 16,
    offsetY: baseOffset.y + 64,
    zIndexRule: "fixed-greenhouse-shadow",
  }];
}

function createShippingBinLidLayer(
  source: FrozenBuildingCompositionSource,
  baseOffset: Readonly<{ x: number; y: number }>,
): readonly CatalogBuildingMultilayerLayer[] {
  if (source.buildingId !== "Shipping Bin") {
    return [];
  }

  return [{
    frame: createSourceRect(134, 226, 30, 25),
    id: "ShippingBinLid",
    offsetX: baseOffset.x + 1,
    offsetY: baseOffset.y - 7,
    textureLocalPath: cursorTextureLocalPath,
  }];
}

function createGreenhouseEntranceLayers(
  source: FrozenBuildingCompositionSource,
  baseOffset: Readonly<{ x: number; y: number }>,
): readonly CatalogBuildingMultilayerLayer[] {
  if (source.buildingId !== "Greenhouse") {
    return [];
  }

  return [0, 1].flatMap((rowIndex) =>
    Array.from({ length: 3 }, (_, columnIndex) => ({
      frame: createSourceRect(
        rowIndex === 0 ? 192 : 208,
        rowIndex === 0 ? 512 : 528,
        16,
        16,
      ),
      hideWhenPathOccupiedAt: {
        x: 2 + columnIndex,
        y: 6 + rowIndex,
      },
      id: `GreenhouseEntrance_${rowIndex === 0 ? "top" : "bottom"}_${String(columnIndex)}`,
      offsetX: baseOffset.x + 32 + columnIndex * renderingTileSize,
      offsetY: baseOffset.y + 160 + rowIndex * renderingTileSize,
      textureLocalPath: springOutdoorsTextureLocalPath,
    })),
  );
}

function createFarmhouseMailboxLayer(
  source: FrozenBuildingCompositionSource,
  baseOffset: Readonly<{ x: number; y: number }>,
  sourceHeight: number,
): readonly CatalogBuildingMultilayerLayer[] {
  if (!source.buildingId.startsWith("Farmhouse")) {
    return [];
  }
  const drawPositionX = 144 - source.drawOffset.x + 2;
  const drawPositionY =
    64 - (
      source.tileSize.height * renderingTileSize - sourceHeight + source.drawOffset.y
    ) - 16;

  return [{
    frame: createSourceRect(0, 0, 16, 32),
    id: "Mailbox",
    offsetX: baseOffset.x + drawPositionX,
    offsetY: baseOffset.y + drawPositionY,
    textureLocalPath: mailboxTextureLocalPath,
    zIndexRule: "farmhouse-mailbox",
  }];
}

function createJunimoHutSeasonalFrames(): Readonly<Record<CatalogSeason, CatalogSourceRect>> {
  return {
    spring: createSourceRect(0, 0, 48, 64),
    summer: createSourceRect(48, 0, 48, 64),
    fall: createSourceRect(96, 0, 48, 64),
    winter: createSourceRect(144, 0, 48, 64),
  };
}

function getBaseTextureHeight(
  source: FrozenBuildingCompositionSource,
  sourceRect: CatalogSourceRect,
): number {
  if (sourceRect.height > 0) {
    return sourceRect.height;
  }
  const textureFilename = source.textureLocalPath.split("/").pop();
  const textureHeight = textureFilename === undefined
    ? undefined
    : fullBuildingTextureHeightByFilename[textureFilename];
  if (textureHeight === undefined) {
    throw new Error(
      `Frozen building composition ${JSON.stringify(source.buildingId)} has a full-texture source rectangle but no locked texture height for ${JSON.stringify(source.textureLocalPath)}.`,
    );
  }
  return textureHeight;
}

function assertFrozenBuildingCompositionSource(
  source: FrozenBuildingCompositionSource,
): void {
  if (typeof source.buildingId !== "string" || source.buildingId.length === 0) {
    throw new TypeError(
      `Frozen building composition buildingId must be a non-empty string; received ${describeValue(source.buildingId)}.`,
    );
  }
  if (!Number.isFinite(source.sortTileOffset)) {
    throw new TypeError(
      `Frozen building composition ${JSON.stringify(source.buildingId)} sortTileOffset must be finite; received ${describeValue(source.sortTileOffset)}.`,
    );
  }
  if (typeof source.drawShadow !== "boolean") {
    throw new TypeError(
      `Frozen building composition ${JSON.stringify(source.buildingId)} drawShadow must be boolean; received ${describeValue(source.drawShadow)}.`,
    );
  }
}

function normalizeVariant(variant: number, variantCount: number): number {
  return ((variant % variantCount) + variantCount) % variantCount;
}

function createSourceRect(
  x: number,
  y: number,
  width: number,
  height: number,
): CatalogSourceRect {
  return { kind: "source-rect", x, y, width, height };
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
