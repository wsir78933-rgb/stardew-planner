# Desktop Planner Side Gutters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add responsive horizontal gutters to the desktop homepage planner while retaining a full-width mobile editor.

**Architecture:** The homepage workspace section remains the only layout boundary. A desktop CSS declaration supplies the responsive inset and the existing mobile media query explicitly resets it to zero. A focused style-contract test guards both viewport rules.

**Tech Stack:** Next.js 16, CSS, Vitest, TypeScript.

## Global Constraints

- Change only the homepage workspace layout and its existing style-contract test.
- Do not modify the frozen reference runtime, map behavior, or the current uncommitted zoom-control work.
- Keep mobile layouts at `max-width: 700px` flush with the viewport.
- Do not create a commit without explicit user authorization.

---

### Task 1: Desktop workspace gutters

**Files:**

- Modify: `tests/homepage/homepage-style-contract.test.ts:37-53`
- Modify: `app/globals.css:291-297`

**Interfaces:**

- Consumes: the `[data-homepage-workspace]` desktop rule and its `@media (max-width: 700px)` mobile override.
- Produces: desktop `padding-inline: clamp(1.25rem, 3vw, 3rem)` and mobile `padding-inline: 0` layout guarantees.

- [ ] **Step 1: Write the failing test**

Replace the desktop assertion with:

```ts
expect(desktopWorkspaceRule).toContain(
  "padding-inline: clamp(1.25rem, 3vw, 3rem);",
);
```

Keep the existing mobile assertion:

```ts
expect(mobileWorkspaceRule).toContain("padding-inline: 0;");
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts`

Expected: FAIL because the desktop workspace still declares `padding-inline: 0`.

- [ ] **Step 3: Write the minimal implementation**

In the desktop `[data-homepage-workspace]` rule in `app/globals.css`, replace:

```css
padding-inline: 0;
```

with:

```css
padding-inline: clamp(1.25rem, 3vw, 3rem);
```

Do not change the existing mobile `padding-inline: 0` declaration.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts`

Expected: PASS.

- [ ] **Step 5: Run project validation and browser acceptance**

Run:

```bash
pnpm typecheck
pnpm build
git diff --check
```

Serve the generated `out/` directory, then inspect `/` at a desktop viewport and `390x844`. Confirm the desktop planner has equal side gutters, the mobile planner is flush with the viewport, neither viewport has horizontal overflow, and the map accepts interaction.

- [ ] **Step 6: Leave changes uncommitted**

Report the changed files and validation results. Do not run `git add` or `git commit` unless the user separately authorizes a commit.
