# Single-item Tint Control Plan

**Goal:** Expose the already-persisted, already-rendered tint on one unlocked placed item, while making imported tint values fail at the placement snapshot boundary instead of later in Pixi rendering.

**Architecture:** `placement-snapshot` owns canonical color validation. `editor-selection-controller` exposes a single-item tint command that replaces one item in a single history commit. `SelectionInspector` only renders a native color input when the selected entity is an item; the page translates its value through the controller. Buildings, crops, variants, and locked-item interaction remain out of scope.

**Constraints:** Canonical stored tint is lowercase `#rrggbb`. An invalid selection key, a non-item selection, a locked item, or a non-canonical color must throw a specific error containing the invalid value. No color mutation may bypass history. Do not add arbitrary palette data, styling systems, or a new persistence field.

### Task 1: Validate canonical tint at the snapshot boundary

- Modify: `src/placement/placement-snapshot.ts`
- Test: `tests/placement/placement-snapshot.test.ts`

- [x] Add failing restore/create tests for uppercase, short, malformed, and non-string tints; preserve valid lowercase colors.
- [x] Replace the generic non-empty string check with a precise lowercase six-digit hex validator.
- [x] Run snapshot tests and typecheck.

### Task 2: Add one history-safe tint command

- Modify: `src/editor/editor-selection-controller.ts`
- Test: `tests/editor/editor-selection-controller.test.ts`

- [x] Add failing tests: a selected unlocked item changes tint with one undo entry; crop/building keys, locked items, and invalid tint fail without history mutation.
- [x] Implement `setSelectedPlacementItemTint` using existing key parsing, snapshot replacement, and `commitPlacementHistory`.
- [x] Extend single-item selection details only as needed to provide current tint to the page.
- [x] Run controller tests and typecheck.

### Task 3: Render and wire the single-item tint input

- Modify: `src/components/selection-inspector.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/selection-inspector.test.tsx`

- [x] Add failing SSR assertions that an item inspector has an accessible native color input and non-item/multiple inspectors do not.
- [x] Wire `onTintChange` only for a single item and route it through the controller. Surface controller validation through existing placement status.
- [x] Run focused component/controller tests and typecheck.

### Task 4: Review and verify

- [x] Request an independent review for data-boundary validation and history semantics; the environment rejected the request with `agent thread limit reached`, so no review findings were available to resolve.
- [x] Run `pnpm test --run`, `pnpm typecheck`, and `pnpm build` serially.
