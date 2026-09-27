# G assemble — oak-tree-vs-maple-stardew

锁定正文 SHA-256 与交接一致，未改锁定正文。

- `locked/en-body.txt` `3297ded2d51520352c3278f6548685087a0162472b869afe8e199f9709907b7c`
- `locked/zh-body.txt` `bb7ec2774be1724c6e8c5c9d59425886e276f8c2d2b35bae6568af4e390df4c8`

slug `oak-tree-vs-maple-stardew` 加在 `blogPostSlugs` 末尾。英文标题、描述、中文标题、描述用交接原文。英文 topic 是 Stardew Valley Guides，中文 topic 是交接里的「星露谷物语指南」。文章组件不写 H1。正文图 `1672×941`、`loading="lazy"`。封面沿用现有文章页，不设 lazy。没有 FAQPage。未提交，未推送，未部署。这不是页面审核。

## 命令

`pnpm exec tsc --noEmit`

退出码：`0`

`pnpm exec vitest run tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-planner-cta.test.tsx tests/blog/blog-direct-reader-voice.test.tsx tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts`

退出码：`0`（8 files，77 tests）

`pnpm exec vitest run tests/blog/blog-sources.test.tsx`

退出码：`1`

失败原因不是 `out/`。断言停在既有松树英文文的 `checkedLabel`：测试仍要 “The following public pages support the specific Pine identity...”，组件现在是 “The public pages below cover Pine identity...”。循环还没走到本篇。没有改松树正文，也没有改这个旧断言来假装通过。本篇的来源条目已经加进同一份列表。

`pnpm exec vitest run tests/routes/llms.test.ts tests/routes/sitemap-robots.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts`

退出码：`1`

这四份都读 `out/`，不是读当前源码。`out/llms.txt` 在利润率之后就停了，连温室那条都没有，所以也没有本篇。`out/sitemap.xml` 有 52 条，当前可索引路由是 58 条。`out/what-to-grow-in-greenhouse-stardew.html` 不存在。`out/blog.html` 里也没有现有赚钱文的封面。没有为了这一篇重写这些测试，也没有跑会先整站 build 的 `pnpm test`。

## 本地页面

`pnpm dev`（`scripts/dev.sh`，端口 3003）已在后台起来。没有动 3002。

- `http://127.0.0.1:3003/oak-tree-vs-maple-stardew`：`200`
- `http://127.0.0.1:3003/zh/oak-tree-vs-maple-stardew`：`200`

两个响应各有一个 H1，没有 FAQPage。封面图没有 `loading="lazy"`，正文图有。
