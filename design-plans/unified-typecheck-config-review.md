# Typecheck configuration review

## Result

The current typecheck script explicitly checks the browser project and then the Worker project. The browser project excludes Worker sources and tests; the Worker project explicitly includes them. The effective TypeScript configurations confirm that split, and the package manifest has no dependency changes.

This verifies project selection only. It is not a compile or build result.

## Evidence

- `package.json:15` runs `tsc --noEmit --incremental false`, followed by `tsc --project tsconfig.workers.json --noEmit --incremental false`. The `&&` means the Worker pass runs after the browser pass succeeds.
- `tsconfig.json:32-38` includes the application TypeScript, TSX, and Next generated type files. `tsconfig.json:39-45` excludes `worker-configuration.d.ts`, `workers/**/*.ts`, and `tests/workers/**/*.ts` from that pass.
- `tsconfig.workers.json:7-12` explicitly includes the generated Worker bindings, Worker sources, and Worker tests, with only `node_modules` excluded.
- `pnpm exec tsc --showConfig --project tsconfig.json` reported 640 files, including the homepage component and test files, and zero Worker sources, Worker tests, or `worker-configuration.d.ts`.
- `pnpm exec tsc --showConfig --project tsconfig.workers.json` reported 11 files: the Worker bindings, five Worker source files, and five Worker test files. This confirms that `skipLibCheck: true` inherited from `tsconfig.json:16` has not excluded those source and test files from the Worker project.
- `git diff -- package.json tsconfig.json tsconfig.workers.json` shows the typecheck script and browser exclusions as the relevant typecheck changes. The only package manifest diff outside that script is a concurrent `dev:cloud` command change at `package.json:8`; it is outside this review. No `dependencies` or `devDependencies` entries changed.

## Commands and limits

Read-only checks run:

- `pnpm exec tsc --showConfig --project tsconfig.json`
- `pnpm exec tsc --showConfig --project tsconfig.workers.json`
- `git diff -- package.json tsconfig.json tsconfig.workers.json`

No typecheck, build, source edit, dependency edit, or runtime command was run for this configuration review. The compile outcome must be taken from the separate typecheck run.
