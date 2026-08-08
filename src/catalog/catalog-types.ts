export const catalogItemCategories = [
  "building",
  "crop",
  "placeable",
  "decor",
  "floor",
  "fence",
] as const;

export const catalogItemTools = [
  "cursor",
  "multi-select",
  "fill",
  "erase",
] as const;

export const catalogSeasons = ["spring", "summer", "fall", "winter"] as const;

export type CatalogItemCategory = (typeof catalogItemCategories)[number];
export type CatalogItemTool = (typeof catalogItemTools)[number];
export type CatalogSeason = (typeof catalogSeasons)[number];

export type CatalogTileSize = Readonly<{
  width: number;
  height: number;
}>;

export type CatalogNightLight = Readonly<{
  radiusInTiles: number;
  color: number;
}>;

export type CatalogSourceRect = Readonly<{
  kind: "source-rect";
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type CatalogSpriteIndex = Readonly<{
  kind: "sprite-index";
  index: number;
}>;

export type CatalogSprite = CatalogSourceRect | CatalogSpriteIndex;

export type CatalogFurnitureRotationSprite = Readonly<{
  sprite: CatalogSourceRect;
  flipped?: true;
}>;

export type CatalogFurnitureCompositeSpriteLayer = Readonly<{
  baseY: number;
  count: number;
  offsetY: number;
}>;

export type CatalogFurnitureCompositeSprite = Readonly<{
  layers: readonly CatalogFurnitureCompositeSpriteLayer[];
  pieceSize: number;
  columns: number;
}>;

export type CatalogFurnitureRenderingMetadata = Readonly<{
  kind: "furniture";
  furnitureType: string;
  indoors: boolean;
  outdoors: boolean;
  rotationSprites: readonly CatalogFurnitureRotationSprite[] | undefined;
  rotationTileSizes: readonly CatalogTileSize[] | undefined;
  wallMounted: boolean;
  isWindow?: true;
  isRug: boolean;
  isTable: boolean;
  isLongTable: boolean;
  bedType: "single" | "double" | "child" | null;
  compositeSprite: CatalogFurnitureCompositeSprite | null;
}>;

export type CatalogFurnitureFireRenderingMetadata = Readonly<{
  kind: "fireplace" | "torch";
}>;

export type CatalogPaintableChestRenderingMetadata = Readonly<{
  kind: "paintable-chest";
}>;

export type CatalogFruitTreeRenderingMetadata = Readonly<{
  kind: "fruit-tree";
  fruitSprite: CatalogSourceRect;
  fruitSeasons: readonly CatalogSeason[];
}>;

export type CatalogWildTreeRenderingMetadata = Readonly<{
  kind: "wild-tree";
  seasonalTextureLocalPaths: Readonly<Record<CatalogSeason, string>>;
  leafySeasons: Readonly<Record<CatalogSeason, boolean>>;
  hasMossVariant: boolean;
  isStumpInWinter: boolean;
}>;

export type CatalogHoeDirtRenderingMetadata = Readonly<{
  kind: "hoe-dirt";
  seasonalTextureLocalPaths: Readonly<Record<CatalogSeason, string>>;
}>;

export type CatalogCropRenderingMetadata = Readonly<{
  kind: "crop";
  fullyGrownRect: CatalogSourceRect;
  coloredRect?: CatalogSourceRect;
  tintColors: readonly number[];
  hasForageShadow: boolean;
}>;

export type CatalogSprinklerRenderingMetadata = Readonly<{
  kind: "sprinkler";
  baseRadius: number;
}>;

export type CatalogCrabPotRenderingMetadata = Readonly<{
  kind: "crab-pot";
}>;

export type CatalogPlacementShadowMetadata = Readonly<{
  alpha: number;
  textureLocalPath: string;
}>;

export type CatalogGateRenderingMetadata = Readonly<{
  kind: "gate";
  textureLocalPath: string;
}>;

export type CatalogLitBigCraftableFlameLayer = Readonly<{
  offsetX: number;
  offsetY: number;
  scale: number;
  timeOffsetMilliseconds: number;
}>;

export type CatalogLitBigCraftableRenderingMetadata = Readonly<{
  kind: "lit-big-craftable";
  flameLayers: readonly CatalogLitBigCraftableFlameLayer[];
}>;

export type CatalogSeasonalPlaceableRenderingMetadata = Readonly<{
  composition: "single-sprite" | "grass-clumps";
  kind: "seasonal-placeable";
  seasonalFrames: Readonly<Record<CatalogSeason, CatalogSourceRect>>;
}>;

export type CatalogBuildingLayerTint =
  | Readonly<{
      kind: "water-color-or-fixed";
      fixedColor: number;
    }>
  | Readonly<{
      kind: "water-color-or-season";
      seasonalColors: Readonly<Record<CatalogSeason, number>>;
    }>;

export type CatalogBuildingMultilayerLayer = Readonly<{
  frame: CatalogSourceRect;
  hideWhenPathOccupiedAt?: Readonly<{ x: number; y: number }>;
  hideWhenWaterColorDefined?: true;
  id: string;
  offsetX: number;
  offsetY: number;
  opacity?: number;
  scale?: number;
  seasonalFrames?: Readonly<Record<CatalogSeason, CatalogSourceRect>>;
  textureLocalPath?: string;
  tint?: CatalogBuildingLayerTint;
  variantFrames?: readonly (CatalogSourceRect | null)[];
  zIndexRule?: "fixed-greenhouse-shadow" | "farmhouse-mailbox";
}>;

export type CatalogBuildingPaintRegion = Readonly<{
  id: "color1" | "color2" | "color3";
  label: string;
  minimumLight: number;
  maximumLight: number;
}>;

export type CatalogBuildingMultilayerRenderingMetadata = Readonly<{
  buildingId: string;
  kind: "building-multilayer";
  layers: readonly CatalogBuildingMultilayerLayer[];
  paintMaskLocalPath?: string;
  paintRegions?: readonly CatalogBuildingPaintRegion[];
  sortTileOffset: number;
  waterColors?: readonly Readonly<{ label: string; value: number }>[];
}>;

export type CatalogRenderingMetadata =
  | CatalogBuildingMultilayerRenderingMetadata
  | CatalogFurnitureRenderingMetadata
  | CatalogFruitTreeRenderingMetadata
  | CatalogWildTreeRenderingMetadata
  | CatalogHoeDirtRenderingMetadata
  | CatalogCropRenderingMetadata
  | CatalogSprinklerRenderingMetadata
  | CatalogCrabPotRenderingMetadata
  | CatalogGateRenderingMetadata
  | CatalogLitBigCraftableRenderingMetadata
  | CatalogSeasonalPlaceableRenderingMetadata;

export type CatalogPresentationVariantFamily = "generic" | "tree";

export type CatalogPresentationVariantRenderDescriptor = Readonly<{
  kind: "variant-index";
  variant: number;
}>;

export type CatalogPresentationVariant = Readonly<{
  label: string;
  renderDescriptor: CatalogPresentationVariantRenderDescriptor;
  value: number;
}>;

export type CatalogVariantCycleCapability = Readonly<{
  count: number;
  family: CatalogPresentationVariantFamily;
}>;

export type CatalogRotationPresentationCapability = Readonly<{
  count: number;
  footprints: readonly CatalogTileSize[];
}>;

export type CatalogPresentationCapabilities = Readonly<{
  canFlip: boolean;
  rotation: CatalogRotationPresentationCapability | null;
  variantCycle: CatalogVariantCycleCapability | null;
  visibleVariants: readonly CatalogPresentationVariant[];
}>;

export type CatalogPresentationChoice = Readonly<{
  flipped: boolean;
  rotation: number;
  variant: number;
}>;

export type CatalogItem = Readonly<{
  id: string;
  name: string;
  category: CatalogItemCategory;
  interiorDecorKind?: "wallpaper" | "flooring";
  tileSize: CatalogTileSize;
  textureLocalPath: string;
  sprite: CatalogSprite;
  /**
   * Optional card-only frame. Placement keeps using `sprite`, while catalog
   * cards may need the reference's taller crop (for example craftables).
   */
  thumbnailSprite?: CatalogSprite;
  allowedTools: readonly CatalogItemTool[];
  nightLight?: CatalogNightLight;
  furnitureFire?: CatalogFurnitureFireRenderingMetadata;
  paintableChest?: CatalogPaintableChestRenderingMetadata;
  presentationCapabilities?: CatalogPresentationCapabilities;
  placementShadow?: CatalogPlacementShadowMetadata;
  renderingMetadata?: CatalogRenderingMetadata;
}>;

export type Catalog = Readonly<{
  items: readonly CatalogItem[];
}>;

export type CatalogJsonResponse = Readonly<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export type CatalogJsonFetcher = (
  requestedUrl: string,
) => Promise<CatalogJsonResponse>;
