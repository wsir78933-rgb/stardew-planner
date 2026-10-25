import { describe, expect, it } from "vitest";
import {
  calculateKegCapacity,
  calculateKegShedSpace,
  createKegCapacityPlanHandoff,
  listKegCapacityIngredients,
  type KegCapacityInput,
} from "../../src/workshop-tools/keg-capacity";

function createKegCapacityInput(overrides: Partial<KegCapacityInput> = {}): KegCapacityInput {
  return {
    ingredientId: "starfruit",
    quantity: 10,
    deadlineDays: 7,
    existingKegCount: 2,
    harvestIntervalDays: 7,
    ...overrides,
  };
}

describe("Keg capacity estimates", () => {
  it.each([
    { kegCount: 0, spacesPerShed: 67, shedCount: 0, emptySpaces: 0 },
    { kegCount: 68, spacesPerShed: 67, shedCount: 2, emptySpaces: 66 },
    { kegCount: 138, spacesPerShed: 137, shedCount: 2, emptySpaces: 136 },
  ])("calculates optimized shed layouts for $kegCount Kegs", (expected) => {
    expect(calculateKegShedSpace(expected.kegCount, expected.spacesPerShed)).toEqual({
      shedCount: expected.shedCount,
      emptySpaces: expected.emptySpaces,
    });
  });

  it("rejects a negative shed Keg count with the received value", () => {
    expect(() => calculateKegShedSpace(-1, 67)).toThrow("Received: -1");
  });

  it("uses the public recipe quote to count Kegs needed for one harvest and existing machine output", () => {
    const estimate = calculateKegCapacity(createKegCapacityInput());

    expect(estimate.ingredient.id).toBe("starfruit");
    expect(estimate.batchInputUnits).toBe(1);
    expect(estimate.processingMornings).toBe(7);
    expect(estimate.completeBatchesPerHarvest).toBe(10);
    expect(estimate.oneKegQuote.processedUnits).toBe(1);
    expect(estimate.oneKegQuote.backlogUnits).toBe(9);
    expect(estimate.existingKegsQuote.processedUnits).toBe(2);
    expect(estimate.existingKegsQuote.backlogUnits).toBe(8);
    expect(estimate.kegsNeededForOneHarvest).toBe(10);
    expect(estimate.additionalKegsForOneHarvest).toBe(8);
    expect(estimate.kegsNeededForSteadyState).toBe(10);
    expect(estimate.additionalKegsForSteadyState).toBe(8);
    expect(estimate.averageBatchesPerHarvestWithExistingKegs).toBe(2);
    expect(estimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs).toBe(8);
  });

  it("keeps complete batch counts separate from a coffee remainder", () => {
    const estimate = calculateKegCapacity(
      createKegCapacityInput({
        ingredientId: "coffee-bean",
        quantity: 12,
        existingKegCount: 1,
        harvestIntervalDays: 2,
      }),
    );

    expect(estimate.batchInputUnits).toBe(5);
    expect(estimate.completeBatchesPerHarvest).toBe(2);
    expect(estimate.unitsBelowOneBatch).toBe(2);
    expect(estimate.existingKegsQuote.processedUnits).toBe(10);
    expect(estimate.existingKegsQuote.backlogUnits).toBe(2);
    expect(estimate.averageBatchesPerHarvestWithExistingKegs).toBe(2);
    expect(estimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs).toBe(2);
  });

  it("reports zero existing Kegs as no completed batches while retaining needed Kegs", () => {
    const estimate = calculateKegCapacity(createKegCapacityInput({ existingKegCount: 0 }));

    expect(estimate.existingKegsQuote.processedUnits).toBe(0);
    expect(estimate.existingKegsQuote.backlogUnits).toBe(10);
    expect(estimate.additionalKegsForOneHarvest).toBe(10);
    expect(estimate.additionalKegsForSteadyState).toBe(10);
  });

  it("keeps one-delivery remainder raw while allowing repeated deliveries to combine into a recipe", () => {
    const estimate = calculateKegCapacity(
      createKegCapacityInput({
        ingredientId: "coffee-bean",
        quantity: 3,
        existingKegCount: 0,
        harvestIntervalDays: 1,
      }),
    );

    expect(estimate.completeBatchesPerHarvest).toBe(0);
    expect(estimate.unitsBelowOneBatch).toBe(3);
    expect(estimate.kegsNeededForOneHarvest).toBe(0);
    expect(estimate.additionalKegsForOneHarvest).toBe(0);
    expect(estimate.existingKegsQuote.backlogUnits).toBe(3);
    expect(estimate.kegsNeededForSteadyState).toBe(1);
    expect(estimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs).toBe(3);
  });

  it("rounds steady-state demand up from all incoming units and stops backlog growth at sufficient capacity", () => {
    const shortCapacityEstimate = calculateKegCapacity(
      createKegCapacityInput({
        ingredientId: "coffee-bean",
        quantity: 24,
        existingKegCount: 4,
        harvestIntervalDays: 1,
      }),
    );
    const sufficientCapacityEstimate = calculateKegCapacity(
      createKegCapacityInput({
        ingredientId: "coffee-bean",
        quantity: 24,
        existingKegCount: 5,
        harvestIntervalDays: 1,
      }),
    );

    expect(shortCapacityEstimate.kegsNeededForSteadyState).toBe(5);
    expect(shortCapacityEstimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs).toBe(4);
    expect(sufficientCapacityEstimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs).toBe(0);
  });

  it("rejects long-run throughput calculations beyond safe numeric precision", () => {
    expect(() => calculateKegCapacity(createKegCapacityInput({
      existingKegCount: Number.MAX_SAFE_INTEGER,
      harvestIntervalDays: Number.MAX_SAFE_INTEGER,
    }))).toThrow("averageBatchesPerHarvestWithExistingKegs");
  });

  it("creates a validated handoff with the current Keg count and steady recurring interval", () => {
    const handoff = createKegCapacityPlanHandoff(createKegCapacityInput());

    expect(handoff).toEqual({
      source: "workshop-keg-count",
      scenario: "current-stock",
      ingredientId: "starfruit",
      quantity: 10,
      availableDay: 0,
      deadlineDays: 7,
      machineCounts: { keg: 2, jar: 0, dehydrator: 0 },
      quality: "normal",
      profession: "none",
      mode: "capacity",
    });
  });

  it("lists only ingredients with an applicable public Keg route", () => {
    const ingredientIds = listKegCapacityIngredients().map((ingredient) => ingredient.id);

    expect(ingredientIds).toContain("starfruit");
    expect(ingredientIds).toContain("tea-leaves");
  });

  it.each([
    { field: "quantity", value: -1 },
    { field: "existingKegCount", value: 1.5 },
    { field: "harvestIntervalDays", value: 0 },
    { field: "deadlineDays", value: 9 },
    { field: "ingredientId", value: "missing-ingredient" },
  ])("rejects invalid $field with its received value", ({ field, value }) => {
    const input = { ...createKegCapacityInput(), [field]: value };

    expect(() => calculateKegCapacity(input as unknown as KegCapacityInput)).toThrow(
      new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  });
});
