"use client";

import { fishPondWaterColors, paintableChestPalette } from "../catalog";
import {
  getRussianChestColorDisplayName,
  getRussianFishPondWaterColorDisplayName,
} from "../i18n/planner-russian-display-names";
import type { BuildingPaintColors } from "../paint/building-paint";
import { Copy, MoreHorizontal, Trash2, X } from "lucide-react";

type SelectionInspectorLocale = "en" | "zh" | "ru";

type SingleSelectionInspectorActionProperties = Readonly<{
  kind: "single";
  locale?: SelectionInspectorLocale;
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
        entityName: string;
        kind: "building";
        waterColor: number | undefined;
      }>;
    }>;

type SelectedCropInspectorProperties = SingleSelectionInspectorActionProperties &
  Readonly<{
    selection: Readonly<{
      canCycleAppearance: false;
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
  locale?: SelectionInspectorLocale;
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
  const locale = readSelectionInspectorLocale(selectionInspectorProperties.locale);
  const copy = readSelectionInspectorCopy(locale);
  if (selectionInspectorProperties.kind === "single") {
    const { onCopy, onCycleAppearance, onDelete, onDismiss, selection } =
      selectionInspectorProperties;
    const selectedChestTintColor = isSelectedItemInspector(selectionInspectorProperties)
      ? selectionInspectorProperties.selection.tintColor
      : null;
    const isCustomChestTintColor = selectedChestTintColor !== null
      && selectedChestTintColor !== "#ffffff"
      && !paintableChestPalette.some(([, tintColor]) => tintColor === selectedChestTintColor);
    const tintControl = isSelectedItemInspector(selectionInspectorProperties)
      && selectionInspectorProperties.selection.canPaint ? (
        <label>
          {copy.paint}
          <select aria-label={copy.chestPaintColor} onChange={(changeEvent) => selectionInspectorProperties.onTintChange(changeEvent.currentTarget.value)} value={selectionInspectorProperties.selection.tintColor}>
            <option value="#ffffff">{copy.defaultColor}</option>
            {isCustomChestTintColor ? <option value={selectedChestTintColor}>{copy.customColor}</option> : null}
            {paintableChestPalette.map(([label, tintColor]) => (
              <option key={tintColor} value={tintColor}>
                {readChestPaintOptionLabel(label, locale)}
              </option>
            ))}
          </select>
        </label>
      ) : null;
    const nightLightControl =
      isSelectedItemInspector(selectionInspectorProperties) &&
      selectionInspectorProperties.selection.isNightLight ? (
        <button
          aria-label={
            selectionInspectorProperties.selection.nightLightState === "off"
              ? copy.lightSelectedLight
              : copy.extinguishSelectedLight
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
            ? copy.light
            : copy.extinguish}
        </button>
      ) : null;
    const buildingPaintControls = isPaintableBuildingInspector(
      selectionInspectorProperties,
    ) ? (
      <div className="selection-inspector__building-paint">
        <label>
          {copy.building}
          <input
            aria-label={copy.buildingColor}
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
          {copy.roof}
          <input
            aria-label={copy.roofColor}
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
          {copy.trim}
          <input
            aria-label={copy.trimColor}
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
        {copy.water}
        <select
          aria-label={copy.fishPondWaterColor}
          onChange={(changeEvent) =>
            selectionInspectorProperties.onBuildingWaterColorChange(
              changeEvent.currentTarget.value === "default"
                ? undefined
                : Number(changeEvent.currentTarget.value),
            )
          }
          value={selectionInspectorProperties.selection.waterColor?.toString() ?? "default"}
        >
          <option value="default">{readFishPondWaterOptionLabel("Default", locale)}</option>
          {fishPondWaterColors.slice(1).map((waterColorOption) => (
            <option
              key={waterColorOption.value}
              value={waterColorOption.value}
            >
              {readFishPondWaterOptionLabel(waterColorOption.label, locale)}
            </option>
          ))}
        </select>
      </label>
    ) : null;

    return (
      <aside
        aria-label={copy.selectedPlacement}
        className="selection-pill selection-inspector"
      >
        <button
          aria-label={copy.dismissSelection}
          className="pill-dismiss selection-inspector__dismiss"
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <span className="pill-name selection-inspector__name">
          {selection.entityName}
        </span>
        <div className="selection-inspector__actions">
          {tintControl}
          {nightLightControl}
          {buildingPaintControls}
          {fishPondWaterColorControl}
          <button
            aria-label={copy.cycleAppearance}
            className="pill-more"
            disabled={!selection.canCycleAppearance}
            onClick={onCycleAppearance}
            title={copy.cycleAppearanceTitle}
            type="button"
          >
            <MoreHorizontal aria-hidden="true" size={16} strokeWidth={2} />
          </button>
          <button
            aria-label={copy.copyPlacement}
            className="pill-copy"
            onClick={onCopy}
            title={copy.copyPlacementTitle}
            type="button"
          >
            <Copy aria-hidden="true" size={15} strokeWidth={2} />
          </button>
          <button
            aria-label={copy.deletePlacement}
            className="pill-delete"
            onClick={onDelete}
            title={copy.deletePlacementTitle}
            type="button"
          >
            <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
          </button>
        </div>
      </aside>
    );
  }

  const { onCopy, onDelete, onDismiss, selection } = selectionInspectorProperties;
  const selectionLabel = copy.selectedPlacementCount(selection.count);

  return (
    <aside
      aria-label={copy.selectedPlacements}
      className="selection-pill selection-inspector"
    >
      <button
        aria-label="Dismiss selection"
        className="pill-dismiss selection-inspector__dismiss"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden="true" size={14} strokeWidth={2} />
      </button>
      <span className="pill-name selection-inspector__name">{selectionLabel}</span>
      <div className="selection-inspector__actions">
        <button
          aria-label={copy.copyPlacements}
          className="pill-copy"
          onClick={onCopy}
          title={copy.copyPlacementsTitle}
          type="button"
        >
          <Copy aria-hidden="true" size={15} strokeWidth={2} />
        </button>
        <button
          aria-label={copy.deletePlacements}
          className="pill-delete"
          onClick={onDelete}
          title={copy.deletePlacementsTitle}
          type="button"
        >
          <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}

type SelectionInspectorCopy = Readonly<{
  building: string;
  buildingColor: string;
  chestPaintColor: string;
  copyPlacement: string;
  copyPlacementTitle: string;
  copyPlacements: string;
  copyPlacementsTitle: string;
  customColor: string;
  cycleAppearance: string;
  cycleAppearanceTitle: string;
  defaultColor: string;
  deletePlacement: string;
  deletePlacementTitle: string;
  deletePlacements: string;
  deletePlacementsTitle: string;
  dismissSelection: string;
  extinguish: string;
  extinguishSelectedLight: string;
  fishPondWaterColor: string;
  light: string;
  lightSelectedLight: string;
  paint: string;
  roof: string;
  roofColor: string;
  selectedPlacement: string;
  selectedPlacementCount: (count: number) => string;
  selectedPlacements: string;
  trim: string;
  trimColor: string;
  water: string;
}>;

function readSelectionInspectorLocale(
  locale: SelectionInspectorLocale | undefined,
): SelectionInspectorLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Selection inspector locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readSelectionInspectorCopy(locale: SelectionInspectorLocale): SelectionInspectorCopy {
  if (locale === "en" || locale === "zh") {
    return {
      building: "Building",
      buildingColor: "Selected building building color",
      chestPaintColor: "Selected chest paint color",
      copyPlacement: "Copy selected placement",
      copyPlacementTitle: "Copy selected placement (C)",
      copyPlacements: "Copy selected placements",
      copyPlacementsTitle: "Copy selected placements (C)",
      customColor: "Custom",
      cycleAppearance: "Cycle selected item appearance",
      cycleAppearanceTitle: "Cycle selected item appearance (Q)",
      defaultColor: "Default",
      deletePlacement: "Delete selected placement",
      deletePlacementTitle: "Delete selected placement (Delete)",
      deletePlacements: "Delete selected placements",
      deletePlacementsTitle: "Delete selected placements (Delete)",
      dismissSelection: "Dismiss selection",
      extinguish: "Extinguish",
      extinguishSelectedLight: "Extinguish selected light",
      fishPondWaterColor: "Selected Fish Pond water color",
      light: "Light",
      lightSelectedLight: "Light selected light",
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
  if (locale === "ru") {
    return {
      building: "Здание",
      buildingColor: "Цвет здания у выбранной постройки",
      chestPaintColor: "Цвет покраски выбранного сундука",
      copyPlacement: "Копировать выбранный объект",
      copyPlacementTitle: "Копировать выбранный объект (C)",
      copyPlacements: "Копировать выбранные объекты",
      copyPlacementsTitle: "Копировать выбранные объекты (C)",
      customColor: "Свой",
      cycleAppearance: "Сменить вид выбранного предмета",
      cycleAppearanceTitle: "Сменить вид выбранного предмета (Q)",
      defaultColor: "По умолчанию",
      deletePlacement: "Удалить выбранный объект",
      deletePlacementTitle: "Удалить выбранный объект (Delete)",
      deletePlacements: "Удалить выбранные объекты",
      deletePlacementsTitle: "Удалить выбранные объекты (Delete)",
      dismissSelection: "Закрыть выбор",
      extinguish: "Погасить",
      extinguishSelectedLight: "Погасить выбранный светильник",
      fishPondWaterColor: "Цвет воды выбранного рыбного пруда",
      light: "Зажечь",
      lightSelectedLight: "Зажечь выбранный светильник",
      paint: "Покраска",
      roof: "Крыша",
      roofColor: "Цвет крыши у выбранной постройки",
      selectedPlacement: "Выбранный объект",
      selectedPlacementCount: readRussianSelectedPlacementCount,
      selectedPlacements: "Выбранные объекты",
      trim: "Отделка",
      trimColor: "Цвет отделки у выбранной постройки",
      water: "Вода",
    };
  }
  throw new TypeError(
    `Selection inspector locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readRussianSelectedPlacementCount(count: number): string {
  if (!Number.isInteger(count)) {
    throw new TypeError(
      `Selected placement count must be an integer; received ${JSON.stringify(count)}.`,
    );
  }
  const absoluteCount = Math.abs(count);
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${String(count)} выбранных объектов`;
  }
  if (lastDigit === 1) {
    return `${String(count)} выбранный объект`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${String(count)} выбранных объекта`;
  }
  return `${String(count)} выбранных объектов`;
}

function readChestPaintOptionLabel(
  label: (typeof paintableChestPalette)[number][0],
  locale: SelectionInspectorLocale,
): string {
  if (locale === "en" || locale === "zh") return label;
  if (locale === "ru") return getRussianChestColorDisplayName(label);
  throw new TypeError(
    `Selection inspector locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readFishPondWaterOptionLabel(
  label: (typeof fishPondWaterColors)[number]["label"],
  locale: SelectionInspectorLocale,
): string {
  if (locale === "en" || locale === "zh") return label;
  if (locale === "ru") return getRussianFishPondWaterColorDisplayName(label);
  throw new TypeError(
    `Selection inspector locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
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
