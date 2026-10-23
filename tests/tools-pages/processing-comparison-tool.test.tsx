import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { listProcessingIngredients } from "../../src/processing-tools/processing-model";
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

describe("processing comparison tool", () => {
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
    expect(capacityEnglish).toContain("By machines and days");
    expect(capacityEnglish).toContain("Results within your processing window");
    expect(capacityEnglish.match(/Assumes finished goods are collected and machines are refilled once each morning/g))
      .toHaveLength(2);

    expect(unlimitedChinese).toContain("全部加工收益");
    expect(unlimitedChinese).toContain("按完整批次估算，不受机器数量与期限限制；无法加工或不足一批的原料按直接售价计入。");
    expect(unlimitedChinese).toContain("全部加工后的收益");
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

  it("highlights the calculated best route row instead of always highlighting the first row", () => {
    const markup = renderToStaticMarkup(
      <ProcessingComparisonTool locale="en" toolId="machine-comparison" />,
    );
    const dehydratorRow = getMachineRowOpenTag(markup, "dehydrator");
    const kegRow = getMachineRowOpenTag(markup, "keg");

    expect(dehydratorRow).toMatch(/class="[^"]*bestRouteRow/);
    expect(kegRow).not.toMatch(/class="[^"]*bestRouteRow/);
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
