# 角色 G 验证报告 · how to harvest stardew valley

- 任务：`task_da302b3c0a67`；派发：`ctx_ca7a77081054`
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 预览：`http://127.0.0.1:3004`，PID `44772`，cwd 为本树，本轮没有重启，也没有动 3003。
- 英文页：`http://127.0.0.1:3004/how-to-harvest-stardew-valley`
- 中文页：`http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`
- 这不是独立 E 的页面 PASS，也不是用户终审，也没有部署。
- 当前结果是 Q 写入授权 exclude 之后的重跑。下面第一张表是重跑前的失败证据，保留不覆盖。

## 重跑（Q 完成后）

独立核对 `git diff -- tsconfig.json`：只在 `exclude` 增加 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/files`。`compilerOptions`、`include`、`strict` 未变。本角色没有改 `tsconfig.json`。

| 命令 | 退出码 | 结果 | 日志 |
| --- | ---: | --- | --- |
| `git diff --check` | 0 | stdout 与 stderr 都是 0 字节 | `git-diff-check-r2.stdout.txt`、`git-diff-check-r2.exit.txt` |
| `pnpm typecheck` | 0 | `tsc --noEmit` 无输出 | `typecheck-r2.stdout.txt`、`typecheck-r2.stderr.txt`、`typecheck-r2.exit.txt` |
| `pnpm exec next build --webpack` | 0 | 66 个静态页生成完成 | `build-webpack-r2.stdout.txt`、`build-webpack-r2.stderr.txt`、`build-webpack-r2.exit.txt` |
| 隔离 Vitest 8 个文件 | 0 | 8 个文件、93 项通过、0 失败 | `vitest-r2.stdout.txt`、`vitest-r2.stderr.txt`、`vitest-r2.exit.txt` |
| 两语言与六图 HTTP 回读 | 0 | 8 条记录，状态、标记和哈希都符合 | `http-reread-r2.stdout.txt`、`http-readback-r2.json` |
| lint | 未运行 | `package.json` 没有 lint 脚本，不新增依赖 | 无 |

Webpack 构建把 `next-env.d.ts` 改成 288 字节，SHA-256 `1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b`。已用 `next-env.d.ts.before` 拷回。恢复后 SHA-256 仍是 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，296 字节。

新导出：`out/how-to-harvest-stardew-valley.html` 56964 字节，含新英文标题，不含 “Right-Click a Parsnip”。`out/zh/how-to-harvest-stardew-valley.html` 53931 字节，含新中文标题，不含「羽衣甘蓝需要镰刀」。这次 Vitest 在该导出之后运行，`removed-public-pages.test.ts` 读的是这份新 `out/`。

预览没有重启。PID `44772` 的 cwd 仍是本树，监听 `127.0.0.1:3004`。英文 `http://127.0.0.1:3004/how-to-harvest-stardew-valley` 与中文 `http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley` 都是 HTTP 200。六张图 HTTP 200，字节和 SHA-256 与冻结交接一致。HTML 副本是 `http-en-r2.html`、`http-zh-r2.html`。两页 `loading="lazy"` 都是 2 次。封面 caption 和 `farm_evening_1920x1080.png` 仍不在 HTML 里，模板未改。

Vitest 缓存仍在本树 `.next/verification-cache/vite`。共享 `node_modules/.vite-temp` 不存在。没有跑 `pnpm test`，也没有跑默认 Turbopack build，也没有动 3003。

## 首轮命令（失败证据，日志未覆盖）

| 命令 | 退出码 | 结果 | 日志 |
| --- | ---: | --- | --- |
| `git diff --check` | 0 | 无空白错误 | `git-diff-check.stdout.txt`、`git-diff-check.exit.txt` |
| `pnpm typecheck` | 2 | 52 个错误，全部在既有 baseline 快照 | `typecheck.stdout.txt`、`typecheck.exit.txt` |
| `pnpm exec next build --webpack` | 1 | 编译过了，类型检查被同一批 baseline 快照拦住 | `build-webpack.stdout.txt`、`build-webpack.stderr.txt`、`build-webpack.exit.txt` |
| 隔离 Vitest 8 个文件 | 0 | 8 个文件、93 项通过、0 失败 | `vitest.stdout.txt`、`vitest.exit.txt` |
| `pnpm exec tsx …/assembly-g/compare_visible_body.mts` | 0 | 双语可见正文与 21 条引用 URL 对齐 | `../assembly-g/visible-body-comparison.json` |
| lint | 未运行 | `package.json` 没有 lint 脚本，本轮不新增依赖 | 无 |

Vitest 命令：

```sh
pnpm exec vitest run \
  tests/blog/blog-components.test.tsx \
  tests/blog/blog-home-state.test.ts \
  tests/blog/blog-planner-cta.test.tsx \
  tests/blog/blog-post-registry.test.ts \
  tests/i18n/public-route-registry.test.ts \
  tests/routes/blog-routes.test.tsx \
  tests/routes/removed-public-pages.test.ts \
  tests/seo/canonical-public-routes.test.ts \
  --config docs/blog-ops/how-to-harvest-stardew-valley/verification/cache-isolation/vitest.config.mjs \
  --configLoader runner
```

缓存写在本树 `.next/verification-cache/vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json`。共享 `node_modules/.vite-temp` 不存在。没有跑 `pnpm test`，也没有跑默认 Turbopack build。

## 首轮 typecheck 与 webpack build

`pnpm typecheck` 的 52 个错误分布：

- `rework-v2/baseline/files/src/blog/blog-post-registry.tsx`：49
- 同目录下的收获文英文组件、中文组件、`blog-copy.ts`：各 1

这些是 2026-10-13 08:03 的快照副本，相对路径指不到真正的组件。产品 `src/` 和 `tests/` 在这次输出里没有错误。更早一次成功的 webpack 日志是 02:39，早于这批快照。本轮没有改 `tsconfig`、Next 配置，也没有删快照。

因此 `next build --webpack` 在 “Compiled successfully in 5.1s” 之后停在同一批类型错误，退出码 1。`out/how-to-harvest-stardew-valley.html` 仍是旧标题 “Right-Click a Parsnip”。这次没有生成新的静态导出。

构建曾把 `next-env.d.ts` 从 296 字节改成 288 字节。已按构建前副本恢复。恢复后 SHA-256 为 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`。副本在 `next-env.d.ts.before`。

`removed-public-pages.test.ts` 读的是这个旧 `out/`。它 3 项通过，只说明旧导出里没有已删除页面，不能说明新正文已经导出。

## 首轮 HTTP 回读

两个文章路由都是 HTTP 200、`text/html`。英文页有新标题，没有旧标题。中文页有新标题，没有「羽衣甘蓝需要镰刀」。两边都有两张正文 webp、ConcernedApe 正文署名、`loading="lazy"` 两次，以及对应语言的最晚播种日和温室链接。旧方法图路径不在这两页 HTML 里。

六张资产 HTTP 200，字节和 SHA-256 与冻结交接一致。明细在 `http-readback.json`。HTML 副本是 `http-en.html`、`http-zh.html`。

封面 caption 和 `farm_evening_1920x1080.png` 不在 HTML 里。原因写在 `../assembly-g/report.md`。

## 未完成

- 用户还没有在页面上终审。技术冻结和这次命令通过都不是用户通过。
- 没有 commit、merge、push 或部署。
- 独立 E 还没有做这轮页面的桌面和手机验收。本报告不是浏览器 PASS。
- 封面图注没有现成模板字段，所以页面上看不到。正文两张图的 ConcernedApe 署名在。
