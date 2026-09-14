import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function RancherOrTillerStardewEnglishArticle() {
  return (
    <article>
      <p>
        Tiller&apos;s 10% and Rancher&apos;s 20% multiply different goods, so the larger
        percent is not a better deal on the same items. The Farming 5 click also locks
        one Farming 10 pair: Tiller opens Artisan or Agriculturist, and Rancher opens
        Coopmaster or Shepherd. Profession sell bonuses start the next morning, and
        items shipped the day you pick do not get the new price.
      </p>
      <p>
        Name the item you actually ship, name the Farming 10 pair that click locks, then
        choose Tiller or Rancher.
      </p>

      <h2>Start from what you sell, not 20% versus 10%</h2>
      <p>Work the popup in that order.</p>
      <ol>
        <li>
          Name one shipped item. A parsnip, a raw egg, or a jar of mayonnaise is enough
          to test the method.
        </li>
        <li>
          Name the Farming 10 pair that item is buying. Parsnips buy Artisan or
          Agriculturist. Raw eggs buy Coopmaster or Shepherd. Mayonnaise buys a Rancher
          column if you stay on Rancher, or an Artisan column if you take Tiller and then
          Artisan. It does not buy both.
        </li>
        <li>Click Tiller or Rancher as the entrance to that pair.</li>
      </ol>
      <p>
        The two bonuses are not a scoreboard. They never share a stack on one item.
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Diagram of two Farming profession trees: Tiller at level 5 branches only to Artisan or Agriculturist at level 10; Rancher branches only to Coopmaster or Shepherd."
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/rancher-or-tiller-profession-tree-en.webp"
          width="1672"
        />
        <figcaption>
          Diagram, not a game screenshot. The Farming 5 click chooses the Farming 10
          pair. Tiller and Rancher do not mix, and Farming Mastery is not a third
          entrance on this chart.
        </figcaption>
      </figure>
      <p>
        The first skill-up of the day shows &quot;You&apos;ve got some new ideas to sleep
        on.&quot; Later skill-ups that same day do not repeat that message. Overnight,
        after you go to bed, a{" "}
        <a href="https://stardewvalleywiki.com/Skills">popup on the Skills page</a>{" "}
        announces the level and, at 5 and 10, asks you to pick a profession. Like new
        recipes, profession benefits are available beginning the following day. Crops or
        animal products in the shipping bin on the day of the popup still sell without
        the new price bonus. If Farming hits 5 in the afternoon, park high-value stacks
        in a chest until morning.
      </p>

      <h2>What Tiller and Rancher actually raise</h2>
      <p>
        Numbers below follow the computer wiki at{" "}
        <a href="https://stardewvalleywiki.com/Stardew_Valley_Wiki">version 1.6.15</a>.
        The percents themselves have been the current values since{" "}
        <a href="https://stardewvalleywiki.com/Farming">update 1.1</a>: Rancher +20% (it
        was +10%), Artisan +40% (it was +50%).
      </p>
      <p>
        One shipped item does not take two Farming profession columns. The gold figures
        are wiki arithmetic at normal quality. Mayonnaise at 190g × 1.2 × 1.4 would be
        319.2g; that stacked product is not a printed column. The printed alternatives
        are 228g with Rancher or 266g with Artisan. Where both of those columns show a
        number, you get the one that matches the tree you actually took.
      </p>
      <div
        aria-label="Wiki profession sell prices at normal quality"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Base</th>
              <th scope="col">Tiller (+10%)</th>
              <th scope="col">Rancher (+20%)</th>
              <th scope="col">Artisan (+40%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parsnip</td>
              <td>35g</td>
              <td>38g</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Apple</td>
              <td>100g</td>
              <td>110g</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Egg</td>
              <td>50g</td>
              <td>—</td>
              <td>60g</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Milk</td>
              <td>125g</td>
              <td>—</td>
              <td>150g</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Wool</td>
              <td>340g</td>
              <td>—</td>
              <td>408g</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Duck Feather</td>
              <td>250g</td>
              <td>—</td>
              <td>300g</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Rabbit&apos;s Foot</td>
              <td>565g</td>
              <td>—</td>
              <td>678g</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Mayonnaise</td>
              <td>190g</td>
              <td>—</td>
              <td>228g</td>
              <td>266g</td>
            </tr>
            <tr>
              <td>Cheese</td>
              <td>230g</td>
              <td>—</td>
              <td>276g</td>
              <td>322g</td>
            </tr>
            <tr>
              <td>Cloth</td>
              <td>470g</td>
              <td>—</td>
              <td>564g</td>
              <td>658g</td>
            </tr>
            <tr>
              <td>Wine</td>
              <td>400g</td>
              <td>—</td>
              <td>—</td>
              <td>560g</td>
            </tr>
            <tr>
              <td>Honey</td>
              <td>100g</td>
              <td>—</td>
              <td>—</td>
              <td>140g</td>
            </tr>
            <tr>
              <td>Truffle</td>
              <td>625g</td>
              <td>—</td>
              <td>no</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Truffle Oil</td>
              <td>1,065g</td>
              <td>—</td>
              <td>no</td>
              <td>1,491g</td>
            </tr>
            <tr>
              <td>Oil</td>
              <td>100g</td>
              <td>—</td>
              <td>—</td>
              <td>no</td>
            </tr>
            <tr>
              <td>Coffee Bean</td>
              <td>—</td>
              <td>no</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Sweet Gem Berry</td>
              <td>3,000g</td>
              <td>no</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A star on the item does not switch the profession column. Do not click Rancher
        because a crop shows gold, and do not click Tiller because an egg shows iridium.
        Quality and the profession column are separate.
      </p>
      <p>
        A gold <a href="https://stardewvalleywiki.com/Parsnip">parsnip</a> is still
        Tiller. Without Tiller, silver, gold, and iridium parsnips sell at 43g, 52g, and
        70g; with Tiller they sell at 47g, 57g, and 77g. Rancher does not appear on that
        crop at any star.
      </p>
      <p>
        A gold <a href="https://stardewvalleywiki.com/Egg">egg</a> is still Rancher.
        Without Rancher, silver, gold, and iridium eggs sell at 62g, 75g, and 100g; with
        Rancher they sell at 74g, 90g, and 120g. Tiller does not appear on the raw egg.
        If you machine that egg, you leave those raw columns and use mayonnaise&apos;s
        exclusive pair instead.
      </p>
      <p>
        Gold <a href="https://stardewvalleywiki.com/Mayonnaise">mayonnaise</a> is still
        one exclusive column, not a stack: 285g base, 342g with Rancher, or 399g with
        Artisan.
      </p>

      <h3>Raw animal products versus mayonnaise, cheese, and cloth</h3>
      <p>
        <a href="https://stardewvalleywiki.com/Skills">Rancher</a> makes animal products
        worth 20% more. <a href="https://stardewvalleywiki.com/Milk">Milk</a>,{" "}
        <a href="https://stardewvalleywiki.com/Wool">wool</a>,{" "}
        <a href="https://stardewvalleywiki.com/Duck_Feather">duck feather</a>, and{" "}
        <a href="https://stardewvalleywiki.com/Rabbit%27s_Foot">rabbit&apos;s foot</a>{" "}
        follow the same Rancher-only pattern as the egg row in the table. Tiller does
        not apply to those raw products. Artisan does not apply until milk becomes cheese
        or wool becomes cloth. Duck feather and rabbit&apos;s foot are sold as the raw
        drop; they are not crops. Cloth is not quality-tiered; it still uses one
        exclusive profession column, the same rule as mayonnaise.
      </p>
      <p>
        The level 5 description does not name{" "}
        <a href="https://stardewvalleywiki.com/Mayonnaise">mayonnaise</a>,{" "}
        <a href="https://stardewvalleywiki.com/Cheese">cheese</a>, or{" "}
        <a href="https://stardewvalleywiki.com/Cloth">cloth</a>. Sell prices on those
        item pages still list a Rancher column and an Artisan column as exclusive
        alternatives. Rancher does hit these three processed goods. The printed pair is
        in the table above. You cannot hold both Farming professions at once.
      </p>

      <h3>Vegetables, flowers, and fruit that is not foraged</h3>
      <p>
        <a href="https://stardewvalleywiki.com/Skills">Tiller</a> makes crops worth 10%
        more. The bonus applies to all vegetables and flowers, plus fruit that has not
        been foraged. A <a href="https://stardewvalleywiki.com/Parsnip">parsnip</a> is
        35g base and 38g with Tiller. Rancher does not apply to that crop.
      </p>
      <p>
        Grown flowers take Tiller. Foraged{" "}
        <a href="https://stardewvalleywiki.com/Flowers">Crocus and Sweet Pea</a> take
        Tiller too. Daffodil and Dandelion are Forage, not Flower, so they sit outside
        that flower bonus.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Fruits">Fruit</a> is a source check, not
        a &quot;I planted it&quot; check.{" "}
        <a href="https://stardewvalleywiki.com/Apple">Apple</a> from an apple tree has a
        Tiller column (100g base, 110g with Tiller).{" "}
        <a href="https://stardewvalleywiki.com/Blackberry">Blackberries picked from bushes</a>{" "}
        take Tiller. If those bush berries are stacked with ordinary foraged berries, the
        whole stack takes Tiller. Fruit from wild ground spawn, from Wild Seeds, and from
        the Farm Cave does not, including fruit-tree fruit grown in the cave.
      </p>

      <h3>Truffles, coffee beans, and sweet gem berries</h3>
      <p>
        These misses change the Farming 5 click, or they change what Artisan will
        actually pay at 10.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Truffle">Truffles</a> spawn from pigs and
        still are not animal products for Rancher. They do not get the 20%. They do take
        Gatherer and Botanist. The truffle itself sells at 625g, 781g, 937g, and 1,250g
        by quality, with no Rancher column at any of those steps.{" "}
        <a href="https://stardewvalleywiki.com/Truffle_Oil">Truffle Oil</a> takes Artisan
        (1,065g base, 1,491g with Artisan) and has no Rancher column. Without Artisan, an
        iridium truffle at 1,250g is worth more than the 1,065g oil.
      </p>
      <p>
        Pigs do not pull the Farming 5 click the way chickens do. A chicken&apos;s shipped
        item is the egg, and Rancher hits the egg. A pig&apos;s shipped item is the
        truffle, and Rancher misses it. If you want the 1,491g oil, that bonus sits on
        Artisan, which is the Tiller pair. You can still click Rancher for eggs, milk,
        and wool on a farm that also keeps pigs; do not count the truffle as a reason for
        that click. If the farm is pigs-for-oil plus kegs-for-wine, the Farming 5 click
        is Tiller, and the oil and wine use Artisan at 10. Gathering professions still
        handle the raw truffle either way.
      </p>
      <p>
        A <a href="https://stardewvalleywiki.com/Coffee_Bean">coffee bean</a> is a seed,
        not a fruit or vegetable, so Tiller does not raise the bean.{" "}
        <a href="https://stardewvalleywiki.com/Coffee">Coffee</a> from a keg is not an
        artisan good, so Artisan does not raise its 150g sell price. Do not click Tiller
        for the beans, and do not click Artisan for the drink.
      </p>
      <p>
        A <a href="https://stardewvalleywiki.com/Sweet_Gem_Berry">sweet gem berry</a> is
        a crop that is not a fruit or a vegetable. It does not take Tiller, and it cannot
        go in a keg, preserves jar, or dehydrator. A 3,000g crop can still miss the 10%.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Oil">Oil</a> is the remaining Artisan
        trap. The profession line lists oil as an example; the oil page and the Skills
        note both say it does not benefit. The sell price stays 100g. If Artisan&apos;s
        flavor text is what sold you on oil, that is not the bonus you will get.
      </p>

      <h2>This click locks your Farming 10 pair</h2>
      <p>
        Farming 10 is not a free pick from all four names. It is one profession on the
        branch you already entered, the same split as the diagram above.
      </p>

      <h3>Artisan or Agriculturist (Tiller door)</h3>
      <p>
        <a href="https://stardewvalleywiki.com/Skills">Artisan</a> makes{" "}
        <a href="https://stardewvalleywiki.com/Artisan_Goods">artisan goods worth 40% more</a>,
        except oil and coffee. Tree syrups (maple syrup, oak resin, pine tar, and
        mystic syrup) use the Tapper profession instead of Artisan.{" "}
        <a href="https://stardewvalleywiki.com/Wine">Wine</a> is the clean example: the
        bottle sells at three times the fruit&apos;s base price, then Artisan multiplies
        that bottle by 1.4. The generic wine row is 400g base and 560g with Artisan.
        Tiller does not apply to the bottle.
      </p>
      <p>
        That split is two items, not one bonus. Ship the{" "}
        <a href="https://stardewvalleywiki.com/Apple">apple</a> and Tiller applies. Keg
        the same fruit and the bottle uses Artisan, not Tiller and not Rancher. Wild{" "}
        <a href="https://stardewvalleywiki.com/Honey">honey</a> uses the Artisan column
        in the table, unlike oil.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Skills">Agriculturist</a> makes all crops
        grow 10% faster. That 10% is additive with{" "}
        <a href="https://stardewvalleywiki.com/Speed-Gro">Speed-Gro</a>: Speed-Gro alone
        is 10%, and Speed-Gro plus Agriculturist is 20%. Speed-Gro does not reduce the
        time between harvests for multi-harvest crops. That limit is Speed-Gro&apos;s, as
        written on its page.
      </p>

      <h3>Coopmaster or Shepherd (Rancher door)</h3>
      <p>
        <a href="https://stardewvalleywiki.com/Skills">Coopmaster</a> befriends coop
        animals quicker, cuts incubation time in half for the{" "}
        <a href="https://stardewvalleywiki.com/Incubator">Incubator</a>, Ostrich
        Incubator, and Slime Incubator, and improves coop product quality.{" "}
        <a href="https://stardewvalleywiki.com/Incubator">Fairy Dust does not work on incubators</a>.
        It does not cut the egg timer; Coopmaster&apos;s halved incubation time is the
        cut that profession actually makes.{" "}
        <a href="https://stardewvalleywiki.com/Skills">Shepherd</a> befriends barn
        animals quicker, makes sheep produce wool faster, and improves barn product
        quality. Sheep need a Deluxe Barn.
      </p>
      <p>
        The quality line is a hidden +0.333 on the quality score, not printed on the
        popup. Petting with Coopmaster or Shepherd on the matching animal type adds +30
        friendship instead of +15, and{" "}
        <a href="https://stardewvalleywiki.com/Animals">doubles the mood</a> from that
        pet. That is the &quot;befriend quicker&quot; line before any sell-price roll.
      </p>
      <p>
        At max friendship (1000) and max mood (255), the{" "}
        <a href="https://stardewvalleywiki.com/Farming">Farming quality table</a> puts
        iridium chance at 56.665% with no profession and 73.315% with Coopmaster or
        Shepherd on the matching animals. Gold falls from 24.556% to 19.564% and silver
        from 18.779% to 7.121% because more of the roll is iridium. The hidden quality
        still applies at the cap. Coopmaster does not raise barn iridium, and Shepherd
        does not raise coop iridium; each bonus is the matching animal type only.
      </p>
      <p>
        Shepherd&apos;s wool clock is separate from that quality roll. A sheep grows a
        coat every third day if it is fed and at least 70 happiness. At 900 or more
        friendship it drops to every other day. With Shepherd as well,{" "}
        <a href="https://stardewvalleywiki.com/Animals">that extra day comes off</a>, and
        a petted sheep at that friendship grows wool every day.
      </p>
      <p>
        Coopmaster is the pair if the farm is eggs, incubation, and coop quality.
        Shepherd is the pair if the farm is barn animals and daily wool.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Mastery_Cave">Farming Mastery</a> does not
        grant the other Farming profession. Do not delay the level 5 click in order to
        collect the other tree there. You have one Farming tree at a time unless you use
        the statue.
      </p>

      <h2>Pick from the goods you actually ship</h2>
      <p>
        Use the mix in the shipping bin, not a vague animals-versus-crops label with no
        item attached.
      </p>

      <h3>When Tiller is the click</h3>
      <p>
        Tiller is the click when the mix is crops now and artisan goods later: vegetables
        and flowers, plus fruit that takes Tiller, then wine and other artisan goods at
        10. If cheese or mayonnaise is part of that later mix, those goods use the
        Artisan column at Farming 10, not the Rancher column. That is still a Tiller
        click, because Artisan sits on the Tiller pair.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Crops">Crop gold-per-day tables</a> on the
        wiki leave out Tiller and Agriculturist. A{" "}
        <a className="blog-planner-link" href="/best-spring-crop-stardew">
          spring crop gold-per-day comparison
        </a>{" "}
        that uses those tables is a planting question, not a substitute for this
        profession click.
      </p>

      <h3>When Rancher is the click</h3>
      <p>
        Rancher is the click when the mix is raw eggs, milk, and wool, or when the reason
        for the click is the Coopmaster or Shepherd pair itself: half incubator time,
        daily wool, the hidden quality bump. Mayonnaise, cheese, and cloth can use the
        Rancher column if you stay on that tree. They can use the Artisan column if you
        took Tiller instead. They cannot use both.
      </p>
      <p>
        <a href="https://stardewvalleywiki.com/Farm_Maps">Meadowlands Farm</a> starts you
        with a coop, two chickens, 15 hay instead of 15 parsnip seeds, and blue grass.
        That is starting stock. It does not change the Farming 5 options and it does not
        change the multipliers. You can still click Tiller on Meadowlands. You can still
        click Rancher on a Standard farm.
      </p>
      <p>
        Once Tiller or Rancher is already chosen, a fan-made{" "}
        <a className="blog-planner-link" href="/#planner">
          Stardew Valley Planner
        </a>{" "}
        (not affiliated with or endorsed by ConcernedApe or Stardew Valley) can sketch
        barns, coops, or fields. It does not pick professions, water crops, or compute
        gold per day.
      </p>

      <h2>Changing the profession later</h2>
      <p>
        The reopen is the{" "}
        <a href="https://stardewvalleywiki.com/Skills">Statue of Uncertainty</a> in{" "}
        <a href="https://stardewvalleywiki.com/The_Sewers">the Sewers</a>, unlocked with
        the Rusty Key after 60 museum donations. It costs 10,000g and changes one skill.
        Only skills that already have professions appear. The miss starts when you pay at
        the statue, not at bedtime: as soon as you choose Farming to change, existing
        profession bonuses disappear. Sell-price professions do not apply to the shipping
        bin that day, and harvests that same afternoon also miss.
      </p>
      <p>
        That night the level 5 profession screen appears, then the matching level 10
        screen. You wake at full energy. The next morning&apos;s prices follow the new
        pair.
      </p>
      <p>
        At the popup, name three things: one item in the bin, the Farming 10 pair that
        click locks, and Tiller or Rancher. If you cannot name those three, do not click
        yet.
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "Should I pick Tiller or Rancher at Farming 5?",
            answer: (
              <p>
                Name what you ship. Crops, wine, and jam buy Tiller, which locks Artisan
                or Agriculturist at 10. Raw eggs, milk, and wool, or Coopmaster /
                Shepherd, buy Rancher. 20% is not automatically better than 10% because
                they multiply different goods.
              </p>
            ),
          },
          {
            question: "Does this click lock Farming 10?",
            answer: (
              <p>
                Yes. Rancher opens only Coopmaster or Shepherd. Tiller opens only Artisan
                or Agriculturist. You cannot take Rancher at 5 and Artisan at 10.
              </p>
            ),
          },
          {
            question: "Can mayonnaise take Rancher and Artisan together?",
            answer: (
              <p>
                No. Regular mayonnaise is 228g on the Rancher column or 266g on the
                Artisan column, not both. Cheese and cloth use the same exclusive pair.
              </p>
            ),
          },
          {
            question: "Do truffles get Rancher? Do Sweet Pea and Crocus get Tiller?",
            answer: (
              <p>
                Truffles miss Rancher. Truffle oil uses Artisan. Foraged Sweet Pea and
                Crocus take Tiller. Coffee beans and Sweet Gem Berries do not.
              </p>
            ),
          },
          {
            question: "Can I change later? Does Farming Mastery give the other tree?",
            answer: (
              <p>
                The Statue of Uncertainty in the Sewers costs 10,000g. That night you see
                the level 5 screen, then the matching level 10 screen. Sell-price bonuses
                miss the shipping bin the day you pay. Farming Mastery does not grant the
                other Farming profession.
              </p>
            ),
          },
          {
            question: "Does the planner pick Tiller or Rancher?",
            answer: (
              <p>
                No. It can sketch barns, coops, or fields after the profession is already
                chosen. It does not pick professions, water crops, or compute gold per
                day. The overnight popup is where you click.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        checkedLabel="Checked 2026-09-13 against Stardew Valley wiki pages listed below (1.6.15). The planner is a placement sketch, not a profession picker."
        items={[
          {
            href: "https://stardewvalleywiki.com/Skills",
            label: "Stardew Valley Wiki: Skills",
          },
          {
            href: "https://stardewvalleywiki.com/Farming",
            label: "Stardew Valley Wiki: Farming",
          },
          {
            href: "https://stardewvalleywiki.com/Artisan_Goods",
            label: "Stardew Valley Wiki: Artisan Goods",
            note: "(Artisan +40%; oil and coffee excepted)",
          },
          {
            href: "https://stardewvalleywiki.com/Mayonnaise",
            label: "Stardew Valley Wiki: Mayonnaise",
            note: "(190g → Rancher 228g / Artisan 266g)",
          },
          {
            href: "https://stardewvalleywiki.com/Cheese",
            label: "Stardew Valley Wiki: Cheese",
          },
          {
            href: "https://stardewvalleywiki.com/Cloth",
            label: "Stardew Valley Wiki: Cloth",
          },
          {
            href: "https://stardewvalleywiki.com/Egg",
            label: "Stardew Valley Wiki: Egg",
          },
          {
            href: "https://stardewvalleywiki.com/Milk",
            label: "Stardew Valley Wiki: Milk",
          },
          {
            href: "https://stardewvalleywiki.com/Truffle",
            label: "Stardew Valley Wiki: Truffle",
            note: "(no Rancher)",
          },
          {
            href: "https://stardewvalleywiki.com/Truffle_Oil",
            label: "Stardew Valley Wiki: Truffle Oil",
            note: "(Artisan column only)",
          },
          {
            href: "https://stardewvalleywiki.com/Flowers",
            label: "Stardew Valley Wiki: Flowers",
          },
          {
            href: "https://stardewvalleywiki.com/Fruits",
            label: "Stardew Valley Wiki: Fruits",
          },
          {
            href: "https://stardewvalleywiki.com/Coffee_Bean",
            label: "Stardew Valley Wiki: Coffee Bean",
          },
          {
            href: "https://stardewvalleywiki.com/Sweet_Gem_Berry",
            label: "Stardew Valley Wiki: Sweet Gem Berry",
          },
          {
            href: "https://stardewvalleywiki.com/Oil",
            label: "Stardew Valley Wiki: Oil",
          },
          {
            href: "https://stardewvalleywiki.com/Honey",
            label: "Stardew Valley Wiki: Honey",
          },
          {
            href: "https://stardewvalleywiki.com/Wine",
            label: "Stardew Valley Wiki: Wine",
          },
          {
            href: "https://stardewvalleywiki.com/The_Sewers",
            label: "Stardew Valley Wiki: The Sewers",
            note: "(Statue of Uncertainty, 10,000g)",
          },
          {
            href: "https://stardewvalleywiki.com/Mastery_Cave",
            label: "Stardew Valley Wiki: Mastery Cave",
          },
          {
            href: "https://stardewvalleywiki.com/Farm_Maps",
            label: "Stardew Valley Wiki: Farm Maps",
          },
          {
            href: "https://stardewvalleywiki.com/Incubator",
            label: "Stardew Valley Wiki: Incubator",
          },
          {
            href: "/#planner",
            label: "Stardew Valley Planner",
          },
        ]}
      />
    </article>
  );
}
