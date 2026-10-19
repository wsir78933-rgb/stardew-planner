export type CropSeasonName = "spring" | "summer" | "fall" | "winter";

export type SeasonProfitRouteId = "sell-raw" | "keg" | "jar" | "dehydrator";

export type FarmingProfession = "none" | "tiller" | "artisan" | "agriculturist";

export type SpeedGroKind = "none" | "speed-gro" | "deluxe" | "hyper";

export type ProcessingDeadline = "season-end" | "plus-14" | "plus-28";

export type SeedShop = "pierre" | "pierre-oasis-festival";

export type SeasonCropProfitInput = {
  readonly season: CropSeasonName;
  readonly plantingDay: number;
  readonly farmYear: number;
  readonly tileCount: number;
  readonly seedShop: SeedShop;
  readonly profession: FarmingProfession;
  readonly speedGro: SpeedGroKind;
  readonly fertilizerCostPerTile: number;
  readonly kegCount: number;
  readonly jarCount: number;
  readonly dehydratorCount: number;
  readonly processingDeadline: ProcessingDeadline;
};

const CROP_SEASONS = ["spring", "summer", "fall", "winter"] as const;
const SEED_SHOPS = ["pierre", "pierre-oasis-festival"] as const;
const PROFESSIONS = ["none", "tiller", "artisan", "agriculturist"] as const;
const SPEED_GRO_KINDS = ["none", "speed-gro", "deluxe", "hyper"] as const;
const PROCESSING_DEADLINES = ["season-end", "plus-14", "plus-28"] as const;

export function assertSeasonCropProfitInput(input: SeasonCropProfitInput): SeasonCropProfitInput {
  if (input === null || typeof input !== "object") {
    throw new Error(`season profit input is invalid: ${JSON.stringify(input)}`);
  }

  return {
    season: assertMember("season", input.season, CROP_SEASONS),
    plantingDay: assertIntegerInRange("plantingDay", input.plantingDay, 1, 28),
    farmYear: assertIntegerInRange("farmYear", input.farmYear, 1, Number.MAX_SAFE_INTEGER),
    tileCount: assertIntegerInRange("tileCount", input.tileCount, 1, Number.MAX_SAFE_INTEGER),
    seedShop: assertMember("seedShop", input.seedShop, SEED_SHOPS),
    profession: assertMember("profession", input.profession, PROFESSIONS),
    speedGro: assertMember("speedGro", input.speedGro, SPEED_GRO_KINDS),
    fertilizerCostPerTile: assertNonNegativeFinite("fertilizerCostPerTile", input.fertilizerCostPerTile),
    kegCount: assertIntegerInRange("kegCount", input.kegCount, 0, Number.MAX_SAFE_INTEGER),
    jarCount: assertIntegerInRange("jarCount", input.jarCount, 0, Number.MAX_SAFE_INTEGER),
    dehydratorCount: assertIntegerInRange(
      "dehydratorCount",
      input.dehydratorCount,
      0,
      Number.MAX_SAFE_INTEGER,
    ),
    processingDeadline: assertMember("processingDeadline", input.processingDeadline, PROCESSING_DEADLINES),
  };
}

export function processingExtensionDays(processingDeadline: ProcessingDeadline): number {
  if (processingDeadline === "season-end") return 0;
  if (processingDeadline === "plus-14") return 14;
  return 28;
}

function assertMember<T extends string>(fieldName: string, value: unknown, allowed: readonly T[]): T {
  if (typeof value === "string" && allowed.includes(value as T)) {
    return value as T;
  }
  throw new Error(`${fieldName} is invalid: ${JSON.stringify(value)}`);
}

function assertIntegerInRange(fieldName: string, value: unknown, minimum: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${fieldName} is invalid: ${JSON.stringify(value)}`);
  }
  return value;
}

function assertNonNegativeFinite(fieldName: string, value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldName} is invalid: ${JSON.stringify(value)}`);
  }
  return value;
}
