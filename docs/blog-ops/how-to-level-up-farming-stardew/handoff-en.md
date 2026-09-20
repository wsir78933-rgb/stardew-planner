# PublicBlogHandoff (en) — title_passed, frozen

- type: `PublicBlogHandoff`
- status: **title_passed** (`freezePublicBlogHandoff`. E title review PASS, must-fix 0, bound hash `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`)
- role: Agent F-en. Title pass signed by E, see `E-en-title-review.md`
- lockVersion: `2026-09-20-en-how-to-level-up-farming-lock-1`
- locale / country: `en` / `US`
- bodyHash: `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`
- lock file: `locked/en-body.txt` (same bytes as JSON `body`)
- count: mechanical_units **2863** (en words, Sources / FAQ excluded), ≥2000
- D body: PASS; E body: PASS; E title: PASS; user review: not started (content-only; waits for the live site page)
- Public references from C appendix `PublicReference`; quotes exist in the locked body; `occurrence` is C’s first-instance index
- Freeze did not change locked body, hash, Title, H1, Description, or slug. Did not write `src/`, `app/`, or `public/`. JSON-LD stays Article, not FAQPage. No FAQ H2

JSON below is the handoff object. `body` is the locked reader markdown (H2/H3, Sources, and in-body links), NFC, UTF-8, LF, no trailing blank line. Public fields contain no retrieval logs.

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-20-en-how-to-level-up-farming-lock-1",
  "locale": "en",
  "country": "US",
  "body": "Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest), when you pet, milk, or shear animals or pick up a coop product, and when you read the [Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac) or [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars). Using a hoe or a watering can does not grant Farming XP by itself, so a sprinkler that waters the field does not replace the harvest as the way the skill moves. Open the skills tab, pick a named total—2,150 for level 5, 6,900 for 8, 10,000 for 9, or 15,000 for 10—and stack those harvests, 5-XP animal actions, and 250-XP books until the tab shows that level.\n\nNumbers below follow the [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki) computer version **1.6.15**. Harvest XP, the crop table, and the lifetime-parsnip counts come from the [Farming](https://stardewvalleywiki.com/Farming) page. The shared 100…15,000 totals, the hoe and watering-can rule, and the overnight popup come from [Skills](https://stardewvalleywiki.com/Skills). No in-game harvest test was run for this article. Where a figure is arithmetic on those wiki numbers, it is marked derived.\n\n## Farming XP comes from harvests, animals, and two books\n\n[Farming](https://stardewvalleywiki.com/Farming) is the skill tied to planting, growing, and harvesting crops, and to the care of farm animals. The XP list on that page is narrower than the flavor sentence. To level the skill you need experience points, which are gained by harvesting crops, petting farm animals, milking cows or goats, shearing sheep, picking up animal products inside a coop, or reading the Stardew Valley Almanac or Book Of Stars.\n\nThat list is the map. Tilling a new tile, filling a watering can, and walking a sprinkler circuit are not on it. Turning milk into cheese is not on it. The [Experience Points](https://stardewvalleywiki.com/Farming#Experience_Points) section then splits harvest XP from animal XP from book XP, and it is strict about extra produce.\n\nMore expensive crops give more experience on harvest. Crops with multiple harvests give experience for every harvest. Crops that yield several items in one harvest, such as blueberry, cranberry, or potato, only reward experience for the first product and do not offer any extra experience for the multiples.\n\n![Rule diagram of Farming XP sources versus non-sources: harvest of the first product, animal pet/milk/shear/coop pickup at 5 XP, Almanac and Book Of Stars at 250 XP each; hoe, watering can, sprinkler watering, extra berries or potatoes, and truffles do not grant Farming XP. Not a game screenshot.](/blog/illustrations/farming-xp-source-map.webp)\n\nFarming XP sources and non-sources, from the Farming and Skills pages, not from a harvest test. Harvest of the first product grants crop XP. Petting, milking, shearing, or picking up a coop product grants 5 XP. The Almanac and the Book Of Stars grant 250 Farming XP each. A hoe swing, a watering-can swing, and a sprinkler’s morning water do not grant Farming XP. Extra berries and extra potatoes on the same harvest do not add XP. Truffles grant Foraging XP, not Farming. If you only water and never harvest, the skills tab does not move.\n\n### Watering and hoeing do not grant Farming XP\n\nThe [Skills](https://stardewvalleywiki.com/Skills) Farming subsection states the tool rule in one sentence: using a hoe or watering can does not grant experience by itself. Farming skill is gained by harvesting crops, by the 5-XP animal actions, and by reading those two books. Each Farming level also grants +1 proficiency to hoes and watering cans. Proficiency makes those tools cheaper in energy after the level already happened. It does not mean the swing that used the tool paid the XP.\n\nA sprinkler does not change that split. It waters tilled tiles in the morning so the plant can grow. The XP event is still the harvest. A field that a [Sprinkler](https://stardewvalleywiki.com/Sprinkler), [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler), or [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) kept wet still levels Farming when you pick the crop. A field you water by hand every day, then never harvest, does not. The worry that automation “steals” Farming XP mixes the watering action with the harvest action. Watering is not the XP action.\n\nSuppose, as a design example, you hoe and water forty tiles every morning and leave every crop in the ground. The hoe and can themselves add 0 Farming XP. The forty plants add XP on the morning you actually pick them. That is the Skills sentence applied to a grid, not a timed test.\n\nAfter Farming 2, 6, or 9, the matching sprinkler recipe unlocks. How far each tier reaches, which tiles it misses, and where rain does not count are in the [sprinkler guide](/sprinkler-stardew).\n\n### Extra potatoes, blueberries, and cranberries do not add XP\n\nTwo harvest rules sit next to each other and get swapped in the field.\n\nCrops with several harvest dates give XP on every harvest. A green bean, hops plant, blueberry bush, or cranberry plant that you pick this week and again later pays the crop’s harvest XP each time.\n\nCrops that drop several items in one pull pay once. The Farming page names blueberry, cranberry, and potato. The extra berries and the extra tuber are extra gold, extra shipping, extra inventory. They are not extra Farming XP.\n\nQuality does not change the XP. High-quality crops grant the same amount of XP as normal-quality crops. A gold cauliflower is still 23 Farming XP on the spring table, not a larger skill grant. Food that temporarily pushes displayed Farming above 10 can change quality rolls. Those buffs are not extra lifetime XP, and they do not rewrite the harvest XP cell.\n\nThe page prints the formula after the seasonal tables: `XP = ||16 × ln(0.018 × PRICE + 1)||`, where PRICE is the crop’s base sell price. The double bars are the wiki’s notation. This article did not open the game’s `Data/Objects.xnb` file. Use the printed per-harvest table rather than recomputing the logarithm by hand. The formula is why a high-sell crop such as [starfruit](https://stardewvalleywiki.com/Farming#Experience_Points) sits at 43 and a cheap coffee bean sits at 4. Quality does not enter PRICE.\n\n![One blueberry, cranberry, or potato harvest: the first product is marked as Farming XP, the extra berries or extra tuber are marked as no Farming XP. Not a game screenshot.](/blog/illustrations/farming-xp-first-product-only.webp)\n\nFirst product only, on one harvest. A blueberry pull that yields three berries still grants 10 Farming XP once. A cranberry pull that yields two berries still grants 14 once. A potato pull that yields an extra tuber still grants 14 once. The next harvest date on a blueberry or cranberry plant is a new harvest, and that new harvest grants XP again. This is the Farming page rule, not a count of berries in a test save.\n\n### Animals are 5 XP; the Almanac and Book of Stars are 250\n\nPetting a farm animal, milking a cow or goat, shearing a sheep, or picking up an animal product inside a coop gives 5 experience points each. The Skills page includes barn pickup in that same 5-XP list. The grant is 5 XP per action, not a daily lump per building.\n\nPicking up truffles gives Foraging experience rather than Farming experience. A pig can still be petted for 5 Farming XP. The truffle on the ground is a different skill.\n\nFive XP is small next to a cauliflower at 23, and it is the winter-and-evening valve when harvests thin out. Fifty pet or product actions are 250 XP. That 250 is derived (50 × 5), not a wiki named bundle, and it equals one unread [Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac).\n\nThe Almanac and the Book Of Stars are two books. Do not treat them as one item with two names.\n\nUpon reading a copy of the Almanac, you earn 250 Farming XP. The Almanac infobox lists sources that include the Bookseller, the Traveling Cart, fishing treasure chests, Mayor’s Manor, mystery boxes, golden mystery boxes, monsters, crates and barrels, trees, and artifact spots. That is a source list, not a drop-rate table.\n\nUpon reading the [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars), you earn 250 XP in all skills. If you have already reached level 10 in all skills, you earn 1,125 Mastery points instead. Mastery is a different track. While Farming is still below 10, the Book Of Stars is a 250 Farming XP read that also feeds the other skills. The Bookseller price on that page is 15,000g, with a 25% chance for the book to appear.\n\nThe Farming page history records that 1.6 added Farming experience from those two books. Harvesting with a scythe also grants Farming XP on the current page; the same history notes a 1.3.27 fix for a bug that blocked that grant. Read an unread copy once. A second copy of the same book is a separate item to read, not a second name for the first copy.\n\n## How much XP each Farming level takes\n\nAll five skills use the same totals on the [Skills](https://stardewvalleywiki.com/Skills) page. Farming does not have a private curve. The cumulative XP to stand on each level is 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, and 15,000.\n\nThe Farming page also prints a lifetime-parsnip column for those same totals, so you can see the scale in one crop. Other crops differ. Overnight unlocks below are names from the Farming skill table and from the item pages: recipe or profession names, not craft ingredients.\n\n| Level | Total XP | Lifetime parsnips (wiki) | Overnight unlock |\n|---|---|---|---|\n| 1 | 100 | 13 | — |\n| 2 | 380 | 48 | [Sprinkler](https://stardewvalleywiki.com/Sprinkler) |\n| 3 | 770 | 97 | — |\n| 4 | 1,300 | 163 | Preserves Jar |\n| 5 | 2,150 | 269 | Choose a Profession |\n| 6 | 3,300 | 413 | [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler) |\n| 7 | 4,800 | 600 | — |\n| 8 | 6,900 | 863 | [Keg](https://stardewvalleywiki.com/Keg) |\n| 9 | 10,000 | 1,250 | [Seed Maker](https://stardewvalleywiki.com/Seed_Maker), [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) |\n| 10 | 15,000 | 1,875 | Choose a Profession |\n\nThe overnight names this table uses are the sprinkler recipes at 2, 6, and 9, the preserves jar at 4, the keg at 8, the Seed Maker at 9, and the profession clicks at 5 and 10. Levels 1, 3, and 7 still sit on the XP totals. Once a sprinkler recipe exists, placement is the [sprinkler guide](/sprinkler-stardew). The Farming 5 popup names Tiller and Rancher, and that click locks the Farming 10 pair; work the click on [Rancher or Tiller](/rancher-or-tiller-stardew).\n\nFor a first magnitude check, the Farming Experience Points section already converts the early totals into plants: from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers. Derived from those wiki cells, 13 parsnips × 8 XP = 104, which is the first lifetime-parsnip count that exceeds 100. Five cauliflowers × 23 XP = 115, and eight potatoes × 14 XP = 112. Those three products are arithmetic on the printed numbers, not a harvest log.\n\nThe last step is the steep one. Skills lists the increment from 9 to 10 as +5,000 XP, from a 10,000 total to 15,000. The parsnip column moves from 1,250 to 1,875, which is 625 more parsnip harvests (derived: 1,875 − 1,250). Name the gate on the table before you plant for it.\n\n### The skills tab updates now; recipes wait until morning\n\nExperience is added when the harvest (or the 5-XP action, or the book) happens. A skill level increase is awarded immediately once the total is enough, and it is immediately displayed on the skills tab of the inventory. The level-up window does not appear until after you sleep.\n\nThe first time you level a skill on a given day, the game notifies you with “You've got some new ideas to sleep on.” Overnight, after you go to bed on a day a skill level increased, a popup announces the increase and awards knowledge of any applicable crafting or cooking recipes. At level 5 and level 10, that popup also asks you to choose a profession. Recipe knowledge and profession benefits are not available until the first thing the following morning. Items sold or shipped the day of the increase do not receive the new price bonuses.\n\nThat split is the check.\n\n1. Harvest, pet, milk, shear, pick up a coop product, or read a book.\n2. Open the skills tab the same day and read the Farming level that is already there.\n3. Sleep. The popup is where the new recipe appears, and where the profession click appears at 5 and 10.\n4. If Farming hit 5 in the afternoon and you care about the new sell bonus, park high-value stacks until morning. The profession page walks that click.\n\nIf the skills tab already shows the level you named, the XP work for that gate is done. The recipe still waits for the popup.\n\n## Harvest for Farming XP, not for gold per day\n\nGold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules. It is not a harvest-XP ranking. Extra berries that help a gold/day cell do not help the Farming XP cell. Use the Farming Experience Points tables for the skill, and use those seasonal pages when the job is gold.\n\nThe short table below is per harvest of the first product. Each later harvest of a multi-harvest crop grants that same XP again. Extra potatoes, blueberries, and cranberries on one pull do not. Quality does not change the number. These cells are not gold per day, and they are not XP per day: grow time is not a column, and the table does not name a fastest crop.\n\n| Crop | XP per harvest (first product) | Why it is on this table |\n|---|---|---|\n| Parsnip | 8 | Wiki 0→1 and lifetime scale |\n| Potato | 14 | Extra tubers do not add XP |\n| Kale | 17 | Spring crop; 17 sits below cauliflower on the same table |\n| Cauliflower | 23 | Same spring table; 23 per harvest |\n| Strawberry | 18 | High per-harvest XP; not a Spring 1 Pierre default |\n| Green Bean | 9 | Each later harvest still grants 9 |\n| Wheat | 6 | Low per-harvest XP |\n| Hops | 6 | Low per-harvest XP; each later harvest still grants 6 |\n| Coffee Bean | 4 | Cheap seed is not high XP |\n| Blueberry | 10 | Extra berries do not add XP |\n| Poppy | 20 | Summer flower at 20 per harvest |\n| Melon | 27 | Summer high per-harvest XP |\n| Starfruit | 43 | High summer-table XP |\n| Amaranth | 21 | Fall crop at 21 per harvest |\n| Bok Choy | 14 | Fall crop at 14 per harvest |\n| Cranberries | 14 | Extra berries do not add XP |\n| Pumpkin | 31 | Fall high per-harvest XP |\n| Sweet Gem Berry | 64 | Highest cell on the Farming XP tables; not a Pierre default packet |\n| Ancient Fruit | 38 | High XP; not a seasonal Pierre packet |\n| Powdermelon | 12 | Only crop row on the winter XP table |\n\nAll XP cells are from the Farming page seasonal tables.\n\nCauliflower at 23 is higher per harvest than kale at 17 on that same spring table. Wheat at 6 and hops at 6 are low per pull. Coffee bean at 4 is the lowest cell on this short list. None of those comparisons is XP per day. The table has no grow-time column, so it cannot name a fastest crop. A kale ranking that needed grow time, energy, and seed cost would be a different sheet.\n\nStarfruit at 43 versus cranberry extras splits the two jobs. Starfruit is a high per-harvest Farming XP crop. Cranberries pay 14 XP once per harvest, then pay again on the next harvest date; the extra berry in the same pull is gold, priced on the fall gold/day page, and 0 extra Farming XP. Blueberry is the summer version of that split: 10 XP for the first berry, no XP for the extras, gold/day on the summer page. Potato is the spring version: 14 XP, extra tuber ignored by the skill.\n\nSweet Gem Berry at 64 is the highest value on the Farming XP tables. It is not Pierre’s default packet. Ancient Fruit at 38 is high and is not a seasonal Pierre packet either. Strawberry at 18 is a high spring harvest; the [spring crop guide](/best-spring-crop-stardew) is the shop-gate page for that seed, including the fact that Year 1 cannot buy strawberries on Spring 1.\n\nIf the job is stacking Farming XP:\n\n- Prefer a harvest whose first product is a higher XP cell when you actually hold that seed.\n- Count harvest events. A hops plant at 6 XP that you pick many times still pays 6 each time. A potato at 14 that drops two tubers still pays 14 once.\n- Do not plant extra berries to “speed the skill.” They speed the shipping box, not the XP bar.\n- When seed gold or watering energy is the limit, use the 5-XP animal actions and the 250-XP books. The wet-tile ceiling and the gold you can spend this morning are the same constraint as in [how to earn money](/how-to-earn-money-stardew).\n\nDerived, for the 100 XP that reaches level 1: Kale at 17 XP needs 6 harvests to pass 100 (derived: 6 × 17 = 102). Wheat at 6 XP needs 17 harvests (derived: 17 × 6 = 102). Those products compare plant counts to a total, not days in the ground.\n\n## Winter: outdoor harvest XP almost stops\n\n[Winter](https://stardewvalleywiki.com/Winter) is the season where almost no outdoor crop grows. The winter page names three outdoor plantables: Powdermelon Seeds, Winter Seeds, and Fiber Seeds. With ordinary plant growth stopped, it treats animal produce and the [greenhouse](/glasshouse-stardew-valley) as the mainstay of farm produce.\n\nThe Farming XP winter table has one crop row: powdermelon at 12 XP. That is the outdoor harvest XP that table scores in winter.\n\n[Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds) do not print a Farming XP number on their own page. They also have no row on the Farming winter XP table. The Farming page and the Winter page disagree about whether wild-seed plants grant Farming XP, so there is no Winter Seeds or Wild Seeds Farming XP figure here, including 3 and including 0. Fiber Seeds can be planted in winter and do not need daily watering; that page is silent on Farming XP, so they get no XP number here either.\n\nThe rest of the source map still works.\n\nAnimals still grant 5 XP per pet, milking, shearing, or coop pickup. Truffles are still Foraging. An unread Almanac is still 250 Farming XP. An unread Book Of Stars is still 250 XP in every skill that is not already 10. Greenhouse plants still grant harvest XP on the first product of each harvest, including ancient fruit at 38 if that is what is in the bed. Indoor beds that keep producing in winter are the [greenhouse page](/glasshouse-stardew-valley).\n\nPowdermelon at 12 is a winter harvest, not a gold/day argument. The winter page also prints a gold/day cell for it; that cell is not XP. If you have powdermelon seeds, each harvest is 12 Farming XP on that table. If you do not, winter leveling is animals, books, and whatever still harvests inside.\n\nWinter is not an empty XP season on the current wiki: one winter XP-table crop at 12, books at 250, animals at 5, and greenhouse harvests remain on the source list. That is the 1.6.15 wiki reading, not a timed winter playthrough.\n\nBefore you sleep, open the skills tab and read the Farming level that is already there. If it is the gate you named—5 at 2,150, 8 at 6,900, 9 at 10,000, 10 at 15,000—the XP for that gate is done and the popup still has to fire. If it is not, count the next first-product harvests, the 5-XP animal actions, and any unread Almanac or Book Of Stars against the remaining total. Do not count extra berries, extra potatoes, truffles, hoe swings, or watering-can swings.\n\n## Sources\n\nChecked 2026-09-20 against Stardew Valley Wiki Farming (including Experience Points), Skills, Stardew Valley Almanac, Book Of Stars, Keg, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Seed Maker, Winter, and Winter Seeds. The wiki home names computer version 1.6.15. Winter Seeds Farming XP is not used: the Farming page and the Winter page disagree, and the Winter Seeds page does not print a number. No in-game harvest test was run. This site’s planner is a layout tool; it does not compute Farming XP or skill levels.\n\n- [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki)\n- [Stardew Valley Wiki: Farming](https://stardewvalleywiki.com/Farming)\n- [Stardew Valley Wiki: Farming (Experience Points)](https://stardewvalleywiki.com/Farming#Experience_Points)\n- [Stardew Valley Wiki: Skills](https://stardewvalleywiki.com/Skills)\n- [Stardew Valley Wiki: Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac)\n- [Stardew Valley Wiki: Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars)\n- [Stardew Valley Wiki: Keg](https://stardewvalleywiki.com/Keg)\n- [Stardew Valley Wiki: Sprinkler](https://stardewvalleywiki.com/Sprinkler)\n- [Stardew Valley Wiki: Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)\n- [Stardew Valley Wiki: Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)\n- [Stardew Valley Wiki: Seed Maker](https://stardewvalleywiki.com/Seed_Maker)\n- [Stardew Valley Wiki: Winter](https://stardewvalleywiki.com/Winter)\n- [Stardew Valley Wiki: Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds)\n- [This site: Rancher or Tiller](https://stardewvalleyplanner.art/rancher-or-tiller-stardew)\n- [This site: sprinklers](https://stardewvalleyplanner.art/sprinkler-stardew)\n- [This site: Year 1 gold](https://stardewvalleyplanner.art/how-to-earn-money-stardew)\n- [This site: spring crops](https://stardewvalleyplanner.art/best-spring-crop-stardew)\n- [This site: summer crops](https://stardewvalleyplanner.art/summer-crops-stardew)\n- [This site: fall crops](https://stardewvalleyplanner.art/fall-crops-stardew)\n- [This site: greenhouse](https://stardewvalleyplanner.art/glasshouse-stardew-valley)",
  "bodyHash": "1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 21842,
  "seo": {
    "title": "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
    "h1": "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
    "description": "Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.",
    "slug": "how-to-level-up-farming-stardew",
    "faq": null,
    "schema": {
      "@type": "Article",
      "doNotEmitFAQPage": true
    },
    "og": {
      "title": "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
      "description": "Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.",
      "openGraphType": "article",
      "image": "pending_media"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-home",
      "label": "Stardew Valley Wiki",
      "url": "https://stardewvalleywiki.com/Stardew_Valley_Wiki",
      "appliesTo": [
        {
          "quote": "Numbers below follow the [Stardew Valley Wiki](https://stardewvalleywiki.com/Stardew_Valley_Wiki) computer version **1.6.15**.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-farming",
      "label": "Stardew Valley Wiki: Farming",
      "url": "https://stardewvalleywiki.com/Farming",
      "appliesTo": [
        {
          "quote": "[Farming](https://stardewvalleywiki.com/Farming) is the skill tied to planting, growing, and harvesting crops, and to the care of farm animals.",
          "occurrence": 1
        },
        {
          "quote": "To level the skill you need experience points, which are gained by harvesting crops, petting farm animals, milking cows or goats, shearing sheep, picking up animal products inside a coop, or reading the Stardew Valley Almanac or Book Of Stars.",
          "occurrence": 1
        },
        {
          "quote": "Harvesting with a scythe also grants Farming XP on the current page; the same history notes a 1.3.27 fix for a bug that blocked that grant.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-farming-xp",
      "label": "Stardew Valley Wiki: Farming (Experience Points)",
      "url": "https://stardewvalleywiki.com/Farming#Experience_Points",
      "appliesTo": [
        {
          "quote": "More expensive crops give more experience on harvest. Crops with multiple harvests give experience for every harvest. Crops that yield several items in one harvest, such as blueberry, cranberry, or potato, only reward experience for the first product and do not offer any extra experience for the multiples.",
          "occurrence": 1
        },
        {
          "quote": "High-quality crops grant the same amount of XP as normal-quality crops.",
          "occurrence": 1
        },
        {
          "quote": "`XP = ||16 × ln(0.018 × PRICE + 1)||`, where PRICE is the crop’s base sell price.",
          "occurrence": 1
        },
        {
          "quote": "from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-skills",
      "label": "Stardew Valley Wiki: Skills",
      "url": "https://stardewvalleywiki.com/Skills",
      "appliesTo": [
        {
          "quote": "using a hoe or watering can does not grant experience by itself.",
          "occurrence": 1
        },
        {
          "quote": "Each Farming level also grants +1 proficiency to hoes and watering cans.",
          "occurrence": 1
        },
        {
          "quote": "The cumulative XP to stand on each level is 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, and 15,000.",
          "occurrence": 1
        },
        {
          "quote": "The first time you level a skill on a given day, the game notifies you with “You've got some new ideas to sleep on.”",
          "occurrence": 1
        },
        {
          "quote": "Items sold or shipped the day of the increase do not receive the new price bonuses.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-almanac",
      "label": "Stardew Valley Wiki: Stardew Valley Almanac",
      "url": "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
      "appliesTo": [
        {
          "quote": "Upon reading a copy of the Almanac, you earn 250 Farming XP.",
          "occurrence": 1
        },
        {
          "quote": "The Almanac infobox lists sources that include the Bookseller, the Traveling Cart, fishing treasure chests, Mayor’s Manor, mystery boxes, golden mystery boxes, monsters, crates and barrels, trees, and artifact spots.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-book-of-stars",
      "label": "Stardew Valley Wiki: Book Of Stars",
      "url": "https://stardewvalleywiki.com/Book_Of_Stars",
      "appliesTo": [
        {
          "quote": "Upon reading the [Book Of Stars](https://stardewvalleywiki.com/Book_Of_Stars), you earn 250 XP in all skills. If you have already reached level 10 in all skills, you earn 1,125 Mastery points instead.",
          "occurrence": 1
        },
        {
          "quote": "The Bookseller price on that page is 15,000g, with a 25% chance for the book to appear.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-keg",
      "label": "Stardew Valley Wiki: Keg",
      "url": "https://stardewvalleywiki.com/Keg",
      "appliesTo": [
        {
          "quote": "| 8 | 6,900 | 863 | [Keg](https://stardewvalleywiki.com/Keg) |",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-sprinkler",
      "label": "Stardew Valley Wiki: Sprinkler",
      "url": "https://stardewvalleywiki.com/Sprinkler",
      "appliesTo": [
        {
          "quote": "A field that a [Sprinkler](https://stardewvalleywiki.com/Sprinkler), [Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler), or [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler) kept wet still levels Farming when you pick the crop.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-quality-sprinkler",
      "label": "Stardew Valley Wiki: Quality Sprinkler",
      "url": "https://stardewvalleywiki.com/Quality_Sprinkler",
      "appliesTo": [
        {
          "quote": "[Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-iridium-sprinkler",
      "label": "Stardew Valley Wiki: Iridium Sprinkler",
      "url": "https://stardewvalleywiki.com/Iridium_Sprinkler",
      "appliesTo": [
        {
          "quote": "[Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-seed-maker",
      "label": "Stardew Valley Wiki: Seed Maker",
      "url": "https://stardewvalleywiki.com/Seed_Maker",
      "appliesTo": [
        {
          "quote": "[Seed Maker](https://stardewvalleywiki.com/Seed_Maker), [Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-winter",
      "label": "Stardew Valley Wiki: Winter",
      "url": "https://stardewvalleywiki.com/Winter",
      "appliesTo": [
        {
          "quote": "The winter page names three outdoor plantables: Powdermelon Seeds, Winter Seeds, and Fiber Seeds.",
          "occurrence": 1
        },
        {
          "quote": "With ordinary plant growth stopped, it treats animal produce and the [greenhouse](/glasshouse-stardew-valley) as the mainstay of farm produce.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-winter-seeds",
      "label": "Stardew Valley Wiki: Winter Seeds",
      "url": "https://stardewvalleywiki.com/Winter_Seeds",
      "appliesTo": [
        {
          "quote": "[Winter Seeds](https://stardewvalleywiki.com/Winter_Seeds) do not print a Farming XP number on their own page.",
          "occurrence": 1
        },
        {
          "quote": "The Farming page and the Winter page disagree about whether wild-seed plants grant Farming XP, so there is no Winter Seeds or Wild Seeds Farming XP figure here, including 3 and including 0.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "planner-rancher",
      "label": "This site: Rancher or Tiller",
      "url": "https://stardewvalleyplanner.art/rancher-or-tiller-stardew",
      "appliesTo": [
        {
          "quote": "The Farming 5 popup names Tiller and Rancher, and that click locks the Farming 10 pair; work the click on [Rancher or Tiller](/rancher-or-tiller-stardew).",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-sprinkler",
      "label": "This site: sprinklers",
      "url": "https://stardewvalleyplanner.art/sprinkler-stardew",
      "appliesTo": [
        {
          "quote": "How far each tier reaches, which tiles it misses, and where rain does not count are in the [sprinkler guide](/sprinkler-stardew).",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-money",
      "label": "This site: Year 1 gold",
      "url": "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
      "appliesTo": [
        {
          "quote": "The wet-tile ceiling and the gold you can spend this morning are the same constraint as in [how to earn money](/how-to-earn-money-stardew).",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-spring",
      "label": "This site: spring crops",
      "url": "https://stardewvalleyplanner.art/best-spring-crop-stardew",
      "appliesTo": [
        {
          "quote": "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-summer",
      "label": "This site: summer crops",
      "url": "https://stardewvalleyplanner.art/summer-crops-stardew",
      "appliesTo": [
        {
          "quote": "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-fall",
      "label": "This site: fall crops",
      "url": "https://stardewvalleyplanner.art/fall-crops-stardew",
      "appliesTo": [
        {
          "quote": "Gold per day on the [spring](/best-spring-crop-stardew), [summer](/summer-crops-stardew), and [fall](/fall-crops-stardew) crop pages is a sell ranking under named shop and occupancy rules.",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    },
    {
      "id": "planner-greenhouse",
      "label": "This site: greenhouse",
      "url": "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
      "appliesTo": [
        {
          "quote": "Indoor beds that keep producing in winter are the [greenhouse page](/glasshouse-stardew-valley).",
          "occurrence": 1
        }
      ],
      "versionNote": "This site, not the wiki."
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "how-to-level-up-farming-stardew",
      "enPath": "/how-to-level-up-farming-stardew",
      "zhPath": "/zh/how-to-level-up-farming-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "doNotOccupy": [
        "rancher-or-tiller-stardew",
        "sprinkler-stardew",
        "how-to-earn-money-stardew",
        "best-spring-crop-stardew",
        "summer-crops-stardew",
        "fall-crops-stardew",
        "glasshouse-stardew-valley",
        "do-you-have-to-water-trees-stardew"
      ],
      "matchesZhSlug": true
    },
    "registry": {
      "titleEqualsH1": true,
      "author": "Stardew Valley Planner Team",
      "topic": "Stardew Valley Guides",
      "featured": true,
      "readTimeMinutes": 11,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "articleModuleExport": "HowToLevelUpFarmingStardewEnglishArticle",
      "articleModulePath": "src/blog/articles/how-to-level-up-farming-stardew.en.tsx"
    },
    "sources": {
      "heading": "Sources",
      "checkedLabel": "Checked 2026-09-20 against Stardew Valley Wiki Farming (including Experience Points), Skills, Stardew Valley Almanac, Book Of Stars, Keg, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Seed Maker, Winter, and Winter Seeds. The wiki home names computer version 1.6.15. Winter Seeds Farming XP is not used: the Farming page and the Winter page disagree, and the Winter Seeds page does not print a number. No in-game harvest test was run. This site’s planner is a layout tool; it does not compute Farming XP or skill levels.",
      "itemOrder": [
        "wiki-home",
        "wiki-farming",
        "wiki-farming-xp",
        "wiki-skills",
        "wiki-almanac",
        "wiki-book-of-stars",
        "wiki-keg",
        "wiki-sprinkler",
        "wiki-quality-sprinkler",
        "wiki-iridium-sprinkler",
        "wiki-seed-maker",
        "wiki-winter",
        "wiki-winter-seeds",
        "planner-rancher",
        "planner-sprinkler",
        "planner-money",
        "planner-spring",
        "planner-summer",
        "planner-fall",
        "planner-greenhouse"
      ],
      "items": [
        {
          "id": "wiki-home",
          "href": "https://stardewvalleywiki.com/Stardew_Valley_Wiki",
          "label": "Stardew Valley Wiki"
        },
        {
          "id": "wiki-farming",
          "href": "https://stardewvalleywiki.com/Farming",
          "label": "Stardew Valley Wiki: Farming"
        },
        {
          "id": "wiki-farming-xp",
          "href": "https://stardewvalleywiki.com/Farming#Experience_Points",
          "label": "Stardew Valley Wiki: Farming (Experience Points)"
        },
        {
          "id": "wiki-skills",
          "href": "https://stardewvalleywiki.com/Skills",
          "label": "Stardew Valley Wiki: Skills"
        },
        {
          "id": "wiki-almanac",
          "href": "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
          "label": "Stardew Valley Wiki: Stardew Valley Almanac"
        },
        {
          "id": "wiki-book-of-stars",
          "href": "https://stardewvalleywiki.com/Book_Of_Stars",
          "label": "Stardew Valley Wiki: Book Of Stars"
        },
        {
          "id": "wiki-keg",
          "href": "https://stardewvalleywiki.com/Keg",
          "label": "Stardew Valley Wiki: Keg"
        },
        {
          "id": "wiki-sprinkler",
          "href": "https://stardewvalleywiki.com/Sprinkler",
          "label": "Stardew Valley Wiki: Sprinkler"
        },
        {
          "id": "wiki-quality-sprinkler",
          "href": "https://stardewvalleywiki.com/Quality_Sprinkler",
          "label": "Stardew Valley Wiki: Quality Sprinkler"
        },
        {
          "id": "wiki-iridium-sprinkler",
          "href": "https://stardewvalleywiki.com/Iridium_Sprinkler",
          "label": "Stardew Valley Wiki: Iridium Sprinkler"
        },
        {
          "id": "wiki-seed-maker",
          "href": "https://stardewvalleywiki.com/Seed_Maker",
          "label": "Stardew Valley Wiki: Seed Maker"
        },
        {
          "id": "wiki-winter",
          "href": "https://stardewvalleywiki.com/Winter",
          "label": "Stardew Valley Wiki: Winter"
        },
        {
          "id": "wiki-winter-seeds",
          "href": "https://stardewvalleywiki.com/Winter_Seeds",
          "label": "Stardew Valley Wiki: Winter Seeds"
        },
        {
          "id": "planner-rancher",
          "href": "/rancher-or-tiller-stardew",
          "label": "This site: Rancher or Tiller"
        },
        {
          "id": "planner-sprinkler",
          "href": "/sprinkler-stardew",
          "label": "This site: sprinklers"
        },
        {
          "id": "planner-money",
          "href": "/how-to-earn-money-stardew",
          "label": "This site: Year 1 gold"
        },
        {
          "id": "planner-spring",
          "href": "/best-spring-crop-stardew",
          "label": "This site: spring crops"
        },
        {
          "id": "planner-summer",
          "href": "/summer-crops-stardew",
          "label": "This site: summer crops"
        },
        {
          "id": "planner-fall",
          "href": "/fall-crops-stardew",
          "label": "This site: fall crops"
        },
        {
          "id": "planner-greenhouse",
          "href": "/glasshouse-stardew-valley",
          "label": "This site: greenhouse"
        }
      ]
    },
    "faq": null,
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/sprinkler-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/rancher-or-tiller-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/how-to-earn-money-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/best-spring-crop-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/summer-crops-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/fall-crops-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/glasshouse-stardew-valley",
          "className": "blog-planner-link"
        }
      ],
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/how-to-level-up-farming-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures",
      "altStatus": "pending_media",
      "altDirection": "Describe the actual cover: Farming skill going up through harvest, not a profession fork, not a gold pile, not a greenhouse 10×12. Do not print 2,150 / 15,000 or a fake skills bar on the cover. trimmed length ≥ 8."
    },
    "figures": [
      {
        "id": "figure-1-source-map",
        "assemblyToken": "FIGURE1_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/farming-xp-source-map.webp",
        "placement": "H2-1 after the source list and extra-produce rule, before the watering H3",
        "type": "Accurate schematic (controlled drawing). Not a screenshot. Not planner UI.",
        "compositionNote": "Two groups: grants (first-product harvest; pet/milk/shear/coop pickup 5; Almanac and Book Of Stars 250, two distinct covers) vs does not (hoe, watering can, sprinkler watering, extra berries/potatoes, truffles as Foraging). Reader must see that watering-only cannot level. Allowed numbers: 5, 250.",
        "alt": "Rule diagram of Farming XP sources versus non-sources: harvest of the first product, animal pet/milk/shear/coop pickup at 5 XP, Almanac and Book Of Stars at 250 XP each; hoe, watering can, sprinkler watering, extra berries or potatoes, and truffles do not grant Farming XP. Not a game screenshot.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-2-first-product",
        "assemblyToken": "FIGURE2_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/farming-xp-first-product-only.webp",
        "placement": "H2-1 H3 Extra potatoes, blueberries, and cranberries do not add XP",
        "type": "Accurate schematic (controlled drawing). Not a fake harvest screenshot.",
        "compositionNote": "Three one-harvest rows: blueberry first product 10, cranberry 14, potato 14; extras marked 0 Farming XP. Do not tint extras as if quality changed XP.",
        "alt": "One blueberry, cranberry, or potato harvest: the first product is marked as Farming XP, the extra berries or extra tuber are marked as no Farming XP. Not a game screenshot.",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      }
    ],
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35",
    "length": {
      "locale": "en",
      "mechanical_units": 2863,
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
    "contentOnly": true
  }
}
```
