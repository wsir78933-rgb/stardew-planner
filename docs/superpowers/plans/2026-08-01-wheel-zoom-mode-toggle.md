# Wheel Zoom Mode Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to implement this plan task by
> task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make planner-canvas wheel input scroll the public page by default and
enable the frozen runtime's existing wheel zoom only while an explicit toolbar
toggle is active.

**Architecture:** Add one focused local browser module at the existing frozen
runtime boundary. It validates the current runtime DOM, gates wheel propagation
in the capture phase, and inserts one accessible toolbar toggle without reading
or modifying Svelte internals. Bootstrap only installs the module; the locked
runtime continues to own camera math and actual zoom rendering.

**Tech Stack:** Browser ES modules, DOM events, frozen Svelte/Pixi runtime,
Vitest 3 in Node mode, Next.js 16 static export, existing local CSS variables.

## Global Constraints

- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast,
  YAGNI, and precise naming throughout production and test code.
- Every invalid boundary value must fail with an error containing the received
  value, count, tag, class, or title.
- Do not catch unknown errors and do not introduce silent fallback behavior.
- Do not edit `public/_app/immutable/**`,
  `public/reference-runtime/reference-runtime-lock.json`, camera algorithms,
  keyboard shortcuts, touch gestures, project persistence, SEO, deployment,
  dependencies, or Hermes source.
- Do not persist the toggle state. Every page load starts disabled.
- Do not create a commit; no commit is authorized.
- Preserve unrelated existing and uncommitted workspace changes.

---

## File responsibility map

- Create `public/reference-runtime/wheel-zoom-mode-toggle.mjs`: own wheel-mode
  state, frozen DOM validation, capture-phase wheel gating, accessible button
  construction, and idempotent installation behind one exported installer.
- Create `tests/reference-runtime/wheel-zoom-mode-toggle.test.ts`: own behavioral
  tests using narrow fake DOM/event objects; no jsdom or new dependency.
- Modify `tests/reference-runtime/reference-runtime-delivery.test.ts`: require
  the new local module in the built export and include it in the existing
  release-source security scan.
- Modify `public/reference-runtime/bootstrap.mjs`: import the installer, await
  `start(referenceRuntimeApplication, root)`, and call the installer only after
  the frozen runtime finishes mounting.
- Modify `public/reference-runtime/local-only-overrides.css`: style only the
  injected stable markers with the verified frozen toolbar tokens.
- Existing `tests/reference-runtime/local-only-overrides.test.ts` continues to
  enforce that the complete local override stylesheet contains no remote URL;
  visual token behavior is verified from computed styles in Hermes CDP rather
  than by grepping CSS source text.

### Task 1: Behavior-first wheel zoom mode module

**Files:**

- Create: `tests/reference-runtime/wheel-zoom-mode-toggle.test.ts`
- Create: `public/reference-runtime/wheel-zoom-mode-toggle.mjs`
- Modify: `tests/reference-runtime/reference-runtime-delivery.test.ts`

**Interfaces:**

- Consumes: one structurally validated Document-compatible boundary with
  callable `querySelectorAll`, `createElement`, and `addEventListener`.
  Validation must not use `instanceof Document`; its failure must include the
  received value so the existing Node Vitest environment can exercise the
  boundary without jsdom.
- Produces:

```js
export function installReferenceRuntimeWheelZoomModeToggle(
  referenceRuntimeDocument,
) {
  return Object.freeze({
    isWheelZoomEnabled,
    setWheelZoomEnabled,
  });
}
```

- `isWheelZoomEnabled(): boolean` returns the current page-local state.
- `setWheelZoomEnabled(isWheelZoomEnabled: boolean): void` validates the
  boolean, updates the button's `aria-pressed`, accessible label, and title,
  and changes no other runtime state.
- Calling the installer again for the same valid runtime root returns the same
  frozen installation object; a conflicting marker without the installation
  record throws.

- [ ] **Step 1: Create narrow fake DOM boundaries and the first failing test**

Import the public browser module using the repository's established
TypeScript boundary annotation:

```ts
// @ts-expect-error The static public module has no TypeScript declaration file.
import { installReferenceRuntimeWheelZoomModeToggle } from "../../public/reference-runtime/wheel-zoom-mode-toggle.mjs";
```

Before the module exists, add
`"reference-runtime/wheel-zoom-mode-toggle.mjs"` to the required local export
paths and add its resolved path to the existing `releaseModulePaths` security
scan. This test catches a real release break: a locally working source module
that is absent from `out/` or introduces a forbidden upstream URL.

The test file must define precisely named `FakeReferenceRuntimeElement` and
`FakeReferenceRuntimeDocument` fixtures with only these behaviors:

```ts
type RecordedListener = Readonly<{
  eventType: string;
  listener: (event: FakeWheelEvent | FakeClickEvent) => void;
  capture: boolean;
}>;

class FakeReferenceRuntimeElement {
  readonly attributes = new Map<string, string>();
  readonly children: FakeReferenceRuntimeElement[] = [];
  readonly listeners: RecordedListener[] = [];
  readonly selectorResults = new Map<string, FakeReferenceRuntimeElement[]>();
  readonly classNameSet: Set<string>;
  parentElement: FakeReferenceRuntimeElement | null = null;
  innerHTML = "";

  constructor(
    readonly tagName: string,
    readonly classNames: readonly string[] = [],
  ) {
    this.classNameSet = new Set(classNames);
  }

  readonly classList = {
    contains: (className: string) => this.classNameSet.has(className),
    add: (className: string) => this.classNameSet.add(className),
    remove: (className: string) => this.classNameSet.delete(className),
  };

  setAttribute(attributeName: string, attributeValue: string): void {
    this.attributes.set(attributeName, attributeValue);
  }

  getAttribute(attributeName: string): string | null {
    return this.attributes.get(attributeName) ?? null;
  }

  append(...appendedChildren: FakeReferenceRuntimeElement[]): void {
    for (const appendedChild of appendedChildren) {
      appendedChild.parentElement = this;
      this.children.push(appendedChild);
    }
  }

  insertBefore(
    insertedChild: FakeReferenceRuntimeElement,
    referenceChild: FakeReferenceRuntimeElement,
  ): void {
    const referenceIndex = this.children.indexOf(referenceChild);
    if (referenceIndex < 0) {
      throw new Error(`Reference child is missing. Received tag: ${referenceChild.tagName}.`);
    }
    insertedChild.parentElement = this;
    this.children.splice(referenceIndex, 0, insertedChild);
  }

  addEventListener(
    eventType: string,
    listener: RecordedListener["listener"],
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners.push({
      eventType,
      listener,
      capture: typeof options === "boolean" ? options : options?.capture === true,
    });
  }

  querySelectorAll(selector: string): FakeReferenceRuntimeElement[] {
    return this.selectorResults.get(selector) ?? [];
  }

  closest(selector: string): FakeReferenceRuntimeElement | null {
    for (
      let candidate: FakeReferenceRuntimeElement | null = this;
      candidate !== null;
      candidate = candidate.parentElement
    ) {
      if (selector === ".canvas-container" && candidate.classList.contains("canvas-container")) {
        return candidate;
      }
    }
    return null;
  }

  click(): void {
    for (const recordedListener of this.listeners) {
      if (recordedListener.eventType === "click") {
        recordedListener.listener({ type: "click" });
      }
    }
  }
}
```

`FakeReferenceRuntimeDocument` uses the same `selectorResults` and listener
recording pattern, returns new fake elements from `createElement(tagName)`,
and exposes a `dispatchWheel(target)` method that runs capture listeners,
then the target listener only when propagation remains enabled.

Build the verified toolbar order
`cursor group, separator, erase group, separator, undo group` and one
`.canvas-container` below `#reference-runtime-root`. Then assert:

```ts
const installation = installReferenceRuntimeWheelZoomModeToggle(fakeDocument);

expect(installation.isWheelZoomEnabled()).toBe(false);
expect(wheelZoomButton.getAttribute("aria-pressed")).toBe("false");
expect(wheelZoomButton.getAttribute("aria-label")).toBe("Enable wheel zoom");
expect(wheelZoomButton.getAttribute("title")).toBe("Enable wheel zoom");
```

- [ ] **Step 2: Run the focused test and prove RED**

Run:

```bash
pnpm build
pnpm exec vitest run tests/reference-runtime/wheel-zoom-mode-toggle.test.ts
pnpm exec vitest run tests/reference-runtime/reference-runtime-delivery.test.ts
```

Expected: the behavior test FAILS because the module/export does not exist and
the delivery test FAILS because the built local module is absent.

- [ ] **Step 3: Add failing wheel propagation tests**

Record a capture listener on the fake document and a target listener on the
fake `.canvas-container`. Verify all four paths:

```ts
expect(defaultCanvasWheelEvent.propagationStopped).toBe(true);
expect(defaultCanvasWheelEvent.defaultPrevented).toBe(false);
expect(frozenWheelListenerCallCount).toBe(0);

installation.setWheelZoomEnabled(true);
expect(enabledCanvasWheelEvent.propagationStopped).toBe(false);
expect(frozenWheelListenerCallCount).toBe(1);

installation.setWheelZoomEnabled(false);
expect(disabledAgainWheelEvent.propagationStopped).toBe(true);

expect(outsideCanvasWheelEvent.propagationStopped).toBe(false);
```

Also assert that `setWheelZoomEnabled("true")` throws a `TypeError` containing
`Received: "true"`.

- [ ] **Step 4: Add failing toolbar contract and toggle-state tests**

Verify the installed direct-child order is exactly:

```ts
expect(getToolbarChildKinds(toolbar)).toEqual([
  "cursor-group",
  "separator",
  "erase-group",
  "wheel-zoom-separator",
  "wheel-zoom-group",
  "separator",
  "undo-group",
]);
```

Assert the marker button has `type="button"`, contains one 20px SVG, toggles
`aria-pressed`, `aria-label`, and title on each click, and is inserted only
once after a second installer call.

Add table-driven fail-fast cases for:

- zero or two runtime roots;
- zero or two canvas containers;
- zero or two toolbars;
- missing or duplicated `Erase (E)` and `Undo (Ctrl+Z)` buttons;
- anchors outside direct tool groups or outside the same toolbar;
- undo separator missing or not immediately after the erase group;
- a pre-existing marker without a valid installation record.

Each expected error must include the actual count, tag, class, or title.

- [ ] **Step 5: Implement the smallest single-responsibility module**

Use constants for selectors, marker attributes, and the two action labels.
Keep the installer as orchestration only:

```js
export function installReferenceRuntimeWheelZoomModeToggle(
  referenceRuntimeDocument,
) {
  assertReferenceRuntimeDocumentCompatibleBoundary(referenceRuntimeDocument);
  const runtimeContract = resolveReferenceRuntimeWheelZoomContract(
    referenceRuntimeDocument,
  );
  const existingInstallation = readExistingWheelZoomInstallation(
    runtimeContract.referenceRuntimeRoot,
  );

  if (existingInstallation !== null) {
    return existingInstallation;
  }

  const wheelZoomState = createWheelZoomState();
  const wheelZoomButton = createWheelZoomButton(
    referenceRuntimeDocument,
    wheelZoomState,
  );
  insertWheelZoomToolbarControl(runtimeContract, wheelZoomButton);
  installWheelEventGate(
    referenceRuntimeDocument,
    runtimeContract.canvasContainer,
    wheelZoomState,
  );

  return storeWheelZoomInstallation(
    runtimeContract.referenceRuntimeRoot,
    wheelZoomState,
  );
}
```

`installWheelEventGate` must call only `wheelEvent.stopPropagation()` while
disabled and only for targets whose `closest(".canvas-container")` is the
resolved container. It must never call `preventDefault()`.

Use `button.innerHTML` only for the fixed local magnifying-glass SVG string;
all state and contract values use DOM methods rather than HTML interpolation.

- [ ] **Step 6: Run the focused tests and prove GREEN**

Run:

```bash
pnpm build
pnpm exec vitest run \
  tests/reference-runtime/wheel-zoom-mode-toggle.test.ts \
  tests/reference-runtime/reference-runtime-delivery.test.ts
```

Expected: all module behavior and static-delivery tests PASS.

- [ ] **Step 7: Review Task 1 before integration**

Dispatch separate spec-compliance and code-quality reviewers. Resolve every
P0/P1 issue and rerun the focused test. Do not modify bootstrap, CSS, or
delivery files during this task.

### Task 2: Bootstrap, visual integration, and static delivery

**Files:**

- Modify: `public/reference-runtime/wheel-zoom-mode-toggle.mjs`
- Modify: `public/reference-runtime/bootstrap.mjs`
- Modify: `public/reference-runtime/local-only-overrides.css`

**Interfaces:**

- Consumes:
  `installReferenceRuntimeWheelZoomModeToggle(document)` from Task 1.
- Produces: stable local marker attributes on the injected separator, group,
  and button; a bootstrap call after the frozen runtime's asynchronous
  `start(...)` promise resolves; and
  marker-scoped computed styles for desktop and compact toolbar sizes.

- [ ] **Step 1: Prove the missing bootstrap integration is RED in Hermes CDP**

Build and serve Task 1 without changing bootstrap:

```bash
pnpm build
pnpm exec serve out -l 3017
```

Open the built planner through the local Hermes CDP browser. Assert the toolbar
contains zero buttons with accessible name `Enable wheel zoom`. This is the
expected RED state: the tested module exists but is not integrated into the
shipped UI.

- [ ] **Step 2: Add the minimal bootstrap installation**

Import the new local module at the top of `bootstrap.mjs`, make
`startReferenceRuntime()` asynchronous, await the frozen start call, and then
install the enhancement:

```js
await start(referenceRuntimeApplication, referenceRuntimeRoot);
installReferenceRuntimeWheelZoomModeToggle(document);
removeReferenceRuntimeLocalOnlyControls(document);
```

`startReferenceRuntimeWithLocalOnlyOverrides()` must await
`startReferenceRuntime()` so start or installation failures remain observable.
Do not add a `MutationObserver`, animation-frame retry, or fixed delay for this
toolbar installation.

- [ ] **Step 3: Prove bootstrap GREEN and marker styles RED in Hermes CDP**

Rebuild and reload the same Hermes CDP page. Locate the unique button by its
accessible name `Enable wheel zoom`, assert it exists between Erase and Undo,
and verify its default wheel behavior. Then read its computed styles. Before
the marker and CSS change, the following literal expectations must fail:

```ts
expect(computedButtonStyle.width).toBe(computedEraseButtonStyle.width);
expect(computedButtonStyle.height).toBe(computedEraseButtonStyle.height);
expect(computedButtonStyle.color).toBe("rgb(106, 170, 128)");
expect(computedSeparatorStyle.width).toBe("1px");
```

Expected: integration is GREEN (one working button) and visual behavior is RED
because the injected elements do not inherit hash-scoped Svelte styles. Width
and height are compared with Erase instead of a literal pixel value because the
shared `var(--lk-xl)` token is the UI contract and Chrome may quantize its
calculated value differently.

- [ ] **Step 4: Add stable markers and marker-scoped toolbar styles**

In `wheel-zoom-mode-toggle.mjs`, set these exact attributes while constructing
the injected elements:

```js
wheelZoomSeparator.setAttribute(
  "data-reference-runtime-wheel-zoom-separator",
  "true",
);
wheelZoomGroup.setAttribute(
  "data-reference-runtime-wheel-zoom-group",
  "true",
);
wheelZoomButton.setAttribute(
  "data-reference-runtime-wheel-zoom-button",
  "true",
);
```

Extend `wheel-zoom-mode-toggle.test.ts` first so removal or misspelling of any
marker fails through the installed toolbar's observable attributes.

Append rules below the existing homepage runtime frame rules. Scope every
selector below `body.stardew-homepage #reference-runtime-root` and include:

```css
[data-reference-runtime-wheel-zoom-separator="true"] {
  width: 1px;
  height: var(--lk-lg);
  background: var(--border-subtle);
  margin: 0 var(--lk-3xs);
}

[data-reference-runtime-wheel-zoom-button="true"] {
  width: var(--lk-xl);
  height: var(--lk-xl);
  border: 0;
  border-radius: var(--lk-xs);
  background: none;
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s,
    translate 80ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-reference-runtime-wheel-zoom-button="true"][aria-pressed="true"] {
  background: var(--accent-muted);
  color: var(--text-bright);
}
```

Also reproduce the existing hover, active-press, and
`@media (pointer: coarse), (max-width: 1400px)` 36px rules only for these
markers.

- [ ] **Step 5: Build and run focused integration tests**

Run:

```bash
pnpm build
pnpm exec vitest run \
  tests/reference-runtime/wheel-zoom-mode-toggle.test.ts \
  tests/reference-runtime/local-only-overrides.test.ts \
  tests/reference-runtime/reference-runtime-delivery.test.ts
```

Expected: build succeeds and all focused tests PASS. Reload through Hermes CDP
and verify the Step 3 computed desktop styles now match. At a 390px viewport,
verify the computed button width and height are both exactly `36px`; this is
the GREEN state for the compact visual behavior.

- [ ] **Step 6: Review Task 2 before browser validation**

Dispatch separate spec-compliance and regression reviewers. Confirm the diff
does not touch `public/_app/immutable/**` or the runtime lock, resolve every
P0/P1 issue, then rerun Step 5.

### Task 2.1: Whole-feature review fixes

Before full verification, apply the user-authorized findings recorded in
`.superpowers/sdd/2026-08-01-wheel-zoom-mode-toggle/review-fix-brief.md` with
TDD: validate/reuse compatible stable marker markup, reject partial or
duplicate markup, enforce the exact Erase/separator/Undo contract, correct the
same-document capture-listener test semantics, and protect bootstrap import and
awaited installation order with an automated delivery test. Run focused tests,
typecheck, build, `git diff --check`, and independent re-review before Task 3.

### Task 3: Full verification and Hermes CDP browser acceptance

**Files:**

- Verify only; modify production or test files only when a verified defect is
  first reported and accepted into this task's confirmed scope.

**Interfaces:**

- Consumes: the built static export from Task 2.
- Produces: test command output plus desktop and compact browser evidence for
  the confirmed interaction.

- [ ] **Step 1: Run static checks and the full suite**

Run in this order:

```bash
pnpm typecheck
pnpm build
pnpm test --run
git diff --check
git status --short
```

Expected: every command succeeds; status contains only the authorized design,
plan, wheel-zoom module, bootstrap, local CSS, and related tests plus any
pre-existing unrelated changes.

- [ ] **Step 2: Serve the verified production export**

Use the existing `serve` dependency on a free explicit port:

```bash
pnpm exec serve out -l 3017
```

If port 3017 is occupied by the earlier read-only inspection server, reuse
that process only after confirming it serves the newly rebuilt `out/` files.

- [ ] **Step 3: Validate desktop behavior through the local Hermes CDP browser**

Connect to the local Hermes-managed CDP browser. At a desktop viewport, record
the connection used, toolbar button location, `aria-pressed`, page scroll
position, and a visual map-scale proxy before and after each wheel action:

1. Reload: button is between Erase and Undo with `aria-pressed="false"`.
2. Wheel over the canvas: page scroll position changes and the map scale proxy
   does not.
3. Click the unique `Enable wheel zoom` button.
4. Wheel over the canvas: page scroll position does not change and the map
   scale proxy changes.
5. Click the unique `Disable wheel zoom` button.
6. Wheel over the canvas: page scrolling returns and map scale stays fixed.
7. Reload: `aria-pressed` returns to `false`.

Save one screenshot from the Hermes CDP session after the final desktop state
to verify visual alignment.

- [ ] **Step 4: Validate compact/mobile layout and untouched interactions through Hermes CDP**

Using the same Hermes CDP session at 390px width, verify the button remains
36px, stays between Erase and Undo, and the toolbar does not clip or overflow
the editor viewport. Confirm the button can be toggled and save a compact
screenshot. On a pointer-capable viewport, exercise the existing `R` and `T`
shortcuts and confirm they still zoom regardless of wheel-mode state. Confirm
no code path in the new module listens for pointer or touch events.

- [ ] **Step 5: Run final independent review**

Dispatch a final correctness/regression reviewer over the complete diff and
the recorded verification evidence. Resolve every P0/P1 issue, rerun affected
checks, and report any lower-priority finding without expanding scope.

- [ ] **Step 6: Report completion without committing**

Report changed files, exact validation results, browser evidence, remaining
limitations, and confirmation that no commit was created.
