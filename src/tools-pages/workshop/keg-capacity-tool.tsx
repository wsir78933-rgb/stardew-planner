"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PublicLocale } from "../../i18n/public-locale";
import { getWorkshopToolCopy } from "../../i18n/workshop-tool-copy";
import {
  createKegCapacityPlanHandoff,
  createDefaultKegCapacityInput,
  calculateKegCapacity,
  calculateKegShedSpace,
  isKegCapacityInputFailure,
  KEG_CAPACITY_DEADLINES,
  KEG_SHED_SPACE_REFERENCES,
  kegCapacityStorageKey,
  listKegCapacityIngredients,
  loadKegCapacityInput,
  serializeKegCapacityInput,
  type KegCapacityDeadline,
  type KegCapacityInput,
  type KegCapacityPlanHandoff,
} from "../../workshop-tools/keg-capacity";
import {
  createKegMaterialsHandoff,
  createKegMaterialsHref,
  type KegMaterialsGoal,
} from "../../workshop-tools/keg-materials";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import { copyToolText } from "../copy-tool-text";
import { PlantingSelect, type PlantingSelectOption } from "../planting-select";
import {
  formatWorkshopAverage,
  formatWorkshopCount,
  parseWorkshopInteger,
} from "./workshop-number";
import { WorkshopNumberField } from "./workshop-number-field";
import { WorkshopResultCard } from "./workshop-result-card";
import { WorkshopToolTabs } from "./workshop-tool-tabs";
import styles from "./workshop-tool.module.css";

export type KegCapacityToolProperties = Readonly<{
  locale: PublicLocale;
  onTestProductionPlan?: (handoff: KegCapacityPlanHandoff) => void;
}>;

type NumericFieldName = "quantity" | "existingKegCount" | "harvestIntervalDays";
type NumericFieldDrafts = Partial<Record<NumericFieldName, string>>;
type NumericFieldErrors = Partial<Record<NumericFieldName, string>>;
type CapacityScenario = "current-stock" | "ongoing-production";
type SaveStatus = "empty" | "saved" | "failed";
type CopyStatus = Readonly<{ message: string; failed: boolean; text: string }> | null;

export function KegCapacityTool({ locale, onTestProductionPlan }: KegCapacityToolProperties) {
  const pageCopy = getWorkshopToolCopy(locale);
  const copy = pageCopy.kegCapacity;
  const ingredientOptions = useMemo(
    () => createIngredientOptions(locale),
    [locale],
  );
  const [form, setForm] = useState<KegCapacityInput>(createDefaultKegCapacityInput);
  const [scenario, setScenario] = useState<CapacityScenario>("current-stock");
  const [fieldDrafts, setFieldDrafts] = useState<NumericFieldDrafts>({});
  const [fieldErrors, setFieldErrors] = useState<NumericFieldErrors>({});
  const [storageReady, setStorageReady] = useState(false);
  const [shouldPersist, setShouldPersist] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("empty");
  const [invalidSavedSettings, setInvalidSavedSettings] = useState(false);
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);

  useEffect(() => {
    try {
      const storageText = readBrowserToolStorage(kegCapacityStorageKey);
      setForm(loadKegCapacityInput(storageText));
      setSaveStatus(storageText === null ? "empty" : "saved");
      setShouldPersist(storageText !== null);
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setSaveStatus("failed");
      } else if (isKegCapacityInputFailure(error)) {
        setInvalidSavedSettings(true);
        setSaveStatus("failed");
      } else {
        throw error;
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady || !shouldPersist) {
      return;
    }
    try {
      writeBrowserToolStorage(kegCapacityStorageKey, serializeKegCapacityInput(form));
      setSaveStatus("saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }
      setSaveStatus("failed");
    }
  }, [form, shouldPersist, storageReady]);

  const hasInvalidActiveDraft = hasInvalidRelevantDraft(scenario, fieldDrafts, fieldErrors);
  const calculation = readCapacityCalculation(form, storageReady, hasInvalidActiveDraft);
  const estimate = calculation.estimate;
  const currentStockMaterialsHref = estimate?.kegsNeededForOneHarvest === null || estimate === null
    ? null
    : createMaterialsHref(locale, estimate.kegsNeededForOneHarvest, form.existingKegCount, "single-harvest");
  const steadyStateMaterialsHref = estimate === null
    ? null
    : createMaterialsHref(locale, estimate.kegsNeededForSteadyState, form.existingKegCount, "steady-state");

  function commitNumber(fieldName: NumericFieldName, rawValue: string) {
    const minimum = fieldName === "harvestIntervalDays" ? 1 : 0;
    const fieldLabel = readNumericFieldLabel(fieldName, copy);
    try {
      const parsedValue = parseWorkshopInteger(rawValue, fieldLabel, minimum);
      setForm((currentForm) => ({ ...currentForm, [fieldName]: parsedValue }));
      setShouldPersist(true);
      setFieldDrafts((currentDrafts) => clearField(currentDrafts, fieldName));
      setFieldErrors((currentErrors) => clearField(currentErrors, fieldName));
      setCopyStatus(null);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("Workshop field ")) {
        throw error;
      }
      setFieldDrafts((currentDrafts) => ({ ...currentDrafts, [fieldName]: rawValue }));
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: copy.numericError(fieldLabel, rawValue),
      }));
      setCopyStatus(null);
    }
  }

  function changeIngredient(ingredientId: string) {
    if (!ingredientOptions.some((option) => option.value === ingredientId)) {
      throw new Error(
        `Keg capacity ingredient selection is unavailable. Received: ${JSON.stringify(ingredientId)}.`,
      );
    }
    setForm((currentForm) => ({ ...currentForm, ingredientId }));
    setShouldPersist(true);
    setCopyStatus(null);
  }

  function changeDeadline(rawValue: string) {
    const deadlineDays = readDeadlineValue(rawValue);
    setForm((currentForm) => ({ ...currentForm, deadlineDays }));
    setShouldPersist(true);
    setCopyStatus(null);
  }

  function changeScenario(nextScenario: CapacityScenario) {
    setScenario(nextScenario);
    setCopyStatus(null);
  }

  function requestResetSettings() {
    setIsResetConfirmationOpen(true);
  }

  function cancelResetConfirmation() {
    setIsResetConfirmationOpen(false);
  }

  function confirmResetSettings() {
    setForm(createDefaultKegCapacityInput());
    setShouldPersist(true);
    setFieldDrafts({});
    setFieldErrors({});
    setInvalidSavedSettings(false);
    setCopyStatus(null);
    setIsResetConfirmationOpen(false);
  }

  async function copyEstimate() {
    if (estimate === null) {
      throw new Error("Keg capacity estimate is unavailable while settings are loading or invalid.");
    }
    const resultText = createKegCapacitySummary(estimate, copy, locale, scenario);
    try {
      await copyToolText(resultText);
      setCopyStatus({ message: copy.copied, failed: false, text: "" });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("Clipboard write failed.")) {
        throw error;
      }
      setCopyStatus({ message: copy.copyFailed, failed: true, text: resultText });
    }
  }

  function testCurrentStock() {
    if (onTestProductionPlan === undefined) {
      throw new Error("Keg capacity production-plan callback is not configured.");
    }
    if (scenario !== "current-stock" || hasInvalidRelevantDraft("current-stock", fieldDrafts, fieldErrors) || estimate === null) {
      throw new Error("Keg capacity production-plan handoff requires valid current settings.");
    }
    onTestProductionPlan(createKegCapacityPlanHandoff(form));
  }

  const saveMessage = readSaveMessage(copy, saveStatus);

  return (
    <section aria-labelledby="workshop-keg-capacity-title" className={styles.tool} data-workshop-keg-capacity="true">
      <header className={styles.heading}>
        <h2 id="workshop-keg-capacity-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </header>
      <WorkshopToolTabs currentTool="keg-count" locale={locale} />

      <div className={styles.workspace}>
        <section aria-labelledby="workshop-keg-capacity-settings-title" className={styles.panel}>
          <h3 id="workshop-keg-capacity-settings-title">{copy.settingsTitle}</h3>
          <div aria-labelledby="workshop-keg-capacity-scenario-title" className={styles.scenarioGroup} role="group">
            <h4 id="workshop-keg-capacity-scenario-title">{copy.scenarios.title}</h4>
            <div className={styles.scenarioChoices}>
              <button
                aria-pressed={scenario === "current-stock"}
                className={styles.scenarioButton}
                onClick={() => changeScenario("current-stock")}
                type="button"
              >
                {copy.scenarios.currentStock}
              </button>
              <button
                aria-pressed={scenario === "ongoing-production"}
                className={styles.scenarioButton}
                onClick={() => changeScenario("ongoing-production")}
                type="button"
              >
                {copy.scenarios.ongoingProduction}
              </button>
            </div>
            <p className={styles.note}>
              {scenario === "current-stock" ? copy.scenarios.currentStockHelp : copy.scenarios.ongoingProductionHelp}
            </p>
            {scenario === "current-stock" && fieldErrors.harvestIntervalDays !== undefined ? (
              <p className={styles.status} role="status">{copy.scenarios.hiddenOngoingDraft}</p>
            ) : null}
          </div>
          <div className={styles.settingsGrid}>
            <div className={styles.field}>
              <PlantingSelect
                inputId="workshop-keg-capacity-ingredient"
                label={copy.inputs.ingredient}
                onValueChange={changeIngredient}
                options={ingredientOptions}
                value={form.ingredientId}
              />
            </div>
            <WorkshopNumberField
              error={fieldErrors.quantity}
              id="workshop-keg-capacity-quantity"
              label={scenario === "current-stock" ? copy.inputs.quantity : copy.inputs.quantityPerHarvest}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("quantity", rawValue)}
              value={fieldDrafts.quantity ?? String(form.quantity)}
              help={scenario === "current-stock" ? copy.inputHelp.quantity : copy.inputHelp.quantityPerHarvest}
            />
            {scenario === "current-stock" ? (
              <div className={styles.field}>
                <PlantingSelect
                  inputId="workshop-keg-capacity-deadline"
                  label={copy.inputs.deadline}
                  onValueChange={changeDeadline}
                  options={createDeadlineOptions(locale)}
                  value={String(form.deadlineDays)}
                />
                <p className={styles.help}>{copy.inputHelp.deadline}</p>
              </div>
            ) : null}
            <WorkshopNumberField
              error={fieldErrors.existingKegCount}
              id="workshop-keg-capacity-existing-kegs"
              label={copy.inputs.existingKegs}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("existingKegCount", rawValue)}
              value={fieldDrafts.existingKegCount ?? String(form.existingKegCount)}
            />
            {scenario === "ongoing-production" ? (
              <WorkshopNumberField
                error={fieldErrors.harvestIntervalDays}
                id="workshop-keg-capacity-harvest-interval"
                label={copy.inputs.harvestInterval}
                minimum={1}
                onValueChange={(rawValue) => commitNumber("harvestIntervalDays", rawValue)}
                value={fieldDrafts.harvestIntervalDays ?? String(form.harvestIntervalDays)}
                help={copy.inputHelp.harvestInterval}
              />
            ) : null}
          </div>
          {invalidSavedSettings ? (
            <p className={styles.alert} role="alert">{copy.invalidSavedSettings}</p>
          ) : null}
          <p className={styles.status} role={saveStatus === "failed" ? "alert" : "status"} aria-live="polite">
            {saveMessage}
          </p>
          <div className={styles.actions}>
            {onTestProductionPlan === undefined || scenario !== "current-stock" ? null : (
              <button
                className={styles.action}
                disabled={hasInvalidRelevantDraft("current-stock", fieldDrafts, fieldErrors) || estimate === null}
                onClick={testCurrentStock}
                type="button"
              >
                {copy.currentStockPlan}
              </button>
            )}
            <button className={styles.secondaryAction} onClick={requestResetSettings} type="button">
              {copy.reset}
            </button>
          </div>
          {isResetConfirmationOpen ? (
            <div aria-label={pageCopy.resetConfirmation.prompt} className={styles.resetConfirmation} role="group">
              <p>{pageCopy.resetConfirmation.prompt}</p>
              <div className={styles.actions}>
                <button className={styles.action} onClick={confirmResetSettings} type="button">
                  {pageCopy.resetConfirmation.confirm}
                </button>
                <button className={styles.secondaryAction} onClick={cancelResetConfirmation} type="button">
                  {pageCopy.resetConfirmation.cancel}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="workshop-keg-capacity-results-title" className={styles.panel}>
          <h3 id="workshop-keg-capacity-results-title">{copy.resultsTitle}</h3>
          {calculation.errorMessage === null ? null : (
            <p className={styles.alert} role="alert">{copy.invalidCalculation} {calculation.errorMessage}</p>
          )}
          {estimate === null ? null : renderCapacityResults(estimate, copy, locale, scenario)}
          <div className={styles.actions}>
            {scenario === "current-stock" && currentStockMaterialsHref !== null ? (
              <Link className={styles.link} href={currentStockMaterialsHref}>
                {copy.oneHarvestMaterials}
              </Link>
            ) : null}
            {scenario === "ongoing-production" && steadyStateMaterialsHref !== null ? (
              <Link className={styles.link} href={steadyStateMaterialsHref}>
                {copy.steadyStateMaterials}
              </Link>
            ) : null}
            <button className={styles.action} disabled={estimate === null} onClick={() => void copyEstimate()} type="button">
              {copy.copyResult}
            </button>
          </div>
          {copyStatus === null ? null : (
            <p className={copyStatus.failed ? styles.alert : styles.status} role={copyStatus.failed ? "alert" : "status"}>
              {copyStatus.message}
            </p>
          )}
          {copyStatus?.failed ? (
            <div className={styles.copyFallback}>
              <label htmlFor="workshop-keg-capacity-manual-copy">{copy.manualCopy}</label>
              <textarea id="workshop-keg-capacity-manual-copy" readOnly rows={6} value={copyStatus.text} />
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}

function createIngredientOptions(locale: PublicLocale): readonly PlantingSelectOption[] {
  return listKegCapacityIngredients().map((ingredient) => {
    const label = locale === "en" ? ingredient.englishName : ingredient.chineseName;
    if (label.trim().length === 0) {
      throw new Error(
        `Keg capacity ingredient label is empty. Received ingredientId=${JSON.stringify(ingredient.id)}, locale=${JSON.stringify(locale)}.`,
      );
    }
    return { value: ingredient.id, label };
  });
}

function createDeadlineOptions(locale: PublicLocale): readonly PlantingSelectOption[] {
  return KEG_CAPACITY_DEADLINES.map((deadlineDays) => ({
    value: String(deadlineDays),
    label: locale === "en" ? `${deadlineDays} days` : `${deadlineDays}天`,
  }));
}

function readDeadlineValue(rawValue: string): KegCapacityDeadline {
  const deadlineDays = Number(rawValue);
  if (!KEG_CAPACITY_DEADLINES.includes(deadlineDays as KegCapacityDeadline)) {
    throw new Error(`Keg capacity deadline option is invalid. Received: ${JSON.stringify(rawValue)}.`);
  }
  return deadlineDays as KegCapacityDeadline;
}

function readNumericFieldLabel(
  fieldName: NumericFieldName,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
): string {
  if (fieldName === "quantity") return copy.inputs.quantity;
  if (fieldName === "existingKegCount") return copy.inputs.existingKegs;
  return copy.inputs.harvestInterval;
}

function clearField<FieldName extends string, FieldValue>(
  fields: Partial<Record<FieldName, FieldValue>>,
  fieldName: FieldName,
): Partial<Record<FieldName, FieldValue>> {
  const nextFields = { ...fields };
  delete nextFields[fieldName];
  return nextFields;
}

function readCapacityCalculation(
  form: KegCapacityInput,
  storageReady: boolean,
  hasInvalidDraft: boolean,
): Readonly<{ estimate: ReturnType<typeof calculateKegCapacity> | null; errorMessage: string | null }> {
  if (!storageReady || hasInvalidDraft) {
    return { estimate: null, errorMessage: null };
  }
  try {
    return { estimate: calculateKegCapacity(form), errorMessage: null };
  } catch (error) {
    if (!isKegCapacityInputFailure(error)) {
      throw error;
    }
    return { estimate: null, errorMessage: error.message };
  }
}

function hasInvalidRelevantDraft(
  scenario: CapacityScenario,
  fieldDrafts: NumericFieldDrafts,
  fieldErrors: NumericFieldErrors,
): boolean {
  const relevantFields: readonly NumericFieldName[] = scenario === "current-stock"
    ? ["quantity", "existingKegCount"]
    : ["quantity", "existingKegCount", "harvestIntervalDays"];
  return relevantFields.some((fieldName) =>
    fieldDrafts[fieldName] !== undefined || fieldErrors[fieldName] !== undefined,
  );
}

function createMaterialsHref(
  locale: PublicLocale,
  targetKegCount: number,
  existingKegCount: number,
  goal: KegMaterialsGoal,
): string {
  return createKegMaterialsHref(
    locale,
    createKegMaterialsHandoff(targetKegCount, existingKegCount, goal),
  );
}

function renderCapacityResults(
  estimate: ReturnType<typeof calculateKegCapacity>,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  locale: PublicLocale,
  scenario: CapacityScenario,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const singleHarvestValue = estimate.oneHarvestCannotFinish
    ? copy.oneHarvestCannotFinish(formatCount(estimate.deadlineDays))
    : estimate.kegsNeededForOneHarvest === 0
      ? copy.noCompleteBatch(formatCount(estimate.quantity), formatCount(estimate.batchInputUnits))
      : formatCount(estimate.kegsNeededForOneHarvest ?? 0);

  return (
    <>
      <p className={styles.note}>
        {copy.recipeSummary(
          formatCount(estimate.batchInputUnits),
          formatCount(estimate.processingMornings),
          formatCount(estimate.processingMinutes),
        )}
      </p>
      <p className={styles.note}>
        {copy.quantityBreakdown(
          formatCount(estimate.completeBatchesPerHarvest),
          formatCount(estimate.unitsBelowOneBatch),
        )}
      </p>
      {scenario === "current-stock" ? (
        <>
          <h4>{copy.singleHarvestTitle}</h4>
          <div className={styles.primaryResultGrid}>
            <WorkshopResultCard label={copy.kegsRequired} value={singleHarvestValue} />
            <WorkshopResultCard
              label={copy.additionalKegs}
              value={estimate.additionalKegsForOneHarvest === null
                ? "—"
                : formatCount(estimate.additionalKegsForOneHarvest)}
            />
          </div>
          <div className={styles.resultGrid}>
            <WorkshopResultCard
              label={copy.oneKegCapacity}
              value={`${formatCount(estimate.oneKegQuote.processedUnits)} / ${formatCount(estimate.quantity)}`}
              detail={copy.rawUnitsLeft(formatCount(estimate.oneKegQuote.backlogUnits))}
            />
            <WorkshopResultCard
              label={copy.currentKegCapacity}
              value={`${formatCount(estimate.existingKegsQuote.processedUnits)} / ${formatCount(estimate.quantity)}`}
              detail={copy.rawUnitsLeft(formatCount(estimate.existingKegsQuote.backlogUnits))}
            />
          </div>
        </>
      ) : (
        <>
          <h4>{copy.longTermTitle}</h4>
          <p className={styles.note}>{copy.longTermDescription}</p>
          {renderLongTermMetrics(estimate, copy, locale)}
        </>
      )}
      {renderShedSpaceReference(estimate, copy, locale, scenario)}
    </>
  );
}

function renderLongTermMetrics(
  estimate: ReturnType<typeof calculateKegCapacity>,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  locale: PublicLocale,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  return (
    <>
      <div className={styles.primaryResultGrid}>
        <WorkshopResultCard
          label={copy.steadyKegsRequired}
          value={formatCount(estimate.kegsNeededForSteadyState)}
        />
        <WorkshopResultCard
          label={copy.additionalKegs}
          value={formatCount(estimate.additionalKegsForSteadyState)}
        />
      </div>
      <table className={styles.metricTable}>
        <tbody>
          <tr>
            <th scope="row">{copy.averageCapacity}</th>
            <td>{formatWorkshopAverage(estimate.averageBatchesPerHarvestWithExistingKegs, locale)} {copy.completeBatchesUnit}</td>
          </tr>
          <tr>
            <th scope="row">{copy.averageBacklogGrowth}</th>
            <td>{formatWorkshopAverage(estimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs, locale)} {copy.rawUnitsUnit}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function renderShedSpaceReference(
  estimate: ReturnType<typeof calculateKegCapacity>,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  locale: PublicLocale,
  scenario: CapacityScenario,
) {
  const targetKegs = scenario === "current-stock"
    ? estimate.kegsNeededForOneHarvest
    : estimate.kegsNeededForSteadyState;
  const targetLabel = scenario === "current-stock" ? copy.singleHarvestTitle : copy.longTermTitle;
  return (
    <details className={styles.shedSpace}>
      <summary className={styles.detailsSummary}>{copy.shedSpaceTitle}</summary>
      <div className={styles.shedSpaceGrid}>
        {KEG_SHED_SPACE_REFERENCES.map((shedReference) => renderShedSpaceCard(
          shedReference,
          targetKegs,
          targetLabel,
          estimate,
          copy,
          locale,
        ))}
      </div>
      <p className={styles.note}>{copy.shedSpaceNote}</p>
    </details>
  );
}

function renderShedSpaceCard(
  shedReference: (typeof KEG_SHED_SPACE_REFERENCES)[number],
  targetKegs: number | null,
  targetLabel: string,
  estimate: ReturnType<typeof calculateKegCapacity>,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  locale: PublicLocale,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const shedName = shedReference.id === "regular" ? copy.standardShed : copy.largeShed;
  const shedSpace = targetKegs === null
    ? copy.oneHarvestCannotFinish(formatCount(estimate.deadlineDays))
    : formatShedSpaceSummary(
        targetKegs,
        shedReference.spacesPerShed,
        formatCount,
        copy,
      );
  return (
    <article className={styles.resultCard} key={shedReference.id}>
      <h5 className={styles.resultLabel}>{shedName}</h5>
      <p className={styles.shedSpaceMetric}><strong>{targetLabel}:</strong> {shedSpace}</p>
    </article>
  );
}

function formatShedSpaceSummary(
  targetKegs: number,
  spacesPerShed: number,
  formatCount: (value: number) => string,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
): string {
  const spaceEstimate = calculateKegShedSpace(targetKegs, spacesPerShed);
  return copy.shedSpaceSummary(
    formatCount(spaceEstimate.shedCount),
    formatCount(spaceEstimate.emptySpaces),
  );
}

function createKegCapacitySummary(
  estimate: ReturnType<typeof calculateKegCapacity>,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  locale: PublicLocale,
  scenario: CapacityScenario,
): string {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const lines = [
    copy.title,
    scenario === "current-stock" ? copy.scenarios.currentStock : copy.scenarios.ongoingProduction,
    locale === "en" ? estimate.ingredient.englishName : estimate.ingredient.chineseName,
    copy.recipeSummary(
      formatCount(estimate.batchInputUnits),
      formatCount(estimate.processingMornings),
      formatCount(estimate.processingMinutes),
    ),
  ];
  if (scenario === "current-stock") {
    const singleKegs = estimate.kegsNeededForOneHarvest === null
      ? copy.oneHarvestCannotFinish(formatCount(estimate.deadlineDays))
      : formatCount(estimate.kegsNeededForOneHarvest);
    lines.push(
      `${copy.inputs.quantity}: ${formatCount(estimate.quantity)}`,
      `${copy.inputs.deadline}: ${formatCount(estimate.deadlineDays)}`,
      `${copy.inputs.existingKegs}: ${formatCount(estimate.existingKegCount)}`,
      `${copy.kegsRequired}: ${singleKegs}`,
      `${copy.additionalKegs}: ${formatCount(estimate.additionalKegsForOneHarvest ?? 0)}`,
      `${copy.currentKegCapacity}: ${formatCount(estimate.existingKegsQuote.processedUnits)} / ${formatCount(estimate.quantity)}`,
    );
  } else {
    lines.push(
      `${copy.inputs.quantityPerHarvest}: ${formatCount(estimate.quantity)}`,
      `${copy.inputs.harvestInterval}: ${formatCount(estimate.harvestIntervalDays)}`,
      `${copy.inputs.existingKegs}: ${formatCount(estimate.existingKegCount)}`,
      `${copy.steadyKegsRequired}: ${formatCount(estimate.kegsNeededForSteadyState)}`,
      `${copy.averageCapacity}: ${formatWorkshopAverage(estimate.averageBatchesPerHarvestWithExistingKegs, locale)}`,
      `${copy.averageBacklogGrowth}: ${formatWorkshopAverage(estimate.averageBacklogGrowthUnitsPerHarvestWithExistingKegs, locale)}`,
    );
  }
  return lines.join("\n");
}

function readSaveMessage(
  copy: ReturnType<typeof getWorkshopToolCopy>["kegCapacity"],
  saveStatus: SaveStatus,
): string {
  if (saveStatus === "saved") return copy.saveSuccess;
  if (saveStatus === "failed") return copy.saveFailed;
  return copy.saveEmpty;
}
