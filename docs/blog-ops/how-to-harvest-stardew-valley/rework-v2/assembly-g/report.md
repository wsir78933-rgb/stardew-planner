# 角色 G 装配报告 · how to harvest stardew valley

- 角色：G，只装配。不兼任 A/B/C/D/E/F/T，也不做独立页面 PASS。
- 任务：`task_da302b3c0a67`；派发：`ctx_ca7a77081054`
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 用户终审：未开始。部署：未做。技术冻结不是用户通过。

## 消费的冻结交接

| 文件 | 文件 SHA-256 | 正文 SHA-256 |
| --- | --- | --- |
| `rework-v2/handoffs/public-blog-handoff-en.json` | `8ca4288debffa704154f48db2a58b68a2fadbd68fa2628040b49d37a7f56485f` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` |
| `rework-v2/handoffs/public-blog-handoff-zh.json` | `896976369ee8abc18fbcc5983f2f5472fa5b0dcd216244f2046eeca6a390d7eb` | `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd` |

中文 `30dae640…` 是 E 译文审核 `review-e/translation-r2.md` 的 PASS 版本，并由 F 写入冻结交接。`integrity.eTranslationReview` 为 `PASS`，`sourceEnglishBodyHash` 为上面的英文正文哈希。装配没有沿用未冻结候选。

TSX 文件字节不是 Markdown bodyHash。英文组件文件 SHA-256 是 `40743d572fb3a56fb32da4789e4b3b16a61e54cd6ad6072f95763a50c6b2a0c6`（12082 字节）。中文组件文件 SHA-256 是 `3e5eda8192c4f850e9023427180c802acda5eb78eeb2d8efd23686f238be5ee0`（11228 字节）。

## 可见正文映射

`compare_visible_body.mts` 用 React 静态渲染比对交接可见文字。两边都是 40 个文字块、25 个 href，全部一致。21 条公开引用的 URL 都出现在渲染链接里，可见引文出现次数达到 `occurrence`。明细在 `visible-body-comparison.json`。

英文标题：`How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe`。描述：`Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.`

中文标题：`星露谷物语怎么收作物：徒手、镰刀或斧头`。描述：`防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。`

阅读时间两边都是 6。作者、主题、featured、slug 沿用现有登记字段。`blog-post-identities.ts` 与 `blog-copy.ts` 里这篇 slug 的映射在本轮开始前已经正确，文件时间停在 2026-10-13 02:07，本轮没有改。

正文内链按现有中文路径处理：英文 `/`、`/last-day-to-plant-stardew`、`/what-to-grow-in-greenhouse-stardew`；中文 `/zh`、`/zh/last-day-to-plant-stardew`、`/zh/what-to-grow-in-greenhouse-stardew`。没有新公开接口。

## 六张公开资产

| 公开路径 | SHA-256 | 字节 |
| --- | --- | --- |
| `/blog/how-to-harvest-stardew-valley-cover.webp` | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | 479250 |
| `/blog/how-to-harvest-stardew-valley-cover.avif` | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | 237604 |
| `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | 267644 |
| `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif` | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | 143638 |
| `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | 223784 |
| `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif` | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | 113557 |

`PublicPicture` 只收到 `.webp`。两张正文图是 `width={1672}`、`height={941}`、`loading="lazy"`。封面仍由现有 `BlogArticleContent` 渲染，不带 `loading="lazy"`。

旧方法图仍在，未删除：

| 文件 | SHA-256 |
| --- | --- |
| `how-to-harvest-stardew-valley-en-methods.webp` | `c5d987fdd4c2d1799358baf987ee31a5b7a9d90b5933c7e3fc1eb43c4a1883a5` |
| `how-to-harvest-stardew-valley-en-methods.avif` | `92476d4c389afbf12d2b40e1a0773139a33c6fd0e24df71be97918a05ba4d861` |
| `how-to-harvest-stardew-valley-zh-methods.webp` | `450f78bb5aefcc6dda6826cb9fcda8a2af45f9778e077b49012596dbb38394f2` |
| `how-to-harvest-stardew-valley-zh-methods.avif` | `d918433c39793cf8f455281b4ba4606749eff17d68d7c6d682183f07f5e33d6a` |

baseline 里的旧封面备份也还在。

## 封面图注

现有文章头只渲染封面 `alt`，没有图注字段。英文封面 alt 与中文封面 alt 已进登记，并出现在 3004 的 HTML 里。交接里的封面 caption，以及封面署名链接 `farm_evening_1920x1080.png`，没有现成槽位，所以没有写进页面。两张正文图的 alt、caption 和 ConcernedApe 署名链接都在页面里。没有改页面模板。

## 本轮改过的产品文件

- `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`
- `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`
- `src/blog/blog-post-registry.tsx` 里这篇 slug 的双语标题、描述、阅读时间和封面 alt
- `public/llms.txt` 里这篇的中英文条目
- 上面六张公开图片
- `tests/blog/blog-planner-cta.test.tsx`
- `tests/blog/blog-post-registry.test.ts`

另外 6 个允许更新的测试文件，本轮内容没有把它们打失败，所以没有改。它们相对 HEAD 的旧差异是更早的未提交登记，文件时间停在 02:07–02:26。
