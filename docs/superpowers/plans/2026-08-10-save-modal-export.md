# Save Modal Usability and Export Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the React planner Save modal readable and usable on desktop and 390px mobile, and prove that JSON and PNG actions invoke a correct browser download contract.

**Architecture:** Keep project serialization, screenshot capture, storage, and branch state in their existing owners. Add one narrow browser-download boundary, one focused delete-confirmation component, small testable formatting and keyboard-containment functions, and Save-only CSS scoped below `.planner-editor-shell`.

**Tech Stack:** TypeScript, React 19, Next.js, Radix AlertDialog from the existing `radix-ui` package, CSS, Vitest.

## Global Constraints

- Reuse the homepage/editor tokens already defined under `.planner-editor-shell`; introduce no gradients, glow effects, animation, or new color tokens.
- Do not change homepage, canvas, catalog, toolbar, sidebar, repository format, browser storage, screenshot rendering, screenshot resolution, watermark, game-save parsing, or Farm Summary behavior.
- Do not modify `src/components/planner-canvas.tsx`, `tests/components/planner-canvas.test.ts`, or `docs/superpowers/plans/2026-08-10-selected-placement-strong-tint.md`; they contain unrelated user work.
- Do not install dependencies, stage files, create commits, create/switch branches, push, deploy, or modify external services.
- Follow high cohesion, low coupling, SRP, interface-only module communication, KISS, Fail Fast, YAGNI, and precise names. Never swallow an unknown exception.
- Keep `src/components/planner-save-modal-loader.tsx` production logic unchanged; style its existing `planner-save-modal-loader__branches` hook.
- Browser acceptance is not passed unless the configured local browser reaches the local app and the stated interactions are observed.

---

### Task 1: Shared browser file download boundary

**Files:**
- Create: `src/projects/browser-file-download.ts`
- Create: `tests/projects/browser-file-download.test.ts`
- Modify: `src/components/local-project-panel.tsx`
- Modify: `src/components/map-image-export-panel.tsx`
- Test: `tests/projects/local-project-editor-actions.test.ts`
- Test: `tests/projects/map-image-export.test.ts`
- Test: `tests/components/local-project-panel.test.tsx`
- Test: `tests/components/map-image-export-panel.test.tsx`

**Interfaces:**
- Consumes: `Blob`, browser `document`, `URL.createObjectURL`, `URL.revokeObjectURL`, and `window.setTimeout`.
- Produces:

```ts
export type BrowserDownloadAnchor = {
  download: string;
  href: string;
  style: { display: string };
  click(): void;
  remove(): void;
};

export type BrowserFileDownloadPlatform = Readonly<{
  appendDownloadAnchor(anchor: BrowserDownloadAnchor): void;
  createDownloadAnchor(): BrowserDownloadAnchor;
  createObjectUrl(blob: Blob): string;
  revokeObjectUrl(objectUrl: string): void;
  schedule(callback: () => void): void;
}>;

export type BrowserFileDownload = Readonly<{
  blob: Blob;
  filename: string;
}>;

export function createBrowserFileDownloadPlatform(): BrowserFileDownloadPlatform;
export function downloadBrowserFile(
  file: BrowserFileDownload,
  platform?: BrowserFileDownloadPlatform,
): void;
```

- [x] **Step 1: Write the failing download-contract tests**

Create a recording `BrowserFileDownloadPlatform` with an anchor whose methods append exact event names. Assert that `downloadBrowserFile({ blob, filename: "Forest - Summer.json" }, platform)`:

```ts
expect(receivedBlob).toBe(blob);
expect(anchor.download).toBe("Forest - Summer.json");
expect(anchor.href).toBe("blob:project-export");
expect(anchor.style.display).toBe("none");
expect(events).toEqual([
  "create-object-url",
  "create-anchor",
  "append-anchor",
  "click-anchor",
  "remove-anchor",
  "schedule-revocation",
]);
expect(revokedObjectUrls).toEqual([]);
scheduledCallbacks[0]();
expect(revokedObjectUrls).toEqual(["blob:project-export"]);
```

Add the same Blob-identity and filename assertion for `Farm_spring_2026-08-10.png`. Add boundary cases for a whitespace-only filename, a non-Blob value cast at the boundary, and an unavailable browser platform. Each thrown message must include the offending filename/value or missing capability name.

- [x] **Step 2: Run the test to verify RED**

Run:

```bash
pnpm exec vitest run tests/projects/browser-file-download.test.ts --no-file-parallelism
```

Expected: FAIL because `src/projects/browser-file-download.ts` does not exist.

- [x] **Step 3: Implement the minimal browser boundary**

Implement small functions that each do one thing: validate the file, resolve browser capabilities, create/configure the anchor, and coordinate the download. Validate before creating an object URL. Append and click the anchor; use `finally` only to remove the anchor and schedule URL revocation, because those are known cleanup responsibilities. Do not catch or replace click errors.

`createBrowserFileDownloadPlatform()` must fail fast when `document`, `document.createElement`, `document.body.appendChild`, `URL.createObjectURL`, `URL.revokeObjectURL`, or `window.setTimeout` is unavailable. The message must identify the missing capability and requested filename when invoked by `downloadBrowserFile`.

- [x] **Step 4: Replace both duplicate DOM-download implementations**

In `local-project-panel.tsx`, retain project serialization and JSON Blob construction, then call:

```ts
downloadBrowserFile({
  blob: new Blob([exportFile.contents], { type: "application/json;charset=utf-8" }),
  filename: exportFile.filename,
});
```

In `map-image-export-panel.tsx`, retain screenshot capture and Blob validation, then call:

```ts
downloadBrowserFile({ blob: imageFile.blob, filename: imageFile.filename });
```

Remove the two local object-URL/anchor implementations. Do not change filename builders or screenshot capture.

- [x] **Step 5: Run GREEN and focused export regressions**

Run:

```bash
pnpm exec vitest run \
  tests/projects/browser-file-download.test.ts \
  tests/projects/local-project-editor-actions.test.ts \
  tests/projects/map-image-export.test.ts \
  tests/components/local-project-panel.test.tsx \
  tests/components/map-image-export-panel.test.tsx \
  --no-file-parallelism
```

Expected: all tests pass with no warnings.

---

### Task 2: Accessible project deletion, readable time, and portal-safe modal keyboard handling

**Files:**
- Create: `src/components/local-project-delete-alert-dialog.tsx`
- Create: `tests/components/local-project-delete-alert-dialog.test.tsx`
- Modify: `src/components/local-project-panel.tsx`
- Modify: `src/components/editor-modal.tsx`
- Modify: `tests/components/local-project-panel.test.tsx`
- Modify: `tests/components/editor-modal.test.tsx`

**Interfaces:**
- Produces:

```ts
export function formatLocalProjectUpdatedAt(updatedAt: string): string;

export function shouldHandleEditorModalKeyboardEvent(
  modalElement: Pick<HTMLElement, "contains">,
  eventTarget: EventTarget | null,
): boolean;

export type LocalProjectDeleteAlertDialogProps = Readonly<{
  projectTitle: string;
  onCancel(): void;
  onConfirm(): void;
}>;

export function LocalProjectDeleteAlertDialog(
  props: LocalProjectDeleteAlertDialogProps,
): React.ReactNode;
```

- [x] **Step 1: Write RED tests for timestamp, confirmation content, and containment**

Add timestamp assertions using `2026-08-10T12:00:00.000Z`: the formatted value must contain `2026`, must not equal the raw value, and must not contain `T12:00:00.000Z`. Assert `formatLocalProjectUpdatedAt("not-a-date")` throws a message containing `not-a-date`.

Render an open `AlertDialog.Root` with the exported confirmation content and assert the exact project title, the destructive `Delete project` button, and the `Keep project` cancellation button are present.

For `shouldHandleEditorModalKeyboardEvent`, use a fake containment object and assert a contained target returns `true`, a portalled target returns `false`, and `null` throws a concrete error naming the invalid target.

- [x] **Step 2: Run the tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  tests/components/local-project-delete-alert-dialog.test.tsx \
  tests/components/local-project-panel.test.tsx \
  tests/components/editor-modal.test.tsx \
  --no-file-parallelism
```

Expected: FAIL because the new component and exported functions do not exist.

- [x] **Step 3: Implement deterministic boundary validation and browser-local formatting**

Parse the stored timestamp once, reject a blank or invalid value before formatting, then return:

```ts
new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
}).format(parsedUpdatedAt);
```

Use the formatter in every saved-project card. Do not render the raw ISO timestamp.

- [x] **Step 4: Implement the Radix confirmation component**

Import `* as AlertDialog from "radix-ui/alert-dialog"`. The component must render `AlertDialog.Portal`, overlay, content, title, description with the exact project title, cancel action, and destructive action. Keep deletion state and repository calls in `LocalProjectPanel`; the new component receives only title and callbacks.

Replace the raw `<dialog open>` block with `LocalProjectDeleteAlertDialog`. Cancellation clears the selected project ID; confirmation calls the existing delete action for that ID and then clears it only through the existing successful flow.

- [x] **Step 5: Guard the outer modal keyboard handler by DOM containment**

Implement the exported containment function with fail-fast validation. At the start of `EditorModal`'s keydown handler, return when the event target is not physically contained by the outer modal element. Preserve the existing Escape close and Tab focus-loop behavior for contained targets. This prevents portalled AlertDialog Escape/Tab events from closing or refocusing the Save modal.

- [x] **Step 6: Run GREEN and focused modal regressions**

Run:

```bash
pnpm exec vitest run \
  tests/components/local-project-delete-alert-dialog.test.tsx \
  tests/components/local-project-panel.test.tsx \
  tests/components/editor-modal.test.tsx \
  --no-file-parallelism
```

Expected: all tests pass with no warnings.

---

### Task 3: Save-only layout and responsive visual hierarchy

**Files:**
- Create: `tests/components/save-modal-style-contract.test.ts`
- Modify: `src/components/editor-modal.tsx`
- Modify: `src/components/planner-save-modal-content.tsx`
- Modify: `tests/components/editor-modal.test.tsx`
- Modify: `tests/components/planner-save-modal-content.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing `planner-save-modal-loader__branches`, `local-project-panel*`, and `map-image-export-panel*` class names.
- Produces: `editor-modal--save-panel`, `planner-save-modal-content`, and `planner-save-modal-content__exports` layout hooks.

- [x] **Step 1: Write RED markup and CSS-contract tests**

Assert the Save modal server markup contains `editor-modal--save-panel` while another modal does not. Assert `PlannerSaveModalContent` contains `planner-save-modal-content` and one `planner-save-modal-content__exports` wrapper around screenshot and thumbnail sections.

Read `app/globals.css` in the style-contract test and assert it contains scoped Save selectors for:

```text
.planner-editor-shell .editor-modal--save-panel
.planner-editor-shell .planner-save-modal-loader__branches
.planner-editor-shell .local-project-panel__projects
.planner-editor-shell .local-project-panel__delete-alert-overlay
.planner-editor-shell .map-image-export-panel
@media (max-width: 640px)
```

Also assert the Save responsive block does not contain `.planner-canvas`, `.planner-editor-layout`, `.planner-editor-catalog`, or homepage selectors.

- [x] **Step 2: Run the tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  tests/components/save-modal-style-contract.test.ts \
  tests/components/editor-modal.test.tsx \
  tests/components/planner-save-modal-content.test.tsx \
  --no-file-parallelism
```

Expected: FAIL because the Save modifier, wrappers, and CSS rules do not exist.

- [x] **Step 3: Add Save-only markup hooks**

Build the modal class name with the existing map-picker branch plus a Save-only branch:

```ts
const editorModalClassName =
  modalId === "map-picker"
    ? "editor-modal editor-modal--map-picker"
    : modalId === "save-panel"
      ? "editor-modal editor-modal--save-panel"
      : "editor-modal";
```

Wrap `PlannerSaveModalContent` in `planner-save-modal-content`. Group the existing screenshot export and thumbnail controls inside `planner-save-modal-content__exports`. Do not rename or move actions between branches.

- [x] **Step 4: Add scoped desktop styles**

Under `.planner-editor-shell`, set the Save modal to `width: min(680px, 90vw)` with viewport-safe max height and content overflow. Style:

- branch buttons as one three-column segmented navigation row using existing tokens and `aria-pressed="true"` for the lime active state;
- current-project status and project cards as bordered pale-green/white surfaces;
- primary actions as equal three-column controls;
- the project list with `max-height: 19rem` and `overflow-y: auto`;
- project actions as a wrapping grid that never overlaps labels;
- screenshot and thumbnail sections as a two-column grid;
- notices/errors beside their originating section;
- AlertDialog overlay/content above the Save modal, with `#b13a28` reserved for destructive/error styling and no animation.

- [x] **Step 5: Add the 640px responsive Save-only block**

At `max-width: 640px`, keep the modal within `calc(100vw - 1rem)` and `calc(100dvh - 1rem)`. Stack primary actions, project cards, and export cards in one column. Allow branch labels and project actions to wrap; every action control must be at least `44px` high. Do not include any canvas, catalog, toolbar, sidebar, or homepage selector in this block.

- [x] **Step 6: Run GREEN and Save component regressions**

Run:

```bash
pnpm exec vitest run \
  tests/components/save-modal-style-contract.test.ts \
  tests/components/editor-modal.test.tsx \
  tests/components/planner-save-modal-content.test.tsx \
  tests/components/local-project-panel.test.tsx \
  tests/components/map-image-export-panel.test.tsx \
  --no-file-parallelism
```

Expected: all tests pass with no warnings.

---

### Task 4: Integrated verification and browser acceptance

**Files:**
- Verify only; do not add production scope unless a failure proves a direct dependency and the user approves it.

**Interfaces:**
- Consumes: all Task 1-3 outputs.
- Produces: recorded automated and browser acceptance evidence.

- [x] **Step 1: Run the focused Save/export suite**

Run:

```bash
pnpm exec vitest run \
  tests/projects/browser-file-download.test.ts \
  tests/projects/local-project-editor-actions.test.ts \
  tests/projects/map-image-export.test.ts \
  tests/components/local-project-delete-alert-dialog.test.tsx \
  tests/components/save-modal-style-contract.test.ts \
  tests/components/editor-modal.test.tsx \
  tests/components/planner-save-modal-content.test.tsx \
  tests/components/local-project-panel.test.tsx \
  tests/components/map-image-export-panel.test.tsx \
  --no-file-parallelism
```

Expected: all tests pass with no warnings.

- [x] **Step 2: Run type and production-build validation**

Run:

```bash
pnpm typecheck
pnpm build
```

Expected: both commands exit 0. After the build, inspect `git status --short` and preserve any user-owned `next-env.d.ts` change if the build rewrites it.

- [x] **Step 3: Run the full Vitest regression suite**

Run:

```bash
pnpm exec vitest run --no-file-parallelism
```

Expected: all tests pass with no warnings.

- [x] **Step 4: Run browser acceptance at desktop and 390px**

Using the configured local browser, open the locally served planner and verify:

1. Save opens with all three branch buttons readable and selectable.
2. Project cards/actions do not overlap; the list scrolls when long.
3. Screenshot, Screenshot (HQ), and Save thumbnail remain visible.
4. Delete opens a centered confirmation; Keep project restores the Save modal without deletion.
5. Export JSON emits a `.json` download with the displayed project title.
6. Screenshot and Screenshot (HQ) each emit a `.png` download.
7. Repeat layout checks at 390px; controls remain at least 44px high and no horizontal overflow appears.
8. Confirm canvas, catalog, toolbar, sidebar, and homepage geometry were not changed by the Save-only selectors.

If the configured browser cannot reach the local server, record the exact connectivity failure and report browser acceptance as blocked, not passed.

- [x] **Step 5: Inspect scope and patch hygiene**

Run:

```bash
git diff --check
git status --short
git diff --name-only
git diff --stat
```

Expected: no whitespace errors; only approved Save/export files plus the pre-existing unrelated user files and the approved spec/plan are changed. Do not stage, commit, or push.
