"use client";

import { fishPondWaterColors, paintableChestPalette } from "../catalog";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { readSelectionEntityDisplayName } from "@/src/homepage/japanese-game-display-labels";
import type { BuildingPaintColors } from "../paint/building-paint";
import { Copy, MoreHorizontal, Trash2, X } from "lucide-react";
import { usePlannerChromeLocale } from "@/src/i18n/planner-chrome-locale";

type SingleSelectionInspectorActionProperties = Readonly<{
  kind: "single";
  onCopy: () => void;
  onDelete: () => void;
  onDismiss: () => void;
  onCycleAppearance: () => void;
}>;

type SelectedItemInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      onNightLightStateChange: (nightLightState: "off" | undefined) => void;
      onTintChange: (tintColor: string) => void;
      selection: Readonly<{
        canCycleAppearance: boolean;
        canPaint?: boolean;
        catalogDisplayName?: string;
        entityName: string;
        isNightLight: boolean;
        kind: "item";
        nightLightState: "off" | undefined;
        tintColor: string;
      }>;
    }>;

type PaintableBuildingInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      onBuildingPaintChange: (paintColors: BuildingPaintColors) => void;
      selection: Readonly<{
        canCycleAppearance: false;
        canPaint: true;
        canSetWaterColor?: false;
        catalogDisplayName?: string;
        entityName: string;
        kind: "building";
        paintColors: BuildingPaintColors;
      }>;
    }>;

type NonPaintableBuildingInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      selection: Readonly<{
        canCycleAppearance: boolean;
        canPaint: false;
        canSetWaterColor?: false;
        catalogDisplayName?: string;
        entityName: string;
        kind: "building";
      }>;
    }>;

type FishPondWaterBuildingInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      onBuildingWaterColorChange: (waterColor: number | undefined) => void;
      selection: Readonly<{
        canCycleAppearance: boolean;
        canPaint: false;
        canSetWaterColor: true;
        catalogDisplayName?: string;
        entityName: string;
        kind: "building";
        waterColor: number | undefined;
      }>;
    }>;

type SelectedCropInspectorProperties = SingleSelectionInspectorActionProperties &
  Readonly<{
    selection: Readonly<{
      canCycleAppearance: false;
      catalogDisplayName?: string;
      entityName: string;
      kind: "crop";
    }>;
  }>;

type SingleSelectionInspectorProperties =
  | SelectedItemInspectorProperties
  | PaintableBuildingInspectorProperties
  | FishPondWaterBuildingInspectorProperties
  | NonPaintableBuildingInspectorProperties
  | SelectedCropInspectorProperties;

type MultipleSelectionInspectorProperties = Readonly<{
  kind: "multiple";
  onCopy: () => void;
  onDelete: () => void;
  onDismiss: () => void;
  selection: Readonly<{
    count: number;
  }>;
}>;

type SelectionInspectorProperties =
  | SingleSelectionInspectorProperties
  | MultipleSelectionInspectorProperties;

export function SelectionInspector(
  selectionInspectorProperties: SelectionInspectorProperties,
) {
  const selectionLocale = usePlannerChromeLocale();
  const selectionCopy = readSelectionInspectorCopy(selectionLocale);

  if (selectionInspectorProperties.kind === "single") {
    const { onCopy, onCycleAppearance, onDelete, onDismiss, selection } =
      selectionInspectorProperties;
    const selectedPlacementTitle = readSelectionEntityDisplayName(
      selectionLocale,
      selection.entityName,
      selection.catalogDisplayName,
    );
    const selectedChestTintColor = isSelectedItemInspector(selectionInspectorProperties)
      ? selectionInspectorProperties.selection.tintColor
      : null;
    const isCustomChestTintColor = selectedChestTintColor !== null
      && selectedChestTintColor !== "#ffffff"
      && !paintableChestPalette.some(([, tintColor]) => tintColor === selectedChestTintColor);
    const tintControl = isSelectedItemInspector(selectionInspectorProperties)
      && selectionInspectorProperties.selection.canPaint ? (
        <label>
          {selectionCopy.paint}
          <select aria-label={selectionCopy.chestPaintColor} onChange={(changeEvent) => selectionInspectorProperties.onTintChange(changeEvent.currentTarget.value)} value={selectionInspectorProperties.selection.tintColor}>
            <option value="#ffffff">{selectionCopy.defaultOption}</option>
            {isCustomChestTintColor ? <option value={selectedChestTintColor}>{selectionCopy.customOption}</option> : null}
            {paintableChestPalette.map(([label, tintColor]) => <option key={tintColor} value={tintColor}>{readChestColorLabel(selectionLocale, label)}</option>)}
          </select>
        </label>
      ) : null;
    const nightLightControl =
      isSelectedItemInspector(selectionInspectorProperties) &&
      selectionInspectorProperties.selection.isNightLight ? (
        <button
          aria-label={
            selectionInspectorProperties.selection.nightLightState === "off"
              ? selectionCopy.lightSelected
              : selectionCopy.extinguishSelected
          }
          onClick={() =>
            selectionInspectorProperties.onNightLightStateChange(
              selectionInspectorProperties.selection.nightLightState === "off"
                ? undefined
                : "off",
            )
          }
          type="button"
        >
          {selectionInspectorProperties.selection.nightLightState === "off"
            ? selectionCopy.light
            : selectionCopy.extinguish}
        </button>
      ) : null;
    const buildingPaintControls = isPaintableBuildingInspector(
      selectionInspectorProperties,
    ) ? (
      <div className="selection-inspector__building-paint">
        <label>
          {selectionCopy.building}
          <input
            aria-label={selectionCopy.buildingColor}
            onChange={(changeEvent) =>
              selectionInspectorProperties.onBuildingPaintChange({
                ...selectionInspectorProperties.selection.paintColors,
                color1: changeEvent.currentTarget.value,
              })
            }
            type="color"
            value={selectionInspectorProperties.selection.paintColors.color1}
          />
        </label>
        <label>
          {selectionCopy.roof}
          <input
            aria-label={selectionCopy.roofColor}
            onChange={(changeEvent) =>
              selectionInspectorProperties.onBuildingPaintChange({
                ...selectionInspectorProperties.selection.paintColors,
                color2: changeEvent.currentTarget.value,
              })
            }
            type="color"
            value={selectionInspectorProperties.selection.paintColors.color2}
          />
        </label>
        <label>
          {selectionCopy.trim}
          <input
            aria-label={selectionCopy.trimColor}
            onChange={(changeEvent) =>
              selectionInspectorProperties.onBuildingPaintChange({
                ...selectionInspectorProperties.selection.paintColors,
                color3: changeEvent.currentTarget.value,
              })
            }
            type="color"
            value={selectionInspectorProperties.selection.paintColors.color3}
          />
        </label>
      </div>
    ) : null;
    const fishPondWaterColorControl = isFishPondWaterBuildingInspector(
      selectionInspectorProperties,
    ) ? (
      <label className="selection-inspector__fish-pond-water-color">
        {selectionCopy.water}
        <select
          aria-label={selectionCopy.fishPondWaterColor}
          onChange={(changeEvent) =>
            selectionInspectorProperties.onBuildingWaterColorChange(
              changeEvent.currentTarget.value === "default"
                ? undefined
                : Number(changeEvent.currentTarget.value),
            )
          }
          value={selectionInspectorProperties.selection.waterColor?.toString() ?? "default"}
        >
          <option value="default">{selectionCopy.defaultOption}</option>
          {fishPondWaterColors.slice(1).map((waterColorOption) => (
            <option
              key={waterColorOption.value}
              value={waterColorOption.value}
            >
              {readFishPondWaterColorLabel(selectionLocale, waterColorOption.label)}
            </option>
          ))}
        </select>
      </label>
    ) : null;

    return (
      <aside
        aria-label={selectionCopy.selectedPlacement}
        className="selection-pill selection-inspector"
      >
        <button
          aria-label={selectionCopy.dismissSelection}
          className="pill-dismiss selection-inspector__dismiss"
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <span className="pill-name selection-inspector__name">
          {selectedPlacementTitle}
        </span>
        <div className="selection-inspector__actions">
          {tintControl}
          {nightLightControl}
          {buildingPaintControls}
          {fishPondWaterColorControl}
          <button
            aria-label={selectionCopy.cycleAppearance}
            className="pill-more"
            disabled={!selection.canCycleAppearance}
            onClick={onCycleAppearance}
            title={selectionCopy.cycleAppearanceShortcut}
            type="button"
          >
            <MoreHorizontal aria-hidden="true" size={16} strokeWidth={2} />
          </button>
          <button
            aria-label={selectionCopy.copyPlacement}
            className="pill-copy"
            onClick={onCopy}
            title={selectionCopy.copyPlacementShortcut}
            type="button"
          >
            <Copy aria-hidden="true" size={15} strokeWidth={2} />
          </button>
          <button
            aria-label={selectionCopy.deletePlacement}
            className="pill-delete"
            onClick={onDelete}
            title={selectionCopy.deletePlacementShortcut}
            type="button"
          >
            <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
          </button>
        </div>
      </aside>
    );
  }

  const { onCopy, onDelete, onDismiss, selection } = selectionInspectorProperties;
  const selectionLabel = selectionCopy.selectedPlacementCount(selection.count);

  return (
    <aside
      aria-label={selectionCopy.selectedPlacements}
      className="selection-pill selection-inspector"
    >
      <button
        aria-label={selectionCopy.dismissSelection}
        className="pill-dismiss selection-inspector__dismiss"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden="true" size={14} strokeWidth={2} />
      </button>
      <span className="pill-name selection-inspector__name">{selectionLabel}</span>
      <div className="selection-inspector__actions">
        <button
          aria-label={selectionCopy.copyPlacements}
          className="pill-copy"
          onClick={onCopy}
          title={selectionCopy.copyPlacementsShortcut}
          type="button"
        >
          <Copy aria-hidden="true" size={15} strokeWidth={2} />
        </button>
        <button
          aria-label={selectionCopy.deletePlacements}
          className="pill-delete"
          onClick={onDelete}
          title={selectionCopy.deletePlacementsShortcut}
          type="button"
        >
          <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}

const japaneseChestColorLabels = {
  Blue: "青",
  "Sky Blue": "空色",
  Teal: "青緑",
  Aqua: "水色",
  Green: "緑",
  Lime: "黄緑",
  Yellow: "黄色",
  "Light Orange": "薄いオレンジ",
  Orange: "オレンジ",
  Red: "赤",
  "Dark Red": "暗い赤",
  "Light Pink": "薄いピンク",
  "Hot Pink": "鮮やかなピンク",
  Purple: "紫",
  "Bright Purple": "明るい紫",
  "Dark Purple": "暗い紫",
  "Dark Gray": "暗い灰色",
  Gray: "灰色",
  "Light Gray": "薄い灰色",
  White: "白",
} as const;

function readChestColorLabel(locale: PlannerChromeLocale, englishLabel: string): string {
  if (locale === "en" || locale === "zh") {
    return englishLabel;
  }

  if (locale === "ja") {
    if (!Object.prototype.hasOwnProperty.call(japaneseChestColorLabels, englishLabel)) {
      throw new Error(
        `Cannot read Japanese chest color label because label is ${JSON.stringify(englishLabel)}.`,
      );
    }
    return japaneseChestColorLabels[englishLabel as keyof typeof japaneseChestColorLabels];
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read chest color label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

const japaneseFishPondColorLabels: Readonly<Record<string, string>> = {
  Angler: "ツリビトアンコウ",
  "Crimson Fish": "クリムゾンフィッシュ",
  "Glacier Fish": "アイスフィッシュ",
  Legend: "レジェンド",
  "Lava Eel": "溶岩ウナギ",
  "Ms. Angler": "ミズ・ツリビトアンコウ",
  "Mutant Carp": "ミュータントゴイ",
  Slimejack: "スライムジャック",
  "Super Cucumber": "スーパーナマコ",
  "Void Salmon": "闇サーモン",
};

function readFishPondWaterColorLabel(
  locale: PlannerChromeLocale,
  englishLabel: string,
): string {
  if (locale === "en" || locale === "zh") {
    return englishLabel;
  }

  if (locale === "ja") {
    if (englishLabel === "Default") {
      return "デフォルト";
    }

    const japaneseLabel = japaneseFishPondColorLabels[englishLabel];
    if (japaneseLabel !== undefined) {
      return japaneseLabel;
    }

    if (englishLabel === "Legendary") {
      return "伝説級";
    }

    throw new Error(
      `Cannot read Japanese fish pond color label because label is ${JSON.stringify(englishLabel)}.`,
    );
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read fish pond color label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readSelectionInspectorCopy(locale: PlannerChromeLocale): Readonly<{
  building: string;
  buildingColor: string;
  chestPaintColor: string;
  copyPlacement: string;
  copyPlacementShortcut: string;
  copyPlacements: string;
  copyPlacementsShortcut: string;
  customOption: string;
  cycleAppearance: string;
  cycleAppearanceShortcut: string;
  defaultOption: string;
  deletePlacement: string;
  deletePlacementShortcut: string;
  deletePlacements: string;
  deletePlacementsShortcut: string;
  dismissSelection: string;
  extinguish: string;
  extinguishSelected: string;
  fishPondWaterColor: string;
  light: string;
  lightSelected: string;
  paint: string;
  roof: string;
  roofColor: string;
  selectedPlacement: string;
  selectedPlacementCount: (count: number) => string;
  selectedPlacements: string;
  trim: string;
  trimColor: string;
  water: string;
}> {
  if (locale === "en" || locale === "zh") {
    return {
      building: "Building",
      buildingColor: "Selected building building color",
      chestPaintColor: "Selected chest paint color",
      copyPlacement: "Copy selected placement",
      copyPlacementShortcut: "Copy selected placement (C)",
      copyPlacements: "Copy selected placements",
      copyPlacementsShortcut: "Copy selected placements (C)",
      customOption: "Custom",
      cycleAppearance: "Cycle selected item appearance",
      cycleAppearanceShortcut: "Cycle selected item appearance (Q)",
      defaultOption: "Default",
      deletePlacement: "Delete selected placement",
      deletePlacementShortcut: "Delete selected placement (Delete)",
      deletePlacements: "Delete selected placements",
      deletePlacementsShortcut: "Delete selected placements (Delete)",
      dismissSelection: "Dismiss selection",
      extinguish: "Extinguish",
      extinguishSelected: "Extinguish selected light",
      fishPondWaterColor: "Selected Fish Pond water color",
      light: "Light",
      lightSelected: "Light selected light",
      paint: "Paint",
      roof: "Roof",
      roofColor: "Selected building roof color",
      selectedPlacement: "Selected placement",
      selectedPlacementCount: (count) => `${String(count)} selected placements`,
      selectedPlacements: "Selected placements",
      trim: "Trim",
      trimColor: "Selected building trim color",
      water: "Water",
    };
  }

  if (locale === "ja") {
    return {
      building: "建物",
      buildingColor: "選択した建物の本体色",
      chestPaintColor: "選択したチェストの色",
      copyPlacement: "選択した配置をコピー",
      copyPlacementShortcut: "選択した配置をコピー（C）",
      copyPlacements: "選択した配置をコピー",
      copyPlacementsShortcut: "選択した配置をコピー（C）",
      customOption: "カスタム",
      cycleAppearance: "選択したアイテムの見た目を切り替え",
      cycleAppearanceShortcut: "選択したアイテムの見た目を切り替え（Q）",
      defaultOption: "デフォルト",
      deletePlacement: "選択した配置を削除",
      deletePlacementShortcut: "選択した配置を削除（Delete）",
      deletePlacements: "選択した配置を削除",
      deletePlacementsShortcut: "選択した配置を削除（Delete）",
      dismissSelection: "選択を解除",
      extinguish: "消灯",
      extinguishSelected: "選択した照明を消す",
      fishPondWaterColor: "選択した魚のいる池の水の色",
      light: "点灯",
      lightSelected: "選択した照明をつける",
      paint: "ペイント",
      roof: "屋根",
      roofColor: "選択した建物の屋根色",
      selectedPlacement: "選択した配置",
      selectedPlacementCount: (count) => `${String(count)}件の配置を選択中`,
      selectedPlacements: "選択した配置",
      trim: "縁取り",
      trimColor: "選択した建物の縁取り色",
      water: "水",
    };
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read selection inspector copy because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function isSelectedItemInspector(
  selectionInspectorProperties: SingleSelectionInspectorProperties,
): selectionInspectorProperties is SelectedItemInspectorProperties {
  return selectionInspectorProperties.selection.kind === "item";
}

function isPaintableBuildingInspector(
  selectionInspectorProperties: SingleSelectionInspectorProperties,
): selectionInspectorProperties is PaintableBuildingInspectorProperties {
  return (
    selectionInspectorProperties.selection.kind === "building" &&
    selectionInspectorProperties.selection.canPaint
  );
}

function isFishPondWaterBuildingInspector(
  selectionInspectorProperties: SingleSelectionInspectorProperties,
): selectionInspectorProperties is FishPondWaterBuildingInspectorProperties {
  return (
    selectionInspectorProperties.selection.kind === "building" &&
    selectionInspectorProperties.selection.canSetWaterColor === true
  );
}
