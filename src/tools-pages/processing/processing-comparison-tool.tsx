"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicLocale } from "../../i18n/public-locale";
import { copyToolText } from "../copy-tool-text";
import {
  isBrowserStorageFailure,
  removeBrowserToolStorage,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import {
  calculateProcessingRoutes,
  getProcessingIngredient,
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
  listProcessingIngredients,
  type ProcessingCoconutSource,
  type ProcessingIngredient,
  type ProcessingMachine,
  type ProcessingMode,
  type ProcessingProfession,
  type ProcessingQuality,
  type ProcessingRouteQuote,
} from "../../processing-tools/processing-model";
import {
  createDefaultProcessingComparisonForm,
  isProcessingComparisonFormValidationFailure,
  isProcessingComparisonNumericInputFailure,
  loadProcessingComparisonFormWithRecovery,
  parseProcessingComparisonNonNegativeInteger,
  processingComparisonStorageKey,
  serializeProcessingComparisonForm,
  updateProcessingComparisonIngredient,
  updateProcessingComparisonCoconutSource,
  updateProcessingComparisonMode,
  updateProcessingComparisonNumericValue,
  type ProcessingComparisonForm,
  type ProcessingComparisonNumericField,
} from "./processing-comparison-form";
import type { ProcessingComparisonToolId } from "./processing-tool-definition";
import { PlantingSelect, type PlantingSelectOption } from "../planting-select";
import styles from "./processing-comparison-tool.module.css";

type ProcessingComparisonToolProperties = Readonly<{
  locale: PublicLocale;
  toolId: ProcessingComparisonToolId;
}>;

type ProcessingRouteFilter = ProcessingMachine | "all";
export type ProcessingComparisonFieldMessages = Partial<Record<ProcessingComparisonNumericField, string>>;
type SaveStatus = "loading" | "saved" | "failed";
type CopyStatus = Readonly<{ message: string; failed: boolean }> | null;

type ProcessingComparisonCopy = Readonly<{
  descriptions: Readonly<Record<ProcessingComparisonToolId, string>>;
  settingsTitle: string;
  resultsTitles: Readonly<Record<ProcessingMode, string>>;
  inputLabels: Readonly<{
    ingredient: string;
    quantity: string;
    quality: string;
    profession: string;
    mode: string;
    deadline: string;
    machineView: string;
    machineCounts: Readonly<Record<ProcessingMachine, string>>;
  }>;
  qualities: Readonly<Record<ProcessingQuality, string>>;
  professions: Readonly<Record<ProcessingProfession, string>>;
  modes: Readonly<Record<ProcessingMode, string>>;
  modeDescriptions: Readonly<Record<ProcessingMode, string>>;
  capacityAssumption: string;
  bearsKnowledgeLabel: string;
  bearsKnowledgeDescription: string;
  bearsKnowledgeEnabled: string;
  bearsKnowledgeDisabled: string;
  coconutSourceLabel: string;
  coconutSourceDescription: string;
  coconutSources: Readonly<Record<ProcessingCoconutSource, string>>;
  qualityResetReason: string;
  deadlines: Readonly<Record<7 | 14 | 28, string>>;
  machineNames: Readonly<Record<ProcessingMachine, string>>;
  allMachines: string;
  compareWithOtherMachines: string;
  unsupportedRouteLabel: string;
  qualityUnavailable: string;
  tillerNote: string;
  tillerUnavailable: string;
  rawArtisanNote: string;
  bestRoute: string;
  sellRawRecommendation: string;
  valueAdded: string;
  rawSaleValue: string;
  independentRoutes: string;
  routeColumn: string;
  cycleColumn: string;
  completedLeftoverColumn: string;
  finalValueColumn: string;
  addedValueColumn: string;
  processed: string;
  leftoverRaw: string;
  machineDayValue: string;
  details: string;
  inputPerBatch: string;
  processingMinutes: string;
  processingMornings: string;
  machineCount: string;
  rawUnitPrice: string;
  batchOutputPrice: string;
  processedBatches: string;
  processedValue: string;
  leftoverValue: string;
  recipeNotSupported: string;
  zeroMachineNote: string;
  noCompleteBatchNote: string;
  noBatchBeforeDeadline: string;
  calculationExplanation: string;
  minutesAndMorningsExplanation: string;
  machineDayExplanation: string;
  planButton: string;
  planUnavailable: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  saveLoading: string;
  saveSuccess: string;
  saveFailure: string;
  invalidDraft: string;
  invalidSavedSettingsRecovery: string;
  resetSavedSettings: string;
  manualCopyTextLabel: string;
  noRoutes: string;
  assumptions: string;
  modeLabel: string;
  deadlineLabel: string;
  machineCountsLabel: string;
}>;

const processingComparisonCopy: Readonly<Record<PublicLocale, ProcessingComparisonCopy>> = {
  en: {
    descriptions: {
      "basic-processing-profit":
        "Compare how much more this stack earns after processing than by selling it raw. Each machine route uses the same stack independently, so route results should not be added together.",
      "machine-comparison":
        "Compare the Keg, Preserves Jar, and Dehydrator results for one stack. Capacity estimates use your machine counts and processing window; Full-stock value ignores those limits.",
      "keg-processing":
        "Focus on Kegs for this stack. Capacity estimates use the assigned Keg count and processing window; Full-stock value ignores those limits. Use the “Compare with other machines” filter to see other routes.",
      "preserves-jar-processing":
        "Focus on Preserves Jars for this stack. Capacity estimates use the assigned Jar count and processing window; Full-stock value ignores those limits. Use the “Compare with other machines” filter to see other routes.",
      "dehydrator-processing":
        "Focus on Dehydrators for this stack. Capacity estimates use the assigned Dehydrator count and processing window; Full-stock value ignores those limits. Use the “Compare with other machines” filter to see other routes.",
    },
    settingsTitle: "Ingredient and route settings",
    resultsTitles: {
      unlimited: "Value after processing all stock",
      capacity: "Results within your processing window",
    },
    inputLabels: {
      ingredient: "Raw ingredient",
      quantity: "Quantity",
      quality: "Quality",
      profession: "Profession",
      mode: "Estimate mode",
      deadline: "Processing window",
      machineView: "Show routes",
      machineCounts: {
        keg: "Kegs",
        jar: "Preserves Jars",
        dehydrator: "Dehydrators",
      },
    },
    qualities: {
      normal: "Normal",
      silver: "Silver",
      gold: "Gold",
      iridium: "Iridium",
    },
    professions: {
      none: "No profession bonus",
      tiller: "Tiller",
      artisan: "Artisan",
    },
    modes: {
      unlimited: "Full-stock value",
      capacity: "By machines and days",
    },
    modeDescriptions: {
      unlimited:
        "Estimate with complete batches, independent of machine counts and the processing window. Items without a recipe or not enough to fill a batch keep their raw-sale value.",
      capacity:
        "Estimate what the selected machines can finish within the chosen number of days. Stock is ready at the start, and a 7-day cycle finishes within a 7-day window. Each route uses the full stack independently.",
    },
    capacityAssumption:
      "Assumes finished goods are collected and machines are refilled once each morning; exact within-day timing is not modeled.",
    bearsKnowledgeLabel: "Bear's Knowledge",
    bearsKnowledgeDescription:
      "For eligible berries, this changes raw-sale value only; processed product prices stay the same.",
    bearsKnowledgeEnabled: "On",
    bearsKnowledgeDisabled: "Off",
    coconutSourceLabel: "Coconut source",
    coconutSources: {
      foraged: "Foraged",
      "purchased-or-gifted": "Purchased or gifted",
    },
    coconutSourceDescription:
      "Tiller changes the raw-sale value for purchased or gifted coconuts, not foraged coconuts.",
    qualityResetReason:
      "This ingredient does not support the previous quality, so it was reset to Normal.",
    deadlines: {
      7: "7 days",
      14: "14 days",
      28: "28 days",
    },
    machineNames: {
      keg: "Keg",
      jar: "Preserves Jar",
      dehydrator: "Dehydrator",
    },
    allMachines: "All machines",
    compareWithOtherMachines: "Compare with other machines",
    unsupportedRouteLabel: "No recipe",
    qualityUnavailable: "This ingredient has no quality tiers; Normal quality is used.",
    tillerNote: "Tiller changes raw sale value only for eligible ingredients.",
    tillerUnavailable: "Tiller does not change this ingredient's raw sale value.",
    rawArtisanNote: "For this honey, Artisan also changes the raw-sale baseline.",
    bestRoute: "Current best route",
    sellRawRecommendation: "Sell the stack raw",
    valueAdded: "Added value vs. raw sale",
    rawSaleValue: "Raw-sale baseline",
    independentRoutes:
      "Each machine row uses the same input stack independently. Do not add the route values together; unprocessed units remain valued at their raw sale price.",
    routeColumn: "Machine and product",
    cycleColumn: "Cycle",
    completedLeftoverColumn: "Processed / raw left",
    finalValueColumn: "Final value",
    addedValueColumn: "Added value",
    processed: "Processed",
    leftoverRaw: "Raw left",
    machineDayValue: "Added value per machine day",
    details: "Calculation details",
    inputPerBatch: "Input units per batch",
    processingMinutes: "Processing time (game minutes)",
    processingMornings: "Processing mornings",
    machineCount: "Machines assigned",
    rawUnitPrice: "Raw price per unit",
    batchOutputPrice: "Output price per batch",
    processedBatches: "Completed batches",
    processedValue: "Processed value",
    leftoverValue: "Raw remainder value",
    recipeNotSupported: "This ingredient has no recipe for this machine; its full raw value is kept.",
    zeroMachineNote: "No machines are assigned, so the full stack keeps its raw-sale value.",
    noCompleteBatchNote: "There is not enough quantity to fill one complete batch; the stack keeps its raw-sale value.",
    noBatchBeforeDeadline: "A complete batch will not finish within this window; the stack keeps its raw-sale value.",
    calculationExplanation:
      "Final value = processed value + raw remainder value. Added value compares that final value with selling the full stack raw.",
    minutesAndMorningsExplanation:
      "Processing minutes are in-game minutes. Kegs and Preserves Jars take ceil(minutes ÷ 1,600) mornings; a Dehydrator batch is ready the next morning.",
    machineDayExplanation:
      "Added value per machine day divides one recipe batch's added value by one active machine's cycle mornings; idle days in the selected window are excluded.",
    planButton: "Send to production plan",
    planUnavailable: "Production planning is not available yet.",
    copyButton: "Copy results and assumptions",
    copied: "Results and assumptions copied.",
    copyFailed: "Copy failed. Select and copy the result text manually.",
    saveLoading: "Loading this browser's saved settings…",
    saveSuccess: "Settings saved in this browser.",
    saveFailure: "Browser settings could not be saved.",
    invalidDraft: "Fix the highlighted value to refresh the route results.",
    invalidSavedSettingsRecovery: " The saved value is unchanged. Use Reset this tool to restore its defaults.",
    resetSavedSettings: "Reset this tool",
    manualCopyTextLabel: "Copyable results text",
    noRoutes: "No supported route currently adds value over selling raw.",
    assumptions: "Assumptions",
    modeLabel: "Estimate mode",
    deadlineLabel: "Processing window",
    machineCountsLabel: "Machine counts",
  },
  "zh-CN": {
    descriptions: {
      "basic-processing-profit":
        "比较这批原料加工后比直接出售多赚多少；各机器独立使用同一批原料，结果不能相加。",
      "machine-comparison":
        "比较同一批原料的 Keg、罐头瓶与烘干机结果。按机器产能估算时会使用机器数量与加工天数；“全部加工收益”估算不受这两项限制。",
      "keg-processing":
        "重点查看这批原料的 Keg 结果。按机器产能估算时会使用 Keg 数量与加工天数；“全部加工收益”估算不受这两项限制。如需比较其他路线，可在筛选中选择「与其他机器比较」。",
      "preserves-jar-processing":
        "重点查看这批原料的罐头瓶结果。按机器产能估算时会使用罐头瓶数量与加工天数；“全部加工收益”估算不受这两项限制。如需比较其他路线，可在筛选中选择「与其他机器比较」。",
      "dehydrator-processing":
        "重点查看这批原料的烘干机结果。按机器产能估算时会使用烘干机数量与加工天数；“全部加工收益”估算不受这两项限制。如需比较其他路线，可在筛选中选择「与其他机器比较」。",
    },
    settingsTitle: "原料与路线设置",
    resultsTitles: {
      unlimited: "全部加工后的收益",
      capacity: "所选天数内的加工结果",
    },
    inputLabels: {
      ingredient: "原料",
      quantity: "数量",
      quality: "品质",
      profession: "职业",
      mode: "估算方式",
      deadline: "加工期限",
      machineView: "显示路线",
      machineCounts: {
        keg: "Keg 数量",
        jar: "罐头瓶数量",
        dehydrator: "烘干机数量",
      },
    },
    qualities: {
      normal: "普通",
      silver: "银星",
      gold: "金星",
      iridium: "铱星",
    },
    professions: {
      none: "无职业加成",
      tiller: "耕种者",
      artisan: "工匠",
    },
    modes: {
      unlimited: "全部加工收益",
      capacity: "按机器与天数",
    },
    modeDescriptions: {
      unlimited:
        "按完整批次估算，不受机器数量与期限限制；无法加工或不足一批的原料按直接售价计入。",
      capacity:
        "按当前机器数量与天数，估算期限内可完成的加工结果。原料可立即投料；7 天周期可在 7 天窗口内完成。每条路线都独立使用同一批原料。",
    },
    capacityAssumption: "假设每天早晨收取成品并为机器补料一次；不模拟早晨内的具体时刻。",
    bearsKnowledgeLabel: "熊的知识",
    bearsKnowledgeDescription: "仅影响适用浆果的直接售价，不改变加工成品售价。",
    bearsKnowledgeEnabled: "开启",
    bearsKnowledgeDisabled: "关闭",
    coconutSourceLabel: "椰子来源",
    coconutSources: {
      foraged: "采集",
      "purchased-or-gifted": "购买或礼赠",
    },
    coconutSourceDescription: "购买或礼赠的椰子适用耕种者直接售价加成，采集的椰子不适用。",
    qualityResetReason: "该原料不支持之前的品质，已重置为普通。",
    deadlines: {
      7: "7 天",
      14: "14 天",
      28: "28 天",
    },
    machineNames: {
      keg: "Keg",
      jar: "罐头瓶",
      dehydrator: "烘干机",
    },
    allMachines: "全部机器",
    compareWithOtherMachines: "与其他机器比较",
    unsupportedRouteLabel: "无配方",
    qualityUnavailable: "该原料没有品质档位，按普通品质计算。",
    tillerNote: "耕种者只会改变适用原料的直接售价。",
    tillerUnavailable: "耕种者不会改变该原料的直接售价。",
    rawArtisanNote: "该蜂蜜的工匠加成也会计入直接出售基准。",
    bestRoute: "当前建议路线",
    sellRawRecommendation: "直接出售整批原料",
    valueAdded: "相对直接出售的增值",
    rawSaleValue: "直接出售基准",
    independentRoutes:
      "每行都独立使用同一批原料，路线价值不能相加；未加工原料按直接售价保留价值。",
    routeColumn: "机器与产品",
    cycleColumn: "加工周期",
    completedLeftoverColumn: "已加工 / 原料余量",
    finalValueColumn: "最终价值",
    addedValueColumn: "增值",
    processed: "已加工",
    leftoverRaw: "原料余量",
    machineDayValue: "每机器加工日增值",
    details: "计算明细",
    inputPerBatch: "每批消耗原料",
    processingMinutes: "加工时间（游戏分钟）",
    processingMornings: "经历的早晨次数",
    machineCount: "分配机器数",
    rawUnitPrice: "原料单价",
    batchOutputPrice: "每批成品售价",
    processedBatches: "完成批次",
    processedValue: "加工成品价值",
    leftoverValue: "原料余量价值",
    recipeNotSupported: "该机器没有此原料的配方，整批保留直接出售价值。",
    zeroMachineNote: "没有分配机器，整批原料保留直接出售价值。",
    noCompleteBatchNote: "数量不足以装满一个批次，原料保留直接出售价值。",
    noBatchBeforeDeadline: "所选期限内无法完成一个批次，原料保留直接出售价值。",
    calculationExplanation:
      "最终价值 = 加工成品价值 + 原料余量价值。增值是最终价值减去整批原料直接出售价值。",
    minutesAndMorningsExplanation:
      "加工分钟是游戏内分钟。Keg 和罐头瓶耗时为 ceil(分钟 ÷ 1,600) 个早晨；烘干机批次在次日早晨完成。",
    machineDayExplanation:
      "每机器加工日增值 = 一个配方批次的增值 ÷ 单台机器完成该周期所经历的早晨次数；不计期限内的空闲日。",
    planButton: "转入生产计划",
    planUnavailable: "生产排程暂未开放。",
    copyButton: "复制结果与假设",
    copied: "已复制结果与假设。",
    copyFailed: "复制失败，请手动选择并复制结果文本。",
    saveLoading: "正在读取本机保存设置…",
    saveSuccess: "设置已保存在此浏览器。",
    saveFailure: "无法保存浏览器设置。",
    invalidDraft: "请修正标记的数值后查看最新路线结果。",
    invalidSavedSettingsRecovery: "已保留原保存内容。点击“重置此工具设置”即可恢复默认值。",
    resetSavedSettings: "重置此工具设置",
    manualCopyTextLabel: "可手动复制的结果文本",
    noRoutes: "当前没有比直接出售更有增值的受支持路线。",
    assumptions: "计算假设",
    modeLabel: "估算方式",
    deadlineLabel: "加工天数",
    machineCountsLabel: "机器数量",
  },
};

const processingMachineOrder: readonly ProcessingMachine[] = ["keg", "jar", "dehydrator"];

function getMachineFilterForTool(toolId: ProcessingComparisonToolId): ProcessingRouteFilter {
  switch (toolId) {
    case "basic-processing-profit":
    case "machine-comparison":
      return "all";
    case "keg-processing":
      return "keg";
    case "preserves-jar-processing":
      return "jar";
    case "dehydrator-processing":
      return "dehydrator";
    default:
      throw new Error(`Unsupported processing comparison toolId. Received: ${JSON.stringify(toolId)}.`);
  }
}

function readLocalizedCopy(locale: PublicLocale): ProcessingComparisonCopy {
  if (locale === "en" || locale === "zh-CN") {
    return processingComparisonCopy[locale];
  }

  throw new Error(`Unsupported processing comparison locale. Received: ${JSON.stringify(locale)}.`);
}

function readToolTitle(toolId: ProcessingComparisonToolId, locale: PublicLocale): string {
  const toolTitles: Readonly<Record<ProcessingComparisonToolId, Readonly<Record<PublicLocale, string>>>> = {
    "basic-processing-profit": { en: "Basic processing profit", "zh-CN": "基础加工收益" },
    "machine-comparison": { en: "Compare three machines", "zh-CN": "三种机器比较" },
    "keg-processing": { en: "Keg processing", "zh-CN": "Keg 加工" },
    "preserves-jar-processing": { en: "Preserves Jar processing", "zh-CN": "罐头瓶加工" },
    "dehydrator-processing": { en: "Dehydrator processing", "zh-CN": "烘干机加工" },
  };
  const title = toolTitles[toolId]?.[locale];
  if (title === undefined) {
    throw new Error(
      `Processing comparison title was not configured. Received toolId=${JSON.stringify(toolId)}, locale=${JSON.stringify(locale)}.`,
    );
  }
  return title;
}

function readIngredientName(ingredient: ProcessingIngredient, locale: PublicLocale): string {
  const name = locale === "en" ? ingredient.englishName : ingredient.chineseName;
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error(
      `Processing ingredient display name is missing. Received ingredientId=${JSON.stringify(ingredient.id)}, locale=${JSON.stringify(locale)}, name=${JSON.stringify(name)}.`,
    );
  }
  return name;
}

function createIngredientOptions(
  ingredients: readonly ProcessingIngredient[],
  locale: PublicLocale,
): readonly PlantingSelectOption[] {
  return ingredients.map((ingredient) => ({
    value: ingredient.id,
    label: readIngredientName(ingredient, locale),
  }));
}

export function getProcessingQualityOptions(
  locale: PublicLocale,
  ingredientId: string,
): readonly PlantingSelectOption[] {
  const copy = readLocalizedCopy(locale);
  const qualities = getProcessingIngredientQualities(ingredientId);
  return qualities.map((quality) => ({ value: quality, label: copy.qualities[quality] }));
}

function createCoconutSourceOptions(copy: ProcessingComparisonCopy): readonly PlantingSelectOption[] {
  return (["foraged", "purchased-or-gifted"] as const).map((source) => ({
    value: source,
    label: copy.coconutSources[source],
  }));
}

function createProfessionOptions(copy: ProcessingComparisonCopy): readonly PlantingSelectOption[] {
  return (["none", "tiller", "artisan"] as const).map((profession) => ({
    value: profession,
    label: copy.professions[profession],
  }));
}

function createDeadlineOptions(copy: ProcessingComparisonCopy): readonly PlantingSelectOption[] {
  return ([7, 14, 28] as const).map((deadlineDays) => ({
    value: String(deadlineDays),
    label: copy.deadlines[deadlineDays],
  }));
}

export function getProcessingMachineFilterOptions(
  locale: PublicLocale,
  toolId: ProcessingComparisonToolId,
): readonly PlantingSelectOption[] {
  const copy = readLocalizedCopy(locale);
  const currentMachine = getMachineFilterForTool(toolId);
  const allMachinesOption = {
    value: "all",
    label: currentMachine === "all" ? copy.allMachines : copy.compareWithOtherMachines,
  } as const;

  if (currentMachine !== "all") {
    return [allMachinesOption, { value: currentMachine, label: copy.machineNames[currentMachine] }];
  }

  return [
    allMachinesOption,
    ...processingMachineOrder.map((machine) => ({
      value: machine,
      label: copy.machineNames[machine],
    })),
  ];
}

export function getActiveProcessingMachineFilter(
  selectedFilter: ProcessingMachine | "all",
  toolId: ProcessingComparisonToolId,
  options: readonly PlantingSelectOption[],
): ProcessingMachine | "all" {
  if (options.some((option) => option.value === selectedFilter)) {
    return selectedFilter;
  }

  return getMachineFilterForTool(toolId);
}

function formatGold(value: number, locale: PublicLocale): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Processing gold value must be finite. Received: ${JSON.stringify(value)}.`);
  }

  const amount = new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN", {
    maximumFractionDigits: 2,
  }).format(value);
  return locale === "en" ? `${amount}g` : `${amount} 金币`;
}

function formatQuantity(value: number, locale: PublicLocale): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Processing unit count must be a non-negative safe integer. Received: ${JSON.stringify(value)}.`);
  }

  return new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN").format(value);
}

function formatCycle(route: ProcessingRouteQuote, locale: PublicLocale): string {
  if (!route.applicable) {
    return "—";
  }
  const minutes = formatQuantity(route.processingMinutes, locale);
  const mornings = formatQuantity(route.processingMornings, locale);
  return locale === "en"
    ? `${minutes} game min / ${mornings} mornings`
    : `${minutes} 游戏分钟 / ${mornings} 个早晨`;
}

function readProductName(
  route: ProcessingRouteQuote,
  locale: PublicLocale,
  copy: ProcessingComparisonCopy,
): string {
  if (!route.applicable) {
    return copy.unsupportedRouteLabel;
  }

  const productName = locale === "en" ? route.productEnglishName : route.productChineseName;
  if (typeof productName !== "string" || productName.trim().length === 0) {
    throw new Error(
      `Applicable processing route is missing a product name. Received machine=${JSON.stringify(route.machine)}, locale=${JSON.stringify(locale)}, productName=${JSON.stringify(productName)}.`,
    );
  }
  return productName;
}

function assertThreeProcessingRoutes(routes: readonly ProcessingRouteQuote[]): void {
  if (routes.length !== processingMachineOrder.length) {
    throw new Error(
      `Processing model must return three machine routes. Received: ${JSON.stringify(routes.map((route) => route.machine))}.`,
    );
  }

  routes.forEach((route, index) => {
    const expectedMachine = processingMachineOrder[index];
    if (route.machine !== expectedMachine) {
      throw new Error(
        `Processing route order must be Keg, Jar, Dehydrator. Received index=${index}, machine=${JSON.stringify(route.machine)}, expected=${JSON.stringify(expectedMachine)}.`,
      );
    }
  });
}

export function getProcessingComparisonRoutes(
  form: ProcessingComparisonForm,
  fieldErrors: ProcessingComparisonFieldMessages,
  machineFilter: ProcessingRouteFilter = "all",
): readonly ProcessingRouteQuote[] | null {
  if (fieldErrors.quantity !== undefined) {
    return null;
  }

  if (form.mode === "capacity") {
    const relevantMachines = machineFilter === "all" ? processingMachineOrder : [machineFilter];
    if (relevantMachines.some((machine) => fieldErrors[machine] !== undefined)) {
      return null;
    }
  }

  const routes = calculateProcessingRoutes(form);
  assertThreeProcessingRoutes(routes);
  return routes;
}

function getVisibleRoutes(
  routes: readonly ProcessingRouteQuote[],
  machineFilter: ProcessingRouteFilter,
): readonly ProcessingRouteQuote[] {
  if (machineFilter === "all") {
    return routes;
  }
  const route = routes.find((candidate) => candidate.machine === machineFilter);
  if (route === undefined) {
    throw new Error(`Processing route is missing for machine filter. Received: ${JSON.stringify(machineFilter)}.`);
  }
  return [route];
}

export function findBestProcessingRoute(routes: readonly ProcessingRouteQuote[]): ProcessingRouteQuote | null {
  let bestRoute: ProcessingRouteQuote | null = null;
  for (const route of routes) {
    if (route.applicable && route.valueAdded > 0 && (bestRoute === null || route.valueAdded > bestRoute.valueAdded)) {
      bestRoute = route;
    }
  }
  return bestRoute;
}

export function readProcessingClipboardFailure(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error) || !error.message.startsWith("Clipboard write failed.")) {
    throw error;
  }
  return `${fallbackMessage} ${error.message}`;
}

export type ProcessingClipboardRecovery = Readonly<{
  copyText: string;
  message: string;
}>;

export function createProcessingClipboardRecovery(
  error: unknown,
  copyText: string,
  fallbackMessage: string,
): ProcessingClipboardRecovery {
  return {
    copyText,
    message: readProcessingClipboardFailure(error, fallbackMessage),
  };
}

export function formatProcessingNumericInputFailure(
  error: unknown,
  locale: PublicLocale,
  fieldLabel: string,
  rawValue: string,
): string {
  if (!isProcessingComparisonNumericInputFailure(error)) {
    throw error;
  }

  const receivedValue = JSON.stringify(rawValue);
  if (locale === "en") {
    return `${fieldLabel} must be a non-negative safe integer. Received: ${receivedValue}.`;
  }
  if (locale === "zh-CN") {
    return `${fieldLabel}必须是0或更大的安全整数。实际输入：${receivedValue}。`;
  }

  throw new Error(`Unsupported processing comparison locale. Received: ${JSON.stringify(locale)}.`);
}

export function readProcessingComparisonLoadFailure(error: unknown, recoveryMessage: string): string {
  if (error instanceof Error && isBrowserStorageFailure(error)) {
    return error.message;
  }
  if (isProcessingComparisonFormValidationFailure(error)) {
    return `${error.message}${recoveryMessage}`;
  }
  throw error;
}

export function canResetProcessingComparisonSavedSettings(error: unknown): boolean {
  return isProcessingComparisonFormValidationFailure(error);
}

function getMachineName(machine: ProcessingMachine, copy: ProcessingComparisonCopy): string {
  const machineName = copy.machineNames[machine];
  if (machineName === undefined) {
    throw new Error(`Processing machine label is missing. Received: ${JSON.stringify(machine)}.`);
  }
  return machineName;
}

function readUnavailableDescription(
  route: ProcessingRouteQuote,
  form: ProcessingComparisonForm,
  copy: ProcessingComparisonCopy,
): string | null {
  if (!route.applicable) {
    return copy.recipeNotSupported;
  }
  if (form.mode === "capacity" && route.machineCount === 0) {
    return copy.zeroMachineNote;
  }
  if (form.quantity > 0 && form.quantity < route.batchInputUnits) {
    return copy.noCompleteBatchNote;
  }
  if (
    form.mode === "capacity" &&
    route.machineCount > 0 &&
    route.processedBatches === 0 &&
    form.quantity >= route.batchInputUnits &&
    route.processingMornings > form.deadlineDays
  ) {
    return copy.noBatchBeforeDeadline;
  }
  return null;
}

function formatRouteValue(route: ProcessingRouteQuote, locale: PublicLocale): string {
  return formatGold(route.finalValue, locale);
}

function formatRouteAddedValue(route: ProcessingRouteQuote, locale: PublicLocale): string {
  return formatGold(route.valueAdded, locale);
}

function createProcessingCopyText(
  form: ProcessingComparisonForm,
  ingredient: ProcessingIngredient,
  routes: readonly ProcessingRouteQuote[],
  machineFilter: ProcessingRouteFilter,
  locale: PublicLocale,
  toolTitle: string,
  copy: ProcessingComparisonCopy,
): string {
  const modeName = copy.modes[form.mode];
  const filterName = machineFilter === "all" ? copy.allMachines : getMachineName(machineFilter, copy);
  const machineCounts = machineFilter === "all" ? processingMachineOrder : [machineFilter];
  const conditionLines = [
    ...(isBearsKnowledgeEligible(ingredient.id)
      ? [
          `${copy.bearsKnowledgeLabel}: ${form.hasBearsKnowledge ? copy.bearsKnowledgeEnabled : copy.bearsKnowledgeDisabled}`,
          copy.bearsKnowledgeDescription,
        ]
      : []),
    ...(ingredient.id === "coconut"
      ? [
          `${copy.coconutSourceLabel}: ${copy.coconutSources[form.coconutSource ?? "foraged"]}`,
          copy.coconutSourceDescription,
        ]
      : []),
  ];
  const lines = [
    toolTitle,
    `${copy.assumptions}:`,
    `${copy.inputLabels.ingredient}: ${readIngredientName(ingredient, locale)}`,
    `${copy.inputLabels.quantity}: ${formatQuantity(form.quantity, locale)}`,
    `${copy.inputLabels.quality}: ${copy.qualities[form.quality]}`,
    `${copy.inputLabels.profession}: ${copy.professions[form.profession]}`,
    `${copy.modeLabel}: ${modeName}`,
    copy.modeDescriptions[form.mode],
    ...(form.mode === "capacity"
      ? [
          `${copy.deadlineLabel}: ${copy.deadlines[form.deadlineDays as 7 | 14 | 28]}`,
          `${copy.machineCountsLabel}: ${machineCounts.map((machine) => `${getMachineName(machine, copy)} ${formatQuantity(form.machineCounts[machine], locale)}`).join(", ")}`,
          copy.capacityAssumption,
        ]
      : []),
    ...conditionLines,
    `${copy.inputLabels.machineView}: ${filterName}`,
    "",
    copy.independentRoutes,
  ];

  for (const route of routes) {
    const description = readUnavailableDescription(route, form, copy);
    const productName = readProductName(route, locale, copy);
    lines.push(
      `${getMachineName(route.machine, copy)}${route.applicable ? ` (${productName})` : `: ${productName}`}`,
      `${copy.completedLeftoverColumn}: ${formatQuantity(route.processedUnits, locale)} / ${formatQuantity(route.backlogUnits, locale)}`,
      `${copy.finalValueColumn}: ${formatRouteValue(route, locale)}`,
      `${copy.addedValueColumn}: ${formatRouteAddedValue(route, locale)}`,
    );
    if (description !== null) {
      lines.push(description);
    }
  }

  return lines.join("\n");
}

function clearFieldMessage(
  messages: ProcessingComparisonFieldMessages,
  field: ProcessingComparisonNumericField,
): ProcessingComparisonFieldMessages {
  const nextMessages = { ...messages };
  delete nextMessages[field];
  return nextMessages;
}

function createLocalizedNumberField(
  inputId: string,
  label: string,
  value: string,
  errorMessage: string | undefined,
  onChange: (rawValue: string) => void,
) {
  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-describedby={errorMessage === undefined ? undefined : `${inputId}-error`}
        aria-invalid={errorMessage !== undefined}
        id={inputId}
        inputMode="numeric"
        min="0"
        onChange={(event) => onChange(event.currentTarget.value)}
        step="1"
        type="number"
        value={value}
      />
      {errorMessage === undefined ? null : (
        <p className={styles.fieldError} id={`${inputId}-error`} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function createRouteDetails(
  route: ProcessingRouteQuote,
  locale: PublicLocale,
  copy: ProcessingComparisonCopy,
): readonly string[] {
  const details = [
    `${copy.rawSaleValue}: ${formatGold(route.rawValue, locale)}`,
    `${copy.rawUnitPrice}: ${formatGold(route.rawUnitPrice, locale)}`,
    `${copy.processedBatches}: ${formatQuantity(route.processedBatches, locale)}`,
    `${copy.processedValue}: ${formatGold(route.processedValue, locale)}`,
    `${copy.leftoverValue}: ${formatGold(route.backlogValue, locale)}`,
  ];
  if (route.batchInputUnits !== null) {
    details.push(`${copy.inputPerBatch}: ${formatQuantity(route.batchInputUnits, locale)}`);
  }
  if (route.processingMinutes !== null) {
    details.push(`${copy.processingMinutes}: ${formatQuantity(route.processingMinutes, locale)}`);
  }
  if (route.processingMornings !== null) {
    details.push(`${copy.processingMornings}: ${formatQuantity(route.processingMornings, locale)}`);
  }
  if (route.batchOutputPrice !== null) {
    details.push(`${copy.batchOutputPrice}: ${formatGold(route.batchOutputPrice, locale)}`);
  }
  if (route.valueAddedPerMachineDay !== null) {
    details.push(`${copy.machineDayValue}: ${formatGold(route.valueAddedPerMachineDay, locale)}`);
  }
  return details;
}

function renderDesktopRouteTable(
  routes: readonly ProcessingRouteQuote[],
  form: ProcessingComparisonForm,
  locale: PublicLocale,
  copy: ProcessingComparisonCopy,
  bestRoute: ProcessingRouteQuote | null,
) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.routeTable}>
        <thead>
          <tr>
            <th scope="col">{copy.routeColumn}</th>
            <th scope="col">{copy.cycleColumn}</th>
            <th scope="col">{copy.completedLeftoverColumn}</th>
            <th scope="col">{copy.finalValueColumn}</th>
            <th scope="col">{copy.addedValueColumn}</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => {
            const productName = readProductName(route, locale, copy);
            const unavailableDescription = readUnavailableDescription(route, form, copy);
            const best = bestRoute?.machine === route.machine;
            return (
              <tr
                className={best ? styles.bestRouteRow : undefined}
                data-machine={route.machine}
                key={route.machine}
              >
                <th scope="row">
                  <span className={styles.routeName}>
                    <span>{getMachineName(route.machine, copy)}</span>
                    <span className={styles.routeProduct}>{productName}</span>
                    <details className={styles.routeDetails}>
                      <summary>{copy.details}</summary>
                      <ul className={styles.routeDetailList}>
                        {createRouteDetails(route, locale, copy).map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </details>
                  </span>
                </th>
                <td>{formatCycle(route, locale)}</td>
                <td>
                  <span>{formatQuantity(route.processedUnits, locale)}</span>
                  <span aria-hidden="true"> / </span>
                  <span>{formatQuantity(route.backlogUnits, locale)}</span>
                  {unavailableDescription === null ? null : (
                    <span className={styles.unavailableReason}>{unavailableDescription}</span>
                  )}
                </td>
                <td>{formatRouteValue(route, locale)}</td>
                <td className={best ? styles.addedValue : undefined}>{formatRouteAddedValue(route, locale)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderMobileRouteCards(
  routes: readonly ProcessingRouteQuote[],
  form: ProcessingComparisonForm,
  locale: PublicLocale,
  copy: ProcessingComparisonCopy,
  bestRoute: ProcessingRouteQuote | null,
) {
  return (
    <div className={styles.mobileRouteCards}>
      {routes.map((route) => {
        const productName = readProductName(route, locale, copy);
        const unavailableDescription = readUnavailableDescription(route, form, copy);
        const best = bestRoute?.machine === route.machine;
        return (
          <article
            className={`${styles.routeCard} ${best ? styles.routeCardBest : ""}`}
            data-machine={route.machine}
            key={route.machine}
          >
            <div className={styles.routeCardHeader}>
              <div>
                <h3 className={styles.routeCardTitle}>{getMachineName(route.machine, copy)}</h3>
                <span className={styles.routeProduct}>{productName}</span>
              </div>
              <span className={styles.routeCardAddedValue}>
                {formatRouteAddedValue(route, locale)}
              </span>
            </div>
            <dl className={styles.routeCardDetails}>
              <div>
                <dt>{copy.completedLeftoverColumn}</dt>
                <dd>
                  {formatQuantity(route.processedUnits, locale)} / {formatQuantity(route.backlogUnits, locale)}
                </dd>
              </div>
              <div>
                <dt>{copy.cycleColumn}</dt>
                <dd>{formatCycle(route, locale)}</dd>
              </div>
              <div>
                <dt>{copy.finalValueColumn}</dt>
                <dd>{formatRouteValue(route, locale)}</dd>
              </div>
              <div>
                <dt>{copy.machineDayValue}</dt>
                <dd>
                  {route.valueAddedPerMachineDay === null
                    ? "—"
                    : formatGold(route.valueAddedPerMachineDay, locale)}
                </dd>
              </div>
            </dl>
            {unavailableDescription === null ? null : (
              <p className={styles.fieldNote}>{unavailableDescription}</p>
            )}
            <details className={styles.routeDetails}>
              <summary>{copy.details}</summary>
              <ul className={styles.routeDetailList}>
                {createRouteDetails(route, locale, copy).map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </details>
          </article>
        );
      })}
    </div>
  );
}

export function ProcessingComparisonTool({ locale, toolId }: ProcessingComparisonToolProperties) {
  const copy = readLocalizedCopy(locale);
  const ingredients = useMemo(() => listProcessingIngredients(), []);
  if (ingredients.length === 0) {
    throw new Error("Processing ingredient catalog must contain at least one ingredient. Received: [].");
  }

  const [form, setForm] = useState<ProcessingComparisonForm>(() =>
    createDefaultProcessingComparisonForm(toolId),
  );
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [canResetSavedSettings, setCanResetSavedSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [fieldDrafts, setFieldDrafts] = useState<ProcessingComparisonFieldMessages>({});
  const [fieldErrors, setFieldErrors] = useState<ProcessingComparisonFieldMessages>({});
  const [qualityResetReason, setQualityResetReason] = useState<string | null>(null);
  const [machineFilter, setMachineFilter] = useState<ProcessingRouteFilter>(() =>
    getMachineFilterForTool(toolId),
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);

  useEffect(() => {
    setMachineFilter(getMachineFilterForTool(toolId));
  }, [toolId]);

  useEffect(() => {
    if (storageReady || storageError !== null) {
      return;
    }

    try {
      const storageText = readBrowserToolStorage(processingComparisonStorageKey);
      const loadResult = loadProcessingComparisonFormWithRecovery(storageText, toolId);
      setForm(loadResult.form);
      setQualityResetReason(loadResult.qualityWasReset ? copy.qualityResetReason : null);
      setSaveStatus("saved");
      setStorageReady(true);
      setStorageError(null);
    } catch (error) {
      const resetAvailable = canResetProcessingComparisonSavedSettings(error);
      const errorMessage = readProcessingComparisonLoadFailure(error, copy.invalidSavedSettingsRecovery);
      setCanResetSavedSettings(resetAvailable);
      setStorageError(errorMessage);
      setSaveStatus("failed");
    }
  }, [storageError, storageReady, toolId]);

  useEffect(() => {
    if (!storageReady || storageError !== null) {
      return;
    }

    try {
      writeBrowserToolStorage(processingComparisonStorageKey, serializeProcessingComparisonForm(form));
      setSaveStatus("saved");
    } catch (error) {
      if (!(error instanceof Error) || !isBrowserStorageFailure(error)) {
        throw error;
      }
      setStorageError(error.message);
      setSaveStatus("failed");
    }
  }, [form, storageError, storageReady]);

  const ingredient = getProcessingIngredient(form.ingredientId);
  const bearsKnowledgeEligible = isBearsKnowledgeEligible(ingredient.id);
  const ingredientNeedsFullWidth = bearsKnowledgeEligible || ingredient.id === "coconut";
  const tillerBonusEligible = ingredient.id === "coconut"
    ? form.coconutSource === "purchased-or-gifted"
    : ingredient.tillerBonusEligible;
  const ingredientOptions = useMemo(() => createIngredientOptions(ingredients, locale), [ingredients, locale]);
  const qualityOptions = useMemo(
    () => getProcessingQualityOptions(locale, ingredient.id),
    [locale, ingredient.id],
  );
  const coconutSourceOptions = useMemo(() => createCoconutSourceOptions(copy), [copy]);
  const professionOptions = useMemo(() => createProfessionOptions(copy), [copy]);
  const deadlineOptions = useMemo(() => createDeadlineOptions(copy), [copy]);
  const machineFilterOptions = useMemo(
    () => getProcessingMachineFilterOptions(locale, toolId),
    [locale, toolId],
  );
  const activeMachineFilter = getActiveProcessingMachineFilter(machineFilter, toolId, machineFilterOptions);
  const routes = useMemo(() => {
    return getProcessingComparisonRoutes(form, fieldErrors, activeMachineFilter);
  }, [activeMachineFilter, form, fieldErrors]);
  const numericFieldsInvalid = routes === null;
  const visibleRoutes = routes === null ? [] : getVisibleRoutes(routes, activeMachineFilter);
  const bestRoute = findBestProcessingRoute(visibleRoutes);
  const currentToolTitle = readToolTitle(toolId, locale);
  const rawValue = routes?.[0]?.rawValue ?? null;

  function commitNumericValue(field: ProcessingComparisonNumericField, rawValue: string) {
    const label = field === "quantity" ? copy.inputLabels.quantity : copy.inputLabels.machineCounts[field];
    setFieldDrafts((currentDrafts) => ({ ...currentDrafts, [field]: rawValue }));
    try {
      const parsedValue = parseProcessingComparisonNonNegativeInteger(rawValue, label);
      setForm((currentForm) => updateProcessingComparisonNumericValue(currentForm, field, parsedValue));
      setFieldDrafts((currentDrafts) => clearFieldMessage(currentDrafts, field));
      setFieldErrors((currentErrors) => clearFieldMessage(currentErrors, field));
    } catch (error) {
      if (!isProcessingComparisonNumericInputFailure(error)) {
        throw error;
      }
      const localizedError = formatProcessingNumericInputFailure(error, locale, label, rawValue);
      setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: localizedError }));
    }
  }

  function handleIngredientChange(ingredientId: string) {
    const nextForm = updateProcessingComparisonIngredient(form, ingredientId);
    setForm(nextForm);
    setQualityResetReason(nextForm.quality === form.quality ? null : copy.qualityResetReason);
  }

  function handleCoconutSourceChange(rawSource: string) {
    const nextCoconutSource = rawSource as ProcessingCoconutSource;
    if (!coconutSourceOptions.some((option) => option.value === nextCoconutSource)) {
      throw new Error(`Unknown processing coconut source. Received: ${JSON.stringify(rawSource)}.`);
    }

    const nextForm = updateProcessingComparisonCoconutSource(form, nextCoconutSource);
    setForm(nextForm);
    setQualityResetReason(null);
  }

  function handleDeadlineChange(rawDeadlineDays: string) {
    const deadlineDays = Number(rawDeadlineDays);
    if (deadlineDays !== 7 && deadlineDays !== 14 && deadlineDays !== 28) {
      throw new Error(
        `Processing comparison deadline must be 7, 14, or 28. Received: ${JSON.stringify(rawDeadlineDays)}.`,
      );
    }
    setForm((currentForm) => ({ ...currentForm, deadlineDays }));
  }

  async function copyCurrentResults() {
    setManualCopyText(null);
    setCopyStatus(null);
    if (routes === null) {
      setCopyStatus({ message: copy.invalidDraft, failed: true });
      return;
    }
    const copyText = createProcessingCopyText(
      form,
      ingredient,
      visibleRoutes,
      activeMachineFilter,
      locale,
      currentToolTitle,
      copy,
    );
    try {
      await copyToolText(copyText);
      setCopyStatus({ message: copy.copied, failed: false });
    } catch (error) {
      const clipboardRecovery = createProcessingClipboardRecovery(error, copyText, copy.copyFailed);
      setManualCopyText(clipboardRecovery.copyText);
      setCopyStatus({ message: clipboardRecovery.message, failed: true });
    }
  }

  function resetInvalidSavedSettings() {
    if (!canResetSavedSettings) {
      throw new Error(
        `Processing comparison settings reset is only available for invalid saved settings. Received: ${JSON.stringify(canResetSavedSettings)}.`,
      );
    }

    try {
      removeBrowserToolStorage(processingComparisonStorageKey);
    } catch (error) {
      if (!(error instanceof Error) || !isBrowserStorageFailure(error)) {
        throw error;
      }
      setStorageError(error.message);
      setSaveStatus("failed");
      return;
    }

    setForm(createDefaultProcessingComparisonForm(toolId));
    setFieldDrafts({});
    setFieldErrors({});
    setQualityResetReason(null);
    setStorageError(null);
    setCanResetSavedSettings(false);
    setStorageReady(true);
    setSaveStatus("saved");
    setManualCopyText(null);
    setCopyStatus(null);
  }

  const routeTitleId = "processing-comparison-results-title";
  const settingsTitleId = "processing-comparison-settings-title";
  const saveMessage = storageError ?? (saveStatus === "loading"
    ? copy.saveLoading
    : saveStatus === "saved"
      ? copy.saveSuccess
      : copy.saveFailure);

  return (
    <section aria-labelledby="processing-comparison-page-title" className={styles.tool} data-processing-comparison-tool="true">
      <header>
        <h2 className={styles.toolTitle} id="processing-comparison-page-title">{currentToolTitle}</h2>
        <p className={styles.toolDescription}>{copy.descriptions[toolId]}</p>
      </header>
      <div className={styles.workspace}>
        <div aria-labelledby={settingsTitleId} className={styles.settingsPanel} role="group">
          <h2 className={styles.panelTitle} id={settingsTitleId}>{copy.settingsTitle}</h2>
          <div className={styles.fieldGrid}>
            <div className={`${styles.field} ${ingredientNeedsFullWidth ? styles.fieldFullWidth : ""}`}>
              <PlantingSelect
                inputId="processing-comparison-ingredient"
                label={copy.inputLabels.ingredient}
                onValueChange={handleIngredientChange}
                options={ingredientOptions}
                value={form.ingredientId}
              />
            </div>
            {ingredient.id === "coconut" ? (
              <div className={`${styles.field} ${styles.coconutSourceField}`}>
                <PlantingSelect
                  inputId="processing-comparison-coconut-source"
                  label={copy.coconutSourceLabel}
                  onValueChange={handleCoconutSourceChange}
                  options={coconutSourceOptions}
                  value={form.coconutSource ?? "foraged"}
                />
                <p className={styles.fieldNote}>{copy.coconutSourceDescription}</p>
              </div>
            ) : null}
            {bearsKnowledgeEligible ? (
              <div className={styles.specialConditionField}>
                <label className={styles.checkboxLabel} htmlFor="processing-comparison-bears-knowledge">
                  <input
                    aria-describedby="processing-comparison-bears-knowledge-description"
                    checked={form.hasBearsKnowledge ?? false}
                    id="processing-comparison-bears-knowledge"
                    onChange={(event) => {
                      const hasBearsKnowledge = event.currentTarget.checked;
                      setForm((currentForm) => ({ ...currentForm, hasBearsKnowledge }));
                    }}
                    type="checkbox"
                  />
                  <span>{copy.bearsKnowledgeLabel}</span>
                </label>
                <p className={styles.fieldNote} id="processing-comparison-bears-knowledge-description">
                  {copy.bearsKnowledgeDescription}
                </p>
              </div>
            ) : null}
            {createLocalizedNumberField(
              "processing-comparison-quantity",
              copy.inputLabels.quantity,
              fieldDrafts.quantity ?? String(form.quantity),
              fieldErrors.quantity,
              (rawValue) => commitNumericValue("quantity", rawValue),
            )}
            <div className={styles.field}>
              <PlantingSelect
                inputId="processing-comparison-quality"
                label={copy.inputLabels.quality}
                onValueChange={(quality) => {
                  const nextQuality = quality as ProcessingQuality;
                  if (!qualityOptions.some((option) => option.value === nextQuality)) {
                    throw new Error(
                      `Processing comparison quality is not available for ingredient ${JSON.stringify(ingredient.id)}. Received: ${JSON.stringify(quality)}.`,
                    );
                  }
                  setForm((currentForm) => ({ ...currentForm, quality: nextQuality }));
                  setQualityResetReason(null);
                }}
                options={qualityOptions}
                value={form.quality}
              />
            </div>
            <div className={styles.field}>
              <PlantingSelect
                inputId="processing-comparison-profession"
                label={copy.inputLabels.profession}
                onValueChange={(profession) => {
                  const nextProfession = profession as ProcessingProfession;
                  if (!professionOptions.some((option) => option.value === nextProfession)) {
                    throw new Error(`Unknown processing profession. Received: ${JSON.stringify(profession)}.`);
                  }
                  setForm((currentForm) => ({ ...currentForm, profession: nextProfession }));
                }}
                options={professionOptions}
                value={form.profession}
              />
            </div>
            <div className={styles.field}>
              <PlantingSelect
                inputId="processing-comparison-machine-view"
                label={copy.inputLabels.machineView}
                onValueChange={(machine) => {
                  const nextMachine = machine as ProcessingRouteFilter;
                  if (!machineFilterOptions.some((option) => option.value === nextMachine)) {
                    throw new Error(`Unknown processing route filter. Received: ${JSON.stringify(machine)}.`);
                  }
                  setMachineFilter(nextMachine);
                }}
                options={machineFilterOptions}
                value={activeMachineFilter}
              />
            </div>
          </div>
          {qualityResetReason === null ? null : (
            <p className={styles.fieldNote} role="status" aria-live="polite">
              {qualityResetReason}
            </p>
          )}
          <fieldset className={styles.modeFieldset}>
            <legend className={styles.modeLegend}>{copy.inputLabels.mode}</legend>
            <div className={styles.modeOptions}>
              {(["unlimited", "capacity"] as const).map((mode) => (
                <button
                  aria-pressed={form.mode === mode}
                  className={`${styles.modeButton} ${form.mode === mode ? styles.modeButtonSelected : ""}`}
                  key={mode}
                  onClick={() => setForm((currentForm) => updateProcessingComparisonMode(currentForm, mode))}
                  type="button"
                >
                  {copy.modes[mode]}
                </button>
              ))}
            </div>
            <p className={styles.modeNote}>{copy.modeDescriptions[form.mode]}</p>
            {form.mode === "capacity" ? (
              <p className={styles.modeNote}>{copy.capacityAssumption}</p>
            ) : null}
          </fieldset>

          {form.mode === "capacity" ? (
            <>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <PlantingSelect
                    inputId="processing-comparison-deadline"
                    label={copy.inputLabels.deadline}
                    onValueChange={handleDeadlineChange}
                    options={deadlineOptions}
                    value={String(form.deadlineDays)}
                  />
                </div>
              </div>
              <div className={styles.machineGrid}>
                {processingMachineOrder
                  .filter((machine) => activeMachineFilter === "all" || activeMachineFilter === machine)
                  .map((machine) => (
                    <div key={machine}>
                      {createLocalizedNumberField(
                        `processing-comparison-${machine}-count`,
                        copy.inputLabels.machineCounts[machine],
                        fieldDrafts[machine] ?? String(form.machineCounts[machine]),
                        fieldErrors[machine],
                        (rawValue) => commitNumericValue(machine, rawValue),
                      )}
                    </div>
                  ))}
              </div>
            </>
          ) : null}
          {!ingredient.hasQualityTiers ? <p className={styles.fieldNote}>{copy.qualityUnavailable}</p> : null}
          {form.profession === "tiller" ? (
            <p className={styles.fieldNote}>
              {tillerBonusEligible ? copy.tillerNote : copy.tillerUnavailable}
            </p>
          ) : null}
          {ingredient.rawArtisanBonusEligible ? <p className={styles.fieldNote}>{copy.rawArtisanNote}</p> : null}
          {storageError === null ? (
            <p className={styles.storageStatus} role="status" aria-live="polite">{saveMessage}</p>
          ) : (
            <>
              <p className={styles.storageError} id="processing-comparison-storage-error" role="alert">
                {saveMessage}
              </p>
              {canResetSavedSettings ? (
                <button
                  aria-describedby="processing-comparison-storage-error"
                  className={styles.actionButton}
                  onClick={resetInvalidSavedSettings}
                  type="button"
                >
                  {copy.resetSavedSettings}
                </button>
              ) : null}
            </>
          )}
        </div>

        <section aria-labelledby={routeTitleId} className={styles.resultsPanel}>
          <h2 className={styles.panelTitle} id={routeTitleId}>{copy.resultsTitles[form.mode]}</h2>
          {form.mode === "capacity" ? <p className={styles.calculationNote}>{copy.capacityAssumption}</p> : null}
          {numericFieldsInvalid ? <p className={styles.calculationError} role="alert">{copy.invalidDraft}</p> : null}
          {routes === null ? null : (
            <>
              <div className={styles.recommendation}>
                <p className={styles.recommendationLabel}>{copy.bestRoute}</p>
                <h3 className={styles.recommendationTitle}>
                  {bestRoute === null ? copy.sellRawRecommendation : getMachineName(bestRoute.machine, copy)}
                </h3>
                {bestRoute === null ? null : (
                  <p className={styles.recommendationValue}>
                    {readProductName(bestRoute, locale, copy)} · {formatRouteAddedValue(bestRoute, locale)}
                  </p>
                )}
                {bestRoute === null ? <p className={styles.fieldNote}>{copy.noRoutes}</p> : null}
              </div>
              <div className={styles.summaryGrid}>
                <article className={styles.summaryMetric}>
                  <p className={styles.metricLabel}>{copy.valueAdded}</p>
                  <p className={styles.metricValue}>
                    {bestRoute === null ? formatGold(0, locale) : formatRouteAddedValue(bestRoute, locale)}
                  </p>
                </article>
                <article className={styles.summaryMetric}>
                  <p className={styles.metricLabel}>{copy.rawSaleValue}</p>
                  <p className={styles.metricValue}>{formatGold(rawValue ?? 0, locale)}</p>
                </article>
              </div>
              <p className={styles.independentNote}>{copy.independentRoutes}</p>
              {renderDesktopRouteTable(visibleRoutes, form, locale, copy, bestRoute)}
              {renderMobileRouteCards(visibleRoutes, form, locale, copy, bestRoute)}
              <p className={styles.calculationNote}>{copy.calculationExplanation}</p>
              <p className={styles.calculationNote}>{copy.minutesAndMorningsExplanation}</p>
              <p className={styles.calculationNote}>{copy.machineDayExplanation}</p>
            </>
          )}
          <div className={styles.actionArea}>
            <button aria-describedby="processing-comparison-plan-note" className={styles.disabledAction} disabled type="button">
              {copy.planButton}
            </button>
            <button className={styles.actionButton} disabled={routes === null} onClick={() => void copyCurrentResults()} type="button">
              {copy.copyButton}
            </button>
            <p className={styles.planNote} id="processing-comparison-plan-note">{copy.planUnavailable}</p>
            {copyStatus === null ? null : (
              <p className={copyStatus.failed ? styles.storageError : styles.copyStatus} role={copyStatus.failed ? "alert" : "status"}>
                {copyStatus.message}
              </p>
            )}
          </div>
          {manualCopyText === null ? null : (
            <div className={styles.manualCopyPanel}>
              <label htmlFor="processing-comparison-manual-copy">{copy.manualCopyTextLabel}</label>
              <textarea
                className={styles.manualCopyText}
                id="processing-comparison-manual-copy"
                readOnly
                rows={8}
                spellCheck={false}
                value={manualCopyText}
              />
            </div>
          )}
        </section>
      </div>
      <div className={styles.mobileActions}>
        <button aria-describedby="processing-comparison-mobile-plan-note" className={styles.disabledAction} disabled type="button">
          {copy.planButton}
        </button>
        <button className={styles.actionButton} disabled={routes === null} onClick={() => void copyCurrentResults()} type="button">
          {copy.copyButton}
        </button>
        <p className={styles.planNote} id="processing-comparison-mobile-plan-note">{copy.planUnavailable}</p>
        {copyStatus === null ? null : (
          <p className={copyStatus.failed ? styles.storageError : styles.copyStatus} role={copyStatus.failed ? "alert" : "status"}>
            {copyStatus.message}
          </p>
        )}
      </div>
    </section>
  );
}
