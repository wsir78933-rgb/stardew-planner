# Reference Runtime Readiness and Public Navigation Design

## Status

Approved by the user on 2026-08-02. Implementation is authorized. No commit is authorized.

## Goal

Fix two verified homepage runtime defects without changing planner behavior or
expanding into unrelated UI, SEO, project-data, dependency, deployment, or
Hermes work:

1. The frozen Pixi application can expose its application object before
   `renderer` exists, allowing a reactive map load to read
   `ve.renderer.background` too early.
2. The frozen SvelteKit runtime installs a document-level link router that
   intercepts Next.js public-page links outside the planner runtime and tries
   to resolve them with the frozen route table.

## Confirmed Evidence

- `public/_app/immutable/chunks/CUwsdp_r.js` assigns `ve = new Eg` before
  awaiting `ve.init(...)`.
- The frozen `uc(...)` map loader checks only `ve` before reading
  `ve.renderer.background.color`.
- A reactive call can invoke `uc(...)` while `ve.init(...)` is pending. The
  initialization flow later performs an explicit `await uc(...)`, so skipping
  only the premature call does not discard the initial map load.
- `public/_app/immutable/chunks/BGAmgcsS.js` registers a global click handler
  on `document.documentElement`. It prevents the default action for ordinary
  same-origin links and sends them through the frozen SvelteKit route table.
- Browser reproduction showed a homepage farm-guide click changing the URL
  without rendering the Next.js public-page shell; the frozen runtime logged a
  route 404.

## Architecture

### Renderer-readiness transformation

The source synchronizer owns a deterministic transformation for the one
version-locked planner chunk. It replaces the premature application-only
guard:

```js
async function uc(x,D){if(!ve)return;
```

with the renderer-readiness guard:

```js
async function uc(x,D){if(!ve?.renderer)return;
```

The transformation is a focused pure function. It receives the public output
path and JavaScript source text and returns the transformed text. Non-target
assets are unchanged. For the target asset it accepts exactly one known old
state or exactly one already-transformed state. Any missing, duplicated, or
mixed state fails immediately with the public output path and both observed
occurrence counts.

The existing synchronizer applies the transformation before writing staged
assets and before calculating SHA-256 values. This makes the fix repeatable on
future `reference:sync` runs and keeps the lock tied to the delivered bytes.

### Public-link navigation boundary

A focused browser module installs one idempotent capture-phase click listener
before the frozen SvelteKit runtime starts. It owns only the boundary between
the Next.js document and the embedded runtime.

For an ordinary cross-document, same-origin HTTP(S) anchor outside
`#reference-runtime-root`, the listener calls `stopPropagation()` and never
calls `preventDefault()`. The event therefore does not reach the frozen global
router, while the browser retains its native top-level navigation behavior.

The boundary does not handle:

- anchors inside `#reference-runtime-root`;
- same-document hash links;
- external origins or non-HTTP(S) protocols;
- links with `download` or `rel="external"`;
- `_blank`, `_parent`, `_top`, or other non-`_self` targets;
- modified clicks, non-primary clicks, or already prevented events;
- events whose composed path does not identify an anchor.

The module validates its document, location, and runtime-root boundaries with
value-specific errors. Bootstrap imports and installs it before
`start(referenceRuntimeApplication, referenceRuntimeRoot)`. The existing
wheel-zoom installer remains after the awaited start and is otherwise
unchanged.

## Alternatives Rejected

### Direct one-off frozen-bundle edit

This would be overwritten by the next reference-runtime synchronization and
would separate the lock update from the transformation that produced it.

### Bootstrap delay or retry

An outer delay cannot eliminate the internal Pixi initialization race. A retry
would have to recover a partially mounted Svelte/Pixi tree and an already-set
initialization marker, increasing coupling and hiding the source defect.

### Per-link React hard navigation

Adding `location.assign()` handlers to each homepage link would duplicate
browser navigation rules, couple presentation components to the frozen
router, and allow footer or future links to be missed.

### `data-sveltekit-reload` on current link containers

This is smaller for the currently known links, but it spreads a frozen
framework-specific contract into React presentation markup and requires every
future public link to remember the attribute. The approved design instead
creates one explicit router-ownership boundary.

## File Responsibilities

- `src/reference-runtime/sync-reference-runtime.ts`
  - Own the exact, fail-fast renderer-readiness transformation.
  - Apply it before staged writes and lock calculation.
- `tests/reference-runtime/sync-reference-runtime.test.ts`
  - Prove old-state replacement, already-transformed idempotence, non-target
    pass-through, and value-specific failures for invalid occurrence counts.
- `public/_app/immutable/chunks/CUwsdp_r.js`
  - Contain only the resulting readiness-guard change.
- `public/reference-runtime/reference-runtime-lock.json`
  - Record the transformed chunk's actual SHA-256.
- `public/reference-runtime/public-link-navigation-guard.mjs`
  - Own public-link classification and capture-phase propagation blocking.
- `tests/reference-runtime/public-link-navigation-guard.test.ts`
  - Exercise real module behavior through focused fake DOM/event boundaries.
- `public/reference-runtime/bootstrap.mjs`
  - Import and install the navigation boundary before frozen startup.
- `tests/reference-runtime/reference-runtime-delivery.test.ts`
  - Lock the readiness guard, navigation-module delivery, installation order,
    and release-domain safety contracts.

No dependency, route registry, public-page component, project-data module,
deployment configuration, Hermes source file, or unrelated current change is
modified.

## Error Handling

- Unknown states are never accepted silently.
- Transformation errors include the target public output path, old-state
  count, and transformed-state count.
- Navigation installation rejects invalid document, location, runtime-root,
  or conflicting existing-installation boundaries with received values;
  repeated valid installation returns the existing installation.
- Event classification ignores explicitly excluded browser interactions; it
  does not catch or suppress unknown exceptions.
- The navigation boundary never prevents the browser's default navigation.

## Testing Strategy

Implementation follows strict RED-GREEN-REFACTOR cycles.

### Renderer readiness

1. Add transformation and delivery tests and verify they fail because the
   transformation/exported contract and transformed bundle are absent.
2. Implement the pure transformation and apply the single bundle change.
3. Update the matching lock from the transformed bytes.
4. Verify focused synchronization and delivery tests pass.

### Public navigation

1. Add behavior tests for handled English and Chinese public links, nested
   anchor targets, idempotent installation, and every exclusion listed above.
2. Verify the tests fail before the module exists or before it implements the
   boundary.
3. Implement the smallest module that satisfies those cases.
4. Add and verify delivery-order tests proving installation precedes frozen
   startup.

## Acceptance Criteria

- Cold loading and remounting `/` no longer emits a
  `Cannot read properties of undefined (reading 'background')` error.
- The runtime initializes exactly once and renders a canvas successfully.
- Map and season changes still load after initialization.
- Clicking homepage links to `/farm/four-corners`, `/farm-comparison`, `/mods`,
  and a Chinese public route produces a real document navigation and renders
  `[data-public-page-shell]` without a frozen-route 404.
- Hash links, modified clicks, new-tab behavior, downloads, external links,
  and runtime-internal links retain their existing behavior.
- Focused tests, the full test suite, `pnpm typecheck`, `pnpm build`, and
  `git diff --check` pass with pristine output.
- A built static export passes browser checks for the affected positive and
  negative paths.
- No commit is created.
