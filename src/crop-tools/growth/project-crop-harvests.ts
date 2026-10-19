// ValleyMath crop growth calculator, Stardew 1.6.x.
// Planting day is day 0. Speed-Gro removes days from growth stages and does not change regrow intervals.

import { getFieldCrop, type CropSeason, type FieldCrop } from "../catalog/field-crops";

export type { CropSeason };

export type GrowthFertilizer = "none" | "speed-gro" | "deluxe-speed-gro" | "hyper-speed-gro";

export type SpeedGroSetting = "none" | "speed-gro" | "deluxe" | "hyper";

export type CropLocation = "outdoor" | "greenhouse" | "ginger-island";

export type AfterHarvest = "regrow" | "replant-same-day" | "leave-empty" | "no-replant";

export type CropHarvestInput = {
  readonly cropId: string;
  readonly season: CropSeason;
  readonly plantDay?: number;
  readonly plantingDay?: number;
  readonly fertilizer?: GrowthFertilizer;
  readonly speedGro?: SpeedGroSetting;
  readonly agriculturist: boolean;
  readonly missedWateringDays: number;
  readonly location: CropLocation;
  readonly afterHarvest: AfterHarvest;
};

type ResolvedCropHarvestInput = {
  readonly cropId: string;
  readonly season: CropSeason;
  readonly plantingDay: number;
  readonly fertilizer: GrowthFertilizer;
  readonly agriculturist: boolean;
  readonly missedWateringDays: number;
  readonly location: CropLocation;
  readonly afterHarvest: "regrow" | "replant-same-day" | "no-replant";
};

export type CalendarPosition = {
  readonly season: CropSeason;
  readonly day: number;
  readonly yearOffset: number;
};

export type HarvestMarkerKind = "plant" | "harvest" | "replant";

export type HarvestMarker = CalendarPosition & {
  readonly marker: HarvestMarkerKind;
};

export type ListedHarvest = {
  readonly season: CropSeason;
  readonly day: number;
  readonly replantedSameDay: boolean;
};

export type CropHarvestProjection = {
  readonly cropId: string;
  readonly growthDays: number;
  readonly growDays: number;
  readonly regrowIntervalDays: number | null;
  readonly firstHarvest: { readonly season: CropSeason; readonly day: number } | null;
  readonly firstMature: CalendarPosition;
  readonly harvests: readonly ListedHarvest[];
  readonly harvestCount: number;
  readonly outdoorSeasonDeadlineDay: number | null;
  readonly lastSafePlantingDay: number | null;
  readonly lastSafePlant: CalendarPosition | null;
  readonly seasonCheck: "harvestable" | "past-deadline";
  readonly markers: readonly HarvestMarker[];
  readonly canHarvest: boolean;
  readonly pastDeadline: boolean;
};

const SEASONS: readonly CropSeason[] = ["spring", "summer", "fall", "winter"];
const DAYS_PER_SEASON = 28;
const DAYS_PER_YEAR = DAYS_PER_SEASON * SEASONS.length;
const FERTILIZER_RATES: Readonly<Record<GrowthFertilizer, number>> = {
  none: 0,
  "speed-gro": 0.1,
  "deluxe-speed-gro": 0.25,
  "hyper-speed-gro": 0.33,
};
const AGRICULTURIST_RATE = 0.1;
const MAX_STAGE_REDUCTION_PASSES = 3;
const PROTECTED_WINDOW_DAYS = 28;

function formatReceived(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return Object.prototype.toString.call(value);
}

function requireObject(input: CropHarvestInput): CropHarvestInput {
  if (input === null || typeof input !== "object") {
    throw new TypeError(
      `CropHarvestInput must be an object. Received: ${formatReceived(input)}`,
    );
  }
  return input;
}

function requireSeason(season: CropSeason): CropSeason {
  if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") {
    throw new TypeError(
      `season must be "spring", "summer", "fall", or "winter". Received: ${formatReceived(season)}`,
    );
  }
  return season;
}

function requireFertilizer(fertilizer: GrowthFertilizer): GrowthFertilizer {
  if (
    fertilizer !== "none" &&
    fertilizer !== "speed-gro" &&
    fertilizer !== "deluxe-speed-gro" &&
    fertilizer !== "hyper-speed-gro"
  ) {
    throw new TypeError(
      `fertilizer must be "none", "speed-gro", "deluxe-speed-gro", or "hyper-speed-gro". Received: ${formatReceived(fertilizer)}`,
    );
  }
  return fertilizer;
}

function requireLocation(location: CropLocation): CropLocation {
  if (location !== "outdoor" && location !== "greenhouse" && location !== "ginger-island") {
    throw new TypeError(
      `location must be "outdoor", "greenhouse", or "ginger-island". Received: ${formatReceived(location)}`,
    );
  }
  return location;
}

function requireAfterHarvest(
  afterHarvest: AfterHarvest,
): ResolvedCropHarvestInput["afterHarvest"] {
  if (afterHarvest === "leave-empty" || afterHarvest === "no-replant") {
    return "no-replant";
  }
  if (afterHarvest === "regrow" || afterHarvest === "replant-same-day") {
    return afterHarvest;
  }
  throw new TypeError(
    `afterHarvest must be "regrow", "replant-same-day", "leave-empty", or "no-replant". Received: ${formatReceived(afterHarvest)}`,
  );
}

function requireSpeedGro(speedGro: SpeedGroSetting): SpeedGroSetting {
  if (
    speedGro !== "none" &&
    speedGro !== "speed-gro" &&
    speedGro !== "deluxe" &&
    speedGro !== "hyper"
  ) {
    throw new TypeError(
      `speedGro must be "none", "speed-gro", "deluxe", or "hyper". Received: ${formatReceived(speedGro)}`,
    );
  }
  return speedGro;
}

function speedGroFertilizer(speedGro: SpeedGroSetting): GrowthFertilizer {
  if (speedGro === "none" || speedGro === "speed-gro") {
    return speedGro;
  }
  if (speedGro === "deluxe") {
    return "deluxe-speed-gro";
  }
  if (speedGro === "hyper") {
    return "hyper-speed-gro";
  }
  throw new TypeError(
    `speedGro must be "none", "speed-gro", "deluxe", or "hyper". Received: ${formatReceived(speedGro)}`,
  );
}

function requireIntegerInRange(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number. Received: ${formatReceived(value)}`);
  }
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(
      `${label} must be an integer from ${minimum} to ${maximum}. Received: ${value}`,
    );
  }
  return value;
}

function readPlantingDay(record: CropHarvestInput): number {
  if (record.plantDay !== undefined) {
    return requireIntegerInRange(record.plantDay, "plantDay", 1, 28);
  }
  return requireIntegerInRange(record.plantingDay as number, "plantingDay", 1, 28);
}

function readFertilizer(record: CropHarvestInput): GrowthFertilizer {
  if (record.fertilizer !== undefined) {
    return requireFertilizer(record.fertilizer);
  }
  return speedGroFertilizer(requireSpeedGro(record.speedGro as SpeedGroSetting));
}

function validateCropHarvestInput(input: CropHarvestInput): ResolvedCropHarvestInput {
  const record = requireObject(input);
  if (typeof record.agriculturist !== "boolean") {
    throw new TypeError(
      `agriculturist must be a boolean. Received: ${formatReceived(record.agriculturist)}`,
    );
  }
  return {
    cropId: record.cropId,
    season: requireSeason(record.season),
    plantingDay: readPlantingDay(record),
    fertilizer: readFertilizer(record),
    agriculturist: record.agriculturist,
    missedWateringDays: requireIntegerInRange(
      record.missedWateringDays,
      "missedWateringDays",
      0,
      14,
    ),
    location: requireLocation(record.location),
    afterHarvest: requireAfterHarvest(record.afterHarvest),
  };
}

function sumStageDays(stageDays: readonly number[]): number {
  let totalDays = 0;
  for (const stageDayCount of stageDays) {
    totalDays += stageDayCount;
  }
  return totalDays;
}

function fertilizedGrowthDays(
  stageDays: readonly number[],
  fertilizer: GrowthFertilizer,
  agriculturist: boolean,
): number {
  const reducedStageDays = stageDays.slice();
  const speedRate = FERTILIZER_RATES[fertilizer] + (agriculturist ? AGRICULTURIST_RATE : 0);
  let daysToRemove = Math.ceil(sumStageDays(stageDays) * speedRate);
  let passes = 0;
  while (daysToRemove > 0 && passes < MAX_STAGE_REDUCTION_PASSES) {
    for (let stageIndex = 0; stageIndex < reducedStageDays.length && daysToRemove > 0; stageIndex += 1) {
      const stageDayCount = reducedStageDays[stageIndex] ?? 0;
      if (stageIndex > 0 || stageDayCount > 1) {
        reducedStageDays[stageIndex] = stageDayCount - 1;
        daysToRemove -= 1;
      }
    }
    passes += 1;
  }
  return sumStageDays(reducedStageDays);
}

function seasonIndex(season: CropSeason): number {
  const index = SEASONS.indexOf(season);
  if (index < 0) {
    throw new TypeError(`season must be a crop season. Received: ${formatReceived(season)}`);
  }
  return index;
}

function absoluteDay(season: CropSeason, day: number, yearOffset = 0): number {
  return yearOffset * DAYS_PER_YEAR + seasonIndex(season) * DAYS_PER_SEASON + (day - 1);
}

function calendarPosition(absolute: number): CalendarPosition {
  const yearOffset = Math.floor(absolute / DAYS_PER_YEAR);
  const dayOfYear = absolute - yearOffset * DAYS_PER_YEAR;
  const index = Math.floor(dayOfYear / DAYS_PER_SEASON);
  const season = SEASONS[index];
  if (!season) {
    throw new RangeError(
      `absolute day ${absolute} does not land in a season. seasonIndex: ${index}`,
    );
  }
  return {
    season,
    day: (dayOfYear % DAYS_PER_SEASON) + 1,
    yearOffset,
  };
}

function seasonEndAbsoluteDay(season: CropSeason): number {
  return seasonIndex(season) * DAYS_PER_SEASON + (DAYS_PER_SEASON - 1);
}

function lastConsecutiveLegalDay(crop: FieldCrop, startSeason: CropSeason): number | null {
  if (!crop.seasons.includes(startSeason)) {
    return null;
  }
  let lastIndex = seasonIndex(startSeason);
  while (lastIndex + 1 < SEASONS.length) {
    const nextSeason = SEASONS[lastIndex + 1];
    if (!nextSeason || !crop.seasons.includes(nextSeason)) {
      break;
    }
    lastIndex += 1;
  }
  return lastIndex * DAYS_PER_SEASON + (DAYS_PER_SEASON - 1);
}

function isProtectedLocation(location: CropLocation): boolean {
  return location === "greenhouse" || location === "ginger-island";
}

type HarvestSchedule = {
  readonly harvestAbsoluteDays: readonly number[];
  readonly replantAbsoluteDays: readonly number[];
};

function scheduleHarvests(
  firstMatureAbsoluteDay: number,
  windowEndAbsoluteDay: number,
  maturityDays: number,
  regrowIntervalDays: number | null,
  afterHarvest: AfterHarvest,
): HarvestSchedule {
  if (firstMatureAbsoluteDay > windowEndAbsoluteDay) {
    return { harvestAbsoluteDays: [], replantAbsoluteDays: [] };
  }
  const harvestAbsoluteDays = [firstMatureAbsoluteDay];
  if (afterHarvest === "no-replant" || (afterHarvest === "regrow" && regrowIntervalDays === null)) {
    return { harvestAbsoluteDays, replantAbsoluteDays: [] };
  }
  if (afterHarvest === "regrow") {
    if (regrowIntervalDays === null || regrowIntervalDays < 1) {
      throw new RangeError(
        `regrowIntervalDays must be an integer greater than or equal to 1. Received: ${regrowIntervalDays}`,
      );
    }
    let nextHarvest = firstMatureAbsoluteDay + regrowIntervalDays;
    while (nextHarvest <= windowEndAbsoluteDay) {
      harvestAbsoluteDays.push(nextHarvest);
      nextHarvest += regrowIntervalDays;
    }
    return { harvestAbsoluteDays, replantAbsoluteDays: [] };
  }
  const replantAbsoluteDays: number[] = [];
  let harvestAbsoluteDay = firstMatureAbsoluteDay;
  let nextHarvest = harvestAbsoluteDay + maturityDays;
  while (nextHarvest <= windowEndAbsoluteDay) {
    replantAbsoluteDays.push(harvestAbsoluteDay);
    harvestAbsoluteDays.push(nextHarvest);
    harvestAbsoluteDay = nextHarvest;
    nextHarvest += maturityDays;
  }
  return { harvestAbsoluteDays, replantAbsoluteDays };
}

function buildMarkers(
  plantAbsoluteDay: number,
  windowEndAbsoluteDay: number,
  harvestAbsoluteDays: readonly number[],
  replantAbsoluteDays: readonly number[],
): readonly HarvestMarker[] {
  const replantDays = new Set(replantAbsoluteDays);
  const harvestDays = new Set(harvestAbsoluteDays);
  const markedDays = new Set<number>([plantAbsoluteDay, ...harvestAbsoluteDays, ...replantAbsoluteDays]);
  return [...markedDays]
    .filter((day) => day >= plantAbsoluteDay && day <= windowEndAbsoluteDay)
    .sort((left, right) => left - right)
    .map((day) => {
      const position = calendarPosition(day);
      let marker: HarvestMarkerKind = "plant";
      if (replantDays.has(day)) {
        marker = "replant";
      } else if (harvestDays.has(day)) {
        marker = "harvest";
      }
      return { ...position, marker };
    });
}

export function projectCropHarvests(input: CropHarvestInput): CropHarvestProjection {
  const validated = validateCropHarvestInput(input);
  const crop = getFieldCrop(validated.cropId);
  const maturityDays =
    fertilizedGrowthDays(crop.growthStages, validated.fertilizer, validated.agriculturist) +
    validated.missedWateringDays;
  if (maturityDays < 1) {
    throw new RangeError(`maturityDays must be at least 1. Received: ${maturityDays}`);
  }
  const plantAbsoluteDay = absoluteDay(validated.season, validated.plantingDay);
  const firstMatureAbsoluteDay = plantAbsoluteDay + maturityDays;
  const protectedPlot = isProtectedLocation(validated.location);
  const outdoorDeadline = protectedPlot
    ? null
    : lastConsecutiveLegalDay(crop, validated.season);
  const windowEndAbsoluteDay = protectedPlot
    ? plantAbsoluteDay + PROTECTED_WINDOW_DAYS
    : (outdoorDeadline ?? seasonEndAbsoluteDay(validated.season));
  const canHarvest =
    protectedPlot ||
    (outdoorDeadline !== null && firstMatureAbsoluteDay <= outdoorDeadline);
  const schedule = canHarvest
    ? scheduleHarvests(
        firstMatureAbsoluteDay,
        windowEndAbsoluteDay,
        maturityDays,
        crop.regrowIntervalDays,
        validated.afterHarvest,
      )
    : { harvestAbsoluteDays: [], replantAbsoluteDays: [] };
  const replantDays = new Set(schedule.replantAbsoluteDays);
  const harvests = schedule.harvestAbsoluteDays.map((harvestAbsoluteDay) => {
    const position = calendarPosition(harvestAbsoluteDay);
    return {
      season: position.season,
      day: position.day,
      replantedSameDay: replantDays.has(harvestAbsoluteDay),
    };
  });
  const outdoorDeadlinePosition =
    outdoorDeadline === null ? null : calendarPosition(outdoorDeadline);
  const lastSafePlant =
    outdoorDeadline === null ? null : calendarPosition(outdoorDeadline - maturityDays);
  const firstMature = calendarPosition(firstMatureAbsoluteDay);
  return {
    cropId: crop.cropId,
    growthDays: maturityDays,
    growDays: maturityDays,
    regrowIntervalDays: crop.regrowIntervalDays,
    firstHarvest: canHarvest ? { season: firstMature.season, day: firstMature.day } : null,
    firstMature,
    harvests,
    harvestCount: harvests.length,
    outdoorSeasonDeadlineDay: outdoorDeadlinePosition?.day ?? null,
    lastSafePlantingDay: lastSafePlant?.day ?? null,
    lastSafePlant,
    markers: buildMarkers(
      plantAbsoluteDay,
      windowEndAbsoluteDay,
      schedule.harvestAbsoluteDays,
      schedule.replantAbsoluteDays,
    ),
    seasonCheck: canHarvest ? "harvestable" : "past-deadline",
    canHarvest,
    pastDeadline: !canHarvest,
  };
}
