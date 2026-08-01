import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("root layout icons", () => {
  it("references the locally owned pumpkin ICO tab icon from both locale root layouts", async () => {
    const rootLayoutPaths = [
      join(process.cwd(), "app", "(en)", "layout.tsx"),
      join(process.cwd(), "app", "zh", "layout.tsx"),
    ];

    for (const rootLayoutPath of rootLayoutPaths) {
      const rootLayoutSource = await readFile(rootLayoutPath, "utf8");

      expect(rootLayoutSource).toContain(
        'icon: "/favicon.ico"',
      );
    }
  });
});
