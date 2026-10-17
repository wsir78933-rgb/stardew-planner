# D 独立英文写后检查报告：house-upgrade-stardew（候选版本 draft-v1）

- 角色：D（独立英文写后检查）。与 A、B、C、E、F、T、G 均不相同。
- 任务 ID：`task_e07302bdea43`
- Dispatch ID：`ctx_1fa278b7ca02`
- 终端 Handle：`term_e0751eb6-fe65-40a6-af6d-4b14acefa5cd`
- 协调者 Handle：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- 审核日期：2026-10-15
- 依据标准：`/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` 第五节五项质量门之“前三门”（ResearchTrace、ReaderValue、Repetition）。
- 协调者输入指引：已读 `msg_6141de06143b`，确认审核指定版本 draft-v1.md 与 media-text.en.json；知悉 B 简报原四行精确菜单标签已由协调决定 `msg_741541b5415a` 收敛删除，不以缺少该四行标签判定事实缺口；知悉 M3 资产正在制作，本轮按 C 已确定的图位、alt、图注与图中文字进行三门审核。
- 报告约束：本报告仅输出“原句/位置 + 问题类型 + 修改要求”，不提供可直接粘贴的替换句，不直接修改正文后审自己；不使用“建议”弱化真正阻塞；不签空 PASS。

---

## 一、审核结果总览

| 质量门 | 结果 | 阻塞问题数 | 归属流向 |
|---|---|---:|---|
| **ResearchTrace** | **FAIL** | 4 | 表达退 C |
| **ReaderValue** | **PASS** | 0 | 通过 |
| **Repetition** | **FAIL** | 3 | 表达退 C |
| **三门综合结论** | **FAIL** | 7 | 全量返修需三门重做；共享修订预算扣减 1 轮（剩余 2 轮） |

---

## 二、被审文件与字节 SHA256

| 文件相对路径 | 字节数 | 行数 | SHA256 Checksum | 格式检查（UTF-8 / NFC / LF） |
|---|---:|---:|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` | 9,206 | 57 | `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | 4,443 | 129 | `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |
| `docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json` | 4,037 | 66 | `5db55ed0942f2114a01d4332c1bbb8fc6d480b9db974b8b3b615400a7d179f9e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | 7,955 | 239 | `f15c00643e6eabc93c26d3007a073f9be080040cc0e12d4727e1beab03c77ae4` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |
| `docs/blog-ops/house-upgrade-stardew/layout/task-card.md` | 8,089 | 112 | `1edb806157ef10adae0bf88151bcd43f106f9e47dae82841119ecb94f32fa8c9` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |
| `docs/blog-ops/house-upgrade-stardew/research/A/facts.json` | 34,063 | 460 | `618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e` | UTF-8, NFC=True, CRLF=False, EndsNewline=True |

---

## 三、真实验证执行与命令输出

验证脚本保存在 `docs/blog-ops/house-upgrade-stardew/reviews/D/verify.py`，执行输出日志记录于 `docs/blog-ops/house-upgrade-stardew/reviews/D/verification-commands.log`。

1. **SHA256 与 NFC 验证**：
   - 命令：`python3 docs/blog-ops/house-upgrade-stardew/reviews/D/verify.py`
   - 退出码：`0`
   - 结果：`draft-v1.md` 与 `media-text.en.json` 的 SHA256 与协调者分派完全一致，文本通过 NFC 校验，无 CRLF，换行符结尾。
2. **Git 空白字符与 Diff 检查**：
   - 命令：`git diff --check`
   - 退出码：`0`（stdout 与 stderr 均为 0 字节，工作区已跟踪文件无空白错误）。
   - 命令：`git diff --check --no-index -- /dev/null docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md`
   - 退出码：`1`（空错误输出，仅表示文件非空，无尾部空白或混合换行错误）。
3. **图文位置与内容对齐核验**：
   - 命令：`python3 docs/blog-ops/house-upgrade-stardew/reviews/D/verify.py`
   - 退出码：`0`
   - 结果：`media-text.en.json` 共记录 3 张图。
     - `cover-payments`（role: cover）：定义完整，由页面外壳/头部模版渲染。
     - `tier-rooms`（role: body）：正文第 13 行引用，src、alt、caption 与 JSON 保持逐字一致。
     - `upgrade-or-renovation`（role: body）：正文第 49 行引用，src、alt、caption 与 JSON 保持逐字一致。
4. **机械字数统计参考**：
   - 命令：`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md`
   - 退出码：`0`
   - 机械字数：`1070`，满足短文基线（`required_floor: 1000`）。
   - 说明：字数门（Length）最终由 F 在淬文阶段验收，D 不将机械字数作为质量门通过依据。

---

## 四、第一门：ResearchTrace 检查（FAIL）

### 检查标准
清除检索日志、助手残留、内部路径、写作指令及「读者口吻」定义的五类编辑腔（来源核查旁白、示例/实测免责、图片自我说明、文章自指与范围声明、验收词汇）。保留公开描述性来源引用与真实影响操作的条件。

### 发现的问题清单

#### 问题 RT-1
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 41 行末尾。
- **原句**：`The [Farmhouse](https://stardewvalleywiki.com/Farmhouse) notes state both totals as 450 times her shop price plus the upgrade fee.`
- **问题类型**：来源核查旁白（Category 1 编辑腔 / 研究痕迹）。
- **修改要求**：表达退 C。删除正文中叙述“维基注释如何计算并列出总数”的旁白；来源链接应当用于支撑前面的费用数字与计算事实，或融入描述性锚文本，不向读者交代维基注记的行文方式。不得直接提供替换句，由 C 用自己的话修改。

#### 问题 RT-2
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 23 行末尾。
- **原句**：`Go there while the counter is open, ask her to upgrade the farmhouse, and pay the row for the tier you are on.`（重点在 `pay the row for the tier you are on`）
- **问题类型**：文章自指（Category 4 编辑腔）。正文将文章 Markdown 表格的“行 (row)”当作游戏内实体/付款对象指导读者。
- **修改要求**：表达退 C。去除对文章表格“行 (row)”的自指，改为直接指代游戏内该档升级的费用与材料（如支付对应档位的费用）。不得直接提供替换句，由 C 用自己的话修改。

#### 问题 RT-3
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 33 行开头。
- **原句**：`The three days are the wait between the payment and the rooms in that row.`（重点在 `rooms in that row`）
- **问题类型**：文章自指（Category 4 编辑腔）。正文自指表格中的“行 (row)”。
- **修改要求**：表达退 C。去除对表格“行 (row)”的自指，改为直接说明工期是付款与该档位解锁房间完工之间的等待时间。不得直接提供替换句，由 C 用自己的话修改。

#### 问题 RT-4
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 19 行末尾。
- **原句**：`A write-up that still lists 50,000g and 150 Hardwood uses the earlier price.`
- **问题类型**：来源核查旁白 / 外部资料旁白（叙述第三方指南/文章的撰写状态，而非直接从玩家视角说明版本差异）。
- **修改要求**：表达退 C。改写掉对第三方 write-up 的外部旁白，从读者游戏版本或旧版数据的视角说明该差异（例如指明该数字为 1.6 之前的旧版数据，避免使用 write-up 等编辑性术语）。不得直接提供替换句，由 C 用自己的话修改。

### 核对后保留（不判编辑腔项）
- 第 1 行与第 19 行中链接至 `Version History`，说明第二档为 1.6 版本价格：属于版本差异操作条件，保留。
- 第 15 行与第 51 行图注开头使用 `Schematic.`：属于 V7 02 明确允许的示意图短标签，后文仅描述画面要素，无否定免责，保留。
- 第 29 行链接至站内 `carpenter-stardew`：属于读者面对罗宾缺勤/特殊日程时的自然延伸参考，保留。
- 第 41 行开头“Use this bill only for the first upgrade...”：明确限定该金币计算仅适用于罗宾全包木材的第一档升级，属于影响玩家操作的适用条件，保留。

---

## 五、第二门：ReaderValue 检查（PASS）

### 检查依据与执行
1. **意图与范围一致性**：对照原始关键词 `house upgrade stardew`、任务卡与实际 SERP，主意图为查清三档升级的费用、材料、工期、解锁内容及装修分流。文章未插入任何工具推广强行关联，也未扩展为婚姻、孩子、酒桶盈利等无关百科。
2. **单一读者任务完整度**：读者可完整走通“向罗宾购买下一档原版农舍升级并识别多出房间、避开错误订单”的全流程。
3. **实际操作例子走通**：
   - 例子：第一年玩家使用初始农舍，无木材储备，需罗宾供应全部 450 木材。
   - 步骤：450 木材 × 10g = 4,500g，加上 10,000g 升级费，总计带 14,500g 金币。周一至周四（非周二）9:00am–5:00pm 前往 24 Mountain Road 木匠店柜台下单。等待 3 天工期完工。
   - 结果：厨房（带烹饪灶台与可直接取用食材的冰箱）、双人床卧室解锁，满足结婚与美人鱼吊坠条件。
4. **失败分支走通**：
   - 分支 1（营业时间）：周二全天歇业无法下单；周五 4:00pm 提前打烊，4:00pm–8:00pm 虽可进门但柜台无人，必须等待次日柜台开放。
   - 分支 2（第二年涨价）：第二年起罗宾木材涨至 50g，全购木材需 22,500g + 10,000g = 32,500g；若玩家误带第一年的 14,500g，或试图卖出木材筹钱（收购价不涨），则金币不足无法下单。
   - 分支 3（装修撤销退款）：拆除婴儿床免费即时；添加餐厅花费 150,000g 即时完工；若想撤销餐厅获得 150,000g 全额退款，该扩展区域必须完全清空腾出。
   - 分支 4（多人联机）：联机中雇农仅能升级自己的小屋，无法替其他玩家升级主农舍。
   - 分支 5（美人鱼吊坠）：未等第一档 3 天施工完成前，无法向老水手购买美人鱼吊坠。
5. **正文图位服务主意图**：
   - 正文明确嵌入两处关键图位：`tier-rooms`（三档解锁房间识别）与 `upgrade-or-renovation`（第三档升级与装修的即时/可退款分流决策）。
   - 封面（三档付款阶段图）与正文表格各司其职，未出现以封面或表格伪装正文图完成的情况。

---

## 六、第三门：Repetition 检查（FAIL）

### 检查标准
段落、表格、图文不重复承担同一作用。三处承担同一作用的重复即指出，不用术语重复误杀；指出重复位置与可保留的唯一有效信息。

### 发现的问题清单

#### 问题 RP-1
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 45 行整段 对比 第 39 行 与 第 41 行。
- **原句**：`Year 2 costs more only because you are buying the Wood from her. The upgrade fee stays 10,000g. If you sell Wood to gather gold for the year-2 purchase, the selling price still has not risen with her shop, so you still need the later total of 32,500g. The year-1 purchase still needs 14,500g.`
- **问题类型**：重复（Repetition：整段机械复述前文已交代的前提与结论）。
- **重复位置**：
  1. 第 45 行：`The upgrade fee stays 10,000g` 与 第 39 行（`The first upgrade's 10,000g fee stays 10,000g in both years`）、第 41 行（`Add the 10,000g fee... Add the same 10,000g fee`）。
  2. 第 45 行：`the selling price still has not risen with her shop` 与 第 39 行（`The gold you receive for selling Wood does not rise with her year-2 shop price`）。
  3. 第 45 行：`so you still need the later total of 32,500g. The year-1 purchase still needs 14,500g` 与 第 41 行（`bring 14,500g... bring 32,500g`）。
- **可保留的唯一有效信息**：第 39 行已给出木材单价规则及卖出不涨价的前提，第 41 行已完整列出算式与 14,500g 及 32,500g 的总额。第 45 行无任何增量信息。
- **修改要求**：表达退 C。整段删除或压缩，消除对工费 10,000g、卖出不涨价、14,500g 与 32,500g 总数的第三次机械重复。不得直接提供替换句，由 C 用自己的话修改。

#### 问题 RP-2
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 57 行 对比 第 9 行 表格第 3 行 及 第 15 行 图 1 图注。
- **原句**：`The exterior after that upgrade stays the same as the previous upgrade ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).`
- **问题类型**：重复（Repetition：正文句子逐字重复表格与图注结论）。
- **重复位置**：第 57 行 与 第 9 行 表格第 3 行（`The exterior stays the same as the previous upgrade`）以及 第 15 行 图注（`Same exterior`）。
- **可保留的唯一有效信息**：表格与图 1 已经建立起第三档升级地下地窖且外观不变的事实。
- **修改要求**：表达退 C。在第 57 行中删除对外观不变的逐字复述，聚焦于第三档升级（地窖）与装修在决策机制上的本质差异。不得直接提供替换句，由 C 用自己的话修改。

#### 问题 RP-3
- **位置**：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md` 第 33 行 对比 第 7–8 行 表格第 1–2 行。
- **原句**：`Marriage can use the first upgrade once the upgrade is in place ([Marriage](https://stardewvalleywiki.com/Marriage)). The Mermaid's Pendant needs the first upgrade's construction finished, so the pendant comes after that three-day build ([Mermaid's Pendant](https://stardewvalleywiki.com/Mermaid%27s_Pendant)). The empty room, the crib, the two child beds, and the chance to have two children arrive after the second upgrade's own three days.`
- **问题类型**：重复（Repetition：正文段落重复列举表格已详尽列出的房间与家具清单）。
- **重复位置**：第 33 行 与 第 7 行（双人床、结婚、吊坠）、第 8 行（空房间、婴儿床、两张儿童床、两个孩子）。
- **可保留的唯一有效信息**：保留 3 天工期在操作时序上的核心事实（即施工未完成前吊坠不可买、新房间不可用）。
- **修改要求**：表达退 C。保留工期时序规则，删除对表格房间与家具描述的冗余列举。不得直接提供替换句，由 C 用自己的话修改。

---

## 七、交接与后续流向建议

1. **问题归属**：
   - 事实/研究缺口：无（A 事实包完整，现行费用、工期与 1.6 改价证据充足）。
   - 布局缺口：无（B 规划的教程结构、3 个 H2 及子问题覆盖合理）。
   - 表达问题：全部 7 项问题（RT-1 至 RT-4，RP-1 至 RP-3）均为正文行文中的编辑腔与机械重复，**全部归属退回写手 C 修改**。
2. **修订轮次提示**：
   - 本篇总共共享最多 3 轮修订预算（不按角色重置）。本次返修为第 1 轮返修，剩余 2 轮。
   - 写手 C 需在同一次返修中解决上述 7 项问题，使用自己的语言修改，不得沿用机械句式。
   - C 修改并提交后，独立 Agent D 将对新候选版本重新执行完整三门审核。
