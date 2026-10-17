# 布局验收记录：house upgrade stardew

角色 B。工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`，分支 `博客-2`。核验日 2026-10-15。未改文章正文、源码、图片、`research/`、`control/`、主工作区和「博客」工作树。

## 结论

主意图是向罗宾买下一档原版农舍升级：现行金币和材料、三天、完工后多出的房间。装修只作为第二档之后的另一种订单，避免被当成下一档三天工程。`carpenter-stardew` 没有这张费用表，不覆盖该 URL。工具位置为无。

## 读过的输入

- V7：`/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`、`02-内容生产与质量门.md`、`03-博客页面生成整合.md`
- A：`research/A/research.md`、`research/A/facts.json`、`research/A/sources/serp-google-house-upgrade-stardew.txt`、`research/A/sources/serp-links.json`
- 结婚与吊坠只核对 A 已保存原文里的升级句：Marriage 页 “upgrade the farmhouse at least once”；Mermaid's Pendant 页 “completed construction on the first farmhouse upgrade”
- G：`interface/ProjectInterfaceSpec.md`
- M2：`media-research/correction-report.md`、`provenance.md`、`media-inventory.md`
- 旧文：`src/blog/articles/carpenter-stardew.en.tsx` 的服务表、农舍对照节、电话节

未把 `licenses/game-asset-terms.txt` 第 12–15 行当授权。未把 8 张 Wiki 原图和 Steam 菜单图列入公开图。

## 搜索证据

本角色没有新开 Google。读的是 A 保存的检索文本。

- 页脚第 249–250 行：`Results are not personalized`，`United States - From your IP address`。国家级，不是城市级。
- 没有 People Also Ask 标题。第 217–225 行是 People also search for，与任务卡所列 8 条查询一致。
- 自然结果顺序与 A 的前五一致：Farmhouse、Steam 指南、IGN、Reddit「值不值得」、Digital Trends。
- AI Overview 第 15–42 行列了三档费用，也列了装修价。A 写明它不是来源。本布局不采用，也不把这张价目收成一节。
- 视频模块未逐个打开。第 168 行 2024-02-03 摘要写 10k、50k、100k，不采用。第 156 行另一条未打开摘要写 65,000g 和 100 hardwood，同样不作为费用来源。
- 约 17,000,000 条结果不采用。

## 旧文

`carpenter-stardew.en.tsx` 第 49–51 行把 Upgrade House 写成室内和日后装修会变化，决策句是限制在家还是在户外。第 279–296 行比较农舍升级和户外建造，没有档位价格。第 303 行只说电话可以查询农舍升级费用。

中英文稿检索 `10,000`、`65,000`、`100,000`、`450 Wood`、`100 Hardwood`：均无命中。命令退出码 0。这是服务概览，不是同一张费用任务。不改旧文。

## 章节

| 节 | 删掉以后 | 决定 |
|---|---|---|
| 三档费用和完工房间 | 无法回答费用、要求和 1/2/3 档 | 保留 |
| 第二档 65,000g 与 100 Hardwood | 读者会沿用 1.6 之前的 50,000g 和 150 Hardwood | 保留为 H3 |
| 24 Mountain Road 下单和三天 | 只有价目，无法下单，也会把两天算法套到农舍上 | 保留 |
| 买齐 450 木材 | 第一年和第二年起要带的金币不同 | 保留为 H3 |
| 雇农只升自己的小屋 | 相关搜索有 multiplayer，费用会下到错误的房子上 | 下单一节里的一句，不成 H3；不写 100g、5×3、主机间数 |
| 装修不是下一档 | 第二档会解锁即时、可退款订单；不写就会下错 | 保留。例子只有拆除婴儿床和加餐厅。不写升级能否拆除 |
| 上漆、搬家、成就、室友、33/189、酒的两季 | 不阻止买完下一档 | 不写 |

## 事实

`writer-brief.md` 的事实表对应 `facts.json`。图上的事实 ID 均为 `publicAllowed: true`。`T-upgrade-3` 只用 100,000g、地窖和外观相同，不用 33、189 和酒的两季。`T-cabin-boundary` 只用雇农归属那一句。`T-community-boundary` 为 `publicAllowed: false`，只出现在「不要写」里。`T-gifting-exception`、`T-shop-gates`、`T-painting-move`、`T-achievements`、`T-roommate-patch`、`T-version` 和三个 `TOOL-*` 也只出现在「不要写」里。

正文图不使用规划器室内图。A 没点过那些开关，规划器名字不等于维基装修名。

## 图

封面之外有两张正文图。`tier-rooms` 每档最多三行房间名，另加一行 `9×5 outdoors`。`upgrade-or-renovation` 升级路径两行、装修路径四行，两个例子各两行。图上没有「表上没有木材」，也没有「没有被写成可拆除」。

画布 1672×941。最短字号 84px，按 `ceil(16 × 1672 / 320)`。一行一个标签，不把字缩小去塞句子。这一轮没有画图，也没有打开浏览器，所以这不是已复现的手机缺陷。E 以后在 390×844 的成品页上看实际可读性。

图注由 C 写。可以只用一个词 Schematic 开头，然后写画面上的档位、房间或数字。不交付 “Schematic, not a game screenshot.” 这种可粘贴免责句。

英文路径和中文路径成对。中文只换文字，由 T 翻译。封面英文文件名沿用 G 已写的 `house-upgrade-stardew-cover.webp`。中文封面是第二对文件。

许可：原创示意图，不附 ConcernedApe、Wiki、Fair Use 或 Editorial 署名。

## 回读后的修改

协调消息 `msg_200b6b90fc1a` 与 `msg_3d9cf17ff29b` 要求先改范围和图文约束。已从给 C 的强制内容里去掉小屋加盖价格、平台间数、室友补丁、成就、酒桶容量、上漆、搬家、页面修订日期，以及图上的缺记载句。多人边界留一句。图注改为 C 自写，并补上 84px 字号和换行，不把未绘制的图记成已测缺陷。

## 缺口

留给 A，本角色未补查：升级那三天柜台是否营业；社区升级的「完全」是第几档；Joja 两页措辞；城市级 SERP；Steam 1.6.15 帖抓取正文没有可见发布日期。这些不进入大纲。

## 命令

在工作树根目录执行。未改产品源码，没有跑 typecheck、build 或测试。

事实 ID、JSON、路径和 SHA-256：

```text
media-plan.json	ids=8	unknown=[]
task-card.md	ids=0	unknown=[]
writer-brief.md	ids=21	unknown=[]
unknown_total []
figures 3 body 2
minFont 84
banned No wood on the upgrade table False
banned Not described as removable False
banned Schematic, not a game screenshot. False
task-card.md 8089 1edb806157ef10adae0bf88151bcd43f106f9e47dae82841119ecb94f32fa8c9
writer-brief.md 8679 6e15009775fdb1469514a3be9998a7340e481500867ee1e55e2dfadab344fa0d
media-plan.json 9646 a7f1f374149cdfb3255c44ec2cda2045a08caadc7ff1042890c07e31b1fa51ad
python_exit:0
```

`task-card.md` 的 ID 数为 0，因为 ID 表在 `writer-brief.md`。21 个 ID 含「不要写」里的 ID，未知 ID 为 0。木匠稿费用词检索退出码 0，中英文都是 `none`。三条 banned 在任务卡、简报和图文计划里为 False；本验收文件提到其中一句，只为记录已删除。

SHA-256 不含本验收文件。回读修改完成后再算的。
