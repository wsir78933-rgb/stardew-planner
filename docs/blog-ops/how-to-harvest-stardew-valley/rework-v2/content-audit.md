# 收获文读者任务审计（rework-v2）

结论：**must-fix**。当前正文没有让读者完成「怎么收获作物」。标题承诺的两件事写出来了，后面的步骤不能照着做。旧评审里的通过结论本轮不沿用，这里也不给通过。

本轮只新增本报告和 `content-audit/` 里的页面截图。没有改正文、图片、SEO、测试或旧报告。预览进程没有停。

## 读者现在能做到哪一步

关键词是 `how to harvest stardew valley`。读者要完成的动作是：认出能收的作物，用对的输入或工具收下来，能连续收，并且分清徒手、镰刀、斧头这三类。

| 读者要做的事 | 现在的正文 | 判定 |
|---|---|---|
| 收一株普通作物 | 开头写了：站在成熟防风草旁，右键；X 也行 | 这一下有 |
| 连续收很多株 | 写了按住，但站位和「走过就收」缠在一起，还插进酿酒桶 | must-fix |
| 分清三类收获 | 徒手、镰刀、斧头三处都有，但夹在伤害和采集说明里 | must-fix |
| 认出已经成熟 | 只有「记得播种日再加天数」。田里怎么看，没有 | must-fix，且不能靠猜测补 |
| 标题里的两句话 | 右键收防风草、羽衣甘蓝用镰刀，标题、描述、正文第一句都有 | 承诺的这两句在 |

桌面打开页面时，第一屏是标题、描述和封面，还没到步骤。描述已经把右键、镰刀和漏浇顺延说完。封面在南瓜旁边画着一把锄头；后文写巨大作物用斧头。这是画面和正文对不上，不是一份「读者已经学错」的记录。页面没有缺段。链接把句子拆开之后的粗提取，不能当成正文少了段落。英文 HTML 含 “Stand next to a ripe parsnip”，中文 HTML 含 “站在成熟的防风草旁”。

## 材料与计数

对照过这些文件，句子是同一稿：

- `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`
- `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`
- `docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md`
- `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-body.md`
- `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json`
- `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-seo.json`
- 页面标题来自 `src/blog/blog-post-registry.tsx`，与两份 SEO 的 title / description 一致

英文计数用 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`，对象是锁定稿。脚本原样输出 `mechanical_units` 1363，`length_class` short，满 1000，不满 2000，`sha256_nfc_lf` 为 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`。这个哈希与 `en-seo.json` 的 `bodyHash` 相同。

脚本把 `<figcaption>` 里的字也算进去了。去掉整个 `<figure>` 后再用同一套计数，正文是 **1326**。V7 把 1000–1999 定为短文。1326 落在这个区间里，是合格的短篇计数。2000 不是这篇的默认要求。本轮的问题是读者做不完，不是 1326 不够长。

若以后删掉离题段，计数掉到 1000 以下，要补的是已经有事实、并且直接服务收获的步骤和解释，例如把站位、种子条件和天数判断写清楚。不要用伤害、干草或其他无关数字把字数补回去。田里的外观判断只有在事实代理给出原句之后才能加。

中文计数只作参考：同一脚本 `--locale zh-CN` 报 `mechanical_units` 2216，`length_class` reference_only，`sha256_nfc_lf` 为 `ec8b60fc7e99ac1c18b566bdd3594edc29f524d5cc6d3470625ef506f772c024`，与 `zh-seo.json` 的 `bodyHash` 相同。中文没有单独字数门槛。

## 五个必须改的问题

不提供可粘贴的替换句。位置用锁定稿和译文行号；两份 TSX 的句子与它们相同。

### 1. 按住收获时，种子条件前后不一致

must-fix。交给 C 改英文。译文随后跟着改。

原句，`writing/locked/en-body.md` 第 7 行与第 21 行：

> On PC, stand on a tile beside the ripe parsnip and press Right-Click. One click harvests it.

> For more than one plant, hold Right-Click or X and keep the mouse away from your character. That hold plants seeds and harvests on the tile you are standing on. If seeds are in your hand, the same hold plants that tile while it harvests. Then walk around over your crops. The hold keeps using the tile under your feet.

中文对应句在 `translation/zh-body.md` 第 7 行和第 21 行。

问题出在稿子自己的句子上。单击写的是站在旁边。按住先写会在脚下那一格播种并收获，下一句又写成手里有种子才播种。读者无法从这两句判断：手里没有种子时，按住还播不播种。第 23 行接着写酿酒桶、腌酱桶和 crystalarium，对象已经不是作物。

研究记录里的玩家原句（F43）是：按住右键、鼠标不要靠近角色，会在角色站着的那一格播种和收获。本轮不把旧的内部 limit 升级成新的游戏错误。稿子里能直接看见的，是种子条件写了两次，而且两次不一样。

修订要求：

- 按住只留一个种子条件：手里有种子时，收的同时种下。不要前面先写无条件播种。
- 单击的「旁边」和按住的「脚下」如果都保留，要让读者看出是两种站法。
- 机器那段不放在作物步骤里面。
- 不要采用 `research/controls-supplement.md` 里比 F43 更强的「从旁边经过就自动收」。那份补充不是本轮新核过的事实。

手柄和手机不在这条里判成事实错误。第 13–17 行写明是 Controller，并点了 Xbox、PlayStation、Switch。没有用户记录证明读者已经把它们当成手机键。这些平台能不能用列出的键收作物，本文没有作物原句，交给事实代理。第 31 行只写移动端要自己选中镰刀再挥，没有写一个手机收获键。旧记录里的 limit 不在这里当成已经证实的错句。

### 2. 「怎么知道能收」只有一套被重复的日历

must-fix。交给 C。田里的外观判断另交事实代理，C 先不要写。

原句，锁定稿第 35–39 行已经写了羽衣甘蓝 6 天、苋菜 7 天、小麦 4 天、未碾米 8 天或近水 6 天、纤维 7 天。第 62 行又各算一遍：

> Use the same count on the scythe crops. Kale planted and watered on Spring 1 is ready on Spring 7. Amaranth planted on Fall 1 is ready on Fall 8. Wheat planted on Summer 1 is ready on Summer 5. Unmilled rice planted on Spring 1 is ready on Spring 9 on ordinary soil, and on Spring 7 when the shoots sit within about 3 tiles of water. Fiber seeds planted on day 1 are ready on day 8.

这一大节排在镰刀对比之后。读者要先读完伤害和采集，才看到「何时能收」。

日期本身和已有记录一致，不要改成另一套日子：F29 的算法是播种当天不算，5 天作物第 1 天种下则第 6 天可收；防风草 4 天，春 1 每天浇水则春 5。漏浇一天顺延一天，春 3 漏浇则春 6。这些保留一个例子就够。

田里怎么认：`research/serp-evidence.json` 的搜索摘要里有 “green Plus symbol”。同文件写明那是摘要，不是打开后的原文，也不能当游戏规则。布局简报也禁止写绿色加号。本轮没有新的已核实外观证据。C 不要补光标、株型或颜色。

修订要求：

- 保留一条计数规则、防风草春 1 到春 5、漏浇则春 6。
- 删掉第 62 行对每种镰刀作物的再次换算。天数留在作物列表里各一次。
- 把「何时能收」挪到镰刀武器说明之前，紧跟怎么按。
- 外观判断等事实代理给出可引用的原句后再写。没有原句就保持只有日历。

这是重复，也是第 2 条：同一组日子承担了两次说明。

### 3. 镰刀一节离开了「怎么收」

must-fix。交给 C。

原句，锁定稿第 29、43–47 行：

> A swing spends no energy. It cuts grass, weeds, young trees, and moss, and you can swing it as a weak weapon. The blacksmith does not upgrade it. From 1.6, dying no longer removes the starter Scythe or the Golden Scythe from your inventory.

> Next to the starter scythe, it has a larger radius, a higher chance to cut all the grass in that radius, a 75 percent chance per swipe to harvest hay from grass, and 13 damage instead of 1 to 3.

> Hay from grass is 100 percent per swipe, and the damage is 20 instead of 13.

> In 1.6.9, the Gatherer chance to double harvested forage also applies when you use an iridium scythe. Forage crops from garden pots no longer always come out low quality with no experience.

这些句子在 F03、F07、F08、F09 里有记录，所以不是无来源数字。它们不改变读者收作物的动作。任务范围点名要拿掉的，就是这段历史、伤害和采集分支。

读者需要留下的差别只有：

- 苋菜、羽衣甘蓝、小麦用镰刀或更好的镰刀；未碾米和纤维种子用镰刀挥击。列表不要写成「只有这些」。F15 说这是打开过的页面，不是完整名单。
- 小麦用任何镰刀收时，另有 40% 掉干草。这是收小麦的结果，可以留在小麦那一条。不要展开割草。
- 铱镰刀可以收耕地里的普通作物。留这一句能力。F08 的原意是 “Can be used to harvest any crops.” 以及耕地范围内的普通作物。
- 金镰刀的好处列表没有写「能收普通作物」。不要补「不能收」，也不要补「会砍坏防风草」。如果这段不能告诉读者一个不同的收获动作，就整段删掉。
- 纤维「不是农作物」有 F14。掉落 4 到 7 个纤维、10% 混合种子不帮助怎么收，删掉数字。

删掉：体力、武器、铁匠、死亡是否掉镰刀、1.4 引入史、割草几率、75% 与 100% 干草、伤害 1–3 / 13 / 20、大葱、野生种子采集物、1.6.9 采集者与花盆品质。

22 条里这是第 2 条。

### 4. 中文有几处不能跟本站译名和自然说法一起用

must-fix。交给翻译，等英文定稿后再改对应句。不要在英文还在改时单独润色即将删除的段落。

会留下来、需要改写法的：

- `translation/zh-body.md` 第 7 行：「X 键映射为相同的点击操作」。这是把 “X is mapped to the same click” 逐词译出来的。按 X 也能收，这层意思要留，说法要像玩家说话。
- 第 94 行：「霜花瓜」。本站 `last-day-to-plant-stardew.zh.tsx` 和 `stardew-fruit.zh.tsx` 写的是「霜瓜」，并链到中文维基的霜瓜页。英文是 Powdermelon。收获文要改成与这两篇相同的名字。

会随英文删除、不必单独修句子的：

- 第 23 行「复制晶石机」。本站其他文章没有这个叫法。本轮没有打开中文维基，不猜官方译名。英文若删掉机器段，这句一起删。
- 第 29 行「力竭倒下（死亡）」。意思跟着 “dying” 走，但说法不自然。英文若删掉死亡与物品栏，这句一起删。
- 第 47 行附近花盆采集那句，中文堆了「不再总是出低品质且不给经验」。英文若删掉 1.6.9 采集分支，这句一起删。

其余抽查过的收获句，数字、键名和段落顺序与英文一致：防风草右键、五种镰刀对象、春 5 / 春 6、斧头三下、15 到 21、棚架走不过。未碾米、齐瓜与本站其他文章一致。

22 条里这是第 19 条，加上第 18 条的作物名。

### 5. 图没有教站位，封面把锄头放在南瓜旁边

must-fix。图的返工不在这次改正文里做。C 只改图要表达的要点；像素另作。

桌面页面证据：ego-browser TaskSpace 120，两页图都解码为 1672×941，显示宽 702、高 394。英文当前图是 `how-to-harvest-stardew-valley-en-methods.avif`，中文是 `zh-methods.avif`。截图：

- `content-audit/en-desktop-top.png`
- `content-audit/en-desktop-figure.png`
- `content-audit/zh-desktop-top.png`
- `content-audit/zh-desktop-figure.png`

信息图上能读出三类标签：右键或 X、左键或 C、斧头 3 下。中文图对应是「右键或 X」「左键或 C」「斧头砍 3 下」。这层是有的。

缺的是读者卡住的那一层。英文图只写 “Hold on your tile”。中文图只写「按住收获脚下格」。两张都没有「鼠标离开角色」，也没有把「站在旁边点一下」和「站上去按住」分成两步。图放在铱镰刀那段后面，读者是在伤害数字之后才看见它。

封面 `public/blog/how-to-harvest-stardew-valley-cover.webp` 在南瓜旁边画了一把锄头，麦田旁是镰刀，棚架和温室是场景。页面 alt 与注册表一致，英文含 “three pumpkins and a hoe”。正文写巨大作物用斧头，普通南瓜也没有写成用锄头收。读者在步骤之前先看见锄头和南瓜。

修订要求：

- 信息图要让人看出三个动作：旁边右键收一株；鼠标离开角色后按住，收脚下那一格；镰刀拿在手里用左键或 C；巨大作物用斧头砍三下。
- 不要把 “Hold on your tile” 当成已经讲清连续收获。
- 封面不要把锄头画成南瓜的收获工具。场景可以留，工具要和正文的收获动作一致。
- 图注可以继续用 “Schematic:” / 「示意图：」。不要写这张图不代表什么。
- 本轮没有重测 390 宽。桌面 702 宽上，上述标签能读出来。窄屏是否挤字，图片返工时再看，这里不判失败。

允许阅读的材料里没有用户抱怨图片的原话。依据是这次返工范围里的「图片」，加上上面两张实图。不把旧的图片通过结论当成用户已经接受。

## 不必改成另一套事实的地方

这些句子容易被误伤。修订时保留事实，只删重复或离题：

- 防风草右键来自 2019 年 Steam 回复和 2021 年论坛帖，不是维基上的一句「收作物请按右键」。动作可以留。不要改写成维基规定了这个键，也不要写成左键不能收。
- 播种和施肥不耗体力，是耕地页对播种施肥的话。没有写成「徒手收获耗体力」。不要补收获耗体力。
- 温室里可再生作物换季不死亡，是温室页的话，写在温室那一段里。保留时主语仍是温室里的作物。
- 巨大作物三下斧头、15 到 21、左上角成熟且浇过水、换季不枯，与 F27 一致。
- 青豆 3 天、草莓 4 天、咖啡只写成熟后继续产出、不写间隔天数，与 F30 一致。
- 当季过夜还在，过季枯死，多季作物是 Ancient Fruit、Coffee Bean、Corn、Sunflower、Wheat。与 F25 一致。

## 不阻塞

- 再生列表写 Coffee，换季列表写 Coffee Bean。中文是「咖啡」和「咖啡豆」。英文先统一成同一种作物称呼，译文再跟。这不挡住收获步骤。
- 棚架段最后一句指向农场规划器，用来留站立格。留着。不要为了工具再加一段。
- 最晚播种日、温室种什么，各有一处站内链接。留着。
- 页面左下角有开发提示 “1 issue”。本轮没有打开它，不把它写成正文错误。
- 22 条里没有为了凑表去改的项目：开头已经给出右键和镰刀；没有祝福结尾；没有「已核验」这类编辑腔；平行的作物列表可以保留。

## 交给 C 的修订任务卡

这是任务卡，不是成品，也不是通过。C 只用自己的话改英文读者正文和图要表达的要点。不改中文，不改 SEO 字段，不改旧报告，不把本卡的句子粘进正文。

目标：读者读完能收作物。字数不是目标。

按这个顺序写，每段只做一件事：

1. 一株普通成熟作物：站在旁边，右键或 X。
2. 很多株：鼠标离开角色，按住，作用在脚下那一格。种子条件只写一次：手里有种子时才同时播种。单击的「旁边」和按住的「脚下」不要写成没说明的同一种站法。
3. 镰刀作物：点名现在这篇已经核实的几种，说明拿镰刀用左键或 C。铱镰刀另加一句：也能收耕地里的普通作物。
4. 记得播种日时怎么算能收：一条规则，防风草一个例子，漏浇一个例子。
5. 不收会怎样：当季过夜还在；过季枯死；点名的多季作物和温室是例外。
6. 例外：巨大作物斧头三下；棚架走不过，旁边留站立格。

从收获步骤里删除：酿酒桶那段、镰刀伤害和割草干草、死亡是否掉镰刀、铁匠、纤维掉落个数、每种作物再算一遍日期、1.6.9 采集者与花盆。手柄表和移动端选镰刀先留在事实代理；没有作物原句之前，不要改写成收获步骤，也不要写成已经证实的误读。

不要新写：绿色加号或任何未给原句的成熟外观；左键不能收获；金镰刀不能收或会砍坏普通作物；未给原句的手柄、手机或「从旁边经过就自动收」；徒手收获的体力消耗；祝语或「本文讲了什么」。

图的要点与第 5 个问题相同。封面不要把锄头当成南瓜的收获工具。

改完后用同一计数脚本重数英文，附上脚本原始输出。1326 已经是合格短文，不要为了靠近 2000 加字。若删节后低于 1000，只补已经有事实、并且直接服务收获的步骤和解释。不要用无关数字凑字。没有原句的成熟外观不要写。

## 交给翻译的范围

等上面的英文定稿后，只改受影响的句子和图中文字。第 4 个问题里标成「会留下来」的两处必须改。随英文删除的句子不要润色后再留下。数字、链接、oldid 保持与英文一致。霜瓜用本站已有译名。

## 交给事实代理的两项

不重做整篇研究。旧研究记录里的 limit 只说明当时不许写什么，本轮不把那些 limit 当成新的已证实错误。

1. 站在田里、不记得播种日时，有没有已打开来源能支持的「现在可以收」判断。搜索摘要里的绿色加号不能用。没有这种来源，就保持正文只有日历。
2. Xbox、PlayStation、Switch 和移动端：正文列出了键名，或写了镰刀要自己选中。这些句子有没有对应的作物收获原句。没有原句，就不要补成收获步骤。也不要根据本轮推断，写成正文已经把它们说成了手机键。

## 页面回读证据

预览在回读前已经在听端口，回读后仍在听。没有重启，也没有停止。

- 监听：`node` PID 44772，地址 `127.0.0.1:3004`
- 工作目录：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 启动：Tue Oct 13 02:41:04 2026，命令含 `next dev --webpack --hostname 127.0.0.1 --port 3004`
- 父进程 PID 44758，工作目录相同
- `curl`：两页都是 HTTP 200
- 英文 HTML 含 “Stand next to a ripe parsnip”
- 中文 HTML 含 “站在成熟的防风草旁”
- ego-browser TaskSpace **120**，用完已 `finish`
- 英文页标题与 H1：How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe
- 中文页标题与 H1：星露谷物语怎么收获：防风草右键采摘，羽衣甘蓝需要镰刀
- 两页 H2 顺序与正文五节一致
- 图注与 alt 与 TSX 一致

本轮没有用中文 OCR。本机没有 `chi_sim` 语言包，失败记录在 `content-audit/zh-methods-ocr.err`。中文图的文字以桌面截图和 SVG 文本节点为准，SVG 写的是「检查 / 执行操作」，没有叠字。

## 本轮没有做的事

没有改文章源码、图片、SEO、测试或旧报告。没有 commit、merge、push、deploy。没有安装依赖。没有把本报告写成通过，也没有把用户或图片写成已经接受。
