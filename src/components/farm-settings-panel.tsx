"use client";

import type { ReactNode } from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { getRussianFarmSpouseDisplayName } from "../i18n/planner-russian-display-names";
import {
  farmSpouseDefinitions,
  supportsFarmCaveChoice,
  supportsFarmSpousePatio,
  type FarmCaveChoice,
} from "../maps/farm-map-rendering";
import {
  setFarmCaveChoice,
  setFarmSpouseId,
  type MapRenderOptions,
} from "../maps/map-render-options";

type FarmSettingsLocale = PlannerChromeLocale;

type FarmSettingsPanelProps = Readonly<{
  locale: FarmSettingsLocale;
  selectedMapId: string;
  mapRenderOptions: MapRenderOptions;
  onMapRenderOptionsChange: (nextOptions: MapRenderOptions) => void;
}>;

type FarmSettingsChange = FarmSettingsPanelProps["onMapRenderOptionsChange"];

const farmCaveChoices = ["none", "mushrooms", "bats"] as const satisfies readonly FarmCaveChoice[];

const unsupportedFarmSettingsMessage =
  "This map has no spouse patio or farm cave. 这张地图没有配偶庭院或农场洞穴。";

function readFarmSettingsLocale(locale: string): FarmSettingsLocale {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return locale;
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function FarmSettingsSection({
  title,
  children,
}: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="editor-config-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function SpousePatioChoices({
  locale,
  mapRenderOptions,
  onMapRenderOptionsChange,
}: Readonly<{
  locale: FarmSettingsLocale;
  mapRenderOptions: MapRenderOptions;
  onMapRenderOptionsChange: FarmSettingsChange;
}>) {
  const selectedSpouseId = mapRenderOptions.farm?.spouseId;

  return (
    <div className="editor-config-chips">
      <button
        type="button"
        aria-pressed={!selectedSpouseId}
        onClick={() => onMapRenderOptionsChange(setFarmSpouseId(mapRenderOptions, null))}
      >
        {readSpouseNoneLabel(locale)}
      </button>
      {farmSpouseDefinitions.map((spouseDefinition) => (
        <button
          type="button"
          key={spouseDefinition.id}
          aria-pressed={selectedSpouseId === spouseDefinition.id}
          onClick={() =>
            onMapRenderOptionsChange(setFarmSpouseId(mapRenderOptions, spouseDefinition.id))
          }
        >
          {readSpouseChoiceLabel(locale, spouseDefinition.id, spouseDefinition.label)}
        </button>
      ))}
    </div>
  );
}

function FarmCaveChoices({
  locale,
  mapRenderOptions,
  onMapRenderOptionsChange,
}: Readonly<{
  locale: FarmSettingsLocale;
  mapRenderOptions: MapRenderOptions;
  onMapRenderOptionsChange: FarmSettingsChange;
}>) {
  const selectedCaveChoice = mapRenderOptions.farm?.caveChoice ?? "none";
  const caveLabels = readFarmCaveLabels(locale);

  return (
    <div className="editor-config-chips">
      {farmCaveChoices.map((caveChoice, caveChoiceIndex) => (
        <button
          type="button"
          key={caveChoice}
          aria-pressed={selectedCaveChoice === caveChoice}
          onClick={() =>
            onMapRenderOptionsChange(setFarmCaveChoice(mapRenderOptions, caveChoice))
          }
        >
          {caveLabels[caveChoiceIndex]}
        </button>
      ))}
    </div>
  );
}

export function FarmSettingsPanel(props: FarmSettingsPanelProps) {
  const locale = readFarmSettingsLocale(props.locale);
  const showsSpousePatio = supportsFarmSpousePatio(props.selectedMapId);
  const showsFarmCave = supportsFarmCaveChoice(props.selectedMapId);

  return (
    <div className="editor-config-panels">
      {showsSpousePatio ? (
        <FarmSettingsSection title={readFarmSettingsSectionTitle(locale, "spouse")}>
          <SpousePatioChoices
            locale={locale}
            mapRenderOptions={props.mapRenderOptions}
            onMapRenderOptionsChange={props.onMapRenderOptionsChange}
          />
        </FarmSettingsSection>
      ) : null}
      {showsFarmCave ? (
        <FarmSettingsSection title={readFarmSettingsSectionTitle(locale, "cave")}>
          <FarmCaveChoices
            locale={locale}
            mapRenderOptions={props.mapRenderOptions}
            onMapRenderOptionsChange={props.onMapRenderOptionsChange}
          />
        </FarmSettingsSection>
      ) : null}
      {showsSpousePatio || showsFarmCave ? null : (
        <p className="editor-config-label">{readUnsupportedFarmSettingsMessage(locale)}</p>
      )}
    </div>
  );
}

const japaneseSpouseLabels = {
  Abigail: "アビゲイル",
  Alex: "アレックス",
  Elliott: "エリオット",
  Emily: "エミリー",
  Haley: "ヘイリー",
  Harvey: "ハーヴィー",
  Leah: "リア",
  Maru: "マル",
  Penny: "ペニー",
  Sam: "サム",
  Sebastian: "セバスチャン",
  Shane: "シェーン",
} as const;

function readSpouseNoneLabel(locale: FarmSettingsLocale): string {
  if (locale === "zh") return "无";
  if (locale === "en") return "None";
  if (locale === "ja") return "なし";
  if (locale === "ru") return "Нет";
  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read spouse none label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readSpouseChoiceLabel(
  locale: FarmSettingsLocale,
  spouseId: string,
  englishLabel: string,
): string {
  if (locale === "en" || locale === "zh") {
    return englishLabel;
  }

  if (locale === "ja") {
    if (!Object.prototype.hasOwnProperty.call(japaneseSpouseLabels, spouseId)) {
      throw new Error(
        `Cannot read Japanese spouse label because spouse id is ${JSON.stringify(spouseId)}.`,
      );
    }
    return japaneseSpouseLabels[spouseId as keyof typeof japaneseSpouseLabels];
  }

  if (locale === "ru") {
    const spouseDefinition = farmSpouseDefinitions.find(
      (definition) => definition.id === spouseId,
    );
    if (spouseDefinition === undefined) {
      throw new Error(
        `Cannot read Russian spouse label because spouse id is ${JSON.stringify(spouseId)}.`,
      );
    }
    return getRussianFarmSpouseDisplayName(spouseDefinition.id);
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read spouse label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readFarmCaveLabels(locale: FarmSettingsLocale): readonly [string, string, string] {
  if (locale === "zh") return ["未选择", "蘑菇", "蝙蝠"];
  if (locale === "en") return ["Not chosen", "Mushrooms", "Bats"];
  if (locale === "ja") return ["未選択", "キノコ", "コウモリ"];
  if (locale === "ru") return ["Не выбрано", "Грибы", "Летучие мыши"];
  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read farm cave labels because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readFarmSettingsSectionTitle(
  locale: FarmSettingsLocale,
  section: "spouse" | "cave",
): string {
  if (locale === "zh") return section === "spouse" ? "配偶" : "洞穴";
  if (locale === "en") return section === "spouse" ? "Spouse" : "Cave";
  if (locale === "ja") return section === "spouse" ? "配偶者" : "洞窟";
  if (locale === "ru") return section === "spouse" ? "Супруг" : "Пещера";
  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read farm settings section title because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readUnsupportedFarmSettingsMessage(locale: FarmSettingsLocale): string {
  if (locale === "en" || locale === "zh") {
    return unsupportedFarmSettingsMessage;
  }

  if (locale === "ja") {
    return "このマップには配偶者の庭も農場の洞窟もありません。";
  }

  if (locale === "ru") {
    return "На этой карте нет дворика супруга и фермерской пещеры.";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read unsupported farm settings message because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
