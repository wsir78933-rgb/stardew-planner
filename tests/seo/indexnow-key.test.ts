import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  indexNowKey,
  indexNowKeyLocation,
} from "../../src/seo/indexnow-key";

function readHostedIndexNowKey(key: string): string {
  const hostedKeyPath = join(process.cwd(), "public", `${key}.txt`);
  return readFileSync(hostedKeyPath, "utf8");
}

describe("IndexNow key file", () => {
  it("serves the same key as the module and locates that key on the public site", () => {
    const hostedKeyText = readHostedIndexNowKey(indexNowKey);

    expect(
      hostedKeyText.trim(),
      `Hosted key text did not match indexNowKey. Received hosted text: ${JSON.stringify(hostedKeyText)}. Received indexNowKey: ${JSON.stringify(indexNowKey)}.`,
    ).toBe(indexNowKey);
    expect(
      indexNowKeyLocation,
      `IndexNow key location did not use the key. Received location: ${JSON.stringify(indexNowKeyLocation)}. Received indexNowKey: ${JSON.stringify(indexNowKey)}.`,
    ).toBe(`https://stardewvalleyplanner.art/${indexNowKey}.txt`);
  });
});
