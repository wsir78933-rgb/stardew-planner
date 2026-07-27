export type InteriorDecorKind = "wallpaper" | "flooring";

export type InteriorDecorPattern = string;

export type InteriorDecorState = Readonly<{
  wallpapers: Readonly<Record<string, InteriorDecorPattern>>;
  floors: Readonly<Record<string, InteriorDecorPattern>>;
}>;

type InteriorDecorRecord = Readonly<Record<string, unknown>>;

const interiorDecorFields = ["wallpapers", "floors"] as const;
const wallpaperPatternPrefix = "MoreWalls:";
const flooringPatternPrefix = "MoreFloors:";

export function createEmptyInteriorDecorState(): InteriorDecorState {
  return { wallpapers: {}, floors: {} };
}

export function restoreInteriorDecorState(
  rawInteriorDecorState: unknown,
): InteriorDecorState {
  const interiorDecorRecord = assertPlainRecord(rawInteriorDecorState, "interiorDecor");
  assertExactFields(interiorDecorRecord, "interiorDecor", interiorDecorFields);

  return {
    wallpapers: readInteriorDecorPatterns(
      interiorDecorRecord.wallpapers,
      "interiorDecor.wallpapers",
      "wallpaper",
    ),
    floors: readInteriorDecorPatterns(
      interiorDecorRecord.floors,
      "interiorDecor.floors",
      "flooring",
    ),
  };
}

export function setInteriorDecorPattern(
  interiorDecorState: InteriorDecorState,
  interiorDecorKind: InteriorDecorKind,
  targetId: string,
  patternId: string,
): InteriorDecorState {
  const validatedInteriorDecorState = restoreInteriorDecorState(interiorDecorState);
  assertInteriorDecorKind(interiorDecorKind);
  assertTargetId(targetId, "targetId");
  assertInteriorDecorPattern(patternId, interiorDecorKind, "patternId");

  if (interiorDecorKind === "wallpaper") {
    return {
      wallpapers: {
        ...validatedInteriorDecorState.wallpapers,
        [targetId]: patternId,
      },
      floors: { ...validatedInteriorDecorState.floors },
    };
  }

  return {
    wallpapers: { ...validatedInteriorDecorState.wallpapers },
    floors: {
      ...validatedInteriorDecorState.floors,
      [targetId]: patternId,
    },
  };
}

export function getInteriorDecorPattern(
  interiorDecorState: InteriorDecorState,
  interiorDecorKind: InteriorDecorKind,
  targetId: string,
): InteriorDecorPattern | undefined {
  const validatedInteriorDecorState = restoreInteriorDecorState(interiorDecorState);
  assertInteriorDecorKind(interiorDecorKind);
  assertTargetId(targetId, "targetId");

  return interiorDecorKind === "wallpaper"
    ? validatedInteriorDecorState.wallpapers[targetId]
    : validatedInteriorDecorState.floors[targetId];
}

function readInteriorDecorPatterns(
  rawPatterns: unknown,
  fieldPath: string,
  interiorDecorKind: InteriorDecorKind,
): Readonly<Record<string, InteriorDecorPattern>> {
  const patternRecord = assertPlainRecord(rawPatterns, fieldPath);
  const patterns: Record<string, InteriorDecorPattern> = {};

  for (const [targetId, patternId] of Object.entries(patternRecord)) {
    assertTargetId(targetId, `${fieldPath} target ID`);

    if (typeof patternId !== "string") {
      throw new TypeError(
        `Interior decor field ${JSON.stringify(`${fieldPath}.${targetId}`)} must be a string pattern ID; received ${describeValue(patternId)}.`,
      );
    }

    assertInteriorDecorPattern(
      patternId,
      interiorDecorKind,
      `${fieldPath}.${targetId}`,
    );
    patterns[targetId] = patternId;
  }

  return patterns;
}

function assertInteriorDecorKind(
  interiorDecorKind: unknown,
): asserts interiorDecorKind is InteriorDecorKind {
  if (interiorDecorKind !== "wallpaper" && interiorDecorKind !== "flooring") {
    throw new TypeError(
      `Interior decor kind must be "wallpaper" or "flooring"; received ${describeValue(interiorDecorKind)}.`,
    );
  }
}

function assertTargetId(rawTargetId: unknown, fieldName: string): asserts rawTargetId is string {
  if (typeof rawTargetId !== "string" || rawTargetId.length === 0) {
    throw new TypeError(
      `Interior decor ${fieldName} must be a non-empty string; received ${describeValue(rawTargetId)}.`,
    );
  }

  if (rawTargetId === "__proto__") {
    throw new TypeError(
      `Interior decor ${fieldName} must not be "__proto__"; received "__proto__".`,
    );
  }
}

function assertInteriorDecorPattern(
  rawPatternId: unknown,
  interiorDecorKind: InteriorDecorKind,
  fieldName: string,
): asserts rawPatternId is InteriorDecorPattern {
  if (typeof rawPatternId !== "string") {
    throw new TypeError(
      `Interior decor ${fieldName} must be a string; received ${describeValue(rawPatternId)}.`,
    );
  }

  if (isValidInteriorDecorPattern(rawPatternId, interiorDecorKind)) {
    return;
  }

  const expectedPatternRange = interiorDecorKind === "wallpaper"
    ? '"0" through "111" or "MoreWalls:0" through "MoreWalls:25"'
    : '"0" through "87" or "MoreFloors:0" through "MoreFloors:8"';
  throw new RangeError(
    `Interior decor ${fieldName} must be ${expectedPatternRange}; received ${describeValue(rawPatternId)}.`,
  );
}

function isValidInteriorDecorPattern(
  patternId: string,
  interiorDecorKind: InteriorDecorKind,
): boolean {
  const standardPatternMaximum = interiorDecorKind === "wallpaper" ? 111 : 87;

  if (isCanonicalIntegerInRange(patternId, 0, standardPatternMaximum)) {
    return true;
  }

  const additionalPatternPrefix = interiorDecorKind === "wallpaper"
    ? wallpaperPatternPrefix
    : flooringPatternPrefix;
  const additionalPatternMaximum = interiorDecorKind === "wallpaper" ? 25 : 8;

  if (!patternId.startsWith(additionalPatternPrefix)) {
    return false;
  }

  return isCanonicalIntegerInRange(
    patternId.slice(additionalPatternPrefix.length),
    0,
    additionalPatternMaximum,
  );
}

function isCanonicalIntegerInRange(
  rawValue: string,
  minimum: number,
  maximum: number,
): boolean {
  if (!/^(0|[1-9]\d*)$/.test(rawValue)) {
    return false;
  }

  const parsedValue = Number(rawValue);

  return parsedValue >= minimum && parsedValue <= maximum;
}

function assertPlainRecord(rawValue: unknown, fieldPath: string): InteriorDecorRecord {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw new TypeError(
      `Interior decor field ${JSON.stringify(fieldPath)} must be a plain object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue as InteriorDecorRecord;
}

function assertExactFields(
  record: InteriorDecorRecord,
  fieldPath: string,
  requiredFieldNames: readonly string[],
): void {
  for (const requiredFieldName of requiredFieldNames) {
    if (!Object.hasOwn(record, requiredFieldName)) {
      throw new TypeError(
        `Interior decor field ${JSON.stringify(`${fieldPath}.${requiredFieldName}`)} must be present; received undefined.`,
      );
    }
  }

  for (const fieldName of Object.keys(record)) {
    if (!requiredFieldNames.includes(fieldName)) {
      throw new TypeError(
        `Interior decor field ${JSON.stringify(`${fieldPath}.${fieldName}`)} must not be present; received ${describeValue(record[fieldName])}.`,
      );
    }
  }
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

  if (typeof value === "bigint") {
    return `${String(value)}n`;
  }

  if (typeof value === "symbol" || typeof value === "function") {
    return String(value);
  }

  if (typeof value === "object") {
    const objectType = Object.prototype.toString.call(value);
    const serializedValue = JSON.stringify(value);

    return serializedValue ?? objectType;
  }

  return String(value);
}
