# Reference Runtime Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the authorised, locked StardewPlan reference runtime from the existing static Next.js project, with original layout, maps, sprites, and editor behaviour while all project data stays in the browser and all account/cloud/share/support features are absent.

**Architecture:** A snapshot synchronizer mirrors and locks the deployed SvelteKit runtime and reference assets at build time. A small React host mounts that frozen client at the existing static routes. A browser-local API adapter replaces only the original project's REST surface; the frozen map/Pixi renderer remains responsible for exact map presentation and interaction.

**Tech Stack:** Next.js 16 static export, React 19 host, TypeScript 5.9, Vitest 3, locked SvelteKit/Pixi browser runtime, browser localStorage.

## Global Constraints

- Keep the application rooted at `/Users/wusir/Desktop/开发项目集合/stardew planner/` and keep `output: "export"`; add no API route, Server Action, database, authentication provider, payment integration, or cloud service.
- Use the public reference snapshot locked on 2026-07-27 and version `1.6.15`; release visitors must make zero requests to `stardewplan.com` or `assets.stardewplan.com`.
- Preserve local project creation, rename, delete, map save/open/duplicate/copy/move, JSON import/export, PNG export, CSV summary, and game-save import.
- Render no Sign in, Sign out, Support, Ko-fi, Feedback, membership, premium, cloud sync, save-link, share-link, public-plan, or social controls.
- Keep functions single-purpose, boundary input validation fail-fast, and variable names precise. Do not introduce generic `data`, `temp`, `helper`, `util`, or `manager` names.
- Follow TDD: every production function is introduced after a focused failing test and verified green before the next change.
- Verify desktop at 1440x1024 and 1280x800, and mobile at 390x844 against the frozen reference.

---

### Task 1: Lock the deployed browser runtime and UI assets (completed 2026-07-27)

**Files:**
- Create: `src/reference-runtime/reference-runtime-snapshot.ts`
- Create: `src/reference-runtime/reference-runtime-source-asset.ts`
- Create: `src/reference-runtime/sync-reference-runtime.ts`
- Create: `tests/reference-runtime/reference-runtime-snapshot.test.ts`
- Modify: `package.json`
- Generate: `public/_app/immutable/**`
- Generate: `public/assets/**`
- Generate: `public/reference-runtime/reference-runtime-lock.json`

**Interfaces:**
- Consumes: fixed source entry URL `https://stardewplan.com/_app/immutable/entry/app.DTzIUNnu.js`, source module text, existing `public/game-assets/1.6.15/asset-lock.json`.
- Produces: `collectReferenceRuntimeSourceAssets(entryModule: ReferenceRuntimeSourceAsset): Promise<readonly ReferenceRuntimeSourceAsset[]>` and a lock containing source URL, public output path, media type, and SHA-256 for every copied runtime, UI, map, and tilesheet asset.

- [ ] **Step 1: Write failing source-discovery tests.**

```ts
it("discovers only immutable JavaScript and CSS imports below the fixed source roots", () => {
  expect(
    collectReferenceRuntimeModulePaths(
      "import '../chunks/runtime.js'; import '../assets/page.css';",
      "_app/immutable/entry/app.DTzIUNnu.js",
    ),
  ).toEqual([
    "_app/immutable/chunks/runtime.js",
    "_app/immutable/assets/page.css",
  ]);
});

it("rejects a module import that escapes the immutable runtime directory", () => {
  expect(() => collectReferenceRuntimeModulePaths("import '../../secret.js';", "_app/immutable/entry/app.js")).toThrow(
    'Reference runtime module path must stay below "_app/immutable/". Received import path: "../../secret.js".',
  );
});
```

- [ ] **Step 2: Run the focused test and confirm it fails because the reference-runtime module does not exist.**

Run: `pnpm test --run tests/reference-runtime/reference-runtime-snapshot.test.ts`

Expected: FAIL with module-not-found for `src/reference-runtime/reference-runtime-snapshot.ts`.

- [ ] **Step 3: Implement the narrow source-asset validator and recursive snapshot collector.**

Use separate `ReferenceRuntimeSourceAsset` types rather than weakening the existing game-asset-only `SourceAsset` validator. Accept exactly the two public origins and allowed path roots from the design. Resolve imports with `new URL(importPath, sourceUrl)`, validate before queuing, deduplicate canonical output paths, and throw exact errors for rejected URLs. Patch the unique production string `Cm=typeof window<"u"&&window.location.hostname==="127.0.0.1"` to `Cm=!0`; throw when the string occurs other than once. Copy the existing locked game assets under `public/assets/` only after validating each copied byte against `public/game-assets/1.6.15/asset-lock.json`. Download and lock fifteen observed visual resources: favicon, two PWA icons, four cursor PNGs, five icon/frame PNGs, `tabs/100_anim_f.png`, `img/Junimo.png`, and `img/mychar.png`.

- [ ] **Step 4: Add the deterministic synchronizer command and run it.**

Add `"reference:sync": "tsx src/reference-runtime/sync-reference-runtime.ts"` to `package.json`. The command must stage to a sibling temporary directory, validate all media types and SHA-256 values, then atomically publish `public/_app`, `public/assets`, and `public/reference-runtime/reference-runtime-lock.json`. Run `pnpm reference:sync` once; the generated lock must contain no query strings, source URL outside the two allowed origins, or duplicate output paths.

- [ ] **Step 5: Run the focused tests and asset assertions.**

Run: `pnpm test --run tests/reference-runtime/reference-runtime-snapshot.test.ts tests/assets/rendering-source-manifest.test.ts tests/assets/rendering-runtime-manifest.test.ts`

Expected: PASS; existing game asset counts remain 337 and the new snapshot lock contains every discovered runtime module.

### Task 2: Mount the frozen client at all retained static routes (completed 2026-07-27)

**Files:**
- Create: `src/components/reference-runtime-host.tsx`
- Create: `public/reference-runtime/bootstrap.mjs`
- Modify: `app/page.tsx`
- Modify: `app/farm-comparison/page.tsx`
- Modify: `app/farm/[type]/page.tsx`
- Modify: `app/mods/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `tests/components/reference-runtime-host.test.tsx`
- Modify: `tests/routes/static-routes.test.ts`

**Interfaces:**
- Consumes: `/reference-runtime/bootstrap.mjs`, the mirrored `/_app/immutable/entry/start.CLoByjli.js` and `app.DTzIUNnu.js`, and the actual browser route pathname.
- Produces: `ReferenceRuntimeHost` that renders one `#reference-runtime-root` element and starts the frozen client exactly once after React hydration.

- [ ] **Step 1: Write failing host and route tests.**

```tsx
it("renders a single stable mount for the frozen reference client", () => {
  render(<ReferenceRuntimeHost />);
  expect(document.querySelectorAll("#reference-runtime-root")).toHaveLength(1);
  expect(document.querySelector("script[src='/reference-runtime/bootstrap.mjs']")).not.toBeNull();
});

it("keeps every retained route static while removing the legacy React planner shell", async () => {
  expect(await renderRoute("/")).toContain("reference-runtime-root");
  expect(await renderRoute("/farm-comparison")).toContain("reference-runtime-root");
  expect(await renderRoute("/mods")).toContain("reference-runtime-root");
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail because the host and bootstrap do not exist.**

Run: `pnpm test --run tests/components/reference-runtime-host.test.tsx tests/routes/static-routes.test.ts`

Expected: FAIL with missing `ReferenceRuntimeHost`.

- [ ] **Step 3: Implement the route host and bootstrap.**

`ReferenceRuntimeHost` must not render a second application shell, iframe, Next navigation control, or map placeholder. Its bootstrap module must import the two locked entry modules and call the SvelteKit start function with `document.getElementById("reference-runtime-root")`. It must throw if the root is absent or already initialised. Replace each retained route body with the host while preserving `generateStaticParams` for the eight farm pages. Set only full-viewport baseline CSS in the Next root; let the mirrored reference stylesheet control planner layout.

- [ ] **Step 4: Run focused tests and a static build.**

Run: `pnpm test --run tests/components/reference-runtime-host.test.tsx tests/routes/static-routes.test.ts && pnpm build`

Expected: PASS and `out/` contains the retained public routes plus `_app/immutable` and `reference-runtime` files.

### Task 3: Replace cloud project requests with a validated browser-local adapter (completed 2026-07-27)

**Files:**
- Create: `src/reference-runtime/local-project-api.ts`
- Create: `public/reference-runtime/local-project-api.mjs`
- Create: `tests/reference-runtime/local-project-api.test.ts`
- Modify: `public/reference-runtime/bootstrap.mjs`

**Interfaces:**
- Consumes: `Request`-equivalent method, pathname, JSON body, and the versioned local key `stardewplan-reference-local-projects-v1`.
- Produces: `handleReferenceProjectRequest(request: ReferenceApiRequest, storedProjectDocument: unknown): ReferenceApiResponse` and browser `fetch` interception for the declared local project endpoints.

- [ ] **Step 1: Write failing API behaviour tests.**

```ts
it("creates a local project without changing an existing project", () => {
  const response = handleReferenceProjectRequest(
    createReferenceRequest("POST", "/api/projects", { projectName: "Spring Farm", season: "spring" }),
    createEmptyReferenceProjectDocument(),
  );

  expect(response.status).toBe(200);
  expect(response.projectDocument.projects).toHaveLength(1);
  expect(response.projectDocument.projects[0].title).toBe("Spring Farm");
});

it("rejects a map write whose state is not an object and preserves stored projects", () => {
  const documentBeforeRequest = createReferenceProjectDocumentWithMap();
  expect(() => handleReferenceProjectRequest(
    createReferenceRequest("PUT", "/api/projects/project-1/maps/map-1", { state: "invalid" }),
    documentBeforeRequest,
  )).toThrow('Project map state must be a non-null object. Received: "invalid".');
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail because the local API module does not exist.**

Run: `pnpm test --run tests/reference-runtime/local-project-api.test.ts`

Expected: FAIL with module-not-found for `src/reference-runtime/local-project-api.ts`.

- [ ] **Step 3: Implement the pure local project endpoint dispatcher.**

Implement only `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`, `POST /api/projects/:id/maps`, `PATCH/PUT/DELETE /api/projects/:id/maps/:mapId`, `POST/GET /api/projects/:id/maps/:mapId/thumbnail`, and map `duplicate`, `copy`, and `move`. Validate every ID, title, map file, season, label, state, decor, renovations, and thumbnail boundary before mutation. Store a received `image/webp` thumbnail as a data URL and return it with media type `image/webp`; reject any other thumbnail content type. Clone the stored document before an accepted mutation and return the untouched document on every error. Generate stable local IDs with `crypto.randomUUID()` and return the exact response shapes consumed by the frozen client: `{ projectId }`, `{ mapId }`, `{ projects }`, a full project with `maps`, and `{ projectTitle }` for copy/move.

- [ ] **Step 4: Implement the browser adapter and deny excluded APIs.**

Install the adapter before SvelteKit starts. Read/parse/write the versioned localStorage document only through focused functions. Return a local session and `{ isPremium: true, premiumUntil: null }` only to unlock the existing project panel; do not render account UI. Return JSON 404 errors for `/api/plans`, `/api/feedback`, `/api/account`, `/api/auth/sign-in`, and `/api/admin`; pass non-API requests to the original `fetch` unchanged. The adapter must never call `fetch` for an `/api/` request it recognises.

- [ ] **Step 5: Run focused tests.**

Run: `pnpm test --run tests/reference-runtime/local-project-api.test.ts tests/projects/local-project-store.test.ts tests/projects/local-project-editor-actions.test.ts`

Expected: PASS; invalid input tests prove no partial localStorage mutation.

### Task 4: Remove excluded UI and lock the visual shell (completed 2026-07-27)

**Files:**
- Create: `public/reference-runtime/local-only-overrides.css`
- Modify: `public/reference-runtime/bootstrap.mjs`
- Create: `tests/reference-runtime/local-only-overrides.test.ts`
- Create: `tests/reference-runtime/reference-runtime-visual-contract.test.ts`

**Interfaces:**
- Consumes: frozen runtime DOM class names and control labels from the locked `CUwsdp_r.js` plus the local-only product exclusions.
- Produces: a stylesheet loaded before the planner mount that removes excluded controls from layout and retains the original map, catalog, toolbar, Map/View/Save/Settings controls, and local project controls.

- [ ] **Step 1: Write failing source and DOM-contract tests.**

```ts
it("contains no visible selector that leaves account, support, feedback, or share controls in the local shell", () => {
  const overrideCss = readReferenceRuntimeOverrideCss();
  expect(overrideCss).toContain('[title="Support"] { display: none !important; }');
  expect(overrideCss).toContain('.help-bubble-menu { display: none !important; }');
  expect(overrideCss).toContain('[title="Save your plan and get a shareable link"] { display: none !important; }');
});

it("keeps the exact reference compact-breakpoint and catalog dimensions", () => {
  const referenceCss = readMirroredReferencePlannerCss();
  expect(referenceCss).toContain('@media (max-width: 1400px)');
  expect(referenceCss).toContain('@media (max-width: 640px)');
  expect(referenceCss).toContain('width:340px');
});
```

- [ ] **Step 2: Run focused tests and confirm they fail because the override stylesheet and visual-contract module do not exist.**

Run: `pnpm test --run tests/reference-runtime/local-only-overrides.test.ts tests/reference-runtime/reference-runtime-visual-contract.test.ts`

Expected: FAIL with missing reference runtime override files.

- [ ] **Step 3: Add version-locked local-only overrides.**

Use concrete selectors from the frozen runtime for the Support buttons, Feedback buttons, Ko-fi panel, sign-in/out/account controls, premium tier labels, link-save row, share dialog, and social/contact links. Every selector uses `display: none !important` so it removes layout space. The override must not hide `Save Project`, `Manage Projects`, map copy/move controls, screenshots, farm summary, game-save import, Map, View, Settings, catalog tabs, or Help. Replace only the visible account-dependent wording with local-project wording where it shares a retained panel.

- [ ] **Step 4: Run focused tests and inspect the transformed client source.**

Run: `pnpm test --run tests/reference-runtime/local-only-overrides.test.ts tests/reference-runtime/reference-runtime-visual-contract.test.ts`

Expected: PASS; the mirrored renderer remains version-locked and the override file contains no remote URL.

### Task 5: Verify offline parity and static delivery (completed 2026-07-27)

**Files:**
- Modify: `tests/routes/static-routes.test.ts` only if the production scan exposes a missing route or forbidden remote URL assertion.
- Create: `tests/reference-runtime/reference-runtime-delivery.test.ts`

**Interfaces:**
- Consumes: static `out/` export, reference lock, browser-local API adapter, and the three approved viewport states.
- Produces: evidence that the release makes no reference-site network request and renders the frozen reference app at desktop and mobile dimensions.

- [ ] **Step 1: Write failing static-delivery assertions.**

```ts
it("ships the frozen entries and never leaves the source asset domains in emitted executable or HTML files", async () => {
  const releaseText = await readStaticDeliveryTextExcludingAssetLock();
  expect(releaseText).not.toContain("https://stardewplan.com");
  expect(releaseText).not.toContain("https://assets.stardewplan.com");
  expect(releaseText).toContain("/reference-runtime/bootstrap.mjs");
});
```

- [ ] **Step 2: Run the delivery test and confirm it fails before the final export wiring exists.**

Run: `pnpm test --run tests/reference-runtime/reference-runtime-delivery.test.ts`

Expected: FAIL because the static export does not yet include the frozen runtime host and lock.

- [ ] **Step 3: Run end-to-end verification against the production export.**

Run serially:

```bash
pnpm test --run
pnpm typecheck
pnpm build
pnpm test --run tests/reference-runtime/reference-runtime-delivery.test.ts
```

Then serve `out/` and use the local browser at 1440x1024, 1280x800, and 390x844. Verify the catalogue geometry, toolbar/menu breakpoints, map picker cards, Standard Farm map/season rendering, one building placement, one crop placement, undo/redo, a local project create-save-open cycle, map duplicate/copy/move, JSON export/import, screenshot export, CSV summary export, and absence of every excluded control.

- [ ] **Step 4: Re-run the full test/typecheck/build gate after browser verification.**

Run: `pnpm test --run && pnpm typecheck && pnpm build`

Expected: all unit tests pass, TypeScript has no errors, and the static export completes without a remote API/runtime dependency.

**Completion evidence:** `pnpm build` completed successfully. After the build, `pnpm typecheck` completed successfully and `pnpm test --run` passed 73 files / 577 tests. The production export audit found one runtime root and one local bootstrap module in each retained public route (the four static information pages and eight farm pages), no iframe, no legacy React body, and 46/46 immutable runtime hashes identical across the lock, `public/`, and `out/`. Browser checks confirmed the frozen desktop and 390px mobile editor shell, map canvas, catalog and local-only control removal; the static response contains no external reference-site executable or HTML dependency.

## Self-review

- Scope coverage: the plan replaces the incorrect visual/map rendering baseline with the frozen reference implementation, preserves local project workflows through a browser-only adapter, and explicitly removes every excluded visible feature.
- Placeholder scan: all task files, commands, endpoints, root URLs, and acceptance dimensions are concrete.
- Type consistency: the snapshot collector produces the public paths consumed by the host; the adapter consumes only `/api/projects` contracts and is installed before the frozen client; the override stylesheet applies after the frozen reference stylesheet but before first interaction.
