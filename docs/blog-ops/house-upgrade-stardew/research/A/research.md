# A 研究交接：house upgrade stardew

- 角色：A。只交事实、来源和候选意图。不选最终意图，不写大纲、标题或正文。
- 关键词：`house upgrade stardew`
- 网站：https://stardewvalleyplanner.art
- locale=en，country=US（任务指定，不是从 SERP 反推）
- 核验日：2026-10-15
- 工作树：Orca 显示名「博客 2」，路径 `/Users/wusir/orca/workspaces/stardew planner/博客-2`，分支 `博客-2`。开工时这棵工作树已经存在，没有再创建第二棵。主工作区和「博客」工作树未写入。
- 机器可读事实：同目录 `facts.json`
- 原始检索与页面摘录：同目录 `sources/`

## 核心结论

没有核心事实阻塞。可以交给 B 的任务材料是：三档农舍升级的现行金币和材料、每档三天、各档解锁，以及第二档之后才出现的即时、可退款装修。这不是替 B 选定意图。

不要覆盖 https://stardewvalleyplanner.art/carpenter-stardew 。那一页讲木匠菜单和户外建筑摆放，农舍只作为「室内限制还是户外建筑」的对照，没有 10,000 / 65,000 / 100,000 这张表。

## 1. 美国英文 SERP

查询页：

`https://www.google.com/search?q=house+upgrade+stardew&hl=en&gl=us&pws=0&num=10`

回执：`documentElement.lang=en`。页脚原文是 “Results are not personalized” 和 “United States - From your IP address”。这是国家级美国英文结果，不是城市级。People Also Ask 没有出现，不编造。

前 5 条自然结果，类型保留，都已打开：

| # | 类型 | URL | 页面上的日期 | 能否当现行费用 |
|---|---|---|---|---|
| 1 | 维基 | https://stardewvalleywiki.com/Farmhouse | 最后编辑 15 January 2026, 18:15 | 能，主来源 |
| 2 | Steam 指南 | https://steamcommunity.com/sharedfiles/filedetails/?l=german&id=3118664526 | 发布并更新 21 Dec 2023。界面 `lang=de`，因为结果 URL 带 `l=german`；正文英文 | 不能。第二档仍写 50,000g 和 150 Hardwood，并把装修说成永久 |
| 3 | IGN 指南 | https://www.ign.com/wikis/stardew-valley/Farmhouse_Upgrades | 页面可见 `UPDATED: NOV 14, 2024 5:37AM GMT+8` | 数字与现行维基一致，费用仍以维基为准。第一次打开在 load 超时，随后从已提交页面读到正文 |
| 4 | Reddit 论坛 | https://www.reddit.com/r/StardewValley/comments/17lxixq/upgrade_house_worth_it/ | 2026-10-15 打开时显示 3y ago，且已归档。SERP 摘要写的是 2 years ago | 不能。讨论值不值得，评论里有人把孩子和地窖对错档 |
| 5 | Digital Trends 指南 | https://www.digitaltrends.com/gaming/stardew-valley-house-upgrade/ | 发布 2025-01-08，作者 Jesse Lennox，`og:locale=en_US` | 数字与维基一致，费用仍以维基为准 |

同一页在第 5 条之后还有视频模块，未逐个打开。其中一条 2024-02-03 的摘要把中间档写成 50k。不当事实。再往后的网页结果包括木匠店维基，已用 API 与页面文本核过。

People also search for，只是查询，不是答案：Full house upgrade Stardew；Best house upgrade stardew；2nd house upgrade Stardew；House upgrade Stardew Valley cost；House upgrade stardew multiplayer；3rd house upgrade Stardew；House upgrade Stardew requirements；1st house upgrade Stardew。

AI Overview 里的费用与现行维基同向，但不作为来源。

## 2. 版本

维基 Version History 最新标题是 **1.6.15**。该节写 2024-12-20 发布，并链到已打开的 Steam 帖：

https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english

帖子标题是 “Stardew Valley 1.6.15 Patch now available”。正文写补丁已可用，列出的改动与维基 1.6.15 节一致，没有改农舍升级金币或材料。抓到的帖子正文里没有可见发布日期，12 月 20 日是维基对这个 URL 的说法。

同日取到的 Steam 新闻 API 最近 40 条，最新到 2026-07-29，没有更新的官方补丁标题。其中有媒体把 1.7 称为尚未发布的更新；那些报道没有打开，不进入农舍事实。Version History 页修订时间是 2026-05-09，当时最新节仍是 1.6.15。这不能单独证明 40 条之外不存在更晚补丁。

现行第二档费用来自 1.6 变更，并且 Farmhouse 页（修订 2026-01-15）和 Carpenter's Shop 页（修订 2026-09-27）仍写 65,000g 和 100 Hardwood。

## 3. 会进入文章的主题事实

适用版本：上节所述现行维基。每个数字的出处在 `facts.json` 的对应 id。

1. **第一档** `T-upgrade-1`：10,000g 和 450 Wood。厨房（可烹饪的柜台，冰箱可当箱子，烹饪可用冰箱里的材料）、卧室、单人床变双人床、允许结婚。结婚页写至少升级一次；美人鱼吊坠页写第一档施工完成。
2. **第二档** `T-upgrade-2`：65,000g 和 100 Hardwood。一间空房，一间有婴儿床和两张儿童床。木匠店该行写可以有两个孩子。厨房和卧室变大。解锁装修，以及建筑/装饰漆。1.6 之前是 50,000g 和 150 Hardwood（`T-cost-1.6`）。
3. **第三档** `T-upgrade-3`：100,000g，表上没有木材。厨房下的地窖，外观不变。自带 33 个桶，最多可放 189 个。桶可以放在别处，但只有地窖里的桶会接收物品。酒从普通到铱是木桶页写的最长时间，2 个季节。其他物品的老化时长这次不展开。
4. **施工** `T-days`：每一档农舍升级都是三天。木匠店另有一句：建筑在购买次日开工，节日不施工，多数工程两天、于下单后的第二天开始时完成。这句两天的算法没有写进 House Upgrades 小节。不要把农舍的三天改写成「第 N 天早晨完成」。
5. **户外占地** `T-footprint`：农舍户外是 9×5。升级不改变这块占地。未升级室内是 10×7。
6. **升级和装修不是同一笔订单** `T-renovation-rule`、`T-renovation-prices`：装修在第二档之后解锁，即时完成，可撤销并退回所花金币。Farmhouse 页补了一句：扩建区域不能被占用，退款也是即时的。升级没有被写成可拆除。现行价格：拆除婴儿床免费；打开卧室 10,000g（多 12 格）；南房 30,000g（11×7）；角房 20,000g（9×5）；餐厅 150,000g（9×10 加 4×5）；小隔间 10,000g（4×5）；阁楼 60,000g（13×5）；扩大角房 100,000g（8×13 加 4×5，并把原角房从 9×5 增到 10×5）；打开餐厅墙 10,000g（多 12 格）。
7. **下单地点** `T-menu`：木匠店在 24 Mountain Road。罗宾卖木材、石头和家具，并升级农舍、建造农场建筑。商店通常 9:00–17:00，周二关，周五 16:00 关。房子在商店关闭时仍可于 9:00–20:00 进入。已查看的菜单图只有 Shop、Upgrade House、Construct Farm Buildings、Leave，图上没有价格（`OBS-menu-image`）。
8. **送礼例外不是柜台开关** `T-gifting-exception`：多数建筑施工期间不能给罗宾送礼；农舍、鸡舍、谷仓升级期间可以，棚屋升级期间不行。没有句子写明农舍升级的那三天柜台开着还是关着。
9. **买木材代替砍伐** `T-wood-price`：罗宾的木材第一年 10g，第二年起 50g。维基已写出 450 木材等于 4,500g 或 22,500g，于是第一档连工费为 14,500g 或 32,500g。
10. **上漆和搬家** `T-painting-move`：上漆即时且免费。外观未完全升级前只能漆屋顶。第二档解锁建筑和装饰漆。1.6 起农舍可在罗宾菜单里移动。建造菜单里的移动是即时免费，建筑内物品一起移动。农舍被点名的位置是 1.6 历史句，不是温室/出货箱那句括号。
11. **成就** `T-achievements`：升级一次 Moving Up，两次 Living Large。第三次和装修没有对应成就。
12. **商店解锁** `T-shop-gates`：第一档后可出现迷你冰箱 3,000g、家具目录 200,000g、等离子电视 4,500g、双人床 2,000g。儿童床 2,000g 写在第二档之后。文章可以不写。

室友：1.6.14 补丁写明室友改为像结婚对象一样只需要一档升级，不再需要两档。虚空幽灵吊坠页本身没有这句话（`T-roommate-patch`）。不展开好感或离婚。

## 4. 一句边界，不展开

- 多人：相关搜索有 multiplayer。小屋由雇农升级自己的小屋，三档，费用与对应农舍档相同，各三天，不能替别人升级主农舍。新档自带小屋免费；之后加盖 100g、无材料、即时、5×3。电脑和 Switch 2 最多 7 间，其他主机最多 3。小屋页没有说小屋拥有农舍那张装修表。
- 社区升级：不在前五结果里。维基写「农舍完全升级」之后才能买 500,000g 加 950 木材的社区升级，三天，多人只有主机可买；随后捷径 300,000g，三天。「完全」没有定义是第二档还是第三档。木匠店写 Joja Warehouse，Trailer 页写购买 Joja 会员。这两处措辞冲突，不选一边，也不写进主任务。

## 5. 工具观察

2026-10-15 打开 https://stardewvalleyplanner.art/ 和 `/#planner`。

首页是免费粉丝规划器：八种农场加姜岛，可放建筑、作物、树、路径和装饰，可看洒水器和稻草人覆盖、四季、浏览器存档和导出。首页没有农舍升级价格。

建筑栏里 Farmhouse、Farmhouse (Upgrade 1)、Farmhouse (Upgrade 2) 都标 9×5，没有金币或天数。小屋有七种外观，每种到 Upgrade 2，都是 5×3。第一种外观的标签是 Cabin，不是 Stone Cabin。

地图对话框的 Interiors 有 Farmhouse、Farmhouse (Upgrade 1)、Farmhouse (Upgrade 2)、Cellar、Island Farmhouse。选中第二档室内图后，对话框列出 Married layout、配偶房间（None 到 Krobus）和装修开关：Open Bedroom、Southern Room、Corner Room、Extended Corner Room、Dining Room、Dining Room Wall、Cubby、Far Upper Room、Crib、Cellar。这些开关没有点过，所以不能说画出来的房间等于维基尺寸。规划器名字 Far Upper Room、Dining Room Wall、Crib 不等于维基的 Add Attic、Open Dining Room、Remove Crib。规划器不显示装修价格。

## 6. 站内冲突和最近三篇英文标题

现场打开：

- https://stardewvalleyplanner.art/blog 的 Latest articles 前三篇：
  1. How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe
  2. Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree
  3. Stardew Fruit: Find Its Source Before Buying Seeds
- 三篇 URL 的 H1 与上列标题一致。卡片没有日历日期。本仓库这三篇英文稿的加入提交日是 2026-10-13、2026-09-27、2026-09-26。都不是农舍升级。
- https://stardewvalleyplanner.art/carpenter-stardew 的 H1 是 “Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades”。目录含 “Compare farmhouse upgrades with outdoor construction”。该页不承担本关键词的费用表。

## 7. 候选意图（不选定）

搜索结果和「第 1/2/3 档、费用、要求」相关搜索，支持一篇回答「向罗宾买下一档农舍要付什么、等三天、得到什么」的文章。第二档解锁的装修必须和升级分开写，否则会把即时退款项目写成又一次三天工程。

Reddit 的「值不值得」是另一项任务。小屋和社区升级各留一句边界即可。

若 B 要写「升级那三天柜台是否营业」或「社区升级算第几档」，这两句现在没有出处，应退回补查，不要用本次材料写死。

## 8. 媒体

`media-research/inspected/steam-robin-menu.png` 已看过，只确认菜单四行，没有价格。`originals/` 里的外观图和地窖图没有价格文字，没有用来数桶，也没有用来主张第三档外观不同。维基第三档写外观不变，并且第二档和第三档使用同一张 House (tier 3) 图。媒体笔记里的许可结论没有采用。

## 9. 明确不能当现行事实

- Steam 指南的 50,000g、150 Hardwood，以及「装修永久」。
- 未打开的 YouTube 摘要里的 50k。
- Reddit 评论里的档位对应和「全升级后免费加房间」。
- Google AI Overview、结果条数、排名。
- 新闻标题里的 1.7。
- 媒体稿的 fair use 或「与游戏资源 100% 一致」。
