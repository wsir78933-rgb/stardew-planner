export const KEG_CRAFTING_RECIPE = {
  wood: 30,
  copperBar: 1,
  ironBar: 1,
  oakResin: 1,
} as const;
export const kegMaterialsStorageKey = "stardew-tools:workshop-keg-materials";

export type KegMaterialName = keyof typeof KEG_CRAFTING_RECIPE;
export type OakTapperType = "regular" | "heavy";

export type KegMaterialInventory = Readonly<Record<KegMaterialName, number>>;

export type KegMaterialsInput = Readonly<{
  targetKegCount: number;
  existingKegCount: number;
  inventory: KegMaterialInventory;
  matureOakTapperCount: number;
  tapperType: OakTapperType;
  waitingDays: number;
}>;

export type KegMaterialsGoal = "single-harvest" | "steady-state";

export type KegMaterialsHandoff = Readonly<{
  source: KegMaterialsGoal;
  targetKegCount: number;
  existingKegCount: number;
}>;

export type KegMaterialRequirement = Readonly<{
  unitsPerKeg: number;
  targetNeed: number;
  currentInventory: number;
  shortageNow: number;
  remainingAfterBuildingNow: number;
  kegsBuildableFromInventory: number;
}>;

export type KegResinProjection = Readonly<{
  cycleDays: 7 | 3;
  completedCycles: number;
  producedByDeadline: number;
  shortageNow: number;
  shortageAtDeadline: number;
  daysUntilEnough: number | null;
  matureOakTappersNeededByDeadline: number | null;
}>;

export type KegMaterialsEstimate = Readonly<{
  targetKegCount: number;
  existingKegCount: number;
  kegsToBuild: number;
  buildableNowCount: number;
  remainingKegsAfterBuildingNow: number;
  bottleneckMaterial: KegMaterialName | null;
  requirements: Readonly<Record<KegMaterialName, KegMaterialRequirement>>;
  resin: KegResinProjection;
}>;

const KEG_MATERIAL_ORDER: readonly KegMaterialName[] = [
  "wood",
  "copperBar",
  "ironBar",
  "oakResin",
];

export function createDefaultKegMaterialsInput(): KegMaterialsInput {
  return {
    targetKegCount: 4,
    existingKegCount: 1,
    inventory: { wood: 120, copperBar: 1, ironBar: 1, oakResin: 0 },
    matureOakTapperCount: 1,
    tapperType: "regular",
    waitingDays: 7,
  };
}

export function isKegMaterialsInputFailure(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Keg materials ");
}

export function loadKegMaterialsInput(storageText: string | null): KegMaterialsInput {
  if (storageText === null) {
    return createDefaultKegMaterialsInput();
  }
  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storageText);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    throw new Error(
      `Keg materials storage must be valid JSON. Received: ${JSON.stringify(storageText)}.`,
      { cause: error },
    );
  }
  return readKegMaterialsInput(parsedValue as KegMaterialsInput);
}

export function serializeKegMaterialsInput(input: KegMaterialsInput): string {
  return JSON.stringify(readKegMaterialsInput(input));
}

export function applyKegMaterialsHandoff(
  input: KegMaterialsInput,
  handoff: KegMaterialsHandoff,
): KegMaterialsInput {
  const validatedInput = readKegMaterialsInput(input);
  const validatedHandoff = readKegMaterialsHandoff(handoff);
  return readKegMaterialsInput({
    ...validatedInput,
    targetKegCount: validatedHandoff.targetKegCount,
    existingKegCount: validatedHandoff.existingKegCount,
  });
}

export function calculateKegMaterials(input: KegMaterialsInput): KegMaterialsEstimate {
  const validatedInput = readKegMaterialsInput(input);
  const kegsToBuild = Math.max(
    0,
    validatedInput.targetKegCount - validatedInput.existingKegCount,
  );
  const buildCapacityByMaterial = readBuildCapacityByMaterial(validatedInput.inventory);
  const buildableNowCount = Math.min(
    kegsToBuild,
    ...Object.values(buildCapacityByMaterial),
  );
  const requirements = createKegMaterialRequirements(
    validatedInput.inventory,
    kegsToBuild,
    buildableNowCount,
  );
  const resin = calculateKegResinProjection(
    validatedInput,
    requirements.oakResin,
  );

  return {
    targetKegCount: validatedInput.targetKegCount,
    existingKegCount: validatedInput.existingKegCount,
    kegsToBuild,
    buildableNowCount,
    remainingKegsAfterBuildingNow: kegsToBuild - buildableNowCount,
    bottleneckMaterial: readBottleneckMaterial(kegsToBuild, buildCapacityByMaterial),
    requirements,
    resin,
  };
}

export function createKegMaterialsHandoff(
  targetKegCount: number,
  existingKegCount: number,
  source: KegMaterialsGoal,
): KegMaterialsHandoff {
  readSafeNonNegativeInteger("targetKegCount", targetKegCount);
  readSafeNonNegativeInteger("existingKegCount", existingKegCount);
  readKegMaterialsGoal(source);
  return { source, targetKegCount, existingKegCount };
}

export function createKegMaterialsHref(
  locale: PublicLocale,
  handoff: KegMaterialsHandoff,
): string {
  const validatedHandoff = readKegMaterialsHandoff(handoff);
  const pathPrefix = readLocalePathPrefix(locale);
  const searchParameters = new URLSearchParams({
    kegTarget: String(validatedHandoff.targetKegCount),
    kegExisting: String(validatedHandoff.existingKegCount),
    kegSource: validatedHandoff.source,
  });
  return `${pathPrefix}/tools/materials-and-resin?${searchParameters.toString()}`;
}

export function readKegMaterialsHandoffFromSearch(search: string): KegMaterialsHandoff | null {
  if (typeof search !== "string") {
    throw new Error(`Keg materials search must be a string. Received: ${JSON.stringify(search)}.`);
  }
  const searchParameters = new URLSearchParams(search);
  const parameterNames = ["kegTarget", "kegExisting", "kegSource"] as const;
  const presentNames = parameterNames.filter((parameterName) =>
    searchParameters.has(parameterName),
  );
  if (presentNames.length === 0) {
    return null;
  }
  if (presentNames.length !== parameterNames.length) {
    throw new Error(
      `Keg materials handoff query must include all of ${parameterNames.join(", ")}. Received: ${JSON.stringify(search)}.`,
    );
  }

  const targetKegCount = readQueryInteger(searchParameters, "kegTarget");
  const existingKegCount = readQueryInteger(searchParameters, "kegExisting");
  const source = readKegMaterialsGoal(readQueryValue(searchParameters, "kegSource"));
  return { targetKegCount, existingKegCount, source };
}

function createKegMaterialRequirements(
  inventory: KegMaterialInventory,
  kegsToBuild: number,
  buildableNowCount: number,
): Readonly<Record<KegMaterialName, KegMaterialRequirement>> {
  return {
    wood: createKegMaterialRequirement("wood", inventory.wood, kegsToBuild, buildableNowCount),
    copperBar: createKegMaterialRequirement(
      "copperBar",
      inventory.copperBar,
      kegsToBuild,
      buildableNowCount,
    ),
    ironBar: createKegMaterialRequirement(
      "ironBar",
      inventory.ironBar,
      kegsToBuild,
      buildableNowCount,
    ),
    oakResin: createKegMaterialRequirement(
      "oakResin",
      inventory.oakResin,
      kegsToBuild,
      buildableNowCount,
    ),
  };
}

function createKegMaterialRequirement(
  materialName: KegMaterialName,
  currentInventory: number,
  kegsToBuild: number,
  buildableNowCount: number,
): KegMaterialRequirement {
  const unitsPerKeg = KEG_CRAFTING_RECIPE[materialName];
  const targetNeed = requireSafeProduct(
    `requirements.${materialName}.targetNeed`,
    kegsToBuild,
    unitsPerKeg,
  );
  const usedByBuildableKegs = requireSafeProduct(
    `requirements.${materialName}.usedByBuildableKegs`,
    buildableNowCount,
    unitsPerKeg,
  );
  return {
    unitsPerKeg,
    targetNeed,
    currentInventory,
    shortageNow: Math.max(0, targetNeed - currentInventory),
    remainingAfterBuildingNow: currentInventory - usedByBuildableKegs,
    kegsBuildableFromInventory: Math.floor(currentInventory / unitsPerKeg),
  };
}

function calculateKegResinProjection(
  input: KegMaterialsInput,
  resinRequirement: KegMaterialRequirement,
): KegResinProjection {
  const cycleDays: 7 | 3 = input.tapperType === "regular" ? 7 : 3;
  const completedCycles = Math.floor(input.waitingDays / cycleDays);
  const producedByDeadline = requireSafeProduct(
    "resin.producedByDeadline",
    input.matureOakTapperCount,
    completedCycles,
  );
  const shortageAtDeadline = Math.max(
    0,
    resinRequirement.shortageNow - producedByDeadline,
  );
  const daysUntilEnough = resinRequirement.shortageNow === 0
    ? 0
    : input.matureOakTapperCount === 0
      ? null
      : Math.ceil(resinRequirement.shortageNow / input.matureOakTapperCount) * cycleDays;
  const matureOakTappersNeededByDeadline = resinRequirement.shortageNow === 0
    ? 0
    : completedCycles === 0
      ? null
      : Math.ceil(resinRequirement.shortageNow / completedCycles);

  return {
    cycleDays,
    completedCycles,
    producedByDeadline,
    shortageNow: resinRequirement.shortageNow,
    shortageAtDeadline,
    daysUntilEnough,
    matureOakTappersNeededByDeadline,
  };
}

function readBuildCapacityByMaterial(
  inventory: KegMaterialInventory,
): Readonly<Record<KegMaterialName, number>> {
  return {
    wood: Math.floor(inventory.wood / KEG_CRAFTING_RECIPE.wood),
    copperBar: Math.floor(inventory.copperBar / KEG_CRAFTING_RECIPE.copperBar),
    ironBar: Math.floor(inventory.ironBar / KEG_CRAFTING_RECIPE.ironBar),
    oakResin: Math.floor(inventory.oakResin / KEG_CRAFTING_RECIPE.oakResin),
  };
}

function readBottleneckMaterial(
  kegsToBuild: number,
  buildCapacityByMaterial: Readonly<Record<KegMaterialName, number>>,
): KegMaterialName | null {
  if (kegsToBuild === 0) {
    return null;
  }

  const availableKegCounts = Object.values(buildCapacityByMaterial);
  if (availableKegCounts.every((availableKegCount) => availableKegCount >= kegsToBuild)) {
    return null;
  }

  return KEG_MATERIAL_ORDER.reduce((bottleneck, materialName) =>
    buildCapacityByMaterial[materialName] < buildCapacityByMaterial[bottleneck]
      ? materialName
      : bottleneck,
  );
}

function readKegMaterialsInput(input: KegMaterialsInput): KegMaterialsInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`Keg materials input must be an object. Received: ${JSON.stringify(input)}.`);
  }
  const targetKegCount = readSafeNonNegativeInteger("targetKegCount", input.targetKegCount);
  const existingKegCount = readSafeNonNegativeInteger("existingKegCount", input.existingKegCount);
  const matureOakTapperCount = readSafeNonNegativeInteger(
    "matureOakTapperCount",
    input.matureOakTapperCount,
  );
  const waitingDays = readSafeNonNegativeInteger("waitingDays", input.waitingDays);
  if (input.tapperType !== "regular" && input.tapperType !== "heavy") {
    throw new Error(
      `Keg materials tapperType is invalid. Received: ${JSON.stringify(input.tapperType)}.`,
    );
  }
  if (typeof input.inventory !== "object" || input.inventory === null || Array.isArray(input.inventory)) {
    throw new Error(`Keg materials inventory must be an object. Received: ${JSON.stringify(input.inventory)}.`);
  }
  const inventory: KegMaterialInventory = {
    wood: readSafeNonNegativeInteger("inventory.wood", input.inventory.wood),
    copperBar: readSafeNonNegativeInteger("inventory.copperBar", input.inventory.copperBar),
    ironBar: readSafeNonNegativeInteger("inventory.ironBar", input.inventory.ironBar),
    oakResin: readSafeNonNegativeInteger("inventory.oakResin", input.inventory.oakResin),
  };
  return {
    targetKegCount,
    existingKegCount,
    inventory,
    matureOakTapperCount,
    tapperType: input.tapperType,
    waitingDays,
  };
}

function readKegMaterialsHandoff(value: KegMaterialsHandoff): KegMaterialsHandoff {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Keg materials handoff must be an object. Received: ${JSON.stringify(value)}.`);
  }
  return createKegMaterialsHandoff(value.targetKegCount, value.existingKegCount, value.source);
}

function readKegMaterialsGoal(value: unknown): KegMaterialsGoal {
  if (value !== "single-harvest" && value !== "steady-state") {
    throw new Error(`Keg materials source is invalid. Received: ${JSON.stringify(value)}.`);
  }
  return value;
}

function readQueryInteger(searchParameters: URLSearchParams, parameterName: string): number {
  const rawValues = searchParameters.getAll(parameterName);
  if (rawValues.length !== 1) {
    throw new Error(
      `Keg materials query parameter ${JSON.stringify(parameterName)} must appear once. Received: ${JSON.stringify(rawValues)}.`,
    );
  }
  const rawValue = rawValues[0];
  if (rawValue === undefined || !/^\d+$/.test(rawValue)) {
    throw new Error(
      `Keg materials query parameter ${JSON.stringify(parameterName)} must be a non-negative integer. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  const numericValue = Number(rawValue);
  if (!Number.isSafeInteger(numericValue)) {
    throw new Error(
      `Keg materials query parameter ${JSON.stringify(parameterName)} exceeds the safe integer range. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return readSafeNonNegativeInteger(parameterName, numericValue);
}

function readQueryValue(searchParameters: URLSearchParams, parameterName: string): string {
  const rawValues = searchParameters.getAll(parameterName);
  if (rawValues.length !== 1) {
    throw new Error(
      `Keg materials query parameter ${JSON.stringify(parameterName)} must appear once. Received: ${JSON.stringify(rawValues)}.`,
    );
  }
  const rawValue = rawValues[0];
  if (rawValue === undefined) {
    throw new Error(`Keg materials query parameter ${JSON.stringify(parameterName)} is missing.`);
  }
  return rawValue;
}

function readLocalePathPrefix(locale: PublicLocale): "" | "/zh" {
  if (locale === "en") {
    return "";
  }
  if (locale === "zh-CN") {
    return "/zh";
  }
  throw new Error(`Keg materials locale is unsupported. Received: ${JSON.stringify(locale)}.`);
}

function readSafeNonNegativeInteger(fieldName: string, value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Keg materials ${fieldName} must be a non-negative safe integer. Received: ${JSON.stringify(value)}.`,
    );
  }
  return value;
}

function requireSafeProduct(fieldName: string, leftFactor: number, rightFactor: number): number {
  const product = leftFactor * rightFactor;
  if (!Number.isSafeInteger(product) || product < 0) {
    throw new Error(
      `Keg materials result ${fieldName} is outside the supported integer range. Received: ${JSON.stringify({ leftFactor, rightFactor, product })}.`,
    );
  }
  return product;
}
import type { PublicLocale } from "../i18n/public-locale";

