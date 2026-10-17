# Unify dialog choice and summary buttons

Written against: b861eaf3bf292b926b1ea62348fa798e8f4a32b9. The user selected the recommended lightweight treatment and explicitly said to start. Use built-in subagents, at most five participants including the coordinator. Preserve unrelated concurrent cloud-sync work.

## Evidence chain

- Surfaces: Library's Local projects / Import Game Save / Farm Summary branches; Farm Settings spouse/cave choices; Ambience seasons/weather; inherited View catalog-position and Settings cursor choices; View detailed summary action.
- Problem: these controls retain raised/inset shadows beside the already-flat setting switches. The user supplied three screenshots and requested the same cleanup.
- Owners: `app/globals.css`; `src/components/planner-save-modal-loader.tsx`, `farm-settings-panel.tsx`, `editor-config-panels.tsx`, and `farm-summary-panel.tsx` provide existing markup/state and require no edits.
- Library means `.planner-save-modal-loader__branches`, not item catalog tabs.
- Uncertainty: actual cascade and visual selection must be checked after build at desktop/mobile sizes.

## Design decision

Use flat light surfaces and a subtle thin border for ordinary buttons. Selected choices use existing soft green `--accent-muted` background and a clear green `--accent` border; remove fluorescent Library active fill and all raised/inset shadows for the scoped controls. Preserve circular season controls, existing shapes, dimensions, layouts, labels, icons, focus outlines, disabled handling and every callback. Summary action remains an action, without persistent selected state.

## Reuse

- Existing theme: `--bg-surface`, `--bg-raised`, `--accent-muted`, `--accent`, `--border-subtle`, `--text`.
- Existing `.editor-config-chips`, `.editor-config-segmented`, `.editor-config-seasons`, `.planner-save-modal-loader__branches`, and `.farm-summary-panel > button`.
- No new primitive, TSX, dependency, or tests are necessary.

## Changes and scope

1. Sole permitted product file: `app/globals.css`. Add or adjust narrowly scoped rules for the named families in normal, hover, active, selected and disabled states. Retain existing focus rules and 44px mobile target rules.
2. Inherited consumers explicitly included: View left/bottom catalog selection and Settings system/game cursor selection.
3. Exclude: menu bar, toolbar, catalog categories/items, map picker, popup window/card shadows, modal close icons, unrelated Local/Cloud project actions, auth, storage, migrations, dependencies, commits and deployment. Do not undo prior flat switch-row changes or concurrent edits.

## Validation

- Existing tests: `pnpm exec vitest run tests/components/editor-modal.test.tsx tests/components/editor-shell.test.tsx tests/components/planner-save-modal-loader.test.tsx tests/components/farm-summary-panel.test.tsx tests/components/save-modal-style-contract.test.ts tests/components/editor-modal-content-style-contract.test.ts tests/components/editor-modal-viewport-style-contract.test.ts`.
- `pnpm typecheck`, then `pnpm build`, then `git diff --check`; record exact command output/exit status. No lint script is currently configured. Separate unrelated failures.
- Local ego-browser after build: desktop 1440px and mobile 390px. Check each family has no shadow in normal/active/selected states, selected choices retain a visible soft green fill and green border, focus feedback remains, no horizontal overflow, and switches remain flat.
- Exercise spouse/cave, seasons/weather, all three Library branches, summary opening/closing, cursor/catalog position. Restore original selections after testing; no auth, upload, deletion or external requests.

## Stop conditions

- Stop and report if source changes outside CSS, new dependencies, functional changes, or a conflicting concurrent CSS edit become necessary. Read-only reviewers cannot repair source; route fixes to the sole CSS writer.

## Design documentation

- None beyond this execution plan and validation evidence under `design-plans/`.

## Authorized build-unblocking extension

After the first verification attempt failed, the user explicitly instructed: "把现有构建错误也纳入修复". This supersedes the earlier CSS-only stop condition for the compile errors recorded in `unified-buttons-checks.log`.

- Frontend writer: `src/components/planner-save-modal-content.tsx` import resolution; `tsconfig.json`, optionally `tsconfig.workers.json`, and only typecheck scripts in `package.json` to isolate browser DOM and generated Worker globals while retaining explicit checking of both environments; `tests/auth/planner-auth-client.test.ts` and `tests/cloud-sync/cloud-project-client.test.ts` matcher typings. No dependency changes or generated-type edits.
- Worker writer: `workers/planner-auth.ts` validated binding/type narrowing and accurately inferred auth instance type; `tests/workers/cloud-project-api.test.ts` D1 mock signature. Preserve auth behavior, validation messages and unrelated concurrent edits.
- Verification agent independently reviews isolation/narrowing, reruns both typechecks, relevant existing tests and the full build. Preserve the original failed attempt in the evidence log.
- Browser agent may first test the exact CSS block against the existing healthy static artifact using a temporary page stylesheet; this is explicitly limited CSS evidence. After a successful fresh build, reload and verify the compiled page without injected styles.
- Still prohibited: credentials, remote authentication actions, migrations, database writes, dependency changes, commits, deployment and unrelated behavior changes.

## Authorized homepage arrow-stability extension

The user reported the homepage case-study arrows moving on clicks and explicitly selected "一起修复（推荐）" after reviewing the measured cause and proposed scope.

- Evidence: `design-plans/case-arrow-movement.json` records a 30.594px body-height change pushing both arrows by 15.297px with unchanged scroll/section geometry; hover separately shifts one arrow by -1.6px.
- Outcome: stabilize the copy's layout reservation and arrow position for all three homepage case-study groups in English/Chinese and desktop/mobile. Remove the case-study-only hover lift; retain color feedback, shapes, text/image animations and navigation behavior.
- Sole arrow writer may edit `app/globals.css` only in the case-study region, `src/components/circular-testimonials.tsx` only as needed for stable copy reservation, and `src/components/homepage-case-study-sections.tsx` only for any necessary explicit public opt-in. Preserve other shared-component consumers (Why Choose / Features) and the completed dialog button rules. No guessed fixed maximum height or new dependencies.
- Verification: independent source review, existing relevant CircularTestimonials/case-study tests, both typechecks/build, and fresh-browser measured control coordinates across repeated case transitions and hover at desktop/mobile in both locales. Restore original active case after measurements.

## Final local acceptance

- Independent source reviews found no scoped blocker: `unified-buttons-review.md`, `unified-build-fixes-review.md`, `unified-typecheck-config-review.md`, and `case-arrows-review.md`.
- Final commands passed: both TypeScript programs, 12 focused test files / 91 tests, the complete 68-page production build, and `git diff --check`. Raw outputs and pre/post source hashes are in `case-arrows-checks.log`; the earlier failed build attempt remains in `unified-buttons-checks.log`.
- Fresh browser acceptance used the dedicated static `out` server at `http://127.0.0.1:3007`, with no injected QA stylesheet. Desktop was 1440x1000; mobile was 390x844. The coordinator read the actual JSON, checked the measurements independently, and inspected representative screenshots.
- Dialog evidence: `unified-buttons-desktop-fresh.json` and `unified-buttons-mobile-fresh.json`. Library, spouse/cave, season/weather, catalog-position and cursor choices retain their callbacks and flat selected styles. Temporary selections were restored. A real mobile Tab/Space sample confirmed visible focus and no active-state shadow. Summary details were opened/closed on desktop; mobile sampled the summary action's appearance.
- Carousel evidence: `case-arrows-desktop.json`, `case-arrows-mobile-fresh-en-first.json`, `case-arrows-mobile-fresh-en-rest.json`, and `case-arrows-mobile-fresh-zh.json`. All three groups covered all four cases in English/Chinese at both viewport sizes. The coordinator independently computed 0px movement for both arrows across recorded case changes and hover. Each language/viewport combination also has a roughly 900ms, 109-frame animation sample with 0px control movement. Autoplay behavior remains unchanged; its timing limitation and final default-case reset are recorded explicitly.
- Current product source/config hashes match the successful build. No modified or untracked product source was newer than that build when the coordinator checked. TaskSpace 123 was finished once; result page p1 remains open at `http://127.0.0.1:3007/#farm-cases` and p2 was closed.
- Boundaries: this is local validation, with no deployment, commit or migration performed by this task. The static preview returns HTTP 404 for the cloud-session API. Existing control dimensions were retained: season icons measure 36x44 on mobile, and modal close controls were excluded. This acceptance does not claim every control has a 44x44 hit target.
