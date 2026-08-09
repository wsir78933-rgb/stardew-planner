# Cursor and Zoom Selected Highlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the existing Cursor selection and wheel-Zoom toggle independent, tool-specific red selected highlights without changing their behavior.

**Architecture:** Keep `EditorToolbar` as the only JSX boundary: add the stable `cursor` class token while preserving its existing `tool`-derived `aria-pressed` value. Add two narrowly scoped CSS rules after the existing generic tool hover rule; they consume existing DOM state, use no new React state, and leave every non-target tool rule untouched.

**Tech Stack:** TypeScript, React 19, Next.js 16.3, CSS, Vitest 3, pnpm 10.

## Global Constraints

- Implementation scope is exactly `tests/components/editor-controls.test.tsx`, `src/components/editor-toolbar.tsx`, and `app/globals.css`; do not change any other product, test, configuration, dependency, or documentation file.
- Cursor must always render the stable `cursor` class marker, whether its existing `aria-pressed` is `"true"` or `"false"`; only `aria-pressed="true"` may receive the red selected rule.
- Zoom must reuse the existing `reference-runtime-wheel-zoom-button` class and existing `wheelZoomEnabled` / `aria-pressed` state. Do not add a Zoom class, data marker, state, callback, or interface.
- The two new rules must each use `background: rgb(177 58 40 / 15%);` and `color: #b13a28;` exactly.
- Each new rule must be tool-specific and include `[aria-pressed="true"]`. Do not add a false-state rule, `.tool-btn[aria-pressed="true"]`, `.editor-toolbar__button[aria-pressed="true"]`, `.active` styling, or another generalized selector.
- Place both selected rules after `.planner-editor-shell .tool-btn:hover:not(:disabled)` so selected Cursor and enabled Zoom retain their red appearance on hover.
- Do not change Multi-select, Erase, Fill, Undo, Redo, layout, button sizes, spacing, icons, labels, callbacks, behavior, keyboard shortcuts, focus-visible styles, or disabled styles.
- Use the smallest direct change: no abstraction, refactor, dependency, design-token extraction, future feature, or silent error handling.

---

## File Structure

- `tests/components/editor-controls.test.tsx` — extends the existing static-markup and stylesheet-contract tests with Cursor marker, independent state, exact selector, false-state exclusion, ordering, and color assertions.
- `src/components/editor-toolbar.tsx` — adds only the stable `cursor` class token to the existing Cursor button class-name expression.
- `app/globals.css` — adds the two independent, scoped selected-highlight rules immediately after the generic tool hover rule.

### Task 1: Add independent Cursor and Zoom selected-highlight contracts

**Files:**

- Modify: `tests/components/editor-controls.test.tsx:27-58, 102-182` — retain the existing test style and add the red-first component/CSS contracts.
- Modify: `src/components/editor-toolbar.tsx:52-69` — append the stable Cursor marker inside the current class-name expression.
- Modify: `app/globals.css:1913-1931` — add only the two target selectors after the generic hover selector.

**Interfaces:**

- Consumes: the existing `EditorToolbar` props `tool: EditorTool`, `wheelZoomEnabled?: boolean`, and `onWheelZoomToggle?: () => void`; their existing `aria-pressed` output remains the state source.
- Produces: a Cursor class set containing `cursor` in both states, plus the two CSS selector contracts `.planner-editor-shell .tool-btn.cursor[aria-pressed="true"]` and `.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"]`.
- Preserves: `onToolChange`, `onUndo`, `onRedo`, `canUndo`, `canRedo`, all existing tool values, and the existing `reference-runtime-wheel-zoom-button` class exactly as they are.

- [ ] **Step 1: Write the failing component and CSS-contract tests**

  In `tests/components/editor-controls.test.tsx`, first strengthen the existing wheel Zoom test (currently lines 27-58) so both disabled and enabled markup must retain its existing class. Then update the existing inactive Cursor expectation (currently lines 144-146) and append the following two tests after the current stylesheet test. Keep the existing imports; `readFileSync`, `resolve`, `renderToStaticMarkup`, `EditorToolbar`, and `expect` are already available.

  ```tsx
  // Add directly after the existing disabled Zoom data-marker assertion.
  expect(disabledMarkup).toContain(
    'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
  );

  // Add directly after the existing enabled Zoom aria assertion.
  expect(enabledMarkup).toContain(
    'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
  );

  // Replace only the existing selectedCursorClassName expectation.
  expect(new Set(selectedCursorClassName?.split(" "))).toEqual(
    new Set(["tool-btn", "editor-toolbar__button", "cursor"]),
  );

  it("keeps Cursor selection and wheel zoom state independent", () => {
    const cursorSelectedWheelZoomDisabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "cursor",
        wheelZoomEnabled: false,
      }),
    );
    const cursorUnselectedWheelZoomEnabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "multi-select",
        wheelZoomEnabled: true,
      }),
    );
    const bothEnabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "cursor",
        wheelZoomEnabled: true,
      }),
    );
    const selectedCursorClassName = cursorSelectedWheelZoomDisabledMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="true" class="([^"]+)"/,
    )?.[1];
    const unselectedCursorClassName = cursorUnselectedWheelZoomEnabledMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];

    expect(bothEnabledMarkup).toMatch(
      /<button aria-label="Cursor tool" aria-pressed="true" class="(?=[^"]*\bcursor\b)[^"]+"/,
    );
    expect(bothEnabledMarkup).toMatch(
      /<button aria-label="Disable wheel zoom" aria-pressed="true" class="(?=[^"]*\breference-runtime-wheel-zoom-button\b)[^"]+"/,
    );
    expect(new Set(selectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "cursor", "active"]),
    );
    expect(new Set(unselectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "cursor"]),
    );
    expect(cursorSelectedWheelZoomDisabledMarkup).toContain(
      'aria-label="Enable wheel zoom" aria-pressed="false"',
    );
    expect(cursorUnselectedWheelZoomEnabledMarkup).toContain(
      'aria-label="Cursor tool" aria-pressed="false"',
    );
  });

  it("locks Cursor and wheel Zoom colors after generic hover without broad or false selectors", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const genericToolHoverSelector =
      ".planner-editor-shell .tool-btn:hover:not(:disabled)";
    const selectedCursorSelector =
      '.planner-editor-shell .tool-btn.cursor[aria-pressed="true"]';
    const selectedWheelZoomSelector =
      '.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"]';
    const genericToolHoverRuleIndex = stylesheet.indexOf(
      `${genericToolHoverSelector} {`,
    );
    const selectedCursorRuleIndex = stylesheet.indexOf(
      `${selectedCursorSelector} {`,
    );
    const selectedWheelZoomRuleIndex = stylesheet.indexOf(
      `${selectedWheelZoomSelector} {`,
    );
    const selectedCursorRuleEnd = stylesheet.indexOf(
      "}",
      selectedCursorRuleIndex,
    );
    const selectedWheelZoomRuleEnd = stylesheet.indexOf(
      "}",
      selectedWheelZoomRuleIndex,
    );
    const selectedCursorRule = stylesheet.slice(
      selectedCursorRuleIndex,
      selectedCursorRuleEnd + 1,
    );
    const selectedWheelZoomRule = stylesheet.slice(
      selectedWheelZoomRuleIndex,
      selectedWheelZoomRuleEnd + 1,
    );

    expect(stylesheet).not.toContain(
      '.planner-editor-shell .tool-btn[aria-pressed="true"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .editor-toolbar__button[aria-pressed="true"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .tool-btn.cursor[aria-pressed="false"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="false"]',
    );
    expect(genericToolHoverRuleIndex).toBeGreaterThanOrEqual(0);
    expect(selectedCursorRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedWheelZoomRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedCursorRule).toContain("background: rgb(177 58 40 / 15%);");
    expect(selectedCursorRule).toContain("color: #b13a28;");
    expect(selectedWheelZoomRule).toContain(
      "background: rgb(177 58 40 / 15%);",
    );
    expect(selectedWheelZoomRule).toContain("color: #b13a28;");
  });
  ```

  The state test makes Cursor selected/Zoom off, Cursor unselected/Zoom on, and both true explicit. Its combined-true Cursor regex requires the new marker, so it is a real RED assertion even though the pre-existing state calculation already allows both `aria-pressed="true"` values.

- [ ] **Step 2: Run the focused test and record the expected RED result**

  Run: `pnpm exec vitest run tests/components/editor-controls.test.tsx`

  Expected: FAIL. The current Cursor class list is only `tool-btn editor-toolbar__button` (or adds only `active` when selected), so the updated Cursor set assertion and the combined-true Cursor regex fail because the `cursor` token is absent. The stylesheet test also fails because both new selector lookups return `-1`, which cannot be greater than the existing generic-hover rule index; therefore their exact red color blocks cannot be found. The `reference-runtime-wheel-zoom-button` class and both current `aria-pressed="true"` values remain present, confirming that this RED result asks only for the missing marker and CSS rules, not a state change.

- [ ] **Step 3: Implement the smallest DOM marker and two CSS rules**

  In `src/components/editor-toolbar.tsx`, insert the Cursor-only conditional between the existing Fill conditional and unchanged `active` conditional. Do not alter any other condition, its order, callbacks, props, or state calculation.

  ```tsx
        }${editorToolControl.tool === "fill" ? " fill" : ""}${
          editorToolControl.tool === "cursor" ? " cursor" : ""
        }${isSelected ? " active" : ""}`}
  ```

  In `app/globals.css`, insert these two complete rules after the generic hover block at current lines 1919-1920 and before the existing Multi-select rule. Keep the existing Zoom base and hover rules, Multi-select rule, Erase rule, and generic `active` rule unchanged.

  ```css
  .planner-editor-shell .tool-btn.cursor[aria-pressed="true"] {
    background: rgb(177 58 40 / 15%);
    color: #b13a28;
  }

  .planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"] {
    background: rgb(177 58 40 / 15%);
    color: #b13a28;
  }
  ```

- [ ] **Step 4: Run the focused component and editor-shell regression tests**

  Run: `pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/editor-shell.test.tsx`

  Expected: PASS. The marker survives Cursor selected and unselected markup; Zoom retains its existing class; the two exact true-only rules have the requested colors and occur after generic hover; the combined state renders both buttons with `aria-pressed="true"`; and no broad or false-state selector exists.

- [ ] **Step 5: Run type checking and production build**

  Run: `pnpm typecheck`

  Expected: PASS with no TypeScript diagnostics.

  Run: `pnpm build`

  Expected: PASS with a successful Next.js production build and no new compilation or route-generation error.

- [ ] **Step 6: Perform local `:3002` browser acceptance with the Hermes CDP browser**

  Run the local development server from the worktree if it is not already running:

  ```bash
  pnpm dev -- --port 3002
  ```

  Open `http://localhost:3002/#planner` in the local Hermes CDP browser, wait for the editor toolbar, and verify these exact interactions and computed styles:

  1. With Cursor not selected and Zoom off, both buttons have `aria-pressed="false"` and neither has the red background or `#b13a28` foreground.
  2. Select Cursor: its `aria-pressed` becomes `"true"`, its class includes `cursor`, and its computed background is `rgb(177, 58, 40)` at 15% alpha with computed color `rgb(177, 58, 40)`; hovering it preserves both values.
  3. Enable Zoom while Cursor remains selected: Zoom uses the existing `reference-runtime-wheel-zoom-button` class, becomes `aria-pressed="true"`, has the same computed red values, and Cursor remains selected/red. This verifies independent simultaneous true states.
  4. Turn Zoom off while leaving Cursor selected, then select Multi-select and Erase in turn. Confirm Zoom/Cursor false states return to the existing neutral and hover appearance; Multi-select/Erase styles and behavior remain unchanged; Fill still has its existing fill marker and remains hidden; Undo/Redo availability, button positions, and shortcuts remain unchanged.

- [ ] **Step 7: Check the diff and commit only the implementation files**

  Run: `git diff --check`

  Expected: PASS with no whitespace error.

  Run:

  ```bash
  git status --short
  git add tests/components/editor-controls.test.tsx src/components/editor-toolbar.tsx app/globals.css
  git commit -m "feat: highlight selected cursor and zoom controls"
  git status --short
  ```

  Expected: the commit contains only the three scoped implementation files, and the final status is empty.

## Plan Self-Review

- **No placeholders:** Complete. Every test, selector, class token, command, expected RED reason, GREEN implementation, browser check, and commit command is explicit; the plan contains no unresolved handoff.
- **Specification coverage:** Complete. The plan locks Cursor marker persistence in true/false states; Zoom marker reuse; independent simultaneous true state; exact colors; hover ordering; no false/generic selectors; and all requested non-regressions. It limits implementation to the three approved files and keeps non-target tools and interactions intact.
- **Type and naming consistency:** Complete. The plan uses the existing `EditorToolbar`, `EditorTool`, `tool`, `wheelZoomEnabled`, `reference-runtime-wheel-zoom-button`, and `aria-pressed` names without introducing a type, property, state variable, or abstraction.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-09-cursor-zoom-selected-highlight.md`. Execute its single task with `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`, preserving the TDD order and the exact three-file implementation boundary.
