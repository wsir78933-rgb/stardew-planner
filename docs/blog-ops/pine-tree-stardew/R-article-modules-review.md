# R-article-modules review: `pine-tree-stardew`

**Review date:** 2026-09-22 (Asia/Shanghai)

**Scope:** read-only independent review of the two assembled article modules against the locked EN/ZH bodies, refreshed handoffs, `G-assets-receipt.md`, and the public article interfaces.

**Write boundary:** this report only. No source, registry, identity, copy, test, asset, handoff, locked body, build output, commit, push, deploy, browser, or external service was changed.

## Executive verdict

| File | Verdict | Boundary |
|---|---|---|
| `src/blog/articles/pine-tree-stardew.en.tsx` | **PASS** | Body/link/media/API/module checks pass under the canonical Markdown-to-JSX comparison below. Registry/page/build remain blocked outside this module review. |
| `src/blog/articles/pine-tree-stardew.zh.tsx` | **FAIL** | One locked-body space is missing and the final `BlogSources` href differs from the refreshed ZH handoff. Other API, media, link-sequence, residue, and structure checks pass. |

Overall module review: **FAIL; do not repair in this dispatch.**

## Raw identity evidence

The following was read from the current checkout with `sha256sum`:

```text
3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1  docs/blog-ops/pine-tree-stardew/locked/en-body.txt
d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690  docs/blog-ops/pine-tree-stardew/locked/zh-body.txt
5b61738990dac239d34eb3d7898270929ae6c47ccacb2e9168923a4d6e233bc7  src/blog/articles/pine-tree-stardew.en.tsx
57cfaafb2e3914aef38666b1fcf03c7b8f5bf4e54b744b2e70ec192636b4d606  src/blog/articles/pine-tree-stardew.zh.tsx
af5db7ad2849f24cd452b22d9f9db85a25efc0234d950b4ba3be205dbf437deb  docs/blog-ops/pine-tree-stardew/handoff-en.md
77fa2dc99810b52e1876ed2a537b8d31e0e27bced5a5117b538dc408997314c8  docs/blog-ops/pine-tree-stardew/handoff-zh.md
5fd5c099518e3ddbbc574994569e062da13449989af3112b547577c244525542  docs/blog-ops/pine-tree-stardew/G-assets-receipt.md
055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f  docs/blog-ops/pine-tree-stardew/project-interface-spec.md
```

## Commands and exact results

### 1. Canonical locked-body and body-link audit

**Command:** read-only inline Python; it rendered both modules with `pnpm exec tsx`/`react-dom/server`, removed only Markdown/JSX structural syntax (`Figure:` / `图 n：`, heading/list/table markers, image syntax), then compared normalized visible body text and ordered body links. It exited non-zero on any mismatch.

```text
en body_binding: PASS expected_chars=15896 actual_chars=15896
en locked_body_links: PASS expected=36 actual=36
zh body_binding: FAIL expected_chars=3233 actual_chars=3232
zh body_binding_first_diff: expected=' ' actual='' context='树和松焦油的对应关系 先把这条关系记住：松果 → 种出普通松树 → 等树成熟 → 在成熟松树上挂采集器 → 得到松焦油。 松树不是果树，所以不需要果树那种周围 3×3 全空的规则；但普通树苗仍会受相邻成熟树阻挡，后文会单独排查这一点。松树页面和树页面都把 Pine Tree 归在普'
zh locked_body_links: PASS expected=25 actual=25
zh handoff_last_source_href: FAIL handoff='site-zh-general-trees' module='/zh/stardew-valley-trees'
```

**Exit code:** `1` (expected audit failure from the two concrete ZH findings).

### 2. SSR structural/API/media/residue audit

**Command:** read-only inline Python; rendered both public functions with `pnpm exec tsx`, checked `<article><p>` start, public `BlogSources`/`PublicPicture` use, source order/checked label, CTA locale href, figure fields, AVIF derivation, dimensions, table wrappers, no H1/FAQ/JSON-LD/iframe/internal markers/removed routes, and semantic heading counts.

```text
en SSR structural checks
  PASS article starts with paragraph
  PASS no h1
  PASS no FAQ
  PASS no JSON-LD or iframe
  PASS no internal markers
  PASS no removed routes
  PASS sources component and heading
  PASS source order and labels
  PASS planner CTA href
  PASS locale internal guide link
  PASS figure count and exact approved fields
  PASS figure AVIF/WebP dimensions
  PASS semantic heading counts
  PASS two accessible table wrappers
zh SSR structural checks
  PASS article starts with paragraph
  PASS no h1
  PASS no FAQ
  PASS no JSON-LD or iframe
  PASS no internal markers
  PASS no removed routes
  PASS sources component and heading
  FAIL source order and labels
  PASS planner CTA href
  PASS locale internal guide link
  PASS figure count and exact approved fields
  PASS figure AVIF/WebP dimensions
  PASS semantic heading counts
  PASS two accessible table wrappers
```

**Exit code:** `1` (expected because the ZH handoff source href differs).

### 3. Locked body source-link list binding

```text
en source list binding PASS items=7
zh source list binding PASS items=9
```

**Exit code:** `0`. This is the locked-body `Sources` list; it is separate from the refreshed ZH handoff's malformed final `href` field.

### 4. Actual six-file media decode/hash/dimension check

**Command:** read-only inline Python with Pillow; compared each current file to the handoff/G receipt bytes, SHA-256, format, and `1672x941` dimensions.

```text
cover-webp: PASS bytes=32094 sha256=4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517 size=1672x941 format=WEBP
cover-avif: PASS bytes=19430 sha256=6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1 size=1672x941 format=AVIF
figure-1-webp: PASS bytes=23214 sha256=42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d size=1672x941 format=WEBP
figure-1-avif: PASS bytes=17100 sha256=bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544 size=1672x941 format=AVIF
figure-2-webp: PASS bytes=20746 sha256=1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5 size=1672x941 format=WEBP
figure-2-avif: PASS bytes=15994 sha256=60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0 size=1672x941 format=AVIF
```

**Exit code:** `0`.

### 5. Typecheck

```text
$ pnpm exec tsc --noEmit --incremental false --pretty false
EXIT_CODE=0
```

**Typecheck exit code:** `0`. This does not prove registry binding, page rendering, static export, or build readiness.

## Per-file evidence

### EN — `src/blog/articles/pine-tree-stardew.en.tsx` — PASS

- **Exact locked-body binding:** PASS. The canonical visible-text comparison is exact (`15896` vs `15896` chars); the ordered body link sequence is exact (`36` vs `36`). Locked body hash is `3b53…ca8c1`; module hash is `5b6173…33bc7`.
- **Public component/API usage:** PASS. Precise export `PineTreeStardewEnglishArticle` and only the public `BlogSources` / `PublicPicture` imports are at lines 1–4. The module starts `<article><p>` at lines 4–7 and has no page-level H1.
- **Anchors and locale planner:** PASS. The body has the locked `/stardew-valley-trees` link at lines 162–172; `BlogSources` is `heading="Sources"` at lines 526–570 and SSR generated the handoff CTA `/#planner`. External source order/labels/notes match the locked `Sources` section and refreshed handoff.
- **Figures:** PASS. Figure 1 is lines 46–60 and Figure 2 is lines 201–215. Both use the exact handoff/G paths, alt, caption payload, `1672x941`, `loading="lazy"`, `decoding="async"`, and `.webp` sources that resolve through `PublicPicture` to same-stem `.avif`.
- **Negative contracts:** PASS. No invented FAQ (`handoff-en.md:8`, `249`), no `<h1>`, JSON-LD, iframe, research/SEO/prompt residue, removed public routes, or raw YouTube usage.
- **Design principles:** PASS for this static module: one cohesive article function, no local state/helper abstraction, no duplicated source/media rendering logic, precise export name, public components handle their own validation/rendering, and no YAGNI surface.

### ZH — `src/blog/articles/pine-tree-stardew.zh.tsx` — FAIL

- **Locked-body binding:** FAIL by one ordinary U+0020. Locked body line 5 has a space after the bold chain: `…得到松焦油。** 松树不是果树…`; module lines 15–17 close `<strong>` and begin `松树不是果树` without `{" "}`. The canonical comparison is `3233` expected vs `3232` actual. This is not a guessed semantic difference; it is a concrete rendered-text mismatch.
- **Public component/API usage:** PASS. Precise export and public imports are lines 1–4; `<article><p>` starts at lines 4–7; no page-level H1.
- **Body anchors:** PASS against the locked ZH body (`25` ordered links). The locale internal guide is `/zh/stardew-valley-trees` at lines 149–150.
- **Refreshed handoff source binding:** FAIL. The handoff's final source item is `href: "site-zh-general-trees"` at `handoff-zh.md:286–287`, while the module uses the actual public path `/zh/stardew-valley-trees` at `pine-tree-stardew.zh.tsx:261–262`. The module matches the locked body line 101 and the handoff `publicReferences` URL, but it does not match the explicit `publicRequirements.sources.items` href; the handoff field is also not a public URL/path. No repair was made.
- **Figures:** PASS. Figure 1 is lines 70–82 and Figure 2 is lines 121–133; exact localized alt/caption/path/dimension/loading checks pass against the refreshed handoff and actual six-file media verification.
- **Negative contracts:** PASS. No invented FAQ (`handoff-zh.md:8`, `291`), no `<h1>`, JSON-LD, iframe, research/SEO/prompt residue, removed public routes, or raw YouTube usage.
- **Design principles:** PASS for module structure; the two content/link mismatches above are the only module-level FAIL findings.

## Blocker boundary: registry/page/build remain blocked

- **Registry:** still blocked by explicit missing metadata, not by an inferred default. EN `handoff-en.md:194–202` has `author=null`, `featured=null`, `readTimeMinutes=null`; ZH `handoff-zh.md:226–234` has `topic=null`, `author=null`, `featured=null`, `readTimeMinutes=null`. Both handoffs state `blocked_missing_public_metadata`.
- **Page binding:** UNVERIFIED. The handoffs are `BLOCKED` and not page-ready (`handoff-en.md:1–10`, `handoff-zh.md:1–10`); no registry/page files were in scope.
- **Build:** not run by this module-only review. Typecheck passed, but that is not build/static-export/page evidence. Do not claim route, registry, JSON-LD, metadata, browser, or production readiness.
- **Media:** local file presence/hash/decode/dimensions and module figure bindings are PASS. The current handoffs have verified localized cover alts (`handoff-en.md:258–276`, `handoff-zh.md:300–318`). `G-assets-receipt.md:3–5,23–24,84–88` still contains the earlier `cover.alt: null`/`pending_media` statement, so the receipt is stale/inconsistent with the refreshed handoffs; this is reported only and was not repaired.

## Scope result

Only `docs/blog-ops/pine-tree-stardew/R-article-modules-review.md` was written. No source repair, handoff/receipt repair, registry/page assembly, test/build output, browser check, external write, commit, push, or deploy was performed.
