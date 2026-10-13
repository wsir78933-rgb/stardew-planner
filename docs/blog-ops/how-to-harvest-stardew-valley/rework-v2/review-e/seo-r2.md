# 角色 E 英文标题与 SEO 独立审核 · 第 2 轮

- 审核角色：E。不兼任 A、B、C、D、F、T、G，也不代替主脑。
- 任务：`task_c1f88c107e6e`；派发：`ctx_07bea4b4bacd`
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 前置：F 第 2 轮锁稿 `task_9f6e1015f10b` 已完成。D 第 2 轮 `task_9a49307208a9` / `ctx_a7afcadd5874` 与 E 正文第 2 轮 `task_f52988ed2be5` / `ctx_0eafdf7031cb` 绑定同一正文。
- 审核对象：`rework-v2/en-body.locked.md`、`en-seo.json`、`en-media.locked.json`、`en-public-references.locked.json`
- 本轮只新增本报告和 `review-e/evidence/seo-r2/`。未改正文、SEO、媒体、产品代码或旧记录。未跑 build，未开浏览器。

## 结论

**通过（PASS）。** 公开 Title、H1、Description、slug、readTime、封面 alt，以及正文图和 21 条公开引用，都落在已锁正文和 staged 媒体上。问题清单为空。此结论只对下面这组版本有效。

允许独立 T 翻译这一版英文正文和这一组英文 Title / H1 / Description。`en-seo.json` 里的 `status` 仍是 `pending_title_review`，`freezePublicBlogHandoff` 仍是 `false`，因为本角色不改 SEO 文件。技术锁定和本报告的通过，都不是用户终审，也不是上线。用户终审仍待真实网页。

## 绑定版本

| 文件 | 原始字节 SHA-256 | 字节数 | NFC-LF 是否相同 |
|---|---|---:|:---:|
| `rework-v2/en-body.locked.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | 10036 | 是 |
| `rework-v2/en-seo.json` | `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9` | 3201 | 是 |
| `rework-v2/en-media.locked.json` | `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885` | 4229 | 是 |
| `rework-v2/en-public-references.locked.json` | `52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e` | 10294 | 是 |

`writing/en-body.md` 与锁稿正文哈希相同。SEO 的 `bodyHash`、媒体的 `bodySha256NfcLf`、引用的 `bodyHash` 都是 `d2908d59…`。

`lock-f/` 里的正文、SEO、媒体与根目录锁稿字节相同。引用副本哈希是 `24d5c227dd11e5e4cd96bab3d937a7e4547cde72af84e4816b5838e009f9db96`。两边 21 条 quote、url、occurrence 相同，唯一差别是 `bodyFile`：根目录指向 `rework-v2/en-body.locked.md`，副本指向 `lock-f/en-body.locked.md`。本审以根目录四个文件为准。

## 问题清单

无。没有需要退回 F 的标题、描述、阅读时间、封面 alt 或引用绑定问题。

## 公开题文

- Title / H1：`How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe`
- Description：`Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.`
- slug：`how-to-harvest-stardew-valley`
- `titleEqualsH1`：`true`

Title 与 H1 是同一句。句子直接给出徒手、镰刀、斧头三种收法，读起来是完整的英文 how-to，没有冒号堆砌，也没有第二个主意图。停留点是「收成不是一个键」：正文有徒手、镰刀、斧头三节，接得住这句。

同站英文注册表里、本篇之前的 3 个标题是：

1. `What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting`
2. `Stardew Fruit: Find Its Source Before Buying Seeds`
3. `Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree`

本标题没有沿用 “Choose by”、 “Find its source before” 或 “vs”。

兑现位置都在锁稿正文：

| 公开承诺 | 正文位置 |
|---|---|
| 普通作物徒手，右键 | 第 1 行 |
| 防风草不需要镰刀 | 第 1 行 |
| 键盘 X 与右键同一动作，位于 PC 一节 | 第 30–32 行 |
| 南瓜作为普通作物的成熟外观 | 第 9 行 |
| 不能徒手摘的是镰刀作物和 3×3 巨型作物 | 第 80 行 |
| 甘蓝、小麦等要用镰刀 | 第 48 行 |
| 巨型作物任意斧头，三下 | 第 60 行 |

Description 点名南瓜，是作为普通作物例子。南瓜不在镰刀名单里，也不在巨型作物名单里。正文没有把南瓜写成另一种工具。

平台范围停在正文已写的范围。Description 只写 right-click 或 X。X 在第 32 行定义为键盘上的 Check/Do Action。移动端只在第 50 行要求先选中镰刀。正文和 Description 都没有 Xbox、PlayStation、Switch 或全平台采摘键。

Description 是纯文本，没有 HTML。Title、Description、封面 alt 里没有最快、终极、官方指南、Creative Commons、排名或无截断保证。

实测字符数：Title 59，Description 142，封面 alt 127。这只是字符数。锁稿私有报告里的「141」和「符合字符区间就无截断风险」留在私有记录里，本审不把它当成公开承诺，也不据此要求改公开字段。

## 身份、canonical、hreflang、readTime

项目公开字段来自 `BlogPostMeta`、`createCanonicalUrl` 和 `createPublicLanguageAlternates`。页面在 `app/(en)/[slug]/page.tsx` 与 `app/zh/[slug]/page.tsx`。

| 字段 | 锁稿值 | 项目依据 |
|---|---|---|
| author | `Stardew Valley Planner Team` | 英文注册表使用这一作者名；没有另造个人作者 |
| datePublished | `null` | `createArticleStructuredData` 不写发布日期 |
| canonicalUrl | `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley` | 站点源是 `https://stardewvalleyplanner.art`，路径无尾斜杠 |
| publicPath | `/how-to-harvest-stardew-valley` | 与 slug 一致，slug 已在 `blogPostSlugs` |
| topic | `Stardew Valley Guides` | 英文文章主题字段 |
| schemaType | `Article` | 与 `createArticleStructuredData` 的 `@type` 一致 |
| faq | `null` | 没有另造 FAQ |
| featured | `false` | 与本篇注册约定一致 |
| hreflang | SEO 对象里没有单独的 hreflang | 页面由 `createPublicLanguageAlternates` 生成 `en`、`zh-CN`、`x-default` |

按当前项目函数，这条 slug 的语言交替地址是：

- `en` / `x-default`：`https://stardewvalleyplanner.art/how-to-harvest-stardew-valley`
- `zh-CN`：`https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley`

文档标题、Open Graph 和 Twitter 使用同一条 `post.title`。根布局没有标题后缀模板。H1 也是 `post.title`。

readTime：官方计数脚本对锁稿全文得到 1148，去掉两段 `<figure>` 后得到 1107。`ceil(1107 / 200) = 6`，`ceil(1148 / 200) = 6`。字段 `readTimeMinutes` 是正整数 6，能被 `formatBlogReadTime` 用。200 词/分钟是阅读时间估算，不是游戏规则。

## 封面 alt 与正文媒体

封面 alt：`An evening farm with orange pumpkins in a tilled bed, dirt paths around the plots, and wooden trellis rows beside the pumpkins.`

本审用 `dwebp` 把 staged WebP 解到 `review-e/evidence/seo-r2/decoded/`，三张都与原先查看的 `media/decoded/*.webp.png` 哈希相同，`dwebp` 退出码 0，并打印 1672×941。封面画面有橙色南瓜耕地、田块周围的土路，以及紧挨南瓜的木棚架。alt 写的是这些可见内容，没有写成正在采摘，也没有写成授权许可。

正文两图的 alt、src、1672、941 与锁稿正文 `<img>` 一致，caption 与 `<figcaption>` 一致。封面 URL 不在正文里。三张图的公开 AVIF 路径都是对应 WebP 换成 `.avif`，与 `createPublicAvifSource` 的结果一致。

`sips` 对 6 个 staged 文件的退出码都是 0，尺寸都是 1672×941，SHA-256 与锁稿媒体字段一致：

| 文件 | 字节 | SHA-256 |
|---|---:|---|
| cover.webp | 479250 | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` |
| cover.avif | 237604 | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` |
| mature-crops.webp | 267644 | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` |
| mature-crops.avif | 143638 | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` |
| trellis-paths.webp | 223784 | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` |
| trellis-paths.avif | 113557 | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` |

图注只标明 ConcernedApe 的 press screenshot 和图片 URL。没有 Creative Commons，也没有把同一来源再列成文末来源表。写作侧 `writing/en-media.json` 的两段正文图注少了正文里已经有的链接；锁稿图注跟的是正文，不是另一套句子。

`public/blog/` 里的旧封面哈希仍是 `8558f5b08e0c3e890ceddfcffb7104ed0a0fb0380dedec4108beed46220b81d8`。本审看的是 staged 文件。公开目录还没换成这批图，这是后续装配的事，不改变本次题文结论。

## 21 条公开引用

脚本核对 21 条。每条 quote 的出现次数都不少于所写 occurrence，URL 都以 `https://` 开头并且写在 quote 里，没有私有路径。与 E 正文轮通过的 `writing/en-public-references.json` 锚点一致。失败数 0。

两处 press 图注使用同一句和同一个图片 URL，occurrence 分别是 1 和 2，对应正文两段 figcaption。这是定位，不是把来源重复贴成第二份清单。

## 验证命令

工作目录：`/Users/wusir/orca/workspaces/stardew planner/博客-2`

```text
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/seo-r2/collect_seo_evidence.py
```

退出码 0。标准输出：

```text
body d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67
seo 659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9
media 87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885
references 52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e
words full=1148 eligible=1107 readTime=6
references_checked 21
title_chars 59 description_chars 142
```

计数脚本由上面的脚本调用，退出码都是 0，stderr 为空：

- 全文：`mechanical_units` 1148，`length_class` short，`meets_mechanical_floor` true
- 去掉两段 figure：`mechanical_units` 1107，同样 short

`dwebp` 三张 staged WebP，退出码都是 0，尺寸 1672×941，解出的 PNG 与已查看的 decoded PNG 哈希相同。

收据：`review-e/evidence/seo-r2/sha256-receipts.json`。命令记录：`review-e/evidence/seo-r2/command-log.txt`。
