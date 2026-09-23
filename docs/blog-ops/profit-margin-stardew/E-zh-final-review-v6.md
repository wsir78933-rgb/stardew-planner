# E-zh 最终独立内容审核 v6 — REVISE

- **审核日期：** 2026-09-22（Asia/Shanghai）
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **对照输入：** `A-zh-research.md`、`B-zh-layout.md`、`D-zh-final-check-v6.md`、`project-interface-spec.md`、V7 `22条鉴文规则.md` 与 V7 正文计数脚本。
- **当前 C-zh SHA-256（本次独立重新计算）：** `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5`
- **D-zh v6 SHA-256：** `77f28d67fa85bd84f016165a04996037400da3003a30fcb91cbe4ca2fd17a79a`；D v6 绑定同一当前 C SHA，D 结论为 PASS，但本报告不把 D 结论当作 E 证据。
- **写入边界：** 本次只写入本报告；没有修改 C-zh、A/B、D/E 其他报告、源码、媒体、配置、依赖、数据库或外部服务，没有 commit、push、deploy、本地 ego-browser 操作、页面装配或 spawn worker。

## 1. 结论

**REVISE。** 当前 C-zh 已通过四档价格表、C:18 全局边界、C:38/C:111 范围限定、事实/公式/来源、文章意图与完整性、H1/结构、图位职责、站内内链真实性和 2,034 合格单位长度门；但独立复核发现三处仍应返 C：C:22 的“按0.75倍读取”不是自然的价格计算表达，C:48 alt 的“升级”不如来源边界要求的“工具升级”精确，C:60 的“必须接受预算判断更重要”是明显不自然且不完整的句子。

最小修订不增加事实、不改变 ReaderTask：把 C:22 的“读取”改为“计算”（并把“相关种子”收窄为“列出的种子”）；把 C:48 的“升级”改为“工具升级”；把 C:60 改成“需要接受更紧的预算约束”或等义自然中文。修订后必须重新计算 C SHA，并重新执行 D/E 内容门。

| 审核面 | 结果 | 当前证据 |
|---|---|---|
| 当前 C SHA 绑定 | PASS | 本次 `sha256sum` 为 `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5`；D v6 绑定同一值。 |
| V7 `zh-CN` 正文长度 | PASS | `mechanical_units=2034`，在 B-zh 要求的 `2000–2300` 内；排除 `Sources`。 |
| C:13–C:16 | PASS | 四行均使用“计算”；当前价格表没有“读取”。 |
| C:18 | PASS | “四档数值都表示价格倍率，但不代表每个商品都属于受影响范围”保留了倍率与影响范围的边界。 |
| C:38 | PASS | “部分商店商品”没有扩写成全部商店。 |
| C:48 | **REVISE** | “来源列举的”保留了商店范围，但“升级”过宽；应明确为“工具升级”。 |
| C:111 | PASS | 明确写出“来源列举的商店商品、建筑、工具升级和任务金币奖励”。 |
| C:22 中文自然度/边界 | **REVISE** | “按0.75倍读取”不符合价格计算的自然中文；“相关种子”比 A/B 的“列出的种子”更宽。 |
| C:60 中文自然度 | **REVISE** | “必须接受预算判断更重要”句法不完整，读者无法自然理解取舍。 |
| 文章意图与完整性 | PASS | H1 后直接回答定义，覆盖四档、受影响/不受影响范围、条件化选择、新农场路径和排错分支；没有扩成赚钱路线、计算器、Mod 或旧档教程。 |
| 公式、数字与公开来源 | PASS | 四档、截断/1g 下限、Wheat `25g→6g`、Crab Pots `1,500g` 与当前 Options/Multiplayer 页面回读一致。 |
| 两个图位 | PASS（正文语义）/UNVERIFIED（资产） | 两个语义 ID 各出现 1 次，alt/caption 有职责和来源限制；实际 WebP/AVIF、尺寸、权利、绑定和渲染未验。 |
| 站内内链 | PASS | `/zh/how-to-earn-money-stardew` 只出现 1 次；本地 registry 和当前公开 URL 均可确认该路由存在。 |
| 公开来源覆盖 | PASS | C 只使用中文 Options、英文 Options、英文 Multiplayer、Getting Started 四个公开来源；五个 URL 请求均 HTTP 200、无重定向。 |
| 页面/SEO 下游 | UNVERIFIED（范围外） | 最终 Title/Description、页面装配、metadata、schema、媒体、浏览器、构建、部署和生产状态不由本报告代签。 |

## 2. 独立版本绑定与输入证据

### 2.1 当前 C SHA 与 V7 计数

执行：

```sh
sha256sum docs/blog-ops/profit-margin-stardew/C-zh-draft.md
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

本次真实关键输出：

```text
0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

```json
{
  "locale": "zh-CN",
  "mechanical_units": 2034,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["Sources"],
  "sha256_raw": "0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5",
  "sha256_nfc_lf": "0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5"
}
```

`2034` 在 `2000–2300` 内；脚本的 `requires_independent_review` 是保守提示，本报告完成独立语义审核，不把它当失败。C 当前为严格 UTF-8、NFC 与原始文本一致、LF 换行且无尾随空白；结构为 1 个 H1、6 个 H2、12 个 H3、0 个 H4+，`Sources` 起始于第 115 行。

### 2.2 输入 SHA

```text
4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee  docs/blog-ops/profit-margin-stardew/A-zh-research.md
77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775  docs/blog-ops/profit-margin-stardew/B-zh-layout.md
0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
77f28d67fa85bd84f016165a04996037400da3003a30fcb91cbe4ca2fd17a79a  docs/blog-ops/profit-margin-stardew/D-zh-final-check-v6.md
95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d  docs/blog-ops/profit-margin-stardew/project-interface-spec.md
2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1  /Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md
c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

D v6 报告本身的当前 SHA 是 `77f28d67fa85bd84f016165a04996037400da3003a30fcb91cbe4ca2fd17a79a`。D v5/E v5 绑定的旧 C SHA 是 `3923e5b51510da7db61b34fc21521835bc4fae9dce4356b57d3db927f58514f7`，不能替代当前 C 证据。

## 3. 指定旧问题的独立复核

### 3.1 C:13–C:16 必须使用“计算”

当前实际行：

```text
13 | 普通/Normal（100%） | 受影响价格按标准倍率计算 | …
14 | 75% | 受影响价格按四分之三计算 | …
15 | 50% | 受影响价格按一半计算 | …
16 | 25% | 受影响价格按四分之一计算 | …
```

**PASS。** 四行都使用“计算”，价格表中没有“读取”。D v6 对这一项的 PASS 与当前文件一致。

### 3.2 C:18 不得暗示所有商品受影响

当前 C:18：

> 英文 [Options](https://stardewvalleywiki.com/Options) 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。

**PASS。** 后半句明确把“档位是倍率”与“某商品是否纳入影响范围”分成两个判断层次；它与 C:26、C:30、C:36 的“大多数/指定商品/其他购买项目待回到清单”限制一致。

### 3.3 C:38、C:48、C:111 的受影响/不受影响边界

当前实际行：

```text
38 | ### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励
48 | > **图片替代文本（alt）：** …以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
111 | - 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？
```

- **C:38 PASS：** “部分商店商品”阻断了“全部商店商品不受影响”的外推，且标题明确包含工具升级和任务奖励。
- **C:48 REVISE：** “来源列举的”保留了来源边界，但“升级”缺少“工具”限定；图片 alt 是读者可读文本，不能依赖 C:40 的正文来替它补完类别。最小改动：`建筑、升级和任务金币奖励` → `建筑、工具升级和任务金币奖励`。
- **C:111 PASS：** 完整写出“来源列举的商店商品、建筑、工具升级和任务金币奖励”，是三处中边界最精确的一处。

## 4. 文章意图、完整性、SEO 与结构

### 4.1 ReaderTask 和内容覆盖

A-zh/B-zh 锁定的唯一 ReaderTask 是：理解新农场 Profit Margin 改变哪些价格、哪些来源列举的类别不跟着变，按单人/多人/挑战目标做条件化选择，并在新农场创建界面找到设置入口。当前 C 的顺序完整覆盖：

1. C:3–7 直接解释设置、四档和非全局边界。
2. C:9–22 解释四档、倍率、整数截断、1g 下限与 75% 问题。
3. C:24–50 用矩阵、Wheat、Crab Pots 和待核验分支说明影响边界。
4. C:52–82 按单人、多人、挑战目标做条件化选择，不承诺普遍最佳、固定收益或进度。
5. C:84–105 给出新农场的扳手/高级设置路径，并保留平台/版本限制和找不到入口时的停止分支。
6. C:107–113 用创建前检查收束。

**PASS。** 没有把文章扩成作物排行、第一年赚钱路线、Profit calculator、Mod、旧存档 XML 或平台专属教程；C:70 只有一处与预算行动相关的内链，不产生第二 ReaderTask。

### 4.2 SEO usefulness 与 Title/H1 对齐

**PASS（正文范围）。** C:1 的 H1 与 B-zh 锁定的工作 H1 完全一致：包含 `星露谷物语`、`Profit Margin`、中文释义和四档值，并直接承诺“是什么/怎么选”，与 `profit margin stardew valley` 的信息型概念解释意图匹配。C:3、C:9、C:24、C:52、C:84 的 H2 继续覆盖定义、四档、边界、选择和设置入口，前 100 字内已有直接答案与公开来源。

最终 SEO Title、Description、slug、author、canonical、hreflang 和 JSON-LD 仍不在 C-zh 内容草稿中，属于后续页面/交付门，不能由本报告猜测或代签。

### 4.3 公式和数字

**PASS。** 当前正文没有把现实会计“净利润/收入”当成游戏规则；C:18 明确 Profit Margin 是售出物品和种子价格的倍数，并说明小数向下截断且最低 1g。C:34 的 Wheat 示例为普通档位 `25g`、25% 档位显示 `6g`，即 `25g × 25% = 6.25g` 后按截断规则显示 `6g`；C:40/C:50 的 Willy Crab Pots `1,500g` 作为固定价格对照。上述数字与 Options/Multiplayer 页面当前回读一致。

### 4.4 图位、alt 与图注

| 图位 | 当前行 | 结果 |
|---|---:|---|
| `fig-01-price-boundary` | C:46–50 | PASS（位置/职责）/REVISE（alt 精度）；矩阵和两个数字例子之后、场景选择之前，职责清楚；alt 需把“升级”改成“工具升级”。 |
| `fig-02-advanced-options-path` | C:97–101 | PASS（正文语义）；路径之后、创建前清单之前，alt/caption 都说明是平台中立示意，不冒充实机截图。 |

实际 `.webp`/`.avif` 文件、同名绑定、尺寸/字节预算、权利、图中文字移动端可读性、`PublicPicture` 绑定和渲染均 **UNVERIFIED**；本次没有页面装配或浏览器范围。

## 5. 公开来源、来源覆盖与内链真实性

### 5.1 当前来源回读

本次只读回读以下公开页面，并以页面内容而不是 A/D/E 口头结论作事实依据：

| 页面 | 当前回读支持的主张 | URL 可达性 |
|---|---|---|
| 中文 Options | 普通/75%/50%/25%；利润率是物品售出价格的倍数；小数舍去且价格不低于 1；新游戏角色创建界面左下角扳手进入高级游戏设置。 | HTTP 200、无重定向 |
| English Options | Profit Margin 是售出物品价格和种子价格的倍数；小数价格截断为整数且不低于 1g。 | HTTP 200、无重定向 |
| Multiplayer — Profit margins | Wheat 在 25% 为 6g 而不是 25g；Pierre 种子和指定 Joja 商品缩放；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不受影响；Crab Pots 仍为 1,500g；降低档位用于多人生产力再平衡。 | HTTP 200、无重定向 |
| Getting Started | 角色创建菜单的扳手包含 Advanced Options，其中包括 changing the profit margin。 | HTTP 200、无重定向 |

C:5、C:18、C:26、C:68、C:86 和 C:117–124 的引用邻近性及 Sources 覆盖 **PASS**。C 没有把 A-zh 的 SERP、论坛、Mod、研究过程或内部路径暴露到读者正文；Markdown 公开 URL 集合正好是上述四个页面。

### 5.2 站内内链真实性

C:70 的 `/zh/how-to-earn-money-stardew`：

- 在 `src/blog/blog-post-identities.ts`、`src/blog/blog-post-registry.tsx` 和 `src/blog/blog-copy.ts` 中都有对应中文 slug/路由；
- 当前公开请求 `https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew` 返回 HTTP 200、无重定向；
- 目标文章确实处理第一年现金顺序、种子与预算行动，C:70 将其限定为预算背景，没有声称它提供 Profit Margin 计算器。

**PASS。** 内链路径、锚文本职责和文章边界均真实；不需要增加其他内链来凑数量。

## 6. C:22、C:48、C:60 的最小返修

### 6.1 C:22 — 价格计算动词与种子边界

当前：

```text
22  75%表示属于这套规则的价格按0.75倍读取，不是“你能保留75%的净利润”。受影响的出售物品和相关种子会按此档位处理；建筑、升级或奖励不能用这个数字反推。
```

问题：

- `按0.75倍读取` 与 C:13–C:16 已统一的“计算”不平行，也不是价格运算的自然中文；
- `相关种子` 比 A/B 规定的“列出的种子价格”更宽，容易弱化受影响范围边界；
- `建筑、升级或奖励` 未像 C:38/C:111 那样限定“工具升级”，但该句是在说不能由 75% 反推，风险较低。

最小建议（本报告不执行）：

```text
75%表示属于这套规则的价格按0.75倍计算，不是“你能保留75%的净利润”。受影响的出售物品和列出的种子会按此档位处理；建筑、工具升级或任务金币奖励不能用这个数字反推。
```

### 6.2 C:48 — alt 的范围精度

当前：

```text
以及来源列举的不受影响商店商品、建筑、升级和任务金币奖励。
```

最小建议：

```text
以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。
```

不增加“所有商店”“所有升级”或其他来源没有列出的类别。

### 6.3 C:60 — 句法和取舍

当前：

```text
| 有意进行经济挑战 | 25% | 受影响出售收入更紧，固定类别仍在，必须接受预算判断更重要。 |
```

问题：`必须接受预算判断更重要` 缺少自然的谓语结构，既不像完整判断，也没有清楚表达读者需要接受的取舍。

最小建议（二选一，推荐第一项）：

```text
| 有意进行经济挑战 | 25% | 受影响出售收入更紧，固定类别仍在，需要接受更紧的预算约束。 |
```

或：

```text
| 有意进行经济挑战 | 25% | 受影响出售收入更紧，固定类别仍在，预算安排会更重要。 |
```

## 7. V7 22 条鉴文规则逐项结果

规则依据：`/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md`。这是 definition/explainer + 条件化选择指南；平行表格、步骤和必要的边界说明按该规则的误判保护处理。

| # | 结果 | 当前 C 的 exact evidence / 判断 |
|---:|---|---|
| 1 | PASS | C:44 的未归类价格分支、C:105 的找不到入口分支都与读者判断直接相关，没有大量堆假想反驳。 |
| 2 | PASS | C:3–113 只输出设置定义、价格边界、条件化选择和新农场路径；没有把 A-zh 的 SERP/社区/工具资料全部搬入正文。 |
| 3 | PASS | C:11–16、C:28–30、C:56–60、C:90–93 的平行结构分别服务查表、边界、选择和步骤；属于规则允许的规格表/步骤平行。 |
| 4 | PASS | 未见“虽然……但是……”机械重复；让步和限制句均服务具体取舍或平台边界。 |
| 5 | PASS | `Profit Margin`、利润率、倍率、受影响/不受影响和固定类别用词稳定，没有无功能的重复命名。 |
| 6 | N/A | 机制解释文没有亲历故事或情绪曲线；没有伪造经历。 |
| 7 | PASS | 没有无来源的“所有人都以为……”；C:54、C:68、C:74 等改用玩家人数、节奏和约束条件。 |
| 8 | PASS | C:5、C:22、C:64、C:74、C:113 有必要的现实会计/全局倍率/普遍最佳区别；虽有多处“不是”，但每处承担不同事实边界，没有空洞模板堆叠。 |
| 9 | PASS | C:44、C:95、C:105 保留未归类价格、平台/版本 UI 和缺证据时停止的限制；已核实数字没有人为加疑虑。 |
| 10 | PASS | 四档、25g→6g、1,500g 和 1g 下限均有公开来源或透明算术；没有无来源的时间、收益或性能精确承诺。 |
| 11 | N/A | 没有“我曾失败/我们测试过”等需要核验的脆弱经历。 |
| 12 | PASS | C:90–93 的步骤被 C:86、C:95、C:105 限定为新农场的公开高层路径，没有变成旧档万能修复。 |
| 13 | PASS | C:44、C:74、C:82、C:105、C:113 都回到具体判断或边界，没有每段套通用金句。 |
| 14 | PASS | 说明、表格、示例、选择表、步骤和检查清单承担不同信息功能；没有连续段落只换词。 |
| 15 | PASS | C:54、C:59、C:68、C:78、C:82 的建议都有人数、节奏、预算或约束条件，不用“感觉”替代证据。 |
| 16 | PASS | C:5 是 H2 后第一段，直接回答 Profit Margin 改变哪些价格、四档和非全局边界，没有先放 CTA 或研究背景。 |
| 17 | PASS | 没有“值得注意”“事实上”“此外/而且”等无功能连接词成群出现。 |
| 18 | PASS | 正文反复使用 `Profit Margin`、四档、Wheat、Crab Pots、扳手/高级设置等稳定名称，没有刻意同义替换。 |
| 19 | **REVISE** | C:22 的“按0.75倍读取”不是自然价格计算表达；C:60 的“必须接受预算判断更重要”是非母语/不完整句法；C:48 的 alt 还需把“升级”精确化为“工具升级”。 |
| 20 | PASS | 两个图位明确是示意图而非截图；Wheat/Crab Pots 是来源数字例子，没有包装成作者亲测案例。 |
| 21 | PASS | C:107–113 以创建前检查和具体游戏经济边界结束，没有通用祝福或转化口号。 |
| 22 | PASS | C:113 回到部分价格和固定边界，没有把游戏设置升格为现实商业或宏大命题。 |

### 六类形式指纹

- **破折号：PASS。** 正文无密集破折号链；Sources 中 `Multiplayer — Profit margins` 是公开页面标题。
- **粗体：PASS。** 只用于设置路径和图位标签，没有粗体营销口号。
- **无用装饰符号：PASS。** 表格、步骤和 blockquote 图位都有任务用途，无 emoji 或装饰分隔。
- **助手残留：PASS。** 当前 C 无 SERP/PAA、agent、worker、私有路径、任务卡或调度词。
- **填充短语：PASS。** 未发现“值得注意”“事实上”等无功能填充成群出现。
- **泛泛积极结尾：PASS。** 结尾回到创建前检查与游戏经济边界。

## 8. 范围外与返修后的验收

以下事项保持 **UNVERIFIED**，不因本报告的内容结论而自动通过：最终 Title/Description、PublicBlogHandoff、页面 metadata/canonical/hreflang/schema、实际 cover/figure 资产、WebP/AVIF 尺寸与字节预算、版权、`PublicPicture` 绑定、页面 DOM、浏览器、Next build、TypeScript、Vitest、静态输出、部署、CDN、生产 HTTP、收录和排名。

建议 C 最小返修只触及 C:22、C:48、C:60。返修完成后必须：

1. 重新计算 `C-zh-draft.md` SHA-256；
2. 重新运行 V7 `正文计数.py --locale zh-CN --exclude-heading Sources`；
3. 重新检查 C:14–C:16、C:18、C:38/C:48/C:111、C:26、C:70、来源邻近性、内链可达性和 22 条鉴文；
4. 让 D 与 E 都绑定新的 C SHA 后再交 F 或页面装配。

**最终结论：当前 SHA `0bfed99b64dd0016763f1ce9ef9a23503c5db27fff91843f8dbbda75f877aaa5` 的 C-zh 正文为 REVISE；最小阻塞项是 C:22、C:48、C:60 的中文/边界精度修订。**
