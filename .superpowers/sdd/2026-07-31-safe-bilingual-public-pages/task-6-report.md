# Task 6 Final SEO Remediation Report

Base commit: `8bd6e1c78a63e165d646f84970766b21bbdc8379`

## TDD red evidence

1. Command:

   ```sh
   pnpm vitest run tests/components/public-page-shell.test.tsx tests/seo/page-metadata.test.ts tests/seo/public-site-url.test.ts tests/routes/static-routes.test.ts
   ```

   Result: exit 1; 5 expected failures out of 17 tests. The Chinese public shell did not contain `使用本地地图、物品和项目规划你的星露谷农场布局。`; all three metadata fixtures failed because the old implementation read the absent `pathname`; and `createCanonicalUrl("/zh/")` did not throw. The static-routes harness performed a real fresh `pnpm build` and its 3 artifact assertions passed, confirming that it exercises the build rather than source text or a mock.

2. Command:

   ```sh
   pnpm typecheck
   ```

   Result: exit 2. The type contract rejected `canonicalPath`, retained required `pathname`, and retained an optional `locale`, which proved the old public metadata boundary did not meet the required API.

## Changed files

- `src/components/chinese-planner-introduction.tsx`: renders the controlled Chinese `plannerDescription` immediately before the existing English editor-language notice.
- `src/seo/page-metadata.ts`: requires `locale` and `canonicalPath`, derives the localized canonical URL, and always emits registry-derived language alternates.
- `src/seo/public-site-url.ts`: rejects non-root trailing-slash canonical paths before URL normalization and includes the received value in the diagnostic.
- `app/page.tsx`
- `app/farm-comparison/page.tsx`
- `app/mods/page.tsx`
- `app/farm/[type]/page.tsx`
- `app/zh/page.tsx`
- `app/zh/farm-comparison/page.tsx`
- `app/zh/mods/page.tsx`
- `app/zh/farm/[type]/page.tsx`

  The eight public route call sites now supply `canonicalPath` with an explicit locale.

- `tests/components/public-page-shell.test.tsx`: verifies exact Chinese description, retained English notice, and visible ordering.
- `tests/seo/page-metadata.test.ts`: verifies the exact TypeScript input contract and locale-derived canonical/language alternates.
- `tests/seo/public-site-url.test.ts`: verifies root remains valid and `/zh/` is rejected with the received value.
- `tests/routes/static-routes.test.ts`: runs a real telemetry-disabled static build in `beforeAll` before inspecting `out`.

No editor, frozen runtime, project, asset, dependency, manifest, privacy, terms, or documentation/ledger paths were changed.

## Green and full verification evidence

1. Focused regression command:

   ```sh
   pnpm vitest run tests/components/public-page-shell.test.tsx tests/seo/page-metadata.test.ts tests/seo/public-site-url.test.ts tests/routes/static-routes.test.ts
   ```

   Result: exit 0; 4 files and 17 tests passed. The static-routes suite completed a fresh real Next static build before assertions.

2. `pnpm typecheck`: exit 0.
3. `NEXT_TELEMETRY_DISABLED=1 pnpm build`: exit 0; all 26 static pages generated.
4. `pnpm test -- --run`: exit 0; 94 files and 646 tests passed. The static-routes suite rebuilt static artifacts successfully during the full run.
5. `git diff --check`: exit 0 before staging and `git diff --cached --check`: exit 0 before commit.

## Review

Two read-only reviews found no actionable correctness, scope, regression, or code-quality findings. They confirmed that all eight metadata call sites migrated, the URL guard executes before normalization, the description order is tested, and the static artifact test performs a real build.

## Commit

`95221caf5fe336512a49176eaece215d68ce945c` — `fix: tighten bilingual public SEO contracts`

## Concerns

No blocking concerns. The static-artifact contract intentionally runs one real build when its test file executes, so that suite has a build-time cost; full-suite execution completed without a race or failure.

---

## Static-export artifact race hardening fix round

Implementation commit: `9f24e60e4a26e665a0e9fdd5a4773b675e96cb45` — `test: serialize static export artifact readers`

### Why the first coordination draft was discarded

The first uncommitted fixture used a workspace-global lock directory and attempted to recover abandoned locks by renaming the contested directory away and, for a newly observed live owner, renaming it back. Review proved that this could break mutual exclusion: another worker could create the canonical lock while it was absent, then the restore could displace that new lock. The fix round removed every lock recovery, rename, restore, and contested-directory deletion path instead of incrementally patching that unsafe design.

The final barrier namespaces append-only coordination state by the SHA-256 workspace identity and the current Vitest parent process ID. A four-file probe under the project's default fork pool verified four distinct worker PIDs (`9782`, `9783`, `9784`, `9785`) with one shared parent PID (`9770`). State from another run namespace is therefore ignored, not recovered or deleted.

### RED evidence

1. Vulnerable owner read and ownerless lock command:

   ```sh
   pnpm vitest run tests/support/static-export-artifact-fixture.test.ts --reporter=verbose
   ```

   Result: exit 1; 2 of 2 focused tests failed against the vulnerable behavior. The ownerless lock process was still waiting after 5 seconds and was terminated by the test timeout. Eight real waiting processes independently failed with `ENOENT` at `readFileSync(.../owner.json)`, proving the `existsSync` then `readFileSync` TOCTOU.

2. Per-run namespace/fail-fast contract command against the workspace-global implementation:

   ```sh
   pnpm vitest run tests/support/static-export-artifact-fixture.test.ts --reporter=verbose
   ```

   Result: exit 1; 2 of 4 tests failed as expected. A legacy/different-run lock blocked for the 5-second test limit, while a same-run ownerless lock was incorrectly ignored and allowed a build. These failures proved both required namespace boundaries before the final implementation.

### Final implementation and tests

- `tests/support/static-export-artifact-fixture.ts`
  - scopes the barrier to `workspace SHA-256 + process.ppid`;
  - publishes immutable lock, ready, and build-failure state without recovering or deleting a contested lock;
  - reads owner metadata directly and treats only transient `ENOENT` as retryable;
  - fails after the 250 ms owner handoff window for missing or invalid same-run owner metadata, including lock path, run identity, and received state;
  - publishes a namespaced failure marker when the one real build fails so peer workers fail promptly instead of waiting 120 seconds.
- `tests/support/static-export-artifact-fixture.test.ts` uses real temporary directories, real child processes, and real `pnpm build` scripts to prove different-run isolation, ownerless and malformed-owner fail-fast diagnostics, ENOENT retry, one successful build across concurrent processes, and one failure invocation delivered to exactly three peer processes.
- The four real artifact readers now enter the same barrier before reading `out/`:
  - `tests/routes/static-routes.test.ts`
  - `tests/routes/sitemap-robots.test.ts`
  - `tests/routes/static-public-pages.test.ts`
  - `tests/reference-runtime/reference-runtime-delivery.test.ts`

No production, editor, frozen asset/runtime, project, package, dependency, or Vitest configuration file changed.

### GREEN and full verification evidence

1. Focused real-process barrier tests:

   ```sh
   pnpm vitest run tests/support/static-export-artifact-fixture.test.ts --reporter=verbose
   ```

   Result: exit 0; 1 file and 6 tests passed.

2. Four actual artifact readers with multiple workers:

   ```sh
   pnpm vitest run tests/routes/static-routes.test.ts tests/routes/sitemap-robots.test.ts tests/routes/static-public-pages.test.ts tests/reference-runtime/reference-runtime-delivery.test.ts --maxWorkers=4 --reporter=verbose
   ```

   Result: exit 0; 4 files and 18 tests passed. The output contained exactly one `next build`; all four readers completed from that artifact set.

3. `pnpm typecheck`: exit 0.
4. `NEXT_TELEMETRY_DISABLED=1 pnpm build`: exit 0; all 26 static pages generated.
5. `pnpm test -- --run`: exit 0; 95 files and 652 tests passed. The full run emitted exactly one artifact build for the four readers.
6. `git diff --check` and `git diff --cached --check`: exit 0.

Two independent final read-only reviews found no remaining actionable correctness, scope, regression, or test-coverage findings after the peer-failure assertion was tightened to require exactly three peer results from the failure marker.

### Concerns

No blocking concerns. The run namespace relies on the project's default Vitest fork workers sharing `process.ppid`; that was verified with four concurrent workers in this fix round. A future test-pool architecture change must revalidate that identity contract. Coordination files are append-only in the operating system temporary directory and are ignored by later run namespaces.
