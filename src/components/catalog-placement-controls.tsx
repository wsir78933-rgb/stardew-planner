"use client";

import type {
  CatalogItem,
  CatalogPresentationChoice,
} from "../catalog";
import { getCatalogSidebarDisplayName } from "../catalog/catalog-sidebar-model";
import type { EditorTool } from "../editor/editor-view-state";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { readLocalizedCatalogItemLabel } from "../homepage/japanese-game-display-labels";
import {
  getCatalogPanelCopy,
  type CatalogPanelCopy,
} from "../i18n/catalog-panel-copy";
import { CatalogLitThumbnail } from "./catalog-lit-thumbnail";
import { getCatalogItemThumbnailStyle } from "./item-catalog-panel";

const catalogPlacementThumbnailSize = 44;

export type CatalogPlacementMode = "place" | "fill" | null;

type CatalogPlacementControlsProperties = Readonly<{
  catalogItem: CatalogItem | null;
  locale: HomepageLocale;
  onCancel: () => void;
  onCyclePendingChoice: () => boolean;
  placementMode: CatalogPlacementMode;
  presentationChoice: CatalogPresentationChoice | null;
}>;

type CatalogPlacementStatus = Readonly<{
  hint: string | null;
  label: string;
}>;

export function getCatalogPlacementMode(
  tool: EditorTool | null,
): CatalogPlacementMode {
  if (tool === "cursor") {
    return "place";
  }
  if (tool === "fill") {
    return "fill";
  }
  if (tool === "multi-select" || tool === "erase" || tool === null) {
    return null;
  }

  throw new TypeError(
    `Catalog placement mode cannot be derived from tool ${JSON.stringify(tool)}.`,
  );
}

type PendingCatalogControl = "rotation" | "variant" | null;

export function CatalogPlacementControls({
  catalogItem,
  locale,
  onCancel,
  onCyclePendingChoice,
  placementMode,
  presentationChoice,
}: CatalogPlacementControlsProperties) {
  assertCatalogPlacementMode(placementMode);
  if (catalogItem === null) {
    return null;
  }
  if (presentationChoice === null) {
    throw new TypeError(
      `Catalog presentation choice is unavailable for item ID ${JSON.stringify(catalogItem.id)}.`,
    );
  }

  const copy = getCatalogPanelCopy(locale);
  const pendingCatalogControl = getPendingCatalogControl(catalogItem);
  const englishDisplayName = getCatalogSidebarDisplayName(catalogItem, "en");
  const itemName = locale === "ru"
    ? getCatalogSidebarDisplayName(catalogItem, "ru")
    : readLocalizedCatalogItemLabel(locale, englishDisplayName);
  const placementStatus = getCatalogPlacementStatus(
    copy,
    itemName,
    placementMode,
  );
  const thumbnailStyle = getCatalogItemThumbnailStyle(
    catalogItem,
    presentationChoice,
    true,
    "grid",
  );
  const thumbnailWidth =
    typeof thumbnailStyle.width === "number"
      ? thumbnailStyle.width
      : catalogPlacementThumbnailSize;
  const thumbnailHeight =
    typeof thumbnailStyle.height === "number"
      ? thumbnailStyle.height
      : catalogPlacementThumbnailSize;
  const thumbnailScale = Math.min(
    1,
    catalogPlacementThumbnailSize / Math.max(thumbnailWidth, thumbnailHeight),
  );

  return (
    <div
      aria-label={placementStatus.label}
      className="catalog-placement-controls selection-pill"
      role="group"
    >
      <span
        aria-hidden="true"
        className="catalog-placement-controls__thumbnail-frame"
      >
        <span
          className="catalog-placement-controls__thumbnail-scale"
          style={{ transform: `scale(${String(thumbnailScale)})` }}
        >
          {catalogItem.renderingMetadata?.kind === "lit-big-craftable" ? (
            <CatalogLitThumbnail
              bodyStyle={{
                ...thumbnailStyle,
                height: thumbnailHeight,
                width: thumbnailWidth,
              }}
              catalogItem={catalogItem}
              presentationChoice={presentationChoice}
              shouldLoadThumbnail
              thumbnailClassName="catalog-placement-controls__thumbnail"
            />
          ) : (
            <span
              className="catalog-placement-controls__thumbnail"
              style={{
                ...thumbnailStyle,
                height: thumbnailHeight,
                width: thumbnailWidth,
              }}
            />
          )}
        </span>
      </span>
      <div className="catalog-placement-controls__info">
        <span className="catalog-placement-controls__name">{placementStatus.label}</span>
        {placementStatus.hint === null ? null : (
          <span className="catalog-placement-controls__hint">{placementStatus.hint}</span>
        )}
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

function assertCatalogPlacementMode(
  placementMode: CatalogPlacementMode,
): void {
  if (
    placementMode === "place"
    || placementMode === "fill"
    || placementMode === null
  ) {
    return;
  }

  throw new TypeError(
    `Catalog placement mode must be "place", "fill", or null; received ${JSON.stringify(placementMode)}.`,
  );
}

function getCatalogPlacementStatus(
  copy: CatalogPanelCopy,
  itemName: string,
  placementMode: CatalogPlacementMode,
): CatalogPlacementStatus {
  if (placementMode === "place") {
    return {
      hint: copy.placeItemHint,
      label: copy.placingItem(itemName),
    };
  }
  if (placementMode === "fill") {
    return {
      hint: copy.fillItemHint,
      label: copy.fillingItem(itemName),
    };
  }
  if (placementMode === null) {
    return {
      hint: null,
      label: itemName,
    };
  }

  throw new TypeError(
    `Catalog placement mode must be "place", "fill", or null; received ${JSON.stringify(placementMode)}.`,
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
