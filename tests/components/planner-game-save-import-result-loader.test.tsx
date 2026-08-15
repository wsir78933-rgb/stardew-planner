import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createGameSaveResultLoadErrorMessage,
  createGameSaveResultRetryLabel,
  PlannerGameSaveImportResultLoader,
} from "../../src/components/planner-game-save-import-result-loader";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import type { ImportedGameSaveState } from "../../src/game-save/game-save-import";

const importedGameSaveState: ImportedGameSaveState = {
  farmName: "Junimo",
  mapId: "standard",
  placementSnapshot: {
    buildings: [], crops: [], items: [], nextBuildingId: 1, nextItemId: 1,
  },
  season: "summer",
  unmappedEntries: [],
};

describe("planner game-save import result loader", () => {
  it("renders Chinese loading status and formats localized retry failures with raw errors", () => {
    const copy = getSaveModalCopy("zh-CN");
    const markup = renderToStaticMarkup(
      createElement(PlannerGameSaveImportResultLoader, {
        copy: {
          gameSave: copy.gameSave,
          gameSaveResultLoader: copy.gameSaveResultLoader,
        },
        importedGameSaveState,
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("正在加载游戏存档导入结果…");
    expect(createGameSaveResultLoadErrorMessage(new Error("chunk failed"), copy.gameSaveResultLoader)).toBe(
      "无法加载游戏存档导入结果：chunk failed",
    );
    expect(createGameSaveResultRetryLabel(copy.gameSaveResultLoader)).toBe("重试加载结果");
  });
});
