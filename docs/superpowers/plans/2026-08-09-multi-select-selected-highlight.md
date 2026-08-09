# Multi-select Selected Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give only the selected Multi-select toolbar button the confirmed destructive red background and icon color while preserving every existing editor interaction and visual rule outside that state.

**Architecture:** Add one Multi-select-only class token at the existing `EditorToolbar` render boundary, without changing its selected-state calculation, ARIA output, callback, or tool list. Add one `.planner-editor-shell`-scoped CSS rule that combines that token with the existing `aria-pressed="true"` state and overrides only background and foreground color. Lock the render contract with a static-markup Vitest assertion adjacent to the frozen erase-class contract.

**Tech Stack:** TypeScript, React 19, Next.js 16.3, Vitest 3.2, CSS in `app/globals.css`, pnpm 10.22.

## Global Constraints

- Work only in the existing linked worktree `/private/tmp/stardew-planner-editor-shell.GY9iif/worktree`; do not create another worktree.
- Scope the product change to the `Multi-select tool` button rendered by `src/components/editor-toolbar.tsx`.
- Apply the red styling only when that button has its existing `aria-pressed="true"` state.
- Use exactly `background: rgb(177 58 40 / 15%)` and `color: #b13a28` for that state.
- Keep `aria-label="Multi-select tool"` and `aria-pressed` as the existing accessibility contract; do not introduce a separate selected-state source.
- Do not change Cursor, Erase, Fill, Wheel Zoom, Undo, Redo, tool availability, callback behavior, keyboard shortcuts, map selection, placement, Toasts, the material panel, or any other page.
- Do not modify the existing generic hover rule, focus-visible rules, or disabled rules. The selected Multi-select rule deliberately follows the generic hover rule, so an already selected Multi-select retains `background: rgb(177 58 40 / 15%)` and `color: #b13a28` while hovered; an unselected Multi-select retains the existing generic hover appearance.
- Do not change layout, dimensions, spacing, grouping, icons, labels, borders, border radii, or responsive rules.
- Do not extract a reusable destructive-state component, CSS variable, abstraction, or future extension point.
- Add no dependency and read no Next.js API documentation: this task changes no Next.js API.
- Follow high cohesion, low coupling, single responsibility, interface boundaries, KISS, Fail Fast, and YAGNI.
- Use precise names; do not introduce identifiers named `data`, `temp`, `helper`, `util`, or `manager`; do not silently catch or suppress errors.

---

## File Structure

- `src/components/editor-toolbar.tsx` — owns the rendered class list for each editor tool button; add the marker only to the `multi-select` tool control.
- `app/globals.css` — owns scoped editor-shell toolbar presentation; add the two confirmed declarations after the generic active button rule.
- `tests/components/editor-controls.test.tsx` — owns static-markup contracts for toolbar controls; add one marker-and-ARIA regression test beside the erase-class contract.

### Task 1: Add the Multi-select-only selected visual hook

**Files:**
- Modify: `src/components/editor-toolbar.tsx:56-76`.
- Modify: `app/globals.css:1913-1928`.
- Test: `tests/components/editor-controls.test.tsx:101-146` (new test inserted immediately after the frozen erase button-class test that ends at current line 99).

**Interfaces:**
- Consumes: `EditorToolbarProperties.tool: EditorTool`, the existing `isSelected: boolean` computed from `tool === editorToolControl.tool`, and the existing button attributes `aria-label={editorToolControl.label}` and `aria-pressed={isSelected}`.
- Produces: the literal `multi-select` class token only for `editorToolControl.tool === "multi-select"`; the token is present for both selected and unselected Multi-select markup.
- Produces: the CSS selector `.planner-editor-shell .tool-btn.multi-select[aria-pressed="true"]`, which consumes the existing ARIA state and changes only `background` and `color`.
- Preserves: `onToolChange(editorToolControl.tool)`, `editorToolAvailability`, the `active` class calculation, and every other tool button class token and DOM attribute.

- [ ] **Step 1: Write the failing static-markup regression test**

Append this test to `tests/components/editor-controls.test.tsx` after the existing erase button-class test. It requires a Multi-select-specific marker while proving the existing `aria-pressed` values and Cursor class list stay unchanged.

```tsx
  it("adds a Multi-select-specific styling hook without changing selected semantics", () => {
    const inactiveToolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "cursor",
      }),
    );
    const selectedToolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "multi-select",
      }),
    );
    const inactiveMultiSelectClassName = inactiveToolbarMarkup.match(
      /<button aria-label="Multi-select tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];
    const selectedMultiSelectClassName = selectedToolbarMarkup.match(
      /<button aria-label="Multi-select tool" aria-pressed="true" class="([^"]+)"/,
    )?.[1];
    const selectedCursorClassName = selectedToolbarMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];

    expect(new Set(inactiveMultiSelectClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "multi-select"]),
    );
    expect(new Set(selectedMultiSelectClassName?.split(" "))).toEqual(
      new Set([
        "tool-btn",
        "editor-toolbar__button",
        "multi-select",
        "active",
      ]),
    );
    expect(new Set(selectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button"]),
    );
  });
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
pnpm exec vitest run tests/components/editor-controls.test.tsx --reporter=verbose
```

Expected: FAIL in `adds a Multi-select-specific styling hook without changing selected semantics`. Before the implementation, both Multi-select class lists lack the required `multi-select` token; the received selected class set is `tool-btn`, `editor-toolbar__button`, and `active`.

- [ ] **Step 3: Add the one tool-specific marker without changing selection logic**

In `src/components/editor-toolbar.tsx`, replace only the opening portion of the existing `className` template at lines 60-66 with the following. Keep the `erase`, `fill`, and `active` branches exactly as shown, and do not change `aria-pressed`, `disabled`, or `onClick`.

```tsx
        className={`tool-btn editor-toolbar__button${
          editorToolControl.tool === "multi-select" ? " multi-select" : ""
        }${
          editorToolControl.tool === "erase"
            ? ` erase-hover${isSelected ? " erase" : ""}`
            : ""
        }${editorToolControl.tool === "fill" ? " fill" : ""}${
          isSelected ? " active" : ""
        }`}
```

- [ ] **Step 4: Add the precise selected-state presentation rule**

In `app/globals.css`, insert this rule directly after the existing generic `.planner-editor-shell .tool-btn.active` rule at line 1926 and before the existing `.planner-editor-shell .tool-btn.erase` rule. The selector is deliberately limited by the editor shell, the new tool-only class, and the existing ARIA state; do not add border, layout, hover, focus, or disabled declarations. This order preserves the user-adjudicated result: an already selected Multi-select keeps its red background and foreground while hovered, while an unselected Multi-select retains the existing generic hover appearance.

```css
.planner-editor-shell .tool-btn.multi-select[aria-pressed="true"] {
  background: rgb(177 58 40 / 15%);
  color: #b13a28;
}
```

- [ ] **Step 5: Run the focused test to verify GREEN**

Run:

```bash
pnpm exec vitest run tests/components/editor-controls.test.tsx --reporter=verbose
```

Expected: PASS with 4 tests. The new test finds `multi-select` for both ARIA states, keeps `aria-pressed="true"` only for the selected Multi-select control, and confirms Cursor has no Multi-select marker.

- [ ] **Step 6: Run the related toolbar regression set**

Run:

```bash
pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/editor-shell.test.tsx
```

Expected: PASS with 2 files and 19 tests. This retains the frozen Erase class contract, wheel-zoom toggle ARIA contract, every original editing tool, and Undo/Redo disabled markup checks.

- [ ] **Step 7: Run static type validation**

Run:

```bash
pnpm typecheck
```

Expected: PASS with exit code 0 and no TypeScript diagnostics.

- [ ] **Step 8: Run the production build**

Run:

```bash
pnpm build
```

Expected: PASS with exit code 0 after the Next.js production build completes.

- [ ] **Step 9: Verify the interactive visual state in the local browser**

If the current worktree is not already served on port 3002, start it in a separate terminal:

```bash
pnpm dev -- --port 3002
```

Using the local Hermes CDP browser, open `http://127.0.0.1:3002/#planner` and wait until the editor toolbar is interactive. Click `Multi-select tool` and verify its button has background `rgb(177 58 40 / 15%)` and icon/foreground color `#b13a28`, including while hovered. Then click `Cursor tool` and verify the Multi-select button immediately loses both red declarations and returns to the existing unselected hover appearance, Cursor retains its existing selected appearance, and the Erase, Wheel Zoom, Undo, Redo, toolbar dimensions, toolbar grouping, focus behavior, and keyboard interactions remain unchanged.

- [ ] **Step 10: Commit the implementation files**

Run:

```bash
git add src/components/editor-toolbar.tsx app/globals.css tests/components/editor-controls.test.tsx
git commit -m "fix: highlight selected multi-select tool"
```

Expected: one commit containing only the marker, the scoped two-property CSS rule, and the directly corresponding toolbar regression test.

## Execution Handoff

Implement the single task sequentially with the prescribed RED, minimal implementation, GREEN, regression, typecheck, build, browser, and commit evidence. Do not begin a second task or broaden the file set.
