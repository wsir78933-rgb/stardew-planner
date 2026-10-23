import {
  getProcessingIngredient,
  listProcessingIngredients,
  type ProcessingIngredient,
} from "./processing-model";

export const caskAgingQualities = ["normal", "silver", "gold", "iridium"] as const;
export type CaskAgingQuality = (typeof caskAgingQualities)[number];

export const caskAgingTargetQualities = ["silver", "gold", "iridium"] as const;
export type CaskAgingTargetQuality = (typeof caskAgingTargetQualities)[number];

export const caskAgingSeasons = ["spring", "summer", "fall", "winter"] as const;
export type CaskAgingSeason = (typeof caskAgingSeasons)[number];

export const caskAgingProfessions = ["none", "artisan"] as const;
export type CaskAgingProfession = (typeof caskAgingProfessions)[number];

export const caskAgingStorageKey = "stardew-tools:cask-aging";

export type CaskAgingForm = Readonly<{
  ingredientId: string;
  currentQuality: CaskAgingQuality;
  targetQuality: CaskAgingTargetQuality;
  season: CaskAgingSeason;
  day: number;
  year: number;
  wineBottleCount: number;
  emptyCaskCount: number;
  profession: CaskAgingProfession;
}>;

export type CaskAgingDate = Readonly<{
  season: CaskAgingSeason;
  day: number;
  year: number;
}>;

export type CaskAgingTargetProjection = Readonly<{
  quality: CaskAgingTargetQuality;
  status: "aging" | "already-at-target" | "target-below-current";
  remainingDays: number | null;
  collectionDate: CaskAgingDate | null;
  wineValue: number;
  addedGoldPerBottle: number;
  addedGoldPerCaskDay: number;
}>;

export type CaskAgingProjection = Readonly<{
  ingredient: ProcessingIngredient;
  currentWineValue: number;
  selectedTarget: CaskAgingTargetProjection;
  targetOptions: readonly CaskAgingTargetProjection[];
  bottlesToAgeNow: number;
  bottlesWaitingForCasks: number;
  addedGoldForBottlesToAgeNow: number;
  additionalCasksNeeded: number;
  woodNeeded: number;
  hardwoodNeeded: number;
  fullCyclesIn112Days: number;
  bottlesIn112Days: number;
}>;

const qualityPriceMultipliers: Readonly<Record<CaskAgingQuality, number>> = {
  normal: 1,
  silver: 1.25,
  gold: 1.5,
  iridium: 2,
};

const daysToNextQuality: Readonly<Record<Exclude<CaskAgingQuality, "iridium">, number>> = {
  normal: 14,
  silver: 14,
  gold: 28,
};

const seasonOrder = caskAgingSeasons;
const daysPerSeason = 28;
const daysPerYear = daysPerSeason * seasonOrder.length;
const maximumCaskAgingDays = 56;
export const caskAgingMaximumYear =
  Math.floor((Number.MAX_SAFE_INTEGER - (daysPerYear - 1 + maximumCaskAgingDays)) / daysPerYear) +
  1;
const cellarWindowDays = 112;
const woodPerCask = 20;
const hardwoodPerCask = 1;

export function listCaskAgingIngredients(): readonly ProcessingIngredient[] {
  const eligibleIngredients = listProcessingIngredients().filter(
    (ingredient) => ingredient.canAgeWine,
  );

  if (eligibleIngredients.length === 0) {
    throw new Error("Cask aging requires at least one wine-capable ingredient. Received: []");
  }

  return eligibleIngredients;
}

export function getCaskAgingMaximumBottleCount(ingredientId: string): number {
  const ingredient = getProcessingIngredient(ingredientId);
  if (!ingredient.canAgeWine) {
    throw new Error(
      `Cask aging requires a wine-capable ingredient. Received ingredientId=${JSON.stringify(ingredientId)}, canAgeWine=${JSON.stringify(ingredient.canAgeWine)}.`,
    );
  }
  return getMaximumBottleCountForIngredient(ingredient);
}

export function createDefaultCaskAgingForm(): CaskAgingForm {
  const firstWineIngredient = listCaskAgingIngredients()[0];
  if (firstWineIngredient === undefined) {
    throw new Error("Cask aging requires a default wine ingredient. Received: []");
  }

  return {
    ingredientId: firstWineIngredient.id,
    currentQuality: "normal",
    targetQuality: "silver",
    season: "spring",
    day: 1,
    year: 1,
    wineBottleCount: 1,
    emptyCaskCount: 1,
    profession: "none",
  };
}

export function readCaskAgingForm(rawValue: unknown): CaskAgingForm {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    throw new Error(`Cask aging settings must be an object. Received: ${describeValue(rawValue)}.`);
  }

  const record = rawValue as Record<string, unknown>;
  const ingredientId = readNonEmptyString(record.ingredientId, "ingredientId");
  const ingredient = getProcessingIngredient(ingredientId);
  if (!ingredient.canAgeWine) {
    throw new Error(
      `Cask aging requires a wine-capable ingredient. Received ingredientId=${JSON.stringify(ingredientId)}, canAgeWine=${JSON.stringify(ingredient.canAgeWine)}.`,
    );
  }
  const maximumBottleCount = getMaximumBottleCountForIngredient(ingredient);

  const form: CaskAgingForm = {
    ingredientId,
    currentQuality: readEnum(record.currentQuality, "currentQuality", caskAgingQualities),
    targetQuality: readEnum(record.targetQuality, "targetQuality", caskAgingTargetQualities),
    season: readEnum(record.season, "season", caskAgingSeasons),
    day: readInteger(record.day, "day", 1, daysPerSeason),
    year: readInteger(record.year, "year", 1, caskAgingMaximumYear),
    wineBottleCount: readInteger(record.wineBottleCount, "wineBottleCount", 0, maximumBottleCount),
    emptyCaskCount: readInteger(record.emptyCaskCount, "emptyCaskCount", 0, maximumBottleCount),
    profession: readEnum(record.profession, "profession", caskAgingProfessions),
  };

  return form;
}

export function parseCaskAgingForm(storageText: string): CaskAgingForm {
  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storageText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Cask aging settings must be JSON. Received: ${JSON.stringify(storageText)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  return readCaskAgingForm(parsedValue);
}

export function isCaskAgingFormValidationError(error: unknown): error is Error {
  if (!(error instanceof Error)) return false;

  return (
    error.message.startsWith("Cask aging settings must be JSON.") ||
    error.message.startsWith("Cask aging settings must be an object.") ||
    error.message.startsWith("Cask aging field ") ||
    error.message.startsWith("Cask aging requires a wine-capable ingredient.") ||
    error.message.startsWith("Unknown processing ingredientId:")
  );
}

export function loadCaskAgingForm(storageText: string | null): CaskAgingForm {
  return storageText === null
    ? createDefaultCaskAgingForm()
    : parseCaskAgingForm(storageText);
}

export function serializeCaskAgingForm(form: CaskAgingForm): string {
  return JSON.stringify(readCaskAgingForm(form));
}

export function projectCaskAging(form: CaskAgingForm): CaskAgingProjection {
  const validatedForm = readCaskAgingForm(form);
  const ingredient = getProcessingIngredient(validatedForm.ingredientId);
  const currentWineValue = calculateWineValue(
    ingredient.basePrice,
    validatedForm.currentQuality,
    validatedForm.profession,
  );
  const startDate: CaskAgingDate = {
    season: validatedForm.season,
    day: validatedForm.day,
    year: validatedForm.year,
  };
  const targetOptions = caskAgingTargetQualities.map((quality) =>
    projectTargetQuality(
      quality,
      validatedForm.currentQuality,
      currentWineValue,
      ingredient.basePrice,
      validatedForm.profession,
      startDate,
    ),
  );
  const selectedTarget = targetOptions.find(
    (option) => option.quality === validatedForm.targetQuality,
  );
  if (selectedTarget === undefined) {
    throw new Error(
      `targetQuality is missing from cask aging options. Received: ${JSON.stringify(validatedForm.targetQuality)}.`,
    );
  }

  const bottlesToAgeNow =
    selectedTarget.status === "aging"
      ? Math.min(validatedForm.wineBottleCount, validatedForm.emptyCaskCount)
      : 0;
  const bottlesWaitingForCasks =
    selectedTarget.status === "aging"
      ? Math.max(0, validatedForm.wineBottleCount - validatedForm.emptyCaskCount)
      : 0;
  const additionalCasksNeeded = bottlesWaitingForCasks;
  const addedGoldForBottlesToAgeNow =
    selectedTarget.status === "aging"
      ? multiplySafely(
          "addedGoldForBottlesToAgeNow",
          selectedTarget.addedGoldPerBottle,
          bottlesToAgeNow,
        )
      : 0;
  const fullCycleDays = daysBetweenQualities("normal", validatedForm.targetQuality);
  if (fullCycleDays === null || fullCycleDays === 0) {
    throw new Error(
      `Full cask cycle duration is invalid. Received targetQuality=${JSON.stringify(validatedForm.targetQuality)}, durationDays=${JSON.stringify(fullCycleDays)}.`,
    );
  }

  const fullCyclesIn112Days = Math.floor(cellarWindowDays / fullCycleDays);

  return {
    ingredient,
    currentWineValue,
    selectedTarget,
    targetOptions,
    bottlesToAgeNow,
    bottlesWaitingForCasks,
    addedGoldForBottlesToAgeNow,
    additionalCasksNeeded,
    woodNeeded: multiplySafely("woodNeeded", additionalCasksNeeded, woodPerCask),
    hardwoodNeeded: multiplySafely("hardwoodNeeded", additionalCasksNeeded, hardwoodPerCask),
    fullCyclesIn112Days,
    bottlesIn112Days: multiplySafely(
      "bottlesIn112Days",
      validatedForm.emptyCaskCount,
      fullCyclesIn112Days,
    ),
  };
}

function projectTargetQuality(
  targetQuality: CaskAgingTargetQuality,
  currentQuality: CaskAgingQuality,
  currentWineValue: number,
  baseFruitPrice: number,
  profession: CaskAgingProfession,
  startDate: CaskAgingDate,
): CaskAgingTargetProjection {
  const remainingDays = daysBetweenQualities(currentQuality, targetQuality);
  const targetWineValue = calculateWineValue(baseFruitPrice, targetQuality, profession);

  if (remainingDays === null) {
    return {
      quality: targetQuality,
      status: "target-below-current",
      remainingDays: null,
      collectionDate: null,
      wineValue: targetWineValue,
      addedGoldPerBottle: 0,
      addedGoldPerCaskDay: 0,
    };
  }

  if (remainingDays === 0) {
    return {
      quality: targetQuality,
      status: "already-at-target",
      remainingDays: 0,
      collectionDate: startDate,
      wineValue: targetWineValue,
      addedGoldPerBottle: 0,
      addedGoldPerCaskDay: 0,
    };
  }

  const addedGoldPerBottle = targetWineValue - currentWineValue;
  if (addedGoldPerBottle < 0) {
    throw new Error(
      `Cask aging value must not decrease for a higher target. Received: ${JSON.stringify({ currentWineValue, targetWineValue, currentQuality, targetQuality })}.`,
    );
  }

  return {
    quality: targetQuality,
    status: "aging",
    remainingDays,
    collectionDate: addDaysToDate(startDate, remainingDays),
    wineValue: targetWineValue,
    addedGoldPerBottle,
    addedGoldPerCaskDay: addedGoldPerBottle / remainingDays,
  };
}

function daysBetweenQualities(
  currentQuality: CaskAgingQuality,
  targetQuality: CaskAgingQuality,
): number | null {
  const currentIndex = caskAgingQualities.indexOf(currentQuality);
  const targetIndex = caskAgingQualities.indexOf(targetQuality);
  if (currentIndex < 0 || targetIndex < 0) {
    throw new Error(
      `Cask aging quality is invalid. Received: ${JSON.stringify({ currentQuality, targetQuality })}.`,
    );
  }
  if (targetIndex < currentIndex) return null;
  if (targetIndex === currentIndex) return 0;

  let remainingDays = 0;
  for (let qualityIndex = currentIndex; qualityIndex < targetIndex; qualityIndex += 1) {
    const quality = caskAgingQualities[qualityIndex];
    if (quality === undefined || quality === "iridium") {
      throw new Error(
        `Cask aging transition is missing a duration. Received qualityIndex=${JSON.stringify(qualityIndex)}, quality=${JSON.stringify(quality)}.`,
      );
    }
    remainingDays += daysToNextQuality[quality];
  }

  return remainingDays;
}

function calculateWineValue(
  baseFruitPrice: number,
  quality: CaskAgingQuality,
  profession: CaskAgingProfession,
): number {
  if (!Number.isFinite(baseFruitPrice) || baseFruitPrice <= 0) {
    throw new Error(
      `baseFruitPrice is invalid. Received: ${JSON.stringify(baseFruitPrice)}.`,
    );
  }

  const artisanMultiplier = profession === "artisan" ? 1.4 : 1;
  const wineBaseValue = baseFruitPrice * 3;
  // The game rounds the Wine's quality value before applying the Artisan bonus.
  const qualityAdjustedValue = Math.floor(
    wineBaseValue * qualityPriceMultipliers[quality] + 1e-9,
  );
  const wineValue = Math.floor(qualityAdjustedValue * artisanMultiplier + 1e-9);
  if (!Number.isSafeInteger(wineValue)) {
    throw new Error(
      `Wine value is outside the supported integer range. Received: ${JSON.stringify({ baseFruitPrice, quality, profession, wineValue })}.`,
    );
  }
  return wineValue;
}

function getMaximumBottleCountForIngredient(ingredient: ProcessingIngredient): number {
  const maximumWineValue = calculateWineValue(ingredient.basePrice, "iridium", "artisan");
  return Math.floor(Number.MAX_SAFE_INTEGER / maximumWineValue);
}

function multiplySafely(fieldName: string, leftValue: number, rightValue: number): number {
  const product = leftValue * rightValue;
  if (!Number.isSafeInteger(product)) {
    throw new Error(
      `Cask aging ${fieldName} is outside the supported integer range. Received: ${JSON.stringify({ leftValue, rightValue, product })}.`,
    );
  }
  return product;
}

function addDaysToDate(startDate: CaskAgingDate, daysToAdd: number): CaskAgingDate {
  const startAbsoluteDay =
    (startDate.year - 1) * daysPerYear +
    seasonOrder.indexOf(startDate.season) * daysPerSeason +
    (startDate.day - 1);
  const finalAbsoluteDay = startAbsoluteDay + daysToAdd;
  if (!Number.isSafeInteger(finalAbsoluteDay) || finalAbsoluteDay < 0) {
    throw new Error(
      `Cask collection date is outside the supported calendar. Received: ${JSON.stringify({ startDate, daysToAdd, finalAbsoluteDay })}.`,
    );
  }

  const year = Math.floor(finalAbsoluteDay / daysPerYear) + 1;
  const dayOfYear = finalAbsoluteDay % daysPerYear;
  const seasonIndex = Math.floor(dayOfYear / daysPerSeason);
  const season = seasonOrder[seasonIndex];
  if (season === undefined) {
    throw new Error(
      `Cask collection season is invalid. Received: ${JSON.stringify({ finalAbsoluteDay, seasonIndex })}.`,
    );
  }

  return {
    season,
    day: (dayOfYear % daysPerSeason) + 1,
    year,
  };
}

function readNonEmptyString(rawValue: unknown, fieldName: string): string {
  if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
    throw new Error(
      `Cask aging field ${fieldName} must be a non-empty string. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function readInteger(
  rawValue: unknown,
  fieldName: string,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue < minimum ||
    rawValue > maximum
  ) {
    throw new Error(
      `Cask aging field ${fieldName} must be an integer from ${minimum} to ${maximum}. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function readEnum<Value extends string>(
  rawValue: unknown,
  fieldName: string,
  allowedValues: readonly Value[],
): Value {
  if (typeof rawValue === "string" && allowedValues.includes(rawValue as Value)) {
    return rawValue as Value;
  }
  throw new Error(
    `Cask aging field ${fieldName} is invalid. Received: ${describeValue(rawValue)}.`,
  );
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
