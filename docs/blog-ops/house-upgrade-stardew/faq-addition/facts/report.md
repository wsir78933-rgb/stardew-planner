# 农舍升级 (house-upgrade-stardew) FAQ 6项事实核查报告

- **核查日期**: 2026-10-17
- **网络状态**: 联网读取成功 (curl HTTP/2 200，超时限制 15s)
- **原始网络日志**: [raw-network.log](file:///Users/wusir/orca/workspaces/stardew%20planner/%E5%8D%9A%E5%AE%A2-2/docs/blog-ops/house-upgrade-stardew/faq-addition/facts/raw-network.log)
- **本地证据备份**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/`

---

## 事实核查总表

| 序号 | 事实项 | 状态 | 核心依据 |
|---|---|---|---|
| 1 | 升级1/2/3费用: 10,000g+450木材、65,000g+100硬木、100,000g | **PASS** | Wiki Farmhouse & Carpenter's Shop 升级费用表一致；1.6 版本升级2费用为 65k+100硬木 |
| 2 | 工期: 每档升级均需3天 | **PASS** | Farmhouse & Carpenter's Shop 明确 Robin 每次升级需 3 天 |
| 3 | 硬木获取: 罗宾普通店不售硬木；秘密森林路线入口大圆木(8硬木/单次/需钢斧)，内部6大树桩(12硬木/天/每日刷新) | **PASS** | Carpenter's Shop 永久库存仅有木材与石头；Secret Woods/Hardwood 记载刷新与掉落 |
| 4 | 第三档地窖: 地下新增地窖，自带33木桶，仅在地窖陈酿，配方20木材+1硬木 | **PASS** | Farmhouse、Carpenter's Shop、Cask 页面一致支持 |
| 5 | 室外占地: 农舍室外占地始终为 9×5，升级不扩大外部占地，不影响相邻地块 | **PASS** | Farmhouse 导言定为 9×5；Carpenter's Shop 明确升级不改变建筑 footprint |
| 6 | 装修与升级区别: 第二档后解锁装修；装修即时完成(0工期)，可随时撤销退款 | **PASS** | Carpenter's Shop 明确解锁节点(升级2后)、即时完成(instantly)与退款机制 |

---

## 各项事实详细核查证据

### Fact 1: 升级1/2/3费用 (PASS)
- **陈述**: 农舍升级1为 10,000g + 450 木材；升级2为 65,000g + 100 硬木 (1.6改版)；升级3为 100,000g。
- **状态**: **PASS**
- **主要来源**:
  - [Farmhouse](https://stardewvalleywiki.com/Farmhouse)
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
  - [Version History](https://stardewvalleywiki.com/Version_History)
- **原文摘录**:
  - `Farmhouse` ("==Upgrades=="):
    - Upgrade 1: `data-sort-value="10000"|{{Price|10000}} {{Name|Wood|450}}`
    - Upgrade 2: `data-sort-value="65000"|{{Price|65000}} {{Name|Hardwood|100}}`
    - Upgrade 3: `data-sort-value="100000"|{{Price|100000}}`
  - `Carpenter's Shop` ("==House Upgrades=="):
    - Upgrade 1: `{{Price|10000}}{{Name|Wood|450}}`
    - Upgrade 2: `{{Price|65000}}{{Name|Hardwood|100}}`
    - Upgrade 3: `{{Price|100000}}`
  - `Version History` (1.6):
    - `Raised price of second house upgrade (50,000g → 65,000g), but reduced number of hardwood needed (150 → 100).`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/farmhouse-wikitext.json`、`carpenter-shop-wikitext.json`、`version-history-wikitext.json`。

---

### Fact 2: 工期每档3天 (PASS)
- **陈述**: 罗宾完成每次农舍升级均需要 3 天。
- **状态**: **PASS**
- **主要来源**:
  - [Farmhouse](https://stardewvalleywiki.com/Farmhouse)
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
- **原文摘录**:
  - `Farmhouse` ("==Upgrades=="):
    - `[[Robin]] requires three days to complete each farmhouse upgrade.`
  - `Carpenter's Shop` ("==House Upgrades=="):
    - `Farmhouse upgrades require three days to complete.`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/farmhouse-wikitext.json`、`carpenter-shop-wikitext.json`。

---

### Fact 3: 硬木获取与秘密森林路线 (PASS)
- **陈述**: 罗宾普通商店存货不出售硬木；秘密森林入口大圆木需钢斧清除（一次性提供8硬木，不再长出）；林内6个大树桩每天刷新，共提供12硬木/天（每个大树桩需铜斧或更好，产出2硬木）。
- **状态**: **PASS**
- **主要来源**:
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
  - [Secret Woods](https://stardewvalleywiki.com/Secret_Woods)
  - [Hardwood](https://stardewvalleywiki.com/Hardwood)
  - [Large Stump](https://stardewvalleywiki.com/Large_Stump)
  - [Large Log](https://stardewvalleywiki.com/Large_Log)
  - [Axes](https://stardewvalleywiki.com/Axes)
- **原文摘录**:
  - `Carpenter's Shop` ("==Permanent Stock=="):
    - 仅有 Wood (10g/50g) 与 Stone (20g/100g)，无 Hardwood。
  - `Secret Woods`:
    - `The entrance is initially blocked by a [[Large Log|large log]] that can be cleared after upgrading to at least a [[Axes|Steel Axe]].`
    - `The Secret Woods contain 6 [[Large Stump]]s that regrow daily and can be harvested for a total of 12 [[Hardwood]] each day.`
  - `Hardwood`:
    - `It is obtained by chopping down a [[Mahogany Tree]] or a [[Mystic Tree]] with any [[Axes|axe]], a [[Large Stump]] with a [[Axes|Copper Axe]] or better, or a [[Large Log]] with a [[Axes|Steel Axe]] or better.`
    - `Six [[Large Stump]]s respawn daily in the [[Secret Woods]], making it possible to obtain 12 Hardwood per day.`
  - `Large Stump`:
    - `A [[Axes|Copper Axe]] (or better quality) is required to remove a large stump, yielding 2 [[Hardwood]]`
  - `Large Log`:
    - `A [[Axes|Steel Axe]] (or better quality) is required to remove a large log, yielding 8 [[Hardwood]] ... Large Logs will never reappear once removed.`
  - `Axes`:
    - Steel Axe (5,000g + 5 Iron Bars): `Can chop Large Logs.`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/` 下 `carpenter-shop-wikitext.json`、`secret-woods-wikitext.json`、`hardwood-wikitext.json`、`axes-wikitext.json`、`large-stump-wikitext.json`、`large-log-wikitext.json`。

---

### Fact 4: 第三档地窖与木桶 (PASS)
- **陈述**: 农舍第三档升级在地下增加地窖（经由厨房进入），自带33个木桶（Cask），用于陈酿果酒、奶酪、山羊奶酪、啤酒、蜂蜜酒和淡啤酒；木桶配方（20木材+1硬木）在本次升级解锁；木桶仅放在地窖时才会陈酿。
- **状态**: **PASS**
- **主要来源**:
  - [Farmhouse](https://stardewvalleywiki.com/Farmhouse)
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
  - [Cask](https://stardewvalleywiki.com/Cask)
- **原文摘录**:
  - `Farmhouse` ("==Upgrades=="):
    - `Adds a cellar under the house, allowing access via the kitchen. The cellar houses [[cask]]s which can age products such as [[cheese]] and [[wine]] to increase quality and value. The cellar comes with 33 casks, though it may house as many as 189 casks.`
  - `Carpenter's Shop` ("==House Upgrades=="):
    - `House Upgrade 3: Adds a cellar under the house, allowing access via the kitchen. The cellar allows the player to craft and house [[Cask]]s which can age specific products (i.e., Cheese, Goat Cheese, Beer, Mead, Pale Ale, and Wine) to increase their quality and value.`
  - `Cask`:
    - `recipe = Final [[Farmhouse]] upgrade`
    - `ingredients = {{Name|Wood|20}}{{Name|Hardwood|1}}`
    - `Casks can be placed anywhere; however, they will only accept goods to refine if they are actually in the [[Farmhouse#Upgrades|cellar]].`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/farmhouse-wikitext.json`、`carpenter-shop-wikitext.json`、`docs/blog-ops/house-upgrade-stardew/research/upgrade-planning/sources/03-wiki-cask.json`。

---

### Fact 5: 农舍室外占地9x5不增大 (PASS)
- **陈述**: 农舍室外占地长宽始终为 9×5 格矩形，升级过程中建筑占地不变，不影响室外相邻地块。
- **状态**: **PASS**
- **主要来源**:
  - [Farmhouse](https://stardewvalleywiki.com/Farmhouse)
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
- **原文摘录**:
  - `Farmhouse` (Lead):
    - `The outer footprint of the farmhouse is a 9×5 rectangle.`
  - `Carpenter's Shop` ("==House Upgrades=="):
    - `When upgrading the [[Farmhouse]], the footprint of the building does not change, so no adjacent tiles are impacted.`
    - `House Upgrade 3: ... The exterior appearance of the house remains identical.`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/farmhouse-wikitext.json`、`carpenter-shop-wikitext.json`。

---

### Fact 6: 第二档后装修与升级不同、装修即时完成 (PASS)
- **陈述**: 装修（House Renovations）在第二次农舍升级后解锁；装修是即时完成的（0工期），且可以随时撤销退款；装修与农舍升级（需3天工期、逐档推进）属于不同机制。
- **状态**: **PASS**
- **主要来源**:
  - [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)
  - [Farmhouse](https://stardewvalleywiki.com/Farmhouse)
- **原文摘录**:
  - `Carpenter's Shop` ("==House Renovations=="):
    - `House renovations allow the player to add or remove certain features from their house. All the renovation options are done instantly and can be reversed, which refunds the money spent on it. House renovations are unlocked after the second farmhouse upgrade.`
    - `Remove Crib: Free`
    - `Add Dining Room: 150,000g`
  - `Farmhouse` ("==Upgrades=="):
    - Upgrade 2: `Unlocks renovations and the ability to paint the house.`
- **本地对照证据**: `docs/blog-ops/house-upgrade-stardew/research/material-preparation/sources/carpenter-shop-wikitext.json`、`farmhouse-wikitext.json`。
