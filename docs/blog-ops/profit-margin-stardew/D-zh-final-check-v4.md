# D-zh 最终独立检查 v4 — PASS

- **检查时间：** 2026-09-22（Asia/Shanghai）
- **检查对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **绑定 SHA-256：** `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007`
- **检查范围：** 当前 C-zh 中文正文的版本绑定、V7 `zh-CN` 长度、固定类别边界、事实与公式、来源范围、内链、H1/层级、表格、两处图位语义、平台安全、流程泄漏和静态卫生。
- **写入范围：** 只新增本报告；没有修改 C-zh 正文、其他正文、页面源码、媒体、配置、依赖、提交、推送、部署或外部数据。
- **结论：** **PASS（当前 C-zh 正文门）。** 本次重新读取当前 C 并重新计算 SHA、V7 计数和扫描结果；不沿用 `e5915bc1...` 之前任何报告的旧 SHA、计数或结论。页面 Title/Description、实际媒体、页面装配、浏览器、构建和部署仍为 **UNVERIFIED**。

## 1. 结论摘要

| 检查项 | 结果 | 当前证据 |
|---|---|---|
| C 版本绑定 | PASS | `sha256sum` 当前输出为 `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007`；V7 的 `sha256_raw`、`sha256_nfc_lf` 与之相同。 |
| V7 `zh-CN` 长度 | PASS | `mechanical_units=2028`，位于要求的 `2000–2300` 内；`meets_mechanical_floor=true`。 |
| V7 语义独立门 | PASS | 脚本保守返回 `semantic_qualification=requires_independent_review`；本报告逐段完成独立事实、边界、结构和读者任务复核，独立语义门为 PASS。 |
| C:38 固定类别标题 | PASS | 已限定为“部分商店商品、建筑、工具升级和任务奖励”，没有泛化为全部商店。 |
| C:48 Figure 1 alt | PASS | 使用“来源列举的不受影响商店商品”，以来源列举限定商店范围；没有写成所有商店或所有商店费用。 |
| C:111 创建前检查 | PASS | 使用“来源列举的商店商品、建筑、工具升级和任务金币奖励”；固定类别边界有来源限定，且没有新增事实。 |
| C:14 卖价与种子价格 | PASS | 明确写成“受影响的卖价与列出的种子价格都会降低”，没有把种子支出、净利润或所有购买项目混写。 |
| C:26 影响范围引用 | PASS | Multiplayer 链接直接位于价格矩阵前，并明确阻断“所有商店统一缩放”的扩写。 |
| Sources 范围 | PASS | C:117–124 覆盖英文 Options/Multiplayer、中文 Options、Getting Started 四个公开页面，日期为 2026-09-22。 |
| C:70 中文内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现一次，仅作前期预算背景补充。 |
| 事实、公式、表格 | PASS | 四档、价格倍数、整数截断/1g 下限、Wheat `25g→6g`、Crab Pots `1,500g` 和多人再平衡主张与当前公开来源一致。 |
| H1/层级/结构 | PASS | 1 个 H1、6 个 H2、12 个 H3，无 H4+ 或层级跳跃；`Sources` 为文末 H2。 |
| 图位语义 | PASS（正文）/UNVERIFIED（资产） | `fig-01` 与 `fig-02` 职责不同，alt/图注有平台安全边界；实际图片、格式、尺寸、权利和页面绑定未验。 |
| 流程/私有信息泄漏 | PASS | 指定泄漏扫描退出 1、无输出；没有流程词、私有路径、本地服务地址或凭据。 |
| 静态卫生 | PASS | 指定 `git diff --check` 退出 0、无输出；正文无尾随空白。 |
| 页面/SEO/运行状态 | UNVERIFIED（范围外） | 不代签最终 Title/Description、metadata、schema、真实页面、浏览器、构建、部署、收录或排名。 |

## 2. 当前 C SHA 与 V7 计数

### 2.1 SHA-256

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实输出：

```text
e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

本报告只绑定该 SHA。C 的任何字节变化都必须重新计算 SHA、重新执行 V7 和正文扫描；历史 D/E 报告不作为本次证据。

### 2.2 正式 V7 `zh-CN` 计数

执行：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

真实输出：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客/docs/blog-ops/profit-margin-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2028,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 19,
    "code": 0,
    "excluded_sections": 9,
    "non_body": 58,
    "frontmatter": 0
  },
  "sha256_raw": "e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007",
  "sha256_nfc_lf": "e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007"
}
```

`2028` 在 `2000–2300` 内。`Sources` 被正式排除；两组图位是 blockquote，未被错误加回正文机械值。脚本的 `requires_independent_review` 不是失败，本报告第 3–7 节提供独立语义门证据。

## 3. 三处固定类别边界与最近修复复核

### 3.1 C:38

```text
38  ### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
```

**PASS。** “部分商店商品”把标题限定为来源列举的商店范围；“建筑、工具升级和任务奖励”与正文清单和 Multiplayer 公开页面一致。标题没有把来源的部分类别扩写成全部商店。

### 3.2 C:48

```text
48  > **图片替代文本（alt）：** 星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
```

**PASS。** “来源列举的”直接限定“不受影响商店商品”；alt 是 Figure 1 的简短语义摘要，没有声称所有商店费用固定。具体的铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励仍由 C:30/C:40 精确列出。

### 3.3 C:111

```text
111  - 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？
```

**PASS。** “来源列举的”限定了商店商品范围；“建筑、工具升级和任务金币奖励”是此前 C:30/C:40 已有的固定类别，不新增类别、数字、机制或平台事实。C:111 是创建前复核问题，不把来源列举变成“全部商店固定”的新结论。

### 3.4 其他最近修复

| 位置 | 结果 | 当前证据 |
|---|---|---|
| C:14 | PASS | `受影响的卖价与列出的种子价格都会降低`；没有写所有购买项目都降低，也没有把价格变化当作净利润变化。 |
| C:26 | PASS | Multiplayer 的 `#Profit_margins` 链接紧邻分类矩阵；同句明确“‘大多数’和‘指定商品’不能扩写成所有商店统一缩放”。 |
| C:44 | PASS | 对不在清单中的价格保留“待核验”分支，不用另一个商品替代下结论。 |
| C:70 | PASS | 中文内链只出现一次；上下文明确本页只说明 Profit Margin 的价格前提，不复制第一年赚钱路线。 |
| C:117–124 | PASS | Checked 行、补充说明和四个链接共同覆盖中英文 Options、Multiplayer、Getting Started。 |

## 4. 公开来源、事实和公式

### 4.1 当前公开 URL 回读

本次使用只读 HTTP 请求回读四个机制来源和一次 C:70 内链。执行 `curl -fsS -L --max-time 20 -o /dev/null -w '%{http_code} %{url_effective} redirects=%{num_redirects}'`，真实结果如下：

```text
zh-options http_code=200 final=https://zh.stardewvalleywiki.com/%E9%80%89%E9%A1%B9 redirects=0
options http_code=200 final=https://stardewvalleywiki.com/Options redirects=0
multiplayer http_code=200 final=https://stardewvalleywiki.com/Multiplayer#Profit_margins redirects=0
getting-started http_code=200 final=https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner http_code=200 final=https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

五个请求均退出 0、HTTP 200、无重定向。HTTP 200 只证明 URL 当前可达；事实结论还基于页面正文关键词的独立回读，不把 URL 可达性冒充浏览器或页面装配证据。

当前页面正文独立回读到的关键事实：

- 中文 Options：利润率为普通/75%/50%/25%，是物品售出价格的倍数；降低可提高难度；小数截断且价格不低于 1；新建游戏从角色创建界面左下角扳手进入高级游戏设置。
- English Options：Profit Margin 同时作用于售出物品价格和种子价格；小数价格截断为整数且不低于 1g。
- Multiplayer：降低利润率用于抵消多人活跃玩家增加的生产力；Wheat 在 25% 时为 6g 而非 25g；Pierre 种子及 Joja 的 Grass Starter、Sugar、Wheat Flour、Rice 随档位缩放；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不受影响；Crab Pots 仍为 1,500g。
- Getting Started：角色创建菜单的扳手包含 Advanced Options，其中包含 Changing the profit margin。

### 4.2 C 主张逐项核对

| C 行号 | 主张 | 结果 | 独立核对 |
|---:|---|---|---|
| 5、9–18 | 普通/100%、75%、50%、25% 四档；Profit Margin 是选定价格的倍率，不是现实会计净利润比例 | PASS | 中文/英文 Options 和 Multiplayer 支持四档；English Options 支持售出物品和种子价格倍数；C 明确阻断现实会计误读。 |
| 18、34 | 小数截断为整数，最低不低于 1g | PASS | 中文/英文 Options 支持；C 没有写成四舍五入。 |
| 34、50 | Wheat 普通 25g，25% 时显示 6g | PASS | Multiplayer 直接给出 25g→6g；`25×0.25=6.25` 后按来源取整为 6。 |
| 26、30、34–36 | 多数出售物品、Pierre 种子、指定 Joja 商品受影响 | PASS | Multiplayer 当前正文支持这些类别；C 使用“多数”和“指定”，没有外推为所有出售物品或所有购买价。 |
| 30、38、40、44 | 铁匠、鱼店、旅行货车商品、建筑、工具升级、任务金币奖励不受影响；未列类别待核验 | PASS | Multiplayer 逐项列出固定类别；C:44 保留未归类价格的待核验动作；C:38/C:48/C:111 没有扩大商店范围。 |
| 40、50 | Willy 的 Crab Pots 仍为 1,500g | PASS | Multiplayer 当前正文给出相同固定价格对照。 |
| 54、59、68 | 多人降低档位可作生产力再平衡；具体值取决于人数、分工和节奏 | PASS | 来源支持再平衡理由；C 没有伪造“几个人必须选多少”、固定收益或固定完成时间。 |
| 84–105 | 新游戏→角色创建扳手/高级设置→Profit Margin；平台/版本差异不冒充实测 | PASS（文档化路径） | 中文 Options 与 Getting Started 支持高层路径；C:95/C:101/C:105 明确未逐平台实测并保留停止分支。 |

### 4.3 公式与表格

- C:11–16 的四档表按普通/100%、75%、50%、25% 顺序排列，倍率文字分别是标准、四分之三、一半和四分之一。
- C:28–30 是两列影响范围矩阵；右列为来源列举的固定类别，未写成全部商店或全部购买项目。
- C:34 的 Wheat 示例与 C:40 的 Crab Pots 示例分别承担“受影响价格取整”和“固定价格边界”职责，没有互相冲突。
- C:56–60 是按单人、多人、挑战目标给出的条件化编辑判断，不冒充公开来源规定或实测难度分数。
- C:90–93 是高层设置路径；C:95、C:101、C:105 明确平台/版本和入口不确定时不猜测。

## 5. ReaderTask、H1/层级与结构

### 5.1 ReaderTask

当前正文完成单一任务：让读者理解 Profit Margin 改变哪些价格、哪些来源列举的类别不随之变化，按单人/多人/挑战目标选择四档，并在创建新农场时找到设置入口。正文没有加入作物收益计算器、第一年赚钱路线、季节作物排名、Mod、旧存档 XML/跨平台修复、固定进度或金币预测；C:70 一次内链只补预算背景，没有创建第二个 ReaderTask。

信息顺序为：

1. C:3–7 定义设置及非全局边界；
2. C:9–22 解释四档、倍率、截断、1g 和 75% 直问；
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支处理影响范围；
4. C:52–82 按单人、多人、挑战目标选择，不给所有人一个普遍最佳值；
5. C:84–105 给新农场公开高层路径、平台/版本边界和找不到选项时的停止分支；
6. C:107–113 以三项创建前检查收束。

### 5.2 H1/H2/H3

独立结构计数：

```text
h1_count=1 h2_count=6 h3_count=12 h4_plus=0
heading_level_jumps=[]
```

- C:1 是唯一 H1，且为工作 H1；正文没有第二个 H1。
- H2 位于 C:3、9、24、52、84、115；`Sources` 是最后一个 H2。
- H3 均直接位于对应 H2 下，没有跳到 H4 或更深层级。
- C:5 紧跟首个 H2，直接回答设置定义和非全局边界；没有用 CTA、空泛承诺或研究过程开头。

### 5.3 内链与图位职责

- `/zh/how-to-earn-money-stardew` 只出现 1 次，位置为 C:70；没有把本页扩写成赚钱路线。
- `fig-01-price-boundary` 只出现于 C:46–50，位于价格矩阵和 Wheat/Crab Pots 示例之后，负责“会缩放的价格 vs 来源列举的固定类别”。
- `fig-02-advanced-options-path` 只出现于 C:97–101，位于新农场步骤之后，负责“新建游戏→高级设置→Profit Margin→四档→创建”的平台中立路径。
- 两图职责不重叠，alt/caption 都没有冒充平台实机截图。

## 6. 流程泄漏、私有信息和静态卫生

### 6.1 指定命令真实结果

```text
$ rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\.0\.0\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

$ git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出
```

另行读取检查 `rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md`，退出 1、无输出；正文无尾随空白。

`rg` 的结构命中仅包括预期的 H1/H2、Multiplayer、Checked、内链、边界措辞和两个图位；泄漏扫描没有命中调度/代理、SERP/PAA、项目路径、私有绝对路径、本地服务地址、token/password/secret 或其他凭据。

### 6.2 读者正文边界

- C:1–113 是读者正文；C:115–124 是公开 Sources，V7 已排除 Sources。
- 平台/版本未逐一实测、未归类价格待核验和找不到入口时停止，都是读者安全限制，不是研究日志或流程泄漏。
- `fig-01-price-boundary` 和 `fig-02-advanced-options-path` 是正文图位标识，不是内部任务、研究 ID 或代理记录；它们不能替代实际媒体绑定证据。

## 7. 图位、平台安全和明确未验证项

### 7.1 Figure 1

C:46–50 的图位处于价格矩阵、Wheat 和 Crab Pots 说明之后。正文语义通过：alt/caption 区分受影响价格与来源列举的不受影响商店商品、建筑、升级和任务金币奖励，并说明 Wheat `25g→6g`、Crab Pots `1,500g`；没有扩写为所有商店固定。

### 7.2 Figure 2

C:97–101 的图位处于公开高层设置步骤之后。正文语义通过：alt/caption 明确它是平台中立流程示意，不是某个平台实机截图，也不承诺所有平台按钮位置完全相同。

### 7.3 下游状态

以下项目没有被本任务执行或通过，保持 **UNVERIFIED**：

- 最终 SEO Title/Description、slug、author、metadata、canonical、hreflang、Article/FAQPage schema；
- 实际 WebP/AVIF 文件、文件尺寸/字节预算、1672×941、权利/制作记录、`PublicPicture` 绑定、懒加载和图中文字可读性；
- 页面组件、route、Next build、TypeScript、Vitest、真实页面 DOM、桌面/移动 ego-browser 和可访问性；
- 部署、生产 HTTP、收录、排名或任何外部写入。

## 8. 范围结算

本报告只结算当前绑定 SHA `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007` 的 C-zh 中文正文：**PASS**。C-zh 正文未修改；若后续 C-zh 任一字节变化，必须重新计算 SHA、重新执行 V7 计数、来源/事实复核和正文扫描，并生成绑定新 SHA 的报告。
