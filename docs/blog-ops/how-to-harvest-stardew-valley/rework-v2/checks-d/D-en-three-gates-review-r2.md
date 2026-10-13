# 角色 D 写后三门 · 第 2 轮（英文候选）

- 角色：独立写后检查 D。不兼任 A/B/C/E/F/T/G。
- 任务：`task_9a49307208a9`；派发：`ctx_a7afcadd5874`
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 候选：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/writing/en-body.md`
- 绑定文件：同目录 `en-media.json`、`en-public-references.json`
- 本轮只新增本报告和 `checks-d/r2/`。未改正文、SEO、译文、图片字节、历史 D1/R1。

## 版本

本轮重算，不沿用写作者表格里的通过结论。

| 文件 | UTF-8 NFC-LF SHA-256 |
|---|---|
| `writing/en-body.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` |
| 本轮自行去掉两段 `<figure>` 后的正文 | `31d70053f672023c210eadaf8d95af943ffb30721095fca3e36e809d978d9069` |
| `writing/en-media.json` | `1f004b1788988aac4b95c8bf4659254881712ebc0704f4266bea7e54dbe30757` |
| `writing/en-public-references.json` | `2d01287cbcd0cfaa15d4f457d9b1d8187d9bcf631433cd53a3a4e2855138e0ef` |

`en-media.json` 的 `bodySha256NfcLf` 和引用文件的 `bodyHash` 都等于上面的正文哈希。原始字节哈希与 NFC-LF 哈希相同。命令：`python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r2/collect_evidence_r2.py`，退出码 0。收据：`checks-d/r2/sha256-receipts.json`。

官方计数脚本 `博客-V7修订版/脚本/正文计数.py --locale en`：

- 原文：退出码 0，1148，`length_class` short，`meets_mechanical_floor` true，`meets_long_form_target` false。`checks-d/r2/count-full.stdout.json`
- 去掉两段图注后：退出码 0，1107，同样是 short，过 1000、不到 2000。`checks-d/r2/count-eligible.stdout.json`
- 脚本字段 `semantic_qualification` 为 `requires_independent_review`。1107 只说明机械长度够短文底线，不是三门通过。

21 条 `appliesTo.quote` 在正文中的出现次数都达到所写 occurrence。`checks-d/r2/reference-fidelity.stdout.txt` 末行 `FAILS 0`。定位成功只证明引文锚在这篇正文里，不证明句子为真。

## 门一 ResearchTrace：通过

对照 `02-内容生产与质量门.md` 读者口吻五类，以及 22 条里“合法引用和真正影响操作的条件不算编辑腔”。

正文没有检索日志、内部路径、助手残留，也没有 “documented / source-backed / This guide / readback”。短语计数见收据：这些词都是 0。

保留的归因是操作条件，不是核查旁白：第 24 行 “As stated in the general crop rules” 后面就是浇水规则链接；第 36 行 “According to the crop growth calendars” 对应日历原句 “seeds are replanted and watered on the day of harvest”。图注只写画面里的南瓜、泥土、木棚架、紫葡萄，并注明 ConcernedApe 新闻稿截图。没有写“这张图不代表什么”。

## 门二 ReaderValue：通过

关键词是 `how to harvest stardew valley`（`research/serp-evidence.json` 的 query）。检索页在问怎么判断能收、怎么收、季节结束和巨大作物怎么收。本篇主任务仍是：认成熟、PC 站在旁边右键、按住右键且光标离开角色后边走边收、镰刀例子、1.6 铱镰刀收耕地作物、斧头收巨大作物、棚架留通道、收不下来时按症状分流。

新人可以按正文做完：成熟看最终收获精灵；防风草 4 个浇水日、南瓜 13 日；播种日不计入，春 1 播防风草则春 5 早上可收，漏浇一天推到春 6；单株是站在旁边右键或按 X；左键和 C 是工具或放置；长按右键且光标不靠近角色，走过时收脚下那一格；手持种子时可以在腾出的地上播下一种；蓝莓留下植株，13 日后每 4 天再结，这株不用再播种；苋菜、甘蓝、小麦、未碾米、纤维种子用镰刀，纤维种子不用每天浇水；铱镰刀是 1.6 耕种精通那把，挥刀范围内收耕地上的普通作物；巨大作物任意斧头砍 3 下，掉 15–21 个普通品质，换季不枯；青豆、啤酒花、葡萄的活棚架走不过去，枯了才能穿，实心种满会够不着，双行留道是布局建议。排错四条分别对上“精灵没按时出现、徒手没反应、人走不进去、初一枯了”。

没有扩成手柄专用采收键、移动端点作物、花盆、野葱、野籽、巨大作物养成名单或 1% 概率教程。农场规划器、最晚播种日、温室各只有一句，挂在棚架通道和换季枯萎上。

引用定位 0 失败之后，下面七句按已保存原句核对。没有发现需要再开新来源的未支持断言。

### 先前七项在这一版里的原句

D-RV-04。第 7 行：“In the field, a crop is ready when that plant shows its final harvest sprite.” “replaces immature” 计数 0。不再把所有作物说成果实换掉幼苗。第 9 行只把南瓜写成耕地上一颗大而圆的橙色果实；已查看 `facts-audit-v2/pumpkin_harvest_stage.png`，精灵本身是橙色圆果。这是指名例子，不是全作物概括。

D-RV-05。第 32 行：“Stand next to the ripe crop and right-click it.” Steam 原句是 standing next to it and rightclick。第 9 行和第 18 行没有再写走进田里单点。“walk onto” 计数 0。脚下那一格只出现在第 40–42 行的长按走动：论坛原句是 hold right click with the mouse not near your character，然后 harvest on the tile you're standing on。

D-RV-06。手柄作物键和 “tap the plant” 已不在正文。Xbox、tap directly 计数 0。移动端只剩第 50 行选中镰刀再用，对应 Mobile Controls 原句 “the scythe, which must be selected to use”。没有把通用点击写成作物专属采收。

D-RV-07。第 34 行只说徒手收获不必挥工具，左键和 C 绑定工具或放置物品。Controls 原句是 Left-Click, C: Use tool or place item。“damage the soil” 计数 0。

D-RV-08。“immediately” 计数 0。第 42 行是长按右键走过成熟的单次作物时，收脚下那株，并可以在腾出的地上播种。蓝莓是留下继续结果，所以 “does not need another seed”。这句对应再生事实里的“无需再播种”，不是被撤回的“游戏禁止播种”或同帧判定。13 天成熟、采后每 4 天，来自蓝莓页和阶段表，不是单独的浇水词条。第 26 行用 “likewise” 接上作物页的每日浇水规则，没有声称蓝莓页另有一句再生浇水原文。

D-RV-09。第 54 行只保留：铱镰刀是 1.6 Farming Mastery 那把，挥刀范围内收耕地上的作物，包括普通作物。花盆、野葱、野籽计数都是 0。铱镰刀页原句更宽，这一句是其中“tilled soil / swing range / regular crops”和精通来源的收窄，没有把范围外的东西写回来。

D-RV-10。巨大作物一节第 60 行只留任意斧头、三下、15 to 21 个普通品质、换季不枯。花椰菜、霜瓜、齐瓜计数 0。开头仍用 “combine across 3x3 plots” 指出斧头要砍的是这种作物；Crops 原句有 planted in a 3x3 pattern can randomly combine，以及 any axe, three hits, 15–21。这里没有写 1% 或品种表。排错里的 “3x3 giant crops” 只用来分流“徒手没反应就换斧头”。

照片只核对形状和路径。三张反解 PNG 的 IHDR 和六张 staged WebP/AVIF 的 `sips` 都是 1672×941，`sips` 退出码 0。正文两张图的 `src` 与 `en-media.json` 的 suggested 路径一致。已查看反解图：成熟作物图是耕地旁泥土路上的橙色南瓜，图注没有写 4×5 满格，也没有写人物刚刚按键收获；棚架图能看到木桩、紫葡萄和中间通道，图注没有把右侧黄花植株写成葡萄棚架，也没有写红衣角色正穿行通道。封面不在正文里；封面 alt 与傍晚南瓜田、土路、旁边木架一致。

本门没有必须修改项。

## 门三 Repetition：通过

重复必须是两处承担同一作用。下面这些相近的字不是同一作用：

- 开头口诀预告方法；后文各节才教条件和结果。
- 第 11 行说明蓝莓采后留株和 4 天间隔；第 26 行用这个间隔说明继续浇水会让下一茬按日历推进。
- 第 64 行给棚架规则和枯死后能走；第 66 行说明实心种植会够不着，并给出双行留道。第 81 行只回答“人已经走不进去”。
- 第 24 行讲缺水顺延；第 79 行只回答“到了日子还没有收获精灵”。
- 镰刀名单在开头、第 48 行和第 80 行各出现一次：分别是口诀、操作、徒手失败后的工具分流。

没有两段在做同一件事。排错没有把前面的天数推导再写一遍。

## 结论

三门都针对正文 `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`，都通过，且没有必须修改项。可以交给独立 E 审这一版。标题、中文、网站页面本轮没有审。用户终审仍未做。本轮没有改产品，所以没有跑全站测试或构建。
