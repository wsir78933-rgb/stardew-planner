import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

const redesignStartMarker =
  "/* Editor modal content redesign: View, Settings, and Help only. */";
const redesignEndMarker = "/* End Editor modal content redesign. */";

describe("Editor modal content style contract", () => {
  it("defines every View, Settings, and Help selector under the editor shell", () => {
    const requiredSelectors = [
      ".planner-editor-shell .editor-modal--view-panel",
      ".planner-editor-shell .editor-modal--settings-panel",
      ".planner-editor-shell .editor-modal--help-info",
      ".planner-editor-shell .editor-modal--view-panel .editor-modal__header",
      ".planner-editor-shell .editor-modal--settings-panel .editor-modal__header",
      ".planner-editor-shell .editor-modal--help-info .editor-modal__header",
      ".planner-editor-shell .editor-modal--view-panel .editor-modal__view-panel",
      ".planner-editor-shell .editor-modal--settings-panel .editor-modal__settings-panel",
      ".planner-editor-shell .editor-modal__view-section",
      ".planner-editor-shell .editor-modal__view-options",
      '.planner-editor-shell .editor-modal__view-options button[aria-pressed="true"]',
      ".planner-editor-shell .editor-modal__view-options button:disabled",
      ".planner-editor-shell .editor-modal__panel-picker",
      '.planner-editor-shell .editor-modal__panel-picker button[aria-pressed="true"]',
      ".planner-editor-shell .editor-modal__free-placement-warning",
      ".planner-editor-shell .editor-modal__option-status",
      ".planner-editor-shell .editor-modal__legal-links",
      ".planner-editor-shell .editor-modal--help-info .editor-reference-info",
      ".planner-editor-shell .editor-modal--help-info .editor-reference-info section",
      ".planner-editor-shell .editor-modal--help-info .editor-reference-info ul",
    ];
    const missingSelectors = requiredSelectors.filter(
      (requiredSelector) => !globalStyles.includes(requiredSelector),
    );

    expect(missingSelectors).toEqual([]);
  });

  it("uses the approved pressed, disabled, list, and sticky-header language", () => {
    const pressedOptionRule = findStyleRule(
      globalStyles,
      '.planner-editor-shell .editor-modal__view-options button[aria-pressed="true"]',
    );
    const disabledOptionRule = findStyleRule(
      globalStyles,
      ".planner-editor-shell .editor-modal__view-options button:disabled",
    );
    const helpListRule = findStyleRule(
      globalStyles,
      ".planner-editor-shell .editor-modal--help-info .editor-reference-info ul",
    );
    const stickyHeaderRule = findStyleRule(
      globalStyles,
      ".planner-editor-shell .editor-modal--view-panel .editor-modal__header",
    );
    const panelPositionOffStatusRule = findStyleRule(
      globalStyles,
      ".planner-editor-shell .editor-modal__panel-picker button[aria-pressed]::after",
    );
    const pressedPanelPositionRule = findStyleRule(
      globalStyles,
      '.planner-editor-shell .editor-modal__panel-picker button[aria-pressed="true"]',
    );
    const panelPositionOnStatusRule = findStyleRule(
      globalStyles,
      '.planner-editor-shell .editor-modal__panel-picker button[aria-pressed="true"]::after',
    );

    expect(pressedOptionRule).toContain("background: #c9fb45");
    expect(disabledOptionRule).toContain("opacity:");
    expect(helpListRule).toContain("list-style: disc");
    expect(stickyHeaderRule).toContain("position: sticky");
    expect(panelPositionOffStatusRule).toContain('content: "Off"');
    expect(pressedPanelPositionRule).toContain("background: #c9fb45");
    expect(panelPositionOnStatusRule).toContain('content: "On"');
  });

  it("uses one-column content and 44 px touch targets at 640 px", () => {
    const responsiveStyles = findCssBlockContaining(
      globalStyles,
      "@media (max-width: 640px)",
      ".editor-modal--view-panel",
    );
    const touchTargetSelectors = [
      ".planner-editor-shell .editor-modal__view-options button",
      ".planner-editor-shell .editor-modal__panel-picker button",
      ".planner-editor-shell .editor-modal__free-placement-warning button",
      ".planner-editor-shell .game-save-import-control__file-trigger",
      ".planner-editor-shell .editor-modal__legal-links a",
    ];

    for (const touchTargetSelector of touchTargetSelectors) {
      expect(findStyleRule(responsiveStyles, touchTargetSelector)).toContain(
        "min-height: 44px",
      );
    }

    expect(responsiveStyles).toContain("grid-template-columns: 1fr");
  });

  it("keeps the redesign away from generic and protected editor surfaces", () => {
    const redesignStyles = getMarkedStyleSection(
      globalStyles,
      redesignStartMarker,
      redesignEndMarker,
    );

    expect(redesignStyles).not.toMatch(
      /\.planner-editor-shell \.editor-modal(?=[\s,{>:+~])/,
    );
    expect(redesignStyles).not.toMatch(
      /map-picker|keyboard-shortcuts|editor-reference-info--shortcuts|whats-new|homepage|planner-canvas|item-catalog|toolbar/i,
    );
  });
});

function findStyleRule(cssSource: string, selector: string): string {
  let selectorPosition = cssSource.indexOf(selector);

  while (selectorPosition !== -1) {
    const characterAfterSelector =
      cssSource[selectorPosition + selector.length] ?? "";

    if (/[\s,{]/.test(characterAfterSelector)) {
      return readCssBlock(cssSource, selectorPosition);
    }

    selectorPosition = cssSource.indexOf(
      selector,
      selectorPosition + selector.length,
    );
  }

  throw new Error(`Cannot find CSS selector ${JSON.stringify(selector)}.`);
}

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

function getMarkedStyleSection(
  cssSource: string,
  startMarker: string,
  endMarker: string,
): string {
  const sectionStart = cssSource.indexOf(startMarker);
  const sectionEnd = cssSource.indexOf(endMarker, sectionStart + startMarker.length);

  if (sectionStart === -1 || sectionEnd === -1) {
    throw new Error(
      `Cannot find the CSS section between ${JSON.stringify(startMarker)} and ${JSON.stringify(endMarker)}.`,
    );
  }

  return cssSource.slice(sectionStart, sectionEnd + endMarker.length);
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
