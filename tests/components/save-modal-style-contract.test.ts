import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

describe("Save modal style contract", () => {
  it("scopes Save surfaces and controls to the editor shell", () => {
    expect(globalStyles).toContain(
      ".planner-editor-shell .editor-modal--save-panel",
    );
    expect(globalStyles).toContain(
      ".planner-editor-shell .planner-save-modal-loader__branches",
    );
    expect(globalStyles).toContain(
      ".planner-editor-shell .local-project-panel__projects",
    );
    expect(globalStyles).toContain(
      ".planner-editor-shell .local-project-panel__delete-alert-overlay",
    );
    expect(globalStyles).toContain(
      ".planner-editor-shell .map-image-export-panel",
    );
  });

  it("includes the portalled delete dialog padding inside its viewport-safe width", () => {
    const portalledDeleteDialogRule = globalStyles.match(
      /\.planner-editor-shell \.local-project-panel__delete-alert-content,\s*\.local-project-panel__delete-alert-content\s*\{[^}]*\}/,
    )?.[0];

    expect(portalledDeleteDialogRule).toContain("box-sizing: border-box");
  });

  it("uses the deep background only on the Save modal content wrapper", () => {
    const saveModalContentRule = globalStyles.match(
      /\.planner-editor-shell \.planner-save-modal-content\s*\{[^}]*\}/,
    )?.[0];

    expect(saveModalContentRule).toContain("background: var(--bg-deep)");
  });

  it("keeps the Save responsive block isolated from workspace and homepage layout", () => {
    const saveResponsiveStyles = findCssBlockContaining(
      globalStyles,
      "@media (max-width: 640px)",
      ".editor-modal--save-panel",
    );

    expect(saveResponsiveStyles).toContain(
      "width: min(680px, calc(100vw - 1rem))",
    );
    expect(saveResponsiveStyles).toContain(
      "max-height: calc(100dvh - 1rem)",
    );
    expect(saveResponsiveStyles).toContain(
      ".planner-editor-shell .editor-modal--save-panel button",
    );
    expect(saveResponsiveStyles).toContain(
      ".planner-editor-shell .editor-modal--save-panel .local-project-panel__import",
    );
    expect(saveResponsiveStyles).toContain("min-height: 44px");
    expect(saveResponsiveStyles).not.toMatch(
      /\.planner-canvas|\.planner-editor-layout|\.planner-editor-catalog|\.toolbar|\.sidebar|homepage/,
    );
  });
});

function findCssBlockContaining(
  cssSource: string,
  blockPrefix: string,
  requiredSelector: string,
): string {
  let blockStart = cssSource.indexOf(blockPrefix);

  while (blockStart !== -1) {
    const block = readCssBlock(cssSource, blockStart);

    if (block.includes(requiredSelector)) {
      return block;
    }

    blockStart = cssSource.indexOf(blockPrefix, blockStart + block.length);
  }

  throw new Error(
    `Cannot find CSS block ${JSON.stringify(blockPrefix)} containing ${JSON.stringify(requiredSelector)}.`,
  );
}

function readCssBlock(cssSource: string, blockStart: number): string {
  const openingBraceIndex = cssSource.indexOf("{", blockStart);

  if (openingBraceIndex === -1) {
    throw new Error(
      `Cannot read CSS block at index ${String(blockStart)} because it has no opening brace.`,
    );
  }

  let braceDepth = 0;

  for (
    let characterIndex = openingBraceIndex;
    characterIndex < cssSource.length;
    characterIndex += 1
  ) {
    const character = cssSource[characterIndex];

    if (character === "{") {
      braceDepth += 1;
    } else if (character === "}") {
      braceDepth -= 1;
    }

    if (braceDepth === 0) {
      return cssSource.slice(blockStart, characterIndex + 1);
    }
  }

  throw new Error(
    `Cannot read CSS block at index ${String(blockStart)} because it has no closing brace.`,
  );
}
