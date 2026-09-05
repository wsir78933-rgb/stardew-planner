import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function StardewValleyNpcEnglishArticle() {
  return (
    <article>
      <p>
        The Stardew Valley NPC list is easiest to use when you separate three questions:
        who can be dated, who accepts gifts without being a romance option, and who has
        a role without a normal gift meter. The current Stardew Valley Wiki roster lists
        46 characters in those groups: 12 marriage candidates, 22 other giftable
        villagers, and 12 non-giftable NPCs. That count is a reference boundary, not a
        promise that every character will be standing in Pelican Town at the same time.
      </p>
      <p>
        The practical use of this base-game roster is to check the Social tab, choose a
        manageable friendship route, respect each character&apos;s schedule, and separate a
        relationship goal from a shop or quest goal.
      </p>

      <h2>Stardew Valley NPC list at a glance</h2>
      <div
        aria-label="Stardew Valley NPC groups"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Count</th>
              <th scope="col">Gift meter</th>
              <th scope="col">Dating or marriage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Marriage candidates</td>
              <td>12</td>
              <td>Yes</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Other giftable villagers</td>
              <td>22</td>
              <td>Yes</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Non-giftable NPCs</td>
              <td>12</td>
              <td>No normal gift loop</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Roster total</td>
              <td>46</td>
              <td>Mixed</td>
              <td>Mixed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        “NPC” means non-player character, while “villager” usually points to a named
        resident with a routine, relationship values, and a place in the town system.
        In everyday conversation the two words overlap. For planning, the useful test is
        whether the character appears in the Social tab, accepts a gift, or is controlled
        by a quest, shop, donation, or access condition instead.
      </p>

      <h2>The 12 marriage candidates</h2>
      <p>
        The marriage group has six bachelors and six bachelorettes. The list below is the
        complete base-game romance group used by the current Villagers page:
      </p>
      <div
        aria-label="Stardew Valley marriage candidates"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--compact">
          <thead>
            <tr>
              <th scope="col">Bachelors</th>
              <th scope="col">Bachelorettes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alex</td>
              <td>Abigail</td>
            </tr>
            <tr>
              <td>Elliott</td>
              <td>Emily</td>
            </tr>
            <tr>
              <td>Harvey</td>
              <td>Haley</td>
            </tr>
            <tr>
              <td>Sam</td>
              <td>Leah</td>
            </tr>
            <tr>
              <td>Sebastian</td>
              <td>Maru</td>
            </tr>
            <tr>
              <td>Shane</td>
              <td>Penny</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Every candidate can gain friendship through conversation, gifts, quests, and
        heart events. Their normal meter stops at eight hearts until you give a Bouquet.
        After the romance meter is unlocked, ten hearts is the proposal threshold, but
        the Mermaid&apos;s Pendant and an upgraded farmhouse are additional marriage
        requirements. Ten hearts is therefore a relationship milestone, not the whole
        marriage checklist.
      </p>

      <h2>The 22 giftable villagers who are not marriage candidates</h2>
      <p>
        These characters accept ordinary gifts and use the friendship system, but they
        are not in the base-game marriage group:
      </p>
      <ul className="blog-name-grid">
        <li>Caroline</li>
        <li>Clint</li>
        <li>Demetrius</li>
        <li>Dwarf</li>
        <li>Evelyn</li>
        <li>George</li>
        <li>Gus</li>
        <li>Jas</li>
        <li>Jodi</li>
        <li>Kent</li>
        <li>Krobus</li>
        <li>Leo</li>
        <li>Lewis</li>
        <li>Linus</li>
        <li>Marnie</li>
        <li>Pam</li>
        <li>Pierre</li>
        <li>Robin</li>
        <li>Sandy</li>
        <li>Vincent</li>
        <li>Willy</li>
        <li>Wizard</li>
      </ul>
      <p>
        Giftable does not mean interchangeable. Leo starts with a different island
        context, Sandy works in the Desert, and the Dwarf has an access and language
        condition that changes when gifts become useful. Krobus is especially important
        to classify correctly: Krobus is a giftable villager and a possible roommate,
        but not a marriage candidate. Use the individual character page for gifts and
        schedule details instead of applying one route to all 22 names.
      </p>

      <h2>The 12 non-giftable NPCs</h2>
      <p>
        The current roster also contains characters who do not use the standard gift
        loop. They can still be central to progression, rewards, or late-game areas:
      </p>
      <ul className="blog-name-grid">
        <li>Birdie</li>
        <li>Bouncer</li>
        <li>Fizz</li>
        <li>Gil</li>
        <li>Governor</li>
        <li>Grandpa</li>
        <li>Gunther</li>
        <li>Henchman</li>
        <li>Marlon</li>
        <li>Morris</li>
        <li>Mr. Qi</li>
        <li>Professor Snail</li>
      </ul>
      <p>
        A non-giftable label tells you what not to do, not that the character is
        unimportant. Gunther is tied to museum donations, Marlon to the Adventurer&apos;s
        Guild and monster goals, Gil to rewards, and Mr. Qi to challenge systems. For
        this group, the next action is usually a quest, donation, purchase, combat goal,
        or access unlock. If a character has no normal heart meter, stop carrying a
        weekly gift and find the system that controls the interaction.
      </p>

      <h3>Answer one NPC question at a time</h3>
      <p>
        An NPC lookup becomes much faster when the question is narrow. “Who is this?” is
        a roster question. “Can I give this person a gift?” is a relationship question.
        “Where are they today?” is a schedule question. “What unlocks next?” is a quest
        or access question. “Do I need land for this interaction?” is a farm-planning
        question. The same character can require five different references, so a single
        giant list cannot be equally precise for all five.
      </p>
      <ol>
        <li>Start with the roster to confirm the name and category.</li>
        <li>Use the Social tab to confirm whether the normal heart meter is active.</li>
        <li>Use the individual schedule for today&apos;s time, weather, and destination.</li>
        <li>Use the gift record for the item, weekly limit, and birthday exception.</li>
        <li>Use the relevant service or quest page for the action that changes the save.</li>
      </ol>
      <p>
        This sequence prevents a location page from answering a gift question and prevents
        a gift table from answering a building question. It also gives readers a useful
        fallback when a schedule has an exception: keep the category and relationship
        facts, refresh only the time-sensitive branch, and do not throw away the entire
        route. The roster stays stable enough to organize your notes while the schedule
        and quest state are the parts that need regular checking.
      </p>

      <h2>How the friendship meter actually works</h2>
      <p>
        The Friendship page describes a ten-heart meter for ordinary villagers. A spouse
        or roommate uses a fourteen-heart meter. Each heart represents 250 friendship
        points, and the Social tab shows the current relationship state for characters
        who belong to that system.
      </p>
      <ul>
        <li>Talking to a villager once in a day adds 20 points.</li>
        <li>An item-delivery quest can add 150 points with the requesting villager.</li>
        <li>Giving the maximum two gifts in one week adds 10 points on the following Sunday.</li>
        <li>Unfriendly gifts, missed greetings, and some event choices can lower points.</li>
        <li>A room normally becomes accessible once the relevant villager reaches two hearts.</li>
      </ul>
      <p>
        These numbers are useful because they prevent a common mistake: judging every
        relationship by the price or rarity of one item. A daily conversation can be
        folded into a normal route. Two deliberate gifts and a birthday gift can matter
        more than carrying an expensive item to every house. For a marriage candidate,
        the grey final pair of hearts is a cap, not a missing schedule entry.
      </p>

      <h2>Gift limits, birthdays, and the gift log</h2>
      <p>
        You can normally give one villager one gift per day and two gifts during the game
        week. The Social tab marks the weekly gift slots. A birthday gift remains allowed
        even after both normal weekly gifts have been used, and birthday friendship gains
        use an eight-times event multiplier. The game week for this purpose begins on
        Sunday.
      </p>
      <p>
        The gift log records items you have already given and preferences learned through
        Secret Notes, related dialogue, and other discoveries. Open the recipient&apos;s row
        before choosing an item.
        Universal likes and loves are useful shortcuts, but the Friendship page records
        exceptions: Haley hates a Prismatic Shard, and Penny hates a Rabbit&apos;s Foot.
        Individual taste wins over a broad label.
      </p>
      <p>
        A phone call does not count as talking to the villager for the day. If you are
        planning a birthday route, reserve the valuable item for the correct date, check
        the recipient&apos;s location, and treat the two ordinary gift slots separately.
        This keeps an efficient route from turning into a list of assumptions.
      </p>

      <h2>Use the Social tab before you use a map</h2>
      <p>
        A map answers “where could this person be?” The Social tab answers “what kind of
        relationship is this?” Start with the Social tab when you cannot tell whether a
        character is a romance option, a normal friend, or a quest-only NPC. A greyed
        final pair of hearts points to the eight-heart romance cap. A normal meter points
        to the giftable relationship system. No normal meter tells you to look for a
        quest, donation, shop, or access requirement instead.
      </p>
      <p>
        Then consult the individual schedule. Named characters follow daily routines and
        can move between town, work, festivals, islands, and story locations. An address
        is not an all-day position. This two-step check reduces wrong searches without
        pretending that a generic NPC list knows the current time, weather, or event in
        your save.
      </p>

      <h3>Read the NPC list as a decision system</h3>
      <p>
        The roster is more useful when each name is attached to the next decision. A
        marriage candidate needs a relationship route, a Bouquet checkpoint, and later
        marriage requirements. A giftable non-marriage villager needs a preference log
        and a realistic meeting route, but not a romance plan. A non-giftable NPC needs
        a progression note: perhaps a donation, a guild goal, a shop interaction, or a
        destination unlock. Putting all three into one undifferentiated checklist makes
        the list look complete while hiding the action that actually moves the save.
      </p>
      <p>
        You can make the distinction visible without building a complicated tracking
        system. Give every target three labels in your own notes: relationship type,
        meeting area, and next action. “Giftable, Mountain, talk and bring liked item” is
        a different note from “non-giftable, Museum, make donation.” The labels also make
        it easier to remove a target when a new season or quest changes the route.
      </p>
      <ul>
        <li><strong>Relationship type:</strong> marriage, friendship, roommate, or progression.</li>
        <li><strong>Meeting area:</strong> town, Mountain, Forest, Beach, Desert, Island, or Farm.</li>
        <li><strong>Next action:</strong> talk, gift, quest, donation, purchase, or unlock.</li>
        <li><strong>Timing risk:</strong> birthday, weather route, festival, or a location gate.</li>
        <li><strong>Farm connection:</strong> building, tool, animal, crop, or no layout effect.</li>
      </ul>
      <p>
        This small classification also protects the list from version drift. If a future
        update changes a schedule, you only need to refresh the timing label. If a mod
        adds a character, you can keep that character outside the vanilla 46-person count
        while still recording the modded route. A clean boundary is more trustworthy than
        a larger number that quietly mixes different content sets.
      </p>

      <h3>Build a route that starts with the farm, not the map</h3>
      <p>
        Start from work you already have to do. If you are buying seeds, add a resident
        whose path crosses town. If you are visiting the Mountain, add a resident who can
        be met there. If you are heading to the Beach, decide whether the gift is worth
        extending the trip. A friendship route should reduce repeated walking, because
        the farm still needs watering, harvesting, mining, fishing, and tool management.
      </p>
      <ol>
        <li>Choose one urgent service or quest before adding optional relationship stops.</li>
        <li>Choose one or two nearby villagers whose gifts are already in your inventory.</li>
        <li>Check the Social tab so the target is not at the weekly gift limit.</li>
        <li>Leave a remote target for a day when that area is already your destination.</li>
        <li>End the route when the farm deadline is more valuable than another conversation.</li>
      </ol>
      <p>
        A route can be successful even when it does not raise every meter every week. The
        point is to make the next interaction obvious and affordable. Use birthdays for
        the items that justify a dedicated trip, use ordinary gifts when they fit an
        existing path, and use quests or heart events when the relationship system asks
        for something other than an item. The list becomes a tool for choosing effort,
        not a reason to spend the whole day crossing the map.
      </p>

      <h2>Turn the list into a weekly route</h2>
      <p>
        A complete roster is a reference, not a demand to visit 46 people every week.
        Pick a small target set that matches your current goal: one marriage candidate,
        one service NPC, and one villager whose route crosses an errand you already need
        to make. Store repeatable gifts near that route and keep birthday items separate.
      </p>
      <ol>
        <li>Check the Social tab and identify the relationship category.</li>
        <li>Open the character schedule and choose a realistic meeting place and time.</li>
        <li>Talk during a shop, mine, beach, forest, or farm trip that already exists.</li>
        <li>Use the gift log to avoid a disliked item and to track the two weekly slots.</li>
        <li>Drop optional stops when weather, festivals, or farm work make the route too long.</li>
      </ol>
      <p>
        The best route is the one you can repeat while the farm is busy. A shorter path
        that survives a rainy day is more useful than a perfect loop that only works when
        every NPC is in a remembered location. When the target is non-giftable, replace
        this route with the relevant quest or progression checklist.
      </p>

      <h3>Keep the roster honest in a long save</h3>
      <p>
        A long save changes the reason you visit people. Early on, the Introductions
        quest and nearby conversations make a broad town loop reasonable. Later, the
        same player may be balancing marriage hearts, a birthday gift, a building
        appointment, a tool upgrade, a Ginger Island trip, and a festival. The roster
        has not become less useful; your route has become more selective. Reclassify a
        name when the next action changes instead of keeping an old weekly promise.
      </p>
      <p>
        The Social tab is also a record of what your save has actually unlocked. A name
        may be known but still have a restricted room, an inaccessible destination, or a
        relationship cap. A schedule page can explain where a character travels, while
        the game menu shows whether the current interaction is available. Keep those
        layers separate and your notes remain useful after a season, a farm expansion,
        or a new story milestone.
      </p>
      <ul>
        <li>Refresh the target list at the start of a new season.</li>
        <li>Move birthday targets into a separate reminder from ordinary gifts.</li>
        <li>Replace a completed quest target with the next progression action.</li>
        <li>Keep modded characters outside the vanilla count and label their source.</li>
      </ul>
      <p>
        If you use the list beside the <a className="blog-planner-link" href="/">farm planner</a>, only connect the names that change the
        physical plan. Robin may require a building footprint, Marnie may require animal
        space, and a tool upgrade may require a clear work window. A villager who only
        affects dialogue can stay on the relationship route without receiving a map
        marker. This keeps the reference helpful without turning every social goal into
        a layout project.
      </p>
      <p>
        Keep the source boundary visible in your own notes as well. The vanilla roster is
        the 46-character answer; a modded roster is a different answer with different
        routes and requirements. When a page mixes them, record which list supplied the
        name before you compare counts or plan a gift run.
      </p>

      <h2>Separate romance, roommate, and friendship goals</h2>
      <p>
        The three relationship outcomes are easy to mix together. Marriage candidates
        unlock the last two ordinary hearts with a Bouquet and can later accept a
        Mermaid&apos;s Pendant. Krobus follows a roommate path with a Void Ghost Pendant.
        Other giftable villagers can reach a full friendship meter and show heart events,
        but their route does not become dating or marriage. The heart meter is therefore
        evidence of friendship progress, not proof that every character is romanceable.
      </p>
      <p>
        This distinction also matters for farm layout. A spouse or roommate moves into
        the farmhouse, while a service NPC may change your building, tool, animal, or
        resource plan without ever moving in. Decide the relationship system first, then
        decide how much calendar time and farm space it deserves.
      </p>

      <h2>Connect NPC services to farm decisions</h2>
      <div
        aria-label="Stardew Valley NPC service planning"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">NPC</th>
              <th scope="col">What the interaction changes</th>
              <th scope="col">Plan before visiting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Robin</td>
              <td>Farm buildings, farmhouse work, and building changes</td>
              <td>Reserve a valid footprint and an everyday route.</td>
            </tr>
            <tr>
              <td>Marnie</td>
              <td>Livestock and animal supplies</td>
              <td>Build the right Coop or Barn before buying animals.</td>
            </tr>
            <tr>
              <td>Pierre</td>
              <td>Seeds and seasonal farming stock</td>
              <td>Measure the field you can maintain before buying.</td>
            </tr>
            <tr>
              <td>Clint</td>
              <td>Tool upgrades and geode processing</td>
              <td>Choose days when the missing tool will not stop farm work.</td>
            </tr>
            <tr>
              <td>Willy</td>
              <td>Fishing gear and the boat path later in the game</td>
              <td>Budget gear and future island access together.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The NPC list becomes useful when it exposes dependencies. Robin&apos;s building
        changes need land. Marnie&apos;s animals need a completed building and usable space.
        Clint&apos;s upgrade removes a tool temporarily. A relationship guide can identify
        the person, but the in-game menu still decides the current cost, requirement, or
        schedule. Keep the list as a decision index rather than a replacement for those
        live checks. For Robin&apos;s counter rules, use the <a href="/carpenter-stardew">Carpenter guide</a> and the <a href="/where-is-robin-stardew-valley">Robin schedule guide</a>.
      </p>

      <h3>Common mistakes when searching the NPC list</h3>
      <ul>
        <li>Counting children, monsters, farm animals, or the player as villagers.</li>
        <li>Using the 12-person marriage list as if it contained every giftable villager.</li>
        <li>Assuming a giftable character is automatically a dating option.</li>
        <li>Using a home address as proof that the NPC is there right now.</li>
        <li>Applying universal-gift rules without checking character-specific exceptions.</li>
        <li>Looking for a heart meter when the next step is actually a quest or donation.</li>
        <li>Planning a route for a modded character as if it belonged to the vanilla roster.</li>
      </ul>
      <p>
        When a search fails, write down the exact symptom: the portrait is missing, the
        room is locked, the gift is rejected, the counter is closed, or the event does
        not trigger. That observation tells you whether to open a schedule page, the
        Friendship page, an NPC page, or a progression guide. Precise symptoms beat a
        longer but less relevant list.
      </p>
      <p>Keep the final count tied to the source roster.</p>

      <h2>Stardew Valley NPC FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "How many NPCs are in the Stardew Valley roster?",
            answer: (
              <p>
                The current Villagers roster lists 46 characters: 12 marriage candidates,
                22 other giftable villagers, and 12 non-giftable NPCs. It is a roster
                boundary, not a count of every creature or named figure in the game.
              </p>
            ),
          },
          {
            question: "How many Stardew Valley villagers can you marry?",
            answer: (
              <p>
                Twelve: Alex, Elliott, Harvey, Sam, Sebastian, Shane, Abigail, Emily,
                Haley, Leah, Maru, and Penny. Romance also requires the later Bouquet,
                farmhouse, and Mermaid&apos;s Pendant steps.
              </p>
            ),
          },
          {
            question: "Can you give gifts to every NPC?",
            answer: (
              <p>
                No. The roster has 34 giftable villagers and 12 non-giftable NPCs. The
                second group progresses through quests, donations, shops, challenges, or
                story conditions instead of the ordinary gift loop.
              </p>
            ),
          },
          {
            question: "How often can you give a villager a gift?",
            answer: (
              <p>
                Normally one gift per day and two gifts per week. A birthday gift is still
                allowed after the two weekly gifts and receives the birthday multiplier.
              </p>
            ),
          },
          {
            question: "Which NPC changes farm buildings?",
            answer: (
              <p>
                Robin handles ordinary farm buildings, farmhouse work, moving, and
                demolition through the Carpenter&apos;s Shop. The Wizard&apos;s late-game magic
                book handles separate magical farm-building options.
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="Sources"
        items={[
          { href: "https://wiki.stardewvalley.net/Villagers", label: "Stardew Valley Wiki: Villagers" },
          { href: "https://wiki.stardewvalley.net/Friendship", label: "Stardew Valley Wiki: Friendship" },
          { href: "https://wiki.stardewvalley.net/Robin", label: "Stardew Valley Wiki: Robin" },
          { href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop", label: "Stardew Valley Wiki: Carpenter's Shop" },
          { href: "https://wiki.stardewvalley.net/Marnie%27s_Ranch", label: "Stardew Valley Wiki: Marnie's Ranch" },
          { href: "https://wiki.stardewvalley.net/Pierre%27s_General_Store", label: "Stardew Valley Wiki: Pierre's General Store" },
          { href: "https://wiki.stardewvalley.net/Blacksmith", label: "Stardew Valley Wiki: Blacksmith" },
          { href: "https://wiki.stardewvalley.net/Fish_Shop", label: "Stardew Valley Wiki: Fish Shop" },
        ]}
      />
    </article>
  );
}
