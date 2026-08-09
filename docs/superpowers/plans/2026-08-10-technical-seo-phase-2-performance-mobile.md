# Technical SEO Phase 2: Performance and Mobile Implementation Plan

> Status: approved for direct workspace execution. Do not stage, commit, push, deploy, install dependencies, or modify Cloudflare.

## Goal

Fix only the audit-visible mobile issues that were reproduced in the current production build:

- prevent the mobile catalog from switching the canvas layout after first paint;
- enlarge the currently visible coarse-pointer controls to at least 44 by 44 CSS pixels without enlarging their icons;
- test a reusable early `pixi.js` import and retain it only if three mobile Fast 4G cold samples meet the existing 2500 ms median threshold.

The conditional joystick controls, currently clipped Search/Filter/Help controls, blog content, analytics, image strategy, and Cloudflare configuration are out of scope. The user confirmed that the clipped controls must remain unchanged rather than being exposed as incomplete UI.

## Task 1: Guard the Pixi preload experiment with tests and a measured keep/remove gate

Files:

- Modify: `src/components/react-planner-host.tsx`
- Modify: `tests/components/react-planner-host.test.tsx`

Steps:

1. Add a focused failing unit test that requires one injected Pixi import call and a reusable importer returning the same Promise.
2. Run only `tests/components/react-planner-host.test.tsx` and record the expected failure.
3. Add the smallest named function that starts the import once and exposes the same Promise to the existing bootstrap interface.
4. Start that import immediately after `editor:island-mounted` and pass it through `createBrowserPlannerWorkspaceBootstrap({ importPixi })`.
5. Re-run the focused test and typecheck.
6. Build and run three mobile Fast 4G cold samples with `scripts/measure-editor-performance.mjs`.
7. Keep the production change only when the median interactive duration is at most 2500 ms and all samples contain the required performance marks. Otherwise revert only this experiment and keep its diagnostic result out of production.

## Task 2: Stabilize the first mobile layout and enlarge visible touch targets

Files:

- Modify: `app/globals.css`
- Modify: `tests/components/planner-workspace-layout.test.tsx`

Steps:

1. Add failing CSS contract tests for the mobile layout's unconditional final canvas flow.
2. Add failing CSS contract tests for 44 px menu/tool, catalog tab, Rotate, and Flip targets under coarse pointer plus 640 px or narrower.
3. Include a contract for shifting the toolbar away from the menu and mirroring that placement in left-hand mode.
4. Run only `tests/components/planner-workspace-layout.test.tsx` and record the expected failures.
5. In the existing mobile rule, apply the final column flow directly to the canvas area and canvas so the later catalog mount does not change the parent layout.
6. Add one narrow coarse-and-mobile rule for the audited visible targets. Preserve icon dimensions, labels, component behavior, and conditional visibility.
7. Re-run the focused test.
8. In a production build at 390 by 844 with touch/coarse emulation, verify:
   - CLS is at most 0.1;
   - each audited visible target is at least 44 by 44 CSS pixels;
   - toolbar, menu, tabs, and Rotate/Flip targets do not overlap within their groups;
   - the planner has no horizontal overflow;
   - the default controls remain clickable.

## Task 3: Final regression and independent review

1. Run focused Phase 2 tests.
2. Run `pnpm typecheck`.
3. Run `NEXT_TELEMETRY_DISABLED=1 pnpm build` and restore the repository-owned `next-env.d.ts` value if Next rewrites it.
4. Run the full Vitest suite with `--no-file-parallelism`.
5. Run `git diff --check`.
6. Re-run the local mobile performance and touch audits against the final build.
7. Request an independent review limited to the approved Phase 2 files and verify any finding before changing code.
8. Report the remaining production Cloudflare smoke failure separately; do not treat an external configuration failure as a repository regression.
