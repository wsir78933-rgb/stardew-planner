# Startup Cursor Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the complete startup-time cursor sheet with a verified `78x25` lossless WebP atlas while preserving every rendered pixel and reducing the Fast 4G three-run cold-start median to at most `3839.1 ms`.

**Architecture:** A pure frame resolver maps the four approved locked `Cursors.png` frames to one startup atlas and maps all other frames to the retained complete WebP. Canvas placement entries and building-thumbnail layers carry the resolved asset path together with the resolved frame, so one original locked path can safely use both textures. Initial preload is derived from the current map's actual placement entries, and every runtime, asset, performance, and browser boundary fails fast with value-bearing errors.

**Tech Stack:** TypeScript 5.9, React 19, Next.js 16 static export, PixiJS 8, Vitest 3, Node.js MJS scripts, FFmpeg, `cwebp`, `webpinfo`, Ego/Chromium CDP.

## Global Constraints

- Preserve the original `Cursors.png` and complete `Cursors.webp` unchanged.
- Do not change visible UI, component structure, DOM output, CSS, layout, copy, coordinates, dimensions, footprints, hit areas, z-order, or visible pixels. The only allowed component-source edit is the internal texture-resolution/drawing pipeline in `item-catalog-panel.tsx` plus the Canvas loading pipeline in `planner-canvas.tsx`.
- Do not touch `planner-workspace.tsx`, `InteriorDecorPanel` imports/mounting, its CSS, or its tests.
- Use high cohesion and low coupling; each function has one responsibility and modules communicate only through their public interfaces.
- Prefer plain functions and direct conditionals; do not add classes, strategy patterns, speculative atlas frameworks, or future-facing abstractions.
- Fail fast at file, CLI, frame, image, and runtime boundaries; every error names the invalid path or received value; never silently catch or ignore a failure.
- Use precise names; do not introduce identifiers named `data`, `temp`, `helper`, `util`, or `manager`.
- Add no npm dependency and make no database, API, schema, deployment, environment-variable, or hosting change.
- Store all review and temporary evidence under one unique directory in `/Users/wusir/Desktop/双代理临时文件`; do not use `/tmp`.
- Do not stage, commit, push, deploy, or update Hermes.
- Port `3000` belongs to the unrelated `token-maker-app` project. Never stop,
  restart, or otherwise affect it; use the isolated static test server on port
  `3001` for both the baseline and final measurements.
- Before changing runtime code or derived assets, capture the baseline described in Task 1.
- Completion requires the Fast 4G three-run median to be `<= 3839.1 ms`, exact asset RGBA equality, zero-difference visual crops, equal DOM rectangles, full tests, typecheck, build, and `git diff --check`.

## File Structure

- Create `scripts/startup-cursor-atlas-contract.mjs`: immutable source/atlas paths, dimensions, and four frame mappings used only by generation and verification scripts.
- Create `scripts/generate-startup-cursor-atlas.mjs`: validate the locked source, compose the fixed atlas, and encode exact lossless WebP.
- Create `scripts/verify-startup-cursor-atlas.mjs`: independently verify file boundaries, encoding, dimensions, transparency, and per-frame decoded RGBA equality.
- Create `public/planner-textures/initial/Cursors-startup.webp`: generated `78x25` startup atlas.
- Create `src/rendering/planner-texture-frame-resolution.ts`: shared locked-path/frame to resolved-path/frame interface.
- Create `tests/rendering/planner-texture-frame-resolution.test.ts`: exact resolver and fail-fast contract.
- Create `src/rendering/resolved-placement-texture.ts`: bind each `PlacementRenderEntry` to its resolved asset path and frame without changing the original rendering model.
- Create `tests/rendering/startup-cursor-atlas-coverage.test.ts`: all-default-map and no-cursor-map coverage.
- Modify `src/components/planner-canvas.tsx`: consume resolved placement entries, cache by resolved asset path, and preload actual initial placement textures.
- Modify `tests/components/planner-canvas.test.ts`: cache coexistence, promise reuse, remapped frame, and conditional preload regression tests.
- Modify `src/components/item-catalog-panel.tsx`: resolve thumbnail image/frame pairs and expose one pure draw-command function.
- Modify `tests/components/item-catalog-panel.test.tsx`: Shipping Bin atlas, draw geometry, full-texture sentinel, and request regression tests.
- Modify `tests/catalog/building-composition.test.ts`: lock the only catalog Cursor layer to `ShippingBinLid` and its original source frame.
- Modify `scripts/measure-editor-performance.mjs`: optional invocation-only interactive threshold.
- Modify `scripts/measure-editor-performance.d.mts`: measurement option and threshold assertion declarations.
- Modify `tests/performance/editor-performance-measurement-contract.test.ts`: CLI and threshold override tests.

---

### Task 0: Freeze dirty-worktree scope evidence before any implementation edit

**Files:**
- Read only: every authorized and protected path listed below.
- Evidence: `$STARTUP_CURSOR_REVIEW_DIR/baseline/worktree-scope.txt` and `$STARTUP_CURSOR_REVIEW_DIR/baseline/protected-scope.txt`.

**Interfaces:**
- Consumes: current dirty-worktree file bytes and existence state.
- Produces: a pre-edit SHA-256/existence manifest used by Task 6 to distinguish this task from pre-existing or concurrent edits.

- [ ] **Step 1: Create the unique Desktop evidence directory**

Run in an interactive shell before modifying any implementation, test, script, asset, or protected file:

```bash
STARTUP_CURSOR_REVIEW_DIR="$(mktemp -d '/Users/wusir/Desktop/双代理临时文件/startup-cursor-atlas-review-XXXXXX')"
mkdir -p "$STARTUP_CURSOR_REVIEW_DIR/baseline" "$STARTUP_CURSOR_REVIEW_DIR/final"
```

Record the exact returned path for every later task.

- [ ] **Step 2: Print the pre-edit existence and SHA-256 manifest**

Run this exact file set and preserve the output in `baseline/worktree-scope.txt` using `apply_patch`:

```bash
for STARTUP_CURSOR_SCOPE_PATH in \
  scripts/measure-editor-performance.mjs \
  scripts/measure-editor-performance.d.mts \
  tests/performance/editor-performance-measurement-contract.test.ts \
  scripts/startup-cursor-atlas-contract.mjs \
  scripts/generate-startup-cursor-atlas.mjs \
  scripts/verify-startup-cursor-atlas.mjs \
  public/planner-textures/initial/Cursors-startup.webp \
  public/game-assets/1.6.15/sprites/Cursors.png \
  public/planner-textures/initial/Cursors.webp \
  scripts/verify-initial-planner-texture-webp.mjs \
  src/rendering/initial-planner-texture-path.ts \
  src/rendering/planner-texture-frame-resolution.ts \
  src/rendering/resolved-placement-texture.ts \
  src/rendering/placement-rendering.ts \
  src/catalog/building-composition.ts \
  src/components/planner-canvas.tsx \
  src/components/item-catalog-panel.tsx \
  src/components/planner-workspace.tsx \
  src/components/interior-decor-panel.tsx \
  app/globals.css \
  tests/rendering/planner-texture-frame-resolution.test.ts \
  tests/rendering/initial-planner-texture-path.test.ts \
  tests/rendering/startup-cursor-atlas-coverage.test.ts \
  tests/rendering/building-composition-placement-rendering.test.ts \
  tests/components/planner-canvas.test.ts \
  tests/components/item-catalog-panel.test.tsx \
  tests/components/interior-decor-panel.test.tsx \
  tests/components/planner-workspace-layout.test.ts \
  tests/components/planner-workspace-layout.test.tsx \
  tests/catalog/building-composition.test.ts; do
  if [ -f "$STARTUP_CURSOR_SCOPE_PATH" ]; then
    shasum -a 256 "$STARTUP_CURSOR_SCOPE_PATH"
  else
    echo "MISSING  $STARTUP_CURSOR_SCOPE_PATH"
  fi
done
git status --short
```

Expected: output includes the current bytes of already modified/untracked files and explicit `MISSING` records for planned new files or files deleted by the independent Interior Decor task. Do not restore, normalize, or edit any protected file.

- [ ] **Step 3: Print the protected-only comparison manifest**

Run this exact command and save its output, in order, to
`baseline/protected-scope.txt` with `apply_patch`:

```bash
for STARTUP_CURSOR_PROTECTED_PATH in \
  public/game-assets/1.6.15/sprites/Cursors.png \
  public/planner-textures/initial/Cursors.webp \
  scripts/verify-initial-planner-texture-webp.mjs \
  src/rendering/initial-planner-texture-path.ts \
  src/rendering/placement-rendering.ts \
  src/catalog/building-composition.ts \
  src/components/planner-workspace.tsx \
  src/components/interior-decor-panel.tsx \
  app/globals.css \
  tests/rendering/initial-planner-texture-path.test.ts \
  tests/rendering/building-composition-placement-rendering.test.ts \
  tests/components/interior-decor-panel.test.tsx \
  tests/components/planner-workspace-layout.test.ts \
  tests/components/planner-workspace-layout.test.tsx; do
  if [ -f "$STARTUP_CURSOR_PROTECTED_PATH" ]; then
    shasum -a 256 "$STARTUP_CURSOR_PROTECTED_PATH"
  else
    echo "MISSING  $STARTUP_CURSOR_PROTECTED_PATH"
  fi
done
```

Expected: every later protected-file comparison has an exact pre-edit byte or
existence baseline even when Git already reports `M`, `D`, or `??`.

---

### Task 1: Add the invocation-specific performance gate and capture the unchanged baseline

**Files:**
- Modify: `scripts/measure-editor-performance.mjs`
- Modify: `scripts/measure-editor-performance.d.mts`
- Test: `tests/performance/editor-performance-measurement-contract.test.ts`
- Evidence: `$STARTUP_CURSOR_REVIEW_DIR/baseline/`, where Task 0 creates the unique directory under `/Users/wusir/Desktop/双代理临时文件`.

**Interfaces:**
- Consumes: existing CLI parser, `EDITOR_INTERACTIVE_THRESHOLDS`, and median calculation.
- Produces: `maximumInteractiveMilliseconds?: number` in `EditorPerformanceMeasurementOptions`; exported `assertInteractiveThreshold(options, median)`; unchanged behavior for invocations without the override.

- [ ] **Step 1: Write failing CLI and threshold tests**

Add imports for `assertInteractiveThreshold`, then add these cases:

```ts
it("accepts an optional finite positive --max-interactive-ms override", () => {
  expect(parseEditorPerformanceMeasurementArguments([
    "--base-url", "http://127.0.0.1:3000",
    "--cdp-http-url", "http://127.0.0.1:9333",
    "--runtime", "react",
    "--viewport", "mobile",
    "--cache", "cold",
    "--samples", "3",
    "--max-interactive-ms", "3839.1",
  ])).toEqual({
    baseUrl: "http://127.0.0.1:3000",
    cacheMode: "cold",
    cdpHttpUrl: "http://127.0.0.1:9333",
    maximumInteractiveMilliseconds: 3839.1,
    runtimeKind: "react",
    sampleCount: 3,
    viewportKind: "mobile",
  });
});

it.each(["", "0", "-1", "NaN", "Infinity"])(
  "rejects invalid --max-interactive-ms value %j",
  (receivedMaximum) => {
    expect(() => parseEditorPerformanceMeasurementArguments([
      "--base-url", "http://127.0.0.1:3000",
      "--cdp-http-url", "http://127.0.0.1:9333",
      "--runtime", "react",
      "--viewport", "mobile",
      "--cache", "cold",
      "--samples", "3",
      "--max-interactive-ms", receivedMaximum,
    ])).toThrow(new RegExp(`--max-interactive-ms.*${receivedMaximum || '\\\"\\\"'}`));
  },
);

it("uses the invocation override for the median gate", () => {
  expect(() => assertInteractiveThreshold({
    baseUrl: "http://127.0.0.1:3000",
    cacheMode: "cold",
    cdpHttpUrl: "http://127.0.0.1:9333",
    maximumInteractiveMilliseconds: 3839.1,
    runtimeKind: "react",
    sampleCount: 3,
    viewportKind: "mobile",
  }, 3840)).toThrow(/3840ms.*3839\.1ms.*mobile:cold/);
});

it("preserves the profile threshold when no override is provided", () => {
  expect(() => assertInteractiveThreshold({
    baseUrl: "http://127.0.0.1:3000",
    cacheMode: "cold",
    cdpHttpUrl: "http://127.0.0.1:9333",
    runtimeKind: "react",
    sampleCount: 3,
    viewportKind: "mobile",
  }, 2500.1)).toThrow(/2500\.1ms.*2500ms.*mobile:cold/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run tests/performance/editor-performance-measurement-contract.test.ts
```

Expected: FAIL because `--max-interactive-ms` is unsupported and `assertInteractiveThreshold` is not exported.

- [ ] **Step 3: Implement the smallest optional override**

Add `--max-interactive-ms` to `acceptedArgumentNames`. Parse it only when present so existing no-override result objects remain unchanged:

```js
function readOptionalPositiveNumber(parsedArguments, argumentName) {
  const receivedValue = parsedArguments.get(argumentName);
  if (receivedValue === undefined) {
    return undefined;
  }
  const parsedValue = Number(receivedValue);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(
      `Measurement option ${argumentName} received ${JSON.stringify(receivedValue)}. Expected a finite positive number.`,
    );
  }
  return parsedValue;
}
```

Return `maximumInteractiveMilliseconds` only when defined. Export and update the assertion:

```js
export function assertInteractiveThreshold(
  measurementOptions,
  medianInteractiveMilliseconds,
) {
  const thresholdKey = `${measurementOptions.viewportKind}:${measurementOptions.cacheMode}`;
  const maximumInteractiveMilliseconds =
    measurementOptions.maximumInteractiveMilliseconds ??
    EDITOR_INTERACTIVE_THRESHOLDS[thresholdKey];
  if (medianInteractiveMilliseconds > maximumInteractiveMilliseconds) {
    throw new Error(
      `Interactive median ${medianInteractiveMilliseconds}ms exceeded ${maximumInteractiveMilliseconds}ms for ${thresholdKey}.`,
    );
  }
}
```

Add the optional property and exported function to `measure-editor-performance.d.mts`. Include the effective threshold in the final summary JSON without changing page measurement behavior.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm exec vitest run tests/performance/editor-performance-measurement-contract.test.ts
```

Expected: PASS.

- [ ] **Step 5: Add environment details to the existing baseline manifest**

Run in the same interactive shell created in Task 0:

```bash
git status --short
node --version
ffmpeg -version
cwebp -version
webpinfo -version
```

Record the exact command output, current Git status, Ego/Chromium version, desktop visual profile (`1920x1080`, DPR `1`, zoom `100%`), mobile performance profile (`390x844`, DPR `1`, Fast 4G), map, season, initial camera transform, selected Buildings category, and later screenshot rectangles into `baseline/manifest.json` using `apply_patch`. Do not redirect shell output into a workspace file.

- [ ] **Step 6: Build and start the current production output without touching another process**

Run:

```bash
lsof -nP -iTCP:3001 -sTCP:LISTEN
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Port `3000` belongs to `token-maker-app` in another project and must not be
stopped or affected. If port `3001` is occupied, do not stop it unless it is a
previous static server started from this same review directory; otherwise stop
and report the environment conflict. Then run:

```bash
pnpm exec serve out --listen 3001
```

Expected: production static output is reachable at `http://127.0.0.1:3001` and Ego CDP is reachable at `http://127.0.0.1:9333`.

- [ ] **Step 7: Capture the three-sample mobile Fast 4G baseline**

Run before any runtime or derived-asset modification:

```bash
node scripts/measure-editor-performance.mjs \
  --base-url http://127.0.0.1:3001 \
  --cdp-http-url http://127.0.0.1:9333 \
  --runtime react \
  --viewport mobile \
  --cache cold \
  --samples 3 \
  --max-interactive-ms 10000
```

Expected: three JSON samples and a successful median summary. Preserve the exact returned JSON in `baseline/performance.json` with `apply_patch`.

- [ ] **Step 8: Capture the pre-change visual and network baseline with Ego**

Use the `ego-browser` skill at `1920x1080`, DPR `1`, zoom `100%`. Capture:

- standard spring farm: world rectangles `(944,272,144,16)`, `(1136,240,32,16)`, `(1137,201,30,25)` translated through the recorded initial camera transform;
- `Farm_FourCorners.tmx`: the corresponding frame bounds derived from its placement render entries;
- the complete Shipping Bin `80x80` thumbnail canvas and its exact DOMRect;
- requested URLs through interactivity and default Buildings catalog display.

Save screenshots and request evidence in `baseline/`. Record every crop rectangle and DOMRect in the manifest. Expected: current default path requests `/planner-textures/initial/Cursors.webp`; no screenshot or DOM comparison is performed yet.

### Task 2: Generate and independently verify the fixed startup atlas

**Files:**
- Create: `scripts/startup-cursor-atlas-contract.mjs`
- Create: `scripts/generate-startup-cursor-atlas.mjs`
- Create: `scripts/verify-startup-cursor-atlas.mjs`
- Create: `public/planner-textures/initial/Cursors-startup.webp`

**Interfaces:**
- Consumes: locked `public/game-assets/1.6.15/sprites/Cursors.png`, retained complete `public/planner-textures/initial/Cursors.webp`, FFmpeg, `cwebp`, and `webpinfo`.
- Produces: immutable `STARTUP_CURSOR_ATLAS_CONTRACT`; deterministic `78x25` exact-lossless WebP; standalone verifier.

- [ ] **Step 1: Add the immutable script contract**

Create `startup-cursor-atlas-contract.mjs` with these exact values:

```js
export const STARTUP_CURSOR_ATLAS_CONTRACT = Object.freeze({
  sourcePngRelativePath: "public/game-assets/1.6.15/sprites/Cursors.png",
  completeWebpRelativePath: "public/planner-textures/initial/Cursors.webp",
  atlasWebpRelativePath: "public/planner-textures/initial/Cursors-startup.webp",
  sourceDimensions: Object.freeze({ width: 704, height: 2256 }),
  atlasDimensions: Object.freeze({ width: 78, height: 25 }),
  frames: Object.freeze([
    Object.freeze({ id: "shipping-bin-lid", source: Object.freeze({ x: 134, y: 226, width: 30, height: 25 }), atlas: Object.freeze({ x: 0, y: 0, width: 30, height: 25 }) }),
    Object.freeze({ id: "building-shadow-left", source: Object.freeze({ x: 656, y: 394, width: 16, height: 16 }), atlas: Object.freeze({ x: 30, y: 0, width: 16, height: 16 }) }),
    Object.freeze({ id: "building-shadow-middle", source: Object.freeze({ x: 672, y: 394, width: 16, height: 16 }), atlas: Object.freeze({ x: 46, y: 0, width: 16, height: 16 }) }),
    Object.freeze({ id: "building-shadow-right", source: Object.freeze({ x: 688, y: 394, width: 16, height: 16 }), atlas: Object.freeze({ x: 62, y: 0, width: 16, height: 16 }) }),
  ]),
});
```

- [ ] **Step 2: Write the verifier before the atlas exists**

Implement `verifyStartupCursorAtlas()` with independent functions for required-file size, PNG IHDR dimensions, WebP metadata, RGBA decoding, region extraction, transparency coverage, and byte comparison. The verification order is:

```js
await assertRequiredFiles();
await assertSourceDimensions({ width: 704, height: 2256 });
await assertAtlasWebpContract({ width: 78, height: 25, lossless: true, alpha: 1 });
await assertAtlasSmallerThanCompleteWebp();
await assertMappedRegionsMatchDecodedSourceRgba();
await assertUnmappedAtlasPixelsAreTransparent();
```

Use these concrete region and transparency boundaries after decoding source and atlas images to RGBA buffers:

```js
function extractRgbaRegion(rgbaBytes, imageWidth, frame) {
  const regionBytes = Buffer.alloc(frame.width * frame.height * 4);
  for (let regionY = 0; regionY < frame.height; regionY += 1) {
    const sourceStart = ((frame.y + regionY) * imageWidth + frame.x) * 4;
    const sourceEnd = sourceStart + frame.width * 4;
    rgbaBytes.copy(regionBytes, regionY * frame.width * 4, sourceStart, sourceEnd);
  }
  return regionBytes;
}

function assertFrameRgbaMatches(sourceRgbaBytes, atlasRgbaBytes, frameContract) {
  const sourceRegion = extractRgbaRegion(
    sourceRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.sourceDimensions.width,
    frameContract.source,
  );
  const atlasRegion = extractRgbaRegion(
    atlasRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions.width,
    frameContract.atlas,
  );
  const firstDifferentByteOffset = sourceRegion.findIndex(
    (sourceByte, byteOffset) => sourceByte !== atlasRegion[byteOffset],
  );
  if (firstDifferentByteOffset !== -1) {
    throw new Error(
      `Startup Cursor atlas frame ${JSON.stringify(frameContract.id)} differs at RGBA byte ${String(firstDifferentByteOffset)}. Source path: ${JSON.stringify(sourcePngPath)}. Atlas path: ${JSON.stringify(atlasWebpPath)}. Source frame: ${JSON.stringify(frameContract.source)}. Atlas frame: ${JSON.stringify(frameContract.atlas)}.`,
    );
  }
}

function assertUnmappedAtlasPixelsAreTransparent(atlasRgbaBytes) {
  const { width, height } = STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions;
  const coveredPixels = new Uint8Array(width * height);
  for (const frameContract of STARTUP_CURSOR_ATLAS_CONTRACT.frames) {
    for (let y = frameContract.atlas.y; y < frameContract.atlas.y + frameContract.atlas.height; y += 1) {
      for (let x = frameContract.atlas.x; x < frameContract.atlas.x + frameContract.atlas.width; x += 1) {
        coveredPixels[y * width + x] = 1;
      }
    }
  }
  for (let pixelIndex = 0; pixelIndex < coveredPixels.length; pixelIndex += 1) {
    if (coveredPixels[pixelIndex] === 0 && atlasRgbaBytes[pixelIndex * 4 + 3] !== 0) {
      throw new Error(
        `Startup Cursor atlas ${JSON.stringify(atlasWebpPath)} unmapped pixel ${String(pixelIndex)} must be transparent; received alpha ${String(atlasRgbaBytes[pixelIndex * 4 + 3])}.`,
      );
    }
  }
}
```

Reuse the exact process/error, PNG IHDR, WebP metadata, and RGBA-decoding patterns already verified in `scripts/verify-initial-planner-texture-webp.mjs`; keep them private to this verifier and change the dimension rule to the explicit source/atlas dimensions in the contract.

For a pixel mismatch, throw an error containing the source path, atlas path, frame ID, source/atlas rectangles, and first differing RGBA byte offset.

- [ ] **Step 3: Run the verifier and verify RED**

Run:

```bash
node scripts/verify-startup-cursor-atlas.mjs
```

Expected: FAIL naming the missing `public/planner-textures/initial/Cursors-startup.webp` path.

- [ ] **Step 4: Implement the generator with one orchestration function**

The main function only validates, composes, encodes, and publishes:

```js
async function generateStartupCursorAtlas() {
  const temporaryRoot = await parseRequiredTemporaryRoot(process.argv.slice(2));
  await assertLockedSourceDimensions();
  const generationDirectory = await createGenerationDirectory(temporaryRoot);
  const intermediatePngPath = await composeStartupCursorAtlasPng(
    generationDirectory,
  );
  const generatedWebpPath = await encodeExactLosslessAtlas(
    intermediatePngPath,
    generationDirectory,
  );
  await link(generatedWebpPath, atlasWebpPath);
  await unlink(generatedWebpPath);
  await rm(generationDirectory, { recursive: true });
}
```

Accept exactly `--temporary-root <path>`, reject missing, duplicate, extra, or non-directory values with the full received argument list, and create a uniquely named child directory with `mkdtemp(join(temporaryRoot, "startup-cursor-atlas-"))`. The caller passes Task 0's unique review directory, never its parent.

Resolve repository files from the script location, never from the caller's
current directory, and parse the CLI with these concrete boundaries:

```js
const workspaceDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourcePngPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.sourcePngRelativePath,
);
const atlasWebpPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.atlasWebpRelativePath,
);

async function parseRequiredTemporaryRoot(argumentValues) {
  if (
    argumentValues.length !== 2 ||
    argumentValues[0] !== "--temporary-root" ||
    typeof argumentValues[1] !== "string" ||
    argumentValues[1].length === 0
  ) {
    throw new Error(
      `Expected --temporary-root followed by one directory path; received ${JSON.stringify(argumentValues)}.`,
    );
  }
  const temporaryRoot = resolve(argumentValues[1]);
  const temporaryRootStats = await stat(temporaryRoot);
  if (!temporaryRootStats.isDirectory()) {
    throw new Error(
      `Startup Cursor temporary root must be a directory; received ${JSON.stringify(temporaryRoot)}.`,
    );
  }
  return temporaryRoot;
}
```

Wrap the `stat` failure only to add the received path as `cause`; do not convert
an unknown filesystem failure into success.

Use this exact FFmpeg graph so the three `16x16` shadows are top-aligned and transparently padded to `16x25` before stacking:

```js
const atlasFilter = [
  "[0:v]crop=30:25:134:226,format=rgba[lid]",
  "[0:v]crop=16:16:656:394,format=rgba,pad=16:25:0:0:color=0x00000000[left]",
  "[0:v]crop=16:16:672:394,format=rgba,pad=16:25:0:0:color=0x00000000[middle]",
  "[0:v]crop=16:16:688:394,format=rgba,pad=16:25:0:0:color=0x00000000[right]",
  "[lid][left][middle][right]hstack=inputs=4,format=rgba[atlas]",
].join(";");

await runCommand("ffmpeg", [
  "-v", "error",
  "-y",
  "-i", sourcePngPath,
  "-filter_complex", atlasFilter,
  "-map", "[atlas]",
  "-frames:v", "1",
  intermediatePngPath,
]);
```

Encode into the owned generation directory before atomically publishing the successful result to the public asset path with a same-filesystem, no-replace hard link:

```js
await runCommand("cwebp", [
  "-lossless",
  "-exact",
  "-m",
  "6",
  intermediatePngPath,
  "-o",
  generatedWebpPath,
]);
```

`encodeExactLosslessAtlas` defines and returns:

```js
const generatedWebpPath = join(
  generationDirectory,
  "Cursors-startup.webp",
);
```

Only the orchestration function publishes this fully encoded file to
`atlasWebpPath` with `link()`, which fails with `EEXIST` instead of replacing
an existing destination. After the link succeeds, it unlinks only its owned
temporary source path.

The script removes only its own generated child directory after a successful exclusive publish. On failure it retains that child directory as evidence and propagates the error with command name, exit code, and stderr. An `EXDEV` publish failure must include both temporary and target paths because the atomic hard-link boundary requires one filesystem. It never deletes the review directory, its baseline/final evidence, or any original asset.

- [ ] **Step 5: Generate the atlas and verify GREEN**

Run, substituting the exact directory created in Task 1:

```bash
node scripts/generate-startup-cursor-atlas.mjs \
  --temporary-root "$STARTUP_CURSOR_REVIEW_DIR"
node scripts/verify-startup-cursor-atlas.mjs
node scripts/verify-initial-planner-texture-webp.mjs
```

Expected: the new verifier reports one valid `78x25` startup atlas; the existing verifier still reports all four complete WebPs valid.

### Task 3: Add the pure shared texture-frame resolver

**Files:**
- Create: `src/rendering/planner-texture-frame-resolution.ts`
- Test: `tests/rendering/planner-texture-frame-resolution.test.ts`
- Preserve: `src/rendering/initial-planner-texture-path.ts`

**Interfaces:**
- Consumes: `resolveInitialPlannerTextureAssetPath(textureAssetPath)`.
- Produces: `PlannerTextureFrame`, `ResolvedPlannerTextureFrame`, and `resolvePlannerTextureFrame(lockedTexturePath, sourceFrame)`.

- [ ] **Step 1: Write the complete failing resolver contract**

Use these public types and exact expected mappings:

```ts
export type PlannerTextureFrame = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type ResolvedPlannerTextureFrame = Readonly<{
  resolvedAssetPath: string;
  resolvedFrame: PlannerTextureFrame | null;
}>;
```

Add tests named:

- `maps every approved Cursors source frame to its exact startup-atlas frame`;
- `keeps a non-startup Cursors frame on the complete WebP with unchanged coordinates`;
- `preserves a non-Cursors frame through the existing initial path resolver`;
- `preserves a null full-texture frame`;
- `rejects malformed explicit frames with the locked path and received values`.

The malformed table includes `undefined`, a string, `{}`, `x: -1`, `x: NaN`, `y: 1.5`, `width: 0`, and `height: Infinity`; assertions must see the actual invalid value rather than JSON-converted `null`. Cast runtime-invalid inputs through `unknown` in the test instead of weakening the public type.

- [ ] **Step 2: Run the resolver test and verify RED**

Run:

```bash
pnpm exec vitest run tests/rendering/planner-texture-frame-resolution.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement exact mapping and validation**

Implement:

```ts
export function resolvePlannerTextureFrame(
  lockedTexturePath: string,
  sourceFrame: PlannerTextureFrame | null,
): ResolvedPlannerTextureFrame
```

Use `/game-assets/1.6.15/sprites/Cursors.png` as the only atlas-eligible locked path and `/planner-textures/initial/Cursors-startup.webp` as the atlas path. The runtime mapping table in this task is exactly:

```ts
const startupCursorFrameByLockedFrameKey = new Map<string, PlannerTextureFrame>([
  [createFrameKey(cursorLockedPath, { x: 134, y: 226, width: 30, height: 25 }), { x: 0, y: 0, width: 30, height: 25 }],
  [createFrameKey(cursorLockedPath, { x: 656, y: 394, width: 16, height: 16 }), { x: 30, y: 0, width: 16, height: 16 }],
  [createFrameKey(cursorLockedPath, { x: 672, y: 394, width: 16, height: 16 }), { x: 46, y: 0, width: 16, height: 16 }],
  [createFrameKey(cursorLockedPath, { x: 688, y: 394, width: 16, height: 16 }), { x: 62, y: 0, width: 16, height: 16 }],
]);

function createFrameKey(
  lockedTexturePath: string,
  frame: PlannerTextureFrame,
): string {
  return `${lockedTexturePath}|${String(frame.x)},${String(frame.y)},${String(frame.width)},${String(frame.height)}`;
}
```

`createFrameKey` includes the locked path plus all four coordinates. Validate before key construction:

```ts
function assertPlannerTextureFrame(
  lockedTexturePath: string,
  receivedFrame: unknown,
): asserts receivedFrame is PlannerTextureFrame {
  const frameRecord =
    typeof receivedFrame === "object" && receivedFrame !== null
      ? receivedFrame as Partial<Record<keyof PlannerTextureFrame, unknown>>
      : null;
  const receivedValues = `x=${String(frameRecord?.x)}, y=${String(frameRecord?.y)}, width=${String(frameRecord?.width)}, height=${String(frameRecord?.height)}`;
  const receivedFrameDescription =
    typeof receivedFrame === "string"
      ? JSON.stringify(receivedFrame)
      : String(receivedFrame);
  if (
    frameRecord === null ||
    !isNonNegativeInteger(frameRecord.x) ||
    !isNonNegativeInteger(frameRecord.y) ||
    !isPositiveInteger(frameRecord.width) ||
    !isPositiveInteger(frameRecord.height)
  ) {
    throw new TypeError(
      `Planner texture frame for ${JSON.stringify(lockedTexturePath)} must contain non-negative integer x/y and positive integer width/height; received frame ${receivedFrameDescription}; fields ${receivedValues}.`,
    );
  }
}

function isNonNegativeInteger(receivedValue: unknown): receivedValue is number {
  return typeof receivedValue === "number" &&
    Number.isFinite(receivedValue) &&
    Number.isInteger(receivedValue) &&
    receivedValue >= 0;
}

function isPositiveInteger(receivedValue: unknown): receivedValue is number {
  return typeof receivedValue === "number" &&
    Number.isFinite(receivedValue) &&
    Number.isInteger(receivedValue) &&
    receivedValue > 0;
}
```

`null` is the only valid no-frame value. `undefined`, strings, arrays, and partial objects fail through this explicit error rather than an accidental property-access error. For `null`, return `resolveInitialPlannerTextureAssetPath(lockedTexturePath)` plus `null`. For a valid non-whitelisted frame, preserve coordinates and use the existing path resolver.

- [ ] **Step 4: Run resolver and existing path tests**

Run:

```bash
pnpm exec vitest run \
  tests/rendering/planner-texture-frame-resolution.test.ts \
  tests/rendering/initial-planner-texture-path.test.ts
```

Expected: PASS; the existing complete-Cursors path fallback remains unchanged.

### Task 4: Bind resolved entries to Pixi loading, sprites, and actual initial preload

**Files:**
- Create: `src/rendering/resolved-placement-texture.ts`
- Create: `tests/rendering/startup-cursor-atlas-coverage.test.ts`
- Modify: `src/components/planner-canvas.tsx`
- Test: `tests/components/planner-canvas.test.ts`
- Preserve: `src/rendering/placement-rendering.ts`

**Interfaces:**
- Consumes: `PlacementRenderEntry`, `resolvePlannerTextureFrame`, initial placement snapshot, catalog items, and existing resolved-URL promise cache.
- Produces: `ResolvedPlacementTextureEntry`, `resolvePlacementTextureEntry`, `resolvePlacementTextureEntries`, and `loadPlacementTextures` keyed by resolved asset path.

- [ ] **Step 1: Write failing resolved-entry and all-map coverage tests**

Define the public type expected by tests:

```ts
export type ResolvedPlacementTextureEntry = Readonly<{
  placementRenderEntry: PlacementRenderEntry;
  resolvedAssetPath: string;
  resolvedFrame: PlacementRenderFrame;
}>;
```

Add tests proving:

- all four default cursor frames resolve to the startup atlas;
- every map whose initial snapshot includes Cursor-backed default building layers resolves those layers to the atlas;
- `Island_W` and any initial snapshot without cursor-backed layers produce no cursor asset descriptor;
- the original `PlacementRenderEntry` retains its locked path and original frame.

Use the existing locked building catalog loader plus `plannerMaps`,
`createInitialMapPlacementSnapshot(map.id)`,
`createPlacementRenderEntries(snapshot, catalogItems, "spring", map.id)`, and
`resolvePlacementTextureEntries(entries)`. Filter descriptors whose original
effective path is `Cursors.png`; assert that every non-empty set uses only
`/planner-textures/initial/Cursors-startup.webp`, while the `Island_W` set is
empty.

- [ ] **Step 2: Run coverage tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/rendering/startup-cursor-atlas-coverage.test.ts
```

Expected: FAIL because `resolved-placement-texture.ts` does not exist.

- [ ] **Step 3: Implement the resolved placement binding**

Implement only these functions:

```ts
export function resolvePlacementTextureEntry(
  placementRenderEntry: PlacementRenderEntry,
): ResolvedPlacementTextureEntry

export function resolvePlacementTextureEntries(
  placementRenderEntries: readonly PlacementRenderEntry[],
): readonly ResolvedPlacementTextureEntry[]
```

Resolve `placementRenderEntry.textureLocalPath ?? placementRenderEntry.catalogItem.textureLocalPath` with the entry's frame. Do not mutate the original entry and do not copy UI or Pixi concerns into this module.

- [ ] **Step 4: Write failing Canvas cache/preload/sprite tests**

Update existing tests and add:

- `preloads the startup cursor atlas once for shared default placement frames`;
- `loads startup-atlas and complete-Cursors textures separately for one locked cursor path`;
- `preloads no cursor asset for initial entries without cursor frames`;
- `reuses initial resolved texture promises during the first placement render`;
- `creates Pixi child textures from atlas frames without changing placement geometry`;
- `keeps a non-startup window cursor frame on the complete Cursors WebP`.
- `keeps all four furniture-fire animation frames on the complete Cursors WebP and releases their child textures`.

For the coexistence test, pass two resolved entries whose original locked path is `Cursors.png`, with one Shipping Bin lid frame and one window frame. Expect exactly these cache keys:

```ts
new Set([
  "/planner-textures/initial/Cursors-startup.webp",
  "/planner-textures/initial/Cursors.webp",
])
```

Construct that input directly from the test's existing `createLayerRenderEntry`
fixture:

```ts
const lockedCursorPath = "/game-assets/1.6.15/sprites/Cursors.png";
const resolvedEntries = resolvePlacementTextureEntries([
  {
    ...createLayerRenderEntry(false),
    frame: { x: 134, y: 226, width: 30, height: 25 },
    textureLocalPath: lockedCursorPath,
  },
  {
    ...createLayerRenderEntry(false),
    frame: { x: 21, y: 1695, width: 41, height: 67 },
    textureLocalPath: lockedCursorPath,
  },
]);
const loadedTextures = await loadPlacementTextures(
  textureLoadingPixi,
  resolvedEntries,
  placementTexturePromisesByResolvedUrl,
);
expect(new Set(loadedTextures.keys())).toEqual(new Set([
  "/planner-textures/initial/Cursors-startup.webp",
  "/planner-textures/initial/Cursors.webp",
]));
```

For conditional preload, call `loadPlannerCanvasInitialTextures` once with
resolved default-building entries and once with `[]`. The first call must
request the atlas and not the complete Cursor sheet; the second call must
request neither cursor URL while still returning unchanged tilesheet and
resource-clump textures.

For the animation regression, use the real frame cycle
`(276,1985,12,11)`, `(288,1985,12,11)`, `(300,1985,12,11)`, and
`(312,1985,12,11)`. Assert that the descriptor path is the complete
`/planner-textures/initial/Cursors.webp`, the four animation coordinates are
unchanged, and the existing destroy path releases every owned child texture.

- [ ] **Step 5: Run Canvas tests and verify RED**

Run:

```bash
pnpm exec vitest run \
  tests/rendering/planner-texture-frame-resolution.test.ts \
  tests/rendering/startup-cursor-atlas-coverage.test.ts \
  tests/components/planner-canvas.test.ts \
  --testTimeout=15000
```

Expected: new Canvas tests FAIL because loading is still keyed by locked path and preload is still unconditional.

- [ ] **Step 6: Change Canvas to consume resolved entries**

Apply this data flow without changing `PlacementRenderEntry`:

```ts
const placementRenderEntries = createPlacementRenderEntries(
  createPlacementSpritesInput.placementSnapshot,
  createPlacementSpritesInput.catalogItems,
  createPlacementSpritesInput.season,
  createPlacementSpritesInput.mapId,
  createPlacementSpritesInput.mapPlacementGrid,
  createPlacementSpritesInput.isNightMode,
);
const resolvedPlacementTextureEntries = resolvePlacementTextureEntries(
  placementRenderEntries,
);
const placementTexturesByResolvedAssetPath = await loadPlacementTextures(
  pixi,
  resolvedPlacementTextureEntries,
  placementTexturePromisesByResolvedUrl,
);
```

`loadPlacementTextures` dedupes and returns a Map by `resolvedAssetPath`. Iterate each resolved descriptor as one unit; do not zip separate original/resolved arrays by index. Each sprite reads the texture by its descriptor's path and receives `{ ...descriptor.placementRenderEntry, frame: descriptor.resolvedFrame }`. Building paint continues to receive `descriptor.placementRenderEntry`. All other original fields remain unchanged. The shared lower-level loader accepts an already resolved asset path and caches that exact path. Map tilesheets and resource-clump loading continue to call the existing locked-path resolver before that lower-level loader. Destroy the atlas child-frame texture through the existing placement-sprite cleanup path and assert that destruction in the atlas-frame test.

- [ ] **Step 7: Replace unconditional Cursors preload with actual placement descriptors**

Before `loadPlannerCanvasInitialTextures`, read the optional current catalog and snapshot. Create initial placement entries only when both exist; otherwise pass an empty descriptor array and continue without error:

```ts
const initialCatalogItems = catalogItemsReference.current;
const initialPlacementSnapshot = placementSnapshotReference.current;
const resolvedInitialPlacementTextureEntries =
  initialCatalogItems === undefined || initialPlacementSnapshot === undefined
    ? []
    : resolvePlacementTextureEntries(createPlacementRenderEntries(
        initialPlacementSnapshot,
        initialCatalogItems,
        season,
        mapId,
        mapPlacementGrid,
        displayOptionsReference.current.showNightMode,
      ));
```

Add a test that missing catalog or missing snapshot requests neither Cursor
asset and does not throw. Then extend the loader signature to accept those
resolved entries:

```ts
loadPlannerCanvasInitialTextures(
  pixi,
  renderingContract.tilesets,
  resolvedInitialPlacementTextureEntries,
  placementTexturePromisesByResolvedUrl,
)
```

Inside, preload the unique `resolvedAssetPath` values in the same `Promise.all` as map and resource textures. Remove the hard-coded full `Cursors.png` load. If no resolved initial entry points to either cursor asset, request neither one.

- [ ] **Step 8: Run Canvas and coverage tests and verify GREEN**

Run:

```bash
pnpm exec vitest run \
  tests/rendering/planner-texture-frame-resolution.test.ts \
  tests/rendering/startup-cursor-atlas-coverage.test.ts \
  tests/components/planner-canvas.test.ts \
  --testTimeout=15000
```

Expected: PASS, including `Island_W`, mixed atlas/full Cursors, unchanged geometry, and promise reuse.

### Task 5: Reuse the shared resolver in the Shipping Bin catalog thumbnail

**Files:**
- Modify: `src/components/item-catalog-panel.tsx`
- Test: `tests/components/item-catalog-panel.test.tsx`
- Test: `tests/catalog/building-composition.test.ts`
- Regression: `tests/rendering/building-composition-placement-rendering.test.ts`
- Do not modify: `src/catalog/building-composition.ts`

**Interfaces:**
- Consumes: `resolvePlannerTextureFrame`, building composition layers, loaded images, and existing thumbnail layout math.
- Produces: `BuildingThumbnailLayerDrawCommand` and `createBuildingThumbnailLayerDrawCommand(input)`; image Map keyed by resolved asset path.

- [ ] **Step 1: Lock the complete catalog Cursor boundary**

Add a dataset enumeration test that collects every thumbnail layer whose effective texture path is `/game-assets/1.6.15/sprites/Cursors.png` and expects exactly:

```ts
[
  {
    catalogItemId: "building:Shipping Bin",
    layerId: "ShippingBinLid",
    frame: { kind: "source-rect", x: 134, y: 226, width: 30, height: 25 },
  },
]
```

Run:

```bash
pnpm exec vitest run tests/catalog/building-composition.test.ts
```

Expected: PASS; this is a characterization guard, not a production change.

- [ ] **Step 2: Write failing thumbnail atlas and draw-command tests**

Expect this public contract:

```ts
export type BuildingThumbnailLayerDrawCommand = Readonly<{
  resolvedAssetPath: string;
  sourceFrame: PlannerTextureFrame;
  destinationX: number;
  destinationY: number;
  destinationWidth: number;
  destinationHeight: number;
}>;

export function createBuildingThumbnailLayerDrawCommand(
  input: Readonly<{
    drawScale: number;
    layer: CatalogBuildingMultilayerLayer;
    originX: number;
    originY: number;
    resolvedAssetPath: string;
    resolvedFrame: PlannerTextureFrame;
  }>,
): BuildingThumbnailLayerDrawCommand;
```

Tests prove the Shipping Bin lid requests `/planner-textures/initial/Cursors-startup.webp`, uses source frame `{x:0,y:0,width:30,height:25}`, preserves the existing destination formula, and never requests the complete Cursor WebP for the default Buildings catalog. Also add:

```ts
it("materializes a valid 0x0 full-texture sentinel from image dimensions", () => {
  expect(materializeBuildingThumbnailFrame(
    "Base",
    null,
    { naturalWidth: 64, naturalHeight: 96 } as HTMLImageElement,
  )).toEqual({ x: 0, y: 0, width: 64, height: 96 });
});

it.each([
  { width: 0, height: 16 },
  { width: 16, height: 0 },
])("rejects a single-zero building thumbnail frame $width x $height", (frame) => {
  expect(() => normalizeBuildingThumbnailSourceFrame("Base", {
    kind: "source-rect",
    x: 0,
    y: 0,
    ...frame,
  })).toThrow(/Base.*invalid source dimensions/);
});
```

Expose `normalizeBuildingThumbnailSourceFrame` and `materializeBuildingThumbnailFrame` only if the Node tests need the pure boundary; neither function may access React, DOM state, or Canvas. Preserve the existing `80x80` static markup test.

- [ ] **Step 3: Run thumbnail tests and verify RED**

Run:

```bash
pnpm exec vitest run \
  tests/components/item-catalog-panel.test.tsx \
  tests/catalog/building-composition.test.ts \
  --testTimeout=15000
```

Expected: new tests FAIL because the thumbnail loader still resolves only by locked path.

- [ ] **Step 4: Implement the two-stage thumbnail boundary**

Use this exact order:

1. Convert a `0x0` full-texture sentinel to `null`; pass every explicit frame unchanged to `resolvePlannerTextureFrame`.
2. Deduplicate and load images by `resolvedAssetPath`.
3. Materialize a `null` frame from the loaded image's positive finite `naturalWidth` and `naturalHeight`.
4. Calculate existing bounds, origin, and draw scale without changing formulas.
5. Create a pure draw command and pass it to the existing Canvas/tint drawing code.

`loadBuildingThumbnailImages` accepts already resolved asset paths and returns `ReadonlyMap<string, HTMLImageElement>` keyed by those paths. It does not call the resolver internally. Preserve the existing active flag and stale resolve/reject behavior; do not change DOM, class names, canvas size, opacity, tint, or layout.

The updated `drawBuildingThumbnailLayer` receives both the pure
`BuildingThumbnailLayerDrawCommand` and the original composition `layer`.
It uses the command only for resolved image/frame/destination values and uses
the original layer only for the existing opacity and tint branches. This
prevents the new command boundary from dropping or reinterpreting visual
properties.

- [ ] **Step 5: Run thumbnail and building regression tests and verify GREEN**

Run:

```bash
pnpm exec vitest run \
  tests/components/item-catalog-panel.test.tsx \
  tests/catalog/building-composition.test.ts \
  tests/rendering/building-composition-placement-rendering.test.ts \
  tests/components/planner-workspace-layout.test.ts \
  tests/components/planner-workspace-layout.test.tsx \
  --testTimeout=15000
```

Expected: PASS; Shipping Bin uses the atlas while ordinary full-texture buildings and Fish Pond thumbnails remain correct.

### Task 6: Run full regression and exact browser acceptance

**Files:**
- Verify all files above.
- Evidence: `$STARTUP_CURSOR_REVIEW_DIR/final/`, using the exact directory created in Task 1.
- Preserve: every visible UI/DOM/CSS/layout behavior, every protected `planner-workspace`/`InteriorDecorPanel` file, every original asset, and the complete WebP. Internal loading-pipeline edits in `planner-canvas.tsx` and `item-catalog-panel.tsx` remain authorized.

**Interfaces:**
- Consumes: generated atlas, complete implementation, Task 1 baseline, production static output, and Ego CDP.
- Produces: objective correctness, visual, network, and performance evidence; no commit.

- [ ] **Step 1: Run asset and focused verification**

Run:

```bash
node scripts/verify-startup-cursor-atlas.mjs
node scripts/verify-initial-planner-texture-webp.mjs
pnpm exec vitest run \
  tests/performance/editor-performance-measurement-contract.test.ts \
  tests/rendering/initial-planner-texture-path.test.ts \
  tests/rendering/planner-texture-frame-resolution.test.ts \
  tests/rendering/startup-cursor-atlas-coverage.test.ts \
  tests/components/planner-canvas.test.ts \
  tests/components/item-catalog-panel.test.tsx \
  tests/catalog/building-composition.test.ts \
  tests/rendering/building-composition-placement-rendering.test.ts \
  --testTimeout=15000
```

Expected: all commands PASS.

- [ ] **Step 2: Run the complete repository verification**

Run:

```bash
pnpm exec vitest run tests --testTimeout=15000
pnpm typecheck
NEXT_TELEMETRY_DISABLED=1 pnpm build
git diff --check
```

Expected: every test passes, typecheck is clean, all production routes build, and no whitespace errors exist.

- [ ] **Step 3: Start the rebuilt production output and clear only owned browser state**

Confirm the server on port 3001 is the current workspace's new `out` build. Port
3000 belongs to the unrelated `token-maker-app` project and must not be stopped
or affected. Use Ego/Chromium at the same version and CDP endpoint recorded in
the baseline. Clear cache per cold sample; do not delete user profile, cookies,
projects, or unrelated browser state.

- [ ] **Step 4: Verify startup and on-demand network boundaries**

Use two independent fresh Ego pages. Enable Network monitoring and clear cache
before navigation in each page so one scenario cannot hide another through a
shared cache. In the first page, verify the standard farm, default Buildings
catalog, and Fish Pond sequence. In the second page, verify only `Island_W`.
Record URL and timestamp evidence that:

- the standard farm requests `Cursors-startup.webp` exactly once logically and never transfers the complete `Cursors.webp` before interactivity;
- showing the default Buildings catalog does not request complete `Cursors.webp`;
- `Island_W` requests neither `Cursors-startup.webp` nor complete `Cursors.webp` during initial render;
- placing a Fish Pond is the explicit trigger that first requests complete `Cursors.webp`;
- the request immediately before and after Fish Pond placement is recorded;
- no original `Cursors.png` request or browser runtime error occurs.

- [ ] **Step 5: Capture and compare exact visual evidence**

At the same `1920x1080`, DPR `1`, zoom `100%`, maps, season, category, and camera transform as the baseline, capture the standard farm, `Farm_FourCorners.tmx`, and Shipping Bin thumbnail. Compare decoded RGBA for every recorded crop with zero differing bytes and zero tolerance. Compare recorded DOMRect `x`, `y`, `width`, and `height` values for exact equality. Any mismatch fails acceptance; do not adjust UI to hide it.

Run these exact zero-tolerance comparisons after saving the named crops:

```bash
set -euo pipefail
mkdir -p "$STARTUP_CURSOR_REVIEW_DIR/final/rgba-comparison"
for STARTUP_CURSOR_CROP_NAME in \
  standard-farmhouse-shadow \
  standard-shipping-bin-shadow \
  standard-shipping-bin-lid \
  four-corners-farmhouse-shadow \
  four-corners-shipping-bin-shadow \
  four-corners-shipping-bin-lid \
  shipping-bin-thumbnail; do
  STARTUP_CURSOR_BASELINE_PNG="$STARTUP_CURSOR_REVIEW_DIR/baseline/$STARTUP_CURSOR_CROP_NAME.png"
  STARTUP_CURSOR_FINAL_PNG="$STARTUP_CURSOR_REVIEW_DIR/final/$STARTUP_CURSOR_CROP_NAME.png"
  STARTUP_CURSOR_BASELINE_RGBA="$STARTUP_CURSOR_REVIEW_DIR/final/rgba-comparison/$STARTUP_CURSOR_CROP_NAME-baseline.rgba"
  STARTUP_CURSOR_FINAL_RGBA="$STARTUP_CURSOR_REVIEW_DIR/final/rgba-comparison/$STARTUP_CURSOR_CROP_NAME-final.rgba"
  test -s "$STARTUP_CURSOR_BASELINE_PNG"
  test -s "$STARTUP_CURSOR_FINAL_PNG"
  STARTUP_CURSOR_BASELINE_DIMENSIONS="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$STARTUP_CURSOR_BASELINE_PNG")"
  STARTUP_CURSOR_FINAL_DIMENSIONS="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$STARTUP_CURSOR_FINAL_PNG")"
  test -n "$STARTUP_CURSOR_BASELINE_DIMENSIONS"
  test "$STARTUP_CURSOR_BASELINE_DIMENSIONS" = "$STARTUP_CURSOR_FINAL_DIMENSIONS"
  ffmpeg -v error -y -i "$STARTUP_CURSOR_BASELINE_PNG" -f rawvideo -pix_fmt rgba "$STARTUP_CURSOR_BASELINE_RGBA"
  ffmpeg -v error -y -i "$STARTUP_CURSOR_FINAL_PNG" -f rawvideo -pix_fmt rgba "$STARTUP_CURSOR_FINAL_RGBA"
  test -s "$STARTUP_CURSOR_BASELINE_RGBA"
  test -s "$STARTUP_CURSOR_FINAL_RGBA"
  cmp "$STARTUP_CURSOR_BASELINE_RGBA" "$STARTUP_CURSOR_FINAL_RGBA"
done

node -e '
const { readFileSync } = require("node:fs");
const baseline = JSON.parse(readFileSync(process.argv[1], "utf8"));
const finalRects = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (JSON.stringify(baseline) !== JSON.stringify(finalRects)) {
  throw new Error(`DOM rectangles differ. Baseline: ${JSON.stringify(baseline)}. Final: ${JSON.stringify(finalRects)}.`);
}
' "$STARTUP_CURSOR_REVIEW_DIR/baseline/dom-rects.json" "$STARTUP_CURSOR_REVIEW_DIR/final/dom-rects.json"
```

Expected: every `cmp` and the DOMRect comparison exit zero.

- [ ] **Step 6: Run the final Fast 4G gate**

Run:

```bash
node scripts/measure-editor-performance.mjs \
  --base-url http://127.0.0.1:3001 \
  --cdp-http-url http://127.0.0.1:9333 \
  --runtime react \
  --viewport mobile \
  --cache cold \
  --samples 3 \
  --max-interactive-ms 3839.1
```

Expected: three samples are emitted and the median is `<= 3839.1 ms`. Preserve exact sample JSON, median, request URLs, browser version, and command in `final/performance.json` and the final manifest using `apply_patch`.

- [ ] **Step 7: Review scope and hand off without committing**

Run:

```bash
git status --short
git diff --stat
git diff --check
```

Re-run Task 0's full existence/SHA-256 loop and save the output as
`final/worktree-scope.txt`. Re-run Task 0 Step 3's protected-only list in the
same order and save it as `final/protected-scope.txt`. Then run:

```bash
diff -u \
  "$STARTUP_CURSOR_REVIEW_DIR/baseline/protected-scope.txt" \
  "$STARTUP_CURSOR_REVIEW_DIR/final/protected-scope.txt"
```

Expected: exit zero. The authoritative protected list is the complete 14-path
Task 0 Step 3 list recorded in `baseline/protected-scope.txt`; regenerate it in
the same order without omitting any path. The following seven paths are only a
short high-risk summary and must not replace the 14-path comparison:

```text
public/game-assets/1.6.15/sprites/Cursors.png
public/planner-textures/initial/Cursors.webp
src/rendering/placement-rendering.ts
src/components/planner-workspace.tsx
src/components/interior-decor-panel.tsx
app/globals.css
tests/components/interior-decor-panel.test.tsx
```

If a protected hash changes because of concurrent work, report that fact and do
not claim this task proved zero touch. Confirm that only the explicitly
authorized internal source files changed for this task and that visible
UI/DOM/CSS/layout evidence is identical. Report modified files, all verification
results, baseline/final medians, transfer behavior, exact evidence-directory
path, and any remaining limitation. Do not stage or commit.
