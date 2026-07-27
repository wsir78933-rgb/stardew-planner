# Farm Summary Map Information Plan

**Goal:** Make the local farm summary state which map and season it summarizes, matching the existing route contract without changing counts or CSV row semantics.

**Architecture:** The page supplies the current known map ID, map display name, and season. `farm-summary` validates and carries that immutable context alongside rows. The panel/modal render it in the summary header. No project storage, renderer, or CSV format change.

### Task 1: Carry validated map context in summaries

- Modify: `src/projects/farm-summary.ts`
- Test: `tests/projects/farm-summary.test.ts`

- [x] Write failing tests for a returned map context and invalid map context values.
- [x] Add exact map-context validation to `createFarmSummary` without changing row-count behavior.
- [x] Run focused tests and typecheck.

### Task 2: Render current map and season in the modal

- Modify: `src/components/farm-summary-panel.tsx`
- Modify: `src/components/farm-summary-modal.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/farm-summary-panel.test.tsx`

- [x] Write failing SSR assertions for display name and season in the modal header.
- [x] Pass current base map context from the page and render a readable map/season line.
- [x] Run focused tests and typecheck.

### Task 3: Verify

- [x] Run `pnpm test --run`, `pnpm typecheck`, and `pnpm build` serially; request independent review if the agent environment permits.
