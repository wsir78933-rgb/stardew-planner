import type {
  Catalog,
  CatalogItem,
  CatalogItemTool,
  CatalogSourceRect,
} from "./catalog-types";
import { createFurnitureCatalogItems } from "./furniture";
import { getLockedNightLightDescriptor } from "../night-lights/locked-night-light-definitions";
import { createResourceClumpCatalogItems } from "./resource-clumps";
import {
  createFruitTreeCatalogItems,
  createWildTreeCatalogItems,
} from "./trees";

export type CatalogDatasetUrls = Readonly<{
  buildings: string;
  crops: string;
  bigCraftables: string;
  objects: string;
  fences: string;
  floorsAndPaths: string;
  furniture: string;
  fruitTrees: string;
}>;

export type RawCatalogDatasets = Readonly<{
  buildings: unknown;
  crops: unknown;
  bigCraftables: unknown;
  objects: unknown;
  fences: unknown;
  floorsAndPaths: unknown;
  furniture: unknown;
  fruitTrees: unknown;
}>;

type RecordById = Readonly<Record<string, unknown>>;

type RecordLocation = Readonly<{
  datasetUrl: string;
  recordId: string;
}>;

const localAssetRoot = "/game-assets/1.6.15";

const expectedRecordCountByDataset = {
  buildings: 25,
  crops: 50,
  bigCraftables: 182,
  objects: 807,
  fences: 5,
  floorsAndPaths: 13,
  furniture: 645,
  fruitTrees: 8,
} as const;

const verifiedBuildingTextureNames = new Set([
  "Barn",
  "Beach Cabin",
  "Big Barn",
  "Big Coop",
  "Big Shed",
  "Coop",
  "Deluxe Barn",
  "Deluxe Coop",
  "Desert Obelisk",
  "Earth Obelisk",
  "Fish Pond",
  "Gold Clock",
  "Greenhouse",
  "Island Obelisk",
  "Junimo Hut",
  "Mill",
  "Pet Bowl",
  "Shed",
  "Shipping Bin",
  "Silo",
  "Slime Hutch",
  "Stable",
  "Stone Cabin",
  "Water Obelisk",
  "Well",
  "houses",
]);

const verifiedFenceTextureNames = new Set([
  "Fence1",
  "Fence2",
  "Fence3",
  "Fence5",
]);

const placementTools = ["cursor", "multi-select", "erase"] as const;
const fillablePlacementTools = [
  "cursor",
  "multi-select",
  "fill",
  "erase",
] as const;

export function createCatalogFromDatasets(
  rawCatalogDatasets: RawCatalogDatasets,
  catalogDatasetUrls: CatalogDatasetUrls,
): Catalog {
  const buildingsById = assertDatasetRecordCount(
    rawCatalogDatasets.buildings,
    catalogDatasetUrls.buildings,
    expectedRecordCountByDataset.buildings,
  );
  const cropsById = assertDatasetRecordCount(
    rawCatalogDatasets.crops,
    catalogDatasetUrls.crops,
    expectedRecordCountByDataset.crops,
  );
  const bigCraftablesById = assertDatasetRecordCount(
    rawCatalogDatasets.bigCraftables,
    catalogDatasetUrls.bigCraftables,
    expectedRecordCountByDataset.bigCraftables,
  );
  const objectsById = assertDatasetRecordCount(
    rawCatalogDatasets.objects,
    catalogDatasetUrls.objects,
    expectedRecordCountByDataset.objects,
  );
  const fencesById = assertDatasetRecordCount(
    rawCatalogDatasets.fences,
    catalogDatasetUrls.fences,
    expectedRecordCountByDataset.fences,
  );
  const floorsById = assertDatasetRecordCount(
    rawCatalogDatasets.floorsAndPaths,
    catalogDatasetUrls.floorsAndPaths,
    expectedRecordCountByDataset.floorsAndPaths,
  );
  const furnitureById = assertDatasetRecordCount(
    rawCatalogDatasets.furniture,
    catalogDatasetUrls.furniture,
    expectedRecordCountByDataset.furniture,
  );
  const fruitTreesById = assertDatasetRecordCount(
    rawCatalogDatasets.fruitTrees,
    catalogDatasetUrls.fruitTrees,
    expectedRecordCountByDataset.fruitTrees,
  );

  const catalogItems = [
    ...createBuildingCatalogItems(buildingsById, catalogDatasetUrls.buildings),
    ...createCropCatalogItems(
      cropsById,
      objectsById,
      catalogDatasetUrls.crops,
      catalogDatasetUrls.objects,
    ),
    ...createBigCraftableCatalogItems(
      bigCraftablesById,
      catalogDatasetUrls.bigCraftables,
    ),
    ...createObjectCatalogItems(objectsById, catalogDatasetUrls.objects),
    ...createFloorCatalogItems(
      floorsById,
      objectsById,
      catalogDatasetUrls.floorsAndPaths,
      catalogDatasetUrls.objects,
    ),
    ...createFenceCatalogItems(
      fencesById,
      objectsById,
      catalogDatasetUrls.fences,
      catalogDatasetUrls.objects,
    ),
    ...createFurnitureCatalogItems(
      furnitureById,
      catalogDatasetUrls.furniture,
    ),
    ...createFruitTreeCatalogItems(
      fruitTreesById,
      catalogDatasetUrls.fruitTrees,
    ),
    ...createWildTreeCatalogItems(),
    ...createResourceClumpCatalogItems(),
  ];

  return { items: catalogItems };
}

function createBuildingCatalogItems(
  buildingsById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(buildingsById).map(([recordId, rawBuildingRecord]) => {
    const recordLocation = { datasetUrl, recordId };
    const buildingRecord = assertPlainJsonRecord(rawBuildingRecord, recordLocation);
    const textureLocalPath = resolveBuildingTextureLocalPath(
      buildingRecord.Texture,
      recordLocation,
    );

    return {
      id: `building:${recordId}`,
      name: recordId,
      category: "building",
      tileSize: {
        width: readPositiveInteger(buildingRecord.Size, "X", recordLocation),
        height: readPositiveInteger(buildingRecord.Size, "Y", recordLocation),
      },
      textureLocalPath,
      sprite: readSourceRect(buildingRecord.SourceRect, recordLocation),
      allowedTools: placementTools,
    };
  });
}

function createCropCatalogItems(
  cropsById: RecordById,
  objectsById: RecordById,
  cropDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(cropsById).map(([recordId, rawCropRecord]) => {
    const recordLocation = { datasetUrl: cropDatasetUrl, recordId };
    const cropRecord = assertPlainJsonRecord(rawCropRecord, recordLocation);
    assertExactString(
      cropRecord.Texture,
      "TileSheets\\crops",
      "Texture",
      recordLocation,
    );
    const harvestItemId = readNonEmptyString(
      cropRecord.HarvestItemId,
      "HarvestItemId",
      recordLocation,
    );
    const name = readReferencedObjectName(
      objectsById,
      harvestItemId,
      "HarvestItemId",
      recordLocation,
      objectDatasetUrl,
    );

    return {
      id: `crop:${recordId}`,
      name,
      category: "crop",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: `${localAssetRoot}/tilesheets/crops.png`,
      sprite: {
        kind: "sprite-index",
        index: readNonNegativeInteger(cropRecord.SpriteIndex, "SpriteIndex", recordLocation),
      },
      allowedTools: fillablePlacementTools,
    };
  });
}

function createBigCraftableCatalogItems(
  bigCraftablesById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(bigCraftablesById).map(
    ([recordId, rawBigCraftableRecord]) => {
      const recordLocation = { datasetUrl, recordId };
      const bigCraftableRecord = assertPlainJsonRecord(
        rawBigCraftableRecord,
        recordLocation,
      );
      assertExactNull(bigCraftableRecord.Texture, "Texture", recordLocation);

      return {
        id: `big-craftable:${recordId}`,
        name: readNonEmptyString(bigCraftableRecord.Name, "Name", recordLocation),
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: `${localAssetRoot}/tilesheets/craftables.png`,
        sprite: {
          kind: "sprite-index",
          index: readNonNegativeInteger(
            bigCraftableRecord.SpriteIndex,
            "SpriteIndex",
            recordLocation,
          ),
        },
        allowedTools: placementTools,
        ...createCatalogNightLightProperties({
          catalogItemId: `big-craftable:${recordId}`,
          contextTags: readNullableStringArray(
            bigCraftableRecord.ContextTags,
            "ContextTags",
            recordLocation,
          ),
          isLamp: readOptionalBoolean(
            bigCraftableRecord.IsLamp,
            "IsLamp",
            recordLocation,
          ),
        }),
      };
    },
  );
}

function createObjectCatalogItems(
  objectsById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  const catalogItems: CatalogItem[] = [];

  for (const [recordId, rawObjectRecord] of Object.entries(objectsById)) {
    const recordLocation = { datasetUrl, recordId };
    const objectRecord = assertPlainJsonRecord(rawObjectRecord, recordLocation);
    const name = readNonEmptyString(objectRecord.Name, "Name", recordLocation);
    const spriteIndex = readNonNegativeInteger(
      objectRecord.SpriteIndex,
      "SpriteIndex",
      recordLocation,
    );

    if (objectRecord.Texture === null) {
      catalogItems.push({
        id: `object:${recordId}`,
        name,
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: `${localAssetRoot}/tilesheets/springobjects.png`,
        sprite: { kind: "sprite-index", index: spriteIndex },
        allowedTools: placementTools,
        ...createCatalogNightLightProperties({
          catalogItemId: `object:${recordId}`,
          contextTags: readNullableStringArray(
            objectRecord.ContextTags,
            "ContextTags",
            recordLocation,
          ),
        }),
      });
      continue;
    }

    if (typeof objectRecord.Texture !== "string") {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "Texture" must be null or a string; received ${describeValue(objectRecord.Texture)}.`,
      );
    }

    assertExactString(
      objectRecord.Texture,
      "TileSheets\\Objects_2",
      "Texture",
      recordLocation,
    );
  }

  return catalogItems;
}

function createCatalogNightLightProperties(input: Readonly<{
  catalogItemId: string;
  contextTags?: readonly string[];
  furnitureType?: string;
  isLamp?: boolean;
}>): Readonly<{ nightLight?: import("./catalog-types").CatalogNightLight }> {
  const nightLight = getLockedNightLightDescriptor(input);

  return nightLight === undefined ? {} : { nightLight };
}

function readNullableStringArray(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): readonly string[] | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }

  if (!Array.isArray(rawValue) || rawValue.some((value) => typeof value !== "string")) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be null or an array of strings; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readOptionalBoolean(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): boolean | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  if (typeof rawValue !== "boolean") {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a boolean; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function createFloorCatalogItems(
  floorsById: RecordById,
  objectsById: RecordById,
  floorDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(floorsById).map(([recordId, rawFloorRecord]) => {
    const recordLocation = { datasetUrl: floorDatasetUrl, recordId };
    const floorRecord = assertPlainJsonRecord(rawFloorRecord, recordLocation);
    assertExactString(
      floorRecord.Id,
      recordId,
      "Id",
      recordLocation,
    );
    assertExactString(
      floorRecord.Texture,
      "TerrainFeatures\\Flooring",
      "Texture",
      recordLocation,
    );
    const itemId = readNonEmptyString(floorRecord.ItemId, "ItemId", recordLocation);
    const cornerSize = readPositiveInteger(
      floorRecord,
      "CornerSize",
      recordLocation,
    );
    const corner = assertPlainJsonRecord(floorRecord.Corner, recordLocation);

    return {
      id: `floor:${recordId}`,
      name: readReferencedObjectName(
        objectsById,
        itemId,
        "ItemId",
        recordLocation,
        objectDatasetUrl,
      ),
      category: "floor",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: `${localAssetRoot}/tilesheets/flooring.png`,
      sprite: {
        kind: "source-rect",
        x: readNonNegativeInteger(corner.X, "Corner.X", recordLocation),
        y: readNonNegativeInteger(corner.Y, "Corner.Y", recordLocation),
        width: cornerSize * 16,
        height: cornerSize * 16,
      },
      allowedTools: fillablePlacementTools,
    };
  });
}

function createFenceCatalogItems(
  fencesById: RecordById,
  objectsById: RecordById,
  fenceDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(fencesById).map(([recordId, rawFenceRecord]) => {
    const recordLocation = { datasetUrl: fenceDatasetUrl, recordId };
    const fenceRecord = assertPlainJsonRecord(rawFenceRecord, recordLocation);
    const textureLocalPath = resolveFenceTextureLocalPath(
      fenceRecord.Texture,
      recordLocation,
    );

    return {
      id: `fence:${recordId}`,
      name: readReferencedObjectName(
        objectsById,
        recordId,
        "record ID",
        recordLocation,
        objectDatasetUrl,
      ),
      category: "fence",
      tileSize: { width: 1, height: 1 },
      textureLocalPath,
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 48,
        height: 352,
      },
      allowedTools: fillablePlacementTools,
    };
  });
}

function assertDatasetRecordCount(
  rawDataset: unknown,
  datasetUrl: string,
  expectedRecordCount: number,
): RecordById {
  const recordsById = assertPlainJsonRecord(rawDataset, {
    datasetUrl,
    recordId: "<root>",
  });
  const recordEntries = Object.entries(recordsById);

  if (recordEntries.length !== expectedRecordCount) {
    throw new Error(
      `Catalog dataset URL ${JSON.stringify(datasetUrl)} must contain ${String(expectedRecordCount)} records; received ${String(recordEntries.length)} record IDs ${describeValue(recordEntries.map(([recordId]) => recordId))}.`,
    );
  }

  for (const [recordId] of recordEntries) {
    if (
      recordId.length === 0 ||
      recordId === "__proto__" ||
      recordId === "constructor" ||
      recordId === "prototype"
    ) {
      throw new Error(
        `Catalog dataset URL ${JSON.stringify(datasetUrl)} contains an unsafe record ID ${describeValue(recordId)}.`,
      );
    }
  }

  return recordsById;
}

function resolveBuildingTextureLocalPath(
  rawTexture: unknown,
  recordLocation: RecordLocation,
): string {
  const texture = readNonEmptyString(rawTexture, "Texture", recordLocation);
  const texturePrefix = "Buildings\\";

  if (!texture.startsWith(texturePrefix)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must start with ${JSON.stringify(texturePrefix)}; received ${describeValue(texture)}.`,
    );
  }

  const textureName = texture.slice(texturePrefix.length);

  if (!verifiedBuildingTextureNames.has(textureName)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" references an unverified local building asset ${describeValue(texture)}.`,
    );
  }

  return `${localAssetRoot}/buildings/${textureName}.png`;
}

function resolveFenceTextureLocalPath(
  rawTexture: unknown,
  recordLocation: RecordLocation,
): string {
  const texture = readNonEmptyString(rawTexture, "Texture", recordLocation);
  const texturePrefix = "LooseSprites\\";

  if (!texture.startsWith(texturePrefix)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must start with ${JSON.stringify(texturePrefix)}; received ${describeValue(texture)}.`,
    );
  }

  const textureName = texture.slice(texturePrefix.length);

  if (!verifiedFenceTextureNames.has(textureName)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" references an unverified local fence asset ${describeValue(texture)}.`,
    );
  }

  return `${localAssetRoot}/tilesheets/${textureName}.png`;
}

function readReferencedObjectName(
  objectsById: RecordById,
  referencedObjectId: string,
  referenceFieldName: string,
  referringRecordLocation: RecordLocation,
  objectDatasetUrl: string,
): string {
  if (!Object.hasOwn(objectsById, referencedObjectId)) {
    throw new Error(
      `${formatRecordLocation(referringRecordLocation)} has ${referenceFieldName} ${describeValue(referencedObjectId)} that is absent from ${JSON.stringify(objectDatasetUrl)}.`,
    );
  }

  const rawObjectRecord = objectsById[referencedObjectId];

  const objectRecord = assertPlainJsonRecord(rawObjectRecord, {
    datasetUrl: objectDatasetUrl,
    recordId: referencedObjectId,
  });

  return readNonEmptyString(objectRecord.Name, "Name", {
    datasetUrl: objectDatasetUrl,
    recordId: referencedObjectId,
  });
}

function readSourceRect(
  rawSourceRect: unknown,
  recordLocation: RecordLocation,
): CatalogSourceRect {
  const sourceRect = assertPlainJsonRecord(rawSourceRect, recordLocation);

  return {
    kind: "source-rect",
    x: readNonNegativeInteger(sourceRect.X, "SourceRect.X", recordLocation),
    y: readNonNegativeInteger(sourceRect.Y, "SourceRect.Y", recordLocation),
    width: readNonNegativeInteger(
      sourceRect.Width,
      "SourceRect.Width",
      recordLocation,
    ),
    height: readNonNegativeInteger(
      sourceRect.Height,
      "SourceRect.Height",
      recordLocation,
    ),
  };
}

function readPositiveInteger(
  rawRecord: unknown,
  propertyName: string,
  recordLocation: RecordLocation,
): number {
  const record = assertPlainJsonRecord(rawRecord, recordLocation);
  const propertyValue = record[propertyName];

  if (
    typeof propertyValue !== "number" ||
    !Number.isInteger(propertyValue) ||
    propertyValue <= 0
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(propertyName)} must be a positive integer; received ${describeValue(propertyValue)}.`,
    );
  }

  return propertyValue;
}

function readNonNegativeInteger(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
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

function readNonEmptyString(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertExactString(
  rawValue: unknown,
  expectedValue: string,
  fieldName: string,
  recordLocation: RecordLocation,
): void {
  if (rawValue !== expectedValue) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must equal ${describeValue(expectedValue)}; received ${describeValue(rawValue)}.`,
    );
  }
}

function assertExactNull(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): void {
  if (rawValue !== null) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must equal null; received ${describeValue(rawValue)}.`,
    );
  }
}

function assertPlainJsonRecord(
  rawValue: unknown,
  recordLocation: RecordLocation,
): RecordById {
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

  return rawValue as RecordById;
}

function formatRecordLocation(recordLocation: RecordLocation): string {
  return `${recordLocation.datasetUrl} record ${JSON.stringify(recordLocation.recordId)}`;
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (typeof rawValue === "number" && Number.isNaN(rawValue)) {
    return "NaN";
  }

  if (rawValue === Infinity) {
    return "Infinity";
  }

  if (rawValue === -Infinity) {
    return "-Infinity";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (rawValue !== null && typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return String(rawValue);
}
