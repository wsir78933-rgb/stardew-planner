# G2 Page Assembly: `profit-margin-stardew`

Date: 2026-09-23

## Scope and result

Assembled the approved bilingual `profit-margin-stardew` article into the existing Stardew Planner blog without changing routes, shared components, deployment state, commits, pushes, or external services. Both locale identities, copy, registry records, article Server Components, real cover/figure bindings, `llms.txt`, and the listed derived fixtures are present. Target-specific source, typecheck, build, identity/registry/content/media/route checks passed; two existing blog-index assertions and one existing static collection-cover assertion remain unrelated baseline failures and were not changed.

No browser QA was run in G2; the later E-page worker owns local ego-browser verification. No production smoke, live HTTP, CDN, indexing, deployment, commit, push, or external write was run.

## Handoff and media readback

Both PublicBlogHandoff JSON fences were re-read and parsed before source writes. Locked body/source hashes:

- EN locale `en`: `bodyHash=e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22`; `sourceDraftHash=ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa`.
- ZH locale `zh-CN`: `bodyHash=1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881`; `sourceDraftHash=0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`.

Current source-of-truth file hashes:

- `handoff-en.md`: `7166bf4992acfd89f86558633cc9229ed464f35301b2949ee4dc9581887b56fc`
- `handoff-zh.md`: `6e451011d6e3e5347b57d5848a076272a64d1a36b632b591c83906ac93f70570`
- `G0-handoff-media.md`: `4ae75a2f12c6536926eb71b75bbda1a2fd6c64adfdde225562dfbc60ca83841d`

G0 media was read and bound, not modified:

| Asset | Dimensions | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `/blog/profit-margin-stardew-cover.webp` | 1672x941 | 63114 | `1a82f3663672b2562ddb0899f70270b3f2e105257d4ebd7952c14c191c57bd37` |
| `/blog/profit-margin-stardew-cover.avif` | AVIF derivative | 11367 | `3db4b799d15f0e4352e1d7fb4a6f289502693435947ca9feced779bb66d646fd` |
| `/blog/illustrations/profit-margin-stardew-price-boundary.webp` | 1672x941 | 61624 | `aa1de6af629621b2161ceb73c1ab1b24926cb9699d52d0cb869f2fc713d481e6` |
| `/blog/illustrations/profit-margin-stardew-price-boundary.avif` | AVIF derivative | 15942 | `68ee809d4d9a90e48b5c8e4db7a649113d39eb75b5cfe7f80ac9a82863bfe195` |
| `/blog/illustrations/profit-margin-stardew-advanced-options.webp` | 1672x941 | 46466 | `f6d79ba75c190637d73a2768dafc67ecd8a5a05b3a3b5b07df28b62f7f4cc524` |
| `/blog/illustrations/profit-margin-stardew-advanced-options.avif` | AVIF derivative | 12313 | `a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a` |

## Implemented assembly

- Added exact `profit-margin-stardew` identity and paired EN/ZH copy entries in the existing order.
- Added paired registry records with the locked title, description, topic, author, 10-minute read time, `featured: true`, exact cover path/alt, and exact article module exports.
- Added `ProfitMarginStardewEnglishArticle` and `ProfitMarginStardewChineseArticle` as independent Server Components using the existing explicit JSX style. Each starts with the reader body, does not render the page H1/header/cover, binds each figure token exactly once through `PublicPicture`, uses 1672x941 and lazy loading for figures, emits no FAQ section, and uses Article-only page output.
- Added only the verified bilingual public entries to `public/llms.txt`.
- Added the target identity, registry, home-state, direct-reader, source, media, route, canonical, sitemap/robots, static-export, removed-page, and llms assertions listed by the interface contract. `tests/blog/blog-article-content.test.tsx` was left untouched because the existing shared contract required no target-specific fixture.
- Restored unrelated pre-existing collection-cover assertions after verification; the only changes left in `tests/routes/static-public-pages.test.ts` are the two target article fixtures.

## Engineering constraints checked

- **High cohesion / low coupling:** identity, copy, registry metadata, article rendering, media binding, and assertions communicate through existing public exports/types/components; no private state access was added.
- **Single responsibility:** article modules compose named figure/source sections; no unrelated shell or route logic was added.
- **Public interfaces:** existing `PublicPicture`, `BlogSources`, registry, copy, and metadata contracts are used.
- **KISS / YAGNI:** explicit neighboring JSX was used; no markdown runtime, article abstraction, dependency, class, strategy pattern, or future extension point was added.
- **Fail fast:** handoff JSON/body/source/media values were read back and hash-checked before writes; focused tests retain concrete value assertions and no unknown-error swallowing was introduced.
- **Precise names:** locked locale, route, figure, export, metadata, source, and media names are used exactly.
- **Scope preservation:** no app route, shared shell/component, source handoff, G0 report, media file, package file, config, or unrelated dirty file was modified.

## Written paths

- `src/blog/blog-post-identities.ts`
- `src/blog/blog-copy.ts`
- `src/blog/blog-post-registry.tsx`
- `src/blog/articles/profit-margin-stardew.en.tsx`
- `src/blog/articles/profit-margin-stardew.zh.tsx`
- `public/llms.txt`
- `tests/blog/profit-margin-stardew-identity.test.ts`
- `tests/blog/blog-post-registry.test.ts`
- `tests/blog/blog-home-state.test.ts`
- `tests/blog/blog-direct-reader-voice.test.tsx`
- `tests/blog/blog-sources.test.tsx`
- `tests/i18n/public-route-registry.test.ts`
- `tests/seo/canonical-public-routes.test.ts`
- `tests/routes/blog-routes.test.tsx`
- `tests/routes/static-routes.test.ts`
- `tests/routes/static-public-pages.test.ts`
- `tests/routes/removed-public-pages.test.ts`
- `tests/routes/sitemap-robots.test.ts`
- `tests/routes/llms.test.ts`
- `tests/assets/blog-cover-images.test.ts`
- `tests/assets/public-avif-assets.test.ts`
- `docs/blog-ops/profit-margin-stardew/G2-page-assembly.md`

The six G0 media files and all existing handoff/research/review documents were pre-existing source-of-truth files and were not modified. `next-env.d.ts` was regenerated by Next during build and restored to its pre-run content; it is not part of this change.

## Verification evidence

### `pnpm typecheck`

- Exit code: **0**
- Result: `tsc --noEmit` passed.

### Required focused Vitest command

Command:

```sh
pnpm exec vitest run tests/blog/profit-margin-stardew-identity.test.ts tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-direct-reader-voice.test.tsx tests/blog/blog-sources.test.tsx tests/blog/blog-article-content.test.tsx tests/assets/blog-cover-images.test.ts tests/assets/public-avif-assets.test.ts tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts
```

- Exit code: **1**
- Result: **11 files passed, 1 file failed; 90 tests passed, 2 failed (92 total).**
- Target evidence: `profit-margin-stardew-identity.test.ts` passed; registry, home-state, direct-reader, sources, article-content, cover/media, public-route, canonical, metadata, and the target paired article-route case passed.
- Unrelated baseline failures: `tests/routes/blog-routes.test.tsx` existing EN line 53 and ZH line 93 still require `/how-to-earn-money-stardew` and `/zh/how-to-earn-money-stardew` in the current default blog index markup. The current index now renders the target plus its current latest set, but these older assertions are outside the target assembly and were preserved rather than changing page code or unrelated expectations.

### `NEXT_TELEMETRY_DISABLED=1 pnpm build`

- Exit code: **0**
- Result: Next.js 16.3.0 Turbopack compiled successfully, TypeScript completed, static generation completed **56/56**, and the route output listed 20 registered article paths per locale (`[+17 more paths]` under each dynamic route).
- Read-only generated-artifact check also passed: both target HTML files exist, contain Article JSON-LD, contain the target cover and both figures, and contain no FAQPage JSON-LD.

### Required static/export Vitest command

Command:

```sh
pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/removed-public-pages.test.ts
```

- Exit code: **1** after preserving unrelated assertions.
- Result: **4 files passed, 1 file failed; 17 tests passed, 1 failed (18 total).**
- Passing files: `sitemap-robots.test.ts`, `llms.test.ts`, `static-routes.test.ts`, `removed-public-pages.test.ts`.
- Unrelated baseline failure: `tests/routes/static-public-pages.test.ts` existing `/blog` collection expectation at line 2050 requires `/blog/how-to-earn-money-stardew-cover.webp`, which is not in the current generated default blog index. The target article fixtures are present in the allowlisted test file; the baseline collection expectation was not altered.

## Final status

Source assembly, the target-specific focused assertions, and generated target-artifact checks are complete. The static target fixtures are present, but the aggregate static-public-pages test stops at the preserved pre-existing `/blog` collection assertion before reaching those later fixtures; the two focused-suite failures and one static-suite failure are explicitly reported and were not fixed outside the target scope. Production smoke is **UNVERIFIED** by task scope, and browser QA is deferred to E-page.
