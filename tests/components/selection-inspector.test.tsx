import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SelectionInspector } from "../../src/components/selection-inspector";
import { paintableChestPalette } from "../../src/catalog";

describe("selection inspector", () => {
  it("keeps the frozen chest palette order and distinct default white values", () => {
    expect(paintableChestPalette).toHaveLength(20);
    expect(paintableChestPalette[0]).toEqual(["Blue", "#5555ff"]);
    expect(paintableChestPalette[19]).toEqual(["White", "#fefefe"]);
    expect(paintableChestPalette.map(([, tintColor]) => tintColor)).not.toContain("#ffffff");
  });
  it("keeps appearance, copy, and delete actions for one selected placement", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onCycleAppearance: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: true,
          entityName: "Wooden Fence",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );

    expect(markup).toContain("Wooden Fence");
    expect(markup).toContain('aria-label="Cycle selected item appearance"');
    expect(markup).toContain('title="Cycle selected item appearance (Q)"');
    expect(markup).toContain('aria-label="Copy selected placement"');
    expect(markup).toContain('aria-label="Delete selected placement"');
  });

  it("renders the fixed chest palette and marks an arbitrary stored color as Custom", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onCycleAppearance: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: true,
          canPaint: true,
          entityName: "Wooden Fence",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#123abc",
        },
      }),
    );

    expect(markup).toContain('aria-label="Selected chest paint color"');
    expect(markup).toContain('value="#ffffff">Default');
    expect(markup).toContain('value="#123abc" selected="">Custom');
    expect(markup).toContain('value="#fefefe">White');
  });

  it("disables appearance cycling when the selected item has no transition", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onCycleAppearance: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: false,
          entityName: "Stone",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );

    expect(markup).toMatch(
      /aria-label="Cycle selected item appearance"[^>]*disabled=""/,
    );
  });

  it("does not render light controls for a non-light item, non-item, or multiple selection", () => {
    const nonLightItemMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onCycleAppearance: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: true,
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
        onCycleAppearance: () => undefined,
        selection: {
          canCycleAppearance: false,
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
        onCycleAppearance: () => undefined,
        selection: {
          canCycleAppearance: false,
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

  it("renders the exact Fish Pond water palette only for a selected Fish Pond", () => {
    const fishPondMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onBuildingWaterColorChange: () => undefined,
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onCycleAppearance: () => undefined,
        selection: {
          canCycleAppearance: true,
          canPaint: false,
          canSetWaterColor: true,
          entityName: "Fish Pond",
          kind: "building",
          waterColor: 16_391_710,
        },
      }),
    );
    const ordinaryBuildingMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onCycleAppearance: () => undefined,
        selection: {
          canCycleAppearance: false,
          canPaint: false,
          entityName: "Barn",
          kind: "building",
        },
      }),
    );

    expect(fishPondMarkup).toContain(
      'aria-label="Selected Fish Pond water color"',
    );
    for (const [label, value] of [
      ["Default", "default"],
      ["Lava Eel", "16391710"],
      ["Void Salmon", "7869550"],
      ["Slimejack", "3997500"],
      ["Super Cucumber", "9856200"],
      ["Glacier Fish", "6615260"],
      ["Ms. Angler", "16742600"],
      ["Angler", "16742400"],
      ["Mutant Carp", "3333220"],
      ["Crimson Fish", "15091310"],
      ["Legend", "2659890"],
      ["Legendary", "9843410"],
    ]) {
      expect(fishPondMarkup).toContain(`value="${value}"`);
      expect(fishPondMarkup).toContain(`>${label}<`);
    }
    expect(fishPondMarkup).toContain('value="16391710" selected=""');
    expect(ordinaryBuildingMarkup).not.toContain(
      "Selected Fish Pond water color",
    );
  });

  it("renders Extinguish for a lit recognized light and Light for an off recognized light", () => {
    const litLightMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        onNightLightStateChange: () => undefined,
        onCycleAppearance: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: true,
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
        onCycleAppearance: () => undefined,
        onTintChange: () => undefined,
        selection: {
          canCycleAppearance: true,
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
    expect(markup).not.toContain("Cycle selected item appearance");
    expect(markup).not.toContain("Copy selected placement");
  });
});
