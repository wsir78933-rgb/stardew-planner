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
  previewSource: string;
}>;

type ModFarmCardText = Readonly<{
  authorName: string;
  description: string;
}>;

const localGameAssetRoot = "/game-assets/1.6.15/";

const modFarmCardTexts: Readonly<Record<string, ModFarmCardText>> = {
  if2r: {
    authorName: "FlashShifter",
    description:
      "A huge plot of land optimized for multiplayer, or for solo players looking for a challenge. Features tillable grass, quests, and many secrets.",
  },
  frontier: {
    authorName: "FlashShifter",
    description:
      "The recommended farm for Stardew Valley Expanded. It features an expansive plot of land bordering the Ferngill Republic Frontier. Many different wild trees are rooted here and there are secrets to discover. You start with one pear tree.",
  },
  grandpas: {
    authorName: "FlashShifter",
    description:
      "A humble farm for Stardew Valley Expanded. Replaces the standard farm layout with modest farmland, tillable grass, different landmark locations, shortcuts, and secrets to discover.",
  },
  "capitalist-dream": {
    authorName: "DaisyNiko",
    description:
      "A very large, very organised farm map with dedicated crop and building areas.",
  },
  "capitalist-dream-2": {
    authorName: "DaisyNiko",
    description:
      "A large immersive farm map with quarry, hot spring, private beach, and more.",
  },
  "overgrown-garden": {
    authorName: "DaisyNiko",
    description: "A cute, messy, woodsy little forest farm map.",
  },
  "yet-another": {
    authorName: "DaisyNiko",
    description: "A roomy general-purpose farm layout.",
  },
  "solo-four-corners": {
    authorName: "DaisyNiko",
    description:
      "A reimagining of Four Corners suited to both single-player and multiplayer.",
  },
  "strawberry-fields": {
    authorName: "DaisyNiko",
    description: "An open farm map with plenty of room to build.",
  },
  "blackberry-fields": {
    authorName: "DaisyNiko",
    description: "A large new farm with quarry, forage, hardwood, and more.",
  },
  zenith: {
    authorName: "DaisyNiko",
    description:
      "A farm map high atop the mountains with a view of the valley below.",
  },
  everfarm: {
    authorName: "Draylon",
    description: "A huge farm map that replaces Four Corners (about 6× larger).",
  },
  "sea-breeze-island": {
    authorName: "collingbe",
    description: "A beach and island farm map with an ocean view.",
  },
  "aimon-s-small-hilltop": {
    authorName: "Aimon111",
    description:
      "A tidier take on the Hilltop Farm with a summit view and quality-of-life tweaks.",
  },
  "aimon-s-small-forest": {
    authorName: "Aimon111",
    description:
      "A tidier take on the Forest Farm with better fish pools, renewable hardwood stumps, and shortcuts to the surrounding forest.",
  },
  "more-lively-meadowlands": {
    authorName: "Aimon111",
    description:
      "A livelier Meadowlands Farm with extra space, an extra river branch with bridges, a pond, a water trough, and a dock.",
  },
  "modest-maps-standard": {
    authorName: "InkubusMods",
    description:
      "A modest, middle-ground redesign of the Standard farm: roomy but not oversized, with a tidier layout.",
  },
  "waterfall-forest": {
    authorName: "ArchibaldTK",
    description:
      "A lush Forest-style farm built around a waterfall, with extra water and foraging.",
  },
  "sve-winery": {
    authorName: "FlashShifter",
    description:
      "The Stardew Valley Expanded winery interior, available as a local planning map.",
  },
  "sve-grandpas-shed-1": {
    authorName: "FlashShifter",
    description:
      "The first floor of Stardew Valley Expanded's Grandpa's Shed, available as a local planning map.",
  },
  "sve-grandpas-shed-2": {
    authorName: "FlashShifter",
    description:
      "The second floor of Stardew Valley Expanded's Grandpa's Shed, available as a local planning map.",
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
    previewSource: `${localGameAssetRoot}${plannerMap.previewOutputPath}`,
  };
}

export function getModFarmCards(): readonly ModFarmCard[] {
  return plannerMaps.filter(isCommunityMap).map(createModFarmCard);
}
