import type { CatalogSourceRect } from "./catalog-types";

export type CropCatalogThumbnail = Readonly<{
  textureLocalPath: string;
  fullyGrownRect: CatalogSourceRect;
  coloredRect?: CatalogSourceRect;
  tintColor?: number;
}>;

const cropCatalogThumbnailsByItemId = new Map<string, CropCatalogThumbnail>();

export function registerCropCatalogThumbnail(
  catalogItemId: string,
  thumbnail: CropCatalogThumbnail,
): void {
  cropCatalogThumbnailsByItemId.set(catalogItemId, thumbnail);
}

export function getCropCatalogThumbnail(
  catalogItemId: string,
): CropCatalogThumbnail | undefined {
  return cropCatalogThumbnailsByItemId.get(catalogItemId);
}
