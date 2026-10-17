# E 独立审核：house upgrade stardew 丰富英文稿

审核门：**FAIL**。问题数：**6**。这不是全流程 PASS。

SEOTruth 表面（Title / H1 / Description / FAQ）：**pending**。译文：**pending**。真实页面：**pending**。正文结论不能沿用为这三项的通过。

## 身份与输入

- 角色 E。任务 `task_d6f805015ae3`。Dispatch `ctx_d49b80437cfc`。终端 `term_6e60a146-8128-410d-a0d3-3ce7de341a58`。
- 协调者状态条 `msg_4ee78d1801f1`：D 已对同一正文 hash 签三门 PASS。E 未读 D 报告、作者自评或 issueDispositions，不以该 PASS 代替本审。
- 体裁：教程。主关键词 `house upgrade stardew`。语言与国家：英文，美国国家级。SERP 页脚为 `Results are not personalized` 与 `United States - From your IP address`。People Also Ask 未出现。
- 未打开新的网页。事实核对使用已保存的维基 innerText / wikitext / rendered 摘录。未使用 `research/upgrade-planning/versions/submission-v1`。
- `content/en/writer-submission.json` 只核对了 SHA，未读内容。

四输入 SHA256，均与协调者给定值一致，`shasum -a 256` 退出码 0：

| 文件 | SHA256 |
|---|---|
| `content/en/draft-v3.md` | `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154` |
| `content/en/public-references.en.json` | `4f0e5a4800252baf5879996171e261878dd6bbb46e83d7a4f5828faea7ea7d0a` |
| `content/en/media-text.en.json` | `8a6e1ce5ad8c74440e6bc4854c3740079520420c784457cd26ea98e0d9621f7b` |
| `content/en/writer-submission.json` | `c619f9f69b7c2e738424b242433cd91db866ade28278c218309c978b00c826d6` |

布局简报 SHA256 `0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc`，与协调者给定值一致。研究三份 `facts.json` 的 SHA256 也与给定值一致。

## 问题清单

只列原句、类型和修改要求。没有替换句。

### 1. `content/en/draft-v3.md` 第 29 行

原句：`Buying all 450 Wood in year 1 is 14,500g. The 200 already on hand is what changes 14,500g to 12,500g. Buying all 450 in year 2 or later is 32,500g, because her Wood price is then 50g`

- 类型：数字归属错误。14,500g 与 32,500g 被写成买下 450 Wood 的价款。
- 来源：`research/upgrade-planning/sources/01-wiki-farmhouse.json` 的 Notes。原页把买下全部 450 Wood 写成第一年 4,500g、第二年及以后 22,500g，再把升级费加上这份木材写成合计 14,500g 与 32,500g。450×10g=4,500g，加上 10,000g 才是 14,500g。450×50g=22,500g，加上 10,000g 才是 32,500g。
- 修改要求：不要把 14,500g 和 32,500g 写成买木材的价款，也不要让 50g 单独解释 32,500g。两数若继续与 12,500g 比较，必须保持同一种合计。正文目前没有写出 4,500g 和 22,500g。
- 范围外：`layout/enriched/writer-brief.md` 第 49 行有同样的 buying all 450 写法。E 不改简报。C 改正文时不能照这句简报把错误写回。

### 2. `content/en/draft-v3.md` 第 57 行

原句：`The house can be entered from 9:00am to 8:00pm while the shop is closed.`

- 类型：事实条件改写。
- 来源：`research/upgrade-planning/sources/02-wiki-carpenters-shop.json` Shop Closure。已保存原句是房子每天 9:00am 到 8:00pm 都能进入，商店关门时也一样。
- 修改要求：保留“每天”和“商店关门时也不例外”这两个条件。不要把进入时间收成只在商店关门期间。不要顺手补进下雨、节日或路过柜台的时刻。
- 范围外：`writer-brief.md` 第 84 行有同样的 while the shop is closed。E 不改简报。

### 3. `content/en/draft-v3.md` 第 57 行

原句：`Tuesday is closed, so a Tuesday visit cannot place the upgrade. Friday closes at 4:00pm, so on Friday the order has to be placed before then.`

- 类型：把带例外的营业时间写成无例外禁令。
- 来源：同一 Shop Closure。周二关门有下雨例外。周五 4:00pm 关门之后，已保存原文还写了她经过柜台时仍可能买到东西。第 59 行已经把下雨、节日、夏 18 诊所和路过柜台交给站内链接，但第 57 行的 cannot / has to 先把这两条例外否定了。
- 修改要求：删掉“周二前往就不能下单”和“周五订单必须在 4:00pm 前下完”这两句无例外结论。普通周的 9:00am–5:00pm、周二关门和周五 4:00pm 可以留下，但必须停在普通周，不能再推出全天禁止。不要把 Shop Closure 的时刻抄进正文。第 59 行的站内链接保留。
- 这一处是正文比简报多出来的推论。简报第 84 行只写 Tuesday is closed 和 Friday closes at 4:00pm，没有 cannot / has to。

### 4. `content/en/draft-v3.md` 第 61 行

原句：`Those three days run from the payment until that upgrade's rooms are finished. On the day you pay, those rooms are still unfinished`

- 类型：把来源没有写的工期起点写成游戏规则。
- 来源：Farmhouse 已保存句是 Robin requires three days to complete each farmhouse upgrade。Carpenter's Shop 房屋升级段是 Farmhouse upgrades require three days to complete。两句都没有“从付款日起算”，也没有“付款当天房间仍未完成”。Carpenter's Shop 引言里的 begins the day after buildings are purchased 以及两日完工，记在 `UP-construction-days-per-tier` 的边界和 `B-calendar-scheduling-constraints`（`publicAllowed: false`），不能套到农舍这三天。
- 修改要求：农舍升级只保留来源已写的“每档三天完成”。删掉从付款日起算，以及付款当天房间状态。不要改用“购买后次日开工”或“大多数建筑两天”填上。第 3 行和费用表已经有数字 3；若这一句删完后只重复数字 3，不要另写一句同作用复述。
- 范围外：`writer-brief.md` 第 86 行要求写这两句。E 不改简报。C 不能照这句简报把工期起点写回。

### 5. `content/en/draft-v3.md` 第 17 行

原句：`A Large Stump is the remains of a long-dead tree, not the stump left when you chop a living tree for Wood.`

链接只在同句后的 Large Stump。

- 类型：引用没有覆盖后半分句。
- 来源：`research/material-preparation/sources/large-stump-rendered.txt` 只支持前半：Large Stumps are the remains of long-dead trees，以及铜斧或更好、2 Hardwood。它没有写砍活树后留下的 stump。该对比在 `research/material-preparation/sources/wood-wikitext.json`：After felling the tree, the stump can be destroyed to yield between 5 and 9 Wood。
- 修改要求：保留 Large Stump 的身份、铜斧条件和 2 Hardwood。后半对比要么挂上写出普通树桩出 Wood 的来源，要么删掉这个来源页没有写的对比。不要把对比改成新的掉落规则。

### 6. `content/en/draft-v3.md` 第 55 行

原句：`She sells wood, stone, and furniture, she upgrades the farmhouse, and she constructs farm buildings`

- 类型：第 19 条。两个独立主谓之间用逗号拼接，不是目标语言的合法并列。
- 修改要求：改成合法并列或分句。出售木材、石头和家具，升级农舍，建造农场建筑，这三项事实保持不变。

## 长度

`正文计数.py --locale en` 退出码 0。

- 机械词数：1166
- 门槛 1000：达到
- 长文 2000：未达到
- 分类：short
- `sha256_raw` 与 `sha256_nfc_lf` 都是正文 hash `8ee52bfa…`
- 脚本字段 `semantic_qualification` 为 `requires_independent_review`。本审不把 1166 写成质量通过。
- 正式短文理由“主意图材料已写完”属于 F。F 尚未写。E 不代写。
- 计数字段：正文段落、列表和表格单元格。标题、图注、alt、URL 未计入。没有 FAQ、来源清单或 CTA 被混入。

## 主意图

SERP 相关搜索在 `research/A/sources/serp-google-house-upgrade-stardew.txt` 第 217–225 行：Full house upgrade、Best house upgrade、2nd / 3rd / 1st、cost、multiplayer、requirements。第 249–250 行是美国、非个性化页脚。没有 PAA。

任务卡把费用、材料、从初始房累计、房间直接用途和升级/装修区分放进主任务；不设排名节，不设小屋节。这与相关搜索一致，没有把规划器能力并进主意图。正文没有规划器推销，也没有把 Cabin 写成第二篇。

读者可以按文中条件完成：看三档现价、按秘密森林这一条准备硬木、在已声明的 200 Wood 条件下算第一年账单、从初始房加到指定档、使用厨房/婴儿床房间/地窖、在普通营业时间向 Robin 下一档、把装修和第三档分开。第 1、3、4 条问题使账单名称和营业/工期条件目前不可照做。

信息增益在这些位置，依据是算式或来源，不是字数：

- 第 21 行：在声明的前提下，由 12 Hardwood 一次收获推出第 9 次收获。这是算术，不是维基印好的日期。
- 第 27–29 行：手头已有 200 Wood 的第一年账单。
- 第 35–37 行：从初始房加到指定档，并写明不是一次柜台金额。
- 第 41–49 行：三档房间的直接用途。
- 第 63–73 行：第二档之后的即时装修，与第三档地窖分开。

## 22 条

| 编号 | 结果 | 理由 |
|---|---|---|
| 1 | 命中 | 第 57 行把下雨周二和周五路过柜台这两条会改变下单的例外，收成 cannot / has to。问题 3。其余钢斧、累计金额、第一年木价、Forester 不计，都是该留的操作条件。 |
| 2 | 未命中 | 没有因知识正确就写入树的棵数、九项装修价、189、婚礼或小屋。秘密森林走法在来源页上，服务于这一条硬木路线。 |
| 3 | 未命中 | 第 37 行三档累计是同一字段的三笔加法，数字不同，属于规格并列，不是只换词的排比。 |
| 4 | 未命中 | 没有反复出现“虽然…但是…”。 |
| 5 | 未命中 | 没有“我把这叫作”。Nursery 只用于图上标签和婴儿床房间的对应。 |
| 6 | 未命中 | 没有编排的经历或情绪转折。 |
| 7 | 未命中 | 没有“所有人都以为”。 |
| 8 | 未命中 | not / without 各句都改变操作：普通树桩、收获计数不是日期、200 Wood 不是柜台预留、累计不是一次付款、钢斧不是每条硬木路线、普通库存不卖硬木、进屋不等于下单。不删。 |
| 9 | 未命中 | 已核实价格用确定语气。不确定处写了条件，没有“未经实测”旁白。问题 4 是来源没有的工期起点，归入事实，不另算本条。 |
| 10 | 命中 | 第 29 行把合计 14,500g / 32,500g 写成买木材的精确价款。问题 1。第 19 行 about 2-3 tiles 与 Secret Woods 页 approximately 2-3 tiles 一致，不是虚假精确。 |
| 11 | 不适用 | 没有个人失败故事。教程不需要补故事。 |
| 12 | 命中 | 第 57 行把带例外的周二、周五收成每个人都适用的禁令。问题 3。秘密森林第 9 次收获写明了起点、Forester 和其他来源的条件，不是万能步骤。 |
| 13 | 未命中 | 段末是选择或账单，没有每段金句。第 73 行是地窖与两例装修的选择。 |
| 14 | 未命中 | 短句集中在算式步骤。不因句长接近而拆。 |
| 15 | 未命中 | 没有用感觉代替价格、天数或房间用途。 |
| 16 | 未命中 | 前三句给出三档现价、1.6 第二档、三天，并指向木匠店下单。 |
| 17 | 未命中 | 没有 worth noting、事实上、Notably 这类不改变逻辑的连接词。 |
| 18 | 未命中 | Wood、Hardwood、Large Stump、Large Log、Remove Crib、Add Dining Room 没有换成会误解的别名。图上 Remove crib 与正文 Remove Crib 是同一项，大小写不同，不构成第二个功能。 |
| 19 | 命中 | 第 55 行逗号拼接两个主谓。问题 6。其余句子是平实英文，不把中文鉴文阈值套进来。 |
| 20 | 未命中 | 200 Wood 和 9 次收获都写了假设条件，没有包装成某次实战或客户案例。 |
| 21 | 未命中 | 结尾停在地窖与两例装修的选择。没有祝福。 |
| 22 | 未命中 | 没有升到宏大命题。 |

## 六类形式指纹

| 指纹 | 结果 | 证据 |
|---|---|---|
| 破折号过密 | 未命中 | 正文 em dash 0，en dash 0。 |
| 粗体过密 | 未命中 | `**` 0。 |
| 无用装饰符号 | 未命中 | 两处 `!` 都是图片 Markdown，不是感叹句。 |
| 助手残留 | 未命中 | 无 TODO、内部路径、检索日志、助手自称。 |
| 填充短语 | 未命中 | 扫描 it's worth noting、notably、delve、leverage、furthermore、moreover、in conclusion、this guide、documented、source-backed、planning scenario，均为 0。 |
| 泛泛积极结尾 | 未命中 | 第 73 行是具体选择。 |

H2 六节，H3 两节。表格和步骤编号保留。

## 站点语气与禁词

没有另附品牌语料。正文是具体说明，没有虚构人格，没有“我升级过”，没有最快、最好、保证、稳赚。未把禁词表外的风格偏好写成问题。

## 读者口吻五类

| 类 | 结果 |
|---|---|
| 来源核查旁白 | 未命中。链接用 Farmhouse、Carpenter's Shop 等页面名。 |
| 示例/实测免责 | 未命中。第 21 行 “a count of harvests, not a calendar date” 说明数字的单位，保留。 |
| 图片自我说明 | 未命中。图注以 Schematic. 起句，其后只读标签。 |
| 文章自指与范围声明 | 未命中。第 43 行把图上 Nursery 对到婴儿床房间，是读图，不是“本文不讨论”。 |
| 验收词汇 | 未命中。没有 verify、readback、pass。 |

## 重复

费用表是三档查价。开头是直接答案。第 27–29 行和第 37 行把同一行价格用作算式输入。累计节与查价节作用不同。第 11 行只承担 1.6 旧价变更，50,000g 与 150 Hardwood 只在这一句。这些不记重复问题。

问题 4 若删掉工期起点后只剩“三天”，则与第 3 行和表中的 3 同作用，按该条修改要求处理，不另编号。

## 事实与引用

公开引用里每条 quote 在正文出现次数都等于 1。核对脚本退出码 0，`QUOTE_MISMATCH 0`。

| 主张 | 结果 | 证据 |
|---|---|---|
| 第一档 10,000g、450 Wood | 支持 | Farmhouse 与 Carpenter's Shop 升级行 |
| 第二档现行 65,000g、100 Hardwood | 支持 | 两页当前行。不是 50,000g |
| 1.6 由 50,000g、150 Hardwood 改为 65,000g、100 Hardwood | 支持 | Version History 1.6 子弹；Farmhouse History 1.6 同义句。旧价只在第 11 行 |
| 第三档 100,000g，材料格空白 | 支持 | 两页该行没有 Wood 或 Hardwood。空白不是“商店会拒收”的测试记录 |
| 每档三天完成 | 支持 | 两页的 three days to complete |
| 从付款日起算、付款当天未完成 | 不支持 | 问题 4 |
| 开局斧砍成熟树，铁匠铺升级；铜斧 2,000g 与 5 Copper Bars；钢斧 5,000g 与 5 Iron Bars | 支持 | Axes 等级表 `{{Price|2000}}`、`{{Name|Copper Bar|5}}`、`{{Price|5000}}`、`{{Name|Iron Bar|5}}` |
| 钢斧是秘密森林入口门槛，不是每条硬木路线的前提 | 支持 | Axes：Steel Axe is required to remove the large log that blocks the Secret Woods。Hardwood 页还有其他取得方式。第 21 行保留 |
| Large Stump：铜斧或更好，2 Hardwood | 支持 | Large Stump 页。Forester 的 50% 额外一块在同页，第 21 行已把该额外一块排除出计数 |
| 普通树桩对比 | 前半支持，后半链接不足 | 问题 5 |
| 六树桩每日 12；四上两下；两条有顶通道；约 2–3 格 | 支持 | `secret-woods-rendered.txt` 第 17 行 |
| 入口圆木 8 Hardwood、不再生 | 支持 | Large Log 页 |
| 第 9 次收获得到第 100 块 | 算术，不是维基规则 | 8×12=96，差 4，即 2 个树桩。条件与 `CALC-secret-woods-visits` 第一种一致。下一句写明是收获次数不是日期。三页链接支撑 12、2 和圆木，不支撑“维基写了第 9 次” |
| 第一年 Wood 10g；第二年及以后 50g | 支持 | Carpenter's Shop Permanent Stock |
| 12,500g | 算术 | 250×10g=2,500g，加 10,000g。只含升级费和这笔木材。保留 |
| 14,500g、32,500g 称为买下 450 Wood | 不支持 | 问题 1 |
| 累计 10,000 / 75,000 / 175,000，材料只算表内行 | 算术 | 10,000+65,000=75,000；再加 100,000=175,000。维基没有印这三笔合计。正文写了加法，并写明不是一次订单、不要一次付 75,000g 或 175,000g。保留 |
| 厨房灶台、冰箱 36 格、库存/冰箱/Mini-Fridge、水槽 | 支持 | Cooking 开篇；Farmhouse Notes 水槽句 |
| 第一档加卧室，单人床改双人床 | 支持 | Farmhouse 第一档 Changes |
| 第二档厨房卧室变大，空房，婴儿床和两张儿童床，两个孩子 | 支持 | Farmhouse 与 Carpenter's Shop 第二档。two children 在木匠店行 |
| 地窖、33 桶、奶酪/酒/Goat Cheese/Beer/Mead/Pale Ale、品质和价值、配方 20 Wood 与 1 Hardwood、别处可放但只在地窖接受 | 支持 | Farmhouse 第三档、Carpenter's Shop 第三档、Cask 配方与放置句。未写 189 |
| 室外 9×5，旁边格子不受升级影响 | 支持 | Farmhouse 的 9×5；Carpenter's Shop：footprint does not change, so no adjacent tiles are impacted |
| 24 Mountain Road；卖木材、石头、家具；升级农舍；建造建筑 | 支持 | Carpenter's Shop 开篇与信息框 |
| 普通周 9:00am–5:00pm | 支持 | 信息框 |
| 周二必不能下单；周五必须在 4:00pm 前 | 不支持 | 问题 3 |
| 房子只在商店关门时 9:00am–8:00pm 可进 | 不支持 | 问题 2 |
| 进屋不等于下单 | 支持为读者动作 | 来源区分房子可进入和柜台营业。保留 |
| 下雨、节日、夏 18、路过柜台 | 支持为链接主题 | 同一 Shop Closure 写了这些情况。链接 `https://stardewvalleyplanner.art/carpenter-stardew` 与研究里的既有页一致，不承担升级金币 |
| 第二档后装修即时；清空新增区域后退金币且立即到账 | 支持 | Farmhouse Renovations 与 Carpenter's Shop House Renovations |
| Remove Crib 免费；Add Dining Room 150,000g，9×10 加 4×5 | 支持 | Carpenter's Shop 装修表 |

## 图文

未打开页面，未做浏览器视觉检查。本阶段只对文字。

| 图 | 正文 | 结果 |
|---|---|---|
| 封面 `cover-payments` | 不在 Markdown 正文。`media-text.en.json` 放在 article-header | alt、caption、图中文字是 10,000g / 450 Wood / 3 days，65,000g / 100 Hardwood / 3 days，100,000g / 3 days。与费用表一致。没有 50,000g。第三档没有材料。 |
| `tier-rooms` 第 45–47 行 | 房间节，Nursery 句之后 | alt 与 caption 和媒体文件一致。Kitchen、Bedroom、Empty room、Nursery、Cellar、Same exterior、9×5 outdoors 与第 41–51 行一致。第 43 行说明 Nursery 是婴儿床房间。 |
| `upgrade-or-renovation` 第 65–67 行 | 装修节开头 | Upgrade / 3 days 与 Renovation / After upgrade 2 / Instant / Refunds gold 没有对调。Remove crib / Free、Dining room / 150,000g 与第 71 行一致。清空区域的条件在第 69 和 71 行，不在图上。图没有写成无条件退款。 |

两张正文图的 alt 和 caption 都能在 `draft-v3.md` 里整句找到。

## 保护的判断

- 第 21 行：钢斧只是这条秘密森林路线的入口；第二档仍付该行金币和 Hardwood。
- 第 21 行：第 9 次收获是收获次数，不是日期。算式可见。
- 第 27 行：200 Wood 是手头已有，不是 Robin 另留的一堆。
- 第 35–37 行：累计从初始房加到指定档，不是一次柜台金额。
- 第 31 行：普通库存卖 Wood，不卖 Hardwood。
- 第 51 行：室外足迹保持 9×5。
- 第 69–71 行：退金币前要清空新增区域。

## 待定与范围外

- SEOTruth：Title、H1、Description、FAQ 都还没有。pending。不因缺标题判正文缺陷，也不代写。
- 译文：本审输入没有中文正文。pending。不审中文图注。
- 页面：G 尚未组页。pending。本任务不跑浏览器。
- 未改文章、事实、布局、产品代码和控制文件。
- 轮次按协调者口径：第 2 轮进行中，已用 2/3，余 1，含译文返修。本 FAIL 不重置轮次。余下 1 轮仍要同时覆盖这次英文返修和之后的译文返修。这是风险记录，不是新方案。
- 用户终审：尚未进行。

## 命令

见 `reviews/E/enriched-v3/checks.log`。正文计数退出码 0。引用出现次数核对退出码 0。哈希核对退出码 0。
