# D-zh 最终独立检查 v6 — PASS

- **检查日期：** 2026-09-22（Asia/Shanghai）
- **检查对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **当前 C-zh SHA-256：** `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5`
- **结论：** **PASS（当前 C-zh 正文门）**。当前 C 的 V7 `zh-CN` 合格正文计数为 2034；C:13–C:16 已全部使用“计算”，价格表中没有“读取”，并且本报告逐项复核了 C:18、影响范围边界、引用、结构、公式、图位、静态卫生和来源可达性。
- **写入范围：** 本次只写入本报告；没有修改 C-zh、A/B zh、既有 D/E 报告、源码、媒体、配置、依赖、数据库或外部服务，没有 commit、push、deploy，也没有 spawn worker。
- **浏览器/页面装配范围：** 明确不在本次任务范围内；未运行浏览器验收、页面装配、构建、测试或部署检查，相关结论保持 **UNVERIFIED**。

## 1. 结论摘要

| 检查项 | 结果 | 当前命令证据 |
|---|---|---|
| C 版本绑定 | PASS | `sha256sum` 当前输出为 `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5`。 |
| V7 `zh-CN` 正文长度 | PASS | 排除 `Sources` 后 `mechanical_units=2034`，位于 `2000–2300` 内；`meets_mechanical_floor=true`。 |
| C:13–C:16 价格表措辞 | PASS | C:13、C:14、C:15、C:16 均含“计算”；价格表行 11–16 无“读取”。 |
| C:18 | PASS | C:18 保留“四档数值都表示价格倍率，但不代表每个商品都属于受影响范围”。 |
| C:38/C:48/C:111 | PASS | 分别使用“部分商店商品”或“来源列举的”限定，没有把来源清单扩写成全部商店/全部支出。 |
| C:14/C:26/C:70 | PASS | C:14 限定卖价与列出的种子价格；C:26 紧邻 Multiplayer 边界并阻断全局缩放；C:70 的站内内链仅 1 次。 |
| H1、层级和结构 | PASS | 1 个 H1、6 个 H2、12 个 H3、0 个 H4+，无层级跳跃；`Sources` 是唯一文末 H2。 |
| 公式、数字和事实边界 | PASS | 四档倍率、整数截断/1g 下限、Wheat `25g→6g`、Crab Pots `1,500g` 与当前公开来源回读一致。 |
| 两个图位 | PASS（正文语义）/UNVERIFIED（媒体资产） | 两个 figure ID 各出现 1 次，位置和 alt/caption 职责符合 B-zh；实际媒体、绑定、尺寸、权利和渲染不在本次范围。 |
| 内链 | PASS | Markdown 链接中以 `/` 开头的内部链接只有 `/zh/how-to-earn-money-stardew` 1 次。 |
| 公开来源 URL | PASS | 公开 URL 集合正好为中文 Options、英文 Options、英文 Multiplayer、Getting Started 四个；五个实际 URL 请求均 HTTP 200、无重定向。 |
| 私有路径/秘密泄漏 | PASS | 私有绝对路径、本地服务地址、流程词、凭据/秘密模式扫描均无命中。 |
| 编码/换行/尾随空白 | PASS | UTF-8 可严格解码；无 BOM、无 CRLF/CR、以 LF 结尾；尾随空白扫描无命中。 |
| Diff check | PASS（含未跟踪文件边界说明） | Git 工作树中 C 是未跟踪输入；`git diff --check -- C` 为 exit 0、无诊断；`git diff --no-index --check /dev/null C` 因文件内容差异 exit 1、无空白诊断。 |
| 浏览器/页面装配/下游交付 | UNVERIFIED（范围外） | 本次按任务要求不运行浏览器；页面组件、真实 DOM、构建、测试、部署、生产 HTTP 和外部状态不由本报告代签。 |

## 2. 输入版本与当前 C 绑定

### 2.1 当前 C SHA 与 V7 计数

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

真实输出：

```text
0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客/docs/blog-ops/profit-margin-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2034,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 19,
    "code": 0,
    "excluded_sections": 9,
    "non_body": 58,
    "frontmatter": 0
  },
  "sha256_raw": "0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5",
  "sha256_nfc_lf": "0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5"
}
```

`2034` 在要求的 `2000–2300` 区间内；`Sources` 由 `--exclude-heading Sources` 正式排除。脚本的 `requires_independent_review` 是保守语义提示，本报告已完成独立正文复核，不把它当作失败。

### 2.2 A/B 与最新 zh 报告输入 SHA

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  docs/blog-ops/profit-margin-stardew/A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  docs/blog-ops/profit-margin-stardew/B-zh-layout.md
df249962b2097d5f0b79bfe484e5e8cb5d3f8dd5f0e30ba450a5fe7029e61cfa  docs/blog-ops/profit-margin-stardew/D-zh-final-check-v5.md
ba4aba351cddd110621906e7f9ecc1f9ea999a8fedc6ce8a09ef06118a33bca9  docs/blog-ops/profit-margin-stardew/E-zh-final-review-v5.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

D/E v5 中记录的 C SHA 是 `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7`，不是当前 C 的 `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5`。因此 v5 的旧 SHA、旧计数和旧“C:14–16 读取”结论只作为历史输入；本报告不把它们当作当前证明。

## 3. C:13–C:16、C:18 与影响范围边界

### 3.1 价格表措辞

执行：

```sh
nl -ba docs/blog-ops/profit-margin-stardew/C-zh-draft.md | sed -n '9,18p'
rg -n '读取|计算' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

当前价格表真实内容：

```text
13 | 普通/Normal（100%） | 受影响价格按标准倍率计算 | 以游戏默认经济作为参照，适合不想额外收紧出售收入的开局。 |
14 | 75% | 受影响价格按四分之三计算 | 受影响的卖价与列出的种子价格都会降低，但仍保留标准玩法的框架。 |
15 | 50% | 受影响价格按一半计算 | 需要更仔细地安排受影响收入与种子支出的关系，适合主动增加经济约束的存档。 |
16 | 25% | 受影响价格按四分之一计算 | 这是明显收紧经济的挑战取向；固定类别不会因此一起变成四分之一。 |
```

独立脚本检查得到：

```text
price_table_calculation_hits=[13, 14, 15, 16]
price_table_read_hits=[]
```

因此 C:13–C:16 四行均使用“计算”，价格表中没有“读取”。C:22 仍有“按0.75倍读取”，但它在价格表之外，不影响本任务指定的 C:13–C:16/价格表门；本次不扩大范围改写该句。

### 3.2 C:18

当前 C:18 为：

```text
英文 [Options](https://stardewvalleywiki.com/Options) 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。
```

**PASS。** “四档数值”承接普通/100%、75%、50%、25% 四档；“价格倍率”与前句的倍数定义一致；后半句明确区分倍率规则和商品是否属于受影响范围，没有把倍率外推成全局商品规则。

### 3.3 C:38、C:48、C:111

```text
38 | ### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
48 | > **图片替代文本（alt）：** 星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
111 | - 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？
```

**PASS。** C:38 的“部分”阻断了“全部商店固定”的误读；C:48、C:111 的“来源列举的”限定了商店范围；C:40、C:111 明确保留建筑、工具升级和任务金币奖励边界，没有扩写成所有支出。

## 4. C:14、C:26、C:70、内链和公开来源出现次数

### 4.1 三个指定位置

```text
C:14  | 75% | 受影响价格按四分之三计算 | 受影响的卖价与列出的种子价格都会降低，但仍保留标准玩法的框架。
C:26  | 判断一个数字时，先看它属于下表哪一列，再看当前档位；[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)给出这份影响范围清单；“大多数”和“指定商品”不能扩写成所有商店统一缩放。
C:70  | 如果你还在安排前期现金顺序，可以阅读[第一年赚钱与预算指南](/zh/how-to-earn-money-stardew)；那篇文章解决预算行动，本页只说明 Profit Margin 改变哪些价格前提。
```

**PASS。** C:14 只说受影响卖价和列出的种子价格，且降低卖价/种子价格的表述与 A/B 的事实边界一致；C:26 紧邻完整影响范围来源并保留“大多数/指定商品”限制；C:70 只补充预算背景，没有新增第二 ReaderTask。

### 4.2 URL 集合和计数

使用 Markdown 链接解析得到：

```text
internal_links=['/zh/how-to-earn-money-stardew']
internal_link_count=1
public_url_set_exact=True
public_url_counts={
  'https://zh.stardewvalleywiki.com/选项': 3,
  'https://stardewvalleywiki.com/Options': 2,
  'https://stardewvalleywiki.com/Multiplayer#Profit_margins': 4,
  'https://stardewvalleywiki.com/Getting_Started': 2
}
```

公开 URL 只包含 B-zh 规定的四个读者可读来源；没有把 A-zh 的 SERP、论坛、Mod、研究路径或内部资料链接泄漏到 C。站内内部链接恰好 1 次。

## 5. H1、公式、事实和图位

### 5.1 结构

独立 Markdown 结构扫描输出：

```text
h1=1
h2=6
h3=12
h4_plus=0
heading_jumps=[]
Sources_heading_lines=[115]
```

C:1 是唯一 H1；没有 H4+ 或层级跳跃；`Sources` 是文末唯一来源 H2。三张正文表分别承担四档查表、价格边界和场景选择，不是重复 FAQ。

### 5.2 公式与事实

当前 C 的公式/数字检查结果如下：

- 四档顺序为普通/100%、75%、50%、25%，并分别对应标准倍率、四分之三、一半和四分之一。
- C:18 明确 Profit Margin 是物品售出价格和种子价格的倍数；计算后小数截断为整数，最低不低于 1g，没有写成四舍五入。
- C:34 使用 Wheat 普通档位 `25g` 与 25% 档位 `6g`；`25g × 25% = 6.25g` 后按来源的截断规则显示 `6g`。
- C:40/C:50 使用 Willy 的 Crab Pots `1,500g` 作为明确固定价格对照，没有把一个例子外推成所有商店规则。
- C:54、C:59、C:68 的单人/多人/挑战建议是有条件的编辑判断，没有伪造固定收益、完成时间或“普遍最佳”数值。

本次只读回读的公开页面事实摘要：

- 中文 Options 页面显示普通/75%/50%/25%、物品售出价格倍数、可调低以提高难度、整数截断/最低 1，以及新游戏角色创建界面的扳手进入高级游戏设置。
- English Options 页面显示 Profit Margin 是售出物品价格和种子价格的倍数，小数价格截断为整数且不低于 1g。
- Multiplayer 页面显示 25% 时 Wheat 为 6g 而非 25g；Pierre 种子以及 Joja 的 Grass Starter、Sugar、Wheat Flour、Rice 随档位缩放；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不受影响；Crab Pots 仍为 1,500g。
- Getting Started 页面显示角色创建菜单的扳手包含 Advanced Options，其中包括 changing the profit margin。

### 5.3 两个正文图位

```text
fig-01-price-boundary count=1, C:46–50
fig-02-advanced-options-path count=1, C:97–101
```

**PASS（正文语义）。** Figure 1 在价格矩阵、Wheat/Crab Pots 示例之后且选择建议之前，职责是区分会缩放价格与来源列举的固定类别；Figure 2 在新农场高层路径之后且创建前清单之前，职责是说明扳手/高级设置到 Profit Margin 的平台中立路径。两个图位均有 alt/caption，并明确不是平台实机截图。

实际 WebP/AVIF 文件、同名绑定、尺寸/字节预算、版权或使用权、页面 `PublicPicture` 绑定、图中文字移动端可读性和渲染状态不在本次范围，均保持 **UNVERIFIED**。

## 6. 来源 URL 可达性与正文卫生

### 6.1 URL 可达性

执行只读请求：

```sh
curl -fsS -L --max-time 20 -o /dev/null \
  -w '%{http_code} %{url_effective} redirects=%{num_redirects}' <url>
```

真实结果：

```text
zh-options exit=0 200 https://zh.stardewvalleywiki.com/选项 redirects=0
options exit=0 200 https://stardewvalleywiki.com/Options redirects=0
multiplayer exit=0 200 https://stardewvalleywiki.com/Multiplayer#Profit_margins redirects=0
getting-started exit=0 200 https://stardewvalleywiki.com/Getting_Started redirects=0
site-inner exit=0 200 https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

五个 URL 均 HTTP 200、退出 0、无重定向。HTTP 可达性只证明当前地址可访问，不代签页面装配、SEO、浏览器渲染或部署。

### 6.2 私有路径、秘密和流程残留

执行模式扫描：

```sh
rg -n -i 'dispatch|worker|coordinator|agent|SERP|PAA|docs/blog-ops|A-zh|B-zh|C-zh|D-zh|/Users/|/home/|file://|localhost|127\.0\.0\.1|0\.0\.0\.0|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|token|password|secret|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

真实结果：exit 1、无输出。没有发现私有绝对路径、本地服务地址、调度/代理/SERP/PAA/研究流程词、token/password/secret 或常见密钥格式。

### 6.3 编码、换行和尾随空白

独立字节检查输出：

```text
utf-8 strict decode=PASS
utf8_bom=False
crlf_count=0
cr_count=0
lone_cr_count=0
lf_count=124
final_lf=True
trailing_whitespace_lines=[]
```

`C-zh-draft.md` 是可严格解码的 UTF-8，无 BOM，使用 LF 换行并以换行符结束；逐行尾随空白扫描无命中。

### 6.4 Diff check 与未跟踪文件边界

目标博客目录的 Git 状态显示 A-zh、B-zh、C-zh 和 v5 D/E 报告均为工作树未跟踪输入；v6 报告在写入前不存在。对 C 执行：

```sh
git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=0；无输出

git diff --no-index --check -- /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit=1；无输出（exit 1 是 /dev/null 与未跟踪文件存在内容差异的正常状态）
```

因此没有发现 diff 空白诊断；同时明确，普通 `git diff --check` 对未跟踪文件不会提供内容差异证据，尾随空白结论由上面的逐行扫描和字节检查提供。

## 7. 范围结算和未验证项

### 7.1 当前 C-zh 结算

绑定当前 SHA `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5` 的 C-zh 正文：**PASS**。

所有本次指定的内容门均通过：

- V7 `zh-CN` 正文计数 `2034/2000–2300`；
- C:13–C:16 全部为“计算”，价格表无“读取”；
- C:18 新措辞；
- C:38/C:48/C:111 影响范围边界；
- C:14/C:26/C:70 一致性及唯一站内内链；
- H1/层级、公式、数字、图位语义；
- 四个公开来源 URL 的精确集合、出现次数和当前可达性；
- 私有路径/秘密泄漏、UTF-8、LF、尾随空白和 diff 空白诊断。

### 7.2 明确保持 UNVERIFIED（范围外，不修复）

- 最终 Title/Description、slug、author、metadata、canonical、hreflang、schema、sitemap、robots、llms.txt；
- 实际封面和两个图位的 WebP/AVIF 文件、尺寸、字节预算、权利记录、页面绑定、加载属性、图中文字和移动端可读性；
- 页面组件、route、共享文章壳、真实 DOM、可访问性、Next build、TypeScript、Vitest、静态输出；
- 本地 ego-browser 桌面/移动端、页面装配、浏览器截图和生产站 HTTP；
- 部署、CDN、收录、排名、转化或任何外部写入。

本次未发现需要在 C-zh 或其他源文件中修复的范围内问题；C:22 的“按0.75倍读取”是价格表之外的非门控措辞观察，未扩大用户指定范围处理。
