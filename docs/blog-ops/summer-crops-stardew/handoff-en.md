# PublicBlogHandoff (en) — title_passed, frozen

- type: `PublicBlogHandoff`
- status: **title_passed** (`freezePublicBlogHandoff`. E title review PASS, must-fix 0)
- role: Agent F-en. Title pass signed by E; see `E-en-title-review.md`
- lockVersion: `2026-09-13-en-summer-crops-lock-1`
- locale / country: `en` / `US`
- bodyHash: `91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80`
- lock file: `docs/blog-ops/summer-crops-stardew/locked/en-body.txt` (same bytes as JSON `body`)
- count: mechanical_units **3509** (en words), ≥2000
- D body: PASS; E body: PASS; E title: PASS; user review: not started (waits for the live site page)
- Public references from C appendix `PublicReference`, bound to this bodyHash
- Freeze did not change locked body, hash, Title, H1, Description, slug. Did not write `src/` or `public/`

JSON below is the handoff object. `body` is the locked reader markdown (H2/H3 and in-body links), NFC, UTF-8, LF.

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-13-en-summer-crops-lock-1",
  "locale": "en",
  "country": "US",
  "body": "There is no single best outdoor summer crop. [Starfruit](https://stardewvalleywiki.com/Starfruit) sits at the top of the wiki gold/day table only after you can reach [Oasis](https://stardewvalleywiki.com/Oasis) and pay [400g](https://stardewvalleywiki.com/Starfruit_Seeds) a seed; Year 1 at [Pierre’s](https://stardewvalleywiki.com/Pierre%27s_General_Store) is a tile choice among [blueberry](https://stardewvalleywiki.com/Blueberry), [melon](https://stardewvalleywiki.com/Melon), and [hops](https://stardewvalleywiki.com/Hops); Year 2 puts [Red Cabbage](https://stardewvalleywiki.com/Red_Cabbage) on that same table at about 17.78g/day. Rank by the shop you can open this morning, then by the [Crops](https://stardewvalleywiki.com/Crops) gold/day figure, then by how many tiles you can water and whether that soil is still planted when you wanted the next crop.\n\nSpring-only plants [wilt on Summer 1](https://stardewvalleywiki.com/Summer). The outdoor summer job is the next 28 calendar days on the farm. If last season’s occupancy method is still open in another tab, the [spring crop guide](/best-spring-crop-stardew) is the previous outdoor season on the same gold/day rules.\n\n### Best outdoor summer crop depends on year, the shop you can open, and the tiles you can water\n\nYear 1 Summer 1 is a Pierre morning. The [summer counter](https://stardewvalleywiki.com/Pierre%27s_General_Store) runs 9am–5pm; you can enter the shop until 9pm. [Starfruit seeds](https://stardewvalleywiki.com/Starfruit_Seeds) are not on that shelf and are not a Joja summer packet either. Pierre sells [Red Cabbage](https://stardewvalleywiki.com/Red_Cabbage) from year 2.\n\nOasis is a different door. Sandy’s shop in the [Calico Desert](https://stardewvalleywiki.com/The_Desert) is open 9am–11:50pm. [Starfruit Seeds](https://stardewvalleywiki.com/Starfruit_Seeds) cost **400g** there. The desert stays locked until the bus is repaired: complete the four [Vault](https://stardewvalleywiki.com/Bundles) gold bundles for 42,500g (2,500g + 5,000g + 10,000g + 25,000g), or pay Joja’s Bus Repair for 40,000g. A [bus ticket](https://stardewvalleywiki.com/Bus_Stop) is 500g, and Pam drives 10am–5pm. Year 1 starfruit is an access problem. Pierre did not forget the seed.\n\nThe watering-can rectangle is the Year 1 plant count. Buy one seed per tile you can water on the plant day and on the days after, then stop — the same wet-tile rule as in [how to earn money](/how-to-earn-money-stardew).\n\nWiki gold/day is a named comparison from the [Crops](https://stardewvalleywiki.com/Crops) page, not a promise and not a planner output. The formula is `((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`, with `Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`. The published figures assume no fertilizer, no crop quality, no Tiller, and no Agriculturist. The plant is watered on the plant day. Grow times exclude that plant day. An unwatered day does not kill the plant and does not count as growth. Extra fruit chances are omitted except potato, which is not a summer crop. The [Summer](https://stardewvalleywiki.com/Summer) blueberry cell already prices three berries as `50g (x3)`. Do not add blueberry’s extra 2%, tomato’s extra 5%, or hot pepper’s extra 3% on top of those gold/day cells.\n\nA season-total on one tile is a different metric. Starfruit’s wiki gold/day of about 26.92g is one 13-day cycle: (750g − 400g) / 13. Two finished cycles in summer are a different pile of gold. Do not treat that pile as the wiki gold/day cell, and do not mix the two into one “most profitable” name.\n\n### Rank the outdoor summer field on one gold/day table, with access on the same rows\n\nThe [Summer](https://stardewvalleywiki.com/Summer) crop tables and the matching crop pages supply the numbers. Rows are ordered by wiki gold/day so you can pick, not so the first row is always legal on your save.\n\n| Crop | Seed source and price | Grow / regrow | Wiki max harvests (no fertilizer, no Agriculturist) | Wiki gold/day (no fertilizer, no Tiller) | Access / occupancy |\n|---|---|---|---|---|---|\n| [Starfruit](https://stardewvalleywiki.com/Starfruit) | [Oasis](https://stardewvalleywiki.com/Starfruit_Seeds) 400g | 13 days | 2 | about 26.92g | Bus repaired and Oasis open. Derived last plant 15 for a Summer 28 harvest. |\n| [Blueberry](https://stardewvalleywiki.com/Blueberry) | Pierre 80g | 13 days, then every 4 | 4 | 20.8g | Year 1 Pierre. Three berries per pick already in the 20.8g cell. Planted Summer 1, watered daily, no Speed-Gro: picks on 14, 18, 22, and 26. |\n| [Red Cabbage](https://stardewvalleywiki.com/Red_Cabbage) | Pierre 100g, year 2+ | 9 days | 3 | about 17.78g | Not a Year 1 Pierre default. Year 1 only from the Traveling Cart or Skull Cavern. |\n| [Melon](https://stardewvalleywiki.com/Melon) | Pierre 80g | 12 days | 2 | about 14.17g | Year 1 Pierre. Giant-crop candidate. Derived last plant 16. A held 3-by-3 occupies nine tiles until you harvest or chop. |\n| [Hops](https://stardewvalleywiki.com/Hops) | Pierre 60g, trellis | 11 days, then every day | 17 | about 13.52g | Year 1 Pierre. You cannot walk through any living stage. Planted Summer 1: first pick on day 12, then daily through 28 (17 picks). |\n| [Summer Squash](https://stardewvalleywiki.com/Summer_Squash) | 0g in the gold/day formula | 6 days, then every 3 | 8 | about 13.33g | Seeds are [not sold for gold](https://stardewvalleywiki.com/Summer_Squash_Seeds) at Pierre, Joja, or the Traveling Cart. The 0g input is not a shop price. |\n| [Hot Pepper](https://stardewvalleywiki.com/Hot_Pepper) | Pierre 40g | 5 days, then every 3 | 8 | about 10.77g | Year 1 Pierre. |\n| [Tomato](https://stardewvalleywiki.com/Tomato) | Pierre 50g | 11 days, then every 4 | 5 | about 9.26g | Year 1 Pierre. |\n| [Radish](https://stardewvalleywiki.com/Radish) | Pierre 40g | 6 days | 4 | about 8.33g | Year 1 Pierre. Derived last plant 22. |\n| [Corn](https://stardewvalleywiki.com/Corn) | Pierre 150g | 14 days, then every 4 | 4 in summer, or 11 across summer and fall | about 1.92g summer only; about 7.41g across both seasons | Year 1 Pierre. A plant on Summer 28 continues on Fall 1 and keeps fertilizer under the tile. |\n| [Poppy](https://stardewvalleywiki.com/Poppy) | Pierre 100g | 7 days | 3 | about 5.71g | Year 1 Pierre. Derived last plant 21. |\n| [Summer Spangle](https://stardewvalleywiki.com/Summer) | Pierre 50g | 8 days | 3 | 5g | Year 1 Pierre. |\n| [Wheat](https://stardewvalleywiki.com/Wheat) | Pierre 10g | 4 days | 6 in summer, or 13 across summer and fall | 3.75g | Year 1 Pierre. Multi-season. Derived last plant 24 for a harvest still on Summer 28. |\n| [Sunflower](https://stardewvalleywiki.com/Sunflower) | Pierre 200g | 8 days | 3 in summer, or 6 across summer and fall | **−15g** | Year 1 Pierre. Multi-season. Negative because the seed is 200g and the flower sells for 80g. |\n| [Coffee Bean](https://stardewvalleywiki.com/Coffee_Bean) | Not Pierre’s summer counter | 10 days, then every 2 | source-dependent | wiki gold/day changes with the seed source | Traveling Cart special 2,500g (25% in fall and winter) is not the same packet as the cart’s 100g–1,000g range. Dust Sprites drop a bean at 1%. Spring plants continue into summer. |\n\nTable notes. Blueberry’s 20.8g uses three 50g berries per harvest: growing days are 13 + (4 − 1) × 4 = 25, and ((4 × 150g) − 80g) / 25 = 20.8g.\n\nRead the table as three questions.\n\n- Can you buy that seed on the morning you want to plant?\n- Can you water that tile on the plant day and on every day that still counts as growth?\n- Is the tile still occupied on the morning you wanted a second melon, a melon 3-by-3, or a hops harvest path?\n\nA crop that wins gold/day on a full season can still be the wrong occupant for a tile you already promised to something else.\n\nThe wiki does not name a “last plant day.” For a single-harvest crop that must ripen on Summer 28, the derived date is `28 − grow days`, excluding the plant day, with no Speed-Gro, and with the plant day already watered. Miss a watering night and move the date earlier by each missed night. Pierre sells Speed-Gro from Spring 15 of year 1 at 100g; the dates below ignore that bottle because the gold/day table ignores fertilizer.\n\n| Crop | Grow days | Derived last plant for a Summer 28 harvest |\n|---|---|---|\n| Wheat | 4 | 24 |\n| Radish | 6 | 22 |\n| Poppy | 7 | 21 |\n| Sunflower | 8 | 20 |\n| Red Cabbage | 9 | 19 |\n| Melon | 12 | 16 |\n| Starfruit | 13 | 15 |\n\nWheat and sunflower are multi-season, so day 24 and day 20 are last dates for a harvest that still lands on Summer 28, not a claim that the plant dies if you sow later. Melon, starfruit, poppy, radish, and red cabbage are summer crops on this table: a seed bought after the derived date finishes the season as an unfinished stage and [wilts on Fall 1](https://stardewvalleywiki.com/Summer) the same way spring-only crops wilt on Summer 1.\n\nBlueberry and hops do not get a four-harvest or seventeen-harvest “last plant” name here. Count them on the calendar with the same public rule. Blueberry first pick is plant day plus 13, then every 4 days through 28. Hops first pick is plant day plus 11, then every day through 28.\n\n*Summer 1–28 occupancy on one tile, planted on Summer 1, watered every day, with no Speed-Gro. Blueberry picks land on 14, 18, 22, and 26, so the tile is still planted on the mornings you might have wanted a second melon. Hops first pick is day 12, then daily through 28 (17 picks). Melon needs 12 growing days; the derived last plant for a Summer 28 harvest is 16. Starfruit needs 13 growing days; the derived last plant is 15. Last-plant dates are derived as 28 minus grow days, not a wiki field name. Read which mornings the tile is still occupied before you buy the next seed.*\n\n### Year 1 with no desert: blueberries, melons, and hops on different tiles\n\nWithout a repaired bus, drop Starfruit off the default shopping list. The highest wiki gold/day on the Pierre summer counter is blueberry at 20.8g. Melon at about 14.17g and hops at about 13.52g are lower on that same no-fertilizer, no-Tiller scale. They are still worth tiles, because they do not occupy soil the same way. The Year 1 outdoor choice is which tiles you give to which of those three, not a single first-place crop copied onto every hoe mark.\n\n#### Blueberries occupy the tile through the late-month picks\n\nPierre sells blueberry seeds for 80g. The plant takes 13 days, then produces every 4 days. Each harvest is three berries. Sell prices are 50g, 62g, 75g, and 100g by quality. Fertilizer quality applies to the first berry only. Wiki gold/day is 20.8g with no fertilizer and no Tiller, using the three-berry harvest already printed on the Summer table.\n\nPlant on Summer 1, water every day, use no Speed-Gro, and the picks are Summer 14, 18, 22, and 26. That is four harvests, which is the wiki maximum. The tile is not empty after the first pick. It is still a blueberry on Summer 16, when a late melon seed would still finish, and it is still a blueberry on Summer 26, two days before the season ends. If you wanted that tile for a second 12-day melon, the blueberry already spent it.\n\nOn a Year 1 farm that cannot open Oasis, 20.8g is the highest Pierre outdoor gold/day on the table. The crop also asks for less replanting than melon. That is occupancy and a published gold/day cell, not a separate “low maintenance” score. Extra berries at 2% per harvest stay outside the 20.8g figure; do not add them to beat melon on paper.\n\n#### Melons are a 12-day crop and the summer giant\n\nPierre sells melon seeds for 80g. Grow time is 12 days. Sell prices are 250g, 312g, 375g, and 500g by quality. Wiki gold/day is about 14.17g: (250g − 80g) / 12. Max harvests in summer are 2. Planted on Summer 1 and watered every day, a melon is ready on Summer 13. Harvest and replant the same day and the second head is ready on Summer 25. The derived last plant for a head that ripens on Summer 28 is Summer 16. A seed bought on Summer 17 does not finish before Fall 1.\n\nMelon is one of the five [giant crops](https://stardewvalleywiki.com/Crops). Giants need a 3-by-3 of the same crop. Each morning, every overlapping 3-by-3 grid has a 1% chance to combine if the top-left plant is fully grown and watered and all nine plants are the same type. A giant takes three axe hits and drops 15 to 21 regular-quality melons. It cannot form in the greenhouse, in garden pots, or on Ginger Island. It does not die at the season change, so a giant that pops on Summer 28 is still there on Fall 1. A regular melon still in the ground on Fall 1 wilts.\n\nThose nine tiles stay melon from the plant day until you harvest the heads or chop a giant. You cannot also run a second 12-day cycle on the same nine tiles while you keep them for more 1% mornings. A 3-by-4 of melon contains two overlapping 3-by-3 grids; a 4-by-4 contains four. Each grid still needs its own top-left plant mature and watered. Leaving the top-left dry overnight skips that grid’s roll; it does not kill the plants.\n\nIf a Quality Sprinkler sits in the center of the square, that center is a machine, not a melon, and the nine cells are not the same crop. Keep scarecrows off those nine cells for the same reason: the post is not a melon. Sprinkler reach and unlock tiers are the [sprinkler guide](/sprinkler-stardew). Year 1 usually waters a giant square with the can. The can has to reach the top-left every morning you still want the roll.\n\n#### Hops pay 17 picks and block walking\n\nPierre sells hops starter for 60g. The plant takes 11 days, then produces every day. You cannot walk through hops at any living stage. Wiki gold/day is about 13.52g, which is below blueberry’s 20.8g on the same table. Planted on Summer 1, the first pick is day 12, then every day through 28, which is 17 picks and matches the wiki maximum.\n\nHops in a keg become Pale Ale. The hops infobox lists artisan base 300g (420g with Artisan). That sell price is a different comparison. This table does not rank Pale Ale, does not time a keg, and does not move hops above blueberry because a barrel exists.\n\nLayout is the hops cost that gold/day does not show. Plant a single row, or a double row with a walking lane. Do not ring a melon 3-by-3 with hops, and do not plant hops across the axe path you will need if a giant forms. Dead trellis after the plant wilts is a later problem. While the hops are alive, the tile is a wall.\n\nYear 1, watering can, no desert:\n\n- Most wet tiles: blueberry, the highest Pierre gold/day on this table.\n- One melon 3-by-3 only if you will water all nine every day and accept that those tiles stay melon.\n- One hops row only where a walking tile already exists and you accept a trellis you cannot cross.\n\nDo not copy all three onto the same cells.\n\n### After the bus, and in Year 2: Starfruit and Red Cabbage join the same ranking\n\nRepairing the bus does not rewrite blueberry, melon, or hops occupancy. It adds a legal row at the top of the same gold/day table. Year 2 does the same for red cabbage on Pierre’s counter. Read those rows as access, then plant them on tiles the Year 1 trio is not already using.\n\n#### Starfruit at Oasis, 400g a seed\n\nStarfruit grows in 13 days. Sell prices are 750g, 937g, 1125g, and 1500g by quality. It is the second-highest crop sell price after Sweet Gem Berry. Wiki gold/day is about 26.92g, the highest outdoor summer cell on the table. Max harvests are 2. Planted on Summer 1, the first fruit is ready on Summer 14. Replant on 14 and the second is ready on Summer 27. The derived last plant for a fruit that ripens on Summer 28 is Summer 15. A seed bought on Summer 16 does not finish.\n\nSeeds cost 400g at Oasis. The Traveling Cart sells them for 600g–1,000g. Gunther gives one seed after 15 museum donations. A Seed Maker can produce more. Skull Cavern treasure chests can drop 5–20 seeds. Those routes exist; they do not put starfruit on Pierre’s Year 1 summer counter. If the bus is still broken, do not write starfruit onto the default shopping list because a cart might roll it.\n\nThe Luau sells one starfruit per year for 3,000g. That is a festival shop aside, not a field plan and not a gold/day cell.\n\nStarfruit still needs 13 watered days on every tile you plant. The 26.92g figure assumes that watering happened. A desert trip that buys more 400g packets than the can can cover is a gold spend, not a higher gold/day. Keep hops off the walking tiles you use to reach those plants, and keep starfruit out of a melon 3-by-3 you are holding for a giant.\n\n#### Red Cabbage is a Year 2 Pierre seed\n\nRed cabbage grows in 9 days. It sells for 260g. Wiki gold/day is about 17.78g, between blueberry’s 20.8g and melon’s about 14.17g on the same table. Pierre sells the seed for 100g from year 2. Max harvests are 3. Planted on Summer 1, a head is ready on Summer 10; replant on 10 for Summer 19; replant on 19 for Summer 28, which is also the derived last plant. The tile empties three times in the month if you harvest and sow again. A blueberry tile planted on Summer 1 does not empty until after the 26th pick. Dye Bundle identity is a bundle tag on the same crop, not a reason to clear blueberry rows.\n\nWhen the bus is open and you can water 13-day tiles, starfruit is first on this gold/day scale. In year 2 without a desert, red cabbage enters Pierre’s table and still sits below blueberry’s 20.8g. Neither crop cancels hops as a walking wall or melon as a nine-tile hold.\n\n### Last plant days, and crops that lose the outdoor rank\n\nUse the derived last-plant table before a late Pierre or Oasis trip. The shop can still sell the packet on a day that will not finish. The calendar does not owe you a harvest.\n\n[Sunflower](https://stardewvalleywiki.com/Sunflower) looks like a summer crop on Pierre’s counter at 200g. Wiki gold/day is −15g because the seed costs 200g and the flower sells for 80g. Harvest also returns 0–2 sunflower seeds at equal chance. That return does not turn the published gold/day cell positive. Plant sunflower if you want the flower, not if you are filling tiles from the top of the gold/day table.\n\n[Corn](https://stardewvalleywiki.com/Corn) is a 150g Pierre seed that takes 14 days, then produces every 4 days, and sells for 50g. Summer-only wiki gold/day is about 1.92g. Across summer and fall it is about 7.41g, still below radish’s 8.33g and far below blueberry. A plant placed on Summer 28 continues on Fall 1 and keeps fertilizer under the tile. That is a two-season occupant, not a summer gold/day winner. Do not buy corn to “win summer” on the 1.92g cell.\n\n[Summer squash](https://stardewvalleywiki.com/Summer_Squash) shows about 13.33g, next to hops at about 13.52g, because the formula seed price is 0g. The seeds are not sold for gold at Pierre, Joja, or the Traveling Cart. They come from seed spots, raccoon requests, the raccoon wife’s shop for 15 sap, golden fishing chests, a Seed Maker, and other 1.6 routes; most of those routes run only Spring 24–Summer 20, except the raccoon wife shop and the Seed Maker. Treat 13.33g as a formula result for a seed you already have, not as a Pierre field you can scale with gold.\n\n[Coffee Bean](https://stardewvalleywiki.com/Coffee_Bean) is not on Pierre’s summer counter. Dust Sprites drop it at 1%. The Traveling Cart’s 2,500g special appears 25% of the time in fall and winter; the cart’s 100g–1,000g range is a different listing that can appear in all seasons. Do not copy 2,500g onto a Year 1 summer default, and do not mix the two cart prices. Grow time is 10 days, then every 2 days, four beans per harvest, in spring and summer. A coffee plant that was already in the ground in spring does not wilt on Summer 1. It keeps the tile you may have wanted for blueberry, melon, hops, or starfruit.\n\n[Ancient Fruit](https://stardewvalleywiki.com/Ancient_Fruit) takes 28 days, then produces every 7 days, and sells for 550g. It grows in spring, summer, and fall. Planted on Summer 1, the first harvest is day 1 of the next season, not a summer shipping-box crop. [Ancient Seeds](https://stardewvalleywiki.com/Ancient_Seeds) are not sold at Pierre, Joja, or the cart. You craft them after donating the artifact, or you roll a 0.5% Seed Maker chance from other crops. They cannot go in a garden pot. They can go in a greenhouse. Year-round beds and that indoor 10-by-12 are the [greenhouse guide](/glasshouse-stardew-valley), not this outdoor table.\n\nWheat, radish, poppy, summer spangle, hot pepper, and tomato stay on the gold/day table so you can see they are legal Pierre seeds with lower cells than blueberry. Hot pepper at about 10.77g and tomato at about 9.26g look busy because they regrow; they still lose to blueberry’s 20.8g on the published scale. Radish turns tiles over every 6 days and still lands at about 8.33g. Wheat at 3.75g is a 10g seed and a scythe crop, not a summer rank winner. Poppy at about 5.71g is a 7-day flower; bee-house poppy honey sells for 380g against 100g for regular honey, which is a hive aside and does not move poppy above blueberry on the crop table.\n\n### Put hops, a melon 3-by-3, and blueberry rows on one bed without sharing walking tiles\n\nGold/day does not place the plants. On one outdoor bed you still have to walk, water, and, if a giant forms, swing an axe. Hops block that walk. A melon 3-by-3 needs nine matching plants and a reachable top-left. Blueberry wants a rectangle you can harvest on 14, 18, 22, and 26 without crossing trellis.\n\n*Occupancy on one bed, not a 1% giant already rolled. North (or one side): a hops row plus at least one walking tile. One melon 3-by-3 with the top-left cell marked, all nine melon, no sprinkler or scarecrow inside the square. A blueberry rectangle that does not overlap those nine tiles and does not sit behind a hops wall. A hops ring around the melon is the failed layout: you cannot walk through living hops to water the top-left or to chop a giant. This grid uses the wiki trellis and giant rules.*\n\n1. Hoe a 3-by-3, not a line of nine.\n2. Plant melon in all nine cells. Mixed crops in that block cannot combine.\n3. Keep hops in a row with a walking lane. Do not ring the nine.\n4. Put blueberries in a rectangle you can reach without crossing that trellis.\n5. Keep sprinklers and scarecrows off the melon nine, and water the top-left, using the same giant-square rules as the melon section above.\n\nIf you want that same 3-by-3 and hops row on the farm map you actually play, open the [planner](/#planner) and switch the season to Summer. The tool can place crops on the eight farm maps plus Ginger Island and can show sprinkler and scarecrow coverage; projects stay in the browser. It does not compute gold/day, last-plant dates, or giant 1% rolls.\n\nBefore you pay Pierre or Sandy, walk the tiles you can water tomorrow. For each wet tile, name the crop, the shop that can sell the seed this morning, and the next date that tile is empty or blocked. If the shop is Oasis and the bus is still down, skip starfruit. If the seed is red cabbage and the year is still 1, skip the Pierre row. If the tile is already promised to a blueberry pick on the 26th, a melon 3-by-3, or a hops wall, buy the seed that matches that promise, not the first row of the table.\n",
  "bodyHash": "91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 23303,
  "seo": {
    "title": "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
    "h1": "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
    "description": "Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day.",
    "slug": "summer-crops-stardew",
    "faq": null,
    "schema": null,
    "og": {
      "title": "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
      "description": "Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day.",
      "openGraphType": "article",
      "image": "pending_media"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-summer",
      "label": "Stardew Valley Wiki: Summer",
      "url": "https://stardewvalleywiki.com/Summer",
      "appliesTo": [
        {
          "quote": "Spring-only plants [wilt on Summer 1](https://stardewvalleywiki.com/Summer).",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-summer-table",
      "label": "Stardew Valley Wiki: Summer (crop tables)",
      "url": "https://stardewvalleywiki.com/Summer",
      "appliesTo": [
        {
          "quote": "The [Summer](https://stardewvalleywiki.com/Summer) crop tables and the matching crop pages supply the numbers.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-summer-wilt-fall",
      "label": "Stardew Valley Wiki: Summer (season-change wilt)",
      "url": "https://stardewvalleywiki.com/Summer",
      "appliesTo": [
        {
          "quote": "[wilts on Fall 1](https://stardewvalleywiki.com/Summer) the same way spring-only crops wilt on Summer 1.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops-gold",
      "label": "Stardew Valley Wiki: Crops (gold per day)",
      "url": "https://stardewvalleywiki.com/Crops",
      "appliesTo": [
        {
          "quote": "The formula is `((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`, with `Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops-assumptions",
      "label": "Stardew Valley Wiki: Crops (gold/day assumptions)",
      "url": "https://stardewvalleywiki.com/Crops",
      "appliesTo": [
        {
          "quote": "The published figures assume no fertilizer, no crop quality, no Tiller, and no Agriculturist.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops-giant",
      "label": "Stardew Valley Wiki: Crops (giant crops)",
      "url": "https://stardewvalleywiki.com/Crops",
      "appliesTo": [
        {
          "quote": "Each morning, every overlapping 3-by-3 grid has a 1% chance to combine if the top-left plant is fully grown and watered and all nine plants are the same type.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre-summer",
      "label": "Stardew Valley Wiki: Pierre's General Store (Summer Stock)",
      "url": "https://stardewvalleywiki.com/Pierre%27s_General_Store",
      "appliesTo": [
        {
          "quote": "Year 1 Summer 1 is a Pierre morning.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre-hours",
      "label": "Stardew Valley Wiki: Pierre's General Store (hours)",
      "url": "https://stardewvalleywiki.com/Pierre%27s_General_Store",
      "appliesTo": [
        {
          "quote": "The [summer counter](https://stardewvalleywiki.com/Pierre%27s_General_Store) runs 9am–5pm; you can enter the shop until 9pm.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre-speedgro",
      "label": "Stardew Valley Wiki: Pierre's General Store (Speed-Gro)",
      "url": "https://stardewvalleywiki.com/Pierre%27s_General_Store",
      "appliesTo": [
        {
          "quote": "Pierre sells Speed-Gro from Spring 15 of year 1 at 100g",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-starfruit",
      "label": "Stardew Valley Wiki: Starfruit",
      "url": "https://stardewvalleywiki.com/Starfruit",
      "appliesTo": [
        {
          "quote": "Sell prices are 750g, 937g, 1125g, and 1500g by quality.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-starfruit-goldday",
      "label": "Stardew Valley Wiki: Starfruit / Summer gold/day",
      "url": "https://stardewvalleywiki.com/Starfruit",
      "appliesTo": [
        {
          "quote": "Starfruit’s wiki gold/day of about 26.92g is one 13-day cycle: (750g − 400g) / 13.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-starfruit-luau",
      "label": "Stardew Valley Wiki: Starfruit (Luau)",
      "url": "https://stardewvalleywiki.com/Starfruit",
      "appliesTo": [
        {
          "quote": "The Luau sells one starfruit per year for 3,000g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-starfruit-seeds",
      "label": "Stardew Valley Wiki: Starfruit Seeds",
      "url": "https://stardewvalleywiki.com/Starfruit_Seeds",
      "appliesTo": [
        {
          "quote": "[Starfruit Seeds](https://stardewvalleywiki.com/Starfruit_Seeds) cost **400g** there.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-starfruit-seed-routes",
      "label": "Stardew Valley Wiki: Starfruit Seeds (other sources)",
      "url": "https://stardewvalleywiki.com/Starfruit_Seeds",
      "appliesTo": [
        {
          "quote": "The Traveling Cart sells them for 600g–1,000g. Gunther gives one seed after 15 museum donations. A Seed Maker can produce more. Skull Cavern treasure chests can drop 5–20 seeds.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-oasis-hours",
      "label": "Stardew Valley Wiki: Oasis",
      "url": "https://stardewvalleywiki.com/Oasis",
      "appliesTo": [
        {
          "quote": "Sandy’s shop in the [Calico Desert](https://stardewvalleywiki.com/The_Desert) is open 9am–11:50pm.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-desert-lock",
      "label": "Stardew Valley Wiki: The Desert",
      "url": "https://stardewvalleywiki.com/The_Desert",
      "appliesTo": [
        {
          "quote": "The desert stays locked until the bus is repaired",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-bus-ticket",
      "label": "Stardew Valley Wiki: Bus Stop",
      "url": "https://stardewvalleywiki.com/Bus_Stop",
      "appliesTo": [
        {
          "quote": "A [bus ticket](https://stardewvalleywiki.com/Bus_Stop) is 500g, and Pam drives 10am–5pm.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-vault",
      "label": "Stardew Valley Wiki: Bundles (Vault)",
      "url": "https://stardewvalleywiki.com/Bundles",
      "appliesTo": [
        {
          "quote": "complete the four [Vault](https://stardewvalleywiki.com/Bundles) gold bundles for 42,500g (2,500g + 5,000g + 10,000g + 25,000g), or pay Joja’s Bus Repair for 40,000g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-blueberry",
      "label": "Stardew Valley Wiki: Blueberry",
      "url": "https://stardewvalleywiki.com/Blueberry",
      "appliesTo": [
        {
          "quote": "Sell prices are 50g, 62g, 75g, and 100g by quality. Fertilizer quality applies to the first berry only.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-blueberry-calendar",
      "label": "Stardew Valley Wiki: Blueberry / Summer max harvests",
      "url": "https://stardewvalleywiki.com/Blueberry",
      "appliesTo": [
        {
          "quote": "Plant on Summer 1, water every day, use no Speed-Gro, and the picks are Summer 14, 18, 22, and 26.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-blueberry-goldday",
      "label": "Stardew Valley Wiki: Summer (blueberry gold/day)",
      "url": "https://stardewvalleywiki.com/Summer",
      "appliesTo": [
        {
          "quote": "Blueberry’s 20.8g uses three 50g berries per harvest: growing days are 13 + (4 − 1) × 4 = 25, and ((4 × 150g) − 80g) / 25 = 20.8g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-melon",
      "label": "Stardew Valley Wiki: Melon",
      "url": "https://stardewvalleywiki.com/Melon",
      "appliesTo": [
        {
          "quote": "Sell prices are 250g, 312g, 375g, and 500g by quality.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-melon-goldday",
      "label": "Stardew Valley Wiki: Melon / Summer gold/day",
      "url": "https://stardewvalleywiki.com/Melon",
      "appliesTo": [
        {
          "quote": "Wiki gold/day is about 14.17g: (250g − 80g) / 12.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-melon-giant-drop",
      "label": "Stardew Valley Wiki: Crops (giant drop)",
      "url": "https://stardewvalleywiki.com/Crops",
      "appliesTo": [
        {
          "quote": "A giant takes three axe hits and drops 15 to 21 regular-quality melons. It cannot form in the greenhouse, in garden pots, or on Ginger Island.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-hops",
      "label": "Stardew Valley Wiki: Hops",
      "url": "https://stardewvalleywiki.com/Hops",
      "appliesTo": [
        {
          "quote": "You cannot walk through hops at any living stage.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-hops-goldday",
      "label": "Stardew Valley Wiki: Hops / Summer gold/day",
      "url": "https://stardewvalleywiki.com/Hops",
      "appliesTo": [
        {
          "quote": "Wiki gold/day is about 13.52g, which is below blueberry’s 20.8g on the same table.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-hops-calendar",
      "label": "Stardew Valley Wiki: Hops (17 harvests)",
      "url": "https://stardewvalleywiki.com/Hops",
      "appliesTo": [
        {
          "quote": "Planted on Summer 1, the first pick is day 12, then every day through 28, which is 17 picks and matches the wiki maximum.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-hops-pale-ale",
      "label": "Stardew Valley Wiki: Hops (Pale Ale artisan price)",
      "url": "https://stardewvalleywiki.com/Hops",
      "appliesTo": [
        {
          "quote": "The hops infobox lists artisan base 300g (420g with Artisan).",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-red-cabbage",
      "label": "Stardew Valley Wiki: Red Cabbage",
      "url": "https://stardewvalleywiki.com/Red_Cabbage",
      "appliesTo": [
        {
          "quote": "Pierre sells the seed for 100g from year 2.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-red-cabbage-goldday",
      "label": "Stardew Valley Wiki: Red Cabbage / Summer gold/day",
      "url": "https://stardewvalleywiki.com/Red_Cabbage",
      "appliesTo": [
        {
          "quote": "Wiki gold/day is about 17.78g, between blueberry’s 20.8g and melon’s about 14.17g on the same table.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-red-cabbage-year1",
      "label": "Stardew Valley Wiki: Red Cabbage (Year 1 bypass)",
      "url": "https://stardewvalleywiki.com/Red_Cabbage",
      "appliesTo": [
        {
          "quote": "Not a Year 1 Pierre default. Year 1 only from the Traveling Cart or Skull Cavern.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-corn",
      "label": "Stardew Valley Wiki: Corn",
      "url": "https://stardewvalleywiki.com/Corn",
      "appliesTo": [
        {
          "quote": "A plant placed on Summer 28 continues on Fall 1 and keeps fertilizer under the tile.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-corn-goldday",
      "label": "Stardew Valley Wiki: Corn / Summer gold/day",
      "url": "https://stardewvalleywiki.com/Corn",
      "appliesTo": [
        {
          "quote": "Summer-only wiki gold/day is about 1.92g. Across summer and fall it is about 7.41g",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-tomato",
      "label": "Stardew Valley Wiki: Tomato",
      "url": "https://stardewvalleywiki.com/Tomato",
      "appliesTo": [
        {
          "quote": "tomato’s extra 5%",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-hot-pepper",
      "label": "Stardew Valley Wiki: Hot Pepper",
      "url": "https://stardewvalleywiki.com/Hot_Pepper",
      "appliesTo": [
        {
          "quote": "hot pepper’s extra 3%",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-radish",
      "label": "Stardew Valley Wiki: Radish",
      "url": "https://stardewvalleywiki.com/Radish",
      "appliesTo": [
        {
          "quote": "Radish turns tiles over every 6 days and still lands at about 8.33g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-wheat",
      "label": "Stardew Valley Wiki: Wheat",
      "url": "https://stardewvalleywiki.com/Wheat",
      "appliesTo": [
        {
          "quote": "Wheat at 3.75g is a 10g seed and a scythe crop, not a summer rank winner.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-poppy",
      "label": "Stardew Valley Wiki: Poppy",
      "url": "https://stardewvalleywiki.com/Poppy",
      "appliesTo": [
        {
          "quote": "bee-house poppy honey sells for 380g against 100g for regular honey",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-sunflower",
      "label": "Stardew Valley Wiki: Sunflower",
      "url": "https://stardewvalleywiki.com/Sunflower",
      "appliesTo": [
        {
          "quote": "Wiki gold/day is −15g because the seed costs 200g and the flower sells for 80g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-squash",
      "label": "Stardew Valley Wiki: Summer Squash",
      "url": "https://stardewvalleywiki.com/Summer_Squash",
      "appliesTo": [
        {
          "quote": "[Summer squash](https://stardewvalleywiki.com/Summer_Squash) shows about 13.33g, next to hops at about 13.52g, because the formula seed price is 0g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-squash-seeds",
      "label": "Stardew Valley Wiki: Summer Squash Seeds",
      "url": "https://stardewvalleywiki.com/Summer_Squash_Seeds",
      "appliesTo": [
        {
          "quote": "The seeds are not sold for gold at Pierre, Joja, or the Traveling Cart.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-coffee",
      "label": "Stardew Valley Wiki: Coffee Bean",
      "url": "https://stardewvalleywiki.com/Coffee_Bean",
      "appliesTo": [
        {
          "quote": "The Traveling Cart’s 2,500g special appears 25% of the time in fall and winter; the cart’s 100g–1,000g range is a different listing that can appear in all seasons.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-coffee-dust",
      "label": "Stardew Valley Wiki: Coffee Bean (Dust Sprite)",
      "url": "https://stardewvalleywiki.com/Coffee_Bean",
      "appliesTo": [
        {
          "quote": "Dust Sprites drop it at 1%.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-ancient-fruit",
      "label": "Stardew Valley Wiki: Ancient Fruit",
      "url": "https://stardewvalleywiki.com/Ancient_Fruit",
      "appliesTo": [
        {
          "quote": "Planted on Summer 1, the first harvest is day 1 of the next season, not a summer shipping-box crop.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-ancient-seeds",
      "label": "Stardew Valley Wiki: Ancient Seeds",
      "url": "https://stardewvalleywiki.com/Ancient_Seeds",
      "appliesTo": [
        {
          "quote": "[Ancient Seeds](https://stardewvalleywiki.com/Ancient_Seeds) are not sold at Pierre, Joja, or the cart.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "site-planner",
      "label": "Stardew Valley Planner (homepage)",
      "url": "https://stardewvalleyplanner.art/",
      "appliesTo": [
        {
          "quote": "The tool can place crops on the eight farm maps plus Ginger Island and can show sprinkler and scarecrow coverage; projects stay in the browser.",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "site-planner-limits",
      "label": "Stardew Valley Planner (does not compute gold/day)",
      "url": "https://stardewvalleyplanner.art/",
      "appliesTo": [
        {
          "quote": "It does not compute gold/day, last-plant dates, or giant 1% rolls.",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "summer-crops-stardew",
      "enPath": "/summer-crops-stardew",
      "zhPath": "/zh/summer-crops-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "doNotOccupy": [
        "best-spring-crop-stardew"
      ],
      "matchesZhSlug": true
    },
    "registry": {
      "titleEqualsH1": true,
      "author": "Stardew Valley Planner Team",
      "topic": "Stardew Valley Guides",
      "featured": true,
      "readTimeMinutes": 16,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "headingLevelMap": {
        "lockedAtx###": "h2",
        "lockedAtx####": "h3",
        "note": "C nested working H2/H3 under an editorial H2 that is not in this lock. Do not render an H1 in the article module."
      }
    },
    "sources": {
      "heading": "Sources",
      "checkedLabel": "Checked 2026-09-13 against Stardew Valley Wiki Summer, Crops, and the crop pages listed below. Last-plant dates are derived as 28 minus grow days for a harvest on Summer 28, excluding the plant day, with no Speed-Gro and with watering on the plant day. Wiki gold/day figures are the Crops page values with no fertilizer and no Tiller. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls.",
      "itemOrder": [
        "wiki-summer",
        "wiki-summer-table",
        "wiki-summer-wilt-fall",
        "wiki-crops-gold",
        "wiki-crops-assumptions",
        "wiki-crops-giant",
        "wiki-pierre-summer",
        "wiki-pierre-hours",
        "wiki-pierre-speedgro",
        "wiki-starfruit",
        "wiki-starfruit-goldday",
        "wiki-starfruit-luau",
        "wiki-starfruit-seeds",
        "wiki-starfruit-seed-routes",
        "wiki-oasis-hours",
        "wiki-desert-lock",
        "wiki-bus-ticket",
        "wiki-vault",
        "wiki-blueberry",
        "wiki-blueberry-calendar",
        "wiki-blueberry-goldday",
        "wiki-melon",
        "wiki-melon-goldday",
        "wiki-melon-giant-drop",
        "wiki-hops",
        "wiki-hops-goldday",
        "wiki-hops-calendar",
        "wiki-hops-pale-ale",
        "wiki-red-cabbage",
        "wiki-red-cabbage-goldday",
        "wiki-red-cabbage-year1",
        "wiki-corn",
        "wiki-corn-goldday",
        "wiki-tomato",
        "wiki-hot-pepper",
        "wiki-radish",
        "wiki-wheat",
        "wiki-poppy",
        "wiki-sunflower",
        "wiki-squash",
        "wiki-squash-seeds",
        "wiki-coffee",
        "wiki-coffee-dust",
        "wiki-ancient-fruit",
        "wiki-ancient-seeds",
        "site-planner",
        "site-planner-limits"
      ]
    },
    "faq": null,
    "lockedAnglePhrases": [
      "There is no single best outdoor summer crop",
      "The Luau sells one starfruit per year for 3,000g",
      "It does not compute gold/day, last-plant dates, or giant 1% rolls"
    ],
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/best-spring-crop-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/how-to-earn-money-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/glasshouse-stardew-valley",
          "className": "blog-planner-link"
        },
        {
          "href": "/sprinkler-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/#planner",
          "className": "blog-planner-link"
        }
      ],
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/summer-crops-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures",
      "altStatus": "pending_media",
      "altDirection": "Describe the actual cover: an outdoor summer field with readable blueberry rows, a melon block, and hops trellis. Not a greenhouse. Not a Community Center board. Not a fake screenshot. Do not put gold/day, last-plant dates, or 3-by-3 numbers on the cover. trimmed length ≥ 8."
    },
    "figures": [
      {
        "id": "figure-1-summer-occupancy-calendar",
        "assemblyToken": "FIGURE1_CONTROLLED_DIAGRAM",
        "workingFile": "public/blog/illustrations/summer-crop-occupancy-calendar.webp",
        "src": "/blog/illustrations/summer-crop-occupancy-calendar.webp",
        "placement": "After the derived last-plant table in working H2-2 (### Rank the outdoor summer field…). Lock has the italic caption, no img src.",
        "type": "Controlled Summer 1–28 calendar schematic. Not a screenshot. Not a generated fake game still.",
        "caption": "Summer 1–28 occupancy on one tile, planted on Summer 1, watered every day, with no Speed-Gro. Blueberry picks land on 14, 18, 22, and 26, so the tile is still planted on the mornings you might have wanted a second melon. Hops first pick is day 12, then daily through 28 (17 picks). Melon needs 12 growing days; the derived last plant for a Summer 28 harvest is 16. Starfruit needs 13 growing days; the derived last plant is 15. Last-plant dates are derived as 28 minus grow days, not a wiki field name. Read which mornings the tile is still occupied before you buy the next seed.",
        "altStatus": "pending_media",
        "altDirection": "Describe the calendar schematic: Summer 1–28 occupancy for blueberry picks 14/18/22/26, hops from day 12 through 28, melon last-plant 16, starfruit last-plant 15. Not a screenshot.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-2-hops-melon-blueberry-bed",
        "assemblyToken": "FIGURE2_CONTROLLED_GRID",
        "workingFile": "public/blog/illustrations/summer-hops-melon-blueberry-bed.webp",
        "src": "/blog/illustrations/summer-hops-melon-blueberry-bed.webp",
        "placement": "Working H2-6 (### Put hops, a melon 3-by-3, and blueberry rows…). Lock has the italic caption, no img src.",
        "type": "Controlled countable tile grid. Not a screenshot. Not an unverified planner capture.",
        "compositionNote": "North or one side: hops row plus at least one walking tile. One melon 3-by-3 with the top-left cell marked, all nine melon, no sprinkler or scarecrow inside the square. A blueberry rectangle that does not overlap those nine tiles and does not sit behind a hops wall. Show that a hops ring around the melon is the failed layout.",
        "caption": "Occupancy on one bed, not a 1% giant already rolled. North (or one side): a hops row plus at least one walking tile. One melon 3-by-3 with the top-left cell marked, all nine melon, no sprinkler or scarecrow inside the square. A blueberry rectangle that does not overlap those nine tiles and does not sit behind a hops wall. A hops ring around the melon is the failed layout: you cannot walk through living hops to water the top-left or to chop a giant. This grid uses the wiki trellis and giant rules.",
        "altStatus": "pending_media",
        "altDirection": "Describe the bed grid: hops row with a walk tile, melon 3-by-3 with marked top-left, blueberry rectangle not behind hops. Not a 1% giant already rolled.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      }
    ],
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80",
    "length": {
      "locale": "en",
      "mechanical_units": 3509,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "userReview": "not_started",
    "frozen": true,
    "status": "title_passed",
    "freezePublicBlogHandoff": true,
    "eReportedReaderBodySha256IncludedSeparator": "a7dd64c9b8cd19ac5f895e3646249c8d58a2333bb84eeb4da926dd54f414776c",
    "cEnDraftFullFileSha256": "d8b00c89ae18b1b291162ea73a6a80ec2cfbd4bae5e04883bd0c0b9504e3c2a9"
  }
}
```
