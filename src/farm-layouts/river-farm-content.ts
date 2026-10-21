import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const riverFarmCanonicalPath =
  "/stardew-valley-river-farm-layout" as const;

export type RiverFarmCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type RiverFarmCase = Readonly<{
  id: string;
  title: string;
  summary: string;
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  projectHref: string;
}>;

export type RiverFarmPageCopy = Readonly<{
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  categoryLabel: string;
  browseLabel: string;
  openPlannerLabel: string;
  casesHeading: string;
  casesDescription: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  whatIsHeading: string;
  whatIsParagraphs: readonly string[];
  enlargeImageLabel: string;
  closeImageLabel: string;
  downloadProjectLabel: string;
  howToEyebrow: string;
  howToHeading: string;
  howToSteps: readonly Readonly<{
    number: string;
    title: string;
    body: string;
  }>[];
  faqEyebrow: string;
  faqHeading: string;
  faqDescription: string;
  faqs: readonly Readonly<{ question: string; answer: string }>[];
  cover: RiverFarmCover;
  cases: readonly RiverFarmCase[];
}>;

const riverFarmPreviewWidth = 1600;
const riverFarmPreviewHeight = 1300;

const riverFarmCoverEn: RiverFarmCover = {
  imageSrc:
    "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp",
  imageOriginalSrc:
    "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization-full.webp",
  imageAlt:
    "Four Fish Ponds, bee houses, and melon rows share the north land, with a Deluxe Barn to the east, a coop to the southwest, and crab pots along the shores.",
  imageWidth: riverFarmPreviewWidth,
  imageHeight: riverFarmPreviewHeight,
  caption:
    "Four Fish Ponds and bee houses share the north land in this Stardew Valley river farm layout, while a barn, a coop, and crab pots use the other islands.",
};

const riverFarmCasesEn: readonly RiverFarmCase[] = [
  {
    id: "01-namsai-summer-island-specialization",
    title: "Four Fish Ponds on the North Land",
    summary:
      "Four Fish Ponds share the north land with bee houses, a melon and sunflower patch, the farmhouse, and the greenhouse. A deluxe barn stands on the east island, a coop on the southwest island, and crab pots follow the shores. This Stardew Valley river farm layout uses the bridges to keep the ponds and the animals on different islands.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization-full.webp",
    imageAlt:
      "Summer Riverland Farm with four Fish Ponds and bee houses on the north land, a Deluxe Barn on the east island, and crab pots along the shores.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.json",
  },
  {
    id: "02-spring-perfection-island-zones",
    title: "Five Fish Ponds on the Southern Islands",
    summary:
      "Strawberry and cauliflower plots sit on the north land, southeast of the greenhouse and south of the farmhouse. A fenced barn and coop yard with silos occupies the center island. Three Fish Ponds sit on the southwest island and two on the south island. This Stardew Valley river farm layout uses five Fish Ponds, with crops, animals, and ponds on separate islands.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-02-spring-perfection-island-zones.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-02-spring-perfection-island-zones-full.webp",
    imageAlt:
      "Spring Riverland Farm with strawberry and cauliflower plots on the north land, a barn and coop on the center island, and five Fish Ponds on the southern islands.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-02-spring-perfection-island-zones.json",
  },
  {
    id: "03-y6-fall-perfection-pumpkin-hub",
    title: "Pumpkin Rows on the Center Island",
    summary:
      "Two Junimo Huts sit in the pumpkin field that fills the center island. Sheds cluster by the farmhouse on the north land, and the barn and coops stay on the far west island. The ponds stay off that field: one beside the mill, two on the east island, and one on the south island. This Stardew Valley river farm layout uses four Fish Ponds.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub-full.webp",
    imageAlt:
      "Fall Riverland Farm with a large pumpkin field and two Junimo Huts on the center island, sheds on the north land, and four Fish Ponds on separate islands.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub.json",
  },
  {
    id: "04-stardewplan-beauty-trellis",
    title: "Grape Trellises and Three Fish Ponds",
    summary:
      "Grape trellises cover the north land and run between two Junimo Huts on the center island, with paths along the rows. One pond shares the west island with a cabin and a shed, and two ponds sit on the east island. The barns stay on the southwest island. This Stardew Valley river farm layout places three Fish Ponds.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis-full.webp",
    imageAlt:
      "Summer Riverland Farm with grape trellises on the north land and center island, two Junimo Huts in the center field, and three Fish Ponds on the west and east islands.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis.json",
  },
  {
    id: "05-y6-fall-rustic-shed-village",
    title: "Sheds around One North-Land Pond",
    summary:
      "Two sheds stand north of the pumpkin field on the center island, and bee houses with flowers fill the east island. The north land keeps the greenhouse, the farmhouse, and one Fish Pond. This Stardew Valley river farm layout treats the sheds as a small village.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village-full.webp",
    imageAlt:
      "Fall Riverland Farm with one Fish Pond and cranberries on the north land, pumpkin rows south of two sheds on the center island, and bee houses on the east island.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village.json",
  },
  {
    id: "06-y12-summer-ranch-center",
    title: "Barn and Coop on the Center Island",
    summary:
      "A deluxe barn, a deluxe coop, and one pond share the center island, with melons by the farmhouse. The east island pairs a pond with crab pots, and the west and southwest islands hold one pond each. This Stardew Valley river farm layout spreads four Fish Ponds across separate islands.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-06-y12-summer-ranch-center.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-06-y12-summer-ranch-center-full.webp",
    imageAlt:
      "Summer Riverland Farm with a Deluxe Barn and Deluxe Coop on the center island, melon rows by the farmhouse, and crab pots beside a Fish Pond on the east island.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-06-y12-summer-ranch-center.json",
  },
  {
    id: "07-y5-fall-purple-paint-town",
    title: "Greenhouse on the West Island",
    summary:
      "The greenhouse stands on the west island beside a pond, away from the farmhouse. The north land shows a purple slime hutch, and a barn and coop occupy the center island. Two ponds sit on the east island, with one on the southwest island and one on the south island. This Stardew Valley river farm layout uses five Fish Ponds.",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town-full.webp",
    imageAlt:
      "Fall Riverland Farm with the greenhouse and one Fish Pond on the west island, a purple Slime Hutch on the north land, and five Fish Ponds spread across the islands.",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town.json",
  },
];

const riverFarmCoverZhCn: RiverFarmCover = {
  imageSrc:
    "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp",
  imageOriginalSrc:
    "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization-full.webp",
  imageAlt:
    "北侧大地有四座鱼塘、蜂房和甜瓜田，东岛是豪华畜棚，西南岛是鸡舍，岸边分布蟹笼。",
  imageWidth: riverFarmPreviewWidth,
  imageHeight: riverFarmPreviewHeight,
  caption:
    "这套星露谷物语河流农场布局把四座鱼塘和蜂房放在北侧大地，畜棚、鸡舍和蟹笼则分布在其他岛屿。",
};

const riverFarmCasesZhCn: readonly RiverFarmCase[] = [
  {
    id: "01-namsai-summer-island-specialization",
    title: "北侧大地的四座鱼塘",
    summary:
      "四座鱼塘、蜂房、甜瓜和向日葵与农舍、温室同在北侧大地。东岛是豪华畜棚，西南岛是鸡舍，蟹笼沿河岸分布。这套星露谷物语河流农场布局用木桥把鱼塘和畜牧分到不同岛屿。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization-full.webp",
    imageAlt:
      "夏季河流农场：北侧大地有四座鱼塘和蜂房，东岛是豪华畜棚，岸边排列蟹笼。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.json",
  },
  {
    id: "02-spring-perfection-island-zones",
    title: "南侧岛屿上的五座鱼塘",
    summary:
      "草莓和花椰菜种在北侧大地，位于温室东南侧、农舍南侧。中央岛是围起来的畜棚、鸡舍和筒仓。西南岛有三座鱼塘，南岛有两座鱼塘。这套星露谷物语河流农场布局一共使用五座鱼塘，把作物、畜牧和鱼塘分岛安排。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-02-spring-perfection-island-zones.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-02-spring-perfection-island-zones-full.webp",
    imageAlt:
      "春季河流农场：北侧是草莓和花椰菜，中央岛是畜棚与鸡舍，南侧岛屿共有五座鱼塘。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-02-spring-perfection-island-zones.json",
  },
  {
    id: "03-y6-fall-perfection-pumpkin-hub",
    title: "中央岛上的南瓜田",
    summary:
      "两座祝尼魔小屋放在占满中央岛的南瓜田里。工棚集中在北侧农舍一带，畜棚和鸡舍留在最西侧岛屿。鱼塘不进南瓜田：磨坊旁一座，东岛两座，南岛一座。这套星露谷物语河流农场布局一共使用四座鱼塘。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub-full.webp",
    imageAlt:
      "秋季河流农场：中央岛是大片南瓜田和两座祝尼魔小屋，北侧有多座工棚，四座鱼塘分在不同岛屿。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub.json",
  },
  {
    id: "04-stardewplan-beauty-trellis",
    title: "葡萄棚架与三座鱼塘",
    summary:
      "葡萄棚架覆盖北侧大地，并穿过中央岛两座祝尼魔小屋之间的田行，道路贴着这些田行。西岛的小屋和工棚旁有一座鱼塘，东岛有两座鱼塘，畜棚留在西南岛。这套星露谷物语河流农场布局一共放置三座鱼塘。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis-full.webp",
    imageAlt:
      "夏季河流农场：北侧大地和中央岛是葡萄棚架，中央田里有两座祝尼魔小屋，西岛和东岛共有三座鱼塘。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis.json",
  },
  {
    id: "05-y6-fall-rustic-shed-village",
    title: "北侧一座鱼塘与散落工棚",
    summary:
      "中央岛的两座工棚位于南瓜田北侧，东岛则是蜂房和花。北侧大地保留温室、农舍和一座鱼塘。这套星露谷物语河流农场布局把工棚当成小村落。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village-full.webp",
    imageAlt:
      "秋季河流农场：北侧大地有一座鱼塘和蔓越莓，中央岛两座工棚南侧是南瓜田，东岛排列蜂房。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village.json",
  },
  {
    id: "06-y12-summer-ranch-center",
    title: "中央岛上的畜棚与鸡舍",
    summary:
      "豪华畜棚、豪华鸡舍和一座鱼塘同在中央岛，甜瓜在北侧农舍旁。东岛的鱼塘边排着蟹笼，西侧和西南岛各有一座鱼塘。这套星露谷物语河流农场布局把四座鱼塘分到不同岛屿。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-06-y12-summer-ranch-center.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-06-y12-summer-ranch-center-full.webp",
    imageAlt:
      "夏季河流农场：中央岛是豪华畜棚和豪华鸡舍，农舍旁有甜瓜田，东岛鱼塘旁边排列蟹笼。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-06-y12-summer-ranch-center.json",
  },
  {
    id: "07-y5-fall-purple-paint-town",
    title: "温室移到西岛",
    summary:
      "温室移到西岛，旁边是一座鱼塘，不再贴着农舍。北侧大地能看到紫色史莱姆屋，中央岛是畜棚和鸡舍。东岛有两座鱼塘，西南岛和南岛各有一座。这套星露谷物语河流农场布局一共使用五座鱼塘。",
    imageSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town.webp",
    imageOriginalSrc:
      "/farm-layouts/river/images/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town-full.webp",
    imageAlt:
      "秋季河流农场：温室和一座鱼塘在西岛，北侧大地有紫色史莱姆屋，五座鱼塘分布在不同岛屿。",
    imageWidth: riverFarmPreviewWidth,
    imageHeight: riverFarmPreviewHeight,
    projectHref:
      "/farm-layouts/river/projects/stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town.json",
  },
];

const riverFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, RiverFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley River Farm Layout",
    metaTitle: "Stardew Valley River Farm Layouts: 7 Island Plans",
    description:
      "Compare seven Riverland Farm plans: north-land ponds, southern fish ponds, a center pumpkin field, grape trellises, a shed village, a center-island ranch, and a greenhouse moved west.",
    intro:
      "Wooden bridges connect the islands of Riverland Farm. Each Stardew Valley river farm layout below gives those islands a different mix of ponds, crops, animals, and sheds.",
    categoryLabel: "Riverland Farm",
    browseLabel: "Browse the 7 layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Choose a Stardew Valley river farm layout",
    casesDescription:
      "Compare four north-land ponds, five southern ponds, a center pumpkin field, grape trellises, one pond among sheds, a center-island barn and coop, and a greenhouse on the west island. Each option is a Stardew Valley river farm layout for Riverland Farm.",
    ctaHeading: "Start from a Stardew Valley river farm layout",
    ctaDescription:
      "Download a Stardew Valley river farm layout JSON project and import it with Library → Import JSON. Adjust the islands for your own plans. The file is a planner project, not a game save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Stardew Valley river farm layout?",
    whatIsParagraphs: [
      "Riverland Farm breaks the buildable ground into islands joined by bridges. A Stardew Valley river farm layout is a planner project that places crops, buildings, paths, and Fish Ponds on those islands.",
      "The seven plans give the islands different jobs, from a north-land pond group and southern pond rows to pumpkin fields, grape trellises, sheds, bee houses, and crab pots. Read the island counts in each Stardew Valley river farm layout before you import one.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley river farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Choose a Stardew Valley river farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, then use Library → Import JSON and select the downloaded file. The file opens one Stardew Valley river farm layout in the planner.",
      },
      {
        number: "03",
        title: "Adjust it to your plans",
        body: "Move crops, paths, buildings, and decorations in the planner. Use the Stardew Valley river farm layout as a starting plan, not as a game save.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Riverland layout questions",
    faqDescription:
      "See which map these plans use, how to pick an island arrangement, and how importing a Stardew Valley river farm layout stays inside the planner.",
    faqs: [
      {
        question: "Which map does a Stardew Valley river farm layout use?",
        answer:
          "These seven projects use the base-game Riverland Farm. The islands and bridges keep the original map shape; each Stardew Valley river farm layout changes the placement of crops, buildings, paths, and Fish Ponds.",
      },
      {
        question: "How should I choose a Stardew Valley river farm layout?",
        answer:
          "Start from the island job you want to study: four north-land ponds, five southern ponds, a center pumpkin field, grape trellises with three Fish Ponds, a single pond among sheds, a center-island barn and coop, or a greenhouse on the west island. Each Stardew Valley river farm layout keeps those jobs apart.",
      },
      {
        question: "Can I change a layout after importing its JSON?",
        answer:
          "Yes. A Stardew Valley river farm layout opens as a planner project. Move crops, paths, buildings, and decorations, then download the revised project if you want another copy.",
      },
      {
        question: "Does importing a project change my game save?",
        answer:
          "No. The JSON is a planner project, not a game save. Import a Stardew Valley river farm layout through Library → Import JSON and use the Riverland arrangement as a visual reference.",
      },
      {
        question: "How many Fish Ponds are in the grape-trellis plan?",
        answer:
          "The grape-trellis Stardew Valley river farm layout has three Fish Ponds: one on the west island beside a Cabin and a Shed, and two on the east island.",
      },
    ],
    cover: riverFarmCoverEn,
    cases: riverFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语河流农场布局",
    metaTitle: "星露谷物语河流农场布局：7 个岛屿方案",
    description:
      "比较七套河流农场方案：北侧鱼塘、南侧鱼塘、中央南瓜田、葡萄棚架、工棚村落、中央岛牧场，以及移到西岛的温室。",
    intro:
      "河流农场的岛屿之间由木桥相连。下面每套星露谷物语河流农场布局，都为岛屿安排了不同的鱼塘、作物、畜牧和工棚分区。",
    categoryLabel: "河流农场",
    browseLabel: "浏览 7 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "选择一套星露谷物语河流农场布局",
    casesDescription:
      "对比北侧四座鱼塘、南侧五座鱼塘、中央南瓜田、葡萄棚架、单座鱼塘与工棚、中央岛畜棚鸡舍，以及移到西岛的温室。每个选项都是一套星露谷物语河流农场布局。",
    ctaHeading: "从一套星露谷物语河流农场布局开始",
    ctaDescription:
      "下载一套星露谷物语河流农场布局的 JSON 项目，通过本地项目 → 导入 JSON 打开。再按自己的计划调整岛屿。这个文件是规划器项目，不是游戏存档。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是星露谷物语河流农场布局？",
    whatIsParagraphs: [
      "河流农场把可建设的地面分成岛屿，再用木桥连接。一套星露谷物语河流农场布局是在这些岛屿上安排作物、建筑、道路和鱼塘的规划器项目。",
      "七个例子给岛屿分配了不同工作：北侧鱼塘、南侧鱼塘、南瓜田、葡萄棚架、工棚、蜂房和蟹笼。导入之前，可以先比较每套星露谷物语河流农场布局在各岛上的数量。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语河流农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "从上方选择一套星露谷物语河流农场布局，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，使用本地项目 → 导入 JSON，然后选中下载的文件。这个文件会在规划器中打开一套星露谷物语河流农场布局。",
      },
      {
        number: "03",
        title: "按计划调整",
        body: "在规划器里移动作物、道路、建筑和装饰。把这套星露谷物语河流农场布局当作起点，而不是游戏存档。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "河流农场布局常见问题",
    faqDescription:
      "了解这些方案使用的地图、如何按岛屿分工挑选，以及导入一套星露谷物语河流农场布局为何只发生在规划器里。",
    faqs: [
      {
        question: "星露谷物语河流农场布局使用哪张地图？",
        answer:
          "这七个项目都使用原版河流农场。岛屿与木桥保持地图原貌，星露谷物语河流农场布局展示的是作物、建筑、道路和鱼塘的摆放。",
      },
      {
        question: "应该怎么选择一套星露谷物语河流农场布局？",
        answer:
          "先看你想研究的岛屿分工：北侧四座鱼塘、南侧五座鱼塘、中央南瓜田、带三座鱼塘的葡萄棚架、工棚旁的一座鱼塘、中央岛畜棚鸡舍，或移到西岛的温室。每套星露谷物语河流农场布局都把这些工作分开安排。",
      },
      {
        question: "导入 JSON 之后还能修改吗？",
        answer:
          "可以。星露谷物语河流农场布局会作为规划器项目打开。你可以移动作物、道路、建筑和装饰，也可以把改过的项目再下载一份。",
      },
      {
        question: "导入项目会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目，不是游戏存档。通过本地项目 → 导入 JSON 打开一套星露谷物语河流农场布局后，把它作为河流农场摆放的视觉参考。",
      },
      {
        question: "葡萄棚架那套有几座鱼塘？",
        answer:
          "葡萄棚架这套星露谷物语河流农场布局有三座鱼塘：一座在西岛，位于小屋和工棚旁边，另外两座在东岛。",
      },
    ],
    cover: riverFarmCoverZhCn,
    cases: riverFarmCasesZhCn,
  },
};

export function getRiverFarmPageCopy(
  locale: PublicLocale,
): RiverFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported River Farm page locale: ${String(locale)}.`);
  }

  return riverFarmPageCopyByLocale[locale];
}
