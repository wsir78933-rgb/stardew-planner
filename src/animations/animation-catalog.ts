import type { CatalogJsonFetcher } from "../catalog/catalog-types";
import type { PlacementAnimationOptions } from "./placement-animation-options";

const localAssetRoot = "/game-assets/1.6.15";
const animationDataRoot = `${localAssetRoot}/data`;
let defaultAnimationCatalogPromise: Promise<AnimationCatalog> | undefined;

export type AnimationSourceRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type AnimationFrameDescriptor = AnimationSourceRect & Readonly<{
  durationMilliseconds: number;
}>;

export type AnimationChoice = Readonly<{
  id: string;
  label: string;
  catalogItemId?: string;
  spriteIndex?: number;
  frameOffset?: number;
  textureLocalPath?: string;
  sourceRect?: AnimationSourceRect;
  colorOverlay?: boolean;
  overlaySourceRect?: AnimationSourceRect;
  dyeColor?: number;
}>;

export type AnimationControlDefinition =
  | Readonly<{
      kind: "select";
      key: "spriteState" | "readyProduct" | "fishId" | "produce" | "petId" | "hatId" | "shirtId" | "pantsId" | "millProduct";
      choices: readonly AnimationChoice[];
      disabledWhen?: Readonly<{ field: "spriteState"; value: string }>;
    }>
  | Readonly<{
      kind: "checkbox";
      key: "fireplaceLit" | "clockOff" | "horse" | "junimos" | "millLoaded" | "millOutput";
    }>
  | Readonly<{
      kind: "number";
      key: "population";
      minimum: number;
      maximum: number;
    }>
  | Readonly<{
      kind: "multiSelect";
      key: "tankFish";
      choices: readonly AnimationChoice[];
    }>
  | Readonly<{
      kind: "animalList";
      key: "animals";
      choices: readonly AnimationChoice[];
      maxCount: number;
    }>;

export type AnimationFishPondDefinition = Readonly<{
  id: string;
  label: string;
  catalogItemId: string;
  textureLocalPath: string;
  sourceRect: AnimationSourceRect;
  maxPopulation: number;
  spriteIndex?: number;
  produce: readonly Readonly<AnimationChoice & {
    requiredPopulation: number;
    maximumStackSize: number;
  }>[];
}>;

export type AnimationAquariumFishDefinition = Readonly<{
  id: string;
  label: string;
  spriteIndex: number;
  type: "float" | "fish" | "eel" | "cephalopod" | "static" | "ground" | "crawl" | "front_crawl";
  simType: "normal" | "float" | "eel" | "cephalopod" | "static" | "ground" | "crawl";
  frontCrawl: boolean;
  idleFrame: number;
  idleAnimation: readonly number[] | null;
  dartStart: readonly number[] | null;
  dartHold: readonly number[] | null;
  dartEnd: readonly number[] | null;
  fishBehavior: "normal" | "smooth" | "dart" | null;
  catalogItemId: string;
  textureLocalPath: string;
}>;

export type AnimationFarmAnimalDefinition = Readonly<{
  id: string;
  label: string;
  house: string;
  requiredBuilding: string | null;
  textureLocalPath: string;
  spriteWidth: number;
  spriteHeight: number;
  sleepFrame: number;
  canSwim: boolean;
  useFlippedRightForLeft: boolean;
  useDoubleUniqueAnimationFrames: boolean;
}>;

export type AnimationPetDefinition = Readonly<{
  id: string;
  label: string;
  species: "Cat" | "Dog" | "Turtle";
  breedId: string;
  textureLocalPath: string;
  spriteFrameWidth: number;
  spriteFrameHeight: number;
  spriteFrameColumns: number;
  spriteFrameCount: number;
  moveSpeed: number;
  walk: Readonly<{
    randomizeDirection: boolean;
    walkInDirection: boolean;
    moveSpeed: number;
    randomBehaviorChangeChance: number;
    frameDurationMilliseconds: number;
    frameIndicesByDirection: Readonly<Record<"down" | "right" | "up" | "left", readonly number[]>>;
  }>;
}>;

export type AnimationPetHatRenderDescriptor = Readonly<{
  textureLocalPath: string;
  sourceRect: AnimationSourceRect;
  direction: number;
  offsetXInTiles: number;
  offsetYInTiles: number;
  scaleFactor: number;
}>;

export type AnimationStableHorseHatRenderDescriptor = AnimationPetHatRenderDescriptor;

export type AnimationClothingDefinition = Readonly<{
  id: string;
  label: string;
  category: "hat" | "shirt" | "pants";
  spriteIndex: number;
  isPrismatic: boolean;
  catalogItemId: string;
  textureLocalPath: string;
  dyeTextureLocalPath?: string;
  canBeDyed?: boolean;
  defaultColor?: number | null;
  hasSleeves?: boolean;
}>;

export type AnimationMannequinDefinition = Readonly<{
  textureLocalPath: string;
  isMale: boolean;
  cursed: boolean;
}>;

export type AnimationBuildingDrawLayer = Readonly<{
  id: string;
  sourceRect: AnimationSourceRect;
  drawPositionX: number;
  drawPositionY: number;
  frameCount: number;
  frameDurationMilliseconds: number;
  framesPerRow: number;
  onlyDrawIfChestHasContents?: "Input";
}>;

export type AnimationBuildingDefinition =
  | Readonly<{
      kind: "mill";
      textureLocalPath: string;
      layers: readonly AnimationBuildingDrawLayer[];
      outputChoices: readonly AnimationChoice[];
      defaultOutputProductId: "246";
      chestBubble: Readonly<{
        textureLocalPath: string;
        chestId: "Output";
        displayTileX: number;
        displayTileY: number;
        displayHeight: number;
        sourceRect: AnimationSourceRect;
        opacity: number;
      }>;
    }>
  | Readonly<{
      kind: "chimney-smoke";
      textureLocalPath: string;
      puffFrame: AnimationSourceRect;
      chimneyPosition: Readonly<{ x: number; y: number }>;
      particleIntervalMilliseconds: number;
      lifetimeSeconds: number;
      tintColor: string;
    }>
  | Readonly<{
      kind: "stable-horse";
      textureLocalPath: string;
      frameWidth: number;
      frameHeight: number;
      columns: number;
      frameCount: number;
      idleFrameIndex: number;
      walkingFrameIndices: readonly number[];
      walkingFrameDurationsMilliseconds: readonly number[];
    }>
  | Readonly<{
      kind: "junimo-hut";
      textureLocalPath: string;
      shadowTextureLocalPath: string;
      frameWidth: number;
      frameHeight: number;
      columns: number;
      frameCount: number;
    }>
  | Readonly<{
      kind: "fish-pond" | "pet-bowl" | "gold-clock";
    }>;

export type AnimationCatalog = Readonly<{
  waterSurface: Readonly<{
    textureLocalPath: string;
    frames: readonly Readonly<{
      index: number;
      durationMilliseconds: number;
      sourceRectsByFlip: readonly [AnimationSourceRect, AnimationSourceRect];
    }>[];
  }>;
  fire: Readonly<{
    textureLocalPath: string;
    smallFrames: readonly AnimationFrameDescriptor[];
    bigFrames: readonly AnimationFrameDescriptor[];
    lightGlowFrame: AnimationSourceRect;
    frameIntervalMilliseconds: number;
  }>;
  smoke: Readonly<{
    textureLocalPath: string;
    puffFrame: AnimationSourceRect;
    particleIntervalMilliseconds: number;
    lifetimeSeconds: number;
    firstPlumeCount: number;
    tintColor: string;
    anchorX: number;
    anchorY: number;
  }>;
  bubbles: Readonly<{
    textureLocalPath: string;
    puffFrame: AnimationSourceRect;
    particleIntervalMilliseconds: number;
    lifetimeSeconds: number;
    firstPlumeCount: number;
    initialOpacity: number;
    opacityDecreasePerTick: number;
    tintColor: string;
    offsetX: number;
    offsetY: number;
    zIndexOffset: number;
  }>;
  crabPot: Readonly<{
    textureLocalPath: string;
    frames: readonly AnimationFrameDescriptor[];
  }>;
  machineStatesById: Readonly<Record<string, Readonly<{
    choices: readonly AnimationChoice[];
    workingStateId?: string;
  }>>>;
  machineOutputsById: Readonly<Record<string, readonly AnimationChoice[]>>;
  buildingAnimationsById: Readonly<Record<string, AnimationBuildingDefinition>>;
  pondFishById: Readonly<Record<string, AnimationFishPondDefinition>>;
  aquariumFishById: Readonly<Record<string, AnimationAquariumFishDefinition>>;
  aquariumFishAtlas: Readonly<{
    textureLocalPath: string;
    textureWidth: number;
    textureHeight: number;
    frameWidth: number;
    frameHeight: number;
    columns: number;
    rowStride: number;
    scaleFactor: number;
    segmentWidthBySimulationType: Readonly<Record<AnimationAquariumFishDefinition["simType"], number>>;
  }>;
  farmAnimalsById: Readonly<Record<string, AnimationFarmAnimalDefinition>>;
  petsById: Readonly<Record<string, AnimationPetDefinition>>;
  petHatTextureLocalPath: string;
  clothingById: Readonly<Record<string, AnimationClothingDefinition>>;
  mannequinsById: Readonly<Record<string, AnimationMannequinDefinition>>;
  prismaticItemIds: readonly string[];
  controlsByCatalogItemId: Readonly<Record<string, readonly AnimationControlDefinition[]>>;
}>;

export type AnimationControlOptions = Readonly<
  Pick<PlacementAnimationOptions, "fishId" | "population" | "petId" | "horse" | "millOutput">
>;

export async function loadPlannerAnimationCatalog(
  fetchAnimationJson?: CatalogJsonFetcher,
): Promise<AnimationCatalog> {
  if (fetchAnimationJson !== undefined) {
    validateAnimationJsonFetcher(fetchAnimationJson);
    return createAnimationCatalog(await loadAnimationDatasets(fetchAnimationJson));
  }
  if (defaultAnimationCatalogPromise === undefined) {
    const catalogPromise = loadPlannerAnimationCatalog(fetchBrowserAnimationJson);
    let cachedCatalogPromise: Promise<AnimationCatalog>;
    cachedCatalogPromise = catalogPromise.catch((loadError: unknown) => {
      if (defaultAnimationCatalogPromise === cachedCatalogPromise) {
        defaultAnimationCatalogPromise = undefined;
      }
      throw loadError;
    });
    defaultAnimationCatalogPromise = cachedCatalogPromise;
  }
  return defaultAnimationCatalogPromise;
}

export function getAnimationControlsForCatalogItem(
  animationCatalog: AnimationCatalog,
  catalogItemId: string,
  options?: AnimationControlOptions,
): readonly AnimationControlDefinition[] {
  assertAnimationCatalog(animationCatalog);
  assertCatalogItemId(catalogItemId);
  const controlDefinitions = animationCatalog.controlsByCatalogItemId[catalogItemId] ?? [];
  const pondFishId = options?.fishId;
  const fishPopulation = options?.population ?? 0;
  if (options?.fishId !== undefined && animationCatalog.pondFishById[options.fishId] === undefined) {
    throw new RangeError(`Animation controls received an unknown fishId: ${JSON.stringify(options.fishId)}.`);
  }
  if (options?.petId !== undefined && animationCatalog.petsById[options.petId] === undefined) {
    throw new RangeError(`Animation controls received an unknown petId: ${JSON.stringify(options.petId)}.`);
  }
  if (!Number.isSafeInteger(fishPopulation) || fishPopulation < 0) {
    throw new RangeError(`Animation controls population must be a non-negative safe integer; received ${JSON.stringify(fishPopulation)}.`);
  }
  const selectedPondFish = options?.fishId === undefined
    ? undefined
    : animationCatalog.pondFishById[options.fishId];
  const selectedPet = options?.petId === undefined
    ? undefined
    : animationCatalog.petsById[options.petId];
  const effectivePopulation = Math.min(fishPopulation, selectedPondFish?.maxPopulation ?? fishPopulation);
  const isPetBowl = ["Pet Bowl", "Stone Pet Bowl", "Hay Pet Bowl"]
    .some((petBowlId) => catalogItemId === `building:${petBowlId}`);
  const isStableWithoutHorse = catalogItemId === "building:Stable" && options?.horse !== true;
  const isMillWithoutOutput = catalogItemId === "building:Mill" && options?.millOutput !== true;

  return controlDefinitions.filter((controlDefinition) => {
    return !(
      controlDefinition.kind === "select" &&
      ((controlDefinition.key === "hatId" &&
        ((isPetBowl && selectedPet?.species === "Turtle") || isStableWithoutHorse)) ||
        (controlDefinition.key === "millProduct" && isMillWithoutOutput))
    );
  }).map((controlDefinition) => {
    if (controlDefinition.kind === "number" && controlDefinition.key === "population") {
      return {
        ...controlDefinition,
        maximum: selectedPondFish?.maxPopulation ?? controlDefinition.maximum,
      };
    }
    if (controlDefinition.kind !== "select" || controlDefinition.key !== "produce") {
      return controlDefinition;
    }

    const choices = selectedPondFish?.produce
      .filter((produceChoice) => produceChoice.requiredPopulation <= effectivePopulation)
      .map(({ id, label, catalogItemId: choiceCatalogItemId }) => ({
        id,
        label,
        ...(choiceCatalogItemId === undefined
          ? {}
          : { catalogItemId: choiceCatalogItemId }),
      })) ?? [];

    return { ...controlDefinition, choices };
  });
}

export function isAnimationCatalogItemCandidate(catalogItemId: string): boolean {
  assertCatalogItemId(catalogItemId);
  return animationCandidateCatalogItemIds.has(catalogItemId);
}

export function getPetHatRenderDescriptor(
  animationCatalog: AnimationCatalog,
  petId: string,
  hatId: string,
  bodyFrameIndex: number,
  flipped: boolean,
): AnimationPetHatRenderDescriptor {
  assertAnimationCatalog(animationCatalog);
  assertCatalogItemId(petId);
  assertCatalogItemId(hatId);
  const petDefinition = animationCatalog.petsById[petId];
  if (petDefinition === undefined) {
    throw new RangeError(`Pet hat descriptor received an unknown petId: ${JSON.stringify(petId)}.`);
  }
  if (petDefinition.species === "Turtle") {
    throw new RangeError(`Pet hat descriptor does not support turtle petId ${JSON.stringify(petId)}.`);
  }
  const hatDefinition = animationCatalog.clothingById[`hat:${hatId}`];
  if (hatDefinition === undefined) {
    throw new RangeError(`Pet hat descriptor received an unknown hatId: ${JSON.stringify(hatId)}.`);
  }
  const validBodyFrameIndex = readNonNegativeInteger(bodyFrameIndex, `Pet ${petId} bodyFrameIndex`);
  if (validBodyFrameIndex >= petDefinition.spriteFrameCount) {
    throw new RangeError(`Pet ${JSON.stringify(petId)} bodyFrameIndex must be below ${String(petDefinition.spriteFrameCount)}; received ${String(bodyFrameIndex)}.`);
  }
  if (typeof flipped !== "boolean") {
    throw new TypeError(`Pet hat descriptor flipped must be boolean; received ${describeValue(flipped)}.`);
  }

  const hatMotion = getPetHatMotion(petDefinition.species, petDefinition.breedId, validBodyFrameIndex, flipped);
  return {
    textureLocalPath: animationCatalog.petHatTextureLocalPath,
    sourceRect: getPetHatSourceRect(hatDefinition.spriteIndex, hatMotion.direction),
    direction: hatMotion.direction,
    offsetXInTiles: (hatMotion.offsetX + 10 - 9 * hatMotion.scaleSize) / 4,
    offsetYInTiles: (hatMotion.offsetY + 10 - 9 * hatMotion.scaleSize) / 4,
    scaleFactor: (3 * hatMotion.scaleSize) / 4,
  };
}

export function getStableHorseHatRenderDescriptor(
  animationCatalog: AnimationCatalog,
  hatId: string,
  horseFrameIndex: number,
): AnimationStableHorseHatRenderDescriptor | null {
  assertAnimationCatalog(animationCatalog);
  assertCatalogItemId(hatId);
  const hatDefinition = animationCatalog.clothingById[`hat:${hatId}`];
  if (hatDefinition === undefined) {
    throw new RangeError(`Stable horse hat descriptor received an unknown hatId: ${JSON.stringify(hatId)}.`);
  }
  const validHorseFrameIndex = readNonNegativeInteger(horseFrameIndex, "Stable horse hat horseFrameIndex");
  const stableDefinition = animationCatalog.buildingAnimationsById["building:Stable"];
  if (stableDefinition?.kind !== "stable-horse" || validHorseFrameIndex >= stableDefinition.frameCount) {
    throw new RangeError(`Stable horse hat horseFrameIndex must be below ${String(stableDefinition?.kind === "stable-horse" ? stableDefinition.frameCount : 0)}; received ${String(horseFrameIndex)}.`);
  }
  const hatMotion = getStableHorseHatMotion(validHorseFrameIndex, hatId);
  if (hatMotion === null) {
    return null;
  }
  return {
    textureLocalPath: animationCatalog.petHatTextureLocalPath,
    sourceRect: getPetHatSourceRect(hatDefinition.spriteIndex, hatMotion.direction),
    direction: hatMotion.direction,
    offsetXInTiles: (hatMotion.offsetX + 10 - 9 * hatMotion.scaleSize) / 4,
    offsetYInTiles: (hatMotion.offsetY + 10 - 9 * hatMotion.scaleSize) / 4,
    scaleFactor: (3 * hatMotion.scaleSize) / 4,
  };
}

const animationDatasetUrls = {
  farmAnimals: `${animationDataRoot}/FarmAnimals.json`,
  pets: `${animationDataRoot}/Pets.json`,
  aquariumFish: `${animationDataRoot}/AquariumFish.json`,
  fishPondData: `${animationDataRoot}/FishPondData.json`,
  fish: `${animationDataRoot}/Fish.json`,
  hats: `${animationDataRoot}/hats.json`,
  shirts: `${animationDataRoot}/Shirts.json`,
  pants: `${animationDataRoot}/Pants.json`,
  buildings: `${animationDataRoot}/Buildings.json`,
  objects: `${animationDataRoot}/Objects.json`,
  bigCraftables: `${animationDataRoot}/BigCraftables.json`,
  furniture: `${animationDataRoot}/Furniture.json`,
} as const;

type AnimationDatasetName = keyof typeof animationDatasetUrls;
type RawAnimationDatasets = Readonly<Record<AnimationDatasetName, unknown>>;
type JsonRecord = Readonly<Record<string, unknown>>;

const machineSpriteStatesByRawId: Readonly<Record<string, readonly string[]>> = {
  "13": ["empty", "working"],
  "114": ["empty", "working"],
  "182": ["empty", "working"],
  HeavyFurnace: ["empty", "working"],
  FishSmoker: ["empty", "working"],
  "12": ["idle", "working"],
  "15": ["idle", "working"],
  "19": ["idle", "working"],
  "158": ["idle", "working"],
  "16": ["idle", "working"],
  "24": ["idle", "working"],
  "21": ["idle", "working"],
  "25": ["idle", "working"],
  "20": ["idle", "working"],
  "90": ["idle", "working"],
  "265": ["idle", "working"],
  "154": ["idle", "working"],
  DeluxeWormBin: ["idle", "working"],
  "9": ["idle", "working"],
  Dehydrator: ["idle", "working"],
  BaitMaker: ["idle", "working"],
  Anvil: ["idle", "working"],
  "163": ["none", "silver", "gold", "iridium"],
  "17": ["empty", "working", "ready"],
  "10": ["empty", "ready"],
  "128": ["empty", "ready"],
  MushroomLog: ["empty", "ready"],
};

const machineStateFrameOffsetsByRawId: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  "13": { working: 1 },
  "114": { working: 1 },
  "182": { working: 1 },
  HeavyFurnace: { working: 1 },
  FishSmoker: { working: 1 },
  "17": { ready: 1 },
  "10": { ready: 1 },
  "128": { ready: 1 },
  MushroomLog: { ready: 1 },
};

const millOutputProductIds = ["246", "245", "423"] as const;

const machineOutputRawIdsByMachineId: Readonly<Record<string, readonly string[]>> = {
  "12": ["348", "350", "346", "303", "459", "614", "395", "419"],
  "15": ["344", "342", "447", "445"],
  "163": ["348", "424", "426", "303", "346", "459"],
  "16": ["424", "426"],
  "24": ["306", "307", "308", "807"],
  "19": ["247", "432"],
  "17": ["428"],
  "10": ["340"],
  "13": ["334", "335", "336", "337", "338", "277", "910"],
  HeavyFurnace: ["334", "335", "336", "337", "338", "277", "910"],
  "114": ["382"],
  "21": ["72", "60", "62", "64", "66", "68", "70", "80", "82", "84", "86"],
  "20": ["388", "390", "382", "380", "338", "428", "93"],
  "154": ["685"],
  DeluxeWormBin: ["DeluxeBait"],
  "128": ["404", "257", "281", "420", "422"],
  "9": ["787"],
  "127": ["72", "337", "749", "336"],
  "160": ["386"],
  "280": ["74"],
  "211": ["388", "724", "725", "726"],
  "object_710": ["715", "716", "717", "718", "719", "720", "721", "722", "723", "372"],
  "105": ["724", "725", "726", "420"],
  "264": ["724", "725", "726", "420"],
  "25": ["472", "473", "474", "475", "476", "273", "831", "477", "478", "745", "479", "480", "481", "482", "483", "484", "485", "486", "833", "802", "487", "302", "301", "299", "488", "489", "490", "491", "492", "493", "494", "499", "427", "429", "453", "455", "431", "425", "347", "495", "496", "497", "498", "890", "CarrotSeeds", "SummerSquashSeeds", "BroccoliSeeds", "PowdermelonSeeds", "770"],
  "182": ["538", "542", "548", "549", "552", "555", "556", "557", "558", "566", "568", "569", "571", "574", "576", "121", "541", "544", "545", "546", "550", "551", "559", "560", "561", "564", "567", "572", "573", "577", "123", "539", "540", "543", "547", "553", "554", "562", "563", "565", "570", "575", "578", "122", "390", "330", "82", "84", "86", "378", "380", "382", "384", "386", "74", "890"],
  "265": ["388", "390", "709", "771", "MysticSyrup", "92", "724", "725", "82", "378", "335", "337", "338", "767", "334", "336", "Moss", "SeaJelly", "382", "787", "292", "909", "330", "380", "384", "114", "340", "393", "386", "852", "432", "428", "309", "276", "684", "453", "881", "72", "768", "848", "910", "62", "86", "726", "122"],
  Anvil: ["FrogEgg", "MagicQuiver", "FairyBox", "ParrotEgg", "IceRod", "IridiumSpur"],
  "156": ["413", "437", "439", "680", "857"],
  "101": ["176", "174", "180", "182", "305", "928", "442", "107", "289"],
  "254": ["289"],
  "90": ["466", "465", "369", "805"],
  "158": ["439", "437", "413", "680"],
  MushroomLog: ["404", "420", "422", "257", "281"],
  "117": ["167"],
  "246": ["395"],
  "231": ["787"],
  BaitMaker: ["SpecificBait"],
  Dehydrator: ["Raisins", "DriedFruit", "DriedMushrooms"],
  FishSmoker: ["SmokedFish"],
};

const anvilTrinketProductsById: Readonly<Record<string, Readonly<{ label: string; spriteIndex: number }>>> = {
  FrogEgg: { label: "Frog Egg", spriteIndex: 6 },
  ParrotEgg: { label: "Parrot Egg", spriteIndex: 2 },
  MagicQuiver: { label: "Magic Quiver", spriteIndex: 73 },
  FairyBox: { label: "Fairy Box", spriteIndex: 74 },
  IridiumSpur: { label: "Iridium Spur", spriteIndex: 76 },
  IceRod: { label: "Ice Rod", spriteIndex: 78 },
};

const productDyeColorsByContextTag: Readonly<Record<string, number>> = {
  color_black: 2960685,
  color_gray: 8421504,
  color_white: 16777215,
  color_pink: 16753594,
  color_red: 14417920,
  color_orange: 16744448,
  color_yellow: 16770560,
  color_green: 691968,
  color_blue: 3036599,
  color_purple: 7547317,
  color_brown: 8538405,
  color_light_cyan: 11862015,
  color_cyan: 65535,
  color_aquamarine: 8388564,
  color_sea_green: 3050327,
  color_lime: 65280,
  color_yellow_green: 11403055,
  color_pale_violet_red: 14381203,
  color_salmon: 16733535,
  color_jade: 8560221,
  color_sand: 16768685,
  color_poppyseed: 5386137,
  color_dark_red: 9109504,
  color_dark_orange: 16747520,
  color_dark_yellow: 12092939,
  color_dark_green: 25600,
  color_dark_blue: 139,
  color_dark_purple: 9699539,
  color_dark_pink: 16716947,
  color_dark_cyan: 35723,
  color_dark_gray: 11119017,
  color_dark_brown: 9127187,
  color_gold: 16766720,
  color_copper: 11752704,
  color_iron: 12965344,
  color_iridium: 6885375,
};

const chimneyBaseBuildingIds = [
  "Cabin", "Plank Cabin", "Log Cabin", "Neighbor Cabin", "Rustic Cabin",
  "Beach Cabin", "Trailer Cabin",
] as const;
const chimneyBuildingIds = [
  ...chimneyBaseBuildingIds.flatMap((buildingId) => [
    buildingId,
    `${buildingId}_1`,
    `${buildingId}_2`,
  ]),
  "Farmhouse", "Farmhouse_1", "Farmhouse_2",
] as const;
const animalHouseBuildingIds = [
  "Coop", "Big Coop", "Deluxe Coop", "Barn", "Big Barn", "Deluxe Barn",
] as const;
const litBigCraftableRawIds = ["143", "144", "145", "146", "147", "148", "149", "150", "151", "278"] as const;
const fireFurnitureRecordIds = ["1792", "1794", "1796", "1798", "1800", "1866", "DesertFireplace", "JojaFireplace", "WizardFireplace", "JunimoFireplace", "RetroFireplace", "2331", "2397", "2398"] as const;
const aquariumFurnitureRecordIds = ["2304", "2312", "2322", "2400", "2414", "JungleTank"] as const;
const mannequinFurnitureRecordIds = ["mannequin_male", "mannequin_female", "mannequin_cursed_male", "mannequin_cursed_female"] as const;
const prismaticItemIds = ["hat:73", "hat:74", "shirt:1223", "shirt:1997", "shirt:1998", "shirt:1999", "pants:998", "pants:999"] as const;
const petSpriteFrameCountsById: Readonly<Record<string, number>> = {
  "Cat:0": 32,
  "Cat:1": 32,
  "Cat:2": 32,
  "Cat:3": 36,
  "Cat:4": 36,
  "Dog:0": 36,
  "Dog:1": 36,
  "Dog:2": 36,
  "Dog:3": 36,
  "Dog:4": 36,
  "Turtle:0": 36,
  "Turtle:1": 36,
};
const petWalkFrameIndicesByDirection = {
  down: [0, 1, 2, 3],
  right: [4, 5, 6, 7],
  up: [8, 9, 10, 11],
  left: [12, 13, 14, 15],
} as const;

const animationCandidateCatalogItemIds = new Set([
  ...Object.keys(machineSpriteStatesByRawId).map((rawId) => `big-craftable:${rawId}`),
  ...Object.keys(machineOutputRawIdsByMachineId).map(getMachineCatalogItemId),
  "object:710",
  "building:Mill",
  "building:Fish Pond",
  "building:Stable",
  "building:Junimo Hut",
  "building:Gold Clock",
  "building:Pet Bowl",
  "building:Stone Pet Bowl",
  "building:Hay Pet Bowl",
  ...chimneyBuildingIds.map((buildingId) => `building:${buildingId}`),
  ...animalHouseBuildingIds.map((buildingId) => `building:${buildingId}`),
  ...litBigCraftableRawIds.map((rawId) => `big-craftable:${rawId}`),
  ...fireFurnitureRecordIds.map((rawId) => `furniture_${rawId}`),
  ...aquariumFurnitureRecordIds.map((rawId) => `furniture_${rawId}`),
  ...mannequinFurnitureRecordIds.map((rawId) => `furniture_${rawId}`),
  "furniture_Cauldron",
]);

async function loadAnimationDatasets(
  fetchAnimationJson: CatalogJsonFetcher,
): Promise<RawAnimationDatasets> {
  const datasetEntries = Object.entries(animationDatasetUrls) as [
    AnimationDatasetName,
    string,
  ][];
  const loadedDatasetEntries = await Promise.all(
    datasetEntries.map(async ([datasetName, datasetUrl]) => [
      datasetName,
      await fetchAnimationDataset(datasetUrl, fetchAnimationJson),
    ] as const),
  );
  return Object.fromEntries(loadedDatasetEntries) as RawAnimationDatasets;
}

async function fetchAnimationDataset(
  datasetUrl: string,
  fetchAnimationJson: CatalogJsonFetcher,
): Promise<unknown> {
  let response;
  try {
    response = await fetchAnimationJson(datasetUrl);
  } catch (requestError) {
    throw new Error(
      `Animation catalog request failed for local URL ${JSON.stringify(datasetUrl)} before a response was received; cause: ${describeValue(requestError)}.`,
      { cause: requestError },
    );
  }
  if (typeof response !== "object" || response === null || typeof response.ok !== "boolean" || !Number.isInteger(response.status)) {
    throw new TypeError(
      `Animation catalog response for URL ${JSON.stringify(datasetUrl)} must include boolean ok and integer status; received ${describeValue(response)}.`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `Animation catalog request for URL ${JSON.stringify(datasetUrl)} failed with status ${String(response.status)}.`,
    );
  }
  if (typeof response.json !== "function") {
    throw new TypeError(
      `Animation catalog response for URL ${JSON.stringify(datasetUrl)} must include json(); received ${describeValue(response.json)}.`,
    );
  }
  try {
    return await response.json();
  } catch (parsingError) {
    throw new Error(
      `Animation catalog JSON parsing failed for URL ${JSON.stringify(datasetUrl)}; cause: ${describeValue(parsingError)}.`,
      { cause: parsingError },
    );
  }
}

function fetchBrowserAnimationJson(datasetUrl: string) {
  if (typeof globalThis.fetch !== "function") {
    throw new Error(
      `Animation catalog cannot fetch local URL ${JSON.stringify(datasetUrl)} because global fetch is unavailable.`,
    );
  }
  return globalThis.fetch(datasetUrl);
}

function createAnimationCatalog(rawAnimationDatasets: RawAnimationDatasets): AnimationCatalog {
  const farmAnimalsById = createFarmAnimalDefinitions(rawAnimationDatasets.farmAnimals);
  const petsById = createPetDefinitions(rawAnimationDatasets.pets);
  const objectsById = readJsonRecord(rawAnimationDatasets.objects, animationDatasetUrls.objects);
  const fishById = readJsonRecord(rawAnimationDatasets.fish, animationDatasetUrls.fish);
  const pondFishById = createPondFishDefinitions(
    rawAnimationDatasets.fishPondData,
    objectsById,
  );
  const aquariumFishById = createAquariumFishDefinitions(
    rawAnimationDatasets.aquariumFish,
    fishById,
    objectsById,
  );
  const clothingById = createClothingDefinitions(
    rawAnimationDatasets.hats,
    rawAnimationDatasets.shirts,
    rawAnimationDatasets.pants,
  );
  const buildingRecords = readJsonRecord(rawAnimationDatasets.buildings, animationDatasetUrls.buildings);
  const machineStatesById = createMachineStateDefinitions(rawAnimationDatasets.bigCraftables);
  const machineOutputsById = createMachineOutputDefinitions(
    objectsById,
    machineOutputRawIdsByMachineId,
  );
  const buildingAnimationsById = createBuildingAnimationDefinitions(buildingRecords, objectsById);
  const controlsByCatalogItemId = createAnimationControlsByCatalogItemId({
    aquariumFishById,
    buildingAnimationsById,
    buildingRecords,
    clothingById,
    farmAnimalsById,
    machineOutputsById,
    machineStatesById,
    petsById,
    pondFishById,
  });

  return {
    waterSurface: createWaterSurfaceDescriptor(),
    fire: createFireDescriptor(),
    smoke: createSmokeDescriptor(),
    bubbles: createBubbleDescriptor(),
    crabPot: createCrabPotDescriptor(),
    machineStatesById,
    machineOutputsById,
    buildingAnimationsById,
    pondFishById,
    aquariumFishById,
    aquariumFishAtlas: createAquariumFishAtlasDescriptor(),
    farmAnimalsById,
    petsById,
    petHatTextureLocalPath: `${localAssetRoot}/tilesheets/hats_animals.png`,
    clothingById,
    mannequinsById: createMannequinDefinitions(),
    prismaticItemIds,
    controlsByCatalogItemId,
  };
}

function createWaterSurfaceDescriptor(): AnimationCatalog["waterSurface"] {
  const frames = Array.from({ length: 10 }, (_, index) => ({
    index,
    durationMilliseconds: 200,
    sourceRectsByFlip: [
      { x: index * 64, y: 2064, width: 64, height: 64 },
      { x: index * 64, y: 2192, width: 64, height: 64 },
    ] as const,
  }));
  return { textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`, frames };
}

function createFireDescriptor(): AnimationCatalog["fire"] {
  return {
    textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`,
    smallFrames: createHorizontalFrames(276, 1965, 8, 8, 7, 100),
    bigFrames: createHorizontalFrames(276, 1985, 12, 11, 4, 100),
    lightGlowFrame: { x: 88, y: 1779, width: 30, height: 30 },
    frameIntervalMilliseconds: 100,
  };
}

function createSmokeDescriptor(): AnimationCatalog["smoke"] {
  return {
    textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`,
    puffFrame: { x: 372, y: 1956, width: 10, height: 10 },
    particleIntervalMilliseconds: 500,
    lifetimeSeconds: 6.25,
    firstPlumeCount: 13,
    tintColor: "#808080",
    anchorX: 0.5,
    anchorY: 0.5,
  };
}

function createBubbleDescriptor(): AnimationCatalog["bubbles"] {
  return {
    textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`,
    puffFrame: { x: 372, y: 1956, width: 10, height: 10 },
    particleIntervalMilliseconds: 500,
    lifetimeSeconds: 4.6875,
    firstPlumeCount: 13,
    initialOpacity: 0.75,
    opacityDecreasePerTick: 0.001 + 0.5 / 300,
    tintColor: "#00ff00",
    offsetX: 10.4,
    offsetY: -5.25,
    zIndexOffset: 0.001,
  };
}

function createCrabPotDescriptor(): AnimationCatalog["crabPot"] {
  return {
    textureLocalPath: `${localAssetRoot}/tilesheets/animations.png`,
    frames: createHorizontalFrames(0, 0, 64, 64, 8, 150),
  };
}

function createHorizontalFrames(
  x: number,
  y: number,
  width: number,
  height: number,
  frameCount: number,
  durationMilliseconds: number,
): readonly AnimationFrameDescriptor[] {
  return Array.from({ length: frameCount }, (_, frameIndex) => ({
    x: x + frameIndex * width,
    y,
    width,
    height,
    durationMilliseconds,
  }));
}

function createFarmAnimalDefinitions(rawFarmAnimals: unknown): Readonly<Record<string, AnimationFarmAnimalDefinition>> {
  const farmAnimalRecords = readJsonRecord(rawFarmAnimals, animationDatasetUrls.farmAnimals);
  return Object.fromEntries(Object.entries(farmAnimalRecords).map(([animalId, rawAnimal]) => {
    const animalRecord = readJsonRecord(rawAnimal, `${animationDatasetUrls.farmAnimals}#${animalId}`);
    const animalTexture = readRequiredString(animalRecord.Texture, `${animalId}.Texture`);
    return [animalId, {
      id: animalId,
      label: animalId,
      house: readRequiredString(animalRecord.House, `${animalId}.House`),
      requiredBuilding: readNullableString(animalRecord.RequiredBuilding, `${animalId}.RequiredBuilding`),
      textureLocalPath: toLocalTexturePath(animalTexture),
      spriteWidth: readPositiveInteger(animalRecord.SpriteWidth, `${animalId}.SpriteWidth`),
      spriteHeight: readPositiveInteger(animalRecord.SpriteHeight, `${animalId}.SpriteHeight`),
      sleepFrame: readNonNegativeInteger(animalRecord.SleepFrame, `${animalId}.SleepFrame`),
      canSwim: readBoolean(animalRecord.CanSwim, `${animalId}.CanSwim`),
      useFlippedRightForLeft: readBoolean(animalRecord.UseFlippedRightForLeft, `${animalId}.UseFlippedRightForLeft`),
      useDoubleUniqueAnimationFrames: readBoolean(animalRecord.UseDoubleUniqueAnimationFrames, `${animalId}.UseDoubleUniqueAnimationFrames`),
    } satisfies AnimationFarmAnimalDefinition];
  }));
}

function createPetDefinitions(rawPets: unknown): Readonly<Record<string, AnimationPetDefinition>> {
  const petRecords = readJsonRecord(rawPets, animationDatasetUrls.pets);
  const petDefinitions: Record<string, AnimationPetDefinition> = {};
  for (const [rawSpecies, rawPet] of Object.entries(petRecords)) {
    if (rawSpecies !== "Cat" && rawSpecies !== "Dog" && rawSpecies !== "Turtle") {
      throw new TypeError(`Pets.json species must be Cat, Dog, or Turtle; received ${JSON.stringify(rawSpecies)}.`);
    }
    const petRecord = readJsonRecord(rawPet, `${animationDatasetUrls.pets}#${rawSpecies}`);
    if (!Array.isArray(petRecord.Breeds)) {
      throw new TypeError(`Pets.json ${JSON.stringify(rawSpecies)}.Breeds must be an array; received ${describeValue(petRecord.Breeds)}.`);
    }
    const moveSpeed = readPositiveNumber(petRecord.MoveSpeed, `${rawSpecies}.MoveSpeed`);
    const walk = readPetWalkBehavior(petRecord.Behaviors, rawSpecies);
    for (const [breedIndex, rawBreed] of petRecord.Breeds.entries()) {
      const breed = readJsonRecord(rawBreed, `${rawSpecies}.Breeds[${String(breedIndex)}]`);
      const breedId = readRequiredString(breed.Id, `${rawSpecies}.Breeds[${String(breedIndex)}].Id`);
      const petId = `${rawSpecies}:${breedId}`;
      const spriteFrameCount = petSpriteFrameCountsById[petId];
      if (spriteFrameCount === undefined) {
        throw new TypeError(`Pets.json contains an unknown breed texture frame count for ${JSON.stringify(petId)}.`);
      }
      petDefinitions[petId] = {
        id: petId,
        label: `${rawSpecies} ${breedId}`,
        species: rawSpecies,
        breedId,
        textureLocalPath: toLocalTexturePath(readRequiredString(breed.Texture, `${petId}.Texture`)),
        spriteFrameWidth: 32,
        spriteFrameHeight: 32,
        spriteFrameColumns: 4,
        spriteFrameCount,
        moveSpeed,
        walk,
      };
    }
  }
  return petDefinitions;
}

function readPetWalkBehavior(rawBehaviors: unknown, petSpecies: string): AnimationPetDefinition["walk"] {
  if (!Array.isArray(rawBehaviors)) {
    throw new TypeError(`Pets.json ${JSON.stringify(petSpecies)}.Behaviors must be an array; received ${describeValue(rawBehaviors)}.`);
  }
  let walkBehaviorRecord: JsonRecord | undefined;
  for (const [behaviorIndex, rawBehavior] of rawBehaviors.entries()) {
    const behaviorRecord = readJsonRecord(rawBehavior, `${petSpecies}.Behaviors[${String(behaviorIndex)}]`);
    const behaviorId = readRequiredString(behaviorRecord.Id, `${petSpecies}.Behaviors[${String(behaviorIndex)}].Id`);
    if (behaviorId === "Walk") {
      walkBehaviorRecord = behaviorRecord;
      break;
    }
  }
  if (walkBehaviorRecord === undefined) {
    throw new Error(`Pets.json ${JSON.stringify(petSpecies)}.Behaviors does not define Walk.`);
  }
  const randomBehaviorChangeChance = readFiniteNumber(
    walkBehaviorRecord.RandomBehaviorChangeChance,
    `${petSpecies}.Walk.RandomBehaviorChangeChance`,
  );
  if (randomBehaviorChangeChance < 0 || randomBehaviorChangeChance > 1) {
    throw new RangeError(`Pets.json ${JSON.stringify(petSpecies)}.Walk.RandomBehaviorChangeChance must be between 0 and 1; received ${String(randomBehaviorChangeChance)}.`);
  }
  return {
    randomizeDirection: readBoolean(walkBehaviorRecord.RandomizeDirection, `${petSpecies}.Walk.RandomizeDirection`),
    walkInDirection: readBoolean(walkBehaviorRecord.WalkInDirection, `${petSpecies}.Walk.WalkInDirection`),
    moveSpeed: readFiniteNumber(walkBehaviorRecord.MoveSpeed, `${petSpecies}.Walk.MoveSpeed`),
    randomBehaviorChangeChance,
    frameDurationMilliseconds: 175,
    frameIndicesByDirection: petWalkFrameIndicesByDirection,
  };
}

function getPetHatSourceRect(spriteIndex: number, direction: number): AnimationSourceRect {
  const atlasRowByBodyDirection: Readonly<Record<number, number>> = {
    0: 3,
    1: 1,
    2: 0,
    3: 2,
  };
  const atlasRow = atlasRowByBodyDirection[direction];
  if (atlasRow === undefined) {
    throw new RangeError(`Pet hat atlas direction must be between 0 and 3; received ${String(direction)}.`);
  }
  const hatPixelOffset = spriteIndex * 20;
  return {
    x: hatPixelOffset % 240,
    y: Math.floor(hatPixelOffset / 240) * 80 + atlasRow * 20,
    width: 20,
    height: 20,
  };
}

function getPetHatMotion(
  petSpecies: AnimationPetDefinition["species"],
  breedId: string,
  bodyFrameIndex: number,
  flipped: boolean,
): Readonly<{ offsetX: number; offsetY: number; direction: number; scaleSize: number }> {
  let offsetX = -2;
  let offsetY = -24;
  let direction = 2;
  let scaleSize = 4 / 3;
  const flipOffset = (amount: number) => (flipped ? -1 : 1) * amount;

  if (petSpecies === "Cat") {
    switch (bodyFrameIndex) {
      case 16:
        offsetY += 20;
        direction = 2;
        break;
      case 0:
      case 2:
        offsetY += 28;
        direction = 2;
        break;
      case 1:
      case 3:
        offsetY += 32;
        direction = 2;
        break;
      case 4:
      case 6:
        direction = 1;
        offsetX += 23;
        offsetY += 20;
        break;
      case 5:
      case 7:
        offsetY += 4;
        direction = 1;
        offsetX += 23;
        offsetY += 20;
        break;
      case 30:
      case 31:
        direction = flipped ? 3 : 1;
        offsetX += flipOffset(25);
        offsetY += 32;
        break;
      case 8:
      case 10:
        direction = 0;
        offsetY -= 4;
        break;
      case 9:
      case 11:
        direction = 0;
        break;
      case 12:
      case 14:
        direction = 3;
        offsetX -= 22;
        offsetY += 20;
        break;
      case 13:
      case 15:
        offsetY += 20;
        offsetY += 4;
        direction = 3;
        offsetX -= 22;
        break;
      case 21:
      case 23:
        offsetY += 16;
        break;
      case 17:
      case 20:
      case 22:
        offsetY += 12;
        break;
      case 18:
      case 19:
        offsetY += 8;
        break;
      case 24:
        direction = flipped ? 3 : 1;
        offsetX += flipOffset(29);
        offsetY += 28;
        break;
      case 25:
        direction = flipped ? 3 : 1;
        offsetX += flipOffset(29);
        offsetY += 36;
        break;
      case 26:
        direction = flipped ? 3 : 1;
        offsetX += flipOffset(29);
        offsetY += 40;
        break;
      case 27:
        direction = flipped ? 3 : 1;
        offsetX += flipOffset(29);
        offsetY += 44;
        break;
      case 28:
      case 29:
        scaleSize = 1.2;
        offsetY += 46;
        offsetX -= (flipped ? 0 : -1) * 4;
        offsetX += flipOffset(2);
        direction = flipped ? 1 : 3;
        break;
    }
    if ((breedId === "3" || breedId === "4") && direction === 3) {
      offsetX -= 4;
    }
  } else if (petSpecies === "Dog") {
    offsetY -= 20;
    switch (bodyFrameIndex) {
      case 16:
        offsetY += 20;
        direction = 2;
        break;
      case 0:
      case 2:
        offsetY += 28;
        direction = 2;
        break;
      case 1:
      case 3:
        offsetY += 32;
        direction = 2;
        break;
      case 4:
      case 6:
        direction = 1;
        offsetX += 26;
        offsetY += 24;
        break;
      case 5:
      case 7:
        direction = 1;
        offsetX += 26;
        offsetY += 28;
        break;
      case 30:
      case 31:
        direction = flipped ? 3 : 1;
        offsetX += 18;
        offsetY += 8;
        break;
      case 8:
      case 10:
        direction = 0;
        offsetY += 4;
        break;
      case 9:
      case 11:
        direction = 0;
        offsetY += 8;
        break;
      case 12:
      case 14:
        direction = 3;
        offsetX -= 26;
        offsetY += 24;
        break;
      case 13:
      case 15:
        offsetY += 24;
        offsetY += 4;
        direction = 3;
        offsetX -= 26;
        break;
      case 23:
        direction = flipped ? 3 : 1;
        offsetX += 18;
        offsetY += 8;
        break;
      case 20:
        direction = flipped ? 3 : 1;
        offsetX += 26;
        offsetY += breedId === "2" ? 16 : breedId === "1" ? 24 : 20;
        break;
      case 21:
        direction = flipped ? 3 : 1;
        offsetX += 22;
        offsetY += breedId === "2" ? 12 : breedId === "1" ? 20 : 16;
        break;
      case 22:
        direction = flipped ? 3 : 1;
        offsetX += 18;
        offsetY += breedId === "2" || breedId === "1" ? 8 : 12;
        break;
      case 17:
        offsetY += 12;
        break;
      case 18:
      case 19:
        offsetY += 8;
        break;
      case 24:
      case 25:
        direction = flipped ? 3 : 1;
        offsetX += 18;
        offsetY += 8;
        break;
      case 26:
        direction = flipped ? 3 : 1;
        offsetX += 18;
        offsetY -= 8;
        break;
      case 27:
        direction = 2;
        offsetY += 12 + (breedId === "2" ? -4 : 0);
        break;
      case 28:
      case 29:
        scaleSize = 4 / 3;
        offsetY += 48;
        offsetX += (flipped ? 6 : 5) * 4;
        offsetX += 2;
        direction = 2;
        break;
      case 32:
        direction = flipped ? 3 : 1;
        offsetX += 26;
        offsetY += breedId === "2" ? 12 : 16;
        break;
      case 33:
        direction = flipped ? 3 : 1;
        offsetX += 26;
        offsetY += breedId === "2" ? 16 : 20;
        break;
      case 34:
        direction = flipped ? 3 : 1;
        offsetX += 26;
        offsetY += breedId === "2" ? 20 : 24;
        break;
    }
    if (breedId === "2") {
      if (direction === 1) {
        offsetX -= 4;
      }
      offsetY += 8;
    } else if (breedId === "3" && direction === 3 && bodyFrameIndex > 16) {
      offsetX += 4;
    }
    if (flipped) {
      offsetX *= -1;
    }
  }

  if (flipped) {
    offsetX -= 4;
  }
  return { offsetX: offsetX + 30, offsetY: offsetY - 42, direction, scaleSize };
}

function getStableHorseHatMotion(
  horseFrameIndex: number,
  hatId: string,
): Readonly<{ offsetX: number; offsetY: number; direction: number; scaleSize: number }> | null {
  const hatScaleSize = 4 / 3;
  let baseMotion: Readonly<{ offsetX: number; offsetY: number; direction: number; scaleSize: number }>;
  if (horseFrameIndex >= 0 && horseFrameIndex <= 6) {
    baseMotion = { offsetX: 30, offsetY: -42, direction: 2, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 7 || horseFrameIndex === 11) {
    baseMotion = { offsetX: -14, offsetY: -74, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 8) {
    baseMotion = { offsetX: -18, offsetY: -74, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 9) {
    baseMotion = { offsetX: -18, offsetY: -70, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 10) {
    baseMotion = { offsetX: -14, offsetY: -70, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 12) {
    baseMotion = { offsetX: -14, offsetY: -78, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 13) {
    baseMotion = { offsetX: -18, offsetY: -78, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 21) {
    baseMotion = { offsetX: -14, offsetY: -66, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 22) {
    baseMotion = { offsetX: -18, offsetY: -54, direction: 3, scaleSize: hatScaleSize };
  } else if (horseFrameIndex === 23 || horseFrameIndex === 24) {
    baseMotion = { offsetX: -18, offsetY: -42, direction: 3, scaleSize: hatScaleSize };
  } else if ((horseFrameIndex >= 14 && horseFrameIndex <= 20) || horseFrameIndex === 25) {
    baseMotion = { offsetX: 28, offsetY: -106, direction: 0, scaleSize: hatScaleSize };
  } else {
    return null;
  }
  const hatOffset = getStableHorseHatOffset(hatId, baseMotion.direction);
  if (hatOffset === null) {
    return null;
  }
  return {
    ...baseMotion,
    offsetX: baseMotion.offsetX + hatOffset.x,
    offsetY: baseMotion.offsetY + hatOffset.y,
  };
}

function getStableHorseHatOffset(
  hatId: string,
  direction: number,
): Readonly<{ x: number; y: number }> | null {
  let horizontalOffset = 0;
  let verticalOffset = 0;
  const addHorizontalOffsetForSideView = (offset: number) => {
    if (direction === 3 || direction === 1) {
      horizontalOffset += offset;
    }
  };
  if (hatId.length === 2) {
    const finalDigit = hatId[1];
    if (finalDigit === "4") {
      if (hatId === "14" && direction === 0) return null;
    } else if (finalDigit === "0") {
      if (hatId === "10") {
        verticalOffset += 3;
        if (direction === 0) return null;
      }
    } else if (finalDigit === "2") {
      if (hatId === "32" && (direction === 0 || direction === 2)) {
        verticalOffset += 1;
      }
    } else if (finalDigit === "1") {
      if (hatId === "31") {
        verticalOffset += 1;
      } else if (hatId === "11") {
        addHorizontalOffsetForSideView(2);
      }
    } else if (finalDigit === "9") {
      if (hatId === "39") {
        addHorizontalOffsetForSideView(2);
      }
    } else if (finalDigit === "6") {
      if (hatId === "26") {
        addHorizontalOffsetForSideView(1);
      } else if (hatId === "56" && direction === 0) {
        return null;
      }
    } else if (finalDigit === "7" && hatId === "67" && direction === 0) {
      return null;
    }
  } else if (hatId.length === 1) {
    if (hatId === "6") {
      verticalOffset += 2;
      if (direction === 2) {
        verticalOffset -= 1;
      }
    } else if (hatId === "9" && (direction === 0 || direction === 2)) {
      verticalOffset += 1;
    }
  }
  return { x: horizontalOffset * 4, y: verticalOffset * 4 };
}

function createPondFishDefinitions(
  rawFishPondData: unknown,
  objectRecords: JsonRecord,
): Readonly<Record<string, AnimationFishPondDefinition>> {
  if (!Array.isArray(rawFishPondData)) {
    throw new TypeError(`FishPondData.json must be an array; received ${describeValue(rawFishPondData)}.`);
  }
  const fishPondRules = rawFishPondData.map((rawRule, ruleIndex) =>
    readFishPondRule(rawRule, ruleIndex),
  );
  const pondFishById: Record<string, AnimationFishPondDefinition> = {};
  for (const [fishId, rawObjectRecord] of Object.entries(objectRecords)) {
    const objectRecord = readJsonRecord(rawObjectRecord, `Objects.json[${JSON.stringify(fishId)}]`);
    if (!isFishPondObjectCandidate(fishId, objectRecord)) {
      continue;
    }
    const fishTags = createFishPondObjectTags(fishId, objectRecord);
    const matchedRule = findFishPondRule(fishTags, fishPondRules);
    if (matchedRule === undefined) {
      continue;
    }
    const fishSprite = createProductAnimationChoice(fishId, objectRecords);
    if (fishSprite.catalogItemId === undefined || fishSprite.textureLocalPath === undefined || fishSprite.sourceRect === undefined) {
      throw new Error(`Fish Pond object ${JSON.stringify(fishId)} is missing its catalog ID, texture path, or sprite rectangle.`);
    }
    const rawMaximumPopulation = matchedRule.maxPopulation;
    pondFishById[fishId] = {
      id: fishId,
      label: fishSprite.label,
      catalogItemId: fishSprite.catalogItemId,
      textureLocalPath: fishSprite.textureLocalPath,
      sourceRect: fishSprite.sourceRect,
      maxPopulation: rawMaximumPopulation > 0 ? rawMaximumPopulation : 10,
      spriteIndex: fishSprite.spriteIndex,
      produce: createFishPondProduceChoices(matchedRule, fishId, objectRecords),
    };
  }
  return pondFishById;
}

type AnimationFishPondRule = Readonly<{
  requiredTags: readonly string[];
  precedence: number;
  maxPopulation: number;
  producedItems: readonly JsonRecord[];
}>;

function readFishPondRule(rawRule: unknown, ruleIndex: number): AnimationFishPondRule {
  const sourceLabel = `FishPondData.json[${String(ruleIndex)}]`;
  const ruleRecord = readJsonRecord(rawRule, sourceLabel);
  const rawRequiredTags = ruleRecord.RequiredTags;
  if (!Array.isArray(rawRequiredTags)) {
    throw new TypeError(`${sourceLabel}.RequiredTags must be an array; received ${describeValue(rawRequiredTags)}.`);
  }
  const requiredTags = rawRequiredTags.map((rawRequiredTag, tagIndex) =>
    readRequiredString(rawRequiredTag, `${sourceLabel}.RequiredTags[${String(tagIndex)}]`),
  );
  const rawProducedItems = ruleRecord.ProducedItems;
  if (!Array.isArray(rawProducedItems)) {
    throw new TypeError(`${sourceLabel}.ProducedItems must be an array; received ${describeValue(rawProducedItems)}.`);
  }
  return {
    requiredTags,
    precedence: ruleRecord.Precedence === undefined || ruleRecord.Precedence === null
      ? 0
      : readInteger(ruleRecord.Precedence, `${sourceLabel}.Precedence`),
    maxPopulation: ruleRecord.MaxPopulation === undefined || ruleRecord.MaxPopulation === null
      ? -1
      : readInteger(ruleRecord.MaxPopulation, `${sourceLabel}.MaxPopulation`),
    producedItems: rawProducedItems.map((rawProducedItem, itemIndex) =>
      readJsonRecord(rawProducedItem, `${sourceLabel}.ProducedItems[${String(itemIndex)}]`),
    ),
  };
}

function isFishPondObjectCandidate(fishId: string, objectRecord: JsonRecord): boolean {
  return objectRecord.Category === -4 || fishPondSpecialObjectIds.has(fishId);
}

const fishPondSpecialObjectIds = new Set(["393", "397"]);

function createFishPondObjectTags(fishId: string, objectRecord: JsonRecord): ReadonlySet<string> {
  const rawContextTags = objectRecord.ContextTags;
  if (rawContextTags !== null && rawContextTags !== undefined && !Array.isArray(rawContextTags)) {
    throw new TypeError(`Objects.json ${JSON.stringify(fishId)}.ContextTags must be an array or null; received ${describeValue(rawContextTags)}.`);
  }
  const fishTags = new Set<string>();
  for (const [tagIndex, rawTag] of (rawContextTags ?? []).entries()) {
    fishTags.add(readRequiredString(rawTag, `Objects.json ${JSON.stringify(fishId)}.ContextTags[${String(tagIndex)}]`).trim().toLowerCase());
  }
  const objectName = normalizeFishPondTagName(readRequiredString(objectRecord.Name, `Objects.json ${JSON.stringify(fishId)}.Name`));
  const objectType = normalizeFishPondTagName(readRequiredString(objectRecord.Type, `Objects.json ${JSON.stringify(fishId)}.Type`));
  const normalizedFishId = fishId.toLowerCase();
  fishTags.add(`id_(o)_${normalizedFishId}`);
  fishTags.add(`id_o_${normalizedFishId}`);
  fishTags.add(`item_${objectName}`);
  fishTags.add(`item_type_${objectType}`);
  if (objectRecord.Category === -4) {
    fishTags.add("category_fish");
  }
  return fishTags;
}

function normalizeFishPondTagName(tagName: string): string {
  return tagName.trim().toLowerCase().replaceAll(" ", "_").replaceAll("'", "");
}

function findFishPondRule(
  fishTags: ReadonlySet<string>,
  fishPondRules: readonly AnimationFishPondRule[],
): AnimationFishPondRule | undefined {
  if (fishTags.has("fish_pond_ignore")) {
    return undefined;
  }
  let matchedRule: AnimationFishPondRule | undefined;
  for (const candidateRule of fishPondRules) {
    if (candidateRule.requiredTags.length === 0) {
      continue;
    }
    if (matchedRule !== undefined && matchedRule.precedence <= candidateRule.precedence) {
      continue;
    }
    if (candidateRule.requiredTags.every((requiredTag) => doesFishPondTagMatch(requiredTag, fishTags))) {
      matchedRule = candidateRule;
    }
  }
  return matchedRule;
}

function doesFishPondTagMatch(requiredTag: string, fishTags: ReadonlySet<string>): boolean {
  const normalizedTag = requiredTag.trim().toLowerCase();
  return normalizedTag.startsWith("!")
    ? !fishTags.has(normalizedTag.slice(1))
    : fishTags.has(normalizedTag);
}

function createFishPondProduceChoices(
  matchedRule: AnimationFishPondRule,
  fishId: string,
  objectRecords: JsonRecord,
): AnimationFishPondDefinition["produce"] {
  const produceById = new Map<string, AnimationFishPondDefinition["produce"][number]>();
  for (const [produceIndex, produceRecord] of matchedRule.producedItems.entries()) {
    const rawProductId = produceRecord.ItemId;
    if (typeof rawProductId !== "string" || rawProductId.length === 0) {
      throw new TypeError(`FishPondData ${JSON.stringify(fishId)}.ProducedItems[${String(produceIndex)}].ItemId must be a non-empty string; received ${describeValue(rawProductId)}.`);
    }
    if (!fishPondConditionMatches(produceRecord.Condition, fishId)) {
      continue;
    }
    const productId = rawProductId.replace(/^\([A-Z]+\)/, "");
    const productChoice = createProductAnimationChoice(productId, objectRecords);
    const requiredPopulation = produceRecord.RequiredPopulation === undefined || produceRecord.RequiredPopulation === null
      ? 0
      : readNonNegativeInteger(produceRecord.RequiredPopulation, `FishPondData ${JSON.stringify(fishId)}.ProducedItems[${String(produceIndex)}].RequiredPopulation`);
    const rawMaximumStackSize = produceRecord.MaxStack;
    const maximumStackSize = typeof rawMaximumStackSize === "number" && rawMaximumStackSize > 0
      ? readPositiveInteger(rawMaximumStackSize, `FishPondData ${JSON.stringify(fishId)}.ProducedItems[${String(produceIndex)}].MaxStack`)
      : 1;
    const existingProduceChoice = produceById.get(productId);
    if (existingProduceChoice === undefined || requiredPopulation < existingProduceChoice.requiredPopulation) {
      produceById.set(productId, {
        ...productChoice,
        requiredPopulation,
        maximumStackSize,
      });
    }
  }
  return [...produceById.values()];
}

function fishPondConditionMatches(rawCondition: unknown, fishId: string): boolean {
  if (rawCondition === null || rawCondition === undefined) {
    return true;
  }
  if (typeof rawCondition !== "string") {
    throw new TypeError(`FishPondData ProducedItems.Condition for fish ${JSON.stringify(fishId)} must be a string or null; received ${describeValue(rawCondition)}.`);
  }
  return !rawCondition.includes("ITEM_ID") || rawCondition.includes(`(O)${fishId}`);
}

function createAquariumFishDefinitions(
  rawAquariumFish: unknown,
  fishRecords: JsonRecord,
  objectRecords: JsonRecord,
): Readonly<Record<string, AnimationAquariumFishDefinition>> {
  const aquariumFishRecords = readJsonRecord(rawAquariumFish, animationDatasetUrls.aquariumFish);
  return Object.fromEntries(Object.entries(aquariumFishRecords).map(([fishId, rawAnimation]) => {
    const sourceFields = readRequiredString(rawAnimation, `${fishId} aquarium animation`).split("/");
    const spriteIndex = readNonNegativeInteger(Number(sourceFields[0]), `AquariumFish.json ${JSON.stringify(fishId)} sprite index`);
    const type = readAquariumFishType(sourceFields[1], fishId, rawAnimation);
    const idleAnimation = readOptionalAnimationFrameIndices(sourceFields[2], `AquariumFish.json ${JSON.stringify(fishId)} idleAnimation`);
    return [fishId, {
      id: fishId,
      label: readObjectLabel(objectRecords, fishId),
      spriteIndex,
      type,
      simType: getAquariumFishSimulationType(type),
      frontCrawl: type === "front_crawl",
      idleFrame: idleAnimation?.[0] ?? spriteIndex,
      idleAnimation,
      dartStart: readOptionalAnimationFrameIndices(sourceFields[3], `AquariumFish.json ${JSON.stringify(fishId)} dartStart`),
      dartHold: readOptionalAnimationFrameIndices(sourceFields[4], `AquariumFish.json ${JSON.stringify(fishId)} dartHold`),
      dartEnd: readOptionalAnimationFrameIndices(sourceFields[5], `AquariumFish.json ${JSON.stringify(fishId)} dartEnd`),
      fishBehavior: readAquariumFishBehavior(fishRecords[fishId], fishId),
      catalogItemId: `object:${fishId}`,
      textureLocalPath: `${localAssetRoot}/sprites/AquariumFish.png`,
    } satisfies AnimationAquariumFishDefinition];
  }));
}

function createAquariumFishAtlasDescriptor(): AnimationCatalog["aquariumFishAtlas"] {
  return {
    textureLocalPath: `${localAssetRoot}/sprites/AquariumFish.png`,
    textureWidth: 480,
    textureHeight: 304,
    frameWidth: 24,
    frameHeight: 24,
    columns: 20,
    rowStride: 48,
    scaleFactor: 0.75,
    segmentWidthBySimulationType: {
      normal: 8,
      float: 24,
      eel: 4,
      cephalopod: 24,
      static: 24,
      ground: 24,
      crawl: 24,
    },
  };
}

function getAquariumFishSimulationType(
  fishType: AnimationAquariumFishDefinition["type"],
): AnimationAquariumFishDefinition["simType"] {
  if (fishType === "fish") {
    return "normal";
  }
  if (fishType === "front_crawl" || fishType === "crawl") {
    return "crawl";
  }
  return fishType;
}

function readAquariumFishType(
  rawType: string | undefined,
  fishId: string,
  rawAnimation: unknown,
): AnimationAquariumFishDefinition["type"] {
  const aquariumFishTypes = ["float", "fish", "eel", "cephalopod", "static", "ground", "crawl", "front_crawl"] as const;
  if (rawType === undefined || !aquariumFishTypes.includes(rawType as (typeof aquariumFishTypes)[number])) {
    throw new TypeError(`AquariumFish.json ${JSON.stringify(fishId)} must use a supported fish type; received ${JSON.stringify(rawAnimation)}.`);
  }
  return rawType as AnimationAquariumFishDefinition["type"];
}

function readOptionalAnimationFrameIndices(
  rawSequence: string | undefined,
  sourceLabel: string,
): readonly number[] | null {
  if (rawSequence === undefined || rawSequence.trim().length === 0) {
    return null;
  }
  return rawSequence.trim().split(/\s+/).map((rawFrameIndex) =>
    readNonNegativeInteger(Number(rawFrameIndex), `${sourceLabel} frame index`),
  );
}

function readAquariumFishBehavior(
  rawFishDefinition: unknown,
  fishId: string,
): AnimationAquariumFishDefinition["fishBehavior"] {
  if (rawFishDefinition === undefined) {
    return null;
  }
  const fishFields = readRequiredString(rawFishDefinition, `Fish.json ${JSON.stringify(fishId)}`).split("/");
  if (fishFields.length < 3) {
    throw new TypeError(`Fish.json ${JSON.stringify(fishId)} must contain at least three slash-delimited fields; received ${JSON.stringify(rawFishDefinition)}.`);
  }
  if (fishFields[1] === "trap") {
    return null;
  }
  if (fishFields[2] === "smooth") {
    return "smooth";
  }
  if (fishFields[2] === "dart") {
    return "dart";
  }
  return "normal";
}

function createClothingDefinitions(
  rawHats: unknown,
  rawShirts: unknown,
  rawPants: unknown,
): Readonly<Record<string, AnimationClothingDefinition>> {
  const clothingById: Record<string, AnimationClothingDefinition> = {};
  const hatRecords = readJsonRecord(rawHats, animationDatasetUrls.hats);
  for (const [hatId, rawHat] of Object.entries(hatRecords)) {
    const hatFields = readRequiredString(rawHat, `hats.json[${JSON.stringify(hatId)}]`).split("/");
    const spriteIndexText = hatFields.at(-1);
    const rawSpriteIndex = /^\d+$/.test(hatId)
      ? Number(hatId)
      : spriteIndexText !== undefined && /^\d+$/.test(spriteIndexText)
        ? Number(spriteIndexText)
        : undefined;
    if (rawSpriteIndex === undefined) {
      throw new TypeError(`hats.json ${JSON.stringify(hatId)} must include a numeric source sprite index; received ${JSON.stringify(rawHat)}.`);
    }
    const spriteIndex = readNonNegativeInteger(rawSpriteIndex, `hats.json ${hatId} sprite index`);
    const isPrismatic = hatFields[4] === "Prismatic";
    clothingById[`hat:${hatId}`] = {
      id: hatId,
      label: readRequiredString(hatFields[0], `hats.json ${hatId} label`),
      category: "hat",
      spriteIndex,
      isPrismatic,
      catalogItemId: `hat:${hatId}`,
      textureLocalPath: `${localAssetRoot}/tilesheets/hats.png`,
    };
  }
  addClothingRecords(clothingById, rawShirts, "shirt", animationDatasetUrls.shirts);
  addClothingRecords(clothingById, rawPants, "pants", animationDatasetUrls.pants);
  return clothingById;
}

function createMannequinDefinitions(): Readonly<Record<string, AnimationMannequinDefinition>> {
  return {
    furniture_mannequin_male: {
      textureLocalPath: `${localAssetRoot}/farmer/farmer_base_mannequin.png`,
      isMale: true,
      cursed: false,
    },
    furniture_mannequin_female: {
      textureLocalPath: `${localAssetRoot}/farmer/farmer_girl_mannequin.png`,
      isMale: false,
      cursed: false,
    },
    furniture_mannequin_cursed_male: {
      textureLocalPath: `${localAssetRoot}/farmer/farmer_base_mannequin_cursed.png`,
      isMale: true,
      cursed: true,
    },
    furniture_mannequin_cursed_female: {
      textureLocalPath: `${localAssetRoot}/farmer/farmer_girl_mannequin_cursed.png`,
      isMale: false,
      cursed: true,
    },
  };
}

function addClothingRecords(
  clothingById: Record<string, AnimationClothingDefinition>,
  rawClothing: unknown,
  category: "shirt" | "pants",
  datasetUrl: string,
): void {
  const clothingRecords = readJsonRecord(rawClothing, datasetUrl);
  for (const [clothingId, rawClothingRecord] of Object.entries(clothingRecords)) {
    const clothingRecord = readJsonRecord(rawClothingRecord, `${datasetUrl}#${clothingId}`);
    const spriteIndex = readNonNegativeInteger(clothingRecord.SpriteIndex, `${clothingId}.SpriteIndex`);
    const label = readRequiredString(clothingRecord.Name, `${clothingId}.Name`);
    const isPrismatic = readBoolean(clothingRecord.IsPrismatic, `${clothingId}.IsPrismatic`);
    const canBeDyed = readBoolean(clothingRecord.CanBeDyed, `${datasetUrl} ${JSON.stringify(clothingId)}.CanBeDyed`);
    const defaultColor = readNullableRgbColor(
      clothingRecord.DefaultColor,
      `${datasetUrl} ${JSON.stringify(clothingId)}.DefaultColor`,
    );
    clothingById[`${category}:${clothingId}`] = {
      id: clothingId,
      label,
      category,
      spriteIndex,
      isPrismatic,
      canBeDyed,
      defaultColor,
      catalogItemId: `${category}:${clothingId}`,
      textureLocalPath: `${localAssetRoot}/farmer/${category === "shirt" ? "shirts" : "pants"}.png`,
      ...(category === "shirt"
        ? {
            dyeTextureLocalPath: `${localAssetRoot}/farmer/shirts.png`,
            hasSleeves: readBoolean(clothingRecord.HasSleeves, `${datasetUrl} ${JSON.stringify(clothingId)}.HasSleeves`),
          }
        : {}),
    };
  }
}

function readNullableRgbColor(rawColor: unknown, sourceLabel: string): number | null {
  if (rawColor === null || rawColor === "" || rawColor === "None" || rawColor === "White") {
    return null;
  }
  const colorText = readRequiredString(rawColor, sourceLabel);
  const colorChannels = colorText.trim().split(/\s+/).map(Number);
  if (colorChannels.length !== 3 || colorChannels.some((colorChannel) => !Number.isFinite(colorChannel))) {
    throw new TypeError(`${sourceLabel} must be null, a source null color, or three finite RGB channels; received ${JSON.stringify(rawColor)}.`);
  }
  const [rawRed, rawGreen, rawBlue] = colorChannels;
  if (rawRed === undefined || rawGreen === undefined || rawBlue === undefined) {
    throw new TypeError(`${sourceLabel} must contain three finite RGB channels; received ${JSON.stringify(rawColor)}.`);
  }
  const red = Math.min(255, Math.max(0, Math.round(rawRed)));
  const green = Math.min(255, Math.max(0, Math.round(rawGreen)));
  const blue = Math.min(255, Math.max(0, Math.round(rawBlue)));
  return (red << 16) | (green << 8) | blue;
}

function createMachineStateDefinitions(rawBigCraftables: unknown): AnimationCatalog["machineStatesById"] {
  const bigCraftableRecords = readJsonRecord(rawBigCraftables, animationDatasetUrls.bigCraftables);
  const machineStatesById: Record<string, { choices: readonly AnimationChoice[]; workingStateId?: string }> = {};
  for (const [rawMachineId, stateIds] of Object.entries(machineSpriteStatesByRawId)) {
    const rawMachine = bigCraftableRecords[rawMachineId];
    if (rawMachine === undefined) {
      throw new Error(`BigCraftables.json is missing animation machine ID ${JSON.stringify(rawMachineId)}.`);
    }
    const machineRecord = readJsonRecord(rawMachine, `BigCraftables.json[${rawMachineId}]`);
    readRequiredString(machineRecord.Name, `BigCraftables.json[${rawMachineId}].Name`);
    const catalogItemId = `big-craftable:${rawMachineId}`;
    machineStatesById[catalogItemId] = {
      choices: stateIds.map((id) => {
        const frameOffset = machineStateFrameOffsetsByRawId[rawMachineId]?.[id];
        return {
          id,
          label: id,
          ...(frameOffset === undefined ? {} : { frameOffset }),
        };
      }),
      ...(stateIds.includes("working") ? { workingStateId: "working" } : {}),
    };
  }
  return machineStatesById;
}

function createMachineOutputDefinitions(
  objectRecords: JsonRecord,
  machineOutputIds: Readonly<Record<string, readonly string[]>>,
): AnimationCatalog["machineOutputsById"] {
  return Object.fromEntries(Object.entries(machineOutputIds).map(([rawMachineId, outputIds]) => {
    const catalogItemId = getMachineCatalogItemId(rawMachineId);
    const outputChoices = outputIds.map((productId) => createProductAnimationChoice(productId, objectRecords));
    return [catalogItemId, outputChoices];
  }));
}

function createProductAnimationChoice(
  productId: string,
  objectRecords: JsonRecord,
): AnimationChoice {
  const objectRecordValue = objectRecords[productId];
  if (objectRecordValue === undefined) {
    const lockedTrinket = anvilTrinketProductsById[productId];
    if (lockedTrinket === undefined) {
      throw new Error(`Objects.json and source-locked Anvil products are missing output ID ${JSON.stringify(productId)}.`);
    }
    return {
      id: productId,
      label: lockedTrinket.label,
      spriteIndex: lockedTrinket.spriteIndex,
      textureLocalPath: `${localAssetRoot}/tilesheets/Objects_2.png`,
      sourceRect: createObjectProductSourceRect(lockedTrinket.spriteIndex, 128),
    };
  }

  const objectRecord = readJsonRecord(objectRecordValue, `Objects.json[${JSON.stringify(productId)}]`);
  const textureLocalPath = readProductTextureLocalPath(objectRecord.Texture, productId);
  const textureWidth = textureLocalPath.endsWith("/Objects_2.png") ? 128 : 384;
  const spriteIndex = readNonNegativeInteger(objectRecord.SpriteIndex, `Objects.json ${JSON.stringify(productId)}.SpriteIndex`);
  const colorOverlay = readBoolean(objectRecord.ColorOverlayFromNextIndex, `Objects.json ${JSON.stringify(productId)}.ColorOverlayFromNextIndex`);
  const dyeColor = readProductDyeColor(objectRecord.ContextTags, productId);

  return {
    id: productId,
    label: readRequiredString(objectRecord.Name, `Objects.json ${JSON.stringify(productId)}.Name`),
    catalogItemId: `object:${productId}`,
    spriteIndex,
    textureLocalPath,
    sourceRect: createObjectProductSourceRect(spriteIndex, textureWidth),
    colorOverlay,
    ...(colorOverlay ? { overlaySourceRect: createObjectProductSourceRect(spriteIndex + 1, textureWidth) } : {}),
    ...(dyeColor === undefined ? {} : { dyeColor }),
  };
}

function readProductTextureLocalPath(rawTexture: unknown, productId: string): string {
  if (rawTexture === null) {
    return `${localAssetRoot}/tilesheets/springobjects.png`;
  }
  if (rawTexture === "TileSheets\\Objects_2") {
    return `${localAssetRoot}/tilesheets/Objects_2.png`;
  }
  throw new TypeError(`Objects.json ${JSON.stringify(productId)}.Texture must be null or "TileSheets\\Objects_2"; received ${describeValue(rawTexture)}.`);
}

function createObjectProductSourceRect(spriteIndex: number, textureWidth: number): AnimationSourceRect {
  return {
    x: (spriteIndex * 16) % textureWidth,
    y: Math.floor((spriteIndex * 16) / textureWidth) * 16,
    width: 16,
    height: 16,
  };
}

function readProductDyeColor(rawContextTags: unknown, productId: string): number | undefined {
  if (rawContextTags === null || rawContextTags === undefined) {
    return undefined;
  }
  if (!Array.isArray(rawContextTags)) {
    throw new TypeError(`Objects.json ${JSON.stringify(productId)}.ContextTags must be an array or null; received ${describeValue(rawContextTags)}.`);
  }
  for (const [tagIndex, rawContextTag] of rawContextTags.entries()) {
    const contextTag = readRequiredString(rawContextTag, `Objects.json ${JSON.stringify(productId)}.ContextTags[${String(tagIndex)}]`).trim().toLowerCase();
    const dyeColor = productDyeColorsByContextTag[contextTag];
    if (dyeColor !== undefined) {
      return dyeColor;
    }
  }
  return undefined;
}

function createBuildingAnimationDefinitions(
  buildingRecords: JsonRecord,
  objectRecords: JsonRecord,
): Readonly<Record<string, AnimationBuildingDefinition>> {
  const definitions: Record<string, AnimationBuildingDefinition> = {};
  const millRecord = readJsonRecord(buildingRecords.Mill, `${animationDatasetUrls.buildings}#Mill`);
  const millLayers = millRecord.DrawLayers;
  if (!Array.isArray(millLayers)) {
    throw new TypeError(`Buildings.json Mill.DrawLayers must be an array; received ${describeValue(millLayers)}.`);
  }
  definitions["building:Mill"] = {
    kind: "mill",
    textureLocalPath: `${localAssetRoot}/buildings/Mill.png`,
    layers: millLayers.map((rawLayer, layerIndex) => readMillDrawLayer(rawLayer, layerIndex)),
    outputChoices: millOutputProductIds.map((productId) => createProductAnimationChoice(productId, objectRecords)),
    defaultOutputProductId: "246",
    chestBubble: readMillOutputChestBubble(millRecord),
  };
  const chimneyPositionsByBuildingId = createChimneyPositions(buildingRecords);
  for (const buildingId of chimneyBuildingIds) {
    const chimneyPosition = chimneyPositionsByBuildingId[buildingId];
    if (chimneyPosition === undefined) {
      throw new Error(`Buildings.json does not define chimney position for ${JSON.stringify(buildingId)}.`);
    }
    definitions[`building:${buildingId}`] = {
      kind: "chimney-smoke",
      textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`,
      puffFrame: { x: 372, y: 1956, width: 10, height: 10 },
      chimneyPosition,
      particleIntervalMilliseconds: 500,
      lifetimeSeconds: 6.25,
      tintColor: "#808080",
    };
  }
  definitions["building:Fish Pond"] = { kind: "fish-pond" };
  definitions["building:Stable"] = {
    kind: "stable-horse",
    textureLocalPath: `${localAssetRoot}/animals/horse.png`,
    frameWidth: 32,
    frameHeight: 32,
    columns: 7,
    frameCount: 28,
    idleFrameIndex: 7,
    walkingFrameIndices: [21, 22, 23, 24, 23, 24, 23, 24, 23, 22, 21],
    walkingFrameDurationsMilliseconds: [100, 100, 100, 400, 400, 400, 400, 400, 400, 100, 100],
  };
  definitions["building:Junimo Hut"] = {
    kind: "junimo-hut",
    textureLocalPath: `${localAssetRoot}/sprites/Junimo.png`,
    shadowTextureLocalPath: `${localAssetRoot}/sprites/shadow.png`,
    frameWidth: 16,
    frameHeight: 16,
    columns: 8,
    frameCount: 64,
  };
  definitions["building:Gold Clock"] = { kind: "gold-clock" };
  for (const buildingId of ["Pet Bowl", "Stone Pet Bowl", "Hay Pet Bowl"]) {
    definitions[`building:${buildingId}`] = { kind: "pet-bowl" };
  }
  return definitions;
}

function createChimneyPositions(
  buildingRecords: JsonRecord,
): Readonly<Record<string, Readonly<{ x: number; y: number }>>> {
  const positionsByBuildingId: Record<string, Readonly<{ x: number; y: number }>> = {};
  const cabinRecord = readJsonRecord(buildingRecords.Cabin, `${animationDatasetUrls.buildings}#Cabin`);
  const cabinMetadata = readJsonRecord(cabinRecord.Metadata, "Cabin.Metadata");
  const cabinBasePosition = readChimneyPosition(
    cabinMetadata.ChimneyPosition,
    "Cabin.Metadata.ChimneyPosition",
  );
  addChimneyPositionForBuildingUpgrades(positionsByBuildingId, "Cabin", cabinBasePosition);
  if (!Array.isArray(cabinRecord.Skins)) {
    throw new TypeError(`Buildings.json Cabin.Skins must be an array; received ${describeValue(cabinRecord.Skins)}.`);
  }
  for (const [skinIndex, rawCabinSkin] of cabinRecord.Skins.entries()) {
    const cabinSkin = readJsonRecord(rawCabinSkin, `Cabin.Skins[${String(skinIndex)}]`);
    const skinId = readRequiredString(cabinSkin.Id, `Cabin.Skins[${String(skinIndex)}].Id`);
    const skinMetadata = readJsonRecord(cabinSkin.Metadata, `Cabin.Skins[${String(skinIndex)}].Metadata`);
    const skinPosition = readChimneyPosition(
      skinMetadata.ChimneyPosition,
      `Cabin.Skins[${String(skinIndex)}].Metadata.ChimneyPosition`,
    );
    addChimneyPositionForBuildingUpgrades(positionsByBuildingId, skinId, skinPosition);
  }
  const farmhouseRecord = readJsonRecord(buildingRecords.Farmhouse, `${animationDatasetUrls.buildings}#Farmhouse`);
  const farmhouseMetadata = readJsonRecord(farmhouseRecord.Metadata, "Farmhouse.Metadata");
  const farmhouseBasePosition = readChimneyPosition(farmhouseMetadata.ChimneyPosition, "Farmhouse.Metadata.ChimneyPosition");
  const farmhouseThirdPosition = readChimneyPosition(farmhouseMetadata.ChimneyPosition3, "Farmhouse.Metadata.ChimneyPosition3");
  positionsByBuildingId.Farmhouse = farmhouseBasePosition;
  positionsByBuildingId.Farmhouse_1 = farmhouseBasePosition;
  positionsByBuildingId.Farmhouse_2 = farmhouseThirdPosition;
  return positionsByBuildingId;
}

function addChimneyPositionForBuildingUpgrades(
  positionsByBuildingId: Record<string, Readonly<{ x: number; y: number }>>,
  buildingId: string,
  chimneyPosition: Readonly<{ x: number; y: number }>,
): void {
  positionsByBuildingId[buildingId] = chimneyPosition;
  positionsByBuildingId[`${buildingId}_1`] = chimneyPosition;
  positionsByBuildingId[`${buildingId}_2`] = chimneyPosition;
}

function readChimneyPosition(rawValue: unknown, sourceLabel: string): Readonly<{ x: number; y: number }> {
  const positionText = readRequiredString(rawValue, sourceLabel);
  const coordinates = positionText.trim().split(/\s+/).map(Number);
  if (coordinates.length !== 2 || coordinates.some((coordinate) => !Number.isSafeInteger(coordinate))) {
    throw new TypeError(`${sourceLabel} must contain exactly two integer coordinates; received ${JSON.stringify(positionText)}.`);
  }
  const [x, y] = coordinates;
  if (x === undefined || y === undefined) {
    throw new TypeError(`${sourceLabel} must contain exactly two integer coordinates; received ${JSON.stringify(positionText)}.`);
  }
  return { x, y };
}

function readMillDrawLayer(rawLayer: unknown, layerIndex: number): AnimationBuildingDrawLayer {
  const layer = readJsonRecord(rawLayer, `Buildings.json Mill.DrawLayers[${String(layerIndex)}]`);
  const rawSourceRect = readJsonRecord(layer.SourceRect, `Mill.DrawLayers[${String(layerIndex)}].SourceRect`);
  const drawPosition = readCoordinatePair(layer.DrawPosition, `Mill.DrawLayers[${String(layerIndex)}].DrawPosition`);
  return {
    id: readRequiredString(layer.Id, `Mill.DrawLayers[${String(layerIndex)}].Id`),
    sourceRect: {
      x: readNonNegativeInteger(rawSourceRect.X, `Mill.DrawLayers[${String(layerIndex)}].SourceRect.X`),
      y: readNonNegativeInteger(rawSourceRect.Y, `Mill.DrawLayers[${String(layerIndex)}].SourceRect.Y`),
      width: readPositiveInteger(rawSourceRect.Width, `Mill.DrawLayers[${String(layerIndex)}].SourceRect.Width`),
      height: readPositiveInteger(rawSourceRect.Height, `Mill.DrawLayers[${String(layerIndex)}].SourceRect.Height`),
    },
    drawPositionX: drawPosition.x,
    drawPositionY: drawPosition.y,
    frameCount: readPositiveInteger(layer.FrameCount, `Mill.DrawLayers[${String(layerIndex)}].FrameCount`),
    frameDurationMilliseconds: readPositiveInteger(layer.FrameDuration, `Mill.DrawLayers[${String(layerIndex)}].FrameDuration`),
    framesPerRow: readInteger(layer.FramesPerRow, `Mill.DrawLayers[${String(layerIndex)}].FramesPerRow`),
    ...(layer.OnlyDrawIfChestHasContents === undefined || layer.OnlyDrawIfChestHasContents === null
      ? {}
      : { onlyDrawIfChestHasContents: readMillChestContentsCondition(layer.OnlyDrawIfChestHasContents, layerIndex) }),
  };
}

function readMillChestContentsCondition(rawCondition: unknown, layerIndex: number): "Input" {
  if (rawCondition !== "Input") {
    throw new TypeError(`Mill.DrawLayers[${String(layerIndex)}].OnlyDrawIfChestHasContents must be "Input" when present; received ${JSON.stringify(rawCondition)}.`);
  }
  return rawCondition;
}

function readMillOutputChestBubble(millRecord: JsonRecord): Extract<AnimationBuildingDefinition, { kind: "mill" }>["chestBubble"] {
  if (!Array.isArray(millRecord.Chests)) {
    throw new TypeError(`Buildings.json Mill.Chests must be an array; received ${describeValue(millRecord.Chests)}.`);
  }
  const outputChests = millRecord.Chests.map((rawChest, chestIndex) => {
    const chest = readJsonRecord(rawChest, `Buildings.json Mill.Chests[${String(chestIndex)}]`);
    return { chest, chestIndex };
  }).filter(({ chest }) => chest.Id === "Output");
  if (outputChests.length !== 1) {
    throw new Error(`Buildings.json Mill.Chests must contain exactly one Output chest; received ${String(outputChests.length)}.`);
  }
  const outputChestEntry = outputChests[0];
  if (outputChestEntry === undefined) {
    throw new Error("Buildings.json Mill Output chest disappeared after validating its count.");
  }
  const displayTile = readCoordinatePair(
    outputChestEntry.chest.DisplayTile,
    `Buildings.json Mill.Chests[${String(outputChestEntry.chestIndex)}].DisplayTile`,
  );
  if (displayTile.x < 0 || displayTile.y < 0) {
    throw new RangeError(`Buildings.json Mill Output chest DisplayTile must be non-negative; received ${JSON.stringify(displayTile)}.`);
  }
  return {
    textureLocalPath: `${localAssetRoot}/sprites/Cursors.png`,
    chestId: "Output",
    displayTileX: displayTile.x,
    displayTileY: displayTile.y,
    displayHeight: readFiniteNumber(
      outputChestEntry.chest.DisplayHeight,
      `Buildings.json Mill.Chests[${String(outputChestEntry.chestIndex)}].DisplayHeight`,
    ),
    sourceRect: { x: 141, y: 465, width: 20, height: 24 },
    opacity: 0.75,
  };
}

function createAnimationControlsByCatalogItemId(input: Readonly<{
  aquariumFishById: AnimationCatalog["aquariumFishById"];
  buildingAnimationsById: AnimationCatalog["buildingAnimationsById"];
  buildingRecords: JsonRecord;
  clothingById: AnimationCatalog["clothingById"];
  farmAnimalsById: AnimationCatalog["farmAnimalsById"];
  machineOutputsById: AnimationCatalog["machineOutputsById"];
  machineStatesById: AnimationCatalog["machineStatesById"];
  petsById: AnimationCatalog["petsById"];
  pondFishById: AnimationCatalog["pondFishById"];
}>): AnimationCatalog["controlsByCatalogItemId"] {
  const controlsByCatalogItemId: Record<string, readonly AnimationControlDefinition[]> = {};
  for (const [catalogItemId, machineStates] of Object.entries(input.machineStatesById)) {
    const outputChoices = input.machineOutputsById[catalogItemId] ?? [];
    const controls: AnimationControlDefinition[] = [{
      kind: "select",
      key: "spriteState",
      choices: machineStates.choices,
    }];
    if (outputChoices.length > 0) {
      controls.push({
        kind: "select",
        key: "readyProduct",
        choices: outputChoices,
        ...(machineStates.workingStateId === undefined
          ? {}
          : { disabledWhen: { field: "spriteState", value: machineStates.workingStateId } }),
      });
    }
    controlsByCatalogItemId[catalogItemId] = controls;
  }
  for (const [catalogItemId, outputChoices] of Object.entries(input.machineOutputsById)) {
    if (controlsByCatalogItemId[catalogItemId] === undefined) {
      controlsByCatalogItemId[catalogItemId] = [{ kind: "select", key: "readyProduct", choices: outputChoices }];
    }
  }
  controlsByCatalogItemId["object:710"] = [{
    kind: "select",
    key: "readyProduct",
    choices: input.machineOutputsById["object:710"] ?? [],
  }];
  controlsByCatalogItemId["building:Fish Pond"] = [
    { kind: "select", key: "fishId", choices: Object.values(input.pondFishById).map(({ id, label, catalogItemId, spriteIndex }) => ({
      id,
      label,
      catalogItemId,
      ...(spriteIndex === undefined ? {} : { spriteIndex }),
    })) },
    { kind: "number", key: "population", minimum: 0, maximum: 10 },
    { kind: "select", key: "produce", choices: [] },
  ];
  for (const aquariumFurnitureId of aquariumFurnitureRecordIds) {
    controlsByCatalogItemId[`furniture_${aquariumFurnitureId}`] = [{
      kind: "multiSelect",
      key: "tankFish",
      choices: Object.values(input.aquariumFishById).map(({ id, label, catalogItemId, textureLocalPath }) => ({
        id,
        label,
        catalogItemId,
        textureLocalPath,
      })),
    }];
  }
  for (const animalHouseBuildingId of animalHouseBuildingIds) {
    const buildingRecord = readJsonRecord(input.buildingRecords[animalHouseBuildingId], `${animationDatasetUrls.buildings}#${animalHouseBuildingId}`);
    const rawOccupantTypes = buildingRecord.ValidOccupantTypes;
    if (!Array.isArray(rawOccupantTypes)) {
      throw new TypeError(`Buildings.json ${JSON.stringify(animalHouseBuildingId)}.ValidOccupantTypes must be an array; received ${describeValue(rawOccupantTypes)}.`);
    }
    const validHouseTypes = rawOccupantTypes.map((occupantType, occupantIndex) => readRequiredString(occupantType, `${animalHouseBuildingId}.ValidOccupantTypes[${String(occupantIndex)}]`));
    const animalChoices = Object.values(input.farmAnimalsById)
      .filter((animal) => validHouseTypes.includes(animal.house))
      .map(({ id, label, textureLocalPath }) => ({ id, label, catalogItemId: id, textureLocalPath }));
    const maxCount = buildingRecord.MaxOccupants === null || buildingRecord.MaxOccupants === undefined
      ? 4
      : readPositiveInteger(buildingRecord.MaxOccupants, `${animalHouseBuildingId}.MaxOccupants`);
    controlsByCatalogItemId[`building:${animalHouseBuildingId}`] = [{ kind: "animalList", key: "animals", choices: animalChoices, maxCount }];
  }
  controlsByCatalogItemId["building:Stable"] = [
    { kind: "checkbox", key: "horse" },
    { kind: "select", key: "hatId", choices: createClothingChoices(input.clothingById, "hat") },
  ];
  const millAnimation = input.buildingAnimationsById["building:Mill"];
  if (millAnimation?.kind !== "mill") {
    throw new Error(`Animation catalog is missing building:Mill animation definition; received ${describeValue(millAnimation)}.`);
  }
  controlsByCatalogItemId["building:Mill"] = [
    { kind: "checkbox", key: "millLoaded" },
    { kind: "checkbox", key: "millOutput" },
    { kind: "select", key: "millProduct", choices: millAnimation.outputChoices },
  ];
  controlsByCatalogItemId["building:Junimo Hut"] = [{ kind: "checkbox", key: "junimos" }];
  controlsByCatalogItemId["building:Gold Clock"] = [{ kind: "checkbox", key: "clockOff" }];
  const petChoices = Object.values(input.petsById).map(({ id, label, textureLocalPath }) => ({ id, label, catalogItemId: id, textureLocalPath }));
  for (const petBowlId of ["Pet Bowl", "Stone Pet Bowl", "Hay Pet Bowl"]) {
    controlsByCatalogItemId[`building:${petBowlId}`] = [
      { kind: "select", key: "petId", choices: petChoices },
      { kind: "select", key: "hatId", choices: createClothingChoices(input.clothingById, "hat") },
    ];
  }
  for (const buildingId of chimneyBuildingIds) {
    controlsByCatalogItemId[`building:${buildingId}`] = [
      { kind: "checkbox", key: "fireplaceLit" },
    ];
  }
  for (const mannequinRecordId of mannequinFurnitureRecordIds) {
    controlsByCatalogItemId[`furniture_${mannequinRecordId}`] = [
      { kind: "select", key: "hatId", choices: createClothingChoices(input.clothingById, "hat") },
      { kind: "select", key: "shirtId", choices: createClothingChoices(input.clothingById, "shirt") },
      { kind: "select", key: "pantsId", choices: createClothingChoices(input.clothingById, "pants") },
    ];
  }
  controlsByCatalogItemId["furniture_Cauldron"] = [];
  return controlsByCatalogItemId;
}

function createClothingChoices(
  clothingById: AnimationCatalog["clothingById"],
  category: "hat" | "shirt" | "pants",
): readonly AnimationChoice[] {
  return Object.values(clothingById)
    .filter((clothingItem) => clothingItem.category === category)
    .map(({ id, label, catalogItemId, spriteIndex, textureLocalPath }) => ({
      id,
      label,
      catalogItemId,
      spriteIndex,
      textureLocalPath,
    }));
}

function createFishLabelsById(fishRecords: JsonRecord): ReadonlyMap<string, Readonly<{ label: string; spriteIndex?: number }>> {
  const fishLabels = new Map<string, Readonly<{ label: string; spriteIndex?: number }>>();
  for (const [fishId, rawFishRecord] of Object.entries(fishRecords)) {
    const fishFields = readRequiredString(rawFishRecord, `Fish.json[${fishId}]`).split("/");
    const spriteIndex = readOptionalNumericId(fishId, `Fish.json ID ${JSON.stringify(fishId)}`);
    fishLabels.set(fishId, {
      label: readRequiredString(fishFields[0], `Fish.json ${fishId} label`),
      ...(spriteIndex === undefined ? {} : { spriteIndex }),
    });
  }
  return fishLabels;
}

function createFishLabelsByName(fishRecords: JsonRecord): ReadonlyMap<string, Readonly<{ label: string; spriteIndex?: number }>> {
  const fishLabelsByName = new Map<string, Readonly<{ label: string; spriteIndex?: number }>>();
  for (const [fishId, rawFishRecord] of Object.entries(fishRecords)) {
    const fishName = readRequiredString(rawFishRecord, `Fish.json[${fishId}]`).split("/")[0];
    if (fishName === undefined || fishName.length === 0) {
      throw new TypeError(`Fish.json ${JSON.stringify(fishId)} must start with a fish name; received ${JSON.stringify(rawFishRecord)}.`);
    }
    const spriteIndex = readOptionalNumericId(fishId, `Fish.json ID ${JSON.stringify(fishId)}`);
    fishLabelsByName.set(fishName, {
      label: fishName,
      ...(spriteIndex === undefined ? {} : { spriteIndex }),
    });
  }
  return fishLabelsByName;
}

function readOptionalNumericId(rawId: string, sourceLabel: string): number | undefined {
  if (!/^\d+$/.test(rawId)) {
    return undefined;
  }
  return readNonNegativeInteger(Number(rawId), sourceLabel);
}

function readObjectLabel(objectRecords: JsonRecord, rawObjectId: string): string {
  const objectRecord = objectRecords[rawObjectId];
  if (objectRecord === undefined) {
    return rawObjectId;
  }
  if (typeof objectRecord === "string") {
    const objectFields = objectRecord.split("/");
    return readRequiredString(objectFields[0], `Objects.json ${rawObjectId} name`);
  }
  const objectRecordById = readJsonRecord(objectRecord, `Objects.json[${JSON.stringify(rawObjectId)}]`);
  return readRequiredString(objectRecordById.Name, `Objects.json ${rawObjectId}.Name`);
}

function readJsonRecord(rawRecord: unknown, sourceLabel: string): JsonRecord {
  if (typeof rawRecord !== "object" || rawRecord === null || Array.isArray(rawRecord)) {
    throw new TypeError(`${sourceLabel} must be a JSON object; received ${describeValue(rawRecord)}.`);
  }
  return rawRecord as JsonRecord;
}

function readRequiredString(rawValue: unknown, sourceLabel: string): string {
  if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
    throw new TypeError(`${sourceLabel} must be a non-empty string; received ${describeValue(rawValue)}.`);
  }
  return rawValue;
}

function readNullableString(rawValue: unknown, sourceLabel: string): string | null {
  if (rawValue === null) {
    return null;
  }
  return readRequiredString(rawValue, sourceLabel);
}

function readInteger(rawValue: unknown, sourceLabel: string): number {
  if (typeof rawValue !== "number" || !Number.isSafeInteger(rawValue)) {
    throw new TypeError(`${sourceLabel} must be a safe integer; received ${describeValue(rawValue)}.`);
  }
  return rawValue;
}

function readNonNegativeInteger(rawValue: unknown, sourceLabel: string): number {
  const integerValue = readInteger(rawValue, sourceLabel);
  if (integerValue < 0) {
    throw new RangeError(`${sourceLabel} must be non-negative; received ${String(integerValue)}.`);
  }
  return integerValue;
}

function readPositiveInteger(rawValue: unknown, sourceLabel: string): number {
  const integerValue = readInteger(rawValue, sourceLabel);
  if (integerValue <= 0) {
    throw new RangeError(`${sourceLabel} must be positive; received ${String(integerValue)}.`);
  }
  return integerValue;
}

function readFiniteNumber(rawValue: unknown, sourceLabel: string): number {
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    throw new TypeError(`${sourceLabel} must be a finite number; received ${describeValue(rawValue)}.`);
  }
  return rawValue;
}

function readPositiveNumber(rawValue: unknown, sourceLabel: string): number {
  const numberValue = readFiniteNumber(rawValue, sourceLabel);
  if (numberValue <= 0) {
    throw new RangeError(`${sourceLabel} must be positive; received ${String(numberValue)}.`);
  }
  return numberValue;
}

function readBoolean(rawValue: unknown, sourceLabel: string): boolean {
  if (typeof rawValue !== "boolean") {
    throw new TypeError(`${sourceLabel} must be boolean; received ${describeValue(rawValue)}.`);
  }
  return rawValue;
}

function readPoint(rawValue: unknown, sourceLabel: string): Readonly<{ x: number; y: number }> {
  const pointRecord = readJsonRecord(rawValue, sourceLabel);
  return {
    x: readInteger(pointRecord.X, `${sourceLabel}.X`),
    y: readInteger(pointRecord.Y, `${sourceLabel}.Y`),
  };
}

function readCoordinatePair(rawValue: unknown, sourceLabel: string): Readonly<{ x: number; y: number }> {
  const coordinateText = readRequiredString(rawValue, sourceLabel);
  const coordinates = coordinateText.split(",").map((coordinateTextValue) => Number(coordinateTextValue.trim()));
  if (coordinates.length !== 2 || coordinates.some((coordinate) => !Number.isSafeInteger(coordinate))) {
    throw new TypeError(`${sourceLabel} must contain exactly two integer coordinates; received ${JSON.stringify(coordinateText)}.`);
  }
  const [x, y] = coordinates;
  if (x === undefined || y === undefined) {
    throw new TypeError(`${sourceLabel} must contain exactly two coordinates; received ${JSON.stringify(coordinateText)}.`);
  }
  return { x, y };
}

function toLocalTexturePath(contentTexturePath: string): string {
  const normalizedPath = contentTexturePath.replaceAll("\\", "/");
  const [contentDirectory, ...textureNameParts] = normalizedPath.split("/");
  if (
    contentDirectory !== "Animals" ||
    textureNameParts.length === 0 ||
    normalizedPath.includes("..")
  ) {
    throw new TypeError(`Animation animal texture path must be a safe Animals path; received ${JSON.stringify(contentTexturePath)}.`);
  }
  return `${localAssetRoot}/animals/${textureNameParts.join("/")}.png`;
}

function getMachineCatalogItemId(rawMachineId: string): string {
  return rawMachineId === "object_710" ? "object:710" : `big-craftable:${rawMachineId}`;
}

function assertAnimationCatalog(animationCatalog: AnimationCatalog): void {
  if (typeof animationCatalog !== "object" || animationCatalog === null || !("controlsByCatalogItemId" in animationCatalog)) {
    throw new TypeError(`Animation catalog must be a loaded catalog object; received ${describeValue(animationCatalog)}.`);
  }
}

function assertCatalogItemId(catalogItemId: string): void {
  if (typeof catalogItemId !== "string" || catalogItemId.trim().length === 0) {
    throw new TypeError(`Animation catalog item ID must be a non-empty string; received ${describeValue(catalogItemId)}.`);
  }
}

function validateAnimationJsonFetcher(fetchAnimationJson: CatalogJsonFetcher): void {
  if (typeof fetchAnimationJson !== "function") {
    throw new TypeError(`Animation catalog JSON fetcher must be a function; received ${describeValue(fetchAnimationJson)}.`);
  }
}

function describeValue(rawValue: unknown): string {
  if (rawValue instanceof Error) {
    return `${rawValue.name}: ${rawValue.message}`;
  }
  if (rawValue === undefined) return "undefined";
  if (rawValue === null) return "null";
  if (Array.isArray(rawValue)) return `[array length ${String(rawValue.length)}]`;
  if (typeof rawValue === "object") return `[object ${Object.prototype.toString.call(rawValue)}]`;
  return JSON.stringify(rawValue);
}
