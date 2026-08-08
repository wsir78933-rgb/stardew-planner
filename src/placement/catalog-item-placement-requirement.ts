import type { CatalogItem } from "../catalog";

export type CatalogItemPlacementRequirement = "diggable" | "passable" | "wall";

export function getCatalogItemPlacementRequirement(
  catalogItem: CatalogItem,
): CatalogItemPlacementRequirement {
  if (catalogItem.renderingMetadata?.kind === "furniture" &&
    catalogItem.renderingMetadata.wallMounted) {
    return "wall";
  }

  if (isMultiTileCropCatalogItem(catalogItem)) {
    return "diggable";
  }

  return "passable";
}

export function isMultiTileCropCatalogItem(catalogItem: CatalogItem): boolean {
  return catalogItem.category === "crop"
    && (catalogItem.tileSize.width > 1 || catalogItem.tileSize.height > 1);
}
