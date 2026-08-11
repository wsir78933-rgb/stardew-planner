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

  it("renders the save-file chooser with explanatory copy", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportControl, {
        onImportGameSave: () => undefined,
      }),
    );

    expect(markup).toContain(
      "Choose a Stardew Valley save file to preview the farm in this planner.",
    );
    expect(markup).toContain("Choose save file");
    expect(markup).toContain(
      'title="Import a Stardew Valley save file to view your farm layout"',
    );
    expect(markup).toContain('accept="*"');
    expect(markup).toContain('type="file"');
  });

  it("formats the default and pending save-file trigger labels", () => {
    expect(createGameSaveImportTriggerLabel(null)).toBe("Choose save file");
    expect(createGameSaveImportTriggerLabel("Farm_123456789")).toBe(
      "Importing Farm_123456789…",
    );
  });

  it("renders the import result without external feedback or account controls", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportResultModal, {
        importedGameSaveState,
        onClose: () => undefined,
      }),
    );

    expect(markup).toContain("&quot;Junimo Farm&quot;");
    expect(markup).toContain("2 items couldn&#x27;t be mapped (likely from mods).");
    expect(markup).toContain("Game save import is experimental.");
    expect(markup).toContain('role="dialog"');
    expect(markup).not.toContain("feedback");
    expect(markup).not.toContain("Sign in");
  });

  it("shows known game-save input errors and rethrows unknown failures", () => {
    expect(
      formatGameSaveImportError(new GameSaveImportError("Farm is missing.")),
    ).toBe("Game save import failed: Farm is missing.");
    expect(() => formatGameSaveImportError(new Error("Unexpected renderer fault."))).toThrow(
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
