# Keep setting switch rows flat

Written against: 9287a02bfcea57bb4cd96144233ab786430b6621. The user accepted the interactive switch preview in this conversation.

## Evidence chain

- Surface: homepage planner, View / Ambience / Settings popovers.
- Problem: generic modal button backgrounds, borders and raised/pressed shadows override the local switch-row rule. Runtime inspection confirmed raised shadows on rows whose local rule says `box-shadow: none`.
- Design evidence: `design-plans/switch-effect-preview.html`, accepted by the user; existing `app/globals.css` `.editor-config-switch` rule.
- Owner: `app/globals.css`; consumers are `OptionSwitch` in `src/components/editor-config-panels.tsx`.
- Scope: all 18 rows (View 10, Ambience 4, Settings 4).
- Uncertainty: browser validation must cover actual normal, pressed, pointer-active, disabled and focused states on desktop and mobile.

## Design decision

Keep each switch row flat and transparent in every state while preserving the surrounding green section and the existing right-hand switch appearance. Keep whole-row activation, existing labels, callbacks, focus outlines and mobile touch size.

## Reuse

- Existing `.editor-config-switch`, track/thumb rules, theme variables and focus styling.
- Exemplar: accepted interactive preview. No new primitive or dependency.

## Changes

1. `app/globals.css` only:
   - Correct the switch-row cascade so transparent background, zero border and no row shadow win against generic modal button rules in normal, active, pressed and disabled states.
   - Add only a subtle hover surface using an existing suitable theme token if required to match the accepted preview; do not change track/thumb styling.
   - Preserve dimensions, colors, typography, callbacks, warnings, focus outlines and responsive rules.

## Scope

- Inherit: the 18 shared switch rows in View, Ambience and Settings.
- Verify: adjacent seasonal/weather/cursor/catalog-position choice buttons and Free Placement confirmation actions retain their existing feedback.
- Exclude: all other product source, existing package/lock changes, dependency changes, storage/behavior changes, commits, deploys and broad style cleanup.

## Validation

- Product: whole-row activation updates its existing On/Off state; unsupported NPC paths remain disabled; Free Placement retains confirmation.
- Interface: View, Ambience and Settings at desktop and 390px, normal/on/off/disabled/focused states; other button feedback unchanged. Use local ego-browser.
- System: one narrowly scoped switch-row override, no general modal restyle.
- Repository: `pnpm exec vitest run tests/components/editor-modal.test.tsx tests/components/editor-shell.test.tsx tests/components/editor-modal-content-style-contract.test.ts tests/components/editor-modal-viewport-style-contract.test.ts`; `pnpm typecheck`; `pnpm build`; `git diff --check`. Distinguish pre-existing failures from scoped changes.

## Stop conditions

- Stop if implementation requires changing files other than `app/globals.css`, adding dependencies, changing control behavior or overriding a concurrently modified section. Report unrelated issues without fixing them.

## Design documentation

- None beyond this plan.
