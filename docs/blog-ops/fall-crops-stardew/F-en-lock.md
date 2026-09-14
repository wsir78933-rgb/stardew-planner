# F-en lock and titles: fall crops stardew (en / US)

- Role: Agent F-en (lock + titles. Independent new session. Not A/B/C/D/E/G)
- Did not rewrite the body. Did not edit `src/` or `public/`
- Input body: `docs/blog-ops/fall-crops-stardew/C-en-draft.md` reader body before `## Editor appendix (not reader body)`
- D: `D-en-check.md` this version **PASS**, must-fix 0
- E: `E-en-review.md` this version **PASS**, must-fix 0
- Fingerprint (reader opening): “There is no single best outdoor fall crop. Year 1 at Pierre’s is a tile choice among cranberries, pumpkins, and grapes; Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed are conditions on that same gold/day table. Rank”
- First reader H2: `Best outdoor fall crop depends on year, the shop you can open, and the tiles you can water`
- H2-5 last-plant line (this candidate): “Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.”
- E reader-body SHA-256: `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a` (recomputed on this lock: **match**)
- E full-file SHA-256 of `C-en-draft.md`: `85a67e300ca1f5995a4cb63b0ccae45792d499f170eb3a4f8ff7e9e63dab1b06` (recomputed: match)
- This file’s Title / H1 / Description go to E for title review. F **cannot** sign SEOTruth

Lock version: `2026-09-14-en-fall-crops-lock-1`  
locale / country: `en` / `US`  
Head term: `stardew fall crops` (natural: Fall Crops in Stardew)  
User-locked slug: `fall-crops-stardew` (do not change)

---

## 0. Gap check (no rewrite)

No bounce to A / B / C.

| Check | Result |
|---|---|
| D and E same final candidate | Yes. Same first 40 words, same first reader H2, same H2-5 three-example last-plant line, same full-file hash `85a67e30…`. E reader-body hash `887127eb…` matches this lock. |
| ReaderTask (B I2) | Outdoor Fall rank on wiki gold/day, with Year 1 Pierre / Oasis beet / Year 2 artichoke / Traveling Cart Rare Seed as conditions on the same table, then occupancy. Opening + H2-1…H2-6 + FAQ + Sources match. |
| Information gain | Access on the gold/day rows; pumpkin ~16.92g is one cycle not two-planting season profit; derived last-plant 15/16/4; cranberry/pumpkin/grape occupancy fork; watering-can plant count. All in the lock. |
| Public references | Every C `PublicReference` quote exists once in the lock. See §3. |
| Structure | Visible FAQ + Sources stay in the lock (user-required). JSON-LD stays Article, not FAQPage. Two markdown figures with teaching alt/caption. No `src` rewrite. |
| NFC / newlines | Already NFC, LF only, no CR |
| Length | Script mechanical_units **4213** ≥ 2000 after `--exclude-heading FAQ --exclude-heading Sources`. See §2 |

Not a gap (no rewrite, no bounce):

- Working H2/H3 in C are already `##` / `###` (no editorial wrapper). G renders lock `##` as `<h2>` and `###` as `<h3>`. Words were not changed.
- E’s reader-body digest is this lock (opening through Sources, including the blank line after the last source). Unlike summer, there is no extra separator in E’s reader hash.
- Figure files are not in `public/` yet. G binds `.webp`. E page review waits for the live page.
- Optional E notes (H2-6 close restates H2-2’s three table questions; “legal row” diction) stay unpatched.

---

## 1. Locked body

| Field | Value |
|---|---|
| Lock file | `docs/blog-ops/fall-crops-stardew/locked/en-body.txt` |
| Extract | `C-en-draft.md` from `There is no single best outdoor fall crop.` through the Sources list, **before** `## Editor appendix (not reader body)`. Includes FAQ + Sources. Trailing blank line after the last source is kept (same bytes as E). Dropped: file H1, role block, first `---`, editor appendix |
| Encoding | UTF-8 |
| Normalization | NFC |
| Newlines | LF only (`\r` not in the file) |
| Byte length | 30698 |
| SHA-256 (locked UTF-8 bytes) | `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a` |
| vs E reader-body digest | **Same.** Full-file `85a67e30…` matches E. |
| Quench | **Zero word changes.** No polish, no add/delete, no link or caption edits |

`sha256_raw` = `sha256_nfc_lf` (NFC before write, no CR).

---

## 2. Count (script output; no eyeballing)

Command:

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
  "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/fall-crops-stardew/locked/en-body.txt" \
  --locale en --exclude-heading FAQ --exclude-heading Sources
```

Script stdout (verbatim):

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/fall-crops-stardew/locked/en-body.txt",
  "locale": "en",
  "mechanical_units": 4213,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "FAQ",
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 14,
    "code": 0,
    "excluded_sections": 36,
    "non_body": 71,
    "frontmatter": 0
  },
  "sha256_raw": "887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a",
  "sha256_nfc_lf": "887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a"
}
```

| Item | Value |
|---|---|
| locale | en (English words; hyphen/apostrophe compounds count as one unit) |
| mechanical_units | **4213** |
| required_floor | 2000 |
| meets_mechanical_floor | true |
| Headings / H2 / H3 | Not counted (`headings`: 14 = reader `##` × 8 including FAQ + Sources + reader `###` × 6) |
| FAQ / Sources sections | Excluded from the floor (`excluded_sections`: 36). They remain in the lock for the page. |
| URL | Script strips |
| Figure alts | Image markdown stripped; following caption paragraphs count |
| Table alignment rows, blank lines | `non_body`: 71 |
| Table cell words | Counted |
| Semantic qualification | Script does not sign; D/E already PASS this body |

Length hard floor: **pass**. No bounce to C.

---

## 3. Public-reference spot check

Every C appendix quote was counted in the NFC lock. All **n = 1**. Handoff `occurrence` keeps C’s `1`.

H2-5 line in the lock: `Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.`

---

## 4. Body promise (internal, before titles)

| Question | Answer |
|---|---|
| What the click actually delivers | One outdoor Fall ranking on wiki gold/day, with shop access on the same rows, then occupancy / derived last-plant so each wet tile gets a legal seed |
| Strongest verified fact | Year 1 Pierre top cell is cranberry about 18.89g; pumpkin about 16.92g is one 13-day cycle; grape 16.8g blocks walking; Sweet Gem about 83.33g needs a Traveling Cart Rare Seed at 1,000g; artichoke 16.25g is Year 2 Pierre; beet is Oasis: 20g |
| View only this article can cash | There is no single best outdoor fall crop; copy the table-top row only after the shop is open and the tile is free |
| Must not promise | One unsourced “best” / “most profitable”; keg/jar ranking; Oasis hours / bus gold; Cart timetable; planner computes gold/day, last-plant, or giant 1%; greenhouse / bundle as the H1 job |

Core promise (one main intent): rank outdoor fall crops by the seed you can buy, then wiki gold/day, then wet-tile occupancy, with Year 1 Pierre / Oasis beet / Year 2 artichoke / Rare Seed as conditions on the same table.

---

## 5. Last 3 English titles (anti-template)

Source: live registry, as given for this pass (do not invent others).

| # | EN title |
|---|---|
| 1 | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| 2 | Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair |
| 3 | How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning |

Templates to leave (structure, not a ban on the head term):

1. `{Season} Crops in Stardew: Rank by the Shop You Can Open This Morning`
2. `{A} or {B} in Stardew: {level} Also Locks Your {pair}`
3. `How to {task}: Year 1 {resource} You Can {do} This Morning`

This article must **not** become “Fall Crops in Stardew: Rank by the Shop You Can Open This Morning.” Head term `stardew fall crops` may appear naturally as “Fall Crops in Stardew.” No unsourced superlative (`best` / `fastest` / `tested`).

---

## 6. Ten free directions (no formula labels while generating)

Same main intent. Difference is a real fact, angle, or phrasing — not ten synonyms and not ten search intents.

| # | Title direction | Description direction |
|---|---|---|
| 1 | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed | Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table. |
| 2 | Fall Crops in Stardew: Year 1 Pierre Is Cranberries, Pumpkins, or Grapes by Tile | Highest Pierre cell is cranberry at about 18.89g. Pumpkin about 16.92g is one 13-day cycle. Grape is 16.8g and blocks walking. Sweet Gem about 83.33g needs a Rare Seed at 1,000g; artichoke 16.25g is year 2+. |
| 3 | Fall Crops in Stardew: Don't Treat 83.33g as This Morning's Shopping List | Without a Rare Seed, Year 1 Pierre's highest outdoor cell is cranberry at about 18.89g. Artichoke 16.25g is year 2+. Beet is Oasis: 20g, not Pierre Fall Stock. |
| 4 | Fall Crops in Stardew: Pumpkin 16.92g Is One Cycle, Not Two-Planting Season Profit | Keep 16.92g next to cranberry 18.89g only as wiki gold/day. Occupancy still splits tiles among cranberry picks 8/13/18/23/28, a pumpkin 3-by-3, and a grape walk. |
| 5 | Fall Crops in Stardew: A Pumpkin Seed After Fall 15 Wilts Unfinished on Winter 1 | Derived last plant is 28 minus grow days: pumpkin 15, fairy rose 16, Sweet Gem 4. Rank the rest on one gold/day table with shop access on the same rows. |
| 6 | Fall Crops in Stardew: One Gold/Day Table, With Shop Access on Every Row | Rank outdoor fall crops on one wiki gold/day table with access on the same rows. Year 1 at Pierre's is cranberry about 18.89g, pumpkin about 16.92g for one 13-day cycle, and grape 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed join that table. |
| 7 | Fall Crops in Stardew: Fall 14 Morning, the Cranberry Tile Is Still Occupied | Planted Fall 1, cranberry picks land on 8, 13, 18, 23, and 28, so Fall 14 the tile is still occupied when a Fall 1 pumpkin is ready. Rank by shop, then wiki gold/day, then occupancy. |
| 8 | Fall Crops in Stardew: Year 2 Artichoke Joins Pierre at 16.25g, Still Below Cranberry | Cranberry about 18.89g stays first on the same no-fertilizer, no-Tiller scale. Year 2 does not cancel grape's walk block or pumpkin's nine-tile hold. |
| 9 | Fall Crops in Stardew: If Pierre Is the Only Shop Open, Skip Sweet Gem and Beet | Year 1 Fall Stock does not sell Rare Seed, beet, broccoli, or Ancient Seeds. Cranberry about 18.89g, pumpkin about 16.92g, and grape 16.8g occupy different tiles. |
| 10 | Fall Crops in Stardew: Gold/Day Does Not Place the Plants | On one outdoor bed you still have to walk, water, and, if a giant forms, swing an axe. Grapes block that walk. A pumpkin 3-by-3 needs nine matching plants. Cranberry wants a rectangle you can harvest on 8, 13, 18, 23, and 28. |

---

## 7. Classify, then filter

| # | Mechanism | Stay elements | Drive | Disposition |
|---|---|---|---|---|
| 1 | 反差数字 | 金钱, 异常 | 贪婪, 傲慢 | **Keep.** Two published cells plus the Rare Seed gate |
| 2 | 结论前置 | 冲突 | 懒惰 | **Keep for check.** Year 1 occupancy fork; Oasis / Year 2 / cart sit in the description |
| 3 | 自我颠覆 | 金钱, 冲突 | 傲慢 | **Drop.** True body line, but “This Morning” clones summer + money closers |
| 4 | 反差数字 | 金钱, 异常 | 贪婪 | **Drop.** Metric fence, not the ranking job |
| 5 | 损失进入 | 终结 | 懒惰 | **Drop.** Last-plant is a sub-question, not the main intent |
| 6 | 结论前置 | 捷径 | 懒惰 | **Keep as alt.** Full I2 method without cloning “shop this morning” |
| 7 | 悬念场景 | 冲突 | 懒惰 | **Drop.** Calendar occupancy, not the rank-with-access job |
| 8 | 反差数字 | 金钱 | 嫉妒 | **Drop.** Year 2 row only |
| 9 | 群体点名 | 终结, 捷径 | 懒惰 | **Keep as alt.** Year 1 access; under-covers Year 2 / occupancy in the title |
| 10 | 自我颠覆 | 冲突 | 懒惰 | **Drop.** H2-6 closer, not the ranking method |

After drops, two-check set: 1, 2, 6, 9.

---

## 8. Two checks

### 8.1 Stop

Target reader: about to plant outdoor Fall, searching `stardew fall crops` / “best / most profitable / year 1 / year 2”. Opened SERP is wiki Fall + ranking threads, not a planner tutorial.

| # | Would they stop? Concrete gap | Body support | Stop |
|---|---|---|---|
| 1 | Yes. They expect one “most profitable” name; the title splits 18.89g (Pierre) from 83.33g (Rare Seed) | Opening + table + H2-3 / H2-4: cranberry about 18.89g on Year 1 Pierre; Sweet Gem about 83.33g needs a Rare Seed at 1,000g | Pass |
| 2 | Yes for Year 1. Three Pierre crops, not one winner | Opening; H2-3 | Pass (narrow) |
| 6 | Yes as a method. Weaker than the two-cell gap | H2-2 heading and table | Pass |
| 9 | Yes if they only have Pierre. Misses Year 2 / occupancy as the H1 job | H2-1 Fall Stock; H2-3 drop list | Pass (narrow) |

“Attractive” or “clear” alone is not a pass. Each row points at a judgment already in the lock.

### 8.2 Fit

| # | Numbers in body? | Result real? | Named reader? | Method complete? | Emotion over body? | Fit |
|---|---|---|---|---|---|---|
| 1 | 18.89g and 83.33g are published cells (worked example 18.89g; Sweet Gem about 83.33g*) | Pierre vs Rare Seed gate is true | Outdoor Fall planter | Body gives shop + table + occupancy; description names Year 1 trio + Year 2 / Oasis / cart | No. No best / fastest / tested | Pass |
| 2 | None in the title | Occupancy fork is true | Year 1 Pierre slice | Misses Oasis / Year 2 / cart in the title | No | Pass; incomplete I2 |
| 6 | None in the title | Access-on-rows is the H2-2 job | Same | Method title; scenes in the description | “Gold/day table” is body diction, not hype | Pass; weaker stop than #1 |
| 9 | None in the title | Pierre-only skip is true | Year 1 no-cart slice | Title skips occupancy | No | Pass; incomplete I2 |

No invented free / fastest / best / tested / percentage yield. “Best” is not in the chosen Title. Head term appears as “Fall Crops in Stardew” (natural, not stuffed).

### 8.3 Why #1

Pick **#1**.

- Same I2 access split as the locked opening: Pierre cell vs Rare Seed cell, then description names cranberry / pumpkin / grape occupancy and Year 2 artichoke / Oasis beet / cart.
- Head term used naturally at the front; not “best fall crop”.
- Anti-template: not “Rank by the Shop You Can Open This Morning”, not “A or B locks {pair}”, not “Year 1 gold you can spend this morning”.
- Numbers exist in the lock (cranberry 18.89g worked example; Sweet Gem about 83.33g). Title omits the prose “about”; description keeps “about 18.89g/day”. Watch for E: Sweet Gem cell is published as about 83.33g*.
- #2 / #9 under-cover Year 2 and Oasis in the title.
- #6 is the method title if E rejects leading with two gold/day cells.

This site’s `post.title` is document title and visible H1 → Title and H1 are the same string.

---

## 9. Chosen surface (pending E title review)

| Field | Text | Characters |
|---|---|---|
| Title | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed | 67 |
| H1 | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed | 67 |
| Description | Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table. | 241 |
| slug | `fall-crops-stardew` | — |

### slug

- User-locked. **Do not change.**
- Does not collide with the 15 slugs in `project-interface-spec.md`.
- Append at the **end** of `blogPostSlugs` (16th).
- English public path after assembly: `/fall-crops-stardew`.

### Surface ↔ body (for E SEOTruth; F does not sign)

| Surface | Lock support |
|---|---|
| Fall Crops in Stardew | Head term; outdoor Fall ranking throughout |
| 18.89g at Pierre's | “gold per day (5 × 150 − 240) / 27 = 18.89g”; “highest wiki gold/day on the Year 1 Pierre fall counter is cranberry at about 18.89g” |
| 83.33g Needs a Rare Seed | “about 83.33g”; “Without a Rare Seed, do not treat 83.33g as the Year 1 default first place”; H3 “Sweet Gem Berry needs a Rare Seed, not a Pierre packet” |
| Year 1 at Pierre's is a tile choice among cranberries…pumpkins…grapes | Opening sentence 2 |
| about 16.92g for one 13-day cycle | “Pumpkin’s published cell of about 16.92g is one 13-day cycle: (320g − 100g) / 13.” |
| grapes at 16.8g | Table and H2-3 grape: 16.8g |
| Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table | Opening; H2-4 |

Not promised: a single best crop; keg math; Oasis hours / bus gold; Cart timetable; planner gold math; greenhouse layout; Community Center bundle as the H1 job.

### Alternate (only if E returns the Title; not the handoff `seo` main fields)

Title/H1: Fall Crops in Stardew: One Gold/Day Table, With Shop Access on Every Row  
Description: Rank outdoor fall crops on one wiki gold/day table with access on the same rows. Year 1 at Pierre's is cranberry about 18.89g, pumpkin about 16.92g for one 13-day cycle, and grape 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed join that table.

---

## 10. Handoff to E for title review

Please review only Title / H1 / Description / slug against the **locked body** (hash `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a`): same promise, stop reason, main intent, last-3 anti-template.

- Draft handoff: `docs/blog-ops/fall-crops-stardew/handoff-en.md`
- Status: **`title_pending`**. Not `freezePublicBlogHandoff`
- F does not declare SEOTruth pass
- FAQ + Sources are in the locked reader body. G reads them from the body (`## FAQ`, `## Sources`). `seo.faq` is null. JSON-LD is Article, not FAQPage.
- Bad title → return to F to change the surface, then E again
- Body gap → void this lock, return to C (facts to A, layout to B); D/E re-check the new version before a new lock

User final review: not started; waits for the live site page. Does not block title review.

---

## 11. Freeze (after E title PASS)

E-en title review: `docs/blog-ops/fall-crops-stardew/E-en-title-review.md` **PASS**, must-fix 0.

Freeze did **not** change locked body, `bodyHash`, Title, H1, Description, or slug. Did not write `src/` or `public/`.

| Field | Value |
|---|---|
| Status | **`title_passed`**. `freezePublicBlogHandoff` |
| bodyHash (recomputed) | `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a` |
| Title / H1 | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| slug | `fall-crops-stardew` |
| User review | not started (waits for the live site page) |
