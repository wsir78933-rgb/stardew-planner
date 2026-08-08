import type { CatalogFurnitureCompositeSprite } from "./catalog-types";

export type FurnitureCompositeRandomFractionSource = () => number;

export function createRandomFurnitureCompositeVariant(
  compositeSprite: CatalogFurnitureCompositeSprite,
  randomFractionSource: FurnitureCompositeRandomFractionSource,
): number {
  assertFurnitureCompositeSprite(compositeSprite);

  if (typeof randomFractionSource !== "function") {
    throw new TypeError(
      `Furniture composite random fraction source must be a function; received ${describeValue(randomFractionSource)}.`,
    );
  }

  let variant = 0;
  let layerMultiplier = 1;

  compositeSprite.layers.forEach((layer, layerIndex) => {
    const randomFraction = randomFractionSource();
    assertRandomFraction(randomFraction, layerIndex);
    const layerVariant = Math.floor(randomFraction * layer.count);
    variant += layerVariant * layerMultiplier;
    layerMultiplier *= layer.count;

    if (!Number.isSafeInteger(variant) || !Number.isSafeInteger(layerMultiplier)) {
      throw new RangeError(
        `Furniture composite variant must remain a safe integer after layer ${String(layerIndex)}; received variant ${describeValue(variant)} and multiplier ${describeValue(layerMultiplier)}.`,
      );
    }
  });

  return variant;
}

export function decodeFurnitureCompositeVariant(
  compositeSprite: CatalogFurnitureCompositeSprite,
  variant: number,
): readonly number[] {
  assertFurnitureCompositeSprite(compositeSprite);

  if (!Number.isSafeInteger(variant) || variant <= 0) {
    throw new RangeError(
      `Furniture composite variant must be a positive safe integer; received ${describeValue(variant)}.`,
    );
  }

  let remainingVariant = variant;

  return compositeSprite.layers.map((layer, layerIndex) => {
    if (layerIndex === compositeSprite.layers.length - 1) {
      return remainingVariant;
    }

    const layerVariant = remainingVariant % layer.count;
    remainingVariant = Math.floor(remainingVariant / layer.count);
    return layerVariant;
  });
}

export function assertFurnitureCompositeSprite(
  compositeSprite: CatalogFurnitureCompositeSprite,
): void {
  if (typeof compositeSprite !== "object" || compositeSprite === null) {
    throw new TypeError(
      `Furniture composite sprite must be a non-null object; received ${describeValue(compositeSprite)}.`,
    );
  }

  assertPositiveSafeInteger(compositeSprite.pieceSize, "pieceSize");
  assertPositiveSafeInteger(compositeSprite.columns, "columns");

  if (!Array.isArray(compositeSprite.layers) || compositeSprite.layers.length === 0) {
    throw new TypeError(
      `Furniture composite sprite layers must be a non-empty array; received ${describeValue(compositeSprite.layers)}.`,
    );
  }

  compositeSprite.layers.forEach((layer, layerIndex) => {
    if (typeof layer !== "object" || layer === null) {
      throw new TypeError(
        `Furniture composite sprite layer ${String(layerIndex)} must be a non-null object; received ${describeValue(layer)}.`,
      );
    }

    assertNonNegativeSafeInteger(
      layer.baseY,
      `layer ${String(layerIndex)} baseY`,
    );
    assertPositiveSafeInteger(
      layer.count,
      `layer ${String(layerIndex)} count`,
    );
    assertSafeInteger(
      layer.offsetY,
      `layer ${String(layerIndex)} offsetY`,
    );
  });
}

function assertRandomFraction(
  randomFraction: number,
  layerIndex: number,
): void {
  if (
    typeof randomFraction !== "number"
    || !Number.isFinite(randomFraction)
    || randomFraction < 0
    || randomFraction >= 1
  ) {
    throw new RangeError(
      `Furniture composite random fraction for layer ${String(layerIndex)} must be at least 0 and less than 1; received ${describeValue(randomFraction)}.`,
    );
  }
}

function assertPositiveSafeInteger(value: number, fieldName: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(
      `Furniture composite sprite ${fieldName} must be a positive safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertNonNegativeSafeInteger(value: number, fieldName: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(
      `Furniture composite sprite ${fieldName} must be a non-negative safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertSafeInteger(value: number, fieldName: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(
      `Furniture composite sprite ${fieldName} must be a safe integer; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
