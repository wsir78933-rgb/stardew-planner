# D-en 独立写后检查：`stardew valley speed gro`

## 结论

| 门 | 结果 | 结论依据 |
|---|---|---|
| ResearchTrace | PASS | 正文没有检索日志、内部路径、角色/任务回执或作者自评；公开链接与必要的计算方法说明均保留。 |
| ReaderValue | PASS | 新鲜 Bing 搜索证据支持“何时值得用/如何按日历决定”的主意图；正文能从可获得的肥料等级、作物阶段和季节期限走到可观察的选择。 |
| Repetition | PASS | 核心边界被在开头、机制、流程、例子和清单中分层复现，但每处承担不同读者作用；没有重复表格或两段承担同一完整任务。密度偏高但未构成同角色重复失败。 |

本报告只做 D-en 的三门检查，不兼任 E；未修改正文或媒体。检查输入严格为 `research/en.md`、`research/facts.md`、`layout/en.md`、`drafts/body-en.md` 和 `assets/en/`。

## 1. 主意图与新鲜搜索核对

本次用本地 ego-browser 对 Bing 做了独立、显式记录错误的读取；每条查询的 `navigationError`、`loadError`、`evaluationError` 均为 `null`。请求带有 `setlang=en-US&cc=US`，但浏览器报告 `navigator.language=en`、`navigator.languages=["en","zh-CN"]`、时区 `Asia/Shanghai`，没有把这次结果写成已验证的美国个性化 SERP。

实际观察到的结果家族：

- 原始查询 `stardew valley speed gro`：前列为 `Speed-Gro - Stardew Valley Wiki`、第二个同名 Wiki 结果和 `Deluxe Speed-Gro - Stardew Valley Wiki`，说明基础机制/等级查找是强需求。
- `stardew valley speed gro worth it`：第一为 Reddit `Is speedgro even worth it?`，第二为 Steam `Using Speed-Gro: A Full Fertilizer Analysis`，直接暴露“是否值得、是否多出一收获”的决策问题。
- `stardew valley speed gro calculator`：第一为 CodingAce calculator，第二为 `Crop Growth Calendars - Stardew Valley Wiki`，说明用户需要作物、日期、成长阶段与日历输入，而不是只看物品定义。
- `stardew valley deluxe speed gro`：第一为 `Deluxe Speed-Gro - Stardew Valley Wiki`，支持把三档肥料比较作为完成决策的必要子问题。

因此，布局中选定的 B 类“crop-calendar decision / when to use”与实际结果相符，并没有把产品关联改写成读者需求。正文开头的原句：

> “Speed-Gro is useful when the earlier first harvest changes your crop calendar.”（`body-en.md:1`）

直接回答“什么时候有用”；同段继续给出“compare the first harvest date ... with the last useful day of the season”，与搜索中出现的 worth-it、calculator 两类需求对接。正文没有把 Bing 排名或社区页面写成事实依据。

## 2. ResearchTrace：PASS

### 正文中保留的是读者所需方法，不是内部检索过程

- `body-en.md:3` 明确写：`“The worked dates do not represent an in-game test; they are source-based calculations...”`，这是必要的结果边界和方法说明，不是检索日志。
- `body-en.md:31` 解释阶段向量、向上取整和 whole-day reductions；`body-en.md:35-41` 的公式和实现交叉核对帮助读者复算。`body-en.md:41` 明确说 decompiled snapshot 不是官方源代码发布，也不是游戏实测。
- `body-en.md:62` 与 `body-en.md:124` 的图注分别标明 source-based calculations、not a game screenshot or playtest；这是避免把图解冒充实测的必要声明。
- `body-en.md:19` 的官方 1.6 changelog、`body-en.md:13-15` 的 oldid 物品页、`body-en.md:23` 的 Fertilizer 机制页和 `body-en.md:41` 的固定提交链接都是描述性公开 URL，没有私有令牌、内部抓取地址或内部证据快照。

对正文运行内部残留词扫描：

```text
rg -n -i 'TaskSpace|ego-browser|research/|layout/|A-facts|B-en|C-en|D-en|E-en|F-en|SERP|search result|research says|canary|prompt|internal path|agent' drafts/body-en.md
```

退出码 `1`，无输出，表示没有命中这些内部过程残留。链接扫描命令 `rg -n 'https?://' drafts/body-en.md` 退出码 `0`，命中的 URL 均为官方站、Wiki、公开 GitHub 固定提交或正文引用的公开页面。

## 3. ReaderValue：PASS

### 读者任务能完成

正文满足布局中唯一 ReaderTask 的关键动作，且不是“有步骤”空泛通过：

1. **先定可用等级和条件。** `body-en.md:11-19` 给出 Speed-Gro、Deluxe、Hyper 的 10%/25%/33%、Agriculturist 加算、配方/购买/解锁和 1.6 配方纠正；`body-en.md:79` 要求只计算玩家实际能取得的等级。
2. **把百分比转换成日期。** `body-en.md:31` 要求以真实 stage vector 和 `ceil` 计算 whole stage-days；`body-en.md:45-54` 用 Parsnip 证明 10% 与 25% 都只减一天，`body-en.md:58-65` 用 Melon 展示不同等级产生不同首收日期。
3. **按期限做选择。** `body-en.md:71-83` 明确输入作物、季节、播种日、deadline、可用等级和成本/价值的个人输入；`body-en.md:81` 给出“是否改变真实分支”的判断条件，避免把更高百分比直接称为 best。
4. **处理单收获与多收获分支。** `body-en.md:87-89` 区分单收获重种与多收获固定 regrowth；`body-en.md:111-120` 的 Strawberry Spring 13 表格给出无肥 Spring 21/25（Spring 29 越界）、Speed-Gro Spring 20/24/28、Deluxe Spring 19/23/27、Hyper Spring 18/22/26，并说明后续间隔仍为 4 天。
5. **给出收束动作。** `body-en.md:147-154` 的六步清单要求先算无肥，再算实际可用等级，比较期限，选择改变计划的最低等级或选择 none；没有虚构普遍 ROI、最佳作物或保证收益。

这些内容回应了新鲜搜索里“worth it”“calculator”和 tier lookup 三个结果家族，同时保留原始查询的机制查找需求。没有把搜索结果中的社区分析、ROI 宣传或 calculator 输出冒充游戏规则。

### 图解存在性与含义核对

两张英文媒体均为真实 SVG，不是占位符；`file` 命令退出码 `0`，两者均识别为 `SVG Scalable Vector Graphics image`。

#### Figure 1：Melon 阶段日数

- 文件：`assets/en/speed-gro-melon-stage-days.svg`，SHA-256：`f2e1868a70b9f632d609635742528006c7f372d716cf72529247bb4a26875b16`。
- 文件实际有 `<title>`/`<desc>`（`svg:2-3`）、四行状态和向量/有效天数/首收日期（`svg:27-57`），底部还写明 `days removed = ceil(12 × modifier)`（`svg:60`）。
- 正文在 `body-en.md:60-65` 真实嵌入该文件；alt、caption 和邻近段落都说明 Summer 1、`[1,2,3,3,3]`、Speed-Gro/Deluxe/Hyper 的向量、10/9/8 天与 Summer 11/10/9，并明确这是计算而非实测。图中数据与正文 `body-en.md:58`、`95-107` 一致，含义是“阶段日数如何转成首收日期”，不是装饰图或截图。

#### Figure 2：首次成长与固定再生长

- 文件：`assets/en/speed-gro-strawberry-regrowth-calendar.svg`，SHA-256：`aecd442b7f563c484e4c676f33a187061028e7481bb8fdd3d183b9a2b8ebf17d`。
- 文件实际有 `<title>`/`<desc>`（`svg:2-3`）、Spring 13–29 的日期轴（`svg:23-29`）、四档肥料的首收和后续日期（`svg:31-69`），并把 Spring 29 标为越过 Spring 28（`svg:17-21,71-73`）。
- 正文在 `body-en.md:122-127` 真实嵌入该文件；alt/caption/邻近段落均说明首段可提前、后续每段仍为 4 天。图中四行与正文 `body-en.md:113-120` 完全对应，含义是分离 first growth 与 fixed regrowth，不是把 4 天错误地乘以肥料百分比。

## 4. Repetition：PASS

核心边界有意识地多次出现，但每次承担的作用不同，未发现可整段删除而不损失新读者动作的重复段：

- 开头定答案：`body-en.md:1` 的 `“the earlier first harvest changes your crop calendar”`；这是主意图入口。
- 机制边界：`body-en.md:23` 的 `“fertilizer does not reduce the time between harvests”`；这是施用与多收获机制说明。
- 操作分支：`body-en.md:89` 的 `“write the first harvest date on one line and the regrowth interval on another”`；这是读者执行方法。
- 具体例子：`body-en.md:120` 解释 Strawberry 为什么 Speed-Gro 能把第三次收获带回 Spring 28；`body-en.md:127` 解释 Figure 2 怎样防止把后续 4 天错误缩短；两段分别是日历结论和图解解读。
- 收束清单：`body-en.md:147-154` 将前文压缩成可执行检查顺序，未再次重列配方或完整表格。

百分比边界也从“开头结论”（`body-en.md:1`）推进到“阶段算法”（`31-41`）、“Parsnip 反例”（`45-54`）和“Melon 决策”（`58-65,95-107`）；不是多个同作用的百科定义。重复出现的核心事实有新增条件、输入或结果，故本门 PASS。

## 5. 机械证据与版本绑定

- 正文 SHA-256：`c28eb746478ba9285325e7bfa41b42e2380ac99cfe0a0c7a1be359f869d7f3f3`。
- 媒体 SHA-256：见上方 Figure 1/2；同一轮 `shasum -a 256 drafts/body-en.md assets/en/speed-gro-melon-stage-days.svg assets/en/speed-gro-strawberry-regrowth-calendar.svg` 退出码 `0`。
- 计数预检：第一次误执行 `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py drafts/body-en.md`，退出码 `2`（缺少 `--locale`）；立即按脚本用法重跑 `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en drafts/body-en.md`，退出码 `0`，输出 `mechanical_units=2371`、`required_floor=2000`、`semantic_qualification=requires_independent_review`。这是机械预检，不是 F 锁稿或语义通过依据。
- Fresh Bing 原始查询与三条变体的 ego-browser 显式错误捕获脚本退出码均为 `0`；原始查询的 `navigationError/loadError/evaluationError` 均为 `null`，三条变体也均为 `null`。精确美国地理 SERP 仍是 UNVERIFIED。

本次 D-en 只写入本文件；正文和 `assets/en/` 未改动。
