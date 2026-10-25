import {
  calculateProcessingRoute,
  getProcessingIngredient,
  listProcessingIngredients,
  type ProcessingIngredient,
  type ProcessingMachineCounts,
  type ProcessingRouteQuote,
} from "../processing-tools/processing-model";

export const KEG_CAPACITY_DEADLINES = [7, 14, 28] as const;
export const KEG_SHED_SPACE_REFERENCES = [
  { id: "regular", spacesPerShed: 67 },
  { id: "large", spacesPerShed: 137 },
] as const;
export const kegCapacityStorageKey = "stardew-tools:workshop-keg-capacity";
export type KegCapacityDeadline = (typeof KEG_CAPACITY_DEADLINES)[number];
export type KegShedSpaceReference = (typeof KEG_SHED_SPACE_REFERENCES)[number];

export type KegCapacityInput = Readonly<{
  ingredientId: string;
  quantity: number;
  deadlineDays: KegCapacityDeadline;
  existingKegCount: number;
  harvestIntervalDays: number;
}>;

export type KegCapacityPlanHandoff = Readonly<{
  source: "workshop-keg-count";
  scenario: "current-stock";
  ingredientId: string;
  quantity: number;
  availableDay: 0;
  deadlineDays: KegCapacityDeadline;
  machineCounts: ProcessingMachineCounts;
  quality: "normal";
  profession: "none";
  mode: "capacity";
}>;

export type KegCapacityEstimate = Readonly<{
  ingredient: ProcessingIngredient;
  quantity: number;
  deadlineDays: KegCapacityDeadline;
  existingKegCount: number;
  harvestIntervalDays: number;
  batchInputUnits: number;
  processingMinutes: number;
  processingMornings: number;
  completeBatchesPerHarvest: number;
  unitsBelowOneBatch: number;
  oneKegQuote: ProcessingRouteQuote;
  existingKegsQuote: ProcessingRouteQuote;
  kegsNeededForOneHarvest: number | null;
  additionalKegsForOneHarvest: number | null;
  oneHarvestCannotFinish: boolean;
  averageBatchesPerHarvestWithExistingKegs: number;
  averageBacklogGrowthUnitsPerHarvestWithExistingKegs: number;
  kegsNeededForSteadyState: number;
  additionalKegsForSteadyState: number;
}>;

export type KegShedSpaceEstimate = Readonly<{
  shedCount: number;
  emptySpaces: number;
}>;

const EMPTY_MACHINE_COUNTS: ProcessingMachineCounts = {
  keg: 0,
  jar: 0,
  dehydrator: 0,
};

export function createDefaultKegCapacityInput(): KegCapacityInput {
  return {
    ingredientId: "starfruit",
    quantity: 10,
    deadlineDays: 7,
    existingKegCount: 2,
    harvestIntervalDays: 7,
  };
}

export function isKegCapacityInputFailure(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Keg capacity ");
}

export function loadKegCapacityInput(storageText: string | null): KegCapacityInput {
  if (storageText === null) {
    return createDefaultKegCapacityInput();
  }
  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storageText);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    throw new Error(
      `Keg capacity storage must be valid JSON. Received: ${JSON.stringify(storageText)}.`,
      { cause: error },
    );
  }
  const input = readKegCapacityInput(parsedValue as KegCapacityInput);
  requireKegRecipeQuote(input.ingredientId);
  return input;
}

export function serializeKegCapacityInput(input: KegCapacityInput): string {
  const validatedInput = readKegCapacityInput(input);
  requireKegRecipeQuote(validatedInput.ingredientId);
  return JSON.stringify(validatedInput);
}

export function listKegCapacityIngredients(): readonly ProcessingIngredient[] {
  return listProcessingIngredients().filter((ingredient) => {
    const recipeQuote = readKegRecipeQuote(ingredient.id);
    return recipeQuote.applicable;
  });
}

export function calculateKegCapacity(input: KegCapacityInput): KegCapacityEstimate {
  const validatedInput = readKegCapacityInput(input);
  const ingredient = getProcessingIngredient(validatedInput.ingredientId);
  const recipeQuote = requireKegRecipeQuote(validatedInput.ingredientId);

  const completeBatchesPerHarvest = Math.floor(validatedInput.quantity / recipeQuote.batchInputUnits);
  const unitsBelowOneBatch = validatedInput.quantity % recipeQuote.batchInputUnits;
  const oneKegQuote = calculateKegCapacityQuote(validatedInput, 1);
  const existingKegsQuote = calculateKegCapacityQuote(
    validatedInput,
    validatedInput.existingKegCount,
  );
  const batchesPerKegByDeadline = Math.floor(
    validatedInput.deadlineDays / recipeQuote.processingMornings,
  );
  const oneHarvestCannotFinish =
    completeBatchesPerHarvest > 0 && batchesPerKegByDeadline === 0;
  const kegsNeededForOneHarvest = oneHarvestCannotFinish
    ? null
    : batchesPerKegByDeadline === 0
      ? 0
      : Math.ceil(completeBatchesPerHarvest / batchesPerKegByDeadline);
  const additionalKegsForOneHarvest = kegsNeededForOneHarvest === null
    ? null
    : Math.max(0, kegsNeededForOneHarvest - validatedInput.existingKegCount);
  const averageBatchesPerHarvestWithExistingKegs = calculateSafeRatio(
    BigInt(validatedInput.existingKegCount) * BigInt(validatedInput.harvestIntervalDays),
    BigInt(recipeQuote.processingMornings),
    "averageBatchesPerHarvestWithExistingKegs",
  );
  const averageBacklogGrowthUnitsPerHarvestWithExistingKegs = calculateAverageBacklogGrowth(
    validatedInput,
    recipeQuote.batchInputUnits,
    recipeQuote.processingMornings,
  );
  const kegsNeededForSteadyState = calculateSteadyStateKegDemand(
    validatedInput,
    recipeQuote.batchInputUnits,
    recipeQuote.processingMornings,
  );

  assertSafeNonNegativeInteger("completeBatchesPerHarvest", completeBatchesPerHarvest);
  assertSafeNonNegativeInteger("kegsNeededForSteadyState", kegsNeededForSteadyState);

  return {
    ingredient,
    quantity: validatedInput.quantity,
    deadlineDays: validatedInput.deadlineDays,
    existingKegCount: validatedInput.existingKegCount,
    harvestIntervalDays: validatedInput.harvestIntervalDays,
    batchInputUnits: recipeQuote.batchInputUnits,
    processingMinutes: recipeQuote.processingMinutes,
    processingMornings: recipeQuote.processingMornings,
    completeBatchesPerHarvest,
    unitsBelowOneBatch,
    oneKegQuote,
    existingKegsQuote,
    kegsNeededForOneHarvest,
    additionalKegsForOneHarvest,
    oneHarvestCannotFinish,
    averageBatchesPerHarvestWithExistingKegs,
    averageBacklogGrowthUnitsPerHarvestWithExistingKegs,
    kegsNeededForSteadyState,
    additionalKegsForSteadyState: Math.max(
      0,
      kegsNeededForSteadyState - validatedInput.existingKegCount,
    ),
  };
}

export function calculateKegShedSpace(
  kegCount: number,
  spacesPerShed: number,
): KegShedSpaceEstimate {
  readSafeNonNegativeInteger("kegCount", kegCount);
  readSafePositiveInteger("spacesPerShed", spacesPerShed);
  const kegCountBigInt = BigInt(kegCount);
  const spacesPerShedBigInt = BigInt(spacesPerShed);
  const shedCountBigInt = kegCountBigInt === 0n
    ? 0n
    : divideRoundUp(kegCountBigInt, spacesPerShedBigInt);
  const emptySpacesBigInt = shedCountBigInt * spacesPerShedBigInt - kegCountBigInt;

  return {
    shedCount: readBigIntSafeNonNegativeInteger("shedCount", shedCountBigInt),
    emptySpaces: readBigIntSafeNonNegativeInteger("emptySpaces", emptySpacesBigInt),
  };
}

export function createKegCapacityPlanHandoff(
  input: KegCapacityInput,
): KegCapacityPlanHandoff {
  const validatedInput = readKegCapacityInput(input);
  const ingredient = getProcessingIngredient(validatedInput.ingredientId);
  requireKegRecipeQuote(validatedInput.ingredientId);

  return {
    source: "workshop-keg-count",
    scenario: "current-stock",
    ingredientId: ingredient.id,
    quantity: validatedInput.quantity,
    availableDay: 0,
    deadlineDays: validatedInput.deadlineDays,
    machineCounts: {
      ...EMPTY_MACHINE_COUNTS,
      keg: validatedInput.existingKegCount,
    },
    quality: "normal",
    profession: "none",
    mode: "capacity",
  };
}

function readKegRecipeQuote(ingredientId: string): ProcessingRouteQuote {
  return calculateProcessingRoute({
    ingredientId,
    quantity: 1,
    quality: "normal",
    profession: "none",
    mode: "unlimited",
    deadlineDays: 7,
    machineCounts: EMPTY_MACHINE_COUNTS,
    machine: "keg",
  });
}

function requireKegRecipeQuote(ingredientId: string): Extract<ProcessingRouteQuote, { applicable: true }> {
  if (!listProcessingIngredients().some((ingredient) => ingredient.id === ingredientId)) {
    throw new Error(
      `Keg capacity ingredientId is unknown. Received: ${JSON.stringify(ingredientId)}.`,
    );
  }
  const recipeQuote = readKegRecipeQuote(ingredientId);
  if (!recipeQuote.applicable) {
    throw new Error(
      `Keg capacity recipe is not supported. Received ingredientId=${JSON.stringify(ingredientId)}.`,
    );
  }
  return recipeQuote;
}

function calculateKegCapacityQuote(
  input: KegCapacityInput,
  machineCount: number,
): ProcessingRouteQuote {
  return calculateProcessingRoute({
    ingredientId: input.ingredientId,
    quantity: input.quantity,
    quality: "normal",
    profession: "none",
    mode: "capacity",
    deadlineDays: input.deadlineDays,
    machineCounts: {
      ...EMPTY_MACHINE_COUNTS,
      keg: machineCount,
    },
    machine: "keg",
  });
}

function calculateSteadyStateKegDemand(
  input: KegCapacityInput,
  batchInputUnits: number,
  processingMornings: number,
): number {
  const requiredMachineCycles = BigInt(input.quantity) * BigInt(processingMornings);
  const unitsPerKegInterval = BigInt(batchInputUnits) * BigInt(input.harvestIntervalDays);
  const requiredKegs = divideRoundUp(requiredMachineCycles, unitsPerKegInterval);
  return readBigIntSafeNonNegativeInteger("kegsNeededForSteadyState", requiredKegs);
}

function calculateAverageBacklogGrowth(
  input: KegCapacityInput,
  batchInputUnits: number,
  processingMornings: number,
): number {
  const cycleLength = BigInt(processingMornings);
  const incomingUnits = BigInt(input.quantity) * cycleLength;
  const machineCapacityUnits =
    BigInt(input.existingKegCount) * BigInt(input.harvestIntervalDays) * BigInt(batchInputUnits);
  if (machineCapacityUnits >= incomingUnits) {
    return 0;
  }
  return calculateSafeRatio(
    incomingUnits - machineCapacityUnits,
    cycleLength,
    "averageBacklogGrowthUnitsPerHarvestWithExistingKegs",
  );
}

function calculateSafeRatio(numerator: bigint, denominator: bigint, fieldName: string): number {
  if (denominator <= 0n) {
    throw new Error(
      `Keg capacity ${fieldName} denominator must be positive. Received: ${String(denominator)}.`,
    );
  }
  const wholeNumber = numerator / denominator;
  const remainder = numerator % denominator;
  if (
    wholeNumber > BigInt(Number.MAX_SAFE_INTEGER) ||
    (wholeNumber === BigInt(Number.MAX_SAFE_INTEGER) && remainder > 0n)
  ) {
    throw new Error(
      `Keg capacity ${fieldName} exceeds the safe integer precision range. Received numerator=${String(numerator)}, denominator=${String(denominator)}, whole=${String(wholeNumber)}, remainder=${String(remainder)}.`,
    );
  }
  return Number(wholeNumber) + Number(remainder) / Number(denominator);
}

function divideRoundUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) {
    throw new Error(
      `Keg capacity steady-state denominator must be positive. Received: ${String(denominator)}.`,
    );
  }
  return (numerator + denominator - 1n) / denominator;
}

function readBigIntSafeNonNegativeInteger(fieldName: string, value: bigint): number {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(
      `Keg capacity ${fieldName} exceeds the non-negative safe integer range. Received: ${String(value)}.`,
    );
  }
  return Number(value);
}

function readKegCapacityInput(input: KegCapacityInput): KegCapacityInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`Keg capacity input must be an object. Received: ${JSON.stringify(input)}.`);
  }
  if (typeof input.ingredientId !== "string" || input.ingredientId.trim().length === 0) {
    throw new Error(
      `Keg capacity ingredientId must be a non-empty string. Received: ${JSON.stringify(input.ingredientId)}.`,
    );
  }
  return {
    ingredientId: input.ingredientId,
    quantity: readSafeNonNegativeInteger("quantity", input.quantity),
    deadlineDays: readProcessingWindowDays(input.deadlineDays),
    existingKegCount: readSafeNonNegativeInteger("existingKegCount", input.existingKegCount),
    harvestIntervalDays: readSafePositiveInteger("harvestIntervalDays", input.harvestIntervalDays),
  };
}

function readProcessingWindowDays(value: number): KegCapacityDeadline {
  if (!KEG_CAPACITY_DEADLINES.includes(value as KegCapacityDeadline)) {
    throw new Error(
      `Keg capacity deadlineDays must be one of ${KEG_CAPACITY_DEADLINES.join(", ")}. Received: ${JSON.stringify(value)}.`,
    );
  }
  return value as KegCapacityDeadline;
}

function readSafeNonNegativeInteger(fieldName: string, value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Keg capacity ${fieldName} must be a non-negative safe integer. Received: ${JSON.stringify(value)}.`,
    );
  }
  return value;
}

function readSafePositiveInteger(fieldName: string, value: number): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(
      `Keg capacity ${fieldName} must be a positive safe integer. Received: ${JSON.stringify(value)}.`,
    );
  }
  return value;
}

function assertSafeNonNegativeInteger(fieldName: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Keg capacity result ${fieldName} is outside the supported integer range. Received: ${JSON.stringify(value)}.`,
    );
  }
}

