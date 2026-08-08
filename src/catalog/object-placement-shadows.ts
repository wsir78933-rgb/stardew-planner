import type { CatalogPlacementShadowMetadata } from "./catalog-types";

const shadowObjectRecordIds = [
  "16", "18", "20", "22", "152", "153", "283", "372", "392", "393",
  "394", "396", "397", "398", "402", "404", "406", "408", "410", "412",
  "414", "416", "463", "464", "599", "621", "645", "718", "719", "723",
] as const;

const shadowCatalogItemIds = new Set(
  shadowObjectRecordIds.map((objectRecordId) => `object:${objectRecordId}`),
);

export const objectPlacementShadowMetadata: CatalogPlacementShadowMetadata = {
  alpha: 0.5,
  textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
};

export function createObjectPlacementShadowProperties(
  catalogItemId: string,
): Readonly<{ placementShadow?: CatalogPlacementShadowMetadata }> {
  return shadowCatalogItemIds.has(catalogItemId)
    ? { placementShadow: objectPlacementShadowMetadata }
    : {};
}

export function isLockedObjectPlacementShadowCatalogItemId(
  catalogItemId: string,
): boolean {
  return shadowCatalogItemIds.has(catalogItemId);
}
