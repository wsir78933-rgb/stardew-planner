import type {
  CatalogCropRenderingMetadata,
  CatalogItem,
  CatalogSourceRect,
} from "./catalog-types";

export function getCropRenderingMetadata(
  catalogItem: CatalogItem,
): CatalogCropRenderingMetadata {
  if (catalogItem.category !== "crop") {
    throw new TypeError(
      `Crop rendering metadata requires a crop catalog item; received ${describeValue(catalogItem.category)} for ${describeValue(catalogItem.id)}.`,
    );
  }

  const cropRenderingMetadata = catalogItem.renderingMetadata;
  if (cropRenderingMetadata?.kind !== "crop") {
    throw new Error(
      `Crop catalog item ${describeValue(catalogItem.id)} requires crop rendering metadata; received ${describeValue(cropRenderingMetadata)}.`,
    );
  }

  assertCropRenderingMetadata(catalogItem.id, cropRenderingMetadata);
  return cropRenderingMetadata;
}

export function getCropTintColorAt(
  cropRenderingMetadata: CatalogCropRenderingMetadata,
  tileX: number,
  tileY: number,
): number | undefined {
  if (cropRenderingMetadata.tintColors.length === 0) {
    return undefined;
  }

  const tintColorIndex = (
    (tileX * 7 + tileY * 11 + tileX * tileY * 31 ^ 25_214_903_917) >>> 0
  ) % cropRenderingMetadata.tintColors.length;

  return cropRenderingMetadata.tintColors[tintColorIndex];
}

export function formatCropTintColor(tintColor: number): string {
  if (!Number.isInteger(tintColor) || tintColor < 0 || tintColor > 0xff_ff_ff) {
    throw new TypeError(
      `Crop tint color must be an integer from 0 through 16777215; received ${describeValue(tintColor)}.`,
    );
  }

  return `#${tintColor.toString(16).padStart(6, "0")}`;
}

function assertCropRenderingMetadata(
  catalogItemId: string,
  cropRenderingMetadata: CatalogCropRenderingMetadata,
): void {
  assertSourceRect(
    cropRenderingMetadata.fullyGrownRect,
    "fullyGrownRect",
    catalogItemId,
  );

  if (cropRenderingMetadata.coloredRect !== undefined) {
    assertSourceRect(
      cropRenderingMetadata.coloredRect,
      "coloredRect",
      catalogItemId,
    );
  }

  if (!Array.isArray(cropRenderingMetadata.tintColors)) {
    throw new TypeError(
      `Crop catalog item ${describeValue(catalogItemId)} crop rendering metadata tintColors must be an array; received ${describeValue(cropRenderingMetadata.tintColors)}.`,
    );
  }
  if (cropRenderingMetadata.tintColors.some((tintColor) =>
    !Number.isInteger(tintColor) || tintColor < 0 || tintColor > 0xff_ff_ff
  )) {
    throw new TypeError(
      `Crop catalog item ${describeValue(catalogItemId)} crop rendering metadata tintColors must contain integers from 0 through 16777215; received ${describeValue(cropRenderingMetadata.tintColors)}.`,
    );
  }
  if (
    (cropRenderingMetadata.coloredRect === undefined)
      !== (cropRenderingMetadata.tintColors.length === 0)
  ) {
    throw new Error(
      `Crop catalog item ${describeValue(catalogItemId)} crop rendering metadata must provide coloredRect exactly when tintColors is non-empty; received ${describeValue(cropRenderingMetadata)}.`,
    );
  }
  if (typeof cropRenderingMetadata.hasForageShadow !== "boolean") {
    throw new TypeError(
      `Crop catalog item ${describeValue(catalogItemId)} crop rendering metadata hasForageShadow must be a boolean; received ${describeValue(cropRenderingMetadata.hasForageShadow)}.`,
    );
  }
}

function assertSourceRect(
  sourceRect: CatalogSourceRect,
  fieldName: string,
  catalogItemId: string,
): void {
  if (
    sourceRect?.kind !== "source-rect"
    || !Number.isInteger(sourceRect.x)
    || !Number.isInteger(sourceRect.y)
    || !Number.isInteger(sourceRect.width)
    || !Number.isInteger(sourceRect.height)
    || sourceRect.x < 0
    || sourceRect.y < 0
    || sourceRect.width <= 0
    || sourceRect.height <= 0
  ) {
    throw new TypeError(
      `Crop catalog item ${describeValue(catalogItemId)} crop rendering metadata ${fieldName} must be a non-negative source rectangle with positive dimensions; received ${describeValue(sourceRect)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
