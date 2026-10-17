# 技术审查报告：house-upgrade-stardew (Reviewer R)

- **审查角色**: 独立技术 Reviewer R（仅限代码与集成产物只读技术审查，非 G 实现/验证方，非 E 内容审核方）
- **审查日期**: 2026-10-16 (Asia/Shanghai)
- **审查分支与工作树**: `博客-2` @ `/Users/wusir/orca/workspaces/stardew planner/博客-2` (HEAD: `bf91a14829067ed1c9c2a206a97985e17dbebdda`)
- **Task ID**: `task_76678cebd162`
- **Dispatch ID**: `ctx_ca532d4cb3a6`
- **审查结论**:
  - **本次文章装配与技术实现**: **PASS**（0 缺陷，完全符合 12 代码/测试路径 + 12 媒体资产与冻结交接契约）
  - **全量测试套件基线状态**: **FAIL**（保留仓库固有 12 项历史失败限制，0 项属于本次引入）
- **技术缺陷数**: 0（另记录 1 处前期文档字节记录笔误，已由 G 验证报告审计更正，非代码或正文缺陷）

---

## 一、审查边界与执行原则

1. **角色边界**:
   - 本角色仅对 G 网站装配产物、静态导出结果、真实验证 raw 日志、Git diff 与双语 PublicBlogHandoff 执行独立技术审计与密码学哈希核验。
   - 严禁执行修复、`pnpm build`、`pnpm test` 或修改正在运行的静态预览产物（E 浏览器验收进程正基于 `127.0.0.1:3010` 并行测试）。
   - 产品、测试、资产、内容、控制文件均为只读，不写内部数据库或私有控制目录。
2. **审查依据**:
   - 协调者指令 `msg_0c0f08831e7e` 与公开交接清单。
   - `docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json`。
   - `docs/blog-ops/house-upgrade-stardew/assembly/validation/` 下真实原始日志（`typecheck.txt`、`build-webpack.txt`、`vitest-interface.txt`、`vitest-full.txt`、`render-check-corrected.txt`、`preview.json`、curl 头信息）。
   - 真实源码与产物文件的 SHA-256 校验和。

---

## 二、写入范围与隔离性核验（12 代码/测试路径 + 12 媒体资产）

核验 `git status --short` 与 `git diff`，确认本次写入严格限定于约定范围内：

| 分类 | 文件路径 | 状态 | 核验结果 |
|---|---|---|---|
| **文章组件** | `src/blog/articles/house-upgrade-stardew.en.tsx` | 新增 (untracked) | 公开导出 `HouseUpgradeStardewEnglishArticle`，无私有 ops 导入 |
| **文章组件** | `src/blog/articles/house-upgrade-stardew.zh.tsx` | 新增 (untracked) | 公开导出 `HouseUpgradeStardewChineseArticle`，无私有 ops 导入 |
| **身份注册** | `src/blog/blog-post-identities.ts` | 修改 (tracked) | 末尾追加 `house-upgrade-stardew`（总数由 25 增至 26） |
| **注册表** | `src/blog/blog-post-registry.tsx` | 修改 (tracked) | 注册双语元数据：`featured: false`、`readTimeMinutes: 6`、同序追加 |
| **路由文案** | `src/blog/blog-copy.ts` | 修改 (tracked) | 增加 2 处本地化路径映射（`/house-upgrade-stardew`、`/zh/house-upgrade-stardew`） |
| **AI 索引** | `public/llms.txt` | 修改 (tracked) | 英文与中文部分各追加 1 条子弹项，URL 与描述完全符合 handoff |
| **单元测试** | `tests/blog/blog-post-registry.test.ts` | 修改 (tracked) | 更新总数至 26、追加路径、封面与倒序断言，无掩盖基线行为 |
| **单元测试** | `tests/blog/blog-home-state.test.ts` | 修改 (tracked) | 更新总数至 26、更新 latest 6 与 carousel 第 3 页 |
| **单元测试** | `tests/i18n/public-route-registry.test.ts` | 修改 (tracked) | 规范路径增至 32，本地化路由增至 64，可索引路由增至 62 |
| **单元测试** | `tests/seo/canonical-public-routes.test.ts` | 修改 (tracked) | 规范路径总数更新为 32 |
| **单元测试** | `tests/routes/removed-public-pages.test.ts` | 修改 (tracked) | 规范路径更新为 32，sitemap `<loc>` 更新为 62 |
| **单元测试** | `tests/routes/blog-routes.test.tsx` | 修改 (tracked) | 博客首页最新文章链接由 pine-tree 替换为 house-upgrade |
| **媒体封面** | `public/blog/house-upgrade-stardew-cover.{webp,avif}` | 新增 (untracked) | 2 个文件，尺寸均为 1672×941 |
| **媒体封面** | `public/blog/house-upgrade-stardew-cover-zh.{webp,avif}` | 新增 (untracked) | 2 个文件，尺寸均为 1672×941 |
| **正文插图** | `public/blog/illustrations/house-upgrade-stardew/tier-rooms.{en,zh}.{webp,avif}` | 新增 (untracked) | 4 个文件，尺寸均为 1672×941 |
| **正文插图** | `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.{en,zh}.{webp,avif}` | 新增 (untracked) | 4 个文件，尺寸均为 1672×941 |
| **自动生成** | `next-env.d.ts` | 修改 (tracked) | Next.js build 自动更新类型声明指向 `.next/types`，非人工编辑 |

- **未触及范围确认**:
  - 全局/共享 CSS（`app/globals.css` 等）: **未修改**。
  - 共享路由（`app/(en)/[slug]/page.tsx`、`app/zh/[slug]/page.tsx`、`app/sitemap.ts` 等）: **未修改**。
  - 依赖与配置（`package.json`、`pnpm-lock.yaml`、`next.config.ts`、`tsconfig.json`）: **未修改**（`git diff --exit-code` 退出码 0）。
  - 历史文章（`src/blog/articles/` 下既有文章）: **未修改**。
  - 契约说明：原 Task 历史字样“17 代码路径”经审计确认实际为 12 处代码/测试路径；`tests/blog/house-upgrade-stardew-identity.test.ts` 未新建，现有 6 个测试已全面覆盖注册表、路由、封面与元数据，未盲目新增重复测试。

---

## 三、密码学哈希与一致性审计

独立计算实际文件 SHA-256 并与协调者消息 `msg_0c0f08831e7e`、`AssemblyManifest.json` 及 G 验证报告比对：

| 校验对象 | 预期 SHA-256 | 实际 SHA-256 | 比对结论 |
|---|---|---|---|
| `handoff/public/en.json` | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` | 同左 | **MATCH** |
| `handoff/public/zh-CN.json` | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` | 同左 | **MATCH** |
| `assembly/AssemblyManifest.json` | `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834` | 同左 | **MATCH** |
| `house-upgrade-stardew.en.tsx` | `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5` | 同左 | **MATCH** |
| `house-upgrade-stardew.zh.tsx` | `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba` | 同左 | **MATCH** |
| `validation/report.md` | `76503d1cc1008b3fd073e6a976c5f124be56739da22dceb083c373f72d0582d6` | 同左 | **MATCH** |
| `validation/commands.log` | `bfd1b169b5e4156e3272502c3cb4df08b3eba7ef37752775c7f4a3aaa63ab26d` | 同左 | **MATCH** |
| `validation/baseline-comparison.md` | `5f1d279ecd0a93d2aad5c4177ea09dec8c5246efbf0bbcfb25f744d11ec86b38` | 同左 | **MATCH** |
| `validation/preview.json` | `fc0e91e377bdfed1ec183d38144caaa12698cf364046cf5cfa58f3f57da77e3b` | 同左 | **MATCH** |

- **Handoff 正文与字段哈希重算**:
  - English `bodyHash`: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`（重算通过）
  - English `publicFieldsSha256`: `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042`（重算通过）
  - Chinese `bodyHash`: `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6`（重算通过）
  - Chinese `publicFieldsSha256`: `d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94`（重算通过）
  - Chinese `integrity.englishBodyHash`: 完全等于 English `bodyHash`。
- **Manifest `ownedOutputSha256` 22 项**: 经脚本全量重算磁盘文件，全部 22 项哈希与 Manifest 记录 100% 吻合。
- **文章模块哈希为 null 的审计说明**: Manifest 中 `articles.en.outputSha256` 与 `articles.zh-CN.outputSha256` 为 null 属于 G 集成阶段所有权隔离设计（由绑定报告与 validation 汇总验证真实哈希），非遗漏缺陷。

---

## 四、组件结构与机械绑定核验

对 `src/blog/articles/house-upgrade-stardew.{en,zh}.tsx` 执行 AST 与文本节点核查：

1. **标题层级**:
   - 组件内部**无任何 `<h1>` 标签**（由外层页面壳统一渲染注册表标题）。
   - 包含恰好 **6 个 `<h2>`** 与 **2 个 `<h3>`**，顺序与措辞同冻结 handoff 正文逐字完全一致。
2. **段落、表格与链接逐字绑定**:
   - 英文正文 47 处文本节点、50 处行内链接，与 handoff 逐字吻合。
   - 中文正文文本节点与 50 处行内链接与 handoff 逐字吻合。
   - 唯一站内链接 `https://stardewvalleyplanner.art/carpenter-stardew` 在中英文中均准确挂载（中文依契约保留已审英文生产 URL）。
   - 表格严格采用 `blog-table-scroll` 与 `blog-data-table` 结构，3 档数据、金币、材料与天数无错漏。
3. **媒体组件绑定 (`PublicPicture`)**:
   - 正文包含恰好 2 个 `PublicPicture`，均设置 `width={1672}`、`height={941}`、`loading="lazy"`、`decoding="async"`。
   - 外层包裹 `<figure className="blog-article-media">` 与 `<figcaption>`。
   - Alt 与 Caption 文本与 handoff 完全一致，无“已验证”或“本文不”等编辑腔残留。
4. **来源组件 (`BlogSources`) 与 CTA**:
   - 恰好挂载 1 处 `BlogSources`，英文标题 `heading="Sources"`，中文标题 `heading="来源"`。
   - 12 项 `publicReferences` 完全按 handoff 原始顺序排列，URL 与 Label 准确对应。
   - 版本历史条目正确传入 `versionNote`，DOM 节点未人为注入额外 ASCII 空格。
   - 仅由 `BlogSources` 附带 1 次 Planner CTA，组件内**无重复 CTA**，**无 FAQ 模块**，**无私有 ops 模块导入**。

---

## 五、测试日志分析与基线区分

审计 `docs/blog-ops/house-upgrade-stardew/assembly/validation/` 下原始测试日志：

1. **类型检查 (`typecheck.txt`)**:
   - 执行命令: `tsc --noEmit`
   - 退出码: `0` (`TYPECHECK_EXIT=0`)。
2. **Webpack 静态构建 (`build-webpack.txt`)**:
   - 执行命令: `NEXT_TELEMETRY_DISABLED=1 pnpm exec next build --webpack`
   - 退出码: `0` (`BUILD_EXIT=0`)。
   - 产物: 成功生成 68 个静态页面（包含 66 个 HTML 文件），覆盖中英文 `house-upgrade-stardew` 路由。
3. **接口测试套件 (`vitest-interface.txt`)**:
   - 执行退出码: `1`（8 项失败，237 项通过，共 245 项测试）。
   - 审计结论:
     - 8 项失败**全部与 2026-10-15 历史基线失败完全同名同因**（AVIF 衍生图测试期待 81 收到 108，增量 6 项完全符合新增 6 个 WebP 资产预期；Pine 树相关指南中文断言失败；llms 缺失 fruit 路由；static-public-pages 缺失封面/部分排序/404 CSS 路径差异）。
     - 本次修改覆盖的 6 个测试文件（`blog-post-registry` 20 项、`blog-home-state` 18 项、`public-route-registry` 4 项、`canonical-public-routes` 1 项、`removed-public-pages` 3 项、`blog-routes` 19 项）及 `blog-planner-cta` 8 项**全部绿灯通过**。
     - 本次新增未引入任何新失败断言，亦未修改断言掩盖旧失败。
4. **全量测试套件 (`vitest-full.txt`)**:
   - 执行退出码: `1`（12 项失败，2478 项通过，共 2490 项测试）。
   - 审计结论:
     - 包含上述 8 项历史失败，另含 4 项与本次完全无关的仓库级历史失败（`catalog-loader`、`local-planner-resource-smoke`、`how-to-harvest` 英文/中文旧 reader text 校验）。
     - 没有任何一项失败指向或涉及 `house-upgrade-stardew`。
     - 全量套件退出码为 1 属于仓库既有环境约束，已如实记录为基线限制。
5. **DOM 渲染比对 (`render-check-corrected.txt`)**:
   - 退出码: `0` (`CORRECTED_ERROR_COUNT=0`)，双语各 12 条引用标签、note 与 href 独立比对 100% 通过。

---

## 六、静态页面与 SEO 输出核验

核对 `out/house-upgrade-stardew.html`、`out/zh/house-upgrade-stardew.html`、`out/sitemap.xml` 及 `out/llms.txt`：

1. **元数据标签与 SEO 契约**:
   - `<title>`: 准确对应 handoff 双语标题。
   - `<meta name="description">`: 准确对应 handoff 双语描述。
   - `<link rel="canonical">`: 英文指向 `https://stardewvalleyplanner.art/house-upgrade-stardew`，中文指向 `https://stardewvalleyplanner.art/zh/house-upgrade-stardew`（末尾无斜杠）。
   - `<link rel="alternate" hrefLang="...">`: 包含 `en`、`zh-CN` 与 `x-default`（指向英文），链接全部准确。
   - OpenGraph / Twitter Cards: `og:title`、`og:description`、`og:image`、`og:type="article"`、`twitter:card="summary_large_image"` 全量输出。
2. **Sitemap 与 LLMS**:
   - `out/sitemap.xml`: `<loc>` 条目数恰好为 62（基线 60 + 新增双语 2 篇），包含中英文文章真实地址。
   - `out/llms.txt`: 与 `public/llms.txt` 100% 完全一致，包含新文章的双语标题、描述与链接。
3. **静态预览服务 (`preview.json`)**:
   - 预览服务由 PID 21887 监听于 `127.0.0.1:3010`。
   - `curl` 双语路由均返回 HTTP 200，内容哈希与 `out/` 下 HTML 完全一致。

---

## 七、工程规范与架构原则核验

1. **高内聚、低耦合**:
   - 文章组件只负责文章正文渲染，通过公共组件公开接口（`PublicPicture`、`BlogSources`）通信，无内部私有状态耦合。
   - 注册表通过 `BlogPostMeta` 接口注册，各司其职。
2. **单一职责原则 (SRP)**:
   - 英文文章主函数 `HouseUpgradeStardewEnglishArticle` 调度各独立章节渲染函数。
   - 中文文章线性渲染，逻辑扁平清晰。
3. **公开接口原则**:
   - 仅通过导出函数与类型通信，外部不直接访问内部。
4. **KISS 原则**:
   - 采用标准 JSX 与语义化 HTML 标签，无多余抽象或过度工程。
5. **Fail Fast 原则**:
   - 注册表校验函数在启动与测试时强制校验倒序与唯一性，异常信息包含具体冲突值。
6. **YAGNI 原则**:
   - 严格实现当前文章所需字段，未提前设计未来抽象或冗余结构。
7. **精确命名**:
   - 组件、文件、路由与变量命名清晰具体，无 `temp`/`helper`/`data` 等模糊命名。

---

## 八、审计记录更正说明

- **中文绑定报告字长记录**: `docs/blog-ops/house-upgrade-stardew/assembly/zh-bindings.md` 第 36 行记录 `src/blog/articles/house-upgrade-stardew.zh.tsx` 大小为 9658 字节。经审查磁盘文件，实际大小为 14218 字节，文件实际 SHA-256（`2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba`）与预期完全一致。此项属于记录笔误，已在 G 验证报告中更正说明，不影响代码正确性与正文哈希。

---

## 九、Reviewer R 未运行命令说明

依据 Task 明确禁令及协调者指令，Reviewer R 未执行：
- `pnpm typecheck` / `pnpm build` / `pnpm test` / `vitest run`
- 预览服务重启或进程终止
- 原因：E 角色正在并行使用本地浏览器进行页面视觉与交互验收，避免破坏静态预览产物或引起端口竞态；Reviewer R 仅通过只读方式独立核对现有 raw 日志、diff、产物与哈希。

---

## 十、技术审查最终结论

本次 `house-upgrade-stardew` 关键词的双语博客页面技术装配在代码边界、哈希校验、结构绑定、SEO 导出、静态生成以及架构设计规范方面**完全合格，判定为 PASS**。仓库全量测试套件仍保留 12 项历史基线限制，按规则如实记录。
