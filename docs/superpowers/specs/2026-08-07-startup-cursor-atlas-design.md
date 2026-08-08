# Startup Cursor Atlas Design

## Decision

Replace the full startup-time `Cursors.webp` dependency with one lossless,
sparse `704x2256` WebP atlas that contains only the four cursor regions used
by default buildings. The sparse atlas keeps those regions at their original
Cursor-sheet coordinates and decodes every other pixel as transparent RGBA:

- Shipping Bin lid: source `(134, 226, 30, 25)`;
- building shadow left: source `(656, 394, 16, 16)`;
- building shadow middle: source `(672, 394, 16, 16)`;
- building shadow right: source `(688, 394, 16, 16)`.

The atlas uses the original Cursor-sheet coordinate system:

- Shipping Bin lid: atlas `(134, 226, 30, 25)`;
- building shadow left: atlas `(656, 394, 16, 16)`;
- building shadow middle: atlas `(672, 394, 16, 16)`;
- building shadow right: atlas `(688, 394, 16, 16)`.

The compact layout is infeasible for pixel-identical Pixi rendering. Pixi
normalizes frames by the complete texture surface dimensions, so a `78x25`
texture changes GPU UV sampling even when the cropped RGBA regions match. The
verified Pixi 8 experiment with nearest sampling, round pixels, fractional
camera translation, and fractional scale found non-zero differences for the
compact `78x25` and sparse-short `704x410` variants, and zero difference for
the sparse original-size surface at the original coordinates. Verification must
prove that every decoded atlas region is byte-identical to the corresponding
source RGBA region and that every non-approved pixel is transparent.

## Goal and success criterion

The goal is to reduce the editor's initial loading time without changing any
asset pixels, component structure, layout, dimensions, coordinates, or UI.

The accepted performance gate is the median of three Fast 4G cold starts. The
current measured median is `4265.7 ms`; the implementation passes only when the
new median is at most `3839.1 ms`, a reduction of at least 10 percent under the
same measurement procedure.

The earlier run retained the median but not its three raw sample values. Before
runtime code or derived assets are changed, the implementation records a fresh
three-sample baseline from the current worktree under a unique directory in
`/Users/wusir/Desktop/双代理临时文件`. The baseline artifact records all raw
samples, their median, the exact command, requested URLs, browser version,
worktree revision/status, and the environment contract below. The absolute
`3839.1 ms` acceptance gate remains the user-approved comparison against the
previously measured `4265.7 ms` median; the fresh raw baseline is retained for
reproducibility and diagnosis rather than used to weaken that gate.

This optimization applies to every map with default buildings. `Island_W` has
no default buildings and therefore does not need the startup atlas during its
initial render.

## Verified current behavior

The default standard farm creates twelve rendered cursor layers from four
unique source frames:

- the Farmhouse uses one left shadow, seven middle shadows, and one right
  shadow;
- the Shipping Bin uses one left shadow, one right shadow, and its lid;
- the default Greenhouse and Pet Bowl do not use cursor frames.

The complete cursor sheet is `704x2256`. Its decoded RGBA surface is about
`6.35 MB`, while the four startup regions contain only 1,518 pixels. Other
features use distant regions of the complete sheet, including Fish Pond water,
daytime windows, and furniture or craftable fire effects. The complete sheet
therefore remains a supported on-demand asset and must not be globally replaced
by the startup atlas.

The Buildings catalog is the initial catalog. Its only non-shadow cursor frame
is the Shipping Bin lid. The catalog thumbnail must reuse the startup atlas so
that displaying the default catalog after the editor becomes interactive does
not immediately request the complete cursor sheet.

## Derived asset contract

The startup atlas is a derived artifact and lives outside the synchronized game
asset directory so that `assets:sync` cannot remove it. The original
`Cursors.png` and the existing complete lossless `Cursors.webp` remain
unchanged.

A dedicated generation script owns only these steps:

1. validate that the locked source image exists and has the expected
   dimensions;
2. crop the four exact source regions;
3. create a transparent `704x2256` surface and copy the four exact regions to
   their original coordinates;
4. encode the atlas as exact lossless WebP;
5. write the derived atlas to its independent public asset path.

A separate verification script validates the generated boundary:

- file existence;
- exact `704x2256` dimensions;
- lossless encoding and alpha preservation;
- exact decoded RGBA equality for each of the four mapped regions;
- a smaller encoded size than the complete `Cursors.webp`.

Generation and verification fail immediately with an error that names the
invalid path, dimension, frame, or byte comparison. They must not catch or
silently ignore unknown failures. No new runtime dependency is introduced.

## Frame-resolution interface

A small rendering-boundary module owns cursor frame resolution. Its public
input is the locked texture path plus an explicit source rectangle. Its public
output is an immutable texture-frame descriptor containing the resolved public
asset path plus the rectangle to use within that asset.

The resolver uses the complete key:

```text
(locked texture path, x, y, width, height)
```

Its behavior is deliberately narrow:

- an exact match for one of the four approved cursor frames returns the startup
  atlas path and the unchanged original rectangle;
- another explicit cursor frame returns the existing complete cursor WebP path
  and preserves its original rectangle;
- a non-cursor texture follows the existing initial-texture path resolver and
  preserves its original rectangle;
- an absent source rectangle represents a complete-texture draw and preserves
  the resolved original asset path plus the absent rectangle;
- a present but malformed rectangle fails immediately and identifies the
  received values.

The resolver does not know about React, Pixi containers, building IDs, catalog
categories, or future sprite families. Callers use its public return value and
do not inspect internal mappings.

## Runtime data flow

The initial map composition continues to emit locked game-asset paths and
original source rectangles. Persisted snapshots and catalog metadata therefore
remain unchanged.

At the rendering boundary:

1. each placement render entry passes its locked path and source rectangle to
   the frame resolver;
2. the canvas creates a resolved placement entry that carries both the
   resolver's `resolvedAssetPath` and `resolvedFrame` together with the
   unchanged placement geometry;
3. the shared texture-promise cache is keyed only by `resolvedAssetPath`, not
   by the original locked path;
4. each sprite reads both its parent texture and child frame from its own
   resolved placement entry;
5. the same original cursor path can therefore safely produce one cached atlas
   texture and one separately cached complete cursor texture in the same
   render batch;
6. every existing position, scale, tint, alpha, z-index, selection, and
   footprint value remains unchanged.

The initial preload receives the current placement render entries rather than
a map-name flag. It resolves their actual texture-frame descriptors, dedupes
their `resolvedAssetPath` values, and preloads only those assets. A map whose
initial snapshot has no cursor-backed placement frames therefore requests
neither the startup atlas nor the complete cursor sheet. In particular,
`Island_W` must make no initial cursor request. Maps with default Farmhouse and
Shipping Bin frames preload the startup atlas rather than the complete cursor
sheet.

The Shipping Bin catalog thumbnail also uses the same public resolver. Its
thumbnail layer carries the resolved image path and resolved source rectangle
together; existing destination coordinates, scaling, clipping, and canvas/DOM
geometry remain unchanged. This keeps the two consumers consistent without
either one accessing the other's internals.

When Fish Pond, daytime window, furniture fire, craftable fire, or another
non-startup cursor frame is first required, the resolver returns the complete
cursor WebP. The existing shared promise cache then loads it on demand. No
special prefetching or speculative future abstraction is added.

## UI and material invariants

This work must not change:

- any original game asset or its retained complete WebP equivalent;
- visible pixels of the Shipping Bin lid or building shadows;
- building, catalog, canvas, toolbar, sidebar, or workspace geometry;
- component mounting, ordering, copy, controls, responsive rules, or styles;
- map positions, frame dimensions, footprints, selection hit areas, or
  z-order;
- the independent `InteriorDecorPanel` removal work, including its import,
  mount point, CSS, and component test changes.

No asset substitution, redraw, approximate crop, visual redesign, or layout
cleanup is in scope.

## Error handling

Invalid source rectangles are data-boundary errors and fail fast before an
asset request. Errors include the locked texture path and all received frame
values.

An exact startup mapping that references a missing or undecodable atlas is a
runtime error. It is surfaced through the existing planner startup failure
path; it is not silently replaced with another visual asset.

Valid cursor frames outside the startup whitelist are not errors. They use the
complete cursor WebP by design. This fallback is explicit compatibility
behavior, not exception recovery.

An absent source rectangle is valid for a complete-texture draw. Only a present
rectangle is subject to finite, integer, non-negative coordinate and positive
dimension validation.

## Performance measurement contract

The existing measurement script gains one optional numeric argument,
`--max-interactive-ms`. When provided, it replaces the built-in threshold for
that invocation only. The parser accepts only a finite positive number and
reports the received value when validation fails. Existing invocations without
the option keep their current profile thresholds.

The baseline and final acceptance use the production static output. Baseline
capture uses `--max-interactive-ms 10000` so the command can emit and retain all
three current-worktree samples without treating the baseline as an acceptance
run. Final acceptance changes only that option to `3839.1`; the option controls
the post-measurement assertion and does not alter throttling or page behavior.
Port `3000` belongs to the unrelated `token-maker-app` project and must not be
stopped, restarted, or otherwise affected. Both baseline and final commands use
the isolated static server on port `3001`.
The final command shape is:

```bash
pnpm build
pnpm exec serve out --listen 3001
node scripts/measure-editor-performance.mjs \
  --base-url http://127.0.0.1:3001 \
  --cdp-http-url http://127.0.0.1:9333 \
  --runtime react \
  --viewport mobile \
  --cache cold \
  --samples 3 \
  --max-interactive-ms 3839.1
```

The measurement environment is fixed to the script's current mobile contract:
`390x844`, device scale factor `1`, cache disabled and cleared per sample, Fast
4G at 8.1 Mbps downstream, 1.35 Mbps upstream, and 165 ms latency. Browser zoom
is 100 percent. The same Ego/Chromium installation, CDP endpoint, production
server command, worktree, and machine are used for baseline and final samples.
The browser version is captured in both result artifacts.

## Visual baseline contract

Before runtime code or the derived atlas changes, browser evidence is stored in
the same unique directory under
`/Users/wusir/Desktop/双代理临时文件`. A manifest fixes the route, map, season,
viewport, DPR, zoom, initial camera transform, selected catalog category, DOM
rectangles, and screenshot crop rectangles.

The baseline includes:

- the standard spring farm's world-space Farmhouse shadow rectangle
  `(944, 272, 144, 16)`;
- the standard spring farm's Shipping Bin shadow rectangle
  `(1136, 240, 32, 16)`;
- the standard spring farm's Shipping Bin lid rectangle
  `(1137, 201, 30, 25)`;
- the corresponding three changed-frame bounds on `Farm_FourCorners.tmx`,
  calculated from its placement render entries and recorded in the manifest;
- the entire Shipping Bin catalog thumbnail canvas and its DOM rectangle.

World-space bounds are translated through the recorded initial camera
transform into screenshot crop rectangles. Baseline and final captures use the
same browser session settings and editor state. Decoded RGBA comparison has
zero differing bytes and zero tolerance. The compared DOM rectangles must have
exactly equal `x`, `y`, `width`, and `height` values. Any mismatch fails the UI
invariant even when asset-level verification passes.

## Testing and verification

Unit tests cover:

- every exact source-to-atlas frame mapping;
- non-startup cursor fallback to the complete WebP with unchanged coordinates;
- non-cursor path behavior;
- malformed rectangle failures with value-bearing error messages;
- absent-frame complete-texture compatibility;
- all default-map startup cursor frames remaining within the approved set;
- all maps with cursor-backed default buildings resolving those frames to the
  startup atlas;
- `Island_W` and every other initial snapshot without cursor-backed frames
  resolving no initial cursor asset;
- the Buildings catalog cursor usage remaining limited to the Shipping Bin lid;
- texture-promise reuse when several rendered layers share the atlas;
- safe coexistence of atlas and complete cursor descriptors from the same
  original locked path;
- the Shipping Bin thumbnail's resolved image path, resolved source frame, and
  unchanged destination draw parameters through a pure draw-command boundary.

Node/Vitest tests stop at the pure thumbnail draw command because the repository
uses a Node test environment without a DOM effect harness. The real Image,
Canvas, and React effect path is verified in Ego through the visual baseline
contract rather than simulated in unit tests.

Asset verification covers every generated-region RGBA byte and the complete
atlas contract.

Browser verification under the same Fast 4G profile covers:

1. three cold starts and their median interactive time;
2. no request for the complete `Cursors.webp` before interactivity;
3. no complete cursor-sheet request caused by the default Buildings catalog;
4. one startup-atlas request shared by default building layers;
5. placing a Fish Pond loading the complete sheet on demand, with the request
   URL and timestamp recorded immediately before and after that action;
6. `Island_W` requesting neither cursor asset during its initial render;
7. every map with default buildings resolving its initial approved frames to
   the startup atlas in integration tests;
8. the standard farm and `Farm_FourCorners.tmx` passing the zero-tolerance
   visual and DOM-geometry baseline;
9. no browser runtime errors.

The implementation also runs the focused tests, complete Vitest suite,
`pnpm typecheck`, production `pnpm build`, the atlas verification script, and
`git diff --check`.

If the Fast 4G median exceeds `3839.1 ms`, the performance gate fails even when
all correctness checks pass. Any further optimization is a separate scope and
must be reported and approved before implementation.

## Explicit exclusions

- No deletion or replacement of the complete cursor assets.
- No conversion of additional sprite sheets.
- No change to persisted project or reference-project schemas.
- No catalog restructuring, component redesign, or layout change.
- No speculative frame-atlas framework for unrelated textures.
- No dependency installation, deployment, commit, or push.
