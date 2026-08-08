import type {
  CatalogHoeDirtRenderingMetadata,
  CatalogItem,
} from "./catalog-types";

export const hoeDirtCatalogItemId = "hoedirt";

export const hoeDirtRenderingMetadata: CatalogHoeDirtRenderingMetadata = {
  kind: "hoe-dirt",
  seasonalTextureLocalPaths: {
    spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
    summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
    fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
    winter: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
  },
};

export function createHoeDirtCatalogItem(): CatalogItem {
  return {
    id: hoeDirtCatalogItemId,
    name: "Tilled Dirt",
    category: "floor",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: hoeDirtRenderingMetadata.seasonalTextureLocalPaths.spring,
    sprite: {
      kind: "source-rect",
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
    presentationCapabilities: {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 2, family: "generic" },
      visibleVariants: [
        {
          label: "Dry",
          renderDescriptor: { kind: "variant-index", variant: 0 },
          value: 0,
        },
        {
          label: "Watered",
          renderDescriptor: { kind: "variant-index", variant: 1 },
          value: 1,
        },
      ],
    },
    renderingMetadata: hoeDirtRenderingMetadata,
  };
}

export function getFloorCatalogPlacementRequirement(
  catalogItem: CatalogItem,
): "diggable" | "passable" {
  const renderingMetadata = catalogItem.renderingMetadata;

  if (catalogItem.id !== hoeDirtCatalogItemId) {
    if (renderingMetadata?.kind === "hoe-dirt") {
      throw new TypeError(
        `HoeDirt catalog renderingMetadata requires exact item ID ${JSON.stringify(hoeDirtCatalogItemId)}; received ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    return "passable";
  }

  if (catalogItem.category !== "floor") {
    throw new TypeError(
      `HoeDirt catalog item ${JSON.stringify(catalogItem.id)} category must be "floor"; received ${describeValue(catalogItem.category)}.`,
    );
  }

  if (renderingMetadata?.kind !== "hoe-dirt") {
    throw new TypeError(
      `HoeDirt catalog item ${JSON.stringify(catalogItem.id)} renderingMetadata must have kind "hoe-dirt"; received ${describeValue(renderingMetadata)}.`,
    );
  }

  assertHoeDirtRenderingMetadata(renderingMetadata, catalogItem.id);
  return "diggable";
}

export function getPathItemPlacementRequirement(
  pathItem: Readonly<{ itemId: string; layer: string }>,
): "diggable" | "passable" {
  if (pathItem.layer !== "path") {
    throw new TypeError(
      `Path placement requirement item layer must be "path"; received ${describeValue(pathItem.layer)} for item ID ${describeValue(pathItem.itemId)}.`,
    );
  }

  return pathItem.itemId === hoeDirtCatalogItemId ? "diggable" : "passable";
}

export function assertHoeDirtRenderingMetadata(
  renderingMetadata: CatalogHoeDirtRenderingMetadata,
  catalogItemId: string,
): void {
  const seasonalTextureLocalPaths = renderingMetadata.seasonalTextureLocalPaths;

  if (
    typeof seasonalTextureLocalPaths !== "object"
    || seasonalTextureLocalPaths === null
  ) {
    throw new TypeError(
      `HoeDirt catalog item ${JSON.stringify(catalogItemId)} seasonalTextureLocalPaths must be a non-null object; received ${describeValue(seasonalTextureLocalPaths)}.`,
    );
  }

  for (const season of ["spring", "summer", "fall", "winter"] as const) {
    const receivedTextureLocalPath = seasonalTextureLocalPaths[season];
    const expectedTextureLocalPath =
      hoeDirtRenderingMetadata.seasonalTextureLocalPaths[season];

    if (receivedTextureLocalPath !== expectedTextureLocalPath) {
      throw new TypeError(
        `HoeDirt catalog item ${JSON.stringify(catalogItemId)} seasonalTextureLocalPaths.${season} must be ${JSON.stringify(expectedTextureLocalPath)}; received ${describeValue(receivedTextureLocalPath)}.`,
      );
    }
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  return JSON.stringify(value);
}
