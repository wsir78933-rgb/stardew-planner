"use client";

import type { BuildingPaintColors } from "../paint/building-paint";

type SingleSelectionInspectorActionProperties = Readonly<{
  kind: "single";
  onCopy: () => void;
  onDelete: () => void;
  onDismiss: () => void;
  onRotate: () => void;
}>;

type SelectedItemInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      onNightLightStateChange: (nightLightState: "off" | undefined) => void;
      onTintChange: (tintColor: string) => void;
      selection: Readonly<{
        canRotate: boolean;
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
        canRotate: false;
        canPaint: true;
        entityName: string;
        kind: "building";
        paintColors: BuildingPaintColors;
      }>;
    }>;

type NonPaintableBuildingInspectorProperties =
  SingleSelectionInspectorActionProperties &
    Readonly<{
      selection: Readonly<{
        canRotate: false;
        canPaint: false;
        entityName: string;
        kind: "building";
      }>;
    }>;

type SelectedCropInspectorProperties = SingleSelectionInspectorActionProperties &
  Readonly<{
    selection: Readonly<{
      canRotate: false;
      entityName: string;
      kind: "crop";
    }>;
  }>;

type SingleSelectionInspectorProperties =
  | SelectedItemInspectorProperties
  | PaintableBuildingInspectorProperties
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
    const { onCopy, onDelete, onDismiss, onRotate, selection } =
      selectionInspectorProperties;
    const tintControl =
      isSelectedItemInspector(selectionInspectorProperties) ? (
        <input
          aria-label="Selected item tint color"
          onChange={(changeEvent) =>
            selectionInspectorProperties.onTintChange(changeEvent.currentTarget.value)
          }
          type="color"
          value={selectionInspectorProperties.selection.tintColor}
        />
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

    return (
      <aside aria-label="Selected placement" className="selection-inspector">
        <button
          aria-label="Dismiss selection"
          className="selection-inspector__dismiss"
          onClick={onDismiss}
          type="button"
        >
          ×
        </button>
        <span className="selection-inspector__name">{selection.entityName}</span>
        <div className="selection-inspector__actions">
          {tintControl}
          {nightLightControl}
          {buildingPaintControls}
          <button
            aria-label="Rotate selected item"
            disabled={!selection.canRotate}
            onClick={onRotate}
            title="Rotate selected item (Q)"
            type="button"
          >
            ↻
          </button>
          <button
            aria-label="Copy selected placement"
            onClick={onCopy}
            title="Copy selected placement (C)"
            type="button"
          >
            Copy
          </button>
          <button
            aria-label="Delete selected placement"
            onClick={onDelete}
            title="Delete selected placement (Delete)"
            type="button"
          >
            Delete
          </button>
        </div>
      </aside>
    );
  }

  const { onDelete, onDismiss, selection } = selectionInspectorProperties;
  const selectionLabel = `${String(selection.count)} selected placements`;

  return (
    <aside aria-label="Selected placements" className="selection-inspector">
      <button
        aria-label="Dismiss selection"
        className="selection-inspector__dismiss"
        onClick={onDismiss}
        type="button"
      >
        ×
      </button>
      <span className="selection-inspector__name">{selectionLabel}</span>
      <div className="selection-inspector__actions">
        <button
          aria-label="Delete selected placements"
          onClick={onDelete}
          title="Delete selected placements (Delete)"
          type="button"
        >
          Delete
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
