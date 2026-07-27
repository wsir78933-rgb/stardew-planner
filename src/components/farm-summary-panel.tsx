"use client";

import { useState } from "react";
import type { CatalogItem } from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  createFarmSummary,
  type FarmSummary,
  type FarmSummaryMapContext,
} from "../projects/farm-summary";
import { FarmSummaryModal } from "./farm-summary-modal";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type FarmSummaryPanelProperties = Readonly<{
  locale?: SiteLocale;
  catalogItems: readonly CatalogItem[];
  mapContext: FarmSummaryMapContext;
  onOpenFarmSummary?: (farmSummary: FarmSummary) => void;
  placementSnapshot: PlacementSnapshot;
}>;

export function FarmSummaryPanel({
  locale = "en",
  catalogItems,
  mapContext,
  onOpenFarmSummary,
  placementSnapshot,
}: FarmSummaryPanelProperties) {
  const [isFarmSummaryOpen, setIsFarmSummaryOpen] = useState(false);
  const farmSummary = createFarmSummary(
    placementSnapshot,
    catalogItems,
    mapContext,
  );

  return (
    <section aria-label={translate(locale, "planner.summary.label")} className="farm-summary-panel">
      <button
        onClick={() => {
          if (onOpenFarmSummary !== undefined) {
            onOpenFarmSummary(farmSummary);
            return;
          }

          setIsFarmSummaryOpen(true);
        }}
        type="button"
      >
        {translate(locale, "planner.summary.label")}
      </button>
      {isFarmSummaryOpen ? (
        <FarmSummaryModal
          farmSummary={farmSummary}
          locale={locale}
          onClose={() => setIsFarmSummaryOpen(false)}
        />
      ) : null}
    </section>
  );
}
