# Public Preview WebP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce public farm and Mod preview bytes with 29 exact-lossless WebP
derivatives while preserving editor PNG paths and all page geometry.

**Architecture:** One pure preview-path interface maps locked relative PNG
paths to a versioned public WebP path. A generator owns encoding; an independent
verifier owns lossless/dimension/RGBA validation. Public registries use the
derived URL, while `PlannerMap.previewOutputPath` and synchronized game assets
remain unchanged.

**Tech Stack:** TypeScript, Vitest, React static markup, `tsx`, `cwebp`,
`webpinfo`, `ffmpeg`, Next.js static export.

## Global Constraints

- Work in the current workspace; do not create a worktree.
- Do not stage, commit, push, deploy, install dependencies, or modify
  Cloudflare.
- Do not modify CSS, editor components, `PlannerMap.previewOutputPath`, source
  PNG files, map assets, blog covers, or social images.
- Use exact-lossless WebP; no lossy quality setting is permitted.
- Preserve DOM order, class names, alt text, dimensions, aspect ratios, and
  desktop/mobile layout.
- Apply high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise
  naming. Every code behavior starts with a focused failing test.

---

### Task 1: Define the public preview path boundary

**Files:**
- Create: `src/assets/public-preview-source.ts`
- Create: `tests/assets/public-preview-source.test.ts`

**Interfaces:**
- Consumes: a locked relative `previewOutputPath` such as
  `maps/previews/Farm.png`
- Produces:
  `createPublicPreviewSource(previewOutputPath: string): string`

- [ ] **Step 1: Write path-mapping and invalid-input RED tests**

Use literal expectations:

```ts
expect(createPublicPreviewSource("maps/previews/Farm.png")).toBe(
  "/public-previews/1.6.15/maps/previews/Farm.webp",
);
expect(
  createPublicPreviewSource("mods/draylon.everfarm/preview.png"),
).toBe(
  "/public-previews/1.6.15/mods/draylon.everfarm/preview.webp",
);
```

Add separate cases rejecting an empty string, leading slash, trailing slash,
backslash, `..` path segment, and non-`.png` extension. Every expected error
must contain `JSON.stringify(receivedValue)`.

- [ ] **Step 2: Run RED**

```bash
pnpm exec vitest run tests/assets/public-preview-source.test.ts --no-file-parallelism
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the minimal pure mapper**

Use ordinary validation and one transformation:

```ts
const publicPreviewRoot = "/public-previews/1.6.15/";

export function createPublicPreviewSource(previewOutputPath: string): string {
  if (
    previewOutputPath.length === 0 ||
    previewOutputPath.startsWith("/") ||
    previewOutputPath.endsWith("/") ||
    previewOutputPath.includes("\\") ||
    previewOutputPath.split("/").includes("..") ||
    !previewOutputPath.endsWith(".png")
  ) {
    throw new Error(
      `Public preview output path must be a relative PNG path without traversal. Received: ${JSON.stringify(previewOutputPath)}.`,
    );
  }

  return `${publicPreviewRoot}${previewOutputPath.slice(0, -4)}.webp`;
}
```

Do not add a class, configuration object, or future format abstraction.

- [ ] **Step 4: Run GREEN**

```bash
pnpm exec vitest run tests/assets/public-preview-source.test.ts --no-file-parallelism
pnpm typecheck
```

Expected: exit `0`.

### Task 2: Generate and verify exactly 29 lossless derivatives

**Files:**
- Create: `scripts/generate-public-preview-webp.ts`
- Create: `scripts/verify-public-preview-webp.ts`
- Create: 29 files under `public/public-previews/1.6.15/`
- Create: `tests/assets/public-preview-images.test.ts`

**Interfaces:**
- Consumes: official 8 and community 21 map entries from `plannerMaps`
- Produces: exact source/derivative pairs and verified WebP files

- [ ] **Step 1: Write the 29-pair RED contract**

The test filters `plannerMaps` to the 8 `farm` entries named by
`officialFarmTypes` and all `community-farm`/`community-interior` entries. It
must assert literal totals `8`, `21`, and `29`, unique public paths, `.webp`
suffixes, and file existence. Before generation, the existence assertion must
fail for the missing derivatives.

- [ ] **Step 2: Run RED**

```bash
pnpm exec vitest run tests/assets/public-preview-images.test.ts --no-file-parallelism
```

Expected: FAIL naming the first missing public WebP path.

- [ ] **Step 3: Implement the generator as orchestration functions**

The script imports `plannerMaps`, `officialFarmTypes`, and the Task 1 path
mapper, then uses precise functions with one responsibility each:

```ts
function collectPublicPreviewOutputPaths(): readonly string[];
function resolveSourcePngPath(previewOutputPath: string): string;
function resolveDerivedWebpPath(previewOutputPath: string): string;
function encodeLosslessWebp(sourcePngPath: string, derivedWebpPath: string): void;
function generatePublicPreviewWebpFiles(): void;
```

`generatePublicPreviewWebpFiles` only coordinates collection, directory
creation, and encoding. `encodeLosslessWebp` uses `execFileSync("cwebp", [
"-lossless", "-exact", "-m", "6", source, "-o", output])`. Validate source
existence before the command and include both paths in failures. Reject
duplicate output paths before writing any file.

- [ ] **Step 4: Run the generator**

```bash
pnpm exec tsx scripts/generate-public-preview-webp.ts
```

Expected: 29 WebP files and a summary containing the exact pair count, source
total, derivative total, and saved bytes.

- [ ] **Step 5: Implement the independent verifier**

Follow the existing `scripts/verify-initial-planner-texture-webp.mjs` command
boundary, but keep the new TypeScript script responsible only for public
previews. It imports the same map registries and Task 1 mapper as the generator
instead of duplicating 29 paths. For each pair it must:

1. require source and derivative files;
2. run `webpinfo` and require lossless `VP8L`;
3. use `ffmpeg` to decode both files to RGBA;
4. compare width, height, and the SHA-256 of decoded RGBA bytes;
5. require derivative bytes to be lower than source bytes.

Fail immediately with both paths and received values. At the end require
exactly 29 verified pairs and derivative total below `4,096,433` bytes.

- [ ] **Step 6: Run GREEN and verification**

```bash
pnpm exec vitest run tests/assets/public-preview-source.test.ts tests/assets/public-preview-images.test.ts --no-file-parallelism
pnpm exec tsx scripts/verify-public-preview-webp.ts
```

Expected: both commands exit `0`; verifier reports 29 RGBA-identical files.

### Task 3: Connect only public-page consumers

**Files:**
- Modify: `src/reference/official-farm-guides.ts`
- Modify: `src/reference/mod-farm-cards.ts`
- Modify: `src/components/farm-comparison-content.tsx`
- Modify: `src/components/mod-map-card-grid.tsx`
- Modify: `tests/components/public-farm-pages.test.tsx`

**Interfaces:**
- Consumes: `createPublicPreviewSource(plannerMap.previewOutputPath)`
- Produces: public registry `previewSource` values and lazy/async card markup

- [ ] **Step 1: Write the public-consumer RED tests**

Update literal consumer expectations so all 8 official and 21 community card
sources start with `/public-previews/1.6.15/` and end with `.webp`. Assert every
farm-comparison and Mod card `<img>` contains both `loading="lazy"` and
`decoding="async"`. Keep the editor/map-picker tests expecting
`/game-assets/1.6.15/...png` unchanged.

- [ ] **Step 2: Run RED**

```bash
pnpm exec vitest run tests/components/public-farm-pages.test.tsx --no-file-parallelism
```

Expected: FAIL because registries still expose PNG paths and card markup lacks
async decoding.

- [ ] **Step 3: Implement the narrow registry connection**

In each registry, replace only preview-source construction:

```ts
previewSource: createPublicPreviewSource(plannerMap.previewOutputPath),
```

In both card components add only:

```tsx
decoding="async"
```

Do not change the farm-guide hero priority yet; that decision requires the
browser LCP observation in Task 4.

- [ ] **Step 4: Run GREEN and editor-path regression**

```bash
pnpm exec vitest run tests/components/public-farm-pages.test.tsx tests/components/editor-shell.test.tsx tests/maps/map-catalog.test.ts --no-file-parallelism
pnpm typecheck
git diff --check
```

Expected: exit `0`, with editor tests still asserting original PNG paths.

### Task 4: Production-page image acceptance

**Files:**
- Modify only if measured and retained:
  `src/components/farm-guide-content.tsx` and its focused test
- Update outside Git: SDD report and browser evidence

**Interfaces:**
- Consumes: production build and 29 verified WebPs
- Produces: page screenshots, Network evidence, and an evidence-gated hero
  priority decision

- [ ] **Step 1: Build and serve the static export**

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec serve out --listen tcp://127.0.0.1:4173
```

- [ ] **Step 2: Inspect desktop and 390x844 pages in Ego Browser**

Resume the existing agent-owned Ego task space `2` named
`stardew planner performance acceptance`. All browser operations must use
`ego-browser nodejs <<'EOF' ... EOF`; do not start or use Google Chrome. Load
`/farm/standard`, `/farm-comparison`, and `/mods`. Record durable screenshots,
`document.documentElement.scrollWidth <=
document.documentElement.clientWidth`, visible image rectangles, CLS, and
Network URLs. All visible previews must use WebP; page geometry and text must
remain unchanged. Scroll lazy-card pages through their full content before
auditing the complete preview-resource URL set. If Ego reports user control,
stop and request explicit continuation; do not seize control.

- [ ] **Step 3: Decide farm-guide fetch priority from the trace**

If the `/farm/standard` Performance trace identifies the hero preview as the
LCP resource, first add a failing static-markup assertion for
`fetchpriority="high"`, then add `fetchPriority="high"` to that image and
compare three cold samples before/after. Retain only if LCP does not regress.
If the hero is not the LCP resource, make no source or test change and record
that evidence.

Use the same Ego task space, viewport, cache-clear sequence, network settings,
and LCP observer for both three-sample sets. Keep Ego task space `2` open for
the later structured-data/final acceptance work; do not complete it here.

- [ ] **Step 4: Run final image checks**

```bash
pnpm exec tsx scripts/verify-public-preview-webp.ts
pnpm exec vitest run tests/assets/public-preview-source.test.ts tests/assets/public-preview-images.test.ts tests/components/public-farm-pages.test.tsx --no-file-parallelism
git diff --check
```

Expected: exit `0`. Do not commit.
