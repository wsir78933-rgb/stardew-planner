# A-facts：Stardew Valley Speed-Gro 事实核验

## 研究边界

- 关键词：stardew valley speed gro
- 站点：https://stardewvalleyplanner.art
- 角色：A-facts；只交付事实、来源、演算和证据，不选择搜索意图、不设计布局、不写文章正文。
- 访问日期：2026-09-26（Asia/Shanghai）。
- 浏览器方法：本次资料页均通过本地 ego-browser 的 TaskSpace 26、Page p1 读取；没有把搜索摘要当作事实，也没有运行游戏实测。
- 版本边界：以下“当前”只表示截至访问日能从官方版本页核到的 1.6.15 PC / 1.6.15.1 主机版本线；不把 1.6.16 的 mod 迁移草案当成已发布版本。
- 独立性：本文件未读取本目录其他研究稿；只使用公开 Wiki、官方版本公告、公开的 1.6 decompiled source snapshot 和本文件中的明确演算。

## 1. 版本适用性

| 结论 ID | 已核事实 | 适用性与限制 | 公共来源 |
| --- | --- | --- | --- |
| F-VERSION-01 | 官方 Steam News 页面标题为 “Stardew Valley 1.6.15 Patch now available”。 | 作为 PC/Steam 的当前版本锚点；页面正文在浏览器端较简略，版本号以页面标题为证。 | [Steam News：1.6.15](https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english) |
| F-VERSION-02 | 官方站的 “1.6.15.1 Patch for Xbox, PlayStation, and Switch” 说明主机补丁同步 PC 最新内容，Switch 后续编辑注明已可用。 | 适用于该官方公告覆盖的主机平台；不能由此推断每个平台的内部 build suffix 完全相同。 | [Stardew Valley 官方站：1.6.15.1 主机补丁](https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/) |
| F-VERSION-03 | Wiki 的 1.6.16 mod 迁移页把 1.6.16 写成 “upcoming”，并称是可能的补丁、没有计划发布日期。 | 这是 Wiki 的 mod 作者页面，不是官方发布公告；因此本研究不把 1.6.16 机制当成当前已发布版本，也不覆盖后续 1.7。 | [Wiki：Migrate to Stardew Valley 1.6.16](https://stardewvalleywiki.com/Modding:Migrate_to_Stardew_Valley_1.6.16) |
| F-VERSION-05 | ConcernedApe 在 2026-02-26 的官方十周年公告说有 “a new update in the works”，但未给出版本号或发布日期。 | 这支持“后续更新仍在开发、不能把未编号更新写成已发布版本”，但不能据此确定更新内容或发布时间。 | [官方站：十周年公告](https://www.stardewvalley.net/stardew-valley-10-year-anniversary/) |
| F-VERSION-04 | Wiki 机制页与公开 1.6 decompiled source snapshot 相互核对；后者仓库自称 1.6 decompiled source code。 | 公开 decompile 只作实现交叉核对，不等同于官方源代码发行；若平台热修复或未来版本改变实现，应重新核对。 | [公开仓库 README](https://github.com/AcidicNic/StardewValleyDecompiled1.6), [HoeDirt.cs 固定提交](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs) |

**版本结论**：本事实集可用于 1.6.15 PC / 1.6.15.1 主机版本线的内容核查；平台实际显示的版本号仍应以玩家游戏内版本为准。没有证据支持把 1.6.16 写成已经发布，也没有进行安装包或运行时实测。

## 2. 速度肥料与 Agriculturist

### 2.1 标称数值不是日期直接乘法

| 结论 ID / 物品组合 | 游戏标称 growth modifier | Agriculturist 叠加后的 modifier | 已核来源 | 解释限制 |
| --- | ---: | ---: | --- | --- |
| F-SPEED-01 / Speed-Gro | 10%（代码值 0.10） | 20%（0.10 + 0.10） | [Speed-Gro Wiki](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)，[HoeDirt.cs GetFertilizerSpeedBoost](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L1035-L1051) | 不是保证把剩余日数减少 10% 或 20%；实际要按阶段日数和向上取整演算。 |
| F-DELUXE-01 / Deluxe Speed-Gro | 25%（代码值 0.25） | 35%（0.25 + 0.10） | [Deluxe Speed-Gro Wiki](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196)，[Farming Wiki](https://stardewvalleywiki.com/Farming?oldid=191914) | 同上；多收获作物的肥料收益只影响首次成长/首次收获，不缩短收获间隔。 |
| F-HYPER-01 / Hyper Speed-Gro | 33%（代码值 0.33） | 43%（0.33 + 0.10） | [Hyper Speed-Gro Wiki](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)，[HoeDirt.cs GetFertilizerSpeedBoost](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L1035-L1051) | 需要先取得 Qi 配方；不能把购买配方的门槛省略。 |
| F-AGRI-01 / Agriculturist 单独 | 无肥料时加 10% | — | [Farming Wiki](https://stardewvalleywiki.com/Farming?oldid=191914)，[HoeDirt.cs applySpeedIncreases](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629) | Agriculturist 是 Farming Level 10 的 Profession；代码中通过 who.professions.Contains(5) 加 0.1。 |

本角色范围只演算 Speed-Gro、Deluxe Speed-Gro、Hyper Speed-Gro 与 Agriculturist。代码还处理 Paddy crop 的额外 bonus，但本研究没有把它混入上述数值，避免把不同机制合并成未经核验的推荐。

### 2.2 成长阶段舍入与可复算算法

结论 ID：F-ROUND-01。

公开 decompiled snapshot 的 HoeDirt.applySpeedIncreases 给出的实现要点如下：

1. 先由 ResetPhaseDays 恢复作物原始阶段日数；Crop.cs 在固定提交中把 DaysInPhase 写入 phaseDays，再追加 99999 作为末尾哨兵。
2. totalDaysOfCropGrowth 只累加 phaseDays.Count - 1 之前的阶段，不累加 99999。
3. speedIncrease = fertilizerSpeedBoost；若有 Agriculturist，再加 0.1。代码还可能加 paddy bonus，但本范围排除。
4. daysToRemove = ceil(totalDaysOfCropGrowth * speedIncrease)，即向上取整。
5. 最多做 3 轮，从前到后逐阶段减 1 天；第一个阶段只有原本大于 1 天时才可减，后续阶段只要大于 0 且不是 99999 就可减。减到 0 的阶段会被后续作物阶段推进逻辑跳过。
6. 因此，日期结果取决于阶段向量、向上取整和阶段分配；不能用“成长时间 × (1 - 百分比)”直接替代游戏结果。

可复算的抽象写法（只对应本研究范围，未含 Paddy bonus）：

~~~text
baseDays = sum(phaseDays[0 .. lastRealStage])
effectiveBoost = fertilizerBoost + (0.10 if Agriculturist else 0)
daysToRemove = ceil(baseDays * effectiveBoost)
repeat at most 3 passes:
  for each real stage from first to last:
    if stage is eligible and stageDays > 0:
      decrement stageDays by 1
      daysToRemove -= 1
effectiveDays = sum(modified real stages)
~~~

这解释了两个常见误读：

- 10% / 25% / 33% 是游戏用于分配要删掉多少“阶段日”的标称 modifier，不是日历上必然少掉同样百分比。
- Agriculturist 是加算 0.10，而不是把肥料 modifier 再乘一次；例如 Deluxe + Agriculturist 为 0.35，Melon 的 ceil(12 × 0.35) 是 5 天。

证据定位：[HoeDirt.cs 584–629](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629)、[Crop.cs 403–411](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411)、[Crop.cs 789–822](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L789-L822)。

### 2.3 施用时点

结论 ID：F-APPLY-01。

- Speed-Gro、Deluxe Speed-Gro、Hyper Speed-Gro 都能放在已锄地上，播种前、播种后或作物任何成长阶段都可施用。
- Wiki 对三种肥料都明确说明：播种几天后再施用仍会减少完全成熟所需时间，但每个阶段减少的是固定天数；已通过的阶段不会追溯获得减免，前期阶段受到的比例影响更大，所以剩余时间的实际降幅可能显著低于标称百分比。
- 公开代码中 HoeDirt.plant 的施肥分支和创建 Crop 后的分支都会调用 applySpeedIncreases（固定提交 502–512、558–568），可作为“前后施用都会进入同一计算路径”的实现交叉核对；这不是游戏 UI 实测。
- 已成熟作物不应被写成还能缩短“下一次收获间隔”：Wiki 和 Fertilizer 页都把 Speed-Gro 的多收获作用限制在成长/首次收获。

来源：[Speed-Gro](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)、[Deluxe Speed-Gro](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196)、[Hyper Speed-Gro](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)、[HoeDirt.cs 502–568](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L502-L568)。

### 2.4 再生长与多收获

结论 ID：F-REGROW-01。

- Speed-Gro 三个等级影响多收获作物的初始成长和第一次收获；不缩短第一次收获后的再生长间隔。
- Strawberry 的公开页面给出：成长 8 天，成熟后每 4 天产出，阶段向量为 [1, 1, 2, 2, 2]，再生长为 4 天。
- Coffee Bean 的公开页面给出：成长 10 天，成熟后每 2 天产出，且春夏均可种植；其阶段向量为 [1, 2, 2, 3, 2]，再生长为 2 天。
- Crop.RegrowsAfterHarvest 检查 RegrowDays > 0，说明再生长是独立字段；本研究的日期示例只把肥料 modifier 用在第一次成长，不把它错误地乘到 4 天或 2 天的间隔上。

来源：[Fertilizer 机制](https://stardewvalleywiki.com/Fertilizer?oldid=194274)、[Strawberry](https://stardewvalleywiki.com/Strawberry?oldid=192732)、[Coffee Bean](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)、[Crop.cs 380–388](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L380-L388)。

### 2.5 施肥土、换季与保留

结论 ID：F-SEASON-01。

- 一个土格只能使用一种肥料。
- 肥料正常在当季保留；换季时通常消失。
- 如果施肥土格上的作物属于多季作物，且新季也是该作物可生长的季节，肥料会保留。Wiki 列出的例子是 Ancient Fruit、Coffee Bean、Corn、Sunflower、Wheat。
- 温室中的肥料会保留，除非用镐把土格变为未耕地。
- 这条“保留”是土格状态事实，不等于 Speed-Gro 会把多收获作物的再生长间隔缩短；两者需分开写。

来源：[Fertilizer 机制与换季规则](https://stardewvalleywiki.com/Fertilizer?oldid=194274)、[Coffee Bean 多季作物](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)。

### 2.6 配方、购买与解锁条件

| 项目 | 配方/购买事实 | 来源与适用性 |
| --- | --- | --- |
| F-RECIPE-01 / Speed-Gro | Farming Level 3 学配方；Pine Tar ×1 + Moss ×5；每次产出 5。Pierre's 从 Spring 15、Year 1 起售价 100g；也可由公开页面列出的其他来源获得。 | [Speed-Gro oldid 190630](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)。1.6 历史项明确写由 1 Clam 改为 5 Moss；按访问到的 Wiki 页面核对。 |
| F-RECIPE-02 / Deluxe Speed-Gro | Farming Level 8 学配方；Oak Resin ×1 + Bone Fragment ×5；每次产出 5。Pierre's 从 Year 2 起 150g；Oasis 周四 80g。 | [Deluxe Speed-Gro oldid 191196](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196)。页面还列出节日、神秘箱和沙漠节等其他取得途径，本表只保留核心配方与商店条件。 |
| F-RECIPE-03 / Hyper Speed-Gro | 先在 Qi's Walnut Room 以 30 Qi Gems 购买配方；Radioactive Ore ×1 + Bone Fragment ×3 + Solar Essence ×1；每次产出 1。 | [Hyper Speed-Gro oldid 190377](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)、[Qi's Walnut Room oldid 192502](https://stardewvalleywiki.com/Qi%27s_Walnut_Room?oldid=192502)。 |
| F-RECIPE-ROOM-01 / Qi's Walnut Room | Wiki 页面写明 Walnut Room 需要总计 100 个 Golden Walnuts 才能开启，并在注释中说明首次发现的 Golden Walnut 不计入该门槛，实际需找到 101 个；页面商店列 Hyper Speed-Gro Recipe 价格 30。 | 这是 Wiki 页面内的 UI/计数解释，不是本次游戏内实测；若文章需要展示门槛，应同时保留“页面写 100、注释解释实际 101”的上下文。 |
| F-AGRI-01 / Agriculturist | Farming Level 10 的 Profession，说明为所有作物成长快 10%。 | [Farming oldid 191914](https://stardewvalleywiki.com/Farming?oldid=191914)。 |

### 2.7 用于演算的作物阶段事实

| 作物 | 季节 | 基础成长 | 阶段日数（不含末尾哨兵） | 再生长 | 来源 |
| --- | --- | ---: | --- | ---: | --- |
| Parsnip | Spring | 4 天 | [1, 1, 1, 1] | — | [Parsnip oldid 191123](https://stardewvalleywiki.com/Parsnip?oldid=191123) |
| Melon | Summer | 12 天 | [1, 2, 3, 3, 3] | — | [Melon oldid 193510](https://stardewvalleywiki.com/Melon?oldid=193510) |
| Strawberry | Spring | 8 天 | [1, 1, 2, 2, 2] | 4 天 | [Strawberry oldid 192732](https://stardewvalleywiki.com/Strawberry?oldid=192732) |

Wiki 的 Crop Growth Calendars 页面说明 Base 表不含 Agriculturist 和 growth fertilizer，并将 10% 表同时用于 Speed-Gro 与 Agriculturist；普通作物日历还假设收获当天重新播种并浇水。以下示例仅演算第一轮成长，不把“重新播种”误套到 Strawberry 的再生长。

来源：[Crop Growth Calendars oldid 189875](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875)。

## 3. 可复算的日期示例（分析演算，不是实测）

共同假设：正常室外土格；播种当天已浇水；肥料在播种当天已生效；不跨季；不考虑 Paddy、温室、未浇水、巨型作物或其他改变种植规则的地点。日期按 Wiki 日历的游戏日语义计算：收获日 = 播种日 + effectiveDays。所有 days removed 都由 ceil(baseDays × effectiveBoost) 再按上文阶段规则分配得到。

### 3.1 EXAMPLE-01 Parsnip：短阶段与向上取整

播种 Spring 1，基础成长 4 天，所以基础收获是 Spring 5。

| modifier | 计算 | 修改后阶段 | effectiveDays | 首次收获 |
| --- | --- | --- | ---: | --- |
| 无 | ceil(4 × 0) = 0 | [1,1,1,1] | 4 | Spring 5 |
| Speed-Gro 10% | ceil(4 × .10) = 1 | [1,0,1,1] | 3 | Spring 4 |
| Deluxe 25% | ceil(4 × .25) = 1 | [1,0,1,1] | 3 | Spring 4 |
| Hyper 33% | ceil(4 × .33) = 2 | [1,0,0,1] | 2 | Spring 3 |
| Speed-Gro + Agriculturist 20% | ceil(4 × .20) = 1 | [1,0,1,1] | 3 | Spring 4 |
| Deluxe + Agriculturist 35% | ceil(4 × .35) = 2 | [1,0,0,1] | 2 | Spring 3 |
| Hyper + Agriculturist 43% | ceil(4 × .43) = 2 | [1,0,0,1] | 2 | Spring 3 |

这组结果直接显示：Deluxe 的标称 25% 在 4 天 Parsnip 上并不等于比 Speed-Gro 多减一天；向上取整和阶段分配决定日期。

### 3.2 EXAMPLE-02 Melon：较长阶段与 Agriculturist 加算

播种 Summer 1，基础成长 12 天，所以基础收获是 Summer 13。

| modifier | 计算 | 修改后阶段 | effectiveDays | 首次收获 |
| --- | --- | --- | ---: | --- |
| 无 | ceil(12 × 0) = 0 | [1,2,3,3,3] | 12 | Summer 13 |
| Speed-Gro 10% | ceil(12 × .10) = 2 | [1,1,2,3,3] | 10 | Summer 11 |
| Deluxe 25% | ceil(12 × .25) = 3 | [1,1,2,2,3] | 9 | Summer 10 |
| Hyper 33% | ceil(12 × .33) = 4 | [1,1,2,2,2] | 8 | Summer 9 |
| Speed-Gro + Agriculturist 20% | ceil(12 × .20) = 3 | [1,1,2,2,3] | 9 | Summer 10 |
| Deluxe + Agriculturist 35% | ceil(12 × .35) = 5 | [1,0,2,2,2] | 7 | Summer 8 |
| Hyper + Agriculturist 43% | ceil(12 × .43) = 6 | [1,0,1,2,2] | 6 | Summer 7 |

这里 12 × .35 = 4.2，代码取整为 5 天而非 4 天；这也是不能只用百分比心算的具体例子。

### 3.3 EXAMPLE-03 Strawberry：首次收获加速、再生长不变

播种 Spring 13，基础成长 8 天、再生长 4 天。基础首次收获 Spring 21，之后为 Spring 25、Spring 29；Spring 29 已越过本季。肥料只作用于首次成长，之后每次仍加 4 天。

| modifier | 首次成长计算 | 修改后阶段 / effectiveDays | 春季内收获日 |
| --- | --- | --- | --- |
| 无 | ceil(8 × 0) = 0 | [1,1,2,2,2] / 8 | Spring 21、25 |
| Speed-Gro 10% | ceil(8 × .10) = 1 | [1,0,2,2,2] / 7 | Spring 20、24、28 |
| Deluxe 25% | ceil(8 × .25) = 2 | [1,0,1,2,2] / 6 | Spring 19、23、27 |
| Hyper 33% | ceil(8 × .33) = 3 | [1,0,1,1,2] / 5 | Spring 18、22、26 |

因此 “Spring 13 + Speed-Gro 得到三次 Strawberry 收获”是可由阶段与再生长间隔复算的日期结论；不能改写为“Speed-Gro 让每次 4 天再生长也减少 10%”。

## 4. 明确未核验或不应越界的内容

- 没有运行 Stardew Valley、修改存档、做 UI 点击实测或测量实际加载版本；日期示例是基于公开阶段数据和代码的确定性演算。
- 没有把搜索结果地区、语言或结果排序当成真实地理位置；本角色不负责 SERP 意图判断。
- 没有把公开 decompiled source snapshot 当作官方源代码；其提交是 1.6 decompile 交叉证据，未来 patch 需重新核验。
- 没有确认 1.6.16 已发布；当前版本结论限于官方可核到的 1.6.15 / 1.6.15.1。
- 示例未覆盖：跨季播种、温室、姜岛种植地、Paddy bonus、未浇水、当天晚些时候播种、巨型作物、Enricher 自动施肥和 mod。
- “晚施肥仍减少完全成熟时间”的事实来自公开 Wiki/代码说明；本研究没有声称每一种晚施时点的具体日期都已经游戏内实测。
- 公开来源页面会随 Wiki 修订变化；表格中保留访问时观测到的 oldid，正文引用应保留版本注记。

## 5. Public reference registry

| ID | 标签 | URL | 访问日期 | appliesTo / versionNote | 支撑主张 |
| --- | --- | --- | --- | --- | --- |
| REF-VERSION-STEAM | Official Steam News 1.6.15 | https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english | 2026-09-26 | PC/Steam；页面标题给出 1.6.15 | F-VERSION-01 |
| REF-VERSION-CONSOLE | Official site 1.6.15.1 | https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/ | 2026-09-26 | Xbox/PlayStation/Switch 公告；主机内容同步 PC 最新内容 | F-VERSION-02 |
| REF-VERSION-NEXT | Wiki 1.6.16 migration | https://stardewvalleywiki.com/Modding:Migrate_to_Stardew_Valley_1.6.16 | 2026-09-26 | mod 作者页；明确写 upcoming，无计划日期；非发布证明 | F-VERSION-03 |
| REF-VERSION-FUTURE | Official 10-year anniversary | https://www.stardewvalley.net/stardew-valley-10-year-anniversary/ | 2026-09-26 | 官方公告写 new update in the works，未给版本号/日期 | F-VERSION-05 |
| REF-SPEED | Speed-Gro oldid 190630 | https://stardewvalleywiki.com/Speed-Gro?oldid=190630 | 2026-09-26 | Wiki 访问快照；1.6 页面历史写 5 Moss 配方变化 | F-SPEED-01, F-APPLY-01, F-RECIPE-01 |
| REF-DELUXE | Deluxe Speed-Gro oldid 191196 | https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196 | 2026-09-26 | Wiki 访问快照；1.6 页面历史含配方/来源变化 | F-DELUXE-01, F-APPLY-01, F-RECIPE-02 |
| REF-HYPER | Hyper Speed-Gro oldid 190377 | https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377 | 2026-09-26 | Wiki 访问快照；1.5 引入，Qi 配方 | F-HYPER-01, F-APPLY-01, F-RECIPE-03 |
| REF-FERTILIZER | Fertilizer oldid 194274 | https://stardewvalleywiki.com/Fertilizer?oldid=194274 | 2026-09-26 | Wiki 机制页；换季/温室/多收获限制 | F-REGROW-01, F-SEASON-01 |
| REF-FARMING | Farming oldid 191914 | https://stardewvalleywiki.com/Farming?oldid=191914 | 2026-09-26 | Wiki 技能页；Profession 文本 | F-AGRI-01, F-RECIPE-01, F-RECIPE-02 |
| REF-QI-ROOM | Qi's Walnut Room oldid 192502 | https://stardewvalleywiki.com/Qi%27s_Walnut_Room?oldid=192502 | 2026-09-26 | Wiki 商店/门槛页；30 Qi Gems 与 100/101 Golden Walnuts 注记 | F-RECIPE-03 |
| REF-QI-GEM | Qi Gem oldid 191603 | https://stardewvalleywiki.com/Qi_Gem?oldid=191603 | 2026-09-26 | Wiki 奖励商店表；配方价格 | F-RECIPE-03 |
| REF-CALENDAR | Crop Growth Calendars oldid 189875 | https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875 | 2026-09-26 | Base/10%/25%/33%/stacked comparison；日历假设 | F-ROUND-01, EXAMPLE-01..03 |
| REF-PARSNIP | Parsnip oldid 191123 | https://stardewvalleywiki.com/Parsnip?oldid=191123 | 2026-09-26 | Spring；4 days；阶段 1/1/1/1 | EXAMPLE-01 |
| REF-MELON | Melon oldid 193510 | https://stardewvalleywiki.com/Melon?oldid=193510 | 2026-09-26 | Summer；12 days；阶段 1/2/3/3/3 | EXAMPLE-02 |
| REF-STRAWBERRY | Strawberry oldid 192732 | https://stardewvalleywiki.com/Strawberry?oldid=192732 | 2026-09-26 | Spring；8 days；regrowth 4；阶段 1/1/2/2/2 | EXAMPLE-03 |
| REF-COFFEE | Coffee Bean oldid 193175 | https://stardewvalleywiki.com/Coffee_Bean?oldid=193175 | 2026-09-26 | Spring/Summer；10 days；regrowth 2；多季土肥保留例 | F-REGROW-01, F-SEASON-01 |
| REF-HOEDIRT | Public 1.6 decompiled HoeDirt.cs | https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs | 2026-09-26 | 固定提交；实现交叉证据，不是官方源代码分发 | F-SPEED-01, F-ROUND-01, F-APPLY-01 |
| REF-CROP | Public 1.6 decompiled Crop.cs | https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs | 2026-09-26 | 固定提交；regrow/phase/day progression 交叉证据 | F-REGROW-01, F-ROUND-01 |

## 6. 实际验证命令与退出码

以下命令均为本次研究实际运行的只读核验；没有安装依赖、写入外部服务或修改网站。

| 命令/动作 | 退出码 | 关键真实输出或用途 |
| --- | ---: | --- |
| git status --short | 0 | 初始工作树无既有修改；之后只观察到目标内容目录已有其他代理的未跟踪文件，本角色未读取或修改它们。 |
| ego-browser nodejs，复用 taskSpace(26) / page("p1") 读取 Speed-Gro、Deluxe、Hyper、Fertilizer、Strawberry | 0 | 返回标题、oldid 和正文段落；例如 Speed-Gro oldid 190630、Deluxe oldid 191196、Hyper oldid 190377。 |
| ego-browser nodejs，读取 Parsnip、Melon、Strawberry 阶段/成长表 | 0 | Parsnip 4 days / 1-1-1-1；Melon 12 days / 1-2-3-3-3；Strawberry 8 days / 1-1-2-2-2 / Regrowth 4。 |
| ego-browser nodejs，读取官方 Steam、官方主机补丁、1.6.16 migration | 0 | 页面标题分别核到 1.6.15、1.6.15.1 和 upcoming 1.6.16。 |
| curl -L --fail --silent --show-error 固定提交 raw HoeDirt.cs \| nl -ba \| sed -n '500,575p;584,635p;1035,1054p' | 0 | 读回 plant 调用点、applySpeedIncreases 的 ceil/3-pass/阶段减法、0.10/0.25/0.33 映射。 |
| curl -L --fail --silent --show-error 固定提交 raw Crop.cs \| nl -ba \| sed -n '380,414p;789,822p' | 0 | 读回 RegrowsAfterHarvest、ResetPhaseDays、换季死亡/日推进逻辑。 |
| node 临时 stdin 演算（applyGrowthModifier、harvestDay） | 0 | 输出 Parsnip/Melon/Strawberry 的 baseDays、daysRemoved、修改阶段、effectiveDays、首次/后续收获日；无脚本文件落盘。 |
| find docs/blog-ops/stardew-valley-speed-gro -maxdepth 4 -type f -print | 0 | 目标目录文件清单；本角色新增文件见下一节。 |

访问限制记录：

- Google 搜索结果页曾显示 robot challenge；没有绕过，也没有引用其摘要。
- stardewvalleywiki.com/Version_history 的一次导航出现超时；该页没有作为本事实集的来源，版本结论改用官方 1.6.15/1.6.15.1 页面和可读的 1.6.16 migration 页。
- raw GitHub URL 在一次浏览器 DOM innerText 提取中没有返回正文；没有把空结果当作证据，随后用同一固定 raw URL 的 curl 只读读取并记录行号，退出码为 0。

## 7. 本角色文件清单

- docs/blog-ops/stardew-valley-speed-gro/research/facts.md
- docs/blog-ops/stardew-valley-speed-gro/research/facts-evidence/source-extracts.md
