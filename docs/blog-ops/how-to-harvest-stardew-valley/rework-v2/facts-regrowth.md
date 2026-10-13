# 《星露谷物语收获指南》Rework-V2 作物再生与成长条件事实核查报告（纠偏版）

- **审计角色**：事实核查审计员（Facts Auditor A，独立只读 research 叶子）
- **核查日期**：2026-10-13
- **核查环境**：唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **浏览器与接口**：
  - 本地 ego-browser（TaskSpace 127）实机页面回读与视觉验证
  - Stardew Valley Wiki 官方社区维基 MediaWiki API（HTTP GET）批处理查验
- **核查数据时标**：`2026-10-13T08:46:30+08:00`（脚本实际执行获取时标）
- **交付物路径**：
  - 核心报告：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth.md`
  - 原始证据目录：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth/`
    - `raw-sources-receipts.json`：全量 API 凭证、revid、oldid、原句引文与支持/不支持判定（已同步修正）
    - `blueberry_stages_table.png`：ego-browser TaskSpace 127 抓取的蓝莓生长与再生阶段表格视口截图
    - `blueberry_stage_6_harvest.png`：蓝莓成熟收获期精灵图（Stage 6，含蓝莓果实）
    - `blueberry_stage_7_after_harvest.png`：蓝莓采摘后植株精灵图（Stage 7，采摘后留地活植株）
    - `save_regrowth_receipts.py` 及 `update_regrowth_receipts.py`：回读与校验脚本

---

## 一、纠偏与撤回说明（Corrections & Retractions）

本报告针对上一版交付物中存在的私人事实归纳与过度推论，严格按照已有源原句证据执行如下纠偏与撤回：

1. **撤回土壤湿度与肥料保留断言**：
   - 撤回单次作物收获后地块关于湿度与肥料保留的技术推论，原句不支持。
2. **撤回即时播种与帧判定表述**：
   - 撤回手持种子采摘时的即时播种与底层帧判定推论，原句仅为边走边收播的实操经验。
3. **撤回镰刀作物混淆**：
   - 彻底删除在长按右键采收补种技巧中涉及小麦的错误表述，小麦为镰刀收割作物。
4. **撤回无源禁令与机制臆测**：
   - 撤回关于播种限制及工具破坏母株的主观推断，引文中无此直接条文。
5. **明确蓝莓再生浇水的归纳性质**：
   - 澄清：维基并未提供单独针对“再生期未浇水导致再生停长”的独立原句。该结论属于由 `Crops` 通用浇水规则（*“Crops must be watered every day for maximum growth. If unwatered for a day, a crop will not grow.”*）与蓝莓再生周期（*“continues to produce every 4 days after maturity”*）**综合推导**得出，正文中不得声称存在独立原句直接记载“regrowth water”。
6. **删除农学家（Agriculturist）相关主张**：
   - 题目与正文删除“农学家”相关加速断言。当前凭证仅对 Speed-Gro 系列肥料提供了直接原句（*“Speed-Gro affects only the growth and first harvest of a multi-harvest crop”* 及 *“Does not reduce time between harvests for multi-harvest crops”*），不强追未核职业规则。
7. **删除整段可粘贴建议与范围外内容**：
   - 彻底删除所有成段可直接粘贴的正文句、B 布局整合建议以及 Speed-Gro 额外 FAQ，严格限定在只读事实与边界说明。

---

## 二、核心核验事实清单（以真实 Quote 为准）

### 【FACT-R01】单次收获作物与可重复收获作物采后植株状态

- **来源归属**：Stardew Valley Wiki (`Crops`, `Blueberry`, `Parsnip`, `Crop_Growth_Calendars`)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Crops` (oldid: [193979](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979))
  - `https://stardewvalleywiki.com/Blueberry` (oldid: [192090](https://stardewvalleywiki.com/index.php?title=Blueberry&oldid=192090))
  - `https://stardewvalleywiki.com/Parsnip` (oldid: [191123](https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123))
  - `https://stardewvalleywiki.com/Crop_Growth_Calendars` (oldid: [189875](https://stardewvalleywiki.com/index.php?title=Crop_Growth_Calendars&oldid=189875))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - `Crop_Growth_Calendars`: *"With the exception of multi-harvest crops, the tables assume that seeds are replanted and watered on the day of harvest."*
  - `Blueberry`: *"The Blueberry is a fruit crop that grows from Blueberry Seeds after 13 days and continues to produce every 4 days after maturity."*
  - `Blueberry` Stages Table: *Stage 1 (1 Day), Stage 2 (3 Days), Stage 3 (3 Days), Stage 4 (4 Days), Stage 5 (2 Days), Harvest (Total: 13 Days, Blueberry Stage 6.png), After-Harvest (Regrowth: 4 Days, Blueberry Stage 7.png).*
  - `Parsnip` Stages Table: *Stage 1 (1 Day), Stage 2 (1 Day), Stage 3 (1 Day), Stage 4 (1 Day), Harvest (Total: 4 Days, Parsnip Stage 5.png).*
- **支持事实 (Supports)**：
  1. 单次收获作物（如防风草 Parsnip）生长阶段至 Harvest 截止，无 After-Harvest 阶段；日历表明确说明除多收作物外，收获日默认需要重新播种（replanted）。
  2. 可重复收获作物（如蓝莓 Blueberry）具备独立的 **After-Harvest（采后）阶段精灵图（Stage 7）**，采摘后植株保留在地上，每 4 天再次成熟，无需也不适用在收获日重新播种。
- **不支持/未证明 (Not-Supported)**：
  - 引文不支持单次作物收获后地块保留湿度或肥料的技术推断。
  - 引文未直接提供“禁止工具破坏母株”或“无法播种”的排他性规则条文。

---

### 【FACT-R02】再生作物再次结果的浇水条件与生长间隔代表例

- **来源归属**：Stardew Valley Wiki (`Crops`, `Blueberry`)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Crops` (oldid: [193979](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979))
  - `https://stardewvalleywiki.com/Blueberry` (oldid: [192090](https://stardewvalleywiki.com/index.php?title=Blueberry&oldid=192090))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - `Crops`: *"Crops must be watered every day for maximum growth. If unwatered for a day, a crop will not grow. Unwatered crops do not die, but they will not grow either."*
  - `Crops`: *"Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)... Days to Maturity and Days to Regrow are listed in each table."*
  - `Blueberry`: *"The Blueberry is a fruit crop that grows from Blueberry Seeds after 13 days and continues to produce every 4 days after maturity."*
- **支持事实 (Supports)**：
  1. 通用生长规则确立：每日浇水是作物推进生长的必要条件；缺水一天则作物停长一天，未浇水作物不会枯死。
  2. 蓝莓（Blueberry）作为代表例：成熟期需要 13 天，成熟后每隔 4 天再次产出（Regrowth: 4 days）。
- **不支持/未证明 (Not-Supported)**：
  - 维基文本中**不存在单独针对再生阶段浇水的独立原句**。
- **综合推导标注 (Derivation Note)**：
  - [综合推导] 再生作物收获后仍需浇水才能在 4 天后再次结果，是由 `Crops` 全局每日浇水规则与蓝莓 4 天再生间隔综合支持的逻辑推论，而非单独原句字面断言。

---

### 【FACT-R03】成长天数计算：种植日排除与初次成长/再生天数区分

- **来源归属**：Stardew Valley Wiki (`Crops`)
- **来源 URL**：`https://stardewvalleywiki.com/Crops` (oldid: [193979](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - *"The grow times shown on this page (and in the game) exclude the day the seeds were planted. If planting on the first of a season, a 5-day crop will be ready for harvest on day 6, not day 5. In this case, the number may be thought of as the number of nights required to grow the crop."*
  - *"If a seed is planted into unwatered soil and not watered the same day, it will not grow that night. Growth will start the following night. The grow times on this page assume the seeds are watered the day they are planted."*
  - *"Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)"*
- **支持事实 (Supports)**：
  1. **种植日不计入生长天数（Exclude planting day）**：生长时间实际为作物需要经历的浇水之夜数。例如 5 天作物在第 1 天播种浇水，在第 6 天收获。
  2. **播种未浇水顺延**：若播入未浇水土壤且当天未补浇，该夜不开始生长，顺延至次夜。
  3. **初次成长与再生天数明确区分**：官方公式将总生长时间区分为初次成熟天数（Days to Maturity）与后续每次再生天数（Days to Regrow）。
- **不支持/未证明 (Not-Supported)**：
  - 未支持超出公式以外的自定义周期计算。

---

### 【FACT-R04】生长激素（Speed-Gro 各品级）仅作用于首次成熟，不缩短再生间隔

- **来源归属**：Stardew Valley Wiki (`Fertilizer`, `Blueberry`)
- **来源 URL**：
  - `https://stardewvalleywiki.com/Fertilizer` (oldid: [194274](https://stardewvalleywiki.com/index.php?title=Fertilizer&oldid=194274))
  - `https://stardewvalleywiki.com/Blueberry` (oldid: [192090](https://stardewvalleywiki.com/index.php?title=Blueberry&oldid=192090))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - `Fertilizer`: *"Speed-Gro affects only the growth and first harvest of a multi-harvest crop."*
  - `Fertilizer` 表格批注: *"Note: Does not reduce time between harvests for multi-harvest crops."*（在 Speed-Gro、Deluxe Speed-Gro、Hyper Speed-Gro 处均有相同批注）
  - `Blueberry`: *"That makes Speed-Gro an optimal fertilizer for this crop, as it gives one extra harvest before the Fall (assuming planting on day 1 of the summer)... Deluxe Speed-Gro yields the same number of harvests as regular Speed-Gro..."*
- **支持事实 (Supports)**：
  1. 生长激素（Speed-Gro、Deluxe Speed-Gro、Hyper Speed-Gro）**仅影响多收作物的生长和首次收获（first harvest）**。
  2. 生长激素**不会缩短多收作物每次收获之间的间隔时间（Does not reduce time between harvests）**。
- **不支持/未证明 (Not-Supported)**：
  - 删去农学家（Agriculturist）相关主张（未引证职业独立原句）。
  - 不支持生长激素能缩短再生天数的任何推测。

---

### 【FACT-R05】纤维种子（Fiber Seeds）无需浇水反例：generic 边界

- **来源归属**：Stardew Valley Wiki (`Fiber_Seeds`)
- **来源 URL**：`https://stardewvalleywiki.com/Fiber_Seeds` (oldid: [193587](https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - *"Fiber Seeds are a type of crafted seed. They do not require daily watering and can even grow in Winter, but they must still be planted on tilled soil. They can also be eaten by Crows if not protected by a Scarecrow."*
  - *"Each fully-grown plant drops between 4 and 7 Fiber when harvested with a Scythe."*
- **支持事实 (Supports)**：
  1. 纤维种子是明确的例外：**不需要每日浇水即可生长**。
  2. 冬季可生长，必须种植在已耕土壤上，成熟后用镰刀（Scythe）收割。
- **不支持/未证明 (Not-Supported)**：
  - 不支持将不浇水规则外推至其他常规农作物。
  - 严禁在此展开纤维种子的经济或收益分析。
- **定位**：
  - 仅作为防范“所有作物每天都必须浇水”过度绝对化表述的边界反例。

---

### 【FACT-R06】PC 田间走动采收与播种操作边界（Forum & Controls）

- **来源归属**：Stardew Valley Forums 结合 Stardew Valley Wiki (`Controls`, `Crops`)
- **来源 URL**：
  - `https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699`
  - `https://stardewvalleywiki.com/Controls` (oldid: [192481](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481))
  - `https://stardewvalleywiki.com/Crops` (oldid: [193979](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979))
- **实际获取时间**：2026-10-13T08:46:30+08:00
- **源原句**：
  - Forum: *"If you hold right click with the mouse not near your character, you'll automatically plant seed and harvest on the tile you're standing on, and then you just have to walk around over your crops to plant and harvest your field."*
  - `Controls`: *Right-Click, X: Check/Do Action*；*Left-Click, C: Use tool or place item*
  - `Crops`: *"Seeds and fertilizer are placed on a tilled tile individually by using the left-click control, or on multiple tiles by continuously holding on to the right-click or left-click control and moving the cursor and/or player."*
- **支持事实 (Supports)**：
  1. 在 PC 上，手持种子按住右键且光标不紧挨角色在田间走动，可对脚下地块进行采收和播种。
- **不支持/未证明 (Not-Supported)**：
  - **不适用于镰刀作物**：小麦、甘蓝菜、苋菜必须挥动镰刀，无法右键采摘。
  - **不证明同帧判定**：不可宣称为“同帧（same-frame）”即时处理。
  - **不证明地块状态**：引文不包含收获后地块湿度或肥料保留的结论。
  - **不适用于活体植株**：蓝莓等再生作物采收后留存 Stage 7 母株，不可在活植株上播种。

---

## 三、事实核查边界与澄清提示（供角色 C 撰写时防偏，非正文段落）

1. **单次作物 vs 再生作物物理区别**：
   - 防风草等单次作物收获后地块变空，日历表假定收获日重新播种；蓝莓等作物收获后转入 Stage 7 采后灌木状态，无需重新播种。
   - **防偏提示**：不要顺手推导“单次作物收获会保留湿度与肥料”，维基无此引文。
2. **走动采播技巧适用范围**：
   - 按住右键边走边采播的操作仅适用于**手摘型作物**；严禁将小麦等镰刀收割作物混入右键采收举例中。
   - **防偏提示**：不要宣称“同帧即时种植”，仅表述为边走边采播的实用农事实操。
3. **再生浇水与生长天数**：
   - 区分初次成熟（蓝莓 13 天）与再生间隔（4 天）；生长天数从播种次日算起（排除了播种当天）。
   - **防偏提示**：明确每日浇水推导自全局规则，不宣称有独立的“再生专用浇水词条”。
4. **生长激素作用范围**：
   - Speed-Gro 仅加速首次收获，不缩短后续再生间隔。
   - **防偏提示**：不可将农学家混入未核引文，只保留 Speed-Gro 系列证据。
5. **反例边界**：
   - 纤维种子无需浇水仅用于避免正文绝对化表述，不展开任何财富与收益话题。

---

## 四、证据资产与检查清单

- [x] `raw-sources-receipts.json`：已完成同步，删去未经引证的断言。
- [x] `blueberry_stages_table.png`：ego-browser TaskSpace 127 实机截屏，证实 Stages 表与 4 天再生行。
- [x] `blueberry_stage_6_harvest.png`：成熟期果实精灵图。
- [x] `blueberry_stage_7_after_harvest.png`：采摘后留地活植株精灵图。
- [x] `update_regrowth_receipts.py`：校验与同步脚本，通过 JSON 解码核验。
- [x] 未修改任何文章正文、媒体、SEO、源码或旧版 facts。
- [x] 状态就绪：**READY** 交付 Root 调度器与角色 C。
