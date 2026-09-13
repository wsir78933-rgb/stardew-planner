# F-en lock and titles: summer crops stardew (en / US)

- Role: Agent F-en (lock + titles. Independent new session. Not A/B/C/D/E/G)
- Did not rewrite the body. Did not edit `src/` or `public/`
- Input body: `docs/blog-ops/summer-crops-stardew/C-en-draft.md` reader body before the editor separator
- D: `D-en-check.md` this version **PASS**, must-fix 0
- E: `E-en-review.md` this version **PASS**, must-fix 0 (re-appraisal after Luau purchase-price patch)
- Fingerprint (reader opening): “There is no single best outdoor summer crop. Starfruit sits at the top of the wiki gold/day table only after you can reach Oasis and pay 400g a seed”
- Luau sentence (this candidate): “The Luau sells one starfruit per year for 3,000g. That is a festival shop aside, not a field plan and not a gold/day cell.”
- E full-file SHA-256 of `C-en-draft.md`: `d8b00c89ae18b1b291162ea73a6a80ec2cfbd4bae5e04883bd0c0b9504e3c2a9` (recomputed: match)
- This file’s Title / H1 / Description go to E for title review. F **cannot** sign SEOTruth

Lock version: `2026-09-13-en-summer-crops-lock-1`  
locale / country: `en` / `US`  
Head term: `summer crops stardew`

---

## 0. Gap check (no rewrite)

No bounce to A / B / C.

| Check | Result |
|---|---|
| D and E same final candidate | Yes. Same Luau “sells … for 3,000g” line, same first reader H2, same first 40 words, same full-file hash `d8b00c89…`. Prior FAIL `ba57488d…` is superseded. |
| ReaderTask (B I2) | Outdoor Summer rank on wiki gold/day, with Year 1 Pierre / Oasis Starfruit / Year 2 Red Cabbage on the same table, then occupancy. Opening + H2-1…H2-6 match. |
| Information gain | Access on the gold/day rows; one-cycle ~26.92g vs season-total; derived last-plant 16/15; blueberry/melon/hops occupancy fork; watering-can plant count. All in the lock. |
| Public references | Every C `PublicReference` quote exists once in the lock. See §3. |
| Structure | No FAQ. Two italic captions (Fig 1–2) remain; no `src`. Not a body gap. |
| NFC / newlines | Already NFC, LF only, no CR |
| Length | Script mechanical_units **3509** ≥ 2000. See §2 |

Not a gap (no rewrite, no bounce):

- Working H2/H3 in C are `###` / `####` because they sat under editorial `## 1. Working H2/H3 + body`. That wrapper is **not** in the lock. G must render lock `###` as `<h2>` and `####` as `<h3>`. Words were not changed.
- E reported reader-body SHA-256 `a7dd64c9b8cd19ac5f895e3646249c8d58a2333bb84eeb4da926dd54f414776c`. Recompute: that digest is this lock **plus** the editor separator line (`\n---`). Task is to lock the reader body **before** the separator (same cut as F-zh). Locked hash is `91d2e0f0…`. Same candidate.
- Figure files are not in the lock. G binds `.webp`. E page review waits for the live page.
- Optional E notes (coffee cells omitted, Pierre Wednesday unstated) stay out of this lock.

---

## 1. Locked body

| Field | Value |
|---|---|
| Lock file | `docs/blog-ops/summer-crops-stardew/locked/en-body.txt` |
| Extract | `C-en-draft.md` from the first reader paragraph through the blank line before the editor `---`; join with `\n`; trailing empty line becomes a single LF. Dropped: file H1, role block, first `---`, `## 1. Working H2/H3 + body`, editor appendix |
| Encoding | UTF-8 |
| Normalization | NFC |
| Newlines | LF only (`\r` not in the file) |
| Byte length | 23303 |
| SHA-256 (locked UTF-8 bytes) | `91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80` |
| vs E reader-body digest | E `a7dd64c9…` = these bytes + `\n---`. Full-file `d8b00c89…` matches E. |
| Quench | **Zero word changes.** No polish, no add/delete, no link or caption edits |

`sha256_raw` = `sha256_nfc_lf` (NFC before write, no CR).

---

## 2. Count (script output; no eyeballing)

Command:

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
  "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/summer-crops-stardew/locked/en-body.txt" \
  --locale en
```

No `--exclude-heading`: lock has no FAQ / Sources / CTA section. H2/H3 lines are omitted by the script’s heading rule; section bodies stay.

Script stdout (verbatim):

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/summer-crops-stardew/locked/en-body.txt",
  "locale": "en",
  "mechanical_units": 3509,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [],
  "omitted_line_counts": {
    "headings": 11,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 63,
    "frontmatter": 0
  },
  "sha256_raw": "91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80",
  "sha256_nfc_lf": "91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80"
}
```

| Item | Value |
|---|---|
| locale | en (English words; hyphen/apostrophe compounds count as one unit) |
| mechanical_units | **3509** |
| required_floor | 2000 |
| meets_mechanical_floor | true |
| Headings / H2 / H3 | Not counted (`headings`: 11 = working H2 × 6 as `###` + working H3 × 5 as `####`) |
| FAQ / Sources / CTA sections | None in the lock |
| URL | Script strips |
| Italic captions | Present as body italic paragraphs (not HTML `figcaption`); the script counts those words. Floor still clears by a wide margin |
| Table alignment rows, blank lines | `non_body`: 63 |
| Table cell words | Counted |
| Semantic qualification | Script does not sign; D/E already PASS this body |

Length hard floor: **pass**.

---

## 3. Public-reference spot check

Every C appendix quote was counted in the NFC lock. All **n = 1**. Handoff `occurrence` keeps C’s `1`.

Luau quote in the lock: `The Luau sells one starfruit per year for 3,000g.`

---

## 4. Body promise (internal, before titles)

| Question | Answer |
|---|---|
| What the click actually delivers | One outdoor Summer ranking on wiki gold/day, with shop access on the same rows, then occupancy / derived last-plant so each wet tile gets a legal seed |
| Strongest verified fact | Starfruit ~26.92g/day is one 13-day cycle at Oasis 400g; Year 1 Pierre top cell is blueberry 20.8g; Red Cabbage ~17.78g is Year 2 Pierre; melon ~14.17g / hops ~13.52g occupy tiles differently |
| View only this article can cash | There is no single best outdoor summer crop; copy the table-top row only after the shop is open and the tile is free |
| Must not promise | One unsourced “best” / “most profitable”; Pale Ale ranked on this table; Shockbyte season-total as wiki gold/day; planner computes gold/day, last-plant, or giant 1%; greenhouse / bundle as the H1 job |

Core promise (one main intent): rank outdoor summer crops by the shop you can open this morning, then wiki gold/day, then wet-tile occupancy.

---

## 5. Last 3 English titles (anti-template)

Source: `src/blog/blog-post-registry.tsx` English `title` (publishing last three).

| slug | EN title |
|---|---|
| best-spring-crop-stardew | Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1 |
| how-to-earn-money-stardew | How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning |
| rancher-or-tiller-stardew | Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair |

Templates to leave (structure, not a ban on the head term):

1. `Best {Season} Crop in Stardew: Year 1 Can’t Buy {crop} on {date}`
2. `How to {task}: Year 1 {resource} You Can {do} This Morning`
3. `{A} or {B} in Stardew: {level} Also Locks Your {pair}`

This article must not become “Best Summer Crop in Stardew: Year 1 Can’t Buy Starfruit on Summer 1.” Head term `summer crops stardew` may appear naturally. No unsourced superlative.

---

## 6. Ten free directions (no formula labels while generating)

Same main intent. Difference is a real fact, angle, or phrasing — not ten synonyms and not ten search intents.

| # | Title direction | Description direction |
|---|---|---|
| 1 | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning | Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day. |
| 2 | Summer Crops in Stardew: Starfruit Sits First Only After You Reach Oasis | Wiki gold/day is about 26.92g for one 13-day cycle at 400g a seed. Without a repaired bus, blueberry is 20.8g on Pierre. The derived last plant is Summer 15, not a wiki field name. |
| 3 | Summer Crops in Stardew: Year 1 Can't Copy Starfruit onto Every Hoe Mark | Drop Starfruit without a repaired bus. Pierre's Year 1 counter is blueberry 20.8g, melon about 14.17g, hops about 13.52g. |
| 4 | Summer Crops in Stardew: Blueberry, Melon, and Hops Don't Share One Occupancy | Without a repaired bus, drop Starfruit. Blueberry still occupies the tile on the 26th pick; a melon 3-by-3 holds nine tiles; hops block walking at every living stage. |
| 5 | Summer Crops in Stardew: The Gold/Day Top Row Can Still Be the Wrong Occupant | Rank outdoor summer crops on one wiki gold/day table with access on the same rows. Then name the shop that can sell the seed this morning and the next date that tile is empty or blocked. |
| 6 | Summer Crops in Stardew: A Seed Bought on Summer 16 Does Not Finish Starfruit | Derived last plant is 28 minus grow days: starfruit 15, melon 16. The shop can still sell a packet that wilts unfinished on Fall 1. |
| 7 | Summer Crops in Stardew: If the Bus Is Down, Skip Starfruit This Morning | Pierre's Year 1 counter has blueberry at 20.8g. Starfruit Seeds cost 400g at Oasis after Vault 42,500g or Joja Bus Repair 40,000g. |
| 8 | Summer Crops in Stardew: Wiki Gold/Day Is One Cycle, Not a Season-Total Pile | Starfruit's about 26.92g is (750g − 400g) / 13. Two finished cycles are a different pile of gold. Do not mix them into one "most profitable" name. |
| 9 | Summer Crops in Stardew: Year 2 Red Cabbage Joins the Table, Still Below Blueberry | Pierre sells red cabbage for 100g from year 2 at about 17.78g/day, between blueberry 20.8g and melon about 14.17g. It does not cancel hops as a walking wall. |
| 10 | Summer Crops in Stardew: Walk Wet Tiles Before You Pay Pierre or Sandy | For each wet tile, name the crop, the shop that can sell the seed this morning, and the next date that tile is empty or blocked. Skip starfruit if the bus is down. |

---

## 7. Classify, then filter

| # | Mechanism | Stay elements | Drive | Disposition |
|---|---|---|---|---|
| 1 | 结论前置 | 捷径, 冲突 | 懒惰 | **Keep.** Opening method: shop, then gold/day, then occupancy |
| 2 | 反差数字 | 金钱, 异常 | 贪婪, 傲慢 | **Keep for check.** True gate; narrower than the full I2 job |
| 3 | 自我颠覆 | 冲突, 终结 | 傲慢 | **Drop.** Same skeleton as the spring title |
| 4 | 结论前置 | 冲突 | 懒惰 | **Keep as alt.** Year 1 occupancy; Oasis / Year 2 sit only in the description |
| 5 | 自我颠覆 | 冲突, 异常 | 傲慢 | **Keep for check.** Body: a gold/day winner can still be the wrong occupant |
| 6 | 反差数字 | 终结 | 懒惰 | **Drop.** Last-plant is a sub-question, not the main intent |
| 7 | 损失进入 | 金钱, 终结 | 贪婪 | **Drop.** “Skip Starfruit This Morning” copies the spring “can’t buy” beat and the money title’s “This Morning” ending |
| 8 | 反差数字 | 金钱, 异常 | 贪婪 | **Drop.** Metric fence, not the ranking job |
| 9 | 反差数字 | 金钱 | 嫉妒 | **Drop.** Year 2 row only |
| 10 | 群体点名 | 捷径 | 懒惰 | **Keep as alt.** Executable close, not the ranking method |

After drops, two-check set: 1, 2, 4, 5, 10.

---

## 8. Two checks

### 8.1 Stop

Target reader: about to plant outdoor Summer, searching `summer crops stardew` / “best / most profitable / year 1 / year 2”. Opened SERP is wiki Summer + ranking threads, not a planner tutorial.

| # | Would they stop? Concrete gap | Body support | Stop |
|---|---|---|---|
| 1 | Yes. They expect a crop name; the title makes the shop the first rank key | Opening: “Rank by the shop you can open this morning, then by the Crops gold/day figure, then by how many tiles you can water” | Pass |
| 2 | Yes. SERP treats Starfruit as first; the title gates it on Oasis | Opening + H2-4 Oasis 400g | Pass |
| 4 | Yes for no-desert Year 1. Three Pierre crops, not one winner | H2-3 | Pass (narrow) |
| 5 | Yes. Ranking pages copy row one; the title says occupancy can veto | “A crop that wins gold/day on a full season can still be the wrong occupant” | Pass |
| 10 | Yes as a checklist. Weaker as the H1 job | H2-6 close | Pass (weak) |

“Attractive” or “clear” alone is not a pass. Each row points at a judgment already in the lock.

### 8.2 Fit

| # | Numbers in body? | Result real? | Named reader? | Method complete? | Emotion over body? | Fit |
|---|---|---|---|---|---|---|
| 1 | No title numbers | Shop-first rank is the opening | Outdoor Summer planter | Body gives shop + table + occupancy | No | Pass |
| 2 | None in the title | Oasis gate is true | Same | Title covers Starfruit only | No | Pass; main promise too narrow |
| 4 | None in the title | Occupancy fork is true | Year 1 no-desert slice | Misses Oasis / Year 2 in the title | No | Pass; incomplete I2 |
| 5 | None in the title | Wrong-occupant line is true | Same | Method is in the description | “Occupant” is body diction, not hype | Pass; more jargon than #1 |
| 10 | None in the title | Closing walk is true | Same | Ending, not the rank method | No | Pass weak |

No invented free / fastest / best / tested / percentage yield. “Best” is not in the chosen Title. Head term appears as “Summer Crops in Stardew” (natural, not stuffed).

### 8.3 Why #1

Pick **#1**.

- Same sentence as B’s I2 and the locked opening: shop this morning, then wiki gold/day, then tiles.
- Head term used naturally at the front; not “best summer crop”.
- Anti-template: not “Year 1 can’t buy {crop} on {date}”, not “A or B locks {pair}”, not “how to earn gold this morning”.
- Shared closing words “This Morning” with `/how-to-earn-money-stardew` are a **watch item** for E, not a clone of that title’s job (shop access ≠ spend the starter 500g). If E rejects the echo, use alt #5.
- #2 makes the Starfruit gate the whole promise.
- #4 / #10 under-cover Oasis and Year 2.

This site’s `post.title` is document title and visible H1 → Title and H1 are the same string.

---

## 9. Chosen surface (pending E title review)

| Field | Text | Characters |
|---|---|---|
| Title | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning | 67 |
| H1 | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning | 67 |
| Description | Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day. | 253 |
| slug | `summer-crops-stardew` | — |

### slug

- Readable, on-theme, **new**.
- Does not collide with the 14 slugs in `project-interface-spec.md`.
- **Must not** occupy `best-spring-crop-stardew`. This choice does not.
- Append at the **end** of `blogPostSlugs` (15th).
- English public path after assembly: `/summer-crops-stardew`.
- Matches ZH handoff slug `summer-crops-stardew` (bilingual identity). No Fail-Fast conflict.

### Surface ↔ body (for E SEOTruth; F does not sign)

| Surface | Lock support |
|---|---|
| Summer Crops in Stardew | Head term; outdoor Summer ranking throughout |
| Rank by the Shop You Can Open This Morning | “Rank by the shop you can open this morning, then by the Crops gold/day figure…” |
| Starfruit sits at about 26.92g/day | “Starfruit’s wiki gold/day of about 26.92g is one 13-day cycle” / table ~26.92g |
| only after you can reach Oasis and pay 400g a seed | Opening; “Starfruit Seeds cost **400g** there” |
| Year 1 at Pierre's is blueberry, melon, or hops by tile | Opening; H2-3 |
| not one crop on every hoe mark | “not a single first-place crop copied onto every hoe mark” |
| Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day | Opening “about 17.78g/day”; table / H2-4 ~17.78g |

Not promised: a single best crop; Pale Ale on this table; planner gold math; greenhouse layout; Community Center bundle as the H1 job.

### Alternate (only if E returns the Title; not the handoff `seo` main fields)

Title/H1: Summer Crops in Stardew: The Gold/Day Top Row Can Still Be the Wrong Occupant  
Description: Rank outdoor summer crops on one wiki gold/day table with access on the same rows. Starfruit needs Oasis at 400g a seed; Year 1 at Pierre's is blueberry, melon, or hops by tile; Year 2 puts Red Cabbage on that table at about 17.78g/day.

---

## 10. Handoff to E for title review

Please review only Title / H1 / Description / slug against the **locked body** (hash `91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80`): same promise, stop reason, main intent, last-3 anti-template.

- Draft handoff: `docs/blog-ops/summer-crops-stardew/handoff-en.md`
- Status: **`pending_title_review`**. Not `freezePublicBlogHandoff`
- F does not declare SEOTruth pass
- Bad title → return to F to change the surface, then E again
- Body gap → void this lock, return to C (facts to A, layout to B); D/E re-check the new version before a new lock

User final review: not started; waits for the live site page. Does not block title review.
