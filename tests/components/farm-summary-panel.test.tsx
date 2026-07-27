import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import { FarmSummaryPanel } from "../../src/components/farm-summary-panel";
import {
  FarmSummaryModal,
  formatFarmSummaryExportError,
} from "../../src/components/farm-summary-modal";
import { createFarmSummary, type FarmSummary } from "../../src/projects/farm-summary";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

const catalogItems: readonly CatalogItem[] = [
  {
    id: "object:390",
    name: "Stone",
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/springobjects.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  },
];

const standardFarmSummaryMapContext = {
  baseMapId: "standard",
  displayName: "Standard Farm",
  season: "spring",
} as const;

describe("farm summary panel", () => {
  it("shows a safe localized summary-export failure without exposing a source error", () => {
    expect(
      formatFarmSummaryExportError(new Error("private browser detail"), "zh-CN"),
    ).toBe("农场汇总导出失败。");
  });

  it("opens Farm Summary from Save and renders the source-shaped modal", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "object:390",
          x: 2,
          y: 3,
          layer: "item" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextItemId: 2,
    };
    const panelMarkup = renderToStaticMarkup(
      createElement(FarmSummaryPanel, {
        catalogItems,
        mapContext: standardFarmSummaryMapContext,
        placementSnapshot,
      }),
    );
    const modalMarkup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        farmSummary: createFarmSummary(
          placementSnapshot,
          catalogItems,
          standardFarmSummaryMapContext,
        ),
        locale: "zh-CN",
        onClose: () => undefined,
      }),
    );

    expect(panelMarkup).toContain(">Farm Summary<");
    expect(modalMarkup).toContain("已摆放 1 个物品");
    expect(modalMarkup).toContain("地图：标准农场（standard）· 季节：春季");
    expect(modalMarkup).toContain("物品 (1)");
    expect(modalMarkup).toContain("石头");
    expect(modalMarkup).toContain("导出 CSV");
    expect(modalMarkup).toContain('role="dialog"');
  });

  it("renders a legacy summary source name only when its row has no catalog ID", () => {
    const legacyFarmSummary: FarmSummary = {
      mapContext: standardFarmSummaryMapContext,
      rows: [{ category: "Items", count: 1, name: "Legacy player label" }],
      totalItems: 1,
    };

    const modalMarkup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        farmSummary: legacyFarmSummary,
        locale: "zh-CN",
        onClose: () => undefined,
      }),
    );

    expect(modalMarkup).toContain("Legacy player label");
  });
});
