# D-zh 最终 postcheck v8：PASS

- **审核日期：** 2026-09-23（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **只读范围：** C-zh、A-zh、B-zh、`project-interface-spec.md`，以及为验证站内链接真实性而读取的现有 registry/copy 源文件。
- **唯一写入：** 本报告 `D-zh-final-check-v8.md`；未修改 C、A/B、项目接口规格或其他既有文件。

## 1. 最终结论

**PASS。** 当前 C-zh 已绑定任务要求的 SHA `8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045`；排除 `Sources` 后的 V7 `zh-CN` 机械正文计数为 `2295`，位于 `2000–2300`。多人存档前提已补入 H2-1 直答块的 C:7（紧接并保留 C:5 的受保护价格定义）、C:86–C:95、Figure 2 alt/caption 和 C:105–C:115；受保护的价格/选择语义、边界、公式、唯一站内链接、公开来源和静态卫生均通过。

C:5/C:22/C:26/C:70/C:111 是修订前的内容锚点；新增多人存档段落使后续物理行号顺延，故本报告同时记录当前实际行号（例如原 C:22 的句子当前为 C:24，原 C:70 的内链当前为 C:72，原 C:111 的价格边界清单当前为 C:113）。这属于插入必要前提造成的行号移动，不是受保护价格/选择内容被改写。

## 2. 版本绑定与计数证据

### 2.1 当前 C SHA

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实输出：

```text
8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

与任务期望 `8ec7bc9092b02c4322920f03143b050d8d3af966cdbd51934da2179d3115a045` 完全一致。

### 2.2 V7 `zh-CN` 正文计数

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

`requires_independent_review` 是计数脚本的保守标记，不是失败；本报告完成独立语义复核。

### 2.3 A/B 与项目接口规格 SHA

执行：

```sh
sha256sum \
  docs/blog-ops/profit-margin-stardew/A-zh-research.md \
  docs/blog-ops/profit-margin-stardew/B-zh-layout.md \
  docs/blog-ops/profit-margin-stardew/project-interface-spec.md
```

真实输出：

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  docs/blog-ops/profit-margin-stardew/A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  docs/blog-ops/profit-margin-stardew/B-zh-layout.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  docs/blog-ops/profit-margin-stardew/project-interface-spec.md
```

A-zh、B-zh 和项目接口规格均为本次实际读取版本；接口规格仍将 PublicBlogHandoff、媒体绑定、页面装配、构建和部署分开，不能由 C-zh 代签。

## 3. 多人存档前提修复回归

| 位置 | 结果 | 当前真实证据 |
|---|---|---|
| C:5 直答块 | **PASS** | C:5 的原价格定义和四档边界保持原样；紧接其后的 C:7 补充：`25%/50%/75%` 位于新建多人存档流程，单人使用非 100% 要经“合作”/`Host New Farm` 创建多人存档，再由房主单独游玩。 |
| C:86–C:95 | **PASS** | C:88 明确两支：100% 从 `New Game`；75%/50%/25% 从“合作”/`Host New Farm`，并创建多人存档。C:92–C:95 将两支拆成可读步骤，明确非 100% 的多人存档门槛。 |
| Figure 2 alt/caption | **PASS** | C:101 alt 同时写出 `100%` → `New Game` 与非 100% → “合作”/`Host New Farm` → `create multiplayer save`；C:103 caption 同样保留两支和平台中立限制。 |
| C:105–C:115 | **PASS** | C:107 的找不到入口分支要求非 100% 回到“合作”/`Host New Farm`并创建多人存档；C:111、C:115 的创建前检查和结尾再次确认 100%/非 100% 分支。 |

该修复没有扩写旧存档 XML、Mod、跨平台 UI 教程或固定收益/进度承诺；与 B-zh 的高层路径和平台/版本不确定性边界一致。

## 4. 受保护价格、公式与选择内容

### 4.1 C:13–C:18 表格

**PASS。** 当前 C:13–C:18 仍为四档表，实际内容使用：

```text
C:15 普通/Normal（100%） | 受影响价格按标准倍率计算
C:16 75%               | 受影响价格按四分之三计算
C:17 50%               | 受影响价格按一半计算
C:18 25%               | 受影响价格按四分之一计算
```

没有把档位写成全商店、建筑、工具升级或任务奖励的全局乘数；选择列仍保留标准经济、约束和挑战取舍。

### 4.2 指定锚点语义

| 修订前锚点 | 当前证据 | 结果 |
|---|---|---|
| C:22 | 当前 C:24 仍写 `按0.75倍计算`、`列出的种子`，并禁止用该倍率反推建筑/升级/奖励。 | **PASS** |
| C:26 | 当前 C:28 仍写“大多数”和“指定商品”不能扩写为所有商店统一缩放。 | **PASS** |
| C:38 | 当前 C:38 仍区分 Pierre 种子、页面点名的 Joja 商品与其他购买项目。 | **PASS** |
| C:48 | 当前 Figure 1 alt 为 C:50，仍列出不受影响的商店商品、建筑、工具升级和任务金币奖励。 | **PASS** |
| C:70 | 当前站内文章链接顺延至 C:72，仍只有一次，并只作预算背景。 | **PASS** |
| C:111 | 当前创建前边界清单顺延至 C:113，仍同时列出会缩放的出售物品、Pierre 种子、指定 Joja 商品，以及不缩放的商店商品、建筑、工具升级和任务金币奖励。 | **PASS** |

### 4.3 公式与价格边界

执行透明算术复核：

```text
25g × 25% = 6.25g
floor(6.25g) = 6g
max(1g, floor(6.25g)) = 6g
Crab Pots fixed example = 1,500g
```

C 当前保留 `Wheat` 的 `25g` → `6g` 示例、1g 下限、以及 Willy 的 `Crab Pots` `1,500g` 固定对照；没有把固定类别乘以 25%，也没有把价格倍率写成现实会计净利润公式。**PASS。**

## 5. 结构、图位、链接、来源和卫生

### 5.1 H1/heading 结构

独立结构扫描真实输出：

```text
h1_count=1
h2_count=6
h3_count=12
h4_plus=[]
h1_exact_b_work_h1=True
sources_headings=[(117, 2, 'Sources')]
last_heading=(117, 2, 'Sources')
```

H1 与 B-zh 工作 H1 完全一致；没有正文第二个 H1；`Sources` 是文末唯一 Sources H2。

### 5.2 两个 figure ID

```text
fig-01-price-boundary count=1 lines=[48]
fig-02-advanced-options-path count=1 lines=[99]
```

Figure 1 的 alt/caption 保留 Wheat、Crab Pots 和受影响/固定边界；Figure 2 的 alt/caption 已补齐 100%/非 100% 双路径与多人存档前提。实际 WebP/AVIF 文件、尺寸、字节预算、权利、绑定和渲染仍不在本任务范围。

### 5.3 唯一真实站内链接

正文静态计数：

```text
/zh/how-to-earn-money-stardew => 1 occurrence (current C:72)
```

只读回读项目接口：

```text
src/blog/blog-post-identities.ts:14  "how-to-earn-money-stardew"
src/blog/blog-copy.ts:136       "how-to-earn-money-stardew": "/zh/how-to-earn-money-stardew"
src/blog/blog-post-registry.tsx:549  slug: "how-to-earn-money-stardew"
```

**PASS（静态真实性）。** live HTTP 和页面渲染可达性不由本报告代签。

### 5.4 公开 URL 与 Sources

C 全文 URL 扫描：

```text
url_occurrences=13
https://zh.stardewvalleywiki.com/选项 => 3
https://stardewvalleywiki.com/Options => 3
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 5
https://stardewvalleywiki.com/Getting_Started => 2
external_unallowed=[]
```

`Sources` 区块静态扫描：

```text
https://zh.stardewvalleywiki.com/选项 => 1
https://stardewvalleywiki.com/Options => 1
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 1
https://stardewvalleywiki.com/Getting_Started => 1
sources_only_allowed=True
sources_each_once=True
```

`Sources` 仍含 `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.` 及四条公开来源；没有论坛、Reddit、Steam、Mod、搜索结果或内部研究 URL。

### 5.5 编码、换行、尾随空白与泄漏

独立 Python 字节/文本扫描真实输出：

```text
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
workflow_or_agent_terms=[]
secret_markers=[]
```

公开 `https://` URL 和合法 `/zh/...` 内链不计为泄漏。另执行：

```sh
git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

退出码为 `1` 是 `/dev/null` 与未跟踪 C 文件内容不同的预期结果；无 whitespace diagnostic output，逐行扫描也无尾随空白。

## 6. 范围外与未验证项

按任务要求，以下均为 **UNVERIFIED（范围外）**，没有被本报告推断为通过：

- **browser / ego-browser：UNVERIFIED**；未打开页面、未做 DOM 或视觉验收。
- **page assembly / route / DOM / accessibility：UNVERIFIED**；C-zh 不是页面装配或 PublicBlogHandoff 证据。
- **media assets：UNVERIFIED**；未读取或验收 WebP/AVIF、尺寸、字节预算、权利、PublicPicture 绑定、加载属性或渲染效果。
- **build / typecheck / test：UNVERIFIED**；未运行 `pnpm build`、`pnpm typecheck`、`pnpm test` 或 Vitest。
- **live HTTP / production / CDN / indexing：UNVERIFIED**；未请求生产站点，未验证线上路由或收录。
- **deploy / commit / push / external writes：未执行**；没有部署、提交、推送、数据库或外部服务写入。

## 7. 写入范围结算

写入前确认 `D-zh-final-check-v8.md` 不存在；本次只创建该命名报告。C-zh、A-zh、B-zh 和 `project-interface-spec.md` 的 SHA 在审核期间保持本报告第 2 节记录的值；没有修改任何既有文件。
