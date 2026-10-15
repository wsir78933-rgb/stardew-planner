# 角色 E 页面验收 · how to harvest stardew valley · r2

- 角色：E。只做本篇最终工程和页面验收。不改正文、标题、译文、SEO、媒体、产品代码。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 预览：`http://127.0.0.1:3004`。验收开始时 `next-server` PID `44772`，cwd 是本树，启动时间 Tue Oct 13 02:41:04 2026。英文和中文文章路由当时都是 HTTP 200。
- 英文：`http://127.0.0.1:3004/how-to-harvest-stardew-valley`
- 中文：`http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`
- TaskSpace：`151`，名称 `harvest page r2 acceptance`，只用 `p1`。没有 finish。结束时停在英文桌面 1440×900，标题是当前英文 H1。
- 页面结论：**不给整体 PASS**。唯一未关闭项是冻结交接里的封面图注和封面署名链接没有出现在页面上。主脑正在等用户决定要不要做最小适配。其余本篇检查没有新的必须退回的正文或装配错误。
- 用户终审：未做。没有 commit、merge、push 或部署。G 的测试通过和这次浏览器检查都不是用户通过。

## 版本

| 项 | 英文 | 中文 |
| --- | --- | --- |
| 冻结交接文件 SHA-256 | `8ca4288debffa704154f48db2a58b68a2fadbd68fa2628040b49d37a7f56485f` | `896976369ee8abc18fbcc5983f2f5472fa5b0dcd216244f2046eeca6a390d7eb` |
| bodyHash | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd` |
| 标题 / H1 / meta / OG | How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe | 星露谷物语怎么收作物：徒手、镰刀或斧头 |

对照脚本：`review-e/evidence/page-r2/comparison.json`。两边可见正文与冻结交接一致，21 条引用 URL 都在文章链接里，引文出现次数没有少于 `occurrence`，两张正文图的 src、alt、caption 与交接一致。

## 未关闭问题

1. 位置：英文和中文文章头的封面。类型：装配缺口。冻结封面图注和封面署名链接 `farm_evening_1920x1080.png` 没有进页面。现有 `BlogPostMeta.coverImage` 只有 `src` 和 `alt`，`BlogArticleContent` 也只渲染这两项。修改要求：等用户决定是否授权最小适配。若要显示，由 G 绑定冻结图注和署名链接，不改写句子，也不由 E 代写。在显示之前，不能把这两项记成已经上页。

没有发现需要退回 C 或 T 的正文差异，也没有发现旧方法文字图、placeholder 或黑线框。

## 浏览器

视口用 `page.cdp("Emulation.setDeviceMetricsOverride")`，再用 `window.innerWidth/innerHeight` 核对。截图用 `screenshot({ fullPage: false, scale: "css" })`。语义定位用 snapshot。没有开新的 TaskSpace，没有用 Playwright。

桌面英文正文图在滚到之前，棚架图 `naturalWidth` 是 0、`currentSrc` 为空，滚到之后才解码。封面没有 `loading="lazy"`，一打开就已经是 1672×941。这符合封面优先、正文图懒加载。中文第一次打开时两张正文图已经在缓存里，所以不能用中文的“打开即有尺寸”否定懒加载。

第一次中文正文图截图有过空白框，像素回读和隔帧重截能看到画面。那是截图赶在绘制前，不是页面一直空白。下面“重截”是认可用的画面证据。

| 视口 | 截图 | snapshot |
| --- | --- | --- |
| 英文 1440×900 | `evidence/page-r2/en-desktop-1440x900-top.png`、`cover.png`、`mature.png`、`trellis.png`、`bottom.png`、`nav-blog.png` | `en-desktop-1440x900-top.snapshot.txt`、`en-desktop-1440x900-full.snapshot.txt` |
| 中文 1440×900 | `zh-desktop-1440x900-top.png`、`cover.png`、`mature-reread.png`、`trellis-reread.png`、`bottom.png` | `zh-desktop-1440x900-top.snapshot.txt`、`zh-desktop-1440x900-full.snapshot.txt` |
| 英文 390×844 | `en-mobile-390x844-top.png`、`cover.png`、`mature.png`、`trellis.png`、`nav-blog.png` | `en-mobile-390x844-top.snapshot.txt`、`en-mobile-390x844-full.snapshot.txt` |
| 中文 390×844 | `zh-mobile-390x844-top.png`、`cover.png`、`mature-reread.png`、`trellis-reread.png` | `zh-mobile-390x844-top.snapshot.txt`、`zh-mobile-390x844-full.snapshot.txt` |

语言菜单 snapshot：`language-menu-before-zh.snapshot.txt`、`language-menu-mobile-zh.snapshot.txt`。

看到的画面：

- 封面是同一张傍晚农场：橙色南瓜、田边土路、南瓜旁的木棚架、暖色树林。不是旧的文字说明图。
- 成熟作物图是同一片南瓜田，南瓜在耕地上，旁边有土路。不是采摘动画，也不是人物动作时序。
- 棚架图是同一条木架中间的泥土通道，架上有葡萄。
- 中文 alt 和正文图注是中文。英文是英文。两边 `currentSrc` 都是对应 `.avif`。自然尺寸都是 1672×941。
- 封面在标题和作者行下面。南瓜图在蓝莓段落后、计算收获日之前。棚架图在棚架走道段落后、症状段之前。
- 桌面正文图宽 704，封面宽 1088。手机三张图都是宽 358、高 201，左右在 16 和 374，没有超出 390。桌面 `scrollWidth` 1434 对 `clientWidth` 1434。手机 `scrollWidth` 390 对 `clientWidth` 390。四个视口都没有横向溢出元素。
- 手机标题、正文和图注能读。封面是整幅 16:9 缩小，南瓜和棚架还认得出来。

真实点击：

- 桌面和手机都点了 Blog，进入 `http://127.0.0.1:3004/blog`，H1 是 `Stardew Valley Planning Guides`，再回到本文。
- 桌面和手机都点开语言菜单，再点中文，进入 `/zh/how-to-harvest-stardew-valley`，H1 变成中文标题。
- 文内链接的真实 href：英文 `/`、`/last-day-to-plant-stardew`、`/what-to-grow-in-greenhouse-stardew`；中文 `/zh`、`/zh/last-day-to-plant-stardew`、`/zh/what-to-grow-in-greenhouse-stardew`。每篇 25 个文章链接，21 个外部引用 URL 都在其中。页面正文没有 `methods.webp`、旧标题 “Right-Click a Parsnip”、旧句「羽衣甘蓝需要镰刀」，也没有 `rework-v2`、`docs/blog-ops`、placeholder。operation-store 的 canary 没有出现在标题、页眉或正文里。

## SEO

- canonical 英文 `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley`，中文 `https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley`。
- hreflang：`en`、`zh-CN` 互指这两条，`x-default` 指向英文。
- description、`og:title`、`og:description`、`og:url` 与当前标题和描述一致。`og:type` 是 `article`。`og:image` 是封面 webp 的正式站地址。
- JSON-LD 是 Article，不是 FAQPage。`headline`、`description`、`url`、`inLanguage` 与当前语言一致。交接里的 `datePublished` 是 null，页面没有编造日期。作者出现在可见的作者行里；现有 Article 函数不接收作者，JSON-LD 里没有作者字段。这次没有改 schema。
- robots 是 `index, follow`。

## 工程复核

只读了 G 的范围和日志，没有重跑 typecheck、Vitest 或 build。

G 重跑日志，都在 `rework-v2/verification-g/`：

| 命令 | 退出码 | 证据 |
| --- | ---: | --- |
| `git diff --check` | 0 | `git-diff-check-r2.exit.txt` |
| `pnpm typecheck` | 0 | `typecheck-r2.exit.txt`，stdout 85 字节，stderr 0 |
| `pnpm exec next build --webpack` | 0 | `build-webpack-r2.exit.txt` |
| 隔离 Vitest 8 个文件 | 0 | `vitest-r2.stdout.txt`：8 files passed，93 tests passed，0 failed，21:09:34 |
| 两语言与六图 HTTP 回读 | 0 | `http-reread-r2.exit.txt` |

更早一轮 typecheck 退出码 2、webpack build 退出码 1，原因是 baseline 快照，日志还在 `typecheck.exit.txt` 和 `build-webpack.exit.txt`。那一轮不是这次通过。`pnpm test` 和 lint 没有跑。lint 脚本本来就没有。

相对 HEAD 的本篇差异：两篇组件是未跟踪新文件，只从公开的 `PublicPicture` 引入。登记表只增加本篇双语标题、描述、阅读时间、封面 alt 和组件。`public/llms.txt` 只增加中英各一行。`blog-post-identities.ts` 和 `blog-copy.ts` 只增加本篇 slug 路径。`package.json` 和 lockfile 没有差异。`tsconfig.json` 只多排除 `rework-v2/baseline/files`，这是用户已选的 Q 改动，不记成 G 越权。`next-env.d.ts` 现在是 296 字节，SHA-256 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，与 G 说的恢复后哈希一致。

六张公开图的文件字节和 SHA-256 与冻结交接一致。封面 webp `0f35cee83ceb…` 479250 字节，封面 avif `8c23cae6ef5b…` 237604 字节；南瓜 webp `d24578e3860a…`，avif `cab14677146b…`；棚架 webp `027e085cd18d…`，avif `7991d66a038a…`。

## 未验证

- 没有点击每一条外部引用去打开 Steam、wiki 或论坛。核对的是页面上的真实 href。
- 没有重跑 G 的 typecheck、Vitest、build。
- 开发提示：页面稳定后，snapshot 里的按钮是 `Open Next.js Dev Tools`。打开后菜单只有 Route Static、Bundler Webpack、Route Info、Preferences，没有 Issue 项。Route Info 只列出 `/how-to-harvest-stardew-valley`、`layout.tsx`、`page.tsx`。关闭后再刷新，8 秒内没有出现文字为 Issue 的按钮，页面 H1 仍在，正文也没有 `Unexpected end of JSON input`。证据：`next-dev-tools.png`、`next-dev-tools.snapshot.txt`、`next-route-info.png`、`next-route-info.snapshot.txt`、`next-after-reload.png`。
- 更早的抓图里，左下角曾显示红色 “1 Issue”，有的同时显示 Compiling。那时候没有打开它。另一次切到手机宽度时，整页曾是 Runtime SyntaxError：`Unexpected end of JSON input`，同一 Tab 刷新后文章恢复，后来的手机验收没有再出现。不能把已经消失的 “1 Issue” 说成就是这条 JSON 错误，也不能说成这篇文章的内容错误。它现在不在页面上。
- TaskSpace 151 按主脑要求留着，没有 finish receipt。
- 用户还没有在页面上终审。
