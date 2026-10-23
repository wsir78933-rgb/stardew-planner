import { listPurchasableFieldCrops, type CropCatalogEntry } from "@/src/crop-tools/catalog/crop-catalog";
import {
  processedBatchPrice,
  processingDurationDays,
  rawCropUnitPrice,
} from "@/src/crop-tools/profit/schedule-processing-route";

export type ProcessingQuality = "normal" | "silver" | "gold" | "iridium";
export type ProcessingProfession = "none" | "tiller" | "artisan";
export type ProcessingMachine = "keg" | "jar" | "dehydrator";
export type ProcessingMode = "unlimited" | "capacity";
export type ProcessingCoconutSource = "foraged" | "purchased-or-gifted";
export type ProcessingIngredientCategory = "fruit" | "vegetable" | "mushroom" | "other";
export type ProcessingMachineCounts = Readonly<Record<ProcessingMachine, number>>;

export type ProcessingIngredient = {
  readonly id: string;
  readonly englishName: string;
  readonly chineseName: string;
  readonly category: ProcessingIngredientCategory;
  /** Normal-quality raw sale price before profession bonuses. */
  readonly basePrice: number;
  readonly canAgeWine: boolean;
  readonly hasQualityTiers: boolean;
  readonly tillerBonusEligible: boolean;
  readonly rawArtisanBonusEligible: boolean;
};

export type CalculateProcessingRoutesInput = {
  readonly ingredientId: string;
  readonly quantity: number;
  readonly quality: ProcessingQuality;
  readonly profession: ProcessingProfession;
  /** Unlimited processes every complete batch; capacity uses machines over the elapsed deadline window. */
  readonly mode: ProcessingMode;
  /** Elapsed processing-window days after stock is available; a batch can finish on the final day. */
  readonly deadlineDays: number;
  readonly machineCounts: ProcessingMachineCounts;
  readonly hasBearsKnowledge?: boolean;
  readonly coconutSource?: ProcessingCoconutSource;
};

export type CalculateProcessingRouteInput = CalculateProcessingRoutesInput & {
  readonly machine: ProcessingMachine;
};

type ProcessingRouteQuoteBase = {
  readonly machine: ProcessingMachine;
  readonly machineCount: number;
  readonly rawUnitPrice: number;
  readonly rawValue: number;
  readonly processedBatches: number;
  readonly processedUnits: number;
  readonly backlogUnits: number;
  readonly processedValue: number;
  readonly backlogValue: number;
  readonly finalValue: number;
  /** Final route value minus selling all inputs raw, with the same quality and profession. */
  readonly valueAdded: number;
};

export type ApplicableProcessingRouteQuote = ProcessingRouteQuoteBase & {
  readonly applicable: true;
  readonly unavailableReason: null;
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly batchInputUnits: number;
  readonly processingMinutes: number;
  /** Keg/Jar use ceil(processing minutes / 1600); dehydrator outputs are ready next morning. */
  readonly processingMornings: number;
  readonly batchOutputPrice: number;
  readonly valueAddedPerProcessedUnit: number;
  /** One recipe-batch's value added divided by one active machine's cycle mornings; excludes idle window days. */
  readonly valueAddedPerMachineDay: number;
};

export type UnavailableProcessingRouteQuote = ProcessingRouteQuoteBase & {
  readonly applicable: false;
  readonly unavailableReason: "recipe-not-supported";
  readonly productEnglishName: null;
  readonly productChineseName: null;
  readonly batchInputUnits: null;
  readonly processingMinutes: null;
  readonly processingMornings: null;
  readonly batchOutputPrice: null;
  readonly valueAddedPerProcessedUnit: null;
  readonly valueAddedPerMachineDay: null;
};

export type ProcessingRouteQuote = ApplicableProcessingRouteQuote | UnavailableProcessingRouteQuote;

type ProcessingRecipe = {
  readonly productEnglishName: string;
  readonly productChineseName: string;
  readonly batchInputUnits: number;
  readonly processingMinutes: number;
  readonly baseOutputPrice: number;
  readonly artisanBonusEligible: boolean;
};

type ProcessingIngredientRecord = {
  readonly ingredient: ProcessingIngredient;
  readonly recipes: Readonly<Partial<Record<ProcessingMachine, ProcessingRecipe>>>;
};

type ValidatedProcessingInput = {
  readonly ingredient: ProcessingIngredient;
  readonly quantity: number;
  readonly quality: ProcessingQuality;
  readonly profession: ProcessingProfession;
  readonly mode: ProcessingMode;
  readonly deadlineDays: number;
  readonly machineCounts: ProcessingMachineCounts;
  readonly hasBearsKnowledge: boolean;
  readonly coconutSource: ProcessingCoconutSource;
  readonly rawUnitPrice: number;
  readonly rawValue: number;
};

const PROCESSING_MACHINES: readonly ProcessingMachine[] = ["keg", "jar", "dehydrator"];
const PROCESSING_QUALITIES: readonly ProcessingQuality[] = Object.freeze(
  ["normal", "silver", "gold", "iridium"] as const,
);
const NORMAL_ONLY_PROCESSING_QUALITIES = Object.freeze(["normal"] as const);
const BUSH_FORAGE_PROCESSING_QUALITIES = Object.freeze(["normal", "iridium"] as const);
const BEARS_KNOWLEDGE_ELIGIBLE_INGREDIENT_IDS = new Set([
  "blackberry",
  "blackberry-cave",
  "blackberry-ground",
  "salmonberry",
  "salmonberry-cave",
]);
const NORMAL_ONLY_INGREDIENT_IDS = new Set(["cave-carrot", "ginger", "tea-leaves"]);
const PROCESSING_PROFESSIONS: readonly ProcessingProfession[] = ["none", "tiller", "artisan"];
const PROCESSING_MODES: readonly ProcessingMode[] = ["unlimited", "capacity"];
const PROCESSING_COCONUT_SOURCES: readonly ProcessingCoconutSource[] = ["foraged", "purchased-or-gifted"];
const QUALITY_PRICE_MULTIPLIERS: Readonly<Record<ProcessingQuality, number>> = {
  normal: 1,
  silver: 1.25,
  gold: 1.5,
  iridium: 2,
};
const JUICE_PROCESSING_MINUTES = 6_000;
const WINE_PROCESSING_MINUTES = 10_000;
const JAR_PROCESSING_MINUTES = 4_000;
const DRIED_PROCESSING_MINUTES = 1_750;
const DEHYDRATOR_BATCH_SIZE = 5;

function createRecipe(
  productEnglishName: string,
  productChineseName: string,
  batchInputUnits: number,
  processingMinutes: number,
  baseOutputPrice: number,
  artisanBonusEligible = true,
): ProcessingRecipe {
  return {
    productEnglishName,
    productChineseName,
    batchInputUnits,
    processingMinutes,
    baseOutputPrice,
    artisanBonusEligible,
  };
}

function createFruitRecipes(basePrice: number): ProcessingIngredientRecord["recipes"] {
  return {
    keg: createRecipe("Wine", "葡萄酒", 1, WINE_PROCESSING_MINUTES, basePrice * 3),
    jar: createRecipe("Jelly", "果酱", 1, JAR_PROCESSING_MINUTES, basePrice * 2 + 50),
    dehydrator: createRecipe(
      "Dried Fruit",
      "果干",
      DEHYDRATOR_BATCH_SIZE,
      DRIED_PROCESSING_MINUTES,
      floorProcessingGold(basePrice * 7.5 + 25),
    ),
  };
}

function createSupplementalFruitRecord(
  id: string,
  englishName: string,
  chineseName: string,
  basePrice: number,
  tillerBonusEligible: boolean,
  hasQualityTiers = true,
): ProcessingIngredientRecord {
  return {
    ingredient: {
      id,
      englishName,
      chineseName,
      category: "fruit",
      basePrice,
      canAgeWine: true,
      hasQualityTiers,
      tillerBonusEligible,
      rawArtisanBonusEligible: false,
    },
    recipes: createFruitRecipes(basePrice),
  };
}

function createForagedGrapeRecord(): ProcessingIngredientRecord {
  const basePrice = 80;

  return createSupplementalRecord(
    {
      id: "grape-foraged",
      englishName: "Grape (Foraged / Summer Seeds)",
      chineseName: "葡萄（采集／夏季种子）",
      category: "fruit",
      basePrice,
      canAgeWine: true,
      hasQualityTiers: true,
      tillerBonusEligible: false,
      rawArtisanBonusEligible: false,
    },
    {
      ...createFruitRecipes(basePrice),
      dehydrator: createRecipe(
        "Raisins",
        "葡萄干",
        DEHYDRATOR_BATCH_SIZE,
        DRIED_PROCESSING_MINUTES,
        600,
      ),
    },
  );
}

function createSupplementalVegetableRecord(
  id: string,
  englishName: string,
  chineseName: string,
  basePrice: number,
): ProcessingIngredientRecord {
  return createSupplementalRecord(
    {
      id,
      englishName,
      chineseName,
      category: "vegetable",
      basePrice,
      canAgeWine: false,
      hasQualityTiers: true,
      tillerBonusEligible: true,
      rawArtisanBonusEligible: false,
    },
    {
      keg: createRecipe("Juice", "果汁", 1, JUICE_PROCESSING_MINUTES, floorProcessingGold(basePrice * 2.25)),
      jar: createRecipe("Pickles", "腌菜", 1, JAR_PROCESSING_MINUTES, basePrice * 2 + 50),
    },
  );
}

function createSupplementalRecord(
  ingredient: ProcessingIngredient,
  recipes: ProcessingIngredientRecord["recipes"],
): ProcessingIngredientRecord {
  return { ingredient, recipes };
}

function createFieldCropRecord(crop: CropCatalogEntry): ProcessingIngredientRecord {
  const isFruit = crop.keg !== null && crop.keg.price === crop.sellPrice * 3;
  const category: ProcessingIngredientCategory = isFruit
    ? "fruit"
    : crop.jar !== null
      ? "vegetable"
      : "other";
  const recipes: Partial<Record<ProcessingMachine, ProcessingRecipe>> = {};

  if (crop.keg !== null) {
    const productName = isFruit
      ? { english: "Wine", chinese: "葡萄酒" }
      : crop.id === "hops"
        ? { english: "Pale Ale", chinese: "淡啤酒" }
        : crop.id === "wheat"
          ? { english: "Beer", chinese: "啤酒" }
          : { english: "Juice", chinese: "果汁" };
    recipes.keg = createRecipe(
      productName.english,
      productName.chinese,
      1,
      crop.keg.processingMinutes,
      crop.keg.price,
    );
  }

  if (crop.jar !== null) {
    const productName = isFruit
      ? { english: "Jelly", chinese: "果酱" }
      : { english: "Pickles", chinese: "腌菜" };
    recipes.jar = createRecipe(
      productName.english,
      productName.chinese,
      1,
      crop.jar.processingMinutes,
      crop.jar.price,
    );
  }

  if (crop.id === "hops" || crop.id === "wheat") {
    recipes.jar = createRecipe("Pickles", "腌菜", 1, JAR_PROCESSING_MINUTES, crop.sellPrice * 2 + 50);
  }

  if (crop.dehydrator !== null) {
    recipes.dehydrator = createRecipe(
      crop.id === "grape" ? "Raisins" : "Dried Fruit",
      crop.id === "grape" ? "葡萄干" : "果干",
      crop.dehydrator.batchSize,
      crop.dehydrator.processingMinutes,
      crop.dehydrator.price,
    );
  }

  return {
    ingredient: {
      id: crop.id,
      englishName: crop.id === "grape" ? "Grape (Grown)" : crop.englishName,
      chineseName: crop.id === "grape" ? "葡萄（种植）" : crop.chineseName,
      category,
      basePrice: crop.sellPrice,
      canAgeWine: isFruit,
      hasQualityTiers: true,
      tillerBonusEligible: true,
      rawArtisanBonusEligible: false,
    },
    recipes,
  };
}

function createSupplementalIngredients(): readonly ProcessingIngredientRecord[] {
  const fruitRecords = [
    createSupplementalFruitRecord("ancient-fruit", "Ancient Fruit", "上古水果", 550, true),
    createSupplementalFruitRecord("apple", "Apple", "苹果", 100, true),
    createSupplementalFruitRecord("apricot", "Apricot", "杏子", 50, true),
    createSupplementalFruitRecord("banana", "Banana", "香蕉", 150, true),
    createSupplementalFruitRecord("blackberry", "Blackberry (Bush Picked)", "黑莓（灌木丛采摘）", 20, true),
    createSupplementalFruitRecord("blackberry-cave", "Blackberry (Farm Cave)", "黑莓（农场洞穴）", 20, false),
    createSupplementalFruitRecord("blackberry-ground", "Blackberry (Ground Foraged)", "黑莓（地面采集）", 20, false),
    createSupplementalFruitRecord("cactus-fruit", "Cactus Fruit (Desert Foraged)", "仙人掌果（沙漠采集）", 75, false),
    createSupplementalFruitRecord("cactus-fruit-grown", "Cactus Fruit (Grown)", "仙人掌果（种植）", 75, true),
    createSupplementalFruitRecord("cherry", "Cherry", "樱桃", 80, true),
    createSupplementalFruitRecord("coconut", "Coconut", "椰子", 100, false),
    createSupplementalFruitRecord("crystal-fruit", "Crystal Fruit", "水晶果", 150, false),
    createForagedGrapeRecord(),
    createSupplementalFruitRecord("mango", "Mango", "芒果", 130, true),
    createSupplementalFruitRecord("orange", "Orange", "橙子", 100, true),
    createSupplementalFruitRecord("peach", "Peach", "桃子", 140, true),
    createSupplementalFruitRecord("pineapple", "Pineapple", "菠萝", 300, true),
    createSupplementalFruitRecord("pomegranate", "Pomegranate", "石榴", 140, true),
    createSupplementalFruitRecord("qi-fruit", "Qi Fruit", "齐瓜", 1, true, false),
    createSupplementalFruitRecord("salmonberry", "Salmonberry (Bush Picked)", "美洲大树莓（灌木丛采摘）", 5, true),
    createSupplementalFruitRecord("salmonberry-cave", "Salmonberry (Farm Cave)", "美洲大树莓（农场洞穴）", 5, false),
    createSupplementalFruitRecord("spice-berry", "Spice Berry", "香料浆果", 80, false),
    createSupplementalFruitRecord("wild-plum", "Wild Plum", "野梅", 80, false),
  ];

  const kegForageRecords = [
    { id: "cave-carrot", englishName: "Cave Carrot", chineseName: "洞穴萝卜", basePrice: 25 },
    { id: "dandelion", englishName: "Dandelion", chineseName: "蒲公英", basePrice: 40 },
    { id: "ginger", englishName: "Ginger", chineseName: "姜", basePrice: 60 },
    { id: "hazelnut", englishName: "Hazelnut", chineseName: "榛子", basePrice: 90 },
    { id: "leek", englishName: "Leek", chineseName: "韭葱", basePrice: 60 },
    { id: "snow-yam", englishName: "Snow Yam", chineseName: "雪山药", basePrice: 100 },
    { id: "spring-onion", englishName: "Spring Onion", chineseName: "大葱", basePrice: 8 },
    { id: "wild-horseradish", englishName: "Wild Horseradish", chineseName: "野山葵", basePrice: 50 },
    { id: "winter-root", englishName: "Winter Root", chineseName: "冬根", basePrice: 70 },
  ].map((forage) =>
    createSupplementalRecord(
      {
        id: forage.id,
        englishName: forage.englishName,
        chineseName: forage.chineseName,
        category: "other",
        basePrice: forage.basePrice,
        canAgeWine: false,
        hasQualityTiers: !NORMAL_ONLY_INGREDIENT_IDS.has(forage.id),
        tillerBonusEligible: false,
        rawArtisanBonusEligible: false,
      },
      {
        keg: createRecipe(
          "Juice",
          "果汁",
          1,
          JUICE_PROCESSING_MINUTES,
          floorProcessingGold(forage.basePrice * 2.25),
        ),
        jar: createRecipe("Pickles", "腌菜", 1, JAR_PROCESSING_MINUTES, forage.basePrice * 2 + 50),
      },
    ),
  );

  const mushroomRecords = [
    { id: "chanterelle", englishName: "Chanterelle", chineseName: "鸡油菌", basePrice: 160 },
    { id: "common-mushroom", englishName: "Common Mushroom", chineseName: "普通蘑菇", basePrice: 40 },
    { id: "magma-cap", englishName: "Magma Cap", chineseName: "熔岩菌", basePrice: 400 },
    { id: "morel", englishName: "Morel", chineseName: "羊肚菌", basePrice: 150 },
    { id: "purple-mushroom", englishName: "Purple Mushroom", chineseName: "紫蘑菇", basePrice: 250 },
  ].map((mushroom) =>
    createSupplementalRecord(
      {
        id: mushroom.id,
        englishName: mushroom.englishName,
        chineseName: mushroom.chineseName,
        category: "mushroom",
        basePrice: mushroom.basePrice,
        canAgeWine: false,
        hasQualityTiers: true,
        tillerBonusEligible: false,
        rawArtisanBonusEligible: false,
      },
      {
        dehydrator: createRecipe(
          "Dried Mushrooms",
          "干蘑菇",
          DEHYDRATOR_BATCH_SIZE,
          DRIED_PROCESSING_MINUTES,
          floorProcessingGold(mushroom.basePrice * 7.5 + 25),
        ),
        jar: createRecipe("Pickles", "腌菜", 1, JAR_PROCESSING_MINUTES, mushroom.basePrice * 2 + 50),
      },
    ),
  );

  const redMushroomRecord = createSupplementalRecord(
    {
      id: "red-mushroom",
      englishName: "Red Mushroom",
      chineseName: "红蘑菇",
      category: "mushroom",
      basePrice: 75,
      canAgeWine: false,
      hasQualityTiers: true,
      tillerBonusEligible: false,
      rawArtisanBonusEligible: false,
    },
    {},
  );

  const specialtyRecords = [
    createSupplementalRecord(
      {
        id: "coffee-bean",
        englishName: "Coffee Bean",
        chineseName: "咖啡豆",
        category: "other",
        basePrice: 15,
        canAgeWine: false,
        hasQualityTiers: true,
        tillerBonusEligible: false,
        rawArtisanBonusEligible: false,
      },
      { keg: createRecipe("Coffee", "咖啡", 5, 120, 150, false) },
    ),
    createSupplementalRecord(
      {
        id: "tea-leaves",
        englishName: "Tea Leaves",
        chineseName: "茶叶",
        category: "other",
        basePrice: 50,
        canAgeWine: false,
        hasQualityTiers: false,
        tillerBonusEligible: true,
        rawArtisanBonusEligible: false,
      },
      {
        keg: createRecipe("Green Tea", "绿茶", 1, 180, 100),
        jar: createRecipe("Pickled Tea Leaves", "腌茶叶", 1, JAR_PROCESSING_MINUTES, 150),
      },
    ),
    createSupplementalRecord(
      {
        id: "rice",
        englishName: "Rice",
        chineseName: "大米",
        category: "other",
        basePrice: 100,
        canAgeWine: false,
        hasQualityTiers: false,
        tillerBonusEligible: false,
        rawArtisanBonusEligible: false,
      },
      { keg: createRecipe("Vinegar ×2", "米醋 ×2", 1, 600, 200, false) },
    ),
    createSupplementalVegetableRecord("unmilled-rice", "Unmilled Rice", "未碾米", 30),
    createSupplementalVegetableRecord("taro-root", "Taro Root", "芋头", 100),
    createSupplementalVegetableRecord("fiddlehead-fern", "Fiddlehead Fern", "蕨菜", 90),
    ...[
      { id: "honey-wild", englishName: "Wild Honey", chineseName: "野花蜂蜜", basePrice: 100 },
      { id: "honey-tulip", englishName: "Tulip Honey", chineseName: "郁金香蜂蜜", basePrice: 160 },
      { id: "honey-blue-jazz", englishName: "Blue Jazz Honey", chineseName: "蓝爵蜂蜜", basePrice: 200 },
      { id: "honey-sunflower", englishName: "Sunflower Honey", chineseName: "向日葵蜂蜜", basePrice: 260 },
      { id: "honey-summer-spangle", englishName: "Summer Spangle Honey", chineseName: "夏季亮片蜂蜜", basePrice: 280 },
      { id: "honey-poppy", englishName: "Poppy Honey", chineseName: "罂粟蜂蜜", basePrice: 380 },
      { id: "honey-fairy-rose", englishName: "Fairy Rose Honey", chineseName: "仙子玫瑰蜂蜜", basePrice: 680 },
    ].map((honey) =>
      createSupplementalRecord(
        {
          id: honey.id,
          englishName: honey.englishName,
          chineseName: honey.chineseName,
          category: "other",
          basePrice: honey.basePrice,
          canAgeWine: false,
          hasQualityTiers: false,
          tillerBonusEligible: false,
          rawArtisanBonusEligible: true,
        },
        { keg: createRecipe("Mead", "蜂蜜酒", 1, 600, 300) },
      ),
    ),
  ];

  return [...fruitRecords, ...kegForageRecords, ...mushroomRecords, redMushroomRecord, ...specialtyRecords];
}

function createProcessingIngredientRecords(): readonly ProcessingIngredientRecord[] {
  const cropRecords = listPurchasableFieldCrops().map(createFieldCropRecord);
  const ingredientIds = new Set<string>();
  const records = [...cropRecords, ...createSupplementalIngredients()];

  for (const record of records) {
    const { ingredient } = record;
    if (ingredientIds.has(ingredient.id)) {
      throw new Error(`Duplicate processing ingredient id: ${JSON.stringify(ingredient.id)}`);
    }
    ingredientIds.add(ingredient.id);
    if (!Number.isSafeInteger(ingredient.basePrice) || ingredient.basePrice <= 0) {
      throw new Error(
        `Processing ingredient ${JSON.stringify(ingredient.id)} has invalid basePrice: ${JSON.stringify(ingredient.basePrice)}`,
      );
    }
  }

  return records.sort((leftRecord, rightRecord) =>
    leftRecord.ingredient.englishName.localeCompare(rightRecord.ingredient.englishName),
  );
}

const processingIngredientRecords = createProcessingIngredientRecords();
const processingIngredientsById = new Map(
  processingIngredientRecords.map((record) => [record.ingredient.id, record]),
);
const processingIngredients = Object.freeze(
  processingIngredientRecords.map((record) => Object.freeze(record.ingredient)),
);

export function listProcessingIngredients(): readonly ProcessingIngredient[] {
  return processingIngredients;
}

export function getProcessingIngredient(ingredientId: string): ProcessingIngredient {
  if (typeof ingredientId !== "string") {
    throw new Error(`ingredientId is invalid: ${formatProcessingInputValue(ingredientId)}`);
  }
  const record = processingIngredientsById.get(ingredientId);
  if (record === undefined) {
    throw new Error(`Unknown processing ingredientId: ${formatProcessingInputValue(ingredientId)}`);
  }
  return record.ingredient;
}

export function isBearsKnowledgeEligible(ingredientId: string): boolean {
  getProcessingIngredient(ingredientId);
  return BEARS_KNOWLEDGE_ELIGIBLE_INGREDIENT_IDS.has(ingredientId);
}

export function getProcessingIngredientQualities(ingredientId: string): readonly ProcessingQuality[] {
  const ingredient = getProcessingIngredient(ingredientId);
  if (ingredientId === "blackberry" || ingredientId === "salmonberry") {
    return BUSH_FORAGE_PROCESSING_QUALITIES;
  }
  if (!ingredient.hasQualityTiers) {
    return NORMAL_ONLY_PROCESSING_QUALITIES;
  }
  return PROCESSING_QUALITIES;
}

export function calculateProcessingRoute(input: CalculateProcessingRouteInput): ProcessingRouteQuote {
  const validatedInput = validateProcessingInput(input);
  const inputFields = readProcessingInputFields(input);
  const machine = inputFields.machine;
  if (!isProcessingMachine(machine)) {
    throw new Error(`machine is invalid: ${formatProcessingInputValue(machine)}`);
  }
  return createProcessingRouteQuote(validatedInput, machine);
}

export function calculateProcessingRoutes(
  input: CalculateProcessingRoutesInput,
): readonly ProcessingRouteQuote[] {
  const validatedInput = validateProcessingInput(input);
  return PROCESSING_MACHINES.map((machine) => createProcessingRouteQuote(validatedInput, machine));
}

function readProcessingInputFields(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`input is invalid: ${formatProcessingInputValue(input)}`);
  }
  return input as Record<string, unknown>;
}

function validateProcessingInput(input: unknown): ValidatedProcessingInput {
  const inputFields = readProcessingInputFields(input);
  const ingredientId = inputFields.ingredientId;
  if (typeof ingredientId !== "string") {
    throw new Error(`ingredientId is invalid: ${formatProcessingInputValue(ingredientId)}`);
  }
  const ingredient = getProcessingIngredient(ingredientId);

  const hasBearsKnowledge = inputFields.hasBearsKnowledge === undefined
    ? false
    : inputFields.hasBearsKnowledge;
  if (typeof hasBearsKnowledge !== "boolean") {
    throw new Error(`hasBearsKnowledge is invalid: ${formatProcessingInputValue(hasBearsKnowledge)}`);
  }

  const coconutSource = inputFields.coconutSource === undefined
    ? "foraged"
    : inputFields.coconutSource;
  if (!PROCESSING_COCONUT_SOURCES.includes(coconutSource as ProcessingCoconutSource)) {
    throw new Error(`coconutSource is invalid: ${formatProcessingInputValue(coconutSource)}`);
  }
  const typedCoconutSource = coconutSource as ProcessingCoconutSource;

  const quantity = inputFields.quantity;
  if (!Number.isSafeInteger(quantity) || (quantity as number) < 0) {
    throw new Error(`quantity is invalid: ${formatProcessingInputValue(quantity)}`);
  }

  const quality = inputFields.quality;
  if (!PROCESSING_QUALITIES.includes(quality as ProcessingQuality)) {
    throw new Error(`quality is invalid: ${formatProcessingInputValue(quality)}`);
  }
  const supportedQualities = getProcessingIngredientQualities(ingredientId);
  if (!supportedQualities.includes(quality as ProcessingQuality)) {
    throw new Error(
      `quality is unsupported for ingredientId ${JSON.stringify(ingredientId)}: ${formatProcessingInputValue(quality)}`,
    );
  }

  const profession = inputFields.profession;
  if (!PROCESSING_PROFESSIONS.includes(profession as ProcessingProfession)) {
    throw new Error(`profession is invalid: ${formatProcessingInputValue(profession)}`);
  }

  const mode = inputFields.mode;
  if (!PROCESSING_MODES.includes(mode as ProcessingMode)) {
    throw new Error(`mode is invalid: ${formatProcessingInputValue(mode)}`);
  }

  const deadlineDays = inputFields.deadlineDays;
  if (!Number.isSafeInteger(deadlineDays) || (deadlineDays as number) < 0) {
    throw new Error(`deadlineDays is invalid: ${formatProcessingInputValue(deadlineDays)}`);
  }

  const machineCounts = validateProcessingMachineCounts(inputFields.machineCounts);
  const typedQuality = quality as ProcessingQuality;
  const typedProfession = profession as ProcessingProfession;
  const rawUnitPrice = calculateRawUnitPrice(
    ingredient,
    typedQuality,
    typedProfession,
    hasBearsKnowledge,
    typedCoconutSource,
  );
  const rawValue = rawUnitPrice * (quantity as number);
  if (!Number.isSafeInteger(rawValue)) {
    throw new Error(`quantity produces an unsafe rawValue: ${formatProcessingInputValue(rawValue)}`);
  }

  return {
    ingredient,
    quantity: quantity as number,
    quality: typedQuality,
    profession: typedProfession,
    mode: mode as ProcessingMode,
    deadlineDays: deadlineDays as number,
    machineCounts,
    hasBearsKnowledge,
    coconutSource: typedCoconutSource,
    rawUnitPrice,
    rawValue,
  };
}

function validateProcessingMachineCounts(value: unknown): ProcessingMachineCounts {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`machineCounts is invalid: ${formatProcessingInputValue(value)}`);
  }
  const machineCountFields = value as Record<string, unknown>;
  const machineCounts = {} as Record<ProcessingMachine, number>;

  for (const machine of PROCESSING_MACHINES) {
    const machineCount = machineCountFields[machine];
    if (!Number.isSafeInteger(machineCount) || (machineCount as number) < 0) {
      throw new Error(`machineCounts.${machine} is invalid: ${formatProcessingInputValue(machineCount)}`);
    }
    machineCounts[machine] = machineCount as number;
  }

  return machineCounts;
}

function calculateRawUnitPrice(
  ingredient: ProcessingIngredient,
  quality: ProcessingQuality,
  profession: ProcessingProfession,
  hasBearsKnowledge: boolean,
  coconutSource: ProcessingCoconutSource,
): number {
  const isBearsKnowledgeApplied = hasBearsKnowledge && BEARS_KNOWLEDGE_ELIGIBLE_INGREDIENT_IDS.has(ingredient.id);
  const isTillerEligible = ingredient.id === "coconut"
    ? coconutSource === "purchased-or-gifted"
    : ingredient.tillerBonusEligible;
  const hasTillerProfession = profession !== "none" && isTillerEligible;
  const qualityAdjustedRawPrice = floorProcessingGold(
    ingredient.basePrice * QUALITY_PRICE_MULTIPLIERS[quality],
  );
  let rawUnitPrice = qualityAdjustedRawPrice;

  if (isBearsKnowledgeApplied && hasTillerProfession) {
    rawUnitPrice = floorProcessingGold(qualityAdjustedRawPrice * 3 * 1.1);
  } else if (isBearsKnowledgeApplied) {
    rawUnitPrice = floorProcessingGold(qualityAdjustedRawPrice * 3);
  } else if (hasTillerProfession) {
    rawUnitPrice = rawCropUnitPrice(rawUnitPrice, "tiller");
  }
  if (profession === "artisan" && ingredient.rawArtisanBonusEligible) {
    rawUnitPrice = processedBatchPrice(rawUnitPrice, "artisan");
  }
  return rawUnitPrice;
}

function createProcessingRouteQuote(
  input: ValidatedProcessingInput,
  machine: ProcessingMachine,
): ProcessingRouteQuote {
  const ingredientRecord = processingIngredientsById.get(input.ingredient.id);
  if (ingredientRecord === undefined) {
    throw new Error(`Processing ingredient record is missing: ${JSON.stringify(input.ingredient.id)}`);
  }
  const recipe = ingredientRecord.recipes[machine];
  const machineCount = input.machineCounts[machine];
  if (recipe === undefined) {
    return createUnavailableProcessingRouteQuote(input, machine, machineCount);
  }

  const processingMornings = processingDurationDays(machine, recipe.processingMinutes);
  const batchOutputPrice = recipe.artisanBonusEligible && input.profession === "artisan"
    ? processedBatchPrice(recipe.baseOutputPrice, "artisan")
    : recipe.baseOutputPrice;
  assertSafeProcessingGold("batchOutputPrice", batchOutputPrice);
  const batchValueAdded = batchOutputPrice - recipe.batchInputUnits * input.rawUnitPrice;
  assertSafeProcessingGold("batchValueAdded", batchValueAdded);
  const counts = countRouteBatches(input, machineCount, recipe.batchInputUnits, processingMornings);
  const processedValue = counts.processedBatches * batchOutputPrice;
  assertSafeProcessingGold("processedValue", processedValue);
  const backlogValue = counts.backlogUnits * input.rawUnitPrice;
  assertSafeProcessingGold("backlogValue", backlogValue);
  const finalValue = processedValue + backlogValue;
  assertSafeProcessingGold("finalValue", finalValue);
  const valueAdded = finalValue - input.rawValue;
  assertSafeProcessingGold("valueAdded", valueAdded);

  return {
    machine,
    applicable: true,
    unavailableReason: null,
    productEnglishName: recipe.productEnglishName,
    productChineseName: recipe.productChineseName,
    batchInputUnits: recipe.batchInputUnits,
    processingMinutes: recipe.processingMinutes,
    processingMornings,
    machineCount,
    rawUnitPrice: input.rawUnitPrice,
    rawValue: input.rawValue,
    batchOutputPrice,
    processedBatches: counts.processedBatches,
    processedUnits: counts.processedUnits,
    backlogUnits: counts.backlogUnits,
    processedValue,
    backlogValue,
    finalValue,
    valueAdded,
    valueAddedPerProcessedUnit: batchValueAdded / recipe.batchInputUnits,
    valueAddedPerMachineDay: batchValueAdded / processingMornings,
  };
}

function countRouteBatches(
  input: ValidatedProcessingInput,
  machineCount: number,
  batchInputUnits: number,
  processingMornings: number,
): { readonly processedBatches: number; readonly processedUnits: number; readonly backlogUnits: number } {
  if (input.quantity === 0) {
    return { processedBatches: 0, processedUnits: 0, backlogUnits: 0 };
  }

  if (input.mode === "unlimited") {
    const processedBatches = Math.floor(input.quantity / batchInputUnits);
    const processedUnits = processedBatches * batchInputUnits;
    return {
      processedBatches,
      processedUnits,
      backlogUnits: input.quantity - processedUnits,
    };
  }

  if (machineCount === 0 || input.deadlineDays === 0) {
    return { processedBatches: 0, processedUnits: 0, backlogUnits: input.quantity };
  }

  const totalBatches = Math.floor(input.quantity / batchInputUnits);
  const batchesPerMachine = Math.floor(input.deadlineDays / processingMornings);
  const processedBatches = batchesPerMachine === 0
    ? 0
    : machineCount >= Math.ceil(totalBatches / batchesPerMachine)
      ? totalBatches
      : machineCount * batchesPerMachine;
  const processedUnits = processedBatches * batchInputUnits;
  return {
    processedBatches,
    processedUnits,
    backlogUnits: input.quantity - processedUnits,
  };
}

function createUnavailableProcessingRouteQuote(
  input: ValidatedProcessingInput,
  machine: ProcessingMachine,
  machineCount: number,
): ProcessingRouteQuote {
  return {
    machine,
    applicable: false,
    unavailableReason: "recipe-not-supported",
    productEnglishName: null,
    productChineseName: null,
    batchInputUnits: null,
    processingMinutes: null,
    processingMornings: null,
    machineCount,
    rawUnitPrice: input.rawUnitPrice,
    rawValue: input.rawValue,
    batchOutputPrice: null,
    processedBatches: 0,
    processedUnits: 0,
    backlogUnits: input.quantity,
    processedValue: 0,
    backlogValue: input.rawValue,
    finalValue: input.rawValue,
    valueAdded: 0,
    valueAddedPerProcessedUnit: null,
    valueAddedPerMachineDay: null,
  };
}

function floorProcessingGold(value: number): number {
  return Math.floor(value + 1e-9);
}

function assertSafeProcessingGold(fieldName: string, goldAmount: number): void {
  if (!Number.isSafeInteger(goldAmount)) {
    throw new Error(`${fieldName} is outside safe integer range: ${formatProcessingInputValue(goldAmount)}`);
  }
}

function isProcessingMachine(value: unknown): value is ProcessingMachine {
  return PROCESSING_MACHINES.includes(value as ProcessingMachine);
}

function formatProcessingInputValue(value: unknown): string {
  if (typeof value === "number" && !Number.isFinite(value)) return String(value);
  return JSON.stringify(value) ?? String(value);
}
