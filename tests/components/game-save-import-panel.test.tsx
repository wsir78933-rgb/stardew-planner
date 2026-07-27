import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ImportedGameSaveState } from "../../src/game-save/game-save-import";
import { GameSaveImportError } from "../../src/game-save/game-save-import";
import {
  formatGameSaveImportError,
  GameSaveImportControl,
  GameSaveImportResultModal,
} from "../../src/components/game-save-import-panel";

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
  it("renders the source-shaped game-save file entry", () => {
    const markup = renderToStaticMarkup(
      createElement(GameSaveImportControl, {
        onImportGameSave: () => undefined,
      }),
    );

    expect(markup).toContain("Import Game Save");
    expect(markup).toContain(
      'title="Import a Stardew Valley save file to view your farm layout"',
    );
    expect(markup).toContain('accept="*"');
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
});
