# G 装配与本地验证

角色 G。任务 `task_3508384dd30b`，Dispatch `ctx_25f1b800b385`。工作树只有 `/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有提交、合并、推送、部署，也没有新增依赖。用户终审没有开始。部署没有开始。

默认 `pnpm build`、`pnpm build --webpack`、三个读 `out/` 的测试，以及构建后重新拉起的预览，结果都在下面。用户终审没有开始。部署没有开始。

## 装配输入

这些哈希是本任务读盘算出来的，不是沿用旧失败记录。

- 英文交接 `handoffs/public-blog-handoff-en.json`：`8ed90bfab4dbdd4158ae2b0fe38e5f380f3922d2d1922b3ae5142017c51ee2c9`
- 中文交接 `handoffs/public-blog-handoff-zh.json`：`3debdcefc4bb9e7217bd43e1fdb3484d1b7ef5e3418b073d6ec308e4ef7034de`
- 媒体清单 `media/final-manifest.json`：`46052a8fb71df1670982203c612238e16333bde5eecdf5a6ecc12443019bbace`
- Git HEAD：`64a3b21b19444892654f98bc8042db4a95cbd1a8`
- 英文正文组件：`dacc4d0361dbd894eec29a6f67b554ce8ee5033d78de6aba1fa87b9b48218daf`
- 中文正文组件：`98f2835aea750c56e931b933dd4b7ef158c679095c26fb0f5ea1f965827663ae`

旧中文交接 `fc834…` 没有用。六份公开媒体只读，哈希与清单一致：

- `public/blog/how-to-harvest-stardew-valley-cover.webp` `8558f5b08e0c3e890ceddfcffb7104ed0a0fb0380dedec4108beed46220b81d8`
- `public/blog/how-to-harvest-stardew-valley-cover.avif` `ccd28749dfd7047666d8bcbf8410aa929a060e660cc882d3814ef74d6dec19cd`
- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` `c5d987fdd4c2d1799358baf987ee31a5b7a9d90b5933c7e3fc1eb43c4a1883a5`
- `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif` `92476d4c389afbf12d2b40e1a0773139a33c6fd0e24df71be97918a05ba4d861`
- `public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` `450f78bb5aefcc6dda6826cb9fcda8a2af45f9778e077b49012596dbb38394f2`
- `public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif` `d918433c39793cf8f455281b4ba4606749eff17d68d7c6d682183f07f5e33d6a`

正文没有 Sources 页脚，也没有注入的规划器 CTA。中文只改了两处同篇内部链接：`/zh/last-day-to-plant-stardew` 和 `/zh/what-to-grow-in-greenhouse-stardew`。其余 16 个外部 URL 与英文相同。

## 改过的文件

- `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`
- `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`
- `src/blog/blog-post-identities.ts`
- `src/blog/blog-post-registry.tsx`
- `src/blog/blog-copy.ts`
- `public/llms.txt`（只加了本篇中英两条，没有补 fruit 链接）
- `tests/blog/blog-post-registry.test.ts`
- `tests/blog/blog-home-state.test.ts`
- `tests/routes/blog-routes.test.tsx`
- `tests/i18n/public-route-registry.test.ts`
- `tests/seo/canonical-public-routes.test.ts`
- `tests/routes/removed-public-pages.test.ts`（只改了 31 / 62 / 60 / sitemap 60 这四个计数）
- `tests/blog/blog-components.test.tsx`（主脑后来允许：第 2 页 Next 连到第 3 页；第 3 页 Next 仍是禁用 span，Previous 指向第 2 页）
- `tests/blog/blog-planner-cta.test.tsx`（主脑回复 C：收获文单独分支，其余文章仍要求一个 CTA 在 Sources 前）
- `docs/blog-ops/how-to-harvest-stardew-valley/verification/assembly/render-reader-text.test.tsx`

构建曾自动把 `next-env.d.ts` 的两行 import 从 `.next/dev/types/` 改成 `.next/types/`。这两行已经恢复，最终 `git diff -- next-env.d.ts` 为空。当时的 `git diff --check` 退出码是 0；最后一次原始输出在 `verification/assembly/git-status-final.txt`。

## 命令和退出码

类型检查在去掉 Sources 之后，以及 CTA 测试改完之后各跑了一次。都是 `pnpm typecheck`。

- `verification/assembly/typecheck-r2.log`：`TYPECHECK_R2_EXIT:0`
- `verification/assembly/typecheck-r3.log`：`TYPECHECK_R3_EXIT:0`

更早的 `typecheck.log` 是去掉 Sources 之前的，不能当作这次的结果。

Vitest 都用：

`node_modules/.bin/vitest run <paths> --config docs/blog-ops/how-to-harvest-stardew-valley/verification/cache-isolation/vitest.config.mjs --configLoader runner`

- `vitest-fidelity.log`：读者文本 2 通过，`VITEST_FIDELITY_EXIT:0`
- `vitest-focused.log`：6 个文件，2 失败 62 通过。那 2 个失败是读者文本比较还没处理链接两侧空白。后面的 fidelity 日志才是通过。
- `vitest-unit-without-export.log`：排除了三个读 `out/` 的文件。`VITEST_UNIT_EXIT:1`。测试文件 11 失败 / 241 通过（252）。测试 11 失败 / 2421 通过（2432）。外层 shell 退出码 0 只是因为后面的 `echo`，不能当成 Vitest 通过。
- `vitest-blog-components.log`：分页断言改完后 20 通过，`VITEST_COMPONENTS_EXIT:0`
- `vitest-contract-and-focused.log`：`VITEST_CONTRACT_EXIT:1`。收获文断言去找未转义的 `&`，静态标记实际是 `&amp;`。这不是通过。
- `vitest-contract-and-focused-r2.log`：8 个文件 92 通过 0 失败，`VITEST_CONTRACT_R2_EXIT:0`。这是分页、CTA、注册表、首页、路由、i18n、canonical 和读者文本的通过记录。

## 11 个单元失败怎么归类

Q 的 Webpack 基线是 70 个文件、415 项测试、10 个失败。这次是整个 `tests/` 去掉三个 `out/` 文件，一共 2432 项。不能把这 11 个都叫成那 10 个旧失败。

这次文章直接造成、并且已经按主脑授权改断言后通过的：

- `tests/blog/blog-components.test.tsx` 第 2 页不再是最后一页。通过记录在 `vitest-contract-and-focused-r2.log`。
- `tests/blog/blog-planner-cta.test.tsx` 收获文没有 Sources，也没有注入 CTA。通过记录在同一个 r2 日志。

和 Q 基线同一类、本任务没有改断言的：

- `tests/assets/public-avif-assets.test.ts`：仍期望 81。这次实际 100。Q 基线当时实际是 97。多出来的 3 个是本篇 WebP。断言本身还是旧的 81，没有改。
- `tests/blog/blog-article-content.test.tsx` 和 `tests/blog/pine-tree-stardew-identity.test.ts`：中文松树正文仍缺少「本文不发布阶段数字」。
- `tests/blog/blog-sources.test.tsx`：松树英文来源句子仍对不上。
- `tests/routes/llms.test.ts`：仍要 `stardew-fruit` 的 URL。本任务按边界没有补这条。

不在那 10 项基线里，本任务也没有改对应模块，所以不能写成已经有运行基线：

- `tests/catalog/catalog-loader.test.ts`：`building:Building 0` 的 `allowedTools` 多了 `fill`。
- `tests/components/editor-modal.test.tsx`：缺少 `editor-config-switch__state` 的「开」。
- `tests/components/editor-shell.test.tsx`：期望 7 个按钮，实际 6 个。
- `tests/resources/local-planner-resource-smoke.test.ts`：5000ms 超时。

## 构建

先停的只是本预览进程组 79340（79340、79343、79399）。3002 仍是 86353，3003 仍是 81615，3005 仍是 71596，3013 仍是 97774。

`pnpm build` 写在 `verification/assembly/build-default.log`。`DEFAULT_BUILD_EXIT:1`。Next 16.3.0 Turbopack 报 `Symlink [project]/node_modules is invalid, it points out of the filesystem root`。这是失败，不能写成通过。结束时间 `2026-10-12T18:38:26Z`。

`pnpm build --webpack` 写在 `verification/assembly/build-webpack.log`。`WEBPACK_BUILD_EXIT:0`。结束时间 `2026-10-12T18:39:00Z`。静态页 `66/66`。英文 `[slug]` 和中文 `/zh/[slug]` 都是列出的 3 条再加 22 条，也就是各 25 篇。`out/how-to-harvest-stardew-valley.html` 和 `out/zh/how-to-harvest-stardew-valley.html` 都在。`out/sitemap.xml` 里 `<loc>` 有 60 个，其中本篇 2 个。

构建把 `next-env.d.ts` 的两行 import 从 `.next/dev/types/` 改成 `.next/types/`。构建前 SHA-256 是 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，构建后是 `1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b`。差异只有这两行。已用 `git checkout -- next-env.d.ts` 恢复，恢复后短状态为空，SHA-256 回到构建前那一枚。没有做其他 reset。

## 导出测试

命令是带本树 cache 配置的 Vitest，三个文件：`tests/routes/removed-public-pages.test.ts`、`tests/routes/static-public-pages.test.ts`、`tests/routes/sitemap-robots.test.ts`。日志 `verification/assembly/vitest-export.log`。`VITEST_EXPORT_EXIT:1`。测试文件 1 失败 / 2 通过（3）。测试 3 失败 / 9 通过（12）。

通过的是 `sitemap-robots.test.ts` 2 项，和 `removed-public-pages.test.ts` 3 项。后者就是改过的 31 / 62 / 60 和 sitemap 60 个 loc。

3 个失败都在 `static-public-pages.test.ts`，断言文本和 `verification/baseline-webpack/vitest-webpack.log` 里已有的失败相同：

- `/blog` 仍要 `how-to-earn-money-stardew-cover.webp`，实际没有。
- 首页区块顺序仍是 `expected 43266 to be greater than 48274`。
- 404 页样式表仍要 `/_next/static/chunks/*.css`，Webpack 实际写出 `/_next/static/css/6794355d84869980.css`。

这三项没有改，也没有继续往下追。主脑消息 `msg_bb4b36885b5d` 说范围外的静态首页和旧 CSS 断言不要延伸诊断。

上面那份 2432 项的全量日志仍是构建前、并且是在分页和 CTA 两处断言改完之前跑的。那两个本篇直接失败后来在 92 项里通过。catalog、editor-modal、editor-shell、resource smoke 这四项不在 Q 的 415 项基线里，这次没有新的对照运行，不能写成已经证明是旧失败。

## 预览

独立终端 `term_7dfa2286-b04b-4b91-816a-73a4545cf236`，标题 `harvest-preview`。命令仍是 `pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3004`。构建前的监听进程是 PID 79399，证据在 `verification/preview/server-proof.txt`。构建时停过它。构建后在同一终端重新拉起。

现在的进程：shell 79325，pnpm 44758，next 44766，监听 `next-server` PID 44772，地址 `127.0.0.1:3004`，cwd 是本树。没有用 `pnpm dev`。3002、3003、3005、3013 的 PID 没有变。`ps`、`lsof` 和两页 `HTTP/1.1 200 OK` 的原始输出在 `verification/preview/server-restart-proof.txt`。

重新拉起后两页都是 HTTP 200。英文 65991 字节，中文 64494 字节。标题和 H1 与批准文案相同。两页都没有 `blog-sources`、`data-blog-planner-cta`、`docs/blog-ops`、`operation-store`。

ego-browser 空间 110 做了短回读，然后 `finish({ keep: [] })`。桌面 1280×800 和 390×844 的 `pageOverflow` 都是 0，测到的 img、table、figure、pre、article 没有溢出。语言菜单从英文点到中文，再点回英文，两次 pathname 和 H1 都对。390 宽的方法图 `naturalWidth` 1672、`naturalHeight` 941，当前地址是对应语言的 `.avif`，右边缘 374。截图：

- `verification/preview/restart-en-desktop.png`
- `verification/preview/restart-en-390.png`
- `verification/preview/restart-zh-desktop.png`
- `verification/preview/restart-zh-390.png`

桌面截图能看到封面和 H1。桌面那次测量没有把方法图滚进视口，所以那次 `naturalWidth` 仍是 0。390 的两张图能看到方法示意图。红色 N 和 “1 Issue” 仍是浏览器扩展造成的 hydration 差异，不是文章正文。

这个预览留着，没有 release 这扇终端。

下面是构建前 PID 79399 那次预览已经记下的行为，不是这次重新拉起后的测量：

语言菜单从英文点到中文，再从中文点回英文，两次都落到对应 H1。

390 宽的图要等懒加载画完才算看见。空白截图不能当可见证据。画完之后的英文图是 `verification/preview/en-390-figure-settled.png`，框在 viewport 390×844 里，left 16、top 322、宽 358、高 201，`pageOverflow` 0。中文对应图是 `verification/preview/zh-390-figure-wait.png`。主脑已看到英文这张图里的示意图。22 个图内标签是否都可读，以 E2 自己的画完后视口图为准。本任务没有改样式。

开发服务上的红色 N 标记来自浏览器扩展改了 `body` / `html` 属性，服务日志里是 `monica-id` 和 `data-immersive-translate-page-theme`。那不是文章正文。

JSON-LD 是 Article，不是 FAQPage。英文 headline 与 H1 相同，`inLanguage` 是 `en`。中文 `inLanguage` 是 `zh-CN`。现有模板没有把 image 放进 JSON-LD。

## 审核状态

- E 页面报告 `reviews/E-page-review.md` 写了 PASS。主脑随后说手机证据不足，不把那份声明当成完整技术 PASS。
- E2 `task_2cdd7131ad62` 已 `worker_done` succeeded。报告是 `reviews/E-page-review-v2.md`。主脑读过该报告、DOM、中文视口图和两处测试差异，接受同页双语渲染、文档没有横向溢出、真实语言点击，以及分页和 CTA 的测试契约。
- E2 报告里「图注 100% 文本兜底」和「完全满足现代 Web 无障碍规范」超出这次证据，不是门禁。同一份报告转述 E 在 v1 自报了 40 项 vitest 和 `tsc`。本任务的原始日志里没有那 40 项的输出，不能写成通过。本任务认的测试数字只来自自己的日志：92 项通过、这次 Webpack 构建，以及上面的全量和导出结果。
- R `task_7a8493c81644` 的 `reviews/R-source-review.md` 对当时正文哈希是 PASS，0 个问题。它不覆盖后来的分页和 CTA 测试差异。那两处差异是 E2 只读看过、主脑接受的。没有改 E 或 R 的历史文件。
- 用户终审：没开始。
- 部署：没做。

## 隔离边界

Q 的 Webpack 基线记录过共享 `node_modules/.vite` 里的 Vitest `results.json` 在那次运行中被碰到。后来的缓存隔离只证明带 `cacheDir` 和 `--configLoader runner` 的那一条命令没有改那份共享摘要。这是逻辑隔离，不是操作系统隔离，也不能据此说主工作树的文件系统完全没被写过。E 早期那次没有隔离配置的 Vitest 没有留下 cache-before，不能用来证明主文件系统未写。
