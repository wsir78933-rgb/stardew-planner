import type {
  CatalogFruitTreeRenderingMetadata,
  CatalogItem,
  CatalogPresentationCapabilities,
  CatalogSeason,
  CatalogSourceRect,
  CatalogWildTreeRenderingMetadata,
} from "./catalog-types";

type FruitTreeDefinition = Readonly<{
  name: string;
  fruitObjectId: number;
}>;

type WildTreeDefinition = Readonly<{
  id: string;
  name: string;
  seasonalTextureLocalPaths: Readonly<Record<CatalogSeason, string>>;
  leafySeasons: Readonly<Record<CatalogSeason, boolean>>;
  hasMossVariant: boolean;
  isStumpInWinter: boolean;
}>;

type TreeRecordLocation = Readonly<{
  datasetUrl: string;
  recordId: string;
}>;

const localAssetRoot = "/game-assets/1.6.15";
const treePlacementTools = ["cursor", "multi-select", "erase"] as const;
const fruitTreeTextureLocalPath = `${localAssetRoot}/tilesheets/fruitTrees.png`;
const fruitTreeTextureWidth = 432;
const fruitTreeTextureHeight = 720;
const fruitTreeSprite: CatalogSourceRect = {
  kind: "source-rect",
  x: 192,
  y: 0,
  width: 48,
  height: 64,
};

const fruitTreeDefinitionsById: Readonly<Record<string, FruitTreeDefinition>> = {
  "69": { name: "Banana Tree", fruitObjectId: 91 },
  "628": { name: "Cherry Tree", fruitObjectId: 638 },
  "629": { name: "Apricot Tree", fruitObjectId: 634 },
  "630": { name: "Orange Tree", fruitObjectId: 635 },
  "631": { name: "Peach Tree", fruitObjectId: 636 },
  "632": { name: "Pomegranate Tree", fruitObjectId: 637 },
  "633": { name: "Apple Tree", fruitObjectId: 613 },
  "835": { name: "Mango Tree", fruitObjectId: 834 },
};

const wildTreeDefinitions: readonly WildTreeDefinition[] = [
  createWildTreeDefinition("1", "Oak Tree", "tree1", {
    spring: true,
    summer: true,
    fall: true,
    winter: false,
  }, true, false),
  createWildTreeDefinition("2", "Maple Tree", "tree2", {
    spring: true,
    summer: true,
    fall: true,
    winter: false,
  }, true, false),
  createWildTreeDefinition("3", "Pine Tree", "tree3", {
    spring: true,
    summer: true,
    fall: true,
    winter: true,
  }, true, false),
  createWildTreeDefinition("6", "Palm Tree", "tree_palm", {
    spring: true,
    summer: true,
    fall: true,
    winter: true,
  }, false, false),
  createWildTreeDefinition("7", "Mushroom Tree", "mushroom_tree", {
    spring: false,
    summer: false,
    fall: false,
    winter: false,
  }, false, true),
  createWildTreeDefinition("8", "Mahogany Tree", "tree8", {
    spring: true,
    summer: true,
    fall: true,
    winter: false,
  }, false, false),
  createWildTreeDefinition("9", "Palm Tree (2)", "tree_palm2", {
    spring: true,
    summer: true,
    fall: true,
    winter: true,
  }, false, false),
  createGreenRainWildTreeDefinition("10", "Green Rain Tree (Oak)", "tree1", {
    spring: true,
    summer: true,
    fall: false,
    winter: false,
  }, true),
  createGreenRainWildTreeDefinition("11", "Green Rain Tree (Maple)", "tree2", {
    spring: true,
    summer: true,
    fall: false,
    winter: false,
  }, true),
  createGreenRainWildTreeDefinition("12", "Green Rain Tree (Mushroom)", "tree3", {
    spring: false,
    summer: false,
    fall: false,
    winter: false,
  }, false, true),
  createWildTreeDefinition("13", "Mystic Tree", "mystic_tree", {
    spring: true,
    summer: true,
    fall: true,
    winter: false,
  }, false, false),
];

export function createFruitTreeCatalogItems(
  rawFruitTreeDataset: unknown,
  datasetUrl: string,
): readonly CatalogItem[] {
  const fruitTreeRecordsById = assertPlainRecord(
    rawFruitTreeDataset,
    createTreeRecordLocation(datasetUrl, "<root>"),
  );
  const catalogItems: CatalogItem[] = [];

  for (const [recordId, fruitTreeDefinition] of Object.entries(
    fruitTreeDefinitionsById,
  )) {
    const recordLocation = createTreeRecordLocation(datasetUrl, recordId);

    if (!Object.hasOwn(fruitTreeRecordsById, recordId)) {
      throw new Error(
        `${formatRecordLocation(recordLocation)} is required by the version-locked fruit-tree catalog but is absent.`,
      );
    }

    const fruitTreeRecord = assertPlainRecord(
      fruitTreeRecordsById[recordId],
      recordLocation,
    );
    assertExactString(
      fruitTreeRecord.Texture,
      "TileSheets\\fruitTrees",
      "Texture",
      recordLocation,
    );
    const textureSpriteRow = readNonNegativeInteger(
      fruitTreeRecord.TextureSpriteRow,
      "TextureSpriteRow",
      recordLocation,
    );
    const fruitSprite = createFruitTreeFruitSprite(
      fruitTreeDefinition.fruitObjectId,
    );
    const sprite = {
      ...fruitTreeSprite,
      y: textureSpriteRow * 80,
    };
    assertFruitTreeSpriteFitsTexture(sprite, recordLocation);

    catalogItems.push({
      id: `fruittree_${recordId}`,
      name: fruitTreeDefinition.name,
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: fruitTreeTextureLocalPath,
      sprite,
      allowedTools: treePlacementTools,
      presentationCapabilities: createFruitTreePresentationCapabilities(),
      renderingMetadata: createFruitTreeRenderingMetadata(
        fruitSprite,
        readFruitTreeSeasons(fruitTreeRecord.Seasons, recordLocation),
      ),
    });
  }

  return catalogItems;
}

export function createWildTreeCatalogItems(): readonly CatalogItem[] {
  return wildTreeDefinitions.map((wildTreeDefinition) => ({
    id: `wildtree_${wildTreeDefinition.id}`,
    name: wildTreeDefinition.name,
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: wildTreeDefinition.seasonalTextureLocalPaths.spring,
    sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
    allowedTools: treePlacementTools,
    presentationCapabilities: createWildTreePresentationCapabilities(
      wildTreeDefinition.id,
    ),
    renderingMetadata: createWildTreeRenderingMetadata(wildTreeDefinition),
  }));
}

function createFruitTreePresentationCapabilities(): CatalogPresentationCapabilities {
  return {
    canFlip: true,
    rotation: null,
    variantCycle: { count: 2, family: "tree" },
    visibleVariants: [
      createVisiblePresentationVariant(0, "No Fruit"),
      createVisiblePresentationVariant(1, "Fruit"),
    ],
  };
}

function createWildTreePresentationCapabilities(
  wildTreeId: string,
): CatalogPresentationCapabilities {
  const hasVisibleMossVariants = ["1", "2", "3", "10", "11"].includes(
    wildTreeId,
  );
  return {
    canFlip: true,
    rotation: null,
    variantCycle: { count: 2, family: "tree" },
    visibleVariants: hasVisibleMossVariants
      ? [
          createVisiblePresentationVariant(0, "Normal"),
          createVisiblePresentationVariant(1, "Moss"),
        ]
      : [],
  };
}

function createVisiblePresentationVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}

function createFruitTreeRenderingMetadata(
  fruitSprite: CatalogSourceRect,
  fruitSeasons: readonly CatalogSeason[],
): CatalogFruitTreeRenderingMetadata {
  return { kind: "fruit-tree", fruitSprite, fruitSeasons };
}

function createWildTreeRenderingMetadata(
  wildTreeDefinition: WildTreeDefinition,
): CatalogWildTreeRenderingMetadata {
  return {
    kind: "wild-tree",
    seasonalTextureLocalPaths: wildTreeDefinition.seasonalTextureLocalPaths,
    leafySeasons: wildTreeDefinition.leafySeasons,
    hasMossVariant: wildTreeDefinition.hasMossVariant,
    isStumpInWinter: wildTreeDefinition.isStumpInWinter,
  };
}

function createFruitTreeFruitSprite(fruitObjectId: number): CatalogSourceRect {
  return {
    kind: "source-rect",
    x: (fruitObjectId % 24) * 16,
    y: Math.floor(fruitObjectId / 24) * 16,
    width: 16,
    height: 16,
  };
}

function assertFruitTreeSpriteFitsTexture(
  sprite: CatalogSourceRect,
  recordLocation: TreeRecordLocation,
): void {
  if (
    sprite.x + sprite.width > fruitTreeTextureWidth ||
    sprite.y + sprite.height > fruitTreeTextureHeight
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} TextureSpriteRow produces sprite ${JSON.stringify(sprite)} outside ${fruitTreeTextureLocalPath}.`,
    );
  }
}

function readFruitTreeSeasons(
  rawSeasons: unknown,
  recordLocation: TreeRecordLocation,
): readonly CatalogSeason[] {
  if (!Array.isArray(rawSeasons)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Seasons" must be an array; received ${describeValue(rawSeasons)}.`,
    );
  }

  return rawSeasons.map((rawSeason) => {
    if (typeof rawSeason !== "string") {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "Seasons" must contain strings; received ${describeValue(rawSeason)}.`,
      );
    }

    const normalizedSeason = rawSeason.toLowerCase();

    if (
      normalizedSeason !== "spring" &&
      normalizedSeason !== "summer" &&
      normalizedSeason !== "fall" &&
      normalizedSeason !== "winter"
    ) {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "Seasons" contains unsupported season ${describeValue(rawSeason)}.`,
      );
    }

    return normalizedSeason;
  });
}

function createWildTreeDefinition(
  id: string,
  name: string,
  textureName: string,
  leafySeasons: Readonly<Record<CatalogSeason, boolean>>,
  hasMossVariant: boolean,
  isStumpInWinter: boolean,
): WildTreeDefinition {
  const seasonalTextureLocalPaths = createWildTreeSeasonalTexturePaths(
    textureName,
  );

  return {
    id,
    name,
    seasonalTextureLocalPaths,
    leafySeasons,
    hasMossVariant,
    isStumpInWinter,
  };
}

function createWildTreeSeasonalTexturePaths(
  textureName: string,
): Readonly<Record<CatalogSeason, string>> {
  if (textureName === "tree1" || textureName === "tree2" || textureName === "tree8") {
    return {
      spring: `${localAssetRoot}/terrain/${textureName}_spring.png`,
      summer: `${localAssetRoot}/terrain/${textureName}_summer.png`,
      fall: `${localAssetRoot}/terrain/${textureName}_fall.png`,
      winter: `${localAssetRoot}/terrain/${textureName}_winter.png`,
    };
  }

  if (textureName === "tree3") {
    return {
      spring: `${localAssetRoot}/terrain/tree3_spring.png`,
      summer: `${localAssetRoot}/terrain/tree3_spring.png`,
      fall: `${localAssetRoot}/terrain/tree3_fall.png`,
      winter: `${localAssetRoot}/terrain/tree3_winter.png`,
    };
  }

  const textureLocalPath = `${localAssetRoot}/terrain/${textureName}.png`;

  return {
    spring: textureLocalPath,
    summer: textureLocalPath,
    fall: textureLocalPath,
    winter: textureLocalPath,
  };
}

function createGreenRainWildTreeDefinition(
  id: string,
  name: string,
  textureName: "tree1" | "tree2" | "tree3",
  leafySeasons: Readonly<Record<CatalogSeason, boolean>>,
  hasMossVariant: boolean,
  isStumpInWinter = false,
): WildTreeDefinition {
  return {
    id,
    name,
    seasonalTextureLocalPaths: {
      spring: `${localAssetRoot}/terrain/${textureName}_greenRain.png`,
      summer: `${localAssetRoot}/terrain/${textureName}_greenRain.png`,
      fall: `${localAssetRoot}/terrain/${textureName}_greenRain_fall.png`,
      winter: `${localAssetRoot}/terrain/${textureName}_greenRain_winter.png`,
    },
    leafySeasons,
    hasMossVariant,
    isStumpInWinter,
  };
}

function assertExactString(
  rawValue: unknown,
  expectedValue: string,
  fieldName: string,
  recordLocation: TreeRecordLocation,
): void {
  if (rawValue !== expectedValue) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must equal ${describeValue(expectedValue)}; received ${describeValue(rawValue)}.`,
    );
  }
}

function readNonNegativeInteger(
  rawValue: unknown,
  fieldName: string,
  recordLocation: TreeRecordLocation,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isInteger(rawValue) ||
    rawValue < 0
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-negative integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertPlainRecord(
  rawValue: unknown,
  recordLocation: TreeRecordLocation,
): Readonly<Record<string, unknown>> {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} must be a plain JSON object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue as Readonly<Record<string, unknown>>;
}

function createTreeRecordLocation(
  datasetUrl: string,
  recordId: string,
): TreeRecordLocation {
  if (typeof datasetUrl !== "string" || datasetUrl.length === 0) {
    throw new TypeError(
      `Tree catalog dataset URL must be a non-empty string; received ${describeValue(datasetUrl)}.`,
    );
  }

  return { datasetUrl, recordId };
}

function formatRecordLocation(recordLocation: TreeRecordLocation): string {
  return `${recordLocation.datasetUrl} record ${JSON.stringify(recordLocation.recordId)}`;
}

function describeValue(rawValue: unknown): string {
  if (rawValue === undefined) {
    return "undefined";
  }

  if (rawValue === null) {
    return "null";
  }

  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return String(rawValue);
}
