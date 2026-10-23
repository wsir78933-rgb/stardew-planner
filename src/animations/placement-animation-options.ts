export type PlacementAnimationAnimal = Readonly<{
  animalId: string;
}>;

export type PlacementAnimationOptions = Readonly<{
  spriteState?: string;
  readyProduct?: string;
  fireplaceLit?: boolean;
  clockOff?: boolean;
  millLoaded?: boolean;
  millOutput?: boolean;
  millProduct?: string;
  fishId?: string;
  population?: number;
  produce?: string;
  tankFish?: readonly string[];
  animals?: readonly PlacementAnimationAnimal[];
  petId?: string;
  horse?: boolean;
  junimos?: boolean;
  hatId?: string;
  shirtId?: string;
  pantsId?: string;
}>;

type AnimationOptionsRecord = Readonly<Record<string, unknown>>;

const placementAnimationOptionFields = [
  "spriteState",
  "readyProduct",
  "fireplaceLit",
  "clockOff",
  "millLoaded",
  "millOutput",
  "millProduct",
  "fishId",
  "population",
  "produce",
  "tankFish",
  "animals",
  "petId",
  "horse",
  "junimos",
  "hatId",
  "shirtId",
  "pantsId",
] as const;
const placementAnimationIdentifierMaximumLength = 64;

export function restorePlacementAnimationOptions(
  rawPlacementAnimationOptions: unknown,
  fieldPath: string,
): PlacementAnimationOptions {
  const animationOptionsRecord = assertAnimationOptionsRecord(
    rawPlacementAnimationOptions,
    fieldPath,
  );
  assertPlacementAnimationOptionFields(animationOptionsRecord, fieldPath);

  const spriteState = hasOwn(animationOptionsRecord, "spriteState")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.spriteState,
        `${fieldPath}.spriteState`,
      )
    : undefined;
  const readyProduct = hasOwn(animationOptionsRecord, "readyProduct")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.readyProduct,
        `${fieldPath}.readyProduct`,
      )
    : undefined;
  const fireplaceLit = hasOwn(animationOptionsRecord, "fireplaceLit")
    ? readBoolean(animationOptionsRecord.fireplaceLit, `${fieldPath}.fireplaceLit`)
    : undefined;
  const clockOff = hasOwn(animationOptionsRecord, "clockOff")
    ? readBoolean(animationOptionsRecord.clockOff, `${fieldPath}.clockOff`)
    : undefined;
  const millLoaded = hasOwn(animationOptionsRecord, "millLoaded")
    ? readBoolean(animationOptionsRecord.millLoaded, `${fieldPath}.millLoaded`)
    : undefined;
  const millOutput = hasOwn(animationOptionsRecord, "millOutput")
    ? readBoolean(animationOptionsRecord.millOutput, `${fieldPath}.millOutput`)
    : undefined;
  const millProduct = hasOwn(animationOptionsRecord, "millProduct")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.millProduct,
        `${fieldPath}.millProduct`,
      )
    : undefined;
  const fishId = hasOwn(animationOptionsRecord, "fishId")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.fishId,
        `${fieldPath}.fishId`,
      )
    : undefined;
  const population = hasOwn(animationOptionsRecord, "population")
    ? readNonNegativeSafeInteger(
        animationOptionsRecord.population,
        `${fieldPath}.population`,
      )
    : undefined;
  const produce = hasOwn(animationOptionsRecord, "produce")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.produce,
        `${fieldPath}.produce`,
      )
    : undefined;
  const tankFish = hasOwn(animationOptionsRecord, "tankFish")
    ? readPlacementAnimationIdentifierArray(
        animationOptionsRecord.tankFish,
        `${fieldPath}.tankFish`,
      )
    : undefined;
  const animals = hasOwn(animationOptionsRecord, "animals")
    ? readPlacementAnimationAnimals(
        animationOptionsRecord.animals,
        `${fieldPath}.animals`,
      )
    : undefined;
  const petId = hasOwn(animationOptionsRecord, "petId")
    ? readPlacementAnimationPetId(
        animationOptionsRecord.petId,
        `${fieldPath}.petId`,
      )
    : undefined;
  const horse = hasOwn(animationOptionsRecord, "horse")
    ? readBoolean(animationOptionsRecord.horse, `${fieldPath}.horse`)
    : undefined;
  const junimos = hasOwn(animationOptionsRecord, "junimos")
    ? readBoolean(animationOptionsRecord.junimos, `${fieldPath}.junimos`)
    : undefined;
  const hatId = hasOwn(animationOptionsRecord, "hatId")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.hatId,
        `${fieldPath}.hatId`,
      )
    : undefined;
  const shirtId = hasOwn(animationOptionsRecord, "shirtId")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.shirtId,
        `${fieldPath}.shirtId`,
      )
    : undefined;
  const pantsId = hasOwn(animationOptionsRecord, "pantsId")
    ? readPlacementAnimationIdentifier(
        animationOptionsRecord.pantsId,
        `${fieldPath}.pantsId`,
      )
    : undefined;

  return {
    ...(spriteState === undefined ? {} : { spriteState }),
    ...(readyProduct === undefined ? {} : { readyProduct }),
    ...(fireplaceLit === undefined ? {} : { fireplaceLit }),
    ...(clockOff === undefined ? {} : { clockOff }),
    ...(millLoaded === undefined ? {} : { millLoaded }),
    ...(millOutput === undefined ? {} : { millOutput }),
    ...(millProduct === undefined ? {} : { millProduct }),
    ...(fishId === undefined ? {} : { fishId }),
    ...(population === undefined ? {} : { population }),
    ...(produce === undefined ? {} : { produce }),
    ...(tankFish === undefined ? {} : { tankFish }),
    ...(animals === undefined ? {} : { animals }),
    ...(petId === undefined ? {} : { petId }),
    ...(horse === undefined ? {} : { horse }),
    ...(junimos === undefined ? {} : { junimos }),
    ...(hatId === undefined ? {} : { hatId }),
    ...(shirtId === undefined ? {} : { shirtId }),
    ...(pantsId === undefined ? {} : { pantsId }),
  };
}

export function clonePlacementAnimationOptions(
  placementAnimationOptions: PlacementAnimationOptions,
): PlacementAnimationOptions {
  return restorePlacementAnimationOptions(
    placementAnimationOptions,
    "animationOptions",
  );
}

function assertAnimationOptionsRecord(
  rawPlacementAnimationOptions: unknown,
  fieldPath: string,
): AnimationOptionsRecord {
  if (
    typeof rawPlacementAnimationOptions !== "object" ||
    rawPlacementAnimationOptions === null ||
    Array.isArray(rawPlacementAnimationOptions) ||
    (Object.getPrototypeOf(rawPlacementAnimationOptions) !== Object.prototype &&
      Object.getPrototypeOf(rawPlacementAnimationOptions) !== null)
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a plain object; received ${describeValue(rawPlacementAnimationOptions)}.`,
    );
  }

  return rawPlacementAnimationOptions as AnimationOptionsRecord;
}

function assertPlacementAnimationOptionFields(
  animationOptionsRecord: AnimationOptionsRecord,
  fieldPath: string,
): void {
  const unexpectedField = Reflect.ownKeys(animationOptionsRecord).find(
    (fieldName) =>
      typeof fieldName !== "string" ||
      !placementAnimationOptionFields.includes(
        fieldName as (typeof placementAnimationOptionFields)[number],
      ),
  );
  if (unexpectedField !== undefined) {
    const unexpectedFieldLabel = typeof unexpectedField === "string"
      ? JSON.stringify(unexpectedField)
      : String(unexpectedField);
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" does not allow property ${unexpectedFieldLabel}; allowed properties are ${placementAnimationOptionFields.join(", ")}.`,
    );
  }
}

function readPlacementAnimationIdentifier(
  rawIdentifier: unknown,
  fieldPath: string,
): string {
  if (
    typeof rawIdentifier !== "string" ||
    rawIdentifier.trim().length === 0 ||
    rawIdentifier.length > placementAnimationIdentifierMaximumLength
  ) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a non-empty string of at most ${String(placementAnimationIdentifierMaximumLength)} characters; received ${describeValue(rawIdentifier)}.`,
    );
  }

  return rawIdentifier;
}

function readPlacementAnimationPetId(
  rawPetId: unknown,
  fieldPath: string,
): string {
  const petId = readPlacementAnimationIdentifier(rawPetId, fieldPath);
  if (!/^(Cat|Dog|Turtle):[^\s:]+$/.test(petId)) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must use the form "Cat:<breed>", "Dog:<breed>", or "Turtle:<breed>"; received ${describeValue(petId)}.`,
    );
  }

  return petId;
}

function readPlacementAnimationIdentifierArray(
  rawIdentifiers: unknown,
  fieldPath: string,
): readonly string[] {
  if (!Array.isArray(rawIdentifiers)) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be an array; received ${describeValue(rawIdentifiers)}.`,
    );
  }

  return rawIdentifiers.map((rawIdentifier, index) =>
    readPlacementAnimationIdentifier(
      rawIdentifier,
      `${fieldPath}[${String(index)}]`,
    ),
  );
}

function readPlacementAnimationAnimals(
  rawAnimals: unknown,
  fieldPath: string,
): readonly PlacementAnimationAnimal[] {
  if (!Array.isArray(rawAnimals)) {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be an array; received ${describeValue(rawAnimals)}.`,
    );
  }

  return rawAnimals.map((rawAnimal, index) => {
    const animalFieldPath = `${fieldPath}[${String(index)}]`;
    const animalRecord = assertAnimationOptionsRecord(rawAnimal, animalFieldPath);
    const animalFields = Reflect.ownKeys(animalRecord);
    if (
      animalFields.length !== 1 ||
      animalFields[0] !== "animalId"
    ) {
      throw new TypeError(
        `Placement snapshot field "${animalFieldPath}" must contain exactly animalId; received ${animalFields.map(String).join(", ") || "no keys"}.`,
      );
    }

    return {
      animalId: readPlacementAnimationIdentifier(
        animalRecord.animalId,
        `${animalFieldPath}.animalId`,
      ),
    };
  });
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

function readBoolean(rawValue: unknown, fieldPath: string): boolean {
  if (typeof rawValue !== "boolean") {
    throw new TypeError(
      `Placement snapshot field "${fieldPath}" must be a boolean; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function hasOwn(record: AnimationOptionsRecord, fieldName: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, fieldName);
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  try {
    const serializedValue = JSON.stringify(value);
    if (serializedValue !== undefined) {
      return serializedValue;
    }
  } catch (serializationError) {
    const serializationErrorMessage = serializationError instanceof Error
      ? serializationError.message
      : String(serializationError);
    return `<non-JSON ${typeof value} value; JSON.stringify failed: ${serializationErrorMessage}>`;
  }

  return `<non-JSON ${typeof value} value: ${String(value)}>`;
}
