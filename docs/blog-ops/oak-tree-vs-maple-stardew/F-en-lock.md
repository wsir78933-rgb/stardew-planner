# F-en 锁稿与标题

状态：正文已锁定，标题待 E 复核，公开交接未冻结。

角色：F-en。只淬文、计数、锁定英文读者正文，并生成标题。未改正文事实，未写网站代码，未写 PublicBlogHandoff。未读中文稿来翻译标题。

- 草稿：`docs/blog-ops/oak-tree-vs-maple-stardew/C-en-draft.md`
- 草稿 SHA-256：`fc545b71d6c3276dc481e232105157b2b28e0731d9d46767f07518e81b3d917e`
- 与指定通过哈希一致。D-en-recheck-v2 必须改 0，E-en-recheck 复验通过、必须改 0。两份都绑定这个草稿哈希。
- 主意图（只核对 B-en，不把作废的「摇或砍都是 0–2」写回正文）：成熟且还站着的树上，在采集或砍之前，用种子名或采集器产物名把橡树和枫树分开，使动手的那棵就是读者要的那棵。
- 主关键词：`stardew valley oak tree vs maple`。locale：`en`。地区：B 所记的 US。
- 标题不能承诺谁更赚钱、外观辨认或规划器功能。

## 锁定正文

| 字段 | 值 |
|---|---|
| 锁文件 | `docs/blog-ops/oak-tree-vs-maple-stardew/locked/en-body.txt` |
| 范围 | 草稿第一段到 `## Sources` 整节，含来源列表，不含 `## Editor appendix (not reader body)` |
| 编码 | UTF-8，无 BOM |
| 规范化 | NFC。与切片原文相比，NFC 没有改字 |
| 换行 | LF。无 CR。文件末尾恰好一个换行 |
| 行数 | 165 |
| 字节数 | 33286 |
| 淬文 | 零改字。未润色、未增删、未改链接、图注或 alt |
| 正文 SHA-256 | `3297ded2d51520352c3278f6548685087a0162472b869afe8e199f9709907b7c` |

锁定字节与「附录标题之前、去掉文末空行、再保留一个 LF」的草稿切片相同。`sha256_raw` 与 `sha256_nfc_lf` 相同。

## 计数

命令：

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
  "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/oak-tree-vs-maple-stardew/locked/en-body.txt" \
  --locale en --exclude-heading Sources
```

脚本完整标准输出：

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/stardew planner/docs/blog-ops/oak-tree-vs-maple-stardew/locked/en-body.txt",
  "locale": "en",
  "mechanical_units": 5200,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 11,
    "code": 0,
    "excluded_sections": 10,
    "non_body": 73,
    "frontmatter": 0
  },
  "sha256_raw": "3297ded2d51520352c3278f6548685087a0162472b869afe8e199f9709907b7c",
  "sha256_nfc_lf": "3297ded2d51520352c3278f6548685087a0162472b869afe8e199f9709907b7c"
}
```

mechanical_units 5200，不低于 2000。未加字。脚本只给机械值，不代替 E 的语义审核。

## 锁定前核对

读者正文中没有 `because the count includes zero`。摇树不使用砍树的 0–2：出现 0–2 的段落要么在否定摇树计数，要么只写砍树。没有 `Up to 4`。农场外的句子同时写了 `not in Pelican Town`。1.6 历史句只写有机会变成绿雨树并在秋天掉叶，并写明历史行不承载镇、温室、春天和采集器限制。没有 `规划器`，没有 `planner`，没有 `most profitable`，没有 `1.6.15`，没有 `实测`。

未发现需要停锁的事实句。本轮没有改稿。

## 正文承诺

| 问 | 答 |
|---|---|
| 点开后得到什么 | 成熟树上用 Acorn 或 Oak Resin 认橡树，用 Maple Seed 或 Maple Syrup 认枫树；已有采集器就读产物，否则摇或砍一次读种子。空结果就说这次没有命名 |
| 最大的事实 | Wood 12–16 和同一套木材修正分不开两种树。0–2 只写在砍树种子上，不写给摇树 |
| 本篇能讲的判断 | 空种子、采集低于 1 级、采集器挂不上、秋季榛子、绿雨树、松、桃花心木、果树，都不把这棵树改判成这一对里的另一个 |
| 绝对不能写 | 谁更赚钱、most profitable、外观辨认、规划器功能、1.6.15 实测 |

核心承诺：动手之前，用种子名或采集器产物名确认这棵成熟树是橡树还是枫树；检查没有给出名字就停。

## 最近 3 篇英文标题

来源是 `src/blog/blog-post-registry.tsx` 英文注册表数组末尾，不是另猜的发布日期。

| slug | title |
|---|---|
| profit-margin-stardew | Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change |
| what-to-grow-in-greenhouse-stardew | What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting |
| stardew-fruit | Stardew Fruit: Find Its Source Before Buying Seeds |

不去的是主词本身。不去用的骨架是：`What` 加四个数字再加 `Change`；`Choose by A, B, and C`；`Find X Before Y`。

## 10 个方向

生成时不套公式。都围绕同一个认树意图。描述只补该方向在正文里已经写出的所得。

1. Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree。描述补 Acorn 或 Oak Resin 是橡树，Maple Seed 或 Maple Syrup 是枫树；已有 Tapper 或 Heavy Tapper 就读产物，否则摇或砍一次；Wood 12–16 不命名。
2. Wood 12–16 fits both a Stardew Valley oak tree and a maple。描述补同一条木材规则，以及真正分开两列的是种子名或产物名。
3. Read Oak Resin or Maple Syrup before you take the Tapper off。描述补斧或镐打一下取下后采集器还在；没有采集器就改为摇或砍一次。
4. A fall Hazelnut does not rename that tree as a Stardew Valley oak。描述补 Maple Tree 页的 Fall 14–28，以及 Trees 页没有日期的 last two weeks of fall。
5. Zero seeds leave a Stardew Valley oak tree vs maple unnamed。描述补空摇不是另一种树，也不要砍旁边那棵来逼出一个名字。
6. Below Foraging level 1, a missing seed does not name the oak or the maple。描述补升级后摇树可以马上掉种子，砍树要睡到看见升级。
7. 7 Nights and 7 days are one Stardew Valley oak wait, not two。描述补枫树是 9 Nights 与 9 days，两种写法不加在一起。
8. A moss shake is not the seed check for a Stardew Valley oak or maple。描述补苔藓树可以用镰刀或武器摇、且不取下采集器；这一句没有写掉落 Acorn 或 Maple Seed。
9. A green rain tree is not the other name in this oak-versus-maple check。描述补已经拿到的 Oak Resin 或 Maple Syrup 保持原名，蕨菜不完成任一条名字链。
10. A Maple Seed means this tree is the wrong one for the Keg。描述补 Keg 要 Oak Resin，Bee House 要 Maple Syrup；没有自带配方的读者停在树种名字。

## 归类与淘汰

| # | 机制 | 停留要素 | 人性驱动 | 处置 |
|---|---|---|---|---|
| 1 | 结论前置 | 捷径、窥探 | 懒惰 | 留。选定 |
| 2 | 反差数字 | 异常 | 傲慢 | 两道检查通过，不选。标题只证明木材分不开，没有给出认树的名字 |
| 3 | 损失进入 | 冲突 | 懒惰 | 淘汰。`Read X before you Y` 与水果文 `Find X Before Y` 是同一套「先拦住错误动作」骨架，且只覆盖已经挂着采集器的分支 |
| 4 | 冲突 | 异常 | 傲慢 | 两道检查通过，不选。秋季榛子接得住，但把整篇收成一个季节替换 |
| 5 | 损失进入 | 终结 | 懒惰 | 两道检查通过，不选。空结果是失败分支，不是正法 |
| 6 | 群体点名 | 异常 | 懒惰 | 两道检查通过，不选。只点采集低于 1 级的人，主检查被藏起 |
| 7 | 反差数字 | 异常 | 傲慢 | 淘汰。标题承诺的是等待单位，主意图是认树。数字并列也靠近利润率文的清单 |
| 8 | 悬念场景 | 窥探 | 懒惰 | 淘汰。苔藓摇树是例外，不是这篇的主检查 |
| 9 | 终结 | 终结 | 懒惰 | 淘汰。绿雨树是检查失败后的停止条件，不是打开页面时要完成的认树 |
| 10 | 结论前置 | 冲突 | 懒惰 | 淘汰。小桶例子会把认树收成选配方。布局已拒绝「哪棵更好」作为第二意图 |

没有承诺谁更赚钱、叶子或树干辨认、规划器。标题和描述都没有金币数字；这篇英文正文没有售价。

## 两道检查

选定标题：Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree。

停留：会停。读者面对的是还站着、可能采集或砍错的橡树和枫树，手里没有外观口诀。标题给出的不是「哪棵更赚」，而是命名物就是种子，或已经挂着的采集器产物。这个信息差对着正文第一句，也对着「已有采集器就读产物，否则摇或砍一次」。

适配：

- 标题没有数字。
- 「种子或采集器产物给这棵树命名」是正文第一段已经写出的结果，不是标题里才出现的结论。
- 点名的是正在比较星露谷橡树和枫树的人，不是规划器用户，也不是在对叶子。
- 正法在开头、图 2 和后文分支里写完了：有 Tapper 或 Heavy Tapper 就读产物；没有就摇或砍一次；空种子不改判。
- 语气没有比正文更满。标题不说一定掉种子、不说更赚、最快或最好。`Tapper product` 不把重型采集器排除在名字链外；描述写明两种机器。

描述：Acorn or Oak Resin means oak, and Maple Seed or Maple Syrup means maple. If a Tapper or Heavy Tapper is already on the mature tree, read that product. Otherwise shake or chop once. Wood 12–16 does not name the tree.

描述里的四个物品名、两种采集器、摇或砍一次，以及 Wood 12–16 不命名，都在正文第一段、图 2 或图注里。「does not name the tree」对应图 2 的 `Wood 12–16 does not name it either`，不是新结论。描述没有外观，没有规划器，没有 most profitable，没有 1.6.15 实测。

2、4、5、6 的事实句子正文都接得住，停留点也是真的，但都比 1 窄，不选。3、7、8、9、10 在上表淘汰，不进入选定。

## 选定

`createPublicPageMetadata` 把传入的 title、description 原样用于 Title、Open Graph 和 Twitter，没有品牌后缀。根布局的 title 是纯字符串，不是 `title.template`，页面标题不会再接品牌后缀。`BlogArticleContent` 的唯一 H1 就是 `post.title`。所以 H1、Title、OG Title 用同一句，不另写一套。

| 字段 | 文字 |
|---|---|
| Title | Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree |
| H1 | Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree |
| OG Title | Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree |
| Description | Acorn or Oak Resin means oak, and Maple Seed or Maple Syrup means maple. If a Tapper or Heavy Tapper is already on the mature tree, read that product. Otherwise shake or chop once. Wood 12–16 does not name the tree. |
| slug 提议 | `oak-tree-vs-maple-stardew` |

`src/blog/blog-post-identities.ts` 的 `blogPostSlugs` 没有 `oak-tree-vs-maple-stardew`。已占用、不能拿来当本篇地址的包括 `oak-tree-stardew`、`maple-tree-stardew`、`stardew-valley-trees`、`pine-tree-stardew`。提议的 slug 不覆盖这些旧地址。本轮没有把 slug 写进注册表。

标题待 E 复核。F 不宣布题文通过。用户终审尚未进行。公开交接未冻结。
