# D-en check: how-to-level-up-farming-stardew

Role: Agent D-en (post-write check only). Recheck after C revision. Did not write the draft or the revision. Did not run 22-rule 鉴文. Did not lock or count Length. Did not generate titles. Did not edit `C-en-draft.md`, `C-en-figures.md`, `src/`, `app/`, or `public/`. Not Agent C. Not Agent E.

| Item | Value |
|---|---|
| Keyword | `how to level up farming stardew` (user original, unchanged) |
| Locale / country | `en` / `US` |
| Site | https://stardewvalleyplanner.art/ |
| Input body | `docs/blog-ops/how-to-level-up-farming-stardew/C-en-draft.md` |
| Figures (awareness) | `C-en-figures.md`; scored as they appear in the reader body, not as production notes |
| Task card | `docs/blog-ops/how-to-level-up-farming-stardew/B-en-layout.md` (I2 selected) |
| Search evidence | `docs/blog-ops/how-to-level-up-farming-stardew/A-en-research.md` + `A-en-facts.md` (2026-09-20) |
| Quality-gate spec | `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` section 五 |
| Gates | `assertResearchTraceAbsent`, `assertReaderValue`, `assertRepetitionAbsent` only |
| Check surface | Reader body only: first article paragraph through Sources, **before** `## Editor appendix (not reader body)`. C’s role header above the `---` is editorial, not scored. |

**Version fingerprint (this draft):**

- File: `docs/blog-ops/how-to-level-up-farming-stardew/C-en-draft.md`
- SHA-256: `bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf`
- Command output: `bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf  docs/blog-ops/how-to-level-up-farming-stardew/C-en-draft.md`
- File H1: `C-en draft: how-to-level-up-farming-stardew`
- First reader H2: `Farming XP comes from harvests, animals, and two books`
- First 40 words of reader body: “Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest), when you pet, milk, or shear animals or pick up a coop product, and when you read the Stardew Valley Almanac or”

This is a **new** D run on **new** bytes. Previous D-en (`D-en-check.md` FAIL) bound SHA-256 `9371fa8aab97bb8dc2cdd2411568177f8d8c45507e5f338f56d6c53829136060`. That FAIL is not carried as PASS. Prior PASS on ResearchTrace / ReaderValue is not inherited; all three gates were re-scored on this hash.

**Overall: PASS.** Must-fix items: **0**. ResearchTrace **PASS**. ReaderValue **PASS**. Repetition **PASS**.

---

## Must-fix 1 recheck (prior FAIL, this hash)

Prior must-fix 1: wiki 0→1 counts (13 parsnips / 8 potatoes / 5 cauliflowers) printed in both H2-2 and H2-3.

**This version:** those three wiki 0→1 counts appear **once** in the reader body, under H2-2 after the level table (`C-en-draft.md` line 86). H2-3 does not recopy 13 / 8 / 5.

**Keep (unique job, H2-2, line 86):**

> “For a first magnitude check, the Farming Experience Points section already converts the early totals into plants: from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers. Derived from those wiki cells, 13 parsnips × 8 XP = 104, which is the first lifetime-parsnip count that exceeds 100. Five cauliflowers × 23 XP = 115, and eight potatoes × 14 XP = 112. Those three products are arithmetic on the printed numbers, not a harvest log.”

H2-2 also owns 0→2 (48 / 28 / 17) and the labeled derived 13×8=104, 5×23=115, 8×14=112. Those strings do not appear in H2-3.

**H2-3 after the execution list (line 149) — different job, not a recopy:**

> “Derived, for the 100 XP that reaches level 1: Kale at 17 XP needs 6 harvests to pass 100 (derived: 6 × 17 = 102). Wheat at 6 XP needs 17 harvests (derived: 17 × 6 = 102). Those products compare plant counts to a total, not days in the ground.”

Kale 6×17=102 and wheat 17×6=102 are forum-crop conversions against the 100 XP total. They are not the wiki 13 / 8 / 5 line. B placed K6 in **H2-2 or H2-3**; this version keeps K6 in H2-2 only.

H2-3 table Why cell `| Parsnip | 8 | Wiki 0→1 and lifetime scale |` (line 113) names why parsnip is on the per-harvest table. It does not restate 13 / 8 / 5 plant counts.

Must-fix 1 is gone.

---

## assertResearchTraceAbsent — PASS

Reader body has no retrieval logs, SERP ranks, assistant residue, repo paths (`docs/`, `src/`, `A-en-research.md`), factory field names (I2, K12, A1, H2-1, ReaderTask, occurrence), W10 fences (“this is not that article” / “this article will not…”), the token `未取得`, canary text, or “we tested / we measured / I planted.”

Factory IDs, `occurrence`, `FAQPage`, `K15–K58`, `U1`, `G1–G8`, and `public/blog/illustrations/…` production paths sit only in the editor appendix. Do not assemble the appendix into `src/`.

Kept as legitimate citation / method (do not strip; do not keyword-kill “source / test / derived”):

- Wiki version **1.6.15** and Farming / Skills page attribution in the second paragraph
- “No in-game harvest test was run for this article.” / “not from a harvest test” / “not a timed test” / “not a harvest log” / “not a timed winter playthrough”
- “This article did not open the game’s `Data/Objects.xnb` file.” — B required this when printing the XP formula; `Data/Objects.xnb` is the wiki-named game file, not a repo path
- Derived arithmetic labeled derived (13×8=104; 5×23=115; 8×14=112; 6×17=102; 17×6=102; 1,875−1,250=625; 50×5=250)
- “That is a source list, not a drop-rate table.”
- “These cells are not gold per day, and they are not XP per day” — table metric caption B required, not a scope fence
- “A kale ranking that needed grow time, energy, and seed cost would be a different sheet.” — table limit (grow time unpublished), not W10 “go finish the task elsewhere”
- Winter Seeds: pages disagree; Winter Seeds page prints no Farming XP; Fiber Seeds page silent — B required the unpublished-number method
- Sources checked-date line; Winter Seeds XP not used because of the page conflict; planner “does not compute Farming XP”
- Natural internal links to rancher / sprinkler / money / seasonal crops / greenhouse (neighboring job in one sentence, not W10)
- Figure alts/captions that refuse fake screenshots
- Design example labeled as a design example (forty tiles), not a harvest test

No ResearchTrace must-fix.

---

## assertReaderValue — PASS

Checked against user keyword `how to level up farming stardew`, NEW-article / content-only scope (do not overwrite rancher, sprinkler, money, seasonal crops, greenhouse), A’s opened US SERP (`hl=en&gl=us`, 2026-09-20), and B’s I2 ReaderTask.

**B did not rewrite intent for the product.** A’s candidates included I6 (calculator). B §8 tool association is **none**. C has no planner step in the reader body. The planner appears only in the Sources checked-line as a limit (“layout tool; it does not compute Farming XP”), which B required. Product CTA did not become the H1 job.

B’s I2 matches the seed (“how to level up”) plus opened R2–R5 ASAP / fast / Year-1-level-9 / How-to-Level-Up form, with I1’s source map as a required sub, I3’s 5/8/9/10 as named gates not a Year 1 calendar, I4 as H2-4 not a second H1, I5 linked to the existing profession URL.

Search evidence is present in A-en; do not send back to A.

| ReaderTask check | This version |
|---|---|
| Opening lands the tutorial answer in the first three sentences | Line 7: first-product harvest, named animal actions, two books; hoe/can do not grant; stack to 2,150 / 6,900 / 10,000 / 15,000. |
| Which actions grant Farming XP | H2-1 source list + Fig 1. |
| Hoe / watering can themselves; sprinkler-watered tiles still level on harvest | H2-1 H3 “Watering and hoeing do not grant Farming XP” + Fig 1 caption. Not rewritten as “must hand-water to level.” |
| Extra potato / blueberry / cranberry on one pull; quality does not change XP | H2-1 H3 + Fig 2 (10 / 14 / 14). |
| Truffles are Foraging, not Farming | H2-1 animals H3, one sentence. Pig pet still 5. |
| Cumulative 100…15,000; gates 5 / 8 / 9 / 10 | H2-2 table. 5 = 2,150 profession click; 8 = 6,900 Keg recipe; 9 = 10,000 Seed Maker + Iridium Sprinkler; 10 = 15,000. |
| Skills tab now; recipes / profession after sleep; same-day shipping misses the new bonus | H2-2 H3 + four-step check. |
| Forum-named crops checked on wiki per-harvest XP; no “fastest crop” / XP per day | H2-3 short table + “Cauliflower at 23 is higher per harvest than kale at 17”; wheat/hops 6. Grow time not invented. |
| gold/day ≠ harvest XP (Starfruit 43 vs cranberry extras) | H2-3 + links to spring / summer / fall gold pages. |
| 0→1 / 0→2 parsnip / potato / cauliflower magnitude | Present under the H2-2 table only (K6/K11 + labeled derived). |
| Winter remaining sources; no Winter Seeds XP number as a published cell | H2-4: Powdermelon 12 only winter XP-table crop; animals 5; books 250; greenhouse harvest. Winter Seeds page has no number; winter table has no Winter Seeds row. |
| Profession choice not a new H2 | One sentence + `/rancher-or-tiller-stardew`. No 10%/20% sell table. |
| Sprinkler placement not a new H2 | One sentence + `/sprinkler-stardew`. No 4/8/24 coverage. |
| Year 1 calendar / keg profit / calculator / Hypixel / Mastery guide | Absent as sections. Mastery is one Book Of Stars appositive (1,125). |
| Figures help the main job | Fig 1 source/non-source after the H2-1 list; Fig 2 first-product in the extra-produce H3. Cover is not used as a body figure. WebP binding is G, not this gate. |
| FAQ H2 | None (B default). |
| Multi-intent encyclopedia? | No extra H2 for I3, I4-as-H1, I5, I6, gold/day rank, greenhouse 10×12, or Year 1 gold. |

Reader can finish I2: tell granting vs non-granting actions, pick a named total, harvest by first-product XP rather than extra berries or gold/day, use 5-XP animals and 250-XP books when harvests thin, check the skills tab the same day and sleep for the popup.

No ReaderValue must-fix. Do not send C to invent grow times, Winter Seeds = 3 or 0, YouTube steps, PAA accordion answers, a Year 1 calendar, keg profit, or a planner XP step.

---

## assertRepetitionAbsent — PASS

Must-fix items: **0**.

Two tables still have different jobs (level totals + lifetime parsnips + overnight names vs short per-harvest XP). No FAQ. Figure captions teach the figure; they are not a second source table. Wiki 0→1 13 / 8 / 5 lives in one H2.

### Not scored as must-fix (different jobs, or B-required)

- Opening source sentence vs H2-1 K2 list vs Fig 1 caption — tutorial answer, then mechanism, then required figure.
- H3 watering vs the source map — query-3 sprinkler misconception, not a second source table.
- H3 extra-produce + Fig 2 vs H2-3 table Why cells vs table intro “first product” note — dedicated rule, then required table caption.
- H2-3 “Starfruit at 43 versus cranberry extras…” — gold/day ≠ XP, B’s one-sentence sub-question, not a second first-product H3.
- H2-3 execution list (prefer higher first-product XP; count harvest events; do not plant extra berries; animals/books when gold/energy is the limit) — decision fork B required.
- H2-2 H3 four-step skills-tab check vs winter last paragraph — result check vs B’s executable ending on the winter branch.
- H2-4 “The rest of the source map still works” (animals 5, books 250, greenhouse harvest) — winter remaining sources, required sub-question I4-as-branch.
- H2-3 kale 6×17=102 and wheat 17×6=102 — forum-crop plant counts to 100 XP, not the wiki 13 / 8 / 5 job in H2-2.

### Optional (not must-fix)

1. H2-2 line 84 first sentence lists the same overnight names the table already shows. Unique remaining work in that paragraph is the sprinkler and profession internal links, plus “Levels 1, 3, and 7 still sit on the XP totals.” Unpatched.
2. H2-3 line 138 then names blueberry 10 and potato 14 as “summer/spring version of that split” after Fig 2 and the table Why cells already taught extra produce. Unique remaining work is Starfruit 43 vs cranberry extras as gold vs XP. Unpatched.
3. Winter line 157 tail “including 3 and including 0” names the unpublished pair while saying they are not used. The disagreement + “Winter Seeds page does not print a number” is the method B asked for. Unpatched; not a retrieval log.

---

## Overall

| Gate | Result |
|---|---|
| assertResearchTraceAbsent | **PASS** |
| assertReaderValue | **PASS** |
| assertRepetitionAbsent | **PASS** (must-fix 1 gone; 13/8/5 only in H2-2) |

**This version: PASS.** Must-fix items: **0**.

Bound only to SHA-256 `bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf`.

```
bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf  docs/blog-ops/how-to-level-up-farming-stardew/C-en-draft.md
```

A later C edit needs a new D run on the new bytes. Length, SEOTruth, 22-rule 鉴文, titles, and lock remain out of D’s scope. Whether scythe-history, Almanac infobox sources, or Book Of Stars 15,000g / 25% should stay is E’s fact/citation job, not these three gates.

Old FAIL on `9371fa8aab97bb8dc2cdd2411568177f8d8c45507e5f338f56d6c53829136060` is not this version. Old PASS on the other two gates was not inherited; they were re-scored here.

### Residual risks (not failures)

1. Fig 1 and Fig 2 are markdown images with teaching alt/caption. G still binds the `.webp` files. Cover is G assembly, not a body figure.
2. Do not assemble the editor appendix into `src/`.
3. Almanac drop-source list and 1.3.27 scythe-history sentence sit inside the books H3; they are not extra H2s.
4. Winter close restates named totals and the non-source list as a check; treated as B’s ending, same pattern as other EN D residuals.
5. Planner limit lives only in Sources, as B required.

PASS. Must-fix items: 0. Draft not edited.
