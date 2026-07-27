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
  isRug: boolean;
  isTable: boolean;
  isLongTable: boolean;
  bedType: "single" | "double" | "child" | null;
  compositeSprite: CatalogFurnitureCompositeSprite | null;
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

export type CatalogRenderingMetadata =
  | CatalogFurnitureRenderingMetadata
  | CatalogFruitTreeRenderingMetadata
  | CatalogWildTreeRenderingMetadata;

export type CatalogItem = Readonly<{
  id: string;
  name: string;
  category: CatalogItemCategory;
  tileSize: CatalogTileSize;
  textureLocalPath: string;
  sprite: CatalogSprite;
  allowedTools: readonly CatalogItemTool[];
  nightLight?: CatalogNightLight;
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
