import { BlogSources } from "../../components/blog/blog-sources";

export function SummerCropsStardewEnglishArticle() {
  return (
    <article>
      <p>
        There is no single best outdoor summer crop.{" "}
        <a href="https://stardewvalleywiki.com/Starfruit">Starfruit</a> sits at
        the top of the wiki gold/day table only after you can reach{" "}
        <a href="https://stardewvalleywiki.com/Oasis">Oasis</a> and pay{" "}
        <a href="https://stardewvalleywiki.com/Starfruit_Seeds">400g</a> a seed;
        Year 1 at{" "}
        <a href="https://stardewvalleywiki.com/Pierre%27s_General_Store">
          Pierre’s
        </a>{" "}
        is a tile choice among{" "}
        <a href="https://stardewvalleywiki.com/Blueberry">blueberry</a>,{" "}
        <a href="https://stardewvalleywiki.com/Melon">melon</a>, and{" "}
        <a href="https://stardewvalleywiki.com/Hops">hops</a>; Year 2 puts{" "}
        <a href="https://stardewvalleywiki.com/Red_Cabbage">Red Cabbage</a> on
        that same table at about 17.78g/day. Rank by the shop you can open this
        morning, then by the{" "}
        <a href="https://stardewvalleywiki.com/Crops">Crops</a> gold/day figure,
        then by how many tiles you can water and whether that soil is still
        planted when you wanted the next crop.
      </p>
      <p>
        Spring-only plants{" "}
        <a href="https://stardewvalleywiki.com/Summer">wilt on Summer 1</a>. The
        outdoor summer job is the next 28 calendar days on the farm. If last
        season’s occupancy method is still open in another tab, the{" "}
        <a className="blog-planner-link" href="/best-spring-crop-stardew">
          spring crop guide
        </a>{" "}
        is the previous outdoor season on the same gold/day rules.
      </p>

      <h2>
        Best outdoor summer crop depends on year, the shop you can open, and the
        tiles you can water
      </h2>
      <p>
        Year 1 Summer 1 is a Pierre morning. The{" "}
        <a href="https://stardewvalleywiki.com/Pierre%27s_General_Store">
          summer counter
        </a>{" "}
        runs 9am–5pm; you can enter the shop until 9pm.{" "}
        <a href="https://stardewvalleywiki.com/Starfruit_Seeds">
          Starfruit seeds
        </a>{" "}
        are not on that shelf and are not a Joja summer packet either. Pierre
        sells{" "}
        <a href="https://stardewvalleywiki.com/Red_Cabbage">Red Cabbage</a> from
        year 2.
      </p>
      <p>
        Oasis is a different door. Sandy’s shop in the{" "}
        <a href="https://stardewvalleywiki.com/The_Desert">Calico Desert</a> is
        open 9am–11:50pm.{" "}
        <a href="https://stardewvalleywiki.com/Starfruit_Seeds">
          Starfruit Seeds
        </a>{" "}
        cost <strong>400g</strong> there. The desert stays locked until the bus
        is repaired: complete the four{" "}
        <a href="https://stardewvalleywiki.com/Bundles">Vault</a> gold bundles
        for 42,500g (2,500g + 5,000g + 10,000g + 25,000g), or pay Joja’s Bus
        Repair for 40,000g. A{" "}
        <a href="https://stardewvalleywiki.com/Bus_Stop">bus ticket</a> is 500g,
        and Pam drives 10am–5pm. Year 1 starfruit is an access problem. Pierre
        did not forget the seed.
      </p>
      <p>
        The watering-can rectangle is the Year 1 plant count. Buy one seed per
        tile you can water on the plant day and on the days after, then stop —
        the same wet-tile rule as in{" "}
        <a className="blog-planner-link" href="/how-to-earn-money-stardew">
          how to earn money
        </a>
        .
      </p>
      <p>
        Wiki gold/day is a named comparison from the{" "}
        <a href="https://stardewvalleywiki.com/Crops">Crops</a> page, not a
        promise and not a planner output. The formula is{" "}
        <code>
          ((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days
        </code>
        , with{" "}
        <code>
          Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to
          Regrow)
        </code>
        . The published figures assume no fertilizer, no crop quality, no
        Tiller, and no Agriculturist. The plant is watered on the plant day.
        Grow times exclude that plant day. An unwatered day does not kill the
        plant and does not count as growth. Extra fruit chances are omitted
        except potato, which is not a summer crop. The{" "}
        <a href="https://stardewvalleywiki.com/Summer">Summer</a> blueberry cell
        already prices three berries as <code>50g (x3)</code>. Do not add
        blueberry’s extra 2%, tomato’s extra 5%, or hot pepper’s extra 3% on top
        of those gold/day cells.
      </p>
      <p>
        A season-total on one tile is a different metric. Starfruit’s wiki
        gold/day of about 26.92g is one 13-day cycle: (750g − 400g) / 13. Two
        finished cycles in summer are a different pile of gold. Do not treat
        that pile as the wiki gold/day cell, and do not mix the two into one
        “most profitable” name.
      </p>

      <h2>
        Rank the outdoor summer field on one gold/day table, with access on the
        same rows
      </h2>
      <p>
        The <a href="https://stardewvalleywiki.com/Summer">Summer</a> crop
        tables and the matching crop pages supply the numbers. Rows are ordered
        by wiki gold/day so you can pick, not so the first row is always legal
        on your save.
      </p>
      <div
        aria-label="Summer crops wiki gold per day with access"
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
              <th scope="col">
                Wiki max harvests (no fertilizer, no Agriculturist)
              </th>
              <th scope="col">Wiki gold/day (no fertilizer, no Tiller)</th>
              <th scope="col">Access / occupancy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Starfruit">Starfruit</a>
              </td>
              <td>
                <a href="https://stardewvalleywiki.com/Starfruit_Seeds">Oasis</a>{" "}
                400g
              </td>
              <td>13 days</td>
              <td>2</td>
              <td>about 26.92g</td>
              <td>
                Bus repaired and Oasis open. Derived last plant 15 for a Summer
                28 harvest.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Blueberry">Blueberry</a>
              </td>
              <td>Pierre 80g</td>
              <td>13 days, then every 4</td>
              <td>4</td>
              <td>20.8g</td>
              <td>
                Year 1 Pierre. Three berries per pick already in the 20.8g cell.
                Planted Summer 1, watered daily, no Speed-Gro: picks on 14, 18,
                22, and 26.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Red_Cabbage">
                  Red Cabbage
                </a>
              </td>
              <td>Pierre 100g, year 2+</td>
              <td>9 days</td>
              <td>3</td>
              <td>about 17.78g</td>
              <td>
                Not a Year 1 Pierre default. Year 1 only from the Traveling Cart
                or Skull Cavern.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Melon">Melon</a>
              </td>
              <td>Pierre 80g</td>
              <td>12 days</td>
              <td>2</td>
              <td>about 14.17g</td>
              <td>
                Year 1 Pierre. Giant-crop candidate. Derived last plant 16. A
                held 3-by-3 occupies nine tiles until you harvest or chop.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Hops">Hops</a>
              </td>
              <td>Pierre 60g, trellis</td>
              <td>11 days, then every day</td>
              <td>17</td>
              <td>about 13.52g</td>
              <td>
                Year 1 Pierre. You cannot walk through any living stage. Planted
                Summer 1: first pick on day 12, then daily through 28 (17
                picks).
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Summer_Squash">
                  Summer Squash
                </a>
              </td>
              <td>0g in the gold/day formula</td>
              <td>6 days, then every 3</td>
              <td>8</td>
              <td>about 13.33g</td>
              <td>
                Seeds are{" "}
                <a href="https://stardewvalleywiki.com/Summer_Squash_Seeds">
                  not sold for gold
                </a>{" "}
                at Pierre, Joja, or the Traveling Cart. The 0g input is not a
                shop price.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Hot_Pepper">Hot Pepper</a>
              </td>
              <td>Pierre 40g</td>
              <td>5 days, then every 3</td>
              <td>8</td>
              <td>about 10.77g</td>
              <td>Year 1 Pierre.</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Tomato">Tomato</a>
              </td>
              <td>Pierre 50g</td>
              <td>11 days, then every 4</td>
              <td>5</td>
              <td>about 9.26g</td>
              <td>Year 1 Pierre.</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Radish">Radish</a>
              </td>
              <td>Pierre 40g</td>
              <td>6 days</td>
              <td>4</td>
              <td>about 8.33g</td>
              <td>Year 1 Pierre. Derived last plant 22.</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Corn">Corn</a>
              </td>
              <td>Pierre 150g</td>
              <td>14 days, then every 4</td>
              <td>4 in summer, or 11 across summer and fall</td>
              <td>about 1.92g summer only; about 7.41g across both seasons</td>
              <td>
                Year 1 Pierre. A plant on Summer 28 continues on Fall 1 and
                keeps fertilizer under the tile.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Poppy">Poppy</a>
              </td>
              <td>Pierre 100g</td>
              <td>7 days</td>
              <td>3</td>
              <td>about 5.71g</td>
              <td>Year 1 Pierre. Derived last plant 21.</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Summer">Summer Spangle</a>
              </td>
              <td>Pierre 50g</td>
              <td>8 days</td>
              <td>3</td>
              <td>5g</td>
              <td>Year 1 Pierre.</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Wheat">Wheat</a>
              </td>
              <td>Pierre 10g</td>
              <td>4 days</td>
              <td>6 in summer, or 13 across summer and fall</td>
              <td>3.75g</td>
              <td>
                Year 1 Pierre. Multi-season. Derived last plant 24 for a harvest
                still on Summer 28.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Sunflower">Sunflower</a>
              </td>
              <td>Pierre 200g</td>
              <td>8 days</td>
              <td>3 in summer, or 6 across summer and fall</td>
              <td>
                <strong>−15g</strong>
              </td>
              <td>
                Year 1 Pierre. Multi-season. Negative because the seed is 200g
                and the flower sells for 80g.
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Coffee_Bean">
                  Coffee Bean
                </a>
              </td>
              <td>Not Pierre’s summer counter</td>
              <td>10 days, then every 2</td>
              <td>source-dependent</td>
              <td>wiki gold/day changes with the seed source</td>
              <td>
                Traveling Cart special 2,500g (25% in fall and winter) is not
                the same packet as the cart’s 100g–1,000g range. Dust Sprites
                drop a bean at 1%. Spring plants continue into summer.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Table notes. Blueberry’s 20.8g uses three 50g berries per harvest:
        growing days are 13 + (4 − 1) × 4 = 25, and ((4 × 150g) − 80g) / 25 =
        20.8g.
      </p>
      <p>Read the table as three questions.</p>
      <ul>
        <li>Can you buy that seed on the morning you want to plant?</li>
        <li>
          Can you water that tile on the plant day and on every day that still
          counts as growth?
        </li>
        <li>
          Is the tile still occupied on the morning you wanted a second melon, a
          melon 3-by-3, or a hops harvest path?
        </li>
      </ul>
      <p>
        A crop that wins gold/day on a full season can still be the wrong
        occupant for a tile you already promised to something else.
      </p>
      <p>
        The wiki does not name a “last plant day.” For a single-harvest crop
        that must ripen on Summer 28, the derived date is{" "}
        <code>28 − grow days</code>, excluding the plant day, with no Speed-Gro,
        and with the plant day already watered. Miss a watering night and move
        the date earlier by each missed night. Pierre sells Speed-Gro from
        Spring 15 of year 1 at 100g; the dates below ignore that bottle because
        the gold/day table ignores fertilizer.
      </p>
      <div
        aria-label="Derived last plant days for a Summer 28 harvest"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Grow days</th>
              <th scope="col">Derived last plant for a Summer 28 harvest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Wheat</td>
              <td>4</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Radish</td>
              <td>6</td>
              <td>22</td>
            </tr>
            <tr>
              <td>Poppy</td>
              <td>7</td>
              <td>21</td>
            </tr>
            <tr>
              <td>Sunflower</td>
              <td>8</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Red Cabbage</td>
              <td>9</td>
              <td>19</td>
            </tr>
            <tr>
              <td>Melon</td>
              <td>12</td>
              <td>16</td>
            </tr>
            <tr>
              <td>Starfruit</td>
              <td>13</td>
              <td>15</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Wheat and sunflower are multi-season, so day 24 and day 20 are last
        dates for a harvest that still lands on Summer 28, not a claim that the
        plant dies if you sow later. Melon, starfruit, poppy, radish, and red
        cabbage are summer crops on this table: a seed bought after the derived
        date finishes the season as an unfinished stage and{" "}
        <a href="https://stardewvalleywiki.com/Summer">wilts on Fall 1</a> the
        same way spring-only crops wilt on Summer 1.
      </p>
      <p>
        Blueberry and hops do not get a four-harvest or seventeen-harvest “last
        plant” name here. Count them on the calendar with the same public rule.
        Blueberry first pick is plant day plus 13, then every 4 days through 28.
        Hops first pick is plant day plus 11, then every day through 28.
      </p>
      <figure className="blog-article-media">
        <img
          alt="Calendar schematic of Summer 1–28 occupancy: blueberry picks on 14, 18, 22, and 26; hops from day 12 through 28; melon last-plant 16; starfruit last-plant 15. Not a screenshot."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/summer-crop-occupancy-calendar.webp"
          width="1672"
        />
        <figcaption>
          Summer 1–28 occupancy on one tile, planted on Summer 1, watered every
          day, with no Speed-Gro. Blueberry picks land on 14, 18, 22, and 26, so
          the tile is still planted on the mornings you might have wanted a
          second melon. Hops first pick is day 12, then daily through 28 (17
          picks). Melon needs 12 growing days; the derived last plant for a
          Summer 28 harvest is 16. Starfruit needs 13 growing days; the derived
          last plant is 15. Last-plant dates are derived as 28 minus grow days,
          not a wiki field name. Read which mornings the tile is still occupied
          before you buy the next seed.
        </figcaption>
      </figure>

      <h2>Year 1 with no desert: blueberries, melons, and hops on different tiles</h2>
      <p>
        Without a repaired bus, drop Starfruit off the default shopping list.
        The highest wiki gold/day on the Pierre summer counter is blueberry at
        20.8g. Melon at about 14.17g and hops at about 13.52g are lower on that
        same no-fertilizer, no-Tiller scale. They are still worth tiles, because
        they do not occupy soil the same way. The Year 1 outdoor choice is which
        tiles you give to which of those three, not a single first-place crop
        copied onto every hoe mark.
      </p>

      <h3>Blueberries occupy the tile through the late-month picks</h3>
      <p>
        Pierre sells blueberry seeds for 80g. The plant takes 13 days, then
        produces every 4 days. Each harvest is three berries. Sell prices are
        50g, 62g, 75g, and 100g by quality. Fertilizer quality applies to the
        first berry only. Wiki gold/day is 20.8g with no fertilizer and no
        Tiller, using the three-berry harvest already printed on the Summer
        table.
      </p>
      <p>
        Plant on Summer 1, water every day, use no Speed-Gro, and the picks are
        Summer 14, 18, 22, and 26. That is four harvests, which is the wiki
        maximum. The tile is not empty after the first pick. It is still a
        blueberry on Summer 16, when a late melon seed would still finish, and
        it is still a blueberry on Summer 26, two days before the season ends.
        If you wanted that tile for a second 12-day melon, the blueberry already
        spent it.
      </p>
      <p>
        On a Year 1 farm that cannot open Oasis, 20.8g is the highest Pierre
        outdoor gold/day on the table. The crop also asks for less replanting
        than melon. That is occupancy and a published gold/day cell, not a
        separate “low maintenance” score. Extra berries at 2% per harvest stay
        outside the 20.8g figure; do not add them to beat melon on paper.
      </p>

      <h3>Melons are a 12-day crop and the summer giant</h3>
      <p>
        Pierre sells melon seeds for 80g. Grow time is 12 days. Sell prices are
        250g, 312g, 375g, and 500g by quality. Wiki gold/day is about 14.17g:
        (250g − 80g) / 12. Max harvests in summer are 2. Planted on Summer 1 and
        watered every day, a melon is ready on Summer 13. Harvest and replant
        the same day and the second head is ready on Summer 25. The derived last
        plant for a head that ripens on Summer 28 is Summer 16. A seed bought on
        Summer 17 does not finish before Fall 1.
      </p>
      <p>
        Melon is one of the five{" "}
        <a href="https://stardewvalleywiki.com/Crops">giant crops</a>. Giants
        need a 3-by-3 of the same crop. Each morning, every overlapping 3-by-3
        grid has a 1% chance to combine if the top-left plant is fully grown and
        watered and all nine plants are the same type. A giant takes three axe
        hits and drops 15 to 21 regular-quality melons. It cannot form in the
        greenhouse, in garden pots, or on Ginger Island. It does not die at the
        season change, so a giant that pops on Summer 28 is still there on Fall
        1. A regular melon still in the ground on Fall 1 wilts.
      </p>
      <p>
        Those nine tiles stay melon from the plant day until you harvest the
        heads or chop a giant. You cannot also run a second 12-day cycle on the
        same nine tiles while you keep them for more 1% mornings. A 3-by-4 of
        melon contains two overlapping 3-by-3 grids; a 4-by-4 contains four.
        Each grid still needs its own top-left plant mature and watered. Leaving
        the top-left dry overnight skips that grid’s roll; it does not kill the
        plants.
      </p>
      <p>
        If a Quality Sprinkler sits in the center of the square, that center is
        a machine, not a melon, and the nine cells are not the same crop. Keep
        scarecrows off those nine cells for the same reason: the post is not a
        melon. Sprinkler reach and unlock tiers are the{" "}
        <a className="blog-planner-link" href="/sprinkler-stardew">
          sprinkler guide
        </a>
        . Year 1 usually waters a giant square with the can. The can has to
        reach the top-left every morning you still want the roll.
      </p>

      <h3>Hops pay 17 picks and block walking</h3>
      <p>
        Pierre sells hops starter for 60g. The plant takes 11 days, then
        produces every day. You cannot walk through hops at any living stage.
        Wiki gold/day is about 13.52g, which is below blueberry’s 20.8g on the
        same table. Planted on Summer 1, the first pick is day 12, then every
        day through 28, which is 17 picks and matches the wiki maximum.
      </p>
      <p>
        Hops in a keg become Pale Ale. The hops infobox lists artisan base 300g
        (420g with Artisan). That sell price is a different comparison. This
        table does not rank Pale Ale, does not time a keg, and does not move
        hops above blueberry because a barrel exists.
      </p>
      <p>
        Layout is the hops cost that gold/day does not show. Plant a single row,
        or a double row with a walking lane. Do not ring a melon 3-by-3 with
        hops, and do not plant hops across the axe path you will need if a giant
        forms. Dead trellis after the plant wilts is a later problem. While the
        hops are alive, the tile is a wall.
      </p>
      <p>Year 1, watering can, no desert:</p>
      <ul>
        <li>
          Most wet tiles: blueberry, the highest Pierre gold/day on this table.
        </li>
        <li>
          One melon 3-by-3 only if you will water all nine every day and accept
          that those tiles stay melon.
        </li>
        <li>
          One hops row only where a walking tile already exists and you accept a
          trellis you cannot cross.
        </li>
      </ul>
      <p>Do not copy all three onto the same cells.</p>

      <h2>
        After the bus, and in Year 2: Starfruit and Red Cabbage join the same
        ranking
      </h2>
      <p>
        Repairing the bus does not rewrite blueberry, melon, or hops occupancy.
        It adds a legal row at the top of the same gold/day table. Year 2 does
        the same for red cabbage on Pierre’s counter. Read those rows as access,
        then plant them on tiles the Year 1 trio is not already using.
      </p>

      <h3>Starfruit at Oasis, 400g a seed</h3>
      <p>
        Starfruit grows in 13 days. Sell prices are 750g, 937g, 1125g, and 1500g
        by quality. It is the second-highest crop sell price after Sweet Gem
        Berry. Wiki gold/day is about 26.92g, the highest outdoor summer cell on
        the table. Max harvests are 2. Planted on Summer 1, the first fruit is
        ready on Summer 14. Replant on 14 and the second is ready on Summer 27.
        The derived last plant for a fruit that ripens on Summer 28 is Summer
        15. A seed bought on Summer 16 does not finish.
      </p>
      <p>
        Seeds cost 400g at Oasis. The Traveling Cart sells them for 600g–1,000g.
        Gunther gives one seed after 15 museum donations. A Seed Maker can
        produce more. Skull Cavern treasure chests can drop 5–20 seeds. Those
        routes exist; they do not put starfruit on Pierre’s Year 1 summer
        counter. If the bus is still broken, do not write starfruit onto the
        default shopping list because a cart might roll it.
      </p>
      <p>
        The Luau sells one starfruit per year for 3,000g. That is a festival
        shop aside, not a field plan and not a gold/day cell.
      </p>
      <p>
        Starfruit still needs 13 watered days on every tile you plant. The
        26.92g figure assumes that watering happened. A desert trip that buys
        more 400g packets than the can can cover is a gold spend, not a higher
        gold/day. Keep hops off the walking tiles you use to reach those plants,
        and keep starfruit out of a melon 3-by-3 you are holding for a giant.
      </p>

      <h3>Red Cabbage is a Year 2 Pierre seed</h3>
      <p>
        Red cabbage grows in 9 days. It sells for 260g. Wiki gold/day is about
        17.78g, between blueberry’s 20.8g and melon’s about 14.17g on the same
        table. Pierre sells the seed for 100g from year 2. Max harvests are 3.
        Planted on Summer 1, a head is ready on Summer 10; replant on 10 for
        Summer 19; replant on 19 for Summer 28, which is also the derived last
        plant. The tile empties three times in the month if you harvest and sow
        again. A blueberry tile planted on Summer 1 does not empty until after
        the 26th pick. Dye Bundle identity is a bundle tag on the same crop, not
        a reason to clear blueberry rows.
      </p>
      <p>
        When the bus is open and you can water 13-day tiles, starfruit is first
        on this gold/day scale. In year 2 without a desert, red cabbage enters
        Pierre’s table and still sits below blueberry’s 20.8g. Neither crop
        cancels hops as a walking wall or melon as a nine-tile hold.
      </p>

      <h2>Last plant days, and crops that lose the outdoor rank</h2>
      <p>
        Use the derived last-plant table before a late Pierre or Oasis trip. The
        shop can still sell the packet on a day that will not finish. The
        calendar does not owe you a harvest.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Sunflower">Sunflower</a> looks
        like a summer crop on Pierre’s counter at 200g. Wiki gold/day is −15g
        because the seed costs 200g and the flower sells for 80g. Harvest also
        returns 0–2 sunflower seeds at equal chance. That return does not turn
        the published gold/day cell positive. Plant sunflower if you want the
        flower, not if you are filling tiles from the top of the gold/day table.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Corn">Corn</a> is a 150g Pierre
        seed that takes 14 days, then produces every 4 days, and sells for 50g.
        Summer-only wiki gold/day is about 1.92g. Across summer and fall it is
        about 7.41g, still below radish’s 8.33g and far below blueberry. A plant
        placed on Summer 28 continues on Fall 1 and keeps fertilizer under the
        tile. That is a two-season occupant, not a summer gold/day winner. Do
        not buy corn to “win summer” on the 1.92g cell.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Summer_Squash">Summer squash</a>{" "}
        shows about 13.33g, next to hops at about 13.52g, because the formula
        seed price is 0g. The seeds are not sold for gold at Pierre, Joja, or
        the Traveling Cart. They come from seed spots, raccoon requests, the
        raccoon wife’s shop for 15 sap, golden fishing chests, a Seed Maker, and
        other 1.6 routes; most of those routes run only Spring 24–Summer 20,
        except the raccoon wife shop and the Seed Maker. Treat 13.33g as a
        formula result for a seed you already have, not as a Pierre field you
        can scale with gold.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Coffee_Bean">Coffee Bean</a> is
        not on Pierre’s summer counter. Dust Sprites drop it at 1%. The
        Traveling Cart’s 2,500g special appears 25% of the time in fall and
        winter; the cart’s 100g–1,000g range is a different listing that can
        appear in all seasons. Do not copy 2,500g onto a Year 1 summer default,
        and do not mix the two cart prices. Grow time is 10 days, then every 2
        days, four beans per harvest, in spring and summer. A coffee plant that
        was already in the ground in spring does not wilt on Summer 1. It keeps
        the tile you may have wanted for blueberry, melon, hops, or starfruit.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Ancient_Fruit">Ancient Fruit</a>{" "}
        takes 28 days, then produces every 7 days, and sells for 550g. It grows
        in spring, summer, and fall. Planted on Summer 1, the first harvest is
        day 1 of the next season, not a summer shipping-box crop.{" "}
        <a href="https://stardewvalleywiki.com/Ancient_Seeds">Ancient Seeds</a>{" "}
        are not sold at Pierre, Joja, or the cart. You craft them after donating
        the artifact, or you roll a 0.5% Seed Maker chance from other crops.
        They cannot go in a garden pot. They can go in a greenhouse. Year-round
        beds and that indoor 10-by-12 are the{" "}
        <a className="blog-planner-link" href="/glasshouse-stardew-valley">
          greenhouse guide
        </a>
        , not this outdoor table.
      </p>
      <p>
        Wheat, radish, poppy, summer spangle, hot pepper, and tomato stay on the
        gold/day table so you can see they are legal Pierre seeds with lower
        cells than blueberry. Hot pepper at about 10.77g and tomato at about
        9.26g look busy because they regrow; they still lose to blueberry’s
        20.8g on the published scale. Radish turns tiles over every 6 days and
        still lands at about 8.33g. Wheat at 3.75g is a 10g seed and a scythe
        crop, not a summer rank winner. Poppy at about 5.71g is a 7-day flower;
        bee-house poppy honey sells for 380g against 100g for regular honey,
        which is a hive aside and does not move poppy above blueberry on the
        crop table.
      </p>

      <h2>
        Put hops, a melon 3-by-3, and blueberry rows on one bed without sharing
        walking tiles
      </h2>
      <p>
        Gold/day does not place the plants. On one outdoor bed you still have to
        walk, water, and, if a giant forms, swing an axe. Hops block that walk.
        A melon 3-by-3 needs nine matching plants and a reachable top-left.
        Blueberry wants a rectangle you can harvest on 14, 18, 22, and 26
        without crossing trellis.
      </p>
      <figure className="blog-article-media">
        <img
          alt="Bed grid schematic: hops row with a walk tile, melon 3-by-3 with marked top-left, blueberry rectangle not behind hops. Not a 1% giant already rolled."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/summer-hops-melon-blueberry-bed.webp"
          width="1672"
        />
        <figcaption>
          Occupancy on one bed, not a 1% giant already rolled. North (or one
          side): a hops row plus at least one walking tile. One melon 3-by-3
          with the top-left cell marked, all nine melon, no sprinkler or
          scarecrow inside the square. A blueberry rectangle that does not
          overlap those nine tiles and does not sit behind a hops wall. A hops
          ring around the melon is the failed layout: you cannot walk through
          living hops to water the top-left or to chop a giant. This grid uses
          the wiki trellis and giant rules.
        </figcaption>
      </figure>
      <ol>
        <li>Hoe a 3-by-3, not a line of nine.</li>
        <li>Plant melon in all nine cells. Mixed crops in that block cannot combine.</li>
        <li>Keep hops in a row with a walking lane. Do not ring the nine.</li>
        <li>
          Put blueberries in a rectangle you can reach without crossing that
          trellis.
        </li>
        <li>
          Keep sprinklers and scarecrows off the melon nine, and water the
          top-left, using the same giant-square rules as the melon section
          above.
        </li>
      </ol>
      <p>
        If you want that same 3-by-3 and hops row on the farm map you actually
        play, open the{" "}
        <a className="blog-planner-link" href="/#planner">
          planner
        </a>{" "}
        and switch the season to Summer. The tool can place crops on the eight
        farm maps plus Ginger Island and can show sprinkler and scarecrow
        coverage; projects stay in the browser. It does not compute gold/day,
        last-plant dates, or giant 1% rolls.
      </p>
      <p>
        Before you pay Pierre or Sandy, walk the tiles you can water tomorrow.
        For each wet tile, name the crop, the shop that can sell the seed this
        morning, and the next date that tile is empty or blocked. If the shop is
        Oasis and the bus is still down, skip starfruit. If the seed is red
        cabbage and the year is still 1, skip the Pierre row. If the tile is
        already promised to a blueberry pick on the 26th, a melon 3-by-3, or a
        hops wall, buy the seed that matches that promise, not the first row of
        the table.
      </p>

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-13 against Stardew Valley Wiki Summer, Crops, and the crop pages listed below. Last-plant dates are derived as 28 minus grow days for a harvest on Summer 28, excluding the plant day, with no Speed-Gro and with watering on the plant day. Wiki gold/day figures are the Crops page values with no fertilizer and no Tiller. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls."
        items={[
          {
            href: "https://stardewvalleywiki.com/Summer",
            label: "Stardew Valley Wiki: Summer",
          },
          {
            href: "https://stardewvalleywiki.com/Crops",
            label: "Stardew Valley Wiki: Crops (gold per day)",
          },
          {
            href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
            label: "Stardew Valley Wiki: Pierre's General Store (Summer Stock)",
          },
          {
            href: "https://stardewvalleywiki.com/Starfruit",
            label: "Stardew Valley Wiki: Starfruit",
          },
          {
            href: "https://stardewvalleywiki.com/Starfruit_Seeds",
            label: "Stardew Valley Wiki: Starfruit Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Oasis",
            label: "Stardew Valley Wiki: Oasis",
          },
          {
            href: "https://stardewvalleywiki.com/The_Desert",
            label: "Stardew Valley Wiki: The Desert",
          },
          {
            href: "https://stardewvalleywiki.com/Bus_Stop",
            label: "Stardew Valley Wiki: Bus Stop",
          },
          {
            href: "https://stardewvalleywiki.com/Bundles",
            label: "Stardew Valley Wiki: Bundles (Vault)",
          },
          {
            href: "https://stardewvalleywiki.com/Blueberry",
            label: "Stardew Valley Wiki: Blueberry",
          },
          {
            href: "https://stardewvalleywiki.com/Melon",
            label: "Stardew Valley Wiki: Melon",
          },
          {
            href: "https://stardewvalleywiki.com/Hops",
            label: "Stardew Valley Wiki: Hops",
          },
          {
            href: "https://stardewvalleywiki.com/Red_Cabbage",
            label: "Stardew Valley Wiki: Red Cabbage",
          },
          {
            href: "https://stardewvalleywiki.com/Corn",
            label: "Stardew Valley Wiki: Corn",
          },
          {
            href: "https://stardewvalleywiki.com/Tomato",
            label: "Stardew Valley Wiki: Tomato",
          },
          {
            href: "https://stardewvalleywiki.com/Hot_Pepper",
            label: "Stardew Valley Wiki: Hot Pepper",
          },
          {
            href: "https://stardewvalleywiki.com/Radish",
            label: "Stardew Valley Wiki: Radish",
          },
          {
            href: "https://stardewvalleywiki.com/Wheat",
            label: "Stardew Valley Wiki: Wheat",
          },
          {
            href: "https://stardewvalleywiki.com/Poppy",
            label: "Stardew Valley Wiki: Poppy",
          },
          {
            href: "https://stardewvalleywiki.com/Sunflower",
            label: "Stardew Valley Wiki: Sunflower",
          },
          {
            href: "https://stardewvalleywiki.com/Summer_Squash",
            label: "Stardew Valley Wiki: Summer Squash",
          },
          {
            href: "https://stardewvalleywiki.com/Summer_Squash_Seeds",
            label: "Stardew Valley Wiki: Summer Squash Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Coffee_Bean",
            label: "Stardew Valley Wiki: Coffee Bean",
          },
          {
            href: "https://stardewvalleywiki.com/Ancient_Fruit",
            label: "Stardew Valley Wiki: Ancient Fruit",
          },
          {
            href: "https://stardewvalleywiki.com/Ancient_Seeds",
            label: "Stardew Valley Wiki: Ancient Seeds",
          },
          {
            href: "https://stardewvalleyplanner.art/",
            label: "Stardew Valley Planner (homepage)",
            note: "This site, not the wiki.",
          },
        ]}
      />
    </article>
  );
}
