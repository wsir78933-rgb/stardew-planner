import type { CatalogCrabPotRenderingMetadata, CatalogItem } from "./catalog-types";

export const crabPotCatalogItemId = "object:710";

export const crabPotRenderingMetadata: CatalogCrabPotRenderingMetadata = {
  kind: "crab-pot",
};

export function createCrabPotCatalogRenderingProperties(
  catalogItemId: string,
): Readonly<{ renderingMetadata?: CatalogCrabPotRenderingMetadata }> {
  if (catalogItemId !== crabPotCatalogItemId) {
    return {};
  }

  return { renderingMetadata: crabPotRenderingMetadata };
}

export function assertCrabPotCatalogItem(catalogItem: CatalogItem): void {
  if (catalogItem.id !== crabPotCatalogItemId) {
    if (catalogItem.renderingMetadata?.kind === "crab-pot") {
      throw new TypeError(
        `Crab Pot catalog renderingMetadata requires exact item ID ${JSON.stringify(crabPotCatalogItemId)}; received ${JSON.stringify(catalogItem.id)}.`,
      );
    }
    return;
  }

  if (catalogItem.category !== "placeable") {
    throw new TypeError(
      `Crab Pot catalog item ${JSON.stringify(catalogItem.id)} category must be "placeable"; received ${JSON.stringify(catalogItem.category)}.`,
    );
  }

  if (catalogItem.renderingMetadata?.kind !== "crab-pot") {
    throw new TypeError(
      `Crab Pot catalog item ${JSON.stringify(catalogItem.id)} renderingMetadata must have kind "crab-pot"; received ${describeValue(catalogItem.renderingMetadata)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  return JSON.stringify(value);
}
