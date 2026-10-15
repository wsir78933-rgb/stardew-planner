# 角色 E 独立中文译文审校 · 第 2 轮

- 审核角色：E。独立中文译文审校。不兼任 A、B、C、D、F、T、G，也不代替主脑。
- 任务：`task_f80b0d61070b`；派发：`ctx_d4802edae112`
- 协调员终端：`term_ea92c135-a44b-411d-94e1-e3c209acc3a8`
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 前置依赖：
  - 英文锁定正文：`rework-v2/en-body.locked.md`（SHA-256 `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`）
  - 英文锁定 SEO：`rework-v2/en-seo.json`（SHA-256 `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9`）
  - 英文锁定媒体：`rework-v2/en-media.locked.json`（SHA-256 `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885`）
  - 英文锁定引用：`rework-v2/en-public-references.locked.json`（SHA-256 `52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e`）
  - 角色 E 英文题文审核：`review-e/seo-r2.md` 通过记录
  - 角色 T 中文翻译记录：`translation/report.md`
- 审核对象：`translation/zh-body.md`、`translation/zh-seo.json`、`translation/zh-media.json`、`translation/zh-public-references.json`
- 约束与授权声明：本轮只新增本报告与私有证据目录 `review-e/evidence/translation-r2/`；未修改中文译文、英文原文、SEO、媒体、产品代码或历史记录。未跑 build，未开浏览器。

---

## 结论

**通过（PASS）。** 

中文译文 `translation/zh-body.md` 在段落结构、事实陈述、操作按键、数值计算、单位、链接目标多重集合、图位标注、图注 alt 及署名上与锁定英文完全对齐；中文行文自然流畅，无翻译腔与编辑腔；术语严格按 `facts-audit-v2` FACT-11 社区规范条目执行（Kale 统一为“甘蓝菜”，无“羽衣甘蓝”；首次出现规范括注英文；sprite 译为“图像”或“可以收获的图像”，不作精灵理解；不声称官方游戏二进制语言包已核验）。`zh-seo.json`、`zh-media.json` 与 `zh-public-references.json` 均严格绑定本轮英文锁定正文哈希（`sourceEnglishBodyHash`）与中文正文哈希（`bodyHash` / `bodySha256NfcLf`）。

**批准绑定同版 EN/ZH**。允许进入下一步由角色 F 冻结中英文两份 `PublicBlogHandoff`，随后由角色 G 装配现有网站。

> [!IMPORTANT]
> 技术审校与本报告的通过，不等于用户终审，也不等于上线发布。用户终审仍待完整真实网页生成后由用户在本地亲自审阅。

---

## 绑定版本与哈希核验

| 文件 | 原始字节 SHA-256 | 字节数 | NFC-LF 是否相同 |
|---|---|---:|:---:|
| `rework-v2/en-body.locked.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | 10036 | 是 |
| `rework-v2/en-seo.json` | `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9` | 3201 | 是 |
| `rework-v2/en-media.locked.json` | `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885` | 4229 | 是 |
| `rework-v2/en-public-references.locked.json` | `52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e` | 10294 | 是 |
| `translation/zh-body.md` | `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd` | 9174 | 是 |
| `translation/zh-seo.json` | `49dffecf14f8fb5ddf549334bc6c1f14408cb0ed5f8b58e4bac5826898b8910f` | 3099 | 是 |
| `translation/zh-media.json` | `c6abd143616de6f03bc868121b41f9ae8a50f317b70dfbea37c67f3e282e95a7` | 4203 | 是 |
| `translation/zh-public-references.json` | `7ca77bb04069808b5635e186985b936f15a25059f6de197ba0c229569b731c63` | 10267 | 是 |

### 跨文件正文哈希绑定验证

1. **英文来源正文哈希（`sourceEnglishBodyHash`）**：
   - `zh-seo.json` 字段值：`d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`（匹配）
   - `zh-media.json` 字段值：`d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`（匹配）
   - `zh-public-references.json` 字段值：`d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`（匹配）
2. **中文当前正文哈希（`bodyHash` / `bodySha256NfcLf`）**：
   - `zh-seo.json` 的 `bodyHash`：`30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd`（匹配）
   - `zh-media.json` 的 `bodySha256NfcLf`：`30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd`（匹配）
   - `zh-public-references.json` 的 `bodyHash`：`30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd`（匹配）

---

## 问题清单

**无（PASS）。** 未发现需要退回角色 T 返工的语义扭曲、数值错误、链接偏差、图位不合或编辑腔问题。

> [!NOTE]
> 审校标准复述：若发现翻译问题，本角色仅输出“原句位置 + 问题类型 + 修改要求”，严禁直接改写正文或提供整句替换文本，由角色 T 独立修改。本轮全文核查全部通过，无退修项。

---

## 逐段审校与语义对齐核实

全文逐段对照，行数结构完全一致（两语正文均为 83 行，且标题、段落、引用及图位行级对齐）：

### 1. 首段引言（Line 1）
- **英文核心**：普通作物徒手右键或长按动作键连续收；防风草不用镰刀；必须用镰刀的作物（苋菜、甘蓝菜、小麦、未碾米、纤维种子）；巨大作物 3×3 任意斧头砍三下；成熟判断为最终生长阶段 sprite 出现。
- **中文对应**：`在星露谷物语里，普通作物用手收：站在成熟植株旁边[右键点它](...)，或者按住动作键，走过田里连续收。防风草（Parsnip）不用镰刀。有些作物必须用镰刀收，包括苋菜（Amaranth）、甘蓝菜（Kale）、小麦、未碾米（Unmilled Rice）和纤维种子（Fiber Seeds）。连成 3×3 的巨大作物（Giant Crop），要用任意一把斧头砍三下。耕地上那一格出现这种作物最后一阶段、可以收获的图像，就说明已经长成。`
- **核验结论**：语义精准，甘蓝菜条目正确，首出英文括注齐全，sprite 译为“图像”，数字 3×3 与三下完全对应。

### 2. 怎么看出作物可以收（Lines 3–26）
- **2.1 看图像：最后一阶段可以收获的样子（Lines 5–18）**：
  - 作物经历不同阶段，最终图像出现即可收。
  - 防风草浇水 4 天，单次收获拔起留空耕地。
  - 南瓜浇水 13 天，大颗圆圆橙色果实搁在土上。
  - 蓝莓 13 天初次成熟，采后灌木保留，每 4 天结出新果，无需补种。
  - 图位 1（`media-mature-crops`）：南瓜截图立在土路旁耕地上，alt 为“土路旁的耕地上长着饱满的橙色南瓜”，图注含 ConcernedApe 署名及原图链接。
  - 随文呼应段：说明截图里成熟南瓜的橙色外观。
- **2.2 算收获日，以及漏浇水会顺延（Lines 20–26）**：
  - 生长天数不算播种当天，代表成熟所需浇水夜晚数。
  - 引用“作物必须每天浇水才能按最快速度生长”；漏浇一天暂停一天，但作物不枯死；干土播种不浇当夜不长。
  - 算例：春 1 播 4 天作物（防风草）在春 5 早晨成熟（1 + 4 = 5）；漏浇推迟至春 6；秋 1 播 13 天南瓜在秋 14 成熟；蓝莓 13 天后维持每天浇水以保证 4 天再生节律。
- **核验结论**：所有算例数值（1、4、5、1+4=5、6、13、14、4）完全准确，逻辑清晰，无硬译。

### 3. 普通作物怎么用手收（Lines 28–42）
- **3.1 在 PC 上收单株（Lines 30–36）**：
  - 徒手收使用通用的 Check/Do Action；右键点它；键盘 X 映射同一动作。
  - 左键与 C 绑定工具或放物品；用手收不挥工具。
  - 单次作物收获后留空地，结合作物生长日历说明当天补种与浇水假设。
- **3.2 快速收：按住并在田里走（Lines 38–42）**：
  - PC 大片菜地操作：按住右键且光标远离角色，走过田地连续收；X 键相同。
  - 选中种子长按右键边收边播单次作物；蓝莓丛摘后保留继续结果，无需补种。
- **核验结论**：操作描述地道精准，Check/Do Action 保留原键名不另造生词。

### 4. 指定作物怎么用镰刀收（Lines 44–54）
- **4.1 必须用镰刀收的作物（Lines 46–50）**：
  - 苋菜、甘蓝菜、小麦必须用普通镰刀，右键或 X 收不下来。
  - 维基引用三连：甘蓝菜要用镰刀或更好的镰刀、未碾米用镰刀、纤维种子用镰刀。
  - 纤维种子例外：生长无需每天浇水，但长成后仍需镰刀。
  - 操作方式：放入当前工具栏，面向作物按工具键（左键或 C）；移动端先选镰刀再用。
- **4.2 1.6 的铱镰刀，用在耕地上（Lines 52–54）**：
  - 铱镰刀源于 1.6 耕种精通（Farming Mastery）；挥舞范围内可收耕地上所有作物（含普通作物）。
- **核验结论**：术语“甘蓝菜”全覆盖；纤维种子浇水例外准确传达；1.6 新机制无遗漏。

### 5. 收特殊作物：巨大作物和棚架（Lines 56–73）
- **5.1 用斧头收巨大作物（Lines 58–60）**：
  - 任意斧头砍三下；掉落 15 到 21 个普通品质物品；换季不枯萎；面向作物按左键或 C。
- **5.2 棚架作物旁边留出走得到的路（Lines 62–73）**：
  - 棚架作物（青豆、啤酒花、葡萄，附英文）限制移动；活株走不穿、死株可走；必须在邻格留出站立空间。
  - 实心连片导致内部无法浇收；推荐双行排布中间留走道。
  - 图位 2（`media-trellis-paths`）：两排木棚架隔开空土路，葡萄附在棚架上，alt 与图注一致，ConcernedApe 署名及链接准确。
  - 随文呼应及规划器 CTA：提醒读者播种前在农场规划器（`/`）预留走道。
- **核验结论**：15 到 21 个物品、砍三下等数值完全匹配，双行通道解释通顺，产品内链自然无推销腔。

### 6. 收成对不上时先看症状（Lines 75–83）
- 结构与排查要点 1-to-1 对应：
  1. 未出图像：查漏浇水，天数顺延，坚持浇水直到出图像。
  2. 点它没反应：查是否属于镰刀作物（苋菜、甘蓝菜、小麦、未碾米、纤维种子）或 3×3 巨大作物。
  3. 人走不到：查活棚架挡路，从外圈收，后续采用双行排道。
  4. 换季枯萎：第 1 天非当季作物枯萎留枯株（跨季作物除外）；镰刀清枯株保耕地；播种规划使用最晚播种日（`/last-day-to-plant-stardew`）或温室指南（`/what-to-grow-in-greenhouse-stardew`）。
- **核验结论**：4 个症状分支与修复动作完全忠实于原文，内链及维基引用完整保留。

---

## 题文、SEO 与元数据审核

`translation/zh-seo.json` 各字段与英文锁定版本及项目架构核对：

| 字段 | 中文值 | 英文对应依据 | 审核判断 |
|---|---|---|:---:|
| `slug` | `how-to-harvest-stardew-valley` | 与英文 slug 一致 | PASS |
| `locale` | `zh-CN` | 简体中文本地化标识 | PASS |
| `country` | `US` | 沿用英文主链地区设置 | PASS |
| `title` | `星露谷物语怎么收作物：徒手、镰刀或斧头` | 直译英文 Title，19 字符，覆盖三种采摘手段 | PASS |
| `h1` | `星露谷物语怎么收作物：徒手、镰刀或斧头` | `titleEqualsH1: true`，与 Title 严格一致 | PASS |
| `description` | `防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。` | 41 字符纯文本，包含代表作物与具体键位，甘蓝菜合规 | PASS |
| `topic` | `星露谷物语指南` | 对应英文 `Stardew Valley Guides` | PASS |
| `author` | `星露谷规划器团队` | 对应英文 `Stardew Valley Planner Team` | PASS |
| `readTimeMinutes`| 6 | 继承自英文计数，正整数 | PASS |
| `featured` | `false` | 与项目约定一致 | PASS |
| `datePublished` | `null` | 项目不生成固定发布时间戳 | PASS |
| `publicPath` | `/zh/how-to-harvest-stardew-valley` | 中文路由前缀正确 | PASS |
| `canonicalUrl` | `https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley` | 无尾斜杠，规范 URL | PASS |
| `schemaType` | `Article` | 与项目 StructuredData `@type` 一致 | PASS |
| `faq` | `null` | 未另造 FAQ | PASS |
| `status` | `pending_translation_review` | 符合交接前状态定义 | PASS |
| `freezePublicBlogHandoff` | `false` | 待下一步由角色 F 冻结 | PASS |

---

## 媒体、图位与署名审核

### 1. 封面图（Cover）
- 规范文件：`how-to-harvest-stardew-valley-cover.webp`（479250 B）与 `how-to-harvest-stardew-valley-cover.avif`（237604 B）。
- 规格：1672×941，SHA-256 与 `zh-media.json` 及 staged 目录完全一致。
- `alt`：`傍晚的农场：一块耕地里是橙色南瓜，田块周围是土路，南瓜旁边是一排排木棚架。`（纯视觉描摹，无编辑腔）。
- `caption`：`农场的傍晚：橙色南瓜铺满土路旁的耕地，这块地旁边是木棚架。ConcernedApe，星露谷物语新闻素材截图。`
- 署名：`ConcernedApe`，链接 `https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png`。

### 2. 正文图位 1（`media-mature-crops`）
- 锚点段落：`## 怎么看出作物可以收` -> `### 看图像：最后一阶段可以收获的样子`。
- 尺寸：1672×941。
- `alt`：`土路旁的耕地上长着饱满的橙色南瓜。`
- `<figcaption>`：`饱满的橙色南瓜立在土路旁边的耕地上。ConcernedApe，<a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">星露谷物语新闻素材截图</a>。`
- 随文文字呼应：图后紧跟第 18 行讲解。

### 3. 正文图位 2（`media-trellis-paths`）
- 锚点段落：`## 收特殊作物：巨大作物和棚架` -> `### 棚架作物旁边留出走得到的路`。
- 尺寸：1672×941。
- `alt`：`两排木棚架中间有一条空土路，路旁的棚架上有紫色葡萄。`
- `<figcaption>`：`两排木棚架中间隔着一条空土路，路旁的棚架上是一串串紫色葡萄。ConcernedApe，<a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">星露谷物语新闻素材截图</a>。`
- 随文文字呼应：图后紧跟第 73 行通道讲解与规划器内链。

---

## 21 条公开引用核验

脚本对 `translation/zh-public-references.json` 与 `translation/zh-body.md` 进行了机器定位与人工语义核对：
- **引用总数**：21 条，每条引用的 `occurrence` 次数在正文中真实存在且出现次数 $\ge$ 标定值，定位失败数 0。
- **URL 对齐**：21 条引用的 URL 顺序与 `en-public-references.locked.json` 严格一一对应，维基修订号（`oldid`）完全一致。
- **引用文本一致性**：中文 quote 准确翻译了英文 quote 所支撑的事实锚点，没有将核查状态写进引用中。

| # | 引用 ID | 对应 URL | 中文 Quote 锚点 | Occurrence | 状态 |
|---|---|---|---|:---:|:---:|
| 1 | `zh-steam-parsnip-right-click` | `.../discussions/0/1849197902668085831/#c1849197902669410411` | 站在成熟植株旁边[右键点它](...) | 1 | PASS |
| 2 | `zh-wiki-parsnip-stages` | `.../index.php?title=Parsnip&oldid=191123` | 一株[防风草](...)浇水长 4 天，才会出现可以收获的图像。 | 1 | PASS |
| 3 | `zh-wiki-pumpkin-stages` | `.../index.php?title=Pumpkin&oldid=194726` | 一株[南瓜](...)浇水长 13 天，才会出现可以收获的图像 | 1 | PASS |
| 4 | `zh-wiki-blueberry-regrowth` | `.../index.php?title=Blueberry&oldid=192090` | 像[蓝莓](...)（Blueberry）这种会多次收获的作物，要 13 天才第一次成熟。 | 1 | PASS |
| 5 | `zh-wiki-crops-watering` | `.../index.php?title=Crops&oldid=193979` | [作物必须每天浇水，才能按最快速度生长](...) | 1 | PASS |
| 6 | `zh-steam-pc-right-click-harvest` | `.../discussions/0/1849197902668085831/#c1849197902669410411` | 站在成熟作物旁边，[右键点它](...) | 2 | PASS |
| 7 | `zh-wiki-controls-action` | `.../index.php?title=Controls&oldid=192481` | 键盘上[X 和右键映射成同一个 Check/Do Action](...) | 1 | PASS |
| 8 | `zh-wiki-controls-use-tool` | `.../index.php?title=Controls&oldid=192481` | [左键和 C](...)绑定的是使用工具或放置物品。 | 1 | PASS |
| 9 | `zh-wiki-crop-growth-calendars` | `.../index.php?title=Crop_Growth_Calendars&oldid=189875` | 按照[作物生长日历](...) | 1 | PASS |
| 10 | `zh-forum-hold-right-click-harvest` | `.../threads/pc-controls-vs-mobile.8990/post-53699` | 可以[按住右键，并且鼠标不要靠近角色](...) | 1 | PASS |
| 11 | `zh-forum-x-matches-right-click` | `.../threads/pc-controls-vs-mobile.8990/post-53699` | [X 映射成右键](...) | 1 | PASS |
| 12 | `zh-wiki-scythe-required` | `.../index.php?title=Scythe&oldid=171696` | 另外一些作物必须用普通[镰刀](...)来收 | 1 | PASS |
| 13 | `zh-wiki-kale-scythe` | `.../index.php?title=Kale&oldid=192520` | [甘蓝菜要用镰刀或更好的镰刀来收](...) | 1 | PASS |
| 14 | `zh-wiki-unmilled-rice-scythe` | `.../index.php?title=Unmilled_Rice&oldid=194130` | [未碾米要用镰刀来收](...) | 1 | PASS |
| 15 | `zh-wiki-fiber-seeds-scythe` | `.../index.php?title=Fiber_Seeds&oldid=193587` | [纤维种子要用镰刀来收](...) | 1 | PASS |
| 16 | `zh-wiki-mobile-select-scythe` | `.../index.php?title=Mobile_Controls&oldid=189843` | 在移动设备上，[先选中镰刀，再使用它](...) | 1 | PASS |
| 17 | `zh-wiki-iridium-scythe` | `.../index.php?title=Iridium_Scythe&oldid=186836` | [铱镰刀](...)是 1.6 耕种精通（Farming Mastery）给的那把镰刀。 | 1 | PASS |
| 18 | `zh-wiki-giant-crops-axe` | `.../index.php?title=Crops&oldid=193979#Giant_Crops` | 会掉落[15 到 21 个普通品质的物品](...) | 1 | PASS |
| 19 | `zh-wiki-trellis-crops-walkthrough` | `.../index.php?title=Crops&oldid=193979#Trellis_Crops` | [青豆、啤酒花和葡萄](...)（Green Bean、Hops、Grape）长在棚架上。 | 1 | PASS |
| 20 | `zh-press-mature-crops` | `.../Multiplayer_Screenshot2.png` | ConcernedApe，<a href="...">星露谷物语新闻素材截图</a>。 | 1 | PASS |
| 21 | `zh-press-trellis-paths` | `.../Multiplayer_Screenshot2.png` | ConcernedApe，<a href="...">星露谷物语新闻素材截图</a>。 | 2 | PASS |

---

## 链接多重集合（27 处目标）

正文中包含的 27 处链接与资源目标（23 个 Markdown 超链接 + 2 个 HTML `<a>` 标签 + 2 个 `<img>` 资源路径）在中文与英文两版中保持完全一致：
- 23 处超链接目标（含 3 处站内路由：`/`、`/last-day-to-plant-stardew`、`/what-to-grow-in-greenhouse-stardew`，以及 20 处社区维基/论坛/Steam 外部来源）URL 完全一致。
- 2 处 `<figcaption>` 内的 HTML `<a>` 链接均为 `https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png`。
- 2 处正文图片 `src` 均为对应 WebP 插图路径。

---

## 术语与读者口吻审计

1. **甘蓝菜（Kale）**：
   - 严格落实 `facts-audit-v2` FACT-11 要求。全篇（正文及 SEO Description）凡提及 Kale 处一律使用“甘蓝菜”，全文检索“羽衣甘蓝”出现次数为 0。
2. **首次出现附英文**：
   - 防风草（Parsnip）、苋菜（Amaranth）、甘蓝菜（Kale）、未碾米（Unmilled Rice）、纤维种子（Fiber Seeds）、巨大作物（Giant Crop）、蓝莓（Blueberry）、棚架（Trellis）、青豆、啤酒花和葡萄（Green Bean、Hops、Grape）、耕种精通（Farming Mastery）均在首现位置准确括注英文。
3. **harvest sprite 译法**：
   - 准确理解为作物生长阶段 Sprite 图像，全篇使用“图像”或“可以收获的图像”，未出现“精灵”、“妖精”等游戏生物混淆译词。
4. **读者口吻（无五类编辑腔）**：
   - 经正则与文本模式扫描，正文无“来源核查旁白”（如“已核对”、“已核验”、“可核对的示例”）；无“示例/实测免责”（如“仅供参考”、“不是官方最佳答案”）；无“图片自我说明”（如“插画用于表现”、“不代表游戏画面”）；无“文章自指与范围声明”（如“本文”、“本篇指南”）；无“验收词汇”（如“readback”、“复核一次”）。
5. **官方语言包边界声明**：
   - 本审校与条目规范均基于 Stardew Valley 社区中文维基条目历史记录，明确不声称对游戏二进制语言包（XNB/JSON）进行了解包核验。

---

## 验证命令与收据记录

执行环境与工作目录：`/Users/wusir/orca/workspaces/stardew planner/博客-2`

```bash
# 1. 角色 E 独立中文审校证据提取与多重校验（哈希、21条引用定位、27处链接、媒体规格、编辑腔与术语）
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/translation-r2/verify_translation_evidence.py

# 2. 官方正文计数脚本（中文仅作为参考值，不设独立计数门槛）
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/zh-body.md --locale zh-CN

# 3. 源码与排版格式检查
git diff --check -- docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation
```

**执行结果**：
- 3 条命令退出码均为 0。
- 计数结果：`mechanical_units` 为 1769，`length_class` 为 `reference_only`，`sha256_nfc_lf` 为 `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd`。
- 证据持久化文件：
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/translation-r2/sha256-receipts.json`
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/translation-r2/command-log.txt`
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/translation-r2/count-zh.stdout.json`
