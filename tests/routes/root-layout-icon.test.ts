import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("root layout icon", () => {
  it("references the locally owned pumpkin ICO tab icon", async () => {
    const rootLayoutSource = await readFile(
      join(process.cwd(), "app", "layout.tsx"),
      "utf8",
    );

    expect(rootLayoutSource).toContain(
      'icon: "/favicon.ico"',
    );
  });
});
