import type { PricedMachineBatch } from "./read-purchasable-crop";
import type { FarmingProfession, SeasonProfitRouteId } from "./season-profit-input";

const MACHINE_DAY_MINUTES = 1600;

export type FinishedBatchCount = {
  readonly processedBatches: number;
  readonly processedUnits: number;
  readonly backlogUnits: number;
};

export type QuotedCropRoute = {
  readonly routeId: SeasonProfitRouteId;
  readonly netGold: number;
  readonly processedUnits: number;
  readonly backlogUnits: number;
};

export function processingDurationDays(routeId: Exclude<SeasonProfitRouteId, "sell-raw">, processingMinutes: number): number {
  if (!Number.isInteger(processingMinutes) || processingMinutes < 1) {
    throw new Error(`processingMinutes is invalid: ${JSON.stringify(processingMinutes)}`);
  }
  // ValleyMath checks kegs and jars once each morning, so partial days take the next day.
  // Its dehydrator routes all finish in one day (1750 minutes, durationDays 1).
  if (routeId === "dehydrator") return 1;
  return Math.ceil(processingMinutes / MACHINE_DAY_MINUTES);
}

export function rawCropUnitPrice(sellPrice: number, profession: FarmingProfession): number {
  if (profession !== "none") return scaleGold(sellPrice, 1.1);
  return sellPrice;
}

export function processedBatchPrice(outputPrice: number, profession: FarmingProfession): number {
  if (profession === "artisan") return scaleGold(outputPrice, 1.4);
  return outputPrice;
}

export function countFinishedMachineBatches(
  harvestAbsoluteDays: readonly number[],
  unitsPerHarvest: number,
  batchSize: number,
  durationDays: number,
  machineCount: number,
  deadlineAbsoluteDay: number,
): FinishedBatchCount {
  if (!Array.isArray(harvestAbsoluteDays)) {
    throw new Error(`harvestAbsoluteDays is invalid: ${String(harvestAbsoluteDays)}`);
  }
  for (const [index, absoluteDay] of harvestAbsoluteDays.entries()) {
    if (!Number.isSafeInteger(absoluteDay) || absoluteDay < 1) {
      throw new Error(`harvestAbsoluteDays[${index}] is invalid: ${String(absoluteDay)}`);
    }
  }
  if (!Number.isFinite(unitsPerHarvest) || unitsPerHarvest <= 0) {
    throw new Error(`unitsPerHarvest is invalid: ${String(unitsPerHarvest)}`);
  }
  if (!Number.isSafeInteger(batchSize) || batchSize <= 0) {
    throw new Error(`batchSize is invalid: ${String(batchSize)}`);
  }
  if (!Number.isSafeInteger(durationDays) || durationDays <= 0) {
    throw new Error(`durationDays is invalid: ${String(durationDays)}`);
  }
  if (!Number.isSafeInteger(machineCount) || machineCount < 0) {
    throw new Error(`machineCount is invalid: ${String(machineCount)}`);
  }
  if (!Number.isSafeInteger(deadlineAbsoluteDay) || deadlineAbsoluteDay < 1) {
    throw new Error(`deadlineAbsoluteDay is invalid: ${String(deadlineAbsoluteDay)}`);
  }

  const orderedHarvestDays = [...harvestAbsoluteDays].sort((leftDay, rightDay) => leftDay - rightDay);
  const totalUnits = orderedHarvestDays.length * unitsPerHarvest;
  if (machineCount === 0 || orderedHarvestDays.length === 0) {
    return { processedBatches: 0, processedUnits: 0, backlogUnits: totalUnits };
  }

  const arrivals = new Map<number, number>();
  for (const absoluteDay of orderedHarvestDays) {
    arrivals.set(absoluteDay, (arrivals.get(absoluteDay) ?? 0) + unitsPerHarvest);
  }

  const machinesFreedOnDay = new Map<number, number>();
  let freeMachines = machineCount;
  let waitingUnits = 0;
  let processedBatches = 0;
  const firstHarvestDay = orderedHarvestDays[0];
  if (firstHarvestDay === undefined) {
    return { processedBatches: 0, processedUnits: 0, backlogUnits: totalUnits };
  }

  for (let absoluteDay = firstHarvestDay; absoluteDay <= deadlineAbsoluteDay; absoluteDay += 1) {
    freeMachines += machinesFreedOnDay.get(absoluteDay) ?? 0;
    waitingUnits += arrivals.get(absoluteDay) ?? 0;
    const finishDay = absoluteDay + durationDays;
    if (finishDay > deadlineAbsoluteDay || freeMachines <= 0) continue;
    const batchesStarted = Math.min(freeMachines, Math.floor((waitingUnits + 1e-9) / batchSize));
    if (batchesStarted <= 0) continue;
    processedBatches += batchesStarted;
    waitingUnits -= batchesStarted * batchSize;
    freeMachines -= batchesStarted;
    machinesFreedOnDay.set(finishDay, (machinesFreedOnDay.get(finishDay) ?? 0) + batchesStarted);
  }

  const processedUnits = processedBatches * batchSize;
  return {
    processedBatches,
    processedUnits,
    backlogUnits: Math.max(0, totalUnits - processedUnits),
  };
}

export function quoteSellRawRoute(
  expectedUnits: number,
  rawUnitPrice: number,
  seedCost: number,
  fertilizerCost: number,
): QuotedCropRoute {
  return {
    routeId: "sell-raw",
    netGold: expectedUnits * rawUnitPrice - seedCost - fertilizerCost,
    processedUnits: 0,
    backlogUnits: expectedUnits,
  };
}

export function quoteMachineRoute(
  routeId: Exclude<SeasonProfitRouteId, "sell-raw">,
  output: PricedMachineBatch | null,
  machineCount: number,
  harvestAbsoluteDays: readonly number[],
  unitsPerHarvest: number,
  rawUnitPrice: number,
  profession: FarmingProfession,
  seedCost: number,
  fertilizerCost: number,
  deadlineAbsoluteDay: number,
): QuotedCropRoute | null {
  if (machineCount === 0 || output === null) return null;
  const finished = countFinishedMachineBatches(
    harvestAbsoluteDays,
    unitsPerHarvest,
    output.batchSize,
    processingDurationDays(routeId, output.processingMinutes),
    machineCount,
    deadlineAbsoluteDay,
  );
  const processedRevenue = finished.processedBatches * processedBatchPrice(output.price, profession);
  const rawRevenue = finished.backlogUnits * rawUnitPrice;
  return {
    routeId,
    netGold: processedRevenue + rawRevenue - seedCost - fertilizerCost,
    processedUnits: finished.processedUnits,
    backlogUnits: finished.backlogUnits,
  };
}

export function chooseWinningRoute(routes: readonly QuotedCropRoute[]): QuotedCropRoute {
  const firstRoute = routes[0];
  if (firstRoute === undefined) {
    throw new Error(`routes is invalid: ${JSON.stringify(routes)}`);
  }
  let winningRoute = firstRoute;
  for (const route of routes) {
    if (route.netGold > winningRoute.netGold) winningRoute = route;
  }
  return winningRoute;
}

function scaleGold(price: number, multiplier: number): number {
  return Math.floor(price * multiplier + 1e-9);
}
