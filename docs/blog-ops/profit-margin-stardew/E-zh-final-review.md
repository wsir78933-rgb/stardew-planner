# E-zh 最终独立审核（仅当前中文 C 稿）

审查时间：2026-09-22（Asia/Shanghai）。对象：`C-zh-draft.md`，本次原始 SHA-256 **`606d4f28d87653c0618a262feec8de5333387623e5f663584217ac6e5abc13b0`**。本报告是 E 的独立只读审查，不修改 C，也不沿用旧版 `E-zh-review.md` 的结论；C 一旦变更，本报告须重绑 SHA 重审。

## 总结

**REVISE。** 唯一 ReaderTask（理解四档价格边界并为新农场选择档位）完整，公开机制和示例基本有据，但两处措辞/引用需要局部修订。V7 机械计数 2009≥2000 仅是计数，不是语义放行；实际媒体、装配页面、平台 UI、锁后 Title/Description 均 **UNVERIFIED**。

| 检项 | 结论 | 最小证据 / 建议 |
|---|---|---|
| ReaderTask、事实范围 | PASS | C:5–113 围绕是什么、四档、变化边界、单/多人条件选择和新农场路径；未转成赚钱攻略、Mod 或旧档教程。 |
| 75% 档位措辞 | **REVISE** | C:14 “出售收入和列出的种子价格都比普通档位紧一些”把降低的种子购买价格也说成“紧”，易被读为支出更高；C:36、54 自己承认种子价格降低。最小改为“受影响的卖价与列出的种子价格都降低；固定费用不随之降低”，不要承诺净收益。 |
| 影响清单与出处邻近性 | **REVISE** | C:30 精确列 Joja 四项及不受影响类别，但紧邻表格没有 Multiplayer 引用，读者要回 C:5 或文末 Sources 才能核对；C:34 Wheat、C:40 Crab Pots 也无相邻链接。最小在表格前导句 C:26 或表后、两个数字示例所在句附近补同一公开 Multiplayer 链接；勿只依赖文末 Sources。 |
| 四档、取整、Wheat/Crab Pots | PASS（事实） | Options 写 Normal/75%/50%/25%，整数截断且最低 1g；Multiplayer 写 Wheat 25g→6g、Willy Crab Pots 1,500g。C:18、34、40 数值与公开文本吻合。C:30 的 most/指定商品没有扩成“所有”。 |
| 单人/多人选择 | PASS | Multiplayer 支持低档位抵消多人生产力，但不规定人数对应百分比；C:54–82 的建议均条件化，未冒充官方最优方案。 |
| 新农场入口 | PASS（高层文档路径） | 中文选项和英文 Options 说新建游戏角色创建界面左下角扳手；Getting Started 也给角色创建扳手/Advanced Options。C:86–105 明说平台中立、非实测。 |
| checked/date | **REVISE** | C:117 标签 `Checked 2026-09-22 against ... Options and Multiplayer.`：本次四页均实时 200 且读到对应正文，日期真实性 PASS；但该行只命名 Options/Multiplayer，文末另列 Getting Started，范围表达不完整。最小改为准确涵盖四页的 checked 标签，或明确仅核验了哪些页。 |
| 内链 | PASS（源码路径）；页面 UNVERIFIED | C:70 唯一 `/zh/how-to-earn-money-stardew` 服务前期预算背景；`src/blog/blog-copy.ts:136` 和 registry 中存在对应路径/slug。未启动页面，不宣称链接 HTTP 可达。 |
| H1、首段、关键词、层级 | PASS（稿面） | C:1 单一工作 H1 包含“星露谷物语 Profit Margin/利润率”和四档选择；C:5 直接回答；H2/H3 顺序无跳级，关键词自然出现。工作 H1 不是锁后 SEO Title。 |
| 两图语义 | PASS（图位）；媒体 UNVERIFIED | C:46–50 图1区分缩放/不缩放并给 Wheat/Crab Pots；C:97–101 图2是平台中立路径。两者 alt/图注不伪称实机截图；真实图、尺寸、格式、版权和渲染未验。`图位`/fig ID 是待装配标记，不应原样作为读者正文发布。 |
| 内部流程泄漏 | PASS（叙述）；装配 UNVERIFIED | `rg` 未见 ReaderTask、SEOTruth、A/B/D/F 阶段或审稿指令写进解释段；C:46、97 的图位标记和 C:115 的 Sources 是稿面结构，页面处理仍待核。 |
| 锁后 SEOTruth / 页面 | **UNVERIFIED** | 无最终 Title、Description、作者/slug、来源组件 checked label、schema 或成页浏览器证据；不能拿工作 H1 或此稿 SHA 代签。 |

## 22 条鉴文：逐项语义核查

规则来自本地 V7 `参考规则/22条鉴文规则.md`；PASS 表示本稿未命中该坏写法，不是 AI 分数。

| # | 结论 | 证据 |
|---:|---|---|
| 1 堵反驳 | PASS | C:42–44、103–105 只保留分类/平台必要边界。 |
| 2 知识倾倒 | PASS | C:70 把预算细节交内链，无赚钱攻略扩写。 |
| 3 匀速排比 | PASS | 表格/步骤平行结构承担比较与操作。 |
| 4 让步模板 | PASS | C:62–82 依场景推断，未机械“虽然但是”。 |
| 5 重命名概念 | PASS | Profit Margin/利润率名称稳定。 |
| 6 光滑情绪曲线 | N/A | 机制说明无个人情绪叙事。 |
| 7 虚构读者错误 | PASS | C:5、22 指明可核对的概念区别，未声称“人人误解”。 |
| 8 不是X而是Y密集 | PASS | C:5、22、64 的否定服务真实机制边界；略多但未取代正面解释。 |
| 9 过度确定 | PASS | C:64、68、95 限定推荐与平台路径。 |
| 10 虚假精确 | PASS | 四档和两个价格示例可从公开页核对，无虚构进度数字。 |
| 11 脆弱经历 | N/A | 无亲历故事。 |
| 12 万能步骤 | PASS | C:95、103–105 指明平台差异与找不到时的停止分支。 |
| 13 段段金句 | PASS | 结尾 C:107–113 是创建前检查。 |
| 14 均匀句式 | PASS | 定义、表格、数字例子、步骤节奏有任务差异。 |
| 15 感受代论证 | PASS | C:62–82 “适合”均有条件，机制回来源。 |
| 16 空钩子 | PASS | C:5 开门见山给定义和边界。 |
| 17 固定连接词 | PASS | 未见“值得注意”等填充链。 |
| 18 刻意同义替换 | PASS | 商品和设置名保持可识别。 |
| 19 翻译腔 | PASS | 主体为自然简体中文，英文保留为游戏选项/商品名。 |
| 20 虚构案例 | PASS | Wheat/Crab Pots 是公开 Wiki 示例，不伪称自测。 |
| 21 祝福结尾 | PASS | C:113 回到价格检查。 |
| 22 强行深刻 | PASS | 无现实商业或人生升华。 |

六类形式指纹：破折号过密 PASS；粗体过密 PASS（主要用于步骤/图位标签）；装饰符号 PASS；助手残留 PASS；填充短语 PASS；泛泛积极结尾 PASS。这里保护有用的表格、步骤与必要机制限制，不为“去 AI”牺牲准确性。

## 可复核命令与外部回读

- `shasum -a 256 docs/blog-ops/profit-margin-stardew/C-zh-draft.md`：exit 0，输出上述 `606d4f28...c13b0`。
- `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources`：exit 0，`mechanical_units=2009`，`required_floor=2000`，`meets_mechanical_floor=true`，`semantic_qualification=requires_independent_review`，SHA 与本报告一致。
- `curl -L -s -o /dev/null -w '%{http_code} %{url_effective}\n'` 分别回读英文 Options、中文选项、Multiplayer#Profit_margins、Getting_Started：各 HTTP 200，循环 exit 0。另以 `requests`/BeautifulSoup 只读抽取正文：Options 有四档、种子/售出倍率与截断；中文选项有扳手入口及四档；Multiplayer 有生产力、Wheat 6g/25g、种子/Joja 清单及 Crab Pots 1,500g；Getting Started 有角色创建扳手。HTTP 200 本身不代替上述正文核对。
- `rg -n 'Wheat|Crab Pots|Checked|checked|https?://|/zh/|图位|alt|图注|ReaderTask|SEOTruth|V7|SERP|F阶段|D阶段' C-zh-draft.md`：exit 0，定位 C:5、18、30、34、40、46–50、68、70、86、97–101、117–122；`rg -n '内部|流程|审稿|研究|待核验|图位|Sources|SEO|F阶段|D阶段|A阶段|B阶段|ReaderTask|Handoff|草稿' ...`：exit 0，仅见正文中的“待核验”及图位/Sources 等结构，不见内部工作流指令。
- `rg -n 'how-to-earn-money-stardew' src`：exit 0，`blog-copy.ts:136` 提供中文路径，registry 有 slug。
- `git diff --check`：exit 0；`git status --short`：exit 0，`?? docs/blog-ops/profit-margin-stardew/`（目录原本即未跟踪；本次仅新增本报告）。本次不做提交、构建、页面验收或外部写入。

**交接：** C 仅针对上列 REVISE 三点做最小文本/引用修订，再以新 SHA 重跑 D 与 E；媒体和最终 SEOTruth 留待锁稿与页面阶段证明。
