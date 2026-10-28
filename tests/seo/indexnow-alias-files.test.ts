import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { indexNowKey } from "../../src/seo/indexnow-key";

const indexNowAliasPaths = [
  join(process.cwd(), "public", "indexnow.txt"),
  join(process.cwd(), "public", ".well-known", "indexnow"),
] as const;

function readIndexNowAliasFile(aliasPath: string): string {
  return readFileSync(aliasPath, "utf8");
}

describe("IndexNow alias files", () => {
  it.each(indexNowAliasPaths)(
    "trims %s to the exported indexNowKey",
    (aliasPath) => {
      const aliasText = readIndexNowAliasFile(aliasPath);

      expect(
        aliasText.trim(),
        `IndexNow alias file did not match indexNowKey. Received text: ${JSON.stringify(aliasText)}. Received indexNowKey: ${JSON.stringify(indexNowKey)}. Path: ${JSON.stringify(aliasPath)}.`,
      ).toBe(indexNowKey);
    },
  );
});
