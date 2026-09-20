# G-assembly — how-to-level-up-farming-stardew

Role: Agent G (page assembly). Not A–F, not E page review, not user final review, not production publish.

Locked slug: `how-to-level-up-farming-stardew`  
Locales: EN `/how-to-level-up-farming-stardew`, ZH `/zh/how-to-level-up-farming-stardew`  
Identity index: 18th, appended after `do-you-have-to-water-trees-stardew`.

## Local URLs (this machine)

- `http://127.0.0.1:3003/how-to-level-up-farming-stardew`
- `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew`

Dev: reused `scripts/dev.sh` port **3003**. The previous listener still served a 404 for the new slug (`dynamicParams = false` + stale `generateStaticParams`), so G restarted `pnpm dev`. After Ready:

| URL | HTTP |
|---|---|
| EN article | **200** |
| ZH article | **200** |
| Cover webp | **200** |
| EN fig1 / fig2 webp | **200** |
| ZH fig1 / fig2 / fig3 webp | **200** |

EN HTML contains locked Title/H1, both body figures, and the hoe/watering-can sentence. ZH HTML contains locked Title/H1, three body figures, on-page FAQ H2, and the 锄头/喷壶 sentence. `"FAQPage"` is absent on both. JSON-LD stays Article.

## Figure bindings

Shared cover (both registry locales point at the same file; alts describe this picture):

| Role | Public path | Binding |
|---|---|---|
| Cover | `/blog/how-to-level-up-farming-stardew-cover.webp` | Registry `coverImage.src` EN + ZH. Watercolor farmer pulling a leafy root crop from a stone-edged bed; drawn circular Farming sprout badge; farmhouse behind. No XP numbers, no fake skills tab. |
| EN fig1 | `/blog/illustrations/farming-xp-source-map.webp` | EN lock image after the first-product paragraph. |
| EN fig2 | `/blog/illustrations/farming-xp-first-product-only.webp` | EN lock image under extra potatoes/blueberries/cranberries. |
| ZH fig1 | `/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp` | ZH lock 加/不加对照. |
| ZH fig2 | `/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp` | ZH lock 一次多收只算第一个. |
| ZH fig3 | `/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp` | ZH lock 1–10 累计梯子. |

All listed webp files are VP8 (`RIFF` / `WEBP` / `VP8 `), 1672×941. Illustration byte counts are under 400 KiB; cover is 194,474 bytes (under 1.25 MiB). AVIF siblings exist for `public/blog` opacity tests (count 58 → 64).

HTML sources for the numbered diagrams (not public pages): `docs/blog-ops/how-to-level-up-farming-stardew/diagram-src/`.

## Files created

- `src/blog/articles/how-to-level-up-farming-stardew.en.tsx` → `HowToLevelUpFarmingStardewEnglishArticle` (Sources, no FAQ H2)
- `src/blog/articles/how-to-level-up-farming-stardew.zh.tsx` → `HowToLevelUpFarmingStardewChineseArticle` (FAQ + 来源)
- `public/blog/how-to-level-up-farming-stardew-cover.webp` (+ `.avif`)
- `public/blog/illustrations/farming-xp-source-map.webp` (+ `.avif`)
- `public/blog/illustrations/farming-xp-first-product-only.webp` (+ `.avif`)
- `public/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp` (+ `.avif`)
- `public/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp` (+ `.avif`)
- `public/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp` (+ `.avif`)
- `tests/blog/how-to-level-up-farming-stardew-identity.test.ts`
- `docs/blog-ops/how-to-level-up-farming-stardew/G-assembly.md`
- `docs/blog-ops/how-to-level-up-farming-stardew/diagram-src/*`

## Files edited

- `src/blog/blog-post-identities.ts` — append slug
- `src/blog/blog-copy.ts` — both locale paths
- `src/blog/blog-post-registry.tsx` — imports + EN/ZH entries after water-trees. Title/description from frozen handoff seo. Author `Stardew Valley Planner Team` / `星露谷规划器团队`. topic Guides. featured true. readTimeMinutes 16 EN / 14 ZH.
- `public/llms.txt` — EN + ZH bullets (title + description, production URLs)
- Tests recounted from live 17-slug world → 18: registry, home-state, public-route-registry, canonical-public-routes, sitemap-robots, removed-public-pages, llms, blog-cover-images, public-avif-assets, blog-direct-reader-voice, blog-sources, blog-routes, static-public-pages, static-routes

Did not edit `app/(en)/[slug]/page.tsx` or `app/zh/[slug]/page.tsx`. Did not overwrite other slugs.

Live numeric world after append:

| Quantity | After |
|---|---|
| `blogPostSlugs` | 18 |
| `blogPostCanonicalPaths` | 36 |
| `canonicalPublicPaths` | 24 |
| localized public entries | 48 |
| indexable / sitemap `<loc>` after a future export | 46 |

## Verification stdout

### `pnpm typecheck` (exit 0)

```
> @ typecheck /Users/wusir/Desktop/开发项目集合/stardew planner
> tsc --noEmit
```

No typecheck diagnostics.

### Targeted vitest, no pretest build (exit 0)

```
pnpm exec vitest run \
  tests/blog/how-to-level-up-farming-stardew-identity.test.ts \
  tests/blog/blog-post-registry.test.ts \
  tests/blog/blog-home-state.test.ts \
  tests/blog/blog-direct-reader-voice.test.tsx \
  tests/blog/blog-sources.test.tsx \
  tests/assets/blog-cover-images.test.ts \
  tests/assets/public-avif-assets.test.ts \
  tests/i18n/public-route-registry.test.ts \
  tests/seo/canonical-public-routes.test.ts \
  tests/routes/blog-routes.test.tsx \
  tests/routes/public-route-metadata.test.ts

 Test Files  11 passed (11)
      Tests  79 passed (79)
```

### `llms.test.ts`

Copied `public/llms.txt` → `out/llms.txt` (same copy static export would make) then:

```
pnpm exec vitest run tests/routes/llms.test.ts

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

### Local curl (after `pnpm dev` restart on 3003)

```
EN article status=200
ZH article status=200
200 cover
200 fig1-en
200 fig2-en
200 fig1-zh
200 fig2-zh
200 fig3-zh
```

Did **not** run `pnpm test` (pretest always `next build`). Did **not** run a full `NEXT_TELEMETRY_DISABLED=1 pnpm build`, so `out/sitemap.xml` and `out/*.html` still reflect the previous 17-slug export.

## Remaining risks

- E desktop/mobile page review and user final review are not done. This report does not claim they passed.
- Production is not published. Canonical public URLs exist only after a later deploy.
- `out/sitemap.xml`, `out/how-to-level-up-farming-stardew.html`, and `out/zh/how-to-level-up-farming-stardew.html` are stale until the next `next build`. Tests that read those files (`sitemap-robots`, `static-routes`, `static-public-pages`, `removed-public-pages` sitemap loc count) were updated in source but not re-run against a fresh export.
- `tests/routes/static-routes.test.ts` still omits `do-you-have-to-water-trees-stardew.html` (pre-existing). G only appended the new farming HTML names.
- Cover is one shared EN watercolor for both locales. Registry alts describe that picture; ZH does not have a separate cover file.
- `BlogSources` still injects the existing planner CTA component. No extra planner CTA copy was added to the locked bodies.
