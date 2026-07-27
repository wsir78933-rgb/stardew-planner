import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createReferenceRuntimeSourceAsset } from "../../src/reference-runtime/reference-runtime-source-asset";
import { collectReferenceRuntimeModulePaths } from "../../src/reference-runtime/reference-runtime-snapshot";

describe("reference runtime snapshot", () => {
  it("discovers only immutable JavaScript and CSS imports below the fixed source roots", () => {
    expect(
      collectReferenceRuntimeModulePaths(
        "import '../chunks/runtime.js'; import '../assets/page.css';",
        "_app/immutable/entry/app.DTzIUNnu.js",
      ),
    ).toEqual([
      "_app/immutable/chunks/runtime.js",
      "_app/immutable/assets/page.css",
    ]);
  });

  it("rejects a module import that escapes the immutable runtime directory", () => {
    expect(() =>
      collectReferenceRuntimeModulePaths(
        "import '../../secret.js';",
        "_app/immutable/entry/app.js",
      ),
    ).toThrow(
      'Reference runtime module path must stay below "_app/immutable/". Received import path: "../../secret.js".',
    );
  });

  it("preserves percent-encoded spaces while deriving the public game asset path", () => {
    expect(
      createReferenceRuntimeSourceAsset(
        "https://assets.stardewplan.com/assets/1.6.15/tilesheets/Farm%20Obelisk.png",
      ),
    ).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/tilesheets/Farm%20Obelisk.png",
      publicOutputPath: "assets/tilesheets/Farm Obelisk.png",
      mediaType: "image/png",
    });
  });

  it("rejects a runtime import with a query string instead of silently skipping it", () => {
    expect(() =>
      collectReferenceRuntimeModulePaths(
        "import '../chunks/runtime.js?cache=1';",
        "_app/immutable/entry/app.DTzIUNnu.js",
      ),
    ).toThrow(
      'Reference runtime source URL cannot contain a query string. Received: "https://stardewplan.com/_app/immutable/chunks/runtime.js?cache=1".',
    );
  });

  it("discovers a stylesheet path from the SvelteKit entry manifest", () => {
    expect(
      collectReferenceRuntimeModulePaths(
        'const routeAssets = ["../assets/page.css"];',
        "_app/immutable/entry/app.DTzIUNnu.js",
      ),
    ).toEqual(["_app/immutable/assets/page.css"]);
  });

  it("maps assets-server game sources to the runtime's local assets root", () => {
    expect(
      createReferenceRuntimeSourceAsset(
        "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      ).publicOutputPath,
    ).toBe("assets/maps/Farm.tmx");
    expect(
      createReferenceRuntimeSourceAsset(
        "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
      ).publicOutputPath,
    ).toBe("assets/data/Crops.json");
    expect(
      createReferenceRuntimeSourceAsset(
        "https://assets.stardewplan.com/assets/1.6.15/tilesheets/paths.png",
      ).publicOutputPath,
    ).toBe("assets/tilesheets/paths.png");
    expect(
      createReferenceRuntimeSourceAsset(
        "https://stardewplan.com/assets/ui/cursor-default.png",
      ).publicOutputPath,
    ).toBe("assets/ui/cursor-default.png");
  });

  it("publishes the locked game map, data, and tilesheet at runtime-resolvable paths", async () => {
    const referenceRuntimeLockPath = path.join(
      process.cwd(),
      "public/reference-runtime/reference-runtime-lock.json",
    );
    const referenceRuntimeLock = JSON.parse(
      await readFile(referenceRuntimeLockPath, "utf8"),
    ) as {
      assets: Array<{ sourceUrl: string; publicOutputPath: string }>;
    };
    const expectedRuntimeAssets = [
      {
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
        publicOutputPath: "assets/maps/Farm.tmx",
      },
      {
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
        publicOutputPath: "assets/data/Crops.json",
      },
      {
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/tilesheets/paths.png",
        publicOutputPath: "assets/tilesheets/paths.png",
      },
    ];

    for (const expectedRuntimeAsset of expectedRuntimeAssets) {
      expect(referenceRuntimeLock.assets).toContainEqual(
        expect.objectContaining(expectedRuntimeAsset),
      );
      await expect(
        access(path.join(process.cwd(), "public", expectedRuntimeAsset.publicOutputPath)),
      ).resolves.toBeUndefined();
    }
  });
});
