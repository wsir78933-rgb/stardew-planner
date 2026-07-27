import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SelectionInspector } from "../../src/components/selection-inspector";

describe("selection inspector", () => {
  it("keeps rotate, copy, and delete actions for one selected placement", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onRotate: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canRotate: true,
          entityName: "Wooden Fence",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );

    expect(markup).toContain("Wooden Fence");
    expect(markup).toContain('aria-label="Rotate selected item"');
    expect(markup).toContain('aria-label="Copy selected placement"');
    expect(markup).toContain('aria-label="Delete selected placement"');
  });

  it("renders an accessible native color input for one selected item", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onRotate: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canRotate: true,
          entityName: "Wooden Fence",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#123abc",
        },
      }),
    );

    expect(markup).toContain('aria-label="Selected item tint color"');
    expect(markup).toContain('type="color"');
    expect(markup).toContain('value="#123abc"');
  });

  it("does not render light controls for a non-light item, non-item, or multiple selection", () => {
    const nonLightItemMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onRotate: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canRotate: true,
          entityName: "Wooden Fence",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );
    const nonItemMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onRotate: () => undefined,
        selection: {
          canRotate: false,
          canPaint: false,
          entityName: "Barn",
          kind: "building",
        },
      }),
    );
    const multipleMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "multiple",
        onDelete: () => undefined,
        onDismiss: () => undefined,
        selection: { count: 3 },
      }),
    );

    expect(nonItemMarkup).not.toContain("Selected item tint color");
    expect(nonItemMarkup).not.toContain('type="color"');
    expect(multipleMarkup).not.toContain("Selected item tint color");
    expect(multipleMarkup).not.toContain('type="color"');
    expect(nonLightItemMarkup).not.toContain("Extinguish selected light");
    expect(nonLightItemMarkup).not.toContain("Light selected light");
    expect(nonItemMarkup).not.toContain("Extinguish selected light");
    expect(multipleMarkup).not.toContain("Extinguish selected light");
  });

  it("renders three building paint channels only for a paintable building", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onBuildingPaintChange: () => undefined,
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onRotate: () => undefined,
        selection: {
          canRotate: false,
          canPaint: true,
          entityName: "Big Shed",
          kind: "building",
          paintColors: {
            color1: "#112233",
            color2: "#445566",
            color3: "#778899",
          },
        },
      }),
    );

    expect(markup).toContain('aria-label="Selected building building color"');
    expect(markup).toContain('aria-label="Selected building roof color"');
    expect(markup).toContain('aria-label="Selected building trim color"');
    expect(markup).toContain('value="#112233"');
  });

  it("renders Extinguish for a lit recognized light and Light for an off recognized light", () => {
    const litLightMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onRotate: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canRotate: true,
          entityName: "Torch",
          isNightLight: true,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );
    const offLightMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onRotate: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canRotate: true,
          entityName: "Torch",
          isNightLight: true,
          kind: "item",
          nightLightState: "off",
          tintColor: "#ffffff",
        },
      }),
    );

    expect(litLightMarkup).toContain('aria-label="Extinguish selected light"');
    expect(litLightMarkup).toContain(">Extinguish</button>");
    expect(offLightMarkup).toContain('aria-label="Light selected light"');
    expect(offLightMarkup).toContain(">Light</button>");
  });

  it("renders a group count with only dismiss and delete actions", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "multiple",
        onDelete: () => undefined,
        onDismiss: () => undefined,
        selection: { count: 3 },
      }),
    );

    expect(markup).toContain("3 selected placements");
    expect(markup).toContain('aria-label="Dismiss selection"');
    expect(markup).toContain('aria-label="Delete selected placements"');
    expect(markup).not.toContain("Rotate selected item");
    expect(markup).not.toContain("Copy selected placement");
  });
});
