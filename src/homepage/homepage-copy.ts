import type { HomepageLocale } from "./homepage-locale";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";

type HomepageCapabilityCopy = Readonly<{
  title: string;
  description: string;
}>;

type HomepageFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

type HomepagePlanningStepCopy = Readonly<{
  title: string;
  description: string;
}>;

type HomepagePlanningPlayStyleCopy = Readonly<{
  title: string;
  description: string;
}>;

type HomepagePlanningGuideCopy = Readonly<{
  heading: string;
  intro: readonly string[];
  workflowHeading: string;
  steps: readonly [
    HomepagePlanningStepCopy,
    HomepagePlanningStepCopy,
    HomepagePlanningStepCopy,
    HomepagePlanningStepCopy,
  ];
  playStylesHeading: string;
  playStyles: readonly [
    HomepagePlanningPlayStyleCopy,
    HomepagePlanningPlayStyleCopy,
    HomepagePlanningPlayStyleCopy,
  ];
  evolutionHeading: string;
  evolutionParagraphs: readonly [string, string];
  imageAlt: string;
  imageCaption: string;
}>;

export type HomepageCopy = Readonly<{
  navigation: Readonly<{
    productName: string;
    capabilitiesLabel: string;
    faqLabel: string;
    blogLabel: string;
    plannerActionLabel: string;
    languageLabel: string;
  }>;
  hero: Readonly<{
    headlineBefore: string;
    headlineEmphasis: string;
    headlineAfter: string;
    supportingCopy: string;
    primaryActionLabel: string;
  }>;
  capabilities: Readonly<{
    heading: string;
    items: readonly [HomepageCapabilityCopy, HomepageCapabilityCopy, HomepageCapabilityCopy];
  }>;
  farmGuides: Readonly<{
    heading: string;
    description: string;
    comparisonLinkLabel: string;
  }>;
  planningGuide: HomepagePlanningGuideCopy;
  faq: Readonly<{
    heading: string;
    items: readonly [
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
    ];
  }>;
  trust: Readonly<{
    heading: string;
    description: string;
  }>;
  footer: SiteFooterCopy;
}>;

export const homepageCopyByLocale: Readonly<Record<HomepageLocale, HomepageCopy>> = {
  en: {
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "How it works",
      faqLabel: "FAQ",
      blogLabel: "Blog",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    hero: {
      headlineBefore: "Stardew Valley ",
      headlineEmphasis: "Planner",
      headlineAfter: " – Free Online Farm Layout Tool",
      supportingCopy:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      primaryActionLabel: "Start planning",
    },
    capabilities: {
      heading: "Plan with the map in view",
      items: [
        {
          title: "Plan every official farm type",
          description:
            "Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.",
        },
        {
          title: "Place and evaluate your layout",
          description:
            "Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.",
        },
        {
          title: "Keep projects in this browser",
          description:
            "Create and save local projects without an account or cloud sync.",
        },
      ],
    },
    farmGuides: {
      heading: "Choose a farm type before you plan",
      description:
        "Compare each official farm's space, constraints, and strengths, then open the guide that matches your layout.",
      comparisonLinkLabel: "Compare all farm types",
    },
    planningGuide: {
      heading: "How to Plan a Stardew Valley Farm Layout with Stardew Valley Planner",
      intro: [
        "A useful farm layout starts with the map you actually play, not with a decoration or a favorite building. The usable ground on each map has a different outline, and its fixed ponds, rivers, cliffs, bridges, and exits already decide part of the plan. The current farmhouse and shipping bin are useful starting anchors for routes, but they do not define the permanent limits of a zone. Look at the whole map before choosing a field or animal corner. Notice the narrow connections that force you through one tile of land, the edges where a path can stop naturally, and the open areas that can support a larger zone. A layout does not need to fill every tile. It needs to make the places you visit often easy to reach.",
        "Use the planner to test the large decisions first, then refine routes and details before you place anything in-game. Start with a rough sketch that answers practical questions: where will crops go, where will animals live, where will you keep storage and processing, and how will you walk among those jobs? Keep the sketch deliberately simple while you are still deciding. A clear empty area is more useful than a crowded plan that leaves no route or room for the next building. Once the main zones work together, smaller paths, fences, trees, and decorations can support the routine instead of making it harder to change.",
      ],
      workflowHeading: "A practical farm-planning workflow",
      steps: [
        {
          title: "Choose your farm map and mark fixed terrain",
          description:
            "Start with the correct farm type and spend a moment reading the map before placing anything. Treat ponds, rivers, cliffs, bridges, and map exits as fixed parts of the layout. Use the current farmhouse and shipping bin as starting anchors when you trace daily routes, while leaving the surrounding plan flexible. The fixed terrain and exits are not empty space to work around later; they are the edges that shape every zone and route. Mark the broad open ground, then identify the awkward corners, narrow crossings, and separated sections that need a specific purpose. A large rectangle may suit a field, while an isolated patch may work better as a small tree area, a utility corner, or open space. Let the terrain suggest the order of the farm instead of trying to force every zone into the same shape.",
        },
        {
          title: "Reserve functional zones",
          description:
            "Set aside areas for crops, animals, trees, storage, and processing so each daily task has a clear home. Think about what you do together: a crop zone needs room to work around the edges and a direct route to the place where you collect or process its harvest. An animal zone needs space around its buildings and an uncomplicated way to reach it during a daily round. Storage and processing are easier to use when they sit near the work that supplies them, rather than at the far end of an unrelated path. Draw broad boundaries first instead of exact rows. This protects each zone from being squeezed by a later building and makes it obvious which open ground is intentionally being saved.",
        },
        {
          title: "Place buildings and other large pieces",
          description:
            "Position barns, coops, sheds, silos, and large fields before filling the remaining space with smaller objects. These pieces set the scale of the layout and are difficult to fit into a finished-looking corner. Place them with enough surrounding ground to enter, turn, and connect a path without cutting through another work area. Compare a few positions before deciding: one placement may preserve an open field, while another may shorten the route between animals and storage. Keep an eye on entrances and on the space directly in front of a building, because a route that looks clear from far away can feel cramped when several destinations meet there. After the large shapes are stable, use the leftover space for smaller objects rather than designing the farm around them.",
        },
        {
          title: "Check walking routes and refine",
          description:
            "Walk the routes between the farmhouse, fields, animals, storage, processing, and shipping area as if you were doing a normal day of work. Follow the most common trip first, then check the next one without teleporting across the map in your head. Ask whether a path leads somewhere useful, whether two busy routes collide, and whether you have to pass through a production area just to reach another zone. Direct routes are usually more valuable than perfect symmetry. Leave turning space at corners, connect separated sections with a clear crossing, and avoid making a path so narrow that one placed object breaks it. When the route is comfortable, refine it with paths or visual boundaries that explain where to walk without blocking future changes.",
        },
      ],
      playStylesHeading: "Plan around the way you play",
      playStyles: [
        {
          title: "Crop-focused farms",
          description:
            "Keep fields, water access, storage, and processing close enough for planting and harvest days. Begin by protecting the largest workable ground, then decide how people will enter and cross it without turning every row into a detour. A compact field can be easier to approach from more than one side, while separate fields can make sense when the terrain already divides the map. Reserve a practical edge for chests, processing equipment, or a path rather than placing those items in the middle of a growing area. If a crop zone will expand later, leave one side open and make sure the route can extend with it. The goal is a field that remains usable when it becomes larger, not just one that looks complete today.",
        },
        {
          title: "Animal-focused farms",
          description:
            "Group barns and coops with pasture, hay storage, storage, and processing space to shorten recurring chores. Put the buildings where their entrances can share a simple route instead of scattering them across the map for visual balance alone. Keep enough open ground between the buildings for paths, future additions, and a clear view of where each route goes. A nearby utility area can reduce backtracking, but it should not block the way to a field or an exit. If the map has a separated section, decide whether it is worth using for animals before committing: an attractive open area may still create a long daily walk. Plan the zone around the route you will repeat, then add fences, paths, or decoration after that route is settled.",
        },
        {
          title: "Mixed farms",
          description:
            "Use separate zones and direct paths so crops, animals, trees, and production areas can grow without blocking one another. Mixed layouts benefit from a simple hierarchy: choose one main route that joins the farmhouse and the busiest work zones, then connect smaller branches to quieter areas. Do not try to give every activity equal space on day one. Reserve the ground that is hardest to replace, such as a large open field or the cleanest route through a narrow map section, and let flexible zones use the remaining shapes. Leave a buffer between unrelated work areas so one can expand without forcing a rebuild of the other. The result can still look varied, but each part of the farm should have a reason to be where it is.",
        },
      ],
      evolutionHeading: "Let the layout evolve with your farm",
      evolutionParagraphs: [
        "Early layouts can prioritize open ground and the first buildings you can afford, but they should still show where the next decisions can go. Leave room where a future field, barn, shed, storage corner, or path may need to go. You do not need to reserve every possible upgrade with an empty rectangle; instead, avoid closing the only direct route or filling the only large usable patch with details that are hard to move. A temporary zone can be useful when it has a clear boundary and can be replaced without disturbing the rest of the farm. Keep the biggest commitments near the center of the plan and use smaller, flexible pieces at the edges while you learn what space you actually need.",
        "Revisit the plan when your routine changes. After adding a building, expanding a field, or changing the order in which you visit zones, walk the new route again and ask what became slower or blocked. Moving a zone on the map is easier than rebuilding it after placing it in-game, so test one change at a time and compare it with the previous layout. Keep what makes daily movement clearer; remove what only fills space. Gradual refinement is not a failure to finish the farm. It is how a layout stays useful when your priorities change, while the fixed terrain and the main routes continue to give the map a stable structure.",
      ],
      imageAlt:
        "Pixel-art farm planning board with crop fields, animal buildings, paths, and labeled layout zones",
      imageCaption:
        "Sketch the map, reserve work zones, then refine routes and details as the farm grows.",
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          question: "Where are my projects stored?",
          answer:
            "Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.",
        },
        {
          question: "Which Stardew Valley farm types can I plan?",
          answer:
            "The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.",
        },
        {
          question: "Which seasons and coverage views are available?",
          answer:
            "You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.",
        },
        {
          question: "Can I import a Stardew Valley save?",
          answer:
            "Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.",
        },
        {
          question: "Can I export my farm layout?",
          answer:
            "Yes. The planner provides standard and high-quality screenshot downloads.",
        },
      ],
    },
    trust: {
      heading: "About this planner",
      description:
        "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
    },
    footer: {
      brandName: "Stardew Valley Farm Planner",
      description:
        "A browser-local fan-made tool for planning Stardew Valley farm layouts.",
      copyright: "© Stardew Valley Farm Planner",
      planner: {
        title: "Planner",
        home: "Planner",
        farmComparison: "Farm comparison",
        moddedFarms: "Modded farms",
      },
      explore: {
        title: "Explore",
        capabilities: "How it works",
        faq: "FAQ",
        blog: "Blog",
      },
      legal: {
        title: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact us",
      },
    },
  },
  "zh-CN": {
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "使用方式",
      faqLabel: "常见问题",
      blogLabel: "博客",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    hero: {
      headlineBefore: "星露谷物语",
      headlineEmphasis: "规划器",
      headlineAfter: "——免费在线农场布局工具",
      supportingCopy:
        "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
      primaryActionLabel: "开始规划",
    },
    capabilities: {
      heading: "在地图中完成规划",
      items: [
        {
          title: "规划每一种官方农场类型",
          description:
            "从标准、河流、森林、山顶、荒野、四角、海滩或草原农场开始规划。地图选择器中还提供姜岛。",
        },
        {
          title: "摆放并检查农场布局",
          description:
            "放置建筑、作物、可放置物和装饰，同时查看洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
        },
        {
          title: "将项目保存在当前浏览器中",
          description: "无需账号或云同步，直接在当前浏览器中创建并保存本地项目。",
        },
      ],
    },
    farmGuides: {
      heading: "规划前先选择农场类型",
      description: "比较每种官方农场的空间、限制和优势，再打开适合你布局的指南。",
      comparisonLinkLabel: "对比全部农场类型",
    },
    planningGuide: {
      heading: "如何使用星露谷物语规划器规划农场布局",
      intro: [
        "实用的农场布局要从你实际游玩的地图开始，而不是从一件装饰或喜欢的建筑开始。每张地图的可用土地轮廓都不同，固定的池塘、河流、悬崖、桥梁和出口已经决定了布局的一部分。当前的农舍和出货箱可作为实用的起始锚点来安排路线，但不应被视为分区永久不变的边界。先看完整地图，再决定田地或动物区的位置。留意只能从一格土地通过的狭窄连接、道路可以自然收尾的边缘，以及能容纳较大分区的开阔区域。布局不必填满每一格；重点是让你经常去的地方容易抵达。",
        "先用规划器测试大方向，再在游戏里摆放之前调整路线和细节。先画一张粗略草图，回答几个实际问题：作物放在哪里，动物住在哪里，储存和加工放在哪里，以及这些工作之间怎么走。还在做决定时，草图要保持简单。留出清楚的空地，比挤满物件却没有路线或后续建筑位置的布局更有用。等主要分区能够配合后，再用小路、栅栏、树木和装饰来支持日常动线，而不是让它们变得难以调整。",
      ],
      workflowHeading: "实用的农场规划流程",
      steps: [
        {
          title: "选择农场地图并标记固定地形",
          description:
            "从正确的农场类型开始，在放置任何物件前先花一点时间读懂地图。把池塘、河流、悬崖、桥梁和地图出口视为布局中固定不变的部分。沿着日常路线规划时，可把当前的农舍和出货箱作为起始锚点，同时让周围方案保持灵活。这些固定地形和出口不是以后再绕开的空白，而是决定每个分区和路线形状的边界。先标出大块开阔土地，再找出别扭的角落、狭窄的通道和需要特定用途的分隔区域。大块矩形土地适合田地，孤立的小块可能更适合树木、小型功能角或留白。让地形提示农场的秩序，而不是强迫每个分区都塞进同一种形状。",
        },
        {
          title: "预留功能分区",
          description:
            "为作物、动物、树木、储存和加工分别留出区域，让每天的工作都有明确位置。想想哪些事情会一起完成：作物区需要能绕着边缘工作的空间，也需要通往收集或加工位置的直接路线。动物区要在建筑周围留出空间，并能在每日巡查时方便到达。储存和加工放在供应它们的工作附近通常更顺手，而不是放在无关道路的另一端。先画宽泛的边界，不要急着确定每一行的位置。这样可以避免后来新增建筑挤压原有分区，也能看清哪些空地是刻意保留下来的。",
        },
        {
          title: "先摆放建筑和大型区域",
          description:
            "先安排畜棚、鸡舍、棚屋、筒仓和大块田地，再用小型物件填充剩余空间。这些大型部分决定了布局尺度，很难再塞进已经看似完成的角落。摆放时给周围留出足够土地，确保能进入、转弯并连接道路，而不用穿过其他工作区。决定前比较几个位置：一个位置可能保留更完整的田地，另一个位置可能缩短动物区和储存区之间的路线。注意建筑入口和正前方的空间，因为远看通畅的路线，在多个目的地交汇时可能显得拥挤。大形状稳定后，再用剩余空间安排小物件，不要反过来让整个农场迁就小物件。",
        },
        {
          title: "检查行走路线并逐步调整",
          description:
            "检查农舍、田地、动物区、储存区、加工区和出货箱之间的路线，像完成普通一天的工作那样走一遍。先走最常用的行程，再检查下一段，不要在脑中直接跨越地图。问问自己：道路是否通向有用的地方，繁忙路线是否互相冲突，是否必须穿过生产区才能到另一个分区。直接的路线通常比完全对称更有价值。给转角留出转身空间，用清楚的通道连接分隔区域，不要让道路窄到一个摆件就能堵住。路线舒服后，再用小路或视觉边界说明该怎么走，同时不妨碍未来调整。",
        },
      ],
      playStylesHeading: "围绕你的玩法规划",
      playStyles: [
        {
          title: "作物为主的农场",
          description:
            "让田地、取水点、储存区和加工区保持合理距离，方便播种和收获。先保护最大、最适合工作的土地，再决定怎样进入和穿过田地，避免每一行都变成绕路。紧凑的田地可以从多侧进入；如果地形本身已经分隔地图，分开的田地也有合理用途。为箱子、加工设备或道路预留实用边缘，不要把它们塞进会扩张的区域中央。如果作物区将来会扩大，就留出一侧空地，并确认道路也能随之延伸。目标是让田地变大后仍好用，而不只是今天看起来完整。",
        },
        {
          title: "畜牧为主的农场",
          description:
            "把畜棚、鸡舍、牧场、干草储存、储存区和加工区集中安排，缩短重复的日常工作路线。让建筑入口能共用一条简单路线，而不是只为了视觉平衡把它们分散到整张地图。建筑之间留出足够开阔土地，用于道路、后续增加和清楚识别每条路线的走向。附近的功能区可以减少折返，但不应堵住通往田地或出口的路。如果地图有被分隔的区域，在确定用作动物区前先判断是否值得：看起来开阔的位置也可能带来很长的每日行走距离。先围绕会重复的路线规划分区，等路线稳定后再加栅栏、道路或装饰。",
        },
        {
          title: "混合型农场",
          description:
            "通过独立分区和直接路径，让作物、动物、树木和生产区域逐步扩张而不互相阻挡。混合布局适合先建立简单层级：选择一条连接农舍和最繁忙工作区的主路线，再用较短支路连接安静区域。不要尝试在第一天就给每种活动相同空间。优先保留最难替代的土地，例如大块开阔田地或穿过狭窄地图区域最顺的路线，让更灵活的分区使用剩余形状。无关工作区之间留出缓冲，这样其中一侧扩张时不用重建另一侧。最终农场可以很丰富，但每个部分都应该有出现在当前位置的理由。",
        },
      ],
      evolutionHeading: "让布局随农场一起成长",
      evolutionParagraphs: [
        "初期布局可以优先考虑空地和最先买得起的建筑，但仍应看得出下一步可以放在哪里。为未来可能增加的田地、畜棚、棚屋、储存角或道路预留空间。你不必用一个空矩形预留每一种可能的扩建；更重要的是不要堵住唯一的直接路线，也不要用难以移动的细节填掉仅有的大块可用土地。临时分区只要边界清楚，并且能在不打扰其他区域的情况下替换，就同样有价值。还在了解自己需要多少空间时，把最大的承诺放在布局中心，把小而灵活的物件放在边缘。",
        "当日常流程改变时，再回到规划图调整。新增建筑、扩大田地或改变访问分区的顺序后，重新走一遍路线，看看哪里变慢或被堵住。在游戏里摆放前移动分区，比建好之后重建更轻松，所以一次只测试一种变化，并和之前的布局比较。保留能让每日移动更清楚的部分，移除只是填满空间的内容。逐步调整并不表示农场没有完成；当你的重点变化时，它让布局继续实用，同时固定地形和主路线仍然给地图提供稳定结构。",
      ],
      imageAlt: "像素风农场规划板，展示作物田地、动物建筑、道路和标注的布局分区",
      imageCaption: "先绘制地图并预留工作分区，再随着农场发展调整路线和细节。",
    },
    faq: {
      heading: "常见问题",
      items: [
        {
          question: "项目保存在哪里？",
          answer:
            "项目保存在当前浏览器本地。这里没有账号或云同步功能，因此请使用同一浏览器和设备重新打开项目。",
        },
        {
          question: "支持规划哪些星露谷物语农场类型？",
          answer:
            "规划器包含标准、河流、森林、山顶、荒野、四角、海滩和草原农场。地图选择器中还提供姜岛。",
        },
        {
          question: "可以查看哪些季节和覆盖范围？",
          answer:
            "你可以在春、夏、秋、冬之间切换，并显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
        },
        {
          question: "可以导入星露谷物语存档吗？",
          answer:
            "可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。",
        },
        {
          question: "可以导出农场布局吗？",
          answer: "可以。规划器提供标准画质和高画质的截图下载。",
        },
      ],
    },
    trust: {
      heading: "关于这个规划器",
      description:
        "这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。",
    },
    footer: {
      brandName: "星露谷物语农场规划器",
      description: "在浏览器中本地规划《星露谷物语》农场布局的玩家工具。",
      copyright: "© 星露谷物语农场规划器",
      planner: {
        title: "规划器",
        home: "规划器",
        farmComparison: "农场对比",
        moddedFarms: "模组农场",
      },
      explore: {
        title: "探索",
        capabilities: "使用方式",
        faq: "常见问题",
        blog: "博客",
      },
      legal: {
        title: "法律",
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
      },
    },
  },
};
