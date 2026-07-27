export { loadCatalog, catalogDatasetUrls } from "./catalog-loader";
export { loadBuildingPlacementMetadata } from "./building-placement-metadata-loader";
export { createBuildingPlacementMetadata } from "./building-placement-metadata";
export { createCatalogFromDatasets } from "./catalog-schema";
export { createFurnitureCatalogItems } from "./furniture";
export {
  createFruitTreeCatalogItems,
  createWildTreeCatalogItems,
} from "./trees";
export {
  isAutoVisibleResourceClumpCatalogItemId,
  isResourceClumpCatalogItemId,
} from "./resource-clumps";
export type {
  BuildingAdditionalPlacementTile,
  BuildingCollisionMapCell,
  BuildingPlacementCoordinate,
  BuildingPlacementMetadata,
  BuildingPlacementMetadataById,
  BuildingPlacementSize,
  BuildingTileProperty,
  BuildingTilePropertyCell,
} from "./building-placement-metadata";
export type {
  Catalog,
  CatalogItem,
  CatalogItemCategory,
  CatalogItemTool,
  CatalogFurnitureCompositeSprite,
  CatalogFurnitureCompositeSpriteLayer,
  CatalogFurnitureRenderingMetadata,
  CatalogFurnitureRotationSprite,
  CatalogFruitTreeRenderingMetadata,
  CatalogJsonFetcher,
  CatalogJsonResponse,
  CatalogRenderingMetadata,
  CatalogSeason,
  CatalogSourceRect,
  CatalogSprite,
  CatalogSpriteIndex,
  CatalogTileSize,
  CatalogWildTreeRenderingMetadata,
} from "./catalog-types";
