# E 独立审核：house upgrade stardew 丰富英文稿（draft-v4 终审绑定）

审核门：**PASS**。问题数：**0**。

SEOTruth 表面（Title / H1 / Description / FAQ）：**pending**（待 Role F）。译文：**pending**（待 Role T）。真实页面：**pending**（待 Role G）。正文 PASS 不等于这些待办阶段通过。

---

## 一、身份、授权与输入哈希绑定

- **审核角色**：E（独立全文与鉴文审核）。独立执行，与 A、B、C、D、F、T、G 及协调者均不相同。
- **任务 ID**：`task_67ffe96219bd`
- **Dispatch ID**：`ctx_626147c43cbb`
- **终端 Handle**：`term_2e6fa9eb-9f7d-4e1e-a79f-1a545d3f4c3f`
- **协调者 Handle**：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **协调者输入确认与授权**：已收到协调者消息 `msg_b8c7f534b869` 与 `msg_ca0147d8a1df`，确认角色 D 已对同一最终正文 hash 签署三门 PASS（0 问题），协调者已实读并接受 D 报告与真实 checks.log；本角色 E 仅接收 D 状态，不以 D 报告、作者自评或 issueDispositions 作为结论，独立开展全量复核。
- **体裁与意图**：教程。主关键词 `house upgrade stardew`。语言与国家：英文，美国国家级（SERP 页脚确认 `Results are not personalized` 与 `United States - From your IP address`，无 PAA）。
- **四输入 SHA256 校验**（`shasum -a 256` 退出码 `0`，与协调者给定值逐字一致）：

| 文件路径 | SHA256 Checksum | 角色说明与绑定状态 |
|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | 审核对象正文候选 |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | `1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27` | 公开引用映射（已绑定上述正文 hash） |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | `75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400` | 媒体文本配置（已绑定上述正文 hash） |
| `docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json` | `1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415` | 作者提交凭证（仅核对 SHA，不读自评） |

- **关联控制与研究底座 SHA256 校验**（退出码 `0`）：
  - `layout/enriched/writer-brief.md`: `0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc`
  - `layout/enriched/task-card.md`: `5d37bdadb1fb20b30d1fbe605b67cd9c169acaa810667b0548dc88fd74950668`
  - `layout/enriched/media-plan.json`: `6359d95163dfec0ac889c61583a472fe61b53b7ee151eeb4a27bb02768d74a13`
  - `research/A/facts.json`: `618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e`
  - `research/material-preparation/facts.json`: `c180f0bf8b5eaf74de21a3999a646e19191064a01fe6d498c098ab56465d601d`
  - `research/upgrade-planning/facts.json`: `397cc320f596d97e858809e688ba8f90d9db477236416f8cdd57fa1ed548026e`
  - `reviews/E/enriched-v3/report.md`: `2ec35b8c9800e2faf68a23bdc33e5c7de978fba062ecc6f8e127dfadaa264d07`（E 自身上一版真实 FAIL 6 报告，checks SHA `f9457ab8c82d5330c8daa0782351c6a9330af471d8a6e33330a73ceb543e1d0b`）

---

## 二、真实 Diff 范围复核与 E 上一版 6 处问题修复独立验证

经执行 `git diff --no-index -u draft-v3.md draft-v4.md`，全篇改动严格限定在 5 个局部差异块内，精准对应 E 在 v3 指出的 6 处问题，无超出范围的漂移或未授权改动。各处修复对比如下：

### 1. 问题 1（原第 29 行：数字归属错误与口径不一）
- **v3 原文**：`Buying all 450 Wood in year 1 is 14,500g. The 200 already on hand is what changes 14,500g to 12,500g. Buying all 450 in year 2 or later is 32,500g, because her Wood price is then 50g ([Carpenter's Shop]..., [Farmhouse]...). The 12,500g bill does not use 50g.`
- **v4 修复**（第 29 行）：`In year 1, 450 × 10g = 4,500g for the wood, and 4,500g plus the 10,000g fee is 14,500g. The 200 already on hand is what changes that 14,500g total to 12,500g. In year 2 or later, Wood is 50g. 450 × 50g = 22,500g for the wood, and 22,500g plus the same 10,000g fee is 32,500g ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop), [Farmhouse](https://stardewvalleywiki.com/Farmhouse)). The 12,500g bill does not use that 50g price.`
- **核对依据**：`01-wiki-farmhouse.json` L160 原文：`Instead of gathering 450 wood for the Farmhouse Upgrade 1, it can all be purchased at the Carpenter's Shop during year 1 for 4,500g, or during year 2+ for 22,500g. The total cost for the upgrade would then be 14,500g in year 1, or 32,500g in year 2+.`
- **复核结论**：**已彻底修复**。木材本身价款（4,500g / 22,500g）与加上 10,000g 升级费后的合计支出（14,500g / 32,500g）完全拆分明确；50g 单价严格对应 22,500g 木材款；与手头有 200 木材时的 12,500g（10k 升级费 + 250 木材买款 2.5k）对比保持同口径（均为升级费+木材采购的读者总支出）。

### 2. 问题 2（原第 57 行：进屋条件缩限）
- **v3 原文**：`The house can be entered from 9:00am to 8:00pm while the shop is closed.`
- **v4 修复**（第 57 行）：`The house can be entered every day from 9:00am to 8:00pm, even when the shop is closed.`
- **核对依据**：`02-wiki-carpenters-shop.json` L43 原文：`The house is accessible from 9:00am to 8:00pm every day, even when the shop is closed.`
- **复核结论**：**已彻底修复**。完整恢复了 `every day` 和 `even when the shop is closed` 两个关键条件，纠正了“只在关门期间才可进屋”的缩限错误。

### 3. 问题 3（原第 57 行：无例外禁令推论）
- **v3 原文**：`Tuesday is closed, so a Tuesday visit cannot place the upgrade. Friday closes at 4:00pm, so on Friday the order has to be placed before then.`
- **v4 修复**（第 57 行）：`On an ordinary week the counter is open from 9:00am to 5:00pm. Tuesday is closed. Friday closes at 4:00pm. The house can be entered every day from 9:00am to 8:00pm, even when the shop is closed. Entering the house does not place the order ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).`
- **核对依据**：`02-wiki-carpenters-shop.json` L45–L47 明确记录周二下雨营业及周二 9:40am/8:00pm、周五 4:00pm 经过柜台时可购物的例外。第 59 行保留站内链接覆盖这些情况。
- **复核结论**：**已彻底修复**。删除了 `cannot` 和 `has to` 的绝对推论，平实陈述普通周常规时间，未推导无例外禁令；第 59 行站内链接平稳承接雨天、节日、诊所与柜台偶遇等例外。

### 4. 问题 4（原第 61 行：未经验证的工期起算与首日状态）
- **v3 原文**：`Each farmhouse upgrade takes three days. Those three days run from the payment until that upgrade's rooms are finished. On the day you pay, those rooms are still unfinished ([Farmhouse]..., [Carpenter's Shop]...).`
- **v4 修复**：**整段多余句子已完全删除**。
- **核对依据**：`01-wiki-farmhouse.json` L58 原文为 `Robin requires three days to complete each farmhouse upgrade.`；`02-wiki-carpenters-shop.json` L338 原文为 `Farmhouse upgrades require three days to complete.`。两处均无“从付款日起算”或“付款当天房间仍未完成”。农舍工期 3 天已在全文第 1 行与费用表中清晰给出。
- **复核结论**：**已彻底修复**。彻底删除了无依据的起算推断；未错误引入通用建筑“次日开工/2天完工”；删去该段同时规避了与前文数字 3 的同作用机械复述。

### 5. 问题 5（原第 17 行：活树树桩对比引用未覆盖）
- **v3 原文**：`A Large Stump is the remains of a long-dead tree, not the stump left when you chop a living tree for Wood. A Copper Axe or better removes a Large Stump and yields 2 Hardwood ([Large Stump]...).`
- **v4 修复**（第 17 行）：`A Large Stump is the remains of a long-dead tree. A Copper Axe or better removes a Large Stump and yields 2 Hardwood ([Large Stump](https://stardewvalleywiki.com/Large_Stump)). It is not the stump left when you chop a living tree for Wood ([Wood](https://stardewvalleywiki.com/Wood)).`
- **核对依据**：`large-stump-rendered.txt` 支持 `Large Stumps are the remains of long-dead trees... A Copper Axe (or better quality) is required to remove a large stump, yielding 2 Hardwood`；`wood-wikitext.json` 支持 `After felling the tree, the stump can be destroyed to yield between 5 and 9 Wood.`。
- **复核结论**：**已彻底修复**。Large Stump 身份与产出独立成句并由 `Large Stump` 维基链接覆盖；活树伐倒后的树桩对比独立成句并挂载 `[Wood](https://stardewvalleywiki.com/Wood)` 链接，未臆造新掉落规则。

### 6. 问题 6（原第 55 行：逗号拼接语法错误）
- **v3 原文**：`Robin is at the Carpenter's Shop, 24 Mountain Road. She sells wood, stone, and furniture, she upgrades the farmhouse, and she constructs farm buildings ([Carpenter's Shop]...).`
- **v4 修复**（第 55 行）：`Robin is at the Carpenter's Shop, 24 Mountain Road. She sells wood, stone, and furniture. She upgrades the farmhouse and constructs farm buildings ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).`
- **核对依据**：英语独立主谓语法规则及 `02-wiki-carpenters-shop.json` 业务事实。
- **复核结论**：**已彻底修复**。拆分为两个结构严谨完整的合法句子，出售商品、升级农舍、建造建筑三项业务事实保持不变。

---

## 三、22 条鉴文规则逐项独立判定

对照 `/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md` 逐条审核。未受 v4 改动影响且事实依据一致的项继承 E v3 真实报告基线，发生改动影响的项予以全量独立重查：

| 编号 | 检查项 | 审核结果 | 重查 / 继承 | 判定依据与核查说明 |
|---|---|---|---|---|
| 1 | 堵住所有反驳 | **未命中** | **重查**（原命中纠正） | v3 原在第 57 行将周二/周五例外收成绝对禁令。v4 第 57 行已删除绝对禁令，保留平实营业时间；第 59 行保留指向下雨、节日、诊所和路过柜台的内链。保留了真正影响操作的条件，清除了多余反驳。 |
| 2 | 知识全部输出 | **未命中** | 继承 v3 基线 | 未因知识正确而写入全树种株数、九项装修价目、189 满窖布局、婚礼细节或多人联机小屋。秘密森林路线紧密服务于硬木筹备单一目标。 |
| 3 | 匀速排比 | **未命中** | 继承 v3 基线 | 第 37 行三档累计是同一字段的三笔加法，数字不同，属于规格并列，非无信息换词排比。 |
| 4 | 让步模板反复出现 | **未命中** | 继承 v3 基线 | 全文无机械重复的“虽然…但是…”让步句式。 |
| 5 | 反复给概念命名 | **未命中** | 继承 v3 基线 | 无“我把这叫作”等概念包装。第 43 行对 Nursery 的说明仅用于将图示标签与婴儿房实际功能准确对齐。 |
| 6 | 情绪曲线太光滑 | **未命中** | 继承 v3 基线 | 平静、客观的说明文，无任何虚构的玩家经历或情绪起伏。 |
| 7 | 虚构读者错误再反驳 | **未命中** | 继承 v3 基线 | 无“所有人都以为”等虚假错误靶子。警告仅限于实操（如第 37 行不要在柜台单次付 75k 或 175k）。 |
| 8 | 高密度“不是X而是Y” | **未命中** | **重查** | 重点复核涉及对比的第 17、21、27、29、37、57 行：活树普通树桩 vs 死树 Large Stump、采收次数 vs 日历日期、手头已有 200 木材 vs 店内预留、累计总账 vs 单次付款、普通营业时间 vs 进屋时间，均直接改变实操行为与核算，属于正常区分说明，无机械高密问题。 |
| 9 | 没有任何犹豫 | **未命中** | **重查** | 删除了原第 61 行未经证实的工期起算推断。确定的事实用确定语气，有条件的事项（如第 19 行通道走法约 2–3 格、第 27 行已有 200 木材场景）均写清具体条件，无免责式旁白。 |
| 10 | 虚假精确 | **未命中** | **重查**（原命中纠正） | v3 原将 14.5k 与 32.5k 误写为买木材款。v4 第 29 行明确标出 4,500g 与 22,500g 木材款，加上 10,000g 工费合计 14,500g 与 32,500g，算式精确可核，数字完全源自维基与数学计算。 |
| 11 | 脆弱经历只为论点服务 | **不适用** | 继承 v3 基线 | 工具教程体裁，无个人成长叙事或失败故事。 |
| 12 | 复杂问题突然变万能步骤 | **未命中** | **重查**（原命中纠正） | v3 原在第 57 行把带例外的周二/周五营业推导成普遍适用的禁令。v4 已删除绝对推断；秘密森林路线也写明了起点、斧头等级与树桩再生条件，流程严谨。 |
| 13 | 每段都收束成金句 | **未命中** | 继承 v3 基线 | 各段末尾为选择分支或具体算式，无提炼金句或大词升华。结尾第 71 行自然收束于地窖与装修的选择。 |
| 14 | 句子节奏过于均匀 | **未命中** | **重查** | 句子长短随动作、条件与算式步骤自然展开，长短句结合合理，未出现机械均匀节奏。 |
| 15 | 感受替代论证 | **未命中** | 继承 v3 基线 | 所有升级金币、材料数量、房间解锁机制均由具体数据和维基来源支持，无“凭感觉”式论断。 |
| 16 | 开头只剩钩子、痛点、承诺 | **未命中** | 继承 v3 基线 | 开头前三句直奔主题，直接给出三档价格、1.6 改价、3 天工期与下单地点，无废话钩子。 |
| 17 | 连接词固定且密集 | **未命中** | **重查** | 严格扫描 `worth noting`、`notably`、`delve`、`leverage`、`furthermore`、`moreover` 等，命中数为 0。 |
| 18 | 刻意同义替换 | **未命中** | **重查** | 核心专有名词 `Wood`、`Hardwood`、`Large Stump`、`Large Log`、`Remove Crib`、`Add Dining Room` 等保持前后完全一致，未引入易引起歧义的别名。 |
| 19 | 中文翻译腔或非母语表达 | **未命中** | **重查**（原命中纠正） | v3 原第 55 行存在主谓逗号拼接（comma splice）。v4 第 55 行已分拆为两个符合英语语法规范的完整句子，全篇语法自然纯正。 |
| 20 | 虚构故事或案例 | **未命中** | **重查** | 第 27–29 行手头已有 200 木材场景作为纯数学算式条件（`when 200 of the 450 Wood are already on hand`）交代，未包装成虚构的亲历或案例故事。 |
| 21 | 通用祝福结尾 | **未命中** | 继承 v3 基线 | 结尾收尾于即时装修与地窖的选择决策，彻底排除了通用祝福语或空洞号召。 |
| 22 | 强行追求深刻 | **未命中** | 继承 v3 基线 | 始终聚焦农舍升级实操边界，未强行上升到宏大人生哲学或大而无当的命题。 |

---

## 四、六类形式指纹与编辑腔独立排查

### 1. 六类形式指纹扫描结果
- **破折号过密**：em dash（—）数量为 `0`；en dash（–）数量为 `0`；第 27 行保留合法减号运算符（`−`，U+2212）。
- **粗体过密**：正文使用 Markdown 粗体标记 `**` 数量为 `0`。
- **无用装饰符号**：感叹号 `!` 仅在第 45、63 行用于图片 Markdown 语法（`![alt](url)`），无任何感叹句。
- **助手残留**：无 `TODO`、内部路径、草稿批注、检索指令或助手自称。
- **填充短语**：扫描 `it is worth noting`、`it's worth noting`、`notably`、`delve`、`leverage`、`furthermore`、`moreover`、`in conclusion`、`this guide`、`this article`、`the following table`、`in this section`、`documented`、`source-backed`、`planning scenario` 等，**全部为 0 命中**。
- **泛泛积极结尾**：第 71 行干净收尾于具体装修选项与地窖决策。

### 2. 读者口吻五类编辑腔排查结果
1. **来源核查旁白**：未命中。公开引用均采用页面正式名称或操作锚文本（如 `[Farmhouse]`、`[Carpenter's Shop]`、`[Wood]`、`[Large Stump]` 等），无“据维基记录”、“已被核验”等旁白。
2. **示例/实测免责**：未命中。第 21 行 `That figure is a count of harvests, not a calendar date.` 明确说明计算单位性质，无免责声明。
3. **图片自我说明**：未命中。图注统一以 V7 规则允许的单字短标签 `Schematic.` 起句，直接陈述画面图解内容，无否定式免责。
4. **文章自指与范围声明**：未命中。排除了 `in this guide` 等词。第 27 行 `Use this bill` 指代计算账单，第 37 行 `cost table` 指代第 1 节表格，第 43 行对 Nursery 的说明仅用于读图对应。
5. **验收词汇**：未命中。无 `verify`、`readback`、`pass` 等内部流程用语。

### 3. 未经验证 UI 词扫描
- 严格遵循协调决定，正文第 55 行使用直接动作 `ask her to upgrade the farmhouse, and pay the gold and materials for your next tier`，未写入 `Shop`、`Upgrade House`、`Construct Farm Buildings`、`Leave` 等未经验证的 UI 菜单标签。

---

## 五、篇幅与真实命令执行结果

### 1. 正文计数执行结果
- **命令**：`PYTHONDONTWRITEBYTECODE=1 python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md`
- **退出码**：`0`
- **输出摘要**：
  ```json
  {
    "mechanical_units": 1138,
    "required_floor": 1000,
    "meets_mechanical_floor": true,
    "long_form_target": 2000,
    "meets_long_form_target": false,
    "length_class": "short",
    "semantic_qualification": "requires_independent_review",
    "sha256_raw": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f",
    "sha256_nfc_lf": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
  }
  ```
- **剔除图注计数核验**：剔除第 47、65 行两行以 `Schematic.` 开头的图注后，机械词数为 `1085`，仍严格满足 `>= 1000` 词门槛。
- **说明**：正式 Length 门与短文理由由 Role F 淬文时正式签署，本角色 E 确认机械计数达标。

### 2. 引用与主张映射核查
- `public-references.en.json` 中共 55 处引用映射，55 处 `quote` 在 `draft-v4.md` 中完全匹配存在（`mismatches: 0`），出现次数均为 1（`count_mismatches: 0`）。
- 全文扫描 19 个 `publicAllowed: false` 的内部事实 ID，在 `public-references.en.json` 与 `media-text.en.json` 中泄漏数为 0。

---

## 六、共享修订预算与下游交接

### 1. 共享修订预算状态
- 全流程最多共用 3 轮修订预算（含译文返修，不按角色重置）。
- 实际执行情况：
  - 第 1 轮：Role C 由 draft-v1 改出 draft-v2（消耗 1 轮）；
  - 第 2 轮：Role C 由 enriched-brief 改出合并候选 draft-v3（消耗 1 轮）；
  - 第 3 轮：Role C 针对 E v3 提出的 6 处问题修改完成 draft-v4（消耗第 3 轮）。
- 本次审核：Role E 对 `draft-v4.md` 进行独立复核，**判定 PASS，问题数为 0，不消耗额外改稿轮次**。
- 当前预算结余：**已用 3/3，未来剩余 0（含译文返修）**。此项为不可逆共享状态，后续流程不能重置。

### 2. 下游交接与角色权限边界
- **流向**：本报告签署 PASS 后，英文丰富候选版本正式移交 **Role F** 进行淬文、字数门签署与候选标题锁定；随后移交 **Role T** 进行中文翻译。
- **权限边界声明**：Role E 严格限定于正文质量与鉴文复核，未修改正文、引用、媒体、布局或控制文件，未提供替换句；未代签 Role F 标题/Length 门、Role T 译文或 Role G 页面装配。

---

## 七、审核结论与终审绑定

- **审核门结论**：**PASS**
- **阻塞问题数**：`0`
- **绑定的正文 SHA256**：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`
- **绑定的公开引用 SHA256**：`1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27`
- **绑定的媒体文本 SHA256**：`75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400`
- **绑定的作者提交记录 SHA256**：`1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415`
- **验证日志存档**：`docs/blog-ops/house-upgrade-stardew/reviews/E/enriched-v4/checks.log`
