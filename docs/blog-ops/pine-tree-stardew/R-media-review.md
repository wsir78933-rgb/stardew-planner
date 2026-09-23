# R-MEDIA independent review: `pine-tree-stardew`

**Review date:** 2026-09-22 (Asia/Shanghai)

**Mode:** read-only audit plus this report only. Assets, article modules, registry, route, tests, and generated output were not edited.

**Disposition:** **MEDIA FILES PASS; BODY SOURCE BINDING PASS; PAGE/ROUTE BINDING NOT READY; ONE TEST CONTRACT FAILS.**

## 1. Review boundary and governing rules

Reviewed the current checkout, `docs/blog-ops/pine-tree-stardew/G-assets-receipt.md`, both public handoffs, the two Pine article modules, `src/components/public-picture.tsx`, `src/components/blog/blog-article-content.tsx`, `tests/assets/blog-cover-images.test.ts`, `tests/assets/public-avif-assets.test.ts`, the current static `out/` tree, and the V7 rules.

The relevant V7 rules are explicit: a finished illustrated post needs useful in-body visual content beyond the cover; a cover, media list, placeholder, broken image, or unrendered asset is not enough; image facts, figure placement, captions, and alt must be bound before lock; the cover follows the project LCP strategy and non-critical images are lazy; actual page-route and desktop/mobile checks remain separate from source and file checks (`03-博客页面生成整合.md:75-89`, `04-公开交接与页面装配.md:23-29,53-69`). The project media contract independently fixes `1672×941`, lossy VP8 WebP, `≤1,310,720` bytes for a cover, `≤409,600` bytes for an in-body figure, no lazy cover, and `decoding="async" loading="lazy"` for figures (`project-interface-spec.md:324-357`).

**Important boundary:** the cover is recognized as a theme/identity image only. It is **not** counted as the stage-4 or seed-to-tar teaching figure; the two body figures must be the reader-useful V7 evidence.

## 2. Per-asset verdict

| Asset / role | Exists | WebP format + dimensions | WebP budget | AVIF sibling | Visual / locale / alt / caption | Source / loading / page binding | Verdict |
|---|---|---|---|---|---|---|---|
| `public/blog/pine-tree-stardew-cover.webp` — shared cover | **PASS**; 32,094 bytes | **PASS**; `Chunk VP8`, lossy, `1672×941`, no decoder error | **PASS**; `32,094 ≤ 1,310,720` | **PASS**; 19,430 bytes, `ftypavif`, Pillow decodes `1672×941` RGB | **PASS (current handoffs)**. The rendered art visibly contains a Pine landscape, mature Pine, Tapper/amber output, and Pine Cones. Current EN and ZH handoffs contain localized descriptive alts at `handoff-en.md:258-276` and `handoff-zh.md:300-318`; no caption is intended. | **UNVERIFIED as a real target page**: the shared renderer would emit a non-lazy cover, but Pine is not registered and no target HTML page exists. | **PASS file/media; UNVERIFIED page** |
| `public/blog/illustrations/pine-tree-seed-to-tar.webp` — Figure 1 | **PASS**; 23,214 bytes | **PASS**; `Chunk VP8`, lossy, `1672×941`, no decoder error | **PASS**; `23,214 ≤ 409,600` | **PASS**; 17,100 bytes, `ftypavif`, Pillow decodes `1672×941` RGB | **PASS EN/ZH**. The actual panels show Pine Cone → planted stages → mature Pine → Tapper/output; current localized alt/caption pairs match the visible relationship and explicitly say it is not a screenshot or fixed countdown. | **PASS at source level**: both modules use the exact shared path, `width/height=1672/941`, `decoding="async"`, `loading="lazy"`, and place Figure 1 before acquisition/planting. | **PASS source/media; UNVERIFIED page** |
| `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` — Figure 2 | **PASS**; 20,746 bytes | **PASS**; `Chunk VP8`, lossy, `1672×941`, no decoder error | **PASS**; `20,746 ≤ 409,600` | **PASS**; 15,994 bytes, `ftypavif`, Pillow decodes `1672×941` RGB | **PASS EN/ZH**. The actual two-panel grid shows the center seedling, the eight-neighbor ring, an adjacent mature-tree blocker, and a separated corrected arrangement. The localized alt/caption text distinguishes the practical one-tile gap from a fruit-tree `3×3` rule and does not claim a physical footprint. | **PASS at source level**: both modules use the exact shared path, `width/height=1672/941`, `decoding="async"`, `loading="lazy"`, and place Figure 2 after the stage-4 diagnosis. | **PASS source/media; UNVERIFIED page** |

### Byte/hash evidence

The receipt values were independently re-read from the checkout; all six expected files are non-empty and the hashes match the receipt/handoff values:

| File | Bytes | SHA-256 |
|---|---:|---|
| `public/blog/pine-tree-stardew-cover.webp` | 32,094 | `4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517` |
| `public/blog/pine-tree-stardew-cover.avif` | 19,430 | `6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1` |
| `public/blog/illustrations/pine-tree-seed-to-tar.webp` | 23,214 | `42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d` |
| `public/blog/illustrations/pine-tree-seed-to-tar.avif` | 17,100 | `bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544` |
| `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` | 20,746 | `1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5` |
| `public/blog/illustrations/pine-tree-stage-four-neighbor.avif` | 15,994 | `60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0` |

Real command output:

```text
$ webpinfo public/blog/pine-tree-stardew-cover.webp
Chunk VP8  at offset     12, length  32082
Width: 1672
Height: 941
Format: Lossy (1)
No error detected.

$ webpinfo public/blog/illustrations/pine-tree-seed-to-tar.webp
Chunk VP8  at offset     12, length  23202
Width: 1672
Height: 941
Format: Lossy (1)
No error detected.

$ webpinfo public/blog/illustrations/pine-tree-stage-four-neighbor.webp
Chunk VP8  at offset     12, length  20734
Width: 1672
Height: 941
Format: Lossy (1)
No error detected.

$ python3 (Pillow read of all AVIF siblings)
public/blog/pine-tree-stardew-cover.avif: bytes=19430 signature=ftypavif format=AVIF mode=RGB size=1672x941
public/blog/illustrations/pine-tree-seed-to-tar.avif: bytes=17100 signature=ftypavif format=AVIF mode=RGB size=1672x941
public/blog/illustrations/pine-tree-stage-four-neighbor.avif: bytes=15994 signature=ftypavif format=AVIF mode=RGB size=1672x941
```

## 3. Locale, alt, caption, and visual accuracy

### 3.1 Cover

The current handoff records contradict the receipt's unresolved note: EN has the localized cover alt `Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground.` (`handoff-en.md:258-276`); ZH has `松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。` (`handoff-zh.md:300-318`). Both descriptions match the actual visible cover and preserve the “header recognition, not teaching replacement” role.

There is a **documentation drift finding**: `G-assets-receipt.md:21-24` still says the candidate alt is pending and that both handoffs have `cover.alt: null`, while the current handoffs now contain non-null localized alts with `altStatus: "verified_from_actual_file"` and `assetStatus: "received_local_validated"`. The receipt therefore cannot be treated as the latest authority for cover-alt status without reconciliation; this review did not edit it.

### 3.2 Figure 1

The EN source uses the exact handoff strings at `src/blog/articles/pine-tree-stardew.en.tsx:46-60`; the ZH source uses the exact localized strings at `src/blog/articles/pine-tree-stardew.zh.tsx:70-82`. The visual has no embedded language labels, so sharing one WebP/AVIF pair between `en` and `zh-CN` is accurate; localization is correctly carried by alt and caption rather than by image bytes.

### 3.3 Figure 2

The EN source uses the exact handoff strings at `src/blog/articles/pine-tree-stardew.en.tsx:201-215`; the ZH source uses the exact localized strings at `src/blog/articles/pine-tree-stardew.zh.tsx:121-133`. Visual inspection confirms the red/green panels depict an eight-neighbor check and a practical separated layout, not a fruit-tree `3×3` clearance diagram, collision box, gameplay screenshot, or fixed growth-time graphic.

## 4. Lazy-versus-cover loading contract

The current source-level contract is correct:

- `src/components/blog/blog-article-content.tsx:26-31` passes the cover through `PublicPicture` with `width=1672` and `height=941` but no `loading="lazy"`; the cover is therefore non-lazy in the shared page renderer.
- Both Pine modules put `loading="lazy"` and `decoding="async"` on both body figures, with intrinsic `1672×941` dimensions.
- A direct static render of a synthetic `BlogArticleContent` input binding the observed cover metadata and EN body produced:

```text
image[0]: <img alt="Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground." height="941" width="1672" src="/blog/pine-tree-stardew-cover.webp"/>
image[1]: <img alt="Explanatory illustration showing a Pine Cone, planted common-tree stages, a mature Pine with a Tapper, and Pine Tar; not a gameplay screenshot." decoding="async" height="941" loading="lazy" width="1672" src="/blog/illustrations/pine-tree-seed-to-tar.webp"/>
image[2]: <img alt="Explanatory grid showing a Pine seedling at center, eight adjacent tiles, a mature neighboring tree blocking stage 4, and a corrected one-tile gap; not a gameplay screenshot." decoding="async" height="941" loading="lazy" width="1672" src="/blog/illustrations/pine-tree-stage-four-neighbor.webp"/>
```

This is source/component evidence only, not a target-page claim. The current generic cover test also checks non-lazy detail covers and lazy article-card covers (`tests/assets/blog-cover-images.test.ts:600-616`), but it does not reference Pine.

## 5. Page-source and route-reference audit

### Body source references

**PASS at source level.** Both existing untracked Pine article modules contain exactly two `<figure>` / `<PublicPicture>` pairs and the two exact body WebP paths:

```text
$ rg -c '<PublicPicture' src/blog/articles/pine-tree-stardew.en.tsx src/blog/articles/pine-tree-stardew.zh.tsx
src/blog/articles/pine-tree-stardew.en.tsx:2
src/blog/articles/pine-tree-stardew.zh.tsx:2

$ rg -o 'src="[^"]+\.webp"' src/blog/articles/pine-tree-stardew.en.tsx src/blog/articles/pine-tree-stardew.zh.tsx
src="/blog/illustrations/pine-tree-seed-to-tar.webp"
src="/blog/illustrations/pine-tree-stage-four-neighbor.webp"
src="/blog/illustrations/pine-tree-seed-to-tar.webp"
src="/blog/illustrations/pine-tree-stage-four-neighbor.webp"
```

### Cover/route/page source

**FAIL for current checkout binding; no page proof.** `src/blog/blog-post-identities.ts`, `src/blog/blog-copy.ts`, and `src/blog/blog-post-registry.tsx` contain no `pine-tree-stardew` registration/import. The target source modules are present on disk but are not connected to the registry or paired routes. `out/` contains only the six copied Pine media files; it has neither `out/pine-tree-stardew.html` nor `out/zh/pine-tree-stardew.html`, and no generated HTML/TXT target source references were found.

```text
$ if rg -n -i 'pine-tree|pine tree|pine-tree-stardew' tests/assets/blog-cover-images.test.ts; then echo FOUND; else echo pine-target-test-reference=ABSENT; fi
pine-target-test-reference=ABSENT

$ find out -type f -iname '*pine*' -print | sort
out/blog/illustrations/pine-tree-seed-to-tar.avif
out/blog/illustrations/pine-tree-seed-to-tar.webp
out/blog/illustrations/pine-tree-stage-four-neighbor.avif
out/blog/illustrations/pine-tree-stage-four-neighbor.webp
out/blog/pine-tree-stardew-cover.avif
out/blog/pine-tree-stardew-cover.webp

$ rg -n 'pine-tree-stardew|pine-tree-seed-to-tar|pine-tree-stage-four-neighbor' out --glob '*.html' --glob '*.txt'
# no matches; exit 1
```

This means the asset files are present and source figure references are accurate, but no actual EN/ZH article page currently proves the cover or figures are rendered through the real route.

## 6. Current test evidence

### Blog cover test

```text
$ pnpm exec vitest run tests/assets/blog-cover-images.test.ts
✓ tests/assets/blog-cover-images.test.ts (11 tests)
Test Files  1 passed (1)
Tests  11 passed (11)
```

This is a **PASS for the existing 11-test suite only**. The test file has no Pine asset/reference and its cover assertions stop at the existing identities; it does not prove Pine coverage.

### Public AVIF derivative test

```text
$ pnpm exec vitest run tests/assets/public-avif-assets.test.ts
❯ tests/assets/public-avif-assets.test.ts (2 tests | 1 failed)
✕ public AVIF derivatives > provides AVIF derivatives for every opaque public WebP image
  expected [ …(73) ] to have a length of 70 but got 73
✓ public AVIF derivatives > keeps compact and transparent public previews on their WebP path
Test Files  1 failed (1)
Tests  1 failed | 1 passed (2)
exit code: 1
```

The fixed count at `tests/assets/public-avif-assets.test.ts:59` remains `70`; the current scan sees `73` public WebP files because the three Pine WebPs are present, and all three have non-empty AVIF siblings. This is a current test-contract failure, not an asset-header or AVIF-sibling failure; the test was not edited under this review scope.

## 7. Final acceptance matrix

| Gate | Result | Evidence / boundary |
|---|---|---|
| All three WebP files exist | **PASS** | Exact `test -s`/`stat` readback; six target media files present. |
| All three AVIF siblings exist and decode | **PASS** | `ftypavif`; Pillow `AVIF`, RGB, `1672×941`. |
| WebP exact dimensions | **PASS** | `webpinfo` for all three: `1672×941`. |
| WebP VP8 lossy header | **PASS** | `Chunk VP8`, `Format: Lossy (1)`, `No error detected.` for all three. |
| Byte budgets | **PASS** | Cover `32,094/1,310,720`; figures `23,214/409,600` and `20,746/409,600`. |
| Cover visual/locale alt | **PASS current handoffs; FAIL receipt consistency** | Current localized handoff alts match the image; receipt still contains the old pending/null statement. |
| Figure 1 visual/locale alt/caption | **PASS** | EN/ZH handoff and source strings match actual diagram. |
| Figure 2 visual/locale alt/caption | **PASS** | EN/ZH handoff and source strings match actual grid teaching, without decorative/footprint claims. |
| Cover non-lazy / body lazy contract | **PASS source-level; UNVERIFIED page-level** | Shared renderer and direct synthetic render pass; target route is absent. |
| V7 cover-versus-teaching rule | **PASS** | Two actual body teaching figures are present in both source modules; cover is not counted as teaching. |
| Current blog cover tests | **PASS, target-uncovered** | 11/11 pass; no Pine references. |
| Current public AVIF test | **FAIL** | Fixed expected count `70`, observed `73`; no source/test change made. |
| Real EN/ZH page-source references | **FAIL / NOT REGISTERED** | No identity/copy/registry binding; no target HTML/TXT output. |
| Browser/build/deployment | **UNVERIFIED** | No UI/browser/build/deployment claim is made in this read-only media review. |

## 8. Scope settlement

Only this report is owned by R-MEDIA. No asset, article source, registry, route, test, or generated output file was edited. The existing untracked Pine source/assets/docs state was preserved, including the three WebPs, three AVIFs, both Pine article modules, and the pre-existing `G-assets-receipt.md`.
