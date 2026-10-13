# Webpack 替代构建与测试基线报告 (Role Q Baseline Webpack Verification)

- **角色**：支持角色 Q（工作树共享依赖构建验证方式与完整替代构建基线核验；未兼任 A-F/T/G 内容制作或最终审核）
- **任务 ID**：`task_5577ae3be977`
- **Dispatch ID**：`ctx_18a4b70a2ef9`
- **协调者终端**：`term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**：`term_79812ef4-f20a-48cc-b067-38f2f941cfdc`
- **工作目录**：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **Git HEAD**：`64a3b21b19444892654f98bc8042db4a95cbd1a8`（对齐 main）
- **核验模式**：`project-write` 授权下产品源码严格只读；未挂载新文章 `how-to-harvest-stardew-valley`。

---

## 1. 默认构建失败状态与替代编译器依据

1. **默认官方构建状态保持 FAIL**：
   - 在未改动 main 状态下，默认官方命令 `pnpm build`（Next.js 16.3.0 默认 Turbopack）由于无法跨根解析工作树外部的 `node_modules` 符号链接而发生 Panic（退出码 `1`，日志见上一轮 `verification/baseline/build.log`）。
   - 该失败结论保持为 **FAIL**，绝不因替代编译器构建成功而追溯修改或隐匿。
2. **本地 Next 16.3 CLI Guide 依据**：
   - 查阅本地文档 `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md` 第 101 行：
     `| --webpack | Build using Webpack. |`
   - 查阅本地命令 `pnpm exec next build --help`：明确列出 `--webpack Builds using webpack.` 参数。
   - 本地 `scripts/dev.sh` 既有配置亦采用 `--webpack` 解决开发服务相同软链接约束。
3. **定位声明**：
   - `pnpm build --webpack` 是使用 Next.js 官方支持的完整替代编译器（Webpack）进行的完整静态生产构建，输出完整的 App Router 静态 HTML 与 SSG 资源。它不是窄测试，不替代默认 Turbopack 的基线失败事实，而是作为解决工作树共享依赖编译的完整替代基线。

---

## 2. 替代构建执行结果 (`pnpm build --webpack`)

- **执行命令**：`pnpm build --webpack`（由 pnpm 转发给 `next build --webpack`）
- **真实退出码**：`0`（**PASS**）
- **构建耗时与阶段**：
  - 配置与启动：`next.config.ts` 耗时 14ms
  - 核心编译：`Compiled successfully in 13.7s`
  - TypeScript 类型检查：`Finished TypeScript in 6.5s`
  - 静态页面生成：`Generating static pages using 11 workers (64/64) in 363ms`
- **生成路由汇总（共 64 个静态路由）**：
  - 24 篇英文博客文章（`● /[slug]`）：`carpenter-stardew`、`where-is-robin-stardew-valley`、`stardew-valley-npc` 等 24 条 SSG。
  - 24 篇中文博客文章（`● /zh/[slug]`）：`zh/carpenter-stardew` 等 24 条 SSG。
  - 16 个静态固定路由（`○ (Static)`）：
    - 根与 404：`/`、`/_not-found`
    - 博客索引：`/blog`、`/blog/archive`、`/zh/blog`、`/zh/blog/archive`
    - 法务与联系：`/contact`、`/privacy`、`/terms`、`/zh/contact`、`/zh/privacy`、`/zh/terms`
    - SEO 元数据：`/robots.txt`、`/sitemap.xml`
    - 中文首页：`/zh`
- **产物目录**：完整生成 `.next/` 以及静态导出目录 `out/`（包含 58 个 HTML 文件、静态 `_next/static` 资源、`sitemap.xml`、`robots.txt`、`llms.txt` 等）。
- **日志归档**：`verification/baseline-webpack/build-webpack.log`

---

## 3. 在有 `out/` 产物状态下的测试套件回读 (`vitest`)

- **执行命令**：`pnpm exec vitest run --no-cache tests/blog tests/i18n tests/seo tests/routes tests/assets`
- **真实退出码**：`1`（**FAIL**）
- **测试结果统计**：
  - 测试文件：70 个（通过 63 个，失败 7 个）
  - 测试用例：415 个（通过 405 个，失败 10 个）
  - 执行耗时：5.26s

### 3.1 对比首次无 `out/` 基线运行（18 失败 -> 10 失败）

由于 Webpack 构建成功产出了完整的 `out/` 目录，首次运行中因缺少静态导出文件而失败的 8 项端到端测试已自动恢复通过：
- `tests/routes/react-planner-static-delivery.test.ts:10`（静态首页读取）：**PASS**
- `tests/routes/removed-public-pages.test.ts:55`（扫描 `out/_next/static`）：**PASS**
- `tests/routes/sitemap-robots.test.ts:61`（读取 `out/robots.txt`）：**PASS**
- `tests/routes/sitemap-robots.test.ts:71`（读取 `out/sitemap.xml`）：**PASS**
- `tests/routes/static-public-pages.test.ts:2393`（检查 crawler-discovery 文件）：**PASS**
- `tests/routes/static-public-pages.test.ts:2653`（检查法务页面 HTML）：**PASS**
- `tests/routes/static-routes.test.ts:96`（第 135 行，静态路由读取）：**PASS**
- `tests/routes/static-routes.test.ts:96`（第 149 行，双语首页外壳读取）：**PASS**

### 3.2 当前实际失败的 10 项测试用例详细归因

所有 10 项失败均源于 main 分支既有代码/断言漂移或编译器产物格式差异，与新文章无关：

| # | 测试用例与文件行号 | 失败类型 | 真实错误描述与根因 |
|---|---|:---:|---|
| 1 | `tests/assets/public-avif-assets.test.ts:59` | main 既有断言 | 期望 81 张 opaque WebP，实际存在 97 张（main 合并农场案例增加 16 张）。 |
| 2 | `tests/blog/blog-article-content.test.tsx:34` (L459) | main 既有断言 | 松树中文文章正文缺少历史文案 `'本文不发布阶段数字'`。 |
| 3 | `tests/blog/blog-sources.test.tsx:327` | main 既有断言 | 松树英文来源描述字符串与测试固定期望存在历史差异。 |
| 4 | `tests/blog/pine-tree-stardew-identity.test.ts:67` | main 既有断言 | 断言松树中文正文缺少 `'本文不发布阶段数字'`。 |
| 5 | `tests/routes/removed-public-pages.test.ts:77` | main 既有断言 | 公开路径期望 26，实际为 30（现有 24 篇文章 + 6 基础页）。 |
| 6 | `tests/routes/llms.test.ts:148` | main 既有数据 | `out/llms.txt`（源自 `public/llms.txt`）缺少 `](https://stardewvalleyplanner.art/stardew-fruit)` 链接（main 未补齐）。 |
| 7 | `tests/routes/removed-public-pages.test.ts:92` | main 既有断言 | 期望 sitemap 内 50 条 `<loc>`，实际生成 58 条（24 文章 × 2 + 10 静态页）。 |
| 8 | `tests/routes/static-public-pages.test.ts:2506` | main 既有逻辑 | 测试期望在 `/blog` 首页找到第 19 篇 `how-to-earn-money-stardew` 封面，但首页分页窗口仅展示最新 6 篇 + 专题 12 篇。 |
| 9 | `tests/routes/static-public-pages.test.ts:2595` | main 既有断言 | 首页静态 HTML 内部分 section 标签相对 DOM 偏移顺序判定差异。 |
| 10 | `tests/routes/static-public-pages.test.ts:2668` | 编译器产物差异 | 正则期望样式表位于 `/_next/static/chunks/*.css`，而 Webpack 构建实际生成路径为 `/_next/static/css/*.css`。 |

---

## 4. 构建副作用文件核查与受控恢复时序

1. **构建触发修改**：
   - 执行 `pnpm build --webpack` 期间，Next.js 引擎自动将受跟踪文件 `next-env.d.ts` 中的 2 行引用由开发模式的 `./.next/dev/types/` 改写为生产构建模式的 `./.next/types/`。
   - 差异内容：
     ```diff
     diff --git a/next-env.d.ts b/next-env.d.ts
     index a419cbe..ce4e94a 100644
     --- a/next-env.d.ts
     +++ b/next-env.d.ts
     @@ -1,7 +1,7 @@
      /// <reference types="next" />
      /// <reference types="next/image-types/global" />
     -import "./.next/dev/types/routes.d.ts";
     -import "./.next/dev/types/root-params.d.ts";
     +import "./.next/types/routes.d.ts";
     +import "./.next/types/root-params.d.ts";
     ```
2. **规范执行与协调者询问**：
   - 严格恪守「若发现构建意外改 tracked 文件，停止并 ask 核对隔离，不自行覆盖恢复」的铁律。
   - 发现 diff 后立即暂停，保存 diff 记录至 `verification/baseline-webpack/next-env-diff.log`，并通过 `orca orchestration ask` 发起决策询问。
3. **协调者决议与受控恢复**：
   - 协调者回复指示选择方案 A，明确回读 diff 仅为 Next 引擎切换，授权执行受控恢复。
   - 确认工作目录 `博客-2` 及 HEAD `64a3b21b19444892654f98bc8042db4a95cbd1a8` 保持一致。
   - 在测试运行完毕后，执行 `git restore --source=HEAD -- next-env.d.ts` 完成受控恢复。
   - 回读验证：`git diff --check` 退出码 `0`，`git diff --stat` 退出码 `0`，受跟踪产品源码变更（source diff）严格保持为 `0`。

---

## 5. 缓存监控与真实隔离边界

1. **共享依赖目录属性监控**：
   - 主工作树 `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules/.vite` 目录 mtime 在构建前后保持为 `1785046552`。
2. **边界真实声明（不作绝对化承诺）**：
   - 按照协调者明确指引，**目录级 mtime 监控为有限检查**，不代表底层操作系统或物理隔离，亦不能证明所有文件系统绝对无写入。
   - 深入审计发现：共享依赖目录下存在历史缓存文件 `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json`，其创建时间为 `2026-07-26`，在本次测试运行期间被 Vitest 机制触碰并更新了部分用例耗时。
   - 本报告实事求是记录该事实，明确隔离属于**逻辑隔离**，绝不粉饰为“物理隔离”或“零文件系统写入”。

---

## 6. 归档日志与 SHA-256 校验码

以下原始文件已归档于 `docs/blog-ops/how-to-harvest-stardew-valley/verification/baseline-webpack/` 目录：

| 文件相对路径 | 字节大小 | 描述 | SHA-256 校验和 |
|---|---:|---|---|
| `verification/baseline-webpack/build-webpack.log` | 2,130 B | `pnpm build --webpack` 完整标准输出与退出码 | `149aa4b3a1c76eda42622459a9787e636d06f5fde209022082324bac82c88403` |
| `verification/baseline-webpack/vitest-webpack.log` | 91,489 B | Webpack 构建生成 `out/` 后的 5 套件完整测试日志 | `d16c81ed00cc0ae0f200eed737c6c7256251e13266498f2d6a9afe6224222fff` |
| `verification/baseline-webpack/next-env-diff.log` | 448 B | `next-env.d.ts` 临时变更 diff 原始回读记录 | `2db0d671237e86a37e3095482d3043bd315be4635e8abd5181143b242484f8f3` |
