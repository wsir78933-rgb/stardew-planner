# 第4轮中文局部修订

角色 T。这一轮不签署译文 PASS。`translationReview` 仍是 `pending-independent-E`。独立 E 还没有复验本轮。

用户对「是否允许追加一轮，仅修5处中文问题再继续完成页面验收」的回复是「继续」。协调者于 2026-10-16 14:19:46 UTC 读取时钟并确认授权；这是协调者记录时钟，不把它当成用户消息的精确发送时刻。预算记为 used 4 / explicit exception 1 / remaining 0。原先 3 轮保留在 `preservedPriorRounds`，没有重置成 0/3，也没有另开预算。

`/tmp/zh-house.html` 仍在，75,441 字节，标题是「农舍 - 星露谷物语官方中文维基」。「餐厅」一行是 150,000，「打通餐厅」一行是 10,000，全文没有「修建餐厅」。`/tmp/zh-page.html` 的标题是「采集 - Stardew Valley Wiki」，不用它决定菜单名。没有再次请求维基。

## 正文 diff

`diff -u draft-zh-v1.md draft-zh-v2.md` 退出码 1，表示有差异。只有下面三行：

```diff
-你一开始有一把能砍倒完全长成的树的斧头，之后的等级到铁匠铺升级（[斧头](https://stardewvalleywiki.com/Axes)）。砍树取得木材，或者从罗宾的普通存货购买木材（[木材](https://stardewvalleywiki.com/Wood)）。
+你一开始有一把能砍倒完全长成的树的斧头，后续斧头等级在铁匠铺升级（[斧头](https://stardewvalleywiki.com/Axes)）。砍树取得木材，或者从罗宾的普通存货购买木材（[木材](https://stardewvalleywiki.com/Wood)）。

-移除婴儿床免费，而且马上完成（[木匠的商店](https://stardewvalleywiki.com/Carpenter%27s_Shop)）。修建餐厅要150,000金，增加一间占地9×10再加4×5的房间，而且马上完成。要把这150,000金拿回来，那片9×10再加4×5的区域必须是空的（[木匠的商店](https://stardewvalleywiki.com/Carpenter%27s_Shop)）。
+移除婴儿床免费，而且马上完成（[木匠的商店](https://stardewvalleywiki.com/Carpenter%27s_Shop)）。餐厅要150,000金，增加一间占地9×10再加4×5的房间，而且马上完成。要把这150,000金拿回来，那片9×10再加4×5的区域必须是空的（[木匠的商店](https://stardewvalleywiki.com/Carpenter%27s_Shop)）。

-想要地窖，就选第三次升级那一行。想要这些改动，就选移除婴儿床或修建餐厅。
+想要地窖，就选第三次升级那一行。想要这些改动，就选移除婴儿床或餐厅。
```

对应英文锁句是 “you upgrade later grades at the Blacksmith” 和 “Add Dining Room costs 150,000g”。150,000 金用官方菜单名「餐厅」，没有改成 10,000 金的「打通餐厅」。

## 引用 diff

`public-references.zh.json` 相对归档的 diff 退出码 1。除 `bodyVersion` 和 `translatedBodySha256` 绑定外，只有这 5 处：删 `bodyPath`；餐厅 quote 去掉「修建」；斧头 quote 改成新句；版本说明删去「旧的这一对只出现在那一句里」；删去 `site-carpenter.versionNote`。保留的版本说明是「1.6把第二次升级从50,000金和150硬木改为65,000金和100硬木。」干净英文投影里同条 versionNote 只有这次 1.6 价格变更，`site-carpenter` 没有 versionNote。

`seo.zh.json` 和 `media-text.zh.json` 的 diff 都只有 `translatedBodySha256` 一行。标题、描述、图注、图内文字没有改。

## 哈希

| 项 | SHA-256 |
| --- | --- |
| 英文锁 `lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| selected SEO `seo/en/seo-candidate.json` | `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58` |
| 原 `draft-zh-v1.md` | `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` |
| 新 `draft-zh-v2.md` | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` |
| 新 `public-references.zh.json` | `b2e0781d81b60a10ba6586ca8c0ea7032ce9e2f24df05fb80587dba8733f9127` |
| 新 `seo.zh.json` | `f744f783cf4b04d1cf0d66a2029cafaedaaf5eb04754e7b1e13612e48c29be16` |
| 新 `media-text.zh.json` | `43c6138438d5a29bb13ab0daf0ccd9b5c6498284191a79680c53e84ade7298aa` |
| 新 `translation-submission.json` | `4d8b4fa7f9c0835f7c8e33f151830767ea9491d164af7f20e7e90a9e62fa4671` |
| 归档四 JSON 与原 v1 正文 | 与上表改动前的值相同 |

全文汉字 1,905。官方计数器机械汉字 1,737，`length_class` 为 `reference_only`，不少于 1,000。没有另起段落凑字。H2 仍是 6，H3 仍是 2。v1 与 v2 的数字串多重集合相同，158 个。正文 http URL 多重集合与英文锁稿相同：12 个地址、50 次。55 条 quote 的 occurrence 都是 1，并且各在正文里出现 1 次。

三张中文 SVG、六张中文栅格、`provenance.json`、`render-recipe.py` 的哈希与 v1 提交单相同。字体和像素沿用此前已经做过的可视检查，只因为这些图哈希没变。本轮不能写成严格自动 bbox PASS。没有重新渲染。

## 验证退出码

`shasum -a 256` 退出码 0。`正文计数.py --locale zh-CN` 退出码 0。正文、引用、SEO、媒体文本、提交单的 `diff -u` 退出码都是 1，因为文件有上列差异。核对脚本退出码 0，`FAIL_COUNT 0`。

```text
counter_exit=0
mechanical_units=1737
sha256_raw=0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6
sha256_nfc_lf=0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6
length_class=reference_only
shasum_exit=0
diff_body_exit=1
diff_refs_exit=1
diff_seo_exit=1
diff_media_exit=1
diff_submission_exit=1
verify_exit=0
FAIL_COUNT 0
```
