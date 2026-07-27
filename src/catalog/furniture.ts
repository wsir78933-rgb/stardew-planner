import type {
  CatalogFurnitureCompositeSprite,
  CatalogFurnitureRenderingMetadata,
  CatalogFurnitureRotationSprite,
  CatalogItem,
  CatalogSourceRect,
  CatalogTileSize,
} from "./catalog-types";
import { getLockedNightLightDescriptor } from "../night-lights/locked-night-light-definitions";

type FurnitureTextureDefinition = Readonly<{
  localPath: string;
  width: number;
  height: number;
}>;

type FurnitureRecordLocation = Readonly<{
  datasetUrl: string;
  recordId: string;
}>;

const localAssetRoot = "/game-assets/1.6.15";
const furnitureCellSize = 16;
const excludedFurnitureRecordIds = new Set(["CCFishTank"]);
const furniturePlacementTools = ["cursor", "multi-select", "erase"] as const;

const furnitureTextureDefinitionsByName: Readonly<
  Record<string, FurnitureTextureDefinition>
> = {
  furniture: {
    localPath: `${localAssetRoot}/tilesheets/furniture.png`,
    width: 512,
    height: 1488,
  },
  FreeCactuses: {
    localPath: `${localAssetRoot}/tilesheets/FreeCactuses.png`,
    width: 128,
    height: 112,
  },
  furniture_2: {
    localPath: `${localAssetRoot}/tilesheets/furniture_2.png`,
    width: 256,
    height: 512,
  },
  furniture_3: {
    localPath: `${localAssetRoot}/tilesheets/furniture_3.png`,
    width: 208,
    height: 432,
  },
  joja_furniture: {
    localPath: `${localAssetRoot}/tilesheets/joja_furniture.png`,
    width: 208,
    height: 336,
  },
  junimo_furniture: {
    localPath: `${localAssetRoot}/tilesheets/junimo_furniture.png`,
    width: 208,
    height: 432,
  },
  retro_furniture: {
    localPath: `${localAssetRoot}/tilesheets/retro_furniture.png`,
    width: 208,
    height: 265,
  },
  wizard_furniture: {
    localPath: `${localAssetRoot}/tilesheets/wizard_furniture.png`,
    width: 208,
    height: 432,
  },
};

const defaultSpriteTileSizesByFurnitureType: Readonly<
  Record<string, readonly [number, number]>
> = {
  chair: [1, 2],
  bench: [2, 2],
  couch: [3, 2],
  armchair: [2, 2],
  dresser: [2, 2],
  "long table": [5, 3],
  painting: [2, 2],
  lamp: [1, 3],
  decor: [1, 2],
  bookcase: [2, 3],
  table: [2, 3],
  rug: [3, 2],
  window: [1, 2],
  fireplace: [2, 5],
  torch: [1, 2],
  sconce: [1, 2],
  bed: [3, 5],
  "bed double": [3, 5],
  "bed child": [2, 4],
  fishtank: [3, 2],
  other: [1, 2],
  randomized_plant: [1, 2],
};

const defaultPlacementTileSizesByFurnitureType: Readonly<
  Record<string, readonly [number, number]>
> = {
  chair: [1, 1],
  bench: [2, 1],
  couch: [3, 1],
  armchair: [2, 1],
  dresser: [2, 1],
  "long table": [5, 2],
  painting: [2, 2],
  lamp: [1, 1],
  decor: [1, 1],
  bookcase: [2, 1],
  table: [2, 2],
  rug: [3, 2],
  window: [1, 2],
  fireplace: [2, 1],
  torch: [1, 1],
  sconce: [1, 2],
  other: [1, 1],
};

const furnitureTypeIndexes: Readonly<Record<string, number>> = {
  chair: 0,
  bench: 1,
  couch: 2,
  armchair: 3,
  dresser: 4,
  "long table": 5,
  painting: 6,
  lamp: 7,
  decor: 8,
  bookcase: 10,
  table: 11,
  rug: 12,
  window: 13,
  fireplace: 14,
  bed: 15,
  "bed double": 15,
  "bed child": 15,
  torch: 16,
  sconce: 17,
};

const outdoorsOnlyFurnitureRecordIds: Readonly<Record<string, boolean>> = {
  "1293": false,
};

const freeCactusCompositeSprite: CatalogFurnitureCompositeSprite = {
  layers: [
    { baseY: 96, count: 16, offsetY: 0 },
    { baseY: 48, count: 24, offsetY: -8 },
    { baseY: 0, count: 24, offsetY: -24 },
  ],
  pieceSize: 16,
  columns: 8,
};

export function createFurnitureCatalogItems(
  rawFurnitureDataset: unknown,
  datasetUrl: string,
): readonly CatalogItem[] {
  const furnitureRecordsById = assertPlainRecord(
    rawFurnitureDataset,
    createRecordLocation(datasetUrl, "<root>"),
  );
  const catalogItems: CatalogItem[] = [];

  for (const [recordId, rawFurnitureRecord] of Object.entries(
    furnitureRecordsById,
  )) {
    if (excludedFurnitureRecordIds.has(recordId)) {
      continue;
    }

    const recordLocation = createRecordLocation(datasetUrl, recordId);
    const furnitureRecordFields = readFurnitureRecordFields(
      rawFurnitureRecord,
      recordLocation,
    );
    const furnitureType = readNonEmptyField(
      furnitureRecordFields,
      1,
      "Type",
      recordLocation,
    );
    const textureDefinition = resolveFurnitureTextureDefinition(
      furnitureRecordFields,
      recordLocation,
    );
    const spriteTileSize = readFurnitureTileSize(
      furnitureRecordFields,
      2,
      defaultSpriteTileSizesByFurnitureType[furnitureType] ?? [1, 2],
      "SpriteSize",
      recordLocation,
    );
    const tileSize = readFurnitureTileSize(
      furnitureRecordFields,
      3,
      defaultPlacementTileSizesByFurnitureType[furnitureType] ?? [1, 1],
      "TileSize",
      recordLocation,
    );
    const rotationCount = readPositiveIntegerField(
      furnitureRecordFields,
      4,
      "Rotations",
      recordLocation,
    );
    const sourceSpriteIndex = readFurnitureSpriteIndex(
      recordId,
      furnitureRecordFields,
      recordLocation,
    );
    const initialSprite = createFurnitureSprite(
      sourceSpriteIndex,
      spriteTileSize,
      textureDefinition,
      recordLocation,
    );
    const sprite = recordId === "FreeCactus"
      ? { kind: "source-rect" as const, x: 0, y: 96, width: 16, height: 16 }
      : initialSprite;
    const placementPermissions = createFurniturePlacementPermissions(
      furnitureRecordFields,
      furnitureType,
      recordLocation,
    );

    catalogItems.push({
      id: `furniture_${recordId}`,
      name: readNonEmptyField(furnitureRecordFields, 0, "Name", recordLocation),
      category: "placeable",
      tileSize,
      textureLocalPath: textureDefinition.localPath,
      sprite,
      allowedTools: furniturePlacementTools,
      ...createCatalogNightLightProperties(recordId, furnitureType),
      renderingMetadata: createFurnitureRenderingMetadata({
        recordId,
        furnitureType,
        tileSize,
        initialSprite,
        rotationCount,
        placementPermissions,
      }),
    });
  }

  return catalogItems;
}

function createCatalogNightLightProperties(
  recordId: string,
  furnitureType: string,
): Readonly<{ nightLight?: import("./catalog-types").CatalogNightLight }> {
  const nightLight = getLockedNightLightDescriptor({
    catalogItemId: `furniture_${recordId}`,
    furnitureType,
  });

  return nightLight === undefined ? {} : { nightLight };
}

function createFurnitureRenderingMetadata(input: Readonly<{
  recordId: string;
  furnitureType: string;
  tileSize: CatalogTileSize;
  initialSprite: CatalogSourceRect;
  rotationCount: number;
  placementPermissions: Readonly<{ indoors: boolean; outdoors: boolean }>;
}>): CatalogFurnitureRenderingMetadata {
  return {
    kind: "furniture",
    furnitureType: input.furnitureType,
    indoors: input.placementPermissions.indoors,
    outdoors: Object.hasOwn(outdoorsOnlyFurnitureRecordIds, input.recordId)
      ? outdoorsOnlyFurnitureRecordIds[input.recordId]
      : input.placementPermissions.outdoors,
    rotationSprites: createFurnitureRotationSprites(
      input.initialSprite,
      input.rotationCount,
      input.furnitureType,
      input.tileSize,
    ),
    rotationTileSizes: createFurnitureRotationTileSizes(
      input.rotationCount,
      input.furnitureType,
      input.tileSize,
    ),
    wallMounted: ["painting", "window", "sconce"].includes(input.furnitureType),
    isRug: input.furnitureType === "rug",
    isTable: furnitureTypeIndexes[input.furnitureType] === 11,
    isLongTable: furnitureTypeIndexes[input.furnitureType] === 5,
    bedType: getFurnitureBedType(input.furnitureType),
    compositeSprite:
      input.recordId === "FreeCactus" ? freeCactusCompositeSprite : null,
  };
}

function createFurnitureRotationSprites(
  initialSprite: CatalogSourceRect,
  rotationCount: number,
  furnitureType: string,
  tileSize: CatalogTileSize,
): readonly CatalogFurnitureRotationSprite[] | undefined {
  if (rotationCount <= 1) {
    return undefined;
  }

  const furnitureTypeIndex = furnitureTypeIndexes[furnitureType] ?? 9;
  const rotationOffset = getFurnitureRotationOffset(furnitureTypeIndex);
  const rugRotationOffset = furnitureTypeIndex === 12 ? { x: 1, y: -1 } : { x: 0, y: 0 };
  const rotationSprites: CatalogFurnitureRotationSprite[] = [
    { sprite: initialSprite },
  ];

  if (tileSize.width !== tileSize.height) {
    const rotatedWidth =
      initialSprite.height - furnitureCellSize +
      rotationOffset.y * furnitureCellSize +
      rugRotationOffset.x * furnitureCellSize;
    const rotatedHeight =
      initialSprite.width +
      furnitureCellSize +
      rotationOffset.x * furnitureCellSize +
      rugRotationOffset.y * furnitureCellSize;
    const rotatedSprite = {
      kind: "source-rect" as const,
      x: initialSprite.x + initialSprite.width,
      y: initialSprite.y,
      width: rotatedWidth,
      height: rotatedHeight,
    };

    rotationSprites.push({ sprite: rotatedSprite });
    if (rotationCount >= 4) {
      rotationSprites.push({
        sprite: {
          kind: "source-rect",
          x: initialSprite.x + initialSprite.width + rotatedWidth,
          y: initialSprite.y,
          width: initialSprite.width,
          height: initialSprite.height,
        },
      });
      rotationSprites.push({ sprite: rotatedSprite, flipped: true });
    }

    return rotationSprites;
  }

  const repeatedSprite = {
    kind: "source-rect" as const,
    x: initialSprite.x + initialSprite.width,
    y: initialSprite.y,
    width: initialSprite.width,
    height: initialSprite.height,
  };
  rotationSprites.push({ sprite: repeatedSprite });

  if (rotationCount >= 4) {
    rotationSprites.push({
      sprite: {
        kind: "source-rect",
        x: initialSprite.x + initialSprite.width * 2,
        y: initialSprite.y,
        width: initialSprite.width,
        height: initialSprite.height,
      },
    });
    rotationSprites.push({ sprite: repeatedSprite, flipped: true });
  }

  return rotationSprites;
}

function createFurnitureRotationTileSizes(
  rotationCount: number,
  furnitureType: string,
  tileSize: CatalogTileSize,
): readonly CatalogTileSize[] | undefined {
  if (rotationCount <= 1 || tileSize.width === tileSize.height) {
    return undefined;
  }

  const furnitureTypeIndex = furnitureTypeIndexes[furnitureType] ?? 9;
  const rotationOffset = getFurnitureRotationOffset(furnitureTypeIndex);
  const rotatedTileSize = {
    width: tileSize.height + rotationOffset.y,
    height: tileSize.width + rotationOffset.x,
  };
  const rotationTileSizes: CatalogTileSize[] = [];

  for (let rotationIndex = 0; rotationIndex < rotationCount; rotationIndex += 1) {
    rotationTileSizes.push(
      rotationIndex === 1 || rotationIndex === 3 ? rotatedTileSize : tileSize,
    );
  }

  return rotationTileSizes;
}

function getFurnitureRotationOffset(furnitureTypeIndex: number): Readonly<{
  x: number;
  y: number;
}> {
  if (furnitureTypeIndex === 2 || furnitureTypeIndex === 3) {
    return { x: -1, y: 1 };
  }

  if (furnitureTypeIndex === 5) {
    return { x: -1, y: 0 };
  }

  return { x: 0, y: 0 };
}

function getFurnitureBedType(
  furnitureType: string,
): "single" | "double" | "child" | null {
  if (furnitureType === "bed") {
    return "single";
  }

  if (furnitureType === "bed double") {
    return "double";
  }

  if (furnitureType === "bed child") {
    return "child";
  }

  return null;
}

function createFurniturePlacementPermissions(
  furnitureRecordFields: readonly string[],
  furnitureType: string,
  recordLocation: FurnitureRecordLocation,
): Readonly<{ indoors: boolean; outdoors: boolean }> {
  const placementValue = readIntegerField(
    furnitureRecordFields,
    6,
    "Placement",
    recordLocation,
  );
  const placementIndex = placementValue >= 0
    ? placementValue
    : getDefaultFurniturePlacementIndex(furnitureType);

  return {
    indoors: placementIndex === 0 || placementIndex === 2,
    outdoors: placementIndex === 1 || placementIndex === 2,
  };
}

function getDefaultFurniturePlacementIndex(furnitureType: string): number {
  const furnitureTypeIndex = furnitureTypeIndexes[furnitureType] ?? -1;
  return [11, 5, 1, 0, 8, 16].includes(furnitureTypeIndex) ? 2 : 0;
}

function createFurnitureSprite(
  sourceSpriteIndex: number,
  spriteTileSize: CatalogTileSize,
  textureDefinition: FurnitureTextureDefinition,
  recordLocation: FurnitureRecordLocation,
): CatalogSourceRect {
  const x = (sourceSpriteIndex * furnitureCellSize) % textureDefinition.width;
  const y = Math.floor((sourceSpriteIndex * furnitureCellSize) / textureDefinition.width) *
    furnitureCellSize;
  const sprite = {
    kind: "source-rect" as const,
    x,
    y,
    width: spriteTileSize.width * furnitureCellSize,
    height: spriteTileSize.height * furnitureCellSize,
  };

  if (
    sprite.x + sprite.width > textureDefinition.width ||
    sprite.y + sprite.height > textureDefinition.height
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} source sprite index ${String(sourceSpriteIndex)} with size ${String(spriteTileSize.width)} by ${String(spriteTileSize.height)} exceeds local furniture texture ${JSON.stringify(textureDefinition.localPath)} sized ${String(textureDefinition.width)} by ${String(textureDefinition.height)}.`,
    );
  }

  return sprite;
}

function readFurnitureSpriteIndex(
  recordId: string,
  furnitureRecordFields: readonly string[],
  recordLocation: FurnitureRecordLocation,
): number {
  if (/^\d+$/.test(recordId)) {
    return readNonNegativeIntegerString(recordId, "record ID", recordLocation);
  }

  return readNonNegativeIntegerField(
    furnitureRecordFields,
    8,
    "SpriteIndex",
    recordLocation,
  );
}

function resolveFurnitureTextureDefinition(
  furnitureRecordFields: readonly string[],
  recordLocation: FurnitureRecordLocation,
): FurnitureTextureDefinition {
  const rawTexture = furnitureRecordFields[9];

  if (rawTexture === undefined || rawTexture.length === 0) {
    return furnitureTextureDefinitionsByName.furniture;
  }

  if (!rawTexture.includes("TileSheets")) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must reference TileSheets when provided; received ${describeValue(rawTexture)}.`,
    );
  }

  const textureName = rawTexture.split("\\").filter(Boolean).at(-1);

  if (textureName === undefined) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must contain a tilesheet name; received ${describeValue(rawTexture)}.`,
    );
  }

  const textureDefinition = furnitureTextureDefinitionsByName[textureName];

  if (textureDefinition === undefined) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" references unverified local furniture texture ${describeValue(rawTexture)}.`,
    );
  }

  return textureDefinition;
}

function readFurnitureTileSize(
  furnitureRecordFields: readonly string[],
  fieldIndex: number,
  defaultTileSize: readonly [number, number],
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): CatalogTileSize {
  const rawTileSize = furnitureRecordFields[fieldIndex];

  if (rawTileSize === "-1") {
    return { width: defaultTileSize[0], height: defaultTileSize[1] };
  }

  if (rawTileSize === undefined) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a two-integer tile size or "-1"; received undefined.`,
    );
  }

  const rawDimensions = rawTileSize.split(" ");

  if (rawDimensions.length !== 2) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a two-integer tile size or "-1"; received ${describeValue(rawTileSize)}.`,
    );
  }

  return {
    width: readPositiveIntegerString(
      rawDimensions[0],
      `${fieldName}.Width`,
      recordLocation,
    ),
    height: readPositiveIntegerString(
      rawDimensions[1],
      `${fieldName}.Height`,
      recordLocation,
    ),
  };
}

function readPositiveIntegerField(
  furnitureRecordFields: readonly string[],
  fieldIndex: number,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  return readPositiveIntegerString(
    furnitureRecordFields[fieldIndex],
    fieldName,
    recordLocation,
  );
}

function readNonNegativeIntegerField(
  furnitureRecordFields: readonly string[],
  fieldIndex: number,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  return readNonNegativeIntegerString(
    furnitureRecordFields[fieldIndex],
    fieldName,
    recordLocation,
  );
}

function readIntegerField(
  furnitureRecordFields: readonly string[],
  fieldIndex: number,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  const rawValue = furnitureRecordFields[fieldIndex];

  if (rawValue === undefined || !/^-?\d+$/.test(rawValue)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be an integer; received ${describeValue(rawValue)}.`,
    );
  }

  return Number.parseInt(rawValue, 10);
}

function readPositiveIntegerString(
  rawValue: string | undefined,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  const parsedValue = readIntegerString(rawValue, fieldName, recordLocation);

  if (parsedValue <= 0) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a positive integer; received ${describeValue(rawValue)}.`,
    );
  }

  return parsedValue;
}

function readNonNegativeIntegerString(
  rawValue: string | undefined,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  const parsedValue = readIntegerString(rawValue, fieldName, recordLocation);

  if (parsedValue < 0) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-negative integer; received ${describeValue(rawValue)}.`,
    );
  }

  return parsedValue;
}

function readIntegerString(
  rawValue: string | undefined,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): number {
  if (rawValue === undefined || !/^-?\d+$/.test(rawValue)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be an integer; received ${describeValue(rawValue)}.`,
    );
  }

  return Number.parseInt(rawValue, 10);
}

function readNonEmptyField(
  furnitureRecordFields: readonly string[],
  fieldIndex: number,
  fieldName: string,
  recordLocation: FurnitureRecordLocation,
): string {
  const rawValue = furnitureRecordFields[fieldIndex];

  if (rawValue === undefined || rawValue.length === 0) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readFurnitureRecordFields(
  rawFurnitureRecord: unknown,
  recordLocation: FurnitureRecordLocation,
): readonly string[] {
  if (typeof rawFurnitureRecord !== "string") {
    throw new Error(
      `${formatRecordLocation(recordLocation)} must be a legacy furniture string; received ${describeValue(rawFurnitureRecord)}.`,
    );
  }

  const furnitureRecordFields = rawFurnitureRecord.split("/");

  if (furnitureRecordFields.length < 7) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} must include at least seven slash-delimited furniture fields; received ${describeValue(rawFurnitureRecord)}.`,
    );
  }

  return furnitureRecordFields;
}

function assertPlainRecord(
  rawValue: unknown,
  recordLocation: FurnitureRecordLocation,
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

function createRecordLocation(
  datasetUrl: string,
  recordId: string,
): FurnitureRecordLocation {
  if (typeof datasetUrl !== "string" || datasetUrl.length === 0) {
    throw new TypeError(
      `Furniture catalog dataset URL must be a non-empty string; received ${describeValue(datasetUrl)}.`,
    );
  }

  return { datasetUrl, recordId };
}

function formatRecordLocation(recordLocation: FurnitureRecordLocation): string {
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
