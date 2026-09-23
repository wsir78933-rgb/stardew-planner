# R-FINAL-BLOCKED-AUDIT-V2: `pine-tree-stardew`

- **Audit date:** 2026-09-22 (Asia/Shanghai)
- **Mode:** integrated, read-only closeout after the current repairs
- **Checkout:** `/Users/wusir/orca/workspaces/stardew planner/博客二`
- **Branch / HEAD:** `博客二` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`
- **Write boundary:** this report only: `docs/blog-ops/pine-tree-stardew/R-final-blocked-audit-v2.md`
- **External state:** no browser, deployment, commit, push, database, production, or external-service write was performed

## Executive verdict

**BLOCKED.** The current locked EN/ZH bodies, title/SEO inputs, repaired article modules, local six-file media set, handoffs, and local receipt are internally consistent when bound to their current hashes. The target is still not registered, the exact required registry metadata is still unresolved, one existing focused test contract fails (`expected 70`, observed `73`), and route/page/browser/deployment/user-approval evidence is absent; therefore this closeout makes no page-ready or deployment recommendation.

The verdict is based on current file readback and command/report evidence, not worker prose. Historical reports whose hashes no longer describe the current source or handoff state are explicitly treated as historical below.

## Evidence policy and state precedence

1. **Current raw files and current commands are authoritative.** Current SHA-256 values below were re-read from this checkout with `shasum -a 256`; current module/body/receipt results are also recorded in `R-article-asset-recheck.md:13-25,27-49,73-129,131-190` and `R-static-precheck.md:25-42,69-150`.
2. **Current repair recheck supersedes earlier review findings.** `R-article-modules-review.md` is historical and has raw SHA-256 `b7fa690b45a8eaba230d956e274d907909a7fa45af61b84ab7fd03919062d7aa`; the current recheck records the repaired ZH space/source-path findings at `R-article-asset-recheck.md:51-71`. `R-media-review.md` is historical and its old receipt-drift note is not current; the repaired receipt is current at `R-article-asset-recheck.md:182-192` and `G-assets-receipt.md:88-110`.
3. **A local build is not route or deployment proof.** The build evidence below is repository-only; the target route is absent from identity/copy/registry sources and target HTML is absent from `out/`.
4. **No value is inferred.** Existing article conventions are not defaults for this target. `G-metadata-resolution.md:92-119` records the same no-inference boundary; current handoff values are re-read directly below.

## 1. Settled orchestration outcomes

### Readback method

The outcome table was read from:

```sh
orca orchestration task-list --run run_05a444df709f --json
orca orchestration worker-list --run run_05a444df709f --json
```

The task list contained 59 tasks at this snapshot. Each completed task below had `status=completed` and a result payload with `outcome=succeeded`, except the explicitly marked failed registry task. Pending tasks were not treated as evidence. The current V2 dispatch (`task_b518da46982b`, this report) remained `dispatched` while this report was written and is not counted as a settled outcome.

| Phase | Settled tasks actually run and read back | Result / current artifact evidence |
|---|---|---|
| A research/spec/media | `task_af83cf9ab842`, `task_28d6b8a0c22e`, `task_3d45d1e6cbce`, `task_976510455b2e`, supplements `task_0163ce3bb988`, `task_263c4e17a1bc` | **SUCCEEDED**. Current inputs are `A-en-research.md`, `A-zh-research.md`, `project-interface-spec.md`, `A-media-plan.md`, and the two supplement reports. |
| B layout and repairs | `task_4a6ba7d048ca`, `task_2848e9426fbe`, repairs `task_411daa0a553b`, `task_2da20cf51b60` | **SUCCEEDED**. Current layout reports are present; no source/page claim follows from layout completion. |
| C candidate bodies and repairs | `task_06fb45d6390d`, `task_333529976b88`, `task_63c30a496deb`, `task_848de11e25d9`, `task_c5e102232193`, `task_3b48760e3a5b`, `task_312fd41ebdb5` | **SUCCEEDED**. Current locked body hashes are bound in §3; current module/body comparison is `R-article-asset-recheck.md:27-49`. |
| D checks and reruns | `task_0b9f91192996`, `task_cc110d42388c`, `task_56991bfcf17c`, `task_65ae88fdf6e6`, `task_33a77853c6b3`, `task_c791d53ca9c4`, `task_06f3a47aca72` | **SUCCEEDED**. Current D reports are read as historical audit inputs; current post-repair body/module proof is the recheck cited above. |
| E content/title reviews and reruns | content: `task_3d1d1d37d690`, `task_bd098945ec36`, `task_f5fce1f84e71`, `task_bad2f2e73722`, `task_7e26f4e63d41`; title: `task_4135e8fec455`, `task_73da4baf2084`, `task_c97300aef32b` | **SUCCEEDED**. Current title/SEO hashes are retained in the handoffs and current lock/module evidence; title PASS does not prove registry/page binding. |
| F lock/title/handoff | `task_f66261afe8b7`, `task_a29175837ab1`, title repair `task_545e2a44bd02`, handoff `task_424a24ff43e1` | **SUCCEEDED**. Current locked bodies and handoffs are the files/hash rows in §3. |
| G assets and article modules | assets `task_e8d7c6b12d9d`, EN module `task_0bfa5a1599dc`, ZH module `task_71c4d30e4e01` | **SUCCEEDED**. Current module hashes and six-file media hashes are independently re-read below. |
| G registry | `task_b67e52be5a5b` | **FAILED**, `filesModified=[]`, completed `2026-09-22T20:12:21.852Z`. Current source scan still has no target identity/copy/registry reference and current handoffs still have null required fields. |
| G metadata/handoff refresh | `task_30e724157b71`, `task_62fe04314146` | **SUCCEEDED**, but current handoff readback retains the explicit blocked metadata values; no defaults were supplied. |
| Reviews and repairs | media `task_018937ee6edf`; module review `task_c9bba82a6e0d`; repairs `task_43ed05c69d1d`, `task_da574fb685ae`, `task_e0a1d9209b9e`; current recheck `task_c7ce141b1aa1`; static precheck `task_bba294acff1c` | **SUCCEEDED**. Current recheck is authoritative for repaired module/media state; current static precheck is authoritative for the later typecheck/build/focused-test snapshot. |
| Not settled / not evidence | `task_6cad804f19ee`, `task_14a1cf29d73e`, `task_1cfc169876e9`, `task_5ed8234221b4`, `task_2849ea808e6f`, `task_d55995d1b792`, `task_d40a5965dbee`, `task_430a7b02c786` | **PENDING**, not run evidence. The older final task is pending; this V2 task is the current dispatched task. |

## 2. Allowed manifest versus actual worktree state

### Expected target manifest

The current allowed target set is:

- **One report directory:** the 28 pre-existing pine-tree report/lock/spec files plus this report, expected to total **29 files** after this write.
- **Two source modules:**
  - `src/blog/articles/pine-tree-stardew.en.tsx`
  - `src/blog/articles/pine-tree-stardew.zh.tsx`
- **Six public media files:**
  - `public/blog/pine-tree-stardew-cover.webp`
  - `public/blog/pine-tree-stardew-cover.avif`
  - `public/blog/illustrations/pine-tree-seed-to-tar.webp`
  - `public/blog/illustrations/pine-tree-seed-to-tar.avif`
  - `public/blog/illustrations/pine-tree-stage-four-neighbor.webp`
  - `public/blog/illustrations/pine-tree-stage-four-neighbor.avif`

The report directory names are the current 28 paths observed before this report: `A-en-research.md`, `A-en-supplement.md`, `A-media-plan.md`, `A-zh-research.md`, `A-zh-supplement.md`, `B-en-layout.md`, `B-zh-layout.md`, `C-en-draft.md`, `C-zh-draft.md`, `D-en-check.md`, `D-zh-check.md`, `E-en-review.md`, `E-en-title-review.md`, `E-zh-review.md`, `E-zh-title-review.md`, `F-en-lock.md`, `F-zh-lock.md`, `G-assets-receipt.md`, `G-metadata-resolution.md`, `R-article-asset-recheck.md`, `R-article-modules-review.md`, `R-media-review.md`, `R-static-precheck.md`, `handoff-en.md`, `handoff-zh.md`, `locked/en-body.txt`, `locked/zh-body.txt`, and `project-interface-spec.md`.

### Actual status/diff boundary

After this report write, the following read-only checks were run:

```sh
git status --short --untracked-files=all
git diff --name-status
git diff --cached --name-status
find docs/blog-ops/pine-tree-stardew -type f -print | sort
```

The expected result is: no tracked or staged changes; all untracked paths are limited to the 29 report-directory files, two source modules, and six public media files; and the report directory count is 29. The post-write manifest comparator below records the actual result and is the acceptance evidence for this boundary.

No unrelated tracked file is modified. The current branch and HEAD are the values at the top of this report.

### Generated artifacts: present and intentionally preserved

The following generated/dependency artifacts are present and ignored, and were **not deleted**:

- `node_modules/` — ignored by `.gitignore:1-2`
- `.next/` — ignored by `.gitignore:4-5`
- `out/` — ignored by `.gitignore:4-6`
- `tsconfig.tsbuildinfo` — ignored by `.gitignore:11-12`

`next-env.d.ts` is tracked and currently clean after the build readback (`git diff --quiet -- next-env.d.ts` exit `0`). No cleanup was performed; generated artifacts are reported, not removed.

## 3. Current hash-bound EN/ZH body, module, title, SEO, handoff, and receipt evidence

### 3.1 Locked body and handoff binding

| Locale | Locked body current SHA-256 | Bytes / lines | Handoff current SHA-256 | Handoff state |
|---|---|---:|---|---|
| EN | `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1` (`locked/en-body.txt`) | `19,815 / 184` | `af5db7ad2849f24cd452b22d9f9db85a25efc0234d950b4ba3be205dbf437deb` (`handoff-en.md`) | `status=blocked`, `ready=false`, `frozen=false`; body/status/SEO/media/integrity fields are explicit at `handoff-en.md:1-12,24-50,340-375` |
| ZH | `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690` (`locked/zh-body.txt`) | `12,155 / 101` | `59b41b44adc9c0c2bc90d6f2fb94e4a495d076f06e8799e2af784585f11cab66` (`handoff-zh.md`) | `status=blocked`, `ready=false`, `frozen=false`; body/status/SEO/media/integrity fields are explicit at `handoff-zh.md:1-12,25-50,382-417` |

The current body-to-handoff comparison is exact: EN `handoff_body_len 19815 locked_len 19815 equal True`, EN handoff/actual hash equal; ZH `handoff_body_len 12155 locked_len 12155 equal True`, ZH handoff/actual hash equal. Evidence: `R-article-asset-recheck.md:40-49`.

### 3.2 Title, H1, description, schema, and SEO binding

| Locale | Current title = H1 | Current description | SEO receipt |
|---|---|---|---|
| EN | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | `Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.` | `seoSurfaceHash=68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7`; handoff `seo`/OG/schema at `handoff-en.md:31-50`; registry metadata status remains blocked at `handoff-en.md:324-338`. |
| ZH | `星露谷松树种植先看格子，不浇水也不能随便种` | `松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。` | `seoTupleHash=2e2e2bdb32b9ad6c5ed8b06e50003c748b3f7b41b429cff44dcfec06649933c8`; handoff `seo`/OG/schema at `handoff-zh.md:32-50`; registry metadata status remains blocked at `handoff-zh.md:226-235`. |

Both handoffs explicitly set `schema.@type=Article`, `notFaqPage=true`, `faq=null`, and the shared cover path `/blog/pine-tree-stardew-cover.webp`. This is handoff input evidence only; it does not prove route metadata projection.

### 3.3 Current article-module hashes and public binding

| Locale | Current module SHA-256 | Current source evidence |
|---|---|---|
| EN | `5b61738990dac239d34eb3d7898270929ae6c47ccacb2e9168923a4d6e233bc7` | `src/blog/articles/pine-tree-stardew.en.tsx:1-18` starts with the public `BlogSources`/`PublicPicture` APIs and an article paragraph; figures bind exact public WebP paths and `1672×941`, `loading="lazy"`, `decoding="async"` at `:46-60,201-215`. |
| ZH | `27bbf27a39f964f7d4c83fc28bf620d12faecf028e310f4cb55262fc646508fe` | `src/blog/articles/pine-tree-stardew.zh.tsx:1-20` contains the repaired explicit JSX space; figures bind exact public WebP paths and dimensions/loading at `:70-82,121-133`; final public source item is `/zh/stardew-valley-trees` at `:257-262`. |

The current independent module recheck reports body/link equality, source/module alignment, quote binding, no H1/FAQ/JSON-LD/iframe/residue, correct locale CTA, two figures, lazy/async dimensions, and table wrappers with exit `0`: `R-article-asset-recheck.md:27-129`. Its current per-file hashes are at `:15-23`.

### 3.4 Current local media and receipt binding

`G-assets-receipt.md:8-16,88-103` and the independent recheck `R-article-asset-recheck.md:131-190` bind the following six actual files:

| Role | File | Bytes | SHA-256 | Dimensions / format |
|---|---|---:|---|---|
| Cover WebP | `public/blog/pine-tree-stardew-cover.webp` | 32,094 | `4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517` | 1672×941, lossy VP8 WebP |
| Cover AVIF | `public/blog/pine-tree-stardew-cover.avif` | 19,430 | `6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1` | 1672×941, AVIF |
| Figure 1 WebP | `public/blog/illustrations/pine-tree-seed-to-tar.webp` | 23,214 | `42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d` | 1672×941, lossy VP8 WebP |
| Figure 1 AVIF | `public/blog/illustrations/pine-tree-seed-to-tar.avif` | 17,100 | `bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544` | 1672×941, AVIF |
| Figure 2 WebP | `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` | 20,746 | `1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5` | 1672×941, lossy VP8 WebP |
| Figure 2 AVIF | `public/blog/illustrations/pine-tree-stage-four-neighbor.avif` | 15,994 | `60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0` | 1672×941, AVIF |

The current receipt hash is `05aa4119c97c658ee8480159e5d05633b8331a190b4fdb69256e5b9d27e975c1`. Independent current checks report six files non-empty, all hashes matching, WebP VP8/1672×941/no error, all AVIF files decoding as 1672×941 RGB, and localized cover-alt receipt consistency with exit `0`: `G-assets-receipt.md:88-103`; `R-article-asset-recheck.md:144-190`. This is **PASS_LOCAL_RECEIPT**, not page/render proof.

## 4. Exact registry and route blocker

### 4.1 Current source registration is absent

The current read-only source scan was:

```sh
rg -n -i 'pine-tree-stardew|PineTreeStardew|pine tree stardew' \
  src/blog/blog-post-identities.ts \
  src/blog/blog-copy.ts \
  src/blog/blog-post-registry.tsx \
  src/i18n/public-route-registry.ts \
  public/llms.txt tests
```

It returned no target reference (exit `1`, expected no-match result). Current files prove the cause: `src/blog/blog-post-identities.ts:1-21` has 19 slugs ending at `last-day-to-plant-stardew`, and `src/blog/blog-copy.ts:97-144` has no target EN/ZH path. `getLocalizedBlogPostHref` fails fast for missing locale/slug at `src/blog/blog-copy.ts:161-173`. The current recheck records `target-reference=ABSENT` and `target-test-reference=ABSENT` at `R-article-asset-recheck.md:230-241`.

The intended public route pair is `/pine-tree-stardew` and `/zh/pine-tree-stardew`, as specified at `project-interface-spec.md:63-79`; the intended dynamic route cannot enumerate an unregistered slug.

### 4.2 Exact required metadata values, without guessing

The source contract requires:

- `BlogPostMeta.topic`, `author`, `readTimeMinutes`, `coverImage.src`, `coverImage.alt`, and `featured`: `src/blog/blog-post-registry.tsx:55-67`.
- Non-empty `topic` and `author`: `src/blog/blog-post-registry.tsx:696-700`.
- Positive integer `readTimeMinutes`: `src/blog/blog-post-registry.tsx:701-709`.
- Meaningful cover alt and explicit boolean `featured`: `src/blog/blog-post-registry.tsx:721-729`.
- A function `Content` and valid ordered/non-duplicate slugs: `src/blog/blog-post-registry.tsx:731-785`.

Current handoff registry fields are:

| Field | EN (`en`) | ZH (`zh-CN`) | Exact current evidence |
|---|---|---|---|
| `topic` | `Stardew Valley Guides` | `null` | EN explicit value and `titleEqualsH1=true`: `handoff-en.md:324-338`; ZH explicit null: `handoff-zh.md:226-235`. |
| `author` | `null` | `null` | `handoff-en.md:1-11,324-338`; `handoff-zh.md:1-11,226-235`. |
| `featured` | `null` | `null` | Same current registry blocks in both handoffs. |
| `readTimeMinutes` | `null` | `null` | Same current registry blocks in both handoffs. |

Therefore the exact blocker is **EN `author=null`, `featured=null`, `readTimeMinutes=null`; ZH `topic=null`, `author=null`, `featured=null`, `readTimeMinutes=null`**. EN `topic` is explicit and is not a blocker by itself. No topic, byline, featured boolean, or read time is inferred from another language, another article, body length, or convention. The registry assembly task failed, and the target identity/copy/registry source scan remains empty.

### 4.3 Static output confirms no target page

The later repository build passed, but target output readback found:

```text
out/pine-tree-stardew.html=ABSENT
out/zh/pine-tree-stardew.html=ABSENT
out/ contains only the six Pine media files
Pine target references in out/*.html and out/*.txt: none
Pine target route in .next generated manifests: none
```

Evidence: `R-static-precheck.md:101-150` and current direct `test -e`/`find out` readback. The build generated the currently registered route set only; it did not prove target route integration.

## 5. Verification status matrix

Status values are deliberately limited to **PASS**, **FAIL**, or **UNVERIFIED**. A PASS is scoped to the exact evidence column and is not widened to page/deployment claims.

| Area | Status | Exact evidence and boundary |
|---|---|---|
| Locked EN/ZH content | **PASS** | Current body hashes/bytes/lines, handoff equality, ordered links, source quotes, and body binding pass: `R-article-asset-recheck.md:13-49,73-88`; current locks are the hashes in §3. This does not resolve public registry metadata. |
| Title / H1 / SEO inputs | **PASS** | Current localized title/H1/description/slug/schema/OG fields are explicit and title reviews/receipts are bound to current body hashes: `handoff-en.md:24-50`, `handoff-zh.md:25-50`, `R-article-asset-recheck.md:15-23`. This is handoff/contract evidence, not page projection. |
| Article modules | **PASS** | Current EN/ZH hashes and public API/SSR structure pass: `R-article-asset-recheck.md:15-18,90-129`; current source line readback is in §3.3. |
| Local media files | **PASS** | Six current files are non-empty, hash/format/dimension/decode validated and receipt-bound: `G-assets-receipt.md:88-103`, `R-article-asset-recheck.md:131-190`. Page-layer cover rendering remains unverified. |
| Handoff/receipt consistency | **PASS** | Current handoffs and receipt agree on shared cover/figures, hashes, dimensions, localized figure text, and `PASS_LOCAL_RECEIPT`: `R-article-asset-recheck.md:173-192`; current raw hashes in §3. |
| Typecheck | **PASS** | `pnpm exec tsc --noEmit --incremental false --pretty false` exited `0` with no output in this checkout; the recorded package typecheck also exited `0`: `R-static-precheck.md:25-42`; package script is `package.json:6-13`. `--incremental false` avoided a new tsbuildinfo write for the independent check. |
| Focused tests | **FAIL** | Existing focused selection: 21 passed / 22 total, exit `1`; `tests/assets/public-avif-assets.test.ts:59` still asserts `70`, while current scan observes `73`. Exact output and classification: `R-static-precheck.md:69-99`, `R-article-asset-recheck.md:203-226`. The direct ephemeral target module/media probe passed 2/2, but no committed target test exists. |
| Repository build | **PASS** | `NEXT_TELEMETRY_DISABLED=1 pnpm build` exited `0`, compiled successfully, finished TypeScript, and generated 54/54 current registered static pages: `R-static-precheck.md:101-120`. This PASS is repository-only and does not prove the target route. |
| Target static output/page binding | **UNVERIFIED** | Target EN/ZH HTML/TXT and target manifest references are absent; exact readback is `R-static-precheck.md:122-150` and `R-article-asset-recheck.md:243-259`. |
| Route / registry integration | **FAIL** | Target slug is absent from identities/copy/registry and the G registry task failed; exact source scan and contract are §4.1-§4.2. This is a definite integration blocker, not merely an unrun check. |
| Browser / desktop / mobile | **UNVERIFIED** | No local ego-browser route proof was run in this closeout; the page route is not registered. The required later browser boundary is `project-interface-spec.md:506-537`; `R-static-precheck.md:141-150` records no browser evidence. |
| Deployment / live origin | **UNVERIFIED** | No deployment or external readback was performed; no deployment is authorized or recommended while blocked. `R-article-asset-recheck.md:252-259` and the task scope establish this boundary. |
| User approval | **UNVERIFIED** | Both handoffs retain `userReview=not_started`: `handoff-en.md:340-369`, `handoff-zh.md:382-411`. |
| Cleanup artifacts | **UNVERIFIED** | `node_modules/`, `.next/`, `out/`, and `tsconfig.tsbuildinfo` are present/ignored; `next-env.d.ts` is tracked and clean. This audit did not delete generated artifacts; presence is reported, not treated as a cleanup PASS. |
| Git scope / this report | **PASS** | After-write manifest comparator and `git diff --check` below must show only the allowed target paths plus this report, no tracked/staged diff, and a non-empty report. No commit/push/deploy was performed. |

## 6. Focused test and build interpretation

The focused failure is precise and bounded:

- `tests/assets/public-avif-assets.test.ts:52-65` scans `public/homepage` and `public/blog`, then requires exactly `70` WebPs at line `59`.
- Current readback finds `public_homepage_webp_count=15`, `public_blog_webp_count=58`, `public_article_webp_count=73`, and `public_article_avif_count=73`.
- The three added Pine WebPs have matching non-empty AVIF siblings and independently pass `ftypavif`/decode checks.
- Therefore the test failure is a stale fixed-count contract (`70` versus `73`), not proof of a missing/corrupt Pine derivative. The test was outside this audit's write boundary and was not changed.

The repository build PASS is similarly bounded. It proves only that the current registered application builds. It does not prove target registry identity, route output, browser behavior, deployment, indexing, live origin, or user approval; the absent target HTML/manifests are direct counter-evidence to any broader claim.

## 7. Next-owner requirements and stop conditions

### Required next owner: PublicBlogHandoff/page-metadata owner

Before any page assembly, the next owner must:

1. Supply explicit authorized localized values for EN `author`, `featured`, `readTimeMinutes` and ZH `topic`, `author`, `featured`, `readTimeMinutes`; do not copy existing article values or infer from body length.
2. Keep the EN explicit `topic` and both localized title/description values unless intentionally changed and re-reviewed. If any body/SEO field changes, regenerate the corresponding body/SEO hashes and re-run the content/title checks.
3. Maintain the current receipt-bound six-file media facts and ensure the handoff cover metadata/alt/asset receipt remains bound to the actual cover; do not substitute a figure alt for cover alt.
4. Refresh both handoffs to a validated, assembler-consumable state with current body, SEO, media, and metadata hashes. Re-read the raw handoff hashes after every edit.

### Then: page assembler / registry owner under an explicit grant

Only after the handoff blocker is resolved and a scoped write grant is provided should the page owner:

1. Add the target to identity order, EN/ZH localized paths, registry entries, and the explicitly authorized public route/LLMS/test surfaces; preserve existing entries and fail fast on invalid metadata/order.
2. Bind the current modules and cover/figure receipt without rewriting locked bodies.
3. Run the contract-focused test set from `project-interface-spec.md:449-484`, the build, actual `out/` target-file readback, and local ego-browser checks at both `/pine-tree-stardew` and `/zh/pine-tree-stardew`.
4. Keep route/static, browser, deployment, and user approval as separate evidence categories. A build or source test cannot substitute for browser proof or deployment proof.
5. Resolve the stale AVIF-count assertion only under an explicit test-file grant. It is not repaired by this audit.

### No deployment recommendation while blocked

Do **not** deploy, publish, or claim production readiness while registry metadata, target identity/route binding, focused-test status, page output, browser proof, and user approval remain unresolved. This closeout performed no deployment and recommends none.

## 8. Final scope settlement and verification commands

This dispatch wrote only:

```text
docs/blog-ops/pine-tree-stardew/R-final-blocked-audit-v2.md
```

It did not edit source, tests, assets, handoffs, receipt, registry, identities, copy, locked bodies, other reports, generated artifacts, dependencies, or external state. No browser was required or used, and no commit/push/deploy was performed.

The final read-only verification commands run after writing this report were:

```sh
test -s docs/blog-ops/pine-tree-stardew/R-final-blocked-audit-v2.md
git diff --check
git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/R-final-blocked-audit-v2.md
find docs/blog-ops/pine-tree-stardew -type f -print | sort
# exact allowed-manifest comparator over git status and the 29 report files
```

Actual readback:

```text
test_s_exit=0
git_diff_check_exit=0
git_diff_no_index_check_exit=1  # expected for an untracked file; no whitespace diagnostic
tracked diff: empty
staged diff: empty
report directory file count: 29
docs_manifest_match=PASS
allowed_manifest_match=PASS
public_homepage_webp_count=15
public_blog_webp_count=58
public_article_webp_count=73
public_article_avif_count=73
target_out_html_count=0
target_out_txt_count=0
target_out_references=0
target_next_manifest_references=0
!! .next/
!! node_modules/
!! out/
!! tsconfig.tsbuildinfo
next_env_clean=0
```

The actual status output contained only the expected 29 report-directory files, two source modules, and six public media files; no tracked or staged path was listed. This is the final scope evidence for this report.
