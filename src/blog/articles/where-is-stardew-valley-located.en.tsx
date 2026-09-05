import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const TOWN_MAP_HREF = "/stardew-valley-town-map";
const NPC_GUIDE_HREF = "/stardew-valley-npc";
const ROBIN_GUIDE_HREF = "/where-is-robin-stardew-valley";
const CARPENTER_GUIDE_HREF = "/carpenter-stardew";
const PLANNER_HREF = "/#planner";

type LocationRow = Readonly<{
  level: string;
  place: string;
  meaning: string;
}>;

type WorldRelationshipRow = Readonly<{
  place: ReactNode;
  relationship: string;
  limit: string;
}>;

export function WhereIsStardewValleyLocatedEnglishArticle() {
  return (
    <article>
      <EnglishLocationIntroduction />
      <EnglishShortAnswer />
      <EnglishLocationHierarchy />
      <EnglishPelicanTown />
      <EnglishWiderWorld />
      <EnglishRealWorldQuestion />
      <EnglishResourceChoice />
      <EnglishCanonBoundary />
      <EnglishLocationFaq />
      <EnglishLocationSources />
    </article>
  );
}

function PlannerLink({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <a className="blog-planner-link" href={PLANNER_HREF}>
      {children}
    </a>
  );
}

function LocationTableRegion({
  accessibleName,
  children,
}: Readonly<{ accessibleName: string; children: ReactNode }>) {
  if (accessibleName.trim() === "") {
    throw new Error(
      "Location table requires a non-empty accessible name. Received: " +
        JSON.stringify(accessibleName) +
        ".",
    );
  }

  return (
    <div
      aria-label={accessibleName}
      className="blog-table-scroll"
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function EnglishLocationIntroduction() {
  return (
    <>
      <p>
        Where is Stardew Valley located? The answer depends on whether you mean the
        game's fictional geography or the real-world places that influenced its details.
        Inside the story, Stardew Valley is a region on the southern coast of the
        fictional Ferngill Republic. Pelican Town is a community inside that region, and
        the Farm is the land your character inherits there.
      </p>
      <p>
        That gives the game a clear in-world location without giving it a confirmed
        address on Earth. The Gem Sea, the Gotoro Empire, the Fern Islands, Zuzu City,
        and Calico Desert expand the setting, but they do not turn the valley into a
        renamed Washington, Oregon, Russia, or any other real place.
      </p>
      <p>
        The useful distinction is simple: use setting sources for lore, a town map for
        daily routes, and a farm planner for land you control. Mixing those three scales
        is what makes many answers to this question sound more certain than the game
        actually is.
      </p>
    </>
  );
}

function EnglishShortAnswer() {
  return (
    <>
      <h2>Where is Stardew Valley located? The short answer</h2>
      <p>
        Stardew Valley is a fictional coastal region in the Ferngill Republic. The
        Stardew Valley Wiki places it on the republic's southern coast. Pelican Town is
        the main settlement in the region, while the Farm is the inherited plot where
        the playable story begins. The Gem Sea borders Pelican Town to the south, and
        the Gotoro Empire is across that sea and south of the valley.
      </p>
      <p>
        The official About page uses the same story scale: the player inherits a
        grandfather's farm plot “in Stardew Valley.” That page does not identify a
        real-world county, state, country, or latitude. So the canon answer is a
        fictional region with a defined fictional neighbor, not a point that can be
        opened in Google Maps.
      </p>
    </>
  );
}

function locationHierarchyRows(): readonly LocationRow[] {
  return [
    {
      level: "1",
      place: "The Farm",
      meaning: "The inherited land you design, build on, and expand during play.",
    },
    {
      level: "2",
      place: "Pelican Town",
      meaning: "The local community where most villagers live, work, shop, and socialize.",
    },
    {
      level: "3",
      place: "Stardew Valley",
      meaning: "The larger coastal region that contains the town and the Farm.",
    },
    {
      level: "4",
      place: "Ferngill Republic",
      meaning: "The fictional nation in which Stardew Valley is located.",
    },
    {
      level: "5",
      place: "Wider world",
      meaning: "Named places such as the Gem Sea, Fern Islands, Gotoro Empire, and Zuzu City.",
    },
  ];
}

function EnglishLocationHierarchy() {
  const rows = locationHierarchyRows();
  if (rows.length !== 5) {
    throw new Error(
      "Location hierarchy requires five rows. Received: " + rows.length + ".",
    );
  }

  return (
    <>
      <h2>Separate the Farm, Pelican Town, Stardew Valley, and the republic</h2>
      <p>
        “Stardew Valley” is the regional name, not just another name for the town. The
        official description starts with a farm plot in the valley; the Pelican Town
        page describes the town as the place where the player moves at the start. This
        is the hierarchy to keep in mind when a guide says “go into town.”
      </p>
      <LocationTableRegion accessibleName="Stardew Valley location hierarchy">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Place</th>
              <th scope="col">Meaning in the game</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.level}>
                <td>{row.level}</td>
                <td>{row.place}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LocationTableRegion>
      <p>
        The Farm is where you place buildings and crops. Pelican Town is where you
        handle much of the early social and shopping loop. Stardew Valley is the region
        that gives both places their setting. Ferngill is the political layer above it.
        Keeping those labels separate makes the rest of the map easier to read.
      </p>
      <p>
        This hierarchy also explains why a bus ride, a town exit, and a country name
        answer different questions. The Bus Stop is a connection between the Farm and
        Pelican Town. It is not a border around Stardew Valley. The town exits describe
        nearby play areas, while Ferngill describes the nation that contains the region.
        Once those scales are separated, a route guide can stay practical without
        pretending to be a political map.
      </p>
    </>
  );
}

function EnglishPelicanTown() {
  return (
    <>
      <h2>Pelican Town is one community inside the valley</h2>
      <p>
        Pelican Town is not the entire map and it is not the name of the country. It is
        the settlement where the player meets most villagers, visits Pierre's store,
        uses the clinic and museum, and reaches several paths into the surrounding
        region. The local exits also explain why a town route is different from a world
        map.
      </p>
      <ul>
        <li>
          The northwest entrance connects Pelican Town to the Bus Stop and the Farm.
        </li>
        <li>
          The southwest passage leads to Cindersap Forest, Marnie's Ranch, Leah's
          Cottage, and the Wizard's Tower.
        </li>
        <li>The Beach is directly south of town.</li>
        <li>
          The Mountain is north of town, with Robin's Carpenter Shop, the Mines, the
          Adventurer's Guild, the Railroad, and the Quarry.
        </li>
      </ul>
      <p>
        If you need a route from the Farm to a shop or landmark, use the{" "}
        <a href={TOWN_MAP_HREF}>Pelican Town landmark and route guide</a>. It answers
        “where do I walk today?” The setting pages answer “where does this region sit in
        the fictional world?” Those are related questions, but not interchangeable ones.
      </p>
      <p>
        The town page also puts Pelican Town inside the Ferngill Republic and notes the
        war with the Gotoro Empire across the Gem Sea. That is stronger evidence for
        the in-game geography than any fan-drawn atlas with an invented scale.
      </p>
      <p>
        Notice the strength of that evidence. The town page gives concrete connections
        between the Beach, Mountain, Cindersap Forest, and the Farm. It does not give a
        latitude, a travel time, or a national border for every exit. Use the local map
        when you need to move your character, and use the setting page when you need to
        explain the region around that movement.
      </p>
    </>
  );
}

function widerWorldRows(): readonly WorldRelationshipRow[] {
  return [
    {
      place: "Ferngill Republic",
      relationship: "The nation containing Stardew Valley.",
      limit: "The setting pages do not establish a real-world equivalent or complete border map.",
    },
    {
      place: "Gem Sea",
      relationship: "The fictional ocean along Pelican Town's southern coast.",
      limit: "It is not a renamed Earth ocean.",
    },
    {
      place: "Gotoro Empire",
      relationship: "A nation across the Gem Sea and south of Stardew Valley.",
      limit: "The setting pages do not provide a complete political atlas.",
    },
    {
      place: "Fern Islands",
      relationship: "An archipelago in the Gem Sea belonging to Ferngill; Ginger Island is visitable.",
      limit: "One visitable island does not reveal the whole archipelago.",
    },
    {
      place: "Zuzu City",
      relationship: "A city referenced by characters, events, and films.",
      limit: "The setting pages do not establish its exact distance and direction from Pelican Town.",
    },
    {
      place: <a href="https://stardewvalleywiki.com/The_Desert">Calico Desert</a>,
      relationship: "A visitable area far to the northwest of Pelican Town.",
      limit: "The setting pages do not establish its wider political geography.",
    },
  ];
}

function EnglishWiderWorld() {
  const rows = widerWorldRows();
  if (rows.length !== 6) {
    throw new Error(
      "Wider-world table requires six rows. Received: " + rows.length + ".",
    );
  }

  return (
    <>
      <h2>How the wider fictional world fits together</h2>
      <p>
        The game reveals geography through dialogue, Lost Books, item
        descriptions, and the places you can visit. The setting page gathers those
        clues, but it is not a survey map with scale bars and exact borders.
      </p>
      <LocationTableRegion accessibleName="Stardew Valley wider world relationships">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Place</th>
              <th scope="col">Confirmed relationship</th>
              <th scope="col">What remains unknown</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={"world-place-" + index}>
                <td>{row.place}</td>
                <td>{row.relationship}</td>
                <td>{row.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LocationTableRegion>
      <p>
        Calico Desert is the clearest example of a place that is geographically useful
        but not part of Pelican Town's walking loop. It is far northwest of town and
        becomes accessible when the Bus is repaired through the Community Center Vault
        Bundles or the Joja Community Development Form. After that, the player takes the
        Bus from the Bus Stop; there is no local town exit that lets you walk there.
      </p>
      <p>
        Ginger Island works at another scale. It belongs to the Fern Islands in the Gem
        Sea and is reached by repairing Willy's boat. It is reached through a separate
        route from the mainland town.
      </p>
      <p>
        Zuzu City belongs to the same wider setting, but the sources do not give enough
        distance and direction to draw a reliable world atlas. A clean answer keeps
        those unknowns visible instead of filling them with invented borders.
      </p>
      <p>
        Relative directions are not equally precise. The desert page gives a clear
        northwest relationship to Pelican Town and a clear bus-access condition. The
        setting page gives the southern-coast relationship for Stardew Valley and the
        Gem Sea. For Zuzu City and Castle Village, the available descriptions are
        looser. That difference is why the table records both a relationship and a
        limit instead of turning every named place into a plotted point.
      </p>
    </>
  );
}

function EnglishRealWorldQuestion() {
  return (
    <>
      <h2>Is Stardew Valley based in Washington, Oregon, or somewhere else?</h2>
      <p>
        The canon answer is still no confirmed Earth location. The game has a Pacific
        Northwest feel because real experiences influenced some details, but influence
        is not a setting statement. Eric Barone grew up in Auburn, lived in
        the Seattle area while making the game, and discussed familiar food and
        foraging in a 2023 interview.
      </p>
      <p>
        That interview is useful for explaining why ingredients such as salmonberries
        and foraged mushrooms can feel regional. Barone also said those food choices
        were not a deliberate attempt to encode a specific geographic setting. So
        Washington and Oregon are reasonable references for atmosphere, not official
        answers to “where is Stardew Valley located?”
      </p>
      <p>
        The same boundary applies to other theories. Stardew Valley is not officially a
        disguised Seattle suburb, a renamed Oregon town, or a Russian village. Those
        comparisons can be interesting fan interpretations, but the named locations in
        the story remain fictional.
      </p>
      <p>
        Read the interview as context for the game's texture, not as a hidden map
        legend. It can explain why a player recognizes a food, plant, or foraging
        reference, while the setting pages explain where that detail sits in the story.
        Keeping those jobs separate makes the answer more useful: you can acknowledge
        regional inspiration without replacing the fictional geography with a real one.
      </p>

      <h3>What do Harvey's coordinates mean?</h3>
      <p>
        Harvey's shortwave radio gives the often-quoted coordinates <code>52 north,
        43.5 east</code>. The Stardew Valley Wiki records the line in its setting
        summary, so the clue is real game text. The leap happens when those numbers are
        plotted on Earth's grid as if the fictional region were already known to be on
        Earth.
      </p>
      <p>
        The Pelican Town page discusses the Earth reading conditionally and notes that
        the resulting point is not on a sea shore. That conflicts with the separate
        canon statement that Pelican Town sits on the Gem Sea's coast. One coordinate
        joke cannot override the broader fictional geography.
      </p>
      <p>
        Treat Harvey's line as an in-world detail, not an official address. It does not
        identify a real country, town, farm, or coastline.
      </p>
    </>
  );
}

function EnglishResourceChoice() {
  return (
    <>
      <h2>Which map or tool answers your location question?</h2>
      <p>
        Pick the resource by scale. A lore question, an errand, and a farm-layout
        decision all use the word “location,” but each needs a different answer.
      </p>
      <ol>
        <li>
          For the fictional world, use the{" "}
          <a href="https://stardewvalleywiki.com/Setting">Setting page</a> and its
          references to Ferngill, the Gem Sea, the Fern Islands, and Zuzu City.
        </li>
        <li>
          For town routes, use the <a href={TOWN_MAP_HREF}>Pelican Town map guide</a>,
          the <a href={NPC_GUIDE_HREF}>NPC guide</a>, or the{" "}
          <a href={ROBIN_GUIDE_HREF}>Robin location guide</a>.
        </li>
        <li>
          For buildings and fields, open the{" "}
          <PlannerLink>Stardew Valley Planner</PlannerLink> and choose the farm map you
          actually play before placing anything.
        </li>
      </ol>
      <p>
        The planner helps test building footprints, crop areas, paths, seasons, and
        coverage on your farm. It does not draw the Ferngill Republic, resolve Harvey's
        coordinates, or track NPCs live. If the decision is where to buy, upgrade, move,
        or demolish a building, use the{" "}
        <a href={CARPENTER_GUIDE_HREF}>carpenter guide</a> after the layout is clear.
      </p>
      <p>
        A simple workflow is enough. First identify whether the destination is a
        fictional region or a local landmark. Then use the town or NPC reference for
        the route. Only after the farm map is the actual problem should you open the
        planner. This keeps a lore answer from becoming a layout tutorial and keeps a
        layout decision from depending on an imaginary world-map scale.
      </p>
    </>
  );
}

function EnglishCanonBoundary() {
  return (
    <>
      <h2>What the game confirms—and what it leaves open</h2>
      <p>
        A reliable location answer should show both the confirmed relationship and the
        evidence limit beside it:
      </p>
      <ul>
        <li>Stardew Valley is in the fictional Ferngill Republic.</li>
        <li>Pelican Town is a community inside the valley, not the whole region.</li>
        <li>The Gem Sea is south of Pelican Town; the Gotoro Empire is across it.</li>
        <li>Calico Desert and Ginger Island are visitable places reached by separate routes.</li>
        <li>
          The game does not confirm an Earth country, exact national borders, or a
          complete world-map scale.
        </li>
      </ul>
      <p>
        In short, the question has a firm fictional answer and an intentionally open
        real-world answer. That is not missing information to patch with a fan map; it
        is the boundary the sources support.
      </p>
      <p>
        You can therefore state the region confidently, while labeling every Earth
        comparison as an interpretation rather than a fact.
      </p>
    </>
  );
}

const englishLocationFaqItems: readonly BlogFaqItem[] = [
  {
    question: "Where is Stardew Valley located in the game?",
    answer: (
      <p>
        It is a fictional coastal region on the southern coast of the Ferngill
        Republic. Pelican Town and the Farm are within that region, with the Gem Sea
        along Pelican Town's southern coast.
      </p>
    ),
  },
  {
    question: "Is Pelican Town the same place as Stardew Valley?",
    answer: (
      <p>
        No. Pelican Town is the main settlement inside the larger Stardew Valley
        region. The Farm connects to town through the Bus Stop, while other exits lead
        toward the Beach, Mountain, and Cindersap Forest.
      </p>
    ),
  },
  {
    question: "What country is Stardew Valley in?",
    answer: (
      <p>
        It is in the fictional Ferngill Republic. The Gotoro Empire is across the Gem
        Sea and south of the valley. The game does not equate either nation with a real
        country.
      </p>
    ),
  },
  {
    question: "Is Stardew Valley based in Washington or Oregon?",
    answer: (
      <p>
        Pacific Northwest experiences influenced some details, but that interview
        does not identify Washington or Oregon as Stardew Valley's location. Those are
        atmosphere references, not canon coordinates.
      </p>
    ),
  },
  {
    question: "Do Harvey's coordinates identify a real-world location?",
    answer: (
      <p>
        No. The 52 north, 43.5 east line is real game dialogue, but applying Earth's
        grid to a fictional region produces a conditional fan theory, not an official
        address.
      </p>
    ),
  },
  {
    question: "Where is the Gotoro Empire relative to Stardew Valley?",
    answer: (
      <p>
        The setting places it across the Gem Sea and south of Stardew Valley. The setting
        pages do not provide a complete border map or exact distance.
      </p>
    ),
  },
];

function EnglishLocationFaq() {
  return (
    <>
      <h2>Frequently asked questions</h2>
      <BlogFaqList items={englishLocationFaqItems} />
    </>
  );
}

const englishLocationSourceItems: readonly BlogSourceItem[] = [
  { href: "https://www.stardewvalley.net/about/", label: "Stardew Valley — About" },
  { href: "https://stardewvalleywiki.com/Setting", label: "Setting — Stardew Valley Wiki" },
  {
    href: "https://stardewvalleywiki.com/Pelican_Town",
    label: "Pelican Town — Stardew Valley Wiki",
  },
  {
    href: "https://stardewvalleywiki.com/The_Desert",
    label: "Calico Desert — Stardew Valley Wiki",
  },
  {
    href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
    label: "Eric Barone interview about Pacific Northwest influences — Portland Mercury",
  },
];

function EnglishLocationSources() {
  return (
    <BlogSources
      checkedLabel="Sources checked September 5, 2026."
      heading="Sources"
      items={englishLocationSourceItems}
    />
  );
}
