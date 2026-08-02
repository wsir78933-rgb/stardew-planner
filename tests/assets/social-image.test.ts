import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPngDimensions(pngFilePath: string) {
  const pngBytes = readFileSync(pngFilePath);

  if (!pngBytes.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`Social image must be a PNG. Received file: ${pngFilePath}.`);
  }
  if (pngBytes.subarray(12, 16).toString("ascii") !== "IHDR") {
    throw new Error(`Social image PNG must begin with IHDR. Received file: ${pngFilePath}.`);
  }

  return {
    width: pngBytes.readUInt32BE(16),
    height: pngBytes.readUInt32BE(20),
  };
}

test("delivers the approved 1200 by 630 social image", () => {
  const pngFilePath = resolve(
    process.cwd(),
    "public/social-images/stardew-valley-farm-planner.png",
  );
  const dimensions = readPngDimensions(pngFilePath);

  expect(
    dimensions,
    `Expected ${pngFilePath} to be 1200x630; received ${dimensions.width}x${dimensions.height}.`,
  ).toEqual({ width: 1200, height: 630 });
});
