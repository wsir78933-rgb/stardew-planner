import {
  calculateProcessingRoute,
  getProcessingIngredient,
  getProcessingIngredientQualities,
  listProcessingIngredients,
  type ApplicableProcessingRouteQuote,
  type CalculateProcessingRouteInput,
  type ProcessingIngredient,
  type ProcessingRouteQuote,
  type ProcessingCoconutSource,
} from "./processing-model";

export type KegIngredientRankingSort =
  | "per-machine-cycle"
  | "per-ingredient"
  | "per-processing-minute";

export type KegIngredientRankingRow = Readonly<{
  ingredient: ProcessingIngredient;
  quote: ApplicableProcessingRouteQuote;
}>;

export type KegInventoryEstimateInput = Readonly<{
  ingredientId: string;
  quantity: number;
  quality: CalculateProcessingRouteInput["quality"];
  profession: CalculateProcessingRouteInput["profession"];
  kegCount: number;
  deadlineDays: 7 | 14 | 28;
  hasBearsKnowledge?: boolean;
  coconutSource?: ProcessingCoconutSource;
}>;

export type KegInventoryEstimate = ProcessingRouteQuote;

export type KegIngredientRankingSettings = Readonly<{
  quality: CalculateProcessingRouteInput["quality"];
  profession: CalculateProcessingRouteInput["profession"];
  hasBearsKnowledge?: boolean;
  coconutSource?: ProcessingCoconutSource;
}>;

const kegRankingMode = "unlimited" satisfies CalculateProcessingRouteInput["mode"];
const kegRankingMachine = "keg" satisfies CalculateProcessingRouteInput["machine"];

export function readKegIngredientRanking(
  settings: KegIngredientRankingSettings,
  sortBy: KegIngredientRankingSort,
): readonly KegIngredientRankingRow[] {
  assertKegIngredientRankingSettings(settings);
  assertKegIngredientRankingSort(sortBy);

  const rankedRows = listProcessingIngredients()
    .map((ingredient) => createKegIngredientRankingRow(ingredient, settings))
    .filter((row): row is KegIngredientRankingRow => row !== null);

  return rankedRows.sort((leftRow, rightRow) =>
    compareKegIngredientRankingRows(leftRow, rightRow, sortBy),
  );
}

export function readKegIngredientRankingSelection(
  rankingRows: readonly KegIngredientRankingRow[],
  selectedIngredientId: string,
): KegIngredientRankingRow | null {
  if (selectedIngredientId.length === 0) {
    return rankingRows[0] ?? null;
  }

  return rankingRows.find(
    (rankingRow) => rankingRow.ingredient.id === selectedIngredientId,
  ) ?? null;
}

export function readKegInventoryEstimate(
  input: KegInventoryEstimateInput,
): KegInventoryEstimate {
  assertKegInventoryEstimateInput(input);

  return calculateProcessingRoute({
    ingredientId: input.ingredientId,
    quantity: input.quantity,
    quality: readSupportedIngredientQuality(
      input.ingredientId,
      input.quality,
    ),
    profession: input.profession,
    hasBearsKnowledge: input.hasBearsKnowledge ?? false,
    coconutSource: input.coconutSource ?? "foraged",
    mode: "capacity",
    deadlineDays: input.deadlineDays,
    machineCounts: {
      keg: input.kegCount,
      jar: 0,
      dehydrator: 0,
    },
    machine: "keg",
  });
}

function createKegIngredientRankingRow(
  ingredient: ProcessingIngredient,
  settings: KegIngredientRankingSettings,
): KegIngredientRankingRow | null {
  const rankingQuality = readKegRankingQuality(ingredient, settings.quality);
  if (rankingQuality === null) {
    return null;
  }

  const recipeProbe = calculateProcessingRoute(
    createKegRankingQuoteInput(ingredient, 1, rankingQuality, settings),
  );

  if (!recipeProbe.applicable) {
    return null;
  }

  assertPositiveRecipeBatchSize(ingredient.id, recipeProbe.batchInputUnits);

  const oneBatchQuote = calculateProcessingRoute(
    createKegRankingQuoteInput(
      ingredient,
      recipeProbe.batchInputUnits,
      rankingQuality,
      settings,
    ),
  );

  if (!oneBatchQuote.applicable) {
    throw new Error(
      `Keg recipe became unavailable between ranking quotes. Received ingredientId=${JSON.stringify(ingredient.id)}, batchInputUnits=${JSON.stringify(recipeProbe.batchInputUnits)}, unavailableReason=${JSON.stringify(oneBatchQuote.unavailableReason)}.`,
    );
  }

  return { ingredient, quote: oneBatchQuote };
}

function createKegRankingQuoteInput(
  ingredient: ProcessingIngredient,
  quantity: number,
  quality: CalculateProcessingRouteInput["quality"],
  settings: KegIngredientRankingSettings,
): CalculateProcessingRouteInput {
  return {
    ingredientId: ingredient.id,
    quantity,
    quality,
    profession: settings.profession,
    hasBearsKnowledge: settings.hasBearsKnowledge ?? false,
    coconutSource: settings.coconutSource ?? "foraged",
    mode: kegRankingMode,
    deadlineDays: 28,
    machineCounts: { keg: 1, jar: 0, dehydrator: 0 },
    machine: kegRankingMachine,
  };
}

function readSupportedIngredientQuality(
  ingredientId: string,
  requestedQuality: CalculateProcessingRouteInput["quality"],
): CalculateProcessingRouteInput["quality"] {
  const ingredient = getProcessingIngredient(ingredientId);
  const allowedQualities = getProcessingIngredientQualities(ingredientId);
  const requestedIngredientQuality = ingredient.hasQualityTiers
    ? requestedQuality
    : "normal";
  if (!allowedQualities.includes(requestedIngredientQuality)) {
    throw new Error(
      `Keg inventory quality is unsupported. Received ingredientId=${JSON.stringify(ingredientId)}, quality=${JSON.stringify(requestedIngredientQuality)}, supportedQualities=${JSON.stringify(allowedQualities)}.`,
    );
  }

  return requestedIngredientQuality;
}

function readKegRankingQuality(
  ingredient: ProcessingIngredient,
  requestedQuality: CalculateProcessingRouteInput["quality"],
): CalculateProcessingRouteInput["quality"] | null {
  const allowedQualities = getProcessingIngredientQualities(ingredient.id);
  const effectiveQuality = ingredient.hasQualityTiers ? requestedQuality : "normal";
  return allowedQualities.includes(effectiveQuality) ? effectiveQuality : null;
}

function compareKegIngredientRankingRows(
  leftRow: KegIngredientRankingRow,
  rightRow: KegIngredientRankingRow,
  sortBy: KegIngredientRankingSort,
): number {
  const leftValue = readKegIngredientRankingValue(leftRow, sortBy);
  const rightValue = readKegIngredientRankingValue(rightRow, sortBy);

  if (leftValue !== rightValue) {
    return rightValue - leftValue;
  }

  const englishNameOrder = compareText(
    leftRow.ingredient.englishName,
    rightRow.ingredient.englishName,
  );
  return englishNameOrder !== 0
    ? englishNameOrder
    : compareText(leftRow.ingredient.id, rightRow.ingredient.id);
}

function readKegIngredientRankingValue(
  row: KegIngredientRankingRow,
  sortBy: KegIngredientRankingSort,
): number {
  if (sortBy === "per-machine-cycle") {
    return row.quote.valueAdded;
  }

  if (sortBy === "per-ingredient") {
    return row.quote.valueAddedPerProcessedUnit;
  }
  if (sortBy === "per-processing-minute") {
    return row.quote.valueAdded / row.quote.processingMinutes;
  }

  throw new Error(
    `Unsupported Keg ingredient ranking sort. Received: ${JSON.stringify(sortBy)}.`,
  );
}

function assertKegIngredientRankingSort(
  sortBy: KegIngredientRankingSort,
): void {
  if (
    sortBy !== "per-machine-cycle" &&
    sortBy !== "per-ingredient" &&
    sortBy !== "per-processing-minute"
  ) {
    throw new Error(
      `Unsupported Keg ingredient ranking sort. Received: ${JSON.stringify(sortBy)}.`,
    );
  }
}

function assertKegIngredientRankingSettings(
  settings: KegIngredientRankingSettings,
): void {
  if (typeof settings !== "object" || settings === null || Array.isArray(settings)) {
    throw new Error(
      `Keg ingredient ranking settings must be a record. Received: ${JSON.stringify(settings) ?? String(settings)}.`,
    );
  }

  if (!isProcessingQuality(settings.quality)) {
    throw new Error(
      `Keg ingredient ranking quality is unsupported. Received: ${JSON.stringify(settings.quality) ?? String(settings.quality)}.`,
    );
  }

  if (!isProcessingProfession(settings.profession)) {
    throw new Error(
      `Keg ingredient ranking profession is unsupported. Received: ${JSON.stringify(settings.profession) ?? String(settings.profession)}.`,
    );
  }
  if (settings.hasBearsKnowledge !== undefined && typeof settings.hasBearsKnowledge !== "boolean") {
    throw new Error(
      `Keg ingredient ranking Bear's Knowledge setting must be a boolean. Received: ${JSON.stringify(settings.hasBearsKnowledge) ?? String(settings.hasBearsKnowledge)}.`,
    );
  }
  if (settings.coconutSource !== undefined && !isProcessingCoconutSource(settings.coconutSource)) {
    throw new Error(
      `Keg ingredient ranking coconut source is unsupported. Received: ${JSON.stringify(settings.coconutSource) ?? String(settings.coconutSource)}.`,
    );
  }
}

function assertPositiveRecipeBatchSize(
  ingredientId: string,
  batchInputUnits: number,
): void {
  if (!Number.isInteger(batchInputUnits) || batchInputUnits <= 0) {
    throw new Error(
      `Keg recipe batch input units must be a positive integer. Received ingredientId=${JSON.stringify(ingredientId)}, batchInputUnits=${JSON.stringify(batchInputUnits)}.`,
    );
  }
}

function assertKegInventoryEstimateInput(
  input: KegInventoryEstimateInput,
): void {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(
      `Keg inventory estimate input must be a record. Received: ${JSON.stringify(input) ?? String(input)}.`,
    );
  }

  if (typeof input.ingredientId !== "string" || input.ingredientId.trim().length === 0) {
    throw new Error(
      `Keg inventory ingredient id must be a non-empty string. Received: ${JSON.stringify(input.ingredientId) ?? String(input.ingredientId)}.`,
    );
  }

  if (!Number.isSafeInteger(input.quantity) || input.quantity < 0) {
    throw new Error(
      `Keg inventory quantity must be a non-negative safe integer. Received: ${String(input.quantity)}.`,
    );
  }

  if (!Number.isSafeInteger(input.kegCount) || input.kegCount < 0) {
    throw new Error(
      `Keg inventory machine count must be a non-negative safe integer. Received: ${String(input.kegCount)}.`,
    );
  }

  if (input.deadlineDays !== 7 && input.deadlineDays !== 14 && input.deadlineDays !== 28) {
    throw new Error(
      `Keg inventory deadline must be 7, 14, or 28 days. Received: ${String(input.deadlineDays)}.`,
    );
  }

  if (!isProcessingQuality(input.quality)) {
    throw new Error(
      `Keg inventory quality is unsupported. Received: ${JSON.stringify(input.quality) ?? String(input.quality)}.`,
    );
  }
  if (!isProcessingProfession(input.profession)) {
    throw new Error(
      `Keg inventory profession is unsupported. Received: ${JSON.stringify(input.profession) ?? String(input.profession)}.`,
    );
  }
  if (input.hasBearsKnowledge !== undefined && typeof input.hasBearsKnowledge !== "boolean") {
    throw new Error(
      `Keg inventory Bear's Knowledge setting must be a boolean. Received: ${JSON.stringify(input.hasBearsKnowledge) ?? String(input.hasBearsKnowledge)}.`,
    );
  }
  if (input.coconutSource !== undefined && !isProcessingCoconutSource(input.coconutSource)) {
    throw new Error(
      `Keg inventory coconut source is unsupported. Received: ${JSON.stringify(input.coconutSource) ?? String(input.coconutSource)}.`,
    );
  }
}

function isProcessingCoconutSource(value: unknown): value is ProcessingCoconutSource {
  return value === "foraged" || value === "purchased-or-gifted";
}

function isProcessingQuality(value: unknown): value is CalculateProcessingRouteInput["quality"] {
  return value === "normal" || value === "silver" || value === "gold" || value === "iridium";
}

function isProcessingProfession(value: unknown): value is CalculateProcessingRouteInput["profession"] {
  return value === "none" || value === "tiller" || value === "artisan";
}

function compareText(leftText: string, rightText: string): number {
  if (leftText < rightText) {
    return -1;
  }

  return leftText > rightText ? 1 : 0;
}
