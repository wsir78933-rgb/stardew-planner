import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const testRunParentProcessId = process.ppid;
const workspaceIdentity = createHash("sha256")
  .update(process.cwd())
  .digest("hex");
const staticExportFixtureRunPath = join(
  tmpdir(),
  `stardew-planner-static-export-${workspaceIdentity}-run-${String(testRunParentProcessId)}`,
);
const staticExportFixtureLockDirectoryPath = `${staticExportFixtureRunPath}.lock`;
const staticExportFixtureLockOwnerPath = join(
  staticExportFixtureLockDirectoryPath,
  "owner.json",
);
const staticExportFixtureReadyDirectoryPath = `${staticExportFixtureRunPath}.ready`;
const staticExportFixtureBuildFailurePath = `${staticExportFixtureRunPath}.failure.txt`;
const staticExportFixtureLockTimeoutMilliseconds = 120_000;
const staticExportFixtureLockRetryMilliseconds = 25;
const staticExportFixtureOwnerHandoffMilliseconds = 250;

type StaticExportFixtureOwner = Readonly<{
  lockId: string;
  processId: number;
  testRunParentProcessId: number;
}>;

type StaticExportFixtureOwnerSnapshot =
  | Readonly<{
      status: "invalid";
      receivedState: string;
    }>
  | Readonly<{
      status: "missing";
    }>
  | Readonly<{
      owner: StaticExportFixtureOwner;
      status: "present";
    }>;

function waitForStaticExportFixtureLock(): Promise<void> {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, staticExportFixtureLockRetryMilliseconds);
  });
}

function getFileSystemErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

function isProcessAlive(processId: number): boolean {
  try {
    process.kill(processId, 0);
    return true;
  } catch (error) {
    if (getFileSystemErrorCode(error) === "ESRCH") {
      return false;
    }

    throw error;
  }
}

function readStaticExportFixtureOwner(): StaticExportFixtureOwnerSnapshot {
  let serializedOwner: string;

  try {
    serializedOwner = readFileSync(staticExportFixtureLockOwnerPath, "utf8");
  } catch (error) {
    if (getFileSystemErrorCode(error) === "ENOENT") {
      return { status: "missing" };
    }

    throw error;
  }

  let parsedOwner: unknown;

  try {
    parsedOwner = JSON.parse(serializedOwner);
  } catch {
    return {
      receivedState: JSON.stringify(serializedOwner),
      status: "invalid",
    };
  }

  if (
    typeof parsedOwner !== "object" ||
    parsedOwner === null ||
    !Number.isInteger((parsedOwner as { processId?: unknown }).processId) ||
    (parsedOwner as { processId: number }).processId <= 0 ||
    typeof (parsedOwner as { lockId?: unknown }).lockId !== "string" ||
    (parsedOwner as { lockId: string }).lockId.length === 0 ||
    (parsedOwner as { testRunParentProcessId?: unknown })
      .testRunParentProcessId !== testRunParentProcessId
  ) {
    return {
      receivedState: JSON.stringify(parsedOwner),
      status: "invalid",
    };
  }

  return {
    owner: parsedOwner as StaticExportFixtureOwner,
    status: "present",
  };
}

function getStaticExportFixtureLockAgeMilliseconds(): number | undefined {
  try {
    return Date.now() - statSync(staticExportFixtureLockDirectoryPath).ctimeMs;
  } catch (error) {
    if (getFileSystemErrorCode(error) === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

function readStaticExportFixtureBuildFailure(): string | undefined {
  try {
    return readFileSync(staticExportFixtureBuildFailurePath, "utf8");
  } catch (error) {
    if (getFileSystemErrorCode(error) === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

function throwIfStaticExportBuildFailed(): void {
  const receivedFailureState = readStaticExportFixtureBuildFailure();

  if (receivedFailureState === undefined) {
    return;
  }

  throw new Error(
    `Static export fixture build failed in another worker. Failure path: ${staticExportFixtureBuildFailurePath}. Test-run parent process ID ${String(testRunParentProcessId)}. Received failure state: ${JSON.stringify(receivedFailureState)}.`,
  );
}

function createInvalidCurrentRunLockError(
  ownerSnapshot: Exclude<
    StaticExportFixtureOwnerSnapshot,
    Readonly<{ owner: StaticExportFixtureOwner; status: "present" }>
  >,
): Error {
  const receivedState =
    ownerSnapshot.status === "missing"
      ? "missing"
      : ownerSnapshot.receivedState;

  return new Error(
    `Static export fixture owner metadata remained invalid beyond the ${String(staticExportFixtureOwnerHandoffMilliseconds)}ms handoff window. Lock path: ${staticExportFixtureLockDirectoryPath}. Test-run parent process ID ${String(testRunParentProcessId)}. Received owner state: ${receivedState}.`,
  );
}

async function claimStaticExportBuild(): Promise<boolean> {
  const lockWaitDeadline =
    Date.now() + staticExportFixtureLockTimeoutMilliseconds;

  while (true) {
    throwIfStaticExportBuildFailed();

    if (existsSync(staticExportFixtureReadyDirectoryPath)) {
      return false;
    }

    try {
      mkdirSync(staticExportFixtureLockDirectoryPath);
      writeFileSync(
        staticExportFixtureLockOwnerPath,
        JSON.stringify({
          lockId: randomUUID(),
          processId: process.pid,
          testRunParentProcessId,
        }),
        "utf8",
      );
      return true;
    } catch (error) {
      if (getFileSystemErrorCode(error) !== "EEXIST") {
        throw error;
      }
    }

    if (existsSync(staticExportFixtureReadyDirectoryPath)) {
      return false;
    }

    throwIfStaticExportBuildFailed();

    const ownerSnapshot = readStaticExportFixtureOwner();
    const lockAgeMilliseconds =
      getStaticExportFixtureLockAgeMilliseconds();

    if (ownerSnapshot.status !== "present") {
      if (
        lockAgeMilliseconds !== undefined &&
        lockAgeMilliseconds >= staticExportFixtureOwnerHandoffMilliseconds
      ) {
        throw createInvalidCurrentRunLockError(ownerSnapshot);
      }

      await waitForStaticExportFixtureLock();
      continue;
    }

    if (!isProcessAlive(ownerSnapshot.owner.processId)) {
      throw new Error(
        `Static export fixture lock owner is no longer alive. Lock path: ${staticExportFixtureLockDirectoryPath}. Test-run parent process ID ${String(testRunParentProcessId)}. Received owner state: ${JSON.stringify(ownerSnapshot.owner)}.`,
      );
    }

    if (Date.now() >= lockWaitDeadline) {
      throw new Error(
        `Timed out waiting for the static export fixture build. Lock path: ${staticExportFixtureLockDirectoryPath}. Test-run parent process ID ${String(testRunParentProcessId)}. Received owner state: ${JSON.stringify(ownerSnapshot.owner)}.`,
      );
    }

    await waitForStaticExportFixtureLock();
  }
}

function buildStaticExport(): void {
  execFileSync("pnpm", ["build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: "inherit",
  });
}

function describeBuildFailure(buildFailure: unknown): string {
  if (buildFailure instanceof Error) {
    return `${buildFailure.name}: ${buildFailure.message}`;
  }

  return String(buildFailure);
}

export async function ensureStaticExportArtifactFixture(): Promise<void> {
  const currentProcessMustBuild = await claimStaticExportBuild();

  if (!currentProcessMustBuild) {
    return;
  }

  try {
    buildStaticExport();
  } catch (buildFailure) {
    try {
      writeFileSync(
        staticExportFixtureBuildFailurePath,
        describeBuildFailure(buildFailure),
        {
          encoding: "utf8",
          flag: "wx",
        },
      );
    } catch (failurePublicationError) {
      throw new AggregateError(
        [buildFailure, failurePublicationError],
        `Static export build failed and its failure state could not be published. Failure path: ${staticExportFixtureBuildFailurePath}.`,
      );
    }

    throw buildFailure;
  }

  mkdirSync(staticExportFixtureReadyDirectoryPath);
}
