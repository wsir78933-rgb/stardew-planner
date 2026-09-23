# E-zh 最终独立审核 v5 — REVISE（C18 已修复；C14–16 仍需自然化）

审查日期：2026-09-22（Asia/Shanghai）。

审查对象：`docs/blog-ops/profit-margin-stardew/C-zh-draft.md`。

本报告是独立 E 审核：重新读取当前 C-zh、A-zh 研究、B-zh 布局、D-zh 检查、旧 E 报告、Project interface spec、V7 正文计数脚本和 V7 22 条鉴文规则，并重新只读回读当前公开来源。当前任务只允许写入本报告；没有修改 C-zh 正文、研究/布局/检查文件、页面源码、媒体、配置、依赖、数据库、提交、推送、部署或外部服务。

## 1. 结论

**REVISE（仅剩 C:14–16 的中文可读性；C:18 的自然度/逻辑修复已 PASS）。** 当前 C-zh 的 SHA 绑定、V7 长度门、Sources/图位排除、C38/C48/C111 固定类别边界、C14 的事实措辞、C26、Sources、C70、事实/公式/表格数字、来源邻近性、唯一 ReaderTask、搜索意图、图位语义、平台/版本边界和静态卫生均通过。C:18 已改为“**四档数值都表示价格倍率，但不代表每个商品都属于受影响范围**”，与前面的四档表一致且逻辑清楚。

唯一需要返 C 的正文项是 C:14–16：`受影响价格按四分之三读取`、`按一半读取`、`按四分之一读取`。在同一表中 C:13 使用“按标准倍率计算”，而“读取”不是价格计算动作的自然中文，三处重复也形成轻微翻译腔；这不是事实、公式或档位逻辑错误，但会阻塞 22 条鉴文规则第 19 条的自然度门。最小建议是只将 C:14–16 的“读取”分别改为“计算”，不新增事实、不改四档数值；本报告不直接修改正文。

页面 Title/Description、PublicBlogHandoff、真实媒体、页面装配、浏览器、构建、测试、部署、生产 HTTP、收录和排名仍为 **UNVERIFIED**，不能由本正文审核代签。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| 当前 C 版本绑定 | PASS | `sha256sum` 当前输出为 `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7`；V7 的 `sha256_raw` 与 `sha256_nfc_lf` 相同。 |
| V7 zh-CN 正式长度 | PASS | 排除 `Sources` 后 `mechanical_units=2034`，位于 B-zh 要求的 `2000–2300` 内，`meets_mechanical_floor=true`。 |
| Sources/图位排除 | PASS | 不排除 `Sources` 的对照值为 `2103`，差值为 69；C:115–124 是 `Sources`，C:46–50 与 C:97–101 是 `>` 图位 blockquote，均不进入正式正文计数。 |
| C:18 自然度/逻辑/四档一致性 | PASS | C:18 已明确“四档数值”是价格倍率，且“不代表每个商品都属于受影响范围”；与 C:9–16 的普通/100%、75%、50%、25% 表一致。 |
| C:13–16 可读性 | **REVISE** | C:13 用“计算”，C:14–16 重复用“读取”；具体行号和复现方式见第 5 节。 |
| C38/C48/C111 固定类别边界 | PASS | C:38 使用“部分商店商品”，C:48/C:111 使用“来源列举的”限定商店范围；没有把来源清单扩写成所有商店或所有费用。 |
| C14/C26/Sources/C70 | PASS（事实/引用） | C:14 的卖价/种子价格关系正确；C:26 的 Multiplayer 链接紧邻范围矩阵；C:117–124 列出四个公开来源；C:70 站内内链只出现一次。 |
| 事实、公式、表格 | PASS | 四档、价格倍数、整数截断/1g 下限、Wheat `25g→6g`、Crab Pots `1,500g`、多人再平衡和新农场高层路径均与当前公开来源一致。 |
| 唯一 ReaderTask/搜索意图 | PASS | 全文围绕理解、选择并在新农场设置 Profit Margin；没有扩成赚钱路线、计算器、Mod 或旧存档教程。 |
| 22 条 anti-slop | **REVISE（仅第 19 条）** | 第 19 条被 C:14–16 的“读取”阻塞；其余项目通过或按体裁 N/A。 |
| H1/结构/表格 | PASS | 1 个 H1、6 个 H2、12 个 H3、无 H4+；3 张表格，`Sources` 位于文末。 |
| 两个图位 | PASS（语义）/UNVERIFIED（资产） | 图位位置、职责、alt/caption 和平台安全边界通过；实际图片、绑定、尺寸、格式、权利和渲染未验。 |
| 页面 SEO/构建/浏览器/部署 | UNVERIFIED | 本任务未执行页面装配、Next build、typecheck、Vitest、ego-browser、部署或生产回读。 |

## 2. 当前版本绑定与输入

### 2.1 当前 C SHA 和 V7 正式计数

实际执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

当前 SHA：

```text
3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

V7 输出关键字段：

```json
{
  "mechanical_units": 2034,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["Sources"],
  "omitted_line_counts": {
    "headings": 19,
    "code": 0,
    "excluded_sections": 9,
    "non_body": 58,
    "frontmatter": 0
  },
  "sha256_raw": "3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7",
  "sha256_nfc_lf": "3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7"
}
```

不带 `--exclude-heading Sources` 的只读对照命令输出 `mechanical_units=2103`，正式值与对照值差 69。脚本的 `requires_independent_review` 是保守语义字段，不是失败；本报告完成其独立语义审核。

### 2.2 输入文件 SHA

| 输入 | SHA-256 |
|---|---|
| 当前 `C-zh-draft.md` | `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7` |
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| `D-zh-final-check-v4.md` | `c3a19145f1a384a3661856b1705e97b3566d3705de654547c5e731db9d1f203b` |
| `E-zh-final-review-v4.md` | `324259e726434ea52aea0617ca5bd00c0c23b2edbf5a2333fde2e53e6a27db08` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |
| V7 `22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| V7 `正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |


D/E v4 的内容绑定旧 C SHA `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007`，不是当前 `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7` 的证据。本报告重新计算当前 SHA、V7 计数并重新审阅，不以旧 D/E 结论代替本次复核。

## 3. Sources 与图位排除

V7 计数器把 `Sources` 作为排除节处理：

- C:115–124 为 `## Sources` 及其内容，排除后正式值为 2034。
- C:46–50 的 `fig-01-price-boundary` 与 C:97–101 的 `fig-02-advanced-options-path` 均为 `>` 开始的 blockquote，属于脚本的 `non_body`，不进入正式正文提取。
- C:90–93 的新农场步骤和 C:109–111 的创建前清单是正常正文列表，会计入正式值。
- `Sources` 不是靠“把 URL 从计数中手工删掉”，而是由 `--exclude-heading Sources` 的节排除规则处理；图位 alt/caption 也没有被加回正文门。

当前正文图位职责和顺序：

| 图位 | 当前行 | 语义验收 |
|---|---:|---|
| `fig-01-price-boundary` | C:46–50 | 价格矩阵/示例之后、选择建议之前；分开会缩放价格与来源列举的固定类别，含 Wheat `25g→6g` 和 Crab Pots `1,500g`。 |
| `fig-02-advanced-options-path` | C:97–101 | 高层设置路径之后、创建前三项检查之前；展示新建游戏→扳手/高级设置→Profit Margin→四档→创建，并明确不是逐平台实机截图。 |

真实 `.webp`/`.avif`、尺寸、字节预算、`PublicPicture` 绑定、版权/使用权、图内文字、移动端可读性和页面渲染均未核验，保持 **UNVERIFIED**。

## 4. 固定类别边界与指定复核点

| 项目 | 结果 | 当前正文证据 |
|---|---|---|
| C:38 标题 | PASS | `不会变化的范围：部分商店商品、建筑、工具升级和任务奖励`；“部分”阻断了把全部商店写成固定类别。 |
| C:48 Figure 1 alt | PASS | `来源列举的不受影响商店商品、建筑、升级和任务金币奖励`；“来源列举的”限定商店范围，且 alt 由 C:30/C:40 的具体类别支撑。 |
| C:111 创建前清单 | PASS | `来源列举的商店商品、建筑、工具升级和任务金币奖励`；与 C:30/C:40 一致，没有静默新增类别。 |
| C:14 卖价/种子事实 | PASS | `受影响的卖价与列出的种子价格都会降低`，没有把种子价格写成支出变高，也没有把卖价变化写成净利润承诺。表格同一行的“读取”只影响中文自然度，不改变事实。 |
| C:26 引用邻近性 | PASS | `Multiplayer#Profit_margins` 直接位于影响范围矩阵前；同句写明“大多数”和“指定商品”不能扩写成所有商店统一缩放。 |
| C:70 站内内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现 1 次；段落明确该页解决预算行动，本页只说明 Profit Margin 的价格前提。 |
| C:117–124 Sources | PASS | 有 Checked 日期、中文 Options、英文 Options、英文 Multiplayer 和 Getting Started 四个公开来源；没有私有研究路径、内部 ID 或流程日志。 |

C:5 的“不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化”是在否定全局同倍率，不是断言所有商店固定；C:26、C:30、C:40、C:44、C:48、C:111 的组合边界保持一致。

## 5. C:18 修复与 C:13–16 可读性

### 5.1 C:18 已通过

当前 C:18：

```text
英文 Options 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
```

独立判断：

1. `四档数值` 与 C:9–16 的四个档位（普通/100%、75%、50%、25%）一致；没有再写成“名称相同”。
2. `都表示价格倍率` 直接承接前句的倍数定义；`但不代表每个商品都属于受影响范围` 清楚区分“倍率规则”与“商品是否纳入影响范围”。
3. C:18 没有增加来源之外的新机制、数字或平台承诺；English Options 链接仍紧邻倍数、截断和 1g 下限。

因此，C:18 的自然度、逻辑连接和四档表一致性均为 **PASS**，旧 E 中针对“名称相同”的阻塞已不再适用于当前 SHA。

### 5.2 C:13–16 残留可读性问题

当前行：

```text
C:13 | 普通/Normal（100%） | 受影响价格按标准倍率计算 |
C:14 | 75%                | 受影响价格按四分之三读取 |
C:15 | 50%                | 受影响价格按一半读取 |
C:16 | 25%                | 受影响价格按四分之一读取 |
```

`按四分之三读取`、`按一半读取`、`按四分之一读取` 可以被读者猜到含义，但“读取”通常用于读取文字、数据或状态，不是价格按倍率运算的自然动词。它还与 C:13 的“计算”不一致，三处平行重复使表格出现轻微翻译腔。

精确复现：

```sh
nl -ba docs/blog-ops/profit-margin-stardew/C-zh-draft.md | sed -n '9,16p'
rg -n '按.*读取|按.*计算' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

当前相关输出为：

```text
13 | 普通/Normal（100%） | 受影响价格按标准倍率计算 |
14 | 75% | 受影响价格按四分之三读取 |
15 | 50% | 受影响价格按一半读取 |
16 | 25% | 受影响价格按四分之一读取 |
```

最小修订建议（本报告不执行）：

```text
C:14：受影响价格按四分之三计算
C:15：受影响价格按一半计算
C:16：受影响价格按四分之一计算
```

这是中文表达修订，不是事实补查；若 C 采纳，必须以新 SHA 重新执行 D/E。C:13 本身无需改。

## 6. 公开来源、事实、公式与引用邻近性

### 6.1 当前公开来源只读回读

在本次审核中只读请求以下公开 URL，并检查响应正文关键词；五个请求均为 HTTP 200、无重定向：

| 页面 | 当前 HTTP/最终地址 | 页面公开修改日期 | 当前回读关键文本 |
|---|---|---|---|
| 中文 Options | 200；`https://zh.stardewvalleywiki.com/选项` | `2026-05-12T05:13:27Z` | 利润率为普通/75%/50%/25%，是物品售出价格的倍数；小数截断且价格不低于 1；新游戏角色创建界面左下角扳手进入高级游戏设置。 |
| English Options | 200；`https://stardewvalleywiki.com/Options` | `2026-03-16T18:11:24Z` | Profit Margin 作用于售出物品价格和种子价格；小数价格截断为整数且不低于 1g。 |
| Multiplayer | 200；`https://stardewvalleywiki.com/Multiplayer#Profit_margins` | `2026-08-15T18:58:01Z` | 多人生产力再平衡；Wheat 在 25% 时为 6g 而非 25g；Pierre 种子及 Joja 的 Grass Starter、Sugar、Wheat Flour、Rice 缩放；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币不受影响；Crab Pots 仍为 1,500g。 |
| Getting Started | 200；`https://stardewvalleywiki.com/Getting_Started` | `2026-08-16T05:44:15Z` | 角色创建菜单的扳手包含 Advanced Options，其中包含 changing the profit margin。 |
| 站内第一年赚钱页 | 200；`https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew` | 未作为机制来源 | 仅用于确认 C:70 的公开内链当前可达；不代签页面装配或文章内容。 |

HTTP 200 只证明公开 URL 当前可达；来源正文关键词才支持上述机制事实。该只读回读不是浏览器验收、页面装配、构建或部署证据。

### 6.2 C 主张逐项核对

| 主张 | C 位置 | 结果 | 独立核对 |
|---|---:|---|---|
| 普通/100%、75%、50%、25% 四档 | 5、9–18 | PASS | 中文 Options、英文 Options 和 Multiplayer 均列出四档。 |
| Profit Margin 是售出物品/种子价格倍数，不是现实会计净利润比例 | 5、18、22 | PASS | English Options 支持售出物品和种子价格倍数；C:5/C:22/C:113 阻断现实会计误读；C:18 修复后没有歧义。 |
| 小数截断为整数，最低不低于 1g | 18、34 | PASS | English Options 支持截断和 1g 下限；正文没有写成四舍五入。 |
| Wheat 普通 25g、25% 显示 6g | 34、50 | PASS | Multiplayer 当前正文直接给出 25g→6g；C 没有把该例外推成所有商品。 |
| 受影响范围 | 26、30、34–36 | PASS | 使用“多数出售物品”“Pierre 种子”“指定 Joja 商品”，没有外推成全部出售物品或全部购买项目。 |
| 不受影响范围 | 30、38、40、44、48、111 | PASS | 精确保留铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励；未列价格保留待核验分支。 |
| Willy 的 Crab Pots 为 1,500g | 40、50 | PASS | Multiplayer 当前正文给出该固定价格对照。 |
| 多人降低档位用于生产力再平衡 | 54、59、68 | PASS | 来源支持再平衡理由；C 没有伪造“几个人必须选多少”、固定收益或完成时间。 |
| 新农场设置入口 | 84–105 | PASS（文档路径） | 中文 Options、English Options 和 Getting Started 支持高层路径；C:95/C:101/C:105 明确未逐平台实测。 |

### 6.3 公式和表格

- C:11–16 是 3 列、4 个档位行，顺序为普通/100%、75%、50%、25%；“标准倍率、四分之三、一半、四分之一”与四档数值一致。
- C:18 的“价格倍率”是对受影响价格的规则定义，不把所有商品自动归入影响范围；这与 C:26/C:30 的 `多数`、`指定商品`限定一致。
- C:28–30 是 2 列影响范围矩阵；右列为来源明确列举的不受影响类别，未写成所有商店固定。
- C:34 的 `25g×25%=6.25g` 后显示 6g 与来源的截断规则一致；正文明确“不是保留 6.25g”，没有写成四舍五入。
- C:40/C:50 的 Crab Pots `1,500g` 是固定价格对照，与 Wheat 的受影响价格示例没有数字冲突。
- C:56–60 是单人/多人/挑战的条件化编辑判断，不冒充公开来源规定或实测难度分数。

### 6.4 引用邻近性

- C:5 的中文 Options 链接承接中文术语/四档，Multiplayer 链接承接非全局边界。
- C:18 的 English Options 链接紧邻倍数、截断和 1g 下限；C:18 修复只改表达，不改变来源绑定。
- C:26 的 Multiplayer 链接紧邻影响范围矩阵和“不能扩写成所有商店统一缩放”的限制。
- C:68 的 Multiplayer 链接紧邻多人生产力再平衡主张。
- C:86 的中文 Options 与 Getting Started 链接紧邻新农场路径。
- C:117–124 的 Sources 列出公开页面和 Checked 日期；没有内部研究 ID、私有路径或抓取日志。

## 7. ReaderTask、搜索意图、H1、图位与平台边界

### 7.1 唯一 ReaderTask

B-zh 的 ReaderTask 是：理解新农场 Profit Margin 改变哪些价格、哪些来源列举的成本/奖励不跟着变，根据单人/多人/挑战目标选择四档，并在创建新农场时找到设置入口。当前 C 的信息顺序仍为：

1. C:3–7 直接定义设置及非全局边界。
2. C:9–22 解释四档、倍率、截断、1g 和 75% 直问。
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支处理影响范围。
4. C:52–82 按单人、多人、挑战目标做条件化选择。
5. C:84–105 给出新农场高层设置路径、平台/版本限制和找不到选项时的停止分支。
6. C:107–113 用创建前三项检查收束。

没有加入作物收益计算器、泛赚钱路线、季节作物排名、Mod、旧存档 XML/跨平台修复、固定进度或金币预测。C:70 的站内内链只出现一次，并明确把预算行动留给另一篇文章，不产生第二 ReaderTask。**PASS。**

### 7.2 搜索意图

A-zh 选择的信息型、带设置决策的概念解释意图是：先弄清 Profit Margin 改变什么，再按单人/多人/挑战目标选择新存档值。C 覆盖定义、影响/不影响边界、条件选择和新农场入口；没有把英文 PAA、SERP 研究记录、排名、搜索量或“最佳值”伪造成中文搜索事实。**PASS。**

### 7.3 H1、层级和结构

只读结构检查结果：

```text
H1 1
H2 6
H3 12
H4+ 0
表格 3
Sources 起始行 115
```

C:1 是唯一 H1，与 B-zh 工作 H1 一致；C:3、9、24、52、84、115 是六个 H2；没有 H4+ 或层级跳跃。Project interface spec 要求未来共享文章壳提供页面级 H1，正文模块不得添加第二 H1；当前 C 作为内容草稿仍只有一个 H1，不泄漏内部字段名。**PASS。**

### 7.4 两个图位

| 图位 | 结果 | 复核 |
|---|---|---|
| `fig-01-price-boundary` | PASS（语义）/UNVERIFIED（资产） | 位于价格矩阵/示例之后；alt/caption 分开会缩放价格与来源列举的固定类别，保留 `Wheat 25g→6g`、`Crab Pots 1,500g`，并声明不是平台截图。 |
| `fig-02-advanced-options-path` | PASS（语义）/UNVERIFIED（资产） | 位于有序路径之后；alt/caption 明确平台中立、来源为 Options/Getting Started，不承诺所有平台按钮位置相同。 |

### 7.5 平台/版本边界

C:86、C:90–93 只写公开 Wiki 支持的高层路径；C:95 明确 PC、主机和移动端按钮位置、标签或版本行为不能写成完全一致；C:101 的图注重复该限制；C:105 在找不到入口时要求回到新游戏/当前平台/版本和公开设置说明，不猜旧存档修改方式。**PASS。**

## 8. V7 22 条 anti-slop 独立逐项审核

规则依据：V7 `参考规则/22条鉴文规则.md`。`PASS` 表示当前稿未触发该问题门；`N/A` 表示该机制解释型体裁没有相应素材，不是漏检。

| # | 结果 | 当前 C 证据与判断 |
|---:|---|---|
| 1 | PASS | C:44、C:105 只保留会改变价格归类或设置入口判断的真实例外/停止分支，没有堆积无关反驳。 |
| 2 | PASS | C:3–113 的知识都推进理解、选择或设置 Profit Margin；没有把 A-zh 研究材料全部输出。 |
| 3 | PASS | C:11–16、C:28–30、C:56–60、C:90–93 的平行结构分别服务查表、边界、条件选择和操作。 |
| 4 | PASS | 未见“虽然……但是……”机械重复；各处让步用于具体取舍或平台边界。 |
| 5 | PASS | 正式术语 `Profit Margin`、倍率、受影响/不受影响、固定类别稳定，没有反复为同一功能造名。 |
| 6 | N/A | 没有亲历故事或冒充真实经历的情绪曲线。 |
| 7 | PASS | 以具体价格、平台和设置条件说明风险，没有声称所有读者都犯同一错误。 |
| 8 | PASS | C:5、C:22、C:64、C:68、C:74、C:113 的否定/对照句分别服务现实会计区分、固定边界、条件选择或平台限制，没有形成空洞模板。 |
| 9 | PASS | 未归类价格、未逐平台 UI 和版本行为均保留待核验/停止分支；已核实事实没有人为加疑虑。 |
| 10 | PASS | 精确数字均有 Options/Multiplayer 来源或透明算术；没有无来源的时间、收益、性能数字。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等个人脆弱经历。 |
| 12 | PASS | C:84–105 将步骤限定为新农场并保留平台/版本前提，不写旧档万能修复。 |
| 13 | PASS | C:44、C:82、C:105、C:113 分别完成待核验、预算、停止或创建前判断，没有段段升华。 |
| 14 | PASS | 定义段、四档表、数字例子、设置步骤和创建前清单承担不同信息功能。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 的建议带人数、节奏、约束或预算条件，没有用感受替代论证。 |
| 16 | PASS | C:5 位于首个 H2 后并直接回答设置定义、四档和非全局边界，不是只剩钩子或承诺。 |
| 17 | PASS | 未见“值得注意”“事实上”等无功能连接词成群出现。 |
| 18 | PASS | `Profit Margin`、四档、Wheat、Crab Pots、扳手/高级设置名称稳定；没有刻意同义替换。 |
| 19 | **REVISE** | C:14–16 的“按……读取”可猜懂但不符合价格计算的自然中文，且与 C:13 的“计算”不平行；C:18 已不再命中该问题。 |
| 20 | PASS | Wheat 和 Crab Pots 明确作为公开页面示例，没有包装成作者亲测、客户案例或实测效果。 |
| 21 | PASS | 结尾是创建农场前检查，不是通用祝福或转化口号。 |
| 22 | PASS | C:113 回到具体游戏经济前提，没有升到现实商业、人生或宏大结论。 |

### 六类形式指纹

- 破折号：PASS；正文没有密集破折号链，Sources 中的 `Multiplayer — Profit margins` 属于公开标题。
- 粗体：PASS；只用于路径强调和图位/alt/caption 标签，没有粗体营销口号。
- 无用装饰符号：PASS；无 emoji、装饰分隔或营销符号，表格/步骤均有信息用途。
- 助手残留：PASS；没有 SERP/PAA、角色、调度、代理、私有路径或凭据。
- 填充短语：PASS；没有“值得注意”“事实上”等无功能短语成群出现。
- 泛泛积极结尾：PASS；正文以创建前检查和具体游戏经济前提结束。

## 9. 流程泄漏、私有路径和静态卫生

当前正文的指定扫描均无命中：

```sh
rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.0\\.0\\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|Agent[ -]?[A-G]|\\b(role|worker|coordinator|dispatch|handoff|assembly|bodyHash|mechanical_units|PublicReference|editor appendix|task card|internal)\\b|A-zh|B-zh|C-zh|D-zh|project-interface|任务卡|调度|代理回执|私有路径|/Users/|/home/|file://|localhost|127\\.0\\.1|\\.codex|\\.hermes|docs/blog-ops|node_modules|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无尾随空白命中

git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出
```

另用只读 `awk '/[[:blank:]]$/{print NR ":" $0}' ...` 检查尾随空白，无输出。C-zh 当前是工作区未跟踪文件；上述 `git diff --check` 只报告 exit=0/无诊断，不能单独把未跟踪文件当作 Git diff 已跟踪对象，尾随空白结论由 `rg`/`awk` 共同支持。

## 10. 未验证项与范围结算

### 10.1 明确保持 UNVERIFIED

以下项目本次没有执行，不能由正文审核代签：

- 页面最终 Title、Description、topic、author、read time 和 `PublicBlogHandoff`。
- 实际 cover、两个图位对应的 WebP/AVIF、尺寸、字节预算、版权/使用权、页面 `PublicPicture` 绑定、加载属性和移动端渲染。
- 未来 `/zh/profit-margin-stardew` 页面装配、共享文章壳、schema、canonical、hreflang、sitemap、robots、llms.txt 和博客索引。
- 本地 Next 页面、ego-browser 桌面/移动端证据、typecheck、Vitest、完整 build 和静态输出。
- 生产站 HTTP、部署、CDN、收录、排名和真实搜索表现。

### 10.2 最终结论

**当前绑定 SHA `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7` 的 C-zh 正文：REVISE。**

阻塞项只有：

1. C:14 `受影响价格按四分之三读取`；
2. C:15 `受影响价格按一半读取`；
3. C:16 `受影响价格按四分之一读取`。

C:18 的旧问题已经通过当前修复解决；C38、C48、C111、C14 的事实关系、C26、Sources、C70、V7 计数、Sources/图位排除、事实/公式/表格、来源/日期/邻近引用、唯一 ReaderTask、搜索意图、H1、图位语义、平台边界、其余 21 条 anti-slop 和静态卫生均已通过。

修订 C:14–16 后必须：

1. 重新计算 `sha256sum`，不得沿用本报告绑定的旧 SHA；
2. 重新执行 V7 `zh-CN --exclude-heading Sources` 计数，并重新确认 Sources/图位不计入正文；
3. 重新运行 C38/C48/C111、C14/C26/C70、来源邻近、流程泄漏、22 条鉴文和静态卫生检查；
4. 由 D 先对新 SHA 检查，再由 E 对同一新 SHA 独立复核。
