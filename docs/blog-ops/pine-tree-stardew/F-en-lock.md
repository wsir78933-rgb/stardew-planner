# F-en lock：`pine-tree-stardew`（en-US）正文技术锁与标题候选

- **角色：** Agent F-en；只处理 EN 正文锁、EN 公开引用清单、EN 标题/描述候选与 E-title 交接。
- **日期：** 2026-09-22（Asia/Shanghai）。
- **唯一写入：** `docs/blog-ops/pine-tree-stardew/locked/en-body.txt`、本报告。
- **禁止范围：** 未修改 C/D/E/A/B/spec、ZH 文件、source、public、tests、package、媒体、部署、commit、push 或外部服务。
- **主关键词 / 地区：** `pine tree stardew` / `en-US`。
- **锁前原则：** D、E 必须对同一 C 版本通过；F 不改写正文绕过审查。标题先自由创作，后归类公式；标题最终审核仍交 E-title，F 不自审放行。

## 1. D/E 同版本门禁结论

**F 正文锁阶段可进入：PASS。** D 与 E 都绑定同一个 C raw SHA-256 `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`；D 的 ResearchTrace、ReaderValue、Repetition 三门均 PASS，E 的内容/事实审核、22/22 鉴文、读者价值、可读性均 PASS。D/E 各自明确保留的 PublicReference occurrence、最终 SEOTruth、实际媒体、页面、build/deploy 和用户终审属于 F/E-title/G 的后续边界，不被本报告伪称为已经完成。

| 证据 | 当前真实值 | 结论 |
|---|---|---|
| `C-en-draft.md` | `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819` | 当前候选正文 |
| `D-en-check.md` | `6101561558b3c6690f10fe0861d441cb7048c6526c797a9bbb7160469a220888` | 三门 PASS；机械 reader-bound `2478` |
| `E-en-review.md` | `bd4844e6d2f9fe38e7b30e0a77b15ebf5ba505f2da2b44138a10e0e0ac44fd89` | 内容/事实 PASS；22/22 PASS；SEO/publicReference 交由后续阶段 |
| D/E 版本约束 | 同一 C raw hash `b847…` | 满足 F 入场条件 |

D/E 的媒体结论仍为 **UNVERIFIED**：六个计划媒体文件缺失；本 F 不制造媒体存在性、尺寸、授权或页面渲染证据。D/E 的 PublicReference 结论在锁前为 **UNVERIFIED**，本报告按锁定正文 hash 重建公开引用 map；这不是把旧 occurrence 直接回收。

## 2. V7 输入与版本证据

本轮按以下 V7 文件执行；hash 是读取时真实值：

| 文件 | SHA-256 |
|---|---|
| `02-内容生产与质量门.md` | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` |
| `03-博客页面生成整合.md` | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` |
| `04-公开交接与页面装配.md` | `31c73c23f0825b0291d6ed4224a57cbeb8b01b5e4502d2091724d999ba225d9c` |
| `参考规则/标题与描述规则.md` | `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710` |
| `参考规则/七罪引擎.md` | `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3` |
| `脚本/正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |

## 3. 淬文与正文技术锁

### 3.1 锁定范围

- 输入：`C-en-draft.md` 的 `C:7–190`，即读者正文、图位/图注和公开 `Sources`；不带 C 的编辑头 `C:1–5`、空行 `C:6` 或编辑备注 `C:191–196`。
- 输出：`locked/en-body.txt`，共 184 行，19815 UTF-8 bytes，保留 H2/H3、正文链接、图位、表格和 `Sources`。
- 淬文动作：只做确定性 UTF-8、LF 换行、NFC 规范化并移除编辑头/编辑备注；正文没有词句重写、补事实、删限制、加 CTA 或改链接。
- NFC 回读：`unicodedata.is_normalized('NFC', locked_body)=True`；末尾为单个 LF。

### 3.2 锁定 hash

```text
C raw SHA-256:              b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819
locked/en-body.txt SHA-256: 3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1
locked body bytes:          19815
locked body lines:          184
NFC/LF:                     PASS
```

`3b53…` 是锁定 body（含 `Sources`、不含 C 编辑头/备注）的 hash；不能与 C raw `b847…` 混称。正文任何后续字节变化都必须撤销本锁，重新运行 D、E、F。

## 4. V7 机械正文计数

按照 V7 计数规则，从锁定 body 的 `## Sources` 之前取正文，并剔除两条 `*Figure:` 图注；标题、H2/H3、图位 alt/caption、URL、来源清单、表格分隔线不计。实际命令：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py <(python3 - <<'PY'
from pathlib import Path
lines = Path('docs/blog-ops/pine-tree-stardew/locked/en-body.txt').read_text(encoding='utf-8').splitlines()
out = []
for line in lines:
    if line.strip() == '## Sources':
        break
    if line.lstrip().startswith('*Figure:'):
        continue
    out.append(line)
print('\n'.join(out))
PY
) --locale en --exclude-heading Sources
```

真实 JSON 核心结果：

```json
{
  "mechanical_units": 2478,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "omitted_line_counts": {
    "headings": 21,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 72,
    "frontmatter": 0
  },
  "sha256_raw": "4f659861040b6ca6a24b40f0ca6076ccf921e862d41e7b8f22b865a3a9d03a61",
  "sha256_nfc_lf": "4f659861040b6ca6a24b40f0ca6076ccf921e862d41e7b8f22b865a3a9d03a61"
}
```

**Length：PASS（2478 qualified mechanical English units ≥ 2000）。** `4f6598…` 是计数输入（正文前缀、去 Sources/图注）的派生 hash，不是锁定 body hash；脚本本身不替代 D/E 的语义门。

## 5. PublicReference 冻结

以下清单与锁定 body hash `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1` 同时冻结。`quote` 均为 `locked/en-body.txt` 的精确片段，`occurrence` 按 NFC 正文从 1 开始计数；本轮所列片段各自 occurrence 均为 `1`。来源是允许公开的页面标题和 URL，不包含原始抓取、SERP、内部报告或私有路径。

| id | label | url | appliesTo（精确 quote / occurrence） |
|---|---|---|---|
| `wiki-pine-tree` | Stardew Valley Wiki: Pine Tree | `https://wiki.stardewvalley.net/Pine_Tree` | `A Pine Cone is the item you plant when you want a Pine Tree.` / 1；`The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supports the general outside-farm interaction,` / 1；`says a normal Pine can mature in five days, even in Winter.` / 1 |
| `wiki-pine-cone` | Stardew Valley Wiki: Pine Cone | `https://wiki.stardewvalley.net/Pine_Cone` | `The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) lists these routes:` / 1；`The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) supports the planting condition.` / 1 |
| `wiki-trees` | Stardew Valley Wiki: Trees | `https://wiki.stardewvalley.net/Trees` | `The [Trees page](https://wiki.stardewvalley.net/Trees) describes the rule precisely: a mature tree in that eight-tile ring blocks the seedling from passing stage 4.` / 1；`For ordinary common-tree growth, the [Trees reference](https://wiki.stardewvalley.net/Trees) describes a 20% chance of advancing each night in Spring, Summer, or Fall.` / 1；`The [Trees page](https://wiki.stardewvalley.net/Trees) records map-level exceptions involving the Desert and Ginger Island.` / 1；`The broader [Trees reference](https://wiki.stardewvalley.net/Trees) lists additional common-tree locations, but it also records interaction limits:` / 1 |
| `wiki-pine-tar` | Stardew Valley Wiki: Pine Tar | `https://wiki.stardewvalley.net/Pine_Tar` | `the [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) gives examples such as Cindersap Forest, the Railroad, and around the Carpenter’s Shop.` / 1；`The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) verifies several uses:` / 1；`The [Pine Tar page](https://wiki.stardewvalley.net/Pine_Tar) supports the item values.` / 1 |
| `wiki-tapper` | Stardew Valley Wiki: Tapper | `https://wiki.stardewvalley.net/Tapper` | `The [Tapper reference](https://wiki.stardewvalley.net/Tapper) lists Pine Tar from a Pine on a five-night interval.` / 1；`The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) and [Tapper reference](https://wiki.stardewvalley.net/Tapper) support both intervals.` / 1 |
| `wiki-tree-fertilizer` | Stardew Valley Wiki: Tree Fertilizer | `https://wiki.stardewvalley.net/Tree_Fertilizer` | `Tree Fertilizer is for an already planted wild-tree seed or sapling.` / 1；`The [Tree Fertilizer reference](https://wiki.stardewvalley.net/Tree_Fertilizer) says it advances most wild trees one stage each night, with the final stage taking two nights.` / 1 |
| `official-1-6-changelog` | Stardew Valley 1.6 Update Full Changelog | `https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/` | `The [official Stardew Valley 1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) says trees can no longer be planted in town or in the Beach Farm tunnel.` / 1；`The official [1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) records the recipe-level change,` / 1 |
| `site-stardew-valley-trees` | Stardew Valley Planner: Stardew Valley trees guide | `https://stardewvalleyplanner.art/stardew-valley-trees` | `the site’s [general Stardew Valley tree layout guide](/stardew-valley-trees) covers the common-tree and fruit-tree planning distinction;` / 1 |

引用边界：`Pine Tar` 直接承担 Cindersap Forest、Railroad、Carpenter’s Shop 三地点；`Pine Tree` 只承担泛 outside-farm 交互及 Pine-specific 施肥五天句；`Tree Fertilizer` 只承担已种下后的通用机制；`Trees` 只承担八邻格、普通树季节/地图限制和泛位置。未把 18/24/38/55 合并成未施肥固定成熟日，未把 Pine Tar 价格写成跨树收益排名。

## 6. 正文承诺与 post-classification

- **Post type：** evergreen how-to / troubleshooting guide。
- **Search intent：** informational + task completion；不是利润排行、百科全集或 planner 功能页。
- **唯一 ReaderTask：** 帮助 en-US 玩家识别 `Pine Cone → Pine Tree → Pine Tar`，在有效未锄地种下 Pine Cone，遇到 stage 4 时检查八邻格，区分未施肥与施肥成长条件，只在 Pine 成熟后选择 normal/Heavy Tapper，并用已核验用途决定是否保留。
- **正文最大真实结果：** stage-4 阻塞首先检查八个相邻格；五天只属于施肥后的普通 Pine 路径；Tapper 的五夜/两天是成熟后的生产间隔，不是树苗成熟时间。
- **绝对不能承诺：** 一个普适未施肥成熟日、最快/最佳树、跨树收益排名、Pine 固定物理 footprint、Pine Green Rain 转化、planner 自动模拟或页面已上线。

## 7. 自由生成的 10 组方向（先于公式归类）

以下 10 组先围绕同一个 ReaderTask 自由创作，生成时不标标题机制、不按六种机制配额；描述只补正文已给的方法或边界。

| # | Title direction | Description direction |
|---:|---|---|
| 1 | **Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar** | Plant a Pine Cone on valid ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures. |
| 2 | **Pine Cone to Pine Tar in Stardew Valley: The Checks Between** | Follow the Pine Cone-to-Pine-Tar chain: choose a valid tile, diagnose a stage-4 block, choose fertilized or unfertilized growth, then attach a Tapper after maturity. |
| 3 | **Why Your Pine Tree Stops at Stage 4 in Stardew Valley** | Check the mature tree in any of the eight adjacent tiles before blaming watering, fertilizer, Winter, or a single promised growth date. |
| 4 | **Pine Tree Stardew: Skip Watering, Check the Eight Neighbors** | Common Pine seedlings use tree-growth rules, not crop watering; this guide covers the stage-4 neighbor check and the map conditions that still matter. |
| 5 | **Pine Tree Stardew Valley: Five Days Only With the Right Growth Path** | Separate the fertilized five-day Pine path from unfertilized seasonal growth, then wait for maturity before using a normal or Heavy Tapper. |
| 6 | **A Pine Tree Tapper Plan for Stardew Valley Without a False Growth Date** | Use Pine Cone sources, valid planting rules, stage-4 diagnosis, Tapper intervals, and Pine Tar uses without turning conflicting medians into a guaranteed calendar. |
| 7 | **Pine Tar in Stardew Valley: When to Keep the Pine and When to Tap It** | Match Pine Cone, Pine Tree, and Pine Tar, compare normal and Heavy Tapper timing, and use Pine Tar’s verified jobs to guide the keep-or-chop decision. |
| 8 | **Pine Tree Stardew Guide: Planting Rules, Winter Growth, and Pine Tar** | Learn where a Pine Cone can be planted, why ordinary and fertilized growth differ, and how mature Pine Tappers continue producing through Winter. |
| 9 | **The Pine Tree Stage-4 Check Stardew Valley Players Miss** | Inspect diagonals as well as cardinal neighbors, separate a layout gap from fruit-tree spacing, and only then choose a growth method for the Pine. |
| 10 | **Pine Tree Stardew: What the Tapper Timer Does—and Does Not—Tell You** | Five nights and two days describe Pine Tar production after maturity, not how long a Pine Cone takes to become a tree; the guide shows the full chain. |

## 8. 后归类、七罪停留要素与两道检查

| # | 标题机制（后归类） | 停留要素 | 七类人性驱动（非配额） | 停留检查 | 适配检查 | 决策 |
|---:|---|---|---|---|---|---|
| 1 | 结论前置 | 异常、捷径 | 懒惰：少走弯路；愤怒：解决卡在 stage 4 的问题 | `stage 4` 是具体故障，`Tap Pine Tar` 是明确结果；不是泛泛“种树指南”。**PASS** | `Fix` 对应八邻格检查和移除/避开/重种动作；`Tap Pine Tar` 受成熟门槛和 Tapper 段落支持；无新增数字或收益。**PASS** | **KEEP** |
| 2 | 悬念场景 | 捷径、窥探 | 暴食：一次看完整条链 | “The Checks Between” 有链路信息差，但停留点略抽象。**PASS（弱）** | 链路每一步均在正文；无新承诺。**PASS** | HOLD |
| 3 | 悬念场景 | 异常、冲突 | 愤怒：为什么卡住 | stage 4 停滞是具体读者症状，能指向八邻格规则。**PASS** | `your` 直接点名遇到该症状的读者；`watering/fertilizer/Winter` 仅作为正文排错边界。**PASS** | KEEP |
| 4 | 结论前置 | 捷径、异常 | 懒惰：不要做无效浇水 | “Skip Watering” 与“Eight Neighbors”形成明确少走弯路。**PASS** | common Pine、不浇水、八邻格与地图限制均有正文支撑；无果树混用。**PASS** | KEEP |
| 5 | 反差数字 | 数字、异常 | 傲慢：纠正把五天当普适倒计时 | `five days` 与“right growth path”构成真实条件差异。**PASS** | 五天只绑定施肥普通 Pine；未施肥季节/地图例外保留。**PASS** | KEEP |
| 6 | 损失进入 | 捷径、终结 | 懒惰：避免错误日历；愤怒：避免计划失效 | “false growth date” 指向正文明确的 18/24/38/55 冲突。**PASS** | 没有宣称能给出另一套固定日期；标题略宽，含用途/来源支线。**PASS** | HOLD |
| 7 | 结论前置 | 金钱、冲突 | 贪婪：保留有用途的 Pine | keep/chop 与 Tapper 决策有具体后果，且 Pine Tar 价值边界形成信息差。**PASS** | 正文给出用途和成熟后 Tapper，但标题把两个决策并列，略扩大主意图。**PASS** | REJECT（范围偏宽） |
| 8 | 结论前置 | 异常、终结 | 懒惰：一次掌握条件 | Winter、fertilized/unfertilized、Pine Tar 均在正文；停留点可理解。**PASS** | “Winter Growth” 容易被读成普通 Pine 冬季普遍生长；正文只给施肥路径和地图例外。**FAIL → 淘汰** |
| 9 | 群体点名 | 异常、窥探 | 傲慢：纠正常漏查对角线 | “players miss” 对应正文“只查四方会漏掉对角树”。**PASS** | 群体状态有正文观察支撑；仍是 stage-4 主任务。**PASS** | KEEP |
| 10 | 自我颠覆 | 冲突、数字 | 傲慢：分清生产计时与成长计时 | “does—and does not” 直接制造真实概念冲突。**PASS** | `five nights`、`two days` 和成熟前置均逐字有正文支持；无生长承诺。**PASS** | KEEP |

**最终选择：#1。** 它同时满足主关键词自然出现、一个明确故障（stage 4）、一个明确结果（Pine Tar）、一个可执行方法（八邻格 + 成熟后 Tapper），且不把施肥五天、利润或 Winter 例外扩大成标题承诺。#8 被淘汰是因为标题表面可能制造“普通 Pine 冬季生长”的误读；#7 被淘汰是因为并列 keep/chop 与主任务相比过宽。

## 9. Stop / fit checks（选定组）

### 9.1 停留检查：PASS

目标读者看到 `stage 4` 会停留，因为这是正文中可观察的具体故障，不是泛泛“树怎么种”；看到 `Tap Pine Tar` 会知道点击后有明确产出结果。停留理由分别指向锁正文 `## Fix a Pine seedling that stops at stage 4`（八邻格、对角线、移除/避开/重种）和 `## Tap a mature Pine and collect Pine Tar through Winter`（成熟门槛、normal/Heavy interval、Winter production）。

### 9.2 适配检查：PASS

- **数字：** 选定标题没有数字；描述没有新数字。正文中的五夜/两天只在 body 与候选解释中保留，不被最终标题强行概括。
- **结果：** `Fix Stage 4` 指向正文给出的诊断和处理动作，不承诺所有停滞原因都由一项操作解决；`Tap Pine Tar` 只发生在成熟 Pine + Tapper 条件下。
- **对象：** `Pine Tree Stardew Valley` 直接点名 en-US Pine Tree / Pine Cone / Pine Tar 读者，不扩大为所有树或所有成长问题。
- **方法：** 描述写明 valid, untilled ground、skip watering、all eight neighbors、mature Pine；这些均在锁正文中可回读。
- **情绪：** 只有具体故障和少走弯路，没有“fastest/best/easy/guaranteed/profitable”或作者经历；未超过正文语气。

## 10. 最终 SEO 字段与 post handoff

```text
Title:       Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar
H1:          Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar
Description: Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.
Slug:        pine-tree-stardew
Locale:      en
Country:     US
Topic:       Stardew Valley Guides
OG title:    same as Title unless existing metadata template requires an equivalent display string
Body hash:   3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1
Body count:  2478 qualified mechanical English units
```

Title 字符数 `54`；Description 字符数 `161`。Title/H1 字节相同，符合项目 `BlogPostMeta.title` 同时驱动标题/H1/card/headline 的接口事实；slug 使用已由 ProjectInterfaceSpec 锁定的 `pine-tree-stardew`，没有临场更改 URL。

## 11. 交给 E-title 的独立复核包

**状态：PENDING E-title；本 F 未宣布标题/SEO 通过。** 请 E-title 读取以下完整输入并只报告问题、建议和结论：

1. `locked/en-body.txt`，bodyHash `3b53cbcd…`，qualified count `2478`；
2. 本报告的 10 组自由方向、后归类表、stop/fit checks 和最终 Title/H1/Description/slug；
3. D-en report `610156…` 与 E-en report `bd4844…`，确认同一 C hash `b847…`；
4. 第 5 节 `PublicReference` map，逐项核对 `quote`、`occurrence`、URL 与选定 SEO 表面支持；
5. 同站同语 EN 近期标题去套路基线（实际读取 source registry）：
   - `Do You Have to Water Trees in Stardew Valley? Check Stage 4 and the Fruit-Tree 3×3`
   - `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150`
   - `Last Day to Plant in Stardew Valley: Parsnips by Spring 24`

E-title 应复核：标题停留理由是否具体、主意图是否仍是 Pine Cone → Pine Tree → Pine Tar、标题/描述是否逐字兑现正文、描述是否新增未核验承诺、与最近标题是否套路重复，以及 `Title = H1` / slug / bodyHash 绑定是否保持。若 E-title 发现实质正文缺口，撤销本锁并退回 A/B/C → D/E；F 不改正文绕过。

## 12. F 写后只读回执计划

写入后必须再次执行并保留真实输出：

```sh
python3 - <<'PY'
from pathlib import Path
import unicodedata
p = Path('docs/blog-ops/pine-tree-stardew/locked/en-body.txt')
s = p.read_text(encoding='utf-8')
assert unicodedata.is_normalized('NFC', s)
assert s.endswith('\n')
print('locked_nfc_lf=PASS', 'bytes=', p.stat().st_size)
PY
shasum -a 256 docs/blog-ops/pine-tree-stardew/locked/en-body.txt
awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/F-en-lock.md
 git diff --check -- docs/blog-ops/pine-tree-stardew/locked/en-body.txt docs/blog-ops/pine-tree-stardew/F-en-lock.md
```

锁定 body 或本报告以外的目标文件不得新增；media/page/build/deploy 仍不在本 F 写入边界。
