# Native Copy Image Uses the Full Map

## Goal

When a user right-clicks the planner canvas and chooses the browser's native
**Copy Image** command, the clipboard must receive a complete, clean PNG of the
current map. The image must not include the camera viewport, black canvas area,
editor controls, overlays, or a watermark.

## Scope

This change is limited to the interactive planner canvas and its existing image
capture path.

- Keep the browser's native context menu; do not render an application menu.
- Keep Screenshot and Screenshot (HQ) downloads unchanged, including their
  existing watermark.
- Do not change JSON export/import, project-map copy, placement copy, or other
  page images.

## Interaction Contract

1. The user opens the normal browser context menu over the planner canvas.
2. The user selects **Copy Image**.
3. The canvas-specific copy handler cancels only that copy action and writes a
   clean, full-map `image/png` item to the system clipboard.
4. Pasting into an image-capable application produces the full map at 1x
   resolution.

The implementation must not suppress `contextmenu`, modify the native menu, or
handle keyboard copy actions outside the canvas.

## Rendering and Clipboard Boundaries

The renderer owns image production. Its image-capture interface will explicitly
distinguish a watermarked download image from a clean clipboard image. The
existing download consumer requests the former; the canvas-native copy consumer
requests the latter.

A small browser-only clipboard module owns feature checks, PNG validation, and
`ClipboardItem` construction. It receives the clean PNG promise immediately so
the browser can associate the write with the native copy gesture. The module
does not know about Pixi, maps, React, or UI state.

The canvas owns only the DOM copy-event boundary: it verifies that the event is
for its own canvas, prevents the default image copy, and delegates capture and
clipboard writing through its supplied interface.

## Failure Contract

If the map exporter is unavailable, PNG encoding fails, image clipboard support
is absent, or the browser rejects the clipboard write, the normal image copy is
cancelled and the user receives a clear error notification. Errors include the
specific unavailable API or received value; no fallback may silently copy the
camera viewport image.

If Ego verification shows that a native **Copy Image** command does not dispatch
a canvas-targeted copy event, implementation stops before adding any broad
document-level copy interception. Replacing the native context menu would be a
separate, unapproved design.

## Expected Production Files

- `src/components/planner-canvas.tsx`: canvas-targeted copy event and clean map
  capture option.
- `src/projects/map-image-export.ts`: explicit capture-output contract.
- `src/planner/planner-workspace-map-image-exporter.ts`: forwards the capture
  request through the existing exporter boundary.
- `src/components/use-planner-workspace-persistence-controls.ts` and
  `src/components/planner-workspace.tsx`: wire the existing workspace exporter
  to the canvas without exposing internals.
- `src/projects/browser-image-clipboard.ts`: narrow browser PNG clipboard port.

Names may be refined only to better reflect these responsibilities; no new
framework, dependency, persistence format, or global copy listener is allowed.

## Verification

1. TDD tests cover output selection, strict PNG validation, clipboard platform
   failures, and that only a matching canvas copy event is cancelled.
2. Existing screenshot-export tests prove watermarked downloads still request
   their current output form.
3. Ego browser acceptance uses the native menu: right-click the actual planner
   canvas, select **Copy Image**, paste into an image-capable target, and check
   that the full map has neither black viewport padding nor watermark.
4. Ego also checks a non-canvas image still follows the browser's normal copy
   behavior.
5. Run targeted Vitest, `pnpm typecheck`, `pnpm build`, and `git diff --check`.
