# Custom Map Copy Context Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser-native image-copy path with an editor-owned right-click action that copies a clean, complete map PNG.

**Architecture:** Keep the existing clean full-map exporter and browser PNG clipboard boundary. The Pixi canvas receives `contextmenu`, prevents only that canvas event, and opens a small React menu inside the editor shell. The menu invokes the existing clean 1x capture callback; it closes on selection, outside pointer press, or Escape.

**Tech Stack:** Next.js 16.3 client components, React, PixiJS, TypeScript, Vitest, Ego browser.

## Global Constraints

- Do not create a worktree, add dependencies, stage, commit, push, or deploy.
- Remove the ineffective canvas `copy` listener; do not add a document-level `copy` listener.
- Prevent the native context menu only for the active Pixi canvas. The rest of the page keeps its browser context menu.
- The custom menu has exactly one action: `Copy full map`.
- The action writes a 1x clean full-map `image/png`, with no editor overlays, watermark, viewport padding, or black side bands.
- Existing Screenshot and Screenshot (HQ) downloads retain their watermarked images.
- Close the menu on Escape, an outside pointer press, or after selecting its action; report capture/clipboard errors through the existing canvas error path.
- Verify the user flow in Ego: right-click canvas, use `Copy full map`, paste image, and confirm Standard Farm is 1280x1040 with no black bands.

---

### Task 1: Replace native copy interception with a scoped context-menu component

**Files:**
- Create: `src/components/planner-canvas-context-menu.tsx`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `tests/components/planner-canvas.test.ts`
- Create or modify: `tests/components/planner-canvas-context-menu.test.tsx`
- Modify: `tests/components/planner-workspace.projects.integration.test.ts`

**Interfaces:**
- Consumes: `onCopyCleanMapImage(): Promise<void>` supplied by `PlannerWorkspace`; this already captures a clean 1x map and passes it to `copyPngImageToClipboard`.
- Produces: `PlannerCanvasContextMenu`, with a point inside the canvas host, `onCopyFullMap`, and `onClose`.
- Produces: `attachPlannerCanvasContextMenuListener({ pixiCanvas, onOpen })`, returning idempotent cleanup.

- [ ] **Step 1: Write failing event and UI-contract tests**

```ts
const contextMenuEvent = createContextMenuEvent(pixiCanvas, 120, 80);
handlePlannerCanvasContextMenuEvent(contextMenuEvent, pixiCanvas, onOpen);
expect(contextMenuEvent.preventDefault).toHaveBeenCalledOnce();
expect(onOpen).toHaveBeenCalledWith({ x: 120, y: 80 });

expect(renderToStaticMarkup(
  <PlannerCanvasContextMenu position={{ x: 120, y: 80 }} onClose={onClose} onCopyFullMap={onCopyFullMap} />,
)).toContain('Copy full map');
```

Include failures for a non-canvas context-menu target, listener cleanup, Escape/outside-close contract, and a rejected copy action routed to the existing canvas error callback.

- [ ] **Step 2: Run RED tests**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-canvas-context-menu.test.tsx tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: FAIL because the current implementation has a `copy` listener and no scoped context-menu component.

- [ ] **Step 3: Implement the smallest scoped UI and lifecycle bridge**

```ts
function handlePlannerCanvasContextMenuEvent(
  event: MouseEvent,
  pixiCanvas: HTMLCanvasElement,
  onOpen: (point: CanvasContextMenuPoint) => void,
): void {
  if (event.target !== pixiCanvas) return;
  event.preventDefault();
  onOpen({ x: event.offsetX, y: event.offsetY });
}
```

Attach this handler only to the active Pixi canvas, remove it during existing cleanup, and replace the old `copy` listener helpers. Render the menu in the planner canvas host; action click closes first, then calls `onCopyCleanMapImage`. The menu component owns only its button, positioning, outside/Escape close behavior, and accessible `role="menu"`; PlannerCanvas owns renderer lifecycle and error reporting.

- [ ] **Step 4: Run GREEN and direct regressions**

Run: `pnpm exec vitest run tests/projects/browser-image-clipboard.test.ts tests/projects/map-image-export.test.ts tests/planner/planner-workspace-map-image-exporter.test.ts tests/components/planner-canvas.test.ts tests/components/planner-canvas-context-menu.test.tsx tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: PASS; tests prove native `copy` listener removal, canvas-only menu interception, cleanup, and clean-vs-watermarked capture separation.

### Task 2: Verification and review

**Files:**
- Modify only if Task 1 tests or Ego exposes a defect.

- [ ] **Step 1: Run static verification**

Run: `pnpm typecheck && pnpm build && git diff --check`

Expected: all commands exit 0. Restore `next-env.d.ts` only if build changes its generated type-directory reference.

- [ ] **Step 2: Validate the exact user path in Ego**

Build and serve `out`, open the planner, right-click inside the Pixi canvas, select `Copy full map`, and paste the image into an image-capable target. Confirm the image is Standard Farm's intrinsic 1280x1040 full map without black side bands or watermark. Right-click outside the canvas and confirm the browser's normal menu remains available. Verify Escape and outside pointer press close the custom menu.

- [ ] **Step 3: Request independent review**

Ask a fresh reviewer to inspect only this task diff for canvas event scope, menu dismissal, clean-image use, error propagation, screenshot preservation, and scope creep. Do not stage, commit, or push.
