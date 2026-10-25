import { describe, expect, it } from "vitest";
import {
  calculateProductionPlan,
  createExampleProductionPlan,
  isProductionPlanInputValidationError,
  ProductionPlanInputValidationError,
  readProductionPlanInput,
  type ProductionPlanInput,
} from "@/src/production-tools/production-model";

function productionInput(overrides: Partial<ProductionPlanInput> = {}): ProductionPlanInput {
  return {
    inventory: [
      {
        id: "cranberries",
        ingredientId: "cranberries",
        quality: "normal",
        quantity: 1,
        reservedQuantity: 0,
        availableDay: 0,
      },
    ],
    machineCounts: { keg: 1, jar: 0, dehydrator: 0 },
    profession: "none",
    deadlineDays: 7,
    ...overrides,
  };
}

describe("readProductionPlanInput", () => {
  it("accepts the public example and preserves optional processing context", () => {
    const parsedPlanInput = readProductionPlanInput({
      ...createExampleProductionPlan(),
      inventory: [
        {
          id: "coconut-box",
          ingredientId: "coconut",
          quality: "gold",
          quantity: 4,
          reservedQuantity: 1,
          availableDay: 3,
          hasBearsKnowledge: false,
          coconutSource: "purchased-or-gifted",
        },
      ],
    });

    expect(parsedPlanInput.inventory[0]).toMatchObject({
      ingredientId: "coconut",
      quality: "gold",
      hasBearsKnowledge: false,
      coconutSource: "purchased-or-gifted",
    });
  });

  it("fails fast with the invalid field and concrete value", () => {
    const invalidInputs: readonly unknown[] = [
      productionInput({ deadlineDays: 10 as 7 }),
      productionInput({ machineCounts: { keg: -1, jar: 0, dehydrator: 0 } }),
      productionInput({
        inventory: [{
          id: "duplicate",
          ingredientId: "cranberries",
          quality: "normal",
          quantity: 1,
          reservedQuantity: 0,
          availableDay: 0,
        }, {
          id: "duplicate",
          ingredientId: "cranberries",
          quality: "normal",
          quantity: 1,
          reservedQuantity: 0,
          availableDay: 0,
        }],
      }),
      productionInput({
        inventory: [{
          id: "too-much-reserved",
          ingredientId: "cranberries",
          quality: "normal",
          quantity: 2,
          reservedQuantity: 3,
          availableDay: 0,
        }],
      }),
      productionInput({
        inventory: [{
          id: "late-arrival",
          ingredientId: "cranberries",
          quality: "normal",
          quantity: 2,
          reservedQuantity: 0,
          availableDay: 8,
        }],
      }),
      productionInput({
        inventory: [{
          id: "unsupported-quality",
          ingredientId: "tea-leaves",
          quality: "gold",
          quantity: 1,
          reservedQuantity: 0,
          availableDay: 0,
        }],
      }),
      productionInput({
        inventory: [{
          id: "unknown-item",
          ingredientId: "not-a-real-item",
          quality: "normal",
          quantity: 1,
          reservedQuantity: 0,
          availableDay: 0,
        }],
      }),
    ];

    for (const invalidInput of invalidInputs) {
      expect(() => readProductionPlanInput(invalidInput)).toThrow(ProductionPlanInputValidationError);
    }
    expect(() => readProductionPlanInput(productionInput({ deadlineDays: 10 as 7 }))).toThrow("deadlineDays must be 7, 14, or 28; received 10");
    expect(() => readProductionPlanInput(productionInput({ machineCounts: { keg: -1, jar: 0, dehydrator: 0 } }))).toThrow("machineCounts.keg");
    expect(() => readProductionPlanInput(productionInput({
      inventory: [{ id: "late-arrival", ingredientId: "cranberries", quality: "normal", quantity: 2, reservedQuantity: 0, availableDay: 8 }],
    }))).toThrow("availableDay 8 exceeds deadlineDays 7");
    expect(isProductionPlanInputValidationError(new ProductionPlanInputValidationError("test"))).toBe(true);
    expect(isProductionPlanInputValidationError(new Error("unknown failure"))).toBe(false);
  });

  it("rejects unknown fields at every input boundary and reports their values", () => {
    const unknownTopLevelField = {
      ...productionInput(),
      unexpectedSetting: "keep-this-value",
    };
    const misspelledBearKnowledge = productionInput({
      inventory: [{
        id: "bear-knowledge-typo",
        ingredientId: "cranberries",
        quality: "normal",
        quantity: 1,
        reservedQuantity: 0,
        availableDay: 0,
        hasBearsKnowlege: true,
      } as unknown as ProductionPlanInput["inventory"][number]],
    });
    const unknownMachineCount = productionInput({
      machineCounts: { keg: 1, jar: 0, dehydrator: 0, preservesJar: 2 } as unknown as ProductionPlanInput["machineCounts"],
    });

    expect(() => readProductionPlanInput(unknownTopLevelField)).toThrow(
      'input contains unsupported field "unexpectedSetting"; received "keep-this-value"',
    );
    expect(() => readProductionPlanInput(misspelledBearKnowledge)).toThrow(
      'inventory[0] contains unsupported field "hasBearsKnowlege"; received true',
    );
    expect(() => readProductionPlanInput(unknownMachineCount)).toThrow(
      'machineCounts contains unsupported field "preservesJar"; received 2',
    );
    expect(() => readProductionPlanInput(misspelledBearKnowledge)).toThrow(ProductionPlanInputValidationError);
  });
});

describe("calculateProductionPlan", () => {
  it("combines deliveries arriving on different days into a complete Dehydrator batch", () => {
    const plan = calculateProductionPlan(productionInput({
      inventory: [
        { id: "cranberries-day-0", ingredientId: "cranberries", quality: "normal", quantity: 3, reservedQuantity: 0, availableDay: 0 },
        { id: "cranberries-day-2", ingredientId: "cranberries", quality: "normal", quantity: 2, reservedQuantity: 0, availableDay: 2 },
      ],
      machineCounts: { keg: 0, jar: 0, dehydrator: 1 },
    }));

    expect(plan.status).toBe("scheduled");
    expect(plan.dailySchedule[0]?.loadTasks).toHaveLength(0);
    expect(plan.dailySchedule[1]?.loadTasks).toHaveLength(0);
    expect(plan.dailySchedule[2]?.loadTasks).toMatchObject([{
      machine: "dehydrator",
      batchCount: 1,
      inputUnits: 5,
      inventoryConsumptions: [
        { inventoryLineId: "cranberries-day-0", quantity: 3 },
        { inventoryLineId: "cranberries-day-2", quantity: 2 },
      ],
    }]);
    expect(plan.dailySchedule[3]?.collectTasks).toMatchObject([{
      machine: "dehydrator",
      loadedDay: 2,
      productEnglishName: "Dried Fruit",
    }]);
    expect(plan.inventoryBalances.map(({ processedQuantity, remainingQuantity }) => ({ processedQuantity, remainingQuantity }))).toEqual([
      { processedQuantity: 3, remainingQuantity: 0 },
      { processedQuantity: 2, remainingQuantity: 0 },
    ]);
  });

  it("loads on day zero, collects on the deadline morning, and keeps reserved value outside plan revenue", () => {
    const plan = calculateProductionPlan(productionInput({
      inventory: [{
        id: "reserved-cranberries",
        ingredientId: "cranberries",
        quality: "normal",
        quantity: 4,
        reservedQuantity: 2,
        availableDay: 0,
      }],
    }));

    expect(plan.dailySchedule[0]?.loadTasks).toMatchObject([{ id: "load:0:keg:cranberries:normal", batchCount: 1 }]);
    expect(plan.dailySchedule[7]?.collectTasks).toMatchObject([{ id: "collect:7:keg:cranberries:normal", batchCount: 1 }]);
    expect(plan.dailySchedule[7]?.loadTasks).toHaveLength(0);
    expect(plan).toMatchObject({
      directSaleBaselineValue: 150,
      processedGoodsValue: 225,
      unprocessedInventoryValue: 75,
      reservedValue: 150,
      finalValue: 300,
      additionalValue: 150,
    });
    expect(plan.inventoryBalances[0]).toMatchObject({
      quantity: 4,
      reservedQuantity: 2,
      processedQuantity: 1,
      remainingQuantity: 1,
      reservedValue: 150,
      remainingValue: 75,
    });
  });

  it("reuses one machine after its collection and never loads more batches than machine slots", () => {
    const plan = calculateProductionPlan(productionInput({
      inventory: [{ id: "coffee", ingredientId: "coffee-bean", quality: "normal", quantity: 15, reservedQuantity: 0, availableDay: 0 }],
      machineCounts: { keg: 1, jar: 0, dehydrator: 0 },
      deadlineDays: 7,
    }));

    let activeKegs = 0;
    for (const planDay of plan.dailySchedule) {
      activeKegs -= planDay.collectTasks.filter(({ machine }) => machine === "keg")
        .reduce((batchTotal, task) => batchTotal + task.batchCount, 0);
      const loadingKegs = planDay.loadTasks.filter(({ machine }) => machine === "keg")
        .reduce((batchTotal, task) => batchTotal + task.batchCount, 0);
      expect(activeKegs + loadingKegs).toBeLessThanOrEqual(1);
      activeKegs += loadingKegs;
    }

    expect(plan.completedBatchCount).toBe(3);
    expect(plan.dailySchedule.slice(0, 3).map(({ day, loadTasks, collectTasks }) => ({
      day,
      loaded: loadTasks.length,
      collected: collectTasks.length,
    }))).toEqual([
      { day: 0, loaded: 1, collected: 0 },
      { day: 1, loaded: 1, collected: 1 },
      { day: 2, loaded: 1, collected: 1 },
    ]);
  });

  it("respects the raw-sale opportunity cost of quality and profession when scheduling", () => {
    const profitablePlan = calculateProductionPlan(productionInput({
      inventory: [{ id: "starfruit", ingredientId: "starfruit", quality: "normal", quantity: 1, reservedQuantity: 0, availableDay: 0 }],
      profession: "artisan",
    }));
    const unprofitablePlan = calculateProductionPlan(productionInput({
      inventory: [{ id: "iridium-cranberries", ingredientId: "cranberries", quality: "iridium", quantity: 5, reservedQuantity: 0, availableDay: 0 }],
      machineCounts: { keg: 0, jar: 0, dehydrator: 1 },
    }));

    expect(profitablePlan).toMatchObject({
      directSaleBaselineValue: 825,
      processedGoodsValue: 3150,
      additionalValue: 2325,
      status: "scheduled",
    });
    expect(unprofitablePlan.status).toBe("no-positive-value-batch");
    expect(unprofitablePlan.completedBatchCount).toBe(0);
    expect(unprofitablePlan.finalValue).toBe(unprofitablePlan.directSaleBaselineValue);
  });

  it("reports empty-stock, zero-machine, and incomplete-batch states separately", () => {
    const noStock = calculateProductionPlan(productionInput({ inventory: [] }));
    const noMachines = calculateProductionPlan(productionInput({ machineCounts: { keg: 0, jar: 0, dehydrator: 0 } }));
    const incompleteDehydratorBatch = calculateProductionPlan(productionInput({
      inventory: [{ id: "four-cranberries", ingredientId: "cranberries", quality: "normal", quantity: 4, reservedQuantity: 0, availableDay: 0 }],
      machineCounts: { keg: 0, jar: 0, dehydrator: 1 },
    }));

    expect(noStock.status).toBe("no-unreserved-stock");
    expect(noMachines.status).toBe("no-machine-capacity");
    expect(incompleteDehydratorBatch.status).toBe("no-complete-batch");
  });

  it("produces stable feasible schedules and quantity/value conservation", () => {
    const examplePlan = createExampleProductionPlan();
    const firstPlan = calculateProductionPlan(examplePlan);
    const secondPlan = calculateProductionPlan(examplePlan);

    expect(firstPlan).toEqual(secondPlan);
    expect(firstPlan.solutionKind).toBe("feasible");
    expect(firstPlan.finalValue).toBe(firstPlan.directSaleBaselineValue + firstPlan.additionalValue);
    expect(firstPlan.inventoryBalances.every((balance) =>
      balance.quantity === balance.reservedQuantity + balance.processedQuantity + balance.remainingQuantity,
    )).toBe(true);
    expect(firstPlan.utilization.usedMachineDays).toBeLessThanOrEqual(firstPlan.utilization.availableMachineDays);
    expect(firstPlan.dailySchedule.flatMap(({ loadTasks, collectTasks }) => [...loadTasks, ...collectTasks])
      .every((task) => task.id.length > 0)).toBe(true);
  });
});
