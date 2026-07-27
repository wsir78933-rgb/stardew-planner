import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import { FarmSummaryPanel } from "../../src/components/farm-summary-panel";
import { FarmSummaryModal } from "../../src/components/farm-summary-modal";
import { createFarmSummary } from "../../src/projects/farm-summary";
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
        onClose: () => undefined,
      }),
    );

    expect(panelMarkup).toContain(">Farm Summary<");
    expect(modalMarkup).toContain("1 items placed");
    expect(modalMarkup).toContain("Map: Standard Farm (standard) · Season: Spring");
    expect(modalMarkup).toContain("Items (1)");
    expect(modalMarkup).toContain("Stone");
    expect(modalMarkup).toContain("Export CSV");
    expect(modalMarkup).toContain('role="dialog"');
  });
});
