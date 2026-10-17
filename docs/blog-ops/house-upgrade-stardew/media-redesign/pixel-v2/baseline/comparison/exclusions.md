# 比较基线排除说明

比较基线从两份普通正文生成。源正文没有改。

- 英文源：`docs/blog-ops/house-upgrade-stardew/lock/en/body.md`
- 中文源：`docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md`
- 英文比较基线：`comparison/en-body.comparison.md`
- 中文比较基线：`comparison/zh-draft-v2.comparison.md`

每处排除都是源文件里的精确原文。比较基线等于源正文删掉这些片段。保留段落的字符不改。

英文排除 3 处：1 处 Nursery label 标记句，2 处图片 alt+caption。
中文排除 3 处：1 处「育儿室」标记句，2 处图片 alt+caption。
两份正文合起来，标记引用是 2 处。
## 英文

### 1. Nursery label 标记句

源行：43

这句指向房间图上的文字标签。同一段前面的房间事实保留。

精确删除：

```
 On the room figure, the Nursery label is this crib room.
```

同一行保留：

```
The second upgrade makes the kitchen and the bedroom larger. One added room is empty. The other has a crib and two child beds, and you can have two children ([Farmhouse](https://stardewvalleywiki.com/Farmhouse), [Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).
```

### 2. alt 与 caption `/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp`

源行：图片 alt 在第 45 行，caption 在第 47 行。
第 46 行是 alt 和 caption 之间的空行。第 48 行是 caption 后面的空行。
图片前的第 44 行空行保留，所以前后正文仍只隔一个空行。
这两个空行都没有正文。删掉 caption 后的空行，是为了不把前后段落隔成两个空行。

精确删除：

```
![Three labeled stages: Upgrade 1 with Kitchen and Bedroom, Upgrade 2 with Empty room and Nursery, Upgrade 3 with Cellar and Same exterior, and a shared line reading 9×5 outdoors.](/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp)

Schematic. Upgrade 1 is labeled Kitchen and Bedroom. Upgrade 2 is labeled Empty room and Nursery. Upgrade 3 is labeled Cellar and Same exterior. A shared line reads 9×5 outdoors.
```

### 3. alt 与 caption `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp`

源行：图片 alt 在第 63 行，caption 在第 65 行。
第 64 行是 alt 和 caption 之间的空行。第 66 行是 caption 后面的空行。
图片前的第 62 行空行保留，所以前后正文仍只隔一个空行。
这两个空行都没有正文。删掉 caption 后的空行，是为了不把前后段落隔成两个空行。

精确删除：

```
![Two paths and two examples: Upgrade with 3 days; Renovation with After upgrade 2, Instant, and Refunds gold; Remove crib with Free; Dining room with 150,000g.](/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp)

Schematic. The upgrade path reads Upgrade and 3 days. The renovation path reads Renovation, After upgrade 2, Instant, and Refunds gold. Remove crib reads Free. Dining room reads 150,000g.
```

## 中文

### 1. 「育儿室」标记句

源行：43

这句指向房间图上的文字标签。同一段前面的房间事实保留。

精确删除：

```
房间图上的「育儿室」标的就是这间有婴儿床的房间。
```

同一行保留：

```
第二次升级把厨房和卧室加大。新加的房间里，一间是空的。另一间有一张婴儿床和两张儿童床，你可以有两个孩子（[农舍](https://stardewvalleywiki.com/Farmhouse)、[木匠的商店](https://stardewvalleywiki.com/Carpenter%27s_Shop)）。
```

### 2. alt 与 caption `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp`

源行：图片 alt 在第 45 行，caption 在第 47 行。
第 46 行是 alt 和 caption 之间的空行。第 48 行是 caption 后面的空行。
图片前的第 44 行空行保留，所以前后正文仍只隔一个空行。
这两个空行都没有正文。删掉 caption 后的空行，是为了不把前后段落隔成两个空行。

精确删除：

```
![三档标注：升级1是厨房和卧室，升级2是空房间和育儿室，升级3是地窖和外观相同，共用一行写着9×5室外。](/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp)

示意图：升级1标着厨房和卧室。升级2标着空房间和育儿室。升级3标着地窖和外观相同。共用一行写着9×5室外。
```

### 3. alt 与 caption `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp`

源行：图片 alt 在第 63 行，caption 在第 65 行。
第 64 行是 alt 和 caption 之间的空行。第 66 行是 caption 后面的空行。
图片前的第 62 行空行保留，所以前后正文仍只隔一个空行。
这两个空行都没有正文。删掉 caption 后的空行，是为了不把前后段落隔成两个空行。

精确删除：

```
![两条路径和两个例子：升级写着3天；装修写着升级2之后、即时和退还金币；移除婴儿床写着免费；餐厅写着150,000金。](/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp)

示意图：升级那一路写着升级和3天。装修那一路写着装修、升级2之后、即时和退还金币。移除婴儿床写着免费。餐厅写着150,000金。
```

## 保留的相近字

- 英文标题 `## What the kitchen, nursery, and cellar are for` 是小节主题，不是图上的 Nursery 标签引用。
- 中文标题 `## 厨房、育儿室和地窖是做什么的` 是小节主题，不是图上的「育儿室」标签引用。
- `That figure is a count of harvests, not a calendar date.` 里的 figure 指收获次数，不是插图。
- `这个数字是收获次数，不是日历上的日期。` 说的是收获次数，不是插图。
- `Remove Crib is free and finishes at once` 和 `移除婴儿床免费，而且马上完成` 是装修规则，不是图上的字。
- 封面 alt/caption 不在这两份普通正文里。它们留在 handoff JSON 副本和 registry 两条原始字段里。
