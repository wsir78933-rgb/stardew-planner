import { describe, expect, it } from "vitest";
import {
  calculateProcessingRoute,
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
  listProcessingIngredients,
} from "../../src/processing-tools/processing-model";
import {
  readKegIngredientRanking,
  readKegIngredientRankingSelection,
  readKegInventoryEstimate,
  type KegIngredientRankingSort,
} from "../../src/processing-tools/keg-ingredient-ranking";

const defaultRankingSettings = { quality: "normal", profession: "none" } as const;

describe("Keg ingredient ranking", () => {
  it("lists every Keg-supported ingredient and filters recipes through the public quote API", () => {
    const expectedIngredientIds = listProcessingIngredients()
      .filter((ingredient) =>
        calculateProcessingRoute({
          ingredientId: ingredient.id,
          quantity: 1,
          quality: "normal",
          profession: "none",
          mode: "unlimited",
          deadlineDays: 28,
          machineCounts: { keg: 1, jar: 0, dehydrator: 0 },
          machine: "keg",
        }).applicable,
      )
      .map((ingredient) => ingredient.id)
      .sort();

    const actualRankingRows = readKegIngredientRanking(
      defaultRankingSettings,
      "per-machine-cycle",
    );

    expect(actualRankingRows.map((row) => row.ingredient.id).sort()).toEqual(
      expectedIngredientIds,
    );
    expect(actualRankingRows.length).toBeGreaterThan(5);
    expect(actualRankingRows.every((row) => row.quote.machine === "keg")).toBe(true);
    expect(actualRankingRows.every((row) => row.quote.applicable)).toBe(true);
  });

  it.each(["per-machine-cycle", "per-ingredient", "per-processing-minute"] as const)(
    "sorts Keg rows by the selected public quote value (%s)",
    (sortBy) => {
      assertRankingIsSorted(sortBy);
    },
  );

  it("ranks Hops above Ancient Fruit by added value per processing minute while retaining per-batch order", () => {
    const perCycleRows = readKegIngredientRanking(defaultRankingSettings, "per-machine-cycle");
    const perMinuteRows = readKegIngredientRanking(defaultRankingSettings, "per-processing-minute");
    const ancientFruit = perCycleRows.find((row) => row.ingredient.id === "ancient-fruit");
    const hops = perCycleRows.find((row) => row.ingredient.id === "hops");
    if (ancientFruit === undefined || hops === undefined) {
      throw new Error("Expected Ancient Fruit and Hops in the Keg ranking.");
    }

    expect(ancientFruit.quote.valueAdded).toBe(1100);
    expect(ancientFruit.quote.processingMinutes).toBe(10000);
    expect(hops.quote.valueAdded).toBe(275);
    expect(hops.quote.processingMinutes).toBe(2250);
    expect(perCycleRows.indexOf(ancientFruit)).toBeLessThan(perCycleRows.indexOf(hops));
    expect(perMinuteRows.findIndex((row) => row.ingredient.id === "hops")).toBeLessThan(
      perMinuteRows.findIndex((row) => row.ingredient.id === "ancient-fruit"),
    );
  });

  it("defaults only an empty selection and leaves an unknown saved ingredient unselected", () => {
    const rankingRows = readKegIngredientRanking(
      defaultRankingSettings,
      "per-machine-cycle",
    );
    const savedIngredientId = rankingRows[2]?.ingredient.id;
    if (savedIngredientId === undefined) {
      throw new Error("Expected a third Keg ranking row for the selection test.");
    }

    expect(readKegIngredientRankingSelection(rankingRows, "")).toBe(rankingRows[0]);
    expect(readKegIngredientRankingSelection(rankingRows, savedIngredientId)).toBe(
      rankingRows[2],
    );
    expect(
      readKegIngredientRankingSelection(rankingRows, "stale-saved-ingredient"),
    ).toBeNull();
  });

  it("keeps the pre-condition settings shape equivalent to explicit defaults", () => {
    const existingSettings = readKegIngredientRanking(
      { quality: "normal", profession: "none" },
      "per-machine-cycle",
    );
    const explicitDefaults = readKegIngredientRanking(
      {
        quality: "normal",
        profession: "none",
        hasBearsKnowledge: false,
        coconutSource: "foraged",
      },
      "per-machine-cycle",
    );

    expect(existingSettings).toEqual(explicitDefaults);
  });

  it("uses the normal grade for ingredients without quality tiers", () => {
    const rankingRows = readKegIngredientRanking(
      { quality: "gold", profession: "artisan" },
      "per-machine-cycle",
    );
    const honeyRow = rankingRows.find((row) => row.ingredient.id === "honey-tulip");

    expect(honeyRow).toBeDefined();
    expect(honeyRow?.ingredient.hasQualityTiers).toBe(false);
    expect(honeyRow?.quote.applicable).toBe(true);
  });

  it("passes Bear's Knowledge through the raw baseline and keeps Coffee outside Tiller eligibility", () => {
    expect(isBearsKnowledgeEligible("blackberry")).toBe(true);
    expect(isBearsKnowledgeEligible("coffee-bean")).toBe(false);

    const blackberryWithoutBear = readKegIngredientRanking(
      { quality: "normal", profession: "none", hasBearsKnowledge: false },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "blackberry");
    const blackberryWithBear = readKegIngredientRanking(
      { quality: "normal", profession: "none", hasBearsKnowledge: true },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "blackberry");
    const coffeeWithoutTiller = readKegIngredientRanking(
      { quality: "normal", profession: "none" },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "coffee-bean");
    const coffeeWithTiller = readKegIngredientRanking(
      { quality: "normal", profession: "tiller" },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "coffee-bean");

    if (
      blackberryWithoutBear === undefined ||
      blackberryWithBear === undefined ||
      coffeeWithoutTiller === undefined ||
      coffeeWithTiller === undefined
    ) {
      throw new Error("Expected Blackberry and Coffee Bean in the Keg ranking.");
    }

    expect(blackberryWithBear.quote.rawUnitPrice).toBeGreaterThan(
      blackberryWithoutBear.quote.rawUnitPrice,
    );
    expect(blackberryWithBear.quote.valueAdded).not.toBe(blackberryWithoutBear.quote.valueAdded);
    expect(coffeeWithTiller.quote.rawUnitPrice).toBe(coffeeWithoutTiller.quote.rawUnitPrice);
  });

  it("uses Coconut's selected source to determine its Tiller-adjusted raw baseline", () => {
    const foragedCoconut = readKegIngredientRanking(
      {
        quality: "normal",
        profession: "tiller",
        coconutSource: "foraged",
      },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "coconut");
    const purchasedCoconut = readKegIngredientRanking(
      {
        quality: "normal",
        profession: "tiller",
        coconutSource: "purchased-or-gifted",
      },
      "per-machine-cycle",
    ).find((row) => row.ingredient.id === "coconut");

    if (foragedCoconut === undefined || purchasedCoconut === undefined) {
      throw new Error("Expected Coconut in both source-specific Keg rankings.");
    }

    expect(foragedCoconut.quote.rawUnitPrice).toBe(100);
    expect(purchasedCoconut.quote.rawUnitPrice).toBe(110);
    expect(getProcessingIngredientQualities("coconut")).toEqual([
      "normal",
      "silver",
      "gold",
      "iridium",
    ]);
  });

  it.each(["normal", "silver", "gold", "iridium"] as const)(
    "includes only ingredients supporting the selected quality (%s)",
    (quality) => {
      const rankingIngredientIds = readKegIngredientRanking(
        { quality, profession: "none" },
        "per-machine-cycle",
      ).map((row) => row.ingredient.id);
      const bushPickingsAreIncluded = quality === "normal" || quality === "iridium";

      expect(rankingIngredientIds.includes("blackberry")).toBe(bushPickingsAreIncluded);
      expect(rankingIngredientIds.includes("salmonberry")).toBe(bushPickingsAreIncluded);
      expect(rankingIngredientIds).toContain("blackberry-cave");
      expect(rankingIngredientIds).toContain("salmonberry-cave");
      expect(rankingIngredientIds).toContain("honey-tulip");
      expect(getProcessingIngredientQualities("blackberry-cave")).toContain(quality);
    },
  );

  it("reports unsupported Keg sort settings with the actual value", () => {
    expect(() =>
      readKegIngredientRanking(defaultRankingSettings, "per-day" as KegIngredientRankingSort),
    ).toThrow('"per-day"');
    expect(() =>
      readKegIngredientRanking(
        { quality: "platinum", profession: "none" } as never,
        "per-machine-cycle",
      ),
    ).toThrow('"platinum"');
    expect(() =>
      readKegIngredientRanking(
        { quality: "normal", profession: "none", hasBearsKnowledge: "yes" } as never,
        "per-machine-cycle",
      ),
    ).toThrow('"yes"');
    expect(() =>
      readKegIngredientRanking(
        { quality: "normal", profession: "none", coconutSource: "traded" } as never,
        "per-machine-cycle",
      ),
    ).toThrow('"traded"');
  });
});

describe("Keg inventory estimate", () => {
  it("delegates finite stock, Keg count, quality, profession, and deadline to the core quote", () => {
    const estimate = readKegInventoryEstimate({
      ingredientId: "coffee-bean",
      quantity: 23,
      quality: "gold",
      profession: "artisan",
      kegCount: 2,
      deadlineDays: 14,
      hasBearsKnowledge: false,
      coconutSource: "foraged",
    });
    const expectedQuote = calculateProcessingRoute({
      ingredientId: "coffee-bean",
      quantity: 23,
      quality: "gold",
      profession: "artisan",
      mode: "capacity",
      deadlineDays: 14,
      machineCounts: { keg: 2, jar: 0, dehydrator: 0 },
      machine: "keg",
      hasBearsKnowledge: false,
      coconutSource: "foraged",
    });

    expect(estimate).toEqual(expectedQuote);
    expect(estimate.processedUnits + estimate.backlogUnits).toBe(23);
    expect(estimate.processedBatches).toBe(estimate.processedUnits / 5);
  });

  it("passes Bear's Knowledge and Coconut source into the finite-stock raw baseline", () => {
    const blackberryWithoutBear = readKegInventoryEstimate({
      ingredientId: "blackberry",
      quantity: 5,
      quality: "normal",
      profession: "none",
      kegCount: 1,
      deadlineDays: 7,
      hasBearsKnowledge: false,
    });
    const blackberryWithBear = readKegInventoryEstimate({
      ingredientId: "blackberry",
      quantity: 5,
      quality: "normal",
      profession: "none",
      kegCount: 1,
      deadlineDays: 7,
      hasBearsKnowledge: true,
    });
    const foragedCoconut = readKegInventoryEstimate({
      ingredientId: "coconut",
      quantity: 1,
      quality: "silver",
      profession: "tiller",
      kegCount: 1,
      deadlineDays: 7,
      coconutSource: "foraged",
    });
    const purchasedCoconut = readKegInventoryEstimate({
      ingredientId: "coconut",
      quantity: 1,
      quality: "silver",
      profession: "tiller",
      kegCount: 1,
      deadlineDays: 7,
      coconutSource: "purchased-or-gifted",
    });

    expect(blackberryWithBear.rawUnitPrice).toBeGreaterThan(blackberryWithoutBear.rawUnitPrice);
    expect(foragedCoconut.rawUnitPrice).toBe(125);
    expect(purchasedCoconut.rawUnitPrice).toBe(137);
  });

  it("returns the core zero-stock and zero-Keg feedback values without inventing output", () => {
    const zeroStockEstimate = readKegInventoryEstimate({
      ingredientId: "parsnip",
      quantity: 0,
      quality: "normal",
      profession: "none",
      kegCount: 0,
      deadlineDays: 7,
    });
    const noKegEstimate = readKegInventoryEstimate({
      ingredientId: "parsnip",
      quantity: 9,
      quality: "normal",
      profession: "none",
      kegCount: 0,
      deadlineDays: 7,
    });

    expect(zeroStockEstimate.processedUnits).toBe(0);
    expect(zeroStockEstimate.backlogUnits).toBe(0);
    expect(noKegEstimate.processedUnits).toBe(0);
    expect(noKegEstimate.backlogUnits).toBe(9);
  });

  it("keeps unsupported ingredients raw and reports the unavailable Keg recipe", () => {
    const estimate = readKegInventoryEstimate({
      ingredientId: "chanterelle",
      quantity: 12,
      quality: "normal",
      profession: "none",
      kegCount: 3,
      deadlineDays: 28,
    });

    expect(estimate.applicable).toBe(false);
    expect(estimate.unavailableReason).toBe("recipe-not-supported");
    expect(estimate.batchOutputPrice).toBeNull();
    expect(estimate.processedUnits).toBe(0);
    expect(estimate.backlogUnits).toBe(12);
  });

  it("rejects unsupported bush-picked quality and keeps no-tier ingredients at Normal", () => {
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "blackberry",
        quantity: 10,
        quality: "silver",
        profession: "none",
        kegCount: 1,
        deadlineDays: 7,
      }),
    ).toThrow('ingredientId="blackberry", quality="silver"');

    const honeyEstimate = readKegInventoryEstimate({
      ingredientId: "honey-tulip",
      quantity: 5,
      quality: "silver",
      profession: "none",
      kegCount: 1,
      deadlineDays: 7,
    });
    const normalHoneyEstimate = calculateProcessingRoute({
      ingredientId: "honey-tulip",
      quantity: 5,
      quality: "normal",
      profession: "none",
      mode: "capacity",
      deadlineDays: 7,
      machineCounts: { keg: 1, jar: 0, dehydrator: 0 },
      machine: "keg",
    });

    expect(honeyEstimate).toEqual(normalHoneyEstimate);
  });

  it("includes the invalid value in boundary failures", () => {
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "parsnip",
        quantity: -4,
        quality: "normal",
        profession: "none",
        kegCount: 1,
        deadlineDays: 7,
      }),
    ).toThrow("Received: -4.");
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "parsnip",
        quantity: 4,
        quality: "normal",
        profession: "none",
        kegCount: -2,
        deadlineDays: 7,
      }),
    ).toThrow("Received: -2.");
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "parsnip",
        quantity: 4,
        quality: "normal",
        profession: "none",
        kegCount: 1,
        deadlineDays: 8 as 7,
      }),
    ).toThrow("Received: 8.");
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "parsnip",
        quantity: 4,
        quality: "normal",
        profession: "none",
        kegCount: 1,
        deadlineDays: 7,
        hasBearsKnowledge: "yes" as never,
      }),
    ).toThrow('"yes"');
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "parsnip",
        quantity: 4,
        quality: "normal",
        profession: "none",
        kegCount: 1,
        deadlineDays: 7,
        coconutSource: "traded" as never,
      }),
    ).toThrow('"traded"');
  });

  it("rejects unknown ingredient identifiers with the actual value", () => {
    expect(() =>
      readKegInventoryEstimate({
        ingredientId: "unknown-keg-item",
        quantity: 1,
        quality: "normal",
        profession: "none",
        kegCount: 1,
        deadlineDays: 7,
      }),
    ).toThrow("unknown-keg-item");
  });
});

function assertRankingIsSorted(sortBy: KegIngredientRankingSort): void {
  const rankingRows = readKegIngredientRanking(defaultRankingSettings, sortBy);
  const rankingValues = rankingRows.map((row) =>
    sortBy === "per-machine-cycle"
      ? row.quote.valueAdded
      : sortBy === "per-ingredient"
        ? row.quote.valueAddedPerProcessedUnit
        : row.quote.valueAdded / row.quote.processingMinutes,
  );

  for (let rowIndex = 1; rowIndex < rankingRows.length; rowIndex += 1) {
    const previousRow = rankingRows[rowIndex - 1];
    const currentRow = rankingRows[rowIndex];
    if (previousRow === undefined || currentRow === undefined) {
      throw new Error(`Expected ranking rows at positions ${rowIndex - 1} and ${rowIndex}.`);
    }
    const previousRankingValue = rankingValues[rowIndex - 1] ?? Number.NEGATIVE_INFINITY;
    const currentRankingValue = rankingValues[rowIndex] ?? Number.NEGATIVE_INFINITY;
    expect(previousRankingValue).toBeGreaterThanOrEqual(
      currentRankingValue,
    );

    if (previousRankingValue === currentRankingValue) {
      const previousKey = `${previousRow.ingredient.englishName}\u0000${previousRow.ingredient.id}`;
      const currentKey = `${currentRow.ingredient.englishName}\u0000${currentRow.ingredient.id}`;
      expect(previousKey <= currentKey).toBe(true);
    }
  }
}
