# how-to-harvest-stardew-valley 媒体来源（rework-v2）

日期：2026-10-13。只记录已查看的原始画面和缺口。没有装配到公开页，没有改原稿、源码或旧 manifest，没有生成 SVG、文字卡片或假游戏界面。

主意图来自本篇任务卡：读者要知道怎么亲手收成熟作物、哪些作物要挥镰刀、巨型作物和棚架怎么处理。V7 第三节第六节要求封面之外有能解释操作的真实画面；图片要能让人认出动作或位置，不凑固定张数。

## 本机游戏

只读检查，没有启动游戏，没有改存档。

| 路径 | 结果 |
|---|---|
| `/Applications/Stardew Valley.app` | 不存在 |
| `~/Library/Application Support/Steam/steamapps/common/Stardew Valley` | 不存在 |
| `~/Library/Application Support/Steam/steamapps/libraryfolders.vdf` | 不存在 |
| `mdfind -name 'Stardew Valley.app'` | 无输出 |

所以下面没有“自己游玩截下来”的图。

## 可用清单（2 张）

两张都来自 ConcernedApe 官方 press 页的原图，不是搜索缩略图。ego TaskSpace `114` 打开了来源页和原图 URL，浏览器解码尺寸都是 1920×1080。文件字节数与 press zip 里未压缩条目一致。

许可：`https://www.stardewvalley.net/press/` 正文约 4672 字，检索 license、permission、copyright、may use、editorial 没有命中。页面只把这些图放在 Images，并提供 “Download all screenshots & photos as .zip”。不能写成 CC，也不能写成已经授权本站转载。状态：待核实。作者/发布者按该页 Factsheet：Developer 与 Publisher 都是 ConcernedApe。

### 1. 封面，兼第 1 节“人站在成熟作物旁边”

- 文件：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-farm-evening.png`
- 来源页：`https://www.stardewvalley.net/press/#press_images`
- 文件 URL：`https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png`
- 同包：`presskit/Stardew Valley/images/images.zip` 内 `farm_evening_1920x1080.png`，未压缩 565489 字节
- SHA-256：`7f10276f5cb0ebbbc36a5133b4fa217c24fa89f61b21c1e15d082cbbac523496`
- 尺寸 / 大小：1920×1080 PNG，565489 字节
- 对应正文：封面；英文锁稿 “How to Harvest Standard Crops by Hand” 开头。画面是人在田埂上，旁边是成片橙色南瓜形成熟作物。
- 能认出：成熟的南瓜形作物；两名玩家在田里或田边；南瓜右侧和画面右侧是木制棚架，棚架上有藤蔓，行间是土路。
- 不能当成：右键采摘的那一帧、挥镰刀、防风草、3×3 巨型作物。南瓜是多株普通南瓜，不是一棵巨型南瓜。
- ego 在原图 URL 上画到 canvas 后读到的像素：`(852,220)` = rgb(195,119,59)，落在南瓜块里的橙色；`(993,225)` = rgb(80,216,38)，落在旁边棚架藤的绿色；`(1000,500)` = rgb(179,92,4)，落在田内土路。
- Steam 商店页同一场景的全尺寸 JPEG 是 `ss_f79d2066dfaf32bbe87868d36db4845f771eddbd.1920x1080.jpg`。没有做逐字节比对，不把两份说成同一个文件。选用 press 的 PNG。

### 2. 第 5 节棚架：人必须站在走道上

- 文件：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-multiplayer-2.png`
- 来源页：同上 press Images
- 文件 URL：`https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png`
- 同包未压缩大小：533277 字节，与本地文件一致
- SHA-256：`b34cd47bb2e8fde6cb886154ad4027a63e222f0e29d17bd4d2fbf68d8caf9ab7`
- 尺寸 / 大小：1920×1080 PNG，533277 字节
- 对应正文：英文锁稿 “Navigating Impassable Trellis Crops”。也帮第 1 节看清“人站在作物旁的空地”，但主用途是棚架走道。
- 能认出：高棚架成行，行间有人能站的空地；一名玩家站在棚架行之间；中间是多株分开的橙色南瓜，玩家站在南瓜田角上。
- 不能当成：巨型作物、镰刀收割、防风草、已经核实的采摘动画。左上方有一名玩家举着绿色物体，看不出那是右键收获帧，也不把它写成挥镰。
- 南瓜像素（PIL 在南瓜区域内取样，不是整图乱扫）：`(1196,290)` = rgb(194,110,51)。棚架绿：`(1276,154)` = rgb(59,125,3)。ego 对这张抽的三个点落在土路或墙面，不拿来当南瓜证据；南瓜和藤的证据用上面两个坐标。

`view-proof/` 里的裁切只为辨认画面，不是可发布的新图，也没有拿去改原图。

## 看过但不选用

官方 press zip 共 11 个文件，都已打开原图。除上面 2 张外：

| 文件 | 为什么不选 |
|---|---|
| `farm_day_1920x1080.png` | 真实农场。左侧是木桩加很小的芽，右侧有带橙红色的叶菜，生长阶段混在一起。认不出防风草，也不能把品种写成已核实。人站在幼苗附近，不如傍晚那张能看出成熟作物。 |
| `SDV_iPad_01.png`、`SDV_iPhone_08.png` | 也是真画面，但带手机工具栏。iPhone 工具栏近看是镐、水壶、斧、剑，没有挥向作物的镰刀。 |
| `Mutiplayer_Screenshot1.png` | 钓鱼和池塘，没有作物收获。文件名官方拼写就是 Mutiplayer。 |
| `Multiplayer_Screenshot3.png` | 草地上的聚会，没有作物。 |
| `Multiplayer_Horses.png` | 雪地骑马。 |
| `NightMarket.png`、`sdv_titleart_1920x1080.png`、`sdv_farm_en.png` | 夜市、标题画、Robin 开场对话。`sdv_farm_en.png` 是杂草未开垦，不是收获。 |

Steam 商店页 `https://store.steampowered.com/app/413150/Stardew_Valley/` 上 16 张全尺寸截图已下载到 `inspected-steam/` 并逐张看过。除与 press 重复的白天农场、傍晚农场外，其余是冬天、矿洞、小镇、节日、室内、铁匠铺、钓鱼、火车、在建温室。没有更清楚的收获、镰刀或巨型作物。

Wiki `File:Giant_Pumpkin.png` 与 `File:Giant_Cauliflower.png` 是 96×116 的单株贴图，不是玩家在田里砍巨型作物的画面。ego 打开 `https://stardewvalleywiki.com/File:Giant_Pumpkin.png`，页面写明：copyright © ConcernedApe 2016；这份素材不归 Wiki Terms of Service，但只写 “freely usable on this wiki”。不能当成站外授权。SHA-256：南瓜贴图 `a1e615f072aa7bb97b81a8e78036d2219bd8061788561ba22e48414426caab41`，花椰菜贴图 `279f00160cd3f10b86c01df17f210e3adfc5e86b2f76850cf3bb64896d307d10`。

## 缺口（不要用假图补）

- 成熟防风草：这些公开全尺寸图里认不出来。
- 采摘动作：没有右键或按住行走收获的那一帧。现有图只是人站在作物旁边。
- 镰刀作物：没有羽衣甘蓝、小麦、苋菜被镰刀挥中的画面。
- 巨型作物：没有带斧头的 3×3 实机画面。Wiki 那张只是贴图。
- 本机没有安装好的游戏，不能补自己的截图。

下一班只装配，不要把这 2 张写成“演示了点击收获”或“演示了镰刀”。许可仍是待核实，公开页署名至少要写 ConcernedApe / Stardew Valley press screenshot，并保留来源页。内部路径不要进公开页。
