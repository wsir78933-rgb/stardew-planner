# 角色 F 独立淬文锁稿与英文 SEO 报告 · 第 2 轮 (Rework-v2 Lock-F)

- **角色与阶段**：角色 F（Role F / Independent Tempering, Draft Lock & English SEO，阶段一：英文正文技术锁定与 SEO 生成）。不兼任 A（研究）、B（布局）、C（写作）、D（写后检查）、E（独立审核）、T（翻译）、G（页面装配）或主协调者。
- **任务标识**：`task_9f6e1015f10b`；**派发上下文**：`ctx_faa086858d96`
- **执行终端**：`term_aca9cc2c-4e32-400d-ac3b-3df9f72a82c4`；**协调员终端**：`term_ea92c135-a44b-411d-94e1-e3c209acc3a8`
- **工作树**：唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`（无新建工作树，无嵌套派发，无内置子代理，逻辑隔离）。
- **前置依赖核验**：
  - **角色 D 写后三门 R2**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/D-en-three-gates-review-r2.md`（任务 `task_9a49307208a9` / 派发 `ctx_a7afcadd5874`），三门通过，对 SHA-256 `d2908d59...` 有效。
  - **角色 E 独立鉴文 R2**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/english-r2.md`（任务 `task_f52988ed2be5` / 派发 `ctx_0eafdf7031cb`），八层通过，同构确认绑定 `d2908d59...`。
  - **角色 M 媒体制作**：6 个 Staged 文件（WebP/AVIF）全部就绪于 `rework-v2/media/staged/`，Root 真实 view 像素确认接受，Q 纠正描述入 manifest。
- **历史状态说明**：
  - 历史 `reviews/F-en-lock.md` 为旧版基线运行产物，已被本次用户明确要求的全链返工（rework-v2）supersede；
  - R1 候选版本（`a91783b9...`，可计 1317 词，21 引用）因 D-R1 指出多处未支持外推而被驳回，已被废弃；
  - 本轮 R2 候选（`d2908d59...`，可计 1107 词）为 D 与 E 首次达成双通过的真实新版定稿。
- **执行授权与范围**：仅在私有目录 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/` 新增锁定副本、绑定 JSON、SEO 决策及收据文件。绝对不修改业务源码 (`src/`)、公开资产 (`public/`) 或测试 (`tests/`)；不执行中文翻译；不冻结公开交接；标题仅提交 E 独立复核，本角色不签署 SEO 最终通过。

---

## 一、版本与哈希确定性核验 (Version & Hash Receipts)

本角色严格依照 V7 规则重算输入与输出文件的 UTF-8 NFC-LF SHA-256 及原始字节哈希：

| 文件路径 | 原始字节 SHA-256 | UTF-8 NFC-LF SHA-256 | 字节大小 (Bytes) | 判定与一致性说明 |
| :--- | :--- | :--- | :---: | :---: |
| `rework-v2/writing/en-body.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | 10036 | D/E 同审输入原稿 |
| `rework-v2/lock-f/en-body.locked.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | 10036 | **技术锁定副本，零字句修改 (0 diff)** |
| `rework-v2/checks-d/r2/en-body.caption-excluded.md` | `31d70053f672023c210eadaf8d95af943ffb30721095fca3e36e809d978d9069` | `31d70053f672023c210eadaf8d95af943ffb30721095fca3e36e809d978d9069` | 9132 | 剔除两段 `<figure>` 图注后一致 |
| `rework-v2/lock-f/en-media.locked.json` | `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885` | `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885` | 4463 | 绑定 M 六个 Staged 媒体资产与哈希 |
| `rework-v2/lock-f/en-public-references.locked.json` | `24d5c227dd11e5e4cd96bab3d937a7e4547cde72af84e4816b5838e009f9db96` | `24d5c227dd11e5e4cd96bab3d937a7e4547cde72af84e4816b5838e009f9db96` | 10301 | 21 条引文精准锚定锁定正文 |
| `rework-v2/lock-f/en-seo.json` | `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9` | `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9` | 3381 | 选定候选 #2，待 E 独立题文审核 |

现场执行回执记录于 `lock-f/sha256-receipts.json`。`diff -u writing/en-body.md lock-f/en-body.locked.md` 退出码为 0，输出为空，证实锁定副本未增删或修改任何一个字节。

---

## 二、淬文审查与主意图一致性 (Tempering & Reader Value)

角色 F 对锁定版本进行严格的编辑淬文审核（不替写手 C 改写正文，仅核对结构与兑现）：

1. **唯一主搜索意图识别**：
   - 原始查询：`how to harvest stardew valley`（Google US SERP 新手核心意图）；
   - 任务定义：向玩家讲解如何判断作物成熟并成功采收，清楚划分徒手交互、镰刀收割与斧头采伐的工具边界，掌握连续走动采收技巧，理解生长期计算与缺水顺延，规避棚架阻挡与换季枯萎；
   - 边界控制：未泛化为全作物经济学排行榜、温室金币最大化或精通洞穴全技能教程，亦未强行塞入非读者需要的规划器营销。
2. **正文子问题结构**：
   - 成熟识别：最终成熟外观精灵（final harvest sprite）、防风草 4 天、南瓜 13 天、蓝莓 13 天初次 + 4 天再生留株；
   - 生长期推算：播种日不计、需浇水夜晚数、缺水停长顺延；
   - 徒手采收：PC 站在旁边右键 / X，区分左键 / C 的工具与放置绑定，长按右键且光标远离角色边走边收脚下格；
   - 镰刀采收：甘蓝、苋菜、小麦、未碾米、纤维种子需普通镰刀，1.6 耕种精通铱镰刀可收耕地上的普通作物；
   - 特殊作物：3×3 巨大作物任意斧头砍 3 下掉 15–21 个普通品质且换季不枯，活棚架阻挡通行需规划走道；
   - 排错分流：按未出精灵、徒手无反应、走不进去、初一枯死 4 类可观察症状明确分流。
3. **信息增益落到实处**：
   - 明确指出长按走动采收的作用格是“角色当前踩着的脚下格 (tile you are standing on)”，手持种子可连贯播种；
   - 明确指出活棚架在枯萎前无法穿透，必须在种植前预留走道；
   - 明确指出缺水不会导致作物死亡，仅将成熟日按干旱天数向后顺延。
4. **读者口吻与零编辑腔**：
   - 彻底清除五类编辑腔，无 “documented”, “source-backed”, “This guide covers”, “readback”；
   - 两处保留的归因为规则引用链接（第 24 行浇水规则、第 36 行日历规则），图注与 alt 仅描述画面元素（南瓜、土路、棚架、紫葡萄、新闻稿截图出处），无自我解释或免责声明。

---

## 三、正文计数与长度门核验 (Word Count & Length Gate)

运行官方脚本 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en`：

### 3.1 机械计数原始输出

- **全文（含两段 `<figure>` 图注）**：
  - 命令行：`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/en-body.locked.md --locale en`
  - 退出码：`0`（标准输出已持久化至 `lock-f/count-full.stdout.json`）
  - 机械计数值：`1148` 英文单词；`length_class`: `short`；`meets_mechanical_floor`: `true`；`meets_long_form_target`: `false`。
  - 剔除行统计：`headings: 13, code: 0, non_body: 36, excluded_sections: 0, frontmatter: 0`。
- **剔除图注后的合格可计节点 (Eligible Count)**：
  - 命令行：`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/checks-d/r2/en-body.caption-excluded.md --locale en`
  - 退出码：`0`（标准输出已持久化至 `lock-f/count-eligible.stdout.json`）
  - 机械计数值：`1107` 英文单词；`length_class`: `short`；`meets_mechanical_floor`: `true`；`meets_long_form_target`: `false`。
- **剔除项明细**：
  - 原始值 1,148 减去两段 `<figcaption>` 中的文字（15 + 26 = 41 单词），精确得到合格可计净值 **1,107** 单词。
  - 正文无独立目录、无独立 FAQ 模块、无文末来源堆叠列表、无代码块。

### 3.2 短文交付判定理由

根据 V7《01-统一工作流.md》与《02-内容生产与质量门.md》规定：
- 长度门只计英文原文，合格字数 ≥2000 为长文，1000–1999 为短文，允许交付；
- **主意图材料已写完的充分理由**：
  本篇围绕 `how to harvest stardew valley` 展开，属于高聚焦、强实操动作的新手核心操作指南。1,107 单词已全面且详尽地涵盖了判定成熟、计算天数、缺水延迟、徒手采摘、移动连击、镰刀作物清单、1.6 铱镰刀能力、巨型作物斧砍、棚架通行规划以及 4 种典型排错症状。
  若强凑 2,000 单词，势必导致回填被禁止的编辑腔免责、虚构手柄/移动端未支持按键、或者偏离主意图引入果树/动物/酿酒百科等杂质内容。因此，1,107 词在确保信息完整且无任何注水的情况下，完全符合 V7 短文合规交付标准。

### 3.3 阅读时间估算 (Read Time)

按照业内标准阅读速度 200 单词/分钟计算：
$$\text{readTimeMinutes} = \left\lceil \frac{1107}{200} \right\rceil = \lceil 5.535 \rceil = 6 \text{ 分钟}$$
沿用现有 `BlogPostMeta` 字段，设定 `readTimeMinutes: 6`。不发明额外作者、日期或用户评价信任信号。

---

## 四、公开引用精准锚定核验 (Public References Fidelity)

核验 `en-public-references.locked.json` 中收录的全部 21 条引文：
- 校验脚本：`lock_phase_f_r2.py`
- 结果输出：`lock-f/reference-fidelity.stdout.txt`
- 结论：**21 项引用 100% 存在于锁定正文中，且出现次数均不小于指定的 occurrence，失败数 FAILS = 0**。

### 21 条公开引用映射总表

| 编号 | 引用 ID | 来源标签 (Label) | 公开 URL | 锚点片段 (Quote) 摘要 | Occurrence | 状态 |
|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | `en-steam-parsnip-right-click` | Steam Community discussion on harvesting a parsnip | Steam Discussions oldid 1849197902669410411 | stand beside a mature plant and [right-click it] | 1 | PASS |
| 2 | `en-wiki-parsnip-stages` | Parsnip on the Stardew Valley Wiki | `.../Parsnip&oldid=191123` | A [parsnip]... takes 4 days of watered growth | 1 | PASS |
| 3 | `en-wiki-pumpkin-stages` | Pumpkin on the Stardew Valley Wiki | `.../Pumpkin&oldid=194726` | A [pumpkin]... takes 13 days of watered growth | 1 | PASS |
| 4 | `en-wiki-blueberry-regrowth` | Blueberry on the Stardew Valley Wiki | `.../Blueberry&oldid=192090` | For multi-harvest crops like the [blueberry]... 13 days | 1 | PASS |
| 5 | `en-wiki-crops-watering` | Crops on the Stardew Valley Wiki | `.../Crops&oldid=193979` | [crops must be watered every day for maximum growth] | 1 | PASS |
| 6 | `en-wiki-controls-action` | Controls on the Stardew Valley Wiki | `.../Controls&oldid=192481` | [X is mapped to the same Check/Do Action] as right-click | 1 | PASS |
| 7 | `en-wiki-controls-tool` | Controls on the Stardew Valley Wiki | `.../Controls&oldid=192481` | [left-click and C] are bound to using tools or placing items. | 1 | PASS |
| 8 | `en-wiki-calendar-replant` | Crop Growth Calendars on Wiki | `.../Crop_Growth_Calendars&oldid=189875` | [crop growth calendars]... seeds are replanted and watered | 1 | PASS |
| 9 | `en-forum-hold-right-click` | Stardew Valley Forums post on controls | Forums post 53699 | [hold right-click with the mouse not near your character] | 1 | PASS |
| 10 | `en-forum-x-mapped` | Stardew Valley Forums post on controls | Forums post 53699 | [X is mapped to right-click] | 1 | PASS |
| 11 | `en-wiki-scythe-examples` | Scythe on the Stardew Valley Wiki | `.../Scythe&oldid=171696` | A standard [scythe]... amaranth, kale, and wheat. | 1 | PASS |
| 12 | `en-wiki-kale` | Kale on the Stardew Valley Wiki | `.../Kale&oldid=192520` | [Kale is harvested with a scythe or better] | 1 | PASS |
| 13 | `en-wiki-fiber-seeds` | Fiber Seeds on the Stardew Valley Wiki | `.../Fiber_Seeds&oldid=193587` | [fiber seeds are harvested with the scythe] | 1 | PASS |
| 14 | `en-wiki-unmilled-rice` | Unmilled Rice on the Stardew Valley Wiki | `.../Unmilled_Rice&oldid=194130` | [unmilled rice is harvested with a scythe] | 1 | PASS |
| 15 | `en-wiki-mobile-scythe` | Mobile Controls on the Stardew Valley Wiki | `.../Mobile_Controls&oldid=189843` | [select the scythe before you use it] | 1 | PASS |
| 16 | `en-wiki-iridium-scythe` | Iridium Scythe on the Stardew Valley Wiki | `.../Iridium_Scythe&oldid=186836` | The [iridium scythe] is the 1.6 Farming Mastery scythe. | 1 | PASS |
| 17 | `en-wiki-giant-crops` | Giant Crops on the Stardew Valley Wiki | `.../Crops&oldid=193979#Giant_Crops` | drops [15 to 21 normal-quality items]... does not die | 1 | PASS |
| 18 | `en-wiki-trellis` | Trellis Crops on the Stardew Valley Wiki | `.../Crops&oldid=193979#Trellis_Crops` | [Green bean, hops, and grape] grow on a trellis. | 1 | PASS |
| 19 | `en-wiki-season-wither` | Crops on the Stardew Valley Wiki | `.../Crops&oldid=193979` | [crops that are no longer in season wither on the 1st] | 1 | PASS |
| 20 | `en-press-multiplayer-2-mature` | ConcernedApe Stardew Valley press screenshot | PressKit Multiplayer_Screenshot2.png | ConcernedApe, Stardew Valley press screenshot (fig 1) | 1 | PASS |
| 21 | `en-press-multiplayer-2-trellis` | ConcernedApe Stardew Valley press screenshot | PressKit Multiplayer_Screenshot2.png | ConcernedApe, Stardew Valley press screenshot (fig 2) | 2 | PASS |

本公开引用清单无任何内部抓取日志、无私有路径、无污染标记、无未过门草稿，完全符合公开交接标准。

---

## 五、媒体资产绑定核验 (Media Asset Binding)

角色 F 严格核实角色 M 制作交付并在 `rework-v2/media/manifest.json` 中由 Q 修订描述的 6 个 Staged 文件：
- **拒绝旧版虚假资产**：彻底废弃历史旧版带文字标注的 SVG 示意图（`how-to-harvest-stardew-valley-en-methods.webp`）以及任何未核实的插画或假游戏截图；
- **真实官方截图规格**：采用 ConcernedApe 官方 Press Kit 真实农场截图，按 16:9 标准比例（1672×941）Lanczos 重采样生成高保真 WebP 与 AVIF。

| 资产标识 (ID) | 画面角色与对应正文位置 | 规格 (宽×高) | 格式 | 真实文件字节 | SHA-256 哈希 | 最终公开绑定 URL |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| `media-cover` | 封面图（黄昏农场南瓜田、鸡舍与木棚架） | 1672×941 | WebP | 479,250 | `0f35cee83ceb...` | `/blog/how-to-harvest-stardew-valley-cover.webp` |
| `media-cover` | 封面图（同上） | 1672×941 | AVIF | 237,604 | `8c23cae6ef5b...` | `/blog/how-to-harvest-stardew-valley-cover.avif` |
| `media-mature-crops` | 正文图 1（日间耕地上成熟橙色南瓜近景） | 1672×941 | WebP | 267,644 | `d24578e3860a...` | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` |
| `media-mature-crops` | 正文图 1（同上） | 1672×941 | AVIF | 143,638 | `cab14677146b...` | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif` |
| `media-trellis-paths` | 正文图 2（两排木质棚架与中间通行泥土走道） | 1672×941 | WebP | 223,784 | `027e085cd18d...` | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` |
| `media-trellis-paths` | 正文图 2（同上） | 1672×941 | AVIF | 113,557 | `7991d66a038a...` | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif` |

图注与 alt 严格保持与正文 C 原文一致：
- `media-mature-crops`：alt 为 `"Full orange pumpkins on tilled soil beside a dirt path."`；caption 描述泥土路上成熟南瓜并标注 ConcernedApe 链接。
- `media-trellis-paths`：alt 为 `"Two wooden trellises with an open dirt path between them and purple grapes on the trellis beside the path."`；caption 描述开阔泥土走道与木棚架紫葡萄并标注 ConcernedApe 链接。

---

## 六、七罪引擎生成与筛选评估 (Seven Sins Engine)

严格按照《七罪引擎.md》与《标题与描述规则.md》，开展 10 组候选方向的自由生成、后归类、去套路检查及两道生死质检。

### 6.1 第一步：正文核心承诺抽取

1. **读者点开后实际得到什么**：能够准确判断作物成熟时机，掌握 PC 徒手采收与长按走动连击，明确区分哪些作物需要镰刀或斧头，避免棚架死路与换季枯萎，并按 4 项症状排错；
2. **正文最大的事实与结果**：普通作物（防风草、南瓜、蓝莓）徒手右键或按 X 即可采摘；甘蓝、苋菜、小麦、未碾米和纤维种子必须用镰刀挥击；巨型作物必须用任意斧头砍 3 下；
3. **本篇独有的可操作观点**：长按右键走动采收作用在“脚下那一格”，可顺手播种；活棚架完全阻挡通行，必须双行留道；
4. **绝对不能做出的虚假承诺**：严禁承诺全平台手柄专属键（正文只给出 PC 按键）；严禁承诺金币/天最大化或升级最快；严禁声称工具会损坏耕地或割毁防风草。

### 6.2 第二步：自由生成 10 组标题与描述方向

| 编号 | 候选英文标题 (Candidate Title) | 候选英文描述 (Candidate Description) |
|:---:|:---|:---|
| 1 | `How to Harvest Crops in Stardew Valley Without Using the Wrong Tool` | Right-click or press X to pick standard crops like parsnips by hand. Keep a scythe ready for kale and wheat, and clear giant crops with three axe hits. |
| 2 | `How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe` | Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe. |
| 3 | `Why Your Stardew Valley Crops Won't Harvest by Hand` | Identify whether your crop is ready, check for unwatered delays, and switch to a scythe for kale, unmilled rice, or fiber seeds. |
| 4 | `How to Harvest and Replant Across Large Fields in Stardew Valley` | Hold right-click while walking with seeds selected to pick mature crops and sow new ones in a single pass across open soil. |
| 5 | `How to Harvest Stardew Valley Crops Before Season Turnover Kills Them` | Count growth days from the morning after planting, add a day for every unwatered night, and clear out-of-season stalks before the first. |
| 6 | `Stardew Valley Harvest Controls: When to Right-Click and When to Swing a Tool` | Pick single crops with right-click or X, hold the key to gather while walking, and switch to a scythe or axe for crops that resist hand picking. |
| 7 | `How to Keep Trellis Crops Reachable Every Harvest Morning in Stardew Valley` | Living trellises block movement entirely until withered. Leave open walking aisles between double rows so every vine remains reachable. |
| 8 | `Harvesting Giant Crops and Scythe Plants in Stardew Valley` | Standard crops harvest by hand, but giant 3x3 crops require three axe hits, and five designated crops come off only with a scythe. |
| 9 | `How Missing a Water Day Delays Your Stardew Valley Harvest` | Crops never die from dry soil, but each unwatered day postpones the final harvest sprite by one morning. Calculate maturity and harvest correctly. |
| 10 | `How to Harvest Stardew Valley Crops on PC from First Parsnip to Iridium Scythe` | Learn the right-click hand harvest, the hold-and-walk field sweep, tool-specific crops, and how 1.6 Farming Mastery changes tilled soil gathering. |

### 6.3 第三步：同站近期 3 篇英文标题去套路检查

读取 `src/blog/blog-post-registry.tsx` 现有已注册英文末尾 3 篇标题基线：
1. `what-to-grow-in-greenhouse-stardew`：`What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting`（套路：`What to [Verb] in [Place]: Choose by A, B, and C`）
2. `stardew-fruit`：`Stardew Fruit: Find Its Source Before Buying Seeds`（套路：`[Topic]: Find X Before Y`）
3. `oak-tree-vs-maple-stardew`：`Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree`（套路：`[Topic] A vs B: The X or the Y Names the Z`）

**去套路审查判定**：
上述 10 组候选完全避开了这三种历史句式，无冒号堆砌、无 `Choose by...`、无 `Find X before...`、无 `A vs B` 对比结构。

### 6.4 第四步：后归类与筛选评估表

| # | 机制归类 | 停留要素 | 人性驱动 | 停留检查评估 | 适配检查评估 | 筛选决策 |
|:---:|:---|:---|:---|:---|:---|:---:|
| 1 | 损失进入 / 自我颠覆 | 捷径、异常 | 懒惰：少走弯路；傲慢：纠正乱挥工具 | “Without Using the Wrong Tool” 点中新手痛点，停留明确。 | 描述中工具区分与三击斧头均受正文支持；但标题“避免用错工具”略偏消极防御。 | 保留（次选） |
| **2** | **结论前置** | **捷径、异常** | **暴食：一次看齐分类；懒惰：直接给操作清单** | **直接亮出“by Hand, Scythe, or Axe”三大清晰收割分类，精准击中读者对不同作物如何采摘的信息差。PASS** | **Hand (right-click/X), Scythe (kale/wheat), Axe (giant crops 3 hits) 字字兑现正文，无全平台虚假承诺，零冒号，极其自然。PASS** | **WINNER (入选)** |
| 3 | 悬念场景 / 异常 | 异常、冲突 | 愤怒：解决卡住无法采收的困扰 | 解决为什么摘不下来的困惑，停留感较强。 | 偏向于排错章节，无法涵盖正常大面积连收与工具收割的全貌。 | 淘汰（范围偏窄） |
| 4 | 结论前置 / 捷径 | 捷径 | 懒惰：连摘连种提速 | “Harvest and Replant” 击中大田操作，停留有效。 | 仅对应长按走动段落，忽略了镰刀与巨型作物的核心分类。 | 淘汰（主意图不全） |
| 5 | 损失进入 | 终结 | 贪婪 / 恐惧：避免作物枯死损失 | 季末枯萎虽然是痛点，但属于边界防守。 | 仅对应成熟日推算与过季枯萎，未直接回答“如何采摘”。 | 淘汰（偏离主任务） |
| 6 | 结论前置 | 捷径、异常 | 懒惰：区分按键操作 | “When to Right-Click and When to Swing” 有动作区分。 | 带冒号，且句式略显生硬，不如 #2 直观流畅。 | 淘汰（带冒号生硬） |
| 7 | 损失进入 / 悬念 | 冲突 | 愤怒：解决进不去田里采摘的问题 | 棚架无法通行为具体阻碍，停留明确。 | 仅对应棚架一节，无法代表全篇收获指南。 | 淘汰（范围偏窄） |
| 8 | 结论前置 | 异常 | 暴食：了解特殊作物 | 巨型作物与镰刀作物有信息差。 | 缺少最基础的防风草/南瓜徒手采摘主线。 | 淘汰（遗漏基础） |
| 9 | 反差数字 / 损失 | 异常 | 傲慢：纠正以为缺水会死的误区 | 缺水延迟是重要规则，停留感中等。 | 仅聚焦浇水规则，未回答核心采收动作。 | 淘汰（偏离主意图） |
| 10 | 结论前置 | 捷径、窥探 | 暴食 / 欲望：掌握 PC 进阶技巧 | “on PC” 严格限定平台，“First Parsnip to Iridium Scythe” 有全流程感。 | 跨度稍大，偏向精通进阶，不如 #2 朴实直击操作核心。 | 保留（备选） |

### 6.5 第五步：选定组两道生死质检 (Stop & Fit Checks for #2)

#### 1. 停留检查 (Stop Check)：**PASS**
- **读者为什么会停下**：新手或回流玩家在面对不同作物时，最常产生的困惑就是“为什么有些作物直接捡，有些却拔不下来？是不是需要工具？”
- 标题 `How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe` 直接在第一眼就给出答案框架——星露谷收割不是单一操作，而是清晰划分的“徒手、镰刀、斧头”三大体系。读者会立刻意识到自己的困惑能在这篇文章中得到一次性解决，触发“捷径”与“异常”停留要素，避免了泛泛“Harvesting Guide”的平庸。

#### 2. 适配检查 (Fit Check)：**PASS**
- **关键词自然度**：自然包含核心主词 `How to Harvest Stardew Valley Crops`，零冒号、零分号，语言干净流畅，符合英文读者自然搜索阅读习惯；
- **数字真实性**：标题无虚构夸大数字；描述中的“three times”准确对应正文斧砍巨型作物三下的规则；
- **动作真实性**：描述明确指出 `right-click or X` 针对徒手（防风草/南瓜），`scythe` 针对甘蓝/小麦，`axe` 针对巨型作物，字字在正文中有确凿依据；
- **无全平台虚假承诺**：描述明确给出 PC 键位 `right-click or X`，没有虚构“Across all consoles/platforms”；
- **情绪克制度**：客观平静叙述方法，无“fastest/ultimate/insane/secret”等夸张营销词。

---

## 七、选定 SEO 表面与字段元数据汇总 (Final SEO Surfaces)

根据选定方案，生成完整 SEO 表面，已持久化于 `rework-v2/lock-f/en-seo.json`：

```text
Title:           How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe
H1:              How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe
Description:     Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.
Slug:            how-to-harvest-stardew-valley
Public Path:     /how-to-harvest-stardew-valley
Canonical URL:   https://stardewvalleyplanner.art/how-to-harvest-stardew-valley
Topic:           Stardew Valley Guides
Author:          Stardew Valley Planner Team
Read Time:       6 min read (readTimeMinutes: 6)
Schema Type:     Article
Featured:        false
Date Published:  null (不发明伪造发布日期)
FAQ:             null (不捏造未过门 FAQ)
Title = H1:      true (遵循项目单 title 模板规范)
Status:          pending_title_review (严格待 E 独立复核)
Freeze Handoff:  false (待 E 审核与中文翻译完成后方可冻结)
```

字符数统计：
- Title / H1：`59` 字符（完美符合 Google 标题展示建议 50–60 字符标准，无截断风险）；
- Description：`141` 字符（完美符合 Google 摘要展示建议 120–155 字符标准，无截断风险）。

---

## 八、交付清单与后续环节边界 (Handoff Package & Boundaries)

### 8.1 本次交付文件清单

依照协调员最新明确指令（`msg_fb68d372f16d`），本次技术锁定输出文件已同步交付于 `rework-v2/` 根目录与 `lock-f/` 专有目录：

1. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/lock-r2.md`：本技术锁定与 SEO 决策全量报告；
2. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/en-body.locked.md`（及 `lock-f/en-body.locked.md`）：正文技术锁定副本（SHA-256 `d2908d59...`，零字句变更）；
3. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/en-seo.json`（及 `lock-f/en-seo.json`）：选定 SEO 表面元数据；
4. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/en-media.locked.json`（及 `lock-f/en-media.locked.json`）：绑定 Role M 六个 Staged 媒体资产清单；
5. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/en-public-references.locked.json`（及 `lock-f/en-public-references.locked.json`）：21 条核验合格公开引用清单；
6. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/count-full.stdout.json`：官方计数脚本全文机械输出；
7. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/count-eligible.stdout.json`：官方计数脚本剔除图注后机械输出；
8. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/reference-fidelity.stdout.txt`：21 条引文在正文中精准出现的逐项日志；
9. `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/sha256-receipts.json`：全量文件 SHA-256 自动化校验收据。

### 8.2 严格遵循的职责边界

1. **角色 F 不越权审核**：本角色仅作为起标题与技术锁稿方，**不自行宣布 SEOTruth 最终通过**；最终英文题文承诺、停留意图及描述真实性完全移交独立审核角色 E 进行独立复核。
2. **禁止提前翻译**：本阶段不执行中文翻译；待 E 独立通过英文标题后，方由独立翻译角色 T 进行全篇中译。
3. **禁止提前冻结**：当前 `freezePublicBlogHandoff` 明确保持 `false`；在 E 通过题文及译文之前，不生成最终装配交接包。
4. **禁止提前修改项目源码**：绝对未修改 `src/`、`public/` 或相关配置代码。

---

## 九、验证命令与现场回执复核 (Self-Verification Plan)

现场执行以下验证命令，确保无任何格式漂移与空白字符缺陷：

```bash
python3 -c "
import pathlib, unicodedata, hashlib
p = pathlib.Path('docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/en-body.locked.md')
s = p.read_text(encoding='utf-8')
assert unicodedata.is_normalized('NFC', s), 'Not NFC'
assert s.endswith('\n'), 'No trailing LF'
h = hashlib.sha256(s.encode('utf-8')).hexdigest()
assert h == 'd2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67', 'Hash mismatch'
print('VERIFICATION SUCCESS: locked body NFC-LF SHA-256 matches perfectly!')
"
```
回执状态：**PASS**。
