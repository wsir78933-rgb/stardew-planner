# A 补充：450 Wood 与 100 Hardwood

- 角色：A 补充。只交核验事实和原始证据。不选布局，不写正文，不签 D 或 E。
- 日期：2026-10-16。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树。
- 机器可读条目：同目录 `facts.json`。
- 原始页面：同目录 `sources/`。
- 未改 `research/A/facts.json`、`research/A/research.md`、control、canonical、媒体和源码。
- 完成前读到协调消息 `msg_eaebd58c0c7b`：只聚焦一条不依赖农场类型的原版硬木路径、斧头条件，以及 Wood 购买和自采的差别。不把全部农场、掉落或种树写成交给 B 的路径。

## 交给 B 的事实包

硬木用秘密森林这一条。钢斧砍掉入口的大圆木之后，里面 6 个大树桩每天重长，页面写每天一共 12 Hardwood。大树桩本身要铜斧或更好，钢斧已经满足。起始硬木为 0、不要伐木工、不算别的来源时，凑满 100 是收获次数，不是日期：只算这 12，要到第 9 次；若把那根一次性圆木的 8 和当天的 6 个树桩都算进第一次，是 8 次。页面没有写“同一天”。

木材两条。已经长成的树用开局斧砍，单人树干 12–16、树桩 5–9，这是范围不是棵数承诺。或者向罗宾买：常设库存第一年 10g，第二年起 50g。450 根全买时的 4,500g / 22,500g 和连工费 14,500g / 32,500g 是 Farmhouse Notes 里的旧价，不是新价格。

罗宾常设库存出售 Wood，该表没有 Hardwood。她收购 Hardwood。第二档费用行写的是 Hardwood，不是 Wood。没有点击过游戏柜台。

对应 ID 在 `facts.json` 的 `focusPack`。`CALC-no-swap-observed` 的 `publicAllowed` 为 false。

## 已核、但不在这条路径里

森林农场每天 16、四角农场每天 2、桃花心木生长和相互冲突的单棵产量、节日、鱼塘、书商、伐木工概率、砍击次数、马厩和任务上的另一笔硬木，都有原文，放在证据里。B 不需要把它们写成准备路线。

## 范围

只核购买农舍升级要用的 450 Wood 和 100 Hardwood：两种材料是否同一物品、普通原版怎么得到、斧头最低等级、可重复数量和适用条件。不写全地图采集、技能升级路线或模组。Console Version History 和 Mobile Version History 没有打开。

## 重复的旧价

下面这些在 2026-10-16 重新读到，修订时间与原 A 记录相同，不作为新价格。

| 原 ID | 这次仍在的原文 | 修订 |
|---|---|---|
| `T-upgrade-1` `T-upgrade-2` `T-cost-1.6` | Farmhouse 与 Carpenter's Shop 仍写第一档 10,000g 和 450 Wood，第二档 65,000g 和 100 Hardwood；1.6 从 50,000g 和 150 Hardwood 改来 | Farmhouse `190738`，2026-01-15T18:15:54Z。Carpenter's Shop `195197`，2026-09-27T07:06:30Z |
| `T-wood-price` | 常设库存 Wood：第一年 10g，第二年起 50g。Farmhouse Notes 已写 450 根为 4,500g 或 22,500g，连升级费为 14,500g 或 32,500g | 同上。Wood 页购买价段落是同一组 10g / 50g |

`CALC-shop-450` 只重算这四个已印在 Farmhouse Notes 里的乘积。Version History 最新标题仍是 1.6.15，修订 `192874`，2026-05-09T22:46:47Z，与 `T-version` 的修订时间相同。

信件引文没有并成一句。Wood 页带 “Notice:”。Carpenter's Shop 常设库存注没有这个词。价格数字两边一致。该引文差异是 `MP-letter-wording`，`publicAllowed` 为 false。

## 新事实

每条的来源定位和 `publicAllowed` 在 `facts.json`。这里只列读者准备材料时用得上的原文结果。

1. `MP-wood-item`、`MP-hardwood-item`：两个物品页。Wood 出售价 2g，Hardwood 出售价 15g。Hardwood 页写：桃花心木或神秘树用任意斧，大树桩用铜斧或更好，大圆木用钢斧或更好。渲染页上 Hardwood 有一句 “A special kind of wood with superior strength and beauty.” 这句不在已保存的 wikitext 正文里，不能拿它当成可以用 Wood 支付 Hardwood。
2. `MP-robin-regular-stock`：木匠店引言写 Robin sells wood, stone, and furniture。常设库存有 Wood，没有 Hardwood 行。同一段写她会收购 Hardwood。这是她向玩家买，不是她出售。沙漠节的硬木在 Hardwood 页写的是 Leah 的店，每次最多 100，每个 3 个 Calico Egg。Wood 页写 Robin 在沙漠节出售最多 500 Wood，每个 1 个 Calico Egg。沙漠节店铺页本身没有打开。
3. `MP-axe-grades`：初始斧开局就有，在铁匠铺升级。铜斧 2,000g 和 5 个铜锭，可以砍大树桩。钢斧 5,000g 和 5 个铁锭，可以砍大圆木。钢斧被写明用于清掉挡住秘密森林的大圆木。铁锭和铜锭怎么炼，Axes 页没有写，Blacksmith 页没有打开。
4. `MP-axe-enchant-exception`：带 Powerful 附魔的斧可以不看升级等级砍大树桩和大圆木。Secret Woods、Large Stump、Large Log 三页没有这句。熔炉页没有打开。
5. `MP-large-stump`、`MP-farm-daily-hardwood`、`MP-secret-woods`：大树桩基础产出 2 硬木。伐木工职业有 50% 机会多 1 个。秘密森林 6 个每天重长，秘密森林页写每天一共 12 硬木。森林农场左侧 8 个，Hardwood 页写每天另计 16。四角农场左上 1 个，每天另计 2。农场上其余大树桩砍掉后不再出现。页上没有各农场开局有多少不重生的树桩，也没有重生钟点。
6. `MP-large-log`：大圆木 8 硬木，伐木工职业为 10。砍掉后永不重现。辛德瑞拉森林里的那根挡住秘密森林。它不是每日供应。
7. `MP-tree-wood-range`、`MP-tree-stump-wood`、`MP-immature-tree-wood`、`MP-wood-water-loss`：成熟普通树 12 到 16 木，单人留下的树桩 5 到 9 木。多人树桩固定 4 木。伐木工和 Woody's Secret 会改变树干数字，数字在 Trees 页。阶段 4 幼苗只有 4 木。掉进水里会少掉。这些都不是 450 的官方棵数。
8. `MP-mahogany-growth`：桃花心木用斧头砍。未施肥每夜 15% 进入下一阶段，页上写通常 26±12 天。施肥每夜 60%，包括冬天，通常 7±2 天。这是页面自己的 “usually”，没有拿来排农舍升级的日期。
9. `MP-mahogany-yield-conflict`：Mahogany Tree 页写 8–13。Trees 页写 10，伐木工为 12 或 13。两页同时有效，没有采用任何一个数。`publicAllowed` 为 false。
10. `MP-chipper-direction`：木片机把 Hardwood 变成 Wood 等。没有打开到的句子写它把 Wood 变成 Hardwood。产出个数没有打开 Wood Chipper 页。
11. `MP-other-hardwood-costs`：马厩也是 100 Hardwood，宠物碗 25，巨大树桩任务 100，罗宾冬季 21 日信件要 10，罗宾的特别订单要 80。这些不是农舍第二档。
12. `MP-1.6.9-language-fix`：1.6.9 写修复了某些语言里罗宾显示的农舍升级硬木数量。子弹没有写英语数字被改掉。现行英语页仍是 100。
13. `MP-occasional-amounts`、`MP-lumberjack`、`MP-hit-counts`、`MP-mahogany-seed-chances`：节日赠礼、鱼塘、神秘箱、书商换出的是支付木材或硬木、伐木工概率、砍击次数、桃花心木种子概率。砍击次数不是产出。书商在信息框的 Source 里，正文写的是用木材或硬木去换书。

## 计算

计算都在 `facts.json` 的 `calculations`，不放进来源事实。

- `CALC-shop-450`：重复旧价。条件是 450 根全部按常设单价买，并且总数里没有别的金币。
- `CALC-tree-bounds`：单人、不要伐木工、没读 Woody's Secret、不掉进水、树已经成熟、树干和树桩都捡到、起始木材为 0。两段原文范围相加落在 17 到 25。按高端 25 是 18 棵，按低端 17 要到第 27 棵。多人树桩固定 4 时另算，高端 23 棵、低端 29 棵。页面没有写 17–25，也没有写这些棵数。
- `CALC-secret-woods-visits`：起始硬木 0，不要伐木工，不算森林农场或四角农场。只算秘密森林每天 12 时，第 9 次收获才到 100。若把挡路圆木的 8 和当天里面的 6 个树桩都算进第一次，则是 8 次。页面没有写 “同一天”。
- `CALC-map-daily-sums`：森林农场再加那 16，两次来源相加是 28，三次为 84，还差 16。四角农场再加那 2，相加是 14，七次为 98，还差 2。只适用于对应农场，而且秘密森林已经能进。
- `CALC-no-swap-observed`：费用行分别写 Wood 和 Hardwood，常设库存卖 Wood、不卖 Hardwood，已打开的木片机方向是硬木变木材。没有点击过游戏柜台，所以没有观察到拒绝提示。`publicAllowed` 为 false。

## 原 A 没有覆盖、这次补上的准备动作

- Wood 和 Hardwood 是两个物品页，出售价和斧头条件不同。
- 普通木材可以砍成熟树，也可以按年份向罗宾买。买齐的金币是旧价。
- 硬木的可重复数量：秘密森林每天 12；森林农场每天 16；四角农场每天 2。条件是对应地点，以及铜斧或钢斧。
- 挡路大圆木是一次性的 8 硬木，并且是进入秘密森林的钢斧条件。
- 罗宾常设库存出售 Wood，不出售 Hardwood；她收购 Hardwood。

## 仍然没有原材料的准备动作

- 桃花心木每棵到底是 8–13 还是 10，未解，不能拿来凑 100。
- 神秘树的硬木个数没有打开到。
- 树枝的木材个数没有打开到。
- 各农场开局有多少不重生的大树桩和大圆木，页上没有数字。
- 木片机的产出比例没有打开。
- 铜锭、铁锭和铁匠铺是否另有等级门槛，Axes 表上没有，对应页没有打开。
- 每日重生的钟点没有写。
- 危险矿洞和姜岛野生桃花心木只被点名，没有个数。
- 浣熊以煤换桃花心木种子的比例，1.6.6 子弹没有数字。
- 没有排任何日历工期。树的生长只保留页面上的概率和 “usually”。

## 公开边界

可以公开的是 `publicAllowed: true` 的条目。`MP-letter-wording`、`MP-mahogany-yield-conflict`、`CALC-no-swap-observed` 为 false。原 A 的 `T-wood-price` 仍是 10g / 50g 和那四个金币乘积的公开出处；这次只确认修订未变。
