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

describe("static reference-runtime routes", () => {
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
    "exports every retained route without an eager reference-runtime bootstrap",
    () => {
      runStaticBuild();

      for (const staticPageFile of expectedStaticPageFiles) {
        const staticPageHtml = readStaticPageHtml(staticPageFile);

        expect(staticPageHtml).not.toContain('id="reference-runtime-root"');
        expect(staticPageHtml).not.toContain(
          'src="/reference-runtime/bootstrap.mjs"',
        );
      }
    },
    30_000,
  );
});
