# C-zh 候选正文（非读者标题）

`locale=zh-CN`，页面身份为 `pine-tree-stardew`。本文件是 C-zh 的一份候选稿；读者正文从下方第一段开始，到「编辑附录」之前结束。正文尚未锁定，也不代表 D/E 通过；未改页面 source、registry、public、tests 或其他语言文件。

松果是松树的种子入口，松树属于普通树，不按果树的 3×3 规则种植。[普通树](https://zh.stardewvalleywiki.com/树)苗不需要浇水，但种下前仍要确认格子和地图条件；成熟后挂上[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)，普通采集器 5 天、重型采集器 2 天可以得到松焦油。树苗卡在第 4 阶段时，先围着它检查八个相邻格有没有成熟普通树，再检查季节、树肥和地图限制，不要拿一个固定成熟天数硬套所有情况。

## 认出松果、松树和松焦油的对应关系

先把这条关系记住：**松果 → 种出普通松树 → 等树成熟 → 在成熟松树上挂采集器 → 得到松焦油。** 松树不是果树，所以不需要果树那种周围 3×3 全空的规则；但普通树苗仍会受相邻成熟树阻挡，后文会单独排查这一点。[松树](https://zh.stardewvalleywiki.com/松树)页面和[树](https://zh.stardewvalleywiki.com/树)页面都把 Pine Tree 归在普通树范围内。

| 手上的对象 | 下一步 | 不要混淆的地方 |
| --- | --- | --- |
| 松果 | 放到合规格子里种下 | 松果是种子，不是已经长好的树苗 |
| 松树苗和小树 | 等它通过成长阶段 | 不需要按作物浇水，也不要用果树 3×3 规则判断 |
| 成熟松树 | 挂树液采集器或重型树液采集器 | 采集器的 5 天/2 天是产物间隔，不是松树成熟时间 |
| 松焦油 | 按需要用于收集包、制作、裁缝或任务 | 松焦油售价和用途不能推出“松树最赚钱”的结论 |

中文资料和旧攻略里可能会把松果写成“松子”、把松焦油写成“树脂”，也可能用“白色松树”指 Pine Tree。它们对应的游戏对象仍分别是[松果](https://zh.stardewvalleywiki.com/松果)、[松树](https://zh.stardewvalleywiki.com/松树)和[松焦油](https://zh.stardewvalleywiki.com/松焦油)，本页统一使用这些条目名称。

如果手上还没有松果，最直接的入口是采集等级达到 1 后摇晃或砍倒松树，也可以挖起成熟松树掉在地上的未发芽松果。[松果](https://zh.stardewvalleywiki.com/松果)页面还列出垃圾桶和木跃鱼鱼塘达到 9 条鱼后的产出。杂货店不卖松果；旅行货车可能随机出售，价格范围应以当次货物为准，不能把它当成稳定的早期种子来源。

![图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。](/blog/illustrations/pine-tree-seed-to-tar.webp)

*图 1：松果 → 普通松树 → 成熟松树上的树液采集器 → 松焦油。图中表达对象关系，不表示固定成长天数或收益排名。*

## 松果怎么种，以及松树苗为什么卡在第 4 阶段

### 先检查种植格、浇水规则和地图限制

把松果交给地面之前，先检查三个条件：

1. 种松果时要按区域检查位置：农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子；农场内则按当前中文[松果](https://zh.stardewvalleywiki.com/松果)页的口径检查格子未被占用、属于可耕种格，而且没有被锄头开垦。若格子被物件占着，或它本来就不是可耕种位置，先换格子，不要把“不需要浇水”理解为“任何地方都能种”。
2. 松树属于普通树，种下后不需要像作物那样每天浇水。[树](https://zh.stardewvalleywiki.com/树)页面同时说明，普通树不要求周围土地全部清空；这和“八邻格不能有成熟树”的成长阻挡是两件事。不要为了排除第 4 阶段问题，反过来给松树套上果树 3×3 硬规则。
3. 地图规则要单独看。官方[Stardew Valley 1.6 更新完整改动](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)明确写出：不能在城镇或海滩农场的隧道里种树。它不是“普通树可以在所有地图随便种”的例外证明。

普通树的“不浇水”只回答水分问题，不替你检查格子、地图和邻格。下种时把这几个条件一起核对，比先浇水再等几天更容易定位问题。

### 用八邻格检查第 4 阶段阻挡

如果松树苗一直停在第 4 阶段，第一步不是补水，而是以这棵树苗为中心看八个相邻格：上、下、左、右，以及四个对角格。只要其中任意一格有成熟普通树，树苗就会永远停在第 4 阶段。[树](https://zh.stardewvalleywiki.com/树)页面给出的规则是“成熟树占据树苗八邻格时阻止继续成长”，它不是果树的 3×3 占地规则。

按下面的顺序排错：

1. 先逐格看八邻格，确认阻挡它的是否是成熟树，而不是把一棵还在成长的小树误判成同样的阻挡条件。
2. 找到成熟邻树后，先清掉它；若必须换位，先清除或砍掉树苗，再在合规位置重新种下；或者只把成熟邻树与新种树苗错开。之后重新观察成长阶段。
3. 八邻格没有成熟树，再回到上一个 H3 检查种植格是否合规，以及当前地图是否允许种树。
4. 仍未推进时，回到前两步逐项重核：当前季节、树肥状态、地图限制，以及你看到的是玩家种植的树还是农场外自然树。

为了少做逐株检查，可以让树干之间留出一格空位；这只是便于管理的布局做法，不是 Pine Tree 必须遵守的游戏 3×3 规则。图 2 把八邻格和一个实用的错开方案放在同一张示意图里，留空格不要解读成游戏碰撞框或树的物理 footprint。

![示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。](/blog/illustrations/pine-tree-stage-four-neighbor.webp)

*图 2：先检查树苗周围八个相邻格；成熟邻树会卡住第 4 阶段。树干之间留一格是便于布局和排错的做法，不是果树 3×3 规则。*

### 冬季、树肥和农场外自然树的分支

未施树肥时，[普通树](https://zh.stardewvalleywiki.com/树)在非冬季每晚约有 20% 的机会进入下一阶段，冬季通常不生长；[松树](https://zh.stardewvalleywiki.com/松树)第 4 阶段的阶段时长是其他阶段的两倍。不同页面会给出平均值、中位数和百分位等不同口径，因此不要把一个数字当成所有松树的固定成熟日；按季节、阶段、邻格和树肥条件观察。

[树肥](https://zh.stardewvalleywiki.com/树肥)必须施在已经种下的树种、树苗或小树上，不能把它当作种下松果前的地块肥料。对普通树来说，树肥可以让它在冬季继续推进；果树和茶树不适用这条规则。即使使用树肥，也不要把“可以继续生长”写成“保证某一天成熟”，最后阶段和相邻树条件仍需满足。

农场外的自然松树是另一条使用路径。中文[松树](https://zh.stardewvalleywiki.com/松树)页面列出煤矿森林、铁路、木匠商店周围等自然区域的松树可以砍伐或挂采集器；如果清除树和树桩，且原格没有被占用，公开来源记载该位置可能重新生成小树。但中文松树专页与泛《树》页对自然树重生阶段的口径不一致，本文不发布阶段数字，也不把这条自然树规则扩展成种植许可。若你要处理的是城镇或海滩农场隧道，优先遵守上面的 1.6 地图限制。

如果你只是想先排一块种树位置，可以先看[星露谷种树：普通树和果树的区别](/zh/stardew-valley-trees)；需要在地图上摆放 `Pine Tree` 外观、检查不可长树格时，规划器可以帮助你做布局示意，但不模拟松树成长天数、自动落种、采集器计时、松焦油产出，也不能用目录里的对象大小推断游戏碰撞框。

## 成熟松树如何用采集器取得松焦油

松树进入成熟状态后，才是挂采集器的阶段。采集器产物计时和树木成长计时要分开看：前者可以明确写 5 天或 2 天，后者不要反推成一个固定成熟日。

| 设备 | 适用对象 | 松焦油间隔 | 冬季行为 | 门槛提示 |
| --- | --- | --- | --- | --- |
| [树液采集器](https://zh.stardewvalleywiki.com/树液采集器) | 成熟松树 | 5 天 | 在松树上继续工作 | 普通设备；配方从采集等级 4 开始 |
| [重型树液采集器](https://zh.stardewvalleywiki.com/重型树液采集器) | 成熟松树 | 2 天 | 在松树上继续工作 | 晚期设备；不要把 2 天当成普通采集器速度 |

普通采集器和重型采集器都可以挂在成熟松树上，区别在产出间隔和取得门槛。[松树](https://zh.stardewvalleywiki.com/松树)和[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面都支持 5 天与 2 天的对应关系；[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)页面还说明，挂在松树上的采集器冬季继续工作。也就是说，树已经成熟时，冬天不必为了松焦油把采集器拆下来。

如果你要取回设备，先按[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)页面的操作处理，不要为了清理树位直接砍挂着采集器的树。雷击或炸弹还可能连设备和当前产物一起损坏，所以采集区要和日常爆炸物、雷暴风险一起管理。

### 松焦油拿到后如何确认用途

松焦油有明确用途，不只是挂在树上的副产物。[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面列出的代表性去向包括：工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务。先用这些常见去向判断松焦油是否要留存；具体材料和数量仍按对应物品页面逐项确认。

[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面列出了这件物品的基础售价；但这个价格不能单独推出“松树最赚钱”，本文没有统一条件下的树木收益比较来源。如果你的目标是稳定拿到这件材料，先把种植位、成长排错和采集器周期做好，再按当前存档的制作门槛决定是否继续扩种。

最后按这张检查表收尾：

- 手里的是松果，不是把 Pine Tree 目录名当成种子。
- 农场外不需要先锄地，也不要把树种放在已锄过的农场外格子；农场内按当前中文松果页检查格子未占用、可耕种且未用锄头，当前地图还要允许种树。
- 普通树不需要浇水，但不代表可以忽略种植格和地图条件。
- 第 4 阶段卡住时，八个相邻格没有成熟普通树。
- 冬季、树肥和农场外自然树的规则没有被混写。
- 树成熟后，普通采集器按 5 天、重型采集器按 2 天规划；不要拿这两个数字倒推成熟时间。

## 来源

下列公开页面分别支撑本文的游戏规则和工具边界；涉及具体条件时，正文已链接到对应条目。中文 Stardew Valley Wiki 负责松树、松果、普通树、采集器、树肥和松焦油的游戏规则，官方 1.6 更新说明负责城镇与海滩农场隧道的种树限制，本站中文树木页和规划器负责说明布局工具的能力边界。

- [Stardew Valley Wiki 中文：松树](https://zh.stardewvalleywiki.com/松树)
- [Stardew Valley Wiki 中文：松果](https://zh.stardewvalleywiki.com/松果)
- [Stardew Valley Wiki 中文：树](https://zh.stardewvalleywiki.com/树)
- [Stardew Valley Wiki 中文：树液采集器](https://zh.stardewvalleywiki.com/树液采集器)
- [Stardew Valley Wiki 中文：重型树液采集器](https://zh.stardewvalleywiki.com/重型树液采集器)
- [Stardew Valley Wiki 中文：树肥](https://zh.stardewvalleywiki.com/树肥)
- [Stardew Valley Wiki 中文：松焦油](https://zh.stardewvalleywiki.com/松焦油)
- [Stardew Valley 1.6 更新完整改动](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)
- [本站：星露谷种树：普通树和果树的区别](/zh/stardew-valley-trees)

---

## 编辑附录（不是读者正文）

本文件只保存一个 C-zh 正文候选，不是锁稿，不声明通过，也没有生成 `locked/zh-body.txt`。以下引用定位和图位说明供后续 D/E/F 使用；不应渲染到公开页面。

### PublicReference

定位使用读者正文的精确片段；引用 ID 和 occurrence 不进入读者页面。

- id: `wiki-zh-pine-tree`
  - label: Stardew Valley Wiki 中文：松树
  - url: https://zh.stardewvalleywiki.com/松树
  - appliesTo:
    - quote: "松树属于普通树"
      occurrence: 1
    - quote: "成熟松树掉在地上的未发芽松果"
      occurrence: 1
    - quote: "可以砍伐或挂采集器"
      occurrence: 1

- id: `wiki-zh-pine-cone`
  - label: Stardew Valley Wiki 中文：松果
  - url: https://zh.stardewvalleywiki.com/松果
  - appliesTo:
    - quote: "农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子"
      occurrence: 1
    - quote: "格子未被占用、属于可耕种格，而且没有被锄头开垦"
      occurrence: 1
    - quote: "采集等级达到 1 后摇晃或砍倒松树"
      occurrence: 1
    - quote: "成熟松树掉在地上的未发芽松果"
      occurrence: 1
    - quote: "杂货店不卖松果"
      occurrence: 1

- id: `wiki-zh-trees`
  - label: Stardew Valley Wiki 中文：树
  - url: https://zh.stardewvalleywiki.com/树
  - appliesTo:
    - quote: "不需要像作物那样每天浇水"
      occurrence: 1
    - quote: "普通树不要求周围土地全部清空"
      occurrence: 1
    - quote: "树苗就会永远停在第 4 阶段"
      occurrence: 1
    - quote: "成熟树占据树苗八邻格时阻止继续成长"
      occurrence: 1
    - quote: "在非冬季每晚约有 20% 的机会进入下一阶段"
      occurrence: 1

- id: `wiki-zh-tapper`
  - label: Stardew Valley Wiki 中文：树液采集器
  - url: https://zh.stardewvalleywiki.com/树液采集器
  - appliesTo:
    - quote: "普通采集器 5 天"
      occurrence: 1
    - quote: "挂在松树上的采集器冬季继续工作"
      occurrence: 1
    - quote: "配方从采集等级 4 开始"
      occurrence: 1

- id: `wiki-zh-heavy-tapper`
  - label: Stardew Valley Wiki 中文：重型树液采集器
  - url: https://zh.stardewvalleywiki.com/重型树液采集器
  - appliesTo:
    - quote: "重型采集器 2 天"
      occurrence: 1

- id: `wiki-zh-tree-fertilizer`
  - label: Stardew Valley Wiki 中文：树肥
  - url: https://zh.stardewvalleywiki.com/树肥
  - appliesTo:
    - quote: "必须施在已经种下的树种、树苗或小树上"
      occurrence: 1
    - quote: "对普通树来说，树肥可以让它在冬季继续推进"
      occurrence: 1
    - quote: "果树和茶树不适用"
      occurrence: 1

- id: `wiki-zh-pine-tar`
  - label: Stardew Valley Wiki 中文：松焦油
  - url: https://zh.stardewvalleywiki.com/松焦油
  - appliesTo:
    - quote: "松焦油有明确用途"
      occurrence: 1
    - quote: "工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务"
      occurrence: 1
    - quote: "页面列出了这件物品的基础售价"
      occurrence: 1

- id: `official-1-6-changelog`
  - label: Stardew Valley 1.6 更新完整改动
  - url: https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/
  - appliesTo:
    - quote: "不能在城镇或海滩农场的隧道里种树"
      occurrence: 1

- id: `site-zh-general-trees`
  - label: 本站：星露谷种树：普通树和果树的区别
  - url: https://stardewvalleyplanner.art/zh/stardew-valley-trees
  - appliesTo:
    - quote: "规划器可以帮助你做布局示意"
      occurrence: 1

### 图位说明

1. `/blog/illustrations/pine-tree-seed-to-tar.webp`：位于 H2-1 对象关系表之后；共享 EN/ZH 图。读者面 alt 为“图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。”；图注为“松果 → 普通松树 → 成熟松树上的树液采集器 → 松焦油。图中表达对象关系，不表示固定成长天数或收益排名。”
2. `/blog/illustrations/pine-tree-stage-four-neighbor.webp`：位于 H2-2 的八邻格排错段落之后；共享 EN/ZH 图。读者面 alt 为“示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。”；图注为“先检查树苗周围八个相邻格；成熟邻树会卡住第 4 阶段。树干之间留一格是便于布局和排错的做法，不是果树 3×3 规则。”

### 交 A 补查或保持未写的事项

- 不把松树的单一成熟天数写进正文：A-zh 已记录不同页面的平均值、中位数和百分位口径冲突，若要发布固定日历需 A 先补更强的版本锁定证据或可复现实测。
- 不写 Pine Tree 的游戏物理 footprint、碰撞框或“占几格”：Planner 目录对象不是游戏物理证据；若后续必须写，退 A 补查。
- 不声称个人实机测试、过夜实验或存档验证：本候选只使用已打开的公开来源。
- 不把城镇固定树、农场外自然树和所有地图的种植规则合并；若页面装配需要更细的区域清单，退 A 按当前版本重新核验。
- 不把松焦油售价、用途或采集器速度推导成跨树收益排行；本题未取得统一比较口径。
