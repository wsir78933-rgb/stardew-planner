# B-en layout: Stardew Valley Speed-Gro

## Layout status and input contract

- **Role:** B-en (independent English layout). This file is a layout handoff, not reader-facing body copy, SEO lock, page assembly, or a quality-pass report.
- **Mode:** `content-only`.
- **Primary keyword:** `stardew valley speed gro`.
- **Site context:** <https://stardewvalleyplanner.art>.
- **Locale and market:** `locale=en, country=US` was requested. The research evidence is an English Bing observation with US request parameters; exact US-personalized geography is **UNVERIFIED**. Do not write “US SERP” or a ranking claim in the article. (Research handoff: `research/en.md:13-17`.)
- **Allowed inputs read:** `research/en.md`, `research/facts.md`, `research/site-context.md`, and the necessary English/fact evidence files. No Chinese research, layout, or body material was used.
- **Version boundary:** If the body needs a version label, scope it to the evidence-backed `1.6.15` PC/Steam and `1.6.15.1` console lines; do not call `1.6.16` released. (`research/facts.md:15-23`; public anchors: [Steam 1.6.15](https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english), [official 1.6.15.1 console patch](https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/).)
- **Evidence boundary:** No game session, save-file test, crop-timing test, or calculator-output comparison was performed. Worked dates below must be labelled as source-based calculations under stated assumptions, never as playtesting. (`research/en.md:9-11,76-83`; `research/facts.md:177-185`.)

## 1. Task card

### 1.1 One selected main intent

**Main intent: B — decision guide / when-to-use strategy, narrowed to a crop-calendar decision.**

The reader is not asking for a generic item-definition page or a standalone calculator. They want to know whether applying a Speed-Gro tier to a particular crop plan is useful before a season deadline, and which tier (if any) changes the harvest outcome. The article may explain mechanics, recipes, and inputs only when they are necessary to make that decision; it must not become an all-purpose fertilizer encyclopedia.

This choice follows the observed `worth it` result family and the research gap between item pages, ROI pages, and crop calendars: the useful new angle is the evidence-bound bridge from the tier percentage to an actual harvest date, while preserving the current 1.6 recipe correction. (`research/en.md:19-34,60-83`.)

### 1.2 ReaderTask

> Given a crop, planting day, season deadline, and the Speed-Gro tier the player can actually use, decide whether fertilizer creates a useful earlier or additional harvest; show the first-harvest and regrowth dates under explicit assumptions, then choose `none`, `Speed-Gro`, `Deluxe Speed-Gro`, or `Hyper Speed-Gro` based on the calendar result rather than the advertised percentage alone.

### 1.3 Reader starting conditions

The reader knows the crop and intended planting day, or can look them up, and can identify which fertilizer tier and (optionally) Agriculturist are available. They may be planning a single-harvest crop or a multi-harvest crop. The article must state the season, watering assumption, fertilizer timing, and whether the plan uses a normal outdoor soil tile; the worked examples use those assumptions rather than pretending to cover every location or mod.

### 1.4 Completion criteria

The reader can finish the article and:

1. distinguish the three fertilizer tiers and the Agriculturist modifier without treating the percentage as a direct number of calendar days;
2. check the current recipe/access constraint before choosing a tier, including the 1.6 Moss/Bone Fragment correction;
3. place fertilizer before or after planting while understanding that late application cannot retroactively change completed stages;
4. calculate or read the first harvest date from the crop’s stage data and the chosen tier;
5. keep multi-harvest regrowth separate from first growth, and test whether the saved date creates an extra harvest before the season ends;
6. make a defensible yes/no/tier choice without an unsupported universal “best crop,” “always worth it,” profit, or guaranteed extra-harvest claim.

### 1.5 Scope boundary

**Include:** current-version tier mechanics, the 1.6 recipe warning, practical acquisition constraints needed for a choice, stage-based date conversion, planting-date/season-deadline decisions, first-harvest versus regrowth, one-fertilizer-per-tile and season/greenhouse exceptions that can change the decision, and two source-based date illustrations.

**Exclude:** a universal crop ranking; an unverified profit/ROI verdict; a calculator implementation; a game UI walkthrough; a live-US-SERP report; mods, Paddy bonus, giant crops, Enricher, unwatered crops, cross-season edge cases beyond the cited Coffee Bean example, or a claim that an unverified platform build behaves identically. Competitor and community pages may inform reader questions, but they are not mechanics proof. (`research/en.md:70-83`; `research/facts.md:177-185`.)

### 1.6 Tool association

`None required.` The site planner may be mentioned only if the final editor can point to an existing route that genuinely helps the same crop-plan task. A CTA is optional, must come after the decision workflow, and must not add a new reader need or change the main intent. Do not promise calculator accuracy, automatic fertilizer optimization, or a feature not verified in the site context.

### 1.7 Search evidence for the intent choice

| Evidence | Layout implication |
|---|---|
| The original and hyphenated queries repeatedly expose the item/mechanics page, while `worth it` exposes a decision question and `calculator` exposes crop-date inputs. (`research/en.md:21,27-34`.) | Open with the decision answer, then supply only the mechanics needed to use the answer. |
| Reader questions repeatedly concern fractional days, rounding, extra harvests, and regrowth. (`research/en.md:36-46,68-73`.) | Give one stage-vector/date explanation and one multi-harvest date strip; do not repeat percentage definitions in several sections. |
| Existing pages split recipes, tier facts, ROI framing, and calendars. (`research/en.md:60-74`.) | Make the information gain the explicit connection between tier modifier, stage-day calculation, and season deadline. |
| The site is a Stardew Valley planning guide site with existing crop and greenhouse routes, but no verified Speed-Gro page in the scoped old-package search. (`research/site-context.md:1-101`.) | A planning workflow fits the reader, but site relevance does not authorize a product-led intent or a new CTA. |

## 2. Information gain and evidence plan

### 2.1 Verifiable information gain

The new article must add one concrete, testable contribution beyond repeating the Speed-Gro item page:

> It maps the tier modifier to the game’s stage-day reduction and then to a season-calendar decision, showing why a nominal `25%` does not necessarily save more calendar days than `10%` on a short-stage crop, and why a multi-harvest crop’s first harvest can move while its later regrowth interval does not.

The claim is supported by the fixed decompiled-source cross-check and the fact-set calculations, not by an in-game test. The article must keep the following as separate layers:

1. **Mechanics:** the modifier and stage-day allocation (`F-SPEED-01`, `F-DELUXE-01`, `F-HYPER-01`, `F-ROUND-01`).
2. **Calendar result:** the cited Parsnip, Melon, and Strawberry examples (`EXAMPLE-01` to `EXAMPLE-03`).
3. **Decision:** the reader compares the result with the season deadline and available tier; this is an analysis method, not a source’s universal recommendation.

### 2.2 Fact-to-section map

| Layout content | Required facts and source labels | Public source(s) to preserve if the claim enters the body |
|---|---|---|
| Tier modifiers and Agriculturist stacking | `F-SPEED-01`, `F-DELUXE-01`, `F-HYPER-01`, `F-AGRI-01` (`research/facts.md:25-36`) | [Speed-Gro oldid 190630](https://stardewvalleywiki.com/Speed-Gro?oldid=190630), [Deluxe Speed-Gro oldid 191196](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196), [Hyper Speed-Gro oldid 190377](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377), [Farming oldid 191914](https://stardewvalleywiki.com/Farming?oldid=191914) |
| 1.6 recipe correction | `F1` / `research/facts.md:17-20` and `research/en-evidence/source-facts.md:5-13` | [Official 1.6 Full Changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) |
| Recipe/access constraints | `F-RECIPE-01` to `F-RECIPE-03` (`research/facts.md:106-114`) | The three oldid item pages above, plus [Qi’s Walnut Room oldid 192502](https://stardewvalleywiki.com/Qi%27s_Walnut_Room?oldid=192502) when the Hyper recipe gate is stated |
| Application and multi-harvest boundary | `F-APPLY-01`, `F-REGROW-01`, `F-SEASON-01` (`research/facts.md:72-104`) | [Fertilizer oldid 194274](https://stardewvalleywiki.com/Fertilizer?oldid=194274) and the three oldid item pages |
| Stage-day algorithm | `F-ROUND-01` (`research/facts.md:38-70`) | [HoeDirt.cs fixed 1.6 commit](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629), [Crop.cs fixed 1.6 commit](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411) |
| Crop calendar assumptions | `F5` / `F-ROUND-01` (`research/en-evidence/source-facts.md:50-57`; `research/facts.md:116-126`) | [Crop Growth Calendars oldid 189875](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875) |
| Parsnip date illustration | `EXAMPLE-01`, `REF-PARSNIP` (`research/facts.md:132-146`) | [Parsnip oldid 191123](https://stardewvalleywiki.com/Parsnip?oldid=191123) plus the Crop Growth Calendars source |
| Melon date illustration | `EXAMPLE-02`, `REF-MELON` (`research/facts.md:148-162`) | [Melon oldid 193510](https://stardewvalleywiki.com/Melon?oldid=193510) plus the Crop Growth Calendars source |
| Strawberry first harvest and fixed regrowth | `EXAMPLE-03`, `F-REGROW-01`, `REF-STRAWBERRY` (`research/facts.md:83-92,164-175`) | [Strawberry oldid 192732](https://stardewvalleywiki.com/Strawberry?oldid=192732) and [Fertilizer oldid 194274](https://stardewvalleywiki.com/Fertilizer?oldid=194274) |

No exact crop price, yield, or profit result is in the verified fact set. If C wants a monetary ROI example or a “best crop” verdict, that is a fact gap and must go back to A through the coordinator; this layout does not fill it with a calculator or memory.

## 3. Length feasibility and body shape

### 3.1 2,000-unit feasibility

**Assessment: feasible as an English long-form decision guide, with a layout target of approximately 2,150–2,400 body words.** This is a planning estimate, not a length pass. It is feasible because the source set supports three distinct, non-overlapping decisions: tier/access choice, stage-based date conversion, and single- versus multi-harvest season timing. F and the counting script must count the finished body only; headings, captions, alt text, URLs, source list, metadata, and CTA do not count under the workflow rules.

The writer must not reach the target by repeating tier percentages, padding recipe lists, or expanding into unrelated crop profitability. If the draft cannot reach 2,000 valid English words while preserving the single decision task, it must report the material shortfall rather than add a second search intent.

### 3.2 Proposed allocation (body only)

| Section | Target words | Distinct reader work |
|---|---:|---|
| Direct answer and assumptions | 140–160 | Define the calendar decision and stop the percentage/date misunderstanding immediately. |
| Tier mechanics, current recipe, and access | 320–360 | Identify the available tier and the 1.6 recipe correction; do not write an item-page catalogue. |
| Percentage-to-stage-day method | 380–420 | Explain `ceil`, stage vectors, and why the nominal percentage is not a direct day multiplier. |
| Crop-calendar decision workflow | 400–440 | Specify inputs, deadline check, and a no/regular/Deluxe/Hyper branch. |
| Worked date examples | 440–480 | Use the Melon and Strawberry evidence to make the method operational. |
| Application, regrowth, soil, and season limits | 280–320 | Prevent wrong decisions caused by late application, regrowth, one-slot soil, or season changes. |
| Final decision checklist | 190–220 | Give a short reusable sequence and a bounded conclusion, without re-summarizing every section. |
| **Total target** | **2,150–2,400** | Layout estimate only; C writes, F mechanically counts and locks. |

## 4. Complete outline for C

### Opening: answer the decision first (140–160 words)

- State the usable answer: Speed-Gro can move the first harvest earlier, but the tier percentage is not itself a calendar-day promise; for multi-harvest crops, it does not shorten the later regrowth interval.
- Tell the reader what to compare: crop, planting day, season days remaining, tier available, Agriculturist status, and (where relevant) regrowth days.
- Mark the calculation scope: normal outdoor soil, watered planting day, fertilizer effective on the planting day for the examples, no cross-season or special-location rules unless called out.
- Label all worked dates as source-based calculations, not game tests. Cite `F-APPLY-01`, `F-REGROW-01`, `F-ROUND-01`, and the relevant example source.

### H2: What Speed-Gro changes—and what it does not

**Purpose:** establish the minimum mechanics needed for the decision.

#### H3: Compare the three tiers by modifier and access

- Use one compact table with regular Speed-Gro, Deluxe Speed-Gro, and Hyper Speed-Gro.
- Include the supported modifiers (`10%`, `25%`, `33%`) and the Agriculturist additive (`+10%`, yielding `20%`, `35%`, `43%` for the three tiers) only with fact IDs `F-SPEED-01`, `F-DELUXE-01`, `F-HYPER-01`, and `F-AGRI-01`.
- Include only access facts that affect a decision: Farming Level `3` / `8` for the first two recipes, Hyper’s Qi recipe purchase for `30 Qi Gems`, and the principal ingredient/output facts. Every number must link to the corresponding oldid page or `research/facts.md:106-114`.
- Add a plain-language warning: these are growth modifiers used by the stage calculation, not guaranteed calendar-day reductions.

#### H3: Put the 1.6 recipe change beside the recipe instructions

- Explain that the official 1.6 changelog changed Speed-Gro from `1 Clam` to `5 Moss` and Deluxe Speed-Gro from `1 Coral` to `5 Bone Fragments` (`F1`; [official 1.6 Full Changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)).
- Present this as a version-change warning, not as a claim about every future version. Link the first-party changelog; use the oldid item pages for the current recipe rows.
- Do not include old guide snippets, ranking, or competitor claims as proof.

#### H3: Separate first growth from regrowth

- Explain that fertilizer affects initial growth/first harvest of a multi-harvest crop, not the interval after the first harvest.
- Mention that it can be applied before or after planting or during a crop’s growth, but completed stages are not retroactively reduced. Cite `F-APPLY-01` and `F-REGROW-01`.

### H2: Turn a percentage into a harvest date

**Purpose:** deliver the article’s main information gain rather than repeating item descriptions.

#### H3: Use stage days, not a simple percentage shortcut

- Explain the source-based algorithm in reader language: restore the crop’s real stage days, sum the real stages, calculate `daysToRemove = ceil(baseDays × effectiveBoost)`, then distribute up to three passes from the first eligible stage onward.
- Show the abstract formula only if C can explain each term immediately; a code block is not a substitute for prose.
- State that the fixed decompiled source is implementation cross-check evidence, not official source-code distribution and not an in-game test. Cite `F-ROUND-01`, `HoeDirt.cs`, and `Crop.cs`.

#### H3: Worked short-versus-long stage contrast

- Use Parsnip to show that `4` base days with Speed-Gro and Deluxe both produce `3` effective days, so `25%` does not necessarily save more calendar days than `10%` on this stage vector. Cite `EXAMPLE-01` and [Parsnip oldid 191123](https://stardewvalleywiki.com/Parsnip?oldid=191123).
- Use Melon to show `12` base days and the distinct Speed/Deluxe/Hyper outputs; do not generalize from one crop. Cite `EXAMPLE-02` and [Melon oldid 193510](https://stardewvalleywiki.com/Melon?oldid=193510).
- Describe these as calculations under the stated planting/watering assumptions, not “tested results.”

### H2: A crop-calendar workflow for deciding whether to use fertilizer

**Purpose:** turn the mechanics into one repeatable choice.

#### H3: Collect the inputs

Require the reader to record:

1. crop and season;
2. planting day and season days remaining;
3. base growth days and, where needed, the stage vector;
4. available tier and whether Agriculturist adds `10%`;
5. regrow days for a multi-harvest crop;
6. the one-fertilizer-per-tile and watering assumptions;
7. optional player-supplied crop value/yield if they want a personal cost comparison, without the article claiming a universal ROI.

The crop/calendar source supplies the first five game-data inputs; the optional price/value inputs are deliberately reader inputs because no verified price/yield set was researched. Cite `F5`, `F-AGRI-01`, `F-REGROW-01`, and `F-SEASON-01`.

#### H3: Calculate the first harvest and compare the deadline

- Read or compute the base first-harvest date, then the date for each tier the player can actually access.
- Ask one decision question: does this tier move the first harvest early enough to change the season outcome, or does it only move a harvest that was already safely inside the season?
- Do not call a tier “best” from its percentage. If two tiers produce the same first-harvest date for the chosen crop, the higher tier needs an independently stated reason; otherwise leave it unchosen.

#### H3: Branch for single-harvest versus multi-harvest crops

- Single-harvest branch: compare the first harvest date with the season end and the reader’s replanting plan; do not silently assume same-day replanting outside the calendar source’s stated assumptions.
- Multi-harvest branch: keep the first harvest date and regrowth interval as separate values, then count only harvests whose dates remain in season. Cite `F-REGROW-01`, `REF-CALENDAR`, and the crop-specific source.
- If the saved first-harvest day creates no additional in-season harvest and the article has no verified cost/value example, conclude only that the schedule benefit is not demonstrated for that plan—not that fertilizer is universally unprofitable.

### H2: Worked calendar examples

**Purpose:** make the decision method independently checkable with exact dates and assumptions.

#### H3: Melon planted Summer 1 (single-harvest example)

- Show the evidence-backed sequence: no fertilizer `12` effective days → Summer `13`; Speed-Gro `10` → `10` days / Summer `11`; Deluxe `25` → `9` days / Summer `10`; Hyper `33` → `8` days / Summer `9` (`EXAMPLE-02`; [Melon oldid 193510](https://stardewvalleywiki.com/Melon?oldid=193510); [Crop Growth Calendars oldid 189875](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875)).
- Add the Agriculturist rows only if needed to explain additive stacking: Speed-Gro `9` / Summer `10`, Deluxe `7` / Summer `8`, Hyper `6` / Summer `7` (`F-AGRI-01`, `EXAMPLE-02`).
- Place Figure 1 immediately after the stage-vector explanation, with adjacent prose explaining why the deleted days come from stage allocation and why the date is an analysis calculation.
- Cite `EXAMPLE-02`, `REF-MELON`, `REF-CALENDAR`, and the fixed-source cross-check. Do not turn this one Summer 1 example into a universal tier recommendation.

#### H3: Strawberry planted Spring 13 (multi-harvest example)

- Show the first and later harvest sequences: no fertilizer Spring `21`, `25`; Speed-Gro Spring `20`, `24`, `28`; Deluxe Spring `19`, `23`, `27`; Hyper Spring `18`, `22`, `26` (`EXAMPLE-03`; [Strawberry oldid 192732](https://stardewvalleywiki.com/Strawberry?oldid=192732)).
- Explicitly say the `4`-day regrowth interval remains `4` days in all four rows; fertilizer changes the initial growth and first harvest, not the regrowth interval (`F-REGROW-01`, `REF-FERTILIZER`).
- Place Figure 2 next to this explanation; use it to show the difference between the first-growth segment and fixed regrowth segments.
- Cite `EXAMPLE-03`, `REF-STRAWBERRY`, `F-REGROW-01`, and [Fertilizer oldid 194274](https://stardewvalleywiki.com/Fertilizer?oldid=194274).

### H2: Application, soil, and season limits that can change the choice

**Purpose:** prevent a correct date calculation from becoming a wrong recommendation.

#### H3: Timing and one-slot soil

- State that one soil tile accepts one fertilizer, and that pre-plant, post-plant, and in-growth application follow the sourced late-application boundary.
- Warn that a late application cannot restore already completed stages; do not invent a universal “late fertilizer saves X days” rule.

#### H3: Season and location exceptions

- Explain that fertilizer normally disappears at season change, while multi-season crops can preserve it when the next season remains valid and greenhouse fertilizer persists unless the tile is reset. Cite `F-SEASON-01`.
- Keep the article’s worked examples to normal outdoor soil. Do not broaden into greenhouse, Ginger Island, Paddy, giant-crop, Enricher, mod, or unwatered-crop mechanics without new fact work.

### H2: Final decision checklist

Use a short, non-repetitive checklist:

1. Identify crop, season, planting day, and available tier.
2. Read the crop’s base/stage data and calculate the effective first-growth days.
3. Compare each accessible tier’s first-harvest date with the season deadline.
4. For a regrowing crop, add the sourced fixed regrowth interval instead of reducing it by the fertilizer percentage.
5. Choose the lowest tier that changes the reader’s stated schedule, or choose none when the plan shows no useful schedule change; record any personal cost/value judgment as the reader’s own inputs.

The closing must not restate every recipe, call the guide a calculator, or promise profit. It should leave the reader with a repeatable decision and the exact boundary of the evidence.

## 5. Required body visuals (not decorative)

The body must contain at least the following two explanatory visuals in addition to any cover image. They are controlled diagrams/timelines based on verified facts, not generated screenshots, in-game captures, or proof of playtesting.

### Figure 1 — stage-vector reduction and first-harvest dates

- **Placement:** directly after `H2: Turn a percentage into a harvest date`, beside the Melon calculation.
- **Format:** accessible horizontal stage diagram or exact table rendered as an image only if the underlying values remain text-accessible; no decorative farm background.
- **Shown data:** Melon planted Summer 1, base vector `[1,2,3,3,3]`; Speed-Gro `[1,1,2,3,3]` → `10` effective days → Summer 11; Deluxe `[1,1,2,2,3]` → `9` → Summer 10; Hyper `[1,1,2,2,2]` → `8` → Summer 9. Optional Agriculturist rows use the separately sourced `20%/35%/43%` modifiers and dates.
- **Mechanism to explain in caption/nearby prose:** `ceil(baseDays × effectiveBoost)` chooses the number of stage-days to remove; the pass-based stage allocation produces the displayed vectors. The percentages are not a direct calendar multiplier.
- **Caption draft for C to refine:** “Melon planted on Summer 1: the fertilizer modifier removes whole stage-days, so the same percentage does not map directly to a calendar percentage.”
- **Alt text requirement:** name the crop, planting day, four modifier states, stage vectors, effective days, and harvest dates; do not say “tested.”
- **Evidence:** `F-ROUND-01`, `EXAMPLE-02`, `REF-MELON`, `REF-CALENDAR`; implementation cross-check [HoeDirt.cs](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629).

### Figure 2 — first growth versus fixed regrowth calendar

- **Placement:** inside `H3: Strawberry planted Spring 13`, after the first-harvest explanation.
- **Format:** calendar strip with Spring 13 planting marker, a distinct first-growth segment, and harvest markers for each tier. Use an explanatory timeline, not a crop illustration.
- **Shown data:** no fertilizer Spring 21/25; Speed-Gro Spring 20/24/28; Deluxe Spring 19/23/27; Hyper Spring 18/22/26. Mark every post-first-harvest interval as `4 days` and show why Spring 29 falls outside the example’s in-season harvest list. Cite `EXAMPLE-03` and `REF-STRAWBERRY` for all dates.
- **Mechanism to explain in caption/nearby prose:** fertilizer changes the first growth/first harvest only; it does not turn a `4`-day regrowth interval into `3.6` or another reduced value.
- **Caption draft for C to refine:** “Strawberry planted on Spring 13: the fertilizer moves the first harvest, while each later harvest still follows the crop’s four-day regrowth interval.”
- **Alt text requirement:** distinguish initial growth from regrowth and include the tier-specific date sequences; do not imply an in-game screenshot.
- **Evidence:** `F-REGROW-01`, `EXAMPLE-03`, `REF-STRAWBERRY`, `REF-FERTILIZER`.

### Media guardrails

- No cover-only completion: these visuals must sit next to the paragraphs that use them to make the decision.
- No generated artwork, screenshot, or “real test” label may stand in for the controlled mechanism/date diagrams.
- Every number printed inside a visual must be traceable to its fact ID and public source; the caption must retain the calculation assumptions.
- If the final asset cannot keep the vectors/dates legible on mobile, use an accessible HTML table plus a compact timeline rather than shrinking the image.

## 6. Public citation and handoff rules for C

- Keep the official changelog as the source for the 1.6 ingredient change; do not attribute that change to a search snippet or a competitor.
- Use oldid links where the fact set recorded them when a precise numeric claim or stage/date example matters. The body may use descriptive links; internal fact IDs and line references remain editorial evidence and must not appear as reader-facing markers.
- Treat the Wiki as community-maintained game data and the fixed decompiled repository as implementation cross-check evidence, not as official source-code publication.
- Do not expose Bing ranking, blocked Google/DuckDuckGo challenges, internal paths, research logs, task roles, or “the research says” language in the body.
- Do not cite Reddit, Steam analysis, or the calculator as mechanics authority. They may explain why the reader question exists, but the body’s mechanics/date claims must use the mapped sources above.
- If C introduces a new number, crop, date, price, profit, platform rule, or edge case not present in this layout’s fact map, stop and return the missing fact to A through the coordinator; do not infer it.

## 7. Layout acceptance checklist

- [x] Exactly one main intent selected: a crop-calendar “when to use / is it useful?” decision.
- [x] One ReaderTask with an observable completion result.
- [x] Required subquestions and explicit exclusions are present.
- [x] Tool association is independent of the main intent and may be `none`.
- [x] Information gain is concrete: modifier → stage-day allocation → calendar decision.
- [x] 2,000 valid English-word feasibility is estimated without promising a length pass.
- [x] H2/H3 outline includes purpose, distinct reader work, and fact mapping.
- [x] Two body visuals explain mechanics and dates; neither is decorative or a fake test screenshot.
- [x] Important game numbers and dates point to fact IDs and public URLs.
- [x] No unsupported ROI, best-crop, universal guarantee, US-SERP, or in-game-test claim is planned.
- [x] Only this `layout/en.md` file is written by B-en.
