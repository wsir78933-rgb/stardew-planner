# D-zh 最终独立检查 v7 — PASS

- **审核日期：** 2026-09-22（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **对照输入：** `A-zh-research.md`、`B-zh-layout.md`、`E-zh-final-review-v6.md`、`project-interface-spec.md`、V7 `22条鉴文规则.md` 与 V7 正文计数脚本。
- **结论边界：** 本报告只结算当前 C-zh 正文门；页面、媒体和下游交付另行结算。
- **写入边界：** 本次只新建本报告；没有修改 C-zh、A/B zh、D/E 既有报告、项目源码、媒体、配置、依赖、数据库或外部服务；没有 commit、push、deploy、browser/page assembly 或 spawned worker。

## 1. 结论摘要

**PASS（C-zh 内容门）。** 当前 C-zh 的 SHA 与任务要求的 `1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40` 完全一致；V7 `zh-CN` 正文在排除 `Sources` 后为 `2035`，位于 `2000–2300` 内。此前 D/E 门中要求复核的价格表、非全局边界、C:26、C:38、C:48、C:70、C:111、H1、公式、图位语义、唯一内链、公开来源和静态卫生均通过，E-zh v6 指定的三处最小修订也已实际出现在当前 C 中。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| 当前 C SHA | **PASS** | `1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40`，与任务期望完全相同。 |
| V7 `zh-CN` 正文长度 | **PASS** | `mechanical_units=2035`；`Sources` 被排除；要求区间 `2000–2300`。 |
| E-zh v6 三处最小修订 | **PASS** | C:22 有“按0.75倍计算”“列出的种子”；C:48 alt 有“建筑、工具升级和任务金币奖励”；C:60 有“需要接受更紧的预算约束”。 |
| C:13–C:18 | **PASS** | C:13–C:16 均用“计算”；价格表无“读取”；C:18 保留价格倍率与影响范围的分层。 |
| C:26/C:38/C:111 | **PASS** | 以来源清单、“大多数/指定商品”和“部分商店商品”限制范围，没有外推为全商店。 |
| C:48 图一 alt | **PASS** | 明确写出来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。 |
| C:70 站内内链 | **PASS** | `/zh/how-to-earn-money-stardew` 在 C 中恰好出现一次，且本地中文 registry/copy 存在对应公开路由。 |
| H1/结构 | **PASS** | H1=1、H2=6、H3=12、H4+=0；H1 与 B-zh 工作 H1 完全一致；`Sources` 为唯一文末 H2。 |
| 公式/数字 | **PASS** | `25g × 25% = 6.25g`，按截断和 1g 下限显示 `6g`；Crab Pots 的 `1,500g` 固定对照保留。 |
| 两个图位正文语义 | **PASS** | 两个语义 ID 各 1 次，位置、alt、caption、来源边界符合 B-zh。 |
| 公开 URL 与 Sources | **PASS** | 正文只使用四个允许的外部公开 URL；Sources 四个 URL 各 1 次，无额外来源。 |
| 编码/换行/尾随空白/泄漏 | **PASS** | UTF-8 strict、NFC/LF 与原始字节一致；无 BOM、CRLF、CR、尾随空白、私有路径、秘密或流程残留。 |
| 目标范围 | **PASS** | 现有输入文件未改；本次唯一新增文件为本报告。 |
| 页面/媒体/构建/测试/部署 | **UNVERIFIED（范围外）** | 按任务要求不运行 browser、页面装配、build、typecheck、Vitest、deploy 或 live HTTP。 |

## 2. 版本绑定与真实命令证据

### 2.1 C SHA 与 V7 计数

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

真实关键输出：

```text
1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

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

计数脚本的 `requires_independent_review` 是计数器的固定保守标记，不是失败；本报告完成了独立正文复核。

### 2.2 输入 SHA

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  B-zh-layout.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  project-interface-spec.md
77f28d67fa85bd84f016165a04996037400da3003a30fcb91cbe4ca2fd17a79a  D-zh-final-check-v6.md
164ec92d102e2233102ef1555bb577af35bc44958051ac32fb8debe8c513d0fa  E-zh-final-review-v6.md
2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1  22条鉴文规则.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  正文计数.py
```

A/B 与当前项目接口契约均为本次独立读取的版本。`project-interface-spec.md` 仍把正文、handoff、媒体绑定、页面装配和 WritePageGrant 分开；本报告不把 C-zh 误报成 PublicBlogHandoff 或页面完成证据。

## 3. 三处 E-zh v6 修订与所有指定门

### 3.1 三处最小修订

通过以下只读命令复核：

```sh
grep -n -F '按0.75倍计算' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
grep -n -F '列出的种子' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
grep -n -F '建筑、工具升级和任务金币奖励' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
grep -n -F '需要接受更紧的预算约束' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实匹配位置：

```text
22:75%表示属于这套规则的价格按0.75倍计算，不是“你能保留75%的净利润”。受影响的出售物品和列出的种子会按此档位处理；建筑、升级或奖励不能用这个数字反推。
30:...建筑、工具升级和任务金币奖励。
40:...建筑、工具升级和任务金币奖励被列为不受影响的类别。
48:...建筑、工具升级和任务金币奖励。
60:| 有意进行经济挑战 | 25% | 受影响出售收入更紧，固定类别仍在，需要接受更紧的预算约束。 |
111:...建筑、工具升级和任务金币奖励？
```

C:22 末尾的“建筑、升级或奖励不能用这个数字反推”是禁止从 75% 倍率外推的提醒，不是声称所有升级或奖励都属于某一来源清单；精确的不受影响边界在 C:30、C:40、C:48、C:111 明列。该句不构成残留范围错误。

### 3.2 C:13–C:18、C:26、C:38、C:48、C:70、C:111

当前逐行内容：

```text
13 | 普通/Normal（100%） | 受影响价格按标准倍率计算 | …
14 | 75% | 受影响价格按四分之三计算 | …
15 | 50% | 受影响价格按一半计算 | …
16 | 25% | 受影响价格按四分之一计算 | …
18 | 英文 Options 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
26 | 判断一个数字时，先看它属于下表哪一列，再看当前档位；Multiplayer 的 Profit margins 说明给出这份影响范围清单；“大多数”和“指定商品”不能扩写成所有商店统一缩放。
38 | 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
48 | 图一 alt 明确写出来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。
70 | 只链接一次 `/zh/how-to-earn-money-stardew`，并把它限定为前期预算背景。
111 | 清单要求区分会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励。
```

**PASS。** C:13–C:16 全部使用“计算”，价格表行 11–16 没有“读取”；C:18 明确把“价格倍率”与“商品是否属于受影响范围”分成两个判断。C:26 保留来源的“大多数/指定商品”边界；C:38 的“部分商店商品”阻断全部商店外推；C:48 的 alt 已补齐“工具升级”；C:70 恰有一处受限内链；C:111 是完整的边界复核句。

### 3.3 H1 与层级

自动结构扫描真实输出：

```text
h1_count=1
h2_count=6
h3_count=12
h4_plus=[]
h1_exact=True
sources_headings=[(115, 2, 'Sources')]
```

H1 为 `星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选`，与 B-zh 第 22 行工作 H1 完全一致。正文没有第二个 H1；共享页面壳未来提供 H1，C 的正文结构没有跳级。

## 4. 事实、公式、意图与 22 条鉴文门

### 4.1 公式和数字

执行的独立算术复核：

```text
25g * 25% = 6.25
floor(25g * 25%) = 6 g
max(1g, floor(25g * 25%)) = 6 g
Crab Pots 1,500g unaffected => 1500 g
```

C:18 写明按整数截断且最低不低于 1g；C:34 的 Wheat `25g → 6g` 与算术一致，C:40/C:50 的 Willy `Crab Pots` `1,500g` 作为固定价格对照，未被错误乘以 25%。四档表和 C:22 的 `0.75` 只解释游戏内价格倍率，没有写成现实会计“净利润 ÷ 收入”或全局难度分数。

### 4.2 ReaderTask、范围和完整性

**PASS。** C 的顺序与 B-zh 一致：

1. C:3–7 先给设置定义、四档和非全局边界；
2. C:9–22 解释倍率、整数截断、1g 下限和 75% 问题；
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支说明影响边界；
4. C:52–82 按单人、多人、挑战目标作条件化选择，没有普遍最佳值、固定收益或固定进度承诺；
5. C:84–105 给出新农场扳手/高级设置的高层路径、平台/版本限制和找不到入口时的停止分支；
6. C:107–113 以创建前检查结束。

未发现把文章扩成泛赚钱路线、第一年行动清单、作物/ROI 计算器、Mod、旧存档 XML、职业、温室/洒水器或平台专属教程的正文内容。C:70 的现有文章内链只补预算背景，没有形成第二 ReaderTask。

### 4.3 V7 22 条鉴文规则复核

按 `/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md` 逐条对当前 C 独立复核：

| 规则 | 结果 | 证据/判断 |
|---:|---|---|
| 1 | PASS | C:44、C:105 只保留会改变读者判断的价格/UI 例外。 |
| 2 | PASS | C:3–113 服务同一设置理解、选择与新农场路径；没有搬入 A-zh 的 SERP/社区资料。 |
| 3 | PASS | 四档表、边界矩阵、选择矩阵和步骤各有信息职责，非空换词排比。 |
| 4 | PASS | 未见机械重复的“虽然…但是…”让步模板。 |
| 5 | PASS | `Profit Margin`、利润率、倍率、受影响/不受影响等术语稳定。 |
| 6 | N/A | 没有亲历故事或伪造情绪曲线。 |
| 7 | PASS | 没有无来源的“所有人都以为”；改用玩家人数、节奏和约束条件。 |
| 8 | PASS | C:5、C:22、C:64、C:74 的“不是/不能”各自区分全局倍率、现实会计和未经验证的进度/收益。 |
| 9 | PASS | C:44、C:95、C:105 对未归类价格、平台/版本差异和缺少入口保留停止分支。 |
| 10 | PASS | 25g、6g、1,500g、1g 下限有来源或透明算术，没有虚假时间/收益精确承诺。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等脆弱经历。 |
| 12 | PASS | C:86–95 是有前提和平台限制的高层新农场路径，不是万能步骤。 |
| 13 | PASS | 结尾回到创建前检查和价格边界，没有段段升华。 |
| 14 | PASS | 说明、表格、示例、选择和步骤功能不同。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 用人数、节奏、预算和约束说明选择。 |
| 16 | PASS | C:5 是 H2-1 后第一段，直接回答改变哪些价格、四档和非全局边界。 |
| 17 | PASS | 未见“值得注意/事实上”等无功能连接词成群出现。 |
| 18 | PASS | 按钮名、商品例子和机制术语没有刻意同义替换。 |
| 19 | PASS | E v6 指定的三处翻译腔/边界精度问题已修复。 |
| 20 | PASS | 两图明确是示意图而非实机截图；Wheat/Crab Pots 是有来源的教学例子。 |
| 21 | PASS | C:107–113 以清单和具体下一步结束，无通用祝福。 |
| 22 | PASS | 结尾回到部分价格和固定边界，没有升格为现实商业宏大命题。 |

六类形式指纹也通过：破折号只在 Sources 的公开页面标题中出现；粗体只用于路径/图位；无 emoji 或无用装饰；无 assistant/agent/worker/任务卡残留；无成群填充短语；无泛泛积极结尾。

## 5. 图位、alt、caption、来源和内链

### 5.1 两个图位

正文静态扫描：

```text
fig-01-price-boundary => 1 occurrence, lines 46–50
fig-02-advanced-options-path => 1 occurrence, lines 97–101
```

- Figure 1 位于 H2-3 矩阵、Wheat/Crab Pots 例子和待核验分支之后，H2-4 之前；alt 和 caption 都分开“会缩放的选定价格”与“来源列举的固定类别”，并保留工具升级、任务金币、Wheat 和 Crab Pots 边界。
- Figure 2 位于新农场有序路径之后、创建前清单之前；alt/caption 都明确是平台中立路径示意、依据 Options/Getting Started，不是逐平台实机截图，也不承诺所有平台按钮位置相同。

正文图位语义、位置、alt 和 caption **PASS**。实际 WebP/AVIF 文件、同名绑定、尺寸、字节预算、权利、PublicPicture 绑定、加载属性、图中文字可读性和渲染状态不在本任务范围，保持 **UNVERIFIED**。

### 5.2 公开 URL 与 Sources

执行 Markdown URL 扫描的真实结果：

```text
url_occurrences=11
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 4
https://zh.stardewvalleywiki.com/选项 => 3
https://stardewvalleywiki.com/Options => 2
https://stardewvalleywiki.com/Getting_Started => 2
internal_link_occurrences=['/zh/how-to-earn-money-stardew']
internal_link_count=1
```

四个允许的外部公开 URL 是：中文 Options、英文 Options、英文 Multiplayer `#Profit_margins`、Getting Started；没有论坛、Reddit、Steam、Mod、搜索页、内部路径或研究 URL。`Sources` 区块行 121–124 的 URL 集合恰好为这四个，且每个只出现一次；checked label 为 `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.`。

站内内链的静态真实性证据：

```text
src/blog/blog-post-identities.ts:14  "how-to-earn-money-stardew"
src/blog/blog-copy.ts:114       "how-to-earn-money-stardew": "/how-to-earn-money-stardew"
src/blog/blog-copy.ts:136       "how-to-earn-money-stardew": "/zh/how-to-earn-money-stardew"
src/blog/blog-post-registry.tsx:549  slug: "how-to-earn-money-stardew"  # zh registry
```

因此 C:70 的 `/zh/how-to-earn-money-stardew` 是当前项目静态 registry/copy 中存在的中文公开路由，且正文只出现一次。live HTTP、页面渲染和浏览器可达性不在本任务范围，未据此声称线上 200。

## 6. 编码、换行、尾随空白、私有泄漏和范围卫生

对 C 原始字节和逐行文本的真实扫描结果：

```text
utf8_strict=PASS
bom=False
crlf_count=0
standalone_cr_count=0
ends_with_lf=True
nfc_lf_equal_raw=True
sha256_raw=1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40
sha256_nfc_lf=1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40
trailing_whitespace=[]
nul_count=0
```

私有路径/本地服务/流程和秘密模式扫描均无命中：

```text
private_absolute_paths=[]
local_service_addresses=[]
workflow_or_agent_terms=[]
secret_markers=[]
internal_fact_ids=[]
```

扫描覆盖 `/Users/`、`/Volumes/`、`/private/`、`/tmp/`、`file://`、localhost/loopback、agent/worker/dispatch/prompt/SERP/PAA/ReaderTask/A-zh/B-zh/C-zh 等流程词、事实 ID、API key/secret/token/password/bearer/private-key 模式。C 的公开 `https://` 来源链接和 `/zh/...` 内链不是私有泄漏。

未跟踪文件的空白差异边界也已核对：

```text
git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0; no diagnostic output

git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1 because /dev/null differs from this untracked file; no whitespace diagnostic output
```

因为 C 在当前工作树中是未跟踪输入，普通 `git diff --check` 不能单独证明内容空白；上面的逐行尾随空白、字节和 no-index 结果共同构成证据。

## 7. 目标范围与未验证项

### 7.1 目标范围

报告写入前的真实状态：

```text
git status --short --untracked-files=all
# 仅有既存的 docs/blog-ops/profit-margin-stardew/ 输入与历史报告；D-zh-final-check-v7.md 不存在。
# git diff --name-only 和 git diff --cached --name-only 均为空。
```

本报告只新增 `docs/blog-ops/profit-margin-stardew/D-zh-final-check-v7.md`。写入后重新核对 C、A-zh、B-zh、project-interface-spec、D-zh v6 与 E-zh v6 的 SHA，均与本报告前记录一致；没有写入 C 或其他既有文件。

### 7.2 明确保持 UNVERIFIED（范围外）

以下不是本次内容 postcheck 的验收对象，不能由本报告代签：

- **browser/ego-browser：UNVERIFIED（范围外）**；没有打开或验收本地页面。
- **page assembly/routes/DOM/accessibility：UNVERIFIED（范围外）**；没有页面装配或真实 DOM 证据。
- **media assets：UNVERIFIED（范围外）**；没有实际 cover/figure WebP/AVIF、尺寸、预算、权利或 PublicPicture 绑定证据。
- **build/typecheck/test：UNVERIFIED（范围外）**；没有运行 `pnpm build`、`pnpm typecheck`、`pnpm test` 或 Vitest。
- **deploy/live HTTP/CDN/indexing：UNVERIFIED（范围外）**；没有部署、生产请求、CDN、收录或排名证据。
- **external writes：UNVERIFIED/未执行**；没有 commit、push、数据库写入、外部服务写入或部署。

**最终结论：** 绑定 SHA `1862a9ae0147a1c29c81f195f5f85611986350b47d061d45214a595f36c36f40` 的 C-zh 正文 **PASS**；V7 `zh-CN` 合格正文计数 **2035/2000–2300**；E-zh v6 三处最小修订和所有本次指定静态内容门均通过。页面、媒体、构建、测试、浏览器和部署结论仍明确为 **UNVERIFIED（范围外）**。
