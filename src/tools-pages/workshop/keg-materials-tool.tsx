"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicLocale } from "../../i18n/public-locale";
import { getWorkshopToolCopy } from "../../i18n/workshop-tool-copy";
import {
  applyKegMaterialsHandoff,
  calculateKegMaterials,
  createDefaultKegMaterialsInput,
  isKegMaterialsInputFailure,
  kegMaterialsStorageKey,
  loadKegMaterialsInput,
  readKegMaterialsHandoffFromSearch,
  serializeKegMaterialsInput,
  type KegMaterialName,
  type KegMaterialsEstimate,
  type KegMaterialsInput,
} from "../../workshop-tools/keg-materials";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "../browser-tool-storage";
import { copyToolText } from "../copy-tool-text";
import { PlantingSelect, type PlantingSelectOption } from "../planting-select";
import { formatWorkshopCount, parseWorkshopInteger } from "./workshop-number";
import { WorkshopNumberField } from "./workshop-number-field";
import { WorkshopResultCard } from "./workshop-result-card";
import { WorkshopToolTabs } from "./workshop-tool-tabs";
import styles from "./workshop-tool.module.css";

export type KegMaterialsToolProperties = Readonly<{ locale: PublicLocale }>;

type NumericFieldName =
  | "targetKegCount"
  | "existingKegCount"
  | "matureOakTapperCount"
  | "waitingDays"
  | `inventory.${KegMaterialName}`;
type NumericFieldDrafts = Partial<Record<NumericFieldName, string>>;
type NumericFieldErrors = Partial<Record<NumericFieldName, string>>;
type SaveStatus = "empty" | "saved" | "failed";
type CopyKind = "materials" | "resin";
type CopyStatus = Readonly<{ message: string; failed: boolean; text: string }> | null;

const KEG_MATERIAL_NAMES: readonly KegMaterialName[] = [
  "wood",
  "copperBar",
  "ironBar",
  "oakResin",
];
const KEG_MATERIALS_HANDOFF_PARAMETER_NAMES = ["kegTarget", "kegExisting", "kegSource"] as const;

export function KegMaterialsTool({ locale }: KegMaterialsToolProperties) {
  const pageCopy = getWorkshopToolCopy(locale);
  const copy = pageCopy.kegMaterials;
  const [form, setForm] = useState<KegMaterialsInput>(createDefaultKegMaterialsInput);
  const [fieldDrafts, setFieldDrafts] = useState<NumericFieldDrafts>({});
  const [fieldErrors, setFieldErrors] = useState<NumericFieldErrors>({});
  const [storageReady, setStorageReady] = useState(false);
  const [shouldPersist, setShouldPersist] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("empty");
  const [invalidSavedSettings, setInvalidSavedSettings] = useState(false);
  const [invalidUrlHandoff, setInvalidUrlHandoff] = useState(false);
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const [handoffMessage, setHandoffMessage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const hasRestoredInitialSettings = useRef(false);

  useEffect(() => {
    if (hasRestoredInitialSettings.current) {
      return;
    }
    hasRestoredInitialSettings.current = true;

    let nextForm = createDefaultKegMaterialsInput();
    let persistLoadedForm = false;
    try {
      const storageText = readBrowserToolStorage(kegMaterialsStorageKey);
      nextForm = loadKegMaterialsInput(storageText);
      persistLoadedForm = storageText !== null;
      setSaveStatus(storageText === null ? "empty" : "saved");
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setSaveStatus("failed");
      } else if (isKegMaterialsInputFailure(error)) {
        setInvalidSavedSettings(true);
        setSaveStatus("failed");
      } else {
        throw error;
      }
    }

    if (typeof window !== "undefined") {
      try {
        const handoff = readKegMaterialsHandoffFromSearch(window.location.search);
        if (handoff !== null) {
          nextForm = applyKegMaterialsHandoff(nextForm, handoff);
          persistLoadedForm = true;
          removeConsumedKegMaterialsHandoffParameters();
          const sourceName = handoff.source === "single-harvest"
            ? copy.sourceNames.singleHarvest
            : copy.sourceNames.steadyState;
          setHandoffMessage(copy.handoffApplied(sourceName));
        }
      } catch (error) {
        if (!isKegMaterialsInputFailure(error)) {
          throw error;
        }
        setInvalidUrlHandoff(true);
      }
    }

    setForm(nextForm);
    setShouldPersist(persistLoadedForm);
    setStorageReady(true);
  }, [copy]);

  useEffect(() => {
    if (!storageReady || !shouldPersist) {
      return;
    }
    try {
      writeBrowserToolStorage(kegMaterialsStorageKey, serializeKegMaterialsInput(form));
      setSaveStatus("saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }
      setSaveStatus("failed");
    }
  }, [form, shouldPersist, storageReady]);

  const hasInvalidDraft = Object.keys(fieldDrafts).length > 0 || Object.keys(fieldErrors).length > 0;
  const calculation = readMaterialsCalculation(form, storageReady, hasInvalidDraft);

  function commitNumber(fieldName: NumericFieldName, rawValue: string) {
    const fieldLabel = readNumericFieldLabel(fieldName, copy);
    try {
      const parsedValue = parseWorkshopInteger(rawValue, fieldLabel, 0);
      setForm((currentForm) => updateNumericValue(currentForm, fieldName, parsedValue));
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

  function changeTapperType(rawValue: string) {
    if (rawValue !== "regular" && rawValue !== "heavy") {
      throw new Error(`Workshop tapper option is invalid. Received: ${JSON.stringify(rawValue)}.`);
    }
    setForm((currentForm) => ({ ...currentForm, tapperType: rawValue }));
    setShouldPersist(true);
    setCopyStatus(null);
  }

  function requestResetSettings() {
    setIsResetConfirmationOpen(true);
  }

  function cancelResetConfirmation() {
    setIsResetConfirmationOpen(false);
  }

  function confirmResetSettings() {
    setForm(createDefaultKegMaterialsInput());
    setShouldPersist(true);
    setFieldDrafts({});
    setFieldErrors({});
    setInvalidSavedSettings(false);
    setHandoffMessage(null);
    setCopyStatus(null);
    setIsResetConfirmationOpen(false);
  }

  async function copyEstimate(kind: CopyKind) {
    if (calculation.estimate === null) {
      throw new Error("Keg materials result is unavailable while settings are loading or invalid.");
    }
    const resultText = createKegMaterialsSummary(form, calculation.estimate, copy, locale, kind);
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

  const saveMessage = readSaveMessage(copy, saveStatus);

  return (
    <section aria-labelledby="workshop-keg-materials-title" className={styles.tool} data-workshop-keg-materials="true">
      <header className={styles.heading}>
        <h2 id="workshop-keg-materials-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </header>
      <WorkshopToolTabs currentTool="materials-and-resin" locale={locale} />

      {calculation.errorMessage === null ? null : (
        <p className={styles.alert} role="alert">{copy.invalidCalculation} {calculation.errorMessage}</p>
      )}

      <div className={styles.materialsLayout}>
        <div className={styles.materialsGoalRow}>
          <section aria-labelledby="workshop-keg-materials-settings-title" className={`${styles.panel} ${styles.goalFields}`}>
            <h3 id="workshop-keg-materials-settings-title">{copy.settingsTitle}</h3>
            <div className={styles.goalInputGrid}>
            <WorkshopNumberField
              error={fieldErrors.targetKegCount}
              id="workshop-keg-materials-target-kegs"
              label={copy.inputs.targetKegs}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("targetKegCount", rawValue)}
              value={fieldDrafts.targetKegCount ?? String(form.targetKegCount)}
            />
            <WorkshopNumberField
              error={fieldErrors.existingKegCount}
              id="workshop-keg-materials-existing-kegs"
              label={copy.inputs.existingKegs}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("existingKegCount", rawValue)}
              value={fieldDrafts.existingKegCount ?? String(form.existingKegCount)}
            />
            </div>
          </section>
          <WorkshopResultCard
            label={copy.kegsToBuild}
            value={calculation.estimate === null
              ? "—"
              : formatWorkshopCount(calculation.estimate.kegsToBuild, locale)}
          />
        </div>

        <section aria-labelledby="workshop-keg-materials-inventory-title" className={styles.panel}>
          <h3 id="workshop-keg-materials-inventory-title">{copy.inventoryTitle}</h3>
          <div className={styles.inventoryGrid}>
            {KEG_MATERIAL_NAMES.map((materialName) => renderMaterialInventoryField(materialName, form, fieldDrafts, fieldErrors, copy, commitNumber))}
          </div>
          <p className={styles.note}>{copy.inputHelp.recipe}</p>
          {handoffMessage === null ? null : <p className={styles.status} role="status">{handoffMessage}</p>}
          {invalidSavedSettings ? <p className={styles.alert} role="alert">{copy.invalidSavedSettings}</p> : null}
          {invalidUrlHandoff ? <p className={styles.alert} role="alert">{copy.invalidUrl}</p> : null}
          <p className={styles.status} role={saveStatus === "failed" ? "alert" : "status"} aria-live="polite">
            {saveMessage}
          </p>
        </section>

        {calculation.estimate === null ? null : renderKegBuildResults(calculation.estimate, copy, locale)}

        {calculation.estimate === null ? null : renderMaterialShortageSummary(calculation.estimate, copy, locale)}

        {calculation.estimate === null ? null : renderMaterialsTable(calculation.estimate, copy, locale)}

        <section aria-labelledby="workshop-keg-materials-resin-title" className={styles.panel}>
          <h3 id="workshop-keg-materials-resin-title">{copy.resinTitle}</h3>
          <div className={styles.resinInputGrid}>
            <WorkshopNumberField
              error={fieldErrors.matureOakTapperCount}
              id="workshop-keg-materials-mature-oaks"
              label={copy.inputs.matureOakTappers}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("matureOakTapperCount", rawValue)}
              value={fieldDrafts.matureOakTapperCount ?? String(form.matureOakTapperCount)}
            />
            <div className={styles.field}>
              <PlantingSelect
                inputId="workshop-keg-materials-tapper-type"
                label={copy.inputs.tapperType}
                onValueChange={changeTapperType}
                options={createTapperOptions(copy)}
                value={form.tapperType}
              />
            </div>
            <WorkshopNumberField
              error={fieldErrors.waitingDays}
              id="workshop-keg-materials-waiting-days"
              label={copy.inputs.waitingDays}
              minimum={0}
              onValueChange={(rawValue) => commitNumber("waitingDays", rawValue)}
              value={fieldDrafts.waitingDays ?? String(form.waitingDays)}
              help={copy.inputHelp.resin}
            />
          </div>
          <p className={styles.note}>{copy.inputHelp.exclusions}</p>
          {calculation.estimate === null ? null : renderResinResults(calculation.estimate, copy, locale)}
        </section>

        <div className={styles.actions}>
            <button
              className={styles.action}
              disabled={calculation.estimate === null}
              onClick={() => void copyEstimate("materials")}
              type="button"
            >
              {copy.copyMaterials}
            </button>
            <button
              className={styles.secondaryAction}
              disabled={calculation.estimate === null}
              onClick={() => void copyEstimate("resin")}
              type="button"
            >
              {copy.copyResult}
            </button>
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
        {copyStatus === null ? null : (
          <p className={copyStatus.failed ? styles.alert : styles.status} role={copyStatus.failed ? "alert" : "status"}>
            {copyStatus.message}
          </p>
        )}
        {copyStatus?.failed ? (
          <div className={styles.copyFallback}>
            <label htmlFor="workshop-keg-materials-manual-copy">{copy.manualCopy}</label>
            <textarea id="workshop-keg-materials-manual-copy" readOnly rows={8} value={copyStatus.text} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function renderMaterialInventoryField(
  materialName: KegMaterialName,
  form: KegMaterialsInput,
  fieldDrafts: NumericFieldDrafts,
  fieldErrors: NumericFieldErrors,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  commitNumber: (fieldName: NumericFieldName, rawValue: string) => void,
) {
  const fieldName = `inventory.${materialName}` as const;
  const fieldId = `workshop-keg-materials-inventory-${materialName}`;
  return (
    <WorkshopNumberField
      error={fieldErrors[fieldName]}
      id={fieldId}
      key={materialName}
      label={readNumericFieldLabel(fieldName, copy)}
      minimum={0}
      onValueChange={(rawValue) => commitNumber(fieldName, rawValue)}
      value={fieldDrafts[fieldName] ?? String(form.inventory[materialName])}
    />
  );
}

function removeConsumedKegMaterialsHandoffParameters(): void {
  const searchParameters = new URLSearchParams(window.location.search);
  for (const parameterName of KEG_MATERIALS_HANDOFF_PARAMETER_NAMES) {
    searchParameters.delete(parameterName);
  }
  const remainingQuery = searchParameters.toString();
  const cleanUrl = `${window.location.pathname}${remainingQuery.length === 0 ? "" : `?${remainingQuery}`}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
}

function createTapperOptions(
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
): readonly PlantingSelectOption[] {
  return [
    { value: "regular", label: copy.tapperTypes.regular },
    { value: "heavy", label: copy.tapperTypes.heavy },
  ];
}

function readNumericFieldLabel(
  fieldName: NumericFieldName,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
): string {
  if (fieldName.startsWith("inventory.")) {
    const materialName = fieldName.slice("inventory.".length) as KegMaterialName;
    return copy.materialNames[materialName];
  }
  if (fieldName === "targetKegCount") return copy.inputs.targetKegs;
  if (fieldName === "existingKegCount") return copy.inputs.existingKegs;
  if (fieldName === "matureOakTapperCount") return copy.inputs.matureOakTappers;
  return copy.inputs.waitingDays;
}

function updateNumericValue(
  form: KegMaterialsInput,
  fieldName: NumericFieldName,
  parsedValue: number,
): KegMaterialsInput {
  if (fieldName.startsWith("inventory.")) {
    const materialName = fieldName.slice("inventory.".length) as KegMaterialName;
    return { ...form, inventory: { ...form.inventory, [materialName]: parsedValue } };
  }
  return { ...form, [fieldName]: parsedValue };
}

function clearField<FieldName extends string, FieldValue>(
  fields: Partial<Record<FieldName, FieldValue>>,
  fieldName: FieldName,
): Partial<Record<FieldName, FieldValue>> {
  const nextFields = { ...fields };
  delete nextFields[fieldName];
  return nextFields;
}

function readMaterialsCalculation(
  form: KegMaterialsInput,
  storageReady: boolean,
  hasInvalidDraft: boolean,
): Readonly<{ estimate: KegMaterialsEstimate | null; errorMessage: string | null }> {
  if (!storageReady || hasInvalidDraft) {
    return { estimate: null, errorMessage: null };
  }
  try {
    return { estimate: calculateKegMaterials(form), errorMessage: null };
  } catch (error) {
    if (!isKegMaterialsInputFailure(error)) {
      throw error;
    }
    return { estimate: null, errorMessage: error.message };
  }
}

function renderMaterialsTable(
  estimate: KegMaterialsEstimate,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  locale: PublicLocale,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);

  return (
    <details className={styles.panel}>
      <summary className={styles.detailsSummary}>{copy.detailsTitle}</summary>
      <h3 id="workshop-keg-materials-results-title">{copy.resultsTitle}</h3>
      <div className={styles.tableScroll}>
        <div className={styles.desktopMaterialsTable} data-workshop-materials-view="desktop">
          <table className={styles.materialTable}>
            <thead>
              <tr>
                <th scope="col">{copy.material}</th>
                <th scope="col">{copy.perKeg}</th>
                <th scope="col">{copy.targetNeed}</th>
                <th scope="col">{copy.currentInventory}</th>
                <th scope="col">{copy.shortage}</th>
                <th scope="col">{copy.remainder}</th>
              </tr>
            </thead>
            <tbody>
              {KEG_MATERIAL_NAMES.map((materialName) => {
                const requirement = estimate.requirements[materialName];
                return (
                  <tr key={materialName}>
                    <th scope="row">{copy.materialNames[materialName]}</th>
                    <td>{formatCount(requirement.unitsPerKeg)}</td>
                    <td>{formatCount(requirement.targetNeed)}</td>
                    <td>{formatCount(requirement.currentInventory)}</td>
                    <td>{formatCount(requirement.shortageNow)}</td>
                    <td>{formatCount(requirement.remainingAfterBuildingNow)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <table className={styles.mobileMaterialTable} data-workshop-materials-view="mobile">
          <thead>
            <tr>
              <th scope="col">{copy.material}</th>
              <th scope="col">{copy.mobileNeedAndInventory}</th>
              <th scope="col">{copy.shortage}</th>
            </tr>
          </thead>
          <tbody>
            {KEG_MATERIAL_NAMES.map((materialName) => {
              const requirement = estimate.requirements[materialName];
              return (
                <tr key={materialName}>
                  <th scope="row">{copy.materialNames[materialName]}</th>
                  <td>{formatCount(requirement.targetNeed)} / {formatCount(requirement.currentInventory)}</td>
                  <td>{formatCount(requirement.shortageNow)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function renderMaterialShortageSummary(
  estimate: KegMaterialsEstimate,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  locale: PublicLocale,
) {
  const shortMaterials = KEG_MATERIAL_NAMES.flatMap((materialName) => {
    const shortage = estimate.requirements[materialName].shortageNow;
    return shortage > 0 ? [{ materialName, shortage }] : [];
  });

  return (
    <section aria-labelledby="workshop-keg-materials-shortages-title" className={styles.materialShortageSummary}>
      <h3 id="workshop-keg-materials-shortages-title">{copy.shortagesTitle}</h3>
      {shortMaterials.length === 0 ? (
        <p className={styles.note}>{copy.noShortages}</p>
      ) : (
        <ul>
          {shortMaterials.map(({ materialName, shortage }) => (
            <li key={materialName}>
              {copy.materialNames[materialName]}: {formatWorkshopCount(shortage, locale)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function renderKegBuildResults(
  estimate: KegMaterialsEstimate,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  locale: PublicLocale,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const bottleneckName = estimate.bottleneckMaterial === null
    ? copy.noBottleneck
    : copy.materialNames[estimate.bottleneckMaterial];

  return (
    <div className={styles.buildResultGrid}>
      <WorkshopResultCard label={copy.buildableNow} value={formatCount(estimate.buildableNowCount)} />
      <WorkshopResultCard label={copy.remainingKegs} value={formatCount(estimate.remainingKegsAfterBuildingNow)} />
      <WorkshopResultCard label={copy.bottleneck} value={bottleneckName} />
    </div>
  );
}

function renderResinResults(
  estimate: KegMaterialsEstimate,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  locale: PublicLocale,
) {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const untilEnough = estimate.resin.daysUntilEnough === null
    ? copy.noCurrentTappers
    : locale === "en"
      ? `${formatCount(estimate.resin.daysUntilEnough)} days`
      : `${formatCount(estimate.resin.daysUntilEnough)}天`;
  const tappersNeeded = estimate.resin.matureOakTappersNeededByDeadline === null
    ? copy.cannotMeetDeadline
    : formatCount(estimate.resin.matureOakTappersNeededByDeadline);

  return (
    <>
      <p className={styles.note}>{copy.resinCycle(formatCount(estimate.resin.cycleDays), formatCount(estimate.resin.completedCycles))}</p>
      {estimate.resin.shortageNow > 0 && estimate.resin.daysUntilEnough === null ? (
        <p className={styles.note}>{copy.noCurrentTappers}</p>
      ) : null}
      {estimate.resin.matureOakTappersNeededByDeadline === null ? (
        <p className={styles.note}>{copy.cannotMeetDeadline}</p>
      ) : null}
      {estimate.resin.shortageNow === 0 ? <p className={styles.note}>{copy.noResinNeeded}</p> : null}
      <div className={styles.resultGrid}>
        <WorkshopResultCard label={copy.resinProduced} value={formatCount(estimate.resin.producedByDeadline)} />
        <WorkshopResultCard label={copy.resinShortageAtDeadline} value={formatCount(estimate.resin.shortageAtDeadline)} />
        <WorkshopResultCard label={copy.daysUntilEnough} value={untilEnough} />
        <WorkshopResultCard label={copy.tappersNeededByDeadline} value={tappersNeeded} />
      </div>
    </>
  );
}

function createKegMaterialsSummary(
  input: KegMaterialsInput,
  estimate: KegMaterialsEstimate,
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  locale: PublicLocale,
  kind: CopyKind,
): string {
  const formatCount = (value: number) => formatWorkshopCount(value, locale);
  const lines = [copy.title, `${copy.kegsToBuild}: ${formatCount(estimate.kegsToBuild)}`];
  if (kind === "materials") {
    for (const materialName of KEG_MATERIAL_NAMES) {
      const requirement = estimate.requirements[materialName];
      lines.push(
        `${copy.materialNames[materialName]}: ${formatCount(requirement.targetNeed)} needed; ${formatCount(requirement.currentInventory)} in inventory; ${formatCount(requirement.shortageNow)} short; ${formatCount(requirement.remainingAfterBuildingNow)} left after building now.`,
      );
    }
    lines.push(`${copy.buildableNow}: ${formatCount(estimate.buildableNowCount)}`);
    lines.push(`${copy.bottleneck}: ${estimate.bottleneckMaterial === null ? copy.noBottleneck : copy.materialNames[estimate.bottleneckMaterial]}`);
  } else {
    lines.push(copy.resinCycle(formatCount(estimate.resin.cycleDays), formatCount(estimate.resin.completedCycles)));
    lines.push(`${copy.resinProduced}: ${formatCount(estimate.resin.producedByDeadline)}`);
    lines.push(`${copy.resinShortageAtDeadline}: ${formatCount(estimate.resin.shortageAtDeadline)}`);
    lines.push(`${copy.daysUntilEnough}: ${estimate.resin.daysUntilEnough === null ? copy.noCurrentTappers : formatCount(estimate.resin.daysUntilEnough)}`);
    lines.push(`${copy.tappersNeededByDeadline}: ${estimate.resin.matureOakTappersNeededByDeadline === null ? copy.cannotMeetDeadline : formatCount(estimate.resin.matureOakTappersNeededByDeadline)}`);
    lines.push(`${copy.inputs.waitingDays}: ${formatCount(input.waitingDays)}`);
  }
  return lines.join("\n");
}

function readSaveMessage(
  copy: ReturnType<typeof getWorkshopToolCopy>["kegMaterials"],
  saveStatus: SaveStatus,
): string {
  if (saveStatus === "saved") return copy.saveSuccess;
  if (saveStatus === "failed") return copy.saveFailed;
  return copy.saveEmpty;
}
