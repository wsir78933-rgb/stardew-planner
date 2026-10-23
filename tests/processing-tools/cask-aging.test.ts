import { describe, expect, it } from "vitest";
import { getProcessingIngredient } from "../../src/processing-tools/processing-model";
import {
  caskAgingQualities,
  caskAgingMaximumYear,
  createDefaultCaskAgingForm,
  getCaskAgingMaximumBottleCount,
  isCaskAgingFormValidationError,
  listCaskAgingIngredients,
  loadCaskAgingForm,
  parseCaskAgingForm,
  projectCaskAging,
  readCaskAgingForm,
  serializeCaskAgingForm,
} from "../../src/processing-tools/cask-aging";

function createAppleForm(overrides: Readonly<Record<string, unknown>> = {}) {
  return readCaskAgingForm({
    ...createDefaultCaskAgingForm(),
    ingredientId: "apple",
    ...overrides,
  });
}

describe("Cask aging ingredient and stored form", () => {
  it("lists only fruit ingredients that can become Wine", () => {
    const ingredients = listCaskAgingIngredients();

    expect(ingredients.length).toBeGreaterThan(0);
    expect(ingredients.every((ingredient) => ingredient.canAgeWine)).toBe(true);
    expect(ingredients.some((ingredient) => ingredient.id === "apple")).toBe(true);
    expect(ingredients.some((ingredient) => ingredient.id === "ginger")).toBe(false);
  });

  it("round-trips saved settings and loads defaults only when storage is empty", () => {
    const form = createAppleForm({
      currentQuality: "silver",
      targetQuality: "iridium",
      season: "winter",
      day: 28,
      year: 4,
      wineBottleCount: 7,
      emptyCaskCount: 3,
      profession: "artisan",
    });
    const serializedForm = serializeCaskAgingForm(form);

    expect(parseCaskAgingForm(serializedForm)).toEqual(form);
    expect(loadCaskAgingForm(serializedForm)).toEqual(form);
    expect(loadCaskAgingForm(null)).toEqual(createDefaultCaskAgingForm());
  });
});

describe("Cask aging projection", () => {
  it("computes incremental sale value, loaded bottles, materials, and a year rollover", () => {
    const form = createAppleForm({
      currentQuality: "silver",
      targetQuality: "gold",
      season: "winter",
      day: 20,
      year: 1,
      wineBottleCount: 5,
      emptyCaskCount: 2,
    });
    const projection = projectCaskAging(form);

    expect(projection.currentWineValue).toBe(375);
    expect(projection.selectedTarget.remainingDays).toBe(14);
    expect(projection.selectedTarget.collectionDate).toEqual({
      season: "spring",
      day: 6,
      year: 2,
    });
    expect(projection.selectedTarget.wineValue).toBe(450);
    expect(projection.selectedTarget.addedGoldPerBottle).toBe(75);
    expect(projection.selectedTarget.addedGoldPerCaskDay).toBeCloseTo(75 / 14);
    expect(projection.bottlesToAgeNow).toBe(2);
    expect(projection.bottlesWaitingForCasks).toBe(3);
    expect(projection.addedGoldForBottlesToAgeNow).toBe(150);
    expect(projection.additionalCasksNeeded).toBe(3);
    expect(projection.woodNeeded).toBe(60);
    expect(projection.hardwoodNeeded).toBe(3);
    expect(projection.fullCyclesIn112Days).toBe(4);
    expect(projection.bottlesIn112Days).toBe(8);
  });

  it("applies the Artisan bonus to current and aged wine values", () => {
    const projection = projectCaskAging(
      createAppleForm({
        currentQuality: "normal",
        targetQuality: "iridium",
        profession: "artisan",
      }),
    );

    expect(projection.currentWineValue).toBe(420);
    expect(projection.selectedTarget.wineValue).toBe(840);
    expect(projection.selectedTarget.addedGoldPerBottle).toBe(420);
    expect(projection.selectedTarget.remainingDays).toBe(56);
    expect(projection.fullCyclesIn112Days).toBe(2);
  });

  it.each([
    ["starfruit", 3_936],
    ["ancient-fruit", 2_886],
    ["apricot", 261],
  ] as const)("rounds quality before Artisan for %s Wine", (ingredientId, silverArtisanPrice) => {
    const projection = projectCaskAging(
      createAppleForm({
        ingredientId,
        currentQuality: "normal",
        targetQuality: "silver",
        profession: "artisan",
      }),
    );

    expect(projection.selectedTarget.wineValue).toBe(silverArtisanPrice);
  });

  it("reports a target below current quality without negative value or a false collection date", () => {
    const projection = projectCaskAging(
      createAppleForm({
        currentQuality: "gold",
        targetQuality: "silver",
        wineBottleCount: 6,
        emptyCaskCount: 2,
      }),
    );

    expect(projection.selectedTarget.status).toBe("target-below-current");
    expect(projection.selectedTarget.remainingDays).toBeNull();
    expect(projection.selectedTarget.collectionDate).toBeNull();
    expect(projection.selectedTarget.addedGoldPerBottle).toBe(0);
    expect(projection.bottlesToAgeNow).toBe(0);
    expect(projection.bottlesWaitingForCasks).toBe(0);
    expect(projection.woodNeeded).toBe(0);
  });

  it("does not request another aging round for wine already at the selected quality", () => {
    const projection = projectCaskAging(
      createAppleForm({ currentQuality: "gold", targetQuality: "gold" }),
    );

    expect(projection.selectedTarget.status).toBe("already-at-target");
    expect(projection.selectedTarget.remainingDays).toBe(0);
    expect(projection.selectedTarget.collectionDate).toEqual({
      season: "spring",
      day: 1,
      year: 1,
    });
    expect(projection.selectedTarget.addedGoldPerBottle).toBe(0);
  });
});

describe("Cask aging input validation", () => {
  it.each([
    ["unknown ingredient", { ingredientId: "missing-fruit" }, '"missing-fruit"'],
    ["non-Wine ingredient", { ingredientId: "ginger" }, 'ingredientId="ginger"'],
    ["invalid current quality", { currentQuality: "bronze" }, '"bronze"'],
    ["invalid target quality", { targetQuality: "normal" }, '"normal"'],
    ["invalid season", { season: "monsoon" }, '"monsoon"'],
    ["invalid day", { day: 29 }, "Received: 29"],
    ["zero year", { year: 0 }, "Received: 0"],
    ["negative bottle count", { wineBottleCount: -1 }, "Received: -1"],
    ["fractional empty Cask count", { emptyCaskCount: 1.5 }, "Received: 1.5"],
    ["unsupported profession", { profession: "tiller" }, '"tiller"'],
  ] as const)("rejects %s with the actual input value", (_caseName, invalidFields, receivedValue) => {
    expect(() => createAppleForm(invalidFields)).toThrow(receivedValue);
  });

  it("rejects malformed saved JSON with the source text", () => {
    expect(() => parseCaskAgingForm("{" )).toThrow('Received: "{"');
  });

  it("rejects qualities that are not part of the supported quality order", () => {
    expect(caskAgingQualities).toEqual(["normal", "silver", "gold", "iridium"]);
    expect(() => readCaskAgingForm(null)).toThrow("Received: null");
  });

  it("limits dates and bottle counts to values the calendar and totals can represent safely", () => {
    const lastSupportedDate = projectCaskAging(
      createAppleForm({
        season: "winter",
        day: 28,
        year: caskAgingMaximumYear,
        targetQuality: "iridium",
      }),
    );
    expect(Number.isSafeInteger(lastSupportedDate.selectedTarget.collectionDate?.year)).toBe(true);
    expect(() => createAppleForm({ year: caskAgingMaximumYear + 1 })).toThrow(
      `Received: ${caskAgingMaximumYear + 1}`,
    );
    const maximumAppleBottleCount = getCaskAgingMaximumBottleCount("apple");
    expect(Number.isSafeInteger(maximumAppleBottleCount * 8)).toBe(true);
    expect(() => createAppleForm({ wineBottleCount: maximumAppleBottleCount + 1 })).toThrow(
      `Received: ${maximumAppleBottleCount + 1}`,
    );
  });

  it("distinguishes saved form input failures from unexpected errors", () => {
    let invalidSavedFormError: unknown;
    try {
      parseCaskAgingForm("not-json");
    } catch (error) {
      invalidSavedFormError = error;
    }

    expect(isCaskAgingFormValidationError(invalidSavedFormError)).toBe(true);
    expect(isCaskAgingFormValidationError(new Error("Unexpected implementation failure."))).toBe(false);
  });

  it("keeps derived totals safe at the largest allowed bottle and Cask counts", () => {
    const maximumBottleCount = getCaskAgingMaximumBottleCount("apple");
    const projection = projectCaskAging(
      createAppleForm({
        wineBottleCount: maximumBottleCount,
        emptyCaskCount: maximumBottleCount,
      }),
    );

    expect(Number.isSafeInteger(projection.addedGoldForBottlesToAgeNow)).toBe(true);
    expect(Number.isSafeInteger(projection.bottlesIn112Days)).toBe(true);
  });
});
