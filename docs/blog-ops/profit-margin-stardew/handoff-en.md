# PublicBlogHandoff (en) — title_passed, frozen

- type: `PublicBlogHandoff`
- status: **title_passed**; the locked reader body and SEO surface are frozen for later page assembly.
- locale / country: `en` / `US`
- bodyHash: `e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22`
- sourceDraftHash: `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa`
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
  "lockVersion": "2026-09-23-en-profit-margin-stardew-lock-1",
  "locale": "en",
  "country": "US",
  "keyword": "profit margin stardew valley",
  "body": "## What Is Profit Margin in Stardew Valley?\n\nProfit Margin in [Stardew Valley](https://stardewvalleywiki.com/Options) is the game's multiplier for selected item sale prices and seed prices. New farms offer Normal/100%, 75%, 50%, and 25%. Lower settings reduce both selected sale income and listed seed prices; they do not multiply every shop cost, building, upgrade, or quest reward.\n\nThe name can sound like an accounting term, but this setting is not a calculation of net earnings divided by revenue. It changes listed prices inside the game's economy. The useful question is which prices will move, and which costs will stay put when you choose a setting.\n\nYou choose the setting while creating a new farm through the new-game Advanced Options control. Normal leaves the reference prices in place, while 75%, 50%, and 25% make selected sales pay less and selected seeds cost less. That two-sided rule matters more than the percentage label by itself.\n\nBecause the setting changes selected prices on both sides of a transaction, it is better understood as a budget constraint than as a universal discount. A lower value can reduce the amount received for an affected sale and the listed price of a covered seed, while a fixed cost still demands its normal amount. The setting can therefore change how a budget feels without changing every number in the game.\n\n## How the four Profit Margin settings change selected prices\n\nThe four choices are multipliers for the prices covered by the setting. They are not ratings for player skill, and the percentages do not describe the share of profit you keep after expenses.\n\n| Setting | Multiplier reading | What it means for an affected sale or seed price |\n|---|---:|---|\n| Normal / 100% | 1.00× | Uses the normal reference price. |\n| 75% | 0.75× | Uses 75% of the affected price before the game's rounding rule. |\n| 50% | 0.50× | Uses 50% of the affected price before the game's rounding rule. |\n| 25% | 0.25× | Uses 25% of the affected price before the game's rounding rule. |\n\nThe [Stardew Valley Wiki's Options page](https://stardewvalleywiki.com/Options) states that fractional prices are truncated to an integer and never fall below 1g. A result such as 6.25g becomes 6g, not 6.25g. The floor matters for low-value prices, while truncation matters whenever the multiplier does not produce a whole number.\n\nWhen checking a price, first read what is being sold or bought and compare it with the source-backed category list. A crop sale, a Pierre seed, and a named selected Joja price belong to the affected side; a building or tool upgrade does not. Only after that classification should you read Normal/100%, 75%, 50%, or 25% as the multiplier and apply truncation and the 1g floor. Keep the affected amount and the next planned expense separate: a lower sale does not imply a lower building price, and a lower seed price does not imply a lower quest reward. For a quick budget check, compare those two categories instead of treating the percentage as a discount for the whole plan. If the item or service is absent from the named categories, mark it unclassified and stop before estimating from another example; check a current source that names that item or category.\n\n### What does 75% Profit Margin mean?\n\nAt 75%, an affected item or seed uses the 75% setting, then the result follows the integer and 1g rules. It does not mean that every coin you earn is worth 75% or that every purchase costs 75%. The same setting can lower a crop sale and lower a covered seed price while leaving a building, tool upgrade, or quest reward unchanged.\n\nThe two sides are easy to miss when you look only at the sale-box number. A lower margin makes selected sales less valuable, but it also makes selected seeds cheaper. That does not cancel the challenge in a simple one-for-one way, because costs outside the multiplier still have to be paid at their normal values.\n\nOne concrete source example shows why the rounding rule belongs next to the percentage table: the [Multiplayer page](https://stardewvalleywiki.com/Multiplayer) gives Wheat as 6g at 25% instead of 25g. That is a truncated 25% result, not a rule that every item or shop can be inferred from one Wheat price.\n\n## What Profit Margin affects—and what it leaves unchanged\n\nThe setting is easiest to use when you classify a price before planning around it. The [Stardew Valley Wiki's Multiplayer page](https://stardewvalleywiki.com/Multiplayer) lists the affected sale categories and the costs that remain outside the multiplier. It also explains lower margins as an economy rebalance for the productivity of multiple active players.\n\n### Prices that scale\n\nThe affected side includes selected item sales such as crops, forage, minerals, and cooked foods. Pierre's seed prices scale, and the Wiki also names selected Joja prices: Grass Starter, Sugar, Wheat Flour, and Rice. “Selected” is important: the rule is not a license to multiply every number in every shop. Treat the selected Joja list as a narrow category and do not extend its multiplier to a different Joja purchase without source support.\n\n### Costs, shops, and rewards that stay fixed\n\nThe unchanged side includes the Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards. The same source gives Willy's Crab Pots as a boundary example: they remain 1,500g even when income from affected sales is reduced.\n\nUse this matrix as a category check rather than as a second price table:\n\n| Affected by Profit Margin | Not affected by Profit Margin |\n|---|---|\n| Selected item sale prices, including crops, forage, minerals, and cooked foods | Blacksmith prices |\n| Pierre seed prices | Fish Shop prices |\n| Selected Joja prices: Grass Starter, Sugar, Wheat Flour, and Rice | Traveling Cart prices |\n| The Wheat sale example changes from 25g to 6g at 25% | Buildings and tool upgrades |\n|  | Quest gold rewards; Willy's Crab Pots remain 1,500g |\n\nThe practical result is a mixed economy. If your income comes from a covered crop sale, that income is reduced at a lower setting. If your next goal is a building or tool upgrade, the named fixed-cost category does not become 25% cheaper just because your crop sale did. Use the matrix when a price looks surprising, and do not turn the nearest example into a rule for an unnamed category.\n\nRead the matrix item by item when making a budget. A Wheat sale and a Crab Pot purchase can appear in the same plan, but the source examples place them on different sides: the sale example changes at 25%, while the Crab Pot example remains 1,500g. Do not combine them into one discount rate. This boundary lets you compare a changing income amount with a fixed-cost target without claiming that the setting moves both together. For a separate Year 1 income plan, see [How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning](/how-to-earn-money-stardew).\n\n![Diagram showing Stardew Valley Profit Margin prices that scale and shop costs and rewards that stay unchanged](fig-01-price-boundary)\n\n*This diagram separates selected sale and seed prices from categories outside the multiplier. It labels Wheat as 6g at 25% instead of 25g and Willy's Crab Pots as 1,500g, so the examples are not mistaken for a rule covering every shop item.*\n\n## What is the best Profit Margin for a new farm?\n\nThere is no source-backed universal best value. Choose from the farm you are starting, the number of active players, the pace or constraint you actually want, and whether you accept that fixed costs will not drop with every sale price. Normal/100% is the reference economy. A lower value is a deliberate change to selected income and seed prices, not an achievement badge or a measured promise about how many days a run will take.\n\nUse the decision matrix as a lookup, not as a ranking. Before selecting a value, write down who will be active, whether the goal is the reference economy or a tighter constraint, and which upcoming expense matters to the plan. Then classify that expense: a covered sale or seed responds to the setting, while a named fixed category does not. The choice is sound when those inputs describe the experience you want; it is not sound merely because a percentage is popular or sounds moderate.\n\n| Farm situation | Starting choice to consider | Why it fits the decision |\n|---|---|---|\n| First solo farm or a standard solo start | Normal / 100% | Keeps the reference sale and seed prices while you learn the rest of the game. |\n| Co-op farm with several active players | 75%, 50%, or 25%, based on the desired constraint | The Multiplayer page describes lower margins as an economy rebalance for multiple active players. |\n| Experienced players planning a deliberate challenge | 50% or 25% | Makes the selected sale-and-seed economy a visible constraint without treating the percentage as an exact difficulty score. |\n| A group that wants a noticeable but not lowest setting | 75% | A reasonable preference when the group wants a lower setting without choosing the lowest option; it is not a universal recommendation. |\n\n“Best” is a match between the chosen setting and the farm’s stated inputs, not a ranking in which one percentage wins for everyone. The available choices can be organized, but no lookup can supply a goal that the group has not named. If the group cannot say what pressure it wants to feel, it has not supplied enough input to make a best-setting judgment.\n\n### A worked choice for a fixed-cost plan\n\nImagine two experienced players planning an early building purchase while wanting a visible constraint on selected sales. They can list the affected sales they expect to rely on, identify the building as a fixed-cost target, and use that plan as the test: if 75% still leaves the affected-sale budget workable, it may fit; if the constraint is too mild, they can consider a lower value. If a price in the plan cannot be classified from the named categories, they should pause the comparison instead of estimating it from another item. This is a planning scenario, not a measured pacing result, and it does not establish a completion date.\n\nThe word “best” should stay tied to that reasoning. A setting may fit a group's intended constraint and still be a poor fit for a different group with another budget or pace. If the chosen constraint makes the first farm less enjoyable, a later new farm can use a different value; the percentage is a setup choice, not a permanent judgment about player skill.\n\n### Is 75% Profit Margin good?\n\n75% is a reasonable choice when you want a visible economy constraint without selecting the lowest setting. It is good for that purpose only if the reduced selected sale income, cheaper covered seeds, and unchanged fixed costs match your group and desired pace. It is not automatically better for solo play, automatically correct for co-op, or proof that the farm will progress at a specific rate.\n\nBefore confirming a percentage, check the next kind of cost you care about. If it is a crop or covered seed, the setting is relevant. If it is a building, tool upgrade, or quest reward, expect that category to remain outside the multiplier. Then ask whether the lower selected income still produces the pace you want.\n\nThat answer makes 75% a middle option in the lookup, not a promise of middle difficulty. Its effect is defined by the affected price categories; whether it feels mild or tight depends on what the farm sells and which fixed costs the group plans to pay. Use the category boundary and the group's stated constraint instead of reading the label as a prediction.\n\n## Where to choose Profit Margin when starting a new farm\n\nThe public [Stardew Valley Wiki Options page](https://stardewvalleywiki.com/Options) documents the high-level new-game path. Treat the labels and placement below as the documented path, not a promise that every platform and version shows identical wording.\n\n### Open Advanced Options from the new-game setup\n\n1. Start a new farm and open the new-game setup screen.\n2. Open the wrench or Advanced Options control documented for the setup screen.\n3. Find the Profit Margin selector.\n4. Choose Normal/100%, 75%, 50%, or 25%.\n5. Create the farm after checking that the selected value matches the economy you intend to play.\n\nThis path is for a new-farm decision only; it does not establish an existing-farm procedure.\n\nThe important check is the selected value before the farm is created. Read it together with the price boundary above: the choice controls the documented sale and seed categories, while fixed costs and rewards remain outside that multiplier. The menu path tells you where to make the choice; it does not turn the percentage into a universal discount.\n\n![Schematic of the Stardew Valley new-game path to Advanced Options and the Profit Margin selector](fig-02-advanced-options-path)\n\n*This platform-neutral menu-path diagram is not a platform-specific screenshot. It shows New Game → wrench/Advanced Options → Profit Margin → Normal/75%/50%/25% → create the farm, based on the documented path in the Stardew Valley Wiki's Options page.*\n\n### Check the choice before creating the save\n\n- Count the players who will be active in the farm you are creating.\n- Decide whether you want the reference economy, a co-op rebalance, or an intentional challenge.\n- Confirm that you understand which selected sales and seed prices scale and which listed costs and rewards stay fixed.\n\nUse all three answers together rather than treating one label as a recommendation. If the player context, intended constraint, and price categories agree, the new-farm choice is ready to confirm.\n\nIf the wrench or Advanced Options labels differ from the documented path on your platform or version, pause and check current, platform-specific guidance rather than guessing at an unsupported procedure. If the menu matches and the selected value fits the intended economy, create the farm with that choice.\n\n## Sources\n\nChecked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.\n\n- [Stardew Valley Wiki: Options](https://stardewvalleywiki.com/Options) — the four values, selected sale and seed price multiplier, integer truncation and 1g floor, and the documented new-game Advanced Options path.\n- [Stardew Valley Wiki: Multiplayer](https://stardewvalleywiki.com/Multiplayer) — affected sale categories, scaled seed and selected Joja prices, unchanged categories and rewards, Wheat and Crab Pot examples, and the multiplayer rebalance explanation.\n",
  "bodyHash": "e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 14526,
  "seo": {
    "title": "Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change",
    "h1": "Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change",
    "description": "Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.",
    "slug": "profit-margin-stardew",
    "faq": null,
    "schema": {
      "@type": "Article",
      "doNotEmitFAQPage": true
    },
    "og": {
      "title": "Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change",
      "description": "Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.",
      "openGraphType": "article",
      "image": "/blog/profit-margin-stardew-cover.webp"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-options",
      "label": "Stardew Valley Wiki: Options",
      "url": "https://stardewvalleywiki.com/Options",
      "appliesTo": [
        {
          "quote": "Profit Margin in [Stardew Valley](https://stardewvalleywiki.com/Options) is the game's multiplier for selected item sale prices and seed prices.",
          "occurrence": 1
        },
        {
          "quote": "New farms offer Normal/100%, 75%, 50%, and 25%.",
          "occurrence": 1
        },
        {
          "quote": "The [Stardew Valley Wiki's Options page](https://stardewvalleywiki.com/Options) states that fractional prices are truncated to an integer and never fall below 1g.",
          "occurrence": 1
        },
        {
          "quote": "A result such as 6.25g becomes 6g, not 6.25g.",
          "occurrence": 1
        },
        {
          "quote": "The public [Stardew Valley Wiki Options page](https://stardewvalleywiki.com/Options) documents the high-level new-game path.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-multiplayer",
      "label": "Stardew Valley Wiki: Multiplayer",
      "url": "https://stardewvalleywiki.com/Multiplayer",
      "appliesTo": [
        {
          "quote": "One concrete source example shows why the rounding rule belongs next to the percentage table: the [Multiplayer page](https://stardewvalleywiki.com/Multiplayer) gives Wheat as 6g at 25% instead of 25g.",
          "occurrence": 1
        },
        {
          "quote": "The [Stardew Valley Wiki's Multiplayer page](https://stardewvalleywiki.com/Multiplayer) lists the affected sale categories and the costs that remain outside the multiplier.",
          "occurrence": 1
        },
        {
          "quote": "The affected side includes selected item sales such as crops, forage, minerals, and cooked foods.",
          "occurrence": 1
        },
        {
          "quote": "The unchanged side includes the Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards.",
          "occurrence": 1
        },
        {
          "quote": "The same source gives Willy's Crab Pots as a boundary example: they remain 1,500g even when income from affected sales is reduced.",
          "occurrence": 1
        },
        {
          "quote": "The Multiplayer page describes lower margins as an economy rebalance for multiple active players.",
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
      "author": "Stardew Valley Planner Team",
      "topic": "Stardew Valley Guides",
      "featured": true,
      "readTimeMinutes": 10,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "articleModuleExport": "ProfitMarginStardewEnglishArticle",
      "articleModulePath": "src/blog/articles/profit-margin-stardew.en.tsx",
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
      "itemOrder": [
        "wiki-options",
        "wiki-multiplayer"
      ],
      "items": [
        {
          "id": "wiki-options",
          "label": "Stardew Valley Wiki: Options",
          "href": "https://stardewvalleywiki.com/Options"
        },
        {
          "id": "wiki-multiplayer",
          "label": "Stardew Valley Wiki: Multiplayer",
          "href": "https://stardewvalleywiki.com/Multiplayer"
        }
      ]
    },
    "faq": null,
    "visibleFaqAndSourcesRequired": true,
    "jsonLdType": "Article",
    "notFaqPage": true,
    "lockedAnglePhrases": [
      "selected sale and seed prices",
      "Wheat 25g -> 6g at 25%",
      "Willy's Crab Pots remain 1,500g"
    ],
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/how-to-earn-money-stardew",
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
      "alt": "Original local illustration of an outdoor Stardew Valley field with cranberry rows, a pumpkin patch, and a grape trellis; it is not a game screenshot.",
      "caption": "Original local artwork for the Profit Margin article cover; it is not a copied web asset or a game screenshot.",
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
        "placement": "After the price matrix and the paragraph comparing Wheat with Willy's Crab Pots, before the H2 “What is the best Profit Margin for a new farm?”",
        "role": "Inline controlled diagram serving a specific reader decision.",
        "type": "Original local controlled artwork; not a screenshot, copied web asset, or invented game UI.",
        "alt": "Diagram showing Stardew Valley Profit Margin prices that scale and shop costs and rewards that stay unchanged",
        "caption": "This diagram separates selected sale and seed prices from categories outside the multiplier. It labels Wheat as 6g at 25% instead of 25g and Willy's Crab Pots as 1,500g, so the examples are not mistaken for a rule covering every shop item.",
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
        "placement": "After the new-game setup steps and before the H3 “Check the choice before creating the save.”",
        "role": "Inline controlled diagram serving a specific reader decision.",
        "type": "Original local controlled artwork; not a screenshot, copied web asset, or invented game UI.",
        "alt": "Schematic of the Stardew Valley new-game path to Advanced Options and the Profit Margin selector",
        "caption": "This platform-neutral menu-path diagram is not a platform-specific screenshot. It shows New Game → wrench/Advanced Options → Profit Margin → Normal/75%/50%/25% → create the farm, based on the documented path in the Stardew Valley Wiki's Options page.",
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
    "bodyHash": "e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22",
    "sourceDraftHash": "ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa",
    "length": {
      "locale": "en",
      "mechanical_units": 2091,
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
