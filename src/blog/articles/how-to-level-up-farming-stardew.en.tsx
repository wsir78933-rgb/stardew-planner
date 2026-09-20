import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function HowToLevelUpFarmingStardewEnglishArticle() {
  return (
    <article>
      <p>
        Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest), when you pet, milk, or shear animals or pick up a coop product, and when you read the <a href="https://stardewvalleywiki.com/Stardew_Valley_Almanac">Stardew Valley Almanac</a> or <a href="https://stardewvalleywiki.com/Book_Of_Stars">Book Of Stars</a>. Using a hoe or a watering can does not grant Farming XP by itself, so a sprinkler that waters the field does not replace the harvest as the way the skill moves. Open the skills tab, pick a named total—2,150 for level 5, 6,900 for 8, 10,000 for 9, or 15,000 for 10—and stack those harvests, 5-XP animal actions, and 250-XP books until the tab shows that level.
      </p>

      <p>
        Numbers below follow the <a href="https://stardewvalleywiki.com/Stardew_Valley_Wiki">Stardew Valley Wiki</a> computer version <strong>1.6.15</strong>. Harvest XP, the crop table, and the lifetime-parsnip counts come from the <a href="https://stardewvalleywiki.com/Farming">Farming</a> page. The shared 100…15,000 totals, the hoe and watering-can rule, and the overnight popup come from <a href="https://stardewvalleywiki.com/Skills">Skills</a>. No in-game harvest test was run for this article. Where a figure is arithmetic on those wiki numbers, it is marked derived.
      </p>

      <h2>Farming XP comes from harvests, animals, and two books</h2>

      <p>
        <a href="https://stardewvalleywiki.com/Farming">Farming</a> is the skill tied to planting, growing, and harvesting crops, and to the care of farm animals. The XP list on that page is narrower than the flavor sentence. To level the skill you need experience points, which are gained by harvesting crops, petting farm animals, milking cows or goats, shearing sheep, picking up animal products inside a coop, or reading the Stardew Valley Almanac or Book Of Stars.
      </p>

      <p>
        That list is the map. Tilling a new tile, filling a watering can, and walking a sprinkler circuit are not on it. Turning milk into cheese is not on it. The <a href="https://stardewvalleywiki.com/Farming#Experience_Points">Experience Points</a> section then splits harvest XP from animal XP from book XP, and it is strict about extra produce.
      </p>

      <p>
        More expensive crops give more experience on harvest. Crops with multiple harvests give experience for every harvest. Crops that yield several items in one harvest, such as blueberry, cranberry, or potato, only reward experience for the first product and do not offer any extra experience for the multiples.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Rule diagram of Farming XP sources versus non-sources: harvest of the first product, animal pet/milk/shear/coop pickup at 5 XP, Almanac and Book Of Stars at 250 XP each; hoe, watering can, sprinkler watering, extra berries or potatoes, and truffles do not grant Farming XP. Not a game screenshot."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/farming-xp-source-map.webp"
          width="1672"
        />
        <figcaption>
          Farming XP sources and non-sources, from the Farming and Skills pages, not from a harvest test. Harvest of the first product grants crop XP. Petting, milking, shearing, or picking up a coop product grants 5 XP. The Almanac and the Book Of Stars grant 250 Farming XP each. A hoe swing, a watering-can swing, and a sprinkler’s morning water do not grant Farming XP. Extra berries and extra potatoes on the same harvest do not add XP. Truffles grant Foraging XP, not Farming. If you only water and never harvest, the skills tab does not move.
        </figcaption>
      </figure>

      <h3>Watering and hoeing do not grant Farming XP</h3>

      <p>
        The <a href="https://stardewvalleywiki.com/Skills">Skills</a> Farming subsection states the tool rule in one sentence: using a hoe or watering can does not grant experience by itself. Farming skill is gained by harvesting crops, by the 5-XP animal actions, and by reading those two books. Each Farming level also grants +1 proficiency to hoes and watering cans. Proficiency makes those tools cheaper in energy after the level already happened. It does not mean the swing that used the tool paid the XP.
      </p>

      <p>
        A sprinkler does not change that split. It waters tilled tiles in the morning so the plant can grow. The XP event is still the harvest. A field that a <a href="https://stardewvalleywiki.com/Sprinkler">Sprinkler</a>, <a href="https://stardewvalleywiki.com/Quality_Sprinkler">Quality Sprinkler</a>, or <a href="https://stardewvalleywiki.com/Iridium_Sprinkler">Iridium Sprinkler</a> kept wet still levels Farming when you pick the crop. A field you water by hand every day, then never harvest, does not. The worry that automation “steals” Farming XP mixes the watering action with the harvest action. Watering is not the XP action.
      </p>

      <p>
        Suppose, as a design example, you hoe and water forty tiles every morning and leave every crop in the ground. The hoe and can themselves add 0 Farming XP. The forty plants add XP on the morning you actually pick them. That is the Skills sentence applied to a grid, not a timed test.
      </p>

      <p>
        After Farming 2, 6, or 9, the matching sprinkler recipe unlocks. How far each tier reaches, which tiles it misses, and where rain does not count are in the <a className="blog-planner-link" href="/sprinkler-stardew">sprinkler guide</a>.
      </p>

      <h3>Extra potatoes, blueberries, and cranberries do not add XP</h3>

      <p>
        Two harvest rules sit next to each other and get swapped in the field.
      </p>

      <p>
        Crops with several harvest dates give XP on every harvest. A green bean, hops plant, blueberry bush, or cranberry plant that you pick this week and again later pays the crop’s harvest XP each time.
      </p>

      <p>
        Crops that drop several items in one pull pay once. The Farming page names blueberry, cranberry, and potato. The extra berries and the extra tuber are extra gold, extra shipping, extra inventory. They are not extra Farming XP.
      </p>

      <p>
        Quality does not change the XP. High-quality crops grant the same amount of XP as normal-quality crops. A gold cauliflower is still 23 Farming XP on the spring table, not a larger skill grant. Food that temporarily pushes displayed Farming above 10 can change quality rolls. Those buffs are not extra lifetime XP, and they do not rewrite the harvest XP cell.
      </p>

      <p>
        The page prints the formula after the seasonal tables: <code>XP = ||16 × ln(0.018 × PRICE + 1)||</code>, where PRICE is the crop’s base sell price. The double bars are the wiki’s notation. This article did not open the game’s <code>Data/Objects.xnb</code> file. Use the printed per-harvest table rather than recomputing the logarithm by hand. The formula is why a high-sell crop such as <a href="https://stardewvalleywiki.com/Farming#Experience_Points">starfruit</a> sits at 43 and a cheap coffee bean sits at 4. Quality does not enter PRICE.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="One blueberry, cranberry, or potato harvest: the first product is marked as Farming XP, the extra berries or extra tuber are marked as no Farming XP. Not a game screenshot."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/farming-xp-first-product-only.webp"
          width="1672"
        />
        <figcaption>
          First product only, on one harvest. A blueberry pull that yields three berries still grants 10 Farming XP once. A cranberry pull that yields two berries still grants 14 once. A potato pull that yields an extra tuber still grants 14 once. The next harvest date on a blueberry or cranberry plant is a new harvest, and that new harvest grants XP again. This is the Farming page rule, not a count of berries in a test save.
        </figcaption>
      </figure>

      <h3>Animals are 5 XP; the Almanac and Book of Stars are 250</h3>

      <p>
        Petting a farm animal, milking a cow or goat, shearing a sheep, or picking up an animal product inside a coop gives 5 experience points each. The Skills page includes barn pickup in that same 5-XP list. The grant is 5 XP per action, not a daily lump per building.
      </p>

      <p>
        Picking up truffles gives Foraging experience rather than Farming experience. A pig can still be petted for 5 Farming XP. The truffle on the ground is a different skill.
      </p>

      <p>
        Five XP is small next to a cauliflower at 23, and it is the winter-and-evening valve when harvests thin out. Fifty pet or product actions are 250 XP. That 250 is derived (50 × 5), not a wiki named bundle, and it equals one unread <a href="https://stardewvalleywiki.com/Stardew_Valley_Almanac">Stardew Valley Almanac</a>.
      </p>

      <p>
        The Almanac and the Book Of Stars are two books. Do not treat them as one item with two names.
      </p>

      <p>
        Upon reading a copy of the Almanac, you earn 250 Farming XP. The Almanac infobox lists sources that include the Bookseller, the Traveling Cart, fishing treasure chests, Mayor’s Manor, mystery boxes, golden mystery boxes, monsters, crates and barrels, trees, and artifact spots. That is a source list, not a drop-rate table.
      </p>

      <p>
        Upon reading the <a href="https://stardewvalleywiki.com/Book_Of_Stars">Book Of Stars</a>, you earn 250 XP in all skills. If you have already reached level 10 in all skills, you earn 1,125 Mastery points instead. Mastery is a different track. While Farming is still below 10, the Book Of Stars is a 250 Farming XP read that also feeds the other skills. The Bookseller price on that page is 15,000g, with a 25% chance for the book to appear.
      </p>

      <p>
        The Farming page history records that 1.6 added Farming experience from those two books. Harvesting with a scythe also grants Farming XP on the current page; the same history notes a 1.3.27 fix for a bug that blocked that grant. Read an unread copy once. A second copy of the same book is a separate item to read, not a second name for the first copy.
      </p>

      <h2>How much XP each Farming level takes</h2>

      <p>
        All five skills use the same totals on the <a href="https://stardewvalleywiki.com/Skills">Skills</a> page. Farming does not have a private curve. The cumulative XP to stand on each level is 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, and 15,000.
      </p>

      <p>
        The Farming page also prints a lifetime-parsnip column for those same totals, so you can see the scale in one crop. Other crops differ. Overnight unlocks below are names from the Farming skill table and from the item pages: recipe or profession names, not craft ingredients.
      </p>

      <div
        aria-label="Farming level totals and overnight unlocks"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Total XP</th>
              <th scope="col">Lifetime parsnips (wiki)</th>
              <th scope="col">Overnight unlock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>100</td>
              <td>13</td>
              <td>—</td>
            </tr>
            <tr>
              <td>2</td>
              <td>380</td>
              <td>48</td>
              <td><a href="https://stardewvalleywiki.com/Sprinkler">Sprinkler</a></td>
            </tr>
            <tr>
              <td>3</td>
              <td>770</td>
              <td>97</td>
              <td>—</td>
            </tr>
            <tr>
              <td>4</td>
              <td>1,300</td>
              <td>163</td>
              <td>Preserves Jar</td>
            </tr>
            <tr>
              <td>5</td>
              <td>2,150</td>
              <td>269</td>
              <td>Choose a Profession</td>
            </tr>
            <tr>
              <td>6</td>
              <td>3,300</td>
              <td>413</td>
              <td><a href="https://stardewvalleywiki.com/Quality_Sprinkler">Quality Sprinkler</a></td>
            </tr>
            <tr>
              <td>7</td>
              <td>4,800</td>
              <td>600</td>
              <td>—</td>
            </tr>
            <tr>
              <td>8</td>
              <td>6,900</td>
              <td>863</td>
              <td><a href="https://stardewvalleywiki.com/Keg">Keg</a></td>
            </tr>
            <tr>
              <td>9</td>
              <td>10,000</td>
              <td>1,250</td>
              <td><a href="https://stardewvalleywiki.com/Seed_Maker">Seed Maker</a>, <a href="https://stardewvalleywiki.com/Iridium_Sprinkler">Iridium Sprinkler</a></td>
            </tr>
            <tr>
              <td>10</td>
              <td>15,000</td>
              <td>1,875</td>
              <td>Choose a Profession</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The overnight names this table uses are the sprinkler recipes at 2, 6, and 9, the preserves jar at 4, the keg at 8, the Seed Maker at 9, and the profession clicks at 5 and 10. Levels 1, 3, and 7 still sit on the XP totals. Once a sprinkler recipe exists, placement is the <a className="blog-planner-link" href="/sprinkler-stardew">sprinkler guide</a>. The Farming 5 popup names Tiller and Rancher, and that click locks the Farming 10 pair; work the click on <a className="blog-planner-link" href="/rancher-or-tiller-stardew">Rancher or Tiller</a>.
      </p>

      <p>
        For a first magnitude check, the Farming Experience Points section already converts the early totals into plants: from level 0 to 1 it takes 13 parsnips, or 8 potatoes, or 5 cauliflowers. From level 0 to 2, it takes about 48 parsnips, or 28 potatoes, or 17 cauliflowers. Derived from those wiki cells, 13 parsnips × 8 XP = 104, which is the first lifetime-parsnip count that exceeds 100. Five cauliflowers × 23 XP = 115, and eight potatoes × 14 XP = 112. Those three products are arithmetic on the printed numbers, not a harvest log.
      </p>

      <p>
        The last step is the steep one. Skills lists the increment from 9 to 10 as +5,000 XP, from a 10,000 total to 15,000. The parsnip column moves from 1,250 to 1,875, which is 625 more parsnip harvests (derived: 1,875 − 1,250). Name the gate on the table before you plant for it.
      </p>

      <h3>The skills tab updates now; recipes wait until morning</h3>

      <p>
        Experience is added when the harvest (or the 5-XP action, or the book) happens. A skill level increase is awarded immediately once the total is enough, and it is immediately displayed on the skills tab of the inventory. The level-up window does not appear until after you sleep.
      </p>

      <p>
        The first time you level a skill on a given day, the game notifies you with “You've got some new ideas to sleep on.” Overnight, after you go to bed on a day a skill level increased, a popup announces the increase and awards knowledge of any applicable crafting or cooking recipes. At level 5 and level 10, that popup also asks you to choose a profession. Recipe knowledge and profession benefits are not available until the first thing the following morning. Items sold or shipped the day of the increase do not receive the new price bonuses.
      </p>

      <p>
        That split is the check.
      </p>

      <ol>
        <li>
          Harvest, pet, milk, shear, pick up a coop product, or read a book.
        </li>
        <li>
          Open the skills tab the same day and read the Farming level that is already there.
        </li>
        <li>
          Sleep. The popup is where the new recipe appears, and where the profession click appears at 5 and 10.
        </li>
        <li>
          If Farming hit 5 in the afternoon and you care about the new sell bonus, park high-value stacks until morning. The profession page walks that click.
        </li>
      </ol>

      <p>
        If the skills tab already shows the level you named, the XP work for that gate is done. The recipe still waits for the popup.
      </p>

      <h2>Harvest for Farming XP, not for gold per day</h2>

      <p>
        Gold per day on the <a className="blog-planner-link" href="/best-spring-crop-stardew">spring</a>, <a className="blog-planner-link" href="/summer-crops-stardew">summer</a>, and <a className="blog-planner-link" href="/fall-crops-stardew">fall</a> crop pages is a sell ranking under named shop and occupancy rules. It is not a harvest-XP ranking. Extra berries that help a gold/day cell do not help the Farming XP cell. Use the Farming Experience Points tables for the skill, and use those seasonal pages when the job is gold.
      </p>

      <p>
        The short table below is per harvest of the first product. Each later harvest of a multi-harvest crop grants that same XP again. Extra potatoes, blueberries, and cranberries on one pull do not. Quality does not change the number. These cells are not gold per day, and they are not XP per day: grow time is not a column, and the table does not name a fastest crop.
      </p>

      <div
        aria-label="Per-harvest Farming XP for the first product"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">XP per harvest (first product)</th>
              <th scope="col">Why it is on this table</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parsnip</td>
              <td>8</td>
              <td>Wiki 0→1 and lifetime scale</td>
            </tr>
            <tr>
              <td>Potato</td>
              <td>14</td>
              <td>Extra tubers do not add XP</td>
            </tr>
            <tr>
              <td>Kale</td>
              <td>17</td>
              <td>Spring crop; 17 sits below cauliflower on the same table</td>
            </tr>
            <tr>
              <td>Cauliflower</td>
              <td>23</td>
              <td>Same spring table; 23 per harvest</td>
            </tr>
            <tr>
              <td>Strawberry</td>
              <td>18</td>
              <td>High per-harvest XP; not a Spring 1 Pierre default</td>
            </tr>
            <tr>
              <td>Green Bean</td>
              <td>9</td>
              <td>Each later harvest still grants 9</td>
            </tr>
            <tr>
              <td>Wheat</td>
              <td>6</td>
              <td>Low per-harvest XP</td>
            </tr>
            <tr>
              <td>Hops</td>
              <td>6</td>
              <td>Low per-harvest XP; each later harvest still grants 6</td>
            </tr>
            <tr>
              <td>Coffee Bean</td>
              <td>4</td>
              <td>Cheap seed is not high XP</td>
            </tr>
            <tr>
              <td>Blueberry</td>
              <td>10</td>
              <td>Extra berries do not add XP</td>
            </tr>
            <tr>
              <td>Poppy</td>
              <td>20</td>
              <td>Summer flower at 20 per harvest</td>
            </tr>
            <tr>
              <td>Melon</td>
              <td>27</td>
              <td>Summer high per-harvest XP</td>
            </tr>
            <tr>
              <td>Starfruit</td>
              <td>43</td>
              <td>High summer-table XP</td>
            </tr>
            <tr>
              <td>Amaranth</td>
              <td>21</td>
              <td>Fall crop at 21 per harvest</td>
            </tr>
            <tr>
              <td>Bok Choy</td>
              <td>14</td>
              <td>Fall crop at 14 per harvest</td>
            </tr>
            <tr>
              <td>Cranberries</td>
              <td>14</td>
              <td>Extra berries do not add XP</td>
            </tr>
            <tr>
              <td>Pumpkin</td>
              <td>31</td>
              <td>Fall high per-harvest XP</td>
            </tr>
            <tr>
              <td>Sweet Gem Berry</td>
              <td>64</td>
              <td>Highest cell on the Farming XP tables; not a Pierre default packet</td>
            </tr>
            <tr>
              <td>Ancient Fruit</td>
              <td>38</td>
              <td>High XP; not a seasonal Pierre packet</td>
            </tr>
            <tr>
              <td>Powdermelon</td>
              <td>12</td>
              <td>Only crop row on the winter XP table</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        All XP cells are from the Farming page seasonal tables.
      </p>

      <p>
        Cauliflower at 23 is higher per harvest than kale at 17 on that same spring table. Wheat at 6 and hops at 6 are low per pull. Coffee bean at 4 is the lowest cell on this short list. None of those comparisons is XP per day. The table has no grow-time column, so it cannot name a fastest crop. A kale ranking that needed grow time, energy, and seed cost would be a different sheet.
      </p>

      <p>
        Starfruit at 43 versus cranberry extras splits the two jobs. Starfruit is a high per-harvest Farming XP crop. Cranberries pay 14 XP once per harvest, then pay again on the next harvest date; the extra berry in the same pull is gold, priced on the fall gold/day page, and 0 extra Farming XP. Blueberry is the summer version of that split: 10 XP for the first berry, no XP for the extras, gold/day on the summer page. Potato is the spring version: 14 XP, extra tuber ignored by the skill.
      </p>

      <p>
        Sweet Gem Berry at 64 is the highest value on the Farming XP tables. It is not Pierre’s default packet. Ancient Fruit at 38 is high and is not a seasonal Pierre packet either. Strawberry at 18 is a high spring harvest; the <a className="blog-planner-link" href="/best-spring-crop-stardew">spring crop guide</a> is the shop-gate page for that seed, including the fact that Year 1 cannot buy strawberries on Spring 1.
      </p>

      <p>
        If the job is stacking Farming XP:
      </p>

      <ul>
        <li>
          Prefer a harvest whose first product is a higher XP cell when you actually hold that seed.
        </li>
        <li>
          Count harvest events. A hops plant at 6 XP that you pick many times still pays 6 each time. A potato at 14 that drops two tubers still pays 14 once.
        </li>
        <li>
          Do not plant extra berries to “speed the skill.” They speed the shipping box, not the XP bar.
        </li>
        <li>
          When seed gold or watering energy is the limit, use the 5-XP animal actions and the 250-XP books. The wet-tile ceiling and the gold you can spend this morning are the same constraint as in <a className="blog-planner-link" href="/how-to-earn-money-stardew">how to earn money</a>.
        </li>
      </ul>

      <p>
        Derived, for the 100 XP that reaches level 1: Kale at 17 XP needs 6 harvests to pass 100 (derived: 6 × 17 = 102). Wheat at 6 XP needs 17 harvests (derived: 17 × 6 = 102). Those products compare plant counts to a total, not days in the ground.
      </p>

      <h2>Winter: outdoor harvest XP almost stops</h2>

      <p>
        <a href="https://stardewvalleywiki.com/Winter">Winter</a> is the season where almost no outdoor crop grows. The winter page names three outdoor plantables: Powdermelon Seeds, Winter Seeds, and Fiber Seeds. With ordinary plant growth stopped, it treats animal produce and the <a className="blog-planner-link" href="/glasshouse-stardew-valley">greenhouse</a> as the mainstay of farm produce.
      </p>

      <p>
        The Farming XP winter table has one crop row: powdermelon at 12 XP. That is the outdoor harvest XP that table scores in winter.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Winter_Seeds">Winter Seeds</a> do not print a Farming XP number on their own page. They also have no row on the Farming winter XP table. The Farming page and the Winter page disagree about whether wild-seed plants grant Farming XP, so there is no Winter Seeds or Wild Seeds Farming XP figure here, including 3 and including 0. Fiber Seeds can be planted in winter and do not need daily watering; that page is silent on Farming XP, so they get no XP number here either.
      </p>

      <p>
        The rest of the source map still works.
      </p>

      <p>
        Animals still grant 5 XP per pet, milking, shearing, or coop pickup. Truffles are still Foraging. An unread Almanac is still 250 Farming XP. An unread Book Of Stars is still 250 XP in every skill that is not already 10. Greenhouse plants still grant harvest XP on the first product of each harvest, including ancient fruit at 38 if that is what is in the bed. Indoor beds that keep producing in winter are the <a className="blog-planner-link" href="/glasshouse-stardew-valley">greenhouse page</a>.
      </p>

      <p>
        Powdermelon at 12 is a winter harvest, not a gold/day argument. The winter page also prints a gold/day cell for it; that cell is not XP. If you have powdermelon seeds, each harvest is 12 Farming XP on that table. If you do not, winter leveling is animals, books, and whatever still harvests inside.
      </p>

      <p>
        Winter is not an empty XP season on the current wiki: one winter XP-table crop at 12, books at 250, animals at 5, and greenhouse harvests remain on the source list. That is the 1.6.15 wiki reading, not a timed winter playthrough.
      </p>

      <p>
        Before you sleep, open the skills tab and read the Farming level that is already there. If it is the gate you named—5 at 2,150, 8 at 6,900, 9 at 10,000, 10 at 15,000—the XP for that gate is done and the popup still has to fire. If it is not, count the next first-product harvests, the 5-XP animal actions, and any unread Almanac or Book Of Stars against the remaining total. Do not count extra berries, extra potatoes, truffles, hoe swings, or watering-can swings.
      </p>

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-20 against Stardew Valley Wiki Farming (including Experience Points), Skills, Stardew Valley Almanac, Book Of Stars, Keg, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Seed Maker, Winter, and Winter Seeds. The wiki home names computer version 1.6.15. Winter Seeds Farming XP is not used: the Farming page and the Winter page disagree, and the Winter Seeds page does not print a number. No in-game harvest test was run. This site’s planner is a layout tool; it does not compute Farming XP or skill levels."
        items={[
          {
            href: "https://stardewvalleywiki.com/Stardew_Valley_Wiki",
            label: "Stardew Valley Wiki",
          },
          {
            href: "https://stardewvalleywiki.com/Farming",
            label: "Stardew Valley Wiki: Farming",
          },
          {
            href: "https://stardewvalleywiki.com/Farming#Experience_Points",
            label: "Stardew Valley Wiki: Farming (Experience Points)",
          },
          {
            href: "https://stardewvalleywiki.com/Skills",
            label: "Stardew Valley Wiki: Skills",
          },
          {
            href: "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
            label: "Stardew Valley Wiki: Stardew Valley Almanac",
          },
          {
            href: "https://stardewvalleywiki.com/Book_Of_Stars",
            label: "Stardew Valley Wiki: Book Of Stars",
          },
          {
            href: "https://stardewvalleywiki.com/Keg",
            label: "Stardew Valley Wiki: Keg",
          },
          {
            href: "https://stardewvalleywiki.com/Sprinkler",
            label: "Stardew Valley Wiki: Sprinkler",
          },
          {
            href: "https://stardewvalleywiki.com/Quality_Sprinkler",
            label: "Stardew Valley Wiki: Quality Sprinkler",
          },
          {
            href: "https://stardewvalleywiki.com/Iridium_Sprinkler",
            label: "Stardew Valley Wiki: Iridium Sprinkler",
          },
          {
            href: "https://stardewvalleywiki.com/Seed_Maker",
            label: "Stardew Valley Wiki: Seed Maker",
          },
          {
            href: "https://stardewvalleywiki.com/Winter",
            label: "Stardew Valley Wiki: Winter",
          },
          {
            href: "https://stardewvalleywiki.com/Winter_Seeds",
            label: "Stardew Valley Wiki: Winter Seeds",
          },
          {
            href: "https://stardewvalleyplanner.art/rancher-or-tiller-stardew",
            label: "This site: Rancher or Tiller",
          },
          {
            href: "https://stardewvalleyplanner.art/sprinkler-stardew",
            label: "This site: sprinklers",
          },
          {
            href: "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
            label: "This site: Year 1 gold",
          },
          {
            href: "https://stardewvalleyplanner.art/best-spring-crop-stardew",
            label: "This site: spring crops",
          },
          {
            href: "https://stardewvalleyplanner.art/summer-crops-stardew",
            label: "This site: summer crops",
          },
          {
            href: "https://stardewvalleyplanner.art/fall-crops-stardew",
            label: "This site: fall crops",
          },
          {
            href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
            label: "This site: greenhouse",
          },
        ]}
      />
    </article>
  );
}
