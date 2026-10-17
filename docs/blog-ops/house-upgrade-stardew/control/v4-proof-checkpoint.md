# House Upgrade Stardew - v4 记录校正与精确扫描

- **state asOf**: `2026-10-16T08:58:17+08:00`（写文件前的 `date` 与公开 `task-list` / `worker-list`）
- **scan asOf / scan finishedAt**: `2026-10-16T08:55:02+08:00` / `2026-10-16T08:55:02+08:00`
- **finishedAt**: `2026-10-16T08:58:17+08:00`（四份控制文件写出前的时钟）
- **记录角色**: S（`task_32f6fed221c9` / `ctx_67ac1ef39575` / `term_adfbb71f-35ad-499c-a6ee-704522b7bd01` / Cursor）
- **Run**: `run_8253831e93d6`，协调者 `term_661abce7-55fd-4570-8bf5-970c0451dd23`，未重绑
- **边界**: 只校正记录并保存扫描证据。不审正文，不签质量门，不标最终完成。

## 1. 六项已确认记录错误

1. `enriched-v3-checkpoint.md` 第 4.1 节把 `content/en/revision-round-2.md` 写成 `fa7311f67f9227c2f689cbfa75c024225e5108643ea1b65caef0dffbb31e4590`。本次 `shasum -a 256` 与扫描复读都是 `168792507d046a073c84a30fce4e4d08bd5313ec3a9c2b25b098f5f5a73f1586`。旧表单元格未改；复测值是该文件的有效哈希。不写原因。
2. S5 页眉写 `2026-10-16T08:18:00+08:00`，但文件 mtime 是 `2026-10-16T08:23:34+0800`，且纳入了协调者 `msg_a968dbfe2966`（sqlite `created_at` `2026-10-16 00:23:00`，subject `检查点实时状态更新`）。该时间来自一次只读 `SELECT`；`msg_5f7e33be453d` 之后未再查内部库。本页 asOf 与 finishedAt 分开，不回填整点。
3. S4 时中间正文已存在。`versions/draft-v3-intermediate/` 是后来的归档目录。现归档 `draft-v3.md` 哈希是 `417e1f72a0fcb7a3a30190936fe2a04f6dfb921a405b8bf98bccec7cd3c75d46`。stat birth/ctime 只留在 checks.log，不充当创作时间。
4. SEO 创作归属 F、复核归属 E。中文翻译归属独立 T、复核归属 E。不写 G、协调者或 C-zh。两项都未做。
5. 三份 WebP 的四字符码是 `VP8 `（有损 VP8），`vp8lLosslessPresent=false`。这不是无损 VP8L，也不是像素 OCR。可见文字只来自 3 个 SVG 的 `<text>` 与 media-text 公开字段。
6. `ctx_1b67a6215356` 的 worker-list `terminalState` 仍是 `retained`，但 `resource.state=absent`、`reason=not_materialized`、`liveness=unverifiable/missing_status`。资源已转到 `ctx_487c9c051d1a`（origin 为旧 dispatch，owner 为新 dispatch，`releaseState=released`）。retained 不是活终端。

## 2. 当前英文 v4

| 文件 | SHA-256 |
|---|---|
| `content/en/draft-v4.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `content/en/public-references.en.json` | `1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27` |
| `content/en/media-text.en.json` | `75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400` |
| `content/en/writer-submission.json` | `1089fd4510d1d1f9785977c9f68b81e8e40de2a988d99d0fbd09f341974fc415` |
| `content/en/revision-round-3.md` | `7f99e45f7f8003ef64bbcbdfddd4106b8d69ef4e0da7c0c10779ba96a6a9d684` |

C3 `task_a549826087fd` / `ctx_5a48cc7f0977` / `term_3b0c0852-5fd1-4cde-917e-5b76438ce9cb` 已 succeeded 并释放。`正文计数.py` 退出码 0：机械 1138；去掉 2 行 `Schematic.` 后 1085；55 条 quote 的 occurrence 都是 1。临时去图注文件哈希 `a52082ab04695f70191969d71c7dd264c83d424acd3bf371149b14292b58b1b6` 不是正文哈希。这不是 F Length 通过。

修订预算：总 3，已提交 3，未来剩余 0，含译文返修。不重置。

## 3. asOf 调度

- D v3 `task_4e791741e19a` 的 PASS 只覆盖 v3。v3 E `task_d6f805015ae3` / `ctx_d49b80437cfc` 已完成并释放，内容 FAIL 6，报告 `2ec35b8c9800e2faf68a23bdc33e5c7de978fba062ecc6f8e127dfadaa264d07`。
- 旧 F `task_bcf55e52ef19` 状态 `failed`，result `superseded_before_dispatch_by_E_FAIL_and_round3_draft_v4`。未派发，不能标完成。
- D4 `task_adcb9ed3b0a8` / `ctx_d8a5c8eae7b1` 状态 `completed`，worker subject `D draft-v4 全量三门复验 PASS`，终端已释放。报告 `ae5c87028bcfbd6f5c751aa2024f7d2a5f6514fa11a1c7cb64f447f756f9058d`，checks `15127b43800be03b681c25835a9ffd652cac2c1fc67c9efaff499d24266b3e36`。`msg_5f7e33be453d` 把协调者验收标为待读；本记录不把它改成协调者已接受。
- E4 `task_67ffe96219bd` 状态 `dispatched`，dispatch `ctx_626147c43cbb`，终端 `term_2e6fa9eb-9f7d-4e1e-a79f-1a545d3f4c3f`，agent `antigravity`，outcome `in_progress`。`msg_5f7e33be453d` 发出时 E4 尚未派发；asOf 以这次 worker-list 为准。不是内容 PASS。
- F4 `task_ead4c451ba94` 状态 `pending`，无 dispatch。
- worker-list counts `{"active": 2, "retained": 1, "released": 27}`，page total `30`。活跃 2 是本 S 与 E4。retained 1 是缺资源的旧行，不是活终端。

## 4. 精确标记扫描

标记 SHA-256 `401cad403b3b56138aee2a8cde4c2099a87c2c780f178ff05cc664816d6efac1` 与 identity 文件 SHA-256 `d8022e54453b9c56da89bfbcfd350f0aa3a8c675a1d8976f5b85a1a9e702ed23` 均复读匹配。明文未写入日志或报告。

| 目标 | 计数字段 | token / id 命中 |
|---|---|---|
| `content/en/draft-v4.md` | 全文 | 0 / 0 |
| `content/en/public-references.en.json` 公开文本 | 125 | 0 / 0 |
| `content/en/public-references.en.json` 其余字符串 | 23 | 0 / 0 |
| `content/en/media-text.en.json` 公开文本 | 52 | 0 / 0 |
| `content/en/media-text.en.json` 其余字符串 | 35 | 0 / 0 |
| `content/en/writer-submission.json` 公开文本 | 25 | 0 / 0 |
| `content/en/writer-submission.json` 其余字符串 | 54 | 0 / 0 |
| `media-production/en/cover-payments.svg` 可见 `<text>` 11 | 可见文字 / 源文本 | 0+0 / 0+0 |
| `media-production/en/tier-rooms.svg` 可见 `<text>` 10 | 可见文字 / 源文本 | 0+0 / 0+0 |
| `media-production/en/upgrade-or-renovation.svg` 可见 `<text>` 10 | 可见文字 / 源文本 | 0+0 / 0+0 |
| `media-production/en/house-upgrade-stardew-cover.webp` | RIFF/WEBP 1672x941 `c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342` | whole 0/0 |
| `media-production/en/house-upgrade-stardew-cover.avif` | ISOBMFF/AVIF 1672x941 `f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113` | whole 0/0 |
| `media-production/en/tier-rooms.en.webp` | RIFF/WEBP 1672x941 `c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209` | whole 0/0 |
| `media-production/en/tier-rooms.en.avif` | ISOBMFF/AVIF 1672x941 `8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b` | whole 0/0 |
| `media-production/en/upgrade-or-renovation.en.webp` | RIFF/WEBP 1672x941 `040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b` | whole 0/0 |
| `media-production/en/upgrade-or-renovation.en.avif` | ISOBMFF/AVIF 1672x941 `1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426` | whole 0/0 |

三份 WebP 都只有有损 `VP8 ` 块，尺寸 1672x941。三份 AVIF major brand `avif`，顶层盒 `ftyp` / `meta` / `mdat`，`ispe` 同为 1672x941。上表文本命中合计 0，六张光栅 whole-file 命中合计 0。未扫描 SEO、中文或页面。零命中只说明这些字段和字节层没有该精确字符串。

## 5. 仍未完成

E4 复核、F4 计数锁稿与标题、SEO、独立 T 译文、双语冻结、页面、用户终审、部署都未完成。英文未锁。本 S 不代签。

## 6. 权限

UID 501，GID 20。identity `mode=0600`，`test -r` 退出码 0。三个目录 inode 分别是 145851019、65977012、144267400。结论只到逻辑隔离。

两句措辞在 finishedAt 之后改过：旧表单元格未改，活跃终端明确为本 S 与 E4。`wordingClarifiedAt=2026-10-16T08:58:57+0800`。
