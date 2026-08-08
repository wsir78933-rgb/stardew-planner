import type { CatalogNightLight } from "../catalog/catalog-types";

type LockedNightLightSource = Readonly<{
  catalogItemId: string;
  contextTags?: readonly string[];
  furnitureType?: string;
  isLamp?: boolean;
}>;

const explicitNightLightCatalogItemIds = new Set([
  "object:746",
  "furniture_1369",
  "furniture_1440",
]);
const furnitureFireNightLightRadiusInTilesByCatalogItemId: Readonly<
  Record<string, number>
> = {
  furniture_1792: 10,
  furniture_1794: 10,
  furniture_1796: 10,
  furniture_1798: 10,
  furniture_1800: 10,
  furniture_1866: 10,
  furniture_2331: 3,
  furniture_2397: 3,
  furniture_2398: 3,
  furniture_DesertFireplace: 10,
  furniture_JojaFireplace: 10,
  furniture_WizardFireplace: 10,
  furniture_JunimoFireplace: 10,
  furniture_RetroFireplace: 10,
};
const nightLightFurnitureTypes = new Set([
  "lamp",
  "torch",
  "sconce",
  "fireplace",
]);
const defaultNightLight = createNightLightDescriptor({
  radiusInTiles: 4,
  color: 0xffe3a0,
});

export function getLockedNightLightDescriptor(
  lockedNightLightSource: LockedNightLightSource,
): CatalogNightLight | undefined {
  assertLockedNightLightSource(lockedNightLightSource);

  if (explicitNightLightCatalogItemIds.has(lockedNightLightSource.catalogItemId)) {
    return defaultNightLight;
  }

  const furnitureFireRadiusInTiles =
    furnitureFireNightLightRadiusInTilesByCatalogItemId[
      lockedNightLightSource.catalogItemId
    ];
  if (furnitureFireRadiusInTiles !== undefined) {
    return createNightLightDescriptor({
      color: defaultNightLight.color,
      radiusInTiles: furnitureFireRadiusInTiles,
    });
  }

  if (lockedNightLightSource.contextTags?.includes("light_source")) {
    return defaultNightLight;
  }

  if (lockedNightLightSource.isLamp === true) {
    return defaultNightLight;
  }

  if (
    lockedNightLightSource.furnitureType !== undefined &&
    nightLightFurnitureTypes.has(lockedNightLightSource.furnitureType)
  ) {
    return defaultNightLight;
  }

  return undefined;
}

function createNightLightDescriptor(
  rawNightLightDescriptor: Readonly<{
    radiusInTiles: unknown;
    color: unknown;
  }>,
): CatalogNightLight {
  const { color, radiusInTiles } = rawNightLightDescriptor;

  if (
    typeof radiusInTiles !== "number" ||
    !Number.isFinite(radiusInTiles) ||
    radiusInTiles <= 0
  ) {
    throw new TypeError(
      `Night-light descriptor radiusInTiles must be a positive finite number; received ${describeValue(radiusInTiles)}.`,
    );
  }

  if (
    typeof color !== "number" ||
    !Number.isInteger(color) ||
    color < 0 ||
    color > 0xffffff
  ) {
    throw new TypeError(
      `Night-light descriptor color must be a 24-bit integer; received ${describeValue(color)}.`,
    );
  }

  return Object.freeze({ color, radiusInTiles });
}

function assertLockedNightLightSource(
  lockedNightLightSource: LockedNightLightSource,
): void {
  if (
    typeof lockedNightLightSource !== "object" ||
    lockedNightLightSource === null
  ) {
    throw new TypeError(
      `Locked night-light source must be a non-null object; received ${describeValue(lockedNightLightSource)}.`,
    );
  }

  if (
    typeof lockedNightLightSource.catalogItemId !== "string" ||
    lockedNightLightSource.catalogItemId.length === 0
  ) {
    throw new TypeError(
      `Locked night-light source catalogItemId must be a non-empty string; received ${describeValue(lockedNightLightSource.catalogItemId)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
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

  return JSON.stringify(value);
}
