# G0 handoff + media verification — `profit-margin-stardew`

**Date:** 2026-09-23 (Asia/Shanghai)
**Scope:** Create the two frozen bilingual PublicBlogHandoff artifacts, six original local public media files, and this audit report only.
**Result:** **PASS for the bounded G0 handoff/media scope.** Page assembly, source/registry integration, tests, build, browser QA, deployment, and external-service state remain **UNVERIFIED** because they were explicitly out of scope.

## 1. Changed files and exact hashes

Only these nine target files were created by this task; no pre-existing target was overwritten:

| File | SHA-256 | Bytes |
|---|---|---:|
| `docs/blog-ops/profit-margin-stardew/handoff-en.md` | `7166bf4992acfd89f86558633cc9229ed464f35301b2949ee4dc9581887b56fc` | 25,375 |
| `docs/blog-ops/profit-margin-stardew/handoff-zh.md` | `6e451011d6e3e5347b57d5848a076272a64d1a36b632b591c83906ac93f70570` | 26,379 |
| `public/blog/profit-margin-stardew-cover.webp` | `1a82f3663672b2562ddb0899f70270b3f2e105257d4ebd7952c14c191c57bd37` | 63,114 |
| `public/blog/profit-margin-stardew-cover.avif` | `3db4b799d15f0e4352e1d7fb4a6f289502693435947ca9feced779bb66d646fd` | 11,367 |
| `public/blog/illustrations/profit-margin-stardew-price-boundary.webp` | `aa1de6af629621b2161ceb73c1ab1b24926cb9699d52d0cb869f2fc713d481e6` | 61,624 |
| `public/blog/illustrations/profit-margin-stardew-price-boundary.avif` | `68ee809d4d9a90e48b5c8e4db7a649113d39eb75b5cfe7f80ac9a82863bfe195` | 15,942 |
| `public/blog/illustrations/profit-margin-stardew-advanced-options.webp` | `f6d79ba75c190637d73a2768dafc67ecd8a5a05b3a3b5b07df28b62f7f4cc524` | 46,466 |
| `public/blog/illustrations/profit-margin-stardew-advanced-options.avif` | `a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a` | 12,313 |
| `docs/blog-ops/profit-margin-stardew/G0-handoff-media.md` | post-write hash recorded by the final worker readback | — |

The exact current C source hashes are also bound in both handoffs and were recomputed:

- C-en raw SHA-256: `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa`
- C-zh raw SHA-256: `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`

## 2. Reader-body derivation and locked SEO

The reader body was derived independently from each exact C byte stream by removing only the first standalone Markdown H1 line and its immediately following blank line:

| Locale | Removed prefix | C raw bytes | Reader body bytes | Body SHA-256 | NFC/UTF-8/LF |
|---|---:|---:|---:|---|---|
| `en` | 78 bytes | 14,604 | 14,526 | `e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22` | PASS |
| `zh-CN` | 92 bytes | 12,434 | 12,342 | `1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881` | PASS |

The serialized `body` values preserve every remaining byte, Markdown link, source block, figure token, alt/caption text, whitespace, and trailing LF. Both bodies contain no page-level H1; each handoff `bodyHash` matches the UTF-8 serialized reader body bytes.

Locked public SEO values are exact:

- EN title/H1: `Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change`
- EN description: `Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.`
- ZH title/H1: `Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选`
- ZH description: `Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。`

Metadata conventions are bound to the existing project shape: `en` / `US`, `zh-CN` / `CN`, routes `/profit-margin-stardew` and `/zh/profit-margin-stardew`, topic `Stardew Valley Guides` / `星露谷物语指南`, author `Stardew Valley Planner Team` / `星露谷规划器团队`, `readTimeMinutes: 10`, `featured: true`, and module exports `ProfitMarginStardewEnglishArticle` / `ProfitMarginStardewChineseArticle`. The 10-minute value is a bounded registry-style estimate from the 2,091 EN and 2,295 zh-CN mechanical units and the neighboring existing article minute ranges; it is not a claim about page runtime.

Both JSON objects explicitly require Article schema, set `doNotEmitFAQPage: true`, set `titleEqualsH1: true`, forbid a second article-module H1, preserve visible Sources from the locked body, set FAQ to `null` because neither C body contains an FAQ section, preserve the existing planner CTA/internal link, and bind each figure token exactly once.

## 3. Public references and clean-field scan

Public references were limited to the public source links and source-backed statements already present in the approved C body/Sources block:

- EN: Stardew Valley Wiki Options and Multiplayer; 2 public references.
- ZH: Chinese Options, English Options, Multiplayer — Profit margins, and Getting Started; 4 public references.
- Every `appliesTo.quote` was checked as an exact body substring with occurrence `1`.
- No research snapshot, prompt, internal path, worker/dispatch/task ID, local URL, credential, or internal provenance was placed in `body`, `seo`, `publicReferences`, or `publicRequirements`.
- Public marker scan result for both handoffs: `marker_hits=0`.

## 4. Original local media and actual metadata

All three images are original controlled artwork drawn locally with a small Pillow drawing program, then encoded with installed `cwebp` and `ffmpeg`/`libaom-av1`. No generated-image service, web copy, screenshot, or invented game UI was used.

| Asset role | Public URL / working file | WebP bytes | AVIF bytes | Dimensions | WebP codec | Budget |
|---|---|---:|---:|---|---|---|
| Cover | `/blog/profit-margin-stardew-cover.webp` / `public/blog/profit-margin-stardew-cover.webp` | 63,114 | 11,367 | 1672×941 | Lossy VP8, `Chunk VP8` | ≤1.25 MiB |
| Figure 1 `fig-01-price-boundary` | `/blog/illustrations/profit-margin-stardew-price-boundary.webp` / `public/blog/illustrations/profit-margin-stardew-price-boundary.webp` | 61,624 | 15,942 | 1672×941 | Lossy VP8, `Chunk VP8` | ≤400 KiB |
| Figure 2 `fig-02-advanced-options-path` | `/blog/illustrations/profit-margin-stardew-advanced-options.webp` / `public/blog/illustrations/profit-margin-stardew-advanced-options.webp` | 46,466 | 12,313 | 1672×941 | Lossy VP8, `Chunk VP8` | ≤400 KiB |

The cover shows an original outdoor field with cranberry rows, pumpkins, grape trellis, farm building, path, and watering can. Figure 1 shows only the supported affected-versus-fixed categories plus Wheat `25g -> 6g at 25%` and Willy's Crab Pots `1,500g`. Figure 2 is a platform-neutral five-step schematic: `New Game` → wrench / `Advanced Options` → `Profit Margin` → `Normal / 100%`, `75%`, `50%`, `25%` → `Create Farm`.

Each handoff contains localized alt/caption text, placement, `loading: lazy`, dimensions, public URL, public working file, role, and `original_local_artwork` rights status. Each WebP has an exact same-stem AVIF sibling.

## 5. Verification ledger with real exit codes

| Check | Command / actual result | Exit | Status |
|---|---|---:|---|
| Repository and local Next instructions | Read `AGENTS.md`, local Next `AGENTS.md`, relevant `next/dist/docs` index/images guide, project interface spec, V7 workflow docs, current C/D/E/F artifacts, and existing handoff examples | 0 | PASS |
| Pre-write target boundary | Python existence check over the 3 report/handoff paths and 6 media paths; all reported `ABSENT` | 0 | PASS |
| C hash recomputation | `shasum -a 256 ...` was unavailable in this checkout (`command not found`) | 127 | BLOCKED for that command only; no output was written |
| C hash recomputation fallback | `sha256sum C-en-draft.md C-zh-draft.md` returned the exact locked hashes above | 0 | PASS |
| Local artwork generation | `python3 /tmp/profit_margin_stardew_media.py` generated three 1672×941 PNG originals | 0 | PASS |
| WebP/AVIF encoding | `cwebp -quiet -preset picture -q 86 -m 6 -sharp_yuv ...`; `ffmpeg ... -c:v libaom-av1 -still-picture 1 ...` for all three stems | 0 | PASS |
| Temporary media contract check | Python dimensions/non-empty/budget check, `webpinfo`, `file`, and `ffprobe` checks | 0 | PASS |
| Exclusive publish | Python no-clobber hard-link publish for exactly eight handoff/media files; target report was still absent | 0 | PASS |
| Published JSON check | Python JSON parse, exact body hash/byte length, no H1, reference quote occurrence, figure-token binding, Article/not-FAQ, and public marker scan | 0 | PASS; EN refs=2, ZH refs=4, two figures each, marker hits=0 |
| Published media check | Python metadata/budget check; `webpinfo` reported `Chunk VP8`, `Format: Lossy (1)`, 1672×941; `ffprobe` reported AV1 and 1672×941 for each AVIF | 0 | PASS |
| Handoff file hygiene | Python strict UTF-8/NFC/LF/no BOM/no NUL/no trailing whitespace/trailing LF check | 0 | PASS |
| Tracked source diff | `git diff --name-only` returned no output | 0 | PASS |
| Target status readback | `git status --short --untracked-files=all -- <eight handoff/media paths>` returned exactly the eight expected `??` paths | 0 | PASS |

No page build, typecheck, Vitest, browser QA, local server, live HTTP, deployment, registry/source edit, package/config edit, external service write, commit, or Git history operation was run.

## 6. Engineering constraints explicitly checked

- **High cohesion / low coupling:** artwork generation, WebP/AVIF encoding, handoff serialization, reference validation, and media validation were separate command responsibilities communicating through public file paths and JSON fields; no private module state was shared.
- **Single responsibility:** each generation/encoding/serialization/validation step had one clear job; the top-level flow only orchestrated those steps.
- **Public interfaces:** handoffs use the existing `PublicBlogHandoff` JSON shape, public source URLs, public asset URLs, and existing module/path conventions; no internal state was exposed.
- **KISS:** Pillow plus already-installed `cwebp`/`ffmpeg` were used; no classes, plugins, new dependency, package-file edit, or speculative abstraction was added.
- **Fail Fast:** target existence, source hashes, exact body derivation, source quote occurrence, marker scan, dimensions, codec, sibling, and byte-budget checks fail on the concrete offending value.
- **YAGNI / precise names:** only the requested slug-specific artifacts and exact named assets were created; no generic helper, future abstraction, or unrelated refactor was added.
- **Scope-out handling:** page assembly, registry, article modules, tests, build, browser QA, deployment, and external state were left untouched and are reported as UNVERIFIED rather than inferred complete.

## 7. Truthful acceptance matrix

| Gate | Result | Evidence / remaining boundary |
|---|---|---|
| Bilingual handoffs parse as valid JSON | **PASS** | Both Markdown-plus-JSON artifacts parse successfully. |
| Body derivation, bodyHash, length, NFC/UTF-8/LF | **PASS** | Exact reader-body bytes and hashes are recorded above. |
| Locked SEO, locale, route, metadata conventions | **PASS** | F title/description and current registry/project conventions are bound. |
| Article schema / no FAQPage / single H1 contract | **PASS** | Explicit JSON fields and no body H1. |
| Public references | **PASS** | Four EN/ZH source links total by locale; exact quote checks pass. |
| Figure token bindings | **PASS** | Each of `fig-01-price-boundary` and `fig-02-advanced-options-path` occurs once per body and maps to exactly one figure. |
| WebP/AVIF media contract | **PASS** | Six non-empty files, exact dimensions, lossy VP8 WebP, AVIF siblings, byte limits. |
| Original local artwork / rights status | **PASS** | Locally drawn controlled artwork; no screenshot, copied web asset, generated-image service, or invented UI. |
| Public internal-marker scan | **PASS** | Zero hits in public body/SEO/references/requirements values. |
| No overwrite / write boundary | **PASS** | All concrete targets absent before exclusive publish; no tracked source/app/config changes. |
| Page assembly / registry / tests / build / browser / deployment | **UNVERIFIED** | Explicitly not run and not changed in this G0 task. |
| External service or production state | **UNVERIFIED** | No external write or live-state claim was made. |

**Final G0 status:** **PASS** for the approved handoff and media artifact scope; downstream page assembly must re-read both handoffs and all six public assets before any later source write.

No page source, registry, tests, configuration, deployment, or external service was changed.
