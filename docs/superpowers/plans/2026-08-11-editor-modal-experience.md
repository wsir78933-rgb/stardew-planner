# Editor Modal Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the editor's Save, View, Settings, and Help modal content to match the current homepage style while preserving all existing behavior.

**Architecture:** Keep the existing modal and controller interfaces. Add only branch-local wrappers/copy where an existing component owns the content, and keep presentation in scoped `.planner-editor-shell` CSS using current tokens. Validate structure and style contracts with Node-compatible tests, then validate rendered layout and interaction in a real browser.

**Tech Stack:** TypeScript, React 19, Next.js 16, CSS, Vitest, existing in-app browser/CDP tooling.

## Global Constraints

- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming.
- Use existing public interfaces and existing modal/component owners; do not access module internals across boundaries.
- Use TDD and record the expected RED before production edits.
- Do not add dependencies, animation, gradients, a new design system, or speculative primitives.
- Do not modify homepage, canvas, catalog, toolbar, storage schema, export formats, import parsing, or map rendering.
- Do not stage, commit, push, deploy, or install dependencies.

---

### Task 1: Redesign Save import and Farm Summary content

**Files:**

- Modify: `src/components/planner-game-save-modal-content.tsx`
- Modify: `src/components/game-save-import-panel.tsx`
- Modify: `src/components/planner-farm-summary-modal-content.tsx`
- Modify: `src/components/farm-summary-panel.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/planner-game-save-modal-content.test.tsx`
- Test: `tests/components/game-save-import-panel.test.tsx`
- Test: `tests/components/planner-farm-summary-modal-content.test.tsx`
- Test: `tests/components/farm-summary-panel.test.tsx`
- Test: `tests/components/save-modal-style-contract.test.ts`

**Interfaces:**

- Consumes: unchanged `PlannerGameSaveModalContentProperties`, `PlannerFarmSummaryModalContentProperties`, and `FarmSummaryPanelProperties`.
- Produces: the same callbacks and nested dialogs; only markup classes and user-facing labels change.
- Produces: both non-project Save branches start with `planner-save-modal-content` plus a branch modifier class.

- [x] **Step 1: Write failing structure and copy tests**

Add static-render expectations for:

```tsx
class="planner-save-modal-content planner-save-modal-content--game-save"
Choose a Stardew Valley save file to preview the farm in this planner.
Choose save file
class="planner-save-modal-content planner-save-modal-content--farm-summary"
Map: Forest Farm
Season: Winter
0 items placed
View detailed summary
```

Keep assertions proving the file input remains `type="file"` and the Farm Summary trigger remains a button. The Node Vitest environment cannot open the stateful nested dialog; that interaction is a mandatory browser assertion in Task 3 and must not be claimed from static rendering.

Add a pure label contract in `game-save-import-panel.test.tsx` for an exported function with this exact interface:

```ts
createGameSaveImportTriggerLabel(importingFileName: string | null): string
```

Require `null` to return `Choose save file` and `Farm_123456789` to return `Importing Farm_123456789…`. This gives the transient filename behavior a real RED without adding a DOM test dependency.

- [x] **Step 2: Write a failing Save style contract**

Require scoped selectors for:

```css
.planner-editor-shell .game-save-import-control
.planner-editor-shell .game-save-import-control__file-trigger
.planner-editor-shell .game-save-import-control__file-trigger input
.planner-editor-shell .farm-summary-panel
.planner-editor-shell .farm-summary-panel__preview
.planner-editor-shell .farm-summary-modal__groups
.planner-editor-shell .farm-summary-modal__footer
```

Require the file input to be visually hidden inside the styled trigger rather than removing it from the label/input interaction.

- [x] **Step 3: Run tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/planner-game-save-modal-content.test.tsx tests/components/game-save-import-panel.test.tsx tests/components/planner-farm-summary-modal-content.test.tsx tests/components/farm-summary-panel.test.tsx tests/components/save-modal-style-contract.test.ts --no-file-parallelism
```

Expected: failures identify the missing `createGameSaveImportTriggerLabel` export, wrappers, new labels/preview markup, and scoped CSS selectors.

- [x] **Step 4: Implement the minimal Save markup**

Wrap the two dynamic branch components in their existing content owner:

```tsx
<div className="planner-save-modal-content planner-save-modal-content--game-save">
  <GameSaveImportControl onImportGameSave={handleImportGameSave} />
</div>
```

```tsx
<div className="planner-save-modal-content planner-save-modal-content--farm-summary">
  <FarmSummaryPanel ... />
</div>
```

In `GameSaveImportControl`, retain the label/input contract, add concise explanatory copy, change the trigger label to `Choose save file`, and show `Importing ${selectedGameSaveFile.name}…` while the existing import promise is pending. Clear the filename in the existing `finally` block; do not catch unknown errors differently.

Use `createGameSaveImportTriggerLabel(importingFileName)` as the sole label formatter. Store only `string | null` in `importingFileName`; set it immediately after a file is selected and clear it in `finally`.

In `FarmSummaryPanel`, render map, formatted season, and `${totalItems} items placed` from the already-created `farmSummary`, then rename only the trigger to `View detailed summary`.

- [x] **Step 5: Implement scoped Save presentation**

Use existing variables and existing classes. The upload and preview owners use grid layout, `var(--bg-raised)`, `var(--border-subtle)`, `var(--lk-xs)` radius, and current spacing variables. Keep the real file input positioned over or inside the label with opacity zero so pointer and keyboard interaction remain attached to the input. Style Farm Summary group lists as category cards with item name/count columns and keep Export CSV in the existing footer.

- [x] **Step 6: Verify GREEN and focused regression**

Run the Step 3 command plus:

```bash
pnpm exec vitest run tests/components/game-save-import-panel.test.tsx tests/projects/farm-summary.test.ts --no-file-parallelism
pnpm typecheck
git diff --check
```

Expected: all pass with no changes to import parsing or export data.

---

### Task 2: Redesign View, Settings, and Help content

**Files:**

- Modify: `src/components/editor-modal.tsx`
- Modify: `app/globals.css`
- Modify: `tests/components/editor-modal.test.tsx`
- Modify: `tests/components/editor-shell.test.tsx`
- Create: `tests/components/editor-modal-content-style-contract.test.ts`

**Interfaces:**

- Consumes: existing `EditorDisplayOptions`, `EditorBehaviorOptions`, option callbacks, `EditorPanelPosition`, and `EditorModal` focus/close behavior.
- Produces: unchanged control semantics and state callbacks; only section/action labels, three narrow outer modifier classes, and scoped presentation change.

- [x] **Step 1: Write failing label and semantic tests**

Require View markup to contain:

```text
Appearance
Map Objects
Show resource clumps
Unavailable
```

and not contain a second `Display` heading or an action button whose visible text is exactly `Resource Clumps`.

Require Settings markup to contain `Legal`, preserve both legal URLs/target/rel attributes, preserve all `aria-pressed` buttons, and keep Weather and Manage Mods disabled. Require each disabled button to contain a visible `<span class="editor-modal__option-status">Unavailable</span>` and require the legal link wrapper class `editor-modal__legal-links`.

- [x] **Step 2: Write a failing editor-modal content style contract**

Read `app/globals.css` and require scoped rules for:

```css
.planner-editor-shell .editor-modal--view-panel
.planner-editor-shell .editor-modal--settings-panel
.planner-editor-shell .editor-modal--help-info
.planner-editor-shell .editor-modal--view-panel .editor-modal__header
.planner-editor-shell .editor-modal--settings-panel .editor-modal__header
.planner-editor-shell .editor-modal--help-info .editor-modal__header
.planner-editor-shell .editor-modal--view-panel .editor-modal__view-panel
.planner-editor-shell .editor-modal--settings-panel .editor-modal__settings-panel
.planner-editor-shell .editor-modal__view-section
.planner-editor-shell .editor-modal__view-options
.planner-editor-shell .editor-modal__view-options button[aria-pressed="true"]
.planner-editor-shell .editor-modal__view-options button:disabled
.planner-editor-shell .editor-modal__panel-picker
.planner-editor-shell .editor-modal__panel-picker button[aria-pressed="true"]
.planner-editor-shell .editor-modal__free-placement-warning
.planner-editor-shell .editor-modal__option-status
.planner-editor-shell .editor-modal__legal-links
.planner-editor-shell .editor-modal--help-info .editor-reference-info
.planner-editor-shell .editor-modal--help-info .editor-reference-info section
.planner-editor-shell .editor-modal--help-info .editor-reference-info ul
```

Require the 640 px block to provide 44 px touch targets for option buttons, the game-save file trigger, and Legal links, plus one-column content. Reject redesign rules that target plain `.editor-modal`, Map picker, Keyboard Shortcuts, What's New, homepage, canvas, catalog, or toolbar selectors.

- [x] **Step 3: Run tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/editor-modal.test.tsx tests/components/editor-shell.test.tsx tests/components/editor-modal-content-style-contract.test.ts --no-file-parallelism
```

Expected: label and selector assertions fail for the missing redesign.

- [x] **Step 4: Implement minimal labels and scoped styles**

Change only these user-facing labels in `editor-modal.tsx`:

```text
Display -> Appearance
Resource Clumps heading -> Map Objects
Resource Clumps button -> Show resource clumps
second Display heading -> Unavailable
Joja Stuff -> Legal
```

Add `editor-modal--view-panel`, `editor-modal--settings-panel`, and `editor-modal--help-info` through a small `getEditorModalClassName(modalId)` function. Keep the existing map-picker/save modifiers unchanged and return plain `editor-modal` for Keyboard Shortcuts and What's New.

Add the explicit `editor-modal__option-status` span to Weather and Manage Mods without removing `disabled`. Add `editor-modal__legal-links` to the existing legal link owner. Keep option keys, titles, callbacks, disabled attributes, links, modal roles, and focus handling unchanged.

Style existing section owners as cards and option owners as wrapping grids/flex rows under the three narrow modifiers. Use the current lime accent for pressed state, current raised surface for off state, muted opacity plus the explicit `Unavailable` status for disabled controls, and CSS-generated visual On/Off text driven by `aria-pressed`. Include Catalog Position pressed buttons in the same state language. Make only View, Settings, and Help overflow-safe with sticky headers; do not change generic modal or Map picker geometry.

- [x] **Step 5: Verify GREEN and business regression**

Run the Step 3 command plus:

```bash
pnpm exec vitest run tests/editor/editor-display-options.test.ts tests/editor/editor-behavior-options.test.ts tests/planner/planner-workspace-state.test.ts tests/components/planner-workspace-layout.test.tsx --no-file-parallelism
pnpm typecheck
git diff --check
```

Expected: all pass; no state keys or callbacks change.

---

### Task 3: Independent review and integrated acceptance

**Files:**

- No production changes expected.
- Append verification evidence to `.superpowers/sdd/2026-08-11-editor-modal-experience/progress.md`.

- [x] **Step 1: Run automated regression**

```bash
pnpm typecheck
pnpm build
pnpm exec vitest run --no-file-parallelism
git diff --check
```

Before building, record `git status --short next-env.d.ts` and `git diff -- next-env.d.ts` in the SDD report. Afterward, restore only the exact difference introduced by this build; preserve any pre-existing user change and do not rerun build after restoration.

- [x] **Step 2: Verify desktop browser behavior**

At a desktop viewport, open Save and all three branches, then View, Settings, and Help. Confirm content padding is at least 16 px, controls do not overlap, modal content scrolls without losing access to the header, active/disabled states are visible, and the document has no horizontal overflow.

Exercise Import Game Save with an existing repository XML fixture. Temporarily delay `File.prototype.text` in the page, select the fixture through the real file chooser, assert the selected filename is visible while pending, then release and restore the method before continuing. Close the result, open/close Farm Summary, trigger Export CSV, toggle representative View and Settings options including Catalog Position, exercise Free Placement cancel/enable/disable, verify Weather and Manage Mods remain disabled with visible status, and verify both legal links retain their URLs.

- [x] **Step 3: Verify 390 px browser behavior**

Set 390 × 844, reload, and reopen every modal. Require:

```text
document.documentElement.scrollWidth === document.documentElement.clientWidth
dialog.left >= 0
dialog.right <= document.documentElement.clientWidth
every visible modal content button height >= 44
the game-save file trigger height >= 44
each Legal link height >= 44
```

Confirm tabs wrap text without overlap, option cards stack, Help text does not overflow, and the Save actions remain reachable.

- [x] **Step 4: Run final independent review**

Review the full diff against the design, user-approved labels, functional preservation, scoped CSS boundary, responsive acceptance, and the global coding constraints. Fix all Critical and Important findings through one scoped subagent fix loop and rerun the affected checks.
