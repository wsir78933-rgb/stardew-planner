# 基线与媒体工具核验报告 (Role Q Baseline Verification)

- **角色**：支持角色 Q（本地基线与媒体工具核验；未兼任 A-F/T/G 内容制作或最终审核）
- **任务 ID**：`task_fb0c9f003cc4`
- **Dispatch ID**：`ctx_8183b7f5dee1`
- **协调者终端**：`term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**：`term_79812ef4-f20a-48cc-b067-38f2f941cfdc`
- **工作目录**：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **Git HEAD**：`64a3b21b19444892654f98bc8042db4a95cbd1a8`（对齐 main）
- **核验模式**：`project-write` 授权下产品源码严格只读；未挂载新文章 `how-to-harvest-stardew-valley`。

---

## 1. 隔离与执行边界声明

1. **环境与工作树隔离**：本核验任务仅在当前唯一工作树 `博客-2` 执行；对产品源码（`src/`、`public/` 既有资产、`tests/`、`package.json`、`AGENTS.md` 等）保持严格只读，未修改任何产品代码或测试文件。
2. **操作系统权限隔离**：属于**逻辑隔离**；未执行底层 OS 权限拦截测试，不宣称物理或底层 OS 隔离。
3. **依赖安装与服务状态**：未执行 `pnpm install` 或新增任何 npm 依赖；未启动本地开发服务器或预览服务；未终止系统现有进程（3002、3003、3013 等保持原状）。
4. **依赖软链接核对**：`node_modules` 软链接确认为 `node_modules -> /Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`，目标项目 `next` 版本为 `16.3.0`，与本工作树 `package.json` 的 `"next": "16.3.0"` 精确一致。
5. **UI / 浏览器状态**：本轮不包含浏览器页面渲染或用户界面验证；仅提供真实命令执行与静态工具证据；不能证明最终页面展现、生产部署或用户终审。

---

## 2. 官方基线命令执行结果汇总

根据任务指令，在未改动 main 版本状态下依次执行了一次 `pnpm typecheck`、一次 `pnpm build`，以及有针对性的测试套件 `pnpm exec vitest run --no-cache tests/blog tests/i18n tests/seo tests/routes tests/assets`。官方命令失败均按真实退出码记录，严禁使用窄命令虚报 PASS。

| 步骤 / 命令 | 真实退出码 | 门禁结论 | 关键输出 / 数量统计 | 原始日志路径 |
|---|:---:|:---:|---|---|
| `pnpm typecheck` | `0` | **PASS** | TypeScript 类型检查 0 错误（`tsc --noEmit`） | `verification/baseline/typecheck.log` |
| `pnpm build` | `1` | **FAIL** | Turbopack 内部错误（软链接跨根 Panic），未生成 `out/` | `verification/baseline/build.log` |
| `pnpm exec vitest run --no-cache ...` | `1` | **FAIL** | 70 文件（60 通过，10 失败）；415 测试（397 通过，18 失败） | `verification/baseline/vitest.log` |

---

## 3. 详细命令核验与失败根因分析

### 3.1 `pnpm typecheck` (PASS)
- **执行命令**：`pnpm typecheck`（解析为 `tsc --noEmit`）
- **退出码**：`0`
- **输出摘要**：
  ```
  > @ typecheck /Users/wusir/orca/workspaces/stardew planner/博客-2
  > tsc --noEmit
  ```
- **结论**：当前 main 分支代码在 TypeScript 5.9.3 下类型检查完全通过，无任何类型定义错误。

### 3.2 `pnpm build` (FAIL)
- **执行命令**：`pnpm build`（解析为 `next build`）
- **退出码**：`1`
- **Next.js 版本**：`16.3.0 (Turbopack)`
- **原始失败输出**：
  ```text
  ▲ Next.js 16.3.0 (Turbopack)
  ✓ Running next.config.ts took 65ms
  - Experiments (use with caution):
    ✓ globalNotFound

    Creating an optimized production build ...

  -----
  FATAL: An unexpected Turbopack error occurred. A panic log has been written to /var/folders/52/j_dv3mh12r71qvz2qv17q2kc0000gn/T/next-panic-8926da8033b7872b8b5c19dd3750d3ae.log.

  > Build error occurred
  Error [TurbopackInternalError]: Symlink [project]/node_modules is invalid, it points out of the filesystem root
  ```
- **失败根因定位**：
  Next.js 16.3.0 默认使用 Turbopack 进行构建。Turbopack 内置了文件系统边界安全检查，禁止符号链接解析至项目根路径之外。在 Orca 工作树架构中，`node_modules` 是跨目录指向主工作树 `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules` 的符号链接，导致 Turbopack 判定 `[project]/node_modules is invalid, it points out of the filesystem root` 并发生 Panic 退出。
- **构建产物状态**：
  构建失败退出，工作树仅产生了 `.next/` 部分元数据，未能产生 `out/` 静态导出目录。
- **纪律恪守**：按照规则，官方命令 `pnpm build` 明确判定为 **FAIL**；不得使用额外增加 `--webpack` 参数的窄命令替代或声称构建通过。

### 3.3 Vitest 测试套件核验 (FAIL: 18 项失败 / 397 项通过)
- **执行命令**：`pnpm exec vitest run --no-cache tests/blog tests/i18n tests/seo tests/routes tests/assets`
- **退出码**：`1`
- **测试统计**：
  - 测试文件：70 个（通过 60 个，失败 10 个）
  - 测试用例：415 个（通过 397 个，失败 18 个）
  - 执行耗时：5.08s
- **失败用例分类分析**：

#### 类别 A：main 分支既有产品/内容断言漂移缺陷（共 5 项测试失败）
这 5 项失败由 main 既有历史提交引起，与本次任务及未挂载的新文章完全无关：
1. `tests/assets/public-avif-assets.test.ts:59`
   - **错误信息**：`AssertionError: expected [ ...(97) ] to have a length of 81 but got 97`
   - **根因**：main 分支合并农场案例等提交后增加了 16 张 opaque WebP 图片（总量达到 97 张），但测试中固定长度仍断言为 81。
2. `tests/blog/blog-article-content.test.tsx:34`（由第 459 行触发）
   - **错误信息**：`AssertionError: expected '<article><p>松果是松树的种子入口...' to contain '本文不发布阶段数字'`
   - **根因**：松树中文文章（`pine-tree-stardew.zh.tsx`）在后续修改中移除了该特定文案，与测试固化的断言不一致。
3. `tests/blog/blog-sources.test.tsx:327`
   - **错误信息**：`AssertionError: expected ... to contain '<p class="blog-sources__checked">The ...'`
   - **根因**：松树英文文章来源核对文案与测试固定字符串存在历史差异。
4. `tests/blog/pine-tree-stardew-identity.test.ts:67`
   - **错误信息**：`expect(chineseMarkup).toContain("本文不发布阶段数字")` 失败。
   - **根因**：与类别 A.2 相同，松树中文文章正文缺少该短语。
5. `tests/routes/removed-public-pages.test.ts:77`
   - **错误信息**：`AssertionError: expected [ '/', '/privacy', ... (27) ] to have a length of 26 but got 30`
   - **根因**：现有文章总数为 24 篇，计算公开路径总数为 30（4 固定页 + 2 博客索引 + 24 文章），而测试中固定硬编码期望长度为 26。

#### 类别 B：因 `pnpm build` 失败未生成 `out/` 导致的下游路由/静态产物缺失（共 13 项测试失败）
由于 `pnpm build` 失败未生成 `out/` 目录，以下依赖静态导出产物的端到端测试均报 `ENOENT` 或文件不存在：
1. `tests/routes/llms.test.ts:8`：找不到 `out/llms.txt`。
2. `tests/routes/react-planner-static-delivery.test.ts:10`：找不到 `out/index.html`。
3. `tests/routes/removed-public-pages.test.ts:88`：找不到 `out/sitemap.xml`。
4. `tests/routes/removed-public-pages.test.ts:55`：找不到 `out/_next/static`。
5. `tests/routes/sitemap-robots.test.ts:61`：找不到 `out/robots.txt`。
6. `tests/routes/sitemap-robots.test.ts:71`：找不到 `out/sitemap.xml`。
7. `tests/routes/static-public-pages.test.ts:2393`：找不到 `out/robots.txt` 与 `out/sitemap.xml`。
8. `tests/routes/static-public-pages.test.ts:1896`（第 2411 行）：找不到预构建 `out/blog.html`。
9. `tests/routes/static-public-pages.test.ts:1896`（第 2536 行）：找不到预构建 `out/index.html`。
10. `tests/routes/static-public-pages.test.ts:2653`：找不到预构建 `out/zh/terms.html`。
11. `tests/routes/static-public-pages.test.ts:1896`（第 2659 行）：找不到预构建 `out/404.html`。
12. `tests/routes/static-routes.test.ts:96`（第 135 行）：找不到静态路由 `out/index.html`。
13. `tests/routes/static-routes.test.ts:96`（第 149 行）：找不到双语首页外壳 `out/index.html`。

---

## 4. 共享依赖与缓存隔离核验

根据协调者关于「共享依赖缓存写入边界」的明确指引：
1. **参数选择**：Vitest 3.2.4 原生通过 `--no-cache` 参数完全关闭测试结果缓存（禁用 `ResultsCache`，`results.json` 不写入任何路径）。根据源码核对，`--cache.dir` 在 Vitest 3 中已废弃，强制使用会抛出异常；因此采用 `--no-cache` 为最稳妥符合要求的方案。
2. **主目录写入探测**：
   - 在测试前后对主工作树共享依赖目录 `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules/.vite` 进行属性监控：
     - 测试前 mtime：`1785046552`
     - 测试后 mtime：`1785046552`（完全一致，未发生变动）
   - 全盘扫描主工作树 `node_modules` 最近修改文件（`-mmin -5`），结果为 0 项。
   - **结论**：本次测试执行严格未向 main 依赖目录写入任何测试或构建缓存。

---

## 5. 媒体转换能力只读核验

根据指令，对系统当前已安装媒体工具进行只读核查（不添加依赖、不执行实际转换、不生成公开图片、不泄露密钥）：

| 工具 | 路径 | 版本 / 状态 | WebP / AVIF 支持情况 |
|---|---|---|---|
| **ffmpeg** | `/opt/homebrew/bin/ffmpeg` | `8.0.1` (Apple clang 17.0.0) | 完整支持。编码器包含 `libwebp`、`libwebp_anim`、`libaom-av1`、`libsvtav1`。 |
| **sips** | `/usr/bin/sips` | macOS 原生图像处理系统 | 支持 WebP 读取（`org.webmproject.webp`）；支持 AVIF 读取与写入（`public.avif Writable`）。 |
| **cwebp** | `/opt/homebrew/bin/cwebp` | `1.6.0` (libsharpyuv 0.4.2) | 原生支持 WebP 编码。 |
| **sharp** | `node_modules` | **未安装**（`Cannot find module 'sharp'`） | 项目未引入 sharp 依赖。 |

**核验结论**：当前本地环境具备完善的 WebP 与 AVIF 生成与读取支持能力（主要通过 `ffmpeg` 与 `sips` / `cwebp` 命令行工具提供）。

---

## 6. 工作树干净度与回读审计

- `git rev-parse HEAD`：`64a3b21b19444892654f98bc8042db4a95cbd1a8`（与 main 完全一致）。
- `git diff --check`：退出码 `0`，无任何未提交的空格或行尾异常。
- `git diff --stat`：退出码 `0`，产品源码变更计数为 `0`（source diff = 0）。
- `git status --short`：
  ```text
  ?? docs/blog-ops/how-to-harvest-stardew-valley/
  ?? node_modules
  ```
  除本次任务合规新建的基线核验目录以及既有未跟踪的 `node_modules` 软链接外，无任何受跟踪的产品文件被污染或意外修改。

---

## 7. 原始日志文件清单与 SHA-256 校验码

以下原始日志已持久化于 `docs/blog-ops/how-to-harvest-stardew-valley/verification/baseline/` 目录下：

| 文件相对路径 | 字节大小 | 描述 | SHA-256 校验和 |
|---|---:|---|---|
| `verification/baseline/typecheck.log` | 85 B | `pnpm typecheck` 完整执行输出日志 | `6d8837000472e46b9d3a31fd0d76b283502afadce4caeaf94d016c9071d0af44` |
| `verification/baseline/build.log` | 2,927 B | `pnpm build` 原始失败与 Panic 输出日志 | `7cb2da91e94588002ab37fff563f4e64fa878eaa2c8698a0991d8b567144c4a4` |
| `verification/baseline/vitest.log` | 105,911 B | `vitest` 5 个目标套件完整原始测试日志 | `68dc6a028f744b32df1dbef1bbe087955ea0c563860d465885cf95770b65152e` |
| `verification/baseline/media-tools.log` | 836 B | 媒体工具版本与格式探测原始日志 | `a55171369e8d8b139be009e47d5c37ac3412065e49c4ba59f686ae8036e604fe` |
