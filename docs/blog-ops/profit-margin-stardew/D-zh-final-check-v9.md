# D-zh 最终静态 postcheck v9：PASS

- **审核日期：** 2026-09-23（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **本次唯一写入：** `docs/blog-ops/profit-margin-stardew/D-zh-final-check-v9.md`
- **只读输入：** C-zh、A-zh、B-zh、`project-interface-spec.md`、V7 规则/计数脚本，以及为验证唯一站内链接真实性而读取的现有 registry/copy 源。
- **禁止项遵守：** 未修改 C/A/B/E、接口规格、源码、媒体、配置、依赖、数据库或外部服务；未提交、推送、部署或 spawn worker。

## 1. 最终结论

**PASS（当前 C-zh 静态内容门）。** 当前 C-zh 的 SHA-256 与任务绑定值 `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` 完全一致；V7 `zh-CN` 正文计数为 `2295`，位于要求的 `2000–2300` 内。E-zh v8 指定的唯一返修已确认：C:101/C:103 已改为自然的“创建多人存档”及 `Multiplayer（Profit margins）` 读者-facing表达，旧短语 `create multiplayer save` 在当前 C 中为 0 次，未发现价格、公式、边界、多人存档分支、来源集合、图位、内链或编码卫生回归。

本报告只对绑定 SHA 的静态正文结算；浏览器、页面装配、实际媒体、构建、typecheck、test、live HTTP、生产/CDN、部署和其他下游状态均不代签，详见第 8 节。

| 审核面 | 结果 | 真实证据 |
|---|---|---|
| C SHA 绑定 | **PASS** | `sha256sum` exit 0；输出为 `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699  docs/blog-ops/profit-margin-stardew/C-zh-draft.md`。 |
| V7 `zh-CN` 正文长度 | **PASS** | 计数脚本 exit 0；`mechanical_units=2295`、`required_floor=2000`、`meets_mechanical_floor=true`，`Sources` 已排除。 |
| E-zh v8 唯一返修 | **PASS** | C:101/C:103 均使用“创建多人存档”；C:103 使用 `Multiplayer（Profit margins）`；`create multiplayer save` 在 C 全文 0 次。 |
| H1/heading | **PASS** | `h1=1`、`h2=6`、`h3=12`、`h4_plus=[]`；H1 与 B-zh 工作 H1 完全一致；`Sources` 为文末唯一 H2。 |
| Figure IDs | **PASS** | `fig-01-price-boundary` 仅 C:48 一次；`fig-02-advanced-options-path` 仅 C:99 一次。 |
| 站内内链 | **PASS（静态真实性）** | `/zh/how-to-earn-money-stardew` 仅出现一次；identity/copy/registry 均有当前源码回读证据。 |
| 价格/公式/边界 | **PASS** | 四档、0.75 倍、1g 下限、Wheat `25g → 6g`、Crab Pots `1,500g` 及受影响/不受影响类别均保留。 |
| 多人存档分支 | **PASS** | 100% 为 `New Game` 分支；非 100% 为“合作”/`Host New Farm` 多人创建、创建多人存档、房主单独游玩。 |
| 公开来源集合 | **PASS（静态集合）** | 仅四个允许的 Stardew Valley Wiki URL；`Sources` 中各出现一次。 |
| UTF-8/NFC/LF/泄漏卫生 | **PASS** | UTF-8 strict、NFC/LF、LF 换行、无 BOM/CRLF/NUL/尾随空白；私有绝对路径、本地服务地址、工作流词和秘密标记均为空。 |

## 2. 版本绑定与命令证据

### 2.1 当前 C SHA

命令：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

退出码：`0`

真实输出：

```text
0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

### 2.2 正式 V7 `zh-CN` 计数

命令：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

退出码：`0`

真实关键输出：

```json
{
  "locale": "zh-CN",
  "mechanical_units": 2295,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["Sources"],
  "omitted_line_counts": {
    "headings": 19,
    "code": 0,
    "excluded_sections": 9,
    "non_body": 59,
    "frontmatter": 0
  },
  "sha256_raw": "0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699",
  "sha256_nfc_lf": "0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699"
}
```

`semantic_qualification=requires_independent_review` 是 V7 计数脚本的保守提示，不是失败；本报告完成独立静态语义门。

### 2.3 输入与 V7 规则/脚本哈希

命令：

```sh
sha256sum \
  docs/blog-ops/profit-margin-stardew/A-zh-research.md \
  docs/blog-ops/profit-margin-stardew/B-zh-layout.md \
  docs/blog-ops/profit-margin-stardew/project-interface-spec.md \
  src/blog/blog-post-identities.ts \
  src/blog/blog-copy.ts \
  src/blog/blog-post-registry.tsx \
  /Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md \
  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

退出码：`0`

真实输出：

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  docs/blog-ops/profit-margin-stardew/A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  docs/blog-ops/profit-margin-stardew/B-zh-layout.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  docs/blog-ops/profit-margin-stardew/project-interface-spec.md
be6cdf465126189167dc2517e326c1d1840114b0a55aa7a88a2144a64f6f4f87  src/blog/blog-post-identities.ts
e2a6af61c7c2473dc317e803384faf061b3f97f08d39741f867d2b363dc84eee  src/blog/blog-copy.ts
f3b350c07705164562e5c7919ffae1968b1d268a7f28a99456a26df336724ffd  src/blog/blog-post-registry.tsx
2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1  /Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

## 3. E-zh v8 唯一返修回归

E-zh v8 只要求 C:101/C:103 的 Figure 2 reader-facing 文案去除机械动作短语并把原始 fragment 改成自然页面名称。本次当前 C 的精确行内容为：

```text
C:101  > **图片替代文本（alt）：** 星露谷物语平台中立的 Profit Margin 流程示意：100% 从 `New Game` 进入 `Advanced Options`；非 100% 先从标题画面的“合作”/`Host New Farm` 进入多人创建流程，在 `Profit Margin` 中选择档位并创建多人存档。
C:103  > **图注：** 这是平台中立的两条路径示意：100% 为 `New Game` → `Advanced Options`；非 100% 为“合作”/`Host New Farm` → 多人角色创建 → `Profit Margin` → 创建多人存档。依据公开 Options、Multiplayer（Profit margins）与 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。
```

静态探针退出码：`0`。真实关键输出：

```text
old_create_phrase_count=0
c101_c103_old_phrase_absent=True
c103_raw_fragment_absent=True
c101_c103_natural_phrase=True
```

`Multiplayer#Profit_margins` 仍作为允许的公开 URL fragment 出现在来源链接中；它没有出现在 C:103 的 reader-facing 页面名称里。`New Game`、`Advanced Options`、`Profit Margin` 和 `Host New Farm` 保留为必要的 UI/设置名称；普通动作已使用自然中文“创建多人存档”。

## 4. H1、heading 与图位

独立静态扫描命令为只读 Python 探针，退出码：`0`。

真实输出：

```text
h1_count=1 h1=[(1, '星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选')]
h2_count=6 h2=[(3, '星露谷物语的 Profit Margin（利润率）到底改变什么？'), (11, '100%、75%、50%、25% 分别代表什么？'), (26, '哪些价格会随利润率变化，哪些不会？'), (54, '单人、多人和挑战存档怎么选利润率？'), (86, '新农场在哪里设置 Profit Margin？'), (117, 'Sources')]
h3_count=12 h4_plus=[]
b_work_h1='星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选'
h1_exact_b_work_h1=True
sources_headings=[(117, '## Sources')]
last_heading=[(117, '## Sources')]
fig-01-price-boundary count=1 lines=[48]
fig-02-advanced-options-path count=1 lines=[99]
```

结论：没有正文第二个 H1；H1 与 B-zh 的工作 H1 一致；`Sources` 是末尾唯一 Sources H2；两个 figure ID 均唯一，位置与 B-zh 图位职责相符。

## 5. 价格、公式、边界与多人存档分支

### 5.1 受保护的价格与公式

当前 C 保留以下受保护语义：

- 四档为普通/Normal（100%）、75%、50%、25%，表格明确使用“按标准倍率计算 / 按四分之三计算 / 按一半计算 / 按四分之一计算”。
- Profit Margin 是受影响出售物品与列出种子价格的倍率，不是现实会计里的净利润比例；不能反推建筑、升级或奖励。
- 价格小数截断为整数，最低不低于 1g；当前 `Wheat` 示例仍是普通档位 `25g`、25% 档位显示 `6g`。
- 受影响侧保留来源列举的多数出售物品、Pierre 种子和指定 Joja 商品；不受影响侧保留铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。
- `Willy` 的 `Crab Pots` 仍为 `1,500g` 固定对照；未知价格仍要求回到清单核验，未扩写成全商店统一缩放。

透明算术命令：

```sh
python3 - <<'PY'
from math import floor
value = 25 * 0.25
print(f'25g*25%={value:g}g')
print(f'floor={floor(value)}g')
print(f'max(1g,floor)={max(1, floor(value))}g')
PY
```

退出码：`0`

真实输出：

```text
25g*25%=6.25g
floor=6g
max(1g,floor)=6g
```

### 5.2 多人存档分支

独立回读 C:7、C:88、C:92–C:95、C:101、C:103、C:107、C:111、C:115：

- 100%：从 `New Game` 进入角色创建/`Advanced Options`，创建普通新农场。
- 75%/50%/25%：从标题界面的“合作”/`Host New Farm` 进入多人创建流程，在 `Profit Margin` 中选择档位并创建多人存档。
- 非 100% 的单人玩法边界仍明确为：房主随后可以单独游玩已创建的多人存档。
- Figure 2 alt/caption 同时保留两支，且不回退为普通 `New Game` 可选四档；正文未引入旧存档编辑、Mod、平台专属按钮或固定收益/进度承诺。

### 5.3 回归探针

```text
required_fragments=26 missing=[]
old_create_phrase_count=0
c101_c103_old_phrase_absent=True
c103_raw_fragment_absent=True
c101_c103_natural_phrase=True
```

## 6. 唯一真实站内内链与公开来源集合

### 6.1 唯一真实站内内链

C-zh Markdown 链接扫描退出码：`0`。

真实输出：

```text
links=['/zh/how-to-earn-money-stardew']
count=1 unique=['/zh/how-to-earn-money-stardew']
```

只读回读当前项目源：

```text
src/blog/blog-post-identities.ts:14  "how-to-earn-money-stardew"
src/blog/blog-copy.ts:136       "how-to-earn-money-stardew": "/zh/how-to-earn-money-stardew"
src/blog/blog-post-registry.tsx:549  slug: "how-to-earn-money-stardew"
```

结论：内链指向当前源码已注册的中文文章身份；这只是静态 identity/copy/registry 真实性，不证明 live HTTP、页面装配或生产可达性。

### 6.2 公开来源集合

C 全文 URL 静态扫描退出码：`0`。

允许且实际出现的 URL 及全文计数：

```text
https://zh.stardewvalleywiki.com/选项                  => 3
https://stardewvalleywiki.com/Options                  => 3
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 5
https://stardewvalleywiki.com/Getting_Started           => 2
unexpected_urls=[]
```

`Sources` 区块静态计数：

```text
https://zh.stardewvalleywiki.com/选项                  => 1
https://stardewvalleywiki.com/Options                  => 1
https://stardewvalleywiki.com/Multiplayer#Profit_margins => 1
https://stardewvalleywiki.com/Getting_Started           => 1
sources_each_once=True
```

结论：Sources 仍只列四个允许的 Stardew Valley Wiki 公开来源；没有论坛、Reddit、Steam、Mod、搜索结果、内部研究 URL 或私有路径。这里仅结算静态来源集合，不将 URL 存在性冒充 live HTTP 证据。

## 7. UTF-8、NFC/LF 与泄漏卫生

校正后的 Python 字节/文本扫描退出码：`0`。

真实输出：

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
assertions_failed=[]
```

说明：公开 `https://` 来源 URL 与合法 `/zh/...` 内链不是泄漏；C-zh 未出现 `/Users/...`、本地服务地址、agent/worker/dispatch/coordinator、研究字段、私有流程、密钥或秘密标记。

## 8. 明确的范围外 UNVERIFIED 项

以下均为 **UNVERIFIED（范围外，未执行）**，不能由本报告的静态 PASS 代签：

- **browser / ego-browser：UNVERIFIED**；未打开中文文章页面，未做 DOM、视觉、响应式或可访问性验收。
- **page assembly / route / DOM / accessibility：UNVERIFIED**；未验证 `PublicBlogHandoff`、文章壳、路由、metadata、canonical、hreflang、schema 或装配结果。
- **media：UNVERIFIED**；未验收 cover/figure 的真实 WebP/AVIF、尺寸、字节预算、权利、`PublicPicture` 绑定、加载属性、移动端可读性或渲染。
- **build / typecheck / test：UNVERIFIED**；未运行 Next build、TypeScript/typecheck、Vitest、静态导出或仓库测试。
- **live HTTP / production / CDN / indexing：UNVERIFIED**；未请求生产站点，未验证线上路由、CDN、收录或排名。
- **deploy：UNVERIFIED（未执行）**；没有部署或生产写入。
- **commit / push / database / external writes：未执行**；没有提交、推送、数据库变更或任何外部服务写入。

## 9. 写入范围与空白检查

写入前目标报告不存在：

```text
precondition=PASS absent
```

本次只创建本报告；C/A/B/E、接口规格、源码和其他既有文件未写入。

命令：

```sh
git diff --check
git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实退出码：

```text
git diff --check                         exit=0
git diff --no-index --check .../C-zh-draft.md  exit=1
```

`git diff --no-index --check` 的 exit `1` 仅表示 `/dev/null` 与当前未跟踪 C 文件存在内容差异；没有 whitespace diagnostic output。C 的逐行尾随空白探针为 `trailing_whitespace=[]`，因此空白卫生结论为 **PASS**。

**最终结论：** 绑定 SHA `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` 的 C-zh 静态内容 **PASS**；V7 计数 `2295/2000–2300`；E-zh v8 唯一返修已自然落地且无指定静态回归。所有页面、媒体、构建、测试、live HTTP 和部署状态保持 **UNVERIFIED（范围外）**。

## 10. 任务要求命令补充

### 10.1 `shasum`

```sh
shasum -a 256 docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

退出码：`0`

真实输出与绑定值一致：

```text
0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

### 10.2 `rg` 静态探针

正向探针：

```sh
rg -n 'fig-01-price-boundary|fig-02-advanced-options-path|/zh/how-to-earn-money-stardew|创建多人存档|Multiplayer（Profit margins）' \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

退出码：`0`；命中 C:48、C:72、C:99、C:101、C:103 及多人存档分支行。

旧短语负向探针：

```sh
rg -n 'create multiplayer save' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

退出码：`1`，这是预期的“当前 C 不再出现旧短语”结果。
