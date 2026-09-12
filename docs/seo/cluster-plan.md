# Cluster plan: Spring crop ranking (V7, one intent)

Seed: `best spring crop stardew` / `星露谷 春季作物`  
Date: 2026-09-12  
Rule: **one primary search intent**. This file is article-boundary clustering, not a 12-URL hub to write now.

Do not write the article from this file.

## Hub query

| Locale | Hub | Why |
|--------|-----|-----|
| EN | **best spring crops stardew valley** | Broadest ranking phrase. PAA already asks “most profitable” and Year 1/2. Related searches: besides strawberry, rhubarb, tier list. |
| ZH | **星露谷 春季作物** | Merge `春天种什么` and `春天最赚钱`. DDG overlap between 春季作物 and 春天种什么 is **7/10** (same post). |

**Primary intent:** rank *outdoor Spring crops* by gold. Year 1 vs later is a condition of that ranking, not a second article.

**Template:** `best-of` (commercial rank) with a full Spring table so the informational list query does not leak to wiki-only pages.

**Word count target:** 2,500–4,000 (plan: ~3,200). Pillar range, because this URL absorbs the ranking variants. Do not also ship 1,200-word Year 1 / strawberry spokes.

**Suggested slug:** `/best-spring-crops-stardew` and `/zh/best-spring-crops-stardew` (not created).

## What belongs in THIS article

These are **required sub-questions**, not extra posts.

| Sub-query | Role | Why it stays here |
|-----------|------|-------------------|
| Year 1 Spring / 第一年春天种什么 | Full section | Hub related searches + PAA. Google URL overlap with hub is only 2; DDG publisher overlap is 6. Splitting Year 1 cannibalizes the hub. |
| Most profitable Spring crop | Same H1 | Synonym of “best”. Identical PAA. |
| Spring crop list / gold per day | Table | Unranked `stardew valley spring crops` still has “best/most profitable” PAA. Wiki Spring/Crops rank for the list; the article needs the table. |
| Besides strawberry | Section | Google overlap 4–5 with hub ranking queries. |
| Egg Festival strawberries | Short section | Default “best” crop. Answer: planted on Spring 13 → 2 harvests. Google strawberry SERP is a *different* URL set (wiki item pages). Do not clone the strawberry wiki. |
| Potato vs cauliflower | Short compare | Ranking tie-break: extra potato chance vs cauliflower gold/day + giant crop. |
| Rhubarb, garlic Y2, coffee bean, 1.6 carrot, rice, flowers | Table rows + unlock gates | Item SERPs are wiki. One row each, not item pages. |
| Green bean trellis | One paragraph | So the ranking does not send players into a blocked plot. Not a layout guide. |

**In-article gold/day must use wiki numbers** (seed price, days, harvests). Do not invent profit.

Spring crops that belong in the table (wiki Spring): Blue Jazz, Carrot, Cauliflower, Coffee Bean, Garlic, Green Bean, Kale, Parsnip, Potato, Rhubarb, Strawberry, Tulip, Unmilled Rice.

## What must NOT be expanded here

| Query | Overlap with hub | Why leave it | Where it goes |
|-------|------------------|--------------|---------------|
| Greenhouse crops / layout / 星露谷 温室 | 0 (Google) | Different job: year-round indoor 10×12, Ancient Fruit / Starfruit. DDG is wiki Greenhouse + TheGamer greenhouse crops. | Existing [glasshouse-stardew-valley](https://stardewvalleyplanner.art/glasshouse-stardew-valley) |
| Sprinkler layout / 星露谷 洒水器 | 0 | Coverage grids, 4/8/24 tiles. | Existing [sprinkler-stardew](https://stardewvalleyplanner.art/sprinkler-stardew) |
| Best summer crops / 夏季作物 | 1–2 | Parallel seasonal listicles on *summer* URLs. Hub related search is a next-season query, not the same SERP. | Future summer ranking post |
| Best fall crops | 0–1 | Same pattern, fall URLs. | Future fall ranking post |
| Stardew Valley best crops (all seasons) | mixed | Mega-guide would compete with this H1 and with summer/fall. | Do not write |
| Keg vs jar / artisan / 小桶 | 0 | Wiki Keg/Jar + calculators. Machine math, not seed choice. | Future artisan post (not on site) |
| Community Center Spring Crops Bundle | 0 | Wiki Bundles / pantry checklists. Donate four crops, not gold/day. | Future bundles post (not on site) |
| Ancient Fruit | 0 | Greenhouse / late-game. Cannot finish as Year 1 outdoor Spring. | Greenhouse page |
| Strawberry item page | 0 | Wiki Strawberry + ScreenRant seed article. | Do not write; keep festival timing in this post |

Allowed mention, then stop:

- Greenhouse: “season does not apply indoors” + link.
- Sprinkler: “dry tile at 6am is a watering problem” + link.
- Bundle: “Pantry Spring Crops Bundle is Parsnip, Green Bean, Cauliflower, Potato; keep one of each” + no bundle walkthrough.
- Artisan: “jelly/wine is a later multiplier” + no keg tables.
- Summer: “Spring plants die on Summer 1 except coffee/ancient” + no blueberry ranking.

## Internal links to existing stardewvalleyplanner.art pages

Use these. Do not invent crop pages that are not in the sitemap.

| From this article | To | Type | Anchor (EN / ZH) |
|-------------------|----|------|------------------|
| Body | `/` and `/zh` | Mandatory | sketch the Spring plot on the planner / 用农场规划器先画春季田 |
| Body | `/sprinkler-stardew` | Mandatory | sprinkler coverage (4, 8, or 24 tiles) / 洒水器覆盖格数 |
| Body | `/glasshouse-stardew-valley` | Mandatory | Greenhouse 10×12 bed (any season) / 温室 10×12 耕地 |
| Egg Festival paragraph | `/stardew-valley-town-map` | Optional | Pelican Town route to Pierre and the Egg Festival / 去皮埃尔和复活节的小镇路线 |

Do **not** force:

- `/carpenter-stardew` (Robin/buildings are not in this SERP)
- `/stardew-valley-trees`, `/oak-tree-stardew`, `/maple-tree-stardew`
- `/stardew-valley-npc`, SVE marriage, location lore

After publish, add one line **back** from:

- `/sprinkler-stardew` → “which Spring crop is worth watering”
- `/glasshouse-stardew-valley` → “outdoor Spring ranking is a different job”

Greenhouse already links to sprinkler. Sprinkler does not currently rank crops.

## SERP overlap (how grouping was decided)

Thresholds: 7–10 same post, 4–6 same cluster, 2–3 interlink, 0–1 separate.

Google US organic (before captcha). Exact-URL counts:

| Pair | Score | Action |
|------|-------|--------|
| best spring crop ↔ best spring crops | 8 (near-dup) | Same post |
| best spring crops ↔ stardew valley spring crops | 5 | Same post under V7 (list is the table inside the ranker) |
| best spring crops ↔ besides strawberry | 4–5 | Same post |
| best spring crop ↔ most profitable | 3 + identical PAA | Same post (synonym) |
| hub ↔ Year 1 (Google) | 2 | Interlink by URL, **same post by V7** (PAA + DDG publisher overlap 6) |
| hub ↔ strawberry year 1 | 0 | Different SERP; still a required *brief* section |
| hub ↔ summer | 2 | Interlink / other article |
| hub ↔ greenhouse | 0 | Separate; existing page |
| hub ↔ sprinkler | 0 | Separate; existing page |
| hub ↔ keg vs jar | 0 | Separate |
| 春季作物 ↔ 春天种什么 (DDG) | 7 | Same post |
| 春季作物 ↔ 夏季作物 (DDG) | 1 | Separate |
| 春季作物 ↔ 温室 (DDG) | 0–1 | Separate |

Google currently puts Reddit/Steam/forums high on “best” queries. DuckDuckGo shows the publisher listicles (GameRant, Carl’s Guides, stardewvalleyids, stardewpricedb). Architecture follows **intent + publisher overlap**, not “forums are a different article.”

Removed as navigational: `best spring crop stardew reddit`, `stardew valley wiki spring`.

## Site IA around this article (not this article)

If the site later adds seasonal ranking posts, they are **other URLs**:

1. Summer ranking — planned  
2. Fall ranking — planned  
3. Greenhouse layout — already written  
4. Sprinkler placement — already written  
5. Keg vs jar — not on site  
6. Bundles — not on site  

Those are exclude/interlink. They are not H2s of the Spring ranking page.

## Cannibalization

Safe if V7 is kept:

- One primary keyword per URL: `best spring crops stardew valley` / `星露谷 春季作物`
- Do not also publish Year 1 Spring, “besides strawberry,” or all-season best-crops
- Do not publish a strawberry item post that retells Egg Festival harvest math

Unsafe if ignored: Year 1 post + this post share PAA.

## Validation

- [x] No two planned posts share this primary keyword  
- [x] Template matches commercial-rank SERP (`best-of`)  
- [x] Word count in pillar spec  
- [x] Greenhouse, sprinkler, summer, artisan, bundles stay off this URL  
- [ ] After publish: inbound from sprinkler + greenhouse so this URL is not an orphan  
- Volume not collected (no DataForSEO)

Machine-readable matrix and URL sets: `docs/seo/cluster-plan.json`.
