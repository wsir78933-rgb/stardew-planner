import {
  parseFarmingProfession,
  parseProcessingDeadline,
  type CropProfitForm,
} from "./crop-profit-form";
import { parseCropSeason, readHarvestDate, type HarvestDate } from "./planting-field-values";
import { parseProfitRouteId, type ProfitRouteId } from "./profit-route";

export const productionPlanStorageKey = "stardew-tools:production-plan";

export type ProductionPlanLine = Readonly<{
  cropId: string;
  routeId: ProfitRouteId;
  expectedUnits: number;
  harvestCount: number;
  tileCount: number;
  firstHarvest: HarvestDate | null;
  lastHarvest: HarvestDate | null;
  seedCost: number;
  fertilizerCost: number;
}>;

export type ProductionPlanRecord = Readonly<{
  source: "crop-profit";
  profession: CropProfitForm["profession"];
  processingDeadline: CropProfitForm["processingDeadline"];
  kegCount: number;
  jarCount: number;
  dehydratorCount: number;
  season: CropProfitForm["season"];
  farmYear: number;
  lines: readonly ProductionPlanLine[];
  previousPlan: ProductionPlanRecord | null;
}>;

export type ProductionPlanIncoming = Readonly<{
  form: CropProfitForm;
  line: ProductionPlanLine;
}>;

function readRecord(rawValue: unknown, label: string): Record<string, unknown> {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    throw new Error(`${label} must be an object. Received: ${JSON.stringify(rawValue)}.`);
  }

  return rawValue as Record<string, unknown>;
}

function readRequired(record: Record<string, unknown>, fieldName: string): unknown {
  if (!Object.hasOwn(record, fieldName)) {
    throw new Error(
      `Production plan is missing ${fieldName}. Received: ${JSON.stringify(record)}.`,
    );
  }

  return record[fieldName];
}

function readInteger(rawValue: unknown, fieldName: string): number {
  if (typeof rawValue !== "number" || !Number.isInteger(rawValue)) {
    throw new Error(
      `Production plan field ${fieldName} must be an integer. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

function readFinite(rawValue: unknown, fieldName: string): number {
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    throw new Error(
      `Production plan field ${fieldName} must be a finite number. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  return rawValue;
}

function readPlanLine(rawValue: unknown, lineIndex: number): ProductionPlanLine {
  const record = readRecord(rawValue, `Production plan line ${lineIndex}`);
  const cropId = readRequired(record, "cropId");
  if (typeof cropId !== "string" || cropId.trim().length === 0) {
    throw new Error(
      `Production plan line ${lineIndex} cropId must be a non-empty string. Received: ${JSON.stringify(cropId)}.`,
    );
  }

  return {
    cropId,
    routeId: parseProfitRouteId(readRequired(record, "routeId")),
    expectedUnits: readFinite(readRequired(record, "expectedUnits"), "expectedUnits"),
    harvestCount: readFinite(readRequired(record, "harvestCount"), "harvestCount"),
    tileCount: readInteger(readRequired(record, "tileCount"), "tileCount"),
    firstHarvest: readHarvestDate(readRequired(record, "firstHarvest"), `lines[${lineIndex}].firstHarvest`),
    lastHarvest: readHarvestDate(readRequired(record, "lastHarvest"), `lines[${lineIndex}].lastHarvest`),
    seedCost: readFinite(readRequired(record, "seedCost"), "seedCost"),
    fertilizerCost: readFinite(readRequired(record, "fertilizerCost"), "fertilizerCost"),
  };
}

export function readProductionPlanRecord(rawValue: unknown): ProductionPlanRecord {
  const record = readRecord(rawValue, "Production plan");
  const source = readRequired(record, "source");
  if (source !== "crop-profit") {
    throw new Error(
      `Production plan source must be crop-profit. Received: ${JSON.stringify(source)}.`,
    );
  }

  const lines = readRequired(record, "lines");
  if (!Array.isArray(lines)) {
    throw new Error(
      `Production plan lines must be an array. Received: ${JSON.stringify(lines)}.`,
    );
  }

  const previousPlan = readRequired(record, "previousPlan");

  return {
    source: "crop-profit",
    profession: parseFarmingProfession(readRequired(record, "profession")),
    processingDeadline: parseProcessingDeadline(readRequired(record, "processingDeadline")),
    kegCount: readInteger(readRequired(record, "kegCount"), "kegCount"),
    jarCount: readInteger(readRequired(record, "jarCount"), "jarCount"),
    dehydratorCount: readInteger(readRequired(record, "dehydratorCount"), "dehydratorCount"),
    season: parseCropSeason(readRequired(record, "season")),
    farmYear: readInteger(readRequired(record, "farmYear"), "farmYear"),
    lines: lines.map((line, lineIndex) => readPlanLine(line, lineIndex)),
    previousPlan: previousPlan === null ? null : readProductionPlanRecord(previousPlan),
  };
}

export function parseProductionPlanStorage(storageText: string): ProductionPlanRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(storageText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Production plan storage must be JSON. Received: ${JSON.stringify(storageText)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  return readProductionPlanRecord(parsed);
}

function rememberPreviousPlan(currentPlan: ProductionPlanRecord | null): ProductionPlanRecord | null {
  if (currentPlan === null) {
    return null;
  }

  return {
    ...currentPlan,
    previousPlan: null,
  };
}

export function appendHarvestToProductionPlan(
  currentPlan: ProductionPlanRecord | null,
  incoming: ProductionPlanIncoming,
): ProductionPlanRecord {
  if (currentPlan === null) {
    return replaceProductionPlan(null, incoming);
  }

  return readProductionPlanRecord({
    source: "crop-profit",
    profession: currentPlan.profession,
    processingDeadline: currentPlan.processingDeadline,
    kegCount: currentPlan.kegCount,
    jarCount: currentPlan.jarCount,
    dehydratorCount: currentPlan.dehydratorCount,
    season: currentPlan.season,
    farmYear: currentPlan.farmYear,
    lines: [...currentPlan.lines, incoming.line],
    previousPlan: rememberPreviousPlan(currentPlan),
  });
}

export function replaceProductionPlan(
  currentPlan: ProductionPlanRecord | null,
  incoming: ProductionPlanIncoming,
): ProductionPlanRecord {
  return readProductionPlanRecord({
    source: "crop-profit",
    profession: incoming.form.profession,
    processingDeadline: incoming.form.processingDeadline,
    kegCount: incoming.form.kegCount,
    jarCount: incoming.form.jarCount,
    dehydratorCount: incoming.form.dehydratorCount,
    season: incoming.form.season,
    farmYear: incoming.form.farmYear,
    lines: [incoming.line],
    previousPlan: rememberPreviousPlan(currentPlan),
  });
}

export function serializeProductionPlan(plan: ProductionPlanRecord): string {
  return JSON.stringify(readProductionPlanRecord(plan));
}
