export const cropSeasons = ["spring", "summer", "fall", "winter"] as const;

export type CropSeason = (typeof cropSeasons)[number];

export type CropMachineOutput = {
  readonly price: number;
  readonly processingMinutes: number;
};

export type CropDehydratorOutput = CropMachineOutput & {
  readonly batchSize: 5;
};

export type CropCatalogEntry = {
  readonly id: string;
  readonly englishName: string;
  readonly chineseName: string;
  readonly seasons: readonly CropSeason[];
  readonly growthStageDays: readonly number[];
  readonly regrowDays: number | null;
  readonly yieldMin: number;
  readonly yieldMax: number;
  readonly sellPrice: number;
  readonly pierreYear1SeedPrice: number | null;
  readonly pierreYear2SeedPrice: number | null;
  readonly oasisOrFestivalSeedPrice: number | null;
  readonly keg: CropMachineOutput | null;
  readonly jar: CropMachineOutput | null;
  readonly dehydrator: CropDehydratorOutput | null;
};

type CropProcessingRoute = "fruit" | "grape" | "vegetable" | "hops" | "wheat";

type PurchasableCropSource = {
  readonly id: string;
  readonly englishName: string;
  readonly chineseName: string;
  readonly seasons: readonly CropSeason[];
  readonly growthStageDays: readonly number[];
  readonly regrowDays: number | null;
  readonly yieldMin: number;
  readonly yieldMax: number;
  readonly sellPrice: number;
  readonly pierreYear1SeedPrice: number | null;
  readonly pierreYear2SeedPrice: number | null;
  readonly oasisOrFestivalSeedPrice: number | null;
  readonly route: CropProcessingRoute;
};

const WINE_PROCESSING_MINUTES = 10_000;
const JUICE_PROCESSING_MINUTES = 6_000;
const JAR_PROCESSING_MINUTES = 4_000;
const DRIED_PROCESSING_MINUTES = 1_750;
const PALE_ALE_PROCESSING_MINUTES = 2_250;
const BEER_PROCESSING_MINUTES = 1_750;
const DEHYDRATOR_BATCH_SIZE = 5;
const PALE_ALE_PRICE = 300;
const BEER_PRICE = 200;
const RAISIN_PRICE = 600;

const purchasableCropSources: readonly PurchasableCropSource[] = [
  {
    id: "amaranth",
    englishName: "Amaranth",
    chineseName: "苋菜",
    seasons: ["fall"],
    growthStageDays: [1, 2, 2, 2],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 150,
    pierreYear1SeedPrice: 70,
    pierreYear2SeedPrice: 70,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "artichoke",
    englishName: "Artichoke",
    chineseName: "洋蓟",
    seasons: ["fall"],
    growthStageDays: [2, 2, 1, 2, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 160,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: 30,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "beet",
    englishName: "Beet",
    chineseName: "甜菜",
    seasons: ["fall"],
    growthStageDays: [1, 1, 2, 2],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 100,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: 20,
    route: "vegetable",
  },
  {
    id: "blueberry",
    englishName: "Blueberry",
    chineseName: "蓝莓",
    seasons: ["summer"],
    growthStageDays: [1, 3, 3, 4, 2],
    regrowDays: 4,
    yieldMin: 3,
    yieldMax: 3,
    sellPrice: 50,
    pierreYear1SeedPrice: 80,
    pierreYear2SeedPrice: 80,
    oasisOrFestivalSeedPrice: null,
    route: "fruit",
  },
  {
    id: "bok-choy",
    englishName: "Bok Choy",
    chineseName: "小白菜",
    seasons: ["fall"],
    growthStageDays: [1, 1, 1, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 80,
    pierreYear1SeedPrice: 50,
    pierreYear2SeedPrice: 50,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "broccoli",
    englishName: "Broccoli",
    chineseName: "西蓝花",
    seasons: ["fall"],
    growthStageDays: [2, 2, 2, 2],
    regrowDays: 4,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 70,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "carrot",
    englishName: "Carrot",
    chineseName: "胡萝卜",
    seasons: ["spring"],
    growthStageDays: [1, 1, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 35,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "cauliflower",
    englishName: "Cauliflower",
    chineseName: "花椰菜",
    seasons: ["spring"],
    growthStageDays: [1, 2, 4, 4, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 175,
    pierreYear1SeedPrice: 80,
    pierreYear2SeedPrice: 80,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "corn",
    englishName: "Corn",
    chineseName: "玉米",
    seasons: ["summer", "fall"],
    growthStageDays: [2, 3, 3, 3, 3],
    regrowDays: 4,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 50,
    pierreYear1SeedPrice: 150,
    pierreYear2SeedPrice: 150,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "cranberries",
    englishName: "Cranberries",
    chineseName: "蔓越莓",
    seasons: ["fall"],
    growthStageDays: [1, 2, 1, 1, 2],
    regrowDays: 5,
    yieldMin: 2,
    yieldMax: 2,
    sellPrice: 75,
    pierreYear1SeedPrice: 240,
    pierreYear2SeedPrice: 240,
    oasisOrFestivalSeedPrice: null,
    route: "fruit",
  },
  {
    id: "eggplant",
    englishName: "Eggplant",
    chineseName: "茄子",
    seasons: ["fall"],
    growthStageDays: [1, 1, 1, 1, 1],
    regrowDays: 5,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 60,
    pierreYear1SeedPrice: 20,
    pierreYear2SeedPrice: 20,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "garlic",
    englishName: "Garlic",
    chineseName: "蒜",
    seasons: ["spring"],
    growthStageDays: [1, 1, 1, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 60,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: 40,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "grape",
    englishName: "Grape",
    chineseName: "葡萄",
    seasons: ["fall"],
    growthStageDays: [1, 1, 2, 3, 3],
    regrowDays: 3,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 80,
    pierreYear1SeedPrice: 60,
    pierreYear2SeedPrice: 60,
    oasisOrFestivalSeedPrice: null,
    route: "grape",
  },
  {
    id: "green-bean",
    englishName: "Green Bean",
    chineseName: "青豆",
    seasons: ["spring"],
    growthStageDays: [1, 1, 1, 3, 4],
    regrowDays: 3,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 40,
    pierreYear1SeedPrice: 60,
    pierreYear2SeedPrice: 60,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "hops",
    englishName: "Hops",
    chineseName: "啤酒花",
    seasons: ["summer"],
    growthStageDays: [1, 1, 2, 3, 4],
    regrowDays: 1,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 25,
    pierreYear1SeedPrice: 60,
    pierreYear2SeedPrice: 60,
    oasisOrFestivalSeedPrice: null,
    route: "hops",
  },
  {
    id: "hot-pepper",
    englishName: "Hot Pepper",
    chineseName: "辣椒",
    seasons: ["summer"],
    growthStageDays: [1, 1, 1, 1, 1],
    regrowDays: 3,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 40,
    pierreYear1SeedPrice: 40,
    pierreYear2SeedPrice: 40,
    oasisOrFestivalSeedPrice: null,
    route: "fruit",
  },
  {
    id: "kale",
    englishName: "Kale",
    chineseName: "甘蓝菜",
    seasons: ["spring"],
    growthStageDays: [1, 2, 2, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 110,
    pierreYear1SeedPrice: 70,
    pierreYear2SeedPrice: 70,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "melon",
    englishName: "Melon",
    chineseName: "甜瓜",
    seasons: ["summer"],
    growthStageDays: [1, 2, 3, 3, 3],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 250,
    pierreYear1SeedPrice: 80,
    pierreYear2SeedPrice: 80,
    oasisOrFestivalSeedPrice: null,
    route: "fruit",
  },
  {
    id: "parsnip",
    englishName: "Parsnip",
    chineseName: "防风草",
    seasons: ["spring"],
    growthStageDays: [1, 1, 1, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 35,
    pierreYear1SeedPrice: 20,
    pierreYear2SeedPrice: 20,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "potato",
    englishName: "Potato",
    chineseName: "土豆",
    seasons: ["spring"],
    growthStageDays: [1, 1, 1, 2, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1.5,
    sellPrice: 80,
    pierreYear1SeedPrice: 50,
    pierreYear2SeedPrice: 50,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "powdermelon",
    englishName: "Powdermelon",
    chineseName: "霜瓜",
    seasons: ["winter"],
    growthStageDays: [1, 1, 1, 2, 2],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 60,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: null,
    route: "fruit",
  },
  {
    id: "pumpkin",
    englishName: "Pumpkin",
    chineseName: "南瓜",
    seasons: ["fall"],
    growthStageDays: [1, 2, 3, 4, 3],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 320,
    pierreYear1SeedPrice: 100,
    pierreYear2SeedPrice: 100,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "radish",
    englishName: "Radish",
    chineseName: "萝卜",
    seasons: ["summer"],
    growthStageDays: [2, 1, 2, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 90,
    pierreYear1SeedPrice: 40,
    pierreYear2SeedPrice: 40,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "red-cabbage",
    englishName: "Red Cabbage",
    chineseName: "红叶卷心菜",
    seasons: ["summer"],
    growthStageDays: [2, 1, 2, 2, 2],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 260,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: 100,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "rhubarb",
    englishName: "Rhubarb",
    chineseName: "大黄",
    seasons: ["spring"],
    growthStageDays: [2, 2, 2, 3, 4],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 220,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: 100,
    route: "fruit",
  },
  {
    id: "starfruit",
    englishName: "Starfruit",
    chineseName: "杨桃",
    seasons: ["summer"],
    growthStageDays: [2, 3, 2, 3, 3],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 750,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: 400,
    route: "fruit",
  },
  {
    id: "strawberry",
    englishName: "Strawberry",
    chineseName: "草莓",
    seasons: ["spring"],
    growthStageDays: [1, 1, 2, 2, 2],
    regrowDays: 4,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 120,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: 100,
    route: "fruit",
  },
  {
    id: "summer-squash",
    englishName: "Summer Squash",
    chineseName: "金皮西葫芦",
    seasons: ["summer"],
    growthStageDays: [1, 1, 1, 1, 2],
    regrowDays: 3,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 45,
    pierreYear1SeedPrice: null,
    pierreYear2SeedPrice: null,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "tomato",
    englishName: "Tomato",
    chineseName: "西红柿",
    seasons: ["summer"],
    growthStageDays: [2, 2, 2, 2, 3],
    regrowDays: 4,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 60,
    pierreYear1SeedPrice: 50,
    pierreYear2SeedPrice: 50,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
  {
    id: "wheat",
    englishName: "Wheat",
    chineseName: "小麦",
    seasons: ["summer", "fall"],
    growthStageDays: [1, 1, 1, 1],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 25,
    pierreYear1SeedPrice: 10,
    pierreYear2SeedPrice: 10,
    oasisOrFestivalSeedPrice: null,
    route: "wheat",
  },
  {
    id: "yam",
    englishName: "Yam",
    chineseName: "山药",
    seasons: ["fall"],
    growthStageDays: [1, 3, 3, 3],
    regrowDays: null,
    yieldMin: 1,
    yieldMax: 1,
    sellPrice: 160,
    pierreYear1SeedPrice: 60,
    pierreYear2SeedPrice: 60,
    oasisOrFestivalSeedPrice: null,
    route: "vegetable",
  },
];

function floorMachineGold(amount: number): number {
  return Math.floor(amount + 1e-9);
}

function createMachineOutput(
  price: number,
  processingMinutes: number,
): CropMachineOutput {
  return { price, processingMinutes };
}

function createDehydratorOutput(price: number): CropDehydratorOutput {
  return {
    price,
    processingMinutes: DRIED_PROCESSING_MINUTES,
    batchSize: DEHYDRATOR_BATCH_SIZE,
  };
}

function createFruitMachineOutputs(sellPrice: number): {
  keg: CropMachineOutput;
  jar: CropMachineOutput;
  dehydrator: CropDehydratorOutput;
} {
  return {
    keg: createMachineOutput(sellPrice * 3, WINE_PROCESSING_MINUTES),
    jar: createMachineOutput(sellPrice * 2 + 50, JAR_PROCESSING_MINUTES),
    dehydrator: createDehydratorOutput(floorMachineGold(sellPrice * 7.5 + 25)),
  };
}

function createCropMachineOutputs(
  route: CropProcessingRoute,
  sellPrice: number,
): Pick<CropCatalogEntry, "keg" | "jar" | "dehydrator"> {
  if (route === "hops") {
    return {
      keg: createMachineOutput(PALE_ALE_PRICE, PALE_ALE_PROCESSING_MINUTES),
      jar: null,
      dehydrator: null,
    };
  }

  if (route === "wheat") {
    return {
      keg: createMachineOutput(BEER_PRICE, BEER_PROCESSING_MINUTES),
      jar: null,
      dehydrator: null,
    };
  }

  if (route === "vegetable") {
    return {
      keg: createMachineOutput(
        floorMachineGold(sellPrice * 2.25),
        JUICE_PROCESSING_MINUTES,
      ),
      jar: createMachineOutput(sellPrice * 2 + 50, JAR_PROCESSING_MINUTES),
      dehydrator: null,
    };
  }

  if (route === "grape") {
    return {
      keg: createMachineOutput(sellPrice * 3, WINE_PROCESSING_MINUTES),
      jar: createMachineOutput(sellPrice * 2 + 50, JAR_PROCESSING_MINUTES),
      dehydrator: createDehydratorOutput(RAISIN_PRICE),
    };
  }

  return createFruitMachineOutputs(sellPrice);
}

function createCropCatalogEntry(source: PurchasableCropSource): CropCatalogEntry {
  return {
    id: source.id,
    englishName: source.englishName,
    chineseName: source.chineseName,
    seasons: source.seasons,
    growthStageDays: source.growthStageDays,
    regrowDays: source.regrowDays,
    yieldMin: source.yieldMin,
    yieldMax: source.yieldMax,
    sellPrice: source.sellPrice,
    pierreYear1SeedPrice: source.pierreYear1SeedPrice,
    pierreYear2SeedPrice: source.pierreYear2SeedPrice,
    oasisOrFestivalSeedPrice: source.oasisOrFestivalSeedPrice,
    ...createCropMachineOutputs(source.route, source.sellPrice),
  };
}

function createPurchasableFieldCropCatalog(
  sources: readonly PurchasableCropSource[],
): readonly CropCatalogEntry[] {
  const seenCropIds = new Set<string>();
  const entries: CropCatalogEntry[] = [];

  for (const source of sources) {
    if (seenCropIds.has(source.id)) {
      throw new Error(`Duplicate cropId: ${JSON.stringify(source.id)}`);
    }
    seenCropIds.add(source.id);
    entries.push(createCropCatalogEntry(source));
  }

  return entries;
}

const purchasableFieldCrops = createPurchasableFieldCropCatalog(purchasableCropSources);

const purchasableFieldCropsById = new Map(
  purchasableFieldCrops.map((entry) => [entry.id, entry]),
);

export function listPurchasableFieldCrops(): readonly CropCatalogEntry[] {
  return purchasableFieldCrops;
}

export function getCropCatalogEntry(cropId: string): CropCatalogEntry {
  const entry = purchasableFieldCropsById.get(cropId);
  if (typeof cropId !== "string" || entry === undefined) {
    throw new Error(`Unknown cropId: ${JSON.stringify(cropId)}`);
  }
  return entry;
}
