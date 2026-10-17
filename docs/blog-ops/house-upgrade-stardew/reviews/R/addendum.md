# Addendum: Reviewer R 证据更正

独立技术收尾校正。不修改 `reviews/R/report.md` 与 `reviews/R/checks.log`，不重做装配代码审查。工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`，HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`。命令原文在同目录 `addendum-checks.log`。

## 1. 全量 12 项失败的过强句子

原 R 把全量 12 项失败写成仓库固有历史失败、本次引入为零、并且与本次完全无关。`assembly/validation/baseline-comparison.md` 写明：可称为同一历史失败的清单，是 2026-10-15 interface 日志里的 8 项。全量 `pnpm exec vitest run` 在该基线中的位置是 `not in that baseline`。多出的 4 项“不在 2026-10-15 interface 日志中，不按该基线分类”。因此这 4 项没有变更前的全量执行基线：不能据此证明本次引入，也不能写成已经证实的历史失败。

以下原句被本补遗覆盖，原文件不改：

- `report.md:10`：全量套件“保留仓库固有 12 项历史失败限制，0 项属于本次引入”。
- `report.md:133`：另外 4 项是“与本次完全无关的仓库级历史失败”。
- `report.md:134`：“没有任何一项失败指向或涉及 `house-upgrade-stardew`”。
- `report.md:135`：全量退出码 1“属于仓库既有环境约束”并“记录为基线限制”。
- `report.md:198` 后半：全量套件“仍保留 12 项历史基线限制”。
- `checks.log:28`、`:215`–`:217`：把 12 项失败写成 historical baseline、pre-existing，并写 “None of the 12 failures are related to or caused by house-upgrade-stardew”。

### 计数

| 日志 | 结果 | 退出 |
|---|---|---:|
| `vitest-interface.txt` | Test Files 6 failed / 45 passed (51)；Tests 8 failed / 237 passed (245) | `VITEST_INTERFACE_EXIT=1` |
| `vitest-full.txt` | Test Files 9 failed / 250 passed (259)；Tests 12 failed / 2478 passed (2490) | `VITEST_FULL_EXIT=1` |

`baseline-comparison.md:14`–`:15` 与上表相同。

### 原 8 项

`vitest-interface.txt` 的 8 个 `FAIL` 名称与 `baseline-comparison.md` 第 19–31 行逐项对应。本补遗沿用该文件已写的分类，不重开 2026-10-15 原始日志。

1. `public-avif-assets.test.ts`：期待长度 81，本次收到 108。基线收到 102；该文件记 +6，对应 6 个新 WebP，同一断言，测试未改，不是通过。
2. `blog-article-content.test.tsx`：中文 Pine 正文缺少 `本文不发布阶段数字`。
3. `blog-sources.test.tsx`：英文 Pine 的 `blog-sources__checked` 文本与测试字符串不一致。
4. `pine-tree-stardew-identity.test.ts`：中文正文缺少同一短语。
5. `llms.test.ts`：`out/llms.txt` 缺少 `https://stardewvalleyplanner.art/stardew-fruit`。
6. `static-public-pages.test.ts` 封面：`/blog` 缺少 `how-to-earn-money-stardew-cover.webp`。
7. 同文件首页顺序：收到 46622，期待大于 51630。
8. 同文件 404 样式表：期待 `/_next/static/chunks/*.css`，收到 webpack 的 `/_next/static/css/093fd830753a06af.css`。

`report.md:127`–`:128` 对这 8 项、以及 6 个已改测试加 `blog-planner-cta` 通过的叙述，与 `baseline-comparison.md` 一致，本补遗不撤回。`report.md:129` 位于接口套件小节内，不能外推到下面 4 项。

第 1 项的 received 108 被基线文件写成包含这 6 个新 WebP。因此 `report.md:134` 的“12 项都不涉及本次”比该记录更强。这仍是基线文件所标的同一断言。

### 全量多出的 4 项

`baseline-comparison.md:36` 原文：这 4 项不在 2026-10-15 interface 日志中，不按该基线分类，也没有被修复。`vitest-full.txt` 的失败名与断言如下。

1. `tests/catalog/catalog-loader.test.ts`：`building:Building 0` 的 `allowedTools` 多出 `fill`（日志第 351 行 `+     "fill"`）。
2. `tests/resources/local-planner-resource-smoke.test.ts`：`Test timed out in 5000ms`。
3. `docs/blog-ops/how-to-harvest-stardew-valley/verification/assembly/render-reader-text.test.tsx` 英文：渲染文本不是冻结的 harvest reader text。
4. 同文件中文：同样不是冻结的中文 reader text。

`baseline-comparison.md:45` 写这 4 条断言没有点名 `house-upgrade-stardew`，且该次任务没有编辑这些文件。这只是点名与文件编辑记录，不是变更前的全量执行基线。

### 装配代码的有限结论

本补遗不重做代码审查。`report.md:9` 与 `:198` 前半对本次装配代码未发现缺陷的有限结论保留，范围停在那次装配路径审查。接口套件与全量套件的退出码仍是 1。

## 2. `next-env.d.ts` 已恢复为 HEAD 字节

恢复前工作区 SHA-256 为 `1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b`，blob `ce4e94a6b10f160ee021fe18939af160d2927dcf`。HEAD 文件 SHA-256 为 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，blob `a419cbe4e3a5e8d4b481b851dbf4ac767de069e6`。

保存进日志的 `git diff -- next-env.d.ts` 只有两行，同一前缀 `.next/dev/types` → `.next/types`：

- `import "./.next/dev/types/routes.d.ts";` → `import "./.next/types/routes.d.ts";`
- `import "./.next/dev/types/root-params.d.ts";` → `import "./.next/types/root-params.d.ts";`

任务原文只点名 `routes.d.ts`。协调者回复 A：白名单扩为这两行，先确认脏 SHA 仍是 `1862ac4b…`，再把整个文件恢复为 HEAD 字节 `0f706298…`。核对通过后执行 `git restore --source=HEAD --worktree --staged -- next-env.d.ts`，退出码 0。

恢复后：`git show HEAD:next-env.d.ts | cmp - next-env.d.ts` 的 `cmp_exit=0`；`shasum -a 256` 为 `0f706298…`；`git hash-object` 为 `a419cbe…`，等于 `HEAD:next-env.d.ts`；`git diff --exit-code -- next-env.d.ts` 退出码 0；`git status --short -- next-env.d.ts` 无输出。日志前段空白的 `PIPESTATUS` 是 zsh 没有 bash 的 `PIPESTATUS`；以 `cmp_exit=0` 为准。

`git diff --name-only HEAD` 剩余 10 个 tracked 文件，即 4 个注册/llms 与 6 个测试：

- `public/llms.txt`
- `src/blog/blog-copy.ts`
- `src/blog/blog-post-identities.ts`
- `src/blog/blog-post-registry.tsx`
- `tests/blog/blog-home-state.test.ts`
- `tests/blog/blog-post-registry.test.ts`
- `tests/i18n/public-route-registry.test.ts`
- `tests/routes/blog-routes.test.tsx`
- `tests/routes/removed-public-pages.test.ts`
- `tests/seo/canonical-public-routes.test.ts`

未重建。四份产物哈希保持：

- `src/blog/articles/house-upgrade-stardew.en.tsx` `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5`
- `src/blog/articles/house-upgrade-stardew.zh.tsx` `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba`（`wc -c` = 14218）
- `out/house-upgrade-stardew.html` `3ca9995c83780becbaca28e891f2d067aabcd9d3052707afc53826a7096c6430`
- `out/zh/house-upgrade-stardew.html` `ce02bd73e681374e7d8b3a2cbd03429252009aefa084c1f695ccaa3e067df77f`

已安装 Next 文档只作点状说明，配置未改：`next dev`、`next build`、`next typegen` 会重写 `next-env.d.ts`；类型输出在开发时一般是 `.next/dev/types`，生产时是 `.next/types`。上面两行 diff 与这个目录差别一致。

## 3. 中文绑定的 manifest 创建者与 9658 字节

`assembly/zh-bindings.md:150` 写 `AssemblyManifest.json` 由装配主线/协调者创建。`assembly/integration-report.md:3` 把该记录标为 “G integration owner only”；`:105` 记录 `Python write of AssemblyManifest.json` 退出码 0；`:93` 把该 manifest 列为这次集成的新未跟踪文件。

更正：创建者是 G integration Cursor Worker。协调者没有编辑仓库。`zh-bindings.md` 不改。

`zh-bindings.md:36` 把中文文章记为 9658 字节。本次 `wc -c` 为 14218，SHA-256 仍是上面的 `2339f972…`。`assembly/validation/report.md:19` 已经写明同哈希文件是 14218 字节；`report.md:183` 也已记下这笔误。此处只记录，不改旧报告。
