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
import { farmSpouseDefinitions, supportsFarmCaveChoice, supportsFarmSpousePatio } from "../maps/farm-map-rendering";
import {
  setFarmCaveChoice,
  setFarmSpouseId,
  type MapRenderOptions,
} from "../maps/map-render-options";
import { isNpcPathSupportedMapFile } from "../rendering/npc-paths";
import { getEditorModalCopy, type EditorModalCopy } from "../i18n/editor-modal-copy";
import { MapConfigurationPanel } from "./map-configuration-panel";
import { PlannerReferenceIcon } from "./planner-reference-icon";

type Locale = "en" | "zh";
type BehaviorChange = (option: EditorBehaviorOptionKey, enabled: boolean) => void;

function ConfigSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return <section className="editor-config-section"><h3>{title}</h3>{children}</section>;
}

function OptionSwitch({ locale, label, enabled, onToggle, disabled = false, title, color }: Readonly<{
  locale: Locale; label: string; enabled: boolean; onToggle: () => void; disabled?: boolean; title?: string; color?: string;
}>) {
  return (
    <button className="editor-config-switch" type="button" aria-pressed={enabled} disabled={disabled} onClick={onToggle} title={title}>
      {color ? <span aria-hidden="true" className="editor-config-dot" style={{ background: color }} /> : null}
      <span className="editor-config-switch__label">{label}</span>
      <span aria-hidden="true" className="editor-config-switch__state">{getEditorModalCopy(locale === "zh" ? "zh-CN" : "en").stateLabel(enabled)}</span>
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
  const isChinese = locale === "zh";
  const seasonLabels = isChinese ? ["春季", "夏季", "秋季", "冬季"] : ["Spring", "Summer", "Fall", "Winter"];
  const weatherLabels = isChinese ? ["晴天", "雨天", "雷暴", "绿雨", "下雪"] : ["Clear", "Rain", "Storm", "Green rain", "Snow"];
  return (
    <div className="editor-config-panels">
      <ConfigSection title={isChinese ? "季节" : "Season"}>
        <p className="editor-config-current-season">{seasonLabels[seasons.indexOf(season)]}</p>
        <div className="editor-config-seasons">
          {seasons.map((choice, index) => <button type="button" key={choice} aria-label={seasonLabels[index]} aria-pressed={season === choice} onClick={() => onSeasonChange(choice)}><PlannerReferenceIcon name={seasonIcons[index]} size={22} /></button>)}
        </div>
      </ConfigSection>
      <ConfigSection title={isChinese ? "夜间" : "Night"}>
        <OptionSwitch locale={locale} label={isChinese ? "夜间模式" : "Night mode"} enabled={nightMode} onToggle={onNightModeToggle} />
      </ConfigSection>
      <ConfigSection title={isChinese ? "氛围" : "Atmosphere"}>
        <OptionSwitch locale={locale} label={isChinese ? "夏日云朵" : "Summer clouds"} enabled={ambienceOptions.showClouds} onToggle={() => onAmbienceChange(setPlannerAmbienceClouds(ambienceOptions, !ambienceOptions.showClouds))} />
        <OptionSwitch locale={locale} label={isChinese ? "蝴蝶与飘落物" : "Butterflies & debris"} enabled={ambienceOptions.showDebris} onToggle={() => onAmbienceChange(setPlannerAmbienceDebris(ambienceOptions, !ambienceOptions.showDebris))} />
        <OptionSwitch locale={locale} label={isChinese ? "动画" : "Animations"} enabled={ambienceOptions.animationsEnabled} onToggle={() => onAmbienceChange(setPlannerAmbienceAnimationsEnabled(ambienceOptions, !ambienceOptions.animationsEnabled))} />
      </ConfigSection>
      <ConfigSection title={isChinese ? "天气" : "Weather"}>
        <div className="editor-config-segmented editor-config-weather">
          {weatherChoices.map((choice, index) => <button type="button" key={choice} aria-pressed={ambienceOptions.weather === choice} onClick={() => onAmbienceChange(setPlannerAmbienceWeather(ambienceOptions, choice))}>{weatherLabels[index]}</button>)}
        </div>
      </ConfigSection>
    </div>
  );
}

export function FarmMapConfigPanel({ locale, selectedMapId, mapRenderOptions, onMapRenderOptionsChange }: Readonly<{
  locale: Locale; selectedMapId: string; mapRenderOptions: MapRenderOptions; onMapRenderOptionsChange: (options: MapRenderOptions) => void;
}>) {
  const isChinese = locale === "zh";
  const caveChoices = ["none", "mushrooms", "bats"] as const;
  const caveLabels = isChinese ? ["未选择", "蘑菇", "蝙蝠"] : ["Not chosen", "Mushrooms", "Bats"];
  return (
    <div className="editor-config-panels">
      {supportsFarmSpousePatio(selectedMapId) ? <ConfigSection title={isChinese ? "配偶" : "Spouse"}>
        <div className="editor-config-chips">
          <button type="button" aria-pressed={!mapRenderOptions.farm?.spouseId} onClick={() => onMapRenderOptionsChange(setFarmSpouseId(mapRenderOptions, null))}>{isChinese ? "无" : "None"}</button>
          {farmSpouseDefinitions.map(({ id: spouseId, label }) => <button type="button" key={spouseId} aria-pressed={mapRenderOptions.farm?.spouseId === spouseId} onClick={() => onMapRenderOptionsChange(setFarmSpouseId(mapRenderOptions, spouseId))}>{label}</button>)}
        </div>
      </ConfigSection> : null}
      {supportsFarmCaveChoice(selectedMapId) ? <ConfigSection title={isChinese ? "洞穴" : "Cave"}>
        <div className="editor-config-chips">
          {caveChoices.map((choice, index) => <button type="button" key={choice} aria-pressed={(mapRenderOptions.farm?.caveChoice ?? "none") === choice} onClick={() => onMapRenderOptionsChange(setFarmCaveChoice(mapRenderOptions, choice))}>{caveLabels[index]}</button>)}
        </div>
      </ConfigSection> : null}
      <MapConfigurationPanel selectedMapId={selectedMapId} mapRenderOptions={mapRenderOptions} onMapRenderOptionsChange={onMapRenderOptionsChange} />
    </div>
  );
}

export function ViewConfigPanel({ locale, behaviorOptions, displayOptions, selectedMapId, panelPosition, toolIsZoom, onBehaviorChange, onDisplayToggle, onPanelPositionChange, onZoomToggle, showZoomOption }: Readonly<{
  locale: Locale; behaviorOptions: EditorBehaviorOptions; displayOptions: EditorDisplayOptions; selectedMapId: string; panelPosition: EditorPanelPosition; toolIsZoom: boolean; showZoomOption: boolean;
  onBehaviorChange: BehaviorChange; onDisplayToggle: (option: EditorDisplayOptionKey) => void; onPanelPositionChange: (position: EditorPanelPosition) => void; onZoomToggle: () => void;
}>) {
  const isChinese = locale === "zh";
  const viewCopy = getEditorModalCopy(isChinese ? "zh-CN" : "en").view;
  const rangeKeys = ["showSprinklerRadius", "showScarecrowRadius", "showBeeHouseRadius", "showJunimoHutRadius"] as const;
  const rangeLabels = isChinese ? ["洒水器", "稻草人", "蜂房", "祝尼魔小屋"] : ["Sprinkler", "Scarecrow", "Bee house", "Junimo hut"];
  const colors = ["#08bde4", "#ff591c", "#fbbb21", "#12d960"];
  const blockedKeys = ["showBuildableTiles", "showCropTiles", "showTreeTiles"] as const;
  const blockedLabels = isChinese ? ["建筑", "作物", "树木"] : ["Buildings", "Crops", "Trees"];
  const npcPathsSupported = isNpcPathSupportedMapFile(getPlannerMapById(selectedMapId).mapFile);
  return <div className="editor-config-panels">
    <ConfigSection title={isChinese ? "覆盖范围" : "Ranges"}>{rangeKeys.map((key, index) => <OptionSwitch locale={locale} key={key} color={colors[index]} title={viewCopy.optionGroups[0].options[index + 1].title} label={rangeLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={isChinese ? "辅助线" : "Guides"}>
      <OptionSwitch locale={locale} title={viewCopy.optionGroups[0].options[0].title} label={isChinese ? "网格" : "Grid"} enabled={displayOptions.showGrid} onToggle={() => onDisplayToggle("showGrid")} />
      <OptionSwitch locale={locale} title={isChinese ? "显示地图上的资源巨块生成位置" : "Show resource-clump spawn locations on the map"} label={isChinese ? "资源巨块" : "Resource clumps"} enabled={behaviorOptions.autoShowResourceClumps} onToggle={() => onBehaviorChange("autoShowResourceClumps", !behaviorOptions.autoShowResourceClumps)} />
      <OptionSwitch locale={locale} label={isChinese ? "NPC 路径" : "NPC paths"} enabled={displayOptions.showNpcPaths} disabled={!npcPathsSupported} title={npcPathsSupported ? viewCopy.npcPaths.title : isChinese ? "当前地图没有 NPC 路径数据" : "NPC paths are unavailable on this map"} onToggle={() => onDisplayToggle("showNpcPaths")} />
    </ConfigSection>
    <ConfigSection title={isChinese ? "禁放格" : "Blocked tiles"}>{blockedKeys.map((key, index) => <OptionSwitch locale={locale} key={key} color="#dc1818" title={viewCopy.optionGroups[1].options[index].title} label={blockedLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={isChinese ? "目录位置" : "Catalog position"}><div className="editor-config-segmented">{(["left", "bottom"] as const).map((position) => <button type="button" key={position} aria-pressed={panelPosition === position} onClick={() => onPanelPositionChange(position)}>{position === "left" ? isChinese ? "左侧" : "Left" : isChinese ? "底部" : "Bottom"}</button>)}</div></ConfigSection>
    {showZoomOption ? <ConfigSection title={isChinese ? "画布" : "Canvas"}><OptionSwitch locale={locale} label={isChinese ? "滚轮缩放" : "Wheel zoom"} enabled={toolIsZoom} onToggle={onZoomToggle} /></ConfigSection> : null}
  </div>;
}

export function SettingsConfigPanel({ locale, behaviorOptions, copy, onBehaviorChange }: Readonly<{ locale: Locale; behaviorOptions: EditorBehaviorOptions; copy: EditorModalCopy["settings"]; onBehaviorChange: BehaviorChange }>) {
  const [isConfirmingFreePlacement, setIsConfirmingFreePlacement] = useState(false);
  const isChinese = locale === "zh";
  function toggleFreePlacement() {
    if (behaviorOptions.freePlacement) { onBehaviorChange("freePlacement", false); return; }
    setIsConfirmingFreePlacement(true);
  }
  return <div className="editor-config-panels">
    <ConfigSection title={isChinese ? "界面" : "Interface"}>
      <p className="editor-config-label">{isChinese ? "光标" : "Cursor"}</p>
      <div className="editor-config-segmented">{([false, true] as const).map((enabled) => <button type="button" key={String(enabled)} title={copy.optionGroups[2].options[0].title} aria-pressed={behaviorOptions.gameCursors === enabled} onClick={() => onBehaviorChange("gameCursors", enabled)}>{enabled ? isChinese ? "游戏" : "Game" : isChinese ? "系统" : "System"}</button>)}</div>
      <OptionSwitch locale={locale} title={copy.optionGroups[1].options[0].title} label={isChinese ? "提示通知" : "Toast notifications"} enabled={behaviorOptions.showToasts} onToggle={() => onBehaviorChange("showToasts", !behaviorOptions.showToasts)} />
    </ConfigSection>
    <ConfigSection title={copy.placementHeading}>
      <OptionSwitch locale={locale} label={copy.freePlacement.label} enabled={behaviorOptions.freePlacement} onToggle={toggleFreePlacement} title={copy.freePlacement.title} />
      {isConfirmingFreePlacement ? <div className="editor-modal__free-placement-warning" role="alert"><p>{copy.freePlacementWarning}</p><div><button type="button" onClick={() => setIsConfirmingFreePlacement(false)}>{copy.warningActions.cancel}</button><button type="button" onClick={() => { onBehaviorChange("freePlacement", true); setIsConfirmingFreePlacement(false); }}>{copy.warningActions.confirm}</button></div></div> : null}
    </ConfigSection>
    <ConfigSection title={isChinese ? "触屏" : "Touch controls"}>
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[0].title} label={isChinese ? "显示摇杆" : "Show joystick"} enabled={behaviorOptions.showJoystick} onToggle={() => onBehaviorChange("showJoystick", !behaviorOptions.showJoystick)} />
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[1].title} label={isChinese ? "左手模式" : "Left-hand mode"} enabled={behaviorOptions.leftHandMode} onToggle={() => onBehaviorChange("leftHandMode", !behaviorOptions.leftHandMode)} />
    </ConfigSection>
    <div className="editor-config-legal"><a href={copy.privacyPolicy.href} target="_blank" rel="noreferrer">{copy.privacyPolicy.label}</a><span aria-hidden="true"> · </span><a href={copy.termsOfService.href} target="_blank" rel="noreferrer">{copy.termsOfService.label}</a></div>
  </div>;
}
