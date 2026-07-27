# Planner Shell Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the local planner's desktop and mobile shell match the fixed public reference's full-screen canvas, fixed catalog rail, floating tools, and collapsed menu while retaining the confirmed local-only save flow.

**Architecture:** Keep all planning state and Pixi map rendering in their existing modules. Introduce a small, presentational shell contract that controls only layout and menu visibility; the catalog, toolbar, and menus continue communicating through their existing props. CSS owns visual positioning and breakpoints, while React owns menu state and accessible controls.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, PixiJS 8, existing local game assets.

## Global Constraints

- Remain a static Next.js export with no API route, Server Action, database, authentication, payment, or cloud storage.
- Preserve browser-local projects and JSON import/export; do not expose sharing, feedback, support, membership, or payment UI.
- Use existing locked assets only; no runtime dependency on `stardewplan.com`.
- Keep functions single-purpose, validate public boundaries fail-fast, and use precise domain names.
- Do not add speculative abstractions or a second editor-state system.
- Verify desktop at 1280px and mobile at 390px after every visual task.

---

### Task 1: Define the reference shell controls

**Files:**

- Modify: `src/components/editor-toolbar.tsx`
- Modify: `src/components/editor-menu-bar.tsx`
- Modify: `src/editor/editor-view-state.ts`
- Test: `tests/components/editor-shell.test.tsx`
- Test: `tests/editor/editor-view-state.test.ts`

**Interfaces:**

- Consumes: `EditorTool`, `EditorModalId`, existing toolbar undo/redo callbacks.
- Produces: `EditorMenuBar` with one menu-toggle callback and `EditorToolbar` containing cursor, multi-select, erase, undo, and redo controls.

- [x] **Step 1: Write failing component assertions for the reference-visible shell.**

```tsx
expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Cursor tool" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Multi-select tool" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Erase tool" })).toBeInTheDocument();
expect(screen.queryByRole("button", { name: "Fill tool" })).not.toBeInTheDocument();
```

- [x] **Step 2: Run the targeted component test and confirm the missing Menu assertion fails.**

Run: `pnpm test --run tests/components/editor-shell.test.tsx`

Expected: FAIL because the current menu actions are always visible and no Menu control exists.

- [x] **Step 3: Add the minimum state and presentation change.**

```ts
export type EditorMenuVisibility = "collapsed" | "expanded";

export function toggleEditorMenuVisibility(
  editorMenuVisibility: EditorMenuVisibility,
): EditorMenuVisibility {
  return editorMenuVisibility === "collapsed" ? "expanded" : "collapsed";
}
```

Render `Menu` separately from the expanded Season, Map, View, Save, and Settings actions. Keep Fill callable through the existing `F` shortcut and do not remove its controller or state type.

- [x] **Step 4: Run the targeted component and state tests.**

Run: `pnpm test --run tests/components/editor-shell.test.tsx tests/editor/editor-view-state.test.ts`

Expected: PASS.

### Task 2: Rebuild catalog-rail markup without changing catalog data

**Files:**

- Modify: `src/components/item-catalog-panel.tsx`
- Test: `tests/components/item-catalog-panel.test.tsx`

**Interfaces:**

- Consumes: existing `CatalogItem`, category, selection, and search callbacks.
- Produces: a fixed-rail-ready catalog header with category buttons and a `Search...` field.

- [x] **Step 1: Write a failing test for reference text and visual category contracts.**

```tsx
expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
expect(screen.getByRole("tab", { name: "Buildings" })).toBeInTheDocument();
```

- [x] **Step 2: Run the targeted catalog test and confirm it fails on the placeholder.**

Run: `pnpm test --run tests/components/item-catalog-panel.test.tsx`

Expected: FAIL because the current field is labelled `Search`.

- [x] **Step 3: Implement presentational rail controls.**

Use existing category names and callbacks. Change the input placeholder to the reference text and leave filter behavior to the catalog-filter feature plan; do not add a non-working filter button.

- [x] **Step 4: Run the targeted test.**

Run: `pnpm test --run tests/components/item-catalog-panel.test.tsx`

Expected: PASS.

### Task 3: Place the planner shell in the reference desktop geometry

**Files:**

- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/routes/planner-editor-page.test.tsx`
- Test: `tests/components/editor-shell.test.tsx`

**Interfaces:**

- Consumes: `EditorMenuBar`, `EditorToolbar`, `ItemCatalogPanel`, and `PlannerCanvas` without changing their domain callbacks.
- Produces: a full-screen planner where the left catalog rail is fixed, tools float above the map, and expanded menu actions float from Menu.

- [x] **Step 1: Write failing shell-layout assertions.**

```tsx
expect(container.querySelector(".planner-workspace__catalog-rail")).not.toBeNull();
expect(container.querySelector(".planner-workspace__floating-toolbar")).not.toBeNull();
expect(container.querySelector(".planner-workspace__menu-popover")).toBeNull();
```

- [x] **Step 2: Run the targeted route/component tests and confirm the new shell classes are absent.**

Run: `pnpm test --run tests/routes/planner-editor-page.test.tsx tests/components/editor-shell.test.tsx`

Expected: FAIL because the current header/grid shell uses `.planner-workspace__topbar` and bottom catalog placement by default.

- [x] **Step 3: Implement the desktop shell.**

Keep `PlannerCanvas` mounted as the map surface. Position the catalog rail at the left edge (340px wide), float tools at the top-center, hide the textual product heading from the interactive planner, and use the existing dark green tokens adjusted to the observed reference palette. Set the desktop default to the left rail without changing stored user preferences until a deliberate preference migration is implemented.

- [x] **Step 4: Run targeted tests, then inspect a 1280px browser screenshot.**

Run: `pnpm test --run tests/routes/planner-editor-page.test.tsx tests/components/editor-shell.test.tsx`

Expected: PASS.

Browser check: map fills the remaining viewport, the catalog is vertical and left-aligned, and no title/header consumes a horizontal page band.

### Task 4: Implement the separate mobile composition

**Files:**

- Modify: `app/globals.css`
- Test: `tests/components/planner-joystick.test.tsx`
- Browser: 390px visual regression check (the responsive change is CSS-only)

**Interfaces:**

- Consumes: existing joystick and catalog components.
- Produces: a mobile layout where floating controls remain reachable, the map remains the primary viewport, and the catalog stays below the map without desktop rail overflow.

- [x] **Step 1: Confirm the existing markup contract before changing CSS.**

Run: `pnpm test --run tests/components/editor-shell.test.tsx tests/components/planner-joystick.test.tsx`

Expected: PASS. The desktop rail wrapper and touch joystick already exist; a contrived new markup class would not prove responsive behavior.

- [x] **Step 2: Implement only breakpoint-specific CSS.**

At `max-width: 640px`, stack the map and catalog, move the floating toolbar away from the safe-area edge, preserve the touch joystick, and prevent horizontal scrolling. Do not fork planning state or canvas event handling for mobile.

- [x] **Step 3: Run targeted tests and inspect a 390px browser screenshot.**

Run: `pnpm test --run tests/components/editor-shell.test.tsx tests/components/planner-joystick.test.tsx`

Expected: PASS.

Browser check: no header overlap, no clipped menu trigger, no horizontal overflow, and all four pan controls remain visible.

### Task 5: Run shell regression verification

**Files:**

- Modify: `tests/routes/planner-editor-page.test.tsx` only if an observed shell contract lacks a test.

**Interfaces:**

- Consumes: all prior shell interfaces.
- Produces: evidence that the visual shell did not alter editor data or static export.

- [ ] **Step 1: Run type checking.**

Run: `pnpm typecheck`

Expected: PASS with no TypeScript errors.

- [ ] **Step 2: Run the full test suite without a concurrent build.**

Run: `pnpm test --run`

Expected: PASS with every test file passing.

- [ ] **Step 3: Run the production static build.**

Run: `pnpm build`

Expected: PASS and emit all retained public routes.

- [ ] **Step 4: Browser-test the two reference viewport states.**

Desktop: 1280px reference/local screenshots show the rail, floating toolbar, and collapsed menu alignment.

Mobile: 390px reference/local screenshots show map-first composition, catalog access, and directional touch controls.

## Self-review

- Scope coverage: this plan covers only the editor shell and responsive visual gap. It deliberately does not claim to complete map instances, group copy, wallpaper, Paint, light sources, or public-page copy parity; those remain separate plans.
- Placeholder scan: no implementation task has an unspecified error path; catalog filtering remains out of this shell-only plan rather than being represented by a non-working control.
- Type consistency: `EditorMenuVisibility` is the only new state contract; shell components retain their existing editor callback interfaces.
