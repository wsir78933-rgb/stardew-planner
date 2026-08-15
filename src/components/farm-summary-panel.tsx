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
import { FarmSummaryModal } from "./farm-summary-modal";

type FarmSummaryPanelProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  copy: Readonly<{
    detail: FarmSummaryDetailCopy;
    preview: FarmSummaryPreviewCopy;
  }>;
  mapContext: FarmSummaryMapContext;
  placementSnapshot: PlacementSnapshot;
}>;

export function FarmSummaryPanel({
  catalogItems,
  copy,
  mapContext,
  placementSnapshot,
}: FarmSummaryPanelProperties) {
  const [isFarmSummaryOpen, setIsFarmSummaryOpen] = useState(false);
  const farmSummary = createFarmSummary(
    placementSnapshot,
    catalogItems,
    mapContext,
  );

  return (
    <section aria-label={copy.preview.ariaLabel} className="farm-summary-panel">
      <div className="farm-summary-panel__preview">
        <p>{copy.preview.map}: {farmSummary.mapContext.displayName}</p>
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
          onClose={() => setIsFarmSummaryOpen(false)}
        />
      ) : null}
    </section>
  );
}
