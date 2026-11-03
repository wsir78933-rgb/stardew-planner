import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  calculateProcessingRoutes,
  getProcessingIngredient,
  listProcessingIngredients,
  type ApplicableProcessingRouteQuote,
  type CalculateProcessingRoutesInput,
} from "../../src/processing-tools/processing-model";
import {
  createDefaultProcessingComparisonForm,
  isProcessingComparisonFormValidationFailure,
  isProcessingComparisonNumericInputFailure,
  loadProcessingComparisonFormWithRecovery,
  parseProcessingComparisonForm,
  parseProcessingComparisonNonNegativeInteger,
  processingComparisonStorageKey,
  readProcessingComparisonForm,
  updateProcessingComparisonIngredient,
  updateProcessingComparisonCoconutSource,
  updateProcessingComparisonMode,
  updateProcessingComparisonNumericValue,
} from "../../src/tools-pages/processing/processing-comparison-form";
import {
  canResetProcessingComparisonSavedSettings,
  createProcessingClipboardRecovery,
  createProcessingCopyText,
  findBestPerMachineDayProcessingRoute,
  findBestPerUnitProcessingRoute,
  findBestProcessingRoute,
  formatProcessingNumericInputFailure,
  getActiveProcessingMachineFilter,
  getProcessingComparisonRoutes,
  getProcessingMachineFilterOptions,
  getProcessingQualityOptions,
  ProcessingComparisonTool,
  readProcessingClipboardFailure,
  readProcessingComparisonLoadFailure,
} from "../../src/tools-pages/processing/processing-comparison-tool";
import type { ProcessingComparisonToolId } from "../../src/tools-pages/processing/processing-tool-definition";

const toolIds: readonly ProcessingComparisonToolId[] = [
  "basic-processing-profit",
  "machine-comparison",
  "keg-processing",
  "preserves-jar-processing",
  "dehydrator-processing",
];

function getMachineRows(markup: string): readonly string[] {
  return [...markup.matchAll(/<tr\b[^>]*data-machine="([^"]+)"/g)].map((match) => match[1]);
}

function getMachineRowOpenTag(markup: string, machine: string): string {
  const row = markup.match(new RegExp(`<tr\\b(?=[^>]*data-machine="${machine}")[^>]*>`))?.[0];
  if (row === undefined) {
    throw new Error(`Rendered route row was not found. Received machine=${JSON.stringify(machine)}.`);
  }
  return row;
}

function getMachineRowMarkup(markup: string, machine: string): string {
  const row = markup.match(
    new RegExp(`<tr\\b(?=[^>]*data-machine="${machine}")[^>]*>[\\s\\S]*?<\\/tr>`),
  )?.[0];
  if (row === undefined) {
    throw new Error(`Rendered route row was not found. Received machine=${JSON.stringify(machine)}.`);
  }
  return row;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getElementMarkupByAttribute(markup: string, attribute: string, value: string): string {
  const attributePattern = new RegExp(
    `<([a-z][a-z\\d-]*)\\b(?=[^>]*\\b${escapeRegExp(attribute)}="${escapeRegExp(value)}")[^>]*>`,
  );
  const openingTag = markup.match(attributePattern);
  if (openingTag === null || openingTag.index === undefined) {
    throw new Error(
      `Rendered element was not found. Received ${attribute}=${JSON.stringify(value)}.`,
    );
  }

  const elementName = openingTag[1];
  const elementTags = new RegExp(`<\\/?${escapeRegExp(elementName)}\\b[^>]*>`, "g");
  elementTags.lastIndex = openingTag.index + openingTag[0].length;
  let depth = 1;
  let closingIndex = -1;
  let closingLength = 0;

  for (const tag of markup.matchAll(elementTags)) {
    const tagText = tag[0];
    if (tagText.startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        closingIndex = tag.index ?? -1;
        closingLength = tagText.length;
        break;
      }
    } else if (!tagText.endsWith("/>")) {
      depth += 1;
    }
  }

  if (closingIndex < 0) {
    throw new Error(
      `Rendered ${elementName} element has no matching closing tag. Received ${attribute}=${JSON.stringify(value)}.`,
    );
  }

  return markup.slice(openingTag.index, closingIndex + closingLength);
}

function getMachineCardMarkup(markup: string, machine: string): string {
  const machineElement = markup.match(
    new RegExp(`<article\\b(?=[^>]*data-machine="${machine}")[^>]*>[\\s\\S]*?<\\/article>`),
  )?.[0];
  if (machineElement === undefined) {
    throw new Error(
      `Rendered machine card was not found. Received machine=${JSON.stringify(machine)}.`,
    );
  }
  return machineElement;
}

function getButtonTexts(markup: string): readonly string[] {
  return [...markup.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].map((match) =>
    match[1].replace(/<[^>]+>/g, "").trim(),
  );
}

function getMachineRowCellTexts(markup: string, machine: string): readonly string[] {
  return [...getMachineRowMarkup(markup, machine).matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(
    (match) => match[1].replace(/<[^>]+>/g, "").trim(),
  );
}

type ProcessingRouteOverrides = Partial<Omit<CalculateProcessingRoutesInput, "ingredientId">>;

function calculateRoutesForIngredient(
  ingredientId: string,
  overrides: ProcessingRouteOverrides = {},
) {
  return calculateProcessingRoutes({
    ingredientId,
    quantity: 20,
    quality: "normal",
    profession: "none",
    mode: "capacity",
    deadlineDays: 7,
    machineCounts: { keg: 1, jar: 1, dehydrator: 1 },
    ...overrides,
  });
}

type ProcessingCopyTextLabels = Parameters<typeof createProcessingCopyText>[6];

function createProcessingCopyTextLabels(locale: "en" | "zh-CN"): ProcessingCopyTextLabels {
  const english = locale === "en";
  return {
    modes: {
      unlimited: english ? "Full-stock value" : "全部加工收益",
      capacity: english ? "By machines and days" : "按机器与天数",
    },
    allMachines: english ? "All machines" : "全部机器",
    machineNames: {
      keg: "Keg",
      jar: english ? "Preserves Jar" : "罐头瓶",
      dehydrator: english ? "Dehydrator" : "烘干机",
    },
    inputLabels: {
      ingredient: english ? "Raw ingredient" : "原料",
      quantity: english ? "Quantity" : "数量",
      quality: english ? "Quality" : "品质",
      profession: english ? "Profession" : "职业",
      mode: english ? "Estimate mode" : "估算方式",
      deadline: english ? "Processing window" : "加工期限",
      machineView: english ? "Show routes" : "显示路线",
      machineCounts: {
        keg: english ? "Kegs" : "Keg 数量",
        jar: english ? "Preserves Jars" : "罐头瓶数量",
        dehydrator: english ? "Dehydrators" : "烘干机数量",
      },
    },
    qualities: {
      normal: english ? "Normal" : "普通",
      silver: english ? "Silver" : "银星",
      gold: english ? "Gold" : "金星",
      iridium: english ? "Iridium" : "铱星",
    },
    professions: {
      none: english ? "No profession bonus" : "无职业加成",
      tiller: english ? "Tiller" : "耕种者",
      artisan: english ? "Artisan" : "工匠",
    },
    modeDescriptions: {
      unlimited: english ? "Process all stock." : "加工全部库存。",
      capacity: english ? "Use machines and days." : "按机器与天数计算。",
    },
    deadlines: {
      7: english ? "7 days" : "7 天",
      14: english ? "14 days" : "14 天",
      28: english ? "28 days" : "28 天",
    },
    deadlineLabel: english ? "Processing window" : "加工期限",
    machineCountsLabel: english ? "Machine counts" : "机器数量",
    capacityAssumption: english ? "Capacity assumption." : "产能假设。",
    bearsKnowledgeLabel: english ? "Bear's Knowledge" : "熊的知识",
    bearsKnowledgeDescription: english ? "Raw prices change." : "直接售价会变化。",
    bearsKnowledgeEnabled: english ? "On" : "开启",
    bearsKnowledgeDisabled: english ? "Off" : "关闭",
    assumptions: english ? "Assumptions" : "计算假设",
    independentRoutes: english ? "Routes are independent." : "各路线独立计算。",
    recipeNotSupported: english ? "No recipe." : "无配方。",
    zeroMachineNote: english ? "No machines." : "没有机器。",
    noCompleteBatchNote: english ? "No complete batch." : "没有完整批次。",
    noBatchBeforeDeadline: english ? "No batch before deadline." : "期限内没有批次。",
    completedLeftoverColumn: english ? "Processed / raw left" : "已加工 / 原料余量",
    finalValueColumn: english ? "Final value" : "最终价值",
    addedValueColumn: english ? "Added value" : "增值",
  } as ProcessingCopyTextLabels;
}

describe("processing comparison form", () => {
  it("shares one browser key and uses the requested route defaults", () => {
    expect(processingComparisonStorageKey).toBe("stardew-tools:processing-comparison");

    const basicForm = createDefaultProcessingComparisonForm("basic-processing-profit");
    const comparisonForm = createDefaultProcessingComparisonForm("machine-comparison");
    const singleMachineForm = createDefaultProcessingComparisonForm("dehydrator-processing");

    expect(basicForm).toMatchObject({
      ingredientId: "blueberry",
      quantity: 20,
      quality: "normal",
      profession: "none",
      mode: "unlimited",
      deadlineDays: 7,
      machineCounts: { keg: 1, jar: 1, dehydrator: 1 },
    });
    expect(comparisonForm.mode).toBe("capacity");
    expect(singleMachineForm.mode).toBe("capacity");
    expect(listProcessingIngredients().some((ingredient) => ingredient.id === basicForm.ingredientId)).toBe(true);
  });

  it("fails fast on malformed saved values and includes the received value", () => {
    const validForm = createDefaultProcessingComparisonForm("basic-processing-profit");

    expect(() => readProcessingComparisonForm({ ...validForm, quantity: -1 })).toThrow("Received: -1");
    expect(
      readProcessingComparisonForm({
        ...validForm,
        ingredientId: "honey-wild",
        quality: "silver",
      }),
    ).toMatchObject({ quality: "normal" });
    expect(() => parseProcessingComparisonForm("{invalid")).toThrow('Received: "{invalid"');
    expect(() => readProcessingComparisonForm({ ...validForm, ingredientId: "missing-ingredient" })).toThrow(
      'Received: "missing-ingredient"',
    );
    expect(() =>
      readProcessingComparisonForm({
        ...validForm,
        ingredientId: "blackberry",
        quality: "platinum",
      }),
    ).toThrow('Received: "platinum".');
    expect(() => readProcessingComparisonForm({ ...validForm, hasBearsKnowledge: "yes" })).toThrow(
      'Received: "yes".',
    );
    expect(() => readProcessingComparisonForm({ ...validForm, coconutSource: "cave" })).toThrow(
      'Received: "cave".',
    );
  });

  it("accepts older drafts without special fields and visibly reports a migrated unsupported quality", () => {
    const legacyForm = { ...createDefaultProcessingComparisonForm("machine-comparison") };
    delete legacyForm.hasBearsKnowledge;
    delete legacyForm.coconutSource;

    expect(readProcessingComparisonForm(legacyForm)).toMatchObject({
      hasBearsKnowledge: false,
      coconutSource: "foraged",
    });

    const legacyTeaSettings = JSON.stringify({
      ...legacyForm,
      ingredientId: "tea-leaves",
      quantity: 43,
      quality: "gold",
    });
    const loadResult = loadProcessingComparisonFormWithRecovery(legacyTeaSettings, "machine-comparison");

    expect(loadResult.qualityWasReset).toBe(true);
    expect(loadResult.form).toMatchObject({
      ingredientId: "tea-leaves",
      quantity: 43,
      quality: "normal",
      coconutSource: "foraged",
      hasBearsKnowledge: false,
    });
  });

  it("keeps coconut quality unchanged when its source changes", () => {
    const coconutForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      ingredientId: "coconut",
      quality: "iridium" as const,
    };

    expect(updateProcessingComparisonCoconutSource(coconutForm, "purchased-or-gifted")).toMatchObject({
      ingredientId: "coconut",
      coconutSource: "purchased-or-gifted",
      quality: "iridium",
    });
  });

  it("passes applicable Bear and coconut source assumptions to the public route model", () => {
    const berryForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      ingredientId: "blackberry",
      quantity: 5,
      mode: "unlimited" as const,
    };
    const berryWithoutKnowledge = getProcessingComparisonRoutes(
      { ...berryForm, hasBearsKnowledge: false },
      {},
    )?.[0];
    const berryWithKnowledge = getProcessingComparisonRoutes(
      { ...berryForm, hasBearsKnowledge: true },
      {},
    )?.[0];

    expect(berryWithKnowledge?.rawUnitPrice).toBeGreaterThan(berryWithoutKnowledge?.rawUnitPrice ?? 0);
    expect(berryWithKnowledge?.batchOutputPrice).toBe(berryWithoutKnowledge?.batchOutputPrice);

    const unrelatedForm = { ...berryForm, ingredientId: "blueberry" };
    const unrelatedWithoutKnowledge = getProcessingComparisonRoutes(
      { ...unrelatedForm, hasBearsKnowledge: false },
      {},
    )?.[0];
    const unrelatedWithKnowledge = getProcessingComparisonRoutes(
      { ...unrelatedForm, hasBearsKnowledge: true },
      {},
    )?.[0];

    expect(unrelatedWithKnowledge?.rawUnitPrice).toBe(unrelatedWithoutKnowledge?.rawUnitPrice);

    const coconutForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      ingredientId: "coconut",
      quantity: 1,
      profession: "tiller" as const,
      mode: "unlimited" as const,
    };
    const foragedCoconut = getProcessingComparisonRoutes(
      { ...coconutForm, coconutSource: "foraged" },
      {},
    )?.[0];
    const purchasedCoconut = getProcessingComparisonRoutes(
      { ...coconutForm, coconutSource: "purchased-or-gifted" },
      {},
    )?.[0];

    expect(purchasedCoconut?.rawUnitPrice).toBeGreaterThan(foragedCoconut?.rawUnitPrice ?? 0);
  });

  it("classifies known stored-form failures and rethrows unknown load errors", () => {
    let invalidJsonError: unknown;
    try {
      parseProcessingComparisonForm("{broken");
    } catch (error) {
      invalidJsonError = error;
    }

    expect(isProcessingComparisonFormValidationFailure(invalidJsonError)).toBe(true);
    expect(canResetProcessingComparisonSavedSettings(invalidJsonError)).toBe(true);
    expect(
      readProcessingComparisonLoadFailure(
        invalidJsonError,
        " Use Reset this tool to restore its defaults.",
      ),
    ).toContain('Received: "{broken". Use Reset this tool');
    expect(readProcessingComparisonLoadFailure(
      new Error('Browser storage failed. Received: "denied".'),
      "Recovery hint",
    )).toBe('Browser storage failed. Received: "denied".');
    expect(canResetProcessingComparisonSavedSettings(
      new Error('Browser storage failed. Received: "denied".'),
    )).toBe(false);
    expect(canResetProcessingComparisonSavedSettings(new Error("Unexpected code failure"))).toBe(false);
    expect(() => readProcessingComparisonLoadFailure(new Error("Unexpected code failure"), "Recovery hint")).toThrow(
      "Unexpected code failure",
    );
  });

  it("classifies only numeric input validation errors for field feedback", () => {
    let invalidInputError: unknown;
    try {
      parseProcessingComparisonNonNegativeInteger("1.5", "Quantity");
    } catch (error) {
      invalidInputError = error;
    }

    let invalidUpdateError: unknown;
    try {
      updateProcessingComparisonNumericValue(
        createDefaultProcessingComparisonForm("machine-comparison"),
        "quantity",
        -1,
      );
    } catch (error) {
      invalidUpdateError = error;
    }

    expect(isProcessingComparisonNumericInputFailure(invalidInputError)).toBe(true);
    expect(invalidInputError).toMatchObject({ message: expect.stringContaining('Received: "1.5"') });
    expect(isProcessingComparisonNumericInputFailure(invalidUpdateError)).toBe(false);
    expect(() => {
      if (!isProcessingComparisonNumericInputFailure(invalidUpdateError)) {
        throw invalidUpdateError;
      }
    }).toThrow("non-negative safe integer");
  });

  it("localizes recognized numeric errors and preserves the field and entered value", () => {
    let invalidInputError: unknown;
    try {
      parseProcessingComparisonNonNegativeInteger("-1", "Quantity");
    } catch (error) {
      invalidInputError = error;
    }

    expect(formatProcessingNumericInputFailure(invalidInputError, "en", "Quantity", "-1")).toBe(
      'Quantity must be a non-negative safe integer. Received: "-1".',
    );
    expect(formatProcessingNumericInputFailure(invalidInputError, "zh-CN", "数量", "-1")).toBe(
      '数量必须是0或更大的安全整数。实际输入："-1"。',
    );
    expect(() =>
      formatProcessingNumericInputFailure(new Error("Unexpected failure"), "zh-CN", "数量", "-1"),
    ).toThrow("Unexpected failure");
  });

  it("limits dedicated machine filters to that machine and an all-machine comparison", () => {
    expect(getProcessingMachineFilterOptions("en", "keg-processing")).toEqual([
      { value: "all", label: "Compare with other machines" },
      { value: "keg", label: "Keg" },
    ]);
    expect(getProcessingMachineFilterOptions("zh-CN", "preserves-jar-processing")).toEqual([
      { value: "all", label: "与其他机器比较" },
      { value: "jar", label: "罐头瓶" },
    ]);
    expect(getProcessingMachineFilterOptions("en", "machine-comparison")).toEqual([
      { value: "all", label: "All machines" },
      { value: "keg", label: "Keg" },
      { value: "jar", label: "Preserves Jar" },
      { value: "dehydrator", label: "Dehydrator" },
    ]);
  });

  it("offers only model-supported ingredient qualities in both locales", () => {
    expect(getProcessingQualityOptions("en", "blackberry")).toEqual([
      { value: "normal", label: "Normal" },
      { value: "iridium", label: "Iridium" },
    ]);
    expect(getProcessingQualityOptions("zh-CN", "salmonberry")).toEqual([
      { value: "normal", label: "普通" },
      { value: "iridium", label: "铱星" },
    ]);
    expect(getProcessingQualityOptions("en", "blackberry-cave").map((option) => option.value)).toEqual([
      "normal",
      "silver",
      "gold",
      "iridium",
    ]);
    expect(getProcessingQualityOptions("en", "coconut").map((option) => option.value)).toEqual([
      "normal",
      "silver",
      "gold",
      "iridium",
    ]);
  });

  it("uses the new route's filter when a preserved filter is unavailable on that route", () => {
    const kegOptions = getProcessingMachineFilterOptions("en", "keg-processing");

    expect(getActiveProcessingMachineFilter("jar", "keg-processing", kegOptions)).toBe("keg");
    expect(getActiveProcessingMachineFilter("all", "keg-processing", kegOptions)).toBe("all");
  });
});

describe("processing route conclusions", () => {
  it.each([
    ["ancient-fruit", "keg", 1100],
    ["starfruit", "keg", 1500],
    ["melon", "keg", 500],
    ["tomato", "jar", 110],
    ["corn", "jar", 100],
    ["hops", "keg", 275],
    ["wheat", "keg", 175],
    ["blueberry", "jar", 100],
  ] as const)("chooses the best per-item route for %s", (ingredientId, expectedMachine, expectedValue) => {
    const routes = calculateRoutesForIngredient(ingredientId);
    const bestRoute = findBestPerUnitProcessingRoute(routes);

    expect(bestRoute?.machine).toBe(expectedMachine);
    expect(bestRoute?.valueAddedPerProcessedUnit).toBe(expectedValue);
  });

  it("chooses the faster jar when blueberry has equal per-item value", () => {
    const routes = calculateRoutesForIngredient("blueberry");
    const kegRoute = routes.find((route) => route.machine === "keg");
    const jarRoute = routes.find((route) => route.machine === "jar");

    expect(kegRoute?.valueAddedPerProcessedUnit).toBe(100);
    expect(jarRoute?.valueAddedPerProcessedUnit).toBe(100);
    expect(kegRoute?.processingMornings).toBe(7);
    expect(jarRoute?.processingMornings).toBe(3);
    expect(findBestPerUnitProcessingRoute(routes)?.machine).toBe("jar");
  });

  it("keeps the first machine when per-item value and processing mornings tie", () => {
    const routes = calculateRoutesForIngredient("blueberry")
      .filter((route): route is ApplicableProcessingRouteQuote => route.applicable)
      .map((route) => ({
        ...route,
        valueAddedPerProcessedUnit: 100,
        processingMornings: 3,
      }));

    expect(routes.map((route) => route.machine)).toEqual(["keg", "jar", "dehydrator"]);
    expect(findBestPerUnitProcessingRoute(routes)?.machine).toBe("keg");
  });

  it.each([
    ["ancient-fruit", "dehydrator"],
    ["starfruit", "dehydrator"],
    ["melon", "dehydrator"],
    ["tomato", "jar"],
  ] as const)("chooses the best per-machine-day route for %s", (ingredientId, expectedMachine) => {
    expect(findBestPerMachineDayProcessingRoute(calculateRoutesForIngredient(ingredientId))?.machine)
      .toBe(expectedMachine);
  });

  it("chooses the higher per-item value when per-machine-day values tie", () => {
    const perItemValues = { keg: 100, jar: 200, dehydrator: 150 } as const;
    const routes = calculateRoutesForIngredient("blueberry")
      .filter((route): route is ApplicableProcessingRouteQuote => route.applicable)
      .map((route) => ({
        ...route,
        valueAddedPerProcessedUnit: perItemValues[route.machine],
        valueAddedPerMachineDay: 100,
      }));

    expect(findBestPerMachineDayProcessingRoute(routes)?.machine).toBe("jar");
  });

  it("keeps the first machine when per-machine-day and per-item values tie", () => {
    const routes = calculateRoutesForIngredient("blueberry")
      .filter((route): route is ApplicableProcessingRouteQuote => route.applicable)
      .map((route) => ({
        ...route,
        valueAddedPerProcessedUnit: 100,
        valueAddedPerMachineDay: 100,
      }));

    expect(routes.map((route) => route.machine)).toEqual(["keg", "jar", "dehydrator"]);
    expect(findBestPerMachineDayProcessingRoute(routes)?.machine).toBe("keg");
  });

  it("returns no processing route when every blackberry route loses to raw sale", () => {
    const routes = calculateRoutesForIngredient("blackberry", {
      quality: "iridium",
      profession: "tiller",
      hasBearsKnowledge: true,
    });

    expect(routes[0]?.rawUnitPrice).toBe(132);
    expect(routes.every((route) => route.applicable && route.valueAddedPerProcessedUnit < 0)).toBe(true);
    expect(routes.every((route) => route.applicable && route.valueAddedPerMachineDay < 0)).toBe(true);
    expect(findBestPerUnitProcessingRoute(routes)).toBeNull();
    expect(findBestPerMachineDayProcessingRoute(routes)).toBeNull();
  });

  it("returns the same per-item and per-machine-day winners in either processing mode", () => {
    const capacityRoutes = calculateRoutesForIngredient("ancient-fruit", { mode: "capacity" });
    const unlimitedRoutes = calculateRoutesForIngredient("ancient-fruit", { mode: "unlimited" });

    expect(findBestPerUnitProcessingRoute(capacityRoutes)?.machine).toBe("keg");
    expect(findBestPerUnitProcessingRoute(unlimitedRoutes)?.machine).toBe("keg");
    expect(findBestPerMachineDayProcessingRoute(capacityRoutes)?.machine).toBe("dehydrator");
    expect(findBestPerMachineDayProcessingRoute(unlimitedRoutes)?.machine).toBe("dehydrator");
  });
});

describe("processing comparison copy text", () => {
  it.each(["en", "zh-CN"] as const)(
    "copies both blueberry conclusions before the first route in %s",
    (locale) => {
      const form = createDefaultProcessingComparisonForm("machine-comparison");
      const ingredient = getProcessingIngredient(form.ingredientId);
      const routes = calculateProcessingRoutes(form);
      const copy = createProcessingCopyTextLabels(locale);
      const conclusionLines = locale === "en"
        ? [
            "Most per item: Preserves Jar (Jelly), +100g per input item",
            "Most per machine per day: Dehydrator (Dried Fruit), +150g per machine per day",
          ]
        : [
            "单件最赚: 罐头瓶 (果酱), 每个原料多赚 100 金币",
            "每台机器每天最赚: 烘干机 (果干), 每台每天多赚 150 金币",
          ];
      const copyText = createProcessingCopyText(
        form,
        ingredient,
        routes,
        "all",
        locale,
        locale === "en" ? "Compare three machines" : "三种机器比较",
        copy,
        conclusionLines,
      );
      const copyLines = copyText.split("\n");
      const firstRouteLine = locale === "en" ? "Keg (Wine)" : "Keg (葡萄酒)";

      expect(routes.map((route) => route.machine)).toEqual(["keg", "jar", "dehydrator"]);
      expect(copyText).toContain(conclusionLines.join("\n"));
      expect(copyLines.indexOf(firstRouteLine)).toBeGreaterThan(copyLines.indexOf(conclusionLines[1]));
    },
  );

  it.each(["en", "zh-CN"] as const)(
    "copies raw-sale conclusions when every blackberry route loses in %s",
    (locale) => {
      const form = {
        ...createDefaultProcessingComparisonForm("machine-comparison"),
        ingredientId: "blackberry",
        quality: "iridium" as const,
        profession: "tiller" as const,
        hasBearsKnowledge: true,
      };
      const ingredient = getProcessingIngredient(form.ingredientId);
      const routes = calculateProcessingRoutes(form);
      const bestPerUnitRoute = findBestPerUnitProcessingRoute(routes);
      const bestPerMachineDayRoute = findBestPerMachineDayProcessingRoute(routes);
      const copy = createProcessingCopyTextLabels(locale);
      const conclusionLines = locale === "en"
        ? [
            "Most per item: Selling raw pays more",
            "Most per machine per day: Selling raw pays more",
          ]
        : [
            "单件最赚: 直接出售更划算",
            "每台机器每天最赚: 直接出售更划算",
          ];
      const copyText = createProcessingCopyText(
        form,
        ingredient,
        routes,
        "all",
        locale,
        locale === "en" ? "Compare three machines" : "三种机器比较",
        copy,
        conclusionLines,
      );

      expect(bestPerUnitRoute).toBeNull();
      expect(bestPerMachineDayRoute).toBeNull();
      expect(copyText).toContain(conclusionLines.join("\n"));
    },
  );

  it.each(["en", "zh-CN"] as const)(
    "omits both conclusions when copying a single keg route in %s",
    (locale) => {
      const form = createDefaultProcessingComparisonForm("keg-processing");
      const ingredient = getProcessingIngredient(form.ingredientId);
      const routes = calculateProcessingRoutes(form).filter((route) => route.machine === "keg");
      const copy = createProcessingCopyTextLabels(locale);
      const copyText = createProcessingCopyText(
        form,
        ingredient,
        routes,
        "keg",
        locale,
        locale === "en" ? "Keg processing" : "Keg 加工",
        copy,
      );

      expect(routes).toHaveLength(1);
      expect(copyText).not.toMatch(/^Most per item:|^Most per machine per day:/m);
      expect(copyText).not.toMatch(/^单件最赚:|^每台机器每天最赚:/m);
    },
  );
});

describe("processing comparison tool", () => {
  it.each(["en", "zh-CN"] as const)(
    "renders one grouped route-details disclosure after rows and cards in %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
      );
      const machines = ["keg", "jar", "dehydrator"] as const;
      const detailsLabel = locale === "en" ? "Calculation details" : "计算明细";
      const inputUnitsLabel = locale === "en" ? "Input units per batch" : "每批消耗原料";

      expect(getMachineRows(markup)).toEqual(machines);
      for (const machine of machines) {
        expect(getMachineRowMarkup(markup, machine)).not.toContain("<details");
        expect(getMachineCardMarkup(markup, machine)).not.toContain("<details");
      }

      expect([...markup.matchAll(/data-route-details-section="true"/g)]).toHaveLength(1);
      const detailsSection = getElementMarkupByAttribute(markup, "data-route-details-section", "true");
      expect(detailsSection.match(/<details\b/g)).toHaveLength(1);
      expect(detailsSection).toContain(`<summary>${detailsLabel}</summary>`);
      const lastMachineCard = getMachineCardMarkup(markup, "dehydrator");
      expect(markup.indexOf(detailsSection)).toBeGreaterThan(
        markup.indexOf(lastMachineCard) + lastMachineCard.length - 1,
      );
      const calculationExplanation = locale === "en"
        ? "Final value = processed value + raw remainder value. Added value compares that final value with selling the full stack raw."
        : "最终价值 = 加工成品价值 + 原料余量价值。增值是最终价值减去整批原料直接出售价值。";
      expect(markup.indexOf(calculationExplanation)).toBeGreaterThan(
        markup.indexOf(detailsSection) + detailsSection.length - 1,
      );

      let previousMachineIndex = -1;
      for (const machine of machines) {
        expect(
          [...detailsSection.matchAll(new RegExp(`data-route-details-machine="${machine}"`, "g"))],
        ).toHaveLength(1);
        const machineDetails = getElementMarkupByAttribute(
          detailsSection,
          "data-route-details-machine",
          machine,
        );
        const machineIndex = detailsSection.indexOf(`data-route-details-machine="${machine}"`);
        expect(machineIndex).toBeGreaterThan(previousMachineIndex);
        expect(machineDetails).toContain(inputUnitsLabel);
        previousMachineIndex = machineIndex;
      }
    },
  );

  it.each(["en", "zh-CN"] as const)(
    "orders basic settings, comparison results, and capacity settings in %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
      );
      const basicSettings = getElementMarkupByAttribute(markup, "data-settings-group", "basic");
      const capacitySettings = getElementMarkupByAttribute(markup, "data-settings-group", "capacity");
      const resultsPanel = getElementMarkupByAttribute(
        markup,
        "aria-labelledby",
        "processing-comparison-results-title",
      );
      const modeLabels = locale === "en"
        ? ["Full-stock value", "By machines and days"]
        : ["全部加工收益", "按机器与天数"];
      const capacityBasis = locale === "en"
        ? "Calculated with Keg ×1, Preserves Jar ×1, Dehydrator ×1 over a 7-day window."
        : "当前按Keg 1 台、罐头瓶 1 台、烘干机 1 台，加工期限 7 天计算。";

      expect([...markup.matchAll(/data-settings-group="basic"/g)]).toHaveLength(1);
      expect([...markup.matchAll(/data-settings-group="capacity"/g)]).toHaveLength(1);
      expect(basicSettings).toContain('id="processing-comparison-ingredient"');
      expect(basicSettings).toContain(locale === "en" ? "Blueberry" : "蓝莓");
      expect(basicSettings).toMatch(
        /<input\b(?=[^>]*id="processing-comparison-quantity")(?=[^>]*value="20")[^>]*>/,
      );
      expect(getButtonTexts(basicSettings)).not.toContain(modeLabels[0]);
      expect(getButtonTexts(basicSettings)).not.toContain(modeLabels[1]);

      const capacityButtons = getButtonTexts(capacitySettings);
      expect(capacityButtons).toContain(modeLabels[0]);
      expect(capacityButtons).toContain(modeLabels[1]);
      expect(capacitySettings).toMatch(
        new RegExp(
          `<button\\b(?=[^>]*aria-pressed="true")[^>]*>\\s*${escapeRegExp(modeLabels[1])}\\s*<\\/button>`,
        ),
      );
      for (const machine of ["keg", "jar", "dehydrator"] as const) {
        expect(capacitySettings).toMatch(
          new RegExp(
            `<input\\b(?=[^>]*id="processing-comparison-${machine}-count")(?=[^>]*value="1")[^>]*>`,
          ),
        );
      }
      expect(capacitySettings).toContain('id="processing-comparison-deadline"');
      expect(resultsPanel).toContain('data-processing-conclusion="per-unit"');
      expect(resultsPanel).toContain('data-processing-conclusion="per-machine-day"');
      expect(resultsPanel).toContain(capacityBasis);

      const basicIndex = markup.indexOf('data-settings-group="basic"');
      const resultsIndex = markup.indexOf('aria-labelledby="processing-comparison-results-title"');
      const capacityIndex = markup.indexOf('data-settings-group="capacity"');
      expect(basicIndex).toBeLessThan(resultsIndex);
      expect(resultsIndex).toBeLessThan(capacityIndex);
    },
  );

  it.each(["en", "zh-CN"] as const)(
    "shows the desktop per-machine-day value after added value in %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
      );
      const tableHeader = markup.match(/<thead\b[^>]*>[\s\S]*?<\/thead>/)?.[0];
      if (tableHeader === undefined) {
        throw new Error("Rendered comparison table header was not found.");
      }
      const tableHeaderLabels = [...tableHeader.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map(
        (match) => match[1].replace(/<[^>]+>/g, "").trim(),
      );
      const addedValueLabel = locale === "en" ? "Added value" : "增值";
      const machineDayLabel = locale === "en" ? "Added value per machine day" : "每机器加工日增值";
      const expectedValues = locale === "en"
        ? { dehydrator: "150g", keg: "14.29g" }
        : { dehydrator: "150 金币", keg: "14.29 金币" };

      expect(tableHeaderLabels.indexOf(machineDayLabel)).toBeGreaterThan(
        tableHeaderLabels.indexOf(addedValueLabel),
      );
      expect(getMachineRowCellTexts(markup, "dehydrator")).toHaveLength(5);
      expect(getMachineRowCellTexts(markup, "dehydrator")[4]).toBe(expectedValues.dehydrator);
      expect(getMachineRowCellTexts(markup, "keg")).toHaveLength(5);
      expect(getMachineRowCellTexts(markup, "keg")[4]).toBe(expectedValues.keg);
    },
  );

  it.each(["en", "zh-CN"] as const)(
    "keeps grouped route details and both settings groups on the keg route in %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        <ProcessingComparisonTool locale={locale} toolId="keg-processing" />,
      );
      const detailsLabel = locale === "en" ? "Calculation details" : "计算明细";
      const inputUnitsLabel = locale === "en" ? "Input units per batch" : "每批消耗原料";
      const detailsSection = getElementMarkupByAttribute(markup, "data-route-details-section", "true");

      expect(getMachineRows(markup)).toEqual(["keg"]);
      expect(getMachineRowMarkup(markup, "keg")).not.toContain("<details");
      expect(getMachineCardMarkup(markup, "keg")).not.toContain("<details");
      expect([...markup.matchAll(/data-route-details-section="true"/g)]).toHaveLength(1);
      expect(detailsSection.match(/<details\b/g)).toHaveLength(1);
      expect(detailsSection).toContain(`<summary>${detailsLabel}</summary>`);
      expect(
        [...detailsSection.matchAll(/data-route-details-machine="([^"]+)"/g)].map((match) => match[1]),
      ).toEqual(["keg"]);
      expect(getElementMarkupByAttribute(detailsSection, "data-route-details-machine", "keg"))
        .toContain(inputUnitsLabel);
      expect([...markup.matchAll(/data-settings-group="basic"/g)]).toHaveLength(1);
      expect([...markup.matchAll(/data-settings-group="capacity"/g)]).toHaveLength(1);
      expect(getElementMarkupByAttribute(markup, "data-settings-group", "basic"))
        .toContain('id="processing-comparison-ingredient"');
      expect(getElementMarkupByAttribute(markup, "data-settings-group", "capacity"))
        .toContain('id="processing-comparison-keg-count"');
    },
  );

  it.each(["en", "zh-CN"] as const)("renders an accessible shared workspace in %s", (locale) => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
    );

    expect(markup).toContain('data-processing-comparison-tool="true"');
    expect(markup).toMatch(/<h2\b[^>]*id="processing-comparison-page-title"/);
    expect(markup).toMatch(/<label\b[^>]*for="processing-comparison-ingredient"/);
    expect(markup).toMatch(
      /<button\b(?=[^>]*id="processing-comparison-ingredient")(?=[^>]*role="combobox")[^>]*>/,
    );
    expect(markup).toMatch(/aria-labelledby="processing-comparison-ingredient-label"/);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('data-machine="keg"');
    expect(markup).toContain('data-machine="jar"');
    expect(markup).toContain('data-machine="dehydrator"');
    expect(markup).toContain('aria-describedby="processing-comparison-plan-note"');
    expect(markup).toContain('aria-describedby="processing-comparison-mobile-plan-note"');
  });

  it.each(toolIds)("filters the result table for %s without changing the shared form defaults", (toolId) => {
    const markup = renderToStaticMarkup(<ProcessingComparisonTool locale="en" toolId={toolId} />);
    const rows = getMachineRows(markup);

    if (toolId === "keg-processing") {
      expect(rows).toEqual(["keg"]);
    } else if (toolId === "preserves-jar-processing") {
      expect(rows).toEqual(["jar"]);
    } else if (toolId === "dehydrator-processing") {
      expect(rows).toEqual(["dehydrator"]);
    } else {
      expect(rows).toEqual(["keg", "jar", "dehydrator"]);
    }
    expect(markup).toContain('id="processing-comparison-quantity"');
  });

  it("shows per-route timing and raw-remainder explanations in both locales", () => {
    const englishMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );
    const chineseMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="zh-CN" toolId="machine-comparison" />,
    );

    expect(englishMarkup).toContain("Processing minutes are in-game minutes.");
    expect(englishMarkup).toContain("Added value per machine day divides");
    expect(englishMarkup).toContain("unprocessed units remain valued at their raw sale price");
    expect(chineseMarkup).toContain("加工分钟是游戏内分钟");
    expect(chineseMarkup).toContain("每机器加工日增值 = 一个配方批次的增值");
    expect(chineseMarkup).toContain("未加工原料按直接售价保留价值");
  });

  it.each([
    ["en", "basic-processing-profit", "Compare how much more this stack earns after processing than by selling it raw"],
    ["en", "machine-comparison", "Capacity estimates use your machine counts and processing window"],
    ["en", "keg-processing", "Focus on Kegs for this stack. Capacity estimates use the assigned Keg count"],
    ["en", "preserves-jar-processing", "Focus on Preserves Jars for this stack. Capacity estimates use the assigned Jar count"],
    ["en", "dehydrator-processing", "Focus on Dehydrators for this stack. Capacity estimates use the assigned Dehydrator count"],
    ["zh-CN", "basic-processing-profit", "比较这批原料加工后比直接出售多赚多少"],
    ["zh-CN", "machine-comparison", "按机器产能估算时会使用机器数量与加工天数"],
    ["zh-CN", "keg-processing", "重点查看这批原料的 Keg 结果"],
    ["zh-CN", "preserves-jar-processing", "重点查看这批原料的罐头瓶结果"],
    ["zh-CN", "dehydrator-processing", "重点查看这批原料的烘干机结果"],
  ] as const)("describes the actual %s %s task", (locale, toolId, taskDescription) => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale={locale} toolId={toolId} />,
    );

    expect(markup).toContain(taskDescription);
    if (toolId === "basic-processing-profit") {
      expect(markup).toContain(
        locale === "en"
          ? "Each machine route uses the same stack independently, so route results should not be added together."
          : "各机器独立使用同一批原料，结果不能相加。",
      );
    } else {
      expect(markup).toContain(locale === "en" ? "Full-stock value" : "“全部加工收益”");
    }
    if (toolId !== "machine-comparison" && toolId !== "basic-processing-profit") {
      expect(markup).not.toContain(
        locale === "en"
          ? "Compare the same ingredient stack across Kegs, Preserves Jars, and Dehydrators"
          : "用同一批原料比较 Keg、罐头瓶与烘干机",
      );
    }
  });

  it("labels both estimate modes and shows their matching result headings", () => {
    const unlimitedEnglish = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="basic-processing-profit" />,
    );
    const capacityEnglish = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );
    const unlimitedChinese = renderToStaticMarkup(
      <ProcessingComparisonTool locale="zh-CN" toolId="basic-processing-profit" />,
    );
    const capacityChinese = renderToStaticMarkup(
      <ProcessingComparisonTool locale="zh-CN" toolId="machine-comparison" />,
    );

    expect(unlimitedEnglish).toContain("Full-stock value");
    expect(unlimitedEnglish).toContain("Estimate with complete batches, independent of machine counts and the processing window.");
    expect(unlimitedEnglish).toContain("Items without a recipe or not enough to fill a batch keep their raw-sale value.");
    expect(unlimitedEnglish).toContain("Value after processing all stock");
    expect(unlimitedEnglish).not.toContain("data-capacity-basis");
    expect(capacityEnglish).toContain("By machines and days");
    expect(capacityEnglish).toContain("Results within your processing window");
    expect(capacityEnglish.match(/Assumes finished goods are collected and machines are refilled once each morning/g))
      .toHaveLength(2);

    expect(unlimitedChinese).toContain("全部加工收益");
    expect(unlimitedChinese).toContain("按完整批次估算，不受机器数量与期限限制；无法加工或不足一批的原料按直接售价计入。");
    expect(unlimitedChinese).toContain("全部加工后的收益");
    expect(unlimitedChinese).not.toContain("data-capacity-basis");
    expect(capacityChinese).toContain("按机器与天数");
    expect(capacityChinese).toContain("所选天数内的加工结果");
    expect(capacityChinese.match(/假设每天早晨收取成品并为机器补料一次/g)).toHaveLength(2);
  });

  it("shows editable deadline and machine counts only for capacity mode", () => {
    const unlimitedMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="basic-processing-profit" />,
    );
    const capacityMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );

    expect(unlimitedMarkup).not.toContain('id="processing-comparison-deadline"');
    expect(unlimitedMarkup).not.toContain('id="processing-comparison-keg-count"');
    expect(unlimitedMarkup).not.toContain('id="processing-comparison-jar-count"');
    expect(unlimitedMarkup).not.toContain('id="processing-comparison-dehydrator-count"');
    expect(capacityMarkup).toContain('id="processing-comparison-deadline"');
    expect(capacityMarkup).toContain('id="processing-comparison-keg-count"');
    expect(capacityMarkup).toContain('id="processing-comparison-jar-count"');
    expect(capacityMarkup).toContain('id="processing-comparison-dehydrator-count"');
  });

  it("uses the current tool route as the visible page heading", () => {
    const expectedTitles = {
      en: "Compare three machines",
      "zh-CN": "三种机器比较",
    } as const;

    for (const locale of ["en", "zh-CN"] as const) {
      const markup = renderToStaticMarkup(
        <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
      );
      const heading = markup.match(/<h2\b[^>]*id="processing-comparison-page-title">([^<]+)<\/h2>/)?.[1];
      expect(heading).toBe(expectedTitles[locale]);
    }
  });

  it.each(["en", "zh-CN"] as const)("renders no navigation in the %s comparison workspace", (locale) => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
    );

    expect(markup).not.toMatch(/<nav\b/);
  });

  it("preserves inputs when the comparison mode changes", () => {
    const customForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      ingredientId: "strawberry",
      quantity: 73,
      quality: "gold" as const,
      profession: "artisan" as const,
      deadlineDays: 28,
      machineCounts: { keg: 4, jar: 3, dehydrator: 2 },
    };
    const changedMachineCount = updateProcessingComparisonNumericValue(customForm, "keg", 6);

    expect(changedMachineCount).toEqual({
      ...customForm,
      machineCounts: { keg: 6, jar: 3, dehydrator: 2 },
    });

    const unlimitedForm = updateProcessingComparisonMode(changedMachineCount, "unlimited");

    expect(unlimitedForm).toEqual({ ...changedMachineCount, mode: "unlimited" });
    expect(updateProcessingComparisonMode(unlimitedForm, "capacity")).toEqual(changedMachineCount);
  });

  it("ignores hidden machine-count errors in unlimited mode and restores capacity validation", () => {
    const capacityForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      machineCounts: { keg: 4, jar: 3, dehydrator: 2 },
    };
    const unlimitedForm = updateProcessingComparisonMode(capacityForm, "unlimited");
    const invalidJarDraft = { jar: "Jar count must be a non-negative safe integer. Received: \"-1\"." };
    const invalidQuantityDraft = { quantity: "Quantity must be a non-negative safe integer. Received: \"oops\"." };

    expect(getProcessingComparisonRoutes(unlimitedForm, invalidJarDraft)).not.toBeNull();
    expect(getProcessingComparisonRoutes(unlimitedForm, invalidQuantityDraft)).toBeNull();
    expect(getProcessingComparisonRoutes(capacityForm, invalidJarDraft, "keg")).not.toBeNull();
    expect(getProcessingComparisonRoutes(capacityForm, invalidJarDraft, "all")).toBeNull();
    expect(updateProcessingComparisonMode(unlimitedForm, "capacity")).toEqual(capacityForm);
    expect(capacityForm.machineCounts).toEqual({ keg: 4, jar: 3, dehydrator: 2 });
  });

  it("resets a quality unsupported by the selected ingredient and preserves supported quality", () => {
    const goldQualityForm = {
      ...createDefaultProcessingComparisonForm("machine-comparison"),
      quality: "gold" as const,
    };

    expect(updateProcessingComparisonIngredient(goldQualityForm, "blackberry")).toMatchObject({
      ingredientId: "blackberry",
      quality: "normal",
    });
    expect(updateProcessingComparisonIngredient(goldQualityForm, "blackberry-cave")).toMatchObject({
      ingredientId: "blackberry-cave",
      quality: "gold",
    });
  });

  it("keeps every route at raw value and recommends raw sale when all capacity is zero", () => {
    const zeroCapacityForm = updateProcessingComparisonNumericValue(
      updateProcessingComparisonNumericValue(
        updateProcessingComparisonNumericValue(
          createDefaultProcessingComparisonForm("machine-comparison"),
          "keg",
          0,
        ),
        "jar",
        0,
      ),
      "dehydrator",
      0,
    );
    const routes = getProcessingComparisonRoutes(zeroCapacityForm, {});

    expect(routes).not.toBeNull();
    expect(routes?.every((route) => route.processedUnits === 0 && route.valueAdded === 0)).toBe(true);
    expect(findBestProcessingRoute(routes ?? [])).toBeNull();
  });

  it.each(["en", "zh-CN"] as const)("renders both route conclusions and badges in %s", (locale) => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale={locale} toolId="machine-comparison" />,
    );

    expect(markup).toContain('data-processing-conclusion="per-unit"');
    expect(markup).toContain('data-processing-conclusion="per-machine-day"');
    expect(markup).toContain(locale === "en" ? "Preserves Jar" : "罐头瓶");
    expect(markup).toContain(locale === "en" ? "Dehydrator" : "烘干机");
    expect(markup).toContain(locale === "en" ? "Most per item" : "单件最赚");
    expect(markup).toContain(locale === "en" ? "Most per machine per day" : "每台机器每天最赚");
    expect(markup).not.toContain(locale === "en" ? "Current best route" : "当前建议路线");
    expect(markup).not.toContain(locale === "en" ? "Added value vs. raw sale" : "相对直接出售的增值");
    expect(markup).toContain(locale === "en" ? "Raw-sale baseline" : "直接出售基准");

    const jarRow = getMachineRowMarkup(markup, "jar");
    const dehydratorRow = getMachineRowMarkup(markup, "dehydrator");
    const kegRow = getMachineRowMarkup(markup, "keg");
    expect(jarRow).toContain('data-route-badge="per-unit"');
    expect(dehydratorRow).toContain('data-route-badge="per-machine-day"');
    expect(kegRow).not.toContain("data-route-badge");
    for (const machine of getMachineRows(markup)) {
      expect(getMachineRowOpenTag(markup, machine)).not.toMatch(/class="[^"]*bestRouteRow/);
    }
  });

  it("shows the capacity calculation basis for every visible comparison machine", () => {
    const englishMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );
    const chineseMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="zh-CN" toolId="machine-comparison" />,
    );

    expect(englishMarkup).toContain('data-capacity-basis="true"');
    expect(englishMarkup).toContain(
      "Calculated with Keg ×1, Preserves Jar ×1, Dehydrator ×1 over a 7-day window.",
    );
    expect(chineseMarkup).toContain('data-capacity-basis="true"');
    expect(chineseMarkup).toContain("当前按Keg 1 台、罐头瓶 1 台、烘干机 1 台，加工期限 7 天计算。");
  });

  it("keeps the single-route recommendation and capacity basis unchanged", () => {
    const englishMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="keg-processing" />,
    );
    const chineseMarkup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="zh-CN" toolId="keg-processing" />,
    );

    expect(englishMarkup).toContain("Current best route");
    expect(englishMarkup).not.toContain("data-processing-conclusion");
    expect(englishMarkup).toContain("Added value vs. raw sale");
    expect(englishMarkup).toContain("Raw-sale baseline");
    expect(englishMarkup).toContain('data-capacity-basis="true"');
    expect(englishMarkup).toContain("Calculated with Keg ×1 over a 7-day window.");
    expect(getMachineRowOpenTag(englishMarkup, "keg")).toMatch(/class="[^"]*bestRouteRow/);

    expect(chineseMarkup).toContain("当前建议路线");
    expect(chineseMarkup).not.toContain("data-processing-conclusion");
    expect(chineseMarkup).toContain("相对直接出售的增值");
    expect(chineseMarkup).toContain("直接出售基准");
    expect(chineseMarkup).toContain("当前按Keg 1 台，加工期限 7 天计算。");
    expect(getMachineRowOpenTag(chineseMarkup, "keg")).toMatch(/class="[^"]*bestRouteRow/);
  });

  it("hides computed routes while an invalid numeric draft is active", () => {
    const form = createDefaultProcessingComparisonForm("machine-comparison");
    let fieldError = "";
    try {
      parseProcessingComparisonNonNegativeInteger("1.5", "Quantity");
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      fieldError = error.message;
    }

    expect(fieldError).toContain('Received: "1.5"');
    expect(getProcessingComparisonRoutes(form, { quantity: fieldError })).toBeNull();
  });

  it("returns readable feedback for clipboard failures and rethrows unknown errors", () => {
    const clipboardError = new Error('Clipboard write failed. Received: "permission-denied".');

    expect(readProcessingClipboardFailure(clipboardError, "Copy failed; copy manually.")).toContain(
      "Copy failed; copy manually. Clipboard write failed.",
    );
    expect(() => readProcessingClipboardFailure(new Error("Unexpected failure"), "Copy failed.")).toThrow(
      "Unexpected failure",
    );
  });

  it("retains the generated results text for manual copying only on known clipboard failures", () => {
    const copyText = "Blueberry results\nKeg: 280g";
    const recovery = createProcessingClipboardRecovery(
      new Error('Clipboard write failed. Received: "permission-denied".'),
      copyText,
      "Copy failed. Select and copy manually.",
    );

    expect(recovery).toEqual({
      copyText,
      message: 'Copy failed. Select and copy manually. Clipboard write failed. Received: "permission-denied".',
    });
    expect(() => createProcessingClipboardRecovery(
      new Error("Unexpected code failure"),
      copyText,
      "Copy failed.",
    )).toThrow("Unexpected code failure");
  });

  it("does not render a reset action or manual-copy field before a recovery is needed", () => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );

    expect(markup).not.toContain("Reset this tool");
    expect(markup).not.toContain('id="processing-comparison-manual-copy"');
  });
});
