# 角色 A2 补核报告：普通成熟作物采收控制动作与 PC 映射

- **核查日期**：2026-10-12
- **任务目标**：针对关键词 `how to harvest stardew valley`，核对普通成熟作物（以防风草 Parsnip 为代表）触发收获的 action/check 动作及默认 PC 鼠标/按键映射。
- **写入边界**：仅限 `docs/blog-ops/how-to-harvest-stardew-valley/research/controls-supplement.md` 及同名 `.json`。未触碰 A 主研究的 `research.md`、`facts.json` 与 `serp-evidence.json`。
- **隔离与环境**：唯一博客工作树（分支 `博客-2`），目录逻辑隔离；浏览器使用独立 TaskSpace（spaceId 55），未触碰 A 的 TaskSpace47。

---

## 核心核验结论

1. **采收动作分类（Action Type）**：
   - 普通成熟作物（非镰刀收割作物）属于徒手采收（Hand-harvest），在游戏内部代码对应 `HarvestMethod: "Grab"`（方法 `0`），触发机制为 **`Check / Do Action`**（在农田地块上调用 `TerrainFeatures.HoeDirt::performUseAction`）。
   - 它**不属于**使用工具（`Use tool`，对应方法 `1` / `performToolAction`）。

2. **默认 PC 键鼠映射（Default PC Keybinds）**：
   - **鼠标**：**右键（Right-Click）**。站在成熟作物旁或鼠标光标指向作物点击右键触发收获。
   - **键盘**：**X 键**。游戏默认将键盘 `X` 映射为 `Check / Do Action`（次要按键绑定），作用与鼠标右键相同。

3. **连续采收操作（Hold-and-Walk Harvesting）**：
   - 玩家无需对每株作物单独反复点击。**按住鼠标右键（或按住键盘 X 键）不放并在田间走动**，角色会在经过成熟作物时自动连续采收。若手中握有种子，还会实现边采收边补种（Simultaneous harvesting and replanting）。

4. **严禁混淆：左键（Left-Click / C）为种植与工具使用，绝非普通采收**：
   - 官方 Wiki `Crops` 页明确记载左键用于播种种子与施加肥料（`Seeds and fertilizer are placed... by using the left-click control`）。
   - 在控制定义中，左键与键盘 `C` 为 `Use tool or place item`。若手持锄头、镐子或水壶等工具时对作物使用左键，将直接挥舞工具消耗体力，甚至可能破坏耕地，无法采收普通作物。

5. **Wiki 主干玩法页面的“文本缺口”客观事实**：
   - 经逐页核验，Wiki 的主要游戏玩法指引页（`Getting Started`、`Controls`、`Crops`、`Farming`、`Options`）存在客观的**表述缺口**：仅定义了抽象的 `Check/Do Action` 与 `Use tool`，以及播种、开酒桶、巨型作物砍伐等操作，均未直接写出“采收普通成熟作物请按右键/X”。
   - 采收动作的技术实质通过 Wiki 模组开发页（`Modding:Crop_data`）与底层代码引用（`Golden_Walnut` 引用 2）确认为 `Grab` / `HoeDirt::performUseAction`；玩家层面的按键映射则在官方论坛、Steam 社区讨论、Reddit 攻略及 YouTube 实操演示中高度一致且完全证实。

---

## 逐项来源与精确摘录证据

### 1. 官方 Wiki 页面文本缺口与技术机制证据

- **Wiki Getting Started（新手入门）**
  - **URL**: `https://stardewvalleywiki.com/Getting_Started` (oldid: 195315)
  - **精确摘录**: `Continue watering your crops every day until they grow in to harvestable crops. Your parsnips will be ready to harvest in 4 days.`
  - **Controls 表格摘录**: `Left-Click, C: Use tool or place item` | `Right-Click, X: Check/Do Action`
  - **核验结论**: 页面仅说明防风草 4 天成熟，列出通用键位表，未写明成熟后按哪个键收取。

- **Wiki Controls（控制）**
  - **URL**: `https://stardewvalleywiki.com/Controls` (oldid: 192481)
  - **精确摘录**: `Right-Click, X: Check/Do Action`
  - **历史版本 1.4 摘录**: `Removed "new" input from button press until the button is released. This makes harvesting large numbers of kegs/preserves jars/crystalariums, etc. easier by holding the button without releasing it.`
  - **核验结论**: 页面定义了右键/X 为 Check/Do Action，并提到按住按键收获酒桶/腌菜桶，但未直接写出普通作物收获键。

- **Wiki Options（选项菜单）**
  - **URL**: `https://stardewvalleywiki.com/Options` (oldid: 191778)
  - **精确摘录**: `Check/Do Action — Set the keybind for checking or doing some action such as: interacting with NPCs, Calendar, Help Wanted, doors, ladders and elevators; picking up an item from the bag slot; picking up forage and loot. Default Right-Click, X`
  - **核验结论**: Check/Do Action 的官方功能举例包括 NPC 互动、日历、门、梯子、捡起觅食物品等，但没有直接点名“收获作物”。

- **Wiki Crops（农作物）**
  - **URL**: `https://stardewvalleywiki.com/Crops` (oldid: 193979)
  - **精确摘录**: `Seeds and fertilizer are placed on a tilled tile individually by using the left-click control, or on multiple tiles by continuously holding on to the right-click or left-click control and moving the cursor and/or player.`
  - **核验结论**: 页面明确记载左键与按住右键/左键用于**播种与施肥**，巨型作物用斧头砍伐，对普通成熟作物的手工采收按键未作文本说明。绝对不可将此处的种植左键当作采收键。

- **Wiki Farming（耕种）**
  - **URL**: `https://stardewvalleywiki.com/Farming` (oldid: 191914)
  - **核验结论**: 页面详述耕种经验公式 `XP=||16 × ln(0.018 × PRICE + 1)||` 与品质概率，无按键控制说明。

- **Wiki FAQ（常见问题）**
  - **URL**: `https://stardewvalleywiki.com/FAQ`
  - **核验结论**: 页面为空（`There is currently no text in this page.`）。

- **Wiki Modding:Crop data（作物数据）**
  - **URL**: `https://stardewvalleywiki.com/Modding:Crop_data` (oldid: 194164)
  - **精确摘录**: `HarvestMethod: (Optional) How the crop can be harvested. This can be Grab (crop is harvested by hand) or Scythe (harvested with a scythe). Default Grab.`
  - **核验结论**: 游戏机制将作物分为默认的 `Grab`（徒手采收）与 `Scythe`（镰刀收割）。普通作物默认为徒手采收。

- **Wiki Golden Walnut（金色核桃代码引用）**
  - **URL**: `https://stardewvalleywiki.com/Golden_Walnut` (oldid: 191051)
  - **精确摘录**: `See TerrainFeatures.HoeDirt::performUseAction in the game code. The Scythe is assigned harvesting method "1" and harvesting by hand is harvesting method "0".`
  - **核验结论**: 徒手采收普通作物在游戏底层直接由 `TerrainFeatures.HoeDirt::performUseAction` 处理，该方法由玩家执行 `Check / Do Action` 时调用。

---

### 2. 官方论坛、社区实测与第一方演示证据

- **官方论坛（Stardew Valley Forums）**
  - **URL**: `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/`
  - **讨论主题**: PC controls vs mobile
  - **精确摘录**: `Or the direction button and right click. (X is automatically mapped to right click) If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on, and then you just have to walk around over your crops to plant and harvest your field.`
  - **核验结论**: 官方社区玩家验证，PC 采收采用右键或键盘 X，长按右键移动即可自动连续采收经过的成熟作物。

- **Steam 社区官方讨论（Steam Community General Discussions）**
  - **URL**: `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/`
  - **讨论主题**: Harvest Parsnip with Scythe??
  - **精确摘录**: `The problem is... You don't NEED the scythe for parsnips. You need the scythe for amaranth or wheat. For ANY other crop, you need to be standing next to it and rightclick it.`
  - **核验结论**: 针对新手关于防风草采收的疑问，老玩家明确指出防风草无需镰刀，只需站在旁边右键点击（rightclick）即可采收。

- **Reddit 社区验证（r/StardewValley）**
  - **URL**: `https://www.reddit.com/r/StardewValley/comments/4bl3ih/psa_press_and_hold_the_x_key_on_your_keyboard_to/`
  - **精确摘录**: `Simply hold down the 'x' key (or whatever key is bounded to right click), walk, and your character will harvest and replant instantly as you walk by.`
  - **核验结论**: 证实键盘 X 键（绑定到右键）具有与右键完全相同的长按采收功能。

- **第一方实操演示视频（YouTube Shorts）**
  - **URL**: `https://www.youtube.com/shorts/ncg9SKnp7jg`
  - **创作者**: Captain Canadia
  - **标题与演示**: `The Better Way to Harvest Crops in Stardew Valley`
  - **演示内容**: 实际视频演示长按右键并在作物田间走动，实现快速大面积采收成熟作物与边收边种。

---

## 对 A 主研究的数据交付说明

本补核材料已格式化存储于同名 `controls-supplement.json`，供 A 主研究直接消费合并：
- **可确证事实**：普通成熟作物采收属于 `Check / Do Action` 动作，PC 默认映射为鼠标右键（Right-Click）或键盘 X；支持长按右键/X 移动连续采收。
- **已澄清误区**：左键（Left-Click / C）为 `Use tool or place item`，仅用于播种、施肥和挥舞工具，绝不可当成普通采收按键。
- **已闭合缺口**：解释了为何 Wiki 基础指南未直写按键（系将该动作归入通用 Check/Do Action 框架），并通过底层 `Grab` / `performUseAction` 及多方实测证据链彻底补齐该事实。
