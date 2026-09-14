# D-en check: fall-crops-stardew

Role: Agent D-en (post-write check only). Did not write the draft. Did not run 22-rule 鉴文. Did not lock or count Length. Did not generate titles. Did not edit `C-en-draft.md` or `src/`.

| Item | Value |
|---|---|
| Keyword | `stardew fall crops` |
| Locale / country | `en` / `US` |
| Site | https://stardewvalleyplanner.art/ |
| Input body | `docs/blog-ops/fall-crops-stardew/C-en-draft.md` (C patch after D FAIL: last-plant roster) |
| Task card | `docs/blog-ops/fall-crops-stardew/B-en-layout.md` (I2) |
| Search evidence | `docs/blog-ops/fall-crops-stardew/A-en-research.md` (2026-09-14) |
| Gates | `assertResearchTraceAbsent`, `assertReaderValue`, `assertRepetitionAbsent` only |
| Check surface | Reader body only: first article paragraph through Sources, **before** `## Editor appendix (not reader body)`. C’s role header above the `---` is editorial, not scored. |

**Version fingerprint (this draft):**

- File H1: `C-en draft: fall-crops-stardew`
- First reader H2: `Best outdoor fall crop depends on year, the shop you can open, and the tiles you can water`
- First 40 words of reader body: “There is no single best outdoor fall crop. Year 1 at Pierre’s is a tile choice among cranberries, pumpkins, and grapes; Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed are conditions on that same gold/day table. Rank”
- H2-5 last-plant line (this patch): “Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.”

Old FAIL does not carry. All three gates were re-run on this text.

**Overall: PASS.** Must-fix items: **0**.

H2-5 does **not** recopy the full last-plant roster. Amaranth 21 / artichoke 20 / yam 18 / beet 22 / bok choy or wheat 24 / sunflower 20 are gone from that paragraph. Missed-water restatement is gone from H2-5 (stays in H2-2).

---

## Delta vs last D FAIL

Reader-body changes found: H2-5 first paragraph; H2-3 cranberry close; H2-5 lower-row prose.

| Before (FAIL version, not this version) | This version |
|---|---|
| H2-5: “A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1. Amaranth after 21, artichoke after 20, yam after 18, beet after 22, bok choy or wheat after 24, sunflower after 20 — same rule.” plus missed-water restatement | Pointer + the three B-named wilt examples only. No full roster. No missed-water recopy. |
| H2-3 cranberry closed with extra-berry 10% outside 18.89g | Ends on occupancy / published gold/day cell, not a separate “low maintenance” score. 10% remains in H2-1 and table notes. |
| H2-5 listed fairy rose 7.5g, wheat 3.75g, bok choy cycle, yam 10 days, amaranth scythe, eggplant 11.2g | Names those rows as legal Year 1 Pierre, cheap/short ≠ first, wheat 10g still 3.75g/day. |

Appendix is not scored as reader body.

---

## assertResearchTraceAbsent — PASS

Reader body has no retrieval logs, SERP ranks, assistant residue, repo paths (`docs/`, `src/`, `A-en-research.md`), factory field names (I2, K12, A1, H2-1, ReaderTask), author-scope fences (“this article will not…”), the canary `V7-FALL-CROPS-CANARY-9f2c1e44`, or the token `未取得`.

The H2-5 shrink did not add process notes. Spring/summer/greenhouse/money/sprinkler links still name the neighboring job in one sentence. They are not W10 fences.

Kept as legitimate method / citation (do not strip):

- Wiki gold/day formula and Crops-page assumptions in H2-1
- “The wiki does not name a ‘last plant day.’” / “not a wiki field name”
- Table notes pinning two berries in 18.89g, pumpkin one-cycle 16.92g, Broccoli N/A ≠ Pierre 0g, Pierre second column Out of season not Joja
- Legal wiki links (Fall, Crops hashes, Pierre, crop-name item URLs as reader navigation)
- Derived last-plant arithmetic labeled derived
- Sources checked-date line and PublicReference URLs from A/B section 11
- Optional planner sentence with T1 limits
- Figure alts/captions that refuse fake screenshots and a triggered 1% giant

Editor appendix after the separator still has Agent notes, `未取得` lists, and `public/blog/illustrations/…` production paths. Do not assemble it into `src/`.

No ResearchTrace must-fix.

---

## assertReaderValue — PASS

Checked against keyword `stardew fall crops`, NEW-article scope (do not rewrite `best-spring-crop-stardew` or `summer-crops-stardew`), A’s US SERP (I2 rank with I1 table as material), and B’s ReaderTask.

The last-plant trim did not drop the required sub-question: the H2-2 table still lists A1 dates; H2-5 still executes the late-trip check with pumpkin 15 / fairy rose 16 / sweet gem 4. Extra-berry 10% still sits in H2-1 and table notes. Lower Pierre rows still lose to cranberry 18.89g. Product CTA still did not rewrite the intent.

| ReaderTask check | This version |
|---|---|
| Main intent rewritten into a planner pitch? | No. One optional H2-6 sentence + T1 limits. |
| Rank outdoor fall by shop + wiki gold/day + occupancy? | Opening + one gold/day table with Access on the same rows + Year 1 fork + Year 2/Oasis/cart scenes. |
| Year 1, no Rare Seed, no Oasis: highest outdoor cell is not Sweet Gem and not artichoke | Opening, table Access, H2-3 drop list, H2-4 close, FAQ 2. Cranberry about 18.89g on Pierre. |
| Pumpkin about 16.92g is one 13-day cycle, not two-planting season profit | H2-1, table Access, table notes, H2-3 pumpkin, FAQ 1/5. |
| Grape 16.8g and trellis walk-block | Table + H2-3 grapes + Fig 2 / H2-6. |
| Sweet Gem about 83.33g needs Cart Rare Seed 1,000g, not Year 1 Pierre | H2-1, table row, H2-4. |
| Artichoke 16.25g is Year 2 Pierre, still below cranberry 18.89g | Table + H2-4. |
| Beet is Oasis: 20g, not Pierre Fall Stock; no Sandy hours / bus gold | Table + H2-4. A 未取得 gates not invented. |
| Sunflower **−15g**; corn Fall-only about 1.92g | Table + H2-5. |
| Pumpkin last-plant 15, fairy rose 16, sweet gem 4 labeled derived `28 − grow days` | H2-2 last-plant table + method sentence + H2-5 three-example check. |
| Cranberry Fall 1 picks 8/13/18/23/28 vs pumpkin 13-day cycle on one tile | Table Access, Fig 1 caption, H2-3 cranberry. |
| Same bed: grape row + walk tile, pumpkin 3-by-3, cranberry rectangle | H2-3 fork + Fig 2 + H2-6 steps. |
| Watering-can ceiling as Year 1 plant count | H2-1 wet-tile rule + money-article link. |
| I1 list as ranking material | One gold/day table; not a second “what can I grow” table. |
| FAQ + sources required | Five short FAQ answers; Sources list uses A/B section 11 URLs. |
| I4 Bundle walkthrough / I5 keg / greenhouse 10×12 / Year 1 gold loop / SVE / winter | Not extra intents. Bundle is pumpkin apposition only. |

Reader can finish B’s task: shop this morning → wiki gold/day → wet tiles and occupancy.

Figures are present and teaching. File binding is G, not this gate.

No ReaderValue must-fix. Do not invent Oasis hours, Cart Friday/Sunday, Night Market, Broccoli seed routes, Pierre Wednesday, keg math, or hive values for C to add; A marked those 未取得.

---

## assertRepetitionAbsent — PASS

Must-fix 1 from the prior FAIL is **closed**. H2-5 no longer recopies the full last-plant roster.

**Keep (unique job):** H2-2 derived last-plant table, the “wiki does not name a last plant day” method sentence, and the wilt-on-Winter-1 sentence after that table.

H2-5 first paragraph is now the allowed late-trip check only:

> “Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.”

That is a pointer plus the three examples B named for H2-5, not a second roster. H2-5’s unique remaining job is the drop-outs: sunflower **−15g**, corn Fall-only about 1.92g, Broccoli N/A ≠ Pierre 0g, Ancient Fruit not a same-season outdoor finisher, cheap/short Pierre rows not first.

Not scored as must-fix (different jobs, B required):

- One gold/day ranking table vs one last-plant calendar table
- Gold/day formula stays in H2-1; table notes are the required caption, not a new method section
- H2-3/H2-4 apply table numbers to occupancy scenes
- FAQ 1–5 are short PAA answers (B’s five questions), not a second ranking table and not a reprint of H2-2/H2-3

### Optional (not must-fix)

1. H2-6 close (“Before you pay Pierre, walk the tiles… name the crop, the shop…”) still restates H2-2’s three table questions as a buy-check. Unpatched; summer residual pattern.

No Repetition must-fix.

---

## Overall

| Gate | Result |
|---|---|
| assertResearchTraceAbsent | **PASS** |
| assertReaderValue | **PASS** |
| assertRepetitionAbsent | **PASS** |

**This version: PASS.** Must-fix items: **0**.

Bound only to the fingerprint above, including the H2-5 three-example last-plant line. A later C edit needs a new D run. Length, SEOTruth, 22-rule 鉴文, titles, and lock remain out of D’s scope. Whether standalone `/Cranberries` item URLs may stay as reader nav is E’s citation job, not these three gates.

### Residual risks (not failures)

1. Figure 1 and Figure 2 are markdown images with teaching alt/caption. G still binds the `.webp` files.
2. Do not assemble the editor appendix into `src/`.
3. Crop-name links use canonical wiki item URLs; A did not open those standalone pages as number sources. Sources list is the opened Fall / Crops / Pierre / site set.
4. Pumpkin “Autumn's Bounty and the Fall Crops Bundle” is infobox apposition, not an I4 walkthrough.
5. Cannoli Stardrop swap is the one-sentence aside B allowed.
6. H2-6 close still overlaps H2-2’s three table questions as an executable ending.

PASS. Must-fix items: 0.
