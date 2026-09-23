# E-zh 最终独立审核 v4 — REVISE（当前 C-zh 正文）

审查日期：2026-09-23（Asia/Shanghai）。

审查对象：`docs/blog-ops/profit-margin-stardew/C-zh-draft.md`。

本报告是独立 E 审核：重新读取当前 C-zh、A-zh 研究、B-zh 布局、D-zh 检查、旧 E 报告、Project interface spec、V7 正文计数脚本、V7 22 条鉴文规则，并在 2026-09-23 重新只读回读公开来源。只写入本报告，不修改 C-zh 正文、研究/布局/检查文件、页面源码、媒体、配置、依赖、数据库或外部服务。

## 1. 结论

**REVISE。** 当前 C-zh 的 SHA 绑定、V7 长度门、Sources/图位排除、C38/C48/C111 固定类别边界、C14、C26、Sources、C70、事实/公式/表格数字、来源邻近性、唯一 ReaderTask、搜索意图、图位语义、平台/版本边界和静态泄漏均通过；但 C:18 的“**四档名称相同**”不是清楚或正确的中文机制表述，既与前文的四个不同档位名称不一致，也无法说明其与后半句的逻辑关系。

最小正文修订只需把 C:18 的该句改成清楚的倍率判断，例如：

```text
四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
```

同一轮可将 C:13–16 的“按……读取”统一润色为“按……计算”；这属于自然度/精确度改进，不是新的事实或公式问题。修订后必须重新计算 C SHA，并重新跑 D/E；在新 SHA 产生前，本报告不能改写为当前正文 PASS。

本报告没有发现新的机制、公式、价格数字、固定类别、来源范围、内链、图位职责或平台边界错误。页面 Title/Description、PublicBlogHandoff、真实媒体、页面装配、浏览器、构建、部署和生产状态仍为 **UNVERIFIED**。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| 当前 C 版本绑定 | PASS | 当前文件 SHA 为 `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007`；V7 的 `sha256_raw` 与 `sha256_nfc_lf` 相同。 |
| V7 zh-CN 正式长度 | PASS | `mechanical_units=2028`，达到 `required_floor=2000`；B-zh 目标区间为 2000–2300。 |
| Sources/图位排除 | PASS | 排除 `Sources` 的正式值 2028；不排除 Sources 的对照值 2097，差值 69；两组 `>` 图位 blockquote 不进入正文提取。 |
| C38/C48/C111 固定类别边界 | PASS | 三处均保留“部分/来源列举”限定；没有残留旧的未限定“商店、建筑、升级”写法。 |
| C14/C26/Sources/C70 与旧 R-1 | PASS | C14、C26、C117–124、C70 均逐项复核；D/E 旧 SHA 不代替本次证据。 |
| 事实、公式、表格数字 | PASS | 四档、倍数、截断/1g、Wheat 25g→6g、Crab Pots 1,500g、多人再平衡和新农场高层路径均与公开页面一致。 |
| 中文自然度 | **REVISE** | C:18 的“**四档名称相同**”语义不成立/不清楚；C:13–16 的“读取”另有可选自然化建议。 |
| 唯一 ReaderTask/搜索意图 | PASS | 全文围绕理解、选择并在新农场设置 Profit Margin；没有扩成赚钱路线、计算器、Mod 或旧档教程。 |
| 22 条 anti-slop | **REVISE（仅第 19 条）** | 其余 21 条通过或按体裁 N/A；第 19 条被 C:18 的不自然/不精确表述阻塞。 |
| H1/结构/表格 | PASS | 1 个 H1、6 个 H2、12 个 H3、3 张结构完整的表格；Sources 在文末。 |
| 两个图位 | PASS（语义）/UNVERIFIED（资产） | 位置、职责、alt/caption 和平台安全边界通过；实际图片、绑定、尺寸、格式、权利和渲染未验。 |
| 页面 SEO/构建/浏览器/部署 | UNVERIFIED | 本任务未执行页面装配、Next build、typecheck、Vitest、ego-browser、部署或生产回读。 |

## 2. 版本绑定和输入

| 输入 | SHA-256 |
|---|---|
| 当前 `C-zh-draft.md` | `e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007` |
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| `D-zh-final-check-v3.md` | `3364c3601d172e7b308fd9f6a32345cfde37d9c14d5b480a1452c6d847f11a82` |
| `E-zh-final-review-v3.md` | `1ed089245c7ff1379d1846b69814ec291c39fd5c78607c778642c53ca9bc4d56` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647b86fc7a7e2bd92a1b9623775` |
| V7 `22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| V7 `正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |

旧 D-zh v3 与 E-zh v3 绑定的是旧 C SHA `128f1102bf28df54607de646762af59efa12621e27681b2d9f473812c5fe9ec9`；本报告重新对当前 `e591...0007` 计数和审阅，没有把旧报告结论当作当前版本证据。

## 3. V7 计数、Sources 和图位排除

### 3.1 当前 SHA 和正式计数

实际命令：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

当前输出的关键字段：

```json
{
  "mechanical_units": 2028,
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
  "sha256_raw": "e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007",
  "sha256_nfc_lf": "e5915bc1e05f38a19fa53e25184655dbc15ff4781ce5f6402504d42ecc370007"
}
```

脚本的 `requires_independent_review` 仍是保守语义字段，不是失败；本 E 负责独立语义审核。2028 落在 B-zh 要求的 2000–2300 区间内。

### 3.2 Sources 和 figure blockquote

不排除 Sources 的同脚本对照值为 `mechanical_units=2097`；正式值与对照值差 69，证明 `Sources` 没有被计入正式正文门。C:115–124 是 Sources；V7 以 `--exclude-heading Sources` 排除该节。

C:46–50 的 `fig-01-price-boundary` 和 C:97–101 的 `fig-02-advanced-options-path` 都是以 `>` 开始的 blockquote。V7 脚本将 `>` 行归为 `non_body`，因此 alt/caption/图位标签不会被计入 2028；C:90–93 的步骤和 C:109–111 的清单属于正常正文列表，会计入正式值。正式门不应改用把 Sources、alt 或 caption 加回去的数字。

## 4. 固定类别边界与此前风险逐项复核

| 项目 | 结果 | 当前正文证据 |
|---|---|---|
| C:38 标题 | PASS | `不会变化的范围：部分商店商品、建筑、工具升级和任务奖励`；已收窄，不再概括所有商店。 |
| C:48 Figure 1 alt | PASS | 使用 `来源列举的不受影响商店商品、建筑、升级和任务金币奖励`；没有写成“保持不变的商店费用”。 |
| C:111 创建前清单 | PASS | 使用 `来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励`；旧 E-zh v3 的残留 R-1 已修复。 |
| C:14 卖价/种子措辞 | PASS | 写成 `受影响的卖价与列出的种子价格都会降低`；没有把降低的种子价格写成支出变高，也没有承诺净利润。 |
| C:26 引用邻近性 | PASS | 价格矩阵前直接链接 `Multiplayer#Profit_margins`，并写明“大多数/指定商品”不能扩写成所有商店统一缩放。 |
| C:117–124 Sources | PASS | Checked 日期为 2026-09-22；英文 Options/Multiplayer 与中文 Options/Getting Started 均列出公开页面。 |
| C:70 中文内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现 1 次，仅作第一年预算背景补充。 |
| D-zh v2 R-1 C:38/C:48 | PASS | 两处旧风险均已收窄；当前 C:111 也已同步使用来源限定。 |

C:5 的“不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化”是否定全局同倍率，不等于断言所有商店固定；C:26、C:30、C:40、C:44、C:48、C:111 的组合边界一致。

## 5. C:18 中文自然度阻塞项

当前原文：

```text
C:18：英文 Options 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档名称相同，不代表每个商品都属于受影响范围。
```

`四档名称相同` 有两个可验证问题：

1. 前文 C:9–16 已列出四个不同档位名称/数值：普通/100%、75%、50%、25%；“名称相同”与该表述冲突。
2. 该短语没有清楚说明“倍率规则”与“受影响类别”之间的关系，读者无法确定“相同”指名称、规则、商品类别还是 UI 标签；它不是公开来源中的机制术语。

最小、无新增事实的修订为：

```text
四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
```

C:13–16 另有轻微用词问题：`受影响价格按四分之三读取`、`按一半读取`、`按四分之一读取` 中的“读取”不像价格计算动作。建议改为 `按受影响价格的四分之三计算`、`按受影响价格的一半计算`、`按受影响价格的四分之一计算`。这不是新的事实风险，但与 C:18 一起修订可避免中文读者误解。

## 6. 事实、公式、表格、来源日期和引用邻近性

### 6.1 公开来源 2026-09-23 只读回读

本次重新回读五个公开 URL；HTTP 200 和关键页面文本命中如下。页面修改日期来自各页公开的 `article:modified_time`/页脚信息；C 正文 Sources 中的 `Checked 2026-09-22` 是正文自身的历史检查标签，本报告的当前回读日期为 2026-09-23。

| 页面 | HTTP/最终地址 | 页面修改日期 | 当前回读关键文本 |
|---|---|---|---|
| 中文 Options | 200；`https://zh.stardewvalleywiki.com/%E9%80%89%E9%A1%B9` | 2026-05-12T05:13:27Z | 利润率、普通/75%/50%/25%、扳手 |
| English Options | 200；`https://stardewvalleywiki.com/Options` | 2026-03-16T18:11:24Z | Profit Margin、sale/seed multiplier、fractional、1g |
| Multiplayer | 200；`https://stardewvalleywiki.com/Multiplayer#Profit_margins` | 2026-08-15T18:58:01Z | Wheat、Pierre、Grass Starter、Crab Pots、quest gold |
| Getting Started | 200；`https://stardewvalleywiki.com/Getting_Started` | 2026-08-16T05:44:15Z | wrench、Advanced Options、changing the profit margin |
| 站内第一年赚钱页 | 200；`https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew` | 未作为机制来源 | 中文“第一年/赚钱”页面文本可达；只读内链可达性，不代签页面装配。 |

### 6.2 C 主张逐项核对

| 主张 | C 位置 | 结果 | 当前核对 |
|---|---:|---|---|
| 四档普通/100%、75%、50%、25% | 9–18 | PASS | 中文/英文 Options 和 Multiplayer 均列出四档。 |
| Profit Margin 是售出物品/种子价格倍数，不是现实净利润比例 | 5、18、22 | **REVISE 仅因 C:18 末句** | 倍数和现实会计区分有来源；末句“名称相同”需改为清晰的倍率/类别边界表述。 |
| 小数截断为整数、最低 1g | 18、34 | PASS | English Options 支持截断和 1g 下限；正文没有写成四舍五入。 |
| Wheat 普通 25g、25% 显示 6g | 34、50 | PASS | Multiplayer 当前页面直接给出 6g 而非 25g；正文没有外推为所有商品的数字。 |
| 受影响范围 | 26、30、34–36 | PASS | 使用“多数出售物品”“Pierre 种子”“指定 Joja 商品”，没有扩写成全部出售物品/购买价。 |
| 不受影响范围 | 30、38、40、44、48、111 | PASS | 精确保留铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励，并保留来源/部分限定。 |
| Willy 的 Crab Pots 为 1,500g | 40、50 | PASS | Multiplayer 当前页面仍给出该固定价格对照。 |
| 多人降低档位用于生产力再平衡 | 54、59、68 | PASS | 页面支持再平衡理由；正文没有造人数对应表、固定收益或完成时间。 |
| 新农场设置入口 | 84–105 | PASS（文档路径） | 中文 Options、English Options 和 Getting Started 支持高层路径；C:95/C:101/C:105 明确未逐平台实测。 |

### 6.3 表格和结构数字

- C:11–16：3 列、四个档位行；倍率逻辑一致。
- C:28–30：2 列影响范围矩阵；右列保留来源列举类别。
- C:56–60：3 列条件选择表；单人、多人、挑战均没有普遍最佳值或固定难度分数。
- C:34 的 Wheat 25g→6g 与 C:40/C:50 的 Crab Pots 1,500g 没有数字冲突。
- 当前共有 1 个 H1、6 个 H2、12 个 H3；没有 H4 跳级。

### 6.4 引用邻近性

- C:5 的中文 Options 链接承接中文术语/四档，Multiplayer 链接承接非全局边界。
- C:18 的 English Options 链接紧邻倍数、截断和 1g 下限；修订只改变中文末句，不改变来源绑定。
- C:26 的 Multiplayer 链接紧邻矩阵和“不能扩写成所有商店”的限制。
- C:68 的 Multiplayer 链接紧邻多人生产力再平衡。
- C:86 的中文 Options 与 Getting Started 链接紧邻新农场路径。
- C:117–124 的公开 Sources 列出四个 Wiki 页面和 Checked 日期；没有私有研究来源。

## 7. ReaderTask、搜索意图、H1、图位和平台边界

### 7.1 唯一 ReaderTask

B-zh 的 ReaderTask 是：理解新农场 Profit Margin 改变哪些价格、哪些成本/奖励不跟着变，根据单人/多人/挑战目标选择四档，并在创建新农场时找到设置入口。当前 C 的顺序仍为：

1. C:3–7 直接定义设置及非全局边界；
2. C:9–22 解释四档、倍数、截断/1g 和 75% 问题；
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支处理范围；
4. C:52–82 按单人、多人、挑战目标条件化选择；
5. C:84–105 给新农场高层设置路径、平台/版本限制和找不到选项时的停止分支；
6. C:107–113 用创建前三项检查收束。

没有加入作物收益计算器、泛赚钱路线、Mod、旧存档 XML/跨平台修复、固定进度或金币预测。C:70 的站内内链只出现一次，不产生第二 ReaderTask。

### 7.2 H1 和中文表达

C:1 是唯一 H1，与 B-zh 工作 H1 一致。中文整体为自然简体中文，英文只保留游戏设置、公开页面名、商品名和必要 URL；术语 `Profit Margin`、受影响/不受影响、指定商品、固定类别保持稳定。当前阻塞不是翻译腔扩散，而是 C:18 一个可定位的“名称相同”表述错误；修订后再结算中文自然度。

### 7.3 两个图位

| 图位 | 位置 | 结果 |
|---|---|---|
| `fig-01-price-boundary` | C:46–50，价格矩阵/示例后、H2-4 前 | PASS（语义）；将会缩放价格与来源列举的固定类别分开，含 Wheat 25g→6g、Crab Pots 1,500g。 |
| `fig-02-advanced-options-path` | C:97–101，有序路径后、创建前三项清单前 | PASS（语义）；展示新建游戏→扳手/高级设置→Profit Margin→四档→创建，并明确是平台中立示意。 |

实际 `.webp`/同名 `.avif`、1672×941、≤400 KiB、`PublicPicture` 绑定、权利记录、图内文字、移动端可读性和实际渲染均未核验，保持 **UNVERIFIED**。

### 7.4 平台/版本边界

C:86、C:90–93 只写公开 Wiki 的高层路径；C:95 明确 PC、主机、移动端的按钮位置、标签和版本行为不能写成完全一致；C:101 图注重复该限制；C:105 在找不到入口时要求回到新游戏/当前平台/版本和公开说明，不猜旧存档修改方式。该边界通过。

## 8. V7 22 条 anti-slop 独立逐项审核

规则依据：V7 `参考规则/22条鉴文规则.md`。`PASS` 表示当前稿未触发该问题门；`N/A` 表示该机制解释型体裁没有相应素材，不是漏检。

| # | 结果 | 当前 C 证据与判断 |
|---:|---|---|
| 1 | PASS | C:44、C:105 只保留影响价格归类/设置入口的真实例外和停止分支。 |
| 2 | PASS | C:3–113 的知识都服务理解、选择、设置 Profit Margin；没有把研究材料全部输出。 |
| 3 | PASS | C:11–16、C:28–30、C:56–60、C:90–93 的平行结构分别服务查表、边界、条件选择和操作。 |
| 4 | PASS | 未见“虽然……但是……”机械重复；条件取舍位于各自实际选择场景。 |
| 5 | PASS | 正式术语稳定；没有反复为同一功能造名。 |
| 6 | N/A | 没有亲历故事或冒充真实经历的情绪曲线。 |
| 7 | PASS | 以具体价格、平台和设置条件说明风险，没有声称所有读者都犯同一错误。 |
| 8 | PASS | 否定/对照句服务现实会计区分、价格边界、平台限制或不作进度承诺；没有形成空洞二元模板。 |
| 9 | PASS | 未归类价格、未逐平台 UI 和版本行为均保留待核验/停止分支；已核实事实没有人为加疑虑。 |
| 10 | PASS | 精确数字均有 Options/Multiplayer 来源或透明算术；没有无来源的时间、收益、性能数字。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等个人脆弱经历。 |
| 12 | PASS | C:84–105 将步骤限定为新农场并保留平台/版本前提，不写旧档万能修复。 |
| 13 | PASS | C:44、C:82、C:105、C:113 各自完成待核验、预算、停止或创建前判断，没有段段升华。 |
| 14 | PASS | 定义段、表格、数字例子、步骤和清单承担不同信息功能。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 的建议带人数、节奏、约束或预算条件。 |
| 16 | PASS | C:5 位于首个 H2 后并直接回答设置定义、四档和非全局边界。 |
| 17 | PASS | 未见“值得注意”“事实上”等无功能填充词成群出现。 |
| 18 | PASS | `Profit Margin`、档位、Wheat、Crab Pots、扳手/高级设置名称保持稳定；C:18 是表述错误，不是同义替换漂移。 |
| 19 | **REVISE** | C:18 的“**四档名称相同**”不自然且语义不精确；需改为明确的倍率/类别关系。 |
| 20 | PASS | Wheat 和 Crab Pots 明确作为公开页面示例，没有包装成作者亲测或客户案例。 |
| 21 | PASS | 结尾是创建前检查，不是通用祝福或转化口号。 |
| 22 | PASS | C:113 回到具体游戏经济前提，没有升到现实商业、人生或宏大结论。 |

### 六类形式指纹

- 破折号：PASS；正文没有密集破折号链，Sources 中的 `Multiplayer — Profit margins` 属于公开标题。
- 粗体：PASS；只用于图位/alt/caption 标签和路径强调。
- 无用装饰符号：PASS；无 emoji、装饰分隔或营销符号，表格/步骤均有信息用途。
- 助手残留：PASS；没有 SERP/PAA、角色、调度、代理、私有路径或凭据。
- 填充短语：PASS；未见空洞连接词成群。
- 泛泛积极结尾：PASS；正文以创建前检查结束。

## 9. 流程泄漏、私有路径和静态卫生

当前正文的必要扫描均无命中：

```sh
rg -n -i 'dispatch|worker|SERP|PAA|docs/blog-ops|/Users/|localhost|127\\.\\.0\\.0\\.1|token|password|secret' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|Agent[ -]?[A-G]|\\b(role|worker|coordinator|dispatch|handoff|assembly|bodyHash|mechanical_units|PublicReference|editor appendix|task card|internal)\\b|A-zh|B-zh|C-zh|D-zh|project-interface|任务卡|调度|代理回执|私有路径|/Users/|/home/|file://|localhost|127\\.0\\.1|\\.codex|\\.hermes|docs/blog-ops|node_modules|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无尾随空白命中

git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出
```

C 是共享工作区中的未跟踪文件；额外执行 `git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md` 时 exit=1 仅表示 `/dev/null` 与正文存在内容差异，命令无空白诊断输出，不能把该 exit=1 当成正文失败。

## 10. 范围结算

**当前 C-zh 正文：REVISE。** 阻塞项只有 C:18 的“**四档名称相同**”表述；C:13–16 的“读取”建议与其同轮润色。C38、C48、C111、C14、C26、Sources、C70、事实/公式/表格、来源/日期、唯一 ReaderTask、图位语义、平台/版本边界、22 条中的其余项目和静态卫生均已通过。

修订 C:18 后必须：

1. 重新计算 `sha256sum`，不得沿用 `e5915bc1...0007`；
2. 重新执行 V7 `zh-CN --exclude-heading Sources` 计数，并重新确认 Sources/图位不计入正文；
3. 重新运行结构、C38/C48/C111、C14/C26/C70、来源邻近、流程泄漏、22 条鉴文和 `git diff --check`；
4. 由 D 先对新 SHA 检查，再由 E 对同一新 SHA 独立复核。

页面 Title/Description、真实图片、页面装配、Next build、typecheck、Vitest、ego-browser、部署、生产 HTTP、收录和排名仍为 **UNVERIFIED**，不能由本正文报告代签。
