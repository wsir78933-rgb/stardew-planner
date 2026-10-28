import { publicLocales, type PublicLocale } from "./public-locale";
import {
  createCropGrowthToolHref,
  createCropProfitHref,
} from "../tools-pages/planting-tool-href";

export type PlantingToolGuideCopy = Readonly<{
  overview: Readonly<{
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    aside: string;
    priceSource?: Readonly<{
      beforeLink: string;
      linkLabel: string;
      afterLink: string;
    }>;
    byline?: Readonly<{
      author: string;
      dateTime: string;
      dateLabel: string;
    }>;
  }>;
  caseStudy: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    focusTitle: string;
    focusItems: readonly [string, string, string, string, string];
    caption: string;
  }>;
  features: Readonly<{
    eyebrow: string;
    title: string;
    items: readonly Readonly<{
      eyebrow: string;
      number: string;
      title: string;
      body: string;
    }>[];
  }>;
  featureIntro: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ title: string; body: string }>[];
  }>;
  howToUse: Readonly<{
    eyebrow: string;
    title: string;
    steps: readonly Readonly<{ number: string; title: string; body: string }>[];
    actionLabel: string;
  }>;
  whyChoose: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ number: string; title: string; body: string }>[];
  }>;
  comparison: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    cornerLabel: string;
    products: readonly Readonly<{ name: string; href: string }>[];
    rows: readonly Readonly<{ label: string; values: readonly string[] }>[];
    sources: readonly Readonly<{ label: string; href: string }>[];
    checkedOn: string;
    affiliation: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ question: string; answer: string }>[];
  }>;
  closing: Readonly<{
    title: string;
    description: string;
    actionLabel: string;
  }>;
}>;

export type PlantingToolGuideId = "crop-profit" | "crop-growth";

const plantingToolGuideCopyByLocale: Readonly<
  Record<PublicLocale, Readonly<Record<PlantingToolGuideId, PlantingToolGuideCopy>>>
> = {
  en: {
    "crop-profit": {
      overview: {
        eyebrow: "Plan this season's return",
        title: "What should you plant to make this season count?",
        paragraphs: [
          "Before buying seeds, you want to know how many harvests still fit and what remains after costs. The Stardew Valley Crop Profit Calculator ranks purchasable crops for your season, so you can compare a planting plan instead of sale prices alone.",
          "The Stardew Valley Crop Profit Calculator estimates returns from planting day, seed source, profession, Speed-Gro, and fertilizer cost. Machine batches are scheduled by count, processing time, and deadline.",
          "The Stardew Valley Crop Profit Calculator reports expected units, net gold, daily gold per tile, and best single route. It uses normal-quality base prices and average yields; random bonuses may change results.",
        ],
        aside: "Harvests stop at the season boundary; processing can continue through your selected deadline.",
        priceSource: {
          beforeLink: "Prices come from this site's bundled Stardew Valley 1.6.15 game data (Crops.json). Crop reference: ",
          linkLabel: "Stardew Valley Wiki",
          afterLink: ".",
        },
        byline: {
          author: "Stardew Valley Planner Team",
          dateTime: "2026-10-28",
          dateLabel: "October 28, 2026",
        },
      },
      caseStudy: {
        eyebrow: "Case study",
        title: "Compare this season’s crop returns",
        description: "Set a season, seed source, and planting day to compare net returns after seed and fertilizer costs.",
        focusTitle: "What the example shows",
        focusItems: [
          "Crops available for the selected season",
          "Expected harvests and net gold after costs",
          "Compare raw sale and processing routes",
          "Check batches completed by the deadline",
          "Unprocessed crops retain raw-sale value",
        ],
        caption: "Example interface; results vary with crop and settings.",
      },
      features: {
        eyebrow: "What you can compare",
        title: "Plan with the costs and limits you selected",
        items: [
          {
            eyebrow: "Narrow the choice",
            number: "01",
            title: "Rank crops you can still grow",
            body: "The Stardew Valley Crop Profit Calculator ranks crops available from your seed source that can still harvest this season.",
          },
          {
            eyebrow: "Compare net returns",
            number: "02",
            title: "Include seed and fertilizer costs",
            body: "The Stardew Valley Crop Profit Calculator subtracts seed purchases and per-tile fertilizer cost from expected returns.",
          },
          {
            eyebrow: "Check machine capacity",
            number: "03",
            title: "Schedule batches through your deadline",
            body: "Schedule harvest arrivals against machine counts, batch sizes, processing durations, and the selected deadline.",
          },
          {
            eyebrow: "Compare routes",
            number: "04",
            title: "See processed and raw-sale units",
            body: "The Stardew Valley Crop Profit Calculator compares raw, Keg, Jar, and Dehydrator; unfinished units sell at raw value.",
          },
          {
            eyebrow: "Plan the next step",
            number: "05",
            title: "Turn a ranking into a plan",
            body: "The Stardew Valley Crop Profit Calculator reports net gold, gold per tile per day, and raw-sale remainder; copy five crops or import a harvest.",
          },
        ],
      },
      featureIntro: {
        eyebrow: "Features",
        title: "From seasonal crop returns to a harvest plan",
        description: "Stardew Valley Crop Profit Calculator ranks seasonal returns against machine limits and your deadline.",
        items: [
          {
            title: "Season crop ranking",
            body: "Compare purchasable crops for this season and planting date, with harvest counts and expected units.",
          },
          {
            title: "Net results after costs",
            body: "Seed cost follows your source, planting count, and tile count; fertilizer cost is charged once per tile.",
          },
          {
            title: "Machine time to deadline",
            body: "Schedule batches by harvest day, machine count, batch size, and processing days; see finished units and raw-sale remainder.",
          },
          {
            title: "Plan beyond the ranking",
            body: "Your crop choice connects to its growth calendar and a local harvest plan; the top five results can be copied.",
          },
        ],
      },
      howToUse: {
        eyebrow: "Three simple steps",
        title: "From planting setup to seasonal profit",
        steps: [
          {
            number: "01",
            title: "Choose a season and planting setup",
            body: "Set planting details in the Stardew Valley Crop Profit Calculator.",
          },
          {
            number: "02",
            title: "Add costs and machine capacity",
            body: "Select a profession and Speed-Gro, enter fertilizer cost per tile, then set machine counts and the processing deadline.",
          },
          {
            number: "03",
            title: "Compare crops and continue planning",
            body: "Review crop routes, then open a growth calendar, copy the top five, or import a harvest with the Stardew Valley Crop Profit Calculator.",
          },
        ],
        actionLabel: "Calculate crop profit",
      },
      whyChoose: {
        eyebrow: "Why plan this way",
        title: "Match the estimate to your actual setup",
        description: "The Stardew Valley Crop Profit Calculator weighs machine capacity and deadlines against expected crop returns.",
        items: [
          {
            number: "01",
            title: "See net returns after costs",
            body: "The Stardew Valley Crop Profit Calculator shows net gold after seed and fertilizer costs.",
          },
          {
            number: "02",
            title: "Account for machine time",
            body: "Machine counts, batch sizes, and processing days are checked against your deadline.",
          },
          {
            number: "03",
            title: "Processed and raw units",
            body: "Each route shows finished units and the remainder valued as raw crops.",
          },
          {
            number: "04",
            title: "Keep the season in view",
            body: "Only in-season harvests count; daily value uses the remaining planting days.",
          },
          {
            number: "05",
            title: "Continue the plan",
            body: "Continue from the Stardew Valley Crop Profit Calculator to the growth calendar, local plan, or copied top five.",
          },
        ],
      },
      comparison: {
        eyebrow: "Bring machine time into crop profit",
        title: "Stardew Valley Crop Profit Calculator vs. Stardew Profits vs. StardewProfit",
        description: "The Stardew Valley Crop Profit Calculator compares machine output by deadline, net returns, and four routes; unfinished units use raw value.",
        cornerLabel: "Feature",
        products: [
          {
            name: "Stardew Valley Crop Profit Calculator",
            href: createCropProfitHref("en"),
          },
          {
            name: "Stardew Profits",
            href: "https://thorinair.github.io/Stardew-Profits/",
          },
          {
            name: "StardewProfit",
            href: "https://www.stardewprofit.com/calculator",
          },
        ],
        rows: [
          {
            label: "How do limited machines affect timing?",
            values: [
              "Daily batches by machine count and duration",
              "Per-harvest cap; ignores processing duration",
              "Choose Raw, Keg, or Jar",
            ],
          },
          {
            label: "What can finish by the deadline?",
            values: [
              "Shows finished units and raw-sale remainder",
              "Excess produce added at raw value",
              "Filter crops by days left",
            ],
          },
          {
            label: "Which costs enter net gold?",
            values: [
              "Seed cost + per-tile fertilizer × tile count",
              "Optional seed and fertilizer spending",
              "Estimated seed cost; fertilizer choices",
            ],
          },
          {
            label: "How are processing routes compared?",
            values: [
              "Scores routes; shows highest-net single route",
              "Raw and artisan product options",
              "Raw, Keg, and Jar value comparisons",
            ],
          },
          {
            label: "What does the ranking help decide?",
            values: [
              "Net-gold ranking and gold per tile per day",
              "Profit/ROI graph; skills, buffs, quality",
              "Gold/Day sort, ROI, quality, scenarios",
            ],
          },
          {
            label: "What follows the crop choice?",
            values: [
              "Open growth calendar or import harvest plan",
              "Open crop details and Wiki from chart",
              "Copy results, share text, compare links",
            ],
          },
        ],
        sources: [
          {
            label: "Stardew Profits calculator",
            href: "https://thorinair.github.io/Stardew-Profits/",
          },
          {
            label: "Stardew Profits help",
            href: "https://thorinair.github.io/Stardew-Profits/help.html",
          },
          {
            label: "StardewProfit calculator",
            href: "https://www.stardewprofit.com/calculator",
          },
        ],
        checkedOn: "2026-10-20",
        affiliation: "This site is maintained by our team. The comparison is based on the public pages linked below.",
      },
      faq: {
        eyebrow: "Frequently asked questions",
        title: "About crop-profit estimates",
        description: "How the ranking treats costs, harvest timing, processing, and saved settings.",
        items: [
          {
            question: "How is net gold calculated?",
            answer: "The Stardew Valley Crop Profit Calculator subtracts seed and fertilizer costs from expected sales at normal-quality base prices and average yields. Profession may affect prices. Fertilizer cost per tile is multiplied by tile count once. Random bonuses may change results.",
          },
          {
            question: "Why isn't a crop listed?",
            answer: "The Stardew Valley Crop Profit Calculator lists crops your seed source can provide that can harvest by season end. Try another shop, farm year, or planting day.",
          },
          {
            question: "Are harvests after the season included?",
            answer: "The Stardew Valley Crop Profit Calculator counts harvests only through season end. Processing may continue to your selected deadline, but later harvests are excluded.",
          },
          {
            question: "Will it find a best mix across all machine types?",
            answer: "The Stardew Valley Crop Profit Calculator compares raw sale, Keg, Preserves Jar, and Dehydrator separately, then reports the highest-net single route. It does not optimize mixed machine allocations; unprocessed units use raw value.",
          },
          {
            question: "Does fertilizer change quality or growth here?",
            answer: "The Stardew Valley Crop Profit Calculator subtracts fertilizer cost only; quality bonuses are not simulated. Growth timing follows your Speed-Gro setting.",
          },
          {
            question: "Where are my settings stored?",
            answer: "The Stardew Valley Crop Profit Calculator saves settings in this browser profile's local storage. There is no account sync; clearing site data or switching profiles can remove or separate them.",
          },
          {
            question: "What can I do after ranking crops?",
            answer: "The Stardew Valley Crop Profit Calculator sends a selected crop to its growth calendar or local plan, or copies the top five. The one-way handoff carries season, planting day, Speed-Gro, and Agriculturist; calendar edits do not transfer back.",
          },
        ],
      },
      closing: {
        title: "Compare this season’s crop returns",
        description: "Set your season, seed source, and planting day to see returns after seed and fertilizer costs.",
        actionLabel: "Calculate crop profit",
      },
    },
    "crop-growth": {
      overview: {
        eyebrow: "See how much room this planting has",
        title: "Can you still plant it and harvest in time?",
        paragraphs: [
          "The Stardew Valley Crop Growth Calculator turns a crop and planting day into a dated plan: first maturity and harvests that fit. Use that schedule to decide whether to plant now or switch crops.",
          "Stardew Valley Crop Growth Calculator shifts maturity for missed watering. Speed-Gro and Agriculturist reduce it; natural regrowth keeps a fixed interval, and same-day replanting reuses growth settings.",
          "Outdoors, the Stardew Valley Crop Growth Calculator follows consecutive legal seasons; Greenhouse and Ginger Island show a 28-day window after planting. It projects dates and counts, not gold.",
        ],
        aside: "See the last safe outdoor planting date when applicable in Stardew Valley Crop Growth Calculator.",
      },
      caseStudy: {
        eyebrow: "Case study",
        title: "See dates after missed watering",
        description: "Add missed watering and a location to see how maturity and later harvest dates move.",
        focusTitle: "What the example shows",
        focusItems: [
          "Missed watering shifts first maturity",
          "Regrowing crops keep fixed intervals",
          "Check the last safe outdoor planting day",
          "Greenhouse and Ginger Island show 28 days",
          "Dates depend on the selected crop and location",
        ],
        caption: "Example interface; dates vary with crop and location.",
      },
      features: {
        eyebrow: "What you can plan",
        title: "Turn growth settings into a dated harvest schedule",
        items: [
          {
            eyebrow: "Harvest timing",
            number: "01",
            title: "Check how many harvests still fit",
            body: "Stardew Valley Crop Growth Calculator shows first maturity and projected harvests within this schedule.",
          },
          {
            eyebrow: "Growth changes",
            number: "02",
            title: "See how missed watering shifts dates",
            body: "Add missed watering days to see maturity shift. Growth boosts shorten maturity; natural regrowth keeps its fixed interval, while a one-time crop replanted that day uses the same growth settings again.",
          },
          {
            eyebrow: "Planting location",
            number: "03",
            title: "Compare outdoor and protected plots",
            body: "Stardew Valley Crop Growth Calculator follows legal outdoor seasons; Greenhouse and Ginger Island show a 28-day window.",
          },
          {
            eyebrow: "After harvest",
            number: "04",
            title: "Keep regrowth and replanting clear",
            body: "Stardew Valley Crop Growth Calculator keeps natural intervals; one-time crops can replant that day or stop after harvest.",
          },
          {
            eyebrow: "Keep planning",
            number: "05",
            title: "Bring a profit pick into the calendar",
            body: "Profit sends the crop, season, planting day, Speed-Gro, and Agriculturist setting here; growth edits do not sync back.",
          },
        ],
      },
      featureIntro: {
        eyebrow: "Features",
        title: "A clearer view of this crop’s harvest schedule",
        description: "The Stardew Valley Crop Growth Calculator checks first maturity and expected harvests, then shows how watering, boosts, and location shift dates.",
        items: [
          {
            title: "First maturity and harvest count",
            body: "See the projected first maturity date and total harvests within the selected window.",
          },
          {
            title: "Recalculate growth timing",
            body: "Projected maturity reflects missed watering, Speed-Gro, and Agriculturist settings.",
          },
          {
            title: "Dates by planting location",
            body: "Outdoor plans follow legal consecutive seasons and show the last safe planting date when applicable. Protected plots use a 28-day planning window.",
          },
          {
            title: "Regrowth or same-day replant",
            body: "Regrowing crops keep fixed intervals. One-time crops replanted that day reuse growth settings, and projected harvest dates can be copied.",
          },
        ],
      },
      howToUse: {
        eyebrow: "A quick three-step check",
        title: "Set the scenario, then read the harvest calendar",
        steps: [
          {
            number: "01",
            title: "Choose a crop and planting day",
            body: "Choose crop, season, and planting day in the Stardew Valley Crop Growth Calculator.",
          },
          {
            number: "02",
            title: "Match the growing conditions",
            body: "Add missed watering, choose growth boosts and location, then set the available after-harvest option.",
          },
          {
            number: "03",
            title: "Check dates and decide what to do",
            body: "Stardew Valley Crop Growth Calculator shows maturity, harvest count, dates; check the outdoor cutoff or copy dates.",
          },
        ],
        actionLabel: "Plan crop growth",
      },
      whyChoose: {
        eyebrow: "Make the planting decision with dates",
        title: "See the schedule before you commit",
        description: "Stardew Valley Crop Growth Calculator answers one practical question: can this planting still produce the harvests you have in mind?",
        items: [
          {
            number: "01",
            title: "Check the planting cutoff",
            body: "Compare first maturity with the outdoor cutoff before planting.",
          },
          {
            number: "02",
            title: "Include missed watering",
            body: "Add missed days and see how the maturity date shifts.",
          },
          {
            number: "03",
            title: "Keep regrow intervals separate",
            body: "Growth boosts shorten each planting’s maturity; natural regrowth keeps its fixed interval.",
          },
          {
            number: "04",
            title: "Plan by growing location",
            body: "Outdoor follows legal seasons; protected locations show 28 days.",
          },
          {
            number: "05",
            title: "Continue from profit planning",
            body: "Profit can send a crop scenario here; this tool does not estimate gold.",
          },
        ],
      },
      comparison: {
        eyebrow: "Check the planting decision",
        title: "Stardew Valley Crop Growth Calculator vs. Crop Planner V3 vs. Stardew Valley Wiki",
        description: "Stardew Valley Crop Growth Calculator takes one crop, planting day, and farm conditions to show first harvest, last safe outdoor planting, and harvests within the selected window. Recalculate after missed watering or same-day replanting.",
        cornerLabel: "Feature",
        products: [
          {
            name: "Stardew Valley Crop Growth Calculator",
            href: createCropGrowthToolHref("en"),
          },
          {
            name: "Crop Planner V3",
            href: "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
          },
          {
            name: "Stardew Valley Wiki",
            href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
          },
        ],
        rows: [
          {
            label: "Still time to plant?",
            values: [
              "First harvest; outdoor cutoff when applicable",
              "Add crop plans on calendar dates",
              "Look up maturity by crop and season",
            ],
          },
          {
            label: "Missed watering",
            values: [
              "Add missed days and recalculate maturity",
              "Track planted, harvest, and profit totals",
              "Review base growth-stage tables",
            ],
          },
          {
            label: "Regrowth or replanting",
            values: [
              "Fixed natural interval; replants reuse settings",
              "'Regrows' crop option",
              "One-time crops: replant and water on harvest",
            ],
          },
          {
            label: "Location and date range",
            values: [
              "Greenhouse/Island: 28 days from planting",
              "Season/year farm calendar",
              "Seasonal crop growth calendars",
            ],
          },
          {
            label: "Growth settings",
            values: [
              "Speed-Gro and Agriculturist adjust maturity",
              "Select fertilizer for crop plans",
              "Compare fertilizer and Agriculturist tables",
            ],
          },
          {
            label: "Continue the plan",
            values: [
              "Profit crop/date/boosts in; copy dates out",
              "Manage plans in player profiles",
              "Jump to growth tables by crop",
            ],
          },
        ],
        sources: [
          {
            label: "Crop Planner V3",
            href: "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
          },
          {
            label: "Crop Planner V3 introduction on Reddit",
            href: "https://www.reddit.com/r/StardewValley/comments/1bo18ds/crop_planner_v3_website/",
          },
          {
            label: "Stardew Valley Wiki — Crop Growth Calendars",
            href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
          },
        ],
        checkedOn: "2026-10-20",
        affiliation: "This site is maintained by our team. The comparison is based on the public pages linked below.",
      },
      faq: {
        eyebrow: "Crop growth FAQ",
        title: "About planting timing and harvest dates",
        description: "Use the dates to decide whether to plant, how many harvests fit, and how settings change the schedule.",
        items: [
          {
            question: "What does the first maturity date mean?",
            answer: "Stardew Valley Crop Growth Calculator calculates maturity from crop stages, missed watering, Speed-Gro, and Agriculturist. Natural regrowth then follows its fixed interval.",
          },
          {
            question: "Can I still plant this crop in time?",
            answer: "Stardew Valley Crop Growth Calculator shows first maturity and the last safe day for outdoor crops with consecutive legal seasons. If maturity misses that cutoff, the scenario is marked not harvestable; protected locations have no outdoor cutoff.",
          },
          {
            question: "Do Speed-Gro and Agriculturist speed up natural regrowth?",
            answer: "No. Stardew Valley Crop Growth Calculator applies boosts to each planting’s maturity; natural regrowth keeps its crop-specific interval. Same-day replanting applies the settings again.",
          },
          {
            question: "How do missed watering days change the schedule?",
            answer: "Stardew Valley Crop Growth Calculator adds missed watering days to growth time, moving maturity later; regrowing crops still use their listed interval after the first harvest.",
          },
          {
            question: "Why do protected locations stop at 28 days?",
            answer: "Stardew Valley Crop Growth Calculator shows the 28 days after planting in protected plots. This planning window limits displayed dates, not how long a crop produces in game.",
          },
          {
            question: "What happens after a one-time crop is harvested?",
            answer: "Stardew Valley Crop Growth Calculator schedules regrowing crops at their natural interval. For one-time crops, choose same-day replanting or stop after harvest.",
          },
          {
            question: "What carries over from the profit calculator?",
            answer: "Stardew Valley Crop Growth Calculator receives crop, season, planting day, Speed-Gro, and Agriculturist from profit; missed watering resets to zero and location starts outdoors. Growth edits do not return, and earnings are not calculated.",
          },
        ],
      },
      closing: {
        title: "Review your harvest schedule",
        description: "Choose a crop, planting date, and location to review first maturity and expected harvests.",
        actionLabel: "Plan crop growth",
      },
    },
  },
  "zh-CN": {
    "crop-profit": {
      overview: {
        eyebrow: "先算本季净收益",
        title: "种什么，能让这一季的收获更值？",
        paragraphs: [
          "买种子前，最想知道的是这季还能收几次、扣掉成本后能留下多少金币。这个作物收益计算器把可购买的作物排在一起，让你按当前播种计划比较净收益，再决定把地留给谁。",
          "选好季节与播种日，再填种子来源、农场年份、职业、生长激素和每格肥料费用。加入小桶、罐头瓶或脱水机数量与处理截止日，就能看机器能在计划时间内完成多少收成。",
          "排名显示本季预计收获、净金币与每格每日收益，并为每种作物挑出收益最高的一条销售或加工路线。模型按基础售价与平均预期产量估算；随机额外收获会让实际数字不同。",
        ],
        aside: "加工截止日可延到季末后；作物收获统计仍止于本季。",
        priceSource: {
          beforeLink: "价格来自本站打包的星露谷 1.6.15 游戏数据（Crops.json）。作物说明见",
          linkLabel: "星露谷 Wiki",
          afterLink: "。",
        },
        byline: {
          author: "Stardew Valley Planner Team",
          dateTime: "2026-10-28",
          dateLabel: "2026年10月28日",
        },
      },
      caseStudy: {
        eyebrow: "案例展示",
        title: "比较本季作物净收益",
        description: "设置季节、种子来源与播种日，比较扣除种子和肥料成本后的本季净收益。",
        focusTitle: "案例查看重点",
        focusItems: [
          "筛出当前设置下本季可种的作物",
          "查看预计收获次数与净金币",
          "比较原售、小桶、罐头瓶和脱水机",
          "检查截止日前可完成的加工数量",
          "未加工余量按原作物售价估算",
        ],
        caption: "案例界面；结果随所选作物与条件变化。",
      },
      features: {
        eyebrow: "可以比较什么",
        title: "把你设置的成本和限制纳入计划",
        items: [
          {
            eyebrow: "先缩小选择",
            number: "01",
            title: "只比较当前能种的作物",
            body: "按季节、种子来源与播种日，筛出可购买且能在本季收获的作物。",
          },
          {
            eyebrow: "看净收益",
            number: "02",
            title: "把种子和肥料支出算进去",
            body: "按种子来源和重复种植次数扣除种子支出，再减去每格肥料费用，比较净金币。",
          },
          {
            eyebrow: "核对机器",
            number: "03",
            title: "按容量和耗时排入收成",
            body: "把本季收获按到货日排入对应机器，按批次容量、加工天数与截止日计算完成数量。",
          },
          {
            eyebrow: "比较路线",
            number: "04",
            title: "查看加工与原售余量",
            body: "并排比较出售、小桶、罐头瓶和脱水机路线；未加工部分仍按原作物售价计入。",
          },
          {
            eyebrow: "接着安排",
            number: "05",
            title: "把排名转成下一步计划",
            body: "查看净金币、每格每日收益和原料余量，并可复制前五名或带入生产计划。",
          },
        ],
      },
      featureIntro: {
        eyebrow: "功能介绍",
        title: "从本季收益到收获安排",
        description: "比较本季作物的净收益，并判断现有机器能否在你的截止日前处理收成。",
        items: [
          {
            title: "本季收益榜单",
            body: "按本季和播种日期比较可购买作物，查看预计收获次数与收量。",
          },
          {
            title: "先扣种植成本",
            body: "种子费按种源、种植次数和地块数计算；每格肥料费按地块数只计一次。",
          },
          {
            title: "机器加工排程",
            body: "按收获日、机器数、批次容量和加工天数排程，查看截止前完成量与原售余量。",
          },
          {
            title: "接着安排收获",
            body: "收益结果可衔接生长日历与本地生产计划，并支持复制前五名。",
          },
        ],
      },
      howToUse: {
        eyebrow: "三步完成比较",
        title: "从种植条件到本季收益",
        steps: [
          {
            number: "01",
            title: "选好季节与播种条件",
            body: "选择季节、播种日、农场年份、地块数量和种子商店，确定本次比较范围。",
          },
          {
            number: "02",
            title: "填写成本与加工安排",
            body: "选择职业和生长激素，填写每格肥料费用，再设置各类机器数量与处理截止日。",
          },
          {
            number: "03",
            title: "比较排名并继续规划",
            body: "查看预计收获和单一路线收益，再打开生长日历、复制前五名或导入生产计划。",
          },
        ],
        actionLabel: "计算作物收益",
      },
      whyChoose: {
        eyebrow: "为什么这样规划",
        title: "让收益估算接近你的实际安排",
        description: "重点看扣除成本后的结果，以及有限机器在截止日前能处理多少收成。",
        items: [
          {
            number: "01",
            title: "先看扣除成本后的收益",
            body: "种子与每格肥料费用都会计入净金币，避免只按售价挑作物。",
          },
          {
            number: "02",
            title: "机器安排有时间边界",
            body: "机器数量、批次与加工天数一起计算，查看截止日前能完成多少。",
          },
          {
            number: "03",
            title: "加工量和原售量分开看",
            body: "结果列出已加工数量与剩余原料，后者按作物原价出售。",
          },
          {
            number: "04",
            title: "收获范围保持在本季",
            body: "只计入本季收获；每格每日收益按剩余种植季天数平均。",
          },
          {
            number: "05",
            title: "算完接着安排",
            body: "打开生长日历、导入收获计划，或复制前五名留作比较。",
          },
        ],
      },
      comparison: {
        eyebrow: "把机器与截止日算进收益",
        title: "星露谷物语作物收益计算器与 Stardew Profits、StardewProfit 对比",
        description: "机器不够时，先看截止日前能加工多少，再比较扣除种子和肥料后的净收益。原售、小桶、罐头瓶、脱水机路线一起算，未加工余量按原价计入。",
        cornerLabel: "对比项",
        products: [
          {
            name: "Stardew Valley Crop Profit Calculator",
            href: createCropProfitHref("zh-CN"),
          },
          {
            name: "Stardew Profits",
            href: "https://thorinair.github.io/Stardew-Profits/",
          },
          {
            name: "StardewProfit",
            href: "https://www.stardewprofit.com/calculator",
          },
        ],
        rows: [
          {
            label: "机器有限时，何时能处理完？",
            values: [
              "按日排程机器数、批次与加工周期",
              "每次收获限量，忽略加工天数",
              "可选原售、小桶、罐头瓶路线",
            ],
          },
          {
            label: "截止前完成多少，剩下怎么算？",
            values: [
              "完成量与原售余量分别列出",
              "剩余产物按原价计入利润",
              "按剩余天数筛选作物",
            ],
          },
          {
            label: "净收益扣哪些成本？",
            values: [
              "扣种子费；每格肥料费×地块数",
              "可选扣除种子、肥料支出",
              "显示预估种子费及肥料选项",
            ],
          },
          {
            label: "路线怎样做收益比较？",
            values: [
              "逐条估价，显示净收益最佳单线",
              "原售及多类工匠产品",
              "原售、小桶、罐头瓶价值对比",
            ],
          },
          {
            label: "排名能支持什么判断？",
            values: [
              "净金币排序，并看每格每日收益",
              "利润/ROI图、技能与品质加成",
              "金币/日排序、ROI、品质与场景",
            ],
          },
          {
            label: "选好作物后怎样继续安排？",
            values: [
              "作物可转入生长日历或生产计划",
              "图表查看作物详情及百科链接",
              "复制结果、分享文本和比较链接",
            ],
          },
        ],
        sources: [
          {
            label: "Stardew Profits 计算器",
            href: "https://thorinair.github.io/Stardew-Profits/",
          },
          {
            label: "Stardew Profits 帮助页",
            href: "https://thorinair.github.io/Stardew-Profits/help.html",
          },
          {
            label: "StardewProfit 计算器",
            href: "https://www.stardewprofit.com/calculator",
          },
        ],
        checkedOn: "2026-10-20",
        affiliation: "本站由我们维护；本页对比依据下方所列公开页面整理。",
      },
      faq: {
        eyebrow: "常见问题",
        title: "关于作物收益估算",
        description: "了解排名如何计算收益、处理收成并保存你的设置。",
        items: [
          {
            question: "净金币是怎样算出来的？",
            answer: "净金币＝预计销售收入－种子费用－肥料费用。销售收入按基础售价与平均预期产量估算；每格肥料费用按地块数计入一次，职业会影响售价。随机额外收获可能让实际结果与估算不同。",
          },
          {
            question: "为什么没有我想种的作物？",
            answer: "列表只显示所选季节、种子来源和播种日期下可以买到，并能在本季产生收获的作物。调整商店、年份或播种日后再看排名。",
          },
          {
            question: "季节结束后的收获会算进去吗？",
            answer: "不会。本季作物收益只统计季节结束前能收获的部分；加工截止日可以更晚，机器仍可继续处理已经计入的收成。",
          },
          {
            question: "会自动混用三种机器来找最优分配吗？",
            answer: "不会。工具分别计算原售、小桶、罐头瓶和脱水机路线，再显示估算净收益最高的一条；不会把收成拆到多种机器做混合最优。未加工部分按原作物价格计入。",
          },
          {
            question: "肥料会改变品质或成熟时间吗？",
            answer: "此收益页的肥料输入只扣除每格费用，不模拟品质提升；生长速度按所选生长激素计算。想计入支出时，填写每格肥料成本。",
          },
          {
            question: "我的设置保存在哪里？",
            answer: "设置保存在当前浏览器的本地存储中，同一浏览器配置可继续使用。工具不提供账号云同步；清理站点数据或更换浏览器配置可能会移除或分开这些设置。",
          },
          {
            question: "排名之后还能继续做什么？",
            answer: "可把选中的作物和收获安排导入本机生产计划，或打开该作物的生长日历，也能复制前五名。转到生长页会带入作物、季节、播种日、生长激素和农业学家设定；日历更改不会回传。",
          },
        ],
      },
      closing: {
        title: "比较本季作物净收益",
        description: "选择季节、种子来源和播种日，查看扣除种子和肥料后的收益。",
        actionLabel: "计算作物收益",
      },
    },
    "crop-growth": {
      overview: {
        eyebrow: "先看这次播种还剩多少余地",
        title: "现在下种，还能收几次？",
        paragraphs: [
          "星露谷作物生长计算器把作物和播种日变成一份收获日程。先看第一次成熟落在哪天，再确认这次种植还能收几次，决定要不要现在播种，或换成更赶得上的作物。",
          "补上漏浇水天数，就能看到成熟日怎样推迟。生长加成会缩短成熟时间；天然再生仍用固定间隔，单次作物当天补种则按同样的生长设置重算。",
          "选露天、温室或姜岛后，日历按地点展开：露天遵循作物连续允许种植的季节，受保护地点查看播种后28天。你看到的是预计日期和次数，不是金币收益或收益排名。",
        ],
        aside: "先看首收日期，再对照最晚安全播种日，判断这次种植还能不能赶上。",
      },
      caseStudy: {
        eyebrow: "案例展示",
        title: "漏浇水后收获日期如何变化？",
        description: "输入漏浇水天数和种植地点，观察首次成熟与后续收获日期的变化。",
        focusTitle: "案例查看重点",
        focusItems: [
          "漏浇水天数会推迟本轮成熟",
          "再生作物继续按固定间隔收获",
          "露天场景核对最晚安全播种日",
          "温室和姜岛显示播种后28天",
          "日历显示预计日期，不代表游戏内时间",
        ],
        caption: "案例界面；日期随所选作物与地点变化。",
      },
      features: {
        eyebrow: "可以规划什么",
        title: "把生长条件转成具体收获日期",
        items: [
          {
            eyebrow: "赶上收获",
            number: "01",
            title: "下种前先确认还能收几次",
            body: "看首次成熟日和预计收获次数，判断这轮播种还剩多少采收机会。",
          },
          {
            eyebrow: "生长变化",
            number: "02",
            title: "漏浇水会把日期推到哪天",
            body: "补上漏浇水天数，观察成熟日顺延；天然再生仍按固定间隔，单次作物当天补种会再次应用同样的生长设置。",
          },
          {
            eyebrow: "种植地点",
            number: "03",
            title: "露天、温室和姜岛分别看",
            body: "切换露天、温室或姜岛，按对应季节限制或28天窗口查看日期。",
          },
          {
            eyebrow: "收获后安排",
            number: "04",
            title: "分清作物再生与当天补种",
            body: "可再生作物按固定间隔续收；单次作物可选收后补种或停止。",
          },
          {
            eyebrow: "继续排日期",
            number: "05",
            title: "把收益里挑中的作物带来",
            body: "把作物、日期和生长加成从收益工具带入；此页的修改不会反向传回。",
          },
        ],
      },
      featureIntro: {
        eyebrow: "功能介绍",
        title: "快速读懂这轮收获排期",
        description: "先确认成熟和收获机会，再按浇水、加成与种植地点看日期变化。",
        items: [
          {
            title: "首收与可收次数",
            body: "一眼看到首次成熟日期和当前排期内的预计收获次数。",
          },
          {
            title: "生长设置重算日期",
            body: "漏浇水、生长激素与农业学家设置共同影响预计成熟日期。",
          },
          {
            title: "日期随地点变化",
            body: "露天按连续适种季节计算，适用时显示最晚播种日；温室和姜岛显示播种后28天窗口的日期。",
          },
          {
            title: "分清再生与补种",
            body: "天然再生保持固定间隔；单次作物当天补种沿用所选加成，预计收获日期支持复制。",
          },
        ],
      },
      howToUse: {
        eyebrow: "三步排好这次播种",
        title: "先输入场景，再看收获日历",
        steps: [
          {
            number: "01",
            title: "选作物与播种日期",
            body: "选择作物、季节和播种日，确定这轮日程从哪一天开始。",
          },
          {
            number: "02",
            title: "按农场条件调整日程",
            body: "填写漏浇水天数，选择生长加成、职业与地点；单次作物还可设收获后补种或停止。",
          },
          {
            number: "03",
            title: "核对结果并决定下一步",
            body: "查看首次成熟、收获次数和日历；露天适用时看最晚安全播种日，也可复制日期清单。",
          },
        ],
        actionLabel: "开始规划生长日期",
      },
      whyChoose: {
        eyebrow: "把播种选择落到日历上",
        title: "先看日期，再决定怎么种",
        description: "这份日历围绕一个具体问题展开：这株作物现在种下去，还能不能按你的计划收获？",
        items: [
          {
            number: "01",
            title: "判断播种是否还来得及",
            body: "对照首次成熟日与露天截止，判断播种时机。",
          },
          {
            number: "02",
            title: "把漏浇水纳入排期",
            body: "补入漏浇水天数，看到成熟日如何后移。",
          },
          {
            number: "03",
            title: "别把首收当作再生间隔",
            body: "天然再生仍按固定间隔；单次作物当天补种会重用同样设置。",
          },
          {
            number: "04",
            title: "按种植地点看日期",
            body: "露天按季节推算；温室和姜岛看28天。",
          },
          {
            number: "05",
            title: "从收益选择接着排日期",
            body: "收益场景单向带入；生长工具不估算金币。",
          },
        ],
      },
      comparison: {
        eyebrow: "先核对这次播种的收获安排",
        title: "星露谷物语作物生长计算器与 Crop Planner V3、Stardew Valley Wiki 对比",
        description: "输入作物、播种日和农场条件，快速核对首收、露天最晚安全播种日与后续日期；漏浇水或当天补种后也能立即重排。",
        cornerLabel: "对比项",
        products: [
          {
            name: "Stardew Valley Crop Growth Calculator",
            href: createCropGrowthToolHref("zh-CN"),
          },
          {
            name: "Crop Planner V3",
            href: "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
          },
          {
            name: "Stardew Valley Wiki",
            href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
          },
        ],
        rows: [
          {
            label: "现在种还赶得上？",
            values: [
              "首收日；露天适用时看最晚播种",
              "日历日期格录入作物计划",
              "按作物与季节查成熟日",
            ],
          },
          {
            label: "漏浇水后怎么变？",
            values: [
              "补入漏浇天数，重算成熟日",
              "汇总播种、收获与利润",
              "查作物基础生长阶段",
            ],
          },
          {
            label: "天然再生与补种",
            values: [
              "天然间隔固定；补种重用设置",
              "Regrows作物选项",
              "单次作物收获日补种浇水",
            ],
          },
          {
            label: "地点与日历范围",
            values: [
              "温室/姜岛：播种后28天",
              "按年、季排农场日历",
              "按季节查生长日历",
            ],
          },
          {
            label: "生长加成",
            values: [
              "Speed-Gro与农业学家调整成熟",
              "选肥料排季节作物",
              "对照肥料与农业学家加成",
            ],
          },
          {
            label: "收益场景接着排",
            values: [
              "收益作物/日期/加成；复制日历",
              "多个玩家档案管理计划",
              "按目录跳转到各作物生长表",
            ],
          },
        ],
        sources: [
          {
            label: "Crop Planner V3",
            href: "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
          },
          {
            label: "Crop Planner V3 的 Reddit 介绍帖",
            href: "https://www.reddit.com/r/StardewValley/comments/1bo18ds/crop_planner_v3_website/",
          },
          {
            label: "星露谷物语 Wiki：作物生长日历",
            href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
          },
        ],
        checkedOn: "2026-10-20",
        affiliation: "本站由我们维护；本页对比依据下方所列公开页面整理。",
      },
      faq: {
        eyebrow: "作物生长常见问题",
        title: "关于播种时机与收获日期",
        description: "用日期回答还能不能种、能收几次，以及设置会怎样改变排期。",
        items: [
          {
            question: "第一次成熟是哪一天？",
            answer: "工具按作物生长阶段，结合所选生长加成、农业学家和漏浇水天数推算首次成熟，再将预计收获日期放进日历。",
          },
          {
            question: "现在种还赶得上收吗？",
            answer: "先看首次成熟日。适用的露天场景还会显示最晚安全播种日；若作物在截止前不能成熟，会标记为无法收获。温室和姜岛不受露天季节截止影响。",
          },
          {
            question: "生长加成会缩短天然再生间隔吗？",
            answer: "不会。生长激素和农业学家会缩短本轮种植后的成熟时间；天然再生仍按固定间隔。单次作物收获当天补种时，会按同样设置重新计算成熟时间。",
          },
          {
            question: "漏浇水会如何影响日程？",
            answer: "把漏浇水天数加进场景后，推算会相应延后成熟日期。可再生作物首次成熟后，仍按其再生间隔安排后续收获。",
          },
          {
            question: "温室和姜岛为什么只显示28天？",
            answer: "这里展示的是有限规划窗，截止于播种日之后28天。它只限制日历显示范围，不表示游戏里的作物到第28天会停止生长或生产。",
          },
          {
            question: "单次收获作物能安排再种吗？",
            answer: "会再生的作物按固定间隔继续收获。单次作物可选收获当天补种，或在这一轮收获后停止；不会把单次作物当成自然再生。",
          },
          {
            question: "从作物收益工具带来什么？",
            answer: "收益→生长时会带入作物、季节、播种日、生长激素和农业学家；漏浇水归零，地点从露天开始。返回收益不反传生长修改；本工具不算金币收益。",
          },
        ],
      },
      closing: {
        title: "查看本轮收获日程",
        description: "选择作物、播种日与地点，查看首收日期和本季预计收获次数。",
        actionLabel: "规划生长日期",
      },
    },
  },
};

export function getPlantingToolGuideCopy(
  locale: PublicLocale,
  tool: PlantingToolGuideId,
): PlantingToolGuideCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported planting tool guide locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  if (tool !== "crop-profit" && tool !== "crop-growth") {
    throw new Error(
      `Unsupported planting tool guide tool. Received: ${JSON.stringify(tool)}.`,
    );
  }

  return plantingToolGuideCopyByLocale[locale][tool];
}
