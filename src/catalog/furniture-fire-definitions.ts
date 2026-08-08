import type { CatalogFurnitureFireRenderingMetadata } from "./catalog-types";

const fireplaceRenderingMetadata: CatalogFurnitureFireRenderingMetadata = {
  kind: "fireplace",
};
const torchRenderingMetadata: CatalogFurnitureFireRenderingMetadata = {
  kind: "torch",
};

const fireplaceRecordIds = new Set([
  "1792", "1794", "1796", "1798", "1800", "1866", "DesertFireplace",
  "JojaFireplace", "WizardFireplace", "JunimoFireplace", "RetroFireplace",
]);
const torchRecordIds = new Set(["2331", "2397", "2398"]);

export function getLockedFurnitureFireRenderingMetadata(
  recordId: string,
): CatalogFurnitureFireRenderingMetadata | undefined {
  if (fireplaceRecordIds.has(recordId)) {
    return fireplaceRenderingMetadata;
  }

  if (torchRecordIds.has(recordId)) {
    return torchRenderingMetadata;
  }

  return undefined;
}

export function isLockedFurnitureFireCatalogItemId(catalogItemId: string): boolean {
  const recordId = getFurnitureRecordId(catalogItemId);

  return recordId !== null && getLockedFurnitureFireRenderingMetadata(recordId) !== undefined;
}

function getFurnitureRecordId(catalogItemId: string): string | null {
  const prefix = "furniture_";

  return catalogItemId.startsWith(prefix)
    ? catalogItemId.slice(prefix.length)
    : null;
}
