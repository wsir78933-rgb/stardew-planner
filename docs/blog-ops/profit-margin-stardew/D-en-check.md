# D-en check v1 — first independent three-gate check

Check ID: `D-en-check-v1-first-2026-09-22`
Checked: 2026-09-22 (Asia/Shanghai)
Scope: independent D check of the English candidate only. This is not an E review, F lock, title/description review, page acceptance, or permission to edit the candidate body.

## Version binding and scope

| Input | SHA-256 (raw bytes) | Read-only location |
|---|---|---|
| C candidate | `78076e78dc01a1b6d8b4c3244c3f1eb946277746f805459c47a932c1dbec040a` | `docs/blog-ops/profit-margin-stardew/C-en-draft.md` |
| A research | `0318934f8185284b2ce938cdd933546bd5e2df10ca31324d11ab59615e3c8790` | `docs/blog-ops/profit-margin-stardew/A-en-research.md` |
| B layout | `d6b4fa5f7511391a4d8f466e95ab6a02aefd2d281a09e68c71eb210c9fb1887e` | `docs/blog-ops/profit-margin-stardew/B-en-layout.md` |
| V7 02 | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` | `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` |
| V7 03 | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` | `/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md` |
| V7 05 | `751b4591788345831c079930f9a6e98cd7189475e9488485a7ff4a168e407c7f` | `/Users/wusir/Desktop/博客-V7修订版/05-验收负例与测试.md` |

The reader-body boundary used here is C lines 7–153, with the `Sources` section treated as a public citation block and C lines 1–5 plus 155–177 treated as the internal file envelope/appendix. V7 requires D to report exact locations and hand body problems back to C; D made no edits to C, A, B, app, src, public, or `package.json`.

## Executive result

**D result: REVISE before E.** The textual ReaderTask is coherent and the reader can understand, choose, and set one new-farm Profit Margin value. ResearchTrace is clean for the bounded reader body, but the file contains explicitly internal envelope/appendix material that must stay out of the public handoff; Repetition has two real repair clusters; the two visual slots have semantic jobs but no actual public assets were available, so final figure/page proof is unverified.

## 1. ResearchTrace

**Result: PASS for the bounded reader body; PUBLIC-EXPORT HOLD for the whole file.** This is not an E fact or SEO approval.

### Legitimate public references and reader-facing method

| Location | Exact candidate material | Decision and basis |
|---|---|---|
| C:9 | “Profit Margin in [Stardew Valley](https://stardewvalleywiki.com/Options) is the game's multiplier for selected item sale prices and seed prices.” | Legitimate inline public citation for the definition; it does not expose a search log. |
| C:26 | “The [Stardew Valley Wiki's Options page](https://stardewvalleywiki.com/Options) states that fractional prices are truncated to an integer and never fall below 1g.” | Legitimate source-linked mechanics and necessary rounding explanation. |
| C:41 | “One concrete source example shows why the rounding rule belongs next to the percentage table: the [Multiplayer page](https://stardewvalleywiki.com/Multiplayer) gives Wheat as 6g at 25% instead of 25g.” | Legitimate public example plus a reader-useful boundary (“example of the rule”), not a SERP or research-log report. |
| C:45 | “The [Stardew Valley Wiki's Multiplayer page](https://stardewvalleywiki.com/Multiplayer) lists both the affected sale categories and the costs that remain outside the multiplier.” | Legitimate source-to-claim mapping needed to use the matrix. |
| C:69, C:134 | Figure captions state what each diagram explains and that Figure 2 is a platform-neutral diagram, not a platform-specific screenshot. | Legitimate limitation/interpretation needed for a reader; not an internal asset-production log. |
| C:88, C:94, C:120, C:130, C:144, C:146 | Planning scenario, “editorial guidance, not a Wiki rule,” platform/version qualifier, and stop/verify branches. | Reader-facing distinction between example, source fact, and unverified platform behavior. These are useful safety/uncertainty disclosures, not “the research says” residue. |
| C:150–153 | “Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer” plus two reader-readable public links. | Legal public citation block required by B and V7; it must not be removed as if it were a research log. |

The live source-status check returned HTTP 200 for both public URLs. This confirms reachability only; it does not replace E's claim-by-claim fact review.

### Internal material that must not enter the public body

| Location | Exact material | Required treatment |
|---|---|---|
| C:1–5 | `# C-en draft: profit-margin-stardew`; “Role: Agent C-en (writing only)... D/E review”; `Keyword... Locale... Country...`; “Inputs: A-en-research.md, B-en-layout.md...” | Internal role, workflow, and input metadata. Keep outside the locked reader body/page export. If this file is handed to assembly as a whole, this is a ResearchTrace failure. |
| C:155–173 | `## Editor appendix (not reader body)`, figure-slot table, “G locks the final public filename/path,” `PublicReference list`, and the internal CTA/assembly note | Correctly marked as non-reader material, but still a public-export hold. Move it to a handoff/report or have assembly consume only the reader body plus the public `Sources` block. |
| C:175–177 | `### Writer checks recorded for D/E input` and the claim `mechanical_units=2249 ... anti-slop rg scan ... not a D/E ... conclusion.` | Internal process log, not public copy. It is also stale for this C hash: the fresh V7-bounded count below is 2,616, so this record must not be reused as D evidence. |

The distinction is therefore semantic, not a keyword blacklist: public source links and reader-needed caveats remain; role names, input-file lists, assembly instructions, IDs, local workflow observations, and stale check output do not.

## 2. ReaderValue

**Result: PASS for the single textual ReaderTask; MEDIA UNVERIFIED before final acceptance.** B:35–37 defines one job: understand what Profit Margin changes, choose a value for a new solo/co-op farm, and find the setting during new-game setup.

| Required reader outcome | Candidate evidence | D observation |
|---|---|---|
| Explain the setting rather than an accounting margin | C:9–13, especially “this setting is not a calculation of net earnings divided by revenue” | Direct answer appears at the start; no real-world accounting lesson or formula was added. |
| Interpret all four values and the rounding/floor rule | C:15–41, table C:19–24, rounding C:26, 75% answer C:35–41 | The table is a lookup and the 75% subsection answers its observed PAA question once. C:9 first paragraph is 49 English words, within B's 40–60-word opening target. |
| Separate affected prices from fixed costs/rewards | C:43–65, matrix C:57–63, Figure 1 slot C:67–69 | Categories, Wheat, and Crab Pots are named; the prose explains how to classify a surprising price. |
| Choose conditionally, with no universal “best” claim | C:75–116, decision matrix C:79–84, checklist logic C:86–90, `Is 75%...` C:112–116 | Solo/co-op/challenge and desired pace are treated as inputs. No calculator, crop ranking, exact pacing multiplier, or completion-date promise was introduced. |
| Locate and confirm the new-farm setting | C:118–146, ordered path C:124–128, Figure 2 C:132–134, checklist C:138–146 | The new-game Advanced Options path and platform/version stop branch are actionable; existing-save editing is not invented. |
| Stay on one intent | C:7–146 | The Year 1 money link at C:116 is one relevant follow-up. No second money-making, calculator, planner tutorial, or unrelated PAA section was added. |

### Image duty

The semantic image roles pass at the Markdown/layout level:

- Figure 1 at C:67–69 follows the affected/unaffected matrix and explains the selected-price boundary with Wheat and Crab Pots.
- Figure 2 at C:132–134 follows the ordered setup path and explains the new-game menu path, with an explicit platform-neutral limitation.
- This matches B:253–279, including the distinct jobs and required placements; the table/prose/figure repetition here is intentional information design, not a duplicate FAQ.

The actual media gate is **UNVERIFIED**. C:67 and C:132 use `fig-01-price-boundary` and `fig-02-advanced-options-path`, which B:257 and B:271 define as semantic IDs only; no matching public asset files were found in this checkout. There is therefore no evidence here for final WebP/AVIF bindings, 1672×941 dimensions, byte budget, usage rights, mobile legibility, or rendered image visibility. Do not call the final image or page requirement passed from this Markdown alone; route asset binding and browser proof to G/E.

## 3. Repetition

**Result: FAIL / REVISE.** The following are true same-role repetitions; they are not rejected merely because the same facts appear in prose, a lookup table, and a separately explanatory diagram.

### R-1: decision matrix restated as a second decision list

- C:79–84 already gives the four conditional rows: Normal for a standard solo start; 75/50/25 for co-op by desired constraint; 50/25 for a deliberate challenge; and 75% for a noticeable but not lowest setting.
- C:88 then says: “Here is a decision example, clearly marked as a planning scenario rather than a measured run. A solo player starting a first farm can select Normal because the reference economy removes one extra variable while the player learns the game. A co-op group can select 75% if it wants lower selected sales and covered seed prices but does not want the lowest choice. An experienced group that deliberately wants its sale income to compete with unchanged fixed costs can select 50% or 25%. None of these choices predicts a completion date; each one states the constraint the players are choosing.”

The paragraph repeats the first three matrix choices in the same order and adds no new reader input; the “planning scenario” and no-completion-date caveat can be retained once elsewhere. **Action for C:** keep the matrix as the lookup, then either remove C:88 or replace it with one genuinely new worked decision using explicit inputs not already enumerated by C:79–84. Do not repeat the full matrix in prose.

### R-2: setup stop branch repeated three times

- C:130: “The setting is attached to this new-farm decision. Do not infer a platform-specific repair or existing-farm procedure from the menu path; those are separate procedures that need their own current verification.”
- C:144 repeats the existing-save boundary and the platform-label mismatch stop: “If the wrench or Advanced Options labels differ from the documented path on your platform or version, pause and obtain current, platform-specific guidance; this new-game path does not establish an existing-save procedure.”
- C:146 repeats both the matrix return and the same mismatch stop: “If the answer to the last check is unclear, return to the affected/unaffected matrix before choosing a percentage. If the menu does not match the documented high-level path on your platform or version, pause rather than guessing at an unsupported procedure. The safe next action is a platform-specific, current source check.”

C:130 has a useful scope warning, and C:144 has a useful actionable mismatch branch, but C:146 repeats the same branch without a new condition. **Action for C:** consolidate C:130/C:144/C:146 into one local existing-save boundary plus one platform-mismatch stop; preserve the safe action and remove the duplicate wording.

### Repetition explicitly not counted as a failure

- C:19–24 (four-value lookup) and C:35–41 (direct 75% explanation plus Wheat example) have different jobs.
- C:49, C:53, C:57–65, and C:67–69 use prose, exact matrix, and visual boundary respectively; B:245 explicitly allows these forms when each has a distinct job.
- C:124–128 and C:134 repeat the path because the caption must explain the diagram; this is a required image interpretation, not a second FAQ.
- C:30–33 and C:71–73 both teach classification, but the first is the price-check procedure and the second is the post-matrix failure branch. They can be tightened later, but the evidence does not establish a same-role duplicate as strongly as R-1/R-2.

## Mechanical observations (not F/E approval)

| Observation | Fresh result | Meaning |
|---|---|---|
| V7 count script, direct file input, `--locale en --exclude-heading Sources --exclude-heading 'Editor appendix'` | `mechanical_units=2742`, required floor 2000, exit 0 | Includes C's internal header metadata and two body captions; it is not the V7-qualified body count by itself. |
| V7-bounded read-only reconstruction | `2616` English units after removing C:1–6, `Sources`, `Editor appendix`, image alt text, and the two captions; exit 0 | Meets the 2000 floor mechanically but is 316 above B's 2,300 upper target. F owns final Length/qualification; this is not a D Length verdict. |
| Raw C encoding/hash | UTF-8, no BOM, 0 CRLF; raw and NFC/LF SHA-256 both `78076e...ec040a` | Stable version evidence for this first check. |
| Opening snippet | C:9 = 49 English words | Meets B's 40–60-word placement target mechanically. |
| Citation links | 4 inline external links in reader body (C:9, C:26, C:41, C:45), 1 internal Year 1 link (C:116), 2 public source-list entries (C:152–153), 2 distinct external URLs | Required Options and Multiplayer URLs are present and ordered correctly; link coverage is mechanical, not proof that every claim is factually supported. |
| Public source reachability | Options HTTP 200; Multiplayer HTTP 200; both curl exit 0 | Reachability only; no E fact/source audit is claimed. |
| Figure references | 2 semantic Markdown figure references; 0 matching public asset files found | Semantic placement is present; real media/render proof remains unexecuted. |
| Public-body contamination scan | Boundary-aware `rg` found no SERP/PAA/rank/competitor/local-path/workflow terms in C:7–153; no-hit `rg` exit 1 | Supports the bounded ResearchTrace result; semantic review still controls. |

The 2,616 count also explains why C:177's internal `mechanical_units=2249` must not be reused. The count is an observation for C/F, not a reason to pad or to merge another search intent.

## Executable modification list for C-en / handoff owners

1. **C, body:** resolve R-1 at C:79–88. Keep one decision matrix and one non-redundant example; do not restate all matrix rows.
2. **C, body:** resolve R-2 at C:130/C:144/C:146. Keep one existing-save boundary and one platform-mismatch stop, with the safe next action stated once.
3. **C, citation placement:** add the Options public link beside the setup-path claim at C:120–128, as required by B:218–220. Then rerun D on the new C hash; do not rely on this report after any body change.
4. **C-to-G handoff:** keep the two semantic figure jobs and placements, but do not represent the IDs at C:67/C:132 as final assets. G must bind real legal assets and prove format, dimensions, budget, accessibility text, visibility, and mobile readability before the image/page requirement can pass.
5. **C/F handoff:** remove or relocate C:1–5 and C:155–177 from the reader/public body. In particular, remove the stale writer-check paragraph containing `mechanical_units=2249`; use this version-bound report and a later fresh count instead.
6. **F/E handoff:** treat 2,616 as a mechanical observation above B's 2,300 target, not as D approval. F must decide final qualified length after C's repetition repair; E must independently review the resulting hash.

## Not executed / not authorized by this D task

- No C body, A research, B layout, app, src, public, `package.json`, asset, or page file was edited.
- No F lock, title/description, SEOTruth, 22-rule E review, or independent final fact audit was executed.
- No G page assembly, local build, static export, local ego-browser desktop/mobile review, route check, image rendering check, or deployment check was executed.
- No claim is made about production URLs, indexing, ranking, conversion, or user approval.

## Real verification commands and exit codes

| Command/check | Result | Exit |
|---|---|---:|
| `shasum -a 256` over C/A/B and V7 02/03/05 | Hashes recorded in Version binding | 0 |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-en-draft.md --locale en --exclude-heading Sources --exclude-heading 'Editor appendix'` | JSON reported 2742 units, floor true, raw SHA above | 0 |
| Read-only V7-bounded extraction using the same counter's `extract_body`/`count_units`, excluding file envelope, `Sources`, `Editor appendix`, and captions | Reported 2616 units | 0 |
| Boundary-aware `rg` reader/process-residue scan over C:7–153 | No matches (expected); `rg` exit 1 | 1 (expected no-hit) |
| `rg '^!\['` plus `find public` figure-name search | Two semantic references; no matching public asset files | 0 |
| `curl -fsS -L --max-time 20` for Options and Multiplayer | HTTP 200 for both; curl exit 0 | 0 |

This file is the first D check for the bound C hash. It does not grant E or F approval.
