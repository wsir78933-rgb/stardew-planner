import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function OakTreeStardewEnglishArticle() {
  return (
    <article>
      <p>
        An oak tree in Stardew Valley is a common wild tree that grows from an Acorn. It
        yields Oak Resin when you attach a Tapper, and it yields wood, sap, and possible
        extra acorns when you chop it down. That is a different job from a fruit tree,
        which grows from a purchased sapling, needs a clear 3-by-3 hole, and cannot take
        a tapper.
      </p>
      <p>
        Finish the grove in this order: identify a real oak, collect acorns, plant with
        wild-tree spacing, wait for maturity or use Tree Fertilizer, then tap or chop.
        Sketch the trunk positions on your farm map before you spend a season on a
        blocked seedling. The planner can show those positions. It does not grow the
        tree, drop resin, or advance winter nights.
      </p>

      <h2>Identify an oak tree, not a fruit tree</h2>
      <p>
        Start by naming the object in front of you. Oak, Maple, Pine, and Mahogany are
        common wild trees. Oak is the one whose seed is an Acorn and whose tapper product
        is Oak Resin. Maple uses a Maple Seed and produces Maple Syrup. Pine uses a Pine
        Cone and produces Pine Tar. Mahogany uses a Mahogany Seed and produces Sap. If
        the seed in your inventory is an Apricot Sapling, a Cherry Sapling, or another
        fruit sapling, you are holding a fruit tree, not an oak.
      </p>
      <p>
        A mature oak occupies one tile. Fruit trees also occupy one tile at the trunk,
        but they demand a different planting rule: each fruit sapling must sit in the
        center of a clear 3-by-3 patch, and two fruit trees cannot share that patch.
        Wild oaks do not use that orchard hole. You can plant an acorn on a single valid
        tile, even next to water or with pavement around it, as long as the seed itself
        can go into the soil.
      </p>
      <p>
        The practical mix-up is visual. Both families look like trees, and both can sit
        on a farm edge. The test is the seed and the product. Shake or chop an oak and
        you are looking for acorns once Foraging is at least level 1. Tap it and you are
        waiting for Oak Resin. A fruit tree never accepts a tapper. If you came here
        because you want indoor fruit, that layout lives in the Greenhouse ring, not in
        an outdoor acorn row.
      </p>
      <ul>
        <li>Oak: seed is Acorn; tapper product is Oak Resin; chop product is wood and sap.</li>
        <li>Fruit tree: seed is a fruit sapling; product is fruit in season; tapper will not attach.</li>
        <li>Green Rain Tree (Oak) in the planner catalog is a different 1-by-1 item from Oak Tree (Normal).</li>
      </ul>
      <p>
        Version 1.6 adds one more look-alike. Oak trees that are not in Pelican Town or
        the Greenhouse may turn into Green Rain Trees in Fall and stay that way until
        Spring. A regular Tapper on the tree stops that change. A Heavy Tapper does not
        reliably stop it: the Heavy Tapper wiki records a bug where oak and maple with a
        Heavy Tapper can still transform in Fall. In the planner catalog, Oak Tree
        (Normal) and Green Rain Tree (Oak) are two different 1-by-1 placeables. Placing
        the green-rain sprite is not the same as running a Green Rain weather event.
      </p>

      <h2>Get acorns before you plant a grove</h2>
      <p>
        You cannot plant an oak grove from intention. You need acorns. The Acorn item
        description is direct: it can be planted to grow an oak tree. Pierre&apos;s General
        Store does not sell it. JojaMart does not sell it. The Traveling Cart can, at
        100g to 1,000g. That cart roll is a backup, not a reliable first source.
      </p>
      <p>
        The ordinary sources are already-grown oaks. Shake a mature oak, or chop it, once
        Foraging is at least level 1. Chopping also requires that you have slept through
        the level-up screen before chopped trees drop seeds. Shaking becomes available as
        soon as you level up. Each night, a mature tree has a 5% chance to generate a
        loose seed; shaking is how that seed actually falls. Chopping a mature oak can
        drop 0 to 2 extra acorns on top of any loose seed, still only if Foraging is at
        least 1.
      </p>
      <p>
        On the farm, a fully grown oak can also drop an acorn onto the ground. Dig that
        acorn up with an Axe or a Pickaxe. Garbage Cans can produce acorns. A Woodskip
        Fish Pond can produce 1 to 5 acorns when the population reaches 9. Those pond
        acorns are useful once the pond is already built; they are not a reason to delay
        shaking the oaks you can already reach.
      </p>
      <ul>
        <li>Shake a mature oak after Foraging level 1 for a possible loose acorn.</li>
        <li>Chop a mature oak after the same level for 0 to 2 extra acorns plus wood and sap.</li>
        <li>Dig a farm-dropped acorn with an Axe or Pickaxe.</li>
        <li>Check Garbage Cans and a Woodskip pond at population 9 if you still need more.</li>
        <li>Use the Traveling Cart only when the 100g to 1,000g price is acceptable.</li>
      </ul>
      <p>
        Count acorns against the grove you actually want. A tapping corner of four mature
        oaks needs four acorns that all reach stage 5. A wood lot that you plan to chop
        and replant needs a spare acorn for each stump you intend to replace. Spending
        acorns on Field Snack (1 Acorn, 1 Maple Seed, 1 Pine Cone at Foraging level 1)
        or on a Mystic Tree Seed (5 of each common seed at Foraging Mastery) is a
        different craft. Do that after the grove has its seeds, not before.
      </p>
      <p>
        Outside the farm, you can plant an acorn in tillable ground if that ground is
        un-tilled. Version 1.4 blocked planting into tilled tiles off the farm. Hoeing
        a tile first is a failed plant, not a required preparation. On the farm, plant
        the acorn where the trunk should stand. You do not water it. You do not hoe it
        first unless you then until the tile again.
      </p>

      <h2>Plant with wild-tree spacing, not orchard spacing</h2>
      <p>
        Fruit-tree spacing is a 3-by-3 keep-out zone around every sapling until that
        tree is mature. Wild oak spacing is smaller and easier to get wrong because it
        looks permissive. An acorn does not need the eight surrounding tiles to be empty
        in order to grow. Paths, floors, and nearby objects can stay. The growth blocker
        is a neighboring mature tree, not a neighboring path.
      </p>
      <p>
        A planted acorn grows through four stages before maturity. Stage 4 takes twice as
        long as the earlier stages. The seedling never grows past stage 4 if a mature
        tree occupies any of its eight adjacent tiles. Two mature wild trees therefore
        cannot stand side by side. Diagonal neighbors count. If you plant a second acorn
        against an already mature oak, that second tree can stall as a stage 4 bush until
        you chop the neighbor or accept that it will not finish.
      </p>
      <p>
        For a tapping grove, leave at least one empty tile between trunks in every
        direction, including diagonals. Trunks with a one-tile gap can all reach stage
        5. Trunks on a packed adjacent grid cannot. Fruit-tree orchard math (two tiles
        between trunks, 3-by-3 clear) is stricter than this and uses extra farm space
        if you apply it to oaks. Use the orchard rule only for fruit saplings.
      </p>
      <ol>
        <li>Mark each oak trunk on one tile. Do not reserve a 3-by-3 orchard hole.</li>
        <li>Keep every pair of future mature trunks out of each other&apos;s eight adjacent tiles.</li>
        <li>Leave a walking tile to each trunk if you plan to collect resin or chop wood.</li>
        <li>Plant after the tile is valid and un-tilled. Do not hoe off-farm tiles first.</li>
      </ol>
      <p>
        On the farm, mature oaks also try to plant themselves. Each night, a mature farm
        tree has a 15% chance to attempt one new seed within three tiles. The chosen
        tile must already be a valid empty location. Trees will not destroy paths or
        crops to do this. If you want a controlled tapping block, pave or occupy the
        tiles you refuse to give to volunteer seedlings. If you want a spreading wood
        lot, leave empty valid tiles inside that three-tile radius and remove stumps
        after you chop.
      </p>
      <p>
        Off the farm, trees never spontaneously spread planted seeds. You can still plant
        acorns yourself on valid un-tilled tillable ground. Pre-existing oaks that you
        chop, with the stump removed, have a 20% chance each night to reappear as a
        stage 3 seedling, including in winter. If the stump remains, that tree does not
        return. Use off-farm oaks as a seed source or a temporary tap when you do not
        want them on the farm grid. Do not treat town trees as a single rule: the Oak
        Tree page says oaks outside the farm, but not in Pelican Town, can be tapped or
        chopped, while the Trees page says town trees east of the river can be chopped,
        tapped, or shaken, and trees west of the river can only be shaken. Check the
        specific tree in the game instead of forcing those two sentences into one rule.
        For town geography, the{" "}
        <a className="blog-planner-link" href="/stardew-valley-town-map">
          Stardew Valley town map
        </a>{" "}
        is the layout page; it does not decide whether a given oak accepts a tapper.
      </p>

      <h2>Grow: 20% nights versus Tree Fertilizer in 5 days</h2>
      <p>
        Unfertilized oaks do not grow on a calendar. Each night in Spring, Summer, or
        Fall, a seedling has a 20% chance to advance one stage. Stage 4 spends twice as
        long, so the tree is waiting on five successful advances, not four. In Winter,
        unfertilized trees do not grow at all, except trees in the Desert and on Ginger
        Island. There is no watering step. Waiting beside a dry acorn does not help.
      </p>
      <p>
        Wiki pages disagree on the typical wait, and those two figures should stay
        separate. The Oak Tree page and the Trees page both give a median of 24 days to
        maturity, with individual trees varying a lot. The Trees page also says 90% of
        non-Mahogany seeds should mature in 38 days excluding winter, and 99% in 55 days.
        The Acorn page gives a median of about 18 days, with over 90% of seeds maturing
        in less than 32 growing days. Do not average 18 and 24 into a fake 21. Plan with
        the doubled stage 4 from the tree pages if you need a conservative wait, and
        treat 18 days as the Acorn page&apos;s own median, not a second measurement of the
        same sample.
      </p>
      <div
        aria-label="Oak growth options"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">What happens each night</th>
              <th scope="col">Winter</th>
              <th scope="col">Time to a mature oak</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No fertilizer</td>
              <td>20% chance to advance; stage 4 takes twice as long</td>
              <td>No growth, except Desert and Ginger Island</td>
              <td>Median 24 days on the Oak Tree and Trees pages; about 18 days on the Acorn page</td>
            </tr>
            <tr>
              <td>Tree Fertilizer</td>
              <td>One stage per night; stage 4 still takes two nights</td>
              <td>Grows in winter</td>
              <td>Five days for a non-Mahogany oak</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Tree Fertilizer is the winter and speed option. Craft it at Foraging level 7 from
        5 Fiber and 5 Stone, or produce it in a Bone Mill. Sprinkle it on an acorn or
        sapling that is already planted. It does not work on an empty tile, and it does
        not work on fruit trees or tea bushes. Fertilized oak, maple, and pine seedlings
        take on a red hue until they are fully grown. For oak, that schedule is five
        days including winter: stages 1 to 3 advance overnight, stage 4 takes two nights,
        then the tree is mature.
      </p>
      <p>
        Fertilizer does not remove the adjacent-mature-tree rule. A fertilized seedling
        beside a mature oak still cannot pass stage 4. If a tree has sat at stage 4 for
        many nights, inspect the eight neighboring tiles before you craft more
        fertilizer. Chop the blocking mature tree, or accept a permanent bush. Lightning
        is a separate failure: a common tree hit by lightning is destroyed and leaves a
        stump, unlike a fruit tree, which produces coal for several days. A tapper on a
        lightning-struck tree is destroyed with its contents.
      </p>
      <p>
        Moss is not a growth stage. Maple, oak, and pine can carry moss in every season
        except winter. You harvest it with one use of any tool and receive 1 to 2 moss
        without chopping the tree. In the planner, Moss is a presentation variant on Oak
        Tree, not a control that ages the seedling. Switching the planner season swaps
        textures. It does not simulate overnight growth or winter stall.
      </p>

      <h2>Tap for Oak Resin or chop for wood</h2>
      <p>
        Decide the job before the tree is mature. A tapping oak is a machine tile that
        you visit on a timer. A chopping oak is a wood source that you replace. You can
        convert one into the other, but not while the tapper is attached. A tree with a
        tapper cannot be chopped or shaken until you remove the tapper with one axe or
        pickaxe hit. Moss can still be scythed off a tapped tree; that shake does not
        remove the tapper.
      </p>
      <p>
        The Tapper recipe unlocks at Foraging level 4 and costs 40 Wood and 2 Copper
        Bars. Version 1.6 moved that recipe from Foraging level 3 to level 4. Place the
        tapper on a mature oak. Oak Resin takes 7 nights with a regular Tapper and 3
        nights with a Heavy Tapper. Tapping continues through winter on oak, maple,
        pine, mahogany, and mystic trees. The Tapper cannot be placed on fruit trees.
      </p>
      <p>
        Heavy Tapper is a later upgrade, not a starter tool. Buy the recipe in Qi&apos;s
        Walnut Room for 20 Qi Gems, then craft it from 30 Hardwood and 1 Radioactive
        Bar. It runs at twice the regular tapper rate on oak. Keep the Fall leaf-shed
        bug in mind: a regular tapper prevents the 1.6 Green Rain transformation, but a
        Heavy Tapper may not. If keeping the ordinary oak sprite through Fall matters,
        use a regular tapper on that tree.
      </p>
      <div
        aria-label="Oak tap and chop products"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Result</th>
              <th scope="col">Requirement or limit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Regular Tapper</td>
              <td>Oak Resin every 7 nights</td>
              <td>Foraging 4; 40 Wood and 2 Copper Bars; mature oak</td>
            </tr>
            <tr>
              <td>Heavy Tapper</td>
              <td>Oak Resin every 3 nights</td>
              <td>Qi Walnut Room recipe; 30 Hardwood and 1 Radioactive Bar</td>
            </tr>
            <tr>
              <td>Chop mature oak</td>
              <td>12 to 16 Wood, 5 Sap, 0 to 2 Acorns</td>
              <td>Acorns need Foraging 1; Forester and Woody&apos;s Secret can raise wood</td>
            </tr>
            <tr>
              <td>Chop remaining stump</td>
              <td>5 to 9 Wood and 1 Sap in single-player; 4 Wood in multiplayer</td>
              <td>Forester raises those totals; remove the stump if an off-farm tree should respawn</td>
            </tr>
            <tr>
              <td>Chop stage 4 seedling</td>
              <td>4 Wood (5 with Forester)</td>
              <td>Use an axe</td>
            </tr>
            <tr>
              <td>Chop stage 2 or 3 with an axe</td>
              <td>Possible 1 Wood</td>
              <td>Chance is ten times Foraging level; other tools drop nothing</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Oak Resin sells for 150g, or 187g with the Tapper profession. The Artisan
        profession does not apply, even though the item is labeled an artisan good. The
        crafting jobs that consume it are specific. A Keg costs 30 Wood, 1 Copper Bar, 1
        Iron Bar, and 1 Oak Resin, and unlocks at Farming level 8. Deluxe Speed-Gro
        costs 1 Oak Resin and 5 Bone Fragments at the same farming level. The
        Enchanter&apos;s Bundle on the Bulletin Board wants Oak Resin. The Exotic Foraging
        Bundle in the Crafts Room can accept it as one option. If the reason you planted
        oaks is keg production, count resin against kegs, not against a generic
        &quot;syrup income&quot; that actually belongs to maple.
      </p>
      <p>
        Chopping is the wood path. A mature oak always falls left or right away from you
        when that direction exists. Stand off-center if you chop from above or below so
        the drop direction is obvious. Items that fall into water can vanish. After the
        trunk is gone, the stump is a second harvest. Lumberjack can add random Hardwood
        on the trunk chop. If the wood is for a Robin building, confirm the building
        footprint in the{" "}
        <a className="blog-planner-link" href="/carpenter-stardew">
          Carpenter Stardew guide
        </a>{" "}
        after you know how much wood the grove can supply. The carpenter page does not
        grow oaks, and this grove does not place a Coop.
      </p>
      <p>
        Stage 1 is only the seed. At Foraging 1 or higher, an axe, hoe, or pickaxe
        returns that acorn. Use that recovery when you planted on the wrong side of a
        mature neighbor. Do not wait weeks on a stage 4 tree that cannot finish.
      </p>

      <h2>Lay out an oak grove on your farm map</h2>
      <p>
        Placement is the step the wiki cannot finish for you. Open the{" "}
        <a className="blog-planner-link" href="/?farmType=standard">
          Standard Farm map
        </a>
        , switch to Placeables, and search oak. The catalog item you want for a wild
        grove is Oak Tree (Normal), a 1-by-1 placeable. Green Rain Tree (Oak) is listed
        separately; do not use it as a substitute ordinary oak. Tapper and Heavy Tapper
        are also separate 1-by-1 placeables. Put the tapper sprite on the trunk tile you
        intend to visit, then look at the walking lane, not only the canopy.
      </p>
      <p>
        The planner is a placement sketch. It can show Oak Tree on official farm maps,
        including Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach,
        and Meadowlands, plus Ginger Island in the farm picker. It does not grow an
        acorn overnight, does not roll the 20% growth chance, does not apply Tree
        Fertilizer, does not produce Oak Resin, and does not simulate winter stall. A
        season button changes wild-tree textures. It does not advance days. Projects
        stay in this browser. There is no account and no cloud sync. The tool is
        fan-made and is not affiliated with or endorsed by ConcernedApe or Stardew
        Valley.
      </p>
      <p>
        Use the map to answer geometry questions the game will not preview: whether a
        tapping block leaves a path from the farmhouse, whether a wood lot sits on a
        future barn pad, and whether crop sprinklers will waste water on tree tiles. If
        the grove shares an edge with a crop field, check sprinkler radius on the{" "}
        <a className="blog-planner-link" href="/sprinkler-stardew">
          Sprinkler Stardew coverage
        </a>{" "}
        page, then return here. A sprinkler that covers an oak trunk is not watering a
        crop. Do not open the Greenhouse interior map for this job. That interior is a
        fruit-tree and crop-bed problem.
      </p>
      <ol>
        <li>Choose the farm type you actually play, starting from Standard if you have not switched.</li>
        <li>Search Placeables for oak and select Oak Tree (Normal), not Green Rain Tree (Oak).</li>
        <li>Place trunks with at least one tile between mature neighbors, including diagonals.</li>
        <li>Place Tapper or Heavy Tapper sprites only on trunks you will visit on the 7-night or 3-night timer.</li>
        <li>Keep a walking tile to each tapped trunk and to any chopping pile.</li>
        <li>Export or screenshot the sketch, then plant acorns in the game on those tiles.</li>
      </ol>
      <p>
        Free Placement can show a tree where the game later rejects it. The editor
        warning is explicit: some layouts may not be achievable in-game. Treat a Free
        Placement oak as a drawing, then confirm the tile in the save. The Blocked
        (Trees) view option marks tiles that are not tree-plantable in the map data. That
        overlay is a map highlight, not a guarantee that an Oak Tree (Normal) catalog
        item will plant on a given farm tile. The Placeables list includes Oak Tree
        (Normal) on Standard Farm. Confirm the planted acorn in the game; a planner
        sprite is not proof that the save accepted the seed.
      </p>
      <p>
        Match the sketch to the job. A resin grove wants mature trunks you can reach
        every 7 or 3 nights without walking through crops. A wood lot wants space for
        the tree to fall and for you to clear the stump. A mixed edge wants the oak
        trunks outside sprinkler modules. Recheck after you add a building, a path, or a
        fruit-tree orchard, because those objects change the walking lane even when they
        do not use the wild-tree adjacency rule.
      </p>

      <h2>Check the grove before you wait a season</h2>
      <p>
        The expensive mistake is waiting. Unfertilized median waits are measured in
        weeks, and winter adds a full-season pause. Run this check on the night you
        plant, not on the day you notice the tree is still a bush.
      </p>
      <ul>
        <li>Seed check: the item in the ground is an Acorn, not a fruit sapling and not a Maple Seed.</li>
        <li>Tile check: the tile was valid and un-tilled at plant time, especially off the farm.</li>
        <li>Neighbor check: no mature tree sits in the eight adjacent tiles of any unfinished oak.</li>
        <li>Winter check: unfertilized oaks will not grow; Tree Fertilizer is the winter growth path.</li>
        <li>Job check: tapping trees have a visit route; chopping trees have fall space and stump access.</li>
        <li>Tapper check: recipe is Foraging 4, 40 Wood, 2 Copper Bars; 7 nights resin, 3 with Heavy Tapper.</li>
        <li>Fall check: a regular tapper can hold the ordinary oak through the 1.6 leaf-shed; Heavy Tapper may not.</li>
        <li>Planner check: the Standard Farm sketch matches the trunks you planted; plant the acorns in the game after the sketch.</li>
      </ul>
      <p>
        If a seedling is stuck at stage 4, the neighbor check comes first. Fertilizer
        will not push it through a mature oak at its shoulder. Chop the blocker, move
        the acorn with an axe at stage 1, or keep a decorative bush. If nothing grows in
        Winter, that is the unfertilized rule, not a broken seed. If a town oak refuses
        a tapper, believe the in-game interaction. The Oak Tree page and the Trees page
        describe Pelican Town oaks differently, so do not assume every town tree follows
        one sentence.
      </p>
      <p>
        After maturity, watch the product, not the sprite. A tapping oak is finished
        when Oak Resin appears on the 7-night or 3-night timer and you can reach the
        tree. A chopping oak is finished when the wood, sap, and possible acorns are on
        the ground and the stump is cleared or deliberately kept. A spreading wood lot
        is finished when empty valid tiles exist inside three tiles of a mature farm oak
        and you are willing to let the 15% nightly plant attempt use them.
      </p>
      <p>
        Recheck when the farm changes. Pavement around an oak does not stop wild-tree
        growth, but a new path can still block your resin route. A new
        barn can occupy a fall direction. A new fruit sapling can steal the 3-by-3 hole
        next to an oak without breaking the oak&apos;s own growth. The oak rule and the fruit
        rule stay separate after construction day.
      </p>

      <h2>If you meant Greenhouse trees</h2>
      <p>
        Greenhouse trees in most layout guides are fruit trees on the indoor ring. They
        are not oaks, they cannot take a tapper, and they use fruit-tree clearance while
        they grow. If that is the problem you actually have, open the{" "}
        <a className="blog-planner-link" href="/glasshouse-stardew-valley">
          Greenhouse layout guide
        </a>
        . Do not plant acorns in that interior to copy an orchard screenshot.
      </p>
      <p>
        Oaks can exist as wild trees in many outdoor maps. They are the wrong tool for
        the indoor fruit ring. Keep this page for acorns, wild spacing, resin, and wood.
        Use the greenhouse page for the crop bed, wooden border, and fruit-tree ring.
        The two maps do not share a planting rule.
      </p>

      <h2>A repeatable oak grove sequence</h2>
      <ol>
        <li>Confirm the tree or seed is oak/Acorn, not a fruit sapling.</li>
        <li>Collect enough acorns from shaking, chopping, ground drops, or a pond before you mark tiles.</li>
        <li>Place trunks so future mature oaks are not in each other&apos;s eight adjacent tiles.</li>
        <li>Plant on a valid un-tilled tile and water nothing.</li>
        <li>Use Tree Fertilizer if you need five-day growth or winter growth.</li>
        <li>Tap for Oak Resin on a 7-night or 3-night timer, or chop for wood and then clear the stump.</li>
        <li>Sketch the same trunks on the Standard Farm map, then plant in the game rather than waiting on the sketch to grow.</li>
      </ol>
      <p>
        The grove is ready when every trunk you care about is a stage 5 oak, every
        unfinished seedling has a legal neighbor set, and every tapping or chopping
        visit has a tile you can walk. That is a farm layout you can maintain. It is not
        a fruit orchard, and it is not a planner simulation of resin.
      </p>

      <h2>Oak tree Stardew FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "How long does an oak tree take to grow in Stardew Valley?",
            answer: (
              <p>
                Unfertilized oaks have a 20% chance to grow each night except in winter. The Oak Tree and Trees wiki pages give a median of 24 days. The Acorn page gives a median of about 18 days. Tree Fertilizer finishes a non-Mahogany oak in 5 days, including winter. Do not average 18 and 24.
              </p>
            ),
          },
          {
            question: "How do I get acorns?",
            answer: (
              <p>
                Shake or chop a mature oak after Foraging level 1, dig up acorns that drop on the farm, check Garbage Cans, or raise a Woodskip pond to population 9. Pierre and Joja do not sell acorns. The Traveling Cart can, at 100g to 1,000g.
              </p>
            ),
          },
          {
            question: "Can I plant oak trees next to each other?",
            answer: (
              <p>
                You can plant the acorns on adjacent tiles, but a seedling will not grow past stage 4 if a mature tree occupies any of its eight adjacent tiles. Leave at least one tile between trunks if you want every oak to mature. That is still tighter than fruit-tree 3-by-3 spacing.
              </p>
            ),
          },
          {
            question: "How often does an oak tapper produce Oak Resin?",
            answer: (
              <p>
                A regular Tapper produces Oak Resin every 7 nights. A Heavy Tapper produces it every 3 nights. Craft the regular tapper at Foraging 4 from 40 Wood and 2 Copper Bars. Tapping continues in winter on oak.
              </p>
            ),
          },
          {
            question: "Do oak trees grow in winter?",
            answer: (
              <p>
                Unfertilized oaks do not grow in winter, except in the Desert and on Ginger Island. Tree Fertilizer makes wild oaks grow in winter and reaches maturity in 5 days. Tapping still produces Oak Resin in winter.
              </p>
            ),
          },
          {
            question: "Is an oak tree the same as a Greenhouse fruit tree?",
            answer: (
              <p>
                No. Oaks are wild trees grown from acorns and can be tapped. Greenhouse ring trees in the layout guide are fruit trees. Use the Greenhouse guide for that interior. The oak grove steps cover acorns, resin, and outdoor groves.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        checkedLabel="Oak growth, tapping, chopping, spacing, and 1.6 Fall leaf-shed checked against Stardew Valley Wiki pages on September 11, 2026. Median 18-day and 24-day figures are recorded as a wiki conflict and are not averaged. The planner is a placement sketch, not a growth or tapping simulation."
        items={[
          {
            href: "https://wiki.stardewvalley.net/Oak_Tree",
            label: "Stardew Valley Wiki: Oak Tree",
          },
          {
            href: "https://wiki.stardewvalley.net/Trees",
            label: "Stardew Valley Wiki: Trees",
          },
          {
            href: "https://wiki.stardewvalley.net/Acorn",
            label: "Stardew Valley Wiki: Acorn",
          },
          {
            href: "https://wiki.stardewvalley.net/Oak_Resin",
            label: "Stardew Valley Wiki: Oak Resin",
          },
          {
            href: "https://wiki.stardewvalley.net/Tapper",
            label: "Stardew Valley Wiki: Tapper",
          },
          {
            href: "https://wiki.stardewvalley.net/Heavy_Tapper",
            label: "Stardew Valley Wiki: Heavy Tapper",
          },
          {
            href: "https://wiki.stardewvalley.net/Tree_Fertilizer",
            label: "Stardew Valley Wiki: Tree Fertilizer",
          },
          {
            href: "https://wiki.stardewvalley.net/Fruit_Trees",
            label: "Stardew Valley Wiki: Fruit Trees",
          },
          {
            href: "https://wiki.stardewvalley.net/Keg",
            label: "Stardew Valley Wiki: Keg",
          },
        ]}
      />
    </article>
  );
}
