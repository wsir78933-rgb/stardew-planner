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

type MapConfigurationPanelProperties = Readonly<{
  mapRenderOptions: MapRenderOptions;
  selectedMapId: string;
  onMapRenderOptionsChange: (nextMapRenderOptions: MapRenderOptions) => void;
}>;

export function MapConfigurationPanel({
  mapRenderOptions,
  selectedMapId,
  onMapRenderOptionsChange,
}: MapConfigurationPanelProperties) {
  if (selectedMapId === "ginger-island") {
    return (
      <section className="editor-modal__map-configuration">
        <h3>Ginger Island</h3>
        <p>Choose which restored island features appear on this map.</p>
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
              {gingerIslandOverlay.displayName}
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
      <h3>Farmhouse (Upgrade 2)</h3>
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
          Married layout
        </label>
        <label>
          Spouse room
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
            <option value="">None</option>
            {spouseRoomLayouts.map((spouseRoomLayout) => (
              <option
                key={spouseRoomLayout.spouseId}
                value={spouseRoomLayout.spouseId}
              >
                {spouseRoomLayout.displayName}
              </option>
            ))}
          </select>
        </label>
        <span className="editor-modal__map-configuration-label">Renovations</span>
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
            {farmhouseRenovation.displayName}
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
