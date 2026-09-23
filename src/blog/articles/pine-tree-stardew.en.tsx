import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function PineTreeStardewEnglishArticle() {
  return (
    <article>
      <p>
        The Stardew Valley chain is <strong>Pine Cone → Pine Tree → Pine Tar</strong>:
        plant a Pine Cone, let it become a mature common tree, then place a Tapper on
        it. Use valid, untilled ground that the game accepts, and do not water the
        seedling. If growth stops at stage 4, check all eight adjacent tiles for a
        mature tree; once the Pine is mature, a normal Tapper takes five nights and a
        Heavy Tapper takes two days, and Pine Tapper production continues through
        Winter. (<a href="https://wiki.stardewvalley.net/Pine_Tree">Pine Tree</a>,{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Cone">Pine Cone</a>,{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees</a>, and{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper</a>)
      </p>

      <h2>Identify the Pine Cone, Pine Tree, and Pine Tar chain</h2>

      <h3>A Pine Cone grows a common Pine Tree</h3>
      <p>
        A Pine Cone is the item you plant when you want a Pine Tree. This is a
        common-tree path, not a fruit-tree sapling path: the surrounding rules are
        different, the seedling does not need crop-style watering, and a mature-tree
        neighbor can block late growth. Start by matching the item in your inventory
        to the tree you want. A Maple Seed grows a Maple Tree and an Acorn grows an
        Oak Tree; neither is a substitute for a Pine Cone when the desired Tapper
        output is Pine Tar. The <a href="https://wiki.stardewvalley.net/Pine_Cone">Pine
        Cone reference</a> and <a href="https://wiki.stardewvalley.net/Pine_Tree">Pine
        Tree reference</a> keep that input-to-tree relationship explicit.
      </p>

      <h3>A mature Pine gives Pine Tar through a Tapper</h3>
      <p>
        Pine Tar is the normal Tapper output for a mature Pine. The Tapper step comes
        after tree growth, so do not use the production interval as a promise about how
        fast the seedling will mature. First solve the planting and growth conditions;
        then attach the Tapper when the tree is fully grown. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar reference</a> and{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper reference</a> support
        the output and timing below.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Explanatory illustration showing a Pine Cone, planted common-tree stages, a mature Pine with a Tapper, and Pine Tar; not a gameplay screenshot."
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/pine-tree-seed-to-tar.webp"
          width={1672}
        />
        <figcaption>
          Pine Cone leads to a Pine Tree, and only a mature Pine enters the
          Tapper-to-Pine-Tar step. This is an explanatory illustration, not a gameplay
          screenshot; it does not show a fixed growth countdown.
        </figcaption>
      </figure>

      <p>
        The figure is useful as an object check: if the item you have is not a Pine
        Cone, or if the tree is not mature, you are not yet at the Pine Tar step. A
        layout tool can help you reserve space for the tree and Tapper, but the game
        rules still decide whether the seed grows and when the Tapper produces.
      </p>

      <h2>Get a Pine Cone and plant it under the valid map rules</h2>

      <h3>Verified ways to obtain a Pine Cone</h3>
      <p>
        The most direct sources are existing Pine Trees and normal game-world
        collection. The <a href="https://wiki.stardewvalley.net/Pine_Cone">Pine Cone
        page</a> lists these routes:
      </p>
      <ul>
        <li>Shake or chop a Pine Tree after reaching Foraging level 1.</li>
        <li>Dig a Pine Cone from a fully grown farm Pine Tree with an Axe or Pickaxe.</li>
        <li>Check Garbage Cans.</li>
        <li>Use a Woodskip Fish Pond at population 9, which can produce 1–5 Pine Cones.</li>
        <li>
          Buy one from the Traveling Cart when it appears; the listed price range is
          100g–1,000g, so this is a conditional source rather than a dependable
          planting schedule.
        </li>
      </ul>

      <p>
        There is a small timing detail for the Foraging-level route. The{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees page</a> distinguishes
        seeds obtained by shaking from seeds obtained by chopping: after reaching
        Foraging level 1, the chopped-tree seed drop requires sleeping through the
        level-up screen, while shaking can provide seeds as soon as the level-up occurs.
        If you are trying to start a Pine row immediately, use the source that is
        actually available on your save instead of treating every route as unlocked at
        the same moment.
      </p>

      <p>
        The relevant decision is simple: obtain a Pine Cone, choose a valid tile, and
        keep the seedling’s eight neighboring tiles in mind while it grows.
      </p>

      <h3>Plant on valid, untilled ground and do not water it</h3>
      <p>
        Plant a Pine Cone on valid ground that the game accepts and that has not been
        tilled. Use an accepted bare tile, not crop soil prepared for planting, and
        keep the map limits below in mind. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Cone">Pine Cone page</a> supports
        the planting condition.
      </p>

      <p>
        Pine is a common tree, so its seedling does not need daily watering. The{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees page</a> also states that
        the surrounding land does not have to be completely empty before you plant.
        That does <strong>not</strong> mean every occupied neighbor is harmless: a
        mature tree in the eight adjacent tiles can still stop the seedling at stage 4,
        which is why planting space and growth diagnosis belong together.
      </p>

      <p>Do not import crop habits into this step:</p>
      <ol>
        <li>Do not water the Pine Cone as if it were a crop.</li>
        <li>
          Do not put it on tilled crop soil and assume the seed will behave like a
          seasonal crop.
        </li>
        <li>
          Do not clear every nearby tile just because a common tree is not a fruit tree.
        </li>
        <li>
          Do inspect nearby mature trees before concluding that fertilizer or Winter
          caused the stall.
        </li>
      </ol>

      <p>
        The 1.6 changelog adds map limits that matter when choosing a tile. The{" "}
        <a href="https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/">
          official Stardew Valley 1.6 changelog
        </a>{" "}
        says trees can no longer be planted in town or in the Beach Farm tunnel.
        General tree guidance is therefore not permission to plant on any visually open
        square; the map and tile must accept the action.
      </p>

      <h3>Farm trees and natural trees are not the same placement decision</h3>
      <p>
        You can also encounter Pine Trees growing naturally outside the farm. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tree">Pine Tree reference</a>{" "}
        supports the general outside-farm interaction, while the{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar reference</a> gives
        examples such as Cindersap Forest, the Railroad, and around the Carpenter’s
        Shop. The broader <a href="https://wiki.stardewvalley.net/Trees">Trees
        reference</a> lists additional common-tree locations, but it also records
        interaction limits: some town trees are scenery, and trees west of the river
        cannot be chopped or tapped even though they can be shaken.
      </p>

      <p>
        Use the action you actually need as the test. A natural tree that can be shaken
        is not automatically a tree that can be chopped or tapped. A place that looks
        empty is not automatically valid for planting. For a wider mixed-tree layout,
        the site’s{" "}
        <a className="blog-planner-link" href="/stardew-valley-trees">
          general Stardew Valley tree layout guide
        </a>{" "}
        covers the common-tree and fruit-tree planning distinction; the Pine-specific
        checks on this page determine whether this particular seedling can progress and
        produce Pine Tar.
      </p>

      <h2>Fix a Pine seedling that stops at stage 4</h2>

      <h3>Check all eight adjacent tiles</h3>
      <p>
        A common-tree seedling can stop at stage 4 when a mature tree occupies any of
        the eight tiles around it. Check the four cardinal neighbors and the four
        diagonal neighbors. The <a href="https://wiki.stardewvalley.net/Trees">Trees
        page</a> describes the rule precisely: a mature tree in that eight-tile ring
        blocks the seedling from passing stage 4.
      </p>

      <p>
        This is a symptom-based check, not a guess about the seed, fertilizer, or
        visual size of the tree. Start at the seedling and inspect the full 3-by-3 area
        around it, excluding the center tile. If you only check north, south, east, and
        west, you can miss the diagonal tree that is actually blocking the transition.
      </p>

      <p>
        The practical fix is to remove or avoid the mature neighbor. If the neighbor
        must remain, replant the Pine Cone in a position with a clear eight-neighbor
        ring. Leaving one empty tile between a seedling and a mature tree is an easy
        layout habit because it avoids the adjacent ring without requiring a tile-by-tile diagnosis every morning. That one-tile gap is <strong>layout advice</strong>,
        not a Pine physical-footprint rule and not the fruit-tree 3-by-3 orchard rule.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Explanatory grid showing a Pine seedling at center, eight adjacent tiles, a mature neighboring tree blocking stage 4, and a corrected one-tile gap; not a gameplay screenshot."
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/pine-tree-stage-four-neighbor.webp"
          width={1672}
        />
        <figcaption>
          The center Pine seedling is checked against all eight adjacent tiles. A mature
          neighboring tree blocks progress beyond stage 4; the separated example shows
          a practical gap, not a fruit-tree 3-by-3 clearance requirement.
        </figcaption>
      </figure>

      <h3>Use the visual check before changing the growth method</h3>
      <p>Fertilizer is not the first diagnostic step for a stage-4 stall. First answer these questions:</p>
      <ul>
        <li>Is there a mature tree in any of the eight adjacent tiles, including a diagonal?</li>
        <li>Is the seedling planted on a valid, un-tilled tile?</li>
        <li>Is the current season one in which ordinary unfertilized trees can grow?</li>
        <li>Is the tree on a map with a documented exception?</li>
      </ul>

      <p>
        If the eight-neighbor ring is clear, move to the seasonal growth rules. If the
        ring is blocked, changing fertilizer or waiting for a particular day does not
        address the visible cause. Use the{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees page</a> as the rule source
        for this diagnosis.
      </p>

      <h2>Choose normal growth or Tree Fertilizer without inventing a timer</h2>

      <h3>Unfertilized growth has seasonal and map conditions</h3>
      <p>
        For ordinary common-tree growth, the{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees reference</a> describes a
        20% chance of advancing each night in Spring, Summer, or Fall. Stage 4 takes
        twice as long as the earlier stages. Ordinary trees do not grow in Winter under
        the normal rule, so an unfertilized Pine seedling that reaches the end of Fall
        without maturing should not be treated like a Winter crop that will keep
        advancing.
      </p>

      <p>
        The same rule should not be stretched across every map. The{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees page</a> records map-level
        exceptions involving the Desert and Ginger Island. If the Pine is outside the
        ordinary farm/natural-tree context, check the map condition before applying the
        normal Winter statement. A map exception changes the decision; it is not a
        reason to promise a universal calendar.
      </p>

      <p>
        A seedling also remains subject to the stage-4 neighbor rule. Seasonal odds do
        not make a mature adjacent tree disappear, and a valid season does not turn a
        blocked eight-neighbor ring into a clear one.
      </p>

      <h3>Tree Fertilizer starts after planting</h3>
      <p>
        Tree Fertilizer is for an already planted wild-tree seed or sapling. Apply it to
        the planted Pine; do not treat it as a pre-plant seed coating, and do not use it
        as a fruit-tree growth rule. The{" "}
        <a href="https://wiki.stardewvalley.net/Tree_Fertilizer">Tree Fertilizer
        reference</a> says it advances most wild trees one stage each night, with the
        final stage taking two nights. Under that documented behavior, the{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tree">Pine Tree reference</a> says
        a normal Pine can mature in five days, even in Winter.
      </p>

      <p>
        That five-day result is a <strong>fertilized growth path</strong>, not an
        unfertilized Pine countdown. It also does not replace the adjacency check. If a
        mature neighbor is blocking stage 4, clear or avoid the blocking arrangement
        before relying on any growth method. If you are choosing between waiting and
        fertilizing, the useful distinction is:
      </p>
      <div
        aria-label="Pine growth paths"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Growth path</th>
              <th scope="col">What you can safely rely on</th>
              <th scope="col">What not to assume</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unfertilized Pine</td>
              <td>
                20% nightly advancement in Spring, Summer, or Fall; stage 4 takes twice
                as long; ordinary Winter behavior has map exceptions
              </td>
              <td>One guaranteed maturity date for every Pine</td>
            </tr>
            <tr>
              <td>Tree Fertilizer</td>
              <td>
                Apply after planting; most stages advance one per night, the final stage
                takes two nights; a normal Pine can mature in five days under this path
              </td>
              <td>
                That fertilizer overrides a mature adjacent tree or turns the Pine into a
                fruit tree
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Why there is no single safe “Pine takes X days” answer</h3>
      <p>
        The current Pine references do not agree on one growth-time summary. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tree">Pine Tree page</a> gives a
        24-day median, the <a href="https://wiki.stardewvalley.net/Pine_Cone">Pine Cone
        page</a> gives a median of about 18 days, and the{" "}
        <a href="https://wiki.stardewvalley.net/Trees">Trees page</a> gives a 24-day
        median with separate 90th- and 99th-percentile figures. Those pages cannot be
        compressed into one guaranteed unfertilized countdown without resolving the
        conflict.
      </p>

      <p>Plan from rules you can observe instead:</p>
      <ol>
        <li>
          For an unfertilized Pine, allow for nightly probability, stage 4 taking
          longer, and ordinary Winter behavior.
        </li>
        <li>
          For a fertilized Pine, apply the item after planting and use the five-day
          documented path as the method-specific expectation, not as a universal Pine
          statistic.
        </li>
        <li>Before attaching a Tapper, inspect the tree itself and confirm that it is mature.</li>
        <li>
          Do not draw a growth calendar using 18, 24, 38, or 55 as if one number were
          settled for every Pine and every map.
        </li>
      </ol>

      <p>
        This is more useful than a false date because the date conflict is exactly where
        a late-season layout or Tapper plan can fail.
      </p>

      <h2>Tap a mature Pine and collect Pine Tar through Winter</h2>

      <h3>Normal Tapper: five nights</h3>
      <p>
        Attach a normal Tapper only after the Pine is mature. The{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper reference</a> lists Pine
        Tar from a Pine on a five-night interval. This is production time after the tree
        has reached maturity; it is not the time required for a Pine Cone to become a
        tree.
      </p>

      <p>
        In the 1.6 rules, the normal Tapper recipe is tied to Foraging level 4. The
        official <a href="https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/">
          1.6 changelog
        </a>{" "}
        records the recipe-level change, while the{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper page</a> gives the current
        item and placement details. A normal Tapper is enough when you only need the
        standard Pine Tar interval; do not attach it to a seedling and expect the timer
        to begin.
      </p>

      <h3>Heavy Tapper: two days</h3>
      <p>
        A Heavy Tapper is a separate item with a two-day Pine Tar interval. Keep that
        number separate from the normal five-night interval: it is not “five nights,
        but sometimes faster,” and it is not a tree-growth modifier. If a layout
        contains both Tapper types, label the trees or rows so you do not read one
        collection date as the other.
      </p>

      <div
        aria-label="Pine Tapper output intervals"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Tapper</th>
              <th scope="col">Mature Pine output interval</th>
              <th scope="col">What the interval means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal Tapper</td>
              <td>5 nights</td>
              <td>Pine Tar production after the Tapper is attached to a mature Pine</td>
            </tr>
            <tr>
              <td>Heavy Tapper</td>
              <td>2 days</td>
              <td>Faster Tapper production; it does not accelerate tree growth</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar reference</a> and{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper reference</a> support
        both intervals. Use the exact five-night and two-day entries rather than an
        approximate interval when you plan collection days.
      </p>

      <h3>Pine Tapper production continues in Winter</h3>
      <p>
        Pine Tapper production continues in Winter. This matters when you decide whether
        to chop a mature Pine at the end of Fall: an unfertilized seedling normally stops
        growing in Winter, but an already mature Pine with a Tapper can continue
        producing Pine Tar. The <a href="https://wiki.stardewvalley.net/Pine_Tree">Pine
        Tree</a>, <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar</a>, and{" "}
        <a href="https://wiki.stardewvalley.net/Tapper">Tapper</a> pages support that
        distinction.
      </p>

      <p>
        Natural-tree interaction still has map limits. A Pine that can be tapped in a
        natural location is a useful standing resource; a decorative town tree that
        cannot be tapped is not. Check the location’s interaction rule instead of
        assuming that every visible Pine accepts a Tapper.
      </p>

      <h2>Use Pine Tar after the Tapper starts</h2>

      <h3>Verified uses that can change the keep-or-chop decision</h3>
      <p>
        Pine Tar is more than an item to sell. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar reference</a> verifies
        several uses:
      </p>
      <ul>
        <li>One Pine Tar is used to craft a Loom.</li>
        <li>One Pine Tar and five Moss are used for Speed-Gro.</li>
        <li>Five Pine Tar are used for a Rain Totem.</li>
        <li>Pine Tar can be an option for the Exotic Foraging Bundle.</li>
        <li>Pine Tar can be used in Floppy Beanie tailoring.</li>
        <li>A Woodskip Fish Pond can request Pine Tar.</li>
      </ul>

      <p>
        You do not need every use to decide whether to keep a Pine. If a Loom, Speed-Gro, Rain Totem, bundle, clothing project, or Woodskip request is on your current
        plan, the Tapper output has a concrete job. If none of those uses matters and you
        only need open space, the layout decision can be different; the page does not
        need to turn that choice into a universal “best tree” ranking.
      </p>

      <h3>Pine Tar value is not a tree-profit ranking</h3>
      <p>
        The listed base sell price for Pine Tar is 100g. The Tapper Profession raises the
        displayed value to 125g, while the Artisan Profession does not add its Artisan
        bonus to Pine Tar. Those are Pine Tar item values, not a comparison of Pine
        against Maple, Oak, or every other tree over a shared time horizon. The{" "}
        <a href="https://wiki.stardewvalley.net/Pine_Tar">Pine Tar page</a> supports the
        item values. A Pine Tar price alone cannot rank trees under a shared time horizon.
      </p>

      <p>
        That boundary matters whenever someone asks for the “most profitable tree.” A
        price for one Tapper product is not enough to rank trees unless the comparison
        also fixes Tapper type, profession, time horizon, availability, and which
        products count. Keep the Pine because its output serves your plan, not because
        one displayed price proves a cross-tree winner.
      </p>

      <p>
        Before you leave a Pine Cone in the ground or walk away from a mature Pine, run
        this short check:
      </p>
      <ol>
        <li>
          <strong>Match the objects:</strong> Pine Cone grows a Pine Tree; mature Pine
          plus Tapper produces Pine Tar.
        </li>
        <li>
          <strong>Check the tile:</strong> use valid, untilled ground, and remember that
          town and Beach Farm tunnel planting restrictions still apply.
        </li>
        <li>
          <strong>Skip watering:</strong> common-tree seedlings do not need crop
          watering.
        </li>
        <li>
          <strong>Inspect stage 4:</strong> check all eight adjacent tiles, including
          diagonals, for a mature tree.
        </li>
        <li>
          <strong>Choose the growth path:</strong> unfertilized growth follows
          seasonal/map rules; Tree Fertilizer starts after planting and has its own
          five-day normal-Pine path.
        </li>
        <li>
          <strong>Avoid a false countdown:</strong> current Pine references disagree on
          the unfertilized median, so do not plan from one guaranteed day.
        </li>
        <li>
          <strong>Wait for maturity:</strong> attach a normal or Heavy Tapper only to a
          mature Pine.
        </li>
        <li>
          <strong>Use the right interval:</strong> five nights for a normal Tapper, two
          days for a Heavy Tapper, with Pine production continuing through Winter.
        </li>
        <li>
          <strong>Name one use:</strong> keep the tree when Pine Tar has a job such as a
          Loom, Speed-Gro, Rain Totem, bundle, tailoring, or Woodskip request.
        </li>
      </ol>

      <BlogSources
        checkedLabel="The following public pages support the specific Pine identity, planting, growth, Tapper, map-limit, and use claims in this draft. The current Pine references disagree on an unfertilized growth median, so this draft preserves that conflict instead of selecting one number."
        heading="Sources"
        items={[
          {
            href: "https://wiki.stardewvalley.net/Pine_Tree",
            label: "Stardew Valley Wiki: Pine Tree",
            note:
              " — Pine identity, Pine Tar output, common-tree behavior, natural Pine interaction, and the Pine-specific growth summary.",
          },
          {
            href: "https://wiki.stardewvalley.net/Pine_Cone",
            label: "Stardew Valley Wiki: Pine Cone",
            note: " — Pine Cone sources, planting conditions, and the conflicting growth summary.",
          },
          {
            href: "https://wiki.stardewvalley.net/Trees",
            label: "Stardew Valley Wiki: Trees",
            note:
              " — common-tree watering, eight-neighbor stage-4 rule, seasonal/map exceptions, and natural-tree limits.",
          },
          {
            href: "https://wiki.stardewvalley.net/Pine_Tar",
            label: "Stardew Valley Wiki: Pine Tar",
            note: " — Tapper output, Pine Tar values, uses, and Winter production context.",
          },
          {
            href: "https://wiki.stardewvalley.net/Tapper",
            label: "Stardew Valley Wiki: Tapper",
            note:
              " — normal and Heavy Tapper intervals, recipe/placement context, and Winter production.",
          },
          {
            href: "https://wiki.stardewvalley.net/Tree_Fertilizer",
            label: "Stardew Valley Wiki: Tree Fertilizer",
            note:
              " — apply-after-planting behavior, five-day fertilized Pine path, and Winter growth.",
          },
          {
            href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
            label: "Stardew Valley 1.6 Update Full Changelog",
            note:
              " — official town/Beach Farm tunnel planting restrictions and Tapper recipe-level context.",
          },
        ]}
      />
    </article>
  );
}
