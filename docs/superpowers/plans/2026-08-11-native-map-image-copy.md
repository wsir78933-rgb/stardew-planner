# Native Map Image Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the browser's native **Copy Image** command over the planner canvas put a clean, complete, unwatermarked PNG map on the clipboard.

**Architecture:** Keep the browser context menu unchanged. Extend the existing renderer exporter with an explicit clean-image method, then route a canvas-targeted native copy event through a narrow browser clipboard adapter. Existing screenshot download calls continue to use the watermarked exporter method unchanged.

**Tech Stack:** Next.js 16.3 client components, React, TypeScript, PixiJS, Vitest, Ego browser.

## Global Constraints

- Do not create a worktree, add dependencies, stage, commit, push, deploy, or alter unrelated dirty files.
- Keep the native browser context menu; do not call `preventDefault()` on `contextmenu`.
- Intercept only a `copy` event whose target is the active Pixi canvas; do not add a document-level copy listener or affect keyboard copy elsewhere.
- Clipboard output is a 1x, full-map `image/png` without overlays or watermark.
- Existing Screenshot/Screenshot (HQ) downloads retain their watermarked images.
- Fail fast with an error that names the unavailable API or invalid received value; do not fall back to the viewport image.
- Real native-menu behavior is accepted only after Ego verification.

---

### Task 1: Browser PNG clipboard boundary

**Files:**
- Create: `src/projects/browser-image-clipboard.ts`
- Create: `tests/projects/browser-image-clipboard.test.ts`

**Interfaces:**
- Produces: `copyPngImageToClipboard(pngImage: Promise<Blob>, platform?: BrowserImageClipboardPlatform): Promise<void>`.
- Produces: `BrowserImageClipboardPlatform`, an injected interface with `createClipboardItem`, `isPngSupported`, and `writeClipboardItem`.
- Consumes: a promise rather than an already encoded blob so the clipboard write begins in the native copy gesture.

- [ ] **Step 1: Write the failing tests**

```ts
await copyPngImageToClipboard(Promise.resolve(new Blob(["png"], { type: "image/png" })), fakePlatform);
expect(fakePlatform.writeClipboardItem).toHaveBeenCalledWith(fakeClipboardItem);

await expect(copyPngImageToClipboard(Promise.resolve(new Blob(["bad"], { type: "text/plain" })), fakePlatform))
  .rejects.toThrow('must resolve to image/png');
```

Add failures for absent `navigator.clipboard.write`, absent `ClipboardItem`, unsupported `image/png`, and a rejected `writeClipboardItem`. Each error assertion must include the unavailable API name or received MIME type.

- [ ] **Step 2: Run the failing test**

Run: `pnpm exec vitest run tests/projects/browser-image-clipboard.test.ts --no-file-parallelism`

Expected: FAIL because `browser-image-clipboard` does not exist.

- [ ] **Step 3: Implement the smallest browser adapter**

```ts
export async function copyPngImageToClipboard(
  pngImage: Promise<Blob>,
  platform = createBrowserImageClipboardPlatform(),
): Promise<void> {
  const clipboardItem = platform.createClipboardItem({ "image/png": pngImage });
  await platform.writeClipboardItem(clipboardItem);
}
```

Validate the promise result as `image/png` inside the value supplied to the clipboard item. Resolve browser globals only in `createBrowserImageClipboardPlatform`, and throw a named `BrowserImageClipboardError` when any required browser API is unavailable.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec vitest run tests/projects/browser-image-clipboard.test.ts --no-file-parallelism`

Expected: PASS.

### Task 2: Separate clean-map capture from watermarked screenshot capture

**Files:**
- Modify: `src/projects/map-image-export.ts:1-20`
- Modify: `src/planner/planner-workspace-map-image-exporter.ts:41-68`
- Modify: `src/planner/planner-workspace-persistence-runtime.ts` (the public image capture methods)
- Modify: `src/components/use-planner-workspace-persistence-controls.ts:29-73`
- Modify: `src/components/planner-canvas.tsx:1804-1820,1920-2010`
- Test: `tests/projects/map-image-export.test.ts`
- Test: `tests/planner/planner-workspace-map-image-exporter.test.ts`
- Test: `tests/components/planner-workspace.projects.integration.test.ts`

**Interfaces:**
- Consumes: Task 1 only conceptually; this task does not import the clipboard adapter.
- Produces: `MapImageExporter.captureCleanMapImage(resolution: ScreenshotResolution): Promise<Blob>` alongside the existing `captureScreenshot` method.
- Produces: persistence controls field `captureCleanMapImage` with the same resolution signature.

- [ ] **Step 1: Write failing exporter tests**

```ts
const exporter = {
  captureScreenshot: vi.fn(async () => watermarkedPng),
  captureCleanMapImage: vi.fn(async () => cleanPng),
};
await captureCurrentCleanMapImage(currentMapImageExporterSlot, "farm", 1);
expect(exporter.captureCleanMapImage).toHaveBeenCalledWith(1);
expect(exporter.captureScreenshot).not.toHaveBeenCalled();
```

Keep the existing screenshot test and assert it still calls `captureScreenshot`, so the download path cannot silently become clean/unwatermarked.

- [ ] **Step 2: Run the failing exporter tests**

Run: `pnpm exec vitest run tests/projects/map-image-export.test.ts tests/planner/planner-workspace-map-image-exporter.test.ts tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: FAIL because `captureCleanMapImage` and its forwarding method do not exist.

- [ ] **Step 3: Implement clean capture without changing download capture**

Add `captureCleanMapImage` to `MapImageExporter`, the current-exporter slot, runtime, and hook return type. In `PlannerCanvas`, render the same full map with editor overlays hidden, but pass the extracted canvas directly to `createPngBlob`. Keep `captureScreenshot` calling the existing watermark-canvas path.

- [ ] **Step 4: Run the focused exporter tests**

Run: `pnpm exec vitest run tests/projects/map-image-export.test.ts tests/planner/planner-workspace-map-image-exporter.test.ts tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: PASS.

### Task 3: Canvas-native copy event orchestration

**Files:**
- Modify: `src/components/planner-canvas.tsx:179-231,963-1040,1788-1820`
- Modify: `src/components/planner-workspace.tsx:950-1000`
- Test: `tests/components/planner-canvas.test.ts`
- Test: `tests/components/planner-workspace.projects.integration.test.ts`

**Interfaces:**
- Consumes: `captureCleanMapImage` from Task 2 and `copyPngImageToClipboard` from Task 1.
- Produces: optional `onCopyCleanMapImage(): Promise<void>` in `PlannerCanvasProperties`.

- [ ] **Step 1: Write the failing canvas event test**

```ts
const matchingCopyEvent = createCopyEvent(pixiCanvas, pixiCanvas);
handlePlannerCanvasCopyEvent(matchingCopyEvent, onCopyCleanMapImage);
expect(matchingCopyEvent.preventDefault).toHaveBeenCalledOnce();
expect(onCopyCleanMapImage).toHaveBeenCalledOnce();

const unrelatedCopyEvent = createCopyEvent(otherElement, otherElement);
handlePlannerCanvasCopyEvent(unrelatedCopyEvent, onCopyCleanMapImage);
expect(unrelatedCopyEvent.preventDefault).not.toHaveBeenCalled();
expect(onCopyCleanMapImage).toHaveBeenCalledOnce();
```

Also cover a rejected callback: it must route to the existing canvas error path with its original, descriptive error message.

- [ ] **Step 2: Run the failing canvas test**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: FAIL because the canvas has no copy-event handler or copy callback.

- [ ] **Step 3: Implement the narrow event boundary**

Attach a `copy` listener directly to the Pixi canvas during its lifecycle and remove it during cleanup. The handler compares `copyEvent.target` with that exact canvas. Only then call `preventDefault()` and delegate to `onCopyCleanMapImage`. `PlannerWorkspace` composes the hook's clean capture method with `copyPngImageToClipboard`; it reports errors through the existing canvas error callback rather than swallowing them.

- [ ] **Step 4: Run the focused canvas test**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: PASS.

### Task 4: End-to-end verification and review

**Files:**
- Modify only if a test exposes a defect in Tasks 1-3.

- [ ] **Step 1: Run all direct regression tests**

Run: `pnpm exec vitest run tests/projects/browser-image-clipboard.test.ts tests/projects/map-image-export.test.ts tests/planner/planner-workspace-map-image-exporter.test.ts tests/components/planner-canvas.test.ts tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism`

Expected: PASS.

- [ ] **Step 2: Run static verification**

Run: `pnpm typecheck && pnpm build && git diff --check`

Expected: all commands exit 0. Restore `next-env.d.ts` if the build only replaces `.next/dev/types` references with `.next/types`.

- [ ] **Step 3: Validate the native copy action in Ego**

Build and serve `out` locally, open the planner in Ego, right-click the Pixi canvas, select the browser's native **Copy Image** item, and paste into an image-capable target. Verify the pasted image has the map's full width and height, no black viewport region, and no `StardewPlan.com` footer. Then copy an unrelated page image and verify it still uses the browser default behavior.

- [ ] **Step 4: Stop on the explicit platform gate**

If the native command does not dispatch a canvas-targeted `copy` event, do not add a global listener or custom menu. Report the failed gate and request a new design decision.

- [ ] **Step 5: Request independent code review**

Ask a fresh reviewer to inspect only the task diff for canvas event targeting, clipboard API validation, error propagation, screenshot download preservation, and scope creep. Do not stage, commit, or push.
