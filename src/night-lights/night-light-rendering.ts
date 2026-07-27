import type { CatalogItem, CatalogNightLight } from "../catalog/catalog-types";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";

export type NightLightRenderDescriptor = Readonly<{
  centerX: number;
  centerY: number;
  color: number;
  radiusInPixels: number;
}>;

export type CreateNightLightRenderDescriptorsInput = Readonly<{
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[];
  isNightMode: boolean;
  placementSnapshot: PlacementSnapshot;
  tileHeight: number;
  tileWidth: number;
}>;

export function createNightLightRenderDescriptors(
  createNightLightRenderDescriptorsInput: CreateNightLightRenderDescriptorsInput,
): readonly NightLightRenderDescriptor[] {
  assertCreateNightLightRenderDescriptorsInput(
    createNightLightRenderDescriptorsInput,
  );
  const catalogNightLightsByItemId = createCatalogNightLightsByItemId(
    createNightLightRenderDescriptorsInput.catalogItems,
  );
  const placementSnapshot = createPersistentPlacementSnapshot(
    createNightLightRenderDescriptorsInput.placementSnapshot,
  );

  if (!createNightLightRenderDescriptorsInput.isNightMode) {
    return [];
  }

  return placementSnapshot.items.flatMap((placementItem) => {
    if (placementItem.nightLightState === "off") {
      return [];
    }

    const nightLight = catalogNightLightsByItemId.get(placementItem.itemId);

    if (nightLight === undefined) {
      return [];
    }

    return [
      createNightLightRenderDescriptor(
        placementItem,
        nightLight,
        createNightLightRenderDescriptorsInput.tileWidth,
        createNightLightRenderDescriptorsInput.tileHeight,
      ),
    ];
  });
}

function assertCreateNightLightRenderDescriptorsInput(
  createNightLightRenderDescriptorsInput: CreateNightLightRenderDescriptorsInput,
): void {
  if (
    typeof createNightLightRenderDescriptorsInput !== "object" ||
    createNightLightRenderDescriptorsInput === null
  ) {
    throw new TypeError(
      `Night-light rendering input must be a non-null object; received ${describeValue(createNightLightRenderDescriptorsInput)}.`,
    );
  }

  if (typeof createNightLightRenderDescriptorsInput.isNightMode !== "boolean") {
    throw new TypeError(
      `Night-light rendering isNightMode must be a boolean; received ${describeValue(createNightLightRenderDescriptorsInput.isNightMode)}.`,
    );
  }

  assertPositiveFiniteTileDimension(
    createNightLightRenderDescriptorsInput.tileWidth,
    "tileWidth",
  );
  assertPositiveFiniteTileDimension(
    createNightLightRenderDescriptorsInput.tileHeight,
    "tileHeight",
  );
}

function createCatalogNightLightsByItemId(
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[],
): ReadonlyMap<string, CatalogNightLight> {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Night-light catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }

  const catalogNightLightsByItemId = new Map<string, CatalogNightLight>();
  const catalogItemIds = new Set<string>();

  for (const catalogItem of catalogItems) {
    assertCatalogItem(catalogItem);

    if (catalogItemIds.has(catalogItem.id)) {
      throw new Error(
        `Night-light catalog items must not contain duplicate id ${describeValue(catalogItem.id)}.`,
      );
    }

    catalogItemIds.add(catalogItem.id);

    if (catalogItem.nightLight === undefined) {
      continue;
    }

    assertCatalogNightLight(catalogItem.id, catalogItem.nightLight);
    catalogNightLightsByItemId.set(catalogItem.id, catalogItem.nightLight);
  }

  return catalogNightLightsByItemId;
}

function assertCatalogItem(
  catalogItem: Pick<CatalogItem, "id" | "nightLight">,
): void {
  if (typeof catalogItem !== "object" || catalogItem === null) {
    throw new TypeError(
      `Night-light catalog item must be a non-null object; received ${describeValue(catalogItem)}.`,
    );
  }

  if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
    throw new TypeError(
      `Night-light catalog item id must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
    );
  }
}

function assertCatalogNightLight(
  catalogItemId: string,
  nightLight: CatalogNightLight,
): void {
  if (typeof nightLight !== "object" || nightLight === null) {
    throw new TypeError(
      `Night-light catalog item ${describeValue(catalogItemId)} nightLight must be a non-null object; received ${describeValue(nightLight)}.`,
    );
  }

  if (
    typeof nightLight.radiusInTiles !== "number" ||
    !Number.isFinite(nightLight.radiusInTiles) ||
    nightLight.radiusInTiles <= 0
  ) {
    throw new TypeError(
      `Night-light catalog item ${describeValue(catalogItemId)} radiusInTiles must be a positive finite number; received ${describeValue(nightLight.radiusInTiles)}.`,
    );
  }

  if (
    typeof nightLight.color !== "number" ||
    !Number.isInteger(nightLight.color) ||
    nightLight.color < 0 ||
    nightLight.color > 0xffffff
  ) {
    throw new TypeError(
      `Night-light catalog item ${describeValue(catalogItemId)} color must be a 24-bit integer; received ${describeValue(nightLight.color)}.`,
    );
  }
}

function createNightLightRenderDescriptor(
  placementItem: PlacementSnapshot["items"][number],
  nightLight: CatalogNightLight,
  tileWidth: number,
  tileHeight: number,
): NightLightRenderDescriptor {
  return {
    centerX:
      (placementItem.x + placementItem.footprint.width / 2) * tileWidth,
    centerY:
      (placementItem.y + placementItem.footprint.height / 2) * tileHeight,
    color: nightLight.color,
    radiusInPixels: nightLight.radiusInTiles * Math.max(tileWidth, tileHeight),
  };
}

function assertPositiveFiniteTileDimension(
  tileDimension: unknown,
  fieldName: string,
): void {
  if (
    typeof tileDimension !== "number" ||
    !Number.isFinite(tileDimension) ||
    tileDimension <= 0
  ) {
    throw new TypeError(
      `Night-light rendering ${fieldName} must be a positive finite number; received ${describeValue(tileDimension)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "number" && Number.isNaN(value)) {
    return "NaN";
  }

  if (value === Infinity) {
    return "Infinity";
  }

  if (value === -Infinity) {
    return "-Infinity";
  }

  return String(value);
}
