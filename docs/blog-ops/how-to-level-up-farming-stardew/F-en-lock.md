# F-en lock and titles: how to level up farming stardew (en / US)

- Role: Agent F-en (lock + titles. Independent new session. Not A/B/C/D/E/G)
- Did not rewrite the body. Did not edit `src/`, `app/`, or `public/`
- Input body: `docs/blog-ops/how-to-level-up-farming-stardew/C-en-draft.md` after the role header, through the line before `## Editor appendix (not reader body)` (includes Sources; no FAQ H2)
- D: `D-en-check.md` this version **PASS**, must-fix 0
- E: `E-en-review.md` this version **PASS**, must-fix 0
- Fingerprint (reader opening): “Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest)”
- E full-file SHA-256 of `C-en-draft.md`: `bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf` (recomputed: match)
- E reader-body SHA-256: `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35` (21842 bytes). F recomputed on the same cut: match
- D bound the same full-file hash. Same final candidate.
- This file’s Title / H1 / Description go to E for title review. F **cannot** sign SEOTruth

Lock version: `2026-09-20-en-how-to-level-up-farming-lock-1`  
locale / country: `en` / `US`  
Head term: `how to level up farming stardew`  
slug (user-locked, unchanged): `how-to-level-up-farming-stardew`

---

## 0. Gap check (no rewrite)

No bounce to A / B / C.

| Check | Result |
|---|---|
| D and E same final candidate | Yes. Same full-file hash `bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf`. Same opening fingerprint. Same first reader H2 `Farming XP comes from harvests, animals, and two books`. E’s reader-body hash matches this lock. Prior D FAIL `9371fa8aab97bb8dc2cdd2411568177f8d8c45507e5f338f56d6c53829136060` is not this version |
| ReaderTask (B I2) | Raise Farming with the XP the game actually awards (first-product harvest, named animal actions, two books) to a named level; stop treating hoe, watering, extra berries/potatoes, and truffles as Farming XP. Opening + H2-1→H2-4 + Sources close match |
| Information gain | Hoe/can themselves 0; sprinkler water is not the XP event; extras on one pull add 0 (blueberry 10 / cranberry 14 / potato 14); quality adds none; cumulative 2,150 / 6,900 / 10,000 / 15,000; wiki 0→1 plant counts only under H2-2; Winter Seeds XP unpublished; planner does not compute Farming XP. All in the lock |
| Public references | Every C `PublicReference` quote exists in the lock. 31 of 33 strings n=1. Two short item-link fragments n=2; handoff keeps C’s `occurrence: 1` (first instance). See §3 |
| Structure | No FAQ H2 (B default). Sources H2=`Sources` is locked into the reader body. JSON-LD stays Article, not FAQPage |
| NFC / newlines | Already NFC, LF only, no CR. E cut: rstrip, no trailing blank line |
| Length | Script mechanical_units **2863** ≥ 2000. See §2 |

Not a gap (no rewrite, no bounce):

- Figure webp files are not in the lock. Markdown already has two body-image paths and alts. G binds `.webp`. Cover is not a body figure.
- E residual risks (energy gloss on proficiency, Almanac infobox list, scythe 1.3.27, Book Of Stars 15,000g/25%, “including 3 and including 0” method note, planner-limit wording) stay unpatched.
- Planner “does not compute Farming XP” is the Sources checked-line B required, not a product CTA.

---

## 1. Locked body

| Field | Value |
|---|---|
| Lock file | `docs/blog-ops/how-to-level-up-farming-stardew/locked/en-body.txt` |
| Extract | `C-en-draft.md` from “Farming skill in Stardew Valley rises” through the line before `## Editor appendix (not reader body)`; NFC; rstrip (no trailing NL) |
| Encoding | UTF-8 |
| Normalization | NFC |
| Newlines | LF only (`\r` not in the file) |
| Byte length | 21842 |
| SHA-256 (locked UTF-8 bytes) | `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35` |
| vs E reader-body digest | Match |
| Quench | **Zero word changes.** No polish, no add/delete, no link or caption edits |

`sha256_raw` = `sha256_nfc_lf` (NFC before write, no CR).

---

## 2. Count (script output; no eyeballing)

Command:

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
  "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/how-to-level-up-farming-stardew/locked/en-body.txt" \
  --locale en \
  --exclude-heading FAQ \
  --exclude-heading Sources
```

Lock has no FAQ H2; Sources H2 is `Sources`. Both excludes are passed so a heading variant cannot leak in.

Script stdout (verbatim):

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/how-to-level-up-farming-stardew/locked/en-body.txt",
  "locale": "en",
  "mechanical_units": 2863,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "FAQ",
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 9,
    "code": 0,
    "excluded_sections": 23,
    "non_body": 64,
    "frontmatter": 0
  },
  "sha256_raw": "1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35",
  "sha256_nfc_lf": "1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35"
}
```

| Item | Value |
|---|---|
| locale | en (English words; hyphen/apostrophe compounds count as one unit) |
| mechanical_units | **2863** |
| required_floor | 2000 |
| meets_mechanical_floor | true |
| Headings / H2 / H3 | Not counted (`headings`: 9 = working H2 × 4 + H3 × 4 + `Sources`) |
| FAQ / Sources sections | FAQ absent. Sources excluded (`excluded_sections`: 23) |
| URL | Script strips |
| alt | `![...](url)` stripped as a whole; alt not counted |
| Figure captions | Two teaching paragraphs after the images are ordinary body lines, not HTML `figcaption`. The script counts those words. Floor still clears |
| Table alignment rows, blank lines | `non_body`: 64 |
| Table cell words | Counted |
| Semantic qualification | Script does not sign; D/E already PASS this body |

Length hard floor: **pass**. No padding. No bounce to C. Did not expand another search intent.

---

## 3. Public-reference spot check

Every C appendix quote was counted in the NFC lock.

| Result | Count |
|---|---|
| Quotes with n = 1 | 31 |
| Quotes with n = 2 | 2 |
| Quotes with n = 0 | 0 |

n = 2 (short item-link fragments; first instance still matches C’s `occurrence: 1`):

- `wiki-quality-sprinkler` quote `[Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)` — H2-1 sprinkler sentence and the level-6 table cell
- `wiki-iridium-sprinkler` quote `[Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)` — the same H2-1 sentence and the level-9 table cell

Handoff `occurrence` keeps C’s `1` (1-based first instance, not a claim that the fragment is unique). No body rewrite.

---

## 4. Body promise (internal, before titles)

| Question | Answer |
|---|---|
| What the click actually delivers | Which actions grant Farming XP and which daily farm work does not; then stack first-product harvests, 5-XP animal actions, and 250-XP books to a named total (5 = 2,150, 8 = 6,900, 9 = 10,000, 10 = 15,000); check the skills tab the same day; sleep for the popup |
| Strongest verified fact | Hoe and watering can themselves add 0 Farming XP; extras on one pull add 0 (blueberry 10 / cranberry 14 / potato 14); quality stars add none; animals 5; Almanac and Book Of Stars 250 each; cumulative 5 = 2,150 / 10 = 15,000 |
| View only this article can cash | Watering a field, even with sprinklers, does not replace the harvest as the way the skill moves; gold/day extras are not extra Farming XP |
| Must not promise | Fastest crop; XP per day; we measured / harvest test; watering levels you; Year 1 calendar to 8/9; Rancher vs Tiller as the H1 job; keg profit; Winter Seeds XP = 3 or 0; planner computes Farming XP |

Core promise (one main intent): use the Farming XP the game actually awards to raise Farming to a named level, and stop treating hoe swings, watering, extra berries or potatoes, and truffles as Farming XP.

---

## 5. Last 3 English titles (anti-template)

Source: `src/blog/blog-post-registry.tsx` English `title` (publishing last three, already live).

| slug | EN title |
|---|---|
| summer-crops-stardew | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| fall-crops-stardew | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| do-you-have-to-water-trees-stardew | Do You Have to Water Trees in Stardew Valley? Check Stage 4 and the Fruit-Tree 3×3 |

Templates to leave (structure, not a ban on the head term):

1. `{Season} Crops in Stardew: Rank by the Shop You Can Open This Morning`
2. `{Season} Crops in Stardew: {g} at Pierre's, {g} Needs a Rare Seed`
3. `Do You Have to Water {X} in Stardew Valley? Check {A} and {B}`

Nearby, not last-three: `rancher-or-tiller-stardew` “{A} or {B} in Stardew: Farming 5 Also Locks Your Farming 10 Pair”. This article must not become a profession fork.

This article must not become “How to Level Up Farming in Stardew: Rank by the Shop You Can Open This Morning”, and must not become “Do You Have to Water Crops in Stardew Valley? Check the Hoe and the Harvest”. Head term `how to level up farming stardew` may appear naturally.

---

## 6. Ten free directions (no formula labels while generating)

Same main intent. Difference is a real fact, angle, or phrasing — not ten synonyms and not ten search intents.

| # | Title direction | Description direction |
|---|---|---|
| 1 | How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150 | Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep. |
| 2 | How to Level Up Farming in Stardew: The Hoe and Watering Can Themselves Add 0 | Stack first-product harvests, 5-XP animal actions, and 250-XP books to 2,150, 6,900, 10,000, or 15,000. Extra blueberries and potatoes do not add XP. |
| 3 | How to Level Up Farming in Stardew: A Blueberry Harvest Is 10 XP, Not 10 Times the Berries | Watering and hoeing do not grant Farming XP. Quality stars add none. Level 5 is 2,150; level 10 is 15,000 total. |
| 4 | How to Level Up Farming in Stardew: Level 10 Is 15,000 Total; 9 to 10 Is +5,000 | The hoe and watering can grant 0. Lifetime parsnips to 5 are 269; to 10 are 1,875. XP posts immediately; the popup waits until you sleep. |
| 5 | How to Level Up Farming in Stardew: The Skills Tab Already Moved; the Popup Still Waits for Sleep | First check whether today's action even grants XP. Do not multiply blueberries by berry count. Level 5 needs 2,150; level 10 needs 15,000. |
| 6 | How to Level Up Farming in Stardew: Watering Does Not Increase the Skill; Harvest Does | Crop XP posts on harvest. Animals are 5 XP each; Almanac and Book Of Stars are 250. Level 5 is 2,150; level 10 is 15,000. |
| 7 | How to Level Up Farming in Stardew: One Almanac Read Is 250 XP; a Day of Watering Is Still 0 | The hoe and can grant none. Harvests grant crop XP. Level 5 is 2,150, about 269 parsnips from 0. |
| 8 | How to Level Up Farming in Stardew: Gold Stars Add No XP, and Extra Berries Don't Either | Grants are harvest, animal care, and two books. Level 5 is 2,150; level 10 is 15,000. The popup waits for sleep. |
| 9 | How to Level Up Farming in Stardew: Truffles Are Foraging XP, Not a Farming Shortcut | Hoeing and watering also grant 0. Level 5 is 2,150; level 10 is 15,000. A blueberry harvest is 10 XP. |
| 10 | How to Level Up Farming in Stardew: From 0, About 269 Parsnips Reach Level 5 | The hoe and can grant 0. Level 10 is 15,000 total, about 1,875 parsnips. XP posts now; the popup waits for sleep. |

---

## 7. Classify, then filter

| # | Mechanism | Stay elements | Drive | Disposition |
|---|---|---|---|---|
| 1 | 结论前置 | 异常, 捷径 | 懒惰, 傲慢 | **Keep.** Most common miss (watering/hoeing) + the level-5 finish number |
| 2 | 结论前置 | 异常 | 懒惰 | Drop. Same fact as #1, missing 2,150 |
| 3 | 反差数字 | 异常 | 傲慢 | **Keep for check.** First-product is a sub-question, narrower than the main task |
| 4 | 反差数字 | 异常 | 傲慢 | **Keep as alt.** Cumulative 10 / +5,000 is a real gate; missing grant/not |
| 5 | 悬念场景 | 异常 | 懒惰 | **Keep for check.** Popup split is the result check, not the whole promise |
| 6 | 自我颠覆 | 冲突, 异常 | 傲慢 | **Keep for check.** Body: watering is not the XP action; related query is “does watering increase farming” |
| 7 | 反差数字 | 异常 | 贪婪 | Drop. Almanac 250 is one source, not the main promise |
| 8 | 结论前置 | 异常 | 傲慢 | Drop. Same frame as #3 |
| 9 | 损失进入 | 异常 | 懒惰 | Drop. Truffles are an exception, not the main path |
| 10 | 反差数字 | 捷径 | 懒惰 | **Keep for check.** Parsnip counts are a magnitude tool, not the grant/not rule |

After drops, two-check set: 1, 3, 4, 5, 6, 10.

Did not reuse summer’s “Rank by the Shop You Can Open This Morning”, fall’s “{g} at Pierre's / Rare Seed”, or the tree title’s “Do You Have to Water {X}? Check {A} and {B}”. Did not make Rancher vs Tiller the H1 job. Did not invent “guides say watering levels you” (that sentence is in the Chinese draft, not this English lock).

---

## 8. Two checks

### 8.1 Stop

Target reader: playing Stardew Valley, trying to raise Farming. May be watering, hoeing, and picking blueberries while the skills tab barely moves. Opened English SERP mixes wiki XP tables with “fast / ASAP / Year 1 level 9” threads, plus related “Does watering increase farming”.

| # | Would they stop? Concrete gap | Body support | Stop |
|---|---|---|---|
| 1 | Yes. Someone who just finished a watering round treats can swings as XP; the title says watering and hoeing add 0, and names 2,150 for level 5 | Opening “Using a hoe or a watering can does not grant Farming XP by itself”; “The hoe and can themselves add 0 Farming XP”; “2,150 for level 5” | Pass |
| 3 | Yes. A blueberry field that dropped extras, counted as extra skill | “A blueberry pull that yields three berries still grants 10 Farming XP once”; Fig 2 | Pass; main promise too narrow |
| 4 | Yes. Someone who treats 15,000 as a second meter after 9 | “increment from 9 to 10 as +5,000 XP, from a 10,000 total to 15,000” | Pass; missing grant/not |
| 5 | Yes. Harvested all afternoon, no popup | H2-2 H3 four-step check; XP now, window after sleep | Pass; only the result check |
| 6 | Yes. Related query is whether watering increases Farming | “Watering is not the XP action”; opening sprinkler sentence | Pass |
| 10 | Yes. Wants a from-0 plant count | Table 269 lifetime parsnips at 5; 0→1 wiki counts under H2-2 | Pass; missing grant/not |

“Attractive” or “clear” alone is not a pass. Each row points at a judgment already in the lock.

### 8.2 Fit

| # | Numbers in body? | Result real? | Named reader? | Method complete? | Emotion over body? | Fit |
|---|---|---|---|---|---|---|
| 1 | 0 and 2,150 are in the lock. Title “Watering and Hoeing” matches H3 “Watering and hoeing do not grant Farming XP” | Hoe/can add 0 is true; level 5 cumulative 2,150 is true | Player raising Farming | Title covers grant/not + the level-5 gate; 10, extras, sleep sit in the description | No | Pass |
| 3 | 10 is in the lock | First-product blueberry 10 is true | Same | Covers extras only | No | Pass; main promise too narrow |
| 4 | 15,000 and +5,000 are in the lock | 9→10 increment is true | Same | Missing grant/not | No | Pass; use as alt |
| 5 | No title number | XP now / popup after sleep is true | Same | Missing 5/10 totals and grant/not | No | Pass weak |
| 6 | No title number | Watering is not the XP action is true | Same | Missing the 5/10 finish marks | No | Pass; use as alt |
| 10 | 269 is in the lock | Lifetime parsnips to 5 is true | Same | Missing grant/not; from-0 scale | No | Pass weak |

No invented free / fastest / best / tested / percentage yield. Did not write watering as a true XP grant. Did not make profession choice the title frame. Title “Watering and Hoeing Add 0 XP” is not the tree article’s “Do You Have to Water Trees”; the object is Farming XP, not stage-4 adjacency.

### 8.3 Why #1

Pick **#1**.

- Head term “How to Level Up Farming in Stardew” sits at the front, naturally, without stuffing “stardew” twice.
- Both halves of I2 are in the Title: block watering/hoeing, then name 2,150 for level 5. Description supplies 15,000, blueberry 10, quality, two books, and the sleep popup.
- Anti-template: not summer’s shop-rank, not fall’s Pierre gold/day pair, not “Do You Have to Water {X}? Check {A} and {B}”, not Rancher/Tiller lock-pair.
- #6 as alt: if E thinks the word “Watering” collides with the tree article, switch to the watering-vs-harvest sentence. Do not rewrite the body.
- #4 as alt: if E wants the cumulative 15,000 / +5,000 gate in the Title. F does not self-sign a swap.

This site’s `post.title` is document title and visible H1 → Title and H1 are the same string.

---

## 9. Chosen surface (pending E title review)

| Field | Text | Characters |
|---|---|---|
| Title | How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150 | 85 |
| H1 | How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150 | 85 |
| Description | Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep. | 234 |
| slug | `how-to-level-up-farming-stardew` | — |

### slug

- User-locked: `how-to-level-up-farming-stardew`. F does not change it.
- Must not occupy `rancher-or-tiller-stardew`, `sprinkler-stardew`, `how-to-earn-money-stardew`, `best-spring-crop-stardew`, `summer-crops-stardew`, `fall-crops-stardew`, `glasshouse-stardew-valley`, `do-you-have-to-water-trees-stardew`.
- Append at the **end** of `blogPostSlugs` (currently 17 entries, this is 18th). Do not write the page until title review passes.
- English public path after assembly: `/how-to-level-up-farming-stardew`.
- Matches ZH handoff slug `how-to-level-up-farming-stardew` (bilingual identity).
- JSON-LD: `Article`. No page FAQ. Do not emit `FAQPage`.

### Surface ↔ body (for E SEOTruth; F does not sign)

| Surface | Lock support |
|---|---|
| How to Level Up Farming in Stardew | Head term; I2; opening three sentences |
| Watering and Hoeing Add 0 XP | “Using a hoe or a watering can does not grant Farming XP by itself”; H3 “Watering and hoeing do not grant Farming XP”; “The hoe and can themselves add 0 Farming XP” |
| Level 5 Needs 2,150 | “2,150 for level 5”; table level 5 = 2,150 |
| Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars | Opening source sentence; H3 “Animals are 5 XP; the Almanac and Book of Stars are 250” |
| A blueberry pull is 10 XP, not 10 times the berry count | “A blueberry pull that yields three berries still grants 10 Farming XP once” |
| Quality stars add none | “Quality does not change the XP”; “High-quality crops grant the same amount of XP as normal-quality crops” |
| Level 10 is 15,000 total | “15,000 for 10”; table 10 = 15,000; 9→10 is +5,000 |
| XP posts now, the popup waits for sleep | “Experience is added when the harvest … happens”; “The level-up window does not appear until after you sleep” |

Not promised: fastest; we measured; watering grants XP; Year 1 calendar; Rancher vs Tiller how to pick; planner computes Farming XP; Winter Seeds XP = 3 or 0.

### Alternate (only if E returns the Title; not the handoff `seo` main fields)

Title/H1: How to Level Up Farming in Stardew: Watering Does Not Increase the Skill; Harvest Does  
Description: Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. Level 5 is 2,150; level 10 is 15,000 total. A blueberry pull is 10 XP; the popup waits for sleep.

---

## 10. Handoff to E for title review

Please review only Title / H1 / Description / slug against the **locked body** (hash `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`): same promise, stop reason, main intent, last-3 anti-template.

- Draft handoff: `docs/blog-ops/how-to-level-up-farming-stardew/handoff-en.md`
- Public-reference map: `docs/blog-ops/how-to-level-up-farming-stardew/public-refs-en.json`
- Status: **`title_pending`**. Not `freezePublicBlogHandoff`
- F does not declare SEOTruth pass
- Bad title → return to F to change the surface, then E again
- Body gap → void this lock, return to C (facts to A, layout to B); D/E re-check the new version before a new lock

User final review: not started (content-only); waits for the live site page. Does not block title review. Content-only: this pass does not assemble pages and does not edit `src/` / `app/` / `public/`.

---

## 11. Freeze (after E title PASS)

E-en title review: `E-en-title-review.md` this version **PASS**, must-fix **0**, bound hash `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`. F has advanced `handoff-en.md` from `title_pending` to **`title_passed`**, `frozen: true`, `freezePublicBlogHandoff: true`. Freeze did not change locked body, `bodyHash`, Title, H1, Description, or slug. Did not edit `src/` / `app/` / `public/`.
