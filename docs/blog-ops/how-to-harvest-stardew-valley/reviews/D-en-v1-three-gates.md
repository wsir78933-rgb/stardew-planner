# D 写后检查：how to harvest stardew valley 英文候选 v1

- 角色：D。不是 C，不是 E。本会话没有改正文、图、布局、SEO 或产品代码。
- 任务 `task_a0a8d2e776f7`，Dispatch `ctx_f846e74bdbe7`，终端 `term_6c10e47b-9ee2-44a2-9995-511f5a188304`。
- 协调者消息 `msg_150a3410aecb`（delivery `delivery_821da3fbee84`）已读：E 由另一个会话并行看同一候选；本报告不引用、不代替 E。F 不能把本报告当成通过。
- 隔离只是目录约定。没有做操作系统权限试验，不能写成底层隔离已验证。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树。

## 结论

同一版本三门没有同时通过。不能交给 F，也不能把本地网站说成已完成。

| 门 | 结果 | 必须改的数量 |
|---|---|---|
| ResearchTrace | 失败 | 4 |
| ReaderValue | 失败 | 1（只在图解无障碍描述；正文步骤本身不另失败） |
| Repetition | 失败 | 1 |

必须改的 6 处要在同一次返修里处理。协调者说明全篇还剩 1 轮返修。本报告不提供可粘贴进正文的替换句。

公开 WebP 和 AVIF 不存在。这不是 6 处必须改之一，也不把「尚未装配」判成正文错误。协调者后续消息 `msg_f4cd63863caa` 要求继续审源码、读者价值和重复；本报告已经按正文和图解源码做完这三门。图位和 `en-media.json` 的交付路径仍然不是成品图文通过。页面由 G 装配、E 另验。

## 被检查的字节

读者面是 `writing/en-body.md` 全文：从第一段到文末，没有「来源」标题，也没有编辑附录。图注、alt 用正文里的 `<figcaption>` 和 `<img alt>`。图中文字用 `writing/en-figure.svg` 的 `<text>`、`<title>`、`<desc>`。`en-media.json` 的 `creationBasis` 不是读者面。

| 文件 | SHA256 |
|---|---|
| `writing/en-body.md` | `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421` |
| `writing/en-figure.svg` | `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3` |
| `writing/en-media.json` | `1d4cd52f3d7cc7b180e60183c8f18ca61bd58b1889243c02e44a1422c38451c3` |
| `layout/writer-brief.md` | `57c65db0c8e89e407bba950658e5b37027051a3d83a93ee2c62a18eee60523da` |
| `layout/task-card.md` | `ee424eae5f6fe7df05df9b7a9fa1f67a1d44739b65cbd2f6f00610aa595b5f9a` |

`en-body.md` 12143 字节，UTF-8，NFC，无 CR，以换行结束，行尾空白行号为空。SVG 5634 字节，同样通过这几项。正文 alt、caption 与 `en-media.json` 各精确出现 1 次。

## 验证命令和退出码

工作目录就是上面的工作树。下面是本轮实际跑过的命令。没有跑 typecheck、test、build，也没有启动网站。

1. Python 3 标准库脚本：`hashlib` 计算上表 SHA256；`unicodedata` 核对 NFC；`json` 读取媒体清单；`xml.etree.ElementTree.parse` 解析 SVG；比对 22 个 `<text>` 与 `visibleText`；检查字号；检查四个公开图路径是否存在；`subprocess` 调用下面的 git。脚本退出码 **0**。解析没有抛异常。
2. `git diff --check` 退出码 **0**，stdout 和 stderr 都是 0 字节。已跟踪文件没有空白错误。未跟踪的正文不会被这条命令扫到。
3. `git diff --check --no-index -- /dev/null <file>` 对 `en-body.md`、`en-figure.svg`、`en-media.json` 各退出码 **1**，stdout 和 stderr 都是 0 字节。退出码 1 是相对 `/dev/null` 有差异，不是空白错误。三个文件的行尾空白行数都是 0。
4. `git status --short -- docs/blog-ops/how-to-harvest-stardew-valley/writing docs/blog-ops/how-to-harvest-stardew-valley/reviews` 退出码 **0**。当时只看到 `?? docs/blog-ops/how-to-harvest-stardew-valley/writing/`。本报告是在这次状态之后写入的。

SVG 结果：根节点宽 1672、高 941、`viewBox` 为 `0 0 1672 941`。`<text>` 22 个，顺序与 `visibleText` 一致。字号只有 48、52、56、60、64。

公开资产，四条都不存在：

- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp`
- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif`
- `out/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp`
- `out/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif`

没有把 SVG 光栅化，也没有打开网页。画面是否在 390px 下可读，本阶段未验证。

Length 和 SEOTruth 不属于 D。没有跑正文计数脚本，也不采用修订说明里的 1648 作为通过结论。

## ResearchTrace：失败

检索日志和五类编辑腔都算。来源当主语、带链接的描述性锚文本、以及会改变操作的条件，保留。下面先列必须改的，再列核对过但不算命中的句子，避免把正常引用改掉。

### 必须改 1

- 位置：`writing/en-body.md` 第 9 行。
- 类型：来源核查旁白；文章自指。
- 原句：「The growth time is on the Parsnip page. The right-click itself is the Steam reply. X is the same click in the forum post quoted in the next section. The Steam thread is from 2019, before the 1.6 Iridium Scythe.」
- 修改要求：删掉「点击本身就是某条回复」「下一节会引用那篇帖」和「这篇帖是哪一年」这类说法。生长天数已经写在第 64–66 行，不要在这里再写一遍天数。若 1.6 的铱金镰刀会改变开头「防风草不用镰刀」的操作，把界限放在玩家手里的工具和游戏版本上；第 49 行前半已经写了这项工具，不要改成帖子年代或作者读页记录。

### 必须改 2

- 位置：`writing/en-body.md` 第 11 行最后两句。
- 类型：文章自指；来源核查旁白。
- 原句：「That paragraph is about putting seeds and fertilizer down. The parsnip pick is the right-click from the Steam reply.」
- 修改要求：删掉「那一段是在说什么」以及「这次收取就是那条 Steam 回复」。同段前面关于左键播种、施肥、不耗能量的操作条件要留下，那是播种而不是手收耗能。不要另写一句免责来代替被删的两句。

### 必须改 3

- 位置：`writing/en-body.md` 第 27 行最后一句。
- 类型：来源核查旁白。
- 原句：「The crop hold is the forum sentence.」
- 修改要求：删掉把作物长按说成「论坛里的那句」。同段前面已经写了鼠标离开角色、长按收的是脚下那一格、手里有种子会同时种下，以及 1.4 那个长按只对机器。这些操作条件留下。

### 必须改 4

- 位置：`writing/en-body.md` 第 49 行最后两句。
- 类型：检索日志（作者读页日期），并带上来源表的行标签叙述。
- 原句：「On the wiki front page read on October 12, 2026, the computer row was labeled 1.6.15, and the PlayStation Vita row was labeled 1.02. This 1.6 scythe sits outside that Vita label.」
- 修改要求：删掉「哪一天读了首页」和「这一行标签因此落在另一行之外」。同段前面关于精通洞穴、耕种 10 级单独不够、物品说明与耕地范围并列、范围、干草和伤害，都要留下。若某个平台版本根本没有这把 1.6 镰刀，写成玩家的平台和版本条件，不要写成作者看过的表格。

### 核对后不判编辑腔

这些句子含有来源、日期、page 或 test 一类词，但不算五类编辑腔，返修时不要删：

- 第 1 行用 2019-03-26 那条回复当主语，并链到 Steam 帖，后面是站在旁边右键。这是来源锚文本。
- 第 7 行写默认键可在 Options 里改，「labels below are the defaults」只说明下面列出的是默认键。
- 第 13–21 行是各平台「Check / Do Action」和「Use tool」的键名。没有把 Xbox A、PlayStation 十字、Switch A 或手机点击写成防风草收取键。第 21 行「called right-click on PC」是手机方案上的键名对照，不是作物键结论。
- 第 17 行把 Switch 世界中的 Y 和后面的武器键分开。这会改变玩家按哪个键，不是在叙述核查状态。
- 第 25 行引文与 A 的 F43 `publicQuote` 相同，24 个英文词，停在脚下那一格。引文本身是操作句子。
- 第 33 行「A swing spends no energy」说的是镰刀挥动。第 11 行前半的不耗能量说的是播种和施肥。都不是手收耗能声明。
- 第 49 行前半「Its text says, "Can be used to harvest any crops."」然后立刻写耕地范围内的对象。两句并列，没有收成一句。
- 第 64 行把 Crops 的计数用到 4 天列表上，并保留入门页的「4 days」。没有写成防风草页印了第 5 天。
- 第 56–57 行图注以「Schematic:」开头，后面只描述画面。alt 也只描述画面。二者都没有写「不代表截图」或「不对应数值」。
- SVG 的 22 段可见文字没有 documented、verified、screenshot 或检索日期。
- 正文没有内部路径、任务号、Dispatch 号或 operation-store 字样。

`en-media.json` 的 `creationBasis` 写了「Not a game screenshot」和「WebP and AVIF files are not created」。这串字不在正文、alt、图注或 SVG 可见文字里。不要把它搬进图注。

## ReaderValue：失败

失败点只有图解无障碍描述。主意图没有被规划器改写，正文里的收获步骤可以照做。

用户关键词是 `how to harvest stardew valley`，语言 en、国家 US，站点 `https://stardewvalleyplanner.art`。A 的主意图 I01 是：分清已打开的作物里哪些用镰刀，铱金镰刀对普通作物多了什么，以及各平台文档里 Use tool 和 Check/Do Action 各是哪个键。PC 防风草右键来自玩家帖，不是 Wiki 原文。可见子问题是不收会怎样、怎么判断能收、有没有更快的收法；必要例外是巨型作物用斧、棚架要留得出手的位置。

正文对应关系：

- 第 1、7、43 行：PC 上防风草用右键或 X；镰刀作物用左键或 C 挥镰刀。
- 第 25–27 行：更快的做法是按住右键，鼠标离开角色，收脚下那一格。这与 F43 已采用的 `publicQuote` 一致。
- 第 35–51 行：五类镰刀作物的季节和天数，以及三把镰刀的差别。铱金镰刀写成 1.6、耕地范围，没有写成金镰刀会毁掉防风草。
- 第 64–76 行：生长天数不含下种日，没浇水就往后推；再生例子只有青豆 3 天、草莓 4 天、咖啡不写天数。
- 第 82–92 行：当季留下不枯，换季后不当季的枯死，点名的跨季作物、夏 28 的小麦、修好的温室还在。
- 第 98–102 行：任意斧三下，15 到 21 个；棚架枯死前不能走过去，旁边留一格。

规划器只在第 102 行出现两句，用来留棚架旁边的站立格，并说明它能放作物、检查覆盖。这没有把文章改成规划器教程，也没有改成金/天或升级指南。第 90 行和第 92 行的站内链接指向另一项任务，不是「去另一篇才能完成本文」。

任务卡和 writer brief 要求「hold-and-walk / 穿行收割」。A 的 F43 语句和 24 词公开引文停在脚下那一格。I04 和 G04 把「边走边收」记成 2021 年玩家帖，并禁止提升成 Wiki 规则。正文没有写成穿行规则，这不是正文失败。返修不要补一段穿行百科，也不要补祝尼魔小屋整节。B 已把祝尼魔排除出正文；缺这一节不使 PC 收获步骤无法完成。

### 必须改 5

- 位置：`writing/en-figure.svg` 第 3 行 `<desc>`。
- 类型：图解语义。无障碍描述和可见文字不是同一种作物。
- 原句：「Left-Click or C with a scythe for kale, wheat, amaranth, rice, and fiber.」
- 同图可见文字第 20 行是：「Unmilled Rice, Fiber」。
- 修改要求：描述里的作物名要和这行可见文字是同一个作物，不能用一个更短、可以指另一种物品的词代替未碾米稻。不要在描述或图注里加「这不是截图」。可见的 22 段文字、字号和两张大卡片加底部三块的结构不用重做。

可见文字和事实的对应是成立的：防风草卡片只有防风草、Check / Do Action、右键或 X、脚下那一格；镰刀卡片是已点名的作物和左键或 C，另有一行「Iridium 1.6: tilled soil」；底部是斧三下、15-21 且不枯、三种棚架挡住路、第 28 天不当季枯萎、温室全年。没有 0 能量手收，没有「左键不能收」，没有「镰刀毁掉防风草」。这行铱金说明没有写成羽衣甘蓝必须用铱金镰刀。

因此 ReaderValue 的失败不要求重写五节结构。公开 WebP/AVIF 未生成，所以即使描述改对，本阶段仍然不能宣布成品图文通过。

## Repetition：失败

### 必须改 6

- 位置：`writing/en-body.md` 第 53 行。对照保留第 1 行、第 7 行、第 43 行，以及第 56–57 行图注。
- 类型：同一作用的重复。这一段只再次列出防风草用右键或 X、五类作物用镰刀且左键或 C。
- 原句：「On PC, a parsnip uses Right-Click or X. Kale, wheat, amaranth, unmilled rice, and fiber seeds use a scythe, and that swing is Left-Click or C.」
- 可保留的唯一信息：第 1 行已经给出防风草右键和五类作物用镰刀；第 7 行给出键名和可改键；第 43 行给出 PC 挥镰刀是 Use tool 的左键或 C，并保留手机必须自己选中镰刀；图注负责描述示意图。第 53 行没有新的操作条件。
- 修改要求：删掉这一段重复。不要把同一张对照表换词后再写进图前。图注可以继续描述画面。

下面这些重复出现的事实不判失败，因为所在段落的作用不同：

- 第 1 行只点名镰刀作物，第 35–41 行给出季节、天数和小麦 40% 干草。
- 第 82 行说当季不枯、不当季会枯；第 86–88 行说次日看见枯株、用镰刀清掉，以及小麦可以留到秋 1。
- 第 92 行在温室规则里提到巨型作物不能在温室长出；第 98 行在巨型作物规则里同时写了温室、花盆和姜岛。两段的主作用不同。
- 第 72 行的青豆棚架是在说 3 天再生；第 100 行是在说走不过去。

## 返修边界

C 只用自己的话处理上面 6 处。不要改 A 的研究文件，不要改 B 的任务卡，不要改本报告。不要为了补字加免责、FAQ、来源清单或第二种搜索意图。不要把 `creationBasis` 写进图注。

新版本必须是新的文件字节。旧的三门结果不能沿用到新 hash。D 会在新候选落盘后对全文重做三门。

## 本阶段明确不做的结论

- 不宣布 ResearchTrace、ReaderValue、Repetition 通过。
- 不宣布英文定稿、中文翻译、标题、锁稿或页面通过。
- 不宣布 `https://stardewvalleyplanner.art` 上已经有这篇文章。公开图未生成，页面未由本角色打开。

## 报告落盘后的只读复核

同一工作树再次执行：

- Python 重算 SHA256。`en-body.md` 仍是 `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`。`en-figure.svg` 仍是 `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3`。两次都与写入本报告前一致。
- `git diff --check` 退出码 0。
- `git status --short` 只把 `docs/blog-ops/how-to-harvest-stardew-valley/writing/` 和 `docs/blog-ops/how-to-harvest-stardew-valley/reviews/` 显示为未跟踪。这次状态没有列出 `src` 或 `public` 的修改。
