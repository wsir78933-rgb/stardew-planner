"use client";

import {
  getRussianFarmhouseRenovationDisplayName,
  getRussianGingerIslandOverlayDisplayName,
  getRussianPlannerMapDisplayName,
  getRussianSpouseRoomDisplayName,
} from "../i18n/planner-russian-display-names";
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

type MapConfigurationLocale = "en" | "zh" | "ru";

type MapConfigurationPanelProperties = Readonly<{
  locale?: MapConfigurationLocale;
  mapRenderOptions: MapRenderOptions;
  selectedMapId: string;
  onMapRenderOptionsChange: (nextMapRenderOptions: MapRenderOptions) => void;
}>;

export function MapConfigurationPanel({
  locale,
  mapRenderOptions,
  selectedMapId,
  onMapRenderOptionsChange,
}: MapConfigurationPanelProperties) {
  const configurationLocale = readMapConfigurationLocale(locale);
  if (selectedMapId === "ginger-island") {
    return (
      <section className="editor-modal__map-configuration">
        <h3>{readGingerIslandHeading(configurationLocale)}</h3>
        <p>{readGingerIslandHelp(configurationLocale)}</p>
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
              {readGingerIslandOverlayLabel(gingerIslandOverlay, configurationLocale)}
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
      <h3>{readFarmhouseUpgradeHeading(configurationLocale)}</h3>
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
          {readMarriedLayoutLabel(configurationLocale)}
        </label>
        <label>
          {readSpouseRoomLabel(configurationLocale)}
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
            <option value="">{readSpouseRoomNoneLabel(configurationLocale)}</option>
            {spouseRoomLayouts.map((spouseRoomLayout) => (
              <option
                key={spouseRoomLayout.spouseId}
                value={spouseRoomLayout.spouseId}
              >
                {readSpouseRoomOptionLabel(spouseRoomLayout, configurationLocale)}
              </option>
            ))}
          </select>
        </label>
        <span className="editor-modal__map-configuration-label">{readRenovationsLabel(configurationLocale)}</span>
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
            {readFarmhouseRenovationLabel(farmhouseRenovation, configurationLocale)}
          </label>
        ))}
      </div>
    </section>
  );
}

function readMapConfigurationLocale(
  locale: MapConfigurationLocale | undefined,
): MapConfigurationLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readGingerIslandHeading(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "Ginger Island";
  if (locale === "ru") return getRussianPlannerMapDisplayName("ginger-island");
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readGingerIslandHelp(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Choose which restored island features appear on this map.";
  }
  if (locale === "ru") {
    return "Выберите, какие восстановленные объекты острова показывать на этой карте.";
  }
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readGingerIslandOverlayLabel(
  gingerIslandOverlay: (typeof gingerIslandOverlays)[number],
  locale: MapConfigurationLocale,
): string {
  if (locale === "en" || locale === "zh") return gingerIslandOverlay.displayName;
  if (locale === "ru") return getRussianGingerIslandOverlayDisplayName(gingerIslandOverlay.id);
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readFarmhouseUpgradeHeading(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "Farmhouse (Upgrade 2)";
  if (locale === "ru") return getRussianPlannerMapDisplayName("farmhouse-2");
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readMarriedLayoutLabel(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "Married layout";
  if (locale === "ru") return "Планировка после свадьбы";
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readSpouseRoomLabel(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "Spouse room";
  if (locale === "ru") return "Комната супруга";
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readSpouseRoomNoneLabel(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "None";
  if (locale === "ru") return "Нет";
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readSpouseRoomOptionLabel(
  spouseRoomLayout: (typeof spouseRoomLayouts)[number],
  locale: MapConfigurationLocale,
): string {
  if (locale === "en" || locale === "zh") return spouseRoomLayout.displayName;
  if (locale === "ru") return getRussianSpouseRoomDisplayName(spouseRoomLayout.spouseId);
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readRenovationsLabel(locale: MapConfigurationLocale): string {
  if (locale === "en" || locale === "zh") return "Renovations";
  if (locale === "ru") return "Перестройки";
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readFarmhouseRenovationLabel(
  farmhouseRenovation: (typeof farmhouse2Composite.renovations)[number],
  locale: MapConfigurationLocale,
): string {
  if (locale === "en" || locale === "zh") return farmhouseRenovation.displayName;
  if (locale === "ru") return getRussianFarmhouseRenovationDisplayName(farmhouseRenovation.id);
  throw new TypeError(
    `Map configuration locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
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
