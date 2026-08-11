"use client";

import { useState } from "react";
import type { CatalogItem } from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  createFarmSummary,
  type FarmSummaryMapContext,
} from "../projects/farm-summary";
import { FarmSummaryModal } from "./farm-summary-modal";

type FarmSummaryPanelProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  mapContext: FarmSummaryMapContext;
  placementSnapshot: PlacementSnapshot;
}>;

export function FarmSummaryPanel({
  catalogItems,
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
    <section aria-label="Farm Summary" className="farm-summary-panel">
      <div className="farm-summary-panel__preview">
        <p>Map: {farmSummary.mapContext.displayName}</p>
        <p>Season: {formatFarmSummaryPreviewSeason(farmSummary.mapContext.season)}</p>
        <p>{String(farmSummary.totalItems)} items placed</p>
      </div>
      <button onClick={() => setIsFarmSummaryOpen(true)} type="button">
        View detailed summary
      </button>
      {isFarmSummaryOpen ? (
        <FarmSummaryModal
          farmSummary={farmSummary}
          onClose={() => setIsFarmSummaryOpen(false)}
        />
      ) : null}
    </section>
  );
}

function formatFarmSummaryPreviewSeason(season: string): string {
  return `${season.slice(0, 1).toUpperCase()}${season.slice(1)}`;
}
