# 英文返修第 1 轮（draft-v1 → draft-v2）

- 角色：C。本文件是返修记录，不签 ResearchTrace、ReaderValue、Repetition 或 E 通过。
- 共享修订轮次：`sharedRevisionRound=1`，`totalMax=3`，剩余 2 轮（含后续译文）。
- 状态：待D全量三门/E独立审核。

## 真改动

只改了 D 报告里的 7 处。表格、两张正文图的 Markdown、两行 `Schematic.` 图注、封面不在正文里的图中文字，都没有改。

1. RT-1：删掉“Farmhouse notes state both totals…”这句来源核查。14,500g 和 32,500g 两句改为直接链到 Farmhouse，不再交代维基注记怎么写算式。
2. RT-2：`pay the row for the tier you are on` 改为支付读者下一档的金币和材料。
3. RT-3：`rooms in that row` 改为从付款到该档房间完工之间的三天。
4. RT-4：删掉 write-up 旁白。50,000g 和 150 Hardwood 写成 1.6 之前的价格。
5. RP-1：整段删除。10,000g 工费、卖出木材不涨价、14,500g 和 32,500g 仍在前两段。
6. RP-2：删掉外观不变的复述。结尾留下 100,000g、三天、厨房下地窖，并让读者在这笔地窖付款与 Remove Crib、Add Dining Room 之间选择。
7. RP-3：删掉空房间、婴儿床、两张儿童床和两个孩子的第二遍列举。结婚、美人鱼吊坠和装修的三天时序留下。

四行菜单标签 Shop、Upgrade House、Construct Farm Buildings、Leave 仍不写入。依据是 `msg_741541b5415a`，`OBS-menu-image` 的 `publicAllowed=false`。

## 机械预览

命令：

```
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md
```

- 退出码：`0`
- `mechanical_units`：`970`
- `required_floor`：`1000`
- `meets_mechanical_floor`：`false`
- `length_class`（脚本）：`below_floor`
- `sha256_raw`：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- `sha256_nfc_lf`：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- 去掉以 `Schematic.` 开头的图注行后，用同一脚本的 `count_units` 复算：`917`。这不是脚本 CLI 的输出，只是和 v1 相同的图注剔除预览。V7 规定 caption 不计入合格英文。

长度结论：当前题目材料不足以成文。脚本机械值 970；剔除 Schematic 图注行后 917。删除重复和来源旁白后字数下降，没有回填免责、同义反复或新意图。未锁稿，未装配。

## 未解决

- D 还没有对 draft-v2 重跑全量三门。
- E 还没有独立审核 draft-v2。
- 社区升级里的 fully、升级那三天柜台是否营业、Steam 1.6.15 帖子自身的发布日期、美国搜索结果上的城市名，仍然不用。
- 本轮不签质量门 PASS。

## 媒体标签一致

- 备份 `content/en/versions/draft-v1/media-text.en.json` 与改前 canonical 的 SHA-256 都是 `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415`。
- 现稿 `media-text.en.json` 的 `figures` 与该备份逐字相同（alt、caption、inImageText、路径、顺序）。
- 标签等图文字未改。
- 旧正文 SHA-256：`cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628`
- 新正文 SHA-256：`09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`
- 旧正文哈希不是新正文哈希。新媒体 JSON 的 `bodySha256` 绑定的是新正文哈希 `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`。
- 新媒体 JSON 文件 SHA-256：`55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c`。这个文件哈希会变，是因为 `bodySha256` 字段变了，不是因为图中文字变了。不要把旧 body hash 当成新 body hash，也不要把新媒体文件哈希当成正文哈希。

## 当前 SHA-256

| 文件 | SHA-256 |
|---|---|
| `content/en/draft-v1.md`（未改） | `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628` |
| `content/en/draft-v2.md` | `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f` |
| `content/en/media-text.en.json` | `55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c` |
| `content/en/public-references.en.json` | `035eafb54c23eca693b3899ddf82c055fd091722e12f5f8c3902673ca172706a` |
| `content/en/writer-submission.json` | `ac05e298a12927997d5bda1aa4b9ec7271080177912632597609cf008fd06d4f` |
| `content/en/versions/draft-v1/media-text.en.json` | `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415` |
| `content/en/versions/draft-v1/public-references.en.json` | `f15c00643e6eabc93c26d3007a073f9be080040cc0e12d4727e1beab03c77ae4` |
| `content/en/versions/draft-v1/writer-submission.json` | `5db55ed0942f2114a01d4332c1bbb8fc6d480b9db974b8b3b615400a7d179f9e` |
