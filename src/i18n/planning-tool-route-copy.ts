import type { PublicLocale } from "./public-locale";
import type { ToolsPageHeroCopy } from "./tools-page-copy";
import type { PlanningToolId } from "../tools-pages/planning-tool-definition";

export type PlanningToolComparisonCopy = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  dimensionLabel: string;
  products: readonly [string, string, string];
  rows: readonly Readonly<{
    label: string;
    values: readonly [string, string, string];
  }>[];
  sourcesLabel: string;
  sources: readonly Readonly<{ label: string; href: string }>[];
  scrollHint: string;
}>;

export type PlanningToolRouteCopy = Readonly<{
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero: ToolsPageHeroCopy;
  comparison: PlanningToolComparisonCopy;
}>;

const planningRouteCopy: Readonly<Record<PublicLocale, Readonly<Record<PlanningToolId, PlanningToolRouteCopy>>>> = {
  en: {
    "today-processing-list": {
      title: "Today's processing list",
      metaTitle: "Stardew Valley Daily Processing Planner",
      metaDescription: "Plan today's Keg, Jar and Dehydrator tasks from your inventory. Reserve items, set arrivals, import a save and track what to load or collect.",
      hero: { titleBefore: "Stardew Valley", accent: "Daily Processing", titleAfter: "Planner", description: "Turn your inventory and available machines into a daily checklist. See what to collect, what to load and what stays unprocessed.", actionLabel: "Plan today's tasks" },
      comparison: {
        eyebrow: "Compare planning options",
        title: "A daily checklist connected to the full plan",
        description: "Compare a focused morning list with a full production planner and manual references. This page shares its inventory and settings with the schedule view.",
        dimensionLabel: "What you need",
        products: ["Today's processing list", "ValleyMath: What to Process Today?", "Stardew Valley Wiki + spreadsheet"],
        rows: [
          { label: "Starting point", values: ["Use the same multi-item inventory as the production schedule, including reserved amounts and future arrivals.", "Choose up to three competing stacks for a quick morning list; its full planner is a separate page.", "Look up recipes, processing times and values, then assemble your own list."] },
          { label: "Inputs and limits", values: ["Set quantity, quality, profession and Keg, Jar and Dehydrator counts; reserved items stay out of processing.", "Set quantity, quality, availability day, profession and machine counts for the selected stacks.", "Reference pages do not use your chest counts or machine inventory as a personal plan."] },
          { label: "What you get", values: ["Review load and collection tasks for a selected plan day, mark tasks done and see stock left raw.", "Get a short morning load list with collection days inside its 7-day quick plan; copy the checklist.", "Calculate machine loads and collection dates yourself from the published rules."] },
          { label: "Continue planning", values: ["Switch to the 7/14/28-day schedule without rebuilding the shared plan.", "The quick page links to a full planner with 7/14/28-day windows, save import and sharing.", "Move values between reference pages and your own notes or spreadsheet."] },
        ],
        sourcesLabel: "Sources",
        sources: [
          { label: "ValleyMath · What to Process Today?", href: "https://valleymath.com/stardew/what-to-process-today" },
          { label: "ValleyMath · Artisan Production Planner", href: "https://valleymath.com/stardew/artisan-production-planner" },
          { label: "Stardew Valley Wiki · Keg", href: "https://stardewvalleywiki.com/Keg" },
          { label: "Player-made artisan spreadsheet example", href: "https://www.reddit.com/r/StardewValley/comments/4j736r/i_extended_uhjard_kuks_crop_spreadsheet_with/" },
        ],
        scrollHint: "Swipe or scroll horizontally to compare all columns.",
      },
    },
    "production-schedule": {
      title: "Production schedule",
      metaTitle: "Stardew Valley Production Planner — Machine Schedule",
      metaDescription: "Schedule Kegs, Jars and Dehydrators around stock arrivals and a deadline. Compare added value, raw leftovers and a daily production plan.",
      hero: { titleBefore: "Stardew Valley", accent: "Production", titleAfter: "Planner", description: "Plan a full production window across Kegs, Jars and Dehydrators. Follow stock arrivals, machine usage and the value added before your deadline.", actionLabel: "Build a production schedule" },
      comparison: {
        eyebrow: "Compare production planners",
        title: "Compare a schedule with other planning methods",
        description: "Both planners can turn mixed stock into a day-by-day machine plan. The differences below focus on language, workflow and what each result actually promises.",
        dimensionLabel: "Planning detail",
        products: ["This production schedule", "ValleyMath Artisan Production Planner", "Stardew Valley Wiki + spreadsheet"],
        rows: [
          { label: "Inputs", values: ["Combine item, quality, quantity, reserved stock, arrival day, profession and three machine counts.", "Also supports mixed stock, quality, kept quantities, ready days, profession and machine counts; save import is available.", "Use published recipes and prices as references; enter and reconcile your own stock manually."] },
          { label: "Schedule", values: ["Choose 7, 14 or 28 days and review daily load and collection tasks.", "Choose 7, 14 or 28 days and review a day-by-day plan with today's checklist.", "No personal daily schedule is generated; dates and machine assignments are up to you."] },
          { label: "Results", values: ["See recommended allocations, raw-sale baseline, added value, final value and unprocessed leftovers.", "See recommended allocations, extra gold, final sale value, raw leftovers and backlog.", "Look up processing rules and calculate the allocation and remaining stock yourself."] },
          { label: "Language and workflow", values: ["Chinese and English; the daily checklist and schedule use the same saved plan.", "The reviewed planner page is in English and includes local saving, save import and share links.", "The Wiki has multiple language editions; a spreadsheet can be customized but requires manual upkeep."] },
          { label: "Optimization claim", values: ["Recommendations are estimates, not a guarantee of a globally optimal plan.", "The page labels its result feasible, not proven optimal.", "Reference data does not claim to optimize your personal plan."] },
        ],
        sourcesLabel: "Sources",
        sources: [
          { label: "ValleyMath · Artisan Production Planner", href: "https://valleymath.com/stardew/artisan-production-planner" },
          { label: "Stardew Valley Wiki · Keg", href: "https://stardewvalleywiki.com/Keg" },
          { label: "Player-made artisan spreadsheet example", href: "https://www.reddit.com/r/StardewValley/comments/4j736r/i_extended_uhjard_kuks_crop_spreadsheet_with/" },
        ],
        scrollHint: "Swipe or scroll horizontally to compare all columns.",
      },
    },
    "keg-count": {
      title: "How many Kegs do I need?",
      metaTitle: "Stardew Valley Keg Calculator — How Many Kegs?",
      metaDescription: "Calculate how many Kegs you need for one harvest or a repeating crop supply. Check existing capacity, backlog and shed space before building.",
      hero: { titleBefore: "Stardew Valley", accent: "Keg Capacity", titleAfter: "Calculator", description: "Work out how many Kegs your harvest needs. Compare a single deadline with a repeating harvest, then send your target to the materials calculator.", actionLabel: "Calculate Keg capacity" },
      comparison: {
        eyebrow: "Compare Keg planning options",
        title: "From a harvest size to a practical Keg target",
        description: "Compare deadline and repeat-harvest estimates with a direct competitor and the Wiki references behind the game rules.",
        dimensionLabel: "Keg planning",
        products: ["This Keg calculator", "ValleyMath: How Many Kegs?", "Stardew Valley Wiki + manual math"],
        rows: [
          { label: "Scenarios", values: ["Estimate one current stack or the same-sized harvest repeating at a chosen interval; include your existing Kegs.", "Estimate one stack by deadline or test whether a repeating harvest creates a long-run backlog.", "Find recipe, processing-time and Shed layout references, then calculate your target manually."] },
          { label: "Deadline result", values: ["Count complete batches by 7, 14 or 28 days; show unfinished raw units and the Keg gap.", "Count batches completed by 7, 14 or 28 days, show leftover units and compare Shed/Big Shed layouts.", "The Wiki publishes cycle and layout facts, not a result based on your stack and current fleet."] },
          { label: "Ongoing supply", values: ["Show average throughput and backlog for a repeating equal-sized harvest; this is not a dated daily loading schedule.", "Show long-run pace and backlog added per harvest; a temporary queue may still occur.", "Estimate sustainable throughput by combining the recipe cycle with your own harvest interval."] },
          { label: "Next step", values: ["Carry the target into this site's materials calculator; current stock can also be tested in its production planner.", "Link the Keg target to its materials calculator or full planner, and copy the capacity result.", "Use the recipe and layout references to decide what to build and where to place it."] },
          { label: "Language", values: ["Chinese and English pages, with links to the site's related planning tools.", "The reviewed calculator page is in English.", "The Wiki offers multiple language editions, including Chinese."] },
        ],
        sourcesLabel: "Sources",
        sources: [
          { label: "ValleyMath · How Many Kegs?", href: "https://valleymath.com/stardew/how-many-kegs-do-i-need" },
          { label: "Stardew Valley Wiki · Keg", href: "https://stardewvalleywiki.com/Keg" },
          { label: "Reddit · Machinery calculator discussion", href: "https://www.reddit.com/r/StardewValley/comments/ra8ywx/machinery_calculator/" },
        ],
        scrollHint: "Swipe or scroll horizontally to compare all columns.",
      },
    },
    "materials-and-resin": {
      title: "Keg materials and resin timing",
      metaTitle: "Stardew Valley Keg Materials and Oak Resin Calculator",
      metaDescription: "Calculate Keg material shortages, how many you can craft now and when tapped oak trees will provide enough resin. Includes standard and heavy tappers.",
      hero: { titleBefore: "Stardew Valley", accent: "Keg Materials", titleAfter: "Calculator", description: "Check your wood, bars and oak resin against a Keg target. See what you can craft now and how long your tapped oaks need to cover the resin shortage.", actionLabel: "Plan materials and resin" },
      comparison: {
        eyebrow: "Compare Keg material planners",
        title: "Check the craft list and the Oak Resin wait together",
        description: "The direct calculators cover similar material and resin questions. This comparison makes their shared assumptions visible and distinguishes them from static recipe references.",
        dimensionLabel: "Material planning",
        products: ["This materials and resin calculator", "ValleyMath: Keg Cost Calculator", "Stardew Valley Wiki + manual math"],
        rows: [
          { label: "What you enter", values: ["Keg target, built Kegs, Wood, Copper Bars, Iron Bars, Oak Resin, tapped mature Oaks, Tapper type and days available.", "Keg target and built count, chest materials, tapped Oaks, Tapper type and days available.", "Look up the Keg recipe and Tapper timing; add up your chest stock and shortages yourself."] },
          { label: "What you get", values: ["Craftable-now count, material bottleneck and shortages, plus Resin expected by the deadline and the tree gap.", "Craftable-now count, material bottleneck and shortages, plus Resin by deadline and trees needed.", "Published recipe and collection intervals; no personal craftable count or deadline estimate."] },
          { label: "Resin timing", values: ["Compare regular 7-day and Heavy Tapper 3-day cycles; estimates start a fresh cycle today.", "Compare 7-day and 3-day cycles; assumes each mature Oak has an empty Tapper today.", "Oak Resin takes 7 days, or 3 with a Heavy Tapper; calculate cycles against your deadline."] },
          { label: "What's outside the estimate", values: ["Does not simulate a partly elapsed Tapper cycle, tree growth, Tapper crafting or ore smelting.", "Does not price ore, Coal, furnaces, Tappers or travel time.", "Reference pages explain individual rules; connect crafting, smelting and collection steps manually."] },
          { label: "Language and flow", values: ["Chinese and English; the Keg target can be passed in from this site's capacity calculator.", "The reviewed material calculator page is in English and links to the Keg capacity calculator.", "The Wiki offers multiple language editions, including Chinese."] },
        ],
        sourcesLabel: "Sources",
        sources: [
          { label: "ValleyMath · Keg Cost Calculator", href: "https://valleymath.com/stardew/keg-cost-calculator" },
          { label: "Stardew Valley Wiki · Keg recipe", href: "https://stardewvalleywiki.com/Keg" },
          { label: "Stardew Valley Wiki · Oak Resin", href: "https://stardewvalleywiki.com/Oak_Resin" },
          { label: "Stardew Valley Wiki · Tapper", href: "https://stardewvalleywiki.com/Tapper" },
        ],
        scrollHint: "Swipe or scroll horizontally to compare all columns.",
      },
    },
  },
  "zh-CN": {
    "today-processing-list": {
      title: "今日加工清单",
      metaTitle: "星露谷物语今日加工清单｜库存与机器任务规划",
      metaDescription: "按库存、预留数量、到货日和机器数量安排今日加工。支持导入游戏存档，查看小桶、罐头瓶和烘干机的装料与收取任务。",
      hero: { titleBefore: "星露谷物语", accent: "今日加工", titleAfter: "清单", description: "填入库存和空闲机器，安排今天收什么、装什么。预留物品和未来到货分别计算，完成一项就勾选一项。", actionLabel: "安排今日加工" },
      comparison: {
        eyebrow: "对比今日加工安排",
        title: "今日清单，也能接着看完整排程",
        description: "把晨间快速清单、完整加工排程和手动查资料的方案放在一起比较。本站今日清单与排程页共用库存和设置。",
        dimensionLabel: "你要解决的事",
        products: ["本站·今日加工清单", "ValleyMath·What to Process Today?", "星露谷 Wiki + 手工表格"],
        rows: [
          { label: "从哪里开始", values: ["沿用完整排程里的多项库存，也记录预留数量和未来到货。", "快速清单可比较最多三种库存；完整生产计划在另一个页面。", "查配方、加工时间和价值，再自己整理库存与任务。"] },
          { label: "输入与限制", values: ["填写数量、品质、职业和小桶/罐头瓶/烘干机数量；预留物不会进入加工。", "为所选库存填写数量、品质、可用日、职业和机器数量。", "参考页不会代入你的箱子库存和机器数量生成个人计划。"] },
          { label: "结果", values: ["按所选计划日查看装料与收取任务，可勾选完成，并查看未加工余料。", "在 7 天快速计划中生成晨间装料清单和预计收取日，也可复制清单。", "按公开规则自行换算机器装料与收取日期。"] },
          { label: "后续安排", values: ["切换到 7/14/28 天综合排程时，不必重新录入同一份计划。", "快速清单链接到完整排程；完整排程提供 7/14/28 天计划、存档导入与分享。", "需要在 Wiki、手工计算和自己的表格之间传递数字。"] },
        ],
        sourcesLabel: "核对来源",
        sources: [
          { label: "ValleyMath · What to Process Today?", href: "https://valleymath.com/stardew/what-to-process-today" },
          { label: "ValleyMath · Artisan Production Planner", href: "https://valleymath.com/stardew/artisan-production-planner" },
          { label: "星露谷 Wiki · 小桶", href: "https://stardewvalleywiki.com/Keg" },
          { label: "玩家自制加工品价值表案例", href: "https://www.reddit.com/r/StardewValley/comments/4j736r/i_extended_uhjard_kuks_crop_spreadsheet_with/" },
        ],
        scrollHint: "左右滑动可查看完整对比。",
      },
    },
    "production-schedule": {
      title: "综合生产排程",
      metaTitle: "星露谷物语综合生产排程｜多机器加工计划",
      metaDescription: "结合库存到货日、预留数量、职业和截止日，安排小桶、罐头瓶与烘干机。查看加工增值、剩余原料和每天的装料收取计划。",
      hero: { titleBefore: "星露谷物语", accent: "综合生产", titleAfter: "排程", description: "把库存、到货时间和三种机器排在同一份计划里。查看截止日前能完成的加工、增加的收入，以及每天的装料和收取安排。", actionLabel: "制定生产排程" },
      comparison: {
        eyebrow: "对比生产排程方案",
        title: "完整排程与其他计划方式",
        description: "竞品同样提供多库存和逐日加工计划。这里重点说明本站的中英双语与页面衔接，也如实列出排程结果的边界。",
        dimensionLabel: "排程细节",
        products: ["本站·综合生产排程", "ValleyMath·Artisan Production Planner", "星露谷 Wiki + 手工表格"],
        rows: [
          { label: "输入信息", values: ["合并物品、品质、数量、预留库存、到货日、职业和三种机器数量。", "也支持混合库存、品质、保留数量、可用日、职业和机器数量，并可导入存档。", "查公开配方与售价；库存、可用时间和机器需自行整理。"] },
          { label: "排程范围", values: ["选择 7、14 或 28 天，逐日查看装料与收取任务。", "选择 7、14 或 28 天，查看逐日计划和当天清单。", "不会按你的库存自动生成逐日任务。"] },
          { label: "结果查看", values: ["查看推荐分配、原售基准、加工增值、最终价值和未加工余料。", "查看推荐分配、加工增值、最终售价、原料余量和积压。", "需手动汇总加工路线、价值和剩余库存。"] },
          { label: "语言与衔接", values: ["提供中文和英文；今日清单与综合排程共用同一份已保存计划。", "本次核对的页面为英文；支持本地保存、存档导入和计划分享链接。", "Wiki 有多语言版本；自制表格可定制，但需自行维护。"] },
          { label: "最优性说明", values: ["提供估算推荐，不承诺全局最优；机器按每天早晨收取和重新装料估算。", "页面明确说明计划可执行，但未证明为最优。", "资料页提供规则，不替你的农场优化排程。"] },
        ],
        sourcesLabel: "核对来源",
        sources: [
          { label: "ValleyMath · Artisan Production Planner", href: "https://valleymath.com/stardew/artisan-production-planner" },
          { label: "星露谷 Wiki · 小桶", href: "https://stardewvalleywiki.com/Keg" },
          { label: "玩家自制加工品价值表案例", href: "https://www.reddit.com/r/StardewValley/comments/4j736r/i_extended_uhjard_kuks_crop_spreadsheet_with/" },
        ],
        scrollHint: "左右滑动可查看完整对比。",
      },
    },
    "keg-count": {
      title: "需要多少 Keg",
      metaTitle: "星露谷物语小桶数量计算器｜需要多少 Keg",
      metaDescription: "按原料数量、加工期限和收获间隔计算所需小桶。比较现有机器产能、积压与长期需求，再把建造目标转入材料清单。",
      hero: { titleBefore: "星露谷物语", accent: "小桶数量", titleAfter: "计算器", description: "这批收获需要多少个小桶？分别计算限期加工与持续收获的需求，查看现有产能、积压和棚屋容量，再安排建造。", actionLabel: "计算小桶数量" },
      comparison: {
        eyebrow: "对比小桶规划方式",
        title: "从收获量算到实际小桶目标",
        description: "对照竞品计算器和游戏资料，看看单批期限与重复收获的估算分别能回答什么问题。",
        dimensionLabel: "小桶规划",
        products: ["本站·需要多少 Keg", "ValleyMath·How Many Kegs?", "星露谷 Wiki + 手动计算"],
        rows: [
          { label: "适用场景", values: ["计算一批现有库存，或相同数量、按固定间隔重复到来的收获，并填写已有小桶数。", "计算单批期限需求，也可检查重复收获是否会长期积压。", "查小桶配方、加工周期和棚屋容量，再自行套用库存与收获量。"] },
          { label: "截止日结果", values: ["按 7/14/28 天统计能完成的整批数量、未完成原料和小桶缺口。", "按 7/14/28 天统计已完成批次、剩余数量，并对照普通/大棚容量。", "Wiki 提供周期和布局数据，不会代入你的库存和现有小桶计算目标。"] },
          { label: "持续收获", values: ["估算长期平均处理量和新增积压；不生成逐日装料日历。", "估算长期处理速度和每轮积压；短期排队仍可能发生。", "需用加工周期和收获间隔手动判断机器能否跟上。"] },
          { label: "下一步", values: ["把目标数量带入本站材料计算器；现有库存也可继续送入本站生产排程。", "可转到其材料计算器或完整排程，并复制容量结果。", "根据配方和布局资料自行安排建造和摆放。"] },
          { label: "语言", values: ["提供中文和英文，并连接本站相关规划工具。", "本次核对的计算器页面为英文。", "Wiki 提供包括中文在内的多语言版本。"] },
        ],
        sourcesLabel: "核对来源",
        sources: [
          { label: "ValleyMath · How Many Kegs?", href: "https://valleymath.com/stardew/how-many-kegs-do-i-need" },
          { label: "星露谷 Wiki · 小桶", href: "https://stardewvalleywiki.com/Keg" },
          { label: "Reddit · 玩家讨论机器数量计算器", href: "https://www.reddit.com/r/StardewValley/comments/ra8ywx/machinery_calculator/" },
        ],
        scrollHint: "左右滑动可查看完整对比。",
      },
    },
    "materials-and-resin": {
      title: "材料与树脂时间",
      metaTitle: "星露谷物语小桶材料与橡树树脂计算器",
      metaDescription: "按小桶建造目标计算木材、铜锭、铁锭与橡树树脂缺口，查看当前可制作数量，以及普通或重型树液采集器补足树脂的时间。",
      hero: { titleBefore: "星露谷物语", accent: "材料与树脂", titleAfter: "计算器", description: "把小桶建造目标变成材料清单。核对当前库存、可制作数量和缺口，再看现有橡树多久能补足树脂。", actionLabel: "计算建造材料" },
      comparison: {
        eyebrow: "对比小桶材料计算器",
        title: "材料缺口与橡树树脂等待时间一起算",
        description: "两款在线计算器都覆盖建造材料与树脂期限估算。表中列出输入、结果和各自明确说明的时间假设。",
        dimensionLabel: "材料规划",
        products: ["本站·材料与树脂时间", "ValleyMath·Keg Cost Calculator", "星露谷 Wiki + 手动计算"],
        rows: [
          { label: "需要填写", values: ["目标与已有小桶、四种材料库存、已安装采集器的成熟橡树、采集器类型和剩余天数。", "目标与已有小桶、箱内材料、已安装采集器的橡树、采集器类型和剩余天数。", "查小桶配方、橡树树脂和采集器周期，再手动盘点材料。"] },
          { label: "计算结果", values: ["当前可制作数量、材料瓶颈与缺口，以及期限内树脂产量和树木需求。", "当前可制作数量、材料瓶颈与缺口，以及期限内树脂产量和树木需求。", "公开配方和采集周期；不代入个人库存给出可制作数量或期限结果。"] },
          { label: "树脂周期", values: ["比较普通采集器 7 天和重型采集器 3 天；从今天开始一轮新采集估算。", "比较 7 天和 3 天周期；假设成熟橡树今天装有空采集器。", "资料列出橡树树脂周期为 7 天，重型采集器为 3 天。"] },
          { label: "未纳入的步骤", values: ["不模拟已进行一半的采集周期、树木生长、采集器制作或矿石冶炼。", "不计矿石、煤、熔炉、采集器或往返时间的成本。", "需自行衔接采集、冶炼、制作和运输步骤。"] },
          { label: "语言与衔接", values: ["提供中文和英文；可从本站小桶数量工具带入建造目标和已有数量。", "本次核对的材料页为英文，并链接到其小桶容量计算器。", "Wiki 提供包括中文在内的多语言版本。"] },
        ],
        sourcesLabel: "核对来源",
        sources: [
          { label: "ValleyMath · Keg Cost Calculator", href: "https://valleymath.com/stardew/keg-cost-calculator" },
          { label: "星露谷 Wiki · 小桶配方", href: "https://stardewvalleywiki.com/Keg" },
          { label: "星露谷 Wiki · 橡树树脂", href: "https://stardewvalleywiki.com/Oak_Resin" },
          { label: "星露谷 Wiki · 树液采集器", href: "https://stardewvalleywiki.com/Tapper" },
        ],
        scrollHint: "左右滑动可查看完整对比。",
      },
    },
  },
};

export function getPlanningToolRouteCopy(locale: PublicLocale, toolId: PlanningToolId): PlanningToolRouteCopy {
  const copy = planningRouteCopy[locale]?.[toolId];
  if (!copy) throw new Error(`Missing planning tool copy: locale=${JSON.stringify(locale)}, toolId=${JSON.stringify(toolId)}.`);
  return copy;
}
