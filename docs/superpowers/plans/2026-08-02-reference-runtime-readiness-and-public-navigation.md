# Reference Runtime Readiness and Public Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to implement this plan task by
> task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the frozen Pixi renderer-initialization race and prevent the
embedded SvelteKit router from intercepting Next.js public-page links.

**Architecture:** Apply a deterministic, fail-fast source transformation to
the one locked planner chunk before staged writes and SHA-256 calculation.
Install one focused capture-phase public-link boundary before frozen SvelteKit
startup so ordinary same-origin links outside the runtime use native document
navigation.

**Tech Stack:** TypeScript 5.9, browser ES modules, Vitest 3, Next.js 16 static
export, frozen Svelte/Pixi runtime.

## Global Constraints

- Preserve every unrelated existing and uncommitted workspace change.
- Do not create commits, stage files, switch branches, install dependencies,
  deploy, or modify Hermes source.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast,
  YAGNI, and precise naming.
- Unknown boundary states must throw errors containing the received path,
  value, or occurrence count; do not catch unknown errors or fail silently.
- Write each behavior test first, run it, and record the expected RED output
  before writing the corresponding production behavior.
- Do not modify React homepage links, route registries, public-page components,
  project data, UI styling, SEO, or deployment configuration.
- Keep the existing uncommitted wheel-zoom behavior and its bootstrap ordering
  unchanged: frozen start resolves before wheel-zoom installation.
- Because commits are forbidden and the checkout is already dirty, the
  controller snapshots each task's owned files before dispatch and gives the
  reviewer a no-index before/after diff containing only those files.

---

## File Responsibility Map

- `src/reference-runtime/sync-reference-runtime.ts`: exact renderer-readiness
  transformation and synchronizer integration.
- `tests/reference-runtime/sync-reference-runtime.test.ts`: pure
  transformation behavior and failure boundaries.
- `public/_app/immutable/chunks/CUwsdp_r.js`: transformed frozen runtime bytes.
- `public/reference-runtime/reference-runtime-lock.json`: SHA-256 for the
  transformed frozen chunk.
- `public/reference-runtime/public-link-navigation-guard.mjs`: public-link
  classification and capture-phase propagation boundary.
- `tests/reference-runtime/public-link-navigation-guard.test.ts`: real guard
  behavior through focused fake DOM/event boundaries.
- `public/reference-runtime/bootstrap.mjs`: install the navigation guard before
  frozen startup while preserving wheel-zoom ordering.
- `tests/reference-runtime/reference-runtime-delivery.test.ts`: built delivery,
  lock, startup ordering, and release-domain contracts.

### Task 1: Deterministic renderer-readiness transformation

**Files:**

- Modify: `src/reference-runtime/sync-reference-runtime.ts`
- Modify: `tests/reference-runtime/sync-reference-runtime.test.ts`
- Modify: `public/_app/immutable/chunks/CUwsdp_r.js`
- Modify: `public/reference-runtime/reference-runtime-lock.json`
- Modify: `tests/reference-runtime/reference-runtime-delivery.test.ts`

**Interfaces:**

- Produces:

```ts
export function transformPlannerRendererReadinessGuard(
  sourcePublicOutputPath: string,
  sourceText: string,
): string;
```

- Target path:

```ts
"_app/immutable/chunks/CUwsdp_r.js"
```

- Accepted source states:

```ts
const applicationOnlyGuard = "async function uc(x,D){if(!ve)return;";
const rendererReadyGuard = "async function uc(x,D){if(!ve?.renderer)return;";
```

- Non-target paths return their input unchanged.
- The target accepts `(applicationOnlyCount, rendererReadyCount)` of `(1, 0)`
  and transforms it, or `(0, 1)` and returns it unchanged. Every other pair
  throws with the path and both counts.

- [ ] **Step 1: Add the complete pure-transformation behavior tests without a static missing-export error**

Import the synchronizer as a namespace and resolve the future function through
a narrow optional type so Vitest records an assertion failure rather than
failing module loading:

```ts
import * as referenceRuntimeSynchronizer from "../../src/reference-runtime/sync-reference-runtime";

type RendererReadinessTransformer = (
  sourcePublicOutputPath: string,
  sourceText: string,
) => string;

const transformPlannerRendererReadinessGuard = (
  referenceRuntimeSynchronizer as {
    transformPlannerRendererReadinessGuard?: RendererReadinessTransformer;
  }
).transformPlannerRendererReadinessGuard;

it("replaces the premature application-only guard in the frozen planner chunk", () => {
  expect(transformPlannerRendererReadinessGuard).toBeTypeOf("function");

  if (transformPlannerRendererReadinessGuard === undefined) {
    return;
  }

  expect(
    transformPlannerRendererReadinessGuard(
      "_app/immutable/chunks/CUwsdp_r.js",
      "before async function uc(x,D){if(!ve)return; after",
    ),
  ).toBe("before async function uc(x,D){if(!ve?.renderer)return; after");
});
```

In the same RED change, add the literal non-target and already-transformed
cases plus separate failure cases for `(0, 0)`, `(2, 0)`, `(0, 2)`, and
`(1, 1)`. Each failure expectation must contain the target path and the
literal old/new occurrence counts. All behavior tests resolve the optional
function first, so the missing implementation is the common expected RED
cause rather than a module-load error.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run tests/reference-runtime/sync-reference-runtime.test.ts
```

Expected: FAIL because `transformPlannerRendererReadinessGuard` is undefined;
the pre-existing local-asset tests continue to pass. Record the failing test
names and the missing-function assertion.

- [ ] **Step 3: Implement the smallest successful transformation**

Add precise constants near the existing planner resolver constants and export
the pure function near the other transformation functions:

```ts
const frozenPlannerChunkPublicOutputPath =
  "_app/immutable/chunks/CUwsdp_r.js";
const applicationOnlyRendererGuard =
  "async function uc(x,D){if(!ve)return;";
const rendererReadyGuard =
  "async function uc(x,D){if(!ve?.renderer)return;";

export function transformPlannerRendererReadinessGuard(
  sourcePublicOutputPath: string,
  sourceText: string,
): string {
  if (sourcePublicOutputPath !== frozenPlannerChunkPublicOutputPath) {
    return sourceText;
  }

  const applicationOnlyGuardOccurrenceCount = countOccurrences(
    sourceText,
    applicationOnlyRendererGuard,
  );
  const rendererReadyGuardOccurrenceCount = countOccurrences(
    sourceText,
    rendererReadyGuard,
  );

  if (
    applicationOnlyGuardOccurrenceCount === 1 &&
    rendererReadyGuardOccurrenceCount === 0
  ) {
    return sourceText.replace(
      applicationOnlyRendererGuard,
      rendererReadyGuard,
    );
  }

  if (
    applicationOnlyGuardOccurrenceCount === 0 &&
    rendererReadyGuardOccurrenceCount === 1
  ) {
    return sourceText;
  }

  throw new Error(
    `Reference runtime planner renderer guard must contain exactly one known state. Received public output path: ${JSON.stringify(sourcePublicOutputPath)}. Application-only guard occurrence count: ${applicationOnlyGuardOccurrenceCount}. Renderer-ready guard occurrence count: ${rendererReadyGuardOccurrenceCount}.`,
  );
}
```

Run the focused test and record GREEN for the complete transformation matrix.

- [ ] **Step 4: Verify the transformation mutations are caught**

The tests added in Step 1 must include these literal success cases:

```ts
it.each([
  {
    name: "passes non-target JavaScript through",
    path: "_app/immutable/chunks/other.js",
    source: "async function uc(x,D){if(!ve)return;",
    expected: "async function uc(x,D){if(!ve)return;",
  },
  {
    name: "accepts an already transformed target",
    path: "_app/immutable/chunks/CUwsdp_r.js",
    source: "async function uc(x,D){if(!ve?.renderer)return;",
    expected: "async function uc(x,D){if(!ve?.renderer)return;",
  },
])("$name", ({ path, source, expected }) => {
  expect(transformPlannerRendererReadinessGuard?.(path, source)).toBe(expected);
});
```

Mentally mutate the target path, either guard string, the accepted occurrence
pairs, and the replacement direction. Identify the exact existing test that
fails for each mutation. If any mutation is unprotected, add that test, revert
the mutation, and keep the focused suite GREEN.

- [ ] **Step 5: Integrate the transformation into staged source generation**

In `transformReferenceRuntimeSourceAsset`, apply the new transformation after
the existing static-page transformation and before asset-base localization and
planner-resolver transformation:

```ts
const rendererReadySourceText = transformPlannerRendererReadinessGuard(
  sourceAsset.publicOutputPath,
  staticPageTransformedSourceText,
);
const localizedRuntimeSourceText = rendererReadySourceText.replaceAll(
  remoteGameAssetBase,
  "/assets",
);
```

Do not add a second traversal, class, registry, or generic patch framework.

- [ ] **Step 6: Add the failing delivery behavior contract**

Extend the existing frozen-planner delivery test to assert the delivered
planner chunk contains the renderer-ready guard and no application-only
guard. Run:

```bash
pnpm build
pnpm exec vitest run tests/reference-runtime/reference-runtime-delivery.test.ts
```

Expected RED: the built frozen chunk still contains the application-only
guard.

- [ ] **Step 7: Apply the one-byte-range frozen chunk transformation and update its lock**

Use `apply_patch` to change only the exact guard in
`public/_app/immutable/chunks/CUwsdp_r.js`. Calculate the new digest:

```bash
shasum -a 256 public/_app/immutable/chunks/CUwsdp_r.js
```

Use `apply_patch` to replace only the SHA-256 value for
`_app/immutable/chunks/CUwsdp_r.js` in
`public/reference-runtime/reference-runtime-lock.json`. Do not run
`pnpm reference:sync`, because it atomically republishes the full mirrored
runtime and could overwrite unrelated existing workspace state; durability is
proved by the pure transformation tests.

- [ ] **Step 8: Verify Task 1 GREEN**

Run:

```bash
pnpm exec vitest run tests/reference-runtime/sync-reference-runtime.test.ts
pnpm build
pnpm exec vitest run tests/reference-runtime/reference-runtime-delivery.test.ts
pnpm typecheck
git diff --check
```

Expected: all commands exit 0 with no warnings or errors. Confirm the working
tree diff for Task 1 owned files contains no unrelated changes beyond the
known pre-task baselines.

### Task 2: Public-link navigation ownership boundary

**Files:**

- Create: `public/reference-runtime/public-link-navigation-guard.mjs`
- Create: `tests/reference-runtime/public-link-navigation-guard.test.ts`
- Modify: `public/reference-runtime/bootstrap.mjs`
- Modify: `tests/reference-runtime/reference-runtime-delivery.test.ts`

**Interfaces:**

- Produces:

```js
export function installReferenceRuntimePublicLinkNavigationGuard(
  referenceRuntimeDocument,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
);
```

- A valid location exposes a non-empty string `href`.
- A valid root exposes `contains(candidateNode): boolean`.
- A valid document exposes callable
  `addEventListener(eventType, listener, options)`.
- Repeated installation with the same document, location, and root returns the
  same frozen installation object. Conflicting repeated boundaries throw with
  received values.

- [ ] **Step 1: Add a dynamic-import availability test and verify RED**

Create `tests/reference-runtime/public-link-navigation-guard.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

const navigationGuardModuleUrl = new URL(
  "../../public/reference-runtime/public-link-navigation-guard.mjs",
  import.meta.url,
);

it("exports the public-link navigation guard installer", async () => {
  const navigationGuardModule = await import(navigationGuardModuleUrl.href);

  expect(
    navigationGuardModule.installReferenceRuntimePublicLinkNavigationGuard,
  ).toBeTypeOf("function");
});
```

Run:

```bash
pnpm exec vitest run tests/reference-runtime/public-link-navigation-guard.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 2: Add only the exported installer shape**

Create the module with an exported function that returns one frozen object and
does not yet validate inputs or register a listener:

```js
export function installReferenceRuntimePublicLinkNavigationGuard() {
  return Object.freeze({});
}
```

The availability test must pass. No untested production behavior is added.

- [ ] **Step 3: Add fake boundaries and the first handled-click test**

Define focused test-only fake objects, not production classes:

```ts
type FakeAnchor = {
  href: string;
  target: string;
  rel: string;
  hasAttribute(name: string): boolean;
  closest(selector: string): FakeAnchor | null;
};

type FakeClickEvent = {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  composedPath(): readonly unknown[];
  stopPropagation(): void;
};
```

The fake document records listener type and capture mode and exposes
`dispatchClick(event)`. The fake root owns a set of contained nodes. The first
behavior test dispatches an ordinary nested-target click for
`http://localhost:3001/farm/four-corners` from current location
`http://localhost:3001/` and asserts:

```ts
expect(clickEvent.propagationStopped).toBe(true);
expect(clickEvent.defaultPrevented).toBe(false);
expect(recordedListener.capture).toBe(true);
```

Run the focused test and verify RED because no listener handles the event.

- [ ] **Step 4: Implement only the first positive capture behavior**

Validate that the document exposes callable `addEventListener`, register one
capture listener, and make that listener call `stopPropagation()` for every
click. This intentionally minimal implementation makes the one accepted-click
test GREEN while leaving the exclusion and boundary requirements for their own
RED cycle. Do not add URL, target, modifier, root, or idempotence logic yet.

- [ ] **Step 5: Add the complete exclusion, validation, and idempotence matrix and verify RED**

Add table-driven cases whose expected `propagationStopped` is `false`:

| Case | Literal input |
| --- | --- |
| runtime-owned link | root `contains(anchor) === true` |
| same-document hash | `http://localhost:3001/#planner` |
| external origin | `https://example.com/farm/standard` |
| non-HTTP protocol | `mailto:test@example.com` |
| download | anchor has `download` |
| external relation | `rel="external"` |
| new browsing context | `target="_blank"` |
| parent browsing context | `target="_parent"` |
| top browsing context | `target="_top"` |
| named browsing context | `target="farm-guide"` |
| modified click | each of `metaKey`, `ctrlKey`, `shiftKey`, `altKey` true |
| non-primary click | `button: 1` |
| prevented event | `defaultPrevented: true` |
| no anchor | composed-path node returns `null` from `closest("a")` |

Add positive Chinese and query-string routes and an anchor-as-direct-target
case. Add repeated-valid-installation identity and conflicting root/location
failure tests. Add validation cases whose messages include these literal
received boundary labels:

```text
document addEventListener
location href
runtime root contains
```

Run the focused suite. Expected RED: the intentionally broad listener stops
excluded clicks, repeated installation registers another listener, and invalid
boundaries are not rejected.

- [ ] **Step 6: Implement minimal public-link classification and idempotent installation**

Use ordinary functions with one responsibility each:

```js
function requireNavigationGuardBoundary(
  referenceRuntimeDocument,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
)
function findClickedAnchor(clickEvent)
function isNativePublicDocumentNavigation(
  clickedAnchor,
  clickEvent,
  referenceRuntimeLocation,
)
function handleCapturedPublicLinkClick(
  clickEvent,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
)
function installReferenceRuntimePublicLinkNavigationGuard(
  referenceRuntimeDocument,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
)
```

The handler must call only `clickEvent.stopPropagation()` for an accepted
link. It must never call `preventDefault()`. Register exactly one `click`
listener with `{ capture: true }`. Keep installations in a module-level
`WeakMap` keyed by document; do not add observers, timers, classes, retries,
or React callbacks. Run the focused suite and record GREEN.

- [ ] **Step 7: Add the failing bootstrap delivery and ordering contract**

Update delivery expectations so the built export requires:

```text
reference-runtime/public-link-navigation-guard.mjs
```

Add a test that locates:

```js
import { installReferenceRuntimePublicLinkNavigationGuard } from "/reference-runtime/public-link-navigation-guard.mjs";
installReferenceRuntimePublicLinkNavigationGuard(
  document,
  window.location,
  referenceRuntimeRoot,
);
await start(referenceRuntimeApplication, referenceRuntimeRoot);
installReferenceRuntimeWheelZoomModeToggle(document);
```

Assert import is present, navigation installation occurs before awaited start,
and wheel installation remains after awaited start. Add the new module to the
release-domain scan. Run build plus the delivery test and verify RED before
bootstrap integration.

- [ ] **Step 8: Integrate the guard before frozen startup**

Import the module in `bootstrap.mjs`. Inside `startReferenceRuntime`, after
obtaining and validating `referenceRuntimeRoot` but before setting the
initialized attribute and before awaited frozen start, call the installer with
`document`, `window.location`, and the root. Do not change the local-project API
or wheel-zoom call ordering.

- [ ] **Step 9: Verify Task 2 GREEN**

Run:

```bash
pnpm exec vitest run tests/reference-runtime/public-link-navigation-guard.test.ts
pnpm exec vitest run tests/reference-runtime/wheel-zoom-mode-toggle.test.ts
pnpm build
pnpm exec vitest run tests/reference-runtime/reference-runtime-delivery.test.ts
pnpm typecheck
git diff --check
```

Expected: all commands exit 0 with no warnings or errors. Confirm the Task 2
owned-file diff contains no unrelated changes beyond the known bootstrap and
delivery-test baselines.

### Task 3: Integrated verification and browser acceptance

**Files:**

- Modify: none unless a verified failure requires returning to Task 1 or 2.

**Interfaces:**

- Consumes the transformed frozen chunk and installed navigation boundary.
- Produces verification evidence only.

- [ ] **Step 1: Run the serial full verification bundle**

```bash
pnpm exec vitest run --maxWorkers=1 --minWorkers=1
pnpm typecheck
pnpm build
git diff --check
```

Expected: every command exits 0 with pristine output. Do not run tests in
parallel with a build because both consume `out/`.

- [ ] **Step 2: Serve the production static export without replacing an existing server**

Resolve a free high port, record the spawned PID, and run `pnpm exec serve out`
on that explicit port. Verify the listener belongs to this checkout before
browser testing. Stop only the PID started for this plan.

- [ ] **Step 3: Verify renderer readiness in a real production browser**

Cold load `/` with cache disabled where supported. Assert exactly one runtime
root, initialization attribute `true`, at least one planner canvas, and no
console/page error containing `background`, `renderer`, hydration, or frozen
startup failure. Exercise one map change and one season change through visible
controls and confirm the canvas remains mounted without errors.

- [ ] **Step 4: Verify positive public-link navigation paths**

From fresh homepage loads, click the unique visible links for:

```text
/farm/four-corners
/farm-comparison
/mods
/zh/farm/four-corners
```

For each, verify a top-level document navigation, one
`[data-public-page-shell]`, the expected route URL, no runtime root/bootstrap
module on the destination, and no frozen SvelteKit 404.

- [ ] **Step 5: Verify excluded interactions**

Confirm `#planner` remains same-document navigation, a modified click preserves
new-tab behavior, and one representative runtime-internal link/control remains
owned by the frozen planner. Confirm the guard never cancels the default click
action.

- [ ] **Step 6: Final diff and scope audit**

Compare every changed path to the File Responsibility Map. Report any unrelated
pre-existing modifications separately and do not alter them. Record exact test
counts, commands, browser URLs, server port/PID, and console results in the
final verification report.
