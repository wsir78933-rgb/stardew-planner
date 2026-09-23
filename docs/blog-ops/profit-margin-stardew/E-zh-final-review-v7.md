# E-zh 最终独立内容审核 v7 — REVISE

- **审核日期：** 2026-09-22（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **前置依赖：** `D-zh-final-check-v7.md` 已存在；本审核不把 D 的结论当作 E 证据。
- **主意图/体裁：** 解释 Stardew Valley 的 Profit Margin 设置、受影响边界、条件化选择和新农场设置路径；definition/explainer + 条件化选择。
- **V7 规则：** `/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md`
- **写入边界：** 本次只新建本报告；未修改 C、A/B、D/E 既有报告、接口规格、源码、媒体、配置、依赖、数据库或外部服务；未运行 browser/page assembly/build/typecheck/test/deploy；未 commit/push；未 spawn worker。

## 1. 结论摘要

**REVISE。** 当前 C 已绑定任务要求的 SHA `1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40`；E v6 的三处指定修订已实际出现，公式、价格范围、H1/正文结构、公开来源集合、单一内链、编码和泄漏卫生均通过。但独立回读当前公开 Stardew Valley Wiki 后发现一个新的内容阻塞：Wiki 的 Multiplayer 规则明确将 25%/50%/75%/100% 的选择限定在“新建多人存档”，而 C:5、C:84–C:93、C:97–C:101、C:103–C:113 只写成泛化的“新建游戏/新农场”路径，没有告诉想独自游玩非 100% 档位的读者应从合作/Host New Farm 创建多人存档再独自游玩。

这不是页面、媒体、构建或部署问题，而是当前正文对唯一 ReaderTask 的设置前提不完整；若不补，单人读者可能按 C:90 选择“新建游戏”后找不到低档位，并在 C:105 得不到正确的停止/替代路径。最小修订应补上多人存档门槛，并同步收窄 H2-5 步骤及 Figure 2 的 alt/caption；不需要扩写赚钱路线、旧存档教程或平台专属教程。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| C 版本绑定 | **PASS** | 当前 SHA 与任务期望完全一致。 |
| V7 合格正文长度 | **PASS** | `mechanical_units=2035`，排除 `Sources`，位于 `2000–2300`。 |
| E v6 三处指定修订 | **PASS** | C:22 使用“按0.75倍计算”“列出的种子”；C:48 alt 明确“工具升级”；C:60 为自然完整的“需要接受更紧的预算约束”。 |
| C:13–C:18、C:26、C:38、C:48、C:70、C:111 回归 | **PASS** | 四档表均用“计算”；影响范围保留“大多数/指定/部分”边界；alt 含“工具升级”；内链只出现一次；C:111 逐项列全边界。 |
| 文章意图与完整性 | **REVISE** | 主题范围完整，但非 100% 档位的多人存档前提缺失，导致新农场动作不完整。 |
| 中文自然度 | **PASS（指定问题已修复）** | C:22、C:48、C:60 的历史问题已消失；未发现足以单独阻塞的翻译腔或残句。 |
| SEO usefulness / H1 | **PASS（正文范围）** | C:1 与 B-zh 工作 H1 完全一致；定义、四档、边界、条件选择和入口覆盖原始信息意图。最终 metadata Title/Description 仍属下游未验证。 |
| 公式与数字 | **PASS** | `25g × 25%` 截断为 `6g`；Willy `Crab Pots` 固定为 `1,500g`；1g 下限与来源一致。 |
| 事实与公开 URL | **REVISE** | 四个 URL 均可达且支持现有价格事实；但 Multiplayer 页的“新建多人存档”前提未进入 C。 |
| 图位/alt/caption | **REVISE（语义）/UNVERIFIED（资产）** | Figure 1 语义通过；Figure 2 的泛化路径缺少多人存档门槛。实际 WebP/AVIF、尺寸、权利、绑定和渲染不在本任务范围。 |
| 单一站内内链 | **PASS（静态真实性）** | C:70 的 `/zh/how-to-earn-money-stardew` 恰好一次；本地中文 identity/copy/registry 均有对应条目。live HTTP 不由本审核代签。 |
| 22 条鉴文 | **REVISE** | 大多数规则通过；规则 2、9、12、16、20 受同一设置前提缺失影响，详见第 6 节。 |
| 编码/换行/尾随空白/泄漏 | **PASS** | UTF-8、NFC/LF、无 BOM/CRLF/尾随空白/私有路径/秘密/流程词。 |
| 页面/媒体/构建/测试/部署 | **UNVERIFIED（范围外）** | 按任务要求未执行。 |

## 2. 版本绑定与真实命令证据

### 2.1 输入 SHA

本次独立读取并重新计算：

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  B-zh-layout.md
1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40  C-zh-draft.md
ea4ab9896a3e76c1a287891a9376defc043913b4488c7f1f105f0f764f9f4f87  D-zh-final-check-v7.md
164ec92d102e2233102ef1555bb577af35bc44958051ac32fb8debe8c513d0fa  E-zh-final-review-v6.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  project-interface-spec.md
2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1  22条鉴文规则.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  正文计数.py
```

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

真实计数结果：

```json
{
  "locale": "zh-CN",
  "mechanical_units": 2035,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["Sources"],
  "sha256_raw": "1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40",
  "sha256_nfc_lf": "1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40"
}
```

`requires_independent_review` 是计数脚本的保守标记，不是失败；本报告完成了独立语义复核。

### 2.2 当前结构和静态卫生

独立结构扫描结果：

```text
h1_count=1
h2_count=6
h3_count=12
h4_plus=[]
h1_exact=True  # 与 B-zh:22 的工作 H1 相同
sources_headings=[(115, 2, 'Sources')]
fig-01-price-boundary=1  # C:46–C:50
fig-02-advanced-options-path=1  # C:97–C:101
internal_link=/zh/how-to-earn-money-stardew, count=1
external_url_occurrences=11
external_unallowed=[]
```

C 原始字节扫描：

```text
utf8_strict=PASS
bom=False
crlf_count=0
standalone_cr_count=0
nul_count=0
ends_with_lf=True
nfc_lf_equal_raw=True
trailing_whitespace=[]
```

私有路径、服务地址、秘密和流程泄漏扫描均为零命中：扫描了 `/Users/`、`/Volumes/`、`/private/`、`/tmp/`、`file://`、localhost/loopback、`agent/worker/dispatch/prompt/SERP/PAA/ReaderTask/A-zh/B-zh/C-zh` 及 `api-key/secret/token/password/bearer/private-key` 模式。C 的四个公开 `https://` 来源和一个 `/zh/...` 站内路径不属于私有泄漏。

## 3. E v6 三处修订与指定回归

### 3.1 E v6 三处修订

- **C:22 — PASS：** `75%表示属于这套规则的价格按0.75倍计算，不是“你能保留75%的净利润”。受影响的出售物品和列出的种子会按此档位处理……`；动词已与 C:13–C:16 的价格表一致，种子范围也收窄到来源列出的集合。
- **C:48 — PASS：** alt 写为`……来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。`，精确保留“工具升级”。
- **C:60 — PASS：** `受影响出售收入更紧，固定类别仍在，需要接受更紧的预算约束。`，句法完整且取舍清楚。

### 3.2 指定回归

| 位置 | 结果 | 逐行核对 |
|---|---|---|
| C:13–C:18 | **PASS** | C:13–C:16 均为“计算”；C:18 把倍率与商品影响范围分成两个判断。 |
| C:26 | **PASS** | 写明来源影响范围清单，并明确“大多数/指定商品”不能扩写为所有商店。 |
| C:38 | **PASS** | 标题写“部分商店商品、建筑、工具升级和任务奖励”，没有全商店外推。 |
| C:48 | **PASS** | alt 精确含“工具升级”和“任务金币奖励”。 |
| C:70 | **PASS** | `/zh/how-to-earn-money-stardew` 只出现一次，且明确只是预算背景。 |
| C:111 | **PASS** | 清单同时列出会缩放的出售物品、Pierre 种子、指定 Joja 商品，以及来源列举的不缩放类别。 |

## 4. 意图、完整性、中文自然度、SEO 与公式

### 4.1 ReaderTask 覆盖

C 的主体顺序与 B-zh 的 ReaderTask 一致：

1. **C:3–C:7：** 先定义设置、四档和非全局边界。
2. **C:9–C:22：** 给出四档、倍率、整数截断、1g 下限和 75% 解释。
3. **C:24–C:50：** 用影响矩阵、Wheat、Crab Pots 和待核验分支说明范围。
4. **C:52–C:82：** 按单人、多人、挑战目标做条件化选择，不承诺普遍最佳、固定收益或固定进度。
5. **C:84–C:105：** 给出新农场扳手/高级设置路径和找不到入口时的停止分支。
6. **C:107–C:113：** 用创建前检查收束。

范围控制本身通过：没有扩成第一年赚钱路线、作物/ROI 计算器、Mod、旧存档 XML、职业、温室/洒水器或平台专属教程。问题是第 5 步缺少“非 100% 必须新建多人存档”的前提，见第 5 节；因此完整性不能放行。

### 4.2 中文自然度

E v6 的三处确定问题均已消失：C:22 的“计算”、C:48 的“工具升级”、C:60 的完整句法均可直接面向读者。其余表格、步骤和边界句采用稳定术语，没有发现需要单独阻塞的残句或明显翻译腔。C:54 的“对受影响出售收入变紧的接受度”和 C:105 的“停在这条文档化路径上”略偏书面，但不改变事实或读者动作，不作为本次阻塞项；若返 C，可顺手改为更口语的“能否接受受影响出售收入变少”和“只按这条已记录的路径操作”。

### 4.3 SEO usefulness 与 H1/Title 对齐

**正文范围 PASS。** C:1 的 H1 是：

```text
星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选
```

B-zh:22 的工作 H1 是同一字符串。H1 同时含站点/游戏实体、原始英文主题词、中文释义和四档选择；C:3、C:9、C:24、C:52、C:84 五个 H2 覆盖定义、四档、边界、选择和设置入口，C:5 的首段直接回答机制，不先放 CTA 或研究背景。

最终 SEO metadata Title/Description、slug、author、canonical、hreflang、JSON-LD 与页面壳不在 C 草稿中；`project-interface-spec.md:214–229、468–489` 明确这些字段仍需 handoff/页面阶段确认，本报告不猜测或代签。补上多人存档门槛会提升而不是削弱原始关键词的任务完成度。

### 4.4 公式、数字和范围

**PASS（不含设置入口遗漏）。**

- C:18 说明 Profit Margin 是售出物品和种子价格的倍数，价格出现小数时截断为整数且不低于 1g。
- C:34 的 Wheat 示例是普通档位 25g、25% 档位显示 6g；透明算术为 `25 × 0.25 = 6.25`，截断后为 6g。
- C:40/C:50 的 Willy `Crab Pots` 仍为 1,500g，未被错误乘以 25%。
- C:30/C:36 的 Pierre 种子和指定 Joja 商品范围与当前 Multiplayer 页面一致；C:26/C:44 保留“大多数/指定/待核验”边界，没有把一例外推成全商店。

## 5. 新发现：多人存档设置前提缺失（阻塞）

### 5.1 当前 C 的精确证据

| C 行 | 当前文字 | 风险 |
|---:|---|---|
| C:5 | `Profit Margin（利润率）是新农场使用的价格倍率设置：普通/100%、75%、50%、25%……` | 未说明四档可选入口受多人存档限制。 |
| C:52–C:60 | H2 为`单人、多人和挑战存档怎么选利润率？`；表格含`单人新农场`和`多人协作`行。 | 读者会以为单人新建流程也能直接选择全部低档位。 |
| C:84–C:86 | `新农场在哪里设置 Profit Margin？`；路径从`新建游戏`进入扳手/高级设置，再选四档。 | 将低档位路径泛化为普通 New 流程。 |
| C:90–C:93 | `选择新建游戏` → 扳手 → 找到 Profit Margin → 检查玩家人数和档位。 | 先选择 New 再找档位；缺少应先选 Co-Op/Host New Farm 的分支。 |
| C:97–C:101 | Figure 2 alt/caption 都是`新建游戏 → … → Profit Margin → 选择四档 → 创建农场`。 | 图位也会把错误的泛化路径固化为媒体语义。 |
| C:103–C:105 | 找不到选项时只要求确认仍在新游戏/新农场流程，并按平台/版本核对。 | 真实的多人创建前提没有作为停止或替代路径。 |
| C:107–C:113 | 清单检查单人/多人玩家人数，最后泛称`创建新农场`。 | 未提醒“非 100% 与单人游玩”的存档策略。 |

### 5.2 当前公开 Wiki 证据

本次独立回读四个 C 已使用的公开 URL，均为 HTTP 200 且最终 URL 未变：

```text
https://zh.stardewvalleywiki.com/选项        http_code=200  effective=https://zh.stardewvalleywiki.com/选项
https://stardewvalleywiki.com/Options        http_code=200  effective=https://stardewvalleywiki.com/Options
https://stardewvalleywiki.com/Multiplayer#Profit_margins  http_code=200  effective=https://stardewvalleywiki.com/Multiplayer#Profit_margins
https://stardewvalleywiki.com/Getting_Started http_code=200  effective=https://stardewvalleywiki.com/Getting_Started
```

事实回读：

- **English Multiplayer — Profit margins：**该节当前写明，创建“new multiplayer save”时才能选择 25%、50%、75% 或默认 100%；同页的多人创建路径从标题界面的 `Co-Op`/`Host New Farm` 开始，并说明 host 可在单人模式游玩该多人存档。
- **English/Chinese Options：**支持利润率四档、扳手进入 Advanced Options、出售物品/种子价格倍数和小数价格截断/1g 下限；这些页面没有消除 Multiplayer 页给出的创建模式前提。
- **Getting Started：**把 changing the profit margin 列在角色创建扳手的 Advanced Options 中；它补充 UI 位置，但未替代 Multiplayer 页的存档类型限制。

因此，C 的价格机制事实仍可 PASS，但新农场路径需要把“新建多人存档”明确写入；否则 C:105 的找不到入口分支无法帮助单人读者判断这是流程选择问题，而不是平台/版本问题。

### 5.3 最小返 C 建议（本报告不执行）

只改正文的必要语义，不新增路线或产品内容：

1. 在 C:5 的设置定义后补一句：

   > 公开 Multiplayer 说明把 25%/50%/75% 选项放在新建多人存档流程中；想独自游玩非 100% 档位时，应先从标题界面的“合作”创建多人存档，再以单人方式游玩。

2. 在 C:84–C:95 的路径中把 `新建游戏` 分成条件分支：非 100% 先走“合作 → Host New Farm → 角色创建界面扳手 → Profit Margin”；普通单人新农场可保留 100% 默认路径。不要写旧存档 XML、Mod 或逐平台按钮。

3. C:97–C:101 的 Figure 2 alt/caption 至少加入“创建多人存档”或“非 100% 档位需通过合作创建”的语义，避免图与正文继续暗示普通 New 流程可选全部四档。

4. C:103–C:113 的找不到入口分支和创建前清单补充：若目标是单人非 100%，先回到标题界面的合作创建多人存档；未核验平台/版本仍按当前 Wiki 高层路径停止，不继续猜测。

修订后应重新绑定 C SHA，并重新执行 D→E；本报告不修改 C。

## 6. V7 22 条鉴文逐项结果

体裁按“定义解释 + 条件化选择指南”判断；表格、步骤和来源边界属于规则的误判保护范围。

| # | 结果 | 当前 C 的 exact evidence / 判断 |
|---:|---|---|
| 1 | PASS | C:44 的待核验价格分支、C:105 的入口分支均服务实际选择；没有堆大量无关反驳。 |
| 2 | **REVISE** | C:3–C:113 只围绕设置任务，但把“非 100% 必须新建多人存档”这一完成任务所需知识漏掉；返 C 后仍不应加入赚钱路线或旧档教程。 |
| 3 | PASS | C:11–C:16、C:28–C:30、C:56–C:60、C:90–C:93 的平行表格/步骤各有信息职责，属于规则允许的规格表和步骤。 |
| 4 | PASS | 没有机械重复的“虽然……但是……”模板；各限制句有具体价格或 UI 功能。 |
| 5 | PASS | `Profit Margin`、利润率、倍率、受影响/不受影响、工具升级等术语稳定，没有无功能地重复命名。 |
| 6 | N/A | 没有亲历故事、情绪曲线或伪造经历。 |
| 7 | PASS | 没有无来源的“所有人都以为”；C:54、C:68、C:74 用人数、节奏和约束条件。 |
| 8 | PASS | “不是/不能/不要”主要出现在 C:5、C:22、C:26、C:34、C:50、C:54、C:64、C:68、C:74、C:78、C:95、C:101、C:105、C:113 等边界句；虽然数量不低，但每处区分不同机制、范围或未核验事项，没有机械套用同一“不是 X 而是 Y”模板。 |
| 9 | **REVISE** | C:95 保留平台限制，但 C:86–C:93 对四档路径过于确定；缺少 Multiplayer 页给出的存档类型前提。 |
| 10 | PASS | 25g、6g、1,500g、1g 下限均有 Wiki 或透明算术；没有虚构时间、收益、性能或进度精度。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等脆弱经历。 |
| 12 | **REVISE** | C:86–C:93 是简洁步骤，但对非 100% 档位遗漏 Co-Op/Host New Farm 前提，读者可能在 New 流程中卡住；需要补分支而非扩成长教程。 |
| 13 | PASS | C:44、C:74、C:82、C:105、C:113 回到具体判断或边界，没有段段升格为金句。 |
| 14 | PASS | 说明、矩阵、示例、选择表、步骤和清单承担不同功能；规格表/步骤的平行结构受规则保护。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 的建议有来源机制或人数/节奏/预算前提，没有用感受替代论证。 |
| 16 | **REVISE** | C:5 是 H2-1 首段并且直接回答价格倍率，但首个答案没有带出选择四档时的多人存档门槛；补一句即可，不需重写开头。 |
| 17 | PASS | 未见“值得注意”“事实上”等无功能连接词成群出现。 |
| 18 | PASS | 机制术语、商品例子、扳手/高级设置和四档名称保持稳定，没有刻意同义替换。 |
| 19 | PASS | E v6 指定的三处中文/边界表达已修复；C 以自然简体中文说明事实和限制。 |
| 20 | **REVISE** | Wheat/Crab Pots 图一示例通过；Figure 2 的示意路径不是虚构截图，但其 alt/caption 同正文一样漏掉多人存档前提，修订后才能完整承担教学职责。 |
| 21 | PASS | C:107–C:113 以创建前检查和具体边界结束，无通用祝福或转化口号。 |
| 22 | PASS | C:113 回到部分价格、固定类别和设置前提，没有把游戏经济升格为现实商业宏大命题。 |

### 六类形式指纹

- **破折号：PASS。** 正文没有密集破折号链；`Multiplayer — Profit margins` 是公开页面标题。
- **粗体：PASS。** 只用于设置路径和图位标签，没有营销口号。
- **无用装饰：PASS。** 表格、步骤和图位 blockquote 都有明确任务用途；无 emoji 或无意义装饰。
- **助手/流程残留：PASS。** C 中没有 SERP/PAA、agent/worker/dispatch、任务卡、事实 ID、私有路径或研究日志。
- **填充短语：PASS。** 未发现“值得注意”“事实上”等无功能连接词成群出现。
- **泛泛积极结尾：PASS。** 结尾落在创建前检查和游戏经济边界。

## 7. 站内内链、引用集合与范围外结论

### 7.1 站内内链真实性

C:70 的公开路径出现一次：

```text
src/blog/blog-post-identities.ts:14  "how-to-earn-money-stardew"
src/blog/blog-copy.ts:136       "how-to-earn-money-stardew": "/zh/how-to-earn-money-stardew"
src/blog/blog-post-registry.tsx:549  slug: "how-to-earn-money-stardew"
```

锚文本为“第一年赚钱与预算指南”，段落明确说目标文章处理预算行动，而本页只解释 Profit Margin 价格前提；符合 B-zh 对唯一内链的职责限制。未运行 live HTTP，不据此声称线上状态。

### 7.2 公开 URL 集合

C 中共有 11 次外部 URL：

```text
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 4
https://zh.stardewvalleywiki.com/选项 => 3
https://stardewvalleywiki.com/Options => 2
https://stardewvalleywiki.com/Getting_Started => 2
```

C:121–C:124 的 `Sources` 四个 URL 各出现一次；没有论坛、Reddit、Steam、Mod、搜索页、A/B/D/E 路径或研究 URL。来源公开可读、链接有效；本次只用 Wiki 页面作事实回读。

### 7.3 明确保持 UNVERIFIED

以下不由本报告代签：

- final SEO metadata、PublicBlogHandoff、page metadata/canonical/hreflang/schema；
- cover/figure 实际 WebP/AVIF、尺寸、字节预算、权利、`PublicPicture` 绑定、加载属性、移动端可读性和渲染；
- page assembly、DOM/accessibility、browser/ego-browser、build、typecheck、Vitest、static export；
- deploy/live CDN/indexing/ranking；
- commit、push、数据库或外部服务写入。

## 8. 最终结论

绑定 SHA `1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40` 的 C-zh **REVISE**：E v6 三处最小修订和所有指定回归均已通过，现存唯一阻塞是当前公开 Multiplayer 规则所要求的“新建多人存档”设置前提未写入正文和 Figure 2 路径语义。按第 5.3 节补充该分支并重新绑定 SHA 后，再由 D 和 E 复核；本报告不修改 C 或其他输入。
