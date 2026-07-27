"use client";

import {
  farmhouse2Composite,
  gingerIslandOverlays,
  spouseRoomLayouts,
} from "../maps/map-catalog";
import {
  setFarmhouse2MarriageMapEnabled,
  setFarmhouse2RenovationEnabled,
  setFarmhouse2SpouseId,
  toggleGingerIslandOverlay,
  type MapRenderOptions,
} from "../maps/map-render-options";
import { getMapConfigurationDisplayName } from "../i18n/catalog-display";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type MapConfigurationPanelProperties = Readonly<{
  locale?: SiteLocale;
  mapRenderOptions: MapRenderOptions;
  selectedMapId: string;
  onMapRenderOptionsChange: (nextMapRenderOptions: MapRenderOptions) => void;
}>;

export function MapConfigurationPanel({
  locale = "en",
  mapRenderOptions,
  selectedMapId,
  onMapRenderOptionsChange,
}: MapConfigurationPanelProperties) {
  if (selectedMapId === "ginger-island") {
    return (
      <section className="editor-modal__map-configuration">
        <h3>{translate(locale, "planner.mapConfiguration.gingerIsland")}</h3>
        <p>{translate(locale, "planner.mapConfiguration.gingerDescription")}</p>
        <div className="editor-modal__map-configuration-options">
          {gingerIslandOverlays.map((gingerIslandOverlay) => (
            <label key={gingerIslandOverlay.id}>
              <input
                checked={mapRenderOptions.gingerIslandOverlayIds.includes(
                  gingerIslandOverlay.id,
                )}
                onChange={() =>
                  onMapRenderOptionsChange(
                    toggleGingerIslandOverlay(
                      mapRenderOptions,
                      gingerIslandOverlay.id,
                    ),
                  )
                }
                type="checkbox"
              />
              {getMapConfigurationDisplayName(locale, gingerIslandOverlay.id, gingerIslandOverlay.displayName)}
            </label>
          ))}
        </div>
      </section>
    );
  }

  if (selectedMapId !== "farmhouse-2") {
    return null;
  }

  const selectedRenovationIds = new Set(
    mapRenderOptions.farmhouse2.renovationIds,
  );

  return (
    <section className="editor-modal__map-configuration">
      <h3>{translate(locale, "planner.mapConfiguration.farmhouse")}</h3>
      <div className="editor-modal__map-configuration-options">
        <label>
          <input
            checked={mapRenderOptions.farmhouse2.marriageMapEnabled}
            onChange={(changeEvent) =>
              onMapRenderOptionsChange(
                setFarmhouse2MarriageMapEnabled(
                  mapRenderOptions,
                  changeEvent.target.checked,
                ),
              )
            }
            type="checkbox"
          />
          {translate(locale, "planner.mapConfiguration.married")}
        </label>
        <label>
          {translate(locale, "planner.mapConfiguration.spouseRoom")}
          <select
            disabled={!mapRenderOptions.farmhouse2.marriageMapEnabled}
            onChange={(changeEvent) =>
              onMapRenderOptionsChange(
                setFarmhouse2SpouseId(
                  mapRenderOptions,
                  changeEvent.target.value === ""
                    ? null
                    : readSpouseId(changeEvent.target.value),
                ),
              )
            }
            value={mapRenderOptions.farmhouse2.spouseId ?? ""}
          >
            <option value="">{translate(locale, "planner.mapConfiguration.none")}</option>
            {spouseRoomLayouts.map((spouseRoomLayout) => (
              <option
                key={spouseRoomLayout.spouseId}
                value={spouseRoomLayout.spouseId}
              >
                {getMapConfigurationDisplayName(locale, spouseRoomLayout.spouseId, spouseRoomLayout.displayName)}
              </option>
            ))}
          </select>
        </label>
        <span className="editor-modal__map-configuration-label">{translate(locale, "planner.mapConfiguration.renovations")}</span>
        {farmhouse2Composite.renovations.map((farmhouseRenovation) => (
          <label key={farmhouseRenovation.id}>
            <input
              checked={selectedRenovationIds.has(farmhouseRenovation.id)}
              disabled={
                !selectedRenovationIds.has(farmhouseRenovation.id) &&
                farmhouseRenovation.dependsOn.some(
                  (requiredRenovationId) =>
                    !selectedRenovationIds.has(requiredRenovationId),
                )
              }
              onChange={(changeEvent) =>
                onMapRenderOptionsChange(
                  setFarmhouse2RenovationEnabled(
                    mapRenderOptions,
                    farmhouseRenovation.id,
                    changeEvent.target.checked,
                  ),
                )
              }
              type="checkbox"
            />
            {getMapConfigurationDisplayName(locale, farmhouseRenovation.id, farmhouseRenovation.displayName)}
          </label>
        ))}
      </div>
    </section>
  );
}

function readSpouseId(rawSpouseId: string): (typeof spouseRoomLayouts)[number]["spouseId"] {
  const spouseRoomLayout = spouseRoomLayouts.find(
    (candidateSpouseRoomLayout) => candidateSpouseRoomLayout.spouseId === rawSpouseId,
  );

  if (spouseRoomLayout === undefined) {
    throw new Error(
      `Farmhouse 2 spouse select value ${JSON.stringify(rawSpouseId)} is unavailable in the locked map catalog.`,
    );
  }

  return spouseRoomLayout.spouseId;
}
