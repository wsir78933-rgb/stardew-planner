"use client";

import type { ReactNode } from "react";
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

type FarmSettingsLocale = "en" | "zh";

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
  if (locale === "en" || locale === "zh") {
    return locale;
  }

  throw new TypeError(
    `Farm settings locale must be "en" or "zh"; received ${JSON.stringify(locale)}.`,
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
        {locale === "zh" ? "无" : "None"}
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
          {spouseDefinition.label}
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
  const caveLabels =
    locale === "zh"
      ? (["未选择", "蘑菇", "蝙蝠"] as const)
      : (["Not chosen", "Mushrooms", "Bats"] as const);

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
        <FarmSettingsSection title={locale === "zh" ? "配偶" : "Spouse"}>
          <SpousePatioChoices
            locale={locale}
            mapRenderOptions={props.mapRenderOptions}
            onMapRenderOptionsChange={props.onMapRenderOptionsChange}
          />
        </FarmSettingsSection>
      ) : null}
      {showsFarmCave ? (
        <FarmSettingsSection title={locale === "zh" ? "洞穴" : "Cave"}>
          <FarmCaveChoices
            locale={locale}
            mapRenderOptions={props.mapRenderOptions}
            onMapRenderOptionsChange={props.onMapRenderOptionsChange}
          />
        </FarmSettingsSection>
      ) : null}
      {showsSpousePatio || showsFarmCave ? null : (
        <p className="editor-config-label">{unsupportedFarmSettingsMessage}</p>
      )}
    </div>
  );
}
