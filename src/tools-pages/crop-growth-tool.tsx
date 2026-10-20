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
  listHarvestCalendarMarks,
  projectCropGrowthForm,
  type CropHarvestProjection,
} from "./crop-harvest-calendar";
import {
  createDefaultCropGrowthForm,
  cropGrowthStorageKey,
  loadCropGrowthForm,
  parseAfterHarvestOption,
  parseGrowthLocation,
  serializeCropGrowthForm,
  type CropGrowthForm,
} from "./crop-growth-form";
import { PlantingToolFrame, type PlantingToolId } from "./planting-tool-frame";
import { createCropProfitHref } from "./planting-tool-href";
import {
  formatHarvestDate,
  parseMissedWateringDays,
  parsePlantingDay,
  parseSpeedGroOption,
} from "./planting-field-values";
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
  onSelectTool?: (tool: PlantingToolId) => void;
}>;

type SaveStatus = "empty" | "saved" | "failed";

export function CropGrowthTool({ locale, requestedCropId, onSelectTool }: CropGrowthToolProperties) {
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

    if (requestedCropId !== null) {
      if (crops.some((crop) => crop.id === requestedCropId)) {
        nextForm = { ...nextForm, cropId: requestedCropId };
        setCropIdError(null);
      } else {
        setCropIdError(`Unknown crop id. Received: ${JSON.stringify(requestedCropId)}.`);
      }
    }

    setForm(nextForm);
    setStorageReady(true);
  }, [crops, defaultCropId, requestedCropId]);

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

  const projectionResult = readGrowthProjection(form);
  const projection = projectionResult.projection;
  const marks =
    projection === null ? [] : listHarvestCalendarMarks(form.season, form.plantingDay, projection.harvests);

  async function copyCalendar() {
    if (projection === null) {
      setCopyState({
        message: projectionResult.errorMessage ?? copy.growth.seasonCheckLate,
        text: "",
      });
      return;
    }

    const text = marks
      .map((mark, index) => {
        const day = index + 1;
        return mark === null ? String(day) : `${day} ${copy.growth.marks[mark]}`;
      })
      .join("\n");

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

  return (
    <PlantingToolFrame
      currentTool="crop-growth"
      locale={locale}
      onSelectTool={onSelectTool}
      saveStatus={saveStatus}
      title={copy.growth.title}
    >
      <form className={styles.panel} data-crop-growth-form="true" onSubmit={(event) => event.preventDefault()}>
        <div className={styles.field}>
          <label htmlFor="crop-growth-crop">{copy.growth.crop}</label>
          <select
            id="crop-growth-crop"
            onChange={(event) => {
              const cropId = event.target.value;
              if (!crops.some((crop) => crop.id === cropId)) {
                setCropIdError(`Unknown crop id. Received: ${JSON.stringify(cropId)}.`);
                return;
              }

              setCropIdError(null);
              setForm((current) => ({ ...current, cropId }));
            }}
            value={form.cropId}
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {readCropDisplayName(crop, locale)}
              </option>
            ))}
          </select>
          {cropIdError === null ? null : (
            <p className={styles.fieldError} role="alert">
              {cropIdError}
            </p>
          )}
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="crop-growth-season">{copy.growth.season}</label>
            <select
              id="crop-growth-season"
              onChange={(event) => {
                const season = event.target.value;
                if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") {
                  throw new Error(
                    `Season must be spring, summer, fall, or winter. Received: ${JSON.stringify(season)}.`,
                  );
                }

                setForm((current) => ({ ...current, season }));
              }}
              value={form.season}
            >
              {(["spring", "summer", "fall", "winter"] as const).map((season) => (
                <option key={season} value={season}>
                  {copy.growth.seasons[season]}
                </option>
              ))}
            </select>
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
            <label htmlFor="crop-growth-speed">{copy.growth.speedGro}</label>
            <select
              id="crop-growth-speed"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  speedGro: parseSpeedGroOption(event.target.value),
                }))
              }
              value={form.speedGro}
            >
              {(Object.entries(copy.growth.speedGros) as [CropGrowthForm["speedGro"], string][]).map(
                ([speedGro, label]) => (
                  <option key={speedGro} value={speedGro}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="crop-growth-profession">{copy.growth.profession}</label>
            <select
              id="crop-growth-profession"
              onChange={(event) => {
                const profession = event.target.value;
                if (profession !== "agriculturist" && profession !== "none") {
                  throw new Error(
                    `Profession must be agriculturist or none. Received: ${JSON.stringify(profession)}.`,
                  );
                }

                setForm((current) => ({ ...current, agriculturist: profession === "agriculturist" }));
              }}
              value={form.agriculturist ? "agriculturist" : "none"}
            >
              <option value="none">{copy.growth.professions.none}</option>
              <option value="agriculturist">{copy.growth.professions.agriculturist}</option>
            </select>
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
            <label htmlFor="crop-growth-location">{copy.growth.location}</label>
            <select
              id="crop-growth-location"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: parseGrowthLocation(event.target.value),
                }))
              }
              value={form.location}
            >
              {(Object.entries(copy.growth.locations) as [CropGrowthForm["location"], string][]).map(
                ([location, label]) => (
                  <option key={location} value={location}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="crop-growth-after-harvest">{copy.growth.afterHarvest}</label>
            <select
              id="crop-growth-after-harvest"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  afterHarvest: parseAfterHarvestOption(event.target.value),
                }))
              }
              value={form.afterHarvest}
            >
              {(
                Object.entries(copy.growth.afterHarvestOptions) as [CropGrowthForm["afterHarvest"], string][]
              ).map(([afterHarvest, label]) => (
                <option key={afterHarvest} value={afterHarvest}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="public-note">{copy.growth.speedNote}</p>
      </form>
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
                <p>{formatHarvestDate(projection.firstHarvest, copy.growth.seasons)}</p>
              </article>
              <article>
                <h2>{copy.growth.harvestCount}</h2>
                <p>{projection.harvestCount}</p>
              </article>
              <article>
                <h2>{copy.growth.lastSafePlanting}</h2>
                <p>
                  {projection.lastSafePlantingDay === null
                    ? copy.growth.noneValue
                    : `${copy.growth.seasons[form.season]} ${projection.lastSafePlantingDay}`}
                </p>
              </article>
            </div>
            <p className="public-note">
              {copy.growth.growthDays} {projection.growthDays}
              {" / "}
              {copy.growth.regrowInterval}{" "}
              {projection.regrowIntervalDays === null ? copy.growth.noneValue : projection.regrowIntervalDays}
              {" / "}
              {copy.growth.outdoorDeadline}{" "}
              {projection.outdoorSeasonDeadlineDay === null
                ? copy.growth.noneValue
                : projection.outdoorSeasonDeadlineDay}
            </p>
            <h2>{copy.growth.calendarHeading}</h2>
            <ol className={styles.calendar}>
              {marks.map((mark, index) => {
                const day = index + 1;
                return (
                  <li className={mark === null ? undefined : styles.markedDay} key={day}>
                    <div>{day}</div>
                    <div>{mark === null ? "\u00a0" : copy.growth.marks[mark]}</div>
                  </li>
                );
              })}
            </ol>
            <p className="public-note">{copy.growth.legend}</p>
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
          <button className="public-primary-cta" onClick={() => void copyCalendar()} type="button">
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
