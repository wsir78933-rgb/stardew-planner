import { createPublicPreviewSource } from "../assets/public-preview-source";
import { getPlannerMapById } from "../maps/map-catalog";

export const officialFarmTypes = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

export type OfficialFarmType = (typeof officialFarmTypes)[number];

export type OfficialFarmGuide = Readonly<{
  id: OfficialFarmType;
  title: string;
  previewSource: string;
  introduction: string;
  tillableTiles: string;
  totalBuildableTiles: string;
  addedIn: string;
  bestFor: string;
  features: readonly string[];
  note?: string;
}>;

type OfficialFarmGuideText = Omit<
  OfficialFarmGuide,
  "id" | "title" | "previewSource"
>;

const officialFarmGuideTexts: Readonly<
  Record<OfficialFarmType, OfficialFarmGuideText>
> = {
  standard: {
    introduction:
      "The original Stardew Valley farm and still the one that puts the most tillable tiles at your disposal. No unique mechanics or spawns, just room. If you want to plan a high-profit crop run with no caveats, this is the map.",
    tillableTiles: "3,427",
    totalBuildableTiles: "3,662",
    addedIn: "1.0",
    bestFor: "Highest raw crop output and full layout flexibility.",
    features: [
      "Biggest contiguous tillable rectangle of any farm: 63 × 31 tiles",
      "No unique mechanics or free starter items, other than the 15 parsnip seeds every farm starts with",
    ],
  },
  riverland: {
    introduction:
      "A river-focused farm with islands, bridges, and on-farm fishing. It gives up crop space for a layout built around water.",
    tillableTiles: "1,578",
    totalBuildableTiles: "2,094",
    addedIn: "1.1",
    bestFor:
      "Fishing runs. Most of Pelican Town's pool is catchable without leaving home.",
    features: [
      "Rivers occupy most of the south half",
      "On-farm fishing: 70% town river fish, 30% Cindersap Forest fish",
      "Bubble Spots can randomly appear here (not on any other farm)",
      "6 bushes can be chopped with a copper or better axe",
      "1.6: starts with a free Fish Smoker",
    ],
  },
  forest: {
    introduction:
      "A wooded farm with renewable hardwood and daily seasonal forage. Its western clearings trade large crop fields for dependable resources.",
    tillableTiles: "1,413",
    totalBuildableTiles: "2,903",
    addedIn: "1.1",
    bestFor:
      "Hardwood and forage passive income. Good match for the Foraging profession.",
    features: [
      "8 Large Stumps (hardwood) in the western clearings, renewable daily",
      "Seasonal forage respawns daily (4 items per season, equal chance)",
      "Unique weeds that always drop Mixed Seeds",
      "Fishing: 5% Woodskip (plus daily luck), 45% Cindersap Forest fish, rest trash",
      "16 bushes can be chopped with a copper or better axe",
    ],
  },
  hilltop: {
    introduction:
      "A tiered farm cut by cliffs and waterways, with a small quarry in the southwest. Routes between its plateaus matter as much as placement space.",
    tillableTiles: "1,648",
    totalBuildableTiles: "2,578",
    addedIn: "1.1",
    bestFor:
      "Mining-heavy runs. A steady passive trickle of stone and ore from day one.",
    features: [
      "Southwest mini-quarry spawns stone, ore, and geode nodes",
      "Around 2.4 nodes per day on a cleared quarry, plus a 15% artifact spot chance",
      "Geode type tracks Mining level: under 5 only Geode; 5 to 7 Geode or Frozen; 8 and up any geode",
      "Iron nodes unlock at Mining level 4",
      "Cliffs split the farm into tiered sections",
    ],
  },
  wilderness: {
    introduction:
      "A spacious map where monsters can appear after dark. It is a combat-focused alternative with a central pond and split growing areas.",
    tillableTiles: "2,131",
    totalBuildableTiles: "2,575",
    addedIn: "1.1",
    bestFor:
      "Combat farming. The only farm that spawns Iridium Golems, and the best Living Hat drop rate in the game.",
    features: [
      "Monsters spawn at night. Type and count scale with your Combat level",
      "Wilderness Golems: the only farm-native Living Hat source (one in 10,000 per kill)",
      "Iridium Golems at Combat level 9 and above, 50% spawn chance, drop Iridium Ore and seed-spot seeds (1.6+)",
      "On-farm fishing: 35% Mountain-lake fish, 65% trash",
      "1.6: on-farm combat XP reduced to a third of normal",
    ],
    note:
      "Monsters spawn on the farm after dark. They will not damage crops, buildings, or animals. Only the player is at risk.",
  },
  "four-corners": {
    introduction:
      "Four connected farm areas combine familiar terrain styles in one map. It was designed for groups but is also useful for separating a solo layout into zones.",
    tillableTiles: "2,952",
    totalBuildableTiles: "3,514",
    addedIn: "1.4",
    bestFor:
      "Multiplayer runs. Solo players get a taste of every farm in one map.",
    features: [
      "Four quadrants, each a nod to a different farm:",
      "Top left: Forest feel, Large Stump and mixed-seed weeds",
      "Top right: Standard feel, the biggest crop area",
      "Bottom left: pond with a 50% chance of Cindersap Forest pond fish",
      "Bottom right: Hill-top mini-quarry with stone, ore, geodes",
      "Designed for multiplayer, one quadrant per player",
    ],
  },
  beach: {
    introduction:
      "A large coastal farm with ocean fishing, forage, and broad sandy building space. Its soil makes sprinkler planning the central constraint.",
    tillableTiles: "2,700",
    totalBuildableTiles: "4,628",
    addedIn: "1.5",
    bestFor: "Fishing, foraging, scenic ocean builds, and ranch layouts.",
    features: [
      "Ocean fishing from the south shore: 53% ocean fish, 15% seaweed, 5% random shell item (oyster, coral, mussel, cockle), 27% trash",
      "Supply Crates occasionally wash up on the beach",
      "Both forest and beach forage spawn. Beach forage can spawn any season",
      "Grass grows on sand, so animals can graze anywhere",
      "15 bushes can be chopped with a copper or better axe",
    ],
    note:
      "Sprinklers do not work on sandy tiles. Only about 230 tiles on the whole farm are non-sandy: one 10 × 20 patch plus roughly 28 scattered near ponds. Plan crops around those or lean into animals and buildings, which do not care about sand.",
  },
  meadowlands: {
    introduction:
      "A ranching-oriented farm that begins with a coop, chickens, and Blue Grass. It has extensive building space while keeping enough ground for animal-focused layouts.",
    tillableTiles: "2,066",
    totalBuildableTiles: "4,207",
    addedIn: "1.6",
    bestFor: "Ranching. Blue Grass removes the winter hay scramble.",
    features: [
      "Starts with a pre-built Coop and 2 randomly-named chickens",
      "Mayor Lewis gives 15 Hay instead of the usual 15 Parsnip Seeds",
      "Blue Grass patches regrow year-round (including winter). Animals love it",
      "More non-tillable-but-buildable space than any other farm",
      "On-farm fishing: 40% Cindersap Forest pond fish, 60% trash",
    ],
  },
};

function createOfficialFarmGuide(
  farmType: OfficialFarmType,
): OfficialFarmGuide {
  const plannerMap = getPlannerMapById(farmType);

  if (plannerMap.category !== "farm") {
    throw new Error(
      `Official farm ${farmType} must use the farm category. Received: ${plannerMap.category}.`,
    );
  }

  return {
    id: farmType,
    title: plannerMap.displayName,
    previewSource: createPublicPreviewSource(plannerMap.previewOutputPath),
    ...officialFarmGuideTexts[farmType],
  };
}

export const officialFarmGuides: Readonly<
  Record<OfficialFarmType, OfficialFarmGuide>
> = Object.fromEntries(
  officialFarmTypes.map((farmType) => [
    farmType,
    createOfficialFarmGuide(farmType),
  ]),
) as Record<OfficialFarmType, OfficialFarmGuide>;

export function getOfficialFarmGuide(
  farmType: string,
): OfficialFarmGuide | undefined {
  if (!isOfficialFarmType(farmType)) {
    return undefined;
  }

  return officialFarmGuides[farmType];
}

export function isOfficialFarmType(
  farmType: string,
): farmType is OfficialFarmType {
  return officialFarmTypes.includes(farmType as OfficialFarmType);
}
