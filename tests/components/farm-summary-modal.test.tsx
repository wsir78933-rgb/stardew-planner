import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  FarmSummaryModal,
  formatFarmSummaryExportError,
} from "../../src/components/farm-summary-modal";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import { createFarmSummary } from "../../src/projects/farm-summary";
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

  it("prefixes Farm Summary export failures without changing raw details", () => {
    expect(
      formatFarmSummaryExportError(
        new Error("download denied"),
        getSaveModalCopy("zh-CN").farmSummaryDetail,
      ),
    ).toBe("农场摘要导出失败：download denied");
  });
});
