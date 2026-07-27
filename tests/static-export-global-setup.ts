import { spawnSync } from "node:child_process";

export default function buildStaticExportForVitest(): void {
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
      `Static build failed before Vitest. Exit code: ${String(buildProcess.status)}. Stderr: ${buildProcess.stderr}. Stdout: ${buildProcess.stdout}`,
    );
  }
}
