import { describe, expect, it } from "vitest";
import { createExampleProductionPlan, calculateProductionPlan } from "../../src/production-tools/production-model";
import {
  appendProductionInventory,
  confirmProductionTaskReview,
  createCropProfitProductionReview,
  createProductionPlanShareFragment,
  createProductionPlanState,
  isProductionPlanStateValidationError,
  parseProductionPlanShareFragment,
  parseProductionPlanState,
  productionPlanShareFragmentMaxLength,
  readProductionPlanState,
  replaceProductionPlanInput,
  serializeProductionPlanState,
  setProductionPlanCurrentDay,
  setProductionTaskCompleted,
  undoProductionPlanChange,
  updateProductionPlanInput,
} from "../../src/production-tools/production-plan-state";
import {
  replaceProductionPlan,
  type ProductionPlanIncoming,
} from "../../src/tools-pages/production-plan-record";
import { createDefaultCropProfitForm } from "../../src/tools-pages/crop-profit-form";

const validPlanInput = createExampleProductionPlan();

function captureError(action: () => unknown): Error {
  try {
    action();
  } catch (error) {
    if (error instanceof Error) return error;
    throw new Error(`Expected an Error. Received: ${String(error)}.`);
  }
  throw new Error("Expected the action to throw.");
}

describe("production plan state", () => {
  it("creates a versioned state and round-trips it through storage JSON", () => {
    const state = createProductionPlanState(validPlanInput);

    expect(state).toEqual({
      schemaVersion: 1,
      current: {
        input: validPlanInput,
        currentDay: 0,
        completedTaskIds: [],
        taskChecklistNeedsReview: false,
      },
      undoSnapshot: null,
    });
    expect(parseProductionPlanState(serializeProductionPlanState(state))).toEqual(state);
  });

  it("preserves progress for an explicit settings review, then restores the previous plan with one undo", () => {
    const firstTask = calculateProductionPlan(validPlanInput).dailySchedule[0]?.loadTasks[0];
    expect(firstTask).toBeDefined();
    if (firstTask === undefined) throw new Error("Example plan must include a load task.");

    const stateWithProgress = setProductionPlanCurrentDay(
      setProductionTaskCompleted(createProductionPlanState(validPlanInput), firstTask.id, true),
      3,
    );
    const changedInput = { ...validPlanInput, deadlineDays: 28 as const };
    const changedState = updateProductionPlanInput(stateWithProgress, changedInput);

    expect(changedState.current).toMatchObject({
      input: changedInput,
      currentDay: 3,
      completedTaskIds: [firstTask.id],
      taskChecklistNeedsReview: true,
    });
    expect(isProductionPlanStateValidationError(captureError(() =>
      setProductionTaskCompleted(changedState, firstTask.id, false),
    ))).toBe(true);

    const confirmedState = confirmProductionTaskReview(changedState, [firstTask.id]);
    expect(confirmedState.current.taskChecklistNeedsReview).toBe(false);
    expect(undoProductionPlanChange(confirmedState)).toEqual({
      schemaVersion: 1,
      current: stateWithProgress.current,
      undoSnapshot: null,
    });
    expect(isProductionPlanStateValidationError(captureError(() => undoProductionPlanChange(stateWithProgress)))).toBe(true);
  });

  it("starts a replacement plan at day zero and one undo restores the checked prior plan", () => {
    const firstTask = calculateProductionPlan(validPlanInput).dailySchedule[0]?.loadTasks[0];
    expect(firstTask).toBeDefined();
    if (firstTask === undefined) throw new Error("Example plan must include a load task.");

    const checkedPlan = setProductionPlanCurrentDay(
      setProductionTaskCompleted(createProductionPlanState(validPlanInput), firstTask.id, true),
      3,
    );
    const replacementInput = {
      ...validPlanInput,
      deadlineDays: 14 as const,
    };
    const replacedPlan = replaceProductionPlanInput(checkedPlan, replacementInput);

    expect(replacedPlan.current).toEqual({
      input: replacementInput,
      currentDay: 0,
      completedTaskIds: [],
      taskChecklistNeedsReview: false,
    });
    expect(replacedPlan.undoSnapshot).toEqual(checkedPlan.current);
    expect(undoProductionPlanChange(replacedPlan)).toEqual(checkedPlan);
  });

  it("appends confirmed inventory without changing settings and rejects duplicate inventory IDs", () => {
    const initialState = createProductionPlanState(validPlanInput);
    const additionalLine = {
      id: "blackberries-confirmed",
      ingredientId: "blackberry",
      quality: "normal" as const,
      quantity: 4,
      reservedQuantity: 0,
      availableDay: 1,
      hasBearsKnowledge: false,
    };
    const appendedState = appendProductionInventory(initialState, [additionalLine]);

    expect(appendedState.current.input.inventory).toEqual([...validPlanInput.inventory, additionalLine]);
    expect(appendedState.current.input.machineCounts).toEqual(validPlanInput.machineCounts);
    expect(appendedState.current.input.profession).toBe(validPlanInput.profession);
    expect(appendedState.current.input.deadlineDays).toBe(validPlanInput.deadlineDays);
    expect(appendedState.current.taskChecklistNeedsReview).toBe(true);
    expect(undoProductionPlanChange(appendedState)).toEqual(initialState);

    const duplicateLine = { ...validPlanInput.inventory[0], quantity: 3 };
    const duplicateError = captureError(() => appendProductionInventory(initialState, [duplicateLine]));
    expect(isProductionPlanStateValidationError(duplicateError)).toBe(true);
    expect(duplicateError.message).toContain(duplicateLine.id);
  });

  it("requires users to confirm only currently scheduled task IDs", () => {
    const reviewState = updateProductionPlanInput(
      createProductionPlanState(validPlanInput),
      { ...validPlanInput, machineCounts: { keg: 0, jar: 1, dehydrator: 1 } },
    );

    const error = captureError(() => confirmProductionTaskReview(reviewState, ["load:99:keg:unknown:normal"]));
    expect(isProductionPlanStateValidationError(error)).toBe(true);
    expect(error.message).toContain("load:99:keg:unknown:normal");

    const noDuplicatesError = captureError(() => confirmProductionTaskReview(reviewState, ["same", "same"]));
    expect(isProductionPlanStateValidationError(noDuplicatesError)).toBe(true);
    expect(noDuplicatesError.message).toContain("same");
  });

  it("creates and parses editable share fragments using the public plan validator", () => {
    const fragment = createProductionPlanShareFragment(validPlanInput);

    expect(fragment.startsWith("#production-plan=")).toBe(true);
    expect(parseProductionPlanShareFragment(fragment)).toEqual(validPlanInput);
    expect(isProductionPlanStateValidationError(captureError(() => parseProductionPlanShareFragment("#other=x")))).toBe(true);

    const badEncodingError = captureError(() => parseProductionPlanShareFragment("#production-plan=%E0%A4%A"));
    expect(isProductionPlanStateValidationError(badEncodingError)).toBe(true);
    expect(badEncodingError.message).toContain("%E0%A4%A");

    const malformedJsonError = captureError(() => parseProductionPlanShareFragment("#production-plan=%7B"));
    expect(isProductionPlanStateValidationError(malformedJsonError)).toBe(true);
    expect(malformedJsonError.message).toContain("#production-plan=%7B");

    const oversizeFragment = `#production-plan=${"x".repeat(productionPlanShareFragmentMaxLength)}`;
    const oversizeError = captureError(() => parseProductionPlanShareFragment(oversizeFragment));
    expect(isProductionPlanStateValidationError(oversizeError)).toBe(true);
    expect(oversizeError.message).toContain(String(oversizeFragment.length));
  });

  it("rejects unsupported state versions and invalid values with the received value", () => {
    const unsupportedVersionError = captureError(() => readProductionPlanState({
      schemaVersion: 2,
      current: {},
      undoSnapshot: null,
    }));
    expect(isProductionPlanStateValidationError(unsupportedVersionError)).toBe(true);
    expect(unsupportedVersionError.message).toContain("Received: 2");

    const invalidDayError = captureError(() => setProductionPlanCurrentDay(
      createProductionPlanState(validPlanInput),
      -1,
    ));
    expect(isProductionPlanStateValidationError(invalidDayError)).toBe(true);
    expect(invalidDayError.message).toContain("Received: -1");

    const invalidJsonError = captureError(() => parseProductionPlanState("{broken"));
    expect(isProductionPlanStateValidationError(invalidJsonError)).toBe(true);
    expect(invalidJsonError.message).toContain("{broken");
  });

  it("keeps crop-profit estimates review-only instead of treating expected yield as day-zero stock", () => {
    const incoming: ProductionPlanIncoming = {
      form: createDefaultCropProfitForm(),
      line: {
        cropId: "blueberry",
        routeId: "jar",
        expectedUnits: 13.5,
        harvestCount: 3,
        tileCount: 9,
        firstHarvest: { season: "summer", day: 14 },
        lastHarvest: { season: "summer", day: 26 },
        seedCost: 900,
        fertilizerCost: 180,
      },
    };
    const legacyRecord = replaceProductionPlan(null, incoming);
    const review = createCropProfitProductionReview(legacyRecord);

    expect(review.suggestedSettings.profession).toBe("none");
    expect(review.suggestedSettings.machineCounts).toEqual({ keg: 0, jar: 0, dehydrator: 0 });
    expect(review.suggestedSettings.deadlineDays).toBeNull();
    expect(review.estimatedHarvests[0]?.expectedUnits).toBe(13.5);
    expect(review.reviewReasons.join(" ")).toContain("not measured stock");
    expect("inventory" in review).toBe(false);
  });
});
