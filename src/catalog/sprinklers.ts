import type { CatalogSprinklerRenderingMetadata } from "./catalog-types";

const sprinklerBaseRadiusByCatalogItemId = {
  "object:599": 0,
  "object:621": 1,
  "object:645": 2,
} as const;

export function getLockedSprinklerBaseRadius(
  catalogItemId: string,
): number | null {
  if (!Object.hasOwn(sprinklerBaseRadiusByCatalogItemId, catalogItemId)) {
    return null;
  }

  return sprinklerBaseRadiusByCatalogItemId[
    catalogItemId as keyof typeof sprinklerBaseRadiusByCatalogItemId
  ];
}

export function isSprinklerCatalogItemId(catalogItemId: string): boolean {
  return getLockedSprinklerBaseRadius(catalogItemId) !== null;
}

export function createSprinklerCatalogRenderingProperties(
  catalogItemId: string,
): Readonly<{
  renderingMetadata?: CatalogSprinklerRenderingMetadata;
}> {
  const baseRadius = getLockedSprinklerBaseRadius(catalogItemId);

  if (baseRadius === null) {
    return {};
  }

  return {
    renderingMetadata: {
      kind: "sprinkler",
      baseRadius,
    },
  };
}
