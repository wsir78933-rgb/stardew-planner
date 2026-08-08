import {
  restoreInteriorDecorState,
  type InteriorDecorState,
} from "../interior-decor/interior-decor-state";
import {
  isBuildingPaintable,
  validateBuildingPaintColors,
  type BuildingPaintColors,
} from "../paint/building-paint";
import {
  placementBedTypes,
  type PlacementBedType,
} from "./bed-placement-semantics";

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
    variant?: number;
    waterColor?: number;
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
    bedType: PlacementBedType;
    growthStage?: number;
    heldItem?: PlacementHeldItem;
    heldItemId?: string;
    nightLightState?: "off";
  }>;

export type PlacementHeldItem = Readonly<{
  instanceId: number;
  itemId: string;
  x: number;
  y: number;
  layer: "item";
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
  bedType: PlacementBedType;
  growthStage?: number;
  nightLightState?: "off";
}>;

export type NewPlacementItem = Omit<PlacementItem, "instanceId">;
export type NewPlacementHeldItem = Omit<PlacementHeldItem, "instanceId">;

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
    }>
  | Readonly<{
      type: "attach-held-item";
      parentInstanceId: number;
      item: NewPlacementHeldItem;
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
const optionalBuildingFields = [
  "paintColors",
  "variant",
  "waterColor",
] as const;
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
const optionalItemFields = [
  "growthStage",
  "heldItem",
  "heldItemId",
  "nightLightState",
] as const;
const footprintFields = ["width", "height"] as const;
const heldItemFields = [
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
const optionalHeldItemFields = ["growthStage", "nightLightState"] as const;

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
  assertAddItemActionDoesNotContainHeldItem(placementAction);

  const nextSnapshot = createPlacementSnapshotActionResult(
    currentSnapshot,
    placementAction,
  );

  return createPersistentPlacementSnapshot(nextSnapshot);
}

function createPlacementSnapshotActionResult(
  currentSnapshot: PlacementSnapshot,
  placementAction: PlacementSnapshotAction,
): PlacementSnapshot {
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
    case "attach-held-item":
      return attachHeldItem(
        currentSnapshot,
        placementAction.parentInstanceId,
        placementAction.item,
      );
  }
}

function assertAddItemActionDoesNotContainHeldItem(
  placementAction: PlacementSnapshotAction,
): void {
  if (
    placementAction.type !== "add-item" ||
    placementAction.item.heldItem === undefined
  ) {
    return;
  }

  throw new TypeError(
    `Placement action add-item parent instanceId not-yet-allocated must not contain heldItem child instanceId ${String(placementAction.item.heldItem.instanceId)}; received ${describeValue(placementAction.item.heldItem)}.`,
  );
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

  if (itemIndex !== -1) {
    return {
      ...placementSnapshot,
      items: placementSnapshot.items.filter((item) => item.instanceId !== instanceId),
    };
  }

  const parentItemIndex = placementSnapshot.items.findIndex(
    (item) => item.heldItem?.instanceId === instanceId,
  );
  if (parentItemIndex === -1) {
    throw new Error(
      `Placement snapshot field "items" must contain item or held item instanceId ${describeValue(instanceId)}; received ${describeValue(placementSnapshot.items.map((item) => ({ instanceId: item.instanceId, heldItemInstanceId: item.heldItem?.instanceId })))}.`,
    );
  }

  return {
    ...placementSnapshot,
    items: placementSnapshot.items.map((item, index) =>
      index === parentItemIndex
        ? removeHeldItem(item)
        : item,
    ),
  };
}

function removeHeldItem(placementItem: PlacementItem): PlacementItem {
  const nextPlacementItem = { ...placementItem } as PlacementItem & {
    heldItem?: PlacementHeldItem;
  };
  delete nextPlacementItem.heldItem;
  return nextPlacementItem;
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

function attachHeldItem(
  placementSnapshot: PlacementSnapshot,
  parentInstanceId: number,
  newHeldItem: NewPlacementHeldItem,
): PlacementSnapshot {
  const parentItemIndex = placementSnapshot.items.findIndex(
    (placementItem) => placementItem.instanceId === parentInstanceId,
  );
  if (parentItemIndex === -1) {
    throw new Error(
      `Placement attachment parent instanceId ${describeValue(parentInstanceId)} must exist; received ${describeValue(placementSnapshot.items.map((placementItem) => placementItem.instanceId))}.`,
    );
  }

  const parentItem = placementSnapshot.items[parentItemIndex];
  if (parentItem === undefined) {
    throw new Error(
      `Placement attachment parent instanceId ${describeValue(parentInstanceId)} resolved to no item at index ${String(parentItemIndex)}.`,
    );
  }
  if (!parentItem.isTable || parentItem.isLongTable) {
    throw new TypeError(
      `Placement attachment parent instanceId ${String(parentInstanceId)} must be an ordinary table; received isTable ${String(parentItem.isTable)} and isLongTable ${String(parentItem.isLongTable)}.`,
    );
  }
  if (parentItem.heldItem !== undefined || parentItem.heldItemId !== undefined) {
    throw new Error(
      `Placement attachment parent instanceId ${String(parentInstanceId)} must be empty; received heldItem ${describeValue(parentItem.heldItem)} and heldItemId ${describeValue(parentItem.heldItemId)}.`,
    );
  }
  assertNewPlacementHeldItemStructure(newHeldItem, parentInstanceId);

  const childInstanceId = placementSnapshot.nextItemId;
  const heldItem: PlacementHeldItem = {
    ...newHeldItem,
    footprint: { ...newHeldItem.footprint },
    instanceId: childInstanceId,
  };

  return {
    ...placementSnapshot,
    items: placementSnapshot.items.map((placementItem, itemIndex) =>
      itemIndex === parentItemIndex
        ? { ...placementItem, heldItem }
        : placementItem,
    ),
    nextItemId: incrementIdentifier(childInstanceId, "nextItemId"),
  };
}

function assertNewPlacementHeldItemStructure(
  newHeldItem: NewPlacementHeldItem,
  parentInstanceId: number,
): void {
  if (newHeldItem.layer !== "item") {
    throw new TypeError(
      `Placement attachment child for parent instanceId ${String(parentInstanceId)} must use layer "item"; received ${describeValue(newHeldItem.layer)}.`,
    );
  }
  if (
    newHeldItem.footprint.width !== 1
    || newHeldItem.footprint.height !== 1
  ) {
    throw new TypeError(
      `Placement attachment child for parent instanceId ${String(parentInstanceId)} must use footprint 1x1; received ${describeValue(newHeldItem.footprint)}.`,
    );
  }
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
  assertUniqueItemAndHeldItemIdentifiers(items);
  assertUniqueCropCoordinates(crops);
  assertNextIdentifier(buildings, nextBuildingId, "nextBuildingId", "buildings");
  assertNextItemIdentifier(items, nextItemId);

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
  const variant = readOptionalBuildingVariant(
    buildingRecord,
    buildingId,
    fieldPath,
  );
  const waterColor = readOptionalBuildingWaterColor(
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
    ...(variant === undefined ? {} : { variant }),
    ...(waterColor === undefined ? {} : { waterColor }),
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
  const variant = readOptionalBuildingVariant(
    buildingRecord,
    buildingId,
    fieldPath,
  );
  const waterColor = readOptionalBuildingWaterColor(
    buildingRecord,
    buildingId,
    fieldPath,
  );

  return {
    buildingId,
    ...readPlacementCoordinate(buildingRecord, fieldPath, false),
    ...(paintColors === undefined ? {} : { paintColors }),
    ...(variant === undefined ? {} : { variant }),
    ...(waterColor === undefined ? {} : { waterColor }),
  };
}

function readOptionalBuildingVariant(
  buildingRecord: JsonRecord,
  buildingId: string,
  fieldPath: string,
): number | undefined {
  if (!hasOwn(buildingRecord, "variant")) {
    return undefined;
  }
  const variant = buildingRecord.variant;

  if (typeof variant !== "number" || !Number.isSafeInteger(variant)) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}.variant" for building ${describeValue(buildingId)} must be a safe integer; received ${describeValue(variant)}.`,
    );
  }

  return variant;
}

function readOptionalBuildingWaterColor(
  buildingRecord: JsonRecord,
  buildingId: string,
  fieldPath: string,
): number | undefined {
  if (!hasOwn(buildingRecord, "waterColor")) {
    return undefined;
  }
  const waterColor = buildingRecord.waterColor;

  return validatePlacementBuildingWaterColor(
    waterColor,
    buildingId,
    `${fieldPath}.waterColor`,
  );
}

export function validatePlacementBuildingWaterColor(
  waterColor: unknown,
  buildingId: string,
  fieldPath: string,
): number {
  if (
    typeof waterColor !== "number" ||
    !Number.isInteger(waterColor) ||
    waterColor < 0 ||
    waterColor > 0xffffff
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" for building ${describeValue(buildingId)} must be an integer from 0 through 16777215; received ${describeValue(waterColor)}.`,
    );
  }

  return waterColor;
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
  const heldItem = hasOwn(itemRecord, "heldItem")
    ? readPlacementHeldItem(itemRecord.heldItem, `${fieldPath}.heldItem`)
    : undefined;
  const heldItemId = hasOwn(itemRecord, "heldItemId")
    ? readNonEmptyString(itemRecord.heldItemId, `${fieldPath}.heldItemId`)
    : undefined;
  const growthStage = hasOwn(itemRecord, "growthStage")
    ? readNonNegativeSafeInteger(
        itemRecord.growthStage,
        `${fieldPath}.growthStage`,
      )
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
    bedType: readPlacementBedType(itemRecord.bedType, `${fieldPath}.bedType`),
    ...(growthStage === undefined ? {} : { growthStage }),
    ...(heldItem === undefined ? {} : { heldItem }),
    ...(heldItemId === undefined ? {} : { heldItemId }),
    ...(nightLightState === undefined ? {} : { nightLightState }),
  };

  if (heldItem !== undefined && heldItemId !== undefined) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must not contain both heldItem and heldItemId; received ${describeValue({ heldItem, heldItemId })}.`,
    );
  }

  if (heldItem !== undefined) {
    assertStoredPlacementHeldItemParent(itemProperties, fieldPath);
  }

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

function assertStoredPlacementHeldItemParent(
  placementItem: Pick<PlacementItem, "isTable" | "isLongTable">,
  fieldPath: string,
): void {
  if (placementItem.isTable || placementItem.isLongTable) {
    return;
  }

  throw new TypeError(
    `Placement snapshot field "${fieldPath}.heldItem" requires parent table metadata; received isTable ${String(placementItem.isTable)} and isLongTable ${String(placementItem.isLongTable)}.`,
  );
}

function readPlacementHeldItem(
  rawHeldItem: unknown,
  fieldPath: string,
): PlacementHeldItem {
  const heldItemRecord = assertJsonRecord(rawHeldItem, fieldPath);
  assertAllowedFields(
    heldItemRecord,
    fieldPath,
    heldItemFields,
    optionalHeldItemFields,
    true,
  );
  const footprint = readPlacementFootprint(
    heldItemRecord.footprint,
    `${fieldPath}.footprint`,
  );

  if (heldItemRecord.layer !== "item") {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}.layer" must equal "item"; received ${describeValue(heldItemRecord.layer)}.`,
    );
  }
  if (footprint.width !== 1 || footprint.height !== 1) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}.footprint" must equal 1x1; received ${describeValue(footprint)}.`,
    );
  }

  const growthStage = hasOwn(heldItemRecord, "growthStage")
    ? readNonNegativeSafeInteger(heldItemRecord.growthStage, `${fieldPath}.growthStage`)
    : undefined;
  const nightLightState = hasOwn(heldItemRecord, "nightLightState")
    ? readNightLightState(heldItemRecord.nightLightState, `${fieldPath}.nightLightState`)
    : undefined;

  return {
    instanceId: readPositiveSafeInteger(heldItemRecord.instanceId, `${fieldPath}.instanceId`),
    itemId: readNonEmptyString(heldItemRecord.itemId, `${fieldPath}.itemId`),
    x: readSafeInteger(heldItemRecord.x, `${fieldPath}.x`),
    y: readSafeInteger(heldItemRecord.y, `${fieldPath}.y`),
    layer: "item",
    rotation: readSafeInteger(heldItemRecord.rotation, `${fieldPath}.rotation`),
    footprint,
    variant: readSafeInteger(heldItemRecord.variant, `${fieldPath}.variant`),
    tintColor: readCanonicalTintColor(heldItemRecord.tintColor, `${fieldPath}.tintColor`),
    locked: readBoolean(heldItemRecord.locked, `${fieldPath}.locked`),
    isRug: readBoolean(heldItemRecord.isRug, `${fieldPath}.isRug`),
    isGrass: readBoolean(heldItemRecord.isGrass, `${fieldPath}.isGrass`),
    isTable: readBoolean(heldItemRecord.isTable, `${fieldPath}.isTable`),
    isLongTable: readBoolean(heldItemRecord.isLongTable, `${fieldPath}.isLongTable`),
    flipped: readBoolean(heldItemRecord.flipped, `${fieldPath}.flipped`),
    bedType: readPlacementBedType(heldItemRecord.bedType, `${fieldPath}.bedType`),
    ...(growthStage === undefined ? {} : { growthStage }),
    ...(nightLightState === undefined ? {} : { nightLightState }),
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
    case "attach-held-item":
      assertAllowedFields(
        actionRecord,
        "action",
        ["type", "parentInstanceId", "item"],
        [],
        true,
      );
      readPositiveSafeInteger(actionRecord.parentInstanceId, "parentInstanceId");
      assertAttachmentChildHasNoHeldItemFields(actionRecord.item);
      readNewPlacementItem(actionRecord.item, "item");
      return;
    default:
      throw new TypeError(
        `Placement action field "type" must be one of "add-building", "delete-building", "replace-building", "add-crop", "delete-crop", "replace-crop", "add-item", "delete-item", "replace-item", "attach-held-item"; received ${describeValue(actionType)}.`,
      );
  }
}

function assertAttachmentChildHasNoHeldItemFields(rawItem: unknown): void {
  const itemRecord = assertJsonRecord(rawItem, "item");
  if (hasOwn(itemRecord, "heldItem")) {
    throw new TypeError(
      `Placement attachment child heldItem must not be present; received ${describeValue(itemRecord.heldItem)}.`,
    );
  }
  if (hasOwn(itemRecord, "heldItemId")) {
    throw new TypeError(
      `Placement attachment child heldItemId must not be present; received ${describeValue(itemRecord.heldItemId)}.`,
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

function assertUniqueItemAndHeldItemIdentifiers(
  placementItems: readonly PlacementItem[],
): void {
  const identifiers = new Set<number>();

  for (const [itemIndex, placementItem] of placementItems.entries()) {
    assertUniqueItemIdentifier(
      identifiers,
      placementItem.instanceId,
      `items[${String(itemIndex)}].instanceId`,
    );
    if (placementItem.heldItem !== undefined) {
      assertUniqueItemIdentifier(
        identifiers,
        placementItem.heldItem.instanceId,
        `items[${String(itemIndex)}].heldItem.instanceId`,
      );
    }
  }
}

function assertUniqueItemIdentifier(
  identifiers: Set<number>,
  identifier: number,
  fieldPath: string,
): void {
  if (identifiers.has(identifier)) {
    throw new Error(
      `Placement snapshot field "${fieldPath}" must be unique; received ${describeValue(identifier)}. Item and held item identifiers share one namespace.`,
    );
  }

  identifiers.add(identifier);
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

function assertNextItemIdentifier(
  placementItems: readonly PlacementItem[],
  nextItemId: number,
): void {
  const highestIdentifier = placementItems.reduce(
    (currentHighestIdentifier, placementItem) => Math.max(
      currentHighestIdentifier,
      placementItem.instanceId,
      placementItem.heldItem?.instanceId ?? Number.NEGATIVE_INFINITY,
    ),
    Number.NEGATIVE_INFINITY,
  );

  if (nextItemId <= highestIdentifier) {
    throw new Error(
      `Placement snapshot field "nextItemId" must be greater than every items instanceId; received ${describeValue(nextItemId)} with highest instanceId ${describeValue(highestIdentifier)}. Held item instanceIds are included.`,
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

function readNonNegativeSafeInteger(
  rawValue: unknown,
  fieldPath: string,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue < 0
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a non-negative safe integer; received ${describeValue(rawValue)}.`,
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

function readPlacementBedType(
  rawBedType: unknown,
  fieldPath: string,
): PlacementBedType {
  if (rawBedType === null) {
    return null;
  }

  if (
    typeof rawBedType === "string"
    && placementBedTypes.includes(rawBedType as Exclude<PlacementBedType, null>)
  ) {
    return rawBedType as Exclude<PlacementBedType, null>;
  }

  throw new TypeError(
    `Placement snapshot field "${fieldPath}" must be one of "single", "double", or "child", or null; received ${describeValue(rawBedType)}.`,
  );
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
    ...(placementItem.heldItem === undefined
      ? {}
      : {
          heldItem: {
            ...placementItem.heldItem,
            footprint: { ...placementItem.heldItem.footprint },
          },
        }),
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
