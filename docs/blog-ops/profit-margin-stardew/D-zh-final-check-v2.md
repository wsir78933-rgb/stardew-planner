# D-zh 最终独立检查 v2 — REVISE

- **检查时间：** 2026-09-22（Asia/Shanghai）
- **检查对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **绑定 SHA-256：** `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28`
- **检查范围：** 当前 C-zh 中文正文的事实、公式、来源、结构、V7 长度、防流程泄漏、内链和图位语义；只读相关研究/布局/接口文件。
- **写入范围：** 只新增本报告；没有修改 C-zh 正文、页面源码、配置、依赖、提交、推送、部署或外部数据。
- **结论：** **REVISE。** 当前正文的核心事实、公式、最近修复、V7 长度、来源可达性和流程泄漏门均通过；但 C:38 的小节标题和 C:48 的 Figure 1 alt 将来源只列举的固定类别概括成过宽的“商店”/“商店费用”，需要收窄后再绑定新 SHA 重跑 D/E。页面 Title、Description、实际媒体和页面验收不属于本 C 正文门，仍为 **UNVERIFIED**。

## 1. 结论摘要

| 检查项 | 结果 | 证据 |
|---|---|---|
| C 版本绑定 | PASS | 当前 `sha256sum` 为本报告首部 SHA；计数脚本 `sha256_raw`、`sha256_nfc_lf` 同值。 |
| V7 zh-CN 长度 | PASS | 正式计数 `mechanical_units=2019`，在 2000–2300 内；脚本仍正确标记 `semantic_qualification=requires_independent_review`。 |
| C14 卖价措辞 | PASS | C:14 已写成“受影响的卖价与列出的种子价格都会降低”，不再把降低的种子购买价描述成“更紧”的支出。 |
| C26 公开引用邻近性 | PASS | C:26 在价格矩阵前直接链接英文 Multiplayer 的 `#Profit_margins`；表格列出的范围可就近回读。 |
| Sources 检查范围 | PASS | C:117 的 Checked 行覆盖 Options/Multiplayer，C:119 明确补充 Chinese Options/Getting Started；四页实际正文均可读。 |
| C70 中文内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现一次，作为预算背景补充；当前 URL HTTP 200。 |
| 事实与公式 | **PASS（正文主张）/REVISE（标题与 alt 边界措辞）** | 四档、倍数、取整、1g 下限、Wheat 25g→6g、Crab Pots 1,500g、多人再平衡和设置路径均能由公开页面支持；C:38/C:48 需避免把部分固定类别概括成全部商店。 |
| H1/结构 | PASS（正文壳） | C:1 只有一个 H1；H2/H3 顺序完整，来源位于正文末尾；两个图位职责不同。 |
| Title/Description | UNVERIFIED（范围外） | 当前 C 文件只提供工作 H1 和正文，没有锁后页面 Title/Description；不能用工作 H1 代签页面 SEO 表面。 |
| 流程/私有信息泄漏 | PASS | 定向泄漏扫描退出 1、无输出；正文只保留读者需要的平台/版本限制和待核验动作。 |
| 实际媒体/页面 | UNVERIFIED（范围外） | 只有两个语义图位；未核验实际 WebP/AVIF、尺寸、权利、绑定、渲染或浏览器。 |

## 2. 必须返修的精确问题

### R-1：固定商店范围被标题和 Figure 1 alt 说宽

**位置与原文：**

- C:38：`### 不会变化的范围：商店、建筑、升级和任务奖励`
- C:48：`图片替代文本（alt）：……以及保持不变的商店费用、建筑、升级和任务金币奖励。`

**为什么需要返修：**

英文 Multiplayer 的公开页面只把不受影响范围写成来源列举的类别：铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。它没有支持“所有商店”或“所有商店费用”都固定不变。C:30 和 C:40 的正文清单本身是精确的，但 C:38 的标题和 C:48 的 alt 可能让读者把“部分商店商品”理解成整个商店经济；这与 C:26 的“不能扩写成所有商店统一缩放”形成边界不一致。

**最小修复建议：**

- C:38 改为：`### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励`
- C:48 alt 至少改为：`……以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。`

修复只收窄表述，不新增类别、不新增事实、不改表格数字。修复后必须重新计算 C SHA，并重新执行本报告第 7 节的计数、泄漏和空白检查；旧 SHA 的本报告不能沿用。

**可复现定位：**

```sh
nl -ba docs/blog-ops/profit-margin-stardew/C-zh-draft.md | sed -n '24,50p'
```

实际关键输出：

```text
26  判断一个数字时，先看它属于下表哪一列，再看当前档位；[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)给出这份影响范围清单；“大多数”和“指定商品”不能扩写成所有商店统一缩放。
30  | 来源列举的多数出售物品…… | 铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。 |
38  ### 不会变化的范围：商店、建筑、升级和任务奖励
48  > **图片替代文本（alt）：** ……以及保持不变的商店费用、建筑、升级和任务金币奖励。
```

公开页面当前回读到的边界是：Pierre 种子及 Joja 的四项指定商品按档位缩放；其他商品中只列举 Blacksmith、Fish Shop、Traveling Cart、建筑和工具升级，并另列 quest gold rewards 不受影响。该回读支持“来源列举/部分”措辞，不支持“所有商店费用”概括。

## 3. 最近修复逐项复核

| 修复项 | 结果 | 当前证据 |
|---|---|---|
| C14 卖价措辞 | PASS | `rg -n '受影响的卖价|列出的种子价格'` 命中 C:14；句子把受影响卖价和列出的种子价格作为价格范围，未承诺净收益或把种子成本写成更高。 |
| C26 表格附近 Multiplayer 链接 | PASS | C:26 链接紧邻表格前的分类规则；C:30 的清单由该来源邻近支持，C:68 再支持多人再平衡。 |
| Sources 检查范围说明 | PASS | C:117：`Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.`；C:119：`This review also checked the Chinese Options and Getting Started pages listed below.` 这两句合起来明确是四个公开页面，不声称浏览器实机测试。 |
| C70 中文内部链接 | PASS | C:70 只有一次 `/zh/how-to-earn-money-stardew`，锚文本为“第一年赚钱与预算指南”；只补预算背景，没有复制赚钱路线。 |
| Figure 1 | PASS（语义）/UNVERIFIED（资产） | C:46–50 位于价格矩阵后，负责“受影响价格 vs 明确固定类别”及 Wheat/Crab Pots 对照；图注明确不是平台游戏截图。C:48 的“商店费用”边界需按 R-1 收窄。 |
| Figure 2 | PASS（语义）/UNVERIFIED（资产） | C:97–101 位于新农场步骤后，负责设置路径；alt/图注称平台中立示意，不是某个平台实机截图，也不承诺所有平台按钮位置相同。 |

## 4. 事实、公式、平台和表格数字

| 主张 | C 行号 | 结果 | 独立核对 |
|---|---:|---|---|
| 四档为普通/Normal（100%）、75%、50%、25% | 9–18 | PASS | 中文 Options、英文 Options 和 Multiplayer 均可读到四档。100% 作为普通档位的写法与来源一致。 |
| Profit Margin 是售出物品和种子价格的倍数，不是现实净利润比例 | 5、18、22 | PASS | 英文 Options 明确售出物品和种子两个倍率；C 同时阻断现实会计误解。 |
| 小数截断为整数，最低不低于 1g | 18、34 | PASS | 中文/英文 Options 均支持取整与 1g 下限。 |
| Wheat 普通 25g、25% 显示 6g | 34、50 | PASS | Multiplayer 公开示例为 25% 时 6g 而非 25g；C 没有把示例外推成所有商品数字。 |
| 受影响范围 | 26、30、34–36 | PASS | C 使用“多数出售物品”“Pierre 种子”“指定 Joja 商品”，没有改写成所有出售物品或所有购买价。 |
| 不受影响范围 | 30、40 | PASS（正文清单） | C 精确列铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励；R-1 只针对 C:38 标题和 C:48 alt 的概括过宽。 |
| Willy 的 Crab Pots 仍为 1,500g | 40、50 | PASS | Multiplayer 当前页面仍给出该固定价格例子。 |
| 多人降低档位用于再平衡生产力 | 54、59、68 | PASS | Multiplayer 支持抵消活跃玩家增加生产力的再平衡思路；C 没有伪造“几个人必须选多少”。 |
| 单人/多人/挑战选择 | 52–82 | PASS | 文章把档位建议写成按人数、节奏和经济约束的编辑判断，没有普遍最佳、固定金币、固定进度或固定慢速倍数。 |
| 新农场设置路径 | 84–105 | PASS（高层文档路径） | 中文 Options、英文 Options 和 Getting Started 支持角色创建界面扳手/Advanced Options 路径；C 明确没有逐平台实测。 |
| 平台/版本边界 | 95、101、105 | PASS（安全措辞） | C 不声称 PC、主机和移动端按钮、标签、版本行为完全一致；找不到选项时停在公开高层路径。 |

### 4.1 公开来源回读

本次用 `curl -fsS -L --max-time 20` 回读四个机制来源和一次站内内链。HTTP 200 只证明 URL 当前可达，事实结论还结合页面正文关键词回读：

- 中文 Options：可读到普通/75%/50%/25%、物品售出价格倍数、取整/1g 下限和新游戏角色创建界面扳手。
- 英文 Options：可读到售出物品倍率、种子倍率、取整/1g 下限和新游戏扳手/Advanced Options。
- Multiplayer：可读到多人再平衡、Wheat 25g→6g、Pierre 种子、Joja 指定商品、明确不受影响类别和 Crab Pots 1,500g。
- Getting Started：可读到角色创建菜单扳手包含 Advanced Options，其中包含 changing the profit margin。

## 5. H1、标题描述和结构

### 5.1 H1/H2/H3

- C:1 是唯一 H1：`星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选`，与 B-zh 工作 H1 一致。
- H2 位于 C:3、9、24、52、84、115；C:115 的 `Sources` 是文末来源区，不会把来源清单混进读者主任务。
- H3 位于 C:20、32、38、42、62、66、72、76、80、88、103、107；层级无跳级。
- C:5 紧跟 H2-1，是 direct answer；按 V7 汉字计数逻辑为 107 个汉字。B-zh 的 70–100 是“约”目标，当前仅略高于名义上限，不影响 2000–2300 正式长度门；若锁后需要更短 snippet，可另由 B/F 处理，不把它与本次事实返修混改。
- C:11–16、C:28–30、C:56–60 三组表格职责分别是四档查表、价格边界、条件化选择，没有发现表格格式损坏或表格数字与正文示例冲突。

### 5.2 Title / Description

C-zh 文件没有 frontmatter、最终 SEO Title 或 Description；project interface spec 规定这些由后续锁稿/页面表面提供。因此本检查只签工作 H1 与正文结构，不把 C:1 冒充最终 Title，也不把当前正文 SHA 冒充页面 SEOTruth。

## 6. 流程、防泄漏和静态卫生

### 6.1 读者正文边界

- C:1–113 是读者正文；C:115–124 是公开 Sources。
- `fig-01-price-boundary` 和 `fig-02-advanced-options-path` 是 B-zh 约定的语义图位，不是研究事实 ID、任务 ID 或代理记录；它们必须在后续页面装配时绑定实际媒体，不能把原始图位标记直接当作已完成媒体证据。
- 平台/版本未逐一实测、价格未归类时待核验，是读者需要的安全限制，不是研究日志。
- 未见 SERP/PAA、排名/搜索量、研究元数据、A/B/D/E/F 角色、任务卡、dispatch/worker/coordinator、私有路径、文件系统路径、token、密钥或本地服务信息。

### 6.2 定向命令结果

下列 `rg` 结果中，定向关键词命中是正常的 H1、来源、图位和内链；泄漏扫描的退出码 1 表示无匹配：

```text
rg -n "^# |^## |Multiplayer|Checked|Options|Getting Started|/zh/how-to-earn-money-stardew|figure|dispatch|worker|SERP|PAA|docs/blog-ops|/Users/" docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=0
# 命中 C:1、3、5、9、18、24、26、52、68、70、84、86、101、115、117、119–124 等预期正文/来源位置

rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|worker|coordinator|dispatch|task card|任务卡|调度|代理|/Users/|/home/|file://|localhost|127\.0\.0\.1|\.codex|\.hermes|docs/blog-ops|node_modules|api[_-]?key|access[_-]?token|Bearer[[:space:]]|PRIVATE KEY|sk-[A-Za-z0-9]{16,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=1
# 无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=1
# 无尾随空白
```

`git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md` 退出 0、无输出；C 是未跟踪文件，另用 `git diff --no-index --check /dev/null .../C-zh-draft.md` 诊断，退出 1 且无输出（未跟踪文件的 no-index 状态，不是空白命中）。

## 7. V7 长度、哈希和真实命令输出

### 7.1 C SHA-256

```text
$ sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=0
a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

### 7.2 V7 正式 zh-CN 计数

```text
$ python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
exit=0
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客/docs/blog-ops/profit-margin-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2019,
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
  "sha256_raw": "a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28",
  "sha256_nfc_lf": "a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28"
}
```

### 7.3 排除两处图位 blockquote/alt/caption 后的独立计数

V7 `extract_body` 本身会排除所有以 `>` 开头的 blockquote，因此正式 `mechanical_units=2019` 已经不计 C:46–50、C:97–101 的图位、alt 和图注。为避免把图注误计入，另做了显式行号诊断：

```text
mechanical_units=2019
required_range=2000-2300
meets_range=True
figure_blockquote_line_numbers=[46, 47, 48, 49, 50, 97, 98, 99, 100, 101]
figure_blockquote_han_units_if_counted=233
caption_line_numbers=[50, 101]
caption_han_units_if_counted=131
independent_units_after_figure_blockquotes_removed=2019
```

因此：正式合格计数为 **2019**；若错误地把两组图位 blockquote 算入会得到 2252，但 V7 明确把 alt/caption 和 blockquote 排除，不能用 2252 代替正式值。2019 在 2000–2300 内；计数通过不等于语义、页面或媒体通过。

## 8. URL 可达性命令输出

```text
zh-options http_code=200 final=https://zh.stardewvalleywiki.com/选项 redirects=0
options http_code=200 final=https://stardewvalleywiki.com/Options redirects=0
multiplayer http_code=200 final=https://stardewvalleywiki.com/Multiplayer#Profit_margins redirects=0
getting-started http_code=200 final=https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner http_code=200 final=https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

五个 URL 的 `curl -fsS -L --max-time 20` 调用均退出 0。Fragment 的 HTTP 回读只能证明页面可达；`#Profit_margins` 的正文支持来自上节的页面正文回读和人工对应，不把 fragment 状态伪报成独立 HTTP 资源。

## 9. 修复后必须重跑

C 只需处理 R-1 的收窄措辞，不得顺手扩展文章范围。修复完成后，至少重新执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
rg -n "^# |^## |Multiplayer|Checked|Options|Getting Started|/zh/how-to-earn-money-stardew|fig-|dispatch|worker|SERP|PAA|docs/blog-ops|/Users/" docs/blog-ops/profit-margin-stardew/C-zh-draft.md
git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

新 SHA 产生前，本报告只能作为当前 `a67b...f0581e28` 的检查结果；新 SHA 产生后必须重新生成 D 检查，不得沿用本版绑定。

## 10. 明确未声明的下游状态

本报告没有通过或执行：实际图像生成/绑定、WebP/AVIF、1672×941、≤400 KiB、版权记录、页面组件、route/build、桌面/移动浏览器、可访问性、部署、收录、排名、最终 Title/Description、Article/FAQPage 页面 schema 或用户终审。该结论只针对本报告首部绑定的 C-zh 正文 SHA。
