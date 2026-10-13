# D 写后检查：how to harvest stardew valley 英文第 3 轮

- 角色：D。不是 C，不是 E。没有打开 `reviews/E-en-review-r1.md`，也不用 E 的结论代替这三门。
- 任务 `task_a0a8d2e776f7`，Dispatch `ctx_f846e74bdbe7`，终端 `term_6c10e47b-9ee2-44a2-9995-511f5a188304`。
- 上一份失败报告是 `reviews/D-en-v1-three-gates.md`，只对旧哈希有效。本报告只对下面的新字节有效。
- 隔离只是目录约定。没有做操作系统权限试验。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树，没有改正文、SVG、媒体清单或产品代码。

## 结论

同一版本三门通过。必须改的数量是 0。

| 门 | 结果 | 必须改 |
|---|---|---|
| ResearchTrace | 通过 | 0 |
| ReaderValue | 通过 | 0 |
| Repetition | 通过 | 0 |

这不是页面通过，也不是网站已经完成。公开 WebP 和 AVIF 仍然不存在。E 还要用同一英文哈希另行审核，F 才能锁。中文不在本角色。

## 被检查的字节

读者面是 `writing/en-body.md` 全文。文件没有「来源」标题，也没有编辑附录。图注和 alt 在第 49–52 行。图中可见文字在 `writing/en-figure.svg` 的 22 个 `<text>`。`<title>` 和 `<desc>` 单独核对。`en-media.json` 的 `creationBasis` 不是读者面。`writing/revision-round3.md` 只用来知道改了哪些位置，不用它当通过依据。

| 文件 | SHA256 | 与协调者给出的值 |
|---|---|---|
| `writing/en-body.md` | `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101` | 一致 |
| `writing/en-figure.svg` | `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661` | 一致 |
| `writing/en-media.json` | `1d4cd52f3d7cc7b180e60183c8f18ca61bd58b1889243c02e44a1422c38451c3` | 一致，与第 1 轮相同 |
| `media/en-figure-candidate.png` | `c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117` | 一致 |
| `media/cover-candidate.png` | `bed8e9781d2f4034b7036d727e29fe2ab3511e6c9612239cc3827edf015f1ce3` | 一致 |

正文 10093 字节，100 个 LF，UTF-8，NFC，CR 数量 0，以换行结束，行尾空白行号为空。SVG 5643 字节，同样没有 CR、行尾空白，并且是 NFC。正文里的 alt 和 caption 与媒体清单各精确出现 1 次。

## 验证命令和退出码

工作目录是上面的工作树。没有跑 typecheck、test、build，也没有启动网站。

1. Python 3 标准库：`hashlib.sha256`、`unicodedata.normalize("NFC")`、`json`、`xml.etree.ElementTree.parse`。退出码 **0**。SVG 根节点宽 1672、高 941、`viewBox` 为 `0 0 1672 941`。`<text>` 22 个，顺序与 `visibleText` 一致。字号只有 48、52、56、60、64。解析没有抛异常。
2. 另一次 Python：`en-body.md` 的 `count(b"\r")` 打印 `cr 0`，`count(b"\n")` 打印 `lf 100`。退出码 **0**。
3. `git diff --check` 退出码 **0**，没有空白错误输出。
4. `git diff --check --no-index -- /dev/null` 对 `en-body.md` 和 `en-figure.svg` 各退出码 **1**，stdout 和 stderr 都是 0 字节。这是相对空文件有差异，不是空白错误。
5. `sips -g pixelWidth -g pixelHeight -g format` 对两张候选 PNG 退出码 **0**。两张都是 PNG，1672×941。
6. 用本机读图打开 `media/en-figure-candidate.png` 和 `media/cover-candidate.png`。判断来自看到的画面，不用协调者的回读代替。

四个公开路径仍然不存在：

- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp`
- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif`
- `out/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp`
- `out/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif`

Length 和 SEOTruth 不属于 D。没有跑正文计数脚本，也不把「1363 剔 37」写成这三门的通过证据。

## 上一轮 6 处现在的位置

1. 旧第 9 行把右键说成 Steam 回复、指向下一节、并写帖子是 2019 年。现第 1 行是：「Stand next to a ripe parsnip and right-click it. A parsnip does not need a scythe.」链接锚文本就是「right-click it」。生长天数在第 58–62 行，没有在开头再写一遍。1.6 界限在第 45 行的铱金镰刀上。
2. 旧第 11 行「That paragraph is about…」和「from the Steam reply」已删除。现第 11 行留下播种、施肥、不耗能量，最后一句只把收取留在右键或 X。
3. 「The crop hold is the forum sentence.」已删除。现第 21–23 行是鼠标离开角色、脚下那一格、手里有种子才同时种下，以及 1.4 的机器长按。
4. 「read on October 12, 2026」和 Vita 行标签已删除。精通点数那一段也不在正文里。留下的是第 45 行：1.6，领取 Farming Mastery 之后得到，物品能力与耕地范围分两句写。没有写成耕种 10 级单独解锁。
5. SVG 第 3 行 `<desc>` 现在是：「Left-Click or C with a scythe for kale, wheat, amaranth, Unmilled Rice, and Fiber.」可见文字第 20 行仍是「Unmilled Rice, Fiber」。作物名一致。没有加「这不是截图」。
6. 图前那句只重复右键或 X、左键或 C 的段落已删除。图直接跟在第 47 行后面。

## ResearchTrace

检索日志和五类编辑腔都查过。正文扫描没有 documented、source-backed、verified、this guide、this article、not a measured、screenshot、read on、forum sentence、next section、That paragraph、the page says、changelog says、history says。没有内部路径、任务号或 operation-store 字样。

下面这些容易被误判，核对后不命中：

- 第 1 行把操作词「right-click it」链到 Steam 帖。锚文本是动作，不是「这条回复说」。
- 第 7 行「X is mapped to the same click」链到论坛帖，接着写 X 也能收。这是键位条件，不是核查旁白。
- 第 9 行「The names here are the defaults.」说明这些默认名可以在 Options 里改。
- 第 13–17 行只给 Xbox、PlayStation、Switch 的命令键名，没有写手柄键收取防风草。
- 第 19 行标题「The Hold-and-Walk Method」是这一节的做法名称。正文写的是脚下那一格，再走去下一株，没有写成 Wiki 规则。
- 第 23 行「1.4 shortcut」把机器长按和作物长按分开。这会改变玩家按住之后发生的事。
- 第 45 行先写「It can be used to harvest any crops.」，下一句限定耕地范围内的对象。两句并列，没有收成一句，也没有「its text says」。
- 第 47 行链接锚文本是「1.6.9」，后面是更新说明里的三条效果，没有「changelog says」。
- 第 49–51 行图注以「Schematic:」开头，后面只描述画面。alt 也只描述画面。
- 图上 22 段可见文字没有核查口吻。`creationBasis` 里的「Not a game screenshot」仍只在媒体清单，没有进入正文、alt、图注或画面。

## ReaderValue

关键词 `how to harvest stardew valley`，en / US。主意图仍是怎么把成熟作物收下来：防风草用手，点名的作物用镰刀，铱金镰刀多了耕地范围，以及各平台文档里两个命令各叫什么键。没有改成金/天、升级或规划器教程。

读者可以照着做完：

- 第 1 行和第 7 行：站在成熟防风草旁边，右键或 X。
- 第 21 行：要收多株时，按住右键或 X，鼠标离开角色，再在作物上走动；长按作用在脚下那一格。手里有种子时，同一格会同时种下。
- 第 31 行：PC 把镰刀拿在手里，用左键或 C 挥。手机先自己选中镰刀，没有另造一个作物键。
- 第 35–39 行：羽衣甘蓝、苋菜、小麦写「scythe or better」；未碾米和纤维种子不写 or better。
- 第 58–62 行：不含下种日。春 1 每天浇水的防风草在春 5 可收；春 3 没浇则到春 6。五种镰刀作物各有一个对应日期。
- 第 78–86 行：当季可以留到下一天；第 28 天之后不当季的会枯；点名的跨季作物和夏 28 的小麦可以进秋 1。
- 第 94 行：任意斧三下，15 到 21 个普通品质。左上角成熟并且浇过水才会合成。
- 第 98–100 行：棚架枯死前走不过去，旁边留一格。规划器只在这里用来留这一格，并说明它能放作物、检查覆盖。

第 80 行和第 88 行的站内链接指向另一项任务，收获步骤仍在本文完成。

候选 PNG 我自己看过。画面是两张大卡片加底部三块，文字与 22 个 `<text>` 一致，包括「Unmilled Rice, Fiber」「Hold on your tile」「Iridium 1.6: tilled soil」「15-21, no wilt」「Path is blocked」「Off-season wilts」「Greenhouse」「all year」。没有第二套作物名，也没有「不代表截图」。`sips` 量到 1672×941。历史目录里两份 PNG 与这份候选的 SHA256 相同；SVG 这次只改了不绘制的 `<desc>`，像素不变和这一点相符。我仍按当前 SVG 文字和当前这张图核对，没有把旧图当成另一套内容。

封面候选图没有文字。它不在正文读者面里。三门不把它算作正文图，也不把它当成已经装进页面的封面。

公开 WebP/AVIF 未生成，所以成品页面图文仍未验证。这不推翻上面三门，也不能写成网站完成。

## Repetition

没有整段再做同一件事。

- 第 1 行给出防风草右键；第 7 行补上 X 和可改键；第 11 行的作用是播种与收取分开。
- 第 35–39 行给天数；第 62 行把同一天数算成具体日期。删掉第 62 行，读者就只剩天数，没有「哪一天可收」。
- 第 37 行的小麦 40% 干草，在第 86 行用来决定夏天收还是留到秋 1。
- 第 88 行和第 94 行都提到巨型作物不能在温室长出。前一段讲温室能否过季，后一段讲巨型作物能长在哪里。
- 第 68 行的青豆 3 天是再生；第 98 行的 3 天是还要再站到旁边那一格。
- 图注描述画面，不再另有一段图前对照表。

## 明确不做的结论

- 不代替 E，不宣布 E 已经通过这个哈希。
- 不宣布标题、锁稿、中文译文或本地网站通过。
- 不宣布 `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley` 已经可以打开。
- 手机页面上的字号是否好读，留给 G 装配之后的页面检查。源图和 SVG 字号不能代替那一步。
