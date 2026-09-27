import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function OakTreeVsMapleEnglishSources() {
  return (
    <BlogSources
      heading="Sources"
      items={[
        {
          href: "https://stardewvalleywiki.com/Oak_Tree",
          label: "Oak Tree on the Stardew Valley Wiki",
          note: ": grows from an Acorn; 7 days with an ordinary Tapper and 3 days with a Heavy Tapper; fall change outside Pelican Town and the Greenhouse unless a Tapper is on the tree; an oak outside the farm, but not in Pelican Town, can be chopped or tapped; this page does not replace the Acorn by season.",
        },
        {
          href: "https://stardewvalleywiki.com/Maple_Tree",
          label: "Maple Tree on the Stardew Valley Wiki",
          note: ": grows from a Maple Seed; 9 days with an ordinary Tapper and 4 days with a Heavy Tapper; a shake on Fall 14–28 drops a Hazelnut instead of a Maple Seed; the same fall change as the oak page; a maple outside the farm, but not in Pelican Town, can be chopped or tapped.",
        },
        {
          href: "https://stardewvalleywiki.com/Trees",
          label: "Trees on the Stardew Valley Wiki",
          note: ": stage 5 can be shaken, tapped, or chopped; Wood 12–16 and the listed modifiers; Sap 5; chop seed count 0–2 at Foraging level 1 or higher; that count is not stated for a shake; shake seeds can drop immediately after the level-up, while chop seeds wait until you sleep and see the level-up; maple shake in the last two weeks of fall, with no dates printed; a Tapper blocks the chop and the seed shake until removed; a moss shake is not documented as a seed drop; the 1.6 history line for the fall change; Pine Cone, Pine Tar, mahogany sap, and mahogany hardwood only as names that are not this pair.",
        },
        {
          href: "https://stardewvalleywiki.com/Tapper",
          label: "Tapper on the Stardew Valley Wiki",
          note: ": Oak Resin in 7 Nights and Maple Syrup in 9 Nights; winter production continues on oak and maple; a Tapper cannot go on a fruit tree; remove it with one axe or pickaxe hit and the Tapper remains; lightning or a bomb destroys it and its contents; recipe listed at Foraging level 4, with a 1.6 history line from level 3.",
        },
        {
          href: "https://stardewvalleywiki.com/Heavy_Tapper",
          label: "Heavy Tapper on the Stardew Valley Wiki",
          note: ": Oak Resin in 3 Nights and Maple Syrup in 4 Nights; twice the speed does not replace the 3 Night and 4 Night waits; winter production continues on oak and maple; bugs note on the fall green-rain change; 1.6 history fixes heavy tappers turning normal trees into mushroom trees and does not say the green-rain bug was fixed; the lightning sentence on that page does not mention bombs.",
        },
        {
          href: "https://stardewvalleywiki.com/Oak_Resin",
          label: "Oak Resin on the Stardew Valley Wiki",
          note: ": 7 days or 3 days; not edible; Keg and Deluxe Speed-Gro ingredients and Farming level 8; Enchanter’s Bundle; Exotic Foraging as an option; Haunted Skull at 1.30 percent; Wood Chipper at 0.66 percent.",
        },
        {
          href: "https://stardewvalleywiki.com/Maple_Syrup",
          label: "Maple Syrup on the Stardew Valley Wiki",
          note: ": 9 days or 4 days; Energy 50 and Health 22; Bee House and Maple Bar ingredients; Chef’s Bundle; Exotic Foraging as an option; Wood Chipper at 0.66 percent.",
        },
        {
          href: "https://stardewvalleywiki.com/Acorn",
          label: "Acorn on the Stardew Valley Wiki",
          note: ": the item name, the Foraging level 1 shake or chop drop, and Field Snack using one Acorn together with a Maple Seed and a Pine Cone; a Mystic Tree Seed recipe on that page also uses an Acorn and a Maple Seed.",
        },
        {
          href: "https://stardewvalleywiki.com/Maple_Seed",
          label: "Maple Seed on the Stardew Valley Wiki",
          note: ": the item name, the same Foraging level 1 drop, and Field Snack as on the Acorn page.",
        }
      ]}
    />
  );
}

export function OakTreeVsMapleStardewEnglishArticle() {
  return (
    <article>
      <p>
        On a mature tree, an Acorn or Oak Resin means the tree is an oak, and a Maple Seed or Maple Syrup means the tree is a maple. The mature wood drop follows the same rule on both, Wood 12–16, so the wood pile does not choose. Next, read the product if a Tapper or a Heavy Tapper is already on the tree; otherwise shake or chop once and read the seed.
      </p>

      <h2>Match the seed name and the product name before you act</h2>

      <p>
        An <a href="https://stardewvalleywiki.com/Oak_Tree">oak tree</a> grows from an Acorn. A <a href="https://stardewvalleywiki.com/Maple_Tree">maple tree</a> grows from a Maple Seed. Those two sentences are the name chains. Oak Resin belongs on the oak side of the chain. Maple Syrup belongs on the maple side. If the item is already in your hand, the name printed on that item finishes the identification of the item. An Acorn in a pocket is an Acorn. A Maple Seed in a pocket is a Maple Seed. That easy case does not reach across the grove and name a standing tree you have not checked. A standing tree with no product and no seed from that tree is the rest of this check.
      </p>

      <p>
        Hold the two chains side by side before you shake, chop, or trust a machine that is already attached. You are matching names, not scoring the trees. The oak chain is Oak Tree, Acorn, Oak Resin. The maple chain is Maple Tree, Maple Seed, Maple Syrup. A shared kind of drop, wood from a mature chop, sits outside both chains. Wood can be in your inventory after the chop and still leave the species unnamed.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Watercolor of an acorn, a jar of dark resin, and a wooden bucket beside a maple seed, a jar of golden syrup, and a second bucket. Labels read Oak Tree, Acorn, Oak Resin, 7 nights, 7 days, Heavy Tapper 3, and Wood 12–16 opposite Maple Tree, Maple Seed, Maple Syrup, 9 nights, 9 days, Heavy Tapper 4, and Wood 12–16. The note says the chop seed count 0–2 at Foraging level 1 or higher is not a shake count."
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/oak-tree-vs-maple-stardew-en-names.webp"
          width={1672}
        />
        <figcaption>
          Figure: The seed name or the product name separates the trees. Wood 12–16 does not. Nights on the Tapper table and days on the tree and item pages are the same wait, not a second wait.
        </figcaption>
      </figure>

      <p>
        The chart is an explanatory figure, not a screenshot from a save. Read it as a name table. Seven and nine are the two species, not a range you are allowed to treat as one timer, and not two numbers you add. Oak Resin is the 7. Maple Syrup is the 9. On the <a href="https://stardewvalleywiki.com/Tapper">Tapper page</a>, the product table says Oak Resin in 7 Nights and Maple Syrup in 9 Nights. On the Oak Tree page and the <a href="https://stardewvalleywiki.com/Oak_Resin">Oak Resin page</a>, the same oak count is written as 7 days. On the Maple Tree page and the <a href="https://stardewvalleywiki.com/Maple_Syrup">Maple Syrup page</a>, the same maple count is written as 9 days. The <a href="https://stardewvalleywiki.com/Trees">Trees page</a> repeats those day counts for the two trees. Nights and days are the same wait. You do not wait 7 Nights and then another 7 days. You do not wait 9 Nights and then another 9 days. You do not slide the oak wait toward 9, or the maple wait toward 7, because both numbers appear on one chart.
      </p>

      <p>
        The Heavy Tapper row is a different machine, and it is still a name row. Oak Resin on a Heavy Tapper is 3 Nights on the <a href="https://stardewvalleywiki.com/Heavy_Tapper">Heavy Tapper page</a>, and 3 days on the Oak Resin page. The Oak Tree page agrees with 3. Maple Syrup on a Heavy Tapper is 4 Nights on the Heavy Tapper page, and 4 days on the Maple Syrup page. The Maple Tree page agrees with 4. Three and four are the two printed heavy counts. They are not a span. The next section says what to do with “twice the speed” beside those counts. The chart does not ask you to correct them.
      </p>

      <p>
        The bottom row is the negative check. Both columns say Wood 12–16 because a mature oak and a mature maple use one wood rule. A pile that lands in that band fits both columns, so it selects neither. On a chop, the Trees page lists the seed as 0–2 at Foraging level 1 or higher. It does not give a shake that count. No seed, from either action, chooses a column.
      </p>

      <p>
        When the check has named an oak, the matching page is the <a className="blog-planner-link" href="/oak-tree-stardew">oak tree guide</a>. When the check has named a maple, the matching page is the <a className="blog-planner-link" href="/maple-tree-stardew">maple tree guide</a>.
      </p>

      <h2>Read the product when a Tapper is already on the tree</h2>

      <p>
        Start here when a machine is already attached. That is the case where chopping first would throw away the label you already have.
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="Watercolor of an oak and a maple in a farm grove, each with a wooden bucket. Acorns lie by the oak. Maple seeds and a hazelnut lie on the path. The note says: if the tree is not mature, stop; if a Tapper or Heavy Tapper is on it, Oak Resin means oak and Maple Syrup means maple; below Foraging 1 a missing seed does not name the tree; otherwise shake once or chop once, Acorn means oak and Maple Seed means maple; no seed and Wood 12–16 do not name the tree; a hazelnut from a shake is not an oak result."
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/oak-tree-vs-maple-stardew-en-check.webp"
          width={1672}
        />
        <figcaption>
          Figure: Use the product when a Tapper or Heavy Tapper is already on the tree. Otherwise shake once or chop once. An empty seed result is not the other species.
        </figcaption>
      </figure>

      <p>
        The flowchart is an explanatory figure, not a screenshot. It is the order of checks. The first split is maturity. The Trees page calls the mature stage stage 5 and says that stage can be shaken, tapped, or chopped. If the tree is not at that stage, stop. This check does not identify an immature sapling. The second split is the machine. If a Tapper or a Heavy Tapper is already on the mature tree, read the product and do not shake or chop for a seed until you remove the machine. Oak Resin means oak. Maple Syrup means maple. The lower splits, Foraging level, one shake or one chop, an empty seed, Wood 12–16, and a Hazelnut, are the path when nothing is tapped. Those branches are the next section. A Hazelnut from a shake is not an oak result. On Fall 14 through Fall 28, the Maple Tree page says the shake drops a Hazelnut. The Trees page only says the last two weeks of fall and gives no dates.
      </p>

      <h3>An ordinary Tapper: the product name is the species</h3>

      <p>
        When the tree is mature and the machine on it is an ordinary Tapper, wait until that Tapper has an item, then read the item name. Do not shake the tree for a seed while that Tapper is still attached, and do not chop it to learn the species.
      </p>

      <p>
        Oak Resin identifies an oak. Maple Syrup identifies a maple. The Tapper table’s 7 Nights is the oak product. The Oak Tree page and the Oak Resin page write that same oak count as 7 days. The Tapper table’s 9 Nights is the maple product. The Maple Tree page and the Maple Syrup page write that same maple count as 9 days. You wait once. Do not add a Nights wait on top of a days wait. The count tells you which row you are on. The item name tells you the species. A count without a readable item does not finish the job, because 7 and 9 do not help if the product was destroyed before you read it.
      </p>

      <p>
        Winter does not rename the liquid. The Tapper page says a Tapper on an oak or a maple keeps producing in winter. Winter on both trees does not show that one species stopped, and it does not move Oak Resin onto a maple or Maple Syrup onto an oak. You still read the item name. Season is not a substitute for that name.
      </p>

      <p>
        While the Tapper is attached, the Trees page says you cannot chop the tree, and you cannot shake it for a seed, until you remove the Tapper. Removal is one hit with an axe or a pickaxe. The Tapper remains. That hit is how you take the machine off. It is not how you discover the species if the product was already readable, and it is not the same event as a destroyed machine. After a clean removal you still have the Tapper. If you already read Oak Resin or Maple Syrup, you already have the species. A later seed is a second check, not a requirement.
      </p>

      <p>
        A mossy tree is a narrow exception to “do not shake.” The Trees page says you may shake a mossy tree with a scythe or a weapon without taking the Tapper off. That sentence does not say the shake drops an Acorn or a Maple Seed. Do not treat a moss shake as the identifying seed drop. If the shake shows no seed, the empty result still does not name the tree. The product already due in the Tapper is the check that names it.
      </p>

      <p>
        Lightning or a bomb destroys an ordinary Tapper and what is inside it. If the machine is gone and you never read the item, that absence is lost evidence. It is not a species. A missing Tapper does not mean the tree was the other one. You do not fill the gap by deciding the destroyed contents “would have been” Maple Syrup or Oak Resin. If the tree is still there and nothing is tapped anymore, you leave this branch and use one shake or one chop under the seed rules. Until that seed appears, the tree stays unnamed.
      </p>

      <p>
        Demonstration A is an example, not a play record. The inputs are invented: one mature tree, an ordinary Tapper already on it, and the item that appears is Oak Resin. The visible result is the item name Oak Resin. Conclusion: that tree is an oak. 7 Nights and 7 days are the same oak wait, not a second tree. What the result does not prove: it does not name any neighboring tree, it does not say what a moss shake would drop, and it does not survive if lightning or a bomb destroys the Tapper before you read it. If the item is gone unread, Demonstration A’s conclusion does not apply.
      </p>

      <p>
        Crafting the Tapper is not this check. The Tapper page lists the recipe at Foraging level 4. Its history records a 1.6 change: the recipe became Foraging level 4, and it had been Foraging level 3. That history line records the recipe change. It does not say that a Tapper you already own is checked against Foraging level again when you place it. If the machine is already on the tree, placement level is not the question. The product name is the question.
      </p>

      <h3>A Heavy Tapper: keep 3 and 4 as printed</h3>

      <p>
        When the machine already on the mature tree is a Heavy Tapper, read the next item the same way. Do not convert the ordinary counts into the heavy counts by dividing.
      </p>

      <p>
        The Heavy Tapper table says Oak Resin in 3 Nights and Maple Syrup in 4 Nights. The Oak Resin page says 3 days for the heavy machine. The Maple Syrup page says 4 days. The Oak Tree page and the Maple Tree page agree with 3 and 4. Three Nights and 3 days are the same oak wait. Four Nights and 4 days are the same maple wait. You do not add a Nights wait to a days wait. Oak Resin from this machine still means oak. Maple Syrup from this machine still means maple. The machine changed the printed count. It did not change the name chain.
      </p>

      <p>
        The Heavy Tapper page says the Heavy Tapper works at twice the speed of an ordinary Tapper. The same pages print 3 next to 7 for Oak Resin and 4 next to 9 for Maple Syrup. Twice the speed does not turn those waits into 6, 3.5, or 4.5. The heavy waits you use are 3 for Oak Resin and 4 for Maple Syrup. Oak Resin still means oak. Maple Syrup still means maple.
      </p>

      <p>
        Winter still does not change the name. The Heavy Tapper page, like the Tapper page, says production continues in winter on an oak and on a maple. A Heavy Tapper that fills in winter is not evidence that the tree switched species, and a winter date is not evidence that one of the two species stopped.
      </p>

      <p>
        Demonstration B is an example, not a play record. The inputs are invented: a Heavy Tapper on a mature tree, and the next item is Maple Syrup. Conclusion: that tree is a maple. You can call the interval 4 Nights or 4 days. That is the same heavy maple wait. What the result does not prove: twice the speed does not turn 9 into 4.5, it does not name a second tree that has no machine, and it does not say the Heavy Tapper and an ordinary Tapper behave the same way in the fall change. A Heavy Tapper is not the same fall case as an ordinary Tapper. That difference is in the last section.
      </p>

      <p>
        The ordinary Tapper page says lightning or a bomb destroys the Tapper and its contents. The Heavy Tapper page’s lightning sentence does not add bombs. Do not treat a bomb as part of that Heavy Tapper sentence. That page does not say a bomb destroys a Heavy Tapper.
      </p>

      <h2>With no Tapper, shake once or chop once and read the seed</h2>

      <p>
        Use this section when the flowchart’s tapper split is “no.” Nothing is attached, so there is no Oak Resin or Maple Syrup to read. The check is one shake or one chop on the mature tree you might act on, then the seed name.
      </p>

      <p>
        Run that check on the one tree you are about to tap or chop. Leaving the rest of the grove standing is advice, so you do not disturb trees you have not decided to touch. It is not a hidden rule that forbids a later check on another tree. It is also not a reason to skip the seed on this tree. The flowchart already says an empty result is not the other species. Advice about the grove does not create a second way to name the tree.
      </p>

      <h3>Foraging level, and what a drop of nothing means</h3>

      <p>
        A seed you can trust requires a mature tree, nothing tapped, and Foraging level 1 or higher. Shake once or chop once. The <a href="https://stardewvalleywiki.com/Acorn">Acorn page</a> and the <a href="https://stardewvalleywiki.com/Maple_Seed">Maple Seed page</a> both tie that drop to Foraging level 1, by shaking or chopping the matching tree. The Trees page states the same gate. An oak can drop an Acorn. A maple can drop a Maple Seed. On a chop, the seed count is 0–2. That count is not stated for a shake.
      </p>

      <p>
        When a seed drops, the item name is the species. An Acorn means oak. A Maple Seed means maple. When no seed drops, this attempt did not name the tree. An empty shake from someone already at that level is still not the other species. You do not turn the empty ground into Oak Resin, Maple Syrup, or the seed you hoped for.
      </p>

      <p>
        Below Foraging level 1, the gate itself blocks the seed. A shake or a chop that shows nothing does not name the tree. It also does not tell you what that same tree will drop after the level changes. The Trees page separates the two actions at the moment you reach the level. After the Foraging level-up, seeds from a shake can drop immediately. Seeds from a chop wait until you sleep and see the level-up. Do not treat those timings as one rule. A chop taken before that sleep can show no seed because of the timing, and that empty chop still does not choose oak or maple. A shake after the level-up is allowed to drop a seed at once.
      </p>

      <p>
        Demonstration F is an example, not a play record. The inputs are invented: Foraging below 1, one shake, no seed. Conclusion: the tree is unnamed. What the result does not prove: it does not prove the tree is an oak, it does not prove the tree is a maple, and it does not become a name if you repeat the shake while you are still below level 1. After you reach level 1, use the shake timing or the chop timing above. Until a seed or a tapper product appears, the unnamed result stands.
      </p>

      <p>
        The tree in this section has to be mature. Stage 5, on the Trees page, is the stage that can be shaken, tapped, or chopped. If the tree is not at the stage the page describes as ready for those actions, stop. The check does not identify an immature sapling. If the game will not accept a Tapper on the tree, do not decide that the refusal means “the other one” of oak and maple. The last section lists other reasons a Tapper is refused.
      </p>

      <h3>A chop uses the same wood rule on both trees</h3>

      <p>
        When you chop a mature tree, separate the wood from any seed. The Trees page, excluding mahogany, gives Wood 12–16. The Trees page says the possible 4 bonus pieces of wood are randomly added, based on luck and Foraging level. Forester adds 25 percent, and the page states that amount as 15–20. Woody’s Secret gives a 5 percent chance to double the wood. Sap is 5. The Lumberjack profession can add a random hardwood. Every one of those modifiers is the same rule on an oak and on a maple. None of them prints the species.
      </p>

      <p>
        A hardwood piece from that profession does not turn the tree into a mahogany tree. Sap 5 does not choose a column on the name chart. A doubled wood pile is still the shared wood rule. A total that includes the extra pieces from luck, Foraging level, or Forester is still the shared rule. You can see a large stack and know only that the chop paid wood under one rule. The identifying drop, if it happens, is the seed: an Acorn at 0–2, or a Maple Seed at 0–2. If the seed count is zero, the wood numbers have nothing left to match.
      </p>

      <p>
        Demonstration D is an example, not a play record. The inputs are invented: one chop, 14 wood, and 0 seeds. Fourteen sits inside Wood 12–16, the band the Trees page gives both species. Call this a demonstration pile. Conclusion: this chop did not name the tree. What the result does not prove: it does not prove the tree is an oak, it does not prove the tree is a maple, and it does not show that one of the two species gives more wood. The same 14 would fit the shared band on either tree. If the pile had included one Acorn, the Acorn would have named an oak and the 14 would still have been the shared wood rule. This example has no seed, so there is no name.
      </p>

      <p>
        Demonstration C is an example, not a play record. The inputs are invented: Foraging at or above 1, a date that is not inside Fall 14–28 and is not in the last two weeks of fall, one shake, and a Maple Seed. The tree is still standing because a shake is not a chop. Conclusion: that tree is a maple. What the result does not prove: it does not promise that the next shake drops another seed. It does not name any other tree. It does not use the wood rule at all, because you did not chop. The date is outside Fall 14–28 and outside the last two weeks of fall, so this shake does not test the Hazelnut case.
      </p>

      <h3>A fall shake of a maple is not one date range</h3>

      <p>
        This drop rule is for a shake, not a chop. Do not extend it to chopping. If you chop, go back to the seed and wood rules above. Do not import a Hazelnut into the chop because the date feels like fall.
      </p>

      <p>
        The Maple Tree page says that on Fall 14–28, a shaken mature maple drops a Hazelnut instead of a Maple Seed. The Trees page says a shaken maple does this in the last two weeks of fall, and that page prints no dates. Fall 14 is inside Fall 14–28. The Trees page does not say whether Fall 14 is included. A Hazelnut on that shake is the maple result. It is not an oak, and it is not a Maple Seed. If you needed the seed itself, that shake did not give it to you. The tree is still a maple.
      </p>

      <p>
        Demonstration E is an example, not a play record. The inputs are invented: a shake on Fall 14. Fall 14 is a date the Maple Tree page includes in Fall 14–28. This example does not claim the Trees page confirmed Fall 14, because the Trees page does not print a date. The visible result is a Hazelnut and no Maple Seed. Conclusion: the shake dropped a Hazelnut, and the tree is still a maple. What the result does not prove: it does not prove that “the last two weeks of fall” is the same set of days as Fall 14–28. It does not prove a chop on Fall 14 would drop a Hazelnut. It does not prove an oak, because an oak shake is not given this replacement. If you needed a Maple Seed, the shake did not hand you that item. The species is not flipped to fill the gap.
      </p>

      <h2>Match a recipe only to the product you already needed</h2>

      <p>
        Use this section only when you arrived with a recipe in mind. You bring the target. The names above match it to a tree. The section does not choose a target for you, does not tell you which tree to keep, and does not turn a farming-level gate into a species.
      </p>

      <p>
        Farming level 3 on the Bee House, and Farming level 8 on the Keg and on Deluxe Speed-Gro, are gates on those recipes. A lower gate does not choose the tree in front of you. A higher gate does not choose it either. You do not keep a maple until Farming level 8 because the Keg waits, and you do not prefer a maple because the Bee House opens earlier. If you needed a product, match that product. If you did not need one, stop at the species name and do not borrow a recipe as a reason.
      </p>

      <p>
        The Keg is the resin target on the Oak Resin page: Wood 30, Copper Bar 1, Iron Bar 1, Oak Resin 1, and Farming level 8. The product that satisfies the resin line is Oak Resin, which the name chain ties to an oak. A Maple Seed does not substitute for that Oak Resin. Maple Syrup does not substitute for it either.
      </p>

      <p>
        Demonstration G is an example, not a play record. The inputs are invented: you needed that Keg, and the shake produced a Maple Seed. The visible result is a Maple Seed, so the tree you shook is a maple. Conclusion: it is the wrong tree for that Keg. What the result does not prove: it does not say the maple should be chopped because it failed the recipe, and it does not say a different recipe would have been the right target. You needed Oak Resin. This tree offered a Maple Seed. Those are different names.
      </p>

      <p>
        Deluxe Speed-Gro is the other resin recipe on the same page: Oak Resin 1, Bone Fragment 5, and Farming level 8. The resin line is again Oak Resin, so the matching tree is an oak once a check has produced an Acorn or Oak Resin. A maple product does not fill the Oak Resin line. The Bone Fragment count is part of the recipe. It is not a count of trees.
      </p>

      <p>
        The Bee House is the syrup target on the Maple Syrup page: Wood 40, Coal 8, Iron Bar 1, Maple Syrup 1, and Farming level 3. The syrup line is Maple Syrup, which the name chain ties to a maple. Oak Resin does not fill it. The Keg and the Bee House stay different recipes. Matching one machine does not satisfy the other.
      </p>

      <p>
        Demonstration H is an example, not a play record. The inputs are invented: you needed that Bee House, and the Tapper product on the tree is Oak Resin. Conclusion: it is the wrong tree for that Bee House, because Oak Resin names an oak and the recipe asks for Maple Syrup. What the result does not prove: it does not rank the Bee House against the Keg, and it does not say the oak is a failed tree in general. It says this product is not the product that recipe uses.
      </p>

      <p>
        Maple Bar, on the Maple Syrup page, uses Maple Syrup 1, Sugar 1, and Wheat Flour 1. If you needed a Maple Bar, the tapper or the tree you want is the one that produces Maple Syrup, which is a maple. An Acorn or Oak Resin does not enter that recipe. The recipe match ends at those three ingredients.
      </p>

      <p>
        The Enchanter’s Bundle asks for Oak Resin. The Chef’s Bundle asks for Maple Syrup. If the bundle in front of you names one of those, match that name and then use the check. Oak Resin is the oak product. Maple Syrup is the maple product. The Exotic Foraging Bundle is different: it can take either. An option that accepts both does not tell you which tree you are facing, and it does not tell you which one to tap.
      </p>

      <p>
        Demonstration I is an example, not a play record. The input is the Exotic Foraging option, which can take Oak Resin or Maple Syrup. Conclusion: that option does not identify the tree and does not choose one. What the result does not prove: it does not prove the standing tree is an oak, it does not prove it is a maple, and it does not authorize a choice you did not already have. You still need an Acorn, a Maple Seed, Oak Resin, or Maple Syrup from the check. The bundle option is not that check.
      </p>

      <p>
        Field Snack uses one Acorn, one Maple Seed, and one Pine Cone. A mystic tree seed recipe also consumes both an Acorn and a Maple Seed among its ingredients. A recipe that asks for both seeds is not a vote for one standing tree. It spends seeds you already have. It does not say which mature tree in the grove should be tapped or chopped. Reading the snack’s ingredient list is not a substitute for shaking, chopping, or reading a Tapper.
      </p>

      <p>
        An item already in a chest is not the tree. Maple Syrup is edible. The Maple Syrup page lists Energy 50 and Health 22. Oak Resin is not edible. A stack that matches the edible syrup, or a stack that matches the inedible resin, identifies the item in hand. It does not identify which standing tree produced it. The Oak Resin page also lists other sources: a Haunted Skull at 1.30 percent, and a Wood Chipper at 0.66 percent. The Maple Syrup page lists a Wood Chipper at 0.66 percent. A resin or a syrup from those sources can sit in a chest while the tree outside is still unchecked. Use the chest to name the item. Use the Tapper product, or one seed from that tree, to name the tree.
      </p>

      <h2>Stop when the check fails or the tree is no longer oak or maple</h2>

      <p>
        If the shake result was a Hazelnut, use the fall dates in the section above.
      </p>

      <p>
        Zero seeds, already a result in the shake-or-chop section, get one recheck and then a stop. Do not assign the other species. Do not chop the next tree to force a name. An empty attempt is the end of the attempt. A neighbor is a different tree and needs its own check, only if you meant to act on that neighbor. It is not a backup label for the tree that gave you nothing.
      </p>

      <p>
        A Tapper that will not attach does not mean “this is the other of oak and maple.” The tree can be immature, and an immature sapling is outside the stage 5 check. The tree can be a fruit tree: the Tapper page says a Tapper cannot be placed on a fruit tree. The tree can be a green rain tree of type 1 or type 2. Those two types cannot take a Tapper. Any of those refusals leaves the oak-versus-maple name unset. You do not flip the label because the machine bounced off.
      </p>

      <p>
        The Oak Tree, Maple Tree, and Trees pages say an oak or a maple that is not in Pelican Town or the Greenhouse may become a green rain tree in fall and will not return to normal until the next spring. Those pages say a tree with a Tapper does not make that change. Their 1.6 history lines only say these trees can turn into green rain trees and lose their leaves in fall. Those history lines do not add the town, Greenhouse, spring, or Tapper limits. The Heavy Tapper page’s bugs note says an oak or a maple with a Heavy Tapper, rather than an ordinary Tapper, can still change, and that this was meant to happen only on a tree with no Tapper. An ordinary Tapper, on the oak, maple, and Trees pages, stops the change. A Heavy Tapper, on that bugs note, may not.
      </p>

      <p>
        The Heavy Tapper page’s 1.6 history says a different bug was fixed: Heavy Tappers turning normal trees into mushroom trees. That history does not say the green rain bug was fixed. A mushroom tree and a green rain tree are two results. The bugs note is what can happen with a Heavy Tapper. The oak, maple, and Trees pages are what happens with an ordinary Tapper.
      </p>

      <p>
        Demonstration J is an example, not a play record. The inputs are invented: fall, outside Pelican Town and the Greenhouse, a Heavy Tapper on the tree, and the standing tree changes into a green rain tree. The item you already collected keeps the name it had. If that item was Oak Resin, it is still Oak Resin. If it was Maple Syrup, it is still Maple Syrup. The standing tree is not relabeled as the other of oak and maple. It is a green rain tree for this check. What the result does not prove: it does not prove an ordinary Tapper would have allowed the same change, because the oak, maple, and Trees pages say a tree with a Tapper does not change. It does not prove the green rain bug was fixed. If the changed tree is type 3, it is tapped for a fiddlehead fern, an ordinary Tapper every 2 days and a Heavy Tapper every 1 day, not for Oak Resin or Maple Syrup. A fiddlehead fern does not complete either name chain. Types 1 and 2 cannot take a Tapper, so a refusal there is still not the other species.
      </p>

      <p>
        A Pine Cone, or the product Pine Tar, names a pine, a third common tree, and that path is the <a className="blog-planner-link" href="/pine-tree-stardew">pine tree guide</a>. A mahogany tree is tapped for sap and chopped for hardwood, not for the oak and maple wood line, and a fruit tree is not this pair and cannot take a Tapper. Both of those sit outside this check, on the <a className="blog-planner-link" href="/stardew-valley-trees">trees guide</a>.
      </p>

      <p>
        The Oak Tree and Maple Tree pages say an oak or a maple outside the farm, but not in Pelican Town, can be chopped or tapped. If the game will not allow the chop or the tap, the check stops. You do not invent a species from a refused action. A tree in the Greenhouse is outside the fall green-rain change.
      </p>

      <p>
        On the next tree, repeat this pass.
      </p>

      <ul>
        <li>Use a mature tree, the stage the Trees page calls stage 5.</li>
        <li>If a Tapper or a Heavy Tapper is on it, read the product name, and do not shake or chop for a seed until that machine is removed.</li>
        <li>If nothing is tapped, shake once or chop once only when Foraging is level 1 or higher.</li>
        <li>An Acorn or Oak Resin means oak.</li>
        <li>A Maple Seed or Maple Syrup means maple.</li>
        <li>Wood in the 12–16 band does not mean a species, and the shared modifiers do not mean one either.</li>
        <li>A Hazelnut on a fall shake is the maple result, not an oak.</li>
        <li>Zero seeds means you stop, and you do not chop a neighbor to force a name.</li>
        <li>A green rain tree, a pine, a mahogany tree, or a fruit tree is not the other name in this pair.</li>
      </ul>

      <OakTreeVsMapleEnglishSources />
    </article>
  );
}
