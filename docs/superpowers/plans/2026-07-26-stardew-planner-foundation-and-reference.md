# Stardew Planner Foundation and Reference Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a static, testable project root and a locked reference/asset foundation for the fixed Stardew Planner snapshot.

**Architecture:** The root Next.js application exports only static files. A typed asset-source manifest feeds a fail-fast synchronization command that creates a versioned local mirror; routes and parity states are documented in source-controlled reference manifests before planner behaviour is implemented.

**Tech Stack:** Next.js 16.2.12, React 19.2.8, TypeScript, Tailwind CSS 4.3.3, shadcn/ui primitives, PixiJS 8.19.0, Vitest 3.2.4, Playwright 1.62.0.

## Global Constraints

- Create every application file directly below `/Users/wusir/Desktop/开发项目集合/stardew planner/`; do not create a nested project root.
- Generate a static export only. Do not create `app/api`, server actions, databases, authentication, payment, sharing, feedback, or cloud-project code.
- Preserve the user-confirmed reference identity, copy, and assets, except for legal prose that must accurately describe the local-only product.
- Treat the reference snapshot date as `2026-07-26` and the initial asset pack as `1.6.15`.
- Do not commit or push. The user has not authorized commits.
- Every parser and import boundary must reject invalid values with a specific error; do not silently ignore invalid data.
- Keep modules high-cohesion and low-coupling. A module consumes another module only through its exported interface.
- Give every function one responsibility. Use exact domain names and never use generic identifiers such as `data`, `temp`, `helper`, `util`, or `manager`.
- Apply KISS and YAGNI: use the smallest readable implementation that fulfils the confirmed behaviour; do not introduce speculative abstraction layers.
- Fail fast at every API, file, and persistence boundary. An error must name the invalid value, and code must not silently swallow an unhandled error.

---

## File structure created by this plan

| Path | Responsibility |
| --- | --- |
| `package.json` | Root scripts and pinned production/development dependencies. |
| `next.config.ts` | Static-export-only Next.js configuration. |
| `app/layout.tsx` | Global metadata and root document structure. |
| `app/page.tsx` | Main planner route placeholder that establishes the public shell contract. |
| `app/farm-comparison/page.tsx` | Static farm-comparison route placeholder. |
| `app/farm/[type]/page.tsx` | Static farm-guide route contract. |
| `app/mods/page.tsx` | Static Mod-route placeholder. |
| `app/privacy/page.tsx` and `app/terms/page.tsx` | Local-only legal-page contracts. |
| `app/globals.css` | Global reset and reference colour tokens. |
| `src/assets/source-asset.ts` | Source manifest types and strict validation. |
| `src/assets/source-manifest.ts` | Versioned authorized source entries. |
| `src/assets/sync-assets.ts` | Download, validate, hash-lock, and atomically publish source assets. |
| `src/reference/route-state.ts` | Typed public-route and visual-state inventory. |
| `src/reference/route-state-manifest.ts` | Fixed snapshot route/state entries. |
| `docs/reference/route-state-matrix.md` | Human-readable product acceptance matrix. |
| `tests/assets/source-asset.test.ts` | Asset manifest and response-validation tests. |
| `tests/reference/route-state.test.ts` | Route/state manifest tests. |
| `tests/routes/static-routes.test.ts` | Static route and removed-flow tests. |

### Task 1: Establish the static project root

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `tests/routes/static-routes.test.ts`

**Interfaces:**
- Produces: `pnpm dev`, `pnpm build`, `pnpm test`, and `pnpm typecheck` commands.
- Produces: a static-export configuration. The first build-output assertion belongs to Task 5 because that task creates the first route.

- [x] **Step 1: Write the failing static-output test**

```ts
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("static application contract", () => {
  it("exports static files without image optimization", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.images?.unoptimized).toBe(true);
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/routes/static-routes.test.ts`

Expected: FAIL because `next.config.ts` does not exist.

- [x] **Step 3: Create the root configuration**

Create `next.config.ts` with this complete contract:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
```

Create `package.json` scripts with exactly `dev`, `build`, `start`, `test`, `typecheck`, and `assets:sync`; `start` must run `npx serve out`, and `assets:sync` must run `tsx src/assets/sync-assets.ts`. Add `engines.node` with the exact value `>=20.9.0` and add `serve` version `14.2.6` to `devDependencies` so `npx serve out` resolves to a lockfile-pinned local binary.

Create `app/layout.tsx` with a root `<html lang="en">`, the title `Stardew Valley Farm Planner`, and `app/globals.css` imported once.

- [x] **Step 4: Run static checks**

Run: `pnpm test --run tests/routes/static-routes.test.ts && pnpm typecheck`

Expected: PASS with no TypeScript diagnostics.

### Task 2: Define the public route and removed-feature contract

**Files:**
- Create: `src/reference/route-state.ts`
- Create: `src/reference/route-state-manifest.ts`
- Create: `docs/reference/route-state-matrix.md`
- Create: `tests/reference/route-state.test.ts`

**Interfaces:**
- Produces: `ReferenceRoute`, `ReferenceState`, and `referenceRoutes` for route generation and future visual tests.
- Consumes: no planner implementation.

- [x] **Step 1: Write the failing route-manifest test**

```ts
import { describe, expect, it } from "vitest";
import { referenceRoutes } from "../../src/reference/route-state-manifest";

describe("reference route manifest", () => {
  it("includes every fixed public route family", () => {
    expect(referenceRoutes.map((route) => route.id)).toEqual(
      expect.arrayContaining([
        "planner",
        "farm-comparison",
        "farm-guide",
        "mods",
        "privacy",
        "terms",
      ]),
    );
  });

  it("does not expose account, premium, or sharing routes", () => {
    for (const route of referenceRoutes) {
      expect(route.path).not.toMatch(/sign-in|account|premium|plan\\//);
    }
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/reference/route-state.test.ts`

Expected: FAIL because the reference modules do not exist.

- [x] **Step 3: Implement the typed route/state manifest**

Define `ReferenceRoute` with `id`, `path`, `viewport`, `states`, and `acceptancePurpose`. Define `ReferenceState` with `id`, `action`, `expectedVisibleResult`, `viewport`, `toolMode`, `selectedEntity`, and `modalState`. Each state represents exactly one desktop or mobile acceptance scenario; static content states use `null` for tool, selected entity, and modal values.

Populate the manifest with exactly `/`, `/farm-comparison`, `/farm/[type]`, `/mods`, `/privacy`, and `/terms`. For both desktop and mobile, document planner idle, map picker, catalog, browser-local Projects (create, open, rename, duplicate, delete, and save to the current browser), farm-plan JSON import and export, game-save import, 1x and HQ PNG export, farm summary and CSV export, placement validation, cursor placement, fill, eraser, marquee selection, selection edit/move/duplicate, undo, redo, map switching, season switching, and every confirmed overlay (grid, buildable, crop, tree, NPC path, night mode, sprinkler, scarecrow, bee house, Junimo hut, and resource clumps). The unavailable Weather control must be explicitly documented as unavailable. Do not add any login, sign-in, social auth, account, membership, premium, payment, Ko-fi, cloud, sync, share, public-plan, or feedback route, state, label, action, or expected result.

Write `docs/reference/route-state-matrix.md` as the human-readable rendering of those exact entries. Tests must assert the exact public route IDs, required planner-state IDs, a viewport/tool/selected-entity/modal value for every state, and the absence of removed online-flow terms across all route and state fields. Read the matrix in the test and verify it contains exactly the manifest route and state IDs, so the written acceptance matrix cannot silently drift.

- [x] **Step 4: Run the manifest tests**

Run: `pnpm vitest run tests/reference/route-state.test.ts`

Expected: PASS.

### Task 3: Create fail-fast asset-source contracts

**Files:**
- Create: `src/assets/source-asset.ts`
- Create: `src/assets/source-manifest.ts`
- Create: `tests/assets/source-asset.test.ts`

**Interfaces:**
- Produces: `SourceAsset`, `validateSourceAsset`, and `sourceAssets`.
- Consumes: an explicit authorized source URL and an expected local path.
- Produces: only relative output paths below `public/game-assets/1.6.15/`.

- [x] **Step 1: Write the failing manifest-validation test**

```ts
import { describe, expect, it } from "vitest";
import { validateSourceAsset } from "../../src/assets/source-asset";

describe("validateSourceAsset", () => {
  it("accepts an HTTPS source and a safe versioned output path", () => {
    expect(() => validateSourceAsset({
      sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      outputPath: "maps/Farm.tmx",
      mediaType: "application/xml",
    })).not.toThrow();
  });

  it("rejects paths that escape the versioned asset directory", () => {
    expect(() => validateSourceAsset({
      sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      outputPath: "../Farm.tmx",
      mediaType: "application/xml",
    })).toThrow("outputPath must be a relative path without traversal: ../Farm.tmx");
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/assets/source-asset.test.ts`

Expected: FAIL because `validateSourceAsset` is unavailable.

- [x] **Step 3: Implement source validation and the first manifest entries**

Create this type:

```ts
export type SourceAsset = {
  sourceUrl: string;
  outputPath: string;
  mediaType: "application/json" | "application/xml" | "image/png";
};
```

`validateSourceAsset` must reject a non-HTTPS URL, an origin other than the authorized asset origin, a source pathname outside the exact `/assets/1.6.15/` prefix, any raw query or fragment delimiter (including an empty `?` or `#`), percent-encoded slash/backslash or dot-segment path tricks, an output path beginning with `/`, an empty output path, a Windows drive-prefixed path, a NUL character, path traversal, and a media type outside the union. Each thrown error must contain the invalid value.

Seed `sourceAssets` with the verified reference resources for `maps/Farm.tmx`, `data/Crops.json`, and their output media types. Every additional reference resource is appended to this manifest rather than hard-coded into feature modules.

- [x] **Step 4: Run the validation tests**

Run: `pnpm vitest run tests/assets/source-asset.test.ts`

Expected: PASS.

### Task 4: Implement deterministic asset synchronization

**Files:**
- Create: `src/assets/sync-assets.ts`
- Create: `src/assets/asset-lock.ts`
- Modify: `tests/assets/source-asset.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `SourceAsset[]` and a `fetch` implementation.
- Produces: `public/game-assets/1.6.15/<outputPath>` and `public/game-assets/1.6.15/asset-lock.json`.
- Produces: `synchronizeAssets(assets, fetchImplementation, targetDirectory): Promise<void>`.
- Uses: the user-approved, exact dev dependency `@xmldom/xmldom@0.9.10` for strict TMX/XML parsing during the build-time synchronization command only; no XML parser enters browser runtime code.

- [x] **Step 1: Write the failing synchronization test**

```ts
it("writes a hash-locked asset only after the response validates", async () => {
  const targetDirectory = await createTemporaryDirectory();
  await synchronizeAssets(
    [{
      sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
      outputPath: "data/Crops.json",
      mediaType: "application/json",
    }],
    async () => new Response('{"24":{"Name":"Parsnip"}}', {
      headers: { "content-type": "application/json" },
    }),
    targetDirectory,
  );
  await expect(readFile(join(targetDirectory, "data/Crops.json"), "utf8"))
    .resolves.toContain("Parsnip");
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/assets/source-asset.test.ts`

Expected: FAIL because `synchronizeAssets` is unavailable.

- [x] **Step 3: Implement deterministic synchronization**

Install the approved parser with `pnpm add -D @xmldom/xmldom@0.9.10`. For each validated asset, require both `response.ok === true` and an integer `2xx` response status, verify the final response URL still has the authorized origin and exact `/assets/1.6.15/` prefix with no query or fragment, compare `content-type` with `mediaType` ignoring parameters, read the bytes once, parse JSON or XML before writing, calculate SHA-256, and write `{ sourceUrl, outputPath, mediaType, sha256 }` to the lock file. XML parsing must use the parser's error callbacks to throw on a parse error; do not treat a regex or a warning-only result as valid XML.

Reject an empty candidate list, a candidate output path that equals or nests below `asset-lock.json`, duplicate paths, and any ancestor/descendant output-path pair before the first request or staging write. If a published `asset-lock.json` already exists, its entry for the same `outputPath` must have the same SHA-256, and every published output path must remain in the candidate list; otherwise throw an error naming the path and both hashes or the missing path and leave the published mirror untouched. The existing lock parser must reject the same output-path collisions. Updating the reference snapshot is an explicit future operation, not an implicit `assets:sync` side effect.

Write every file into a unique temporary sibling directory. Reject a target path with a symbolic-link target or symbolic-link ancestor before creating staging output. Replace the prior version directory only after every asset has passed validation. If any asset fails, delete only that temporary directory and retain the existing published directory unchanged. The `assets:sync` script itself must be executable by the project’s module mode and importing its module must never initiate a network request.

- [x] **Step 4: Run synchronization tests**

Run: `pnpm vitest run tests/assets/source-asset.test.ts`

Expected: PASS, including invalid JSON, invalid UTF-8, XML warning/error/root, PNG, content type, inconsistent `ok`/HTTP-status, redirect-final-URL, existing-lock hash-mismatch/missing-output/bad-lock failure cases, symbolic-link ancestor and target failures, output-path collisions, atomic old-target preservation, direct CLI-module import without network, and replace-failure restoration.

### Task 5: Publish the complete static route shell

**Files:**
- Create: `app/page.tsx`
- Create: `app/farm-comparison/page.tsx`
- Create: `app/farm/[type]/page.tsx`
- Create: `app/mods/page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Create: `src/reference/public-navigation.ts`
- Modify: `tests/routes/static-routes.test.ts`

**Interfaces:**
- Consumes: `referenceRoutes`.
- Produces: static pages for every public route family.
- Produces: `publicNavigation` with only public, non-account destinations.

- [x] **Step 1: Write the failing public-navigation test**

```ts
import { publicNavigation } from "../../src/reference/public-navigation";

it("links only to public local routes", () => {
  expect(publicNavigation.map((item) => item.href)).toEqual([
    "/",
    "/farm-comparison",
    "/mods",
    "/privacy",
    "/terms",
  ]);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/routes/static-routes.test.ts`

Expected: FAIL because `publicNavigation` is unavailable.

- [x] **Step 3: Implement static pages with the fixed public shell**

Create one focused page component per route. Each page must use the original public heading/copy contract from the reference matrix, render the shared navigation, and contain no account, premium, cloud, feedback, or share control.

`app/farm/[type]/page.tsx` must use `generateStaticParams` from a typed farm-id list so the static export never depends on a request-time route.

Privacy and terms pages must retain their reference structure while stating that projects are browser-local and that the product has no accounts, cloud synchronization, memberships, or payments.

- [x] **Step 4: Verify routes and exported output**

Run: `pnpm test --run tests/routes/static-routes.test.ts && pnpm build`

Expected: PASS; `out/index.html`, `out/farm-comparison/index.html`, `out/mods/index.html`, `out/privacy/index.html`, and `out/terms/index.html` exist.

### Task 6: Establish reproducible visual-reference capture

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/public-route.spec.ts`
- Create: `tests/e2e/reference-state.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: local static route shell and `referenceRoutes`.
- Produces: desktop and mobile screenshots in `test-results/` for each documented state.

- [ ] **Step 1: Write the failing desktop-route smoke test**

```ts
import { expect, test } from "@playwright/test";

test("planner shell is visible on the desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stardew Valley Farm Planner" })).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm playwright test tests/e2e/public-route.spec.ts`

Expected: FAIL until the local static server and planner heading exist.

- [ ] **Step 3: Add desktop/mobile reference capture cases**

Configure Playwright projects named `desktop` at `1440x900` and `mobile` at `390x844`. Add one capture case for each static page and one planner idle-state capture per project. Each screenshot filename must include the route id and viewport id.

Do not create a snapshot for a sign-in, membership, cloud project, or share state because those flows are deliberately absent.

- [ ] **Step 4: Run the complete foundation gate**

Run: `pnpm typecheck && pnpm test --run && pnpm build && pnpm playwright test`

Expected: all commands pass and the static output plus desktop/mobile reference captures are generated.

## Plan self-review

- Spec coverage: this plan creates the static root, public-route contract, reference-state baseline, asset mirror contract, and first static public pages. Planner rendering, local projects, game-save import, Mod map execution, and final visual parity are deliberately isolated into subsequent implementation plans because each is independently reviewable and testable.
- Placeholder scan: no task contains an unspecified implementation action; every task names files, interfaces, test commands, and pass criteria.
- Type consistency: `SourceAsset`, `validateSourceAsset`, `synchronizeAssets`, `ReferenceRoute`, `ReferenceState`, `referenceRoutes`, and `publicNavigation` are defined before later tasks consume them.
