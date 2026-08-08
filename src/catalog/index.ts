export { loadCatalog, catalogDatasetUrls } from "./catalog-loader";
export {
  createCatalogCategoryLoader,
  loadBrowserCatalogDataset,
  loadCatalogCategory,
  scheduleInactiveCatalogCategoryPrefetch,
} from "./catalog-category-loader";
export type {
  CatalogCategoryLoader,
  CatalogDatasetLoader,
  CatalogDatasetName,
  CatalogPanelCategory,
  CatalogPrefetchScheduler,
} from "./catalog-category-loader";
export { loadBuildingPlacementMetadata } from "./building-placement-metadata-loader";
export { createBuildingPlacementMetadata } from "./building-placement-metadata";
export {
  getBuildingCompositionLayerFrame,
  getBuildingThumbnailCompositionLayers,
} from "./building-composition";
export {
  createBuildingCatalogFromDataset,
  createCatalogFromDatasets,
  createCropCatalogFromDatasets,
  createDecorCatalog,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
} from "./catalog-schema";
export { createFurnitureCatalogItems } from "./furniture";
export {
  formatCropTintColor,
  getCropRenderingMetadata,
  getCropTintColorAt,
} from "./crop-rendering";
export {
  giantCropCatalogItemIds,
  isGiantCropCatalogItemId,
} from "./giant-crops";
export { fishPondWaterColors } from "./fish-pond";
export {
  assertFurnitureCompositeSprite,
  createRandomFurnitureCompositeVariant,
  decodeFurnitureCompositeVariant,
} from "./furniture-composite-sprite";
export type {
  FurnitureCompositeRandomFractionSource,
} from "./furniture-composite-sprite";
export {
  assertHoeDirtRenderingMetadata,
  createHoeDirtCatalogItem,
  getFloorCatalogPlacementRequirement,
  getPathItemPlacementRequirement,
  hoeDirtCatalogItemId,
  hoeDirtRenderingMetadata,
} from "./hoe-dirt";
export {
  assertCrabPotCatalogItem,
  crabPotCatalogItemId,
  crabPotRenderingMetadata,
} from "./crab-pot";
export { getLockedLitBigCraftableRenderingMetadata } from "./lit-big-craftable-definitions";
export { getLockedPaintableChestMetadata, paintableChestPalette } from "./paintable-chests";
export {
  getLockedFurnitureFireRenderingMetadata,
  isLockedFurnitureFireCatalogItemId,
} from "./furniture-fire-definitions";
export { gateCatalogItemId, gateRenderingMetadata, isGateFenceRecordId } from "./gates";
export {
  createObjectPlacementShadowProperties,
  isLockedObjectPlacementShadowCatalogItemId,
  objectPlacementShadowMetadata,
} from "./object-placement-shadows";
export {
  createDefaultCatalogItemPresentationChoice,
  createDefaultCatalogPresentationChoice,
  getNextPendingCatalogPresentationChoice,
  getNextSelectedCatalogPresentationChoice,
  validateCatalogPresentationCapabilities,
  validateCatalogItemPresentationChoice,
  validateCatalogPresentationChoice,
} from "./catalog-presentation-capabilities";
export {
  createFruitTreeCatalogItems,
  createWildTreeCatalogItems,
} from "./trees";
export {
  isAutoVisibleResourceClumpCatalogItemId,
  isResourceClumpCatalogItemId,
} from "./resource-clumps";
export {
  createSprinklerCatalogRenderingProperties,
  getLockedSprinklerBaseRadius,
  isSprinklerCatalogItemId,
} from "./sprinklers";
export {
  createSeasonalPlaceableCatalogProperties,
  getSeasonalPlaceableFrame,
} from "./seasonal-placeables";
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
  CatalogFurnitureFireRenderingMetadata,
  CatalogPaintableChestRenderingMetadata,
  CatalogFurnitureRotationSprite,
  CatalogHoeDirtRenderingMetadata,
  CatalogBuildingLayerTint,
  CatalogBuildingPaintRegion,
  CatalogCrabPotRenderingMetadata,
  CatalogCropRenderingMetadata,
  CatalogGateRenderingMetadata,
  CatalogPlacementShadowMetadata,
  CatalogBuildingMultilayerLayer,
  CatalogBuildingMultilayerRenderingMetadata,
  CatalogLitBigCraftableFlameLayer,
  CatalogLitBigCraftableRenderingMetadata,
  CatalogSeasonalPlaceableRenderingMetadata,
  CatalogFruitTreeRenderingMetadata,
  CatalogPresentationCapabilities,
  CatalogPresentationChoice,
  CatalogPresentationVariant,
  CatalogPresentationVariantFamily,
  CatalogPresentationVariantRenderDescriptor,
  CatalogRotationPresentationCapability,
  CatalogVariantCycleCapability,
  CatalogJsonFetcher,
  CatalogJsonResponse,
  CatalogRenderingMetadata,
  CatalogSeason,
  CatalogSourceRect,
  CatalogSprite,
  CatalogSpriteIndex,
  CatalogSprinklerRenderingMetadata,
  CatalogTileSize,
  CatalogWildTreeRenderingMetadata,
} from "./catalog-types";
