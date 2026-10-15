import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const emptyProjectCacheHash = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
const workspaceRoot = path.resolve(scriptDirectory, "../../../../../");
const vitestConfigPath = path.join(scriptDirectory, "vitest.config.mjs");
const vitestLogPath = path.join(scriptDirectory, "vitest.log");
const sharedNodeModulesPath = fs.realpathSync(path.join(workspaceRoot, "node_modules"));
const sharedResultsPath = path.join(
  sharedNodeModulesPath,
  ".vite",
  "vitest",
  emptyProjectCacheHash,
  "results.json",
);
const sharedViteTempPath = path.join(sharedNodeModulesPath, ".vite-temp");
const worktreeResultsPath = path.join(
  workspaceRoot,
  ".next",
  "verification-cache",
  "vite",
  "vitest",
  emptyProjectCacheHash,
  "results.json",
);

function readResultsSnapshot(resultsPath) {
  if (!fs.existsSync(resultsPath)) {
    throw new Error(`results cache is missing: ${resultsPath}`);
  }
  const fileStat = fs.statSync(resultsPath, { bigint: true });
  if (!fileStat.isFile()) {
    throw new Error(
      `results cache is not a file: ${resultsPath} mode=${fileStat.mode.toString(8)}`,
    );
  }
  if (typeof fileStat.mtimeNs !== "bigint") {
    throw new Error(
      `results cache mtimeNs is not a bigint: ${resultsPath} mtimeNs=${String(fileStat.mtimeNs)}`,
    );
  }
  if (fileStat.size > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(
      `results cache size exceeds Number.MAX_SAFE_INTEGER: ${resultsPath} size=${fileStat.size}`,
    );
  }
  const content = fs.readFileSync(resultsPath);
  let parsed;
  try {
    parsed = JSON.parse(content.toString("utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`results cache is not JSON: ${resultsPath}: ${message}`);
  }
  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    !Array.isArray(parsed.results)
  ) {
    throw new Error(`results cache is missing a results array: ${resultsPath}`);
  }
  return {
    path: resultsPath,
    size: Number(fileStat.size),
    mtimeNs: fileStat.mtimeNs.toString(),
    sha256: crypto.createHash("sha256").update(content).digest("hex"),
    version: parsed.version,
    resultEntryCount: parsed.results.length,
  };
}

function readViteTempSnapshot(viteTempPath) {
  if (!fs.existsSync(viteTempPath)) {
    return { path: viteTempPath, exists: false };
  }
  const tempStat = fs.statSync(viteTempPath, { bigint: true });
  if (typeof tempStat.mtimeNs !== "bigint") {
    throw new Error(
      `vite-temp mtimeNs is not a bigint: ${viteTempPath} mtimeNs=${String(tempStat.mtimeNs)}`,
    );
  }
  return {
    path: viteTempPath,
    exists: true,
    isDirectory: tempStat.isDirectory(),
    mtimeNs: tempStat.mtimeNs.toString(),
    childNames: tempStat.isDirectory() ? fs.readdirSync(viteTempPath).sort() : [],
  };
}

function readSharedCacheSnapshot() {
  return {
    results: readResultsSnapshot(sharedResultsPath),
    viteTemp: readViteTempSnapshot(sharedViteTempPath),
  };
}

function assertSameSnapshot(label, before, after) {
  const beforeJson = JSON.stringify(before);
  const afterJson = JSON.stringify(after);
  if (beforeJson !== afterJson) {
    throw new Error(`${label} changed.\nBEFORE ${beforeJson}\nAFTER ${afterJson}`);
  }
}

function assertWorktreeResults(resultsSnapshot) {
  const resultsPath = fs.realpathSync(resultsSnapshot.path);
  const worktreePrefix = `${path.join(workspaceRoot, ".next", "verification-cache")}${path.sep}`;
  const sharedPrefix = `${sharedNodeModulesPath}${path.sep}`;
  if (!resultsPath.startsWith(worktreePrefix)) {
    throw new Error(`results cache is outside the worktree verification cache: ${resultsPath}`);
  }
  if (resultsPath.startsWith(sharedPrefix)) {
    throw new Error(`results cache resolved inside shared node_modules: ${resultsPath}`);
  }
  if (resultsSnapshot.resultEntryCount < 1) {
    throw new Error(
      `worktree results cache has no entries: ${resultsPath} count=${resultsSnapshot.resultEntryCount}`,
    );
  }
}

function assertTrackedDiffEmpty() {
  const result = spawnSync("git", ["diff", "--stat"], {
    cwd: workspaceRoot,
    encoding: "utf8",
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`git diff --stat exited ${result.status}: ${result.stderr || ""}`);
  }
  if (result.stdout.trim() !== "") {
    throw new Error(`tracked source diff is not empty:\n${result.stdout}`);
  }
}

function runBlogRegistryVitest() {
  const vitestExecutablePath = path.join(workspaceRoot, "node_modules", ".bin", "vitest");
  if (!fs.existsSync(vitestExecutablePath)) {
    throw new Error(`vitest executable is missing: ${vitestExecutablePath}`);
  }
  const vitestArguments = [
    "run",
    "tests/blog/blog-post-registry.test.ts",
    "--config",
    vitestConfigPath,
    "--configLoader",
    "runner",
  ];
  return new Promise((resolve, reject) => {
    const child = spawn(vitestExecutablePath, vitestArguments, {
      cwd: workspaceRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const outputChunks = [];
    child.stdout.on("data", (chunk) => outputChunks.push(chunk));
    child.stderr.on("data", (chunk) => outputChunks.push(chunk));
    child.on("error", reject);
    child.on("close", (exitCode, signal) => {
      fs.writeFileSync(vitestLogPath, Buffer.concat(outputChunks));
      if (exitCode === null) {
        reject(new Error(`vitest closed by signal ${signal}. Log: ${vitestLogPath}`));
        return;
      }
      resolve(exitCode);
    });
  });
}

async function main() {
  const before = readSharedCacheSnapshot();
  fs.writeFileSync(
    path.join(scriptDirectory, "shared-before.json"),
    `${JSON.stringify(before, null, 2)}\n`,
  );
  const vitestExitCode = await runBlogRegistryVitest();
  const after = readSharedCacheSnapshot();
  fs.writeFileSync(
    path.join(scriptDirectory, "shared-after.json"),
    `${JSON.stringify(after, null, 2)}\n`,
  );
  assertSameSnapshot("shared results.json and .vite-temp", before, after);
  if (vitestExitCode !== 0) {
    throw new Error(`vitest exited ${vitestExitCode}. Log: ${vitestLogPath}`);
  }
  const worktreeResults = readResultsSnapshot(worktreeResultsPath);
  assertWorktreeResults(worktreeResults);
  fs.writeFileSync(
    path.join(scriptDirectory, "worktree-results.json"),
    `${JSON.stringify(worktreeResults, null, 2)}\n`,
  );
  assertTrackedDiffEmpty();
  process.stdout.write(
    `isolated vitest exit ${vitestExitCode}\nworktree results ${worktreeResults.path}\nresult entries ${worktreeResults.resultEntryCount}\nshared results sha256 ${after.results.sha256}\n`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
