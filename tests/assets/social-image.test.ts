import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

function readWebpDimensions(webpFilePath: string) {
  const webpBytes = readFileSync(webpFilePath);

  if (webpBytes.length < 30) {
    throw new Error(
      `Social image WebP header is truncated at ${webpFilePath}. Received ${webpBytes.length} bytes.`,
    );
  }
  if (
    webpBytes.subarray(0, 4).toString("ascii") !== "RIFF" ||
    webpBytes.subarray(8, 12).toString("ascii") !== "WEBP" ||
    webpBytes.subarray(12, 16).toString("ascii") !== "VP8 " ||
    webpBytes.subarray(23, 26).toString("hex") !== "9d012a"
  ) {
    throw new Error(
      `Social image must be a VP8 WebP at ${webpFilePath}. Received header: ${webpBytes.subarray(0, 30).toString("hex")}.`,
    );
  }

  return {
    width: webpBytes.readUInt16LE(26) & 0x3fff,
    height: webpBytes.readUInt16LE(28) & 0x3fff,
  };
}

test("delivers the approved 1200 by 630 WebP social image", () => {
  const webpFilePath = resolve(
    process.cwd(),
    "public/social-images/stardew-valley-farm-planner.webp",
  );
  const dimensions = readWebpDimensions(webpFilePath);

  expect(
    dimensions,
    `Expected ${webpFilePath} to be 1200x630; received ${dimensions.width}x${dimensions.height}.`,
  ).toEqual({ width: 1200, height: 630 });
});
