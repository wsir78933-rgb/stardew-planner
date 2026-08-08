import type {
  CatalogItem,
  CatalogSeason,
  CatalogSeasonalPlaceableRenderingMetadata,
  CatalogSourceRect,
} from "./catalog-types";

type SeasonalPlaceableDefinition = Readonly<{
  composition: CatalogSeasonalPlaceableRenderingMetadata["composition"];
  seasonalFrames: Readonly<Record<CatalogSeason, CatalogSourceRect>>;
}>;

const seasons = ["spring", "summer", "fall", "winter"] as const;

const seasonalPlaceableDefinitionsById: Readonly<
  Record<string, SeasonalPlaceableDefinition>
> = {
  "object:251": {
    composition: "single-sprite",
    seasonalFrames: {
      spring: createSourceRect(32, 256, 16, 32),
      summer: createSourceRect(96, 256, 16, 32),
      fall: createSourceRect(32, 288, 16, 32),
      winter: createSourceRect(96, 288, 16, 32),
    },
  },
  grass_1: createGrassDefinition([0, 20, 40, 80]),
  grass_7: createGrassDefinition([160, 180, 200, 220]),
  "big-craftable:48": createConsecutiveCraftablesDefinition(48),
  "big-craftable:108": {
    composition: "single-sprite",
    seasonalFrames: {
      spring: createCraftablesFrame(108),
      summer: createCraftablesFrame(108),
      fall: createCraftablesFrame(109),
      winter: createCraftablesFrame(109),
    },
  },
  "big-craftable:184": createConsecutiveCraftablesDefinition(184),
  "big-craftable:188": createConsecutiveCraftablesDefinition(188),
  "big-craftable:192": createConsecutiveCraftablesDefinition(192),
  "big-craftable:196": createConsecutiveCraftablesDefinition(196),
  "big-craftable:200": createConsecutiveCraftablesDefinition(200),
  "big-craftable:204": createConsecutiveCraftablesDefinition(204),
};

export function createSeasonalPlaceableCatalogProperties(
  catalogItemId: string,
): Readonly<{
  renderingMetadata?: CatalogSeasonalPlaceableRenderingMetadata;
}> {
  const definition = seasonalPlaceableDefinitionsById[catalogItemId];
  if (definition === undefined) {
    return {};
  }

  return {
    renderingMetadata: {
      composition: definition.composition,
      kind: "seasonal-placeable",
      seasonalFrames: definition.seasonalFrames,
    },
  };
}

export function getSeasonalPlaceableFrame(
  catalogItem: CatalogItem,
  season: CatalogSeason,
): CatalogSourceRect | null {
  const lockedDefinition = seasonalPlaceableDefinitionsById[catalogItem.id];
  const renderingMetadata = catalogItem.renderingMetadata;

  if (lockedDefinition === undefined) {
    if (renderingMetadata?.kind === "seasonal-placeable") {
      throw new Error(
        `Catalog item ${JSON.stringify(catalogItem.id)} cannot use seasonal Placeable rendering metadata.`,
      );
    }
    return null;
  }
  if (renderingMetadata?.kind !== "seasonal-placeable") {
    throw new Error(
      `Seasonal Placeable ${JSON.stringify(catalogItem.id)} requires locked seasonal rendering metadata; received ${describeValue(renderingMetadata)}.`,
    );
  }
  assertSeasonalPlaceableMetadata(
    catalogItem.id,
    renderingMetadata,
    lockedDefinition,
  );

  return renderingMetadata.seasonalFrames[season];
}

function createGrassDefinition(
  seasonalFrameRows: readonly [number, number, number, number],
): SeasonalPlaceableDefinition {
  return {
    composition: "grass-clumps",
    seasonalFrames: Object.fromEntries(
      seasons.map((season, seasonIndex) => [
        season,
        createSourceRect(0, seasonalFrameRows[seasonIndex], 15, 20),
      ]),
    ) as Readonly<Record<CatalogSeason, CatalogSourceRect>>,
  };
}

function createConsecutiveCraftablesDefinition(
  baseSpriteIndex: number,
): SeasonalPlaceableDefinition {
  return {
    composition: "single-sprite",
    seasonalFrames: Object.fromEntries(
      seasons.map((season, seasonIndex) => [
        season,
        createCraftablesFrame(baseSpriteIndex + seasonIndex),
      ]),
    ) as Readonly<Record<CatalogSeason, CatalogSourceRect>>,
  };
}

function createCraftablesFrame(spriteIndex: number): CatalogSourceRect {
  return createSourceRect(
    (spriteIndex % 8) * 16,
    Math.floor(spriteIndex / 8) * 32,
    16,
    32,
  );
}

function createSourceRect(
  x: number,
  y: number,
  width: number,
  height: number,
): CatalogSourceRect {
  return { kind: "source-rect", x, y, width, height };
}

function assertSeasonalPlaceableMetadata(
  catalogItemId: string,
  renderingMetadata: CatalogSeasonalPlaceableRenderingMetadata,
  lockedDefinition: SeasonalPlaceableDefinition,
): void {
  if (renderingMetadata.composition !== lockedDefinition.composition) {
    throw new Error(
      `Seasonal Placeable ${JSON.stringify(catalogItemId)} composition must equal ${JSON.stringify(lockedDefinition.composition)}; received ${describeValue(renderingMetadata.composition)}.`,
    );
  }
  for (const season of seasons) {
    if (!hasEqualSourceRect(
      renderingMetadata.seasonalFrames[season],
      lockedDefinition.seasonalFrames[season],
    )) {
      throw new Error(
        `Seasonal Placeable ${JSON.stringify(catalogItemId)} ${season} frame must equal ${JSON.stringify(lockedDefinition.seasonalFrames[season])}; received ${describeValue(renderingMetadata.seasonalFrames[season])}.`,
      );
    }
  }
}

function hasEqualSourceRect(
  receivedFrame: CatalogSourceRect | undefined,
  expectedFrame: CatalogSourceRect,
): boolean {
  return receivedFrame?.kind === "source-rect" &&
    receivedFrame.x === expectedFrame.x &&
    receivedFrame.y === expectedFrame.y &&
    receivedFrame.width === expectedFrame.width &&
    receivedFrame.height === expectedFrame.height;
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
