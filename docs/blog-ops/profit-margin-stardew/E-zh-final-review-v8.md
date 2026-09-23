# E-zh 最终独立内容审核 v8 — REVISE

- **审核日期：** 2026-09-22（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **前置依赖：** `D-zh-final-check-v8.md` 已存在；本审核独立读取 C、A-zh、B-zh、接口规格、V7 22 条规则和当前公开 Wiki，不把 D 的 PASS 当作 E 证据。
- **写入边界：** 本次只写入本报告；未修改 C、A/B、D、接口规格、源码、媒体、配置、依赖、数据库或外部服务；未运行 browser/page assembly/build/typecheck/test/deploy；未 commit/push；未 spawn worker。

## 1. 最终结论

**REVISE。** C 的多人存档事实修复已通过独立回读：非 100% 档位的单人玩法路径现在明确为“合作”/`Host New Farm` 创建多人存档，再由房主单独游玩；C:5、C:86–C:95、Figure 2 事实语义、C:105–C:115 均已覆盖。唯一需要返 C 的问题是 Figure 2 reader-facing alt/caption 中的机械英语：`create multiplayer save` 不是页面上的 UI 标签，且 `Multiplayer#Profit_margins` 是原始 fragment 表达，不是自然的读者-facing中文来源名称。

最小返修仅改 C:101、C:103：将 `create multiplayer save`（及其重复中文释义）改为自然的“创建多人存档”，将 `Multiplayer#Profit_margins` 改为 `Multiplayer（Profit margins）` 或完整页面名称。不要改动已通过的价格边界、多人存档路径和正文范围。

| 审核面 | 结果 | 精确证据 |
|---|---|---|
| C SHA 绑定 | **PASS** | `8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045`，与任务期望完全一致。 |
| V7 `zh-CN` 合格计数 | **PASS** | `mechanical_units=2295`，排除 `Sources`，位于 `2000–2300`。 |
| E v6 三处问题 | **PASS** | C:24 使用“按0.75倍计算/列出的种子”；C:50 含“工具升级”；C:61 为完整自然句。 |
| E v7 多人存档阻塞 | **PASS** | C:7、C:88、C:93–C:95、C:101、C:103、C:107、C:111、C:115 均给出非 100% 的多人存档前提和房主单独游玩路径。 |
| Figure 2 事实完整性 | **PASS** | 100% → `New Game`；非 100% →“合作”/`Host New Farm` →多人创建→创建多人存档。 |
| Figure 2 alt/caption 自然度 | **REVISE** | C:101、C:103 的 `create multiplayer save` 和 `Multiplayer#Profit_margins` 是机械/非 UI 的英语表达。 |
| 价格、公式、边界 | **PASS** | C:13–C:18、C:20、C:28–C:46、C:50、C:111–C:115。 |
| H1/SEO usefulness | **PASS（正文范围）** | C:1 与 B-zh 工作 H1 完全一致；定义、四档、边界、选择和设置路径均覆盖。最终 metadata 仍属下游未验证。 |
| 来源/内链/卫生 | **PASS（静态内容）** | 四个公开 Wiki URL 可达，Sources 各列一次；站内内链出现一次；无私有路径、秘密或内部流程词。 |
| 22 条鉴文规则 | **REVISE（仅第 19 条）** | 其余规则通过或按体裁 N/A；第 19 条被 Figure 2 reader-facing 文案阻塞。 |
| 页面、媒体、构建、测试、部署 | **UNVERIFIED（范围外）** | 本任务明确禁止这些工作。 |

## 2. 版本绑定和静态计数证据

### 2.1 当前 C SHA

执行：

```sh
shasum -a 256 docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实输出：

```text
8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

### 2.2 V7 正文计数

执行：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

真实关键输出：

```json
{
  "locale": "zh-CN",
  "mechanical_units": 2295,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["Sources"],
  "sha256_raw": "8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045",
  "sha256_nfc_lf": "8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045"
}
```

`requires_independent_review` 是脚本的保守标记，不是失败；本报告完成独立语义审核。

### 2.3 输入版本

本次实际读取的关键输入 SHA：

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  B-zh-layout.md
03315e68038236d42c3bd1bb927d57bfc455329a92814d541ac6477df3cce103  D-zh-final-check-v8.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  project-interface-spec.md
2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1  /Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

## 3. 非 100% 档位的多人存档事实回归

### 3.1 当前公开来源

四个当前公开页面均以 `curl -L --fail` 取得 HTTP 200 且最终 URL 未变：

```text
https://zh.stardewvalleywiki.com/选项                 200
https://stardewvalleywiki.com/Options                 200
https://stardewvalleywiki.com/Multiplayer#Profit_margins 200
https://stardewvalleywiki.com/Getting_Started          200
```

当前 English Multiplayer 的相关正文写明：创建新的 multiplayer save 时可选 25%、50%、75% 或默认 100%；多人新世界路径从标题界面的 `Co-Op`、`Host`、`Host New Farm` 开始；房主可以单独游玩该多人存档。English/Chinese Options 支持扳手/`Advanced Options`、四档和价格定义；Getting Started 支持角色创建扳手中的 Advanced Options。四页没有把 Multiplayer 的存档类型前提取消或改成普通 `New Game` 路径。

### 3.2 当前 C 的完整路径

| 位置 | 结果 | 真实行证据 |
|---|---|---|
| C:5–C:7 | **PASS** | C:5 定义价格倍率；C:7 明确 25%/50%/75% 位于新建多人存档流程，想单独游玩非 100% 时先由“合作”/`Host New Farm`创建，再由房主单独游玩。 |
| C:86–C:95 | **PASS** | C:88 分成 100% 的 `New Game` 支线和非 100% 的“合作”/`Host New Farm`多人创建支线；C:92–C:95 逐步写出扳手、`Advanced Options`、`Profit Margin`、创建多人存档及房主单独游玩。 |
| Figure 2 C:99–C:103 | **PASS（事实）** | C:101/C:103 均保留 100% 与非 100% 双支，并明确非 100% 创建多人存档；语义没有回退为普通新游戏可选四档。 |
| C:105–C:107 | **PASS** | 找不到入口时，C:107 要求非 100% 返回“合作”/`Host New Farm`的多人创建流程，而不是继续猜测平台按钮。 |
| C:109–C:115 | **PASS** | C:111 和 C:115 再次确认 100%/非 100% 分支、多人存档和房主单独游玩。 |

C 采用 `合作`/`Host New Farm` 的高层、平台中立写法，符合 B-zh 的范围约束；当前任务要求的“非 100% 先走多人存档、再单独游玩”已经完整出现。没有把旧存档编辑、Mod、平台专属按钮或固定收益承诺带入正文。

## 4. E v6/v7 问题和指定回归

| 历史问题 | 结果 | 当前证据 |
|---|---|---|
| E v6：价格表必须写“计算” | **PASS** | C:15–C:18 为“按标准倍率计算/按四分之三计算/按一半计算/按四分之一计算”。 |
| E v6：`相关种子`过宽 | **PASS** | C:24 改为“列出的种子”；C:28、C:32、C:38 继续使用“指定/列出的”边界。 |
| E v6：Figure 1 alt 缺“工具升级” | **PASS** | C:50 明确“建筑、工具升级和任务金币奖励”。 |
| E v6：C:60 句法不完整 | **PASS** | C:61 为“受影响的卖价与列出的种子价格都会降低，但仍保留标准玩法的框架”；C:62 的挑战取舍句也完整。 |
| E v7：非 100% 多人存档前提缺失 | **PASS** | 见第 3 节；C:7、C:88–C:95、C:101–C:115 均已回归。 |
| C:13–C:18 | **PASS** | 四档表保留四种倍率含义，没有把 Profit Margin 写成全局经济乘数。 |
| C:26/C:28 | **PASS** | “大多数”“指定商品”没有扩写成全部商店；C:46 对未知价格保留待核验分支。 |
| C:38/C:50/C:111 | **PASS** | 不受影响范围分别写为部分商店商品、建筑、工具升级、任务金币奖励；Figure 1 alt 同样精确。 |
| C:70 | **PASS** | `/zh/how-to-earn-money-stardew` 只出现一次，且只作预算背景。 |

## 5. Figure 1/2 和 reader-facing alt/caption

### 5.1 Figure 1

**PASS。** C:48–C:52 的位置、图位 ID、alt、caption 都服务价格边界；C:50 的 `Profit Margin`、`Pierre`、`Joja`、`Wheat`、`Crab Pots` 属于必要游戏术语/实例，不是无意义的机械中英混排。C:50 明确工具升级，C:52 同时保留 Wheat `25g → 6g` 和 Crab Pots `1,500g`，没有新增未核验类别。

### 5.2 Figure 2 事实

**PASS。** C:99–C:103 的图位处于路径之后、创建前三项检查之前；C:101/C:103 都保留 100% 与非 100% 两支，写出非 100% 多人创建存档和房主单独游玩所需语义，并明确平台中立、不是实机截图。

### 5.3 Figure 2 文案自然度

**REVISE（唯一返修项）。**

- **C:101：** `执行 \`create multiplayer save\`（创建多人存档）`。`create multiplayer save` 不是当前公开页面给出的按钮名，也不是需要保留的英文术语；把动作写成代码格式再补中文释义，会让 alt 像内部流程指令。
- **C:103：** 同样重复 `create multiplayer save`；`公开 Options、Multiplayer#Profit_margins 与 Getting Started 页面` 中的 raw fragment 也不像自然的读者-facing来源名称。

最小建议（不改变事实）：

```text
C:101：……在 `Profit Margin` 中选择档位并创建多人存档。

C:103：……`Profit Margin` → 创建多人存档。依据 Stardew Valley Wiki 的 Options、Multiplayer（Profit margins）和 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。
```

`New Game`、`Advanced Options`、`Profit Margin` 和 `Host New Farm` 是 UI/设置名称，可以保留反引号；不要把普通动作“创建多人存档”伪装成英文 UI 标签。

## 6. 价格、公式、SEO、来源和卫生

### 6.1 价格和公式

**PASS。**

- C:15–C:18 保留普通/100%、75%、50%、25% 四档，写法是价格倍率而非现实净利润。
- C:20 的英文 Options 事实为售出物品和种子价格倍数、分数价格截断为整数且不低于 1g。
- C:36 的 Wheat 示例为 `25g × 25% = 6.25g`，截断后显示 `6g`；C:42 的 Willy `Crab Pots` 仍为 `1,500g`。
- C:28–C:46、C:111–C:113 保留多数/指定商品与固定类别边界，不把单个例子外推为全商店规则。

### 6.2 H1、SEO usefulness 和意图

**PASS（正文范围）。** C:1 与 B-zh:22 完全一致：`星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选`。C:3、C:11、C:26、C:54、C:86 依次覆盖定义、四档、边界、条件选择和设置入口；首段 C:5 直接回答主问题，没有先放 CTA、研究日志或竞品内容。最终 Title/Description、canonical、hreflang、schema、PublicBlogHandoff 和页面壳仍不在本审核范围。

### 6.3 公开来源和站内内链

C 中四个 Wiki URL 的静态计数为：

```text
https://zh.stardewvalleywiki.com/选项                  3
https://stardewvalleywiki.com/Options                  3
https://stardewvalleywiki.com/Multiplayer#Profit_margins 5
https://stardewvalleywiki.com/Getting_Started           2
```

`Sources` 中四个 URL 各出现一次（C:123–C:126）；没有论坛、Reddit、Steam、Mod、搜索结果、内部研究 URL 或私有路径。唯一站内内链 `/zh/how-to-earn-money-stardew` 只出现一次（C:72），并可在以下当前源码位置回读：

```text
src/blog/blog-post-identities.ts:14
src/blog/blog-copy.ts:136
src/blog/blog-post-registry.tsx:549
```

这证明静态 identity/copy/registry 真实性，不证明 live HTTP、页面装配或生产部署。

### 6.4 编码、泄漏和静态结构

独立扫描结果：

```text
h1=1, h2=6, h3=12, h4_plus=0
fig-01-price-boundary=1 at C:48
fig-02-advanced-options-path=1 at C:99
utf8_strict=PASS
bom=False
crlf_count=0
standalone_cr_count=0
nul_count=0
ends_with_lf=True
nfc_lf_equal_raw=True
trailing_whitespace=[]
private_absolute_paths=[]
local_service_addresses=[]
secret_markers=[]
```

Figure 2 的 `create multiplayer save` 是本次唯一被命中的扫描词，但它是机械文案问题，不是私有流程或秘密泄漏。其余 `https://` 公开来源和 `/zh/...` 合法站内路径不属于泄漏。

## 7. V7 22 条鉴文规则逐项结果

规则文件 SHA：`2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1`。体裁为 definition/explainer + 条件化选择指南；规格表、步骤和必要限制按误判保护处理。

| # | 结果 | 当前 C 的精确判断 |
|---:|---|---|
| 1 | PASS | C:46、C:107 的待核验/入口分支都服务读者判断，没有堆无关反驳。 |
| 2 | PASS | C:3–C:115 只覆盖设置定义、价格边界、条件选择和新农场路径；没有搬入 SERP、社区、Mod 或赚钱路线。 |
| 3 | PASS | C:13–C:18、C:30–C:32、C:58–C:62、C:92–C:95 的平行结构分别承担表格、边界、选择和步骤职责。 |
| 4 | PASS | 没有机械重复“虽然……但是……”模板。 |
| 5 | PASS | `Profit Margin`、利润率、倍率、受影响/不受影响和 UI 名称保持稳定。 |
| 6 | N/A | 机制解释文没有亲历故事或情绪曲线。 |
| 7 | PASS | 没有无来源的“所有人都以为”；建议均带人数、节奏或约束条件。 |
| 8 | PASS | C:5、C:20、C:24、C:28、C:46、C:56、C:66、C:76、C:97 等“不是/不能/不要”各自区分机制、范围或未核验事项，不是空洞模板。 |
| 9 | PASS | C:46、C:97、C:107 保留未归类价格和平台/版本限制；已核实的四档、公式和多人前提没有人为加疑虑。 |
| 10 | PASS | `25g`、`6g`、`1,500g`、`1g`均有来源或透明算术；没有无来源的时间、收益或性能精度。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等脆弱经历。 |
| 12 | PASS | C:88–C:95 已补齐 100%/非 100% 分支、多人存档前提和房主单独游玩限制，不再是万能步骤。 |
| 13 | PASS | C:46、C:76、C:84、C:107、C:115 回到具体判断或边界，没有段段升格成金句。 |
| 14 | PASS | 定义、表格、例子、选择表、路径和清单承担不同功能；没有连续段落只换词。 |
| 15 | PASS | C:56、C:61、C:70、C:76、C:80、C:84 的建议均有来源机制或人数/节奏/预算前提。 |
| 16 | PASS | C:5 是 H2 后首段，直接说明设置改变什么和哪些类别不全局缩放。 |
| 17 | PASS | 未见“值得注意”“事实上”等无功能连接词成群出现。 |
| 18 | PASS | UI 名称与机制术语稳定；Figure 2 的问题不是同义替换，而是把普通动作写成了不必要的英文代码短语。 |
| 19 | **REVISE** | C:101、C:103 的 `create multiplayer save` 与 `Multiplayer#Profit_margins` 不属于自然的 reader-facing 中文/英文表达；按第 5.3 节最小改写。 |
| 20 | PASS | Wheat/Crab Pots 是公开来源支持的教学例子；Figure 2 是示意图，未冒充实机截图或作者测试。 |
| 21 | PASS | C:109–C:115 以创建前检查和游戏经济边界结束，没有祝福或转化口号。 |
| 22 | PASS | C:115 回到部分价格、固定边界和设置前提，没有升格为现实商业或宏大命题。 |

### 六类形式指纹

- **破折号：PASS。** 正文无密集破折号链；来源标题中的 `Multiplayer — Profit margins` 有明确出处作用。
- **粗体：PASS。** 仅用于设置路径和图位，未用于营销承诺。
- **无用装饰：PASS。** 表格、编号步骤和图位 blockquote 都承担信息职责。
- **助手/流程残留：PASS。** 未发现 SERP/PAA、agent/worker/dispatch、任务卡、事实 ID、私有路径或研究日志。
- **填充短语：PASS。** 未发现成群的“值得注意”“事实上”等无功能连接词。
- **泛泛积极结尾：PASS。** 结尾回到创建前检查和具体价格边界。

## 8. 范围外与剩余风险

以下保持 **UNVERIFIED**，不因本报告的内容结论自动通过：

- `PublicBlogHandoff`、最终 SEO Title/Description、metadata、canonical、hreflang、schema；
- cover/figure 的实际 WebP/AVIF、尺寸、字节预算、权利、`PublicPicture` 绑定、移动端可读性和渲染；
- page assembly、DOM/accessibility、browser/ego-browser、Next build、TypeScript、Vitest、static export；
- live HTTP/生产 CDN/部署/收录/排名；
- commit、push、数据库或其他外部写入。

## 9. 最小返修和结算

仅需由 C 修改以下两处自然度，不改变已通过事实：

1. **C:101：** 删除反引号英文动作 `create multiplayer save`，改为“创建多人存档”。
2. **C:103：** 同样改为“创建多人存档”；将 `Multiplayer#Profit_margins` 改为读者可读的 `Multiplayer（Profit margins）` 或完整页面名称。

返修后重新绑定 C SHA，并重新执行 D → E；不要借此扩写 Host tab、旧存档编辑、平台专属教程、赚钱路线或新内链。

**最终结论：当前 SHA `8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045` 的 C-zh 内容为 REVISE；多人存档事实已通过，唯一返修项是 Figure 2 reader-facing alt/caption 的自然中文/英文表达。**
