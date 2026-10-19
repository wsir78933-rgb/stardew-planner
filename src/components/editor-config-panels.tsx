"use client";

import { useState, type ReactNode } from "react";
import type { EditorBehaviorOptionKey, EditorBehaviorOptions } from "../editor/editor-behavior-options";
import type { EditorDisplayOptionKey, EditorDisplayOptions } from "../editor/editor-display-options";
import type { EditorPanelPosition } from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  setPlannerAmbienceAnimationsEnabled,
  setPlannerAmbienceClouds,
  setPlannerAmbienceDebris,
  setPlannerAmbienceWeather,
  type PlannerAmbienceOptions,
  type PlannerAmbienceWeather,
} from "../editor/planner-ambience-options";
import { getPlannerMapById } from "../maps/map-catalog";
import { isNpcPathSupportedMapFile } from "../rendering/npc-paths";
import { getEditorModalCopy, type EditorModalCopy } from "../i18n/editor-modal-copy";
import { PlannerReferenceIcon } from "./planner-reference-icon";

type Locale = "en" | "zh" | "ru";
type BehaviorChange = (option: EditorBehaviorOptionKey, enabled: boolean) => void;
type EditorModalCopyLocale = "en" | "zh-CN" | "ru";

type EditorConfigPanelCopy = Readonly<{
  season: string;
  seasonLabels: Readonly<Record<TilesheetSeason, string>>;
  night: string;
  nightMode: string;
  atmosphere: string;
  summerClouds: string;
  butterfliesAndDebris: string;
  animations: string;
  weather: string;
  weatherLabels: Readonly<Record<PlannerAmbienceWeather, string>>;
  ranges: string;
  rangeLabels: readonly [string, string, string, string];
  guides: string;
  grid: string;
  resourceClumps: string;
  resourceClumpsTitle: string;
  npcPaths: string;
  npcPathsUnavailable: string;
  blockedTiles: string;
  blockedLabels: readonly [string, string, string];
  catalogPosition: string;
  left: string;
  bottom: string;
  interfaceHeading: string;
  cursor: string;
  gameCursor: string;
  systemCursor: string;
  toastNotifications: string;
  touchControls: string;
  showJoystick: string;
  leftHandMode: string;
}>;

const editorConfigPanelCopyByLocale = {
  en: {
    season: "Season",
    seasonLabels: { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" },
    night: "Night",
    nightMode: "Night mode",
    atmosphere: "Atmosphere",
    summerClouds: "Summer clouds",
    butterfliesAndDebris: "Butterflies & debris",
    animations: "Animations",
    weather: "Weather",
    weatherLabels: { clear: "Clear", rain: "Rain", storm: "Storm", "green-rain": "Green rain", snow: "Snow" },
    ranges: "Ranges",
    rangeLabels: ["Sprinkler", "Scarecrow", "Bee house", "Junimo hut"],
    guides: "Guides",
    grid: "Grid",
    resourceClumps: "Resource clumps",
    resourceClumpsTitle: "Show resource-clump spawn locations on the map",
    npcPaths: "NPC paths",
    npcPathsUnavailable: "NPC paths are unavailable on this map",
    blockedTiles: "Blocked tiles",
    blockedLabels: ["Buildings", "Crops", "Trees"],
    catalogPosition: "Catalog position",
    left: "Left",
    bottom: "Bottom",
    interfaceHeading: "Interface",
    cursor: "Cursor",
    gameCursor: "Game",
    systemCursor: "System",
    toastNotifications: "Toast notifications",
    touchControls: "Touch controls",
    showJoystick: "Show joystick",
    leftHandMode: "Left-hand mode",
  },
  zh: {
    season: "季节",
    seasonLabels: { spring: "春季", summer: "夏季", fall: "秋季", winter: "冬季" },
    night: "夜间",
    nightMode: "夜间模式",
    atmosphere: "氛围",
    summerClouds: "夏日云朵",
    butterfliesAndDebris: "蝴蝶与飘落物",
    animations: "动画",
    weather: "天气",
    weatherLabels: { clear: "晴天", rain: "雨天", storm: "雷暴", "green-rain": "绿雨", snow: "下雪" },
    ranges: "覆盖范围",
    rangeLabels: ["洒水器", "稻草人", "蜂房", "祝尼魔小屋"],
    guides: "辅助线",
    grid: "网格",
    resourceClumps: "资源巨块",
    resourceClumpsTitle: "显示地图上的资源巨块生成位置",
    npcPaths: "NPC 路径",
    npcPathsUnavailable: "当前地图没有 NPC 路径数据",
    blockedTiles: "禁放格",
    blockedLabels: ["建筑", "作物", "树木"],
    catalogPosition: "目录位置",
    left: "左侧",
    bottom: "底部",
    interfaceHeading: "界面",
    cursor: "光标",
    gameCursor: "游戏",
    systemCursor: "系统",
    toastNotifications: "提示通知",
    touchControls: "触屏",
    showJoystick: "显示摇杆",
    leftHandMode: "左手模式",
  },
  ru: {
    season: "Сезон",
    seasonLabels: { spring: "Весна", summer: "Лето", fall: "Осень", winter: "Зима" },
    night: "Ночь",
    nightMode: "Ночной режим",
    atmosphere: "Атмосфера",
    summerClouds: "Летние облака",
    butterfliesAndDebris: "Бабочки и падающие частицы",
    animations: "Анимация",
    weather: "Погода",
    weatherLabels: { clear: "Ясно", rain: "Дождь", storm: "Гроза", "green-rain": "Зелёный дождь", snow: "Снег" },
    ranges: "Радиусы",
    rangeLabels: ["Разбрызгиватель", "Пугало", "Пчелиный домик", "Хижина джунимо"],
    guides: "Направляющие",
    grid: "Сетка",
    resourceClumps: "Крупные ресурсы",
    resourceClumpsTitle: "Показать на карте места появления крупных ресурсов",
    npcPaths: "Пути NPC",
    npcPathsUnavailable: "На этой карте нет данных о путях NPC",
    blockedTiles: "Заблокированные клетки",
    blockedLabels: ["Постройки", "Культуры", "Деревья"],
    catalogPosition: "Положение каталога",
    left: "Слева",
    bottom: "Снизу",
    interfaceHeading: "Интерфейс",
    cursor: "Курсор",
    gameCursor: "Игра",
    systemCursor: "Система",
    toastNotifications: "Всплывающие уведомления",
    touchControls: "Сенсорное управление",
    showJoystick: "Показать джойстик",
    leftHandMode: "Режим левой руки",
  },
} as const satisfies Readonly<Record<Locale, EditorConfigPanelCopy>>;

function readEditorConfigLocale(locale: string): Locale {
  if (locale === "en" || locale === "zh" || locale === "ru") {
    return locale;
  }

  throw new TypeError(
    `Editor config locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readEditorConfigPanelCopy(locale: Locale): EditorConfigPanelCopy {
  const editorConfigLocale = readEditorConfigLocale(locale);
  return editorConfigPanelCopyByLocale[editorConfigLocale];
}

function readEditorModalCopyLocale(locale: Locale): EditorModalCopyLocale {
  if (locale === "en") {
    return "en";
  }

  if (locale === "zh") {
    return "zh-CN";
  }

  if (locale === "ru") {
    return "ru";
  }

  throw new TypeError(
    `Editor config locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readSeasonLabel(
  seasonLabels: Readonly<Record<TilesheetSeason, string>>,
  season: TilesheetSeason,
): string {
  const seasonLabel = seasonLabels[season];
  if (seasonLabel === undefined || seasonLabel.length === 0) {
    throw new Error(
      `Editor config is missing a season label for ${JSON.stringify(season)}.`,
    );
  }

  return seasonLabel;
}

function readWeatherLabel(
  weatherLabels: Readonly<Record<PlannerAmbienceWeather, string>>,
  weather: PlannerAmbienceWeather,
): string {
  const weatherLabel = weatherLabels[weather];
  if (weatherLabel === undefined || weatherLabel.length === 0) {
    throw new Error(
      `Editor config is missing a weather label for ${JSON.stringify(weather)}.`,
    );
  }

  return weatherLabel;
}

function ConfigSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return <section className="editor-config-section"><h3>{title}</h3>{children}</section>;
}

function OptionSwitch({ locale, label, enabled, onToggle, disabled = false, title, color }: Readonly<{
  locale: Locale; label: string; enabled: boolean; onToggle: () => void; disabled?: boolean; title?: string; color?: string;
}>) {
  const editorConfigLocale = readEditorConfigLocale(locale);
  return (
    <button className="editor-config-switch" type="button" aria-pressed={enabled} disabled={disabled} onClick={onToggle} title={title}>
      {color ? <span aria-hidden="true" className="editor-config-dot" style={{ background: color }} /> : null}
      <span className="editor-config-switch__label">{label}</span>
      <span aria-hidden="true" className="editor-config-switch__state">{getEditorModalCopy(readEditorModalCopyLocale(editorConfigLocale)).stateLabel(enabled)}</span>
      <span aria-hidden="true" className="editor-config-switch__track"><span /></span>
    </button>
  );
}

const seasons: readonly TilesheetSeason[] = ["spring", "summer", "fall", "winter"];
const seasonIcons = ["SeasonSpring", "SeasonSummer", "SeasonFall", "SeasonWinter"] as const;
const weatherChoices: readonly PlannerAmbienceWeather[] = ["clear", "rain", "storm", "green-rain", "snow"];

export function AmbienceConfigPanel({ locale, season, ambienceOptions, nightMode, onSeasonChange, onAmbienceChange, onNightModeToggle }: Readonly<{
  locale: Locale; season: TilesheetSeason; ambienceOptions: PlannerAmbienceOptions; nightMode: boolean;
  onSeasonChange: (season: TilesheetSeason) => void; onAmbienceChange: (options: PlannerAmbienceOptions) => void; onNightModeToggle: () => void;
}>) {
  const copy = readEditorConfigPanelCopy(locale);
  return (
    <div className="editor-config-panels">
      <ConfigSection title={copy.season}>
        <p className="editor-config-current-season">{readSeasonLabel(copy.seasonLabels, season)}</p>
        <div className="editor-config-seasons">
          {seasons.map((choice) => <button type="button" key={choice} aria-label={readSeasonLabel(copy.seasonLabels, choice)} aria-pressed={season === choice} onClick={() => onSeasonChange(choice)}><PlannerReferenceIcon name={seasonIcons[seasons.indexOf(choice)]} size={22} /></button>)}
        </div>
      </ConfigSection>
      <ConfigSection title={copy.night}>
        <OptionSwitch locale={locale} label={copy.nightMode} enabled={nightMode} onToggle={onNightModeToggle} />
      </ConfigSection>
      <ConfigSection title={copy.atmosphere}>
        <OptionSwitch locale={locale} label={copy.summerClouds} enabled={ambienceOptions.showClouds} onToggle={() => onAmbienceChange(setPlannerAmbienceClouds(ambienceOptions, !ambienceOptions.showClouds))} />
        <OptionSwitch locale={locale} label={copy.butterfliesAndDebris} enabled={ambienceOptions.showDebris} onToggle={() => onAmbienceChange(setPlannerAmbienceDebris(ambienceOptions, !ambienceOptions.showDebris))} />
        <OptionSwitch locale={locale} label={copy.animations} enabled={ambienceOptions.animationsEnabled} onToggle={() => onAmbienceChange(setPlannerAmbienceAnimationsEnabled(ambienceOptions, !ambienceOptions.animationsEnabled))} />
      </ConfigSection>
      <ConfigSection title={copy.weather}>
        <div className="editor-config-segmented editor-config-weather">
          {weatherChoices.map((choice) => <button type="button" key={choice} aria-pressed={ambienceOptions.weather === choice} onClick={() => onAmbienceChange(setPlannerAmbienceWeather(ambienceOptions, choice))}>{readWeatherLabel(copy.weatherLabels, choice)}</button>)}
        </div>
      </ConfigSection>
    </div>
  );
}

export function ViewConfigPanel({ locale, behaviorOptions, displayOptions, selectedMapId, panelPosition, onBehaviorChange, onDisplayToggle, onPanelPositionChange }: Readonly<{
  locale: Locale; behaviorOptions: EditorBehaviorOptions; displayOptions: EditorDisplayOptions; selectedMapId: string; panelPosition: EditorPanelPosition;
  onBehaviorChange: BehaviorChange; onDisplayToggle: (option: EditorDisplayOptionKey) => void; onPanelPositionChange: (position: EditorPanelPosition) => void;
}>) {
  const editorConfigLocale = readEditorConfigLocale(locale);
  const copy = readEditorConfigPanelCopy(editorConfigLocale);
  const viewCopy = getEditorModalCopy(readEditorModalCopyLocale(editorConfigLocale)).view;
  const rangeKeys = ["showSprinklerRadius", "showScarecrowRadius", "showBeeHouseRadius", "showJunimoHutRadius"] as const;
  const colors = ["#08bde4", "#ff591c", "#fbbb21", "#12d960"];
  const blockedKeys = ["showBuildableTiles", "showCropTiles", "showTreeTiles"] as const;
  const npcPathsSupported = isNpcPathSupportedMapFile(getPlannerMapById(selectedMapId).mapFile);
  return <div className="editor-config-panels">
    <ConfigSection title={copy.ranges}>{rangeKeys.map((key, index) => <OptionSwitch locale={editorConfigLocale} key={key} color={colors[index]} title={viewCopy.optionGroups[0].options[index + 1].title} label={copy.rangeLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={copy.guides}>
      <OptionSwitch locale={editorConfigLocale} title={viewCopy.optionGroups[0].options[0].title} label={copy.grid} enabled={displayOptions.showGrid} onToggle={() => onDisplayToggle("showGrid")} />
      <OptionSwitch locale={editorConfigLocale} title={copy.resourceClumpsTitle} label={copy.resourceClumps} enabled={behaviorOptions.autoShowResourceClumps} onToggle={() => onBehaviorChange("autoShowResourceClumps", !behaviorOptions.autoShowResourceClumps)} />
      <OptionSwitch locale={editorConfigLocale} label={copy.npcPaths} enabled={displayOptions.showNpcPaths} disabled={!npcPathsSupported} title={npcPathsSupported ? viewCopy.npcPaths.title : copy.npcPathsUnavailable} onToggle={() => onDisplayToggle("showNpcPaths")} />
    </ConfigSection>
    <ConfigSection title={copy.blockedTiles}>{blockedKeys.map((key, index) => <OptionSwitch locale={editorConfigLocale} key={key} color="#dc1818" title={viewCopy.optionGroups[1].options[index].title} label={copy.blockedLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={copy.catalogPosition}><div className="editor-config-segmented">{(["left", "bottom"] as const).map((position) => <button type="button" key={position} aria-pressed={panelPosition === position} onClick={() => onPanelPositionChange(position)}>{position === "left" ? copy.left : copy.bottom}</button>)}</div></ConfigSection>
  </div>;
}

export function SettingsConfigPanel({ locale, behaviorOptions, copy, onBehaviorChange }: Readonly<{ locale: Locale; behaviorOptions: EditorBehaviorOptions; copy: EditorModalCopy["settings"]; onBehaviorChange: BehaviorChange }>) {
  const [isConfirmingFreePlacement, setIsConfirmingFreePlacement] = useState(false);
  const panelCopy = readEditorConfigPanelCopy(locale);
  function toggleFreePlacement() {
    if (behaviorOptions.freePlacement) { onBehaviorChange("freePlacement", false); return; }
    setIsConfirmingFreePlacement(true);
  }
  return <div className="editor-config-panels">
    <ConfigSection title={panelCopy.interfaceHeading}>
      <p className="editor-config-label">{panelCopy.cursor}</p>
      <div className="editor-config-segmented">{([false, true] as const).map((enabled) => <button type="button" key={String(enabled)} title={copy.optionGroups[2].options[0].title} aria-pressed={behaviorOptions.gameCursors === enabled} onClick={() => onBehaviorChange("gameCursors", enabled)}>{enabled ? panelCopy.gameCursor : panelCopy.systemCursor}</button>)}</div>
      <OptionSwitch locale={locale} title={copy.optionGroups[1].options[0].title} label={panelCopy.toastNotifications} enabled={behaviorOptions.showToasts} onToggle={() => onBehaviorChange("showToasts", !behaviorOptions.showToasts)} />
    </ConfigSection>
    <ConfigSection title={copy.placementHeading}>
      <OptionSwitch locale={locale} label={copy.freePlacement.label} enabled={behaviorOptions.freePlacement} onToggle={toggleFreePlacement} title={copy.freePlacement.title} />
      {isConfirmingFreePlacement ? <div className="editor-modal__free-placement-warning" role="alert"><p>{copy.freePlacementWarning}</p><div><button type="button" onClick={() => setIsConfirmingFreePlacement(false)}>{copy.warningActions.cancel}</button><button type="button" onClick={() => { onBehaviorChange("freePlacement", true); setIsConfirmingFreePlacement(false); }}>{copy.warningActions.confirm}</button></div></div> : null}
    </ConfigSection>
    <ConfigSection title={panelCopy.touchControls}>
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[0].title} label={panelCopy.showJoystick} enabled={behaviorOptions.showJoystick} onToggle={() => onBehaviorChange("showJoystick", !behaviorOptions.showJoystick)} />
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[1].title} label={panelCopy.leftHandMode} enabled={behaviorOptions.leftHandMode} onToggle={() => onBehaviorChange("leftHandMode", !behaviorOptions.leftHandMode)} />
    </ConfigSection>
    <div className="editor-config-legal"><a href={copy.privacyPolicy.href} target="_blank" rel="noreferrer">{copy.privacyPolicy.label}</a><span aria-hidden="true"> · </span><a href={copy.termsOfService.href} target="_blank" rel="noreferrer">{copy.termsOfService.label}</a></div>
  </div>;
}
