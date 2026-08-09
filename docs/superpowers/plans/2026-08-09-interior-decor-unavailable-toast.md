# Interior Decor Unavailable Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original editor behavior that visibly rejects wallpaper and flooring selection on maps that do not support interior decor, without changing the current editor visual style.

**Architecture:** Keep the map-support decision and exact copy in the existing interior-decor controls module. Keep React state, notification lifetime, and event coordination in `PlannerWorkspace`, and style the existing status element only through the current editor shell variables. No new dependency or reusable notification framework is introduced.

**Tech Stack:** TypeScript, React 19, Next.js 16.3, Vitest, existing CSS in `app/globals.css`.

## Global Constraints

- Work only in the already approved worktree `/private/tmp/stardew-planner-editor-shell.GY9iif/worktree`; do not create another worktree.
- Do not change the current editor visual language. The yellow reference toast is behavior evidence, not a style target.
- Only wallpaper and flooring unavailable feedback is in scope. Do not change catalog content, thumbnails, map data, placement rules, layout, homepage styling, or unrelated notifications.
- Follow high cohesion and low coupling.
- Follow single responsibility: each function does one clear thing; multi-step orchestration stays in the main coordinator while each step remains independent.
- Modules communicate through exported interfaces; do not reach into module internals.
- Follow KISS: use ordinary functions and direct conditionals; do not introduce classes, strategies, or a notification framework.
- Follow Fail Fast: validate boundary inputs, throw specific errors including the rejected value, and never silently catch or suppress errors.
- Follow YAGNI: implement only the confirmed behavior.
- Use precise names; do not introduce variables named `data`, `temp`, `helper`, `util`, or `manager`.
- All subagents must obey these constraints.
- Preserve the two approved unrelated Footer baseline failures without modifying them.

---

### Task 1: Restore unavailable wallpaper and flooring feedback

**Files:**
- Modify: `src/planner/planner-workspace-interior-decor-controls.ts`
- Modify: `src/components/planner-workspace.tsx`
- Modify: `app/globals.css`
- Test: `tests/planner/planner-workspace-interior-decor-controls.test.ts`
- Test: `tests/components/planner-workspace.feature-parity.integration.test.ts`
- Test: `tests/components/planner-workspace-layout.test.tsx`

**Interfaces:**
- Consumes: `isInteriorDecorSupportedMapId(mapId: string): boolean` from `src/interior-decor/interior-decor-catalog.ts`.
- Produces: `getUnavailableInteriorDecorMessage(mapId: string, interiorDecorKind: InteriorDecorKind): string | null`.
- The React coordinator consumes the exported function and keeps using the existing `interiorDecorRejectionMessage` state.

- [ ] **Step 1: Write the failing decision tests**

Add assertions to `tests/planner/planner-workspace-interior-decor-controls.test.ts`:

```ts
expect(getUnavailableInteriorDecorMessage("standard", "wallpaper")).toBe(
  "Wallpaper can only be applied inside.",
);
expect(getUnavailableInteriorDecorMessage("standard", "flooring")).toBe(
  "Flooring can only be applied inside.",
);
expect(getUnavailableInteriorDecorMessage("farmhouse-0", "wallpaper")).toBeNull();
```

- [ ] **Step 2: Run the decision test and verify RED**

Run:

```bash
pnpm exec vitest run tests/planner/planner-workspace-interior-decor-controls.test.ts
```

Expected: FAIL because `getUnavailableInteriorDecorMessage` is not exported.

- [ ] **Step 3: Implement the minimal decision function**

In `src/planner/planner-workspace-interior-decor-controls.ts`, import `isInteriorDecorSupportedMapId`, reuse the existing fail-fast map ID and decor-kind assertions, and implement:

```ts
export function getUnavailableInteriorDecorMessage(
  mapId: string,
  interiorDecorKind: InteriorDecorKind,
): string | null {
  assertMapId(mapId);
  assertInteriorDecorKind(interiorDecorKind);

  if (isInteriorDecorSupportedMapId(mapId)) {
    return null;
  }

  return interiorDecorKind === "wallpaper"
    ? "Wallpaper can only be applied inside."
    : "Flooring can only be applied inside.";
}
```

- [ ] **Step 4: Run the decision test and verify GREEN**

Run the command from Step 2.

Expected: all tests in the file pass.

- [ ] **Step 5: Write failing workspace and style contracts**

Extend `tests/components/planner-workspace.feature-parity.integration.test.ts` to require all of the following in the workspace source:

```ts
getUnavailableInteriorDecorMessage
plannerWorkspaceState.behaviorOptions.showToasts
className="planner-workspace__toast"
window.setTimeout
```

Extend `tests/components/planner-workspace-layout.test.tsx` with a scoped CSS assertion for `.planner-editor-shell .planner-workspace__toast` requiring `position: absolute`, an editor surface background through `var(--bg-raised)`, a border through `var(--border-subtle)`, and a `z-index` above the editor toolbar.

- [ ] **Step 6: Run the workspace contracts and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/planner-workspace.feature-parity.integration.test.ts tests/components/planner-workspace-layout.test.tsx
```

Expected: FAIL because the selection guard, visible toast class, auto-dismiss timer, and scoped CSS do not exist.

- [ ] **Step 7: Wire the selection guard and visible status notification**

In `src/components/planner-workspace.tsx`:

1. Import `getUnavailableInteriorDecorMessage`.
2. When a catalog item maps to an interior-decor pattern, call the function with `plannerWorkspaceState.selectedPlannerMapId` and `interiorDecorPattern.kind` before activating the pattern.
3. If the function returns a message, set `interiorDecorRejectionMessage` only when `plannerWorkspaceState.behaviorOptions.showToasts` is true, then return without activating the pattern.
4. Keep supported interior-map selection on the existing `handleInteriorDecorPatternSelect` path.
5. Add one `useEffect` that clears a non-null rejection message after exactly `3_000` milliseconds and clears the timeout during cleanup.
6. Give the existing `role="status"` element `className="planner-workspace__toast"` and add an `aria-hidden="true"` warning marker containing `!`, so the warning does not rely on color alone and focus does not move.

In `app/globals.css`, add only `.planner-editor-shell`-scoped notification rules. Use existing variables such as `--bg-raised`, `--border-subtle`, `--text`, and existing spacing/radius tokens. Do not copy the yellow reference colors.

- [ ] **Step 8: Run the workspace contracts and verify GREEN**

Run the command from Step 6.

Expected: both test files pass.

- [ ] **Step 9: Run the complete related test set**

Run:

```bash
pnpm exec vitest run tests/planner/planner-workspace-interior-decor-controls.test.ts tests/interior-decor/interior-decor-catalog.test.ts tests/components/planner-workspace.feature-parity.integration.test.ts tests/components/planner-workspace-layout.test.tsx tests/components/planner-workspace.test.tsx tests/components/item-catalog-panel.test.tsx
```

Expected: all selected files pass with no warnings or errors.

- [ ] **Step 10: Commit the implementation**

```bash
git add src/planner/planner-workspace-interior-decor-controls.ts src/components/planner-workspace.tsx app/globals.css tests/planner/planner-workspace-interior-decor-controls.test.ts tests/components/planner-workspace.feature-parity.integration.test.ts tests/components/planner-workspace-layout.test.tsx
git commit -m "fix: explain unavailable interior decor"
```
