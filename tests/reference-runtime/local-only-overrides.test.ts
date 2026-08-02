import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRootPath = process.cwd();
const localOnlyOverridePath = path.join(
  projectRootPath,
  "public/reference-runtime/local-only-overrides.css",
);
const bootstrapModulePath = path.join(
  projectRootPath,
  "public/reference-runtime/bootstrap.mjs",
);
const frozenReferenceRuntimeChunkPath = path.join(
  projectRootPath,
  "public/_app/immutable/chunks/CUwsdp_r.js",
);
const allowedPanelRowColorSelectors = [
  "body:has(> [data-homepage-shell]) #reference-runtime-root a.panel-row:not(.disabled)",
  "body:has(> [data-homepage-shell]) #reference-runtime-root a.panel-row:not(.disabled):hover",
];
const prohibitedSharedTextTokens = [
  "--text-muted",
  "--text-body",
  "--text-heading",
];

async function readLocalOnlyOverrideCss() {
  return readFile(localOnlyOverridePath, "utf8");
}

async function readReferenceRuntimeBootstrapModule() {
  return readFile(bootstrapModulePath, "utf8");
}

async function readFrozenReferenceRuntimeChunk() {
  return readFile(frozenReferenceRuntimeChunkPath, "utf8");
}

function getFrozenHelpSocialSection(frozenReferenceRuntimeChunk: string) {
  const socialSectionStart = frozenReferenceRuntimeChunk.indexOf(
    `TS=Ce('<div class="help-links`,
  );
  const socialSectionEnd = frozenReferenceRuntimeChunk.indexOf(
    `</div> <div class="help-divider`,
    socialSectionStart,
  );

  if (socialSectionStart < 0 || socialSectionEnd < 0) {
    throw new Error(
      `Frozen Help social section boundaries are missing. Received start: ${socialSectionStart}, end: ${socialSectionEnd}.`,
    );
  }

  return frozenReferenceRuntimeChunk.slice(socialSectionStart, socialSectionEnd);
}

type LocalOnlyCssRule = {
  selector: string;
  declarations: string;
};

function getPanelRowRulesWithColorDeclarations(
  localOnlyOverrideCss: string,
): LocalOnlyCssRule[] {
  return getLocalOnlyCssRules(localOnlyOverrideCss).filter(
    ({ selector, declarations }) =>
      selector.includes(".panel-row") && hasCssColorDeclaration(declarations),
  );
}

function getLocalOnlyCssRules(localOnlyOverrideCss: string): LocalOnlyCssRule[] {
  const localOnlyCssRules: LocalOnlyCssRule[] = [];
  const cssWithoutBlockComments = removeCssBlockComments(
    localOnlyOverrideCss,
  );

  collectLocalOnlyCssRules(cssWithoutBlockComments, localOnlyCssRules);

  return localOnlyCssRules;
}

function removeCssBlockComments(cssSource: string): string {
  let cssWithoutBlockComments = "";
  let activeStringQuote: "'" | '"' | null = null;

  for (
    let currentCharacterIndex = 0;
    currentCharacterIndex < cssSource.length;
    currentCharacterIndex += 1
  ) {
    const currentCharacter = cssSource[currentCharacterIndex];

    if (activeStringQuote !== null) {
      cssWithoutBlockComments += currentCharacter;

      if (currentCharacter === "\\") {
        const escapedCharacterIndex = currentCharacterIndex + 1;

        if (escapedCharacterIndex < cssSource.length) {
          cssWithoutBlockComments += cssSource[escapedCharacterIndex];
          currentCharacterIndex = escapedCharacterIndex;
        }

        continue;
      }

      if (currentCharacter === activeStringQuote) {
        activeStringQuote = null;
      }

      continue;
    }

    if (currentCharacter === "'" || currentCharacter === '"') {
      activeStringQuote = currentCharacter;
      cssWithoutBlockComments += currentCharacter;
      continue;
    }

    const nextCharacter = cssSource[currentCharacterIndex + 1];

    if (currentCharacter === "/" && nextCharacter === "*") {
      const commentStartIndex = currentCharacterIndex;
      const commentEndIndex = cssSource.indexOf(
        "*/",
        commentStartIndex + 2,
      );

      if (commentEndIndex < 0) {
        throw new Error(
          `Unclosed CSS block comment beginning at index ${commentStartIndex}.`,
        );
      }

      cssWithoutBlockComments += " ";
      currentCharacterIndex = commentEndIndex + 1;
      continue;
    }

    cssWithoutBlockComments += currentCharacter;
  }

  return cssWithoutBlockComments;
}

function collectLocalOnlyCssRules(
  cssSource: string,
  localOnlyCssRules: LocalOnlyCssRule[],
): void {
  let nextRuleStartIndex = 0;

  while (nextRuleStartIndex < cssSource.length) {
    const openingBraceIndex = cssSource.indexOf("{", nextRuleStartIndex);

    if (openingBraceIndex < 0) {
      return;
    }

    const selector = cssSource
      .slice(nextRuleStartIndex, openingBraceIndex)
      .trim();
    const closingBraceIndex = findMatchingCssClosingBrace(
      cssSource,
      openingBraceIndex,
    );
    const blockContents = cssSource.slice(
      openingBraceIndex + 1,
      closingBraceIndex,
    );

    if (selector.startsWith("@")) {
      collectLocalOnlyCssRules(blockContents, localOnlyCssRules);
    } else if (selector.length > 0) {
      localOnlyCssRules.push({ selector, declarations: blockContents });
    }

    nextRuleStartIndex = closingBraceIndex + 1;
  }
}

function findMatchingCssClosingBrace(
  cssSource: string,
  openingBraceIndex: number,
): number {
  let braceDepth = 1;

  for (
    let currentCharacterIndex = openingBraceIndex + 1;
    currentCharacterIndex < cssSource.length;
    currentCharacterIndex += 1
  ) {
    const currentCharacter = cssSource[currentCharacterIndex];

    if (currentCharacter === "{") {
      braceDepth += 1;
    }

    if (currentCharacter === "}") {
      braceDepth -= 1;

      if (braceDepth === 0) {
        return currentCharacterIndex;
      }
    }
  }

  throw new Error(
    `Missing closing CSS brace for opening brace at index ${openingBraceIndex}.`,
  );
}

function hasCssColorDeclaration(cssDeclarations: string): boolean {
  return /(?:^|;)\s*color\s*:/i.test(cssDeclarations);
}

function countCssCustomPropertyDefinitions(
  localOnlyOverrideCss: string,
  customPropertyName: string,
): number {
  if (!customPropertyName.startsWith("--")) {
    throw new Error(
      `Expected a CSS custom property name beginning with --, received ${customPropertyName}.`,
    );
  }

  const customPropertyDefinitionPatternSource = `(?:^|;)\\s*${escapeRegularExpressionLiteral(customPropertyName)}\\s*:`;

  return getLocalOnlyCssRules(localOnlyOverrideCss).reduce(
    (definitionCount, { declarations }) =>
      definitionCount +
      [
        ...declarations.matchAll(
          new RegExp(customPropertyDefinitionPatternSource, "g"),
        ),
      ].length,
    0,
  );
}

function escapeRegularExpressionLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("reference runtime local-only overrides", () => {
  it("does not define shared text tokens anywhere in the local-only CSS", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();

    for (const prohibitedSharedTextToken of prohibitedSharedTextTokens) {
      expect(
        countCssCustomPropertyDefinitions(
          localOnlyOverrideCss,
          prohibitedSharedTextToken,
        ),
      ).toBe(0);
    }
  });

  it("restores readable colors only for enabled homepage runtime panel links", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();
    const panelRowRulesWithColorDeclarations =
      getPanelRowRulesWithColorDeclarations(localOnlyOverrideCss);
    const panelRowColorSelectors = panelRowRulesWithColorDeclarations.map(
      ({ selector }) => selector,
    );
    const enabledPanelLinkRule = panelRowRulesWithColorDeclarations.find(
      ({ selector }) => selector === allowedPanelRowColorSelectors[0],
    );
    const enabledPanelLinkHoverRule = panelRowRulesWithColorDeclarations.find(
      ({ selector }) => selector === allowedPanelRowColorSelectors[1],
    );

    expect(panelRowColorSelectors).toHaveLength(
      allowedPanelRowColorSelectors.length,
    );
    expect(new Set(panelRowColorSelectors)).toEqual(
      new Set(allowedPanelRowColorSelectors),
    );
    expect(enabledPanelLinkRule?.declarations).toContain("color: var(--text);");
    expect(enabledPanelLinkRule?.declarations).not.toContain("!important");
    expect(enabledPanelLinkHoverRule?.declarations).toContain(
      "color: var(--text-bright);",
    );
    expect(enabledPanelLinkHoverRule?.declarations).not.toContain("!important");
  });

  it.each([
    {
      name: "disabled panel row color rule",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row.disabled { color: red; }",
      expectedPanelRowColorSelectors: [
        ...allowedPanelRowColorSelectors,
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row.disabled",
      ],
      expectedTextMutedDefinitionCount: 0,
    },
    {
      name: "global panel row color rule",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row { color: red; }",
      expectedPanelRowColorSelectors: [
        ...allowedPanelRowColorSelectors,
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row",
      ],
      expectedTextMutedDefinitionCount: 0,
    },
    {
      name: "second root text-muted definition",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root { --text-muted: red; }",
      expectedPanelRowColorSelectors: allowedPanelRowColorSelectors,
      expectedTextMutedDefinitionCount: 1,
    },
    {
      name: "commented disabled panel row color rule",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row.disabled { /* note */ color: red; }",
      expectedPanelRowColorSelectors: [
        ...allowedPanelRowColorSelectors,
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row.disabled",
      ],
      expectedTextMutedDefinitionCount: 0,
    },
    {
      name: "uppercase panel row color rule",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row { COLOR: red; }",
      expectedPanelRowColorSelectors: [
        ...allowedPanelRowColorSelectors,
        "body:has(> [data-homepage-shell]) #reference-runtime-root .panel-row",
      ],
      expectedTextMutedDefinitionCount: 0,
    },
    {
      name: "commented root text-muted definition",
      appendedCss:
        "body:has(> [data-homepage-shell]) #reference-runtime-root { /* note */ --text-muted: red; }",
      expectedPanelRowColorSelectors: allowedPanelRowColorSelectors,
      expectedTextMutedDefinitionCount: 1,
    },
  ])(
    "detects the unauthorized $name",
    async ({
      appendedCss,
      expectedPanelRowColorSelectors,
      expectedTextMutedDefinitionCount,
    }) => {
      const localOnlyOverrideCss = await readLocalOnlyOverrideCss();
      const syntheticLocalOnlyOverrideCss = `${localOnlyOverrideCss}\n${appendedCss}`;
      const panelRowColorSelectors = getPanelRowRulesWithColorDeclarations(
        syntheticLocalOnlyOverrideCss,
      ).map(({ selector }) => selector);

      expect(panelRowColorSelectors).toHaveLength(
        expectedPanelRowColorSelectors.length,
      );
      expect(new Set(panelRowColorSelectors)).toEqual(
        new Set(expectedPanelRowColorSelectors),
      );
      expect(
        countCssCustomPropertyDefinitions(
          syntheticLocalOnlyOverrideCss,
          "--text-muted",
        ),
      ).toBe(expectedTextMutedDefinitionCount);
    },
  );

  it("fails fast when a CSS block comment is not closed", () => {
    const cssSource =
      "a.panel-row { color: red; } /* an intentionally unclosed comment";
    const commentStartIndex = cssSource.indexOf("/*");

    expect(() => removeCssBlockComments(cssSource)).toThrow(
      `Unclosed CSS block comment beginning at index ${commentStartIndex}.`,
    );
  });

  it.each([
    'a.panel-row::before { content: "literal /* marker */ and escaped quote \\" still literal"; }',
    "a.panel-row::before { content: 'literal /* marker */ and escaped quote \\' still literal'; }",
  ])(
    "preserves CSS comment markers inside an escaped string literal",
    (cssSource) => {
      expect(removeCssBlockComments(cssSource)).toBe(cssSource);
    },
  );

  it("keeps CSS custom property names case-sensitive", () => {
    const uppercaseCustomPropertyCss =
      "a { --TEXT-MUTED: red; --text-muted: blue; }";

    expect(
      countCssCustomPropertyDefinitions(
        uppercaseCustomPropertyCss,
        "--text-muted",
      ),
    ).toBe(1);
  });

  it("does not treat a transition value as a panel row color declaration", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();
    const syntheticLocalOnlyOverrideCss = `${localOnlyOverrideCss}
body:has(> [data-homepage-shell]) #reference-runtime-root a.panel-row:focus { transition: color 120ms; }`;

    expect(
      getPanelRowRulesWithColorDeclarations(
        syntheticLocalOnlyOverrideCss,
      ).map(({ selector }) => selector),
    ).toEqual(allowedPanelRowColorSelectors);
  });

  it("keeps the compact wheel zoom control aligned with the frozen 36px toolbar buttons", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();
    const desktopWheelZoomRule = localOnlyOverrideCss.match(
      /body:has\(> \[data-homepage-shell\]\) #reference-runtime-root \[data-reference-runtime-wheel-zoom-button="true"\] \{([\s\S]*?)\n\}/,
    )?.[1];
    const compactWheelZoomRule = localOnlyOverrideCss.match(
      /@media \(pointer: coarse\), \(max-width: 1400px\) \{[\s\S]*?body:has\(> \[data-homepage-shell\]\) #reference-runtime-root \[data-reference-runtime-wheel-zoom-button="true"\] \{([\s\S]*?)\n  \}/,
    )?.[1];
    const compactWheelZoomSeparatorRule = localOnlyOverrideCss.match(
      /@media \(pointer: coarse\), \(max-width: 1400px\) \{[\s\S]*?\[data-reference-runtime-wheel-zoom-separator="true"\] \{([\s\S]*?)\n  \}/,
    )?.[1];

    expect(desktopWheelZoomRule).toBeDefined();
    expect(desktopWheelZoomRule).toContain("width: var(--lk-xl);");
    expect(desktopWheelZoomRule).toContain("height: var(--lk-xl);");
    expect(desktopWheelZoomRule).toContain("padding: 0;");
    expect(compactWheelZoomRule).toBeDefined();
    expect(compactWheelZoomRule).toContain("width: 36px;");
    expect(compactWheelZoomRule).toContain("height: 36px;");
    expect(compactWheelZoomRule).not.toContain("min-width:");
    expect(compactWheelZoomSeparatorRule).toBeDefined();
    expect(compactWheelZoomSeparatorRule).toContain("margin: 0 2px;");
  });

  it("removes excluded controls from layout without targeting retained planner controls", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();

    for (const excludedSelector of [
      ".signin-overlay",
      ".support-overlay",
      ".feedback-overlay",
      ".share-overlay",
      ".pm-lock-overlay",
      ".account-info",
      ".account-detail",
      ".account-tier",
      ".kofi-link-row",
      ".kofi-btn",
      "button.support-btn",
      "button.donate-btn",
      'button[title="Support"]',
      'button[title="Save your plan and get a shareable link"]',
    ]) {
      expect(localOnlyOverrideCss).toContain(excludedSelector);
    }

    expect(localOnlyOverrideCss).toContain("display: none !important;");
    expect(localOnlyOverrideCss).not.toContain('button[title="Map"]');
    expect(localOnlyOverrideCss).not.toContain('button[title="View"]');
    expect(localOnlyOverrideCss).not.toContain('button[title="Settings"]');
    expect(localOnlyOverrideCss).not.toContain(".help-overlay {");
    expect(localOnlyOverrideCss).not.toContain(".pm-action-btn {");
    expect(localOnlyOverrideCss).not.toMatch(/https?:\/\//);
    expect(localOnlyOverrideCss).toContain(
      "body:has(> [data-homepage-shell]) #reference-runtime-root",
    );
    expect(localOnlyOverrideCss).toContain(
      "body:has(> [data-homepage-shell]) #reference-runtime-root > .app",
    );
    expect(localOnlyOverrideCss).not.toContain("body.stardew-homepage");
    expect(localOnlyOverrideCss).toContain("transform: translateZ(0);");
    expect(localOnlyOverrideCss).not.toMatch(
      /(^|\n)#reference-runtime-root\s*\{/,
    );
  });

  it("uses an exact local-only label manifest without matching project titles", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    for (const exactExcludedLabel of [
      "Sign In",
      "Sign Out",
      "Change Ko-fi Email",
      "Save (as link)",
      "Feedback",
      "Support",
      "Save as Link · Generate a shareable URL containing your farm plan",
      "Supporters get access to projects that save all your maps.",
    ]) {
      expect(bootstrapModuleSource).toContain(`exactText: "${exactExcludedLabel}"`);
    }

    expect(bootstrapModuleSource).toContain("localOnlyTextControlManifest");
    expect(bootstrapModuleSource).toContain("localOnlySectionHeaderManifest");
    expect(bootstrapModuleSource).not.toContain("includes(exactText)");
    expect(bootstrapModuleSource).not.toContain(".panel-row { display");
  });

  it("rechecks the exact save-link cleanup when frozen menu content is added inside an existing panel", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    expect(bootstrapModuleSource).toContain('scopeSelector: ".panel",\n    elementSelector: "button.panel-row",\n    exactText: "Save (as link)",');
    expect(bootstrapModuleSource).toContain('scopeSelector: ".panel",\n    headerSelector: ".panel-section-header",\n    exactText: "Save",');
    expect(bootstrapModuleSource).toContain('  ".panel",');
    expect(bootstrapModuleSource).toContain(
      "containsReferenceRuntimeLocalOnlyDynamicContent(mutationRecord.target)",
    );
  });

  it("removes only the import-popup author-contact paragraph after the popup is rendered", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    expect(bootstrapModuleSource).toContain('scopeSelector: ".import-popup",\n    elementSelector: ".import-hint",\n    exactText: "If your save imported incorrectly, you can help me improve it by emailing your save file to bear@stardewplan.com.",');
    expect(bootstrapModuleSource).toContain("removePrecedingLineBreak: true");
    expect(bootstrapModuleSource).toContain(
      "candidateReferenceRuntimeElement.previousElementSibling",
    );
    expect(bootstrapModuleSource).toContain(
      "precedingReferenceRuntimeElement instanceof HTMLBRElement",
    );
    expect(bootstrapModuleSource).toContain(
      "Frozen local-only contact paragraph must follow an HTMLBRElement",
    );
    expect(bootstrapModuleSource).toContain('  ".import-popup",');
    expect(bootstrapModuleSource).not.toContain(
      'exactText: "Import Game Save"',
    );
  });

  it("removes the Help social-only container and divider without hiding retained Help content", async () => {
    const [localOnlyOverrideCss, frozenReferenceRuntimeChunk] = await Promise.all([
      readLocalOnlyOverrideCss(),
      readFrozenReferenceRuntimeChunk(),
    ]);
    const frozenHelpSocialSection = getFrozenHelpSocialSection(
      frozenReferenceRuntimeChunk,
    );

    expect(localOnlyOverrideCss).toContain(".help-modal .help-links,");
    expect(localOnlyOverrideCss).toContain(
      ".help-modal .help-links + .help-divider",
    );
    expect(localOnlyOverrideCss).not.toContain(".help-modal {\n  display: none");
    expect(frozenHelpSocialSection).toContain("Ko-fi");
    expect(frozenHelpSocialSection).toContain("Discord");
    expect(frozenHelpSocialSection).toContain("Contact");
    expect(frozenHelpSocialSection).not.toContain("Features");
  });
});
