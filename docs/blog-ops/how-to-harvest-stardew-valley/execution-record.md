# 执行记录：G 项目接口预检

角色 G。任务 `task_0b42aed478f4`，Dispatch `ctx_89fa946fb720`。只做 how to harvest stardew valley 的项目接口和本地验证预检。没有写文章，没有改产品源码、媒体、旧记录或 `AGENTS.md`。

## 隔离

编辑记录和 operation store 与页面源码分开，这是逻辑隔离。没有做操作系统读权限试验，不能写成底层隔离已经验证。`operation-store.json` 里 `osPermissionIsolationVerified` 是 `false`，`isolation` 是 `logical-only`。

污染标记只放在 `operation-store.json`。本文件和 `project-interface.md` 都没有这串文字。SHA-256 按 UTF-8、不加换行计算，两次读回都与写入值相同：

`04c05bd3e19f94b06d4a7e17f28ac22c1c89845dd944241e1d837524ffc8a5f5`

这枚摘要可以核对文件，不能当作正文、SEO 或图片素材。不要把标记交给 A、C 或页面。

## 工作树

命令都在 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 运行。

- `git rev-parse --abbrev-ref HEAD` 退出码 0，输出 `博客-2`。
- `git rev-parse HEAD` 退出码 0，输出 `64a3b21b19444892654f98bc8042db4a95cbd1a8`。
- `git rev-parse main` 退出码 0，输出同一哈希。
- main 工作树短状态是 `## main...origin/main [ahead 5]`，没有未提交文件。本轮没有清理它，也没有动 `对齐竞品` 和 `文案`。
- Orca 显示名是「博客」。协调者确认本轮只创建过这一个工作树；目录和分支的实际名字是 `博客-2`。

## 依赖链接

本树原先没有 `node_modules`。确认 main 工作树的 `node_modules/next` 是已有安装，版本 16.3.0，与 `package.json` 一致之后，才建立符号链接。没有安装。

`readlink node_modules` 退出码 0，目标是 `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`。

`git check-ignore -v node_modules` 退出码 1。`git status --short` 把它显示为 `?? node_modules`。`.gitignore` 的 `node_modules/` 只匹配目录，不匹配这条符号链接。不要把它加进 git。

## 写入前已经跑过的检查

这些命令发生在本文件写入之前：

- 读回 `operation-store.json` 的 Python 检查退出码 0。`field_sha_matches` 为 True，`readBackCanaryMatches` 为 True，标记没有出现在当时已存在的 `project-interface.md`。
- `git diff --check` 退出码 0。当时没有已跟踪差异，这次检查没有扫未跟踪新文件里的行尾空白。
- `git status --short --branch` 退出码 0，输出 `## 博客-2`、`?? docs/blog-ops/how-to-harvest-stardew-valley/`、`?? node_modules`。

没有运行 `scripts/dev.sh`、`pnpm dev`、`pnpm build`、`pnpm test`、`pnpm typecheck`。没有杀 3002、3003、3013 上的进程。页面没有用浏览器打开。

## 写后复核

本文件先以占位小节落盘，再跑下面的命令，然后把这一节换成实际结果。

- 再次读回 `operation-store.json` 的 Python 检查退出码 0。`store_sha_ok` 为 True。标记没有出现在 `project-interface.md` 或本文件。SHA-256 出现在本文件，没有出现在 `project-interface.md`。
- `git diff --check` 退出码 0。已跟踪文件没有差异，所以这次仍然没有把未跟踪文件的正文当作补丁来扫。
- `git diff --check --no-index /tmp/empty-for-diff <三个新文件>` 各退出码 1，stdout 和 stderr 都是 0 字节，Git 2.50.1 没有打印空白错误。不能把这个 1 写成空白检查失败，也不能写成它已经检查通过。
- 对三个新文件逐行查看，行尾空格或制表符的行数都是 0，文件都以换行结束。
- `git diff --stat` 退出码 0，没有已跟踪产品文件的差异。

本节替换之后还会再跑一次 `git diff --check`。那次退出码只记在 worker_done，不在这里预先填写。

# 执行记录：G 站内装配

角色 G。任务 `task_3508384dd30b`，Dispatch `ctx_25f1b800b385`。同一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`。装配和本地验证的命令、退出码、通过数写在 `verification/assembly.md`。这里只列本 Run 的任务结算和还没做的事。

用户终审没有开始。部署没有开始。页面没有称为已经上线。

隔离仍是逻辑隔离。Q 的 Webpack 基线碰到过共享 Vitest 缓存。后来的 `cacheDir` 命令只证明那一条命令的落点。E 早期没有 cache-before 的 Vitest 不能证明主文件系统未写。

## 本 Run 任务

名单来自 `orca orchestration task-list --run run_2434613566b2`。outcome 取该列表里的 result。报告路径只写本树里已经有的文件。

- `task_0b42aed478f4` completed，succeeded。预检报告是本文件前半和 `project-interface.md`。
- `task_4bd7b995c5d5` completed，succeeded。`research/research.md`。
- `task_ffe732790863` completed，succeeded。`research/controls-supplement.md`。
- `task_8ed27bdc543d` completed，succeeded。`research/controls-supplement-v2.md`。
- `task_fb0c9f003cc4` completed，succeeded。`verification/baseline.md`。那里的默认 `pnpm build` 是失败，不是这次装配的通过。
- `task_5577ae3be977` completed，succeeded。`verification/baseline-webpack.md`。基线是 64/64 和 10 个测试失败，并记下共享缓存被碰到。那 10 个失败不是本篇通过记录。
- `task_a3ae6ffa7a34` completed，succeeded。`verification/cache-isolation.md`。
- `task_94c88dfbd0a0` completed，succeeded。`layout/task-card.md`、`writer-brief.md`、`visual-plan.md`。
- `task_f4436e543a2d` completed，succeeded。同一布局目录的第 2 轮。
- `task_1578fa070551` completed，succeeded。英文候选 v1，`writing/revision-note.md`。
- `task_a55a418c4127` completed，succeeded。英文第 3 轮。正文 SHA-256 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`。
- `task_a0a8d2e776f7` completed，succeeded。`reviews/D-en-round3-three-gates.md`。
- `task_2429b66bee01` 列表状态是 failed。result 原文是「未派发；按用户尽可能并行执行审核的要求，以独立E并行审核Task替代本顺序计划，最终锁稿仍必须D/E同版通过」。没有派发，没有执行报告。替代任务是 `task_d5524a3aec59`。
- `task_d5524a3aec59` completed，succeeded。报告包括 `reviews/E-page-review.md`、`reviews/E-translation-review.md`、`reviews/E-title-final.md`。页面报告里的 PASS 不是完整技术 PASS。其中 40 项 vitest 和 tsc 是 E 自报，本任务没有那份原始日志，不引用为通过。
- `task_e1d2ec5d1861` completed，succeeded。`translation/translation-record.md`。
- `task_c23688973c81` completed，succeeded。`reviews/F-public-freeze.md`。旧中文交接 `fc834…` 后来作废，不是最终交接。
- `task_36434fd81bde` completed，succeeded。`media/final-report.md`，`media/final-manifest.json`。`worker_done` `msg_55ded40675ac`。
- `task_a97a878a31bf` completed，succeeded。`reviews/F-media-freeze-v2.md`。中文交接改为 `3debdcefc4bb9e7217bd43e1fdb3484d1b7ef5e3418b073d6ec308e4ef7034de`。
- `task_ece407932dbd` 列表状态是 failed。result 原文是「未派发；原F完成后M纯图片排版适配导致ZHhandoff资源hash过期，改用新增实际F2和M依赖的新G装配Task，source允许边界及正文不变」。没有派发。替代任务是当前的 `task_3508384dd30b`。
- `task_7a8493c81644` completed，succeeded。`reviews/R-source-review.md`。不覆盖后来的分页和 CTA 测试差异。
- `task_2cdd7131ad62` completed，succeeded。`reviews/E-page-review-v2.md`。无障碍全满足和图注 100% 兜底不是门禁。
- `task_3508384dd30b` 写这份记录时仍是 dispatched。装配证据在 `verification/assembly.md`。`worker_done` 要等主脑读过 status 和 ask 之后才发。

## 这次装配认的结果

- 默认 `pnpm build`：`verification/assembly/build-default.log`，`DEFAULT_BUILD_EXIT:1`。失败。
- `pnpm build --webpack`：`verification/assembly/build-webpack.log`，`WEBPACK_BUILD_EXIT:0`，静态页 66/66。
- 契约与保真：`verification/assembly/vitest-contract-and-focused-r2.log`，`VITEST_CONTRACT_R2_EXIT:0`，92 通过，0 失败。
- 构建前全量（不含三个 `out/` 文件，且早于那两处断言修改）：`verification/assembly/vitest-unit-without-export.log`，`VITEST_UNIT_EXIT:1`，11 失败 / 2421 通过（2432）。
- 构建后导出三文件：`verification/assembly/vitest-export.log`，`VITEST_EXPORT_EXIT:1`，3 失败 / 9 通过（12）。那 3 个失败与 Webpack 基线日志里的同一断言相同，没有修。
- 类型检查：`verification/assembly/typecheck-r3.log`，`TYPECHECK_R3_EXIT:0`。
- 预览留在 `term_7dfa2286-b04b-4b91-816a-73a4545cf236`，监听 PID 44772，`127.0.0.1:3004`，两页 HTTP 200。

`vitest-contract-and-focused.log` 的退出码是 1，不是通过。`typecheck.log` 是去掉 Sources 之前的，也不是最终类型检查。
