# E 读者口吻复验

只读本地读者页，未改网站源码。

- http://127.0.0.1:3003/oak-tree-vs-maple-stardew
- http://127.0.0.1:3003/zh/oak-tree-vs-maple-stardew

同一 TaskSpace 打开两页，看完后已关闭。核对的是读者能看见的文字，另加整页 HTML 是否还含 `used as written`。

## 结论

必须改：1

英文页没有 `used as written`。整页 HTML 精确匹配为 0；中间夹空白或标签的宽松匹配也没有。中文页同样没有。

## 英文重型采集器来源

读者能看见的整条是：

> Heavy Tapper on the Stardew Valley Wiki : Oak Resin in 3 Nights and Maple Syrup in 4 Nights; twice the speed kept beside 3 and 4; winter production continues on oak and maple; bugs note on the fall green-rain change; 1.6 history fixes heavy tappers turning normal trees into mushroom trees and does not say the green-rain bug was fixed; the lightning sentence on that page does not mention bombs.

旧句 `the lightning sentence is used as written, without adding bombs.` 不在这条里，也不在页面其他可见文字里。

`3 Nights`、`4 Nights` 还在。同一条里其余事实也还在：两倍速度留在 3 和 4 旁边、冬橡和冬枫都继续产出、秋季绿雨的 bugs、1.6 历史修的是普通树变蘑菇树且没有说绿雨那条已修好。

正文里这句仍是给玩家的界限，不记必须改：

> The Heavy Tapper page’s lightning sentence does not add bombs. Do not treat a bomb as part of that Heavy Tapper sentence.

## 必须改

1. 中文来源区底部，读者能看见：

> 正文里的配方、采集间隔、售价和季节限制，来自下面这些维基页面。某一句只在英文页有的，正文已说明那是英文维基的写法。

前一句是在说来源。后一句是在说本稿怎么处理只在英文页出现的句子，不是告诉玩家不要做哪件事。

## 扫过，不记必须改

两页都没有事实编号、检索名次、内部路径、`docs/blog-ops`、`operation-store`、编辑附录、流程角色名或提示词。中文「作者：星露谷规划器团队」是署名，不是流程角色。

中文里的「不要」是在告诉玩家不要做的事，例如不要改写成 3.5 天或 6 天，不要把三句日期收成秋季 15 日到 28 日，不要用 18 天或 24 天打破平局。「这里不把松焦油的间隔和售价排成名次」说的是不要给松焦油排名，不是检索名次。

英文 `Do not rewrite 7 as 6... so the sentence and the table agree` 是在告诉读者不要把印出来的 3、4 改成一半，不是在吩咐作者改稿。
