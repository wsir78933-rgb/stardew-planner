import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  FarmSummaryModal,
  formatFarmSummaryExportError,
} from "../../src/components/farm-summary-modal";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import { createFarmSummary } from "../../src/projects/farm-summary";
import type { CatalogItem } from "../../src/catalog";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("farm summary modal", () => {
  it("renders Chinese empty-state, close accessibility text, and preserves map values", () => {
    const markup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        copy: getSaveModalCopy("zh-CN").farmSummaryDetail,
        farmSummary: createFarmSummary(
          createEmptyPlacementSnapshot(),
          [],
          { baseMapId: "forest", displayName: "Forest Farm", season: "fall" },
        ),
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain(">农场摘要<");
    expect(markup).toContain("地图: Forest Farm (forest) · 季节: 秋季");
    expect(markup).toContain("尚未放置任何物品。");
    expect(markup).toContain('aria-label="关闭农场摘要"');
  });

  it("renders Russian category and item names from the Russian summary", () => {
    const catalogItems: readonly CatalogItem[] = [
      {
        id: "building:Coop",
        name: "Coop",
        category: "building",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/buildings/Coop.png",
        sprite: { kind: "sprite-index", index: 0 },
        allowedTools: ["cursor"],
      },
      {
        id: "furniture_0",
        name: "Oak Chair",
        category: "decor",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/furniture.png",
        sprite: { kind: "sprite-index", index: 0 },
        allowedTools: ["cursor"],
      },
    ];
    const markup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        copy: getSaveModalCopy("ru").farmSummaryDetail,
        farmSummary: createFarmSummary(
          {
            ...createEmptyPlacementSnapshot(),
            buildings: [{ instanceId: 1, buildingId: "Coop", x: 3, y: 4 }],
            items: [
              {
                instanceId: 1,
                itemId: "furniture_0",
                x: 1,
                y: 1,
                layer: "item",
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
            nextBuildingId: 2,
            nextItemId: 2,
          },
          catalogItems,
          { baseMapId: "standard", displayName: "Standard Farm", season: "spring" },
          "ru",
        ),
        locale: "ru",
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("Карта: Стандартная ферма (standard)");
    expect(markup).toContain("Постройки (1)");
    expect(markup).toContain("Птичник");
    expect(markup).toContain("Мебель (1)");
    expect(markup).toContain("Дубовый стул");
    expect(markup).toContain("Экспорт CSV");
    expect(markup).not.toContain("Buildings");
    expect(markup).not.toContain(">Coop<");
  });

  it("keeps Chinese summary rows in English when the summary locale is Chinese", () => {
    const markup = renderToStaticMarkup(
      createElement(FarmSummaryModal, {
        copy: getSaveModalCopy("zh-CN").farmSummaryDetail,
        farmSummary: createFarmSummary(
          {
            ...createEmptyPlacementSnapshot(),
            buildings: [{ instanceId: 1, buildingId: "Coop", x: 3, y: 4 }],
            nextBuildingId: 2,
          },
          [
            {
              id: "building:Coop",
              name: "Coop",
              category: "building",
              tileSize: { width: 1, height: 1 },
              textureLocalPath: "/game-assets/buildings/Coop.png",
              sprite: { kind: "sprite-index", index: 0 },
              allowedTools: ["cursor"],
            },
          ],
          { baseMapId: "forest", displayName: "Forest Farm", season: "fall" },
          "zh",
        ),
        locale: "zh",
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("地图: Forest Farm (forest) · 季节: 秋季");
    expect(markup).toContain("Buildings (1)");
    expect(markup).toContain("Coop");
  });

  it("prefixes Farm Summary export failures without changing raw details", () => {
    expect(
      formatFarmSummaryExportError(
        new Error("download denied"),
        getSaveModalCopy("zh-CN").farmSummaryDetail,
      ),
    ).toBe("农场摘要导出失败：download denied");
  });
});
