import {
  projectCropHarvests,
  type CalendarPosition,
} from "@/src/crop-tools/growth/project-crop-harvests";
import {
  normalizeCropGrowthForm,
  type CropGrowthForm,
} from "./crop-growth-form";
import {
  cropSeasons,
  parseCropSeason,
  readHarvestDate,
  type CropSeason,
  type HarvestDate,
} from "./planting-field-values";

const DAYS_PER_SEASON = 28;
const DAYS_PER_YEAR = DAYS_PER_SEASON * cropSeasons.length;
const MAX_CALENDAR_MONTHS = cropSeasons.length;

export type HarvestCalendarDate = HarvestDate & Readonly<{ yearOffset: number }>;

export type CropHarvestProjection = Readonly<{
  growthDays: number;
  regrowIntervalDays: number | null;
  outdoorSeasonDeadlineDay: number | null;
  outdoorDeadline: HarvestCalendarDate | null;
  firstHarvest: HarvestDate | null;
  harvests: readonly HarvestMark[];
  harvestCount: number;
  lastSafePlantingDay: number | null;
  lastSafePlanting: HarvestCalendarDate | null;
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

export type HarvestCalendarMonth = Readonly<{
  season: CropSeason;
  yearOffset: number;
  marks: readonly (HarvestCalendarMark | null)[];
}>;

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

function readCalendarDate(rawValue: unknown, fieldName: string): HarvestCalendarDate | null {
  if (rawValue === null) {
    return null;
  }
  if (typeof rawValue !== "object" || Array.isArray(rawValue)) {
    throw new Error(
      `Crop harvest projection field ${fieldName} must be a calendar date or null. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const harvestDate = readHarvestDate(
    { season: record.season, day: record.day },
    fieldName,
  );
  if (harvestDate === null) {
    throw new Error(
      `Crop harvest projection field ${fieldName} must include a season and day. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  if (
    typeof record.yearOffset !== "number" ||
    !Number.isInteger(record.yearOffset) ||
    record.yearOffset < 0
  ) {
    throw new Error(
      `Crop harvest projection field ${fieldName} yearOffset must be a non-negative integer. Received: ${JSON.stringify(record.yearOffset)}.`,
    );
  }

  return { ...harvestDate, yearOffset: record.yearOffset };
}

function readHarvestMark(rawValue: unknown, harvestIndex: number): HarvestMark {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
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
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
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
    outdoorDeadline: readCalendarDate(record.outdoorDeadline, "outdoorDeadline"),
    firstHarvest: readHarvestDate(record.firstHarvest, "firstHarvest"),
    harvests: record.harvests.map((harvest, harvestIndex) => readHarvestMark(harvest, harvestIndex)),
    harvestCount: readFiniteNumber(record.harvestCount, "harvestCount"),
    lastSafePlantingDay,
    lastSafePlanting: readCalendarDate(record.lastSafePlanting, "lastSafePlanting"),
    seasonCheck,
  };
}

export function projectCropGrowthForm(form: CropGrowthForm): CropHarvestProjection {
  const normalizedForm = normalizeCropGrowthForm(form);
  const engineProjection = projectCropHarvests({
    cropId: normalizedForm.cropId,
    season: normalizedForm.season,
    plantingDay: normalizedForm.plantingDay,
    speedGro: normalizedForm.speedGro,
    agriculturist: normalizedForm.agriculturist,
    missedWateringDays: normalizedForm.missedWateringDays,
    location: normalizedForm.location,
    afterHarvest: normalizedForm.afterHarvest,
  });

  return readCropHarvestProjection({
    ...engineProjection,
    lastSafePlanting: engineProjection.lastSafePlant,
  });
}

function readPlantingDay(rawValue: unknown): number {
  if (typeof rawValue !== "number" || !Number.isInteger(rawValue) || rawValue < 1 || rawValue > 28) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return rawValue;
}

function readHarvestMarks(rawValue: unknown): readonly HarvestMark[] {
  if (!Array.isArray(rawValue)) {
    throw new Error(
      `Harvest marks must be an array. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return rawValue.map((harvest, harvestIndex) => readHarvestMark(harvest, harvestIndex));
}

function listMonthMarks(
  season: CropSeason,
  yearOffset: number,
  plantingSeason: CropSeason,
  plantingDay: number,
  harvests: readonly HarvestMark[],
): readonly (HarvestCalendarMark | null)[] {
  return Array.from({ length: DAYS_PER_SEASON }, (_, index) => {
    const day = index + 1;
    const dayHarvests = harvests.filter(
      (harvest) => harvest.day === day && harvest.season === season,
    );
    const replanted = dayHarvests.some((harvest) => harvest.replantedSameDay);
    const harvested = dayHarvests.length > 0;
    const planted = yearOffset === 0 && season === plantingSeason && day === plantingDay;

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

function seasonIndex(season: CropSeason): number {
  const index = cropSeasons.indexOf(season);
  if (index < 0) {
    throw new Error(`Season is invalid. Received: ${JSON.stringify(season)}.`);
  }
  return index;
}

function absoluteCalendarDay(position: CalendarPosition): number {
  if (!Number.isInteger(position.yearOffset) || position.yearOffset < 0) {
    throw new Error(
      `Calendar yearOffset must be a non-negative integer. Received: ${JSON.stringify(position.yearOffset)}.`,
    );
  }
  if (!Number.isInteger(position.day) || position.day < 1 || position.day > DAYS_PER_SEASON) {
    throw new Error(
      `Calendar day must be an integer from 1 to 28. Received: ${JSON.stringify(position.day)}.`,
    );
  }

  return (
    position.yearOffset * DAYS_PER_YEAR +
    seasonIndex(position.season) * DAYS_PER_SEASON +
    position.day -
    1
  );
}

function calendarPositionFromAbsoluteDay(absoluteDay: number): HarvestCalendarDate {
  if (!Number.isInteger(absoluteDay) || absoluteDay < 0) {
    throw new Error(
      `Absolute calendar day must be a non-negative integer. Received: ${JSON.stringify(absoluteDay)}.`,
    );
  }

  const yearOffset = Math.floor(absoluteDay / DAYS_PER_YEAR);
  const dayOfYear = absoluteDay - yearOffset * DAYS_PER_YEAR;
  const season = cropSeasons[Math.floor(dayOfYear / DAYS_PER_SEASON)];
  if (season === undefined) {
    throw new Error(
      `Absolute calendar day does not map to a season. Received: ${JSON.stringify(absoluteDay)}.`,
    );
  }

  return {
    season,
    day: (dayOfYear % DAYS_PER_SEASON) + 1,
    yearOffset,
  };
}

function compareCalendarMonths(
  left: Pick<HarvestCalendarDate, "season" | "yearOffset">,
  right: Pick<HarvestCalendarDate, "season" | "yearOffset">,
): number {
  return (
    left.yearOffset * cropSeasons.length +
    seasonIndex(left.season) -
    (right.yearOffset * cropSeasons.length + seasonIndex(right.season))
  );
}

function listCalendarMonths(
  start: Pick<HarvestCalendarDate, "season" | "yearOffset">,
  end: Pick<HarvestCalendarDate, "season" | "yearOffset"> | null,
): readonly Pick<HarvestCalendarDate, "season" | "yearOffset">[] {
  if (end === null) {
    return [];
  }
  if (compareCalendarMonths(start, end) > 0) {
    throw new Error(
      `Calendar end precedes its start. Received: ${JSON.stringify({ start, end })}.`,
    );
  }

  const months: { season: CropSeason; yearOffset: number }[] = [];
  let current = { season: start.season, yearOffset: start.yearOffset };
  while (compareCalendarMonths(current, end) <= 0) {
    if (months.length >= MAX_CALENDAR_MONTHS) {
      throw new RangeError(
        `Calendar span cannot exceed ${MAX_CALENDAR_MONTHS} seasons. Received: ${JSON.stringify({ start, end })}.`,
      );
    }
    months.push(current);
    const nextSeasonIndex = seasonIndex(current.season) + 1;
    if (nextSeasonIndex === cropSeasons.length) {
      const firstSeason = cropSeasons[0];
      if (firstSeason === undefined) {
        throw new Error("Crop season catalog is empty.");
      }
      current = { season: firstSeason, yearOffset: current.yearOffset + 1 };
    } else {
      const nextSeason = cropSeasons[nextSeasonIndex];
      if (nextSeason === undefined) {
        throw new Error(
          `Crop season index is invalid. Received: ${JSON.stringify(nextSeasonIndex)}.`,
        );
      }
      current = { season: nextSeason, yearOffset: current.yearOffset };
    }
  }

  return months;
}

function listProtectedCalendarMonths(
  form: CropGrowthForm,
): readonly Pick<HarvestCalendarDate, "season" | "yearOffset">[] {
  const plantAbsoluteDay = absoluteCalendarDay({
    season: form.season,
    day: form.plantingDay,
    yearOffset: 0,
  });
  // Match the engine's inclusive endpoint at planting day plus 28 days.
  const lastGrowingDay = calendarPositionFromAbsoluteDay(plantAbsoluteDay + 28);
  return listCalendarMonths(
    { season: form.season, yearOffset: 0 },
    lastGrowingDay,
  );
}

export function listHarvestCalendarMonths(
  form: CropGrowthForm,
  projection: CropHarvestProjection,
): readonly HarvestCalendarMonth[] {
  const normalizedForm = normalizeCropGrowthForm(form);
  const validatedProjection = readCropHarvestProjection(projection);
  const months =
    normalizedForm.location === "outdoor"
      ? listCalendarMonths(
          { season: normalizedForm.season, yearOffset: 0 },
          validatedProjection.outdoorDeadline,
        )
      : listProtectedCalendarMonths(normalizedForm);

  return months.map((month) => ({
    ...month,
    marks: listMonthMarks(
      month.season,
      month.yearOffset,
      normalizedForm.season,
      normalizedForm.plantingDay,
      validatedProjection.harvests,
    ),
  }));
}

export function listHarvestCalendarMarks(
  season: CropSeason,
  plantingDay: number,
  harvests: readonly HarvestMark[],
): readonly (HarvestCalendarMark | null)[] {
  const validatedSeason = parseCropSeason(season);
  return listMonthMarks(
    validatedSeason,
    0,
    validatedSeason,
    readPlantingDay(plantingDay),
    readHarvestMarks(harvests),
  );
}
