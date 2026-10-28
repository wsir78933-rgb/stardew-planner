"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "./browser-tool-storage";
import { copyToolText } from "./copy-tool-text";
import {
  createDefaultCropProfitForm,
  cropProfitStorageKey,
  loadCropProfitForm,
  parseFarmYear,
  parseFertilizerCostPerTile,
  parseMachineCount,
  parseProcessingDeadline,
  parseSeedShop,
  parseFarmingProfession,
  parseTileCount,
  serializeCropProfitForm,
  type CropProfitForm,
} from "./crop-profit-form";
import { createProfitGrowthForm } from "./planting-tool-handoff";
import { createCropGrowthHref } from "./planting-tool-href";
import type { CropGrowthForm } from "./crop-growth-form";
import { PlantingToolFrame, type PlantingToolId } from "./planting-tool-frame";
import { PlantingSelect } from "./planting-select";
import {
  formatHarvestDate,
  parsePlantingDay,
  parseSpeedGroOption,
  type CropSeason,
} from "./planting-field-values";
import { createProfitTopFiveCopy } from "./planting-tool-copy";
import {
  loadPurchasableFieldCrops,
  readCropDisplayName,
  requirePurchasableFieldCrop,
} from "./purchasable-field-crops";
import {
  appendHarvestToProductionPlan,
  parseProductionPlanStorage,
  productionPlanStorageKey,
  replaceProductionPlan,
  serializeProductionPlan,
  type ProductionPlanIncoming,
  type ProductionPlanRecord,
} from "./production-plan-record";
import {
  formatGoldAmount,
  formatGoldPerTilePerDay,
  rankCropProfitForm,
  readSelectedSeasonCropRow,
  type SeasonCropProfitRow,
  type SeasonCropRanking,
} from "./season-crop-ranking";
import styles from "./tools-page.module.css";

type CropProfitToolProperties = Readonly<{
  locale: PublicLocale;
  documentHeading?: boolean;
  onSelectTool?: (tool: PlantingToolId, cropId?: string) => void;
  onViewGrowth?: (form: CropGrowthForm) => void;
}>;

type FieldDraft = Readonly<Partial<Record<ProfitNumberField, string>>>;

type ProfitNumberField =
  | "plantingDay"
  | "farmYear"
  | "tileCount"
  | "fertilizerCostPerTile"
  | "kegCount"
  | "jarCount"
  | "dehydratorCount";

type SaveStatus = "empty" | "saved" | "failed";

export function seasonProfitRankingHasRows(rowCount: number): boolean {
  if (!Number.isInteger(rowCount) || rowCount < 0) {
    throw new Error(
      `Season profit ranking row count must be a finite integer greater than or equal to 0. Received: ${String(rowCount)}.`,
    );
  }

  return rowCount > 0;
}

function createProfitGrowthCalendarHref(locale: PublicLocale, cropId: string): string {
  return createCropGrowthHref(locale, cropId);
}

export function CropProfitTool({
  locale,
  documentHeading = true,
  onSelectTool,
  onViewGrowth,
}: CropProfitToolProperties) {
  const copy = getToolsPageCopy(locale);
  const crops = useMemo(() => loadPurchasableFieldCrops(), []);
  const [form, setForm] = useState<CropProfitForm>(createDefaultCropProfitForm);
  const [fieldDrafts, setFieldDrafts] = useState<FieldDraft>({});
  const [fieldErrors, setFieldErrors] = useState<FieldDraft>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("empty");
  const [storageReady, setStorageReady] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [storedPlan, setStoredPlan] = useState<ProductionPlanRecord | null>(null);
  const [planReadFailure, setPlanReadFailure] = useState<string | null>(null);
  const [planMessage, setPlanMessage] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<Readonly<{ message: string; text: string }> | null>(null);

  useEffect(() => {
    try {
      const storageText = readBrowserToolStorage(cropProfitStorageKey);
      setForm(loadCropProfitForm(storageText));
      setSaveStatus(storageText === null ? "empty" : "saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }

      setForm(createDefaultCropProfitForm());
      setSaveStatus("failed");
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    try {
      writeBrowserToolStorage(cropProfitStorageKey, serializeCropProfitForm(form));
      setSaveStatus("saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }

      setSaveStatus("failed");
    }
  }, [form, storageReady]);

  useEffect(() => {
    if (!planOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPlanOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [planOpen]);

  const hasInvalidDraft = Object.keys(fieldErrors).length > 0;
  const rankingResult = hasInvalidDraft
    ? { ranking: null, errorMessage: copy.profit.invalidDraft }
    : readProfitRanking(form);
  const ranking = rankingResult.ranking;
  const activeCropId = resolveSelectedCropId(ranking, selectedCropId);
  const activeRow = ranking?.rows.find((row) => row.cropId === activeCropId) ?? null;
  const firstRow = ranking?.rows[0] ?? null;
  const showRankingChrome = ranking === null
    ? !hasInvalidDraft
    : seasonProfitRankingHasRows(ranking.rows.length);

  function commitNumber(fieldName: ProfitNumberField, rawValue: string, parse: (value: string) => number) {
    try {
      const parsedValue = parse(rawValue);
      setFieldDrafts((current) => clearField(current, fieldName));
      setFieldErrors((current) => clearField(current, fieldName));
      setForm((current) => ({ ...current, [fieldName]: parsedValue }));
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      setFieldDrafts((current) => ({ ...current, [fieldName]: rawValue }));
      setFieldErrors((current) => ({ ...current, [fieldName]: error.message }));
    }
  }

  function openPlanDialog() {
    setPlanMessage(null);
    try {
      const storageText = readBrowserToolStorage(productionPlanStorageKey);
      setStoredPlan(storageText === null ? null : parseProductionPlanStorage(storageText));
      setPlanReadFailure(null);
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setSaveStatus("failed");
        setStoredPlan(null);
        setPlanReadFailure(error instanceof Error ? error.message : copy.frame.saveFailed);
        setPlanOpen(true);
        return;
      }

      if (error instanceof Error && error.message.includes("Received:")) {
        setStoredPlan(null);
        setPlanReadFailure(error.message);
        setPlanOpen(true);
        return;
      }

      throw error;
    }

    setPlanOpen(true);
  }

  function writePlan(nextPlan: ProductionPlanRecord) {
    try {
      writeBrowserToolStorage(productionPlanStorageKey, serializeProductionPlan(nextPlan));
      setStoredPlan(nextPlan);
      setPlanReadFailure(null);
      setPlanMessage(copy.planConfirm.applied);
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }

      setSaveStatus("failed");
      setPlanMessage(error instanceof Error ? error.message : copy.frame.saveFailed);
    }
  }

  function applyPlan(mode: "append" | "replace") {
    if (planReadFailure !== null) {
      setPlanMessage(planReadFailure);
      return;
    }

    if (ranking === null || activeCropId === null) {
      setPlanMessage(rankingResult.errorMessage ?? copy.profit.emptyRanking);
      return;
    }

    let incoming: ProductionPlanIncoming;
    try {
      incoming = createProductionPlanIncoming(
        form,
        readSelectedSeasonCropRow(ranking, activeCropId),
      );
    } catch (error) {
      if (error instanceof Error) {
        setPlanMessage(error.message);
        return;
      }

      throw error;
    }

    const nextPlan =
      mode === "append"
        ? appendHarvestToProductionPlan(storedPlan, incoming)
        : replaceProductionPlan(storedPlan, incoming);
    writePlan(nextPlan);
  }

  async function copyTopFive() {
    if (ranking === null) {
      return;
    }

    let text: string;
    try {
      text = createProfitTopFiveCopy(ranking, form, crops, locale);
    } catch (error) {
      if (error instanceof Error) {
        setCopyState({ message: error.message, text: "" });
        return;
      }

      throw error;
    }

    try {
      await copyToolText(text);
      setCopyState({ message: copy.profit.copied, text: "" });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      setCopyState({ message: `${copy.profit.copyFailed} ${error.message}`, text });
    }
  }

  function viewGrowthCalendar() {
    if (activeCropId === null || hasInvalidDraft) {
      return;
    }

    if (onViewGrowth !== undefined) {
      onViewGrowth(createProfitGrowthForm(form, activeCropId));
      return;
    }

    onSelectTool?.("crop-growth", activeCropId);
  }

  return (
    <PlantingToolFrame
      currentTool="crop-profit"
      documentHeading={documentHeading}
      locale={locale}
      onSelectTool={onSelectTool === undefined ? undefined : (tool) => onSelectTool(tool)}
      saveStatus={saveStatus}
      title={copy.profit.title}
    >
      <div
        aria-label={copy.profit.settingsHeading}
        className={styles.panel}
        data-crop-profit-form="true"
        role="group"
      >
        <h2>{copy.profit.settingsHeading}</h2>
        <div className={styles.seasonRow}>
          {(["spring", "summer", "fall", "winter"] as const).map((season) => (
            <button
              className={form.season === season ? "public-primary-cta" : "public-secondary-cta"}
              key={season}
              onClick={() => setForm((current) => ({ ...current, season }))}
              type="button"
            >
              {copy.profit.seasons[season]}
            </button>
          ))}
        </div>
        <div className={styles.fieldGrid}>
          <NumberField
            errorMessage={fieldErrors.plantingDay ?? null}
            inputId="crop-profit-planting-day"
            label={copy.profit.plantingDay}
            onRawValue={(rawValue) => commitNumber("plantingDay", rawValue, parsePlantingDay)}
            value={fieldDrafts.plantingDay ?? String(form.plantingDay)}
          />
          <NumberField
            errorMessage={fieldErrors.farmYear ?? null}
            inputId="crop-profit-farm-year"
            label={copy.profit.farmYear}
            onRawValue={(rawValue) => commitNumber("farmYear", rawValue, parseFarmYear)}
            value={fieldDrafts.farmYear ?? String(form.farmYear)}
          />
          <NumberField
            errorMessage={fieldErrors.tileCount ?? null}
            inputId="crop-profit-tile-count"
            label={copy.profit.tileCount}
            onRawValue={(rawValue) => commitNumber("tileCount", rawValue, parseTileCount)}
            value={fieldDrafts.tileCount ?? String(form.tileCount)}
          />
          <SelectField
            inputId="crop-profit-seed-source"
            label={copy.profit.seedSource}
            onValue={(rawValue) =>
              setForm((current) => ({ ...current, seedShop: parseSeedShop(rawValue) }))
            }
            options={copy.profit.seedShops}
            value={form.seedShop}
          />
          <SelectField
            inputId="crop-profit-profession"
            label={copy.profit.profession}
            onValue={(rawValue) =>
              setForm((current) => ({ ...current, profession: parseFarmingProfession(rawValue) }))
            }
            options={copy.profit.professions}
            value={form.profession}
          />
          <SelectField
            inputId="crop-profit-speed-gro"
            label={copy.profit.speedGro}
            onValue={(rawValue) =>
              setForm((current) => ({ ...current, speedGro: parseSpeedGroOption(rawValue) }))
            }
            options={copy.profit.speedGros}
            value={form.speedGro}
          />
          <NumberField
            errorMessage={fieldErrors.fertilizerCostPerTile ?? null}
            inputId="crop-profit-fertilizer-cost"
            label={copy.profit.fertilizerCost}
            onRawValue={(rawValue) =>
              commitNumber("fertilizerCostPerTile", rawValue, parseFertilizerCostPerTile)
            }
            value={fieldDrafts.fertilizerCostPerTile ?? String(form.fertilizerCostPerTile)}
          />
        </div>
        <h2>{copy.profit.processingHeading}</h2>
        <div className={styles.machineGrid}>
          <NumberField
            errorMessage={fieldErrors.kegCount ?? null}
            inputId="crop-profit-keg-count"
            label={copy.profit.kegCount}
            onRawValue={(rawValue) =>
              commitNumber("kegCount", rawValue, (value) => parseMachineCount(value, "Keg"))
            }
            value={fieldDrafts.kegCount ?? String(form.kegCount)}
          />
          <NumberField
            errorMessage={fieldErrors.jarCount ?? null}
            inputId="crop-profit-jar-count"
            label={copy.profit.jarCount}
            onRawValue={(rawValue) =>
              commitNumber("jarCount", rawValue, (value) => parseMachineCount(value, "Preserves jar"))
            }
            value={fieldDrafts.jarCount ?? String(form.jarCount)}
          />
          <NumberField
            errorMessage={fieldErrors.dehydratorCount ?? null}
            inputId="crop-profit-dehydrator-count"
            label={copy.profit.dehydratorCount}
            onRawValue={(rawValue) =>
              commitNumber("dehydratorCount", rawValue, (value) => parseMachineCount(value, "Dehydrator"))
            }
            value={fieldDrafts.dehydratorCount ?? String(form.dehydratorCount)}
          />
          <SelectField
            inputId="crop-profit-deadline"
            label={copy.profit.deadline}
            onValue={(rawValue) =>
              setForm((current) => ({
                ...current,
                processingDeadline: parseProcessingDeadline(rawValue),
              }))
            }
            options={copy.profit.deadlines}
            value={form.processingDeadline}
          />
        </div>
        <p className="public-note">{copy.profit.qualityNote}</p>
      </div>
      <section className={styles.panel}>
        {rankingResult.errorMessage !== null ? (
          <p className={styles.alert} role="alert">
            {rankingResult.errorMessage}
          </p>
        ) : null}
        {hasInvalidDraft ? null : firstRow === null ? (
          <p>{copy.profit.emptyRanking}</p>
        ) : (
          <div className={styles.summaryGrid}>
            <article>
              <h2>{copy.profit.firstPlace}</h2>
              <p>{readCropDisplayName(requirePurchasableFieldCrop(crops, firstRow.cropId), locale)}</p>
            </article>
            <article>
              <h2>{copy.profit.netGold}</h2>
              <p>{formatGoldAmount(firstRow.netGold)}</p>
            </article>
            <article>
              <h2>{copy.profit.goldPerTilePerDay}</h2>
              <p>{formatGoldPerTilePerDay(firstRow.goldPerTilePerDay)}</p>
            </article>
          </div>
        )}
        {showRankingChrome ? (
          <>
            <p className="public-note">{copy.profit.singleRouteNote}</p>
            <p className="public-note">{copy.profit.separateMachinesNote}</p>
            <h2>{copy.profit.rankingHeading}</h2>
            <table className={styles.rankingTable}>
              <thead>
                <tr>
                  <th>{copy.profit.columns.crop}</th>
                  <th>{copy.profit.columns.harvests}</th>
                  <th>{copy.profit.columns.expectedUnits}</th>
                  <th>{copy.profit.columns.route}</th>
                  <th>{copy.profit.columns.netGold}</th>
                </tr>
              </thead>
              <tbody>
                {ranking?.rows.map((row) => (
                  <RankingTableRow
                    crops={crops}
                    key={row.cropId}
                    locale={locale}
                    onSelect={setSelectedCropId}
                    row={row}
                    selected={row.cropId === activeCropId}
                  />
                ))}
              </tbody>
            </table>
            <ol className={styles.rankingList}>
              {ranking?.rows.map((row, index) => (
                <li key={row.cropId}>
                  <button
                    aria-pressed={row.cropId === activeCropId}
                    onClick={() => setSelectedCropId(row.cropId)}
                    type="button"
                  >
                    <strong>
                      {index + 1}. {readCropDisplayName(requirePurchasableFieldCrop(crops, row.cropId), locale)}
                    </strong>
                    <span>{formatGoldAmount(row.netGold)}</span>
                    <span>
                      {row.harvestCount} / {copy.profit.routes[row.routeId]} / {formatGoldPerTilePerDay(row.goldPerTilePerDay)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <SelectedHarvestDetail
              crops={crops}
              form={form}
              locale={locale}
              ranking={ranking}
              selectedCropId={activeCropId}
            />
            <p className="public-note">{copy.profit.expectationNote}</p>
            <p className="public-note">{copy.profit.dailyAverageNote}</p>
            <p className="public-note">{copy.profit.currentSeasonCutoffNote}</p>
            <div className={styles.actionRow}>
              {activeCropId === null || hasInvalidDraft ? (
                <button className={`public-secondary-cta ${styles.action}`} disabled type="button">
                  {copy.profit.viewGrowth}
                </button>
              ) : onViewGrowth !== undefined || onSelectTool !== undefined ? (
                <button
                  className="public-secondary-cta"
                  onClick={viewGrowthCalendar}
                  type="button"
                >
                  {copy.profit.viewGrowth}
                </button>
              ) : (
                <a className="public-secondary-cta" href={createProfitGrowthCalendarHref(locale, activeCropId)}>
                  {copy.profit.viewGrowth}
                </a>
              )}
              <button className="public-primary-cta" disabled={ranking === null} onClick={openPlanDialog} type="button">
                {copy.profit.transferHarvest}
              </button>
              <button className="public-secondary-cta" disabled={ranking === null} onClick={() => void copyTopFive()} type="button">
                {copy.profit.copyTopFive}
              </button>
            </div>
          </>
        ) : null}
        {copyState === null ? null : (
          <div>
            <p role="status">{copyState.message}</p>
            {copyState.text === "" ? null : (
              <textarea className={styles.manualCopy} readOnly value={copyState.text} />
            )}
          </div>
        )}
        {planOpen ? (
          <PlanConfirmDialog
            crops={crops}
            incomingRow={activeRow}
            locale={locale}
            onAppend={() => applyPlan("append")}
            onClose={() => setPlanOpen(false)}
            onReplace={() => applyPlan("replace")}
            onUndo={() => {
              if (storedPlan?.previousPlan === null || storedPlan?.previousPlan === undefined) {
                return;
              }

              writePlan(storedPlan.previousPlan);
            }}
            planMessage={planMessage}
            planReadFailure={planReadFailure}
            storedPlan={storedPlan}
            tileCount={form.tileCount}
          />
        ) : null}
      </section>
    </PlantingToolFrame>
  );
}

function readProfitRanking(form: CropProfitForm): Readonly<{
  ranking: SeasonCropRanking | null;
  errorMessage: string | null;
}> {
  try {
    return { ranking: rankCropProfitForm(form), errorMessage: null };
  } catch (error) {
    if (error instanceof Error) {
      return { ranking: null, errorMessage: error.message };
    }

    throw error;
  }
}

function resolveSelectedCropId(
  ranking: SeasonCropRanking | null,
  selectedCropId: string | null,
): string | null {
  if (ranking === null || ranking.rows.length === 0) {
    return null;
  }

  if (selectedCropId !== null && ranking.rows.some((row) => row.cropId === selectedCropId)) {
    return selectedCropId;
  }

  return ranking.rows[0]?.cropId ?? null;
}

function clearField(current: FieldDraft, fieldName: ProfitNumberField): FieldDraft {
  const next = { ...current };
  delete next[fieldName];
  return next;
}

function createProductionPlanIncoming(
  form: CropProfitForm,
  row: SeasonCropProfitRow,
): ProductionPlanIncoming {
  return {
    form,
    line: {
      cropId: row.cropId,
      routeId: row.routeId,
      expectedUnits: row.expectedUnits,
      harvestCount: row.harvestCount,
      tileCount: form.tileCount,
      firstHarvest: row.firstHarvest,
      lastHarvest: row.lastHarvest,
      seedCost: row.seedCost,
      fertilizerCost: row.fertilizerCost,
    },
  };
}

function NumberField({
  inputId,
  label,
  value,
  errorMessage,
  onRawValue,
}: Readonly<{
  inputId: string;
  label: string;
  value: string;
  errorMessage: string | null;
  onRawValue: (rawValue: string) => void;
}>) {
  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        inputMode="decimal"
        onChange={(event) => onRawValue(event.target.value)}
        value={value}
      />
      {errorMessage === null ? null : (
        <p className={styles.fieldError} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function SelectField<Value extends string>({
  inputId,
  label,
  value,
  options,
  onValue,
}: Readonly<{
  inputId: string;
  label: string;
  value: Value;
  options: Readonly<Record<Value, string>>;
  onValue: (rawValue: string) => void;
}>) {
  return (
    <div className={styles.field}>
      <PlantingSelect
        inputId={inputId}
        label={label}
        onValueChange={onValue}
        options={(Object.entries(options) as [Value, string][]).map(([optionValue, optionLabel]) => ({
          value: optionValue,
          label: optionLabel,
        }))}
        value={value}
      />
    </div>
  );
}

function RankingTableRow({
  row,
  selected,
  locale,
  crops,
  onSelect,
}: Readonly<{
  row: SeasonCropProfitRow;
  selected: boolean;
  locale: PublicLocale;
  crops: ReturnType<typeof loadPurchasableFieldCrops>;
  onSelect: (cropId: string) => void;
}>) {
  const copy = getToolsPageCopy(locale);

  return (
    <tr className={selected ? styles.selectedRow : undefined}>
      <th scope="row">
        <button aria-pressed={selected} onClick={() => onSelect(row.cropId)} type="button">
          {readCropDisplayName(requirePurchasableFieldCrop(crops, row.cropId), locale)}
        </button>
      </th>
      <td>{formatGoldAmount(row.harvestCount)}</td>
      <td>{formatGoldAmount(row.expectedUnits)}</td>
      <td>{copy.profit.routes[row.routeId]}</td>
      <td>{formatGoldAmount(row.netGold)}</td>
    </tr>
  );
}

function SelectedHarvestDetail({
  ranking,
  selectedCropId,
  locale,
  crops,
  form,
}: Readonly<{
  ranking: SeasonCropRanking | null;
  selectedCropId: string | null;
  locale: PublicLocale;
  crops: ReturnType<typeof loadPurchasableFieldCrops>;
  form: CropProfitForm;
}>) {
  const copy = getToolsPageCopy(locale);
  if (ranking === null || selectedCropId === null) {
    return null;
  }

  let detail: SeasonCropProfitRow;
  try {
    detail = readSelectedSeasonCropRow(ranking, selectedCropId);
  } catch (error) {
    if (error instanceof Error) {
      return (
        <p className={styles.alert} role="alert">
          {error.message}
        </p>
      );
    }

    throw error;
  }

  const cropName = readCropDisplayName(requirePurchasableFieldCrop(crops, detail.cropId), locale);

  return (
    <div>
      <h2>{copy.profit.selectedHeading}</h2>
      <p>{cropName}</p>
      <dl className={styles.resultDetails}>
        <div>
          <dt>{copy.profit.firstHarvest}</dt>
          <dd>{formatProfitHarvestDate(detail.firstHarvest, copy.profit.seasons, copy.profit.noHarvestDate)}</dd>
        </div>
        <div>
          <dt>{copy.profit.lastHarvest}</dt>
          <dd>{formatProfitHarvestDate(detail.lastHarvest, copy.profit.seasons, copy.profit.noHarvestDate)}</dd>
        </div>
        <div>
          <dt>{copy.profit.seedCost}</dt>
          <dd>{formatGoldAmount(detail.seedCost)}</dd>
        </div>
        <div>
          <dt>{copy.profit.fertilizerSpent}</dt>
          <dd>{formatGoldAmount(detail.fertilizerCost)}</dd>
        </div>
        <div>
          <dt>{copy.profit.netGold}</dt>
          <dd>{formatGoldAmount(detail.netGold)}</dd>
        </div>
        <div>
          <dt>{copy.profit.columns.route}</dt>
          <dd>{copy.profit.routes[detail.routeId]}</dd>
        </div>
        <div>
          <dt>{copy.profit.processedUnits}</dt>
          <dd>{formatGoldAmount(detail.processedUnits)}</dd>
        </div>
        <div>
          <dt>{detail.routeId === "sell-raw" ? copy.profit.rawSold : copy.profit.backlogUnits}</dt>
          <dd>{formatGoldAmount(detail.backlogUnits)}</dd>
        </div>
        <div>
          <dt>{copy.profit.columns.expectedUnits}</dt>
          <dd>{formatGoldAmount(detail.expectedUnits)}</dd>
        </div>
        <div>
          <dt>{copy.profit.tileCount}</dt>
          <dd>{formatGoldAmount(form.tileCount)}</dd>
        </div>
      </dl>
    </div>
  );
}

function formatProfitHarvestDate(
  date: SeasonCropProfitRow["firstHarvest"],
  seasons: Readonly<Record<CropSeason, string>>,
  noHarvestDate: string,
): string {
  return date === null ? noHarvestDate : formatHarvestDate(date, seasons);
}

function PlanConfirmDialog({
  storedPlan,
  incomingRow,
  crops,
  locale,
  tileCount,
  planMessage,
  planReadFailure,
  onAppend,
  onReplace,
  onClose,
  onUndo,
}: Readonly<{
  storedPlan: ProductionPlanRecord | null;
  incomingRow: SeasonCropProfitRow | null;
  crops: ReturnType<typeof loadPurchasableFieldCrops>;
  locale: PublicLocale;
  tileCount: number;
  planMessage: string | null;
  planReadFailure: string | null;
  onAppend: () => void;
  onReplace: () => void;
  onClose: () => void;
  onUndo: () => void;
}>) {
  const copy = getToolsPageCopy(locale);
  const incomingName =
    incomingRow === null
      ? copy.profit.emptyRanking
      : readCropDisplayName(requirePurchasableFieldCrop(crops, incomingRow.cropId), locale);
  const blocked = planReadFailure !== null;

  return (
    <section aria-labelledby="production-plan-confirm-title" className={styles.dialog} role="dialog">
      <h2 id="production-plan-confirm-title">{copy.planConfirm.title}</h2>
      <p>{copy.planConfirm.lead}</p>
      <p>
        {copy.planConfirm.currentPlan}:{" "}
        {storedPlan === null
          ? copy.planConfirm.noCurrentPlan
          : `${storedPlan.lines.length} ${copy.planConfirm.lineCount} / ${copy.profit.kegCount} ${storedPlan.kegCount} / ${copy.profit.jarCount} ${storedPlan.jarCount} / ${copy.profit.dehydratorCount} ${storedPlan.dehydratorCount}`}
      </p>
      <p>
        {copy.planConfirm.incoming}: {incomingName} / {tileCount}
      </p>
      <p>{copy.planConfirm.appendDetail}</p>
      <p>{copy.planConfirm.replaceDetail}</p>
      {planReadFailure === null ? null : (
        <p className={styles.alert} role="alert">
          {planReadFailure}
        </p>
      )}
      {planMessage === null ? null : <p role="status">{planMessage}</p>}
      {storedPlan === null ? null : (
        <a className="public-secondary-cta" href={`${locale === "zh-CN" ? "/zh" : ""}/tools/today-processing-list#crop-profit-review`}>
          {locale === "zh-CN" ? "核对收获并安排生产" : "Review harvests and schedule production"}
        </a>
      )}
      <div className={styles.actionRow}>
        <button className="public-primary-cta" disabled={blocked} onClick={onAppend} type="button">
          {copy.planConfirm.append}
        </button>
        <button className="public-secondary-cta" disabled={blocked} onClick={onReplace} type="button">
          {copy.planConfirm.replace}
        </button>
        <button className="public-secondary-cta" onClick={onClose} type="button">
          {copy.planConfirm.keep}
        </button>
        {storedPlan?.previousPlan === null || storedPlan?.previousPlan === undefined ? null : (
          <button className="public-secondary-cta" onClick={onUndo} type="button">
            {copy.planConfirm.undo}
          </button>
        )}
      </div>
    </section>
  );
}
