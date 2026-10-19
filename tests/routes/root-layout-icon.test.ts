import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("root layout icons", () => {
  it("references the locally owned pumpkin ICO tab icon from each locale root layout", async () => {
    const rootLayoutPaths = [
      join(process.cwd(), "app", "(en)", "layout.tsx"),
      join(process.cwd(), "app", "zh", "layout.tsx"),
      join(process.cwd(), "app", "ja", "layout.tsx"),
    ];

    for (const rootLayoutPath of rootLayoutPaths) {
      const rootLayoutSource = await readFile(rootLayoutPath, "utf8");

      expect(rootLayoutSource).toContain(
        'icon: "/favicon.ico"',
      );
    }
  });

  it("sets the Japanese root layout language to ja", async () => {
    const japaneseLayoutSource = await readFile(
      join(process.cwd(), "app", "ja", "layout.tsx"),
      "utf8",
    );

    expect(japaneseLayoutSource).toContain('<html lang="ja">');
  });
});
