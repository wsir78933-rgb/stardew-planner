import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const temporaryProjectDirectoryPaths: string[] = [];
const fixtureModuleUrl = pathToFileURL(
  resolve("tests/support/static-export-artifact-fixture.ts"),
).href;
const tsxLoaderPath = resolve("node_modules/tsx/dist/loader.mjs");

type FixtureProcessResult = Readonly<{
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  standardError: string;
  timedOut: boolean;
}>;

function createTemporaryBuildProject(
  buildMustFail = false,
): Readonly<{
  buildArtifactPath: string;
  buildInvocationPath: string;
  projectDirectoryPath: string;
}> {
  const projectDirectoryPath = realpathSync(
    mkdtempSync(join(tmpdir(), "stardew-static-export-fixture-test-")),
  );
  const buildArtifactPath = join(projectDirectoryPath, "build-complete.txt");
  const buildInvocationPath = join(projectDirectoryPath, "build-invocations.txt");

  temporaryProjectDirectoryPaths.push(projectDirectoryPath);
  writeFileSync(
    join(projectDirectoryPath, "package.json"),
    JSON.stringify({
      private: true,
      scripts: {
        build: "node build.mjs",
      },
    }),
    "utf8",
  );
  writeFileSync(
    join(projectDirectoryPath, "build.mjs"),
    [
      'import { appendFileSync, writeFileSync } from "node:fs";',
      `appendFileSync(${JSON.stringify(buildInvocationPath)}, "build\\n", "utf8");`,
      ...(buildMustFail
        ? ['throw new Error("controlled build failure");']
        : [
            `writeFileSync(${JSON.stringify(buildArtifactPath)}, "built", "utf8");`,
          ]),
    ].join("\n"),
    "utf8",
  );

  return { buildArtifactPath, buildInvocationPath, projectDirectoryPath };
}

function getWorkspaceFixturePath(projectDirectoryPath: string): string {
  return join(
    tmpdir(),
    `stardew-planner-static-export-${createHash("sha256")
      .update(projectDirectoryPath)
      .digest("hex")}`,
  );
}

function getFixtureLockDirectoryPath(
  projectDirectoryPath: string,
  testRunnerProcessId: number,
): string {
  const workspaceFixturePath = getWorkspaceFixturePath(projectDirectoryPath);

  return `${workspaceFixturePath}-run-${String(testRunnerProcessId)}.lock`;
}

function startFixtureProcess(
  projectDirectoryPath: string,
  timeoutMilliseconds: number,
): Readonly<{
  childProcess: ChildProcessWithoutNullStreams;
  result: Promise<FixtureProcessResult>;
}> {
  const fixtureInvocation = [
    `import(${JSON.stringify(fixtureModuleUrl)})`,
    ".then((fixtureModule) =>",
    "  fixtureModule.default.ensureStaticExportArtifactFixture(),",
    ")",
    ".catch((error) => {",
    "  console.error(error);",
    "  process.exitCode = 1;",
    "});",
  ].join("\n");
  const childProcess = spawn(
    process.execPath,
    ["--import", tsxLoaderPath, "--eval", fixtureInvocation],
    {
      cwd: projectDirectoryPath,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: "pipe",
    },
  );
  const result = new Promise<FixtureProcessResult>((resolveResult) => {
    let standardError = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      childProcess.kill("SIGKILL");
    }, timeoutMilliseconds);

    childProcess.stderr.setEncoding("utf8");
    childProcess.stderr.on("data", (chunk: string) => {
      standardError += chunk;
    });
    childProcess.once("close", (exitCode, signal) => {
      clearTimeout(timeout);
      resolveResult({ exitCode, signal, standardError, timedOut });
    });
  });

  return { childProcess, result };
}

function startOwnerPathToggler(
  fixtureOwnerPath: string,
  hiddenFixtureOwnerPath: string,
): ChildProcessWithoutNullStreams {
  const toggleScript = [
    'const { renameSync } = require("node:fs");',
    "const [ownerPath, hiddenOwnerPath] = process.argv.slice(1);",
    'process.stdout.write("ready\\n");',
    "while (true) {",
    "  try {",
    "    renameSync(ownerPath, hiddenOwnerPath);",
    "  } catch (error) {",
    '    if (error.code !== "ENOENT") throw error;',
    "  }",
    "  try {",
    "    renameSync(hiddenOwnerPath, ownerPath);",
    "  } catch (error) {",
    '    if (error.code !== "ENOENT") throw error;',
    "  }",
    "}",
  ].join("\n");

  return spawn(
    process.execPath,
    ["--eval", toggleScript, fixtureOwnerPath, hiddenFixtureOwnerPath],
    { stdio: "pipe" },
  );
}

function waitForTogglerReady(
  ownerPathToggler: ChildProcessWithoutNullStreams,
): Promise<void> {
  return new Promise((resolveReady, rejectReady) => {
    ownerPathToggler.stdout.setEncoding("utf8");
    ownerPathToggler.stdout.once("data", (chunk: string) => {
      if (chunk.includes("ready")) {
        resolveReady();
        return;
      }

      rejectReady(
        new Error(`Owner path toggler returned unexpected output: ${chunk}`),
      );
    });
    ownerPathToggler.once("error", rejectReady);
    ownerPathToggler.once("exit", (exitCode, signal) => {
      rejectReady(
        new Error(
          `Owner path toggler exited before ready. Exit code: ${String(exitCode)}. Signal: ${String(signal)}.`,
        ),
      );
    });
  });
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, milliseconds);
  });
}

afterEach(() => {
  for (const projectDirectoryPath of temporaryProjectDirectoryPaths.splice(0)) {
    const workspaceFixturePath = getWorkspaceFixturePath(projectDirectoryPath);

    for (const fixturePathSuffix of [
      ".lock",
      `-run-${String(process.pid)}.lock`,
      `-run-${String(process.pid)}.ready`,
      `-run-${String(process.pid)}.failure.txt`,
      `-run-${String(process.pid + 1)}.lock`,
    ]) {
      rmSync(`${workspaceFixturePath}${fixturePathSuffix}`, {
        force: true,
        recursive: true,
      });
    }
    rmSync(projectDirectoryPath, { force: true, recursive: true });
  }
});

describe("static export artifact fixture lock", () => {
  it("ignores pre-existing lock state outside the current test-run namespace", async () => {
    const { buildArtifactPath, projectDirectoryPath } =
      createTemporaryBuildProject();
    const previousRunLockDirectoryPath = getFixtureLockDirectoryPath(
      projectDirectoryPath,
      process.pid + 1,
    );
    const legacyWorkspaceLockDirectoryPath = `${getWorkspaceFixturePath(projectDirectoryPath)}.lock`;

    mkdirSync(previousRunLockDirectoryPath);
    mkdirSync(legacyWorkspaceLockDirectoryPath);

    const fixtureProcess = startFixtureProcess(projectDirectoryPath, 5_000);
    const fixtureProcessResult = await fixtureProcess.result;

    expect(fixtureProcessResult).toMatchObject({
      exitCode: 0,
      signal: null,
      standardError: "",
      timedOut: false,
    });
    expect(existsSync(buildArtifactPath)).toBe(true);
    expect(existsSync(previousRunLockDirectoryPath)).toBe(true);
    expect(existsSync(legacyWorkspaceLockDirectoryPath)).toBe(true);
  }, 10_000);

  it("fails fast without replacing an ownerless current-run lock", async () => {
    const { buildArtifactPath, projectDirectoryPath } =
      createTemporaryBuildProject();
    const currentRunLockDirectoryPath = getFixtureLockDirectoryPath(
      projectDirectoryPath,
      process.pid,
    );

    mkdirSync(currentRunLockDirectoryPath);
    const fixtureProcess = startFixtureProcess(projectDirectoryPath, 5_000);
    const fixtureProcessResult = await fixtureProcess.result;

    expect(fixtureProcessResult.exitCode).toBe(1);
    expect(fixtureProcessResult.signal).toBeNull();
    expect(fixtureProcessResult.timedOut).toBe(false);
    expect(fixtureProcessResult.standardError).toContain(
      currentRunLockDirectoryPath,
    );
    expect(fixtureProcessResult.standardError).toContain(
      `Test-run parent process ID ${String(process.pid)}`,
    );
    expect(fixtureProcessResult.standardError).toContain("owner metadata");
    expect(fixtureProcessResult.standardError).toContain("missing");
    expect(existsSync(currentRunLockDirectoryPath)).toBe(true);
    expect(
      existsSync(join(currentRunLockDirectoryPath, "owner.json")),
    ).toBe(false);
    expect(existsSync(buildArtifactPath)).toBe(false);
  }, 10_000);

  it("fails fast with received state for invalid current-run owner metadata", async () => {
    const { buildArtifactPath, projectDirectoryPath } =
      createTemporaryBuildProject();
    const currentRunLockDirectoryPath = getFixtureLockDirectoryPath(
      projectDirectoryPath,
      process.pid,
    );
    const currentRunOwnerPath = join(
      currentRunLockDirectoryPath,
      "owner.json",
    );

    mkdirSync(currentRunLockDirectoryPath);
    writeFileSync(currentRunOwnerPath, "not-json", "utf8");
    const fixtureProcess = startFixtureProcess(projectDirectoryPath, 5_000);
    const fixtureProcessResult = await fixtureProcess.result;

    expect(fixtureProcessResult.exitCode).toBe(1);
    expect(fixtureProcessResult.signal).toBeNull();
    expect(fixtureProcessResult.timedOut).toBe(false);
    expect(fixtureProcessResult.standardError).toContain(
      currentRunLockDirectoryPath,
    );
    expect(fixtureProcessResult.standardError).toContain(
      JSON.stringify("not-json"),
    );
    expect(existsSync(buildArtifactPath)).toBe(false);
    expect(readFileSync(currentRunOwnerPath, "utf8")).toBe("not-json");
  }, 10_000);

  it("retries when owner metadata disappears transiently during handoff", async () => {
    const { buildArtifactPath, projectDirectoryPath } =
      createTemporaryBuildProject();
    const currentRunLockDirectoryPath = getFixtureLockDirectoryPath(
      projectDirectoryPath,
      process.pid,
    );
    const legacyWorkspaceLockDirectoryPath = `${getWorkspaceFixturePath(projectDirectoryPath)}.lock`;
    const currentRunOwnerPath = join(
      currentRunLockDirectoryPath,
      "owner.json",
    );
    const hiddenCurrentRunOwnerPath = join(
      currentRunLockDirectoryPath,
      "owner.hidden.json",
    );
    const legacyWorkspaceOwnerPath = join(
      legacyWorkspaceLockDirectoryPath,
      "owner.json",
    );
    const hiddenLegacyWorkspaceOwnerPath = join(
      legacyWorkspaceLockDirectoryPath,
      "owner.hidden.json",
    );
    const fixtureProcessCount = 8;

    mkdirSync(currentRunLockDirectoryPath);
    mkdirSync(legacyWorkspaceLockDirectoryPath);
    writeFileSync(
      currentRunOwnerPath,
      JSON.stringify({
        processId: process.pid,
        lockId: "live-owner",
        testRunParentProcessId: process.pid,
      }),
      "utf8",
    );
    writeFileSync(
      legacyWorkspaceOwnerPath,
      JSON.stringify({
        processId: process.pid,
        lockId: "live-owner",
        testRunParentProcessId: process.pid,
      }),
      "utf8",
    );

    const currentRunOwnerPathToggler = startOwnerPathToggler(
      currentRunOwnerPath,
      hiddenCurrentRunOwnerPath,
    );
    const legacyWorkspaceOwnerPathToggler = startOwnerPathToggler(
      legacyWorkspaceOwnerPath,
      hiddenLegacyWorkspaceOwnerPath,
    );
    await Promise.all([
      waitForTogglerReady(currentRunOwnerPathToggler),
      waitForTogglerReady(legacyWorkspaceOwnerPathToggler),
    ]);
    const fixtureProcesses = Array.from(
      { length: fixtureProcessCount },
      () => startFixtureProcess(projectDirectoryPath, 10_000),
    );

    try {
      await wait(1_500);
    } finally {
      currentRunOwnerPathToggler.kill("SIGKILL");
      legacyWorkspaceOwnerPathToggler.kill("SIGKILL");
      rmSync(currentRunLockDirectoryPath, { force: true, recursive: true });
      rmSync(legacyWorkspaceLockDirectoryPath, {
        force: true,
        recursive: true,
      });
    }

    const fixtureProcessResults = await Promise.all(
      fixtureProcesses.map((fixtureProcess) => fixtureProcess.result),
    );

    expect(
      fixtureProcessResults.filter(
        (fixtureProcessResult) =>
          fixtureProcessResult.exitCode !== 0 || fixtureProcessResult.timedOut,
      ),
    ).toEqual([]);
    expect(existsSync(buildArtifactPath)).toBe(true);
  }, 15_000);

  it("runs one real build across concurrent fixture processes", async () => {
    const { buildArtifactPath, buildInvocationPath, projectDirectoryPath } =
      createTemporaryBuildProject();
    const fixtureProcesses = Array.from({ length: 4 }, () =>
      startFixtureProcess(projectDirectoryPath, 10_000),
    );

    const fixtureProcessResults = await Promise.all(
      fixtureProcesses.map((fixtureProcess) => fixtureProcess.result),
    );

    expect(
      fixtureProcessResults.filter(
        (fixtureProcessResult) =>
          fixtureProcessResult.exitCode !== 0 || fixtureProcessResult.timedOut,
      ),
    ).toEqual([]);
    expect(readFileSync(buildInvocationPath, "utf8").trim().split("\n")).toEqual([
      "build",
    ]);
    expect(readFileSync(buildArtifactPath, "utf8")).toBe("built");
  }, 15_000);

  it("publishes one real build failure to every concurrent fixture process", async () => {
    const { buildArtifactPath, buildInvocationPath, projectDirectoryPath } =
      createTemporaryBuildProject(true);
    const fixtureProcesses = Array.from({ length: 4 }, () =>
      startFixtureProcess(projectDirectoryPath, 5_000),
    );

    const fixtureProcessResults = await Promise.all(
      fixtureProcesses.map((fixtureProcess) => fixtureProcess.result),
    );

    expect(
      fixtureProcessResults.every(
        (fixtureProcessResult) =>
          fixtureProcessResult.exitCode === 1 &&
          fixtureProcessResult.signal === null &&
          !fixtureProcessResult.timedOut,
      ),
    ).toBe(true);
    expect(
      fixtureProcessResults.some((fixtureProcessResult) =>
        fixtureProcessResult.standardError.includes("controlled build failure"),
      ),
    ).toBe(true);
    expect(
      fixtureProcessResults.filter((fixtureProcessResult) =>
        fixtureProcessResult.standardError.includes(
          "Static export fixture build failed in another worker",
        ),
      ),
    ).toHaveLength(3);
    expect(readFileSync(buildInvocationPath, "utf8").trim().split("\n")).toEqual([
      "build",
    ]);
    expect(existsSync(buildArtifactPath)).toBe(false);
  }, 15_000);
});
