export const speedGroChoices = ["none", "speed-gro", "deluxe", "hyper"] as const;

export type SpeedGroChoice = (typeof speedGroChoices)[number];

const SPEED_GRO_RATES: Readonly<Record<SpeedGroChoice, number>> = {
  none: 0,
  "speed-gro": 0.1,
  deluxe: 0.25,
  hyper: 0.33,
};

const AGRICULTURIST_GROWTH_RATE = 0.1;
const MAX_STAGE_REDUCTION_PASSES = 3;

export function sumGrowthStageDays(growthStageDays: readonly number[]): number {
  return growthStageDays.reduce((totalDays, stageDays) => totalDays + stageDays, 0);
}

function readSpeedGroRate(speedGro: SpeedGroChoice, agriculturist: boolean): number {
  return SPEED_GRO_RATES[speedGro] + (agriculturist ? AGRICULTURIST_GROWTH_RATE : 0);
}

function reduceGrowthStageOnce(
  stageDays: number[],
  stageIndex: number,
  daysLeftToRemove: number,
): number {
  const currentStageDays = stageDays[stageIndex];
  if (currentStageDays === undefined) {
    throw new Error(`growth stage index is invalid: ${JSON.stringify(stageIndex)}`);
  }
  if (stageIndex === 0 && currentStageDays <= 1) {
    return daysLeftToRemove;
  }

  stageDays[stageIndex] = currentStageDays - 1;
  return daysLeftToRemove - 1;
}

export function shortenGrowthStages(
  growthStageDays: readonly number[],
  speedGro: SpeedGroChoice,
  agriculturist: boolean,
): readonly number[] {
  const daysToRemove = Math.ceil(
    sumGrowthStageDays(growthStageDays) * readSpeedGroRate(speedGro, agriculturist),
  );
  const shortenedStageDays = [...growthStageDays];
  let daysLeftToRemove = daysToRemove;
  let passCount = 0;

  while (daysLeftToRemove > 0 && passCount < MAX_STAGE_REDUCTION_PASSES) {
    for (
      let stageIndex = 0;
      stageIndex < shortenedStageDays.length && daysLeftToRemove > 0;
      stageIndex += 1
    ) {
      daysLeftToRemove = reduceGrowthStageOnce(
        shortenedStageDays,
        stageIndex,
        daysLeftToRemove,
      );
    }
    passCount += 1;
  }

  return shortenedStageDays;
}
