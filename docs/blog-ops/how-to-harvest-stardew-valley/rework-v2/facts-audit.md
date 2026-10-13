# 《星露谷物语收获指南》Rework-V2 事实核查与修改要求报告

- **审计角色**：事实核查审计员（Facts Auditor）
- **核查日期**：2026-10-13
- **核查环境**：唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **浏览器环境**：本地 ego-browser（TaskSpace 115），直接通过 MediaWiki API 与官方 Wiki 页面回读
- **证据存储**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit/`
  - `taskspace-metadata.json`：页面 Revision ID、接口时间戳与 TaskSpace 元数据
  - `raw-wiki-crops.json`：作物收获、巨大作物、棚架、浇水与换季维基原始摘录
  - `raw-wiki-controls.json`：PC、手柄与移动端控制原始摘录
  - `raw-zh-terms.json`：中文维基词条 API 查询与 Page ID 存在性验证
- **核验对象**：
  - `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`
  - `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`
  - `docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md`
  - 历史输入：`research.md`、`facts.json`、`controls-supplement-v2.md`

---

## 一、核心操作事实独立核验结果

### 1. 成熟作物采摘条件与键位映射（Left-Click / Right-Click / X）
- **官方依据**：
  - `Controls` (revid 192481)：`Right-Click, X: Check/Do Action`；`Left-Click, C: Use tool or place item`。
  - `Modding:Crop data` (revid 186411)：普通作物收获方式为 `Grab`（徒手，对应代码 `0`，调用 `TerrainFeatures.HoeDirt::performUseAction`）。
  - `Crops` (revid 193979)：左键用于播种施肥（`Seeds and fertilizer are placed... using the left-click control`）。
- **核验结论**：
  - **右键 / X 键（正向唯一安全机制）**：徒手采摘成熟作物（如防风草）属于 `Check/Do Action`，右键或键盘 X 键点击即可采摘，不消耗体力，不需要任何工具。
  - **关键隐患（手持可食用物品）**：若玩家快捷栏当前选中了食物或可食用产物，点击右键会优先触发“是否食用”的确认弹窗，从而中断连续采摘。安全操作要求玩家在徒手采收时手持工具、非食用物品、种子，或保持空手。
  - **左键 / C 键的真实边界**：左键属于 `Use tool or place item`。当玩家手持镐子、斧头时，左键点击作物会挥动工具破坏或砍伐作物；手持水壶、锄头时会耕地或浇水消耗体力；手持初始镰刀或金镰刀挥动时，对普通徒手作物无伤害但也无法采摘；手持铱镰刀时可收割；空手时长按拖动可能触发部分判定，但左键绝对不是徒手采收的官方规范动作，绝不能向玩家推荐使用左键采收普通作物。

### 2. PC 连续采摘机制（Hold-and-Walk Method）
- **官方与社区依据**：
  - 官方论坛（Elenna101，2021-09-27）：`If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on, and then you just have to walk around over your crops to plant and harvest your field.`
  - Reddit（NovanHero，r/StardewValley）：长按键盘 X 键走动同样实现连续采收与补种。
- **核验结论**：
  - **走动采摘机制**：在田间按住鼠标右键（或按住键盘 X 键）不放并在作物上方走动，角色会自动连续采摘经过的成熟作物。
  - **鼠标光标距离**：使用鼠标右键长按时，光标需远离角色身体，以防止游戏优先判定光标所在格子而不是角色脚下或面前的作物地块；使用键盘 X 键长按则不受光标位置干扰。
  - **边收边补种**：若手中持有种子，长按右键/X 走动可在采摘成熟作物的同一瞬间将新种子自动播入腾出的已耕地块中。
  - **操作注意**：手中不可持有可食用物品，否则长按右键会弹出食用确认框卡住移动。

### 3. 镰刀作物与工具升级对比（Scythe Crops）
- **官方依据**：
  - `Scythe` (revid 171696)：初始镰刀，挥动不消耗能量，割草 50% 掉干草。
  - 作物页面：甘蓝菜（Kale，revid 192520，春季6天）、苋菜（Amaranth，revid 192043，秋季7天）、小麦（Wheat，revid 192731，夏秋4天，40%掉干草）、未碾米（Unmilled Rice，revid 194130，春季8天/灌溉6天）、纤维种子（Fiber Seeds，revid 193587，全季7天，掉4-7纤维，10%混合种子）。
  - `Golden Scythe` (revid 191051)：采石场矿井雕像获取，范围更大，割草 75% 掉干草；**仅能收割镰刀作物，不能收割普通徒手作物**。
  - `Iridium Scythe` (revid 186836)：1.6 耕种精通获取，**可收割范围内任何作物（包括徒手作物、花盆作物、野生种子长成的采集品）**，割草 100% 掉干草。
- **核验结论**：
  - 1.6 版本中需要镰刀收割的作物仅有上述 5 种（苋菜、甘蓝菜、小麦、未碾米、纤维种子）。1.6 新增的胡萝卜、西蓝花、金皮西葫芦、霜瓜等均非镰刀作物。
  - 普通镰刀与金镰刀挥过成熟防风草时，既不会收获作物，也不会损坏作物。
  - 武器（如剑、匕首、锤）挥击无法收割镰刀作物。
  - **排除项**：严格遵循指南，删除关于镰刀作为武器的攻击力数值（1-3、13、20 点伤害），避免在农耕收获教程中罗列无关战斗数据。

### 4. 主机手柄与移动端操作边界（Mobile & Console Controls）
- **官方依据**：
  - `Controls` (revid 192481)：Xbox 控制器（A 为 Check/Do Action，X 为 Use Tool）；PlayStation（Cross 为 Check/Do Action，Square 为 Use Tool）；Switch（A 为 Check/Do Action，Y 为 Use Tool）。
  - `Mobile Controls` (revid 189843)：移动端默认控制方案为 `Tap-to-move & Auto-Attack`。“点击物品进行操作（Tap on items to action them）”；明确指出镰刀是唯一需要手动选中的工具（`The one exception with tools is the scythe, which must be selected to use`）。
- **核验结论**：
  - 维基与游戏官方文档**并未设立独立的手柄“作物采摘键”**，手柄采摘是继承自大地图全局动作绑定（Check/Do Action：Xbox 的 A、PS 的 Cross、Switch 的 A）。文章应说明这是该平台的交互按键，不可捏造专门的采收功能键。
  - 移动端默认点击作物即可触发采收；采收镰刀作物时必须在快捷栏先手动选中镰刀，再点击作物区域。

### 5. 成熟识别与浇水机制（Maturation & Post-Maturity Watering）
- **官方依据**：
  - `Crops` (revid 193979)：作物每天必须浇水以推进生长；缺水不死亡但生长顺延一天。
  - 游戏代码 `Crop::newDay`：成熟单次作物不浇水不会枯死，会一直保留在当季地里。
- **核验结论**：
  - **视觉识别**：原版游戏无任何“绿色加号”或其他 UI 提示光标。成熟与否完全依据作物的外观精灵图（Sprite）：作物从幼苗经历多个生长阶段，在成熟当天显示饱满的果实/蔬菜画面（如防风草露出橙色根部、草莓变红）。如果玩家不确定，直接靠近右键点击即可：成熟则收起，未熟则毫无反应。
  - **成熟后的浇水规则（关键事实漏洞）**：
    1. **单次收获作物（防风草、花椰菜等）**：成熟后即使不再浇水，在当季内也绝对不会枯萎，可以安全留在地里直至需要采摘或换季。
    2. **巨大作物候选区**：若 3×3 作物已成熟但玩家想等待其合成巨大作物，**必须每天对左上角地块浇水**，否则无法触发每日 1% 的合成判定。
    3. **多次再生作物（青豆、草莓等）**：采摘后**必须继续每天浇水**才能推进下一次产出进度；缺水一天，下一次收获日期顺延一天。

### 6. 巨大作物生成与采伐规则（Giant Crops Mechanics）
- **官方依据**：
  - `Crops#Giant_Crops` (revid 193979)：
    `Cauliflowers, Melons, Pumpkins, Powdermelons and Qi Fruits planted in a 3x3 pattern can randomly combine into a giant crop. Giant crops drop 15–21 normal-quality items when harvested with any axe, taking three hits.`
    `At the start of each day, every possible 3x3 grid of crops (including overlaps) has a 1% chance to grow into a giant crop as long as the top left crop is fully-grown and watered, and all constituent crops are of the same type.`
- **核验结论**：
  - **适用作物**：共 5 种——花椰菜（春）、甜瓜（夏）、南瓜（秋）、霜瓜（冬，1.6 新增）、齐瓜（特别任务）。
  - **生成条件（当前文章存在严重漏项）**：
    1. 必须是完全相同的同一种作物（“all constituent crops are of the same type”），混种无法形成。
    2. 每日早晨有 **1% 的概率**随机合成（原正文漏掉了 1% 这一决定性概率说明）。
    3. 在 1.6 版本中，判定条件为该 3×3 范围的**左上角作物完全成熟且浇过水**（旧版本为中心作物）。
  - **采伐工具与下数**：必须使用斧头（任意级别的斧头均可：普通斧头、铜斧、铁斧、金斧、铱斧），且**无论什么级别的斧头都必须砍 3 下**（工具升级不减少击打次数）。
  - **产出**：掉落 15 至 21 个普通品质作物。
  - **存活与限制**：巨大作物换季不枯萎（可跨季保留作为装饰）；无法在温室、室内花盆或姜岛生长；祝尼魔小屋无法采伐巨大作物。

### 7. 棚架作物可达性与规划（Trellis Crops Reachability）
- **官方依据**：
  - `Crops#Trellis_Crops` (revid 193979)：青豆（Green Bean）、啤酒花（Hops）、葡萄（Grape）需要棚架，在枯死前无法通行（`cannot be walked through, so they require an appropriate crop layout to be reachable`）。
- **核验结论**：
  - 棚架作物在种植当天起至枯死前均具有实体碰撞体积，玩家无法穿过。
  - **规划要求**：若采用实心 3×3 种植，中心作物将因无法靠近而永远无法手动采摘。推荐采用双行排列（两行棚架留一行过道）或 U 型布局。
  - **特殊例外与后期突破**：
    1. 祝尼魔（Junimos）可以无视碰撞穿过棚架收割作物。
    2. 1.6 引入的铱镰刀具有大范围挥击判定，可隔空收割无法站立靠近的棚架作物。

### 8. 换季枯萎与保地机制（Season Rollover）
- **官方依据**：
  - `Crops` (revid 193979)：第 28 天结束后，不在新季节生长范围内的室外作物在次月 1 日全部枯萎为枯株。
- **核验结论**：
  - 即使作物已完全成熟，只要换季且不适宜新季节，一律枯死。枯株可用镰刀一击清除（0 能量）。
  - **农耕策略**：枯株能锁定耕地不退化为杂草地，且能完整保留下方的肥料。夏末种植小麦跨入秋季是保留耕地与肥料的经典技巧。
  - 跨季作物包括：上古水果（春夏秋）、咖啡豆（春夏）、玉米（夏秋）、向日葵（夏秋）、小麦（夏秋）。
  - 1.6 霜瓜与纤维种子可在冬季室外生长；温室与姜岛无换季枯萎。

---

## 二、游戏官方中文术语核验清单（MediaWiki API 证实）

通过对 `https://zh.stardewvalleywiki.com/mediawiki/api.php` 的真实查询与 Page ID 验证，确认以下中文术语在当前 `how-to-harvest-stardew-valley.zh.tsx` 中存在重大误译或使用了民间描述性译名：

| 英文原名 | 当前中文正文错误译名 | 游戏官方简体中文名称 | 中文维基 Page ID | 验证状态 | 误导性与纠正要求 |
|---|---|---|---|---|---|
| **Kale** | 羽衣甘蓝 | **甘蓝菜** | 791 | 存在 (exists: true) | 严重误导：游戏内种子叫“甘蓝种子”，作物叫“甘蓝菜”。“羽衣甘蓝”为 Page ID -1，不存在于官中。 |
| **Powdermelon** | 霜花瓜 | **霜瓜** | 2666 | 存在 (exists: true) | 严重误导：1.6 冬季新增作物官译为“霜瓜”。“霜花瓜”为民间直译，Page ID -2 不存在。 |
| **Rice Shoot** | 米苗 | **稻苗** | 1367 | 存在 (exists: true) | 游戏内商店出售与种植的种子官译为“稻苗”，收获物为“未碾米”。“米苗”不存在。 |
| **Ancient Fruit** | 远古水果 | **上古水果** | 393 | 存在 (exists: true) | 游戏内种子为“上古种子”，作物为“上古水果”。“远古水果”为 Page ID -4 不存在。 |
| **Keg** | 酿造桶 | **小桶** | 982 | 存在 (exists: true) | 制造菜单与游戏内道具官译为“小桶”。“酿造桶”为非官方俗称。 |
| **Preserves Jar** | 腌酱桶 | **罐头瓶** | 439 | 存在 (exists: true) | 制造菜单官译为“罐头瓶”。“腌酱桶”为非官方俗称。 |
| **Crystalarium** | 复制晶石机 | **宝石复制机** | 1010 | 存在 (exists: true) | 机器官译为“宝石复制机”。“复制晶石机”为非官方直译。 |
| **Golden Scythe** | 金镰刀 | **金色的镰刀** | 1066 | 存在 (exists: true) | 游戏内道具全称官译为“金色的镰刀”。 |
| **Quarry Mine** | 采石场矿洞 | **采石场矿井** | 1118 | 存在 (exists: true) | 游戏内地名官译为“采石场矿井”。 |
| **Qi Fruit** | 齐瓜 | **齐瓜** | 1445 | 存在 (exists: true) | 官译匹配（注意排除“齐果”）。 |
| **Trellis** | 棚架 | **棚架** | - | 匹配官方描述 | 官方物品描述原文即为“棚架(自带)”。 |

---

## 三、原文错误原句位置、问题类型与修改要求（供写作角色 C 返工）

> **说明**：本节严格遵循审计规范，仅提供“原句位置 + 问题类型 + 修改要求”，绝不提供可直接粘贴的整段替换文案，供角色 C 独立编写符合语气的正文。

### 1. 英文稿件修改要求（`how-to-harvest-stardew-valley.en.tsx` / `en-body.md`）

#### 【问题 1】
- **原句位置**：Section 1.1 / Lines 36-37
- **原文内容**：`Left-Click puts seeds and fertilizer on a tilled tile. One click covers one tile. Hold Right-Click or Left-Click and move when you want several tiles. Planting and fertilizing need no tool and spend no energy. Picking the ripe parsnip stays on Right-Click or X.`
- **问题类型**：操作风险遗漏与按键排他性说明不足
- **修改要求**：补充阐明为什么不能随意使用左键采摘普通作物（若手持斧头/镐子等工具，左键会挥动工具破坏农作物或浪费体力）；同时指出右键/X 是专门用于触发 Check/Do Action 的无能耗安全采收键。

#### 【问题 2】
- **原句位置**：Section 1.2 / Lines 48-52
- **原文内容**：`For more than one plant, hold Right-Click or X and keep the mouse away from your character... If seeds are in your hand, the same hold plants that tile while it harvests... Holding a button to collect from many kegs, preserves jars, or crystalariums is a 1.4 shortcut for those machines.`
- **问题类型**：关键操作陷阱缺失
- **修改要求**：补充提示长按右键采收时的关键陷阱：玩家快捷栏中**切勿选中可食用食物**，否则右键长按会反复弹出“是否食用”的确认对话框打断采收；建议手持工具、种子或空手。

#### 【问题 3】
- **原句位置**：Section 2.2 / Lines 73-77
- **原文内容**：`...and 13 damage instead of 1 to 3.` 及 `Hay from grass is 100 percent per swipe, and the damage is 20 instead of 13.`
- **问题类型**：包含无关战斗属性数字（违背收获教程聚焦原则）
- **修改要求**：删除镰刀的攻击力数值（1-3、13、20 点伤害），将重点完全集中在农作物收割范围、收割普通作物的权限（仅铱镰刀）以及割草转化干草率上。

#### 【问题 4】
- **原句位置**：Section 3.1 / Lines 82-92
- **原文内容**：`How to Tell When Your Crops Are Ready to Harvest... Calculating Growth Days and the Watering Requirement...`
- **问题类型**：缺少游戏内真实视觉识别方法与成熟后浇水规则
- **修改要求**：
  1. 明确指出游戏内没有特殊的光标提示（如绿色加号），玩家依靠的是作物最终生长阶段呈现出的成熟外观精灵图（Sprite），若不确定可右键点击测试；
  2. 明确说明**单次收获作物一旦完全长成，即便停止浇水也不会枯死**，在当季内可永久保留；
  3. 说明成熟后仍需浇水的唯二例外：想要 3×3 巨大作物继续判定的必须每天浇水，以及多次再生作物采摘后必须浇水以推进下一轮再生。

#### 【问题 5】
- **原句位置**：Section 5.1 / Lines 126-127
- **原文内容**：`Cauliflower, Melon, Pumpkin, Powdermelon, and Qi Fruit in a 3×3 can become a giant crop. It can form when the top-left crop is fully grown and watered. Harvest with any axe. It takes three hits and drops 15 to 21 normal-quality items.`
- **问题类型**：关键生成规则遗漏
- **修改要求**：
  1. 补充指出 3×3 范围内的 9 株作物必须**全部为同一种作物**；
  2. 补充指出满足条件后，每日清晨有 **1% 的概率**发生合并；
  3. 明确斧头砍 3 下的机制：任何级别的斧头均需要且仅需要 3 下。

#### 【问题 6】
- **原句位置**：Section 5.2 / Lines 130-131
- **原文内容**：`Green bean, hops, and grape need a trellis. You cannot walk through that tile until the crop is dead, so leave a tile beside each plant where you can stand to pick it.`
- **问题类型**：后期机制与布局细节未提及
- **修改要求**：简要说明推荐的双行通道布局以避免中心作物无法触及；并顺带提及祝尼魔可穿过棚架收割，以及 1.6 铱镰刀具备远程收割穿透能力。

---

### 2. 中文稿件修改要求（`how-to-harvest-stardew-valley.zh.tsx` / `translation/`）

#### 【问题 1】
- **原句位置**：全篇涉及 Kale 处（Lines 7, 15, 25, 62, 65, 91）
- **原文内容**：`羽衣甘蓝`
- **问题类型**：非官方译名错误
- **修改要求**：全部统一更正为游戏官方简体中文译名“**甘蓝菜**”（种子对应“甘蓝种子”）。

#### 【问题 2】
- **原句位置**：Line 126
- **原文内容**：`霜花瓜`
- **问题类型**：非官方直译错误
- **修改要求**：更正为游戏官方简体中文译名“**霜瓜**”（种子对应“霜瓜种子”）。

#### 【问题 3】
- **原句位置**：Lines 68, 91
- **原文内容**：`米苗`
- **问题类型**：非官方译名错误
- **修改要求**：播种材料更正为游戏官方简体中文名称“**稻苗**”（收获物保持“未碾米”）。

#### 【问题 4】
- **原句位置**：Line 118
- **原文内容**：`远古水果`
- **问题类型**：非官方俗称错误
- **修改要求**：更正为游戏官方简体中文译名“**上古水果**”（种子对应“上古种子”）。

#### 【问题 5】
- **原句位置**：Line 51
- **原文内容**：`酿造桶、腌酱桶或复制晶石机`
- **问题类型**：多个设备名称偏离官方菜单
- **修改要求**：全部统一更正为官方设备名称“**小桶、罐头瓶或宝石复制机**”。

#### 【问题 6】
- **原句位置**：Lines 56, 71, 73, 76
- **原文内容**：`金镰刀` 及 `采石场矿洞中的雕像`
- **问题类型**：道具与场景简称
- **修改要求**：更正为官方完整名称“**金色的镰刀**”及地名“**采石场矿井**”。

#### 【问题 7】
- **原句位置**：Line 126
- **原文内容**：`当左上角的作物完全成熟且浇过水时，就有可能形成。`
- **问题类型**：遗漏 1% 概率与 9 格同种作物规则
- **修改要求**：同步补齐英文修改要求中的 1% 每日判定概率说明，以及 3×3 必须由 9 株同种作物组成的必要条件。

---

## 四、验证证据留档与回执说明

1. **接口真实回读证据**：
   - 维基 API 真实批处理查询存储在 `raw-zh-terms.json`，包含了 38 个游戏术语的 Page ID 与存在性，确凿证实“羽衣甘蓝”与“霜花瓜”在官中维基无对应页面，官方正名为“甘蓝菜”与“霜瓜”。
   - 官方维基英文条目 revision 记录存储在 `raw-wiki-crops.json` 与 `raw-wiki-controls.json`，确凿证实巨大作物 1.6 左上角浇水判定、1% 几率、同种限制、斧头 3 下、棚架碰撞、镰刀作物列表。
2. **免责与边界声明**：
   - 本次核验仅新增 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit.md` 与证据目录 `facts-audit/*`，未修改任何 TSX 源码、未触碰正文文件、未修改 SEO 配置或图片资源。
   - 所有提供给角色 C 的修改要求均采用“原句位置 + 问题类型 + 修改要求”格式，严禁提供整段替换文案，保障下一工序的独立执行质量。
