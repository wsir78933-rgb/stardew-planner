# Baseline comparison: house-upgrade-stardew

Comparison date: 2026-10-16. Worktree HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`.

The 8-item list is the 2026-10-15 interface Vitest log at `interface/baseline/vitest-blog.txt` and `interface/baseline/classification.md`. A failure is called the same historical failure only when the test name and the assertion text match that log. The WebP received count is the one predicted numeric change.

## Gates

| Gate | Baseline | This run | Exit |
|---|---|---|---:|
| `pnpm typecheck` | exit 0 | exit 0 | 0 |
| `pnpm build` (Turbopack) | exit 1, symlink | not re-run | — |
| `pnpm exec next build --webpack` | exit 0, 66 static pages, 64 HTML, sitemap 60 | exit 0, 68 static pages, 66 HTML, sitemap 62 | 0 |
| Interface Vitest set | 8 failed, 237 passed, 245 tests; 6 failed files, 45 passed, 51 files | 8 failed, 237 passed, 245 tests; 6 failed files, 45 passed, 51 files | 1 |
| Full `pnpm exec vitest run` | not in that baseline | 12 failed, 2478 passed, 2490 tests; 9 failed files, 250 passed, 259 files | 1 |

`pnpm test` was not used. `pretest` still runs `pnpm build`.

## The 8 historical interface failures

| # | Test | Baseline assertion | This run | Classification |
|---|---|---|---|---|
| 1 | `tests/assets/public-avif-assets.test.ts` provides AVIF derivatives | expected length 81, received 102 | expected length 81, received 108 | Same assertion. Received count rose by 6, matching the 6 new WebP files (blog 81 + homepage 27 = 108). Not edited and not a pass. |
| 2 | `tests/blog/blog-article-content.test.tsx` Pine guides | Chinese markup does not contain `本文不发布阶段数字` | same missing phrase | Historical. Pine files were not edited. |
| 3 | `tests/blog/blog-sources.test.tsx` source order | English Pine `blog-sources__checked` text does not match the test string | same expected checked label, received the current Pine sentence | Historical. |
| 4 | `tests/blog/pine-tree-stardew-identity.test.ts` | Chinese markup does not contain `本文不发布阶段数字` | same missing phrase | Historical. |
| 5 | `tests/routes/llms.test.ts` | `out/llms.txt` does not contain `](https://stardewvalleyplanner.art/stardew-fruit)` | same missing fruit URL | Historical. Both house-upgrade bullets are present. Fruit lines were not added. |
| 6 | `tests/routes/static-public-pages.test.ts` blog covers | `/blog` has no `how-to-earn-money-stardew-cover.webp` | same missing cover | Historical. |
| 7 | Same file, homepage section order | received offset 46622, expected greater than 51630 | same numbers, 46622 and 51630 | Historical. |
| 8 | Same file, 404 stylesheet | expects `/_next/static/chunks/*.css`; webpack 404 uses `/_next/static/css/093fd830753a06af.css` | same expected regex; received HTML uses that same CSS path | Historical. |

The six updated tests passed inside that set: `blog-post-registry` 20, `blog-home-state` 18, `public-route-registry` 4, `canonical-public-routes` 1, `removed-public-pages` 3, `blog-routes` 19. `blog-planner-cta` 8 also passed. No identity test file exists.

## Full-suite failures outside the 8

These four are not in the 2026-10-15 interface log. They are not classified as that baseline, and they were not fixed.

| Test | Assertion |
|---|---|
| `tests/catalog/catalog-loader.test.ts` | `building:Building 0` received an extra `allowedTools` value `fill` |
| `tests/resources/local-planner-resource-smoke.test.ts` | timed out in 5000ms |
| `docs/blog-ops/how-to-harvest-stardew-valley/verification/assembly/render-reader-text.test.tsx` English | rendered reader text is not the approved harvest handoff text |
| Same file, Chinese | rendered reader text is not the approved harvest handoff text |

None of those assertions name `house-upgrade-stardew`. This task did not edit those files.
