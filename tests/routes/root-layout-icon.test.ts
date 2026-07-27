import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("root layout icon", () => {
  it("references the locally owned pumpkin ICO tab icon in both locale root layouts", async () => {
    const rootLayoutPaths = [
      ["app", "(en)", "layout.tsx"],
      ["app", "zh", "layout.tsx"],
    ] as const;

    for (const rootLayoutPath of rootLayoutPaths) {
      const rootLayoutSource = await readFile(
        join(process.cwd(), ...rootLayoutPath),
        "utf8",
      );

      expect(rootLayoutSource).toContain('icon: "/favicon.ico"');
    }
  });
});
