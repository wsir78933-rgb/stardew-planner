# E-zh 最终独立审核 v3 — REVISE（当前 C-zh 正文）

审查日期：2026-09-22（Asia/Shanghai）。

审查对象：`docs/blog-ops/profit-margin-stardew/C-zh-draft.md`。

本报告是独立 E 审核，只读复核当前 C-zh 正文、A-zh 研究、B-zh 布局、D-zh 检查、历史 E 报告、Project interface spec、V7 正文计数脚本、V7 22 条鉴文规则和公开机制来源；只写入本报告，不修改 C-zh 正文、研究/布局/检查文件、页面源码、媒体、配置、依赖、数据库或外部服务。

## 1. 结论

**REVISE。** 当前 C-zh 的 V7 机械长度、事实/公式、表格数字、来源邻近性、C14/C26/Sources/C70 修复、D-zh v2 R-1 的 C:38 与 C:48 收窄、中文自然度、唯一 ReaderTask、搜索意图、22 条鉴文和两个图位语义均可接受；但 C:111 仍把来源只列举的固定商店商品写成不加限定的“商店”，需要再收窄后才能对当前新 SHA 做最终正文 PASS。

本结论绑定当前 C SHA `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9`。旧 D-zh v2 的 `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28` 只代表旧正文，本报告没有沿用旧 SHA 的 PASS，也没有把旧 E 报告当作当前版本证据。

C:111 的问题是边界措辞问题，不是发现了新的机制、公式或数值错误。修复该一行后必须重新计算 C SHA，并重新运行 D/E；在新 SHA 产生前，本报告不能改写为当前正文 PASS。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| 当前 C 版本绑定 | PASS（对当前版本） | `sha256sum` 与 V7 `sha256_raw`/`sha256_nfc_lf` 均为 `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9`。 |
| V7 zh-CN 机械长度 | PASS | `mechanical_units=2019`，目标 `2000–2300`，`meets_mechanical_floor=true`。 |
| V7 语义资格 | PASS（本 E 已独立完成） | 脚本仍保守返回 `semantic_qualification=requires_independent_review`；本报告完成语义、ReaderTask、自然度和 22 条鉴文，不把脚本字段冒充语义放行。 |
| Sources/图位排除口径 | PASS | 正式命令排除 `Sources` 和两组 `>` blockquote；正式值为 2019，错误包含 Sources 的对照值为 2088。 |
| D-zh v2 R-1 两处修复 | PASS（但另有 C:111 残留） | C:38 已写“部分商店商品”；C:48 已写“来源列举的不受影响商店商品”；C:111 仍无“部分/来源列举”限定。 |
| C14 卖价措辞 | PASS | C:14 将受影响卖价与列出的种子价格作为受影响价格范围，没有把种子成本写成更高或承诺净收益。 |
| C26 公开引用邻近性 | PASS | C:26 在影响矩阵前直接链接英文 Multiplayer `#Profit_margins`，并明确不能扩写成所有商店统一缩放。 |
| Sources 范围与日期 | PASS | C:117–124 覆盖 Options、Multiplayer、中文 Options、Getting Started；Checked 日期为 2026-09-22，与本次回读日期一致。 |
| C70 中文内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现一次；本次 HTTP 200、无重定向。 |
| 事实、公式、表格数字 | PASS | 四档、倍数、截断/1g、Wheat 25g→6g、Crab Pots 1,500g、多人再平衡和新农场高层路径均由当前公开页面支持。 |
| 中文自然度 | PASS | 句式、术语、条件句和动作指引自然；未发现翻译腔、助手口吻或人为故事。 |
| 唯一 ReaderTask/搜索意图 | PASS | C:1–113 始终回答“理解、选择并在新农场设置 Profit Margin”；没有扩成赚钱路线、计算器、Mod 或旧存档教程。 |
| 22 条 anti-slop | PASS | 逐条复核见第 7 节；第 6、11 条因体裁不适用并说明原因。 |
| H1/结构 | PASS | C:1 只有一个 H1；H2/H3 层级完整，Sources 在文末。 |
| 两个图位 | PASS（语义）/UNVERIFIED（资产） | Figure 1 与 Figure 2 的职责、位置和平台安全措辞通过；实际图片、绑定、尺寸、格式、权利和渲染未核验。 |
| Title/Description | UNVERIFIED | 当前 C 文件没有锁后 SEO Title/Description、metadata 或 PublicBlogHandoff。 |
| 页面/浏览器/构建/部署 | UNVERIFIED | 本任务未运行页面装配、build、typecheck、dev server、ego-browser、部署或生产回读。 |

## 2. 版本绑定和输入

| 输入 | SHA-256 |
|---|---|
| 当前 `C-zh-draft.md` | `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9` |
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| `D-zh-final-check-v2.md` | `2770080faee16064a1749cf62f1096d2f6a82ddaa58080f7f37d6b7bee050567` |
| 任务期间出现的 `D-zh-final-check-v3.md` | `3364c3601d172e7b308fd9f6a32345cfde37d9c14d5b480a1452c6d847f11a82` |
| V7 `22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| V7 `正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |

D-zh v2 的首部绑定是旧 C SHA `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28`，不能代替本次 `128f...ec9` 的重新计数和独立复核。

## 3. 必须返修的精确问题

### R-1 residual：C:111 仍未限定固定商店范围

当前原文：

```text
111 - 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的商店、建筑、升级和任务金币奖励？
```

问题在于 `不缩放的商店、建筑、升级` 没有 `部分`、`来源列举` 或具体商店类别限定。英文 Multiplayer 当前公开文本只列举 Blacksmith、Fish Shop、Traveling Cart items、buildings、tool upgrades 和 quest gold rewards 不受影响；它不支持把所有商店商品或所有升级概括成固定类别。C:26、C:30、C:38、C:40 和 C:48 已经采用精确边界，因此 C:111 的未限定写法会在文章结尾重新打开同一范围风险。

最小修复建议（只改 C:111 这一行，不新增事实）：

```text
- 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励？
```

复现命令：

```sh
nl -ba docs/blog-ops/profit-margin-stardew/C-zh-draft.md | sed -n '107,113p'
rg -n -i '商店|不缩放|不受影响|来源列举|部分商店商品' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

当前复现的关键命中为 C:38 的 `部分商店商品`、C:48 的 `来源列举的不受影响商店商品`，以及 C:111 的未限定 `不缩放的商店、建筑、升级和任务金币奖励`。C:5 的“不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化”是在否定全局同倍率，不等同于断言所有商店固定；C:26 还明确阻断所有商店统一缩放，因此本次唯一需要返修的正文边界是 C:111。

### 修复后的重验要求

C:111 改动后必须重新执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
rg -n '^# |^## |部分商店商品|来源列举的不受影响商店商品|Multiplayer|Checked|/zh/how-to-earn-money-stardew|fig-01|fig-02' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.0\\.0\\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
 git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

修复后应重新绑定 D/E 新 SHA；不能把本报告或 D-zh v2 的旧 SHA 改名复用。

## 4. D-zh v2 R-1 与此前风险逐项复核

| 项目 | 结果 | 当前逐项证据 |
|---|---|---|
| D-zh v2 R-1 / C:38 标题 | PASS | C:38 为“不会变化的范围：部分商店商品、建筑、工具升级和任务奖励”，已从宽泛“商店”收窄为部分商店商品。 |
| D-zh v2 R-1 / Figure 1 alt | PASS（语义边界） | C:48 为“来源列举的不受影响商店商品、建筑、升级和任务金币奖励”；“来源列举”限定了商店商品/升级范围，没有写成所有商店固定。为 alt 的简短概述，具体类别仍由 C:30/C:40 承担。 |
| C14 旧风险 | PASS | C:14：`受影响的卖价与列出的种子价格都会降低`；未把降低的种子价格写成支出更高，也未承诺净利润。 |
| C26 旧风险 | PASS | C:26 的 Multiplayer 链接直接位于矩阵前，并写明“‘大多数’和‘指定商品’不能扩写成所有商店统一缩放”。 |
| Sources 旧风险 | PASS | C:117 的 Checked 标签覆盖 English Options/Multiplayer；C:119 说明另外检查 Chinese Options/Getting Started；C:121–124 列出四个公开 URL。 |
| C70 旧风险 | PASS | C:70 仅有一次 `/zh/how-to-earn-money-stardew`，锚文本是“第一年赚钱与预算指南”，只补预算背景；实时回读 HTTP 200、redirects=0。 |
| 固定类别边界 | **REVISE（仅 C:111）** | C:30/C:40 是精确清单，C:38/C:48 已收窄；C:111 再次使用不限定的“商店、升级”，需按第 3 节改写。 |

## 5. V7 长度、Sources 和图位排除口径

### 5.1 当前 SHA 与正式计数

实际命令：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

实际输出：

```text
128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

实际 V7 命令：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

关键实际输出：

```json
{
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
  "sha256_raw": "128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9",
  "sha256_nfc_lf": "128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9"
}
```

`2019` 位于 B-zh 要求的 `2000–2300` 范围内。C:5 的 direct-answer 段按汉字为 109，略高于 B-zh 的“约 70–100”目标；这是近似目标而非本次阻塞项，且当前正文机械值仍在上限内，不应为了缩短 snippet 删除价格边界或安全限制。

### 5.2 Sources 与两组 figure blockquote

不排除 Sources 的对照命令实际输出 `mechanical_units=2088`；因此 Sources 的可计数中文单位为 `2088 - 2019 = 69`，正式命令确实没有把 Sources 计入正文门。

当前 `extract_body` 对所有以 `>` 开头的 blockquote 计为 `non_body`，所以：

- Figure 1：C:46–50，5 行，原始汉字观察值 128；正式 V7 正文提取为 0。
- Figure 2：C:97–101，5 行，原始汉字观察值 109；正式 V7 正文提取为 0。
- `Sources`：C:115–124；正式 `--exclude-heading Sources` 排除该节，独立对照为 69 个中文单位。
- C:90–93 的步骤和 C:109–111 的三项清单属于正常正文列表，计入正式值。

不能用把 alt/caption 或 Sources 加回去的数字替代正式 `2019`；机械门通过也不等于正文语义、媒体或页面通过。

## 6. 事实、公式、表格、引用、日期与平台边界

### 6.1 公开来源独立回读

本次以只读 HTTP 请求回读四个机制来源和 C:70 内链。四个 Wiki URL 均返回 HTTP 200、无重定向；内链也返回 HTTP 200、无重定向。

```text
zh-options       http=200 final=https://zh.stardewvalleywiki.com/选项 redirects=0
options          http=200 final=https://stardewvalleywiki.com/Options redirects=0
multiplayer      http=200 final=https://stardewvalleywiki.com/Multiplayer redirects=0
getting-started  http=200 final=https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner       http=200 final=https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

页面正文关键词独立回读结果：

- 中文 Options：高级游戏设置包含普通/75%/50%/25%利润率，说明它是物品售出价格倍数，调低会提高难度，小数截断且价格不低于 1；页面说明新建游戏时从角色创建界面左下角扳手进入高级游戏设置。
- English Options：明确 Profit Margin 同时是物品售出价格和种子价格的倍数，并明确小数截断为整数且不低于 1g。
- Multiplayer：说明降低利润率是为多人活跃玩家增加的生产力作再平衡；给出 25% 时 Wheat 由 25g 显示为 6g；Pierre 种子及 Joja 的 Grass Starter、Sugar、Wheat Flour、Rice 随档位缩放；Blacksmith、Fish Shop、Traveling Cart 商品、建筑、工具升级和任务金币奖励不受影响；Willy 的 Crab Pots 仍为 1,500g。
- Getting Started：角色创建菜单中的扳手包含 Advanced Options，其中列出 Changing the profit margin。

### 6.2 C 主张逐项核对

| 主张 | C 位置 | 结果 | 核对 |
|---|---:|---|---|
| 四档普通/100%、75%、50%、25% | 9–18 | PASS | 中文/英文 Options 和 Multiplayer 公开文本一致。 |
| Profit Margin 是选定出售物品/种子价格倍数，不是现实净利润比例 | 5、18、22 | PASS | English Options 支持出售价格和种子价格倍数；C 明确阻断现实会计误读。 |
| 小数截断为整数，最低 1g | 18、34 | PASS | 中文/英文 Options 支持；C 未写成四舍五入。 |
| Wheat 25g→25% 时 6g | 34、50 | PASS | Multiplayer 直接给出 25% 时 6g 而非 25g；C 的 25g×0.25=6.25g 后截断为 6g 计算一致。 |
| 受影响范围 | 26、30、34–36 | PASS | C 使用“多数出售物品”“Pierre 种子”“指定 Joja 商品”，没有外推所有出售物品或所有购买价。 |
| 不受影响范围 | 30、40、44 | PASS | C:30/C:40 精确列出 Blacksmith、Fish Shop、Traveling Cart 商品、建筑、工具升级、任务金币；C:44 保留未归类待核验分支。 |
| Willy 的 Crab Pots 为 1,500g | 40、50 | PASS | Multiplayer 公开示例一致。 |
| 多人降低档位用于生产力再平衡 | 54、59、68 | PASS | 来源支持再平衡理由；C 不伪造人数对应表、固定收益或完成时间。 |
| 新农场设置入口 | 84–105 | PASS（文档化路径） | 中文 Options 与 Getting Started 支持高层路径；C:95/101/105 明确未逐平台实测。 |

### 6.3 表格数字和边界

- 四档表格 C:11–16 的倍率解释分别为标准、四分之三、一半、四分之一；所有“受影响价格”限定与来源边界一致。
- C:28–30 的矩阵只列来源台账中的类别，不把 `most items` 改成全部商品。
- C:34 的 Wheat 示例与 C:40 的 Crab Pots 示例是一缩放、一固定；两者没有被外推为所有商品数字。
- C:56–60 的场景表给的是条件化编辑判断，不伪装成 Wiki 规则或实测难度分数。
- C:90–93 的步骤只写公开高层路径；C:95、C:101、C:105 没有补猜平台专属按钮、版本行为或旧存档修改步骤。

### 6.4 引用邻近性和 Sources

- C:5 的中文 Options 链接靠近设置定义和四档；同段 Multiplayer 链接说明非全局边界。
- C:18 的 English Options 链接紧邻出售价格/种子价格倍数、截断和 1g 下限。
- C:26 的 Multiplayer 链接紧邻价格矩阵前的分类规则，C:30 的范围由同一来源就近支撑。
- C:68 再次链接 Multiplayer，靠近多人生产力再平衡主张。
- C:86 的中文 Options 与 Getting Started 链接紧邻新农场路径。
- C:117–124 的 Sources 只保留四个读者可访问的公开页面，并有 Checked 日期和具体页面说明。

## 7. ReaderTask、搜索意图、结构和中文自然度

### 7.1 唯一 ReaderTask

B-zh 将主任务定义为：读者理解新农场 Profit Margin 改变哪些价格、哪些成本/奖励不跟着变，根据单人/多人/挑战目标选择四档，并在新农场创建时找到入口。A-zh 的候选主意图同样是 informational definition/explainer + 条件化设置决策，不是现实商业利润、作物 ROI 或泛赚钱路线。

当前 C 的信息顺序与 B-zh 一致：

1. C:3–7 直接定义设置和非全局边界；
2. C:9–22 解释四档、倍数、截断、1g 和 75% 直问；
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支处理影响范围；
4. C:52–82 按单人、多人、挑战目标选择，不给所有人一个“最佳值”；
5. C:84–105 给新农场公开高层路径、平台/版本边界和找不到选项的停止分支；
6. C:107–113 以三项创建前检查收束。

正文没有加入作物收益计算器、第一年赚钱路线、季节作物排名、Mod、旧存档 XML/跨平台修复、固定进度或金币预测。C:70 的一次内链只补预算背景，不创建第二个 ReaderTask。

### 7.2 H1、标题层级和首段

- C:1 是唯一 H1，正是 B-zh 工作 H1；C 内没有第二个 H1。
- H2 在 C:3、9、24、52、84、115；H3 只出现在相应 H2 下，没有跳到 H4。
- C:115 的 `Sources` 在正文末尾，未把公开来源清单混入主任务。
- C:5 是 H2-1 后第一段 direct answer；按汉字计数为 109，略高于 B-zh 的约 70–100 目标，但内容仍直接回答设置改变什么，不是需要另行退回的结构问题。
- 工作 H1 不能代替锁后 SEO Title；当前 Title/Description 仍是 UNVERIFIED。

### 7.3 中文自然度

整体为自然简体中文，英文只保留游戏设置、页面名、商品名和必要 URL。`Profit Margin`、普通/100%、受影响/不受影响、指定商品、固定类别等术语稳定；表格、示例和步骤分别承担查表、验证和操作功能。`不在清单中的价格先标记为待核验`、`缺少平台或版本证据时停在这条文档化路径上`等句子是明确安全动作，不是翻译腔或流程泄漏。

## 8. 两个图位、平台/版本边界和下游未验证项

| 图位 | 位置 | 语义结果 |
|---|---|---|
| `fig-01-price-boundary` | C:46–50，价格矩阵/示例后、H2-4 前 | PASS（语义）；将选定缩放价格与来源明确列举的固定类别分开，含 Wheat 25g→6g 和 Crab Pots 1,500g；alt/caption 没有把全商店写成固定。 |
| `fig-02-advanced-options-path` | C:97–101，有序路径后、创建前三项清单前 | PASS（语义）；展示新建游戏→扳手/高级设置→Profit Margin→四档→创建，且说明是平台中立示意而非实机截图。 |

平台/版本边界：

- C:86、C:90–93 只写公开 Wiki 记录的高层路径。
- C:95 明确 PC、主机、移动端的按钮位置、标签和版本行为不能被写成完全一致。
- C:101 的图注重复平台安全限制。
- C:105 在找不到选项时要求回到新游戏/新农场、当前平台/版本和公开说明；没有猜旧存档修改方式。

以下均未在本任务验证，必须保持 **UNVERIFIED**：

- 实际 `.webp`/同名 `.avif`、1672×941、16:9、图 WebP ≤400 KiB、`PublicPicture` 绑定、alt/caption 装配、权利/制作记录。
- 页面 route、BlogPostMeta、最终 SEO Title/Description、canonical、hreflang、Article JSON-LD、静态输出。
- Next build、TypeScript、Vitest、dev server、桌面/移动 ego-browser、可访问性、部署、生产 HTTP、收录和排名。

本 E 只审核正文语义和公共来源，不能把语义图位当成真实媒体，也不能把正文 PASS/REVISE 当成页面发布状态。

## 9. V7 22 条 anti-slop 逐项审核

规则依据：V7 `参考规则/22条鉴文规则.md`。`PASS` 表示当前稿没有达到该条问题门；`N/A` 表示该条不适用于本篇机制解释型正文，并非漏检。

| # | 结果 | 当前 C 证据与判断 |
|---:|---|---|
| 1 | PASS | C:44、C:105 只保留会影响价格归类和设置入口的例外/失败分支，没有堆无关假想反驳。 |
| 2 | PASS | C:3–113 的背景、术语、数字都服务“理解、选择、设置 Profit Margin”；没有因为研究材料完整就加入赚钱路线或计算器。 |
| 3 | PASS | C:11–16、C:28–30、C:56–60、C:90–93 的平行结构分别承担表格查阅、范围对照、条件选择和操作步骤；不是只换词的连续句。 |
| 4 | PASS | 未见“虽然……但是……”机械重复；取舍在多人/挑战/平台限制处各自承担不同判断。 |
| 5 | PASS | `Profit Margin`、档位、受影响/固定类别、Advanced Options 等正式术语保持一致，没有为同一功能反复造名。 |
| 6 | N/A | 本文是机制解释和设置选择文，没有亲历故事或情绪曲线可冒充。 |
| 7 | PASS | C:44、C:95、C:105 以具体价格/平台条件表达风险，没有声称所有读者都持有某种错误。 |
| 8 | PASS | C:5、C:22、C:34、C:50、C:64、C:68、C:74、C:95、C:101、C:113 的否定/对照各服务定义、边界、例子或安全限制；仅 C:113 有一次“不是……而是……”式收束，未形成高密度模板。 |
| 9 | PASS | C:44 对未归类价格保留待核验；C:95、C:101、C:105 对未逐平台/版本项明确止步，没有把不确定 UI 写成确定事实。 |
| 10 | PASS | C:18 的截断/1g、C:34 的 Wheat、C:40 的 Crab Pots 均可由公开页面复核；没有无来源的时间、收益或性能精确承诺。 |
| 11 | N/A | 没有“我曾失败”“我们测试过”等个人脆弱经历。 |
| 12 | PASS | C:84–105 的路径限定新农场，包含平台/版本前提和找不到选项时的停止分支，没有把步骤写成旧档万能修复。 |
| 13 | PASS | C:44、C:82、C:105、C:113 的结尾分别完成待核验、预算、停止或创建前判断，没有每段强行升华。 |
| 14 | PASS | 正文混用定义段、表格、数字示例、有序步骤和清单；平行格式都有查阅或操作功能。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 的建议都附人数、节奏、约束或预算条件，没有以“感觉”替代论证。 |
| 16 | PASS | C:5 位于 H2-1 后第一段，直接给出设置定义、四档和非全局边界，没有先写痛点、CTA 或空泛承诺。 |
| 17 | PASS | 未命中“值得注意”“事实上”等填充式连接词；转折和条件词均承担逻辑。 |
| 18 | PASS | 同一设置、倍率和按钮名称保持稳定，没有为追求变化而切换同义词。 |
| 19 | PASS | 简体中文句式自然；英文只保留必要的游戏/页面/商品名，没有逐句英文模板或明显翻译腔。 |
| 20 | PASS | Wheat 和 Crab Pots 被写作公开页面示例，并未包装成作者亲测、客户案例或虚构实验。 |
| 21 | PASS | 结尾 C:109–113 是创建前检查和游戏经济边界，没有通用祝福或转化口号。 |
| 22 | PASS | C:113 回到创建前的具体游戏设置判断，没有升到现实商业、人生或宏大价值结论。 |

### 六类形式指纹

- 破折号：PASS；正文没有密集破折号链，C:123 的 `Multiplayer — Profit margins` 属于公开来源标题。
- 粗体：PASS；仅用于图位/alt/caption 标签和 C:86 路径强调，没有把普通句子装饰成模板。
- 无用装饰符号：PASS；无 emoji、装饰分隔或营销符号，表格/列表都有信息用途。
- 助手残留：PASS；正文未见 SERP/PAA、角色、调度、代理、私有路径或凭据。
- 填充短语：PASS；未见空洞连接词成群或泛泛积极结尾。
- 泛泛积极结尾：PASS；正文以创建前检查结束。

## 10. 流程泄漏、私有路径和静态卫生

当前正文定向泄漏扫描无匹配；`rg` 退出码 1 在此表示没有输出，不是未执行。扫描覆盖：`dispatch`、`worker`、`SERP`、`PAA`、`docs/blog-ops`、`/Users/`、本地服务地址、token/password/secret 等关键词。

```text
rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.0\\.0\\.1|token|password|secret' ...
exit=1；无输出
```

结构扫描命中仅为读者正文预期的 H1/H2、公开 Multiplayer/Options、Checked、内链和两个图位：

```text
rg -n '^# |^## |部分商店商品|来源列举的不受影响商店商品|Multiplayer|Checked|/zh/how-to-earn-money-stardew|fig-01|fig-02' ...
exit=0；命中 C:1、3、5、9、18、24、26、38、46、48、52、68、70、84、97、101、115、117–124 等预期位置
```

静态检查：

```text
git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=0；无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
exit=1；无尾随空白命中
```

当前 C 是共享工作区中的未跟踪输入；未使用 `git diff --check` 的空输出冒充正文内容审查。正文未被本任务修改；唯一新增写入是本 `E-zh-final-review-v3.md`。

## 11. 与共享目录中后续 D-v3 结论的差异

本任务执行期间共享目录出现了 `D-zh-final-check-v3.md`，其绑定同一当前 C SHA `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9` 并给出正文 PASS。本 E 已读取该文件，但没有把其 PASS 当作替代证据：D-v3 复核了 C:38/C:48，却没有处理 C:111 的未限定“商店、建筑、升级”措辞。

因此，本报告保留独立 E 的 **REVISE**：C:111 的范围风险必须先收窄，再以修复后的新 SHA 重新结算 D/E。该差异是新增的精确行号审查，不是对 C:38、C:48、C14、C26、Sources 或 C70 结论的否定。

## 12. 最终结算

**当前 C-zh 正文：REVISE。**

只需先修复 C:111 的固定商店范围限定：

```text
不缩放的商店、建筑、升级和任务金币奖励
```

改为：

```text
来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励
```

修复后重新计算 C SHA，并重跑 D/E 的 V7、事实边界、引用邻近、ReaderTask、22 条鉴文和静态检查。C14、C26、Sources、C70、D-zh v2 R-1 的 C:38/C:48 当前已逐项复核通过；它们不能替代 C:111 修复后的新版本审核。

页面 Title/Description、真实媒体、页面装配、构建、浏览器和部署仍为 **UNVERIFIED**，不能由本正文报告代签。
