import {
  parseCropSeason,
  parseSpeedGroOption,
  type CropSeason,
  type SpeedGroOption,
} from "./planting-field-values";

export const cropProfitStorageKey = "stardew-tools:crop-profit";

export const seedShops = ["pierre", "pierre-oasis-festival"] as const;

export type SeedShop = (typeof seedShops)[number];

export const farmingProfessions = ["none", "tiller", "artisan", "agriculturist"] as const;

export type FarmingProfession = (typeof farmingProfessions)[number];

export const processingDeadlines = ["season-end", "plus-14", "plus-28"] as const;

export type ProcessingDeadline = (typeof processingDeadlines)[number];

export type CropProfitForm = Readonly<{
  season: CropSeason;
  plantingDay: number;
  farmYear: number;
  tileCount: number;
  seedShop: SeedShop;
  profession: FarmingProfession;
  speedGro: SpeedGroOption;
  fertilizerCostPerTile: number;
  kegCount: number;
  jarCount: number;
  dehydratorCount: number;
  processingDeadline: ProcessingDeadline;
}>;

function parseWholeNumber(rawValue: string, label: string): number {
  if (!/^\d+$/.test(rawValue.trim())) {
    throw new Error(`${label} must be an integer. Received: ${JSON.stringify(rawValue)}.`);
  }

  return Number(rawValue);
}

export function parseFarmYear(rawValue: string): number {
  const farmYear = parseWholeNumber(rawValue, "Farm year");
  if (farmYear < 1) {
    throw new Error(`Farm year must be an integer of at least 1. Received: ${JSON.stringify(farmYear)}.`);
  }

  return farmYear;
}

export function parseTileCount(rawValue: string): number {
  const tileCount = parseWholeNumber(rawValue, "Tile count");
  if (tileCount < 1) {
    throw new Error(`Tile count must be a positive integer. Received: ${JSON.stringify(tileCount)}.`);
  }

  return tileCount;
}

export function parseMachineCount(rawValue: string, machineName: string): number {
  const machineCount = parseWholeNumber(rawValue, machineName);
  if (machineCount < 0) {
    throw new Error(
      `${machineName} count must be an integer of at least 0. Received: ${JSON.stringify(machineCount)}.`,
    );
  }

  return machineCount;
}

export function parseFertilizerCostPerTile(rawValue: string): number {
  if (!/^\d+(\.\d+)?$/.test(rawValue.trim())) {
    throw new Error(
      `Fertilizer cost per tile must be a non-negative number. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const fertilizerCostPerTile = Number(rawValue);
  if (!Number.isFinite(fertilizerCostPerTile) || fertilizerCostPerTile < 0) {
    throw new Error(
      `Fertilizer cost per tile must be a non-negative number. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return fertilizerCostPerTile;
}

export function parseSeedShop(rawValue: unknown): SeedShop {
  if (seedShops.includes(rawValue as SeedShop)) {
    return rawValue as SeedShop;
  }

  throw new Error(
    `Seed source must be pierre or pierre-oasis-festival. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parseFarmingProfession(rawValue: unknown): FarmingProfession {
  if (farmingProfessions.includes(rawValue as FarmingProfession)) {
    return rawValue as FarmingProfession;
  }

  throw new Error(
    `Profession must be none, tiller, artisan, or agriculturist. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parseProcessingDeadline(rawValue: unknown): ProcessingDeadline {
  if (processingDeadlines.includes(rawValue as ProcessingDeadline)) {
    return rawValue as ProcessingDeadline;
  }

  throw new Error(
    `Processing deadline must be season-end, plus-14, or plus-28. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function createDefaultCropProfitForm(): CropProfitForm {
  return {
    season: "spring",
    plantingDay: 1,
    farmYear: 1,
    tileCount: 40,
    seedShop: "pierre",
    profession: "none",
    speedGro: "none",
    fertilizerCostPerTile: 0,
    kegCount: 0,
    jarCount: 0,
    dehydratorCount: 0,
    processingDeadline: "plus-28",
  };
}

function readRequiredField(record: Record<string, unknown>, fieldName: string): unknown {
  if (!Object.hasOwn(record, fieldName)) {
    throw new Error(
      `Crop profit settings are missing ${fieldName}. Received: ${JSON.stringify(record)}.`,
    );
  }

  return record[fieldName];
}

function readStoredInteger(record: Record<string, unknown>, fieldName: string): number {
  const rawValue = readRequiredField(record, fieldName);
  if (typeof rawValue !== "number" || !Number.isInteger(rawValue)) {
    throw new Error(
      `Crop profit settings field ${fieldName} must be an integer. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

export function readCropProfitForm(rawValue: unknown): CropProfitForm {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    throw new Error(
      `Crop profit settings must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const plantingDay = readStoredInteger(record, "plantingDay");
  const farmYear = readStoredInteger(record, "farmYear");
  const tileCount = readStoredInteger(record, "tileCount");
  const kegCount = readStoredInteger(record, "kegCount");
  const jarCount = readStoredInteger(record, "jarCount");
  const dehydratorCount = readStoredInteger(record, "dehydratorCount");
  const fertilizerCostPerTile = readRequiredField(record, "fertilizerCostPerTile");

  if (
    typeof fertilizerCostPerTile !== "number" ||
    !Number.isFinite(fertilizerCostPerTile)
  ) {
    throw new Error(
      `Crop profit settings field fertilizerCostPerTile must be a finite number. Received: ${JSON.stringify(fertilizerCostPerTile)}.`,
    );
  }

  const form: CropProfitForm = {
    season: parseCropSeason(readRequiredField(record, "season")),
    plantingDay,
    farmYear,
    tileCount,
    seedShop: parseSeedShop(readRequiredField(record, "seedShop")),
    profession: parseFarmingProfession(readRequiredField(record, "profession")),
    speedGro: parseSpeedGroOption(readRequiredField(record, "speedGro")),
    fertilizerCostPerTile,
    kegCount,
    jarCount,
    dehydratorCount,
    processingDeadline: parseProcessingDeadline(readRequiredField(record, "processingDeadline")),
  };

  if (form.plantingDay < 1 || form.plantingDay > 28) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(form.plantingDay)}.`,
    );
  }
  if (form.farmYear < 1) {
    throw new Error(
      `Farm year must be an integer of at least 1. Received: ${JSON.stringify(form.farmYear)}.`,
    );
  }
  if (form.tileCount < 1) {
    throw new Error(
      `Tile count must be a positive integer. Received: ${JSON.stringify(form.tileCount)}.`,
    );
  }
  if (form.fertilizerCostPerTile < 0) {
    throw new Error(
      `Fertilizer cost per tile must be a non-negative number. Received: ${JSON.stringify(form.fertilizerCostPerTile)}.`,
    );
  }
  for (const [machineName, machineCount] of [
    ["Keg", form.kegCount],
    ["Preserves jar", form.jarCount],
    ["Dehydrator", form.dehydratorCount],
  ] as const) {
    if (machineCount < 0) {
      throw new Error(
        `${machineName} count must be an integer of at least 0. Received: ${JSON.stringify(machineCount)}.`,
      );
    }
  }

  return form;
}

export function parseCropProfitForm(storageText: string): CropProfitForm {
  let parsed: unknown;
  try {
    parsed = JSON.parse(storageText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Crop profit settings must be JSON. Received: ${JSON.stringify(storageText)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  return readCropProfitForm(parsed);
}

export function loadCropProfitForm(storageText: string | null): CropProfitForm {
  if (storageText === null) {
    return createDefaultCropProfitForm();
  }

  try {
    return parseCropProfitForm(storageText);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Received:")) {
      return createDefaultCropProfitForm();
    }

    throw error;
  }
}

export function serializeCropProfitForm(form: CropProfitForm): string {
  return JSON.stringify(readCropProfitForm(form));
}
