"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  caskAgingProfessions,
  caskAgingQualities,
  caskAgingSeasons,
  caskAgingStorageKey,
  caskAgingTargetQualities,
  caskAgingMaximumYear,
  createDefaultCaskAgingForm,
  getCaskAgingMaximumBottleCount,
  isCaskAgingFormValidationError,
  listCaskAgingIngredients,
  parseCaskAgingForm,
  projectCaskAging,
  readCaskAgingForm,
  serializeCaskAgingForm,
  type CaskAgingForm,
  type CaskAgingProjection,
  type CaskAgingQuality,
  type CaskAgingSeason,
  type CaskAgingTargetQuality,
} from "../../processing-tools/cask-aging";
import { getProcessingToolHref } from "./processing-tool-definition";
import type { PublicLocale } from "../../i18n/public-locale";
import { copyToolText } from "../copy-tool-text";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import { PlantingSelect, type PlantingSelectOption } from "../planting-select";
import styles from "./cask-aging-tool.module.css";

type CaskAgingCopy = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  settings: string;
  ingredient: string;
  currentQuality: string;
  targetQuality: string;
  startSeason: string;
  startDay: string;
  startYear: string;
  wineBottleCount: string;
  emptyCaskCount: string;
  profession: string;
  qualityShortcutLabel: string;
  qualities: Readonly<Record<CaskAgingQuality, string>>;
  seasons: Readonly<Record<CaskAgingSeason, string>>;
  professions: Readonly<Record<CaskAgingForm["profession"], string>>;
  results: string;
  currentWineValue: string;
  collectionDate: string;
  addedGoldPerBottle: string;
  addedGoldPerCaskDay: string;
  status: Readonly<Record<CaskAgingProjection["selectedTarget"]["status"], string>>;
  targetTable: string;
  quality: string;
  agingStatus: string;
  remainingDays: string;
  pricePerBottle: string;
  selectTarget: string;
  selected: string;
  loadPlan: string;
  bottlesToAgeNow: string;
  bottlesWaitingForCasks: string;
  addedGoldForBottlesToAgeNow: string;
  additionalCasksNeeded: string;
  woodNeeded: string;
  hardwoodNeeded: string;
  cellarCapacity: string;
  capacityReferences: readonly Readonly<{ count: number; label: string }>[];
  fullCyclesIn112Days: string;
  bottlesIn112Days: string;
  continuousSupplyNote: string;
  caskRules: string;
  kegLink: string;
  copyPlan: string;
  copied: string;
  copyFailed: string;
  invalidSavedSettings: string;
  storageFailed: string;
  localStorageNote: string;
  invalidInteger: string;
  received: string;
  fixFields: string;
  notAvailable: string;
  gameGoldSuffix: string;
  yearLabel: string;
  dayLabel: string;
}>;

const caskAgingCopy: Readonly<Record<PublicLocale, CaskAgingCopy>> = {
  en: {
    eyebrow: "Processing tools",
    title: "Wine Cask Aging Calculator",
    description:
      "Compare wine quality targets, collection dates, and added value for the Casks you can fill. This tool covers wine aging only; Keg brewing time is separate.",
    settings: "Wine and cellar settings",
    ingredient: "Fruit used for this wine",
    currentQuality: "Current wine quality",
    targetQuality: "Quality to age to",
    startSeason: "Season loaded into Casks",
    startDay: "Day loaded into Casks",
    startYear: "Farm year",
    wineBottleCount: "Wine bottles ready to load",
    emptyCaskCount: "Empty Casks available",
    profession: "Sale profession",
    qualityShortcutLabel: "Choose a target quality",
    qualities: {
      normal: "Normal",
      silver: "Silver",
      gold: "Gold",
      iridium: "Iridium",
    },
    seasons: {
      spring: "Spring",
      summer: "Summer",
      fall: "Fall",
      winter: "Winter",
    },
    professions: {
      none: "No Artisan",
      artisan: "Artisan",
    },
    results: "Aging estimate",
    currentWineValue: "Current wine value per bottle",
    collectionDate: "Estimated collection date",
    addedGoldPerBottle: "Added value per bottle",
    addedGoldPerCaskDay: "Added value per Cask-day",
    status: {
      aging: "Can age to this quality",
      "already-at-target": "Already at this quality",
      "target-below-current": "Wine is already above this target",
    },
    targetTable: "Compare aging targets",
    quality: "Target quality",
    agingStatus: "Status",
    remainingDays: "Days remaining",
    pricePerBottle: "Wine value / bottle",
    selectTarget: "Choose",
    selected: "Selected",
    loadPlan: "Casks to load now",
    bottlesToAgeNow: "Bottles that fit now",
    bottlesWaitingForCasks: "Bottles waiting for Casks",
    addedGoldForBottlesToAgeNow: "Added value for bottles loaded now",
    additionalCasksNeeded: "Additional Casks needed",
    woodNeeded: "Wood to craft them",
    hardwoodNeeded: "Hardwood to craft them",
    cellarCapacity: "Cask capacity references",
    capacityReferences: [
      { count: 33, label: "Included cellar" },
      { count: 118, label: "Expanded cellar (mobile)" },
      { count: 125, label: "Reachable by mouse and keyboard" },
      { count: 189, label: "Fully packed; move a Cask to collect" },
    ],
    fullCyclesIn112Days: "Normal-to-target cycles per Cask in 112 days",
    bottlesIn112Days: "Bottles across your empty Casks in 112 days",
    continuousSupplyNote:
      "Each 112-day cycle starts with normal-quality Wine and assumes steady supply plus immediate Cask reloads.",
    caskRules:
      "This tool currently models Wine aging in the cellar; Keg brewing time is separate. Each Cask needs 20 Wood and 1 Hardwood.",
    kegLink: "Open the Keg processing calculator",
    copyPlan: "Copy aging plan",
    copied: "Aging plan copied.",
    copyFailed: "Could not copy the plan.",
    invalidSavedSettings: "Saved Cask settings are invalid; change a field to create and save a new plan.",
    storageFailed: "Browser storage is unavailable; settings may not persist.",
    localStorageNote: "Settings are saved in this browser.",
    invalidInteger: "Enter a whole number in the allowed range.",
    received: "Received",
    fixFields: "Correct the highlighted values to see an updated estimate.",
    notAvailable: "Not available",
    gameGoldSuffix: "g",
    yearLabel: "Year",
    dayLabel: "Day",
  },
  "zh-CN": {
    eyebrow: "加工工具",
    title: "酒窖陈酿计算器",
    description:
      "比较葡萄酒达到不同品质所需的日期和增值，并按现有空桶估算本轮可装的酒。此工具只计算酒窖陈酿；Keg 酿造时间另计。",
    settings: "葡萄酒与酒窖设置",
    ingredient: "酿酒水果",
    currentQuality: "当前葡萄酒品质",
    targetQuality: "目标品质",
    startSeason: "装桶季节",
    startDay: "装桶日期",
    startYear: "农场年份",
    wineBottleCount: "待装桶的葡萄酒瓶数",
    emptyCaskCount: "现有空桶数量",
    profession: "出售职业",
    qualityShortcutLabel: "快捷选择目标品质",
    qualities: {
      normal: "普通",
      silver: "银星",
      gold: "金星",
      iridium: "铱星",
    },
    seasons: {
      spring: "春季",
      summer: "夏季",
      fall: "秋季",
      winter: "冬季",
    },
    professions: {
      none: "无工匠职业",
      artisan: "工匠",
    },
    results: "陈酿估算",
    currentWineValue: "当前每瓶酒售价",
    collectionDate: "预计收取日期",
    addedGoldPerBottle: "每瓶陈酿增值",
    addedGoldPerCaskDay: "每桶每日增值",
    status: {
      aging: "可以陈酿至此品质",
      "already-at-target": "已经达到此品质",
      "target-below-current": "当前品质已高于此目标",
    },
    targetTable: "对比陈酿目标",
    quality: "目标品质",
    agingStatus: "状态",
    remainingDays: "剩余天数",
    pricePerBottle: "每瓶售价",
    selectTarget: "选择",
    selected: "已选择",
    loadPlan: "本轮装桶计划",
    bottlesToAgeNow: "现在可装瓶数",
    bottlesWaitingForCasks: "等待空桶的瓶数",
    addedGoldForBottlesToAgeNow: "本轮可装酒的总增值",
    additionalCasksNeeded: "还需制作空桶",
    woodNeeded: "所需木材",
    hardwoodNeeded: "所需硬木",
    cellarCapacity: "酒窖容量参考",
    capacityReferences: [
      { count: 33, label: "初始酒窖" },
      { count: 118, label: "扩建酒窖（移动端）" },
      { count: 125, label: "键鼠可达" },
      { count: 189, label: "全铺后需拆放木桶才能收取" },
    ],
    fullCyclesIn112Days: "112天内每桶普通酒至目标品质轮次",
    bottlesIn112Days: "现有空桶112天可陈酿瓶数",
    continuousSupplyNote:
      "每轮从普通品质葡萄酒开始；此估算假设酒源持续供应，并在每桶完成后立即重新装桶。",
    caskRules:
      "本工具目前计算果酒的酒窖陈酿；Keg 酿造时间另计。每只桶需20木材和1硬木。",
    kegLink: "打开 Keg 加工计算器",
    copyPlan: "复制陈酿计划",
    copied: "陈酿计划已复制。",
    copyFailed: "无法复制计划。",
    invalidSavedSettings: "已保存的酒窖设置无效；修改一个字段即可创建并保存新计划。",
    storageFailed: "浏览器存储不可用，设置可能无法保存。",
    localStorageNote: "设置保存在此浏览器中。",
    invalidInteger: "请输入范围内的整数。",
    received: "当前输入",
    fixFields: "请修正标记的数值以更新估算。",
    notAvailable: "不适用",
    gameGoldSuffix: "金",
    yearLabel: "年",
    dayLabel: "日",
  },
};

type CaskAgingNumericField = "day" | "year" | "wineBottleCount" | "emptyCaskCount";
type CaskAgingDrafts = Readonly<Record<CaskAgingNumericField, string>>;
type CaskAgingDraftErrors = Partial<Record<CaskAgingNumericField, string>>;

type CaskAgingNumberFieldProperties = Readonly<{
  field: CaskAgingNumericField;
  id: string;
  label: string;
  maximum: number;
  minimum: number;
  onValueChange: (field: CaskAgingNumericField, value: string) => void;
  errorMessage?: string | undefined;
  value: string;
}>;

export function CaskAgingTool({ locale }: Readonly<{ locale: PublicLocale }>) {
  const copy = getCaskAgingCopy(locale);
  const ingredients = listCaskAgingIngredients();
  const ingredientOptions: readonly PlantingSelectOption[] = ingredients.map((ingredient) => ({
    value: ingredient.id,
    label: locale === "zh-CN" ? ingredient.chineseName : ingredient.englishName,
  }));
  const [form, setForm] = useState<CaskAgingForm>(() => createDefaultCaskAgingForm());
  const [drafts, setDrafts] = useState<CaskAgingDrafts>(() => createCaskAgingDrafts(form));
  const [draftErrors, setDraftErrors] = useState<CaskAgingDraftErrors>({});
  const [storageReady, setStorageReady] = useState(false);
  const [savedSettingsError, setSavedSettingsError] = useState<string | null>(null);
  const [ingredientSelectionError, setIngredientSelectionError] = useState<string | null>(null);
  const [storageFeedback, setStorageFeedback] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    let savedFormText: string | null;
    try {
      savedFormText = readBrowserToolStorage(caskAgingStorageKey);
    } catch (error) {
      if (!(error instanceof Error) || !isBrowserStorageFailure(error)) throw error;
      setStorageFeedback(`${copy.storageFailed} ${error.message}`);
      setStorageReady(true);
      return;
    }

    if (savedFormText !== null) {
      try {
        const savedForm = parseCaskAgingForm(savedFormText);
        setForm(savedForm);
        setDrafts(createCaskAgingDrafts(savedForm));
      } catch (error) {
        if (!isCaskAgingFormValidationError(error)) throw error;
        setSavedSettingsError(`${copy.invalidSavedSettings} ${error.message}`);
      }
    }

    setStorageReady(true);
  }, [copy]);

  useEffect(() => {
    if (!storageReady || savedSettingsError !== null) return;

    try {
      writeBrowserToolStorage(caskAgingStorageKey, serializeCaskAgingForm(form));
      setStorageFeedback(null);
    } catch (error) {
      if (!(error instanceof Error) || !isBrowserStorageFailure(error)) throw error;
      setStorageFeedback(`${copy.storageFailed} ${error.message}`);
    }
  }, [copy, form, savedSettingsError, storageReady]);

  const hasDraftErrors = Object.keys(draftErrors).length > 0;
  const projection =
    savedSettingsError === null && !hasDraftErrors ? projectCaskAging(form) : null;
  const kegHref = getProcessingToolHref(locale, "keg-processing");
  const qualityOptions: readonly PlantingSelectOption[] = caskAgingQualities.map((quality) => ({
    value: quality,
    label: copy.qualities[quality],
  }));
  const targetOptions: readonly PlantingSelectOption[] = caskAgingTargetQualities.map(
    (quality) => ({ value: quality, label: copy.qualities[quality] }),
  );
  const seasonOptions: readonly PlantingSelectOption[] = caskAgingSeasons.map((season) => ({
    value: season,
    label: copy.seasons[season],
  }));
  const professionOptions: readonly PlantingSelectOption[] = caskAgingProfessions.map(
    (profession) => ({ value: profession, label: copy.professions[profession] }),
  );

  function commitFormUpdate(nextForm: CaskAgingForm): void {
    setForm(readCaskAgingForm(nextForm));
    setSavedSettingsError(null);
    setIngredientSelectionError(null);
    setCopyFeedback(null);
  }

  function updateNumericDraft(field: CaskAgingNumericField, rawValue: string): void {
    setDrafts((currentDrafts) => ({ ...currentDrafts, [field]: rawValue }));
    const range = getNumericFieldRange(field, form.ingredientId);
    const numericValue = rawValue.trim() === "" ? Number.NaN : Number(rawValue);
    if (
      !Number.isSafeInteger(numericValue) ||
      numericValue < range.minimum ||
      numericValue > range.maximum
    ) {
      const fieldLabel = getNumericFieldLabel(field, copy);
      setDraftErrors((currentErrors) => ({
        ...currentErrors,
        [field]: `${fieldLabel}: ${copy.invalidInteger} ${range.minimum}–${range.maximum}. ${copy.received} ${JSON.stringify(rawValue)}.`,
      }));
      setCopyFeedback(null);
      return;
    }

    try {
      commitFormUpdate({ ...form, [field]: numericValue });
      setDraftErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    } catch (error) {
      if (!isCaskAgingFormValidationError(error)) throw error;
      setDraftErrors((currentErrors) => ({ ...currentErrors, [field]: error.message }));
    }
  }

  function updateIngredient(rawValue: string): void {
    const selectedIngredient = ingredients.find((ingredient) => ingredient.id === rawValue);
    if (selectedIngredient === undefined) {
      throw new Error(
        `Selected cask ingredient is unavailable. Received ingredientId=${JSON.stringify(rawValue)}.`,
      );
    }
    try {
      commitFormUpdate({ ...form, ingredientId: selectedIngredient.id });
    } catch (error) {
      if (!isCaskAgingFormValidationError(error)) throw error;
      setIngredientSelectionError(error.message);
    }
  }

  function updateCurrentQuality(rawValue: string): void {
    const selectedQuality = requireOptionValue(rawValue, caskAgingQualities, "currentQuality");
    commitFormUpdate({ ...form, currentQuality: selectedQuality });
  }

  function updateTargetQuality(rawValue: string): void {
    const selectedQuality = requireOptionValue(rawValue, caskAgingTargetQualities, "targetQuality");
    commitFormUpdate({ ...form, targetQuality: selectedQuality });
  }

  function updateSeason(rawValue: string): void {
    const selectedSeason = requireOptionValue(rawValue, caskAgingSeasons, "season");
    commitFormUpdate({ ...form, season: selectedSeason });
  }

  function updateProfession(rawValue: string): void {
    const selectedProfession = requireOptionValue(rawValue, caskAgingProfessions, "profession");
    commitFormUpdate({ ...form, profession: selectedProfession });
  }

  async function copyAgingPlan(): Promise<void> {
    if (projection === null) return;

    try {
      await copyToolText(createAgingPlanText(form, projection, copy, locale));
      setCopyFeedback(copy.copied);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("Clipboard write failed.")) {
        throw error;
      }
      setCopyFeedback(`${copy.copyFailed} ${error.message}`);
    }
  }

  return (
    <section aria-labelledby="cask-aging-title" className={styles.caskAging}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="cask-aging-title">{copy.title}</h2>
        <p className={styles.description}>{copy.description}</p>
      </header>

      {savedSettingsError === null ? null : (
        <p className={styles.alert} role="alert">
          {savedSettingsError}
        </p>
      )}
      {storageFeedback === null ? null : (
        <p className={styles.alert} role="alert">
          {storageFeedback}
        </p>
      )}

      <div className={styles.mainGrid}>
        <section aria-labelledby="cask-aging-settings" className={styles.panel}>
          <h2 id="cask-aging-settings">{copy.settings}</h2>
          <div className={styles.fields}>
            <div className={styles.field}>
              <PlantingSelect
                inputId="cask-aging-ingredient"
                label={copy.ingredient}
                onValueChange={updateIngredient}
                options={ingredientOptions}
                errorMessage={ingredientSelectionError}
                value={form.ingredientId}
              />
            </div>
            <div className={styles.field}>
              <PlantingSelect
                inputId="cask-aging-current-quality"
                label={copy.currentQuality}
                onValueChange={updateCurrentQuality}
                options={qualityOptions}
                value={form.currentQuality}
              />
            </div>
            <div className={styles.field}>
              <PlantingSelect
                inputId="cask-aging-target-quality"
                label={copy.targetQuality}
                onValueChange={updateTargetQuality}
                options={targetOptions}
                value={form.targetQuality}
              />
            </div>
            <div className={styles.field}>
              <PlantingSelect
                inputId="cask-aging-season"
                label={copy.startSeason}
                onValueChange={updateSeason}
                options={seasonOptions}
                value={form.season}
              />
            </div>
            <CaskAgingNumberField
              field="day"
              id="cask-aging-day"
              label={copy.startDay}
              maximum={28}
              minimum={1}
              onValueChange={updateNumericDraft}
              errorMessage={draftErrors.day}
              value={drafts.day}
            />
            <CaskAgingNumberField
              field="year"
              id="cask-aging-year"
              label={copy.startYear}
              maximum={Number.MAX_SAFE_INTEGER}
              minimum={1}
              onValueChange={updateNumericDraft}
              errorMessage={draftErrors.year}
              value={drafts.year}
            />
            <CaskAgingNumberField
              field="wineBottleCount"
              id="cask-aging-bottle-count"
              label={copy.wineBottleCount}
              maximum={Number.MAX_SAFE_INTEGER}
              minimum={0}
              onValueChange={updateNumericDraft}
              errorMessage={draftErrors.wineBottleCount}
              value={drafts.wineBottleCount}
            />
            <CaskAgingNumberField
              field="emptyCaskCount"
              id="cask-aging-empty-cask-count"
              label={copy.emptyCaskCount}
              maximum={Number.MAX_SAFE_INTEGER}
              minimum={0}
              onValueChange={updateNumericDraft}
              errorMessage={draftErrors.emptyCaskCount}
              value={drafts.emptyCaskCount}
            />
            <div className={styles.field}>
              <PlantingSelect
                inputId="cask-aging-profession"
                label={copy.profession}
                onValueChange={updateProfession}
                options={professionOptions}
                value={form.profession}
              />
            </div>
          </div>
          <div aria-label={copy.qualityShortcutLabel} className={styles.field} role="group">
            <strong>{copy.qualityShortcutLabel}</strong>
            <div className={styles.qualityChoices}>
              {caskAgingTargetQualities.map((quality) => (
                <button
                  aria-pressed={form.targetQuality === quality}
                  key={quality}
                  onClick={() => updateTargetQuality(quality)}
                  type="button"
                >
                  {copy.qualities[quality]}
                </button>
              ))}
            </div>
          </div>
          {storageFeedback === null && savedSettingsError === null ? (
            <p className={styles.note}>{copy.localStorageNote}</p>
          ) : null}
        </section>

        <section aria-labelledby="cask-aging-results" className={styles.panel}>
          <h2 id="cask-aging-results">{copy.results}</h2>
          {projection === null ? (
            <p className={styles.alert} role="status">
              {copy.fixFields}
            </p>
          ) : (
            <>
              <p className={styles.status}>
                {copy.status[projection.selectedTarget.status]}
              </p>
              <dl className={styles.summaryGrid}>
                <div>
                  <dt>{copy.currentWineValue}</dt>
                  <dd>{formatGold(projection.currentWineValue, locale, copy.gameGoldSuffix)}</dd>
                </div>
                <div>
                  <dt>{copy.collectionDate}</dt>
                  <dd>
                    {projection.selectedTarget.collectionDate === null
                      ? copy.notAvailable
                      : formatCaskDate(projection.selectedTarget.collectionDate, copy, locale)}
                  </dd>
                </div>
                <div>
                  <dt>{copy.addedGoldPerBottle}</dt>
                  <dd>
                    {formatGold(
                      projection.selectedTarget.addedGoldPerBottle,
                      locale,
                      copy.gameGoldSuffix,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{copy.addedGoldPerCaskDay}</dt>
                  <dd>
                    {formatGold(
                      projection.selectedTarget.addedGoldPerCaskDay,
                      locale,
                      copy.gameGoldSuffix,
                    )}
                  </dd>
                </div>
              </dl>
              <div aria-labelledby="cask-aging-load-plan" className={styles.field} role="group">
                <h3 id="cask-aging-load-plan">{copy.loadPlan}</h3>
                <dl className={styles.loadGrid}>
                  <div>
                    <dt>{copy.bottlesToAgeNow}</dt>
                    <dd>{projection.bottlesToAgeNow}</dd>
                  </div>
                  <div>
                    <dt>{copy.bottlesWaitingForCasks}</dt>
                    <dd>{projection.bottlesWaitingForCasks}</dd>
                  </div>
                  <div>
                    <dt>{copy.addedGoldForBottlesToAgeNow}</dt>
                    <dd>
                      {formatGold(
                        projection.addedGoldForBottlesToAgeNow,
                        locale,
                        copy.gameGoldSuffix,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>{copy.additionalCasksNeeded}</dt>
                    <dd>{projection.additionalCasksNeeded}</dd>
                  </div>
                  <div>
                    <dt>{copy.woodNeeded}</dt>
                    <dd>{projection.woodNeeded}</dd>
                  </div>
                  <div>
                    <dt>{copy.hardwoodNeeded}</dt>
                    <dd>{projection.hardwoodNeeded}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.actionRow}>
                <button className={styles.action} onClick={copyAgingPlan} type="button">
                  {copy.copyPlan}
                </button>
                <Link className={styles.toolLink} href={kegHref}>
                  {copy.kegLink}
                </Link>
              </div>
              {copyFeedback === null ? null : (
                <p aria-live="polite" className={styles.status} role="status">
                  {copyFeedback}
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <section aria-labelledby="cask-aging-targets" className={styles.panel}>
        <h2 id="cask-aging-targets">{copy.targetTable}</h2>
        {projection === null ? (
          <p className={styles.note}>{copy.fixFields}</p>
        ) : (
          <div aria-label={copy.targetTable} className={styles.tableWrap} tabIndex={0}>
            <table className={styles.targetTable}>
              <caption className={styles.visuallyHidden}>{copy.targetTable}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.quality}</th>
                  <th scope="col">{copy.agingStatus}</th>
                  <th scope="col">{copy.remainingDays}</th>
                  <th scope="col">{copy.collectionDate}</th>
                  <th scope="col">{copy.pricePerBottle}</th>
                  <th scope="col">{copy.addedGoldPerBottle}</th>
                  <th scope="col">{copy.addedGoldPerCaskDay}</th>
                </tr>
              </thead>
              <tbody>
                {projection.targetOptions.map((target) => (
                  <tr
                    className={target.quality === form.targetQuality ? styles.selectedRow : undefined}
                    key={target.quality}
                  >
                    <th scope="row">
                      <button
                        aria-label={
                          form.targetQuality === target.quality
                            ? `${copy.qualities[target.quality]} — ${copy.selected}`
                            : `${copy.selectTarget} ${copy.qualities[target.quality]}`
                        }
                        aria-pressed={form.targetQuality === target.quality}
                        className={styles.targetButton}
                        onClick={() => updateTargetQuality(target.quality)}
                        type="button"
                      >
                        {copy.qualities[target.quality]}
                      </button>
                    </th>
                    <td>{copy.status[target.status]}</td>
                    <td>{target.remainingDays ?? "—"}</td>
                    <td>
                      {target.collectionDate === null
                        ? "—"
                        : formatCaskDate(target.collectionDate, copy, locale)}
                    </td>
                    <td>{formatGold(target.wineValue, locale, copy.gameGoldSuffix)}</td>
                    <td>{formatGold(target.addedGoldPerBottle, locale, copy.gameGoldSuffix)}</td>
                    <td>{formatGold(target.addedGoldPerCaskDay, locale, copy.gameGoldSuffix)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="cask-aging-capacity" className={styles.panel}>
        <h2 id="cask-aging-capacity">{copy.cellarCapacity}</h2>
        {projection === null ? (
          <p className={styles.note}>{copy.fixFields}</p>
        ) : (
          <>
            <dl className={styles.capacityGrid}>
              <div>
                <dt>{copy.fullCyclesIn112Days}</dt>
                <dd>{projection.fullCyclesIn112Days}</dd>
              </div>
              <div>
                <dt>{copy.bottlesIn112Days}</dt>
                <dd>{projection.bottlesIn112Days}</dd>
              </div>
            </dl>
            <p className={styles.note}>{copy.continuousSupplyNote}</p>
            <div
              aria-label={copy.cellarCapacity}
              className={styles.capacityReferences}
              role="group"
            >
              {copy.capacityReferences.map((reference) => (
                <div key={reference.count}>
                  <strong>{reference.count}</strong>
                  <span>{reference.label}</span>
                </div>
              ))}
            </div>
            <p className={styles.note}>{copy.caskRules}</p>
          </>
        )}
      </section>
    </section>
  );
}

function CaskAgingNumberField({
  field,
  id,
  label,
  maximum,
  minimum,
  onValueChange,
  errorMessage,
  value,
}: CaskAgingNumberFieldProperties) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={errorMessage === undefined ? undefined : errorId}
        aria-invalid={errorMessage !== undefined}
        id={id}
        max={maximum}
        min={minimum}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onValueChange(field, event.currentTarget.value)
        }
        step={1}
        type="number"
        value={value}
      />
      {errorMessage === undefined ? null : (
        <p className={styles.fieldError} id={errorId} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function getCaskAgingCopy(locale: PublicLocale): CaskAgingCopy {
  const copy = caskAgingCopy[locale];
  if (copy === undefined) {
    throw new Error(`Unsupported Cask aging locale. Received: ${JSON.stringify(locale)}.`);
  }
  return copy;
}

function createCaskAgingDrafts(form: CaskAgingForm): CaskAgingDrafts {
  return {
    day: String(form.day),
    year: String(form.year),
    wineBottleCount: String(form.wineBottleCount),
    emptyCaskCount: String(form.emptyCaskCount),
  };
}

function getNumericFieldRange(field: CaskAgingNumericField, ingredientId: string): Readonly<{
  minimum: number;
  maximum: number;
}> {
  if (field === "day") return { minimum: 1, maximum: 28 };
  if (field === "year") return { minimum: 1, maximum: caskAgingMaximumYear };
  return { minimum: 0, maximum: getCaskAgingMaximumBottleCount(ingredientId) };
}

function getNumericFieldLabel(field: CaskAgingNumericField, copy: CaskAgingCopy): string {
  if (field === "day") return copy.startDay;
  if (field === "year") return copy.startYear;
  if (field === "wineBottleCount") return copy.wineBottleCount;
  return copy.emptyCaskCount;
}

function requireOptionValue<Value extends string>(
  rawValue: string,
  allowedValues: readonly Value[],
  fieldName: string,
): Value {
  const matchingValue = allowedValues.find((allowedValue) => allowedValue === rawValue);
  if (matchingValue === undefined) {
    throw new Error(
      `Cask aging field ${fieldName} is invalid. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return matchingValue;
}

function formatGold(amount: number, locale: PublicLocale, suffix: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount)} ${suffix}`;
}

function formatCaskDate(
  date: Readonly<{ season: CaskAgingSeason; day: number; year: number }>,
  copy: CaskAgingCopy,
  locale: PublicLocale,
): string {
  if (locale === "zh-CN") {
    return `${date.year}${copy.yearLabel}${copy.seasons[date.season]} ${date.day}${copy.dayLabel}`;
  }
  return `${copy.seasons[date.season]} ${date.day}, ${copy.yearLabel} ${date.year}`;
}

function createAgingPlanText(
  form: CaskAgingForm,
  projection: CaskAgingProjection,
  copy: CaskAgingCopy,
  locale: PublicLocale,
): string {
  const selectedIngredient = projection.ingredient;
  const ingredientName =
    locale === "zh-CN" ? selectedIngredient.chineseName : selectedIngredient.englishName;
  const collectionDate = projection.selectedTarget.collectionDate;

  return [
    copy.title,
    `${copy.ingredient}: ${ingredientName}`,
    `${copy.currentQuality}: ${copy.qualities[form.currentQuality]}`,
    `${copy.targetQuality}: ${copy.qualities[form.targetQuality]}`,
    `${copy.startSeason}: ${formatCaskDate({ season: form.season, day: form.day, year: form.year }, copy, locale)}`,
    `${copy.collectionDate}: ${collectionDate === null ? copy.status[projection.selectedTarget.status] : formatCaskDate(collectionDate, copy, locale)}`,
    `${copy.bottlesToAgeNow}: ${projection.bottlesToAgeNow}`,
    `${copy.bottlesWaitingForCasks}: ${projection.bottlesWaitingForCasks}`,
    `${copy.addedGoldForBottlesToAgeNow}: ${formatGold(projection.addedGoldForBottlesToAgeNow, locale, copy.gameGoldSuffix)}`,
    `${copy.additionalCasksNeeded}: ${projection.additionalCasksNeeded}`,
    `${copy.woodNeeded}: ${projection.woodNeeded}`,
    `${copy.hardwoodNeeded}: ${projection.hardwoodNeeded}`,
  ].join("\n");
}
