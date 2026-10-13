# 角色 D 独立写后检查报告 · 第 1 轮复验 (Rework-V2 R1 English Body Three-Gates Review)

- **执行角色**: 独立写后检查员 (Role D / Post-Writing Checker D, Round 1 Re-review)
- **任务标识 (Task ID)**: `task_cf20ceefd2f6`
- **派发上下文 (Dispatch ID)**: `ctx_fd570f809436`
- **协调员终端**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**: `term_1e9f008d-c9be-4b9b-a167-da0967085100`
- **唯一工作树**: `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **审查输入**:
  - 用户原始请求：`how to harvest stardew valley` 中英文博客创作与返工要求（拒绝旧图及要求重新弄）
  - 事实核验与纠偏依据：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit-v2.md`、`facts-regrowth.md` 及实际 raw sources receipts
  - 布局约束与结构目标：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/layout.md`
  - 媒体规范与实机资产：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media.md`、`media/manifest.json` 及 staged 图像
  - 待审稿件（C 在 `task_8768ef1b03ed` 后的最新修订版本）：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-body.md`、`en-media.json`、`en-public-references.json`、`revision-note.md`
- **执行原则与边界**:
  - 本任务为集中修订第 1 轮（R1）独立全量复验会话，独立于旧 D1 且不兼任 A/B/C/E/F/T/G；
  - 严格只读检查，严禁且未修改任何正文、SEO、译文、源代码、公共图片或历史文件；
  - 报告新增本文件及 `checks-d/r1/` 原始记录，不覆盖 D1 历史报告 (`checks-d/D-en-three-gates-review.md`)；
  - 严格遵守输出规范：“输出每个问题原句位置 + 类型 + 修改要求，不提供替换句”；
  - 独立审阅，不沿用旧哈希或任何自评结论，以真实命令执行证据与 V7 标准判定。

---

## 一、版本标识与机械计数基准 (R1 Mechanical Receipts)

### 1.1 待审文件哈希与规范化核验 (NFC-LF SHA-256)
所有哈希均由脚本 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r1/collect_evidence_r1.py` 重新读取并规范化计算（原始记录存入 `checks-d/r1/sha256-receipts.json`）：

- **审查正文文件 (`en-body.md`)**:
  - `size_bytes`: `11457`
  - `sha256_raw`: `a91783b9525f64c63d75a98561be978a9f92cb6cde734d3687575403aea544dc`
  - `sha256_nfc_lf`: `a91783b9525f64c63d75a98561be978a9f92cb6cde734d3687575403aea544dc` (一致，无换行漂移)
- **剔除图注对照副本 (`en-body.caption-excluded.md`)**:
  - `size_bytes`: `10442`
  - `sha256_raw`: `8481948f910b80954118075c19664a1f88e7f5f5118e90c1e3b787b048421dd9`
  - `sha256_nfc_lf`: `8481948f910b80954118075c19664a1f88e7f5f5118e90c1e3b787b048421dd9`
- **公开引用描述清单 (`en-public-references.json`)**:
  - `size_bytes`: `10184`
  - `sha256_nfc_lf`: `0227ee034205ab00e9d38566377e9271b2581d24ab3fb02509259aa09ca3a97d`
- **媒体引用描述清单 (`en-media.json`)**:
  - `size_bytes`: `4115`
  - `sha256_nfc_lf`: `a377976a2213a80218c2c77da4950f71450bf94550cc0b0cd745653236480b67`
- **媒体交付清单 (`media/manifest.json`)**:
  - `size_bytes`: `13213`
  - `sha256_nfc_lf`: `9225ec257f161af7a60b4ea569a29f341a3a540b2e0f2ed852be606dbfc4c706`
- **交付媒体资产哈希 (`media/staged/`)**:
  - `how-to-harvest-stardew-valley-cover.webp`: `479250` B, SHA-256: `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574`
  - `how-to-harvest-stardew-valley-cover.avif`: `237604` B, SHA-256: `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57`
  - `how-to-harvest-stardew-valley-mature-crops.webp`: `267644` B, SHA-256: `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd`
  - `how-to-harvest-stardew-valley-mature-crops.avif`: `143638` B, SHA-256: `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1`
  - `how-to-harvest-stardew-valley-trellis-paths.webp`: `223784` B, SHA-256: `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4`
  - `how-to-harvest-stardew-valley-trellis-paths.avif`: `113557` B, SHA-256: `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a`

### 1.2 实际运行机械计数脚本
运行命令：`python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" <file> --locale en`
- **全量文件计数 (`en-body.md`)**:
  - 退出码：`0` (`checks-d/r1/count-full.exit.txt`)
  - 机械合格单位：`1358` words
  - 篇幅分类：`short` (短文，`meets_mechanical_floor: true`, `meets_long_form_target: false`)
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r1/count-full.stdout.json`
- **剔除 `<figure>` 图注后合格正文计数 (`en-body.caption-excluded.md`)**:
  - 退出码：`0` (`checks-d/r1/count-eligible.exit.txt`)
  - 机械合格单位：`1317` words
  - 篇幅判定：`short` (短文，满足底线 `>= 1000`，处于规划预算 1000–1400 words 区间)
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r1/count-eligible.stdout.json`
- **篇幅与字数评估**:
  - 明确遵循 V7 准则：不把旧版本 1326 词机械当作质量标准，不要求也不允许为凑 2000 长文而注水无关内容。当前 1317 词符合主意图材料自然表达。

### 1.3 引用保真度实际核验 (Reference Fidelity Check)
- 运行验证脚本针对 `en-public-references.json` 中声明的 21 条引用进行精确原文及出现频次匹配：
  - 退出码：`0`
  - 总引用条目：`21`
  - 校验失败数：`FAILS 0`
  - 原始记录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r1/reference-fidelity.stdout.txt`
  - **核验说明**：21 条引用的 quote 精确字串与 occurrence 在正文中 100% 存在，位置映射全部通过。但依据 V7 与协调员指示，“引用定位 0 失败只证明位置匹配，不代表其正文主张事实真实（Truth）与读者价值成立”，仍需在门二中深入审核主张真实性与操作价值。

---

## 二、三门写后检查分别结论 (Three Gates Detailed Review)

### 2.1 门一：ResearchTrace（研究痕迹与编辑腔）—— 【PASS 通过】

对照 V7《02-内容生产与质量门.md》之「读者口吻」五类编辑腔标准及《22条鉴文规则.md》：

1. **旧版 D1 问题整改复查**:
   - **D-RT-01 已修复**: 原 Section 4.1 中出现的外部维基页面列举旁白（`and the page's examples are amaranth, kale, and wheat`）已被完全移除，改为直接面向读者的规则说明（`A standard scythe is required for certain other crops, such as amaranth, kale, and wheat. Right-clicking or pressing X does not harvest them.`）。
   - **D-RT-02 已修复**: 原 Section 2.1 中将外部维基表格结构叙述进正文的旁白（`The last column on its growth table is the harvest stage`, `Earlier columns are still growing`, `The table lists 4 days...`）已彻底清除，完全聚焦于游戏内地里作物最终成熟精灵图（`final harvest sprite`）与采摘判断。
2. **五类编辑腔排查**:
   - 来源核查旁白：无 `documented`、`source-backed`、`without source support`、`已核验` 等字眼；
   - 示例/实测免责：无 `This is a planning scenario, not a measured pacing result` 等免责声明；
   - 图片自我说明：图注及 alt 文本仅客观描述截图中的橙色南瓜、木质棚架与泥土通道，未出现“插画不代表游戏内画面”等自我辩解；
   - 文章自指与范围声明：未出现 `This guide covers...`、`In this article...`、`本文将介绍...`；
   - 验收词汇：未将流程验收词（`readback`、`verify sources`、`pass/revise`）写给读者。
3. **合法引用归因与学习说明判定**:
   - 正文引用《Crop Growth Calendars》关于重新播种的假设说明（Line 36: `According to the crop growth calendars, keeping single-harvest plots productive throughout the season assumes seeds are replanted and watered on the day of harvest`），属于合法的公开引用主语归因（依据《事实核验与公开引用.md》第五节规范），不属于编辑腔，实际帮助读者理解单次作物收获后为何需要补种。
4. **门一结论**: **PASS**。

---

### 2.2 门二：ReaderValue（读者任务与真实性）—— 【FAIL 未通过】

对照读者主任务：“读者能准确辨认成熟的农作物形态，以 PC 操作为主完成单株采摘与连续走动收获，掌握镰刀收割作物名单与 1.6 铱镰刀能力，正确采伐巨大作物并规划棚架通道，快速排除无法收获的常见阻碍。”
正文较好地纠正了旧版 D1 的机械罗列阶段天数（D-RV-01）与排错缺乏诊断结构（D-RV-03）的问题，但在本次提交的 `a917` 候选版本中，出现了多处未经一手源原句支持的推论外推、不实机制警告、非农耕主任务偏离以及过度绝对化的排他规则，严重影响了教程的可操作性与事实真实性。

#### 问题清单 (ReaderValue Issues)

##### 【问题 D-RV-04】
- **原句位置**: Section: `Visual Signs: Identifying the Final Harvest Stage Sprite` (Line 7)
- **原句内容**:
  > `Identifying harvest readiness in the field relies on spotting the plant's final harvest sprite, which replaces immature shoots with fully developed produce.`
- **问题类型**: 读者价值与事实真实性 · 视觉特征全称泛化与游戏实情不符
- **修改要求**:
  - 在《星露谷物语》中，并非所有作物的最终收获形态都表现为“成熟果实替换幼苗”（例如小麦、甘蓝菜、未碾米或纤维仍保留秸秆/植株整体形态，蓝莓等再生作物进入灌木挂果形态，棚架作物保留架子）；
  - 请将辨认指引聚焦于地表植株达到最终收获形态（Final Harvest Sprite），删除将所有作物一概断言为“完全发育农产品替换幼苗”的过度泛化表述。

##### 【问题 D-RV-05】
- **原句位置**: Section: `Visual Signs` (Line 9, Line 18) 与 Section: `Single-Crop Harvesting on PC` (Line 32)
- **原句内容**:
  > `When plants reach these final sprites, you can harvest them from an adjacent tile or by walking directly onto the planted bed.` (Line 9)
  > `Farmers can harvest from the dirt path or step onto the bed itself to gather ripe crops.` (Line 18)
  > `Stand adjacent to the ripe crop or walk onto the tilled patch, face the plant, and right-click it.` (Line 32)
- **问题类型**: 读者价值与操作规范 · 无源推论混入单株操作指令
- **修改要求**:
  - 经查阅官方一手源引文（Steam 社区帖子），单株作物右键交互的核实原句为站在作物旁边（`standing next to it and rightclick it`），走动采收脚下地块属于长按走动技巧（`hold right click... over your crops`）；D1 反馈中提及的单株站立脚下交互缺乏独立原句引文支持；
  - 请保留面向作物的正向单株右键交互说明，消除在单株章节中将“特意走入田块内部踩在脚下点击”表述为独立核实验收动作的无源引申，同时保持不给读者造成“必须站在外围泥土通道”的排他性误导。

##### 【问题 D-RV-06】
- **原句位置**: Section: `Single-Crop Harvesting on PC` (Line 34)
- **原句内容**:
  > `On game controllers, harvesting uses the platform's action button (A on Xbox, Cross on PlayStation, and A on Nintendo Switch). On mobile devices, players tap directly on the mature plant.`
- **问题类型**: 读者价值与事实真实性 · 通用键位定义过度外推为专属采收指令
- **修改要求**:
  - 社区维基 Controls 与 Mobile Controls 仅定义了全局通用交互动作（Check/Do Action）与通用触摸交互（Tap on items to action them），未为各主机平台及移动端设立专属的“农作物采摘键位/输入逻辑”；
  - 请澄清这些按键为各平台的全局交互键，删除将移动端点击断言为专属采收操作的过度推导。

##### 【问题 D-RV-07】
- **原句位置**: Section: `Single-Crop Harvesting on PC` (Line 34)
- **原句内容**:
  > `Hand-harvested crops do not require swinging a harvesting tool; swinging an axe or pickaxe over a ripe crop could accidentally damage the soil.`
- **问题类型**: 读者价值与事实真实性 · 无来源依据的机制警告
- **修改要求**:
  - 维基及官方资料中并无“在成熟作物上挥舞斧头或镐子会损坏耕地”的直接机制条文（且常规作物成熟时工具挥击行为有其特定判定，非无条件损坏土壤）；
  - 请仅说明徒手采摘作物无需使用任何农具，删除关于挥斧挥镐损坏土壤的未经验证的警告推测。

##### 【问题 D-RV-08】
- **原句位置**: Section: `Rapid Harvesting: The Hold-and-Walk Technique` (Line 42, Line 44)
- **原句内容**:
  > `...harvests the mature plant on your current tile and immediately plants the new seed in the cleared soil.` (Line 42)
  > `Similarly, it cannot replant seeds over multi-harvest bushes like blueberries, where the living parent plant remains rooted in the ground after picking.` (Line 44)
- **问题类型**: 读者价值与事实真实性 · 绝对排他规则与即时底层机制臆测
- **修改要求**:
  - `facts-regrowth.md` 明确撤回关于即时播种（同帧判定）的技术推论，且原句未提供排他性禁止播种规则条文。长按右键边走边收播属于玩家一手实操经验（Forum quote）；
  - 请将表述修正为长按走动在收割单次作物腾空地块后可顺势播入新种子，删除“immediately”这一暗示底层即时机制的词汇；对于蓝莓等多收作物，仅说明采后地块仍保留存活植株（Stage 7）继续生长，无需也无法像空地一样再播入新种子，删除将其上升为游戏禁止性规则的绝对排他性用词。

##### 【问题 D-RV-09】
- **原句位置**: Section: `The 1.6 Iridium Scythe on Tilled Soil` (Line 58)
- **原句内容**:
  > `Swinging the iridium scythe harvests both scythe crops and regular hand-picked vegetables in a wide arc, alongside garden pot crops, spring onions, and wild seed forageables.`
- **问题类型**: 读者价值与范围边界 · 偏离主任务（违反 Rule 2 知识全部输出）
- **修改要求**:
  - 本文读者主任务是田间农作物的成熟辨认与收获操作。将室内花盆作物（Garden Pots）、大葱（Spring Onions）和野生种子采集物（Wild Seeds forageables）等非田间常规作物的采集机制全部罗列，偏离了农场作物收获的主意图；
  - 请聚焦于铱镰刀在耕地上收割大范围常规作物的能力，删除花盆、野葱和野籽采集物等无关范围扩展。

##### 【问题 D-RV-10】
- **原句位置**: Section: `Harvesting Giant Crops with an Axe` (Line 64)
- **原句内容**:
  > `Cauliflower, melon, pumpkin, powdermelon, and Qi fruit planted in a 3x3 grid of identical crops can combine into a giant crop.`
- **问题类型**: 读者价值与范围边界 · 偏离收获主任务（罗列生长养成细节）
- **修改要求**:
  - 依据 layout.md 规划，特殊作物章节聚焦于巨大作物的砍伐采收动作（任意斧头、砍击 3 下、掉落 15–21 个普通品质产物），明确排除展开 3×3 养成条件与全部生长品种的百科全书式罗列；
  - 请将重点严格限定在田间遇到 3×3 巨大作物时的斧头砍伐采收动作与掉落产物，简化前置生长养成条件的罗列。

---

### 2.3 门三：Repetition（同作用重复）—— 【PASS 通过】

对照 V7《02-内容生产与质量门.md》之 Repetition 门禁（段落/表格/FAQ 不重复承担同一作用）：

1. **旧版 D1 重复问题整改复查**:
   - **D-RP-01 已修复**: 原 Section 2.2 缺水停长与排错节原句整段近乎逐词复制（`Miss a day and the crop does not die... Sow into soil that is still dry...` 与 `For the parsnip and the pumpkin, a dry day does not kill the plant...`）已被清除。排错节现已改造为针对“成熟精灵图未如期出现”现象的简明对症诊断，不再原样复读规则推导过程。
   - **D-RP-02 已修复**: 原棚架作物章节与排错节连续两次完整列举“青豆、啤酒花、葡萄”及“枯死后可穿行”的重复说明已被大幅压缩。Section 5.2 承担棚架作物特性与留道规划说明，排错节仅保留角色无法靠近时的站位与采收提示。
   - **D-RP-03 已修复**: 原紧邻两节连续报数 `1, 2, 3, 4, and 3` 阶段天数的无意义复读已被彻底删除。
   - **D-RP-04 已修复**: 全文自造生硬术语 `the parsnip action` 与 `beside-it click` 已完全清除（全文检索出现次数均为 0）。
2. **段落作用独立性核验**:
   - 全文各段落分别承担直接解答、成熟识别、日历计算、单株操作、走动采播、镰刀工具分流、1.6 工具能力、特殊作物处理以及对症排错等独立功能，无同作用重叠段落。
3. **门三结论**: **PASS**。

---

## 三、门禁审查汇总与下一步指令 (Summary & Direction for Role C)

| 检查门类 | 判定结果 | 核心问题摘要与说明 |
|---|:---:|---|
| **Gate 1: ResearchTrace** | ✅ **PASS** | 维基元叙述（表格列、页面列举旁白）已彻底清除；无 5 类编辑腔；引用归因属合规事实说明。 |
| **Gate 2: ReaderValue** | ❌ **FAIL** | 存在 7 项影响读者价值与事实真实性的问题：成熟形态全称泛化、单株脚下点击无源引申、手柄/移动端通用键外推为专属采收键、无源斧镐损坏土壤警告、即时播种与排他蓝莓禁令断言、铱镰刀野外采集偏离主任务、巨大作物养成百科罗列偏离采收操作。 |
| **Gate 3: Repetition** | ✅ **PASS** | 旧版近乎逐词复读与自造口头禅已彻底清除；排错节已具备清晰的症状诊断结构。 |

### 审查定性与交接要求
1. **本审查会话状态**: 角色 D 第 1 轮复验任务已独立完成（**Review Task Succeeded**）；
2. **候选文本通过状态**: 英文正文候选稿未通过 V7 写后三门检查（**Content Candidate Gates Failed / Must-Fix**）；
3. **退回修改流程**:
   - 依据 V7 工作流，本报告问题清单已严格按“原句位置 + 问题类型 + 修改要求”格式输出，**未提供任何可直接粘贴的替换句**；
   - 必须由撰写员 Role C 根据上述修改要求用自己的语言修改英文正文 `en-body.md` 及配套引用映射；
   - 待 Role C 提交 Round 2 修订版本并更新哈希后，由 Role D 全量复验三门检查；通过后方可移交独立审核员 Role E。
