# Integration report: house-upgrade-stardew

G integration owner only. This record binds the frozen public handoff to the existing blog registry, hrefs, llms bullets, and 12 copied media files. It does not claim a page PASS, a user final review, or a production deploy.

Recorded after `AssemblyManifest.json` was written. Manifest SHA-256: `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834`. This report does not include its own hash. Owned source, test, llms, and media hashes are the `ownedOutputSha256` object in the manifest.

## What was assembled

Slug `house-upgrade-stardew` is appended once at the end of `blogPostSlugs`. Both locales use the existing `BlogPostMeta` fields only.

| Locale | Identity path | Canonical path | Featured | readTimeMinutes |
|---|---|---|---|---|
| en | `/house-upgrade-stardew/` | `/house-upgrade-stardew` | false | 6 |
| zh-CN | `/zh/house-upgrade-stardew/` | `/zh/house-upgrade-stardew` | false | 6 |

`readTimeMinutes` 6 is the existing integer display value for the 1085-word English length. It is not a publish date and not a new factual claim. Handoff `publishedAt` is null and was not mounted, because `BlogPostMeta` has no date field.

English author and topic are `Stardew Valley Planner Team` and `Stardew Valley Guides`. Chinese author and topic are `星露谷规划器团队` and `星露谷物语指南`. Those values are the handoff `publicRequirements` display fields, and they match the existing registry constants. No ask was required.

Title, description, and cover alt in the registry equal the frozen handoff strings. A direct substring check found each of those six strings exactly once in `src/blog/blog-post-registry.tsx`. Exit code 0.

Counts after the append: slugs 26, canonical paths 32, localized routes 64, indexable routes 62. Latest 6 are `house-upgrade-stardew`, `how-to-harvest-stardew-valley`, `oak-tree-vs-maple-stardew`, `stardew-fruit`, `what-to-grow-in-greenhouse-stardew`, `profit-margin-stardew`. `pine-tree-stardew` leaves that list. Topic carousel page 3 is harvest then house, in canonical order.

Shared route, metadata, CSS, and sitemap source files were not edited. The existing dynamic pages already follow `blogPostSlugs`.

## Handoff binding

| File | SHA-256 | Match to coordinator message |
|---|---|---|
| `handoff/public/en.json` | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` | yes |
| `handoff/public/zh-CN.json` | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` | yes |
| `handoff/freeze-report.md` | `dd9daf7299b339c7527f6870a3a74162344e409e37dac8710ca65bd524b1ee32` | yes |
| `handoff/freeze-checks.log` | `2e3fadbb8b8d32310b075a81afe086da5ebccfa6b87e4e28a68c5ebc69f37a4e` | yes |

English `bodyHash` `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`. English `publicFieldsSha256` `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042`.

Chinese `bodyHash` `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6`. Chinese `publicFieldsSha256` `d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94`.

Public references stay on the handoff: 12 items and 55 quotes in each locale. The manifest stores id, label, url, quote count, the one version note, and the canonical SHA-256 of the `publicReferences` array. Quote text was not copied into the product.

## Article modules

At manifest close both modules existed and exported the agreed names:

- `src/blog/articles/house-upgrade-stardew.en.tsx` exports `HouseUpgradeStardewEnglishArticle`
- `src/blog/articles/house-upgrade-stardew.zh.tsx` exports `HouseUpgradeStardewChineseArticle`

This owner did not edit those files and did not hash them. `outputSha256` is null. No article binding report was present under `docs/blog-ops/house-upgrade-stardew` at this close. The final verification task hashes those modules after the three dependencies are actually finished.

## Media

12 production files were copied with `shutil.copyfile`. Each destination hash and byte size matched the freeze, `cmp -s` exited 0 twelve times, and `sips` exited 0. Every file is 1672×941. WebP format is `webp`. AVIF format is `avif`. No recompress and no redraw.

`public/blog` now has 81 WebP and 81 AVIF. `public/homepage` still has 27 WebP and 27 AVIF. The blog-plus-homepage WebP count is 108. `tests/assets/public-avif-assets.test.ts` still expects 81 and was not edited.

## llms

Two bullets were appended, using the frozen title, description, and canonical URL. `public/llms.txt` still has 0 `stardew-fruit` matches and 2 `house-upgrade-stardew` matches. The missing fruit lines were not repaired. `out/llms.txt` was not rewritten.

## Tests

Updated only the expectations that the append changes:

- slug list, both trailing-slash identity paths, both featured arrays, both cover maps, and the reversed-order error slug
- latest 6, `totalPostCount` 26, carousel page 3
- lengths 32, 64, and 62
- canonical length 32
- removed-page lengths 32, 64, 62, and sitemap `<loc>` 62
- index hrefs: house replaces pine on the English and Chinese blog index

`tests/blog/house-upgrade-stardew-identity.test.tsx` was not created. Existing registry and route tests already lock the slug, localized paths, cover sources, featured flags, and latest-6 membership. Media bytes, dimensions, and formats are bound by the copy hashes and `sips` output in the manifest. A new test that rendered the articles would either repeat body sentences or depend on modules this owner does not hash.

`out/sitemap.xml` still has 60 `<loc>` entries and 0 `house-upgrade-stardew` entries. The updated sitemap assertion stays red until a webpack export. This owner did not build.

## Diff

`git diff --stat` on the tracked edits, exit 0:

```
 public/llms.txt                           |  2 ++
 src/blog/blog-copy.ts                     |  2 ++
 src/blog/blog-post-identities.ts          |  1 +
 src/blog/blog-post-registry.tsx           | 32 +++++++++++++++++++++++++++++++
 tests/blog/blog-home-state.test.ts        |  5 +++--
 tests/blog/blog-post-registry.test.ts     | 15 +++++++++++----
 tests/i18n/public-route-registry.test.ts  |  6 +++---
 tests/routes/blog-routes.test.tsx         |  4 ++--
 tests/routes/removed-public-pages.test.ts |  8 ++++----
 tests/seo/canonical-public-routes.test.ts |  2 +-
 10 files changed, 61 insertions(+), 16 deletions(-)
```

New untracked files are the 12 public media files, this report, and `AssemblyManifest.json`.

## Commands

| Command | Exit |
|---|---:|
| Python handoff SHA check plus 12-file copy | 0 |
| `sips -g pixelWidth -g pixelHeight -g format` on the 12 public files | 0 |
| Python exact title, description, alt, llms, and featured-tail check | 0 |
| `cmp -s` for each of the 12 source/destination pairs | 0 |
| `git diff --stat` on the 10 tracked files | 0 |
| Python read of `out/sitemap.xml` | 0; observed 60 `<loc>`, 0 house URLs |
| Python write of `AssemblyManifest.json` | 0 |

Not run: `pnpm typecheck`, `pnpm build`, `pnpm exec next build --webpack`, Vitest, `pnpm dev`, and the browser. The interface report's eight historical failures were not re-run and their test files were not edited.

## Left for the later verification and review

Webpack export so `out/sitemap.xml` and `out/llms.txt` match the new registry and `public/llms.txt`. Article binding reports must supply the two module hashes. Browser review of both locales is a separate task. This integration does not call the page passed.
