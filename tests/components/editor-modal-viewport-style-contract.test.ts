import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

describe("Editor modal viewport backdrop style contract", () => {
  it("keeps the approved viewport backdrop fixed, centered, and overflow safe", () => {
    const viewportBackdropRule = globalStyles.match(
      /\.planner-editor-shell \.editor-modal__backdrop--viewport-fixed\s*\{[^}]*\}/,
    )?.[0] ?? "";

    expect(viewportBackdropRule).toContain("align-items: center");
    expect(viewportBackdropRule).toContain("display: flex");
    expect(viewportBackdropRule).toContain("justify-content: center");
    expect(viewportBackdropRule).toContain("overflow: auto");
    expect(viewportBackdropRule).toContain("position: fixed");
  });

  it("removes the shell fixed containing block only for an open viewport modal", () => {
    const defaultEditorShellRule = globalStyles.match(
      /\.planner-editor-shell\s*\{[^}]*\}/,
    )?.[0] ?? "";
    const viewportModalEditorShellRule = globalStyles.match(
      /\.planner-editor-shell:has\(> \.planner-editor-canvas-area > \.editor-modal__backdrop--viewport-fixed\)\s*\{[^}]*\}/,
    )?.[0] ?? "";

    expect(defaultEditorShellRule).toContain("transform: translateZ(0)");
    expect(viewportModalEditorShellRule).toContain("transform: none");
  });
});
