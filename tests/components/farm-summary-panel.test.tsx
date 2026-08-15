import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import { FarmSummaryPanel } from "../../src/components/farm-summary-panel";
import { FarmSummaryModal } from "../../src/components/farm-summary-modal";
import { createFarmSummary } from "../../src/projects/farm-summary";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

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
  it.each([
    ["spring", "春季"],
    ["summer", "夏季"],
    ["fall", "秋季"],
    ["winter", "冬季"],
  ] as const)("renders the Chinese %s season name", (season, expectedSeasonName) => {
    const markup = renderToStaticMarkup(
      createElement(FarmSummaryPanel, {
        catalogItems: [],
        copy: {
          detail: getSaveModalCopy("zh-CN").farmSummaryDetail,
          preview: getSaveModalCopy("zh-CN").farmSummaryPreview,
        },
        mapContext: {
          baseMapId: "forest",
          displayName: "Forest Farm",
          season,
        },
        placementSnapshot: createEmptyPlacementSnapshot(),
      }),
    );

    expect(markup).toContain(`季节: ${expectedSeasonName}`);
  });

  it("renders Chinese inline summary preview and retains the nested modal trigger", () => {
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
        copy: {
          detail: getSaveModalCopy("zh-CN").farmSummaryDetail,
          preview: getSaveModalCopy("zh-CN").farmSummaryPreview,
        },
        mapContext: standardFarmSummaryMapContext,
        placementSnapshot,
      }),
    );
    const modalMarkup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        copy: getSaveModalCopy("zh-CN").farmSummaryDetail,
        farmSummary: createFarmSummary(
          placementSnapshot,
          catalogItems,
          standardFarmSummaryMapContext,
        ),
        onClose: () => undefined,
      }),
    );

    expect(panelMarkup).toContain('class="farm-summary-panel__preview"');
    expect(panelMarkup).toContain("地图: Standard Farm");
    expect(panelMarkup).toContain("季节: 春季");
    expect(panelMarkup).toContain("1 个物品已放置");
    expect(panelMarkup).toContain(">查看详细摘要<");
    expect(panelMarkup).toContain("<button");
    expect(modalMarkup).toContain("1 个物品已放置");
    expect(modalMarkup).toContain("地图: Standard Farm (standard) · 季节: 春季");
    expect(modalMarkup).toContain("Items (1)");
    expect(modalMarkup).toContain("Stone");
    expect(modalMarkup).toContain("导出 CSV");
    expect(modalMarkup).toContain('role="dialog"');
  });
});
