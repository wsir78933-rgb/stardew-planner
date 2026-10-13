# F 英文锁稿与标题：how to harvest stardew valley

- 角色：F。不兼任 C、E、T、G、M。
- 任务 `task_c23688973c81`，Dispatch `ctx_0284b52eb529`，终端 `term_d444ff4c-d2a4-4550-b8e1-b8c84d4cb790`。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树。隔离只是目录约定，没有做操作系统权限试验。
- 协调者技术门已放行。放行消息 `msg_02685402d8ca`：主脑读过 D、E 同版报告后才放行。本角色又自己重算了文件哈希，没有用「任务成功」代替正文通过。
- 正文预算已用 3/3。本轮没有改 `writing/en-body.md`、SVG、媒体清单、译文、产品源码或媒体文件。
- 媒体后续归角色 M（`ctx_e40d02aea69d`），不归 G。G 只装配站点。本文件不代替 M 的公开资源，也不代替 E 的题文审核。

## 状态

正文已按批准字节锁定。Title、H1、Description 已选定，状态是 `pending_title_review`。`freezePublicBlogHandoff` 仍是 false。中文交接、用户终审和页面装配都还没有做。

## 1. 同版核对

D 报告 `reviews/D-en-round3-three-gates.md`：三门必须改的数量是 0，只对下表哈希有效。
E 报告 `reviews/E-en-body-review.md`：正文独立审核 PASS，绑定同一正文哈希。E 没有审核标题。

本角色重算 SHA-256，与两份报告和协调者给出的值一致：

| 文件 | SHA-256 |
|---|---|
| `writing/en-body.md` | `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101` |
| `writing/en-figure.svg` | `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661` |
| `writing/en-media.json` | `1d4cd52f3d7cc7b180e60183c8f18ca61bd58b1889243c02e44a1422c38451c3` |
| `media/en-figure-candidate.png` | `c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117` |
| `media/cover-candidate.png` | `bed8e9781d2f4034b7036d727e29fe2ab3511e6c9612239cc3827edf015f1ce3` |

正文 10093 字节，CR 0，LF 100，UTF-8。NFC 再编码后的 SHA-256 与原始字节相同，所以锁定副本没有改任何一个字节。若 NFC 或换行会改变批准正文，本角色应退回 C；这里不需要退回。

`writing/locked/en-body.md` 与 `writing/en-body.md` 字节相同。没有 `writing/locked/en-figure.svg` 这份副本。锁定的原文件就是 `writing/en-figure.svg`，哈希写在 `writing/locked/en-lock-manifest.json` 的 `figureSvgPath` 和 `figureSvgSha256`。SVG 用 XML 解析：宽 1672、高 941、viewBox `0 0 1672 941`，22 个 `<text>` 与媒体清单 `visibleText` 顺序一致。封面候选图没有文字。公开 WebP 和 AVIF 目前不存在。

## 2. 淬文

只核对，没有替 C 改稿。

- 主意图仍是 B 任务卡的 I01：玩家要知道成熟作物怎么收，手摘和镰刀怎么分，什么时候成熟，过季会怎样。没有改成金/天、升级或规划器教程。
- 五个必要子问题都在锁定正文里：手摘与按住走动、点名的镰刀作物和三种镰刀、生长天数与浇水、当季留下与过季枯死、巨型作物斧头和棚架留格。
- 正文没有编辑附录，也没有单独的 H1。页面 H1 用登记表的同一个 `title` 字段。
- 图注以 `Schematic:` 开头，后面只描述画面。alt 只描述画面。
- 信息增益在第 1 段和第 7–23 行：防风草用 Check / Do Action，点名作物用镰刀，按住时作用在脚下那一格。

## 3. 计数

命令：

```bash
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" --locale en docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md
```

退出码 0。输出：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md",
  "locale": "en",
  "mechanical_units": 1363,
  "required_floor": 1000,
  "meets_mechanical_floor": true,
  "long_form_target": 2000,
  "meets_long_form_target": false,
  "length_class": "short",
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [],
  "omitted_line_counts": {
    "headings": 15,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 44,
    "frontmatter": 0
  },
  "sha256_raw": "dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101",
  "sha256_nfc_lf": "dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101"
}
```

剔除说明：

- 原始机械数是 1363。脚本已经不计入 15 行标题（5 个 H2、10 个 H3）、URL 和 img 标签内部的 alt。alt 有 37 个英文单位，但不在这 1363 里，不能再减一次。
- 唯一还要剔除的是 figcaption。同一套单词规则数出 37。句子是：`Schematic: Stardew Valley crop harvest methods, with Right-Click or X for a parsnip, a scythe swing for kale, wheat, amaranth, unmilled rice, and fiber, plus an axe for giant crops, blocked trellises, and the day-28 season change.`
- 没有目录、FAQ、来源清单、代码块，也没有独立 CTA 模块。最后一段是棚架留格的操作，保留在计数里。
- 最终合格数：1363 − 37 = 1326。

这是短文，不是长文。主意图材料已经写完：读者能按 PC 的右键或 X 收防风草，按左键或 C 挥镰刀收甘蓝、苋菜、小麦、未碾米和纤维种子，用脚下那一格的长按收多株，用播种次日和缺水顺延判断成熟日，知道当季可以留到下一天、过季会枯，并用斧头收巨型作物、在棚架旁留一格。金/天、全作物百科、动物、果树、采集地图、祝尼魔和精通洞穴不属于这个主意图，没有拿来凑字。1326 在 1000–1999 内，可以交付短文。脚本输出不能当成语义通过。

## 4. 正文承诺

- 读者点开后能得到：防风草的右键或 X，镰刀作物的挥击，长按时脚下那一格，生长天数，过季枯死，巨型作物和棚架。
- 正文最大的事实：防风草不用镰刀，站在旁边右键；甘蓝、苋菜、小麦、未碾米和纤维种子用镰刀。
- 本篇能讲清的一点：Check / Do Action 和 Use tool 是两套动作，长按作用在角色脚下那一格。
- 绝对不能写：最快、最佳、实测收益、全平台作物键、手摘耗能、镰刀会毁掉防风草、金/天或经验指南。

## 5. 十个英文方向

生成时没有先分配六种机制。十个都围绕怎么收成熟作物。

1. How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe
   - 方向：站在成熟防风草旁边右键或按 X。甘蓝、苋菜、小麦、未碾米和纤维种子用镰刀挥击。
2. A Ripe Parsnip Does Not Need a Scythe in Stardew Valley
   - 方向：右键或 X 收防风草。镰刀留给甘蓝、小麦、苋菜、未碾米和纤维。
3. Hold Right-Click and Walk to Harvest More Than One Crop
   - 方向：鼠标离开角色时，长按作用在脚下那一格。手里有种子时，同一格会同时种下。
4. Leave Wheat Until Fall 1 or Cut It in Summer for the Hay Chance
   - 方向：夏 28 还在地里的小麦会进秋 1，肥料还在。夏天收则有 40% 掉干草。
5. Your Parsnip Planted on Spring 1 Is Ready on Spring 5
   - 方向：4 天防风草不把播种日算进去。春 3 没浇就到春 6。
6. The Iridium Scythe Harvests Crops on Tilled Soil; the Golden Scythe's List Does Not
   - 方向：1.6 领取 Farming Mastery 后得到铱金镰刀，挥击收取耕地范围内的作物。黄金镰刀页面列出的是范围、草、干草概率和伤害。
7. Giant Crops Take Three Axe Hits and Drop 15 to 21
   - 方向：花椰菜、甜瓜、南瓜、粉瓜和 Qi Fruit 组成 3×3，左上角成熟并浇过水才可能变巨型。任意斧三下，掉 15 到 21 个普通品质。
8. Green Beans Block the Tile Until the Plant Is Dead
   - 方向：青豆、啤酒花和葡萄的格子走不过去。青豆第一次收成后再过 3 天还要站到旁边那一格。
9. Unwatered Days Do Not Count Toward a Stardew Valley Harvest
   - 方向：生长时间不含播种当天。每缺水一天，可收日往后一天。
10. After Day 28, an Out-of-Season Crop Wilts
    - 方向：当季的成熟防风草可以留过夜。下一天如果不当季，植株枯死，地还是耕过的。

## 6. 归类和筛选

| 编号 | 机制 | 停留要素 | 处理 |
|---|---|---|---|
| 1 | 结论前置 | 异常、捷径 | 保留 |
| 2 | 结论前置 | 异常 | 保留 |
| 3 | 结论前置 | 捷径 | 保留 |
| 4 | 损失进入 | 金钱 | 保留，但不选。它只覆盖小麦过季，认不出主查询 |
| 5 | 反差数字 | 异常 | 保留，但不选。它只回答哪一天可收 |
| 6 | 自我颠覆 | 异常、冲突 | 淘汰。正文只列出黄金镰刀的正面属性，没有写「清单不包括普通作物」。标题把这个否定说成了结果 |
| 7 | 反差数字 | 异常 | 保留，但不选。巨型作物是例外，不是主查询 |
| 8 | 悬念场景 | 冲突 | 保留，但不选。棚架是例外 |
| 9 | 结论前置 | 异常 | 保留，但不选。它只回答浇水，没回答怎么收 |
| 10 | 终结 | 终结 | 保留，但不选。它只回答不收会怎样 |

没有为了补满六种机制去改写。淘汰 6 号后没有再造第 11 个。

## 7. 最近 3 篇英文标题

来源是 `src/blog/blog-post-registry.tsx` 英文数组末尾三篇，登记顺序就是本站加文顺序：

| 位置 | slug | Title |
|---|---|---|
| 倒数第 3，约第 409 行 | `what-to-grow-in-greenhouse-stardew` | What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting |
| 倒数第 2，约第 424 行 | `stardew-fruit` | Stardew Fruit: Find Its Source Before Buying Seeds |
| 最新，约第 439 行 | `oak-tree-vs-maple-stardew` | Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree |

三套路是：`Choose by A, B, and C`，`Find X before Y`，`A or B names the thing`。十个候选都没有这三种句式。更早的「How to …: 事实; 事实」不在这三篇里，第 1 号可以使用。

## 8. 停留和适配

选定第 1 号。

停留：会收成的玩家如果拿镰刀去砍防风草，标题直接给出另一套动作，并点出甘蓝才要镰刀。停下来的原因是「防风草和甘蓝不是同一种收法」，不是「标题看起来清楚」。正文第 1 段就写了这两件事。

适配：

- Right-Click、Parsnip、Kale、Scythe 都在正文里。
- 没有标题数字。
- 点名的是要收这两种作物的玩家。
- 右键收防风草、镰刀收甘蓝，正文都给了做法。X 和「or better」放在描述和正文，标题没有写成「只能右键」或「只能新手镰刀」。
- 情绪没有超过正文。没有最快、最佳或收益。

描述同步核对：右键或 X、五种镰刀作物、播种次日、缺水顺延，都是正文原有事实。没有第二个搜索意图。

## 9. 选定表面

项目只有一个 `title` 字段。`BlogArticleContent` 把它渲染成唯一 H1。`createPublicPageMetadata` 把同一字符串用作文档标题、Open Graph 标题和 Twitter 标题。因此 Title 与 H1 使用同一句，不新增分离字段。

- Title / H1：`How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe`
- Description：`Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back.`
- slug：`how-to-harvest-stardew-valley`
- 公开路径：`/how-to-harvest-stardew-valley`
- canonical：`https://stardewvalleyplanner.art/how-to-harvest-stardew-valley`
- 作者：`Stardew Valley Planner Team`。这是登记表里已有的英文团队名。
- 主题：`Stardew Valley Guides`
- 日期：不造。JSON-LD 维持项目现有的 `Article`，不补 `datePublished`，也不把 FAQPage 加进去。
- FAQ：无。
- `readTimeMinutes`：7。这是 `BlogPostMeta` 里已有的整数，不是新字段。计算是合格英文单位 1326 除以 200，6.63 向上取整得 7。Python `(1326 + 200 - 1) // 200` 的结果是 7。它是预计阅读时间，不是实测。英文页面沿用 `blog-copy.ts` 的现有模板 `{minutes} min read`，所以读者会看到 `7 min read`。中文沿用现有模板 `阅读约 {minutes} 分钟`，同一数字 7，读者会看到 `阅读约 7 分钟`。中文模板里的「约」是项目原文，英文模板没有 estimated 这个词，本轮不改模板。
- `featured`：false。本任务没有授权把这篇放进精选。这也是登记表里已有的布尔值。

封面候选图没有文字。批准给 T 翻译的英文 alt 是：

`Illustration of a farm: leafy crops in tilled soil beside a crate of orange roots, three pumpkins and a hoe, rows of yellow stalks with a scythe and a vine trellis, and a brown-roofed building with plants in its windows.`

这句只描述看到的画面：叶菜、橙色根、三只南瓜、锄头、黄色秆、镰刀、藤架，以及棕屋顶、窗内有植物的房子。不把它叫成游戏内温室，也不写成收获教程。封面 `src` 仍是 `pending_media`。句中的 hoe 留给 E 对照封面原图判断，本轮不改这句。正文图的 alt、caption 和 22 条可见文字沿用已锁正文与 SVG，没有改字。

## 10. 交给 E 的文件

- `writing/locked/en-body.md`
- `writing/locked/en-lock-manifest.json`
- `seo/en-seo.json`
- `seo/en-public-references.json`

公开引用 18 条。每条 `appliesTo.quote` 都是锁定正文里的原片段，`occurrence` 都是 1，并且 URL 就在该片段里。五种镰刀作物共用开篇那一句，因为那一句同时链出五个页面并写出「are cut with a scythe」。没有把 operation store、研究日志、原始 SERP 或私有路径放进这两份 JSON。

本角色不签署题文通过。E 通过之前不冻结两份 PublicBlogHandoff，也不叫 T 或 M 开工。
