# D-zh 独立全量复跑：`pine-tree-stardew`（zh-CN）

- **角色：** Agent D-zh；本报告只检查当前 C-zh，不改正文，不改 A/B/supplement/spec/E，不生成媒体，不跑浏览器、build、typecheck、Vitest、deploy、commit、push 或外部写入。
- **复核日期：** 2026-09-22（Asia/Shanghai）。
- **绑定版本：** `docs/blog-ops/pine-tree-stardew/C-zh-draft.md` raw SHA-256 = **`b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2`**；NFC/LF SHA-256 同值。C 再改动后，本报告结论全部失效，必须按新 hash 重跑。
- **读者正文范围：** `C-zh-draft.md:5–106`；`C-zh:93–105` 的 `## 来源` 是允许的公开来源模块；`C-zh:1–3` 是编辑头，`C-zh:109–221` 是编辑附录，均不作为读者正文。图 alt/caption 是图文边界检查对象，不把它们误计为普通正文段落。
- **本轮输入：** 读取当前 `C-zh`、`A-zh`、`A-zh-supplement`、`B-zh`、`A-media`、`project-interface-spec`、旧 `D-zh`/`E-zh` 和 V7 `02-内容生产与质量门.md`、`03-博客页面生成整合.md`、`04-公开交接与页面装配.md`。旧 D/E 只用于确认本轮需要重新检查的边界；以下结论和输出均重新针对当前 C hash 执行，不沿用旧 PASS/FAIL。
- **读取时输入 hash：** A-zh `87e990e7e6f697d07b9831705fd3c92e187277bd0809b807115b6b75b42d3157`；A-zh-supplement `b03b80722b771d07ff8cf0e75762104a7625c8ff6350305d1fe5806f6ed92429`；B-zh `9a843d0a850dbbdba5b63d61e7394d0109b716012fd7fab9dcf5a1b3056c4213`；A-media `34feee6056dc7bcf877526e90eb92c7711c44dd97903e82b3645f5be381c8202`；ProjectInterfaceSpec `055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f`；读取时旧 D-zh `e5d00c1b38459452fcc43114b450bf6939c3d2a330625185838bc2af425cf89e`；读取时旧 E-zh `16a1c27e2f2e00087341c7b1ab6c8134214da760b53f7edd1c675bd98ac8c35f`。
- **写入边界：** 本次仅覆盖 `docs/blog-ops/pine-tree-stardew/D-zh-check.md`；不写 C/A/B/supplement/E/spec、source、public、tests、package、媒体、临时文件或 git 元数据。

## 总结结论

**D-zh 三门独立全量复跑：PASS。** ResearchTrace、ReaderValue、Repetition 均基于绑定的 C raw hash 重新执行并有真实退出码；E-zh 要求的 F-01/F-04 保守边界、不可直接移动树苗、松焦油近邻链接、无 FAQ/CTA/作者过程残留均通过。文字图位通过，但 A-media 计划的六个媒体文件全部缺失，资产门只能是 **UNVERIFIED**，不能将 Markdown 图位误报为实际媒体 PASS；机械 2000 汉字为 **PASS（2491 个合格汉字，仅机械可行性）**。

| 检查项 | 独立结论 | 当前依据与剩余边界 |
|---|---|---|
| ResearchTrace | **PASS** | 读者正文的研究日志、SERP/PAA、作者过程、内部路径/ID 三类扫描均 0 命中；公开来源和图文真实性边界未误杀。 |
| ReaderValue | **PASS** | `C-zh:5–91` 仍围绕松果→普通松树→成熟采集→松焦油；种植前提、第 4 阶段排错、季节/树肥/地图、规划器能力边界和 5/2 天采集器终点均有读者可执行信息；未扩成 FAQ、收益百科或产品驱动任务。 |
| Repetition | **PASS** | 读者正文 23 个块无精确重复、无阈值近重复、无 FAQ 标题；参数表、图注和结尾清单作用不同。 |
| 图文教学（文字图位） | **PASS** | `C-zh:22–24` 的对象链图位、`C-zh:51–53` 的八邻格排错图位均紧邻对应步骤，有读者向 alt/caption，并声明示意图边界。 |
| 图文教学（实际资产） | **UNVERIFIED** | 封面、两张正文 WebP 及三个 AVIF 兄弟文件均 `MISSING`；未证明尺寸、VP8/AVIF、字节预算、授权、画面内容或页面显示。 |
| 机械 2000 汉字可行性 | **PASS（机械）** | 按 V7 `正文计数.py` 规则剔除交接头、标题、来源、编辑附录、alt/caption 后为 2491；不等于 F 的最终 Length 锁稿通过。 |
| 25 条 quote/occurrence | **PASS** | 当前 C 附录共 25 条定位，规范化读者 Markdown 中全部至少 1 次命中，`quote_validator_exit=0`；同一 quote 出现 2 次时，附录要求的 `occurrence: 1` 仍指向首个规范化出现位置。 |

## 1. ResearchTrace：PASS

### 检查范围与规则

按 V7 `02-内容生产与质量门.md:76–84`、`03-博客页面生成整合.md:31–37` 和 `04-公开交接与页面装配.md:31–45`，扫描当前读者正文 `C-zh:5–106`，另行保留公开来源模块与图文真实性说明。扫描关注：检索日志、SERP/PAA/搜索结果、研究过程、作者过程、给作者的范围指令、内部文件路径、门名称、PublicReference/occurrence、项目 ID 或私有路径；不会因为合法“来源”链接或“示意图/不是游戏截图”等必要边界而误判。

真实命令是一个只读 `python3` heredoc：读取 `C-zh-draft.md`，在 `## 编辑附录（不是读者正文）` 前截取读者面，跳过图片 alt/caption 后按三组正则扫描；退出码由 `trace_fail == 0 and reader_value_fail == 0` 断言决定。实际输出：

```text
research/log PASS hits=0
author/process PASS hits=0
internal paths/ids PASS hits=0
author_process_word_scan PASS hits= 0
quality_assertions_exit= 0
quality_check_exit=0
```

当前没有命中 `搜索时`、`SERP`、`PAA`、`检索日志`、`搜索结果`、`研究记录`、`作者`、`写作指令`、`C-zh/A-zh/B-zh/D-zh/F-zh`、`V7`、`PublicReference`、`occurrence`、`/Users/`、`docs/`、`src/` 等过程或内部标记。`C-zh:93–105` 仅为公开来源标题/URL和说明，属于 V7 允许的读者向引用模块。

## 2. ReaderValue：PASS

### 2.1 主任务与结构回读

重新检查当前 C 的读者结构，输出的关键检查均通过：

```text
seed/object chain PASS missing=[]
planting prerequisites PASS missing=[]
stage-four troubleshooting PASS missing=[]
season/tree fertilizer PASS missing=[]
harvest endpoint PASS missing=[]
tool boundary PASS missing=[]
figure_slots [(22, '图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。', '/blog/illustrations/pine-tree-seed-to-tar.webp'), (51, '示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。', '/blog/illustrations/pine-tree-stage-four-neighbor.webp')]
reader_value_failures= 0
reader_value_exit= 0
quality_check_exit=0
```

当前正文的读者任务仍是单一主链：先识别松果、松树与松焦油；再按区域检查种植格和地图限制；普通树不按作物浇水，也不套果树 3×3；第 4 阶段先检查八邻格成熟普通树，再检查季节、树肥和地图；成熟后用普通/重型树液采集器按 5 天/2 天取得松焦油；最后用检查表复核。规划器只保留布局示意能力边界，没有改写主意图。

### 2.2 E-zh 修复回归的原句定位

以下均是当前 `C-zh` 的实际原句和位置，不沿用旧报告判断：

1. **F-01 保守边界：PASS。** `C-zh:32` 原句为：
   > 种松果时要按区域检查位置：农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子；农场内则按当前中文[松果](https://zh.stardewvalleywiki.com/松果)页的口径检查格子未被占用、属于可耕种格，而且没有被锄头开垦。

   当前文字把农场外“不需要先锄地/不得放在已锄格”和农场内“按当前中文松果页口径”分开，没有把“未用锄头”扩成无条件的全地图版本。`C-zh:34` 另保留官方 1.6 的“不能在城镇或海滩农场的隧道里种树”边界。

2. **F-04 保守边界：PASS。** `C-zh:61` 原句为：
   > 农场外的自然松树是另一条使用路径。中文[松树](https://zh.stardewvalleywiki.com/松树)页面列出煤矿森林、铁路、木匠商店周围等自然区域的松树可以砍伐或挂采集器；如果清除树和树桩，且原格没有被占用，公开来源记载该位置可能重新生成小树。但中文松树专页与泛《树》页对自然树重生阶段的口径不一致，本文不发布阶段数字，也不把这条自然树规则扩展成种植许可。若你要处理的是城镇或海滩农场隧道，优先遵守上面的 1.6 地图限制。

   当前读者正文没有 `第 2 阶段` 或 `第 3 阶段` 的自然树数字，明确保留来源冲突，且没有把自然树重生扩成种植许可。

3. **不可直接移动树苗：PASS。** `C-zh:45` 原句为：
   > 找到成熟邻树后，先清掉它；若必须换位，先清除或砍掉树苗，再在合规位置重新种下；或者只把成熟邻树与新种树苗错开。之后重新观察成长阶段。

   当前没有“直接移动/移动树苗”措辞；修正动作明确为清除或砍掉后重新种下，或仅调整成熟邻树与新种树苗的相对位置。

4. **松焦油近邻链接：PASS。** `C-zh:82` 原句为：
   > [松焦油](https://zh.stardewvalleywiki.com/松焦油)页面列出了这件物品的基础售价；但这个价格不能单独推出“松树最赚钱”，本文没有统一条件下的树木收益比较来源。

   基础售价主张紧邻描述性松焦油链接；“松树最赚钱”被保留为没有统一比较来源的否定边界，没有伪装成来源原句。

5. **无 FAQ/CTA/作者过程词：PASS。** 当前读者正文真实扫描输出：

   ```text
   faq_occurrences 0
   planner_cta_occurrences 0
   author_process_word_scan PASS hits= 0
   ```

   `/zh/stardew-valley-trees` 是补充内容页链接及规划器能力边界，不是 `/zh#planner` CTA；后续页面 `BlogSources` CTA 槽位不在本 D 的正文通过范围内。

### 2.3 读者链接 allowlist

只读抽取当前 C 读者面 11 个唯一 URL，与 B-zh/A-media/ProjectInterfaceSpec 允许的中文 Wiki、官方 changelog、本站树木页和两张计划正文图路径比对：

```text
unique_url_count 11
unknown_urls []
public_link_allowlist_exit= 0
public_link_check_exit=0
```

## 3. Repetition：PASS

### 独立块比较

将读者正文（不含来源与编辑附录）拆成 Markdown 段落/表格/列表块，去除图片路径和普通链接语法后，做精确重复与阈值近重复比较；FAQ 标题另行扫描。真实命令退出码为 0，输出如下：

```text
reader_body_blocks 23
exact_duplicate_blocks {}
faq_headings []
near_duplicate_pairs []
repetition_assertions_exit= 0
repetition_check_exit=0
```

当前 `C-zh:69–74` 的设备表/说明负责 5 天与 2 天参数辨识，`C-zh:84–91` 的检查表负责收尾复核；`C-zh:22–24`、`51–53` 的图注分别承担对象链和八邻格视觉边界，不属于同作用重复。未发现需要交 C 修复的范围内重复块。

## 4. 25 条 quote/occurrence 定位：PASS

### 验证规则

按 V7 `04-公开交接与页面装配.md:31–39`，解析当前 C 编辑附录的 `id`、`quote`、`occurrence`；对 NFC/LF 规范化后的读者 Markdown（编辑附录之前）按原始连续片段查找，`occurrence` 从 1 开始。此检查只验证当前 C 的 25 条定位是否仍存在并指向规范化正文；不把旧 C 或旧 D/E 的定位当作证据。

真实命令为只读 `python3` heredoc（解析 25 个 `quote`，逐条输出 append 行、命中次数和正文行）：

```text
raw_sha256= b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2
nfc_lf_sha256= b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2
refs= 25
01 wiki-zh-pine-tree appendix:121 count=2 lines=[5, 33] expected_occurrence=1 PASS quote='松树属于普通树'
02 wiki-zh-pine-tree appendix:123 count=1 lines=[20] expected_occurrence=1 PASS quote='成熟松树掉在地上的未发芽松果'
03 wiki-zh-pine-tree appendix:125 count=1 lines=[61] expected_occurrence=1 PASS quote='可以砍伐或挂采集器'
04 wiki-zh-pine-cone appendix:132 count=1 lines=[32] expected_occurrence=1 PASS quote='农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子'
05 wiki-zh-pine-cone appendix:134 count=1 lines=[32] expected_occurrence=1 PASS quote='格子未被占用、属于可耕种格，而且没有被锄头开垦'
06 wiki-zh-pine-cone appendix:136 count=1 lines=[20] expected_occurrence=1 PASS quote='采集等级达到 1 后摇晃或砍倒松树'
07 wiki-zh-pine-cone appendix:138 count=1 lines=[20] expected_occurrence=1 PASS quote='成熟松树掉在地上的未发芽松果'
08 wiki-zh-pine-cone appendix:140 count=1 lines=[20] expected_occurrence=1 PASS quote='杂货店不卖松果'
09 wiki-zh-trees appendix:147 count=1 lines=[33] expected_occurrence=1 PASS quote='不需要像作物那样每天浇水'
10 wiki-zh-trees appendix:149 count=1 lines=[33] expected_occurrence=1 PASS quote='普通树不要求周围土地全部清空'
11 wiki-zh-trees appendix:151 count=1 lines=[40] expected_occurrence=1 PASS quote='树苗就会永远停在第 4 阶段'
12 wiki-zh-trees appendix:153 count=1 lines=[40] expected_occurrence=1 PASS quote='成熟树占据树苗八邻格时阻止继续成长'
13 wiki-zh-trees appendix:155 count=1 lines=[57] expected_occurrence=1 PASS quote='在非冬季每晚约有 20% 的机会进入下一阶段'
14 wiki-zh-tapper appendix:162 count=1 lines=[5] expected_occurrence=1 PASS quote='普通采集器 5 天'
15 wiki-zh-tapper appendix:164 count=1 lines=[74] expected_occurrence=1 PASS quote='挂在松树上的采集器冬季继续工作'
16 wiki-zh-tapper appendix:166 count=1 lines=[71] expected_occurrence=1 PASS quote='配方从采集等级 4 开始'
17 wiki-zh-heavy-tapper appendix:173 count=1 lines=[5] expected_occurrence=1 PASS quote='重型采集器 2 天'
18 wiki-zh-tree-fertilizer appendix:180 count=1 lines=[59] expected_occurrence=1 PASS quote='必须施在已经种下的树种、树苗或小树上'
19 wiki-zh-tree-fertilizer appendix:182 count=1 lines=[59] expected_occurrence=1 PASS quote='对普通树来说，树肥可以让它在冬季继续推进'
20 wiki-zh-tree-fertilizer appendix:184 count=1 lines=[59] expected_occurrence=1 PASS quote='果树和茶树不适用'
21 wiki-zh-pine-tar appendix:191 count=1 lines=[80] expected_occurrence=1 PASS quote='松焦油有明确用途'
22 wiki-zh-pine-tar appendix:193 count=1 lines=[80] expected_occurrence=1 PASS quote='工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务'
23 wiki-zh-pine-tar appendix:195 count=1 lines=[82] expected_occurrence=1 PASS quote='页面列出了这件物品的基础售价'
24 official-1-6-changelog appendix:202 count=1 lines=[34] expected_occurrence=1 PASS quote='不能在城镇或海滩农场的隧道里种树'
25 site-zh-general-trees appendix:209 count=1 lines=[63] expected_occurrence=1 PASS quote='规划器可以帮助你做布局示意'
quote_validator_failures= 0
quote_validator_exit= 0
```

第 1 条 `松树属于普通树` 当前出现两次，附录 `occurrence: 1` 指向 `C-zh:5`，其余 24 条均为一次命中；没有 0 命中或错误 occurrence。

## 5. 图文教学与六文件媒体边界

### 5.1 文字图位：PASS

- **图 1：** `C-zh:22–24` 位于 H2-1 对象关系表之后，alt 说明松果→普通树→成熟松树→树液采集器→松焦油，caption 明确是规则关系示意图、不表示固定成长天数或收益排名。
- **图 2：** `C-zh:51–53` 位于八邻格排错段之后，alt 说明中心树苗、八邻格、成熟邻树阻挡第 4 阶段，caption 明确留一格是布局做法，不是果树 3×3 规则；alt 还明确不是游戏截图或物理碰撞框。

### 5.2 实际媒体：UNVERIFIED

按 A-media 和 ProjectInterfaceSpec 的六个计划路径执行只读存在性检查，真实输出：

```text
MISSING	public/blog/pine-tree-stardew-cover.webp
MISSING	public/blog/pine-tree-stardew-cover.avif
MISSING	public/blog/illustrations/pine-tree-seed-to-tar.webp
MISSING	public/blog/illustrations/pine-tree-seed-to-tar.avif
MISSING	public/blog/illustrations/pine-tree-stage-four-neighbor.webp
MISSING	public/blog/illustrations/pine-tree-stage-four-neighbor.avif
media_presence_check_exit=0
```

`exit=0` 只表示存在性循环正常完成，不表示资产通过；六个文件均缺失，因此本 D 不声称尺寸 `1672×941`、封面 `≤1.25 MiB`、正文图 `≤400 KiB`、损耗 `VP8 `、AVIF `ftypavif`、授权/署名、画面真实性、页面加载或桌面/移动端显示。缺失项交 A-MEDIA/G，不能通过“已有 Markdown 图位”替代。

## 6. 机械 2000 汉字：PASS（仅机械）

使用 V7 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py` 的 `normalized`、`extract_body`、`count_units`；输入先排除 C 交接头、`## 来源`、`## 编辑附录（不是读者正文）` 和 `*图` caption，再由脚本排除标题、图片 alt、Markdown 非正文行，locale=`zh-CN`。真实输出：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客二/docs/blog-ops/pine-tree-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2491,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "excluded": [
    "C preface/header",
    "来源",
    "编辑附录",
    "headings",
    "image alt/caption"
  ],
  "omitted_line_counts": {
    "headings": 7,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 36,
    "frontmatter": 0
  },
  "sha256_raw": "b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2",
  "sha256_nfc_lf": "b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2"
}
mechanical_length_check_exit=0
```

2491 只证明当前候选在指定机械规则下超过 2000 汉字；不证明语义去重、最终 Length、SEOTruth、标题/描述、正文锁定、页面投影或用户终审。

## 7. 仓库状态、差异和写入证据

### 7.1 写前基线（真实回读）

写入前执行 `git status --short --untracked-files=all`、`git diff --name-status` 和 `git diff --check`：目标目录原有 13 个未跟踪文件，普通 `git diff --name-status` 为空，`git diff --check` 退出码为 0。目标目录本身未被 Git 跟踪，因此普通 diff 不展示这些 Markdown 内容，必须结合路径清单和 hash 回读。

### 7.2 写后回读命令

本报告写入后应执行以下只读命令；本节记录真实结果：

```sh
awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/D-zh-check.md
# exit=0；无尾空格输出

git diff --check
# exit=0；无输出

git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/D-zh-check.md
# exit=1；EXPECTED_NEW_FILE_DIFF（目标目录未跟踪新文件的差异状态），无 whitespace 诊断

git diff --name-status
# 空输出；目标目录为未跟踪文件，普通 diff 不展示内容

git status --short --untracked-files=all
# 目标目录仍只有写前已有的 13 个路径，未出现目录外路径
```

输入保护 hash 在写前后回读时保持：C-zh `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2`；A-zh `87e990e7e6f697d07b9831705fd3c92e187277bd0809b807115b6b75b42d3157`；A-zh-supplement `b03b80722b771d07ff8cf0e75762104a7625c8ff6350305d1fe5806f6ed92429`；B-zh `9a843d0a850dbbdba5b63d61e7394d0109b716012fd7fab9dcf5a1b3056c4213`；A-media `34feee6056dc7bcf877526e90eb92c7711c44dd97903e82b3645f5be381c8202`；ProjectInterfaceSpec `055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f`。没有执行 staging、commit、push、deploy、浏览器、build、测试或任何外部写入。

## 8. 未证明边界与后续路由

- 六个计划媒体文件缺失：资产尺寸、格式、字节预算、AVIF、授权、画面内容和真实页面显示仍 **UNVERIFIED**，交 A-MEDIA/G。
- 2491 是机械计数：F 仍需在 D/E 通过同一 C hash 后执行淬文、NFC/UTF-8 锁定和最终 Length；本报告不发 F 锁稿结论。
- 本报告不审核最终 Title/H1/Description、FAQ/Schema、author/date、canonical、metadata、真实路由、页面渲染、浏览器、部署、生产状态或用户终审。
- 目标页面和媒体未进入 source/public/tests；本报告不声称 PublicBlogHandoff、页面装配或发布完成。

**最终 D-zh 判定：绑定 `C-zh` hash `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2` 的 ResearchTrace、ReaderValue、Repetition 三门均 PASS；文字图位 PASS；六个实际媒体文件 UNVERIFIED；机械 2000 汉字 PASS（2491）；其他页面/SEO/锁稿/部署边界未证明。**
