# E-zh 题文复核：`profit margin stardew valley`（zh-CN）

- **角色：** E-zh 标题/SEOTruth 续审；只审 F-zh lock 的 Title、meta Description、题文承诺和静态页面契约，不改标题、不改正文、不改 F lock、不做页面装配。
- **审核日期：** 2026-09-23（Asia/Shanghai）。
- **绑定正文：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`，SHA-256 `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`。
- **绑定锁稿：** `docs/blog-ops/profit-margin-stardew/F-zh-lock.md`；F 的 C 绑定值与当前 C、D-zh v9、E-zh v9 一致。
- **独立性：** F 的候选筛选记录只作输入；本结论按 V7 标题与描述规则、七罪引擎、A/B/C/D/E、接口规格和现有中文 registry 重新核对，不沿用 F 自评。
- **本次唯一写入：** `docs/blog-ops/profit-margin-stardew/E-zh-title-review.md`。

## 结论

**PASS（题文/SEOTruth 范围）。** F 锁定的 Title 与 Description 各自覆盖原始关键词，能让读者停在“Profit Margin 是什么、四档怎么选”的真实问题上，且与绑定 C-zh 的定义、四档、价格边界、小数取整和条件化选择一致；没有绝对化或夸张承诺，也没有把页面扩成赚钱路线、作物计算器或平台 UI 教程。

- **给 F 的必须修改项：** `0`。
- **本次范围内计数：** `PASS=14`，`FAIL/REVISE=0`。
- **下游保留：** `UNVERIFIED=5`（实际 registry/handoff 接入、目标页面/浏览器、build/typecheck/test、live HTTP/部署/收录、实际媒体）；这些不降级题文 PASS，也不能从本报告推断为页面通过。

## 审的表面与页面契约

| 字段 | 当前值 | 审核说明 |
|---|---|---|
| SEO Title | `Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选` | F-zh-lock:13；关键词置于开头，后接中文定义与四档选择任务。 |
| meta Description | `Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。` | F-zh-lock:21；补足四档、边界、取整和条件化选择，不增加新事实。 |
| C-zh 工作 H1 | `星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选` | C:1、B:22；这是写作阶段工作 H1，不是当前已装配页面的证据。与锁定 Title 是同一主承诺。 |
| locale | `zh-CN` | A/B/F/接口规格一致；`country=CN` 只属于研究参数，不是排名或 IP 证明。 |
| slug | `profit-margin-stardew` | 接口规格要求未来作为第 20 项追加；当前 source registry/identity 尚未注册。 |
| canonical 假设 | `/zh/profit-margin-stardew`（无尾随 `/`） | 接口规格明确区分 canonical 与 `/zh/profit-margin-stardew/` identity 字符串；应由 `createCanonicalUrl` 计算，不能手写。 |
| H1/metadata/OG/Twitter/Article | 现有壳均消费 `post.title` / `post.description` | `BlogArticleContent` 用 `post.title` 渲染页面 H1；中文动态路由把同一 title/description 传给 metadata、OG、Twitter 和 Article headline。目标尚未注册，实际接入保持 UNVERIFIED。 |

## 1. 绑定版本与正文兑现

### 1.1 C SHA 与 F lock 值

当前 C 的实际 SHA-256 为：

```text
0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

F-zh lock、D-zh v9、E-zh v9 读到的 C 绑定值均为同一 SHA；本次没有把 D/E 的正文 PASS 当作标题 PASS，而是重新逐项检查 Title/Description。

### 1.2 题文承诺映射

| 表面承诺 | 绑定 C-zh 支撑 | 结果 |
|---|---|---|
| `Profit Margin Stardew Valley` 主题 | C:5、C:20、C:88；全文以 Profit Margin/利润率解释设置 | **兑现** |
| “利润率是什么” | C:5 直接定义为新农场的价格倍率设置；C:20、C:24 进一步区分游戏倍率与现实净利润比例 | **兑现** |
| “四档怎么选” | C:13–C:20 给出普通/100%、75%、50%、25%；C:54–C:84 按单人、多人、挑战目标给出条件化取舍 | **兑现** |
| “新农场的价格倍率设置” | C:5、C:7、C:86–C:97；正文同时保留非 100% 需从合作/`Host New Farm` 创建多人存档的边界 | **兑现且未过度简化** |
| “价格边界” | C:26–C:46 区分受影响出售物品、Pierre 种子、指定 Joja 商品与明确不受影响类别 | **兑现** |
| “小数取整规则” | C:20 的整数截断/最低 1g，C:36 的 Wheat `25g → 6g` 示例 | **兑现** |
| “按单人、多人或挑战目标说明如何选择” | C:56–C:84 的表格与分支；正文没有把某个档位写成所有玩家统一最佳答案 | **兑现** |

Title/Description 没有承诺旧存档修改、计算器、泛赚钱路线、固定收益、固定完成时间或全平台 UI 一致性；这些均是 A/B/C 明确保留的边界。

## 2. V7 标题/描述规则与七罪引擎逐项判断

| 检查项 | 结果 | 独立判断 |
|---|---|---|
| 关键词覆盖 | **PASS** | Title 与 Description 均不区分大小写完整包含 `profit margin stardew valley`，各 1 次；没有拆词、堆同义词或重复主词。 |
| 长度 | **PASS** | Python `len`：Title `46`、Description `105` 个 Unicode code points；这是机械字符数，不冒充像素宽度或 SERP 实际截断结果。 |
| 读者停留理由 | **PASS** | 标题把原始查询词、定义问题“是什么”和行动问题“四档怎么选”放在同一行；停留理由是可核对的信息缺口，不是“完整指南”空话。 |
| 七罪机制/停留要素 | **PASS** | 该候选可归为“结论前置 + 捷径”：读者立即看到设置主题和四档选择入口；“捷径”对应 C:54–C:84 的条件化选择，而非承诺轻松成功。满足标题至少命中一个真实停留要素。 |
| dominant intent representativeness | **PASS** | A/B/E 将主意图定为 Informational、definition/explainer with conditional choice；Title/Description 覆盖定义、四档、边界和选择，未让设置路径、赚钱路线或收益计算器抢占页面。 |
| 简体中文自然度 | **PASS** | `Profit Margin` 是需要保留的游戏设置名，紧接中文“星露谷物语利润率/价格倍率”释义；全角冒号后的中文问句自然，Description 的“讲的是/本文解释/并按”连接清楚。查询词置首略带 SEO 形态，但没有达到机械翻译腔或关键词堆砌，且与本题原始关键词及现有“主题 + 冒号 + 具体范围”pattern 相容。 |
| 事实与范围承诺 | **PASS** | 四档、价格倍率、价格边界、取整和单人/多人/挑战条件均能回到 C 的具体段落；未把 `most/selected` 扩写成所有商品，也未把非 100% 路径写成普通单人 `New Game` 可选。 |
| 绝对词/夸张词 | **PASS** | 独立禁词扫描命中 `[]`；Title/Description 没有“最好/最佳/最优/最赚钱/最快/保证/一定/必然/稳赚/固定进度/所有价格/唯一/实测/免费”等承诺。 |
| H1 与正文兑现关系 | **PASS（语义）** | C 工作 H1 的定义、四档和选择与锁定 Title 同一主承诺；Title 用“四档”概括，Description 给出四个具体百分比。现有页面壳将最终 `BlogPostMeta.title` 同时用作 H1，因此未来应把锁定 Title 作为该字段，而不是沿用另一个承诺。 |
| 最近 3 篇中文标题去套路 | **PASS** | 实际 registry 最近三篇（新到旧）为“星露谷最晚播种日：春天防风草最晚在第 24 天种下”、“星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150”、“星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3”。本 Title 虽沿用站点常见冒号结构，但没有复制这些对象/数字/季节边界句式，冒号后是本篇的定义/四档选择。 |
| locale/slug/canonical 假设 | **PASS（静态契约）** | `zh-CN`、`profit-margin-stardew`、`/zh/profit-margin-stardew` 与接口规格一致；canonical 无尾随 `/`，identity 的尾随 `/` 字符串不能混用。真实路由仍未装配。 |

## 3. 现有页面契约边界

### 已核对的静态契约

- `src/components/blog/blog-article-content.tsx:21–22` 用 `post.title` 渲染唯一页面 H1，并用 `post.description` 渲染页面描述。
- `app/zh/[slug]/page.tsx:54–61` 将同一 `post.title`、`post.description` 交给 `createPublicPageMetadata`，并设置 `openGraphType: "article"`。
- `src/seo/page-metadata.ts:39–53` 将输入投影到 metadata、Open Graph 和 Twitter。
- `app/zh/[slug]/page.tsx:76–80` 将同一 title/description 作为 Article structured data 的 headline/description。
- `project-interface-spec.md:204、237、244–250` 要求共享壳提供 page-level H1，metadata 使用精确本地化 title/description，结构化数据保持当前 Article 契约。

因此题文层面的正确下游边界是：**锁定 Title 进入中文 `BlogPostMeta.title` 后，页面 H1、SEO title、OG title、Twitter title 和 Article headline 应使用同一字符串；Description 进入对应 description 字段。** 这只是已读到的现有契约，不是本次已完成的装配。

### 保持 UNVERIFIED 的项目

1. `profit-margin-stardew` 当前不在 `src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts` 或 `src/blog/blog-post-registry.tsx`；本次没有接入 registry、handoff 或源码。
2. `/zh/profit-margin-stardew` 页面、实际 H1、metadata、OG、Twitter、Article JSON-LD、canonical、hreflang、sitemap、robots 和 `public/llms.txt` 尚未回读。
3. 浏览器/Ego Browser、桌面/移动视口、build、typecheck、Vitest、静态 HTML、live HTTP、部署、收录和排名均未执行。
4. cover/Figure 1/Figure 2 的真实媒体文件、尺寸、AVIF/WebP、权利、绑定和渲染均未验证。
5. `country=CN` 不被本报告写成真实 IP、固定排名、中文搜索量或 CTR 证据。

## 4. 真实验证命令、退出码与结果

### 4.1 C/F/D/E 版本绑定

```sh
shasum -a 256 \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  docs/blog-ops/profit-margin-stardew/F-zh-lock.md \
  docs/blog-ops/profit-margin-stardew/D-zh-final-check-v9.md \
  docs/blog-ops/profit-margin-stardew/E-zh-final-review-v9.md \
  '/Users/wusir/Desktop/博客-V7修订版/参考规则/标题与描述规则.md' \
  '/Users/wusir/Desktop/博客-V7修订版/参考规则/七罪引擎.md'
```

退出码：`0`。关键真实输出：

```text
0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699  .../C-zh-draft.md
dd0898035bfc90d97f9646019d07a2870cd663d788c2fcb693450c667a005a73  .../F-zh-lock.md
c04ce9b8963020d34924ec1ab1f2e7290419d9efafd33ac62069e986c563b31f  .../D-zh-final-check-v9.md
e20c690b82fb7f7e16513fac80bf85c5db000fea29bf526ffc226c7123388daa  .../E-zh-final-review-v9.md
59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710  .../标题与描述规则.md
1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3  .../七罪引擎.md
```

独立绑定解析器第一次以“D 表格内 hash 必须单独包在反引号”为假设，退出码 `1`；实际 D 行把 hash 与路径包在同一反引号中，属于探针正则错误，不是文件绑定失败。修正解析器按 `hash + path` 回读后退出码 `0`，真实输出为：

```text
actual_c_sha=0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699
f_lock_c_sha=0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699
d_v9_c_sha=0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699
e_v9_c_sha=0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699
c_matches_f=True
c_matches_d=True
c_matches_e=True
binding_pass=True
```

### 4.2 锁字段、正文绑定与接口回读

`rg` 回读 F:13、F:21、F:43、F:53–55、F:100–105 以及 C:1、C:5、C:13–20、C:26–46、C:54–88，退出码：`0`。回读确认最终两行、C SHA、主意图、工作 H1、locale/slug/canonical 假设与正文事实锚点均存在；D/E 也各回读到同一 SHA 和正文范围 PASS。

V7 规则/页面契约 `rg` 回读退出码：`0`，关键输出包括：

```text
七罪引擎.md:72  标题至少命中一个。命中越多不一定越好，正文接不住就是欺骗。
标题与描述规则.md:45  逐字核对标题里的数字是否出现在正文……描述同步检查
标题与描述规则.md:51  自然使用主关键词，不堆同义主词，不虚构免费、最快、最佳、实测、百分比或日期。
标题与描述规则.md:53  以选定标题生成网页 H1、SEO Title 与 OG 标题……必须表达同一承诺。
标题与描述规则.md:63  Title、H1、Description、FAQ、OG、CTA、媒体文字与正文的实质承诺应一致。
```

当前目标 slug 的静态缺席/接口存在性探针退出码：`0`；真实输出：

```text
slug_absent_identity=True
slug_absent_copy=True
slug_absent_registry=True
canonical_contract_present=True
append_item_20_contract_present=True
target_absence_and_contract_pass=True
```

### 4.3 现有中文 registry pattern

只读回读 `src/blog/blog-post-registry.tsx:609–640` 的最近三篇中文条目，退出码：`0`，真实标题为：

```text
星露谷最晚播种日：春天防风草最晚在第 24 天种下
星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150
星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3
```

本 Title 复用“主题/问题 + 冒号 + 具体范围”的站点结构，但没有复写这三篇的对象、数字或季节边界表达；去套路检查有真实输入。

### 4.4 Title/Description 字符、关键词、NFC 与禁词

独立 Python 检查退出码：`0`，真实输出：

```text
title_codepoints=46
description_codepoints=105
title_keyword_count=1
description_keyword_count=1
title_nfc=True
description_nfc=True
forbidden_hits=[]
keyword_contract_pass=True
length_contract_pass=True
forbidden_contract_pass=True
title_description_contract_pass=True
```

### 4.5 正文事实支撑探针

独立 Python 检查 9 项题文支撑，退出码：`0`：

```text
semantic_claims_passed=9
semantic_claims_failed=0
semantic_support_pass=True
```

九项覆盖：Title 主关键词、定义、四档、选择、Description 新农场/价格倍率、四档差别、价格边界、取整规则、条件化选择。

### 4.6 文件卫生与写入边界

写入前目标报告不存在：

```text
precondition=PASS report_absent
```

本次只创建本报告；未修改 C/A/B/D/E/F、接口规格、源码、媒体、配置、依赖或外部服务；未提交、推送、部署或 spawn worker。报告完成后还需执行严格 UTF-8/NFC/LF/无 BOM/无 NUL/无尾随空白检查，并单独回读 Git 状态；这些结果登记在本文件末尾。


### 4.7 最终报告文件卫生回读

报告写入后再次运行严格文件卫生探针，退出码：`0`，真实输出：

```text
utf8_strict=True
nfc=True
lf_only=True
no_bom=True
no_nul=True
no_trailing_whitespace=True
ends_with_lf=True
hygiene_pass=True
```

`git diff --check` 退出码：`0`；`git diff --name-only` 退出码：`0` 且输出为空（无 tracked diff）。目标报告状态回读退出码：`0`，实际为：

```text
?? docs/blog-ops/profit-margin-stardew/E-zh-title-review.md
target_status_exit=0
```

这证明本次新增文件为允许的报告路径；不把目标目录中其他既有/并行 untracked 文件归因于本次 worker。

## 5. 最终边界

本报告只结算**绑定 C SHA 的中文 Title 与 meta Description 题文审核**。结论为 **PASS**；若 C-zh 后续任一字节变化，旧 SHA、D/E 结论和本报告均不可沿用，必须重新绑定并重跑标题/描述复核。实际 registry 接入后必须再次确认 `BlogPostMeta.title` 同时作为页面 H1/metadata/OG/Twitter/Article headline，且不能把本报告写成 browser、build、live 或部署通过。
