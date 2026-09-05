import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function SprinklerStardewEnglishArticle() {
  return (
    <article>
      <p>
        A Stardew Valley sprinkler layout starts with one small correction: 4, 8, or 24
        is a watering count, not a promise that the same number of crop tiles will be
        useful. The item waters a fixed shape every morning. Soil, ponds, paths, map
        edges, buildings, and walking lanes decide how much of that shape becomes a
        working farm.
      </p>
      <p>
        Treat every sprinkler as a shape before you treat it as a farm plan. Place the
        device around the route you actually walk, then check the tiles that receive
        water. A layout that looks tidy in a screenshot can still leave a corner dry or
        put every harvest behind a crop you cannot walk through.
      </p>

      <h2>Start with the three watering shapes</h2>
      <p>
        A basic Sprinkler waters the four cardinal tiles: one above, below, left, and
        right. It does not water the four diagonal corners. A Quality Sprinkler waters
        the eight surrounding tiles, which makes a 3-by-3 block with the machine in
        the center. An Iridium Sprinkler waters the 24 surrounding tiles in a 5-by-5
        block.
      </p>
      <p>
        Only tilled tiles can receive the water. The sprinkler&apos;s own tile is occupied
        by the machine, so it is not a crop tile. A path inside the radius does not
        become a watered crop, and an un-tilled patch does not count just because the
        coverage overlay touches it.
      </p>
      <ul>
        <li>Sprinkler: 4 adjacent tiles in a plus shape; diagonal corners stay dry.</li>
        <li>Quality Sprinkler: 8 surrounding tiles in a 3-by-3 shape.</li>
        <li>Iridium Sprinkler: 24 surrounding tiles in a 5-by-5 shape.</li>
      </ul>
      <p>
        A coverage number is not a crop count. Four water targets do not mean four
        available plants if one target is a path. Twenty-four targets do not mean 24
        harvestable crops if the machine sits on tilled soil. Count the valid,
        reachable tiles after the shape meets the map.
      </p>

      <h2>Craft the tier that matches your current farm</h2>
      <p>
        The first Sprinkler recipe unlocks at Farming level 2 and uses one Copper Bar
        and one Iron Bar. It is an early automation tool for small patches, not a
        reason to wait until you can afford a complete field. Put a few plus shapes
        around the field you already have and keep a route between them.
      </p>
      <p>
        Quality Sprinklers unlock at Farming level 6. Each recipe uses one Iron Bar,
        one Gold Bar, and one Refined Quartz. The 3-by-3 shape is easier to repeat than
        the basic plus, but the center tile still belongs to the machine and every
        edge still has to fit your field.
      </p>
      <p>
        Iridium Sprinklers unlock at Farming level 9. Each recipe uses one Gold Bar,
        one Iridium Bar, and one Battery Pack. The 5-by-5 shape covers more ground, so
        the cost of a bad placement is also larger: one device can put a wide block
        over a pond, a building entrance, or the only useful walking lane.
      </p>
      <p>
        Do not build a layout around a future tier before the items exist. Start with
        the devices in your chest, leave room to replace the pattern, and recheck the
        map when the next recipe becomes available. A temporary 4-tile patch that
        saves watering today is more useful than an empty field waiting for iridium.
      </p>

      <h2>Build repeatable modules, then add the path</h2>
      <p>
        Basic Sprinklers work best as small staggered modules. A plus shape leaves dry
        diagonals, so offset the next device until those corners are covered by a
        neighbor. Do not force a large rectangle if the pattern pushes the useful
        water outside the tillable land. Split the field into pieces that you can
        expand without moving every existing crop.
      </p>
      <p>
        Quality Sprinklers make a clean 3-by-3 module: one machine in the middle and
        eight crop tiles around it. Repeat the module with three tiles between
        neighboring centers. If a route crosses the field, reserve that lane first
        and let the modules stop at the route rather than burying the route under
        crops.
      </p>
      <p>
        Iridium Sprinklers make a 5-by-5 module: one machine in the middle and 24
        surrounding targets. Neighboring centers are five tiles apart when you repeat
        the full block. On an irregular farm, it is often better to trim a module at
        the edge than to pretend that water landing on a cliff or pond is productive.
      </p>
      <ul>
        <li>Set the main walking lane before filling the last crop row.</li>
        <li>Keep chests and processing near the route, not in the only covered corner.</li>
        <li>Leave a working edge when a field may grow after a tool upgrade.</li>
        <li>Recount the tiles after moving one device; overlapping shapes do not add a new crop tile.</li>
      </ul>
      <p>
        A sprinkler that waters a crop you cannot reach has solved watering and created
        a harvest problem. Walk the route from the farmhouse to the field, then from
        the field to storage or the shipping bin. The shortest theoretical pattern is
        not automatically the easiest daily pattern.
      </p>

      <h2>Count effective coverage, not the biggest number</h2>
      <p>
        Begin with the number of crop tiles you want to keep. Mark tiles that are
        already unavailable because of water, cliffs, entrances, buildings, or map
        boundaries. Only then compare the nominal 4, 8, or 24 targets against the
        remaining soil. This prevents a three-Iridium calculation from looking better
        than a four-Iridium calculation that actually waters the whole field.
      </p>
      <p>
        Ponds and rivers are not just empty-looking cells. They break a rectangular
        plan and change where a device can sit. The Beach farm has another boundary:
        sprinklers cannot be placed on sand. A dirt patch on that map can support a
        plan, while the surrounding sand cannot accept the machine even if the sprite
        appears there under a permissive placement mode.
      </p>
      <p>
        The same distinction matters for Garden Pots and the pet water bowl. A
        sprinkler does not water Garden Pots or fill the pet bowl. Sprinklers can
        water Slime Hutch troughs. These are object rules, not visual guesses, so keep
        them in the constraint list beside the shape and the route.
      </p>
      <p>
        Greenhouse planning has its own geometry. The crop bed is 10 rows by 12
        columns, and a sprinkler can sit on the surrounding wood border while watering
        soil in range. Six Iridium Sprinklers can leave four crop tiles occupied in a
        standard efficient arrangement; 16 Quality Sprinklers can leave 12 crop tiles
        occupied. Those numbers describe a particular indoor layout, not every farm
        map.
      </p>

      <h2>Choose one upgrade for one job</h2>
      <p>
        A placed sprinkler can hold one upgrade at a time. A Pressure Nozzle increases
        the watering shapes. Pressure Nozzle grows the radius to 3×3, 5×5, or 7×7.
        That means basic Sprinkler, Quality Sprinkler, and Iridium Sprinkler
        respectively. Qi&apos;s Walnut Room sells four Pressure Nozzles for 20 Qi Gems.
      </p>
      <p>
        An Enricher is a different job. Load it with fertilizer and it applies that
        fertilizer when you plant nearby. It does not make the watering shape larger.
        A sprinkler cannot use a Pressure Nozzle and an Enricher together, so choose
        the missing capability instead of trying to stack both attachments.
      </p>
      <p>
        Use a Pressure Nozzle when your field is short on reachable water targets or
        when the larger shape lets you reclaim a machine tile. Use an Enricher when
        water coverage is already correct and planting fertilizer is the repetitive
        task. After installing either upgrade, redraw the grid: the old center spacing
        no longer describes the same coverage.
      </p>
      <p>
        Picking up the placed sprinkler removes the upgrade without destroying it.
        That makes experimentation reversible, but it does not make every position
        valid. Check the new shape against soil, paths, buildings, and the route again
        before planting around it.
      </p>

      <h2>Keep greenhouse and outdoor rules separate</h2>
      <p>
        The Greenhouse is a useful test case because its crop rectangle and its border
        do not behave like an open farm field. Sprinklers on the wood border can water
        nearby soil, while the 10-by-12 crop bed remains a finite pool of planting
        tiles. If a device sits on soil, subtract that tile from your crop total.
        If you also need to move a farm building, check{" "}
        <a href="/carpenter-stardew">the carpenter guide</a> before fixing the field
        route.
      </p>
      <p>
        The outer greenhouse area can hold fruit trees, but tree growth needs a clear
        surrounding area. A border sprinkler that is harmless to crop coverage can
        still be badly timed beside an unfinished sapling. Mark tree positions before
        committing the border pattern when the greenhouse is also an orchard.
      </p>
      <p>
        Rain does not water greenhouse crops, and the room does not need scarecrows.
        Those rules do not transfer to an outdoor field. Outdoor crops still depend on
        the sprinkler shape, tilled soil, and any map obstacles between the device and
        the crop.
      </p>

      <h2>Plan for the day you actually play</h2>
      <p>
        A crop-heavy layout needs a route for planting, harvesting, and replacing
        fertilizer. An animal-heavy farm needs the route between the farmhouse, barns,
        coops, hay storage, and shipping. A processing corner needs enough space to
        approach the machines without walking through a crop row. Sprinkler coverage
        is only one layer of the plan.
      </p>
      <p>
        Put a lane where your character will cross the field, then fit the 3-by-3 or
        5-by-5 modules around it. When a path breaks a module, count the new effective
        crop tiles instead of preserving the original arithmetic. A slightly smaller
        field that you can harvest without detours may save more time every day.
      </p>
      <p>
        If you use trellis crops, reserve the walking side before the crop is planted.
        Trellises block movement. If you add a Junimo Hut, Bee House, scarecrow, or
        storage after the sprinkler grid, treat it as a new obstacle and inspect the
        coverage and route again.
      </p>

      <h2>Use the planner to check geometry before planting</h2>
      <p>
        Open the{" "}
        <a className="blog-planner-link" href="/">
          Stardew Valley Planner
        </a>
        , choose the farm map you actually use, and place the sprinkler tier you own.
        Turn on the sprinkler-radius overlay so the target tiles are visible. Use the
        Greenhouse map for indoor layouts, the{" "}
        <a className="blog-planner-link" href="/?farmType=beach">
          Beach map
        </a>{" "}
        for sand boundaries, and the other farm maps for ponds, cliffs, and unusual
        entrances.
      </p>
      <p>
        The planner shows placement geometry, not tomorrow morning. It can display the
        coverage relationship between a placed sprinkler and the map, but it does not
        run the watering tick, grant Farming XP, spend Qi Gems, apply fertilizer, or
        change your game save. If a Free Placement preview shows a sprite where the
        game rejects sand, the game rule wins.
      </p>
      <p>
        Read the map in three passes. First find uncovered tilled tiles. Next find
        water that falls on ponds, paths, boundaries, or already-covered targets.
        Finally walk the route from the entrance to the crops and storage. Fix one
        category at a time so a coverage repair does not quietly create a path problem.
      </p>
      <p>
        Projects stay in this browser, and screenshot export gives you a still image
        of the layout when you want to rebuild it in-game. Save import is experimental;
        unsupported or modded items may not map. The preview helps you decide where
        items belong, while the game remains the authority for whether the placement
        and watering action is accepted.
      </p>
      <p>
        If you want the indoor version first, open{" "}
        <a className="blog-planner-link" href="/?farmType=greenhouse">
          the Greenhouse map
        </a>
        . For a general radius reference, use{" "}
        <a className="blog-planner-link" href="/?farmType=meadowlands">
          a farm map with open crop space
        </a>
        , place one tier, and verify its shape before expanding the pattern.
      </p>

      <h2>Fix a dry tile without rebuilding the farm</h2>
      <ul>
        <li>A dry diagonal beside a machine usually means you used a basic Sprinkler.</li>
        <li>A dry crop on an un-tilled tile is not a sprinkler failure; prepare the soil first.</li>
        <li>A machine on sand is invalid even if a permissive preview lets you see it there.</li>
        <li>A covered pond or path is nominal coverage that does not become a harvestable crop tile.</li>
        <li>A new Pressure Nozzle requires a new center spacing and a fresh path check.</li>
        <li>A Garden Pot and the pet bowl need their own water rules, not a larger sprinkler.</li>
      </ul>
      <p>
        Move the smallest number of devices that fixes the specific failure. If the
        problem is one dry edge, change the edge module. If the problem is a blocked
        route, reclaim that lane and recount the field. If the problem is the wrong
        object type, replace the watering plan instead of adding more machines.
      </p>

      <h2>A repeatable Stardew Valley sprinkler workflow</h2>
      <ol>
        <li>Count the crop tiles you want and mark every hard map boundary.</li>
        <li>Choose the sprinkler tier that exists in your inventory now.</li>
        <li>Set the main walking lane before placing the last crop row.</li>
        <li>Place repeatable plus, 3-by-3, or 5-by-5 modules around that lane.</li>
        <li>Turn on the planner overlay and check uncovered soil, invalid targets, and overlap.</li>
        <li>Plant only after the water shape and daily route both work.</li>
        <li>Recheck after a Pressure Nozzle, a new building, a pond-side change, or a new crop.</li>
      </ol>
      <p>
        The reliable question is not “How many tiles does this item advertise?” It is
        “Which of my crop tiles will be watered, reachable, and still available after
        every boundary is respected?” Answer that question on the map before you spend
        a season walking around a pattern that looked perfect from above.
      </p>

      <h2>Sprinkler Stardew FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "What is the best sprinkler layout in Stardew Valley?",
            answer: (
              <p>
                The best layout depends on the tier you own and the field you need to water. Basic Sprinklers use a plus shape, Quality Sprinklers use a 3-by-3 block, and Iridium Sprinklers use a 5-by-5 block. Fit the shape around soil and a walking route, then check the actual covered tiles.
              </p>
            ),
          },
          {
            question: "How many tiles does each sprinkler water?",
            answer: (
              <p>
                A basic Sprinkler waters 4 cardinal tiles, a Quality Sprinkler waters 8 surrounding tiles, and an Iridium Sprinkler waters 24 surrounding tiles every morning. Only tilled tiles can receive that water, and the sprinkler&apos;s own tile is occupied.
              </p>
            ),
          },
          {
            question: "Do a Pressure Nozzle and an Enricher work together?",
            answer: (
              <p>
                No. One placed sprinkler can use one upgrade at a time. A Pressure Nozzle increases the range to 3-by-3, 5-by-5, or 7-by-7 depending on the sprinkler. An Enricher applies loaded fertilizer when you plant nearby.
              </p>
            ),
          },
          {
            question: "Why does the planner show a sprinkler where the game will not accept it?",
            answer: (
              <p>
                The planner is a placement preview and can show geometry under Free Placement. The game still controls valid placement, including the rule that sprinklers cannot be placed on sand. Check the game rule before treating a preview sprite as a legal item.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        checkedLabel="Ranges, recipes, upgrades, and placement limits checked against Stardew Valley Wiki pages on September 5, 2026. The planner is a placement preview, not a watering simulation."
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
