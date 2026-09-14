import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function FallCropsStardewEnglishArticle() {
  return (
    <article>
      <p>
        There is no single best outdoor fall crop. Year 1 at{" "}
        <a href="https://stardewvalleywiki.com/Pierre%27s_General_Store">
          Pierre&apos;s
        </a>{" "}
        is a tile choice among{" "}
        <a href="https://stardewvalleywiki.com/Cranberries">cranberries</a>,{" "}
        <a href="https://stardewvalleywiki.com/Pumpkin">pumpkins</a>, and{" "}
        <a href="https://stardewvalleywiki.com/Grape">grapes</a>; Year 2{" "}
        <a href="https://stardewvalleywiki.com/Artichoke">artichoke</a>, Oasis{" "}
        <a href="https://stardewvalleywiki.com/Beet">beet</a>, and a Traveling
        Cart Rare Seed are conditions on that same gold/day table. Rank by the
        shop you can open this morning, then by the{" "}
        <a href="https://stardewvalleywiki.com/Crops">Crops</a> gold/day figure,
        then by whether that soil is still planted when you wanted the next
        harvest.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Fall">Fall</a> is 28 days. On
        Winter 1, out-of-season outdoor crops wither. The{" "}
        <a className="blog-planner-link" href="/summer-crops-stardew">
          summer crop guide
        </a>{" "}
        and{" "}
        <a className="blog-planner-link" href="/best-spring-crop-stardew">
          spring crop guide
        </a>{" "}
        use the same gold/day rules for the earlier seasons.
      </p>

      <h2>Shop, year, and water first</h2>
      <p>
        Year 1 Fall 1 is a Pierre morning. The counter is 9am–5pm.{" "}
        <a href="https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock">
          Fall Stock
        </a>{" "}
        is the legal Year 1 list; artichoke is year 2+. Beet is{" "}
        <strong>Oasis: 20g</strong>, not Pierre.{" "}
        <a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">
          Sweet Gem Berry
        </a>{" "}
        needs a Traveling Cart Rare Seed at 1,000g (rarely 600g). Broccoli,
        Rare Seed, and Ancient Seeds are not on that Fall Stock table.
      </p>
      <p>
        Buy one seed per tile you can water on the plant day and after. A
        cranberry seed on a dry tile is a 240g packet, not an 18.89g/day cell.
        The same wet-tile ceiling is in{" "}
        <a className="blog-planner-link" href="/how-to-earn-money-stardew">
          how to earn money
        </a>
        .
      </p>
      <p>
        Wiki gold/day comes from{" "}
        <a href="https://stardewvalleywiki.com/Crops#Gold_per_Day">
          Crops Gold per Day
        </a>
        : no fertilizer, no Tiller, watered on the plant day, grow times exclude
        that day. Cranberry 18.89g already prices two 75g berries; do not add
        the 10% extra-berry chance. Pumpkin about 16.92g is one 13-day cycle,{" "}
        (320g − 100g) / 13, not two plantings as a season total.
      </p>

      <h2>One gold/day table</h2>
      <p>
        Rows are ordered by wiki gold/day so you can pick. The first row is
        legal only if you can buy that seed this morning.
      </p>
      <div
        aria-label="Fall crops wiki gold per day"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Seed</th>
              <th scope="col">Grow</th>
              <th scope="col">Gold/day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">
                  Sweet Gem Berry
                </a>
              </td>
              <td>Cart 1,000g</td>
              <td>24 days</td>
              <td>about 83.33g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Ancient_Fruit">
                  Ancient Fruit
                </a>
              </td>
              <td>Crafted free</td>
              <td>28 days, then every 7</td>
              <td>about 57.14g*</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Cranberries">
                  Cranberries
                </a>
              </td>
              <td>Pierre 240g</td>
              <td>7 days, then every 5</td>
              <td>about 18.89g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Pumpkin">Pumpkin</a>
              </td>
              <td>Pierre 100g</td>
              <td>13 days</td>
              <td>about 16.92g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Grape">Grape</a>
              </td>
              <td>Pierre 60g</td>
              <td>10 days, then every 3</td>
              <td>16.8g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Artichoke">Artichoke</a>
              </td>
              <td>Pierre 30g, year 2+</td>
              <td>8 days</td>
              <td>16.25g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Broccoli">Broccoli</a>
              </td>
              <td>Not sold; formula seed 0</td>
              <td>8 days, then every 4</td>
              <td>about 14.58g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Beet">Beet</a>
              </td>
              <td>Oasis: 20g</td>
              <td>6 days</td>
              <td>about 13.33g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Amaranth">Amaranth</a>
              </td>
              <td>Pierre 70g</td>
              <td>7 days</td>
              <td>about 11.43g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Eggplant">Eggplant</a>
              </td>
              <td>Pierre 20g</td>
              <td>5 days, then every 5</td>
              <td>11.2g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Yam">Yam</a>
              </td>
              <td>Pierre 60g</td>
              <td>10 days</td>
              <td>10g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Fairy_Rose">Fairy Rose</a>
              </td>
              <td>Pierre 200g</td>
              <td>12 days</td>
              <td>7.5g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Bok_Choy">Bok Choy</a>
              </td>
              <td>Pierre 50g</td>
              <td>4 days</td>
              <td>7.5g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Wheat">Wheat</a>
              </td>
              <td>Pierre 10g</td>
              <td>4 days</td>
              <td>3.75g</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Corn">Corn</a>
              </td>
              <td>Pierre 150g</td>
              <td>14 days, then every 4</td>
              <td>about 1.92g fall; 7.41g both</td>
            </tr>
            <tr>
              <td>
                <a href="https://stardewvalleywiki.com/Sunflower">Sunflower</a>
              </td>
              <td>Pierre 200g</td>
              <td>8 days</td>
              <td>
                <strong>−15g</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Skip a row you cannot buy. Broccoli&apos;s 14.58g treats seed cost as 0;
        Pierre does not sell it for 0g. Ancient Fruit 57.14g* is a three-season
        free-seed footnote, not a Fall 1 outdoor finisher. Corn&apos;s 7.41g
        needs summer plus fall; fall-only is about 1.92g. Sunflower is{" "}
        <strong>−15g</strong> because the seed is 200g and the flower sells for
        80g.
      </p>

      <h2>Last plant days</h2>
      <p>
        Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.
      </p>
      <p>
        The wiki does not name that field. For one harvest on Fall 28 it is{" "}
        <code>28 − grow days</code>, excluding the plant day, no Speed-Gro,
        plant day already watered. Miss a watering night and move the date
        earlier. Cranberry five picks and grape six picks need Fall 1, not a
        last-plant name in this table.
      </p>
      <div
        aria-label="Derived last plant days for a Fall 28 harvest"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Grow days</th>
              <th scope="col">Last plant for Fall 28</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bok Choy</td>
              <td>4</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Wheat</td>
              <td>4</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Beet</td>
              <td>6</td>
              <td>22</td>
            </tr>
            <tr>
              <td>Amaranth</td>
              <td>7</td>
              <td>21</td>
            </tr>
            <tr>
              <td>Artichoke</td>
              <td>8</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Sunflower</td>
              <td>8</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Yam</td>
              <td>10</td>
              <td>18</td>
            </tr>
            <tr>
              <td>Fairy Rose</td>
              <td>12</td>
              <td>16</td>
            </tr>
            <tr>
              <td>Pumpkin</td>
              <td>13</td>
              <td>15</td>
            </tr>
            <tr>
              <td>Sweet Gem Berry</td>
              <td>24</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Calendar schematic of Fall 1–28 occupancy: cranberry picks on 8, 13, 18, 23, and 28; pumpkin 13-day cycle and last plant 15. Not a screenshot."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/fall-crop-occupancy-calendar.webp"
          width="1672"
        />
        <figcaption>
          Fall 1 plant, watered every day, no Speed-Gro. Cranberry picks 8, 13,
          18, 23, 28, so Fall 14 the tile is still occupied. Pumpkin planted
          Fall 1 is ready Fall 14; replant the same day for Fall 27. Last plant
          for a Fall 28 pumpkin is 15.
        </figcaption>
      </figure>

      <h2>Year 1 Pierre: three different tiles</h2>
      <p>
        Without a Rare Seed, Oasis beet, or year-2 artichoke, Year 1 Pierre&apos;s
        highest outdoor gold/day is cranberry at about 18.89g. Pumpkin about
        16.92g and grape 16.8g occupy soil differently. Split tiles; do not copy
        one winner onto every hoe mark.
      </p>
      <h3>Cranberries keep the tile</h3>
      <p>
        Plant Fall 1 and the picks are 8, 13, 18, 23, and 28. The tile is still
        cranberry on Fall 14, when a Fall 1 pumpkin is ready, and on Fall 15,
        pumpkin&apos;s last plant. One 240g seed covers five picks. People can
        walk between the plants.
      </p>
      <h3>Pumpkins are 13 days and the fall giant</h3>
      <p>
        Planted Fall 1, ready Fall 14. Replant the same day for Fall 27. A seed
        on Fall 16 does not finish. Pumpkin is the outdoor fall giant: a 3-by-3
        of the same crop, top-left mature and watered, 1% each morning,
        including overlaps. Harvest with any axe for 15 to 21 normal-quality
        items. Giants do not wither at season change; a regular pumpkin on
        Winter 1 does. Keep sprinklers and scarecrows off those nine cells.{" "}
        <a className="blog-planner-link" href="/sprinkler-stardew">
          Sprinkler guide
        </a>
        .
      </p>
      <h3>Grapes block walking</h3>
      <p>
        You cannot walk through grapes at any living stage. Planted Fall 1:
        picks on 11, 14, 17, 20, 23, and 26. Use a row plus a walking lane. Do
        not ring a pumpkin 3-by-3 with grapes.
      </p>
      <ul>
        <li>Most wet tiles: cranberry.</li>
        <li>One pumpkin 3-by-3 only if you will water all nine every day.</li>
        <li>One grape row only where a walking tile already exists.</li>
      </ul>
      <p>Do not copy all three onto the same cells.</p>

      <h2>Rows that are not Year 1 Pierre defaults</h2>
      <p>
        Artichoke joins Pierre in year 2 at 16.25g/day, last plant 20, still
        below cranberry. Beet is Oasis: 20g, about 13.33g, last plant 22; skip
        it if the bus is down. Sweet Gem is 24 days, last plant 4, about 83.33g
        only with a Rare Seed in hand. Broccoli is not in Fall Stock. Ancient
        Fruit planted Fall 1 is not a same-season outdoor finisher; indoor beds
        are the{" "}
        <a className="blog-planner-link" href="/glasshouse-stardew-valley">
          greenhouse guide
        </a>
        . Wheat at 10g is still only 3.75g/day. Summer corn that is still in
        season continues on Fall 1; that occupancy belongs to the{" "}
        <a className="blog-planner-link" href="/summer-crops-stardew">
          summer crop guide
        </a>
        .
      </p>

      <h2>Grapes, a pumpkin 3-by-3, and cranberries on one bed</h2>
      <p>
        Gold/day does not place the plants. Grapes block the walk. A pumpkin
        3-by-3 needs nine matching plants and a reachable top-left. Cranberry
        needs a rectangle you can harvest on 8, 13, 18, 23, and 28 without
        crossing trellis.
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Bed grid schematic: grape row with a walk tile, pumpkin 3-by-3 with marked top-left, cranberry rectangle not behind grapes. Not a 1% giant already rolled."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/fall-grape-pumpkin-cranberry-bed.webp"
          width="1672"
        />
        <figcaption>
          Grape row plus a walking tile. Pumpkin 3-by-3, top-left marked, no
          sprinkler or scarecrow inside. Cranberries not behind the grape wall.
        </figcaption>
      </figure>
      <ol>
        <li>Hoe a 3-by-3, not a line of nine.</li>
        <li>Plant pumpkin in all nine cells.</li>
        <li>Keep grapes in a row with a walking lane. Do not ring the nine.</li>
        <li>Put cranberries where you can reach them without crossing trellis.</li>
        <li>Keep sprinklers and scarecrows off the pumpkin nine.</li>
      </ol>
      <p>
        If you want that same 3-by-3 and grape row on the farm map you actually
        play, open the{" "}
        <a className="blog-planner-link" href="/#planner">
          planner
        </a>{" "}
        and switch the season to fall. The tool can place crops on the eight
        farm maps plus Ginger Island and can show sprinkler and scarecrow
        coverage; projects stay in the browser. It does not compute gold/day, last-plant dates, or giant 1% rolls.
      </p>
      <p>
        Before you pay Pierre, name the crop, the shop, and the next date that
        tile is empty. Year 1: skip artichoke. No Oasis packet: skip beet. No
        Rare Seed: skip Sweet Gem. A tile already promised to cranberry, a
        pumpkin 3-by-3, or a grape wall does not get the first row of the table.
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question:
              "What is the most profitable crop in fall in Stardew Valley?",
            answer: (
              <p>
                There is no single answer. On the Crops gold/day scale with no
                fertilizer and no Tiller, Year 1 Pierre&apos;s highest outdoor
                cell is cranberry at about 18.89g. Pumpkin about 16.92g is one
                13-day cycle, not a two-planting season total. Grape is 16.8g
                and blocks walking. Sweet Gem about 83.33g needs a Traveling
                Cart Rare Seed at 1,000g and is not a Pierre default. Artichoke
                16.25g is year 2+.
              </p>
            ),
          },
          {
            question: "What is the best fall crop in Year 1?",
            answer: (
              <p>
                On Year 1 Pierre&apos;s Fall Stock, cranberry seeds at 240g
                correspond to about 18.89g/day. Pumpkin and grape are occupancy
                forks: 13 days and a possible 3-by-3 versus a trellis you cannot
                walk through. Artichoke is not on the Year 1 counter. Beet is
                Oasis: 20g. Sweet Gem is not a Pierre packet.
              </p>
            ),
          },
          {
            question: "What is the best fall crop in Year 2?",
            answer: (
              <p>
                Artichoke joins Pierre at 30g and 16.25g/day, still below
                cranberry 18.89g. Year 2 does not cancel grape&apos;s trellis or
                pumpkin&apos;s nine-tile hold. Sweet Gem still depends on a Rare
                Seed, not on the year.
              </p>
            ),
          },
          {
            question: "What is the best seed to grow in fall?",
            answer: (
              <p>
                Seed price is not gold/day. Wheat at 10g is only 3.75g/day.
                Cranberry seeds at 240g correspond to about 18.89g/day.
                Sunflower seeds at 200g correspond to <strong>−15g</strong>
                /day. A Rare Seed at 1,000g corresponds to about 83.33g/day and
                24 growing days, with derived last plant 4.
              </p>
            ),
          },
          {
            question: "Are cranberries or pumpkins better in fall?",
            answer: (
              <p>
                On the same wiki gold/day scale, cranberry is about 18.89g and
                occupies the tile through picks on 8, 13, 18, 23, and 28 if you
                plant Fall 1. Pumpkin is about 16.92g for one 13-day cycle and
                can form a 3-by-3 giant. Do not compare two pumpkin plantings as
                a season total against 18.89g.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-14 against Stardew Valley Wiki Fall, Crops (including Gold per Day and Giant Crops), and Pierre’s General Store Fall Stock. Wiki gold/day figures assume no fertilizer and no Tiller. Last-plant dates are derived as 28 minus grow days for a harvest on Fall 28, excluding the plant day, with watering on the plant day; the wiki does not name that field. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls."
        items={[
          {
            href: "https://stardewvalleywiki.com/Fall",
            label: "Stardew Valley Wiki: Fall",
          },
          {
            href: "https://stardewvalleywiki.com/Crops",
            label: "Stardew Valley Wiki: Crops",
          },
          {
            href: "https://stardewvalleywiki.com/Crops#Gold_per_Day",
            label: "Stardew Valley Wiki: Crops (Gold per Day)",
          },
          {
            href: "https://stardewvalleywiki.com/Crops#Giant_Crops",
            label: "Stardew Valley Wiki: Crops (Giant Crops)",
          },
          {
            href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
            label: "Stardew Valley Wiki: Pierre's General Store",
          },
          {
            href: "https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock",
            label: "Stardew Valley Wiki: Pierre's General Store (Fall Stock)",
          },
          {
            href: "https://stardewvalleyplanner.art/",
            label: "Stardew Valley Planner",
          },
          {
            href: "https://stardewvalleyplanner.art/best-spring-crop-stardew",
            label: "This site: spring crop ranking",
          },
          {
            href: "https://stardewvalleyplanner.art/summer-crops-stardew",
            label: "This site: summer crop ranking",
          },
          {
            href: "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
            label: "This site: Year 1 gold",
          },
          {
            href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
            label: "This site: greenhouse 10×12",
          },
        ]}
      />
    </article>
  );
}
