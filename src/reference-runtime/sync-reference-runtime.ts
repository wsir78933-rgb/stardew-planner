import { createHash, randomUUID } from "node:crypto";
import type { Dirent } from "node:fs";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAssetLock } from "../assets/asset-lock";
import {
  createReferenceRuntimeSourceAsset,
  isReferenceRuntimeMediaType,
  validateReferenceRuntimePublicOutputPaths,
  type ReferenceRuntimeMediaType,
  type ReferenceRuntimeSourceAsset,
} from "./reference-runtime-source-asset";
import { collectReferenceRuntimeSourceAssets } from "./reference-runtime-snapshot";

const appEntrySourceUrl =
  "https://stardewplan.com/_app/immutable/entry/app.DTzIUNnu.js";
const startEntrySourceUrl =
  "https://stardewplan.com/_app/immutable/entry/start.CLoByjli.js";
const remoteGameAssetBase = "https://assets.stardewplan.com/assets/1.6.15";
const historicPlannerResolverState =
  'Cm=typeof window<"u"&&window.location.hostname==="127.0.0.1"';
const localPlannerResolverState = "Cm=!0";
const expectedGameAssetCount = 337;

type StaticPageSourceTextTransformation = {
  sourcePublicOutputPath: string;
  description: string;
  expectedSourceText: string;
  replacementText: string;
};

const staticPageSourceTextTransformations: readonly StaticPageSourceTextTransformation[] = [
  {
    sourcePublicOutputPath: "_app/immutable/nodes/6.DGdBuwBD.js",
    description: "mods Ko-fi support paragraph",
    expectedSourceText: String.raw`<p class="svelte-sx1ms">Want another mod supported? Reach out via our <a href="https://ko-fi.com/stardewplanner" target="_blank" rel="noopener" class="svelte-sx1ms">Ko-fi page</a>.</p>`,
    replacementText: "",
  },
  {
    sourcePublicOutputPath: "_app/immutable/nodes/7.CR2msXyt.js",
    description: "privacy page body",
    expectedSourceText: String.raw`<div class="page svelte-1fwx8tj"><h1 class="svelte-1fwx8tj">Privacy Policy</h1> <p class="date svelte-1fwx8tj">Last updated: April 13, 2026</p> <h2 class="svelte-1fwx8tj">What we collect</h2> <p>When you sign in with Google, Discord, Microsoft, or Twitch, we store your name, email address, and profile picture as provided by the sign-in provider. This is used solely to identify your account.</p> <h2 class="svelte-1fwx8tj">Farm data</h2> <p>Your farm plans and project data are stored on Cloudflare's infrastructure. Shared plans are accessible via their unique link. Projects (supporter feature) are private to your account.</p> <h2 class="svelte-1fwx8tj">Payments</h2> <p>Payments are processed entirely by Ko-fi. We receive a webhook notification containing your Ko-fi email and payment amount to activate supporter features. We do not store payment card details.</p> <h2 class="svelte-1fwx8tj">Analytics</h2> <p>We use <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" class="svelte-1fwx8tj">Plausible Analytics</a>, a privacy-first analytics tool. Plausible collects no personal data, uses no cookies, and is fully compliant with GDPR, CCPA, and PECR. All data is aggregated and anonymous. No individual visitors are tracked. You can read more about their approach at <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" class="svelte-1fwx8tj">plausible.io/data-policy</a>.</p> <h2 class="svelte-1fwx8tj">Cookies</h2> <p>We use a session cookie to keep you signed in. No tracking or advertising cookies are used.</p> <h2 class="svelte-1fwx8tj">Third parties</h2> <p>We do not sell or share your data with third parties. Your data is hosted on Cloudflare (Pages, Workers, R2, D1). Anonymous usage statistics are processed by Plausible Analytics (EU-hosted).</p> <h2 class="svelte-1fwx8tj">Data deletion</h2> <p>You can delete your account and all associated data by contacting us. Shared plan links are anonymous and not tied to your account.</p> <h2 class="svelte-1fwx8tj">Contact</h2> <p>Questions? Reach out via the <a href="https://ko-fi.com/stardewplanner" target="_blank" rel="noopener noreferrer" class="svelte-1fwx8tj">Ko-fi page</a>.</p></div>`,
    replacementText: String.raw`<div class="page svelte-1fwx8tj"><h1 class="svelte-1fwx8tj">Privacy Policy</h1> <p class="date svelte-1fwx8tj">Last updated: July 27, 2026</p> <h2 class="svelte-1fwx8tj">What we collect</h2> <p>There is no account or sign-in.</p> <h2 class="svelte-1fwx8tj">Farm data</h2> <p>Projects stay in this browser.</p> <h2 class="svelte-1fwx8tj">Payments</h2> <p>There is no cloud sync, share links, payments, memberships, or supporter features.</p> <h2 class="svelte-1fwx8tj">Analytics</h2> <p>This browser-local product does not provide analytics or tracking services.</p> <h2 class="svelte-1fwx8tj">Cookies</h2> <p>This browser-local product does not use sign-in cookies.</p> <h2 class="svelte-1fwx8tj">Third parties</h2> <p>Projects are not sent to a cloud service or shared with third parties.</p> <h2 class="svelte-1fwx8tj">Data deletion</h2> <p>You can delete local data by deleting projects or clearing this site's data in your browser.</p> <h2 class="svelte-1fwx8tj">Local use</h2> <p>JSON import and export happen only when you choose them.</p></div>`,
  },
  {
    sourcePublicOutputPath: "_app/immutable/nodes/8.CwO-oeWZ.js",
    description: "terms page body",
    expectedSourceText: String.raw`<div class="page svelte-uajzey"><h1 class="svelte-uajzey">Terms of Service</h1> <p class="date svelte-uajzey">Last updated: April 8, 2026</p> <h2 class="svelte-uajzey">What this is</h2> <p>Stardew Planner is a free fan-made tool for planning farm layouts in Stardew Valley. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.</p> <h2 class="svelte-uajzey">Accounts</h2> <p>You can use the planner without an account. Signing in lets you save plans. Supporter features (projects, multi-map, auto-save) require a Ko-fi contribution.</p> <h2 class="svelte-uajzey">Supporter status</h2> <p>Payments grant time-limited supporter access (currently 35 days per payment). Payments are processed via Stripe or PayPal through Ko-fi. For refund requests or billing issues, contact me via the <a href="https://ko-fi.com/stardewplanner" target="_blank" rel="noopener noreferrer" class="svelte-uajzey">Ko-fi page</a>.</p> <h2 class="svelte-uajzey">Your data</h2> <p>You retain ownership of your farm plans. We may delete inactive accounts and associated data after extended periods of inactivity.</p> <h2 class="svelte-uajzey">Availability</h2> <p>The service is provided as-is with no uptime guarantees. We may modify or discontinue features at any time.</p> <h2 class="svelte-uajzey">Game assets</h2> <p>Stardew Valley game assets are the property of ConcernedApe. They are used here under fair use for the purpose of fan-made planning tools.</p> <h2 class="svelte-uajzey">Contact</h2> <p>Questions? Reach out via the <a href="https://ko-fi.com/stardewplanner" target="_blank" rel="noopener noreferrer" class="svelte-uajzey">Ko-fi page</a>.</p></div>`,
    replacementText: String.raw`<div class="page svelte-uajzey"><h1 class="svelte-uajzey">Terms of Service</h1> <p class="date svelte-uajzey">Last updated: July 27, 2026</p> <h2 class="svelte-uajzey">What this is</h2> <p>Stardew Planner is a browser-local fan-made tool for planning farm layouts in Stardew Valley. Projects stay in this browser. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.</p> <h2 class="svelte-uajzey">Accounts</h2> <p>There is no account or sign-in.</p> <h2 class="svelte-uajzey">Online features</h2> <p>There is no cloud sync, share links, payments, memberships, or supporter features.</p> <h2 class="svelte-uajzey">Your data</h2> <p>JSON import and export happen only when you choose them. You can delete local data by deleting projects or clearing this site's data in your browser.</p> <h2 class="svelte-uajzey">Availability</h2> <p>The product is provided as-is with no uptime guarantees.</p> <h2 class="svelte-uajzey">Game assets</h2> <p>Stardew Valley game assets are the property of ConcernedApe. They are used here for this fan-made planning tool.</p> <h2 class="svelte-uajzey">Local use</h2> <p>This browser-local product does not provide contact or support features.</p></div>`,
  },
];

const sameOriginVisualSourceUrls = [
  "https://stardewplan.com/favicon.png",
  "https://stardewplan.com/icons/icon-192.png",
  "https://stardewplan.com/icons/icon-512.png",
  "https://stardewplan.com/assets/ui/cursor-default.png",
  "https://stardewplan.com/assets/ui/cursor-place.png",
  "https://stardewplan.com/assets/ui/cursor-erase.png",
  "https://stardewplan.com/assets/ui/cursor-pointer.png",
  "https://stardewplan.com/assets/ui/tabs/buildings.png",
  "https://stardewplan.com/assets/ui/tabs/package.png",
  "https://stardewplan.com/assets/ui/tabs/couch_and_lamp.png",
  "https://stardewplan.com/assets/ui/flooring-frame.png",
  "https://stardewplan.com/assets/ui/wallpaper-frame.png",
  "https://stardewplan.com/assets/ui/tabs/100_anim_f.png",
  "https://stardewplan.com/img/Junimo.png",
  "https://stardewplan.com/img/mychar.png",
] as const;

export type ReferenceRuntimeLockEntry = {
  sourceUrl: string;
  publicOutputPath: string;
  mediaType: ReferenceRuntimeMediaType;
  sha256: string;
};

export type ReferenceRuntimeLock = {
  assets: readonly ReferenceRuntimeLockEntry[];
};

type StagedReferenceRuntimeSnapshot = {
  stagingDirectory: string;
  referenceRuntimeLock: ReferenceRuntimeLock;
  runtimeAssetCount: number;
  sameOriginVisualAssetCount: number;
  gameAssetCount: number;
};

type PublishedSnapshotPath = {
  publishedPath: string;
  backupPath: string | null;
};

export async function synchronizeReferenceRuntime(): Promise<ReferenceRuntimeLock> {
  const workspaceDirectory = getWorkspaceDirectory();
  const publicDirectory = join(workspaceDirectory, "public");
  const stagingDirectory = await createStagingDirectory(publicDirectory);

  try {
    const stagedSnapshot = await stageReferenceRuntimeSnapshot(
      workspaceDirectory,
      stagingDirectory,
    );
    await publishStagedReferenceRuntimeSnapshot(stagedSnapshot, publicDirectory);

    console.log(
      `Reference runtime snapshot synchronised: ${stagedSnapshot.referenceRuntimeLock.assets.length} assets (${stagedSnapshot.runtimeAssetCount} runtime, ${stagedSnapshot.sameOriginVisualAssetCount} same-origin visual, ${stagedSnapshot.gameAssetCount} game assets).`,
    );

    return stagedSnapshot.referenceRuntimeLock;
  } catch (synchronizationError) {
    await rm(stagingDirectory, { force: true, recursive: true });
    throw synchronizationError;
  }
}

async function createStagingDirectory(publicDirectory: string): Promise<string> {
  await mkdir(publicDirectory, { recursive: true });

  return mkdtemp(join(publicDirectory, ".reference-runtime-stage-"));
}

async function stageReferenceRuntimeSnapshot(
  workspaceDirectory: string,
  stagingDirectory: string,
): Promise<StagedReferenceRuntimeSnapshot> {
  await stageExistingReferenceRuntimeDirectory(
    workspaceDirectory,
    stagingDirectory,
  );
  const runtimeSourceAssets = await collectRuntimeSourceAssets();
  const sameOriginVisualSourceAssets = sameOriginVisualSourceUrls.map(
    createReferenceRuntimeSourceAsset,
  );
  const gameSourceAssets = await readVerifiedGameSourceAssets(workspaceDirectory);
  const sourceAssets = [
    ...runtimeSourceAssets,
    ...sameOriginVisualSourceAssets,
    ...gameSourceAssets,
  ];

  validateReferenceRuntimePublicOutputPaths(sourceAssets);

  const referenceRuntimeLockEntries = await writeReferenceRuntimeAssets(
    sourceAssets,
    workspaceDirectory,
    stagingDirectory,
  );
  await assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(stagingDirectory);
  const referenceRuntimeLock = createReferenceRuntimeLock(
    referenceRuntimeLockEntries,
  );

  await writeStagedReferenceRuntimeLock(stagingDirectory, referenceRuntimeLock);

  return {
    stagingDirectory,
    referenceRuntimeLock,
    runtimeAssetCount: runtimeSourceAssets.length,
    sameOriginVisualAssetCount: sameOriginVisualSourceAssets.length,
    gameAssetCount: gameSourceAssets.length,
  };
}

async function stageExistingReferenceRuntimeDirectory(
  workspaceDirectory: string,
  stagingDirectory: string,
): Promise<void> {
  const publishedReferenceRuntimeDirectory = join(
    workspaceDirectory,
    "public/reference-runtime",
  );

  if (!(await pathExists(publishedReferenceRuntimeDirectory))) {
    return;
  }

  await cp(
    publishedReferenceRuntimeDirectory,
    join(stagingDirectory, "reference-runtime"),
    { force: true, recursive: true },
  );
}

async function collectRuntimeSourceAssets(): Promise<
  readonly ReferenceRuntimeSourceAsset[]
> {
  const [appRuntimeSourceAssets, startRuntimeSourceAssets] = await Promise.all([
    collectReferenceRuntimeSourceAssets(
      createReferenceRuntimeSourceAsset(appEntrySourceUrl),
    ),
    collectReferenceRuntimeSourceAssets(
      createReferenceRuntimeSourceAsset(startEntrySourceUrl),
    ),
  ]);
  const sourceAssetsByPublicOutputPath = new Map<
    string,
    ReferenceRuntimeSourceAsset
  >();

  for (const sourceAsset of [
    ...appRuntimeSourceAssets,
    ...startRuntimeSourceAssets,
  ]) {
    const existingSourceAsset = sourceAssetsByPublicOutputPath.get(
      sourceAsset.publicOutputPath,
    );

    if (
      existingSourceAsset !== undefined &&
      existingSourceAsset.sourceUrl !== sourceAsset.sourceUrl
    ) {
      throw new TypeError(
        `Reference runtime source assets cannot map different source URLs to one public output path. Received public output path: ${JSON.stringify(sourceAsset.publicOutputPath)}.`,
      );
    }

    sourceAssetsByPublicOutputPath.set(
      sourceAsset.publicOutputPath,
      sourceAsset,
    );
  }

  return [...sourceAssetsByPublicOutputPath.values()];
}

async function readVerifiedGameSourceAssets(
  workspaceDirectory: string,
): Promise<readonly ReferenceRuntimeSourceAsset[]> {
  const gameAssetDirectory = join(
    workspaceDirectory,
    "public/game-assets/1.6.15",
  );
  const gameAssetLockPath = join(gameAssetDirectory, "asset-lock.json");
  const gameAssetLock = parseAssetLock(await readFile(gameAssetLockPath, "utf8"));

  if (gameAssetLock.assets.length !== expectedGameAssetCount) {
    throw new Error(
      `Reference runtime game asset lock must contain ${expectedGameAssetCount} assets. Received: ${gameAssetLock.assets.length}.`,
    );
  }

  const gameSourceAssets: ReferenceRuntimeSourceAsset[] = [];

  for (const gameAssetLockEntry of gameAssetLock.assets) {
    if (!isReferenceRuntimeMediaType(gameAssetLockEntry.mediaType)) {
      throw new TypeError(
        `Reference runtime game asset lock has an unrecognised content type. Received media type: ${JSON.stringify(gameAssetLockEntry.mediaType)} for ${JSON.stringify(gameAssetLockEntry.outputPath)}.`,
      );
    }

    const gameAssetContents = await readFile(
      join(gameAssetDirectory, gameAssetLockEntry.outputPath),
    );
    const receivedSha256 = calculateSha256(gameAssetContents);

    if (receivedSha256 !== gameAssetLockEntry.sha256) {
      throw new Error(
        `Reference runtime game asset does not match its existing lock. Received path: ${JSON.stringify(gameAssetLockEntry.outputPath)}. Expected SHA-256: ${gameAssetLockEntry.sha256}. Received SHA-256: ${receivedSha256}.`,
      );
    }

    const gameSourceAsset = createReferenceRuntimeSourceAsset(
      gameAssetLockEntry.sourceUrl,
    );

    if (gameSourceAsset.mediaType !== gameAssetLockEntry.mediaType) {
      throw new TypeError(
        `Reference runtime game asset lock media type does not match its source URL. Received media type: ${JSON.stringify(gameAssetLockEntry.mediaType)} for ${JSON.stringify(gameAssetLockEntry.sourceUrl)}.`,
      );
    }

    gameSourceAssets.push(gameSourceAsset);
  }

  return gameSourceAssets;
}

async function writeReferenceRuntimeAssets(
  sourceAssets: readonly ReferenceRuntimeSourceAsset[],
  workspaceDirectory: string,
  stagingDirectory: string,
): Promise<readonly ReferenceRuntimeLockEntry[]> {
  requireStaticPageTransformationSourceAssets(sourceAssets);

  const referenceRuntimeLockEntries: ReferenceRuntimeLockEntry[] = [];
  let stagedPlannerResolverOccurrenceCount = 0;
  let stagedPlannerResolverStateOccurrenceCount = 0;

  for (const sourceAsset of sourceAssets) {
    const sourceAssetContents = await readReferenceRuntimeSourceAsset(
      sourceAsset,
      workspaceDirectory,
    );
    const transformedSourceAsset = transformReferenceRuntimeSourceAsset(
      sourceAsset,
      sourceAssetContents,
    );

    stagedPlannerResolverOccurrenceCount +=
      transformedSourceAsset.stagedPlannerResolverOccurrenceCount;
    stagedPlannerResolverStateOccurrenceCount +=
      transformedSourceAsset.stagedPlannerResolverStateOccurrenceCount;
    await writeStagedSourceAsset(
      stagingDirectory,
      sourceAsset.publicOutputPath,
      transformedSourceAsset.contents,
    );
    referenceRuntimeLockEntries.push({
      sourceUrl: sourceAsset.sourceUrl,
      publicOutputPath: sourceAsset.publicOutputPath,
      mediaType: sourceAsset.mediaType,
      sha256: calculateSha256(transformedSourceAsset.contents),
    });
  }

  if (
    stagedPlannerResolverOccurrenceCount !== 1 ||
    stagedPlannerResolverStateOccurrenceCount !== 1
  ) {
    throw new Error(
      `Reference runtime staged planner resolver must contain exactly one ${JSON.stringify(localPlannerResolverState)} state and no other resolver state. Received ${JSON.stringify(localPlannerResolverState)} occurrence count: ${stagedPlannerResolverOccurrenceCount}. Received resolver state occurrence count: ${stagedPlannerResolverStateOccurrenceCount}.`,
    );
  }

  return referenceRuntimeLockEntries;
}

export async function assertStagedReferenceRuntimeJavaScriptUsesLocalAssets(
  stagingDirectory: string,
): Promise<void> {
  const normalizedStagingDirectory = resolve(stagingDirectory);
  const stagedJavaScriptPaths = await collectStagedJavaScriptPaths(
    normalizedStagingDirectory,
  );

  for (const stagedJavaScriptPath of stagedJavaScriptPaths) {
    const stagedJavaScript = await readFile(stagedJavaScriptPath, "utf8");

    if (stagedJavaScript.includes(remoteGameAssetBase)) {
      throw new Error(
        `Reference runtime staged JavaScript must not contain the remote asset base. Received staged path: ${JSON.stringify(createRelativeStagedPath(normalizedStagingDirectory, stagedJavaScriptPath))}. Remote asset base: ${JSON.stringify(remoteGameAssetBase)}.`,
      );
    }
  }
}

async function collectStagedJavaScriptPaths(
  directoryPath: string,
  stagingDirectoryPath = directoryPath,
): Promise<readonly string[]> {
  const stagedJavaScriptPaths: string[] = [];
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    const directoryEntryPath = join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      stagedJavaScriptPaths.push(
        ...(await collectStagedJavaScriptPaths(
          directoryEntryPath,
          stagingDirectoryPath,
        )),
      );
      continue;
    }

    if (
      directoryEntry.isFile() &&
      (directoryEntry.name.endsWith(".js") || directoryEntry.name.endsWith(".mjs"))
    ) {
      stagedJavaScriptPaths.push(directoryEntryPath);
      continue;
    }

    if (!directoryEntry.isFile()) {
      throw new TypeError(
        `Reference runtime staged JavaScript enumeration only accepts regular files and directories. Received Dirent type: ${JSON.stringify(describeUnsupportedDirentType(directoryEntry))}. Received staged path: ${JSON.stringify(createRelativeStagedPath(stagingDirectoryPath, directoryEntryPath))}. Received directory entry name: ${JSON.stringify(directoryEntry.name)}.`,
      );
    }
  }

  return stagedJavaScriptPaths;
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

function createRelativeStagedPath(
  stagingDirectory: string,
  stagedPath: string,
): string {
  return relative(stagingDirectory, stagedPath).split(sep).join("/");
}

async function readReferenceRuntimeSourceAsset(
  sourceAsset: ReferenceRuntimeSourceAsset,
  workspaceDirectory: string,
): Promise<Uint8Array> {
  if (sourceAsset.sourceUrl.startsWith("https://assets.stardewplan.com/")) {
    return readVerifiedGameAssetContents(sourceAsset, workspaceDirectory);
  }

  const response = await fetch(sourceAsset.sourceUrl);

  if (!response.ok) {
    throw new Error(
      `Reference runtime source asset request must return a successful response. Received HTTP status ${response.status} for ${JSON.stringify(sourceAsset.sourceUrl)}.`,
    );
  }

  if (response.url !== sourceAsset.sourceUrl) {
    throw new Error(
      `Reference runtime source asset request cannot redirect. Received final URL: ${JSON.stringify(response.url)}. Requested URL: ${JSON.stringify(sourceAsset.sourceUrl)}.`,
    );
  }

  const receivedMediaType = response.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (receivedMediaType !== sourceAsset.mediaType) {
    throw new TypeError(
      `Reference runtime source asset response content type must be ${sourceAsset.mediaType}. Received: ${JSON.stringify(receivedMediaType)} for ${JSON.stringify(sourceAsset.sourceUrl)}.`,
    );
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function readVerifiedGameAssetContents(
  sourceAsset: ReferenceRuntimeSourceAsset,
  workspaceDirectory: string,
): Promise<Uint8Array> {
  const gameAssetLock = parseAssetLock(
    await readFile(
      join(workspaceDirectory, "public/game-assets/1.6.15/asset-lock.json"),
      "utf8",
    ),
  );
  const gameAssetLockEntry = gameAssetLock.assets.find(
    (candidateGameAssetLockEntry) =>
      candidateGameAssetLockEntry.sourceUrl === sourceAsset.sourceUrl,
  );

  if (gameAssetLockEntry === undefined) {
    throw new Error(
      `Reference runtime source asset was not found in the existing game asset lock. Received source URL: ${JSON.stringify(sourceAsset.sourceUrl)}.`,
    );
  }

  const gameAssetContents = new Uint8Array(
    await readFile(
      join(
        workspaceDirectory,
        "public/game-assets/1.6.15",
        gameAssetLockEntry.outputPath,
      ),
    ),
  );
  const receivedSha256 = calculateSha256(gameAssetContents);

  if (receivedSha256 !== gameAssetLockEntry.sha256) {
    throw new Error(
      `Reference runtime game asset does not match its existing lock. Received path: ${JSON.stringify(gameAssetLockEntry.outputPath)}. Expected SHA-256: ${gameAssetLockEntry.sha256}. Received SHA-256: ${receivedSha256}.`,
    );
  }

  return gameAssetContents;
}

function transformReferenceRuntimeSourceAsset(
  sourceAsset: ReferenceRuntimeSourceAsset,
  contents: Uint8Array,
): {
  contents: Uint8Array;
  stagedPlannerResolverOccurrenceCount: number;
  stagedPlannerResolverStateOccurrenceCount: number;
} {
  if (sourceAsset.mediaType !== "application/javascript") {
    return {
      contents,
      stagedPlannerResolverOccurrenceCount: 0,
      stagedPlannerResolverStateOccurrenceCount: 0,
    };
  }

  const sourceText = new TextDecoder().decode(contents);
  const staticPageTransformedSourceText = transformStaticPageSourceText(
    sourceAsset.publicOutputPath,
    sourceText,
  );
  const localizedRuntimeSourceText = staticPageTransformedSourceText.replaceAll(
    remoteGameAssetBase,
    "/assets",
  );
  const stagedSourceText = transformPlannerResolverState(
    sourceAsset.publicOutputPath,
    localizedRuntimeSourceText,
  );

  if (stagedSourceText.includes(remoteGameAssetBase)) {
    throw new Error(
      `Reference runtime staged JavaScript must not contain the remote asset base. Received public output path: ${JSON.stringify(sourceAsset.publicOutputPath)}. Remote asset base: ${JSON.stringify(remoteGameAssetBase)}.`,
    );
  }

  const stagedPlannerResolverStates = collectPlannerResolverStates(
    stagedSourceText,
  );

  return {
    contents: new TextEncoder().encode(stagedSourceText),
    stagedPlannerResolverOccurrenceCount: countOccurrences(
      stagedSourceText,
      localPlannerResolverState,
    ),
    stagedPlannerResolverStateOccurrenceCount: stagedPlannerResolverStates.length,
  };
}

function requireStaticPageTransformationSourceAssets(
  sourceAssets: readonly ReferenceRuntimeSourceAsset[],
): void {
  const sourcePublicOutputPaths = new Set(
    sourceAssets.map((sourceAsset) => sourceAsset.publicOutputPath),
  );

  for (const staticPageSourceTextTransformation of staticPageSourceTextTransformations) {
    if (
      !sourcePublicOutputPaths.has(
        staticPageSourceTextTransformation.sourcePublicOutputPath,
      )
    ) {
      throw new Error(
        `Reference runtime source snapshot must include the static page required for ${staticPageSourceTextTransformation.description}. Expected public output path: ${JSON.stringify(staticPageSourceTextTransformation.sourcePublicOutputPath)}.`,
      );
    }
  }
}

function transformStaticPageSourceText(
  sourcePublicOutputPath: string,
  sourceText: string,
): string {
  const staticPageSourceTextTransformation = staticPageSourceTextTransformations.find(
    (candidateStaticPageSourceTextTransformation) =>
      candidateStaticPageSourceTextTransformation.sourcePublicOutputPath ===
      sourcePublicOutputPath,
  );

  if (staticPageSourceTextTransformation === undefined) {
    return sourceText;
  }

  const expectedSourceTextOccurrenceCount = countOccurrences(
    sourceText,
    staticPageSourceTextTransformation.expectedSourceText,
  );

  if (expectedSourceTextOccurrenceCount !== 1) {
    throw new Error(
      `Reference runtime static page source must contain the expected ${staticPageSourceTextTransformation.description} exactly once. Received public output path: ${JSON.stringify(sourcePublicOutputPath)}. Received occurrence count: ${expectedSourceTextOccurrenceCount}.`,
    );
  }

  return sourceText.replace(
    staticPageSourceTextTransformation.expectedSourceText,
    staticPageSourceTextTransformation.replacementText,
  );
}

function transformPlannerResolverState(
  sourcePublicOutputPath: string,
  sourceText: string,
): string {
  const plannerResolverStates = collectPlannerResolverStates(sourceText);

  for (const plannerResolverState of plannerResolverStates) {
    if (
      plannerResolverState !== historicPlannerResolverState &&
      plannerResolverState !== localPlannerResolverState
    ) {
      throw new Error(
        `Reference runtime planner resolver must use ${JSON.stringify(historicPlannerResolverState)} or ${JSON.stringify(localPlannerResolverState)}. Received resolver state: ${JSON.stringify(plannerResolverState)}. Received public output path: ${JSON.stringify(sourcePublicOutputPath)}.`,
      );
    }
  }

  return sourceText.replaceAll(
    historicPlannerResolverState,
    localPlannerResolverState,
  );
}

function collectPlannerResolverStates(sourceText: string): readonly string[] {
  return [...sourceText.matchAll(/Cm=[^,;]+/g)].map((resolverStateMatch) =>
    resolverStateMatch[0],
  );
}

function countOccurrences(sourceText: string, searchedText: string): number {
  let occurrenceCount = 0;
  let searchedTextIndex = sourceText.indexOf(searchedText);

  while (searchedTextIndex !== -1) {
    occurrenceCount += 1;
    searchedTextIndex = sourceText.indexOf(
      searchedText,
      searchedTextIndex + searchedText.length,
    );
  }

  return occurrenceCount;
}

async function writeStagedSourceAsset(
  stagingDirectory: string,
  publicOutputPath: string,
  contents: Uint8Array,
): Promise<void> {
  const stagedOutputPath = resolve(stagingDirectory, publicOutputPath);

  if (!stagedOutputPath.startsWith(`${stagingDirectory}/`)) {
    throw new Error(
      `Reference runtime staged output path must stay within its staging directory. Received public output path: ${JSON.stringify(publicOutputPath)}.`,
    );
  }

  await mkdir(dirname(stagedOutputPath), { recursive: true });
  await writeFile(stagedOutputPath, contents);
}

function createReferenceRuntimeLock(
  referenceRuntimeLockEntries: readonly ReferenceRuntimeLockEntry[],
): ReferenceRuntimeLock {
  if (referenceRuntimeLockEntries.length === 0) {
    throw new Error("Reference runtime lock cannot be empty.");
  }

  const sourceAssets = referenceRuntimeLockEntries.map((referenceRuntimeLockEntry) => ({
    sourceUrl: referenceRuntimeLockEntry.sourceUrl,
    publicOutputPath: referenceRuntimeLockEntry.publicOutputPath,
    mediaType: referenceRuntimeLockEntry.mediaType,
  }));

  validateReferenceRuntimePublicOutputPaths(sourceAssets);

  return { assets: [...referenceRuntimeLockEntries] };
}

async function writeStagedReferenceRuntimeLock(
  stagingDirectory: string,
  referenceRuntimeLock: ReferenceRuntimeLock,
): Promise<void> {
  const referenceRuntimeLockPath = join(
    stagingDirectory,
    "reference-runtime/reference-runtime-lock.json",
  );

  await mkdir(dirname(referenceRuntimeLockPath), { recursive: true });
  await writeFile(
    referenceRuntimeLockPath,
    `${JSON.stringify(referenceRuntimeLock, null, 2)}\n`,
    "utf8",
  );
}

async function publishStagedReferenceRuntimeSnapshot(
  stagedSnapshot: StagedReferenceRuntimeSnapshot,
  publicDirectory: string,
): Promise<void> {
  const publishedSnapshotPaths: PublishedSnapshotPath[] = [];

  try {
    for (const publicationRelativePath of [
      "_app",
      "assets",
      "icons",
      "img",
      "reference-runtime",
      "favicon.png",
    ] as const) {
      publishedSnapshotPaths.push(
        await publishStagedSnapshotPath(
          join(stagedSnapshot.stagingDirectory, publicationRelativePath),
          join(publicDirectory, publicationRelativePath),
        ),
      );
    }
  } catch (publicationError) {
    await rollbackPublishedSnapshotPaths(publishedSnapshotPaths);
    throw publicationError;
  }

  await Promise.all(
    publishedSnapshotPaths.map(async (publishedSnapshotPath) => {
      if (publishedSnapshotPath.backupPath !== null) {
        await rm(publishedSnapshotPath.backupPath, {
          force: true,
          recursive: true,
        });
      }
    }),
  );
  await rm(stagedSnapshot.stagingDirectory, { force: true, recursive: true });
}

async function publishStagedSnapshotPath(
  stagedPath: string,
  publishedPath: string,
): Promise<PublishedSnapshotPath> {
  await requireStagedSnapshotPath(stagedPath);

  const existingPublishedPath = await pathExists(publishedPath);
  const backupPath = existingPublishedPath
    ? join(
        dirname(publishedPath),
        `.${randomUUID()}-${basename(publishedPath)}-backup`,
      )
    : null;

  if (backupPath !== null) {
    await rename(publishedPath, backupPath);
  }

  try {
    await rename(stagedPath, publishedPath);
  } catch (publicationError) {
    if (backupPath !== null) {
      await rename(backupPath, publishedPath);
    }

    throw publicationError;
  }

  return { publishedPath, backupPath };
}

async function requireStagedSnapshotPath(stagedPath: string): Promise<void> {
  try {
    await access(stagedPath);
  } catch (accessError) {
    const accessErrorMessage =
      accessError instanceof Error ? accessError.message : String(accessError);

    throw new Error(
      `Reference runtime staged publication path is missing or inaccessible. Path: ${JSON.stringify(stagedPath)}. Access error: ${accessErrorMessage}`,
      { cause: accessError },
    );
  }
}

async function rollbackPublishedSnapshotPaths(
  publishedSnapshotPaths: readonly PublishedSnapshotPath[],
): Promise<void> {
  for (const publishedSnapshotPath of [...publishedSnapshotPaths].reverse()) {
    await rm(publishedSnapshotPath.publishedPath, {
      force: true,
      recursive: true,
    });

    if (publishedSnapshotPath.backupPath !== null) {
      await rename(
        publishedSnapshotPath.backupPath,
        publishedSnapshotPath.publishedPath,
      );
    }
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (accessError) {
    if (isMissingPathError(accessError)) {
      return false;
    }

    const accessErrorMessage =
      accessError instanceof Error ? accessError.message : String(accessError);

    throw new Error(
      `Reference runtime publish path inspection failed for ${JSON.stringify(path)}. Access error: ${accessErrorMessage}`,
      { cause: accessError },
    );
  }
}

function isMissingPathError(accessError: unknown): boolean {
  return (
    typeof accessError === "object" &&
    accessError !== null &&
    "code" in accessError &&
    accessError.code === "ENOENT"
  );
}

function calculateSha256(contents: Uint8Array): string {
  return createHash("sha256").update(contents).digest("hex");
}

function getWorkspaceDirectory(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../..");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  synchronizeReferenceRuntime().catch((synchronizationError: unknown) => {
    if (synchronizationError instanceof Error) {
      console.error(synchronizationError.stack ?? synchronizationError.message);
    } else {
      console.error(synchronizationError);
    }

    process.exitCode = 1;
  });
}
