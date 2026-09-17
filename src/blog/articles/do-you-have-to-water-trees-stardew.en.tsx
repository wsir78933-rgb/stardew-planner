import { PublicPicture } from "../../components/public-picture";
import { BlogSources } from "../../components/blog/blog-sources";

export function DoYouHaveToWaterTreesStardewEnglishArticle() {
  return (
    <article>
      <p>
        Stardew Valley trees do not need watering: common tree seeds and fruit-tree
        saplings use growth conditions instead. If a common sapling is stuck at stage 4,
        inspect its eight adjacent tiles for a mature tree. If a fruit sapling skips a
        night, inspect its 3×3 for a blocker. Water crops separately; a sprinkler will
        not fix either tree.
      </p>

      <h2>Identify the object before you pick up the can</h2>
      <p>
        Start by naming the object. A planted seed or sapling may look like a tiny tree,
        but a crop on tilled soil belongs to a different rule. A sprinkler belongs to
        the crop rule too. The picture in front of you is not enough; use the item name,
        the planting spot, and the visible growth stage.
      </p>
      <p>There are four useful labels for this question:</p>
      <ul>
        <li>
          <strong>Common-tree seed or sapling:</strong> no watering. Its important
          growth check is the eight tiles directly around it when a mature tree is
          nearby.
        </li>
        <li>
          <strong>Fruit-tree sapling:</strong> no watering. During growth, keep its
          eight surrounding cells clear of things that occupy space.
        </li>
        <li>
          <strong>Crop on tilled soil:</strong> use the crop-watering rule. Greenhouse
          crops still need water when it rains.
        </li>
        <li>
          <strong>Sprinkler:</strong> it waters tilled soil inside its range. It does
          not water a common tree or a fruit tree.
        </li>
      </ul>
      <p>
        That list turns a vague morning chore into a small fork. First identify the
        object. Then apply the watering conclusion. Then choose the next check from the
        object’s visible state.
      </p>

      <h3>Common trees: watering is not a growth input</h3>
      <p>
        A common-tree seed does not need a watering can. It also does not require every
        surrounding tile to be empty. That is the part worth holding onto when you see
        a new seed beside a path, a patch of ground, or another feature: the common-tree
        rule is not a fruit-tree orchard ring.
      </p>
      <p>
        There is still a spacing condition, and it only becomes the next check when the
        seedling shows the relevant symptom. A common seedling cannot move beyond stage
        4 if a mature tree occupies any of its eight adjacent tiles. Count the diagonal
        tiles as well as the tiles above, below, left, and right. The mature neighbor is
        the blocker in this rule; the test is not “are all eight tiles empty?”
      </p>
      <p>
        Imagine a common sapling sitting one tile diagonally from a mature tree.
        Watering it changes nothing. If the sapling is visibly at stage 4, inspect that
        diagonal tile first. If the tree beside it is mature, decide which tree you want
        to keep or remove before expecting the sapling to reach the next stage. This
        distinction separates “a common tree has not grown tonight” from “a common tree
        is held at stage 4.”
      </p>
      <p>
        Growth is not a daily promise. Without Tree Fertilizer, a non-Mahogany common
        tree has a 20% chance each night to advance, while Mahogany has a 15% chance.
        One unchanged morning therefore does not tell you that the seed was planted
        incorrectly. Without Tree Fertilizer, common trees do not grow in winter outside
        the desert and Ginger Island. If you apply Tree Fertilizer to a seed or sapling,
        it can still grow in winter. Neither a full watering can nor a sprinkler changes
        that ordinary outdoor rule.
      </p>
      <p>
        For common-tree details, read the site’s{" "}
        <a href="/stardew-valley-trees">Stardew Valley trees guide</a>. If the seed is
        an acorn or maple seed, the <a href="/oak-tree-stardew">oak tree guide</a> and{" "}
        <a href="/maple-tree-stardew">maple tree guide</a> explain those species. First
        use the stage-4 neighbor check to decide what to inspect.
      </p>

      <h3>Fruit trees: no water, but a 3×3 growth check</h3>
      <p>
        A fruit-tree sapling also does not need a watering can. It takes 28 days to
        mature, can grow in any season, and does not die in winter. Those facts answer
        the water question, but they do not make its planting space optional.
      </p>
      <p>
        During growth, place the sapling at the center of a 3×3. The eight surrounding
        cells must be free of blocking objects, flooring or paths, and terrain features
        that occupy space. Grass, seed spots, and artifact spots are not blockers. An
        object, flooring or path, or blocking terrain feature in that ring may stop the
        tree’s growth for that night. Inspect the ring for one of those blockers and
        clear it, not add water.
      </p>
      <p>
        This is a different check from the common-tree stage rule. A common seed does
        not need a fully empty ring. For a fruit sapling, use the clear-space definition
        above and check the eight surrounding cells before the night’s growth check.
        “Clear” does not mean that every mark on the ground must disappear. If you carry
        the fruit-tree ring over to a common grove, you spend space on a condition that
        common trees do not require.
      </p>
      <p>
        After the fruit tree is mature, you can place paths or objects beside it. Keep
        the eight surrounding cells free of blocking things during the 28-day growing
        period, then treat the mature trunk as a different state. The{" "}
        <a href="https://stardewvalleywiki.com/Fruit_Trees">Fruit Trees page</a> is the
        public reference for the no-water rule, the 28-day maturity period, and the 3×3
        condition.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Rule diagram comparing a common tree stage-4 neighbor check, a fruit sapling 3×3 ring, greenhouse crop soil, and sprinkler coverage."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/do-you-have-to-water-trees-stardew-rules-en.webp"
          width="1672"
        />
        <figcaption>Trees use growth checks; crops use water coverage.</figcaption>
      </figure>

      <p>Here is the short decision table to keep beside the farm map:</p>
      <div
        aria-label="Tree watering decision table"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Object in front of you</th>
              <th scope="col">Water conclusion</th>
              <th scope="col">Next check</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Common-tree seed or sapling</td>
              <td>Do not water it. A completely clear ring is not required.</td>
              <td>
                If it is stuck at stage 4, inspect the eight adjacent tiles for a mature
                tree. If none is there, allow for the longer stage-4 period and check the
                season and Tree Fertilizer; growth the following night is not guaranteed.
                Otherwise account for the no-fertilizer chance: 20% for a non-Mahogany
                common tree or 15% for Mahogany, plus the season.
              </td>
            </tr>
            <tr>
              <td>Fruit-tree sapling</td>
              <td>Do not water it. Keep the sapling’s 3×3 free of blocking things while it grows.</td>
              <td>
                Inspect the eight surrounding cells for a blocking object, flooring or
                path, or terrain feature; grass, seed spots, and artifact spots are not
                blockers.
              </td>
            </tr>
            <tr>
              <td>Crop on tilled soil</td>
              <td>Follow the crop rule and water when its soil needs water. In the greenhouse, rain does not remove that need.</td>
              <td>
                Check the tilled crop tile, then check whether the sprinkler or can is
                addressing that soil.
              </td>
            </tr>
            <tr>
              <td>Sprinkler</td>
              <td>It waters tilled soil in range, not a tree.</td>
              <td>Check the soil tiles inside its coverage and identify the tree separately.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>When a tree does not grow, test growth conditions</h2>
      <p>
        “It did not get taller” is an observation, not yet a diagnosis. Start with the
        state you can see. A common sapling at stage 4 points to a mature neighbor
        check. A fruit sapling with a blocking object, flooring or path, or terrain
        feature in its 3×3 points to a space check. A crop in the greenhouse points to
        watering or sprinkler coverage. The can comes after that classification, and for
        either kind of tree it is not the fix.
      </p>
      <p>
        <strong>Common sapling visibly at stage 4.</strong> Count the eight adjacent
        tiles around the seedling. Check the diagonal corners first if the layout is
        tight; a mature tree in any one of the eight positions is enough to stop the
        seedling from passing stage 4. Do not replace this check with a 3×3 clearance
        sweep. The question is whether a mature tree occupies a neighboring tile. If
        none of the eight tiles has a mature tree, do not diagnose an error yet. Stage 4
        normally takes longer than the earlier stages. Check the season and whether Tree
        Fertilizer was applied before deciding the sapling’s spot is wrong. This check
        does not promise growth the following night.
      </p>
      <p>
        If one of those tiles has a mature tree and you want the seedling to continue,
        decide which tree to keep or remove. The growth rule points to that choice;
        watering, a sprinkler, and an empty crop-looking tile do not answer it.
      </p>
      <p>
        <strong>Common sapling is below stage 4.</strong> Do not call a single unchanged
        night a failure. Without Tree Fertilizer, a non-Mahogany common tree has a 20%
        chance each night to advance, while Mahogany has a 15% chance, so the
        common-tree check is probabilistic. Without Tree Fertilizer, common trees do not
        grow in winter outside the desert and Ginger Island. If you apply Tree Fertilizer
        to a seed or sapling, it can still grow in winter. That seasonal boundary belongs
        to common trees; it is not a rule to paste onto fruit saplings.
      </p>
      <p>
        Write the observation in plain language: “common tree, not stage 4, no growth
        seen.” That sentence tells you to account for the nightly chance and season. It
        does not tell you to fill the can and walk back over the same tile.
      </p>
      <p>
        <strong>Fruit sapling has a blocked growth ring.</strong> Stand on the sapling as
        the center and inspect the surrounding ring cell by cell. Check for the blocking
        objects, flooring or paths, and terrain features inside the 3×3. A blocker can
        stop that night’s growth while the sapling remains planted. Clear the blocker
        before the next overnight growth check, and keep the ring free of blocking things
        during the growing period.
      </p>
      <p>
        Do not use the common-tree stage-4 test here. The fruit-tree symptom is a blocked
        3×3 space, not a mature-tree-neighbor condition. Do not treat the 28-day maturity
        period as a reason to water the sapling; the 28 days describe when it becomes
        mature, while the clear space describes whether growth can proceed on a given
        night.
      </p>
      <p>
        <strong>Fruit sapling has no obvious blocker.</strong> Recheck the whole 3×3,
        including corners and the cell directly beside the trunk. Use the same non-blocking
        exceptions as above, then check for a blocker. If the sapling is still in its
        growth period, keep the ring free of blocking things. Once it is mature, the rule
        changes and paths or objects can sit beside the trunk.
      </p>
      <p>
        The fruit sapling can grow in any season and does not die in winter. If a winter
        fruit sapling seems stalled, check the 3×3 for a blocking object, flooring or
        path, or terrain feature, not a watering schedule. Use the same non-blocking
        exceptions as above.
      </p>
      <p>
        <strong>The object is still unclear.</strong> Stop before choosing a watering
        action. Look at whether the tile is tilled soil with a crop, a seed or sapling
        planted in a tree spot, or a placed sprinkler. If the only evidence is a small
        green shape, the object label is still missing. A wrong label creates the wrong
        next check, especially when “tree” could mean an ordinary tree or a fruit tree.
      </p>

      <h2>Keep crops, sprinklers, and trees in separate rules</h2>
      <p>
        The four objects can stand next to one another on a farm, but their rules should
        stay separate in your notes. A crop asks whether tilled soil has water. A
        sprinkler asks which tilled-soil tiles fall inside its coverage. A common tree
        asks about its growth stage, mature neighbors, season, and nightly chance. A
        fruit tree asks about its 3×3 while it grows. “This tile is close to water” is not
        a shared rule.
      </p>
      <p>
        The greenhouse makes this separation easy to miss. Its crop bed is 10×12, and
        greenhouse crops still need water even when it is raining. That is a crop
        condition. It does not turn the greenhouse’s fruit trees into crops, and it does
        not make a watering can useful for an ordinary tree seed.
      </p>
      <p>
        A sprinkler reaches cultivated soil inside its range. If you need the range
        numbers, ordinary, quality, and iridium sprinklers cover 4, 8, and 24 tilled crop
        tiles. Those numbers describe soil coverage. They do not describe a tree’s growth
        chance, a common tree’s mature-neighbor limit, or a fruit sapling’s 3×3.
      </p>
      <p>
        That boundary matters when objects share a rectangle. A sprinkler may be placed
        near a tree in a drawing, yet its job remains watering the tilled soil it covers.
        A dry greenhouse crop can need a can or sprinkler check during rain. A common
        sapling beside the same field still needs no water. A fruit sapling beside the
        field still needs its growth ring clear.
      </p>
      <p>
        Use the <a href="/sprinkler-stardew">Stardew Valley sprinkler layout guide</a>{" "}
        when the question is coverage for crop soil. Use the{" "}
        <a href="/glasshouse-stardew-valley">Stardew Valley greenhouse layout guide</a>{" "}
        when the question is the 10×12 indoor bed and its crop arrangement. These links
        answer crop-specific questions; then return to the tree checks above.
      </p>
      <p>
        A simple map mark can keep the rules readable. Shade tilled crop soil in one
        color, draw sprinkler coverage over that soil, and outline tree growth spaces
        with a different mark. That is a planning suggestion, not a new game rule. The
        point is to make the object boundary visible before you walk around with the can.
      </p>
      <p>
        After you identify the object, the <a href="/stardew-valley-trees">common trees guide</a>,
        <a href="/oak-tree-stardew"> oak guide</a>, and{" "}
        <a href="/maple-tree-stardew">maple guide</a> answer species-specific questions.
        The first decision is still what you are looking at.
      </p>

      <h2>Use this morning decision</h2>
      <p>Use these three steps before you pick up the can:</p>
      <ol>
        <li>
          <strong>Name the object.</strong> Decide whether the tile holds a common-tree
          seed or sapling, a fruit-tree sapling, a crop on tilled soil, or a sprinkler.
          If you cannot name it, inspect the item or planted object before making a
          watering decision.
        </li>
        <li>
          <strong>Apply the water rule.</strong> Do not water a common tree or a fruit
          tree. For crop soil, use the crop rule; in the greenhouse, rain does not remove
          the need to water. A sprinkler covers tilled soil in range and does not water
          either kind of tree.
        </li>
        <li>
          <strong>Choose the next visible check.</strong> A common sapling at stage 4
          sends you to the eight adjacent tiles and any mature tree there. If those eight
          tiles have no mature tree, allow for stage 4 taking longer than earlier stages,
          then check the season and whether Tree Fertilizer was applied; the next night is
          not guaranteed. A common sapling below stage 4 sends you to the no-fertilizer
          chance: 20% for a non-Mahogany common tree or 15% for Mahogany, plus the
          season. A fruit sapling sends you to its centered 3×3; inspect it for blocking
          objects, flooring or paths, or terrain features. A crop or sprinkler sends you
          to tilled-soil coverage.
        </li>
      </ol>
      <p>
        That is enough for the morning decision. Tree or crop first, watering conclusion
        second, visible condition third. When the object is a tree, put the can away and
        inspect the growth rule that belongs to that tree.
      </p>

      <BlogSources
        heading="Sources"
        items={[
          {
            href: "https://stardewvalleywiki.com/Trees",
            label: "Stardew Valley Wiki: Trees",
          },
          {
            href: "https://stardewvalleywiki.com/Fruit_Trees",
            label: "Stardew Valley Wiki: Fruit Trees",
          },
          {
            href: "https://stardewvalleywiki.com/Greenhouse",
            label: "Stardew Valley Wiki: Greenhouse",
          },
          {
            href: "https://stardewvalleywiki.com/Sprinkler",
            label: "Stardew Valley Wiki: Sprinkler",
          },
        ]}
      />
    </article>
  );
}
