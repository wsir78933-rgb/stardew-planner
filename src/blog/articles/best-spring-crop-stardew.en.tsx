import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function BestSpringCropStardewEnglishArticle() {
  return (
    <article>
      <p>
        There is no single best spring crop. Year 1 Spring 1 is{" "}
        <a href="https://stardewvalleywiki.com/Pierre%27s_General_Store">Pierre&apos;s</a>{" "}
        <a href="https://stardewvalleywiki.com/Potato">potato</a> and{" "}
        <a href="https://stardewvalleywiki.com/Cauliflower">cauliflower</a>, while{" "}
        <a href="https://stardewvalleywiki.com/Strawberry">strawberries</a> wait for the{" "}
        <a href="https://stardewvalleywiki.com/Egg_Festival">Egg Festival</a> on Spring 13.
        Pick by year, remaining days, and gold, then sketch the bed so a cauliflower
        3-by-3, a strawberry patch, and sprinkler or scarecrow tiles do not overlap.
      </p>
      <p>
        The outdoor job is occupancy, not a ranking. A potato tile is free again after
        six growing days. A cauliflower 3-by-3 that you keep for a giant roll still
        occupies nine tiles on the morning you might want strawberries. A green-bean
        trellis occupies its tile until Summer 1 and blocks walking. Gold decides how
        many seeds you can buy; the watering can and the scarecrow decide how many of
        those seeds you can keep alive. Sketch that mix in the{" "}
        <a className="blog-planner-link" href="/#planner">
          planner
        </a>{" "}
        before you hoe a row you cannot water.
      </p>

      <h2>Best depends on year, gold, and the plot you can water</h2>
      <p>
        Year 1 Spring 1 is a Pierre morning. Potato seeds cost 50g and cauliflower seeds
        cost 80g. Strawberries are not in that shop. They sell at the Egg Festival booth
        for 100g each, unlimited, and only after you walk into Pelican Town between 9am
        and 2pm on Spring 13. Year 2 still uses that festival for strawberries, but
        Pierre then also sells garlic, and a repaired bus can reach Oasis rhubarb. Do
        not copy a Year 2 shopping list onto a Year 1 farm that cannot open those
        shops.
      </p>
      <p>
        Gold is the seed count, not a promise. Fifteen starter{" "}
        <a href="https://stardewvalleywiki.com/Parsnip">parsnip</a> seeds (20g to replace)
        are already in the mailbox on most farms;{" "}
        <a href="https://stardewvalleywiki.com/Farm_Maps">Meadowlands</a> gets 15 hay
        instead of those parsnips. After that, every extra potato is 50g and every extra
        cauliflower is 80g. Festival strawberries are 100g each. If you leave the festival
        with 2,000g in seeds and only twelve watered tiles, the extra seeds sit in a
        chest. Buy for the tiles you can hoe, water, and protect, not for a screenshot
        of a full backpack.
      </p>
      <p>
        The plot you can water is the real ceiling. Grow times on the wiki exclude the
        plant day and assume the seed is watered that same day. An unwatered day does
        not kill the crop; it also does not count as growth. A 12-day cauliflower that
        you skip on two dry mornings is a 14-day cauliflower. Year 1 energy is the
        watering can, not a Quality Sprinkler. Farming 2 unlocks the basic{" "}
        <a href="https://stardewvalleywiki.com/Sprinkler">Sprinkler</a>, which waters four
        orthogonal tiles and occupies the fifth. That machine tile is not a crop. If
        those four wet tiles are all you can keep wet without collapsing the rest of the
        day, plant four, not forty.
      </p>
      <p>
        Wiki gold/day figures are a named comparison, not a leaderboard and not a
        planner output. The{" "}
        <a href="https://stardewvalleywiki.com/Crops#Gold_per_Day">Crops</a> page computes
        them with no fertilizer and no Tiller. Potato uses 1.25 × 80g because extra
        harvests average about 0.25. Strawberry lists about 20.83g/day if planted on
        Spring 1 and about 11.67g/day if planted after the festival. Those two strawberry
        numbers are the same crop on two calendars. Quoting them does not mean the
        planner will pick strawberry for you.
      </p>
      <div
        aria-label="Year 1 spring crops wiki gold per day"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Seed source and price</th>
              <th scope="col">Grow / regrow</th>
              <th scope="col">Wiki gold/day, no fertilizer, no Tiller</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parsnip</td>
              <td>Pierre 20g; 15 starter seeds except Meadowlands</td>
              <td>4 days; max 6 harvests</td>
              <td>3.75g</td>
            </tr>
            <tr>
              <td>Potato</td>
              <td>Pierre 50g</td>
              <td>6 days; max 4 harvests</td>
              <td>about 8.33g (uses 1.25 × 80g)</td>
            </tr>
            <tr>
              <td>Cauliflower</td>
              <td>Pierre 80g</td>
              <td>12 days; one harvest per plant</td>
              <td>7.92g</td>
            </tr>
            <tr>
              <td>Green Bean</td>
              <td>Pierre 60g; trellis</td>
              <td>10 days, then every 3</td>
              <td>7.2g</td>
            </tr>
            <tr>
              <td>Strawberry, planted Spring 1</td>
              <td>Not Pierre; festival 100g</td>
              <td>8 days, then every 4; 5 harvests</td>
              <td>about 20.83g</td>
            </tr>
            <tr>
              <td>Strawberry, festival night</td>
              <td>Egg Festival booth 100g</td>
              <td>8 days, then every 4; 2 harvests without Speed-Gro</td>
              <td>about 11.67g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read the table as three questions. Can you buy it on the morning you want to
        plant? Can you water every tile every day, including the day you plant? Does the
        plant still occupy that tile on Spring 13 at 10pm, when strawberry seeds are in
        the backpack? A crop that wins wiki gold/day on a full season can still be the
        wrong occupant for a tile you already promised to strawberries.
      </p>
      <ul>
        <li>
          Year 1 Spring 1, gold tight, watering can only: potatoes on most tiles, a
          handful of parsnips from the starter pack, cauliflower only where you can
          spare 12 days and 80g.
        </li>
        <li>
          Year 1 Spring 1, enough gold for 80g seeds and a 3-by-3 you will keep wet:
          cauliflower in squares, potatoes on the leftover tiles that should empty
          before the festival.
        </li>
        <li>
          Year 1 Spring 13 night, gold for 100g seeds, tiles already hoed and watered:
          strawberries on those prepared tiles. Do not drop them on a live cauliflower
          3-by-3 or on a green-bean trellis.
        </li>
        <li>
          Year 2 or a repaired bus: rhubarb and garlic become shop options. They still
          need last-plant math and a bed that does not fight sprinklers.
        </li>
      </ul>

      <h2>Year 1 calendar: Spring 1 through Egg Festival night</h2>
      <p>
        Spring is 28 days. Outdoor crops that are out of season wither on Summer 1.
        Multi-season plants are a different list; the Year 1 Pierre potato and
        cauliflower are not on it. Plant on Spring 1, water that day, and a 4-day
        parsnip is ready on Spring 5, a 6-day potato on Spring 7, a 10-day green bean
        first pick on Spring 11, and a 12-day cauliflower on Spring 13. Those dates
        assume no missed watering and no{" "}
        <a href="https://stardewvalleywiki.com/Speed-Gro">Speed-Gro</a>. Pierre does
        not sell Speed-Gro until Spring 15 of year 1, so the first half of the season
        cannot buy that bottle from him.
      </p>
      <p>
        The wiki does not name a &quot;last plant day.&quot; The figures below are derived:
        28 minus grow days, for a harvest on Spring 28, excluding the plant day, with
        no Speed-Gro, and with the plant day watered. Cauliflower at 12 days last
        plants on Spring 16. Potato at 6 days last plants on Spring 22. Parsnip at 4
        days last plants on Spring 24. Green bean first pick at 10 days last plants on
        Spring 18. Strawberry for one pick at 8 days last plants on Spring 20. Rhubarb
        at 13 days last plants on Spring 15, which is not a Year 1 Spring 1 shop. If
        you skip a watering day, move the derived date earlier by each missed night.
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Year 1 spring crop calendar from Spring 1 Pierre seeds through Egg Festival night strawberries"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/year-1-spring-crop-calendar.webp"
          width="1672"
        />
        <figcaption>
          Year 1 spring occupancy from Pierre seeds on Spring 1 through strawberry
          planting after the Egg Festival returns you at 10pm.
        </figcaption>
      </figure>
      <p>
        A worked Year 1 potato cycle on one tile, watered every day, no Speed-Gro:
        plant Spring 1, harvest Spring 7, plant Spring 7, harvest Spring 13 in the
        morning, plant Spring 13 after the festival or the next morning, harvest
        Spring 19 or Spring 20 depending on that plant day, then one more cycle if
        the derived Spring 22 last-plant still holds. The wiki max for potato is 4
        harvests. That same tile on Spring 13 morning is empty after the second
        harvest, which is why it is a legal strawberry bed at 10pm if you re-water
        it before you leave town or after you return.
      </p>
      <p>
        Cauliflower on Spring 1 is ready on Spring 13, the festival morning. Harvest
        it before 9am if you want that tile for strawberries the same night. Leave it
        standing if that plant is one cell of a 3-by-3 you are holding for a giant
        roll. You cannot do both on the same nine tiles. Replanting cauliflower after
        a Spring 13 harvest needs 12 more days, so a second head is ready on Spring
        25 if you plant on 13 and never skip water. The derived last plant of Spring
        16 is the cutoff for a head that ripens on Spring 28 rather than withering
        as a stage-5 plant on Summer 1.
      </p>
      <p>
        The{" "}
        <a href="https://stardewvalleywiki.com/Egg_Festival">Egg Festival</a> is Spring
        13. Enter Pelican Town between 9am and 2pm. The day ends when you finish the
        Egg Hunt or leave town, and you return to the farm at 10pm. Pierre&apos;s booth
        sells strawberry seeds for 100g with no quantity cap. Buy them before you
        talk to Lewis. Talking to Lewis starts the hunt, and the hunt ends the
        festival; you cannot buy seeds after that. Odd-year and even-year booth
        layouts differ. In odd years you walk behind Pierre&apos;s shop to reach the
        counter.
      </p>
      <p>
        The 10pm hoe problem is energy and dirt, not a hidden plant rule. Planting
        after midnight still counts as the current day, and the wiki strawberry page
        treats festival night as a legal plant. What fails is a field that is still
        grass, stones, or dry untilled dirt when you land at 10pm with a watering can
        and almost no energy. Hoe, fertilize if you already own fertilizer, and water
        the strawberry tiles before you walk into town. Harvest any potato or
        cauliflower that should vacate those tiles in the morning. Then the 10pm job
        is placing seeds on wet soil, which costs no energy.
      </p>
      <div
        aria-label="Year 1 occupancy through Egg Festival night"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Tile job from Spring 1</th>
              <th scope="col">Ready date if watered daily</th>
              <th scope="col">Still occupied at festival 10pm?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Starter parsnip</td>
              <td>Spring 5, then replant</td>
              <td>Only if you replanted it after the last harvest</td>
            </tr>
            <tr>
              <td>Potato planted Spring 1</td>
              <td>Spring 7, then again Spring 13 if replanted on 7</td>
              <td>No, if you harvest the second potato that morning</td>
            </tr>
            <tr>
              <td>Cauliflower planted Spring 1, harvest</td>
              <td>Spring 13 morning</td>
              <td>No, after you harvest</td>
            </tr>
            <tr>
              <td>Cauliflower 3-by-3 held for giant</td>
              <td>Mature Spring 13; giant is a later 1% morning roll</td>
              <td>Yes, all nine tiles</td>
            </tr>
            <tr>
              <td>Green bean trellis planted Spring 1</td>
              <td>First pick Spring 11, then every 3 days</td>
              <td>Yes, until Summer 1; cannot walk through</td>
            </tr>
            <tr>
              <td>Empty, hoed, watered strawberry bed</td>
              <td>Ready for seeds at 10pm</td>
              <td>No crop until you plant</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <a href="https://stardewvalleywiki.com/Scarecrow">Scarecrows</a> start to
        matter when more than 15 outdoor plants have no scarecrow in range. Crows then
        eat crops. A scarecrow crafts at Farming 1 from 50 Wood, 1 Coal, and 20 Fiber,
        and the wiki range is about 8 tiles: a 17-by-17 area with the corners cut, 249
        spaces including the scarecrow&apos;s own tile. That own tile is not a parsnip.
        Place the scarecrow first if the bed will pass 15
        plants, then plant around it. Fifteen starter parsnips on a non-Meadowlands
        farm sit on the threshold; the sixteenth potato is the one that needs the
        post. Greenhouse crops do not need scarecrows for crows.
      </p>

      <h2>Strawberries after Spring 13</h2>
      <p>
        Strawberries are not a Pierre shop crop. The seed packet exists at the Egg
        Festival booth for 100g, unlimited. After the festival, you keep leftover
        seeds for next spring or for a greenhouse bed; you do not buy more from
        Pierre in year 1. Planted on Spring 1 they take 8 days and then regrow every
        4 days for 5 harvests. Planted on festival night they take 8 days to the
        first pick and, without Speed-Gro, you get 2 harvests before Summer 1. The
        wiki harvest table also lists 3 harvests once a 10% or stronger speed
        modifier is on the soil. Speed-Gro does not shorten the 4-day interval
        between later picks; it only shortens time to that first mature plant.
      </p>
      <p>
        Festival night is legal. The strawberry page says to till, fertilize, and
        water before the festival so seeds planted when you return at 10pm still get
        a full first night. Spring 14 morning is also legal; it is one day later, not
        the only allowed night. A day later is one less growing night. For a crop
        whose first pick is 8 days, that delay is the difference between a pick on
        Spring 21 and a pick on Spring 22, which still leaves a second pick on Spring
        25 or 26. It does not create a third pick without speed. Do not wait until
        Spring 20 unless you only want one berry: the derived last plant for a single
        8-day harvest on Spring 28 is Spring 20.
      </p>
      <p>
        Year 1 Speed-Gro from Pierre starts Spring 15 at 100g. You cannot buy that
        bottle on the festival morning. Twenty Speed-Gro is also the Spring Crops
        Bundle reward. The strawberry trivia note says three year-1 harvests need
        Speed-Gro and a Spring 13 plant, and that the easy bundle path is cauliflower
        planted on Spring 1 plus a Community Center visit after the festival and
        before the strawberry seeds go in. That is a wiki-stated route, not a
        requirement. If the bundle is unfinished, plant the berries on wet soil
        anyway and take two harvests.
      </p>
      <p>
        Extra fruit is a 2% chance per harvest, not a second guaranteed berry. Sell
        prices are 120g, 150g, 180g, and 240g by quality. Wiki jelly from a strawberry
        is 290g, which is the preserves formula 2 × 120 + 50, not a 160g jam figure.
        This layout job does not need artisan math. The occupancy question is how
        many tiles you empty on Spring 13 and how many 100g packets you can pay for.
      </p>
      <p>
        A strawberry bed fights a cauliflower 3-by-3 if they share tiles. It also
        fights a green-bean trellis, because you cannot walk through beans to harvest
        berries on the far side, and because pulling the trellis wastes the remaining
        3-day picks. It fights a scarecrow only when you plant the berry on the post
        tile. It fights a sprinkler when the machine sits on a soil square you wanted
        for a plant, or when a Beach Farm sand tile rejects the sprinkler and leaves
        the berry on the can. Keep strawberries in a rectangle you can reach without
        crossing trellis, with water coverage marked, and with the scarecrow outside
        the plants.
      </p>
      <ul>
        <li>
          Morning of Spring 13: harvest potatoes and any cauliflower that should
          vacate strawberry tiles. Water those empty tiles. Check that the scarecrow
          still covers the count you will have after planting.
        </li>
        <li>
          9am to 2pm: enter town, buy strawberry seeds first, then talk to Lewis if
          you want the hunt. Leaving town or finishing the hunt sends you home at
          10pm.
        </li>
        <li>
          10pm: plant on the prepared wet tiles. If a tile is still a live
          cauliflower in a giant square, skip it. If a tile was never hoed, you will
          likely lack the energy to hoe a large new field at 10pm.
        </li>
        <li>
          First pick without Speed-Gro: Spring 21 from a festival-night plant. Second
          pick: Spring 25. Summer 1 withers the plant.
        </li>
      </ul>
      <p>
        Wiki gold/day of about 11.67g after the festival is still a no-fertilizer,
        no-Tiller Crops-page number. It is lower than the Spring 1 figure because you
        lost three harvests, not because the berry changed. Year 2 can plant leftover
        seeds on Spring 1 and recover those five harvests. Year 1 cannot time-travel.
        Spend festival gold on the rectangle you already sketched, then stop buying
        when the next seed would land on an unmarked tile.
      </p>

      <h2>Plant cauliflower as a 3-by-3, not a row</h2>
      <p>
        Cauliflower is the only Year 1 Pierre spring crop that can become a{" "}
        <a href="https://stardewvalleywiki.com/Crops#Giant_Crops">giant crop</a>.
        Pierre sells the seed for 80g. It grows in 12 days. Sell prices are 175g,
        218g, 262g, and 350g by quality. A single row of cauliflower will mature and
        sell; it will not combine. Giants need a 3-by-3 of the same crop. Each morning,
        every overlapping 3-by-3 grid has a 1% chance to become a giant if the
        top-left crop is fully grown and watered and all nine plants are the same
        type. Version 1.6 made that watered tile the top-left; it used to be the
        center. A giant takes three axe hits and drops 15 to 21 regular-quality
        cauliflower. It does not form in the greenhouse, in garden pots, or on Ginger
        Island. It does survive a season change, so a giant that pops on Spring 28 is
        still there on Summer 1.
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Nine cauliflower plants in a 3-by-3 square with walking space around the block so a giant can form"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/spring-giant-cauliflower-3x3.webp"
          width="1672"
        />
        <figcaption>
          A 3-by-3 of cauliflower with the sprinkler and scarecrow kept off those
          nine tiles, which is the giant layout, not a harvest row.
        </figcaption>
      </figure>
      <p>
        Occupancy of that square is nine crop tiles from plant day until you harvest
        the heads or chop a giant. A Quality Sprinkler waters a 3-by-3 but sits in
        the center, so that center is a machine, not a cauliflower. You cannot have
        nine plants and a Quality Sprinkler in the same nine tiles. A basic sprinkler
        on an edge of the square occupies a tenth tile and waters only the orthogonal
        neighbor, so it does not wet the two corners beside it. Year 1 usually waters
        a giant square with the can. If you later own an Iridium Sprinkler, park it
        outside the nine so the 5-by-5 reach covers the block without eating a
        cauliflower tile. The{" "}
        <a className="blog-planner-link" href="/sprinkler-stardew">
          sprinkler guide
        </a>{" "}
        is the overlay for that machine math.
      </p>
      <p>
        Overlapping grids multiply the 1% rolls. A 3-by-4 of cauliflower contains two
        overlapping 3-by-3 grids. A 4-by-4 contains four. Each grid still needs its
        own top-left plant mature and watered. Leaving a dry top-left overnight is a
        skipped roll for that grid, not a dead plant. Do not treat a planner giant
        preview sprite as a rolled 1%. The sketch can show the 3-by-3 shape. The save
        still rolls in the morning.
      </p>
      <p>
        Jodi mails a cauliflower request on Spring 19. A 12-day plant that should be
        ready on Spring 19 must go in by Spring 7, derived the same way as last-plant
        math: request day minus grow days, excluding plant day, watered on plant day.
        A Spring 1 cauliflower is already harvestable on Spring 13, six days before
        the letter. Keep one head in a chest, or plant a second cauliflower on or
        before Spring 7. The Spring Crops Bundle also wants a cauliflower, along with
        a parsnip, a green bean, and a potato. Bundle crops can be a single plant
        each. They do not require a giant.
      </p>
      <p>
        A giant square that you keep past Spring 13 is nine tiles strawberries cannot
        use. That is the layout fork. Harvest the nine on festival morning and those
        tiles can take berries at 10pm. Keep the nine for more 1% mornings through
        the rest of Spring, and plant strawberries somewhere else, or skip berries on
        that block. Regular cauliflower that is still in the ground on Summer 1
        withers. Only the giant form survives the season change. If Summer 1 arrives
        and the square never popped, those tiles become dead crops you scythe.
      </p>
      <ul>
        <li>Hoe a 3-by-3, not a line of nine.</li>
        <li>Plant cauliflower in all nine cells. Mixed crops in the square cannot combine.</li>
        <li>Keep sprinklers and scarecrows off those nine cells.</li>
        <li>Water the top-left every day after the square is mature if you still want the 1% roll.</li>
        <li>Leave walking tiles around the block so an axe can reach a giant without crossing trellis.</li>
      </ul>

      <h2>Potatoes when gold is tight</h2>
      <p>
        Potato seeds are 50g at Pierre. They grow in 6 days. Sell prices are 80g,
        100g, 120g, and 160g by quality. Each harvest has a 0.2 chance to roll an
        extra potato, looping until the roll fails, which averages about 0.25 extra.
        Daily luck can double those extras. The Crops page therefore prices wiki
        gold/day at about 8.33g using 1.25 × 80g, still with no fertilizer and no Tiller. Max
        harvests in spring are 4. That is more cycles than cauliflower and cheaper
        seeds than strawberries.
      </p>
      <p>
        Gold-tight Year 1 means the 80g cauliflower and the 100g strawberry compete
        with tools, a backpack, and the next day&apos;s seeds. Ten potatoes are 500g.
        Ten cauliflower are 800g. Ten strawberries are 1,000g and cannot be bought
        until Spring 13. If the watering can can only cover twelve tiles, twelve
        potatoes at 50g each spend 600g and return four harvest windows on tiles
        planted from Spring 1. The same twelve tiles in cauliflower spend 960g and
        wait 12 days for the first head. Potatoes are the crop that matches a short
        gold stack to a short grow time.
      </p>
      <p>
        Occupancy is why potatoes pair with strawberries. Plant potatoes on the
        rectangle you already outlined as the festival bed. Harvest on Spring 7 and
        replant. Harvest again on Spring 13 morning. Those tiles are then empty,
        still tilled, and can be watered before you enter town. At 10pm they take
        strawberries. Tiles you instead want for a cauliflower 3-by-3 should never
        take this potato-then-berry sequence, because the 3-by-3 must stay cauliflower
        for overlapping grids. Tiles with green beans should not take it either: the
        trellis is still there on Spring 13.
      </p>
      <p>
        Parsnips are cheaper still, at 20g and 4 days, selling 35g, 43g, 52g, and 70g,
        with wiki gold/day 3.75g and a max of 6 harvests. They are the starter crop
        and the Getting Started quest, not a reason to skip potatoes once you have
        50g. Plant the fifteen starter seeds on Spring 1 (unless you are on
        Meadowlands and received hay). Replace them with potatoes or cauliflower when
        the gold and the water exist. A parsnip planted after the derived Spring 24
        last-plant will not ripen by Spring 28.
      </p>
      <div
        aria-label="Derived last plant days for a Spring 28 harvest"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Grow days</th>
              <th scope="col">Derived last plant for Spring 28</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parsnip</td>
              <td>4</td>
              <td>Spring 24</td>
            </tr>
            <tr>
              <td>Potato</td>
              <td>6</td>
              <td>Spring 22</td>
            </tr>
            <tr>
              <td>Strawberry, one pick</td>
              <td>8</td>
              <td>Spring 20</td>
            </tr>
            <tr>
              <td>Green bean, first pick</td>
              <td>10</td>
              <td>Spring 18</td>
            </tr>
            <tr>
              <td>Cauliflower</td>
              <td>12</td>
              <td>Spring 16</td>
            </tr>
            <tr>
              <td>Rhubarb</td>
              <td>13</td>
              <td>Spring 15</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        After Spring 22, potato is no longer a full harvest. After Spring 16,
        cauliflower is no longer a full harvest. Gold-tight players sometimes keep
        buying cauliflower on Spring 18 because the seed is still on Pierre&apos;s shelf.
        That plant withers on Summer 1 as an unfinished head. Spend the late-season
        50g on a potato only through Spring 22, then stop. Empty tiles at the end of
        Spring are cheaper than a seed that cannot finish.
      </p>

      <h2>Crops that are not a Year 1 default</h2>
      <p>
        <a href="https://stardewvalleywiki.com/Green_Bean">Green Bean</a> is a Pierre
        year-1 seed at 60g. It takes 10 days, then regrows every 3 days, and the wiki
        gold/day is 7.2g with no fertilizer and no Tiller. It is a Spring Crops
        Bundle crop, so one plant earns its keep. It is also a trellis: you cannot
        walk through it at any living stage. Dead beans after Summer 1 can be walked
        through. Plant beans in a single row or a double row with a walking lane, not
        as a ring around the cauliflower 3-by-3. A bean wall that blocks the axe path
        to a giant, or the harvest path to strawberries, is a layout failure even
        when the wiki gold/day looks fine. First pick from a Spring 1 plant is Spring
        11. The derived last plant for that first pick on Spring 28 is Spring 18.
        Beans planted on Spring 1 occupy their tiles through the festival; they are
        not a strawberry conversion crop.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Rhubarb">Rhubarb</a> seeds cost 100g at
        the Oasis after the bus is repaired, which means completing the Vault bundles
        or paying Joja 40,000g. Grow time is 13 days. Base sell starts at 220g. Wiki
        gold/day is about 9.23g with no fertilizer and no Tiller. This is not a Year
        1 Spring 1 plant. The derived last plant for a Spring 28 harvest is Spring
        15. If the bus is still broken on Spring 15, skip rhubarb for this season
        rather than buying a seed you cannot finish.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Garlic">Garlic</a> is a Pierre seed from
        year 2 onward. Do not recommend it as a Year 1 default. If you are already in
        year 2, it is a shop crop with its own grow time; it still has to fit the
        same watering and scarecrow overlay as potato and cauliflower.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Coffee_Bean">Coffee Bean</a> is a
        Traveling Cart special at 2,500g, or a 1% drop from Dust Sprites. Do not copy
        a 100g to 1,000g cart range onto this item; that range is other cart seeds,
        not the coffee special. It grows in 10 days, then produces every 2 days, four
        beans per harvest. It continues from Spring into Summer, so a Spring plant
        still occupies the tile after Summer 1 instead of withering. That occupancy
        is useful if you want coffee through two seasons and a problem if you wanted
        those tiles for a summer crop. Year 1 Spring 1 gold of 2,500g is rarely the
        right first purchase.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Carrot">Carrot</a> is a 1.6 crop. You
        cannot buy the seed for gold. Wiki gold/day is 11.67g because the seed price
        in that formula is 0g. The official{" "}
        <a href="https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/">
          1.6 changelog
        </a>{" "}
        adds seasonal wild seeds, including carrot. That figure is not a Year 1 buy
        plan and not a reason to skip Pierre potatoes.{" "}
        <a href="https://stardewvalleywiki.com/Ancient_Fruit">Ancient Fruit</a> is a
        28-day plant aimed at a greenhouse or other year-round bed, not this outdoor
        spring job. Giants cannot form in the greenhouse; if that indoor 10-by-12 is
        the next layout, open the{" "}
        <a className="blog-planner-link" href="/glasshouse-stardew-valley">
          glasshouse guide
        </a>
        . If the repaired building also needs to move, that outdoor footprint is the{" "}
        <a className="blog-planner-link" href="/carpenter-stardew">
          carpenter guide
        </a>
        , in one step, then come back to the outdoor spring bed.
      </p>

      <h2>Sketch the spring bed in the planner</h2>
      <p>
        Open the{" "}
        <a className="blog-planner-link" href="/#planner">
          planner
        </a>
        , choose the farm you actually play, and set the season to Spring. Standard
        is the starting map if you have not switched; a direct{" "}
        <a className="blog-planner-link" href="/?farmType=standard">
          Standard Farm map
        </a>{" "}
        link loads that layout. Search the catalog with English names: Cauliflower,
        Potato, Strawberry, Green Bean, Scarecrow, Sprinkler. Place crops, then turn
        on sprinkler and scarecrow overlays. Beach sand clogs sprinklers; if you play
        Beach Farm, keep machines on the non-sand patch. The 3-by-3 giant cauliflower
        preview sprite is a shape, not a 1% roll. The planner does not water, does
        not compute gold/day, does not buy festival seeds, and does not grow crops.
        Projects stay in this browser. The tool is fan-made and is not affiliated
        with or endorsed by ConcernedApe or Stardew Valley.
      </p>
      <p>
        Draw the conflict tiles first. Nine cells for cauliflower if you want a
        giant. A separate rectangle for strawberries that will be empty, hoed, and
        wet on Spring 13 at 10pm. Potato tiles that convert into that strawberry
        rectangle after the second harvest. One scarecrow tile once the outdoor
        count will pass 15 plants, sitting inside its 8-tile range and outside the
        crop cells. Sprinkler tiles that water potato or strawberry cells without
        punching a hole in the cauliflower 3-by-3. Green-bean trellis in a row with
        a walking lane, never as a fence across the strawberry harvest path.
      </p>
      <ol>
        <li>Select the farm type you play and set season to Spring.</li>
        <li>Place a cauliflower 3-by-3 with empty walking tiles around it.</li>
        <li>Place a strawberry rectangle that does not share those nine cells.</li>
        <li>Fill conversion tiles with potato if they must earn gold before Spring 13.</li>
        <li>Place one scarecrow that covers every outdoor plant once the count exceeds 15.</li>
        <li>Place sprinklers only on tiles that accept them, off the giant square.</li>
        <li>Place green beans in a line with a lane you can walk.</li>
        <li>Export or screenshot the sketch, then hoe those tiles in the save.</li>
      </ol>
      <p>
        Recheck after you add a chest, a path, or a coop, because those objects steal
        walking tiles the same way a trellis does. Recheck on Spring 12: every
        strawberry tile should already be tilled and watered in the game, matching
        the sketch. Recheck on Spring 16 if you still have cauliflower seeds, using
        the derived last-plant date, not a shop-stock date. The sketch is finished
        when the 3-by-3, the berry bed, the scarecrow, and the sprinklers do not
        share cells, and when every crop you drew has a watering plan you can
        actually perform with the can you own.
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "What is the best spring crop in Stardew Valley?",
            answer: (
              <p>
                There is no single best spring crop. Year 1 Spring 1 is Pierre potato (50g, 6 days) and cauliflower (80g, 12 days). Strawberries are 100g at the Egg Festival on Spring 13. Pick by year, remaining days, gold, and the tiles you can water.
              </p>
            ),
          },
          {
            question: "Can I plant strawberries the night of the Egg Festival?",
            answer: (
              <p>
                Yes. The festival returns you to the farm at 10pm, and planting after midnight still counts as that day. The wiki strawberry page tells you to till, fertilize, and water before the festival so the 10pm plant gets a full night. Spring 14 is one day later, not the only legal plant.
              </p>
            ),
          },
          {
            question: "How do I get a giant cauliflower?",
            answer: (
              <p>
                Plant a 3-by-3 of cauliflower. Each morning, each overlapping 3-by-3 has a 1% chance if the top-left plant is fully grown and watered and all nine are cauliflower. Chop with an axe (3 hits) for 15 to 21 regular-quality heads. Giants cannot form in the greenhouse, garden pots, or on Ginger Island. They survive the season change. Version 1.6 requires the top-left tile to be watered.
              </p>
            ),
          },
          {
            question: "What is the last day to plant cauliflower in spring?",
            answer: (
              <p>
                The wiki does not name a last plant day. Derived for a Spring 28 harvest, excluding the plant day, with no Speed-Gro and with watering on the plant day, cauliflower&apos;s 12 days give Spring 16. A later plant will not finish before Summer 1.
              </p>
            ),
          },
          {
            question: "Do I need a scarecrow for a small year 1 spring patch?",
            answer: (
              <p>
                Crows eat outdoor crops when more than 15 plants have no scarecrow in range. Fifteen starter parsnips sit on that line; a sixteenth plant needs a scarecrow. Craft it at Farming 1. The greenhouse does not need scarecrows for crows.
              </p>
            ),
          },
          {
            question: "Does Speed-Gro give a third strawberry harvest after the festival?",
            answer: (
              <p>
                Wiki harvest counts for a festival-night plant are 2 without a speed modifier and 3 with 10% or more. Speed-Gro is +10% (+20% with Agriculturist). Pierre sells it from Spring 15 year 1 for 100g, so year 1 festival morning cannot buy it there. It does not shorten the 4-day regrow interval.
              </p>
            ),
          },
          {
            question: "Does the planner calculate gold per day or buy strawberry seeds?",
            answer: (
              <p>
                No. It is a placement sketch. It can place crops and show sprinkler and scarecrow overlays. It does not water, does not compute gold/day, does not buy festival seeds, and does not grow crops.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-12 against Stardew Valley 1.6.15 wiki pages and the official 1.6 changelog. Last-plant dates are derived as 28 minus grow days for a harvest on Spring 28, excluding the plant day, with no Speed-Gro and with watering on the plant day. Wiki gold/day figures are the Crops page values with no fertilizer and no Tiller. The planner is a placement sketch, not a gold calculator or crop simulator."
        items={[
          {
            href: "https://stardewvalleywiki.com/Crops",
            label: "Stardew Valley Wiki: Crops",
          },
          {
            href: "https://stardewvalleywiki.com/Egg_Festival",
            label: "Stardew Valley Wiki: Egg Festival",
          },
          {
            href: "https://stardewvalleywiki.com/Parsnip",
            label: "Stardew Valley Wiki: Parsnip",
          },
          {
            href: "https://stardewvalleywiki.com/Potato",
            label: "Stardew Valley Wiki: Potato",
          },
          {
            href: "https://stardewvalleywiki.com/Cauliflower",
            label: "Stardew Valley Wiki: Cauliflower",
          },
          {
            href: "https://stardewvalleywiki.com/Strawberry",
            label: "Stardew Valley Wiki: Strawberry",
          },
          {
            href: "https://stardewvalleywiki.com/Green_Bean",
            label: "Stardew Valley Wiki: Green Bean",
          },
          {
            href: "https://stardewvalleywiki.com/Rhubarb",
            label: "Stardew Valley Wiki: Rhubarb",
          },
          {
            href: "https://stardewvalleywiki.com/Garlic",
            label: "Stardew Valley Wiki: Garlic",
          },
          {
            href: "https://stardewvalleywiki.com/Coffee_Bean",
            label: "Stardew Valley Wiki: Coffee Bean",
          },
          {
            href: "https://stardewvalleywiki.com/Carrot",
            label: "Stardew Valley Wiki: Carrot",
          },
          {
            href: "https://stardewvalleywiki.com/Ancient_Fruit",
            label: "Stardew Valley Wiki: Ancient Fruit",
          },
          {
            href: "https://stardewvalleywiki.com/Speed-Gro",
            label: "Stardew Valley Wiki: Speed-Gro",
          },
          {
            href: "https://stardewvalleywiki.com/Scarecrow",
            label: "Stardew Valley Wiki: Scarecrow",
          },
          {
            href: "https://stardewvalleywiki.com/Sprinkler",
            label: "Stardew Valley Wiki: Sprinkler",
          },
          {
            href: "https://stardewvalleywiki.com/Farm_Maps",
            label: "Stardew Valley Wiki: Farm Maps",
          },
          {
            href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
            label: "Stardew Valley Wiki: Pierre's General Store",
          },
          {
            href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
            label: "Stardew Valley 1.6 Update Full Changelog",
          },
        ]}
      />
    </article>
  );
}
