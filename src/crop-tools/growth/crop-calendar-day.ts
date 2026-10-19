import { cropSeasons, type CropSeason } from "../catalog/crop-catalog";

const DAYS_PER_SEASON = 28;
const DAYS_PER_YEAR = DAYS_PER_SEASON * cropSeasons.length;

export function readCropSeasonIndex(season: CropSeason): number {
  const seasonIndex = cropSeasons.indexOf(season);
  if (seasonIndex < 0) {
    throw new Error(`season is invalid: ${JSON.stringify(season)}`);
  }
  return seasonIndex;
}

export function toCropAbsoluteDay(season: CropSeason, day: number): number {
  return readCropSeasonIndex(season) * DAYS_PER_SEASON + (day - 1);
}

export function fromCropAbsoluteDay(absoluteDay: number): {
  season: CropSeason;
  day: number;
} {
  if (!Number.isInteger(absoluteDay)) {
    throw new Error(`absoluteDay is invalid: ${JSON.stringify(absoluteDay)}`);
  }

  const dayInYear = ((absoluteDay % DAYS_PER_YEAR) + DAYS_PER_YEAR) % DAYS_PER_YEAR;
  const season = cropSeasons[Math.floor(dayInYear / DAYS_PER_SEASON)];
  if (season === undefined) {
    throw new Error(`absoluteDay is invalid: ${JSON.stringify(absoluteDay)}`);
  }

  return {
    season,
    day: (dayInYear % DAYS_PER_SEASON) + 1,
  };
}

export function readOutdoorDeadlineAbsoluteDay(
  seasons: readonly CropSeason[],
  plantingSeason: CropSeason,
): number | null {
  if (!seasons.includes(plantingSeason)) {
    return null;
  }

  let lastSeasonIndex = readCropSeasonIndex(plantingSeason);
  while (lastSeasonIndex + 1 < cropSeasons.length) {
    const nextSeason = cropSeasons[lastSeasonIndex + 1];
    if (nextSeason === undefined || !seasons.includes(nextSeason)) {
      break;
    }
    lastSeasonIndex += 1;
  }

  return lastSeasonIndex * DAYS_PER_SEASON + DAYS_PER_SEASON - 1;
}
