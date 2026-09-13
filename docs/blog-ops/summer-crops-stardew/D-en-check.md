# D-en check: summer crops stardew

Role: Agent D-en (post-write check only). Did not write the draft. Did not run 22-rule 鉴文. Did not lock or count Length. Did not generate titles. Did not edit `C-en-draft.md` or `src/`.

| Item | Value |
|---|---|
| Keyword | `summer crops stardew` |
| Locale / country | `en` / `US` |
| Site | https://stardewvalleyplanner.art/ |
| Input body | `docs/blog-ops/summer-crops-stardew/C-en-draft.md` (C patch after E: Luau 3,000g) |
| Task card | `docs/blog-ops/summer-crops-stardew/B-en-layout.md` (I2) |
| Search evidence | `docs/blog-ops/summer-crops-stardew/A-en-research.md` (2026-09-13) |
| Gates | `assertResearchTraceAbsent`, `assertReaderValue`, `assertRepetitionAbsent` only |
| Check surface | Reader body only: first body paragraph through the H2-6 close, **before** `## Editor appendix (not reader body)` |

**Version fingerprint (this draft):**

- File H1: `C-en draft: summer crops stardew`
- First reader H2: `Best outdoor summer crop depends on year, the shop you can open, and the tiles you can water`
- First 40 words of reader body: “There is no single best outdoor summer crop. Starfruit sits at the top of the wiki gold/day table only after you can reach Oasis and pay 400g a seed; Year 1 at Pierre’s is a tile choice among blueberry, melon, and hops;”
- Luau line (this patch): “The Luau sells one starfruit per year for 3,000g. That is a festival shop aside, not a field plan and not a gold/day cell.”

Old PASS does not carry. All three gates were re-run on this text.

**Overall: PASS.** Must-fix items: **0**.

Luau wording: **purchase/sells**, not “worth.” Exact reader sentence: “The Luau sells one starfruit per year for 3,000g.” (“worth” does not appear in that sentence. Unrelated occupancy line “They are still worth tiles” remains in H2-3 and is not a gold claim.)

---

## Delta vs last D PASS

Only reader-body change found: H2-4 Starfruit aside.

| Before (not this version) | This version |
|---|---|
| “One starfruit per year at the Luau is worth 3,000g. That is a festival aside, not a field plan and not a gold/day cell.” | “The Luau sells one starfruit per year for 3,000g. That is a festival shop aside, not a field plan and not a gold/day cell.” |

PublicReference `wiki-starfruit-luau` appliesTo in the appendix now matches the new quote. Appendix is not scored as reader body.

---

## assertResearchTraceAbsent — PASS

Reader body has no retrieval logs, SERP ranks, assistant residue, repo paths, figure-slot production labels, or W10 “this is not that article” fences.

The Luau rewrite is a shop/sell fact plus a metric aside (“not a gold/day cell”). It is not an author scope command.

Kept as legitimate method / citation:

- Wiki gold/day formula and Crops-page assumptions in H2-1
- “The wiki does not name a ‘last plant day.’”
- Pale Ale “This table does not rank Pale Ale…” (metric)
- Ancient Fruit → `/glasshouse-stardew-valley` (“not this outdoor table” is crop destination)
- Figure 2 “Occupancy on one bed, not a 1% giant already rolled”
- Optional planner sentence with T1 limits

Editor appendix after the separator still has Agent notes and `public/blog/illustrations/…` paths. Do not assemble it into `src/`.

No ResearchTrace must-fix.

---

## assertReaderValue — PASS

Checked against keyword `summer crops stardew`, NEW-article scope (do not rewrite `best-spring-crop-stardew`), A’s SERP, and B’s I2 ReaderTask.

The Luau line stays a one-sentence aside (B: Luau 3,000g is a side note, not a new H2). Changing “worth” to “sells … for” does not add an I4/I5/festival intent and does not turn the piece into a planner pitch.

| ReaderTask check | This version |
|---|---|
| Main intent rewritten into a planner pitch? | No. One optional H2-6 sentence + T1 limits. |
| Year 1, no desert: highest outdoor wiki gold/day is not Starfruit | Opening + table Access + H2-3 (blueberry 20.8g on Pierre). |
| Oasis Starfruit gold/day is one 13-day cycle, not a season-total | H2-1: ~26.92g = (750g − 400g) / 13. |
| Year 2 Red Cabbage on the same table | 17.78g; Pierre 100g year 2+; H2-4 occupancy vs blueberry. |
| Blueberry / melon / hops cannot share one occupancy assumption | H2-3 fork + H2-6 bed + both italic captions. |
| Melon last-plant 16 and Starfruit last-plant 15 labeled derived | Last-plant table + `28 − grow days`. |
| Watering-can ceiling as Year 1 plant count | H2-1 wet-tile rule + money-article link. |
| I1 list as ranking material | One gold/day table with access on the same rows. |
| I4 / I5 / greenhouse 10×12 / Year 1 gold loop | Not extra intents. |

Reader can still finish B’s task: shop this morning → wiki gold/day → wet tiles and occupancy.

No ReaderValue must-fix.

---

## assertRepetitionAbsent — PASS

No FAQ. Two tables still have different jobs (rank vs derived last-plant). Luau appears once. Scene sections that apply table numbers are not a second copy of the table’s job. Figure captions still describe what those figures must show.

No Repetition must-fix.

---

## Overall

| Gate | Result |
|---|---|
| assertResearchTraceAbsent | **PASS** |
| assertReaderValue | **PASS** |
| assertRepetitionAbsent | **PASS** |

**This version: PASS.** Must-fix items: **0**.

Bound only to the fingerprint above (including the Luau “sells … for 3,000g” line). A later C edit needs a new D run. Length, SEOTruth, 22-rule 鉴文, titles, and lock remain out of D’s scope. Whether “sells” is the correct wiki relation for the Luau 3,000g figure is E’s fact job, not these three gates.

### Residual risks (not failures)

1. Figure 1 and Figure 2 are italic captions, not embedded `.webp` files. G still binds the illustration files.
2. Do not assemble the editor appendix into `src/`.
3. H2-6 close still overlaps H2-2’s three table questions as an executable ending.
4. Coffee Access cell and H2-5 both name the 2,500g vs 100g–1,000g cart split; H2-5’s unique job is spring occupancy into summer.
5. Dye Bundle and poppy honey remain one-line asides allowed by B.
6. “Starfruit seeds … are not a Joja summer packet” is theme knowledge from A’s Starfruit/Seeds pages, not a JojaMart price table.

PASS. Must-fix items: 0.
