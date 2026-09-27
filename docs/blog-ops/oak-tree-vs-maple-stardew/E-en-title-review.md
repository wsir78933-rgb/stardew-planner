# E-en 题文复核：oak-tree-vs-maple-stardew

## 绑定

- 角色：E-en。只核对最终 Title、H1、Description 和 slug。没有改正文，没有改标题。
- F 的筛选只当作待核文字，不代替这次判断。
- 锁定正文：`docs/blog-ops/oak-tree-vs-maple-stardew/locked/en-body.txt`
- 本机 `shasum -a 256`：`3297ded2d51520352c3278f6548685087a0162472b869afe8e199f9709907b7c`
- 与指定值相符。结论只绑定这一串。
- 用户终审：尚未进行。公开交接仍未冻结。

## 选定表面

- Title / H1：Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree
- Description：Acorn or Oak Resin means oak, and Maple Seed or Maple Syrup means maple. If a Tapper or Heavy Tapper is already on the mature tree, read that product. Otherwise shake or chop once. Wood 12–16 does not name the tree.
- slug：`oak-tree-vs-maple-stardew`

页面实际显示与这组文字是同一句。`createPublicPageMetadata` 把传入的 title 和 description 原样用于 Title、Open Graph 和 Twitter。英文根布局的 title 是纯字符串，没有 `title.template`，不会再接品牌后缀。文章 H1 是 `post.title`。

## 逐句兑现

标题没有数字。它只承诺一件事：种子或采集器产物给这棵树命名。

锁定正文第一段：`an Acorn or Oak Resin means the tree is an oak, and a Maple Seed or Maple Syrup means the tree is a maple`，接着是已有 Tapper 或 Heavy Tapper 就读产物，否则摇或砍一次并读种子。图注：`The seed name or the product name separates the trees.` 重型采集器产出的仍是 Oak Resin 或 Maple Syrup，名字链不变。标题里的 Tapper Product 是这个产物，不是把重型采集器排除在外。描述把两种机器都写了。

描述四句都能在锁定正文里找到：

- `Acorn or Oak Resin means oak, and Maple Seed or Maple Syrup means maple` 与第一段同义，结尾清单也是这两句。
- `If a Tapper or Heavy Tapper is already on the mature tree, read that product` 对应第一段和结尾清单里的读产物。成熟是这篇检查的起点。
- `Otherwise shake or chop once` 对应第一段的 `otherwise shake or chop once and read the seed`。它没有保证每次都掉种子。
- `Wood 12–16 does not name the tree` 对应第一段「木材堆不选择」，以及图 2 alt 的 `Wood 12–16 does not name it either`。

没有谁更赚钱，没有外观辨认，没有规划器，没有 1.6.15 实测。没有最快、最好或免费。

## 停留与主意图

会停。读者要分开还站着的橡树和枫树，标题直接说分开它们的是种子名或采集器产物，不是木材，也不是哪棵更赚。这是结论前置，停留点是方法上的信息差，正文第一段接得住。

主意图仍是认成熟的树。描述补的是检查顺序和木材不命名，不是第二个意图。

最近 3 篇英文标题来自 `src/blog/blog-post-registry.tsx` 英文注册表末尾，本次自己核对过，不是沿用 F 的名单：

- Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change
- What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting
- Stardew Fruit: Find Its Source Before Buying Seeds

选定标题不是「What 加数字再加 Change」，不是「Choose by A, B, and C」，也不是「Find X Before Y」。

## slug

`src/blog/blog-post-identities.ts` 的 `blogPostSlugs` 没有 `oak-tree-vs-maple-stardew`。`oak-tree-stardew` 和 `maple-tree-stardew` 仍是各自的地址。这个 slug 不占用它们。

## 结论

哈希相符。必须改：0。Title、H1、Description 和 slug 通过。用户终审尚未进行。公开交接仍未冻结。
