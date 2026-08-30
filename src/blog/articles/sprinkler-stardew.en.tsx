import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function SprinklerStardewEnglishArticle() {
  return (
    <article>
      <p>
        The watering can will eat a morning once the field is bigger than a handful of
        parsnips. A sprinkler does not fix that by magic. It wets a fixed set of tiles at
        dawn and ignores everything else.
      </p>
      <p>
        Count those tiles first: 4, 8, or 24. A basic sprinkler never reaches the corners.
        When the count matches the field you actually want, place the sprinkler on the map
        and turn on radius overlay before you plant.
      </p>

      <h2>Count the tiles the sprinkler actually waters</h2>
      <p>
        Call it a sprinkler only after you know which tiles get wet. The item name does not
        describe a whole field. It describes a shape around the sprinkler itself, and the
        sprinkler’s own tile is not a crop.
      </p>
      <div
        className="blog-table-scroll"
        role="region"
        aria-label="Sprinkler watering ranges"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Tiles watered</th>
              <th>Shape</th>
              <th>Corners</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sprinkler</td>
              <td>4</td>
              <td>Up, down, left, right</td>
              <td>Dry</td>
            </tr>
            <tr>
              <td>Quality Sprinkler</td>
              <td>8</td>
              <td>3×3 minus the sprinkler</td>
              <td>Wet</td>
            </tr>
            <tr>
              <td>Iridium Sprinkler</td>
              <td>24</td>
              <td>5×5 minus the sprinkler</td>
              <td>Wet</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Only tilled tiles take that water. Untilled dirt, paths, and chests in the radius
        stay dry. If a corner crop dies while the four neighbors live, you placed a basic
        sprinkler and expected a Quality shape.
      </p>

      <h2>Unlock the recipe that matches that count</h2>
      <p>
        You do not upgrade a placed sprinkler into the next tier. You craft the next item,
        or you find it. The recipes unlock with Farming:
      </p>
      <ul>
        <li>Farming 2 — Sprinkler: 1 Copper Bar and 1 Iron Bar.</li>
        <li>
          Farming 6 — Quality Sprinkler: 1 Iron Bar, 1 Gold Bar, and 1 Refined Quartz.
          Completing the Summer Crops Bundle (or the remixed Garden Bundle) also awards a
          Quality Sprinkler.
        </li>
        <li>
          Farming 9 — Iridium Sprinkler: 1 Gold Bar, 1 Iridium Bar, and 1 Battery Pack.
          Krobus sells one every Friday for 10,000g.
        </li>
      </ul>
      <p>
        If you are still on the starter can, the Farming 2 recipe is the whole point of the
        keyword. Craft a handful, test the 4-tile plus sign, and do not wait for iridium to
        start automating a small patch.
      </p>

      <h2>Lay a grid that still leaves a path</h2>
      <p>
        A sprinkler that waters a crop you cannot harvest is a bad placement. Leave walking
        tiles on purpose.
      </p>
      <p>
        Basic sprinklers need a staggered pattern because the corners are dry. Treat each
        plus sign as a unit. Offset the next plus so a dry corner of one unit sits on a wet
        arm of another, and keep a one-tile path where you actually walk at harvest.
      </p>
      <p>
        Quality sprinklers pack as 3×3 blocks. The sprinkler sits in the center of eight
        crops. Repeat the block, then leave a lane between groups for chests, scarecrows,
        and your own feet. Mid-game fields fail when every tile is a crop and you have to
        pick a path through wet dirt.
      </p>
      <p>
        Iridium sprinklers pack as 5×5 blocks. Twenty-four crops surround one sprinkler.
        Duplicate that square across the field and keep a lane for the daily loop. The
        late-game mistake is sliding two 5×5 blocks together until you cannot reach the
        middle without walking on a trellis.
      </p>

      <h2>Choose one upgrade: pressure nozzle or enricher</h2>
      <p>
        A placed sprinkler can take one upgrade, not two. Picking the sprinkler up returns
        the upgrade. You cannot run a Pressure Nozzle and an Enricher on the same machine.
      </p>
      <p>
        A Pressure Nozzle stretches the same three shapes: basic becomes a 3×3, Quality
        becomes a 5×5, Iridium becomes a 7×7. Qi’s Walnut Room sells four nozzles for 20 Qi
        Gems. One nozzle is enough for one sprinkler even though the icon looks like a
        single spout.
      </p>
      <p>
        An Enricher holds fertilizer and applies it when you plant in range. That is a
        planting job, not extra water. If the field is still dry in the corners, the
        Enricher will not save it.
      </p>
      <p>
        Choose the nozzle when the missing tiles are the problem. Choose the Enricher when
        the radius is already enough and you are tired of walking fertilizer out by hand.
        The planner can show both appearances. It does not spend Qi Gems or empty a
        fertilizer stack for you.
      </p>

      <h2>Greenhouse, sand, pots, and troughs</h2>
      <p>
        The greenhouse crop rectangle is 12 tiles wide and 10 tiles deep. Sprinklers can
        sit on the wood border and still water soil in range. The plot is not a clean stack
        of 5×5 squares, so some soil tiles have to hold sprinklers if you want full
        automation.
      </p>
      <p>
        Wiki layouts that minimize lost soil with Iridium Sprinklers use six of them and
        occupy four crop tiles, leaving 116 plants. Five Iridium Sprinklers with Pressure
        Nozzles occupy one crop tile and leave 119 plants. Four with nozzles occupy two crop
        tiles and leave 118. Quality layouts occupy twelve crop tiles. Those counts assume
        the indoor plot, not your outdoor farm.
      </p>
      <p>
        If you need Robin to move the greenhouse building on the outdoor map, use the{" "}
        <a href="/carpenter-stardew">Stardew Valley carpenter guide</a>. Moving the building
        does not change the indoor grid.
      </p>
      <p>
        Sprinklers cannot sit on sand, so a Beach farm dirt patch is not the beach itself.
        They cannot water Garden Pots or the pet bowl. They can water Slime Hutch troughs.
        A torch can sit on a sprinkler. None of those rules care what the planner sprite
        looks like if you forced Free Placement.
      </p>

      <h2>Check the radius in the planner before you plant</h2>
      <p>
        Open the <a className="blog-planner-link" href="/">Stardew Valley Planner</a> and
        put the sprinkler on the map you actually play. Catalog items include the three
        sprinklers. Cycle the appearance through Base, Pressure, and Enricher. Turn on
        sprinkler radius so the watered tiles light up. Scarecrow, Bee House, and Junimo
        Hut overlays are separate toggles if the field also needs those radii.
      </p>
      <p>
        Beach dirt versus sand is easier to see on{" "}
        <a className="blog-planner-link" href="/?farmType=beach">the Beach map</a>. Indoor
        occupancy is easier to see on{" "}
        <a className="blog-planner-link" href="/?farmType=greenhouse">the Greenhouse map</a>.
        Crop-heavy early layouts are easier to test on{" "}
        <a className="blog-planner-link" href="/?farmType=meadowlands">Meadowlands</a> if
        that is the farm you opened in-game.
      </p>
      <p>
        Projects stay in this browser. There is no account and no cloud copy. Screenshot
        export is available if you want a still of the overlay. Game-save import is
        experimental; unsupported or modded items may not map.
      </p>
      <p>
        The overlay is a placement preview. It does not run the morning watering tick,
        grant Farming XP, spend Qi Gems, or apply Enricher fertilizer. Free Placement can
        show a layout the game will reject. If the game forbids sand and the planner still
        drew a sprite, believe the game.
      </p>

      <h2>Sprinkler Stardew FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "Is it worth using sprinklers in Stardew Valley?",
            answer: (
              <p>
                Yes if the field is large enough that the watering can eats the morning. A
                sprinkler only wets 4, 8, or 24 tiles and only if those tiles are tilled.
                Deluxe Retaining Soil is the documented alternative that keeps a tile
                watered overnight without a sprinkler.
              </p>
            ),
          },
          {
            question: "How do you get the first sprinkler?",
            answer: (
              <p>
                Reach Farming 2 and craft it with 1 Copper Bar and 1 Iron Bar. That recipe
                waters four orthogonal tiles. Quality Sprinklers unlock at Farming 6;
                Iridium Sprinklers unlock at Farming 9.
              </p>
            ),
          },
          {
            question: "Can a sprinkler take a Pressure Nozzle and an Enricher together?",
            answer: (
              <p>
                No. One upgrade per sprinkler. Pressure Nozzle grows the radius to 3×3,
                5×5, or 7×7. Enricher applies loaded fertilizer when you plant. Qi’s Walnut
                Room sells four Pressure Nozzles for 20 Qi Gems.
              </p>
            ),
          },
          {
            question: "Why will the sprinkler not water a garden pot or sit on the beach?",
            answer: (
              <p>
                Sprinklers cannot water Garden Pots or the pet bowl, and they cannot be
                placed on sand. They can water Slime Hutch troughs. Check those rules
                in-game even if a planner sprite still appears under Free Placement.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        checkedLabel="Ranges, upgrades, and greenhouse occupancy checked against those pages on 2026-08-29 for PC 1.6.15. The planner overlay is a placement preview, not a watering simulation."
        heading="Sources"
        items={[
          {
            href: "https://wiki.stardewvalley.net/Sprinkler",
            label: "Stardew Valley Wiki: Sprinkler",
          },
          {
            href: "https://wiki.stardewvalley.net/Quality_Sprinkler",
            label: "Stardew Valley Wiki: Quality Sprinkler",
          },
          {
            href: "https://wiki.stardewvalley.net/Iridium_Sprinkler",
            label: "Stardew Valley Wiki: Iridium Sprinkler",
          },
          {
            href: "https://wiki.stardewvalley.net/Pressure_Nozzle",
            label: "Stardew Valley Wiki: Pressure Nozzle",
          },
          {
            href: "https://wiki.stardewvalley.net/Greenhouse#Sprinklers",
            label: "Stardew Valley Wiki: Greenhouse sprinklers",
          },
        ]}
      />
    </article>
  );
}
