import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import rootVitestConfig from "../../../../../vitest.config.ts";

const configDirectoryUrl = new URL(".", import.meta.url);

function resolveWorkspaceRoot() {
  return path.resolve(fileURLToPath(new URL("../../../../../", configDirectoryUrl)));
}

function resolveVerificationViteCacheDir(workspaceRoot) {
  const verificationViteCacheDir = path.join(
    workspaceRoot,
    ".next",
    "verification-cache",
    "vite",
  );
  if (!path.isAbsolute(verificationViteCacheDir)) {
    throw new Error(
      `verification Vite cacheDir is not absolute: ${verificationViteCacheDir}`,
    );
  }
  const expectedRootPrefix = `${workspaceRoot}${path.sep}`;
  if (!verificationViteCacheDir.startsWith(expectedRootPrefix)) {
    throw new Error(
      `verification Vite cacheDir escaped the workspace: ${verificationViteCacheDir}`,
    );
  }
  return verificationViteCacheDir;
}

function requireRootVitestConfig(configValue) {
  if (
    configValue === null ||
    typeof configValue !== "object" ||
    Array.isArray(configValue)
  ) {
    throw new Error(
      `root vitest config must be a plain object, received ${Object.prototype.toString.call(configValue)}`,
    );
  }
  if (!Object.hasOwn(configValue, "test")) {
    throw new Error("root vitest config is missing test");
  }
  if (
    Object.hasOwn(configValue, "cacheDir") &&
    configValue.cacheDir !== undefined
  ) {
    throw new Error(
      `root vitest config cacheDir must stay unset, received ${String(configValue.cacheDir)}`,
    );
  }
  return configValue;
}

function createCacheIsolatedVitestConfig() {
  const rootConfig = requireRootVitestConfig(rootVitestConfig);
  const workspaceRoot = resolveWorkspaceRoot();
  const verificationViteCacheDir = resolveVerificationViteCacheDir(workspaceRoot);
  return defineConfig({
    ...rootConfig,
    root: workspaceRoot,
    cacheDir: verificationViteCacheDir,
  });
}

export default createCacheIsolatedVitestConfig();
