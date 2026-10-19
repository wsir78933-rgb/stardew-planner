"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { getRussianPlannerMapDisplayName } from "../i18n/planner-russian-display-names";
import { plannerMaps } from "../maps/map-catalog";
import {
  createFarmSummaryCsvFile,
  type FarmSummary,
  type FarmSummaryMapContext,
} from "../projects/farm-summary";
import type { FarmSummaryDetailCopy } from "../i18n/save-modal-copy";

export type FarmSummaryLocale = "en" | "zh" | "ru";

type FarmSummaryModalProperties = Readonly<{
  copy: FarmSummaryDetailCopy;
  farmSummary: FarmSummary;
  locale?: FarmSummaryLocale;
  onClose: () => void;
}>;

export function FarmSummaryModal({
  copy,
  farmSummary,
  locale,
  onClose,
}: FarmSummaryModalProperties) {
  const summaryLocale = readFarmSummaryLocale(locale);
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);
  const farmSummaryHeadingId = useId();

  function handleExportCsv(): void {
    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      const farmSummaryCsvFile = createFarmSummaryCsvFile(
        farmSummary.rows,
        dateStamp,
        summaryLocale,
      );

      downloadFarmSummaryCsvFile(farmSummaryCsvFile);
      setExportErrorMessage(null);
    } catch (caughtError) {
      setExportErrorMessage(formatFarmSummaryExportError(caughtError, copy));
    }
  }

  function handleModalKeyDown(keyboardEvent: KeyboardEvent<HTMLElement>): void {
    if (keyboardEvent.key === "Escape") {
      keyboardEvent.preventDefault();
      onClose();
    }
  }

  return (
    <div className="farm-summary-modal__backdrop" onMouseDown={onClose}>
      <section
        aria-labelledby={farmSummaryHeadingId}
        aria-modal="true"
        className="farm-summary-modal"
        onKeyDown={handleModalKeyDown}
        onMouseDown={stopModalBackdropClose}
        role="dialog"
        tabIndex={-1}
      >
        <header className="farm-summary-modal__header">
          <div>
            <h2 id={farmSummaryHeadingId}>{copy.title}</h2>
            <p>
              {copy.map}: {readVisibleFarmSummaryMapName(farmSummary.mapContext, summaryLocale)} ({farmSummary.mapContext.baseMapId}) · {copy.seasonLabel}: {copy.season(farmSummary.mapContext.season)}
            </p>
            <p>{copy.itemsPlaced(farmSummary.totalItems)}</p>
          </div>
          <button aria-label={copy.closeLabel} onClick={onClose} type="button">
            ×
          </button>
        </header>
        {exportErrorMessage !== null ? (
          <p className="farm-summary-modal__error" role="alert">
            {exportErrorMessage}
          </p>
        ) : null}
        {farmSummary.rows.length === 0 ? (
          <p className="farm-summary-modal__empty">{copy.empty}</p>
        ) : (
          <FarmSummaryGroups farmSummary={farmSummary} />
        )}
        {farmSummary.rows.length > 0 ? (
          <footer className="farm-summary-modal__footer">
            <button onClick={handleExportCsv} type="button">
              {copy.exportCsv}
            </button>
          </footer>
        ) : null}
      </section>
    </div>
  );
}

function readPlannerMapCatalogId(mapId: string): (typeof plannerMaps)[number]["id"] {
  const catalogPlannerMap = plannerMaps.find(
    (candidatePlannerMap) => candidatePlannerMap.id === mapId,
  );
  if (catalogPlannerMap === undefined) {
    throw new Error(`Unknown planner map id: ${JSON.stringify(mapId)}.`);
  }
  return catalogPlannerMap.id;
}

export function readVisibleFarmSummaryMapName(
  mapContext: FarmSummaryMapContext,
  locale: FarmSummaryLocale,
): string {
  if (locale === "en" || locale === "zh") {
    return mapContext.displayName;
  }
  if (locale === "ru") {
    return getRussianPlannerMapDisplayName(readPlannerMapCatalogId(mapContext.baseMapId));
  }
  throw new TypeError(
    `Farm summary locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readFarmSummaryLocale(locale: FarmSummaryLocale | undefined): FarmSummaryLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Farm summary locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function FarmSummaryGroups({ farmSummary }: Readonly<{ farmSummary: FarmSummary }>) {
  const categories = [...new Set(farmSummary.rows.map((farmSummaryRow) => farmSummaryRow.category))];

  return (
    <div className="farm-summary-modal__groups">
      {categories.map((category) => {
        const categoryRows = farmSummary.rows.filter(
          (farmSummaryRow) => farmSummaryRow.category === category,
        );
        const categoryItemCount = categoryRows.reduce(
          (totalCount, farmSummaryRow) => totalCount + farmSummaryRow.count,
          0,
        );

        return (
          <section className="farm-summary-modal__group" key={category}>
            <h3>
              {category} ({String(categoryItemCount)})
            </h3>
            <ul>
              {categoryRows.map((farmSummaryRow) => (
                <li key={`${farmSummaryRow.category}:${farmSummaryRow.name}`}>
                  <span>{farmSummaryRow.name}</span>
                  <strong>{String(farmSummaryRow.count)}</strong>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function stopModalBackdropClose(mouseEvent: { stopPropagation: () => void }): void {
  mouseEvent.stopPropagation();
}

function downloadFarmSummaryCsvFile(
  farmSummaryCsvFile: ReturnType<typeof createFarmSummaryCsvFile>,
): void {
  if (typeof document === "undefined") {
    throw new Error(
      `Cannot download farm summary ${JSON.stringify(farmSummaryCsvFile.filename)} without a browser document.`,
    );
  }

  if (typeof URL.createObjectURL !== "function") {
    throw new Error(
      `Cannot download farm summary ${JSON.stringify(farmSummaryCsvFile.filename)} because URL.createObjectURL is unavailable.`,
    );
  }

  const farmSummaryCsvBlob = new Blob([farmSummaryCsvFile.contents], {
    type: farmSummaryCsvFile.mimeType,
  });
  const farmSummaryCsvUrl = URL.createObjectURL(farmSummaryCsvBlob);
  const farmSummaryCsvLink = document.createElement("a");

  farmSummaryCsvLink.download = farmSummaryCsvFile.filename;
  farmSummaryCsvLink.href = farmSummaryCsvUrl;
  farmSummaryCsvLink.style.display = "none";
  document.body.append(farmSummaryCsvLink);
  farmSummaryCsvLink.click();
  farmSummaryCsvLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(farmSummaryCsvUrl), 0);
}

export function formatFarmSummaryExportError(
  caughtError: unknown,
  copy: FarmSummaryDetailCopy,
): string {
  if (caughtError instanceof Error) {
    return copy.exportFailure(caughtError.message);
  }

  return copy.exportFailure(String(caughtError));
}
