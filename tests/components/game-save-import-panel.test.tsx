import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ImportedGameSaveState } from "../../src/game-save/game-save-import";
import { GameSaveImportError } from "../../src/game-save/game-save-import";
import {
  createGameSaveImportTriggerLabel,
  formatGameSaveImportError,
  GameSaveImportControl,
  GameSaveImportResultModal,
} from "../../src/components/game-save-import-panel";
import { closeModalFromBackdropClick } from "../../src/components/modal-backdrop-close";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

const importedGameSaveState: ImportedGameSaveState = {
  farmName: "Junimo",
  mapId: "standard",
  placementSnapshot: {
    buildings: [],
    crops: [],
    items: [],
    nextBuildingId: 1,
    nextItemId: 1,
  },
  season: "summer",
  unmappedEntries: [
    { kind: "tree", sourceId: "1" },
    { kind: "furniture", sourceId: "123" },
  ],
};

describe("game save import panel", () => {
  it("calls onClose only when the import result click target is its backdrop", () => {
    const backdropTarget = {} as EventTarget;
    const dialogTarget = {} as EventTarget;
    const nestedTarget = {} as EventTarget;
    let closeCount = 0;
    const onClose = (): void => {
      closeCount += 1;
    };

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: backdropTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: dialogTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: nestedTarget,
      onClose,
    });
    expect(closeCount).toBe(1);
  });

  it("renders Chinese save-file control copy while preserving the file input", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportControl, {
        copy: getSaveModalCopy("zh-CN").gameSave,
        onImportGameSave: () => undefined,
      }),
    );

    expect(markup).toContain(
      "选择《星露谷物语》存档文件，在规划器中预览农场。",
    );
    expect(markup).toContain("选择存档文件");
    expect(markup).toContain(
      'title="导入《星露谷物语》存档文件以查看农场布局"',
    );
    expect(markup).toContain('accept="*"');
    expect(markup).toContain('type="file"');
  });

  it("formats Chinese default and pending save-file trigger labels without changing the filename", () => {
    const copy = getSaveModalCopy("zh-CN").gameSave;

    expect(createGameSaveImportTriggerLabel(null, copy)).toBe("选择存档文件");
    expect(createGameSaveImportTriggerLabel("Farm_123456789", copy)).toBe(
      "正在导入 Farm_123456789…",
    );
  });

  it("renders Chinese import results without changing farm values or external controls", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportResultModal, {
        copy: getSaveModalCopy("zh-CN").gameSave,
        importedGameSaveState,
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("“Junimo农场”");
    expect(markup).toContain("2 个物品无法匹配（可能来自模组）。");
    expect(markup).toContain("游戏存档导入仍处于实验阶段，不支持的物品不会放置到地图上。");
    expect(markup).toContain("导入的地图只保存在此浏览器中，保存到此设备后才会持久保存。");
    expect(markup).toContain('aria-label="关闭游戏存档导入结果"');
    expect(markup).toContain(">关闭<");
    expect(markup).toContain('role="dialog"');
    expect(markup).not.toContain("feedback");
    expect(markup).not.toContain("Sign in");
  });

  it("renders the Chinese success result when every imported item is mapped", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportResultModal, {
        copy: getSaveModalCopy("zh-CN").gameSave,
        importedGameSaveState: {
          ...importedGameSaveState,
          unmappedEntries: [],
        },
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("已导入所有可识别的地图放置内容。");
    expect(markup).not.toContain("无法匹配");
  });

  it("prefixes known Chinese game-save input errors and rethrows unknown failures", () => {
    expect(
      formatGameSaveImportError(
        new GameSaveImportError("Farm is missing."),
        getSaveModalCopy("zh-CN").gameSave,
      ),
    ).toBe("游戏存档导入失败：Farm is missing.");
    expect(() => formatGameSaveImportError(
      new Error("Unexpected renderer fault."),
      getSaveModalCopy("zh-CN").gameSave,
    )).toThrow(
      "Unexpected renderer fault.",
    );
  });

  it("resets the exact selected game-save input in finally after success or failure", () => {
    const panelSource = readFileSync(
      resolve(process.cwd(), "src/components/game-save-import-panel.tsx"),
      "utf8",
    );
    const importOperationSource = getFunctionSource(
      panelSource,
      "async function importGameSaveFile",
      "  return (",
    );

    expect(importOperationSource).toContain("finally {");
    expect(importOperationSource).toContain(
      "selectedGameSaveFileInput.value = \"\";",
    );
  });
});

function getFunctionSource(
  source: string,
  functionStartMarker: string,
  functionEndMarker: string,
): string {
  const functionStartIndex = source.indexOf(functionStartMarker);
  const functionEndIndex = source.indexOf(functionEndMarker, functionStartIndex);

  if (functionStartIndex === -1 || functionEndIndex === -1) {
    throw new Error(
      `Cannot find source range from ${JSON.stringify(functionStartMarker)} to ${JSON.stringify(functionEndMarker)}.`,
    );
  }

  return source.slice(functionStartIndex, functionEndIndex);
}
