import { describe, expect, it } from "vitest";
import {
  calculateProcessingRoute,
  calculateProcessingRoutes,
  getProcessingIngredient,
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
  listProcessingIngredients,
  type CalculateProcessingRoutesInput,
} from "@/src/processing-tools/processing-model";

function processingInput(
  overrides: Partial<CalculateProcessingRoutesInput> = {},
): CalculateProcessingRoutesInput {
  return {
    ingredientId: "cranberries",
    quantity: 1,
    quality: "normal",
    profession: "none",
    mode: "unlimited",
    deadlineDays: 28,
    machineCounts: { keg: 0, jar: 0, dehydrator: 0 },
    ...overrides,
  };
}

describe("processing ingredient catalog", () => {
  it("lists supported crop, tree fruit, forage, mushroom, and special Keg ingredients in name order", () => {
    const ingredients = listProcessingIngredients();
    const ingredientNames = ingredients.map(({ englishName }) => englishName);

    expect(ingredientNames).toEqual([...ingredientNames].sort((leftName, rightName) => leftName.localeCompare(rightName)));
    expect(new Set(ingredients.map(({ id }) => id)).size).toBe(ingredients.length);
    expect(ingredients.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "ancient-fruit",
        "apple",
        "blackberry-cave",
        "coffee-bean",
        "cranberries",
        "fiddlehead-fern",
        "grape-foraged",
        "honey-fairy-rose",
        "leek",
        "magma-cap",
        "qi-fruit",
        "red-mushroom",
        "rice",
        "taro-root",
        "tea-leaves",
        "unmilled-rice",
      ]),
    );
    expect(getProcessingIngredient("apple")).toMatchObject({
      basePrice: 100,
      canAgeWine: true,
      hasQualityTiers: true,
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredient("honey-fairy-rose")).toMatchObject({
      basePrice: 680,
      canAgeWine: false,
      hasQualityTiers: false,
      rawArtisanBonusEligible: true,
    });
    expect(() => getProcessingIngredient("not-a-processing-item")).toThrow("not-a-processing-item");
  });

  it("records Tiller eligibility by the verified fruit source", () => {
    expect(getProcessingIngredient("grape")).toMatchObject({
      englishName: "Grape (Grown)",
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredient("grape-foraged")).toMatchObject({
      englishName: "Grape (Foraged / Summer Seeds)",
      tillerBonusEligible: false,
    });
    expect(getProcessingIngredient("blackberry")).toMatchObject({
      englishName: "Blackberry (Bush Picked)",
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredient("blackberry-ground")).toMatchObject({
      englishName: "Blackberry (Ground Foraged)",
      tillerBonusEligible: false,
    });
    expect(getProcessingIngredient("blackberry-cave")).toMatchObject({
      englishName: "Blackberry (Farm Cave)",
      tillerBonusEligible: false,
    });
    expect(getProcessingIngredient("salmonberry")).toMatchObject({
      englishName: "Salmonberry (Bush Picked)",
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredient("salmonberry-cave")).toMatchObject({
      englishName: "Salmonberry (Farm Cave)",
      tillerBonusEligible: false,
    });
    expect(getProcessingIngredient("cactus-fruit")).toMatchObject({
      englishName: "Cactus Fruit (Desert Foraged)",
      tillerBonusEligible: false,
    });
    expect(getProcessingIngredient("cactus-fruit-grown")).toMatchObject({
      englishName: "Cactus Fruit (Grown)",
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredient("qi-fruit")).toMatchObject({
      basePrice: 1,
      hasQualityTiers: false,
      tillerBonusEligible: true,
    });
    expect(getProcessingIngredientQualities("blackberry")).toEqual(["normal", "iridium"]);
    expect(getProcessingIngredientQualities("salmonberry")).toEqual(["normal", "iridium"]);
    expect(getProcessingIngredientQualities("blackberry-cave")).toEqual(["normal", "silver", "gold", "iridium"]);
    expect(getProcessingIngredientQualities("salmonberry-cave")).toEqual(["normal", "silver", "gold", "iridium"]);
    expect(getProcessingIngredientQualities("apple")).toEqual(["normal", "silver", "gold", "iridium"]);
    expect(getProcessingIngredientQualities("rice")).toEqual(["normal"]);
    expect(getProcessingIngredient("tea-leaves")).toMatchObject({ hasQualityTiers: false });
    expect(getProcessingIngredient("ginger")).toMatchObject({ hasQualityTiers: false });
    expect(getProcessingIngredient("cave-carrot")).toMatchObject({ hasQualityTiers: false });
    expect(getProcessingIngredientQualities("tea-leaves")).toEqual(["normal"]);
    expect(getProcessingIngredientQualities("ginger")).toEqual(["normal"]);
    expect(getProcessingIngredientQualities("cave-carrot")).toEqual(["normal"]);
    expect(() => getProcessingIngredientQualities("not-a-processing-item")).toThrow("not-a-processing-item");

    const sourcePriceCases = [
      { ingredientId: "blackberry", expectedRawUnitPrice: 22 },
      { ingredientId: "blackberry-ground", expectedRawUnitPrice: 20 },
      { ingredientId: "blackberry-cave", expectedRawUnitPrice: 20 },
      { ingredientId: "salmonberry", expectedRawUnitPrice: 5 },
      { ingredientId: "salmonberry-cave", expectedRawUnitPrice: 5 },
      { ingredientId: "cactus-fruit", expectedRawUnitPrice: 75 },
      { ingredientId: "cactus-fruit-grown", expectedRawUnitPrice: 82 },
      { ingredientId: "grape", expectedRawUnitPrice: 88 },
      { ingredientId: "grape-foraged", expectedRawUnitPrice: 80 },
    ];

    for (const sourcePriceCase of sourcePriceCases) {
      const routeQuote = calculateProcessingRoute({
        ...processingInput({ ingredientId: sourcePriceCase.ingredientId, profession: "tiller" }),
        machine: "keg",
      });

      expect(routeQuote.rawUnitPrice).toBe(sourcePriceCase.expectedRawUnitPrice);
    }
  });
});

describe("calculateProcessingRoutes", () => {
  it("quotes the same cranberries through Keg, Jar, and Dehydrator as separate alternatives", () => {
    const routeQuotes = calculateProcessingRoutes(
      processingInput({ quantity: 5, profession: "artisan" }),
    );

    expect(routeQuotes.map(({ machine }) => machine)).toEqual(["keg", "jar", "dehydrator"]);
    expect(routeQuotes.map(({ finalValue }) => finalValue)).toEqual([1575, 1400, 821]);
    expect(routeQuotes.map(({ valueAdded }) => valueAdded)).toEqual([1165, 990, 411]);
    for (const routeQuote of routeQuotes) {
      expect(routeQuote.processedUnits + routeQuote.backlogUnits).toBe(5);
    }
  });

  it("keeps raw quality in the opportunity cost while processed goods use their base recipe price", () => {
    const cranberryKeg = calculateProcessingRoute({
      ...processingInput({ quantity: 1, quality: "iridium", profession: "tiller" }),
      machine: "keg",
    });

    expect(cranberryKeg.rawUnitPrice).toBe(165);
    expect(cranberryKeg.batchOutputPrice).toBe(225);
    expect(cranberryKeg.valueAddedPerProcessedUnit).toBe(60);
    expect(cranberryKeg.valueAddedPerMachineDay).toBe(60 / 7);
  });

  it("uses one five-item coffee batch and excludes Artisan from coffee while including it for Mead", () => {
    const professions = ["none", "tiller", "artisan"] as const;
    const coffeeQuotes = professions.map((profession) =>
      calculateProcessingRoute({
        ...processingInput({ ingredientId: "coffee-bean", quantity: 5, profession }),
        machine: "keg",
      }),
    );
    const honeyKeg = calculateProcessingRoute({
      ...processingInput({ ingredientId: "honey-wild", quantity: 1, profession: "artisan" }),
      machine: "keg",
    });

    expect(coffeeQuotes.map(({ batchOutputPrice, rawUnitPrice, valueAdded }) => ({
      batchOutputPrice,
      rawUnitPrice,
      valueAdded,
    }))).toEqual([
      { batchOutputPrice: 150, rawUnitPrice: 15, valueAdded: 75 },
      { batchOutputPrice: 150, rawUnitPrice: 15, valueAdded: 75 },
      { batchOutputPrice: 150, rawUnitPrice: 15, valueAdded: 75 },
    ]);
    expect(coffeeQuotes[0]).toMatchObject({
      batchInputUnits: 5,
      processingMinutes: 120,
      processedUnits: 5,
      valueAddedPerMachineDay: 75,
    });
    expect(honeyKeg).toMatchObject({
      rawUnitPrice: 140,
      batchOutputPrice: 420,
      valueAdded: 280,
      valueAddedPerMachineDay: 280,
    });
  });

  it("uses Preserve Jar recipes for edible forage and non-red mushrooms", () => {
    const leekPickles = calculateProcessingRoute({
      ...processingInput({ ingredientId: "leek" }),
      machine: "jar",
    });
    const commonMushroomPickles = calculateProcessingRoute({
      ...processingInput({ ingredientId: "common-mushroom" }),
      machine: "jar",
    });
    const redMushroomRoutes = calculateProcessingRoutes(
      processingInput({ ingredientId: "red-mushroom", profession: "artisan" }),
    );

    expect(leekPickles).toMatchObject({
      productEnglishName: "Pickles",
      batchOutputPrice: 170,
      processedUnits: 1,
      finalValue: 170,
      valueAdded: 110,
    });
    expect(commonMushroomPickles).toMatchObject({
      batchOutputPrice: 130,
      processedUnits: 1,
      finalValue: 130,
      valueAdded: 90,
    });
    expect(redMushroomRoutes.map(({ applicable, rawValue, finalValue, processedUnits }) => ({
      applicable,
      rawValue,
      finalValue,
      processedUnits,
    }))).toEqual([
      { applicable: false, rawValue: 75, finalValue: 75, processedUnits: 0 },
      { applicable: false, rawValue: 75, finalValue: 75, processedUnits: 0 },
      { applicable: false, rawValue: 75, finalValue: 75, processedUnits: 0 },
    ]);
  });

  it("adds verified Preserve Jar recipes for tea leaves, hops, and wheat", () => {
    const jarQuotes = ["tea-leaves", "hops", "wheat"].map((ingredientId) =>
      calculateProcessingRoute({
        ...processingInput({ ingredientId, profession: "artisan" }),
        machine: "jar",
      }),
    );

    expect(jarQuotes.map(({ productEnglishName, processingMinutes, batchOutputPrice, valueAdded }) => ({
      productEnglishName,
      processingMinutes,
      batchOutputPrice,
      valueAdded,
    }))).toEqual([
      { productEnglishName: "Pickled Tea Leaves", processingMinutes: 4_000, batchOutputPrice: 210, valueAdded: 155 },
      { productEnglishName: "Pickles", processingMinutes: 4_000, batchOutputPrice: 140, valueAdded: 113 },
      { productEnglishName: "Pickles", processingMinutes: 4_000, batchOutputPrice: 140, valueAdded: 113 },
    ]);
  });

  it("keeps foraged raisins at 600g and applies Artisan only to the processed batch", () => {
    const professions = ["none", "tiller", "artisan"] as const;
    const raisinQuotes = professions.map((profession) =>
      calculateProcessingRoute({
        ...processingInput({ ingredientId: "grape-foraged", quantity: 5, profession }),
        machine: "dehydrator",
      }),
    );

    expect(raisinQuotes.map(({ rawUnitPrice, batchOutputPrice, valueAdded }) => ({
      rawUnitPrice,
      batchOutputPrice,
      valueAdded,
    }))).toEqual([
      { rawUnitPrice: 80, batchOutputPrice: 600, valueAdded: 200 },
      { rawUnitPrice: 80, batchOutputPrice: 600, valueAdded: 200 },
      { rawUnitPrice: 80, batchOutputPrice: 840, valueAdded: 440 },
    ]);
  });

  it("applies Coconut Tiller only to purchased or gifted fruit without changing its price tiers", () => {
    const foragedCoconut = calculateProcessingRoute({
      ...processingInput({ ingredientId: "coconut", profession: "artisan" }),
      machine: "keg",
    });
    const purchasedCoconut = calculateProcessingRoute({
      ...processingInput({
        ingredientId: "coconut",
        profession: "artisan",
        coconutSource: "purchased-or-gifted",
      }),
      machine: "keg",
    });

    expect(getProcessingIngredientQualities("coconut")).toEqual(["normal", "silver", "gold", "iridium"]);
    expect(foragedCoconut.rawUnitPrice).toBe(100);
    expect(purchasedCoconut.rawUnitPrice).toBe(110);
    expect(purchasedCoconut.batchOutputPrice).toBe(foragedCoconut.batchOutputPrice);
    expect(purchasedCoconut.batchOutputPrice).toBe(420);
  });

  it("prices every Bear's Knowledge berry source, supported quality, and profession independently", () => {
    const eligibleIngredientIds = [
      "blackberry",
      "blackberry-cave",
      "blackberry-ground",
      "salmonberry",
      "salmonberry-cave",
    ];
    for (const ingredientId of eligibleIngredientIds) {
      expect(isBearsKnowledgeEligible(ingredientId)).toBe(true);
    }
    expect(isBearsKnowledgeEligible("apple")).toBe(false);
    expect(() => isBearsKnowledgeEligible("not-a-processing-item")).toThrow("not-a-processing-item");

    const professions = ["none", "tiller", "artisan"] as const;
    const berryPriceCases: readonly {
      ingredientId: string;
      quality: "normal" | "silver" | "gold" | "iridium";
      expectedRawPrices: Readonly<Record<(typeof professions)[number], number>>;
      expectedWinePrices: Readonly<Record<(typeof professions)[number], number>>;
    }[] = [
      {
        ingredientId: "blackberry",
        quality: "normal",
        expectedRawPrices: { none: 60, tiller: 66, artisan: 66 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry",
        quality: "iridium",
        expectedRawPrices: { none: 120, tiller: 132, artisan: 132 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-cave",
        quality: "normal",
        expectedRawPrices: { none: 60, tiller: 60, artisan: 60 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-cave",
        quality: "silver",
        expectedRawPrices: { none: 75, tiller: 75, artisan: 75 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-cave",
        quality: "gold",
        expectedRawPrices: { none: 90, tiller: 90, artisan: 90 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-cave",
        quality: "iridium",
        expectedRawPrices: { none: 120, tiller: 120, artisan: 120 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-ground",
        quality: "normal",
        expectedRawPrices: { none: 60, tiller: 60, artisan: 60 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-ground",
        quality: "silver",
        expectedRawPrices: { none: 75, tiller: 75, artisan: 75 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-ground",
        quality: "gold",
        expectedRawPrices: { none: 90, tiller: 90, artisan: 90 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "blackberry-ground",
        quality: "iridium",
        expectedRawPrices: { none: 120, tiller: 120, artisan: 120 },
        expectedWinePrices: { none: 60, tiller: 60, artisan: 84 },
      },
      {
        ingredientId: "salmonberry",
        quality: "normal",
        expectedRawPrices: { none: 15, tiller: 16, artisan: 16 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
      {
        ingredientId: "salmonberry",
        quality: "iridium",
        expectedRawPrices: { none: 30, tiller: 33, artisan: 33 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
      {
        ingredientId: "salmonberry-cave",
        quality: "normal",
        expectedRawPrices: { none: 15, tiller: 15, artisan: 15 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
      {
        ingredientId: "salmonberry-cave",
        quality: "silver",
        expectedRawPrices: { none: 18, tiller: 18, artisan: 18 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
      {
        ingredientId: "salmonberry-cave",
        quality: "gold",
        expectedRawPrices: { none: 21, tiller: 21, artisan: 21 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
      {
        ingredientId: "salmonberry-cave",
        quality: "iridium",
        expectedRawPrices: { none: 30, tiller: 30, artisan: 30 },
        expectedWinePrices: { none: 15, tiller: 15, artisan: 21 },
      },
    ];

    for (const berryPriceCase of berryPriceCases) {
      for (const profession of professions) {
        const quoteWithBear = calculateProcessingRoute({
          ...processingInput({
            ingredientId: berryPriceCase.ingredientId,
            quality: berryPriceCase.quality,
            profession,
            hasBearsKnowledge: true,
          }),
          machine: "keg",
        });

        expect(quoteWithBear.rawUnitPrice).toBe(berryPriceCase.expectedRawPrices[profession]);
        expect(quoteWithBear.batchOutputPrice).toBe(berryPriceCase.expectedWinePrices[profession]);
      }
    }
  });

  it("keeps cooking Rice separate from Tiller-eligible Unmilled Rice and prices two Vinegar per batch", () => {
    expect(getProcessingIngredient("rice")).toMatchObject({
      basePrice: 100,
      hasQualityTiers: false,
      tillerBonusEligible: false,
    });
    const riceVinegar = calculateProcessingRoute({
      ...processingInput({ ingredientId: "rice", profession: "artisan" }),
      machine: "keg",
    });

    expect(riceVinegar).toMatchObject({
      productEnglishName: "Vinegar ×2",
      productChineseName: "米醋 ×2",
      batchInputUnits: 1,
      processingMinutes: 600,
      batchOutputPrice: 200,
      rawUnitPrice: 100,
      valueAdded: 100,
    });
    expect(() => calculateProcessingRoutes(processingInput({ ingredientId: "rice", quality: "silver" }))).toThrow(
      'quality is unsupported for ingredientId "rice": "silver"',
    );

    expect(getProcessingIngredient("unmilled-rice")).toMatchObject({
      basePrice: 30,
      category: "vegetable",
      tillerBonusEligible: true,
    });
    const unmilledRiceKeg = calculateProcessingRoute({
      ...processingInput({ ingredientId: "unmilled-rice", profession: "tiller" }),
      machine: "keg",
    });
    const unmilledRiceJar = calculateProcessingRoute({
      ...processingInput({ ingredientId: "unmilled-rice" }),
      machine: "jar",
    });

    expect(unmilledRiceKeg).toMatchObject({ rawUnitPrice: 33, batchOutputPrice: 67, valueAdded: 34 });
    expect(unmilledRiceJar).toMatchObject({ rawUnitPrice: 30, batchOutputPrice: 110, valueAdded: 80 });
  });

  it("matches official Taro Root, Fiddlehead Fern, and Qi Fruit prices", () => {
    const taroJuice = calculateProcessingRoute({
      ...processingInput({ ingredientId: "taro-root", profession: "tiller" }),
      machine: "keg",
    });
    const taroPickles = calculateProcessingRoute({
      ...processingInput({ ingredientId: "taro-root" }),
      machine: "jar",
    });
    const fiddleheadJuice = calculateProcessingRoute({
      ...processingInput({ ingredientId: "fiddlehead-fern", profession: "tiller" }),
      machine: "keg",
    });
    const fiddleheadPickles = calculateProcessingRoute({
      ...processingInput({ ingredientId: "fiddlehead-fern" }),
      machine: "jar",
    });
    const qiWine = calculateProcessingRoute({
      ...processingInput({ ingredientId: "qi-fruit", profession: "artisan" }),
      machine: "keg",
    });
    const qiJelly = calculateProcessingRoute({
      ...processingInput({ ingredientId: "qi-fruit", profession: "artisan" }),
      machine: "jar",
    });
    const qiDriedFruit = calculateProcessingRoute({
      ...processingInput({ ingredientId: "qi-fruit", quantity: 5, profession: "artisan" }),
      machine: "dehydrator",
    });

    expect(taroJuice).toMatchObject({ rawUnitPrice: 110, batchOutputPrice: 225, valueAdded: 115 });
    expect(taroPickles).toMatchObject({ batchOutputPrice: 250, valueAdded: 150 });
    expect(fiddleheadJuice).toMatchObject({ rawUnitPrice: 99, batchOutputPrice: 202, valueAdded: 103 });
    expect(fiddleheadPickles).toMatchObject({ batchOutputPrice: 230, valueAdded: 140 });
    expect(qiWine).toMatchObject({ rawUnitPrice: 1, batchOutputPrice: 4, valueAdded: 3 });
    expect(qiJelly).toMatchObject({ batchOutputPrice: 72, valueAdded: 71 });
    expect(qiDriedFruit).toMatchObject({
      productEnglishName: "Dried Fruit",
      batchInputUnits: 5,
      batchOutputPrice: 44,
      processedUnits: 5,
      backlogUnits: 0,
      valueAdded: 39,
    });
    for (const routeQuote of [taroJuice, taroPickles, fiddleheadJuice, fiddleheadPickles, qiWine, qiJelly, qiDriedFruit]) {
      expect(routeQuote.processedUnits + routeQuote.backlogUnits).toBe(routeQuote.rawValue / routeQuote.rawUnitPrice);
    }
  });

  it("accepts only normal and iridium quality for bush-picked berries", () => {
    for (const ingredientId of ["blackberry", "salmonberry"]) {
      for (const quality of ["silver", "gold"] as const) {
        expect(() =>
          calculateProcessingRoutes(processingInput({ ingredientId, quality })),
        ).toThrow(`quality is unsupported for ingredientId "${ingredientId}": "${quality}"`);
      }

      const iridiumQuote = calculateProcessingRoute({
        ...processingInput({ ingredientId, quality: "iridium" }),
        machine: "keg",
      });
      expect(iridiumQuote.rawUnitPrice).toBe(ingredientId === "blackberry" ? 40 : 10);
    }

    const caveBerryQuote = calculateProcessingRoute({
      ...processingInput({ ingredientId: "blackberry-cave", quality: "silver" }),
      machine: "keg",
    });
    expect(caveBerryQuote.rawUnitPrice).toBe(25);
  });

  it("includes Summer Spangle Honey and preserves negative-value raw-sale comparisons", () => {
    const summerSpangleMead = calculateProcessingRoute({
      ...processingInput({ ingredientId: "honey-summer-spangle", profession: "artisan" }),
      machine: "keg",
    });
    const fairyRoseMead = calculateProcessingRoute({
      ...processingInput({ ingredientId: "honey-fairy-rose", profession: "artisan" }),
      machine: "keg",
    });

    expect(summerSpangleMead).toMatchObject({
      rawUnitPrice: 392,
      batchOutputPrice: 420,
      valueAdded: 28,
    });
    expect(fairyRoseMead).toMatchObject({
      rawUnitPrice: 952,
      batchOutputPrice: 420,
      valueAdded: -532,
    });
  });

  it("uses available machines and elapsed deadline days in capacity mode", () => {
    const beforeKegReady = calculateProcessingRoute({
      ...processingInput({ quantity: 3, mode: "capacity", deadlineDays: 6, machineCounts: { keg: 1, jar: 0, dehydrator: 0 } }),
      machine: "keg",
    });
    const onKegReadyDay = calculateProcessingRoute({
      ...processingInput({ quantity: 3, mode: "capacity", deadlineDays: 7, machineCounts: { keg: 1, jar: 0, dehydrator: 0 } }),
      machine: "keg",
    });
    const threeKegsReadyByDeadline = calculateProcessingRoute({
      ...processingInput({ quantity: 3, mode: "capacity", deadlineDays: 7, machineCounts: { keg: 3, jar: 0, dehydrator: 0 } }),
      machine: "keg",
    });
    const twoKegCyclesReadyByDeadline = calculateProcessingRoute({
      ...processingInput({ quantity: 3, mode: "capacity", deadlineDays: 14, machineCounts: { keg: 1, jar: 0, dehydrator: 0 } }),
      machine: "keg",
    });
    const zeroMachines = calculateProcessingRoute({
      ...processingInput({ quantity: 3, mode: "capacity", deadlineDays: 28, machineCounts: { keg: 0, jar: 0, dehydrator: 0 } }),
      machine: "keg",
    });

    expect(beforeKegReady).toMatchObject({ processedUnits: 0, backlogUnits: 3, valueAdded: 0 });
    expect(onKegReadyDay).toMatchObject({ processedUnits: 1, backlogUnits: 2, finalValue: 375 });
    expect(threeKegsReadyByDeadline).toMatchObject({ processedUnits: 3, backlogUnits: 0, finalValue: 675 });
    expect(twoKegCyclesReadyByDeadline).toMatchObject({ processedUnits: 2, backlogUnits: 1, finalValue: 525 });
    expect(zeroMachines).toMatchObject({ processedUnits: 0, backlogUnits: 3, finalValue: 225 });
  });

  it("conserves dehydrator inventory and values grape batches as raisins", () => {
    const grapeBatch = calculateProcessingRoute({
      ...processingInput({ ingredientId: "grape", quantity: 10, mode: "capacity", deadlineDays: 1, machineCounts: { keg: 0, jar: 0, dehydrator: 1 } }),
      machine: "dehydrator",
    });

    expect(grapeBatch).toMatchObject({
      productEnglishName: "Raisins",
      batchInputUnits: 5,
      batchOutputPrice: 600,
      processedBatches: 1,
      processedUnits: 5,
      backlogUnits: 5,
      processingMornings: 1,
    });
    expect(grapeBatch.processedUnits + grapeBatch.backlogUnits).toBe(10);
  });

  it("returns raw sale for unsupported machine recipes and treats each machine route independently", () => {
    const mushroomRoutes = calculateProcessingRoutes(
      processingInput({ ingredientId: "common-mushroom", quantity: 7, profession: "artisan" }),
    );
    const kegQuote = mushroomRoutes[0];
    const jarQuote = mushroomRoutes[1];
    const dehydratorQuote = mushroomRoutes[2];

    expect(kegQuote).toMatchObject({
      applicable: false,
      unavailableReason: "recipe-not-supported",
      rawValue: 280,
      backlogUnits: 7,
      finalValue: 280,
      batchOutputPrice: null,
    });
    expect(jarQuote).toMatchObject({
      applicable: true,
      batchOutputPrice: 182,
      processedUnits: 7,
      backlogUnits: 0,
      finalValue: 1274,
    });
    expect(dehydratorQuote?.processedUnits).toBe(5);
    expect(dehydratorQuote?.backlogUnits).toBe(2);
    for (const routeQuote of mushroomRoutes) {
      expect(routeQuote.processedUnits + routeQuote.backlogUnits).toBe(7);
    }
  });

  it("processes complete batches in unlimited mode regardless of machine counts and deadline", () => {
    const quote = calculateProcessingRoute({
      ...processingInput({ quantity: 7, deadlineDays: 0, machineCounts: { keg: 0, jar: 0, dehydrator: 0 } }),
      machine: "dehydrator",
    });

    expect(quote).toMatchObject({ processedUnits: 5, backlogUnits: 2, processedBatches: 1 });
  });

  it("matches an independent Starfruit Keg capacity golden case with Artisan inheriting Tiller", () => {
    const sevenDayQuote = calculateProcessingRoute({
      ...processingInput({
        ingredientId: "starfruit",
        quantity: 20,
        quality: "normal",
        profession: "artisan",
        mode: "capacity",
        deadlineDays: 7,
        machineCounts: { keg: 10, jar: 10, dehydrator: 4 },
      }),
      machine: "keg",
    });

    expect(sevenDayQuote).toMatchObject({
      rawUnitPrice: 825,
      batchOutputPrice: 3150,
      processedUnits: 10,
      backlogUnits: 10,
      valueAdded: 23250,
    });
  });

  it("fails fast with the invalid field and concrete value", () => {
    expect(() => calculateProcessingRoutes(processingInput({ quantity: -1 }))).toThrow("quantity is invalid: -1");
    expect(() => calculateProcessingRoutes(processingInput({ quality: "diamond" as never }))).toThrow(
      'quality is invalid: "diamond"',
    );
    expect(() =>
      calculateProcessingRoutes(
        processingInput({
          ingredientId: "honey-wild",
          quality: "gold",
        }),
      ),
    ).toThrow('quality is unsupported for ingredientId "honey-wild": "gold"');
    expect(() =>
      calculateProcessingRoutes(
        processingInput({ machineCounts: { keg: Number.POSITIVE_INFINITY, jar: 0, dehydrator: 0 } }),
      ),
    ).toThrow("machineCounts.keg is invalid: Infinity");
    expect(() => calculateProcessingRoutes(processingInput({ deadlineDays: -2 }))).toThrow(
      "deadlineDays is invalid: -2",
    );
    expect(() => calculateProcessingRoutes(processingInput({ hasBearsKnowledge: "yes" as never }))).toThrow(
      'hasBearsKnowledge is invalid: "yes"',
    );
    expect(() => calculateProcessingRoutes(processingInput({ coconutSource: "mail" as never }))).toThrow(
      'coconutSource is invalid: "mail"',
    );
    for (const [ingredientId, quality] of [
      ["tea-leaves", "silver"],
      ["ginger", "gold"],
      ["cave-carrot", "iridium"],
    ] as const) {
      expect(() => calculateProcessingRoutes(processingInput({ ingredientId, quality }))).toThrow(
        `quality is unsupported for ingredientId "${ingredientId}": "${quality}"`,
      );
    }
    expect(() =>
      calculateProcessingRoute({ ...processingInput(), machine: "crusher" as never }),
    ).toThrow('machine is invalid: "crusher"');
  });
});
