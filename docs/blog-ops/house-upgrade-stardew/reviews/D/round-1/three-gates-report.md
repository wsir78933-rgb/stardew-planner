# D 独立英文写后检查报告：house-upgrade-stardew（候选版本 draft-v2，第 1 轮审核）

- **角色**：D（独立英文写后检查）。全新会话，与 A、B、C、E、F、T、G 均不相同。
- **任务 ID**：`task_dca8de3c3153`
- **Dispatch ID**：`ctx_550db8b749c7`
- **终端 Handle**：`term_11c655b7-18ca-4879-8731-533de96db588`
- **协调者 Handle**：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **审核日期**：2026-10-15
- **依据标准**：
  - `/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`
  - `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` 第五节五项质量门之“前三门”（ResearchTrace、ReaderValue、Repetition）及“读者口吻”小节。
- **审核目标**：对 `draft-v2` 全量重做 ResearchTrace / ReaderValue / Repetition 三门，不沿用 draft-v1 报告。
- **四行精确菜单标签背景**：知悉依据 `msg_741541b5415a`，因 `OBS-menu-image` 之 `publicAllowed=false`，四行精确菜单标签已由协调决定确认删去，本轮不要求加回未证标签。
- **报告约束**：本报告仅输出“原句位置 + 问题类型 + 修改要求”，不提供可直接粘贴的替换句，不直接修改正文；不使用“建议”弱化真正阻塞；不签空 PASS；不代签下游 E 审核、Length 门或页面装配。

---

## 一、审核结果总览

| 质量门 | 结果 | 阻塞问题数 | 详细结论与处理流向 |
|---|---|---:|---|
| **ResearchTrace** | **PASS** | 0 | 通过。正文与媒体文字已彻底清除检索痕迹、写作指令及五类编辑腔；合法来源链接与操作条件完整保留。 |
| **ReaderValue** | **PASS** | 0 | 通过。实际代入三档买下一档、普通营业、买450木材、即时装修四组核心读者场景全部走通；图表承担作用明确，无多意图百科漂移。 |
| **Repetition** | **PASS** | 0 | 通过。全篇段落、表格与图注比较，首轮 3 处重复已彻底消除；各段落、表格与图注各司其职，无机械复述。 |
| **三门综合结论** | **PASS** | 0 | **前三门全量审核通过**。移交下游独立审核者 Role E 进行八层独立鉴文与事实复核。 |

> [!NOTE]
> **共享修订预算说明**：本篇全流程共享最多 3 轮修订预算（不按角色重置）。写手 C 在第 1 轮返修中完成了 draft-v1 → draft-v2 的修改（已用 1/3，剩余 2 轮）。本次 Role D 的审核本身不重置、也不消耗新的改稿轮次。

> [!IMPORTANT]
> **关于英文篇幅的性质说明**：英文当前机械字数 970、去图注 917 为作者预览值。依照 V7 规则，字数门（Length）在淬文阶段由独立角色 Role F 最终验收并签署，D 负责前三门语义审核，不因机械字数低于 1000 底线而省略三个语义门，亦不能将本次语义 PASS 视为 Length 门 PASS。

---

## 二、被审文件与 SHA256 校验

所有被审文件均位于工作树 `博客-2`（`/Users/wusir/orca/workspaces/stardew planner/博客-2`）内：

| 文件相对路径 | 字节数 | 行数 | SHA256 Checksum | 格式检查（UTF-8 / NFC / LF） | 校验状态 |
|---|---:|---:|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md` | 8,720 | 55 | `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 一致（完全符合分派要求） |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | 4,443 | 129 | `55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 一致（完全符合分派要求） |
| `docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json` | 7,034 | 138 | `ac05e298a12927997d5bda1aa4b9ec7271080177912632597609cf008fd06d4f` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 存档完备 |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | 8,057 | 239 | `035eafb54c23eca693b3899ddf82c055fd091722e12f5f8c3902673ca172706a` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 引用完备 |
| `docs/blog-ops/house-upgrade-stardew/layout/task-card.md` | 8,089 | 112 | `1edb806157ef10adae0bf88151bcd43f106f9e47dae82841119ecb94f32fa8c9` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 布局基准 |
| `docs/blog-ops/house-upgrade-stardew/layout/writer-brief.md` | 8,679 | 125 | `6e15009775fdb1469514a3be9998a7340e481500867ee1e55e2dfadab344fa0d` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 写作简报 |
| `docs/blog-ops/house-upgrade-stardew/layout/media-plan.json` | 9,646 | 183 | `a7f1f374149cdfb3255c44ec2cda2045a08caadc7ff1042890c07e31b1fa51ad` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 媒体规划 |
| `docs/blog-ops/house-upgrade-stardew/research/A/facts.json` | 34,063 | 460 | `618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 事实底座 |
| `docs/blog-ops/house-upgrade-stardew/content/en/revision-round-1.md` | 4,729 | 68 | `24560c1d97500a74734d4f3ba0a9580ce27ca2142761eebf9310f7c8b3e12a62` | UTF-8, NFC=True, CRLF=False, EndsNewline=True | 返修记录 |

- `media-text.en.json` 内 `bodySha256` 明确绑定：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`，与 `draft-v2.md` 的真实哈希完全一致。

---

## 三、真实验证执行与命令输出

独立验证脚本位于：`docs/blog-ops/house-upgrade-stardew/reviews/D/round-1/verify.py`  
原始执行日志记录于：`docs/blog-ops/house-upgrade-stardew/reviews/D/round-1/verification-commands.log`

### 1. 验证命令执行与退出码
- **执行命令**：`python3 docs/blog-ops/house-upgrade-stardew/reviews/D/round-1/verify.py`
- **退出码**：`0`
- **真实标准输出**：
  ```
  === Role D Independent Verification Execution (Round 1: draft-v2) ===
  [Files Checked]
    draft_v2 (docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md):
      SHA256: 09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f
      Bytes: 8720 | Lines: 55
      NFC: True | CRLF: False | EndsNewline: True
    media_text (docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json):
      SHA256: 55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c
      Bytes: 4443 | Lines: 129
      NFC: True | CRLF: False | EndsNewline: True
    writer_submission (docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json):
      SHA256: ac05e298a12927997d5bda1aa4b9ec7271080177912632597609cf008fd06d4f
      Bytes: 7034 | Lines: 138
      NFC: True | CRLF: False | EndsNewline: True
    public_references (docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json):
      SHA256: 035eafb54c23eca693b3899ddf82c055fd091722e12f5f8c3902673ca172706a
      Bytes: 8057 | Lines: 239
      NFC: True | CRLF: False | EndsNewline: True
    task_card (docs/blog-ops/house-upgrade-stardew/layout/task-card.md):
      SHA256: 1edb806157ef10adae0bf88151bcd43f106f9e47dae82841119ecb94f32fa8c9
      Bytes: 8089 | Lines: 112
      NFC: True | CRLF: False | EndsNewline: True
    writer_brief (docs/blog-ops/house-upgrade-stardew/layout/writer-brief.md):
      SHA256: 6e15009775fdb1469514a3be9998a7340e481500867ee1e55e2dfadab344fa0d
      Bytes: 8679 | Lines: 125
      NFC: True | CRLF: False | EndsNewline: True
    media_plan (docs/blog-ops/house-upgrade-stardew/layout/media-plan.json):
      SHA256: a7f1f374149cdfb3255c44ec2cda2045a08caadc7ff1042890c07e31b1fa51ad
      Bytes: 9646 | Lines: 183
      NFC: True | CRLF: False | EndsNewline: True
    facts (docs/blog-ops/house-upgrade-stardew/research/A/facts.json):
      SHA256: 618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e
      Bytes: 34063 | Lines: 460
      NFC: True | CRLF: False | EndsNewline: True
    revision_record (docs/blog-ops/house-upgrade-stardew/content/en/revision-round-1.md):
      SHA256: 24560c1d97500a74734d4f3ba0a9580ce27ca2142761eebf9310f7c8b3e12a62
      Bytes: 4729 | Lines: 68
      NFC: True | CRLF: False | EndsNewline: True

  [Whitespace Check]
    docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md: clean=True (exit=1)
    docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json: clean=True (exit=1)

  [Media Alignment]
    Bound bodySha256: 09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f (Matches draft-v2)
    Total figures: 3
      Figure 'cover-payments' (cover):
        src_in_draft: False
        alt_in_draft: False
        caption_in_draft: False
      Figure 'tier-rooms' (body):
        src_in_draft: True
        alt_in_draft: True
        caption_in_draft: True
      Figure 'upgrade-or-renovation' (body):
        src_in_draft: True
        alt_in_draft: True
        caption_in_draft: True

  [Word Count Preview (Author Preview)]
    Raw mechanical_units: 970
    Required floor: 1000
    Meets floor: False
    Without captions: 917
    Note: Length gate is independently evaluated by Role F in tempering stage.

  === All Automated Verification Assertions Passed Successfully ===
  ```

### 2. Git 空白字符检查验证
- 命令：`git diff --check --no-index -- /dev/null docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md`
- 退出码：`1`（表示存在差异输出，但 stdout/stderr 均为空，无 trailing whitespace、CRLF 或 mixed indent 错误）。

### 3. 图文位置与内容对齐核验
`media-text.en.json` 定义的 3 张图片：
1. `cover-payments`（role: cover）：定义完整，由外壳/页面头部模板渲染，不在 Markdown 正文体内直接引用。
2. `tier-rooms`（role: body）：正文第 13 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。
3. `upgrade-or-renovation`（role: body）：正文第 47 行引用，`src`、`alt`、`caption` 与 JSON 逐字对齐。

### 4. 机械字数统计（作者预览参考）
- 命令：`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md`
- 退出码：`0`
- 脚本输出机械值：`970`；剔除 `Schematic.` 图注行后机械值：`917`。
- 说明：此项为作者预览值，D 记录此数值作为参考。D 本次按规定对正文进行完整严格的三门语义审核。

---

## 四、第一门：ResearchTrace 全量检查（PASS）

### 1. 检查依据
依据 V7 02 第三节“读者口吻”与第五节“五项质量门”：
- 清除检索日志、助手残留、内部路径、写作指令。
- 清除五类编辑腔：
  1. **来源核查旁白**（叙述核查状态或证据本身，如 documented、source-backed、wiki notes state 等）；
  2. **示例/实测免责**（声明自己没夸大、不是实测、planning scenario 等）；
  3. **图片自我说明**（解释图片用于表现什么、不代表什么、not a game screenshot 等）；
  4. **文章自指与范围声明**（如“本文”、“this guide covers”、“in that row”、“decision aid” 等）；
  5. **验收词汇**（向读者输出流程验收动词，如 verify、readback、复核、pass 等）。
- 保护性保留：公开引用的描述性锚文本、真正影响操作的条件。

### 2. 首轮 4 项 RT 问题处置核验
- **原 RT-1**（第 41 行叙述维基注记如何计算）：已彻底删除，改为由 `[Farmhouse]` 链接直接支撑 14,500g 和 32,500g 计算事实，无来源叙述旁白。
- **原 RT-2**（第 23 行自指表格行 `pay the row for the tier you are on`）：已修改为 `pay the gold and materials for your next tier`，彻底去除对文章表格“行”的自指。
- **原 RT-3**（第 33 行自指表格行 `the rooms in that row`）：已修改为 `until the rooms from that upgrade are finished`，彻底去除对表格行的自指。
- **原 RT-4**（第 19 行外部资料旁白 `A write-up that still lists...`）：已改写为游戏版本直接陈述 `Before 1.6, that upgrade cost 50,000g and 150 Hardwood ([Version History](https://stardewvalleywiki.com/Version_History)).`，消除了编辑性术语。

### 3. 全量逐句扫描结果
对 `draft-v2.md` 全文 55 行及 `media-text.en.json` 进行了全量语义扫描：
- **类别 1（来源核查旁白）**：未命中。所有外部链接均为主张支撑或描述性锚文本（如 `[Farmhouse]`、`[Version History]`、`[Carpenter's Shop]`、`[Marriage]`、`[Mermaid's Pendant]`、`[Cabin]`），无叙述核查状态的词汇。
- **类别 2（示例/实测免责）**：未命中。计算示例直接列明假设前提（如 `only when Robin sells you all 450 Wood, and only with no other spending added`），无“这不是实战统计”等免责声明。
- **类别 3（图片自我说明）**：未命中。两处正文图注均仅以允许的单字短标签 `Schematic.` 开头，后文直接列出画面中的档位、房间名和文字，无否定式免责。
- **类别 4（文章自指与范围声明）**：未命中。正文彻底排除了 `in this guide`、`this article`、`the following table`、`row` 等自指词。
- **类别 5（验收词汇）**：未命中。无 `verify`、`readback`、`pass`、`check sources` 等动作要求读者执行。
- **内部路径与指令残留**：无任何内部路径、草稿说明或助手残留。

**结论**：**ResearchTrace PASS**，阻塞问题数：`0`。

---

## 五、第二门：ReaderValue 全量检查（PASS）

### 1. 检查依据
依据 V7 02：
- 对照用户原始关键词 `house upgrade stardew`、任务卡与实际搜索依据，确认主意图为“查清向罗宾购买下一档原版农舍升级要付什么、等几天、完工后得到什么，并区分第二档之后的即时可退款装修”。
- 确认没有为了产品推广或关联工具而并入多意图百科。
- 确认读者能够完成单一主任务。

### 2. 四组核心读者场景代入验证

#### 场景 1：三档买下一档（Buying the Next Tier）
- **第一档（初始农舍 → 档位 1）**：
  - 费用与材料：10,000g + 450 Wood。工期：3 天。
  - 解锁内容：厨房（带烹饪台，冰箱可直接充当箱子并支持使用内部食材烹饪）、独立卧室、单人床升级为双人床；解锁结婚资格与美人鱼吊坠购买资格（需 3 天施工完成）。
- **第二档（档位 1 → 档位 2）**：
  - 费用与材料：65,000g + 100 Hardwood（明确为 1.6 现行版本价格）。工期：3 天。
  - 解锁内容：厨房与卧室面积扩建、一间空房间、一间带婴儿床和两张儿童床的育儿室（允许生养两个孩子）；解锁房屋装修（Renovations）。
- **第三档（档位 2 → 档位 3）**：
  - 费用与材料：100,000g（无木材或硬木要求）。工期：3 天。
  - 解锁内容：厨房下方新增地窖；外观与前一档保持一致（户外占地维持 9×5 不变）。
- **验证结论**：处于任何档位的读者均能立即对齐自己的下一档购买清单、材料堆叠要求与完工收益，流程完全可执行。

#### 场景 2：普通营业与下单规则（Normal Operating Hours & Ordering）
- **地点**：24 Mountain Road，木匠店（Carpenter's Shop）。
- **营业时间**：
  - 常规周：9:00am–5:00pm。
  - 休息与提前关门：周二柜台全天关闭（无法下单）；周五 4:00pm 提前打烊（必须 4:00pm 前下单）；其余普通工作日 9:00am–5:00pm 办理。
  - 进门与柜台区分：房屋大门在 9:00am–8:00pm 期间始终可进，但柜台打烊后进门无法下单，必须等待次日柜台重新开放。
  - 复杂例外分流：雨天、节日、夏 18 诊所等日程通过站内内链自然衔接。
- **工期时序防踩坑**：
  - 明确对比：罗宾建造普通农场建筑多为 2 天（下单后第 2 天早晨完工）；但农舍升级**严格为整 3 天**，付款当天新房间未完工，美人鱼吊坠必须在 3 天完工后方可购买。
- **多人联机边界**：
  - 雇农带相同费用只能升级自己的小屋（Cabin），不能替其他玩家升级主农舍。
- **验证结论**：营业时间、打烊陷阱、工期时钟与联机权限边界清晰，无不可操作卡点。

#### 场景 3：买 450 木材连工费核算（Buying 450 Wood from Robin）
- **价格规则**：罗宾处木材第 1 年单价 10g，第 2 年起涨至 50g；农舍升级基本工费 10,000g 在各年份均保持不变；玩家向罗宾卖出木材的收购价在第 2 年**不随之上涨**。
- **第一年玩家（无木材储备）**：
  - 木材花费：450 × 10g = 4,500g。
  - 连工带料总额：4,500g + 10,000g = **14,500g**。
- **第二年及以后玩家（无木材储备）**：
  - 木材花费：450 × 50g = 22,500g。
  - 连工带料总额：22,500g + 10,000g = **32,500g**。
- **自备木材玩家**：
  - 箱中有 450 木材时，无论第 1 年还是第 2 年，均只需带 10,000g 和 450 木材，商店木材涨价对其无影响。
- **验证结论**：假设条件明确，算式严密，完全解决搜索者关心的一档木材采购痛点。

#### 场景 4：即时装修与第三档升级区分（Instant Renovations vs Tier 3）
- **装修基本机制**：
  - 解锁前提：第二档农舍升级完工之后解锁（不要求做完第三档）。
  - 工期特征：**下单立即完成**（Instant），无 3 天等待。
  - 退款机制：撤销装修时**全额即时退回所花费金币**；退款条件是扩建区域必须腾空（unoccupied）。
- **两项典型对比案例**：
  - 拆除婴儿床（Remove Crib）：**免费**，下单即时完成。
  - 增加餐厅（Add Dining Room）：花费 **150,000g**，即时增加 9×10 + 4×5 空间；清空后可撤销并即时退回 150,000g。
- **与第三档升级的本质区分**：
  - 第三档升级花费 100,000g，需等待 3 天，获得的是地下地窖；而装修是针对地上已有房间的即时可逆结构调整。读者能够清晰根据需求分流，避免下错订单。
- **验证结论**：区分逻辑与决策依据充分，彻底排除把装修误当第四档升级的操作风险。

### 3. 图表承担的作用与重复边界
- **封面图（`cover-payments`）**：头部 LCP 视觉载体，直观呈现三档金币、材料与 3 天工期阶段。
- **正文图 1（`tier-rooms`）**：置于第一节，承担三档完工后新增房间的阶段示意图及 9×5 户外占地示意；不重复表格中的冰箱、床具、烹饪等数据细节。
- **正文图 2（`upgrade-or-renovation`）**：置于第三节开头，承担“永久升级（3天） vs 即时装修（即时、可退款）”的双分支决策树示意，辅以两项基准案例。
- **正文表格**：全面承载三档升级的核心数据规格、详细解锁物品行为及前置依赖。
- **正文段落**：承担行动指导、营业例外、防踩坑逻辑、连工费核算与具体场景决策。
- **边界划分**：图表提供宏观认知结构，段落提供行动条件与决策细节，各司其职，无功能越界。

**结论**：**ReaderValue PASS**，阻塞问题数：`0`。

---

## 六、第三门：Repetition 全量检查（PASS）

### 1. 检查依据
依据 V7 02：
- 段落、表格、图注不重复承担同一作用。
- 不因前轮删除已做而默认过，必须全篇比对段落之间、段落与表格、段落与图注。

### 2. 首轮 3 项 RP 问题处置核验
- **原 RP-1**（draft-v1 第 45 行整段机械复述前文已交代的前提与结论）：已于 draft-v2 中**整段彻底删除**。保留了第 39 行的基本规则、第 41 行的代购计算以及第 43 行的自备木材对照，逻辑链条紧凑，无冗余复述。
- **原 RP-2**（draft-v1 第 57 行逐字重复表格与图 1 图注中“外观与上一档相同”）：已于 draft-v2 中**彻底删除**。第 55 行直接聚焦于第三档地窖与装修案例的抉择对比，不再做重复的外观交代。
- **原 RP-3**（draft-v1 第 33 行冗余列举表格已详尽列出的二档房间与家具清单）：已于 draft-v2 中**彻底删除冗余清单**。保留了 3 天工期对结婚与美人鱼吊坠的时序限制，并自然引出即时装修对比，无清单重复。

### 3. 全量跨段落、跨表格、跨图注比对分析
- **引言段（第 1 行） vs 正文数据表（第 5–9 行）**：引言段仅按 V7“开头三句给出直接答案”的规范，高度概括三档费用、版本背景与下单地点；详细规格由表格承担，不构成功能重叠。
- **数据表（第 5–9 行） vs 图 1 图注（第 15 行） vs 段落（第 11 行）**：
  - 表格承担全面的数据规格与解锁行为；
  - 图 1 仅提供房间标签与户外 9×5 轮廓；
  - 第 11 行负责解释户外 9×5 占地不变对周边地块的影响，以及未升级前室内 10×7 的初始状态。三者作用互补，无重复。
- **H3 版本说明段（第 19 行）**：
  - 聚焦回答子问题“为什么攻略有 50k/150 旧数据”，陈述 1.6 调整事实与应带金额，未向其他章节泛化。
- **木材计算段（第 39–43 行）**：
  - 第 39 行：公布木材价格变动规则及卖出不涨价前提；
  - 第 41 行：展开罗宾全包木材的第一档总账核算（14,500g vs 32,500g）；
  - 第 43 行：给出自带木材时的操作对比（无论年份均只需 10,000g + 450 木材）。
  - 三个段落层层递进，各自承担唯一定位，无同义反复。
- **第三节装修对比段（第 51–55 行）**：
  - 第 51 行：陈述装修的解锁条件（二档后）、即时完成与清空退款总规则；
  - 第 53 行：给出拆除婴儿床（免费）与增加餐厅（150k、9×10+4×5、清空退款）两项具象指标；
  - 第 55 行：直接进行地窖升级（100k、3天）与装修的决策分流，并在最终判断处干脆收尾。
- **无多余总结与 FAQ 模块**：文章在最后一个有效判断处自然收尾，未添加任何重述前文的总结段或冗余 FAQ。

**结论**：**Repetition PASS**，阻塞问题数：`0`。

---

## 七、共享修订预算与下游交接

### 1. 共享修订预算状态
- 全流程整篇文章共用最多 3 轮修订预算（含译文返修）。
- 本篇历史执行：
  - 第 1 轮返修：由 Role C 在 draft-v1 基础上完成，消耗 1 轮。
  - 本次审核：Role D 对 draft-v2 进行独立三门全量复审，**三门均已通过，无阻塞问题，不消耗新的改稿轮次**。
- 当前预算结余：**已用 1 轮，剩余 2 轮**。

### 2. 下游交接与角色权限边界
- **流向**：本报告签署三门全部 PASS 后，英文候选版本 `draft-v2` 正式移交**独立审核者 Role E**。
- **下游职责说明**：
  - 由 Role E 依据 `22条鉴文规则` 独立开展八层鉴文、事实复核与引用验证。
  - 随后由 Role F 进行淬文并验收字数门（Length）。
- **权限边界声明**：Role D 严格限定于独立英文写后检查（ResearchTrace、ReaderValue、Repetition 三门），**严禁且未代签 Role E 审核、Length 门或页面装配**。

---

## 八、绑定哈希与原始数据确认

- **正文候选文件**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md`
  - **SHA256**：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- **媒体文本文件**：`docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json`
  - **SHA256**：`55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c`
  - **绑定的 bodySha256**：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- **验证命令退出码**：`0`
- **验证日志文件**：`docs/blog-ops/house-upgrade-stardew/reviews/D/round-1/verification-commands.log`
- **结构化报告文件**：`docs/blog-ops/house-upgrade-stardew/reviews/D/round-1/three-gates-report.json`
