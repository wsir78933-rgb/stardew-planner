import {
  calculateProcessingRoute,
  getProcessingIngredient,
  getProcessingIngredientQualities,
  listProcessingIngredients,
  type ProcessingCoconutSource,
  type ProcessingMachine,
  type ProcessingMachineCounts,
  type ProcessingProfession,
  type ProcessingQuality,
  type ApplicableProcessingRouteQuote,
} from "@/src/processing-tools/processing-model";

export type ProductionMachine = ProcessingMachine;
export type ProductionProfession = ProcessingProfession;
export type ProductionQuality = ProcessingQuality;
export type ProductionCoconutSource = ProcessingCoconutSource;
export type ProductionMachineCounts = ProcessingMachineCounts;

export type ProductionInventoryLine = {
  readonly id: string;
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly quantity: number;
  readonly reservedQuantity: number;
  /** Day zero is the first planning morning; stock is available before that day's machines load. */
  readonly availableDay: number;
  readonly hasBearsKnowledge?: boolean;
  readonly coconutSource?: ProductionCoconutSource;
};

export type ProductionPlanInput = {
  readonly inventory: readonly ProductionInventoryLine[];
  readonly machineCounts: ProductionMachineCounts;
  readonly profession: ProductionProfession;
  readonly deadlineDays: 7 | 14 | 28;
};

export type ProductionPlanStatus =
  | "scheduled"
  | "no-unreserved-stock"
  | "no-machine-capacity"
  | "no-complete-batch"
  | "no-positive-value-batch";

export type ProductionInventoryConsumption = {
  readonly inventoryLineId: string;
  readonly quantity: number;
};

export type ProductionPlanAllocation = {
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly machine: ProductionMachine;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly processingMornings: number;
  readonly batchCount: number;
  readonly inputUnits: number;
  readonly productValue: number;
  readonly additionalValue: number;
};

export type ProductionLoadTask = {
  readonly id: string;
  readonly kind: "load";
  readonly machine: ProductionMachine;
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly processingMornings: number;
  readonly batchCount: number;
  readonly inputUnits: number;
  readonly inventoryConsumptions: readonly ProductionInventoryConsumption[];
};

export type ProductionCollectTask = {
  readonly id: string;
  readonly kind: "collect";
  readonly machine: ProductionMachine;
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly loadedDay: number;
  readonly processingMornings: number;
  readonly batchCount: number;
  readonly inputUnits: number;
  readonly productValue: number;
};

export type ProductionPlanDay = {
  readonly day: number;
  /** Collected before the day's load tasks. */
  readonly collectTasks: readonly ProductionCollectTask[];
  readonly loadTasks: readonly ProductionLoadTask[];
};

export type ProductionMachineUtilization = {
  readonly machineCount: number;
  readonly usedMachineDays: number;
  readonly availableMachineDays: number;
  readonly ratio: number;
};

export type ProductionPlanUtilization = {
  readonly usedMachineDays: number;
  readonly availableMachineDays: number;
  readonly ratio: number;
  readonly byMachine: Readonly<Record<ProductionMachine, ProductionMachineUtilization>>;
};

export type ProductionInventoryBalance = {
  readonly inventoryLineId: string;
  readonly quantity: number;
  readonly reservedQuantity: number;
  readonly processedQuantity: number;
  /** Remaining unreserved raw stock after the plan. */
  readonly remainingQuantity: number;
  readonly reservedValue: number;
  readonly remainingValue: number;
};

export type ProductionPlanResult = {
  readonly solutionKind: "feasible";
  readonly status: ProductionPlanStatus;
  readonly deadlineDays: number;
  /** Direct-sale value of unreserved stock available to this plan. */
  readonly directSaleBaselineValue: number;
  readonly processedGoodsValue: number;
  /** Raw-sale value of unreserved inventory left unprocessed. */
  readonly unprocessedInventoryValue: number;
  /** Reserved stock value is separate and excluded from this plan's revenue and added value. */
  readonly reservedValue: number;
  /** Processed goods plus unprocessed, unreserved stock; excludes reserved stock. */
  readonly finalValue: number;
  readonly additionalValue: number;
  readonly completedBatchCount: number;
  readonly allocations: readonly ProductionPlanAllocation[];
  readonly dailySchedule: readonly ProductionPlanDay[];
  readonly utilization: ProductionPlanUtilization;
  readonly inventoryBalances: readonly ProductionInventoryBalance[];
};

export class ProductionPlanInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductionPlanInputValidationError";
  }
}

export function isProductionPlanInputValidationError(error: unknown): error is ProductionPlanInputValidationError {
  return error instanceof ProductionPlanInputValidationError;
}

const PRODUCTION_MACHINES: readonly ProductionMachine[] = ["keg", "jar", "dehydrator"];
const PRODUCTION_QUALITIES: readonly ProductionQuality[] = ["normal", "silver", "gold", "iridium"];
const PRODUCTION_PROFESSIONS: readonly ProductionProfession[] = ["none", "tiller", "artisan"];
const PRODUCTION_COCONUT_SOURCES: readonly ProductionCoconutSource[] = ["foraged", "purchased-or-gifted"];
const PRODUCTION_DEADLINES = [7, 14, 28] as const;
const PRODUCTION_PLAN_INPUT_FIELDS = ["inventory", "machineCounts", "profession", "deadlineDays"] as const;
const PRODUCTION_INVENTORY_LINE_FIELDS = [
  "id",
  "ingredientId",
  "quality",
  "quantity",
  "reservedQuantity",
  "availableDay",
  "hasBearsKnowledge",
  "coconutSource",
] as const;
const KNOWN_PRODUCTION_INGREDIENT_IDS = new Set(listProcessingIngredients().map(({ id }) => id));
const MACHINE_ORDER = new Map(PRODUCTION_MACHINES.map((machine, index) => [machine, index]));
const QUALITY_ORDER = new Map(PRODUCTION_QUALITIES.map((quality, index) => [quality, index]));

type ProductionInventoryLot = {
  readonly line: ProductionInventoryLine;
  readonly inputIndex: number;
  readonly rawUnitPrice: number;
  readonly reservedValue: number;
  readonly unreservedBaselineValue: number;
  remainingQuantity: number;
  processedQuantity: number;
};

type ProductionIngredientGroup = {
  readonly key: string;
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly lots: ProductionInventoryLot[];
  readonly routes: Readonly<Partial<Record<ProductionMachine, ApplicableProcessingRouteQuote>>>;
};

type ProductionCandidate = {
  readonly group: ProductionIngredientGroup;
  readonly machine: ProductionMachine;
  readonly quote: ApplicableProcessingRouteQuote;
  readonly availableLots: readonly ProductionInventoryLot[];
  readonly batchCount: number;
  readonly firstBatchAdditionalValue: number;
  readonly score: number;
};

type ProductionMutableAllocation = {
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly machine: ProductionMachine;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly processingMornings: number;
  batchCount: number;
  inputUnits: number;
  productValue: number;
  additionalValue: number;
};

type ProductionScheduledBatch = {
  readonly machine: ProductionMachine;
  readonly ingredientId: string;
  readonly quality: ProductionQuality;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly loadedDay: number;
  readonly processingMornings: number;
  readonly batchCount: number;
  readonly inputUnits: number;
  readonly productValue: number;
};

type ProductionSchedulingState = {
  readonly lots: readonly ProductionInventoryLot[];
  readonly groups: readonly ProductionIngredientGroup[];
  readonly machineCounts: ProductionMachineCounts;
  readonly deadlineDays: number;
  readonly dailySchedule: ProductionPlanDay[];
  readonly allocations: Map<string, ProductionMutableAllocation>;
  readonly scheduledByCollectionDay: Map<number, ProductionScheduledBatch[]>;
  readonly activeMachineCounts: Record<ProductionMachine, number>;
  completedBatchCount: number;
  processedGoodsValue: number;
  usedMachineDaysByMachine: Record<ProductionMachine, number>;
  foundCompleteBatch: boolean;
  foundPositiveValueBatch: boolean;
};

export function readProductionPlanInput(value: unknown): ProductionPlanInput {
  const inputFields = readProductionObject(value, "input");
  rejectUnsupportedProductionFields(inputFields, PRODUCTION_PLAN_INPUT_FIELDS, "input");
  const deadlineDays = readProductionDeadline(inputFields.deadlineDays);
  const inventory = readProductionInventory(inputFields.inventory, deadlineDays);
  const machineCounts = readProductionMachineCounts(inputFields.machineCounts);
  const profession = readProductionProfession(inputFields.profession);

  return { inventory, machineCounts, profession, deadlineDays };
}

export function calculateProductionPlan(input: ProductionPlanInput): ProductionPlanResult {
  const validatedInput = readProductionPlanInput(input);
  const inventoryLots = createProductionInventoryLots(validatedInput);
  const groups = createProductionIngredientGroups(inventoryLots, validatedInput);
  const schedulingState = createProductionSchedulingState(validatedInput, inventoryLots, groups);

  runProductionSchedule(schedulingState);
  return createProductionPlanResult(schedulingState);
}

export function createExampleProductionPlan(): ProductionPlanInput {
  return {
    inventory: [
      {
        id: "cranberries-early-delivery",
        ingredientId: "cranberries",
        quality: "normal",
        quantity: 4,
        reservedQuantity: 1,
        availableDay: 0,
      },
      {
        id: "cranberries-late-delivery",
        ingredientId: "cranberries",
        quality: "normal",
        quantity: 8,
        reservedQuantity: 0,
        availableDay: 2,
      },
      {
        id: "coffee-beans",
        ingredientId: "coffee-bean",
        quality: "normal",
        quantity: 10,
        reservedQuantity: 0,
        availableDay: 0,
      },
    ],
    machineCounts: { keg: 1, jar: 1, dehydrator: 1 },
    profession: "artisan",
    deadlineDays: 14,
  };
}

function readProductionObject(value: unknown, fieldName: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ProductionPlanInputValidationError(
      `${fieldName} must be an object; received ${formatProductionValue(value)}`,
    );
  }
  return value as Record<string, unknown>;
}

function rejectUnsupportedProductionFields(
  fields: Record<string, unknown>,
  supportedFieldNames: readonly string[],
  objectPath: string,
): void {
  for (const fieldKey of Reflect.ownKeys(fields)) {
    const fieldName = typeof fieldKey === "string" ? fieldKey : String(fieldKey);
    if (!supportedFieldNames.includes(fieldName)) {
      throw new ProductionPlanInputValidationError(
        `${objectPath} contains unsupported field ${JSON.stringify(fieldName)}; received ${formatProductionValue(fields[fieldKey as keyof typeof fields])}`,
      );
    }
  }
}

function readProductionDeadline(value: unknown): 7 | 14 | 28 {
  if (!PRODUCTION_DEADLINES.includes(value as 7 | 14 | 28)) {
    throw new ProductionPlanInputValidationError(
      `deadlineDays must be 7, 14, or 28; received ${formatProductionValue(value)}`,
    );
  }
  return value as 7 | 14 | 28;
}

function readProductionProfession(value: unknown): ProductionProfession {
  if (!PRODUCTION_PROFESSIONS.includes(value as ProductionProfession)) {
    throw new ProductionPlanInputValidationError(
      `profession is invalid; received ${formatProductionValue(value)}`,
    );
  }
  return value as ProductionProfession;
}

function readProductionMachineCounts(value: unknown): ProductionMachineCounts {
  const countFields = readProductionObject(value, "machineCounts");
  rejectUnsupportedProductionFields(countFields, PRODUCTION_MACHINES, "machineCounts");

  const counts = {} as Record<ProductionMachine, number>;
  for (const machine of PRODUCTION_MACHINES) {
    const machineCount = countFields[machine];
    if (!Number.isSafeInteger(machineCount) || (machineCount as number) < 0) {
      throw new ProductionPlanInputValidationError(
        `machineCounts.${machine} must be a nonnegative safe integer; received ${formatProductionValue(machineCount)}`,
      );
    }
    counts[machine] = machineCount as number;
  }
  return counts;
}

function readProductionInventory(value: unknown, deadlineDays: number): readonly ProductionInventoryLine[] {
  if (!Array.isArray(value)) {
    throw new ProductionPlanInputValidationError(
      `inventory must be an array; received ${formatProductionValue(value)}`,
    );
  }

  const inventoryLineIds = new Set<string>();
  return value.map((lineValue, index) => {
    const lineFields = readProductionObject(lineValue, `inventory[${index}]`);
    const line = readProductionInventoryLine(lineFields, index, deadlineDays);
    if (inventoryLineIds.has(line.id)) {
      throw new ProductionPlanInputValidationError(
        `inventory[${index}].id duplicates ${JSON.stringify(line.id)}`,
      );
    }
    inventoryLineIds.add(line.id);
    return line;
  });
}

function readProductionInventoryLine(
  fields: Record<string, unknown>,
  index: number,
  deadlineDays: number,
): ProductionInventoryLine {
  const fieldPrefix = `inventory[${index}]`;
  rejectUnsupportedProductionFields(fields, PRODUCTION_INVENTORY_LINE_FIELDS, fieldPrefix);
  const id = fields.id;
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.id must be a nonempty string; received ${formatProductionValue(id)}`,
    );
  }

  const ingredientId = fields.ingredientId;
  if (typeof ingredientId !== "string" || !KNOWN_PRODUCTION_INGREDIENT_IDS.has(ingredientId)) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.ingredientId is unsupported; received ${formatProductionValue(ingredientId)}`,
    );
  }
  getProcessingIngredient(ingredientId);

  const quality = fields.quality;
  if (!PRODUCTION_QUALITIES.includes(quality as ProductionQuality)) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.quality is invalid; received ${formatProductionValue(quality)}`,
    );
  }
  if (!getProcessingIngredientQualities(ingredientId).includes(quality as ProductionQuality)) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.quality ${formatProductionValue(quality)} is unsupported for ingredientId ${JSON.stringify(ingredientId)}`,
    );
  }

  const quantity = readProductionNonnegativeInteger(fields.quantity, `${fieldPrefix}.quantity`);
  const reservedQuantity = readProductionNonnegativeInteger(
    fields.reservedQuantity,
    `${fieldPrefix}.reservedQuantity`,
  );
  if (reservedQuantity > quantity) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.reservedQuantity ${reservedQuantity} exceeds quantity ${quantity}`,
    );
  }

  const availableDay = readProductionNonnegativeInteger(fields.availableDay, `${fieldPrefix}.availableDay`);
  if (availableDay > deadlineDays) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.availableDay ${availableDay} exceeds deadlineDays ${deadlineDays}`,
    );
  }

  const hasBearsKnowledge = fields.hasBearsKnowledge;
  if (hasBearsKnowledge !== undefined && typeof hasBearsKnowledge !== "boolean") {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.hasBearsKnowledge must be boolean; received ${formatProductionValue(hasBearsKnowledge)}`,
    );
  }

  const coconutSource = fields.coconutSource;
  if (coconutSource !== undefined && !PRODUCTION_COCONUT_SOURCES.includes(coconutSource as ProductionCoconutSource)) {
    throw new ProductionPlanInputValidationError(
      `${fieldPrefix}.coconutSource is invalid; received ${formatProductionValue(coconutSource)}`,
    );
  }

  return {
    id,
    ingredientId,
    quality: quality as ProductionQuality,
    quantity,
    reservedQuantity,
    availableDay,
    ...(hasBearsKnowledge === undefined ? {} : { hasBearsKnowledge }),
    ...(coconutSource === undefined ? {} : { coconutSource: coconutSource as ProductionCoconutSource }),
  };
}

function readProductionNonnegativeInteger(value: unknown, fieldName: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new ProductionPlanInputValidationError(
      `${fieldName} must be a nonnegative safe integer; received ${formatProductionValue(value)}`,
    );
  }
  return value as number;
}

function createProductionInventoryLots(input: ProductionPlanInput): ProductionInventoryLot[] {
  return input.inventory.map((line, inputIndex) => {
    const rawUnitPrice = quoteProductionRawUnitPrice(line, input.profession);
    const reservedValue = multiplyProductionGold(
      line.reservedQuantity,
      rawUnitPrice,
      `inventory[${inputIndex}].reservedValue`,
    );
    const unreservedQuantity = line.quantity - line.reservedQuantity;
    const unreservedBaselineValue = multiplyProductionGold(
      unreservedQuantity,
      rawUnitPrice,
      `inventory[${inputIndex}].unreservedBaselineValue`,
    );
    return {
      line,
      inputIndex,
      rawUnitPrice,
      reservedValue,
      unreservedBaselineValue,
      remainingQuantity: unreservedQuantity,
      processedQuantity: 0,
    };
  });
}

function quoteProductionRawUnitPrice(line: ProductionInventoryLine, profession: ProductionProfession): number {
  const quote = calculateProcessingRoute({
    ingredientId: line.ingredientId,
    quantity: 1,
    quality: line.quality,
    profession,
    mode: "unlimited",
    deadlineDays: 1,
    machineCounts: { keg: 0, jar: 0, dehydrator: 0 },
    machine: "keg",
    ...(line.hasBearsKnowledge === undefined ? {} : { hasBearsKnowledge: line.hasBearsKnowledge }),
    ...(line.coconutSource === undefined ? {} : { coconutSource: line.coconutSource }),
  });
  return quote.rawUnitPrice;
}

function createProductionIngredientGroups(
  lots: readonly ProductionInventoryLot[],
  input: ProductionPlanInput,
): ProductionIngredientGroup[] {
  const lotsByKey = new Map<string, ProductionInventoryLot[]>();
  for (const lot of lots) {
    const key = createProductionGroupKey(lot.line.ingredientId, lot.line.quality);
    const currentLots = lotsByKey.get(key) ?? [];
    currentLots.push(lot);
    lotsByKey.set(key, currentLots);
  }

  return [...lotsByKey.entries()]
    .map(([key, groupLots]) => createProductionIngredientGroup(key, groupLots, input))
    .sort(compareProductionGroups);
}

function createProductionIngredientGroup(
  key: string,
  lots: ProductionInventoryLot[],
  input: ProductionPlanInput,
): ProductionIngredientGroup {
  const representativeLine = lots[0]?.line;
  if (representativeLine === undefined) {
    throw new Error(`Production ingredient group ${JSON.stringify(key)} has no inventory lines`);
  }
  const routes: Partial<Record<ProductionMachine, ApplicableProcessingRouteQuote>> = {};

  for (const machine of PRODUCTION_MACHINES) {
    const quote = calculateProcessingRoute({
      ingredientId: representativeLine.ingredientId,
      quantity: 1,
      quality: representativeLine.quality,
      profession: input.profession,
      mode: "unlimited",
      deadlineDays: input.deadlineDays,
      machineCounts: { keg: 0, jar: 0, dehydrator: 0 },
      machine,
      ...(representativeLine.hasBearsKnowledge === undefined
        ? {}
        : { hasBearsKnowledge: representativeLine.hasBearsKnowledge }),
      ...(representativeLine.coconutSource === undefined
        ? {}
        : { coconutSource: representativeLine.coconutSource }),
    });
    if (quote.applicable) routes[machine] = quote;
  }

  return {
    key,
    ingredientId: representativeLine.ingredientId,
    quality: representativeLine.quality,
    lots,
    routes,
  };
}

function createProductionGroupKey(ingredientId: string, quality: ProductionQuality): string {
  return JSON.stringify([ingredientId, quality]);
}

function compareProductionGroups(
  leftGroup: ProductionIngredientGroup,
  rightGroup: ProductionIngredientGroup,
): number {
  const ingredientOrder = leftGroup.ingredientId.localeCompare(rightGroup.ingredientId);
  if (ingredientOrder !== 0) return ingredientOrder;
  return (QUALITY_ORDER.get(leftGroup.quality) ?? 0) - (QUALITY_ORDER.get(rightGroup.quality) ?? 0);
}

function createProductionSchedulingState(
  input: ProductionPlanInput,
  lots: ProductionInventoryLot[],
  groups: ProductionIngredientGroup[],
): ProductionSchedulingState {
  return {
    lots,
    groups,
    machineCounts: input.machineCounts,
    deadlineDays: input.deadlineDays,
    dailySchedule: [],
    allocations: new Map(),
    scheduledByCollectionDay: new Map(),
    activeMachineCounts: { keg: 0, jar: 0, dehydrator: 0 },
    completedBatchCount: 0,
    processedGoodsValue: 0,
    usedMachineDaysByMachine: { keg: 0, jar: 0, dehydrator: 0 },
    foundCompleteBatch: false,
    foundPositiveValueBatch: false,
  };
}

function runProductionSchedule(state: ProductionSchedulingState): void {
  for (let day = 0; day <= state.deadlineDays; day += 1) {
    const collectTasks = collectProductionBatches(state, day);
    const loadTasks = loadProductionBatches(state, day);
    state.dailySchedule.push({ day, collectTasks, loadTasks });
  }
}

function collectProductionBatches(state: ProductionSchedulingState, day: number): readonly ProductionCollectTask[] {
  const completingBatches = state.scheduledByCollectionDay.get(day) ?? [];
  const collectTasks = completingBatches.map((batch) => {
    state.activeMachineCounts[batch.machine] -= batch.batchCount;
    state.completedBatchCount = addProductionGold(
      state.completedBatchCount,
      batch.batchCount,
      "completedBatchCount",
    );
    return createProductionCollectTask(batch, day);
  });
  state.scheduledByCollectionDay.delete(day);
  return collectTasks.sort(compareProductionTasks);
}

function createProductionCollectTask(batch: ProductionScheduledBatch, day: number): ProductionCollectTask {
  return {
    id: createProductionTaskId("collect", day, batch.machine, batch.ingredientId, batch.quality),
    kind: "collect",
    machine: batch.machine,
    ingredientId: batch.ingredientId,
    quality: batch.quality,
    productEnglishName: batch.productEnglishName,
    productChineseName: batch.productChineseName,
    loadedDay: batch.loadedDay,
    processingMornings: batch.processingMornings,
    batchCount: batch.batchCount,
    inputUnits: batch.inputUnits,
    productValue: batch.productValue,
  };
}

function loadProductionBatches(state: ProductionSchedulingState, day: number): readonly ProductionLoadTask[] {
  const attemptedGroupRoutes = new Set<string>();
  const loadTasks: ProductionLoadTask[] = [];

  while (true) {
    const candidates = createProductionCandidates(state, day, attemptedGroupRoutes);
    if (candidates.length === 0) break;
    candidates.sort(compareProductionCandidates);

    const selectedCandidate = candidates[0];
    if (selectedCandidate === undefined) break;
    attemptedGroupRoutes.add(createProductionGroupRouteKey(selectedCandidate.group.key, selectedCandidate.machine));
    loadTasks.push(scheduleProductionCandidate(state, selectedCandidate, day));
  }

  return loadTasks.sort(compareProductionTasks);
}

function createProductionCandidates(
  state: ProductionSchedulingState,
  day: number,
  attemptedGroupRoutes: ReadonlySet<string>,
): ProductionCandidate[] {
  const candidates: ProductionCandidate[] = [];
  for (const group of state.groups) {
    for (const machine of PRODUCTION_MACHINES) {
      if (attemptedGroupRoutes.has(createProductionGroupRouteKey(group.key, machine))) continue;
      const freeMachineCount = getProductionFreeMachineCount(state, machine);
      if (freeMachineCount === 0) continue;
      const candidate = createProductionCandidate(state, group, machine, freeMachineCount, day);
      if (candidate !== null) candidates.push(candidate);
    }
  }
  return candidates;
}

function createProductionCandidate(
  state: ProductionSchedulingState,
  group: ProductionIngredientGroup,
  machine: ProductionMachine,
  freeMachineCount: number,
  day: number,
): ProductionCandidate | null {
  const quote = group.routes[machine];
  if (quote === undefined) return null;

  const availableLots = group.lots
    .filter((lot) => lot.remainingQuantity > 0 && lot.line.availableDay <= day)
    .sort(compareProductionLots);
  const availableUnits = sumProductionLotUnits(availableLots);
  const completeBatchCount = Math.floor(availableUnits / quote.batchInputUnits);
  if (completeBatchCount === 0 || day + quote.processingMornings > state.deadlineDays) return null;

  state.foundCompleteBatch = true;
  const maximumBatchCount = Math.min(completeBatchCount, freeMachineCount);
  const profitableBatchCount = findProductionProfitableBatchCount(
    availableLots,
    quote.batchInputUnits,
    quote.batchOutputPrice,
    maximumBatchCount,
  );
  if (profitableBatchCount === 0) return null;

  state.foundPositiveValueBatch = true;
  const firstBatchRawCost = calculateProductionBatchRawCost(availableLots, quote.batchInputUnits, 1);
  const firstBatchAdditionalValue = quote.batchOutputPrice - firstBatchRawCost;
  return {
    group,
    machine,
    quote,
    availableLots,
    batchCount: profitableBatchCount,
    firstBatchAdditionalValue,
    score: firstBatchAdditionalValue / quote.processingMornings,
  };
}

function compareProductionLots(leftLot: ProductionInventoryLot, rightLot: ProductionInventoryLot): number {
  if (leftLot.rawUnitPrice !== rightLot.rawUnitPrice) return leftLot.rawUnitPrice - rightLot.rawUnitPrice;
  if (leftLot.line.availableDay !== rightLot.line.availableDay) {
    return leftLot.line.availableDay - rightLot.line.availableDay;
  }
  return leftLot.inputIndex - rightLot.inputIndex;
}

function sumProductionLotUnits(lots: readonly ProductionInventoryLot[]): number {
  return lots.reduce((totalUnits, lot) =>
    addProductionGold(totalUnits, lot.remainingQuantity, "available production units"), 0);
}

function findProductionProfitableBatchCount(
  lots: readonly ProductionInventoryLot[],
  batchInputUnits: number,
  batchOutputPrice: number,
  maximumBatchCount: number,
): number {
  let lastProfitableBatchCount = 0;
  let firstUnprofitableBatchCount = maximumBatchCount + 1;

  while (lastProfitableBatchCount + 1 < firstUnprofitableBatchCount) {
    const candidateBatchCount = Math.floor((lastProfitableBatchCount + firstUnprofitableBatchCount) / 2);
    const rawCost = calculateProductionBatchRawCost(lots, batchInputUnits, candidateBatchCount);
    if (batchOutputPrice > rawCost) {
      lastProfitableBatchCount = candidateBatchCount;
    } else {
      firstUnprofitableBatchCount = candidateBatchCount;
    }
  }
  return lastProfitableBatchCount;
}

function calculateProductionBatchRawCost(
  lots: readonly ProductionInventoryLot[],
  batchInputUnits: number,
  batchIndex: number,
): number {
  const unitsBeforeBatch = multiplyProductionGold(batchIndex - 1, batchInputUnits, "batch units before candidate");
  const unitsThroughBatch = multiplyProductionGold(batchIndex, batchInputUnits, "batch units through candidate");
  return calculateProductionRawCostForUnits(lots, unitsThroughBatch)
    - calculateProductionRawCostForUnits(lots, unitsBeforeBatch);
}

function calculateProductionRawCostForUnits(lots: readonly ProductionInventoryLot[], unitCount: number): number {
  let unitsRemaining = unitCount;
  let rawCost = 0;
  for (const lot of lots) {
    if (unitsRemaining === 0) break;
    const consumedUnits = Math.min(unitsRemaining, lot.remainingQuantity);
    rawCost = addProductionGold(
      rawCost,
      multiplyProductionGold(consumedUnits, lot.rawUnitPrice, `raw cost for ${JSON.stringify(lot.line.id)}`),
      "batch raw cost",
    );
    unitsRemaining -= consumedUnits;
  }
  if (unitsRemaining !== 0) {
    throw new Error(`Production batch requested ${unitCount} units but ${unitsRemaining} units were unavailable`);
  }
  return rawCost;
}

function compareProductionCandidates(leftCandidate: ProductionCandidate, rightCandidate: ProductionCandidate): number {
  if (leftCandidate.score !== rightCandidate.score) return rightCandidate.score - leftCandidate.score;
  if (leftCandidate.firstBatchAdditionalValue !== rightCandidate.firstBatchAdditionalValue) {
    return rightCandidate.firstBatchAdditionalValue - leftCandidate.firstBatchAdditionalValue;
  }
  const machineOrder = (MACHINE_ORDER.get(leftCandidate.machine) ?? 0)
    - (MACHINE_ORDER.get(rightCandidate.machine) ?? 0);
  if (machineOrder !== 0) return machineOrder;
  const ingredientOrder = leftCandidate.group.ingredientId.localeCompare(rightCandidate.group.ingredientId);
  if (ingredientOrder !== 0) return ingredientOrder;
  return (QUALITY_ORDER.get(leftCandidate.group.quality) ?? 0)
    - (QUALITY_ORDER.get(rightCandidate.group.quality) ?? 0);
}

function scheduleProductionCandidate(
  state: ProductionSchedulingState,
  candidate: ProductionCandidate,
  day: number,
): ProductionLoadTask {
  const { group, machine, quote, batchCount } = candidate;
  const inputUnits = multiplyProductionGold(batchCount, quote.batchInputUnits, "scheduled batch input units");
  const inventoryConsumptions = consumeProductionInventory(candidate.availableLots, inputUnits);
  const rawInputValue = inventoryConsumptions.reduce((rawValue, consumption) => {
    const lot = state.lots.find((candidateLot) => candidateLot.line.id === consumption.inventoryLineId);
    if (lot === undefined) {
      throw new Error(`Production inventory line ${JSON.stringify(consumption.inventoryLineId)} disappeared during scheduling`);
    }
    return addProductionGold(
      rawValue,
      multiplyProductionGold(consumption.quantity, lot.rawUnitPrice, `raw value for ${JSON.stringify(lot.line.id)}`),
      "scheduled raw input value",
    );
  }, 0);
  const productValue = multiplyProductionGold(batchCount, quote.batchOutputPrice, "scheduled product value");
  const additionalValue = productValue - rawInputValue;
  if (additionalValue <= 0) {
    throw new Error(`Scheduled production route ${JSON.stringify(group.ingredientId)} added nonpositive value ${additionalValue}`);
  }

  state.processedGoodsValue = addProductionGold(state.processedGoodsValue, productValue, "processedGoodsValue");
  state.activeMachineCounts[machine] = addProductionGold(
    state.activeMachineCounts[machine],
    batchCount,
    `active ${machine} count`,
  );
  state.usedMachineDaysByMachine[machine] = addProductionGold(
    state.usedMachineDaysByMachine[machine],
    multiplyProductionGold(batchCount, quote.processingMornings, `${machine} used machine-days`),
    `${machine} used machine-days`,
  );
  addProductionAllocation(state, candidate, inputUnits, productValue, additionalValue);
  addScheduledProductionBatch(state, candidate, day, inputUnits, productValue);

  return {
    id: createProductionTaskId("load", day, machine, group.ingredientId, group.quality),
    kind: "load",
    machine,
    ingredientId: group.ingredientId,
    quality: group.quality,
    productEnglishName: quote.productEnglishName,
    productChineseName: quote.productChineseName,
    processingMornings: quote.processingMornings,
    batchCount,
    inputUnits,
    inventoryConsumptions,
  };
}

function consumeProductionInventory(
  availableLots: readonly ProductionInventoryLot[],
  inputUnits: number,
): readonly ProductionInventoryConsumption[] {
  let unitsRemaining = inputUnits;
  const consumptions: ProductionInventoryConsumption[] = [];

  for (const lot of availableLots) {
    if (unitsRemaining === 0) break;
    const consumedUnits = Math.min(unitsRemaining, lot.remainingQuantity);
    if (consumedUnits === 0) continue;
    lot.remainingQuantity -= consumedUnits;
    lot.processedQuantity = addProductionGold(
      lot.processedQuantity,
      consumedUnits,
      `processed quantity for ${JSON.stringify(lot.line.id)}`,
    );
    unitsRemaining -= consumedUnits;
    consumptions.push({ inventoryLineId: lot.line.id, quantity: consumedUnits });
  }

  if (unitsRemaining !== 0) {
    throw new Error(`Production scheduler could not consume ${inputUnits} units; ${unitsRemaining} remain`);
  }
  return consumptions;
}

function addProductionAllocation(
  state: ProductionSchedulingState,
  candidate: ProductionCandidate,
  inputUnits: number,
  productValue: number,
  additionalValue: number,
): void {
  const { group, machine, quote } = candidate;
  const allocationKey = createProductionGroupRouteKey(group.key, machine);
  const currentAllocation = state.allocations.get(allocationKey);
  if (currentAllocation === undefined) {
    state.allocations.set(allocationKey, {
      ingredientId: group.ingredientId,
      quality: group.quality,
      machine,
      productEnglishName: quote.productEnglishName,
      productChineseName: quote.productChineseName,
      processingMornings: quote.processingMornings,
      batchCount: candidate.batchCount,
      inputUnits,
      productValue,
      additionalValue,
    });
    return;
  }
  currentAllocation.batchCount = addProductionGold(currentAllocation.batchCount, candidate.batchCount, "allocation batchCount");
  currentAllocation.inputUnits = addProductionGold(currentAllocation.inputUnits, inputUnits, "allocation inputUnits");
  currentAllocation.productValue = addProductionGold(currentAllocation.productValue, productValue, "allocation productValue");
  currentAllocation.additionalValue = addProductionGold(
    currentAllocation.additionalValue,
    additionalValue,
    "allocation additionalValue",
  );
}

function addScheduledProductionBatch(
  state: ProductionSchedulingState,
  candidate: ProductionCandidate,
  loadedDay: number,
  inputUnits: number,
  productValue: number,
): void {
  const quote = candidate.quote;
  const collectionDay = loadedDay + quote.processingMornings;
  const scheduledBatch: ProductionScheduledBatch = {
    machine: candidate.machine,
    ingredientId: candidate.group.ingredientId,
    quality: candidate.group.quality,
    productEnglishName: quote.productEnglishName,
    productChineseName: quote.productChineseName,
    loadedDay,
    processingMornings: quote.processingMornings,
    batchCount: candidate.batchCount,
    inputUnits,
    productValue,
  };
  const completingBatches = state.scheduledByCollectionDay.get(collectionDay) ?? [];
  completingBatches.push(scheduledBatch);
  state.scheduledByCollectionDay.set(collectionDay, completingBatches);
}

function getProductionFreeMachineCount(state: ProductionSchedulingState, machine: ProductionMachine): number {
  return state.machineCounts[machine] - state.activeMachineCounts[machine];
}

function createProductionPlanResult(state: ProductionSchedulingState): ProductionPlanResult {
  const directSaleBaselineValue = sumProductionGold(
    state.lots.map(({ unreservedBaselineValue }) => unreservedBaselineValue),
    "directSaleBaselineValue",
  );
  const reservedValue = sumProductionGold(state.lots.map(({ reservedValue: lotReservedValue }) => lotReservedValue), "reservedValue");
  const unprocessedInventoryValue = sumProductionGold(
    state.lots.map((lot) => multiplyProductionGold(
      lot.remainingQuantity,
      lot.rawUnitPrice,
      `remainingValue for ${JSON.stringify(lot.line.id)}`,
    )),
    "unprocessedInventoryValue",
  );
  const finalValue = addProductionGold(state.processedGoodsValue, unprocessedInventoryValue, "finalValue");
  const additionalValue = finalValue - directSaleBaselineValue;
  const allocationList = [...state.allocations.values()].map((allocation) => ({ ...allocation }));
  const inventoryBalances = state.lots.map(createProductionInventoryBalance);
  const utilization = createProductionUtilization(state);
  const status = readProductionPlanStatus(state, allocationList);

  assertProductionValueConservation(
    directSaleBaselineValue,
    reservedValue,
    finalValue,
    additionalValue,
    inventoryBalances,
  );

  return {
    solutionKind: "feasible",
    status,
    deadlineDays: state.deadlineDays,
    directSaleBaselineValue,
    processedGoodsValue: state.processedGoodsValue,
    unprocessedInventoryValue,
    reservedValue,
    finalValue,
    additionalValue,
    completedBatchCount: state.completedBatchCount,
    allocations: allocationList.sort(compareProductionAllocations),
    dailySchedule: state.dailySchedule,
    utilization,
    inventoryBalances,
  };
}

function createProductionInventoryBalance(lot: ProductionInventoryLot): ProductionInventoryBalance {
  const remainingValue = multiplyProductionGold(
    lot.remainingQuantity,
    lot.rawUnitPrice,
    `remainingValue for ${JSON.stringify(lot.line.id)}`,
  );
  if (lot.line.quantity !== lot.line.reservedQuantity + lot.processedQuantity + lot.remainingQuantity) {
    throw new Error(
      `Inventory conservation failed for ${JSON.stringify(lot.line.id)}: quantity ${lot.line.quantity}, reserved ${lot.line.reservedQuantity}, processed ${lot.processedQuantity}, remaining ${lot.remainingQuantity}`,
    );
  }
  return {
    inventoryLineId: lot.line.id,
    quantity: lot.line.quantity,
    reservedQuantity: lot.line.reservedQuantity,
    processedQuantity: lot.processedQuantity,
    remainingQuantity: lot.remainingQuantity,
    reservedValue: lot.reservedValue,
    remainingValue,
  };
}

function createProductionUtilization(state: ProductionSchedulingState): ProductionPlanUtilization {
  const byMachine = {} as Record<ProductionMachine, ProductionMachineUtilization>;
  for (const machine of PRODUCTION_MACHINES) {
    const availableMachineDays = multiplyProductionGold(
      state.machineCounts[machine],
      state.deadlineDays,
      `${machine} available machine-days`,
    );
    const usedMachineDays = state.usedMachineDaysByMachine[machine];
    byMachine[machine] = {
      machineCount: state.machineCounts[machine],
      usedMachineDays,
      availableMachineDays,
      ratio: availableMachineDays === 0 ? 0 : usedMachineDays / availableMachineDays,
    };
  }
  const usedMachineDays = sumProductionGold(
    PRODUCTION_MACHINES.map((machine) => byMachine[machine].usedMachineDays),
    "usedMachineDays",
  );
  const availableMachineDays = sumProductionGold(
    PRODUCTION_MACHINES.map((machine) => byMachine[machine].availableMachineDays),
    "availableMachineDays",
  );
  return {
    usedMachineDays,
    availableMachineDays,
    ratio: availableMachineDays === 0 ? 0 : usedMachineDays / availableMachineDays,
    byMachine,
  };
}

function readProductionPlanStatus(
  state: ProductionSchedulingState,
  allocations: readonly ProductionMutableAllocation[],
): ProductionPlanStatus {
  if (allocations.length > 0) return "scheduled";
  const unreservedQuantity = sumProductionGold(
    state.lots.map((lot) => lot.line.quantity - lot.line.reservedQuantity),
    "unreserved quantity",
  );
  if (unreservedQuantity === 0) return "no-unreserved-stock";

  const configuredMachineCount = sumProductionGold(
    PRODUCTION_MACHINES.map((machine) => state.machineCounts[machine]),
    "configured machine count",
  );
  if (configuredMachineCount === 0) return "no-machine-capacity";
  if (!state.foundCompleteBatch) return "no-complete-batch";
  if (!state.foundPositiveValueBatch) return "no-positive-value-batch";
  return "no-positive-value-batch";
}

function assertProductionValueConservation(
  directSaleBaselineValue: number,
  reservedValue: number,
  finalValue: number,
  additionalValue: number,
  balances: readonly ProductionInventoryBalance[],
): void {
  if (finalValue !== directSaleBaselineValue + additionalValue) {
    throw new Error(
      `Production value conservation failed: baseline ${directSaleBaselineValue}, final ${finalValue}, additional ${additionalValue}`,
    );
  }
  const balanceReservedValue = sumProductionGold(balances.map(({ reservedValue: value }) => value), "balance reserved value");
  if (balanceReservedValue !== reservedValue) {
    throw new Error(`Reserved value conservation failed: result ${reservedValue}, inventory rows ${balanceReservedValue}`);
  }
}

function createProductionTaskId(
  kind: "load" | "collect",
  day: number,
  machine: ProductionMachine,
  ingredientId: string,
  quality: ProductionQuality,
): string {
  return `${kind}:${day}:${machine}:${ingredientId}:${quality}`;
}

function createProductionGroupRouteKey(groupKey: string, machine: ProductionMachine): string {
  return `${groupKey}:${machine}`;
}

function compareProductionTasks(
  leftTask: ProductionLoadTask | ProductionCollectTask,
  rightTask: ProductionLoadTask | ProductionCollectTask,
): number {
  const machineOrder = (MACHINE_ORDER.get(leftTask.machine) ?? 0) - (MACHINE_ORDER.get(rightTask.machine) ?? 0);
  if (machineOrder !== 0) return machineOrder;
  const ingredientOrder = leftTask.ingredientId.localeCompare(rightTask.ingredientId);
  if (ingredientOrder !== 0) return ingredientOrder;
  return (QUALITY_ORDER.get(leftTask.quality) ?? 0) - (QUALITY_ORDER.get(rightTask.quality) ?? 0);
}

function compareProductionAllocations(
  leftAllocation: ProductionPlanAllocation,
  rightAllocation: ProductionPlanAllocation,
): number {
  const ingredientOrder = leftAllocation.ingredientId.localeCompare(rightAllocation.ingredientId);
  if (ingredientOrder !== 0) return ingredientOrder;
  const qualityOrder = (QUALITY_ORDER.get(leftAllocation.quality) ?? 0)
    - (QUALITY_ORDER.get(rightAllocation.quality) ?? 0);
  if (qualityOrder !== 0) return qualityOrder;
  return (MACHINE_ORDER.get(leftAllocation.machine) ?? 0) - (MACHINE_ORDER.get(rightAllocation.machine) ?? 0);
}

function sumProductionGold(values: readonly number[], fieldName: string): number {
  return values.reduce((total, value) => addProductionGold(total, value, fieldName), 0);
}

function addProductionGold(leftValue: number, rightValue: number, fieldName: string): number {
  const sum = leftValue + rightValue;
  if (!Number.isSafeInteger(sum)) {
    throw new Error(`${fieldName} is outside safe integer range: ${formatProductionValue(sum)}`);
  }
  return sum;
}

function multiplyProductionGold(leftValue: number, rightValue: number, fieldName: string): number {
  const product = leftValue * rightValue;
  if (!Number.isSafeInteger(product)) {
    throw new Error(`${fieldName} is outside safe integer range: ${formatProductionValue(product)}`);
  }
  return product;
}

function formatProductionValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(length=${value.length})`;
  if (typeof value === "object") return `object(keys=${JSON.stringify(Object.keys(value))})`;
  return String(value);
}
