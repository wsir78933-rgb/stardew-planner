"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type RefObject } from "react";
import Link from "next/link";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { getProductionToolCopy, type ProductionToolCopy } from "@/src/i18n/production-tool-copy";
import {
  calculateProductionPlan,
  createExampleProductionPlan,
  isProductionPlanInputValidationError,
  readProductionPlanInput,
  type ProductionInventoryBalance,
  type ProductionInventoryLine,
  type ProductionMachine,
  type ProductionMachineCounts,
  type ProductionPlanInput,
  type ProductionPlanResult,
  type ProductionProfession,
  type ProductionQuality,
} from "@/src/production-tools/production-model";
import {
  isProductionSaveImportError,
  parseProductionSaveFiles,
  ProductionSaveImportError,
  resolveProductionSaveInventoryItem,
  type ProductionSaveCandidate,
  type ProductionSaveInventoryItem,
  type ProductionSaveInventoryResolution,
} from "@/src/production-tools/production-save-import";
import {
  appendProductionInventory,
  confirmProductionTaskReview,
  createCropProfitProductionReview,
  createProductionPlanState,
  createProductionPlanShareFragment,
  isProductionPlanStateValidationError,
  parseProductionPlanShareFragment,
  parseProductionPlanState,
  productionPlanShareFragmentPrefix,
  productionPlanStateStorageKey,
  replaceProductionPlanInput,
  serializeProductionPlanState,
  setProductionPlanCurrentDay,
  setProductionTaskCompleted,
  undoProductionPlanChange,
  updateProductionPlanInput,
  type CropProfitProductionReview,
  type ProductionPlanState,
} from "@/src/production-tools/production-plan-state";
import {
  getProcessingIngredient,
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
  listProcessingIngredients,
  type ProcessingCoconutSource,
} from "@/src/processing-tools/processing-model";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  removeBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import { copyToolText } from "../copy-tool-text";
import { parseProductionPlanStorage, productionPlanStorageKey } from "../production-plan-record";
import { PlantingSelect, type PlantingSelectOption } from "../planting-select";
import { createProductionPlanIncomingHref } from "./production-plan-handoff";
import styles from "./production-planner-tool.module.css";

const INITIAL_PRODUCTION_INPUT: ProductionPlanInput = {
  inventory: [],
  machineCounts: { keg: 1, jar: 1, dehydrator: 1 },
  profession: "none",
  deadlineDays: 7,
};

const PRODUCTION_MACHINES: readonly ProductionMachine[] = ["keg", "jar", "dehydrator"];
const PRODUCTION_QUALITIES: readonly ProductionQuality[] = ["normal", "silver", "gold", "iridium"];
const PRODUCTION_PROFESSIONS: readonly ProductionProfession[] = ["none", "tiller", "artisan"];
const PRODUCTION_DEADLINES = [7, 14, 28] as const;

type ProductionPlannerView = "today" | "schedule";

export type ProductionPlannerToolProperties = Readonly<{
  locale: PublicLocale;
  view: ProductionPlannerView;
}>;

type InventoryLineDraft = Readonly<{
  id: string;
  ingredientId: string;
  quality: string;
  quantity: string;
  reservedQuantity: string;
  availableDay: string;
  hasBearsKnowledge: boolean;
  coconutSource: ProcessingCoconutSource;
}>;

type ProductionInputDraft = Readonly<{
  inventory: readonly InventoryLineDraft[];
  machineCounts: Readonly<Record<ProductionMachine, string>>;
  profession: string;
  deadlineDays: string;
}>;

type DraftValidation = Readonly<{
  input: ProductionPlanInput | null;
  errors: Readonly<Record<string, string>>;
}>;

type CopyFeedback = Readonly<{
  message: string;
  text: string | null;
}>;

type CopyFeedbackPanelProperties = Readonly<{
  copyFeedback: CopyFeedback | null;
  copy: ProductionToolCopy;
  manualCopyRef: RefObject<HTMLTextAreaElement | null>;
}>;

function CopyFeedbackPanel({ copyFeedback, copy, manualCopyRef }: CopyFeedbackPanelProperties) {
  if (copyFeedback === null) return null;

  return (
    <div aria-live="polite" className={styles.statusCard} role="status">
      <p className={styles.status}>{copyFeedback.message}</p>
      {copyFeedback.text === null ? null : (
        <div className={styles.manualCopy}>
          <label htmlFor="production-manual-copy">{copy.share.manualCopy}</label>
          <textarea className={styles.textArea} id="production-manual-copy" readOnly ref={manualCopyRef} value={copyFeedback.text} />
        </div>
      )}
    </div>
  );
}

type LegacyHarvestDraft = Readonly<{
  cropId: string;
  quantity: string;
  availableDay: string;
  quality: string;
}>;

type SaveInventoryResolutionDraft = Readonly<{
  ingredientId: string;
  quality: string;
  coconutSource: string;
}>;

function createEmptyProductionState(): ProductionPlanState {
  return createProductionPlanState(INITIAL_PRODUCTION_INPUT);
}

function readIncomingPlanFragment(hash: string): Readonly<{ input: ProductionPlanInput | null; error: string | null }> {
  if (typeof hash !== "string") {
    throw new Error(`Incoming plan hash must be a string. Received: ${JSON.stringify(hash)}.`);
  }
  if (!hash.startsWith(productionPlanShareFragmentPrefix)) {
    return { input: null, error: null };
  }

  try {
    return { input: parseProductionPlanShareFragment(hash), error: null };
  } catch (error) {
    if (!isProductionPlanStateValidationError(error)) throw error;
    return { input: null, error: error.message };
  }
}

function createInputDraft(input: ProductionPlanInput): ProductionInputDraft {
  return {
    inventory: input.inventory.map((line) => ({
      id: line.id,
      ingredientId: line.ingredientId,
      quality: line.quality,
      quantity: String(line.quantity),
      reservedQuantity: String(line.reservedQuantity),
      availableDay: String(line.availableDay),
      hasBearsKnowledge: line.hasBearsKnowledge ?? false,
      coconutSource: line.coconutSource ?? "foraged",
    })),
    machineCounts: {
      keg: String(input.machineCounts.keg),
      jar: String(input.machineCounts.jar),
      dehydrator: String(input.machineCounts.dehydrator),
    },
    profession: input.profession,
    deadlineDays: String(input.deadlineDays),
  };
}

function readProductionDraft(
  draft: ProductionInputDraft,
  copy: ProductionToolCopy,
): DraftValidation {
  const errors: Record<string, string> = {};
  const deadlineDays = readDraftInteger(draft.deadlineDays, copy.settings.horizon, "deadline", errors, copy);
  if (deadlineDays !== null && !PRODUCTION_DEADLINES.includes(deadlineDays as 7 | 14 | 28)) {
    errors.deadline = copy.validation.invalidSelection(copy.settings.horizon, draft.deadlineDays);
  }

  const profession = isProductionProfession(draft.profession) ? draft.profession : null;
  if (profession === null) {
    errors.profession = copy.validation.invalidSelection(copy.settings.profession, draft.profession);
  }

  const machineCounts = {} as Record<ProductionMachine, number>;
  for (const machine of PRODUCTION_MACHINES) {
    const count = readDraftInteger(
      draft.machineCounts[machine],
      copy.settings.machines[machine],
      `machine-${machine}`,
      errors,
      copy,
    );
    if (count !== null) machineCounts[machine] = count;
  }

  const ingredientsById = new Map(listProcessingIngredients().map((ingredient) => [ingredient.id, ingredient]));
  const inventory: ProductionInventoryLine[] = [];
  for (const lineDraft of draft.inventory) {
    const ingredient = ingredientsById.get(lineDraft.ingredientId);
    const itemErrorKey = inventoryFieldKey(lineDraft.id, "ingredientId");
    if (ingredient === undefined) {
      errors[itemErrorKey] = copy.validation.invalidSelection(
        copy.inventory.item,
        lineDraft.ingredientId,
      );
      continue;
    }

    const qualityOptions = getProcessingIngredientQualities(ingredient.id);
    const quality = PRODUCTION_QUALITIES.find(
      (candidateQuality) => candidateQuality === lineDraft.quality,
    );
    if (quality === undefined || !qualityOptions.includes(quality)) {
      errors[inventoryFieldKey(lineDraft.id, "quality")] = copy.validation.invalidSelection(
        copy.inventory.quality,
        lineDraft.quality,
      );
      continue;
    }

    const quantity = readDraftInteger(
      lineDraft.quantity,
      copy.inventory.quantity,
      inventoryFieldKey(lineDraft.id, "quantity"),
      errors,
      copy,
    );
    const reservedQuantity = readDraftInteger(
      lineDraft.reservedQuantity,
      copy.inventory.reserved,
      inventoryFieldKey(lineDraft.id, "reservedQuantity"),
      errors,
      copy,
    );
    const availableDay = readDraftInteger(
      lineDraft.availableDay,
      copy.inventory.availableDay,
      inventoryFieldKey(lineDraft.id, "availableDay"),
      errors,
      copy,
    );

    if (quantity !== null && reservedQuantity !== null && reservedQuantity > quantity) {
      errors[inventoryFieldKey(lineDraft.id, "reservedQuantity")] = copy.validation.reservedExceedsQuantity(
        lineDraft.reservedQuantity,
      );
    }
    if (availableDay !== null && deadlineDays !== null && availableDay > deadlineDays) {
      errors[inventoryFieldKey(lineDraft.id, "availableDay")] = copy.validation.arrivalOutsideHorizon(
        lineDraft.availableDay,
        deadlineDays,
      );
    }

    if (quantity === null || reservedQuantity === null || availableDay === null) continue;
    const hasBearsKnowledge = isBearsKnowledgeEligible(ingredient.id)
      ? lineDraft.hasBearsKnowledge
      : undefined;
    const coconutSource = ingredient.id === "coconut" ? lineDraft.coconutSource : undefined;
    inventory.push({
      id: lineDraft.id,
      ingredientId: ingredient.id,
      quality,
      quantity,
      reservedQuantity,
      availableDay,
      ...(hasBearsKnowledge === undefined ? {} : { hasBearsKnowledge }),
      ...(coconutSource === undefined ? {} : { coconutSource }),
    });
  }

  if (deadlineDays === null || profession === null || Object.keys(errors).length > 0) {
    return { input: null, errors };
  }

  const input = readProductionPlanInput({ inventory, machineCounts, profession, deadlineDays });
  return { input, errors };
}

function readDraftInteger(
  rawValue: string,
  fieldLabel: string,
  errorKey: string,
  errors: Record<string, string>,
  copy: ProductionToolCopy,
): number | null {
  if (!/^(0|[1-9]\d*)$/.test(rawValue)) {
    errors[errorKey] = copy.validation.invalidNumber(fieldLabel, rawValue);
    return null;
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < 0) {
    errors[errorKey] = copy.validation.invalidNumber(fieldLabel, rawValue);
    return null;
  }
  return value;
}

function isProductionProfession(value: string): value is ProductionProfession {
  return PRODUCTION_PROFESSIONS.includes(value as ProductionProfession);
}

function inventoryFieldKey(lineId: string, field: "ingredientId" | "quality" | "quantity" | "reservedQuantity" | "availableDay"): string {
  return `inventory.${lineId}.${field}`;
}

function createInventoryLineDraft(lineId: string): InventoryLineDraft {
  const ingredient = getProcessingIngredient("blueberry");
  const defaultQuality = getProcessingIngredientQualities(ingredient.id)[0];
  if (defaultQuality === undefined) {
    throw new Error(`Processing ingredient ${JSON.stringify(ingredient.id)} has no selectable quality.`);
  }

  return {
    id: lineId,
    ingredientId: ingredient.id,
    quality: defaultQuality,
    quantity: "0",
    reservedQuantity: "0",
    availableDay: "0",
    hasBearsKnowledge: false,
    coconutSource: "foraged",
  };
}

function formatProductionGold(value: number, locale: PublicLocale): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Production gold value must be a nonnegative finite number. Received: ${JSON.stringify(value)}.`);
  }
  return `${new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN", { maximumFractionDigits: 2 }).format(value)}g`;
}

function getIngredientName(ingredientId: string, locale: PublicLocale): string {
  const ingredient = getProcessingIngredient(ingredientId);
  return locale === "en" ? ingredient.englishName : ingredient.chineseName;
}

function getProductName(englishName: string, chineseName: string, locale: PublicLocale): string {
  return locale === "en" ? englishName : chineseName;
}

function getMachineName(machine: ProductionMachine, copy: ProductionToolCopy): string {
  return copy.settings.machines[machine];
}

function getQualityName(quality: ProductionQuality, copy: ProductionToolCopy): string {
  return copy.inventory.qualities[quality];
}

function getLocalizedRoutePrefix(locale: PublicLocale): "" | "/zh" {
  if (locale === "en") return "";
  if (locale === "zh-CN") return "/zh";
  throw new Error(`Unsupported production planner locale. Received: ${JSON.stringify(locale)}.`);
}

function createViewHref(
  locale: PublicLocale,
  view: ProductionPlannerView,
  incomingPlanFragment = "",
): string {
  if (incomingPlanFragment !== "" && !incomingPlanFragment.startsWith(productionPlanShareFragmentPrefix)) {
    throw new Error(`Incoming plan fragment has an unsupported prefix. Received: ${JSON.stringify(incomingPlanFragment)}.`);
  }
  const routePrefix = getLocalizedRoutePrefix(locale);
  return `${routePrefix}/tools/${view === "today" ? "today-processing-list" : "production-schedule"}${incomingPlanFragment}`;
}

function getProductionTaskLabel(
  task: ProductionPlanResult["dailySchedule"][number]["loadTasks"][number]
  | ProductionPlanResult["dailySchedule"][number]["collectTasks"][number],
  locale: PublicLocale,
  copy: ProductionToolCopy,
): string {
  const machineName = getMachineName(task.machine, copy);
  const productName = getProductName(task.productEnglishName, task.productChineseName, locale);
  const itemName = getIngredientName(task.ingredientId, locale);
  const qualityName = getQualityName(task.quality, copy);
  return task.kind === "load"
    ? `${copy.schedule.load}: ${task.inputUnits} ${qualityName} ${itemName} → ${task.batchCount} ${productName} (${machineName})`
    : `${copy.schedule.collect}: ${task.batchCount} ${productName} (${machineName})`;
}

function getSaveFailureMessage(error: unknown, copy: ProductionToolCopy): string {
  if (!isBrowserStorageFailure(error)) throw error;
  if (!(error instanceof Error)) {
    throw new Error(`Browser storage failure did not contain an Error instance. Received: ${JSON.stringify(error)}.`);
  }
  return `${copy.status.saveFailed} ${error.message}`;
}

function isKnownLegacyPlanFailure(error: unknown): error is Error {
  return error instanceof Error && error.message.includes("Received:");
}

export function ProductionPlannerTool({ locale, view }: ProductionPlannerToolProperties) {
  const copy = useMemo(() => getProductionToolCopy(locale), [locale]);
  const ingredients = useMemo(() => listProcessingIngredients(), []);
  const ingredientOptions = useMemo<readonly PlantingSelectOption[]>(
    () => ingredients.map((ingredient) => ({
      value: ingredient.id,
      label: locale === "en" ? ingredient.englishName : ingredient.chineseName,
    })),
    [ingredients, locale],
  );
  const [planState, setPlanState] = useState<ProductionPlanState>(createEmptyProductionState);
  const [inputDraft, setInputDraft] = useState<ProductionInputDraft>(() => createInputDraft(INITIAL_PRODUCTION_INPUT));
  const [setupExpanded, setSetupExpanded] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Readonly<Record<string, string>>>({});
  const [storageReady, setStorageReady] = useState(false);
  const [storageReadFailed, setStorageReadFailed] = useState(false);
  const [invalidSavedPlan, setInvalidSavedPlan] = useState(false);
  const [storageMessage, setStorageMessage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);
  const [incomingInput, setIncomingInput] = useState<ProductionPlanInput | null>(null);
  const [incomingError, setIncomingError] = useState<string | null>(null);
  const [incomingPlanFragment, setIncomingPlanFragment] = useState("");
  const [legacyReview, setLegacyReview] = useState<CropProfitProductionReview | null>(null);
  const [legacyDrafts, setLegacyDrafts] = useState<readonly LegacyHarvestDraft[]>([]);
  const [legacyPlanAvailable, setLegacyPlanAvailable] = useState(false);
  const [legacyError, setLegacyError] = useState<string | null>(null);
  const [saveCandidates, setSaveCandidates] = useState<readonly ProductionSaveCandidate[]>([]);
  const [skippedSaveFileNames, setSkippedSaveFileNames] = useState<readonly string[]>([]);
  const [selectedSaveIndex, setSelectedSaveIndex] = useState("");
  const [saveResolutions, setSaveResolutions] = useState<Readonly<Record<string, SaveInventoryResolutionDraft>>>({});
  const [saveProfession, setSaveProfession] = useState("");
  const [saveBearsKnowledge, setSaveBearsKnowledge] = useState("");
  const [saveImportError, setSaveImportError] = useState<string | null>(null);
  const [saveImportMessage, setSaveImportMessage] = useState<string | null>(null);
  const [saveImportBusy, setSaveImportBusy] = useState(false);
  const [saveImportExpanded, setSaveImportExpanded] = useState(false);
  const [legacyReviewExpanded, setLegacyReviewExpanded] = useState(false);
  const nextLineId = useRef(1);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const storageText = readBrowserToolStorage(productionPlanStateStorageKey);
      const restoredState = storageText === null
        ? createEmptyProductionState()
        : parseProductionPlanState(storageText);
      setPlanState(restoredState);
      setInputDraft(createInputDraft(restoredState.current.input));
      setSetupExpanded(restoredState.current.input.inventory.length === 0);
      setStorageMessage(storageText === null ? null : copy.status.saved);
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setStorageReadFailed(true);
        setStorageMessage(getSaveFailureMessage(error, copy));
      } else if (isProductionPlanStateValidationError(error)) {
        setInvalidSavedPlan(true);
        setStorageMessage(error.message);
      } else {
        throw error;
      }
    }

    setStorageReady(true);
  }, [copy]);

  useEffect(() => {
    function synchronizeIncomingPlanFromHash() {
      const currentHash = window.location.hash;
      if (currentHash === "#incoming-production-plan") return;
      setIncomingPlanFragment(
        currentHash.startsWith(productionPlanShareFragmentPrefix) ? currentHash : "",
      );
      const incomingPlan = readIncomingPlanFragment(currentHash);
      setIncomingInput(incomingPlan.input);
      setIncomingError(incomingPlan.error);
    }

    synchronizeIncomingPlanFromHash();
    window.addEventListener("hashchange", synchronizeIncomingPlanFromHash);
    return () => window.removeEventListener("hashchange", synchronizeIncomingPlanFromHash);
  }, []);

  useEffect(() => {
    function expandDeepLinkedPanel() {
      if (window.location.hash === "#import-save") setSaveImportExpanded(true);
      if (window.location.hash === "#crop-profit-review") setLegacyReviewExpanded(true);
    }

    expandDeepLinkedPanel();
    window.addEventListener("hashchange", expandDeepLinkedPanel);
    return () => window.removeEventListener("hashchange", expandDeepLinkedPanel);
  }, []);

  useEffect(() => {
    if (!storageReady || storageReadFailed || invalidSavedPlan) return;

    try {
      writeBrowserToolStorage(productionPlanStateStorageKey, serializeProductionPlanState(planState));
      setStorageMessage(copy.status.saved);
    } catch (error) {
      if (!isBrowserStorageFailure(error)) throw error;
      setStorageMessage(getSaveFailureMessage(error, copy));
    }
  }, [copy, invalidSavedPlan, planState, storageReadFailed, storageReady]);

  useEffect(() => {
    if (copyFeedback?.text !== null && copyFeedback?.text !== undefined) {
      manualCopyRef.current?.focus();
      manualCopyRef.current?.select();
    }
  }, [copyFeedback]);

  const draftValidation = readProductionDraft(inputDraft, copy);
  const hasDraftErrors = Object.keys(fieldErrors).length > 0 || Object.keys(draftValidation.errors).length > 0;
  const currentResult = storageReady && !invalidSavedPlan && !hasDraftErrors
    ? calculateProductionPlan(planState.current.input)
    : null;
  const hasCurrentInventory = planState.current.input.inventory.length > 0;
  const activeDay = Math.min(planState.current.currentDay, planState.current.input.deadlineDays);
  const activeScheduleDay = currentResult?.dailySchedule.find((day) => day.day === activeDay) ?? null;
  const allScheduledTasks = currentResult?.dailySchedule.flatMap((day) => [...day.collectTasks, ...day.loadTasks]) ?? [];
  const completedTaskIds = new Set(planState.current.completedTaskIds);
  const allTasksComplete = allScheduledTasks.length > 0 && allScheduledTasks.every((task) => completedTaskIds.has(task.id));
  const hasAnyUndo = planState.undoSnapshot !== null;
  const currentDeadlineLabel = copy.settings.deadlines[planState.current.input.deadlineDays];
  const currentMachineLabel = formatMachineCounts(planState.current.input.machineCounts, copy);
  const settingsSummary = copy.settings.summary(
    planState.current.input.inventory.length,
    currentDeadlineLabel,
    copy.settings.professions[planState.current.input.profession],
    currentMachineLabel,
  );

  function applyInputDraft(nextDraft: ProductionInputDraft) {
    setInputDraft(nextDraft);
    const validation = readProductionDraft(nextDraft, copy);
    setFieldErrors(validation.errors);
    if (validation.input === null) return;
    setPlanState((currentState) => updateProductionPlanInput(currentState, validation.input as ProductionPlanInput));
  }

  function resetInputDraft(nextInput: ProductionPlanInput, nextState: ProductionPlanState) {
    setInputDraft(createInputDraft(nextInput));
    setFieldErrors({});
    setPlanState(nextState);
  }

  function addInventoryRow() {
    const nextDraft: ProductionInputDraft = {
      ...inputDraft,
      inventory: [...inputDraft.inventory, createInventoryLineDraft(createUniqueInventoryLineId("production-line"))],
    };
    applyInputDraft(nextDraft);
  }

  function createUniqueInventoryLineId(prefix: string): string {
    if (prefix.trim().length === 0) {
      throw new Error(`Production inventory ID prefix must be nonempty. Received: ${JSON.stringify(prefix)}.`);
    }
    const existingIds = new Set([
      ...planState.current.input.inventory.map((line) => line.id),
      ...inputDraft.inventory.map((line) => line.id),
    ]);
    let candidateId = `${prefix}-${nextLineId.current++}`;
    while (existingIds.has(candidateId)) {
      candidateId = `${prefix}-${nextLineId.current++}`;
    }
    return candidateId;
  }

  function updateInventoryRow(lineId: string, update: (lineDraft: InventoryLineDraft) => InventoryLineDraft) {
    const nextDraft: ProductionInputDraft = {
      ...inputDraft,
      inventory: inputDraft.inventory.map((lineDraft) => lineDraft.id === lineId ? update(lineDraft) : lineDraft),
    };
    applyInputDraft(nextDraft);
  }

  function removeInventoryRow(lineId: string) {
    const nextDraft: ProductionInputDraft = {
      ...inputDraft,
      inventory: inputDraft.inventory.filter((lineDraft) => lineDraft.id !== lineId),
    };
    applyInputDraft(nextDraft);
  }

  function changeIngredient(lineId: string, ingredientId: string) {
    const nextIngredient = getProcessingIngredient(ingredientId);
    const supportedQualities = getProcessingIngredientQualities(ingredientId);
    const currentLine = inputDraft.inventory.find((lineDraft) => lineDraft.id === lineId);
    if (currentLine === undefined) {
      throw new Error(`Production inventory line was not found. Received id=${JSON.stringify(lineId)}.`);
    }
    const quality = supportedQualities.includes(currentLine.quality as ProductionQuality)
      ? currentLine.quality
      : supportedQualities[0];
    if (quality === undefined) {
      throw new Error(`Processing ingredient ${JSON.stringify(ingredientId)} has no supported quality.`);
    }
    updateInventoryRow(lineId, (lineDraft) => ({
      ...lineDraft,
      ingredientId: nextIngredient.id,
      quality,
      hasBearsKnowledge: isBearsKnowledgeEligible(nextIngredient.id) ? lineDraft.hasBearsKnowledge : false,
      coconutSource: nextIngredient.id === "coconut" ? lineDraft.coconutSource : "foraged",
    }));
  }

  function updateMachineCount(machine: ProductionMachine, rawValue: string) {
    applyInputDraft({
      ...inputDraft,
      machineCounts: { ...inputDraft.machineCounts, [machine]: rawValue },
    });
  }

  function changeDeadline(deadlineDays: string) {
    applyInputDraft({ ...inputDraft, deadlineDays });
  }

  function changeProfession(profession: string) {
    applyInputDraft({ ...inputDraft, profession });
  }

  function loadExamplePlan() {
    const exampleInput = readProductionPlanInput(createExampleProductionPlan());
    const nextState = replaceProductionPlanInput(planState, exampleInput);
    resetInputDraft(exampleInput, nextState);
    setSetupExpanded(false);
  }

  function startEmptyPlan() {
    const emptyInput = readProductionPlanInput({
      ...planState.current.input,
      inventory: [],
    });
    const nextState = replaceProductionPlanInput(planState, emptyInput);
    resetInputDraft(emptyInput, nextState);
    setSetupExpanded(true);
  }

  function selectDay(day: number) {
    setPlanState((currentState) => setProductionPlanCurrentDay(currentState, day));
  }

  function toggleTask(taskId: string, completed: boolean) {
    setPlanState((currentState) => setProductionTaskCompleted(currentState, taskId, completed));
  }

  function confirmTaskReview() {
    if (currentResult === null) return;
    const scheduledIds = new Set(
      currentResult.dailySchedule.flatMap((day) => [...day.collectTasks, ...day.loadTasks].map((task) => task.id)),
    );
    const reviewedCompletedIds = planState.current.completedTaskIds.filter((taskId) => scheduledIds.has(taskId));
    setPlanState((currentState) => confirmProductionTaskReview(currentState, reviewedCompletedIds));
  }

  function resetInvalidSavedPlan() {
    if (!invalidSavedPlan) {
      throw new Error(`Production plan reset is only available after invalid saved state. Received: ${JSON.stringify(invalidSavedPlan)}.`);
    }
    try {
      removeBrowserToolStorage(productionPlanStateStorageKey);
      const emptyState = createEmptyProductionState();
      resetInputDraft(emptyState.current.input, emptyState);
      setInvalidSavedPlan(false);
      setStorageReadFailed(false);
      setStorageMessage(copy.status.saved);
    } catch (error) {
      if (!isBrowserStorageFailure(error)) throw error;
      setStorageMessage(getSaveFailureMessage(error, copy));
    }
  }

  function clearIncomingFragment() {
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
    setIncomingInput(null);
    setIncomingError(null);
    setIncomingPlanFragment("");
  }

  function applyIncomingPlan(mode: "append" | "replace") {
    if (incomingInput === null) {
      throw new Error(`Cannot apply incoming plan without a validated input. Received: ${JSON.stringify(incomingInput)}.`);
    }
    const nextState = mode === "replace"
      ? replaceProductionPlanInput(planState, incomingInput)
      : appendProductionInventory(
          planState,
          incomingInput.inventory.map((line) => ({
            ...line,
            id: createUniqueInventoryLineId("incoming"),
          })),
        );
    resetInputDraft(nextState.current.input, nextState);
    setSetupExpanded(nextState.current.input.inventory.length === 0);
    clearIncomingFragment();
  }

  function keepCurrentPlan() {
    clearIncomingFragment();
  }

  async function copyText(text: string) {
    try {
      await copyToolText(text);
      setCopyFeedback({ message: copy.status.copySucceeded, text: null });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("Clipboard write failed.")) {
        throw error;
      }
      setCopyFeedback({ message: `${copy.status.copyFailed} ${error.message}`, text });
    }
  }

  function copyPlanSummary() {
    if (currentResult === null) return;
    void copyText(createProductionSummaryText(planState.current.input, currentResult, locale, copy));
  }

  function copyTodayTasks() {
    if (currentResult === null) return;
    void copyText(createTodayTasksText(activeDay, planState.current.input, activeScheduleDay, locale, copy));
  }

  function copyPlanLink() {
    const relativeHref = createProductionPlanIncomingHref(locale, planState.current.input);
    const absoluteHref = `${window.location.origin}${relativeHref}`;
    void copyText(absoluteHref);
  }

  function restorePreviousPlan() {
    if (!hasAnyUndo) {
      throw new Error(`Cannot restore production plan because undo is unavailable. Received: ${JSON.stringify(hasAnyUndo)}.`);
    }
    const previousState = undoProductionPlanChange(planState);
    resetInputDraft(previousState.current.input, previousState);
  }

  function openSavedCropPlanReview() {
    setLegacyError(null);
    setLegacyReview(null);
    setLegacyDrafts([]);
    try {
      const savedCropPlanText = readBrowserToolStorage(productionPlanStorageKey);
      if (savedCropPlanText === null) {
        setLegacyError(copy.legacy.noSavedPlan);
        return;
      }
      const review = createCropProfitProductionReview(parseProductionPlanStorage(savedCropPlanText));
      setLegacyReview(review);
      setLegacyDrafts(review.estimatedHarvests.map((harvest) => ({
        cropId: harvest.cropId,
        quantity: "",
        availableDay: "",
        quality: "",
      })));
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setLegacyError(getSaveFailureMessage(error, copy));
        return;
      }
      if (isKnownLegacyPlanFailure(error)) {
        setLegacyError(error.message);
        return;
      }
      throw error;
    }
  }

  function updateLegacyHarvestDraft(cropId: string, update: (draft: LegacyHarvestDraft) => LegacyHarvestDraft) {
    setLegacyDrafts((currentDrafts) => currentDrafts.map((harvestDraft) =>
      harvestDraft.cropId === cropId ? update(harvestDraft) : harvestDraft,
    ));
  }

  function addReviewedLegacyHarvests() {
    if (legacyReview === null) return;
    const selectedLines = createConfirmedLegacyInventoryLines(
      legacyReview,
      legacyDrafts,
      planState.current.input.deadlineDays,
      locale,
      copy,
    );
    if (selectedLines.errors.length > 0) {
      setLegacyError(selectedLines.errors.join(" "));
      return;
    }
    if (selectedLines.inventory.length === 0) {
      setLegacyError(copy.legacy.addConfirmed);
      return;
    }
    const importedLines = selectedLines.inventory.map((line) => ({
      ...line,
      id: createUniqueInventoryLineId("crop-profit"),
    }));
    const nextState = appendProductionInventory(planState, importedLines);
    resetInputDraft(nextState.current.input, nextState);
    setLegacyError(copy.import.confirmed);
  }

  function setSelectedSaveCandidate(indexValue: string, candidates = saveCandidates) {
    const index = Number(indexValue);
    if (!Number.isSafeInteger(index) || index < 0 || index >= candidates.length) {
      throw new Error(`Save candidate index must match a parsed save. Received: ${JSON.stringify(indexValue)}.`);
    }
    const candidate = candidates[index];
    if (candidate === undefined) {
      throw new Error(`Save candidate was not found. Received index=${index}.`);
    }
    setSelectedSaveIndex(indexValue);
    setSaveResolutions(createSaveResolutionDrafts(candidate));
    setSaveProfession(candidate.profession ?? "");
    setSaveBearsKnowledge(candidate.hasBearsKnowledge === null ? "" : String(candidate.hasBearsKnowledge));
    setSaveImportError(null);
    setSaveImportMessage(null);
  }

  async function loadSaveCandidates(files: readonly File[]) {
    if (files.length === 0) {
      setSaveImportError(copy.import.fileRequired);
      setSaveCandidates([]);
      setSelectedSaveIndex("");
      setSkippedSaveFileNames([]);
      return;
    }
    setSaveImportBusy(true);
    setSaveImportError(null);
    setSaveImportMessage(null);
    setSkippedSaveFileNames([]);
    const skippedFileNames: string[] = [];
    try {
      const folderSelection = files.some((file) => file.webkitRelativePath.length > 0);
      const candidates: ProductionSaveCandidate[] = [];
      for (const file of files) {
        const sourceName = file.webkitRelativePath || file.name;
        const xmlText = await readProductionSaveFile(file);
        if (folderSelection && !hasSaveGameRootElement(xmlText) && !isLikelyPrimarySaveFile(file)) {
          skippedFileNames.push(sourceName);
          continue;
        }
        const parsedCandidates = parseProductionSaveFiles([{ sourceName, xmlText }]);
        const candidate = parsedCandidates[0];
        if (candidate === undefined) {
          throw new ProductionSaveImportError(
            `Save parser returned no candidate for selected source ${JSON.stringify(sourceName)}.`,
          );
        }
        candidates.push(candidate);
      }
      setSkippedSaveFileNames(skippedFileNames);
      if (candidates.length === 0) {
        setSaveCandidates([]);
        setSelectedSaveIndex("");
        setSaveImportError(copy.import.noSaveGameFiles);
        return;
      }
      setSaveCandidates(candidates);
      if (candidates.length === 1) {
        setSelectedSaveCandidate("0", candidates);
      } else {
        setSelectedSaveIndex("");
        setSaveResolutions({});
        setSaveProfession("");
        setSaveBearsKnowledge("");
      }
    } catch (error) {
      if (!isProductionSaveImportError(error)) throw error;
      setSaveImportError(error.message);
      setSaveCandidates([]);
      setSelectedSaveIndex("");
      setSkippedSaveFileNames(skippedFileNames);
    } finally {
      setSaveImportBusy(false);
    }
  }

  function updateSaveResolution(itemId: string, update: (resolution: SaveInventoryResolutionDraft) => SaveInventoryResolutionDraft) {
    setSaveResolutions((currentResolutions) => {
      const currentResolution = currentResolutions[itemId];
      if (currentResolution === undefined) {
        throw new Error(`Save item resolution was not found. Received itemId=${JSON.stringify(itemId)}.`);
      }
      return { ...currentResolutions, [itemId]: update(currentResolution) };
    });
  }

  function applySaveImport(mode: "append" | "replace") {
    const candidate = selectedSaveCandidate;
    if (candidate === null) {
      throw new Error(`Cannot apply save import without a selected candidate. Received index=${JSON.stringify(selectedSaveIndex)}.`);
    }
    const resolvedInventory = resolveSelectedSaveInventory(
      candidate.inventoryItems,
      saveResolutions,
      saveBearsKnowledge,
      copy,
    );
    if (resolvedInventory.errors.length > 0) {
      setSaveImportError(resolvedInventory.errors.join(" "));
      return;
    }
    if (resolvedInventory.inventory.length === 0) {
      setSaveImportError(copy.import.noInventoryDetected);
      return;
    }
    if (mode === "replace" && !isProductionProfession(saveProfession)) {
      setSaveImportError(copy.validation.invalidSelection(copy.settings.profession, saveProfession));
      return;
    }

    const importedInventory = resolvedInventory.inventory.map((line) => ({
      ...line,
      id: mode === "append" ? createUniqueInventoryLineId("save-import") : line.id,
    }));
    const nextState = mode === "append"
      ? appendProductionInventory(planState, importedInventory)
      : replaceProductionPlanInput(planState, readProductionPlanInput({
          inventory: importedInventory,
          machineCounts: candidate.machineCounts,
        profession: saveProfession as ProductionProfession,
          deadlineDays: planState.current.input.deadlineDays,
        }));
    resetInputDraft(nextState.current.input, nextState);
    clearSaveImportPreview();
    setSaveImportError(null);
    setSaveImportMessage(copy.import.confirmed);
  }

  function clearSaveImportPreview() {
    setSaveCandidates([]);
    setSkippedSaveFileNames([]);
    setSelectedSaveIndex("");
    setSaveResolutions({});
    setSaveProfession("");
    setSaveBearsKnowledge("");
    setSaveImportError(null);
  }

  function cancelSaveImportPreview() {
    clearSaveImportPreview();
    setSaveImportMessage(copy.import.cancel);
  }

  const selectedSaveCandidate = selectedSaveIndex === ""
    ? null
    : saveCandidates[Number(selectedSaveIndex)] ?? null;

  return (
    <section
      aria-labelledby="production-planner-title"
      className={styles.planner}
      data-production-planner
      data-view={view}
    >
      <header className={styles.heading}>
        <h2 className={styles.title} id="production-planner-title">{copy.plannerTitle}</h2>
        <p className={styles.description}>{copy.description}</p>
      </header>

      {incomingInput === null && incomingError === null ? null : (
        <IncomingPlanPanel
          errorMessage={incomingError}
          input={incomingInput}
          locale={locale}
          currentDeadlineDays={planState.current.input.deadlineDays}
          onAppend={() => applyIncomingPlan("append")}
          onKeep={keepCurrentPlan}
          onReplace={() => applyIncomingPlan("replace")}
          copy={copy}
        />
      )}

      <div className={styles.workspace}>
        <div className={styles.sharedControls}>
          <p aria-live="polite" className={storageReadFailed || invalidSavedPlan ? styles.error : styles.status} role="status">
            {storageMessage ?? copy.status.saving}
          </p>
          <details className={styles.moreActions}>
            <summary className={styles.moreActionsSummary}>{copy.actions.more}</summary>
            <div className={styles.moreActionsPanel}>
              <button className={styles.buttonSecondary} onClick={startEmptyPlan} type="button">{copy.actions.startEmpty}</button>
              <button className={styles.buttonSecondary} onClick={loadExamplePlan} type="button">{copy.actions.loadExample}</button>
              {hasAnyUndo ? (
                <button className={styles.buttonSecondary} onClick={restorePreviousPlan} type="button">{copy.actions.undoPlanChange}</button>
              ) : null}
              <a className={styles.buttonSecondary} href="#import-save" onClick={() => setSaveImportExpanded(true)}>{copy.import.title}</a>
              <a className={styles.buttonSecondary} href="#crop-profit-review" onClick={() => setLegacyReviewExpanded(true)}>{copy.import.reviewOldPlan}</a>
              {incomingInput !== null || incomingError !== null ? (
                <a className={styles.buttonSecondary} href="#incoming-production-plan">{copy.share.reviewIncoming}</a>
              ) : null}
            </div>
          </details>
        </div>

        {invalidSavedPlan ? (
          <div className={styles.statusCard}>
            <p className={styles.error} role="alert">{storageMessage}</p>
            <button className={styles.buttonSecondary} onClick={resetInvalidSavedPlan} type="button">
              {copy.import.resetInvalidPlan}
            </button>
          </div>
        ) : null}
        {storageReadFailed ? <p className={styles.error} role="alert">{storageMessage}</p> : null}

        {hasDraftErrors ? <p className={styles.error} role="alert">{copy.validation.fixFields}</p> : null}
        {!storageReady ? <p aria-live="polite" className={styles.status} role="status">{copy.status.saving}</p> : null}

        <details
          className={styles.planSetup}
          onToggle={(event) => {
            const requestedOpen = event.currentTarget.open;
            if (!requestedOpen && hasDraftErrors) {
              setSetupExpanded(true);
              return;
            }
            setSetupExpanded(requestedOpen);
          }}
          open={setupExpanded || hasDraftErrors}
        >
          <summary
            className={styles.planSetupSummary}
            onClick={(event) => {
              if (hasDraftErrors) event.preventDefault();
            }}
            onKeyDown={(event) => {
              if (hasDraftErrors && (event.key === "Enter" || event.key === " ")) event.preventDefault();
            }}
          >
            <span>{settingsSummary}</span>
            <span>{setupExpanded ? copy.settings.collapseSummary : copy.settings.editSummary}</span>
          </summary>
          <div className={styles.planSetupContent}>
            <section aria-label={copy.settings.title} className={styles.settingsGrid}>
              <div className={styles.field}>
                <PlantingSelect
                  inputId="production-deadline-days"
                  label={copy.settings.horizon}
                  value={inputDraft.deadlineDays}
                  options={PRODUCTION_DEADLINES.map((day) => ({ value: String(day), label: copy.settings.deadlines[day] }))}
                  onValueChange={changeDeadline}
                  errorMessage={fieldErrors.deadline ?? null}
                />
              </div>
              <div className={styles.field}>
                <PlantingSelect
                  inputId="production-profession"
                  label={copy.settings.profession}
                  value={inputDraft.profession}
                  options={PRODUCTION_PROFESSIONS.map((profession) => ({ value: profession, label: copy.settings.professions[profession] }))}
                  onValueChange={changeProfession}
                  errorMessage={fieldErrors.profession ?? null}
                />
              </div>
              <fieldset className={styles.machineSettings}>
                <legend className={styles.inventoryLabel}>{copy.settings.machineCounts}</legend>
                <div className={styles.machineGrid}>
                  {PRODUCTION_MACHINES.map((machine) => renderNumericField({
                    id: `production-machine-count-${machine}`,
                    label: copy.settings.machines[machine],
                    value: inputDraft.machineCounts[machine],
                    errorMessage: fieldErrors[`machine-${machine}`] ?? null,
                    onChange: (rawValue) => updateMachineCount(machine, rawValue),
                  }))}
                </div>
              </fieldset>
            </section>

            <section aria-labelledby="production-inventory-title" className={styles.inventorySection}>
              <div className={styles.sectionHeading}>
                <h3 className={styles.sectionTitle} id="production-inventory-title">{copy.inventory.title}</h3>
                <button className={styles.buttonSecondary} onClick={addInventoryRow} type="button">{copy.inventory.add}</button>
              </div>
              <p className={styles.note}>{copy.inventory.reservedHelp} {copy.inventory.availableDayHelp}</p>
              {inputDraft.inventory.length === 0 ? <p className={styles.emptyState}>{copy.today.noInventory}</p> : (
                <>
                  <div className={styles.desktopInventory}>
                    {renderInventoryTable({
                      inventory: inputDraft.inventory,
                      locale,
                      copy,
                      ingredientOptions,
                      errors: fieldErrors,
                      onIngredientChange: changeIngredient,
                      onLineChange: updateInventoryRow,
                      onRemove: removeInventoryRow,
                    })}
                  </div>
                  <ul className={`${styles.inventoryList} ${styles.mobileInventory}`}>
                    {inputDraft.inventory.map((lineDraft, index) => renderInventoryLine({
                      lineDraft,
                      index,
                      locale,
                      copy,
                      ingredientOptions,
                      errors: fieldErrors,
                      idSuffix: "mobile",
                      onIngredientChange: (ingredientId) => changeIngredient(lineDraft.id, ingredientId),
                      onLineChange: (update) => updateInventoryRow(lineDraft.id, update),
                      onRemove: () => removeInventoryRow(lineDraft.id),
                    }))}
                  </ul>
                </>
              )}
            </section>
          </div>
        </details>

        <nav aria-label={locale === "en" ? "Production views" : "生产视图"} className={styles.viewNavigation}>
          <Link
            aria-current={view === "today" ? "page" : undefined}
            className={view === "today" ? styles.viewLinkCurrent : styles.viewLink}
            href={createViewHref(locale, "today", incomingPlanFragment)}
          >
            {copy.navigation.today}
          </Link>
          <Link
            aria-current={view === "schedule" ? "page" : undefined}
            className={view === "schedule" ? styles.viewLinkCurrent : styles.viewLink}
            href={createViewHref(locale, "schedule", incomingPlanFragment)}
          >
            {copy.navigation.schedule}
          </Link>
        </nav>

        {currentResult === null || !hasCurrentInventory ? null : view === "today" ? (
          <>
            <TodayTasksPanel
              day={activeDay}
              input={planState.current.input}
              result={currentResult}
              scheduleDay={activeScheduleDay}
              completedTaskIds={completedTaskIds}
              allTasksComplete={allTasksComplete}
              needsReview={planState.current.taskChecklistNeedsReview}
              copy={copy}
              locale={locale}
              onSelectDay={selectDay}
              onToggleTask={toggleTask}
              onConfirmReview={confirmTaskReview}
              onCopyToday={copyTodayTasks}
              scheduleHref={createViewHref(locale, "schedule", incomingPlanFragment)}
              copyFeedback={copyFeedback}
              manualCopyRef={manualCopyRef}
            />
            <p className={`${styles.note} ${styles.reservedStockNote}`}>
              {locale === "en"
                ? `Reserved stock is separate: ${planState.current.input.inventory.reduce((total, line) => total + line.reservedQuantity, 0)} units worth ${formatProductionGold(currentResult.reservedValue, locale)}. It is excluded from the raw-sale baseline, final value, and added value.`
                : `预留库存单独计算：${planState.current.input.inventory.reduce((total, line) => total + line.reservedQuantity, 0)} 件，价值 ${formatProductionGold(currentResult.reservedValue, locale)}。它不计入直接出售基准、最终价值或额外增值。`}
            </p>
            <details className={styles.planSummary}>
              <summary className={`${styles.planSetupSummary} ${styles.planSummaryHighlights}`}>
                <span>{copy.today.summaryTitle}</span>
                <span className={styles.summaryHighlights}>{copy.today.summaryHighlights(
                  formatProductionGold(currentResult.additionalValue, locale),
                  formatProductionGold(currentResult.finalValue, locale),
                  formatProductionGold(currentResult.directSaleBaselineValue, locale),
                  `${Math.round(currentResult.utilization.ratio * 100)}%`,
                )}</span>
              </summary>
              <div className={styles.summaryContent}>
                <dl aria-label={copy.today.summaryTitle} className={styles.metricGrid}>
                  {renderMetric(copy.schedule.machineUtilization, `${Math.round(currentResult.utilization.ratio * 100)}%`)}
                  {renderMetric(copy.schedule.addedValue, formatProductionGold(currentResult.additionalValue, locale))}
                  {renderMetric(copy.schedule.finalValue, formatProductionGold(currentResult.finalValue, locale))}
                  {renderMetric(copy.schedule.rawSaleBaseline, formatProductionGold(currentResult.directSaleBaselineValue, locale))}
                </dl>
                <p className={styles.note}>{copy.schedule.assumptions}</p>
              </div>
            </details>
          </>
        ) : (
          <ProductionSchedulePanel
            input={planState.current.input}
            result={currentResult}
            currentDay={activeDay}
            locale={locale}
            copy={copy}
            onCopySummary={copyPlanSummary}
            onCopyPlanLink={copyPlanLink}
            todayHref={createViewHref(locale, "today", incomingPlanFragment)}
            copyFeedback={copyFeedback}
            manualCopyRef={manualCopyRef}
          />
        )}
        {view === "schedule" && (currentResult === null || !hasCurrentInventory) && storageReady && !invalidSavedPlan && !storageReadFailed ? (
          <section aria-label={copy.schedule.title} className={styles.statusCard}>
            <p className={styles.emptyState}>{hasDraftErrors ? copy.validation.fixFields : copy.schedule.noSchedule}</p>
            <div className={styles.buttonRow}>
              <Link className={styles.buttonSecondary} href={createViewHref(locale, "today", incomingPlanFragment)}>{copy.navigation.backToToday}</Link>
              <button className={styles.buttonSecondary} onClick={loadExamplePlan} type="button">{copy.actions.loadExample}</button>
            </div>
          </section>
        ) : null}
        <details
          className={styles.importDetails}
          id="import-save"
          onToggle={(event) => setSaveImportExpanded(event.currentTarget.open)}
          open={saveImportExpanded}
        >
          <summary className={styles.planSetupSummary}>{copy.actions.importSave}</summary>
          <SaveImportSection
            copy={copy}
            locale={locale}
            candidates={saveCandidates}
            skippedFileNames={skippedSaveFileNames}
            selectedIndex={selectedSaveIndex}
            selectedCandidate={selectedSaveCandidate}
            resolutions={saveResolutions}
            profession={saveProfession}
            bearsKnowledge={saveBearsKnowledge}
            currentProfession={planState.current.input.profession}
            errorMessage={saveImportError}
            statusMessage={saveImportMessage}
            isLoading={saveImportBusy}
            onFilesSelected={(files) => { void loadSaveCandidates(files); }}
            onCandidateSelected={(index) => setSelectedSaveCandidate(index)}
            onResolutionChange={updateSaveResolution}
            onProfessionChange={setSaveProfession}
            onBearsKnowledgeChange={setSaveBearsKnowledge}
            onAppend={() => applySaveImport("append")}
            onReplace={() => applySaveImport("replace")}
            onKeep={cancelSaveImportPreview}
          />
        </details>

        <details
          className={styles.importDetails}
          id="crop-profit-review"
          onToggle={(event) => setLegacyReviewExpanded(event.currentTarget.open)}
          open={legacyReviewExpanded}
        >
          <summary className={styles.planSetupSummary}>{copy.import.reviewOldPlan}</summary>
          <LegacyCropPlanReview
            copy={copy}
            locale={locale}
            hasSavedPlan={legacyPlanAvailable}
            review={legacyReview}
            drafts={legacyDrafts}
            errorMessage={legacyError}
            onOpen={openSavedCropPlanReview}
            onDraftChange={updateLegacyHarvestDraft}
            onAdd={addReviewedLegacyHarvests}
          />
        </details>
      </div>
    </section>
  );
}

type NumericFieldProperties = Readonly<{
  id: string;
  label: string;
  value: string;
  errorMessage: string | null;
  onChange: (value: string) => void;
  className?: string;
}>;

function renderNumericField({ id, label, value, errorMessage, onChange, className }: NumericFieldProperties) {
  const errorId = `${id}-error`;
  return (
    <div className={`${styles.field} ${className ?? ""}`} key={id}>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={errorMessage === null ? undefined : errorId}
        aria-invalid={errorMessage !== null}
        className={styles.numericInput}
        id={id}
        inputMode="numeric"
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)}
        pattern="[0-9]*"
        type="text"
        value={value}
      />
      {errorMessage === null ? null : <p className={styles.fieldError} id={errorId} role="alert">{errorMessage}</p>}
    </div>
  );
}

type InventoryLineProperties = Readonly<{
  lineDraft: InventoryLineDraft;
  index: number;
  locale: PublicLocale;
  copy: ProductionToolCopy;
  ingredientOptions: readonly PlantingSelectOption[];
  errors: Readonly<Record<string, string>>;
  idSuffix: string;
  onIngredientChange: (ingredientId: string) => void;
  onLineChange: (update: (lineDraft: InventoryLineDraft) => InventoryLineDraft) => void;
  onRemove: () => void;
}>;

function renderInventoryLine({
  lineDraft,
  index,
  locale,
  copy,
  ingredientOptions,
  errors,
  idSuffix,
  onIngredientChange,
  onLineChange,
  onRemove,
}: InventoryLineProperties) {
  const ingredient = getProcessingIngredient(lineDraft.ingredientId);
  const supportedQualities = getProcessingIngredientQualities(ingredient.id);
  const qualityOptions = supportedQualities.map((quality) => ({
    value: quality,
    label: copy.inventory.qualities[quality],
  }));
  const ingredientLabel = locale === "en" ? ingredient.englishName : ingredient.chineseName;
  const qualityErrorKey = inventoryFieldKey(lineDraft.id, "quality");
  const itemErrorKey = inventoryFieldKey(lineDraft.id, "ingredientId");
  const labelId = `production-inventory-row-${idSuffix}-${lineDraft.id}`;

  return (
    <li className={styles.inventoryRow} key={lineDraft.id}>
      <div className={styles.inventoryRowHeading}>
        <h4 className={styles.inventoryRowTitle} id={labelId}>
          {index + 1}. {ingredientLabel}
        </h4>
        <button className={`${styles.buttonSecondary} ${styles.removeButton}`} onClick={onRemove} type="button">
          {copy.inventory.remove}
        </button>
      </div>
      <div className={styles.inventoryFields}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <PlantingSelect
            inputId={`production-${idSuffix}-item-${lineDraft.id}`}
            label={copy.inventory.item}
            value={lineDraft.ingredientId}
            options={ingredientOptions}
            onValueChange={onIngredientChange}
            errorMessage={errors[itemErrorKey] ?? null}
          />
        </div>
        <div className={styles.field}>
          <PlantingSelect
            inputId={`production-${idSuffix}-quality-${lineDraft.id}`}
            label={copy.inventory.quality}
            value={lineDraft.quality}
            options={qualityOptions}
            onValueChange={(quality) => onLineChange((currentDraft) => ({ ...currentDraft, quality }))}
            errorMessage={errors[qualityErrorKey] ?? null}
          />
        </div>
        {renderNumericField({
          id: `production-${idSuffix}-quantity-${lineDraft.id}`,
          label: copy.inventory.quantity,
          value: lineDraft.quantity,
          errorMessage: errors[inventoryFieldKey(lineDraft.id, "quantity")] ?? null,
          onChange: (quantity) => onLineChange((currentDraft) => ({ ...currentDraft, quantity })),
        })}
        {renderNumericField({
          id: `production-${idSuffix}-reserved-${lineDraft.id}`,
          label: copy.inventory.reserved,
          value: lineDraft.reservedQuantity,
          errorMessage: errors[inventoryFieldKey(lineDraft.id, "reservedQuantity")] ?? null,
          onChange: (reservedQuantity) => onLineChange((currentDraft) => ({ ...currentDraft, reservedQuantity })),
        })}
        {renderNumericField({
          id: `production-${idSuffix}-available-day-${lineDraft.id}`,
          label: copy.inventory.availableDay,
          value: lineDraft.availableDay,
          errorMessage: errors[inventoryFieldKey(lineDraft.id, "availableDay")] ?? null,
          onChange: (availableDay) => onLineChange((currentDraft) => ({ ...currentDraft, availableDay })),
        })}
        {isBearsKnowledgeEligible(ingredient.id) ? (
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.checkboxLabel}>
              <input
                checked={lineDraft.hasBearsKnowledge}
                onChange={(event) => onLineChange((currentDraft) => ({
                  ...currentDraft,
                  hasBearsKnowledge: event.currentTarget.checked,
                }))}
                type="checkbox"
              />
              <span>{copy.inventory.bearsKnowledge}. {copy.inventory.bearsKnowledgeHelp}</span>
            </label>
          </div>
        ) : null}
        {ingredient.id === "coconut" ? (
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <PlantingSelect
              inputId={`production-${idSuffix}-coconut-source-${lineDraft.id}`}
              label={copy.inventory.coconutSource}
              value={lineDraft.coconutSource}
              options={[
                { value: "foraged", label: copy.inventory.coconutSources.foraged },
                { value: "purchased-or-gifted", label: copy.inventory.coconutSources.purchasedOrGifted },
              ]}
              onValueChange={(coconutSource) => onLineChange((currentDraft) => ({
                ...currentDraft,
                coconutSource: coconutSource as ProcessingCoconutSource,
              }))}
            />
          </div>
        ) : null}
      </div>
      <p className={styles.note}>{copy.inventory.reservedHelp} {copy.inventory.availableDayHelp}</p>
      {supportedQualities.length === 1 ? (
        <p className={styles.note} aria-live="polite">
          {locale === "en"
            ? `${ingredientLabel} only supports ${copy.inventory.qualities[supportedQualities[0] ?? "normal"]} quality.`
            : `${ingredientLabel}仅支持${copy.inventory.qualities[supportedQualities[0] ?? "normal"]}品质。`}
        </p>
      ) : null}
    </li>
  );
}

type InventoryTableProperties = Readonly<{
  inventory: readonly InventoryLineDraft[];
  locale: PublicLocale;
  copy: ProductionToolCopy;
  ingredientOptions: readonly PlantingSelectOption[];
  errors: Readonly<Record<string, string>>;
  onIngredientChange: (lineId: string, ingredientId: string) => void;
  onLineChange: (lineId: string, update: (lineDraft: InventoryLineDraft) => InventoryLineDraft) => void;
  onRemove: (lineId: string) => void;
}>;

function renderInventoryTable({
  inventory,
  locale,
  copy,
  ingredientOptions,
  errors,
  onIngredientChange,
  onLineChange,
  onRemove,
}: InventoryTableProperties) {
  return (
    <div className={styles.tableScroller} role="region" tabIndex={0} aria-labelledby="production-inventory-title">
      <table className={`${styles.table} ${styles.inventoryTable}`}>
        <thead><tr>
          <th scope="col">{copy.inventory.item}</th>
          <th scope="col">{copy.inventory.quality}</th>
          <th scope="col">{copy.inventory.quantity}</th>
          <th scope="col">{copy.inventory.reserved}</th>
          <th scope="col">{copy.inventory.availableDay}</th>
          <th scope="col">{copy.inventory.remove}</th>
        </tr></thead>
        <tbody>
          {inventory.map((lineDraft) => {
            const ingredient = getProcessingIngredient(lineDraft.ingredientId);
            const qualityOptions = getProcessingIngredientQualities(ingredient.id).map((quality) => ({
              value: quality,
              label: copy.inventory.qualities[quality],
            }));
            return (
              <tr key={lineDraft.id}>
                <th scope="row">
                  <div className={styles.field}>
                    <PlantingSelect
                      inputId={`production-desktop-item-${lineDraft.id}`}
                      label={copy.inventory.item}
                      value={lineDraft.ingredientId}
                      options={ingredientOptions}
                      onValueChange={(ingredientId) => onIngredientChange(lineDraft.id, ingredientId)}
                      errorMessage={errors[inventoryFieldKey(lineDraft.id, "ingredientId")] ?? null}
                    />
                  </div>
                  {isBearsKnowledgeEligible(ingredient.id) ? (
                    <label className={styles.checkboxLabel}>
                      <input
                        checked={lineDraft.hasBearsKnowledge}
                        onChange={(event) => onLineChange(lineDraft.id, (currentDraft) => ({
                          ...currentDraft,
                          hasBearsKnowledge: event.currentTarget.checked,
                        }))}
                        type="checkbox"
                      />
                      <span>{copy.inventory.bearsKnowledge}</span>
                    </label>
                  ) : null}
                  {ingredient.id === "coconut" ? (
                    <div className={styles.field}>
                      <PlantingSelect
                        inputId={`production-desktop-coconut-source-${lineDraft.id}`}
                        label={copy.inventory.coconutSource}
                        value={lineDraft.coconutSource}
                        options={[
                          { value: "foraged", label: copy.inventory.coconutSources.foraged },
                          { value: "purchased-or-gifted", label: copy.inventory.coconutSources.purchasedOrGifted },
                        ]}
                        onValueChange={(coconutSource) => onLineChange(lineDraft.id, (currentDraft) => ({
                          ...currentDraft,
                          coconutSource: coconutSource as ProcessingCoconutSource,
                        }))}
                      />
                    </div>
                  ) : null}
                </th>
                <td><div className={styles.field}>
                  <PlantingSelect
                    inputId={`production-desktop-quality-${lineDraft.id}`}
                    label={copy.inventory.quality}
                    value={lineDraft.quality}
                    options={qualityOptions}
                    onValueChange={(quality) => onLineChange(lineDraft.id, (currentDraft) => ({ ...currentDraft, quality }))}
                    errorMessage={errors[inventoryFieldKey(lineDraft.id, "quality")] ?? null}
                  />
                </div></td>
                <td>{renderNumericField({
                  id: `production-desktop-quantity-${lineDraft.id}`,
                  label: copy.inventory.quantity,
                  value: lineDraft.quantity,
                  errorMessage: errors[inventoryFieldKey(lineDraft.id, "quantity")] ?? null,
                  onChange: (quantity) => onLineChange(lineDraft.id, (currentDraft) => ({ ...currentDraft, quantity })),
                  className: styles.tableNumericField,
                })}</td>
                <td>{renderNumericField({
                  id: `production-desktop-reserved-${lineDraft.id}`,
                  label: copy.inventory.reserved,
                  value: lineDraft.reservedQuantity,
                  errorMessage: errors[inventoryFieldKey(lineDraft.id, "reservedQuantity")] ?? null,
                  onChange: (reservedQuantity) => onLineChange(lineDraft.id, (currentDraft) => ({ ...currentDraft, reservedQuantity })),
                  className: styles.tableNumericField,
                })}</td>
                <td>{renderNumericField({
                  id: `production-desktop-available-${lineDraft.id}`,
                  label: copy.inventory.availableDay,
                  value: lineDraft.availableDay,
                  errorMessage: errors[inventoryFieldKey(lineDraft.id, "availableDay")] ?? null,
                  onChange: (availableDay) => onLineChange(lineDraft.id, (currentDraft) => ({ ...currentDraft, availableDay })),
                  className: styles.tableNumericField,
                })}</td>
                <td><button className={`${styles.buttonSecondary} ${styles.removeButton}`} onClick={() => onRemove(lineDraft.id)} type="button">{copy.inventory.remove}</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type IncomingPlanPanelProperties = Readonly<{
  input: ProductionPlanInput | null;
  errorMessage: string | null;
  locale: PublicLocale;
  currentDeadlineDays: number;
  copy: ProductionToolCopy;
  onAppend: () => void;
  onReplace: () => void;
  onKeep: () => void;
}>;

function IncomingPlanPanel({ input, errorMessage, locale, currentDeadlineDays, copy, onAppend, onReplace, onKeep }: IncomingPlanPanelProperties) {
  const appendHasOutOfWindowLine = input !== null && input.inventory.some(
    (line) => line.availableDay > currentDeadlineDays,
  );
  return (
    <section
      aria-labelledby="incoming-production-plan-title"
      className={styles.importPreview}
      id="incoming-production-plan"
    >
      <h2 className={styles.sectionTitle} id="incoming-production-plan-title">
        {copy.share.incomingTitle}
      </h2>
      <p className={styles.note}>{copy.share.incomingDescription}</p>
      {errorMessage === null ? null : <p className={styles.error} role="alert">{errorMessage}</p>}
      {input === null ? null : (
        <>
          <p className={styles.note}>
            {locale === "en"
              ? `${input.inventory.length} inventory rows · ${input.deadlineDays}-day window · ${copy.settings.professions[input.profession]} · ${formatMachineCounts(input.machineCounts, copy)}`
              : `${input.inventory.length} 行库存 · ${input.deadlineDays} 天窗口 · ${copy.settings.professions[input.profession]} · ${formatMachineCounts(input.machineCounts, copy)}`}
          </p>
          <ul className={styles.plainList}>
            {input.inventory.map((line) => (
              <li key={line.id}>
                {getIngredientName(line.ingredientId, locale)} · {line.quantity} · {copy.inventory.quality}: {getQualityName(line.quality, copy)} · {copy.inventory.availableDay}: {line.availableDay}
                {line.reservedQuantity > 0 ? ` (${copy.inventory.reserved}: ${line.reservedQuantity})` : ""}
              </li>
            ))}
          </ul>
          {appendHasOutOfWindowLine ? <p className={styles.error} role="alert">{copy.validation.arrivalOutsideHorizon(String(input.inventory.find((line) => line.availableDay > currentDeadlineDays)?.availableDay ?? ""), currentDeadlineDays)}</p> : null}
          <p className={styles.note}>
            {locale === "en"
              ? "Appending keeps your current machines, profession, and window. Replacing uses the shared plan’s settings."
              : "追加时保留当前机器、职业和期限；替换时则使用分享计划中的设置。"}
          </p>
          <div className={styles.buttonRow}>
            <button className={styles.button} onClick={onReplace} type="button">{copy.share.applyIncoming}</button>
            <button className={styles.buttonSecondary} disabled={appendHasOutOfWindowLine} onClick={onAppend} type="button">{copy.share.appendIncoming}</button>
            <button className={styles.buttonSecondary} onClick={onKeep} type="button">{copy.share.keepIncoming}</button>
          </div>
        </>
      )}
      {input === null ? <button className={styles.buttonSecondary} onClick={onKeep} type="button">{copy.share.keepIncoming}</button> : null}
    </section>
  );
}

type LegacyCropPlanReviewProperties = Readonly<{
  copy: ProductionToolCopy;
  locale: PublicLocale;
  hasSavedPlan: boolean;
  review: CropProfitProductionReview | null;
  drafts: readonly LegacyHarvestDraft[];
  errorMessage: string | null;
  onOpen: () => void;
  onDraftChange: (cropId: string, update: (draft: LegacyHarvestDraft) => LegacyHarvestDraft) => void;
  onAdd: () => void;
}>;

function LegacyCropPlanReview({
  copy,
  locale,
  hasSavedPlan,
  review,
  drafts,
  errorMessage,
  onOpen,
  onDraftChange,
  onAdd,
}: LegacyCropPlanReviewProperties) {
  return (
    <section aria-label={copy.import.reviewOldPlan} className={styles.importPreview}>
      {hasSavedPlan ? (
        <>
          <h3 className={styles.sectionTitle} id="crop-profit-review-title">{copy.import.oldCropPlan}</h3>
          <p className={styles.note}>{copy.import.oldPlanDescription}</p>
        </>
      ) : null}
      <button className={styles.buttonSecondary} onClick={onOpen} type="button">{copy.import.reviewOldPlan}</button>
      {errorMessage === null ? null : <p className={styles.error} role="status">{errorMessage}</p>}
      {review === null ? null : (
        <div className={styles.importPreview}>
          <h4 className={styles.inventoryRowTitle}>{copy.legacy.title}</h4>
          <p className={styles.note}>{copy.legacy.description}</p>
          <ul className={styles.inventoryList}>
            {review.estimatedHarvests.map((harvest, index) => {
              const cropIngredient = listProcessingIngredients().find((ingredient) => ingredient.id === harvest.cropId);
              const draft = drafts.find((candidate) => candidate.cropId === harvest.cropId);
              if (draft === undefined) {
                throw new Error(`Legacy crop draft is missing. Received cropId=${JSON.stringify(harvest.cropId)}.`);
              }
              const cropName = cropIngredient === undefined
                ? harvest.cropId
                : locale === "en" ? cropIngredient.englishName : cropIngredient.chineseName;
              const qualityOptions: readonly PlantingSelectOption[] = [
                { value: "", label: locale === "en" ? "Choose actual quality" : "选择实际品质" },
                ...PRODUCTION_QUALITIES.filter((quality) => cropIngredient !== undefined && getProcessingIngredientQualities(cropIngredient.id).includes(quality))
                  .map((quality) => ({ value: quality, label: copy.inventory.qualities[quality] })),
              ];
              return (
                <li className={styles.inventoryRow} key={`${harvest.cropId}-${index}`}>
                  <h5 className={styles.inventoryRowTitle}>{cropName}</h5>
                  <p className={styles.note}>
                    {copy.legacy.expectedQuantity}: {harvest.expectedUnits}; {copy.legacy.harvestWindow}: {formatLegacyHarvestDate(harvest.firstHarvest, locale)} – {formatLegacyHarvestDate(harvest.lastHarvest, locale)}
                  </p>
                  {cropIngredient === undefined ? (
                    <p className={styles.error}>{copy.legacy.unsupportedCrop}</p>
                  ) : (
                    <div className={styles.inventoryFields}>
                      <div className={styles.field}>
                        <PlantingSelect
                          inputId={`legacy-quality-${index}`}
                          label={copy.inventory.quality}
                          value={draft.quality}
                          options={qualityOptions}
                          onValueChange={(quality) => onDraftChange(harvest.cropId, (currentDraft) => ({ ...currentDraft, quality }))}
                        />
                      </div>
                      {renderNumericField({
                        id: `legacy-quantity-${index}`,
                        label: copy.legacy.actualQuantity,
                        value: draft.quantity,
                        errorMessage: null,
                        onChange: (quantity) => onDraftChange(harvest.cropId, (currentDraft) => ({ ...currentDraft, quantity })),
                      })}
                      {renderNumericField({
                        id: `legacy-available-day-${index}`,
                        label: copy.legacy.actualAvailableDay,
                        value: draft.availableDay,
                        errorMessage: null,
                        onChange: (availableDay) => onDraftChange(harvest.cropId, (currentDraft) => ({ ...currentDraft, availableDay })),
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {review.reviewReasons.map((reason) => <p className={styles.note} key={reason}>{reason}</p>)}
          <button className={styles.button} onClick={onAdd} type="button">
            {copy.legacy.addConfirmed}
          </button>
        </div>
      )}
    </section>
  );
}

function formatLegacyHarvestDate(
  harvestDate: CropProfitProductionReview["estimatedHarvests"][number]["firstHarvest"],
  locale: PublicLocale,
): string {
  if (harvestDate === null) return locale === "en" ? "Not available" : "未提供";
  const seasons = locale === "en"
    ? { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" }
    : { spring: "春季", summer: "夏季", fall: "秋季", winter: "冬季" };
  return `${seasons[harvestDate.season]} ${harvestDate.day}`;
}

type TodayTasksPanelProperties = Readonly<{
  day: number;
  input: ProductionPlanInput;
  result: ProductionPlanResult;
  scheduleDay: ProductionPlanResult["dailySchedule"][number] | null;
  completedTaskIds: ReadonlySet<string>;
  allTasksComplete: boolean;
  needsReview: boolean;
  copy: ProductionToolCopy;
  locale: PublicLocale;
  onSelectDay: (day: number) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onConfirmReview: () => void;
  onCopyToday: () => void;
  scheduleHref: string;
  copyFeedback: CopyFeedback | null;
  manualCopyRef: RefObject<HTMLTextAreaElement | null>;
}>;

function TodayTasksPanel({
  day,
  input,
  result,
  scheduleDay,
  completedTaskIds,
  allTasksComplete,
  needsReview,
  copy,
  locale,
  onSelectDay,
  onToggleTask,
  onConfirmReview,
  onCopyToday,
  scheduleHref,
  copyFeedback,
  manualCopyRef,
}: TodayTasksPanelProperties) {
  const tasks = scheduleDay === null ? [] : [...scheduleDay.collectTasks, ...scheduleDay.loadTasks];
  const collectTasks = tasks.filter((task) => task.kind === "collect");
  const loadTasks = tasks.filter((task) => task.kind === "load");
  const missingDays = result.dailySchedule.filter((scheduledDay) => {
    if (scheduledDay.day >= day) return false;
    return [...scheduledDay.collectTasks, ...scheduledDay.loadTasks].some((task) => !completedTaskIds.has(task.id));
  }).length;
  const dayOptions = result.dailySchedule.map((scheduledDay) => ({
    value: String(scheduledDay.day),
    label: copy.today.dayOfWindow(scheduledDay.day, input.deadlineDays),
  }));

  function selectDayFromPicker(selectedDay: string) {
    const matchingDay = result.dailySchedule.find((scheduledDay) => String(scheduledDay.day) === selectedDay);
    if (matchingDay === undefined) {
      throw new Error(`Selected production day was not found in the schedule. Received: ${JSON.stringify(selectedDay)}.`);
    }
    onSelectDay(matchingDay.day);
  }

  return (
    <div className={styles.planner}>
      <div className={styles.dayHeading}>
        <h4 className={`${styles.taskTitle} ${styles.desktopDayTitle}`}>{copy.today.dayOfWindow(day, input.deadlineDays)}</h4>
        <div className={styles.dayStepper}>
          <button aria-label={copy.actions.previousDay} className={styles.dayButton} disabled={day === 0} onClick={() => onSelectDay(day - 1)} type="button">←</button>
          <div className={`${styles.field} ${styles.mobileDayPicker}`}>
            <PlantingSelect
              inputId="production-current-day"
              label={copy.today.currentDay}
              value={String(day)}
              options={dayOptions}
              onValueChange={selectDayFromPicker}
            />
          </div>
          <button aria-label={copy.actions.nextDay} className={styles.dayButton} disabled={day >= input.deadlineDays} onClick={() => onSelectDay(day + 1)} type="button">→</button>
        </div>
      </div>
      <div aria-label={locale === "en" ? "Planning days" : "计划日期"} className={`${styles.dayNavigation} ${styles.desktopDayNavigation}`}>
        {result.dailySchedule.map((scheduledDay) => (
          <button
            aria-current={scheduledDay.day === day ? "date" : undefined}
            className={scheduledDay.day === day ? `${styles.dayButton} ${styles.dayButtonCurrent}` : styles.dayButton}
            key={scheduledDay.day}
            onClick={() => onSelectDay(scheduledDay.day)}
            type="button"
          >
            {scheduledDay.day}
          </button>
        ))}
      </div>
      <p className={styles.note}>{copy.schedule.assumptions}</p>
      {needsReview ? (
        <div className={styles.statusCard}>
          <p className={styles.error} role="alert">{copy.today.changedPrompt} {copy.today.taskReviewPrompt}</p>
          <button className={styles.button} onClick={onConfirmReview} type="button">{copy.actions.reviewTasks}</button>
        </div>
      ) : null}
      {allTasksComplete ? <p className={styles.status} role="status">{copy.today.allComplete}</p> : null}
      {result.status === "no-unreserved-stock" ? <PlanStatusMessage result={result} copy={copy} /> : null}
      {result.status === "no-machine-capacity" ? <PlanStatusMessage result={result} copy={copy} /> : null}
      {collectTasks.length > 0 || loadTasks.length > 0 ? (
        <div className={collectTasks.length > 0 && loadTasks.length > 0
          ? styles.todayTaskColumns
          : `${styles.todayTaskColumns} ${styles.todayTaskColumnsSingle}`}>
          {collectTasks.length > 0 ? (
            <section aria-labelledby="production-today-collect-title">
              <h4 className={styles.sectionTitle} id="production-today-collect-title">{copy.today.collectTitle}</h4>
              <ul className={styles.taskList}>
                {collectTasks.map((task) => renderTaskCard(
                  task,
                  locale,
                  copy,
                  completedTaskIds,
                  needsReview,
                  onToggleTask,
                ))}
              </ul>
            </section>
          ) : null}
          {loadTasks.length > 0 ? (
            <section aria-labelledby="production-today-load-title">
              <h4 className={styles.sectionTitle} id="production-today-load-title">{copy.today.loadTitle}</h4>
              <ul className={styles.taskList}>
                {loadTasks.map((task) => renderTaskCard(
                  task,
                  locale,
                  copy,
                  completedTaskIds,
                  needsReview,
                  onToggleTask,
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
      {collectTasks.length === 0 || loadTasks.length === 0 ? (
        <div className={styles.taskEmptyMessages}>
          {collectTasks.length === 0 ? <p className={styles.emptyState}>{copy.today.noCollect}</p> : null}
          {loadTasks.length === 0 ? <p className={styles.emptyState}>{copy.today.noLoad}</p> : null}
        </div>
      ) : null}
      {result.inventoryBalances.some((balance) => balance.remainingQuantity > 0) ? (
        <section aria-labelledby="production-waiting-stock-title">
          <h4 className={styles.sectionTitle} id="production-waiting-stock-title">{copy.today.waitingTitle}</h4>
          <ul className={styles.plainList}>
            {result.inventoryBalances.filter((balance) => balance.remainingQuantity > 0).map((balance) =>
              renderInventoryBalance(balance, input, locale, copy),
            )}
          </ul>
        </section>
      ) : null}
      {missingDays > 0 ? <p className={styles.note}>{locale === "en" ? `${missingDays} earlier day(s) still have unchecked work.` : `此前 ${missingDays} 天仍有未勾选任务。`}</p> : null}
      <div className={styles.buttonRow}>
          <button
            className={styles.buttonSecondary}
            disabled={!result.dailySchedule.some((scheduledDay) => scheduledDay.collectTasks.length + scheduledDay.loadTasks.length > 0)}
            onClick={onCopyToday}
            type="button"
          >
            {copy.actions.copyToday}
          </button>
        <Link className={styles.button} href={scheduleHref}>{copy.actions.showSchedule}</Link>
      </div>
      <CopyFeedbackPanel copyFeedback={copyFeedback} copy={copy} manualCopyRef={manualCopyRef} />
    </div>
  );
}

function renderTaskCard(
  task: ProductionPlanResult["dailySchedule"][number]["loadTasks"][number]
    | ProductionPlanResult["dailySchedule"][number]["collectTasks"][number],
  locale: PublicLocale,
  copy: ProductionToolCopy,
  completedTaskIds: ReadonlySet<string>,
  checklistNeedsReview: boolean,
  onToggleTask: (taskId: string, completed: boolean) => void,
) {
  const label = getProductionTaskLabel(task, locale, copy);
  const isCompleted = completedTaskIds.has(task.id);
  return (
    <li className={styles.taskCard} key={task.id}>
      <label className={styles.taskCheckboxLabel}>
        <input
          checked={isCompleted}
          className={styles.taskCheckbox}
          disabled={checklistNeedsReview}
          onChange={(event) => onToggleTask(task.id, event.currentTarget.checked)}
          type="checkbox"
        />
        <span>{label}</span>
      </label>
      {task.kind === "load" ? (
        <p className={styles.taskDetail}>
          {task.inventoryConsumptions.map((consumption) => `${getIngredientName(
            task.ingredientId,
            locale,
          )} × ${consumption.quantity}`).join(" + ")}
          {locale === "en" ? ` · Ready in ${task.processingMornings} morning(s)` : ` · ${task.processingMornings} 个早晨后可收取`}
        </p>
      ) : (
        <p className={styles.taskDetail}>
          {formatProductionGold(task.productValue, locale)}
          {locale === "en" ? ` · Loaded on day ${task.loadedDay}` : ` · 第 ${task.loadedDay} 天装入`}
        </p>
      )}
    </li>
  );
}

function renderInventoryBalance(
  balance: ProductionInventoryBalance,
  input: ProductionPlanInput,
  locale: PublicLocale,
  copy: ProductionToolCopy,
) {
  const line = input.inventory.find((candidate) => candidate.id === balance.inventoryLineId);
  if (line === undefined) {
    throw new Error(`Production balance has no matching inventory line. Received id=${JSON.stringify(balance.inventoryLineId)}.`);
  }
  return (
    <li key={balance.inventoryLineId}>
      {getIngredientName(line.ingredientId, locale)}: {balance.remainingQuantity} · {formatProductionGold(balance.remainingValue, locale)}
      {balance.reservedQuantity > 0 ? ` · ${copy.inventory.reserved}: ${balance.reservedQuantity}` : ""}
    </li>
  );
}

type ProductionSchedulePanelProperties = Readonly<{
  input: ProductionPlanInput;
  result: ProductionPlanResult;
  currentDay: number;
  locale: PublicLocale;
  copy: ProductionToolCopy;
  onCopySummary: () => void;
  onCopyPlanLink: () => void;
  todayHref: string;
  copyFeedback: CopyFeedback | null;
  manualCopyRef: RefObject<HTMLTextAreaElement | null>;
}>;

function ProductionSchedulePanel({
  input,
  result,
  currentDay,
  locale,
  copy,
  onCopySummary,
  onCopyPlanLink,
  todayHref,
  copyFeedback,
  manualCopyRef,
}: ProductionSchedulePanelProperties) {
  const scheduleRows = result.dailySchedule.flatMap((day) => [
    ...day.collectTasks.map((task) => ({
      key: task.id,
      day: day.day,
      action: copy.schedule.collect,
      machine: `${getMachineName(task.machine, copy)} × ${task.batchCount}`,
      item: getProductName(task.productEnglishName, task.productChineseName, locale),
      quantity: `${task.batchCount}`,
      collectDay: copy.today.dayOfWindow(day.day, input.deadlineDays),
    })),
    ...day.loadTasks.map((task) => ({
      key: task.id,
      day: day.day,
      action: copy.schedule.load,
      machine: `${getMachineName(task.machine, copy)} × ${task.batchCount}`,
      item: `${getIngredientName(task.ingredientId, locale)} → ${getProductName(task.productEnglishName, task.productChineseName, locale)}`,
      quantity: `${task.inputUnits}`,
      collectDay: copy.today.dayOfWindow(day.day + task.processingMornings, input.deadlineDays),
    })),
  ]);
  const scheduleGroups = result.dailySchedule
    .map((scheduledDay) => ({
      day: scheduledDay.day,
      rows: scheduleRows.filter((row) => row.day === scheduledDay.day),
    }))
    .filter((scheduleGroup) => scheduleGroup.rows.length > 0);
  const expandedScheduleGroup = scheduleGroups.find((scheduleGroup) => scheduleGroup.day >= currentDay)
    ?? scheduleGroups[scheduleGroups.length - 1];
  const canCopyResult = result.status === "scheduled" && scheduleRows.length > 0;

  return (
    <div className={styles.scheduleSection}>
      <PlanStatusMessage result={result} copy={copy} />
      <section aria-labelledby="production-daily-schedule-title">
        <h4 className={styles.sectionTitle} id="production-daily-schedule-title">{copy.schedule.dailyTitle}</h4>
        {scheduleRows.length === 0 ? <p className={styles.emptyState}>{copy.schedule.noSchedule}</p> : (
          <div className={styles.scheduleDateGroups}>
            {scheduleGroups.map((scheduleGroup) => (
              <details
                className={styles.scheduleDateDetails}
                key={scheduleGroup.day}
                open={scheduleGroup.day === expandedScheduleGroup?.day}
              >
                <summary className={styles.scheduleDateSummary}>
                  <span>{copy.today.dayOfWindow(scheduleGroup.day, input.deadlineDays)}</span>
                  <span>{scheduleGroup.rows.length} {locale === "en" ? "tasks" : "项任务"}</span>
                </summary>
                <div className={`${styles.tableScroller} ${styles.desktopScheduleTable}`} role="region" tabIndex={0} aria-label={`${copy.schedule.dailyTitle}: ${copy.today.dayOfWindow(scheduleGroup.day, input.deadlineDays)}`}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th scope="col">{copy.schedule.dailyColumns.day}</th>
                      <th scope="col">{copy.schedule.dailyColumns.action}</th>
                      <th scope="col">{copy.schedule.dailyColumns.machine}</th>
                      <th scope="col">{copy.schedule.dailyColumns.item}</th>
                      <th scope="col">{copy.schedule.dailyColumns.quantity}</th>
                      <th scope="col">{copy.schedule.dailyColumns.collectDay}</th>
                    </tr></thead>
                    <tbody>{scheduleGroup.rows.map((row) => (
                      <tr key={row.key}>
                        <th scope="row">{copy.today.dayOfWindow(row.day, input.deadlineDays)}</th>
                        <td>{row.action}</td>
                        <td>{row.machine}</td>
                        <td>{row.item}</td>
                        <td>{row.quantity}</td>
                        <td>{row.collectDay}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <ul aria-label={`${copy.schedule.dailyTitle}: ${copy.today.dayOfWindow(scheduleGroup.day, input.deadlineDays)}`} className={styles.mobileScheduleCards}>
                  {scheduleGroup.rows.map((row) => (
                    <li className={styles.scheduleCard} key={row.key}>
                      <h5 className={styles.inventoryRowTitle}>{copy.today.dayOfWindow(row.day, input.deadlineDays)} · {row.action}</h5>
                      <dl className={styles.scheduleCardDetails}>
                        {renderScheduleCardValue(copy.schedule.dailyColumns.machine, row.machine)}
                        {renderScheduleCardValue(copy.schedule.dailyColumns.item, row.item)}
                        {renderScheduleCardValue(copy.schedule.dailyColumns.quantity, row.quantity)}
                        {renderScheduleCardValue(copy.schedule.dailyColumns.collectDay, row.collectDay)}
                      </dl>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>
      <details className={styles.planSummary}>
        <summary className={styles.planSetupSummary}>{copy.schedule.allocationTitle}</summary>
        <section aria-labelledby="production-allocation-title" className={styles.summaryContent}>
          <h4 className={styles.sectionTitle} id="production-allocation-title">{copy.schedule.allocationTitle}</h4>
          {result.allocations.length === 0 ? <p className={styles.emptyState}>{copy.schedule.noSchedule}</p> : (
            <>
              <div className={`${styles.tableScroller} ${styles.desktopScheduleTable}`} role="region" tabIndex={0} aria-label={copy.schedule.allocationTitle}>
                <table className={styles.table}>
                  <thead><tr>
                    <th scope="col">{copy.schedule.allocationColumns.inventory}</th>
                    <th scope="col">{copy.schedule.allocationColumns.machine}</th>
                    <th scope="col">{copy.schedule.allocationColumns.product}</th>
                    <th scope="col">{copy.schedule.allocationColumns.quantity}</th>
                    <th scope="col">{copy.schedule.allocationColumns.batches}</th>
                    <th scope="col">{copy.schedule.allocationColumns.addedValue}</th>
                    <th scope="col">{copy.schedule.allocationColumns.leftover}</th>
                  </tr></thead>
                  <tbody>
                    {result.allocations.map((allocation, allocationIndex) => (
                      <tr key={`${allocation.ingredientId}-${allocation.quality}-${allocation.machine}`}>
                        <th scope="row">{getIngredientName(allocation.ingredientId, locale)} · {getQualityName(allocation.quality, copy)}</th>
                        <td>{getMachineName(allocation.machine, copy)}</td>
                        <td>{getProductName(allocation.productEnglishName, allocation.productChineseName, locale)}</td>
                        <td>{allocation.inputUnits}</td>
                        <td>{allocation.batchCount}</td>
                        <td>{formatProductionGold(allocation.additionalValue, locale)}</td>
                        <td>{getAllocationLeftoverDisplayValue(result.allocations, allocationIndex, input, result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul aria-label={copy.schedule.allocationTitle} className={styles.mobileScheduleCards}>
                {result.allocations.map((allocation, allocationIndex) => (
                  <li className={styles.scheduleCard} key={`${allocation.ingredientId}-${allocation.quality}-${allocation.machine}`}>
                    <h5 className={styles.inventoryRowTitle}>{getIngredientName(allocation.ingredientId, locale)} · {getQualityName(allocation.quality, copy)}</h5>
                    <dl className={styles.scheduleCardDetails}>
                      {renderScheduleCardValue(copy.schedule.allocationColumns.machine, getMachineName(allocation.machine, copy))}
                      {renderScheduleCardValue(copy.schedule.allocationColumns.product, getProductName(allocation.productEnglishName, allocation.productChineseName, locale))}
                      {renderScheduleCardValue(copy.schedule.allocationColumns.quantity, String(allocation.inputUnits))}
                      {renderScheduleCardValue(copy.schedule.allocationColumns.batches, String(allocation.batchCount))}
                      {renderScheduleCardValue(copy.schedule.allocationColumns.addedValue, formatProductionGold(allocation.additionalValue, locale))}
                      {renderScheduleCardValue(copy.schedule.allocationColumns.leftover, getAllocationLeftoverDisplayValue(result.allocations, allocationIndex, input, result))}
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </details>
      <section aria-labelledby="production-plan-summary-title" className={styles.scheduleValueSummary}>
        <h4 className={styles.sectionTitle} id="production-plan-summary-title">{copy.today.summaryTitle}</h4>
        <div className={styles.summaryContent}>
          <dl aria-label={copy.schedule.title} className={`${styles.metricGrid} ${styles.scheduleMetrics}`}>
            {renderMetric(copy.schedule.addedValue, formatProductionGold(result.additionalValue, locale))}
            {renderMetric(copy.schedule.finalValue, formatProductionGold(result.finalValue, locale))}
            {renderMetric(copy.schedule.rawSaleBaseline, formatProductionGold(result.directSaleBaselineValue, locale))}
          </dl>
          <p className={styles.note}>
            {locale === "en"
              ? `Reserved stock is separate: ${input.inventory.reduce((total, line) => total + line.reservedQuantity, 0)} units worth ${formatProductionGold(result.reservedValue, locale)}. It is excluded from the raw-sale baseline, final value, and added value.`
              : `预留库存单独计算：${input.inventory.reduce((total, line) => total + line.reservedQuantity, 0)} 件，价值 ${formatProductionGold(result.reservedValue, locale)}。它不计入直接出售基准、最终价值或额外增值。`}
          </p>
          <p className={styles.note}>{copy.schedule.assumptions}</p>
          <p className={styles.note}>{copy.share.linkIncludesInventory}</p>
          <div className={`${styles.buttonRow} ${styles.scheduleActions}`}>
            <button className={styles.buttonSecondary} disabled={!canCopyResult} onClick={onCopySummary} type="button">{copy.actions.copySummary}</button>
            <button className={styles.button} disabled={!canCopyResult} onClick={onCopyPlanLink} type="button">{copy.share.copyLink}</button>
            <Link className={styles.buttonSecondary} href={todayHref}>{copy.navigation.backToToday}</Link>
          </div>
          <CopyFeedbackPanel copyFeedback={copyFeedback} copy={copy} manualCopyRef={manualCopyRef} />
        </div>
      </section>
    </div>
  );
}

function getAllocationLeftover(
  allocation: ProductionPlanResult["allocations"][number],
  input: ProductionPlanInput,
  result: ProductionPlanResult,
): number {
  const lineIds = new Set(input.inventory
    .filter((line) => line.ingredientId === allocation.ingredientId && line.quality === allocation.quality)
    .map((line) => line.id));
  return result.inventoryBalances
    .filter((balance) => lineIds.has(balance.inventoryLineId))
    .reduce((total, balance) => total + balance.remainingQuantity, 0);
}

function getAllocationLeftoverDisplayValue(
  allocations: ProductionPlanResult["allocations"],
  allocationIndex: number,
  input: ProductionPlanInput,
  result: ProductionPlanResult,
): string {
  const allocation = allocations[allocationIndex];
  if (allocation === undefined) {
    throw new Error(`Production allocation was not found. Received allocationIndex=${allocationIndex}.`);
  }
  const hasEarlierAllocationForSameInventory = allocations.slice(0, allocationIndex).some((earlierAllocation) =>
    earlierAllocation.ingredientId === allocation.ingredientId && earlierAllocation.quality === allocation.quality,
  );
  if (hasEarlierAllocationForSameInventory) return "—";
  return String(getAllocationLeftover(allocation, input, result));
}

function renderMetric(label: string, value: string) {
  return (
    <div className={styles.metricCard} key={label}>
      <dt className={styles.metricLabel}>{label}</dt>
      <dd className={styles.metricValue}>{value}</dd>
    </div>
  );
}

function renderScheduleCardValue(label: string, value: string) {
  return (
    <div key={label}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PlanStatusMessage({ result, copy }: Readonly<{ result: ProductionPlanResult | null; copy: ProductionToolCopy }>) {
  if (result === null) return null;
  if (result.status === "scheduled") {
    return <p className={styles.statusCard}>{copy.schedule.executable}</p>;
  }
  if (result.status === "no-unreserved-stock") {
    return <p className={styles.emptyState}>{copy.schedule.noInventory}</p>;
  }
  if (result.status === "no-machine-capacity") {
    return <p className={styles.emptyState}>{copy.schedule.noMachines}</p>;
  }
  if (result.status === "no-complete-batch") {
    return <p className={styles.emptyState}>{copy.schedule.noCompleteBatch}</p>;
  }
  return <p className={styles.emptyState}>{copy.schedule.noPositiveValue}</p>;
}

function createProductionSummaryText(
  input: ProductionPlanInput,
  result: ProductionPlanResult,
  locale: PublicLocale,
  copy: ProductionToolCopy,
): string {
  const lines = [
    `${copy.settings.title}: ${copy.settings.deadlines[input.deadlineDays]}`,
    `${copy.settings.profession}: ${copy.settings.professions[input.profession]}`,
    `${copy.schedule.addedValue}: ${formatProductionGold(result.additionalValue, locale)}`,
    `${copy.schedule.finalValue}: ${formatProductionGold(result.finalValue, locale)}`,
    `${copy.schedule.rawSaleBaseline}: ${formatProductionGold(result.directSaleBaselineValue, locale)}`,
    `${copy.schedule.reservedStock}: ${formatProductionGold(result.reservedValue, locale)} (${locale === "en" ? "excluded from final value" : "不计入最终价值"})`,
    copy.schedule.assumptions,
    locale === "en"
      ? "Final value and added value exclude reserved stock; the raw-sale baseline includes only unreserved inventory."
      : "最终价值和额外增值不含预留库存；直接出售基准只计算未预留库存。",
  ];
  for (const machine of PRODUCTION_MACHINES) {
    lines.push(`${copy.settings.machines[machine]}: ${input.machineCounts[machine]}`);
  }
  lines.push(copy.inventory.title);
  for (const line of input.inventory) {
    lines.push(
      `${getIngredientName(line.ingredientId, locale)} · ${getQualityName(line.quality, copy)} · ${line.quantity} · ${copy.inventory.reserved}: ${line.reservedQuantity} · ${copy.inventory.availableDay}: ${line.availableDay}`,
    );
  }
  return lines.join("\n");
}

function createTodayTasksText(
  day: number,
  input: ProductionPlanInput,
  scheduleDay: ProductionPlanResult["dailySchedule"][number] | null,
  locale: PublicLocale,
  copy: ProductionToolCopy,
): string {
  const tasks = scheduleDay === null ? [] : [...scheduleDay.collectTasks, ...scheduleDay.loadTasks];
  const lines = [
    copy.today.dayOfWindow(day, input.deadlineDays),
    copy.schedule.assumptions,
  ];
  if (tasks.length === 0) {
    lines.push(copy.today.noCollect, copy.today.noLoad);
  } else {
    lines.push(...tasks.map((task) => getProductionTaskLabel(task, locale, copy)));
  }
  lines.push(
    `${copy.settings.profession}: ${copy.settings.professions[input.profession]}`,
    ...PRODUCTION_MACHINES.map((machine) => `${copy.settings.machines[machine]}: ${input.machineCounts[machine]}`),
    `${copy.inventory.title}: ${input.inventory.map((line) => `${getIngredientName(line.ingredientId, locale)} ${line.quantity} (${copy.inventory.reserved} ${line.reservedQuantity}, ${copy.inventory.availableDay} ${line.availableDay})`).join("; ")}`,
  );
  return lines.join("\n");
}

function createConfirmedLegacyInventoryLines(
  review: CropProfitProductionReview,
  drafts: readonly LegacyHarvestDraft[],
  deadlineDays: number,
  locale: PublicLocale,
  copy: ProductionToolCopy,
): Readonly<{ inventory: readonly ProductionInventoryLine[]; errors: readonly string[] }> {
  const errors: string[] = [];
  const inventory: ProductionInventoryLine[] = [];
  const ingredientIds = new Set(listProcessingIngredients().map((ingredient) => ingredient.id));

  for (const harvest of review.estimatedHarvests) {
    const draft = drafts.find((candidate) => candidate.cropId === harvest.cropId);
    if (draft === undefined) {
      throw new Error(`Legacy harvest draft is missing. Received cropId=${JSON.stringify(harvest.cropId)}.`);
    }
    if (!ingredientIds.has(harvest.cropId)) continue;

    const quantity = parseConfirmedLegacyNumber(draft.quantity);
    const availableDay = parseConfirmedLegacyNumber(draft.availableDay);
    const qualities = getProcessingIngredientQualities(harvest.cropId);
    if (quantity === null || availableDay === null || !PRODUCTION_QUALITIES.includes(draft.quality as ProductionQuality)) {
      errors.push(locale === "en"
        ? `${getIngredientName(harvest.cropId, locale)}: enter actual quantity, quality, and available day.`
        : `${getIngredientName(harvest.cropId, locale)}：请填写实际数量、品质和可用日期。`);
      continue;
    }
    const quality = draft.quality as ProductionQuality;
    if (!qualities.includes(quality)) {
      errors.push(copy.validation.invalidSelection(copy.inventory.quality, draft.quality));
      continue;
    }
    if (availableDay > deadlineDays) {
      errors.push(copy.validation.arrivalOutsideHorizon(String(availableDay), deadlineDays));
      continue;
    }
    inventory.push({
      id: `crop-profit-${harvest.cropId}-${inventory.length + 1}`,
      ingredientId: harvest.cropId,
      quality,
      quantity,
      reservedQuantity: 0,
      availableDay,
    });
  }
  return { inventory, errors };
}

function parseConfirmedLegacyNumber(rawValue: string): number | null {
  if (!/^(0|[1-9]\d*)$/.test(rawValue)) return null;
  const value = Number(rawValue);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

type SaveImportSectionProperties = Readonly<{
  copy: ProductionToolCopy;
  locale: PublicLocale;
  candidates: readonly ProductionSaveCandidate[];
  skippedFileNames: readonly string[];
  selectedIndex: string;
  selectedCandidate: ProductionSaveCandidate | null;
  resolutions: Readonly<Record<string, SaveInventoryResolutionDraft>>;
  profession: string;
  bearsKnowledge: string;
  currentProfession: ProductionProfession;
  errorMessage: string | null;
  statusMessage: string | null;
  isLoading: boolean;
  onFilesSelected: (files: readonly File[]) => void;
  onCandidateSelected: (index: string) => void;
  onResolutionChange: (
    itemId: string,
    update: (resolution: SaveInventoryResolutionDraft) => SaveInventoryResolutionDraft,
  ) => void;
  onProfessionChange: (profession: string) => void;
  onBearsKnowledgeChange: (value: string) => void;
  onAppend: () => void;
  onReplace: () => void;
  onKeep: () => void;
}>;

function SaveImportSection({
  copy,
  locale,
  candidates,
  skippedFileNames,
  selectedIndex,
  selectedCandidate,
  resolutions,
  profession,
  bearsKnowledge,
  currentProfession,
  errorMessage,
  statusMessage,
  isLoading,
  onFilesSelected,
  onCandidateSelected,
  onResolutionChange,
  onProfessionChange,
  onBearsKnowledgeChange,
  onAppend,
  onReplace,
  onKeep,
}: SaveImportSectionProperties) {
  const ingredientOptions = listProcessingIngredients().map((ingredient) => ({
    value: ingredient.id,
    label: locale === "en" ? ingredient.englishName : ingredient.chineseName,
  }));
  const hasEligibleBerries = selectedCandidate?.inventoryItems.some((item) =>
    item.candidateIngredientIds.some(isBearsKnowledgeEligible),
  ) ?? false;

  return (
    <section aria-labelledby="production-save-import-title" className={styles.importPreview}>
      <div className={styles.sectionHeading}>
        <div>
          <h3 className={styles.sectionTitle} id="production-save-import-title">{copy.actions.importSave}</h3>
          <p className={styles.note}>{copy.import.chooseFile}</p>
        </div>
        <div className={styles.filePickerGroup}>
          <label className={styles.filePicker} htmlFor="production-save-files">
            {copy.actions.importSave}
            <input
              className={styles.fileInput}
              id="production-save-files"
              multiple
              onChange={(event) => onFilesSelected(Array.from(event.currentTarget.files ?? []))}
              type="file"
            />
          </label>
          <label className={styles.filePicker} htmlFor="production-save-folder">
            {copy.import.chooseFolder}
            <input
              {...{ webkitdirectory: "" }}
              className={styles.fileInput}
              id="production-save-folder"
              multiple
              onChange={(event) => onFilesSelected(Array.from(event.currentTarget.files ?? []))}
              type="file"
            />
          </label>
        </div>
      </div>
      {isLoading ? <p aria-live="polite" className={styles.status} role="status">{copy.status.saving}</p> : null}
      {errorMessage === null ? null : <p className={styles.error} role="alert">{errorMessage}</p>}
      {statusMessage === null ? null : <p aria-live="polite" className={styles.status} role="status">{statusMessage}</p>}
      {skippedFileNames.length > 0 ? (
        <p aria-live="polite" className={styles.note} role="status">
          {copy.import.skippedNonSaveFiles(skippedFileNames)}
        </p>
      ) : null}
      {candidates.length > 1 ? (
        <div className={styles.field}>
          <PlantingSelect
            inputId="production-save-farm"
            label={copy.import.chooseFarm}
            value={selectedIndex}
            options={[
              { value: "", label: copy.import.chooseFarm },
              ...candidates.map((candidate, index) => ({
                value: String(index),
                label: `${candidate.farm.farmName ?? candidate.sourceName} · ${candidate.sourceName}`,
              })),
            ]}
            onValueChange={onCandidateSelected}
          />
        </div>
      ) : null}
      {selectedCandidate === null ? null : (
        <div className={styles.savePreview}>
          <div className={styles.saveSummary}>
            <p><strong>{copy.import.sourceName}:</strong> {selectedCandidate.sourceName}</p>
            <p><strong>{copy.import.farmName}:</strong> {selectedCandidate.farm.farmName ?? copy.import.previewFailure}</p>
            <p><strong>{copy.import.farmDetails}:</strong> {formatSaveFarmDetails(selectedCandidate, locale)}</p>
            <p><strong>{copy.import.profession}:</strong> {selectedCandidate.profession === null ? copy.import.previewFailure : copy.settings.professions[selectedCandidate.profession]}</p>
            <p>
              <strong>{copy.import.machines}:</strong> {formatMachineCounts(selectedCandidate.machineCounts, copy)}
              {` · ${locale === "en" ? "Busy" : "忙碌"}: ${formatMachineCounts(selectedCandidate.busyMachineCounts, copy)}`}
            </p>
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="production-save-profession"
              label={selectedCandidate.profession === null
                ? `${copy.settings.profession} · ${locale === "en" ? `choose; current is ${copy.settings.professions[currentProfession]}` : `请选择；当前为${copy.settings.professions[currentProfession]}`}`
                : copy.settings.profession}
              value={profession}
              options={[
                { value: "", label: copy.validation.invalidSelection(copy.settings.profession, "") },
                ...PRODUCTION_PROFESSIONS.map((option) => ({ value: option, label: copy.settings.professions[option] })),
              ]}
              onValueChange={onProfessionChange}
            />
          </div>
          {hasEligibleBerries ? (
            <div className={styles.field}>
              <PlantingSelect
                inputId="production-save-bears-knowledge"
                label={copy.inventory.bearsKnowledge}
                value={bearsKnowledge}
                options={[
                  { value: "", label: copy.import.selectMapping },
                  { value: "false", label: locale === "en" ? "Off" : "关闭" },
                  { value: "true", label: locale === "en" ? "On" : "开启" },
                ]}
                onValueChange={onBearsKnowledgeChange}
              />
              <p className={styles.note}>{copy.inventory.bearsKnowledgeHelp}</p>
            </div>
          ) : null}
          {selectedCandidate.inventoryItems.length === 0 ? (
            <p className={styles.emptyState}>{copy.import.noInventoryDetected}</p>
          ) : (
            <div className={styles.tableScroller} role="region" tabIndex={0} aria-label={copy.import.preview}>
              <table className={styles.table}>
                <thead><tr>
                  <th scope="col">{copy.inventory.item}</th>
                  <th scope="col">{copy.inventory.quality}</th>
                  <th scope="col">{copy.inventory.quantity}</th>
                  <th scope="col">{copy.import.selectMapping}</th>
                </tr></thead>
                <tbody>
                  {selectedCandidate.inventoryItems.map((item) => {
                    const resolution = resolutions[item.id];
                    if (resolution === undefined) {
                      throw new Error(`Save import resolution is missing. Received itemId=${JSON.stringify(item.id)}.`);
                    }
                    const mappedIngredient = ingredientOptions.find((option) => option.value === resolution.ingredientId);
                    const supportedQualities = mappedIngredient === undefined
                      ? PRODUCTION_QUALITIES
                      : getProcessingIngredientQualities(mappedIngredient.value);
                    const itemMappings = item.candidateIngredientIds.map((ingredientId) => {
                      const option = ingredientOptions.find((candidateOption) => candidateOption.value === ingredientId);
                      if (option === undefined) {
                        throw new Error(`Save item references an unknown ingredient. Received itemId=${JSON.stringify(item.id)}, ingredientId=${JSON.stringify(ingredientId)}.`);
                      }
                      return option;
                    });
                    return (
                      <tr key={item.id}>
                        <th scope="row">
                          <div className={styles.saveItemName}>{item.itemName} × {item.quantity}</div>
                          {item.reviewReason === null ? null : <p className={styles.note}>{copy.import.formatReviewMessage(item.reviewReason)}</p>}
                          {itemMappings.length === 0 ? (
                            <p className={styles.error}>{copy.import.unmappedItem(item.itemName, item.objectId, item.quantity)}</p>
                          ) : (
                            <PlantingSelect
                              inputId={`production-save-item-${item.id}`}
                              label={copy.inventory.item}
                              value={resolution.ingredientId}
                              options={[{ value: "", label: copy.import.selectMapping }, ...itemMappings]}
                              onValueChange={(ingredientId) => onResolutionChange(item.id, (currentResolution) => ({ ...currentResolution, ingredientId, quality: "" }))}
                            />
                          )}
                          {resolution.ingredientId === "coconut" ? (
                            <PlantingSelect
                              inputId={`production-save-coconut-${item.id}`}
                              label={copy.inventory.coconutSource}
                              value={resolution.coconutSource}
                              options={[
                                { value: "", label: copy.import.selectMapping },
                                { value: "foraged", label: copy.inventory.coconutSources.foraged },
                                { value: "purchased-or-gifted", label: copy.inventory.coconutSources.purchasedOrGifted },
                              ]}
                              onValueChange={(coconutSource) => onResolutionChange(item.id, (currentResolution) => ({ ...currentResolution, coconutSource }))}
                            />
                          ) : null}
                        </th>
                        <td>
                          <PlantingSelect
                            inputId={`production-save-quality-${item.id}`}
                            label={copy.inventory.quality}
                            value={resolution.quality}
                            options={[
                              { value: "", label: copy.import.selectMapping },
                              ...supportedQualities.map((quality) => ({ value: quality, label: copy.inventory.qualities[quality] })),
                            ]}
                            onValueChange={(quality) => onResolutionChange(item.id, (currentResolution) => ({ ...currentResolution, quality }))}
                          />
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.candidateIngredientIds.length > 1 ? copy.import.selectMapping : item.objectId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {selectedCandidate.unsupportedItems.length > 0 ? (
            <section aria-labelledby="production-save-unsupported-title">
              <h4 className={styles.sectionTitle} id="production-save-unsupported-title">{copy.import.unsupportedItems}</h4>
              <ul className={styles.plainList}>
                {selectedCandidate.unsupportedItems.map((item) => (
                  <li key={`${item.objectId}-${item.itemName}`}>{copy.import.unmappedItem(item.itemName, item.objectId, item.quantity)}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {selectedCandidate.reviewWarnings.length > 0 ? (
            <section aria-labelledby="production-save-warnings-title">
              <h4 className={styles.sectionTitle} id="production-save-warnings-title">{copy.import.warnings}</h4>
              <ul className={styles.plainList}>{selectedCandidate.reviewWarnings.map((warning) => <li key={warning}>{copy.import.formatReviewMessage(warning)}</li>)}</ul>
            </section>
          ) : null}
          <div className={styles.buttonRow}>
            <button className={styles.button} onClick={onAppend} type="button">{copy.import.append}</button>
            <button className={styles.buttonSecondary} onClick={onReplace} type="button">{copy.import.replace}</button>
            <button className={styles.buttonSecondary} disabled={isLoading} onClick={onKeep} type="button">{copy.import.cancel}</button>
          </div>
        </div>
      )}
    </section>
  );
}

function createSaveResolutionDrafts(candidate: ProductionSaveCandidate): Readonly<Record<string, SaveInventoryResolutionDraft>> {
  return Object.fromEntries(candidate.inventoryItems.map((item) => [item.id, {
      ingredientId: item.selectedIngredientId ?? (item.candidateIngredientIds.length === 1 ? item.candidateIngredientIds[0] ?? "" : ""),
      quality: item.quality ?? "",
      coconutSource: item.coconutSource ?? "",
    }] as const));
}

function hasSaveGameRootElement(xmlText: string): boolean {
  let xmlRemainder = xmlText.replace(/^\uFEFF/, "").trimStart();
  const declaration = xmlRemainder.match(/^<\?xml\b[\s\S]*?\?>/i);
  if (declaration !== null) xmlRemainder = xmlRemainder.slice(declaration[0].length).trimStart();

  while (xmlRemainder.startsWith("<!--")) {
    const commentEnd = xmlRemainder.indexOf("-->");
    if (commentEnd < 0) return false;
    xmlRemainder = xmlRemainder.slice(commentEnd + 3).trimStart();
  }

  const rootElement = xmlRemainder.match(/^<([A-Za-z_][A-Za-z0-9_.:-]*)\b/);
  return rootElement?.[1] === "SaveGame";
}

function isLikelyPrimarySaveFile(file: File): boolean {
  const relativePathParts = file.webkitRelativePath.split("/").filter((pathPart) => pathPart.length > 0);
  const selectedFileName = relativePathParts[relativePathParts.length - 1];
  const containingFolderName = relativePathParts[relativePathParts.length - 2];
  return selectedFileName === file.name && containingFolderName === file.name;
}

async function readProductionSaveFile(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new ProductionSaveImportError(
      `Could not read selected save file ${JSON.stringify(file.name)}. Received: ${JSON.stringify(detail)}.`,
      { cause: error },
    );
  }
}

function resolveSelectedSaveInventory(
  saveItems: readonly ProductionSaveInventoryItem[],
  resolutionDrafts: Readonly<Record<string, SaveInventoryResolutionDraft>>,
  bearsKnowledgeValue: string,
  copy: ProductionToolCopy,
): Readonly<{ inventory: readonly ProductionInventoryLine[]; errors: readonly string[] }> {
  const inventory: ProductionInventoryLine[] = [];
  const errors: string[] = [];

  for (const item of saveItems) {
    const resolutionDraft = resolutionDrafts[item.id];
    if (resolutionDraft === undefined) {
      throw new Error(`Save import resolution is missing. Received itemId=${JSON.stringify(item.id)}.`);
    }
    if (resolutionDraft.ingredientId === "") {
      errors.push(copy.import.unmappedItem(item.itemName, item.objectId, item.quantity));
      continue;
    }
    if (!item.candidateIngredientIds.includes(resolutionDraft.ingredientId)) {
      errors.push(copy.validation.invalidSelection(copy.inventory.item, resolutionDraft.ingredientId));
      continue;
    }

    const quality = resolutionDraft.quality === "" ? undefined : PRODUCTION_QUALITIES.find((value) => value === resolutionDraft.quality);
    if (resolutionDraft.quality === "" || quality === undefined) {
      errors.push(copy.validation.invalidSelection(copy.inventory.quality, resolutionDraft.quality));
      continue;
    }
    if (quality !== undefined && !getProcessingIngredientQualities(resolutionDraft.ingredientId).includes(quality)) {
      errors.push(copy.validation.invalidSelection(copy.inventory.quality, resolutionDraft.quality));
      continue;
    }

    const resolution: ProductionSaveInventoryResolution = {
      ingredientId: resolutionDraft.ingredientId,
      ...(quality === undefined ? {} : { quality }),
      ...(resolutionDraft.ingredientId === "coconut" && resolutionDraft.coconutSource !== ""
        ? { coconutSource: resolutionDraft.coconutSource as ProcessingCoconutSource }
        : {}),
      ...(isBearsKnowledgeEligible(resolutionDraft.ingredientId) && bearsKnowledgeValue !== ""
        ? { hasBearsKnowledge: bearsKnowledgeValue === "true" }
        : {}),
    };
    try {
      inventory.push(resolveProductionSaveInventoryItem(item, resolution));
    } catch (error) {
      if (!isProductionSaveImportError(error)) throw error;
      errors.push(error.message);
    }
  }

  return { inventory, errors };
}

function formatSaveFarmDetails(candidate: ProductionSaveCandidate, locale: PublicLocale): string {
  const dateFields = [candidate.farm.season, candidate.farm.day, candidate.farm.year];
  const date = dateFields.every((value) => value !== null)
    ? `${candidate.farm.season} ${candidate.farm.day}, ${candidate.farm.year}`
    : locale === "en" ? "Date unavailable" : "日期未知";
  const farmType = candidate.farm.farmType ?? (locale === "en" ? "Type unavailable" : "类型未知");
  return `${farmType} · ${date}`;
}

function formatMachineCounts(machineCounts: ProductionMachineCounts, copy: ProductionToolCopy): string {
  return PRODUCTION_MACHINES.map((machine) => `${copy.settings.machines[machine]} ${machineCounts[machine]}`).join(" · ");
}
