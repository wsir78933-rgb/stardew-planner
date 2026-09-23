# R-STATIC-PRECHECK: `pine-tree-stardew`

**Run date:** 2026-09-22 (Asia/Shanghai)

**Mode:** read-only static precheck plus this report only. The current EN/ZH article modules, six media files, handoffs, and repaired media receipt were checked without editing source, tests, assets, registry, handoffs, receipt, or generated source. No browser, deployment, commit, push, or external write was performed.

## Executive result

**Static precheck: PARTIAL / BLOCKED for target page assembly.** The two article modules and their six-file media contract pass the focused target-specific probe; the package typecheck passes; and `NEXT_TELEMETRY_DISABLED=1 pnpm build` passes as a repository build. The focused repository Vitest selection is **21/22 tests passed** because `tests/assets/public-avif-assets.test.ts` still asserts a fixed 70-image count while the current public tree contains 73 WebPs, including the three Pine WebPs; this is a stale/count contract failure, not a missing Pine AVIF sibling.

The build is **not** target route/page/static-export readiness evidence: `pine-tree-stardew` remains absent from the identity/copy/registry sources, both handoffs retain unresolved registry metadata, and the build output contains the six Pine media files but no `pine-tree-stardew.html` or `zh/pine-tree-stardew.html`. Do not claim route, page, or target static-export readiness until registry metadata and page binding are explicitly assembled and rechecked.

## 1. Available package scripts

**Command:**

```sh
node -e "const p=require('./package.json'); console.log(JSON.stringify({packageManager:p.packageManager,scripts:p.scripts},null,2))"
```

**Exit code:** `0`

**Observed:** package manager is `pnpm@10.22.0`; available relevant scripts are `typecheck: tsc --noEmit`, `test: vitest`, `pretest: NEXT_TELEMETRY_DISABLED=1 pnpm build`, and `build: next build`. Dependencies and scripts permitted the requested typecheck, focused Vitest runs, and build. There is no lint script.

## 2. Typecheck

**Command:**

```sh
pnpm typecheck
```

**Exit code:** `0`

**Concise output:**

```text
> @ typecheck /Users/wusir/orca/workspaces/stardew planner/博客二
> tsc --noEmit
```

**Result:** PASS for TypeScript compilation. This does not prove registry binding, target route rendering, target static export, browser behavior, or deployment.

## 3. Focused Vitest evidence

### 3.1 Target-specific temporary probe

Because the registry is intentionally unassembled and no committed Pine-specific test exists, an ephemeral test file was created under `/tmp` and removed after the run. It imported both public article functions directly and asserted the public SSR/media contract: `<article><p>` start, no page-level H1, two figures, exact approved figure paths, `loading="lazy"`, `decoding="async"`, `1672×941`, six approved local media files non-empty, and `ftypavif` headers for the three AVIF siblings.

**Command:**

```sh
pnpm exec vitest run --dir /tmp /tmp/pine-static-precheck.test.tsx
```

**Exit code:** `0`

**Concise output:**

```text
✓ ../../../../../../tmp/pine-static-precheck.test.tsx (2 tests)
Test Files  1 passed (1)
Tests  2 passed (2)
PINE_HELPER_ABSOLUTE_REACT_EXIT_CODE=0
```

**Result:** PASS for the direct EN/ZH module and local media contract only. The helper was removed; no repository test file or dependency was added.

### 3.2 Focused existing article/media suites

**Command:**

```sh
pnpm exec vitest run \
  tests/blog/blog-article-content.test.tsx \
  tests/blog/blog-sources.test.tsx \
  tests/assets/blog-cover-images.test.ts \
  tests/assets/public-avif-assets.test.ts
```

**Exit code:** `1`

**Concise output:**

```text
✓ tests/blog/blog-article-content.test.tsx (7 tests)
✓ tests/assets/blog-cover-images.test.ts (11 tests)
✓ tests/blog/blog-sources.test.tsx (2 tests)
❯ tests/assets/public-avif-assets.test.ts (2 tests | 1 failed)
  expected [ …(73) ] to have a length of 70 but got 73
Test Files  1 failed | 3 passed (4)
Tests  1 failed | 21 passed (22)
```

**Failure classification:** `tests/assets/public-avif-assets.test.ts:59` has the fixed assertion `toHaveLength(70)`. A current read-only count found `public_webp_count=73`, exactly three of which are the Pine cover and two Pine figures; the test then does not reach its AVIF-header loop because the count assertion fails. The three Pine WebPs have non-empty AVIF siblings, and the direct target-specific probe passed them. This is a target-introduced stale-count contract failure, not an unrelated baseline failure and not evidence of missing/corrupt Pine media. The test was not changed.

**Coverage boundary:** the three existing repository suites do not import the unregistered Pine modules. The ephemeral target-specific probe above supplies direct module/media coverage; the existing public AVIF suite supplies repository-wide derivative/count coverage. Neither set proves registry/page integration.

The two exploratory external-temp setup attempts before the successful probe were harness-only failures (`No test files found` without `--dir /tmp`, then a `react-dom/server` resolution error outside the project root); they were not product failures, and the helper was corrected to use the project’s absolute `react-dom/server.node.js` path before the successful two-test run. No helper remains.

## 4. Build and generated artifacts

**Command:**

```sh
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

**Exit code:** `0`

**Concise output:**

```text
▲ Next.js 16.3.0 (Turbopack)
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages using 11 workers (54/54)
○ Static prerendered routes
● SSG prerendered article routes
```

The generated route table listed the existing root and `/zh/[slug]` article routes only; no Pine route appeared. Post-build readback found:

```text
out HTML files: 52
out TXT files: 206
Pine target HTML/TXT files: 0
Pine files under out/: only the six approved media files
Pine target references in out/*.html and out/*.txt: none
Pine target route in .next generated manifests: none
```

The build generated a tracked `next-env.d.ts` change. To preserve the precheck boundary, the generated residue was restored with:

```sh
git restore -- next-env.d.ts
```

**Restore exit code:** `0`. Final tracked diff after restoration is empty; the pre-existing untracked EN/ZH modules, six media files, and handoff/receipt/report directory contents were not altered by the build.

## 5. Exact blockers and readiness boundary

- `pine-tree-stardew` is absent from `src/blog/blog-post-identities.ts`, `src/blog/blog-post-registry.tsx`, and the checked copy/route registration sources. The dynamic routes therefore have no registered target slug to enumerate.
- EN handoff remains `status=blocked`, `ready=false`, `frozen=false`, with `author=null`, `featured=null`, and `readTimeMinutes=null`.
- ZH handoff remains `status=blocked`, `ready=false`, `frozen=false`, with `topic=null`, `author=null`, `featured=null`, and `readTimeMinutes=null`.
- Both handoffs retain `page=UNVERIFIED`, explicit `metadataStatus=blocked_missing_public_metadata`, and `userReview=not_started`. These are unresolved inputs, not values to infer in this precheck.
- The focused public AVIF contract has a stale expected count (`70` vs observed `73`) and was intentionally not repaired.
- No target-specific committed test, registry entry, localized page binding, browser evidence, deployment evidence, or production/live-origin evidence exists in this scope.

**Explicit non-claim:** despite the technical build exit code `0`, this report does **not** claim route readiness, page readiness, or target static-export readiness while registry metadata and binding remain unresolved. The successful build proves only that the currently registered application builds and exports its current route set.

## 6. Scope settlement and report verification

Only this file was written by this precheck:

```text
docs/blog-ops/pine-tree-stardew/R-static-precheck.md
```

No source, tests, assets, registry, handoffs, receipt, or other report was repaired. No browser, deploy, commit, push, or external write was performed. The temporary `/tmp/pine-static-precheck.test.tsx` helper was removed after the successful focused run.
