# D 复验增补：Repetition（house-upgrade-stardew draft-v2）

- 角色：D。独立复验续核。不改正文，不代签 E，不代签 Length。
- 对象：`docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md`
- 媒体文本（只读）：`docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json`
- 正文 SHA-256：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- 媒体文本 SHA-256：`55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c`
- 媒体文本内 `bodySha256` 与正文字节哈希相同。
- 历史报告保持原样：`reviews/D/round-1/three-gates-report.md` 与 `.json`。本增补不修改它们。
- 共享修订预算不因本增补重置或消耗。`control/operation-store.json` 仍为正式返修第 1 轮、已用 1、剩余 2、最多 3。本文件不改该记录。

## 结论

**Repetition：FAIL。** 阻塞问题 6 个，对应 10 句可删原句。这不是文章通过，也不是三门通过。

作废 D2（`reviews/D/round-1`）**Repetition PASS** 的后续使用。同时作废该报告里依赖这次 Repetition PASS 的「三门综合 PASS」和「移交 E」。历史报告保留，供对照，不再作为现行重复性结论。

ResearchTrace 与 ReaderValue：正文和媒体文本哈希与 D2 报告绑定的哈希相同，本增补没有重跑这两门，也不签署这两门。D2 对这两门的文字仍只是同一哈希上的历史记录。E 与 Length 均未签署。用户尚未回答的长度门槛例外不能当成授权；本增补不跑 F，不等待，不改稿，也不重跑已有机械计数。

## 用过的标准

V7 `02-内容生产与质量门.md` 第五节 Repetition 的通过依据是：「段落/表格/FAQ 不重复承担同一作用」。失败时必须指出：「重复的两处位置、可保留的唯一有效信息」。

同文件第三节：「一个段落完成一个主要作用……删除后任务不受影响的重复段优先删。」结尾：「不要将前文换词复述成新模块」。

同一节「读者口吻」五类编辑腔属于 ResearchTrace，不是 Repetition 的通过条件。这里只在第 19 行说明一句：D2 为去掉 RT-4 的写稿旁白而换上的旧价句，现在构成重复；返修时不能把那句旁白粘回去。本增补不因此重签 ResearchTrace。

判定方法：删掉该句后，读者是否还少一项别处没有的信息或动作。少，就失败。不少，就保留，并写出删掉会缺的那一项。同一数字可以在直接答案、查表和带新条件的动作里各出现一次。没有新条件的再次付款说明，算同一作用。

## 与 D2 一致的部分

这些是对过 draft-v1 与 draft-v2 原句后的结果，不是沿用 D2 的 PASS。

1. 原 RP-1 已不在 v2。v1 第 45 行把 10,000g、卖出不涨价、14,500g、32,500g 再总结一遍。v2 没有该段。14,500g 与 32,500g 只在第 41 行的算式里。
2. 原 RP-2 的正文句已不在 v2。v1 第 57 行「The exterior after that upgrade stays the same as the previous upgrade」已删除。v2 第 55 行不再写外观。「Same exterior」只留在表第 3 行和图 1 的画面标签、图注里。图注描述画面，表给出该档结果，二者作用不同。
3. 原 RP-3 的房间清单句已不在 v2。v1 第 33 行「The empty room, the crib, the two child beds, and the chance to have two children arrive after the second upgrade's own three days.」已删除。
4. 没有 FAQ，也没有把全文换词再总结的收束段。文章停在第 55 行的选择句。
5. 旧第二档价格 `50,000g and 150 Hardwood` 只出现在第 19 行。第 47、49、53 行的 `150,000g` 是加餐厅的价钱，不是这组旧价。D2 写的「未向其他章节泛化」对这组旧价成立。它不能证明第 19 行内部三句各有独立作用。

## 与 D2 不一致的部分

D2 第六节对第 19 行只写：「聚焦回答子问题……陈述 1.6 调整事实与应带金额，未向其他章节泛化。」没有对照这三句各自删掉后还剩什么。D2 因此签了 Repetition PASS。本增补按原句判断，第 2 句和第 3 句失败。

D2 第六节没有对第 25、27、31、33 行做逐句作用对照。本增补里，这些行有的句子失败，有的句子保留。不是整行失败，也不是因为被点名就失败。

D2 第四节把第 19 行第 3 句写成 RT-4 的清除结果：v1 的 `A write-up that still lists...` 换成了 `Before 1.6, that upgrade cost 50,000g and 150 Hardwood`。编辑腔那句确实不在 v2。换上的句子与第 1 句的 from 分句是同一旧价，所以 Repetition 失败。两件可以同时成立。

## 阻塞问题

不提供可粘贴的替换句。修改要求只指出删哪一句、留下的已有信息在哪。

### RP-R1

- 问题类型：重复。同一段内，旧价被说了两次，作用都是回答「第二档曾经是 50,000g 和 150 Hardwood」。
- 原句位置：第 19 行第 3 句 `Before 1.6, that upgrade cost 50,000g and 150 Hardwood ([Version History](https://stardewvalleywiki.com/Version_History)).`
- 另一处：同段第 1 句的 from 分句 `moved from 50,000g and 150 Hardwood`。出处链接也是 Version History。
- 可保留的唯一有效信息：第 1 句已经给出 1.6 从这组旧价改走的方向。引言没有写出 50,000g 或 150 Hardwood。
- 删掉第 3 句后仍在的读者信息：看到旧攻略上的这组数字时，知道它们是 1.6 改价之前的价格。
- 修改要求：表达退 C。删去第 3 句，使这组旧价在全文只留在第 1 句的 from 分句。不要写回 v1 的 `A write-up that still lists`。不要另造一句辨认攻略的话。

### RP-R2

- 问题类型：重复。第 19 行把「购买第二档时带上 65,000g 和 100 Hardwood」再说成一个动作，而同句的 to 分句和后文携带句已经给出这组现行价。
- 原句位置：第 19 行第 2 句 `When you buy the second upgrade, bring 65,000g and 100 Hardwood.`
- 另一处：同段第 1 句 `to 65,000g and 100 Hardwood`；第 25 行 `For the second upgrade, carry 65,000g and 100 Hardwood.`；表第 2 行金币与材料格。
- 可保留的唯一有效信息：第 1 句的 to 分句是改价的终点，必须留在改价句里。表第 2 行是按当前房子查下一档的格子。第 25 行里要留下的不是这组数字本身，而是后面两句「Hardwood 是单独一叠、不是罗宾出售的 Wood」（见 RP-R3）。
- 删掉第 2 句后仍在的读者动作：按 1.6 之后的 65,000g 和 100 Hardwood 理解第二档，而不是按旧价。
- 修改要求：表达退 C。删去这句带来动作。不要在版本段再写一次应带金额。

### RP-R3

- 问题类型：重复。第 25 行三句携带金额与表的金币、材料格或第 43 行的已有木材付款是同一作用。
- 原句位置：
  1. `For the first upgrade, carry 10,000g and 450 Wood when that Wood is already yours.`
  2. `For the second upgrade, carry 65,000g and 100 Hardwood.`
  3. `For the third upgrade, carry 100,000g.`
- 另一处：
  1. 第 43 行 `When the 450 Wood is already in your chests... Bring 10,000g and the 450 Wood.`
  2. 表第 2 行 `65,000g` 与 `100 Hardwood`。
  3. 表第 3 行 `100,000g`，材料格为空。
- 可保留的唯一有效信息：
  - 第 25 行 `Carry one tier at a time.` 表没有这句。删掉后，读者不知道这一次只带下一档。
  - 第 25 行 `The 100 Hardwood is its own stack. It is a separate material from the Wood Robin sells.` 表把 Hardwood 和 Wood 分成两格，但没有说柜台前不能用罗宾的 Wood 代替 Hardwood。删掉后会缺这个动作。
  - 第 43 行保留「木材已在箱子里」的付款，并多出「两年看起来相同」和「10g 或 50g 的商店价不进入这笔付款」。第 25 行第 1 句没有这两项。
- 修改要求：表达退 C。删去上面三句携带金额。留下「一次一档」和 Hardwood 单独成叠这两句。已有 450 Wood 时带 10,000g 和这些木材的说明只留在第 43 行。

### RP-R4

- 问题类型：重复。同一段里，普通日下单窗口和关门后仍能进门各说了两次。
- 原句位置：
  1. 第 27 行 `On the other ordinary days, place it between 9:00am and 5:00pm.`
  2. 第 27 行 `After the counter has closed, and until 8:00pm, the door still opens.`
- 另一处：
  1. 同段第 1 句 `On an ordinary week the counter runs from 9:00am to 5:00pm.` 周二、周五两句已经改写例外。第 4 句没有新的钟点，也没有新的星期。
  2. 同段 `The house itself can be entered from 9:00am to 8:00pm even while the shop is closed`。后一句的终点仍是 8:00pm，没有新的门禁边界。
- 可保留的唯一有效信息：见下文「第 27 行保留句」。下单动作本身在第 23 行和周二、周五两句里已经有。
- 修改要求：表达退 C。删去这两句。不要把 9:00–17:00 或「关门后到 20:00 门还开着」再写一遍。

### RP-R5

- 问题类型：重复。三天段里有两句只再次说出表或本段已经给出的工期结果。
- 原句位置：
  1. 第 31 行 `The kitchen, the added rooms, or the cellar from that payment is in the house after those three days.`
  2. 第 31 行 `A farmhouse upgrade stays on three days.`
- 另一处：
  1. 表的「Added when the work finishes」列已经按行写出厨房、增加的房间、地窖；天数列是 3。这句用 or 把三样并在一起，没有比表更明确的「这笔付款对应哪一行」。
  2. 同段第 1 句 `Every farmhouse upgrade takes three days`，以及 `That two-day finish is the clock for those other buildings.` 后一句已经把「第二天开始时完成」限定到其他建筑。末句没有新的起点、终点或排除对象。
- 可保留的唯一有效信息：见下文第 31 行保留的三句。两天早晨这条规则只属于其他建筑；农舍基线是本段第 1 句的三天。
- 修改要求：表达退 C。删去这两句。不要为了再强调三天而换词写回来。

### RP-R6

- 问题类型：重复。美人鱼吊坠句同时重复表内「施工完成」和三天等待。
- 原句位置：第 33 行 `The Mermaid's Pendant needs the first upgrade's construction finished, so the pendant comes after that three-day build ([Mermaid's Pendant](https://stardewvalleywiki.com/Mermaid%27s_Pendant)).`
- 另一处：表第 1 行 `The Mermaid's Pendant needs completed construction on this upgrade`；同表天数列为 3；第 33 行前两句已经写出从付款到房间完成的区间，以及付款当天房间尚未完成。
- 可保留的唯一有效信息：表第 1 行的「completed construction」已经把吊坠和「只是付了款」分开。三天区间留在第 33 行前两句。
- 修改要求：表达退 C。删去这句吊坠时序。不要在三天段把表里的吊坠条件再讲一遍。

## 点名位置里判为必要、不失败的句子

### 第 19 行第 1 句

`In 1.6 the second house upgrade moved from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood ([Version History](https://stardewvalleywiki.com/Version_History)).`

新增信息：1.6 这一次改价的方向，以及旧价数字。引言只说第二组费用「是 1.6 的价格」，没有 50,000g 和 150 Hardwood。表和第 17 行标题也只有现行价。

删掉会缺：子问题「为什么有的攻略写 50,000g 和 150 Hardwood」的唯一回答。

### 第 25 行保留的两句

`Carry one tier at a time.`

新增动作：这一次只带下一档，不把三档材料一起带去。表是三行对照，没有这句。

`The 100 Hardwood is its own stack. It is a separate material from the Wood Robin sells.`

新增动作：100 Hardwood 不能用罗宾出售的 Wood 顶替。表只并列两种材料名。

### 第 27 行保留的五句

1. `On an ordinary week the counter runs from 9:00am to 5:00pm.` 删掉会缺普通周柜台基线。全文没有第二处给出这个基线。
2. `Tuesday is closed, so a Tuesday visit cannot place the upgrade.` 删掉会缺周二不能下单。
3. `Friday closes at 4:00pm, so on Friday the order has to be placed before then.` 删掉会缺周五 16:00 这个不同截止点。
4. `The house itself can be entered from 9:00am to 8:00pm even while the shop is closed ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).` 删掉会缺「商店关着时房子仍可进入到 20:00」。
5. `The upgrade waits until the counter is open again.` 删掉会缺「人已经进门也不等于下成了升级」。上一句只说进得去，没有说订单要等柜台。

### 第 31 行保留的三句

1. `Every farmhouse upgrade takes three days ([Farmhouse](https://stardewvalleywiki.com/Farmhouse)).` 这句是本段对比的农舍基线。表里也有 3，但本段接着给出其他建筑的两天规则；没有这句，本段会只剩下两天规则。引言的三天是开头答案，不承担「不要拿两天早晨来排农舍」这个对比。
2. `Most of her other construction finishes in two days, at the start of the second day after the order ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).` 删掉会缺任务卡禁止误用的那条两天早晨规则本身。表没有这条。
3. `That two-day finish is the clock for those other buildings.` 删掉会缺「这条钟只用于其他建筑」。它和末句不同：末句只把三天再说一遍。

### 第 33 行保留的四句

1. `The three days run from the payment until the rooms from that upgrade are finished.` 新增边界：三天从付款算到该档房间完成，不是「第 N 天早晨」。表的天数列没有起点。
2. `On the day you pay, that order's rooms are still unfinished.` 新增可观察结果：付款当天这批房间还没完成。
3. `Marriage can use the first upgrade once the upgrade is in place ([Marriage](https://stardewvalleywiki.com/Marriage)).` 表第 1 行只写 `Marriage needs at least this upgrade`，没有写「就位之后才能用」。只写「至少要这一档」可以被读成付完款就能用。这句把结婚接到「升级已经就位」，不是接到付款当天。吊坠句不保留，是因为表里吊坠已经写了 completed construction，结婚这格没有。
4. `A renovation, once the second upgrade is finished, is a separate order and finishes immediately.` 新增的是时钟例外：装修不是这笔三天工程，第二档完成后另下一单，并且马上完成。第 51 行才写退款立刻到账、新区域不能被占。删掉这句，读者在学三天时钟时会把装修也排进三天；第 51 行补的是退款和清空，不是这处时钟边界。不要把第 33 行扩成第 51–55 行的流程。

### 第 55 行整段保留

`The third farmhouse upgrade costs 100,000g, takes three days, and adds the cellar under the kitchen ([Farmhouse](https://stardewvalleywiki.com/Farmhouse)). Choose that payment for the cellar, and choose Remove Crib or Add Dining Room when you want those changes instead.`

表第 3 行已有 100,000g、3 天和地窖。这行没有拆除婴儿床，也没有 150,000g 的餐厅。第 55 行的作用是在同一个选择里把第三档和这两项装修分开：要地窖就付第三档并等三天；要拆婴儿床或加餐厅就走装修。删掉前一句，后一句的 `that payment` 在这一节没有金额、工期和结果。这不是把表再抄成一份查找表。

## 全篇其余段落

下列位置核对过，不单列阻塞问题。

| 位置 | 结果 | 删掉会缺的读者信息 |
|---|---|---|
| 第 1 行 | 保留 | 前三句的直接答案：三档现行费用、第二组费用是 1.6 价格、三天、下单地点。它不写出旧价，也不代替表里的房间、结婚和吊坠。 |
| 第 5–9 行表 | 保留 | 按当前房子对下一行：金币、材料、三天、完工后多出的房间，以及结婚、吊坠施工完成、解锁装修、外观与上一档相同。 |
| 第 11 行 | 保留 | 9×5 那块地留在原处，所以房子旁边的格子不动；未升级室内是 10×7。图注只读出画面上的 `9×5 outdoors`。 |
| 第 13–15 行图 1 与图注 | 保留 | 图注只读 Kitchen、Bedroom、Empty room、Nursery、Cellar、Same exterior、9×5。冰箱、床、婴儿床和烹饪不在图注里。 |
| 第 23 行 | 保留 | 她还卖木材、石头和家具，并建造农场建筑；柜台开着时才请她升级农舍。地址与第 1 行相同，但这句把农舍升级和农场建筑分成两种订单，且没有重列三档金额。 |
| 第 29 行 | 保留 | 雨天、节日、夏 18 诊所、路过柜台改由一篇站内文处理。这里没有把营业时间再写一遍。 |
| 第 35 行 | 保留 | 雇农用同一套三档费用和三天，但只能升级自己的小屋，不能替别人升主农舍。表没有小屋适用范围。 |
| 第 39 行 | 保留 | 木材售价第一年 10g、第二年起 50g；升级费两年都是 10,000g；卖出木材的金币不跟着商店第二年涨价。 |
| 第 41 行 | 保留 | 假设只覆盖第一档、450 木材全部向罗宾买、不计其他花费；第一年带 14,500g，第二年或更晚带 32,500g；这一趟买的是木材，所以付款是金币总额。 |
| 第 43 行 | 保留 | 木材已在箱子里时，两年都带 10,000g 和这 450 木材，商店单价不进入这笔付款。它是 RP-R3 保留的那一处，不是再算一遍 14,500g。 |
| 第 47–49 行图 2 与图注 | 保留 | 图注只读画面上的 Upgrade / 3 days、Renovation / After upgrade 2 / Instant / Refunds gold、Remove crib / Free、Dining room / 150,000g。 |
| 第 51 行 | 保留 | 撤销后金币退回且立刻到账；要退款，新扩区域不能被占。图上的 Refunds gold 没有这两个条件。 |
| 第 53 行 | 保留 | 拆除婴儿床免费；加餐厅 150,000g，占地 9×10 再加 4×5；退这 150,000g 时那块地必须空着。两句里的 `finishes at once` 是把第 51 行的即时规则套到这两个名字上，句子本身仍有价格和占地。不把这两个词单独升成阻塞问题，也不要求为了少重复而删掉价格或占地。 |
| 封面图注 | 不失败 | 封面不在 `draft-v2.md` 正文里。`media-text.en.json` 的 cover alt 与 caption 描述画面上的三档金币、材料和 3 天。作用是读出封面标签。正文图 1、图 2 的 alt 与 caption 和正文第 13、15、47、49 行一致，不是另一套说明。 |
| FAQ 或收束段 | 无 | 没有第二模块重讲三档费用。 |

## 明确不签署

- 不签署 ResearchTrace。D2 历史记录绑定的是当前这两个哈希；本增补没有逐句重扫五类编辑腔。
- 不签署 ReaderValue。
- 不签署 E 的八层鉴文、事实或引用。
- 不签署 Length。不重跑 `正文计数.py`。B 与 D2 已记录的机械值 970、去掉两行 `Schematic.` 图注后的 917，只作为既有记录提及，不是本增补的新证据，也不是长度通过。
- 用户关于长度门槛例外的问题仍无回答。没有回答不等于可以低于 1000 仍交付。这不阻碍本次重复性判断。

## 下游

现行重复性结论以本增补为准：FAIL，6 个阻塞问题，10 句。D2 的 Repetition PASS 不得再被 E、F 或后续 D 沿用。正文若按本清单修改，将产生新哈希，必须由新的 D 对新版本重跑三门。本增补不消耗、不重置那 3 轮里的剩余 2 轮。
