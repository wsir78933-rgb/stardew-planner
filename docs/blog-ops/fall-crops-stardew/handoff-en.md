# PublicBlogHandoff (en) — title_passed, frozen

- type: `PublicBlogHandoff`
- status: **title_passed** (`freezePublicBlogHandoff`. E title review PASS, must-fix 0)
- role: Agent F-en. Title pass signed by E; see `E-en-title-review.md`
- lockVersion: `2026-09-14-en-fall-crops-lock-1`
- locale / country: `en` / `US`
- keyword: `stardew fall crops`
- bodyHash: `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a`
- lock file: `docs/blog-ops/fall-crops-stardew/locked/en-body.txt` (same bytes as JSON `body`)
- count: mechanical_units **4213** (en words, FAQ + Sources headings excluded), ≥2000
- D body: PASS; E body: PASS; E title: PASS; user review: not started (waits for the live site page)
- Public references from C appendix `PublicReference`, bound to this bodyHash
- FAQ + Sources stay in the locked reader body. `seo.faq` is null; G reads FAQ from `## FAQ`. JSON-LD is Article, not FAQPage
- Freeze did not change locked body, hash, Title, H1, Description, slug. Did not write `src/` or `public/`

JSON below is the handoff object. `body` is the locked reader markdown (H2/H3, FAQ, Sources, and in-body links), NFC, UTF-8, LF.

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-14-en-fall-crops-lock-1",
  "locale": "en",
  "country": "US",
  "keyword": "stardew fall crops",
  "body": "There is no single best outdoor fall crop. Year 1 at [Pierre’s](https://stardewvalleywiki.com/Pierre%27s_General_Store) is a tile choice among [cranberries](https://stardewvalleywiki.com/Cranberries), [pumpkins](https://stardewvalleywiki.com/Pumpkin), and [grapes](https://stardewvalleywiki.com/Grape); Year 2 [artichoke](https://stardewvalleywiki.com/Artichoke), Oasis [beet](https://stardewvalleywiki.com/Beet), and a Traveling Cart Rare Seed are conditions on that same gold/day table. Rank by the shop you can open this morning, then by the [Crops](https://stardewvalleywiki.com/Crops) gold/day figure, then by whether that soil is still planted when you wanted the next harvest.\n\n[Fall](https://stardewvalleywiki.com/Fall) is the third season: 28 calendar days, after Summer and before Winter. On Winter 1, crops that are no longer in season wither and die. The outdoor job is those 28 days on the farm. If last season’s occupancy method is still open in another tab, the [summer crop guide](/summer-crops-stardew) is the previous outdoor season on the same gold/day rules, and the [spring crop guide](/best-spring-crop-stardew) is the one before that.\n\n## Best outdoor fall crop depends on year, the shop you can open, and the tiles you can water\n\nYear 1 Fall 1 is a Pierre morning. The [Fall Stock](https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock) counter is the legal seed list: eggplant 20g, corn 150g, pumpkin 100g, bok choy 50g, yam 60g, cranberry 240g, sunflower 200g, fairy seeds 200g, amaranth 70g, grape starter 60g, wheat 10g. Artichoke seeds at 30g are marked available in year 2+. Beet, broccoli, Rare Seed, and Ancient Seeds are not in that Fall Stock table. Copying the first row of a gold/day sort onto a Year 1 hoe line only works if that row is actually on this counter.\n\nPierre’s shop opens most days at 9am. The counter closes at 5pm. You can still enter until 9pm, but you cannot buy or sell after 5pm because the building is also the family home. Plan the seed run for the 9am–5pm counter, not for a 9pm browse.\n\nBeet’s seed price on the Fall table is the label **Oasis: 20g**. If you can buy a packet with that label, beet is a legal row on the same ranking. If you cannot, it is not a Year 1 Pierre default.\n\n[Sweet Gem Berry](https://stardewvalleywiki.com/Sweet_Gem_Berry) is not a Pierre packet. The Fall table and the Crops Sweet Gem section price the seed at Traveling Cart **1,000g**, with a footnote that it can appear for as little as 600g only rarely. The same Crops section says those seeds can be found for sale at the Traveling Cart during Spring and Summer, and rarely during Fall and Winter. Without a Rare Seed in hand, do not treat about 83.33g/day as this morning’s shopping list.\n\nThe watering-can rectangle is the Year 1 plant count. Buy one seed per tile you can water on the plant day and on the days after, then stop — the same wet-tile ceiling as in [how to earn money](/how-to-earn-money-stardew). A cranberry seed on a tile you will not reach tomorrow is a 240g packet, not an 18.89g/day cell.\n\nWiki gold/day is a named comparison from the [Crops Gold per Day](https://stardewvalleywiki.com/Crops#Gold_per_Day) heading, not a promise and not a planner output. The formula is `((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`, with `Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`. The published figures assume no fertilizer, no crop quality, no Tiller, and no Agriculturist. The plant is watered on the plant day. Grow times exclude that plant day. An unwatered day does not kill the plant and does not count as growth. Extra crop chances are omitted except potato, and potato is not a fall crop. Plants that always give more than one item per harvest use number of crops per harvest times sell price; the Crops page names coffee bean, blueberry, and cranberries for that rule.\n\nThe same Crops heading works cranberries as a full example: max harvests 5, sell price per harvest 2 × 75g = 150g, seed 240g, growing days 7 + ((5 − 1) × 5) = 27, gold per day (5 × 150 − 240) / 27 = 18.89g. Those two berries are already inside 18.89g. Cranberries also have a 10% chance for more berries; that chance is not in the gold/day cell. Do not add 10% on top of 18.89g to beat pumpkin on paper.\n\nA season-total on one tile is a different metric from wiki gold/day. Pumpkin’s published cell of about 16.92g is one 13-day cycle: (320g − 100g) / 13. Two finished pumpkin plantings in fall are a different pile of gold. Do not treat that pile as the wiki gold/day cell, and do not mix the two into one “most profitable” name next to cranberry’s 18.89g.\n\n## Rank the outdoor fall field on one gold/day table, with access on the same rows\n\nThe [Fall](https://stardewvalleywiki.com/Fall) crop tables and the matching Crops sections supply the numbers. Rows are ordered by wiki gold/day so you can pick, not so the first row is always legal on your save.\n\n| Crop | Seed source and price | Grow / regrow | Wiki max harvests (no fertilizer, no Agriculturist) | Wiki gold/day (no fertilizer, no Tiller) | Access / occupancy |\n|---|---|---|---|---|---|\n| [Sweet Gem Berry](https://stardewvalleywiki.com/Sweet_Gem_Berry) | Traveling Cart 1,000g (Crops footnote: rarely 600g) | 24 days | 1 | about 83.33g | Not a Pierre default. One harvest. Derived last plant 4 for a Fall 28 harvest. Highest cell on this table only if you already have a Rare Seed. |\n| [Ancient Fruit](https://stardewvalleywiki.com/Ancient_Fruit) | Crops footnote: seed crafted free from the Ancient Seed artifact | 28 days, then every 7 | three-season footnote | about 57.14g* | Not a Fall-only outdoor finisher. Gold/day assumes a free crafted seed grown for three seasons. Not in Pierre Fall Stock. |\n| [Cranberries](https://stardewvalleywiki.com/Cranberries) | Pierre 240g | 7 days, then every 5 | 5 | about 18.89g | Year 1 Pierre. Two berries per harvest already in the 18.89g cell; the 10% extra chance is not. Planted Fall 1, watered daily, no Speed-Gro: picks on 8, 13, 18, 23, and 28. |\n| [Pumpkin](https://stardewvalleywiki.com/Pumpkin) | Pierre 100g | 13 days | 2 | about 16.92g | Year 1 Pierre. Giant-crop candidate. About 16.92g is one cycle (320g − 100g) / 13, not two-cycle season profit. Derived last plant 15. A held 3-by-3 occupies nine tiles until you harvest or chop. |\n| [Grape](https://stardewvalleywiki.com/Grape) | Pierre Grape Starter 60g | 10 days, then every 3 | 6 | 16.8g | Year 1 Pierre. Trellis: you cannot walk through any living stage. Planted Fall 1: first pick on 11, then every 3 days on 14, 17, 20, 23, and 26 (six picks). |\n| [Artichoke](https://stardewvalleywiki.com/Artichoke) | Pierre 30g, year 2+ | 8 days | 3 | 16.25g | Not a Year 1 Pierre default. Joins the Pierre counter in year 2; still below cranberry 18.89g on this scale. Derived last plant 20. |\n| [Broccoli](https://stardewvalleywiki.com/Broccoli) | N/A on the Fall table | 8 days, then every 4 | 5 | about 14.58g | Not in Pierre Fall Stock. The gold/day formula treats seed cost as 0. That is not a Pierre price of 0g. |\n| [Beet](https://stardewvalleywiki.com/Beet) | Oasis: 20g | 6 days | 4 | about 13.33g | Not in Pierre Fall Stock. Legal on this ranking when you can buy the Oasis: 20g packet; not a Year 1 Pierre default. Derived last plant 22. |\n| [Amaranth](https://stardewvalleywiki.com/Amaranth) | Pierre 70g | 7 days | 3 | about 11.43g | Year 1 Pierre. Pierre’s description harvests it with a scythe. Derived last plant 21. |\n| [Eggplant](https://stardewvalleywiki.com/Eggplant) | Pierre 20g | 5 days, then every 5 | 5 | 11.2g | Year 1 Pierre. Cheap seed, five picks, still well below cranberry 18.89g. |\n| [Yam](https://stardewvalleywiki.com/Yam) | Pierre 60g | 10 days | 2 | 10g | Year 1 Pierre. Derived last plant 18. |\n| [Fairy Rose](https://stardewvalleywiki.com/Fairy_Rose) | Pierre Fairy Seeds 200g | 12 days | 2 | 7.5g | Year 1 Pierre. Flower. Derived last plant 16. This table ranks the crop sell, not hive output. |\n| [Bok Choy](https://stardewvalleywiki.com/Bok_Choy) | Pierre 50g | 4 days | 6 | 7.5g | Year 1 Pierre. Short cycle. Derived last plant 24 for a harvest that still lands on Fall 28. |\n| [Wheat](https://stardewvalleywiki.com/Wheat) | Pierre 10g | 4 days | 6 in fall, or 13 across summer and fall | 3.75g | Year 1 Pierre. Two-season crop, but Winter 1 still ends a fall plant. Derived last plant 24 for a Fall 28 harvest. |\n| [Corn](https://stardewvalleywiki.com/Corn) | Pierre 150g | 14 days, then every 4 | 4 in fall, or 11 across summer and fall | about 1.92g fall only; about 7.41g across both seasons | Year 1 Pierre. A plant still in season from Summer 28 continues on Fall 1. Fall-only 1.92g is not a fall gold/day winner. |\n| [Sunflower](https://stardewvalleywiki.com/Sunflower) | Pierre 200g | 8 days | 3 in fall, or 6 across summer and fall | **−15g** | Year 1 Pierre. Negative because the seed is 200g and the flower sells for 80g. Pierre still sells it. Derived last plant 20 for a Fall 28 harvest. |\n\nTable notes. Wiki gold/day and max harvests use the Crops assumptions above: no fertilizer, no quality, no Tiller, no Agriculturist, watered on the plant day, grow times exclude the plant day. Cranberry 18.89g already prices two 75g berries per harvest; do not add the 10% extra-berry chance. Pumpkin about 16.92g is one 13-day cycle, (320g − 100g) / 13, not the gold from two plantings. Broccoli’s N/A seed input is treated as 0 in the published about 14.58g cell; that is not “Pierre sells broccoli seeds for 0g,” and broccoli is not in Fall Stock. Sweet Gem about 83.33g* assumes the 1,000g Traveling Cart price, not a Year 1 Pierre packet. Ancient Fruit about 57.14g* is the three-season free-seed footnote. Sunflower is **−15g** on the Fall table, not a rounded-up positive. Corn’s fall-only cell is about 1.92g; about 7.41g is the two-season figure. The Crops infoboxes also list JojaMart at 300g for cranberry seeds, 125g for pumpkin, and 75g for grape starter. Pierre’s second Fall Stock column is labeled Out of season, not Joja.\n\nRead the table as three questions.\n\n- Can you buy that seed on the morning you want to plant?\n- Can you water that tile on the plant day and on every day that still counts as growth?\n- Is the tile still occupied on the morning you wanted the next cranberry pick, a second pumpkin cycle, a pumpkin 3-by-3, or a grape harvest path?\n\nA crop that wins gold/day on a full season can still be the wrong occupant for a tile you already promised to something else.\n\nThe wiki does not name a “last plant day.” For a single-harvest crop that must ripen on Fall 28, the derived date is `28 − grow days`, excluding the plant day, with no Speed-Gro, and with the plant day already watered. Miss a watering night and move the date earlier by each missed night. The gold/day table ignores fertilizer, so the dates below ignore Speed-Gro as well.\n\n| Crop | Grow days | Derived last plant for a Fall 28 harvest |\n|---|---|---|\n| Bok Choy | 4 | 24 |\n| Wheat | 4 | 24 |\n| Beet | 6 | 22 |\n| Amaranth | 7 | 21 |\n| Artichoke | 8 | 20 |\n| Sunflower | 8 | 20 |\n| Yam | 10 | 18 |\n| Fairy Rose | 12 | 16 |\n| Pumpkin | 13 | 15 |\n| Sweet Gem Berry | 24 | 4 |\n\nBok choy, wheat, beet, amaranth, artichoke, sunflower, yam, fairy rose, pumpkin, and sweet gem are single-harvest rows on this calendar: a seed bought after the derived date finishes the season as an unfinished stage and withers on Winter 1. Wheat and sunflower also grow in summer, but they are not winter crops, so a late fall sowing does not carry into Winter 1. Cranberry and grape do not get a five-pick or six-pick “last plant” name here. Count them on the calendar with the same public grow-time rule. Cranberry first pick is plant day plus 7, then every 5 days through 28; five picks need a Fall 1 plant (growing days 27). Grape first pick is plant day plus 10, then every 3 days; six picks from Fall 1 land on 11, 14, 17, 20, 23, and 26.\n\n![Calendar schematic of Fall 1–28 occupancy: cranberry picks on 8, 13, 18, 23, and 28, so Fall 14 morning the tile is still occupied; pumpkin 13-day cycle and derived last plant 15. Not a screenshot.](/blog/illustrations/fall-crop-occupancy-calendar.webp)\n\nFall 1–28 occupancy on one tile, planted on Fall 1, watered every day, with no Speed-Gro. Cranberry picks land on 8, 13, 18, 23, and 28, so the tile is still planted on Fall 14, the morning a Fall 1 pumpkin is ready, and it is still planted on the mornings you might have wanted a second 13-day pumpkin. Pumpkin planted Fall 1 is ready on Fall 14; harvest and replant the same day and a second head is ready on Fall 27. Pumpkin needs 13 growing days; the derived last plant for a Fall 28 harvest is 15. Last-plant dates are derived as 28 minus grow days, not a wiki field name. Read which mornings the tile is still occupied before you buy the next seed. The 18.89g and 16.92g cells stay on the table; they are not season totals drawn on this calendar.\n\n## Year 1 Pierre: cranberries, pumpkins, and grapes occupy different tiles\n\nWithout a Rare Seed, without an Oasis: 20g beet packet, and before artichoke is on Pierre’s counter, drop Sweet Gem, beet, and artichoke off the default shopping list. The highest wiki gold/day on the Year 1 Pierre fall counter is cranberry at about 18.89g. Pumpkin at about 16.92g and grape at 16.8g are lower on that same no-fertilizer, no-Tiller scale. They are still worth tiles, because they do not occupy soil the same way. The Year 1 outdoor choice is which tiles you give to which of those three, not a single first-place crop copied onto every hoe mark.\n\n### Cranberries occupy the tile through the late-month picks\n\nPierre sells cranberry seeds for 240g. The Crops infobox also lists JojaMart at 300g. The plant takes 7 days, then produces every 5 days. Each harvest is two berries. Sell prices are 75g, 93g, 112g, and 150g by quality. Wiki gold/day is about 18.89g with no fertilizer and no Tiller, using the two-berry harvest already printed on the Fall table and in the Crops worked example: (5 × 150 − 240) / 27.\n\nPlant on Fall 1, water every day, use no Speed-Gro, and the picks are Fall 8, 13, 18, 23, and 28. That is five harvests, which is the wiki maximum. The tile is not empty after the first pick. It is still a cranberry on Fall 14, when a Fall 1 pumpkin is ready. It is still a cranberry on Fall 15, the derived last plant for a pumpkin that would ripen on Fall 28. It is still a cranberry on Fall 23 and Fall 28. If you wanted that tile for a second 13-day pumpkin, the cranberry already spent it.\n\nOn a Year 1 farm that cannot buy an Oasis: 20g beet packet and does not hold a Rare Seed, 18.89g is the highest Pierre outdoor gold/day on the table. The crop also asks for less replanting than pumpkin: one 240g seed covers five picks. That is occupancy and a published gold/day cell, not a separate “low maintenance” score.\n\n### Pumpkins are a 13-day crop and the fall giant\n\nPierre sells pumpkin seeds for 100g. The Crops infobox also lists JojaMart at 125g. Grow time is 13 days. Sell prices are 320g, 400g, 480g, and 640g by quality. Pumpkins are inedible. Wiki gold/day is about 16.92g: (320g − 100g) / 13. Max harvests in fall are 2. Planted on Fall 1 and watered every day, a pumpkin is ready on Fall 14. Harvest and replant the same day and the second head is ready on Fall 27. The derived last plant for a head that ripens on Fall 28 is Fall 15. A seed bought on Fall 16 does not finish before Winter 1.\n\nThose two plantings are how you use max harvests 2. They are not the 16.92g cell. Comparing “two pumpkins on one tile across the season” to cranberry 18.89g mixes a season pile with a per-day cell. Keep 16.92g next to 18.89g only as wiki gold/day.\n\nPumpkin, used in Autumn's Bounty and the Fall Crops Bundle, is the outdoor fall giant. Cauliflower, melon, pumpkin, powdermelon, and Qi fruit planted in a 3-by-3 can randomly combine. At the start of each day, every possible 3-by-3 grid of crops, including overlaps, has a 1% chance to grow into a giant as long as the top-left crop is fully grown and watered and all nine plants are the same type. The giant does not have to appear on the morning the heads finish; it can appear on any later morning those conditions still hold. Harvest with any axe; it takes three hits and drops 15 to 21 normal-quality items. Giants cannot form in the greenhouse, in garden pots, or on Ginger Island. They do not die at the change of season, so a giant that pops on Fall 28 is still there on Winter 1. A regular pumpkin still in the ground on Winter 1 withers, even if it was ready to harvest. Soil under a giant may become untilled, and fertilizer on that soil is lost.\n\nThose nine tiles stay pumpkin from the plant day until you harvest the heads or chop a giant. You cannot also run a second 13-day cycle on the same nine tiles while you keep them for more 1% mornings. A 3-by-4 of pumpkin contains two overlapping 3-by-3 grids; a 4-by-4 contains four. Each grid still needs its own top-left plant mature and watered. Leaving the top-left dry overnight skips that grid’s roll; it does not kill the plants.\n\nIf a sprinkler sits in the center of the square, that center is a machine, not a pumpkin, and the nine cells are not the same crop. Keep scarecrows off those nine cells for the same reason: the post is not a pumpkin. Sprinkler reach and unlock tiers are the [sprinkler guide](/sprinkler-stardew). Year 1 usually waters a giant square with the can. The can has to reach the top-left every morning you still want the roll.\n\n### Grapes pay six picks and block walking\n\nPierre sells grape starter for 60g. The Crops infobox also lists JojaMart at 75g. The plant takes 10 days, then produces every 3 days. You cannot walk through grapes at any living stage. The other trellis crops on the Crops page are green bean and hops; grape is the fall one. Wiki gold/day is 16.8g: (6 × 80 − 60) / (10 + 5 × 3) = 420 / 25. Sell prices are 80g, 100g, 120g, and 160g by quality.\n\nPlanted on Fall 1, grow times exclude the plant day, so the first pick is Fall 11, then every 3 days: 14, 17, 20, 23, and 26. That is six picks and matches the wiki maximum. The tile is still grape on Fall 14 when a pumpkin cycle finishes, and it is still grape through Fall 28 even though the sixth pick already landed on 26.\n\nLayout is the grape cost that gold/day does not show. Plant a single row, or a double row with a walking lane. Do not ring a pumpkin 3-by-3 with grapes, and do not plant grapes across the watering path or the axe path you will need if a giant forms. While the grapes are alive, the tile is a wall.\n\nYear 1, watering can, Pierre only, no Rare Seed, no Oasis: 20g beet:\n\n- Most wet tiles: cranberry, the highest Pierre gold/day on this table.\n- One pumpkin 3-by-3 only if you will water all nine every day and accept that those tiles stay pumpkin for 13 days per cycle, or longer if you hold them for giant mornings.\n- One grape row only where a walking tile already exists and you accept a trellis you cannot cross.\n\nDo not copy all three onto the same cells.\n\n## Year 2 artichoke, Oasis beet, and cart Rare Seed join the same ranking\n\nOpening Year 2, buying an Oasis: 20g beet, or holding a Rare Seed does not rewrite cranberry, pumpkin, or grape occupancy. Each one adds a legal row on the same gold/day table. Read those rows as access, then plant them on tiles the Year 1 trio is not already using.\n\n### Artichoke is a Year 2 Pierre seed\n\nPierre sells artichoke seeds for 30g from year 2+. Grow time is 8 days. Sell price on the Fall table is 160g. Wiki gold/day is 16.25g: (160g − 30g) / 8. Max harvests are 3. Derived last plant for a Fall 28 harvest is 20. A seed bought on Fall 21 does not finish.\n\nYear 1 does not put artichoke on Pierre’s Fall counter. In year 2 it is a real Pierre row: 16.25g sits below cranberry 18.89g and grape 16.8g, and above eggplant 11.2g. Year 2 does not cancel grape’s walk block or pumpkin’s nine-tile hold. An artichoke tile turns over every 8 days; a cranberry tile planted Fall 1 is still cranberry on Fall 20, the artichoke last-plant morning. If you want artichoke at all, put it on tiles you did not already promise to late cranberry picks.\n\n### Beet is Oasis: 20g on the Fall table\n\nBeet grows in 6 days. Sell price on the Fall table is 100g. Wiki gold/day is about 13.33g. Max harvests are 4. Derived last plant is 22. Beet is not in Pierre Fall Stock. The Fall table seed price is **Oasis: 20g**.\n\nIf you can buy that packet, beet is a legal row on the same ranking, below broccoli’s formula cell and well below cranberry 18.89g. If you cannot buy it, do not treat beet as a Year 1 Pierre default. Six days is a short cycle: a Fall 1 beet is ready on Fall 7, and you can replant through the derived last plant 22. That turnover still occupies the tile on each 6-day stretch. It does not beat cranberry’s 18.89g on the published scale.\n\n### Sweet Gem Berry needs a Rare Seed, not a Pierre packet\n\nSweet Gem Berry grows in Fall in 24 days, one harvest, no regrow. Sell prices are 3,000g, 3,750g, 4,500g, and 6,000g by quality. It is inedible. Wiki gold/day is about 83.33g* assuming the 1,000g seed. The Crops footnote says the seed can be obtained for as little as 600g, but only rarely; the published cell uses 1,000g. Fall table seed source is Traveling Cart: 1,000g. The Crops section says the seeds can be found for sale at the Traveling Cart during Spring and Summer, and rarely during Fall and Winter.\n\nDerived last plant is 4. Planted on Fall 1, a 24-day crop is ready on Fall 25. Planted on Fall 4, growing days 5 through 28 are 24 days and the berry ripens on Fall 28. A seed planted on Fall 5 does not finish, and Winter 1 withers the unfinished stage. You can gift a Sweet Gem Berry to Old Master Cannoli in the Secret Woods for a Stardrop; that swap is not a gold/day rank.\n\nWithout a Rare Seed, do not treat 83.33g as the Year 1 default first place. With a Rare Seed, 83.33g is the highest cell on this same no-fertilizer, no-Tiller table, still gated by 24 days and last plant 4, and still a one-harvest tile you cannot also use for cranberry picks 8 through 28.\n\nYear 1 Pierre: cranberry is first on this gold/day scale; pumpkin and grape are occupancy forks. Year 2: artichoke joins Pierre at 16.25g and still loses to cranberry 18.89g. An Oasis: 20g beet joins the table as a labeled row, not as Pierre’s shelf. A 1,000g Rare Seed puts Sweet Gem at the top of the same scale, with last plant 4.\n\n## Last plant days, and crops that lose the outdoor rank\n\nUse the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.\n\n[Sunflower](https://stardewvalleywiki.com/Sunflower) wiki gold/day is **−15g** because the seed is 200g and the flower sells for 80g. Pierre still sells sunflower seeds on the Fall counter. Plant it if you want the flower on the tile. Do not fill watered soil from the top of the gold/day table with a negative cell.\n\n[Corn](https://stardewvalleywiki.com/Corn) is a 150g Pierre seed that takes 14 days, then produces every 4 days, and sells for 50g. Fall-only wiki gold/day is about 1.92g. Across summer and fall it is about 7.41g. A plant placed in summer and still in season continues on Fall 1; that is the Crops End of Season example, not a fall gold/day win. Do not buy corn in fall to “win fall” on the 1.92g cell. Tiles that already hold summer corn into fall are last season’s occupancy carrying forward; the [summer crop guide](/summer-crops-stardew) is that previous outdoor ranking.\n\n[Broccoli](https://stardewvalleywiki.com/Broccoli) shows about 14.58g, next to beet at about 13.33g, because the Fall table seed price is N/A and the formula treats seed cost as 0. Grow time is 8 days, then every 4; max harvests 5; sell 70g, 87g, 105g, and 140g by quality. Broccoli is not in Pierre Fall Stock. Treat 14.58g as a formula result for a seed whose shop price is N/A, not as a Pierre field you can scale with gold at 0g a packet.\n\n[Ancient Fruit](https://stardewvalleywiki.com/Ancient_Fruit) grows in Spring, Summer, or Fall. It takes 28 days, then produces every 7 days, and sells for 550g, 687g, 825g, and 1,100g by quality. Wiki gold/day about 57.14g* assumes a seed crafted for free from the Ancient Seed artifact and grown for three seasons. Ancient Seeds are not in Pierre Fall Stock. Planted on Fall 1, the first harvest is not a same-season outdoor finisher on this 28-day calendar the way cranberry is. Year-round indoor beds are the [greenhouse guide](/glasshouse-stardew-valley).\n\nFairy rose, wheat, bok choy, yam, amaranth, and eggplant stay on the ranking table as legal Year 1 Pierre rows. Cheap seed and a short cycle do not make them first next to cranberry 18.89g. Wheat at 10g is the cheapest Pierre fall seed on the counter and still only 3.75g/day.\n\n## Put grapes, a pumpkin 3-by-3, and cranberry rows on one bed without sharing walking tiles\n\nGold/day does not place the plants. On one outdoor bed you still have to walk, water, and, if a giant forms, swing an axe. Grapes block that walk. A pumpkin 3-by-3 needs nine matching plants and a reachable top-left. Cranberry wants a rectangle you can harvest on 8, 13, 18, 23, and 28 without crossing trellis.\n\n![Bed grid schematic: grape row with a walk tile, pumpkin 3-by-3 with marked top-left, cranberry rectangle not behind grapes. Not a 1% giant already rolled.](/blog/illustrations/fall-grape-pumpkin-cranberry-bed.webp)\n\nOccupancy on one bed, not a 1% giant already rolled. One side: a grape row plus at least one walking tile. One pumpkin 3-by-3 with the top-left cell marked, all nine pumpkin, no sprinkler or scarecrow inside the square. A cranberry rectangle that does not overlap those nine tiles and does not sit behind a grape wall. A grape ring around the pumpkin is the failed layout: you cannot walk through living grapes to water the top-left or to chop a giant. This grid uses the wiki trellis and giant rules.\n\n1. Hoe a 3-by-3, not a line of nine.\n2. Plant pumpkin in all nine cells. Mixed crops in that block cannot combine.\n3. Keep grapes in a row with a walking lane. Do not ring the nine.\n4. Put cranberries in a rectangle you can reach without crossing that trellis.\n5. Keep sprinklers and scarecrows off the pumpkin nine, and water the top-left, using the same giant-square rules as the pumpkin section above.\n\nIf you want that same 3-by-3 and grape row on the farm map you actually play, open the [planner](/#planner) and switch the season to fall. The tool can place crops on the eight farm maps plus Ginger Island and can show sprinkler and scarecrow coverage; projects stay in the browser. It does not compute gold/day, last-plant dates, or giant 1% rolls.\n\nBefore you pay Pierre, walk the tiles you can water tomorrow. For each wet tile, name the crop, the shop that can sell the seed this morning, and the next date that tile is empty or blocked. If the seed is artichoke and the year is still 1, skip that Pierre row. If the seed is beet and you do not have an Oasis: 20g packet, skip beet. If the seed is Sweet Gem and you do not hold a Rare Seed, skip the 83.33g cell. If the tile is already promised to a cranberry pick on the 28th, a pumpkin 3-by-3, or a grape wall, buy the seed that matches that promise, not the first row of the table.\n\n## FAQ\n\n**What is the most profitable crop in fall in Stardew Valley?**\n\nThere is no single answer. On the Crops gold/day scale with no fertilizer and no Tiller, Year 1 Pierre’s highest outdoor cell is cranberry at about 18.89g. Pumpkin about 16.92g is one 13-day cycle, not a two-planting season total. Grape is 16.8g and blocks walking. Sweet Gem about 83.33g needs a Traveling Cart Rare Seed at 1,000g and is not a Pierre default. Artichoke 16.25g is year 2+.\n\n**What is the best fall crop in Year 1?**\n\nOn Year 1 Pierre’s Fall Stock, cranberry seeds at 240g correspond to about 18.89g/day, the highest gold/day on that counter. Pumpkin and grape are the occupancy forks: 13 days and a possible 3-by-3 versus a trellis you cannot walk through. Artichoke is not on the Year 1 counter. Beet is Oasis: 20g, not Pierre. Sweet Gem is not a Pierre packet.\n\n**What is the best fall crop in Year 2?**\n\nArtichoke joins Pierre at 30g and 16.25g/day, still below cranberry 18.89g. Year 2 does not cancel grape’s trellis or pumpkin’s nine-tile hold. Sweet Gem still depends on a Rare Seed, not on the year.\n\n**What is the best seed to grow in fall?**\n\nSeed price is not gold/day. Wheat at 10g is only 3.75g/day. Cranberry seeds at 240g correspond to about 18.89g/day. Sunflower seeds at 200g correspond to **−15g**/day. A Rare Seed at 1,000g corresponds to about 83.33g/day and 24 growing days, with derived last plant 4.\n\n**Are cranberries or pumpkins better in fall?**\n\nOn the same wiki gold/day scale, cranberry is about 18.89g and occupies the tile through picks on 8, 13, 18, 23, and 28 if you plant Fall 1. Pumpkin is about 16.92g for one 13-day cycle and can form a 3-by-3 giant. Do not compare two pumpkin plantings as a season total against 18.89g.\n\n## Sources\n\nChecked 2026-09-14 against Stardew Valley Wiki Fall, Crops (including Gold per Day and Giant Crops), and Pierre's General Store Fall Stock. Wiki gold/day figures assume no fertilizer and no Tiller. Last-plant dates are derived as 28 minus grow days for a harvest on Fall 28, excluding the plant day, with watering on the plant day; the wiki does not name that field. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls.\n\n- [Stardew Valley Wiki: Fall](https://stardewvalleywiki.com/Fall)\n- [Stardew Valley Wiki: Crops](https://stardewvalleywiki.com/Crops)\n- [Stardew Valley Wiki: Crops (Gold per Day)](https://stardewvalleywiki.com/Crops#Gold_per_Day)\n- [Stardew Valley Wiki: Crops (Giant Crops)](https://stardewvalleywiki.com/Crops#Giant_Crops)\n- [Stardew Valley Wiki: Pierre's General Store](https://stardewvalleywiki.com/Pierre%27s_General_Store)\n- [Stardew Valley Wiki: Pierre's General Store (Fall Stock)](https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock)\n- [Stardew Valley Planner](https://stardewvalleyplanner.art/)\n- [This site: spring crop ranking](https://stardewvalleyplanner.art/best-spring-crop-stardew)\n- [This site: summer crop ranking](https://stardewvalleyplanner.art/summer-crops-stardew)\n- [This site: Year 1 gold](https://stardewvalleyplanner.art/how-to-earn-money-stardew)\n- [This site: greenhouse 10×12](https://stardewvalleyplanner.art/glasshouse-stardew-valley)\n\n",
  "bodyHash": "887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 30698,
  "seo": {
    "title": "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
    "h1": "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
    "description": "Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table.",
    "slug": "fall-crops-stardew",
    "faq": null,
    "faqInLockedBody": true,
    "faqHeading": "FAQ",
    "sourcesInLockedBody": true,
    "sourcesHeading": "Sources",
    "schema": {
      "@type": "Article",
      "notFaqPage": true
    },
    "og": {
      "title": "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
      "description": "Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table.",
      "openGraphType": "article",
      "image": "pending_media"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-fall",
      "label": "Stardew Valley Wiki: Fall",
      "url": "https://stardewvalleywiki.com/Fall",
      "appliesTo": [
        {
          "quote": "the third season: 28 calendar days, after Summer and before Winter.",
          "occurrence": 1
        },
        {
          "quote": "The [Fall Stock](https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock) counter is the legal seed list: eggplant 20g, corn 150g, pumpkin 100g, bok choy 50g, yam 60g, cranberry 240g, sunflower 200g, fairy seeds 200g, amaranth 70g, grape starter 60g, wheat 10g.",
          "occurrence": 1
        },
        {
          "quote": "Beet’s seed price on the Fall table is the label **Oasis: 20g**.",
          "occurrence": 1
        },
        {
          "quote": "[Sunflower](https://stardewvalleywiki.com/Sunflower) wiki gold/day is **−15g** because the seed is 200g and the flower sells for 80g.",
          "occurrence": 1
        },
        {
          "quote": "Fall-only wiki gold/day is about 1.92g. Across summer and fall it is about 7.41g.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops",
      "label": "Stardew Valley Wiki: Crops",
      "url": "https://stardewvalleywiki.com/Crops",
      "appliesTo": [
        {
          "quote": "Grow times exclude that plant day. An unwatered day does not kill the plant and does not count as growth.",
          "occurrence": 1
        },
        {
          "quote": "Plant on Fall 1, water every day, use no Speed-Gro, and the picks are Fall 8, 13, 18, 23, and 28.",
          "occurrence": 1
        },
        {
          "quote": "Sell prices are 320g, 400g, 480g, and 640g by quality. Pumpkins are inedible.",
          "occurrence": 1
        },
        {
          "quote": "You cannot walk through grapes at any living stage. The other trellis crops on the Crops page are green bean and hops; grape is the fall one.",
          "occurrence": 1
        },
        {
          "quote": "A plant placed in summer and still in season continues on Fall 1; that is the Crops End of Season example, not a fall gold/day win.",
          "occurrence": 1
        },
        {
          "quote": "Wiki gold/day about 57.14g* assumes a seed crafted for free from the Ancient Seed artifact and grown for three seasons.",
          "occurrence": 1
        },
        {
          "quote": "The Fall table and the Crops Sweet Gem section price the seed at Traveling Cart **1,000g**, with a footnote that it can appear for as little as 600g only rarely.",
          "occurrence": 1
        },
        {
          "quote": "The same Crops section says those seeds can be found for sale at the Traveling Cart during Spring and Summer, and rarely during Fall and Winter.",
          "occurrence": 1
        },
        {
          "quote": "The Crops infoboxes also list JojaMart at 300g for cranberry seeds, 125g for pumpkin, and 75g for grape starter.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops-gold",
      "label": "Stardew Valley Wiki: Crops (Gold per Day)",
      "url": "https://stardewvalleywiki.com/Crops#Gold_per_Day",
      "appliesTo": [
        {
          "quote": "The formula is `((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`, with `Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`.",
          "occurrence": 1
        },
        {
          "quote": "The published figures assume no fertilizer, no crop quality, no Tiller, and no Agriculturist.",
          "occurrence": 1
        },
        {
          "quote": "max harvests 5, sell price per harvest 2 × 75g = 150g, seed 240g, growing days 7 + ((5 − 1) × 5) = 27, gold per day (5 × 150 − 240) / 27 = 18.89g.",
          "occurrence": 1
        },
        {
          "quote": "Cranberries also have a 10% chance for more berries; that chance is not in the gold/day cell.",
          "occurrence": 1
        },
        {
          "quote": "Pumpkin’s published cell of about 16.92g is one 13-day cycle: (320g − 100g) / 13.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-crops-giant",
      "label": "Stardew Valley Wiki: Crops (Giant Crops)",
      "url": "https://stardewvalleywiki.com/Crops#Giant_Crops",
      "appliesTo": [
        {
          "quote": "At the start of each day, every possible 3-by-3 grid of crops, including overlaps, has a 1% chance to grow into a giant as long as the top-left crop is fully grown and watered and all nine plants are the same type.",
          "occurrence": 1
        },
        {
          "quote": "Harvest with any axe; it takes three hits and drops 15 to 21 normal-quality items.",
          "occurrence": 1
        },
        {
          "quote": "Giants cannot form in the greenhouse, in garden pots, or on Ginger Island.",
          "occurrence": 1
        },
        {
          "quote": "They do not die at the change of season, so a giant that pops on Fall 28 is still there on Winter 1.",
          "occurrence": 1
        },
        {
          "quote": "Soil under a giant may become untilled, and fertilizer on that soil is lost.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre",
      "label": "Stardew Valley Wiki: Pierre's General Store",
      "url": "https://stardewvalleywiki.com/Pierre%27s_General_Store",
      "appliesTo": [
        {
          "quote": "Pierre’s shop opens most days at 9am. The counter closes at 5pm. You can still enter until 9pm, but you cannot buy or sell after 5pm because the building is also the family home.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre-fall",
      "label": "Stardew Valley Wiki: Pierre's General Store (Fall Stock)",
      "url": "https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock",
      "appliesTo": [
        {
          "quote": "Artichoke seeds at 30g are marked available in year 2+. Beet, broccoli, Rare Seed, and Ancient Seeds are not in that Fall Stock table.",
          "occurrence": 1
        },
        {
          "quote": "Pierre’s second Fall Stock column is labeled Out of season, not Joja.",
          "occurrence": 1
        },
        {
          "quote": "Pierre sells artichoke seeds for 30g from year 2+.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-home",
      "label": "Stardew Valley Planner",
      "url": "https://stardewvalleyplanner.art/",
      "appliesTo": [
        {
          "quote": "open the [planner](/#planner) and switch the season to fall.",
          "occurrence": 1
        },
        {
          "quote": "The tool can place crops on the eight farm maps plus Ginger Island and can show sprinkler and scarecrow coverage; projects stay in the browser. It does not compute gold/day, last-plant dates, or giant 1% rolls.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-spring",
      "label": "This site: spring crop ranking",
      "url": "https://stardewvalleyplanner.art/best-spring-crop-stardew",
      "appliesTo": [
        {
          "quote": "the [spring crop guide](/best-spring-crop-stardew) is the one before that.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-summer",
      "label": "This site: summer crop ranking",
      "url": "https://stardewvalleyplanner.art/summer-crops-stardew",
      "appliesTo": [
        {
          "quote": "the [summer crop guide](/summer-crops-stardew) is the previous outdoor season on the same gold/day rules",
          "occurrence": 1
        },
        {
          "quote": "the [summer crop guide](/summer-crops-stardew) is that previous outdoor ranking.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-money",
      "label": "This site: Year 1 gold",
      "url": "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
      "appliesTo": [
        {
          "quote": "the same wet-tile ceiling as in [how to earn money](/how-to-earn-money-stardew).",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-greenhouse",
      "label": "This site: greenhouse 10×12",
      "url": "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
      "appliesTo": [
        {
          "quote": "Year-round indoor beds are the [greenhouse guide](/glasshouse-stardew-valley).",
          "occurrence": 1
        }
      ]
    }
  ],
  "publicRequirements": {
    "doNotWriteSrcUntilTitleReviewPass": false,
    "jsonLdType": "Article",
    "notFaqPage": true,
    "visibleFaqAndSourcesRequired": true,
    "faq": {
      "renderFromLockedBody": true,
      "heading": "FAQ",
      "component": "BlogFaqList",
      "siblingHeadingRequired": true,
      "items": [
        {
          "question": "What is the most profitable crop in fall in Stardew Valley?",
          "answer": "There is no single answer. On the Crops gold/day scale with no fertilizer and no Tiller, Year 1 Pierre’s highest outdoor cell is cranberry at about 18.89g. Pumpkin about 16.92g is one 13-day cycle, not a two-planting season total. Grape is 16.8g and blocks walking. Sweet Gem about 83.33g needs a Traveling Cart Rare Seed at 1,000g and is not a Pierre default. Artichoke 16.25g is year 2+."
        },
        {
          "question": "What is the best fall crop in Year 1?",
          "answer": "On Year 1 Pierre’s Fall Stock, cranberry seeds at 240g correspond to about 18.89g/day, the highest gold/day on that counter. Pumpkin and grape are the occupancy forks: 13 days and a possible 3-by-3 versus a trellis you cannot walk through. Artichoke is not on the Year 1 counter. Beet is Oasis: 20g, not Pierre. Sweet Gem is not a Pierre packet."
        },
        {
          "question": "What is the best fall crop in Year 2?",
          "answer": "Artichoke joins Pierre at 30g and 16.25g/day, still below cranberry 18.89g. Year 2 does not cancel grape’s trellis or pumpkin’s nine-tile hold. Sweet Gem still depends on a Rare Seed, not on the year."
        },
        {
          "question": "What is the best seed to grow in fall?",
          "answer": "Seed price is not gold/day. Wheat at 10g is only 3.75g/day. Cranberry seeds at 240g correspond to about 18.89g/day. Sunflower seeds at 200g correspond to **−15g**/day. A Rare Seed at 1,000g corresponds to about 83.33g/day and 24 growing days, with derived last plant 4."
        },
        {
          "question": "Are cranberries or pumpkins better in fall?",
          "answer": "On the same wiki gold/day scale, cranberry is about 18.89g and occupies the tile through picks on 8, 13, 18, 23, and 28 if you plant Fall 1. Pumpkin is about 16.92g for one 13-day cycle and can form a 3-by-3 giant. Do not compare two pumpkin plantings as a season total against 18.89g."
        }
      ],
      "note": "FAQ copy is already in the locked reader body under ## FAQ. G extracts those five items into BlogFaqList. Do not invent new Q/A. JSON-LD stays Article, not FAQPage."
    },
    "page": {
      "titleEqualsH1": true,
      "author": "Stardew Valley Planner Team",
      "topic": "Stardew Valley Guides",
      "featured": true,
      "readTimeMinutes": 19,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "headingLevelMap": {
        "lockedAtx##": "h2",
        "lockedAtx###": "h3",
        "note": "C already used ## as reader H2 and ### as H3. Do not render an H1 in the article module."
      }
    },
    "sources": {
      "renderFromLockedBody": true,
      "heading": "Sources",
      "component": "BlogSources",
      "checkedLabel": "Checked 2026-09-14 against Stardew Valley Wiki Fall, Crops (including Gold per Day and Giant Crops), and Pierre's General Store Fall Stock. Wiki gold/day figures assume no fertilizer and no Tiller. Last-plant dates are derived as 28 minus grow days for a harvest on Fall 28, excluding the plant day, with watering on the plant day; the wiki does not name that field. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls.",
      "itemOrder": [
        "wiki-fall",
        "wiki-crops",
        "wiki-crops-gold",
        "wiki-crops-giant",
        "wiki-pierre",
        "wiki-pierre-fall",
        "planner-home",
        "planner-spring",
        "planner-summer",
        "planner-money",
        "planner-greenhouse"
      ],
      "items": [
        {
          "label": "Stardew Valley Wiki: Fall",
          "href": "https://stardewvalleywiki.com/Fall"
        },
        {
          "label": "Stardew Valley Wiki: Crops",
          "href": "https://stardewvalleywiki.com/Crops"
        },
        {
          "label": "Stardew Valley Wiki: Crops (Gold per Day)",
          "href": "https://stardewvalleywiki.com/Crops#Gold_per_Day"
        },
        {
          "label": "Stardew Valley Wiki: Crops (Giant Crops)",
          "href": "https://stardewvalleywiki.com/Crops#Giant_Crops"
        },
        {
          "label": "Stardew Valley Wiki: Pierre's General Store",
          "href": "https://stardewvalleywiki.com/Pierre%27s_General_Store"
        },
        {
          "label": "Stardew Valley Wiki: Pierre's General Store (Fall Stock)",
          "href": "https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock"
        },
        {
          "label": "Stardew Valley Planner",
          "href": "https://stardewvalleyplanner.art/"
        },
        {
          "label": "This site: spring crop ranking",
          "href": "https://stardewvalleyplanner.art/best-spring-crop-stardew"
        },
        {
          "label": "This site: summer crop ranking",
          "href": "https://stardewvalleyplanner.art/summer-crops-stardew"
        },
        {
          "label": "This site: Year 1 gold",
          "href": "https://stardewvalleyplanner.art/how-to-earn-money-stardew"
        },
        {
          "label": "This site: greenhouse 10×12",
          "href": "https://stardewvalleyplanner.art/glasshouse-stardew-valley"
        }
      ]
    },
    "lockedAnglePhrases": [
      "There is no single best outdoor fall crop",
      "Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.",
      "It does not compute gold/day, last-plant dates, or giant 1% rolls"
    ],
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/summer-crops-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/best-spring-crop-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/how-to-earn-money-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/sprinkler-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/glasshouse-stardew-valley",
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
      "src": "/blog/fall-crops-stardew-cover.webp",
      "workingFile": "public/blog/fall-crops-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures",
      "altStatus": "pending_media",
      "altDirection": "Describe the actual cover: an outdoor fall field with readable cranberry rows, a pumpkin block, and grape trellis. Not a greenhouse. Not a Community Center board. Not a winter snow field. Not a fake screenshot. Do not put gold/day, last-plant dates, or 3-by-3 numbers on the cover. Do not write the final Title on the cover. trimmed length ≥ 8."
    },
    "figures": [
      {
        "id": "figure-1-fall-occupancy-calendar",
        "assemblyToken": "FIGURE1_CONTROLLED_DIAGRAM",
        "workingFile": "public/blog/illustrations/fall-crop-occupancy-calendar.webp",
        "src": "/blog/illustrations/fall-crop-occupancy-calendar.webp",
        "placement": "After the derived last-plant table in working H2-2 (## Rank the outdoor fall field…). Lock has markdown image + following caption paragraph.",
        "type": "Controlled Fall 1–28 calendar schematic. Not a screenshot. Not a generated fake game still.",
        "alt": "Calendar schematic of Fall 1–28 occupancy: cranberry picks on 8, 13, 18, 23, and 28, so Fall 14 morning the tile is still occupied; pumpkin 13-day cycle and derived last plant 15. Not a screenshot.",
        "caption": "Fall 1–28 occupancy on one tile, planted on Fall 1, watered every day, with no Speed-Gro. Cranberry picks land on 8, 13, 18, 23, and 28, so the tile is still planted on Fall 14, the morning a Fall 1 pumpkin is ready, and it is still planted on the mornings you might have wanted a second 13-day pumpkin. Pumpkin planted Fall 1 is ready on Fall 14; harvest and replant the same day and a second head is ready on Fall 27. Pumpkin needs 13 growing days; the derived last plant for a Fall 28 harvest is 15. Last-plant dates are derived as 28 minus grow days, not a wiki field name. Read which mornings the tile is still occupied before you buy the next seed. The 18.89g and 16.92g cells stay on the table; they are not season totals drawn on this calendar.",
        "altStatus": "pending_media",
        "altDirection": "Calendar schematic of Fall 1–28 occupancy: cranberry picks on 8, 13, 18, 23, and 28, so Fall 14 morning the tile is still occupied; pumpkin 13-day cycle and derived last plant 15. Not a screenshot.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-2-grape-pumpkin-cranberry-bed",
        "assemblyToken": "FIGURE2_CONTROLLED_GRID",
        "workingFile": "public/blog/illustrations/fall-grape-pumpkin-cranberry-bed.webp",
        "src": "/blog/illustrations/fall-grape-pumpkin-cranberry-bed.webp",
        "placement": "Working H2-6 (## Put grapes, a pumpkin 3-by-3, and cranberry rows…). Lock has markdown image + following caption paragraph.",
        "type": "Controlled countable tile grid. Not a screenshot. Not an unverified planner capture.",
        "compositionNote": "One side: grape row plus at least one walking tile. One pumpkin 3-by-3 with the top-left cell marked, all nine pumpkin, no sprinkler or scarecrow inside the square. A cranberry rectangle that does not overlap those nine tiles and does not sit behind a grape wall. Show that a grape ring around the pumpkin is the failed layout.",
        "alt": "Bed grid schematic: grape row with a walk tile, pumpkin 3-by-3 with marked top-left, cranberry rectangle not behind grapes. Not a 1% giant already rolled.",
        "caption": "Occupancy on one bed, not a 1% giant already rolled. One side: a grape row plus at least one walking tile. One pumpkin 3-by-3 with the top-left cell marked, all nine pumpkin, no sprinkler or scarecrow inside the square. A cranberry rectangle that does not overlap those nine tiles and does not sit behind a grape wall. A grape ring around the pumpkin is the failed layout: you cannot walk through living grapes to water the top-left or to chop a giant. This grid uses the wiki trellis and giant rules.",
        "altStatus": "pending_media",
        "altDirection": "Bed grid schematic: grape row with a walk tile, pumpkin 3-by-3 with marked top-left, cranberry rectangle not behind grapes. Not a 1% giant already rolled.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      }
    ],
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a",
    "length": {
      "locale": "en",
      "mechanical_units": 4213,
      "required_floor": 2000,
      "meets_mechanical_floor": true,
      "excluded_heading_sections": [
        "FAQ",
        "Sources"
      ]
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "userReview": "not_started",
    "frozen": true,
    "status": "title_passed",
    "freezePublicBlogHandoff": true,
    "eReportedReaderBodySha256": "887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a",
    "cEnDraftFullFileSha256": "85a67e300ca1f5995a4cb63b0ccae45792d499f170eb3a4f8ff7e9e63dab1b06",
    "eTitleReviewFile": "docs/blog-ops/fall-crops-stardew/E-en-title-review.md"
  }
}
```
