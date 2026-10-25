import { describe, expect, it } from "vitest";
import {
  calculateKegMaterials,
  createKegMaterialsHandoff,
  createKegMaterialsHref,
  readKegMaterialsHandoffFromSearch,
  type KegMaterialsInput,
} from "../../src/workshop-tools/keg-materials";

function createKegMaterialsInput(overrides: Partial<KegMaterialsInput> = {}): KegMaterialsInput {
  return {
    targetKegCount: 4,
    existingKegCount: 1,
    inventory: { wood: 75, copperBar: 1, ironBar: 2, oakResin: 2 },
    matureOakTapperCount: 2,
    tapperType: "regular",
    waitingDays: 14,
    ...overrides,
  };
}

describe("Keg materials estimates", () => {
  it("conserves materials while showing the current build limit and bottleneck", () => {
    const estimate = calculateKegMaterials(createKegMaterialsInput());

    expect(estimate.kegsToBuild).toBe(3);
    expect(estimate.buildableNowCount).toBe(1);
    expect(estimate.remainingKegsAfterBuildingNow).toBe(2);
    expect(estimate.bottleneckMaterial).toBe("copperBar");
    expect(estimate.requirements.wood).toEqual({
      unitsPerKeg: 30,
      targetNeed: 90,
      currentInventory: 75,
      shortageNow: 15,
      remainingAfterBuildingNow: 45,
      kegsBuildableFromInventory: 2,
    });
    expect(estimate.requirements.copperBar.remainingAfterBuildingNow).toBe(0);
    expect(estimate.requirements.ironBar.remainingAfterBuildingNow).toBe(1);
    expect(estimate.requirements.oakResin.remainingAfterBuildingNow).toBe(1);
  });

  it("counts a resin cycle that finishes exactly on the deadline", () => {
    const estimate = calculateKegMaterials(
      createKegMaterialsInput({
        targetKegCount: 4,
        existingKegCount: 0,
        inventory: { wood: 0, copperBar: 0, ironBar: 0, oakResin: 0 },
        matureOakTapperCount: 2,
        tapperType: "regular",
        waitingDays: 7,
      }),
    );

    expect(estimate.resin.completedCycles).toBe(1);
    expect(estimate.resin.producedByDeadline).toBe(2);
    expect(estimate.resin.shortageNow).toBe(4);
    expect(estimate.resin.shortageAtDeadline).toBe(2);
    expect(estimate.resin.daysUntilEnough).toBe(14);
    expect(estimate.resin.matureOakTappersNeededByDeadline).toBe(4);
  });

  it("uses complete heavy-tapper cycles and reports days until the remaining resin is ready", () => {
    const estimate = calculateKegMaterials(
      createKegMaterialsInput({
        targetKegCount: 3,
        existingKegCount: 0,
        inventory: { wood: 90, copperBar: 3, ironBar: 3, oakResin: 0 },
        matureOakTapperCount: 1,
        tapperType: "heavy",
        waitingDays: 8,
      }),
    );

    expect(estimate.resin.completedCycles).toBe(2);
    expect(estimate.resin.producedByDeadline).toBe(2);
    expect(estimate.resin.shortageAtDeadline).toBe(1);
    expect(estimate.resin.daysUntilEnough).toBe(9);
    expect(estimate.resin.matureOakTappersNeededByDeadline).toBe(2);
  });

  it("returns unavailable resin timing when no mature tapped Oak can produce it", () => {
    const estimate = calculateKegMaterials(
      createKegMaterialsInput({
        targetKegCount: 2,
        existingKegCount: 0,
        inventory: { wood: 60, copperBar: 2, ironBar: 2, oakResin: 0 },
        matureOakTapperCount: 0,
        tapperType: "regular",
        waitingDays: 28,
      }),
    );

    expect(estimate.resin.producedByDeadline).toBe(0);
    expect(estimate.resin.shortageAtDeadline).toBe(2);
    expect(estimate.resin.daysUntilEnough).toBeNull();
    expect(estimate.resin.matureOakTappersNeededByDeadline).toBe(1);
  });

  it("requires no materials when existing Kegs already meet the target", () => {
    const estimate = calculateKegMaterials(
      createKegMaterialsInput({ targetKegCount: 2, existingKegCount: 4 }),
    );

    expect(estimate.kegsToBuild).toBe(0);
    expect(estimate.buildableNowCount).toBe(0);
    expect(estimate.bottleneckMaterial).toBeNull();
    expect(estimate.resin.shortageNow).toBe(0);
    expect(estimate.resin.daysUntilEnough).toBe(0);
  });

  it("does not show a material bottleneck when current inventory can build every missing Keg", () => {
    const estimate = calculateKegMaterials(
      createKegMaterialsInput({
        targetKegCount: 3,
        existingKegCount: 0,
        inventory: { wood: 90, copperBar: 3, ironBar: 3, oakResin: 3 },
      }),
    );

    expect(estimate.buildableNowCount).toBe(3);
    expect(estimate.remainingKegsAfterBuildingNow).toBe(0);
    expect(estimate.bottleneckMaterial).toBeNull();
  });

  it("creates and reads localized materials handoffs without losing the chosen target", () => {
    const handoff = createKegMaterialsHandoff(12, 3, "steady-state");
    const href = createKegMaterialsHref("zh-CN", handoff);

    expect(href).toBe(
      "/zh/tools/materials-and-resin?kegTarget=12&kegExisting=3&kegSource=steady-state",
    );
    expect(readKegMaterialsHandoffFromSearch(href.split("?")[1] ?? "")).toEqual(handoff);
  });

  it.each([
    {
      search: "?kegTarget=2&kegExisting=0",
      receivedValue: "?kegTarget=2&kegExisting=0",
    },
    {
      search: "?kegTarget=2&kegExisting=0&kegSource=unsupported",
      receivedValue: "unsupported",
    },
    {
      search: "?kegTarget=2&kegTarget=3&kegExisting=0&kegSource=single-harvest",
      receivedValue: '["2","3"]',
    },
    {
      search: "?kegTarget=999999999999999999&kegExisting=0&kegSource=single-harvest",
      receivedValue: "999999999999999999",
    },
  ])("rejects invalid URL handoff value $receivedValue", ({ search, receivedValue }) => {
    expect(() => readKegMaterialsHandoffFromSearch(search)).toThrow(receivedValue);
  });

  it.each([
    { field: "targetKegCount", value: -1 },
    { field: "existingKegCount", value: 1.5 },
    { field: "matureOakTapperCount", value: -2 },
    { field: "waitingDays", value: -1 },
    { field: "tapperType", value: "magic" },
  ])("rejects invalid $field with the actual value", ({ field, value }) => {
    const input = { ...createKegMaterialsInput(), [field]: value };

    expect(() => calculateKegMaterials(input as unknown as KegMaterialsInput)).toThrow(
      String(value),
    );
  });
});
