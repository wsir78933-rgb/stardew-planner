# G-runtime evidence: `pine-tree-stardew`

- **Review date:** 2026-09-23 (Asia/Shanghai)
- **Scope:** local runtime evidence only, after registry/test assembly.
- **Result:** **PASS** — this worktree is serving the requested four routes on `127.0.0.1:3003`.
- **Only file written by this task:** `docs/blog-ops/pine-tree-stardew/G-runtime-evidence.md`.
- **Not performed:** no source, public asset, test, registry, identity, dependency, database, commit, push, deploy, or browser UI changes.

## Worktree and script identity

Exact command output:

```text
$ pwd
/Users/wusir/orca/workspaces/stardew planner/博客二
$ git rev-parse --show-toplevel; git branch --show-current; git rev-parse HEAD
/Users/wusir/orca/workspaces/stardew planner/博客二
博客二
6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c
$ grep -A1 ... package.json scripts
dev: sh scripts/dev.sh
start: serve out
build: next build
test: vitest
typecheck: tsc --noEmit
$ sed -n ... scripts/dev.sh
#!/bin/sh
set -eu

DEV_PORT=3003

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

sh "$script_dir/free-listen-port.sh" "$DEV_PORT"
exec next dev --port "$DEV_PORT"
```

Before starting, the requested port had no listener rows from:

```text
$ lsof -nP -iTCP:3003 -sTCP:LISTEN
[no output; port 3003 was free]
```

Therefore `scripts/free-listen-port.sh` had no existing `3003` listener to signal. Existing listeners observed on other ports were not touched.

## Server start and process ownership

The project script was started from this worktree with `pnpm dev`. The dev-server PTY was intentionally left running for downstream local reviewers; its current launch log was:

```text
> @ dev /Users/wusir/orca/workspaces/stardew planner/博客二
> sh scripts/dev.sh

▲ Next.js 16.3.0 (Turbopack)
- Local:         http://localhost:3003
- Network:       http://192.168.18.196:3003
✓ Ready in 329ms
✓ Running next.config.ts took 115ms
```

Exact listener/PID/cwd output:

```text
$ lsof -nP -iTCP:3003 -sTCP:LISTEN
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    96068 wusir   17u  IPv6 0x6f90abcc2553319b      0t0  TCP *:3003 (LISTEN)
$ listener_pid=...; ps ...; lsof cwd ...
listener_pid=96068 listener_ppid=96054 pnpm_pid=96016
96068 96054 wusir S+   next-server (v16.3.0) 
96054 96016 wusir S+   node /Users/wusir/orca/workspaces/stardew planner/博客二/node_modules/.bin/../.pnpm/next@16.3.0_@babel+core@7.29.7_@types+node@22.17.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/bin/next dev --port 3003
96016 91085 wusir Ss+  node /opt/homebrew/opt/node@24/bin/pnpm dev
p96068
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
p96054
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
p96016
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
```

The listener PID is `96068`; its parent Next process is `96054`, and the `pnpm dev` launcher is `96016`. All three processes report the exact target worktree as cwd, and the Next executable path is under that worktree's `node_modules`. This establishes port/process/path identity rather than relying on a self-report.

## Requested route probes

The following direct probes used `curl --max-time 30 -D <headers> -o <body> -w ...` against `http://127.0.0.1:3003` and returned HTTP 200 without redirects:

```text
ROUTE /pine-tree-stardew STATUS 200 FINAL_URL http://127.0.0.1:3003/pine-tree-stardew BYTES 133882 TYPE text/html; charset=utf-8
ROUTE /pine-tree-stardew TITLE Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar H1 Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar
HTTP/1.1 200 OK|Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding|Link: </favicon.png>; rel=preload; as="image"|Cache-Control: no-cache, must-revalidate|
ROUTE /zh/pine-tree-stardew STATUS 200 FINAL_URL http://127.0.0.1:3003/zh/pine-tree-stardew BYTES 119446 TYPE text/html; charset=utf-8
ROUTE /zh/pine-tree-stardew TITLE 星露谷松树种植先看格子，不浇水也不能随便种 H1 星露谷松树种植先看格子，不浇水也不能随便种
HTTP/1.1 200 OK|Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding|Link: </favicon.png>; rel=preload; as="image"|Cache-Control: no-cache, must-revalidate|
ROUTE /blog STATUS 200 FINAL_URL http://127.0.0.1:3003/blog BYTES 69910 TYPE text/html; charset=utf-8
ROUTE /blog TITLE Stardew Valley Planning Guides H1 Stardew Valley Planning Guides
HTTP/1.1 200 OK|Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding|Link: </favicon.png>; rel=preload; as="image"|Cache-Control: no-cache, must-revalidate|
ROUTE /zh/blog STATUS 200 FINAL_URL http://127.0.0.1:3003/zh/blog BYTES 67734 TYPE text/html; charset=utf-8
ROUTE /zh/blog TITLE 星露谷农场规划指南 H1 星露谷农场规划指南
HTTP/1.1 200 OK|Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding|Link: </favicon.png>; rel=preload; as="image"|Cache-Control: no-cache, must-revalidate|
```

## Cleanup boundary

- **Server retained:** `http://127.0.0.1:3003` remains available for downstream local EGo/browser reviewers.
- **Ownership:** only the verified chain `pnpm dev` PID `96016` → Next PID `96054` → listener PID `96068`, all cwd `/Users/wusir/orca/workspaces/stardew planner/博客二`, belongs to this runtime task.
- **Do not kill:** unrelated listeners or processes on other ports, including the existing `3002` and `40001` services observed during preflight.
- **If cleanup is later authorized:** re-check the PID/cwd/port identity first, then stop only this verified chain; no cleanup was performed in this task.

## Generated-file side-effect guard

Next 16 dev initially rewrote the clean generated `next-env.d.ts` reference paths from `.next/dev/types` to `.next/types` while starting. Because the task allowlist permits only this report, I restored that one startup side effect to its preflight `HEAD` baseline and rechecked it:

```text
before_hash=1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b head_hash=0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc
after_hash=0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc
next-env.d.ts restored to HEAD baseline; no diff remains.
```

The listener stayed active and all four route probes remained HTTP 200 after restoration. The relevant post-write status entry is only:

```text
?? docs/blog-ops/pine-tree-stardew/G-runtime-evidence.md
```
