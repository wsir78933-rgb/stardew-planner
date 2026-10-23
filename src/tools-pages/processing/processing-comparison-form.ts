import {
  getProcessingIngredient,
  getProcessingIngredientQualities,
  listProcessingIngredients,
  type CalculateProcessingRoutesInput,
  type ProcessingMachine,
  type ProcessingCoconutSource,
  type ProcessingMode,
  type ProcessingProfession,
  type ProcessingQuality,
} from "../../processing-tools/processing-model";
import type { ProcessingComparisonToolId } from "./processing-tool-definition";

export const processingComparisonStorageKey = "stardew-tools:processing-comparison";

const processingQualities: readonly ProcessingQuality[] = [
  "normal",
  "silver",
  "gold",
  "iridium",
];
const processingProfessions: readonly ProcessingProfession[] = [
  "none",
  "tiller",
  "artisan",
];
const processingMachines: readonly ProcessingMachine[] = [
  "keg",
  "jar",
  "dehydrator",
];
const processingCoconutSources: readonly ProcessingCoconutSource[] = [
  "foraged",
  "purchased-or-gifted",
];
const processingModes: readonly ProcessingMode[] = ["unlimited", "capacity"];
const processingDeadlines = [7, 14, 28] as const;

export type ProcessingComparisonForm = CalculateProcessingRoutesInput;
export type ProcessingComparisonNumericField = "quantity" | ProcessingMachine;
export type ProcessingComparisonFormLoadResult = Readonly<{
  form: ProcessingComparisonForm;
  qualityWasReset: boolean;
}>;

export function isProcessingComparisonFormValidationFailure(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Processing comparison ");
}

export function isProcessingComparisonNumericInputFailure(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Processing comparison numeric input ");
}

export function parseProcessingComparisonNonNegativeInteger(rawValue: string, fieldName: string): number {
  if (!/^\d+$/.test(rawValue.trim())) {
    throw new Error(
      `Processing comparison numeric input for field ${JSON.stringify(fieldName)} must be a whole number of 0 or more. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  const value = Number(rawValue);
  if (!Number.isSafeInteger(value)) {
    throw new Error(
      `Processing comparison numeric input for field ${JSON.stringify(fieldName)} must be a safe integer. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return value;
}

export function updateProcessingComparisonNumericValue(
  form: ProcessingComparisonForm,
  field: ProcessingComparisonNumericField,
  value: number,
): ProcessingComparisonForm {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Processing comparison numeric value must be a non-negative safe integer. Received field=${JSON.stringify(field)}, value=${JSON.stringify(value)}.`,
    );
  }
  if (field === "quantity") {
    return { ...form, quantity: value };
  }
  return { ...form, machineCounts: { ...form.machineCounts, [field]: value } };
}

export function updateProcessingComparisonIngredient(
  form: ProcessingComparisonForm,
  ingredientId: string,
): ProcessingComparisonForm {
  const supportedQualities = getProcessingIngredientQualities(ingredientId);
  if (!supportedQualities.includes("normal")) {
    throw new Error(
      `Processing ingredient quality options must include normal. Received ingredientId=${JSON.stringify(ingredientId)}, supportedQualities=${JSON.stringify(supportedQualities)}.`,
    );
  }

  return {
    ...form,
    ingredientId,
    quality: supportedQualities.includes(form.quality) ? form.quality : "normal",
  };
}

export function updateProcessingComparisonCoconutSource(
  form: ProcessingComparisonForm,
  coconutSource: ProcessingCoconutSource,
): ProcessingComparisonForm {
  if (!processingCoconutSources.includes(coconutSource)) {
    throw new Error(
      `Processing comparison coconut source is unsupported. Received: ${JSON.stringify(coconutSource)}.`,
    );
  }

  return { ...form, coconutSource };
}

export function updateProcessingComparisonMode(
  form: ProcessingComparisonForm,
  mode: ProcessingMode,
): ProcessingComparisonForm {
  if (!processingModes.includes(mode)) {
    throw new Error(`Processing comparison mode is unsupported. Received: ${JSON.stringify(mode)}.`);
  }
  return { ...form, mode };
}

function readObjectRecord(value: unknown, fieldName: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(
      `Processing comparison field ${fieldName} must be an object. Received: ${JSON.stringify(value)}.`,
    );
  }

  return value as Record<string, unknown>;
}

function readRequiredField(record: Record<string, unknown>, fieldName: string): unknown {
  if (!Object.hasOwn(record, fieldName)) {
    throw new Error(
      `Processing comparison settings are missing ${fieldName}. Received: ${JSON.stringify(record)}.`,
    );
  }

  return record[fieldName];
}

function readNonNegativeSafeInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Processing comparison field ${fieldName} must be a non-negative safe integer. Received: ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function readAllowedValue<Value extends string>(
  value: unknown,
  allowedValues: readonly Value[],
  fieldName: string,
): Value {
  if (typeof value === "string" && allowedValues.includes(value as Value)) {
    return value as Value;
  }

  throw new Error(
    `Processing comparison field ${fieldName} has an unsupported value. Received: ${JSON.stringify(value)}.`,
  );
}

function readProcessingMachineCounts(value: unknown): Record<ProcessingMachine, number> {
  const record = readObjectRecord(value, "machineCounts");
  return {
    keg: readNonNegativeSafeInteger(readRequiredField(record, "keg"), "machineCounts.keg"),
    jar: readNonNegativeSafeInteger(readRequiredField(record, "jar"), "machineCounts.jar"),
    dehydrator: readNonNegativeSafeInteger(
      readRequiredField(record, "dehydrator"),
      "machineCounts.dehydrator",
    ),
  };
}

function readOptionalBoolean(
  record: Record<string, unknown>,
  fieldName: string,
  defaultValue: boolean,
): boolean {
  if (!Object.hasOwn(record, fieldName)) {
    return defaultValue;
  }

  const value = record[fieldName];
  if (typeof value !== "boolean") {
    throw new Error(
      `Processing comparison field ${fieldName} must be a boolean. Received: ${JSON.stringify(value) ?? String(value)}.`,
    );
  }

  return value;
}

function readOptionalCoconutSource(
  record: Record<string, unknown>,
  defaultValue: ProcessingCoconutSource,
): ProcessingCoconutSource {
  if (!Object.hasOwn(record, "coconutSource")) {
    return defaultValue;
  }

  return readAllowedValue(record.coconutSource, processingCoconutSources, "coconutSource");
}

export function createDefaultProcessingComparisonForm(
  toolId: ProcessingComparisonToolId,
): ProcessingComparisonForm {
  const defaultIngredientId = "blueberry";
  const defaultIngredient = getProcessingIngredient(defaultIngredientId);
  const defaultMode: ProcessingMode = toolId === "basic-processing-profit" ? "unlimited" : "capacity";

  return {
    ingredientId: defaultIngredient.id,
    quantity: 20,
    quality: "normal",
    profession: "none",
    mode: defaultMode,
    hasBearsKnowledge: false,
    coconutSource: "foraged",
    deadlineDays: 7,
    machineCounts: {
      keg: 1,
      jar: 1,
      dehydrator: 1,
    },
  };
}

function readProcessingComparisonFormWithRecovery(value: unknown): ProcessingComparisonFormLoadResult {
  const record = readObjectRecord(value, "root");
  const ingredientId = readRequiredField(record, "ingredientId");
  if (typeof ingredientId !== "string") {
    throw new Error(
      `Processing comparison field ingredientId must be a string. Received: ${JSON.stringify(ingredientId)}.`,
    );
  }

  if (!listProcessingIngredients().some((candidate) => candidate.id === ingredientId)) {
    throw new Error(
      `Processing comparison field ingredientId references an unknown ingredient. Received: ${JSON.stringify(ingredientId)}.`,
    );
  }
  const coconutSource = readOptionalCoconutSource(record, "foraged");
  const hasBearsKnowledge = readOptionalBoolean(record, "hasBearsKnowledge", false);
  let quality = readAllowedValue(
    readRequiredField(record, "quality"),
    processingQualities,
    "quality",
  );
  const supportedQualities = getProcessingIngredientQualities(ingredientId);
  let qualityWasReset = false;
  if (!supportedQualities.includes(quality)) {
    if (!supportedQualities.includes("normal")) {
      throw new Error(
        `Processing comparison field quality cannot recover to normal for ingredient ${JSON.stringify(ingredientId)}. Supported values: ${JSON.stringify(supportedQualities)}. Received: ${JSON.stringify(quality)}.`,
      );
    }
    quality = "normal";
    qualityWasReset = true;
  }

  const rawDeadlineDays = readNonNegativeSafeInteger(
    readRequiredField(record, "deadlineDays"),
    "deadlineDays",
  );
  if (!(processingDeadlines as readonly number[]).includes(rawDeadlineDays)) {
    throw new Error(
      `Processing comparison field deadlineDays must be 7, 14, or 28. Received: ${JSON.stringify(rawDeadlineDays)}.`,
    );
  }

  return {
    form: {
      ingredientId,
      quantity: readNonNegativeSafeInteger(readRequiredField(record, "quantity"), "quantity"),
      quality,
      profession: readAllowedValue(
        readRequiredField(record, "profession"),
        processingProfessions,
        "profession",
      ),
      mode: readAllowedValue(readRequiredField(record, "mode"), processingModes, "mode"),
      hasBearsKnowledge,
      coconutSource,
      deadlineDays: rawDeadlineDays as 7 | 14 | 28,
      machineCounts: readProcessingMachineCounts(readRequiredField(record, "machineCounts")),
    },
    qualityWasReset,
  };
}

export function readProcessingComparisonForm(value: unknown): ProcessingComparisonForm {
  return readProcessingComparisonFormWithRecovery(value).form;
}

function parseProcessingComparisonStorageValue(storageText: string): unknown {
  try {
    return JSON.parse(storageText) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Processing comparison settings must be JSON. Received: ${JSON.stringify(storageText)}.`,
        { cause: error },
      );
    }

    throw error;
  }
}

export function parseProcessingComparisonForm(storageText: string): ProcessingComparisonForm {
  return readProcessingComparisonFormWithRecovery(parseProcessingComparisonStorageValue(storageText)).form;
}

export function loadProcessingComparisonFormWithRecovery(
  storageText: string | null,
  toolId: ProcessingComparisonToolId,
): ProcessingComparisonFormLoadResult {
  if (storageText === null) {
    return { form: createDefaultProcessingComparisonForm(toolId), qualityWasReset: false };
  }

  return readProcessingComparisonFormWithRecovery(parseProcessingComparisonStorageValue(storageText));
}

export function loadProcessingComparisonForm(
  storageText: string | null,
  toolId: ProcessingComparisonToolId,
): ProcessingComparisonForm {
  return loadProcessingComparisonFormWithRecovery(storageText, toolId).form;
}

export function serializeProcessingComparisonForm(form: ProcessingComparisonForm): string {
  return JSON.stringify(form);
}
