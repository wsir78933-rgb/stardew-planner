export const placementBedTypes = ["single", "double", "child"] as const;

export type PlacementBedType = (typeof placementBedTypes)[number] | null;

type ConcretePlacementBedType = Exclude<PlacementBedType, null>;

export type BedPlacementFootprint = Readonly<{
  width: number;
  height: number;
}>;

export type BedPlacementOffset = Readonly<{
  x: number;
  y: number;
}>;

export type BedTerrainCollisionMask = readonly (readonly boolean[])[];

export type BedPlacementSemantics = Readonly<{
  collisionMask: BedTerrainCollisionMask;
  exitOffsets: readonly BedPlacementOffset[];
}>;

export function assertPlacementBedType(
  bedType: unknown,
  bedTypeFieldDescription = "Placement bedType",
): asserts bedType is PlacementBedType {
  if (bedType === null) {
    return;
  }

  if (!placementBedTypes.includes(bedType as ConcretePlacementBedType)) {
    throw new TypeError(
      `${bedTypeFieldDescription} must be one of "single", "double", or "child", or null; received ${describeValue(bedType)}.`,
    );
  }
}

type BedPlacementSemanticsInput = Readonly<{
  bedType: ConcretePlacementBedType;
  footprint: BedPlacementFootprint;
  rotation: number;
}>;

const bedFootprintsByType: Readonly<
  Record<ConcretePlacementBedType, BedPlacementFootprint>
> = {
  single: { width: 2, height: 3 },
  double: { width: 3, height: 3 },
  child: { width: 2, height: 3 },
};

export function getBedPlacementSemantics(
  bedPlacementSemanticsInput: BedPlacementSemanticsInput,
): BedPlacementSemantics {
  assertBedPlacementSemanticsInput(bedPlacementSemanticsInput);
  const { bedType, footprint } = bedPlacementSemanticsInput;
  const collisionMask = createBedTerrainCollisionMask(footprint);

  assertBedTerrainCollisionMask(bedType, footprint, collisionMask);

  return {
    collisionMask,
    exitOffsets: createBedExitOffsets(bedType, footprint),
  };
}

export function assertBedTerrainCollisionMask(
  bedType: ConcretePlacementBedType,
  footprint: BedPlacementFootprint,
  collisionMask: unknown,
): asserts collisionMask is BedTerrainCollisionMask {
  assertConcreteBedType(bedType);
  assertBedFootprint(bedType, footprint);

  if (!Array.isArray(collisionMask)) {
    throw new TypeError(
      `${bedType} bed terrain collision mask must be an array; received ${describeValue(collisionMask)}.`,
    );
  }

  if (collisionMask.length !== footprint.height) {
    throw new RangeError(
      `${bedType} bed terrain collision mask must contain ${String(footprint.height)} rows; received ${String(collisionMask.length)} rows.`,
    );
  }

  for (let rowIndex = 0; rowIndex < footprint.height; rowIndex += 1) {
    const collisionMaskRow = collisionMask[rowIndex];

    if (!Array.isArray(collisionMaskRow)) {
      throw new TypeError(
        `${bedType} bed terrain collision mask row ${String(rowIndex)} must be an array; received ${describeValue(collisionMaskRow)}.`,
      );
    }

    if (collisionMaskRow.length !== footprint.width) {
      throw new RangeError(
        `${bedType} bed terrain collision mask row ${String(rowIndex)} must contain ${String(footprint.width)} columns; received ${String(collisionMaskRow.length)} columns.`,
      );
    }

    for (let columnIndex = 0; columnIndex < footprint.width; columnIndex += 1) {
      const expectedCollisionValue = rowIndex !== 0;
      const receivedCollisionValue = collisionMaskRow[columnIndex];

      if (receivedCollisionValue !== expectedCollisionValue) {
        throw new TypeError(
          `${bedType} bed terrain collision mask row ${String(rowIndex)} column ${String(columnIndex)} must be ${String(expectedCollisionValue)}; received ${describeValue(receivedCollisionValue)}.`,
        );
      }
    }
  }
}

function assertBedPlacementSemanticsInput(
  bedPlacementSemanticsInput: BedPlacementSemanticsInput,
): void {
  if (
    typeof bedPlacementSemanticsInput !== "object"
    || bedPlacementSemanticsInput === null
  ) {
    throw new TypeError(
      `Bed placement semantics input must be a non-null object; received ${describeValue(bedPlacementSemanticsInput)}.`,
    );
  }

  assertConcreteBedType(bedPlacementSemanticsInput.bedType);

  if (bedPlacementSemanticsInput.rotation !== 0) {
    throw new RangeError(
      `Bed placement semantics bed rotation must be 0; received ${describeValue(bedPlacementSemanticsInput.rotation)}.`,
    );
  }

  assertBedFootprint(
    bedPlacementSemanticsInput.bedType,
    bedPlacementSemanticsInput.footprint,
  );
}

function assertConcreteBedType(
  bedType: unknown,
): asserts bedType is ConcretePlacementBedType {
  if (!placementBedTypes.includes(bedType as ConcretePlacementBedType)) {
    throw new TypeError(
      `Bed placement semantics bedType must be one of "single", "double", or "child"; received ${describeValue(bedType)}.`,
    );
  }
}

function assertBedFootprint(
  bedType: ConcretePlacementBedType,
  footprint: BedPlacementFootprint,
): void {
  if (typeof footprint !== "object" || footprint === null) {
    throw new TypeError(
      `Bed placement semantics ${bedType} bed footprint must be a non-null object; received ${describeValue(footprint)}.`,
    );
  }

  const expectedFootprint = bedFootprintsByType[bedType];

  if (
    footprint.width !== expectedFootprint.width
    || footprint.height !== expectedFootprint.height
  ) {
    throw new RangeError(
      `Bed placement semantics ${bedType} bed footprint must be ${String(expectedFootprint.width)} by ${String(expectedFootprint.height)}; received width ${describeValue(footprint.width)}, height ${describeValue(footprint.height)}.`,
    );
  }
}

function createBedTerrainCollisionMask(
  footprint: BedPlacementFootprint,
): BedTerrainCollisionMask {
  return Array.from(
    { length: footprint.height },
    (_, rowIndex) =>
      Array.from({ length: footprint.width }, () => rowIndex !== 0),
  );
}

function createBedExitOffsets(
  bedType: ConcretePlacementBedType,
  footprint: BedPlacementFootprint,
): readonly BedPlacementOffset[] {
  if (bedType === "double") {
    return [{ x: -1, y: 1 }];
  }

  if (bedType === "single") {
    return [
      { x: -1, y: 1 },
      { x: footprint.width, y: 1 },
    ];
  }

  return [];
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
