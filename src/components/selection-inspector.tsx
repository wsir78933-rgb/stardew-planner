"use client";

import type { BuildingPaintColors } from "../paint/building-paint";
import type { SiteLocale } from "../i18n/locales";
import { formatTranslation, translate } from "../i18n/messages";

type SingleSelectionInspectorActionProperties = Readonly<{
  locale?: SiteLocale;
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
  locale?: SiteLocale;
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
  const locale = selectionInspectorProperties.locale ?? "en";
  if (selectionInspectorProperties.kind === "single") {
    const { onCopy, onDelete, onDismiss, onRotate, selection } =
      selectionInspectorProperties;
    const tintControl =
      isSelectedItemInspector(selectionInspectorProperties) ? (
        <input
          aria-label={translate(locale, "planner.inspector.tint")}
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
              ? translate(locale, "planner.inspector.lightLabel")
              : translate(locale, "planner.inspector.extinguishLabel")
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
            ? translate(locale, "planner.inspector.light")
            : translate(locale, "planner.inspector.extinguish")}
        </button>
      ) : null;
    const buildingPaintControls = isPaintableBuildingInspector(
      selectionInspectorProperties,
    ) ? (
      <div className="selection-inspector__building-paint">
        <label>
          {translate(locale, "planner.inspector.building")}
          <input
            aria-label={translate(locale, "planner.inspector.buildingColor")}
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
          {translate(locale, "planner.inspector.roof")}
          <input
            aria-label={translate(locale, "planner.inspector.roofColor")}
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
          {translate(locale, "planner.inspector.trim")}
          <input
            aria-label={translate(locale, "planner.inspector.trimColor")}
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
      <aside aria-label={translate(locale, "planner.inspector.single")} className="selection-inspector">
        <button
          aria-label={translate(locale, "planner.inspector.dismiss")}
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
            aria-label={translate(locale, "planner.inspector.rotate")}
            disabled={!selection.canRotate}
            onClick={onRotate}
            title={translate(locale, "planner.inspector.rotateTitle")}
            type="button"
          >
            ↻
          </button>
          <button
            aria-label={translate(locale, "planner.inspector.copyLabel")}
            onClick={onCopy}
            title={translate(locale, "planner.inspector.copyTitle")}
            type="button"
          >
            {translate(locale, "planner.inspector.copy")}
          </button>
          <button
            aria-label={translate(locale, "planner.inspector.deleteLabel")}
            onClick={onDelete}
            title={translate(locale, "planner.inspector.deleteTitle")}
            type="button"
          >
            {translate(locale, "planner.inspector.delete")}
          </button>
        </div>
      </aside>
    );
  }

  const { onDelete, onDismiss, selection } = selectionInspectorProperties;
  const selectionLabel = formatTranslation(locale, "planner.inspector.selectedCount", {
    count: selection.count,
  });

  return (
    <aside aria-label={translate(locale, "planner.inspector.multiple")} className="selection-inspector">
      <button
        aria-label={translate(locale, "planner.inspector.dismiss")}
        className="selection-inspector__dismiss"
        onClick={onDismiss}
        type="button"
      >
        ×
      </button>
      <span className="selection-inspector__name">{selectionLabel}</span>
      <div className="selection-inspector__actions">
        <button
          aria-label={translate(locale, "planner.inspector.multipleDeleteLabel")}
          onClick={onDelete}
          title={translate(locale, "planner.inspector.multipleDeleteTitle")}
          type="button"
        >
          {translate(locale, "planner.inspector.delete")}
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
