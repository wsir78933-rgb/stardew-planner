# Baseline command results and gate classification

Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客-2`
Date: 2026-10-15

`pnpm test` was not used. Its `pretest` script runs `pnpm build` again.

## Commands

| Command | Exit | Result | Log |
|---|---:|---|---|
| `pnpm typecheck` (`tsc --noEmit`) | 0 | pass | `baseline/typecheck.txt` |
| `pnpm build` (`next build`, Turbopack) | 1 | fail | `baseline/build.txt` |
| `pnpm exec next build --webpack` | 0 | pass, 66 static pages | `baseline/build-webpack.txt` |
| `pnpm exec vitest run` on the blog interface set below | 1 | 8 failed, 237 passed, 245 tests; 6 failed files, 45 passed files, 51 files | `baseline/vitest-blog.txt` |

Vitest paths:

- `tests/blog`
- `tests/assets/blog-cover-images.test.ts`
- `tests/assets/public-avif-assets.test.ts`
- `tests/components/public-picture.test.tsx`
- `tests/i18n/public-route-registry.test.ts`
- `tests/seo/canonical-public-routes.test.ts`
- `tests/seo/page-metadata.test.ts`
- `tests/routes/blog-routes.test.tsx`
- `tests/routes/blog-style-contract.test.ts`
- `tests/routes/llms.test.ts`
- `tests/routes/sitemap-robots.test.ts`
- `tests/routes/static-routes.test.ts`
- `tests/routes/removed-public-pages.test.ts`
- `tests/routes/public-route-metadata.test.ts`
- `tests/routes/static-public-pages.test.ts`

Webpack export inventory: `find out -name '*.html'` printed 64. `out/sitemap.xml` has 60 `<loc>` entries. Public WebP count is 75 under `public/blog` plus 27 under `public/homepage`, total 102.

## Gate classes

### Pass, keep as the current gate

`pnpm typecheck` exit 0. A future article assembly must leave this at exit 0.

### Official build cannot run under the authorized symlink

`pnpm build` exit 1. Turbopack reports `Symlink [project]/node_modules is invalid, it points out of the filesystem root`. The authorized environment is one symlink to the main project `node_modules`, and installing dependencies is forbidden. This is an environment gate, not a product defect found in article source.

`pnpm exec next build --webpack` exit 0 is the static export that can be produced here. It is not the `package.json` `build` script. Future assembly in this worktree should use that webpack command unless the symlink constraint changes. Do not edit `package.json` or `next.config.ts` to hide this.

### Historical failures, not modified

These failed on the current checkout before any house-upgrade article exists. This task did not edit the tests or the article source.

1. `tests/assets/public-avif-assets.test.ts`: expected WebP length 81, received 102.
2. `tests/blog/pine-tree-stardew-identity.test.ts`: Chinese body does not contain `本文不发布阶段数字`.
3. `tests/blog/blog-article-content.test.tsx`: same missing Pine Chinese phrase.
4. `tests/blog/blog-sources.test.tsx`: English Pine `blog-sources__checked` text does not match the test string.
5. `tests/routes/llms.test.ts`: `out/llms.txt` does not contain `](https://stardewvalleyplanner.art/stardew-fruit)`. The dumped guide also has no Chinese `stardew-fruit` line. The slug is already in `blogPostSlugs`.
6. `tests/routes/static-public-pages.test.ts`: `/blog` HTML does not contain the expected `how-to-earn-money-stardew` cover. The index renders the reversed latest 6 plus carousel page 1, and that cover is outside both sets.

Two more failures were observed only on the webpack `out/` and were not modified:

7. Homepage section-order assertion in `static-public-pages.test.ts`: received offset 46622, expected it to be greater than 51630.
8. Global 404 stylesheet assertion expects `/_next/static/chunks/*.css`. The webpack 404 HTML uses `/_next/static/css/093fd830753a06af.css`.

Turbopack did not produce an `out/` directory, so these two are not classified as identical to a Turbopack export.

### Currently green tests that a new slug turns red

Appending `house-upgrade-stardew` at the end of `blogPostSlugs`, without the matching edits, fails tests that passed in this run:

- `tests/blog/blog-post-registry.test.ts` exact slug, path, cover, and `featured` arrays.
- `tests/blog/blog-home-state.test.ts` newest 6, `totalPostCount` 25, and carousel page 3.
- `tests/i18n/public-route-registry.test.ts` lengths 31, 62, and 60.
- `tests/seo/canonical-public-routes.test.ts` length 31.
- `tests/routes/removed-public-pages.test.ts` lengths 31, 62, 60, and sitemap `<loc>` count 60.
- `tests/routes/blog-routes.test.tsx` index markup contains `pine-tree-stardew`. After one appended slug, Pine leaves the latest 6 and is not on carousel page 1.

`tests/routes/sitemap-robots.test.ts` derives its count from `getLocalizedIndexablePublicRouteEntries()` and passed. Its hardcoded pathname list is a subset, so the new URL does not require an edit there.

`tests/routes/llms.test.ts` will additionally require both new canonical URLs in `public/llms.txt`. Adding only those lines does not make the file pass while `stardew-fruit` is still absent. That omission is outside this article.
