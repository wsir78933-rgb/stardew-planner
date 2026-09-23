# E-zh 最终独立审核 v2（仅当前中文 C 稿）

审查日期：2026-09-22（Asia/Shanghai）。

审查对象：`docs/blog-ops/profit-margin-stardew/C-zh-draft.md`。

本报告只读复核正文、A-zh 研究、B-zh 版式、D/E 历史检查、Project interface spec、V7 计数脚本和公开来源；只写入本报告，不修改 C-zh、其他正文、页面源码、配置、依赖、媒体、数据库或外部服务。历史 `D-zh-final-check.md`、`E-zh-final-review.md` 绑定旧 C SHA，本报告不沿用其结论。

## 1. 结论

**PASS（当前 C-zh 正文）。** 当前正文的唯一 ReaderTask、事实边界、引用邻近性、中文表达、可操作例子、两个图位语义和 22 条鉴文均可接受；最近 E-zh 指出的三类风险均已修复。没有需要退回 C 的具体行号。

这个 PASS 只覆盖当前 C 正文。锁后 SEO Title/Description、作者/slug/handoff、真实图片资产及 AVIF/WebP 绑定、页面装配、浏览器渲染、构建、部署和收录仍是 **UNVERIFIED**，不能从本报告扩展为页面或发布通过。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| C 当前版本绑定 | PASS | SHA-256 为 `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28`。 |
| V7 机械计数 | PASS | `mechanical_units=2019`，目标范围 2000–2300，`meets_mechanical_floor=true`。 |
| V7 语义资格 | PASS（本 E 审核） | 计数脚本仍保守输出 `semantic_qualification=requires_independent_review`；本报告完成独立语义复核，不把脚本字段冒充语义门。 |
| 最近三类风险 | PASS | C14、C26、C117–119 均已核对，见第 3 节。 |
| 来源、引用和日期 | PASS | 2026-09-22 重新回读四个公开 Wiki 页面，均 HTTP 200；页面主张与 C 的邻近链接一致。 |
| 平台/版本边界 | PASS | C95、C101、C105 明确是公开资料的高层路径，不冒充逐平台截图或固定版本行为。 |
| H1、搜索意图、正文结构 | PASS | C1 单一工作 H1；C5 首段直接定义；C3–113 始终围绕理解、选择和设置 Profit Margin。 |
| 公式/例子可操作性 | PASS | C18 给出截断和 1g 下限；C34 给出 Wheat 25g→6g；C40 给出 Crab Pots 1,500g 固定对照。 |
| 内链 | PASS（只读可达性） | C70 只有一次 `/zh/how-to-earn-money-stardew`，本次 HTTP 200；页面装配中的最终 link component 仍未核验。 |
| 两个图位 | PASS（语义）/UNVERIFIED（资产） | C46–50 与 C97–101 任务不重叠，图注保持平台安全；真实资产、尺寸、格式、权利和渲染未验。 |
| Title/Description 与页面 SEOTruth | UNVERIFIED | C 是正文稿，没有锁后 Title/Description、metadata、schema、handoff 或真实页面证据。 |

## 2. 版本绑定和输入

| 输入 | SHA-256 |
|---|---|
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| 当前 `C-zh-draft.md` | `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28` |
| `D-zh-final-check.md`（历史绑定） | `3b070a93f356a7ecdc29ffdf76de8fde260bc7aa76d247382a459118ff69a9cd` |
| `E-zh-final-review.md`（历史绑定） | `97cf9a4e75719364a1b1dd91d3fd330f608979713eb7625adccc656db64c4ab2` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |
| V7 `22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| V7 `正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |

当前 C 共 124 行。C 的修改会使本报告失效，必须以新 SHA 重跑本审核。

## 3. 最近 E-zh 三类风险复核

| 风险 | 结果 | 独立核对 |
|---|---|---|
| C14 的降低措辞 | **PASS** | C14 已改为“受影响的卖价与列出的种子价格都会降低”，不再把种子购买价格写成“紧”或暗示支出上升；C15–16、C22、C34–36、C54、C78 保持“受影响范围/固定类别”边界，不承诺净利润。 |
| C26 表格附近的 Multiplayer 公开链接 | **PASS** | C26 在表格前的边界句中直接链接 `https://stardewvalleywiki.com/Multiplayer#Profit_margins`，链接邻近“影响范围清单”“大多数/指定商品”限制；C68 还在多人再平衡处再次绑定同一公开页面。 |
| Sources 对中文 Options/Getting Started 的范围说明 | **PASS** | C117 明确 checked English `Options` 与 `Multiplayer`；C119 明确“also checked the Chinese Options and Getting Started pages”，C121–124 列出四个实际页面。该范围与本次 2026-09-22 回读一致，不包含私有研究日志或内部事实 ID。 |

## 4. V7 计数、qualified units 和图注排除口径

### 4.1 当前正文 SHA 和机械计数

实际命令：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

实际输出：

```text
a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

实际 V7 命令：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

实际输出（exit 0）：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客/docs/blog-ops/profit-margin-stardew/C-zh-draft.md",
  "locale": "zh-CN",
  "mechanical_units": 2019,
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
  "sha256_raw": "a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28",
  "sha256_nfc_lf": "a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28"
}
```

`2019` 位于 B-zh 的 `2000–2300` 中文合格单位范围内。这里的 qualified/mechanical units 按 V7 脚本口径只计可计数正文中的汉字：标题、Sources、URL、拉丁字母、数字、Markdown 结构和 blockquote 非正文均不计；该数值不是脚本自身的语义放行。

### 4.2 Sources 和图注边界复核

不排除 Sources 的对照命令输出（exit 0）：`mechanical_units=2088`。与正式的 `2019` 相差 `69`，即 Sources 的可见中文单位被正式命令排除。

用同一计数模块做边界复核的实际输出：

```text
raw_bytes= 10700
total_lines= 124
count_excluding_sources= 2019
count_including_sources= 2088
fig-01 blockquote: lines=5, raw_han=124, extracted_han=0
fig-02 blockquote: lines=5, raw_han=109, extracted_han=0
Sources section: lines=10, raw_han=71, extracted_han=0
omitted= {'headings': 19, 'code': 0, 'excluded_sections': 9, 'non_body': 58, 'frontmatter': 0}
```

因此：

- Figure 1 C46–50 的图位、alt、图注整段是 `> ` blockquote，V7 提取为 0 个正文单位。
- Figure 2 C97–101 的图位、alt、图注整段是 `> ` blockquote，V7 提取为 0 个正文单位。
- `Sources` 从 C115 开始，正式命令以 `--exclude-heading Sources` 排除；Sources 不参与 2019 的合格正文计数。
- `raw_han` 是未清理 Markdown/URL 的原始汉字观察值，不能替代 V7 的 `mechanical_units`；正式门只采用脚本输出。

## 5. 事实、来源、日期和引用邻近性

### 5.1 公开来源独立回读

本次在 2026-09-22 以只读 HTTP 请求回读四个公开页面；解析 HTML 的实际输出如下：

```text
zh-options: status=200; final=https://zh.stardewvalleywiki.com/%E9%80%89%E9%A1%B9; bytes=44575; footer=最后编辑于2026年5月12日 (星期二) 05:13。
  checks=利润率=True, 普通/75%/50%/25%=True, 角色创建界面左下角的扳手=True, 价格不会低于=True
options: status=200; final=https://stardewvalleywiki.com/Options; bytes=42048; footer=last edited on 16 March 2026, at 18:11.
  checks=Profit Margin=True, A multiplier applied to the price of items sold=True, A multiplier applied to the price of seeds=True, All fractional prices are truncated=True
multiplayer: status=200; final=https://stardewvalleywiki.com/Multiplayer; bytes=65202; footer=last edited on 15 August 2026, at 18:58.
  checks=Profit margins=True, Wheat=True, Grass Starter=True, Crab Pots=True, quest gold rewards are not affected=True
getting-started: status=200; final=https://stardewvalleywiki.com/Getting_Started; bytes=60334; footer=last edited on 16 August 2026, at 05:44.
  checks=At the character creation menu=True, Changing the profit margin=True
```

英文 Options 的 1g 原始 HTML 标记也单独复核，实际输出（exit 0）为：

```text
options_1g_marker= True fractional_marker= True
```

回读结果支持以下当前正文主张：

| C 位置 | 主张 | 结果 |
|---|---|---|
| C5、C9–18 | 普通/100%、75%、50%、25%；Profit Margin 作用于物品售出价格和种子价格，不等于现实净利润 | PASS；中文 Options 和英文 Options 均列出档位，英文 Options 明确两类价格倍数。 |
| C18、C34 | 小数价格截断为整数且最低 1g；Wheat 25g × 0.25 = 6.25g，截断显示 6g | PASS；英文 Options 支持截断/1g，Multiplayer 直接给出 25% 时 Wheat 为 6g 而非 25g。 |
| C26、C28–40 | 多数出售物品、Pierre 种子、指定 Joja 商品；铁匠/鱼店/旅行货车商品/建筑/工具升级/任务金币奖励不受影响 | PASS；Multiplayer 页面逐项支持，C 保留“多数/指定”而未外推为所有。 |
| C40、C50 | Willy 的 Crab Pots 仍为 1,500g | PASS；Multiplayer 页面直接给出该对照。 |
| C54、C59、C68 | 降低利润率用于多人生产力再平衡；具体档位是条件化编辑判断，不是人数对应表 | PASS；Multiplayer 支持再平衡理由，C 没有伪造“几人必须选多少”。 |
| C86、C90–105 | 新游戏→角色创建界面扳手/高级选项→Profit Margin；平台/版本细节不冒充实测 | PASS；中文 Options 与 Getting Started 支持高层入口，C95/101/105 保留未逐平台核验边界。 |

没有把中文“多人游戏”空页、论坛、Mod、计算器、SERP 或搜索排名写成机制来源。C 不写固定收益、完成时间、旧档 XML 或平台按钮的确定细节。

### 5.2 正文引用和 Sources

- C5 同时邻近中文 Options 与 Multiplayer：中文链接承接中文术语/四档，Multiplayer 链接承接非全局边界。
- C18 的英文 Options 链接邻近倍率、种子、截断和 1g 下限。
- C26 的 Multiplayer 链接位于矩阵前的完整边界说明，已解决旧版“表格附近缺少公开链接”的问题。
- C40 的 Wheat/Crab Pots 具体例子回到 C26/C68 的同一 Multiplayer 来源，未把单个例子外推成所有商品。
- C68 的 Multiplayer 链接邻近多人再平衡主张。
- C86 的中文 Options 与 Getting Started 链接邻近新农场路径。
- C117–124 的 Sources 只保留四个读者可访问的公开页面；checked 日期与本次实际回读日期一致。

来源/URL 只读可达性命令：

```sh
curl -LfsS --max-time 20 -o /dev/null -w '%{http_code} %{url_effective} redirects=%{num_redirects}\n' \
  https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew
```

实际输出（exit 0）：

```text
200 https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew redirects=0
```

正文中只有 C70 这一处内链；本次实际回读的有效 URL 是 `https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew`、HTTP 200、redirects=0。

## 6. 搜索意图、H1、中文自然度和可操作性

### 6.1 ReaderTask 和搜索意图

C1 的工作 H1 是“星露谷物语 Profit Margin（利润率）是什么？100%、75%、50%、25% 怎么选”，包含实体、定义问题和选择问题。C5 直接回答设置是什么；C9–22 解释四档、倍率、取整和 1g；C24–44 解释受影响/不受影响边界和异常价格处理；C52–82 按单人、多人、挑战目标做条件选择；C84–113 给出新农场设置路径和找不到选项时的安全分支。

正文没有扩成赚钱路线、季节作物排名、ROI/计算器、Mod、旧存档编辑或产品教程；C70 的唯一站内链接只补充预算背景。H1 是工作 H1，不是锁后 SEO Title；最终 Title/Description 仍需后续 handoff/页面阶段单独证明。

### 6.2 公式、例子和动作路径

- C18 明确“小数截断为整数且最低不低于 1g”，读者可以将倍率规则用于检查显示值。
- C34 给出可复核的 Wheat 例子：普通示例 25g，25% 先得 6.25g，再按来源规则截断为 6g；它没有把例外外推成所有物品。
- C40 给出固定边界对照：Willy 的 Crab Pots 仍为 1,500g；它和 Wheat 构成一项缩放、一项固定的可操作判断。
- C86、C90–93 给出新农场的四步高层路径；C95、C105 明确平台/版本差异时不猜按钮。
- C109–113 把人数、目标和价格边界收束成创建前检查，读者可据此决定是否创建新农场。

### 6.3 中文表达

当前中文整体自然、术语稳定，英文只保留游戏选项、页面名、商品名和必要 URL。`Profit Margin`、受影响/不受影响、固定类别、普通/100% 等名称没有无意义轮换；数字、表格和步骤均承担明确任务。没有检测到翻译腔、空钩子、泛泛祝福或助手口吻。

## 7. write-content 22 条 anti-slop / 可读性逐项审核

规则依据：V7 `参考规则/22条鉴文规则.md` 与本地 write-content anti-slop 要求。`PASS` 表示当前稿没有达到该规则的问题；`N/A` 表示该体裁没有可审材料，不是缺项。

| # | 结果 | 当前 C 证据 |
|---:|---|---|
| 1 | PASS | C24–44 保留真正影响价格分类和安全判断的边界；C95、C105 保留平台/版本限制，没有堆假想反驳。 |
| 2 | PASS | C5–113 都推进“理解、选择、设置 Profit Margin”这一任务；没有把研究中的赚钱、论坛、Mod、计算器材料全部搬入。 |
| 3 | PASS | C11–16 表格、C56–60 决策表和 C90–93 步骤的平行结构是查表/操作所需；解释段有长短变化，不是连续换词。 |
| 4 | PASS | 没有“虽然……但是……”机械重复；条件取舍在 C54、C59、C68、C78 处各自承担不同判断。 |
| 5 | PASS | C5、C18、C24–44、C52–113 稳定使用 Profit Margin、档位、受影响/固定类别等正式名称，没有反复造名。 |
| 6 | N/A | 当前是机制解释和设置选择文，没有冒充真实经历的情绪曲线或个人故事。 |
| 7 | PASS | C5、C22、C44、C64、C68、C74 针对具体会计、价格范围、最佳值和进度误读，不声称“所有读者都错”。 |
| 8 | PASS | C5、C22、C34、C44、C54、C64、C68、C74、C113 的否定/对照都服务于价格边界、净利润误读、平台限制或不作进度承诺；没有用空洞二元句替代解释。 |
| 9 | PASS | 已核实的四档、1g、Wheat、Crab Pots 明确陈述；未核验的未归类价格、平台按钮和版本行为在 C44、C95、C105 保留限制。 |
| 10 | PASS | 精确数字都能由公开 Options/Multiplayer 页面或透明算术复核；没有无来源的金币、日期、收益、进度或性能承诺。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等个人脆弱经历。 |
| 12 | PASS | C84–105 的步骤限定“新农场”，包含平台/版本前提和找不到选项时的停止分支，不把它写成旧档万能修复。 |
| 13 | PASS | C44、C64、C68、C74、C82、C109–113 的收束都完成分类、选择或创建前检查，没有每段强行升华。 |
| 14 | PASS | 正文混用定义段、表格、数字例子、有序步骤和检查清单；平行结构均有读者功能。 |
| 15 | PASS | C54、C58–60、C64、C68、C74、C78、C82 的“适合/可以先考虑”都带人数、节奏或约束条件；不是用感受替代来源事实。 |
| 16 | PASS | C1–7 在开头直接给定义、四档、价格边界和现实会计区分，没有先写痛点、CTA 或空泛承诺。 |
| 17 | PASS | 未见“值得注意”“事实上”等填充词堆叠；连接词服务条件和分支。 |
| 18 | PASS | `Profit Margin`、Normal、Wheat、Crab Pots、扳手/高级游戏设置等名称保持可识别，未做刻意同义替换。 |
| 19 | PASS | 简体中文句式自然，英文只保留必须的游戏/页面名；没有逐句英文模板或明显翻译腔。 |
| 20 | PASS | Wheat 与 Crab Pots 明确作为页面示例/边界例子使用，没有包装成作者亲测或虚构案例。 |
| 21 | PASS | C107–113 以人数、目标和价格类别的创建前检查结束，没有通用祝福或“开启旅程”句。 |
| 22 | PASS | C113 回到游戏经济前提和固定边界，没有跳到现实商业、人生或宏大价值判断。 |

### 六类形式指纹

- 破折号过密：PASS。正文没有连续破折号链；C123 的 `Multiplayer — Profit margins` 是公开来源标题，不是作者句式。
- 粗体过密：PASS。粗体只用于图位/alt/caption 标签和 C86 的路径强调，没有把普通句子装饰成模板。
- 无用装饰符号：PASS。无 emoji、装饰分隔或营销符号；表格和有序列表均有信息作用。
- 助手残留：PASS。内部流程、角色、调度、私有路径和凭据扫描均无命中。
- 填充短语：PASS。未命中 write-content 黑名单词和英文固定短语；中文填充连接词未成群出现。
- 泛泛积极结尾：PASS。结尾是创建前检查，不是鼓励式祝福。

## 8. 图位、平台安全图注和静态卫生

### 8.1 两个图位

| 图位 | 当前职责 | 结果 |
|---|---|---|
| `fig-01-price-boundary`，C46–50 | 把受影响价格与明确固定类别分开，标出 Wheat 25g→6g 与 Crab Pots 1,500g；alt/caption 没有增加未核验类别。 | PASS（语义）；实际媒体/权利/尺寸/格式/渲染 UNVERIFIED。 |
| `fig-02-advanced-options-path`，C97–101 | 展示新建游戏→扳手/高级设置→Profit Margin→四档→创建农场的高层路径。 | PASS（语义）；实际媒体/页面绑定 UNVERIFIED。 |

Figure 1 与 Figure 2 解决不同读者任务，未互相替代。两处图注均明确“不是某个平台的实机截图”或“不承诺所有平台按钮位置完全相同”；没有把图位当成最终图片资产。

### 8.2 平台、版本和流程边界

- C86、C90–93 是公开 Wiki 的文档化高层路径，不声称本次启动 PC、主机或移动端游戏实测。
- C95 明确 PC、主机、移动端的按钮位置、标签和版本行为不应被写成完全一致。
- C101 的图注再次限定来源为公开 Options/Getting Started，并拒绝实机截图和跨平台确定性。
- C105 缺少平台/版本证据时停在文档化路径，不猜另一个设置、旧档编辑方式或 Mod 行为。

### 8.3 流程泄漏、私有路径和空白

用户要求的扫描命令：

```sh
rg -n "^# |^## |Multiplayer|Checked|Options|Getting Started|/zh/how-to-earn-money-stardew|figure|dispatch|worker|SERP|PAA|docs/blog-ops|/Users/" docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

实际结果：exit 0；命中仅为公开 H1/H2、公开链接、Sources、图注和要求关键词，没有命中 `dispatch`、`worker`、`SERP`、`PAA`、`docs/blog-ops` 或 `/Users/`。

内部工作流扫描实际结果：exit 1、无输出；私有路径/凭据扫描实际结果：exit 1、无输出；这两个 exit 1 表示无匹配，不是未执行。

```sh
rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|Agent[ -]?[A-G]|\b(role|worker|coordinator|dispatch|handoff|assembly|bodyHash|mechanical_units|PublicReference|editor appendix|task card|internal)\b|A-zh|B-zh|C-zh|D-zh|project-interface|任务卡|调度|代理回执|私有路径|F阶段|G阶段|SEOTruth|V7' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 1；无输出

rg -n -i '/Users/|/home/|[A-Z]:\\|file://|localhost|127\.0\.0\.1|\.codex|\.hermes|docs/blog-ops|node_modules|[?&](token|key|secret|signature)=|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 1；无输出
```

静态检查实际结果：

```text
git diff --check -- docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 0；无输出

rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 1；无尾随空白命中
```

C 是未跟踪输入，`git diff --check` 不会把它当已跟踪 diff 展开；因此同时执行了尾随空白扫描。`git diff --no-index --check /dev/null C-zh-draft.md` 的 exit 1 是未跟踪文件 diff 的正常状态，且无输出，不作为空白错误。

## 9. Title/Description、页面和下游边界

当前 C 只提供工作 H1 和正文，不含最终 `BlogPostMeta`、SEO Title、Description、author、slug handoff、canonical、hreflang、Article JSON-LD 或页面组件。Project interface spec 要求这些字段由后续锁后 PublicBlogHandoff 提供；本 E 不猜、不代签。

同样，当前 checkout 的两个图位还没有在本报告中证明实际 `.webp`、同名 `.avif`、1672×941、≤400 KiB、合法使用依据、`PublicPicture` 绑定、lazy loading、桌面/移动可读性或真实文章路由渲染。没有运行 build、typecheck、Vitest、dev server、ego-browser、部署或生产 SEO smoke；这些不影响本次正文 PASS，但必须由后续阶段独立验收。

## 10. 审核结算

**最终正文结论：PASS。**

- 当前 C SHA 必须保持 `a67b715daf71b277fa8a708d8746dcdac6181bf16823b7e19141eb41f0581e28` 才能复用本报告。
- 最近 E-zh 的三类风险已修复；没有 C-zh 的 REVISE 行号。
- 任何正文改动、来源页面内容变化、checked 日期变化、图义变化或平台范围扩展，都必须重新绑定 SHA 并重跑 D/E。
- 页面 Title/Description、真实媒体、装配、浏览器、构建和部署不能用本报告替代。
