# A 校正交接：house upgrade stardew

- 角色：A 校正。只改事实记录。不写正文，不签质量门。
- 核验日：2026-10-16。校正对照的是本目录 `sources/` 里已保存的六页英文 innerText，没有为这次校正重开页面。
- 原稿备份：`versions/submission-v1/facts.json` 与 `versions/submission-v1/research.md`。
- 机器可读事实：[`facts.json`](./facts.json)。
- 来源站名是 Stardew Valley Wiki。发布方栏用的是这个站名。
- 页面范围：Farmhouse 最后编辑 15 January 2026；Carpenter's Shop 27 September 2026；Cask 27 October 2024；Cooking 12 July 2026；Robin 1 October 2026；Version History 9 May 2026，保存文本的第一个版本标题是 1.6.15。这不是“所有版本、所有存档、全球最新版本”。

`publicAllowed: true` 才是可以交给正文使用的主张。`publicAllowed: false` 是内部缺口或范围记录，不要写进正文，也不要改写成免责声明。

## 可以公开的费用和天数

保存的 Farmhouse 与 Carpenter's Shop 行：

- 第一档：10,000g 和 Wood (450)。
- 第二档：65,000g 和 Hardwood (100)。
- 第三档：100,000g。这两行都没有列出 Wood 或 Hardwood。
- Farmhouse 写 “Robin requires three days to complete each farmhouse upgrade.” Carpenter's Shop 写 “Farmhouse upgrades require three days to complete.”

Version History 的 1.6 节和 Farmhouse 的 1.6 历史行写第二档从 50,000g 和 150 Hardwood 改为 65,000g 和 100 Hardwood。现行两行是改后的数字。

没有保存到的句子：不能跳档、施工时不能下下一单、这适用于所有版本。`UP-order-prerequisites` 因此改为 `publicAllowed: false`。

## 计算，不是维基原句

从初始农舍把已列出的各档费用相加。这不依赖“任何情况下都不能跳档”。

- 只加第一档：10,000g、450 Wood、0 Hardwood。
- 加上第二档：10,000 + 65,000 = 75,000g、450 Wood、100 Hardwood。
- 再加第三档：75,000 + 100,000 = 175,000g、450 Wood、100 Hardwood。

木材缺口只使用这些输入：第一档 10,000g 和 450 Wood，手头 200 Wood，第一年木材单价 10g。

- 450 - 200 = 250
- 250 × 10 = 2,500
- 10,000 + 2,500 = 12,500

12,500g 只包含这笔升级金币和这笔木材。不包含其他准备花费。斧头价格、锭数、食物和硬木采集费用都已从这条计算删掉。

同一库存行还有 Year 2+ 的 50g。12,500g 没有用这个单价。

## 各档原文里的用途

第一档 Farmhouse 行：Adds a kitchen, with a kitchen counter that allows cooking, and a fridge that functions as a chest. 冰箱里的物品在烹饪时可以使用，即使不在玩家背包里。Adds a bedroom. 床从 single 改为 double。Allows marriage。

Cooking 页：第一次农舍升级后可以烹饪；厨房有 stove 和 refrigerator；stove 是烹饪界面；冰箱 36 格，类似箱子，并与烹饪界面直接相连。可用食材位置写的是背包、冰箱或 Mini-Fridge。Farmhouse Notes：厨房水槽可以给浇水壶加水。

删掉的写法：把 Adds a bedroom 写成 expands the bedroom；科罗布斯或室友随第一档入住。六份来源里没有一档室友条件。Marriage 页不在这六份来源里。

第二档 Farmhouse 行：两间新房间，一间空，一间有婴儿床和两张儿童床，因此可以有孩子；厨房和卧室更大。Carpenter's Shop 该行写可以有两个孩子。

装修与上漆只保留已引用的句子：第二档之后罗宾提供装修；即时完成；扩建区域没被占用就可以随时全额退款，退款也即时。Paint Buildings 即时且免费。农舍在外观完全升级前只能漆屋顶。保存文本没有定义“外观完全升级”是哪一档。各条装修的单独售价不进入本包的公开主张。

第三档：厨房进入地下地窖；木桶可以陈酿奶酪和酒等以提高品质和价值；地窖自带 33 个木桶。Carpenter's Shop 列出 Cheese、Goat Cheese、Beer、Mead、Pale Ale、Wine，并写外观保持不变。Cask 页：配方来自最终农舍升级，材料 Wood (20) 和 Hardwood (1)。木桶可以放在任何地方，但只有在地窖里才会接收物品。

189 和铱星售价翻倍在保存页里有句子，但不是这篇批准的功能说明。它们在 `B-cellar-details-outside-approved-function`，`publicAllowed: false`。

占地：Farmhouse 写 outer footprint 是 9×5。Carpenter's Shop 写升级农舍时 footprint 不变，所以相邻格子不受影响。不能从这句话推出“任何情况下都不用清空屋外物品”。

## 不进入正文的排期和柜台

每档三天只到上面那两句。9 个工作日、整整施工工作天、保证的日历完成日，都不是这两句。没有把 3×3 写成公开事实。

Carpenter's Shop 引言里的次日开工、节日不施工、多数工程两天，没有被定位到农舍这三天。`B-calendar-scheduling-constraints` 改为 `publicAllowed: false`。不用这些句子给农舍排具体日期。

柜台在农舍升级那三天是开还是关，都不进入正文。`B-shop-counter-operation-unverified` 为 `publicAllowed: false`。

## 工具说法

原稿“钢斧砍大树桩”已删除。`material-preparation` 里大树桩是铜斧或更好，大圆木才是钢斧或更好。本条木材计算不附带这些新数字。

## 来源文件

六份 innerText 仍在 `sources/01` 到 `sources/06`。这次校正没有改它们，也没有改 `verification.log`。
