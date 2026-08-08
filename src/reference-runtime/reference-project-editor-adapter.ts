import {
  createPersistentPlacementSnapshot,
  type PlacementBuilding,
  type PlacementCrop,
  type PlacementHeldItem,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import {
  assertPlacementBedType,
  type PlacementBedType,
} from "../placement/bed-placement-semantics";
import { isLockedFurnitureFireCatalogItemId } from "../catalog/furniture-fire-definitions";
import {
  restoreInteriorDecorState,
  type InteriorDecorState,
} from "../interior-decor/interior-decor-state";
import type {
  ReferenceJsonValue,
  ReferenceProjectMap,
} from "./local-project-api";

export type ReferenceOpenMapSession = Readonly<{
  projectId: string;
  mapId: string;
  sourceMap: ReferenceProjectMap;
  placementSnapshot: PlacementSnapshot;
  season: ReferenceProjectMap["season"];
  interiorDecor: InteriorDecorState;
  buildingCanonicalToTransientIds: ReadonlyMap<string, number>;
  itemCanonicalToTransientIds: ReadonlyMap<string, number>;
  sourceItemCanonicalOrder: readonly string[];
  sourceItemEnvelopesByCanonicalId: ReadonlyMap<string, ReferenceRecord>;
  sourceHeldItemCanonicalIdByParentCanonicalId: ReadonlyMap<string, string>;
  originalNextBuildingId: number;
  originalNextItemId: number;
}>;

export type ReferenceOpenMapEdits = Readonly<{
  placementSnapshot?: PlacementSnapshot;
  season?: ReferenceProjectMap["season"];
  interiorDecor?: InteriorDecorState;
  renovations?: readonly ReferenceJsonValue[];
}>;

type ReferenceRecord = Readonly<Record<string, ReferenceJsonValue>>;

type NormalizedReferenceOpenMapEdits = Readonly<{
  placementSnapshot: PlacementSnapshot;
  season: ReferenceProjectMap["season"];
  interiorDecor: InteriorDecorState;
  renovations: ReferenceJsonValue[];
}>;

type ResolvedReferenceHeldItemRelations = Readonly<{
  childCanonicalIds: ReadonlySet<string>;
  childCanonicalIdByParentCanonicalId: ReadonlyMap<string, string>;
}>;

type EditedReferenceItemEntry = Readonly<{
  item: PlacementItem | PlacementHeldItem;
  heldItemCanonicalIdentifier?: string;
}>;

export function createReferenceOpenMapSession(
  projectId: string,
  sourceMap: ReferenceProjectMap,
): ReferenceOpenMapSession {
  try {
    return projectReferenceOpenMapSession(projectId, sourceMap);
  } catch (caughtError) {
    if (!(caughtError instanceof Error)) {
      throw caughtError;
    }

    throw new TypeError(
      `Reference project ${JSON.stringify(projectId)} map ${JSON.stringify(sourceMap.id)} cannot be opened: ${createSourceFieldErrorMessage(caughtError.message)}`,
      { cause: caughtError },
    );
  }
}

function projectReferenceOpenMapSession(
  projectId: string,
  sourceMap: ReferenceProjectMap,
): ReferenceOpenMapSession {
  const buildingEnvelopes = readReferenceRecordArray(
    sourceMap.state.buildings,
    "state.buildings",
  );
  const itemEnvelopes = readReferenceRecordArray(
    sourceMap.state.items,
    "state.items",
  );
  const cropEnvelopes = readReferenceRecordArray(
    sourceMap.state.crops,
    "state.crops",
  );
  const sourceItemEnvelopesByCanonicalId = createEnvelopeByCanonicalId(
    itemEnvelopes,
    "state.items",
  );
  const sourceItemCanonicalOrder = itemEnvelopes.map((itemEnvelope, itemIndex) =>
    readNonEmptyString(
      itemEnvelope.instanceId,
      `state.items[${String(itemIndex)}].instanceId`,
    ),
  );
  const resolvedHeldItemRelations = analyzeResolvedReferenceHeldItemRelations(
    itemEnvelopes,
    sourceItemEnvelopesByCanonicalId,
    sourceItemCanonicalOrder,
  );
  const buildingCanonicalToTransientIds = createTransientIdentifierMap(
    buildingEnvelopes,
    "b",
    "state.buildings",
  );
  const itemCanonicalToTransientIds = createTransientIdentifierMap(
    itemEnvelopes,
    "i",
    "state.items",
  );
  const interiorDecor = restoreInteriorDecorState(sourceMap.decor);
  const placementSnapshot = createPersistentPlacementSnapshot({
    buildings: buildingEnvelopes.map((buildingEnvelope, buildingIndex) =>
      projectReferenceBuilding(
        buildingEnvelope,
        buildingCanonicalToTransientIds,
        buildingIndex,
      ),
    ),
    crops: cropEnvelopes.map(projectReferenceCrop),
    items: projectReferenceItems(
      itemEnvelopes,
      itemCanonicalToTransientIds,
      resolvedHeldItemRelations,
    ),
    nextBuildingId: createNextTransientIdentifier(
      buildingCanonicalToTransientIds,
    ),
    nextItemId: createNextTransientIdentifier(itemCanonicalToTransientIds),
    interiorDecor,
  });

  return {
    projectId,
    mapId: sourceMap.id,
    sourceMap: structuredClone(sourceMap),
    placementSnapshot,
    season: sourceMap.season,
    interiorDecor,
    buildingCanonicalToTransientIds,
    itemCanonicalToTransientIds,
    sourceItemCanonicalOrder,
    sourceItemEnvelopesByCanonicalId: new Map(
      [...sourceItemEnvelopesByCanonicalId].map(
        ([canonicalIdentifier, itemEnvelope]) => [
          canonicalIdentifier,
          structuredClone(itemEnvelope),
        ],
      ),
    ),
    sourceHeldItemCanonicalIdByParentCanonicalId: new Map(
      resolvedHeldItemRelations.childCanonicalIdByParentCanonicalId,
    ),
    originalNextBuildingId: readPositiveSafeInteger(
      sourceMap.state.nextBuildingId,
      "state.nextBuildingId",
    ),
    originalNextItemId: readPositiveSafeInteger(
      sourceMap.state.nextItemId,
      "state.nextItemId",
    ),
  };
}

function analyzeResolvedReferenceHeldItemRelations(
  itemEnvelopes: readonly ReferenceRecord[],
  itemEnvelopeByCanonicalId: ReadonlyMap<string, ReferenceRecord>,
  sourceItemCanonicalOrder: readonly string[],
): ResolvedReferenceHeldItemRelations {
  const childCanonicalIdByParentCanonicalId = new Map<string, string>();
  const parentCanonicalIdsByChildCanonicalId = new Map<string, string[]>();

  for (let itemIndex = 0; itemIndex < itemEnvelopes.length; itemIndex += 1) {
    const parentEnvelope = itemEnvelopes[itemIndex]!;
    if (!Object.hasOwn(parentEnvelope, "heldItemId")) {
      continue;
    }
    const parentCanonicalIdentifier = sourceItemCanonicalOrder[itemIndex]!;
    const childCanonicalIdentifier = readNonEmptyString(
      parentEnvelope.heldItemId,
      `state.items[${String(itemIndex)}].heldItemId`,
    );
    if (!itemEnvelopeByCanonicalId.has(childCanonicalIdentifier)) {
      continue;
    }
    if (parentCanonicalIdentifier === childCanonicalIdentifier) {
      throw new TypeError(
        `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} must not be self-referential; received ${JSON.stringify(parentEnvelope.heldItemId)}.`,
      );
    }

    childCanonicalIdByParentCanonicalId.set(
      parentCanonicalIdentifier,
      childCanonicalIdentifier,
    );
    const parentCanonicalIdentifiers =
      parentCanonicalIdsByChildCanonicalId.get(childCanonicalIdentifier) ?? [];
    parentCanonicalIdentifiers.push(parentCanonicalIdentifier);
    parentCanonicalIdsByChildCanonicalId.set(
      childCanonicalIdentifier,
      parentCanonicalIdentifiers,
    );
  }

  assertResolvedReferenceHeldItemRelationsAcyclic(
    childCanonicalIdByParentCanonicalId,
    sourceItemCanonicalOrder,
  );

  for (const [childCanonicalIdentifier, parentCanonicalIdentifiers] of
    parentCanonicalIdsByChildCanonicalId) {
    if (parentCanonicalIdentifiers.length > 1) {
      throw new TypeError(
        `Reference held-item child ${JSON.stringify(childCanonicalIdentifier)} must not have multiple parents ${JSON.stringify(parentCanonicalIdentifiers)}; received ${JSON.stringify(childCanonicalIdentifier)}.`,
      );
    }
  }

  for (const [parentCanonicalIdentifier, childCanonicalIdentifier] of
    childCanonicalIdByParentCanonicalId) {
    const parentEnvelope = itemEnvelopeByCanonicalId.get(parentCanonicalIdentifier)!;
    const childEnvelope = itemEnvelopeByCanonicalId.get(childCanonicalIdentifier)!;
    assertResolvedReferenceHeldItemRelation(
      parentCanonicalIdentifier,
      parentEnvelope,
      childCanonicalIdentifier,
      childEnvelope,
    );
  }

  return {
    childCanonicalIds: new Set(parentCanonicalIdsByChildCanonicalId.keys()),
    childCanonicalIdByParentCanonicalId,
  };
}

function assertResolvedReferenceHeldItemRelationsAcyclic(
  childCanonicalIdByParentCanonicalId: ReadonlyMap<string, string>,
  sourceItemCanonicalOrder: readonly string[],
): void {
  for (const firstCanonicalIdentifier of sourceItemCanonicalOrder) {
    const relationPath: string[] = [];
    const relationPathIndexByCanonicalId = new Map<string, number>();
    let currentCanonicalIdentifier: string | undefined = firstCanonicalIdentifier;

    while (currentCanonicalIdentifier !== undefined) {
      const repeatedPathIndex = relationPathIndexByCanonicalId.get(
        currentCanonicalIdentifier,
      );
      if (repeatedPathIndex !== undefined) {
        const cycleCanonicalIdentifiers = [
          ...relationPath.slice(repeatedPathIndex),
          currentCanonicalIdentifier,
        ];
        throw new TypeError(
          `Reference held-item relation cycle must not exist; received ${JSON.stringify(cycleCanonicalIdentifiers)}.`,
        );
      }
      relationPathIndexByCanonicalId.set(
        currentCanonicalIdentifier,
        relationPath.length,
      );
      relationPath.push(currentCanonicalIdentifier);
      currentCanonicalIdentifier =
        childCanonicalIdByParentCanonicalId.get(currentCanonicalIdentifier);
    }
  }
}

function assertResolvedReferenceHeldItemRelation(
  parentCanonicalIdentifier: string,
  parentEnvelope: ReferenceRecord,
  childCanonicalIdentifier: string,
  childEnvelope: ReferenceRecord,
): void {
  if (parentEnvelope.isTable !== true && parentEnvelope.isLongTable !== true) {
    throw new TypeError(
      `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} requires table metadata; received isTable ${describeValue(parentEnvelope.isTable)} and isLongTable ${describeValue(parentEnvelope.isLongTable)}.`,
    );
  }
  if (
    typeof childEnvelope.itemId !== "string" ||
    !childEnvelope.itemId.startsWith("furniture_")
  ) {
    throw new TypeError(
      `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} requires child itemId prefix "furniture_"; received ${describeValue(childEnvelope.itemId)}.`,
    );
  }
  if (childEnvelope.layer !== "item") {
    throw new TypeError(
      `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} requires child layer "item"; received ${describeValue(childEnvelope.layer)}.`,
    );
  }
  const childFootprint = readReferenceRecord(
    childEnvelope.footprint,
    `held-item child ${JSON.stringify(childCanonicalIdentifier)} footprint`,
  );
  if (childFootprint.w !== 1 || childFootprint.h !== 1) {
    throw new TypeError(
      `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} requires child footprint 1x1; received ${describeValue(childEnvelope.footprint)}.`,
    );
  }
  if (Object.hasOwn(childEnvelope, "heldItemId")) {
    throw new TypeError(
      `Reference held-item relation parent ${JSON.stringify(parentCanonicalIdentifier)} and child ${JSON.stringify(childCanonicalIdentifier)} forbids a secondary child heldItemId relation; received ${describeValue(childEnvelope.heldItemId)}.`,
    );
  }
}

function projectReferenceItems(
  itemEnvelopes: readonly ReferenceRecord[],
  canonicalToTransientIdentifiers: ReadonlyMap<string, number>,
  resolvedHeldItemRelations: ResolvedReferenceHeldItemRelations,
): PlacementItem[] {
  const itemEnvelopeByCanonicalId = createEnvelopeByCanonicalId(
    itemEnvelopes,
    "state.items",
  );

  return itemEnvelopes.flatMap((itemEnvelope, itemIndex) => {
    const parentCanonicalIdentifier = readNonEmptyString(
      itemEnvelope.instanceId,
      `state.items[${String(itemIndex)}].instanceId`,
    );
    if (resolvedHeldItemRelations.childCanonicalIds.has(parentCanonicalIdentifier)) {
      return [];
    }
    const projectedParent = projectReferenceItem(
      itemEnvelope,
      canonicalToTransientIdentifiers,
      itemIndex,
    );
    const childCanonicalIdentifier =
      resolvedHeldItemRelations.childCanonicalIdByParentCanonicalId.get(
        parentCanonicalIdentifier,
      );
    if (childCanonicalIdentifier === undefined) {
      return [projectedParent];
    }
    const childEnvelope = itemEnvelopeByCanonicalId.get(childCanonicalIdentifier)!;
    const childIndex = itemEnvelopes.indexOf(childEnvelope);
    const projectedChild = projectReferenceItem(
      childEnvelope,
      canonicalToTransientIdentifiers,
      childIndex,
    );
    const { heldItemId: _resolvedCanonicalIdentifier, ...parentWithoutPointer } =
      projectedParent;

    return [{
      ...parentWithoutPointer,
      heldItem: projectedChild as PlacementHeldItem,
    }];
  });
}

function createSourceFieldErrorMessage(validationMessage: string): string {
  return validationMessage
    .replace('field "interiorDecor.', 'field "decor.')
    .replace('field "buildings[', 'field "state.buildings[')
    .replace('field "crops[', 'field "state.crops[')
    .replace('field "items[', 'field "state.items[')
    .replace('field "nextBuildingId"', 'field "state.nextBuildingId"')
    .replace('field "nextItemId"', 'field "state.nextItemId"');
}

export function applyReferenceOpenMapEdits(
  session: ReferenceOpenMapSession,
  edits: ReferenceOpenMapEdits,
): ReferenceProjectMap {
  assertReferenceOpenMapEditsContainer(session, edits);
  if (Object.keys(edits).length === 0) {
    return structuredClone(session.sourceMap);
  }

  const savedMap = structuredClone(session.sourceMap);
  const normalizedEdits = normalizeReferenceOpenMapEdits(session, edits);
  const savedBuildingState = mergeReferenceBuildings(
    session,
    normalizedEdits.placementSnapshot,
  );
  const savedItemState = mergeReferenceItems(
    session,
    normalizedEdits.placementSnapshot,
  );

  savedMap.season = normalizedEdits.season;
  savedMap.state = {
    ...savedMap.state,
    buildings: savedBuildingState.entries,
    crops: mergeReferenceCrops(session, normalizedEdits.placementSnapshot),
    items: savedItemState.entries,
    nextBuildingId: savedBuildingState.nextCanonicalIdentifier,
    nextItemId: savedItemState.nextCanonicalIdentifier,
  };
  savedMap.decor = {
    wallpapers: { ...normalizedEdits.interiorDecor.wallpapers },
    floors: { ...normalizedEdits.interiorDecor.floors },
  };
  savedMap.renovations = normalizedEdits.renovations;

  return savedMap;
}

function assertReferenceOpenMapEditsContainer(
  session: ReferenceOpenMapSession,
  receivedEdits: unknown,
): asserts receivedEdits is ReferenceOpenMapEdits {
  if (!isReferencePlainObject(receivedEdits)) {
    throw new TypeError(
      `Reference project ${JSON.stringify(session.projectId)} map ${JSON.stringify(session.mapId)} cannot apply edits: field "edits" must be a plain non-array object; received ${describeValue(receivedEdits)}.`,
    );
  }
}

function normalizeReferenceOpenMapEdits(
  session: ReferenceOpenMapSession,
  edits: ReferenceOpenMapEdits,
): NormalizedReferenceOpenMapEdits {
  assertAllowedEditFields(edits);
  const rawEdits = edits as Readonly<Record<string, unknown>>;
  const placementSnapshot = Object.hasOwn(edits, "placementSnapshot")
    ? restoreReferenceSavePlacementSnapshot(
        session,
        rawEdits.placementSnapshot,
      )
    : session.placementSnapshot;
  const rawInteriorDecor = Object.hasOwn(edits, "interiorDecor")
    ? rawEdits.interiorDecor
    : placementSnapshot.interiorDecor ?? session.interiorDecor;

  return {
    placementSnapshot,
    season: Object.hasOwn(edits, "season")
      ? validateReferenceSaveSeason(session, rawEdits.season)
      : session.season,
    interiorDecor: restoreReferenceSaveInteriorDecor(
      session,
      rawInteriorDecor,
    ),
    renovations: Object.hasOwn(edits, "renovations")
      ? validateReferenceSaveRenovations(session, rawEdits.renovations)
      : structuredClone(session.sourceMap.renovations),
  };
}

function restoreReferenceSavePlacementSnapshot(
  session: ReferenceOpenMapSession,
  rawPlacementSnapshot: unknown,
): PlacementSnapshot {
  try {
    return createPersistentPlacementSnapshot(
      rawPlacementSnapshot as PlacementSnapshot,
    );
  } catch (caughtError) {
    if (!(caughtError instanceof Error)) {
      throw caughtError;
    }

    throw new TypeError(
      `Reference project ${JSON.stringify(session.projectId)} map ${JSON.stringify(session.mapId)} cannot apply edits: ${createSourceFieldErrorMessage(caughtError.message)}`,
      { cause: caughtError },
    );
  }
}

function validateReferenceSaveSeason(
  session: ReferenceOpenMapSession,
  rawSeason: unknown,
): ReferenceProjectMap["season"] {
  if (
    rawSeason !== "spring" &&
    rawSeason !== "summer" &&
    rawSeason !== "fall" &&
    rawSeason !== "winter"
  ) {
    throw new TypeError(
      `Reference project ${JSON.stringify(session.projectId)} map ${JSON.stringify(session.mapId)} cannot apply edits: field "season" must be one of "spring", "summer", "fall", or "winter"; received ${describeValue(rawSeason)}.`,
    );
  }

  return rawSeason;
}

function validateReferenceSaveRenovations(
  session: ReferenceOpenMapSession,
  rawRenovations: unknown,
): ReferenceJsonValue[] {
  try {
    return cloneReferenceRenovations(rawRenovations);
  } catch (caughtError) {
    if (!(caughtError instanceof Error)) {
      throw caughtError;
    }

    throw new TypeError(
      `Reference project ${JSON.stringify(session.projectId)} map ${JSON.stringify(session.mapId)} cannot apply edits: ${caughtError.message}`,
      { cause: caughtError },
    );
  }
}

function cloneReferenceRenovations(
  rawRenovations: unknown,
): ReferenceJsonValue[] {
  if (!Array.isArray(rawRenovations)) {
    throw new TypeError(
      `field "renovations" must be an array; received ${describeValue(rawRenovations)}.`,
    );
  }

  const clonedRenovations = cloneReferenceJsonValue(
    rawRenovations,
    "renovations",
    new WeakSet(),
  );
  if (!Array.isArray(clonedRenovations)) {
    throw new TypeError(
      `field "renovations" must clone to an array; received ${describeValue(clonedRenovations)}.`,
    );
  }

  return JSON.parse(
    JSON.stringify(clonedRenovations),
  ) as ReferenceJsonValue[];
}

function cloneReferenceJsonValue(
  rawValue: unknown,
  fieldPath: string,
  ancestorObjects: WeakSet<object>,
): ReferenceJsonValue {
  if (
    rawValue === null ||
    typeof rawValue === "string" ||
    typeof rawValue === "boolean"
  ) {
    return rawValue;
  }

  if (typeof rawValue === "number") {
    if (!Number.isFinite(rawValue)) {
      throw new TypeError(
        `field ${JSON.stringify(fieldPath)} must not contain a non-finite number; received ${describeValue(rawValue)}.`,
      );
    }

    return rawValue;
  }

  if (Array.isArray(rawValue)) {
    if (ancestorObjects.has(rawValue)) {
      throw new TypeError(
        `field ${JSON.stringify(fieldPath)} must not contain a circular array; received ${describeValue(rawValue)}.`,
      );
    }
    ancestorObjects.add(rawValue);
    const clonedArray = rawValue.map((arrayValue, arrayIndex) =>
      cloneReferenceJsonValue(
        arrayValue,
        `${fieldPath}[${String(arrayIndex)}]`,
        ancestorObjects,
      ),
    );
    ancestorObjects.delete(rawValue);
    return clonedArray;
  }

  if (isReferencePlainObject(rawValue)) {
    if (ancestorObjects.has(rawValue)) {
      throw new TypeError(
        `field ${JSON.stringify(fieldPath)} must not contain a circular object; received ${describeValue(rawValue)}.`,
      );
    }
    ancestorObjects.add(rawValue);
    const clonedObject: Record<string, ReferenceJsonValue> = {};
    for (const [propertyName, propertyValue] of Object.entries(rawValue)) {
      if (
        propertyName === "__proto__" ||
        propertyName === "constructor" ||
        propertyName === "prototype"
      ) {
        throw new TypeError(
          `field ${JSON.stringify(fieldPath)} must not contain unsafe property ${JSON.stringify(propertyName)}; received ${describeValue(rawValue)}.`,
        );
      }
      clonedObject[propertyName] = cloneReferenceJsonValue(
        propertyValue,
        `${fieldPath}.${propertyName}`,
        ancestorObjects,
      );
    }
    ancestorObjects.delete(rawValue);
    return clonedObject;
  }

  throw new TypeError(
    `field ${JSON.stringify(fieldPath)} must contain JSON-safe values only; received ${describeValue(rawValue)}.`,
  );
}

function isReferencePlainObject(
  rawValue: unknown,
): rawValue is Record<string, unknown> {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue)
  ) {
    return false;
  }

  const objectPrototype = Object.getPrototypeOf(rawValue);
  return objectPrototype === Object.prototype || objectPrototype === null;
}

function restoreReferenceSaveInteriorDecor(
  session: ReferenceOpenMapSession,
  rawInteriorDecor: unknown,
): InteriorDecorState {
  try {
    return restoreInteriorDecorState(rawInteriorDecor);
  } catch (caughtError) {
    if (!(caughtError instanceof Error)) {
      throw caughtError;
    }

    throw new TypeError(
      `Reference project ${JSON.stringify(session.projectId)} map ${JSON.stringify(session.mapId)} cannot apply edits: ${createSourceFieldErrorMessage(caughtError.message)}`,
      { cause: caughtError },
    );
  }
}

function assertAllowedEditFields(edits: ReferenceOpenMapEdits): void {
  const allowedEditFields = new Set([
    "placementSnapshot",
    "season",
    "interiorDecor",
    "renovations",
  ]);
  for (const editField of Object.keys(edits)) {
    if (!allowedEditFields.has(editField)) {
      throw new TypeError(
        `Reference open-map edits field ${JSON.stringify(editField)} is not supported; received ${describeValue((edits as Readonly<Record<string, unknown>>)[editField])}.`,
      );
    }
  }
}

type MergedReferenceEntries = Readonly<{
  entries: ReferenceJsonValue[];
  nextCanonicalIdentifier: number;
}>;

function mergeReferenceBuildings(
  session: ReferenceOpenMapSession,
  editedPlacementSnapshot: PlacementSnapshot,
): MergedReferenceEntries {
  const sourceBuildingEnvelopes = readReferenceRecordArray(
    session.sourceMap.state.buildings,
    "state.buildings",
  );
  const sourceBuildingEnvelopeByCanonicalId = createEnvelopeByCanonicalId(
    sourceBuildingEnvelopes,
    "state.buildings",
  );
  const canonicalIdByTransientId = invertIdentifierMap(
    session.buildingCanonicalToTransientIds,
  );
  const originalBuildingByTransientId = new Map(
    session.placementSnapshot.buildings.map((building) => [
      building.instanceId,
      building,
    ]),
  );
  const occupiedCanonicalIds = new Set(
    sourceBuildingEnvelopeByCanonicalId.keys(),
  );
  let nextCanonicalIdentifier = session.originalNextBuildingId;
  const entries = editedPlacementSnapshot.buildings.map((editedBuilding) => {
    const originalCanonicalId = canonicalIdByTransientId.get(
      editedBuilding.instanceId,
    );
    if (originalCanonicalId !== undefined) {
      const sourceBuildingEnvelope = sourceBuildingEnvelopeByCanonicalId.get(
        originalCanonicalId,
      );
      if (sourceBuildingEnvelope === undefined) {
        throw new Error(
          `Reference open-map session building mapping points to missing canonical ID ${JSON.stringify(originalCanonicalId)}.`,
        );
      }

      return mergeReferenceBuildingEnvelope(
        sourceBuildingEnvelope,
        originalCanonicalId,
        editedBuilding,
        originalBuildingByTransientId.get(editedBuilding.instanceId),
      );
    }

    const allocatedIdentifier = allocateCanonicalIdentifier(
      "b",
      nextCanonicalIdentifier,
      occupiedCanonicalIds,
      "state.nextBuildingId",
    );
    nextCanonicalIdentifier = allocatedIdentifier.nextCanonicalIdentifier;
    occupiedCanonicalIds.add(allocatedIdentifier.canonicalIdentifier);
    return mergeReferenceBuildingEnvelope(
      {},
      allocatedIdentifier.canonicalIdentifier,
      editedBuilding,
      undefined,
    );
  });

  return { entries, nextCanonicalIdentifier };
}

function mergeReferenceBuildingEnvelope(
  sourceBuildingEnvelope: ReferenceRecord,
  canonicalIdentifier: string,
  editedBuilding: PlacementBuilding,
  originalBuilding: PlacementBuilding | undefined,
): ReferenceRecord {
  const mergedBuildingEnvelope: Record<string, ReferenceJsonValue> = {
    ...structuredClone(sourceBuildingEnvelope),
    instanceId: canonicalIdentifier,
    buildingId: editedBuilding.buildingId,
    x: editedBuilding.x,
    y: editedBuilding.y,
  };

  if (editedBuilding.paintColors === undefined) {
    delete mergedBuildingEnvelope.paintColor;
  } else if (
    originalBuilding?.paintColors === undefined ||
    !areBuildingPaintColorsEqual(
      originalBuilding.paintColors,
      editedBuilding.paintColors,
    )
  ) {
    mergedBuildingEnvelope.paintColor = mergeReferenceBuildingPaint(
      sourceBuildingEnvelope.paintColor,
      originalBuilding?.paintColors,
      editedBuilding.paintColors,
    );
  }
  mergeOptionalReferenceBuildingNumber(
    mergedBuildingEnvelope,
    "variant",
    originalBuilding?.variant,
    editedBuilding.variant,
  );
  mergeOptionalReferenceBuildingNumber(
    mergedBuildingEnvelope,
    "waterColor",
    originalBuilding?.waterColor,
    editedBuilding.waterColor,
  );

  return mergedBuildingEnvelope;
}

function mergeOptionalReferenceBuildingNumber(
  mergedBuildingEnvelope: Record<string, ReferenceJsonValue>,
  fieldName: "variant" | "waterColor",
  originalValue: number | undefined,
  editedValue: number | undefined,
): void {
  if (editedValue !== undefined) {
    mergedBuildingEnvelope[fieldName] = editedValue;
    return;
  }
  if (originalValue !== undefined) {
    delete mergedBuildingEnvelope[fieldName];
  }
}

function mergeReferenceBuildingPaint(
  rawSourcePaintColor: ReferenceJsonValue | undefined,
  originalPaintColors: PlacementBuilding["paintColors"],
  editedPaintColors: NonNullable<PlacementBuilding["paintColors"]>,
): ReferenceRecord {
  const sourcePaintColor =
    rawSourcePaintColor === undefined
      ? undefined
      : readReferenceRecord(rawSourcePaintColor, "state.buildings[].paintColor");

  return {
    ...(sourcePaintColor === undefined
      ? {}
      : structuredClone(sourcePaintColor)),
    color1: mergeReferencePaintChannel(
      sourcePaintColor?.color1,
      originalPaintColors?.color1,
      editedPaintColors.color1,
    ),
    color2: mergeReferencePaintChannel(
      sourcePaintColor?.color2,
      originalPaintColors?.color2,
      editedPaintColors.color2,
    ),
    color3: mergeReferencePaintChannel(
      sourcePaintColor?.color3,
      originalPaintColors?.color3,
      editedPaintColors.color3,
    ),
  };
}

function mergeReferencePaintChannel(
  rawSourcePaintChannel: ReferenceJsonValue | undefined,
  originalHexColor: string | undefined,
  editedHexColor: string,
): ReferenceRecord {
  const sourcePaintChannel =
    rawSourcePaintChannel === undefined
      ? undefined
      : readReferenceRecord(
          rawSourcePaintChannel,
          "state.buildings[].paintColor.color",
        );

  if (
    sourcePaintChannel !== undefined &&
    originalHexColor === editedHexColor
  ) {
    return structuredClone(sourcePaintChannel);
  }

  return {
    ...(sourcePaintChannel === undefined
      ? {}
      : structuredClone(sourcePaintChannel)),
    ...convertHexPaintChannelToHsl(editedHexColor),
  };
}

function areBuildingPaintColorsEqual(
  firstPaintColors: NonNullable<PlacementBuilding["paintColors"]>,
  secondPaintColors: NonNullable<PlacementBuilding["paintColors"]>,
): boolean {
  return (
    firstPaintColors.color1 === secondPaintColors.color1 &&
    firstPaintColors.color2 === secondPaintColors.color2 &&
    firstPaintColors.color3 === secondPaintColors.color3
  );
}

function convertHexPaintChannelToHsl(hexColor: string): ReferenceRecord {
  const red = Number.parseInt(hexColor.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hexColor.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hexColor.slice(5, 7), 16) / 255;
  const maximumChannel = Math.max(red, green, blue);
  const minimumChannel = Math.min(red, green, blue);
  const channelRange = maximumChannel - minimumChannel;
  const lightness = (maximumChannel + minimumChannel) / 2;
  let hue = 0;

  if (channelRange !== 0) {
    if (maximumChannel === red) {
      hue = 60 * (((green - blue) / channelRange) % 6);
    } else if (maximumChannel === green) {
      hue = 60 * ((blue - red) / channelRange + 2);
    } else {
      hue = 60 * ((red - green) / channelRange + 4);
    }
  }
  if (hue < 0) {
    hue += 360;
  }

  const saturation =
    channelRange === 0
      ? 0
      : channelRange / (1 - Math.abs(2 * lightness - 1));

  return {
    hue,
    saturation: saturation * 100,
    lightness: lightness * 100,
  };
}

function mergeReferenceItems(
  session: ReferenceOpenMapSession,
  editedPlacementSnapshot: PlacementSnapshot,
): MergedReferenceEntries {
  const originalCanonicalIdByTransientId = invertIdentifierMap(
    session.itemCanonicalToTransientIds,
  );
  assertEditedReferenceHeldItemRelationships(
    session,
    editedPlacementSnapshot.items,
    originalCanonicalIdByTransientId,
  );
  const canonicalIdByTransientId = new Map(originalCanonicalIdByTransientId);
  const occupiedCanonicalIds = new Set(
    session.sourceItemEnvelopesByCanonicalId.keys(),
  );
  let nextCanonicalIdentifier = session.originalNextItemId;
  const editedItemsInTraversalOrder = editedPlacementSnapshot.items.flatMap(
    (editedItem) => [
      editedItem,
      ...(editedItem.heldItem === undefined ? [] : [editedItem.heldItem]),
    ],
  );

  for (const editedItem of editedItemsInTraversalOrder) {
    if (canonicalIdByTransientId.has(editedItem.instanceId)) {
      continue;
    }
    const allocatedIdentifier = allocateCanonicalIdentifier(
      "i",
      nextCanonicalIdentifier,
      occupiedCanonicalIds,
      "state.nextItemId",
    );
    nextCanonicalIdentifier = allocatedIdentifier.nextCanonicalIdentifier;
    occupiedCanonicalIds.add(allocatedIdentifier.canonicalIdentifier);
    canonicalIdByTransientId.set(
      editedItem.instanceId,
      allocatedIdentifier.canonicalIdentifier,
    );
  }

  const editedEntryByCanonicalIdentifier = new Map<string, EditedReferenceItemEntry>();
  const newCanonicalIdentifiersInTraversalOrder: string[] = [];
  for (const editedItem of editedPlacementSnapshot.items) {
    const parentCanonicalIdentifier = readEditedCanonicalItemIdentifier(
      canonicalIdByTransientId,
      editedItem.instanceId,
    );
    const childCanonicalIdentifier =
      editedItem.heldItem === undefined
        ? undefined
        : readEditedCanonicalItemIdentifier(
            canonicalIdByTransientId,
            editedItem.heldItem.instanceId,
    );
    editedEntryByCanonicalIdentifier.set(parentCanonicalIdentifier, {
      item: editedItem,
      ...(childCanonicalIdentifier === undefined
        ? {}
        : { heldItemCanonicalIdentifier: childCanonicalIdentifier }),
    });
    if (!session.sourceItemEnvelopesByCanonicalId.has(parentCanonicalIdentifier)) {
      newCanonicalIdentifiersInTraversalOrder.push(parentCanonicalIdentifier);
    }

    if (editedItem.heldItem !== undefined && childCanonicalIdentifier !== undefined) {
      editedEntryByCanonicalIdentifier.set(childCanonicalIdentifier, {
        item: editedItem.heldItem,
      });
      if (!session.sourceItemEnvelopesByCanonicalId.has(childCanonicalIdentifier)) {
        newCanonicalIdentifiersInTraversalOrder.push(childCanonicalIdentifier);
      }
    }
  }

  const savedCanonicalOrder = [
    ...session.sourceItemCanonicalOrder.filter((canonicalIdentifier) =>
      editedEntryByCanonicalIdentifier.has(canonicalIdentifier),
    ),
    ...newCanonicalIdentifiersInTraversalOrder,
  ];
  const entries = savedCanonicalOrder.map((canonicalIdentifier) => {
    const editedEntry = editedEntryByCanonicalIdentifier.get(canonicalIdentifier);
    if (editedEntry === undefined) {
      throw new Error(
        `Reference open-map session cannot save missing edited item canonical ID ${JSON.stringify(canonicalIdentifier)}; received ${JSON.stringify(savedCanonicalOrder)}.`,
      );
    }
    const sourceItemEnvelope =
      session.sourceItemEnvelopesByCanonicalId.get(canonicalIdentifier) ?? {};
    const opaqueHeldItemId =
      "heldItemId" in editedEntry.item
        ? editedEntry.item.heldItemId
        : undefined;

    return mergeReferenceItemEnvelope(
      sourceItemEnvelope,
      canonicalIdentifier,
      editedEntry.item,
      editedEntry.heldItemCanonicalIdentifier ?? opaqueHeldItemId,
    );
  });

  return { entries, nextCanonicalIdentifier };
}

function assertEditedReferenceHeldItemRelationships(
  session: ReferenceOpenMapSession,
  editedItems: readonly PlacementItem[],
  originalCanonicalIdByTransientId: ReadonlyMap<number, string>,
): void {
  for (const editedParent of editedItems) {
    const editedChild = editedParent.heldItem;
    if (editedChild === undefined) {
      continue;
    }
    if (!editedChild.itemId.startsWith("furniture_")) {
      throw new TypeError(
        `Reference held-item edit parent transient instanceId ${String(editedParent.instanceId)} and child transient instanceId ${String(editedChild.instanceId)} requires child itemId prefix "furniture_" before canonical ID allocation; received ${JSON.stringify(editedChild.itemId)}.`,
      );
    }
    if (!editedParent.isLongTable) {
      continue;
    }

    const parentCanonicalIdentifier = originalCanonicalIdByTransientId.get(
      editedParent.instanceId,
    );
    const childCanonicalIdentifier = originalCanonicalIdByTransientId.get(
      editedChild.instanceId,
    );
    const originalChildCanonicalIdentifier =
      parentCanonicalIdentifier === undefined
        ? undefined
        : session.sourceHeldItemCanonicalIdByParentCanonicalId.get(
            parentCanonicalIdentifier,
          );
    const originalParentEnvelope =
      parentCanonicalIdentifier === undefined
        ? undefined
        : session.sourceItemEnvelopesByCanonicalId.get(
            parentCanonicalIdentifier,
          );
    const preservesLoadedLongTableRelation =
      parentCanonicalIdentifier !== undefined &&
      childCanonicalIdentifier !== undefined &&
      originalParentEnvelope?.isLongTable === true &&
      originalChildCanonicalIdentifier === childCanonicalIdentifier;
    if (!preservesLoadedLongTableRelation) {
      throw new TypeError(
        `Reference held-item edit parent transient instanceId ${String(editedParent.instanceId)} canonical ${describeOptionalCanonicalIdentifier(parentCanonicalIdentifier)} and child transient instanceId ${String(editedChild.instanceId)} canonical ${describeOptionalCanonicalIdentifier(childCanonicalIdentifier)} cannot create or move a relation onto a long table; received isTable ${String(editedParent.isTable)} and isLongTable ${String(editedParent.isLongTable)}.`,
      );
    }
  }
}

function describeOptionalCanonicalIdentifier(
  canonicalIdentifier: string | undefined,
): string {
  return canonicalIdentifier === undefined
    ? "unknown"
    : JSON.stringify(canonicalIdentifier);
}

function readEditedCanonicalItemIdentifier(
  canonicalIdByTransientId: ReadonlyMap<number, string>,
  transientIdentifier: number,
): string {
  const canonicalIdentifier = canonicalIdByTransientId.get(transientIdentifier);
  if (canonicalIdentifier === undefined) {
    throw new Error(
      `Reference open-map session has no canonical item ID for transient instanceId ${String(transientIdentifier)}; received ${JSON.stringify([...canonicalIdByTransientId])}.`,
    );
  }
  return canonicalIdentifier;
}

function mergeReferenceItemEnvelope(
  sourceItemEnvelope: ReferenceRecord,
  canonicalIdentifier: string,
  editedItem: PlacementItem | PlacementHeldItem,
  savedHeldItemId: string | undefined,
): ReferenceRecord {
  const sourceFootprintEnvelope = Object.hasOwn(
    sourceItemEnvelope,
    "footprint",
  )
    ? readReferenceRecord(sourceItemEnvelope.footprint, "state.items[].footprint")
    : {};
  const mergedItemEnvelope: Record<string, ReferenceJsonValue> = {
    ...structuredClone(sourceItemEnvelope),
    instanceId: canonicalIdentifier,
    itemId: editedItem.itemId,
    x: editedItem.x,
    y: editedItem.y,
    layer: editedItem.layer,
    rotation: editedItem.rotation,
    footprint: {
      ...structuredClone(sourceFootprintEnvelope),
      w: editedItem.footprint.width,
      h: editedItem.footprint.height,
    },
    variant: editedItem.variant,
    tintColor: editedItem.tintColor,
    locked: editedItem.locked,
    isRug: editedItem.isRug,
    isGrass: editedItem.isGrass,
    isTable: editedItem.isTable,
    isLongTable: editedItem.isLongTable,
    flipped: editedItem.flipped,
    bedType: editedItem.bedType,
  };

  if (savedHeldItemId === undefined) {
    delete mergedItemEnvelope.heldItemId;
  } else {
    mergedItemEnvelope.heldItemId = savedHeldItemId;
  }
  if (editedItem.nightLightState === undefined) {
    delete mergedItemEnvelope.nightLightState;
  } else {
    mergedItemEnvelope.nightLightState = editedItem.nightLightState;
  }
  if (editedItem.growthStage === undefined) {
    delete mergedItemEnvelope.growthStage;
  } else {
    mergedItemEnvelope.growthStage = editedItem.growthStage;
  }

  return mergedItemEnvelope;
}

function mergeReferenceCrops(
  session: ReferenceOpenMapSession,
  editedPlacementSnapshot: PlacementSnapshot,
): ReferenceJsonValue[] {
  const sourceCropEnvelopes = readReferenceRecordArray(
    session.sourceMap.state.crops,
    "state.crops",
  );
  const sourceCropEnvelopeByIdentity = new Map(
    sourceCropEnvelopes.map((sourceCropEnvelope) => [
      createCropIdentityKey(
        sourceCropEnvelope.cropId,
        sourceCropEnvelope.x,
        sourceCropEnvelope.y,
      ),
      sourceCropEnvelope,
    ]),
  );

  return editedPlacementSnapshot.crops.map((editedCrop) => ({
    ...structuredClone(
      sourceCropEnvelopeByIdentity.get(
        createCropIdentityKey(editedCrop.cropId, editedCrop.x, editedCrop.y),
      ) ?? {},
    ),
    cropId: editedCrop.cropId,
    x: editedCrop.x,
    y: editedCrop.y,
  }));
}

function createCropIdentityKey(
  rawCropId: ReferenceJsonValue | undefined,
  rawX: ReferenceJsonValue | undefined,
  rawY: ReferenceJsonValue | undefined,
): string {
  return `${String(rawCropId)}:${String(rawX)},${String(rawY)}`;
}

function createEnvelopeByCanonicalId(
  entryEnvelopes: readonly ReferenceRecord[],
  fieldPath: string,
): ReadonlyMap<string, ReferenceRecord> {
  return new Map(
    entryEnvelopes.map((entryEnvelope, entryIndex) => [
      readNonEmptyString(
        entryEnvelope.instanceId,
        `${fieldPath}[${String(entryIndex)}].instanceId`,
      ),
      entryEnvelope,
    ]),
  );
}

function invertIdentifierMap(
  canonicalToTransientIds: ReadonlyMap<string, number>,
): ReadonlyMap<number, string> {
  return new Map(
    [...canonicalToTransientIds].map(([canonicalIdentifier, transientIdentifier]) => [
      transientIdentifier,
      canonicalIdentifier,
    ]),
  );
}

function allocateCanonicalIdentifier(
  identifierPrefix: "b" | "i",
  firstCandidateIdentifier: number,
  occupiedCanonicalIds: ReadonlySet<string>,
  nextIdentifierFieldPath: string,
): Readonly<{
  canonicalIdentifier: string;
  nextCanonicalIdentifier: number;
}> {
  let candidateIdentifier = firstCandidateIdentifier;
  while (occupiedCanonicalIds.has(`${identifierPrefix}${String(candidateIdentifier)}`)) {
    candidateIdentifier = incrementCanonicalIdentifier(
      candidateIdentifier,
      nextIdentifierFieldPath,
    );
  }

  return {
    canonicalIdentifier: `${identifierPrefix}${String(candidateIdentifier)}`,
    nextCanonicalIdentifier: incrementCanonicalIdentifier(
      candidateIdentifier,
      nextIdentifierFieldPath,
    ),
  };
}

function incrementCanonicalIdentifier(
  identifier: number,
  fieldPath: string,
): number {
  if (identifier >= Number.MAX_SAFE_INTEGER) {
    throw new RangeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} cannot allocate after ${String(identifier)}; received ${String(identifier)}.`,
    );
  }

  return identifier + 1;
}

function createTransientIdentifierMap(
  entryEnvelopes: readonly ReferenceRecord[],
  generatedIdentifierPrefix: "b" | "i",
  fieldPath: string,
): ReadonlyMap<string, number> {
  const canonicalIdentifiers = entryEnvelopes.map((entryEnvelope, entryIndex) =>
    readNonEmptyString(
      entryEnvelope.instanceId,
      `${fieldPath}[${String(entryIndex)}].instanceId`,
    ),
  );
  const reservedGeneratedIdentifiers = new Set<number>();

  for (const canonicalIdentifier of canonicalIdentifiers) {
    const generatedIdentifier = readUsableGeneratedIdentifier(
      canonicalIdentifier,
      generatedIdentifierPrefix,
    );
    if (generatedIdentifier !== null) {
      reservedGeneratedIdentifiers.add(generatedIdentifier);
    }
  }

  const occupiedTransientIdentifiers = new Set(reservedGeneratedIdentifiers);
  const canonicalToTransientIdentifiers = new Map<string, number>();

  for (const canonicalIdentifier of canonicalIdentifiers) {
    const generatedIdentifier = readUsableGeneratedIdentifier(
      canonicalIdentifier,
      generatedIdentifierPrefix,
    );
    const transientIdentifier =
      generatedIdentifier ??
      findFirstUnusedPositiveIdentifier(occupiedTransientIdentifiers);
    occupiedTransientIdentifiers.add(transientIdentifier);
    canonicalToTransientIdentifiers.set(canonicalIdentifier, transientIdentifier);
  }

  return canonicalToTransientIdentifiers;
}

function readUsableGeneratedIdentifier(
  canonicalIdentifier: string,
  generatedIdentifierPrefix: "b" | "i",
): number | null {
  const generatedIdentifierMatch = new RegExp(
    `^${generatedIdentifierPrefix}([1-9][0-9]*)$`,
  ).exec(canonicalIdentifier);
  if (generatedIdentifierMatch === null) {
    return null;
  }

  const generatedIdentifier = Number(generatedIdentifierMatch[1]);
  return Number.isSafeInteger(generatedIdentifier) &&
    generatedIdentifier < Number.MAX_SAFE_INTEGER
    ? generatedIdentifier
    : null;
}

function findFirstUnusedPositiveIdentifier(
  occupiedIdentifiers: ReadonlySet<number>,
): number {
  for (
    let candidateIdentifier = 1;
    candidateIdentifier < Number.MAX_SAFE_INTEGER;
    candidateIdentifier += 1
  ) {
    if (!occupiedIdentifiers.has(candidateIdentifier)) {
      return candidateIdentifier;
    }
  }

  throw new RangeError(
    "Reference open-map adapter cannot allocate an unused positive transient identifier.",
  );
}

function createNextTransientIdentifier(
  canonicalToTransientIdentifiers: ReadonlyMap<string, number>,
): number {
  let highestTransientIdentifier = 0;
  for (const transientIdentifier of canonicalToTransientIdentifiers.values()) {
    highestTransientIdentifier = Math.max(
      highestTransientIdentifier,
      transientIdentifier,
    );
  }

  return highestTransientIdentifier + 1;
}

function projectReferenceBuilding(
  buildingEnvelope: ReferenceRecord,
  canonicalToTransientIdentifiers: ReadonlyMap<string, number>,
  buildingIndex: number,
): PlacementBuilding {
  const canonicalIdentifier = readNonEmptyString(
    buildingEnvelope.instanceId,
    `state.buildings[${String(buildingIndex)}].instanceId`,
  );
  const transientIdentifier = canonicalToTransientIdentifiers.get(
    canonicalIdentifier,
  );
  if (transientIdentifier === undefined) {
    throw new Error(
      `Reference open-map adapter has no transient building ID for ${JSON.stringify(canonicalIdentifier)}.`,
    );
  }

  return {
    instanceId: transientIdentifier,
    buildingId: buildingEnvelope.buildingId as string,
    x: buildingEnvelope.x as number,
    y: buildingEnvelope.y as number,
    ...(typeof buildingEnvelope.variant === "number"
      ? { variant: buildingEnvelope.variant }
      : {}),
    ...(typeof buildingEnvelope.waterColor === "number"
      ? { waterColor: buildingEnvelope.waterColor }
      : {}),
    ...(Object.hasOwn(buildingEnvelope, "paintColor")
      ? {
          paintColors: projectReferenceBuildingPaint(
            buildingEnvelope.paintColor,
            `state.buildings[${String(buildingIndex)}].paintColor`,
          ),
        }
      : {}),
  };
}

function projectReferenceCrop(cropEnvelope: ReferenceRecord): PlacementCrop {
  return {
    cropId: cropEnvelope.cropId as string,
    x: cropEnvelope.x as number,
    y: cropEnvelope.y as number,
  };
}

function projectReferenceItem(
  itemEnvelope: ReferenceRecord,
  canonicalToTransientIdentifiers: ReadonlyMap<string, number>,
  itemIndex: number,
): PlacementItem {
  const canonicalIdentifier = readNonEmptyString(
    itemEnvelope.instanceId,
    `state.items[${String(itemIndex)}].instanceId`,
  );
  const transientIdentifier = canonicalToTransientIdentifiers.get(
    canonicalIdentifier,
  );
  if (transientIdentifier === undefined) {
    throw new Error(
      `Reference open-map adapter has no transient item ID for ${JSON.stringify(canonicalIdentifier)}.`,
    );
  }
  const footprint = readReferenceRecord(
    itemEnvelope.footprint,
    `state.items[${String(itemIndex)}].footprint`,
  );
  assertReferenceFurnitureFireState(itemEnvelope, itemIndex);

  return {
    instanceId: transientIdentifier,
    itemId: itemEnvelope.itemId as string,
    x: itemEnvelope.x as number,
    y: itemEnvelope.y as number,
    layer: itemEnvelope.layer as PlacementItem["layer"],
    rotation: itemEnvelope.rotation as number,
    footprint: {
      width: footprint.w as number,
      height: footprint.h as number,
    },
    variant: itemEnvelope.variant as number,
    tintColor: itemEnvelope.tintColor as string,
    locked: itemEnvelope.locked as boolean,
    isRug: itemEnvelope.isRug as boolean,
    isGrass: itemEnvelope.isGrass as boolean,
    isTable: itemEnvelope.isTable as boolean,
    isLongTable: itemEnvelope.isLongTable as boolean,
    flipped: itemEnvelope.flipped as boolean,
    bedType: readReferencePlacementBedType(
      itemEnvelope.bedType,
      `state.items[${String(itemIndex)}].bedType`,
    ),
    ...(Object.hasOwn(itemEnvelope, "growthStage")
      ? { growthStage: itemEnvelope.growthStage as number }
      : {}),
    ...(Object.hasOwn(itemEnvelope, "heldItemId")
      ? { heldItemId: itemEnvelope.heldItemId as string }
      : {}),
    ...(Object.hasOwn(itemEnvelope, "nightLightState")
      ? { nightLightState: itemEnvelope.nightLightState as "off" }
      : {}),
  };
}

function assertReferenceFurnitureFireState(
  itemEnvelope: ReferenceRecord,
  itemIndex: number,
): void {
  if (
    typeof itemEnvelope.itemId !== "string"
    || !isLockedFurnitureFireCatalogItemId(itemEnvelope.itemId)
  ) {
    return;
  }

  if (typeof itemEnvelope.variant !== "number" || !Number.isSafeInteger(itemEnvelope.variant)) {
    throw new TypeError(
      `Furniture fire item ${describeValue(itemEnvelope.itemId)} variant must be a safe integer; received ${describeValue(itemEnvelope.variant)}.`,
    );
  }

  if (!Object.hasOwn(itemEnvelope, "nightLightState")) {
    return;
  }

  if (itemEnvelope.nightLightState !== "off") {
    throw new TypeError(
      `Reference furniture fire state.items[${String(itemIndex)}] item ${describeValue(itemEnvelope.itemId)} nightLightState must equal "off" when present; received ${describeValue(itemEnvelope.nightLightState)}.`,
    );
  }

  if (itemEnvelope.variant !== 1) {
    throw new Error(
      `Furniture fire item ${describeValue(itemEnvelope.itemId)} has conflicting variant ${describeValue(itemEnvelope.variant)} and nightLightState ${describeValue(itemEnvelope.nightLightState)}.`,
    );
  }
}

function readReferencePlacementBedType(
  rawBedType: unknown,
  fieldPath: string,
): PlacementBedType {
  assertPlacementBedType(
    rawBedType,
    `Reference open-map adapter field ${JSON.stringify(fieldPath)}`,
  );
  return rawBedType;
}

function projectReferenceBuildingPaint(
  rawPaintColor: ReferenceJsonValue,
  fieldPath: string,
): PlacementBuilding["paintColors"] {
  const paintColor = readReferenceRecord(rawPaintColor, fieldPath);

  return {
    color1: convertHslPaintChannelToHex(paintColor.color1, `${fieldPath}.color1`),
    color2: convertHslPaintChannelToHex(paintColor.color2, `${fieldPath}.color2`),
    color3: convertHslPaintChannelToHex(paintColor.color3, `${fieldPath}.color3`),
  };
}

function convertHslPaintChannelToHex(
  rawPaintChannel: ReferenceJsonValue,
  fieldPath: string,
): string {
  const paintChannel = readReferenceRecord(rawPaintChannel, fieldPath);
  const hue = readFiniteNumberInRange(paintChannel.hue, 0, 360, `${fieldPath}.hue`);
  const saturation =
    readFiniteNumberInRange(
      paintChannel.saturation,
      0,
      100,
      `${fieldPath}.saturation`,
    ) / 100;
  const lightness =
    readFiniteNumberInRange(
      paintChannel.lightness,
      0,
      100,
      `${fieldPath}.lightness`,
    ) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSegment = hue / 60;
  const secondChannel = chroma * (1 - Math.abs((hueSegment % 2) - 1));
  const [red, green, blue] =
    hueSegment < 1
      ? [chroma, secondChannel, 0]
      : hueSegment < 2
        ? [secondChannel, chroma, 0]
        : hueSegment < 3
          ? [0, chroma, secondChannel]
          : hueSegment < 4
            ? [0, secondChannel, chroma]
            : hueSegment < 5
              ? [secondChannel, 0, chroma]
              : [chroma, 0, secondChannel];
  const lightnessOffset = lightness - chroma / 2;

  return `#${[red, green, blue]
    .map((colorChannel) =>
      Math.round((colorChannel + lightnessOffset) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function readReferenceRecordArray(
  rawEntries: ReferenceJsonValue | undefined,
  fieldPath: string,
): readonly ReferenceRecord[] {
  if (!Array.isArray(rawEntries)) {
    throw new TypeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} must be an array; received ${describeValue(rawEntries)}.`,
    );
  }

  return rawEntries.map((rawEntry, entryIndex) =>
    readReferenceRecord(rawEntry, `${fieldPath}[${String(entryIndex)}]`),
  );
}

function readReferenceRecord(
  rawValue: ReferenceJsonValue | undefined,
  fieldPath: string,
): ReferenceRecord {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue)
  ) {
    throw new TypeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} must be an object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNonEmptyString(
  rawValue: ReferenceJsonValue | undefined,
  fieldPath: string,
): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new TypeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readPositiveSafeInteger(
  rawValue: ReferenceJsonValue | undefined,
  fieldPath: string,
): number {
  if (!Number.isSafeInteger(rawValue) || (rawValue as number) < 1) {
    throw new TypeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} must be a positive safe integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue as number;
}

function readFiniteNumberInRange(
  rawValue: ReferenceJsonValue | undefined,
  minimum: number,
  maximum: number,
  fieldPath: string,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isFinite(rawValue) ||
    rawValue < minimum ||
    rawValue > maximum
  ) {
    throw new TypeError(
      `Reference open-map adapter field ${JSON.stringify(fieldPath)} must be a finite number from ${String(minimum)} through ${String(maximum)}; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (typeof rawValue === "number" && !Number.isFinite(rawValue)) {
    return String(rawValue);
  }

  try {
    const serializedValue = JSON.stringify(rawValue);
    return serializedValue === undefined ? String(rawValue) : serializedValue;
  } catch (serializationError) {
    const serializationMessage =
      serializationError instanceof Error
        ? serializationError.message
        : String(serializationError);
    return `[unserializable value: ${serializationMessage}]`;
  }
}
