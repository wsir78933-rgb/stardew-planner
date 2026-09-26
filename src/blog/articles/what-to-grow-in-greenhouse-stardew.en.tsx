import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function GreenhouseChoiceFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="Watercolor three-panel greenhouse illustration showing a fruiting regrowing crop with a berry basket, an empty harvested bed ready for replanting, and a fruit tree on untiled perimeter soil"
        decoding="async"
        height="941"
        loading="lazy"
        src="/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-en.webp"
        width="1672"
      />
      <figcaption>Read each row from left to right.</figcaption>
    </figure>
  );
}

function GreenhouseSources() {
  return (
    <BlogSources
      heading="Sources"
      items={[
        { href: "https://stardewvalleywiki.com/Greenhouse", label: "Greenhouse - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Ancient_Fruit", label: "Ancient Fruit - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Ancient_Seeds", label: "Ancient Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Starfruit", label: "Starfruit - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Starfruit_Seeds", label: "Starfruit Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Sweet_Gem_Berry", label: "Sweet Gem Berry - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Rare_Seed", label: "Rare Seed - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Hops", label: "Hops - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Hops_Starter", label: "Hops Starter - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Blueberry", label: "Blueberry - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Blueberry_Seeds", label: "Blueberry Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Cranberries", label: "Cranberries - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Cranberry_Seeds", label: "Cranberry Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Strawberry", label: "Strawberry - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Strawberry_Seeds", label: "Strawberry Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Pineapple", label: "Pineapple - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Pineapple_Seeds", label: "Pineapple Seeds - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Apple", label: "Apple - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Apple_Sapling", label: "Apple Sapling - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Peach", label: "Peach - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Peach_Sapling", label: "Peach Sapling - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Pomegranate", label: "Pomegranate - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Pomegranate_Sapling", label: "Pomegranate Sapling - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Banana", label: "Banana - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Banana_Sapling", label: "Banana Sapling - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Mango", label: "Mango - Stardew Valley Wiki" },
        { href: "https://stardewvalleywiki.com/Mango_Sapling", label: "Mango Sapling - Stardew Valley Wiki" },
      ]}
    />
  );
}

export function WhatToGrowInGreenhouseStardewEnglishArticle() {
  return (
    <article>
      <p>
        There is no single crop that fits every Greenhouse: choose by the seed or sapling you can obtain, the wait for the first harvest, the repeat cycle, and how much replanting your routine can handle. This guide assumes the <a href="https://stardewvalleywiki.com/Greenhouse">Greenhouse</a> is already usable; crops there can be planted, grown, and harvested in any season, but <a href="https://stardewvalleywiki.com/Greenhouse">rain does not water them</a>. Next, choose a repeat-harvest or replanting path, then check how you can obtain the seed or sapling before you buy or plant anything.
      </p>

      <h2>Choose the harvest pattern before choosing a crop name</h2>

      <p>
        The first decision is not “Which crop has the biggest number?” It is whether you want the planting to keep producing after its first harvest. A regrowing crop leaves the same plant in place while you return for another harvest. A single-harvest crop gives you a clear replanting point, which can be useful when you want to change the crop in that space. The Greenhouse removes normal season restrictions, and the Greenhouse rules say that regrowing crops continue across season changes instead of dying at the end of a season. That makes harvest rhythm a useful choice criterion even when the outdoor season would normally limit a crop.
      </p>

      <h3>Choose a regrowing crop when you want fewer replanting actions</h3>

      <p>
        Use a regrowing crop when you would rather revisit the same planting than clear it and sow again. The table is a decision map, not a universal ranking. “Normal sale” is the normal-quality sale value of one harvested item; it is not a processed return, a daily-gold calculation, or a promise that one crop is best for every farm.
      </p>

      <div
        aria-label="Regrowing crop choice table"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">First harvest and repeat pattern</th>
              <th scope="col">Normal sale value</th>
              <th scope="col">How you can obtain it</th>
              <th scope="col">Choose it when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ancient Fruit</td>
              <td><a href="https://stardewvalleywiki.com/Ancient_Fruit">28 days</a>, then every <a href="https://stardewvalleywiki.com/Ancient_Fruit">7 days</a></td>
              <td><a href="https://stardewvalleywiki.com/Ancient_Fruit">550g</a></td>
              <td>Ancient Seeds come through the Museum reward or Seed Maker; the seed page lists no normal shop purchase.</td>
              <td>You already have the seed path and can accept a long first wait for a persistent planting.</td>
            </tr>
            <tr>
              <td>Hops</td>
              <td><a href="https://stardewvalleywiki.com/Hops">11 days</a>, then every <a href="https://stardewvalleywiki.com/Hops">1 day</a></td>
              <td><a href="https://stardewvalleywiki.com/Hops">25g</a></td>
              <td>Hops Starter is listed at Pierre’s General Store, JojaMart, the Traveling Cart, and the Night Market Magic Shop Boat.</td>
              <td>You can check the Greenhouse often and want a very short repeat interval.</td>
            </tr>
            <tr>
              <td>Blueberry</td>
              <td><a href="https://stardewvalleywiki.com/Blueberry">13 days</a>, then every <a href="https://stardewvalleywiki.com/Blueberry">4 days</a></td>
              <td><a href="https://stardewvalleywiki.com/Blueberry">50g</a> per berry</td>
              <td>Blueberry Seeds are listed at Pierre’s General Store, the Traveling Cart, and the Night Market Magic Shop Boat.</td>
              <td>You want a shop-accessible repeat crop with a moderate first wait.</td>
            </tr>
            <tr>
              <td>Cranberry</td>
              <td><a href="https://stardewvalleywiki.com/Cranberries">7 days</a>, then every <a href="https://stardewvalleywiki.com/Cranberries">5 days</a></td>
              <td><a href="https://stardewvalleywiki.com/Cranberries">75g</a> per berry</td>
              <td>Cranberry Seeds are listed at Pierre’s General Store, JojaMart, the Traveling Cart, and the Night Market Magic Shop Boat.</td>
              <td>You want a repeat crop whose first harvest comes sooner than the other common choices here.</td>
            </tr>
            <tr>
              <td>Strawberry</td>
              <td><a href="https://stardewvalleywiki.com/Strawberry">8 days</a>, then every <a href="https://stardewvalleywiki.com/Strawberry">4 days</a></td>
              <td><a href="https://stardewvalleywiki.com/Strawberry">120g</a></td>
              <td>You can obtain seeds through the Egg Festival, the Calico Egg Merchant at the Desert Festival, or Maru’s Desert Festival shop.</td>
              <td>You have a Festival access route and want a repeat crop without a normal General Store seed path listed.</td>
            </tr>
            <tr>
              <td>Pineapple</td>
              <td><a href="https://stardewvalleywiki.com/Pineapple">14 days</a>, then every <a href="https://stardewvalleywiki.com/Pineapple">7 days</a></td>
              <td><a href="https://stardewvalleywiki.com/Pineapple">300g</a></td>
              <td>The seed source is the Island Trader, with a trade of <a href="https://stardewvalleywiki.com/Pineapple_Seeds">1 Magma Cap</a>.</td>
              <td>You have the Island route and want a repeat crop whose gate is an item trade rather than a gold price.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Read each row from left to right. If you cannot obtain the seed, the timing and sale value do not make that crop your next planting. If you dislike daily checks, Hops’ short repeat interval may not fit even though it keeps producing. If you want to reserve the space for a later crop, a single-harvest row may be easier to change after the harvest. The point is to match the plant to your routine, not to turn one sale value into a general answer.
      </p>

      <GreenhouseChoiceFigure />

      <p>
        The repeat pattern also changes what “ready for the next idea” means. A crop that has been harvested is not necessarily an empty planting space. Ancient Fruit, Blueberry, Cranberry, Strawberry, and Pineapple remain planted after their first harvest. Hops also remains planted, and its one-day repeat interval makes it the most frequent return visit in this table. Plan the next decision around the plant you will still be tending, not around the morning of its first harvest.
      </p>

      <h3>Choose a single-harvest crop when replanting is acceptable</h3>

      <p>
        A single-harvest crop gives up a repeat cycle in exchange for a fresh planting decision after harvest. That can suit a player who wants to change the crop, who is waiting for a later seed source, or who prefers to make a new choice instead of maintaining one plant indefinitely. It also means the first-harvest wait matters more, because the crop itself will not provide the next harvest.
      </p>

      <div
        aria-label="Single-harvest crop choice table"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">First harvest</th>
              <th scope="col">Repeat pattern</th>
              <th scope="col">Normal sale value</th>
              <th scope="col">Access and fit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Starfruit</td>
              <td><a href="https://stardewvalleywiki.com/Starfruit">13 days</a></td>
              <td>No repeat cycle is listed</td>
              <td><a href="https://stardewvalleywiki.com/Starfruit">750g</a></td>
              <td>Starfruit Seeds are listed at the Oasis for <a href="https://stardewvalleywiki.com/Starfruit_Seeds">400g</a>, or at the Traveling Cart for <a href="https://stardewvalleywiki.com/Starfruit_Seeds">600–1,000g</a>. Choose it when the Oasis or cart path is available and replanting is acceptable.</td>
            </tr>
            <tr>
              <td>Sweet Gem Berry</td>
              <td><a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">24 days</a></td>
              <td>No repeat cycle is listed</td>
              <td><a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">3,000g</a></td>
              <td>The Traveling Cart sells Rare Seed; its page lists <a href="https://stardewvalleywiki.com/Rare_Seed">1,000g</a> in spring and summer and <a href="https://stardewvalleywiki.com/Rare_Seed">600–1,000g</a> in its any-season range. Choose it only when that special access and long wait fit.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Sweet Gem Berry is a special-access decision, so check how often you can buy the seed and whether it is available today. Starfruit has the same practical split in a different form: its seed price is visible, but the crop has no repeat cycle, so you must be ready to replant after harvest if you want the space to keep producing.
      </p>

      <p>
        Melon and Pumpkin can look attractive if the idea of a Giant Crop is part of the decision. Remove that tie-breaker in the Greenhouse: the <a href="https://stardewvalleywiki.com/Greenhouse">Greenhouse page</a> states that Giant Crops cannot grow there. Choose a single-harvest crop for its access, timing, and harvest routine, not for an indoor Giant Crop expectation.
      </p>

      <h2>Let seed access and first harvest break the tie</h2>

      <p>
        After you choose a harvest pattern, put the access gate beside the timing. The Greenhouse lets a crop stay useful outside its normal outdoor season, but it does not create seeds or saplings. A crop you cannot obtain is a future option, not the answer to what you can plant now. A crop that you can obtain but cannot visit on its repeat schedule may also be a poor fit for your routine.
      </p>

      <p>
        Use the two choice tables above as the tie-breaker: among the crops you can obtain, choose the first-harvest wait and repeat burden that fit your routine before you compare sale values.
      </p>

      <h3>Choose Ancient Fruit only when the long setup and seed path fit</h3>

      <p>
        Ancient Fruit is the long-setup regrowing branch among these choices. The first harvest is after <a href="https://stardewvalleywiki.com/Ancient_Fruit">28 days</a>, followed by a harvest every <a href="https://stardewvalleywiki.com/Ancient_Fruit">7 days</a>. The seed path is not a normal shop shelf: you can receive seeds as a Museum reward after donating the Ancient Seed artifact, and you can also use a Seed Maker. The English seed page says that Ancient Seeds can be planted in the Greenhouse.
      </p>

      <p>
        That combination makes Ancient Fruit a conditional choice. Pick it when you already have the seed path and can wait for the first harvest while leaving the planting in place. Do not pick it merely because the crop name is familiar or because another player calls it the best Greenhouse crop. If the seed is not available to you, use an accessible row from the regrowing table or choose a single-harvest crop whose access and timing you can meet.
      </p>

      <p>
        The long first wait is the important trade-off. Once the first harvest arrives, the repeat cycle is clear and you do not need to replant after every harvest. If your immediate goal is to fill the Greenhouse with something you can buy or trade for now, that future persistence does not remove the Museum or Seed Maker gate.
      </p>

      <h3>Choose Starfruit when the Oasis gate and replanting trade-off fit</h3>

      <p>
        Starfruit is the single-harvest branch for a player who can use the Oasis or the Traveling Cart and is comfortable with replanting. The first harvest is after <a href="https://stardewvalleywiki.com/Starfruit">13 days</a>, and no repeat cycle is listed. The Oasis seed price is <a href="https://stardewvalleywiki.com/Starfruit_Seeds">400g</a>; the Traveling Cart range is <a href="https://stardewvalleywiki.com/Starfruit_Seeds">600–1,000g</a>. The normal crop sale is <a href="https://stardewvalleywiki.com/Starfruit">750g</a>.
      </p>

      <p>
        Use those facts as a fit test. If the Oasis is available and the replanting action is acceptable, Starfruit can be a clear single-harvest choice. If the seed source is not available, the crop sale value does not change that access problem. If you want one planting to keep producing without a new seed after every harvest, choose a regrowing crop instead.
      </p>

      <h3>Use an obtainable shop, event, or Island option when access is the constraint</h3>

      <p>
        When the ideal crop is gated, start with the candidate whose seed source you can actually use. Hops, Blueberry, and Cranberry have shop or Traveling Cart paths you can use. Their first waits and repeat intervals are different: Hops is <a href="https://stardewvalleywiki.com/Hops">11 days</a> followed by <a href="https://stardewvalleywiki.com/Hops">1 day</a>; Blueberry is <a href="https://stardewvalleywiki.com/Blueberry">13 days</a> followed by <a href="https://stardewvalleywiki.com/Blueberry">4 days</a>; Cranberry is <a href="https://stardewvalleywiki.com/Cranberries">7 days</a> followed by <a href="https://stardewvalleywiki.com/Cranberries">5 days</a>. That is enough to choose according to how soon you want the first return and how often you want to revisit the crop.
      </p>

      <p>
        Strawberry is a different kind of access decision. You can get its seeds through the Egg Festival and Desert Festival rather than a normal General Store source, with a first harvest after <a href="https://stardewvalleywiki.com/Strawberry">8 days</a> and a repeat every <a href="https://stardewvalleywiki.com/Strawberry">4 days</a>. If you already have seeds from one of those routes, its repeat pattern may fit; if you do not, choose something you can obtain rather than assuming its crop value makes it immediately available.
      </p>

      <p>
        Pineapple is an Island-gated repeat option. The first harvest is after <a href="https://stardewvalleywiki.com/Pineapple">14 days</a>, and the repeat cycle is <a href="https://stardewvalleywiki.com/Pineapple">7 days</a>. You can get seeds from the Island Trader by trading <a href="https://stardewvalleywiki.com/Pineapple_Seeds">1 Magma Cap</a>, not by paying gold. That makes it a good match only when the Island route and trade item are part of your current save.
      </p>

      <p>
        These choices can also support a small mix. For example, a player with Ancient Seeds can reserve some space for the long first wait and use an obtainable repeat crop for another part of the Greenhouse. A player without the Ancient Seed path can choose a shop-accessible crop for the immediate planting and revisit the long-setup option later. Keep the mix deliberate: every crop should have a reason tied to access, first harvest, repeat rhythm, or willingness to replant.
      </p>

      <h2>Decide whether the perimeter should contain fruit trees</h2>

      <p>
        Fruit trees are a separate choice from the crop rows. Choose no trees if you want the Greenhouse to serve only as a crop-growing space or if you do not currently have a sapling you want to grow. Choose trees when year-round fruit and a sapling access route matter to you. Use each tree’s species and access information to make that decision; it does not turn the crop choice into a universal best-tree ranking.
      </p>

      <h3>Choose no fruit trees when you do not want a tree-fruit lane</h3>

      <p>
        “No trees” is a valid planting decision. It keeps the perimeter decision out of your crop choice and avoids spending resources on a sapling whose fruit you do not want. It also leaves the crop question simple: select a repeat or single-harvest crop, then follow its first-harvest and replanting pattern.
      </p>

      <p>
        If you do want fruit, decide that separately from your crop mix. A tree’s mature fruit schedule does not make a regrowing crop unnecessary, and a crop’s direct sale value does not tell you whether a sapling is obtainable on your save. Treat tree fruit as another output you may want, not as a replacement for the harvest-pattern decision.
      </p>

      <h3>If the answer is yes, choose the tree by access and fruit preference</h3>

      <p>
        The selected trees share a common timing pattern: maturity after <a href="https://stardewvalleywiki.com/Apple">28 days</a>, followed by <a href="https://stardewvalleywiki.com/Apple_Sapling">1 fruit per day</a> in the relevant fruiting pattern. The sapling pages for these species state that a tree planted in the Greenhouse produces year-round. Use the access column beside the species; the exchange items are not gold prices.
      </p>

      <div
        aria-label="Fruit tree choice table"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Species</th>
              <th scope="col">How you can obtain the sapling</th>
              <th scope="col">Mature timing and normal fruit value</th>
              <th scope="col">Best fit for this choice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apple</td>
              <td>Pierre’s General Store for <a href="https://stardewvalleywiki.com/Apple_Sapling">4,000g</a> or Traveling Cart for <a href="https://stardewvalleywiki.com/Apple_Sapling">3,000–5,000g</a></td>
              <td><a href="https://stardewvalleywiki.com/Apple">28 days</a> to mature; <a href="https://stardewvalleywiki.com/Apple_Sapling">1 fruit per day</a>; normal fruit <a href="https://stardewvalleywiki.com/Apple">100g</a></td>
              <td>You want apples and can buy the sapling through one of the listed routes.</td>
            </tr>
            <tr>
              <td>Peach</td>
              <td>Pierre’s General Store for <a href="https://stardewvalleywiki.com/Peach_Sapling">6,000g</a> or Traveling Cart for <a href="https://stardewvalleywiki.com/Peach_Sapling">4,500–7,500g</a></td>
              <td><a href="https://stardewvalleywiki.com/Peach">28 days</a> to mature; <a href="https://stardewvalleywiki.com/Peach_Sapling">1 fruit per day</a>; normal fruit <a href="https://stardewvalleywiki.com/Peach">140g</a></td>
              <td>You want peaches and the listed sapling price fits your access.</td>
            </tr>
            <tr>
              <td>Pomegranate</td>
              <td>Pierre’s General Store for <a href="https://stardewvalleywiki.com/Pomegranate_Sapling">6,000g</a> or Traveling Cart for <a href="https://stardewvalleywiki.com/Pomegranate_Sapling">4,500–7,500g</a></td>
              <td><a href="https://stardewvalleywiki.com/Pomegranate">28 days</a> to mature; <a href="https://stardewvalleywiki.com/Pomegranate_Sapling">1 fruit per day</a>; normal fruit <a href="https://stardewvalleywiki.com/Pomegranate">140g</a></td>
              <td>You want pomegranates and can use the same shop or cart routes.</td>
            </tr>
            <tr>
              <td>Banana</td>
              <td>Island Trader for <a href="https://stardewvalleywiki.com/Banana_Sapling">5 Dragon Teeth</a> or Leo’s Desert Festival shop for <a href="https://stardewvalleywiki.com/Banana_Sapling">100 Calico Eggs</a></td>
              <td><a href="https://stardewvalleywiki.com/Banana">28 days</a> to mature; <a href="https://stardewvalleywiki.com/Banana_Sapling">1 fruit per day</a>; normal fruit <a href="https://stardewvalleywiki.com/Banana">150g</a></td>
              <td>You have the Island or Festival exchange route and want bananas.</td>
            </tr>
            <tr>
              <td>Mango</td>
              <td>Island Trader for <a href="https://stardewvalleywiki.com/Mango_Sapling">75 Mussels</a></td>
              <td><a href="https://stardewvalleywiki.com/Mango">28 days</a> to mature; <a href="https://stardewvalleywiki.com/Mango_Sapling">1 fruit per day</a>; normal fruit <a href="https://stardewvalleywiki.com/Mango">130g</a></td>
              <td>You have the Island Trader route and prefer mangoes.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The table gives a tie-breaker, not a ranking. If two saplings are equally accessible, use the fruit you actually want. If a sapling requires an exchange item you do not have, it is not your immediate tree choice. If you do not want to wait through the listed maturity period, keep the perimeter decision open and plant a crop whose access and harvest pattern you can meet now.
      </p>

      <h2>Make the final planting decision</h2>

      <h3>Ask four questions before planting</h3>

      <p>
        Can I obtain this seed or sapling now through the source shown for it? A crop or tree that is only available through a Museum reward, Oasis, Festival, Island Trader, or Traveling Cart is conditional on that route. Put the access requirement next to the crop name when you make your own list.
      </p>

      <p>
        Do I want a repeat harvest, or am I willing to replant? Ancient Fruit, Hops, Blueberry, Cranberry, Strawberry, and Pineapple keep producing on a repeat cycle. Starfruit and Sweet Gem Berry are single-harvest examples with no repeat cycle listed. Your answer determines whether the next action is another harvest or a new seed purchase.
      </p>

      <p>
        Does the first-harvest wait and repeat timing fit my routine? A short wait is not automatically better if you do not want frequent visits. A long wait is not automatically wrong if you can leave the space planted. Read the first-harvest and repeat values beside the crop, then choose the row whose return schedule you will actually follow.
      </p>

      <p>
        Am I choosing for direct crop sale, or do I have a separately verified processing reason? The information shown here covers direct crop and fruit sale values, access, and harvest timing. It does not establish a common processed-return ranking for these candidates. Do not treat a direct sale value as a processing result; verify a processing comparison separately if that is the reason for your choice.
      </p>

      <p>
        Now name the decision in one sentence. For example: “I am choosing Ancient Fruit because I have the Museum or Seed Maker path, can wait <a href="https://stardewvalleywiki.com/Ancient_Fruit">28 days</a>, and want a repeat harvest every <a href="https://stardewvalleywiki.com/Ancient_Fruit">7 days</a>.” Or: “I am choosing Starfruit because the Oasis seed costs <a href="https://stardewvalleywiki.com/Starfruit_Seeds">400g</a>, I accept the <a href="https://stardewvalleywiki.com/Starfruit">13-day</a> first wait, and I am willing to replant.” A third valid answer is: “I am choosing the repeat crop I can obtain today because its first wait and return interval fit my routine better than an inaccessible long-term option.”
      </p>

      <p>
        If you use a small mix, write the reason for each part before planting it. Keep a long-setup regrowing crop only if its seed access and wait are acceptable. Add a shop, event, or Island crop only when you can meet its access condition. Keep a single-harvest crop in the mix only when you are prepared to choose the next seed after harvest. That turns “what to grow in greenhouse Stardew” into a planting decision you can recheck from your own save.
      </p>

      <GreenhouseSources />
    </article>
  );
}
