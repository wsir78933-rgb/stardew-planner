import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const VANILLA_NPC_GUIDE_HREF = "/stardew-valley-npc";
const CARPENTER_HREF = "/carpenter-stardew";
const PLANNER_HREF = "/#planner";

type SveMarriageGroupRow = Readonly<{
  group: string;
  count: string;
  names: ReactNode;
}>;

type SveAccessGateRow = Readonly<{
  candidate: string;
  appearsInPelicanTown: string;
  gateToClear: ReactNode;
}>;

type SveStarterGiftRow = Readonly<{
  candidate: string;
  birthday: string;
  starterLovedGifts: string;
  fastNote: string;
}>;

export function StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle() {
  return (
    <article>
      <SveMarriageLead />
      <SveMarriageQuickList />
      <SveMarriageListScope />
      <SveBachelorettes />
      <SveBachelors />
      <SveTownAccessGates />
      <SveStarterLovedGifts />
      <SveDatingAndMarriageRules />
      <SveFarmPlanningAfterChoice />
      <SveMarriageFaq />
      <SveMarriageSources />
    </article>
  );
}

function VanillaNpcGuideLink({ children }: Readonly<{ children: ReactNode }>) {
  return <a href={VANILLA_NPC_GUIDE_HREF}>{children}</a>;
}

function PlannerCtaLink({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <a className="blog-planner-link" href={PLANNER_HREF}>
      {children}
    </a>
  );
}

function SveMarriageTableScroll({
  accessibleName,
  children,
}: Readonly<{
  accessibleName: string;
  children: ReactNode;
}>) {
  if (typeof accessibleName !== "string" || accessibleName.trim() === "") {
    throw new Error(
      `SVE marriage table region requires a non-empty accessible name. Received: ${JSON.stringify(accessibleName)}.`,
    );
  }

  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label={accessibleName}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function SveMarriageLead() {
  return (
    <>
      <p>
        Stardew Valley Expanded bachelors and bachelorettes: there are 7 of them on a
        current SVE 1.15.11 save. Four bachelorettes, three bachelors, sitting next to
        the vanilla 12. A 2021 guide that stops at Claire, Olivia, Sophia, and Victor is
        missing people. The names now are Claire, Olivia, Scarlett, Sophia, Lance, Magnus,
        and Victor.
      </p>
      <p>
        Full gift tables and heart-event branches live on the{" "}
        <a href="https://stardewvalleyexpanded.wiki.gg/wiki/Villagers">
          Stardew Valley Expanded Wiki
        </a>
        . The original 12 stay on the{" "}
        <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink>. After you pick
        someone, leave farmhouse space in the{" "}
        <a href={PLANNER_HREF}>Stardew Valley Planner</a>.
      </p>
      <p>
        Checked against the SVE Wiki Villagers page and the seven candidate pages on 25
        August 2026. Mod build on Nexus: SVE 1.15.11.
      </p>
    </>
  );
}

function sveMarriageGroupRows(): readonly SveMarriageGroupRow[] {
  return [
    {
      group: "SVE bachelorettes",
      count: "4",
      names: "Claire, Olivia, Scarlett, Sophia",
    },
    {
      group: "SVE bachelors",
      count: "3",
      names: "Lance, Magnus, Victor",
    },
    {
      group: "SVE marriage candidates",
      count: "7",
      names: "The seven names above",
    },
    {
      group: "Vanilla marriage candidates (unchanged)",
      count: "12",
      names: (
        <>
          See the <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink>
        </>
      ),
    },
    {
      group: "Total marriage candidates with SVE installed",
      count: "19",
      names: "Vanilla 12 + SVE 7",
    },
  ];
}

function SveMarriageQuickList() {
  const groupRows = sveMarriageGroupRows();
  if (groupRows.length === 0) {
    throw new Error(
      `SVE marriage group table requires at least one row. Received: length ${groupRows.length}.`,
    );
  }

  return (
    <>
      <h2>Stardew Valley Expanded bachelors and bachelorettes: the quick list</h2>
      <SveMarriageTableScroll accessibleName="Stardew Valley Expanded marriage groups">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Count</th>
              <th scope="col">Names</th>
            </tr>
          </thead>
          <tbody>
            {groupRows.map((groupRow) => {
              if (groupRow.group.trim() === "" || groupRow.count.trim() === "") {
                throw new Error(
                  `SVE marriage group table row is missing group or count. Received group: ${JSON.stringify(groupRow.group)}, count: ${JSON.stringify(groupRow.count)}.`,
                );
              }

              return (
                <tr key={groupRow.group}>
                  <td>{groupRow.group}</td>
                  <td>{groupRow.count}</td>
                  <td>{groupRow.names}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SveMarriageTableScroll>
      <p>
        They take gifts and run heart events. Dating still starts with a Bouquet, and
        marriage still needs a Mermaid&apos;s Pendant. Martin, Andy, Susan, Morris, Marlon,
        and the other befriendable SVE villagers are not on this list.
      </p>
    </>
  );
}

function SveMarriageListScope() {
  return (
    <>
      <h2>What this SVE marriage list includes</h2>
      <p>
        &quot;Bachelors and bachelorettes&quot; here means current SVE marriage candidates, not
        every new face in the mod. The Villagers page also lists people you can befriend
        and people you cannot gift. Those columns are not the marriage list.
      </p>
      <p>
        The vanilla twelve are still there: Alex, Elliott, Harvey, Sam, Sebastian, Shane,
        Abigail, Emily, Haley, Leah, Maru, and Penny. Use the{" "}
        <VanillaNpcGuideLink>vanilla gifts, marriage, and services</VanillaNpcGuideLink>{" "}
        page for them.
      </p>
      <p>
        The SVE seven are in the table above. Magnus is the Wizard. He already lived in
        the tower. Expanded makes him dateable.
      </p>
      <p>
        Andy, Apples, Gunther, Henchman, Marlon, Martin, Morgan, Morris, and Susan are
        befriendable on the current Villagers page. They are not marriage candidates.
        Alesia, Isaac, and Camilla are planned for later updates. They are not current
        bachelors or bachelorettes.
      </p>
      <p>
        If a character is missing from town, use the access table below before you assume
        the roster is wrong.
      </p>
    </>
  );
}

function ClaireProfile() {
  return (
    <>
      <h3>Claire</h3>
      <p>
        Watch her 6-heart event while she still has a job. Claire only comes to Pelican
        Town on work days. If JojaMart closes and you have not seen that event, she has no
        reason to show up. Do this even if you never plan to marry her.
      </p>
      <p>
        She buses in as a JojaMart cashier. Finish the Community Center and unlock the
        movie theater, and she works the concession stand instead. Her house at 103
        Prairie Road is not accessible. Birthday: Fall 8.
      </p>
      <p>
        Loved gifts to start with, from the SVE Wiki: Apricot, Glazed Butterfish, Green
        Tea, Mixed Berry Pie, Sunflower.
      </p>
      <p>
        After marriage she keeps the Joja or theater shift and takes Friday and rainy days
        off. Outside, she turns the spouse area into a small garden for tea saplings.
      </p>
    </>
  );
}

function OliviaProfile() {
  return (
    <>
      <h3>Olivia</h3>
      <p>
        Olivia&apos;s loved gifts are a rough year 1. Wine, Blue Moon Wine, Chocolate Cake,
        Goldenrod. Blue Moon Wine comes from Sophia&apos;s ledger at Blue Moon Vineyard, so an
        Olivia save often walks Sophia&apos;s map even if you never date Sophia.
      </p>
      <p>
        She lives at Jenkins&apos; Residence with her son Victor, east of Pierre&apos;s. Retired.
        Birthday: Spring 15.
      </p>
      <p>
        Dating Olivia and Victor at the same time fires an extra event inside Jenkins&apos;
        Residence. Without a Rabbit&apos;s Foot in your inventory, they confront you and you
        lose a large friendship chunk with both. Carry a Rabbit&apos;s Foot in and they greet
        you instead; you lose no points.
      </p>
    </>
  );
}

function SophiaProfile() {
  return (
    <>
      <h3>Sophia</h3>
      <p>
        If you want Scarlett, you go through Sophia first. Sophia&apos;s 2-heart event is the
        first meeting. Her 8-heart event is one of the locks before Scarlett becomes
        giftable.
      </p>
      <p>
        Sophia runs Blue Moon Vineyard west of Pelican Town. She is shy with strangers and
        close with Scarlett, Victor, Emily, Haley, and Gus. Birthday: Winter 27.
      </p>
      <p>
        Fairy Rose, Grampleton Orange Chicken, and Puppyfish are easy loved-gift starters.
        The chicken is sold at the Saloon. She also peels off to Harvey&apos;s Clinic on a
        regular cycle, so the vineyard is empty some days.
      </p>
    </>
  );
}

function ScarlettProfile() {
  return (
    <>
      <h3>Scarlett</h3>
      <p>
        Scarlett is not a town bachelorette on day one. You meet her in Sophia&apos;s 2-heart
        event, while her father is buying animal goods at Marnie&apos;s. She becomes giftable
        after Sophia&apos;s 8-heart event and after you restore the Community Center or
        complete the Joja development form. Festivals come after that.
      </p>
      <p>
        She lives at 106 Pondwood Road in the Pondwood Suburbs. Farmhand for Andy in
        spring and Susan in summer. Birthday: Summer 7.
      </p>
      <p>Grampleton Orange Chicken, Blueberry Tart, Baked Berry Oatmeal.</p>
    </>
  );
}

function SveBachelorettes() {
  return (
    <>
      <h2>The 4 SVE bachelorettes</h2>
      <ClaireProfile />
      <OliviaProfile />
      <SophiaProfile />
      <ScarlettProfile />
    </>
  );
}

function LanceProfile() {
  return (
    <>
      <h3>Lance</h3>
      <p>
        Do not plan a spring year 1 Bouquet rush. Lance&apos;s regular schedule starts after
        the Forge introduction cutscene. Until that plays, there is no Pelican Town gift
        loop. Afterward he rotates Castle Village Outpost, the Adventurer&apos;s Guild, Ginger
        Island, and the Highlands.
      </p>
      <p>
        He is a combat mage and second-in-command of the First Slash Guild. Birthday:
        Spring 8. Address: First Slash Guild Hall.
      </p>
      <p>
        Monster Mushroom, Pineapple Custard Crepe, Tropical Curry to start. A lot of his
        other loves are late-game fish, mushrooms, and combat loot.
      </p>
    </>
  );
}

function MagnusProfile() {
  return (
    <>
      <h3>Magnus</h3>
      <p>
        Magnus Rasmodius is the Wizard. In vanilla he takes gifts and you cannot marry
        him. In SVE he is one of the three bachelors. Birthday: Winter 17. Address:
        Wizard&apos;s Tower.
      </p>
      <p>
        Void Delight, Void Salmon Sushi, Solar Essence, Void Essence. Combat and void
        items land better than crops.
      </p>
      <p>
        Once married, Magnus still works from the Wizard&apos;s Tower on weekdays and stays on
        the farm Friday, Saturday, and Sunday. After Morgan arrives in year 3, the 7th and
        26th may keep him out that evening. After you meet Camilla, Monday nights on the
        farm drop too. Do not lay out the farm as if he is home every night.
      </p>
    </>
  );
}

function VictorProfile() {
  return (
    <>
      <h3>Victor</h3>
      <p>
        Victor is in town from the first day of an SVE save. No Ginger Island gate. No
        Sophia heart gate. The catch is the house he shares with Olivia, including the
        extra event if you date both.
      </p>
      <p>
        He finished an engineering degree and does not have a settled job in town.
        Birthday: Summer 23. Jenkins&apos; Residence, same building as Olivia.
      </p>
      <p>
        Battery Pack, Duck Feather, Spaghetti, Blue Moon Wine. The first two come off the
        farm. The wine points back at Sophia&apos;s vineyard.
      </p>
    </>
  );
}

function SveBachelors() {
  return (
    <>
      <h2>The 3 SVE bachelors</h2>
      <LanceProfile />
      <MagnusProfile />
      <VictorProfile />
    </>
  );
}

function sveAccessGateRows(): readonly SveAccessGateRow[] {
  return [
    {
      candidate: "Olivia",
      appearsInPelicanTown: "Yes, from the start",
      gateToClear: "None beyond normal schedules",
    },
    {
      candidate: "Victor",
      appearsInPelicanTown: "Yes, from the start",
      gateToClear: "None beyond normal schedules",
    },
    {
      candidate: "Sophia",
      appearsInPelicanTown: "At Blue Moon Vineyard from the start",
      gateToClear: "None to meet; Clinic days pull her off the farm",
    },
    {
      candidate: "Claire",
      appearsInPelicanTown: "Only on work days",
      gateToClear:
        "See the 6-heart event before JojaMart closes, or she stops entering town",
    },
    {
      candidate: "Scarlett",
      appearsInPelicanTown: "Not as a giftable villager at start",
      gateToClear:
        "Sophia 2-heart to meet; Sophia 8-heart plus Community Center or Joja form to gift",
    },
    {
      candidate: "Magnus",
      appearsInPelicanTown: "Wizard's Tower",
      gateToClear: "Tower access, same as vanilla",
    },
    {
      candidate: "Lance",
      appearsInPelicanTown: "Not on a town loop at start",
      gateToClear: "Forge introduction cutscene, then a multi-map rotation",
    },
  ];
}

function SveTownAccessGates() {
  const accessGateRows = sveAccessGateRows();
  if (accessGateRows.length === 0) {
    throw new Error(
      `SVE access-gate table requires at least one row. Received: length ${accessGateRows.length}.`,
    );
  }

  return (
    <>
      <h2>Who is missing from town, and why</h2>
      <p>
        If a Stardew Valley Expanded bachelor or bachelorette is missing from town, check
        the gate before you check the wiki roster.
      </p>
      <SveMarriageTableScroll accessibleName="Stardew Valley Expanded candidate access gates">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              <th scope="col">Appears in Pelican Town?</th>
              <th scope="col">Gate you must clear</th>
            </tr>
          </thead>
          <tbody>
            {accessGateRows.map((accessGateRow) => {
              if (
                accessGateRow.candidate.trim() === "" ||
                accessGateRow.appearsInPelicanTown.trim() === ""
              ) {
                throw new Error(
                  `SVE access-gate table row is missing candidate or appearance. Received candidate: ${JSON.stringify(accessGateRow.candidate)}, appearsInPelicanTown: ${JSON.stringify(accessGateRow.appearsInPelicanTown)}.`,
                );
              }

              return (
                <tr key={accessGateRow.candidate}>
                  <td>{accessGateRow.candidate}</td>
                  <td>{accessGateRow.appearsInPelicanTown}</td>
                  <td>{accessGateRow.gateToClear}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SveMarriageTableScroll>
      <p>
        Andy, Martin, and Susan look dateable because they have portraits, dialogue, and
        jobs. On the current Villagers page they are befriendable, not marriageable.
      </p>
    </>
  );
}

function sveStarterGiftRows(): readonly SveStarterGiftRow[] {
  return [
    {
      candidate: "Olivia",
      birthday: "Spring 15",
      starterLovedGifts: "Wine, Blue Moon Wine, Chocolate Cake, Goldenrod",
      fastNote: "Expensive early; vineyard wine is a reliable path",
    },
    {
      candidate: "Lance",
      birthday: "Spring 8",
      starterLovedGifts: "Monster Mushroom, Pineapple Custard Crepe, Tropical Curry",
      fastNote: "Late combat / island loot",
    },
    {
      candidate: "Scarlett",
      birthday: "Summer 7",
      starterLovedGifts: "Grampleton Orange Chicken, Blueberry Tart, Baked Berry Oatmeal",
      fastNote: "Not giftable until Sophia's 8-heart gate",
    },
    {
      candidate: "Victor",
      birthday: "Summer 23",
      starterLovedGifts: "Battery Pack, Duck Feather, Spaghetti, Blue Moon Wine",
      fastNote: "In town from day one",
    },
    {
      candidate: "Claire",
      birthday: "Fall 8",
      starterLovedGifts: "Apricot, Glazed Butterfish, Green Tea, Mixed Berry Pie, Sunflower",
      fastNote: "Gift her on work days; protect the 6-heart event",
    },
    {
      candidate: "Magnus",
      birthday: "Winter 17",
      starterLovedGifts: "Void Delight, Void Salmon Sushi, Solar Essence, Void Essence",
      fastNote: "Combat / void items",
    },
    {
      candidate: "Sophia",
      birthday: "Winter 27",
      starterLovedGifts: "Fairy Rose, Grampleton Orange Chicken, Puppyfish",
      fastNote: "Saloon chicken is an easy loved gift",
    },
  ];
}

function SveStarterLovedGifts() {
  const starterGiftRows = sveStarterGiftRows();
  if (starterGiftRows.length === 0) {
    throw new Error(
      `SVE starter-gift table requires at least one row. Received: length ${starterGiftRows.length}.`,
    );
  }

  return (
    <>
      <h2>Starter loved gifts and birthdays</h2>
      <p>
        The gifts below are wiki infobox and loves-table starters, not the full taste
        list. Universal loves still apply unless a candidate page excludes them. Check
        that page before you spend a rare item.
      </p>
      <SveMarriageTableScroll accessibleName="Stardew Valley Expanded starter loved gifts">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              <th scope="col">Birthday</th>
              <th scope="col">Starter loved gifts</th>
              <th scope="col">Fast note</th>
            </tr>
          </thead>
          <tbody>
            {starterGiftRows.map((starterGiftRow) => {
              if (
                starterGiftRow.candidate.trim() === "" ||
                starterGiftRow.birthday.trim() === "" ||
                starterGiftRow.starterLovedGifts.trim() === ""
              ) {
                throw new Error(
                  `SVE starter-gift table row is missing candidate, birthday, or gifts. Received candidate: ${JSON.stringify(starterGiftRow.candidate)}, birthday: ${JSON.stringify(starterGiftRow.birthday)}, starterLovedGifts: ${JSON.stringify(starterGiftRow.starterLovedGifts)}.`,
                );
              }

              return (
                <tr key={starterGiftRow.candidate}>
                  <td>{starterGiftRow.candidate}</td>
                  <td>{starterGiftRow.birthday}</td>
                  <td>{starterGiftRow.starterLovedGifts}</td>
                  <td>{starterGiftRow.fastNote}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SveMarriageTableScroll>
      <p>
        Birthday gifts still use the vanilla multiplier. Two gifts per week, birthday
        excepted. SVE does not replace those rules.
      </p>
    </>
  );
}

function SveDatingAndMarriageRules() {
  return (
    <>
      <h2>Dating and marriage rules that still apply</h2>
      <p>Friendship, dating, and marriage use the vanilla thresholds:</p>
      <ol>
        <li>Talk and gift to 8 hearts.</li>
        <li>
          Give a Bouquet from Pierre to start dating. The meter then opens to 10 hearts
          for that candidate.
        </li>
        <li>
          Upgrade the farmhouse far enough for a spouse.{" "}
          <a href={CARPENTER_HREF}>Robin&apos;s build and upgrade menu</a> is the vanilla
          carpenter flow.
        </li>
        <li>
          Give a Mermaid&apos;s Pendant from the Old Mariner (rain, repaired beach bridge,
          5,000g) at 10 hearts.
        </li>
      </ol>
      <p>
        SVE uses that same sequence. What changes is where you stand to trigger events,
        and which new items they like. There is no second Bouquet.
      </p>
      <p>
        Jealousy, break-ups, and dating more than one person still exist. Olivia and
        Victor share a house. Dating both triggers that extra Jenkins&apos; Residence event.
        A Rabbit&apos;s Foot in inventory turns the confrontation into a friendly greeting.
      </p>
      <p>Krobus remains a roommate path, not an SVE bachelor.</p>
    </>
  );
}

function SveFarmPlanningAfterChoice() {
  return (
    <>
      <h2>After you choose a candidate, plan the farm</h2>
      <p>
        Marriage moves a spouse into the farmhouse and adds a spouse room. That does not
        pin everyone to the farm. Claire keeps a work shift, Lance still runs guild and
        island maps, and Magnus still has the tower. Lay the farm out before the wedding.
        Choose among the Stardew Valley Expanded bachelors and bachelorettes first, then
        place the farm.
      </p>
      <ol>
        <li>
          Pick the candidate using the access table. Scarlett is a bad year 1 daily gift
          target. Lance is a bad target before the Forge intro.
        </li>
        <li>
          Open the <PlannerCtaLink>Stardew Valley Planner</PlannerCtaLink> and reserve
          farmhouse space, a clear path to the shipping bin, and room for the spouse tile
          that every married farm uses.
        </li>
        <li>
          If you play SVE&apos;s farm maps, switch the editor to Grandpa&apos;s Farm, Frontier Farm,
          or Immersive Farm 2. Those maps are already in the planner editor. The public
          mods marketing page is gone. There is no separate mods marketing URL.
        </li>
        <li>
          Keep vanilla relationship math on the{" "}
          <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink>. This planner does
          not record hearts, gift counts, or character positions.
        </li>
      </ol>
      <p>
        Projects stay in this browser. There is no account and no NPC tracker. Use the
        planner for footprints and paths, then handle gifts in-game.
      </p>
    </>
  );
}

function sveMarriageFaqItems(): readonly BlogFaqItem[] {
  return [
    {
      question: "How many Stardew Valley Expanded bachelors and bachelorettes are there?",
      answer: (
        <p>
          Seven current marriage candidates. Four bachelorettes: Claire, Olivia,
          Scarlett, Sophia. Three bachelors: Lance, Magnus, Victor. That sits on top of
          the vanilla 12. Alesia, Isaac, and Camilla are planned for later updates and do
          not count today.
        </p>
      ),
    },
    {
      question: "Who can you marry in Stardew Valley Expanded?",
      answer: (
        <p>
          The seven names above, plus the original twelve if you still want a vanilla
          spouse. Andy, Martin, Susan, Morris, Marlon, and the other befriendable SVE NPCs
          are not marriage candidates on the current Villagers page.
        </p>
      ),
    },
    {
      question: "Is the Wizard marriageable in Stardew Valley Expanded?",
      answer: (
        <p>
          Yes. In SVE the Wizard is listed as Magnus and is one of the three bachelors. In
          vanilla he is giftable and not marriageable. Use the{" "}
          <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink> for the
          non-marriage Wizard role, and this page for the SVE romance path.
        </p>
      ),
    },
    {
      question: "Why can't I find Claire or Scarlett?",
      answer: (
        <p>
          Claire only visits on work days and stops coming if JojaMart closes before her
          6-heart event. Scarlett is not giftable at the start of the save. Meet her in
          Sophia&apos;s 2-heart event. Unlock gifting after Sophia&apos;s 8-heart event plus
          Community Center or Joja completion.
        </p>
      ),
    },
    {
      question: "Does this page replace the vanilla NPC list?",
      answer: (
        <p>
          No. Vanilla gifts, the original 12, and service NPCs such as Robin and Marnie
          stay on <VanillaNpcGuideLink>stardew-valley-npc</VanillaNpcGuideLink>. This page
          is only the SVE marriage add-on.
        </p>
      ),
    },
  ];
}

function SveMarriageFaq() {
  return (
    <>
      <h2>Stardew Valley Expanded marriage FAQ</h2>
      <BlogFaqList items={sveMarriageFaqItems()} />
    </>
  );
}

function sveMarriageSourceItems(): readonly BlogSourceItem[] {
  return [
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
      label: "SVE Wiki: Villagers",
      note: " — 7 marriage candidates. Checked 25 August 2026.",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire",
      label: "SVE Wiki: Claire",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia",
      label: "SVE Wiki: Olivia",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia",
      label: "SVE Wiki: Sophia",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett",
      label: "SVE Wiki: Scarlett",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance",
      label: "SVE Wiki: Lance",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus",
      label: "SVE Wiki: Magnus",
    },
    {
      href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor",
      label: "SVE Wiki: Victor",
    },
    {
      href: "https://www.nexusmods.com/stardewvalley/mods/3753",
      label: "SVE on Nexus",
      note: " — main file 1.15.11.",
    },
    {
      href: "https://stardewvalleywiki.com/Marriage",
      label: "Stardew Valley Wiki: Marriage",
    },
    {
      href: "https://stardewvalleywiki.com/Friendship",
      label: "Stardew Valley Wiki: Friendship",
    },
    {
      href: "https://stardewvalleyplanner.art/",
      label: "Stardew Valley Planner",
    },
  ];
}

function assertSveMarriageSourceItems(sourceItems: readonly BlogSourceItem[]): void {
  if (sourceItems.length === 0) {
    throw new Error(
      `SVE marriage sources require at least one item. Received: length ${sourceItems.length}.`,
    );
  }

  sourceItems.forEach((sourceItem, sourceIndex) => {
    if (typeof sourceItem.href !== "string" || sourceItem.href.trim() === "") {
      throw new Error(
        `SVE marriage source ${sourceIndex} is missing href. Received: ${JSON.stringify(sourceItem.href)}.`,
      );
    }

    if (typeof sourceItem.label !== "string" || sourceItem.label.trim() === "") {
      throw new Error(
        `SVE marriage source ${sourceIndex} is missing label. Received: ${JSON.stringify(sourceItem.label)}.`,
      );
    }
  });
}

function SveMarriageSources() {
  const sourceItems = sveMarriageSourceItems();
  assertSveMarriageSourceItems(sourceItems);

  return <BlogSources heading="Sources" items={sourceItems} />;
}
