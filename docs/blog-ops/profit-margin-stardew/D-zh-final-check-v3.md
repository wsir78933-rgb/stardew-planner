# D-zh 最终独立检查 v3 — PASS

- **检查时间：** 2026-09-22（Asia/Shanghai）
- **检查对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **绑定 SHA-256：** `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9`
- **检查范围：** 当前 C-zh 中文正文的事实边界、公式/表格、V7 zh-CN 长度、R-1 修复、Sources 范围、内链、H1/结构、两处图位语义、公开 URL、防流程泄漏和静态卫生。
- **写入范围：** 只新增本报告；没有修改 C-zh 正文、其他正文、源代码、页面、媒体、配置、依赖、提交、推送、部署或外部数据。
- **结论：** **PASS（当前 C-zh 正文门）。** R-1 的两处边界措辞已按要求收窄；当前 SHA、V7 机械计数、独立语义核对、事实/公式、引用范围、结构、图位语义、公开 URL、内链和泄漏扫描均通过。页面 Title/Description、PublicBlogHandoff、实际 WebP/AVIF 媒体、页面装配、构建、浏览器渲染、部署和收录不属于本正文检查，仍为 **UNVERIFIED**。

历史 D/E 报告的旧版本绑定不作为本次证据；本报告只绑定上面的当前 C SHA。

## 1. 结论摘要

| 检查项 | 结果 | 当前证据 |
|---|---|---|
| C 版本绑定 | PASS | `sha256sum` 与本报告首部均为 `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9`；V7 输出的 `sha256_raw`、`sha256_nfc_lf` 也相同。 |
| V7 zh-CN 长度 | PASS | `mechanical_units=2019`，位于要求的 2000–2300 内，`meets_mechanical_floor=true`；脚本的 `requires_independent_review` 已由本报告完成独立语义复核。 |
| D-zh v2 R-1 | PASS | C:38 使用“部分商店商品、建筑、工具升级和任务奖励”；C:48 使用“来源列举的不受影响商店商品”；修复只收窄原有边界，没有新增类别、数字或机制。 |
| C14 卖价措辞 | PASS | C:14 为“受影响的卖价与列出的种子价格都会降低”，没有把种子支出写成变高或把价格变化冒充净利润变化。 |
| C26 公开引用邻近性 | PASS | C:26 在价格矩阵前直接链接英文 Multiplayer 的 `#Profit_margins`，紧邻影响范围和“大多数/指定商品”的限制。 |
| Sources 检查范围 | PASS | C:117 覆盖英文 Options/Multiplayer，C:119 补充中文 Options/Getting Started，C:121–124 列出四个读者可访问页面。 |
| C70 中文内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现一次，作为预算背景补充；只读 URL 回读 HTTP 200。 |
| H1/结构 | PASS | 只有 C:1 一个 H1；6 个 H2、12 个 H3，无层级跳跃；Sources 在最后。 |
| 公式/表格 | PASS | 四档、价格倍数、整数截断/1g 下限、Wheat 25g→6g、Crab Pots 1,500g 均前后一致；三张表的列数和 Markdown 结构完整。 |
| 图位语义 | PASS（正文语义）/UNVERIFIED（实际资产） | C:46–50 为价格边界图，C:97–101 为设置路径图；两处均有 alt/图注并明确平台安全边界。实际媒体、尺寸、格式、权利和渲染未验。 |
| 流程/私有信息泄漏 | PASS | 定向扫描和扩展扫描均 exit 1、无输出；没有内部流程、私有路径、凭据或本地服务信息。 |
| 静态卫生 | PASS | `git diff --check -- C-zh-draft.md` exit 0、无输出；无尾随空白。 |
| 页面/SEO 表面 | UNVERIFIED（范围外） | 当前文件不是锁后页面 handoff；不代签 Title、Description、slug、metadata、schema、真实页面或部署。 |

## 2. R-1 修复复核

### 2.1 精确定位

```text
$ nl -ba docs/blog-ops/profit-margin-stardew/C-zh-draft.md | sed -n '34,51p'
    38  ### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
    40  铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励被列为不受影响的类别。Willy（威利）的 `Crab Pots`（蟹笼）是具体对照：页面示例显示它仍为1,500g。它与 Wheat 一起说明了固定费用和受影响出售物品的差异。
    48  > **图片替代文本（alt）：** 星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
```

- C:38 已从宽泛的“商店/升级”标题收窄为“部分商店商品、建筑、工具升级和任务奖励”。
- C:48 已包含要求的“来源列举的不受影响商店商品”，不再使用“保持不变的商店费用”概括。
- C:30、C:40 仍保留来源逐项列举的铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励；表格数字、Wheat/Crab Pots 示例和其他正文未因 R-1 增加新事实。
- R-1 的结论为 **PASS**；当前报告以新 C SHA 重新计数和绑定，不沿用历史 SHA 证据。

## 3. 最近修复与读者边界

| 位置 | 结果 | 独立核对 |
|---|---|---|
| C:14 | PASS | 表格明确写“受影响的卖价与列出的种子价格都会降低”；没有写所有购买项目、所有费用或净利润统一变化。 |
| C:26 | PASS | 链接 `https://stardewvalleywiki.com/Multiplayer#Profit_margins` 位于价格矩阵前；后续 C:30 的影响/不受影响清单有邻近公开来源。 |
| C:117–119 | PASS | Checked 行写明 `Options and Multiplayer`，下一行明确补充 Chinese Options 和 Getting Started；Sources 的具体页面在 C:121–124。 |
| C:70 | PASS | 内链只出现 1 次，锚文本为“第一年赚钱与预算指南”；上下文只补预算背景，没有复制第一年赚钱路线、计算器或规划器教程。 |
| C:44、C:95、C:105 | PASS | 未归类价格、平台/版本差异和找不到入口时均保留待核验/停止分支，没有把未知行为写成确定机制。 |

## 4. 事实、公式、来源和平台边界

| C 行号 | 主张 | 结果 | 公开回读/正文核对 |
|---:|---|---|---|
| 5、9–18 | 普通/Normal（100%）、75%、50%、25% 四档；Profit Margin 作用于来源明确的售出物品和种子价格，不是现实会计净利润 | PASS | 中文 Options、英文 Options 和 Multiplayer 均列出四档；英文 Options 明确售出物品和种子价格倍数。 |
| 18、34 | 小数价格截断为整数且最低不低于 1g | PASS | 英文 Options 原文包含 `All fractional prices are truncated to the integer value` 和 `never below ... 1g`；C:34 将规则用于 Wheat 示例。 |
| 34、50 | Wheat 普通示例 25g、25% 显示 6g | PASS | Multiplayer 直接给出 25% 时 6g 而非 25g；C 没有把该示例外推为所有商品的固定结果。 |
| 26、30、34–36 | 多数出售物品、Pierre 种子、指定 Joja 商品受影响 | PASS | Multiplayer 列出 most items、Pierre seeds 和 Grass Starter/Sugar/Wheat Flour/Rice；C 使用“多数/指定”而没有扩大为全部出售物品或全部购买价。 |
| 30、38、40 | 铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不受影响 | PASS | Multiplayer 逐项列出这些类别；C:38/C:48 的 R-1 修复没有扩展清单。 |
| 40、50 | Willy 的 Crab Pots 仍为 1,500g | PASS | Multiplayer 当前正文仍给出该固定价格对照。 |
| 54、59、68 | 降低档位可以用于多人生产力再平衡；具体选值取决于人数/节奏/目标 | PASS | Multiplayer 支持再平衡理由；C 没有伪造“几个人必须选多少”的固定表格。 |
| 52–82 | 单人、多人、挑战选择是条件化判断 | PASS | 正文没有普遍最佳值、固定收益、固定金币损失或固定完成时间承诺。 |
| 84–105 | 新游戏→角色创建界面扳手/高级游戏设置→Profit Margin；平台/版本差异不冒充实测 | PASS | 中文 Options、英文 Options 和 Getting Started 支持高层路径；C:95/C:101/C:105 明确未逐平台核验。 |

### 4.1 公式和表格结构

当前 C 的三个表格经独立结构检查：

- C:11–16 为 3 列、四个档位行；普通/100%、75%、50%、25% 顺序完整。
- C:28–30 为 2 列影响范围矩阵；右列精确列出不受影响类别。
- C:56–60 为 3 列场景选择表；单人、多人、挑战各有条件化取舍。
- C:18 说明小数截断和 1g 下限，C:34 给出 Wheat 25g→6g，C:40 给出 Crab Pots 1,500g；这些数字没有表格冲突。

### 4.2 公开来源回读

本次以只读 HTTP 请求回读四个机制来源和一次站内内链；每个 `curl -fsSL -L --max-time 20` 请求均 exit 0：

```text
zh-options http_code=200 final=https://zh.stardewvalleywiki.com/选项 redirects=0
options http_code=200 final=https://stardewvalleywiki.com/Options redirects=0
multiplayer http_code=200 final=https://stardewvalleywiki.com/Multiplayer#Profit_margins redirects=0
getting-started http_code=200 final=https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner http_code=200 final=https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

HTML 正文关键字只读回读结果：

- 中文 Options：命中“利润率：普通/75%/50%/25%”和角色创建界面左下角扳手。
- 英文 Options：命中 Profit Margin 四档、售出物品倍数、种子倍数、fractional prices 截断和 1g 下限。
- Multiplayer：命中多人再平衡、most items、Pierre 种子、Grass Starter、Crab Pots、quest gold rewards，以及 Wheat 的 6g/25g 对照。
- Getting Started：命中角色创建菜单的 wrench/Advanced Options 和 changing the profit margin。

HTTP 200 只证明 URL 当前可达；事实结论同时依赖上面的页面正文关键字回读和 C 中的邻近链接，不把 URL 可达性冒充页面装配或生产环境证据。

## 5. V7 zh-CN 长度与当前 SHA

### 5.1 SHA-256

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实输出：

```text
128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

### 5.2 正式 V7 计数

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

真实输出：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客/docs/blog-ops/profit-margin-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2019,
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
  "sha256_raw": "128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9",
  "sha256_nfc_lf": "128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9"
}
```

`2019` 是 V7 正式机械值，落在 2000–2300；`Sources`、标题、URL、拉丁字母/数字和图位 blockquote 不计入该值。脚本保守返回 `requires_independent_review`，不是失败；本报告第 3–4 节完成了独立语义、事实和范围复核，因此当前正文语义门判 **PASS**。

## 6. H1、结构、图位和平台安全

### 6.1 H1/H2/H3

- C:1 是唯一 H1：`星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选`。
- H2 位于 C:3、9、24、52、84、115；`Sources` 在正文末尾。
- H3 位于 C:20、32、38、42、62、66、72、76、80、88、103、107；没有从 H2 跳到 H4，也没有第二个 H1。
- C:5 紧跟首个 H2，直接回答设置定义；C:46–50 与 C:97–101 是两个不同职责的语义图位，不是页面已绑定的实际图片。

### 6.2 Figure 1

- C:46–50 的 `fig-01-price-boundary` 放在价格矩阵、Wheat 和 Crab Pots 解释之后。
- alt 同时标明会缩放的选定出售/种子/指定 Joja 商品，以及“来源列举的不受影响商店商品”；未把来源列举扩大成所有商店。
- 图注明确 Wheat 25g/6g、Crab Pots 1,500g，并写明这是价格边界图、不是某个平台的游戏截图。

### 6.3 Figure 2

- C:97–101 的 `fig-02-advanced-options-path` 放在新农场有序路径之后、创建前检查之前。
- alt 和图注都把它定义为平台中立流程示意；图注明确依据公开 Options/Getting Started，不是某个平台实机截图，也不承诺所有平台按钮位置相同。

两个图位的正文语义通过；当前没有生成或绑定实际 WebP/AVIF，没有核验 1672×941、≤400 KiB、权利记录、`PublicPicture`、懒加载、桌面/移动渲染或图内文字可读性，因此媒体和页面状态保持 **UNVERIFIED**。

## 7. 流程泄漏、私有路径和静态卫生

### 7.1 必查命令

```sh
rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.\\.0\\.0\\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出
```

### 7.2 扩展扫描

```sh
rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|Agent[ -]?[A-G]|\\b(role|worker|coordinator|dispatch|handoff|assembly|bodyHash|mechanical_units|PublicReference|editor appendix|task card|internal)\\b|A-zh|B-zh|C-zh|D-zh|project-interface|任务卡|调度|代理回执|私有路径|/Users/|/home/|file://|localhost|127\\.0\\.0\\.1|\\.codex|\\.hermes|docs/blog-ops|node_modules|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无尾随空白

git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出。C 是未跟踪文件，no-index 的 exit 1 是状态，不是空白命中。
```

正文没有出现调度/worker/SERP/PAA、研究文件名、私有绝对路径、localhost、本地 IP、token/password/secret、API 凭据或内部 body/hash 字段。`fig-01-price-boundary` 与 `fig-02-advanced-options-path` 是布局约定的读者图位 ID，不是流程泄漏；它们仍不能作为实际媒体绑定证据。

## 8. 范围结算

本报告仅结算当前 C-zh 中文正文：**PASS**。以下项目没有被本任务执行或通过：

- 最终 SEO Title/Description、author、slug、PublicBlogHandoff、metadata、schema；
- 实际图片生成/绑定、WebP/AVIF、尺寸、字节预算、权利、页面图注和移动端可读性；
- 页面源代码、Next build、typecheck、Vitest、真实路由、ego-browser 页面验收；
- 部署、生产环境、收录、排名或外部写入。

本次只新增 `D-zh-final-check-v3.md`。C-zh 正文没有修改；后续若 C-zh 任一字节变化，必须重新计算 SHA、重新跑 V7 计数和正文扫描，并重新生成绑定当前 SHA 的 D 报告。
