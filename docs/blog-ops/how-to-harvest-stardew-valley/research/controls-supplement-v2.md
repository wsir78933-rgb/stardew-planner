# 角色 A2 补核报告（v2 修订版）：普通成熟作物采收控制动作与 PC 映射

- **核查日期**：2026-10-12
- **任务目标**：针对关键词 `how to harvest stardew valley`，核对普通成熟作物（以防风草 Parsnip 为代表）触发收获的 action/check 动作及默认 PC 鼠标/按键映射。
- **写入边界**：仅限 `docs/blog-ops/how-to-harvest-stardew-valley/research/controls-supplement-v2.md` 及同名 `.json`。保留 v1 文件原貌不覆盖，未触碰 A 主研究的 `research.md`、`facts.json` 与 `serp-evidence.json`。
- **隔离与环境**：唯一博客工作树（分支 `博客-2`），目录逻辑隔离（无操作系统级权限隔离实验）；浏览器采用独立 TaskSpace，未触碰 A 的 TaskSpace47；不冒充亲自运行游戏。

---

## 一、核心正向采收方法（Core Positive Method）

1. **动作归属（Action Category）**：
   - 普通成熟作物的采收属于游戏中的 **`Check / Do Action`** 动作，在数据底层属于徒手收获（`HarvestMethod: "Grab"`，对应代码方法 `0`，调用 `TerrainFeatures.HoeDirt::performUseAction`）。
   - 这与需要装备工具的收割动作（`Use tool`，对应方法 `1` / `performToolAction`）在机制上区分。

2. **默认 PC 键鼠映射（Default PC Mappings）**：
   - **鼠标操作**：**右键（Right-Click）**。站在成熟作物旁或鼠标光标指向成熟作物点击右键触发收获。
   - **键盘操作**：**X 键**。游戏默认将键盘 `X` 映射为 `Check / Do Action` 的次要键，功能与鼠标右键一致。

3. **连续走动采收技巧（Continuous Hold-and-Walk Harvesting）**：
   - 玩家可**按住鼠标右键（或按住键盘 X 键）不放并在田间走动**，角色会在经过成熟作物时自动连续收取。

4. **关于左键（Left-Click / C）的客观事实边界**：
   - Stardew Valley Wiki 的 `Crops` 页面明确记载左键用于播种种子与施放肥料（`Seeds and fertilizer are placed... by using the left-click control`），`Controls` 页面将其定义为 `Use tool or place item`。
   - 本报告仅澄清播种左键与采收右键的功能分工；不作“左键绝不能用于任何采收”“会破坏耕地”等缺乏直接文本实证的绝对排他性副断言。

---

## 二、Wiki Revision 真实回读与修正记录

通过 MediaWiki API（`https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=revisions`）于 2026-10-12 真实回读，所有 revision ID 均经接口校验：

| 页面标题 | 所属站点 | Page ID | 真实 Revision ID | 接口时间戳 | 状态与修正说明 |
|---|---|---|---|---|---|
| **Getting Started** | Stardew Valley Wiki | 1387 | **195315** | 2026-10-09T17:06:55Z | 回读一致 |
| **Controls** | Stardew Valley Wiki | 1391 | **192481** | 2026-04-17T19:33:58Z | 回读一致 |
| **Options** | Stardew Valley Wiki | 2169 | **191778** | 2026-03-16T18:11:24Z | 回读一致 |
| **Crops** | Stardew Valley Wiki | 345 | **193979** | 2026-08-13T15:27:11Z | 回读一致 |
| **Golden Walnut** | Stardew Valley Wiki | 11536 | **195364** | 2026-10-11T23:38:23Z | **修正 v1 错误**：v1 误记为 191051（该 ID 实为 Golden Scythe）；真实为 195364 |
| **Modding:Crop data** | Stardew Valley Wiki | 7477 | **186411** | 2025-05-13T20:25:00Z | **修正 v1 错误**：v1 误记为 194164（该 ID 实为 Greenhouse）；真实为 186411 |
| **FAQ** | Stardew Valley Wiki | 0 | **0** | - | 真实回读确认页面无正文（未创建空条目），记录为无内容 |

*注：站点名称统一使用社区百科全名“Stardew Valley Wiki”，不将其正文视为开发方官方游戏规则。代码函数名作为技术架构事实呈现，不直接等同于 UI 行为证明。*

---

## 三、来源回读与社区一手观察强度分析

### 1. Stardew Valley Wiki 基础玩法页面（文本缺口确证）

- **Getting Started (revid 195315)**:
  - 摘录：`Continue watering your crops every day until they grow in to harvestable crops. Your parsnips will be ready to harvest in 4 days.`
  - 控制表：`Left-Click, C: Use tool or place item` | `Right-Click, X: Check/Do Action`
  - 结论：写明防风草生长周期及控制键位名，未直接写明成熟后触发收获的按键。
- **Controls (revid 192481)**:
  - 摘录：`Right-Click, X: Check/Do Action`
  - 版本历史 1.4：`Removed "new" input from button press until the button is released. This makes harvesting large numbers of kegs/preserves jars/crystalariums, etc. easier by holding the button without releasing it.`
  - 结论：将右键/X 归类为 Check/Do Action；1.4 版本笔记提到按住按键收获酿酒桶/腌菜桶，但作物未直写。
- **Options (revid 191778)**:
  - 摘录：`Check/Do Action — Set the keybind for checking or doing some action such as: interacting with NPCs, Calendar, Help Wanted, doors, ladders and elevators; picking up an item from the bag slot; picking up forage and loot. Default Right-Click, X`
  - 结论：列举了 Check/Do Action 的常见交互（NPC、日历、门、梯子、捡起地表觅食物），未列入农田作物。
- **Crops (revid 193979)**:
  - 摘录：`Seeds and fertilizer are placed on a tilled tile individually by using the left-click control, or on multiple tiles by continuously holding on to the right-click or left-click control and moving the cursor and/or player.`
  - 结论：明确左键用于播种施肥，未给出成熟作物的采收按键。

### 2. Stardew Valley Wiki 机制与代码引用（底层架构事实）

- **Modding:Crop data (revid 186411)**:
  - 摘录：`HarvestMethod: (Optional) How the crop can be harvested. This can be Grab (crop is harvested by hand) or Scythe (harvested with a scythe). Default Grab.`
  - 结论：证明普通作物底层收获机制为 `Grab`（徒手）。
- **Golden Walnut (revid 195364)**:
  - 引用 2 摘录：`See TerrainFeatures.HoeDirt::performUseAction in the game code. The Scythe is assigned harvesting method "1" and harvesting by hand is harvesting method "0".`
  - 结论：证明徒手采收普通作物触发地块代码 `performUseAction`，即通用 Check/Do Action。

### 3. 社区一手观察与实测证据（按实际观察强度表述）

- **官方论坛社区玩家贴（Stardew Valley Forums）**
  - **URL**: `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699`
  - **作者**: Elenna101 | **时间戳**: 2021-09-27T07:03:26-0700
  - **上下文**: 玩家讨论 PC 与移动端操作差异，回答大面积农田如何高效收获。
  - **精确摘录**: `Or the direction button and right click. (X is automatically mapped to right click) If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on, and then you just have to walk around over your crops to plant and harvest your field.`
  - **观察强度**: 社区玩家一手实操经验描述，确认 PC 默认右键及键盘 X 长按走动采收。

- **Steam 社区玩家讨论（Steam Community Discussions）**
  - **URL**: `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411`
  - **作者**: Automaton Spy (Kzar) | **留言 ID**: 1849197902669410411
  - **上下文**: 新手玩家疑问为何防风草提示需要镰刀，老玩家答疑。
  - **精确摘录**: `The problem is... You don't NEED the scythe for parsnips. You need the scythe for amaranth or wheat. For ANY other crop, you need to be standing next to it and rightclick it.`
  - **边界限制（不得外推）**: 该玩家所言“For ANY other crop”属于非严谨的社区概括（漏提了羽衣甘蓝 Kale、未碾米、纤维种子等），**严禁将该泛化断言外推**。仅采纳其正向事实：防风草无需工具，站在旁边右键点击即可采收。

- **Reddit 社区经验贴（r/StardewValley）**
  - **URL**: `https://www.reddit.com/r/StardewValley/comments/4bl3ih/psa_press_and_hold_the_x_key_on_your_keyboard_to/`
  - **作者**: NovanHero | **获取方式**: ego-browser DOM 回读
  - **精确摘录**: `Simply hold down the 'x' key (or whatever key is bounded to right click), walk, and your character will harvest and replant instantly as you walk by.`
  - **观察强度**: 证实键盘 X 键长按走动采收的有效性。

---

## 四、真实访问状态与限制清单（Access Log）

### 1. 真实访问成功项
1. `https://stardewvalleywiki.com/mediawiki/api.php`：curl 成功，取得 6 个页面的最新真实 revision ID。
2. `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/`：HTTP GET 成功，解析出 post-53699 正文、作者及时间。
3. `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/`：HTTP GET 成功，解析出 comment-1849197902669410411 原文。
4. `https://www.reddit.com/r/StardewValley/comments/4bl3ih/...`：ego-browser 渲染成功，提取到作者 NovanHero 及正文短摘录。

### 2. 访问受限或未观察项（明确记录缺口）
1. **YouTube Shorts 视频**（`https://www.youtube.com/shorts/ncg9SKnp7jg`）：
   - 状态：**未观察画面（Unobserved Visual Stream）**。
   - 详情：仅提取到页面标题（`The Better Way to Harvest Crops in Stardew Valley`）与频道元数据，未实际回放视频画面，不能声称“实操已完全证实”。
2. **Reddit 直接 CLI 请求**：
   - 状态：**直接命令行访问返回 HTTP 403**（受 Cloudflare / 机器人防护拦截），必须通过真实浏览器会话回读 DOM。
3. **Stardew Valley Wiki FAQ**（`https://stardewvalleywiki.com/FAQ`）：
   - 状态：**空页面（Empty Page）**，返回 HTTP 200 但正文为 0 字节提示。

---

## 五、修订与交付总结

本 v2 报告完全修复了 v1 中的 ID 错误与外推问题，去除了无据的排他性副断言，建立了可靠的正向收获证据链，并通过同名 `.json` 结构化提供给主研究角色 A 并行消费。
