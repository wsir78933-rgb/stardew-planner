import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import {
  generateStaticParams,
  officialFarmTypes,
} from "../../app/farm/[type]/page";

const expectedOfficialFarmTypes = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

const expectedStaticPageFiles = [
  "index.html",
  "farm-comparison.html",
  "farm/standard.html",
  "farm/riverland.html",
  "farm/forest.html",
  "farm/hilltop.html",
  "farm/wilderness.html",
  "farm/four-corners.html",
  "farm/beach.html",
  "farm/meadowlands.html",
  "mods.html",
  "privacy.html",
  "terms.html",
] as const;

function runStaticBuild(): void {
  const buildProcess = spawnSync("pnpm", ["build"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });

  if (buildProcess.status !== 0) {
    throw new Error(
      `Static build failed. Exit code: ${String(buildProcess.status)}. Stderr: ${buildProcess.stderr}. Stdout: ${buildProcess.stdout}`,
    );
  }
}

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected static page file does not exist: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

function getScriptAttributeValue(
  scriptTag: string,
  attributeName: string,
): string | null {
  const attributePattern = new RegExp(
    `(?:^|\\s)${attributeName}=["']([^"']*)["']`,
    "i",
  );
  const attributeMatch = scriptTag.match(attributePattern);

  return attributeMatch?.[1] ?? null;
}

function countBootstrapExecutionScripts(staticPageHtml: string): number {
  return [...staticPageHtml.matchAll(/<script\b[^>]*>/gi)].filter(
    (scriptTagMatch) =>
      getScriptAttributeValue(scriptTagMatch[0], "type") === "module" &&
      getScriptAttributeValue(scriptTagMatch[0], "src") ===
        "/reference-runtime/bootstrap.mjs",
  ).length;
}

describe("static reference-runtime routes", () => {
  it("does not count data attributes as the native bootstrap script attributes", () => {
    const staticPageHtml =
      '<script data-type="module" data-src="/reference-runtime/bootstrap.mjs"></script>';

    expect(countBootstrapExecutionScripts(staticPageHtml)).toBe(0);
  });

  it("exports static files without image optimization", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.images?.unoptimized).toBe(true);
  });

  it("generates exactly the eight official farm guide paths", () => {
    expect(officialFarmTypes).toEqual(expectedOfficialFarmTypes);
    expect(generateStaticParams()).toEqual(
      expectedOfficialFarmTypes.map((type) => ({ type })),
    );
  });

  it(
    "exports every retained route with one native reference-runtime bootstrap",
    () => {
      runStaticBuild();

      for (const staticPageFile of expectedStaticPageFiles) {
        const staticPageHtml = readStaticPageHtml(staticPageFile);

        expect(staticPageHtml.match(/id="reference-runtime-root"/g)).toHaveLength(1);
        expect(countBootstrapExecutionScripts(staticPageHtml)).toBe(1);
      }
    },
    30_000,
  );
});
