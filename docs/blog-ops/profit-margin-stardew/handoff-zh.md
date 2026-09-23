# PublicBlogHandoff (zh-CN) — title_passed, frozen

- type: `PublicBlogHandoff`
- status: **title_passed**; the locked reader body and SEO surface are frozen for later page assembly.
- locale / country: `zh-CN` / `CN`
- bodyHash: `1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881`
- sourceDraftHash: `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`
- body is the exact reader markdown after removing only the first Markdown H1 line and its immediately following blank line; no body copy was rewritten.
- Schema is Article; FAQPage is explicitly disallowed. The page shell owns the single H1 and the article module must not render another one.
- Cover and both inline figures are original local controlled artwork, each bound to a WebP/AVIF pair.

JSON below is the handoff object. `body` is the locked reader markdown in NFC, UTF-8, LF bytes.

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-23-zh-profit-margin-stardew-lock-1",
  "locale": "zh-CN",
  "country": "CN",
  "keyword": "profit margin stardew valley",
  "body": "## 星露谷物语的 Profit Margin（利润率）到底改变什么？\n\n在 Stardew Valley 里，`Profit Margin`（利润率）是新农场使用的价格倍率设置：普通/100%、75%、50%、25% 会调整来源明确列出的出售物品价格和种子价格。[中文选项页](https://zh.stardewvalleywiki.com/选项)中的“利润率”不是现实会计里的净利润比例，也不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化；[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)列明了这些非全局边界。\n\n公开 Multiplayer 说明把 25%/50%/75% 选项放在新建多人存档流程中；想独自游玩非 100% 档位时，应先从标题界面的“合作”（`Host New Farm`）创建多人存档，再由房主单独游玩该存档。\n\n把它理解成“哪些价格会按档位缩放”，比理解成“整个农场经济统一打折”更准确。低档位会收紧受影响的出售收入，同时改变列出的种子和 Joja 商品价格；固定费用与奖励仍按各自边界判断。\n\n## 100%、75%、50%、25% 分别代表什么？\n\n| 档位 | 倍率如何读 | 选择时意味着什么 |\n| --- | --- | --- |\n| 普通/Normal（100%） | 受影响价格按标准倍率计算 | 以游戏默认经济作为参照，适合不想额外收紧出售收入的开局。 |\n| 75% | 受影响价格按四分之三计算 | 受影响的卖价与列出的种子价格都会降低，但仍保留标准玩法的框架。 |\n| 50% | 受影响价格按一半计算 | 需要更仔细地安排受影响收入与种子支出的关系，适合主动增加经济约束的存档。 |\n| 25% | 受影响价格按四分之一计算 | 这是明显收紧经济的挑战取向；固定类别不会因此一起变成四分之一。 |\n\n英文 [Options](https://stardewvalleywiki.com/Options) 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。\n\n### 75% 利润率是什么意思？\n\n75%表示属于这套规则的价格按0.75倍计算，不是“你能保留75%的净利润”。受影响的出售物品和列出的种子会按此档位处理；建筑、升级或奖励不能用这个数字反推。\n\n## 哪些价格会随利润率变化，哪些不会？\n\n判断一个数字时，先看它属于下表哪一列，再看当前档位；[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)给出这份影响范围清单；“大多数”和“指定商品”不能扩写成所有商店统一缩放。\n\n| 受 Profit Margin 影响的范围 | 不受 Profit Margin 影响的范围 |\n| --- | --- |\n| 来源列举的多数出售物品，例如作物、采集物、矿物和烹饪食物；Pierre（皮埃尔）的种子；Joja（乔家）的 `Grass Starter`（用于长草的商品）、`Sugar`（糖）、`Wheat Flour`（小麦粉）和 `Rice`（大米）等指定商品。 | 铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。 |\n\n### 会变化的范围：出售物品、种子和指定商品\n\n这里的“出售物品”应按页面列出的范围理解，不要把每个能放进出货箱的对象都归入同一结论。`Wheat`（小麦）能直观看出取整规则：普通档位示例价格为25g，25%档位最终显示6g，而不是保留6.25g。低档位和整数截断都会影响显示值。\n\n种子要单独记住。降低档位不只改变卖出作物的收入，Pierre 的种子价格也在受影响范围内；页面点名的 Joja 商品会随档位缩放。其他购买项目仍要回到清单判断。\n\n### 不会变化的范围：部分商店商品、建筑、工具升级和任务奖励\n\n铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励被列为不受影响的类别。Willy（威利）的 `Crab Pots`（蟹笼）是具体对照：页面示例显示它仍为1,500g。它与 Wheat 一起说明了固定费用和受影响出售物品的差异。\n\n### 看到一个价格没有按预期变化时先检查什么？\n\n若价格没有按预期变化，先对照上表。已列为不受影响的类别不缩放，并非设置失效；不在清单中的价格先标记为待核验，不用另一个商品替它下结论。\n\n> **图位：fig-01-price-boundary**\n>\n> **图片替代文本（alt）：** 星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。\n>\n> **图注：** 这张示意图把会缩放的价格与明确固定的类别分开，并标出 Wheat 在普通档位为 25g、25% 档位为 6g，以及 Willy 的 Crab Pots 仍为 1,500g；它是价格边界图，不是某个平台的游戏截图。\n\n## 单人、多人和挑战存档怎么选利润率？\n\n没有公开依据证明某个百分比对所有玩家都普遍最佳。先看玩家人数，再看期望节奏和对受影响出售收入变紧的接受度。低档位会降低列出的种子价格，但来源明确列出的固定类别和任务奖励不缩放；选择的是约束组合，不是单独的难度分数。\n\n| 场景或目标 | 可以先考虑的档位 | 需要接受的取舍 |\n| --- | --- | --- |\n| 单人新农场，想先熟悉标准经济 | 普通/100% | 以默认价格作为预算参照，之后再决定是否主动增加限制。 |\n| 多人协作，想抵消更高的共同生产力 | 75% 或 50% | 人数、分工和期望节奏不同，不能把其中一个档位当成所有多人存档的统一答案。 |\n| 有意进行经济挑战 | 25% | 受影响出售收入更紧，固定类别仍在，需要接受更紧的预算约束。 |\n\n### 单人新农场：以普通（100%）作为标准起点\n\n如果你想先认识 Stardew Valley 的默认价格关系，普通/100%是清楚的基准。它不是“对每个人最好”的证明；想增加限制时，75%、50%或25%都可以，但理由应是期望节奏和约束，而不是未经验证的固定进度目标。\n\n### 多人协作：根据人数和期望约束考虑降低档位\n\n多人页面解释，降低 Profit Margin 可以抵消活跃玩家增加生产力带来的经济优势。[Multiplayer 的相关说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)支持的是再平衡思路，不是“几个人必须选多少”的表格。具体档位仍取决于团队分工和期望节奏。讨论时先区分“想抵消共同生产力”与“想保持普通价格”：前者可以比较75%和50%，后者保留普通/100%更直接。不要由人数推导固定收益或完成时间。\n\n如果你还在安排前期现金顺序，可以阅读[第一年赚钱与预算指南](/zh/how-to-earn-money-stardew)；那篇文章解决预算行动，本页只说明 Profit Margin 改变哪些价格前提。\n\n### 挑战玩法：25% 利润率是有意收紧经济的选择\n\n25%适合把“资金更紧”本身当成玩法目标的人。它不是默认值，也不能推出一定慢几倍、少赚固定金币或在某年完成目标；选择前应确认你愿意承受较低出售收入。\n\n### 75% 利润率适合吗？\n\n若普通档位太宽松、50%又过紧，可先考虑75%；比较时同时看受影响出售收入和种子支出，不要只盯卖价。这是档位间的取舍，不是由玩家人数决定的标准答案。\n\n### 25% 利润率适合什么情况？\n\n若考虑25%，创建前用上文的价格边界检查预算：受影响收入会收紧，已列出的固定类别不会同步下降。\n\n## 新农场在哪里设置 Profit Margin？\n\n公开资料给出的高层路径分两支：**100%** 可以从 `New Game` 进入角色创建界面的扳手/`Advanced Options` 并创建普通新农场；**75%/50%/25%** 应从标题画面的“合作”（`Host New Farm`）进入多人角色创建界面，打开扳手/`Advanced Options` → `Profit Margin`，选择档位并创建多人存档；房主随后可以单独游玩该存档。[中文选项页](https://zh.stardewvalleywiki.com/选项)、[Options](https://stardewvalleywiki.com/Options)、[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)和 [Getting Started](https://stardewvalleywiki.com/Getting_Started)共同支持这条平台中立路径。\n\n### 从新游戏或合作创建进入高级游戏设置\n\n1. 要使用普通/100%，从标题画面选择 `New Game`（新建游戏），进入角色创建界面；这是普通单人新农场的起点。\n2. 要使用 75%/50%/25%，从标题画面选择“合作”（`Host New Farm`），进入多人角色创建界面，再打开角色创建界面的扳手，进入 `Advanced Options`。\n3. 在对应的 `Advanced Options` 中找到 `Profit Margin`：普通/100%可按 `New Game` 路径设置；非 100% 必须在多人创建流程中选择 75%/50%/25%。\n4. 按所选分支创建农场；非 100% 要创建多人存档，房主随后可以单独游玩这个已创建的多人存档。\n\n这是一条根据公开 Wiki 整理的平台中立路径，不是逐平台截图实测。PC、主机和移动端的按钮位置、标签或版本行为不应被写成完全一致；如果界面文字不同，应以当前平台和版本说明为准。\n\n> **图位：fig-02-advanced-options-path**\n>\n> **图片替代文本（alt）：** 星露谷物语平台中立的 Profit Margin 流程示意：100% 从 `New Game` 进入 `Advanced Options`；非 100% 先从标题画面的“合作”/`Host New Farm` 进入多人创建流程，在 `Profit Margin` 中选择档位并创建多人存档。\n>\n> **图注：** 这是平台中立的两条路径示意：100% 为 `New Game` → `Advanced Options`；非 100% 为“合作”/`Host New Farm` → 多人角色创建 → `Profit Margin` → 创建多人存档。依据公开 Options、Multiplayer（Profit margins）与 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。\n\n### 如果找不到利润率选项，如何安全处理？\n\n先区分目标档位：普通/100%仍按 `New Game` 的高级设置路径操作；如果想单人使用非 100%，应返回标题画面的“合作”/`Host New Farm`，在多人创建流程的 `Profit Margin` 中选择档位并创建多人存档，再由房主单独游玩该存档。仍按当前平台、版本和公开设置说明检查扳手菜单；如果平台或版本细节未知，停在这条文档化路径上，不要猜测标签位置。\n\n### 创建农场前的三项检查\n\n- 你是否选对了单人或多人玩家人数和创建路径：100%走 `New Game`；75%/50%/25%先从“合作”/`Host New Farm`进入多人创建流程、创建多人存档，并理解多人生产力会影响你对约束的判断？\n- 你想要的是普通节奏、较紧的经济，还是主动挑战？这个目标是否真的对应你选择的档位？\n- 你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？\n\n三项都确认后，再按所选分支创建农场；非 100%应先通过“合作”/`Host New Farm`创建多人存档，房主随后可以单独游玩该存档。这不是现实商业百分比，而是一组影响部分价格、同时保留固定边界的游戏经济前提。\n\n## Sources\n\nChecked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.\n\nThis review also checked the Chinese Options and Getting Started pages listed below.\n\n- [Stardew Valley Wiki：选项](https://zh.stardewvalleywiki.com/选项)：中文高级游戏设置、利润率档位与新游戏入口。\n- [Stardew Valley Wiki：Options](https://stardewvalleywiki.com/Options)：Profit Margin 的价格倍数、种子价格、整数截断与 1g 下限。\n- [Stardew Valley Wiki：Multiplayer — Profit margins](https://stardewvalleywiki.com/Multiplayer#Profit_margins)：多人再平衡、受影响范围与明确不受影响类别。\n- [Stardew Valley Wiki：Getting Started](https://stardewvalleywiki.com/Getting_Started)：角色创建界面的高级选项路径。\n",
  "bodyHash": "1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 12342,
  "seo": {
    "title": "Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选",
    "h1": "Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选",
    "description": "Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。",
    "slug": "profit-margin-stardew",
    "faq": null,
    "schema": {
      "@type": "Article",
      "doNotEmitFAQPage": true
    },
    "og": {
      "title": "Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选",
      "description": "Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。",
      "openGraphType": "article",
      "image": "/blog/profit-margin-stardew-cover.webp"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-options-zh",
      "label": "Stardew Valley Wiki：选项",
      "url": "https://zh.stardewvalleywiki.com/选项",
      "appliesTo": [
        {
          "quote": "在 Stardew Valley 里，`Profit Margin`（利润率）是新农场使用的价格倍率设置：普通/100%、75%、50%、25% 会调整来源明确列出的出售物品价格和种子价格。",
          "occurrence": 1
        },
        {
          "quote": "[中文选项页](https://zh.stardewvalleywiki.com/选项)中的“利润率”不是现实会计里的净利润比例，也不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化；",
          "occurrence": 1
        },
        {
          "quote": "在 Stardew Valley 里，`Profit Margin`（利润率）是新农场使用的价格倍率设置：普通/100%、75%、50%、25% 会调整来源明确列出的出售物品价格和种子价格。[中文选项页](https://zh.stardewvalleywiki.com/选项)中的“利润率”不是现实会计里的净利润比例，也不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化；",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-options",
      "label": "Stardew Valley Wiki：Options",
      "url": "https://stardewvalleywiki.com/Options",
      "appliesTo": [
        {
          "quote": "英文 [Options](https://stardewvalleywiki.com/Options) 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。",
          "occurrence": 1
        },
        {
          "quote": "计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。",
          "occurrence": 1
        },
        {
          "quote": "`Wheat`（小麦）能直观看出取整规则：普通档位示例价格为25g，25%档位最终显示6g，而不是保留6.25g。",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-multiplayer",
      "label": "Stardew Valley Wiki：Multiplayer — Profit margins",
      "url": "https://stardewvalleywiki.com/Multiplayer#Profit_margins",
      "appliesTo": [
        {
          "quote": "[Multiplayer 的 Profit margins 说明](https://stardewvalleywiki.com/Multiplayer#Profit_margins)列明了这些非全局边界。",
          "occurrence": 1
        },
        {
          "quote": "公开 Multiplayer 说明把 25%/50%/75% 选项放在新建多人存档流程中；想独自游玩非 100% 档位时，应先从标题界面的“合作”（`Host New Farm`）创建多人存档，再由房主单独游玩该存档。",
          "occurrence": 1
        },
        {
          "quote": "来源列举的多数出售物品，例如作物、采集物、矿物和烹饪食物；Pierre（皮埃尔）的种子；Joja（乔家）的 `Grass Starter`（用于长草的商品）、`Sugar`（糖）、`Wheat Flour`（小麦粉）和 `Rice`（大米）等指定商品。",
          "occurrence": 1
        },
        {
          "quote": "铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励被列为不受影响的类别。Willy（威利）的 `Crab Pots`（蟹笼）是具体对照：页面示例显示它仍为1,500g。",
          "occurrence": 1
        },
        {
          "quote": "多人页面解释，降低 Profit Margin 可以抵消活跃玩家增加生产力带来的经济优势。",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-getting-started",
      "label": "Stardew Valley Wiki：Getting Started",
      "url": "https://stardewvalleywiki.com/Getting_Started",
      "appliesTo": [
        {
          "quote": "公开资料给出的高层路径分两支：**100%** 可以从 `New Game` 进入角色创建界面的扳手/`Advanced Options` 并创建普通新农场；**75%/50%/25%** 应从标题画面的“合作”（`Host New Farm`）进入多人角色创建界面，打开扳手/`Advanced Options` → `Profit Margin`，选择档位并创建多人存档；房主随后可以单独游玩该存档。",
          "occurrence": 1
        },
        {
          "quote": "这是一条根据公开 Wiki 整理的平台中立路径，不是逐平台截图实测。PC、主机和移动端的按钮位置、标签或版本行为不应被写成完全一致；如果界面文字不同，应以当前平台和版本说明为准。",
          "occurrence": 1
        }
      ]
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "profit-margin-stardew",
      "enPath": "/profit-margin-stardew",
      "zhPath": "/zh/profit-margin-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "matchesZhSlug": true,
      "doNotOccupy": []
    },
    "registry": {
      "titleEqualsH1": true,
      "author": "星露谷规划器团队",
      "topic": "星露谷物语指南",
      "featured": true,
      "readTimeMinutes": 10,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "articleModuleExport": "ProfitMarginStardewChineseArticle",
      "articleModulePath": "src/blog/articles/profit-margin-stardew.zh.tsx",
      "headingLevelMap": {
        "lockedAtx##": "h2",
        "lockedAtx###": "h3",
        "note": "The locked body starts with H2 and the article module must not render a page-level H1."
      }
    },
    "sources": {
      "renderFromLockedBody": true,
      "heading": "Sources",
      "checkedLabel": "Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.",
      "additionalCheckedLabel": "This review also checked the Chinese Options and Getting Started pages listed below.",
      "itemOrder": [
        "wiki-options-zh",
        "wiki-options",
        "wiki-multiplayer",
        "wiki-getting-started"
      ],
      "items": [
        {
          "id": "wiki-options-zh",
          "label": "Stardew Valley Wiki：选项",
          "href": "https://zh.stardewvalleywiki.com/选项"
        },
        {
          "id": "wiki-options",
          "label": "Stardew Valley Wiki：Options",
          "href": "https://stardewvalleywiki.com/Options"
        },
        {
          "id": "wiki-multiplayer",
          "label": "Stardew Valley Wiki：Multiplayer — Profit margins",
          "href": "https://stardewvalleywiki.com/Multiplayer#Profit_margins"
        },
        {
          "id": "wiki-getting-started",
          "label": "Stardew Valley Wiki：Getting Started",
          "href": "https://stardewvalleywiki.com/Getting_Started"
        }
      ]
    },
    "faq": null,
    "visibleFaqAndSourcesRequired": true,
    "jsonLdType": "Article",
    "notFaqPage": true,
    "lockedAnglePhrases": [
      "会缩放的出售物品、Pierre 种子和指定 Joja 商品",
      "Wheat 在普通档位为 25g、25% 档位为 6g",
      "Willy 的 Crab Pots 仍为 1,500g"
    ],
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/zh/how-to-earn-money-stardew",
          "className": "blog-planner-link"
        }
      ],
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/profit-margin-stardew-cover.webp",
      "workingFile": "public/blog/profit-margin-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures.",
      "alt": "原创本地插画：星露谷物语室外田地里有蔓越莓行、南瓜畦和葡萄架，不是游戏截图。",
      "caption": "利润率文章的原创本地封面插画，不是复制的网页素材或游戏截图。",
      "altStatus": "verified",
      "rightsStatus": "original_local_artwork",
      "usageRights": "Created locally for this article; no copied web asset or game screenshot used."
    },
    "figures": [
      {
        "id": "fig-01-price-boundary",
        "assemblyToken": "fig-01-price-boundary",
        "workingFile": "public/blog/illustrations/profit-margin-stardew-price-boundary.webp",
        "src": "/blog/illustrations/profit-margin-stardew-price-boundary.webp",
        "placement": "价格边界矩阵及检查段落之后、H2「单人、多人和挑战存档怎么选利润率？」之前。",
        "role": "Inline controlled diagram serving a specific reader decision.",
        "type": "Original local controlled artwork; not a screenshot, copied web asset, or invented game UI.",
        "alt": "星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。",
        "caption": "这张示意图把会缩放的价格与明确固定的类别分开，并标出 Wheat 在普通档位为 25g、25% 档位为 6g，以及 Willy 的 Crab Pots 仍为 1,500g；它是价格边界图，不是某个平台的游戏截图。",
        "width": 1672,
        "height": 941,
        "loading": "lazy",
        "format": "VP8 WebP",
        "rightsStatus": "original_local_artwork",
        "usageRights": "Created locally for this article; no copied web asset or game screenshot used."
      },
      {
        "id": "fig-02-advanced-options-path",
        "assemblyToken": "fig-02-advanced-options-path",
        "workingFile": "public/blog/illustrations/profit-margin-stardew-advanced-options.webp",
        "src": "/blog/illustrations/profit-margin-stardew-advanced-options.webp",
        "placement": "H3「从新游戏或合作创建进入高级游戏设置」之后、H3「如果找不到利润率选项，如何安全处理？」之前。",
        "role": "Inline controlled diagram serving a specific reader decision.",
        "type": "Original local controlled artwork; not a screenshot, copied web asset, or invented game UI.",
        "alt": "星露谷物语平台中立的 Profit Margin 流程示意：100% 从 `New Game` 进入 `Advanced Options`；非 100% 先从标题画面的“合作”/`Host New Farm` 进入多人创建流程，在 `Profit Margin` 中选择档位并创建多人存档。",
        "caption": "这是平台中立的两条路径示意：100% 为 `New Game` → `Advanced Options`；非 100% 为“合作”/`Host New Farm` → 多人角色创建 → `Profit Margin` → 创建多人存档。依据公开 Options、Multiplayer（Profit margins）与 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。",
        "width": 1672,
        "height": 941,
        "loading": "lazy",
        "format": "VP8 WebP",
        "rightsStatus": "original_local_artwork",
        "usageRights": "Created locally for this article; no copied web asset or game screenshot used."
      }
    ],
    "originalLocalArtworkRequired": true,
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881",
    "sourceDraftHash": "0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699",
    "length": {
      "locale": "zh-CN",
      "mechanical_units": 2295,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "userReview": "not_started",
    "frozen": true,
    "status": "title_passed",
    "freezePublicBlogHandoff": true
  }
}
```
