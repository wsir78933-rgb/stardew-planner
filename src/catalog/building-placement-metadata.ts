export type BuildingPlacementSize = Readonly<{
  width: number;
  height: number;
}>;

export type BuildingPlacementCoordinate = Readonly<{
  x: number;
  y: number;
}>;

export type BuildingCollisionMapCell = Readonly<{
  requiresBuildable: boolean;
}>;

export type BuildingAdditionalPlacementTile = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  onlyNeedsToBePassable: boolean;
}>;

export type BuildingTileProperty = Readonly<{
  layer: string;
  name: string;
  value: string | null;
}>;

export type BuildingTilePropertyCell = Readonly<{
  x: number;
  y: number;
  properties: readonly BuildingTileProperty[];
}>;

export type BuildingPlacementMetadata = Readonly<{
  size: BuildingPlacementSize;
  collisionMap: readonly (readonly BuildingCollisionMapCell[])[];
  additionalPlacementTiles: readonly BuildingAdditionalPlacementTile[];
  humanDoor: BuildingPlacementCoordinate;
  tilePropertyGrid: readonly BuildingTilePropertyCell[];
}>;

export type BuildingPlacementMetadataById = Readonly<
  Record<string, BuildingPlacementMetadata>
>;

type JsonRecord = Readonly<Record<string, unknown>>;

type TileArea = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type MutableTilePropertyCell = {
  x: number;
  y: number;
  properties: BuildingTileProperty[];
};

const maximumPlacementCells = 1024;
const maximumCollisionMapSourceCharacters = 8192;

export function createBuildingPlacementMetadata(
  rawBuildingRecords: unknown,
): BuildingPlacementMetadataById {
  const buildingRecords = assertPlainJsonRecord(rawBuildingRecords, "<root>");
  const metadataById: Record<string, BuildingPlacementMetadata> = {};

  for (const [buildingId, rawBuildingRecord] of Object.entries(buildingRecords)) {
    assertSafeBuildingId(buildingId);
    const buildingRecord = assertPlainJsonRecord(rawBuildingRecord, buildingId);
    const size = readBuildingSize(buildingRecord, buildingId);
    const placementMetadata = freezeBuildingPlacementMetadata({
      size,
      collisionMap: readCollisionMap(buildingRecord.CollisionMap, size, buildingId),
      additionalPlacementTiles: readAdditionalPlacementTiles(
        buildingRecord.AdditionalPlacementTiles,
        buildingId,
      ),
      humanDoor: readHumanDoor(buildingRecord.HumanDoor, size, buildingId),
      tilePropertyGrid: readTilePropertyGrid(
        buildingRecord.TileProperties,
        buildingId,
      ),
    });
    addPlacementMetadata(metadataById, buildingId, placementMetadata);
    addSkinPlacementMetadata(metadataById, buildingId, buildingRecord, placementMetadata);
  }

  addUpgradePlacementMetadata(metadataById, "Farmhouse");
  for (const cabinBuildingId of [
    "Cabin",
    "Plank Cabin",
    "Log Cabin",
    "Neighbor Cabin",
    "Rustic Cabin",
    "Beach Cabin",
    "Trailer Cabin",
  ]) {
    addUpgradePlacementMetadata(metadataById, cabinBuildingId);
  }

  return Object.freeze(metadataById);
}

function addSkinPlacementMetadata(
  metadataById: Record<string, BuildingPlacementMetadata>,
  buildingId: string,
  buildingRecord: JsonRecord,
  placementMetadata: BuildingPlacementMetadata,
): void {
  const rawSkins = buildingRecord.Skins;
  if (rawSkins === undefined || rawSkins === null) {
    return;
  }
  if (!Array.isArray(rawSkins)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "Skins" must be null or an array; received ${describeValue(rawSkins)}.`,
    );
  }
  rawSkins.forEach((rawSkin, skinIndex) => {
    const skinRecord = assertPlainJsonRecord(
      rawSkin,
      buildingId,
      `Skins[${String(skinIndex)}]`,
    );
    const skinId = readNonEmptyString(
      skinRecord.Id,
      buildingId,
      `Skins[${String(skinIndex)}].Id`,
    );
    assertSafeBuildingId(skinId);
    addPlacementMetadata(metadataById, skinId, placementMetadata);
  });
}

function addUpgradePlacementMetadata(
  metadataById: Record<string, BuildingPlacementMetadata>,
  baseBuildingId: string,
): void {
  const placementMetadata = metadataById[baseBuildingId];
  if (placementMetadata === undefined) {
    return;
  }
  for (const upgradeNumber of [1, 2]) {
    addPlacementMetadata(
      metadataById,
      `${baseBuildingId}_${String(upgradeNumber)}`,
      placementMetadata,
    );
  }
}

function addPlacementMetadata(
  metadataById: Record<string, BuildingPlacementMetadata>,
  buildingId: string,
  placementMetadata: BuildingPlacementMetadata,
): void {
  if (Object.hasOwn(metadataById, buildingId)) {
    throw new Error(
      `building placement metadata produced duplicate building ID ${JSON.stringify(buildingId)}.`,
    );
  }
  metadataById[buildingId] = placementMetadata;
}

function readBuildingSize(
  buildingRecord: JsonRecord,
  buildingId: string,
): BuildingPlacementSize {
  const rawSize = assertPlainJsonRecord(buildingRecord.Size, buildingId, "Size");
  const width = readPositiveInteger(rawSize.X, buildingId, "Size.X");
  const height = readPositiveInteger(rawSize.Y, buildingId, "Size.Y");
  assertSizeWithinPlacementCellBudget(width, height, buildingId, "Size");

  return Object.freeze({
    width,
    height,
  });
}

function readCollisionMap(
  rawCollisionMap: unknown,
  size: BuildingPlacementSize,
  buildingId: string,
): readonly (readonly BuildingCollisionMapCell[])[] {
  if (rawCollisionMap === null) {
    return createDefaultCollisionMap(size);
  }

  if (typeof rawCollisionMap !== "string") {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "CollisionMap" must be null or a string; received ${describeValue(rawCollisionMap)}.`,
    );
  }

  if (rawCollisionMap.length > maximumCollisionMapSourceCharacters) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "CollisionMap" must not exceed ${String(maximumCollisionMapSourceCharacters)} source characters; received ${String(rawCollisionMap.length)} characters.`,
    );
  }

  const collisionMapRows = rawCollisionMap
    .trim()
    .split(/\r?\n/)
    .map((rawRow) => rawRow.trim());

  if (collisionMapRows.length !== size.height) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "CollisionMap" must contain ${String(size.height)} rows; received ${String(collisionMapRows.length)} rows ${describeValue(collisionMapRows)}.`,
    );
  }

  const collisionMap: (readonly BuildingCollisionMapCell[])[] = [];
  let collisionMapCellCount = 0;

  for (const [rowIndex, collisionMapRow] of collisionMapRows.entries()) {
    if (collisionMapRow.length < size.width) {
      throw new Error(
        `building ${JSON.stringify(buildingId)} field "CollisionMap" row ${String(rowIndex)} must contain at least ${String(size.width)} cells; received ${describeValue(collisionMapRow)}.`,
      );
    }

    if (collisionMapRow.length > maximumPlacementCells) {
      throw new Error(
        `building ${JSON.stringify(buildingId)} field "CollisionMap" row ${String(rowIndex)} must not exceed ${String(maximumPlacementCells)} placement cells; received ${String(collisionMapRow.length)} cells.`,
      );
    }

    if (!/^[XO]+$/.test(collisionMapRow)) {
      throw new Error(
        `building ${JSON.stringify(buildingId)} field "CollisionMap" row ${String(rowIndex)} must contain only "X" or "O" cells; received ${describeValue(collisionMapRow)}.`,
      );
    }

    collisionMapCellCount = reservePlacementCells(
      collisionMapCellCount,
      collisionMapRow.length,
      buildingId,
      "CollisionMap",
    );
    collisionMap.push(
      Object.freeze(
        Array.from(collisionMapRow, (collisionCharacter) =>
          Object.freeze({ requiresBuildable: collisionCharacter === "X" }),
        ),
      ),
    );
  }

  return Object.freeze(collisionMap);
}

function createDefaultCollisionMap(
  size: BuildingPlacementSize,
): readonly (readonly BuildingCollisionMapCell[])[] {
  assertSizeWithinPlacementCellBudget(size.width, size.height, "<default>", "Size");

  return Object.freeze(
    Array.from({ length: size.height }, () =>
      Object.freeze(
        Array.from({ length: size.width }, () =>
          Object.freeze({ requiresBuildable: true }),
        ),
      ),
    ),
  );
}

function readAdditionalPlacementTiles(
  rawAdditionalPlacementTiles: unknown,
  buildingId: string,
): readonly BuildingAdditionalPlacementTile[] {
  if (rawAdditionalPlacementTiles === null) {
    return Object.freeze([]);
  }

  if (!Array.isArray(rawAdditionalPlacementTiles)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "AdditionalPlacementTiles" must be null or an array; received ${describeValue(rawAdditionalPlacementTiles)}.`,
    );
  }

  if (rawAdditionalPlacementTiles.length > maximumPlacementCells) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "AdditionalPlacementTiles" must contain at most ${String(maximumPlacementCells)} entries; received ${String(rawAdditionalPlacementTiles.length)} entries.`,
    );
  }

  const additionalPlacementTiles: BuildingAdditionalPlacementTile[] = [];
  let additionalPlacementCellCount = 0;

  for (const [index, rawAdditionalPlacementTile] of rawAdditionalPlacementTiles.entries()) {
    const fieldPrefix = `AdditionalPlacementTiles[${String(index)}]`;
    const additionalPlacementTile = assertPlainJsonRecord(
      rawAdditionalPlacementTile,
      buildingId,
      fieldPrefix,
    );
    const tileArea = readTileArea(
      additionalPlacementTile.TileArea,
      buildingId,
      `${fieldPrefix}.TileArea`,
    );
    const rawOnlyNeedsToBePassable =
      additionalPlacementTile.OnlyNeedsToBePassable;

    if (typeof rawOnlyNeedsToBePassable !== "boolean") {
      throw new Error(
        `building ${JSON.stringify(buildingId)} field "${fieldPrefix}.OnlyNeedsToBePassable" must be a boolean; received ${describeValue(rawOnlyNeedsToBePassable)}.`,
      );
    }

    additionalPlacementCellCount = reservePlacementCells(
      additionalPlacementCellCount,
      getTileAreaCellCount(tileArea, buildingId, `${fieldPrefix}.TileArea`),
      buildingId,
      "AdditionalPlacementTiles",
    );
    additionalPlacementTiles.push(
      Object.freeze({
        ...tileArea,
        onlyNeedsToBePassable: rawOnlyNeedsToBePassable,
      }),
    );
  }

  return Object.freeze(additionalPlacementTiles);
}

function readHumanDoor(
  rawHumanDoor: unknown,
  size: BuildingPlacementSize,
  buildingId: string,
): BuildingPlacementCoordinate {
  const humanDoor = assertPlainJsonRecord(rawHumanDoor, buildingId, "HumanDoor");
  const x = readDoorCoordinate(humanDoor.X, size.width, buildingId, "HumanDoor.X");
  const y = readDoorCoordinate(humanDoor.Y, size.height, buildingId, "HumanDoor.Y");

  if ((x === -1) !== (y === -1)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "HumanDoor" must use -1 for both coordinates or neither; received ${describeValue({ X: humanDoor.X, Y: humanDoor.Y })}.`,
    );
  }

  return Object.freeze({ x, y });
}

function readTilePropertyGrid(
  rawTileProperties: unknown,
  buildingId: string,
): readonly BuildingTilePropertyCell[] {
  if (!Array.isArray(rawTileProperties)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "TileProperties" must be an array; received ${describeValue(rawTileProperties)}.`,
    );
  }

  const mutableCellsByCoordinate = new Map<string, MutableTilePropertyCell>();
  let tilePropertyCellCount = 0;

  if (rawTileProperties.length > maximumPlacementCells) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "TileProperties" must contain at most ${String(maximumPlacementCells)} entries; received ${String(rawTileProperties.length)} entries.`,
    );
  }

  for (const [propertyIndex, rawTileProperty] of rawTileProperties.entries()) {
    const fieldPrefix = `TileProperties[${String(propertyIndex)}]`;
    const tileProperty = assertPlainJsonRecord(
      rawTileProperty,
      buildingId,
      fieldPrefix,
    );
    const layer = readNonEmptyString(tileProperty.Layer, buildingId, `${fieldPrefix}.Layer`);
    const name = readNonEmptyString(tileProperty.Name, buildingId, `${fieldPrefix}.Name`);
    const value = readStringOrNull(tileProperty.Value, buildingId, `${fieldPrefix}.Value`);
    const tileArea = readTileArea(
      tileProperty.TileArea,
      buildingId,
      `${fieldPrefix}.TileArea`,
    );
    tilePropertyCellCount = reservePlacementCells(
      tilePropertyCellCount,
      getTileAreaCellCount(tileArea, buildingId, `${fieldPrefix}.TileArea`),
      buildingId,
      "TileProperties",
    );
    const property = Object.freeze({ layer, name, value });
    const tileAreaEndY = tileArea.y + tileArea.height;
    const tileAreaEndX = tileArea.x + tileArea.width;

    for (let y = tileArea.y; y < tileAreaEndY; y += 1) {
      for (let x = tileArea.x; x < tileAreaEndX; x += 1) {
        const coordinateKey = `${String(x)},${String(y)}`;
        const existingCell = mutableCellsByCoordinate.get(coordinateKey);

        if (existingCell === undefined) {
          mutableCellsByCoordinate.set(coordinateKey, {
            x,
            y,
            properties: [property],
          });
          continue;
        }

        if (
          existingCell.properties.some(
            (existingProperty) =>
              existingProperty.layer === layer && existingProperty.name === name,
          )
        ) {
          throw new Error(
            `building ${JSON.stringify(buildingId)} field "${fieldPrefix}" duplicates property ${JSON.stringify(`${layer}.${name}`)} at tile (${String(x)}, ${String(y)}).`,
          );
        }

        existingCell.properties.push(property);
      }
    }
  }

  return Object.freeze(
    Array.from(mutableCellsByCoordinate.values())
      .sort((leftCell, rightCell) => leftCell.y - rightCell.y || leftCell.x - rightCell.x)
      .map((mutableCell) =>
        Object.freeze({
          x: mutableCell.x,
          y: mutableCell.y,
          properties: Object.freeze([...mutableCell.properties]),
        }),
      ),
  );
}

function readTileArea(
  rawTileArea: unknown,
  buildingId: string,
  fieldPrefix: string,
): TileArea {
  const tileArea = assertPlainJsonRecord(rawTileArea, buildingId, fieldPrefix);
  const x = readNonNegativeInteger(tileArea.X, buildingId, `${fieldPrefix}.X`);
  const y = readNonNegativeInteger(tileArea.Y, buildingId, `${fieldPrefix}.Y`);
  const width = readPositiveInteger(tileArea.Width, buildingId, `${fieldPrefix}.Width`);
  const height = readPositiveInteger(tileArea.Height, buildingId, `${fieldPrefix}.Height`);
  assertSizeWithinPlacementCellBudget(width, height, buildingId, fieldPrefix);
  assertTileAreaCoordinateRange(x, width, buildingId, fieldPrefix, "X", "Width");
  assertTileAreaCoordinateRange(y, height, buildingId, fieldPrefix, "Y", "Height");

  return { x, y, width, height };
}

function assertSizeWithinPlacementCellBudget(
  width: number,
  height: number,
  buildingId: string,
  fieldName: string,
): void {
  if (width > Math.floor(maximumPlacementCells / height)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must not exceed ${String(maximumPlacementCells)} placement cells; received width ${String(width)} and height ${String(height)}.`,
    );
  }
}

function getTileAreaCellCount(
  tileArea: TileArea,
  buildingId: string,
  fieldName: string,
): number {
  assertSizeWithinPlacementCellBudget(
    tileArea.width,
    tileArea.height,
    buildingId,
    fieldName,
  );

  return tileArea.width * tileArea.height;
}

function reservePlacementCells(
  currentCellCount: number,
  additionalCellCount: number,
  buildingId: string,
  fieldName: string,
): number {
  const nextCellCount = currentCellCount + additionalCellCount;

  if (nextCellCount > maximumPlacementCells) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must not exceed ${String(maximumPlacementCells)} placement cells; received ${String(nextCellCount)} cells.`,
    );
  }

  return nextCellCount;
}

function assertTileAreaCoordinateRange(
  coordinate: number,
  length: number,
  buildingId: string,
  fieldPrefix: string,
  coordinateFieldName: string,
  lengthFieldName: string,
): void {
  if (coordinate > Number.MAX_SAFE_INTEGER - (length - 1)) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldPrefix}" must keep ${coordinateFieldName} and ${lengthFieldName} within the safe integer range; received ${coordinateFieldName} ${String(coordinate)} and ${lengthFieldName} ${String(length)}.`,
    );
  }
}

function readDoorCoordinate(
  rawCoordinate: unknown,
  maximumCoordinate: number,
  buildingId: string,
  fieldName: string,
): number {
  if (
    typeof rawCoordinate !== "number" ||
    !Number.isSafeInteger(rawCoordinate) ||
    rawCoordinate < -1 ||
    rawCoordinate >= maximumCoordinate
  ) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must be a safe integer from -1 to ${String(maximumCoordinate - 1)}; received ${describeValue(rawCoordinate)}.`,
    );
  }

  return rawCoordinate;
}

function readPositiveInteger(
  rawValue: unknown,
  buildingId: string,
  fieldName: string,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue <= 0
  ) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must be a positive safe integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNonNegativeInteger(
  rawValue: unknown,
  buildingId: string,
  fieldName: string,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue < 0
  ) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must be a non-negative safe integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNonEmptyString(
  rawValue: unknown,
  buildingId: string,
  fieldName: string,
): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readStringOrNull(
  rawValue: unknown,
  buildingId: string,
  fieldName: string,
): string | null {
  if (rawValue !== null && typeof rawValue !== "string") {
    throw new Error(
      `building ${JSON.stringify(buildingId)} field "${fieldName}" must be a string or null; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertPlainJsonRecord(
  rawValue: unknown,
  buildingId: string,
  fieldName?: string,
): JsonRecord {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    const location =
      fieldName === undefined
        ? `building ${JSON.stringify(buildingId)}`
        : `building ${JSON.stringify(buildingId)} field "${fieldName}"`;
    throw new Error(
      `${location} must be a plain JSON object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue as JsonRecord;
}

function assertSafeBuildingId(buildingId: string): void {
  if (
    buildingId.length === 0 ||
    buildingId === "__proto__" ||
    buildingId === "constructor" ||
    buildingId === "prototype"
  ) {
    throw new Error(
      `building ID must be a non-empty safe record key; received ${describeValue(buildingId)}.`,
    );
  }
}

function freezeBuildingPlacementMetadata(
  metadata: BuildingPlacementMetadata,
): BuildingPlacementMetadata {
  return Object.freeze(metadata);
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
