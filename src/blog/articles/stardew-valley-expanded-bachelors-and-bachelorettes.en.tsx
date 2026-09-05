import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const VANILLA_NPC_GUIDE_HREF = "/stardew-valley-npc";
const CARPENTER_HREF = "/carpenter-stardew";
const PLANNER_HREF = "/#planner";

type MarriageCandidateRow = Readonly<{
  group: string;
  count: string;
  names: ReactNode;
}>;

type AccessGateRow = Readonly<{
  candidate: string;
  whereToLook: string;
  accessNote: string;
}>;

type GiftStarterRow = Readonly<{
  candidate: string;
  birthday: string;
  gifts: string;
  planningNote: string;
}>;

export function StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle() {
  return (
    <article>
      <EnglishSVEIntroduction />
      <EnglishSVERoster />
      <EnglishSVEAccessOverview />
      <EnglishSVEBachelorettes />
      <EnglishSVEBachelors />
      <EnglishSVEGiftStarters />
      <EnglishSVEDatingSteps />
      <EnglishSVEFarmPlanning />
      <EnglishSVEFaq />
      <EnglishSVESources />
    </article>
  );
}

function VanillaNpcGuideLink({ children }: Readonly<{ children: ReactNode }>) {
  return <a href={VANILLA_NPC_GUIDE_HREF}>{children}</a>;
}

function PlannerLink({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <a className="blog-planner-link" href={PLANNER_HREF}>
      {children}
    </a>
  );
}

function TableRegion({
  accessibleName,
  children,
}: Readonly<{ accessibleName: string; children: ReactNode }>) {
  if (accessibleName.trim() === "") {
    throw new Error(
      `SVE table region requires a non-empty accessible name. Received: ${JSON.stringify(accessibleName)}.`,
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

function EnglishSVEIntroduction() {
  return (
    <>
      <p>
        Stardew Valley Expanded currently adds seven marriage candidates to the
        relationship roster: Claire, Lance, Magnus, Olivia, Scarlett, Sophia, and
        Victor. The SVE Villagers page separates these candidates from villagers who
        can be befriended but not married. That distinction is the useful answer when a
        portrait looks romanceable but the bouquet dialogue never appears.
      </p>
      <p>
        The seven split into four bachelorettes and three bachelors. The base game's
        twelve candidates remain available, so a save with SVE has a practical pool of
        nineteen marriage candidates. This guide focuses on the SVE additions; use the{" "}
        <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink> for the original
        roster, their gifts, and their town services.
      </p>
      <p>
        The mod listing used for this check identifies SVE 1.15.11. Candidate pages can
        change as the mod changes, so treat the tables below as a route into the current
        Wiki pages, not as a replacement for the full gift and heart-event tables. When
        you have picked a spouse, sketch the farmhouse and paths in the{" "}
        <PlannerLink>Stardew Valley Planner</PlannerLink> before committing to a crowded
        farm layout.
      </p>
    </>
  );
}

function marriageCandidateRows(): readonly MarriageCandidateRow[] {
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
      group: "SVE additions",
      count: "7",
      names: "Claire, Lance, Magnus, Olivia, Scarlett, Sophia, Victor",
    },
    {
      group: "Vanilla candidates still present",
      count: "12",
      names: <VanillaNpcGuideLink>See the vanilla NPC guide</VanillaNpcGuideLink>,
    },
  ];
}

function EnglishSVERoster() {
  const rows = marriageCandidateRows();
  if (rows.length === 0) {
    throw new Error(`SVE roster requires rows. Received: ${rows.length}.`);
  }

  return (
    <>
      <h2>Stardew Valley Expanded marriage candidates at a glance</h2>
      <TableRegion accessibleName="Stardew Valley Expanded marriage candidate roster">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Count</th>
              <th scope="col">Names</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.group.trim() === "" || row.count.trim() === "") {
                throw new Error(
                  `SVE roster row requires group and count. Received group: ${JSON.stringify(row.group)}, count: ${JSON.stringify(row.count)}.`,
                );
              }

              return (
                <tr key={row.group}>
                  <td>{row.group}</td>
                  <td>{row.count}</td>
                  <td>{row.names}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableRegion>
      <p>
        The short version is seven SVE additions, not seven characters in the whole
        game. The original twelve are not removed or replaced. A character being
        friendly, having a portrait, or appearing in a heart event does not by itself
        make that character a marriage candidate.
      </p>
    </>
  );
}

function EnglishSVEAccessOverview() {
  const rows: readonly AccessGateRow[] = [
    {
      candidate: "Claire",
      whereToLook: "Her work location in Pelican Town",
      accessNote: "She appears on work days; see her 6-heart event before she is left without a reason to come to town.",
    },
    {
      candidate: "Olivia",
      whereToLook: "Jenkins' Residence",
      accessNote: "Her candidate page places her there with Victor; follow her normal schedule.",
    },
    {
      candidate: "Sophia",
      whereToLook: "Blue Moon Vineyard",
      accessNote: "Her candidate page places her at the vineyard west of Pelican Town.",
    },
    {
      candidate: "Scarlett",
      whereToLook: "Sophia's heart-event path first",
      accessNote: "Meet her in Sophia's 2-heart event, then complete Sophia's 8-heart event and either the Community Center or Joja development route before gifting.",
    },
    {
      candidate: "Lance",
      whereToLook: "Forge and later SVE locations",
      accessNote: "His regular schedule starts after the Forge introduction cutscene.",
    },
    {
      candidate: "Magnus",
      whereToLook: "Wizard's Tower",
      accessNote: "The Magnus page identifies him as the Wizard and an SVE bachelor; use his schedule rather than a regular-town search.",
    },
    {
      candidate: "Victor",
      whereToLook: "Jenkins' Residence and his town route",
      accessNote: "His candidate page places him with Olivia and describes his museum, park, ocean, and arcade routines.",
    },
  ];

  if (rows.length !== 7) {
    throw new Error(`SVE access table must contain seven candidates. Received: ${rows.length}.`);
  }

  return (
    <>
      <h2>Check the access gate before assuming someone is missing</h2>
      <p>
        SVE spreads its candidates across work schedules, a vineyard, a wizard's tower,
        and locations outside the normal town loop. The most useful troubleshooting
        step is to identify the candidate's gate first, then check the schedule for that
        unlocked state.
      </p>
      <TableRegion accessibleName="SVE candidate access gates">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              <th scope="col">Where to look</th>
              <th scope="col">Access note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.candidate}>
                <td>{row.candidate}</td>
                <td>{row.whereToLook}</td>
                <td>{row.accessNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableRegion>
      <p>
        Scarlett is the clearest example of an event gate, while Claire and Lance are
        schedule problems that look like missing-character bugs. If the target is not
        listed as single in the Social tab after the relevant gate, check the candidate
        page and your save's event progress before spending rare gifts.
      </p>
    </>
  );
}

function EnglishSVEBachelorettes() {
  return (
    <>
      <h2>The four SVE bachelorettes</h2>
      <h3>Claire</h3>
      <p>
        Claire lives in the countryside outside Pelican Town and buses in to work as a
        JojaMart cashier. That makes her different from a town resident with an
        all-season route: her page says she appears in Pelican Town on days she works.
        If the Community Center is complete and the movie theater is unlocked, her work
        location changes to the theater.
      </p>
      <p>
        The practical Claire check is the 6-heart event. Her page notes that a temporarily
        unemployed Claire has no reason to enter town unless that event has been seen.
        For early gifts, Apricot, Green Tea, Sunflower, Mixed Berry Pie, and Glazed
        Butterfish are readable starting points from her loves table. Her full schedule
        and exclusions belong to the linked Wiki page.
      </p>

      <h3>Olivia</h3>
      <p>
        Olivia lives at Jenkins' Residence with her son Victor, east of the General Store
        and north of 1 River Road. Her route is therefore a residence-and-town question,
        not a vineyard question. The character page also describes her as someone who
        has retired from JojaCo and now spends time around art, wine, and the people of
        Pelican Town.
      </p>
      <p>
        Wine, Blue Moon Wine, Chocolate Cake, and Goldenrod are useful starter examples
        from the current gift notes. Blue Moon Wine also connects her route to Sophia's
        Blue Moon Vineyard, which is a helpful map clue when you are planning one gift
        run for more than one SVE candidate. Check Olivia's own table before treating
        any short list as exhaustive.
      </p>

      <h3>Sophia</h3>
      <p>
        Sophia lives and farms at Blue Moon Vineyard west of Pelican Town. Her page
        describes her as shy, with interests in anime, manga, and cosplay. Fairy Rose,
        Grampleton Orange Chicken, and Puppyfish are convenient examples from her loved
        gifts. The full table includes SVE-specific items, so the best gift is often the
        one your current farm can produce rather than the rarest item on the page.
      </p>
      <p>
        Sophia is also the route into Scarlett. Scarlett's page says their first meeting
        occurs during Sophia's 2-heart event. If Scarlett is your target, raise Sophia
        far enough to see that event and continue to the 8-heart gate before deciding
        that Scarlett is absent from the save.
      </p>

      <h3>Scarlett</h3>
      <p>
        Scarlett is not a day-one giftable town resident. Her page places her at 106
        Pondwood Road in the Pondwood Suburbs and says she first appears during Sophia's
        2-heart event. She becomes giftable after Sophia's 8-heart event plus one of two
        world-state routes: repair the Community Center or complete the Joja development
        form.
      </p>
      <p>
        Her early gifts include Baked Berry Oatmeal, Cheese Charcuterie, Grampleton
        Orange Chicken, Large Goat Milk, Maple Syrup, and Cherry. She works as a farmhand
        for Andy in spring and Susan in summer, so her schedule is a better search key
        than the center of Pelican Town. Festivals come after the access step described
        above.
      </p>
    </>
  );
}

function EnglishSVEBachelors() {
  return (
    <>
      <h2>The three SVE bachelors</h2>
      <h3>Lance</h3>
      <p>
        Lance is a combat mage and second-in-command of the First Slash Guild. His page
        says his regular schedule begins after you view his introduction cutscene at the
        Forge. Once that happens, he rotates through Castle Village Outpost, the
        Adventurer's Guild, Ginger Island, and the Highlands. Searching only the usual
        Pelican Town routes will miss the point of his schedule.
      </p>
      <p>
        Monster Mushroom, Pineapple Custard Crepe, Tropical Curry, Gemfish, and Daggerfish
        are useful examples from his current loves tables. Because many of his gifts are
        connected to combat, fishing, or later SVE areas, Lance is a candidate to plan
        for rather than a candidate to rush in the first spring.
      </p>

      <h3>Magnus</h3>
      <p>
        Magnus Rasmodius is the Wizard. His SVE page identifies him as one of the
        bachelors available in the expansion and points readers to the vanilla Wizard
        page for canon information about the character. In other words, the name is
        Magnus on the SVE route, while the tower remains the obvious starting location.
      </p>
      <p>
        Frog Legs, Void Delight, Void Salmon Sushi, Ancient Fiber, Void Root, and the
        elixir entries on his loves table are practical examples. His page has separate
        schedule sections for rain, later-year deviations, and marriage, so use that
        schedule when a tower visit does not find him.
      </p>

      <h3>Victor</h3>
      <p>
        Victor lives with Olivia at Jenkins' Residence. His page describes a recent
        engineering graduate who is still deciding what he wants to do, and it places
        him around the museum, park, ocean, arcade games, and books. That gives Victor a
        very different feel from Lance's travel-heavy route and Magnus's tower route.
      </p>
      <p>
        Ramen, Spaghetti, Duck Feather, Battery Pack, Blue Moon Wine, and Ancient Fiber
        are starter examples from his loves table. The first two farm-friendly choices
        are especially easy to understand: Duck Feather comes from ducks and Battery
        Pack comes from a Lightning Rod. Use the full Victor page for every exception.
      </p>
    </>
  );
}

function GiftStarterRows(): readonly GiftStarterRow[] {
  return [
    {
      candidate: "Olivia",
      birthday: "Spring 15",
      gifts: "Wine, Blue Moon Wine, Chocolate Cake, Goldenrod",
      planningNote: "Wine route points toward Sophia's vineyard",
    },
    {
      candidate: "Lance",
      birthday: "Spring 8",
      gifts: "Monster Mushroom, Pineapple Custard Crepe, Tropical Curry",
      planningNote: "Expect later-area and combat-related options",
    },
    {
      candidate: "Scarlett",
      birthday: "Summer 7",
      gifts: "Baked Berry Oatmeal, Cheese Charcuterie, Grampleton Orange Chicken",
      planningNote: "Unlock gifting through Sophia first",
    },
    {
      candidate: "Victor",
      birthday: "Summer 23",
      gifts: "Ramen, Spaghetti, Duck Feather, Battery Pack",
      planningNote: "Two farm-friendly examples are easy to map",
    },
    {
      candidate: "Claire",
      birthday: "Fall 8",
      gifts: "Apricot, Green Tea, Sunflower, Mixed Berry Pie",
      planningNote: "Search her work route before gifting",
    },
    {
      candidate: "Magnus",
      birthday: "Winter 17",
      gifts: "Frog Legs, Void Delight, Void Salmon Sushi",
      planningNote: "Check the tower schedule and item exclusions",
    },
    {
      candidate: "Sophia",
      birthday: "Winter 27",
      gifts: "Fairy Rose, Grampleton Orange Chicken, Puppyfish",
      planningNote: "Her route also opens Scarlett's path",
    },
  ];
}

function EnglishSVEGiftStarters() {
  const rows = GiftStarterRows();
  if (rows.length !== 7) {
    throw new Error(`SVE gift table must contain seven candidates. Received: ${rows.length}.`);
  }

  return (
    <>
      <h2>Starter loved gifts and birthdays</h2>
      <p>
        This is a short planning list, not a replacement for each candidate's complete
        Gift Tastes table. The SVE pages also include universal gifts, SVE-specific
        items, movie preferences, and exceptions. Use the table to choose a route for
        the next few gifts, then open the character page before spending a rare item on
        a birthday.
      </p>
      <TableRegion accessibleName="SVE starter loved gifts and birthdays">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              <th scope="col">Birthday</th>
              <th scope="col">Starter loved gifts</th>
              <th scope="col">Planning note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.candidate}>
                <td>{row.candidate}</td>
                <td>{row.birthday}</td>
                <td>{row.gifts}</td>
                <td>{row.planningNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableRegion>
      <p>
        Birthday gifts and the weekly gift limit are still explained by the vanilla
        friendship rules. The SVE-specific part is the candidate's route, item list, and
        heart-event path. Keep those two layers separate while planning a year-one
        routine.
      </p>
    </>
  );
}

function EnglishSVEDatingSteps() {
  return (
    <>
      <h2>Use the vanilla dating and marriage sequence after the SVE gate</h2>
      <p>
        The Stardew Valley marriage guide documents the general relationship sequence.
        Apply it after the SVE candidate is visible and giftable; the individual SVE
        pages remain the authority for each character's access gate and heart events.
      </p>
      <ol>
        <li>
          Raise friendship to 8 hearts. Marriage candidates pause at that point until
          you show romantic intent.
        </li>
        <li>
          Buy a Bouquet from Pierre's General Store and give it to the candidate. That
          changes the Social tab status and lets the relationship progress to 10 hearts.
        </li>
        <li>
          Upgrade the farmhouse at least once and repair the bridge to the Tide Pools.
          The linked <a href={CARPENTER_HREF}>carpenter guide</a> covers the building
          side of that preparation.
        </li>
        <li>
          Reach 10 hearts, then buy the Mermaid's Pendant from the Old Mariner on a rainy
          day for 5,000g and give it to the person you want to marry.
        </li>
        <li>
          Allow the wedding schedule to complete, then use the spouse area and farmhouse
          layout as the new constraint for your farm plan.
        </li>
      </ol>
      <p>
        You can date more than one eligible candidate, but the vanilla game has group
        heart-event and cold-shoulder consequences for dating every bachelor or every
        bachelorette. If you want one clean relationship route, choose one candidate and
        spend your weekly gifts consistently.
      </p>
    </>
  );
}

function EnglishSVEFarmPlanning() {
  return (
    <>
      <h2>Plan the farm after you choose a candidate</h2>
      <p>
        Choosing a spouse changes the question from “where do I find this NPC?” to
        “what must stay open around the farmhouse?” Leave room for a spouse area, a clear
        path to the shipping box, and the crop or animal systems that supply your chosen
        candidate's easiest gifts. This is especially helpful when the gift route points
        toward a vineyard, a lightning rod, a kitchen, or a later SVE location.
      </p>
      <p>
        There is no single best SVE spouse for every farm. A vineyard-focused save may
        make Sophia's route feel natural, while a farm with ducks and lightning rods has
        an obvious starting point for Victor's listed gifts. A player who enjoys the
        expansion's combat areas may prefer to build a routine around Lance or Magnus.
        The useful comparison is not a tier list; it is the distance between your
        existing production, the candidate's access gate, and the route you will
        actually walk each week. Pick the option that makes your current save easier to
        play.
      </p>
      <ol>
        <li>Use the roster table to separate a true candidate from a befriendable NPC.</li>
        <li>Use the access table to identify the event or schedule gate.</li>
        <li>Pick two or three repeatable gifts instead of designing around every rare love.</li>
        <li>
          Open the <PlannerLink>Stardew Valley Planner</PlannerLink> and reserve farmhouse
          space, walkable paths, fields, and production areas before decorating.
        </li>
      </ol>
      <p>
        The planner is for testing placement and layout ideas. It does not replace the
        SVE Wiki's gift tables, event conditions, or schedule pages. Keep the factual
        lookup and the farm drawing as two small jobs, and the decision is much easier to
        revisit when the save changes.
      </p>
    </>
  );
}

const englishFaqItems: readonly BlogFaqItem[] = [
  {
    question: "How many Stardew Valley Expanded marriage candidates are there?",
    answer: (
      <p>
        The current SVE Villagers page lists seven: Claire, Lance, Magnus, Olivia,
        Scarlett, Sophia, and Victor. They are additions to the twelve vanilla marriage
        candidates, not a replacement for them.
      </p>
    ),
  },
  {
    question: "Who can you marry in Stardew Valley Expanded?",
    answer: (
      <p>
        The SVE additions are Claire, Olivia, Scarlett, Sophia, Lance, Magnus, and
        Victor. You can also marry the original twelve; use the{" "}
        <VanillaNpcGuideLink>vanilla NPC guide</VanillaNpcGuideLink> for that roster.
      </p>
    ),
  },
  {
    question: "Is the Wizard marriageable in Stardew Valley Expanded?",
    answer: (
      <p>
        The SVE Magnus page identifies the Wizard as one of the expansion's bachelors.
        Start with his SVE schedule and gift table, then use the vanilla Wizard page for
        canon details about the character.
      </p>
    ),
  },
  {
    question: "Why can&apos;t I find Scarlett?",
    answer: (
      <p>
        Scarlett's page says to meet her in Sophia's 2-heart event. She becomes giftable
        after Sophia's 8-heart event and after you either repair the Community Center or
        complete the Joja development form.
      </p>
    ),
  },
  {
    question: "Does SVE remove the original marriage candidates?",
    answer: (
      <p>
        No. The expansion adds its seven candidates alongside the original twelve. The
        access gates and gift tables are the SVE-specific part of this guide; the vanilla
        candidate list and general marriage sequence remain useful references.
      </p>
    ),
  },
];

function EnglishSVEFaq() {
  return (
    <>
      <h2>Stardew Valley Expanded marriage FAQ</h2>
      <BlogFaqList items={englishFaqItems} />
    </>
  );
}

const englishSourceItems: readonly BlogSourceItem[] = [
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
    label: "SVE Wiki: Villagers",
    note: " — marriage-candidate roster checked in ego-browser on September 5, 2026.",
  },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire", label: "SVE Wiki: Claire" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia", label: "SVE Wiki: Olivia" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia", label: "SVE Wiki: Sophia" },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett",
    label: "SVE Wiki: Scarlett",
  },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance", label: "SVE Wiki: Lance" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus", label: "SVE Wiki: Magnus" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor", label: "SVE Wiki: Victor" },
  {
    href: "https://www.nexusmods.com/stardewvalley/mods/3753",
    label: "SVE on Nexus",
    note: " — version 1.15.11 shown during the browser check.",
  },
  { href: "https://stardewvalleywiki.com/Marriage", label: "Stardew Valley Wiki: Marriage" },
  { href: "https://stardewvalleywiki.com/Friendship", label: "Stardew Valley Wiki: Friendship" },
  { href: "https://stardewvalleyplanner.art/", label: "Stardew Valley Planner" },
];

function EnglishSVESources() {
  return <BlogSources heading="Sources" items={englishSourceItems} />;
}
