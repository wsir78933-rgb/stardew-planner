# R 独立源码审查报告 (R-source-review)

- **审查角色**: R (Independent Source Reviewer / 独立源码审查)
- **审查日期**: 2026-10-13
- **审查范围**: 仅针对本次新增之中英文源码组件 `src/blog/articles/how-to-harvest-stardew-valley.{en,zh}.tsx`，以及本次 Git Diff 变更之 `src/blog/blog-post-identities.ts`、`src/blog/blog-post-registry.tsx`、`src/blog/blog-copy.ts`、`public/llms.txt` 与相关测试文件。
- **工作树唯一性**: `/Users/wusir/orca/workspaces/stardew planner/博客-2`（无任何嵌套/内置子代理，无新建分支或工作树，HEAD: `64a3b21b19444892654f98bc8042db4a95cbd1a8`）。
- **实读审查组件 SHA-256 锁定**:
  - `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`: `dacc4d0361dbd894eec29a6f67b554ce8ee5033d78de6aba1fa87b9b48218daf`
  - `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`: `98f2835aea750c56e931b933dd4b7ef158c679095c26fb0f5ea1f965827663ae`
- **上游交接与媒体冻结文件锁定**:
  - `docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-en.json`: `8ed90bfab4dbdd4158ae2b0fe38e5f380f3922d2d1922b3ae5142017c51ee2c9`
  - `docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-zh.json`: `3debdcefc4bb9e7217bd43e1fdb3484d1b7ef5e3418b073d6ec308e4ef7034de`（新版，旧 `fc834...` 确认废弃）
  - `docs/blog-ops/how-to-harvest-stardew-valley/media/final-manifest.json`: `46052a8fb71df1670982203c612238e16333bde5eecdf5a6ecc12443019bbace`
  - `docs/blog-ops/how-to-harvest-stardew-valley/reviews/E-translation-review.md`: `fa67a68695edba6eeed908ff04dedd7b9bcb48387bbdf72061d7a5a558624458`
  - `docs/blog-ops/how-to-harvest-stardew-valley/reviews/F-media-freeze-v2.md`: `a2057665a3b7702453a600ded48dbd046ac82f1b2aa7264ff50b64a8a0f86cec`
- **任务 ID**: `task_7a8493c81644`
- **Dispatch ID**: `ctx_31bd905a4b19`
- **审查结论**: **PASS (源码独立审查完全通过，仅限源码本身，不指代页面渲染与生产部署)**

---

## 1. 完整读者内容保真检验 (Full Reader Fidelity)

审查采用确定性自动化文本块提取比对脚本（证据路径：`docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/verify_fidelity.py`），对批准交接文档与实际 TSX 组件执行全量比对（非抽样）：

| 检查项 | 英文文章 (`.en.tsx`) | 中文文章 (`.zh.tsx`) | 判定 | 证据记录 |
|---|---|---|:---:|---|
| **文本块总数** | 53 块（含段落、H2/H3 标题、列表项、图注） | 53 块（含段落、H2/H3 标题、列表项、图注） | **PASS** | 顺序、文字、标点、数字 1:1 绝对一致 |
| **数值完整性** | 全部 38 处独立数值/版本号/概率/尺寸 | 全部 38 处独立数值/版本号/概率/尺寸 | **PASS** | 1.4、1.6、1.6.9、4-7、15-21、40%、75%、100%、1672x941 完全对称 |
| **禁止成分排查** | 0 处命中 | 0 处命中 | **PASS** | 无 `BlogSources`、无 `data-blog-planner-cta`、无内部路径、无编辑附录、无来源核查旁白 |
| **图表图注对齐** | 与交接 `publicRequirements.figures[0].caption` 完全一致 | 与交接 `publicRequirements.figures[0].caption` 完全一致 | **PASS** | 完整匹配 |

- **脚本执行命令**: `python3 docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/verify_fidelity.py`
- **原始命令退出码**: `0`
- **发现问题数**: `0`
- **执行日志**: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/fidelity-audit.log`

---

## 2. 18 处链接 (Inline Hrefs) 全量序列核验

比对 TSX 中的全部 18 处 `<a>` 标签与交接文档 `body` / `publicReferences` 中的链接定义：

| 序号 | 英文 TSX 链接 (EN Href) | 中文 TSX 链接 (ZH Href) | 类型 | 判定说明 |
|:---:|:---|:---|:---:|:---|
| 1 | `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/` | `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/` | 外部讨论 | 完全一致 |
| 2 | `https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520` | `https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520` | 外部维基 | 完全一致，保留 oldid |
| 3 | `https://stardewvalleywiki.com/index.php?title=Amaranth&oldid=192043` | `https://stardewvalleywiki.com/index.php?title=Amaranth&oldid=192043` | 外部维基 | 完全一致，保留 oldid |
| 4 | `https://stardewvalleywiki.com/index.php?title=Wheat&oldid=192731` | `https://stardewvalleywiki.com/index.php?title=Wheat&oldid=192731` | 外部维基 | 完全一致，保留 oldid |
| 5 | `https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130` | `https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130` | 外部维基 | 完全一致，保留 oldid |
| 6 | `https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587` | `https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587` | 外部维基 | 完全一致，保留 oldid |
| 7 | `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/` | `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/` | 外部论坛 | 完全一致 |
| 8 | `https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481` | `https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481` | 外部维基 | 完全一致，保留 oldid |
| 9 | `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979` | `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979` | 外部维基 | 完全一致，保留 oldid |
| 10 | `https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696` | `https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696` | 外部维基 | 完全一致，保留 oldid |
| 11 | `https://stardewvalleywiki.com/index.php?title=Golden_Scythe&oldid=191051` | `https://stardewvalleywiki.com/index.php?title=Golden_Scythe&oldid=191051` | 外部维基 | 完全一致，保留 oldid |
| 12 | `https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836` | `https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836` | 外部维基 | 完全一致，保留 oldid |
| 13 | `https://www.stardewvalley.net/stardew-valley-1-6-9-changelog/` | `https://www.stardewvalley.net/stardew-valley-1-6-9-changelog/` | 官方日志 | 完全一致 |
| 14 | `https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123` | `https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123` | 外部维基 | 完全一致，保留 oldid |
| 15 | `/last-day-to-plant-stardew` | `/zh/last-day-to-plant-stardew` | **内部文章** | **中文按 locale 本地化正确，带 `className="blog-planner-link"`** |
| 16 | `https://stardewvalleywiki.com/index.php?title=Greenhouse&oldid=194164` | `https://stardewvalleywiki.com/index.php?title=Greenhouse&oldid=194164` | 外部维基 | 完全一致，保留 oldid |
| 17 | `/what-to-grow-in-greenhouse-stardew` | `/zh/what-to-grow-in-greenhouse-stardew` | **内部文章** | **中文按 locale 本地化正确，带 `className="blog-planner-link"`** |
| 18 | `https://stardewvalleyplanner.art` | `https://stardewvalleyplanner.art` | 外部产品 | 完全一致 |

- **结论**: 16 处外部引用链接 100% 精确一致，无任何篡改；2 处内部文章链接在中文 TSX 中精确映射至对应 `/zh/...` 路径，完全符合 `src/blog/blog-copy.ts` 公开导出函数 `getLocalizedBlogPostHref` 接口规范与主脑指示要求。

---

## 3. 媒体组件规范与媒体写权限归属核查

1. **`PublicPicture` 组件行为与正文属性**:
   - `src/components/public-picture.tsx` 校验 `src` 必须为 `.webp` 结尾，并自动生成同名 `.avif` 的 `<source srcSet="..." type="image/avif">`。
   - 正文插图组件 `HowToHarvestStardewValleyEnglishMethodsFigure` 与 `HowToHarvestStardewValleyChineseMethodsFigure` 调用规范：
     - `decoding="async"`
     - `loading="lazy"`
     - `width={1672}`
     - `height={941}`
     - 外层包裹标准 `<figure className="blog-article-media">` 与 `<figcaption>`。
2. **封面图渲染**:
   - 在 `src/components/blog/blog-article-content.tsx` 中由外壳调用，首屏不带 `loading="lazy"`，宽高 1672×941。
3. **媒体写权限归属验证**:
   - 规则要求「媒体只 M 可写」。
   - 对照 M 制作的最终清册 `docs/blog-ops/how-to-harvest-stardew-valley/media/final-manifest.json`（SHA-256 `46052a8fb71df1670982203c612238e16333bde5eecdf5a6ecc12443019bbace`），现场六份公开资源实算比对：
     - `/blog/how-to-harvest-stardew-valley-cover.webp`: 38974 字节, SHA `8558f5b08e0c...` (PASS)
     - `/blog/how-to-harvest-stardew-valley-cover.avif`: 17525 字节, SHA `ccd28749dfd7...` (PASS)
     - `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp`: 99024 字节, SHA `c5d987fdd4c2...` (PASS)
     - `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif`: 39279 字节, SHA `92476d4c389a...` (PASS)
     - `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp`: 105016 字节, SHA `450f78bb5aef...` (PASS)
     - `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif`: 40187 字节, SHA `d918433c3979...` (PASS)
   - 六份公开文件均与 M 的结案清单完全吻合，G2 未擅自重新转码或修改任何媒体文件。

---

## 4. 博客元数据与全站映射核查

1. **`src/blog/blog-post-registry.tsx`**:
   - 英文元数据：
     - `slug`: `"how-to-harvest-stardew-valley"`
     - `title`: `"How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe"`
     - `description`: `"Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back."`
     - `topic`: `"Stardew Valley Guides"`
     - `author`: `"Stardew Valley Planner Team"`
     - `readTimeMinutes`: `7`
     - `featured`: `false`
     - `coverImage.src`: `"/blog/how-to-harvest-stardew-valley-cover.webp"`
     - `Content`: `HowToHarvestStardewValleyEnglishArticle`
   - 中文元数据：
     - `slug`: `"how-to-harvest-stardew-valley"`
     - `title`: `"星露谷物语怎么收获：防风草右键采摘，羽衣甘蓝需要镰刀"`
     - `description`: `"站在成熟的防风草旁点击右键或按 X 键。羽衣甘蓝、苋菜、小麦、未碾米和纤维种子挥动镰刀即可收割。生长天数从播种次日算起，漏浇一天成熟日顺延一天。"`
     - `topic`: `"星露谷物语指南"`
     - `author`: `"星露谷规划器团队"`
     - `readTimeMinutes`: `7`
     - `featured`: `false`
     - `coverImage.src`: `"/blog/how-to-harvest-stardew-valley-cover.webp"`
     - `Content`: `HowToHarvestStardewValleyChineseArticle`
   - 顺序：两份数组均紧随 `oak-tree-vs-maple-stardew` 之后，作为第 25 篇文章登记。
2. **`src/blog/blog-post-identities.ts`**:
   - `blogPostSlugs` 数组末尾追加 `"how-to-harvest-stardew-valley"`，共 25 个 slug。
3. **`src/blog/blog-copy.ts`**:
   - `localizedBlogPostPaths.en` 增加 `"how-to-harvest-stardew-valley": "/how-to-harvest-stardew-valley"`
   - `localizedBlogPostPaths["zh-CN"]` 增加 `"how-to-harvest-stardew-valley": "/zh/how-to-harvest-stardew-valley"`
4. **`public/llms.txt`**:
   - `## English` 段落追加第 25 篇标准条目。
   - `## 简体中文` 段落追加第 25 篇标准条目。

---

## 5. 测试代码变动审计 (Test Changes Audit)

审查编写独立审计脚本 `docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/verify_test_diffs.py`，对 Git Diff 涉及的所有 6 个测试文件进行逐行代码审查：

| 测试文件 | 改动内容 | 是否存在删测试/伪造通过 | 判定 |
|---|---|:---:|:---:|
| `tests/blog/blog-home-state.test.ts` | 更新总数（24->25）、专题页数（2->3）、最新 6 篇首位新增收货文并移除末位旧篇、超出页数夹紧断言（第 3 页） | 否 | **PASS** |
| `tests/blog/blog-post-registry.test.ts` | 描述文字（24->25、48->50 路径）、追加期望 slug、追加规范路径、追加封面路径映射、新增收获文元数据对齐测试用例 | 否（仅追加断言） | **PASS** |
| `tests/i18n/public-route-registry.test.ts` | 路径数断言（规范 30->31，本地化 60->62，可索引 58->60）、追加新篇本地化路径断言 | 否 | **PASS** |
| `tests/routes/blog-routes.test.tsx` | 首页最新 6 篇 HTML 断言（`last-day-to-plant-stardew` -> `how-to-harvest-stardew-valley`） | 否 | **PASS** |
| `tests/routes/removed-public-pages.test.ts` | 静态路由计数（规范 26->31，本地化 52->62，可索引 50->60，sitemap loc 50->60） | 否 | **PASS** |
| `tests/seo/canonical-public-routes.test.ts` | `canonicalPublicPaths` 长度（30->31）、`expectedBlogCanonicalPaths` 追加新篇 slug | 否 | **PASS** |

- **脚本执行命令**: `python3 docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/verify_test_diffs.py`
- **原始命令退出码**: `0`
- **发现删除/伪造测试数**: `0`
- **执行日志**: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/test-diff-audit.log`

---

## 6. 既有验证日志回读 (Verification Logs Inspection)

本角色 R 遵守「只读 diff/hash 和真实已存在验证 logs，不跑 build/tests/server/browser，不争用 .next，E 独立 UI」的原则，对 `docs/blog-ops/how-to-harvest-stardew-valley/verification/assembly/` 下的真实日志进行回读验证：
- `typecheck.log`: `tsc --noEmit` 退出码 `TYPECHECK_EXIT:0`
- `typecheck-r2.log`: `tsc --noEmit` 退出码 `TYPECHECK_R2_EXIT:0`
- `vitest-fidelity.log`: `render-reader-text.test.tsx` 2 passed, 退出码 `VITEST_FIDELITY_EXIT:0`

---

## 7. 软件工程与代码质量准则符合性

1. **高内聚、低耦合**:
   - `how-to-harvest-stardew-valley.{en,zh}.tsx` 组件仅依赖 `PublicPicture`，不依赖外部未公开模块；
   - 视图层与数据层（Registry / Identies / Route Registry）边界分明。
2. **单一职责原则**:
   - 插图组件 `HowToHarvestStardewValley{English,Chinese}MethodsFigure` 专职媒体与图注渲染；
   - 文章组件 `HowToHarvestStardewValley{English,Chinese}Article` 专职文章内容呈现；
   - 页面外壳 `BlogArticleContent` 专职统一 Header、H1、目录与布局。
3. **公开接口通信**:
   - 跨模块通信严格调用 `blog-copy.ts` 导出的 `getLocalizedBlogPostHref` 与 `blog-post-registry.tsx` 导出的 `getBlogPostBySlug`，未直接触碰模块未导出的内部实现。
4. **KISS / YAGNI**:
   - 采用纯净无状态函数组件，未构造冗余类、高阶函数或未来扩展抽象层。
5. **Fail-Fast**:
   - Registry 校验器 `validateBlogPostRegistry` 在顺序或数量不符时立即抛出带期望与实际值的具体异常，无任何 silent fail 或空 catch 吞错。
6. **精确命名**:
   - 函数与变量均具备精准语义（如 `HowToHarvestStardewValleyEnglishArticle`、`expectedSlugs`），无通用泛名（如 `data`、`temp`、`helper`、`util`、`manager`）。

---

## 8. 审查结论与交付信息

- **总发现问题数**: 0 处
- **结论**: **PASS**（源码审查独立通过，本结论仅代表源码保真度、代码规范及测试变更符合性，不代表本地 UI 呈现或生产部署完成）。
- **耐久报告与证据文件**:
  - 主报告: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review.md`
  - 证据目录: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/R-source-review/`
    - `verify_fidelity.py` (保真度自动化验证脚本)
    - `fidelity-audit.log` (保真度执行日志，退出码 0)
    - `verify_test_diffs.py` (测试改动审计脚本)
    - `test-diff-audit.log` (测试改动执行日志，退出码 0)
    - `checksums.txt` (全量关键文件 SHA-256 校验和记录)
