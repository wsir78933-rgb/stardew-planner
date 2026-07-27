import {
  validateBuildingPaintColors,
  type BuildingPaintColors,
} from "./building-paint";

export type ApplyBuildingPaintToPixelsInput = Readonly<{
  buildingPixels: Uint8ClampedArray;
  maskPixels: Uint8ClampedArray;
  paintColors: BuildingPaintColors;
}>;

export function applyBuildingPaintToPixels(
  applyBuildingPaintToPixelsInput: ApplyBuildingPaintToPixelsInput,
): Uint8ClampedArray {
  assertPixelArray(applyBuildingPaintToPixelsInput.buildingPixels, "buildingPixels");
  assertPixelArray(applyBuildingPaintToPixelsInput.maskPixels, "maskPixels");

  if (
    applyBuildingPaintToPixelsInput.buildingPixels.length !==
    applyBuildingPaintToPixelsInput.maskPixels.length
  ) {
    throw new Error(
      `Building paint buildingPixels and maskPixels must have the same length; received ${String(applyBuildingPaintToPixelsInput.buildingPixels.length)} and ${String(applyBuildingPaintToPixelsInput.maskPixels.length)}.`,
    );
  }

  const paintColors = validateBuildingPaintColors(
    applyBuildingPaintToPixelsInput.paintColors,
  );
  const paintColorAdjustments = [
    getPaintColorAdjustment(paintColors.color1),
    getPaintColorAdjustment(paintColors.color2),
    getPaintColorAdjustment(paintColors.color3),
  ] as const;
  const paintedPixels = new Uint8ClampedArray(
    applyBuildingPaintToPixelsInput.buildingPixels,
  );

  for (let pixelOffset = 0; pixelOffset < paintedPixels.length; pixelOffset += 4) {
    const redMaskStrength =
      applyBuildingPaintToPixelsInput.maskPixels[pixelOffset] ?? 0;
    const greenMaskStrength =
      applyBuildingPaintToPixelsInput.maskPixels[pixelOffset + 1] ?? 0;
    const blueMaskStrength =
      applyBuildingPaintToPixelsInput.maskPixels[pixelOffset + 2] ?? 0;
    const maskAlpha = applyBuildingPaintToPixelsInput.maskPixels[pixelOffset + 3] ?? 0;

    if (maskAlpha === 0) {
      continue;
    }

    const paintColorAdjustment = getPaintColorAdjustmentForMaskPixel(
      redMaskStrength,
      greenMaskStrength,
      blueMaskStrength,
      paintColorAdjustments,
    );

    if (paintColorAdjustment === null) {
      continue;
    }

    const paintedPixelColor = applyPaintColorAdjustment(
      paintedPixels[pixelOffset] ?? 0,
      paintedPixels[pixelOffset + 1] ?? 0,
      paintedPixels[pixelOffset + 2] ?? 0,
      paintColorAdjustment,
    );
    paintedPixels[pixelOffset] = paintedPixelColor.red;
    paintedPixels[pixelOffset + 1] = paintedPixelColor.green;
    paintedPixels[pixelOffset + 2] = paintedPixelColor.blue;
  }

  return paintedPixels;
}

type RgbColor = Readonly<{
  blue: number;
  green: number;
  red: number;
}>;

type HslColor = Readonly<{
  hue: number;
  lightness: number;
  saturation: number;
}>;

type PaintColorAdjustment = Readonly<{
  hue: number;
  lightnessDelta: number;
  saturation: number;
}> | null;

function assertPixelArray(pixelArray: unknown, fieldName: string): asserts pixelArray is Uint8ClampedArray {
  if (!(pixelArray instanceof Uint8ClampedArray)) {
    throw new TypeError(
      `Building paint ${fieldName} must be a Uint8ClampedArray; received ${describeValue(pixelArray)}.`,
    );
  }

  if (pixelArray.length % 4 !== 0) {
    throw new Error(
      `Building paint ${fieldName} length must be divisible by four; received ${String(pixelArray.length)}.`,
    );
  }
}

function parseHexPaintColor(paintColor: string): RgbColor {
  return {
    red: Number.parseInt(paintColor.slice(1, 3), 16),
    green: Number.parseInt(paintColor.slice(3, 5), 16),
    blue: Number.parseInt(paintColor.slice(5, 7), 16),
  };
}

function getPaintColorAdjustment(paintColor: string): PaintColorAdjustment {
  if (paintColor === "#ffffff") {
    return null;
  }

  const hslPaintColor = convertRgbToHsl(parseHexPaintColor(paintColor));

  return {
    hue: hslPaintColor.hue,
    saturation: hslPaintColor.saturation,
    lightnessDelta: hslPaintColor.lightness - 0.5,
  };
}

function getPaintColorAdjustmentForMaskPixel(
  redMaskStrength: number,
  greenMaskStrength: number,
  blueMaskStrength: number,
  paintColorAdjustments: readonly [
    PaintColorAdjustment,
    PaintColorAdjustment,
    PaintColorAdjustment,
  ],
): PaintColorAdjustment {
  if (
    redMaskStrength === 255 &&
    greenMaskStrength === 0 &&
    blueMaskStrength === 0
  ) {
    return paintColorAdjustments[0];
  }

  if (
    redMaskStrength === 0 &&
    greenMaskStrength === 255 &&
    blueMaskStrength === 0
  ) {
    return paintColorAdjustments[1];
  }

  if (
    redMaskStrength === 0 &&
    greenMaskStrength === 0 &&
    blueMaskStrength === 255
  ) {
    return paintColorAdjustments[2];
  }

  return null;
}

function applyPaintColorAdjustment(
  red: number,
  green: number,
  blue: number,
  paintColorAdjustment: Exclude<PaintColorAdjustment, null>,
): RgbColor {
  const originalHslColor = convertRgbToHsl({ red, green, blue });

  return convertHslToRgb({
    hue: paintColorAdjustment.hue,
    saturation: paintColorAdjustment.saturation,
    lightness: clampUnitInterval(
      originalHslColor.lightness + paintColorAdjustment.lightnessDelta,
    ),
  });
}

function convertRgbToHsl(rgbColor: RgbColor): HslColor {
  const red = rgbColor.red / 255;
  const green = rgbColor.green / 255;
  const blue = rgbColor.blue / 255;
  const maximumChannel = Math.max(red, green, blue);
  const minimumChannel = Math.min(red, green, blue);
  const chroma = maximumChannel - minimumChannel;
  const lightness = (maximumChannel + minimumChannel) / 2;

  if (Math.abs(chroma) < 0.00001) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation =
    lightness <= 0.5
      ? chroma / (maximumChannel + minimumChannel)
      : chroma / (2 - maximumChannel - minimumChannel);
  const hueBase =
    maximumChannel === red
      ? (green - blue) / chroma
      : maximumChannel === green
        ? 2 + (blue - red) / chroma
        : 4 + (red - green) / chroma;

  return {
    hue: ((hueBase * 60) + 360) % 360,
    saturation,
    lightness,
  };
}

function convertHslToRgb(hslColor: HslColor): RgbColor {
  if (hslColor.saturation === 0) {
    const grayscaleChannel = Math.round(hslColor.lightness * 255);
    return {
      red: grayscaleChannel,
      green: grayscaleChannel,
      blue: grayscaleChannel,
    };
  }

  const maximumLight =
    hslColor.lightness <= 0.5
      ? hslColor.lightness * (1 + hslColor.saturation)
      : hslColor.lightness + hslColor.saturation - hslColor.lightness * hslColor.saturation;
  const minimumLight = 2 * hslColor.lightness - maximumLight;

  return {
    red: Math.floor(getHueChannel(minimumLight, maximumLight, hslColor.hue + 120) * 255),
    green: Math.floor(getHueChannel(minimumLight, maximumLight, hslColor.hue) * 255),
    blue: Math.floor(getHueChannel(minimumLight, maximumLight, hslColor.hue - 120) * 255),
  };
}

function getHueChannel(minimumLight: number, maximumLight: number, hue: number): number {
  const normalizedHue = ((hue % 360) + 360) % 360;

  if (normalizedHue < 60) {
    return minimumLight + ((maximumLight - minimumLight) * normalizedHue) / 60;
  }

  if (normalizedHue < 180) {
    return maximumLight;
  }

  if (normalizedHue < 240) {
    return minimumLight + ((maximumLight - minimumLight) * (240 - normalizedHue)) / 60;
  }

  return minimumLight;
}

function clampUnitInterval(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
