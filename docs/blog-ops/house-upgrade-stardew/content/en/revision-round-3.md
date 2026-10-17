# 英文返修第 3 轮（E 六项合并为 draft-v4）

- 角色：C。本文件不签 ResearchTrace、ReaderValue、Repetition、E 或 Length。
- 轮次：这是全篇正式第 3 轮。`sharedRevisionRound=3`，`remainingRounds=0`，总预算 3。含之后的译文返修，余 0。不重置，不换任务。
- 输入：`reviews/E/enriched-v3/report.md` SHA-256 `2ec35b8c9800e2faf68a23bdc33e5c7de978fba062ecc6f8e127dfadaa264d07`。`reviews/E/enriched-v3/checks.log` SHA-256 `f9457ab8c82d5330c8daa0782351c6a9330af471d8a6e33330a73ceb543e1d0b`。六项按该报告一次改完。

## 归档

先复制当时的 `draft-v3.md` 与三份 canonical，再改现行引用。`cmp` 确认现行 `draft-v3.md` 与归档正文一致。归档 SHA-256：

| 文件 | SHA-256 |
|---|---|
| `content/en/versions/draft-v3/draft-v3.md` | `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154` |
| `content/en/versions/draft-v3/public-references.en.json` | `4f0e5a4800252baf5879996171e261878dd6bbb46e83d7a4f5828faea7ea7d0a` |
| `content/en/versions/draft-v3/media-text.en.json` | `8a6e1ce5ad8c74440e6bc4854c3740079520420c784457cd26ea98e0d9621f7b` |
| `content/en/versions/draft-v3/writer-submission.json` | `c619f9f69b7c2e738424b242433cd91db866ade28278c218309c978b00c826d6` |

现行 `draft-v1.md`、`draft-v2.md`、`draft-v3.md` 与第 2 轮报告未改。`draft-v1.md` 仍是 `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628`。`draft-v2.md` 仍是 `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`。

## 六项

1. 14,500g 与 32,500g 改为升级费加木材合计。第一年木材是 `450 × 10g = 4,500g`，加上 10,000g 为 14,500g。第二年及以后木材是 `450 × 50g = 22,500g`，加上同一笔 10,000g 为 32,500g。50g 只进入 22,500g 这笔木材，不单独解释 32,500g。手头 200 Wood 把 14,500g 合计改成 12,500g，两数都含升级费和所买木材。12,500g 账单不用 50g。
2. 房子改为每天 9:00am 到 8:00pm 可进入，商店关门时也一样。不再把进入时间写成只在关门期间。
3. 普通周仍写 9:00am–5:00pm、Tuesday is closed、Friday closes at 4:00pm。删掉周二不能下单、周五必须在 4:00pm 前下完。下雨、节日、夏 18 和路过柜台仍只由原内链承接。
4. 删掉“从付款日起算”和“付款当天房间仍未完成”。没有补进购买后次日开工，也没有补进其他建筑两天。每档三天留在开头和费用表，没有另写同作用段落。
5. Large Stump 的身份、铜斧和 2 Hardwood 仍链到 Large Stump。活树留下的树桩对比改链到已有 Wood 页。没有写入新的掉落数。
6. 卖木材、石头和家具，升级农舍，建造农场建筑，改成两个合法句子。三项事实还在。

Steel Axe 仍只属于秘密森林这条路线。75,000g 和 175,000g 仍是累计，不是一次付款。图的 alt、caption、inImageText、src、siblingAvif 和 order 未改。`media-text.en.json` 只改了 `bodySha256`。

## 四份新哈希

| 文件 | SHA-256 |
|---|---|
| `content/en/draft-v4.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `content/en/public-references.en.json` | `1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27` |
| `content/en/media-text.en.json` | `75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400` |
| `content/en/writer-submission.json` | `1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415` |

`draft-v4.md` 为 NFC、LF、UTF-8。`sha256_raw` 与 `sha256_nfc_lf` 相同。公开引用 55 条，每条 quote 在正文中的出现次数都是 1，核对退出码 0，错配 0。没有新 URL。失去正文对应的两条工期 quote 已删除。Wood 对比新增一条落在原 Wood URL 上的 quote。

## 机械计数

命令：

`PYTHONDONTWRITEBYTECODE=1 python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md`

退出码：0。

stdout：

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md",
  "locale": "en",
  "mechanical_units": 1138,
  "required_floor": 1000,
  "meets_mechanical_floor": true,
  "long_form_target": 2000,
  "meets_long_form_target": false,
  "length_class": "short",
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [],
  "omitted_line_counts": {
    "headings": 8,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 34,
    "frontmatter": 0
  },
  "sha256_raw": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f",
  "sha256_nfc_lf": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
}
```

去掉两行以 `Schematic.` 开头的图注后，临时纯正文再跑同一脚本，退出码 0，`mechanical_units` 为 1085。临时文件哈希不是正文哈希。两数都在 1000–1999。脚本字段 `semantic_qualification` 为 `requires_independent_review`。这不是 F 的 Length 通过。

## 未做

D 还没对 `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` 重跑三门。E 还没复验。F 还没签长度。没有锁稿、翻译或装配。
