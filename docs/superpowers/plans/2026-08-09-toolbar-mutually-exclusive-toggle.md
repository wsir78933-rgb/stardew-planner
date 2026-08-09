# Toolbar Mutually Exclusive Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Cursor, Multi-select, Erase, and Zoom a single mutually
exclusive, deselectable toolbar selection while deriving wheel zoom from that
one nullable tool value.

**Architecture:** Extend the existing `EditorTool` union with `"zoom"`, and
propagate `EditorTool | null` through editor view state, workspace reducer
state, toolbar props, and click/rectangle controller inputs. `PlannerWorkspace`
continues to orchestrate normal tool changes; it derives the canvas wheel flag
from `tool === "zoom"` and gives null/Zoom navigate priority. The current
tool-specific red CSS selectors stay unchanged and activate through the
toolbar's existing `aria-pressed` markup.

**Tech Stack:** TypeScript, React 19, Next.js 16.3, Vitest 3, pnpm 10, existing
CSS, local Hermes CDP browser.

## Global Constraints

- Use the single `EditorTool` value domain and add `"zoom"`; selection state is
  `EditorTool | null` everywhere it crosses a state, reducer, toolbar, or
  editing-controller boundary.
- Keep `createInitialEditorViewState()` and
  `createInitialPlannerWorkspaceState()` at `tool: "cursor"`.
- A toolbar click sends its tool value when unselected and `null` when the same
  tool is already selected. Do not restore a previous tool or retain hidden
  selection state.
- `PlannerCanvas.wheelZoomEnabled` must be exactly
  `plannerWorkspaceState.tool === "zoom"`. Remove workspace
  `isWheelZoomEnabled`, its setter, the toolbar `wheelZoomEnabled` prop, and
  the toolbar `onWheelZoomToggle` prop.
- Zoom must call the existing `handleOrdinaryToolChange` path. That path must
  continue to cancel active interior decor and pending duplicate before it
  delegates to normal tool selection.
- The editing controller must accept `null` and `"zoom"` but return the
  unchanged transition for valid click and rectangle input. Invalid non-null
  values must still fail fast with the received value.
- For null and Zoom, choose `pointerInteractionMode: "navigate"` before
  rectangle or move-selected branches.
- Preserve existing catalog behavior: Cursor clears its ordinary catalog
  selection; Multi-select, Fill, Erase, Zoom, and null retain the existing
  behavior. Undo/Redo must not change tool selection.
- Do not modify `app/globals.css`, `src/components/planner-canvas.tsx`,
  reference-runtime code, layout, size, rounding, icons, labels, shortcuts,
  or any dependency/configuration. Existing selected CSS supplies the required
  red background `rgb(177 58 40 / 15%)` and foreground `#b13a28`.
- Work only in
  `/private/tmp/stardew-planner-editor-shell.GY9iif/worktree`; do not create a
  worktree.

---

## File Structure

- `src/editor/editor-view-state.ts` — owns the complete literal tool domain,
  nullable editor view-state selection, validation, availability, and initial
  Cursor selection.
- `src/planner/planner-workspace-state.ts` — exposes the nullable tool through
  workspace reducer state and the `select-tool` action without coupling it to
  placement history.
- `src/planner/planner-workspace-editing-controller.ts` — validates nullable
  input and returns unchanged click/rectangle transitions for null/Zoom while
  preserving existing ordinary catalog behavior.
- `src/components/editor-toolbar.tsx` — renders the controlled, mutually
  exclusive buttons and emits a selected tool or null; Zoom remains in its
  current DOM group but no longer owns a separate toggle contract.
- `src/components/planner-workspace.tsx` — keeps ordinary-tool orchestration,
  removes separate wheel state, derives canvas wheel zoom, and gives null/Zoom
  navigation priority.
- `tests/editor/editor-view-state.test.ts` — locks the `"zoom"` and null
  editor selection contract and initial Cursor state.
- `tests/planner/planner-workspace-state.test.ts` — locks nullable reducer
  selection and proves Undo/Redo do not participate in tool selection.
- `tests/components/planner-workspace.editing.integration.test.tsx` — locks
  controller no-op references and catalog/preview compatibility for null/Zoom.
- `tests/components/editor-controls.test.tsx` — locks single-true-or-none
  toolbar markup, preserved Zoom DOM marker, and the existing selected CSS
  contract.

`app/globals.css` and `src/components/planner-canvas.tsx` are verify-only
dependencies. Do not list them in the implementation commit.

### Task 1: Establish one nullable EditorTool domain and controller no-op contract

**Files:**

- Modify: `src/editor/editor-view-state.ts:6-58, 125-139, 201-247`
- Modify: `src/planner/planner-workspace-state.ts:61-78, 80-145, 545-553, 734-758`
- Modify: `src/planner/planner-workspace-editing-controller.ts:1-7, 55-68, 131-194, 531-559, 729-740`
- Test: `tests/editor/editor-view-state.test.ts`
- Test: `tests/planner/planner-workspace-state.test.ts`
- Test: `tests/components/planner-workspace.editing.integration.test.tsx`

**Interfaces:**

- Consumes: the current `editorTools` literal union and existing controller
  transition shape
  `Readonly<{ placementHistory: PlacementHistory<PlacementSnapshot>; selectedPlacementKeys: readonly PlacementSelectionKey[]; }>`.
- Produces: `EditorTool = "cursor" | "multi-select" | "fill" | "erase" | "zoom"`,
  `EditorViewState["tool"] = EditorTool | null`,
  `PlannerWorkspaceState["tool"] = EditorTool | null`, and nullable tool
  inputs to `selectEditorTool`, `getPlannerWorkspaceToolSelection`,
  `PlannerWorkspaceMapTileClickInput`, and
  `PlannerWorkspaceMapTileRectangleInput`.
- Preserves: Cursor as initial state; existing Fill/Cursor/Multi-select/Erase
  controller behavior; catalog-item/choice validation; placement-history
  reducer behavior; error values for unknown non-null tools.

- [ ] **Step 1: Write the failing domain, reducer, and no-op tests**

  In `tests/editor/editor-view-state.test.ts`, add this test after the current
  available-tools test. Keep the existing imports; `selectEditorTool` and
  `createInitialEditorViewState` are already imported.

  ```ts
  it("keeps Cursor initial while accepting Zoom and no selected tool", () => {
    const initialEditorViewState = createInitialEditorViewState();
    const zoomEditorViewState = selectEditorTool(
      initialEditorViewState,
      "zoom",
    );
    const noToolEditorViewState = selectEditorTool(zoomEditorViewState, null);

    expect(initialEditorViewState.tool).toBe("cursor");
    expect(zoomEditorViewState.tool).toBe("zoom");
    expect(noToolEditorViewState.tool).toBeNull();
  });
  ```

  In `tests/planner/planner-workspace-state.test.ts`, add this test after the
  existing editor/menu/delegation test. `reducePlannerWorkspaceState` and
  `createInitialPlannerWorkspaceState` are already imported.

  ```ts
  it("keeps nullable tool selection outside Undo and Redo history", () => {
    const initialWorkspaceState = createInitialPlannerWorkspaceState();
    const zoomWorkspaceState = reducePlannerWorkspaceState(
      initialWorkspaceState,
      { tool: "zoom", type: "select-tool" },
    );
    const noToolWorkspaceState = reducePlannerWorkspaceState(
      zoomWorkspaceState,
      { tool: null, type: "select-tool" },
    );
    const undoneWorkspaceState = reducePlannerWorkspaceState(
      noToolWorkspaceState,
      { type: "undo-placement-history" },
    );
    const redoneWorkspaceState = reducePlannerWorkspaceState(
      undoneWorkspaceState,
      { type: "redo-placement-history" },
    );

    expect(initialWorkspaceState.tool).toBe("cursor");
    expect(zoomWorkspaceState.tool).toBe("zoom");
    expect(noToolWorkspaceState.tool).toBeNull();
    expect(undoneWorkspaceState.tool).toBeNull();
    expect(redoneWorkspaceState.tool).toBeNull();
  });
  ```

  In `tests/components/planner-workspace.editing.integration.test.tsx`, add
  this test at the start of `planner workspace basic editing orchestration`.
  It uses the established valid `createEditingInput()` fixture, so an unchanged
  result proves a tool no-op rather than an invalid-input shortcut.

  ```tsx
  it("leaves valid click and rectangle input unchanged for no tool and Zoom", () => {
    const initialEditingInput = createEditingInput();

    for (const tool of [null, "zoom"] as const) {
      const clickTransition = applyPlannerWorkspaceMapTileClick({
        ...initialEditingInput,
        cursorTile: { x: 1, y: 1 },
        tool,
      });
      const rectangleTransition = applyPlannerWorkspaceMapTileRectangle({
        ...initialEditingInput,
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 1, y: 1 },
        tool,
      });

      expect(clickTransition.placementHistory).toBe(
        initialEditingInput.placementHistory,
      );
      expect(clickTransition.selectedPlacementKeys).toBe(
        initialEditingInput.selectedPlacementKeys,
      );
      expect(rectangleTransition.placementHistory).toBe(
        initialEditingInput.placementHistory,
      );
      expect(rectangleTransition.selectedPlacementKeys).toBe(
        initialEditingInput.selectedPlacementKeys,
      );
    }
  });
  ```

- [ ] **Step 2: Run the focused tests and verify RED**

  Run:

  ```bash
  pnpm exec vitest run tests/editor/editor-view-state.test.ts tests/planner/planner-workspace-state.test.ts tests/components/planner-workspace.editing.integration.test.tsx
  ```

  Expected: FAIL. `"zoom"` is not in `editorTools`, so the editor view-state
  and workspace reducer tests throw the current unavailable/invalid tool
  error. The controller test also throws because its current validator accepts
  only Cursor, Multi-select, Fill, and Erase; `null` and `"zoom"` cannot yet
  reach the unchanged transition.

- [ ] **Step 3: Implement the nullable single-domain state and strict no-op boundary**

  In `src/editor/editor-view-state.ts`, add `"zoom"` to the one literal
  `editorTools` array and add `zoom: true` to `editorToolAvailability`. Change
  only the tool selection type boundary, retaining the existing initial value:

  ```ts
  export type EditorViewState = Readonly<{
    season: TilesheetSeason;
    mapId: string;
    tool: EditorTool | null;
    catalogCategory: EditorCatalogCategory;
    panelPosition: EditorPanelPosition;
    modalId: EditorModalId | null;
  }>;

  export function selectEditorTool(
    editorViewState: EditorViewState,
    tool: EditorTool | null,
  ): EditorViewState {
    validateEditorViewState(editorViewState);
    validateEditorTool(tool);

    if (tool !== null && !editorToolAvailability[tool]) {
      throw new Error(`Editor tool is unavailable: ${formatValue(tool)}.`);
    }

    return { ...editorViewState, tool };
  }

  function validateEditorTool(tool: EditorTool | null): void {
    if (tool === null) {
      return;
    }
    if (!editorTools.includes(tool)) {
      throw new TypeError(
        `Editor tool must be null or one of ${editorTools.join(", ")}. Received: ${formatValue(tool)}.`,
      );
    }
  }
  ```

  Keep `createInitialEditorViewState()` at `tool: "cursor"`. Its existing
  `validateEditorViewState` call must continue to use `validateEditorTool`, so
  every state transition validates the same nullable domain.

  In `src/planner/planner-workspace-state.ts`, make only these type signatures
  nullable and let the existing `selectEditorTool` delegation do the work:

  ```ts
  // In PlannerWorkspaceState, replace only this field:
  tool: EditorTool | null;

  // In PlannerWorkspaceAction, replace only this union member:
  | Readonly<{ type: "select-tool"; tool: EditorTool | null }>;

  function selectWorkspaceTool(
    plannerWorkspaceState: PlannerWorkspaceState,
    tool: EditorTool | null,
  ): PlannerWorkspaceState {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectEditorTool(createEditorViewState(plannerWorkspaceState), tool),
    );
  }
  ```

  Keep `createEditorViewState` and `applyEditorViewState` as the existing
  projection boundary, with their `tool` fields now inferred as nullable. Do
  not add any history action or tool-restoration logic.

  In `src/planner/planner-workspace-editing-controller.ts`, import the runtime
  `editorTools` value beside `EditorTool`, make both input `tool` fields and
  `getPlannerWorkspaceToolSelection` accept `EditorTool | null`, and keep the
  existing dispatch fall-through as the no-op implementation. Replace the
  duplicated four-value validator with this precise nullable validator, and
  call it from both input assertions:

  ```ts
  import { editorTools, type EditorTool } from "../editor/editor-view-state";

  function assertEditorToolSelection(
    editorTool: EditorTool | null,
  ): void {
    if (editorTool === null) {
      return;
    }
    if (!editorTools.includes(editorTool)) {
      throw new TypeError(
        `Planner workspace editing tool selection must be null or one of ${editorTools.join(", ")}; received ${describeValue(editorTool)}.`,
      );
    }
  }
  ```

  The click dispatcher already handles only `"cursor"` and `"erase"`, and
  the rectangle dispatcher already handles only `"multi-select"`, `"fill"`,
  and `"erase"`. Leave those branches unchanged so `null` and `"zoom"` fall
  through to `createUnchangedTransition`. Keep
  `getPlannerWorkspaceToolSelection` clearing the catalog only for
  `"cursor"`; its existing return branch preserves the selected catalog item
  for null and Zoom.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run:

  ```bash
  pnpm exec vitest run tests/editor/editor-view-state.test.ts tests/planner/planner-workspace-state.test.ts tests/components/planner-workspace.editing.integration.test.tsx
  ```

  Expected: PASS. Zoom and null are valid selection values, initial Cursor is
  unchanged, Undo/Redo preserve nullable tool state, null/Zoom click and
  rectangle transitions retain both exact input references, and existing
  controller behavior remains green.

- [ ] **Step 5: Check the focused diff and commit the domain/controller task**

  Run:

  ```bash
  git diff --check
  git add src/editor/editor-view-state.ts src/planner/planner-workspace-state.ts src/planner/planner-workspace-editing-controller.ts tests/editor/editor-view-state.test.ts tests/planner/planner-workspace-state.test.ts tests/components/planner-workspace.editing.integration.test.tsx
  git commit -m "feat: unify editor tool selection state"
  ```

  Expected: the focused RED/GREEN suite remains green, `git diff --check`
  reports no whitespace errors, and the commit contains only Task 1 source and
  tests. Defer repository-wide `pnpm typecheck` until Task 2: this task makes
  the state boundary nullable, while Task 2 changes the existing
  `EditorToolbar` and workspace JSX consumers from non-null to nullable. Do
  not claim a repository-wide typecheck result before that integration task.

### Task 2: Integrate the controlled toolbar, workspace-derived Zoom, and existing CSS

**Files:**

- Modify: `src/components/editor-toolbar.tsx:16-24, 42-122`
- Modify: `src/components/planner-workspace.tsx:209-237, 541-545, 700-761, 795-828`
- Test: `tests/components/editor-controls.test.tsx`
- Test: `tests/components/planner-workspace.editing.integration.test.tsx`

**Interfaces:**

- Consumes: Task 1's `EditorTool | null` state/action/controller contract;
  existing CSS selectors for Cursor, Zoom, Multi-select, and Erase; existing
  `cancelInteriorDecorBeforeOrdinaryWorkspaceAction`; and the unchanged
  `PlannerCanvas` props `wheelZoomEnabled?: boolean` and
  `pointerInteractionMode?: "navigate" | "rectangle" | "move-selected"`.
- Produces: `EditorToolbar` props
  `tool: EditorTool | null` and
  `onToolChange: (tool: EditorTool | null) => void`, a Zoom `aria-pressed`
  value derived from that same tool, and workspace canvas props derived from
  `plannerWorkspaceState.tool`.
- Preserves: toolbar DOM order, groups, classes, data marker, visible Zoom
  text, labels, icons, styles, existing ordinary-tool cancellation order,
  catalog selection behavior, and the four existing red CSS rules.

- [ ] **Step 1: Write the failing toolbar and workspace integration tests**

  In `tests/components/editor-controls.test.tsx`, replace the tests that pass
  `wheelZoomEnabled` and `onWheelZoomToggle` with this helper and test. It
  continues to use the repository's static-markup test style and makes the
  formerly impossible `tool: "zoom"` markup assertion the RED condition.

  ```tsx
  function renderToolbar(
    tool: Parameters<typeof EditorToolbar>[0]["tool"],
  ): string {
    return renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool,
      }),
    );
  }

  it("renders exactly one visible selected tool or no selection", () => {
    const cases = [
      { expectedPressedLabels: [], tool: null },
      { expectedPressedLabels: ["Cursor tool"], tool: "cursor" },
      { expectedPressedLabels: ["Multi-select tool"], tool: "multi-select" },
      { expectedPressedLabels: ["Erase tool"], tool: "erase" },
      { expectedPressedLabels: ["Disable wheel zoom"], tool: "zoom" },
    ] as const;

    for (const toolbarCase of cases) {
      const markup = renderToolbar(toolbarCase.tool);
      const pressedLabels = Array.from(
        markup.matchAll(/aria-label="([^"]+)" aria-pressed="true"/g),
        ([, ariaLabel]) => ariaLabel,
      );

      expect(pressedLabels).toEqual(toolbarCase.expectedPressedLabels);
    }

    const zoomMarkup = renderToolbar("zoom");
    expect(zoomMarkup).toContain(
      'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
    );
    expect(zoomMarkup).toContain(
      'data-reference-runtime-wheel-zoom-button="true"',
    );
  });
  ```

  Keep the existing CSS-contract assertions, but delete the historical
  simultaneous Cursor/Zoom test. Its independent-two-true expectation is
  explicitly obsolete. Update every remaining `EditorToolbar` fixture to pass
  only `tool`, `onToolChange`, Undo/Redo callbacks, and history availability;
  it must not pass wheel-toggle props.

  In the existing preview test in
  `tests/components/planner-workspace.editing.integration.test.tsx`, add both
  assertions after its current Fill assertion:

  ```tsx
  expect(createWorkspaceCatalogPlacementPreviewInput({
    buildingMetadataById: {},
    freePlacement: true,
    selectedCatalogItem: { catalogItem: selectedCatalogItem, presentationChoice },
    tool: "zoom",
  })).toBeNull();
  expect(createWorkspaceCatalogPlacementPreviewInput({
    buildingMetadataById: {},
    freePlacement: true,
    selectedCatalogItem: { catalogItem: selectedCatalogItem, presentationChoice },
    tool: null,
  })).toBeNull();
  ```

- [ ] **Step 2: Run the focused tests and verify RED**

  Run:

  ```bash
  pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/planner-workspace.editing.integration.test.tsx
  ```

  Expected: FAIL. The current toolbar still derives Zoom from its separate
  default-false `wheelZoomEnabled` prop, so `renderToolbar("zoom")` contains
  no true Zoom button and retains the Enable label. The task's updated fixtures
  also expose the obsolete wheel-toggle interface during typecheck.

- [ ] **Step 3: Implement the controlled toolbar and workspace derivation**

  In `src/components/editor-toolbar.tsx`, remove only
  `wheelZoomEnabled` and `onWheelZoomToggle` from the prop type and function
  parameters. Keep the current four ordinary controls, classes, group order,
  labels, and icons. Make their click behavior emit null when selected:

  ```tsx
  type EditorToolbarProperties = Readonly<{
    tool: EditorTool | null;
    onToolChange: (tool: EditorTool | null) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  }>;

  onClick={() =>
    onToolChange(isSelected ? null : editorToolControl.tool)
  }
  ```

  Leave Zoom in its current group and use the same controlled state, retaining
  its exact class, data marker, and visible text:

  ```tsx
  const isZoomSelected = tool === "zoom";

  <button
    aria-label={isZoomSelected ? "Disable wheel zoom" : "Enable wheel zoom"}
    aria-pressed={isZoomSelected}
    className="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"
    data-reference-runtime-wheel-zoom-button="true"
    onClick={() => onToolChange(isZoomSelected ? null : "zoom")}
    title={isZoomSelected ? "Disable wheel zoom" : "Enable wheel zoom"}
    type="button"
  >
    Zoom
  </button>
  ```

  In `src/components/planner-workspace.tsx`, make the placement-preview input
  type nullable, remove the independent state declaration, remove both old
  toolbar wheel props, and derive the existing canvas prop exactly as follows:

  ```tsx
  export function createWorkspaceCatalogPlacementPreviewInput(
    input: Readonly<{
      buildingMetadataById: BuildingPlacementMetadataById | null;
      freePlacement: boolean;
      selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
      tool: EditorTool | null;
    }>,
  ): PlannerCanvasPlacementPreviewInput | null {
    if (
      input.tool !== "cursor" ||
      input.buildingMetadataById === null ||
      input.selectedCatalogItem === null
    ) {
      return null;
    }
    return {
      buildingMetadataById: input.buildingMetadataById,
      catalogPresentationChoice: input.selectedCatalogItem.presentationChoice,
      freePlacement: input.freePlacement,
      ...(input.selectedCatalogItem.resolvedCompositeVariant === undefined
        ? {}
        : {
            resolvedCompositeVariant:
              input.selectedCatalogItem.resolvedCompositeVariant,
          }),
      selectedCatalogItem: input.selectedCatalogItem.catalogItem,
    };
  }

  <EditorToolbar
    canRedo={plannerWorkspaceState.placementHistory.redoStates.length > 0}
    canUndo={plannerWorkspaceState.placementHistory.undoStates.length > 0}
    onRedo={() =>
      plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
        type: "redo-placement-history",
      })
    }
    onToolChange={handleOrdinaryToolChange}
    onUndo={() =>
      plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
        type: "undo-placement-history",
      })
    }
    tool={plannerWorkspaceState.tool}
  />

  wheelZoomEnabled={plannerWorkspaceState.tool === "zoom"}
  pointerInteractionMode={
    plannerWorkspaceState.tool === null ||
    plannerWorkspaceState.tool === "zoom"
      ? "navigate"
      : plannerWorkspaceState.tool === "multi-select" ||
          plannerWorkspaceState.tool === "fill" ||
          plannerWorkspaceState.tool === "erase"
        ? "rectangle"
        : plannerWorkspaceState.selectedPlacementKeys.length > 0
          ? "move-selected"
          : "navigate"
  }
  ```

  Replace only the two named `PlannerCanvas` prop expressions with the second
  fragment above; all other current `PlannerCanvas` props remain literally
  unchanged. Do not add a branch to `handleOrdinaryToolChange`: its existing call to
  `cancelInteriorDecorBeforeOrdinaryWorkspaceAction`, followed by
  `workspaceEditingControls.cancelPendingDuplicateSelection()` and
  `handleToolChange(tool)`, must receive every selected tool and null. This is
  what gives Zoom the established cancellation semantics. Do not alter
  `app/globals.css`; the exact existing true-state selectors match the unchanged
  Cursor/Zoom classes and the new controlled `aria-pressed` values.

- [ ] **Step 4: Run focused UI regressions and verify GREEN**

  Run:

  ```bash
  pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/planner-workspace.editing.integration.test.tsx
  pnpm typecheck
  ```

  Expected: PASS. Each selected visible tool renders one true button, null
  renders none, Zoom retains its existing marker, preview remains Cursor-only,
  no source still supplies toolbar wheel-toggle props, and all nullable
  boundaries typecheck.

- [ ] **Step 5: Run build, full regression suite, and browser acceptance**

  Run:

  ```bash
  pnpm build
  pnpm test -- --run
  ```

  Expected: `pnpm build` passes. The full Vitest run may reproduce only the two
  user-approved unrelated Footer baseline failures in
  `tests/homepage/homepage-style-contract.test.ts` and
  `tests/routes/public-page-style-contract.test.ts`; report the exact count and
  fail if this task introduces any additional failure. If the intermittent
  `tests/resources/local-planner-resource-smoke.test.ts` timeout reappears,
  immediately rerun that file once and report both results rather than treating
  it as part of this task.

  Start the local server from the approved worktree if one is not already
  running:

  ```bash
  pnpm dev --port 3002
  ```

  In the local Hermes CDP browser, open `http://localhost:3002/#planner` and
  wait for the interactive canvas. Verify this exact sequence:

  1. Cursor initially has `aria-pressed="true"`; Multi-select, Erase, and
     Zoom are false. Inspect computed selected-hover colors for Cursor:
     `rgb(177 58 40 / 15%)` background and `#b13a28` foreground.
  2. Click Multi-select, Erase, and Zoom one at a time. For each, inspect the
     toolbar and confirm exactly that button is true and its selected hover
     retains the same red values. Confirm the Zoom button text remains `Zoom`.
  3. Click the selected Cursor, Multi-select, Erase, and Zoom button a second
     time. Each time, all four visible buttons are false and no button becomes
     true as a historical fallback.
  4. In null state, click and drag the canvas with an existing placement
     selected. Confirm it navigates without a placement, erase, rectangle
     selection, or move. Dispatch a wheel event and confirm camera zoom does
     not change.
  5. Select Zoom and dispatch the same wheel event over the canvas. Confirm
     camera zoom changes. Select Cursor or deselect Zoom to null, dispatch the
     event again, and confirm camera zoom remains unchanged.
  6. Arm a duplicate through the existing selected-placement copy UI, select
     Zoom, then click a valid map tile. Confirm no duplicate is placed. On a
     supported interior map, select an ordinary interior-decor pattern, select
     Zoom, then click its target tile. Confirm no decor change is applied.
  7. Make one ordinary placement, select Zoom and then null in separate runs,
     invoke Undo and Redo, and confirm the selected tool remains Zoom or null
     respectively while existing history results remain correct.

- [ ] **Step 6: Check the implementation diff and commit the integration task**

  Run:

  ```bash
  git diff --check
  git status --short
  git add src/components/editor-toolbar.tsx src/components/planner-workspace.tsx tests/components/editor-controls.test.tsx tests/components/planner-workspace.editing.integration.test.tsx
  git commit -m "feat: make toolbar tool selection mutually exclusive"
  git status --short
  ```

  Expected: no whitespace errors; the Task 2 commit contains exactly its two
  product files and two direct tests; final status is empty. Do not stage CSS,
  PlannerCanvas, reference-runtime, configuration, or generated files.

## Plan Self-Review

- **No placeholders:** Complete. Each RED assertion, expected failure, GREEN
  implementation boundary, command, browser sequence, and commit file set is
  explicit. The toolbar callbacks, preview return value, and exact replacement
  Canvas prop expressions are written out; the plan leaves no omitted behavior
  for the implementer to infer.
- **Specification coverage:** Complete. Task 1 implements the one nullable
  domain, Zoom member, initial Cursor, reducer typing, no-op controller,
  strict invalid-value validation, catalog preservation, and Undo/Redo
  separation. Task 2 implements select-or-null clicks, removes independent
  wheel state/props, preserves ordinary cancellation, derives wheel zoom,
  makes null/Zoom navigate first, reuses exact visual rules, and verifies
  browser behavior.
- **Type and naming consistency:** Complete. Every cross-boundary selection is
  `EditorTool | null`; `tool`, `onToolChange`,
  `getPlannerWorkspaceToolSelection`, `wheelZoomEnabled`, and
  `pointerInteractionMode` use the exact names in current source. The only new
  validator name, `assertEditorToolSelection`, describes its nullable input and
  keeps fail-fast behavior explicit.
- **Task-boundary verification:** The Task 1 focused suite is independently
  green, but repository-wide typecheck intentionally runs after Task 2 because
  Task 2 is the direct TypeScript consumer migration for the nullable state.
  The plan names this dependency and never represents Task 1 as a complete
  application build.

## Execution Handoff

Plan complete and saved to
`docs/superpowers/plans/2026-08-09-toolbar-mutually-exclusive-toggle.md`.
Execute Task 1 and Task 2 with `superpowers:subagent-driven-development`
(recommended) or `superpowers:executing-plans`, preserving the RED/GREEN order
and the approved product/test file boundary.
