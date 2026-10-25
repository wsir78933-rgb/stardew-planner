import {
  calculateProductionPlan,
  isProductionPlanInputValidationError,
  readProductionPlanInput,
  type ProductionInventoryLine,
  type ProductionMachine,
  type ProductionPlanInput,
  type ProductionProfession,
} from "./production-model";
import {
  readProductionPlanRecord,
  type ProductionPlanRecord,
} from "@/src/tools-pages/production-plan-record";

export const productionPlanStateStorageKey = "stardew-tools:production-plan-state:v1";
export const productionPlanShareFragmentPrefix = "#production-plan=";
export const productionPlanShareFragmentMaxLength = 32_768;

export type ProductionPlanSnapshot = Readonly<{
  input: ProductionPlanInput;
  currentDay: number;
  completedTaskIds: readonly string[];
  taskChecklistNeedsReview: boolean;
}>;

export type ProductionPlanState = Readonly<{
  schemaVersion: 1;
  current: ProductionPlanSnapshot;
  undoSnapshot: ProductionPlanSnapshot | null;
}>;

export type CropProfitProductionReview = Readonly<{
  source: "crop-profit";
  legacyRecord: ProductionPlanRecord;
  suggestedSettings: Readonly<{
    profession: ProductionProfession | null;
    machineCounts: Readonly<Record<ProductionMachine, number>>;
    deadlineDays: null;
    season: ProductionPlanRecord["season"];
    farmYear: number;
  }>;
  estimatedHarvests: readonly Readonly<{
    cropId: string;
    routeId: ProductionPlanRecord["lines"][number]["routeId"];
    expectedUnits: number;
    harvestCount: number;
    tileCount: number;
    firstHarvest: ProductionPlanRecord["lines"][number]["firstHarvest"];
    lastHarvest: ProductionPlanRecord["lines"][number]["lastHarvest"];
  }>[];
  reviewReasons: readonly string[];
}>;

export class ProductionPlanStateValidationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ProductionPlanStateValidationError";
  }
}

export function isProductionPlanStateValidationError(
  error: unknown,
): error is ProductionPlanStateValidationError {
  return error instanceof ProductionPlanStateValidationError;
}

export function createProductionPlanState(input: ProductionPlanInput): ProductionPlanState {
  return readProductionPlanState({
    schemaVersion: 1,
    current: {
      input,
      currentDay: 0,
      completedTaskIds: [],
      taskChecklistNeedsReview: false,
    },
    undoSnapshot: null,
  });
}

export function readProductionPlanState(rawValue: unknown): ProductionPlanState {
  const stateRecord = readObject(rawValue, "Production plan state");
  assertExactFields(stateRecord, ["schemaVersion", "current", "undoSnapshot"], "Production plan state");
  if (stateRecord.schemaVersion !== 1) {
    throw stateError(
      `schemaVersion must be 1. Received: ${formatReceivedValue(stateRecord.schemaVersion)}.`,
    );
  }

  return {
    schemaVersion: 1,
    current: readSnapshot(stateRecord.current, "current"),
    undoSnapshot:
      stateRecord.undoSnapshot === null
        ? null
        : readSnapshot(stateRecord.undoSnapshot, "undoSnapshot"),
  };
}

export function parseProductionPlanState(storageText: string): ProductionPlanState {
  if (typeof storageText !== "string") {
    throw stateError(`Storage text must be a string. Received: ${formatReceivedValue(storageText)}.`);
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storageText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw stateError(
        `Stored production plan state must be valid JSON. Received: ${formatReceivedValue(storageText)}.`,
        error,
      );
    }
    throw error;
  }

  return readProductionPlanState(parsedValue);
}

export function serializeProductionPlanState(state: ProductionPlanState): string {
  return JSON.stringify(readProductionPlanState(state));
}

export function appendProductionInventory(
  state: ProductionPlanState,
  inventoryLines: readonly ProductionInventoryLine[],
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  if (!Array.isArray(inventoryLines) || inventoryLines.length === 0) {
    throw stateError(
      `inventoryLines must be a nonempty array. Received: ${formatReceivedValue(inventoryLines)}.`,
    );
  }

  const nextInput = readInput({
    ...currentState.current.input,
    inventory: [...currentState.current.input.inventory, ...inventoryLines],
  });
  return updateCurrentInput(currentState, nextInput);
}

export function replaceProductionPlanInput(
  state: ProductionPlanState,
  input: ProductionPlanInput,
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  const nextInput = readInput(input);
  return {
    schemaVersion: 1,
    current: {
      input: nextInput,
      currentDay: 0,
      completedTaskIds: [],
      taskChecklistNeedsReview: false,
    },
    undoSnapshot: currentState.current,
  };
}

export function updateProductionPlanInput(
  state: ProductionPlanState,
  input: ProductionPlanInput,
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  const nextInput = readInput(input);
  if (JSON.stringify(currentState.current.input) === JSON.stringify(nextInput)) {
    return currentState;
  }
  return updateCurrentInput(currentState, nextInput);
}

export function undoProductionPlanChange(state: ProductionPlanState): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  if (currentState.undoSnapshot === null) {
    throw stateError("Cannot undo production plan change because no undo snapshot exists.");
  }

  return {
    schemaVersion: 1,
    current: currentState.undoSnapshot,
    undoSnapshot: null,
  };
}

export function setProductionPlanCurrentDay(
  state: ProductionPlanState,
  currentDay: number,
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  if (!Number.isSafeInteger(currentDay) || currentDay < 0 || currentDay > 28) {
    throw stateError(
      `currentDay must be a safe integer from 0 to 28. Received: ${formatReceivedValue(currentDay)}.`,
    );
  }

  return {
    ...currentState,
    current: { ...currentState.current, currentDay },
  };
}

export function setProductionTaskCompleted(
  state: ProductionPlanState,
  taskId: string,
  completed: boolean,
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  if (currentState.current.taskChecklistNeedsReview) {
    throw stateError(
      "Cannot change completed production tasks while the checklist needs review. Confirm the reviewed task IDs first.",
    );
  }
  if (typeof taskId !== "string" || taskId.trim().length === 0) {
    throw stateError(`taskId must be a nonempty string. Received: ${formatReceivedValue(taskId)}.`);
  }
  if (typeof completed !== "boolean") {
    throw stateError(`completed must be a boolean. Received: ${formatReceivedValue(completed)}.`);
  }

  const scheduledTaskIds = getScheduledTaskIds(currentState.current.input);
  if (!scheduledTaskIds.has(taskId)) {
    throw stateError(`taskId is not present in the current plan. Received: ${formatReceivedValue(taskId)}.`);
  }

  const completedTaskIds = new Set(currentState.current.completedTaskIds);
  if (completed) {
    completedTaskIds.add(taskId);
  } else {
    completedTaskIds.delete(taskId);
  }

  return {
    ...currentState,
    current: {
      ...currentState.current,
      completedTaskIds: [...completedTaskIds],
    },
  };
}

export function confirmProductionTaskReview(
  state: ProductionPlanState,
  reviewedCompletedTaskIds: readonly string[],
): ProductionPlanState {
  const currentState = readProductionPlanState(state);
  if (!currentState.current.taskChecklistNeedsReview) {
    throw stateError("Cannot confirm production task review because the checklist is not marked for review.");
  }
  const completedTaskIds = readTaskIds(reviewedCompletedTaskIds, "reviewedCompletedTaskIds");
  const scheduledTaskIds = getScheduledTaskIds(currentState.current.input);
  for (const taskId of completedTaskIds) {
    if (!scheduledTaskIds.has(taskId)) {
      throw stateError(
        `reviewedCompletedTaskIds contains a task absent from the current plan. Received: ${formatReceivedValue(taskId)}.`,
      );
    }
  }

  return {
    ...currentState,
    current: {
      ...currentState.current,
      completedTaskIds,
      taskChecklistNeedsReview: false,
    },
  };
}

export function createProductionPlanShareFragment(input: ProductionPlanInput): string {
  const validatedInput = readInput(input);
  const fragment = `${productionPlanShareFragmentPrefix}${encodeURIComponent(JSON.stringify(validatedInput))}`;
  assertShareFragmentLength(fragment);
  return fragment;
}

export function parseProductionPlanShareFragment(fragment: string): ProductionPlanInput {
  if (typeof fragment !== "string") {
    throw stateError(`Share fragment must be a string. Received: ${formatReceivedValue(fragment)}.`);
  }
  assertShareFragmentLength(fragment);
  if (!fragment.startsWith(productionPlanShareFragmentPrefix)) {
    throw stateError(
      `Share fragment must start with ${JSON.stringify(productionPlanShareFragmentPrefix)}. Received: ${formatReceivedValue(fragment)}.`,
    );
  }

  const encodedInput = fragment.slice(productionPlanShareFragmentPrefix.length);
  let serializedInput: string;
  try {
    serializedInput = decodeURIComponent(encodedInput);
  } catch (error) {
    if (error instanceof URIError) {
      throw stateError(`Share fragment has invalid percent encoding. Received: ${formatReceivedValue(fragment)}.`, error);
    }
    throw error;
  }

  let rawInput: unknown;
  try {
    rawInput = JSON.parse(serializedInput);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw stateError(`Share fragment payload must be valid JSON. Received: ${formatReceivedValue(fragment)}.`, error);
    }
    throw error;
  }

  return readInput(rawInput);
}

export function createCropProfitProductionReview(
  rawLegacyRecord: ProductionPlanRecord,
): CropProfitProductionReview {
  const legacyRecord = readProductionPlanRecord(rawLegacyRecord);
  const profession =
    legacyRecord.profession === "none" ||
    legacyRecord.profession === "tiller" ||
    legacyRecord.profession === "artisan"
      ? legacyRecord.profession
      : null;

  return {
    source: "crop-profit",
    legacyRecord,
    suggestedSettings: {
      profession,
      machineCounts: {
        keg: legacyRecord.kegCount,
        jar: legacyRecord.jarCount,
        dehydrator: legacyRecord.dehydratorCount,
      },
      deadlineDays: null,
      season: legacyRecord.season,
      farmYear: legacyRecord.farmYear,
    },
    estimatedHarvests: legacyRecord.lines.map((line) => ({
      cropId: line.cropId,
      routeId: line.routeId,
      expectedUnits: line.expectedUnits,
      harvestCount: line.harvestCount,
      tileCount: line.tileCount,
      firstHarvest: line.firstHarvest,
      lastHarvest: line.lastHarvest,
    })),
    reviewReasons: [
      "Crop-profit quantities are estimated yields, not measured stock; enter confirmed inventory before scheduling.",
      "Stored harvest dates are seasonal projections and do not identify the current planning day; choose item availability days manually.",
      "The legacy processing deadline is relative to crop planting, while production plans use a 7, 14, or 28 day window; choose a new deadline.",
      ...(profession === null
        ? [`The legacy profession ${JSON.stringify(legacyRecord.profession)} is not a processing profession; choose one manually.`]
        : []),
    ],
  };
}

function updateCurrentInput(
  state: ProductionPlanState,
  input: ProductionPlanInput,
): ProductionPlanState {
  return {
    schemaVersion: 1,
    current: {
      ...state.current,
      input,
      taskChecklistNeedsReview: true,
    },
    undoSnapshot: state.current,
  };
}

function readSnapshot(rawValue: unknown, fieldName: string): ProductionPlanSnapshot {
  const snapshotRecord = readObject(rawValue, `Production plan state ${fieldName}`);
  assertExactFields(
    snapshotRecord,
    ["input", "currentDay", "completedTaskIds", "taskChecklistNeedsReview"],
    `Production plan state ${fieldName}`,
  );
  const currentDay = snapshotRecord.currentDay;
  if (!Number.isSafeInteger(currentDay) || (currentDay as number) < 0 || (currentDay as number) > 28) {
    throw stateError(
      `Production plan state ${fieldName}.currentDay must be a safe integer from 0 to 28. Received: ${formatReceivedValue(currentDay)}.`,
    );
  }
  const taskChecklistNeedsReview = snapshotRecord.taskChecklistNeedsReview;
  if (typeof taskChecklistNeedsReview !== "boolean") {
    throw stateError(
      `Production plan state ${fieldName}.taskChecklistNeedsReview must be a boolean. Received: ${formatReceivedValue(taskChecklistNeedsReview)}.`,
    );
  }

  return {
    input: readInput(snapshotRecord.input),
    currentDay: currentDay as number,
    completedTaskIds: readTaskIds(snapshotRecord.completedTaskIds, `${fieldName}.completedTaskIds`),
    taskChecklistNeedsReview,
  };
}

function readInput(rawValue: unknown): ProductionPlanInput {
  try {
    return readProductionPlanInput(rawValue);
  } catch (error) {
    if (isProductionPlanInputValidationError(error)) {
      throw stateError(`Production plan input is invalid. ${error.message}`, error);
    }
    throw error;
  }
}

function readTaskIds(rawValue: unknown, fieldName: string): readonly string[] {
  if (!Array.isArray(rawValue)) {
    throw stateError(`${fieldName} must be an array. Received: ${formatReceivedValue(rawValue)}.`);
  }

  const taskIds = rawValue.map((taskId, index) => {
    if (typeof taskId !== "string" || taskId.trim().length === 0) {
      throw stateError(
        `${fieldName}[${index}] must be a nonempty string. Received: ${formatReceivedValue(taskId)}.`,
      );
    }
    return taskId;
  });
  if (new Set(taskIds).size !== taskIds.length) {
    throw stateError(`${fieldName} must not contain duplicate task IDs. Received: ${formatReceivedValue(taskIds)}.`);
  }
  return taskIds;
}

function getScheduledTaskIds(input: ProductionPlanInput): ReadonlySet<string> {
  const result = calculateProductionPlan(input);
  const taskIds = result.dailySchedule.flatMap((day) => [
    ...day.collectTasks.map((task) => task.id),
    ...day.loadTasks.map((task) => task.id),
  ]);
  return new Set(taskIds);
}

function readObject(rawValue: unknown, fieldName: string): Record<string, unknown> {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    throw stateError(`${fieldName} must be an object. Received: ${formatReceivedValue(rawValue)}.`);
  }
  return rawValue as Record<string, unknown>;
}

function assertExactFields(
  record: Record<string, unknown>,
  expectedFields: readonly string[],
  fieldName: string,
): void {
  const expectedFieldSet = new Set(expectedFields);
  for (const actualField of Object.keys(record)) {
    if (!expectedFieldSet.has(actualField)) {
      throw stateError(
        `${fieldName} contains unsupported field ${JSON.stringify(actualField)}. Received: ${formatReceivedValue(record[actualField])}.`,
      );
    }
  }
  for (const expectedField of expectedFields) {
    if (!Object.hasOwn(record, expectedField)) {
      throw stateError(`${fieldName} is missing ${JSON.stringify(expectedField)}. Received: ${formatReceivedValue(record)}.`);
    }
  }
}

function assertShareFragmentLength(fragment: string): void {
  if (fragment.length > productionPlanShareFragmentMaxLength) {
    throw stateError(
      `Share fragment exceeds ${productionPlanShareFragmentMaxLength} characters. Received length: ${fragment.length}.`,
    );
  }
}

function stateError(message: string, cause?: unknown): ProductionPlanStateValidationError {
  return new ProductionPlanStateValidationError(message, cause === undefined ? undefined : { cause });
}

function formatReceivedValue(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return `[unserializable ${typeof value}: ${String(value)}]`;
    }
    throw error;
  }
}
