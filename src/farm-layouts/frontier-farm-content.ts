import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const frontierFarmCanonicalPath =
  "/stardew-valley-frontier-farm-layout" as const;

export type FrontierFarmCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type FrontierFarmCase = Readonly<{
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

export type FrontierFarmPageCopy = Readonly<{
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
  cover: FrontierFarmCover;
  cases: readonly FrontierFarmCase[];
}>;

const frontierFarmCoverEn: FrontierFarmCover = {
  imageSrc:
    "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-01-dual-bank-junimo-river.webp",
  imageOriginalSrc:
    "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-01-dual-bank-junimo-river-full.webp",
  imageAlt:
    "A river runs between two developed banks, with crop fields, buildings, ponds, and paths laid out on both sides.",
  imageWidth: 1920,
  imageHeight: 800,
  caption:
    "A river forms the center line between fields, ponds, and buildings on both banks.",
};

const frontierFarmCasesEn: readonly FrontierFarmCase[] = [
  {
    id: "02-cottagecore-terraces",
    title: "Cottagecore Paths and Terraced Fields",
    summary:
      "A four-pond cluster and flower beds sit on one side of the river, while the opposite bank holds broad crop rows and orchard trees. Junimo Huts break the fields into smaller terraces in this Stardew Valley Frontier Farm layout.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo-full.webp",
    imageAlt:
      "Four Fish Ponds and flower beds sit beside the river, across from terraced crop rows and orchard trees.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo.json",
  },
  {
    id: "03-west-animals-east-crops",
    title: "West-Side Animals and East-Side Crops",
    summary:
      "Barns and Coops occupy the west side, with large crop fields across the river to the east. Five Fish Ponds and Junimo Huts sit between the fields and crossing paths, giving this Stardew Valley Frontier Farm layout clear working zones.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops-full.webp",
    imageAlt:
      "Barns and Coops line the west, while two large crop blocks and Junimo Huts fill the east side of the river.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops.json",
  },
  {
    id: "04-tapper-honey-barn",
    title: "Tapper Trees, Bee Houses, and a Southeast Field",
    summary:
      "Tree rows and Bee Houses follow the river corridor, with Barns and a Coop set among the work areas. Four crop blocks fill the southeast, keeping the fields distinct from this Stardew Valley Frontier Farm layout’s tree and animal zones.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn-full.webp",
    imageAlt:
      "Rows of trees and Bee Houses follow the river, with animal buildings nearby and four crop blocks in the southeast.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn.json",
  },
  {
    id: "05-junimo-village",
    title: "A Symmetrical Junimo Village",
    summary:
      "Paved routes and crop blocks mirror one another around the river, with buildings and cabins forming a small village nearby. The Gold Clock marks the center of this Stardew Valley Frontier Farm layout, while Junimo fields occupy the larger open sections.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village-full.webp",
    imageAlt:
      "A Gold Clock and paved routes sit between crop blocks, farm buildings, and a cluster of cabins along the river.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village.json",
  },
  {
    id: "06-ranch-ancient-fruit",
    title: "A Ranch beside an Ancient Fruit Field",
    summary:
      "Four Barns and two Coops form a ranch area west of the river, while a broad Ancient Fruit field fills the east. Junimo Huts sit beside the field, with obelisks near its northern edge in this Stardew Valley Frontier Farm layout.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit-full.webp",
    imageAlt:
      "Barns and Coops sit west of the river, opposite a large Ancient Fruit field with Junimo Huts and obelisks nearby.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit.json",
  },
  {
    id: "07-nine-fish-ponds",
    title: "A Three-by-Three Fish Pond Grid",
    summary:
      "Nine Fish Ponds form a precise three-by-three block beside a large crop field, with paths extending toward the farm buildings and river. This Stardew Valley Frontier Farm layout makes the pond grid the focal point without merging it into the planting area.",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-07-nine-pond-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-07-nine-pond-battery-full.webp",
    imageAlt:
      "Nine Fish Ponds are arranged in a three-by-three grid beside a crop field, with paths and farm buildings around them.",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-07-nine-pond-battery.json",
  },
];

const frontierFarmCoverZhCn: FrontierFarmCover = {
  imageSrc:
    "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-01-dual-bank-junimo-river.webp",
  imageOriginalSrc:
    "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-01-dual-bank-junimo-river-full.webp",
  imageAlt:
    "河流从农场中央穿过，两岸分布作物田、建筑、鱼塘和道路。",
  imageWidth: 1920,
  imageHeight: 800,
  caption: "河流成为中轴线，将两岸的田地、鱼塘和建筑串联起来。",
};

const frontierFarmCasesZhCn: readonly FrontierFarmCase[] = [
  {
    id: "02-cottagecore-terraces",
    title: "田园小路与阶梯式田区",
    summary:
      "河流一侧集中四座鱼塘和花田，另一侧则安排成片作物田与果树。祝尼魔小屋把田地分成较小区块，这套星露谷物语边境农场布局兼顾田园景观与种植分区。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo-full.webp",
    imageAlt: "河边集中排列四座鱼塘与花田，对岸是阶梯式作物田和果树。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-02-cottagecore-terraces-junimo.json",
  },
  {
    id: "03-west-animals-east-crops",
    title: "西侧畜牧区与东侧作物田",
    summary:
      "把畜棚和鸡舍集中在河西，再在东岸铺开两大片作物田。五座鱼塘和祝尼魔小屋分布在田地与道路之间，这套星露谷物语边境农场布局让畜牧与种植区一眼可辨。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops-full.webp",
    imageAlt: "河西排列畜棚和鸡舍，河东分布两大片作物田与祝尼魔小屋。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-03-fall-west-animals-east-crops.json",
  },
  {
    id: "04-tapper-honey-barn",
    title: "树液采集、蜂房与东南田区",
    summary:
      "沿河安排树木与蜂房，再把畜棚和鸡舍放在相邻的作业区。东南侧的四块田地与树木、畜牧区分开，这套星露谷物语边境农场布局呈现出清楚的用途划分。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn-full.webp",
    imageAlt: "沿河布置成排树木和蜂房，畜牧建筑在旁，东南侧是四块作物田。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-04-annotated-tapper-honey-barn.json",
  },
  {
    id: "05-junimo-village",
    title: "对称布局的祝尼魔村落",
    summary:
      "铺装道路和作物田沿河左右呼应，农场建筑与小屋在周围形成村落。金钟标记中央区域，较大的空地留给祝尼魔田，这套星露谷物语边境农场布局以对称区块串起整座农场。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village-full.webp",
    imageAlt: "金钟和铺装道路位于作物田、农场建筑与河边小屋之间。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-05-classic-symmetrical-junimo-village.json",
  },
  {
    id: "06-ranch-ancient-fruit",
    title: "牧场与上古水果田",
    summary:
      "河西以四座畜棚和两座鸡舍组成牧场区，河东的大块田地种植上古水果。祝尼魔小屋位于田边，方尖碑集中在田地北侧附近。这套星露谷物语边境农场布局把畜牧与种植安排在不同岸边。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit-full.webp",
    imageAlt: "河西分布畜棚和鸡舍，河东是大片上古水果田、祝尼魔小屋与方尖碑。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-06-y5-weathered-ranch-ancient-fruit.json",
  },
  {
    id: "07-nine-fish-ponds",
    title: "三乘三鱼塘阵列",
    summary:
      "九座鱼塘按三乘三排列，紧邻一大片作物田；道路继续通往农场建筑与河岸。这套星露谷物语边境农场布局把鱼塘集中成视觉中心，同时让种植区保持独立。",
    imageSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-07-nine-pond-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/frontier/images/stardew-valley-frontier-farm-layout-07-nine-pond-battery-full.webp",
    imageAlt: "九座鱼塘以三乘三阵列排列在作物田旁，周边有道路和农场建筑。",
    imageWidth: 1920,
    imageHeight: 800,
    projectHref:
      "/farm-layouts/frontier/projects/stardew-valley-frontier-farm-layout-07-nine-pond-battery.json",
  },
];

const frontierFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, FrontierFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley Frontier Farm Layout",
    metaTitle: "Stardew Valley Frontier Farm Layouts: 6 Ideas",
    description:
      "Explore six Stardew Valley Expanded Frontier Farm layouts, from cottagecore terraces and river-split fields to Junimo farms, ranch buildings, and fish ponds.",
    intro:
      "Frontier Farm is an optional map from Stardew Valley Expanded (SVE), separate from the base game's eight farm maps. Browse six Stardew Valley Frontier Farm layout examples shaped around its river, crop terraces, paths, and farm buildings.",
    categoryLabel: "Stardew Valley Expanded · Frontier Farm",
    browseLabel: "Browse the 6 layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Find a Frontier Farm layout that fits your plans",
    casesDescription:
      "Compare cottagecore terraces, a west-to-east farm split, riverbank work zones, a Junimo village, a ranch, and a nine-pond grid.",
    ctaHeading: "Make your Frontier Farm your own",
    ctaDescription:
      "Choose a Stardew Valley Frontier Farm layout, download its JSON project, and import it into the planner. Adjust paths, fields, and buildings to fit your save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Frontier Farm layout?",
    whatIsParagraphs: [
      "Frontier Farm is an optional Stardew Valley Expanded (SVE) farm map, separate from the eight maps in the base game. A Stardew Valley Frontier Farm layout is a visual plan for arranging crops, buildings, paths, and outdoor spaces on this expanded map.",
      "The examples use the river as a visible landmark, then place gardens, ponds, crop fields, and buildings on either side. Each Stardew Valley Frontier Farm layout offers a different way to divide those spaces.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Frontier Farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Choose a Stardew Valley Frontier Farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, click “Library”, choose “Import JSON”, then select the downloaded file.",
      },
      {
        number: "03",
        title: "Adjust it to your save",
        body: "Review the imported planner project and adjust crops, paths, buildings, and decorations to match your save. Use the Stardew Valley Frontier Farm layout as a starting point.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Frontier Farm layout questions",
    faqDescription:
      "Get answers about the SVE map, choosing a layout, and importing a project into the planner.",
    faqs: [
      {
        question: "Is Frontier Farm one of the base game maps?",
        answer:
          "No. It is an optional farm map from Stardew Valley Expanded (SVE), separate from the eight farm maps in the base game. These Stardew Valley Frontier Farm layouts are examples for planning on that expanded map.",
      },
      {
        question: "Which Stardew Valley Frontier Farm layout should I choose?",
        answer:
          "Start with the arrangement that matches your priorities: cottagecore gardens, crop rows, animal buildings, Junimo fields, or a large fish-pond block. Each Stardew Valley Frontier Farm layout uses the riverbanks and open sections in a different way.",
      },
      {
        question: "Can I change a layout after importing its JSON?",
        answer:
          "Yes. Each Stardew Valley Frontier Farm layout opens as a planner project. Move or add crops, paths, buildings, and decorative items, then download the revised project if you want to keep a copy.",
      },
      {
        question: "Does importing a project change my game save?",
        answer:
          "No. The JSON is a planner project. Import it through Library → Import JSON and use its Frontier Farm arrangement as a visual reference for your save.",
      },
    ],
    cover: frontierFarmCoverEn,
    cases: frontierFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语边境农场布局",
    metaTitle: "星露谷物语边境农场布局：6 个 SVE 案例",
    description:
      "浏览 Stardew Valley Expanded（SVE）边境农场的六套布局，比较田园阶地、作物与畜牧分区、祝尼魔农田和鱼塘安排。",
    intro:
      "Frontier Farm 是 Stardew Valley Expanded（SVE）提供的可选农场地图，不属于原版八种农场地图。这里收录六套星露谷物语边境农场布局，展示如何围绕河流安排田地、道路和建筑。",
    categoryLabel: "Stardew Valley Expanded · Frontier Farm",
    browseLabel: "浏览 6 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "选择适合你的边境农场布局",
    casesDescription:
      "从田园阶地、西畜东田、沿河作业区，到祝尼魔村落、牧场与九鱼塘阵列，对比不同的空间安排。",
    ctaHeading: "开始规划你的边境农场",
    ctaDescription:
      "选一套喜欢的星露谷物语边境农场布局，下载 JSON 项目并导入规划器。再按存档调整道路、田地和建筑，规划成适合自己的农场。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是 Frontier Farm 布局？",
    whatIsParagraphs: [
      "Frontier Farm 是 Stardew Valley Expanded（SVE）的可选农场地图，不属于原版八种农场地图。星露谷物语边境农场布局是在这张扩展地图上规划作物、建筑、道路与户外空间的方案。",
      "这些案例以河流为可见地标，在两岸安排花园、鱼塘、作物田和建筑。每套星露谷物语边境农场布局都展示了不同的区域划分思路。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语边境农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "从上方选择一套星露谷物语边境农场布局，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，点击“本地项目”，再选择“导入 JSON”并选中下载的文件。",
      },
      {
        number: "03",
        title: "按存档调整",
        body: "查看导入的规划器项目，按存档调整作物、道路、建筑和装饰。可以先用这套星露谷物语边境农场布局作为规划起点。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "Frontier Farm 布局常见问题",
    faqDescription:
      "了解 Frontier Farm 与原版地图的区别、如何选择布局，以及在规划器中导入项目的方法。",
    faqs: [
      {
        question: "Frontier Farm 属于原版农场地图吗？",
        answer:
          "不属于。它是 Stardew Valley Expanded（SVE）提供的可选地图，与原版八种农场地图不同。这里的星露谷物语边境农场布局案例都围绕这张扩展地图规划。",
      },
      {
        question: "应该从哪套星露谷物语边境农场布局开始？",
        answer:
          "可以先按自己的规划重点挑选：田园花园、作物田、畜牧建筑、祝尼魔田地，或集中排列的鱼塘。每套星露谷物语边境农场布局对河岸和开阔区域都有不同安排。",
      },
      {
        question: "导入 JSON 后还能修改布局吗？",
        answer:
          "可以。每套星露谷物语边境农场布局都会作为规划器项目打开，你可以移动或添加作物、道路、建筑和装饰物，也可以下载修改后的项目留存。",
      },
      {
        question: "导入项目会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目文件，可从“本地项目”选择“导入 JSON”打开，再把其中的边境农场安排作为自己存档的布局参考。",
      },
    ],
    cover: frontierFarmCoverZhCn,
    cases: frontierFarmCasesZhCn,
  },
};

export function getFrontierFarmPageCopy(
  locale: PublicLocale,
): FrontierFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Frontier Farm page locale: ${String(locale)}.`);
  }

  return frontierFarmPageCopyByLocale[locale];
}
