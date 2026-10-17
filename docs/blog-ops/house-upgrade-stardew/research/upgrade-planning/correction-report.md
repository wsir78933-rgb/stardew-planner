# upgrade-planning 事实校正

- 角色：A。不写正文，不签质量门。
- 校正日：2026-10-16。
- 对照材料：本目录已保存的六份 `sources/*.json` innerText，以及 `material-preparation/facts.json` 里大树桩与大圆木的工具句。没有重开网页。
- `sources/` 与 `verification.log` 未改。

## SHA-256

| 文件 | SHA-256 | 字节 |
|---|---|---|
| `versions/submission-v1/facts.json` | `3750538244bc2e81b310530d480f5bf1ee6ad0b8563d1d6e4d8d380ba8c47399` | 25469 |
| `versions/submission-v1/research.md` | `6b6669c7afa544a7fdcaad6f2c871c4e802574be69ac9a13c3a626a5c9938699` | 12299 |
| 校正后 `facts.json` | `397cc320f596d97e858809e688ba8f90d9db477236416f8cdd57fa1ed548026e` | 33849 |
| 校正后 `research.md` | `d989bf0a5f7f6eea2b917b24bcc20e36b710d6c37db9051269378a7c6c656bd6` | 5515 |

备份与校正前原文件字节相同。`python3` 解析校正后 `facts.json` 退出码 0。22 条事实。公开 14 条，`publicAllowed: false` 8 条。

算术退出码 0：`450 - 200 = 250`，`250 × 10 = 2500`，`10000 + 2500 = 12500`，`10000 + 65000 = 75000`，`10000 + 65000 + 100000 = 175000`。

嵌入的关键原句回查退出码 0，缺句 0。

## 逐项

1. `UP-order-prerequisites`：改为 `publicAllowed: false`。Farmhouse 与 Carpenter's Shop 的升级表只有分列的 1、2、3 行。六份保存文本里没有“不能跳档”“施工时不能下下一单”“所有版本都如此”。累计 75,000g 与 175,000g 仍是 `type: calculation`，表示从初始农舍把已列出的行相加，不依赖跳档禁令。
2. `UP-construction-days-per-tier`：只留两句原文。Farmhouse：“Robin requires three days to complete each farmhouse upgrade.” Carpenter's Shop：“Farmhouse upgrades require three days to complete.” 删掉 “three full days” 和 “9 work days”。没有把 9 写成公开计算。
3. `B-calendar-scheduling-constraints`：改为 `publicAllowed: false`。次日开工、节日不施工、多数工程两天，出现在 Carpenter's Shop 引言，保存文本没有把这几句定位到农舍的三天。不用它们给农舍排日期。
4. `B-shop-counter-operation-unverified`：改为 `publicAllowed: false`。柜台开着或关着都不进入正文。
5. `UP-upgrade-1-direct-unlocks`：保留 Farmhouse 行 “Adds a bedroom.” 删掉 “expands the bedroom”。删掉 Krobus 与室友入住。该行只有 “Allows marriage.” Marriage 页不在六份来源里。
6. `UP-kitchen-fridge-direct-use`：36 格、炉灶、与烹饪界面相连，按 Cooking 页原句。水槽按 Farmhouse Notes 原句。删掉 “primary” 和 “automatically … without manual transfer”。
7. `CALC-wood-deficit-example`：只留 10,000g、450 Wood、手头 200、缺口 250、第一年 10g、合计 12,500g，以及“不含其他准备花费”。删掉铜斧 2,000g、5 个铜锭、钢斧 5,000g、5 个铁锭、食物和硬木采集费。
8. 原稿 “钢斧砍大树桩” 已从 `research.md` 删除。`material-preparation` 的 `MP-hardwood-item` 写大树桩用铜斧或更好，大圆木用钢斧或更好。本包不把那些数字补进木材算例。
9. `UP-footprint-invariance`：保留 Farmhouse 的 9×5，以及 Carpenter's Shop 的 “the footprint of the building does not change, so no adjacent tiles are impacted.” 删掉 “不需清空屋外任何物品”。Carpenter's Shop 农场建筑表里的 9×5 是装修房间尺寸，不再当作农舍占地出处。
10. `UP-upgrade-3-cellar-casks-direct-use`：保留地窖位置、陈酿以提高品质和价值、自带 33 桶、六种物品名、配方 20 Wood 与 1 Hardwood、只有在地窖才接收物品、外观不变。189 与 “doubles the value” 移到 `B-cellar-details-outside-approved-function`，`publicAllowed: false`。它们在保存页里有句子，但不是这篇批准的写作必需。
11. `UP-upgrade-1-cost-materials`：删掉 “hardwood cannot substitute.” 费用行只写出 Wood (450)，没有替代句。
12. `UP-upgrade-2-cost-materials` 与 `UP-upgrade-3-cost-materials`：删掉 “必须先完成上一档”。1.6 改价保留，出处是保存的 Version History 1.6 节和 Farmhouse 1.6 历史行。
13. `UP-upgrade-2-direct-unlocks`：“two children” 只挂 Carpenter's Shop 原句。Farmhouse 原句是 “have children” 和两张儿童床。
14. `UP-upgrade-2-renovations-painting`：即时、全额退款、占用条件、building/trim painting、屋顶限制，都按保存原句。没有把 “fully upgraded” 定义成某一档。单独装修价不进入公开主张。
15. `appliesTo`：从 “All versions” “All game saves” 改为这六份已保存英文页及其页脚日期。发布方写 Stardew Valley Wiki，不用它充当游戏发行商官方站。

## 未采纳

- 没有把 9 个工作日或连续日历日补成新的公开计算。
- 没有用次日开工或节日顺延给农舍写完成日。
- 没有把柜台写成开或关。
- 没有恢复科罗布斯、扩卧室、清空屋外物品、硬木不能替代木材。
- 没有把 189 或售价翻倍设为写作必需。
- 没有把铜斧或钢斧的价格和锭数写入本目录算例。
- 没有重访已经保存的六页，也没有新写测试脚本或跑仓库检查。
