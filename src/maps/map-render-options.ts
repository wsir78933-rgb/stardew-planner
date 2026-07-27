import {
  farmhouse2Composite,
  gingerIslandOverlays,
  spouseRoomLayouts,
  type FarmhouseRenovationId,
  type GingerIslandOverlay,
  type SpouseRoomLayout,
} from "./map-catalog";

export type MapRenderOptions = Readonly<{
  gingerIslandOverlayIds: readonly GingerIslandOverlay["id"][];
  farmhouse2: Readonly<{
    marriageMapEnabled: boolean;
    renovationIds: readonly FarmhouseRenovationId[];
    spouseId: SpouseRoomLayout["spouseId"] | null;
  }>;
}>;

const gingerIslandOverlayIds = gingerIslandOverlays.map(
  (gingerIslandOverlay) => gingerIslandOverlay.id,
);
const farmhouseRenovationIds = farmhouse2Composite.renovationApplicationOrder;
const spouseRoomIds = spouseRoomLayouts.map((spouseRoomLayout) => spouseRoomLayout.spouseId);

export function createInitialMapRenderOptions(): MapRenderOptions {
  return {
    gingerIslandOverlayIds: [...gingerIslandOverlayIds],
    farmhouse2: {
      marriageMapEnabled: false,
      renovationIds: [],
      spouseId: null,
    },
  };
}

export function restoreMapRenderOptions(rawMapRenderOptions: unknown): MapRenderOptions {
  if (rawMapRenderOptions === undefined) {
    return createInitialMapRenderOptions();
  }

  const mapRenderOptionsRecord = assertPlainRecord(
    rawMapRenderOptions,
    "Map render options",
  );
  assertExactKeys(
    mapRenderOptionsRecord,
    ["gingerIslandOverlayIds", "farmhouse2"],
    "Map render options",
  );
  const farmhouse2Record = assertPlainRecord(
    mapRenderOptionsRecord.farmhouse2,
    "Map render options.farmhouse2",
  );
  assertExactKeys(
    farmhouse2Record,
    ["marriageMapEnabled", "renovationIds", "spouseId"],
    "Map render options.farmhouse2",
  );

  const mapRenderOptions: MapRenderOptions = {
    gingerIslandOverlayIds: readUniqueAllowedIds(
      mapRenderOptionsRecord.gingerIslandOverlayIds,
      gingerIslandOverlayIds,
      "Map render options.gingerIslandOverlayIds",
    ),
    farmhouse2: {
      marriageMapEnabled: readBoolean(
        farmhouse2Record.marriageMapEnabled,
        "Map render options.farmhouse2.marriageMapEnabled",
      ),
      renovationIds: readUniqueAllowedIds(
        farmhouse2Record.renovationIds,
        farmhouseRenovationIds,
        "Map render options.farmhouse2.renovationIds",
      ),
      spouseId: readNullableAllowedId(
        farmhouse2Record.spouseId,
        spouseRoomIds,
        "Map render options.farmhouse2.spouseId",
      ),
    },
  };

  assertFarmhouse2OptionDependencies(mapRenderOptions);
  return mapRenderOptions;
}

export function toggleGingerIslandOverlay(
  currentMapRenderOptions: MapRenderOptions,
  gingerIslandOverlayId: GingerIslandOverlay["id"],
): MapRenderOptions {
  const restoredMapRenderOptions = restoreMapRenderOptions(currentMapRenderOptions);
  assertAllowedId(
    gingerIslandOverlayId,
    gingerIslandOverlayIds,
    "Ginger Island overlay ID",
  );
  const selectedOverlayIds = new Set(
    restoredMapRenderOptions.gingerIslandOverlayIds,
  );

  if (selectedOverlayIds.has(gingerIslandOverlayId)) {
    selectedOverlayIds.delete(gingerIslandOverlayId);
  } else {
    selectedOverlayIds.add(gingerIslandOverlayId);
  }

  return {
    ...restoredMapRenderOptions,
    gingerIslandOverlayIds: gingerIslandOverlayIds.filter((overlayId) =>
      selectedOverlayIds.has(overlayId),
    ),
  };
}

export function setFarmhouse2MarriageMapEnabled(
  currentMapRenderOptions: MapRenderOptions,
  marriageMapEnabled: boolean,
): MapRenderOptions {
  const restoredMapRenderOptions = restoreMapRenderOptions(currentMapRenderOptions);

  if (typeof marriageMapEnabled !== "boolean") {
    throw new TypeError(
      `Farmhouse 2 marriageMapEnabled must be a boolean; received ${describeValue(marriageMapEnabled)}.`,
    );
  }

  return {
    ...restoredMapRenderOptions,
    farmhouse2: {
      ...restoredMapRenderOptions.farmhouse2,
      marriageMapEnabled,
      spouseId: marriageMapEnabled
        ? restoredMapRenderOptions.farmhouse2.spouseId
        : null,
    },
  };
}

export function setFarmhouse2SpouseId(
  currentMapRenderOptions: MapRenderOptions,
  spouseId: SpouseRoomLayout["spouseId"] | null,
): MapRenderOptions {
  const restoredMapRenderOptions = restoreMapRenderOptions(currentMapRenderOptions);

  if (spouseId !== null) {
    assertAllowedId(spouseId, spouseRoomIds, "Farmhouse 2 spouse ID");

    if (!restoredMapRenderOptions.farmhouse2.marriageMapEnabled) {
      throw new Error(
        `Farmhouse 2 spouse room ${describeValue(spouseId)} requires marriageMapEnabled to be true.`,
      );
    }
  }

  return {
    ...restoredMapRenderOptions,
    farmhouse2: {
      ...restoredMapRenderOptions.farmhouse2,
      spouseId,
    },
  };
}

export function setFarmhouse2RenovationEnabled(
  currentMapRenderOptions: MapRenderOptions,
  renovationId: FarmhouseRenovationId,
  enabled: boolean,
): MapRenderOptions {
  const restoredMapRenderOptions = restoreMapRenderOptions(currentMapRenderOptions);
  assertAllowedId(renovationId, farmhouseRenovationIds, "Farmhouse 2 renovation ID");

  if (typeof enabled !== "boolean") {
    throw new TypeError(
      `Farmhouse 2 renovation ${describeValue(renovationId)} enabled value must be a boolean; received ${describeValue(enabled)}.`,
    );
  }

  const selectedRenovationIds = new Set(
    restoredMapRenderOptions.farmhouse2.renovationIds,
  );

  if (enabled) {
    const renovation = getRequiredFarmhouseRenovation(renovationId);

    for (const requiredRenovationId of renovation.dependsOn) {
      if (!selectedRenovationIds.has(requiredRenovationId)) {
        throw new Error(
          `Farmhouse 2 renovation ${describeValue(renovationId)} requires renovation ${describeValue(requiredRenovationId)} to be enabled first.`,
        );
      }
    }

    selectedRenovationIds.add(renovationId);
  } else {
    selectedRenovationIds.delete(renovationId);

    for (const dependentRenovationId of getDependentRenovationIds(renovationId)) {
      selectedRenovationIds.delete(dependentRenovationId);
    }
  }

  return {
    ...restoredMapRenderOptions,
    farmhouse2: {
      ...restoredMapRenderOptions.farmhouse2,
      renovationIds: farmhouseRenovationIds.filter((configuredRenovationId) =>
        selectedRenovationIds.has(configuredRenovationId),
      ),
    },
  };
}

function assertFarmhouse2OptionDependencies(
  mapRenderOptions: MapRenderOptions,
): void {
  if (
    mapRenderOptions.farmhouse2.spouseId !== null &&
    !mapRenderOptions.farmhouse2.marriageMapEnabled
  ) {
    throw new Error(
      `Map render options.farmhouse2.spouseId ${describeValue(mapRenderOptions.farmhouse2.spouseId)} requires marriageMapEnabled to be true.`,
    );
  }

  const selectedRenovationIds = new Set(
    mapRenderOptions.farmhouse2.renovationIds,
  );

  for (const renovationId of mapRenderOptions.farmhouse2.renovationIds) {
    const renovation = getRequiredFarmhouseRenovation(renovationId);

    for (const requiredRenovationId of renovation.dependsOn) {
      if (!selectedRenovationIds.has(requiredRenovationId)) {
        throw new Error(
          `Map render options.farmhouse2.renovationIds contains ${describeValue(renovationId)} without required renovation ${describeValue(requiredRenovationId)}.`,
        );
      }
    }
  }
}

function getDependentRenovationIds(
  renovationId: FarmhouseRenovationId,
): readonly FarmhouseRenovationId[] {
  const dependentRenovationIds = new Set<FarmhouseRenovationId>();
  let foundAdditionalDependent = true;

  while (foundAdditionalDependent) {
    foundAdditionalDependent = false;

    for (const renovation of farmhouse2Composite.renovations) {
      if (
        !dependentRenovationIds.has(renovation.id) &&
        renovation.dependsOn.some(
          (requiredRenovationId) =>
            requiredRenovationId === renovationId ||
            dependentRenovationIds.has(requiredRenovationId),
        )
      ) {
        dependentRenovationIds.add(renovation.id);
        foundAdditionalDependent = true;
      }
    }
  }

  return [...dependentRenovationIds];
}

function getRequiredFarmhouseRenovation(renovationId: FarmhouseRenovationId) {
  const farmhouseRenovation = farmhouse2Composite.renovations.find(
    (candidateRenovation) => candidateRenovation.id === renovationId,
  );

  if (farmhouseRenovation === undefined) {
    throw new Error(
      `Farmhouse 2 renovation ID ${describeValue(renovationId)} is not configured in the locked map catalog.`,
    );
  }

  return farmhouseRenovation;
}

function readUniqueAllowedIds<AllowedId extends string>(
  rawValues: unknown,
  allowedIds: readonly AllowedId[],
  location: string,
): readonly AllowedId[] {
  if (!Array.isArray(rawValues)) {
    throw new TypeError(
      `${location} must be an array; received ${describeValue(rawValues)}.`,
    );
  }

  const selectedIds = new Set<AllowedId>();

  for (const rawValue of rawValues) {
    assertAllowedId(rawValue, allowedIds, location);

    if (selectedIds.has(rawValue)) {
      throw new Error(`${location} contains duplicate ID ${describeValue(rawValue)}.`);
    }

    selectedIds.add(rawValue);
  }

  return allowedIds.filter((allowedId) => selectedIds.has(allowedId));
}

function readNullableAllowedId<AllowedId extends string>(
  rawValue: unknown,
  allowedIds: readonly AllowedId[],
  location: string,
): AllowedId | null {
  if (rawValue === null) {
    return null;
  }

  assertAllowedId(rawValue, allowedIds, location);
  return rawValue;
}

function assertAllowedId<AllowedId extends string>(
  rawValue: unknown,
  allowedIds: readonly AllowedId[],
  location: string,
): asserts rawValue is AllowedId {
  if (typeof rawValue !== "string" || !allowedIds.includes(rawValue as AllowedId)) {
    throw new TypeError(
      `${location} must be one of ${allowedIds.join(", ")}; received ${describeValue(rawValue)}.`,
    );
  }
}

function readBoolean(rawValue: unknown, location: string): boolean {
  if (typeof rawValue !== "boolean") {
    throw new TypeError(`${location} must be a boolean; received ${describeValue(rawValue)}.`);
  }

  return rawValue;
}

function assertPlainRecord(
  rawValue: unknown,
  location: string,
): Readonly<Record<string, unknown>> {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw new TypeError(`${location} must be a plain object; received ${describeValue(rawValue)}.`);
  }

  return rawValue as Readonly<Record<string, unknown>>;
}

function assertExactKeys(
  record: Readonly<Record<string, unknown>>,
  expectedKeys: readonly string[],
  location: string,
): void {
  const actualKeys = Object.keys(record).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();

  if (actualKeys.join("\u0000") !== sortedExpectedKeys.join("\u0000")) {
    throw new Error(
      `${location} must contain exactly keys ${describeValue(sortedExpectedKeys)}; received ${describeValue(actualKeys)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
