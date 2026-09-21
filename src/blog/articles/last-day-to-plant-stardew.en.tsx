import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function LastDayToPlantStardewEnglishArticle() {
  return (
    <article>
      <p>
        The last outdoor day to plant a seed in Stardew Valley, so the first harvest still lands on day 28 of that season, is 28 minus the crop’s wiki grow days. Count those days after the plant day, water the seed the day you put it in, and leave Speed-Gro, Deluxe Speed-Gro, Hyper Speed-Gro, and Agriculturist off; the <a href="https://stardewvalleywiki.com/Crops">Crops</a> page has no last-plant field, so the calendar day is derived. <a href="https://stardewvalleywiki.com/Parsnip">Parsnip</a> at 4 days derives 24, <a href="https://stardewvalleywiki.com/Cauliflower">cauliflower</a> at 12 days derives 16, and pumpkin or starfruit at 13 days derive 15: look the packet up in the seasonal tables, then plant on or before that day.
      </p>

      <h2>Count grow days after the plant day, then subtract from 28</h2>

      <p>
        Each of Spring, Summer, Fall, and Winter lasts 28 days on the <a href="https://stardewvalleywiki.com/Seasons">Seasons</a> page. A crop that can grow only in the current season withers when the season ends (end of day 28) and is a dead crop on the 1st of the next month. Fully grown crops that are ready to harvest also wither when they move into a season they cannot occupy. Multi-season plants named on Crops (Ancient Fruit, Coffee Bean, Corn, Sunflower, and Wheat) keep growing through every season listed for them.
      </p>

      <p>
        The number you subtract is the wiki Total days, under the rules in <a href="https://stardewvalleywiki.com/Crops#Grow_Times">Grow Times</a>. Those times exclude the day the seeds were planted. If you plant on the first of a season, a 5-day crop is ready on day 6. Harvest day is plant day plus grow days. Crops must be watered every day for that clock to run; an unwatered day does not kill the plant and does not count as growth. The same heading assumes the seed is watered the day it is planted. Planting after midnight still counts as the current day. Fertilizer and the Agriculturist profession are not taken into account on that page.
      </p>

      <p>
        For a first harvest on day 28, the derived last plant day is <code>28 − days_to_grow</code>. That arithmetic is analysis on the 28-day season and the Grow Times clock. It is not a wiki column name.
      </p>

      <p>
        Work the named packets the same way, with the plant day already watered.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Parsnip">Parsnip</a> is 4 days. <code>28 − 4 = 24</code>. Plant on 24 and the growing days are 25, 26, 27, and 28, so the first harvest is day 28. Plant on 25 and only three growing days remain, so the plant is still unfinished when the season ends.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Cauliflower">Cauliflower</a> is 12 days. <code>28 − 12 = 16</code>. Plant on Spring 16 and days 17 through 28 are the 12 growing days. Plant on 17 and the head is still short on Spring 28.
      </p>

      <p>
        Pumpkin on the <a href="https://stardewvalleywiki.com/Fall">Fall</a> table is 13 days. <code>28 − 13 = 15</code>. Plant on Fall 15 and days 16 through 28 finish one head on Fall 28.
      </p>

      <p>
        Starfruit on the <a href="https://stardewvalleywiki.com/Summer">Summer</a> table is also 13 days, so the derived last plant day is Summer 15 for a harvest on Summer 28.
      </p>

      <p>
        A seed that is not in the tables below uses the same inputs: read Total days from Crops, confirm the tile is outdoor and in a legal season, then subtract from 28. If you miss a watering night, that night does not grow, so move the derived day earlier by one for each missed night. That shift follows Grow Times; the wiki does not print a second last-plant table for dry nights.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Grow-clock schematic: the plant day is excluded; a 5-day crop planted on day 1 is ready on day 6; parsnip planted on 24 is ready on 28; cauliflower planted on 16 is ready on 28. Watered plant day, no Speed-Gro. Derived days, not a wiki field."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-grow-clock.webp"
          width="1672"
        />
        <figcaption>
          The plant day does not count as a growing day. A 5-day crop planted on day 1 is ready on day 6. The same axis puts parsnip planted on 24 ready on 28, and cauliflower planted on 16 ready on 28. Water the plant day. Leave Speed-Gro off. The day numbers are derived as 28 minus grow days.
        </figcaption>
      </figure>

      <h2>Last outdoor plant day for a first harvest on day 28</h2>

      <p>
        Use this lookup on the outdoor valley farm. Wiki days to grow are Total days from the Crops infoboxes and the matching season tables. The last plant day is derived as <code>28 − grow days</code> for a first harvest on day 28. Speed-Gro, Deluxe Speed-Gro, Hyper Speed-Gro, and Agriculturist are off. The plant day is already watered. Regrow rows are the last day that still yields one harvest, not a full-season pick count.
      </p>

      <p>
        Carrot, summer squash, broccoli, and powdermelon are on the Crops page History as 1.6 additions. They sit in the same formula as the older packets.
      </p>

      <h3>Spring</h3>

      <div
        aria-label="Spring last outdoor plant day for a first harvest on day 28"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Wiki days to grow</th>
              <th scope="col">Derived last plant day (first harvest on day 28)</th>
              <th scope="col">Read-as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Carrot">Carrot</a></td>
              <td>3</td>
              <td>25</td>
              <td>1.6 crop; single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Parsnip">Parsnip</a>, <a href="https://stardewvalleywiki.com/Crops#Garlic">Garlic</a></td>
              <td>4</td>
              <td>24</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Kale">Kale</a>, <a href="https://stardewvalleywiki.com/Crops#Potato">Potato</a>, <a href="https://stardewvalleywiki.com/Crops#Tulip">Tulip</a></td>
              <td>6</td>
              <td>22</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Unmilled_Rice">Unmilled Rice</a> (irrigated)</td>
              <td>6</td>
              <td>22</td>
              <td>irrigated tiles only; see the rice branch</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Blue_Jazz">Blue Jazz</a></td>
              <td>7</td>
              <td>21</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Strawberry">Strawberry</a></td>
              <td>8</td>
              <td>20</td>
              <td>first harvest; Egg Festival on Spring 13 is a different start day</td>
            </tr>
            <tr>
              <td>Unmilled Rice (unirrigated)</td>
              <td>8</td>
              <td>20</td>
              <td>dry tiles; see the rice branch</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Green_Bean">Green Bean</a></td>
              <td>10</td>
              <td>18</td>
              <td>first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Coffee_Bean">Coffee Bean</a></td>
              <td>10</td>
              <td>18</td>
              <td>first harvest if you need it by Spring 28; a plant still in the ground on Spring 28 continues on Summer 1</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Cauliflower">Cauliflower</a></td>
              <td>12</td>
              <td>16</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Rhubarb">Rhubarb</a></td>
              <td>13</td>
              <td>15</td>
              <td>single harvest</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Summer</h3>

      <div
        aria-label="Summer last outdoor plant day for a first harvest on day 28"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Wiki days to grow</th>
              <th scope="col">Derived last plant day (first harvest on day 28)</th>
              <th scope="col">Read-as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Wheat">Wheat</a></td>
              <td>4</td>
              <td>24</td>
              <td>same-season first harvest; the wiki’s Summer 25 soil-keep line is a different goal</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Hot_Pepper">Hot Pepper</a></td>
              <td>5</td>
              <td>23</td>
              <td>first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Radish">Radish</a>, <a href="https://stardewvalleywiki.com/Crops#Summer_Squash">Summer Squash</a></td>
              <td>6</td>
              <td>22</td>
              <td>squash is a 1.6 crop</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Taro_Root">Taro Root</a> (irrigated)</td>
              <td>7</td>
              <td>21</td>
              <td>valley farm in summer; Ginger Island is year-round</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Poppy">Poppy</a></td>
              <td>7</td>
              <td>21</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Summer_Spangle">Summer Spangle</a>, <a href="https://stardewvalleywiki.com/Crops#Sunflower">Sunflower</a></td>
              <td>8</td>
              <td>20</td>
              <td>sunflower also grows in fall</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Red_Cabbage">Red Cabbage</a></td>
              <td>9</td>
              <td>19</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td>Taro Root (unirrigated)</td>
              <td>10</td>
              <td>18</td>
              <td>valley farm in summer</td>
            </tr>
            <tr>
              <td>Coffee Bean</td>
              <td>10</td>
              <td>18</td>
              <td>first harvest; can continue from a spring plant</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Hops">Hops</a>, <a href="https://stardewvalleywiki.com/Crops#Tomato">Tomato</a></td>
              <td>11</td>
              <td>17</td>
              <td>first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Melon">Melon</a></td>
              <td>12</td>
              <td>16</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Starfruit">Starfruit</a>, <a href="https://stardewvalleywiki.com/Crops#Blueberry">Blueberry</a></td>
              <td>13</td>
              <td>15</td>
              <td>starfruit is single harvest; blueberry is first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Corn">Corn</a></td>
              <td>14</td>
              <td>14</td>
              <td>first harvest; continues into fall</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Pineapple">Pineapple</a></td>
              <td>14</td>
              <td>14</td>
              <td>valley farm in summer; Ginger Island is year-round</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Fall</h3>

      <div
        aria-label="Fall last outdoor plant day for a first harvest on day 28"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Wiki days to grow</th>
              <th scope="col">Derived last plant day (first harvest on day 28)</th>
              <th scope="col">Read-as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Bok_Choy">Bok Choy</a>, Wheat</td>
              <td>4</td>
              <td>24</td>
              <td>single harvest on this clock</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Eggplant">Eggplant</a></td>
              <td>5</td>
              <td>23</td>
              <td>first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Beet">Beet</a></td>
              <td>6</td>
              <td>22</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Amaranth">Amaranth</a>, <a href="https://stardewvalleywiki.com/Crops#Cranberries">Cranberries</a></td>
              <td>7</td>
              <td>21</td>
              <td>cranberry is first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Artichoke">Artichoke</a>, <a href="https://stardewvalleywiki.com/Crops#Broccoli">Broccoli</a>, Sunflower</td>
              <td>8</td>
              <td>20</td>
              <td>broccoli is a 1.6 crop</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Yam">Yam</a>, <a href="https://stardewvalleywiki.com/Crops#Grape">Grape</a></td>
              <td>10</td>
              <td>18</td>
              <td>grape is first harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Fairy_Rose">Fairy Rose</a></td>
              <td>12</td>
              <td>16</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Pumpkin">Pumpkin</a></td>
              <td>13</td>
              <td>15</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td>Corn</td>
              <td>14</td>
              <td>14</td>
              <td>can continue from a summer plant</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Sweet_Gem_Berry">Sweet Gem Berry</a></td>
              <td>24</td>
              <td>4</td>
              <td>single harvest</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Ancient_Fruit">Ancient Fruit</a></td>
              <td>28</td>
              <td>no same-season outdoor harvest</td>
              <td>plant on day 1, first harvest on day 1 of the following season</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Winter</h3>

      <p>
        <a href="https://stardewvalleywiki.com/Winter">Winter</a> outdoor planting is a short list: Powdermelon Seeds, Winter Seeds, and Fiber Seeds. Other seasonal packets do not grow outdoors here.
      </p>

      <div
        aria-label="Winter last outdoor plant day for a first harvest on day 28"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Wiki days to grow</th>
              <th scope="col">Derived last plant day (first harvest on day 28)</th>
              <th scope="col">Read-as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Crops#Powdermelon">Powdermelon</a></td>
              <td>7</td>
              <td>21</td>
              <td>1.6 crop</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Winter_Seeds">Winter Seeds</a></td>
              <td>7</td>
              <td>21</td>
              <td>wild-seed grow time</td>
            </tr>
            <tr>
              <td><a href="https://stardewvalleywiki.com/Fiber_Seeds">Fiber Seeds</a></td>
              <td>7</td>
              <td>21</td>
              <td>all seasons; no watering</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <a href="https://stardewvalleywiki.com/Spring_Seeds">Spring Seeds</a>, <a href="https://stardewvalleywiki.com/Summer_Seeds">Summer Seeds</a>, and <a href="https://stardewvalleywiki.com/Fall_Seeds">Fall Seeds</a> print the same 7-day infobox. In their legal outdoor season they derive 21, on the same wild-seed rule as Winter Seeds. Fiber Seeds derive 21 in every season, including winter.
      </p>

      <p>
        Table notes. Days are derived as 28 minus wiki Total days. The Crops page does not name a last-plant field. The plant day is watered. Speed-Gro, Deluxe Speed-Gro, Hyper Speed-Gro, and Agriculturist are off. A regrow cell is one harvest on day 28. Sweet Gem planted on Fall 4 uses growing days 5 through 28 (24 days) and ripens on Fall 28; Fall 5 leaves the berry unfinished.
      </p>

      <p>
        Read the table as three questions.
      </p>

      <ul>
        <li>
          Is this seed legal outdoors in the current season?
        </li>
        <li>
          Is today on or before the derived last plant day?
        </li>
        <li>
          Do you need the first harvest, or more picks from a regrow plant?
        </li>
      </ul>

      <p>
        If the cutoff is already clear and the remaining job is which seed to buy this morning, the <a className="blog-planner-link" href="/best-spring-crop-stardew">spring crop ranking</a>, <a className="blog-planner-link" href="/summer-crops-stardew">summer crop ranking</a>, and <a className="blog-planner-link" href="/fall-crops-stardew">fall crop ranking</a> sort shops and gold/day for those seasons.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Four season bands on a 1–28 axis with crops on their derived last plant days: day 15 rhubarb, starfruit, and pumpkin; day 16 cauliflower, melon, and fairy rose; day 24 parsnip and other 4-day crops; winter 21 powdermelon and Winter Seeds; 1.6 carrot 25, summer squash 22, broccoli 20, powdermelon 21; rice irrigated 22 and unirrigated 20. Outdoor, no Speed-Gro, first harvest on day 28."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-season-calendar.webp"
          width="1672"
        />
        <figcaption>
          Four outdoor season bands, days 1–28. Each crop name sits on its derived last plant day for a first harvest on day 28. Day 15 holds rhubarb, starfruit, and pumpkin. Day 16 holds cauliflower, melon, and fairy rose. Day 24 holds parsnip and the other 4-day crops. Winter 21 holds powdermelon and Winter Seeds. The 1.6 packets on this axis are carrot 25, summer squash 22, broccoli 20, and powdermelon 21. Rice is marked irrigated 22 and unirrigated 20. No Speed-Gro columns. If a label and the table disagree, use wiki Total days minus from 28.
        </figcaption>
      </figure>

      <h2>When the table row is easy to misread</h2>

      <h3>Rice is 22 irrigated or 20 unirrigated</h3>

      <p>
        <a href="https://stardewvalleywiki.com/Unmilled_Rice">Unmilled Rice</a> grows from Rice Shoots after 8 days, or after 6 days when irrigated. Rice Shoots planted approximately within 3 tiles of a water source are irrigated. Irrigated shoots mature in 6 days and do not need to be watered. Keep both rows. A dry tile uses 8 days and derives 20. An irrigated tile uses 6 days and derives 22. Planting on 22 without irrigation leaves only six growing days for an 8-day crop.
      </p>

      <h3>Seasonal and wild seeds last-plant on the 21st</h3>

      <p>
        Wild Seeds take 7 days to mature regardless of which forage crop appears, not counting the day planted. Spring Seeds, Summer Seeds, Fall Seeds, Winter Seeds, and Fiber Seeds all print 7 days, so they derive 21 in a legal outdoor season. Fiber grows in all seasons and does not need to be watered.
      </p>

      <p>
        Fall Seeds are a fall packet. Summer 28 is not a legal outdoor plant day for that packet. Use the season on the seed, then the 21st inside that season.
      </p>

      <h3>Regrow rows are the last day for one harvest</h3>

      <p>
        Blueberry, cranberry, coffee, green bean, grape, hops, tomato, hot pepper, eggplant, strawberry, corn, and the other regrow rows in the tables are timed to the first harvest. Extra picks after that first fruit need an earlier plant and leftover days in the season.
      </p>

      <p>
        The season pages print Maximum Harvests per Season with no fertilizer and without Agriculturist. That field assumes a season-long occupancy pattern, often from a day-1 plant with replant-on-harvest for single-harvest crops. It is a different number from the first-harvest last plant day. For more picks, plant earlier than the first-harvest cell. For which crop to buy, use the seasonal ranking pages above.
      </p>

      <h3>Multi-season crops do not always die on day 28</h3>

      <p>
        The Crops page names five plants that continue through every season listed for them: Ancient Fruit, Coffee Bean, Corn, Sunflower, and Wheat.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Coffee_Bean">Coffee Bean</a> grows after 10 days and then every 2 days in Spring and Summer. If a Coffee Bean plant of any growth stage is in the ground on the 28th of Spring, it continues growing on the 1st of Summer as though nothing had changed. The spring row’s 18 is the last day for a first harvest that still lands on Spring 28. A later spring plant can still finish in summer.
      </p>

      <p>
        Corn uses 14 days to the first harvest, then every 4. A summer plant that is still in season continues on Fall 1. Sunflower is legal in summer and fall at 8 days. Wheat is legal in summer and fall at 4 days.
      </p>

      <p>
        Wheat has two separate goals. Same-season first harvest derives 24 (<code>28 − 4</code>). The Crops Notes line is a soil-keep trick: if wheat is planted on or before the 25th of Summer and left unharvested until the 1st of Fall, it can be scythed on Fall 1, leaving tilled and fertilized soil ready for fall crops. Summer 25 is that keep-alive date. It is not the same-season first-harvest cutoff.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Ancient_Fruit">Ancient Fruit</a> grows in Spring, Summer, or Fall, Total 28 days, then every 7. If planted on day 1 of a season, the first harvest occurs on day 1 of the following season. Growth fertilizers affect only that first harvest. A 28-day crop has no same-season outdoor finish on this clock (<code>28 − 28</code> is not a calendar day). Winter is outside Ancient Fruit’s listed seasons, so a Fall 1 outdoor plant is not given a Winter 1 harvest day.
      </p>

      <p>
        Mixed Seeds grow a random in-season crop in any season except Winter (Winter mixed seeds are greenhouse or indoor garden pot). After the plant appears, use that crop’s row. There is no single last-plant day for the packet before you know the result. <a href="https://stardewvalleywiki.com/Cactus_Seeds">Cactus Fruit</a> can be grown in the greenhouse, in indoor garden pots, or on the Ginger Island farm. It has no valley outdoor last-plant day.
      </p>

      <h2>Skip this outdoor table in the greenhouse, on Ginger Island, and with Speed-Gro</h2>

      <p>
        The <a href="https://stardewvalleywiki.com/Greenhouse">greenhouse</a> lets crops be planted, grown, and harvested at any time of year without the outdoor season list. They still need water, including on rainy days. Crops that regrow keep regrowing and do not die at the end of a season. Indoor beds do not use the 28-day outdoor cutoff. Year-round indoor planting is the <a className="blog-planner-link" href="/glasshouse-stardew-valley">greenhouse guide</a>.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Ginger_Island">Ginger Island</a> works the same way for planting: the current season does not choose the crop list, and any crop can be grown on the island farm regardless of season. Pineapple and taro are summer rows on the valley farm and year-round on the island farm.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Speed-Gro">Speed-Gro</a> speeds crop growth by 10%, or a total of 20% with Agriculturist. <a href="https://stardewvalleywiki.com/Deluxe_Speed-Gro">Deluxe Speed-Gro</a> speeds growth by 25%, or 35% with Agriculturist. <a href="https://stardewvalleywiki.com/Hyper_Speed-Gro">Hyper Speed-Gro</a> speeds growth by 33%, or 43% with Agriculturist. None of those items reduce the time between harvests on a multi-harvest crop. <a href="https://stardewvalleywiki.com/Farming">Agriculturist</a> at Farming 10 on the Tiller path is the line “All crops grow 10% faster.” The tables above have no speed columns. The Speed-Gro pages print percentages. Crop comparison calendars on the wiki are stage images, without a fertilizer Total-days integer per crop in text. Those percentages stay as percentages; they do not become a later last-plant day on this table.
      </p>

      <p>
        An unwatered day does not grow. Each missed night moves the derived last plant day earlier by one. That is the Grow Times rule applied to the same formula.
      </p>

      <p>
        <a href="https://stardewvalleywiki.com/Fruit_Trees">Fruit trees</a> take 28 days to mature. Fruit saplings grow during any season. That 28-day sapling clock is separate from the crop tables. Tree Fertilizer does not work on fruit trees.
      </p>

      <p>
        A <a href="https://stardewvalleywiki.com/Tea_Sapling">Tea Sapling</a> takes 20 days to become a Tea Bush. The bush produces one Tea Leaves item each day of the final week (days 22–28) of spring, summer, and fall, and in winter if it is indoors. An immature bush grows at any time, including outdoors in winter, without watering. Tree Fertilizer cannot be used on tea bushes. The Tea Sapling page gives the 20-day grow time and the 22–28 harvest week; it does not give a last plant day for a sapling placed after day 1.
      </p>

      <p>
        On the <a href="https://stardewvalleywiki.com/Farm_Maps">Beach Farm</a>, sprinklers do not work in the sandy soil. There is a contiguous patch of 202 non-sandy tiles where sprinklers can be placed, plus 28 additional non-sandy tiles. That is a watering constraint. The Farm Maps page does not give the Beach Farm a different last-plant calendar.
      </p>

      <p>
        To check a packet in hand: confirm the tile is outdoor and in season, read wiki Total days, derive <code>28 − grow days</code>, and plant on or before that day with the plant day watered. If today is later and the crop is a single-season outdoor plant, the first harvest will not land on day 28.
      </p>

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-21 against Stardew Valley Wiki pages. Last-plant days are derived as `28 − grow days` for a first harvest on day 28, excluding the plant day, with watering on the plant day. The tables have no Speed-Gro, Deluxe Speed-Gro, Hyper Speed-Gro, or Agriculturist columns. This site’s farm planner switches seasons as a layout view; it does not compute last-plant days."
        items={[
          {
            href: "https://stardewvalleywiki.com/Crops",
            label: "Stardew Valley Wiki: Crops",
          },
          {
            href: "https://stardewvalleywiki.com/Crops#Grow_Times",
            label: "Stardew Valley Wiki: Crops (Grow Times)",
          },
          {
            href: "https://stardewvalleywiki.com/Crops#End_of_Season",
            label: "Stardew Valley Wiki: Crops (End of Season)",
          },
          {
            href: "https://stardewvalleywiki.com/Seasons",
            label: "Stardew Valley Wiki: Seasons",
          },
          {
            href: "https://stardewvalleywiki.com/Spring",
            label: "Stardew Valley Wiki: Spring",
          },
          {
            href: "https://stardewvalleywiki.com/Summer",
            label: "Stardew Valley Wiki: Summer",
          },
          {
            href: "https://stardewvalleywiki.com/Fall",
            label: "Stardew Valley Wiki: Fall",
          },
          {
            href: "https://stardewvalleywiki.com/Winter",
            label: "Stardew Valley Wiki: Winter",
          },
          {
            href: "https://stardewvalleywiki.com/Parsnip",
            label: "Stardew Valley Wiki: Parsnip",
          },
          {
            href: "https://stardewvalleywiki.com/Cauliflower",
            label: "Stardew Valley Wiki: Cauliflower",
          },
          {
            href: "https://stardewvalleywiki.com/Unmilled_Rice",
            label: "Stardew Valley Wiki: Unmilled Rice",
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
            href: "https://stardewvalleywiki.com/Spring_Seeds",
            label: "Stardew Valley Wiki: Spring Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Summer_Seeds",
            label: "Stardew Valley Wiki: Summer Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Fall_Seeds",
            label: "Stardew Valley Wiki: Fall Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Winter_Seeds",
            label: "Stardew Valley Wiki: Winter Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Fiber_Seeds",
            label: "Stardew Valley Wiki: Fiber Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Speed-Gro",
            label: "Stardew Valley Wiki: Speed-Gro",
          },
          {
            href: "https://stardewvalleywiki.com/Deluxe_Speed-Gro",
            label: "Stardew Valley Wiki: Deluxe Speed-Gro",
          },
          {
            href: "https://stardewvalleywiki.com/Hyper_Speed-Gro",
            label: "Stardew Valley Wiki: Hyper Speed-Gro",
          },
          {
            href: "https://stardewvalleywiki.com/Farming",
            label: "Stardew Valley Wiki: Farming",
          },
          {
            href: "https://stardewvalleywiki.com/Greenhouse",
            label: "Stardew Valley Wiki: Greenhouse",
          },
          {
            href: "https://stardewvalleywiki.com/Ginger_Island",
            label: "Stardew Valley Wiki: Ginger Island",
          },
          {
            href: "https://stardewvalleywiki.com/Fruit_Trees",
            label: "Stardew Valley Wiki: Fruit Trees",
          },
          {
            href: "https://stardewvalleywiki.com/Tea_Sapling",
            label: "Stardew Valley Wiki: Tea Sapling",
          },
          {
            href: "https://stardewvalleywiki.com/Cactus_Seeds",
            label: "Stardew Valley Wiki: Cactus Seeds",
          },
          {
            href: "https://stardewvalleywiki.com/Farm_Maps",
            label: "Stardew Valley Wiki: Farm Maps",
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
            href: "https://stardewvalleyplanner.art/fall-crops-stardew",
            label: "This site: fall crop ranking",
          },
          {
            href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
            label: "This site: greenhouse layout",
          },
        ]}
      />
    </article>
  );
}
