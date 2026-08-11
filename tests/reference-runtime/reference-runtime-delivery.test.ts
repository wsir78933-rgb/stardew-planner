import { createHash } from "node:crypto";
import {
  type Dirent,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRootPath = process.cwd();
const staticExportDirectoryPath = join(projectRootPath, "out");
const referenceRuntimeDirectoryPath = join(
  staticExportDirectoryPath,
  "reference-runtime",
);
const frozenRuntimeDirectoryPath = join(staticExportDirectoryPath, "_app", "immutable");
const frozenRuntimeJavaScriptDirectoryPaths = [
  frozenRuntimeDirectoryPath,
  referenceRuntimeDirectoryPath,
] as const;
const nextStaticDirectoryPath = join(
  staticExportDirectoryPath,
  "_next",
  "static",
);
const referenceRuntimeLockPath = join(
  referenceRuntimeDirectoryPath,
  "reference-runtime-lock.json",
);
const expectedStaticPagePaths = [
  "index.html",
  "zh.html",
] as const;
const forbiddenReferenceSourceDomains = [
  "https://stardewplan.com",
  "https://assets.stardewplan.com",
] as const;
const frozenStaticRouteModulePaths = [
  "_app/immutable/nodes/4.DKY1necy.js",
  "_app/immutable/nodes/5.DBStmpKX.js",
  "_app/immutable/nodes/6.DGdBuwBD.js",
  "_app/immutable/nodes/7.CR2msXyt.js",
  "_app/immutable/nodes/8.CwO-oeWZ.js",
] as const;
const remoteReferenceAssetOrigin =
  "https://assets.stardewplan.com/assets/1.6.15";
const requiredLocalOnlyLegalCopyPhrases = [
  "There is no account or sign-in.",
  "Projects stay in this browser.",
  "JSON import and export happen only when you choose them.",
  "There is no cloud sync, share links, payments, memberships, or supporter features.",
  "You can delete local data by deleting projects or clearing this site's data in your browser.",
] as const;

type ReferenceRuntimeLockAsset = Readonly<{
  publicOutputPath: string;
  sha256: string;
}>;

function requireStaticExportFile(staticExportRelativePath: string): string {
  const staticExportFilePath = join(
    staticExportDirectoryPath,
    staticExportRelativePath,
  );

  if (!existsSync(staticExportFilePath)) {
    throw new Error(
      `Static export file is missing. Expected path: ${staticExportFilePath}. Run \"pnpm build\" before the delivery test.`,
    );
  }

  return staticExportFilePath;
}

function readStaticExportText(staticExportRelativePath: string): string {
  return readFileSync(requireStaticExportFile(staticExportRelativePath), "utf8");
}

function getHtmlAttributeValue(htmlTag: string, attributeName: string): string | null {
  const attributePattern = new RegExp(
    `\\s${attributeName}=["']([^"']*)["']`,
    "i",
  );
  const attributeMatch = htmlTag.match(attributePattern);

  return attributeMatch?.[1] ?? null;
}

function findExternalScriptOrStylesheetUrl(staticPageHtml: string): string | null {
  for (const scriptTagMatch of staticPageHtml.matchAll(/<script\b[^>]*>/gi)) {
    const scriptSource = getHtmlAttributeValue(scriptTagMatch[0], "src");

    if (scriptSource?.startsWith("http://") || scriptSource?.startsWith("https://")) {
      return scriptSource;
    }
  }

  for (const linkTagMatch of staticPageHtml.matchAll(/<link\b[^>]*>/gi)) {
    const linkTag = linkTagMatch[0];
    const linkRelation = getHtmlAttributeValue(linkTag, "rel");
    const stylesheetSource = getHtmlAttributeValue(linkTag, "href");

    if (
      linkRelation?.split(/\s+/).includes("stylesheet") &&
      (stylesheetSource?.startsWith("http://") ||
        stylesheetSource?.startsWith("https://"))
    ) {
      return stylesheetSource;
    }
  }

  return null;
}

function parseReferenceRuntimeLock(referenceRuntimeLockText: string): ReferenceRuntimeLockAsset[] {
  const parsedReferenceRuntimeLock: unknown = JSON.parse(referenceRuntimeLockText);

  if (
    typeof parsedReferenceRuntimeLock !== "object" ||
    parsedReferenceRuntimeLock === null ||
    !Array.isArray((parsedReferenceRuntimeLock as { assets?: unknown }).assets)
  ) {
    throw new Error(
      `Reference runtime lock must contain an assets array. Received: ${referenceRuntimeLockText.slice(0, 200)}.`,
    );
  }

  return (parsedReferenceRuntimeLock as { assets: unknown[] }).assets.map(
    (rawReferenceRuntimeLockAsset, assetIndex) => {
      if (
        typeof rawReferenceRuntimeLockAsset !== "object" ||
        rawReferenceRuntimeLockAsset === null
      ) {
        throw new Error(
          `Reference runtime lock asset at index ${String(assetIndex)} must be an object. Received: ${String(rawReferenceRuntimeLockAsset)}.`,
        );
      }

      const referenceRuntimeLockAsset = rawReferenceRuntimeLockAsset as {
        publicOutputPath?: unknown;
        sha256?: unknown;
      };

      if (
        typeof referenceRuntimeLockAsset.publicOutputPath !== "string" ||
        referenceRuntimeLockAsset.publicOutputPath.length === 0
      ) {
        throw new Error(
          `Reference runtime lock asset at index ${String(assetIndex)} has an invalid publicOutputPath. Received: ${String(referenceRuntimeLockAsset.publicOutputPath)}.`,
        );
      }

      if (
        typeof referenceRuntimeLockAsset.sha256 !== "string" ||
        !/^[a-f0-9]{64}$/.test(referenceRuntimeLockAsset.sha256)
      ) {
        throw new Error(
          `Reference runtime lock asset at index ${String(assetIndex)} has an invalid sha256. Received: ${String(referenceRuntimeLockAsset.sha256)}.`,
        );
      }

      return {
        publicOutputPath: referenceRuntimeLockAsset.publicOutputPath,
        sha256: referenceRuntimeLockAsset.sha256,
      };
    },
  );
}

function resolveLockedStaticExportAssetPath(publicOutputPath: string): string {
  const lockedStaticExportAssetPath = resolve(
    staticExportDirectoryPath,
    publicOutputPath,
  );
  const staticExportRelativePath = relative(
    staticExportDirectoryPath,
    lockedStaticExportAssetPath,
  );

  if (
    staticExportRelativePath.startsWith("..") ||
    staticExportRelativePath === "" ||
    staticExportRelativePath.startsWith("/")
  ) {
    throw new Error(
      `Reference runtime lock publicOutputPath escapes the static export. Received: ${publicOutputPath}.`,
    );
  }

  return lockedStaticExportAssetPath;
}

function calculateFileSha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function collectNextStaticReleaseModulePaths(directoryPath: string): string[] {
  if (!existsSync(directoryPath)) {
    throw new Error(
      `Next static release module directory is missing. Expected path: ${directoryPath}.`,
    );
  }

  const releaseModulePaths: string[] = [];

  for (const directoryEntry of readdirSync(directoryPath, { withFileTypes: true })) {
    const directoryEntryPath = join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      releaseModulePaths.push(
        ...collectNextStaticReleaseModulePaths(directoryEntryPath),
      );
      continue;
    }

    if (
      directoryEntry.isFile() &&
      (directoryEntry.name.endsWith(".js") || directoryEntry.name.endsWith(".css"))
    ) {
      releaseModulePaths.push(directoryEntryPath);
    }
  }

  return releaseModulePaths;
}

function collectFrozenRuntimeJavaScriptPaths(
  directoryPath: string,
  frozenRuntimeDirectoryPath = directoryPath,
): string[] {
  if (!existsSync(directoryPath)) {
    throw new Error(
      `Frozen runtime directory is missing. Expected path: ${directoryPath}.`,
    );
  }

  const frozenRuntimeJavaScriptPaths: string[] = [];

  for (const directoryEntry of readdirSync(directoryPath, { withFileTypes: true })) {
    const directoryEntryPath = join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      frozenRuntimeJavaScriptPaths.push(
        ...collectFrozenRuntimeJavaScriptPaths(
          directoryEntryPath,
          frozenRuntimeDirectoryPath,
        ),
      );
      continue;
    }

    if (
      directoryEntry.isFile() &&
      (directoryEntry.name.endsWith(".js") || directoryEntry.name.endsWith(".mjs"))
    ) {
      frozenRuntimeJavaScriptPaths.push(directoryEntryPath);
      continue;
    }

    if (!directoryEntry.isFile()) {
      throw new TypeError(
        `Frozen runtime JavaScript enumeration only accepts regular files and directories. Received Dirent type: ${JSON.stringify(describeUnsupportedDirentType(directoryEntry))}. Received frozen runtime path: ${JSON.stringify(relative(frozenRuntimeDirectoryPath, directoryEntryPath))}. Received directory entry name: ${JSON.stringify(directoryEntry.name)}.`,
      );
    }
  }

  return frozenRuntimeJavaScriptPaths;
}

function describeUnsupportedDirentType(directoryEntry: Dirent): string {
  if (directoryEntry.isBlockDevice()) {
    return "block device";
  }

  if (directoryEntry.isCharacterDevice()) {
    return "character device";
  }

  if (directoryEntry.isFIFO()) {
    return "FIFO";
  }

  if (directoryEntry.isSocket()) {
    return "socket";
  }

  if (directoryEntry.isSymbolicLink()) {
    return "symbolic link";
  }

  return "unknown";
}

function assertReleaseTextHasNoReferenceSourceDomains(
  releaseText: string,
  releaseFilePath: string,
): void {
  for (const forbiddenReferenceSourceDomain of forbiddenReferenceSourceDomains) {
    if (releaseText.includes(forbiddenReferenceSourceDomain)) {
      throw new Error(
        `Release file contains a forbidden reference source URL. File: ${releaseFilePath}. URL: ${forbiddenReferenceSourceDomain}.`,
      );
    }
  }
}

describe("reference runtime static delivery", () => {
  it("collects deeply frozen JavaScript modules with both supported extensions", () => {
    const temporaryFrozenRuntimeDirectory = mkdtempSync(
      join(tmpdir(), "stardewplan-frozen-runtime-delivery-"),
    );

    try {
      const deeplyNestedModuleDirectory = join(
        temporaryFrozenRuntimeDirectory,
        "nested",
        "runtime",
      );
      const deepJavaScriptModulePath = join(
        deeplyNestedModuleDirectory,
        "planner.js",
      );
      const deepModuleJavaScriptPath = join(
        deeplyNestedModuleDirectory,
        "bootstrap.mjs",
      );

      mkdirSync(deeplyNestedModuleDirectory, { recursive: true });
      writeFileSync(deepJavaScriptModulePath, "export {};", "utf8");
      writeFileSync(deepModuleJavaScriptPath, "export {};", "utf8");

      expect(
        new Set(
          collectFrozenRuntimeJavaScriptPaths(temporaryFrozenRuntimeDirectory),
        ),
      ).toEqual(new Set([deepJavaScriptModulePath, deepModuleJavaScriptPath]));
    } finally {
      rmSync(temporaryFrozenRuntimeDirectory, { force: true, recursive: true });
    }
  });

  it("rejects a symbolic link in the frozen runtime tree", () => {
    const temporaryFrozenRuntimeDirectory = mkdtempSync(
      join(tmpdir(), "stardewplan-frozen-runtime-delivery-"),
    );

    try {
      const targetModulePath = join(
        temporaryFrozenRuntimeDirectory,
        "target-module.mjs",
      );
      const symbolicLinkPath = join(
        temporaryFrozenRuntimeDirectory,
        "linked-runtime.mjs",
      );

      writeFileSync(targetModulePath, "export {};", "utf8");
      symlinkSync(targetModulePath, symbolicLinkPath, "file");

      expect(() =>
        collectFrozenRuntimeJavaScriptPaths(temporaryFrozenRuntimeDirectory),
      ).toThrow(
        'Frozen runtime JavaScript enumeration only accepts regular files and directories. Received Dirent type: "symbolic link". Received frozen runtime path: "linked-runtime.mjs". Received directory entry name: "linked-runtime.mjs".',
      );
    } finally {
      rmSync(temporaryFrozenRuntimeDirectory, { force: true, recursive: true });
    }
  });

  it("exports every retained route without an eager reference-runtime host or external script or stylesheet", () => {
    for (const staticPagePath of expectedStaticPagePaths) {
      const staticPageHtml = readStaticExportText(staticPagePath);
      const externalScriptOrStylesheetUrl = findExternalScriptOrStylesheetUrl(
        staticPageHtml,
      );

      expect(
        staticPageHtml,
        `Route ${staticPagePath} must not contain an eager reference runtime root.`,
      ).not.toContain('id="reference-runtime-root"');
      expect(
        staticPageHtml,
        `Route ${staticPagePath} must not contain an eager bootstrap module.`,
      ).not.toContain('src="/reference-runtime/bootstrap.mjs"');
      expect(staticPageHtml, `Route ${staticPagePath} must not contain an iframe.`).not.toMatch(
        /<iframe\b/i,
      );
      expect(
        externalScriptOrStylesheetUrl,
        `Route ${staticPagePath} contains an external script or stylesheet URL: ${String(externalScriptOrStylesheetUrl)}.`,
      ).toBeNull();
    }
  });

  it("exports the frozen start and app entries with the local delivery modules", () => {
    for (const staticExportRelativePath of [
      "_app/immutable/entry/start.CLoByjli.js",
      "_app/immutable/entry/app.DTzIUNnu.js",
      "reference-runtime/local-project-api.mjs",
      "reference-runtime/local-only-overrides.css",
      "reference-runtime/public-link-navigation-guard.mjs",
      "reference-runtime/wheel-zoom-mode-toggle.mjs",
      "reference-runtime/reference-runtime-lock.json",
    ]) {
      expect(existsSync(requireStaticExportFile(staticExportRelativePath))).toBe(true);
    }
  });

  it(
    "exports every locked asset at its recorded path and SHA-256",
    () => {
      const referenceRuntimeLockAssets = parseReferenceRuntimeLock(
        readFileSync(referenceRuntimeLockPath, "utf8"),
      );

      expect(referenceRuntimeLockAssets.length).toBeGreaterThan(0);

      for (const referenceRuntimeLockAsset of referenceRuntimeLockAssets) {
        const lockedStaticExportAssetPath = resolveLockedStaticExportAssetPath(
          referenceRuntimeLockAsset.publicOutputPath,
        );

        if (!existsSync(lockedStaticExportAssetPath)) {
          throw new Error(
            `Locked reference runtime asset is missing from the static export. Path: ${referenceRuntimeLockAsset.publicOutputPath}. Expected file: ${lockedStaticExportAssetPath}.`,
          );
        }

        const actualSha256 = calculateFileSha256(lockedStaticExportAssetPath);

        if (actualSha256 !== referenceRuntimeLockAsset.sha256) {
          throw new Error(
            `Locked reference runtime asset hash mismatch. Path: ${referenceRuntimeLockAsset.publicOutputPath}. Expected SHA-256: ${referenceRuntimeLockAsset.sha256}. Actual SHA-256: ${actualSha256}.`,
          );
        }
      }
    },
    30_000,
  );

  it("keeps the frozen planner local resolver patch and installs the local API before startup", () => {
    const frozenPlannerChunk = readStaticExportText(
      "_app/immutable/chunks/CUwsdp_r.js",
    );
    const bootstrapModule = readStaticExportText(
      "reference-runtime/bootstrap.mjs",
    );
    const localApiImportIndex = bootstrapModule.indexOf(
      'from "/reference-runtime/local-project-api.mjs"',
    );
    const localApiInstallationIndex = bootstrapModule.indexOf(
      "installReferenceLocalProjectApi();",
    );
    const startupSchedulingIndex = bootstrapModule.lastIndexOf(
      "startReferenceRuntimeWhenDocumentIsReady();",
    );

    expect(frozenPlannerChunk).toContain(
      "async function uc(x,D){if(!ve?.renderer)return;",
    );
    expect(frozenPlannerChunk).not.toContain(
      "async function uc(x,D){if(!ve)return;",
    );
    expect(frozenPlannerChunk).toContain("Cm=!0");
    expect(localApiImportIndex).toBeGreaterThanOrEqual(0);
    expect(localApiInstallationIndex).toBeGreaterThanOrEqual(0);
    expect(startupSchedulingIndex).toBeGreaterThanOrEqual(0);
    expect(localApiInstallationIndex).toBeLessThan(startupSchedulingIndex);
  });

  it("installs public-link navigation protection before frozen startup and wheel zoom afterward", () => {
    const bootstrapModule = readStaticExportText(
      "reference-runtime/bootstrap.mjs",
    );
    const navigationGuardInstallerImportIndex = bootstrapModule.indexOf(
      'import { installReferenceRuntimePublicLinkNavigationGuard } from "/reference-runtime/public-link-navigation-guard.mjs";',
    );
    const navigationGuardInstallerCallIndex = bootstrapModule.indexOf(
      "installReferenceRuntimePublicLinkNavigationGuard(\n    document,\n    window.location,\n    referenceRuntimeRoot,\n  );",
    );
    const initializedAttributeIndex = bootstrapModule.indexOf(
      'referenceRuntimeRoot.setAttribute(referenceRuntimeInitializedAttribute, "true");',
    );
    const wheelZoomInstallerImportIndex = bootstrapModule.indexOf(
      'import { installReferenceRuntimeWheelZoomModeToggle } from "/reference-runtime/wheel-zoom-mode-toggle.mjs";',
    );
    const awaitedFrozenRuntimeStartIndex = bootstrapModule.indexOf(
      "await start(referenceRuntimeApplication, referenceRuntimeRoot);",
    );
    const wheelZoomInstallerCallIndex = bootstrapModule.indexOf(
      "installReferenceRuntimeWheelZoomModeToggle(document);",
    );

    expect(navigationGuardInstallerImportIndex).toBeGreaterThanOrEqual(0);
    expect(navigationGuardInstallerCallIndex).toBeGreaterThanOrEqual(0);
    expect(initializedAttributeIndex).toBeGreaterThanOrEqual(0);
    expect(wheelZoomInstallerImportIndex).toBeGreaterThanOrEqual(0);
    expect(awaitedFrozenRuntimeStartIndex).toBeGreaterThanOrEqual(0);
    expect(wheelZoomInstallerCallIndex).toBeGreaterThan(
      awaitedFrozenRuntimeStartIndex,
    );
    expect(navigationGuardInstallerImportIndex).toBeLessThan(
      navigationGuardInstallerCallIndex,
    );
    expect(navigationGuardInstallerCallIndex).toBeLessThan(
      initializedAttributeIndex,
    );
    expect(initializedAttributeIndex).toBeLessThan(
      awaitedFrozenRuntimeStartIndex,
    );
  });

  it("keeps the generated host and local delivery modules free of reference source URLs", () => {
    const releaseModulePaths = [
      ...expectedStaticPagePaths.map(requireStaticExportFile),
      requireStaticExportFile("reference-runtime/bootstrap.mjs"),
      requireStaticExportFile("reference-runtime/local-project-api.mjs"),
      requireStaticExportFile("reference-runtime/local-only-overrides.css"),
      requireStaticExportFile(
        "reference-runtime/public-link-navigation-guard.mjs",
      ),
      requireStaticExportFile("reference-runtime/wheel-zoom-mode-toggle.mjs"),
      ...collectNextStaticReleaseModulePaths(nextStaticDirectoryPath),
    ];

    for (const releaseModulePath of releaseModulePaths) {
      assertReleaseTextHasNoReferenceSourceDomains(
        readFileSync(releaseModulePath, "utf8"),
        releaseModulePath,
      );
    }

    expect(existsSync(frozenRuntimeDirectoryPath)).toBe(true);
  });

  it("localizes static-route preview assets and removes excluded public-page content", () => {
    const frozenStaticRouteSources = frozenStaticRouteModulePaths.map(
      readStaticExportText,
    );

    for (const frozenStaticRouteSource of frozenStaticRouteSources) {
      expect(frozenStaticRouteSource).not.toContain(remoteReferenceAssetOrigin);
    }

    const modPageSource = readStaticExportText(
      "_app/immutable/nodes/6.DGdBuwBD.js",
    );
    const privacyPageSource = readStaticExportText(
      "_app/immutable/nodes/7.CR2msXyt.js",
    );
    const termsPageSource = readStaticExportText(
      "_app/immutable/nodes/8.CwO-oeWZ.js",
    );

    expect(modPageSource).not.toContain("ko-fi.com/stardewplanner");
    expect(privacyPageSource).not.toContain(
      "When you sign in with Google, Discord, Microsoft, or Twitch",
    );
    expect(privacyPageSource).not.toContain("Cloudflare's infrastructure");
    expect(privacyPageSource).not.toContain("ko-fi.com/stardewplanner");
    expect(termsPageSource).not.toContain(
      "Supporter features (projects, multi-map, auto-save)",
    );
    expect(termsPageSource).not.toContain("ko-fi.com/stardewplanner");
  });

  it("does not ship the remote asset base in any frozen runtime JavaScript", () => {
    for (const frozenRuntimeJavaScriptDirectoryPath of frozenRuntimeJavaScriptDirectoryPaths) {
      for (const frozenRuntimeJavaScriptPath of collectFrozenRuntimeJavaScriptPaths(
        frozenRuntimeJavaScriptDirectoryPath,
      )) {
        expect(readFileSync(frozenRuntimeJavaScriptPath, "utf8")).not.toContain(
          remoteReferenceAssetOrigin,
        );
      }
    }
  });

  it("delivers truthful local-only privacy and terms copy without links or support calls to action", () => {
    const localOnlyLegalPageSources = [
      readStaticExportText("_app/immutable/nodes/7.CR2msXyt.js"),
      readStaticExportText("_app/immutable/nodes/8.CwO-oeWZ.js"),
    ];

    for (const localOnlyLegalPageSource of localOnlyLegalPageSources) {
      for (const requiredLocalOnlyLegalCopyPhrase of requiredLocalOnlyLegalCopyPhrases) {
        expect(localOnlyLegalPageSource).toContain(
          requiredLocalOnlyLegalCopyPhrase,
        );
      }

      expect(localOnlyLegalPageSource).not.toMatch(/<a\b/i);
      expect(localOnlyLegalPageSource).not.toMatch(
        /(?:questions\?|reach out|contact (?:us|support)|support (?:us|the project))/i,
      );
    }
  });
});
