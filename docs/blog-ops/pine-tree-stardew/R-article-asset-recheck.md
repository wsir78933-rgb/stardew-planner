# R-ARTICLE-ASSET-RECHECK: `pine-tree-stardew`

**Review date:** 2026-09-22 (Asia/Shanghai)

**Mode:** independent read-only post-repair review plus this report only. I reread both article modules, both refreshed handoffs, both locked bodies, `G-assets-receipt.md`, `R-article-modules-review.md`, and `R-media-review.md`; I did not modify any of those inputs, source, registry, identities, copy, tests, assets, build output, or external state.

## Executive verdict

**Source/body/media/receipt acceptance: PASS. Page-assembly acceptance: BLOCKED / UNVERIFIED.** The two ZH findings recorded by the prior module review are fixed: the rendered ZH body now preserves the required ordinary space after the bold chain, and the refreshed ZH handoff/module source item now uses `/zh/stardew-valley-trees`. Both modules pass the canonical body/link comparison, handoff/source-label alignment, media binding, FAQ absence, locale CTA, API, and residue checks; the focused public-AVIF test still fails its pre-existing fixed-count assertion (`expected 70`, observed `73`) and was not changed.

The EN and ZH handoffs remain intentionally `blocked` with `ready: false` and `frozen: false`. Registry identity/page binding is absent, target HTML is absent, build/browser/deployment were not run in this recheck, and both handoffs retain explicit metadata and user-review blockers; no page-ready, production, deployment, or user-approval claim is made.

## Per-file verdict and current raw SHA-256

| File | Verdict | Current SHA-256 | Current result / boundary |
|---|---|---|---|
| `src/blog/articles/pine-tree-stardew.en.tsx` | **PASS** | `5b61738990dac239d34eb3d7898270929ae6c47ccacb2e9168923a4d6e233bc7` | Canonical body/link, source labels, figures, SSR/API, CTA, FAQ, and residue checks pass; page/registry binding remains unverified. |
| `src/blog/articles/pine-tree-stardew.zh.tsx` | **PASS** | `27bbf27a39f964f7d4c83fc28bf620d12faecf028e310f4cb55262fc646508fe` | Both prior ZH findings are fixed; canonical body/link, source labels, figures, SSR/API, CTA, FAQ, and residue checks pass; page/registry binding remains unverified. |
| `docs/blog-ops/pine-tree-stardew/locked/en-body.txt` | **PASS** | `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1` | Exact handoff body/hash/byte/line binding. No FAQ. |
| `docs/blog-ops/pine-tree-stardew/locked/zh-body.txt` | **PASS** | `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690` | Exact handoff body/hash/byte/line binding. No FAQ. |
| `docs/blog-ops/pine-tree-stardew/handoff-en.md` | **PASS, blocked state retained** | `af5db7ad2849f24cd452b22d9f9db85a25efc0234d950b4ba3be205dbf437deb` | Body, sources, route contract, media receipt, and integrity fields are consistent; unresolved registry/page/build/browser/deploy/user-review blockers remain explicit. |
| `docs/blog-ops/pine-tree-stardew/handoff-zh.md` | **PASS, blocked state retained** | `59b41b44adc9c0c2bc90d6f2fb94e4a495d076f06e8799e2af784585f11cab66` | Body, sources, repaired `/zh/stardew-valley-trees` item, route contract, media receipt, and integrity fields are consistent; unresolved registry/page/build/browser/deploy/user-review blockers remain explicit. |
| `docs/blog-ops/pine-tree-stardew/G-assets-receipt.md` | **PASS_LOCAL_RECEIPT** | `05aa4119c97c658ee8480159e5d05633b8331a190b4fdb69256e5b9d27e975c1` | Current six-file table, localized cover-alt binding, bytes, hashes, dimensions, formats, and status agree with both handoffs and actual files. |
| `docs/blog-ops/pine-tree-stardew/R-article-modules-review.md` | **UNVERIFIED as current state** | `b7fa690b45a8eaba230d956e274d907909a7fa45af61b84ab7fd03919062d7aa` | Historical prior review; its two ZH failures are rechecked below and are now fixed. |
| `docs/blog-ops/pine-tree-stardew/R-media-review.md` | **UNVERIFIED as current state** | `568b0306ad357b300e69c6af45b154001edf5b9986860b35a68601d4cbb4e130` | Historical prior review; its receipt-drift note predates the current repaired receipt and is not reused as current evidence. |

## 1. Canonical EN/ZH body and ordered-link comparison

**Command:** read-only `pnpm exec tsx` SSR of both public article functions piped to an inline Python canonical comparator. The comparator removed only Markdown/JSX structural syntax, excluded the `Sources`/`来源` component from body text, retained reader-visible figure captions, and compared ordered non-image body links.

```text
en body_binding: PASS expected_chars=15896 actual_chars=15896
en locked_body_links: PASS expected=36 actual=36
zh body_binding: PASS expected_chars=3233 actual_chars=3233
zh locked_body_links: PASS expected=25 actual=25
```

**Exit code:** `0`.

Handoff body readback independently produced:

```text
en handoff_body_len 19815 locked_len 19815 equal True
  handoff_hash=3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1
  actual_hash=3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1
zh handoff_body_len 12155 locked_len 12155 equal True
  handoff_hash=d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690
  actual_hash=d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690
```

### Prior ZH finding 1 — missing ordinary space: fixed

`src/blog/articles/pine-tree-stardew.zh.tsx:16-17` now contains the explicit JSX space:

```tsx
<strong>松果 → 种出普通松树 → 等树成熟 → 在成熟松树上挂采集器 → 得到松焦油。</strong>
{" "}松树不是果树，所以不需要果树那种周围 3×3 全空的规则；
```

The canonical comparator reports `zh body_binding: PASS expected_chars=3233 actual_chars=3233` and therefore finds no remaining missing U+0020.

### Prior ZH finding 2 — malformed final source href: fixed

`docs/blog-ops/pine-tree-stardew/handoff-zh.md:286-287` now records:

```json
"label": "本站：星露谷种树：普通树和果树的区别",
"href": "/zh/stardew-valley-trees"
```

The ZH module uses the same public path at `src/blog/articles/pine-tree-stardew.zh.tsx:261-262`; handoff/module source alignment and locked-body link alignment both pass below.

## 2. Source route/label alignment and public-reference binding

**Command:** read-only SSR/source parser compared each module's `BlogSources` heading, checked label, ordered `{label, href}` items, and CTA with the corresponding handoff and locked `Sources`/`来源` list; it also counted each handoff `PublicReference` quote at its declared one-based occurrence (a quote may occur more than once when `occurrence` selects the first match).

```text
en handoff_source_module_alignment: PASS expected_items=7 actual_items=7 heading='Sources'
en locked_source_module_alignment: PASS expected_items=7 actual_items=7
 en public_reference_quote_binding: PASS refs=8 quote_entries=19 quote_validator_failures=0 first=wiki-pine-tree count=1 occurrence=1
zh handoff_source_module_alignment: PASS expected_items=9 actual_items=9 heading='来源'
zh locked_source_module_alignment: PASS expected_items=9 actual_items=9
 zh public_reference_quote_binding: PASS refs=9 quote_entries=25 quote_validator_failures=0 first=wiki-zh-pine-tree count=2 occurrence=1
```

**Exit code:** `0`.

The ZH `松树属于普通树` quote occurs twice in the locked body, and `occurrence: 1` correctly selects the first occurrence; this is not a failure. The repaired ZH public source path is a valid localized path and no `site-zh-general-trees` placeholder remains in the current handoff/module source item.

## 3. SSR structure, public API, media binding, FAQ absence, and residue

**Command:** read-only SSR structural/API/media/residue assertions over both modules.

```text
en SSR structural/API/media/residue checks
  PASS article starts with paragraph
  PASS no h1
  PASS no FAQ
  PASS no JSON-LD/iframe
  PASS no internal/research residue
  PASS sources heading
  PASS source links present
  PASS planner CTA locale
  PASS locale internal guide link
  PASS two in-body figures
  PASS all figures lazy async 1672x941
  PASS two table wrappers
  h2=6 h3=15 figure=2 sourceLinks=7 CTA=['/#planner']
  exit_candidate=0
zh SSR structural/API/media/residue checks
  PASS article starts with paragraph
  PASS no h1
  PASS no FAQ
  PASS no JSON-LD/iframe
  PASS no internal/research residue
  PASS sources heading
  PASS source links present
  PASS planner CTA locale
  PASS locale internal guide link
  PASS two in-body figures
  PASS all figures lazy async 1672x941
  PASS two table wrappers
  h2=3 h3=4 figure=2 sourceLinks=9 CTA=['/zh#planner']
  exit_candidate=0
```

**Exit code:** `0`.

The explicit source residue scan also returned exit `0`: `[confirm:`, `/mods`, `pixel_text`, `research`, `prompt`, `SERP`, `JsonLd`, `<h1`, `<iframe`, and `youtube` were all `ABSENT` from both modules. `BlogSources` is the public component API; `PublicPicture` is the public image API; neither module introduces a raw image/iframe/JSON-LD implementation or a page-level H1/FAQ.

## 4. Figure and receipt-bound media recheck

### Actual six-file hash/byte evidence

| Role | File | Bytes | SHA-256 | Dimensions / format |
|---|---|---:|---|---|
| Cover WebP | `public/blog/pine-tree-stardew-cover.webp` | `32,094` | `4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517` | `1672×941`, lossy VP8 WebP |
| Cover AVIF | `public/blog/pine-tree-stardew-cover.avif` | `19,430` | `6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1` | `1672×941`, AVIF |
| Figure 1 WebP | `public/blog/illustrations/pine-tree-seed-to-tar.webp` | `23,214` | `42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d` | `1672×941`, lossy VP8 WebP |
| Figure 1 AVIF | `public/blog/illustrations/pine-tree-seed-to-tar.avif` | `17,100` | `bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544` | `1672×941`, AVIF |
| Figure 2 WebP | `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` | `20,746` | `1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5` | `1672×941`, lossy VP8 WebP |
| Figure 2 AVIF | `public/blog/illustrations/pine-tree-stage-four-neighbor.avif` | `15,994` | `60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0` | `1672×941`, AVIF |

**Command 1:**

```sh
webpinfo public/blog/pine-tree-stardew-cover.webp
webpinfo public/blog/illustrations/pine-tree-seed-to-tar.webp
webpinfo public/blog/illustrations/pine-tree-stage-four-neighbor.webp
```

Observed for all three WebP files: `Chunk VP8`, `Width: 1672`, `Height: 941`, `Format: Lossy (1)`, `No error detected.`

**Exit code:** `0`.

**Command 2:** read-only Pillow 12.2.0 decode/hash/dimension assertions for all six actual files.

```text
cover-webp: PASS bytes=32094 sha256=4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517 format=WEBP mode=RGB size=1672x941
cover-avif: PASS bytes=19430 sha256=6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1 format=AVIF mode=RGB size=1672x941
figure-1-webp: PASS bytes=23214 sha256=42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d format=WEBP mode=RGB size=1672x941
figure-1-avif: PASS bytes=17100 sha256=bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544 format=AVIF mode=RGB size=1672x941
figure-2-webp: PASS bytes=20746 sha256=1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5 format=WEBP mode=RGB size=1672x941
figure-2-avif: PASS bytes=15994 sha256=60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0 format=AVIF mode=RGB size=1672x941
```

**Pillow exit code:** `0`.

**Command 3:** `shasum -a 256` over all six actual media paths. Every digest matched the current receipt and both handoffs; exit code `0`.

**Visual readback:** `functions.view_image` inspected the actual WebP cover and both actual WebP figures. The cover visibly shows a mature Pine, Tapper/amber output, and Pine Cones; Figure 1 visibly shows Pine Cone → planted stages → mature Pine/Tapper/output; Figure 2 visibly shows the center seedling, eight-neighbor blocker, and separated arrangement. Localized handoff alt/caption strings describe those actual visuals without screenshot, fixed-countdown, profit-ranking, or physical-footprint claims. Visual readback is source/media evidence only, not page/browser evidence.

### Module-to-handoff figure binding

```text
en figure_handoff_module_binding: PASS figures=2 errors=[]
zh figure_handoff_module_binding: PASS figures=2 errors=[]
```

Both modules use the exact handoff figure WebP paths, localized alt/caption strings, `1672×941`, `loading="lazy"`, and `decoding="async"`; same-stem AVIF siblings exist for both figures. The shared cover remains a page-layer field in the handoffs; it is not incorrectly duplicated into the body modules.

### Receipt/handoff consistency

```text
receipt media table: PASS entries=3 errors=[]
receipt status/date: PASS
receipt stale cover state: PASS
 en handoff receipt consistency: PASS errors=[]
 zh handoff receipt consistency: PASS errors=[]
```

The repaired receipt has `PASS_LOCAL_RECEIPT`, generation/reconciliation date `2026-09-22`, localized handoff cover alts, `altStatus: verified_from_actual_file`, and `assetStatus: received_local_validated`. The prior `R-media-review.md` note about a pending/null cover state is historical and is not current receipt evidence.

## 5. Typecheck and focused test evidence

### Typecheck

```sh
$ pnpm exec tsc --noEmit --incremental false --pretty false
typecheck_exit=0
```

### Existing cover test

```text
$ pnpm exec vitest run tests/assets/blog-cover-images.test.ts
✓ tests/assets/blog-cover-images.test.ts (11 tests)
Tests  11 passed (11)
blog_cover_test_exit=0
```

This is a PASS for the existing 11-test suite only; it has no Pine target reference and does not prove target registry/page coverage.

### Public AVIF derivative test

```text
$ pnpm exec vitest run tests/assets/public-avif-assets.test.ts
❯ tests/assets/public-avif-assets.test.ts (2 tests | 1 failed)
✕ public AVIF derivatives > provides AVIF derivatives for every opaque public WebP image
  expected [ …(73) ] to have a length of 70 but got 73
✓ public AVIF derivatives > keeps compact and transparent public previews on their WebP path
Tests  1 failed | 1 passed (2)
public_avif_test_exit=1
```

This is a current test-contract **FAIL**, not a media-header or missing-sibling failure: the fixed assertion remains `70`, the scan observes `73` public WebPs after the three Pine WebPs are present, and all three Pine WebPs have the validated AVIF siblings. The test was out of this dispatch's write boundary and was not changed.

## 6. Registry, route, build, browser, deployment, and user-review boundaries

### Registry and route source scan

```text
$ rg -n -i 'pine-tree-stardew|pine tree|松树' src/blog/blog-post-identities.ts src/blog/blog-post-registry.tsx src/blog/blog-copy.ts app public/llms.txt
 target-reference=ABSENT
```

The generic dynamic route files still resolve only `isBlogPostSlug` values from the registry (`app/(en)/[slug]/page.tsx:24-41`, `app/zh/[slug]/page.tsx:27-44`). The target slug is not registered, and no target-specific test reference exists:

```text
target-test-reference=ABSENT
```

### Static output / page binding

```text
out/pine-tree-stardew.html=ABSENT
out/zh/pine-tree-stardew.html=ABSENT
out_dir=FOUND
out/ contains only the six Pine media files
```

Therefore:

- Registry identity/metadata: **UNVERIFIED / blocked**. EN handoff keeps `author=null`, `featured=null`, `readTimeMinutes=null`; ZH keeps `topic=null`, `author=null`, `featured=null`, `readTimeMinutes=null`.
- Handoff/page binding: **UNVERIFIED**. Both handoffs report `page: UNVERIFIED` and `metadataStatus: blocked_missing_public_metadata`.
- Build/static export: **NOT_RUN** in this recheck; `tsc` passing is not build evidence.
- Browser/desktop/mobile: **NOT_RUN**. No local ego-browser page proof was performed.
- Deployment/live origin: **NOT_RUN / UNVERIFIED**. No deploy, external write, or production claim was made.
- User review: **not_started** in both handoffs.

## Scope settlement

Only `docs/blog-ops/pine-tree-stardew/R-article-asset-recheck.md` was written by this dispatch. No source, public asset, handoff, receipt, registry, identity, copy, test, locked body, prior report, build output, commit, push, deploy, or external service was modified.
