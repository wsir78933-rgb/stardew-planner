# D-zh 最终独立写后检查

检查日期：2026-09-22（Asia/Shanghai）。结论：**PASS，可以进入中文标题锁定**，但仅限本次绑定的中文 C 正文；不代表 E、媒体或页面验收通过。只新增本报告，未改正文。

## 版本与范围

`shasum -a 256 docs/blog-ops/profit-margin-stardew/C-zh-draft.md`，退出 0：

```text
606d4f28d87653c0618a262feec8de5333387623e5f663584217ac6e5abc13b0  docs/blog-ops/profit-margin-stardew/C-zh-draft.md
```

本结论仅对这个 SHA 有效。C 改动后需重做 D 检查。上次 `D-zh-check.md` 绑定旧 C SHA、判 REVISE；本次重新读实际 C，不沿用旧计数或结论。

## 三门与长度

| 项目 | 结论 | 本次证据 |
|---|---|---|
| ResearchTrace | PASS | 逐段读 C:1–122，公开读者正文未见 SERP/PAA/排名、研究元数据、调度/代理记录、内部事实 ID、私有路径或凭据；两组泄漏 `rg` 扫描退出 1、无命中。平台未实测限制属于必要读者边界，不是研究日志。 |
| ReaderValue | PASS（文本） | C:5–22 定义四档及取整；C:24–44 区分变价/固定边界并给 Wheat、Crab Pots 对照及异常时的待核验动作；C:52–82 按单人、多人、挑战给条件选择；C:84–113 给新农场入口、平台中立限制和找不到选项的安全处理。内容始终服务于“理解并选择新农场利润率”。 |
| Repetition | PASS | C:26 是矩阵阅读规则；C:44 只保留“已列固定类别不缩放、未列类别待核验”的故障动作。C:56–60 是选档速查；C:68 是多人机制与分工判断；C:74 是 25% 的挑战限制；C:78、82 分别直接回答 75%、25% 的适用问题。共享倍率事实但职责不同，未见为凑字数的整段同职责复述。 |
| 长度机械门 | PASS | 指定脚本退出 0，`mechanical_units=2009`，在 2000–2300 内；`required_floor=2000`、`meets_mechanical_floor=true`。`--exclude-heading Sources` 排除 Sources 7 行，图位的 blockquote 不计；脚本的 `semantic_qualification=requires_independent_review` 不被误写成机器语义通过。结合上述独立阅读，当前版本可接受。 |

指定命令：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

关键输出：`mechanical_units: 2009`；`omitted_line_counts: {headings: 19, code: 0, excluded_sections: 7, non_body: 58, frontmatter: 0}`；`sha256_raw` 与上列 C SHA 一致。退出码 0。

## 引用、图位与内链

- C:5 的中文 Options 和 Multiplayer 紧邻设置定义/非全局边界；C:18 英文 Options 紧邻种子价格、截断及 1g；C:26、68 的 Multiplayer 紧邻分类边界及多人再平衡；C:86 的中文 Options 与 Getting Started 紧邻新游戏设置路径。C:115–122 的 Sources 有 `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.`，其后依次列四个实际使用的公开来源。PASS。
- 五个公开 URL（中文 Options、英文 Options、Multiplayer、Getting Started、站内第一年赚钱）逐个 `curl -fsS -L --max-time 20 -o /dev/null -w '%{http_code} %{url_effective} redirects=%{num_redirects}'`：各退出 0，HTTP 200，重定向数 0。HTTP 可达不等于逐条事实再审或浏览器渲染。URL 的 `#Profit_margins` fragment 无法由 HTTP 验证锚点，引用邻近性以正文和来源对照判断。
- C:46–50 `fig-01-price-boundary` 是“缩放价格 vs 固定类别”的语义边界图位，标明 Wheat 25g→6g 和 Crab Pots 1,500g；C:97–101 `fig-02-advanced-options-path` 是新游戏到 Profit Margin 的平台中立流程图位。职责不重叠，图注均未冒充实机截图。实际媒体文件、权利、尺寸/格式、可读性与页面绑定 **UNVERIFIED**。
- C:70 的 `/zh/how-to-earn-money-stardew` 仅一次，作为前期预算背景，不把本页变成赚钱路线；公开目标 URL 本次 HTTP 200。PASS。

## 静态卫生与命令记录

- `rg -n 'Checked|https?://|/zh/how-to-earn-money-stardew|fig-0|Wheat|Crab Pots|75%|25%' C-zh-draft.md`：退出 0；关键命中 C:5、18、30、34、40、46、50、59、68、70、74、78、82、86、97、117、119–122。此处 `C-zh-draft.md` 为上述同目录文件的简写。
- `rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究元数据|worker|coordinator|dispatch|task card|任务卡|调度|代理|/Users/|/home/|file://|localhost|127\.0\.0\.1|\.codex|\.hermes|docs/blog-ops|node_modules|api[_-]?key|access[_-]?token|Bearer[[:space:]]|PRIVATE KEY|sk-[A-Za-z0-9]{16,}' C-zh-draft.md`：退出 1，无命中；人工逐段阅读亦未见该类内容。
- `rg -n '[[:blank:]]+$' C-zh-draft.md`：退出 1，无尾随空白命中。
- `git diff --check`：退出 0，无输出。C 是既有未跟踪文件，故此命令自身不覆盖其空白卫生；另以以上 `rg` 检查。
- 初始 `git status --short --untracked-files=all`：退出 0，A/B/C、既有 D/E 与 project spec 均为未跟踪输入；它们未因本次检查被修改。报告写入后的最终状态应额外出现本文件。

本 D 不运行 build、测试或浏览器，也不核定 E 独立事实审核、媒体、页面、部署或排名；这些均 **UNVERIFIED**。中文标题锁定应继续使用本 C SHA，不能把这里的 PASS 扩展成下游验收。
