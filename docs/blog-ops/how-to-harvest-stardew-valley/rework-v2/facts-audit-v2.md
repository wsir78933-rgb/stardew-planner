# 《星露谷物语收获指南》Rework-V2 事实核查与修改要求报告（纠偏版）

- **审计角色**：事实核查审计员（Facts Auditor A2）
- **核查日期**：2026-10-13
- **核查环境**：唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **浏览器与接口**：本地 ego-browser（TaskSpace 115），Stardew Valley Wiki 社区维基页面回读，MediaWiki API 批处理
- **证据存储**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit-v2/`
  - `raw-sources-receipts.json`：全量条目来源 URL、精确引文、supports/not-supported 判定与推导标注
  - `parsnip_harvest_stage.png`：防风草最终 Harvest 阶段精灵图（实际 view 查看）
  - `pumpkin_harvest_stage.png`：南瓜最终 Harvest 阶段精灵图（实际 view 查看）
  - 保留上一版 `facts-audit/` 原始文件不做覆盖或删除

---

## 一、纠偏与撤回声明（Retraction & Correction Statement）

针对上一版 `facts-audit.md` 存在超出源引文证据的推论与未经验证的断言，本报告作如下明确纠偏与撤回：

1. **撤回游戏底层源码核查说法**：
   - 上一报告提及 `Crop::newDay` 与 `HoeDirt` 内部代码，但当前环境并无游戏客户端解包源码文件与执行验证环境。在此**明确撤回“源码已核验”的说法**，仅以社区维基页面脚注文献提及为准，不作为独立实证。
2. **撤回特定引文未包含的“已证实”主张**：
   - 撤回将“祝尼魔可穿过棚架”、“铱镰刀可远距离隔空收割棚架作物”列为 Crops 维基已证实事实的定性（Crops 页面棚架段落未包含这些内容）。
   - 撤回将“金镰刀挥过防风草不损坏作物”、“成熟单次作物停止浇水后永久保留不会死”、“枯株保肥”列为引用引文已证实事实的定性。
3. **撤回无直接来源的主观绝对断言**：
   - 撤回“右键是唯一安全按键”、“左键绝对不能推荐”等排他性断言。
   - 撤回“游戏绝对没有绿色加号”的光标断言（无直接文本否定，属于未验证项）。
   - 撤回“防风草露出橙色根部”等非文本记载的主观色彩描述；撤回“空手必须/手持食物优先弹窗”、“X 键完全不受光标干扰”等无来源支持的机制定性。
4. **纠正中文官方译名边界**：
   - 中文维基词条存在性与跨语言链接支持将“甘蓝菜”、“霜瓜”、“稻苗”、“上古水果”、“小桶”、“罐头瓶”、“宝石复制机”、“金色的镰刀”、“采石场矿井”作为**社区中文维基推荐规范译名**。
   - 但因未解包游戏本体本地化语言包，**不得声称“官方游戏字符串已核验”**，仅作为规范读者检索与阅读的维基推荐译名。
5. **巨大作物 1% 概率的性质定性**：
   - 每日 1% 概率确实存在于维基 Crops 页面中，但属于农作物生长机制细节；初稿收获教程未写 1% 属于正常信息取舍，不列为重大收获错误，后续布局可根据篇幅自行决定是否保留。

---

## 二、核心正向事实与核查清单（8–12 项供 C 撰写正文）

### 【FACT-01】PC 普通作物徒手收获（防风草 Parsnip）
- **来源归属**：Steam 社区讨论 (Steam Community Discussions) 结合 Stardew Valley Wiki (社区维基)
- **来源 URL**：
  - `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411`
  - `https://stardewvalleywiki.com/Controls` (revid 192481)
- **实际获取**：HTTP GET (2026-10-12T22:50:00Z) / ego-browser TaskSpace 115 (2026-10-13T07:46:20Z)
- **源原句**：
  - Steam: `The problem is... You don't NEED the scythe for parsnips. You need the scythe for amaranth or wheat. For ANY other crop, you need to be standing next to it and rightclick it.`
  - Controls: `Right-Click, X: Check/Do Action`；`Left-Click, C: Use tool or place item`
- **支持事实 (Supports)**：防风草等常规作物成熟后站在旁边按鼠标右键（Right-Click）即可收获，不需要镰刀；键盘 X 键在 Controls 中映射为相同的 Check/Do Action。
- **不支持/未证明 (Not-Supported)**：Steam 帖子中泛化的“For ANY other crop”（漏提了甘蓝菜、未碾米等镰刀作物）；未提及左键是否可用；未证明右键是唯一安全键。
- **推导标注 (Derivation)**：[推导] 玩家操作防风草收获依托通用 Check/Do Action 键，PC 默认右键与 X 键均可使用。

---

### 【FACT-02】PC 连续走动采摘机制（长按右键 / X 键）
- **来源归属**：Stardew Valley Forums (官方社区论坛)
- **来源 URL**：`https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699`
- **实际获取**：HTTP GET (2026-10-12T22:51:00Z)，作者 Elenna101
- **源原句**：`Or the direction button and right click. (X is automatically mapped to right click) If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on, and then you just have to walk around over your crops to plant and harvest your field.`
- **支持事实 (Supports)**：PC 上按住鼠标右键且光标不紧挨着角色，走过农田会自动采收脚下地块的成熟作物；若手中持有种子，该长按操作会在采收的同时自动完成播种；X 键映射到右键。
- **不支持/未证明 (Not-Supported)**：维基 Crops 页面正文未收录此连续走动技巧；该帖子未证明“X 键完全不受鼠标光标干扰”；未证明“手持食物会长按优先触发食用”。
- **推导标注 (Derivation)**：[推导] 此为论坛玩家一手实操经验，适合作为 PC 高效采收技巧向读者介绍，但不应表述为官方维基条目规则。

---

### 【FACT-03】需要镰刀收割的作物（示例名单）
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Scythe` (revid 171696)
  - `https://stardewvalleywiki.com/Kale` (revid 192520)
  - `https://stardewvalleywiki.com/Amaranth` (revid 192043)
  - `https://stardewvalleywiki.com/Wheat` (revid 192731)
  - `https://stardewvalleywiki.com/Unmilled_Rice` (revid 194130)
  - `https://stardewvalleywiki.com/Fiber_Seeds` (revid 193587)
- **实际获取**：ego-browser TaskSpace 115 页面与 API 查询 (2026-10-13T07:52:00Z)
- **源原句**：
  - Scythe: `It is also required for harvesting certain crops (i.e., Amaranth, Kale, Wheat).`
  - Kale: `Kale is harvested using a Scythe or better.`
  - Fiber Seeds: `Harvest with the scythe.`
- **支持事实 (Supports)**：Scythe 明确标注用于收获特定作物（举例为苋菜 Amaranth、甘蓝菜 Kale、小麦 Wheat）；独立页面证实未碾米（Unmilled Rice）与纤维种子（Fiber Seeds）同样使用镰刀收割。
- **不支持/未证明 (Not-Supported)**：Scythe 页面使用的“i.e.”为举例，未声明这是游戏内唯一的封闭名单（本次审计未对全部作物代码做穷尽普查）；未证明普通镰刀挥过成熟防风草是否产生损伤。
- **排除项**：明确剔除无关的武器攻击力伤害数值（1-3、13、20 点）与草料转化率，不混入收获教程。

---

### 【FACT-04】铱镰刀收割任意作物
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：`https://stardewvalleywiki.com/Iridium_Scythe` (revid 186836)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:53:36Z)
- **源原句**：`Can be used to harvest any crops... Can harvest items grown on tilled soil within its swing range, including regular crops, those grown in Garden Pots, Spring Onions, and other forageables grown from Wild Seeds.`
- **支持事实 (Supports)**：1.6 版本引入的铱镰刀（通过耕种精通获得）可以收割其挥击范围内耕地上的任何作物，包括常规作物、室内花盆作物、大葱以及野生种子采集物。
- **不支持/未证明 (Not-Supported)**：页面未包含“可隔空穿透棚架远距离采收”的文字主张。
- **推导标注 (Derivation)**：作为后期高级工具升级事实呈现，不罗列武器伤害数值。

---

### 【FACT-05】手柄控制器与移动端控制边界
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Controls` (revid 192481)
  - `https://stardewvalleywiki.com/Mobile_Controls` (revid 189843)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:46:20Z / 07:52:06Z)
- **源原句**：
  - Controls: `Xbox: A Check / Do Action / Use Cursor, X Use Tool. Playstation: Cross Check / Do Action / Use Cursor, Square Use Tool. Switch: A Check / Do Action / Use Cursor, Y Use Tool.`
  - Mobile Controls: `Tap on items to action them... The one exception with tools is the scythe, which must be selected to use.`
- **支持事实 (Supports)**：手柄通用键位定义；移动端默认点击交互，且镰刀是唯一必须先手动选中的工具。
- **不支持/未证明 (Not-Supported)**：社区维基没有为手柄设立专门的“农作物采摘键位”，不得捏造专门的采收功能键。
- **推导标注 (Derivation)**：[推导] 主机手柄采收作物依附于各平台的 Check/Do Action（Xbox A / PS Cross / Switch A），正文应说明这是全局交互键，而非独立农耕键。

---

### 【FACT-06】作物成熟视觉识别（生长阶段图表）
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Parsnip` (revid 191123)
  - `https://stardewvalleywiki.com/Pumpkin` (revid 194726)
- **实际获取**：ego-browser TaskSpace 115 真实抓取表格数据，下载并实际通过 `view_file` 查看图片 (2026-10-13T07:58:54Z)
- **真实表格与图片数据**：
  - **防风草 Parsnip**：Stage 1 (1天), Stage 2 (1天), Stage 3 (1天), Stage 4 (1天), **Harvest** (总计4天，图片 `Parsnip_Stage_5.png`，360 字节已保存并查看)。
  - **南瓜 Pumpkin**：Stage 1 (1天), Stage 2 (2天), Stage 3 (3天), Stage 4 (4天), Stage 5 (3天), **Harvest** (总计13天，图片 `Pumpkin_Stage_6.png`，456 字节已保存并查看)。
- **支持事实 (Supports)**：作物生长经过固定的生长阶段（Stages），达到最终阶段（Harvest）时植株显示完整成熟外观精灵图。
- **不支持/未证明 (Not-Supported)**：来源文本中未包含是否有“绿色加号”光标；来源未用文字限定果实外观颜色。
- **推导标注 (Derivation)**：撤回主观颜色描述与光标有无断言；建议 C 引导读者通过生长天数走完后呈现的成熟精灵图外观来识别。

---

### 【FACT-07】生长天数计算与缺水顺延
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：`https://stardewvalleywiki.com/Crops` (revid 193979)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:50:15Z)
- **源原句**：`Crops must be watered every day for maximum growth. If unwatered for a day, a crop will not grow. Unwatered crops do not die, but they will not grow either. If a seed is planted into unwatered soil and not watered the same day, it will not grow that night.`
- **支持事实 (Supports)**：生长周期不含播种当天；每天浇水才能推进生长；缺水一天生长顺延一天，未浇水作物不生长也不会死亡。
- **不支持/未证明 (Not-Supported)**：该引文未讨论作物完全长成后长期不浇水是否死亡。
- **推导标注 (Derivation)**：严格按原文说明未浇水导致生长顺延机制。

---

### 【FACT-08】巨大作物生成与采伐规则
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：`https://stardewvalleywiki.com/Crops#Giant_Crops` (revid 193979)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:48:19Z)
- **源原句**：`Cauliflowers, Melons, Pumpkins, Powdermelons and Qi Fruits planted in a 3x3 pattern can randomly combine into a giant crop. Giant crops drop 15–21 normal-quality items when harvested with any axe, taking three hits. At the start of each day, every possible 3x3 grid of crops (including overlaps) has a 1% chance to grow into a giant crop as long as the top left crop is fully-grown and watered, and all constituent crops are of the same type... Giant crops don't die at change of season like other crops...`
- **支持事实 (Supports)**：5 种作物可形成巨大作物（花椰菜、甜瓜、南瓜、霜瓜、齐瓜）；必须为 3×3 且全部为同一种作物；1.6 判定条件为左上角作物完全长成且已浇水；每日早晨有 1% 几率形成；必须使用任意斧头砍击 3 下采收；掉落 15–21 个普通品质产物；换季不枯萎；不能在温室、花盆或姜岛生长。
- **不支持/未证明 (Not-Supported)**：该引文未提及祝尼魔是否能收割巨大作物。
- **推导标注 (Derivation)**：采收指南的核心是斧头砍 3 下、15–21 掉落与同种 3×3 布局；1% 概率可作为机制补充，不强制要求作为主采收步骤。

---

### 【FACT-09】棚架作物不可通行与通道规划
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：`https://stardewvalleywiki.com/Crops#Trellis_Crops` (revid 193979)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:47:10Z)
- **源原句**：`Some crops require a trellis, which cannot be walked through, so they require an appropriate crop layout to be reachable. Trellis crops can be walked through once they are dead. The available trellis crops are Green Bean, Hops, and Grape.`
- **支持事实 (Supports)**：棚架作物（青豆 Green Bean、啤酒花 Hops、葡萄 Grape）在枯死前无法通行，需要合理的布局以便玩家能够触及采摘；枯死后可通行。
- **不支持/未证明 (Not-Supported)**：引文中未记载祝尼魔穿透棚架或铱镰刀隔空收割。
- **推导标注 (Derivation)**：撤回祝尼魔与铱镰刀穿透已证实的说法；重点在于提醒读者规划站立通道（如双行种植）。

---

### 【FACT-10】换季枯萎与跨季作物
- **来源归属**：Stardew Valley Wiki (社区维基)
- **来源 URL**：`https://stardewvalleywiki.com/Crops` (revid 193979)
- **实际获取**：ego-browser TaskSpace 115 (2026-10-13T07:50:15Z)
- **源原句**：`On the 1st of each season, all crops that are no longer in season will wither and die, leaving behind a dead crop. When a dead crop is left behind at the start of a season it will keep the soil it was planted on tilled, which can reduce the amount of manual tilling and watering that needs to be done at the start of a season. Dead crops can be removed with a scythe. Multi-season crops that are still in season (i.e., corn planted in summer when transitioning into fall) will not wither and will simply continue to grow.`
- **支持事实 (Supports)**：换季第 1 天不再当季的作物枯萎死亡；枯株可用镰刀清除；枯株能保持下方的土壤处于已耕状态；仍处于当季的跨季作物不会枯萎继续生长。
- **不支持/未证明 (Not-Supported)**：该引文未直接说明枯株保留肥料（此内容在肥料段落）；未说明成熟单次作物换季是否例外（原文明确为 all crops that are no longer in season will wither）。
- **推导标注 (Derivation)**：重点提醒读者在季末 28 日及时收割成熟作物，避免次日枯萎。

---

### 【FACT-11】中文社区维基条目标题与推荐译名边界
- **来源归属**：Stardew Valley Wiki 中文站 (社区维基 MediaWiki API)
- **来源 URL**：`https://zh.stardewvalleywiki.com/mediawiki/api.php`
- **实际获取**：MediaWiki API 批处理查询 (2026-10-13T07:54:47Z)，原始结果保存在 `raw-zh-terms.json`
- **接口有效条目与 Page ID 数据**：
  - Kale 对应条目：**甘蓝菜**（Page ID 791，exists: true；“羽衣甘蓝”为 missing）
  - Powdermelon 对应条目：**霜瓜**（Page ID 2666，exists: true；“霜花瓜”为 missing）
  - Rice Shoot 对应条目：**稻苗**（Page ID 1367，exists: true；“米苗”为 missing）
  - Ancient Fruit 对应条目：**上古水果**（Page ID 393，exists: true；“远古水果”为 missing）
  - Keg 对应条目：**小桶**（Page ID 982，exists: true；“酿造桶”为 missing）
  - Preserves Jar 对应条目：**罐头瓶**（Page ID 439，exists: true；“腌酱桶”为 missing）
  - Crystalarium 对应条目：**宝石复制机**（Page ID 1010，exists: true；“复制晶石机”为 missing）
  - Golden Scythe 对应条目：**金色的镰刀**（Page ID 1066，exists: true）
  - Quarry Mine 对应条目：**采石场矿井**（Page ID 1118，exists: true）
- **支持事实 (Supports)**：中文社区维基以“甘蓝菜”、“霜瓜”、“稻苗”、“上古水果”、“小桶”、“罐头瓶”、“宝石复制机”、“金色的镰刀”、“采石场矿井”作为标准条目标题与跨语言链接目标。采用这些译名能最大程度保证读者在维基中检索一致。
- **不支持/未证明 (Not-Supported)**：未解包核对游戏原版二进制本地化文件（XNB / JSON strings），不得断言“官方游戏字符串已核验”；不能断言游戏内绝对不存在未收录条目的其他翻译版本。
- **推导标注 (Derivation)**：正确定位为“社区中文维基条目正名/推荐译名”，供角色 T 修正翻译腔，不宣称解包官方游戏字符串。

---

## 三、原文具体修改要求清单（供角色 C 返工，无整段可粘贴文本）

### 1. 英文正文修改要求（`how-to-harvest-stardew-valley.en.tsx` / `en-body.md`）

#### 【修改项 E-01】
- **原句位置**：Section 1.1 (Lines 36-37)
- **原文内容**：`Left-Click puts seeds and fertilizer on a tilled tile... Picking the ripe parsnip stays on Right-Click or X.`
- **问题类型**：按键分工与操作边界说明不清晰
- **修改要求**：澄清左键主要用于使用工具与放置物品，右键/X 键用于触发 Check/Do Action 采收；避免给读者造成“左键被技术封锁”的误解，但需说明采收成熟作物依托右键或 X 键。

#### 【修改项 E-02】
- **原句位置**：Section 1.2 (Lines 48-52)
- **原文内容**：`For more than one plant, hold Right-Click or X and keep the mouse away from your character... Holding a button to collect from many kegs, preserves jars, or crystalariums is a 1.4 shortcut for those machines.`
- **问题类型**：论坛技巧与维基条目规则混淆
- **修改要求**：将长按走动采摘表述为实用的田间走动操作技巧，说明长按右键时保持光标远离角色的作用；删除对机器历史的过度展开，聚焦作物收获本身。

#### 【修改项 E-03】
- **原句位置**：Section 2.2 (Lines 73-77)
- **原文内容**：`...and 13 damage instead of 1 to 3.` 及 `...and the damage is 20 instead of 13.`
- **问题类型**：包含无关战斗武器伤害属性
- **修改要求**：删除镰刀的攻击力数值（1-3、13、20 点伤害），将重点完全集中在收割作物权限、收割范围与割草干草率上。

#### 【修改项 E-04】
- **原句位置**：Section 3.1 (Lines 82-92)
- **原文内容**：`How to Tell When Your Crops Are Ready to Harvest... Calculating Growth Days and the Watering Requirement...`
- **问题类型**：缺少成熟阶段精灵图视觉依据说明
- **修改要求**：说明判断成熟除了计算生长天数外，还可以直接观察植株是否达到最终生长阶段（Harvest 阶段）的外观精灵图（Sprite），或直接靠近尝试点击采摘。

#### 【修改项 E-05】
- **原句位置**：Section 5.1 (Lines 126-127)
- **原文内容**：`Cauliflower, Melon, Pumpkin, Powdermelon, and Qi Fruit in a 3×3 can become a giant crop. It can form when the top-left crop is fully grown and watered. Harvest with any axe. It takes three hits and drops 15 to 21 normal-quality items.`
- **问题类型**：巨大作物规则细节不全
- **修改要求**：明确 3×3 必须由 9 株同种作物组成；说明采收需要且仅需要用任意斧头砍击 3 下；生成概率等细节可由布局 B 决定精简与否。

---

### 2. 中文正文修改要求（`how-to-harvest-stardew-valley.zh.tsx`）

#### 【修改项 Z-01】
- **原句位置**：全篇涉及 Kale 处（Lines 7, 15, 25, 62, 65, 91）
- **原文内容**：`羽衣甘蓝`
- **问题类型**：偏离中文社区维基规范条目名
- **修改要求**：全部统一更正为中文社区维基标准推荐译名“**甘蓝菜**”。

#### 【修改项 Z-02】
- **原句位置**：Line 126
- **原文内容**：`霜花瓜`
- **问题类型**：民间直译偏离中文维基条目名
- **修改要求**：更正为中文社区维基标准推荐译名“**霜瓜**”。

#### 【修改项 Z-03】
- **原句位置**：Lines 68, 91
- **原文内容**：`米苗`
- **问题类型**：播种材料名词偏离维基条目
- **修改要求**：播种材料更正为中文维基推荐名称“**稻苗**”（收获物保持“未碾米”）。

#### 【修改项 Z-04】
- **原句位置**：Line 118
- **原文内容**：`远古水果`
- **问题类型**：民间俗称偏离维基条目
- **修改要求**：更正为中文维基规范译名“**上古水果**”。

#### 【修改项 Z-05】
- **原句位置**：Line 51
- **原文内容**：`酿造桶、腌酱桶或复制晶石机`
- **问题类型**：多个设备名称偏离维基标准译名
- **修改要求**：全部统一更正为中文维基标准设备名称“**小桶、罐头瓶或宝石复制机**”。

#### 【修改项 Z-06】
- **原句位置**：Lines 56, 71, 73, 76
- **原文内容**：`金镰刀` 及 `采石场矿洞中的雕像`
- **问题类型**：道具与地名简称
- **修改要求**：更正为维基标准条目名“**金色的镰刀**”及地名“**采石场矿井**”。

#### 【修改项 Z-07】
- **原句位置**：Line 126
- **原文内容**：`处于 3×3 范围内的花椰菜、甜瓜、南瓜、霜花瓜和齐瓜可以形成巨大作物。`
- **问题类型**：遗漏 9 株同种作物规则
- **修改要求**：补充指出 3×3 必须全部为同种作物方可合并。

---

## 四、明确排除项与尚缺项（Explicit Gaps & Exclusions）

1. **手柄作物专用采收键**：
   - 状态：**尚缺直接维基条目支持（Gap）**。
   - 说明：维基只有全局 Check/Do Action 映射，没有专属作物采摘键说明。正文严禁捏造专用键，仅作为全局交互键呈现。
2. **全游戏镰刀作物封闭名单**：
   - 状态：**非穷尽（Incomplete list）**。
   - 说明：仅对 5 种常见作物（苋菜、甘蓝菜、小麦、未碾米、纤维种子）完成单页核验，未声明这是全游戏排他封闭名单。
3. **农场策略与战斗数值**：
   - 状态：**明确排除（Excluded）**。
   - 说明：战斗伤害数值、草料具体概率、祝尼魔自动化机制属于超出本收获指南范围的内容，严禁塞入正文。
