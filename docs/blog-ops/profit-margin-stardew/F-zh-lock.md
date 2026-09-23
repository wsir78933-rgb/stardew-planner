# F-zh SEO lock：`profit margin stardew valley`

- **锁定日期：** 2026-09-23（Asia/Shanghai）
- **工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **角色范围：** F-zh；只锁定 Chinese `zh-CN` 的 SEO Title 与 meta Description，不改正文、不改源码、不做页面装配。
- **正文前置条件：** D-zh v9 与 E-zh v9 均对同一 C-zh SHA 给出正文范围 PASS；本文件不把正文 PASS 扩写为页面、部署或 live 状态 PASS。
- **本文件唯一写入：** `docs/blog-ops/profit-margin-stardew/F-zh-lock.md`

## 1. 最终锁定值

### 1.1 SEO Title

> **Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选**

- **字符数：** `46` 个 Unicode code points（按 Python `len` 计数，含空格与标点；不是像素宽度或 SERP 实际截断宽度）。
- **关键词覆盖：** 不区分大小写完整包含 `profit margin stardew valley` 一次。
- **兑现范围：** 直接覆盖“Profit Margin 是什么”和普通/100%、75%、50%、25% 四档如何按目标选择；没有把页面承诺扩成赚钱路线、计算器或固定进度。

### 1.2 meta Description

> **Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。**

- **字符数：** `105` 个 Unicode code points（按 Python `len` 计数，含空格与标点；不是像素宽度或 SERP 实际截断宽度）。
- **关键词覆盖：** 不区分大小写完整包含 `profit margin stardew valley` 一次。
- **兑现范围：** 只承诺正文已写的价格倍率定义、四档差别、受影响/不受影响边界、小数取整和条件化选择；没有承诺普遍最佳值、固定收益、固定完成时间或平台 UI 一致性。

### 1.3 Title/Description 与正文的绑定

| 锁定字段 | 正文支持位置 | 绑定结论 |
|---|---|---|
| `Profit Margin` 是价格倍率设置 | C-zh:5、C-zh:20、E-zh v9:87–95 | 支持；正文明确区分游戏倍率与现实会计净利润比例。 |
| 普通/100%、75%、50%、25% 四档 | C-zh:5、C-zh:13–24、E-zh v9:89–90 | 支持；数字与倍率关系在正文出现。 |
| 价格边界 | C-zh:26–46、E-zh v9:91–93 | 支持；正文区分来源列出的出售物品、种子、指定商品和明确不受影响类别。 |
| 小数取整规则 | C-zh:20、C-zh:36、E-zh v9:90 | 支持；含整数截断、最低 1g、Wheat `25g → 6g` 例子。 |
| 单人/多人/挑战目标的条件化选择 | C-zh:54–84、E-zh v9:52–57、94 | 支持；正文没有把某个档位写成所有玩家的普遍最佳答案。 |

## 2. 绑定输入与版本证据

### 2.1 正文与审核绑定

| 输入 | 当前 SHA-256 | 作用 |
|---|---|---|
| `docs/blog-ops/profit-margin-stardew/C-zh-draft.md` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` | 本 F lock 唯一正文版本绑定；必须保持不变。 |
| `docs/blog-ops/profit-margin-stardew/A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` | 中文研究、主意图、事实台账和边界来源。 |
| `docs/blog-ops/profit-margin-stardew/B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` | `zh-CN` 页面契约、工作 H1、ReaderTask 与范围。 |
| `docs/blog-ops/profit-margin-stardew/D-zh-final-check-v9.md` | `c04ce9b8963020d34924ec1ab1f2e7290419d9efafd33ac62069e986c563b31f` | 同 SHA 的静态 postcheck v9；正文门 PASS。 |
| `docs/blog-ops/profit-margin-stardew/E-zh-final-review-v9.md` | `e20c690b82fb7f7e16513fac80bf85c5db000fea29bf526ffc226c7123388daa` | 同 SHA 的独立正文审核 v9；正文内容范围 PASS。 |
| `docs/blog-ops/profit-margin-stardew/project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` | slug、locale、canonical、metadata 接口和下游写入边界。 |

### 2.2 正文计数与主意图

- V7 `zh-CN` 正文机械计数：`2295`，要求区间 `2000–2300`，`Sources` 已排除，计数脚本输出 `meets_mechanical_floor=true`。
- 主意图：**Informational；definition/explainer with conditional choice**。
- ReaderTask：理解 Profit Margin 改变哪些价格、哪些边界不随之变化，再按单人/多人/挑战目标选择四档，并在创建新农场时找到入口。
- C-zh 工作 H1 保持为：`星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选`。本 F lock 不修改 C-zh 的 H1 文本。

### 2.3 V7 规则与现有 metadata pattern 回读

- V7 标题接入规则：`/Users/wusir/Desktop/博客-V7修订版/参考规则/标题与描述规则.md`，SHA-256 `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710`。
- V7 七罪引擎：`/Users/wusir/Desktop/博客-V7修订版/参考规则/七罪引擎.md`，SHA-256 `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3`。
- 读取的现有 metadata/registry pattern：
  - `src/blog/blog-post-registry.tsx` SHA-256 `f3b350c07705164562e5c7919ffae1968b1d268a7f28a99456a26df336724ffd`：中文条目使用 `title`、`description`、`topic`、`author`、`readTimeMinutes`、`coverImage`、`featured`；标题通常先给对象/问题，再用冒号补充具体数字、边界或下一步。
  - `src/blog/blog-copy.ts` SHA-256 `e2a6af61c7c2473dc317e803384faf061b3f97f08d39741f867d2b363dc84eee`：中文 slug 路由使用 `/zh/<slug>`。
  - `src/blog/blog-post-identities.ts` SHA-256 `be6cdf465126189167dc2517e326c1d1840114b0a55aa7a88a2144a64f6f4f87`：当前 `profit-margin-stardew` 尚未注册；接口规格要求未来追加为第 20 个 slug。
  - `src/seo/page-metadata.ts` SHA-256 `ed717ed7941551768b74d761d3f2e390d38b330cae9f8523742003835e1796af`：metadata 输入字段直接供 `title`、`description`、Open Graph 与 Twitter 字段使用，但本任务没有接入。
- 最近三篇已注册中文文章的标题回读：
  1. `星露谷最晚播种日：春天防风草最晚在第 24 天种下`
  2. `星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150`
  3. `星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3`
- 去套路取舍：最终标题采用现有“问题/主题 + 具体范围”写法，但不用“最强、最佳、稳赚、最快”等绝对承诺；数字只使用 C-zh 已出现的四档，不把最近文章的作物/经验/天数句式机械复制到本页。

## 3. 十组中文 Title/Description 方向与取舍

以下 10 组是 F 阶段内部创作与筛选记录，不是把选择工作交给用户。每组仍围绕同一个主意图；差异来自正文已核验的定义、数字、边界、条件选择或设置路径。

| # | Title 方向 | 配套 Description 方向 | 机制 / 停留要素 | 取舍 |
|---:|---|---|---|---|
| 1 | `Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选` | `Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。` | 结论前置 + 捷径；定义信息差与条件选择。 | **选定。** 同时覆盖原始关键词、主体定义和选择任务，未引入正文外事实。 |
| 2 | `星露谷物语利润率怎么选？Profit Margin Stardew Valley 四档与价格边界` | `先看 Profit Margin Stardew Valley 的四档倍率，再区分会变化的出售与种子价格，以及不随之变化的固定类别，最后按单人、多人或挑战目标选择。` | 结论前置 + 金钱；从价格边界切入。 | 可保留，但英文关键词置于中文问句后，略偏 SEO 拼接；不如 #1 顺读。 |
| 3 | `星露谷物语 Profit Margin：100%、75%、50%、25% 到底差在哪？` | `星露谷物语的 Profit Margin 不是现实净利润比例。本文对照 100%、75%、50%、25% 的价格倍率、取整规则和适用场景。` | 反差数字 + 异常；四档数字形成停留点。 | 信息明确，但没有在标题中直接给出“怎么选”，条件化主任务较弱。 |
| 4 | `星露谷物语 Profit Margin：低档位只改部分价格，不是全局打折` | `降低 Profit Margin 会收紧来源列出的出售收入并改变列出的种子价格，但建筑、工具升级和任务金币奖励等明确类别不按同一比例变化。` | 自我颠覆 + 异常；纠正“全局打折”误读。 | 边界增益强；“只改部分价格”需依赖正文的来源列举限制，适合解释型标题但不突出档位选择。 |
| 5 | `75% 利润率是什么意思？星露谷物语 Profit Margin 四档说明` | `75% 表示属于规则范围的价格按 0.75 倍计算，不是保留 75% 的净利润；文中还说明 50%、25% 与普通档位的边界。` | 结论前置 + 异常；对应真实 75% PAA 需求信号。 | 覆盖单一子问题，容易让页面看起来只解释 75%，不够代表全文。 |
| 6 | `星露谷物语 25% 利润率适合谁？先看收入与固定费用边界` | `25% 是主动收紧经济的挑战取向。本文说明受影响出售收入与固定类别的边界，并提醒不要把它推成固定进度或统一答案。` | 群体点名 + 金钱；挑战读者的条件选择。 | 能接住正文，但把一个档位放得过重，可能缩窄 informational 主意图。 |
| 7 | `单人、多人、挑战档怎么选星露谷物语利润率？` | `从玩家人数、期望节奏和经济约束出发，比较普通/100%、75%、50%、25%；多人再平衡与挑战选择都按正文已核验的边界说明。` | 群体点名 + 冲突；把选择条件放在标题。 | 读者状态清楚，但关键词覆盖与主题定义弱；中文语序也不如 #1 紧凑。 |
| 8 | `星露谷物语新农场怎么设置 Profit Margin？100% 与非 100% 路径` | `新农场可从角色创建界面的扳手进入 Advanced Options；100% 与非 100% 的创建分支不同，本文给出平台中立的高层路径和检查点。` | 悬念场景 + 捷径；设置入口的信息缺口。 | **淘汰。** 这是必要子问题但不是主意图；会把页面误导成 UI how-to，且正文明确未逐平台实测。 |
| 9 | `星露谷物语利润率没按预期变化？先对照这份价格边界` | `先把价格对照受影响与不受影响的类别；未列出的价格保留待核验，不用另一个商品猜结论。本文也解释四档利润率和新农场设置入口。` | 损失进入 + 异常；从“价格没变”的排错场景进入。 | **淘汰。** 正文只有安全判断分支，没有承诺解决某个具体故障；标题疑问容易超出已验证范围。 |
| 10 | `星露谷物语利润率不是净利润比例：四档价格倍率这样读` | `Profit Margin 是游戏内选定出售物品与种子价格的倍率设置，不是现实会计公式。本文解释四档、价格边界、多人选择与创建入口。` | 自我颠覆 + 异常；拆开游戏术语与现实会计术语。 | 事实边界清楚，但缺少“怎么选”这一 ReaderTask 结果；适合作为备选，不作为最终锁定。 |

### 3.1 方向筛选结论

- **停留检查：** #1 让目标读者停留的具体原因是：它把原始查询词直接放在标题开头，同时在同一行回答“这个设置是什么”和“我该如何面对四档”，对应 C-zh 的定义、四档表和单人/多人/挑战决策表；不是只说“完整指南”。
- **适配检查：** #1 的“Profit Margin”“四档”“怎么选”均由正文直接兑现；Description 的四个百分比、价格边界和小数取整在 C-zh:13–46，条件化选择在 C-zh:54–84；没有引入新商品、新版本、新平台或新收益。
- **淘汰原因不是正文失败：** #8、#9 只是主意图覆盖不足或会制造页面类型误解，并非对正文事实的否定；它们不进入锁定值。
- **禁止承诺扫描：** 最终 Title/Description 未使用 `最佳`、`最优`、`最赚钱`、`最快`、`保证`、`一定`、`必然`、`稳赚`、`固定进度`、`所有价格` 等绝对化或夸大承诺。

## 4. locale、slug、canonical 与页面接入假设

这些是下游装配的**假设/契约**，不是本 F lock 已完成的页面事实：

- **locale：** `zh-CN`；正文与 Title/Description 均为自然简体中文，保留游戏设置名称 `Profit Margin`。A/B 记录的 `country=CN` 只表示研究目标地区参数；精确 CN IP 路由、排名、搜索量和 CTR 未验证。
- **slug：** `profit-margin-stardew`；当前 source registry/identity 尚未注册该 slug，接口规格要求未来作为第 20 项追加，不重排既有 slug。
- **canonical path：** 假设为 `/zh/profit-margin-stardew`（无尾随 `/`）；现有 identity 约定的比较值是 `/zh/profit-margin-stardew/`，二者不是同一字段。若后续注册，应由现有 `createCanonicalUrl` 和 `createPublicPageMetadata` 计算 canonical，而不是在 F 阶段手写 URL。
- **canonical origin：** source 配置记录 `https://stardewvalleyplanner.art`，但本报告没有 live HTTP 或部署回读，不能声称该 URL 当前已上线或可访问。
- **H1/OG：** V7 规则要求选定 Title 作为 H1/SEO Title/OG 标题的词义基础；当前 C-zh 工作 H1 未修改，后续 handoff/装配必须明确是否逐字采用本 Title。当前没有 Title 已进入 registry、页面 H1 或 OG 的证据。
- **meta Description 消费者：** 未来 registry 的 `description`、页面 metadata、Open Graph 与 Twitter 是否采用本 Description，均需下游接入与静态/浏览器检查确认；本报告不代签。

## 5. 下游未验证项与明确边界

以下项目**未完成、未代签，也不能从本 F lock 推断为完成**：

1. `src/blog/blog-post-registry.tsx`、`src/blog/blog-copy.ts`、`src/blog/blog-post-identities.ts` 或其他源码尚未写入 Title、Description、slug 或 locale 条目。
2. `/zh/profit-margin-stardew` 页面尚未装配；H1、meta、Open Graph、Twitter、Article JSON-LD、canonical、hreflang、sitemap、robots 和 `public/llms.txt` 均未验证。
3. 封面、Figure 1/2 的实际 WebP/AVIF、尺寸、体积、权利、路径、`PublicPicture` 绑定、移动端可读性和页面加载均为 UNVERIFIED。
4. `pnpm typecheck`、Vitest、build、静态 HTML 回读、Ego Browser/浏览器桌面与移动验收均未运行；不能把本报告写成浏览器或构建通过。
5. live HTTP、生产/CDN、部署、收录、排名、搜索展示、点击率、转化和用户终审均未验证。
6. E-zh v9 只完成正文范围独立审核；标题阶段的 E 续审、公开 PublicBlogHandoff、bodyHash 交接和页面 assembly 仍是下游工作。
7. 本次没有新增内链；C-zh 原有唯一 `/zh/how-to-earn-money-stardew` 内链保持正文既有状态，不因 F lock 改写。

## 6. F-zh 写入与验证边界

- 允许写入的唯一文件是本报告；未修改 C/A/B/D/E、接口规格、源码、媒体、配置、依赖、测试、外部服务或数据库。
- 未提交、未推送、未部署、未启动开发服务器、未运行生产 SEO smoke、未 spawn worker。
- C-zh 的后续任何字节变化都使本锁失效；必须重新计算 C SHA、重跑 D/E 内容门并重新执行 F 标题/描述锁定。

## 7. 验证命令登记

下列命令已在本次 F lock 写入前后运行；实际退出码与关键输出记录如下：

| 检查 | 命令/范围 | 预期与记录 |
|---|---|---|
| C 版本绑定 | `shasum -a 256 docs/blog-ops/profit-margin-stardew/C-zh-draft.md` | exit `0`；输出必须为 `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`。 |
| V7 正文计数 | `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources` | exit `0`；`mechanical_units=2295`、`meets_mechanical_floor=true`、raw/NFC-LF SHA 均绑定 C。 |
| 输入与 pattern 回读 | `rg` 回读 A/B/C/D/E、接口规格、`src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts`、`src/blog/blog-post-registry.tsx`、`src/seo/page-metadata.ts` | exit `0`；读到主意图、工作 H1、C SHA、`zh-CN`、`/zh/profit-margin-stardew` 契约、当前 registry `title`/`description` 写法与现有中文标题。 |
| Title/Description 检查 | 只读 Python 检查最终两行的 Unicode code points、大小写不敏感关键词、禁用绝对承诺词与 NFC | exit `0`；Title `46`、Description `105`；两者均各含完整关键词一次；禁用词命中 `[]`；`contract_pass=True`；Title/Description 均 NFC。 |
| 报告文件卫生 | 只读 Python 检查 F 文件 UTF-8 strict、NFC、LF、无 BOM/CR/NUL、无尾随空白 | exit `0`；`utf8_strict=True`、`nfc=True`、`lf_only=True`、`no_bom=True`、`no_nul=True`、`no_trailing_whitespace=True`、`hygiene_pass=True`。 |
| 工作树边界 | `git status --short --untracked-files=all` 与 `git diff --name-only` | exit `0`（`git diff --check`）；tracked changed paths 为空；当前 status 显示本 worker 新增 `F-zh-lock.md`，研究包其余 untracked 文件为既有/并行状态；另有当前 status 中出现的 `F-en-lock.md`，本任务未读取或修改。 |
| F 报告存在性 | `shasum -a 256 docs/blog-ops/profit-margin-stardew/F-zh-lock.md` | exit `0`；报告已存在并可回读（本次写入后的文件 hash 在交接命令输出中记录，避免把自引用 hash 写入报告正文）。 |
