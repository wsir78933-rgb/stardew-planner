# A-en 补查：E-en C:58 / C:99 引用归属事实边界

- **角色：** Agent A-en supplement；独立事实与公开引用归属核验，不是 C 改稿、D/E 复核或 F 锁稿。
- **目标：** 独立核验 E-en 指出的英文 `C:58` 自然 Pine 地点引用归属风险，以及 `C:99` “normal Pine can mature in five days” 的来源边界。
- **核验日期：** 2026-09-22（Asia/Shanghai）。
- **读取范围：** `A-en-research.md`、`C-en-draft.md`、`D-en-check.md`、`E-en-review.md`、`project-interface-spec.md`，以及 V7 统一工作流、内容质量门、事实核验与公开引用、页面装配规则；没有修改这些文件。
- **写入边界：** 本次只新增本文件；未改正文、D/E/A/B/spec、代码、媒体、测试、package、git、commit、push、deploy、外部服务或秘密。
- **浏览器证据：** 使用本地 EGo Browser 独立导航并回读公开页面正文；未登录、未进行游戏存档实测、未进行外部写入。

## 1. 结论先行

1. **E-en 对 C:58 的事实边界确认成立。** `Pine Tree` 页面正文没有出现 `Cindersap Forest`、`the Railroad` 或 `Carpenter's Shop` 这三个地点组合；`Pine Tar` 页面正文明确列出三者。`Trees` 页面可支持普通树在 `Cindersap Forest` 与 `Railroad` 的泛位置规则，但没有 `Carpenter's Shop`，因此不能代替 `Pine Tar` 对三地点组合的直接支持。
2. **E-en 对 C:99 的低等级 source-locality 风险确认成立。** `Tree Fertilizer` 页面支持“已种下后施肥”、普通野生树逐阶段推进、末阶段两晚及冬季可生长；`Pine Tree` 页面才把结果直接归属于 Pine，并明确“施肥后五天（包括冬季）”。“normal Pine can mature in five days”不能只绑定 `Tree Fertilizer`。
3. **当前工作副本的 C:58/C:99 已出现局部来源拆分，但这不是本任务写入，也不是 D/E 通过证据。** 当前回读的 `C:58` 已分别链接 Pine Tree（泛交互）、Pine Tar（三地点示例）和 Trees（泛普通树位置/限制）；当前 `C:99` 已分别链接 Tree Fertilizer（通用施肥行为）和 Pine Tree（Pine 五天结果）。本报告不继续改正文；后续必须以当前 C 版本重新跑 D→E。
4. **PublicReference 的 quote/occurrence 必须重建。** E-en 记录的 C hash 为 `ce80bcb77dba1f01f07d5a446c857d97d39ba8f7b8acb3dacc9142b2cd0b3ad3`，本次读到的当前 C 原始 SHA-256 为 `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`。链接归属已经发生版本变化；在最终 C hash 上重建全量 `id/label/url/appliesTo/versionNote/quote/occurrence`，不能沿用 E 的旧 hash 或只修一个 occurrence。
5. **本补查不发布任何无条件 Pine 成熟倒计时。** “五天”仅是已施肥的普通 Pine 路径；未施肥 Pine 的页面统计仍存在来源口径冲突，不得改写成统一成熟日。

## 2. 独立回读来源清单

访问日期均为 **2026-09-22（Asia/Shanghai）**。下表中的页面修改时间是页面公开显示的最后编辑时间，不是本次访问时间；Wiki 页面是社区维护的公开游戏资料，不等同于 Stardew Valley 官方开发者声明。

| 来源 | 准确 URL | 页面标题 / 公开修改时间 | 本次回读的短引或正文观察 | 对象、版本与用途边界 |
|---|---|---|---|---|
| Pine Tree | https://wiki.stardewvalley.net/Pine_Tree | `Pine Tree - Stardew Valley Wiki`；2026-05-09 22:49 | “If fertilized, this takes five days (even in Winter).”；“Pine Trees outside the farm, but not in Pelican Town, can also be tapped or chopped down.” | Pine 专页；支持 Pine 的施肥五天结果和泛农场外交互；没有逐事实 `1.6.15` 锁定，也没有列出 C:58 的三个地点。 |
| Pine Tar | https://wiki.stardewvalley.net/Pine_Tar | `Pine Tar - Stardew Valley Wiki`；2026-01-12 19:37 | “e.g., in Cindersap Forest, the Railroad, around the Carpenter's Shop” | Pine Tar 物品页；直接支持自然 Pine 示例、5/2 天加工和相关用途；不是一份全地图 Pine 位置图册。 |
| Tree Fertilizer | https://wiki.stardewvalley.net/Tree_Fertilizer | `Tree Fertilizer - Stardew Valley Wiki`；2026-04-28 19:53 | “already been planted, not on an unplanted tile”；“Most fertilized trees advance one stage of growth each night until stage 4”；“Fertilized seeds and seedlings grow even in Winter.” | 野生树施肥页；支持施肥对象、通用阶段行为和冬季例外；不单独命名 Pine 的五天结果，且页面明确 fruit trees / Tea Bushes 不适用。 |
| Trees | https://wiki.stardewvalley.net/Trees | `Trees - Stardew Valley Wiki`；2026-07-24 22:45 | “a seedling will never grow past stage 4 if there is a mature tree in any of its eight adjacent tiles”；“Common trees in Cindersap Forest, The Mountain, Railroad...” | 普通树泛页；支持八邻格、20%/季节/地图例外及泛普通树位置；正文未出现 Carpenter's Shop，不能独立支持 C:58 的三地点组合。 |
| 官方 1.6 完整改动 | https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/ | `Stardew Valley - Stardew Valley 1.6 Update Full Changelog` | “You can no longer plant trees in the beach farm tunnel.” | 官方 1.6 更新页；仅作为地图禁种等版本边界背景，不支持 C:58 三个自然地点，也不单独证明 Pine 五天结果；不能把整页当作 Pine 机制百科。 |

### 回读方法与限制

- 五个 URL 均在同一 EGo Browser TaskSpace 的 `p1` 中逐一 `goto`，等待页面加载后读取 `document.title`、最终 URL、`document.body.innerText` 和公开页面修改时间/正文片段。
- `Pine Tree` 正文搜索结果：`Cindersap Forest=false`、`the Railroad=false`、`Carpenter's Shop=false`、`Carpenter’s Shop=false`。
- `Pine Tar` 正文搜索结果：`Cindersap Forest=true`、`the Railroad=true`、`Carpenter's Shop=true`；具体句子把三者列为自然 Pine 示例。
- `Trees` 正文包含 `Cindersap Forest`，并在泛普通树段落列出 `Railroad`；未发现 `Carpenter's Shop`。
- 以上是页面正文观察，不是游戏实测，也不是对所有平台/模组/未来版本的行为保证。公开页面的修改时间不能自动证明每一条事实均已逐条绑定到 `1.6.15`。

## 3. C:58：三个自然 Pine 地点的来源归属

### 3.1 观察

E-en 旧版本指出的原风险是把三个地点归给 Pine Tree 页面。独立回读支持以下分工：

| 主张 | 直接正文支持 | 不能扩大成 |
|---|---|---|
| Pine Tree 是由 Pine Cone 长成、可在农场外（但不在 Pelican Town）交互的普通树 | `Pine Tree` | “Pine Tree 页面列出了所有自然地点” |
| Pine Tar 可来自自然生长的 Pine，示例包括 Cindersap Forest、Railroad、Carpenter's Shop 周围 | `Pine Tar` | 一份完整地图位置清单，或所有地点都可砍/可 tap 的无条件保证 |
| 普通树在 Cindersap Forest、The Mountain、Railroad 等区域可交互 | `Trees` | `Carpenter's Shop` 位置，或 Pine 专属三地点句子 |

因此，**Cindersap Forest / Railroad / Carpenter’s Shop 的完整三地点组合直接归属 `Pine Tar` 页面**。`Pine Tree` 只能保留为“农场外 Pine 的泛交互”来源；`Trees` 只能承担泛普通树地点和交互限制的来源。不能把两个页面拼成一个来源后只留 Pine Tree 标签。

### 3.2 当前 C 版本观察（不等于通过）

当前工作副本的 `C:58` 已是拆分归属：

> `Pine Tree reference` → general outside-farm interaction；`Pine Tar reference` → Cindersap Forest / Railroad / Carpenter’s Shop；`Trees reference` → broader common-tree locations and interaction limits。

当前行的 source ownership 已符合上述事实边界；本任务没有改该行。由于 D/E 报告是旧 C hash 的审查结果，当前行仍需在新 hash 上由 D/E 复核。

### 3.3 最小可公开句子/链接方案

若需要从旧版本恢复或再次编辑，最小方案不是扩写地点列表，而是保持三种职责分开：

> You can also encounter Pine Trees growing naturally outside the farm. The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supports the general outside-farm interaction, while the [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) gives examples such as Cindersap Forest, the Railroad, and around the Carpenter’s Shop. The broader [Trees reference](https://wiki.stardewvalley.net/Trees) lists additional common-tree locations and interaction limits.

该句只作归属方案，不授权本任务修改 C。若只做最小链接修复，至少必须把三个地点示例直接链接到 `Pine_Tar`，并把 `Pine_Tree` 限定在泛农场外交互句；不能保留“Pine Tree reference lists [three locations]”这一归属。

## 4. C:99：五天结果的来源边界

### 4.1 观察

当前 C:99 的事实可以拆成两个来源层级：

1. **Tree Fertilizer 页面负责方法和通用行为：** 施肥必须作用于已种下的野生树种/树苗，而不是未种下的格子；大多数施肥树每晚前进一阶段，最后阶段用两晚；施肥树苗冬季也能生长。它不把这段结果单独命名为 “normal Pine”。
2. **Pine Tree 页面负责 Pine-specific 结果：** Pine 经过四个阶段到成熟，并明确写出施肥后五天、包括冬季。因此 “a normal Pine can mature in five days” 的对象归属必须绑定 Pine Tree；不能仅把整段绑定给 Tree Fertilizer。
3. **对象边界：** “normal Pine”不能偷偷扩展到 Mahogany、Mystic、果树或 Tea Bushes。Tree Fertilizer 页面明确果树/Tea Bushes 不适用，并列出 Mahogany/Mystic 的特殊推进例外；当前句子只应描述普通 Pine 的施肥路径。

### 4.2 当前 C 版本观察（不等于通过）

当前工作副本的 `C:99` 已把 `[Tree Fertilizer reference]` 放在通用施肥/阶段行为后，并把 `[Pine Tree reference]` 放在 “a normal Pine can mature in five days, even in Winter” 之后。这正是所需的最小双来源边界；本任务没有改该行，也没有将五天扩大为未施肥倒计时。

### 4.3 最小可公开句子/链接方案

保持当前句子含义时，PublicReference 应至少拆成如下两个绑定：

> Tree Fertilizer is for an already planted wild-tree seed or sapling. The [Tree Fertilizer reference](https://wiki.stardewvalley.net/Tree_Fertilizer) supports the apply-after-planting and general stage behavior. The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supplies the Pine-specific five-day fertilized path, even in Winter.

如果不拆句，也必须让 `Pine Tree` 链接紧邻 “a normal Pine can mature in five days” 这一具体主张；不能只在文末 Sources 列表中列出 Pine Tree 来替代邻近归属。

### 4.4 不可发布的扩大写法

- 不得写成未施肥 Pine 固定五天成熟。
- 不得用五天推导所有树、果树、Tea Bushes 或 Mahogany/Mystic 的统一成熟时间。
- 不得把 Pine Tree 页的五天句与 Tree Fertilizer 页的通用机制拼成一个“单一来源原句”。应在 `appliesTo`、quote 和 occurrence 中分别记录。
- 不得用 Pine Tree / Pine Cone / Trees 页面冲突的未施肥中位数或百分位数替换为固定日历。当前研究已明确这些数字存在口径冲突。

## 5. PublicReference quote / occurrence 是否需要重建

### 5.1 结论：**需要；应按最终 C 全量重建**

V7 公开引用规则要求每条 `PublicReference` 记录 `id`、`label`、`url`、`appliesTo`，必要时 `versionNote`，并用**正文原文精确 quote + 从 1 开始的 occurrence**绑定同一个最终规范化正文 hash。当前 E-en 已明确 PublicReference 仍是 `UNVERIFIED`，Sources 列表不能替代冻结 map。

本次回读还发现版本边界不能直接沿用 E 报告：

- E-en 记录的旧 C hash：`ce80bcb77dba1f01f07d5a446c857d97d39ba8f7b8acb3dacc9142b2cd0b3ad3`。
- 当前 C 原始文件 SHA-256（本补查只读回读）：`b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`。
- 当前 `C:58` 已新增/拆分 Pine Tar 与 Trees 的局部链接；当前 `C:99` 已新增/拆分 Pine Tree 的局部链接。URL 出现次数只是辅助观察，不是 V7 occurrence：当前 Pine Tree URL 7 次、Pine Tar 7 次、Tree Fertilizer 2 次、Trees 10 次。

因此，后续操作顺序应为：

1. 先确认 C 的最终文本和最终 raw/normalized hash；本报告不批准继续改 C。
2. 在最终正文上重建全量 PublicReference map，而不是只修改 `wiki-pine-tar` 或 `wiki-pine-tree` 的一个 occurrence。
3. 至少分别绑定：
   - `wiki-pine-tree`：泛 Pine 身份/泛农场外交互，以及 Pine-specific 五天句；
   - `wiki-pine-tar`：Cindersap Forest / Railroad / Carpenter’s Shop 三地点示例；
   - `wiki-tree-fertilizer`：已种下后施肥、阶段推进、冬季行为；
   - `wiki-trees`：八邻格、普通树泛位置和交互限制。
4. 对新 C hash 重新跑 D 的三门，再由 E 对同一 C hash 复核 C:58、C:99 和完整 22 条鉴文；不得把当前局部链接存在当成 D/E 通过。

### 5.2 推荐的 `appliesTo` / quote 边界（不是冻结 map）

| PublicReference 候选 | 只允许承担的主张 | 不应承担 |
|---|---|---|
| `wiki-pine-tree` | Pine Cone → Pine Tree 身份；泛农场外 Pine 交互；普通 Pine 施肥五天（包括冬季） | Cindersap Forest / Railroad / Carpenter’s Shop 三地点组合 |
| `wiki-pine-tar` | Pine Tar 来自自然 Pine 的三地点示例；Pine Tar 5/2 天加工和用途 | Pine seedling 的施肥机制或未施肥成熟倒计时 |
| `wiki-tree-fertilizer` | 施肥对象必须已种下；普通野生树阶段推进；末阶段两晚；冬季可生长 | 单独证明 “normal Pine” 五天 |
| `wiki-trees` | 普通树八邻格 stage-4 阻塞；泛普通树位置/交互限制；未施肥概率/冬季地图例外 | Carpenter’s Shop 的自然 Pine 示例；Pine-specific 五天句 |

这里的 quote 只能从最终 C 正文逐字截取，occurrence 必须在最终规范化正文中重新计数；本表不是当前可直接交付的冻结引用表。

## 6. 观察、推断、未决分离

### 6.1 观察（已从文件或页面正文回读）

- `E-en-review.md` 的旧结论把 C:58 的三地点归属 FAIL 指向 Pine Tar，并把 C:99 的五天句标为事实 PASS、binding UNVERIFIED。
- 独立 EGo 回读确认 Pine Tree 页面没有三地点字符串；Pine Tar 页面有三地点字符串；Trees 页面只覆盖其中的泛普通树位置。
- 当前 C:58、C:99 已显示来源拆分，但当前版本没有对应的新 D/E 复核报告。
- V7 规则要求正文变更后随正文 hash 一起重建 quote/occurrence；Sources 列表不等价于 PublicReference map。

### 6.2 推断（基于上述事实，不是来源原句）

- 当前 C 的局部来源拆分方向是最小且足够的修复方向，不需要新增地点百科或扩写 Pine 机制。
- 因为 C 的链接归属和 raw hash 已与 E 记录不一致，旧引用定位不能直接回收；全量重建比局部打补丁更能避免 occurrence 漂移。
- 如果后续再次改动 C:58/C:99 的文字或链接标签，即使事实未变，也必须重新锁定正文版本、D/E 结果和 PublicReference 定位。

### 6.3 未决 / 不在本任务处理

- 页面公开修改时间不构成每条事实的 `1.6.15` 逐页版本锁；本补查未启动游戏或存档实测。
- Pine Tree、Pine Cone、Trees 对未施肥成熟统计存在已记录的页面口径冲突；本补查不裁决该冲突，也不发布固定普适成熟日。
- 生产页面、媒体、构建、部署、外部服务和用户终审均未验证；本补查不改变这些状态。

## 7. 只读验证记录

### 7.1 写入前基线

- `git status --short --untracked-files=all`：rc=`0`；目标目录已有 13 个未跟踪文件，无 `A-en-supplement.md`。
- 受保护文件写入前 SHA-256（用于写后回读）：

```text
A-en-research.md         177356682880fbd950a484bb0ba4ca1a6063a80cc698d4ce52305c547383c5b5
C-en-draft.md            b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819
E-en-review.md           b6f7ca25c37b1cc3e5af87148ba8e9556100f52b6cbe71eed7b68d687d4219fd
D-en-check.md            b4fdc3409f818892107bfe7f34bf798bb408bf247f60e123c72e1bc5191eb280
project-interface-spec   055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f
```

### 7.2 实际写后验收回执（2026-09-22）

- 目标报告非空：`test -s docs/blog-ops/pine-tree-stardew/A-en-supplement.md`，rc=`0`，文件大小 `17949` bytes。
- 尾空格：`awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' .../A-en-supplement.md`，rc=`0`，无匹配行。
- `git diff --check -- docs/blog-ops/pine-tree-stardew/A-en-supplement.md`，rc=`0`，无诊断输出。
- 新文件直接检查：`git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/A-en-supplement.md`，rc=`1`，这是 `/dev/null` 与未跟踪新文件的预期内容差异码；无空白诊断输出。
- status allowlist：rc=`0`；写后仅为基线 13 个目标目录文件加本报告 1 个，目标目录外无新增路径。
- 受保护文件 hash：rc=`0`；A-en-research、C-en-draft、E-en-review、D-en-check、project-interface-spec 与写入前 hash 完全一致。

写后受保护文件 SHA-256：

```text
A-en-research.md         177356682880fbd950a484bb0ba4ca1a6063a80cc698d4ce52305c547383c5b5
C-en-draft.md            b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819
E-en-review.md           b6f7ca25c37b1cc3e5af87148ba8e9556100f52b6cbe71eed7b68d687d4219fd
D-en-check.md            b4fdc3409f818892107bfe7f34bf798bb408bf247f60e123c72e1bc5191eb280
project-interface-spec   055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f
```
