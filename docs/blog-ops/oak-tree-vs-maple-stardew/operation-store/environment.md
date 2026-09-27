# 内部运行记录

公开页面、正文、SEO、图片文字和公开交接不得读取本目录。

- 运行：oak-tree-vs-maple-stardew-2026-09-27
- 模式：project-write（用户选定 B，并已说「开始执行」）
- 关键词：stardew valley oak tree vs maple
- 网站：https://stardewvalleyplanner.art
- 项目：`/Users/wusir/Desktop/开发项目集合/stardew planner`
- 语言：en 与 zh-CN，分开写，不互译
- 英文搜索目标地区：US。这是任务输入，不等于已经取得美国搜索结果。
- 中文搜索目标地区：CN。同样只是任务输入。
- 游戏版本上下文：站点资源按 1.6.15。外部资料必须各自记录自己写明的版本，不能改写成已经核验 1.6.15。
- 暂定编辑目录名：oak-tree-vs-maple-stardew。正式 slug 等锁稿后再定，不能覆盖已有地址。

## 污染标记

- 文件：`operation-store/canary.json`
- 写后读：SHA-256 与文件内 `canarySha256` 一致，值为 `3b00758cb3cb818d1ff6c814fa80dbee8486205cc3c43acf0e0722cc1cd0f9d0`
- 标记原文只留在该 JSON。调度提示和公开稿件不抄录原文。

## 旧包与隔离

- 在本网站仓库内查找「内容工厂」「content-factory」「七罪」文件名：没有命中。记为无旧官方内容包，没有另做隔离目录。
- 桌面上的《博客-V7修订版》是本次执行规则，不是待隔离的旧包。
- 角色之间是逻辑隔离：不同子代理、不同输出文件、提示里禁止读取本目录。没有做操作系统级读权限隔离，不能写成底层隔离已通过。
- `docs/blog-ops/` 当前不被 gitignore。这些文件只留在编辑侧，不提交。
