# 角色 D 独立写后检查报告 (Rework-V2 English Body Three-Gates Review)

- **执行角色**: 独立写后检查员 (Role D / Post-Writing Checker D)
- **任务标识 (Task ID)**: `task_751b76467cee`
- **派发上下文 (Dispatch ID)**: `ctx_4317511c0827`
- **协调员终端**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**: `term_5560c5ca-08fb-4c5f-8376-0c6fd35baacd`
- **唯一工作树**: `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **审查输入**:
  - 用户原始请求：`how to harvest stardew valley` 中英文博客创作与返工要求（拒绝旧图及要求重新弄）
  - 事实核验与纠偏依据：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit-v2.md` 与实际 sources receipts
  - 布局约束：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/layout.md`
  - 媒体勘误与交付基准：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/record-errata.md`、`media.md`、`media/manifest.json` 及 decoded 实际反解帧
  - 待审稿件：Role C 交付的新版英文正文 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-body.md`、`en-media.json`、`en-public-references.json`、`revision-note.md`
- **执行原则与边界**:
  - 严格只读检查，严禁且未修改任何正文、SEO、译文、源代码、公共图片或历史记录；
  - 严格遵守输出规范：“输出每个问题原句位置 + 类型 + 修改要求，不提供替换句”；
  - 独立审阅，不继承 Root/作者自我评价，依据真实证据与 V7 规范判定。

---

## 一、版本标识与机械计数基准 (Mechanical Verification Receipts)

### 1.1 待审文件哈希与规范化核验
- **审查正文文件**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-body.md`
  - `size_bytes`: `8553`
  - `sha256_raw`: `e7d4ab18cd214bb43d5fe38c80c72e6c0042bdb26df0194ca001e8de138dbd55`
  - `sha256_nfc_lf`: `e7d4ab18cd214bb43d5fe38c80c72e6c0042bdb26df0194ca001e8de138dbd55` (一致，无换行漂移)
- **剔除图注对照副本**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-body.caption-excluded.md`
  - `size_bytes`: `7540`
  - `sha256_raw`: `2669c4aa5756cdeee6ddb3827215fa11114bcffe386bbd2db0b23112f2f419dd`
  - `sha256_nfc_lf`: `2669c4aa5756cdeee6ddb3827215fa11114bcffe386bbd2db0b23112f2f419dd`
- **公开引用描述清单**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-public-references.json`
  - `size_bytes`: `9997`
  - `sha256_nfc_lf`: `3d534934064167c39f5fc53f5a1bf1dae694c6da5b68bfc593f34570c5073929`
- **媒体引用描述清单**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-media.json`
  - `size_bytes`: `4115`
  - `sha256_nfc_lf`: `4293ca30e79a843944a605997fd9680c1d92c0e7ee27c83b439a3d514c73ab59`
- **媒体制作交付清单**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/manifest.json`
  - `size_bytes`: `13213`
  - `sha256_nfc_lf`: `9225ec257f161af7a60b4ea569a29f341a3a540b2e0f2ed852be606dbfc4c706`

### 1.2 实际运行机械计数脚本
运行命令：`python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" <file> --locale en`
- **全量文件计数 (`en-body.md`)**:
  - 进程退出码：`0` (实际执行)
  - 机械合格单位：`1088` words
  - 篇幅判定：`short` (短文，`meets_mechanical_floor: true`, `meets_long_form_target: false`)
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/count-full.stdout.json`
- **剔除 `<figure>` 图注后合格正文计数 (`en-body.caption-excluded.md`)**:
  - 进程退出码：`0` (实际执行)
  - 机械合格单位：`1047` words
  - 篇幅判定：`short` (短文，满足短文底线 `>= 1000`)
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/count-eligible.stdout.json`
- **篇幅与字数评估**:
  - 本篇短文合格计数 1047 词，满足 V7 短文门槛（1000–1999）；
  - 明确遵循 V7 准则：不把旧版本 1326 词机械当作质量标准，不要求也不允许为凑 2000 长文而注水无关内容。

### 1.3 引用保真度实际核验 (Reference Fidelity Check)
- 运行验证脚本针对 `en-public-references.json` 中声明的 19 条引用进行精确原文及出现频次匹配：
  - 进程退出码：`0`
  - 总引用条目：`19`
  - 校验失败数：`FAILS 0`
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/reference-fidelity.stdout.txt`

---

## 二、三门写后检查分别结论 (Three Gates Detailed Review)

### 2.1 门一：ResearchTrace（研究痕迹与编辑腔）—— 【FAIL 未通过】

对照 V7《02-内容生产与质量门.md》之「读者口吻」五类编辑腔标准及《22条鉴文规则.md》：
正文未出现占位符、助手残留痕迹或验收词汇，且图注未包含“不代表游戏内画面”等免责声明。然而，正文中存在直接叙述维基来源文档条目布局与举例的编辑腔旁白（类型一：来源核查旁白）。

#### 问题清单 (ResearchTrace Issues)

##### 【问题 D-RT-01】
- **原句位置**: Section: `How to Harvest Designated Crops with a Scythe` (Line 44)
- **原句内容**:
  > `A [scythe](https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696) is required for certain other crops, and the page's examples are amaranth, kale, and wheat.`
- **问题类型**: 编辑腔 · 来源核查旁白（Category 1: 叙述核查状态与来源文档本身）
- **修改要求**:
  - 严禁在面向读者的正文中叙述维基条目本身的排版或列举行为（如 `the page's examples are...`）；
  - 请使用直接面向读者的游戏规则口吻说明哪些作物需要使用镰刀收割（如作为常见作物举例），而不提及外部网页的举例状态。

##### 【问题 D-RT-02】
- **原句位置**: Section: `Visual Signs: Identifying the Final Harvest Stage Sprite` (Line 9, Line 11)
- **原句内容**:
  > `The last column on its growth table is the harvest stage, and that sprite is the one you pick. Earlier columns are still growing.` (Line 9)
  > `The table lists 4 days in total, and the harvest art is stage 5.` (Line 11)
  > `That table lists 13 days, and the harvest art is stage 6.` (Line 11)
- **问题类型**: 编辑腔 · 来源核查旁白（Category 1: 将外部维基表格的“列/表格记录”叙述进正文）
- **修改要求**:
  - 游戏内的读者面对的是田里的作物精灵图，而非维基网页的“表格列 (columns on its growth table)”；
  - 请将焦点从“指导读者阅读维基表格的列号与表格清单”转为“指导读者识别地里作物的最终成熟精灵图形态”，消除对外部网页表格结构的元叙述。

---

### 2.2 门二：ReaderValue（读者任务与可操作性）—— 【FAIL 未通过】

对照读者主任务：“读者能准确辨认成熟的农作物形态，以 PC 操作为主完成单株采摘与连续走动收获，掌握镰刀收割作物名单与 1.6 铱镰刀能力，正确采伐巨大作物并规划棚架通道，快速排除无法收获的常见阻碍。”
正文较好地剔除了武器战斗数值、割草掉落与机器加工等干扰，但在作物成熟的实际识别、PC 站位可操作性以及排错有效性上仍存在明显的读者操作障碍。

#### 问题清单 (ReaderValue Issues)

##### 【问题 D-RV-01】
- **原句位置**: Section: `Calculating Harvest Days and Unwatered Delays` (Line 24)
- **原句内容**:
  > `Count the pumpkin the same way through its 1, 2, 3, 4, and 3 stage days, and stage 6 waits out each dry day.`
- **问题类型**: 读者价值缺失 · 可操作性不足（机械灌注维基中间阶段天数，缺乏实际推算价值）
- **修改要求**:
  - 在实际游戏中，农夫推算南瓜成熟是依据播种日加上标称总生长时间（13 个浇水天数），漏浇水则顺延总天数；农夫在田间无法逐一分辨或统计 `1, 2, 3, 4, and 3` 这些内部中间阶段天数；
  - 请简化为面向读者实际可操作的日历推算逻辑（如总天数与漏浇顺延关系），删除对中间阶段细分天数数列的机械罗列。

##### 【问题 D-RV-02】
- **原句位置**: Lines 3, 18, 30, 32
- **原句内容**:
  > `One plant uses the open tile beside it. A bed uses the tile under your feet.` (Line 3)
  > `That path is where you stand to take one plant.` (Line 18)
  > `For one plant, stand on an open tile that touches it. Right-click.` (Line 30)
  > `You stand beside the crop for this click, and you press once. The dirt path beside the pumpkin bed is that open tile. The pumpkin you take is the one touching it.` (Line 32)
- **问题类型**: 读者价值缺失 · 动作操作指引失真与误导（人为施加“单株必须站在旁边开阔过道”的虚拟限制）
- **修改要求**:
  - 在《星露谷物语》中，常规农作物（如防风草、南瓜）本身无碰撞体积，角色既可以站在相邻地块采摘，也可以直接走入作物地块站立采摘；仅有棚架作物才具有实体阻挡；
  - 当前文本多次将单株采摘绝对化为“必须站在旁边接触的开阔地块/旁边泥地通道上”（`One plant uses the open tile beside it`），极易误导新手以为地块中央的作物因为不挨着泥地通道就无法单株采收；
  - 请明确说明角色站在作物旁或走在作物田上均可触发单株交互，消除单株采摘必须依赖外围过道的误导性限制。

##### 【问题 D-RV-03】
- **原句位置**: Section: `Troubleshooting Harvest Issues` (Lines 75, 77, 81)
- **原句内容**:
  > 全节集中在整段复述前文规则（漏浇停长、镰刀/斧头工具分流、棚架阻挡），未提供排错诊断价值。
- **问题类型**: 读者价值缺失 · 缺少根据观察现象进行分流诊断的排错结构
- **修改要求**:
  - 教程排错节应按照“读者遇到了什么现象（Symptom）→ 如何区分原因 → 如何动作解决”组织；
  - 当前排错节仅是对前文既有规则的断言式复读，未能为“对着作物按键毫无反应”、“不知道是否长成”的卡壳读者提供清晰的排查分支动作。

---

### 2.3 门三：Repetition（同作用重复）—— 【FAIL 未通过】

对照 V7《02-内容生产与质量门.md》五项质量门之 Repetition（“段落/表格/FAQ 不重复承担同一作用。失败时必须指出：重复的两处位置、可保留的唯一有效信息”）：
审查发现正文各章节之间存在大面积近乎逐词的句式复读与同一解释作用的重复承担。

#### 问题清单 (Repetition Issues)

##### 【问题 D-RP-01】
- **原句位置 1**: Section: `Calculating Harvest Days and Unwatered Delays` (Line 22)
  > `Miss a day and the crop does not die, but it does not grow either, so the harvest sprite is one day later. Sow into soil that is still dry, and skip watering that same day, and the seed does not grow that night.`
- **原句位置 2**: Section: `Troubleshooting Harvest Issues` (Line 75)
  > `For the parsnip and the pumpkin, a dry day does not kill the plant, and that day does not grow. A seed sown into dry soil and left dry that day does not grow that night. Watering is what finishes the listed 4 days or 13 days.`
- **问题类型**: 重复 · 段落承担完全同一解释作用且句式近乎原样复制
- **可保留的唯一有效信息**: 保留 Line 22 中关于缺水停长顺延及播种干土不长的前提规则；Line 75 的排错节不得机械照抄前文原句，应改写为针对“作物迟迟未熟”现象的针对性排查提示。

##### 【问题 D-RP-02】
- **原句位置 1**: Section: `Maintaining Reachable Paths Around Trellis Crops` (Line 62)
  > `Green bean, hops, and grape grow on a trellis. You cannot walk through a living trellis, so each plant needs a layout that lets you stand on a neighboring tile. After the plant is dead, you can walk through that tile.`
- **原句位置 2**: Section: `Troubleshooting Harvest Issues` (Line 81)
  > `You cannot stand beside the plant. A living green bean, hop, or grape is filling the approach. The open dirt between the trellises is the gap you need. A dead trellis can be walked through again.`
- **问题类型**: 重复 · 相同作物名单、活体不可穿行及枯株可穿行规则被连续重复两次
- **可保留的唯一有效信息**: 保留 Line 62 在特殊作物章节对棚架作物特性与留道布局的完整说明；Line 81 的排错节删除对“青豆、啤酒花、葡萄”及“枯株可穿行”的重复说明，仅保留检查是否因棚架阻挡无法靠近的简短动作判定。

##### 【问题 D-RP-03】
- **原句位置 1**: Section: `Visual Signs: Identifying the Final Harvest Stage Sprite` (Line 11)
  > `A parsnip uses four stages of one day each, then the harvest sprite... A pumpkin uses five stages, lasting 1, 2, 3, 4, and 3 days, then the harvest sprite.`
- **原句位置 2**: Section: `Calculating Harvest Days and Unwatered Delays` (Line 24)
  > `Count the parsnip's four stage days on days the soil was watered... Count the pumpkin the same way through its 1, 2, 3, 4, and 3 stage days...`
- **问题类型**: 重复 · 紧邻段落重复列举相同作物的阶段划分与阶段天数
- **可保留的唯一有效信息**: 在成熟识别节说明生长周期总天数即可，避免在紧邻的下一小节再次重复报数 `1, 2, 3, 4, and 3`。

##### 【问题 D-RP-04】
- **原句位置**: 全文多处 (Lines 1, 30, 44, 77)
  > `Stand on an open tile beside a ripe parsnip and right-click it...` (Line 1)
  > `That is the parsnip action: you do not need a scythe, you stand next to it, and you right-click.` (Line 30)
  > `The beside-it right-click is the parsnip action.` (Line 44)
  > `The sprite is up and the beside-it click is the wrong action for that plant.` (Line 77)
- **问题类型**: 重复 · 自造生硬术语“the parsnip action”与“beside-it click”高频机械复读
- **可保留的唯一有效信息**: 在单株采摘节说明右键采收基础操作；删除通篇反复出现的造词式口头禅，使用自然规范的游戏动作说明。

---

## 三、门禁审查汇总与下一步指令 (Summary & Direction for Role C)

| 检查门类 | 判定结果 | 核心未通过原因摘要 |
|---|:---:|---|
| **Gate 1: ResearchTrace** | ❌ **FAIL** | 存在叙述维基条目举例与维基表格列排版的编辑腔旁白（Line 44, Line 9, Line 11）。 |
| **Gate 2: ReaderValue** | ❌ **FAIL** | 单株采摘过度限定于外围泥地通道造成误导；机械灌注阶段天数不便计算；排错缺乏实际诊断结构。 |
| **Gate 3: Repetition** | ❌ **FAIL** | 缺水停长与棚架阻挡在排错节近乎逐词照搬前文；“beside-it click / parsnip action”口头禅机械复读。 |

### 审查定性与交接要求
1. **本审查会话状态**: 角色 D 审查任务已独立完成（**Review Task Succeeded**）；
2. **候选文本通过状态**: 稿件未通过 V7 写后三门检查（**Content Candidate Gates Failed / Must-Fix**）；
3. **退回修改流程**:
   - 依据 V7 工作流，本报告问题清单已严格按“原句位置 + 问题类型 + 修改要求”格式输出，**未提供任何可直接粘贴的替换句**；
   - 必须由撰写员 Role C 根据上述修改要求用自己的语言修改英文正文 `en-body.md` 及配套引用映射；
   - 待 Role C 提交新候选版本并更新哈希后，由 Role D 全量重审三门检查；通过后方可移交独立审核员 Role E。
