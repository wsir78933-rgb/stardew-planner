# A-facts 原始来源与证据快照

## 采集元数据

- 访问日期：2026-09-26（Asia/Shanghai）。
- 浏览器：本地 ego-browser；TaskSpace 26、Page p1；所有网页资料复用同一 Page。
- 研究角色：A-facts；本文件保存公开来源的最小必要摘录和定位，不是文章正文。
- 资料类型区分：
  - Wiki / 官方公告：公开资料事实。
  - GitHub decompiled source：实现交叉证据，不等于官方源代码。
  - Node 日期表：基于公开阶段数据和代码规则的 analysis 演算，不是游戏实测。

## 1. 版本来源

### 1.1 官方 Steam 页面

- URL：https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- 浏览器标题：Stardew Valley - Stardew Valley 1.6.15 Patch now available - Steam News
- 用途：核对 PC/Steam 的版本锚点为 1.6.15。
- 限制：浏览器正文只返回 Steam 导航文本；未把页面摘要或搜索摘要扩写成额外变更事实。

### 1.2 官方主机补丁

- URL：https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- 浏览器标题：Stardew Valley - 1.6.15.1 Patch for Xbox, PlayStation, and Switch
- 页面正文可见：ConcernedApe 2025-02-12 发布；说明该补丁修复主机问题并与 PC 最新内容同步；正文编辑注明 Switch 已可用。
- 用途：核对主机版本线；不推断不同平台内部 build suffix 相同。

### 1.3 1.6.16 页面

- URL：https://stardewvalleywiki.com/Modding:Migrate_to_Stardew_Valley_1.6.16
- 浏览器标题：Modding:Migrate to Stardew Valley 1.6.16 - Stardew Valley Wiki
- 可见文本：页面称 1.6.16 是 mod 作者准备的 upcoming 版本，并写作 potential patch、no planned release date。
- 用途：标记未发布/未核为当前稳定版；不是官方发布证明。

### 1.4 官方十周年公告

- URL：https://www.stardewvalley.net/stardew-valley-10-year-anniversary/
- 浏览器标题：Stardew Valley - Stardew Valley 10-year Anniversary
- 页面正文可见：ConcernedApe 2026-02-26 发布，并写有新更新正在制作中，但没有给出版本号或发布日期。
- 用途：与 1.6.15/1.6.15.1 版本公告及 1.6.16 migration 页交叉核对“后续更新在制作中”这一边界；不推断更新内容。

## 2. Wiki 页面访问记录与短摘录

以下 oldid 是浏览器读回的页面永久修订链接；摘录保持短句，正文内容应使用链接和版本注记。

| 页面 | 浏览器标题与 oldid | 事实摘录（转述/短引） | 用途 |
| --- | --- | --- | --- |
| [Speed-Gro](https://stardewvalleywiki.com/Speed-Gro?oldid=190630) | Speed-Gro - Stardew Valley Wiki；oldid 190630 | 页面写 10%，Agriculturist 合计 20%；可播种前、后或任何成长阶段施用；不缩短多收获作物的收获间隔；晚施用按固定阶段日数处理，已过阶段不追溯。 | 数值、时点、晚施限制、配方/购买。 |
| [Deluxe Speed-Gro](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196) | Deluxe Speed-Gro - Stardew Valley Wiki；oldid 191196 | 页面写 25%，Agriculturist 合计 35%；同样支持播种前后/任何阶段；不缩短多收获间隔。 | 数值、时点、配方/购买。 |
| [Hyper Speed-Gro](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377) | Hyper Speed-Gro - Stardew Valley Wiki；oldid 190377 | 页面写 33%，Agriculturist 合计 43%；配方来源为 Qi's Walnut Room 30 Qi；同样不缩短多收获间隔。 | 数值、时点、Qi 配方。 |
| [Fertilizer](https://stardewvalleywiki.com/Fertilizer?oldid=194274) | Fertilizer - Stardew Valley Wiki；oldid 194274 | 页面写一格只能一种肥料；肥料通常随换季消失，多季作物仍生长或温室等例外可保留；Speed-Gro 只影响多收获作物的成长与首次收获。 | 土格/换季/再生长边界。 |
| [Farming](https://stardewvalleywiki.com/Farming?oldid=191914) | Farming - Stardew Valley Wiki；oldid 191914 | Level 10 Profession 表中写 Agriculturist，All crops grow 10% faster；Level 3/8 表列 Speed-Gro / Deluxe Speed-Gro 配方等级。 | Profession 与配方等级。 |
| [Qi's Walnut Room](https://stardewvalleywiki.com/Qi%27s_Walnut_Room?oldid=192502) | Qi's Walnut Room - Stardew Valley Wiki；oldid 192502 | 页面写 100 Golden Walnuts 开门，注释说明首次发现不计入、实际需找到 101；Stock 表列 Hyper Speed-Gro Recipe 30。 | 配方购买条件。 |
| [Qi Gem](https://stardewvalleywiki.com/Qi_Gem?oldid=191603) | Qi Gem - Stardew Valley Wiki；oldid 191603 | Rewards Shop 表列 Hyper Speed-Gro Recipe，价格 30 Qi Gems。 | 价格交叉核对。 |
| [Crop Growth Calendars](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875) | Crop Growth Calendars - Stardew Valley Wiki；oldid 189875 | 页面说明 Base 不含 Agriculturist/成长肥料，10% 表用于 Speed-Gro 或 Agriculturist；普通作物表假设收获当天重种和浇水。 | 日历解释和演算假设。 |
| [Parsnip](https://stardewvalleywiki.com/Parsnip?oldid=191123) | Parsnip - Stardew Valley Wiki；oldid 191123 | Information 表：Growth Time 4 days、Season Spring；Stages 表：1 Day / 1 Day / 1 Day / 1 Day、Total 4 Days。 | 示例 1。 |
| [Melon](https://stardewvalleywiki.com/Melon?oldid=193510) | Melon - Stardew Valley Wiki；oldid 193510 | Information 表：Growth Time 12 days、Season Summer；Stages 表：1 / 2 / 3 / 3 / 3、Total 12 Days。 | 示例 2。 |
| [Strawberry](https://stardewvalleywiki.com/Strawberry?oldid=192732) | Strawberry - Stardew Valley Wiki；oldid 192732 | Information 表：Growth Time 8 days、Season Spring；Stages 表：1 / 1 / 2 / 2 / 2、Total 8 Days、Regrowth 4 Days；页面另列 Spring 13 + 10% 可达 3 次收获。 | 示例 3、再生长。 |
| [Coffee Bean](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175) | Coffee Bean - Stardew Valley Wiki；oldid 193175 | Information 表：Growth Time 10 days、Season Spring/Summer；Stages 表总计 10、Regrowth 2；页面说明跨春夏且 Spring 28 的肥料可保留到 Summer 1。 | 再生长/多季交叉例。 |

## 3. 公开代码证据

### 3.1 固定提交与文件

- 仓库：https://github.com/AcidicNic/StardewValleyDecompiled1.6
- 固定提交：2878fb248092f9f5b8704ad2cc7e19d0abe1cf45
- 说明：仓库 README 自称 Stardew Valley 1.6 Decompiled Source Code；这是公开 decompile snapshot，不是官方源代码发行。
- raw 文件：
  - [HoeDirt.cs raw](https://raw.githubusercontent.com/AcidicNic/StardewValleyDecompiled1.6/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs)
  - [Crop.cs raw](https://raw.githubusercontent.com/AcidicNic/StardewValleyDecompiled1.6/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs)

### 3.2 HoeDirt.cs 实际行号输出

本次只读命令：

~~~sh
curl -L --fail --silent --show-error 'https://raw.githubusercontent.com/AcidicNic/StardewValleyDecompiled1.6/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs' | nl -ba | sed -n '500,575p;584,635p;1035,1054p'
~~~

退出码：0。

关键读回：

~~~text
502  public bool plant(string itemId, Farmer who, bool isFertilizer)
512      applySpeedIncreases(who);
560      crop = new Crop(itemId, tilePos.X, tilePos.Y, Location);
567      applySpeedIncreases(who);

584  public void applySpeedIncreases(Farmer who)
596      crop.ResetPhaseDays();
597      int totalDaysOfCropGrowth = 0;
598      for (int j = 0; j < crop.phaseDays.Count - 1; j++)
602      float speedIncrease = fertilizerSpeedBoost;
607      if (who.professions.Contains(5))
609          speedIncrease += 0.1f;
611      int daysToRemove = (int)Math.Ceiling((float)totalDaysOfCropGrowth * speedIncrease);
613      while (daysToRemove > 0 && tries < 3)
617          if ((i > 0 || crop.phaseDays[i] > 1) && crop.phaseDays[i] != 99999 && crop.phaseDays[i] > 0)
619              crop.phaseDays[i]--;

1035 public virtual float GetFertilizerSpeedBoost()
1039 case "465":
1041     return 0.1f;
1042 case "466":
1044     return 0.25f;
1045 case "918":
1047     return 0.33f;
~~~

对应 HTML 行定位：[plant/applySpeedIncreases](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L502-L629)、[GetFertilizerSpeedBoost](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L1035-L1051)。

### 3.3 Crop.cs 实际行号输出

本次只读命令：

~~~sh
curl -L --fail --silent --show-error 'https://raw.githubusercontent.com/AcidicNic/StardewValleyDecompiled1.6/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs' | nl -ba | sed -n '380,414p;789,822p'
~~~

退出码：0。

关键读回：

~~~text
380  public bool RegrowsAfterHarvest()
387      return data.RegrowDays > 0;
403  public virtual void ResetPhaseDays()
408      phaseDays.Clear();
409      phaseDays.AddRange(data.DaysInPhase);
410      phaseDays.Add(99999);
789  public virtual void newDay(int state)
794      if ((bool)environment.isOutdoors && ((bool)dead || !IsInSeason(environment)))
807      if (!fullyGrown)
809          dayOfCurrentPhase.Value = Math.Min((int)dayOfCurrentPhase + 1, ...);
820  while ((int)currentPhase < phaseDays.Count - 1 && ... && phaseDays[currentPhase] <= 0)
~~~

对应 HTML 行定位：[RegrowsAfterHarvest/ResetPhaseDays](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L380-L411)、[newDay](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L789-L822)。

## 4. 日期演算命令和输出摘要

本次使用 Node 的 stdin 临时演算，没有创建脚本文件。命令职责拆成 applyGrowthModifier、harvestDay 和调度循环；退出码为 0。

输入阶段：

~~~text
Parsnip    [1,1,1,1]       plant Spring 1
Melon      [1,2,3,3,3]     plant Summer 1
Strawberry [1,1,2,2,2]     plant Spring 13; regrow 4
~~~

输出摘要（完整结果记录在 facts.md 的第 3 节）：

~~~text
Parsnip: base 4 -> Speed 3 (Spring 4), Deluxe 3 (Spring 4), Hyper 2 (Spring 3)
Melon:   base 12 -> Speed 10 (Summer 11), Deluxe 9 (Summer 10), Hyper 8 (Summer 9)
Melon + Agriculturist: Speed 9 (Summer 10), Deluxe 7 (Summer 8), Hyper 6 (Summer 7)
Strawberry: base first Spring 21, Speed Spring 20/24/28, Deluxe Spring 19/23/27, Hyper Spring 18/22/26
~~~

日期假设：播种当天浇水、当日肥料已生效、不跨季、不含温室/Paddy/未浇水/巨型作物。以上是代码规则驱动的 analysis，不是“实测”。

## 5. 失败或受限来源记录

- Google 搜索结果页对本次查询显示 robot challenge；没有绕过，没有使用结果摘要作为事实或引用。
- https://stardewvalleywiki.com/Version_history 的一次导航发生超时；该页未用于版本结论，后续改用官方 1.6.15 / 1.6.15.1 页面和可读的 1.6.16 migration 页面。
- raw GitHub 页面在一次浏览器 DOM innerText 提取中返回空正文；未把空结果当证据，改用固定 raw URL 的 curl 只读行号输出（退出码 0）。
- 一次官方版本浏览器命令因 shell 引号错误退出码为 1；立即改用 heredoc 重跑并退出码 0，成功读回三个页面标题。该命令错误不影响来源结论。
