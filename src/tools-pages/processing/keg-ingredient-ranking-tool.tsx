"use client";

import { useEffect, useMemo, useState } from "react";
import { createProcessingProductionPlan } from "../planning-tool-handoff";
import { createProductionPlanIncomingHref } from "../production/production-plan-handoff";
import type { PublicLocale } from "../../i18n/public-locale";
import { PlantingSelect } from "../planting-select";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import { copyToolText } from "../copy-tool-text";
import {
  readKegIngredientRanking,
  readKegIngredientRankingSelection,
  readKegInventoryEstimate,
  type KegIngredientRankingRow,
  type KegIngredientRankingSort,
} from "../../processing-tools/keg-ingredient-ranking";
import type {
  CalculateProcessingRouteInput,
  ProcessingCoconutSource,
  ProcessingRouteQuote,
} from "../../processing-tools/processing-model";
import {
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
} from "../../processing-tools/processing-model";
import styles from "./keg-ingredient-ranking-tool.module.css";

type KegIngredientRankingToolProperties = Readonly<{
  locale: PublicLocale;
}>;

type KegRankingDraft = Readonly<{
  quality: CalculateProcessingRouteInput["quality"];
  profession: CalculateProcessingRouteInput["profession"];
  hasBearsKnowledge: boolean;
  coconutSource: ProcessingCoconutSource;
  sortBy: KegIngredientRankingSort;
  selectedIngredientId: string;
  quantity: string;
  kegCount: string;
  deadlineDays: "7" | "14" | "28";
}>;

type CopyState = Readonly<{
  message: string;
  text: string;
}>;

type NonNegativeIntegerField = Readonly<{
  value: number | null;
  errorMessage: string | null;
}>;

type KegRankingDisplayRow = Readonly<{
  rankingRow: KegIngredientRankingRow;
  productName: string;
  batchInputUnits: number;
  processingMinutes: number;
  processingMornings: number;
  rawUnitPrice: number;
  batchOutputPrice: number;
  valueAddedPerIngredient: number;
  valueAddedPerProcessingMinute: number;
}>;

type KegRankingCopy = Readonly<{
  title: string;
  rankingHeading: string;
  qualityLabel: string;
  professionLabel: string;
  sortLabel: string;
  headers: readonly string[];
  inventoryHeading: string;
  noSelection: string;
  quantityLabel: string;
  kegCountLabel: string;
  deadlineLabel: string;
  processedLabel: string;
  backlogLabel: string;
  valueAddedLabel: string;
  goldLabel: string;
  cycleSort: string;
  ingredientSort: string;
  processingMinuteSort: string;
  processingMinuteUnit: string;
  processingMinuteExplanation: string;
  specialConditions: string;
  bearsKnowledgeLabel: string;
  bearsKnowledgeOn: string;
  bearsKnowledgeOff: string;
  bearsKnowledgeImpact: (eligible: boolean) => string;
  coconutSourceLabel: string;
  coconutSourceOptions: Readonly<Record<ProcessingCoconutSource, string>>;
  conditionSummary: (bearsKnowledge: string, coconutSource: string) => string;
  qualityOptions: Readonly<Record<CalculateProcessingRouteInput["quality"], string>>;
  professionOptions: Readonly<Record<CalculateProcessingRouteInput["profession"], string>>;
  deadlineOptions: Readonly<Record<KegRankingDraft["deadlineDays"], string>>;
  intro: string;
  rankingInstructions: string;
  qualityFilterNote: string;
  qualityNote: string;
  inventoryInstructions: string;
  collectionAssumption: string;
  noIngredients: string;
  noStock: string;
  noKegs: string;
  noCompletedBatch: string;
  recipeUnavailable: string;
  estimateUnavailable: string;
  allProcessed: string;
  partialProcessed: string;
  invalidInteger: (fieldLabel: string, receivedValue: string) => string;
  saveEmpty: string;
  saveSaved: string;
  saveFailed: string;
  draftInvalid: (receivedValue: string) => string;
  selectedIngredientUnavailable: (receivedValue: string) => string;
  copyButton: string;
  copySuccess: string;
  copyFailure: (reason: string) => string;
  copyFieldLabel: string;
  productionPlanButton: string;
  productionPlanDisabled: string;
  selectedIngredientLabel: string;
  rowButtonLabel: (rank: number, ingredientName: string, productName: string) => string;
  rankingCount: (count: number) => string;
}>;

const kegRankingStorageKey = "stardew-keg-ingredient-ranking-v1";
const defaultKegRankingDraft: KegRankingDraft = {
  quality: "normal",
  profession: "none",
  hasBearsKnowledge: false,
  coconutSource: "foraged",
  sortBy: "per-machine-cycle",
  selectedIngredientId: "",
  quantity: "20",
  kegCount: "1",
  deadlineDays: "28",
};

const kegRankingCopy: Readonly<Record<PublicLocale, KegRankingCopy>> = {
  en: {
    title: "Keg Ingredient Profit Ranking",
    rankingHeading: "Keg ingredient ranking",
    qualityLabel: "Ingredient quality",
    professionLabel: "Profession",
    sortLabel: "Rank by",
    headers: [
      "Ingredient → product",
      "Units per batch",
      "Raw price per unit",
      "Product price per batch",
      "Processing cycle",
      "Added value per ingredient",
      "Added value per cycle",
      "Added value per processing minute",
    ],
    inventoryHeading: "Check your inventory",
    noSelection: "Select an ingredient from the ranking.",
    quantityLabel: "Raw ingredients in stock",
    kegCountLabel: "Free Kegs",
    deadlineLabel: "Days available",
    processedLabel: "Processed units",
    backlogLabel: "Raw units left",
    valueAddedLabel: "Added value",
    goldLabel: "g",
    cycleSort: "Per machine cycle",
    ingredientSort: "Per ingredient unit",
    processingMinuteSort: "Per processing minute",
    processingMinuteUnit: "g / game min",
    processingMinuteExplanation: "Added value per processing minute divides one batch's value added by its in-game processing minutes. It excludes collection waiting time and is not a daily throughput estimate.",
    specialConditions: "Special conditions (optional)",
    bearsKnowledgeLabel: "Bear's Knowledge",
    bearsKnowledgeOn: "on",
    bearsKnowledgeOff: "off",
    bearsKnowledgeImpact: (eligible) => eligible
      ? "Bear's Knowledge applies to this ingredient's raw sale value."
      : "Bear's Knowledge does not apply to this ingredient's raw sale value.",
    coconutSourceLabel: "Coconut source",
    coconutSourceOptions: { foraged: "Foraged", "purchased-or-gifted": "Purchased or gifted" },
    conditionSummary: (bearsKnowledge, coconutSource) => `Bear's Knowledge ${bearsKnowledge}; Coconut source: ${coconutSource}.`,
    qualityOptions: {
      normal: "Normal",
      silver: "Silver",
      gold: "Gold",
      iridium: "Iridium",
    },
    professionOptions: {
      none: "No profession",
      tiller: "Tiller",
      artisan: "Artisan",
    },
    deadlineOptions: { "7": "7 days", "14": "14 days", "28": "28 days" },
    intro: "Compare every ingredient the Keg can process, then check a real stock amount against free Kegs and a deadline.",
    rankingInstructions: "Choose quality, profession, and ranking basis. Optional conditions adjust the raw-value estimate. Select any row to carry that ingredient into the inventory check.",
    qualityFilterNote: "Only Keg recipes that support the selected quality appear here. Ingredients without quality tiers always use Normal quality.",
    qualityNote: "This ingredient has no quality tiers, so its quote uses Normal quality.",
    inventoryInstructions: "The deadline counts completed batches within the selected number of days; unused ingredients retain their raw sale value.",
    collectionAssumption: "Capacity assumes you collect finished batches and refill each free Keg once every morning. Only batches finished by the deadline count as processed.",
    noIngredients: "No Keg recipes are available in the current catalog.",
    noStock: "Enter stock to estimate processing. With zero stock, no ingredients are processed.",
    noKegs: "No free Kegs are available. All stock remains raw for this deadline.",
    noCompletedBatch: "No complete batch finishes before this deadline. All stock keeps its raw sale value.",
    recipeUnavailable: "This ingredient has no Keg recipe. All stock remains raw and keeps its raw sale value.",
    estimateUnavailable: "The inventory estimate is unavailable until the stock and free Keg fields are valid.",
    allProcessed: "All stock fits into completed Keg batches before the deadline.",
    partialProcessed: "Some stock will be processed; the remaining units stay raw and keep their raw sale value.",
    invalidInteger: (fieldLabel, receivedValue) => `${fieldLabel} must be a whole number greater than or equal to 0. Received: ${JSON.stringify(receivedValue)}.`,
    saveEmpty: "No local draft has been saved yet.",
    saveSaved: "Draft saved on this device.",
    saveFailed: "Could not save this draft on this device.",
    draftInvalid: (receivedValue) => `The saved Keg ranking draft is invalid. Received: ${JSON.stringify(receivedValue)}. Edit a field to replace it with a new draft.`,
    selectedIngredientUnavailable: (receivedValue) => `The selected ingredient is no longer available in this ranking. Received: ${JSON.stringify(receivedValue)}. Choose a row or change the ranking settings to continue.`,
    copyButton: "Copy ranking and inventory result",
    copySuccess: "Ranking and inventory result copied.",
    copyFailure: (reason) => `Could not copy the result. ${reason}`,
    copyFieldLabel: "Copy result manually",
    productionPlanButton: "Add to production plan",
    productionPlanDisabled: "Select an ingredient and enter your stock, Kegs and deadline to prepare a plan.",
    selectedIngredientLabel: "Selected ingredient",
    rowButtonLabel: (rank, ingredientName, productName) => `Select rank ${rank}: ${ingredientName} processed as ${productName}`,
    rankingCount: (count) => `${count} Keg-compatible ingredients`,
  },
  "zh-CN": {
    title: "Keg 原料收益排行",
    rankingHeading: "Keg 原料排行",
    qualityLabel: "原料品质",
    professionLabel: "职业",
    sortLabel: "排行口径",
    headers: [
      "原料 → 产品",
      "每批消耗",
      "原料单价",
      "每批产品售价",
      "加工周期",
      "每份原料增值",
      "每个机器周期增值",
      "每个加工分钟增值",
    ],
    inventoryHeading: "用实际库存检查选中原料",
    noSelection: "请从排行中选择一种原料。",
    quantityLabel: "库存原料数量",
    kegCountLabel: "空闲 Keg 数量",
    deadlineLabel: "可用天数",
    processedLabel: "完成加工数量",
    backlogLabel: "剩余原料",
    valueAddedLabel: "加工增值",
    goldLabel: "金币",
    cycleSort: "每个机器周期",
    ingredientSort: "每份原料",
    processingMinuteSort: "每个加工分钟",
    processingMinuteUnit: "金币 / 游戏分钟",
    processingMinuteExplanation: "每加工分钟增值按单批增值除以游戏内加工分钟计算；不包含收取等待时间，也不代表每日收取产能估算。",
    specialConditions: "特殊条件（可选）",
    bearsKnowledgeLabel: "熊的知识",
    bearsKnowledgeOn: "已启用",
    bearsKnowledgeOff: "未启用",
    bearsKnowledgeImpact: (eligible) => eligible
      ? "熊的知识会影响该原料的原售价值。"
      : "熊的知识不会影响该原料的原售价值。",
    coconutSourceLabel: "椰子来源",
    coconutSourceOptions: { foraged: "采集获得", "purchased-or-gifted": "购买或赠送" },
    conditionSummary: (bearsKnowledge, coconutSource) => `熊的知识：${bearsKnowledge}；椰子来源：${coconutSource}。`,
    qualityOptions: {
      normal: "普通",
      silver: "银星",
      gold: "金星",
      iridium: "铱星",
    },
    professionOptions: {
      none: "无职业",
      tiller: "农耕人",
      artisan: "工匠",
    },
    deadlineOptions: { "7": "7 天", "14": "14 天", "28": "28 天" },
    intro: "比较目录中所有可用 Keg 加工的原料，再按空闲 Keg 数量和截止天数核对实际库存。",
    rankingInstructions: "选择品质、职业和排序口径。可选条件会调整原料原售价值估算。点击排行行可将原料带入库存检查。",
    qualityFilterNote: "排行只显示支持所选品质的 Keg 原料。没有品质星级的原料始终按普通品质计算。",
    qualityNote: "这种原料没有品质星级，报价按普通品质计算。",
    inventoryInstructions: "截止期内只计入能完成的整批加工；未加工原料仍按原售价计入。",
    collectionAssumption: "产能估算假设每天早晨收取已完成批次，并给每个空闲 Keg 补料一次；只计入截止期前完成的批次。",
    noIngredients: "当前目录没有可用的 Keg 配方。",
    noStock: "输入库存数量以估算加工结果。库存为 0 时不会加工原料。",
    noKegs: "没有空闲 Keg。该截止期内所有原料都保持未加工状态。",
    noCompletedBatch: "截止期内没有整批加工可以完成；库存仍按原售价计入。",
    recipeUnavailable: "这种原料没有 Keg 配方；库存保持未加工，并按原售价计入。",
    estimateUnavailable: "库存数量和空闲 Keg 数量有效后才能显示估算结果。",
    allProcessed: "截止期前所有库存都能完成 Keg 整批加工。",
    partialProcessed: "部分原料会完成加工；剩余数量保持未加工，并按原售价计入。",
    invalidInteger: (fieldLabel, receivedValue) => `${fieldLabel}必须是大于等于 0 的整数。收到：${JSON.stringify(receivedValue)}。`,
    saveEmpty: "尚未在本机保存草稿。",
    saveSaved: "草稿已保存在本机。",
    saveFailed: "无法在本机保存草稿。",
    draftInvalid: (receivedValue) => `已保存的 Keg 排行草稿无效。收到：${JSON.stringify(receivedValue)}。修改任一字段后将保存新草稿。`,
    selectedIngredientUnavailable: (receivedValue) => `当前所选原料已不在此排行中。收到：${JSON.stringify(receivedValue)}。请选择一行或调整排行设置后继续。`,
    copyButton: "复制排行与库存结果",
    copySuccess: "排行与库存结果已复制。",
    copyFailure: (reason) => `无法复制结果。${reason}`,
    copyFieldLabel: "手动复制结果",
    productionPlanButton: "转入生产计划",
    productionPlanDisabled: "选择原料并填写库存、Keg 数量和期限，即可转入确认。",
    selectedIngredientLabel: "选中的原料",
    rowButtonLabel: (rank, ingredientName, productName) => `选择第 ${rank} 名：${ingredientName} 加工为 ${productName}`,
    rankingCount: (count) => `${count} 种可用 Keg 加工原料`,
  },
};

export function KegIngredientRankingTool({ locale }: KegIngredientRankingToolProperties) {
  const copy = readKegRankingCopy(locale);
  const [draft, setDraft] = useState(defaultKegRankingDraft);
  const [storageReady, setStorageReady] = useState(false);
  const [draftCanBeSaved, setDraftCanBeSaved] = useState(true);
  const [draftSaveStatus, setDraftSaveStatus] = useState<"empty" | "saved" | "failed">("empty");
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState | null>(null);

  const rankingRows = useMemo(
    () =>
      readKegIngredientRanking(
        {
          quality: draft.quality,
          profession: draft.profession,
          hasBearsKnowledge: draft.hasBearsKnowledge,
          coconutSource: draft.coconutSource,
        },
        draft.sortBy,
      ),
    [draft.coconutSource, draft.hasBearsKnowledge, draft.profession, draft.quality, draft.sortBy],
  );
  const displayRows = useMemo(
    () => createKegRankingDisplayRows(rankingRows, locale),
    [locale, rankingRows],
  );
  const selectedRankingRow = readKegIngredientRankingSelection(
    rankingRows,
    draft.selectedIngredientId,
  );
  const selectedDisplayRow =
    selectedRankingRow === null
      ? null
      : displayRows.find(
          (displayRow) =>
            displayRow.rankingRow.ingredient.id === selectedRankingRow.ingredient.id,
        ) ?? null;
  const quantityField = readNonNegativeIntegerField(draft.quantity, copy.quantityLabel, copy);
  const kegCountField = readNonNegativeIntegerField(draft.kegCount, copy.kegCountLabel, copy);
  const inventoryEstimate =
    selectedDisplayRow === null || quantityField.value === null || kegCountField.value === null
      ? null
      : readKegInventoryEstimate({
          ingredientId: selectedDisplayRow.rankingRow.ingredient.id,
          quantity: quantityField.value,
          quality: draft.quality,
          profession: draft.profession,
          hasBearsKnowledge: draft.hasBearsKnowledge,
          coconutSource: draft.coconutSource,
          kegCount: kegCountField.value,
          deadlineDays: Number(draft.deadlineDays) as 7 | 14 | 28,
        });

  function transferCurrentInventory() {
    if (selectedDisplayRow === null || quantityField.value === null || kegCountField.value === null) {
      throw new Error(`Cannot transfer Keg inventory: ingredient=${JSON.stringify(draft.selectedIngredientId)}, quantity=${JSON.stringify(draft.quantity)}, kegCount=${JSON.stringify(draft.kegCount)}.`);
    }
    const input = createProcessingProductionPlan({
      ingredientId: selectedDisplayRow.rankingRow.ingredient.id,
      quantity: quantityField.value,
      quality: draft.quality,
      profession: draft.profession,
      hasBearsKnowledge: draft.hasBearsKnowledge,
      coconutSource: draft.coconutSource,
      machineCounts: { keg: kegCountField.value, jar: 0, dehydrator: 0 },
      deadlineDays: Number(draft.deadlineDays),
      mode: "capacity",
    });
    window.location.assign(createProductionPlanIncomingHref(locale, input));
  }

  useEffect(() => {
    try {
      const savedDraftText = readBrowserToolStorage(kegRankingStorageKey);
      if (savedDraftText === null) {
        setDraftSaveStatus("empty");
        setDraftMessage(null);
      } else {
        const parsedDraft = readKegRankingDraft(savedDraftText, locale);
        if (parsedDraft.draft === null) {
          setDraftCanBeSaved(false);
          setDraftSaveStatus("failed");
          setDraftMessage(parsedDraft.errorMessage);
        } else {
          setDraft(parsedDraft.draft);
          setDraftSaveStatus("saved");
          setDraftMessage(parsedDraft.errorMessage);
        }
      }
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }
      if (!(error instanceof Error)) {
        throw error;
      }
      setDraftCanBeSaved(false);
      setDraftSaveStatus("failed");
      setDraftMessage(`${copy.saveFailed} ${error.message}`);
    }

    setStorageReady(true);
  }, [copy, locale]);

  useEffect(() => {
    if (!storageReady || !draftCanBeSaved) {
      return;
    }

    try {
      writeBrowserToolStorage(kegRankingStorageKey, JSON.stringify(draft));
      setDraftSaveStatus("saved");
      setDraftMessage(null);
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }
      if (!(error instanceof Error)) {
        throw error;
      }
      setDraftSaveStatus("failed");
      setDraftMessage(`${copy.saveFailed} ${error.message}`);
    }
  }, [copy.saveFailed, draft, draftCanBeSaved, storageReady]);

  function updateDraft(nextDraft: KegRankingDraft) {
    setDraft(nextDraft);
    setDraftCanBeSaved(true);
    setDraftMessage(null);
  }

  async function copyCurrentResults() {
    const resultText = createKegRankingCopyText(
      displayRows,
      selectedDisplayRow,
      inventoryEstimate,
      draft,
      locale,
      copy,
    );
    try {
      await copyToolText(resultText);
      setCopyState({ message: copy.copySuccess, text: "" });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("Clipboard write failed.")) {
        throw error;
      }
      setCopyState({ message: copy.copyFailure(error.message), text: resultText });
    }
  }

  const saveStatusText =
    draftSaveStatus === "saved"
      ? copy.saveSaved
      : draftSaveStatus === "failed"
        ? copy.saveFailed
        : copy.saveEmpty;

  return (
    <div aria-labelledby="keg-ingredient-ranking-title" className={styles.kegRanking}>
      <header className={styles.heading}>
        <h2 id="keg-ingredient-ranking-title">{copy.title}</h2>
        <p>{copy.intro}</p>
        <p aria-live="polite" className={styles.status} role={draftSaveStatus === "failed" ? "alert" : "status"}>
          {draftMessage ?? saveStatusText}
        </p>
      </header>

      <section aria-labelledby="keg-ranking-controls-title" className={styles.panel}>
        <h2 id="keg-ranking-controls-title">{copy.rankingHeading}</h2>
        <div className={styles.controls}>
          <div className={styles.field}>
            <PlantingSelect
              inputId="keg-ranking-quality"
              label={copy.qualityLabel}
              onValueChange={(quality) =>
                updateDraft({ ...draft, quality: quality as KegRankingDraft["quality"] })
              }
              options={createQualityOptions(copy)}
              value={draft.quality}
            />
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="keg-ranking-profession"
              label={copy.professionLabel}
              onValueChange={(profession) =>
                updateDraft({ ...draft, profession: profession as KegRankingDraft["profession"] })
              }
              options={createProfessionOptions(copy)}
              value={draft.profession}
            />
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="keg-ranking-sort"
              label={copy.sortLabel}
              onValueChange={(sortBy) =>
                updateDraft({ ...draft, sortBy: sortBy as KegIngredientRankingSort })
              }
              options={[
                { value: "per-machine-cycle", label: copy.cycleSort },
                { value: "per-ingredient", label: copy.ingredientSort },
                { value: "per-processing-minute", label: copy.processingMinuteSort },
              ]}
              value={draft.sortBy}
            />
          </div>
        </div>
        <p className={styles.note}>{copy.rankingInstructions}</p>
        <p className={styles.note}>{copy.qualityFilterNote}</p>
        <details className={styles.optionalConditions}>
          <summary>{copy.specialConditions}</summary>
          <div className={styles.optionalConditionFields}>
            <label className={styles.checkboxField} htmlFor="keg-ranking-bears-knowledge">
              <input
                checked={draft.hasBearsKnowledge}
                id="keg-ranking-bears-knowledge"
                onChange={(event) => updateDraft({ ...draft, hasBearsKnowledge: event.currentTarget.checked })}
                type="checkbox"
              />
              {copy.bearsKnowledgeLabel}
            </label>
            <div className={styles.field}>
              <PlantingSelect
                inputId="keg-ranking-coconut-source"
                label={copy.coconutSourceLabel}
                onValueChange={(coconutSource) =>
                  updateDraft({ ...draft, coconutSource: coconutSource as ProcessingCoconutSource })
                }
                options={Object.entries(copy.coconutSourceOptions).map(([value, label]) => ({ value, label }))}
                value={draft.coconutSource}
              />
            </div>
          </div>
        </details>
        <p aria-live="polite" className={styles.note}>
          {copy.conditionSummary(
            draft.hasBearsKnowledge ? copy.bearsKnowledgeOn : copy.bearsKnowledgeOff,
            copy.coconutSourceOptions[draft.coconutSource],
          )}
        </p>
        <p className={styles.note}>{copy.processingMinuteExplanation}</p>
        {draft.selectedIngredientId.length > 0 && selectedDisplayRow?.rankingRow.ingredient.id !== draft.selectedIngredientId ? (
          <p className={styles.error} role="alert">
            {copy.selectedIngredientUnavailable(draft.selectedIngredientId)}
          </p>
        ) : null}
        <p aria-live="polite" className={styles.note}>
          {copy.rankingCount(displayRows.length)}
        </p>

        {displayRows.length === 0 ? (
          <p className={styles.note} role="status">
            {copy.noIngredients}
          </p>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.rankingTable}>
                <caption className={styles.visuallyHidden}>{copy.title}</caption>
                <thead>
                  <tr>
                    {copy.headers.map((header, headerIndex) => (
                      <th
                          aria-sort={readRankingHeaderSort(headerIndex, draft.sortBy)}
                        key={header}
                        scope="col"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((displayRow, rowIndex) => {
                    const ingredientId = displayRow.rankingRow.ingredient.id;
                    const isSelected = selectedDisplayRow?.rankingRow.ingredient.id === ingredientId;

                    return (
                      <tr className={isSelected ? styles.selectedRow : undefined} key={ingredientId}>
                        <td>
                          <button
                            aria-label={copy.rowButtonLabel(rowIndex + 1, readIngredientName(displayRow, locale), displayRow.productName)}
                            aria-pressed={isSelected}
                            className={styles.rowButton}
                            onClick={() => updateDraft({ ...draft, selectedIngredientId: ingredientId })}
                            type="button"
                          >
                            {readIngredientName(displayRow, locale)} → {displayRow.productName}
                          </button>
                        </td>
                        <td>{displayRow.batchInputUnits}</td>
                        <td>{formatGold(displayRow.rawUnitPrice, locale)} {copy.goldLabel}</td>
                        <td>{formatGold(displayRow.batchOutputPrice, locale)} {copy.goldLabel}</td>
                        <td>{formatProcessingCycle(displayRow, locale)}</td>
                        <td>{formatGold(displayRow.valueAddedPerIngredient, locale)} {copy.goldLabel}</td>
                        <td>{formatGold(displayRow.rankingRow.quote.valueAdded, locale)} {copy.goldLabel}</td>
                        <td>{formatProcessingMinuteValue(displayRow.valueAddedPerProcessingMinute, locale)} {copy.processingMinuteUnit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ol aria-label={copy.title} className={styles.mobileRankingList}>
              {displayRows.map((displayRow, rowIndex) => {
                const ingredientId = displayRow.rankingRow.ingredient.id;
                const isSelected = selectedDisplayRow?.rankingRow.ingredient.id === ingredientId;

                return (
                  <li key={ingredientId}>
                    <button
                      aria-label={copy.rowButtonLabel(rowIndex + 1, readIngredientName(displayRow, locale), displayRow.productName)}
                      aria-pressed={isSelected}
                      className={styles.rowButton}
                      onClick={() => updateDraft({ ...draft, selectedIngredientId: ingredientId })}
                      type="button"
                    >
                      <span className={styles.rowTitle}>
                        {rowIndex + 1}. {readIngredientName(displayRow, locale)} → {displayRow.productName}
                      </span>
                      <span className={styles.rowMetrics}>
                        {copy.headers[1]}: {displayRow.batchInputUnits} · {copy.headers[2]}: {formatGold(displayRow.rawUnitPrice, locale)} {copy.goldLabel} · {copy.headers[3]}: {formatGold(displayRow.batchOutputPrice, locale)} {copy.goldLabel} · {formatProcessingCycle(displayRow, locale)}
                      </span>
                      <span className={styles.rowMetrics}>
                        {copy.headers[5]}: {formatGold(displayRow.valueAddedPerIngredient, locale)} {copy.goldLabel} · {copy.headers[6]}: {formatGold(displayRow.rankingRow.quote.valueAdded, locale)} {copy.goldLabel} · {copy.headers[7]}: {formatProcessingMinuteValue(displayRow.valueAddedPerProcessingMinute, locale)} {copy.processingMinuteUnit}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </section>

      <section aria-labelledby="keg-inventory-check-title" className={styles.panel}>
        <h2 id="keg-inventory-check-title">{copy.inventoryHeading}</h2>
        {selectedDisplayRow === null ? (
          <p role="status">{copy.noSelection}</p>
        ) : (
          <>
            <p className={styles.note}>
              <strong>{copy.selectedIngredientLabel}:</strong> {readIngredientName(selectedDisplayRow, locale)} → {selectedDisplayRow.productName}
            </p>
            {draft.hasBearsKnowledge ? (
              <p className={styles.note}>
                {copy.bearsKnowledgeImpact(
                  isBearsKnowledgeEligible(selectedDisplayRow.rankingRow.ingredient.id),
                )}
              </p>
            ) : null}
            {getProcessingIngredientQualities(
              selectedDisplayRow.rankingRow.ingredient.id,
            ).length === 1 ? (
              <p className={styles.note}>{copy.qualityNote}</p>
            ) : null}
            <div className={styles.inventoryFields}>
              <div className={styles.field}>
                <label htmlFor="keg-inventory-quantity">{copy.quantityLabel}</label>
                <input
                  aria-describedby={quantityField.errorMessage === null ? undefined : "keg-inventory-quantity-error"}
                  aria-invalid={quantityField.errorMessage !== null}
                  id="keg-inventory-quantity"
                  min="0"
                  onChange={(event) => updateDraft({ ...draft, quantity: event.currentTarget.value })}
                  step="1"
                  type="number"
                  value={draft.quantity}
                />
                {quantityField.errorMessage === null ? null : (
                  <p className={styles.error} id="keg-inventory-quantity-error" role="alert">
                    {quantityField.errorMessage}
                  </p>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="keg-inventory-machine-count">{copy.kegCountLabel}</label>
                <input
                  aria-describedby={kegCountField.errorMessage === null ? undefined : "keg-inventory-machine-count-error"}
                  aria-invalid={kegCountField.errorMessage !== null}
                  id="keg-inventory-machine-count"
                  min="0"
                  onChange={(event) => updateDraft({ ...draft, kegCount: event.currentTarget.value })}
                  step="1"
                  type="number"
                  value={draft.kegCount}
                />
                {kegCountField.errorMessage === null ? null : (
                  <p className={styles.error} id="keg-inventory-machine-count-error" role="alert">
                    {kegCountField.errorMessage}
                  </p>
                )}
              </div>
              <div className={styles.field}>
                <PlantingSelect
                  inputId="keg-inventory-deadline"
                  label={copy.deadlineLabel}
                  onValueChange={(deadlineDays) =>
                    updateDraft({ ...draft, deadlineDays: deadlineDays as KegRankingDraft["deadlineDays"] })
                  }
                  options={createDeadlineOptions(copy)}
                  value={draft.deadlineDays}
                />
              </div>
            </div>
            <p className={styles.note}>{copy.inventoryInstructions}</p>
            <p className={styles.note}>{copy.collectionAssumption}</p>
            {quantityField.errorMessage !== null ||
            kegCountField.errorMessage !== null ||
            quantityField.value === null ||
            kegCountField.value === null ||
            inventoryEstimate === null ? (
              <p className={styles.note} role="status">
                {copy.estimateUnavailable}
              </p>
            ) : (
              <>
                <dl aria-label={copy.inventoryHeading} className={styles.inventoryResult}>
                  <div>
                    <dt>{copy.processedLabel}</dt>
                    <dd>{inventoryEstimate.processedUnits}</dd>
                  </div>
                  <div>
                    <dt>{copy.backlogLabel}</dt>
                    <dd>{inventoryEstimate.backlogUnits}</dd>
                  </div>
                  <div>
                    <dt>{copy.valueAddedLabel}</dt>
                    <dd>{formatGold(inventoryEstimate.valueAdded, locale)} {copy.goldLabel}</dd>
                  </div>
                </dl>
                <p aria-live="polite" className={styles.note} role="status">
                  {readInventoryMessage(inventoryEstimate, quantityField.value, kegCountField.value, copy)}
                </p>
              </>
            )}
          </>
        )}
      </section>

      <div className={styles.actions}>
        <button aria-describedby="keg-plan-disabled-note" className={styles.action} disabled={inventoryEstimate === null} onClick={transferCurrentInventory} type="button">
          {copy.productionPlanButton}
        </button>
        <button className={styles.action} disabled={displayRows.length === 0} onClick={copyCurrentResults} type="button">
          {copy.copyButton}
        </button>
      </div>
      <p className={styles.note} id="keg-plan-disabled-note">{copy.productionPlanDisabled}</p>
      {copyState === null ? null : (
        <div aria-live="polite" className={styles.status} role={copyState.text.length === 0 ? "status" : "alert"}>
          <p>{copyState.message}</p>
          {copyState.text.length === 0 ? null : (
            <div className={styles.field}>
              <label htmlFor="keg-ranking-copy-text">{copy.copyFieldLabel}</label>
              <textarea id="keg-ranking-copy-text" readOnly value={copyState.text} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function readKegRankingCopy(locale: PublicLocale): KegRankingCopy {
  const copy = kegRankingCopy[locale];
  if (copy === undefined) {
    throw new Error(`Unsupported Keg ingredient ranking locale. Received: ${JSON.stringify(locale)}.`);
  }
  return copy;
}

function createKegRankingDisplayRows(
  rankingRows: readonly KegIngredientRankingRow[],
  locale: PublicLocale,
): readonly KegRankingDisplayRow[] {
  return rankingRows.map((rankingRow) => {
    const productName =
      locale === "en"
        ? rankingRow.quote.productEnglishName
        : rankingRow.quote.productChineseName;
    if (productName.trim().length === 0) {
      throw new Error(
        `Applicable Keg ranking quote has an empty product name. Received ingredientId=${JSON.stringify(rankingRow.ingredient.id)}, productName=${JSON.stringify(productName)}.`,
      );
    }

    return {
      rankingRow,
      productName,
      batchInputUnits: rankingRow.quote.batchInputUnits,
      processingMinutes: rankingRow.quote.processingMinutes,
      processingMornings: rankingRow.quote.processingMornings,
      rawUnitPrice: rankingRow.quote.rawUnitPrice,
      batchOutputPrice: rankingRow.quote.batchOutputPrice,
      valueAddedPerIngredient: rankingRow.quote.valueAddedPerProcessedUnit,
      valueAddedPerProcessingMinute:
        rankingRow.quote.valueAdded / rankingRow.quote.processingMinutes,
    };
  });
}

function readIngredientName(row: KegRankingDisplayRow, locale: PublicLocale): string {
  return locale === "en"
    ? row.rankingRow.ingredient.englishName
    : row.rankingRow.ingredient.chineseName;
}

function formatProcessingCycle(row: KegRankingDisplayRow, locale: PublicLocale): string {
  return locale === "en"
    ? `${row.processingMornings} mornings (${row.processingMinutes.toLocaleString("en-US")} min)`
    : `${row.processingMornings} 个早晨（${row.processingMinutes.toLocaleString("zh-CN")} 分钟）`;
}

function formatGold(amount: number, locale: PublicLocale): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount);
}

function formatProcessingMinuteValue(amount: number, locale: PublicLocale): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(amount);
}

function readNonNegativeIntegerField(
  rawValue: string,
  fieldLabel: string,
  copy: KegRankingCopy,
): NonNegativeIntegerField {
  if (rawValue.trim().length === 0) {
    return { value: null, errorMessage: copy.invalidInteger(fieldLabel, rawValue) };
  }

  const parsedValue = Number(rawValue);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 0) {
    return { value: null, errorMessage: copy.invalidInteger(fieldLabel, rawValue) };
  }

  return { value: parsedValue, errorMessage: null };
}

function readInventoryMessage(
  estimate: ProcessingRouteQuote,
  quantity: number,
  kegCount: number,
  copy: KegRankingCopy,
): string {
  if (!estimate.applicable) {
    return copy.recipeUnavailable;
  }
  if (quantity === 0) {
    return copy.noStock;
  }
  if (kegCount === 0) {
    return copy.noKegs;
  }
  if (estimate.processedUnits === 0) {
    return copy.noCompletedBatch;
  }
  return estimate.backlogUnits === 0 ? copy.allProcessed : copy.partialProcessed;
}

function createQualityOptions(copy: KegRankingCopy) {
  return Object.entries(copy.qualityOptions).map(([value, label]) => ({ value, label }));
}

function createProfessionOptions(copy: KegRankingCopy) {
  return Object.entries(copy.professionOptions).map(([value, label]) => ({ value, label }));
}

function createDeadlineOptions(copy: KegRankingCopy) {
  return Object.entries(copy.deadlineOptions).map(([value, label]) => ({ value, label }));
}

function readRankingHeaderSort(
  headerIndex: number,
  sortBy: KegIngredientRankingSort,
): "descending" | undefined {
  if (headerIndex === 5 && sortBy === "per-ingredient") {
    return "descending";
  }
  if (headerIndex === 6 && sortBy === "per-machine-cycle") {
    return "descending";
  }
  if (headerIndex === 7 && sortBy === "per-processing-minute") {
    return "descending";
  }
  return undefined;
}

function createKegRankingCopyText(
  displayRows: readonly KegRankingDisplayRow[],
  selectedRow: KegRankingDisplayRow | null,
  estimate: ProcessingRouteQuote | null,
  draft: KegRankingDraft,
  locale: PublicLocale,
  copy: KegRankingCopy,
): string {
  const qualityLabel = copy.qualityOptions[draft.quality];
  const professionLabel = copy.professionOptions[draft.profession];
  const sortLabel = readKegRankingSortLabel(draft.sortBy, copy);
  const bearsKnowledgeLabel = draft.hasBearsKnowledge
    ? copy.bearsKnowledgeOn
    : copy.bearsKnowledgeOff;
  const coconutSourceLabel = copy.coconutSourceOptions[draft.coconutSource];
  const rowLines = displayRows.map((row, rowIndex) => {
    const ingredientName = readIngredientName(row, locale);
    const cycleValue = formatGold(row.rankingRow.quote.valueAdded, locale);
    const ingredientValue = formatGold(row.valueAddedPerIngredient, locale);
    const processingMinuteValue = formatProcessingMinuteValue(
      row.valueAddedPerProcessingMinute,
      locale,
    );
    return `${rowIndex + 1}. ${ingredientName} -> ${row.productName} | ${copy.headers[1]}: ${row.batchInputUnits} | ${copy.headers[2]}: ${formatGold(row.rawUnitPrice, locale)} ${copy.goldLabel} | ${copy.headers[3]}: ${formatGold(row.batchOutputPrice, locale)} ${copy.goldLabel} | ${copy.headers[4]}: ${formatProcessingCycle(row, locale)} | ${copy.headers[5]}: ${ingredientValue} ${copy.goldLabel} | ${copy.headers[6]}: ${cycleValue} ${copy.goldLabel} | ${copy.headers[7]}: ${processingMinuteValue} ${copy.processingMinuteUnit}`;
  });
  const selectedName = selectedRow === null ? copy.noSelection : readIngredientName(selectedRow, locale);
  const inventoryLine =
    selectedRow === null
      ? copy.noSelection
      : estimate === null
        ? `${selectedName} | ${copy.estimateUnavailable}`
        : `${selectedName} | ${copy.processedLabel}: ${estimate.processedUnits} | ${copy.backlogLabel}: ${estimate.backlogUnits} | ${copy.valueAddedLabel}: ${formatGold(estimate.valueAdded, locale)} ${copy.goldLabel}`;

  return [
    copy.title,
    `${copy.qualityLabel}: ${qualityLabel}`,
    `${copy.professionLabel}: ${professionLabel}`,
    `${copy.sortLabel}: ${sortLabel}`,
    copy.conditionSummary(bearsKnowledgeLabel, coconutSourceLabel),
    copy.processingMinuteExplanation,
    `${copy.quantityLabel}: ${draft.quantity}`,
    `${copy.kegCountLabel}: ${draft.kegCount}`,
    `${copy.deadlineLabel}: ${copy.deadlineOptions[draft.deadlineDays]}`,
    copy.inventoryInstructions,
    copy.collectionAssumption,
    ...rowLines,
    `${copy.inventoryHeading}: ${inventoryLine}`,
  ].join("\n");
}

function readKegRankingSortLabel(
  sortBy: KegIngredientRankingSort,
  copy: KegRankingCopy,
): string {
  if (sortBy === "per-machine-cycle") {
    return copy.cycleSort;
  }
  if (sortBy === "per-ingredient") {
    return copy.ingredientSort;
  }
  if (sortBy === "per-processing-minute") {
    return copy.processingMinuteSort;
  }

  throw new Error(
    `Unsupported Keg ranking sort label. Received: ${JSON.stringify(sortBy)}.`,
  );
}

export function readKegRankingDraft(
  savedDraftText: string,
  locale: PublicLocale,
): Readonly<{ draft: KegRankingDraft | null; errorMessage: string | null }> {
  return parseKegRankingDraft(savedDraftText, readKegRankingCopy(locale));
}

function parseKegRankingDraft(
  savedDraftText: string,
  copy: KegRankingCopy,
): Readonly<{ draft: KegRankingDraft | null; errorMessage: string | null }> {
  let savedValue: unknown;
  try {
    savedValue = JSON.parse(savedDraftText);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    return { draft: null, errorMessage: copy.draftInvalid(savedDraftText) };
  }

  if (typeof savedValue !== "object" || savedValue === null || Array.isArray(savedValue)) {
    return { draft: null, errorMessage: copy.draftInvalid(JSON.stringify(savedValue) ?? String(savedValue)) };
  }

  const fields = savedValue as Record<string, unknown>;
  const parsedDraft = createValidatedKegRankingDraft(fields);
  if (parsedDraft === null) {
    return { draft: null, errorMessage: copy.draftInvalid(JSON.stringify(savedValue)) };
  }
  return { draft: parsedDraft, errorMessage: null };
}

function createValidatedKegRankingDraft(
  fields: Record<string, unknown>,
): KegRankingDraft | null {
  if (!isProcessingQuality(fields.quality)) {
    return null;
  }
  if (!isProcessingProfession(fields.profession)) {
    return null;
  }
  if (
    fields.sortBy !== "per-machine-cycle" &&
    fields.sortBy !== "per-ingredient" &&
    fields.sortBy !== "per-processing-minute"
  ) {
    return null;
  }
  if (fields.hasBearsKnowledge !== undefined && typeof fields.hasBearsKnowledge !== "boolean") {
    return null;
  }
  if (fields.coconutSource !== undefined && !isProcessingCoconutSource(fields.coconutSource)) {
    return null;
  }
  if (typeof fields.selectedIngredientId !== "string") {
    return null;
  }
  if (typeof fields.quantity !== "string" || typeof fields.kegCount !== "string") {
    return null;
  }
  if (fields.deadlineDays !== "7" && fields.deadlineDays !== "14" && fields.deadlineDays !== "28") {
    return null;
  }

  return {
    quality: fields.quality,
    profession: fields.profession,
    hasBearsKnowledge: fields.hasBearsKnowledge ?? false,
    coconutSource: fields.coconutSource ?? "foraged",
    sortBy: fields.sortBy,
    selectedIngredientId: fields.selectedIngredientId,
    quantity: fields.quantity,
    kegCount: fields.kegCount,
    deadlineDays: fields.deadlineDays,
  };
}

function isProcessingQuality(value: unknown): value is KegRankingDraft["quality"] {
  return value === "normal" || value === "silver" || value === "gold" || value === "iridium";
}

function isProcessingProfession(value: unknown): value is KegRankingDraft["profession"] {
  return value === "none" || value === "tiller" || value === "artisan";
}

function isProcessingCoconutSource(value: unknown): value is ProcessingCoconutSource {
  return value === "foraged" || value === "purchased-or-gifted";
}
