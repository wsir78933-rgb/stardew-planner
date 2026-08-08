import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readPlannerStyles(): string {
  return readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
}

describe("planner map picker layout", () => {
  it("scrolls the active project panel inside the bounded map-picker modal", () => {
    const plannerStyles = readPlannerStyles();

    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.editor-modal,\s*\.planner-editor-shell \.game-save-import-result,\s*\.planner-editor-shell \.farm-summary-modal\s*\{[^}]*max-height:\s*80%;[^}]*max-width:\s*90vw;/s,
    );
    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.editor-modal--map-picker\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*overflow:\s*hidden;[^}]*width:\s*min\(600px, 90vw\);/s,
    );
    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.editor-modal--map-picker > \.project-map-instance-panel\s*\{[^}]*min-height:\s*0;[^}]*overflow-y:\s*auto;/s,
    );
  });

  it("keeps the ordinary picker scroll panel and three-column minmax grid", () => {
    const plannerStyles = readPlannerStyles();

    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.editor-modal--map-picker \.planner-map-picker\s*\{[^}]*min-height:\s*0;[^}]*overflow:\s*hidden;/s,
    );
    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.planner-map-picker__tabpanel\s*\{[^}]*min-height:\s*0;[^}]*overflow-y:\s*auto;/s,
    );
    expect(plannerStyles).toMatch(
      /\.planner-editor-shell \.editor-modal__map-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s,
    );
  });
});
