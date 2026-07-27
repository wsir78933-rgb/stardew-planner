import {
  restoreInteriorDecorState,
  type InteriorDecorState,
} from "../interior-decor/interior-decor-state";
import {
  isBuildingPaintable,
  validateBuildingPaintColors,
  type BuildingPaintColors,
} from "../paint/building-paint";

export const placementItemLayers = ["item", "path", "fence"] as const;

export type PlacementItemLayer = (typeof placementItemLayers)[number];

export type PlacementCoordinate = Readonly<{
  x: number;
  y: number;
}>;

export type PlacementFootprint = Readonly<{
  width: number;
  height: number;
}>;

export type PlacementBuilding = PlacementCoordinate &
  Readonly<{
    instanceId: number;
    buildingId: string;
    paintColors?: BuildingPaintColors;
  }>;

export type NewPlacementBuilding = Omit<PlacementBuilding, "instanceId">;

export type PlacementCrop = PlacementCoordinate &
  Readonly<{
    cropId: string;
  }>;

export type PlacementItem = PlacementCoordinate &
  Readonly<{
    instanceId: number;
    itemId: string;
    layer: PlacementItemLayer;
    rotation: number;
    footprint: PlacementFootprint;
    variant: number;
    tintColor: string;
    locked: boolean;
    isRug: boolean;
    isGrass: boolean;
    isTable: boolean;
    isLongTable: boolean;
    flipped: boolean;
    bedType: string | null;
    heldItemId?: string;
    nightLightState?: "off";
  }>;

export type NewPlacementItem = Omit<PlacementItem, "instanceId">;

export type PlacementSnapshot = Readonly<{
  buildings: readonly PlacementBuilding[];
  crops: readonly PlacementCrop[];
  items: readonly PlacementItem[];
  nextBuildingId: number;
  nextItemId: number;
  interiorDecor?: InteriorDecorState;
}>;

export type PlacementState = PlacementSnapshot &
  Readonly<{
    itemIndex: ReadonlyMap<number, PlacementItem>;
  }>;

export type PlacementSnapshotAction =
  | Readonly<{
      type: "add-building";
      building: NewPlacementBuilding;
    }>
  | Readonly<{
      type: "delete-building";
      instanceId: number;
    }>
  | Readonly<{
      type: "replace-building";
      building: PlacementBuilding;
    }>
  | Readonly<{
      type: "add-crop";
      crop: PlacementCrop;
    }>
  | Readonly<{
      type: "delete-crop";
      coordinate: PlacementCoordinate;
    }>
  | Readonly<{
      type: "replace-crop";
      coordinate: PlacementCoordinate;
      crop: PlacementCrop;
    }>
  | Readonly<{
      type: "add-item";
      item: NewPlacementItem;
    }>
  | Readonly<{
      type: "delete-item";
      instanceId: number;
    }>
  | Readonly<{
      type: "replace-item";
      item: PlacementItem;
    }>;

type JsonRecord = Readonly<Record<string, unknown>>;

const snapshotFields = [
  "buildings",
  "crops",
  "items",
  "nextBuildingId",
  "nextItemId",
] as const;
const optionalSnapshotFields = ["interiorDecor"] as const;

const buildingFields = ["instanceId", "buildingId", "x", "y"] as const;
const newBuildingFields = ["buildingId", "x", "y"] as const;
const optionalBuildingFields = ["paintColors"] as const;
const cropFields = ["cropId", "x", "y"] as const;
const coordinateFields = ["x", "y"] as const;
const itemFields = [
  "instanceId",
  "itemId",
  "x",
  "y",
  "layer",
  "rotation",
  "footprint",
  "variant",
  "tintColor",
  "locked",
  "isRug",
  "isGrass",
  "isTable",
  "isLongTable",
  "flipped",
  "bedType",
] as const;
const newItemFields = itemFields.filter(
  (fieldName) => fieldName !== "instanceId",
);
const optionalItemFields = ["heldItemId", "nightLightState"] as const;
const footprintFields = ["width", "height"] as const;

export function createEmptyPlacementSnapshot(): PlacementSnapshot {
  return {
    buildings: [],
    crops: [],
    items: [],
    nextBuildingId: 1,
    nextItemId: 1,
  };
}

export function restorePlacementSnapshot(
  rawPlacementSnapshot: unknown,
): PlacementSnapshot {
  const placementSnapshot = readPlacementSnapshot(rawPlacementSnapshot, true);

  return clonePlacementSnapshot(placementSnapshot);
}

export function createPersistentPlacementSnapshot(
  placementSnapshot: PlacementSnapshot,
): PlacementSnapshot {
  const validatedPlacementSnapshot = readPlacementSnapshot(placementSnapshot, false);

  return clonePlacementSnapshot(validatedPlacementSnapshot);
}

export function createPlacementState(
  placementSnapshot: PlacementSnapshot,
): PlacementState {
  const persistentSnapshot = createPersistentPlacementSnapshot(placementSnapshot);

  return {
    ...persistentSnapshot,
    itemIndex: new Map(
      persistentSnapshot.items.map((item) => [item.instanceId, item]),
    ),
  };
}

export function replacePlacementSnapshotInteriorDecor(
  placementSnapshot: PlacementSnapshot,
  interiorDecorState: InteriorDecorState,
): PlacementSnapshot {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const persistentInteriorDecorState = restoreInteriorDecorState(
    interiorDecorState,
  );

  return {
    ...persistentPlacementSnapshot,
    interiorDecor: persistentInteriorDecorState,
  };
}

export function applyPlacementSnapshotAction(
  placementSnapshot: PlacementSnapshot,
  placementAction: PlacementSnapshotAction,
): PlacementSnapshot {
  const currentSnapshot = createPersistentPlacementSnapshot(placementSnapshot);
  assertPlacementSnapshotAction(placementAction);

  switch (placementAction.type) {
    case "add-building":
      return addBuilding(currentSnapshot, placementAction.building);
    case "delete-building":
      return deleteBuilding(currentSnapshot, placementAction.instanceId);
    case "replace-building":
      return replaceBuilding(currentSnapshot, placementAction.building);
    case "add-crop":
      return addCrop(currentSnapshot, placementAction.crop);
    case "delete-crop":
      return deleteCrop(currentSnapshot, placementAction.coordinate);
    case "replace-crop":
      return replaceCrop(
        currentSnapshot,
        placementAction.coordinate,
        placementAction.crop,
      );
    case "add-item":
      return addItem(currentSnapshot, placementAction.item);
    case "delete-item":
      return deleteItem(currentSnapshot, placementAction.instanceId);
    case "replace-item":
      return replaceItem(currentSnapshot, placementAction.item);
  }
}

function addBuilding(
  placementSnapshot: PlacementSnapshot,
  newBuilding: NewPlacementBuilding,
): PlacementSnapshot {
  const instanceId = placementSnapshot.nextBuildingId;

  return {
    ...placementSnapshot,
    buildings: [
      ...placementSnapshot.buildings,
      { ...newBuilding, instanceId },
    ],
    nextBuildingId: incrementIdentifier(instanceId, "nextBuildingId"),
  };
}

function deleteBuilding(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementSnapshot {
  const buildingIndex = placementSnapshot.buildings.findIndex(
    (building) => building.instanceId === instanceId,
  );

  if (buildingIndex === -1) {
    throw new Error(
      `Placement snapshot field "buildings" must contain building instanceId ${describeValue(instanceId)}; received ${describeValue(placementSnapshot.buildings.map((building) => building.instanceId))}.`,
    );
  }

  return {
    ...placementSnapshot,
    buildings: placementSnapshot.buildings.filter(
      (building) => building.instanceId !== instanceId,
    ),
  };
}

function replaceBuilding(
  placementSnapshot: PlacementSnapshot,
  replacementBuilding: PlacementBuilding,
): PlacementSnapshot {
  const buildingIndex = placementSnapshot.buildings.findIndex(
    (building) => building.instanceId === replacementBuilding.instanceId,
  );

  if (buildingIndex === -1) {
    throw new Error(
      `Placement snapshot field "buildings" must contain building instanceId ${describeValue(replacementBuilding.instanceId)}; received ${describeValue(placementSnapshot.buildings.map((building) => building.instanceId))}.`,
    );
  }

  return {
    ...placementSnapshot,
    buildings: placementSnapshot.buildings.map((building) =>
      building.instanceId === replacementBuilding.instanceId
        ? { ...replacementBuilding }
        : building,
    ),
  };
}

function addCrop(
  placementSnapshot: PlacementSnapshot,
  newCrop: PlacementCrop,
): PlacementSnapshot {
  assertCropCoordinateAvailable(placementSnapshot.crops, newCrop, -1);

  return {
    ...placementSnapshot,
    crops: [...placementSnapshot.crops, { ...newCrop }],
  };
}

function deleteCrop(
  placementSnapshot: PlacementSnapshot,
  coordinate: PlacementCoordinate,
): PlacementSnapshot {
  const cropIndex = findCropIndex(placementSnapshot.crops, coordinate);

  if (cropIndex === -1) {
    throw new Error(
      `Placement snapshot field "crops" must contain a crop at coordinate ${describeValue(coordinate)}; received ${describeValue(placementSnapshot.crops)}.`,
    );
  }

  return {
    ...placementSnapshot,
    crops: placementSnapshot.crops.filter((_, index) => index !== cropIndex),
  };
}

function replaceCrop(
  placementSnapshot: PlacementSnapshot,
  previousCoordinate: PlacementCoordinate,
  replacementCrop: PlacementCrop,
): PlacementSnapshot {
  const cropIndex = findCropIndex(placementSnapshot.crops, previousCoordinate);

  if (cropIndex === -1) {
    throw new Error(
      `Placement snapshot field "crops" must contain a crop at coordinate ${describeValue(previousCoordinate)}; received ${describeValue(placementSnapshot.crops)}.`,
    );
  }

  assertCropCoordinateAvailable(placementSnapshot.crops, replacementCrop, cropIndex);

  return {
    ...placementSnapshot,
    crops: placementSnapshot.crops.map((crop, index) =>
      index === cropIndex ? { ...replacementCrop } : crop,
    ),
  };
}

function addItem(
  placementSnapshot: PlacementSnapshot,
  newItem: NewPlacementItem,
): PlacementSnapshot {
  const instanceId = placementSnapshot.nextItemId;

  return {
    ...placementSnapshot,
    items: [
      ...placementSnapshot.items,
      clonePlacementItem({ ...newItem, instanceId }),
    ],
    nextItemId: incrementIdentifier(instanceId, "nextItemId"),
  };
}

function deleteItem(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementSnapshot {
  const itemIndex = placementSnapshot.items.findIndex(
    (item) => item.instanceId === instanceId,
  );

  if (itemIndex === -1) {
    throw new Error(
      `Placement snapshot field "items" must contain item instanceId ${describeValue(instanceId)}; received ${describeValue(placementSnapshot.items.map((item) => item.instanceId))}.`,
    );
  }

  return {
    ...placementSnapshot,
    items: placementSnapshot.items.filter((item) => item.instanceId !== instanceId),
  };
}

function replaceItem(
  placementSnapshot: PlacementSnapshot,
  replacementItem: PlacementItem,
): PlacementSnapshot {
  const itemIndex = placementSnapshot.items.findIndex(
    (item) => item.instanceId === replacementItem.instanceId,
  );

  if (itemIndex === -1) {
    throw new Error(
      `Placement snapshot field "items" must contain item instanceId ${describeValue(replacementItem.instanceId)}; received ${describeValue(placementSnapshot.items.map((item) => item.instanceId))}.`,
    );
  }

  return {
    ...placementSnapshot,
    items: placementSnapshot.items.map((item) =>
      item.instanceId === replacementItem.instanceId
        ? clonePlacementItem(replacementItem)
        : item,
    ),
  };
}

function readPlacementSnapshot(
  rawPlacementSnapshot: unknown,
  rejectUnexpectedFields: boolean,
): PlacementSnapshot {
  const snapshotRecord = assertJsonRecord(rawPlacementSnapshot, "");
  assertAllowedFields(
    snapshotRecord,
    "",
    snapshotFields,
    optionalSnapshotFields,
    rejectUnexpectedFields,
  );
  const buildings = readPlacementArray(
    snapshotRecord.buildings,
    "buildings",
    readPlacementBuilding,
    rejectUnexpectedFields,
  );
  const crops = readPlacementArray(
    snapshotRecord.crops,
    "crops",
    readPlacementCrop,
    rejectUnexpectedFields,
  );
  const items = readPlacementArray(
    snapshotRecord.items,
    "items",
    readPlacementItem,
    rejectUnexpectedFields,
  );
  const nextBuildingId = readPositiveSafeInteger(
    snapshotRecord.nextBuildingId,
    "nextBuildingId",
  );
  const nextItemId = readPositiveSafeInteger(
    snapshotRecord.nextItemId,
    "nextItemId",
  );
  const interiorDecor = hasOwn(snapshotRecord, "interiorDecor")
    ? restoreInteriorDecorState(snapshotRecord.interiorDecor)
    : undefined;

  assertUniqueIdentifiers(buildings, "buildings", (building) => building.instanceId);
  assertUniqueIdentifiers(items, "items", (item) => item.instanceId);
  assertUniqueCropCoordinates(crops);
  assertNextIdentifier(buildings, nextBuildingId, "nextBuildingId", "buildings");
  assertNextIdentifier(items, nextItemId, "nextItemId", "items");

  return {
    buildings,
    crops,
    items,
    nextBuildingId,
    nextItemId,
    ...(interiorDecor === undefined ? {} : { interiorDecor }),
  };
}

function readPlacementArray<PlacementValue>(
  rawPlacementValues: unknown,
  fieldPath: string,
  readPlacementValue: (
    rawPlacementValue: unknown,
    fieldPath: string,
    rejectUnexpectedFields: boolean,
  ) => PlacementValue,
  rejectUnexpectedFields: boolean,
): readonly PlacementValue[] {
  if (!Array.isArray(rawPlacementValues)) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be an array; received ${describeValue(rawPlacementValues)}.`,
    );
  }

  return rawPlacementValues.map((rawPlacementValue, index) =>
    readPlacementValue(
      rawPlacementValue,
      `${fieldPath}[${String(index)}]`,
      rejectUnexpectedFields,
    ),
  );
}

function readPlacementBuilding(
  rawBuilding: unknown,
  fieldPath: string,
  rejectUnexpectedFields: boolean,
): PlacementBuilding {
  const buildingRecord = assertJsonRecord(rawBuilding, fieldPath);
  assertAllowedFields(
    buildingRecord,
    fieldPath,
    buildingFields,
    optionalBuildingFields,
    rejectUnexpectedFields,
  );
  const buildingId = readNonEmptyString(
    buildingRecord.buildingId,
    `${fieldPath}.buildingId`,
  );
  const paintColors = readBuildingPaintColors(
    buildingRecord,
    buildingId,
    fieldPath,
  );

  return {
    instanceId: readPositiveSafeInteger(
      buildingRecord.instanceId,
      `${fieldPath}.instanceId`,
    ),
    buildingId,
    ...readPlacementCoordinate(buildingRecord, fieldPath, false),
    ...(paintColors === undefined ? {} : { paintColors }),
  };
}

function readNewPlacementBuilding(
  rawBuilding: unknown,
  fieldPath: string,
): NewPlacementBuilding {
  const buildingRecord = assertJsonRecord(rawBuilding, fieldPath);
  assertAllowedFields(
    buildingRecord,
    fieldPath,
    newBuildingFields,
    optionalBuildingFields,
    true,
  );
  const buildingId = readNonEmptyString(
    buildingRecord.buildingId,
    `${fieldPath}.buildingId`,
  );
  const paintColors = readBuildingPaintColors(
    buildingRecord,
    buildingId,
    fieldPath,
  );

  return {
    buildingId,
    ...readPlacementCoordinate(buildingRecord, fieldPath, false),
    ...(paintColors === undefined ? {} : { paintColors }),
  };
}

function readBuildingPaintColors(
  buildingRecord: JsonRecord,
  buildingId: string,
  fieldPath: string,
): BuildingPaintColors | undefined {
  if (!hasOwn(buildingRecord, "paintColors")) {
    return undefined;
  }

  if (!isBuildingPaintable(buildingId)) {
    throw new Error(
      `Placement snapshot field "${fieldPath}.paintColors" cannot be assigned to building ${describeValue(buildingId)} because it has no locked paint mask.`,
    );
  }

  return validateBuildingPaintColors(buildingRecord.paintColors);
}

function readPlacementCrop(
  rawCrop: unknown,
  fieldPath: string,
  rejectUnexpectedFields: boolean,
): PlacementCrop {
  const cropRecord = assertJsonRecord(rawCrop, fieldPath);
  assertAllowedFields(
    cropRecord,
    fieldPath,
    cropFields,
    [],
    rejectUnexpectedFields,
  );

  return {
    cropId: readNonEmptyString(cropRecord.cropId, `${fieldPath}.cropId`),
    ...readPlacementCoordinate(cropRecord, fieldPath, false),
  };
}

function readPlacementItem(
  rawItem: unknown,
  fieldPath: string,
  rejectUnexpectedFields: boolean,
): PlacementItem {
  const itemRecord = assertJsonRecord(rawItem, fieldPath);
  assertAllowedFields(
    itemRecord,
    fieldPath,
    itemFields,
    optionalItemFields,
    rejectUnexpectedFields,
  );

  return readPlacementItemFields(
    itemRecord,
    fieldPath,
    true,
  ) as PlacementItem;
}

function readNewPlacementItem(
  rawItem: unknown,
  fieldPath: string,
): NewPlacementItem {
  const itemRecord = assertJsonRecord(rawItem, fieldPath);
  assertAllowedFields(itemRecord, fieldPath, newItemFields, optionalItemFields, true);

  return readPlacementItemFields(
    itemRecord,
    fieldPath,
    false,
  ) as NewPlacementItem;
}

function readPlacementItemFields(
  itemRecord: JsonRecord,
  fieldPath: string,
  includesInstanceId: boolean,
): PlacementItem | NewPlacementItem {
  const heldItemId = hasOwn(itemRecord, "heldItemId")
    ? readNonEmptyString(itemRecord.heldItemId, `${fieldPath}.heldItemId`)
    : undefined;
  const nightLightState = hasOwn(itemRecord, "nightLightState")
    ? readNightLightState(itemRecord.nightLightState, `${fieldPath}.nightLightState`)
    : undefined;
  const itemProperties = {
    itemId: readNonEmptyString(itemRecord.itemId, `${fieldPath}.itemId`),
    ...readPlacementCoordinate(itemRecord, fieldPath, false),
    layer: readPlacementItemLayer(itemRecord.layer, `${fieldPath}.layer`),
    rotation: readSafeInteger(itemRecord.rotation, `${fieldPath}.rotation`),
    footprint: readPlacementFootprint(itemRecord.footprint, `${fieldPath}.footprint`),
    variant: readSafeInteger(itemRecord.variant, `${fieldPath}.variant`),
    tintColor: readCanonicalTintColor(itemRecord.tintColor, `${fieldPath}.tintColor`),
    locked: readBoolean(itemRecord.locked, `${fieldPath}.locked`),
    isRug: readBoolean(itemRecord.isRug, `${fieldPath}.isRug`),
    isGrass: readBoolean(itemRecord.isGrass, `${fieldPath}.isGrass`),
    isTable: readBoolean(itemRecord.isTable, `${fieldPath}.isTable`),
    isLongTable: readBoolean(itemRecord.isLongTable, `${fieldPath}.isLongTable`),
    flipped: readBoolean(itemRecord.flipped, `${fieldPath}.flipped`),
    bedType: readNullableString(itemRecord.bedType, `${fieldPath}.bedType`),
    ...(heldItemId === undefined ? {} : { heldItemId }),
    ...(nightLightState === undefined ? {} : { nightLightState }),
  };

  if (!includesInstanceId) {
    return itemProperties;
  }

  return {
    instanceId: readPositiveSafeInteger(
      itemRecord.instanceId,
      `${fieldPath}.instanceId`,
    ),
    ...itemProperties,
  };
}

function readNightLightState(
  rawNightLightState: unknown,
  fieldPath: string,
): "off" {
  if (rawNightLightState !== "off") {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must equal "off"; received ${describeValue(rawNightLightState)}.`,
    );
  }

  return rawNightLightState;
}

function readPlacementCoordinate(
  coordinateRecord: JsonRecord,
  fieldPath: string,
  rejectUnexpectedFields: boolean,
): PlacementCoordinate {
  assertAllowedFields(
    coordinateRecord,
    fieldPath,
    coordinateFields,
    [],
    rejectUnexpectedFields,
  );

  return {
    x: readSafeInteger(coordinateRecord.x, `${fieldPath}.x`),
    y: readSafeInteger(coordinateRecord.y, `${fieldPath}.y`),
  };
}

function readPlacementFootprint(
  rawFootprint: unknown,
  fieldPath: string,
): PlacementFootprint {
  const footprintRecord = assertJsonRecord(rawFootprint, fieldPath);
  assertAllowedFields(footprintRecord, fieldPath, footprintFields, [], true);

  return {
    width: readPositiveSafeInteger(footprintRecord.width, `${fieldPath}.width`),
    height: readPositiveSafeInteger(
      footprintRecord.height,
      `${fieldPath}.height`,
    ),
  };
}

function readPlacementItemLayer(
  rawLayer: unknown,
  fieldPath: string,
): PlacementItemLayer {
  if (
    rawLayer !== "item" &&
    rawLayer !== "path" &&
    rawLayer !== "fence"
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be one of "item", "path", "fence"; received ${describeValue(rawLayer)}.`,
    );
  }

  return rawLayer;
}

function assertPlacementSnapshotAction(
  rawPlacementAction: unknown,
): asserts rawPlacementAction is PlacementSnapshotAction {
  const actionRecord = assertJsonRecord(rawPlacementAction, "action");
  const actionType = actionRecord.type;

  if (typeof actionType !== "string") {
    throw new TypeError(
      `Placement action field "type" must be a string; received ${describeValue(actionType)}.`,
    );
  }

  switch (actionType) {
    case "add-building":
      assertAllowedFields(actionRecord, "action", ["type", "building"], [], true);
      readNewPlacementBuilding(actionRecord.building, "building");
      return;
    case "delete-building":
      assertAllowedFields(actionRecord, "action", ["type", "instanceId"], [], true);
      readPositiveSafeInteger(actionRecord.instanceId, "instanceId");
      return;
    case "replace-building":
      assertAllowedFields(actionRecord, "action", ["type", "building"], [], true);
      readPlacementBuilding(actionRecord.building, "building", true);
      return;
    case "add-crop":
      assertAllowedFields(actionRecord, "action", ["type", "crop"], [], true);
      readPlacementCrop(actionRecord.crop, "crop", true);
      return;
    case "delete-crop":
      assertAllowedFields(actionRecord, "action", ["type", "coordinate"], [], true);
      readActionCoordinate(actionRecord.coordinate, "coordinate");
      return;
    case "replace-crop":
      assertAllowedFields(
        actionRecord,
        "action",
        ["type", "coordinate", "crop"],
        [],
        true,
      );
      readActionCoordinate(actionRecord.coordinate, "coordinate");
      readPlacementCrop(actionRecord.crop, "crop", true);
      return;
    case "add-item":
      assertAllowedFields(actionRecord, "action", ["type", "item"], [], true);
      readNewPlacementItem(actionRecord.item, "item");
      return;
    case "delete-item":
      assertAllowedFields(actionRecord, "action", ["type", "instanceId"], [], true);
      readPositiveSafeInteger(actionRecord.instanceId, "instanceId");
      return;
    case "replace-item":
      assertAllowedFields(actionRecord, "action", ["type", "item"], [], true);
      readPlacementItem(actionRecord.item, "item", true);
      return;
    default:
      throw new TypeError(
        `Placement action field "type" must be one of "add-building", "delete-building", "replace-building", "add-crop", "delete-crop", "replace-crop", "add-item", "delete-item", "replace-item"; received ${describeValue(actionType)}.`,
      );
  }
}

function readActionCoordinate(
  rawCoordinate: unknown,
  fieldPath: string,
): PlacementCoordinate {
  const coordinateRecord = assertJsonRecord(rawCoordinate, fieldPath);

  return readPlacementCoordinate(coordinateRecord, fieldPath, true);
}

function assertCropCoordinateAvailable(
  crops: readonly PlacementCrop[],
  candidateCrop: PlacementCrop,
  ignoredCropIndex: number,
): void {
  const existingCropIndex = crops.findIndex(
    (crop) =>
      crop.x === candidateCrop.x &&
      crop.y === candidateCrop.y &&
      crop !== candidateCrop,
  );

  if (existingCropIndex !== -1 && existingCropIndex !== ignoredCropIndex) {
    throw new Error(
      `Placement snapshot field "crops" must not contain more than one crop at coordinate ${describeValue({ x: candidateCrop.x, y: candidateCrop.y })}; received ${describeValue(crops)}.`,
    );
  }
}

function findCropIndex(
  crops: readonly PlacementCrop[],
  coordinate: PlacementCoordinate,
): number {
  return crops.findIndex(
    (crop) => crop.x === coordinate.x && crop.y === coordinate.y,
  );
}

function assertUniqueIdentifiers<PlacementValue>(
  placementValues: readonly PlacementValue[],
  collectionFieldPath: string,
  getIdentifier: (placementValue: PlacementValue) => number,
): void {
  const identifiers = new Set<number>();

  for (const [index, placementValue] of placementValues.entries()) {
    const identifier = getIdentifier(placementValue);

    if (identifiers.has(identifier)) {
      throw new Error(
        `Placement snapshot field "${collectionFieldPath}[${String(index)}].instanceId" must be unique; received ${describeValue(identifier)}.`,
      );
    }

    identifiers.add(identifier);
  }
}

function assertUniqueCropCoordinates(crops: readonly PlacementCrop[]): void {
  const coordinates = new Set<string>();

  for (const [index, crop] of crops.entries()) {
    const coordinateKey = `${String(crop.x)},${String(crop.y)}`;

    if (coordinates.has(coordinateKey)) {
      throw new Error(
        `Placement snapshot field "crops[${String(index)}]" must have a unique coordinate; received ${describeValue({ x: crop.x, y: crop.y })}.`,
      );
    }

    coordinates.add(coordinateKey);
  }
}

function assertNextIdentifier<PlacementValue>(
  placementValues: readonly PlacementValue[],
  nextIdentifier: number,
  nextIdentifierFieldPath: string,
  collectionFieldPath: string,
): void {
  const highestIdentifier = placementValues.reduce(
    (currentHighestIdentifier, placementValue) =>
      Math.max(currentHighestIdentifier, getPlacementInstanceId(placementValue)),
    Number.NEGATIVE_INFINITY,
  );

  if (nextIdentifier <= highestIdentifier) {
    throw new Error(
      `Placement snapshot field "${nextIdentifierFieldPath}" must be greater than every ${collectionFieldPath} instanceId; received ${describeValue(nextIdentifier)} with highest instanceId ${describeValue(highestIdentifier)}.`,
    );
  }
}

function getPlacementInstanceId(placementValue: unknown): number {
  if (
    typeof placementValue !== "object" ||
    placementValue === null ||
    !("instanceId" in placementValue)
  ) {
    throw new TypeError(
      `Placement snapshot field "instanceId" must be present; received ${describeValue(placementValue)}.`,
    );
  }

  return readPositiveSafeInteger(placementValue.instanceId, "instanceId");
}

function incrementIdentifier(identifier: number, fieldPath: string): number {
  if (identifier === Number.MAX_SAFE_INTEGER) {
    throw new RangeError(
      `Placement snapshot field "${fieldPath}" must be less than ${String(Number.MAX_SAFE_INTEGER)} before adding a placement; received ${describeValue(identifier)}.`,
    );
  }

  return identifier + 1;
}

function assertAllowedFields(
  record: JsonRecord,
  fieldPath: string,
  requiredFieldNames: readonly string[],
  optionalFieldNames: readonly string[],
  rejectUnexpectedFields: boolean,
): void {
  for (const requiredFieldName of requiredFieldNames) {
    if (!hasOwn(record, requiredFieldName)) {
      throw new TypeError(
        `Placement snapshot field "${joinFieldPath(fieldPath, requiredFieldName)}" must be present; received undefined.`,
      );
    }
  }

  if (!rejectUnexpectedFields) {
    return;
  }

  const allowedFieldNames = new Set([
    ...requiredFieldNames,
    ...optionalFieldNames,
  ]);

  for (const fieldName of Object.keys(record)) {
    if (!allowedFieldNames.has(fieldName)) {
      throw new TypeError(
        `Placement snapshot field "${joinFieldPath(fieldPath, fieldName)}" must not be present; received ${describeValue(record[fieldName])}.`,
      );
    }
  }
}

function assertJsonRecord(rawValue: unknown, fieldPath: string): JsonRecord {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue) ||
    !isPlainObject(rawValue)
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a plain object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function isPlainObject(value: object): value is JsonRecord {
  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function readSafeInteger(
  rawValue: unknown,
  fieldPath: string,
  errorPrefix = "Placement snapshot",
): number {
  if (typeof rawValue !== "number" || !Number.isSafeInteger(rawValue)) {
    throw new TypeError(
      `${errorPrefix} field "${fieldPath}" must be a safe integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readPositiveSafeInteger(rawValue: unknown, fieldPath: string): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue <= 0
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a positive safe integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNonEmptyString(rawValue: unknown, fieldPath: string): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readCanonicalTintColor(rawValue: unknown, fieldPath: string): string {
  if (
    typeof rawValue !== "string" ||
    !/^#[0-9a-f]{6}$/.test(rawValue)
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a canonical lowercase #rrggbb color; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNullableString(rawValue: unknown, fieldPath: string): string | null {
  if (rawValue === null) {
    return null;
  }

  return readNonEmptyString(rawValue, fieldPath);
}

function readBoolean(rawValue: unknown, fieldPath: string): boolean {
  if (typeof rawValue !== "boolean") {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a boolean; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function clonePlacementSnapshot(
  placementSnapshot: PlacementSnapshot,
): PlacementSnapshot {
  return {
    buildings: placementSnapshot.buildings.map((building) => ({ ...building })),
    crops: placementSnapshot.crops.map((crop) => ({ ...crop })),
    items: placementSnapshot.items.map(clonePlacementItem),
    nextBuildingId: placementSnapshot.nextBuildingId,
    nextItemId: placementSnapshot.nextItemId,
    ...(placementSnapshot.interiorDecor === undefined
      ? {}
      : { interiorDecor: restoreInteriorDecorState(placementSnapshot.interiorDecor) }),
  };
}

function clonePlacementItem(placementItem: PlacementItem): PlacementItem {
  return {
    ...placementItem,
    footprint: { ...placementItem.footprint },
  };
}

function hasOwn(record: JsonRecord, fieldName: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, fieldName);
}

function joinFieldPath(parentFieldPath: string, childFieldName: string): string {
  return parentFieldPath.length === 0
    ? childFieldName
    : `${parentFieldPath}.${childFieldName}`;
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
