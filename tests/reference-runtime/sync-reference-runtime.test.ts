import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import * as referenceRuntimeSynchronizer from "../../src/reference-runtime/sync-reference-runtime";

const remoteGameAssetBase = "https://assets.stardewplan.com/assets/1.6.15";
const frozenPlannerChunkPublicOutputPath =
  "_app/immutable/chunks/CUwsdp_r.js";
const applicationOnlyRendererGuard =
  "async function uc(x,D){if(!ve)return;";
const rendererReadyGuard =
  "async function uc(x,D){if(!ve?.renderer)return;";

type RendererReadinessTransformer = (
  sourcePublicOutputPath: string,
  sourceText: string,
) => string;

const transformPlannerRendererReadinessGuard = (
  referenceRuntimeSynchronizer as {
    transformPlannerRendererReadinessGuard?: RendererReadinessTransformer;
  }
).transformPlannerRendererReadinessGuard;

const assertStagedReferenceRuntimeJavaScriptUsesLocalAssets =
  referenceRuntimeSynchronizer.assertStagedReferenceRuntimeJavaScriptUsesLocalAssets;

async function createStagedRuntimeDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), "stardewplan-reference-runtime-"));
}

describe("reference runtime staging validation", () => {
  it("rejects a copied local runtime module that retains the remote asset base", async () => {
    const stagedRuntimeDirectory = await createStagedRuntimeDirectory();

    try {
      const copiedRuntimeModuleDirectory = join(
        stagedRuntimeDirectory,
        "reference-runtime",
      );
      await mkdir(copiedRuntimeModuleDirectory, { recursive: true });
      await writeFile(
        join(copiedRuntimeModuleDirectory, "bootstrap.mjs"),
        `const assetBase = "${remoteGameAssetBase}";`,
        "utf8",
      );

      await expect(
        assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(
          stagedRuntimeDirectory,
        ),
      ).rejects.toThrow(
        'Reference runtime staged JavaScript must not contain the remote asset base. Received staged path: "reference-runtime/bootstrap.mjs". Remote asset base: "https://assets.stardewplan.com/assets/1.6.15".',
      );
    } finally {
      await rm(stagedRuntimeDirectory, { force: true, recursive: true });
    }
  });

  it.each([
    "reference-runtime/nested/runtime-loader.js",
    "reference-runtime/nested/runtime-loader.mjs",
  ])(
    "rejects the remote asset base in a deeply staged %s module",
    async (deepStagedJavaScriptRelativePath) => {
      const stagedRuntimeDirectory = await createStagedRuntimeDirectory();

      try {
        const deepStagedJavaScriptPath = join(
          stagedRuntimeDirectory,
          deepStagedJavaScriptRelativePath,
        );
        await mkdir(dirname(deepStagedJavaScriptPath), { recursive: true });
        await writeFile(
          deepStagedJavaScriptPath,
          `const assetBase = "${remoteGameAssetBase}";`,
          "utf8",
        );

        await expect(
          assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(
            stagedRuntimeDirectory,
          ),
        ).rejects.toThrow(
          `Reference runtime staged JavaScript must not contain the remote asset base. Received staged path: "${deepStagedJavaScriptRelativePath}". Remote asset base: "https://assets.stardewplan.com/assets/1.6.15".`,
        );
      } finally {
        await rm(stagedRuntimeDirectory, { force: true, recursive: true });
      }
    },
  );

  it("rejects a symbolic link in the staged runtime tree", async () => {
    const stagedRuntimeDirectory = await createStagedRuntimeDirectory();

    try {
      const stagedRuntimeModuleDirectory = join(
        stagedRuntimeDirectory,
        "reference-runtime",
      );
      const targetModulePath = join(
        stagedRuntimeModuleDirectory,
        "target-module.mjs",
      );
      const symbolicLinkPath = join(
        stagedRuntimeModuleDirectory,
        "linked-runtime.mjs",
      );

      await mkdir(stagedRuntimeModuleDirectory, { recursive: true });
      await writeFile(targetModulePath, 'const assetBase = "/assets";', "utf8");
      await symlink(targetModulePath, symbolicLinkPath, "file");

      await expect(
        assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(
          stagedRuntimeDirectory,
        ),
      ).rejects.toThrow(
        'Reference runtime staged JavaScript enumeration only accepts regular files and directories. Received Dirent type: "symbolic link". Received staged path: "reference-runtime/linked-runtime.mjs". Received directory entry name: "linked-runtime.mjs".',
      );
    } finally {
      await rm(stagedRuntimeDirectory, { force: true, recursive: true });
    }
  });

  it("accepts staged JavaScript that only resolves local asset paths", async () => {
    const stagedRuntimeDirectory = await createStagedRuntimeDirectory();

    try {
      const frozenRuntimeModuleDirectory = join(
        stagedRuntimeDirectory,
        "_app",
        "immutable",
        "chunks",
      );
      await mkdir(frozenRuntimeModuleDirectory, { recursive: true });
      await writeFile(
        join(frozenRuntimeModuleDirectory, "planner.js"),
        'const assetBase = "/assets";',
        "utf8",
      );

      await expect(
        assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(
          stagedRuntimeDirectory,
        ),
      ).resolves.toBeUndefined();
    } finally {
      await rm(stagedRuntimeDirectory, { force: true, recursive: true });
    }
  });
});

describe("planner renderer readiness transformation", () => {
  it("replaces the premature application-only guard in the frozen planner chunk", () => {
    expect(transformPlannerRendererReadinessGuard).toBeTypeOf("function");

    if (transformPlannerRendererReadinessGuard === undefined) {
      return;
    }

    expect(
      transformPlannerRendererReadinessGuard(
        frozenPlannerChunkPublicOutputPath,
        `before ${applicationOnlyRendererGuard} after`,
      ),
    ).toBe(`before ${rendererReadyGuard} after`);
  });

  it("passes a non-target JavaScript chunk through without changing its guard", () => {
    expect(transformPlannerRendererReadinessGuard).toBeTypeOf("function");

    if (transformPlannerRendererReadinessGuard === undefined) {
      return;
    }

    expect(
      transformPlannerRendererReadinessGuard(
        "_app/immutable/chunks/other.js",
        applicationOnlyRendererGuard,
      ),
    ).toBe(applicationOnlyRendererGuard);
  });

  it("accepts an already transformed frozen planner chunk", () => {
    expect(transformPlannerRendererReadinessGuard).toBeTypeOf("function");

    if (transformPlannerRendererReadinessGuard === undefined) {
      return;
    }

    expect(
      transformPlannerRendererReadinessGuard(
        frozenPlannerChunkPublicOutputPath,
        rendererReadyGuard,
      ),
    ).toBe(rendererReadyGuard);
  });

  it.each([
    {
      name: "has no known renderer guard",
      sourceText: "unrelated source text",
      applicationOnlyGuardOccurrenceCount: 0,
      rendererReadyGuardOccurrenceCount: 0,
    },
    {
      name: "duplicates the application-only renderer guard",
      sourceText: `${applicationOnlyRendererGuard}${applicationOnlyRendererGuard}`,
      applicationOnlyGuardOccurrenceCount: 2,
      rendererReadyGuardOccurrenceCount: 0,
    },
    {
      name: "duplicates the renderer-ready guard",
      sourceText: `${rendererReadyGuard}${rendererReadyGuard}`,
      applicationOnlyGuardOccurrenceCount: 0,
      rendererReadyGuardOccurrenceCount: 2,
    },
    {
      name: "mixes the application-only and renderer-ready guards",
      sourceText: `${applicationOnlyRendererGuard}${rendererReadyGuard}`,
      applicationOnlyGuardOccurrenceCount: 1,
      rendererReadyGuardOccurrenceCount: 1,
    },
  ])(
    "fails fast when the frozen planner chunk $name",
    ({
      sourceText,
      applicationOnlyGuardOccurrenceCount,
      rendererReadyGuardOccurrenceCount,
    }) => {
      expect(transformPlannerRendererReadinessGuard).toBeTypeOf("function");

      if (transformPlannerRendererReadinessGuard === undefined) {
        return;
      }

      expect(() =>
        transformPlannerRendererReadinessGuard(
          frozenPlannerChunkPublicOutputPath,
          sourceText,
        ),
      ).toThrow(
        `Received public output path: ${JSON.stringify(frozenPlannerChunkPublicOutputPath)}. Application-only guard occurrence count: ${applicationOnlyGuardOccurrenceCount}. Renderer-ready guard occurrence count: ${rendererReadyGuardOccurrenceCount}.`,
      );
    },
  );
});
