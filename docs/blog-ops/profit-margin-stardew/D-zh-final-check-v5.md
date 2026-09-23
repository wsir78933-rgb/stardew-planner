# D-zh 最终独立检查 v5 — PASS

- **检查日期：** 2026-09-22（Asia/Shanghai）
- **检查对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **绑定 SHA-256：** `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7`
- **检查范围：** 当前 C-zh 中文正文的版本绑定、V7 `zh-CN` 正文长度、C:18 修复、固定类别边界、C14/C26/C70、Sources、公开 URL、事实/公式/表格、H1/层级、两处图位、平台边界、流程泄漏和静态卫生。
- **写入范围：** 只写入本报告；没有修改 C-zh 正文、A/B/其他 D/E 文件、源码、页面、媒体、配置、依赖、数据库、外部服务，也没有 commit、push、deploy 或浏览器写入。
- **结论：** **PASS（当前 C-zh 正文门）。** 本次重新读取当前 C，重新计算 SHA 与 V7 计数，并独立完成语义复核；不沿用旧报告的 SHA、计数或结论。Title/Description、实际媒体、页面装配、浏览器、构建、部署和生产状态仍为 **UNVERIFIED**。

## 1. 结论摘要

| 检查项 | 结果 | 当前证据 |
|---|---|---|
| C 版本绑定 | PASS | `sha256sum` 当前输出为 `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7`；V7 的 `sha256_raw`、`sha256_nfc_lf` 与之相同。 |
| V7 `zh-CN` 正文长度 | PASS | `mechanical_units=2034`，位于要求的 `2000–2300` 内；`meets_mechanical_floor=true`。 |
| V7 语义独立门 | PASS | 脚本保守返回 `semantic_qualification=requires_independent_review`；本报告完成正文独立阅读、边界/来源/结构复核，独立语义门为 PASS。 |
| C:18 新句 | PASS | 当前文本包含“四档数值都表示价格倍率，但不代表每个商品都属于受影响范围”。 |
| C:18 旧句清除 | PASS | `rg -n '四档名称相同' ...` 退出 1、无输出；没有残留旧表述。 |
| C:38/C:48/C:111 固定类别边界 | PASS | C:38 使用“部分商店商品”；C:48 使用“来源列举的不受影响商店商品”；C:111 使用“来源列举的商店商品、建筑、工具升级和任务金币奖励”，没有外推为全部商店。 |
| C14/C26/C70 | PASS | C:14 明确受影响卖价与列出的种子价格；C:26 紧邻 Multiplayer 边界来源并阻断全局缩放误读；C:70 仅保留一次相关中文内链。 |
| Sources | PASS | C:115–124 为文末公开来源段，含 Checked 日期及中文 Options、英文 Options、Multiplayer、Getting Started 四个公开来源。 |
| 事实、公式、表格 | PASS | 四档、倍率、整数截断/1g 下限、Wheat `25g→6g`、Crab Pots `1,500g`、多人再平衡及新农场高层路径与当前公开来源一致。 |
| H1/层级/结构 | PASS | 1 个 H1、6 个 H2、12 个 H3、0 个 H4+；无层级跳跃，三张正文表结构完整。 |
| 公开 URL | PASS（可达性） | 五个正文实际使用 URL 均 HTTP 200、`curl` 退出 0、重定向数 0；可达性不代替页面装配或浏览器验收。 |
| 两个图位 | PASS（正文语义）/UNVERIFIED（媒体） | `fig-01` 与 `fig-02` 位置和职责不重叠，alt/图注保留平台边界；实际文件、绑定、尺寸、权利和渲染未验。 |
| 平台边界 | PASS | 新农场高层路径明确为公开 Wiki 整理，未冒充逐平台实测；界面差异时要求按当前平台/版本核对，不猜旧存档步骤。 |
| 流程/私有信息泄漏 | PASS | 指定泄漏扫描退出 1、无输出；无调度词、SERP/PAA、私有路径、本地服务地址或凭据。 |
| 静态卫生 | PASS | `git diff --check -- C` 退出 0；另行尾随空白扫描退出 1、无输出。 |
| Title/Description、媒体、页面、浏览器、构建、部署 | UNVERIFIED（范围外） | 本 D 不代签这些下游门。 |

## 2. 当前 C SHA 与 V7 计数

### 2.1 SHA-256

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实输出：

```text
3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

本报告只绑定该 SHA。C 的任一字节变化都必须重新计算 SHA、重新执行 V7 计数和本次正文复核；任何旧 D/E 报告都不能替代新 SHA 的证据。

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
  "mechanical_units": 2034,
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
  "sha256_raw": "3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7",
  "sha256_nfc_lf": "3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7"
}
```

`2034` 在 `2000–2300` 内。`Sources` 已按命令正式排除；脚本的 `requires_independent_review` 是保守提示，不是失败，本报告的正文语义门单独给出 PASS。

## 3. C:18 修复与固定类别边界

### 3.1 C:18 新句与旧句

当前 C:18：

```text
18  英文 [Options](https://stardewvalleywiki.com/Options) 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
```

**PASS。** 新句清楚区分“档位数值代表倍率”与“商品是否属于受影响范围”两个判断层次，与前文普通/100%、75%、50%、25% 表格一致。精确扫描 `rg -n '四档名称相同' docs/blog-ops/profit-margin-stardew/C-zh-draft.md` 退出 1、无输出，旧的“四档名称相同”不再出现。

C:13–16、C:22 仍使用“按……读取/按 0.75 倍读取”描述倍率，但上下文紧邻表格和价格公式，含义可准确理解；这是非门控的中文措辞观察，不构成当前正文的事实或语义失败。

### 3.2 C:38

```text
38  ### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
```

**PASS。** “部分商店商品”保留来源清单的边界，没有把 Multiplayer 的部分商店项目扩大成全部商店；C:40 继续具体列出铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。

### 3.3 C:48 Figure 1 alt

```text
48  > **图片替代文本（alt）：** 星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
```

**PASS。** alt 对商店范围使用“来源列举”限定，没有写成全部商店费用固定；图位的 C:40/C:111 正文补全工具升级边界。Figure 1 的职责是区分会缩放价格与明确固定类别，不新增来源未列出的类别。

### 3.4 C:111 创建前检查

```text
111  - 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？
```

**PASS。** “来源列举的”直接限定商店商品；建筑、工具升级和任务金币奖励与 C:40 的固定清单一致，没有把固定边界改写为所有商店/所有支出。

## 4. C14、C26、C70、Sources 与公开来源

### 4.1 重点行复核

| 位置 | 结果 | 当前证据 |
|---|---|---|
| C:14 | PASS | “受影响的卖价与列出的种子价格都会降低”明确针对受影响类别和列出的种子价格，没有写成所有购买项目或净利润。 |
| C:26 | PASS | Multiplayer `#Profit_margins` 链接直接位于影响范围矩阵前，并写明“大多数”和“指定商品”不能扩写成所有商店统一缩放。 |
| C:70 | PASS | `/zh/how-to-earn-money-stardew` 仅出现 1 次，只作为前期预算背景补充；该内链没有把本文扩成第一年赚钱路线。 |
| C:115–124 | PASS | `Sources` 为末尾 H2；Checked 日期为 2026-09-22，列出中文 Options、英文 Options、Multiplayer、Getting Started 四个实际公开来源。 |

### 4.2 当前公开 URL 可达性

执行只读请求：

```sh
curl -fsS -L --max-time 20 -o /dev/null -w '%{http_code} %{url_effective} redirects=%{num_redirects}' <url>
```

真实结果：

```text
zh-options exit=0 200 https://zh.stardewvalleywiki.com/%E9%80%89%E9%A1%B9 redirects=0
options exit=0 200 https://stardewvalleywiki.com/Options redirects=0
multiplayer exit=0 200 https://stardewvalleywiki.com/Multiplayer#Profit_margins redirects=0
getting-started exit=0 200 https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner exit=0 200 https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

五个 URL 均 HTTP 200、退出 0、无重定向。HTTP 可达性只证明当前地址可访问，不代替页面渲染、页面装配、SEO 或部署验收。

### 4.3 当前来源文本与事实核对

本次以只读 HTTP 回读当前公开页面正文，得到以下可支持 C 的事实：

- 中文 Options：Profit Margin 为普通/75%/50%/25%，是物品售出价格的倍数；调低可提高难度；小数截断且价格不低于 1；创建新游戏时从角色创建界面的扳手进入“高级游戏设置”。
- English Options：Profit Margin 同时是售出物品价格和种子价格的倍数；fractional prices 截断为整数且不低于 1g。
- Multiplayer：降低利润率用于抵消多人活跃玩家增加的生产力；Wheat 在 25% 时为 6g 而不是 25g；Pierre 种子及 Joja 的 Grass Starter、Sugar、Wheat Flour、Rice 随档位缩放；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不受影响；Crab Pots 仍为 1,500g。
- Getting Started：角色创建菜单的扳手包含 Advanced Options，其中包括 Changing the profit margin。

C 的表格和公式与上述边界一致：

- C:11–16 的四档表按普通/100%、75%、50%、25% 排列；四分之三、一半和四分之一的倍率关系无冲突。
- C:18 的小数截断与 1g 下限没有写成四舍五入；C:34 的 `25g × 25% = 6.25g` 结合来源的整数截断得到显示值 `6g`。
- C:28–30 的矩阵只列来源明确的受影响/不受影响类别；C:34 的 Wheat 与 C:40/C:50 的 Crab Pots 分别承担缩放价格与固定价格的对照职责。
- C:56–60 的单人/多人/挑战表是条件化编辑判断，不冒充公开来源规定，不增加固定收益、完成时间或难度分数。

## 5. ReaderTask、意图边界、H1/层级与结构

### 5.1 唯一 ReaderTask

当前正文保持 B-zh 规定的单一任务：让 Stardew Valley 玩家理解新农场 Profit Margin 改变哪些价格、哪些来源列举的类别不随之变化，按单人/多人/挑战目标选择四档，并在创建新农场时找到设置入口。

信息顺序清楚：

1. C:3–7 定义设置及非全局边界；
2. C:9–22 解释四档、倍率、截断/1g 和 75% 问题；
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支处理价格边界；
4. C:52–82 按单人、多人、挑战目标做条件化选择，不给所有人一个普遍最佳值；
5. C:84–105 给新农场公开高层路径、平台/版本限制和找不到选项时的停止分支；
6. C:107–113 用创建前检查收束。

没有加入作物收益计算器、第一年赚钱路线、季节作物排名、Mod、旧存档 XML/跨平台修复、固定进度或金币预测。C:70 的一次内链只承担邻接预算背景，不生成第二个 ReaderTask。

### 5.2 H1、H2、H3

独立结构计数：

```text
h1_count=1 lines=[1]
h2_count=6 lines=[3, 9, 24, 52, 84, 115]
h3_count=12 lines=[20, 32, 38, 42, 62, 66, 72, 76, 80, 88, 103, 107]
h4_count=0
heading_level_jumps=[]
```

- C:1 是唯一 H1，与 B-zh 工作 H1 一致。
- `Sources` 位于文末 H2；没有 H4+ 或层级跳跃。
- 三张表分别服务四档查表、价格边界和场景选择，没有把同一职责机械重复成 FAQ。

## 6. 两个图位与平台边界

### 6.1 Figure 1

`fig-01-price-boundary` 只出现于 C:46–50，位于影响范围矩阵、Wheat 和 Crab Pots 示例之后。其 alt/图注解释“会缩放的受影响价格”与“来源列举的固定类别”的关系，并明确不是平台实机截图；职责与 Figure 2 不重叠。

### 6.2 Figure 2

`fig-02-advanced-options-path` 只出现于 C:97–101，位于新农场高层步骤之后。其 alt/图注说明“新建游戏 → 角色创建界面的扳手/高级游戏设置 → Profit Margin → 四档 → 创建农场”的平台中立路径，并明确不是某个平台实机截图，不承诺所有平台按钮位置一致。

### 6.3 平台与版本安全

C:86、C:90–95、C:101、C:105 只把公开 Wiki 记录的高层路径写成可核验文档路径；没有声称 PC、主机和移动端 UI 完全相同，也没有添加旧存档修改、Mod 或平台专属修复。遇到标签或入口差异时，正文要求按当前平台和版本重新核对并停止猜测。**正文语义 PASS；实际媒体、文件格式、尺寸、字节预算、权利、页面绑定、图中文字移动端可读性和渲染状态 UNVERIFIED。**

## 7. 流程泄漏与静态卫生

指定命令真实结果：

```sh
$ rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.0\\.0\\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

$ git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出

$ rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无尾随空白命中
```

另行逐段阅读未发现调度/代理、SERP/PAA、排名/竞品、研究元数据、私有绝对路径、本地服务地址、token/password/secret 或凭据。C 当前是未跟踪输入，因此 `git diff --check` 的退出 0 不应单独被解释为完整内容卫生证明；尾随空白 `rg` 及上述正文阅读共同提供本项证据。

## 8. 范围结算与未验证项

本报告只结算当前绑定 SHA `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7` 的 C-zh 中文正文：**PASS**。

以下项目保持 **UNVERIFIED**，不得从本 D 结论推导通过：

- 最终 Title/Description、slug、author、metadata、canonical、hreflang、schema；
- 实际 WebP/AVIF 媒体文件、同名绑定、尺寸/字节预算、权利/制作记录、alt/caption 页面渲染和移动端可读性；
- 页面组件、route、Next build、TypeScript、Vitest、真实页面 DOM、桌面/移动 ego-browser 和可访问性；
- 部署、生产 HTTP、收录、排名、转化或任何外部写入。

C-zh 正文未被本次检查修改。若 C-zh 后续任一字节变化，必须重新计算 SHA、重新执行 V7 计数、来源/事实核对、正文扫描和独立语义门。
