# D-en r1 independent post-write review: `stardew valley speed gro`

Review timestamp: `2026-09-26 12:45 +0800` (`Asia/Shanghai`).

## Conclusion

This is a fresh D-en review of the revised English body, English media manifest, and both English assets. The three D gates all pass on the current version: the body preserves reader-facing research trace, completes the crop-calendar decision task supported by the live query evidence, and does not repeat one complete reader job in multiple places. The old E/M narrow-media issue is statically addressed in the revised English SVG source and manifest, but the final browser-rendering verdict remains a separate M responsibility and is not claimed here.

| Gate | Result | Evidence-bound conclusion |
|---|---|---|
| ResearchTrace | **PASS** | No internal search log, role/task residue, private path, or author-process instruction was found in the body; public links and necessary calculation/provenance limits remain. |
| ReaderValue | **PASS** | The live query exposes mechanics, worth-it, use, regrowth, and calculator questions. The body turns those questions into one observable task: compare accessible tiers for a stated crop, planting day, and season outcome. |
| Repetition | **PASS** | The percentage/date and first-growth/regrowth boundaries recur only at different layers: answer, mechanics, procedure, worked example, figure interpretation, and final checklist. No two sections duplicate the same complete decision work. |

The D result is bound to these current inputs and hashes:

| Material | SHA-256 |
|---|---|
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

## 1. Fresh search evidence and main-intent check

I independently opened the local `ego lite` browser and searched the exact user query `stardew valley speed gro`. The observed Google result page was the normalized query URL <https://www.google.com/search?q=stardew+valley+speed+gro> (the address bar also contained Google tracking parameters, which are not retained here).

The visible result and question families were:

- `Speed-Gro Stardew Valley Wiki` appeared as a top web result, establishing a mechanics/item lookup need.
- People also ask showed `What is the best speed grow in Stardew Valley?`, `Is it worth buying Speed-Gro Stardew?`, `How do I use Speed-Gro in Stardew Valley?`, and `Does Speed-Gro affect regrowth?`.
- People also search for included `Stardew valley speed gro how to use`, `Stardew valley Speed-Gro calculator`, `Stardew valley speed-gro or quality fertilizer`, `Deluxe Speed-Gro stardew`, and `Best Speed-Gro stardew`.

This supports the selected crop-calendar decision intent without making the search page a mechanics source: the body answers when a saved first-harvest day changes a plan, while still supplying only the tier, application, stage, and regrowth facts needed to make that decision. The Google page reported personalized results and a location label; exact US geography is therefore **UNVERIFIED**, and this report makes no US-ranking or regional-demand claim.

The body’s exact opening answer is:

> “Speed-Gro is useful when the earlier first harvest changes your crop calendar.” (`drafts/body-en.md:1`)

The next decision instruction is:

> “The reliable decision is to compare the first harvest date for each tier you can actually use with the last useful day of the season.” (`drafts/body-en.md:1`)

Those sentences align with the observed worth-it, use, regrowth, and calculator question families, without adding a product-led need or pretending that the Google page proves a game rule.

## 2. ResearchTrace — PASS

### 2.1 Reader-facing method is preserved, internal process is absent

The body keeps method/provenance that a reader needs, and does not expose the research workflow:

- `drafts/body-en.md:3` says the dates “do not represent an in-game test” and are “source-based calculations using crop stage data and the public crop-calendar assumptions.” This is a necessary boundary around the worked examples, not a search log.
- `drafts/body-en.md:31` explains the real stage vector, whole stage-day allocation, and the exact rounding object. The sentence is precise: “`ceil` applies to the product `baseDays × effective modifier`; it does not round the modifier itself up.”
- `drafts/body-en.md:41` identifies the fixed public decompiled snapshot as implementation evidence and explicitly says it is “not an official source-code release and not a claim of game-session testing.” This prevents a code cross-check from being presented as a game test or official source release.
- `drafts/body-en.md:62` and `:124` label both figures as source-based calculations and not a game screenshot/playtest. Those are figure-meaning safeguards, not internal process residue.
- Public links at `drafts/body-en.md:3,13-15,19,23,41,45,58,62,75,95,111,124,139` are descriptive source links. They do not contain private tokens, task paths, or browser-session data.

The internal-residue scan found no matches. The actual command and result were:

```text
rg -n -i 'TaskSpace|ego-browser|research/|layout/|A-facts|B-en|C-en|D-en|E-en|F-en|SERP|search result|research says|canary|prompt|internal path|agent' /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md
exit=1; no output
```

The `exit=1` is the expected `rg` no-match result. An independent Node token check over the same 17 residue tokens also exited `0` with `internal_residuals=0`. The body contains no Bing/Google ranking language, blocked-engine instructions, research-role labels, or internal paths.

### 2.2 Public URL boundary

The body contains 13 unique HTTPS URLs. An independent URL parser exited `0`, and every host was one of the expected public source hosts (`store.steampowered.com`, `www.stardewvalley.net`, `stardewvalleywiki.com`, or `github.com`). No internal URL or signed/private resource was found.

## 3. ReaderValue — PASS

### 3.1 The reader can complete the stated crop-calendar task

The body gives the inputs, transformation, branch, and observable result required by the layout’s ReaderTask:

1. `drafts/body-en.md:7-19` names the three tiers, their `10%/25%/33%` modifiers, additive Agriculturist values, access facts, and the 1.6 recipe correction. The table is decision support, not an unrelated item catalogue.
2. `drafts/body-en.md:21-25` separates first growth/first harvest from fixed regrowth and explains why “worth it” depends on whether a date changes a real season branch.
3. `drafts/body-en.md:29-41` gives the stage-vector calculation, `ceil(baseDays × effective modifier)`, whole-day reductions, and the implementation-evidence boundary.
4. `drafts/body-en.md:69-89` tells the reader to record crop, season, planting day, deadline, stage data, available tier, Agriculturist, regrowth, soil, and watering assumptions; then it branches into single-harvest and multi-harvest decisions.
5. `drafts/body-en.md:93-120` supplies independently checkable Melon and Strawberry dates rather than a universal “best” tier. `drafts/body-en.md:120` explains why one saved first-growth day brings Strawberry’s third harvest from Spring 29 to Spring 28 without shortening the later four-day interval.
6. `drafts/body-en.md:143-154` closes with a six-step decision checklist and the bounded choice “the lowest tier that changes that outcome, or ... none.”

The revised body therefore answers the primary query job while retaining necessary mechanics. It does not drift into a calculator implementation, universal crop ranking, unsupported ROI, or a site CTA that creates a new reader need.

### 3.2 Independent calculation and exact calendar-row check

I independently reimplemented the documented whole-stage-day reduction for the three stage vectors and checked the body’s calendar rows. The Node probe exited `0` and produced:

```text
Parsnip 0:4/[1,1,1,1] 0.1:3/[1,0,1,1] 0.25:3/[1,0,1,1] 0.33:2/[1,0,0,1]
Melon 0:12/[1,2,3,3,3] 0.1:10/[1,1,2,3,3] 0.25:9/[1,1,2,2,3] 0.33:8/[1,1,2,2,2] 0.2:9/[1,1,2,2,3] 0.35:7/[1,0,2,2,2] 0.43:6/[1,0,1,2,2]
Strawberry 0:8/[1,1,2,2,2] 0.1:7/[1,0,2,2,2] 0.25:6/[1,0,1,2,2] 0.33:5/[1,0,1,1,2]
BODY_EXPECTED_CALENDAR_ROWS=12
```

The body rows match those results:

- `drafts/body-en.md:45-54`: Parsnip no fertilizer `4 days / Spring 5`, Speed-Gro `3 / Spring 4`, Deluxe `3 / Spring 4`, Hyper `2 / Spring 3`.
- `drafts/body-en.md:95-107`: Melon no fertilizer `12 / Summer 13`, Speed-Gro `10 / Summer 11`, Deluxe `9 / Summer 10`, Hyper `8 / Summer 9`; Agriculturist rows are `9/7/6` effective days and `Summer 10/8/7` as stated in `:58` and `:103-105`.
- `drafts/body-en.md:111-120`: Strawberry first harvest and fixed four-day sequences are no fertilizer `21,25` (third `29` out of season), Speed-Gro `20,24,28`, Deluxe `19,23,27`, and Hyper `18,22,26`.

This also regression-checks the old E report’s Parsnip note: the revised body does not carry an extra Parsnip Agriculturist table row, and its actual four Parsnip rows match the independent calculation above. No stale incorrect row was introduced by C-en r1.

### 3.3 Figure existence and meaning

Both English figure references resolve to real assets; the body/manifest set and path check exited `0`:

```text
bodyImageCount=2
manifestAssetCount=2
pathBase=manifest-directory
resolvedFrom=.../docs/blog-ops/stardew-valley-speed-gro/drafts
widths=[390,390]
bodyNames=[speed-gro-melon-stage-days.svg, speed-gro-strawberry-regrowth-calendar.svg]
```

#### Figure 1 — Melon stage-day reduction

- Body placement: `drafts/body-en.md:60-65`, immediately after the stage-day explanation and before the crop-calendar workflow.
- Asset: `assets/en/speed-gro-melon-stage-days.svg`; the root declares `width="390" height="1070" viewBox="0 0 390 1070"`, with `role="img"` and `title`/`desc`.
- Meaning: the four cards show the base vector `[1,2,3,3,3]`, then no fertilizer `12 / Summer 13`, Speed-Gro `[1,1,2,3,3]` `10 / Summer 11`, Deluxe `[1,1,2,2,3]` `9 / Summer 10`, and Hyper `[1,1,2,2,2]` `8 / Summer 9`. This is the stage-days-to-first-harvest relationship, not decoration or a playtest screenshot.
- Exact body support: `drafts/body-en.md:58` gives the same effective days; `:61-62` gives the vector/date alt and the `ceil(12 × effective modifier)` caption; `:65` tells the reader to repeat the procedure with a crop-specific vector.

#### Figure 2 — Strawberry first growth versus fixed regrowth

- Body placement: `drafts/body-en.md:122-127`, inside the Strawberry example after the table and first-harvest explanation.
- Asset: `assets/en/speed-gro-strawberry-regrowth-calendar.svg`; the root declares `width="390" height="1250" viewBox="0 0 390 1250"`, with `role="img"` and `title`/`desc`.
- Meaning: the four cards show Spring 13 planting, first harvests Spring `21/20/19/18`, and later dates separated by four days; only the no-fertilizer Spring 29 marker is outside the 28-day season. This makes the first-growth/regrowth boundary visible and does not shorten the later interval.
- Exact body support: `drafts/body-en.md:111-120` gives the table and boundary; `:123-124` gives the complete alt/caption; `:127` explicitly says each later segment is a crop-specific four-day regrowth interval.

Both SVGs passed `xmllint --noout` and `file` identified them as `SVG Scalable Vector Graphics image`. An independent static parser exited `0` with `minFont=14` for both files and `image_elements=0`. These are existence/meaning and source-regression checks; they are not the separate M browser-rendering verdict.

### 3.4 Regression against old E/M findings

| Earlier finding | Current evidence | D-en r1 status |
|---|---|---|
| E: `ceil` wording could be read as rounding the modifier | `body-en.md:31` explicitly applies `ceil` to `baseDays × effective modifier`; Figure 1 alt/caption at `:61-62` repeats the same object. | **Fixed and PASS for D content/meaning.** |
| E/M: English SVGs were fixed-width wide diagrams whose 390px text became about 10px | Both revised roots are intrinsically 390px wide, heights are 1070/1250, the minimum declared font is 14px, and there is no raster `<image>` element. | **Static condition fixed; M browser-rendering recheck remains separate/UNVERIFIED here.** |
| M: English manifest path base was not explicit | `drafts/media-en.json` now declares `pathBase: "manifest-directory"`; both `../assets/en/...` paths resolve from `drafts/` and the body/manifest name sets are identical. | **Fixed and PASS for D asset existence/meaning.** |
| E: Parsnip Agriculturist row discrepancy | Revised body retains only the four non-Agriculturist Parsnip rows; all four match the independent stage calculation. | **No stale body error; PASS.** |

The separate M role must still inspect actual 390px browser rendering before anyone reports the old narrow-readability failure as fully closed. D does not substitute static SVG dimensions for that browser gate.

## 4. Repetition — PASS

The following exact passages repeat the same boundaries at different reader-work layers; they do not duplicate one complete explanation:

| Location | Exact passage | Distinct function |
|---|---|---|
| `body-en.md:1` | “the earlier first harvest changes your crop calendar” | Direct answer and task framing. |
| `body-en.md:23` | “fertilizer does not reduce the time between harvests” | Mechanics boundary plus late-application context. |
| `body-en.md:31` | “`ceil` applies to the product `baseDays × effective modifier`” | Reusable calculation rule. |
| `body-en.md:54` | “Both modifiers round to one removed day for a four-day crop” | Parsnip counterexample that tests the rule. |
| `body-en.md:81` | “A tier has demonstrated schedule value when the earlier date changes a real branch” | Decision criterion against percentage-only ranking. |
| `body-en.md:89` | “write the first harvest date on one line and the regrowth interval on another” | Reader procedure for multi-harvest crops. |
| `body-en.md:120` | “every later gap remains 4 days” | Strawberry calendar result and extra-harvest explanation. |
| `body-en.md:127` | “Each later segment is a crop-specific four-day regrowth interval” | Figure interpretation and error prevention. |
| `body-en.md:147-152` | Six-step sequence ending in the lowest tier or none | Compact reusable checklist, not a second full tutorial. |
| `body-en.md:154` | “The answer to ‘is Speed-Gro worth it?’ is therefore a calendar comparison” | Bounded conclusion. |

The same concept therefore progresses from answer → rule → calculation → branch → example → checklist. Removing any one of these layers removes a different reader action or verification point. I found no duplicate table, repeated recipe catalogue, or two paragraphs that independently perform the same full choice.

## 5. Mechanical prechecks and actual results

| Actual command/action | Exit/result | Evidence |
|---|---:|---|
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' --locale en '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md'` | `0` | `mechanical_units=2391`, `required_floor=2000`, NFC/LF hash equals raw hash. This is a count precheck, not an F lock or semantic pass. |
| Internal-residue `rg` scan shown in §2 | `1` | No output; expected no-match exit. |
| `rg -n 'https?://' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md'` | `0` | URL occurrences were read back; the independent parser found 13 unique public HTTPS URLs. |
| Node public-URL host parser | `0` | All 13 hosts are in the declared public-source allowlist. |
| Node body/manifest/image resolver | `0` | Two body images, two manifest assets, `pathBase=manifest-directory`, both paths resolve, and name sets match. |
| `xmllint --noout` over both English SVGs | `0` | Both SVGs are XML-valid. |
| `file` over both English SVGs | `0` | Both identified as `SVG Scalable Vector Graphics image`. |
| Node independent stage-vector/date calculation and body-row assertion | `0` | Three stage vectors, seven modifier states, and 12 expected body rows match. |
| Node reader-task assertion over exact body statements | `0` | Seven opening/method/decision statements are present. |
| Node static SVG regression parser | `0` | Both roots are 390px wide, min declared font is 14px, and `image_elements=0`. |
| Local `ego lite` exact-query search with accessibility-state readback | UI readback; no shell exit | Google result page visibly returned the Wiki result plus worth-it/use/regrowth/calculator question families; exact geography remained unverified. |

No body, manifest, or asset file was modified by this review. No website assembly, build, dependency installation, deployment, secret handling, commit, push, or external write was performed.

## 6. Source URLs

The live intent evidence was the normalized query URL:

- <https://www.google.com/search?q=stardew+valley+speed+gro>

The public URLs retained in the body and checked for host/protocol validity are:

- <https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english>
- <https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/>
- <https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/>
- <https://stardewvalleywiki.com/Speed-Gro?oldid=190630>
- <https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196>
- <https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
- <https://stardewvalleywiki.com/Parsnip?oldid=191123>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411>

## 7. Files and scope

### Reviewed inputs

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/en.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/layout/en.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg`

### File added by this role

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/D-en-r1.md`

This report does not replace `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/D-en.md`; it is the r1 report for the revised body/media version. It does not sign E, M, F, page assembly, user approval, deployment, or ranking outcomes.
