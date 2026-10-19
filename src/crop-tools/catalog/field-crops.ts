// ValleyMath crop growth calculator, Stardew 1.6.x.
// Stages and regrow intervals: public crop-growth bundle.
// Seed gold, shop, and year: public seasonal crop-profit bundle.
// Sell prices and keg/jar/dehydrator routes: public catalog and engine bundles.

export type CropSeason = "spring" | "summer" | "fall" | "winter";

export type SeedShop = "pierre" | "oasis" | "festival";

export type SeedOffer = {
  readonly shop: SeedShop;
  readonly price: number;
  readonly minimumYear: number;
  readonly availableFromDay?: number;
};

export type ProcessingMachine = "keg" | "jar" | "dehydrator";

export type ProcessingProduct = {
  readonly machine: ProcessingMachine;
  readonly productId: string;
  readonly productName: string;
  readonly unitsPerBatch: number;
  readonly processingDays: number;
  readonly normalQualityPrice: number;
  readonly artisanPrice: number;
};

export type FieldCrop = {
  readonly cropId: string;
  readonly name: string;
  readonly seasons: readonly CropSeason[];
  readonly growthStages: readonly number[];
  readonly regrowIntervalDays: number | null;
  readonly sellPrice: number;
  readonly tillerSellPrice: number;
  readonly kind: "fruit" | "vegetable" | "special";
  readonly tillerBonusApplies: boolean;
  readonly expectedUnitsPerHarvest: number;
  readonly seedOffers: readonly SeedOffer[];
  readonly processingProducts: readonly ProcessingProduct[];
};

type OutputPrice =
  | { readonly basis: "times"; readonly multiplier: number }
  | { readonly basis: "times-plus"; readonly multiplier: number; readonly plus: number }
  | { readonly basis: "fixed"; readonly gold: number };

type ProcessingRoute = {
  readonly routeId: string;
  readonly machine: ProcessingMachine;
  readonly productName: string;
  readonly unitsPerBatch: number;
  readonly processingDays: number;
  readonly outputPrice: OutputPrice;
  readonly artisanEligible: boolean;
};

type FieldCropDraft = {
  readonly cropId: string;
  readonly name: string;
  readonly seasons: readonly CropSeason[];
  readonly growthStages: readonly number[];
  readonly regrowIntervalDays: number | null;
  readonly sellPrice: number;
  readonly kind: FieldCrop["kind"];
  readonly expectedUnitsPerHarvest?: number;
  readonly seedOffers: readonly SeedOffer[];
  readonly routeIds?: readonly string[];
};

const PROCESSING_ROUTES: Readonly<Record<string, ProcessingRoute>> = {
  wine: {
    routeId: "wine",
    machine: "keg",
    productName: "Wine",
    unitsPerBatch: 1,
    processingDays: 7,
    outputPrice: { basis: "times", multiplier: 3 },
    artisanEligible: true,
  },
  jelly: {
    routeId: "jelly",
    machine: "jar",
    productName: "Jelly",
    unitsPerBatch: 1,
    processingDays: 3,
    outputPrice: { basis: "times-plus", multiplier: 2, plus: 50 },
    artisanEligible: true,
  },
  "dried-fruit": {
    routeId: "dried-fruit",
    machine: "dehydrator",
    productName: "Dried Fruit",
    unitsPerBatch: 5,
    processingDays: 1,
    outputPrice: { basis: "times-plus", multiplier: 7.5, plus: 25 },
    artisanEligible: true,
  },
  juice: {
    routeId: "juice",
    machine: "keg",
    productName: "Juice",
    unitsPerBatch: 1,
    processingDays: 4,
    outputPrice: { basis: "times", multiplier: 2.25 },
    artisanEligible: true,
  },
  pickles: {
    routeId: "pickles",
    machine: "jar",
    productName: "Pickles",
    unitsPerBatch: 1,
    processingDays: 3,
    outputPrice: { basis: "times-plus", multiplier: 2, plus: 50 },
    artisanEligible: true,
  },
  raisins: {
    routeId: "raisins",
    machine: "dehydrator",
    productName: "Raisins",
    unitsPerBatch: 5,
    processingDays: 1,
    outputPrice: { basis: "fixed", gold: 600 },
    artisanEligible: true,
  },
  "pale-ale": {
    routeId: "pale-ale",
    machine: "keg",
    productName: "Pale Ale",
    unitsPerBatch: 1,
    processingDays: 2,
    outputPrice: { basis: "fixed", gold: 300 },
    artisanEligible: true,
  },
  beer: {
    routeId: "beer",
    machine: "keg",
    productName: "Beer",
    unitsPerBatch: 1,
    processingDays: 2,
    outputPrice: { basis: "fixed", gold: 200 },
    artisanEligible: true,
  },
};

const CROP_SEASONS: readonly CropSeason[] = ["spring", "summer", "fall", "winter"];

function pierreSeed(price: number, minimumYear: 1 | 2 = 1): SeedOffer {
  return { shop: "pierre", price, minimumYear };
}

function oasisSeed(price: number): SeedOffer {
  return { shop: "oasis", price, minimumYear: 1 };
}

function festivalSeed(price: number, availableFromDay: number): SeedOffer {
  return { shop: "festival", price, minimumYear: 1, availableFromDay };
}

function floorGold(amount: number): number {
  return Math.floor(amount + 1e-9);
}

function rawOutputGold(sellPrice: number, outputPrice: OutputPrice): number {
  if (outputPrice.basis === "fixed") {
    return outputPrice.gold;
  }
  if (outputPrice.basis === "times") {
    return sellPrice * outputPrice.multiplier;
  }
  return sellPrice * outputPrice.multiplier + outputPrice.plus;
}

function processingProductsFor(
  cropId: string,
  sellPrice: number,
  routeIds: readonly string[],
): readonly ProcessingProduct[] {
  return routeIds.map((routeId) => {
    const route = PROCESSING_ROUTES[routeId];
    if (!route) {
      throw new Error(`Unknown processing route "${routeId}" for cropId "${cropId}".`);
    }
    const rawGold = rawOutputGold(sellPrice, route.outputPrice);
    const normalQualityPrice = floorGold(rawGold);
    const artisanPrice = route.artisanEligible ? floorGold(rawGold * 1.4) : normalQualityPrice;
    return {
      machine: route.machine,
      productId: route.routeId,
      productName: route.productName,
      unitsPerBatch: route.unitsPerBatch,
      processingDays: route.processingDays,
      normalQualityPrice,
      artisanPrice,
    };
  });
}

function defaultRouteIds(kind: FieldCrop["kind"], cropId: string): readonly string[] {
  if (kind === "fruit") {
    return ["wine", "jelly", "dried-fruit"];
  }
  if (kind === "vegetable") {
    return ["juice", "pickles"];
  }
  throw new Error(`Special crop "${cropId}" is missing routeIds.`);
}

function tillerSellPrice(sellPrice: number, tillerBonusApplies: boolean): number {
  if (!tillerBonusApplies) {
    return sellPrice;
  }
  return floorGold(sellPrice * 1.1);
}

function buildFieldCrop(draft: FieldCropDraft): FieldCrop {
  const routeIds = draft.routeIds ?? defaultRouteIds(draft.kind, draft.cropId);
  const tillerBonusApplies = true;
  return {
    cropId: draft.cropId,
    name: draft.name,
    seasons: draft.seasons,
    growthStages: draft.growthStages,
    regrowIntervalDays: draft.regrowIntervalDays,
    sellPrice: draft.sellPrice,
    tillerSellPrice: tillerSellPrice(draft.sellPrice, tillerBonusApplies),
    kind: draft.kind,
    tillerBonusApplies,
    expectedUnitsPerHarvest: draft.expectedUnitsPerHarvest ?? 1,
    seedOffers: draft.seedOffers,
    processingProducts: processingProductsFor(draft.cropId, draft.sellPrice, routeIds),
  };
}

function assertFieldCropRecord(crop: FieldCrop): void {
  if (!crop.cropId) {
    throw new Error(`Field crop is missing cropId. Received: ${JSON.stringify(crop.cropId)}`);
  }
  if (crop.seasons.length === 0) {
    throw new Error(`Crop "${crop.cropId}" has no seasons.`);
  }
  for (const season of crop.seasons) {
    if (!CROP_SEASONS.includes(season)) {
      throw new Error(`Crop "${crop.cropId}" has invalid season "${season}".`);
    }
  }
  if (crop.growthStages.length === 0) {
    throw new Error(`Crop "${crop.cropId}" has no growth stages.`);
  }
  for (const stageDays of crop.growthStages) {
    if (!Number.isInteger(stageDays) || stageDays < 1) {
      throw new Error(
        `Crop "${crop.cropId}" has invalid growth stage ${stageDays}.`,
      );
    }
  }
  if (
    crop.regrowIntervalDays !== null &&
    (!Number.isInteger(crop.regrowIntervalDays) || crop.regrowIntervalDays < 1)
  ) {
    throw new Error(
      `Crop "${crop.cropId}" has invalid regrowIntervalDays ${crop.regrowIntervalDays}.`,
    );
  }
  if (!Number.isInteger(crop.sellPrice) || crop.sellPrice < 0) {
    throw new Error(`Crop "${crop.cropId}" has invalid sellPrice ${crop.sellPrice}.`);
  }
  for (const offer of crop.seedOffers) {
    if (offer.shop !== "pierre" && offer.shop !== "oasis" && offer.shop !== "festival") {
      throw new Error(`Crop "${crop.cropId}" has invalid shop "${offer.shop}".`);
    }
    if (!Number.isInteger(offer.price) || offer.price < 1) {
      throw new Error(`Crop "${crop.cropId}" has invalid seed price ${offer.price}.`);
    }
    if (offer.minimumYear !== 1 && offer.minimumYear !== 2) {
      throw new Error(
        `Crop "${crop.cropId}" has invalid minimumYear ${offer.minimumYear}.`,
      );
    }
    if (
      offer.availableFromDay !== undefined &&
      (!Number.isInteger(offer.availableFromDay) ||
        offer.availableFromDay < 1 ||
        offer.availableFromDay > 28)
    ) {
      throw new Error(
        `Crop "${crop.cropId}" has invalid availableFromDay ${offer.availableFromDay}.`,
      );
    }
  }
}

function indexFieldCrops(crops: readonly FieldCrop[]): ReadonlyMap<string, FieldCrop> {
  const cropsById = new Map<string, FieldCrop>();
  for (const crop of crops) {
    assertFieldCropRecord(crop);
    if (cropsById.has(crop.cropId)) {
      throw new Error(`Duplicate cropId "${crop.cropId}".`);
    }
    cropsById.set(crop.cropId, crop);
  }
  return cropsById;
}

const FIELD_CROP_DRAFTS: readonly FieldCropDraft[] = [
  {
    cropId: "parsnip",
    name: "Parsnip",
    seasons: ["spring"],
    growthStages: [1, 1, 1, 1],
    regrowIntervalDays: null,
    sellPrice: 35,
    kind: "vegetable",
    seedOffers: [pierreSeed(20)],
  },
  {
    cropId: "green-bean",
    name: "Green Bean",
    seasons: ["spring"],
    growthStages: [1, 1, 1, 3, 4],
    regrowIntervalDays: 3,
    sellPrice: 40,
    kind: "vegetable",
    seedOffers: [pierreSeed(60)],
  },
  {
    cropId: "cauliflower",
    name: "Cauliflower",
    seasons: ["spring"],
    growthStages: [1, 2, 4, 4, 1],
    regrowIntervalDays: null,
    sellPrice: 175,
    kind: "vegetable",
    seedOffers: [pierreSeed(80)],
  },
  {
    cropId: "potato",
    name: "Potato",
    seasons: ["spring"],
    growthStages: [1, 1, 1, 2, 1],
    regrowIntervalDays: null,
    sellPrice: 80,
    kind: "vegetable",
    expectedUnitsPerHarvest: 1.25,
    seedOffers: [pierreSeed(50)],
  },
  {
    cropId: "kale",
    name: "Kale",
    seasons: ["spring"],
    growthStages: [1, 2, 2, 1],
    regrowIntervalDays: null,
    sellPrice: 110,
    kind: "vegetable",
    seedOffers: [pierreSeed(70)],
  },
  {
    cropId: "garlic",
    name: "Garlic",
    seasons: ["spring"],
    growthStages: [1, 1, 1, 1],
    regrowIntervalDays: null,
    sellPrice: 60,
    kind: "vegetable",
    seedOffers: [pierreSeed(40, 2)],
  },
  {
    cropId: "rhubarb",
    name: "Rhubarb",
    seasons: ["spring"],
    growthStages: [2, 2, 2, 3, 4],
    regrowIntervalDays: null,
    sellPrice: 220,
    kind: "fruit",
    seedOffers: [oasisSeed(100)],
  },
  {
    cropId: "strawberry",
    name: "Strawberry",
    seasons: ["spring"],
    growthStages: [1, 1, 2, 2, 2],
    regrowIntervalDays: 4,
    sellPrice: 120,
    kind: "fruit",
    seedOffers: [festivalSeed(100, 13)],
  },
  {
    cropId: "carrot",
    name: "Carrot",
    seasons: ["spring"],
    growthStages: [1, 1, 1],
    regrowIntervalDays: null,
    sellPrice: 35,
    kind: "vegetable",
    seedOffers: [],
  },
  {
    cropId: "blueberry",
    name: "Blueberry",
    seasons: ["summer"],
    growthStages: [1, 3, 3, 4, 2],
    regrowIntervalDays: 4,
    sellPrice: 50,
    kind: "fruit",
    expectedUnitsPerHarvest: 3,
    seedOffers: [pierreSeed(80)],
  },
  {
    cropId: "corn",
    name: "Corn",
    seasons: ["summer", "fall"],
    growthStages: [2, 3, 3, 3, 3],
    regrowIntervalDays: 4,
    sellPrice: 50,
    kind: "vegetable",
    seedOffers: [pierreSeed(150)],
  },
  {
    cropId: "hops",
    name: "Hops",
    seasons: ["summer"],
    growthStages: [1, 1, 2, 3, 4],
    regrowIntervalDays: 1,
    sellPrice: 25,
    kind: "special",
    seedOffers: [pierreSeed(60)],
    routeIds: ["pale-ale"],
  },
  {
    cropId: "hot-pepper",
    name: "Hot Pepper",
    seasons: ["summer"],
    growthStages: [1, 1, 1, 1, 1],
    regrowIntervalDays: 3,
    sellPrice: 40,
    kind: "fruit",
    seedOffers: [pierreSeed(40)],
  },
  {
    cropId: "melon",
    name: "Melon",
    seasons: ["summer"],
    growthStages: [1, 2, 3, 3, 3],
    regrowIntervalDays: null,
    sellPrice: 250,
    kind: "fruit",
    seedOffers: [pierreSeed(80)],
  },
  {
    cropId: "radish",
    name: "Radish",
    seasons: ["summer"],
    growthStages: [2, 1, 2, 1],
    regrowIntervalDays: null,
    sellPrice: 90,
    kind: "vegetable",
    seedOffers: [pierreSeed(40)],
  },
  {
    cropId: "red-cabbage",
    name: "Red Cabbage",
    seasons: ["summer"],
    growthStages: [2, 1, 2, 2, 2],
    regrowIntervalDays: null,
    sellPrice: 260,
    kind: "vegetable",
    seedOffers: [pierreSeed(100, 2)],
  },
  {
    cropId: "starfruit",
    name: "Starfruit",
    seasons: ["summer"],
    growthStages: [2, 3, 2, 3, 3],
    regrowIntervalDays: null,
    sellPrice: 750,
    kind: "fruit",
    seedOffers: [oasisSeed(400)],
  },
  {
    cropId: "tomato",
    name: "Tomato",
    seasons: ["summer"],
    growthStages: [2, 2, 2, 2, 3],
    regrowIntervalDays: 4,
    sellPrice: 60,
    kind: "vegetable",
    seedOffers: [pierreSeed(50)],
  },
  {
    cropId: "wheat",
    name: "Wheat",
    seasons: ["summer", "fall"],
    growthStages: [1, 1, 1, 1],
    regrowIntervalDays: null,
    sellPrice: 25,
    kind: "special",
    seedOffers: [pierreSeed(10)],
    routeIds: ["beer"],
  },
  {
    cropId: "summer-squash",
    name: "Summer Squash",
    seasons: ["summer"],
    growthStages: [1, 1, 1, 1, 2],
    regrowIntervalDays: 3,
    sellPrice: 45,
    kind: "vegetable",
    seedOffers: [],
  },
  {
    cropId: "amaranth",
    name: "Amaranth",
    seasons: ["fall"],
    growthStages: [1, 2, 2, 2],
    regrowIntervalDays: null,
    sellPrice: 150,
    kind: "vegetable",
    seedOffers: [pierreSeed(70)],
  },
  {
    cropId: "artichoke",
    name: "Artichoke",
    seasons: ["fall"],
    growthStages: [2, 2, 1, 2, 1],
    regrowIntervalDays: null,
    sellPrice: 160,
    kind: "vegetable",
    seedOffers: [pierreSeed(30, 2)],
  },
  {
    cropId: "beet",
    name: "Beet",
    seasons: ["fall"],
    growthStages: [1, 1, 2, 2],
    regrowIntervalDays: null,
    sellPrice: 100,
    kind: "vegetable",
    seedOffers: [oasisSeed(20)],
  },
  {
    cropId: "bok-choy",
    name: "Bok Choy",
    seasons: ["fall"],
    growthStages: [1, 1, 1, 1],
    regrowIntervalDays: null,
    sellPrice: 80,
    kind: "vegetable",
    seedOffers: [pierreSeed(50)],
  },
  {
    cropId: "cranberries",
    name: "Cranberries",
    seasons: ["fall"],
    growthStages: [1, 2, 1, 1, 2],
    regrowIntervalDays: 5,
    sellPrice: 75,
    kind: "fruit",
    expectedUnitsPerHarvest: 2,
    seedOffers: [pierreSeed(240)],
  },
  {
    cropId: "eggplant",
    name: "Eggplant",
    seasons: ["fall"],
    growthStages: [1, 1, 1, 1, 1],
    regrowIntervalDays: 5,
    sellPrice: 60,
    kind: "vegetable",
    seedOffers: [pierreSeed(20)],
  },
  {
    cropId: "grape",
    name: "Grape",
    seasons: ["fall"],
    growthStages: [1, 1, 2, 3, 3],
    regrowIntervalDays: 3,
    sellPrice: 80,
    kind: "fruit",
    seedOffers: [pierreSeed(60)],
    routeIds: ["wine", "jelly", "raisins"],
  },
  {
    cropId: "pumpkin",
    name: "Pumpkin",
    seasons: ["fall"],
    growthStages: [1, 2, 3, 4, 3],
    regrowIntervalDays: null,
    sellPrice: 320,
    kind: "vegetable",
    seedOffers: [pierreSeed(100)],
  },
  {
    cropId: "yam",
    name: "Yam",
    seasons: ["fall"],
    growthStages: [1, 3, 3, 3],
    regrowIntervalDays: null,
    sellPrice: 160,
    kind: "vegetable",
    seedOffers: [pierreSeed(60)],
  },
  {
    cropId: "broccoli",
    name: "Broccoli",
    seasons: ["fall"],
    growthStages: [2, 2, 2, 2],
    regrowIntervalDays: 4,
    sellPrice: 70,
    kind: "vegetable",
    seedOffers: [],
  },
  {
    cropId: "powdermelon",
    name: "Powdermelon",
    seasons: ["winter"],
    growthStages: [1, 1, 1, 2, 2],
    regrowIntervalDays: null,
    sellPrice: 60,
    kind: "fruit",
    seedOffers: [],
  },
];

const FIELD_CROPS: readonly FieldCrop[] = FIELD_CROP_DRAFTS.map(buildFieldCrop);
const FIELD_CROPS_BY_ID = indexFieldCrops(FIELD_CROPS);

function formatReceived(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return Object.prototype.toString.call(value);
}

export function listPurchasableFieldCrops(): readonly FieldCrop[] {
  return FIELD_CROPS;
}

export function getFieldCrop(cropId: string): FieldCrop {
  if (typeof cropId !== "string") {
    throw new TypeError(`cropId must be a string. Received: ${formatReceived(cropId)}`);
  }
  const crop = FIELD_CROPS_BY_ID.get(cropId);
  if (!crop) {
    throw new TypeError(`Unknown cropId ${JSON.stringify(cropId)}.`);
  }
  return crop;
}

function assertSeedShop(shop: SeedShop): SeedShop {
  if (shop !== "pierre" && shop !== "oasis" && shop !== "festival") {
    throw new TypeError(
      `shop must be "pierre", "oasis", or "festival". Received: ${formatReceived(shop)}`,
    );
  }
  return shop;
}

function assertShopYear(year: number): number {
  if (typeof year !== "number" || !Number.isFinite(year)) {
    throw new TypeError(`year must be a finite number. Received: ${formatReceived(year)}`);
  }
  if (!Number.isInteger(year) || year < 1) {
    throw new RangeError(`year must be an integer greater than or equal to 1. Received: ${year}`);
  }
  return year;
}

function assertFieldCropArgument(crop: FieldCrop): FieldCrop {
  if (crop === null || typeof crop !== "object") {
    throw new TypeError(`crop must be a FieldCrop. Received: ${formatReceived(crop)}`);
  }
  if (typeof crop.cropId !== "string") {
    throw new TypeError(
      `crop.cropId must be a string. Received: ${formatReceived(crop.cropId)}`,
    );
  }
  if (!Array.isArray(crop.seedOffers)) {
    throw new TypeError(
      `crop.seedOffers must be an array for cropId ${JSON.stringify(crop.cropId)}. Received: ${formatReceived(crop.seedOffers)}`,
    );
  }
  return crop;
}

export function isCropSoldAt(crop: FieldCrop, shop: SeedShop, year: number): boolean {
  const fieldCrop = assertFieldCropArgument(crop);
  const selectedShop = assertSeedShop(shop);
  const selectedYear = assertShopYear(year);
  return fieldCrop.seedOffers.some((offer) => {
    if (offer === null || typeof offer !== "object") {
      throw new TypeError(
        `seed offer for cropId ${JSON.stringify(fieldCrop.cropId)} must be an object. Received: ${formatReceived(offer)}`,
      );
    }
    if (offer.shop !== "pierre" && offer.shop !== "oasis" && offer.shop !== "festival") {
      throw new TypeError(
        `seed offer shop for cropId ${JSON.stringify(fieldCrop.cropId)} is invalid. Received: ${formatReceived(offer.shop)}`,
      );
    }
    if (!Number.isInteger(offer.minimumYear)) {
      throw new RangeError(
        `seed offer minimumYear for cropId ${JSON.stringify(fieldCrop.cropId)} must be an integer. Received: ${formatReceived(offer.minimumYear)}`,
      );
    }
    return offer.shop === selectedShop && selectedYear >= offer.minimumYear;
  });
}
