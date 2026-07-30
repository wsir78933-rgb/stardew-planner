import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EditorModal } from "../../src/components/editor-modal";
import { editorModalIds } from "../../src/editor/editor-view-state";

describe("editor reference information dialogs", () => {
  it("registers the three source-reference information dialogs", () => {
    expect(editorModalIds).toContain("help-info");
    expect(editorModalIds).toContain("keyboard-shortcuts");
    expect(editorModalIds).toContain("whats-new");
  });

  it("renders local-only help without feedback or support actions", () => {
    const helpDialogMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "help-info",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        onSeasonChange: () => undefined,
        panelPosition: "bottom",
        season: "spring",
        selectedMapId: "standard",
      }),
    );

    expect(helpDialogMarkup).toContain("Help &amp; Info");
    expect(helpDialogMarkup).toContain("Click Cycling");
    expect(helpDialogMarkup).toContain("X-ray");
    expect(helpDialogMarkup).not.toContain("Feedback");
    expect(helpDialogMarkup).not.toContain("Support");
  });

  it("omits the removed legal links and their empty Joja Stuff section", () => {
    const settingsPanelMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "settings-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        onSeasonChange: () => undefined,
        panelPosition: "bottom",
        season: "spring",
        selectedMapId: "standard",
      }),
    );

    expect(settingsPanelMarkup).not.toContain('href="/privacy"');
    expect(settingsPanelMarkup).not.toContain('href="/terms"');
    expect(settingsPanelMarkup).not.toContain("Joja Stuff");
  });
});
