# Wheel Zoom Mode Toggle Design

## Status

This design is authorized by the user. It changes only the frozen planner
runtime's mouse-wheel behavior and adds one toolbar toggle. No commit is
authorized.

## Goal

Prevent accidental farm-map zooming while a visitor scrolls the public page.
The planner must start with wheel zoom disabled. A visitor can explicitly
enable the existing wheel-zoom behavior from a new toolbar button and disable
it again from the same button.

## Confirmed interaction

- Each page load starts with wheel zoom disabled.
- With wheel zoom disabled, a wheel event over the planner canvas is not
  handled by the frozen runtime, so the browser scrolls the page normally.
- Clicking the new toolbar button enables the frozen runtime's existing wheel
  zoom behavior.
- Clicking the button again disables wheel zoom and restores normal page
  scrolling.
- The state is session-local to the mounted page and is not stored in
  `localStorage`, cookies, the URL, or project data.
- Keyboard zoom shortcuts and touch gestures retain their existing behavior.

## Chosen integration boundary

Implement the feature in a focused
`public/reference-runtime/wheel-zoom-mode-toggle.mjs` module installed by
`public/reference-runtime/bootstrap.mjs` after the frozen runtime's asynchronous
`start(...)` promise resolves. Do not edit the locked minified Svelte/Pixi assets under
`public/_app/immutable/` and do not reimplement the camera zoom algorithm.

The enhancement owns two responsibilities behind a narrow public interface:

1. Install a capture-phase wheel gate on the document. When the event
   originates within the frozen runtime's `.canvas-container` and wheel zoom
   is disabled, stop propagation before the container's non-passive frozen
   listener receives it without calling
   `preventDefault()`. Native page scrolling therefore remains available.
   When wheel zoom is enabled, allow the event to reach the existing runtime.
2. Insert and maintain one accessible toggle in the frozen toolbar. The
   button updates the wheel gate through an explicit state callback; it does
   not access Svelte component internals.

The bootstrap module starts the frozen runtime and then orchestrates the
focused enhancement installation. Event classification, state transitions,
DOM contract validation, and button construction remain separate
single-purpose functions.

## Toolbar contract

Locate the toolbar from its stable visible controls rather than relying on a
single minified class name:

- the erase button has the exact title `Erase (E)`;
- the undo button has the exact title `Undo (Ctrl+Z)`;
- both belong to the same toolbar;
- the erase group precedes the undo/redo group.

Insert one new separator and a one-button tool group immediately before the
existing separator that precedes the undo/redo group. The existing separator
remains the control's right boundary, producing
`erase | wheel zoom | undo/redo`. Installation is idempotent: an existing
wheel-zoom toggle is reused only when it satisfies the expected button
contract; conflicting or malformed markup throws an error containing the
received value.

The button uses a 20px magnifying-glass SVG, `type="button"`, and
`aria-pressed="false"` initially. Its accessible label and title describe the
current action. Stable local `data-reference-runtime-*` markers identify the
injected group, separator, and button without pretending that they are owned
by the Svelte component.

## Visual tokens

The new control reuses the frozen runtime's verified toolbar tokens:

| Role | Existing value |
| --- | --- |
| Toolbar background | `#063d25` |
| Surface hover | `#05472a` |
| Subtle border | `#055437` |
| Default icon | `#6aaa80` |
| Active background | `rgba(8, 140, 89, 0.25)` |
| Active icon | `#eaf5ee` |
| Desktop button size | `var(--lk-xl)`, equal to the existing Erase button |
| Compact button size | 36px |
| Button radius | `var(--lk-xs)`, approximately 10px |
| Icon size | 20px |

Because the frozen Svelte toolbar styles are hash-scoped, the injected
markers receive only the necessary equivalent declarations in
`public/reference-runtime/local-only-overrides.css`. The local rules include
the existing 36px compact breakpoint. No new visible text, font, color
system, breakpoint, or toolbar animation is introduced.

## Fail-fast behavior

- Installation requires a Document-compatible boundary exposing
  `querySelectorAll`, `createElement`, and `addEventListener`, plus a valid
  frozen runtime root. Validation is structural rather than
  `instanceof Document` so the boundary remains directly testable in the
  existing Node Vitest environment without adding jsdom.
- The wheel gate accepts only a boolean enabled state.
- A missing or duplicated canvas container, toolbar, erase anchor, undo
  anchor, undo group, or preceding separator produces a descriptive error.
- Reordered, unexpectedly nested, or non-sibling anchor controls also fail
  with the observed count, tag, class, or title in the message.
- A duplicate installation with an incompatible existing element produces a
  descriptive error instead of silently adding another control.
- Event handlers do not catch unknown errors.
- Bootstrap awaits the current asynchronous frozen-runtime `start(...)` call
  before installation. If `start(...)` rejects, the error propagates; if the
  verified toolbar contract is absent after it resolves, installation fails
  explicitly instead of adding an observer, animation-frame retry, or timer.

## Scope boundaries

This change may modify the local bootstrap/override boundary, add one focused
runtime module, and add directly related tests. It must not modify:

- locked files under `public/_app/immutable/`;
- `reference-runtime-lock.json` or upstream synchronization behavior;
- the camera zoom algorithm or zoom limits;
- keyboard shortcuts, touch pinch behavior, drag panning, placement tools,
  project persistence, SEO, public copy, or deployment configuration;
- Hermes source code;
- dependencies or package-manager state.

## Verification

Automated checks must prove:

- initial wheel-zoom state is disabled;
- a disabled wheel gate stops propagation to the frozen container listener but
  does not cancel the event;
- an enabled wheel gate allows the frozen container listener to receive the
  event;
- unrelated wheel events are untouched;
- the toolbar control is inserted exactly once between erase and undo, reusing
  the existing undo separator as its right boundary;
- `aria-pressed`, title, accessible label, and active styling track the
  state;
- malformed DOM contracts fail with the received value in the error;
- the static runtime delivery contract includes the new local module and all
  required local files with no external runtime dependency.

Run the focused Vitest files, `pnpm typecheck`, the production build, and the
full test suite. In a locally served production export, verify at desktop and
compact/mobile widths through the local Hermes CDP browser that:

1. the button is in the confirmed toolbar position and matches existing
   controls, including computed width and height parity with Erase;
2. wheel input over the canvas scrolls the page by default without changing
   map scale;
3. enabling the button makes the same wheel input zoom the map;
4. disabling it restores page scrolling;
5. reloading restores the disabled default;
6. keyboard zoom and touch behavior have not regressed.
