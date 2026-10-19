export const cropSeasons = ["spring", "summer", "fall", "winter"] as const;

export type CropSeason = (typeof cropSeasons)[number];

export const speedGroOptions = ["none", "speed-gro", "deluxe", "hyper"] as const;

export type SpeedGroOption = (typeof speedGroOptions)[number];

export type HarvestDate = Readonly<{
  season: CropSeason;
  day: number;
}>;

export function parseCropSeason(rawValue: unknown): CropSeason {
  if (cropSeasons.includes(rawValue as CropSeason)) {
    return rawValue as CropSeason;
  }

  throw new Error(
    `Season must be spring, summer, fall, or winter. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parseSpeedGroOption(rawValue: unknown): SpeedGroOption {
  if (speedGroOptions.includes(rawValue as SpeedGroOption)) {
    return rawValue as SpeedGroOption;
  }

  throw new Error(
    `Speed-Gro must be none, speed-gro, deluxe, or hyper. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parsePlantingDay(rawValue: string): number {
  if (!/^\d+$/.test(rawValue.trim())) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const plantingDay = Number(rawValue);
  if (plantingDay < 1 || plantingDay > 28) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(plantingDay)}.`,
    );
  }

  return plantingDay;
}

export function parseMissedWateringDays(rawValue: string): number {
  if (!/^\d+$/.test(rawValue.trim())) {
    throw new Error(
      `Missed watering days must be an integer from 0 to 14. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const missedWateringDays = Number(rawValue);
  if (missedWateringDays < 0 || missedWateringDays > 14) {
    throw new Error(
      `Missed watering days must be an integer from 0 to 14. Received: ${JSON.stringify(missedWateringDays)}.`,
    );
  }

  return missedWateringDays;
}

export function readHarvestDate(rawValue: unknown, fieldName: string): HarvestDate | null {
  if (rawValue === null) {
    return null;
  }

  if (typeof rawValue !== "object" || rawValue === null) {
    throw new Error(
      `${fieldName} must be a harvest date or null. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const season = parseCropSeason(record.season);
  const day = record.day;
  if (typeof day !== "number" || !Number.isInteger(day) || day < 1 || day > 28) {
    throw new Error(
      `${fieldName} day must be an integer from 1 to 28. Received: ${JSON.stringify(day)}.`,
    );
  }

  return { season, day };
}

export function formatHarvestDate(
  date: HarvestDate | null,
  seasonLabels: Readonly<Record<CropSeason, string>>,
): string {
  if (date === null) {
    return "—";
  }

  return `${seasonLabels[date.season]} ${date.day}`;
}
