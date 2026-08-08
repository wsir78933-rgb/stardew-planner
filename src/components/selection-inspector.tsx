"use client";

import { fishPondWaterColors, paintableChestPalette } from "../catalog";
import type { BuildingPaintColors } from "../paint/building-paint";
import { Copy, MoreHorizontal, Trash2, X } from "lucide-react";

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
          Paint
          <select aria-label="Selected chest paint color" onChange={(changeEvent) => selectionInspectorProperties.onTintChange(changeEvent.currentTarget.value)} value={selectionInspectorProperties.selection.tintColor}>
            <option value="#ffffff">Default</option>
            {isCustomChestTintColor ? <option value={selectedChestTintColor}>Custom</option> : null}
            {paintableChestPalette.map(([label, tintColor]) => <option key={tintColor} value={tintColor}>{label}</option>)}
          </select>
        </label>
      ) : null;
    const nightLightControl =
      isSelectedItemInspector(selectionInspectorProperties) &&
      selectionInspectorProperties.selection.isNightLight ? (
        <button
          aria-label={
            selectionInspectorProperties.selection.nightLightState === "off"
              ? "Light selected light"
              : "Extinguish selected light"
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
            ? "Light"
            : "Extinguish"}
        </button>
      ) : null;
    const buildingPaintControls = isPaintableBuildingInspector(
      selectionInspectorProperties,
    ) ? (
      <div className="selection-inspector__building-paint">
        <label>
          Building
          <input
            aria-label="Selected building building color"
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
          Roof
          <input
            aria-label="Selected building roof color"
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
          Trim
          <input
            aria-label="Selected building trim color"
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
        Water
        <select
          aria-label="Selected Fish Pond water color"
          onChange={(changeEvent) =>
            selectionInspectorProperties.onBuildingWaterColorChange(
              changeEvent.currentTarget.value === "default"
                ? undefined
                : Number(changeEvent.currentTarget.value),
            )
          }
          value={selectionInspectorProperties.selection.waterColor?.toString() ?? "default"}
        >
          <option value="default">Default</option>
          {fishPondWaterColors.slice(1).map((waterColorOption) => (
            <option
              key={waterColorOption.value}
              value={waterColorOption.value}
            >
              {waterColorOption.label}
            </option>
          ))}
        </select>
      </label>
    ) : null;

    return (
      <aside
        aria-label="Selected placement"
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
        <span className="pill-name selection-inspector__name">
          {selection.entityName}
        </span>
        <div className="selection-inspector__actions">
          {tintControl}
          {nightLightControl}
          {buildingPaintControls}
          {fishPondWaterColorControl}
          <button
            aria-label="Cycle selected item appearance"
            className="pill-more"
            disabled={!selection.canCycleAppearance}
            onClick={onCycleAppearance}
            title="Cycle selected item appearance (Q)"
            type="button"
          >
            <MoreHorizontal aria-hidden="true" size={16} strokeWidth={2} />
          </button>
          <button
            aria-label="Copy selected placement"
            className="pill-copy"
            onClick={onCopy}
            title="Copy selected placement (C)"
            type="button"
          >
            <Copy aria-hidden="true" size={15} strokeWidth={2} />
          </button>
          <button
            aria-label="Delete selected placement"
            className="pill-delete"
            onClick={onDelete}
            title="Delete selected placement (Delete)"
            type="button"
          >
            <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
          </button>
        </div>
      </aside>
    );
  }

  const { onDelete, onDismiss, selection } = selectionInspectorProperties;
  const selectionLabel = `${String(selection.count)} selected placements`;

  return (
    <aside
      aria-label="Selected placements"
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
          aria-label="Delete selected placements"
          className="pill-delete"
          onClick={onDelete}
          title="Delete selected placements (Delete)"
          type="button"
        >
          <Trash2 aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </aside>
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
