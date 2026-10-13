# Q 接手后的运行与媒体证据核查综合报告 (Pickup-Q Operational & Media Audit Report)

- **任务角色 (Role)**：Q 接手后的运行与媒体证据核查专属叶子 (Verification Leaf Worker Q)
- **Task ID**：`task_96f1b342e8aa`
- **Dispatch ID**：`ctx_ec7ccff88c80`
- **协调员终端 (Coordinator)**：`term_ea92c135-a44b-411d-94e1-e3c209acc3a8`
- **执行终端 (Worker Terminal)**：`term_4ec275dd-ee29-4113-aaa5-ff9b2b8da8e3`
- **工作树路径 (Workspace Root)**：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **核查日期**：2026-10-13
- **核查结论**：
  1. **服务归属确定**：端口 3004 由本工作树 Next.js 开发服务（PID 44772，PGID 44758）正常监听，未发生进程漂移；
  2. **当前页面定性**：HTTP 200 返回内容**确凿为旧稿**（仅含旧版单张方法图及旧封面，新返工图与新正文尚未装配）；
  3. **返工媒体验真**：Staged 6 个 WebP/AVIF 文件 100% 存在、像素尺寸 1672×941、SHA-256 哈希匹配、解码证据齐备，经多模态实读确认无 HUD 且画面要素与勘误报告一致；
  4. **基线留存核验**：24/24 基线文件 SHA-256 100% 匹配，工作树零脏写；
  5. **历史测试档案**：明确历史构建与测试原始退出码，区分既有失败与本篇聚焦套件，不重新跑测试；
  6. **装配接口明确**：最小装配文件清单（6 生产 + 6 资产 + 8 测试）与公开函数边界已全部厘清，具备向后续规划交接条件。

---

## 1. 执行边界与只读执行声明 (Execution Boundaries)

1. **唯一工作树与防漂移**：
   - 仅在指定工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行只读证据核查；
   - 未创建任何额外工作树，严格遵守并发限制，未启动任何内置子代理、嵌套 worker 或 workflow。
2. **纯核查叶子职责**：
   - 本任务为 Q 接手后的专属核查叶子，不兼任 A/B/C/D/E/F/T/G 角色；
   - 不修改产品代码、不改动现有规则或测试；
   - 不读取 `operation-store` canary 内容或泄漏内部字段，正文不灌入无关内部研究。
3. **只写授权目录**：
   - 允许且仅写入：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/pickup-q/` 目录；
   - **绝对未修改**：`src/`、`public/`、`tests/`、`package.json`、`pnpm-lock.yaml`、主分支工作树及其他任何已有文件；
   - 未执行 `pnpm test`、`build`、`lint`，未启动或停止任何端口服务，未下载资产，未安装依赖。
4. **证据可回读原则**：
   - 所有命令输出、exit code 及哈希计算结果均持久化保存在 `pickup-q/` 目录下，拒绝无证据猜测与口头 PASS。

---

## 2. Git 状态与共享 node_modules 链接 (Git State & Workspace Environment)

现场执行 `git status`、`git rev-parse HEAD`、`git branch -vv` 与 `ls -ld node_modules`（原始记录保存在 `pickup-q/git-env.txt`）：

- **Git HEAD**：`64a3b21b19444892654f98bc8042db4a95cbd1a8`（Commit: *Merge 对齐竞品: batch building fill and eraser previews*）
- **当前分支**：`博客-2`
- **工作树状态**：
  - 12 个未暂存修改文件（均为此前已有工作留存：`public/llms.txt`、`src/blog/blog-copy.ts`、`src/blog/blog-post-identities.ts`、`src/blog/blog-post-registry.tsx` 及 8 个测试文件）；
  - 未跟踪目录/文件：`docs/blog-ops/how-to-harvest-stardew-valley/`、`node_modules`、6 个 public 图片与 2 个 TSX 文章源码；
  - **现有工作已完整保留，未进行任何 revert、reset 或 commit 操作**。
- **共享 `node_modules` 符号链接**：
  ```text
  node_modules -> /Users/wusir/Desktop/开发项目集合/stardew planner/node_modules
  ```
  - `node_modules` 指向项目根目录外部的共享位置，非操作系统级别沙盒隔离；
  - 该符号链接会导致 Next.js 16.3.0 默认 Turbopack 构建报 `Symlink points out of the filesystem root` 致命错误（详见第 6 节）。

---

## 3. 预览服务 3004 属主与进程组拓扑 (Preview 3004 Process & Port Topography)

现场执行 `lsof` 与 `ps` 命令对 3004 端口及全系统 node 进程进行新鲜只读探测（原始记录保存在 `pickup-q/process-and-port.txt` 与 `pickup-q/pid-44772.txt`）：

### 3.1 监听进程与拓扑结构

- **监听端口**：`127.0.0.1:3004` (LISTEN)
- **监听 PID**：`44772` (`next-server (v16.3.0)`)
- **真实 Owner PGID**：`44758`
- **进程树链路**：
  - `PID 79299` (`/usr/bin/login ... orca-tcc-login /bin/zsh -l`, TTY `ttys023`, root)
  - ↳ `PID 79325` (`-/bin/zsh -l`, TTY `ttys023`, wusir, PGID `79325`)
  - ↳ `PID 44758` (`node /opt/homebrew/opt/node@24/bin/pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3004`, TTY `ttys023`, PGID `44758`, PPID `79325`)
  - ↳ `PID 44766` (`node .../next dev --webpack --hostname 127.0.0.1 --port 3004`, TTY `ttys023`, PGID `44758`, PPID `44758`)
  - ↳ `PID 44772` (`next-server (v16.3.0)`, TTY `ttys023`, PGID `44758`, PPID `44766`, LISTEN)
- **进程工作目录 (CWD)**：`/Users/wusir/orca/workspaces/stardew planner/博客-2`（`lsof -a -p 44772 -d cwd` 输出一致）
- **进程漂移判定**：**未发生漂移**。PID 44772 仍为此前会话所记录之活跃进程，运行时间持续递增，稳定处于 LISTEN 状态。本轮严格只读，未杀掉、未重启、未干扰该服务。

### 3.2 邻近端口保护清单

- `*:3003`：PID `23303`（main 分支工作树 `next dev` 服务，**严禁干扰/严禁释放**）
- `[::1]:3002`：PID `84947`（AI image editor 项目 Vite 服务，**严禁干扰**）
- `[::1]:3005`：PID `71596`（其他开发工具服务，**严禁干扰**）
- `127.0.0.1:3013`：PID `97774`（`文案` 工作树静态服务，**严禁干扰**）

---

## 4. HTTP 页面探测与“当前是旧稿”事实判定 (HTTP Endpoint & Old Draft Verification)

现场通过 `curl` 针对 3004 端口执行探测，并保存完整渲染 HTML（原始输出见 `pickup-q/http-check.txt`、`pickup-q/en-rendered.html`、`pickup-q/zh-rendered.html`）：

### 4.1 路由解析规则说明 (避免误报 404)

- 探测 `http://127.0.0.1:3004/en/blog/how-to-harvest-stardew-valley` 返回 `HTTP 404`。
- **原因**：项目采用 Next.js App Router 路由组 `app/(en)/[slug]/page.tsx` 与 `app/zh/[slug]/page.tsx`。
  - 英文正文公开路径为根级 **`/${slug}`**（即 `http://127.0.0.1:3004/how-to-harvest-stardew-valley`）；
  - 中文正文公开路径为 **`/zh/${slug}`**（即 `http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`）；
  - `/blog/` 为文章列表页与归档页，非单篇文章路由。

### 4.2 为什么不能凭 200 认定为新版？（旧稿判定铁证）

现场请求两处真实文章端点均返回 `HTTP/1.1 200 OK`，但深入比对渲染 HTML 文本发现：

1. **图位资产引用仍为旧版单张示意图**：
   - 英文渲染页 `en-rendered.html` 中引用的媒体为：
     - 封面：`/blog/how-to-harvest-stardew-valley-cover.webp` (对应旧图 SHA `8558f5b08e0c...`)
     - 插图：`/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` (旧版 SVG 导出图)
   - 中文渲染页 `zh-rendered.html` 中引用的媒体为：
     - 封面：`/blog/how-to-harvest-stardew-valley-cover.webp` (旧图)
     - 插图：`/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` (旧版 SVG 导出图)
   - **新版返工图完全缺失**：HTML 中完全未出现 `how-to-harvest-stardew-valley-mature-crops` 或 `how-to-harvest-stardew-valley-trellis-paths`。
2. **正文内容未装配**：
   - 页面渲染的内容与当前工作树中未修改的旧版 `src/blog/articles/how-to-harvest-stardew-valley.en.tsx` / `zh.tsx` 完全一致；
   - 包含旧版单图组件 `HowToHarvestStardewValleyEnglishMethodsFigure`，未植入新版双图组件。
3. **定性结论**：**当前端口 3004 上运行的预览页面确凿无疑为旧稿 (Old Draft)**，新版图文尚未装配至发布链路。

---

## 5. 返工媒体资产核查与多模态实读 (Reworked Media Assets & Visual Verification)

现场针对 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/` 目录下全部 6 个 staged 资产进行 SHA-256、文件大小、`sips` 尺寸及多模态实读核验（原始记录见 `pickup-q/media-check.txt`）：

### 5.1 6 个 Staged 文件参数与哈希核对

| 资产标识 | 格式 | 宽×高 | 字节数 (Bytes) | 现场计算 SHA-256 | Manifest / Errata 匹配 |
| :--- | :---: | :---: | :---: | :--- | :---: |
| `how-to-harvest-stardew-valley-cover.webp` | WebP | 1672×941 | 479,250 | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | **100% MATCH** |
| `how-to-harvest-stardew-valley-cover.avif` | AVIF | 1672×941 | 237,604 | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | **100% MATCH** |
| `how-to-harvest-stardew-valley-mature-crops.webp` | WebP | 1672×941 | 267,644 | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | **100% MATCH** |
| `how-to-harvest-stardew-valley-mature-crops.avif` | AVIF | 1672×941 | 143,638 | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | **100% MATCH** |
| `how-to-harvest-stardew-valley-trellis-paths.webp` | WebP | 1672×941 | 223,784 | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | **100% MATCH** |
| `how-to-harvest-stardew-valley-trellis-paths.avif` | AVIF | 1672×941 | 113,557 | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | **100% MATCH** |

- **可解码证据**：
  - `media/decoded/` 目录下 6 个对应反解 PNG 均实际存在；
  - `manifest.json` 中记录的 `encodeExitCode` 与 `decodeExitCode` 均为 `0`。

### 5.2 多模态实际画面内容实读 (Visual Fact Audit via view_file)

本 Worker 通过 `view_file` 真实调阅了 3 张 WebP 画面，核实其视觉事实与 `record-errata.md` 纠偏记录完全吻合：

1. **封面图 (`cover.webp`)**：
   - 画面呈现秋季傍晚农场全景，左侧为鸡舍、粮仓与苹果树，中间为橙色南瓜地、稻草人、紫色长发漫步角色与篝火，右侧为整齐的葡萄架与成排酿酒桶（底部右侧带酒瓶气泡），下方为带荷叶的小水塘与两座石火炬。丰收田园氛围浓厚。
2. **正文图 1：成熟作物近景 (`mature-crops.webp`)**：
   - **南瓜阵列事实**：耕地中央南瓜田顶行只有 2 株成熟南瓜（右侧耕地上站立一名绿衣棕发玩家），下三行各 5 株，**总计 17 株成熟南瓜，确凿并非 4×5 完整方阵**。
   - **玩家动作事实**：左侧蓝背带裤农夫双手举起绿色蔬菜（小白菜 Bok Choy），呈现联机静止姿态，无法推断为刚收获动作时序。
   - **HUD 状态**：原图左下角带文字的道具框已被干净裁除，**画面无任何文字或 HUD**。
3. **正文图 2：棚架通道与走道布局 (`trellis-paths.webp`)**：
   - **棚架与作物分布**：左侧两列为木桩紫葡萄棚架与红果灌木丛，中间石板小路通向上方木门；右侧 4 列为**带黄花高茎植株（并非木葡萄棚架）**。
   - **角色站位事实**：黑发红衣角色正站立在**右侧黄色高茎作物田块内部**，**绝非穿行于左侧木葡萄棚架通道中**。
   - **HUD 状态**：顶部木围栏与右侧石墙清晰，全图无多余文字 UI。

---

## 6. 基线留存状态与双向 SHA-256 比对 (Baseline Integrity Verification)

现场运行 Python 脚本对此前留存的基线清单（`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/manifest.json`）中全部 24 个文件进行实时哈希计算（原始记录见 `pickup-q/baseline-check.txt`）：

| 文件类别 | 文件路径 | 字节大小 | 期望 SHA-256 | 现场 SHA-256 | 比对结论 |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 文章源码 | `src/blog/articles/how-to-harvest-stardew-valley.en.tsx` | 11,874 | `dacc4d0361dbd894...` | `dacc4d0361dbd894...` | **PASS** |
| 文章源码 | `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx` | 11,887 | `98f2835aea750c56...` | `98f2835aea750c56...` | **PASS** |
| 全局路由 | `src/blog/blog-post-registry.tsx` | 47,995 | `ea146ecfe3e8553e...` | `ea146ecfe3e8553e...` | **PASS** |
| 全局标识 | `src/blog/blog-post-identities.ts` | 1,245 | `886b1f6081692fb7...` | `886b1f6081692fb7...` | **PASS** |
| 文本路径 | `src/blog/blog-copy.ts` | 8,661 | `bde4900d8c5cda4d...` | `bde4900d8c5cda4d...` | **PASS** |
| 站点清单 | `public/llms.txt` | 16,856 | `71c1d1f8185fbefa...` | `71c1d1f8185fbefa...` | **PASS** |
| 旧公开图 | `public/blog/how-to-harvest-stardew-valley-cover.webp` | 38,974 | `8558f5b08e0c3e89...` | `8558f5b08e0c3e89...` | **PASS** |
| 旧公开图 | `public/blog/how-to-harvest-stardew-valley-cover.avif` | 17,525 | `ccd28749dfd70476...` | `ccd28749dfd70476...` | **PASS** |
| 旧公开图 | `public/blog/illustrations/...en-methods.webp` | 99,024 | `c5d987fdd4c2d179...` | `c5d987fdd4c2d179...` | **PASS** |
| 旧公开图 | `public/blog/illustrations/...en-methods.avif` | 39,279 | `92476d4c389afbf1...` | `92476d4c389afbf1...` | **PASS** |
| 旧公开图 | `public/blog/illustrations/...zh-methods.webp` | 105,016 | `450f78bb5aefcc6d...` | `450f78bb5aefcc6d...` | **PASS** |
| 旧公开图 | `public/blog/illustrations/...zh-methods.avif` | 40,187 | `d918433c39793cf8...` | `d918433c39793cf8...` | **PASS** |
| 历史交接 | `docs/.../handoffs/public-blog-handoff-en.json` | 29,884 | `8ed90bfab4dbdd41...` | `8ed90bfab4dbdd41...` | **PASS** |
| 历史交接 | `docs/.../handoffs/public-blog-handoff-zh.json` | 29,970 | `3debdcefc4bb9e72...` | `3debdcefc4bb9e72...` | **PASS** |
| 历史写作 | `docs/.../writing/en-body.md` | 10,093 | `dd686bfd49f4e53d...` | `dd686bfd49f4e53d...` | **PASS** |
| 历史写作 | `docs/.../writing/locked/en-body.md` | 10,093 | `dd686bfd49f4e53d...` | `dd686bfd49f4e53d...` | **PASS** |
| 历史写作 | `docs/.../writing/en-media.json` | 2,245 | `1d4cd52f3d7cc7b1...` | `1d4cd52f3d7cc7b1...` | **PASS** |
| 历史写作 | `docs/.../writing/en-figure.svg` | 5,643 | `a6e017cda7dd1f5d...` | `a6e017cda7dd1f5d...` | **PASS** |
| 历史 SEO | `docs/.../seo/en-seo.json` | 2,639 | `30ec27dd831c395b...` | `30ec27dd831c395b...` | **PASS** |
| 历史 SEO | `docs/.../seo/en-public-references.json` | 10,447 | `2a1739dad9e9e519...` | `2a1739dad9e9e519...` | **PASS** |
| 历史翻译 | `docs/.../translation/zh-body.md` | 10,106 | `ec8b60fc7e99ac1c...` | `ec8b60fc7e99ac1c...` | **PASS** |
| 历史翻译 | `docs/.../translation/zh-seo.json` | 2,766 | `44fda49e69a3e9e6...` | `44fda49e69a3e9e6...` | **PASS** |
| 历史翻译 | `docs/.../translation/zh-media.json` | 1,963 | `7aae7773171719b1...` | `7aae7773171719b1...` | **PASS** |
| 历史翻译 | `docs/.../translation/zh-figure.svg` | 5,692 | `50cd8f2c06a05e25...` | `50cd8f2c06a05e25...` | **PASS** |

**核对结论**：**24 个基线文件 100% 匹配**。证明自 P 角色备份建立以来，本工作树的基线资产处于绝对纯净未改写状态。

---

## 7. 脚本核对与历史验证失败基线定性 (Scripts & Historical Test Baseline)

核对 `package.json` 中的脚本定义与 `project-preflight.md`、历史验证记录档案，严格区分历史已知失败与未来新验证，不重复执行测试命令：

### 7.1 `package.json` 关键脚本核查

1. `"dev": "sh scripts/dev.sh"`：
   - 脚本写死 `DEV_PORT=3003` 并强制调用 `sh "$script_dir/free-listen-port.sh" 3003`；
   - **禁止直接运行 `pnpm dev`**，否则会杀死主工作树 3003 端口的服务（PID 23303）。
2. `"pretest": "NEXT_TELEMETRY_DISABLED=1 pnpm build"`：
   - 默认 `pnpm build` 调用 `next build`（Turbopack），会因共享 `node_modules` 软链越界报错；
   - **禁止直接运行 `pnpm test`**，必须使用带缓存隔离的 Vitest 聚焦命令。
3. `"typecheck": "tsc --noEmit"`：
   - 标准 TypeScript 检查。

### 7.2 历史原始记录与退出码盘点 (Historical Test & Build Records)

| 命令 / 任务分类 | 历史执行日志路径 | 历史 Exit Code | 历史结果通过/失败数 | 失败原因与定性 |
| :--- | :--- | :---: | :---: | :--- |
| 默认构建 (`pnpm build`) | `verification/assembly/build-default.log` | **1** | FAIL | Turbopack 遇到指向根目录外部的 `node_modules` 软链抛出 panic，**属环境预期失败** |
| Webpack构建 (`next build --webpack`) | `verification/assembly/build-webpack.log` | **0** | 66/66 SSG PASS | 成功构建导出 66 个静态页面，构建后需执行 `git checkout -- next-env.d.ts` 恢复类型文件 |
| 类型检查 (`tsc --noEmit`) | `verification/assembly/typecheck-r3.log` | **0** | PASS | 零类型错误 |
| 全量单测 (`vitest run`) | `verification/assembly/vitest-unit-without-export.log` | **1** | 241 passed / 11 failed<br/>(2421 passed / 11 failed) | **11 项失败定性**：<br/>• 5 项全站历史基线失败（松树 3 项、llms 缺失 stardew-fruit 1 项、public-avif-assets 81 硬编码 1 项）；<br/>• 4 项未建立基线组件测试（catalog-loader、editor 等）；<br/>• 2 项收获文相关已在聚焦套件中修复通过 |
| 聚焦与契约套件 (Focused) | `verification/assembly/vitest-contract-and-focused-r2.log` | **0** | **8 passed / 0 failed**<br/>(**92 passed / 0 failed**) | 针对本篇及受影响的 8 个测试文件（组件、CTA、路由、SEO、首页状态等）全量通过 |
| 导出测试 (`vitest export`) | `verification/assembly/vitest-export.log` | **1** | 2 passed / 1 failed<br/>(9 passed / 3 failed) | 失败项为 `tests/routes/static-public-pages.test.ts`（缺失 `how-to-earn-money` 封面等全站历史遗留问题） |

---

## 8. 后续最小装配文件接口规范 (Subsequent Assembly Interface Specs)

为供主脑后续规划 G 角色执行装配，在此提炼最小改动闭环规范（严格遵守高内聚低耦合、FailFast 与 KISS 原则）：

### 8.1 生产与资产文件清单 (12 文件)

1. **文章 TSX 源码 (2 个)**：
   - `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`：导出 `HowToHarvestStardewValleyEnglishArticle`，嵌入 2 处 `<PublicPicture>` 正文图组件；
   - `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`：导出 `HowToHarvestStardewValleyChineseArticle`，复用相同 2 处正文图组件（纯游戏画面无文本）。
2. **注册与路由清单 (4 个)**：
   - `src/blog/blog-post-identities.ts`：核验 `blogPostSlugs` 末尾第 25 项 `how-to-harvest-stardew-valley`；
   - `src/blog/blog-post-registry.tsx`：更新中英两处 `BlogPostMeta` 登记对象（title、description、readTimeMinutes、coverImage.alt 等）；
   - `src/blog/blog-copy.ts`：核对 `localizedBlogPostPaths` 映射；
   - `public/llms.txt`：更新中英文条目标题与摘要。
3. **公开媒体资产 (6 个，自 staged 复制)**：
   - `public/blog/how-to-harvest-stardew-valley-cover.webp` 与 `.avif`；
   - `public/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` 与 `.avif`；
   - `public/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` 与 `.avif`。

### 8.2 核心组件与函数契约

- **`PublicPicture` 组件契约**：
  - 位置：`src/components/public-picture.tsx`；
  - 入参约束：`src` 参数**必须以 `.webp` 结尾**，组件内部通过 `createPublicAvifSource(src)` 自动拼接配套 `.avif`；若传非 `.webp` 立即抛出 `TypeError` (FailFast)；
  - 尺寸：正文图固定为 `width={1672} height={941}`，`loading="lazy" decoding="async"`。
- **注册对象 `BlogPostMeta` 约束**：
  - `slug`: `"how-to-harvest-stardew-valley"`
  - `topic`: 英文必须为 `"Stardew Valley Guides"`，中文必须为 `"星露谷物语指南"`；
  - `author`: 英文为 `"Stardew Valley Planner Team"`，中文为 `"星露谷规划器团队"`；
  - `featured`: 固定为 `false`；
  - `coverImage`: `{ src: "/blog/how-to-harvest-stardew-valley-cover.webp", alt: string }`。

---

## 9. 后续 ego-browser 验证就绪信息 (ego-browser Readiness)

本轮无需启动浏览器，但已为后续阶段使用本地 `ego-browser` 备齐完整环境信息：

- **服务状态**：活跃运行中（PID `44772`，端口 `127.0.0.1:3004`）
- **验证端点 URL**：
  - 英文桌面与移动端：`http://127.0.0.1:3004/how-to-harvest-stardew-valley`
  - 中文桌面与移动端：`http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`
- **核验分辨率目标**：
  - 桌面端：`1280 × 800`
  - 移动端：`390 × 844`（关键路径：检查双语正文首屏、封面图渲染、2 处正文插图平滑加载、无横向滚动条溢出、语言切换器跳转正确）

---

## 10. 执行命令与退出码汇总 (Execution Receipts)

| 序号 | 执行命令简述 | 目标/作用 | Exit Code | 产物日志路径 |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `orca orchestration check` | 检查协调员 Inbox 消息 | 0 | 标准输出 (0 条) |
| 2 | `orca orchestration send` | 向协调员发送 heartbeat | 0 | `msg_57547affbcdd` |
| 3 | `git status / rev-parse / branch` | 核查 Git 分支、HEAD 与软链 | 0 | `pickup-q/git-env.txt` |
| 4 | `lsof / ps` | 探测 3004 端口及全系统 node 进程 | 0 | `pickup-q/process-and-port.txt` |
| 5 | `ps / lsof -p 44772` | 核验 PID 44772 的 CWD 与父进程链路 | 0 | `pickup-q/pid-44772.txt` |
| 6 | `curl HTTP endpoints` | 探测根路径、文章路径与 404 表现 | 0 | `pickup-q/http-check.txt` |
| 7 | `curl HTML dump` | 导出当前 3004 渲染 HTML，判定旧稿 | 0 | `pickup-q/en-rendered.html`, `zh-rendered.html` |
| 8 | Python SHA-256 Check | 校验 24 个历史基线文件一致性 | 0 | `pickup-q/baseline-check.txt` |
| 9 | Python Staged Media Check | 校验 6 个返工媒体资产哈希与尺寸 | 0 | `pickup-q/media-check.txt` |
| 10 | `view_file` (Multimodal) | 实读 3 张 WebP 画面核验视觉事实 | 0 | 视觉证据（南瓜 17 株、无 HUD 等） |
| 11 | `orca orchestration check` | 结案前再次核验 Inbox 消息 | 0 | 标准输出 (0 条) |
