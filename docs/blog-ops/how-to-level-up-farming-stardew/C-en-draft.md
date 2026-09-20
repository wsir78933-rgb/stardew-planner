# C-en draft: how-to-level-up-farming-stardew

Role: Agent C-en (writing only). English candidate reader body. Not D’s three gates. Not a pass verdict. Not Title / H1 / Description. Not `src/` or `public/` assembly. Facts from `A-en-facts.md` (2026-09-20) and H2 duties from `B-en-layout.md`. Working slug `how-to-level-up-farming-stardew`. locale=en, country=US. Keyword: how to level up farming stardew.

---

Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest), when you pet, milk, or shear animals or pick up a coop product, and when you read the [Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac) or [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars). Using a hoe or a watering can does not grant Farming XP by itself, so a sprinkler that waters the field does not replace the harvest as the way the skill moves. Open the skills tab, pick a named total—2,150 for level 5, 6,900 for 8, 10,000 for 9, or 15,000 for 10—and stack those harvests, 5-XP animal actions, and 250-XP books until the tab shows that level.

Numbers below follow the [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki) computer version **1.6.15**. Harvest XP, the crop table, and the lifetime-parsnip counts come from the [Farming](https://stardewvalleywiki.com/Farming) page. The shared 100…15,000 totals, the hoe and watering-can rule, and the overnight popup come from [Skills](https://stardewvalleywiki.com/Skills). No in-game harvest test was run for this article. Where a figure is arithmetic on those wiki numbers, it is marked derived.

## Farming XP comes from harvests, animals, and two books

[Farming](https://stardewvalleywiki.com/Farming) is the skill tied to planting, growing, and harvesting crops, and to the care of farm animals. The XP list on that page is narrower than the flavor sentence. To level the skill you need experience points, which are gained by harvesting crops, petting farm animals, milking cows or goats, shearing sheep, picking up animal products inside a coop, or reading the Stardew Valley Almanac or Book Of Stars.

That list is the map. Tilling a new tile, filling a watering can, and walking a sprinkler circuit are not on it. Turning milk into cheese is not on it. The [Experience Points](https://stardewvalleywiki.com/Farming#Experience_Points) section then splits harvest XP from animal XP from book XP, and it is strict about extra produce.

More expensive crops give more experience on harvest. Crops with multiple harvests give experience for every harvest. Crops that yield several items in one harvest, such as blueberry, cranberry, or potato, only reward experience for the first product and do not offer any extra experience for the multiples.

![Rule diagram of Farming XP sources versus non-sources: harvest of the first product, animal pet/milk/shear/coop pickup at 5 XP, Almanac and Book Of Stars at 250 XP each; hoe, watering can, sprinkler watering, extra berries or potatoes, and truffles do not grant Farming XP. Not a game screenshot.](/blog/illustrations/farming-xp-source-map.webp)

Farming XP sources and non-sources, from the Farming and Skills pages, not from a harvest test. Harvest of the first product grants crop XP. Petting, milking, shearing, or picking up a coop product grants 5 XP. The Almanac and the Book Of Stars grant 250 Farming XP each. A hoe swing, a watering-can swing, and a sprinkler’s morning water do not grant Farming XP. Extra berries and extra potatoes on the same harvest do not add XP. Truffles grant Foraging XP, not Farming. If you only water and never harvest, the skills tab does not move.

### Watering and hoeing do not grant Farming XP

The [Skills](https://stardewvalleywiki.com/Skills) Farming subsection states the tool rule in one sentence: using a hoe or watering can does not grant experience by itself. Farming skill is gained by harvesting crops, by the 5-XP animal actions, and by reading those two books. Each Farming level also grants +1 proficiency to hoes and watering cans. Proficiency makes those tools cheaper in energy after the level already happened. It does not mean the swing that used the tool paid the XP.

A sprinkler does not change that split. It waters tilled tiles in the morning so the plant can grow. The XP event is still the harvest. A field that a [Sprinkler](https://stardewvalleywiki.com/Sprinkler), [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler), or [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) kept wet still levels Farming when you pick the crop. A field you water by hand every day, then never harvest, does not. The worry that automation “steals” Farming XP mixes the watering action with the harvest action. Watering is not the XP action.

Suppose, as a design example, you hoe and water forty tiles every morning and leave every crop in the ground. The hoe and can themselves add 0 Farming XP. The forty plants add XP on the morning you actually pick them. That is the Skills sentence applied to a grid, not a timed test.

After Farming 2, 6, or 9, the matching sprinkler recipe unlocks. How far each tier reaches, which tiles it misses, and where rain does not count are in the [sprinkler guide](/sprinkler-stardew).

### Extra potatoes, blueberries, and cranberries do not add XP

Two harvest rules sit next to each other and get swapped in the field.

Crops with several harvest dates give XP on every harvest. A green bean, hops plant, blueberry bush, or cranberry plant that you pick this week and again later pays the crop’s harvest XP each time.

Crops that drop several items in one pull pay once. The Farming page names blueberry, cranberry, and potato. The extra berries and the extra tuber are extra gold, extra shipping, extra inventory. They are not extra Farming XP.

Quality does not change the XP. High-quality crops grant the same amount of XP as normal-quality crops. A gold cauliflower is still 23 Farming XP on the spring table, not a larger skill grant. Food that temporarily pushes displayed Farming above 10 can change quality rolls. Those buffs are not extra lifetime XP, and they do not rewrite the harvest XP cell.

The page prints the formula after the seasonal tables: `XP = ||16 × ln(0.018 × PRICE + 1)||`, where PRICE is the crop’s base sell price. The double bars are the wiki’s notation. This article did not open the game’s `Data/Objects.xnb` file. Use the printed per-harvest table rather than recomputing the logarithm by hand. The formula is why a high-sell crop such as [starfruit](https://stardewvalleywiki.com/Farming#Experience_Points) sits at 43 and a cheap coffee bean sits at 4. Quality does not enter PRICE.

![One blueberry, cranberry, or potato harvest: the first product is marked as Farming XP, the extra berries or extra tuber are marked as no Farming XP. Not a game screenshot.](/blog/illustrations/farming-xp-first-product-only.webp)

First product only, on one harvest. A blueberry pull that yields three berries still grants 10 Farming XP once. A cranberry pull that yields two berries still grants 14 once. A potato pull that yields an extra tuber still grants 14 once. The next harvest date on a blueberry or cranberry plant is a new harvest, and that new harvest grants XP again. This is the Farming page rule, not a count of berries in a test save.

### Animals are 5 XP; the Almanac and Book of Stars are 250

Petting a farm animal, milking a cow or goat, shearing a sheep, or picking up an animal product inside a coop gives 5 experience points each. The Skills page includes barn pickup in that same 5-XP list. The grant is 5 XP per action, not a daily lump per building.

Picking up truffles gives Foraging experience rather than Farming experience. A pig can still be petted for 5 Farming XP. The truffle on the ground is a different skill.

Five XP is small next to a cauliflower at 23, and it is the winter-and-evening valve when harvests thin out. Fifty pet or product actions are 250 XP. That 250 is derived (50 × 5), not a wiki named bundle, and it equals one unread [Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac).

The Almanac and the Book Of Stars are two books. Do not treat them as one item with two names.

Upon reading a copy of the Almanac, you earn 250 Farming XP. The Almanac infobox lists sources that include the Bookseller, the Traveling Cart, fishing treasure chests, Mayor’s Manor, mystery boxes, golden mystery boxes, monsters, crates and barrels, trees, and artifact spots. That is a source list, not a drop-rate table.

Upon reading the [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars), you earn 250 XP in all skills. If you have already reached level 10 in all skills, you earn 1,125 Mastery points instead. Mastery is a different track. While Farming is still below 10, the Book Of Stars is a 250 Farming XP read that also feeds the other skills. The Bookseller price on that page is 15,000g, with a 25% chance for the book to appear.

The Farming page history records that 1.6 added Farming experience from those two books. Harvesting with a scythe also grants Farming XP on the current page; the same history notes a 1.3.27 fix for a bug that blocked that grant. Read an unread copy once. A second copy of the same book is a separate item to read, not a second name for the first copy.

## How much XP each Farming level takes

All five skills use the same totals on the [Skills](https://stardewvalleywiki.com/Skills) page. Farming does not have a private curve. The cumulative XP to stand on each level is 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, and 15,000.

The Farming page also prints a lifetime-parsnip column for those same totals, so you can see the scale in one crop. Other crops differ. Overnight unlocks below are names from the Farming skill table and from the item pages: recipe or profession names, not craft ingredients.

| Level | Total XP | Lifetime parsnips (wiki) | Overnight unlock |
|---|---|---|---|
| 1 | 100 | 13 | — |
| 2 | 380 | 48 | [Sprinkler](https://stardewvalleywiki.com/Sprinkler) |
| 3 | 770 | 97 | — |
| 4 | 1,300 | 163 | Preserves Jar |
| 5 | 2,150 | 269 | Choose a Profession |
| 6 | 3,300 | 413 | [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler) |
| 7 | 4,800 | 600 | — |
| 8 | 6,900 | 863 | [Keg](https://stardewvalleywiki.com/Keg) |
| 9 | 10,000 | 1,250 | [Seed Maker](https://stardewvalleywiki.com/Seed_Maker), [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) |
| 10 | 15,000 | 1,875 | Choose a Profession |

The overnight names this table uses are the sprinkler recipes at 2, 6, and 9, the preserves jar at 4, the keg at 8, the Seed Maker at 9, and the profession clicks at 5 and 10. Levels 1, 3, and 7 still sit on the XP totals. Once a sprinkler recipe exists, placement is the [sprinkler guide](/sprinkler-stardew). The Farming 5 popup names Tiller and Rancher, and that click locks the Farming 10 pair; work the click on [Rancher or Tiller](/rancher-or-tiller-stardew).

For a first magnitude check, the Farming Experience Points section already converts the early totals into plants: from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers. Derived from those wiki cells, 13 parsnips × 8 XP = 104, which is the first lifetime-parsnip count that exceeds 100. Five cauliflowers × 23 XP = 115, and eight potatoes × 14 XP = 112. Those three products are arithmetic on the printed numbers, not a harvest log.

The last step is the steep one. Skills lists the increment from 9 to 10 as +5,000 XP, from a 10,000 total to 15,000. The parsnip column moves from 1,250 to 1,875, which is 625 more parsnip harvests (derived: 1,875 − 1,250). Name the gate on the table before you plant for it.

### The skills tab updates now; recipes wait until morning

Experience is added when the harvest (or the 5-XP action, or the book) happens. A skill level increase is awarded immediately once the total is enough, and it is immediately displayed on the skills tab of the inventory. The level-up window does not appear until after you sleep.

The first time you level a skill on a given day, the game notifies you with “You've got some new ideas to sleep on.” Overnight, after you go to bed on a day a skill level increased, a popup announces the increase and awards knowledge of any applicable crafting or cooking recipes. At level 5 and level 10, that popup also asks you to choose a profession. Recipe knowledge and profession benefits are not available until the first thing the following morning. Items sold or shipped the day of the increase do not receive the new price bonuses.

That split is the check.

1. Harvest, pet, milk, shear, pick up a coop product, or read a book.
2. Open the skills tab the same day and read the Farming level that is already there.
3. Sleep. The popup is where the new recipe appears, and where the profession click appears at 5 and 10.
4. If Farming hit 5 in the afternoon and you care about the new sell bonus, park high-value stacks until morning. The profession page walks that click.

If the skills tab already shows the level you named, the XP work for that gate is done. The recipe still waits for the popup.

## Harvest for Farming XP, not for gold per day

Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules. It is not a harvest-XP ranking. Extra berries that help a gold/day cell do not help the Farming XP cell. Use the Farming Experience Points tables for the skill, and use those seasonal pages when the job is gold.

The short table below is per harvest of the first product. Each later harvest of a multi-harvest crop grants that same XP again. Extra potatoes, blueberries, and cranberries on one pull do not. Quality does not change the number. These cells are not gold per day, and they are not XP per day: grow time is not a column, and the table does not name a fastest crop.

| Crop | XP per harvest (first product) | Why it is on this table |
|---|---|---|
| Parsnip | 8 | Wiki 0→1 and lifetime scale |
| Potato | 14 | Extra tubers do not add XP |
| Kale | 17 | Spring crop; 17 sits below cauliflower on the same table |
| Cauliflower | 23 | Same spring table; 23 per harvest |
| Strawberry | 18 | High per-harvest XP; not a Spring 1 Pierre default |
| Green Bean | 9 | Each later harvest still grants 9 |
| Wheat | 6 | Low per-harvest XP |
| Hops | 6 | Low per-harvest XP; each later harvest still grants 6 |
| Coffee Bean | 4 | Cheap seed is not high XP |
| Blueberry | 10 | Extra berries do not add XP |
| Poppy | 20 | Summer flower at 20 per harvest |
| Melon | 27 | Summer high per-harvest XP |
| Starfruit | 43 | High summer-table XP |
| Amaranth | 21 | Fall crop at 21 per harvest |
| Bok Choy | 14 | Fall crop at 14 per harvest |
| Cranberries | 14 | Extra berries do not add XP |
| Pumpkin | 31 | Fall high per-harvest XP |
| Sweet Gem Berry | 64 | Highest cell on the Farming XP tables; not a Pierre default packet |
| Ancient Fruit | 38 | High XP; not a seasonal Pierre packet |
| Powdermelon | 12 | Only crop row on the winter XP table |

All XP cells are from the Farming page seasonal tables.

Cauliflower at 23 is higher per harvest than kale at 17 on that same spring table. Wheat at 6 and hops at 6 are low per pull. Coffee bean at 4 is the lowest cell on this short list. None of those comparisons is XP per day. The table has no grow-time column, so it cannot name a fastest crop. A kale ranking that needed grow time, energy, and seed cost would be a different sheet.

Starfruit at 43 versus cranberry extras splits the two jobs. Starfruit is a high per-harvest Farming XP crop. Cranberries pay 14 XP once per harvest, then pay again on the next harvest date; the extra berry in the same pull is gold, priced on the fall gold/day page, and 0 extra Farming XP. Blueberry is the summer version of that split: 10 XP for the first berry, no XP for the extras, gold/day on the summer page. Potato is the spring version: 14 XP, extra tuber ignored by the skill.

Sweet Gem Berry at 64 is the highest value on the Farming XP tables. It is not Pierre’s default packet. Ancient Fruit at 38 is high and is not a seasonal Pierre packet either. Strawberry at 18 is a high spring harvest; the [spring crop guide](/best-spring-crop-stardew) is the shop-gate page for that seed, including the fact that Year 1 cannot buy strawberries on Spring 1.

If the job is stacking Farming XP:

- Prefer a harvest whose first product is a higher XP cell when you actually hold that seed.
- Count harvest events. A hops plant at 6 XP that you pick many times still pays 6 each time. A potato at 14 that drops two tubers still pays 14 once.
- Do not plant extra berries to “speed the skill.” They speed the shipping box, not the XP bar.
- When seed gold or watering energy is the limit, use the 5-XP animal actions and the 250-XP books. The wet-tile ceiling and the gold you can spend this morning are the same constraint as in [how to earn money](/how-to-earn-money-stardew).

Derived, for the 100 XP that reaches level 1: Kale at 17 XP needs 6 harvests to pass 100 (derived: 6 × 17 = 102). Wheat at 6 XP needs 17 harvests (derived: 17 × 6 = 102). Those products compare plant counts to a total, not days in the ground.

## Winter: outdoor harvest XP almost stops

[Winter](https://stardewvalleywiki.com/Winter) is the season where almost no outdoor crop grows. The winter page names three outdoor plantables: Powdermelon Seeds, Winter Seeds, and Fiber Seeds. With ordinary plant growth stopped, it treats animal produce and the [greenhouse](/glasshouse-stardew-valley) as the mainstay of farm produce.

The Farming XP winter table has one crop row: powdermelon at 12 XP. That is the outdoor harvest XP that table scores in winter.

[Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds) do not print a Farming XP number on their own page. They also have no row on the Farming winter XP table. The Farming page and the Winter page disagree about whether wild-seed plants grant Farming XP, so there is no Winter Seeds or Wild Seeds Farming XP figure here, including 3 and including 0. Fiber Seeds can be planted in winter and do not need daily watering; that page is silent on Farming XP, so they get no XP number here either.

The rest of the source map still works.

Animals still grant 5 XP per pet, milking, shearing, or coop pickup. Truffles are still Foraging. An unread Almanac is still 250 Farming XP. An unread Book Of Stars is still 250 XP in every skill that is not already 10. Greenhouse plants still grant harvest XP on the first product of each harvest, including ancient fruit at 38 if that is what is in the bed. Indoor beds that keep producing in winter are the [greenhouse page](/glasshouse-stardew-valley).

Powdermelon at 12 is a winter harvest, not a gold/day argument. The winter page also prints a gold/day cell for it; that cell is not XP. If you have powdermelon seeds, each harvest is 12 Farming XP on that table. If you do not, winter leveling is animals, books, and whatever still harvests inside.

Winter is not an empty XP season on the current wiki: one winter XP-table crop at 12, books at 250, animals at 5, and greenhouse harvests remain on the source list. That is the 1.6.15 wiki reading, not a timed winter playthrough.

Before you sleep, open the skills tab and read the Farming level that is already there. If it is the gate you named—5 at 2,150, 8 at 6,900, 9 at 10,000, 10 at 15,000—the XP for that gate is done and the popup still has to fire. If it is not, count the next first-product harvests, the 5-XP animal actions, and any unread Almanac or Book Of Stars against the remaining total. Do not count extra berries, extra potatoes, truffles, hoe swings, or watering-can swings.

## Sources

Checked 2026-09-20 against Stardew Valley Wiki Farming (including Experience Points), Skills, Stardew Valley Almanac, Book Of Stars, Keg, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Seed Maker, Winter, and Winter Seeds. The wiki home names computer version 1.6.15. Winter Seeds Farming XP is not used: the Farming page and the Winter page disagree, and the Winter Seeds page does not print a number. No in-game harvest test was run. This site’s planner is a layout tool; it does not compute Farming XP or skill levels.

- [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki)
- [Stardew Valley Wiki: Farming](https://stardewvalleywiki.com/Farming)
- [Stardew Valley Wiki: Farming (Experience Points)](https://stardewvalleywiki.com/Farming#Experience_Points)
- [Stardew Valley Wiki: Skills](https://stardewvalleywiki.com/Skills)
- [Stardew Valley Wiki: Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac)
- [Stardew Valley Wiki: Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars)
- [Stardew Valley Wiki: Keg](https://stardewvalleywiki.com/Keg)
- [Stardew Valley Wiki: Sprinkler](https://stardewvalleywiki.com/Sprinkler)
- [Stardew Valley Wiki: Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)
- [Stardew Valley Wiki: Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)
- [Stardew Valley Wiki: Seed Maker](https://stardewvalleywiki.com/Seed_Maker)
- [Stardew Valley Wiki: Winter](https://stardewvalleywiki.com/Winter)
- [Stardew Valley Wiki: Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds)
- [This site: Rancher or Tiller](https://stardewvalleyplanner.art/rancher-or-tiller-stardew)
- [This site: sprinklers](https://stardewvalleyplanner.art/sprinkler-stardew)
- [This site: Year 1 gold](https://stardewvalleyplanner.art/how-to-earn-money-stardew)
- [This site: spring crops](https://stardewvalleyplanner.art/best-spring-crop-stardew)
- [This site: summer crops](https://stardewvalleyplanner.art/summer-crops-stardew)
- [This site: fall crops](https://stardewvalleyplanner.art/fall-crops-stardew)
- [This site: greenhouse](https://stardewvalleyplanner.art/glasshouse-stardew-valley)

## Editor appendix (not reader body)

Not a D/E pass. Not Length. Not Title/H1/Description. JSON-LD remains Article, not FAQPage. Working slug `how-to-level-up-farming-stardew`. Tool association: none (B §8). No FAQ H2 (B §10). No planner step in the reader body. Cover is G assembly, not this reader body.

Crop-name mentions in the reader body that are not standalone wiki item tabs use the opened Farming Experience Points tables (K15–K58) as the number source. Canonical item URLs were not required by B §11 except where the item page itself was opened (Almanac, Book Of Stars, Keg, three sprinklers, Seed Maker, Winter Seeds).

### PublicReference

Verification date 2026-09-20. Only URLs Agent A opened. Quotes are exact reader-body strings. `occurrence` is 1-based among identical strings in the reader body (from the first reader paragraph through the Sources list, before this appendix).

| id | label | url | appliesTo |
|---|---|---|---|
| wiki-home | Stardew Valley Wiki | https://stardewvalleywiki.com/Stardew_Valley_Wiki | `[{quote: "Numbers below follow the [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki) computer version **1.6.15**.", occurrence: 1}]` |
| wiki-farming | Stardew Valley Wiki: Farming | https://stardewvalleywiki.com/Farming | `[{quote: "[Farming](https://stardewvalleywiki.com/Farming) is the skill tied to planting, growing, and harvesting crops, and to the care of farm animals.", occurrence: 1}, {quote: "To level the skill you need experience points, which are gained by harvesting crops, petting farm animals, milking cows or goats, shearing sheep, picking up animal products inside a coop, or reading the Stardew Valley Almanac or Book Of Stars.", occurrence: 1}, {quote: "Harvesting with a scythe also grants Farming XP on the current page; the same history notes a 1.3.27 fix for a bug that blocked that grant.", occurrence: 1}]` |
| wiki-farming-xp | Stardew Valley Wiki: Farming (Experience Points) | https://stardewvalleywiki.com/Farming#Experience_Points | `[{quote: "More expensive crops give more experience on harvest. Crops with multiple harvests give experience for every harvest. Crops that yield several items in one harvest, such as blueberry, cranberry, or potato, only reward experience for the first product and do not offer any extra experience for the multiples.", occurrence: 1}, {quote: "High-quality crops grant the same amount of XP as normal-quality crops.", occurrence: 1}, {quote: "`XP = ||16 × ln(0.018 × PRICE + 1)||`, where PRICE is the crop’s base sell price.", occurrence: 1}, {quote: "from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers.", occurrence: 1}]` |
| wiki-skills | Stardew Valley Wiki: Skills | https://stardewvalleywiki.com/Skills | `[{quote: "using a hoe or watering can does not grant experience by itself.", occurrence: 1}, {quote: "Each Farming level also grants +1 proficiency to hoes and watering cans.", occurrence: 1}, {quote: "The cumulative XP to stand on each level is 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, and 15,000.", occurrence: 1}, {quote: "The first time you level a skill on a given day, the game notifies you with “You've got some new ideas to sleep on.”", occurrence: 1}, {quote: "Items sold or shipped the day of the increase do not receive the new price bonuses.", occurrence: 1}]` |
| wiki-almanac | Stardew Valley Wiki: Stardew Valley Almanac | https://stardewvalleywiki.com/Stardew_Valley_Almanac | `[{quote: "Upon reading a copy of the Almanac, you earn 250 Farming XP.", occurrence: 1}, {quote: "The Almanac infobox lists sources that include the Bookseller, the Traveling Cart, fishing treasure chests, Mayor’s Manor, mystery boxes, golden mystery boxes, monsters, crates and barrels, trees, and artifact spots.", occurrence: 1}]` |
| wiki-book-of-stars | Stardew Valley Wiki: Book Of Stars | https://stardewvalleywiki.com/Book_Of_Stars | `[{quote: "Upon reading the [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars), you earn 250 XP in all skills. If you have already reached level 10 in all skills, you earn 1,125 Mastery points instead.", occurrence: 1}, {quote: "The Bookseller price on that page is 15,000g, with a 25% chance for the book to appear.", occurrence: 1}]` |
| wiki-keg | Stardew Valley Wiki: Keg | https://stardewvalleywiki.com/Keg | `[{quote: "| 8 | 6,900 | 863 | [Keg](https://stardewvalleywiki.com/Keg) |", occurrence: 1}]` |
| wiki-sprinkler | Stardew Valley Wiki: Sprinkler | https://stardewvalleywiki.com/Sprinkler | `[{quote: "A field that a [Sprinkler](https://stardewvalleywiki.com/Sprinkler), [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler), or [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) kept wet still levels Farming when you pick the crop.", occurrence: 1}]` |
| wiki-quality-sprinkler | Stardew Valley Wiki: Quality Sprinkler | https://stardewvalleywiki.com/Quality_Sprinkler | `[{quote: "[Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)", occurrence: 1}]` |
| wiki-iridium-sprinkler | Stardew Valley Wiki: Iridium Sprinkler | https://stardewvalleywiki.com/Iridium_Sprinkler | `[{quote: "[Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)", occurrence: 1}]` |
| wiki-seed-maker | Stardew Valley Wiki: Seed Maker | https://stardewvalleywiki.com/Seed_Maker | `[{quote: "[Seed Maker](https://stardewvalleywiki.com/Seed_Maker), [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)", occurrence: 1}]` |
| wiki-winter | Stardew Valley Wiki: Winter | https://stardewvalleywiki.com/Winter | `[{quote: "The winter page names three outdoor plantables: Powdermelon Seeds, Winter Seeds, and Fiber Seeds.", occurrence: 1}, {quote: "With ordinary plant growth stopped, it treats animal produce and the [greenhouse](/glasshouse-stardew-valley) as the mainstay of farm produce.", occurrence: 1}]` |
| wiki-winter-seeds | Stardew Valley Wiki: Winter Seeds | https://stardewvalleywiki.com/Winter_Seeds | `[{quote: "[Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds) do not print a Farming XP number on their own page.", occurrence: 1}, {quote: "The Farming page and the Winter page disagree about whether wild-seed plants grant Farming XP, so there is no Winter Seeds or Wild Seeds Farming XP figure here, including 3 and including 0.", occurrence: 1}]` |
| planner-rancher | This site: Rancher or Tiller | https://stardewvalleyplanner.art/rancher-or-tiller-stardew | `[{quote: "The Farming 5 popup names Tiller and Rancher, and that click locks the Farming 10 pair; work the click on [Rancher or Tiller](/rancher-or-tiller-stardew).", occurrence: 1}]` |
| planner-sprinkler | This site: sprinklers | https://stardewvalleyplanner.art/sprinkler-stardew | `[{quote: "How far each tier reaches, which tiles it misses, and where rain does not count are in the [sprinkler guide](/sprinkler-stardew).", occurrence: 1}]` |
| planner-money | This site: Year 1 gold | https://stardewvalleyplanner.art/how-to-earn-money-stardew | `[{quote: "The wet-tile ceiling and the gold you can spend this morning are the same constraint as in [how to earn money](/how-to-earn-money-stardew).", occurrence: 1}]` |
| planner-spring | This site: spring crops | https://stardewvalleyplanner.art/best-spring-crop-stardew | `[{quote: "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.", occurrence: 1}]` |
| planner-summer | This site: summer crops | https://stardewvalleyplanner.art/summer-crops-stardew | `[{quote: "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.", occurrence: 1}]` |
| planner-fall | This site: fall crops | https://stardewvalleyplanner.art/fall-crops-stardew | `[{quote: "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.", occurrence: 1}]` |
| planner-greenhouse | This site: greenhouse | https://stardewvalleyplanner.art/glasshouse-stardew-valley | `[{quote: "Indoor beds that keep producing in winter are the [greenhouse page](/glasshouse-stardew-valley).", occurrence: 1}]` |

Table-row XP values bind to wiki-farming-xp (K15–K58), not to unopened crop item pages. Level totals bind to wiki-skills (K10). Lifetime parsnips bind to wiki-farming (K11). Keg / sprinkler / Seed Maker unlock names bind to those item pages plus K14.

### Fact ID map (numeric and rule claims)

| Claim in reader body | Fact ID | Type |
|---|---|---|
| XP source list (harvest, pet, milk, shear, coop pickup, two books) | K2 | 主题知识 |
| Extra produce on one harvest does not add XP; multi-harvest each harvest does | K3 | 主题知识 |
| Animal actions 5 XP; truffles Foraging | K4 | 主题知识 |
| Almanac or Book Of Stars 250 Farming XP (Farming page) | K5 | 主题知识 |
| 0→1: 13 parsnips / 8 potatoes / 5 cauliflowers; 0→2 about 48 / 28 / 17 | K6 | 主题知识 |
| Formula; quality does not change XP; game code not opened | K7 | 主题知识 |
| XP immediate on harvest; window after sleep | K8 | 主题知识 |
| Hoe/can do not grant XP by themselves; +1 proficiency per level | K9 | 主题知识 |
| Totals 100…15000; +5000 from 9 to 10 | K10 | 主题知识 |
| Lifetime parsnips 13…1875 | K11 | 主题知识 |
| Skills tab now; overnight popup; profession at 5/10; same-day shipping no new bonus | K12 | 主题知识 |
| Tiller / Rancher named at 5 | K13 | 主题知识 (name only; choice method is T3) |
| Unlocks: Sprinkler 2, Preserves Jar 4, Quality 6, Keg 8, Seed Maker + Iridium 9 | K14, K61–K65 | 主题知识 |
| Crop XP short table | K15–K20a, K21, K30, K31, K34, K40, K41, K43, K48, K49, K52, K56–K58 | 主题知识 |
| Almanac 250 and infobox sources | K59 | 主题知识 |
| Book Of Stars 250 all skills; 1,125 Mastery if all 10; 15,000g 25% | K60 | 主题知识 |
| Winter plantables; animals + greenhouse as produce | K66 | 主题知识 |
| Winter Seeds page has no Farming XP number | K68 | 主题知识 |
| Fiber Seeds silent on XP | K69 | 主题知识 |
| Computer 1.6.15 | K70 | 主题知识 |
| 1.6 books; 1.3.27 scythe XP fix; Wild Seeds 3 not published (U1) | K71, U1 | 主题知识 / conflict |
| Food buffs ≠ lifetime XP | K72 | 主题知识 |
| 13×8=104; 5×23=115; 8×14=112; 6×17=102; 17×6=102; 1875−1250=625; 50×5=250 | A4 and labeled derived | 分析判断 |
| Gold/day pages are sell rankings not XP | T11–T13, A2 | 工具事实 / 分析 |
| Profession page job | T3 | 工具事实 |
| Sprinkler page job | T4 | 工具事实 |
| Money page wet-tile / gold constraint | T5 | 工具事实 |
| Greenhouse indoor harvest path | T14 | 工具事实 |
| Planner does not compute Farming XP (Sources only) | T1, A6 | 工具事实 |
| Cauliflower 23 vs kale 17 is per-harvest, not XP/day | A3 | 分析判断 |
| Winter after 1.6 is not the old “nothing grows” threads | A5 | 分析判断 |
| Winter Seeds / Wild Seeds XP number unpublished | U1 | conflict |
| Keg profit omitted | U2 | incomplete |
| YouTube omitted | U3 | incomplete |
| PAA answers omitted | U4 | 未取得 |

### Figure slot notes

Cover is G assembly, not this reader body.

| ID | Path in reader body | Type | Facts | Alt job | Caption job |
|---|---|---|---|---|---|
| Fig 1 | `/blog/illustrations/farming-xp-source-map.webp` after the K2/K3 source paragraphs in H2-1 | Accurate schematic (controlled drawing). Not a screenshot. Not planner UI. | K2, K3, K4, K5, K9 | Two groups: grants (first-product harvest; pet/milk/shear/coop pickup 5; Almanac and Book Of Stars 250) vs does not (hoe, watering can, sprinkler watering, extra berries/potatoes, truffles as Foraging). Reader can see that watering-only does not level. | Rule diagram, not a test. Sprinklers still grant XP through harvest. |
| Fig 2 | `/blog/illustrations/farming-xp-first-product-only.webp` in the extra-produce H3 | Accurate schematic (controlled drawing). Not a screenshot. | K3, K16, K34, K49 | One harvest of blueberry / cranberry / potato: first product marked XP, extras marked no XP. | First product per harvest; a later harvest date still grants. |

Figure text may use only verified names and numbers: 5, 250, 10 (blueberry), 14 (cranberry, potato). Do not draw Winter Seeds XP, XP/day, keg profit, profession trees, sprinkler 4/8/24 coverage, greenhouse 10×12, or a fake skills-tab screenshot.

### Facts refused (not invented)

1. Crop grow times / XP per day (G1, A3). No “fastest crop,” no kale-as-wiki-fastest.
2. Winter Seeds / Wild Seeds / Fiber Seeds Farming XP number (U1, G2). Body states the conflict and the missing print; does not pick 3 or 0.
3. YouTube `Aoced1dKRUg` steps (U3, G3).
4. Unopened PAA accordion answers (U4, G4).
5. Skills-tab / overnight-popup screenshot (G5). Check is K8/K12 prose.
6. Mastery full section (G6). K60 one appositive only.
7. Watering Cans page survival rules (G7). Only Skills K9 XP sentence.
8. Planner as an XP step (G8, B §8). Sources note only.
9. Keg profit (U2). Unlock name only.
10. Full four-season XP encyclopedia (K15–K58 unused rows).
11. Profession sell percents / mayonnaise 228g vs 266g (T3 job).
12. Sprinkler coverage tiles, pressure nozzle, beach sand (T4 job).
13. Year 1 calendar to 8/9 (I3).
14. Scarecrow / other unextracted level-1/3/7 recipe names. Unlock column left blank.
15. Fiber Seeds page URL as a number source.
16. Hypixel Skyblock.
