import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("root layout icon", () => {
  it("references the locally owned PNG tab icon in both locale root layouts", async () => {
    const rootLayoutPaths = [
      ["app", "(en)", "layout.tsx"],
      ["app", "zh", "layout.tsx"],
    ] as const;

    for (const rootLayoutPath of rootLayoutPaths) {
      const rootLayoutSource = await readFile(
        join(process.cwd(), ...rootLayoutPath),
        "utf8",
      );

      expect(rootLayoutSource).toContain('icon: "/favicon.png"');
    }
  });

  it("keeps the local PNG tab icon in the public export assets", () => {
    expect(existsSync(join(process.cwd(), "public", "favicon.png"))).toBe(true);
  });
});
