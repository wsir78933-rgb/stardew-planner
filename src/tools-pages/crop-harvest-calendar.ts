import { projectCropHarvests } from "@/src/crop-tools/growth/project-crop-harvests";
import type { CropGrowthForm } from "./crop-growth-form";
import {
  readHarvestDate,
  type CropSeason,
  type HarvestDate,
} from "./planting-field-values";

export type CropHarvestProjection = Readonly<{
  growthDays: number;
  regrowIntervalDays: number | null;
  outdoorSeasonDeadlineDay: number | null;
  firstHarvest: HarvestDate | null;
  harvests: readonly HarvestMark[];
  harvestCount: number;
  lastSafePlantingDay: number | null;
  seasonCheck: "harvestable" | "past-deadline";
}>;

export type HarvestMark = Readonly<{
  season: CropSeason;
  day: number;
  replantedSameDay: boolean;
}>;

export type HarvestCalendarMark =
  | "plant"
  | "harvest"
  | "replant"
  | "plant-and-harvest"
  | "plant-and-replant";

function readFiniteNumber(rawValue: unknown, fieldName: string): number {
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    throw new Error(
      `Crop harvest projection field ${fieldName} must be a finite number. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

function readNullableInteger(rawValue: unknown, fieldName: string): number | null {
  if (rawValue === null) {
    return null;
  }

  if (typeof rawValue !== "number" || !Number.isInteger(rawValue)) {
    throw new Error(
      `Crop harvest projection field ${fieldName} must be an integer or null. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

function readHarvestMark(rawValue: unknown, harvestIndex: number): HarvestMark {
  if (typeof rawValue !== "object" || rawValue === null) {
    throw new Error(
      `Crop harvest ${harvestIndex} must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const harvestDate = readHarvestDate(
    { season: record.season, day: record.day },
    `harvests[${harvestIndex}]`,
  );
  if (harvestDate === null) {
    throw new Error(
      `Crop harvest ${harvestIndex} must include a season and day. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  if (typeof record.replantedSameDay !== "boolean") {
    throw new Error(
      `Crop harvest ${harvestIndex} replantedSameDay must be true or false. Received: ${JSON.stringify(record.replantedSameDay)}.`,
    );
  }

  return {
    season: harvestDate.season,
    day: harvestDate.day,
    replantedSameDay: record.replantedSameDay,
  };
}

export function readCropHarvestProjection(rawValue: unknown): CropHarvestProjection {
  if (typeof rawValue !== "object" || rawValue === null) {
    throw new Error(
      `Crop harvest projection must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const seasonCheck = record.seasonCheck;
  if (seasonCheck !== "harvestable" && seasonCheck !== "past-deadline") {
    throw new Error(
      `Crop harvest seasonCheck must be harvestable or past-deadline. Received: ${JSON.stringify(seasonCheck)}.`,
    );
  }
  if (!Array.isArray(record.harvests)) {
    throw new Error(
      `Crop harvest projection field harvests must be an array. Received: ${JSON.stringify(record.harvests)}.`,
    );
  }

  const regrowIntervalDays = readNullableInteger(record.regrowIntervalDays, "regrowIntervalDays");
  const outdoorSeasonDeadlineDay = readNullableInteger(
    record.outdoorSeasonDeadlineDay,
    "outdoorSeasonDeadlineDay",
  );
  const lastSafePlantingDay = readNullableInteger(record.lastSafePlantingDay, "lastSafePlantingDay");

  return {
    growthDays: readFiniteNumber(record.growthDays, "growthDays"),
    regrowIntervalDays,
    outdoorSeasonDeadlineDay,
    firstHarvest: readHarvestDate(record.firstHarvest, "firstHarvest"),
    harvests: record.harvests.map((harvest, harvestIndex) => readHarvestMark(harvest, harvestIndex)),
    harvestCount: readFiniteNumber(record.harvestCount, "harvestCount"),
    lastSafePlantingDay,
    seasonCheck,
  };
}

export function projectCropGrowthForm(form: CropGrowthForm): CropHarvestProjection {
  return readCropHarvestProjection(
    projectCropHarvests({
      cropId: form.cropId,
      season: form.season,
      plantingDay: form.plantingDay,
      speedGro: form.speedGro,
      agriculturist: form.agriculturist,
      missedWateringDays: form.missedWateringDays,
      location: form.location,
      afterHarvest: form.afterHarvest,
    }),
  );
}

export function listHarvestCalendarMarks(
  season: CropSeason,
  plantingDay: number,
  harvests: readonly HarvestMark[],
): readonly (HarvestCalendarMark | null)[] {
  if (plantingDay < 1 || plantingDay > 28) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(plantingDay)}.`,
    );
  }

  return Array.from({ length: 28 }, (_, index) => {
    const day = index + 1;
    const dayHarvests = harvests.filter((harvest) => harvest.day === day && harvest.season === season);
    const replanted = dayHarvests.some((harvest) => harvest.replantedSameDay);
    const harvested = dayHarvests.length > 0;
    const planted = day === plantingDay;

    if (planted && replanted) {
      return "plant-and-replant";
    }
    if (planted && harvested) {
      return "plant-and-harvest";
    }
    if (replanted) {
      return "replant";
    }
    if (harvested) {
      return "harvest";
    }
    if (planted) {
      return "plant";
    }

    return null;
  });
}
