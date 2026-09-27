# 调度记录

主会话只派发和交接，不兼任研究、布局、写作、写后检查、独立审核、锁稿或组页。

自动修订预算：每种语言整条链路共用 3 轮。第一稿和研究不算一轮。英文已用 1 轮（E 必须改 5 处）。中文已用 1 轮（E 必须改 2 处）。剩余各 2 轮。

| 角色 | 子代理 | 输入 | 输出 | 状态 |
|---|---|---|---|---|
| A-facts | 01a0e22f-1b09-78e1-9ee0-c911e6486314 | 规则、维基、本站树木相关源码 | `A-facts.md` | 已交，52 条，冲突未折中 |
| A-en | 01a0e22f-1b09-78e1-9ee0-c9246d719fbf | 规则、英文搜索、本站英文树文 | `A-en-research.md` | 已交，主词美国搜索已打开 |
| A-zh | 01a0e22f-1b09-78e1-9ee0-c93070c3003b | 规则、中文搜索、本站中文树文 | `A-zh-research.md` | 已交，未取得中国区 Google |
| B-en | 01a0e243-58ff-72f1-865a-24b02de70fab | A-en 与 A-facts | `B-en-layout.md` | 已交。主意图是用种子或采集器产物认出橡树还是枫树 |
| B-zh | 01a0e243-58ff-72f1-865a-24c49a69d91d | A-zh 与 A-facts | `B-zh-layout.md` | 已交。主意图是按缺的产物选边，不写成认树文 |
| C-en | 01a0e24f-96a4-70d2-94ce-ef441769ed84 | B-en 与 A-facts | `C-en-draft.md` | 已交。整文件 SHA-256 eae9c940…d927d，机械计数 5187 |
| C-zh | 01a0e24f-96a4-70d2-94ce-ef55510873f6 | B-zh 与 A-facts | `C-zh-draft.md` | 已交。整文件 SHA-256 d082adde…62a3，机械计数 5103 |
| D-en | 01a0e261-db2f-7551-b03d-4de52bd56ce6 | C-en 与 B-en | `D-en-check.md` | 已交。哈希相符，必须改 0 |
| D-zh | 01a0e261-db2f-7551-b03d-4dff93d53abb | C-zh 与 B-zh | `D-zh-check.md` | 已交。哈希相符，必须改 0 |
| E-en | 01a0e26b-7eb3-7c81-9b90-479c7bbac8b9 | 同一英文稿与证据 | `E-en-review.md` | 进行中 |
| E-zh | 01a0e26b-7eb3-7c81-9b90-47a5495ec4f8 | 同一中文稿与证据 | `E-zh-review.md` | 进行中 |
| F-en | | D/E 通过的同一稿 | `F-en-lock.md` | 未开始 |
| F-zh | | D/E 通过的同一稿 | `F-zh-lock.md` | 未开始 |
| F-zh | 01a0e284-902c-7a03-935a-4ee66b8ca472 | D/E 通过的中文稿 | `locked/zh-body.txt`、`F-zh-lock.md`、`handoff-zh.md` | 正文哈希 bb7ec277…；题文通过；交接已冻结 |
| F-en | 01a0e28f-1d9f-7533-9034-332911ac455c | D/E 通过的英文稿 | `locked/en-body.txt`、`F-en-lock.md`、`handoff-en.md` | 正文哈希 3297ded2…；题文通过；交接已冻结 |
| G-media | 01a0e2a3-b84c-7841-befc-3dc8961d2084 | 锁定图注 | 封面和三张正文图的 webp/avif | 已交，1672×941 |
| G | 01a0e2a3-b84c-7841-befc-3dd1d550627d | 两份交接 | 文章组件、注册、llms、测试 | typecheck 0；本地两个路由 200 |
| E 页面 | 01a0e2b9-85e8-78f0-8167-33ffb56695cd | 127.0.0.1:3003 两个路由 | `E-page-review.md` | 必须改 0。用户终审尚未进行 |
