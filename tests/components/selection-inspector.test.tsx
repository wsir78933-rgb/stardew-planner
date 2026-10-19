import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { paintableChestPalette, type CatalogItem } from "../../src/catalog";
import { getCatalogSidebarDisplayName } from "../../src/catalog/catalog-sidebar-model";
import { SelectionInspector } from "../../src/components/selection-inspector";
import type { PlannerChromeLocale } from "../../src/homepage/homepage-locale";
import { PlannerChromeLocaleProvider } from "../../src/i18n/planner-chrome-locale";

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
        onCopy: () => undefined,
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

  it("renders a group count with copy, dismiss, and delete actions", () => {
    const markup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "multiple",
        onCopy: () => undefined,
        onDelete: () => undefined,
        onDismiss: () => undefined,
        selection: { count: 3 },
      }),
    );

    expect(markup).toContain("3 selected placements");
    expect(markup).toContain('aria-label="Dismiss selection"');
    expect(markup).toContain('aria-label="Copy selected placements"');
    expect(markup).toContain('title="Copy selected placements (C)"');
    expect(markup).toContain('aria-label="Delete selected placements"');
    expect(markup).not.toContain("Cycle selected item appearance");
    expect(markup).not.toContain('aria-label="Copy selected placement"');
  });

  it("shows Japanese titles for a fish pond, chest, and crop through the normalized catalog name", () => {
    const fishPondMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onBuildingWaterColorChange: () => undefined,
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: true,
        canPaint: false,
        canSetWaterColor: true,
        catalogDisplayName: "Fish Pond",
        entityName: "Fish Pond",
        kind: "building",
        waterColor: 16_391_710,
      },
    });
    const chestMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      onNightLightStateChange: () => undefined,
      onTintChange: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: true,
        catalogDisplayName: "Chest",
        entityName: "Chest",
        isNightLight: false,
        kind: "item",
        nightLightState: undefined,
        tintColor: "#ffffff",
      },
    });
    const parsnipMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        catalogDisplayName: "Parsnip",
        entityName: "Parsnip",
        kind: "crop",
      },
    });

    expect(readSelectionTitle(fishPondMarkup)).toBe("魚のいる池");
    expect(fishPondMarkup).toContain('aria-label="選択した魚のいる池の水の色"');
    expect(fishPondMarkup).toContain('value="16391710" selected=""');
    expect(fishPondMarkup).toContain(">伝説級<");
    expect(readSelectionTitle(chestMarkup)).toBe("箱");
    expect(chestMarkup).toContain('aria-label="選択したチェストの色"');
    expect(chestMarkup).toContain(">青<");
    expect(readSelectionTitle(parsnipMarkup)).toBe("パースニップ");
    expect(parsnipMarkup).toContain('aria-label="選択した配置をコピー"');
    expect(parsnipMarkup).toContain('aria-label="選択した配置を削除"');
  });

  it("keeps English and Chinese selection titles and uses the normalized name only for Japanese", () => {
    const suffixedOakTree = createSuffixedOakTreeCatalogItem();
    const oakTreeDisplayName = getCatalogSidebarDisplayName(suffixedOakTree);
    expect(oakTreeDisplayName).toBe("Oak Tree");

    const englishMarkup = renderSelectionInspector("en", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: oakTreeDisplayName,
        entityName: suffixedOakTree.name,
        kind: "building",
      },
    });
    const chineseMarkup = renderSelectionInspector("zh", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: "Rarecrow 2",
        entityName: "Rarecrow",
        kind: "building",
      },
    });
    const japaneseMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: oakTreeDisplayName,
        entityName: suffixedOakTree.name,
        kind: "building",
      },
    });
    const ownedNameMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        entityName: "My Custom Shed",
        kind: "building",
      },
    });
    const multipleMarkup = renderSelectionInspector("ja", {
      kind: "multiple",
      onCopy: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: { count: 3 },
    });

    expect(readSelectionTitle(englishMarkup)).toBe("Oak Tree (Normal)");
    expect(englishMarkup).toContain('aria-label="Copy selected placement"');
    expect(readSelectionTitle(chineseMarkup)).toBe("Rarecrow");
    expect(chineseMarkup).toContain('aria-label="Copy selected placement"');
    expect(readSelectionTitle(japaneseMarkup)).toBe("オークの木");
    expect(japaneseMarkup).not.toContain("(Normal)");
    expect(readSelectionTitle(ownedNameMarkup)).toBe("My Custom Shed");
    expect(readSelectionTitle(multipleMarkup)).toBe("3件の配置を選択中");
  });

  it("shows Japanese for newly covered catalog names and throws when a resolved name is missing", () => {
    const tallTorchMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      onNightLightStateChange: () => undefined,
      onTintChange: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: "Tall Torch",
        entityName: "Tall Torch",
        isNightLight: false,
        kind: "item",
        nightLightState: undefined,
        tintColor: "#ffffff",
      },
    });
    const woodChairMarkup = renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      onNightLightStateChange: () => undefined,
      onTintChange: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: "Wood Chair 2",
        entityName: "Wood Chair 2",
        isNightLight: false,
        kind: "item",
        nightLightState: undefined,
        tintColor: "#ffffff",
      },
    });
    const englishWoodChairMarkup = renderSelectionInspector("en", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      onNightLightStateChange: () => undefined,
      onTintChange: () => undefined,
      selection: {
        canCycleAppearance: false,
        canPaint: false,
        catalogDisplayName: "Wood Chair 2",
        entityName: "Wood Chair 2",
        isNightLight: false,
        kind: "item",
        nightLightState: undefined,
        tintColor: "#ffffff",
      },
    });

    expect(readSelectionTitle(tallTorchMarkup)).toBe("ロングトーチ");
    expect(readSelectionTitle(woodChairMarkup)).toBe("木のイス 2");
    expect(tallTorchMarkup).toContain('aria-label="選択した配置をコピー"');
    expect(readSelectionTitle(englishWoodChairMarkup)).toBe("Wood Chair 2");
    expect(() => renderSelectionInspector("ja", {
      kind: "single",
      onCopy: () => undefined,
      onCycleAppearance: () => undefined,
      onDelete: () => undefined,
      onDismiss: () => undefined,
      selection: {
        canCycleAppearance: false,
        catalogDisplayName: "Not A Catalog Display",
        entityName: "Not A Catalog Display",
        kind: "crop",
      },
    })).toThrow(
      'Japanese catalog display name is missing for "Not A Catalog Display". Received: "Not A Catalog Display".',
    );
  });
});

function renderSelectionInspector(
  locale: PlannerChromeLocale,
  selectionInspectorProperties: Parameters<typeof SelectionInspector>[0],
): string {
  const inspector: ReactElement = createElement(
    PlannerChromeLocaleProvider,
    {
      locale,
      children: createElement(SelectionInspector, selectionInspectorProperties),
    },
  );
  return renderToStaticMarkup(inspector);
}

function readSelectionTitle(markup: string): string {
  const titleMatch = markup.match(
    /<span class="pill-name selection-inspector__name">([^<]*)<\/span>/,
  );
  if (titleMatch?.[1] === undefined) {
    throw new Error(`Selection inspector markup has no title span. Received: ${markup}`);
  }
  return titleMatch[1];
}

function createSuffixedOakTreeCatalogItem(): CatalogItem {
  return {
    id: "placeable:oak-tree-normal-source",
    name: "Oak Tree (Normal)",
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/test.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
    allowedTools: ["cursor", "erase"],
  };
}
