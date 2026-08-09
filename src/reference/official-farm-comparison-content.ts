import {
  officialFarmGuides,
  officialFarmTypes,
  type OfficialFarmGuide,
  type OfficialFarmType,
} from "./official-farm-guides";

export const officialFarmComparisonSourceHref =
  "https://wiki.stardewvalley.net/Farm_Maps";

export type OfficialFarmComparisonText = Readonly<{
  summary: string;
  bestFor: string;
  tradeoff: string;
  planningNote: string;
  knownFor: string;
  facts: readonly string[];
}>;

export type OfficialFarmComparisonCard = Readonly<
  Pick<
    OfficialFarmGuide,
    | "id"
    | "title"
    | "previewSource"
    | "tillableTiles"
    | "totalBuildableTiles"
    | "addedIn"
  > &
    OfficialFarmComparisonText
>;

const officialFarmComparisonTexts: Readonly<
  Record<OfficialFarmType, OfficialFarmComparisonText>
> = {
  standard: {
    summary:
      "Most of the map is one open field, so crop grids, barns, sheds, and paths can move as the farm grows.",
    bestFor:
      "First saves, large sprinkler fields, and mixed farms that need room to change.",
    tradeoff:
      "It has no special resource area or starter machine. The trade-off is simple: its advantage is space.",
    planningNote:
      "Set the main roads before filling the center. The 63 × 31 rectangle is the largest continuous crop block, not the map's full tillable area.",
    knownFor: "The most tillable space",
    facts: [
      "3,427 tillable tiles, the highest total of the eight farm maps",
      "The largest continuous tillable rectangle is 63 × 31 tiles",
    ],
  },
  riverland: {
    summary:
      "Rivers divide the farm into islands and compact plots, with bridges carrying most cross-farm traffic.",
    bestFor:
      "Players who want to fish at home and do not need one large crop field.",
    tradeoff:
      "Water significantly reduces the farming area and breaks the remaining land into smaller plots.",
    planningNote:
      "Choose the bridge routes before placing buildings. A blocked island entrance can turn a short daily route into a long loop.",
    knownFor: "On-farm fishing and a Fish Smoker",
    facts: [
      "Farm fishing catches town river fish 70% of the time and forest fish 30% of the time",
      "Random Bubble Spots can appear here, unlike on the other farm maps",
      "Version 1.6 added a Fish Smoker to the starting equipment",
    ],
  },
  forest: {
    summary:
      "Wooded clearings create several smaller work areas instead of one uninterrupted crop field.",
    bestFor:
      "Renewable hardwood, seasonal forage, and a compact farm built around natural edges.",
    tradeoff:
      "Ponds, grass, and fixed vegetation reduce the crop area to 1,413 tillable tiles.",
    planningNote:
      "Keep a clear route to the western clearings if you want to collect their recurring hardwood and forage.",
    knownFor: "Renewable hardwood and forage",
    facts: [
      "Eight Large Stumps in the western clearings renew each day",
      "Seasonal forage and weeds that always drop Mixed Seeds appear in the western clearings",
      "Woodskip can be caught on the farm, with the chance affected by daily luck",
    ],
  },
  hilltop: {
    summary:
      "Cliffs and a stream split the map into tiers, while a small quarry occupies the southwest corner.",
    bestFor:
      "Mining-themed saves and players who prefer several deliberate zones over one open field.",
    tradeoff:
      "The bridges and elevation changes restrict direct routes and break up sprinkler fields.",
    planningNote:
      "Keep the southwest quarry clear enough for new nodes, and settle the bridge routes before filling each tier.",
    knownFor: "A farm quarry with level-based nodes",
    facts: [
      "The quarry can spawn stone, ore, and geode nodes",
      "Node types improve with Mining level, so the quarry changes as the save progresses",
    ],
  },
  wilderness: {
    summary:
      "A large central pond separates the growing areas, and monsters can appear on the farm after dark.",
    bestFor:
      "Players who want a farm where the route home still matters after dark.",
    tradeoff:
      "Farm monsters award only one third of normal Combat experience, so the map is not a fast leveling shortcut.",
    planningNote:
      "Keep the route from the southern entrance to the farmhouse direct for late nights.",
    knownFor: "Night monsters and Iridium Golems",
    facts: [
      "Night monster types and counts scale with the player's Combat level",
      "At Combat level 9 or higher, this farm can spawn Iridium Golems",
      "Farm monster Combat experience was reduced to one third in version 1.6",
    ],
  },
  "four-corners": {
    summary:
      "Four natural zones combine a large crop area, a pond, a stump clearing, and a small quarry.",
    bestFor:
      "Co-op groups, or solo farms that separate crops, animals, resources, and processing.",
    tradeoff:
      "The cliffs and connecting lanes make the land less continuous than Standard Farm.",
    planningNote:
      "Give each quadrant a job before adding paths and buildings, so daily trips between corners stay manageable.",
    knownFor: "Four zones with mixed farm perks",
    facts: [
      "The top-left quadrant has a renewable Large Stump and mixed-seed weeds",
      "The bottom-right quadrant has a small level-based quarry",
      "The map has 2,952 tillable tiles and was designed with multiplayer in mind",
    ],
  },
  beach: {
    summary:
      "The map has broad coastal space for buildings and animals, but most of its tillable ground is sand.",
    bestFor:
      "Ocean fishing, forage, animal yards, coastal builds, or crops that do not depend on large sprinkler grids.",
    tradeoff:
      "Sprinklers do not work on sandy tiles, even though those tiles can still be tilled and watered by hand.",
    planningNote:
      "Reserve the 202 connected sprinkler-friendly tiles and 28 scattered soil tiles before laying out automated crops.",
    knownFor: "Coastal resources and a sprinkler limit",
    facts: [
      "Supply Crates can wash ashore and both forest and beach forage can appear",
      "The south shore can produce ocean fish, seaweed, shell items, or trash",
      "You can still place buildings and fish ponds on sand, and grass still grows there",
    ],
  },
  meadowlands: {
    summary:
      "This ranching map starts with an animal area and has more buildable non-crop space than tillable ground.",
    bestFor:
      "Animal-focused starts and farms that want generous room for coops, barns, and processing buildings.",
    tradeoff:
      "Its 2,066 tillable tiles are split by water and terrain, so large crop grids need more planning than on Standard Farm.",
    planningNote:
      "Treat the starting coop, chickens, and Blue Grass as a useful first zone, not a rule for the whole save.",
    knownFor: "Blue Grass, a Coop, and two chickens",
    facts: [
      "The save begins with a Coop and two randomly named chickens",
      "The player receives 15 Hay instead of 15 Parsnip Seeds",
      "Blue Grass is more efficient animal feed, but outdoor grass does not spread during winter",
    ],
  },
};

export function getOfficialFarmComparisonCards(): readonly OfficialFarmComparisonCard[] {
  return officialFarmTypes.map((farmType) => ({
    id: officialFarmGuides[farmType].id,
    title: officialFarmGuides[farmType].title,
    previewSource: officialFarmGuides[farmType].previewSource,
    tillableTiles: officialFarmGuides[farmType].tillableTiles,
    totalBuildableTiles: officialFarmGuides[farmType].totalBuildableTiles,
    addedIn: officialFarmGuides[farmType].addedIn,
    ...officialFarmComparisonTexts[farmType],
  }));
}
