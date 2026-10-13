# Review Report: English Body Independent Review (Round 1)

- **Role**: E (Independent Content Reviewer / 独立审核)
- **Date**: 2026-10-13
- **Target Keyword**: `how to harvest stardew valley`
- **Reviewed File**: `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-body.md`
- **Candidate Version**: v1
- **Candidate Raw Body Hash**: `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421` (Verified via `shasum -a 256`, NFC LF identical)
- **Target Locale & Country**: `en` (US)
- **Reviewer Terminal Handle**: `term_d0dab364-a2b6-4afe-9abb-09e92f9f38cd`
- **Coordinator Terminal Handle**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **Task ID**: `task_d5524a3aec59`
- **Dispatch ID**: `ctx_3c5536bf3ab2`
- **Revision Budget Status**: Round 2 previously used; 1 shared revision round remaining across workflow.
- **Review Verdict**: **REVISE / FAIL (不通过，必须整改)**

---

## 1. 独立性与隔离状态声明

1. **角色独立性**:
   - 角色 E 独立于 A（研究）、B（布局）、C（写作）、D（写后检查）、F（锁稿）、T（翻译）、G（页面装配）及主协调者。
   - E 未参与 A–D 的任何创作与写后自检，独立读取原始关键词、搜索证据、任务卡、事实底稿及待审正文。
   - 本审核与 D 的写后检查并行执行，彼此不查看对方通过报告作为放行依据；严禁以作者 C 的自我评价或草稿说明（`revision-note.md`）作为通过依据。
2. **环境隔离状态**:
   - 工作树位于 `/Users/wusir/orca/workspaces/stardew planner/博客-2`（分支 `博客-2`），属于目录层级的逻辑隔离；未声明操作系统级（OS-level）权限沙箱隔离。

---

## 2. 机械计数与格式基准核查

- **执行命令**:
  ```bash
  python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" --locale en docs/blog-ops/how-to-harvest-stardew-valley/writing/en-body.md
  ```
- **输出结果**:
  - `mechanical_units`: 1648
  - `required_floor`: 1000（达标）
  - `long_form_target`: 2000（未达标）
  - `length_class`: `short`（1000–1999 词短文）
  - `sha256_raw`: `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`
  - `sha256_nfc_lf`: `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`
- **长度与结构判定**:
  - 当前机械字数 1648 词位于 1000–1999 词短文区间。作者在 `revision-note.md` 中记录了“主意图材料已写完”。
  - 然而，正文中包含大量内部证据对账叙述、检索日志旁白以及脱离作物收获的平台按键填充。在剔除上述严重违规内容后，C 在修订时必须补充面向读者的实质操作指导与农田管理细节，确保有效内容在无编辑腔、无研究痕迹的前提下稳定达到 1000–1999 词门槛，严禁为了凑字回填免责声明或无关百科。

---

## 3. 22 条鉴文规则逐项评估

依据 `参考规则/22条鉴文规则.md` 逐条核查 candidate v1：

| 编号 | 鉴文检查项 | 判定 | 依据与分析说明 |
|:---|:---|:---:|:---|
| 1 | 堵住所有反驳 | **命中 (FAIL)** | 正文存在多处作者为向审核者证明“自己没有混淆概念”而特意添加的辩白句。例如：Line 9 “The right-click itself is the Steam reply. X is the same click in the forum post quoted in the next section. The Steam thread is from 2019, before the 1.6 Iridium Scythe.”；Line 11 “That paragraph is about putting seeds and fertilizer down. The parsnip pick is the right-click from the Steam reply.”；Line 27 “A 1.4 note on the Controls page is a different hold: it makes it easier to collect from a lot of kegs, preserves jars, and crystalariums. Those are machines. The crop hold is the forum sentence.”；Line 39 “That chance is on the wheat harvest. Hay from cutting grass is a separate rate on the tool pages.”；Line 49 “Farming level 10 on its own is not the unlock.” 这些句子严重破坏了读者体验，通篇充斥着对审阅者的自我防御。 |
| 2 | 知识全部输出 | **命中 (FAIL)** | 偏离主意图大段倾倒不相关知识：<br>1. Lines 13–22 倾倒大量非 PC 平台控制系统细节（Xbox/PS/Switch 系统按键重映射路径、Switch 战斗武器按键、Switch 2 鼠标模式家具拾取与 ZR 旋转、移动端砍树碎石自动切工具等）；<br>2. Line 49 倾倒维基首页 2026-10-12 当日版本号（PC 1.6.15 与 PS Vita 1.02 对比），倾倒精通洞穴全技能 10 级及 50% 耕种经验折算规则（Task Card 明确排除项）。 |
| 3 | 匀速排比 | **命中 (需优化)** | Lines 37–39 句式过于机械呆板（“Kale grows in spring and takes 6 days. Kale is harvested using a Scythe or better. Amaranth grows in fall and takes 7 days. Amaranth is harvested using a Scythe or better...”），缺乏自然行文的句式变化。 |
| 4 | 让步模板反复出现 | 未命中 | 未见机械重复的“虽然…但是…”让步句式。 |
| 5 | 反复给概念命名 | 未命中 | 专业术语（Check / Do Action, Use tool, Iridium Scythe, Trellis 等）使用标准，无生造概念。 |
| 6 | 情绪曲线太光滑 | 未命中 | 保持客观说明文体，无虚构戏剧化经历。 |
| 7 | 虚构读者错误再反驳 | 未命中 | 未编造“所有人都以为”等虚构靶子。 |
| 8 | 高密度“不是X而是Y” | **命中 (需优化)** | 正文密集出现二元对立辨析句：“is ready on day 6, not day 5”、“The Steam thread is from 2019, before the 1.6 Iridium Scythe”、“Those are machines. The crop hold is the forum sentence”、“That swing removes a dead crop. It is a different job from cutting ripe kale or wheat”、“Cutting it during summer is a different choice”。阅读体感生硬突兀。 |
| 9 | 没有任何犹豫 | 未命中 | 事实条件（灌溉、换季、连作、工具条件）界定清楚，无不当绝对化断言。 |
| 10 | 虚假精确 | 未命中 | 数字（4天、6天、7天、3次斧头、15–21个掉落、40%干草等）均有原始维基与补证支持，无虚假测算。 |
| 11 | 脆弱经历只为论点服务 | 未命中 | 无个人成长叙事或虚构故事。 |
| 12 | 复杂问题突然变万能步骤 | 未命中 | 步骤区分了手摘、普通镰刀、铱金镰刀、斧头及支架行进边界，逻辑严密。 |
| 13 | 每段都收束成金句 | 未命中 | 未在段尾刻意升华或堆砌金句。 |
| 14 | 句子节奏过于均匀 | **命中 (需优化)** | 句子碎片化严重，短句密集缺乏连贯呼吸感。例如：“The growth time is on the Parsnip page. The right-click itself is the Steam reply. X is the same click in the forum post quoted in the next section. The Steam thread is from 2019, before the 1.6 Iridium Scythe.”。 |
| 15 | 感受替代论证 | 未命中 | 无“凭感觉”等主观臆断。 |
| 16 | 开头只剩钩子、痛点、承诺 | 未命中 | 首句“Stand next to a ripe parsnip and right-click it.”直接给出操作答案，方向正确。但紧随其后的句子陷入检索日志。 |
| 17 | 连接词固定且密集 | **命中 (FAIL)** | 大量使用文献检索引出句与来源叙事连接词：“The March 26, 2019 reply on the Steam thread... says...”、“The Controls page names...”、“The Crops page says...”、“Elenna101, on the forum thread... which started on September 17, 2021, described...”、“The scythe page gives...”、“The 1.6.9 changelog says...”、“The table lists...”、“The same page says...”。文章变成了维基与论坛的引述汇报。 |
| 18 | 刻意同义替换 | 未命中 | 核心词汇统一（Right-Click, X, Scythe, Parsnip, Trellis）。 |
| 19 | 中文翻译腔或非母语表达 | **命中 (需优化)** | 当前为英文稿审阅，体现为非自然的内部审核公文腔（Audit/Compliance jargon），而非正常英文读者教程语言。 |
| 20 | 虚构故事或案例 | 未命中 | 无虚构案例。 |
| 21 | 通用祝福结尾 | 未命中 | 结尾直接结束在农场规划工具与支架通道的实用建议上，无多余祝福。 |
| 22 | 强行追求深刻 | 未命中 | 保持游戏操作指引，无哲学升华。 |

---

## 4. 八层鉴文前七项专项核查

### 4.1 层 1：22 条规则执行
- 详见上述第 3 节，存在严重违规项（规则 1、2、17）及多项表达缺陷（规则 3、8、14、19）。

### 4.2 层 2：六类形式指纹
- **破折号过密**: 正常，无滥用破折号。
- **粗体过密**: 正常，未滥用粗体。
- **无用装饰符号**: 正常，无 emoji、无花哨符号。
- **助手残留**: 正常，未见大模型回复残留标签（如 `Here is the revised draft:` 等）。
- **填充短语**: 存在严重对账类填充短语（如 “That paragraph is about... The parsnip pick is...”）。
- **泛泛积极结尾**: 正常，无泛泛祝福结尾。

### 4.3 层 3：读者口吻与五类编辑腔检查
1. **① 来源核查旁白 (Source-checking narration)**: **极重度超标 (FAIL)**。
   - 正文充斥着诸如：“The March 26, 2019 reply on the Steam thread... says...”、“The growth time is on the Parsnip page. The right-click itself is the Steam reply”、“The Crops page says to put them...”、“Elenna101, on the forum thread... which started on September 17, 2021, described...”、“A 1.4 note on the Controls page is a different hold... Those are machines. The crop hold is the forum sentence.”、“The scythe page gives amaranth, kale, and wheat as examples. The harvest line on each of these pages is:”、“The Fiber Seeds page says they are not considered Crops”、“On the wiki front page read on October 12, 2026, the computer row was labeled 1.6.15...”、“In 1.6.9, the Iridium Scythe history says... The 1.6.9 changelog says...”、“The table lists regrowth of 4 days”、“The parsnip listing is a 4-day growth time. It has no regrowth interval next to it”、“The wither rule on the Crops page is the season change”、“The same page says fertilizer persistence is also true on Ginger Island”。
   - 这些句子彻底背离了面向玩家的读者口吻，构成了最典型的来源核查旁白！
2. **② 示例/实测免责**: 未命中，未发现免责声明。
3. **③ 图片自我说明**: 未命中，SVG 图注采用标准 `Schematic:` 标签，图注与 alt 均未出现“本插画仅供参考”、“不代表实际游戏截图”等自我免责。
4. **④ 文章自指与范围声明**: **命中 (FAIL)**。
   - Line 11：“That paragraph is about putting seeds and fertilizer down. The parsnip pick is the right-click from the Steam reply.”
   - Line 27：“A 1.4 note on the Controls page is a different hold... Those are machines. The crop hold is the forum sentence.”
   - 包含明显的段落自指与元叙述。
5. **⑤ 验收词汇写给读者**: 未命中，未发现要求读者 verify/audit/check 的词汇。

### 4.4 层 4：版本、数字、因果与支持性引用真实性
- **事实与引用底稿核对**:
  - 防风草右键收获（F43/F44/F16/F45）：事实准确。
  - 镰刀收获特定作物（甘蓝、苋菜、小麦、未碾碎的大米、纤维种子）：事实准确。
  - 小麦 40% 掉落干草、未碾碎大米水边 6 天（通常 8 天）、纤维种子全季节 7 天无须浇水：事实准确。
  - 黄金镰刀与铱金镰刀（1.6 耕种精通，1.6.9 采集特技/XP修复）：核心事实准确。
  - 天数计算（不计播种日、缺水停滞）、连作作物（绿豆3天、草莓4天）、换季枯萎与温室避险、巨型作物（3次斧头、15–21掉落、不枯萎）、支架作物阻挡移动：事实完全可靠。
- **违规事实溢出**:
  - Line 49 写入维基首页 2026-10-12 当日版本号（1.6.15 / Vita 1.02）及精通洞穴全技能升级机制，属于任务卡严令禁止的范围违规与研究痕迹。
  - Lines 13–22 扩展了非 PC 平台战斗、家具旋转等无关操作，脱离作物收获事实边界。

### 4.5 层 5：保护有依据的限制、反例与例外
- 有效保留了：换季枯萎例外（跨季作物、温室、巨型作物）；工具限制（黄金镰刀不具有全作物收获属性，铱金镰刀具有）；支架阻挡物理特性；天数不计播种日且缺水停滞。这些核心例外得以保全。

### 4.6 层 6：保护有效判断，清除模板金句
- 全文无无病呻吟的虚假升华，工具推荐（Stardew Valley Farm Planner）自然结合了支架农田规划。但必须清除用于证明审核合规的辩白套话。

### 4.7 层 7：问题清单集中输出
- 严格遵循“原句位置 + 问题类型 + 修改要求”格式，不提供可直接粘贴的替换句，不替作者改稿。详见下文第 6 节。

---

## 5. 图文方案与视觉资产核查

- **SVG 资产**: `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-figure.svg`
- **媒体配置**: `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-media.json`
- **图文核查要点**:
  - **图位插入**: 位于第 2 节（镰刀比较）之后、第 3 节（成熟度计算）之前，符合 reader brief 布局要求。
  - **图注与 Alt**:
    - `alt`: 符合要求，准确描述图内信息，无编辑腔。
    - `figcaption`: 采用 `Schematic: Stardew Valley crop harvest methods...` 开头，未出现“插画不代表游戏真实截图”等第 3 类编辑腔。
  - **图内文本 (22 处字符串)**:
    - 清楚映射了手摘（Right-Click / X / Check/Do Action）、镰刀收割（Left-Click / C / Use tool / 铱金1.6全耕地）、巨型作物（斧头3击/15–21不枯萎）、支架作物（阻挡通道）、换季枯萎（Day 28 / 温室全年）。
    - 视觉层级清晰，无虚构实测宣称，与正文事实高度一致。

---

## 6. 集中整改问题清单（交给 C 独立修改）

请协调者将以下 14 项问题交由作者 C 集中修订（一次性处理，消耗整篇工作流最后 1 轮修订预算）：

### 问题 1
- **原句位置**: Line 1 (前言第 2 句)
- **原句内容**: `The March 26, 2019 reply on the Steam thread [Harvest Parsnip with Scythe??](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/) says a parsnip does not need a scythe: stand beside it and right-click.`
- **问题类型**: ResearchTrace / 编辑腔①（来源核查旁白） / 规则 17
- **修改要求**: 删除论坛帖子发帖日期（“March 26, 2019”）以及“某某帖子回复说”的元叙述句式；直接以面向读者的操作口吻说明防风草等基础作物不需要镰刀、直接站在旁边右键即可采摘，链接作为自然的描述性锚文本嵌入。

### 问题 2
- **原句位置**: Line 7 (第 1.1 节第 2 句)
- **原句内容**: `The [Controls](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481) page names the same physical inputs: Right-Click or X is Check/Do Action, and Left-Click or C is Use tool or place item.`
- **问题类型**: 编辑腔①（来源核查旁白）
- **修改要求**: 删除“Controls 页面列出了相同的物理输入”等维基页面述评；直接陈述游戏中的默认键位绑定（PC 端 Right-Click 或 X 对应 Check / Do Action，Left-Click 或 C 对应 Use tool or place item）。

### 问题 3
- **原句位置**: Line 9 (第 1.1 节第 2 段整段)
- **原句内容**: `The growth time is on the [Parsnip](https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123) page. The right-click itself is the Steam reply. X is the same click in the forum post quoted in the next section. The Steam thread is from 2019, before the 1.6 Iridium Scythe.`
- **问题类型**: 严重 ResearchTrace / 编辑腔①（对账旁白） / 编辑腔④（文章自指） / 规则 1（堵住反驳） / 规则 14
- **修改要求**: 整段删除。严禁向读者交代“生长时间来自防风草页面、右键来自 Steam 回复、X 键来自下一节论坛引用、该帖子早于 1.6 铱金镰刀”等内部对账与防卫性辩解；如有必要，改写为面向读者的防风草收获说明。

### 问题 4
- **原句位置**: Line 11 (第 1.1 节第 3 段后半部分)
- **原句内容**: `The [Crops](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979) page says to put them on a tilled tile with the left-click control, or across tiles by holding Right-Click or Left-Click. Planting and fertilizing need no tool and spend no energy. That paragraph is about putting seeds and fertilizer down. The parsnip pick is the right-click from the Steam reply.`
- **问题类型**: 编辑腔①（来源核查旁白） / 编辑腔④（文章自指） / ResearchTrace
- **修改要求**: 删除“The Crops page says”以及“That paragraph is about... The parsnip pick is the right-click from the Steam reply”等自指解说；以纯读者视角清晰对比播种/施肥操作与采摘操作的按键区别。

### 问题 5
- **原句位置**: Lines 13–22 (第 1.1 节手柄、Switch 2 与移动端按键整块)
- **原句内容**: `Controller names for Check / Do Action and Use tool: ... A later Weapons block on the same page uses Y for a basic attack and A for block or alternate attack. That pair is the weapons pair. Switch 2 mouse controls, while they are turned on, use R to pick up furniture or use a tool, and ZR to rotate furniture, interact with the environment, or use other items. The right stick scrolls the toolbar. You can turn mouse controls off in Options. On mobile, the default scheme is Tap-to-move and Auto-Attack. Tapping stone or wood can select a tool for you. The [Mobile Controls] page names one exception: the scythe has to be selected...`
- **问题类型**: 范围漂移 / 规则 2（知识全部输出） / ReaderValue / 违反 Task Card 严格排除项
- **修改要求**: 大幅删减与作物收获无关的系统级百科知识（删除 Switch 武器攻击按键对、Switch 2 鼠标模式家具拾取/旋转、移动端砍树碎石自动选工具等杂项）；按 Task Card 要求，将注意力集中在 PC 端核心收获操作上，手柄等其他平台如需提及仅保留最精炼的动作映射对照，不扩写为全平台系统说明书。

### 问题 6
- **原句位置**: Lines 25–27 (第 1.2 节整节)
- **原句内容**: `Elenna101, on the forum thread [PC controls vs mobile](https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/), which started on September 17, 2021, described a hold for the tile under your character. The sentence is: "If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on." The same post says X is automatically mapped to right-click. ... A 1.4 note on the Controls page is a different hold: it makes it easier to collect from a lot of kegs, preserves jars, and crystalariums. Those are machines. The crop hold is the forum sentence.`
- **问题类型**: 极严重 ResearchTrace / 编辑腔①（检索日志引语） / 编辑腔④（文章自指） / 规则 1（对账辩白）
- **修改要求**: 彻底清除论坛用户名（Elenna101）、发帖时间（September 17, 2021）、引语壳子（“The sentence is: ...”）以及关于 1.4 机器收获的辨析对账（“Those are machines. The crop hold is the forum sentence.”）；按照 Writer Brief 的要求，将本小节改写为实用流畅的操作指引，向读者传授“按住 Right-Click 或 X 在农田作物间走动以实现快速连续收获”的操作要领。

### 问题 7
- **原句位置**: Line 35 (第 2.1 节第 2 段)
- **原句内容**: `The scythe page gives amaranth, kale, and wheat as examples. The harvest line on each of these pages is:`
- **问题类型**: 编辑腔①（来源核查旁白）
- **修改要求**: 删除维基词条页面结构的叙述旁白；直接引出需要使用镰刀收获的作物清单及其生长时间和特性。

### 问题 8
- **原句位置**: Line 39 (第 2.1 节小麦说明尾句)
- **原句内容**: `That chance is on the wheat harvest. Hay from cutting grass is a separate rate on the tool pages.`
- **问题类型**: 编辑腔①（内部证据核对旁白） / 规则 1
- **修改要求**: 删除关于工具页面割草掉率的内部对账说明；直接陈述小麦用镰刀收获时有 40% 概率额外掉落干草的事实即可。

### 问题 9
- **原句位置**: Line 41 (第 2.1 节纤维种子尾句)
- **原句内容**: `The Fiber Seeds page says they are not considered Crops.`
- **问题类型**: 编辑腔①（来源核查旁白）
- **修改要求**: 删除“The Fiber Seeds page says”；以客观游戏机制说明纤维种子在游戏分类上不属于常规农作物，但同样需要使用镰刀收获且不受季节限制。

### 问题 10
- **原句位置**: Line 49 (第 2.2 节后半段)
- **原句内容**: `The [Mastery Cave](https://stardewvalleywiki.com/index.php?title=Mastery_Cave&oldid=191046) opens after you reach level 10 in all five skills. Mastery points accumulate only after that, Farming experience counts at 50 percent toward those points, and you choose the order of the rewards. Farming level 10 on its own is not the unlock. ... On the [wiki front page](https://stardewvalleywiki.com/) read on October 12, 2026, the computer row was labeled 1.6.15, and the PlayStation Vita row was labeled 1.02. This 1.6 scythe sits outside that Vita label.`
- **问题类型**: 极严重 ResearchTrace / 规则 2（知识全部输出） / 违反 Task Card 严格排除项 / 编辑腔①
- **修改要求**: 坚决删除 2026-10-12 查阅维基首页的记录以及 PS Vita 版本号对比；删除精通洞穴全技能 10 级及 50% 耕种经验折算的繁琐机制（Task Card 明确排除项）；仅保留精炼事实：铱金镰刀是 1.6 版本引入的后期耕种精通奖励，其最大优势在于挥动时可直接收获挥击范围内所有种植在耕地上的成熟作物（包括常规手摘作物）。

### 问题 11
- **原句位置**: Line 51 (第 2.2 节 1.6.9 补丁段)
- **原句内容**: `In 1.6.9, the Iridium Scythe history says harvesting crops grown from Wild Seeds was fixed so they no longer always produced normal quality and gave no XP or Mastery. The [1.6.9 changelog](https://www.stardewvalley.net/stardew-valley-1-6-9-changelog/) says the Gatherer chance to double harvested forage also applies when you use an iridium scythe, forage crops from garden pots no longer always come out low quality with no XP, and an iridium scythe on forage crops gives XP and the forage-level quality boost.`
- **问题类型**: 编辑腔①（来源核查旁白 / “history says”, “changelog says”）
- **修改要求**: 去除“历史记录说”、“更新日志说”等旁白叙述，将 1.6.9 修复后的机制直接作为当前版本的既成规则告知读者（使用铱金镰刀收获野生种子作物和花盆觅食作物时，正常结算采集经验、采集品质加成以及 Gatherer 双倍几率）。

### 问题 12
- **原句位置**: Line 64 (第 3.1 节防风草天数辨析)
- **原句内容**: `The Parsnip page lists 4 days, and the stage days add up to 4. [Getting Started](https://stardewvalleywiki.com/index.php?title=Getting_Started&oldid=195315) says parsnips are ready to harvest in 4 days. The same count, applied to that 4-day listing, is ready on day 5 when you plant on day 1.`
- **问题类型**: 编辑腔①（词条对账旁白） / 规则 17
- **修改要求**: 删除维基不同页面关于 4 天描述的对账过程；直接为读者清晰总结天数计算规则：播种当天不计入生长时间，因此第 1 天播种并浇水的 4 天防风草，在第 5 天早晨成熟可收。

### 问题 13
- **原句位置**: Line 72 & Line 76 (第 3.2 节草莓与防风草字段描述)
- **原句内容**: `The table lists regrowth of 4 days.` 以及 `The parsnip listing is a 4-day growth time. It has no regrowth interval next to it.`
- **问题类型**: 编辑腔①（维基表格/字段描述）
- **修改要求**: 删除对维基表格和数据字段的机械描述；从游戏体验出发，直接讲清连作作物（如草莓成熟后每 4 天可再次采摘）与单次作物（如防风草收获后植株即消失、原处留出耕地）的根本区别。

### 问题 14
- **原句位置**: Line 82 (第 4.1 节) & Line 92 (第 4.2 节)
- **原句内容**: `The wither rule on the Crops page is the season change.` 以及 `The same page says fertilizer persistence is also true on Ginger Island.`
- **问题类型**: 编辑腔①（来源核查旁白） / 规则 2（无关延伸）
- **修改要求**: 删除“The wither rule on the Crops page is...”以及“The same page says... Ginger Island”；直接向读者说明：只要处于当季之内，成熟作物留着不摘过夜不会枯萎，但第 28 天换季时若不属于次季作物则会全部枯死（跨季作物和小麦保耕地保肥料除外）。删除与温室主题无关的姜岛延伸。

---

## 7. 审核结论与后续流程推进

1. **评审结论**: **REVISE / FAIL（不通过）**
   - 当前 candidate v1 (`f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`) 存在系统性、多处的严重 ResearchTrace 及来源核查旁白，彻底违反了 V7 工作流的“读者口吻”与 22 条鉴文规则。
2. **整改流转建议**:
   - 协调者需将本报告的 14 项集中整改要求，与 D 的写后检查问题清单合并后，一次性交由作者 C 独立修改英文正文（严禁 E/D 代改正文，严禁给 C 提供整句替换文本）。
   - C 修订后必须重新计算 NFC LF SHA-256 并交由 D 进行三门复检；D 通过后再交由 E 针对受影响项与全文事实进行第二轮复审。
   - 鉴于全流程共用修订预算已使用 2 轮仅剩 1 轮，本次 C 的修订必须彻底根除上述 14 项问题，并保证正文字数在纯读者口吻下维持在 1000–1999 词的短文标准，确保下一轮能顺利技术锁定。
