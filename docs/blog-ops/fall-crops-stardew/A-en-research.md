# A-en research: stardew fall crops

Role: Agent A-en (research only). Not a layout task card. Not article body. Not titles, H1, Description, FAQ answers, or `src/` / `public/` / test code.  
Keyword: `stardew fall crops`  
Site: https://stardewvalleyplanner.art/  
Project: `/Users/wusir/Desktop/开发项目集合/stardew planner`  
locale=en, country=US (task input, not inferred from SERP).  
Mode: NEW English article. User-locked slug (do not change): `fall-crops-stardew`.  
Research date: 2026-09-14.  
Game version to prefer when a source names one: Stardew Valley 1.6.15 (this repo’s `public/game-assets/1.6.15/`). Wiki pages opened here name last-edit dates, not “1.6.15” in the crop tables.

Ego-browser task space: name `fall-crops-stardew-serp-en`. First numeric id **232** (lost after a hung Pierre renderer). Continued in the same named space, new numeric id **15**.

Isolation scan: the internal canary is only in `docs/blog-ops/fall-crops-stardew/.internal-canary.txt`. It is not copied into this file.

Read before this file: ego-browser skill; V7 执行入口; 事实核验与公开引用; 03 一/二; existing titles in `src/blog/blog-post-registry.tsx`, `public/llms.txt`, occupied slugs in `src/blog/blog-post-identities.ts`. Spring/summer articles recorded as conflict only.

---

## 定词五步

### 1. 种子任务

User keyword: **stardew fall crops**.

Observed reader job on the live US SERP (not a product rewrite):

- Name the outdoor **Fall** crops, with shop access and grow/regrow.
- Decide **which crop to plant** when “best” / “most profitable” are in PAA and related searches.
- Split **Year 1** (Pierre counter; artichoke not yet) from **later** (Year 2 artichoke; Oasis beet; Traveling Cart Rare Seed).
- Secondary jobs on the same SERP, not the same article by default: Community Center Fall Crops Bundle; kegs/jars (pumpkin vs cranberry processing); greenhouse / Ancient Fruit year-round beds; Stardew Valley Expanded fall crops.

The seed is a **seasonal crop-choice** task. It is not “how to earn Year 1 gold this morning” and not “repair the 10×12 greenhouse.” Do not change the seed to a planner tutorial.

### 2. 本地表达（en-US, from the opened SERPs only）

Visible related searches / query variants on the live pages (not invented):

From `stardew fall crops` (“People also search for”):

- Stardew fall crops reddit
- Best fall crops Stardew Valley
- Fall Crops Bundle Stardew
- Stardew Valley best fall crop year 1
- Stardew fall crops list
- Stardew fall crops most profitable
- Stardew Valley best fall crop year 2
- Stardew Valley Expanded fall crops

From `best fall crops stardew valley`:

- Best fall crops stardew valley reddit
- Stardew Valley best fall crop year 1
- Best fall crops Stardew Valley late game
- Stardew Valley best fall crop year 2
- Most profitable fall crops Stardew Valley
- Best Fall crops Coral Island
- Best fall crops Stardew Valley year 3
- Fall crop Bundle Stardew

From `stardew valley fall crops`:

- Best fall crops Stardew Valley
- Stardew Valley Fall crops profit
- Stardew valley fall crops reddit
- Stardew valley fall crops list
- Stardew Valley Fall Crops Bundle
- Stardew Valley best fall crop year 1
- Stardew Valley fall crops year 1
- Stardew valley fall crops year 2

Visible People Also Ask **questions** (accordions not opened; do not invent answers):

Query `stardew fall crops`:

- What is the most profitable crop in fall Stardew Valley?
- What crops can be grown in fall in Stardew Valley?
- What's the most profitable crop in fall?
- What are the best plants to plant in Stardew Valley during the fall?

Query `best fall crops stardew valley`:

- What is the best seed to grow in Stardew Valley during the fall?
- What is the most profitable fall crop?
- What is the most profitable crop to grow in Stardew Valley?
- What is the best thing to do in fall in Stardew Valley?

Query `stardew valley fall crops`:

- What is the most profitable crop during fall in Stardew Valley?
- What's the most profitable crop in fall?
- What is the most profitable crop to grow in Stardew Valley?
- What is the most profitable winter crop in Stardew Valley?

English local phrasing actually used on opened result pages: “best crops to plant during the fall,” “favorite fall crop,” “Year One,” “Cranberries,” “Pumpkins,” “Fairy Rose,” “Artichoke,” “Grape,” “Sweet Gem Berry,” “trellis,” “giant.”

### 3. 本站冲突

Read range (not a full-site crawl): live homepage, `/blog`, `/best-spring-crop-stardew`, `/summer-crops-stardew`, `/how-to-earn-money-stardew`, `/glasshouse-stardew-valley`; local `src/blog/blog-post-registry.tsx` (all 15 EN titles), `public/llms.txt`, `src/blog/blog-post-identities.ts`, `docs/seo/cluster-plan.md`, Fall H2 of `how-to-earn-money-stardew.en.tsx`, greenhouse crop-job H2 of `glasshouse-stardew-valley.en.tsx`. Live URL `https://stardewvalleyplanner.art/fall-crops-stardew` returned **404**. Occupied slugs do not include `fall-crops-stardew`. Cannot claim every paragraph of every article was reread.

| Existing page | Title (EN, live) | Task | Relation to this keyword |
|---|---|---|---|
| `/best-spring-crop-stardew` | Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1 | Outdoor **Spring** occupancy + wiki gold/day; Egg Festival strawberries; giant cauliflower | Parallel seasonal article. **Do not rewrite.** |
| `/summer-crops-stardew` | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning | Outdoor **Summer** ranking; Pierre vs Oasis Starfruit vs Year 2 Red Cabbage | Parallel seasonal article. Cluster plan already parks “Best fall crops” as a **future separate URL**. Summer mentions Fall 1 wilt and corn continuing into Fall. **Do not rewrite.** |
| `/how-to-earn-money-stardew` | How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning | Year 1 **gold loop**: named spend, watering-can energy, shops vs shipping box | Has a Fall H2 “sell now, or lock gold into the next unlock” and lists Pierre fall seed prices. It does **not** rank fall crops, give gold/day, last-plant math, giant pumpkin, or grape trellis layout. Neighboring job, not this seed. |
| `/glasshouse-stardew-valley` | Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers | Indoor 10×12 bed, border sprinklers, fruit-tree ring | Season does not apply indoors. H2 “Pick crops by the job you want the room to do.” Not an outdoor fall ranking. Neighboring job. |
| `/sprinkler-stardew` | Sprinklers: unlock tier, place, where it fails | 4 / 8 / 24 coverage | Water overlay, not crop ranking. |
| `/rancher-or-tiller-stardew` | Tiller 10% vs Rancher 20% | Profession lock | Tiller multiplies crop sell; not a fall list. |
| Homepage `/` | Stardew Valley Planner | Browser farm layout, 8 maps + Ginger Island, season switch including fall | Tool can sketch a fall bed. It does not compute gold/day or sell seeds. |

Conflict decision: **new article**. Same *template* as spring/summer (outdoor season, year/access, occupancy, wiki gold/day assumptions) is allowed; same Spring/Summer facts, festival, Starfruit, and H1s are not. Do not overwrite `/best-spring-crop-stardew` or `/summer-crops-stardew`. User-locked slug `fall-crops-stardew` is free (404 + not in `blogPostSlugs`).

### 4. 扩展问题

Only what was **visible** on the ego-browser snapshots.

PAA questions: listed in step 2. Answers were **not** recorded (accordions not opened). Do not treat AI Overview text as PAA answers.

Related searches: listed in step 2.

Visible AI Overview (query 2 and query 3; not a ranking, not a cite-as-wiki unless the linked wiki page was opened):

- Query 2 chrome: Cranberries “reliable repeating profit”; Pumpkins “high single-harvest” + artisan; Sweet Gem Berry “highest individual profit” from Rare Seeds / Traveling Cart, 24 days, no regrow; Artichokes Year 2; Fairy Rose bee houses.
- Query 3 chrome: “Cranberries and Pumpkins are the best…”; Grapes 10 days / regrow 3.

Those Overview lines are **SERP chrome**. Numbers used in the fact table below come from opened wiki pages, not from the Overview.

Forum/Reddit questions visible on opened threads:

- “What are the best crops to plant during the fall?” (Reddit, cranberries vs pumpkins vs corn-across-summer).
- “What’s your favorite fall crop and why?” (official forums; profit vs aesthetics vs artisan).

Bundle is a **different job** on related searches (`Fall Crops Bundle Stardew`). SVE is a related search; this site’s SVE page is marriage, not crops.

### 5. 当地 SERP

See the SERP log below. US English Google **was obtained** via ego-browser with `hl=en&gl=us&pws=0&num=10`. Footer: **Results are not personalized** and **New York - From your IP address** (query 3 footer: **New York NY, New York — From your IP address**). `document.documentElement.lang = en`. URL retained `gl=us&hl=en`. Not a generic unlabeled SERP.

---

## SERP log

### Query 1 (primary)

| Field | Value |
|---|---|
| Provider | Google Search, opened in local ego-browser (task space `fall-crops-stardew-serp-en`, first id **232**, continued as **15**) |
| Query | `stardew fall crops` |
| Requested | `hl=en&gl=us&pws=0&num=10` |
| Actual URL | `https://www.google.com/search?q=stardew+fall+crops&hl=en&gl=us&pws=0&num=10` |
| Title | `stardew fall crops - Google Search` |
| Language chrome | `html lang=en`; search box value `stardew fall crops`; UI All / Images / Short videos / Videos / Shopping / News in English |
| Country / region evidence | Footer: **“Results are not personalized”** and **“New York - From your IP address”**; URL retains `gl=us&hl=en` |
| Date | 2026-09-14 (session). Google timestamp token on the page: `sxsrf=...:1789344085381` |
| CAPTCHA / consent | None. Results rendered. `pws=0` was in the URL. |
| Result count chrome | AITDK overlay: “About 2,250,000 results” (extension UI, not a Google-official count to cite in the article) |

Organic results in snapshot order (ads/sponsored skipped; AITDK widgets skipped; Images pack skipped; AI Mode heading skipped as a result row):

| # | Type | Title | URL |
|---|---|---|---|
| 1 | wiki | Fall | https://stardewvalleywiki.com/Fall |
| 2 | forum | What are the best crops to plant during the fall? | https://www.reddit.com/r/StardewValley/comments/1f5l3xr/what_are_the_best_crops_to_plant_during_the_fall/ |
| 3 | forum | What's your favorite fall crop and why? | http://forums.stardewvalley.net/threads/what%E2%80%99s-your-favorite-fall-crop-and-why.49039/ (opened as https://forums.stardewvalley.net/threads/what%E2%80%99s-your-favorite-fall-crop-and-why.49039/) |
| 4 | video | The Ultimate Fall Crops Guide - Year One | https://www.youtube.com/watch?v=e8uTCeG348Q |
| 5 | video | Ranking Autumn Crops in Stardew Valley | https://www.tiktok.com/@seaniedew/video/7340748627725258030?lang=en |
| 6 | wiki (fandom) | Fall - Stardew Valley Wiki - Fandom | https://stardewvalley.fandom.com/wiki/Fall |
| 7 | forum | Which Year 1 Fall crop is the most profitable? | https://steamcommunity.com/app/413150/discussions/0/5750503966489502003/?l=brazilian |
| 8 | guide / listicle | Top Money-Making Crops to Plant During Fall in Stardew ... | https://outof.games/realms/stardew-valley/guides/430-top-money-making-crops-to-plant-during-fall-in-stardew-valley/ |
| 9 | tool | Stardew Profits | https://thorinair.github.io/Stardew-Profits/ |

First **five organic URLs actually opened**: #1–#5.

Sitelinks under Reddit (not separate ranks): “Best Fall Crop? : r/StardewValley”; “What are the best crops for fall profit wise?”. Sitelinks under forums: “Fall crop choice”; “Best Crops per season.”

Not opened from this SERP (do not treat as read): Fandom #6, Steam #7 (`l=brazilian`), Out of Games #8, Stardew Profits #9, Instagram/Pinterest image pack.

### Query 2 (related; same locale params)

| Field | Value |
|---|---|
| Query | `best fall crops stardew valley` |
| Actual URL | `https://www.google.com/search?q=best+fall+crops+stardew+valley&hl=en&gl=us&pws=0&num=10` |
| Title | `best fall crops stardew valley - Google Search` |
| Region | Footer: **Results are not personalized**; **New York - From your IP address** |
| Language | `html lang=en`; query value exact |
| CAPTCHA | None |

Organic (h3 extract; AI Mode skipped):

| # | Title | URL |
|---|---|---|
| 1 | Best Fall Crop? : r/StardewValley | https://www.reddit.com/r/StardewValley/comments/1c7cx04/best_fall_crop/ |
| 2 | Fall | https://stardewvalleywiki.com/Fall |
| 3 | What's your favorite fall crop and why? | http://forums.stardewvalley.net/threads/what%E2%80%99s-your-favorite-fall-crop-and-why.49039/ |
| 4 | Which Year 1 Fall crop is the most profitable? | https://steamcommunity.com/app/413150/discussions/0/5750503966489502003/?l=brazilian |
| 5 | Top Money-Making Crops to Plant During Fall… | https://outof.games/realms/stardew-valley/guides/430-top-money-making-crops-to-plant-during-fall-in-stardew-valley/ |
| 6 | The Ultimate Fall Crops Guide - Year One | https://www.youtube.com/watch?v=e8uTCeG348Q |
| 7 | Best and Most Profitable Crops - Stardew Valley Guide | https://www.ign.com/wikis/stardew-valley/Best_and_Most_Profitable_Crops |
| 8 | Stardew Valley Best Crops | https://shockbyte.com/blog/the-best-crops-in-stardew-valley |

**Intent shift:** list query `stardew fall crops` puts **wiki Fall first**, then Reddit, official forums, then **YouTube + TikTok**. Ranking query `best fall crops…` puts **Reddit first**, wiki second, then Steam / Out of Games listicle. Do not drop forums/video as “wrong form.” Query 2 Reddit `1c7cx04`, Steam, Out of Games, IGN, Shockbyte were **not opened**.

### Query 3 (related; same locale params)

| Field | Value |
|---|---|
| Query | `stardew valley fall crops` |
| Actual URL | `https://www.google.com/search?q=stardew+valley+fall+crops&hl=en&gl=us&pws=0&num=10` |
| Title | `stardew valley fall crops - Google Search` |
| Region | Footer: **New York NY, New York — From your IP address**; **Results are not personalized** |
| Language | `html lang=en` |
| CAPTCHA | None |

Organic (h3 extract): wiki Fall; same Reddit `1f5l3xr`; official forums favorite-crop; YouTube EthanM; Steam Year 1; Out of Games; Fandom Fall; TikTok Seanie Dew. Same mix as query 1.

---

## Top 5 opened results (query 1)

### R1 — wiki list / calendar

- **URL:** https://stardewvalleywiki.com/Fall
- **Opened title:** Fall - Stardew Valley Wiki
- **Type:** wiki season page
- **Last edited (footer):** 17 January 2026, at 09:01
- **Problem solved:** What happens in Fall (third season; followed by Winter, preceded by Summer; some of the most valuable crops). Crop tables with seed price, days, max harvests, sell, gold/day. Festivals: Stardew Valley Fair (16), Spirit's Eve (27).
- **Premises / limits:** Seed price is General Store unless noted. Max harvests assume **no fertilizer, no Agriculturist**. Gold/day assumes **no fertilizer, no Tiller**; full calculation on Crops page. Artichoke Seeds year 2+. Cranberry plant produces **2** cranberries at harvest. Broccoli seed price **N/A**. Sunflower gold/day **−15g**. Sweet Gem Berry seed **Traveling Cart: 1,000g**.
- **Unanswered:** Year 1 vs Oasis as a planting plan; watering-can occupancy; grape trellis walking map; last plant day (not named); broccoli seed sources.

### R2 — forum ranking opinions

- **URL:** https://www.reddit.com/r/StardewValley/comments/1f5l3xr/what_are_the_best_crops_to_plant_during_the_fall/
- **Opened title:** What are the best crops to plant during the fall? : r/StardewValley
- **Type:** forum (Reddit, “2y ago”; archived)
- **Problem solved:** Player who used blueberries in summer asks what to plant in fall.
- **Premises:** Comments: pumpkins and cranberries; cranberries regenerate, pumpkins do not; cranberries “whole month”; pumpkins “large profits in bulk”; corn planted in summer continues through fall.
- **Unanswered:** No gold/day table; no last-plant math; no layout.

### R3 — official-forum favorites

- **URL:** https://forums.stardewvalley.net/threads/what%E2%80%99s-your-favorite-fall-crop-and-why.49039/
- **Opened title:** What’s your favorite fall crop and why? | Stardew Valley Forums
- **Type:** forum (started Feb 4, 2026)
- **Problem solved:** Favorite fall crop: profit, aesthetics, bundles.
- **Premises:** Lew Zealand: pumpkin, jars/pickles, Jack-O-Lantern, giant luck, iridium-scythe amaranth. Jooshimus: pumpkin not better than cranberries raw unless kegs; cranberries “infeasible” to process; pumpkin seeds cheaper; year 2 outdoor money moves to Ancient Fruit. Terdin: Fairy Rose purple varieties, amaranth, cranberries, late-season bok choy and wheat.
- **Unanswered:** Outdoor occupancy vs watering can; this thread is favorites, not a gold/day table.

### R4 — video (Year 1 guide)

- **URL:** https://www.youtube.com/watch?v=e8uTCeG348Q
- **Opened title:** The Ultimate Fall Crops Guide - Year One - YouTube
- **Type:** video
- **Visible on the watch page:** EthanM; 1.1K views; 2 years ago; description line “Everything You Need To Know About Growing Fall Crops and Using Sprinklers and Kegs Efficiently In Stardew Valley.” SERP chrome said duration 2:35; the watch page showed an ad overlay `0:02 / 0:55`, so **video duration is 未取得 from the watch page**.
- **Unanswered:** Transcript not taken. Do not cite this video for gold/day.

### R5 — short video (ranking)

- **URL:** https://www.tiktok.com/@seaniedew/video/7340748627725258030?lang=en
- **Opened title:** Ranking Autumn Crops in Stardew Valley | TikTok
- **Type:** video
- **Visible:** Seanie Dew; 2024-2-29; caption “Time to rank the Autumn Crops!”; 00:23 / 00:26; 4037 likes / 28 comments. Meta description is a generic ranking blurb.
- **SERP snippet (chrome on query 1, not a transcript of the opened video):** “Amor S B tier. Artichoke S plus tier. C tier cranberries. Eggplants C tier. Grape B tier profitable. Pumpkins S tier…” — do **not** treat that snippet as a verified on-page ranking.
- **Unanswered:** Audio ranking not transcribed.

---

## Candidate intents (with search evidence)

B picks one. These are candidates only.

| ID | Intent | Search evidence | Form on SERP |
|---|---|---|---|
| I1 | **List** the fall crops (what can I plant?) | Query 1 organic #1 is wiki Fall; PAA “What crops can be grown in fall in Stardew Valley?”; related “fall crops list” | Wiki tables |
| I2 | **Rank** outdoor fall crops by gold, with Year 1 / Oasis / Year 2 / cart as **conditions** of the same ranking | Query 2 puts Reddit above wiki; PAA “most profitable”; related “year 1/year 2,” “most profitable” | Forum + listicle + wiki gold/day |
| I3 | **Year 1 fall plan** (Pierre only, watering, bundles) | Related “year 1”; Steam title on SERP (unread); YouTube “Year One” | Forum / video strategy |
| I4 | **Fall Crops Bundle** checklist | Related “Fall Crops Bundle Stardew” on all three SERPs | Bundle wiki (page **not** opened this pass) |
| I5 | **Artisan / kegs** (pumpkin juice vs cranberry processing) | Official-forum Jooshimus; YouTube description names kegs | Forum + keg math (Keg page **not** opened) |
| I6 | **Giant pumpkin** how-to | Crops page giant rules; forum “if you're super lucky”; pumpkin is a named giant crop | Wiki mechanic, sub-question of ranking not a separate URL |
| I7 | **Stardew Valley Expanded fall crops** | Related search on query 1 | Mod list; this site’s SVE page is marriage |

**Recommended for B (not chosen here):** **I2**, with I1’s table as a required sub-question and I3’s Year 1 access as a condition — the same pattern as the existing spring and summer articles. I4 and I5 are other articles (bundle walkthrough; keg/jar math). Greenhouse / Ancient Fruit year-round belongs to existing glasshouse, with a short pointer. I7 is out of scope unless B is writing an SVE crop page.

Do not merge spring + summer + fall into one “best crops” page: cluster plan overlap for fall was **0–1**; related search “best Spring crop year 1” is a **different** URL already on this site; summer is already `/summer-crops-stardew`.

---

## Fact table for Fall outdoor crops

Verification date **2026-09-14** unless noted. Type: K = 主题知识 from opened wiki; T = 工具事实 from this site’s opened pages; O = 实际观察 of a live page; A = 分析判断 / derived (not a wiki-named field).

Every important claim below: fact ID, type, wording the page supports, source title+URL, publisher, evidence location, date, version/conditions, limits, public-ok.

Wiki gold/day assumptions, from opened **Crops** page (last edited 13 August 2026, at 15:27), heading **Gold per Day**:

- Calculations do not take into account Fertilizer, crop quality, or the Tiller or Agriculturist Professions.
- It is assumed that the crop is watered on the day of planting.
- Formula: `Minimum Gold per Day = ((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`
- `Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`
- Extra crops are not counted except potatoes. Plants that always give >1 item per harvest (wiki names Coffee Bean, Blueberry, **Cranberries**) use `# of crops per Harvest × Sell Price`.
- Worked example on that page: Cranberries Max Harvests = 5; Sell Price per Harvest = 2 × 75g = 150g; Seed Price = 240g; Growing Days = 7 + ((5 − 1) × 5) = 27; Gold per Day = (5 × 150 − 240) / 27 = 18.89g.

Grow times, same Crops page, heading **Grow Times**:

- Grow times exclude the day the seeds were planted. A 5-day crop planted on the 1st is ready on day 6.
- Fertilizer and Agriculturist are not in these tables.
- Unwatered day: no growth, plant does not die.
- After midnight still counts as that day.

End of season, heading **End of Season**:

- On the 1st of each season, crops no longer in season wither and die (dead crop; soil stays tilled; scythe to remove).
- Multi-season crops still in season (wiki example: corn planted in summer transitioning into fall) continue.
- Fully grown crops ready to harvest **do** wither when moving to a new season.

Trellis, heading **Trellis Crops**:

- Trellis cannot be walked through until dead.
- Available trellis crops: Green Bean, Hops, and **Grape**.

Season length used for derived last-plant: Fall crop calendars and “1st of each season” wither rule. **Last plant day is not named on the wiki.** If used in prose, label it derived: `28 - grow days` for a harvest on day 28, plant day watered, no Speed-Gro.

Gold/day is **not** a planner output.

### Fall crop numbers (Fall tables + Crops gold/day + Pierre Fall Stock)

Pierre Fall Stock (opened Pierre’s General Store, last edited 8 September 2026, at 17:55), heading **Fall_Stock**. Header row on the live table: **Fall | Out of season**. First number matches Fall wiki General Store seed price. Second number is labeled **Out of season**, not Joja (JojaMart page not opened).

Pierre hours extracted from the first body paragraphs on that page: normally open most days at **9am**, counter closes **5pm**; player can enter until **9pm** but cannot buy/sell after 5pm because it is also the family home. Wednesday-closed / Community Center exception **not** in the six paragraphs extracted this pass.

| ID | Type | Exact wording the source supports | Source title + URL | Publisher | Evidence location | Date | Version / conditions | Limits | Public |
|---|---|---|---|---|---|---|---|---|---|
| K1 | 主题知识 | Fall is the third season; followed by Winter; preceded by Summer. Some of the most valuable crops can grow during Fall. | Fall - Stardew Valley Wiki https://stardewvalleywiki.com/Fall | Stardew Valley Wiki | Lead paragraph | 2026-09-14 | Wiki last edited 17 Jan 2026 09:01 | Multi-season crops are a different list | yes |
| K2 | 主题知识 | Seed Price is General Store unless otherwise indicated. Maximum Harvests per Season assumes no fertilizer and no Agriculturist. Gold/Day assumes no fertilizer and no Tiller. See the Crops page for the full calculation. Artichoke Seeds are available from year 2+. | same Fall page | Stardew Valley Wiki | Crops intro under heading Crops | 2026-09-14 | same | Do not call gold/day “season profit” | yes |
| K3 | 主题知识 | Single-harvest Fall table: Amaranth 70g / 7d / max 3 / 150g / ≈11.43g; Artichoke 30g / 8d / 3 / 160g / 16.25g; Beet Oasis 20g / 6d / 4 / 100g / ≈13.33g; Bok Choy 50g / 4d / 6 / 80g / 7.5g; Fairy Rose 200g / 12d / 2 / 290g / 7.5g; Pumpkin 100g / 13d / 2 / 320g / ≈16.92g; Sunflower 200g / 8d / Fall 3 or Summer+Fall 6 / 80g / **−15g**; Sweet Gem Berry Traveling Cart 1,000g / 24d / 1 / 3,000g / ≈83.33g; Wheat 10g / 4d / Fall 6 or Summer+Fall 13 / 25g / 3.75g; Yam 60g / 10d / 2 / 160g / 10g | Fall page, table caption Single Harvest | Stardew Valley Wiki | sortable wikitable | 2026-09-14 | no fert, no Tiller gold/day | Single-harvest gold/day matches one cycle `(sell−seed)/days` (Pumpkin (320−100)/13 ≈ 16.92). Do not call that two-cycle season profit | yes |
| K4 | 主题知识 | Multiple-harvest Fall table. Note that each cranberry plant produces 2 Cranberries at harvest. Corn 150g / 14d / regrow 4 / Fall 4 or Summer+Fall 11 / 50g / Fall only ≈1.92g, both ≈7.41g; Cranberries 240g / 7d / 5d / 5 / 75g (x2) / ≈18.89g; Eggplant 20g / 5d / 5d / 5 / 60g / 11.2g; Broccoli N/A / 8d / 4d / 5 / 70g / ≈14.58g; Grape 60g / 10d / 3d / 6 / 80g / 16.8g | Fall page, table after “Note that each cranberry plant produces 2 Cranberries at harvest.” | Stardew Valley Wiki | sortable wikitable | 2026-09-14 | Broccoli seed input for gold/day is N/A (treated as 0 in the wiki figure) | Broccoli N/A is not “Pierre sells it for 0g” | yes |
| K5 | 主题知识 | Gold per Day formula and cranberry worked example 18.89g, as quoted above | Crops - Stardew Valley Wiki https://stardewvalleywiki.com/Crops `#Gold_per_Day` | Stardew Valley Wiki | Gold per Day section | 2026-09-14 | last edited 13 Aug 2026 15:27 | Extra cranberry chance is **not** in this gold/day | yes |
| K6 | 主题知识 | Cranberries: Yields 2 berries at harvest, with a 10% chance for more berries. Keeps producing after maturity. Pierre's 240g; JojaMart 300g; total 7 days; regrowth 5 days; ≈18.89g/d. Sell 75 / 93 / 112 / 150g | Crops page `#Cranberries` | Stardew Valley Wiki | Fall Crops → Cranberries | 2026-09-14 | same Crops page | 10% extra is **not** in wiki gold/day | yes |
| K7 | 主题知识 | Pumpkin: A fall favorite… Pumpkins can become a Giant Crop. Pierre's 100g; JojaMart 125g; total 13 days; ≈16.92g/d. Sell 320 / 400 / 480 / 640g. Inedible. Used in Autumn's Bounty, Pumpkin Pie, Pumpkin Soup, Jack-O-Lantern, Fall Crops Bundle, Quality Crops Bundle, “Carving Pumpkins” Quest; loved by Abigail, Krobus, Willy | Crops page `#Pumpkin` | Stardew Valley Wiki | Fall Crops → Pumpkin | 2026-09-14 | giant rules on Giant Crops heading | JojaMart page not opened; Joja 125g is from this Crops infobox | yes |
| K8 | 主题知识 | Grape: Grapes use a trellis, and continue to produce after maturity. Pierre's 60g; JojaMart 75g; total 10 days; regrowth 3 days; 16.8g/d. Sell 80 / 100 / 120 / 160g | Crops page `#Grape` | Stardew Valley Wiki | Fall Crops → Grape | 2026-09-14 | cannot walk through live trellis (Trellis Crops) | Summer Foraging Bundle / Vincent loved gift are grape-item facts, not outdoor gold rank | yes |
| K9 | 主题知识 | Broccoli: The flowering head… Keeps producing after maturity. Total 8 days; regrowth 4 days; ≈14.58g/d. Sell 70 / 87 / 105 / 140g. Seeds row labeled Broccoli Seeds with no shop price on this section | Crops page `#Broccoli` | Stardew Valley Wiki | Fall Crops → Broccoli | 2026-09-14 | 1.6 crop on Fall table with N/A seed price | Broccoli Seeds **source list** page not opened this pass | yes |
| K10 | 主题知识 | Ancient Fruit: Grows in Spring, Summer, or Fall. See Ancient Seeds for availability. Total 28 days; regrowth 7 days; ≈57.14g/d* footnote: assumes seed crafted for free from Ancient Seed Artifact, grown for 3 seasons. Sell 550 / 687 / 825 / 1,100g | Crops page `#Ancient_Fruit` | Stardew Valley Wiki | Special Crops | 2026-09-14 | not a Fall-only outdoor finisher | Ancient Seeds **page** not opened this pass | yes |
| K11 | 主题知识 | Sweet Gem Berry: Grows in Fall. Seeds can be found for sale at the Traveling Cart during Spring and Summer, and rarely during Fall and Winter. Can be gifted to Old Master Cannoli in the Secret Woods in exchange for a Stardrop. Rare Seed Traveling Cart 1,000g; total 24 days; ≈83.33g/d* footnote: assumes 1,000g; can be obtained for as little as 600g, but only rarely. Sell 3,000 / 3,750 / 4,500 / 6,000g. Inedible | Crops page `#Sweet_Gem_Berry` | Stardew Valley Wiki | Special Crops | 2026-09-14 | not Pierre default | Traveling Cart **page** and Rare Seed **page** not opened this pass. Night Market not mentioned in this extracted section | yes |
| K12 | 主题知识 | Pierre Fall in-season seed prices: Eggplant Seeds 20g; Corn Seeds 150g; Pumpkin Seeds 100g; Bok Choy Seeds 50g; Yam Seeds 60g; Cranberry Seeds 240g; Sunflower Seeds 200g; Fairy Seeds 200g; Amaranth Seeds 70g; Grape Starter 60g (grows on a trellis); Wheat Seeds 10g; Artichoke Seeds 30g **(Available in year 2+)**. Out-of-season column is 1.5× those prices (e.g. Pumpkin 150g, Cranberry 360g). Beet, Broccoli, Rare Seed, Ancient Seeds are **not** in this Fall_Stock table | Pierre's General Store - Stardew Valley Wiki https://stardewvalleywiki.com/Pierre%27s_General_Store `#Fall_Stock` | Stardew Valley Wiki | Fall Stock table | 2026-09-14 | last edited 8 Sep 2026 17:55 | Shop hours 9am–5pm counter (enter until 9pm). Wednesday exception not in extracted paras | yes |
| K13 | 主题知识 | Grow times exclude plant day; unwatered day does not grow and does not die; planting after midnight still counts as that day | Crops `#Grow_Times` | Stardew Valley Wiki | Grow Times | 2026-09-14 | no fertilizer / no Agriculturist on this page | | yes |
| K14 | 主题知识 | On the 1st of each season, out-of-season crops wither. Multi-season crops still in season continue (corn summer→fall example). Fully grown ready-to-harvest crops wither at season change | Crops `#End_of_Season` | Stardew Valley Wiki | End of Season | 2026-09-14 | | | yes |
| K15 | 主题知识 | Trellis crops: Green Bean, Hops, Grape. Cannot walk through until dead | Crops `#Trellis_Crops` | Stardew Valley Wiki | Trellis Crops | 2026-09-14 | | | yes |
| K16 | 主题知识 | Festivals: Fall 16 Stardew Valley Fair; Fall 27 Spirit's Eve. Other: Fall 8–11 Blackberry Season | Fall page Events / Festivals / Other tables | Stardew Valley Wiki | Events | 2026-09-14 | | Fair **shop contents** page not opened. Do not claim the Fair sells Rare Seed without that page | yes |
| A1 | 分析判断 | Derived last plant for a harvest on Fall 28, exclude plant day, no Speed-Gro: Bok Choy 24; Wheat 24; Beet 22; Amaranth 21; Artichoke 20; Sunflower 20; Yam 18; Fairy Rose 16; Pumpkin 15; Sweet Gem Berry 4 | Arithmetic on K3 grow days using `28 - grow days` | derived | n/a | 2026-09-14 | plant day watered | Wiki does **not** name “last plant day.” Same convention as the spring/summer articles | yes, if labeled derived |
| A2 | 分析判断 | Cranberry planted Fall 1, watered daily, no speed: harvests 8, 13, 18, 23, 28 (5). Matches wiki max 5 and gold/day Growing Days 27 | Calendar arithmetic + K4/K5 | derived | n/a | 2026-09-14 | | | yes, if labeled derived |
| A3 | 分析判断 | Pumpkin one-cycle wiki ≈16.92g/day is (320−100)/13. Two plantings (max 2) is a different season-total metric. Do not mix with cranberry 18.89g/day in one sentence as if both were season profit | K3 vs K5 | derived | n/a | 2026-09-14 | | Out of Games SERP snippet “Cranberries – 510g. Pumpkin – 440g” was **not** opened; 510g = 5×150−240, which is cranberry **season net**, not wiki gold/day | yes as analysis |

Recheck of published wiki gold/day using the Crops formula (shown so B can see inputs; not a new measurement):

- Pumpkin one cycle: (320 − 100) / 13 ≈ 16.92
- Artichoke: (160 − 30) / 8 = 16.25
- Grape: (6 × 80 − 60) / (10 + 5 × 3) = 420 / 25 = 16.8
- Cranberries: (5 × 150 − 240) / 27 = 18.89 (wiki example)
- Eggplant: (5 × 60 − 20) / (5 + 4 × 5) = 280 / 25 = 11.2
- Broccoli with seed 0: (5 × 70 − 0) / (8 + 4 × 4) = 350 / 24 ≈ 14.58
- Corn Fall only: (4 × 50 − 150) / (14 + 3 × 4) = 50 / 26 ≈ 1.92
- Sunflower: (80 − 200) / 8 = −15
- Sweet Gem at 1,000g: (3,000 − 1,000) / 24 ≈ 83.33

### Occupancy / access notes (same rows, not extra articles)

| Crop | Seed source / price (opened) | Grow / regrow | Wiki max harvests | Wiki gold/day | Access / occupancy |
|---|---|---|---|---|---|
| Cranberries | Pierre 240g (Joja 300g on Crops infobox) | 7 / 5 | 5 | ≈18.89g | Year 1 Pierre. Two berries/harvest in gold/day; 10% extra **not** in gold/day |
| Grape | Pierre Grape Starter 60g | 10 / 3 | 6 | 16.8g | Trellis: cannot walk through live plants |
| Pumpkin | Pierre 100g | 13 / — | 2 | ≈16.92g | Giant crop (see giant rules). Occupies the tile 13 nights per cycle |
| Artichoke | Pierre 30g year 2+ | 8 / — | 3 | 16.25g | Not Year 1 Pierre default |
| Broccoli | N/A on Fall table | 8 / 4 | 5 | ≈14.58g | Not Pierre Fall_Stock. Seed methods 未取得 (Broccoli Seeds page not opened) |
| Beet | Oasis: 20g | 6 / — | 4 | ≈13.33g | Not Pierre Fall_Stock. Oasis **page** 未取得 this pass |
| Eggplant | Pierre 20g | 5 / 5 | 5 | 11.2g | Year 1 Pierre |
| Amaranth | Pierre 70g | 7 / — | 3 | ≈11.43g | Scythe harvest (Pierre description). Forum treats as aesthetic |
| Yam | Pierre 60g | 10 / — | 2 | 10g | Year 1 Pierre |
| Bok Choy | Pierre 50g | 4 / — | 6 | 7.5g | Short cycle; forum late-season favorite |
| Fairy Rose | Pierre Fairy Seeds 200g | 12 / — | 2 | 7.5g | Flower; bee-house value **not** opened on Bee House page |
| Wheat | Pierre 10g | 4 / — | Fall 6; Summer+Fall 13 | 3.75g | Scythe. Two-season |
| Corn | Pierre 150g | 14 / 4 | Fall 4; Summer+Fall 11 | Fall ≈1.92g; both ≈7.41g | Two-season; Summer 28 plant continues Fall 1 (Crops End of Season example) |
| Sunflower | Pierre 200g | 8 / — | Fall 3; both 6 | **−15g** | Two-season; wiki gold/day negative because 200g seed vs 80g sell |
| Sweet Gem Berry | Traveling Cart 1,000g (Crops footnote: rarely 600g) | 24 / — | 1 | ≈83.33g | Not Pierre. One harvest. Cart **page** 未取得 |
| Ancient Fruit | Crafted Ancient Seeds (Crops: free from artifact) | 28 / 7 | (3-season footnote) | ≈57.14g/d* | Special crop; not Fall-only outdoor Year 1 |

Individual crop **item pages** (Cranberries, Pumpkin, Grape, Fairy Rose, Amaranth, Artichoke, Beet, Bok Choy, Yam, Eggplant, Corn, Sunflower, Wheat, Broccoli, Rare Seed) were **not** opened as standalone URLs this pass except as sections on the Crops page listed above. Fall + Crops + Pierre are the opened number sources.

---

## Giant pumpkin rules (wiki)

From opened Crops page heading **Giant Crops** (last edited 13 August 2026, 15:27):

- Cauliflowers, Melons, **Pumpkins**, Powdermelons and Qi Fruits planted in a **3x3** pattern can randomly combine into a giant crop.
- Giant crops drop **15–21** normal-quality items when harvested with **any axe**, taking **three hits**.
- At the start of each day, every possible 3x3 grid of crops (including overlaps) has a **1%** chance to grow into a giant crop as long as the **top left** crop is fully-grown and watered, and all constituent crops are of the same type.
- Giant crops won't necessarily appear on the day the crops finish growing; it can happen any day those criteria are met.
- Giant crops **don't die at change of season** like other crops.
- Soil underneath a giant crop may become untilled, causing any fertilizer to be lost.
- Giant crops **cannot** grow in the greenhouse, by using Garden Pots, or on Ginger Island.

Pumpkin section on the same page: “Pumpkins can become a Giant Crop.”

---

## Crops that lose the outdoor rank or are not Pierre default

| Crop | Why it drops out of a Year 1 Pierre outdoor rank | Evidence opened |
|---|---|---|
| Beet | Seed price on Fall table is **Oasis: 20g**. Not in Pierre Fall_Stock | Fall table; Pierre Fall_Stock |
| Sweet Gem Berry / Rare Seed | Traveling Cart 1,000g (rarely 600g). 24 days; one harvest. Highest wiki gold/day in the Fall single-harvest table (≈83.33g) but not a Pierre packet | Fall table; Crops `#Sweet_Gem_Berry` |
| Broccoli (1.6) | Fall table seed price **N/A**. Not in Pierre Fall_Stock. Gold/day ≈14.58g assumes no seed cost | Fall table; Crops `#Broccoli` |
| Ancient Fruit | Special crop; Spring/Summer/Fall; 28 days then every 7; gold/day footnote is 3-season free seed. Not Pierre Fall_Stock | Crops `#Ancient_Fruit` |
| Artichoke | Pierre Fall_Stock: “Available in year 2+”. Fall intro: “Artichoke Seeds are available from year 2+.” Wiki gold/day 16.25g is real **after** that gate | Fall intro; Pierre Fall_Stock |
| Corn | Two-season. Fall-only gold/day ≈1.92g; Summer+Fall ≈7.41g. Occupies tiles from a summer plant | Fall table; Crops End of Season |
| Sunflower | Wiki gold/day **−15g** because 200g seed vs 80g sell. Pierre still sells it | Fall table; Pierre Fall_Stock |
| Wheat | Two-season; 3.75g/day | Fall table |
| Fairy Rose | 7.5g/day; 200g seed. Flower / bee-house job, not the gold/day leader | Fall table |

Oasis/Sandy hours, bus repair cost, Traveling Cart schedule, Night Market, and Stardew Valley Fair shop: **pages not opened this pass** after the ego-browser RPC queue hung. Do not fill those gates from memory. Beet’s **Oasis: 20g** label on the Fall table is the opened access fact.

Fall Crops Bundle is a **different SERP job** (related searches on all three queries). Pumpkin’s Crops infobox lists Fall Crops Bundle and Quality Crops Bundle as uses. Bundle **page** not opened.

---

## Planner tool facts (live site only)

Opened 2026-09-14. Type T. Gold/day is **not** a planner output.

| ID | Type | Claim | Source | Evidence | Limits | Public |
|---|---|---|---|---|---|---|
| T1 | 工具事实 | Title: “Stardew Valley Planner – Free Online Farm Layout Tool”. H1: “Stardew Valley Planner / Free Online Farm Layout Tool”. “Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.” “Free fan-made planner. Projects stay in this browser.” | https://stardewvalleyplanner.art/ | homepage hero | Does not compute gold/day, last-plant, or giant 1% rolls | yes |
| T2 | 工具事实 | “Plan all 8 official farms, plus Ginger Island”: Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, Meadowlands; Ginger Island in the map picker | same | “What the planner does” 01 | | yes |
| T3 | 工具事实 | “Arrange buildings, crops, placeables, and decor. Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work.” | same | 02 | Coverage overlays, not crop profit | yes |
| T4 | 工具事实 | “Spring, summer, fall, and winter are available. Save import is experimental, and modded items may not map. Export a standard or high-quality screenshot.” | same | 03 and FAQ 03–05 | Season switch includes **fall** | yes |
| T5 | 工具事实 | “Projects stay in this browser. No account, no cloud sync. A different device or a data wipe will lose them.” Fan-made, not affiliated with or endorsed by ConcernedApe or Stardew Valley | same | FAQ 01 and footer | | yes |
| T6 | 工具事实 | Blog index title “Stardew Valley Planning Guides”. Latest includes summer crops, rancher/tiller, how-to-earn-money, best-spring-crop. No fall-crops card. Live `/fall-crops-stardew` is 404 | https://stardewvalleyplanner.art/blog and `/fall-crops-stardew` | O | New article | yes |
| T7 | 工具事实 | Live spring article H1/title matches registry; tables include Crop / seed / grow / wiki gold/day no fertilizer no Tiller; occupancy; derived last plant for Spring 28 | https://stardewvalleyplanner.art/best-spring-crop-stardew | tables | Neighboring method, not fall facts | yes |
| T8 | 工具事实 | Live summer article H1/title matches registry; table includes wiki max harvests and gold/day with access/occupancy; derived last plant for Summer 28 | https://stardewvalleyplanner.art/summer-crops-stardew | tables | Neighboring method | yes |
| T9 | 工具事实 | Live money article H2 “Fall and winter: sell now, or lock gold into the next unlock”. Description: Year 1 gold is not a bigger field; start 500g | https://stardewvalleyplanner.art/how-to-earn-money-stardew | H2 list | Neighboring job | yes |
| T10 | 工具事实 | Live greenhouse article: repair, 10×12 / 120 tiles, border sprinklers, fruit trees. H2 “Pick crops by the job you want the room to do” | https://stardewvalleyplanner.art/glasshouse-stardew-valley | H2s | Indoor; not outdoor fall | yes |

In-app crop palette / whether grape trellis is a walk-block in the tool: homepage opened; **palette not exercised** this session.

Local money-article Fall H2 (for conflict, not as wiki): Cranberry seeds 240g, pumpkin 100g, yam 60g, eggplant 20g, grape starter 60g, wheat 10g — matches K12 in-season Pierre prices.

---

## Information-gain notes (evidence, not slogans)

Opened competitors already cover: wiki Fall list + gold/day; Reddit cranberries vs pumpkins vs summer-planted corn; official-forum pumpkin/keg vs cranberry raw vs Fairy Rose aesthetics; a Year 1 YouTube title; a TikTok ranking caption.

This site already covers, on **other** URLs:

- Spring outdoor ranking + giant cauliflower + Egg Festival strawberries (`/best-spring-crop-stardew`).
- Summer outdoor ranking + Oasis Starfruit + Year 2 Red Cabbage + hops trellis + giant melon (`/summer-crops-stardew`).
- Year 1 gold loop, including a Fall H2 that lists Pierre seed prices and says keep Fall Crops Bundle items (`/how-to-earn-money-stardew`).
- Indoor 10×12 greenhouse (`/glasshouse-stardew-valley`).

What a **new outdoor-fall** article still needs (gaps vs opened SERP + vs this site), without cloning wiki tables as the whole page:

1. **Occupancy, not a leaderboard** — which tiles are still occupied on the morning you wanted a second pumpkin cycle, a giant 3×3, or a grape harvest path. Spring/summer pages already use this method; they do not rank cranberries/pumpkins/grapes.
2. **Access gates on the same table as gold/day** — Year 1 Pierre (cranberry 240g, pumpkin 100g, grape 60g) vs Year 2 artichoke 30g vs Oasis beet 20g vs Traveling Cart Rare Seed 1,000g vs 1.6 broccoli not sold at Pierre.
3. **Wiki gold/day assumptions in the caption** — SERP listicles (unread Out of Games snippet “Cranberries – 510g / Pumpkin – 440g”) will otherwise be copy-pasted as if they were wiki gold/day. 510g is cranberry **season net** (5×150−240), not 18.89g/day.
4. **Trellis grapes + giant pumpkin 3×3 vs cranberry rows** on one bed (planner sketch). Forums warn; none of the opened pages draw the bed.
5. **Derived last-plant** for single-harvest crops (pumpkin 15, fairy rose 16, sweet gem 4) so a late Pierre trip does not wither on Winter 1. Wiki does not name the field.
6. **Watering-can ceiling** as the Year 1 plant count — already the money article’s fall moral; the crop article should **use** it as a constraint, not retell the backpack/vault gold loop.

Not information gain (leave to other URLs): keg throughput and wine/juice aging; full Pantry / Fall Crops Bundle walkthrough; greenhouse 10×12 layouts; Ancient Fruit wine endgame; SVE crops; Stardew Valley Fair minigames.

---

## Unverified / 未取得

Do not put these in the article as facts until A re-opens a page that states them.

1. **Standalone crop item pages** — URLs such as `/Cranberries`, `/Pumpkin`, `/Grape`, `/Fairy_Rose`, `/Amaranth`, `/Artichoke`, `/Beet`, `/Bok_Choy`, `/Yam`, `/Eggplant`, `/Corn`, `/Sunflower`, `/Wheat`, `/Broccoli`, `/Rare_Seed` were not opened as full pages this pass. Numbers above are from Fall tables, Crops sections, and Pierre Fall_Stock.
2. **Broccoli Seeds sources** (raccoon, seed spots, etc.) — Crops broccoli section has no shop price; Fall table N/A.
3. **Oasis / Sandy hours, stock, and bus-repair cost** — Beet is labeled Oasis: 20g on Fall. Oasis page, Desert page, Bus Stop, Bundles Vault **not opened**.
4. **Traveling Cart page** — schedule, price ranges besides Crops Sweet Gem footnote 1,000g / rarely 600g.
5. **Night Market** — not mentioned in the extracted Sweet Gem section; page not opened. Do not invent a Rare Seed Night Market gate.
6. **Stardew Valley Fair shop** — Fall page lists the festival on day 16; Fair page not opened.
7. **Bundles page** — related search is a different job; Pumpkin infobox names Fall Crops Bundle and Quality Crops Bundle; the four Fall Crops items were **not** read from Bundles.
8. **JojaMart page** — Joja prices 300g cranberry / 125g pumpkin / 75g grape are from Crops infoboxes, not JojaMart. Pierre second column is “Out of season.”
9. **Keg / Preserves Jar processing times** — forum claims pumpkin kegs beat cranberries; Keg page not opened.
10. **Bee House / Fairy Rose honey** — not opened.
11. **PAA accordion answers** — questions visible; answers not expanded.
12. **YouTube transcript** and **TikTok audio ranking**.
13. **Query 2 Reddit** `1c7cx04`, **Steam** Year 1 thread (`l=brazilian`), **Out of Games**, **IGN**, **Shockbyte**, **Fandom Fall**, **Stardew Profits**.
14. **Pierre Wednesday / Community Center shop exception** — not in the six extracted paragraphs.
15. **Planner in-app crop names / grape walk-block in the tool**.
16. **ego-browser later batch** — after Pierre Fall_Stock, the local ego-browser RPC queued behind ~40 `ego-browser nodejs` clients and a ~99% CPU network helper; crop-item and access-gate tabs did not complete. Blocker: hung RPC / process queue, not a Google captcha.

---

## PublicReference candidates

No article-body quotes yet. B/C pick `appliesTo` later.

| id | label | url |
|---|---|---|
| wiki-fall | Stardew Valley Wiki: Fall | https://stardewvalleywiki.com/Fall |
| wiki-crops | Stardew Valley Wiki: Crops | https://stardewvalleywiki.com/Crops |
| wiki-crops-gold | Stardew Valley Wiki: Crops (Gold per Day) | https://stardewvalleywiki.com/Crops#Gold_per_Day |
| wiki-crops-giant | Stardew Valley Wiki: Crops (Giant Crops) | https://stardewvalleywiki.com/Crops#Giant_Crops |
| wiki-pierre | Stardew Valley Wiki: Pierre's General Store | https://stardewvalleywiki.com/Pierre%27s_General_Store |
| wiki-pierre-fall | Stardew Valley Wiki: Pierre's General Store (Fall Stock) | https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock |
| planner-home | Stardew Valley Planner | https://stardewvalleyplanner.art/ |
| planner-spring | This site: spring crop ranking | https://stardewvalleyplanner.art/best-spring-crop-stardew |
| planner-summer | This site: summer crop ranking | https://stardewvalleyplanner.art/summer-crops-stardew |
| planner-money | This site: Year 1 gold | https://stardewvalleyplanner.art/how-to-earn-money-stardew |
| planner-greenhouse | This site: greenhouse 10×12 | https://stardewvalleyplanner.art/glasshouse-stardew-valley |

Do not add Reddit, forums, YouTube, TikTok, or Out of Games as PublicReference until C actually quotes them. Rankings are not citations.

Candidates **not** yet verified by an opened page this pass (do not use until re-opened): Oasis, Traveling Cart, Rare Seed, Broccoli Seeds, Bundles, Stardew Valley Fair, Night Market, JojaMart, Keg.

---

## ego-browser evidence

| Field | Value |
|---|---|
| Task space name | `fall-crops-stardew-serp-en` |
| First numeric id | **232** |
| Continued numeric id | **15** (232 gone after hung Pierre renderer was killed to recover RPC) |
| Date | 2026-09-14 |
| US Google SERP | **Obtained.** `hl=en&gl=us&pws=0&num=10`. Footer New York IP; Results are not personalized; `html lang=en` |
| CAPTCHA | None on Google. No DDG fallback needed |
| Blockers | After Pierre Fall_Stock, ego-browser CLI queued (~40 concurrent `ego-browser nodejs` clients on this machine; network helper ~99% CPU). Remaining crop-item and access-gate pages **未取得**. `completeTaskSpace(15, { keep: false })` **未取得** (25s RPC timeout). Did not bypass captcha (none). Did not invent PAA answers |

URLs actually opened in ego-browser:

1. https://stardewvalleyplanner.art/
2. https://stardewvalleyplanner.art/blog
3. https://stardewvalleyplanner.art/best-spring-crop-stardew
4. https://stardewvalleyplanner.art/summer-crops-stardew
5. https://stardewvalleyplanner.art/how-to-earn-money-stardew
6. https://stardewvalleyplanner.art/glasshouse-stardew-valley
7. https://stardewvalleyplanner.art/fall-crops-stardew (404)
8. https://www.google.com/search?q=stardew+fall+crops&hl=en&gl=us&pws=0&num=10
9. https://www.google.com/search?q=best+fall+crops+stardew+valley&hl=en&gl=us&pws=0&num=10
10. https://www.google.com/search?q=stardew+valley+fall+crops&hl=en&gl=us&pws=0&num=10
11. https://stardewvalleywiki.com/Fall
12. https://www.reddit.com/r/StardewValley/comments/1f5l3xr/what_are_the_best_crops_to_plant_during_the_fall/
13. https://forums.stardewvalley.net/threads/what%E2%80%99s-your-favorite-fall-crop-and-why.49039/
14. https://www.youtube.com/watch?v=e8uTCeG348Q
15. https://www.tiktok.com/@seaniedew/video/7340748627725258030?lang=en
16. https://stardewvalleywiki.com/Crops
17. https://stardewvalleywiki.com/Pierre%27s_General_Store

Local files read (not browser): `src/blog/blog-post-registry.tsx`, `src/blog/blog-post-identities.ts`, `public/llms.txt`, `docs/seo/cluster-plan.md`, `src/blog/articles/how-to-earn-money-stardew.en.tsx` (Fall H2), `src/blog/articles/glasshouse-stardew-valley.en.tsx` (crop-job H2), `docs/blog-ops/fall-crops-stardew/.internal-canary.txt` (scan only).

Wiki crop **item** pages opened as standalone URLs this pass: **0**. Fall crop **rows** extracted from opened Fall + Crops pages: Amaranth, Artichoke, Beet, Bok Choy, Fairy Rose, Pumpkin, Sunflower, Sweet Gem Berry, Wheat, Yam, Corn, Cranberries, Eggplant, Broccoli, Grape, plus Ancient Fruit (special).

---

## Handoff to B (no layout, no titles)

- New article. User-locked slug `fall-crops-stardew`. Do not rewrite best-spring-crop-stardew or summer-crops-stardew.
- SERP obtained: US English Google, New York IP chrome, 2026-09-14, no captcha.
- One outdoor fall crop-choice intent; Year 1 / Oasis beet / Year 2 artichoke / cart Rare Seed / 1.6 broccoli are conditions.
- Cite wiki gold/day with the Crops-page assumptions. Do not import unread listicle season-totals as wiki gold/day.
- Last plant days only as derived arithmetic `28 - grow days`.
- Tool link may be empty or a sketch of grape trellis vs 3×3 pumpkin vs cranberry rows; do not invent planner gold math.
- Neighboring jobs: Year 1 gold this morning; greenhouse 10×12.
- Re-open Oasis, Traveling Cart / Rare Seed, Broccoli Seeds, Bundles, Fair if B needs those gates as more than the Fall-table labels already recorded.
