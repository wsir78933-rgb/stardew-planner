"use client";

import type { CatalogItem } from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type {
  FarmSummaryDetailCopy,
  FarmSummaryPreviewCopy,
} from "../i18n/save-modal-copy";
import { FarmSummaryPanel } from "./farm-summary-panel";

type PlannerFarmSummaryModalContentProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  copy: Readonly<{
    farmSummaryDetail: FarmSummaryDetailCopy;
    farmSummaryPreview: FarmSummaryPreviewCopy;
  }>;
  mapDisplayName: string;
  placementSnapshot: PlacementSnapshot;
  selectedPlannerMapId: string;
  season: TilesheetSeason;
}>;

export function PlannerFarmSummaryModalContent({
  catalogItems,
  copy,
  mapDisplayName,
  placementSnapshot,
  selectedPlannerMapId,
  season,
}: PlannerFarmSummaryModalContentProperties) {
  return (
    <div className="planner-save-modal-content planner-save-modal-content--farm-summary">
      <FarmSummaryPanel
        catalogItems={catalogItems}
        copy={{
          detail: copy.farmSummaryDetail,
          preview: copy.farmSummaryPreview,
        }}
        mapContext={{
          baseMapId: selectedPlannerMapId,
          displayName: mapDisplayName,
          season,
        }}
        placementSnapshot={placementSnapshot}
      />
    </div>
  );
}
