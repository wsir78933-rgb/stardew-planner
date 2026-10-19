"use client";

import { useState, type ReactNode } from "react";
import type { HomepageLocale, PlannerChromeLocale } from "@/src/homepage/homepage-locale";
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

type Locale = PlannerChromeLocale;
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
      <span aria-hidden="true" className="editor-config-switch__state">{getEditorModalCopy(readEditorModalHomepageLocale(locale)).stateLabel(enabled)}</span>
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
  const seasonLabels = readConfigLabels(locale, {
    en: ["Spring", "Summer", "Fall", "Winter"],
    ru: ["Весна", "Лето", "Осень", "Зима"],
    zh: ["春季", "夏季", "秋季", "冬季"],
    ja: ["春", "夏", "秋", "冬"],
  });
  const weatherLabels = readConfigLabels(locale, {
    en: ["Clear", "Rain", "Storm", "Green rain", "Snow"],
    ru: ["Ясно", "Дождь", "Гроза", "Зелёный дождь", "Снег"],
    zh: ["晴天", "雨天", "雷暴", "绿雨", "下雪"],
    ja: ["晴れ", "雨", "嵐", "緑の雨", "雪"],
  });
  return (
    <div className="editor-config-panels">
      <ConfigSection title={readConfigLabel(locale, { en: "Season", zh: "季节", ja: "季節", ru: "Сезон" })}>
        <p className="editor-config-current-season">{seasonLabels[seasons.indexOf(season)]}</p>
        <div className="editor-config-seasons">
          {seasons.map((choice, index) => <button type="button" key={choice} aria-label={seasonLabels[index]} aria-pressed={season === choice} onClick={() => onSeasonChange(choice)}><PlannerReferenceIcon name={seasonIcons[index]} size={22} /></button>)}
        </div>
      </ConfigSection>
      <ConfigSection title={readConfigLabel(locale, { en: "Night", zh: "夜间", ja: "夜", ru: "Ночь" })}>
        <OptionSwitch locale={locale} label={readConfigLabel(locale, { en: "Night mode", zh: "夜间模式", ja: "夜間モード", ru: "Ночной режим" })} enabled={nightMode} onToggle={onNightModeToggle} />
      </ConfigSection>
      <ConfigSection title={readConfigLabel(locale, { en: "Atmosphere", zh: "氛围", ja: "雰囲気", ru: "Атмосфера" })}>
        <OptionSwitch locale={locale} label={readConfigLabel(locale, { en: "Summer clouds", zh: "夏日云朵", ja: "夏の雲", ru: "Летние облака" })} enabled={ambienceOptions.showClouds} onToggle={() => onAmbienceChange(setPlannerAmbienceClouds(ambienceOptions, !ambienceOptions.showClouds))} />
        <OptionSwitch locale={locale} label={readConfigLabel(locale, { en: "Butterflies & debris", zh: "蝴蝶与飘落物", ja: "蝶と落ち葉", ru: "Бабочки и падающие частицы" })} enabled={ambienceOptions.showDebris} onToggle={() => onAmbienceChange(setPlannerAmbienceDebris(ambienceOptions, !ambienceOptions.showDebris))} />
        <OptionSwitch locale={locale} label={readConfigLabel(locale, { en: "Animations", zh: "动画", ja: "アニメーション", ru: "Анимация" })} enabled={ambienceOptions.animationsEnabled} onToggle={() => onAmbienceChange(setPlannerAmbienceAnimationsEnabled(ambienceOptions, !ambienceOptions.animationsEnabled))} />
      </ConfigSection>
      <ConfigSection title={readConfigLabel(locale, { en: "Weather", zh: "天气", ja: "天気", ru: "Погода" })}>
        <div className="editor-config-segmented editor-config-weather">
          {weatherChoices.map((choice, index) => <button type="button" key={choice} aria-pressed={ambienceOptions.weather === choice} onClick={() => onAmbienceChange(setPlannerAmbienceWeather(ambienceOptions, choice))}>{weatherLabels[index]}</button>)}
        </div>
      </ConfigSection>
    </div>
  );
}

export function ViewConfigPanel({ locale, behaviorOptions, displayOptions, selectedMapId, panelPosition, onBehaviorChange, onDisplayToggle, onPanelPositionChange }: Readonly<{
  locale: Locale; behaviorOptions: EditorBehaviorOptions; displayOptions: EditorDisplayOptions; selectedMapId: string; panelPosition: EditorPanelPosition;
  onBehaviorChange: BehaviorChange; onDisplayToggle: (option: EditorDisplayOptionKey) => void; onPanelPositionChange: (position: EditorPanelPosition) => void;
}>) {
  const viewCopy = getEditorModalCopy(readEditorModalHomepageLocale(locale)).view;
  const rangeKeys = ["showSprinklerRadius", "showScarecrowRadius", "showBeeHouseRadius", "showJunimoHutRadius"] as const;
  const rangeLabels = readConfigLabels(locale, {
    en: ["Sprinkler", "Scarecrow", "Bee house", "Junimo hut"],
    ru: ["Разбрызгиватель", "Пугало", "Пчелиный домик", "Хижина джунимо"],
    zh: ["洒水器", "稻草人", "蜂房", "祝尼魔小屋"],
    ja: ["スプリンクラー", "かかし", "ハチの巣箱", "ジュニモ小屋"],
  });
  const colors = ["#08bde4", "#ff591c", "#fbbb21", "#12d960"];
  const blockedKeys = ["showBuildableTiles", "showCropTiles", "showTreeTiles"] as const;
  const blockedLabels = readConfigLabels(locale, {
    en: ["Buildings", "Crops", "Trees"],
    ru: ["Постройки", "Культуры", "Деревья"],
    zh: ["建筑", "作物", "树木"],
    ja: ["建物", "作物", "樹木"],
  });
  const npcPathsSupported = isNpcPathSupportedMapFile(getPlannerMapById(selectedMapId).mapFile);
  return <div className="editor-config-panels">
    <ConfigSection title={readConfigLabel(locale, { en: "Ranges", zh: "覆盖范围", ja: "範囲", ru: "Радиусы" })}>{rangeKeys.map((key, index) => <OptionSwitch locale={locale} key={key} color={colors[index]} title={viewCopy.optionGroups[0].options[index + 1].title} label={rangeLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={readConfigLabel(locale, { en: "Guides", zh: "辅助线", ja: "ガイド", ru: "Направляющие" })}>
      <OptionSwitch locale={locale} title={viewCopy.optionGroups[0].options[0].title} label={readConfigLabel(locale, { en: "Grid", zh: "网格", ja: "グリッド", ru: "Сетка" })} enabled={displayOptions.showGrid} onToggle={() => onDisplayToggle("showGrid")} />
      <OptionSwitch locale={locale} title={readConfigLabel(locale, { en: "Show resource-clump spawn locations on the map", zh: "显示地图上的资源巨块生成位置", ja: "マップ上の資源の塊の出現位置を表示", ru: "Показать на карте места появления крупных ресурсов" })} label={readConfigLabel(locale, { en: "Resource clumps", zh: "资源巨块", ja: "資源の塊", ru: "Крупные ресурсы" })} enabled={behaviorOptions.autoShowResourceClumps} onToggle={() => onBehaviorChange("autoShowResourceClumps", !behaviorOptions.autoShowResourceClumps)} />
      <OptionSwitch locale={locale} label={readConfigLabel(locale, { en: "NPC paths", zh: "NPC 路径", ja: "NPCの経路", ru: "Пути NPC" })} enabled={displayOptions.showNpcPaths} disabled={!npcPathsSupported} title={npcPathsSupported ? viewCopy.npcPaths.title : readConfigLabel(locale, { en: "NPC paths are unavailable on this map", zh: "当前地图没有 NPC 路径数据", ja: "このマップにはNPCの経路データがありません", ru: "На этой карте нет данных о путях NPC" })} onToggle={() => onDisplayToggle("showNpcPaths")} />
    </ConfigSection>
    <ConfigSection title={readConfigLabel(locale, { en: "Blocked tiles", zh: "禁放格", ja: "設置できないマス", ru: "Заблокированные клетки" })}>{blockedKeys.map((key, index) => <OptionSwitch locale={locale} key={key} color="#dc1818" title={viewCopy.optionGroups[1].options[index].title} label={blockedLabels[index]} enabled={displayOptions[key]} onToggle={() => onDisplayToggle(key)} />)}</ConfigSection>
    <ConfigSection title={readConfigLabel(locale, { en: "Catalog position", zh: "目录位置", ja: "カタログの位置", ru: "Положение каталога" })}><div className="editor-config-segmented">{(["left", "bottom"] as const).map((position) => <button type="button" key={position} aria-pressed={panelPosition === position} onClick={() => onPanelPositionChange(position)}>{position === "left" ? readConfigLabel(locale, { en: "Left", zh: "左侧", ja: "左", ru: "Слева" }) : readConfigLabel(locale, { en: "Bottom", zh: "底部", ja: "下", ru: "Снизу" })}</button>)}</div></ConfigSection>
  </div>;
}

export function SettingsConfigPanel({ locale, behaviorOptions, copy, onBehaviorChange }: Readonly<{ locale: Locale; behaviorOptions: EditorBehaviorOptions; copy: EditorModalCopy["settings"]; onBehaviorChange: BehaviorChange }>) {
  const [isConfirmingFreePlacement, setIsConfirmingFreePlacement] = useState(false);
  function toggleFreePlacement() {
    if (behaviorOptions.freePlacement) { onBehaviorChange("freePlacement", false); return; }
    setIsConfirmingFreePlacement(true);
  }
  return <div className="editor-config-panels">
    <ConfigSection title={readConfigLabel(locale, { en: "Interface", zh: "界面", ja: "インターフェース", ru: "Интерфейс" })}>
      <p className="editor-config-label">{readConfigLabel(locale, { en: "Cursor", zh: "光标", ja: "カーソル", ru: "Курсор" })}</p>
      <div className="editor-config-segmented">{([false, true] as const).map((enabled) => <button type="button" key={String(enabled)} title={copy.optionGroups[2].options[0].title} aria-pressed={behaviorOptions.gameCursors === enabled} onClick={() => onBehaviorChange("gameCursors", enabled)}>{enabled ? readConfigLabel(locale, { en: "Game", zh: "游戏", ja: "ゲーム", ru: "Игра" }) : readConfigLabel(locale, { en: "System", zh: "系统", ja: "システム", ru: "Система" })}</button>)}</div>
      <OptionSwitch locale={locale} title={copy.optionGroups[1].options[0].title} label={readConfigLabel(locale, { en: "Toast notifications", zh: "提示通知", ja: "通知", ru: "Всплывающие уведомления" })} enabled={behaviorOptions.showToasts} onToggle={() => onBehaviorChange("showToasts", !behaviorOptions.showToasts)} />
    </ConfigSection>
    <ConfigSection title={copy.placementHeading}>
      <OptionSwitch locale={locale} label={copy.freePlacement.label} enabled={behaviorOptions.freePlacement} onToggle={toggleFreePlacement} title={copy.freePlacement.title} />
      {isConfirmingFreePlacement ? <div className="editor-modal__free-placement-warning" role="alert"><p>{copy.freePlacementWarning}</p><div><button type="button" onClick={() => setIsConfirmingFreePlacement(false)}>{copy.warningActions.cancel}</button><button type="button" onClick={() => { onBehaviorChange("freePlacement", true); setIsConfirmingFreePlacement(false); }}>{copy.warningActions.confirm}</button></div></div> : null}
    </ConfigSection>
    <ConfigSection title={readConfigLabel(locale, { en: "Touch controls", zh: "触屏", ja: "タッチ操作", ru: "Сенсорное управление" })}>
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[0].title} label={readConfigLabel(locale, { en: "Show joystick", zh: "显示摇杆", ja: "ジョイスティックを表示", ru: "Показать джойстик" })} enabled={behaviorOptions.showJoystick} onToggle={() => onBehaviorChange("showJoystick", !behaviorOptions.showJoystick)} />
      <OptionSwitch locale={locale} title={copy.optionGroups[0].options[1].title} label={readConfigLabel(locale, { en: "Left-hand mode", zh: "左手模式", ja: "左手モード", ru: "Режим левой руки" })} enabled={behaviorOptions.leftHandMode} onToggle={() => onBehaviorChange("leftHandMode", !behaviorOptions.leftHandMode)} />
    </ConfigSection>
    <div className="editor-config-legal"><a href={copy.privacyPolicy.href} target="_blank" rel="noreferrer">{copy.privacyPolicy.label}</a><span aria-hidden="true"> · </span><a href={copy.termsOfService.href} target="_blank" rel="noreferrer">{copy.termsOfService.label}</a></div>
  </div>;
}

function readEditorModalHomepageLocale(locale: Locale): HomepageLocale {
  if (locale === "en") return "en";
  if (locale === "zh") return "zh-CN";
  if (locale === "ja") return "ja";
  if (locale === "ru") return "ru";
  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Editor config locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readConfigLabel(
  locale: Locale,
  labels: Readonly<Record<Locale, string>>,
): string {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return labels[locale];
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Editor config locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readConfigLabels(
  locale: Locale,
  labels: Readonly<Record<Locale, readonly string[]>>,
): readonly string[] {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return labels[locale];
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Editor config locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(unsupportedLocale)}.`,
  );
}
