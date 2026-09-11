import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function MapleTreeStardewEnglishArticle() {
  return (
    <article>
      <p>
        A <a href="https://stardewvalleywiki.com/Maple_Tree">Maple Tree</a> grows from a{" "}
        <a href="https://stardewvalleywiki.com/Maple_Seed">Maple Seed</a> and a{" "}
        <a href="https://stardewvalleywiki.com/Tapper">Tapper</a> yields{" "}
        <a href="https://stardewvalleywiki.com/Maple_Syrup">Maple Syrup</a> every 9 nights.
        Confirm the seed or the tapper product before you spend a season on the wrong
        tree, then either plant on a legal wild-tree tile or hang a tapper on a maple
        that is already mature. Sketch the trunk tiles in the{" "}
        <a className="blog-planner-link" href="/#planner">
          planner
        </a>{" "}
        first: it can mark Maple Tree (Normal) positions, and it does not grow the seed
        or produce syrup.
      </p>
      <p>
        Finish a tapping grove in this order: identify maple by seed and syrup, collect
        Maple Seeds, plant with wild-tree spacing, wait or fertilize until stage 5, then
        tap on a 9-night timer (4 nights with a Heavy Tapper) or chop for wood. If a
        mature maple is already standing where you are allowed to tap, skip the seed wait
        and craft the tapper.
      </p>

      <h2>Identify a maple by seed and syrup, not by leaf adjectives</h2>
      <p>
        Name the object in front of you. Maple, oak, and pine are common wild trees.
        Maple is the one whose seed is a Maple Seed and whose tapper product is Maple
        Syrup. Oak grows from an Acorn and yields Oak Resin. Pine grows from a Pine Cone
        and yields Pine Tar. If the item in your inventory is an Apricot Sapling, a
        Cherry Sapling, or another fruit sapling, you are holding a fruit tree.
      </p>
      <p>
        The wiki pages for maple, oak, and pine show stage 1 through 5 drawings and
        seasonal stumps. They do not describe leaf shape in words. Use those stage
        pictures and the item names on the tooltip. The Maple Seed description is blunt:
        it can be planted to grow a maple tree.
      </p>
      <figure className="blog-article-media">
        <img
          alt="Maple Seed, Acorn, and a fruit sapling in a row so you match the maple by the seed item"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/maple-vs-oak-seeds.webp"
          width="1672"
        />
        <figcaption>Maple Seed, Acorn, and a fruit sapling in a row, so you match the maple by the seed item instead of guessing from a leaf.</figcaption>
      </figure>
      <p>
        A mature maple occupies one tile. If the item is a fruit sapling, stop: fruit
        trees use a different planting rule and will not take a tapper. Plant the Maple
        Seed on one valid untilled tile.
      </p>
      <p>
        Shake a mature maple after Foraging level 1 and you are looking for Maple Seeds
        on most days. During Fall 14 through 28, including Fall 14, a shake drops a
        Hazelnut instead of a Maple Seed. That two-week swap is a maple behavior, not an
        oak or pine behavior. If a tapper is already on the trunk, you cannot shake until
        you remove it.
      </p>
      <p>
        Version 1.6 adds a seasonal look-alike. Maple trees that are not in Pelican Town
        and not in the Greenhouse may turn into Green Rain Trees Type 2 in Fall, look as
        if they dropped every leaf, and stay that way until Spring. Oak can make the same
        kind of change as Type 1. The Pine Tree page does not record that Fall
        transformation. The official{" "}
        <a href="https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/">
          1.6 changelog
        </a>{" "}
        says some trees have a chance to lose their leaves in the Fall; the Type 2
        mapping for maple comes from the{" "}
        <a href="https://stardewvalleywiki.com/Green_Rain_Trees">Green Rain Trees</a>{" "}
        page.
      </p>
      <p>
        A regular Tapper on the maple stops that Fall change, according to the maple and
        Green Rain Trees pages. A Heavy Tapper does not reliably stop it. The{" "}
        <a href="https://stardewvalleywiki.com/Heavy_Tapper">Heavy Tapper</a> page records
        a bug: oak and maple tapped with a Heavy Tapper instead of a regular Tapper can
        still turn into Green Rain Trees in Fall, even though that change should only
        have a chance on trees with no tapper. Treat that as a wiki-recorded bug, not as
        a designed rule and not as an official patch note. Green Rain Tree Types 1 and 2
        cannot take a tapper. Type 3 can, and it produces Fiddlehead Fern, which is not
        Maple Syrup.
      </p>
      <p>
        Green Rain weather is a second event. On that day, about 75% of trees may turn
        into some Green Rain Tree and revert the next day. Fall leaf-shed that lasts
        until Spring is not the same timer.
      </p>

      <h2>Collect Maple Seeds</h2>
      <p>
        You need Maple Seeds in hand before you plant. Pierre&apos;s General Store does not
        sell them. JojaMart does not sell them. The Traveling Cart can, at 100g to
        1,000g. Treat that cart roll as a backup, not as the first source.
      </p>
      <p>
        The ordinary sources are already-grown maples. Shake a mature maple, or chop it,
        once Foraging is at least level 1. Chopping also requires that you have slept
        through the level-up screen before chopped trees drop seeds. Shaking becomes
        available as soon as you level up. Each day, a mature tree has a 5% chance to
        generate a loose seed; shaking is how that seed actually falls. Chopping a mature
        maple can drop 0 to 2 Maple Seeds on top of wood and sap, still only if Foraging
        is at least 1. The Fall 14–28 hazelnut swap applies to shaking.
      </p>
      <p>
        On the farm, a fully grown maple can also drop a seed onto the ground. Dig that
        seed up with an Axe or a Pickaxe. Garbage Cans can produce Maple Seeds. A
        Woodskip Fish Pond can produce 1 to 5 Maple Seeds when the population reaches 9.
        Pond seeds help once the pond is already built. They are not a reason to ignore
        the mature maple you can already shake.
      </p>
      <p>
        Count seeds against the grove you actually want. Four tapping maples need four
        seeds that reach stage 5. If you only need one Maple Syrup for the Chef&apos;s
        Bundle, shake a mature maple and hang one tapper.
      </p>
      <p>
        Outside the farm, you can plant a Maple Seed in tillable ground if that ground is
        un-tilled. Version 1.4 stopped requiring a hoe off the farm, and it also blocked
        planting into a tile you already tilled. Hoeing first is a failed plant, not a
        required preparation. You also cannot plant into the untilled-looking holes left
        by winter artifact spots off the farm. On the farm, plant the seed where the
        trunk should stand. You do not water it.
      </p>

      <h2>Plant with wild-tree spacing</h2>
      <p>
        Fruit-tree spacing is a 3-by-3 keep-out zone around every sapling until that tree
        is mature. Wild maple spacing is smaller, and it is easy to copy the orchard hole
        onto a maple by mistake. A Maple Seed does not need the eight surrounding tiles
        to be empty in order to grow. Paths, floors, and nearby objects can stay. The
        growth blocker is a neighboring mature tree, not a neighboring path.
      </p>
      <p>
        A planted Maple Seed grows through four stages before maturity. Stage 4 takes
        twice as long as the earlier stages. The seedling never grows past stage 4 if a
        mature tree occupies any of its eight adjacent tiles. Two mature wild trees
        therefore cannot stand side by side. Diagonal neighbors count. If you plant a
        second Maple Seed against an already mature maple, oak, or pine, that second tree
        can stall as a stage 4 bush until you chop the neighbor or accept that it will
        not finish.
      </p>
      <p>
        For a tapping grove, leave at least one empty tile between trunks in every
        direction, including diagonals. Trunks with a one-tile gap can all reach stage 5.
        Trunks on a packed adjacent grid cannot. Fruit-tree orchard math (two tiles
        between trunks, 3-by-3 clear) is stricter than this and burns extra farm space if
        you apply it to maples. Use the orchard hole only for fruit saplings.{" "}
        <a className="blog-planner-link" href="/oak-tree-stardew">
          Oak
        </a>{" "}
        and other{" "}
        <a className="blog-planner-link" href="/stardew-valley-trees">
          common trees
        </a>{" "}
        use the same stage 4 neighbor stop.
      </p>
      <figure className="blog-article-media">
        <img
          alt="Spaced maple trunks with a walking lane and wooden tappers on the trunks so the grove is a visit route"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/maple-tapper-grove.webp"
          width="1672"
        />
        <figcaption>Spaced maple trunks with a walking lane and wooden tappers on the trunks, so the grove is a visit route rather than a 3-by-3 fruit hole.</figcaption>
      </figure>
      <p>
        A compact six-tree example, written as an example rather than a measured farm:
      </p>
      <ul>
        <li>Row of three trunks with one empty tile between each pair.</li>
        <li>One walking row in front of those trunks.</li>
        <li>
          A second row of three trunks on the far side of the walking row, again with one
          empty tile between each pair.
        </li>
      </ul>
      <p>
        That layout keeps mature trunks out of each other&apos;s eight adjacent tiles and
        leaves a tile you can stand on when the 9-night bottle is ready. A packed 2-by-2
        of seeds on touching tiles is the failure case: the first tree that reaches stage
        5 blocks the others at stage 4.
      </p>
      <p>
        On the farm, mature maples also try to plant themselves. Each night, a mature
        farm tree (not a stump) has a 15% chance to attempt one new seed within three
        tiles. The chosen tile must already be empty and valid. Trees will not destroy
        paths or crops to do this. If you want a controlled tapping block, occupy or pave
        the tiles you refuse to give to volunteer seedlings. If you want a spreading wood
        lot, leave empty valid tiles inside that three-tile radius and remove stumps
        after you chop. Surrounding land can be fully paved; volunteer planting still
        will not overwrite a path. The seed&apos;s own tile still has to be soil you can
        plant into, not a floor tile you are hoping the seed will ignore.
      </p>
      <p>
        Off the farm, trees never spontaneously spread planted seeds. You can still plant
        Maple Seeds yourself on valid un-tilled tillable ground. Pre-existing maples that
        you chop, with the stump removed, have a 20% chance each night to reappear as a
        stage 3 sapling, including in winter. If the stump remains, that tree does not
        return. Use off-farm maples as a seed source or a temporary tap when you do not
        want them on the farm grid.
      </p>
      <p>
        The <a href="https://stardewvalleywiki.com/Maple_Tree">Maple Tree</a> page says
        maples outside the farm, but not in Pelican Town, can be chopped or tapped. The{" "}
        <a href="https://stardewvalleywiki.com/Trees">Trees</a> page says town trees east
        of the river can be chopped, tapped, or shaken, and trees west of the river can
        only be shaken. The official{" "}
        <a href="https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/">
          1.6 changelog
        </a>{" "}
        says many town trees are now actual tree objects, though you cannot cut them
        down. Do not collapse those three sentences into one instruction; trust whether
        that tree accepts the interaction in the game.
      </p>

      <h2>Wait, fertilize, or tap a tree that is already mature</h2>
      <p>
        Unfertilized maples do not grow on a calendar. Each night in Spring, Summer, or
        Fall, a seedling has a 20% chance to advance one stage. Stage 4 spends twice as
        long, so the tree is waiting on five successful advances, not four. In Winter,
        unfertilized trees do not grow at all, except trees in the Desert and on Ginger
        Island. There is no watering step. Standing next to a dry Maple Seed does not
        help.
      </p>
      <p>
        Wiki pages disagree on the typical wait, and those two figures should stay
        separate. The Maple Tree page and the Trees page both give a median of about 24
        days to maturity, with individual trees varying a lot. The Trees page also says
        90% of non-Mahogany seeds should mature in 38 days excluding winter, and 99% in
        55 days. The Maple Seed page gives a shorter median of about 18 days. Do not plan
        with 18, and do not average 18 and 24 into a fake middle. Use the 24-day median
        from the tree pages, keep the 38-day and 55-day marks from Trees, and treat 18 as
        a seed-page figure this grove should not adopt.
      </p>
      <p>
        If a mature maple already stands on the farm, or off the farm in a place that
        accepts a tapper, hanging a tapper today beats planting a seed and waiting for a
        24-day median. Planting is the move when you need several trunks on tiles you
        control, or when the only maples you can reach refuse a tapper.
      </p>
      <div
        aria-label="Maple growth options"
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
              <th scope="col">Time to a mature maple</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No fertilizer</td>
              <td>20% chance to advance; stage 4 takes twice as long</td>
              <td>No growth, except Desert and Ginger Island</td>
              <td>Median about 24 days on the Maple Tree and Trees pages; 90% in 38 growing days, 99% in 55</td>
            </tr>
            <tr>
              <td>Tree Fertilizer</td>
              <td>One stage per night; stage 4 still takes two nights</td>
              <td>Grows in winter</td>
              <td>About five days</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <a href="https://stardewvalleywiki.com/Tree_Fertilizer">Tree Fertilizer</a> is
        the winter and speed option. Craft it at Foraging level 7 from 5 Fiber and 5
        Stone, or produce it in a Bone Mill. It sells for 10g. Sprinkle it on a Maple
        Seed or sapling that is already planted. It does not work on an empty tile, and
        it does not work on fruit trees or tea bushes. Fertilized maple seedlings take on
        a red hue until they are fully grown. For maple, that schedule is five days
        including winter: stages 1 to 3 advance overnight, stage 4 takes two nights, then
        the tree is mature. That five-day finish is not a claim about every wild tree;
        fertilized mahogany and mystic trees use slower nightly chances.
      </p>
      <p>
        Plant date changes the wait. Plant on Spring 1 without fertilizer and the median
        24 growing days can finish inside Spring, while the Trees page&apos;s 38-day 90%
        mark can spill into Summer. Plant on Fall 1 without fertilizer and a median tree
        can still finish inside Fall&apos;s 28 days, but a tree on the 38-day tail hits
        Winter and stops until Spring. Plant on Fall 20 without fertilizer and you have
        only a handful of growing nights before the freeze; Tree Fertilizer is the tool
        that still finishes that seedling in five days, including Winter. Tapping a tree
        that is already stage 5 ignores this calendar.
      </p>

      <h2>Tap for Maple Syrup or chop for wood</h2>
      <p>
        Decide the job before the tree is mature. A tapping maple is a machine tile you
        visit on a timer. A chopping maple is a wood source you replace. You can convert
        one into the other, but not while the tapper is attached. A tree with a tapper
        cannot be chopped or shaken until you remove the tapper with one axe or pickaxe
        hit.
      </p>
      <p>
        The Tapper recipe unlocks at Foraging level 4 and costs 40 Wood and 2 Copper
        Bars. It cannot be sold. Version 1.6 moved that recipe from Foraging level 3 to
        level 4; the official changelog and the Tapper history both record the change.
        Place the tapper on a mature maple. Maple Syrup takes 9 nights with a regular
        Tapper — the wiki table writes 9 Nights, and the maple page also writes 9 days. A
        Heavy Tapper takes 4 nights / 4 days. Do not turn the Heavy Tapper tooltip
        &quot;twice as fast&quot; into 4.5 days; the product table is 4. Tapping continues
        through winter on maple, oak, pine, mahogany, and mystic trees. Mushroom Trees
        and Green Rain Trees Type 3 turn to stumps in Winter, and tappers on those stumps
        produce nothing. The Tapper cannot be placed on fruit trees.
      </p>
      <p>
        Heavy Tapper is a later upgrade. Buy the recipe in Qi&apos;s Secret Walnut Room for
        20 Qi Gems, then craft it from 30 Hardwood and 1 Radioactive Bar. It cannot be
        sold. It runs at twice the regular tapper rate on maple. It does not speed a
        mushroom tree. If you want the ordinary maple sprite through Fall, use a regular
        tapper. Treat the Heavy Tapper Fall change as a wiki bug, not a patch note.
      </p>
      <div
        aria-label="Maple tap and chop products"
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
              <td>Maple Syrup every 9 nights</td>
              <td>Foraging 4; 40 Wood and 2 Copper Bars; mature maple</td>
            </tr>
            <tr>
              <td>Heavy Tapper</td>
              <td>Maple Syrup every 4 nights</td>
              <td>Qi&apos;s Secret Walnut Room recipe; 30 Hardwood and 1 Radioactive Bar</td>
            </tr>
            <tr>
              <td>Chop mature maple</td>
              <td>12 to 16 Wood, 5 Sap, 0 to 2 Maple Seeds</td>
              <td>Seeds need Foraging 1; Forester can raise wood to 15 to 20</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>A worked tap-versus-chop fork:</p>
      <ul>
        <li>
          You need one Maple Syrup this month for the Chef&apos;s Bundle, and a mature maple
          already stands on a legal tile. Craft the Foraging 4 tapper, hang it, wait 9
          nights, take the bottle.
        </li>
        <li>
          You need several Bee Houses before next season and you have Maple Seeds plus
          Tree Fertilizer. Plant with one-tile gaps, fertilize, wait five days, then tap.
          One maple produces one bottle per 9 nights (4 with Heavy Tapper). Six Bee
          Houses need six bottles, which is six cycles on one tree or one cycle on six
          trees.
        </li>
        <li>
          You want wood for a chest wall and you do not need syrup. Any mature common
          tree chops the same way. Plant maple when the product you want is Maple Syrup.
        </li>
      </ul>
      <p>
        Oak Resin and kegs are the{" "}
        <a className="blog-planner-link" href="/oak-tree-stardew">
          oak
        </a>{" "}
        product line. Maple is the Bee House and Maple Syrup line.
      </p>

      <h2>Spend the syrup</h2>
      <p>
        Maple Syrup is why the grove is maple. The item description calls it a sweet
        syrup with a unique flavor. It restores 50 energy and 22 health if you drink it,
        which is rarely the reason you waited 9 nights.
      </p>
      <p>
        The farm craft that spends the bottle is the Bee House: 1 Maple Syrup, 40 Wood, 8
        Coal, and 1 Iron Bar, unlocked at Farming level 3. Count bottles against houses.
        Eight Bee Houses are eight syrups.
      </p>
      <p>
        Maple Syrup is required for the Bulletin Board Chef&apos;s Bundle. It is one option
        in the Crafts Room Exotic Foraging Bundle, not the only material that slot will
        accept. If the bundle is the only job, one legal mature maple plus one tapper
        finishes it. Extra trunks do not shorten the 9-night wait on the bottle you
        already need.
      </p>
      <p>
        A <a href="https://stardewvalleywiki.com/Maple_Bar">Maple Bar</a> costs 1 Maple
        Syrup, 1 Sugar, and 1 Wheat Flour. The recipe airs on the Queen of Sauce in Year
        2, Summer 14.
      </p>
      <p>
        Maple Syrup&apos;s base sell price is 200g. The game labels it an artisan good, but
        the Artisan profession does not apply. The Foraging Tapper profession raises the
        sell price by 25%, which the wiki lists as 250g. The Trees page calls Maple Syrup
        the most profitable of the three common tree syrups. That ranking is a 200g
        comparison, not a promise that tapping beats every other money machine on the
        farm.
      </p>
      <p>
        Maru dislikes Maple Syrup. Secret Note #23 starts the Strange Note quest: enter
        the Secret Woods between 6:00 and 19:00 with Maple Syrup in inventory for
        Bear&apos;s Knowledge.
      </p>

      <h2>Sketch Maple Tree (Normal) in the planner</h2>
      <p>
        Placement is the step the wiki cannot finish for you. Open the{" "}
        <a className="blog-planner-link" href="/?farmType=standard">Standard Farm map</a>, switch to Placeables, and search maple. The catalog item you want for a wild
        grove is Maple Tree (Normal), a 1-by-1 placeable. Green Rain Tree (Maple) is
        listed separately; do not use it as a substitute ordinary maple. Tapper and Heavy
        Tapper are also separate 1-by-1 placeables. In the planner they mark a visit
        point. They do not simulate attaching a tapper, advancing nights, or producing
        syrup. Put the tapper icon on the trunk tile you intend to visit, then look at
        the walking lane, not only the canopy.
      </p>
      <p>
        The planner is a placement sketch. It can show Maple Tree (Normal) on official
        farm maps. It does not plant a Maple Seed, does not roll the 20% growth chance,
        does not apply Tree Fertilizer, does not produce Maple Syrup, and does not
        simulate winter stall. A season button changes wild-tree textures. It does not
        advance days. Projects stay in this browser. There is no account and no cloud
        sync. The tool is fan-made and is not affiliated with or endorsed by ConcernedApe
        or Stardew Valley.
      </p>
      <p>
        Use the map to answer geometry questions the game will not preview: whether a
        tapping block leaves a path from the farmhouse, whether a wood lot sits on a
        future barn pad, and whether two trunks share an adjacent tile including the
        diagonal. If the grove shares an edge with crops, keep the maple trunks on tiles
        you are willing to lose as crop space.
      </p>
      <ol>
        <li>Choose the farm type you actually play, starting from Standard if you have not switched.</li>
        <li>Search Placeables for maple and select Maple Tree (Normal), not Green Rain Tree (Maple).</li>
        <li>Place trunks with at least one tile between mature neighbors, including diagonals.</li>
        <li>Place Tapper or Heavy Tapper sprites on trunks you will visit, as 1-by-1 visit markers.</li>
        <li>Keep a walking tile to each tapped trunk and to any chopping pile.</li>
        <li>Export or screenshot the sketch, then plant Maple Seeds in the game on those tiles.</li>
      </ol>
      <p>
        Free Placement can show a tree where the game later rejects it. Some layouts may
        not be achievable in-game. Treat a Free Placement maple as a drawing, then
        confirm the tile in the save. The Blocked (Trees) view option marks tiles that
        are not tree-plantable in the map data. Confirm the planted seed in the game; a
        planner sprite is not proof that the save accepted it.
      </p>
      <p>
        Match the sketch to the job. A syrup grove wants mature trunks you can reach
        every 9 or 4 nights without walking through crops. A wood lot wants space for the
        tree to fall and for you to clear the stump. Recheck after you add a building, a
        path, or a fruit-tree orchard, because those objects change the walking lane even
        when they do not use the wild-tree adjacency rule.
      </p>

      <h2>Check before you wait a season</h2>
      <p>
        The expensive mistake is waiting. Unfertilized median waits are measured in
        weeks, and winter adds a full-season pause. Run this check on the night you
        plant, not on the day you notice the tree is still a bush.
      </p>
      <ul>
        <li>Seed check: the item in the ground is a Maple Seed, not a fruit sapling and not an Acorn.</li>
        <li>Tile check: the tile was valid and un-tilled at plant time, especially off the farm.</li>
        <li>Neighbor check: no mature tree sits in the eight adjacent tiles of any unfinished maple.</li>
        <li>Winter check: unfertilized maples will not grow; Tree Fertilizer is the winter growth path.</li>
        <li>Job check: tapping trees have a visit route; chopping trees have fall space and stump access.</li>
        <li>Tapper check: recipe is Foraging 4, 40 Wood, 2 Copper Bars; 9 nights syrup, 4 with Heavy Tapper.</li>
        <li>Fall check: a regular tapper can hold the ordinary maple through the 1.6 leaf-shed; Heavy Tapper may not, per the wiki bug.</li>
        <li>Planner check: the sketch uses Maple Tree (Normal), not Green Rain Tree (Maple), and the seeds go into the save after the sketch.</li>
      </ul>
      <p>
        After maturity, watch the product, not the sprite. A tapping maple is finished
        when Maple Syrup appears on the 9-night or 4-night timer and you can reach the
        tree. A chopping maple is finished when the wood, sap, and possible seeds are on
        the ground and the stump is cleared or deliberately kept. A spreading wood lot is
        finished when empty valid tiles exist inside three tiles of a mature farm maple
        and you are willing to let the 15% nightly plant attempt use them.
      </p>
      <p>
        Recheck when the farm changes. Pavement around a maple does not stop wild-tree
        growth, but a new path can still block your syrup route. A new barn can occupy a
        fall direction. A new fruit sapling can steal the 3-by-3 hole next to a maple
        without breaking the maple&apos;s own growth. The maple rule and the fruit rule stay
        separate after construction day.
      </p>
      <p>
        The grove is ready when every trunk you care about is a stage 5 maple, every
        unfinished seedling has a legal neighbor set, and every tapping or chopping visit
        has a tile you can walk.
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "How long does a maple tree take to grow in Stardew Valley?",
            answer: (
              <p>
                Unfertilized maples have a 20% chance to grow each night except in winter, with stage 4 taking twice as long. Plan with the Maple Tree and Trees median of about 24 days, not the Maple Seed page&apos;s 18. Tree Fertilizer finishes a maple in about 5 days, including winter.
              </p>
            ),
          },
          {
            question: "How do I get Maple Seeds?",
            answer: (
              <p>
                Shake or chop a mature maple after Foraging level 1, dig up seeds that drop on the farm with an Axe or Pickaxe, check Garbage Cans, or raise a Woodskip pond to population 9 for 1 to 5 seeds. Pierre and Joja do not sell Maple Seeds. The Traveling Cart can, at 100g to 1,000g. During Fall 14–28, shaking a maple drops a Hazelnut instead of a Maple Seed.
              </p>
            ),
          },
          {
            question: "Can I plant maple trees next to each other?",
            answer: (
              <p>
                You can plant the seeds on adjacent tiles, but a seedling will not grow past stage 4 if a mature tree occupies any of its eight adjacent tiles. Leave at least one tile between trunks, including diagonals, if you want every maple to mature.
              </p>
            ),
          },
          {
            question: "How often does a maple tapper produce Maple Syrup?",
            answer: (
              <p>
                A regular Tapper produces Maple Syrup every 9 nights (the wiki also writes 9 days). A Heavy Tapper produces it every 4 nights. Craft the regular tapper at Foraging level 4 from 40 Wood and 2 Copper Bars. Version 1.6 moved that recipe from Foraging 3 to 4. Tapping continues in winter on maple.
              </p>
            ),
          },
          {
            question: "Do maple trees grow in winter?",
            answer: (
              <p>
                Unfertilized maples do not grow in winter, except in the Desert and on Ginger Island. Tree Fertilizer makes wild maples grow in winter and reaches maturity in about 5 days. Tapping still produces Maple Syrup in winter.
              </p>
            ),
          },
          {
            question: "Why did my maple turn leafless in Fall?",
            answer: (
              <p>
                In 1.6, maples that are not in Pelican Town or the Greenhouse may become Green Rain Tree Type 2 in Fall and look leafless until Spring. A regular Tapper prevents that change on the maple and Green Rain Trees pages. The Heavy Tapper wiki Bugs section says a Heavy Tapper may not.
              </p>
            ),
          },
          {
            question: "Does the planner grow maple trees or make syrup?",
            answer: (
              <p>
                No. It is a placement sketch. Use the planner section for catalog names and visit markers. The sketch does not grow seeds, skip nights, or yield Maple Syrup.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-11 against Stardew Valley 1.6 wiki pages and the official 1.6 changelog. Median 24-day growth is taken from the Maple Tree and Trees pages; the Maple Seed page's 18-day median is recorded as a conflict and is not adopted. Heavy Tapper Fall Green Rain transformation is cited as a wiki Bugs note. The planner is a placement sketch, not a growth or tapping simulation."
        items={[
          {
            href: "https://stardewvalleywiki.com/Maple_Tree",
            label: "Stardew Valley Wiki: Maple Tree",
          },
          {
            href: "https://stardewvalleywiki.com/Maple_Seed",
            label: "Stardew Valley Wiki: Maple Seed",
          },
          {
            href: "https://stardewvalleywiki.com/Maple_Syrup",
            label: "Stardew Valley Wiki: Maple Syrup",
          },
          {
            href: "https://stardewvalleywiki.com/Tapper",
            label: "Stardew Valley Wiki: Tapper",
          },
          {
            href: "https://stardewvalleywiki.com/Heavy_Tapper",
            label: "Stardew Valley Wiki: Heavy Tapper",
          },
          {
            href: "https://stardewvalleywiki.com/Trees",
            label: "Stardew Valley Wiki: Trees",
          },
          {
            href: "https://stardewvalleywiki.com/Tree_Fertilizer",
            label: "Stardew Valley Wiki: Tree Fertilizer",
          },
          {
            href: "https://stardewvalleywiki.com/Green_Rain_Trees",
            label: "Stardew Valley Wiki: Green Rain Trees",
          },
          {
            href: "https://stardewvalleywiki.com/Maple_Bar",
            label: "Stardew Valley Wiki: Maple Bar",
          },
          {
            href: "https://stardewvalleywiki.com/Fruit_Trees",
            label: "Stardew Valley Wiki: Fruit Trees",
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
