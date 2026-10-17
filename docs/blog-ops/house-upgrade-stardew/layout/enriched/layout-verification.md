# 布局验收：house upgrade stardew 丰富稿

角色 B。工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`。只新增本目录四份文件。未改旧布局、研究、正文、control、图源、`public/`、`src/`、测试或 V7。未 commit。这不是质量 PASS，也不代签 D、E 或 F。

## 结论

读者任务改为：准备 Wood 与 Hardwood，从初始农舍把各行加到目标档，向 Robin 逐级下单，并分清厨房、育儿空间、地窖和即时装修。六节英文大纲在 `writer-brief.md`。封面与两张正文图的 alt、caption、图中文字与 `content/en/media-text.en.json` 一致。`tier-rooms` 改放到房间节，路径未改。

先前「没有必要缺口」只属于旧的下一档购买，不是这次范围的结论。这次不退回 A：费用、累计、12,500g、斧与秘密森林、厨房 36 格和水槽、育儿空间、地窖陈酿、三天和装修区别都有 `publicAllowed: true` 的条目。

## 轮次

已完成第 1 轮。本布局供给正在进行的第 2 轮。第 2 轮结束后还剩 1 轮。不把「已用 1、剩余 2」写成当前完整口径。

## 已读

- 协调：`msg_095b995652a7`、`msg_034ab93702b9`、`msg_f8bd3d3b4d55`、`msg_fa5ef51df38c`
- 旧布局三文件，哈希与 2026-10-15 的 `layout/layout-verification.md` 所记相同
- `research/A/facts.json` 与 SERP 文本第 217–225 行、第 249–250 行
- `research/material-preparation/facts.json` 与 `research.md`
- `research/upgrade-planning/facts.json` 与 `research.md`。`versions/submission-v1` 未用作依据
- `reviews/D/reconciliation/repetition-addendum.md`，只用来避开重复，不重审正文
- `content/en/media-text.en.json`

## 字数口径

各节字数是全篇约 1,200–1,500 的编排参考，不是每节配额。开头不必为了凑 80–100 再写一遍三档价格。第 1 节不必为了凑 180–220 在表和一句 1.6 之外加句。正式 1,000 词门槛由 F 计数。表和正文里的事实计入正文。同作用的重复句、FAQ、收尾清单和免责声明不拿来凑数。

## 两条被点名的事实

点状读取，退出码 0。

| ID | publicAllowed | sourceUrl | 本地来源 |
|---|---|---|---|
| `MP-axe-grades` | True | `https://stardewvalleywiki.com/Axes` | `research/material-preparation/sources/axes-wikitext.json` 存在 |
| `CALC-secret-woods-visits` | True | 无此字段 | 依据 `MP-secret-woods`、`MP-large-stump`、`MP-large-log`，三者均为 True，URL 分别为 Secret Woods、Large Stump、Large Log，对应 wikitext 文件存在 |

简报要求 C 链这三页，不给这条计算另造 URL。

## 命令

第一次验证是本任务自己的进程，不是无关进程。PID 7250，cwd 为本工作树，命令是 `python3` 加 heredoc。子进程 PID 7251 为 `cat`，状态 S，约 85 秒没有 stdout。原因是该 shell 用 `/dev/null` 作为命令的标准输入，heredoc 没有进入 Python。已只结束 7250 和 7251。该次没有退出码。

替代命令退出码 0，约 197ms。脚本在 `/tmp/house-upgrade-layout-verify.py`，不是仓库测试，没有做全仓扫描或网络请求。

```text
JSON_OK figures 3
MAP_COUNT 28
MAP_MISSING []
MAP_NOT_PUBLIC []
MAP_NO_URL ['CALC-secret-woods-visits']
MEDIA_IDS 13
MEDIA_BAD []
FALSE_BAD []
UNUSED_BAD []
TEXT_BAD []
SRC_MISSING []
MAP_SYMMETRIC_DIFF []
BRIEF_CJK 0
CITES_V1 False
MENU task-card Upgrade House 0; Construct Farm Buildings 0
MENU writer-brief Upgrade House 0; Construct Farm Buildings 0
MENU media-plan Upgrade House 0; Construct Farm Buildings 0
python_exit 0
```

`FALSE_BAD []` 表示简报点名的 13 个 `publicAllowed: false` ID 都存在且为 false，包括 `UP-order-prerequisites`、`B-calendar-scheduling-constraints`、`B-shop-counter-operation-unverified`、`OBS-menu-image`。四行菜单字串没有写回。`TEXT_BAD []` 表示三图 alt、caption、图中文字和英文 webp 路径与现有媒体文本一致。

简报按字数口径改过之后，只重算了本目录三份交付文件的哈希。事实表没有改，所以上表的 28 个 ID 仍然有效。

## 输入哈希

与协调者实读的四枚哈希一致。旧布局三枚与旧验收记录一致，说明旧文件未被本任务改写。

```text
research/material-preparation/facts.json c180f0bf8b5eaf74de21a3999a646e19191064a01fe6d498c098ab56465d601d MATCH
research/material-preparation/research.md 35c716e3f5c827426691b6a67c53e1924d1c7bf1d8edb8b4c7c4f831659fdf91 MATCH
research/upgrade-planning/facts.json 397cc320f596d97e858809e688ba8f90d9db477236416f8cdd57fa1ed548026e MATCH
research/upgrade-planning/research.md d989bf0a5f7f6eea2b917b24bcc20e36b710d6c37db9051269378a7c6c656bd6 MATCH
layout/task-card.md 1edb806157ef10adae0bf88151bcd43f106f9e47dae82841119ecb94f32fa8c9
layout/writer-brief.md 6e15009775fdb1469514a3be9998a7340e481500867ee1e55e2dfadab344fa0d
layout/media-plan.json a7f1f374149cdfb3255c44ec2cda2045a08caadc7ff1042890c07e31b1fa51ad
research/A/facts.json 618d3faed60b2516f4adea26f862c6ba527dd38ac769807a65c727b76790298e
reviews/D/reconciliation/repetition-addendum.md 6fed3c2c1b9a62227032f9cdf6bfa45a6f281602e0848f604c3c10f3643c64ca
content/en/media-text.en.json 966c4e0b76f25c7489b187712c58ae1d33b3cc3a3eebf04c7efbaa3a51508588
research/A/sources/serp-google-house-upgrade-stardew.txt d6d4f27a7fdaa16f1a454c92477b5ab60d6d8e3e81473e84bb7546b4b483d676
```

## 本目录交付

字数口径修改之后的哈希。不含本验收文件。

```text
task-card.md 5d37bdadb1fb20b30d1fbe605b67cd9c169acaa810667b0548dc88fd74950668
writer-brief.md 0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc
media-plan.json 6359d95163dfec0ac889c61583a472fe61b53b7ee151eeb4a27bb02768d74a13
```

## 未写入大纲

第二年、手头已有 200 Wood 的金币没有现成算式。8 次收获把挡路圆木算进同一次，公开计算的条件里不用。Cabin 与 Marriage 不单列。这些都不是退回 A 的缺口。
