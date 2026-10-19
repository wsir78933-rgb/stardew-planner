"use client";

import {
  farmhouse2Composite,
  gingerIslandOverlays,
  spouseRoomLayouts,
} from "../maps/map-catalog";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import {
  getRussianFarmhouseRenovationDisplayName,
  getRussianGingerIslandOverlayDisplayName,
  getRussianPlannerMapDisplayName,
  getRussianSpouseRoomDisplayName,
} from "../i18n/planner-russian-display-names";
import {
  setFarmhouse2MarriageMapEnabled,
  setFarmhouse2RenovationEnabled,
  setFarmhouse2SpouseId,
  toggleGingerIslandOverlay,
  type MapRenderOptions,
} from "../maps/map-render-options";

type MapConfigurationPanelProperties = Readonly<{
  locale?: PlannerChromeLocale;
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
        <h3>{readMapConfigurationText(locale, { en: "Ginger Island", ja: "ジンジャーアイランド", ru: getRussianPlannerMapDisplayName("ginger-island") })}</h3>
        <p>{readMapConfigurationText(locale, {
          en: "Choose which restored island features appear on this map.",
          ja: "このマップに表示する、修復済みの島の設備を選んでください。",
          ru: "Выберите, какие восстановленные объекты острова показывать на этой карте.",
        })}</p>
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
              {readGingerIslandOverlayLabel(locale, gingerIslandOverlay.id, gingerIslandOverlay.displayName)}
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
      <h3>{readMapConfigurationText(locale, { en: "Farmhouse (Upgrade 2)", ja: "家のアップグレード2", ru: getRussianPlannerMapDisplayName("farmhouse-2") })}</h3>
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
          {readMapConfigurationText(locale, { en: "Married layout", ja: "結婚後の間取り", ru: "Планировка после свадьбы" })}
        </label>
        <label>
          {readMapConfigurationText(locale, { en: "Spouse room", ja: "配偶者の部屋", ru: "Комната супруга" })}
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
            <option value="">{readMapConfigurationText(locale, { en: "None", ja: "なし", ru: "Нет" })}</option>
            {spouseRoomLayouts.map((spouseRoomLayout) => (
              <option
                key={spouseRoomLayout.spouseId}
                value={spouseRoomLayout.spouseId}
              >
                {readSpouseRoomLabel(locale, spouseRoomLayout.spouseId, spouseRoomLayout.displayName)}
              </option>
            ))}
          </select>
        </label>
        <span className="editor-modal__map-configuration-label">{readMapConfigurationText(locale, { en: "Renovations", ja: "改装", ru: "Перестройки" })}</span>
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
            {readFarmhouseRenovationLabel(locale, farmhouseRenovation.id, farmhouseRenovation.displayName)}
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

function readMapConfigurationText(
  locale: PlannerChromeLocale,
  text: Readonly<{ en: string; ja: string; ru: string }>,
): string {
  if (locale === "en" || locale === "zh") {
    return text.en;
  }

  if (locale === "ja") {
    return text.ja;
  }

  if (locale === "ru") {
    return text.ru;
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read map configuration text because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

const japaneseGingerIslandOverlayLabels = {
  restored: "修復済み",
  bin: "出荷箱",
  cave: "洞窟",
  obelisk: "オベリスク",
} as const;

const japaneseSpouseRoomLabels = {
  abigail: "アビゲイル",
  penny: "ペニー",
  leah: "リア",
  haley: "ヘイリー",
  maru: "マル",
  sebastian: "セバスチャン",
  alex: "アレックス",
  harvey: "ハーヴィー",
  elliott: "エリオット",
  sam: "サム",
  shane: "シェーン",
  emily: "エミリー",
  krobus: "クロバス",
} as const;

const japaneseFarmhouseRenovationLabels = {
  bedroom: "開いた寝室",
  "southern-room": "南側の部屋",
  "corner-room": "角の部屋",
  "extended-corner-room": "広げた角の部屋",
  "dining-room": "食事室",
  "dining-room-wall": "食事室の壁",
  cubby: "小部屋",
  "far-upper-room": "奥の上の部屋",
  crib: "ベビーベッド",
  cellar: "地下室",
} as const;

function readGingerIslandOverlayLabel(
  locale: PlannerChromeLocale,
  overlayId: string,
  englishLabel: string,
): string {
  return readKeyedJapaneseLabel(
    locale,
    overlayId,
    englishLabel,
    japaneseGingerIslandOverlayLabels,
    "Ginger Island overlay",
  );
}

function readSpouseRoomLabel(
  locale: PlannerChromeLocale,
  spouseId: string,
  englishLabel: string,
): string {
  return readKeyedJapaneseLabel(
    locale,
    spouseId,
    englishLabel,
    japaneseSpouseRoomLabels,
    "spouse room",
  );
}

function readFarmhouseRenovationLabel(
  locale: PlannerChromeLocale,
  renovationId: string,
  englishLabel: string,
): string {
  return readKeyedJapaneseLabel(
    locale,
    renovationId,
    englishLabel,
    japaneseFarmhouseRenovationLabels,
    "farmhouse renovation",
  );
}

function readKeyedJapaneseLabel(
  locale: PlannerChromeLocale,
  optionId: string,
  englishLabel: string,
  japaneseLabels: Readonly<Record<string, string>>,
  optionKind: string,
): string {
  if (locale === "en" || locale === "zh") {
    return englishLabel;
  }

  if (locale === "ja") {
    if (!Object.prototype.hasOwnProperty.call(japaneseLabels, optionId)) {
      throw new Error(
        `Cannot read Japanese ${optionKind} label because id is ${JSON.stringify(optionId)}.`,
      );
    }
    const japaneseLabel = japaneseLabels[optionId];
    if (japaneseLabel === undefined) {
      throw new Error(
        `Cannot read Japanese ${optionKind} label because id is ${JSON.stringify(optionId)}.`,
      );
    }
    return japaneseLabel;
  }

  if (locale === "ru") {
    return readRussianMapConfigurationLabel(optionKind, optionId);
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read ${optionKind} label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readRussianMapConfigurationLabel(optionKind: string, optionId: string): string {
  if (optionKind === "Ginger Island overlay") {
    const overlay = gingerIslandOverlays.find((candidate) => candidate.id === optionId);
    if (overlay === undefined) {
      throw new Error(
        `Cannot read Russian Ginger Island overlay label because id is ${JSON.stringify(optionId)}.`,
      );
    }
    return getRussianGingerIslandOverlayDisplayName(overlay.id);
  }
  if (optionKind === "spouse room") {
    const spouseRoom = spouseRoomLayouts.find((candidate) => candidate.spouseId === optionId);
    if (spouseRoom === undefined) {
      throw new Error(
        `Cannot read Russian spouse room label because id is ${JSON.stringify(optionId)}.`,
      );
    }
    return getRussianSpouseRoomDisplayName(spouseRoom.spouseId);
  }
  if (optionKind === "farmhouse renovation") {
    const renovation = farmhouse2Composite.renovations.find((candidate) => candidate.id === optionId);
    if (renovation === undefined) {
      throw new Error(
        `Cannot read Russian farmhouse renovation label because id is ${JSON.stringify(optionId)}.`,
      );
    }
    return getRussianFarmhouseRenovationDisplayName(renovation.id);
  }
  throw new Error(
    `Cannot read Russian map configuration label because option kind is ${JSON.stringify(optionKind)} and id is ${JSON.stringify(optionId)}.`,
  );
}
