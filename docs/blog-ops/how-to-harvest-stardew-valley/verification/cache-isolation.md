# 缓存隔离验证（Q3）

这次只验证一条可重复命令：用 Vitest 3.2.4 的公开配置，把一次小测试的结果缓存写进当前工作树的 `.next/verification-cache`，并核对共享 `results.json` 与 `.vite-temp` 在这条命令前后不变。

这不是操作系统权限隔离。`node_modules` 仍是指向主仓库的符号链接。别的命令仍可能写入它。

## 给后续 G 的命令

在当前工作树根目录执行：

```sh
node docs/blog-ops/how-to-harvest-stardew-valley/verification/cache-isolation/verify-cache-isolation.mjs
```

脚本只做四步：读取共享 `results.json` 和 `.vite-temp`，运行下面这条公开命令，再读一次，最后确认本树结果文件存在。不要用 `pnpm test`，因为根目录 `pretest` 会先构建。

```sh
node_modules/.bin/vitest run tests/blog/blog-post-registry.test.ts \
  --config docs/blog-ops/how-to-harvest-stardew-valley/verification/cache-isolation/vitest.config.mjs \
  --configLoader runner
```

配置文件只给根 `vitest.config.ts` 追加 Vite 公开字段 `cacheDir`，指向本树 `.next/verification-cache/vite`。没有改根配置、`package.json`、scripts、产品源码或测试。

## 这次运行的真实结果

| 项目 | 结果 |
|---|---|
| 验证脚本退出码 | `0` |
| Vitest 退出码 | `0` |
| 测试 | `tests/blog/blog-post-registry.test.ts`：1 个文件通过，19 个测试通过，0 失败 |
| 日志 | `verification/cache-isolation/vitest.log`，Duration 1.18s，Start at 23:27:56 |
| 跟踪文件 diff | `git diff --stat` 无输出，退出码 `0` |

19 个测试来自该文件里的 14 个 `it`，加上第 712 行 `it.each` 的 5 组。这个文件不读 `out/`。

本树结果文件：

`.next/verification-cache/vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json`

它是 Vitest 3.2.4 的一条记录，键为 `:tests/blog/blog-post-registry.test.ts`，`failed` 为 false，`duration` 为 `5.2209170000000995`。同一目录没有 `deps/`。`.next/` 已被根 `.gitignore` 忽略。

## 共享文件前后

共享路径：`/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`

`shared-before.json` 与 `shared-after.json` 都是 501 字节，SHA-256 都是 `f2a23630ed62c390df1b56f6588fd786e69610fdde74acc3f188091f7da8a3c2`。

| 对象 | 这条命令之前 | 这条命令之后 |
|---|---|---|
| `results.json` 大小 | 32375 | 32375 |
| `results.json` mtimeNs | `1791818810764372972`（2026-10-12 23:26:50） | 相同 |
| `results.json` SHA-256 | `ae6ef4d34ed39791d2083ff625ab93a5ab449326df0734caa5cd46280293c729` | 相同 |
| `results.json` 条目 | 321，版本 3.2.4 | 相同 |
| `.vite-temp` | 不存在 | 不存在 |

这条命令没有删除或恢复该文件。本树记录里的 duration 是 `5.2209170000000995`，共享文件里同一测试键的 duration 仍是 `5.83683400000001`。两边不是同一次写入。

任务开始时，同一共享文件曾是大小 32368、mtimeNs `1791817659615930375`（23:07:39）、SHA-256 `dda404e312b0d5107302bfd6b6f426e432ee0cc33fe95d7abce75ebb9186f66b`。它在 23:26:50 已变成上表中的指纹，早于这条最终命令的 23:27:56。因此不能把任务开始时的字节当成最终命令的 before。最终命令自己的 before 与 after 相同。

## 公开接口

这些都来自当前安装的 Vitest 3.2.4 与 Vite 7.3.6，不是猜的参数。

- Vite `cacheDir`：`node_modules/.pnpm/vite@7.3.6_@types+node@22.17.0_jiti@2.7.0_lightningcss@1.32.0_tsx@4.20.6/node_modules/vite/dist/node/index.d.ts` 约 3233–3241 行。绝对路径或相对项目根；默认 `node_modules/.vite`。解析逻辑在同一安装包 `dist/node/chunks/config.js` 约 35617 行。
- Vitest CLI 的 `--cache.dir` 会抛出 `--cache.dir is deprecated`：`node_modules/vitest/dist/chunks/cac.Cb-PYCCB.js` 约 1140–1143 行。`--cache` 只是布尔开关。
- 配置里的 `test.cache.dir` 会被 Vite 的 `cacheDir` 覆盖：`node_modules/vitest/dist/chunks/coverage.DL5VHqXY.js` 约 3855–3857 行。
- 实际结果目录是 `<cacheDir>/vitest/<sha1(项目名)>`：`node_modules/vitest/dist/chunks/cli-api.BkDphVBG.js` 约 5385–5388 行和约 6641 行。空项目名的 SHA-1 就是 `da39a3ee5e6b4b0d3255bfef95601890afd80709`。
- 未打开 `test.deps.optimizer` 时，依赖预构建保持关闭：同文件约 6534–6536 行。这次没有 optimizer 的 `deps/` 产物。
- `--configLoader runner` 写在 Vitest 3.2.4 的 `--help` 里。默认 `bundle` 会把配置临时文件写到最近的 `node_modules/.vite-temp/`（Vite `config.js` 约 35985–35993 行）。没有公开字段能改这个路径。`runner` 不走这段写入。它的内部环境把 `cacheDir` 设为 `process.cwd()`（约 35261–35266 行）；这次没有在仓库根留下新的缓存目录。

## 边界

1. 这条命令的结果缓存实际在本树 `.next`。它没有改共享 `results.json`，也没有留下 `.vite-temp`。符号链接还在，所以这只是这次命令的落点，不是系统级隔离。
2. 配置加载没有被搬进 `.next`。公开做法是不使用会写 `.vite-temp` 的 `bundle`。前后检查看不到运行过程中一闪而过的临时文件。
3. Optimizer 这次没有产物。它若打开，Vitest 会把 `cacheDir` 指到与结果缓存同一层；本次没有观察到 `deps/`。
4. `--no-cache` 不能代替 `cacheDir`。cache 为 false 时，约 6641 行仍会把未设置的 Vite `cacheDir` 解析到 `node_modules/.vite/vitest/<hash>`。
5. 没有跑全套测试，也没有新的 build。

## 原始文件

| 文件 | 字节 | SHA-256 |
|---|---:|---|
| `verification/cache-isolation/vitest.config.mjs` | 2056 | `4036bd264892d6ed81c292952e880ae19d89cdce66a4c322a49499e25aa16e34` |
| `verification/cache-isolation/verify-cache-isolation.mjs` | 7107 | `8ac3932de8ce870afa97ccc55dc30138f4f0bafb3ff9667aac25b3c9c742ff4b` |
| `verification/cache-isolation/vitest.log` | 310 | `ee458ac214e8f9e5fcb6d4a633a6261d6271e1dc6c5cbba836c323f3a39bb3f1` |
| `verification/cache-isolation/shared-before.json` | 501 | `f2a23630ed62c390df1b56f6588fd786e69610fdde74acc3f188091f7da8a3c2` |
| `verification/cache-isolation/shared-after.json` | 501 | `f2a23630ed62c390df1b56f6588fd786e69610fdde74acc3f188091f7da8a3c2` |
| `verification/cache-isolation/worktree-results.json` | 339 | `bca0a5c0607cebb7b62082db16a4cc271a0db1e7460be743ab24aca772a2afe3` |
