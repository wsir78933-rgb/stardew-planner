import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function StardewFruitEnglishArticle() {
  return (
    <article>
      <FruitIntroduction />
      <FruitSourceCrosswalk />
      <FruitCropReference />
      <FruitTreeReference />
      <ForagedFruitReference />
      <FruitProcessingReference />
      <FruitDecisionSteps />
      <FruitCategoryBoundaries />
      <FruitFaq />
      <FruitSources />
    </article>
  );
}

function FruitIntroduction() {
  return (
    <>
      <p>
        Stardew Valley fruit comes from planted crops, fruit trees, wild forage,
        and a few overlapping sources. The vanilla <a href="https://stardewvalleywiki.com/Fruits">fruit list</a> contains
        27 named items, including Hot Pepper, Coconut, Powdermelon, and the
        quest-only Qi Fruit. To find one, start with its source and access
        condition below; to process one you already have, check the input quantity
        and product before comparing sale prices.
      </p>
      <p>
        This reference includes the 1.6 additions. All raw prices below are the
        listed base sale value of one normal-quality item, without profession or
        other price bonuses. Outdoor seasons refer to the valley farm unless a
        row says otherwise. A summer label describes when a plant produces there;
        it does not prevent you from using fruit you saved earlier or obtaining
        it through a separately listed source.
      </p>
    </>
  );
}

function FruitSourceCrosswalk() {
  return (
    <>
      <h2>Match the fruit to its source before looking for seeds</h2>
      <p>
        A fruit item is the thing in your inventory. A fruit crop is a plant
        grown from seeds or a starter. A fruit tree is a different source, grown
        from a sapling. These labels answer different questions: the item category
        helps determine what a machine makes, while the source tells you where to
        go or what to plant. The <a href="https://stardewvalleywiki.com/Fruits">Fruits reference</a> lists
        both farming and foraging for some items, so one name can have more than
        one acquisition route.
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Three illustrated source pairs: strawberry and a cultivated bed, apple and a fruit tree, blackberry and a wild bramble."
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/stardew-fruit-crosswalk.webp"
          width={1672}
        />
        <figcaption>
          Strawberry points to a cultivated crop, Apple to a fruit tree, and
          Blackberry to wild forage. This illustration shows example sources,
          not an in-game screenshot or planting layout; Blackberry also has the
          additional routes listed below.
        </figcaption>
      </figure>
      <p>
        Read the illustration from the fruit toward its source. A Strawberry
        sends you looking for Strawberry Seeds; an Apple can send you looking for
        an Apple Sapling. A Blackberry can send you outdoors during fall, without
        a seed purchase. That distinction matters before you spend money: a
        fruit's familiar appearance does not establish that the game sells a
        corresponding sapling, and a fruit found on the ground may also have a
        cultivated source.
      </p>
      <p>
        The three tables together contain the complete 27-item list, with each
        name appearing once. The last table deliberately keeps multiple-source
        items together: Grape can be a summer forage or a fall crop, while Cactus
        Fruit has desert and cultivated routes. Wild Seeds also produce certain
        foraged fruits. Treat those routes as alternatives for obtaining the same
        item, rather than counting them as additional kinds of fruit.
      </p>
    </>
  );
}

function FruitCropReference() {
  return (
    <>
      <h2>Fruit grown as crops: seeds, seasons, and base prices</h2>
      <p>
        These eleven fruits have a cultivated crop as their listed source.
        The timing comes from the <a href="https://stardewvalleywiki.com/Crops">crop reference</a> and
        uses ordinary growth without speed bonuses. A first-harvest time is a
        growing period, not a guaranteed calendar date after buying seeds. Repeat
        intervals apply after the plant reaches maturity; a single-harvest crop
        needs another planting for another harvest. Grape and Cactus Fruit have
        crop routes too, described in the multiple-source table.
      </p>
      <div aria-label="Fruit crops, availability, and normal sale prices" className="blog-table-scroll" role="region" tabIndex={0}>
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Fruit</th>
              <th scope="col">Outdoor season</th>
              <th scope="col">Seed access and harvest pattern</th>
              <th scope="col">Base sale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Ancient Fruit</th>
              <td>Spring, summer, fall</td>
              <td><a href="https://stardewvalleywiki.com/Ancient_Seeds">Ancient Seeds</a> from the Museum reward or Seed Maker routes; first harvest after 28 days, then every 7 days.</td>
              <td>550g</td>
            </tr>
            <tr>
              <th scope="row">Blueberry</th>
              <td>Summer</td>
              <td>Blueberry Seeds at Pierre's; first harvest after 13 days, then every 4 days. A normal harvest produces multiple berries.</td>
              <td>50g per berry</td>
            </tr>
            <tr>
              <th scope="row">Cranberries</th>
              <td>Fall</td>
              <td>Cranberry Seeds at Pierre's or JojaMart; first harvest after 7 days, then every 5 days. A harvest produces multiple berries.</td>
              <td>75g per berry</td>
            </tr>
            <tr>
              <th scope="row">Hot Pepper</th>
              <td>Summer</td>
              <td>Pepper Seeds at Pierre's or JojaMart; first harvest after 5 days, then every 3 days. The harvested item is classified as fruit.</td>
              <td>40g</td>
            </tr>
            <tr>
              <th scope="row">Melon</th>
              <td>Summer</td>
              <td>Melon Seeds at Pierre's or JojaMart; a single harvest after 12 days, followed by replanting if you want another crop.</td>
              <td>250g</td>
            </tr>
            <tr>
              <th scope="row">Pineapple</th>
              <td>Summer in the valley; any season on Ginger Island</td>
              <td>Pineapple Seeds through the Island Trader for one Magma Cap; first harvest after 14 days, then every 7 days.</td>
              <td>300g</td>
            </tr>
            <tr>
              <th scope="row">Powdermelon</th>
              <td>Winter</td>
              <td><a href="https://stardewvalleywiki.com/Powdermelon_Seeds">Powdermelon Seeds</a> from Seed Spots and other special sources, including the Raccoon Wife's Shop; a single harvest after 7 days.</td>
              <td>60g</td>
            </tr>
            <tr>
              <th scope="row">Qi Fruit</th>
              <td>Any season, during Qi's Crop</td>
              <td><a href="https://stardewvalleywiki.com/Qi_Fruit">Qi Beans</a> during the active quest; a single harvest after 4 days. Quest expiry affects the fruit and seeds.</td>
              <td>1g</td>
            </tr>
            <tr>
              <th scope="row">Rhubarb</th>
              <td>Spring</td>
              <td>Rhubarb Seeds at the Oasis in the desert; a single harvest after 13 days. You need access to that shop for this purchase route.</td>
              <td>220g</td>
            </tr>
            <tr>
              <th scope="row">Starfruit</th>
              <td>Summer</td>
              <td>Starfruit Seeds at the Oasis in the desert; a single harvest after 13 days. The fruit is distinct from the Stardrop item.</td>
              <td>750g</td>
            </tr>
            <tr>
              <th scope="row">Strawberry</th>
              <td>Spring</td>
              <td>Strawberry Seeds sold at the Egg Festival; first harvest after 8 days, then every 4 days. Seed access is tied to that event for this route.</td>
              <td>120g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Check the seed name as well as the fruit name. The plantable packet is
        <a href="https://stardewvalleywiki.com/Ancient_Seeds"> Ancient Seeds</a>,
        whereas the Ancient Seed artifact is donated to the Museum to unlock a
        packet and its crafting recipe. Finding the artifact is therefore a step
        toward growing Ancient Fruit, rather than a ready-to-plant crop. The Seed
        Maker is another documented route, including a chance of producing
        Ancient Seeds while processing other crops.
      </p>
      <p>
        Powdermelon requires a different kind of search. Its seeds are not a
        normal gold purchase at Pierre's or JojaMart. The <a href="https://stardewvalleywiki.com/Powdermelon_Seeds">seed page</a> limits
        most acquisition methods to Fall 21 through Winter 20, with the Raccoon
        Wife's Shop and Seed Maker listed as exceptions. Those are acquisition
        conditions, separate from the winter growing season. If a seed source is
        unavailable today, knowing that the fruit grows in winter does not remove
        the access requirement.
      </p>
      <p>
        Keep <a href="https://stardewvalleywiki.com/Qi_Fruit">Qi Fruit</a> tied
        to its quest. Ordinary Qi Fruit, Qi Beans, and growing crops disappear
        when the quest ends, including fruit in storage and processing machines.
        Giant Qi Fruit is the documented exception: the giant crop can remain,
        but chopping it outside an active Qi's Crop quest gives a Mystery Box
        instead of fruit. An “any season” label here does not create a permanent
        fruit supply that you can start whenever you like.
      </p>
    </>
  );
}

function FruitTreeReference() {
  return (
    <>
      <h2>The eight fruit-tree fruits and how to obtain their saplings</h2>
      <p>
        Apple, Apricot, Banana, Cherry, Mango, Orange, Peach, and Pomegranate are
        the <a href="https://stardewvalleywiki.com/Fruit_Trees">fruit-tree subset</a>.
        A normal-quality sapling takes 28 days to mature when its growth conditions
        are met. A mature tree normally produces one fruit per day in season and
        holds up to three uncollected fruits. Higher-quality saplings introduced
        in 1.6 mature faster, so the normal sapling's waiting period should not be
        applied to every replanted tree.
      </p>
      <div aria-label="Eight fruit-tree fruits and sapling sources" className="blog-table-scroll" role="region" tabIndex={0}>
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Fruit</th>
              <th scope="col">Valley outdoor season</th>
              <th scope="col">Sapling purchase or trade</th>
              <th scope="col">Base fruit sale</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Apple</th><td>Fall</td><td>Apple Sapling: 4,000g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>100g</td></tr>
            <tr><th scope="row">Apricot</th><td>Spring</td><td>Apricot Sapling: 2,000g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>50g</td></tr>
            <tr><th scope="row">Banana</th><td>Summer</td><td>Banana Sapling: five Dragon Teeth at the Island Trader. Ginger Island trees produce in every season.</td><td>150g</td></tr>
            <tr><th scope="row">Cherry</th><td>Spring</td><td>Cherry Sapling: 3,400g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>80g</td></tr>
            <tr><th scope="row">Mango</th><td>Summer</td><td>Mango Sapling: 75 Mussels at the Island Trader. Ginger Island trees produce in every season.</td><td>130g</td></tr>
            <tr><th scope="row">Orange</th><td>Summer</td><td>Orange Sapling: 4,000g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>100g</td></tr>
            <tr><th scope="row">Peach</th><td>Summer</td><td>Peach Sapling: 6,000g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>140g</td></tr>
            <tr><th scope="row">Pomegranate</th><td>Fall</td><td>Pomegranate Sapling: 6,000g at Pierre's. Fruit also appears in the fruit-bat Farm Cave.</td><td>140g</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        The shop or trade column gives a documented way to obtain the sapling,
        not an exhaustive list of random rewards. The fruit price is the value
        of the harvested item, separate from the upfront cost of its tree. A
        Pomegranate found in the cave is still a fruit-tree kind of fruit, but
        finding it does not mean you have obtained or planted a Pomegranate
        Sapling. Use the cave route when you need the item; use the sapling route
        when you are trying to establish that source yourself.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/The_Cave">Farm Cave fruit requires the fruit-bat choice</a> when
        Demetrius offers it after 25,000g in total earnings. Bats can leave fruit
        outside its normal outdoor season, but the named item you want is not a
        guaranteed daily delivery. The mushroom option does not provide that
        fruit supply. Banana and Mango are not listed among the cave's fruits,
        so their island-related access cannot be replaced by waiting for bats.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Fruit_Trees">Mature fruit trees in the Greenhouse or on Ginger Island</a> produce
        year-round. Outdoor valley trees remain alive through winter, but their
        usual fruiting season still matters. This is why an Apple tree's fall
        label and a Banana tree's summer label can both be correct while trees
        grown in those other locations continue producing. Match the location
        before treating a seasonal label as a limit on every tree you own.
      </p>
    </>
  );
}

function ForagedFruitReference() {
  return (
    <>
      <h2>Foraged fruit and items with more than one source</h2>
      <p>
        Foraging routes depend on a place and, often, a season or short berry
        window. The <a href="https://stardewvalleywiki.com/Foraging">foraging tables</a> identify
        the outdoor locations below; the <a href="https://stardewvalleywiki.com/Fruits">fruit list</a> also
        records Wild Seeds and cave alternatives. The locations are practical
        places to look, not promises that an item will be waiting there on every
        visit. Wild Seeds are a mixed forage source, so sowing them is not the
        same as buying a packet dedicated to one named fruit.
      </p>
      <div aria-label="Foraged and multiple-source fruit reference" className="blog-table-scroll" role="region" tabIndex={0}>
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Fruit</th>
              <th scope="col">Season or condition</th>
              <th scope="col">Where or how to obtain it</th>
              <th scope="col">Base sale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Blackberry</th>
              <td>Fall; berry bushes on Fall 8–11</td>
              <td>Outdoor forage, including Cindersap Forest; berry bushes; Fall Seeds; or the fruit-bat Farm Cave.</td>
              <td>20g</td>
            </tr>
            <tr>
              <th scope="row">Cactus Fruit</th>
              <td>All seasons, with desert or suitable growing-location access</td>
              <td><a href="https://stardewvalleywiki.com/Cactus_Fruit">Calico Desert forage</a>, an Oasis purchase on Tuesdays, or Cactus Seeds grown in a permitted location.</td>
              <td>75g</td>
            </tr>
            <tr>
              <th scope="row">Coconut</th>
              <td>All seasons, with access to its locations</td>
              <td><a href="https://stardewvalleywiki.com/Coconut">Calico Desert forage or palm trees</a>, including palms on Ginger Island; also sold at the Oasis on Mondays.</td>
              <td>100g</td>
            </tr>
            <tr>
              <th scope="row">Crystal Fruit</th>
              <td>Winter outdoors</td>
              <td>Winter forage, including the Railroad, Mountain, and Cindersap Forest; also a possible harvest from Winter Seeds.</td>
              <td>150g</td>
            </tr>
            <tr>
              <th scope="row">Grape</th>
              <td>Summer forage; fall crop</td>
              <td>Summer forage around the Mountain or Backwoods, or Summer Seeds; in fall, Grape Starter from Pierre's grows on a trellis.</td>
              <td>80g</td>
            </tr>
            <tr>
              <th scope="row">Salmonberry</th>
              <td>Bushes on Spring 15–18</td>
              <td>Harvest seasonal berry bushes; the fruit-bat Farm Cave is a separate source outside that short outdoor window.</td>
              <td>5g</td>
            </tr>
            <tr>
              <th scope="row">Spice Berry</th>
              <td>Summer outdoors</td>
              <td>Forage in places such as Cindersap Forest, the Mountain, and Backwoods; Summer Seeds or the fruit-bat Farm Cave also supply it.</td>
              <td>80g</td>
            </tr>
            <tr>
              <th scope="row">Wild Plum</th>
              <td>Fall outdoors</td>
              <td>Forage around the Bus Stop, Railroad, Mountain, or Backwoods; Fall Seeds or the fruit-bat Farm Cave provide other routes.</td>
              <td>80g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Grape's two seasons describe two different routes. In summer you can
        collect it as forage or obtain it from Summer Seeds. In fall, a planted
        <a href="https://stardewvalleywiki.com/Crops#Grape"> Grape Starter</a>{" "}
        takes 10 days to reach its first harvest and then produces every three
        days. Finding a summer Grape does not make Grape Starter a summer crop.
        Conversely, an empty fall forage walk does not rule out cultivating
        Grapes yourself during that season.
      </p>
      <p>
        Cactus Fruit's “all seasons” entry also needs its location attached.
        <a href="https://stardewvalleywiki.com/Cactus_Seeds"> Cactus Seeds</a>{" "}
        can grow in the Greenhouse, inside a building in a Garden Pot, or on
        Ginger Island. They are not an ordinary outdoor valley crop. Their
        normal first harvest takes 12 days, followed by a three-day repeat
        interval. If you need a single fruit rather than a recurring plant,
        desert forage or the documented Oasis purchase gives you a different
        route to investigate.
      </p>
      <p>
        Coconut belongs in this group even though palm trees can supply it.
        The <a href="https://stardewvalleywiki.com/Coconut">Coconut page</a>{" "}
        explicitly says you cannot plant a Coconut to create a palm tree.
        A palm is therefore not a ninth purchasable fruit-tree sapling in the
        eight-tree table. Also, Coconut is inedible raw but still accepts fruit
        processing: the ability to eat an item and the ability to make Jelly
        or Wine from it are separate properties.
      </p>
    </>
  );
}

function FruitProcessingReference() {
  return (
    <>
      <h2>Read Jelly, Wine, and dried-fruit prices on the same basis</h2>
      <p>
        The listed fruits can go into a Preserves Jar for Jelly or a Keg for
        Wine. A Dehydrator takes a batch of five matching fruits; Grape makes
        Raisins while the other fruits make Dried Fruit. These are processing
        routes for a fruit item you already possess. They do not remove a seed,
        season, location, or quest requirement for obtaining that fruit.
      </p>
      <div aria-label="Fruit processing inputs and base output formulas" className="blog-table-scroll" role="region" tabIndex={0}>
        <table className="blog-data-table">
          <thead>
            <tr><th scope="col">Route</th><th scope="col">Input</th><th scope="col">Base output value</th><th scope="col">Processing time</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row"><a href="https://stardewvalleywiki.com/Preserves_Jar">Jelly</a></th><td>One fruit in a Preserves Jar</td><td>2 × fruit base price + 50g</td><td>4,000 game minutes, about 2–3 days</td></tr>
            <tr><th scope="row"><a href="https://stardewvalleywiki.com/Wine">Wine</a></th><td>One fruit in a Keg</td><td>3 × fruit base price, before aging</td><td>10,000 game minutes, about 7 days</td></tr>
            <tr><th scope="row"><a href="https://stardewvalleywiki.com/Dehydrator">Dried Fruit</a></th><td>Five of one fruit type and quality, excluding Grape</td><td>7.5 × fruit base price + 25g per batch</td><td>Ready the next morning</td></tr>
            <tr><th scope="row"><a href="https://stardewvalleywiki.com/Dehydrator">Raisins</a></th><td>Five Grapes of the same quality</td><td>600g per batch, without Artisan</td><td>Ready the next morning</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        The formulas use the fruit's base price, not its silver, gold, or iridium
        sale value. <a href="https://stardewvalleywiki.com/Preserves_Jar">Jelly ignores ingredient quality</a>,
        and <a href="https://stardewvalleywiki.com/Dehydrator">dried products are always normal quality</a>.
        Matching quality is still required to load a Dehydrator batch. Five
        Blueberries split across incompatible quality stacks do not meet that
        batch requirement simply because they share a name. Higher-quality
        ingredients also do not turn ordinary Keg output into aged Wine; the
        <a href="https://stardewvalleywiki.com/Wine"> Wine quality increase comes from a Cask</a>.
      </p>
      <p>
        Compare quantities before reading a bigger number as a better return.
        The <a href="https://stardewvalleywiki.com/Fruits">documented base prices</a>{" "}
        for Apple are 100g raw, 250g as Jelly, 300g as unaged Wine, and 775g for a
        dried batch. That dried batch consumes five Apples, whereas the jar and
        Keg each consume one. For Starfruit, the same reference lists 750g raw,
        1,550g as Jelly, 2,250g as unaged Wine, and 5,650g for the five-fruit dried
        batch. These are output sale values, not amounts left after buying seeds
        or making machines.
      </p>
      <p>
        Processing time is another separate condition. One free jar, one free
        Keg, and a pile of five matching fruits present different immediate
        choices. The next-morning Dehydrator cycle moves a batch at once; a Keg
        occupies its slot much longer. Use those facts to match an available
        machine to the quantity of fruit you want to handle today. The
        Dehydrator is a 1.6 machine, and its recipe can be purchased from
        <a href="https://stardewvalleywiki.com/Dehydrator"> Pierre for 10,000g</a>.
      </p>
      <p>
        Actual sale values can differ from this common baseline. The
        <a href="https://stardewvalleywiki.com/Fruits"> Fruits reference</a>{" "}
        separates normal prices, Tiller, Bear's Knowledge, and Artisan columns.
        Tiller eligibility can depend on how the fruit was acquired, rather
        than its name alone; Farm Cave fruit and Wild Seed harvests have
        foraging treatment. The Artisan column concerns processed goods.
        Keep those conditions separate, and use the appropriate documented
        column if a displayed value differs from the base figures here.
      </p>
    </>
  );
}

function FruitDecisionSteps() {
  return (
    <>
      <h2>Choose a next step from the fruit you need or already own</h2>
      <ol>
        <li>
          <strong>Find the exact item.</strong> Start with its row and read the
          source before buying anything. If you need Crystal Fruit, winter
          forage and Winter Seeds are relevant. If you need a Melon, a Melon
          Seeds route is relevant. Similar-looking or similarly named items
          are not substitutes for that identification step.
        </li>
        <li>
          <strong>Check the gate on that route.</strong> Confirm the outdoor
          season, shop or island access, and any special event or quest.
          A route you can use now is more actionable than a fruit price with no
          obtainable input. If one route is closed, consult only the alternatives
          actually listed for that item, such as the fruit-bat cave for Apple.
        </li>
        <li>
          <strong>Separate having a fruit from establishing its source.</strong>{" "}
          A fruit bought from the Oasis solves an immediate item need; a packet
          of seeds starts a growing process. Check the first-harvest wait and
          repeat pattern if you are planting. Check where to forage if you are
          collecting. Buying a sapling does not give you today's mature-tree
          harvest.
        </li>
        <li>
          <strong>Keep any required raw item before processing the remainder.</strong>{" "}
          Read the name, quantity, and quality required by your current bundle
          or quest. A processed product has its own identity: Apple Jelly and
          an Apple are different items. For Qi Fruit especially, consult the
          active quest before tying up fruit in a machine or treating it as
          long-term stock.
        </li>
        <li>
          <strong>Match the remaining stack to an available machine.</strong>{" "}
          One fruit is enough for Jelly or Wine; drying needs five of the same
          type and quality. Check Grape's Raisins exception, then compare the
          relevant base prices using equal input quantities. Keep the machine's
          completion time in view if you need the product by a particular day.
        </li>
      </ol>
    </>
  );
}

function FruitCategoryBoundaries() {
  return (
    <>
      <h2>Names that can mislead you about the fruit category</h2>
      <p>
        Hot Pepper is included because the game classifies it as fruit, even
        if you usually think of peppers as vegetables when cooking. Rhubarb is
        also included despite being an inedible raw item in the game. Use the
        <a href="https://stardewvalleywiki.com/Fruits"> game category and documented processing route</a>{" "}
        for these decisions. Everyday food categories do not reliably predict
        what a Keg or Preserves Jar will produce.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">Sweet Gem Berry</a>{" "}
        is the important counterexample: it grows from a Rare Seed but is
        classified as neither fruit nor vegetable. It cannot be processed in a
        Keg, Preserves Jar, or Dehydrator. The word “Berry” does not add it to
        this list. Likewise, a Coconut's association with a palm does not place
        it among the eight sapling-grown fruit-tree fruits. Check the named item
        first, then follow the source and processing rules that belong to it.
      </p>
    </>
  );
}

function FruitFaq() {
  const questions = [
    {
      question: "A fruit has several sources. Which can meet my deadline?",
      answer: (
        <p>
          Check each route separately: first its season and access conditions,
          then the wait for the item. For a new planting, compare your remaining
          days with the first-harvest time, not the repeat interval. For example,
          a fall Grape Starter cannot cover a five-day deadline when its ordinary
          first harvest takes 10 days; the three-day repeat applies only after
          maturity. A summer forage alternative does not fix that fall deadline.
          For fruits with forage or cave routes, keep those as possibilities
          rather than a promised delivery date. If no listed route passes both
          checks, this reference does not establish a way to meet your deadline.
        </p>
      ),
    },
    {
      question: "It is winter and I have no fruit seeds. What should I check first?",
      answer: (
        <p>
          Separate a collection task from a planting task. For Crystal Fruit,
          you can check the listed winter forage locations without first finding
          Winter Seeds. For Powdermelon, check seed access before allowing seven
          days for growth: if it is already past Winter 20, the usual acquisition
          window has closed, so check the listed Raccoon Wife's Shop or Seed
          Maker exceptions instead. Do not treat Qi Fruit as a fallback just
          because its row says any season. First confirm that Qi's Crop is
          active, then compare the quest time remaining with its four-day growth
          period. A winter growing season, an available seed source, and an
          active quest are three separate checks.
        </p>
      ),
    },
    {
      question: "I have five fruits, but the Dehydrator will not load. What do I count?",
      answer: (
        <p>
          Count within each type-and-quality stack, not across your inventory.
          Three normal Apples plus two silver Apples leave both stacks short;
          wait until one matching stack reaches five, or use individual Apples
          in a jar or Keg. If the rejected item is Sweet Gem Berry, adding more
          will not help because those machines do not accept it. If a matching
          five-Grape batch loads but produces Raisins, the input check has
          succeeded: that output is Grape's documented exception, not evidence
          that you combined the wrong quality levels.
        </p>
      ),
    },
  ] satisfies readonly BlogFaqItem[];

  return <><h2>Fruit FAQ</h2><BlogFaqList items={questions} /></>;
}

function FruitSources() {
  const sources = [
    { href: "https://stardewvalleywiki.com/Fruits", label: "Stardew Valley Wiki: Fruits", note: "Named items, acquisition categories, base prices, processed prices, and profession conditions." },
    { href: "https://stardewvalleywiki.com/Crops", label: "Crops", note: "Crop seasons, seed sources, ordinary growth periods, and repeat harvests." },
    { href: "https://stardewvalleywiki.com/Fruit_Trees", label: "Fruit Trees", note: "Eight fruit-tree types, sapling sources, normal growth, and location-dependent production." },
    { href: "https://stardewvalleywiki.com/Foraging", label: "Foraging", note: "Seasonal locations and berry-bush windows." },
    { href: "https://stardewvalleywiki.com/The_Cave", label: "The Farm Cave", note: "Fruit-bat choice, unlock condition, and out-of-season fruit." },
    { href: "https://stardewvalleywiki.com/Ancient_Seeds", label: "Ancient Seeds", note: "Museum, artifact, and Seed Maker distinctions." },
    { href: "https://stardewvalleywiki.com/Powdermelon_Seeds", label: "Powdermelon Seeds", note: "Seed acquisition methods and seasonal restrictions." },
    { href: "https://stardewvalleywiki.com/Qi_Fruit", label: "Qi Fruit", note: "Active-quest requirement, four-day growth, expiry, and giant-crop exception." },
    { href: "https://stardewvalleywiki.com/Cactus_Fruit", label: "Cactus Fruit", note: "Desert forage, Tuesday purchase, and crop harvest cycle." },
    { href: "https://stardewvalleywiki.com/Cactus_Seeds", label: "Cactus Seeds", note: "Permitted growing locations." },
    { href: "https://stardewvalleywiki.com/Coconut", label: "Coconut", note: "Forage and palm sources, Monday purchase, and non-plantable status." },
    { href: "https://stardewvalleywiki.com/Preserves_Jar", label: "Preserves Jar", note: "Jelly input, base formula, quality treatment, and processing time." },
    { href: "https://stardewvalleywiki.com/Wine", label: "Wine", note: "Keg output value, processing time, and separate Cask aging." },
    { href: "https://stardewvalleywiki.com/Dehydrator", label: "Dehydrator", note: "1.6 equipment, matching batches, dried-fruit formula, and Raisins exception." },
    { href: "https://stardewvalleywiki.com/Sweet_Gem_Berry", label: "Sweet Gem Berry", note: "Exclusion from fruit and vegetable processing." },
  ] satisfies readonly BlogSourceItem[];

  return (
    <BlogSources
      checkedLabel="Wiki pages checked September 26, 2026. Covers vanilla mechanics including 1.6; earlier versions and mods may differ."
      heading="Sources"
      items={sources}
    />
  );
}
