"use client";

import type { CatalogItem } from "../catalog";
import { getCatalogSidebarDisplayName } from "../catalog/catalog-sidebar-model";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { getCatalogPanelCopy } from "../i18n/catalog-panel-copy";

type CatalogPlacementControlsProperties = Readonly<{
  catalogItem: CatalogItem | null;
  locale: HomepageLocale;
  onCancel: () => void;
  onCyclePendingChoice: () => boolean;
}>;

type PendingCatalogControl = "rotation" | "variant" | null;

export function CatalogPlacementControls({
  catalogItem,
  locale,
  onCancel,
  onCyclePendingChoice,
}: CatalogPlacementControlsProperties) {
  if (catalogItem === null) {
    return null;
  }

  const copy = getCatalogPanelCopy(locale);
  const pendingCatalogControl = getPendingCatalogControl(catalogItem);
  const placingItemLabel = copy.placingItem(getCatalogSidebarDisplayName(catalogItem));

  return (
    <div
      aria-label={placingItemLabel}
      className="catalog-placement-controls selection-pill"
      role="group"
    >
      <div className="catalog-placement-controls__info">
        <span className="catalog-placement-controls__name">{placingItemLabel}</span>
        <span className="catalog-placement-controls__hint">{copy.placeItemHint}</span>
      </div>
      <div className="catalog-placement-controls__actions">
        {pendingCatalogControl === null ? null : (
          <button
            aria-label={pendingCatalogControl === "rotation" ? copy.rotate : copy.variant}
            className="catalog-placement-controls__action"
            data-control={pendingCatalogControl}
            onClick={() => {
              if (!onCyclePendingChoice()) {
                throw new Error(
                  `Unable to cycle pending catalog choice for item ${JSON.stringify(catalogItem.id)}.`,
                );
              }
            }}
            title={pendingCatalogControl === "rotation" ? copy.rotate : copy.variant}
            type="button"
          >
            {pendingCatalogControl === "rotation" ? (
              <svg aria-hidden="true" height={20} viewBox="0 0 24 24" width={20}>
                <path
                  d="M20 16A8.94 8.94 0 1 1 20 8M20 4V8H16"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            ) : (
              <svg aria-hidden="true" height={20} viewBox="0 0 24 24" width={20}>
                <path
                  d="M3 7H21M17 3L21 7L17 11M21 17H3M7 13L3 17L7 21"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            )}
          </button>
        )}
        <button
          aria-label={copy.cancelPlacement}
          className="catalog-placement-controls__action"
          onClick={onCancel}
          title={copy.cancelPlacement}
          type="button"
        >
          <svg aria-hidden="true" height={16} viewBox="0 0 24 24" width={16}>
            <path
              d="M6 6L18 18M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function getPendingCatalogControl(catalogItem: CatalogItem): PendingCatalogControl {
  const presentationCapabilities = catalogItem.presentationCapabilities;
  if ((presentationCapabilities?.rotation?.count ?? 0) > 1) {
    return "rotation";
  }
  if ((presentationCapabilities?.variantCycle?.count ?? 0) > 1) {
    return "variant";
  }
  return null;
}
