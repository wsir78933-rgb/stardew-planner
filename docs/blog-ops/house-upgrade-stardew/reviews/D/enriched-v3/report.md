# D 独立英文写后检查报告：house-upgrade-stardew（丰富稿 draft-v3，第 2 轮审核）

- **角色**：D（独立英文写后检查）。独立会话，与 A、B、C、E、F、T、G 均不相同。
- **任务 ID**：`task_4e791741e19a`
- **Dispatch ID**：`ctx_700b8209e3d4`
- **终端 Handle**：`term_2a5ef0fc-67a4-4dca-800e-519667527c13`
- **协调者 Handle**：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **审核日期**：2026-10-16
- **依据标准**：
  - `/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`
  - `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` 第五节五项质量门之“前三门”（ResearchTrace、ReaderValue、Repetition）及“读者口吻”小节。
- **审核对象**：针对写手 C 在第 2 轮提交的最终丰富正文候选 `draft-v3.md`（SHA: `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`）及配套 JSON 文件，全量重跑 ResearchTrace / ReaderValue / Repetition 三门，不沿用旧 v2/v3 中间稿结论。
- **输入背景与协调决定**：依据协调者消息 `msg_8c8c7f57897d`，确认四输入真实哈希与文件名（`references.en.json` 真实文件为 `public-references.en.json`）；依据 `msg_741541b5415a`，知悉四行菜单标签维持删去，未经验证标签不进入正文；依据用户明确授权，本轮正文已并入材料准备、预算运算与房间用途丰富材料，严格遵守英文底线 >= 1000。
- **报告约束**：本报告仅输出“原句位置 + 问题类型 + 修改要求”，不提供替换 prose，不直接修改作者正文；不使用“建议”弱化真正阻塞；不签空 PASS；不代签下游 E 审核、F 长度门或页面装配。

---

## 一、审核结果总览

| 质量门 | 结果 | 阻塞问题数 | 详细结论与处理流向 |
|---|---|---:|---|
| **ResearchTrace** | **PASS** | 0 | 通过。全篇正文与媒体文本已彻底清除检索痕迹、内部路径、写作指令及五类编辑腔；四行未验证菜单标签未写回；合法公开引用与真正操作条件完整保留。 |
| **ReaderValue** | **PASS** | 0 | 通过。紧密围绕单一主任务 `house upgrade stardew` 展开，代入升级三档费用与工期、木材与硬木筹备、手头200木材预算核算、逐级累计预算、房间功能与用途、木匠店营业下单与装修区分六组核心读者场景全部走通，图文配合紧密，无多意图百科漂移。 |
| **Repetition** | **PASS** | 0 | 通过。逐段逐句全量比对，历史 D 提出的六项重复问题（RP-R1 至 RP-R6）均已彻底清除且无再现；费用表、运算预算与累计预算功能分明、无机械复述；图表与正文各司其职；结尾利落收尾于选择分支，无冗余总结或 FAQ。 |
| **三门综合结论** | **PASS** | 0 | **前三门全量审核通过**。移交下游独立审核者 Role E 进行八层独立鉴文与事实复核。 |

> [!NOTE]
> **共享修订预算说明**：本篇全流程共享最多 3 轮修订预算（含译文返修，不按角色重置）。第 1 轮已完成，第 2 轮正文已由 C 提交并由 D 复验通过（已用 2/3，剩余 1 轮）。本次 D 审核通过不消耗新的改稿轮次。

> [!IMPORTANT]
> **关于英文篇幅的性质说明**：英文当前机械字数 1166、剔除两行 `Schematic.` 图注后为 1113，均严格达到并超过 1000 词底线。依照 V7 规则，字数门（Length）在淬文阶段由独立角色 Role F 最终验收并签署，D 负责前三门语义审核，不能将本次语义 PASS 视为 Length 门 PASS。

---

## 二、被审文件与 SHA256 校验绑定

所有被审文件均位于工作树 `博客-2`（`/Users/wusir/orca/workspaces/stardew planner/博客-2`）内：

| 文件相对路径 | 字节数 | 行数 | SHA256 Checksum | 格式检查（UTF-8 / NFC / LF） | 校验状态 |
|---|---:|---:|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md` | 10,278 | 73 | `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 候选正文（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | 12,522 | 392 | `4f0e5a4800252baf5879996171e261878dd6bbb46e83d7a4f5828faea7ea7d0a` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 真实引用文件（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | 4,458 | 129 | `8a6e1ce5ad8c74440e6bc4854c3740079520420c784457cd26ea98e0d9621f7b` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 媒体文本（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json` | 6,921 | 130 | `c619f9f69b7c2e738424b242433cd91db866ade28278c218309c978b00c826d6` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 提交记录（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/revision-round-2.md` | 3,263 | 43 | `168792507d046a073c84a30fce4e4d08bd5313ec3a9c2b25b098f5f5a73f1586` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 返修记录（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/task-card.md` | 4,622 | 65 | `5d37bdadb1fb20b30d1fbe605b67cd9c169acaa810667b0548dc88fd74950668` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 丰富任务卡（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/writer-brief.md` | 16,894 | 162 | `0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 写作简报（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/media-plan.json` | 9,733 | 207 | `6359d95163dfec0ac889c61583a472fe61b53b7ee151eeb4a27bb02768d74a13` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 媒体规划（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/A/facts.json` | 34,063 | 460 | `618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 基础事实底座（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/material-preparation/facts.json` | 38,855 | 535 | `c180f0bf8b5eaf74de21a3999a646e19191064a01fe6d498c098ab56465d601d` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 材料准备事实底座（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/upgrade-planning/facts.json` | 33,849 | 467 | `397cc320f596d97e858809e688ba8f90d9db477236416f8cdd57fa1ed548026e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 规划事实底座（已纠正版，完全一致） |

- `media-text.en.json` 内 `bodySha256` 明确绑定：`8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`。
- `public-references.en.json` 内 `bodySha256` 明确绑定：`8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`。

---

## 三、真实验证执行与命令输出

独立执行日志记录于：`docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v3/checks.log`

### 1. 验证命令执行与退出码
- **执行命令**：`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md`
- **退出码**：`0`
- **真实输出**：
  ```json
  {
    "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md",
    "locale": "en",
    "mechanical_units": 1166,
    "required_floor": 1000,
    "meets_mechanical_floor": true,
    "long_form_target": 2000,
    "meets_long_form_target": false,
    "length_class": "short",
    "semantic_qualification": "requires_independent_review",
    "excluded_heading_sections": [],
    "omitted_line_counts": {
      "headings": 8,
      "code": 0,
      "excluded_sections": 0,
      "non_body": 35,
      "frontmatter": 0
    },
    "sha256_raw": "8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154",
    "sha256_nfc_lf": "8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154"
  }
  ```
- **剔除图注计数**：剔除两行以 `Schematic.` 开头的图注行后，机械计数为 `1113`（仍严格满足 `>= 1000`）。

### 2. Git 空白字符与格式检查
- **执行命令**：`git diff --check --no-index -- /dev/null docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md`
- **退出码**：`1`（表示与 `/dev/null` 存在差异输出，stdout 与 stderr 均为空，无 trailing whitespace、CRLF 或 mixed indent 错误）。
- **编码与换行**：UTF-8 编码，NFC 规范化一致，换行为标准 LF，文末有且仅有单换行符。

### 3. 图文位置与内容对齐核验
`media-text.en.json` 定义的 3 张图片：
1. `cover-payments`（role: cover）：定义完整，由页面头部模板渲染，不在 Markdown 正文体内直接引用。
2. `tier-rooms`（role: body）：正文第 45 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。放置于第 4 节 H2 `What the kitchen, nursery, and cellar are for` 内 Nursery 句后。
3. `upgrade-or-renovation`（role: body）：正文第 65 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。放置于第 6 节 H2 `A renovation is not the next upgrade` 开头。

### 4. 引用与主张映射核验
- `public-references.en.json` 包含 56 处引用映射，56 处 `quote` 均在 `draft-v3.md` 中完全精确存在（0 missing）。
- 全文无任何 `publicAllowed: false` 的内部事实泄漏，19 个 false 事实 ID 均未在引用或媒体文本中被引用。

---

## 四、第一门：ResearchTrace 全量检查（PASS）

### 1. 检查依据
依据 V7 02 第三节“读者口吻”与第五节“五项质量门”：
- 清除检索日志、助手残留、内部路径、写作指令。
- 清除五类编辑腔：
  1. **来源核查旁白**（如 documented、source-backed、wiki notes state 等）；
  2. **示例/实测免责**（如 This is a planning scenario, not a measured pacing result 等）；
  3. **图片自我说明**（如 This original character illustration accompanies 等）；
  4. **文章自指与范围声明**（如 This guide covers、in this article、the following table 等）；
  5. **验收词汇**（如 verify、readback、pass or revise 等）。
- 保护性保留：公开引用的描述性锚文本、真正影响操作的条件。
- 排除未验证 UI 标签：排除 `Shop`、`Upgrade House`、`Construct Farm Buildings`、`Leave` 等仅在 OBS-menu-image 出现的标签。

### 2. 逐项核验结果
- **类别 1（来源核查旁白）**：命中 0。全文所有链接均为标准的维基名词或页面描述性锚文本（如 `[Farmhouse]`、`[Version History]`、`[Carpenter's Shop]`、`[Axes]`、`[Wood]`、`[Hardwood]`、`[Large Stump]`、`[Large Log]`、`[Secret Woods]`、`[Cooking]`、`[Cask]`），无任何“据维基记载”、“来源已核对”等编辑性旁白。
- **类别 2（示例/实测免责）**：命中 0。第 21 行 `That figure is a count of harvests, not a calendar date.` 为读者解释计算单位（是采收次数而非游戏内日历天数），属于操作定义，无免责声明。第 27 行与第 37 行分别说明假设前提与操作注意（“手头已有200木材”、“不要一次支付75,000g或175,000g”），均直接面向玩家行为。
- **类别 3（图片自我说明）**：命中 0。第 47 行与第 67 行图注均以 V7 允许的单字短标签 `Schematic.` 开头，后文直接列出画面中的档位、房间名和流程标签，无“不代表游戏内画面”等否定式免责。
- **类别 4（文章自指与范围声明）**：命中 0。正文彻底排除了 `in this guide`、`this article`、`the following table`、`in this section` 等自指词。第 27 行的 `Use this bill` 指代计算账单，第 37 行的 `cost table` 指代第 1 节的升级费用表，第 43 行的 `On the room figure, the Nursery label is this crib room` 是写作简报明确要求连接图注标签与正文功能的必要说明。
- **类别 5（验收词汇）**：命中 0。无 `verify`、`readback`、`pass`、`check sources` 等动作要求读者执行。
- **未经验证 UI 词扫描**：第 55 行使用直接操作动词 `ask her to upgrade the farmhouse, and pay the gold and materials for your next tier`，未写入 `Shop`、`Upgrade House`、`Construct Farm Buildings` 或 `Leave` 菜单标签，严格遵守了协调决定 `msg_741541b5415a`。
- **助手与路径残留**：无任何内部路径、草稿说明或助手残留。

**结论**：**ResearchTrace PASS**，阻塞问题数：`0`。

---

## 五、第二门：ReaderValue 全量检查（PASS）

### 1. 检查依据
依据 V7 02：
- 对照用户原始关键词 `house upgrade stardew`、丰富任务卡与实际搜索依据，确认主意图为“准备木材与硬木、算出从初始农舍到目标档的预算，向 Robin 逐级购买原版农舍升级，并分清厨房、育儿空间、地窖各自能做什么，以及升级和即时装修是两种订单”。
- 确认没有为了产品推广或关联工具而并入多意图百科。
- 确认读者能够完成单一主任务。

### 2. 六组核心读者场景代入验证

#### 场景 1：三档升级费用、材料与工期基准（Cost Lookup & 1.6 Context）
- **第 1 档**：10,000g + 450 Wood，工期 3 天。
- **第 2 档**：65,000g + 100 Hardwood，工期 3 天。
- **第 3 档**：100,000g（无材料需求），工期 3 天。
- **1.6 版本差价说明**：第 11 行单句讲清第 2 档由旧版本的 50,000g + 150 Hardwood 调整为现行价格，解答了搜索旧攻略玩家的疑虑。
- **结论**：表格清晰，各档位读者能直接定位下一档购买条件。

#### 场景 2：木材与硬木筹备及秘密森林采收（Material Preparation & Secret Woods Route）
- **普通木材**：用开局斧砍成年树，或直接从罗宾普通存货购买。
- **硬木分类与工具**：明确将 Large Stump 与普通伐木树桩区分开；铜斧（2,000g + 5 铜锭）砍 Large Stump 得 2 硬木；钢斧（5,000g + 5 铁锭）砍 Large Log 得 8 硬木，且用于清理秘密森林入口圆木。
- **秘密森林路线与运算**：入口圆木清理后进入煤矿森林西北角；入口圆木产 8 硬木且不再生；林内 6 个大树桩每日再生，每日产 12 硬木（上区 4 个，穿过两条隐藏通道之一到达下区 2 个）；在无其他硬木来源且入口圆木已清的基准假设下，8 次采收得 96 硬木，剩余 4 硬木需 2 个树桩，因此在第 9 次采收完成 100 硬木储备。
- **适用边界**：钢斧仅是秘密森林路线的前提，并非第二档购买的全局绝对前提（其他农场自生大树桩等场景适用铜斧即可）。
- **结论**：硬木采收路径与数字极其严密，读者可直接照做。

#### 场景 3：手头已有 200 木材的第 1 年预算核算（200 Wood Deficit Budgeting）
- **核算情景**：第 1 年计划升第 1 档，箱中已有 200 木材。
- **计算逻辑**：所需 450 木材缺口为 450 − 200 = 250；第 1 年罗宾木材单价为 10g；补买 250 木材花费 250 × 10g = 2,500g；加上升级基本工费 10,000g，带上已有的 200 木材与 12,500g 金币前往即可。
- **对照分析**：若第 1 年 450 木材全买为 14,500g；手头已有 200 木材将其减少至 12,500g；若第 2 年全买则为 32,500g（单价涨至 50g）。罗宾普通存货仅出售 Wood，不出售 Hardwood。
- **结论**：算式详尽严密，有效指导读者在材料不齐时的带款规划。

#### 场景 4：从初始农舍到目标档的累计预算（Cumulative Budgeting from Starter House）
- **累计金额定义**：明确为从初始农舍逐级累加到目标档的总支出，并非单次下单金额，避免玩家误解。
- **累加结果**：
  - 到第 1 档：10,000g + 450 Wood。
  - 到第 2 档：10,000g + 65,000g = 75,000g，450 Wood + 100 Hardwood。
  - 到第 3 档：10,000g + 65,000g + 100,000g = 175,000g，450 Wood + 100 Hardwood。
- **操作警告**：明确提醒读者这是累加账单，升级斧头和买木材费用另计，在柜台处仍按费用表单次逐档支付，切勿一次支付 75,000g 或 175,000g。
- **结论**：解决“升满一共要多少钱”的宏观规划需求，且防范了误操作。

#### 场景 5：新空间功能与解锁用途（Room Features & Utilities）
- **第 1 档厨房与卧室**：厨房配灶台用于烹饪；冰箱提供 36 格储物并支持直接作为食材源（同时支持背包与迷你冰箱食材）；水槽可灌满喷壶；卧室单人床升级为双人床。
- **第 2 档房间与育儿**：厨房与卧室面积增大；新增一间空房间；新增育儿室（配婴儿床与两张儿童床，支持生养两个孩子）。
- **第 3 档地窖与陈酿**：厨房下方新增地窖；自带 33 个木桶（Cask），用于将酒类、奶酪、山羊奶酪、啤酒、蜂蜜酒和淡色麦芽酒陈酿以提升品质与价值；解锁木桶配方（20 木材 + 1 硬木）；明确木桶仅在地窖内接受陈酿物品；房屋外观与户外 9×5 占地均与上一档完全一致。
- **结论**：功能覆盖全面，纯粹交代空间实际用途，未掺入 189 布局、利润公式等无关旁支。

#### 场景 6：木匠店营业时间、下单规则与即时装修区分（Carpenter Ordering & Renovations）
- **下单地点与范围**：24 Mountain Road 木匠店，罗宾处办理。
- **营业时序**：常规周 9:00am–5:00pm；周二全天关闭（无法下单）；周五 4:00pm 提前打烊；9:00am–8:00pm 期间房屋大门虽开，但柜台关闭后进门无法下单。
- **工期规则**：每次农舍升级严格耗时 3 天，从付款当天算起到该档房间完工为止；付款当天新房间尚未完工。
- **即时装修（Renovations）区分**：
  - 解锁前提：第二档农舍升级完工后解锁。
  - 特征：下单即刻完成（Instant），无 3 天等待；拆除婴儿床（Remove Crib）免费；增加餐厅（Add Dining Room）花费 150,000g（新增 9×10 + 4×5 空间）；撤销装修全额退还金币，前提是扩建区域必须腾空。
  - 决策分流：要地窖选第三档升级（100,000g，等 3 天）；要拆床或加餐厅走即时装修。
- **结论**：地点、时间、工期与装修区分清晰透彻，可操作性极强。

### 3. 图表协同与无冗余边界
- **封面图（`cover-payments`）**：头部直观呈现三档费用与 3 天工期。
- **正文图 1（`tier-rooms`）**：在第 4 节呈现三档房间平面轮廓与 9×5 占地不变示意；正文段落则专注于冰箱格子、水槽灌水、双人床、育儿数量、木桶配方与陈酿品种等文字功能说明。
- **正文图 2（`upgrade-or-renovation`）**：在第 6 节开头呈现升级与装修的双分支决策树；正文段落详细解释腾空退款机制、免费与 150k 对比。
- **边界划分**：图表提供直观框架，段落提供行动条件与决策细节，各司其职，无功能越界。

**结论**：**ReaderValue PASS**，阻塞问题数：`0`。

---

## 六、第三门：Repetition 全量检查（PASS）

### 1. 检查依据
依据 V7 02：
- 段落、表格、图注不重复承担同一作用。
- 逐句比对新段落与原表、图、结尾，全面覆盖历史审查提出的重复隐患。
- 正确区分“相同事实不同作用”（如费用表提供单档查找，而手头 200 木材核算与累计预算提供具体场景的算式规划，不按关键词误判为重复）。

### 2. 历史 D 审查六大重复问题（RP-R1 至 RP-R6）复验核对

| 编号 | 历史问题描述（针对 draft-v2） | draft-v3 处置表现与核查事实 | 状态 |
|---|---|---|---|
| **RP-R1** | 第 19 行旧价 `50,000g and 150 Hardwood` 重复出现两次（第 1 句 from 分句与第 3 句整句）。 | 第 11 行保留单句：`In 1.6 the second house upgrade moved from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood ([Version History](https://stardewvalleywiki.com/Version_History)).`，原第 3 句 `Before 1.6, that upgrade cost...` 已彻底删除。该组旧价在全文仅出现一次。 | **已消除**（未再现） |
| **RP-R2** | 第 19 行在给出 1.6 改价后，再次指示读者 `bring 65,000g and 100 Hardwood` 构成动作重复。 | 该指示句已彻底删除。第 1 节段落仅陈述 1.6 改价历史，不重复发出带钱指令。 | **已消除**（未再现） |
| **RP-R3** | 第 25 行连续三句列出各档携带金额（`carry 10,000g... carry 65,000g... carry 100,000g`），重复费用表。 | 三句携带金额已彻底删除。第 3 节仅展开手头已有 200 木材时的补购算式（12,500g）及宏观累计预算（75,000g、175,000g），不重述单档携带清单。 | **已消除**（未再现） |
| **RP-R4** | 第 27 行营业时间中，普通工作日 9:00–17:00 与关门后至 20:00 仍能进门各重复说了两次。 | 第 57 行中，普通工作日时间仅在首句说明一次（`from 9:00am to 5:00pm`）；关门后可进门仅说明一次（`from 9:00am to 8:00pm while the shop is closed`），无任何重复复述。 | **已消除**（未再现） |
| **RP-R5** | 第 31 行在解释三天工期时，机械重复列举房间清单，并再次说明“stays on three days”。 | 第 61 行精简为两句：定义三天工期从付款到房间完成，以及付款当天房间未完工。未重复列举厨房、育儿室或地窖清单，亦无多余的“stays on three days”。 | **已消除**（未再现） |
| **RP-R6** | 第 33 行美人鱼吊坠句重复了表格中的“completed construction”与三天工期等待。 | 该吊坠时序句已彻底删除。正文未加入婚礼或吊坠分支。 | **已消除**（未再现） |

### 3. 全篇跨段落、跨表格、跨图注详细比对分析
- **引言段（第 1 行） vs 费用表（第 5–9 行）**：
  - 引言段遵循 V7 开头三句给出直接答案规范，概述三档费用、1.6 版本背景、3 天工期与下单地点；
  - 费用表提供结构化行级对齐数据，附带维基引用，二者定位清晰，互不替代。
- **费用表（第 5–9 行） vs 预算核算节（第 27–37 行）**：
  - 费用表展示罗宾单次升级收费基准；
  - 第 27–29 行解决“手头已有 200 木材时带多少钱”的缺口购买运算（250 × 10g + 10,000g = 12,500g）；
  - 第 35–37 行解决“从初始农舍升到目标档累计总共多少”的宏观规划（75,000g、175,000g），并明确警告不要单次交付该金额；
  - 三者属于“基准单价 vs 缺口运算 vs 宏观累计”，作用截然不同，完全符合质量门对“相同事实不同作用”的界定。
- **图 1（`tier-rooms`） vs 第 4 节房间用途说明（第 41–51 行）**：
  - 图 1 及其图注仅承担房间结构与 9×5 户外占地示意；
  - 第 4 节文字详细阐述各房间的实际功能与机制（烹饪台、36 格冰箱、喷壶灌水、双人床、双子育儿、33 木桶陈酿与配方）；正文未重复图注中的标签清单，图文各司其职。
- **图 2（`upgrade-or-renovation`） vs 第 6 节装修规则（第 69–73 行）**：
  - 图 2 及其图注提供二档后升级与装修的双分支逻辑对照；
  - 第 6 节文字交代即时生效、腾空全额退款、拆除婴儿床免费、加餐厅 150k 等实操条件，并在文章末尾以清晰的选择指引干净收束。
- **无多余总结与 FAQ 模块**：文章在最后一个有效决策判断（第 73 行）处自然收尾，未添加任何换词复述前文的总结段或冗余 FAQ。

**结论**：**Repetition PASS**，阻塞问题数：`0`。

---

## 七、共享修订预算与下游交接

### 1. 共享修订预算状态
- 全流程整篇文章共用最多 3 轮修订预算（含译文返修，不按角色重置）。
- 本篇历史执行：
  - 第 1 轮返修：由 Role C 在 draft-v1 基础上完成 draft-v2，消耗 1 轮。
  - 第 2 轮返修：由 Role C 在 enriched-brief 指引下完成合并丰富候选稿 `draft-v3.md`。
  - 本次审核：Role D 对 `draft-v3.md` 进行独立全量三门复审，**三门均已全量通过，阻塞问题数为 0，不消耗新的改稿轮次**。
- 当前预算结余：**已用 2 轮，剩余 1 轮**（留供后续必要返修或译文检查使用）。

### 2. 下游交接与角色权限边界
- **流向**：本报告签署三门全部 PASS 后，英文丰富候选版本 `draft-v3.md` 正式移交**独立审核者 Role E**。
- **下游职责说明**：
  - 由 Role E 依据 `22条鉴文规则` 独立开展八层独立鉴文、事实复核与引用验证。
  - 随后由 Role F 进行淬文并正式签署字数门（Length）及标题生成。
- **权限边界声明**：Role D 严格限定于独立英文写后检查（ResearchTrace、ReaderValue、Repetition 三门），**严禁且未代签 Role E 审核、Role F Length 门或页面装配**。

---

## 八、绑定哈希与原始数据确认

- **正文候选文件**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md`
  - **SHA256**：`8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`
- **公开引用文件**：`docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json`
  - **SHA256**：`4f0e5a4800252baf5879996171e261878dd6bbb46e83d7a4f5828faea7ea7d0a`
  - **绑定的 bodySha256**：`8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`
- **媒体文本文件**：`docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json`
  - **SHA256**：`8a6e1ce5ad8c74440e6bc4854c3740079520420c784457cd26ea98e0d9621f7b`
  - **绑定的 bodySha256**：`8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`
- **作者提交记录**：`docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json`
  - **SHA256**：`c619f9f69b7c2e738424b242433cd91db866ade28278c218309c978b00c826d6`
- **验证命令退出码**：`0`
- **验证日志文件**：`docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v3/checks.log`
