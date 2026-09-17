import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readPlannerWorkspaceStyles(): string {
  return readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
}

describe("planner workspace layout", () => {
  it("keeps the React workspace and canvas at the reserved desktop height", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-workspace\s*\{[^}]*height:\s*100%;[^}]*min-height:\s*0;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-workspace__reserved-geometry\s*\{[^}]*height:\s*100%;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-canvas\s*\{[^}]*inset:\s*0;[^}]*min-height:\s*0;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-canvas__viewport\s*\{[^}]*height:\s*100%;[^}]*width:\s*100%;/s,
    );
  });

  it("uses a 340px desktop overlay catalog rail without shrinking the canvas", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-workspace\s*\{[^}]*overflow:\s*hidden;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.item-catalog-panel\s*\{[^}]*width:\s*340px;/s,
    );
    expect(plannerWorkspaceStyles).not.toMatch(
      /\.planner-editor-shell:has\(\.item-catalog-panel--left\) \.planner-canvas\s*\{[^}]*left:\s*340px;/s,
    );
  });

  it("moves the catalog below the canvas at the verified mobile breakpoint", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const mobilePlannerWorkspaceRule = plannerWorkspaceStyles.match(
      /@media \(max-width: 640px\)\s*\{([\s\S]*)\}\s*$/,
    )?.[1];

    expect(mobilePlannerWorkspaceRule).toBeDefined();
    expect(mobilePlannerWorkspaceRule).toContain("height: 190px;");
    expect(mobilePlannerWorkspaceRule).toMatch(
      /\.item-catalog-panel\s*\{[^}]*position:\s*static;[^}]*width:\s*auto;/s,
    );
    expect(mobilePlannerWorkspaceRule).toMatch(
      /\.planner-canvas\s*\{[^}]*left:\s*0;/s,
    );
  });

  it("keeps the mobile menu above the overlapping editor toolbar", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const mobilePlannerWorkspaceRule = plannerWorkspaceStyles.match(
      /@media \(max-width: 640px\)\s*\{([\s\S]*)\}\s*$/,
    )?.[1];

    expect(mobilePlannerWorkspaceRule).toBeDefined();
    expect(mobilePlannerWorkspaceRule).toMatch(
      /\.planner-editor-shell \.menu-bar\s*\{[^}]*z-index:\s*26;/s,
    );
  });

  it("keeps a wide bottom catalog usable without clipping category labels", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom \.bottom-panel\s*\{[^}]*flex-direction:\s*column;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom \.panel-tabs\s*\{[^}]*flex-direction:\s*row;[^}]*overflow-x:\s*auto;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom \.tab-icon\s*\{[^}]*flex-direction:\s*row;[^}]*width:\s*auto;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom \.panel-content\s*\{[^}]*padding-left:\s*0;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.planner-editor-shell \.item-catalog-panel--bottom \.bottom-panel\s*\{[^}]*flex-direction:\s*row;/s,
    );
  });

  it("removes obsolete season dialog styles without moving the mobile menu", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).not.toContain(
      ".editor-modal__season-picker",
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.menu-bar\s*\{[^}]*z-index:\s*26;/s,
    );
  });
});
