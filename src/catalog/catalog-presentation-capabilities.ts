import type {
  CatalogItem,
  CatalogPresentationCapabilities,
  CatalogPresentationChoice,
  CatalogPresentationVariant,
} from "./catalog-types";

const unsupportedCatalogPresentationCapabilities = {
  canFlip: false,
  rotation: null,
  variantCycle: null,
  visibleVariants: [],
} as const satisfies CatalogPresentationCapabilities;

export function createDefaultCatalogItemPresentationChoice(
  catalogItem: CatalogItem,
): CatalogPresentationChoice {
  return createDefaultCatalogPresentationChoice(
    catalogItem.id,
    catalogItem.presentationCapabilities ??
      unsupportedCatalogPresentationCapabilities,
  );
}

export function validateCatalogItemPresentationChoice(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  return validateCatalogPresentationChoice(
    catalogItem.id,
    catalogItem.presentationCapabilities ??
      unsupportedCatalogPresentationCapabilities,
    presentationChoice,
  );
}

export function createDefaultCatalogPresentationChoice(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
): CatalogPresentationChoice {
  validateCatalogPresentationCapabilities(itemId, presentationCapabilities);
  return { flipped: false, rotation: 0, variant: 0 };
}

export function validateCatalogPresentationChoice(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  const validatedCapabilities = validateCatalogPresentationCapabilities(
    itemId,
    presentationCapabilities,
  );
  if (typeof presentationChoice !== "object" || presentationChoice === null) {
    throw new TypeError(
      `Catalog presentation choice for item ID ${JSON.stringify(itemId)} must be an object; received ${describeValue(presentationChoice)}.`,
    );
  }
  if (typeof presentationChoice.flipped !== "boolean") {
    throw new TypeError(
      `Catalog presentation choice flipped value for item ID ${JSON.stringify(itemId)} must be a boolean; received ${describeValue(presentationChoice.flipped)}.`,
    );
  }
  if (!validatedCapabilities.canFlip && presentationChoice.flipped) {
    throw new RangeError(
      `Catalog presentation choice flipped value for item ID ${JSON.stringify(itemId)} is unsupported; received ${describeValue(presentationChoice.flipped)}.`,
    );
  }
  assertChoiceIndex(
    itemId,
    "rotation",
    presentationChoice.rotation,
    validatedCapabilities.rotation?.count ?? 1,
  );
  assertChoiceIndex(
    itemId,
    "variant",
    presentationChoice.variant,
    validatedCapabilities.variantCycle?.count ?? 1,
  );
  return presentationChoice;
}

export function getNextPendingCatalogPresentationChoice(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  const validatedChoice = validateCatalogPresentationChoice(
    itemId,
    presentationCapabilities,
    presentationChoice,
  );
  const rotationCount = presentationCapabilities.rotation?.count ?? 1;
  if (rotationCount > 1) {
    return {
      ...validatedChoice,
      rotation: (validatedChoice.rotation + 1) % rotationCount,
    };
  }
  return getNextVariantChoice(presentationCapabilities, validatedChoice);
}

export function getNextSelectedCatalogPresentationChoice(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  const validatedChoice = validateCatalogPresentationChoice(
    itemId,
    presentationCapabilities,
    presentationChoice,
  );
  if (presentationCapabilities.variantCycle !== null) {
    return getNextVariantChoice(presentationCapabilities, validatedChoice);
  }
  const rotationCount = presentationCapabilities.rotation?.count ?? 1;
  if (rotationCount > 1) {
    return {
      ...validatedChoice,
      rotation: (validatedChoice.rotation + 1) % rotationCount,
    };
  }
  return validatedChoice;
}

export function validateCatalogPresentationCapabilities(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
): CatalogPresentationCapabilities {
  assertItemId(itemId);
  if (typeof presentationCapabilities !== "object" || presentationCapabilities === null) {
    throw new TypeError(
      `Catalog presentation capabilities for item ID ${JSON.stringify(itemId)} must be an object; received ${describeValue(presentationCapabilities)}.`,
    );
  }
  if (typeof presentationCapabilities.canFlip !== "boolean") {
    throw new TypeError(
      `Catalog presentation canFlip value for item ID ${JSON.stringify(itemId)} must be a boolean; received ${describeValue(presentationCapabilities.canFlip)}.`,
    );
  }
  validateRotationCapability(itemId, presentationCapabilities.rotation);
  validateVariantCycleCapability(itemId, presentationCapabilities.variantCycle);
  validateVisibleVariants(itemId, presentationCapabilities);
  return presentationCapabilities;
}

function getNextVariantChoice(
  presentationCapabilities: CatalogPresentationCapabilities,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  const variantCount = presentationCapabilities.variantCycle?.count ?? 1;
  if (variantCount === 1) {
    return presentationChoice;
  }
  return {
    ...presentationChoice,
    rotation: 0,
    variant: (presentationChoice.variant + 1) % variantCount,
  };
}

function validateRotationCapability(
  itemId: string,
  rotationCapability: CatalogPresentationCapabilities["rotation"],
): void {
  if (rotationCapability === null) return;
  if (
    typeof rotationCapability !== "object" ||
    !Number.isInteger(rotationCapability.count) ||
    rotationCapability.count < 1 ||
    !Array.isArray(rotationCapability.footprints) ||
    rotationCapability.footprints.length !== rotationCapability.count
  ) {
    throw new TypeError(
      `Catalog rotation capability for item ID ${JSON.stringify(itemId)} is invalid; received ${describeValue(rotationCapability)}.`,
    );
  }
  for (const footprint of rotationCapability.footprints) {
    if (
      typeof footprint !== "object" || footprint === null ||
      !Number.isInteger(footprint.width) || footprint.width < 1 ||
      !Number.isInteger(footprint.height) || footprint.height < 1
    ) {
      throw new TypeError(
        `Catalog rotation footprint for item ID ${JSON.stringify(itemId)} must have positive integer width and height; received ${describeValue(footprint)}.`,
      );
    }
  }
}

function validateVariantCycleCapability(
  itemId: string,
  variantCycleCapability: CatalogPresentationCapabilities["variantCycle"],
): void {
  if (variantCycleCapability === null) return;
  if (
    typeof variantCycleCapability !== "object" ||
    !Number.isInteger(variantCycleCapability.count) ||
    variantCycleCapability.count < 2 ||
    (variantCycleCapability.family !== "tree" &&
      variantCycleCapability.family !== "generic")
  ) {
    throw new TypeError(
      `Catalog variant-cycle capability for item ID ${JSON.stringify(itemId)} is invalid; received ${describeValue(variantCycleCapability)}.`,
    );
  }
}

function validateVisibleVariants(
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
): void {
  if (!Array.isArray(presentationCapabilities.visibleVariants)) {
    throw new TypeError(
      `Catalog visible presentation variants for item ID ${JSON.stringify(itemId)} must be an array; received ${describeValue(presentationCapabilities.visibleVariants)}.`,
    );
  }
  if (
    presentationCapabilities.variantCycle === null &&
    presentationCapabilities.visibleVariants.length > 0
  ) {
    throw new TypeError(
      `Catalog visible presentation variants for item ID ${JSON.stringify(itemId)} require a variant cycle; received ${describeValue(presentationCapabilities.visibleVariants)}.`,
    );
  }
  const variantCount = presentationCapabilities.variantCycle?.count ?? 1;
  const seenValues = new Set<number>();
  for (const variant of presentationCapabilities.visibleVariants) {
    if (
      typeof variant !== "object" || variant === null ||
      !Number.isInteger(variant.value) || variant.value < 0 || variant.value >= variantCount ||
      typeof variant.label !== "string" || variant.label.length === 0 ||
      variant.renderDescriptor?.kind !== "variant-index" ||
      variant.renderDescriptor.variant !== variant.value || seenValues.has(variant.value)
    ) {
      throw new TypeError(
        `Catalog presentation variant for item ID ${JSON.stringify(itemId)} is invalid; received ${describeValue(variant)}.`,
      );
    }
    seenValues.add(variant.value);
  }
}

function assertChoiceIndex(
  itemId: string,
  choiceFieldName: "rotation" | "variant",
  choiceValue: unknown,
  exclusiveMaximum: number,
): void {
  if (!Number.isInteger(choiceValue) || (choiceValue as number) < 0 || (choiceValue as number) >= exclusiveMaximum) {
    throw new RangeError(
      `Catalog presentation choice ${choiceFieldName} value for item ID ${JSON.stringify(itemId)} must be an integer from 0 to ${String(exclusiveMaximum - 1)}; received ${describeValue(choiceValue)}.`,
    );
  }
}

function assertItemId(itemId: unknown): asserts itemId is string {
  if (typeof itemId !== "string" || itemId.length === 0) {
    throw new TypeError(
      `Catalog presentation item ID must be a non-empty string; received ${describeValue(itemId)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
