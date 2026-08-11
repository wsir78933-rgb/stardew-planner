"use client";

import type { CatalogItem } from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import { FarmSummaryPanel } from "./farm-summary-panel";

type PlannerFarmSummaryModalContentProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  mapDisplayName: string;
  placementSnapshot: PlacementSnapshot;
  selectedPlannerMapId: string;
  season: TilesheetSeason;
}>;

export function PlannerFarmSummaryModalContent({
  catalogItems,
  mapDisplayName,
  placementSnapshot,
  selectedPlannerMapId,
  season,
}: PlannerFarmSummaryModalContentProperties) {
  return (
    <div className="planner-save-modal-content planner-save-modal-content--farm-summary">
      <FarmSummaryPanel
        catalogItems={catalogItems}
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
