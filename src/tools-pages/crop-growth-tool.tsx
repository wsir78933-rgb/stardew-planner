"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import { getCropCatalogEntry } from "../crop-tools/catalog/crop-catalog";
import {
  isBrowserStorageFailure,
  readBrowserToolStorage,
  writeBrowserToolStorage,
} from "./browser-tool-storage";
import { copyToolText } from "./copy-tool-text";
import {
  listHarvestCalendarMonths,
  projectCropGrowthForm,
  type CropHarvestProjection,
} from "./crop-harvest-calendar";
import {
  createDefaultCropGrowthForm,
  cropGrowthStorageKey,
  loadCropGrowthForm,
  normalizeCropGrowthForm,
  parseAfterHarvestOption,
  parseGrowthLocation,
  serializeCropGrowthForm,
  type AfterHarvestOption,
  type CropGrowthForm,
} from "./crop-growth-form";
import { PlantingToolFrame, type PlantingToolId } from "./planting-tool-frame";
import { createCropProfitHref } from "./planting-tool-href";
import { CropSelect } from "./crop-select";
import { PlantingSelect } from "./planting-select";
import {
  parseMissedWateringDays,
  parsePlantingDay,
  parseSpeedGroOption,
} from "./planting-field-values";
import {
  createGrowthCalendarCopy,
  formatGrowthCalendarDate,
  formatGrowthMonthLabel,
  formatProjectedHarvestDate,
} from "./planting-tool-copy";
import {
  chooseDefaultGrowthCropId,
  loadPurchasableFieldCrops,
  readCropDisplayName,
  requirePurchasableFieldCrop,
} from "./purchasable-field-crops";
import styles from "./tools-page.module.css";

type CropGrowthToolProperties = Readonly<{
  locale: PublicLocale;
  requestedCropId: string | null;
  requestedGrowthForm?: CropGrowthForm | null;
  onSelectTool?: (tool: PlantingToolId) => void;
}>;

type SaveStatus = "empty" | "saved" | "failed";

export function CropGrowthTool({
  locale,
  requestedCropId,
  requestedGrowthForm = null,
  onSelectTool,
}: CropGrowthToolProperties) {
  const copy = getToolsPageCopy(locale);
  const crops = useMemo(() => loadPurchasableFieldCrops(), []);
  const defaultCropId = chooseDefaultGrowthCropId(crops);
  const [form, setForm] = useState<CropGrowthForm>(() => createDefaultCropGrowthForm(defaultCropId));
  const [plantingDayDraft, setPlantingDayDraft] = useState<string | null>(null);
  const [plantingDayError, setPlantingDayError] = useState<string | null>(null);
  const [missedWateringDraft, setMissedWateringDraft] = useState<string | null>(null);
  const [missedWateringError, setMissedWateringError] = useState<string | null>(null);
  const [cropIdError, setCropIdError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("empty");
  const [storageReady, setStorageReady] = useState(false);
  const [copyState, setCopyState] = useState<Readonly<{ message: string; text: string }> | null>(null);
  const calendarHeadingRef = useRef<HTMLHeadingElement>(null);
  const pendingCalendarFocus = useRef(false);

  useEffect(() => {
    let nextForm = createDefaultCropGrowthForm(defaultCropId);
    try {
      const storageText = readBrowserToolStorage(cropGrowthStorageKey);
      nextForm = loadCropGrowthForm(storageText, defaultCropId);
      setSaveStatus(storageText === null ? "empty" : "saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }

      setSaveStatus("failed");
    }

    if (!crops.some((crop) => crop.id === nextForm.cropId)) {
      setCropIdError(`Unknown crop id. Received: ${JSON.stringify(nextForm.cropId)}.`);
      nextForm = createDefaultCropGrowthForm(defaultCropId);
    }

    setForm(nextForm);
    setStorageReady(true);
  }, [crops, defaultCropId]);

  useEffect(() => {
    if (requestedGrowthForm === null) {
      return;
    }

    const transferredForm = normalizeCropGrowthForm(requestedGrowthForm);
    if (!crops.some((crop) => crop.id === transferredForm.cropId)) {
      setCropIdError(`Unknown crop id. Received: ${JSON.stringify(transferredForm.cropId)}.`);
      return;
    }

    setForm(transferredForm);
    setPlantingDayDraft(null);
    setPlantingDayError(null);
    setMissedWateringDraft(null);
    setMissedWateringError(null);
    setCropIdError(null);
    setCopyState(null);
    pendingCalendarFocus.current = true;
  }, [crops, requestedGrowthForm]);

  useEffect(() => {
    if (requestedCropId === null) {
      return;
    }

    if (!crops.some((crop) => crop.id === requestedCropId)) {
      setCropIdError(`Unknown crop id. Received: ${JSON.stringify(requestedCropId)}.`);
      return;
    }

    setForm((current) => normalizeCropGrowthForm({ ...current, cropId: requestedCropId }));
    setPlantingDayDraft(null);
    setPlantingDayError(null);
    setMissedWateringDraft(null);
    setMissedWateringError(null);
    setCropIdError(null);
    setCopyState(null);
  }, [crops, requestedCropId]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    try {
      writeBrowserToolStorage(cropGrowthStorageKey, serializeCropGrowthForm(form));
      setSaveStatus("saved");
    } catch (error) {
      if (!isBrowserStorageFailure(error)) {
        throw error;
      }

      setSaveStatus("failed");
    }
  }, [form, storageReady]);

  useEffect(() => {
    setCopyState(null);
  }, [form, missedWateringDraft, plantingDayDraft]);

  const hasInvalidDraft =
    plantingDayDraft !== null ||
    plantingDayError !== null ||
    missedWateringDraft !== null ||
    missedWateringError !== null ||
    cropIdError !== null;
  const projectionResult = hasInvalidDraft
    ? { projection: null, errorMessage: copy.growth.invalidDraft }
    : readGrowthProjection(form);
  const projection = projectionResult.projection;
  const months = projection === null ? [] : listHarvestCalendarMonths(form, projection);
  const cropRegrowsNaturally = getCropCatalogEntry(form.cropId).regrowDays !== null;
  const afterHarvestValues: readonly AfterHarvestOption[] = cropRegrowsNaturally
    ? ["regrow"]
    : ["replant-same-day", "no-replant"];
  const seasonOptions = [
    { value: "spring", label: copy.growth.seasons.spring },
    { value: "summer", label: copy.growth.seasons.summer },
    { value: "fall", label: copy.growth.seasons.fall },
    { value: "winter", label: copy.growth.seasons.winter },
  ];
  const speedGroOptions = (
    Object.entries(copy.growth.speedGros) as [CropGrowthForm["speedGro"], string][]
  ).map(([speedGro, label]) => ({ value: speedGro, label }));
  const professionOptions = [
    { value: "none", label: copy.growth.professions.none },
    { value: "agriculturist", label: copy.growth.professions.agriculturist },
  ];
  const locationOptions = (
    Object.entries(copy.growth.locations) as [CropGrowthForm["location"], string][]
  ).map(([location, label]) => ({ value: location, label }));
  const afterHarvestOptions = afterHarvestValues.map((afterHarvest) => ({
    value: afterHarvest,
    label: copy.growth.afterHarvestOptions[afterHarvest],
  }));

  useEffect(() => {
    if (!pendingCalendarFocus.current || calendarHeadingRef.current === null) {
      return;
    }

    calendarHeadingRef.current.focus();
    pendingCalendarFocus.current = false;
  }, [form]);

  async function copyCalendar() {
    if (projection === null) {
      setCopyState({
        message: projectionResult.errorMessage ?? copy.growth.seasonCheckLate,
        text: "",
      });
      return;
    }

    const text = createGrowthCalendarCopy(form, projection, crops, locale);

    try {
      await copyToolText(text);
      setCopyState({ message: copy.growth.copied, text: "" });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      setCopyState({ message: `${copy.growth.copyFailed} ${error.message}`, text });
    }
  }

  function handleCropSelection(cropId: string) {
    if (!crops.some((crop) => crop.id === cropId)) {
      setCropIdError(`Unknown crop id. Received: ${JSON.stringify(cropId)}.`);
      return;
    }

    setCropIdError(null);
    setForm((current) => normalizeCropGrowthForm({ ...current, cropId }));
  }

  return (
    <PlantingToolFrame
      currentTool="crop-growth"
      locale={locale}
      onSelectTool={onSelectTool}
      saveStatus={saveStatus}
      title={copy.growth.title}
    >
      <div
        aria-label={copy.growth.title}
        className={styles.panel}
        data-crop-growth-form="true"
        role="group"
      >
        <div className={styles.field}>
          <CropSelect
            crops={crops}
            errorMessage={cropIdError}
            label={copy.growth.crop}
            locale={locale}
            onCropChange={handleCropSelection}
            selectedCropId={form.cropId}
          />
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <PlantingSelect
              inputId="crop-growth-season"
              label={copy.growth.season}
              onValueChange={(season) => {
                if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") {
                  throw new Error(
                    `Season must be spring, summer, fall, or winter. Received: ${JSON.stringify(season)}.`,
                  );
                }

                setForm((current) => ({ ...current, season }));
              }}
              options={seasonOptions}
              value={form.season}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="crop-growth-planting-day">{copy.growth.plantingDay}</label>
            <input
              id="crop-growth-planting-day"
              inputMode="numeric"
              onChange={(event) => {
                const rawValue = event.target.value;
                try {
                  const plantingDay = parsePlantingDay(rawValue);
                  setPlantingDayDraft(null);
                  setPlantingDayError(null);
                  setForm((current) => ({ ...current, plantingDay }));
                } catch (error) {
                  if (!(error instanceof Error)) {
                    throw error;
                  }

                  setPlantingDayDraft(rawValue);
                  setPlantingDayError(error.message);
                }
              }}
              value={plantingDayDraft ?? String(form.plantingDay)}
            />
            {plantingDayError === null ? null : (
              <p className={styles.fieldError} role="alert">
                {plantingDayError}
              </p>
            )}
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="crop-growth-speed"
              label={copy.growth.speedGro}
              onValueChange={(speedGro) =>
                setForm((current) => ({
                  ...current,
                  speedGro: parseSpeedGroOption(speedGro),
                }))
              }
              options={speedGroOptions}
              value={form.speedGro}
            />
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="crop-growth-profession"
              label={copy.growth.profession}
              onValueChange={(profession) => {
                if (profession !== "agriculturist" && profession !== "none") {
                  throw new Error(
                    `Profession must be agriculturist or none. Received: ${JSON.stringify(profession)}.`,
                  );
                }

                setForm((current) => ({ ...current, agriculturist: profession === "agriculturist" }));
              }}
              options={professionOptions}
              value={form.agriculturist ? "agriculturist" : "none"}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="crop-growth-missed-watering">{copy.growth.missedWatering}</label>
            <input
              id="crop-growth-missed-watering"
              inputMode="numeric"
              onChange={(event) => {
                const rawValue = event.target.value;
                try {
                  const missedWateringDays = parseMissedWateringDays(rawValue);
                  setMissedWateringDraft(null);
                  setMissedWateringError(null);
                  setForm((current) => ({ ...current, missedWateringDays }));
                } catch (error) {
                  if (!(error instanceof Error)) {
                    throw error;
                  }

                  setMissedWateringDraft(rawValue);
                  setMissedWateringError(error.message);
                }
              }}
              value={missedWateringDraft ?? String(form.missedWateringDays)}
            />
            {missedWateringError === null ? null : (
              <p className={styles.fieldError} role="alert">
                {missedWateringError}
              </p>
            )}
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="crop-growth-location"
              label={copy.growth.location}
              onValueChange={(location) =>
                setForm((current) => ({
                  ...current,
                  location: parseGrowthLocation(location),
                }))
              }
              options={locationOptions}
              value={form.location}
            />
          </div>
          <div className={styles.field}>
            <PlantingSelect
              inputId="crop-growth-after-harvest"
              label={copy.growth.afterHarvest}
              onValueChange={(afterHarvest) =>
                setForm((current) => ({
                  ...current,
                  afterHarvest: parseAfterHarvestOption(afterHarvest),
                }))
              }
              options={afterHarvestOptions}
              value={form.afterHarvest}
            />
          </div>
        </div>
        <p className="public-note">{copy.growth.speedNote}</p>
      </div>
      <section className={styles.panel}>
        {projectionResult.errorMessage === null ? null : (
          <p className={styles.alert} role="alert">
            {projectionResult.errorMessage}
          </p>
        )}
        {projection === null ? null : (
          <>
            <p>
              {projection.seasonCheck === "harvestable"
                ? copy.growth.seasonCheckHarvestable
                : copy.growth.seasonCheckLate}
            </p>
            <div className={styles.summaryGrid}>
              <article>
                <h2>{copy.growth.firstMature}</h2>
                <p>{formatProjectedHarvestDate(projection.firstHarvest, months, copy.growth)}</p>
              </article>
              <article>
                <h2>{copy.growth.harvestCount}</h2>
                <p>{projection.harvestCount}</p>
              </article>
              <article>
                <h2>{copy.growth.lastSafePlanting}</h2>
                <p>{formatGrowthCalendarDate(projection.lastSafePlanting, copy.growth.seasons, copy.growth)}</p>
              </article>
            </div>
            <p className="public-note">
              {copy.growth.growthDays} {projection.growthDays}
              {" / "}
              {copy.growth.regrowInterval}{" "}
              {projection.regrowIntervalDays === null ? copy.growth.noneValue : projection.regrowIntervalDays}
              {" / "}
              {copy.growth.outdoorDeadlineDate}{" "}
              {formatGrowthCalendarDate(projection.outdoorDeadline, copy.growth.seasons, copy.growth)}
            </p>
            <h2>{copy.growth.harvestDatesHeading}</h2>
            {projection.harvests.length === 0 ? (
              <p>{copy.growth.noneValue}</p>
            ) : (
              <ol className={styles.harvestDateList}>
                {projection.harvests.map((harvest, index) => (
                  <li key={`${harvest.season}:${harvest.day}:${index}`}>
                    {formatProjectedHarvestDate(harvest, months, copy.growth)}
                    {harvest.replantedSameDay ? ` · ${copy.growth.marks.replant}` : ""}
                  </li>
                ))}
              </ol>
            )}
            <h2 id="crop-growth-calendar-heading" ref={calendarHeadingRef} tabIndex={-1}>
              {copy.growth.calendarHeading}
            </h2>
            {months.length === 0 ? (
              <p>{copy.growth.emptyHarvestCalendar}</p>
            ) : (
              <div className={styles.calendarMonths}>
                {months.map((month) => (
                  <section className={styles.calendarMonth} key={`${month.season}:${month.yearOffset}`}>
                    <h3>{formatGrowthMonthLabel(month, copy.growth.seasons, copy.growth)}</h3>
                    <ol className={styles.calendar}>
                      {month.marks.map((mark, index) => {
                        const day = index + 1;
                        const monthLabel = formatGrowthMonthLabel(month, copy.growth.seasons, copy.growth);
                        const dateLabel = `${monthLabel} ${day}`;
                        const accessibleDayLabel = mark === null
                          ? dateLabel
                          : copy.growth.calendarEventLabel
                              .replace("{date}", dateLabel)
                              .replace("{event}", copy.growth.calendarMarkNames[mark]);
                        return (
                          <li
                            aria-label={accessibleDayLabel}
                            className={mark === null ? undefined : styles.markedDay}
                            key={day}
                            title={mark === null ? undefined : accessibleDayLabel}
                          >
                            <div>{day}</div>
                            <div>{mark === null ? "\u00a0" : copy.growth.shortMarks[mark]}</div>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                ))}
              </div>
            )}
            <p className="public-note">{copy.growth.legend}</p>
            <p className="public-note">{copy.growth.fullScheduleNote}</p>
          </>
        )}
        <div className={styles.actionRow}>
          {onSelectTool === undefined ? (
            <a className="public-secondary-cta" href={createCropProfitHref(locale)}>
              {copy.growth.compareProfit}
            </a>
          ) : (
            <button className="public-secondary-cta" onClick={() => onSelectTool("crop-profit")} type="button">
              {copy.growth.compareProfit}
            </button>
          )}
          <button className="public-primary-cta" disabled={projection === null} onClick={() => void copyCalendar()} type="button">
            {copy.growth.copyCalendar}
          </button>
          <span className="public-note">{copy.growth.calculationNote}</span>
        </div>
        {copyState === null ? null : (
          <div>
            <p role="status">{copyState.message}</p>
            {copyState.text === "" ? null : (
              <textarea className={styles.manualCopy} readOnly value={copyState.text} />
            )}
          </div>
        )}
        <p className="public-note">
          {readCropDisplayName(requirePurchasableFieldCrop(crops, form.cropId), locale)}
        </p>
      </section>
    </PlantingToolFrame>
  );
}

function readGrowthProjection(form: CropGrowthForm): Readonly<{
  projection: CropHarvestProjection | null;
  errorMessage: string | null;
}> {
  try {
    return { projection: projectCropGrowthForm(form), errorMessage: null };
  } catch (error) {
    if (error instanceof Error) {
      return { projection: null, errorMessage: error.message };
    }

    throw error;
  }
}
