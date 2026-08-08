"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadCatalogCategory,
  type Catalog,
  type CatalogItem,
  type CatalogPanelCategory,
} from "../catalog";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  analyzeRequiredPlacementCatalog,
  getNextRequiredPlacementCatalogRetryAttempt,
  startRequiredPlacementCatalogLoad,
} from "../planner/planner-workspace-required-catalog";
import type { PlannerRequiredCatalogGateState } from "./planner-required-catalog-status";

export type RequiredPlacementCatalogGateState = PlannerRequiredCatalogGateState;

type RequiredPlacementCatalogRequestFailure = Readonly<{
  canRetry: boolean;
  message: string;
  requestKey: string;
}>;

type UseRequiredPlacementCatalogInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  loadCategory?: (category: CatalogPanelCategory) => Promise<Catalog>;
  onCatalogItemsLoaded: (catalogItems: readonly CatalogItem[]) => void;
  placementSnapshot: PlacementSnapshot;
  resourceGeneration: number;
}>;

export function useRequiredPlacementCatalog({
  catalogItems,
  loadCategory = loadCatalogCategory,
  onCatalogItemsLoaded,
  placementSnapshot,
  resourceGeneration,
}: UseRequiredPlacementCatalogInput): RequiredPlacementCatalogGateState {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [requestFailure, setRequestFailure] =
    useState<RequiredPlacementCatalogRequestFailure | null>(null);
  const retryCatalogLoad = useCallback(() => {
    setRetryAttempt(getNextRequiredPlacementCatalogRetryAttempt);
  }, []);
  const catalogAnalysis = analyzeRequiredPlacementCatalog(
    placementSnapshot,
    catalogItems,
  );
  const missingCatalogItems =
    catalogAnalysis.kind === "missing"
      ? catalogAnalysis.missingCatalogItems
      : [];
  const missingCatalogItemSignature = missingCatalogItems
    .map(
      (missingCatalogItem) =>
        `${missingCatalogItem.category}:${missingCatalogItem.itemId}`,
    )
    .join("\u0000");
  const requestKey = [
    String(resourceGeneration),
    String(retryAttempt),
    missingCatalogItemSignature,
  ].join("\u0001");

  useEffect(() => {
    if (missingCatalogItems.length === 0) return;

    setRequestFailure(null);
    const catalogLoad = startRequiredPlacementCatalogLoad({
      loadCategory,
      missingCatalogItems,
      onCatalogItemsLoaded,
      onError: (catalogError, canRetry) => {
        setRequestFailure({
          canRetry,
          message: catalogError.message,
          requestKey,
        });
      },
    });

    return catalogLoad.cancel;
  }, [
    loadCategory,
    missingCatalogItemSignature,
    onCatalogItemsLoaded,
    requestKey,
  ]);

  if (catalogAnalysis.kind === "ready") {
    return { kind: "ready" };
  }
  if (catalogAnalysis.kind === "error") {
    return {
      kind: "error",
      message: catalogAnalysis.message,
    };
  }
  if (requestFailure?.requestKey === requestKey) {
    return {
      kind: "error",
      message: requestFailure.message,
      onRetry: requestFailure.canRetry ? retryCatalogLoad : undefined,
    };
  }
  return { kind: "loading" };
}
