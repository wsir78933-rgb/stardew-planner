import { createPublicPreviewSource } from "../assets/public-preview-source";
import { plannerMaps, type PlannerMap } from "../maps/map-catalog";

type CommunityMap = Extract<
  (typeof plannerMaps)[number],
  { category: "community-farm" | "community-interior" }
>;

export type ModFarmCard = Readonly<{
  id: string;
  displayName: string;
  authorName: string;
  description: string;
  bestFor: string;
  planningNote: string;
  mapKind: "farm" | "interior";
  sourceHref: string;
  previewSource: string;
}>;

type ModFarmCardText = Readonly<{
  authorName: string;
  description: string;
  bestFor: string;
  planningNote: string;
  sourceHref: string;
}>;

const modFarmCardTexts: Readonly<
  Record<CommunityMap["id"], ModFarmCardText>
> = {
  if2r: {
    authorName: "FlashShifter",
    description:
      "Immersive Farm 2 Remastered replaces the Standard Farm with a huge SVE map. It has tillable grass, a questline, hidden areas, and configuration choices that can remove fences or change the main crop field.",
    bestFor:
      "Co-op groups, large production districts, or solo saves built around long-term expansion.",
    planningNote:
      "Check the installed layout options before placing paths or buildings. Sandbox, fence, crop-field, greenhouse, and cave settings can make the in-game map differ from this preview.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Farm_Maps",
  },
  frontier: {
    authorName: "FlashShifter",
    description:
      "Frontier Farm is SVE's recommended farm map. The starting area borders the Ferngill Republic Frontier, while quests later open more farmland, a quarry cave, hot springs, and working farm minecarts.",
    bestFor:
      "Players who want to plan an active starting farm and reserve a second district for late-game crops or animals.",
    planningNote:
      "Treat the western expansion, minecarts, quarry, and hot springs as progression-locked areas. Configuration choices for fences, paths, bridges, and sandbox terrain also change usable space.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Farm_Maps",
  },
  grandpas: {
    authorName: "FlashShifter",
    description:
      "Grandpa's Farm replaces the Standard Farm with a medium-size SVE layout. It combines tillable grass, compact landmarks, shortcuts, two resource quests, and a larger farm area that becomes available later.",
    bestFor:
      "Solo players who prefer a manageable early layout but still want room to expand after completing SVE quests.",
    planningNote:
      "Keep quest-gated land and the bridge to Grandpa's Shed clear in a long-term plan. Sandbox layout and fence-removal settings can substantially change the central building area.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Farm_Maps",
  },
  "capitalist-dream": {
    authorName: "DaisyNiko",
    description:
      "Capitalist Dream Farm replaces the Standard Farm with a large, highly divided map. It includes dedicated crop and building areas, tillable grass, berry bushes, travel points, and optional clean or decorated layouts.",
    bestFor:
      "High-output farms that need separate crop blocks, animal yards, and building districts from the start.",
    planningNote:
      "Choose the clean or decorated file and the correct single-player or multiplayer setup first. Fixed bushes, travel points, and animal-area boundaries affect where paths and buildings fit.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/3679",
  },
  "capitalist-dream-2": {
    authorName: "DaisyNiko",
    description:
      "Capitalist Dream Farm 2 is a large Standard Farm replacement organized around iridium-sprinkler crop plots. Separate areas hold a quarry, renewable hardwood, forage, a hot spring, and a private beach.",
    bestFor:
      "Production-heavy saves that work best with predefined crop blocks and separate resource zones.",
    planningNote:
      "Plan around the fixed quarry, beach, hot spring, animal boundaries, and travel routes. The cave and minecart options are configurable, so match the planner to the files you installed.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/4572",
  },
  "overgrown-garden": {
    authorName: "DaisyNiko",
    description:
      "Overgrown Garden Farm replaces the Forest Farm with a small woodland layout. Its tighter shape, fixed greenery, and deliberately overgrown edges trade broad open fields for a compact garden setting.",
    bestFor:
      "Smaller crop plots, animals, and decorative builds that do not need a huge late-game factory floor.",
    planningNote:
      "Pick the standard or clean configuration before laying out the farm. Leave breathing room around fixed trees and decoration instead of treating every grassy tile as a building spot.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/3733",
  },
  "yet-another": {
    authorName: "DaisyNiko",
    description:
      "Yet Another Farm Map has multiple layouts, including versions with western and eastern areas, renewable hardwood on the east side, and an optional larger farm cave. A separate edition can add it as its own farm type.",
    bestFor:
      "Flexible mixed farms where crops, animals, and resource gathering need distinct but connected areas.",
    planningNote:
      "Confirm whether you installed the replacement or custom-farm edition, then match version 1 or 2 and the cave option. Those choices change the outline more than a small decoration toggle would.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/4159",
  },
  "solo-four-corners": {
    authorName: "DaisyNiko",
    description:
      "Solo Four Corners Farm replaces Four Corners with a layout that keeps its quadrant logic useful for one player. Optional fixed fences, an upgraded farm cave, water troughs, and animal-area boundaries shape each section.",
    bestFor:
      "Solo players who like assigning one quadrant to crops, livestock, trees, or processing, with co-op still possible.",
    planningNote:
      "Decide whether fences and the expanded cave are enabled before drawing cross-quadrant routes. Fixed troughs and animal boundaries can narrow gates or change where a barn yard works.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/6421",
  },
  "strawberry-fields": {
    authorName: "DaisyNiko",
    description:
      "Strawberry Fields Farm can replace the Standard Farm with an open layout split into several ready-made fields. Tillable grass, animal-area boundaries, waterfalls, and night lighting give the open ground a visible structure.",
    bestFor:
      "Crop-focused farms that want several separate sprinkler plots with buildings arranged between them.",
    planningNote:
      "Keep the waterfalls, lit features, entrances, and animal boundaries clear. They are part of the map, not objects that the planner can move after the rest of the layout is finished.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/3856",
  },
  "blackberry-fields": {
    authorName: "DaisyNiko",
    description:
      "Blackberry Fields Farm is a large map with dedicated quarry, forage, and renewable-hardwood areas. Optional animal boundaries, a larger cave, and minecart or boat shortcuts add more fixed-purpose zones.",
    bestFor:
      "Long saves that combine large production districts with on-farm resource gathering and fast travel.",
    planningNote:
      "Check which vanilla farm this installation replaces and keep the matching map and Farm Type Manager settings together. Cave, shortcut, and animal-area options also affect the usable layout.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/8838",
  },
  zenith: {
    authorName: "DaisyNiko",
    description:
      "Zenith Farm is a custom mountain farm rather than a replacement for a vanilla farm type. A ravine divides the main space, while tillable grass, seasonal forage, berry bushes, hardwood, and optional travel features fill the slopes.",
    bestFor:
      "Scenic farms that use the ravine as a natural line between crops, animals, and decorative areas.",
    planningNote:
      "Reserve space around the ravine, bridge, panorama edge, warp point, and optional minecart. Decorative, stone-bridge, debris, and shortcut settings should match the installed configuration.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/15618",
  },
  everfarm: {
    authorName: "Draylon",
    description:
      "Everfarm replaces Four Corners with a map roughly six times its size. Its broad districts borrow ideas and resource features from the vanilla farm types, with Farm Type Manager handling forage and renewable stumps.",
    bestFor:
      "Very large solo projects or multiplayer farms that need separate crop, livestock, forest, and water districts.",
    planningNote:
      "Draw main roads and district boundaries before filling individual plots. The planner shows geometry and vanilla placeables, not every forage or resource-spawn rule provided by Farm Type Manager.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/9347",
  },
  "sea-breeze-island": {
    authorName: "collingbe",
    description:
      "Sea Breeze Island Farm is a coastal Content Patcher map built around island terrain and wide ocean views. The current author page also documents sunset scenery and an optional resource file without windows.",
    bestFor:
      "Decorative coastal layouts with compact building clusters, open sightlines, and paths that follow the shoreline.",
    planningNote:
      "Leave clear routes around water, bridges, and map exits, then verify buildable tiles in the installed release. The island theme alone does not guarantee vanilla Beach Farm fishing or sprinkler rules.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/10510",
  },
  "aimon-s-small-hilltop": {
    authorName: "Aimon111",
    description:
      "Aimon's Small Hilltop Farm comes as a custom farm or a Hill-top Farm replacement. It adds a summit view, a second small quarry, a minecart, a forage corner, and configurable bridges, fences, and travel points.",
    bestFor:
      "Compact solo farms that keep mining space separate from crops and buildings without using a giant map.",
    planningNote:
      "Choose the custom or replacement edition first. Keep narrow bridges, slopes, quarry edges, and travel points open, and check configuration switches before treating a blocked route as permanent.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/24690",
  },
  "aimon-s-small-forest": {
    authorName: "Aimon111",
    description:
      "Aimon's Small Forest Farm is available as a custom farm or Forest Farm replacement. It has tillable grass, distinct fishing pools, renewable hardwood stumps, and configurable ponds, bridges, and forest exits.",
    bestFor:
      "Compact forage-focused farms where hardwood, small crop plots, and short walking routes matter more than maximum acreage.",
    planningNote:
      "Leave the stump area, warps, and chosen ponds accessible. The custom and replacement editions have different compatibility boundaries, and optional water or bridge settings change path placement.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/24680",
  },
  "more-lively-meadowlands": {
    authorName: "Aimon111",
    description:
      "More Lively Meadowlands reshapes the Meadowlands Farm with more usable ground, an extra river branch, bridges, a lake, a pond, a water trough, a dock, and a renewable hardwood area.",
    bestFor:
      "Ranching layouts that keep the Meadowlands identity but need clearer zones for animals, crops, and waterfront paths.",
    planningNote:
      "Use the river and bridges as fixed district lines. Forest exits, an extra quarry cave, grass behavior, and some routes are configurable, so plan against the options in the installed file.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/21694",
  },
  "modest-maps-standard": {
    authorName: "InkubusMods",
    description:
      "Modest Maps Standard Farm redesigns the Standard Farm without turning it into an oversized map. It adds a backyard for late-game structures, a refill trough, cliff niches, and configurable pond positions.",
    bestFor:
      "Players who want a cleaner Standard-style layout with balanced space for crops, animals, and utility buildings.",
    planningNote:
      "Choose the pond variant before the first load and match it in the planner. The backyard and cliff niches suit specific building sizes, so reserve them before filling the main field.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/7228",
  },
  "waterfall-forest": {
    authorName: "ArchibaldTK",
    description:
      "Waterfall Forest Farm is a custom farm type with tillable grass, forest forage, renewable stumps, a southeast quarry, and optional caves, healing water, travel points, and beach styles. WaFFLE is the larger edition.",
    bestFor:
      "Detailed forest layouts that divide farming, gathering, mining, and multiplayer buildings across several connected areas.",
    planningNote:
      "Confirm WaFF or WaFFLE and every optional area before planning. The editor shows the selected map geometry, but it does not reproduce healing, forage, cave, upgrade, or spawn mechanics.",
    sourceHref: "https://www.nexusmods.com/stardewvalley/mods/8913",
  },
  "sve-winery": {
    authorName: "FlashShifter",
    description:
      "The Winery is an SVE farm building, not a replacement farm map. After it becomes available through game progress, its interior provides a dedicated production space where installed SVE rules make casks work faster.",
    bestFor:
      "Late-game wine production layouts that need orderly cask rows and a short route from the entrance to each aisle.",
    planningNote:
      "Plan the interior only after reserving the building's 12 by 5 outdoor footprint. The editor does not unlock the Winery or simulate its cost, construction time, or production-speed bonus.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Winery",
  },
  "sve-grandpas-shed-1": {
    authorName: "FlashShifter",
    description:
      "Grandpa's Shed Floor 1 is the refurbished lower interior of an SVE quest building, not a farm map. Once repaired, the cellar can hold machines and casks, with the stair route taking priority over maximum tile use.",
    bestFor:
      "Large cask or machine layouts that use straight aisles and keep the entrance-to-stairs route easy to follow.",
    planningNote:
      "Keep the stair passage open instead of filling every placeable tile. The editor can arrange the room, but access, repair materials, cask availability, and quest progress still belong to the game.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Grandpa%27s_Shed",
  },
  "sve-grandpas-shed-2": {
    authorName: "FlashShifter",
    description:
      "Grandpa's Shed Floor 2 is the greenhouse level revealed after the SVE shed restoration. Its 10 by 15 growing area provides 150 crop spaces, while a configuration option can remove permanent decorations.",
    bestFor:
      "Year-round crop rows, fruit-tree planning, or a mixed greenhouse layout above the first-floor production room.",
    planningNote:
      "Match the decoration setting before filling the plan and preserve the route back downstairs. This room remains locked behind SVE progress even when its geometry is available in the editor.",
    sourceHref: "https://stardewvalleyexpanded.wiki.gg/wiki/Grandpa%27s_Shed",
  },
};

function isCommunityMap(
  plannerMap: PlannerMap,
): plannerMap is CommunityMap {
  return (
    plannerMap.category === "community-farm" ||
    plannerMap.category === "community-interior"
  );
}

function createModFarmCard(plannerMap: CommunityMap): ModFarmCard {
  const cardText = modFarmCardTexts[plannerMap.id];

  if (!cardText) {
    throw new Error(
      `Community farm ${plannerMap.id} is missing public card text.`,
    );
  }

  return {
    id: plannerMap.id,
    displayName: plannerMap.displayName,
    authorName: cardText.authorName,
    description: cardText.description,
    bestFor: cardText.bestFor,
    planningNote: cardText.planningNote,
    mapKind: plannerMap.category === "community-farm" ? "farm" : "interior",
    sourceHref: cardText.sourceHref,
    previewSource: createPublicPreviewSource(plannerMap.previewOutputPath),
  };
}

export function getModFarmCards(): readonly ModFarmCard[] {
  return plannerMaps.filter(isCommunityMap).map(createModFarmCard);
}
