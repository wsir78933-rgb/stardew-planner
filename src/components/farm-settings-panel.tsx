"use client";

import type { ReactNode } from "react";
import { getRussianFarmSpouseDisplayName } from "../i18n/planner-russian-display-names";
import {
  farmSpouseDefinitions,
  supportsFarmCaveChoice,
  supportsFarmSpousePatio,
  type FarmCaveChoice,
  type FarmSpouseId,
} from "../maps/farm-map-rendering";
import {
  setFarmCaveChoice,
  setFarmSpouseId,
  type MapRenderOptions,
} from "../maps/map-render-options";

type FarmSettingsLocale = "en" | "zh" | "ru";

type FarmSettingsPanelProps = Readonly<{
  locale: FarmSettingsLocale;
  selectedMapId: string;
  mapRenderOptions: MapRenderOptions;
  onMapRenderOptionsChange: (nextOptions: MapRenderOptions) => void;
}>;

type FarmSettingsChange = FarmSettingsPanelProps["onMapRenderOptionsChange"];

const farmCaveChoices = ["none", "mushrooms", "bats"] as const satisfies readonly FarmCaveChoice[];

const bilingualUnsupportedFarmSettingsMessage =
  "This map has no spouse patio or farm cave. 这张地图没有配偶庭院或农场洞穴。";

function readFarmSettingsLocale(locale: string): FarmSettingsLocale {
  if (locale === "en" || locale === "zh" || locale === "ru") {
    return locale;
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readUnsupportedFarmSettingsMessage(locale: FarmSettingsLocale): string {
  if (locale === "en" || locale === "zh") {
    return bilingualUnsupportedFarmSettingsMessage;
  }

  if (locale === "ru") {
    return "На этой карте нет дворика супруга и фермерской пещеры.";
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readNoneSpouseLabel(locale: FarmSettingsLocale): string {
  if (locale === "zh") {
    return "无";
  }

  if (locale === "en") {
    return "None";
  }

  if (locale === "ru") {
    return "Нет";
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readSpouseButtonLabel(
  locale: FarmSettingsLocale,
  spouseId: FarmSpouseId,
  englishLabel: string,
): string {
  if (locale === "en" || locale === "zh") {
    return englishLabel;
  }

  if (locale === "ru") {
    return getRussianFarmSpouseDisplayName(spouseId);
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readFarmSettingsSectionTitle(
  locale: FarmSettingsLocale,
  section: "spouse" | "cave",
): string {
  if (section !== "spouse" && section !== "cave") {
    throw new TypeError(
      `Farm settings section must be "spouse" or "cave"; received ${JSON.stringify(section)}.`,
    );
  }

  if (locale === "zh") {
    return section === "spouse" ? "配偶" : "洞穴";
  }

  if (locale === "en") {
    return section === "spouse" ? "Spouse" : "Cave";
  }

  if (locale === "ru") {
    return section === "spouse" ? "Супруг" : "Пещера";
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readCaveLabels(
  locale: FarmSettingsLocale,
): Readonly<Record<FarmCaveChoice, string>> {
  if (locale === "zh") {
    return { none: "未选择", mushrooms: "蘑菇", bats: "蝙蝠" };
  }

  if (locale === "en") {
    return { none: "Not chosen", mushrooms: "Mushrooms", bats: "Bats" };
  }

  if (locale === "ru") {
    return { none: "Не выбрано", mushrooms: "Грибы", bats: "Летучие мыши" };
  }

  throw new TypeError(
    `Farm settings locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
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
        {readNoneSpouseLabel(locale)}
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
          {readSpouseButtonLabel(locale, spouseDefinition.id, spouseDefinition.label)}
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
  const caveLabels = readCaveLabels(locale);

  return (
    <div className="editor-config-chips">
      {farmCaveChoices.map((caveChoice) => (
        <button
          type="button"
          key={caveChoice}
          aria-pressed={selectedCaveChoice === caveChoice}
          onClick={() =>
            onMapRenderOptionsChange(setFarmCaveChoice(mapRenderOptions, caveChoice))
          }
        >
          {caveLabels[caveChoice]}
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
