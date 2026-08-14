import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const projectRootPath = process.cwd();
const publicDirectoryPath = resolve(projectRootPath, "public");
const referenceRuntimeDirectoryPath = resolve(
  publicDirectoryPath,
  "reference-runtime",
);
const removedFrozenRuntimeRelativePaths = [
  "_app",
  "reference-runtime/bootstrap.mjs",
  "reference-runtime/local-only-overrides.css",
  "reference-runtime/public-link-navigation-guard.mjs",
  "reference-runtime/reference-runtime-lock.json",
  "reference-runtime/wheel-zoom-mode-toggle.mjs",
] as const;

test("ships only the React local-project compatibility API from the reference runtime directory", () => {
  for (const removedFrozenRuntimeRelativePath of removedFrozenRuntimeRelativePaths) {
    expect(
      existsSync(resolve(publicDirectoryPath, removedFrozenRuntimeRelativePath)),
      `Expected frozen runtime path to be absent: ${removedFrozenRuntimeRelativePath}`,
    ).toBe(false);
  }

  expect(readdirSync(referenceRuntimeDirectoryPath).sort()).toEqual([
    "local-project-api.mjs",
  ]);
  expect(existsSync(resolve(publicDirectoryPath, "assets"))).toBe(true);
  expect(existsSync(resolve(publicDirectoryPath, "game-assets"))).toBe(true);
});
