"use client";

import { useState } from "react";
import type { CatalogItem } from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  createFarmSummary,
  type FarmSummaryMapContext,
} from "../projects/farm-summary";
import type {
  FarmSummaryDetailCopy,
  FarmSummaryPreviewCopy,
} from "../i18n/save-modal-copy";
import {
  FarmSummaryModal,
  readVisibleFarmSummaryMapName,
  type FarmSummaryLocale,
} from "./farm-summary-modal";

type FarmSummaryPanelProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  copy: Readonly<{
    detail: FarmSummaryDetailCopy;
    preview: FarmSummaryPreviewCopy;
  }>;
  locale?: FarmSummaryLocale;
  mapContext: FarmSummaryMapContext;
  placementSnapshot: PlacementSnapshot;
}>;

export function FarmSummaryPanel({
  catalogItems,
  copy,
  locale,
  mapContext,
  placementSnapshot,
}: FarmSummaryPanelProperties) {
  const summaryLocale = readFarmSummaryPanelLocale(locale);
  const [isFarmSummaryOpen, setIsFarmSummaryOpen] = useState(false);
  const farmSummary = createFarmSummary(
    placementSnapshot,
    catalogItems,
    mapContext,
    summaryLocale,
  );

  return (
    <section aria-label={copy.preview.ariaLabel} className="farm-summary-panel">
      <div className="farm-summary-panel__preview">
        <p>{copy.preview.map}: {readVisibleFarmSummaryMapName(mapContext, summaryLocale)}</p>
        <p>{copy.preview.seasonLabel}: {copy.preview.season(farmSummary.mapContext.season)}</p>
        <p>{copy.preview.itemsPlaced(farmSummary.totalItems)}</p>
      </div>
      <button onClick={() => setIsFarmSummaryOpen(true)} type="button">
        {copy.preview.viewDetails}
      </button>
      {isFarmSummaryOpen ? (
        <FarmSummaryModal
          copy={copy.detail}
          farmSummary={farmSummary}
          locale={summaryLocale}
          onClose={() => setIsFarmSummaryOpen(false)}
        />
      ) : null}
    </section>
  );
}

function readFarmSummaryPanelLocale(
  locale: FarmSummaryLocale | undefined,
): FarmSummaryLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Farm summary locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}
