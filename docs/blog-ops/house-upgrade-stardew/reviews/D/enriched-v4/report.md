# D 独立英文写后检查报告：house-upgrade-stardew（丰富稿 draft-v4，第 3 轮全量复验）

- **角色**：D（独立英文写后检查）。独立会话，与 A、B、C、E、F、T、G 及协调者均不相同。
- **任务 ID**：`task_adcb9ed3b0a8`
- **Dispatch ID**：`ctx_d8a5c8eae7b1`
- **终端 Handle**：`term_a0466fcc-d9a9-442b-9c03-817e8a40f180`
- **协调者 Handle**：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **协调者授权与输入确认**：已收到协调者消息 `msg_02f45037a94a`，确认写手 C 已交付最终 `draft-v4` 并结算释放，确认四输入真实 SHA-256，授权本 D 对最终 `draft-v4` 全量重跑三门复验。
- **审核日期**：2026-10-16
- **依据标准**：
  - `/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`
  - `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` 第五节五项质量门之“前三门”（ResearchTrace、ReaderValue、Repetition）及第三节“读者口吻”小节。
- **审核对象**：写手 C 在第 3 轮提交的最终丰富正文候选 `draft-v4.md`（SHA: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`）及配套 JSON 文件。全量重跑 ResearchTrace / ReaderValue / Repetition 三门，严格独立核查，不沿用 v3 旧 PASS。
- **核查原始资料对照依据**：
  - `docs/blog-ops/house-upgrade-stardew/research/upgrade-planning/sources/01-wiki-farmhouse.json`（Notes 与 upgrade 行）
  - `docs/blog-ops/house-upgrade-stardew/research/upgrade-planning/sources/02-wiki-carpenters-shop.json`（Shop Closure 与 Hours）
  - `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/wood-wikitext.json`（Felling tree 与 stump 规则）
  - `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/large-stump-rendered.txt`（Large Stump 规则）
- **报告约束**：本报告仅输出“原句位置 + 问题类型 + 修改要求”，不提供替换 prose，不直接修改作者正文；不使用“建议”弱化真正阻塞；不签空 PASS；不代签下游 E 审核、F 长度门或页面装配。

---

## 一、审核结果总览

| 质量门 | 结果 | 阻塞问题数 | 详细结论与处理流向 |
|---|---|---:|---|
| **ResearchTrace** | **PASS** | 0 | 通过。全篇正文与媒体文本已彻底清除检索痕迹、内部路径、写作指令及五类编辑腔；四行未验证菜单标签未写回；合法公开引用与真正操作条件完整保留。 |
| **ReaderValue** | **PASS** | 0 | 通过。紧密围绕单一主任务 `house upgrade stardew` 展开，6 组核心读者场景全部走通。特别核实 E 在 v3 提出的 6 处问题已全部精准修复：14,500g/32,500g 明确为工费+木材合计、每天 9–20 可进屋即使商店关门、常规周二/周五不推出无例外禁令、农舍工期删去未经验证的起算与首日状态、普通树桩对比挂载 Wood 引用、木匠店三项业务语法合法并列。 |
| **Repetition** | **PASS** | 0 | 通过。全篇逐段逐句比对（95 个非标题句子，0 重复句），历史 6 项重复（RP-R1 至 RP-R6）均无再现；新改动未引入同作用重复；删去多余的 3 天工期段落避免了与开头及表格的同作用复述；查价表、缺口算式与累计预算功能分明；结尾利落收尾于选择分支，无冗余总结或 FAQ。 |
| **三门综合结论** | **PASS** | 0 | **前三门全量审核通过**。移交下游独立审核者 Role E 进行受影响项复核与八层独立鉴文。 |

> [!NOTE]
> **共享修订预算说明**：本篇全流程共享最多 3 轮修订预算（含译文返修，不按角色重置）。第 1 轮和第 2 轮已完成，第 3 轮正文已由 C 提交并由 D 本次复验通过。当前预算状态为：**已用 3/3，未来剩余 0（含译文返修）**。本次 D 审核通过不消耗新的改稿轮次。

> [!IMPORTANT]
> **关于英文篇幅的性质说明**：英文当前机械字数 1138、剔除两行 `Schematic.` 图注后为 1085，均严格达到并超过 1000 词底线。依照 V7 规则，字数门（Length）在淬文阶段由独立角色 Role F 最终验收并签署，D 负责前三门语义审核，不能将本次语义 PASS 视为 Length 门 PASS。

---

## 二、被审文件与 SHA256 校验绑定

所有被审文件均位于工作树 `博客-2`（`/Users/wusir/orca/workspaces/stardew planner/博客-2`）内：

| 文件相对路径 | 字节数 | 行数 | SHA256 Checksum | 格式检查（UTF-8 / NFC / LF） | 校验状态 |
|---|---:|---:|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md` | 10,046 | 71 | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 候选正文（与协调者给定一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | 12,355 | 388 | `1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 公开引用（与协调者给定一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | 4,458 | 129 | `75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 媒体文本（与协调者给定一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json` | 9,003 | 136 | `1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 提交记录（与协调者给定一致） |
| `docs/blog-ops/house-upgrade-stardew/content/en/revision-round-3.md` | 5,240 | 63 | `7f99e45f7f8003ef64bbcbdfddd4106b8d69ef4e0da7c0c10779ba96a6a9d684` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 返修记录（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/task-card.md` | 4,622 | 65 | `5d37bdadb1fb20b30d1fbe605b67cd9c169acaa810667b0548dc88fd74950668` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 丰富任务卡（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/writer-brief.md` | 16,894 | 162 | `0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 写作简报（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/layout/enriched/media-plan.json` | 9,733 | 207 | `6359d95163dfec0ac889c61583a472fe61b53b7ee151eeb4a27bb02768d74a13` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 媒体规划（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/A/facts.json` | 34,063 | 460 | `618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 基础事实底座（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/material-preparation/facts.json` | 38,855 | 535 | `c180f0bf8b5eaf74de21a3999a646e19191064a01fe6d498c098ab56465d601d` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 材料准备事实底座（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/research/upgrade-planning/facts.json` | 33,849 | 467 | `397cc320f596d97e858809e688ba8f90d9db477236416f8cdd57fa1ed548026e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 规划事实底座（完全一致） |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/enriched-v3/report.md` | 20,429 | 243 | `2ec35b8c9800e2faf68a23bdc33e5c7de978fba062ecc6f8e127dfadaa264d07` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | E上一版审核报告（完全一致） |

- `media-text.en.json` 内 `bodySha256` 明确绑定：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`。
- `public-references.en.json` 内 `bodySha256` 明确绑定：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`。

---

## 三、真实验证执行与命令输出

独立执行日志完整记录于：`docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v4/checks.log`

### 1. 验证命令执行与退出码
- **执行命令**：`PYTHONDONTWRITEBYTECODE=1 python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md`
- **退出码**：`0`
- **真实输出**：
  ```json
  {
    "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md",
    "locale": "en",
    "mechanical_units": 1138,
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
      "non_body": 34,
      "frontmatter": 0
    },
    "sha256_raw": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f",
    "sha256_nfc_lf": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
  }
  ```
- **剔除图注计数**：剔除两行以 `Schematic.` 开头的图注行后，机械计数为 `1085`（仍严格满足 `>= 1000` 底线）。

### 2. Git 空白字符与格式检查
- **执行命令**：`git diff --check --no-index -- /dev/null docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md`
- **退出码**：`1`（diff 存在，stdout 与 stderr 均为空，无 trailing whitespace、CRLF 或 mixed indent 错误）。
- **编码与换行**：UTF-8 编码，NFC 规范化一致，换行为标准 LF，文末有且仅有单换行符。

### 3. 图文位置与内容对齐核验
`media-text.en.json` 定义的 3 张图片：
1. `cover-payments`（role: cover）：定义完整，由页面头部模板渲染，不在 Markdown 正文体内直接引用。
2. `tier-rooms`（role: body）：正文第 45 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。放置于第 4 节 H2 `What the kitchen, nursery, and cellar are for` 内 Nursery 句后。
3. `upgrade-or-renovation`（role: body）：正文第 63 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。放置于第 6 节 H2 `A renovation is not the next upgrade` 开头。

### 4. 引用与主张映射核验
- `public-references.en.json` 包含 55 处引用映射，55 处 `quote` 均在 `draft-v4.md` 中完全精确存在（0 missing，出现次数均为 1）。
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
- **类别 1（来源核查旁白）**：命中 0。全文所有链接均为标准的维基名词或页面描述性锚文本（如 `[Farmhouse]`、`[Version History]`、`[Carpenter's Shop]`、`[Axes]`、`[Wood]`、`[Hardwood]`、`[Large Stump]`、`[Large Log]`、`[Secret Woods]`、`[Cooking]`、`[Cask]`），无任何“据维基记载”、“已核查”等编辑旁白。
- **类别 2（示例/实测免责）**：命中 0。第 21 行 `That figure is a count of harvests, not a calendar date.` 为读者解释计算单位（是采收次数而非游戏内日历天数），属于操作定义，无免责声明。第 27 行与第 37 行分别说明假设前提与操作注意（“手头已有200木材”、“不要一次支付75,000g或175,000g”），均直接面向玩家行为。
- **类别 3（图片自我说明）**：命中 0。第 47 行与第 65 行图注均以 V7 允许的单字短标签 `Schematic.` 开头，后文直接列出画面中的档位、房间名和流程标签，无“不代表游戏内画面”等否定式免责。
- **类别 4（文章自指与范围声明）**：命中 0。正文彻底排除了 `in this guide`、`this article`、`the following table`、`in this section` 等自指词。第 27 行的 `Use this bill` 指代计算账单，第 37 行的 `cost table` 指代第 1 节的升级费用表，第 43 行的 `On the room figure, the Nursery label is this crib room` 是写作简报明确要求连接图注标签与正文功能的必要说明。
- **类别 5（验收词汇）**：命中 0。无 `verify`、`readback`、`pass`、`check sources` 等动作要求读者执行。
- **未经验证 UI 词扫描**：第 55 行使用直接操作动词 `ask her to upgrade the farmhouse, and pay the gold and materials for your next tier`，未写入 `Shop`、`Upgrade House`、`Construct Farm Buildings` 或 `Leave` 菜单标签，严格遵守协调决定 `msg_741541b5415a`。
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
1. **费用查阅与 1.6 背景**：第 1 节表格清晰呈现三档费用（10k+450w, 65k+100hw, 100k）与各 3 天工期；第 11 行单句讲清 1.6 改价历史，解开旧攻略疑虑。
2. **木材与硬木筹备**：斧头升级路径明确；Large Stump 与普通伐木树桩区分清晰；铜斧砍 Large Stump 得 2 硬木；钢斧砍 Large Log 得 8 硬木并清理秘密森林入口；秘密森林 6 树桩每日产 12 硬木（上 4 下 2），8 次采收 96，第 9 次采收完成 100 硬木储备；钢斧仅为秘密森林路线门槛。
3. **手头已有 200 木材预算核算**：第 1 年升级缺口 450 − 200 = 250；补买花费 250 × 10g = 2,500g；加上工费 10,000g，带款 12,500g。算式详尽严密。
4. **从初始农舍到目标档累计预算**：二档累计 75,000g（450w+100hw）；三档累计 175,000g（450w+100hw）；明确警告这是累加账单，不要在柜台单次支付。
5. **房间功能与解锁用途**：第 1 档厨房灶台、36 格冰箱、水槽灌水、双人床；第 2 档扩大面积、空房、婴儿床与两张儿童床（可生养两子）；第 3 档地窖、33 木桶、酒/奶酪/麦芽酒陈酿提升品质与价值、木桶配方（20w+1hw）及仅在地窖接受陈酿物品的规则；室外 9×5 占地不变。
6. **木匠店营业时间、下单与即时装修区分**：24 Mountain Road；常规周 9:00am–5:00pm，周二关门，周五 4:00pm 打烊；每天 9:00am–8:00pm 房屋可进但关门后进门无法下单；例外情况保留站内链接；二档后即时装修（拆床免费，加餐厅 150k，腾空可退款）。

### 3. 特别核实：E 上一版 6 处问题在 draft-v4 的修复表现

| 编号 | E 在 v3 提出的问题描述 | draft-v4 处置事实与原句 | 核查结论 |
|---|---|---|---|
| **E1** | 第 29 行数字归属错误：把合计 14,500g 与 32,500g 写成全买 450 木材的价款，且 50g 单独解释了 32,500g。 | **draft-v4 第 29 行**：<br>`In year 1, 450 × 10g = 4,500g for the wood, and 4,500g plus the 10,000g fee is 14,500g. The 200 already on hand is what changes that 14,500g total to 12,500g. In year 2 or later, Wood is 50g. 450 × 50g = 22,500g for the wood, and 22,500g plus the same 10,000g fee is 32,500g ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop), [Farmhouse](https://stardewvalleywiki.com/Farmhouse)). The 12,500g bill does not use that 50g price.` | **已彻底纠正**。<br>木材款（4,500g / 22,500g）与工费合计（14,500g / 32,500g）概念严格分清，50g 明确解释 22,500g 木材款，与 12,500g 的对比保持同口径（均为工费+买木材总花费）。完全符合 `01-wiki-farmhouse.json` Notes 原文。 |
| **E2** | 第 57 行事实条件改写：把每天 9:00am–8:00pm 可进屋缩成只在商店关门期间（`while the shop is closed`）。 | **draft-v4 第 57 行**：<br>`The house can be entered every day from 9:00am to 8:00pm, even when the shop is closed.` | **已彻底纠正**。<br>完整保留了“every day”和“even when the shop is closed”两个必要条件，未缩减进入时间。完全符合 `02-wiki-carpenters-shop.json` Shop Closure 原文。 |
| **E3** | 第 57 行把带例外的营业时间写成无例外禁令（`cannot place the upgrade` / `order has to be placed before then`）。 | **draft-v4 第 57 行**：<br>`On an ordinary week the counter is open from 9:00am to 5:00pm. Tuesday is closed. Friday closes at 4:00pm. The house can be entered every day from 9:00am to 8:00pm, even when the shop is closed. Entering the house does not place the order ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).` | **已彻底纠正**。<br>删除了 `cannot` 和 `has to` 的绝对推论，平实陈述普通周营业时间；第 59 行保留指向下雨、节日、诊所和路过柜台的站内链接，未否定例外。 |
| **E4** | 第 61 行把来源没有写的工期起点写成规则（“从付款日起算”、“付款当天房间仍未完成”）。 | **draft-v4**：<br>整段多余句子已完全删除。 | **已彻底纠正**。<br>删除了从付款日起算和付款当天状态的无依据断言；未添加通用建筑“次日开工/2天完工”；工期 3 天已在开头第 1 行与费用表中清晰给出，删去本段避免了多余的同作用复述。 |
| **E5** | 第 17 行引用未覆盖后半分句：普通树桩产 Wood 对比缺乏 Wood 来源支持。 | **draft-v4 第 17 行**：<br>`A Large Stump is the remains of a long-dead tree. A Copper Axe or better removes a Large Stump and yields 2 Hardwood ([Large Stump](https://stardewvalleywiki.com/Large_Stump)). It is not the stump left when you chop a living tree for Wood ([Wood](https://stardewvalleywiki.com/Wood)).` | **已彻底纠正**。<br>分句清晰，Large Stump 身份与产出挂载 `Large Stump` 链接；活树伐倒后留下的树桩对比独立成句并挂载 `[Wood](https://stardewvalleywiki.com/Wood)` 链接，未臆造额外掉落规则。完全符合 `wood-wikitext.json` 与 `large-stump-rendered.txt`。 |
| **E6** | 第 55 行独立主谓逗号拼接（comma splice）。 | **draft-v4 第 55 行**：<br>`Robin is at the Carpenter's Shop, 24 Mountain Road. She sells wood, stone, and furniture. She upgrades the farmhouse and constructs farm buildings ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).` | **已彻底纠正**。<br>拆分为两个合法完整的独立英文句子，出售物品、升级农舍、建造建筑三项业务事实保持不变。 |

**结论**：**ReaderValue PASS**，阻塞问题数：`0`。

---

## 六、第三门：Repetition 全量检查（PASS）

### 1. 检查依据
依据 V7 02：
- 段落、表格、图注不重复承担同一作用。
- 逐段逐句比对新段落与原表、图、结尾，全量覆盖全篇句子，不局限于历史问题。
- 正确区分“相同数据不同功能”（如费用表提供单档查找，而手头 200 木材核算与累计预算提供具体场景的算式规划，不按关键词误判为重复）。
- 确保删除与修改未引入新的同作用段落或冗余复述。

### 2. 全篇句子级重复比对分析
- 全文共 95 个非标题/非表格/非图片段落句子，经精确频次统计，**重复句子数为 0**。
- **引言段 vs 费用表**：
  - 引言段（第 1 行）：满足 V7 开头三句给出直接答案规范，概述三档费用、1.6 改价、3 天工期与下单地点；
  - 费用表（第 5–9 行）：提供行级结构化对照数据与行级维基引用。二者定位清晰，互不替代。
- **费用表 vs 预算核算节（第 27–37 行）**：
  - 费用表：罗宾单次升级收费基准；
  - 第 27–29 行：解决“手头已有 200 木材时带多少钱”的缺口购买运算（250 × 10g + 10,000g = 12,500g，对比 14.5k 与 32.5k）；
  - 第 35–37 行：解决“从初始农舍升到目标档累计总共多少”的宏观规划（75,000g、175,000g），并明确警告不要单次交付该金额；
  - 三者属于“基准单价 vs 缺口运算 vs 宏观累计”，作用截然不同，属于合法的“相同数据不同功能”。
- **图 1（`tier-rooms`） vs 第 4 节房间用途说明（第 41–51 行）**：
  - 图 1 及其图注仅承担三档房间平面轮廓与 9×5 占地不变示意；
  - 正文专注于烹饪台、36 格冰箱、水槽灌水、双人床、双子育儿、33 木桶陈酿与配方等文字功能说明，图文各司其职。
- **图 2（`upgrade-or-renovation`） vs 第 6 节装修规则（第 67–71 行）**：
  - 图 2 及其图注提供二档后升级与装修的双分支逻辑对照；
  - 正文交代即时生效、腾空全额退款、拆除婴儿床免费、加餐厅 150k 等实操条件，并在文章末尾以清晰的选择指引干净收束。
- **原第 61 行工期段落删除的正面效应**：
  - v3 原第 61 行在删除了未经验证的“从付款日起算”和“付款当天未完工”后，若仅保留“每档农舍升级需要三天”，则与开头第 1 行及费用表中的数字 3 完全同作用；
  - v4 果断整段删除该句，不仅彻底解决了 E4 事实问题，也完全规避了可能引发的工期同作用复述。
- **无多余总结与 FAQ 模块**：文章在最后一个有效决策判断（第 71 行）处自然收尾，未添加任何换词复述前文的总结段或冗余 FAQ。

### 3. 历史 D 审查六大重复问题（RP-R1 至 RP-R6）复验状态

| 编号 | 检查点 | draft-v4 表现 | 状态 |
|---|---|---|---|
| **RP-R1** | 1.6 旧价（50,000g and 150 Hardwood）重复出现两次。 | 仅在第 11 行出现单句历史背景，全文仅此一处。 | **已消除**（未再现） |
| **RP-R2** | 重复指令读者携带 65k 金币与 100 硬木。 | 该带钱指令句彻底消除，无动作重复。 | **已消除**（未再现） |
| **RP-R3** | 连续三句列出单档携带金额（carry 10k... carry 65k... carry 100k）。 | 无单档携带清单复述，专注于 12.5k 缺口算式与 75k/175k 累计。 | **已消除**（未再现） |
| **RP-R4** | 营业时间中普通工作日 9–17 与关门后至 20:00 可进门各说两次。 | 普通工作日时间仅在第 57 行首句说明一次；进门时间仅说明一次。 | **已消除**（未再现） |
| **RP-R5** | 3 天工期机械重复列举房间清单，并再次说明 stays on three days。 | 该段已彻底删除，工期仅在开头与表格中作为属性提供。 | **已消除**（未再现） |
| **RP-R6** | 美人鱼吊坠句重复 3 天等待与完工时序。 | 正文未引入结婚或吊坠分支，无此复述。 | **已消除**（未再现） |

**结论**：**Repetition PASS**，阻塞问题数：`0`。

---

## 七、共享修订预算与下游交接

### 1. 共享修订预算状态
- 全流程整篇文章共用最多 3 轮修订预算（含译文返修，不按角色重置）。
- 本篇历史执行：
  - 第 1 轮返修：由 Role C 在 draft-v1 基础上完成 draft-v2，消耗 1 轮。
  - 第 2 轮返修：由 Role C 在 enriched-brief 指引下完成合并丰富候选稿 `draft-v3.md`，消耗 1 轮。
  - 第 3 轮返修：由 Role C 一次性修复 E 在 v3 指出的 6 处问题，生成 `draft-v4.md`，消耗第 3 轮。
- 本次审核：Role D 对 `draft-v4.md` 进行独立全量三门复审，**三门均已全量通过，阻塞问题数为 0，不消耗新的改稿轮次**。
- 当前预算结余：**已用 3/3，未来剩余 0（含译文返修）**。

### 2. 下游交接与角色权限边界
- **流向**：本报告签署三门全部 PASS 后，英文丰富候选版本 `draft-v4.md` 正式移交**独立审核者 Role E**。
- **下游职责说明**：
  - 由 Role E 对照真实 diff 复核受影响段落及上下文（事实/数字/链接/引用 appliesTo/读者任务/重复/条件/编辑腔/图文含义），并开展八层独立鉴文。
  - 随后由 Role F 进行淬文、正式签署字数门（Length）及 10 候选标题生成与锁定。
- **权限边界声明**：Role D 严格限定于独立英文写后检查（ResearchTrace、ReaderValue、Repetition 三门），**严禁且未代签 Role E 审核、Role F Length 门或页面装配**。

---

## 八、绑定哈希与原始数据确认

- **正文候选文件**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md`
  - **SHA256**：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`
- **公开引用文件**：`docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json`
  - **SHA256**：`1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27`
  - **绑定的 bodySha256**：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`
- **媒体文本文件**：`docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json`
  - **SHA256**：`75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400`
  - **绑定的 bodySha256**：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`
- **作者提交记录**：`docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json`
  - **SHA256**：`1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415`
- **验证命令退出码**：`0`
- **验证日志文件**：`docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v4/checks.log`
