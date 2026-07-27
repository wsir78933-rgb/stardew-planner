"use client";

import { useId, useState, type KeyboardEvent } from "react";
import {
  createFarmSummaryCsvFile,
  type FarmSummary,
} from "../projects/farm-summary";
import {
  getCatalogDisplayName,
  getPlannerMapDisplayName,
} from "../i18n/catalog-display";
import type { SiteLocale } from "../i18n/locales";
import { formatTranslation, translate } from "../i18n/messages";

type FarmSummaryModalProperties = Readonly<{
  farmSummary: FarmSummary;
  locale?: SiteLocale;
  onClose: () => void;
}>;

export function FarmSummaryModal({
  farmSummary,
  locale = "en",
  onClose,
}: FarmSummaryModalProperties) {
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);
  const farmSummaryHeadingId = useId();

  function handleExportCsv(): void {
    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      const farmSummaryCsvFile = createFarmSummaryCsvFile(
        farmSummary.rows,
        dateStamp,
      );

      downloadFarmSummaryCsvFile(farmSummaryCsvFile);
      setExportErrorMessage(null);
    } catch (caughtError) {
      setExportErrorMessage(formatFarmSummaryExportError(caughtError, locale));
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
            <h2 id={farmSummaryHeadingId}>{translate(locale, "planner.summary.label")}</h2>
            <p>
              {formatTranslation(locale, "planner.summary.context", { mapName: getPlannerMapDisplayName(locale, farmSummary.mapContext.baseMapId, farmSummary.mapContext.displayName), mapId: farmSummary.mapContext.baseMapId, season: formatFarmSummarySeason(locale, farmSummary.mapContext.season) })}
            </p>
            <p>{formatTranslation(locale, "planner.summary.itemsPlaced", { count: farmSummary.totalItems })}</p>
          </div>
          <button aria-label={translate(locale, "planner.summary.close")} onClick={onClose} type="button">
            ×
          </button>
        </header>
        {exportErrorMessage !== null ? (
          <p className="farm-summary-modal__error" role="alert">
            {exportErrorMessage}
          </p>
        ) : null}
        {farmSummary.rows.length === 0 ? (
          <p className="farm-summary-modal__empty">{translate(locale, "planner.summary.empty")}</p>
        ) : (
          <FarmSummaryGroups farmSummary={farmSummary} locale={locale} />
        )}
        {farmSummary.rows.length > 0 ? (
          <footer className="farm-summary-modal__footer">
            <button onClick={handleExportCsv} type="button">
              {translate(locale, "planner.summary.export")}
            </button>
          </footer>
        ) : null}
      </section>
    </div>
  );
}

function FarmSummaryGroups({
  farmSummary,
  locale,
}: Readonly<{
  farmSummary: FarmSummary;
  locale: SiteLocale;
}>) {
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
              {getFarmSummaryCategoryDisplayName(locale, category)} ({String(categoryItemCount)})
            </h3>
            <ul>
              {categoryRows.map((farmSummaryRow) => (
                <li key={`${farmSummaryRow.category}:${farmSummaryRow.name}`}>
                  <span>{getCatalogDisplayName(locale, farmSummaryRow.catalogId, farmSummaryRow.name)}</span>
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

function getFarmSummaryCategoryDisplayName(
  locale: SiteLocale,
  sourceCategory: string,
): string {
  const categoryMessageKeys: Readonly<Record<string, string>> = {
    Buildings: "planner.summary.categories.Buildings",
    Crops: "planner.summary.categories.Crops",
    Fences: "planner.summary.categories.Fences",
    Furniture: "planner.summary.categories.Furniture",
    Items: "planner.summary.categories.Items",
    Paths: "planner.summary.categories.Paths",
    Trees: "planner.summary.categories.Trees",
  };
  const categoryMessageKey = categoryMessageKeys[sourceCategory];

  return categoryMessageKey === undefined
    ? sourceCategory
    : translate(locale, categoryMessageKey);
}

function stopModalBackdropClose(mouseEvent: { stopPropagation: () => void }): void {
  mouseEvent.stopPropagation();
}

function formatFarmSummarySeason(locale: SiteLocale, season: string): string {
  if (locale === "zh-CN") {
    return { spring: "春季", summer: "夏季", fall: "秋季", winter: "冬季" }[season] ?? season;
  }

  return `${season.slice(0, 1).toUpperCase()}${season.slice(1)}`;
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
  locale: SiteLocale,
): string {
  return translate(locale, getFarmSummaryExportErrorMessageKey(caughtError));
}

function getFarmSummaryExportErrorMessageKey(
  _caughtError: unknown,
): "planner.summary.error" {
  return "planner.summary.error";
}
