# 英文返修第 2 轮（删重中间稿并入最终候选 draft-v3）

- 角色：C。本文件不签 ResearchTrace、ReaderValue、Repetition、E 或 Length。
- 轮次：已完成的正式轮次曾是 1。本文件是第 2 轮的最终候选。`sharedRevisionRound=2`，`remainingRounds=1`，总预算 3。不重置。
- 删重中间稿不是本轮终稿。合并后的 `draft-v3.md` 才是本轮候选。

## 中间稿

`content/en/versions/draft-v3-intermediate/draft-v3.md` SHA-256 为 `417e1f72a0fcb7a3a30190936fe2a04f6dfb921a405b8bf98bccec7cd3c75d46`。同目录有当时的三份 canonical JSON。那一版只删了 D 增补的 10 句。`正文计数.py` 退出码 0，机械 855，去掉两行 `Schematic.` 图注后 802。低于 V7 长度门，不能锁稿、翻译或装配。原稿 `draft-v1.md` 与 `draft-v2.md` 未改。

## 合并

按已核对的 `layout/enriched/writer-brief.md`（`0f98e5ecde45fb90532d0d210796ee727184054a1645f136a4bf69f534caabfc`）重写同一 `draft-v3.md`。材料、从初始农舍累加到目标档的预算、厨房/育儿房/地窖用途写进正文。六处删重没有写回：旧价只留在 1.6 那句的 from 分句；没有再写一遍「带上 65,000g 和 100 Hardwood」；没有三句携带金额；营业时间只写一遍；三天的起止只写一遍，并且不点名厨房、育儿房或地窖；没有美人鱼吊坠句。

Steel Axe 只是秘密森林这条路线的入口工具。75,000g 和 175,000g 是从初始农舍加到该档的合计，不是一次付款。第 9 次收获是计算，链到 Secret Woods、Large Stump、Large Log，没有新 URL。图的 alt、图注、图中文字和路径未改。`tier-rooms` 改到房间这一节，放在 Nursery 句之后。

## 机械计数

命令：

`python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/content/en/draft-v3.md`

退出码：0。

stdout 机械总数 `mechanical_units` 是 1166。`required_floor` 是 1000。`meets_mechanical_floor` 是 true。`length_class` 是 `short`。`sha256_raw` 与 `sha256_nfc_lf` 都是 `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154`。

用同一脚本的 `extract_body` 和 `count_units`，去掉两行以 `Schematic.` 开头的图注后是 1113。标题已被脚本排除。这不是 F 的 Length 通过。组织参考是 1200–1500。收尾补进的是秘密森林六个大树桩的每日再生、上下区和两条通路，以及合计只含升级费用。没有为凑区间再写重复句。

## 哈希

| 文件 | SHA-256 |
|---|---|
| draft-v2.md（未改） | `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f` |
| 删重中间稿 | `417e1f72a0fcb7a3a30190936fe2a04f6dfb921a405b8bf98bccec7cd3c75d46` |
| 合并后 draft-v3.md | `8ee52bfaabcbbde7c9de246f6b6560535af227b360b3c8c8c895ecf632f90154` |
| media-text.en.json | `8a6e1ce5ad8c74440e6bc4854c3740079520420c784457cd26ea98e0d9621f7b` |
| public-references.en.json | `4f0e5a4800252baf5879996171e261878dd6bbb46e83d7a4f5828faea7ea7d0a` |

NFC：合并稿原字节与 NFC/LF 哈希相同。换行是 LF。编码是 UTF-8。

## 未做

D 还要对这个新哈希重跑三门。E 还没审。F 还没签长度。没有锁稿、翻译或装配。
