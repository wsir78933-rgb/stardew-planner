import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const fishFarmCanonicalPath = "/stardew-valley-fish-farm-layout" as const;

export type FishFarmCase = Readonly<{
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

export type FishFarmPageCopy = Readonly<{
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
  cases: readonly FishFarmCase[];
}>;

const fishFarmCasesEn: readonly FishFarmCase[] = [
  {
    id: "roe-pond-grid",
    title: "A 31-Pond Roe Grid",
    summary:
      "This Stardew Valley fish farm layout groups 31 fish ponds across several islands, with two sheds beside the pond zones. Paths connect the islands, while a small flower patch keeps the open crop area limited.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-01.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-01.png",
    imageAlt:
      "Riverland Farm plan with 31 fish ponds grouped across connected islands, plus two sheds and a greenhouse near the central pond area.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-01.json",
  },
  {
    id: "island-zones",
    title: "One Role for Each Island",
    summary:
      "For a Stardew Valley fish farm layout with clear zones, assign separate roles to the main islands: crops by the farmhouse, barn and coop buildings on the central island, two sheds, and 11 fish ponds on smaller islands. Bridges and paths connect the zones in a clear route.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-02.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-02.png",
    imageAlt:
      "Riverland Farm divided by island, with crops near the farmhouse, livestock buildings on the central island, sheds, and fish ponds on smaller islands.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-02.json",
  },
  {
    id: "fishing-village",
    title: "A Crab-Pot Fishing Village",
    summary:
      "This Stardew Valley fish farm layout includes 493 Crab Pots around the shoreline, along with 11 fish ponds and one Fish Smoker. Docklike paths connect the work areas, while the outdoor plot is kept to 36 crop tiles.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-03.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-03.png",
    imageAlt:
      "Riverland fishing village plan with crab pots along the water, fish ponds, a fish smoker, and a small crop plot connected by paths.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-03.json",
  },
  {
    id: "central-crop-island",
    title: "A Large Field on the Central Island",
    summary:
      "A Stardew Valley fish farm layout can make the largest island the crop zone: this plan has 366 Starfruit tiles with 18 Iridium Sprinklers and six fish ponds on neighboring islands.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-04.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-04.png",
    imageAlt:
      "Riverland Farm layout with a large Starfruit field and Iridium Sprinklers on the central island, with six fish ponds on nearby islands.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-04.json",
  },
  {
    id: "southwest-livestock",
    title: "Livestock on the Southwest Islands",
    summary:
      "This Stardew Valley fish farm layout groups a deluxe barn, barn, deluxe coop, coop, two silos, a mill, and a well on the southwest islands. Ten fish ponds sit elsewhere, with 31 crop tiles near the farmhouse.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-05.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-05.png",
    imageAlt:
      "Riverland Farm plan with barns, coops, two silos, a mill, and a well grouped on the southwest islands, with fish ponds on other islands.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-05.json",
  },
  {
    id: "riverside-retreat",
    title: "A Riverside Retreat",
    summary:
      "Use this Stardew Valley fish farm layout as a scenic option: it decorates the islands with paths, fences, trees, benches, and lights, with three fish ponds and 19 flower tiles for a light fishing theme. The paths link the shoreline areas.",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-06.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-06.png",
    imageAlt:
      "Decorative Riverland Farm plan with three fish ponds, flower crops, paths, fences, trees, benches, and lights across its islands.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-06.json",
  },
];

const fishFarmCasesZhCn: readonly FishFarmCase[] = [
  {
    id: "roe-pond-grid",
    title: "31 座鱼塘水产网格",
    summary:
      "这套 Riverland 河流农场布局把 31 座鱼塘分布在多座岛屿上，塘区旁安排了两座工棚，并用道路连接各个区域。屋旁只留一小片花田，整体以鱼塘分区为主。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-01.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-01.png",
    imageAlt:
      "河流农场布局：多座相连岛屿上分布着 31 座鱼塘，中央塘区旁还有两座工棚和温室。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-01.json",
  },
  {
    id: "island-zones",
    title: "一岛一职分区",
    summary:
      "为主要岛屿划分不同用途：屋旁安排作物田，中间岛集中摆放畜棚与鸡舍，另有两座工棚，小岛上分布 11 座鱼塘。道路和桥梁把各个区域连接起来，路线清楚。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-02.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-02.png",
    imageAlt:
      "河流农场一岛一职布局：屋旁作物田、中间岛的畜牧建筑、工棚与小岛鱼塘由道路和桥梁连接。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-02.json",
  },
  {
    id: "fishing-village",
    title: "蟹笼渔村",
    summary:
      "这套项目沿水岸摆放了 493 个蟹笼，并安排 11 座鱼塘和一台鱼熏炉。栈道连接岸边与作业区，室外种植区保留 36 格作物，渔村主题一目了然。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-03.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-03.png",
    imageAlt:
      "河流农场渔村布局：蟹笼沿水岸排列，岛上有鱼塘、鱼熏炉和由栈道连接的小块作物田。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-03.json",
  },
  {
    id: "central-crop-island",
    title: "中岛大田与小岛鱼塘",
    summary:
      "中间大岛种植 366 格杨桃，配有 18 个铱洒水器；周边小岛另放 6 座鱼塘。这套规划把主要种植面积集中在一块大田。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-04.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-04.png",
    imageAlt:
      "河流农场布局：中间大岛种满杨桃并摆放铱洒水器，周边小岛上有六座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-04.json",
  },
  {
    id: "southwest-livestock",
    title: "西南岛屿畜牧区",
    summary:
      "把豪华畜棚、畜棚、豪华鸡舍、鸡舍、两座筒仓、磨坊和水井集中安排在西南岛屿。其他岛屿上分布着 10 座鱼塘，屋旁保留 31 格作物。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-05.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-05.png",
    imageAlt:
      "河流农场布局：畜棚、鸡舍、两座筒仓、磨坊和水井集中在西南岛屿，其他岛屿上安排鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-05.json",
  },
  {
    id: "riverside-retreat",
    title: "水岸漫步布局",
    summary:
      "用道路、围栏、树木、长椅和灯光装饰各座岛屿，再以 3 座鱼塘和 19 格花田点出轻量水产主题。道路沿水岸串起岛屿，适合偏重景观的规划。",
    imageSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-06.webp",
    imageOriginalSrc:
      "/farm-layouts/fish/images/stardew-valley-fish-farm-layout-06.png",
    imageAlt:
      "装饰风河流农场布局：多座岛屿上有三座鱼塘、花田、道路、围栏、树木、长椅和灯光。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-06.json",
  },
];

const fishFarmPageCopyByLocale: Readonly<Record<PublicLocale, FishFarmPageCopy>> = {
  en: {
    title: "Stardew Valley Fish Farm Layout",
    metaTitle: "Stardew Valley Fish Farm Layouts: 6 Riverland Ideas",
    description:
      "Explore six Stardew Valley fish farm layouts for Riverland Farm: a pond grid, island zones, a crab-pot village, a central crop island, livestock islands, and a riverside retreat. Preview each plan or download its JSON project.",
    intro:
      "Riverland Farm’s islands and bridges make room for a range of fish-focused layouts. These Stardew Valley fish farm layout plans give fish ponds, crops, livestock, paths, and decoration different roles. Each includes a JSON project made in the Stardew Valley Planner that you can download and adapt.",
    categoryLabel: "Farm maps",
    browseLabel: "Browse all six layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Choose a Riverland layout for the way you play",
    casesDescription:
      "Compare six Stardew Valley fish farm layout ideas, from a 31-pond grid and an island-by-island plan to a crab-pot village, central crop field, livestock area, and decorated riverside route.",
    ctaHeading: "Make a Riverland layout your own",
    ctaDescription:
      "Download the Stardew Valley fish farm layout project that fits your plans, import its JSON, and adjust the island zones, buildings, and crop areas to match your save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Stardew Valley Fish Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Fish Farm layout uses Riverland Farm’s islands and bridges to organize fish ponds, crops, buildings, and paths. The six plans below give these areas different roles, from pond-heavy zones to a scenic riverside route.",
      "These Stardew Valley fish farm layout projects explore different priorities, including a 31-pond grid, island-by-island zones, a crab-pot village, a central crop field, livestock, and riverside decoration. Download a JSON project to edit it in the planner.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Fish Farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Download a layout",
        body: "Choose a Stardew Valley fish farm layout from the six Riverland plans above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the project you downloaded.",
      },
      {
        number: "03",
        title: "Adapt it to your save",
        body: "Adjust the crops, buildings, and placements to match your map and the buildings you have unlocked.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Valley Fish Farm layout questions",
    faqDescription:
      "Learn which map these fish farm layouts use, how many ponds each includes, and how to edit a downloaded project.",
    faqs: [
      {
        question: "Is there a separate Fish Farm map in Stardew Valley?",
        answer:
          "No. These examples use Riverland Farm, the map with connected islands. “Fish farm” describes the pond and fishing theme of the plans.",
      },
      {
        question: "How many fish ponds are in each layout?",
        answer:
          "The six Stardew Valley fish farm layout projects include 31, 11, 11, 6, 10, and 3 Fish Ponds in order. The first layout has the largest pond group; the last keeps ponds to a small accent.",
      },
      {
        question: "Can I put a downloaded project directly into my game save?",
        answer:
          "The JSON file opens as a planner project. Use it as a starting plan, then check building availability and placements against your save before recreating it in game.",
      },
      {
        question: "Can I change the layout after importing it?",
        answer:
          "Yes. After importing, you can edit the Stardew Valley fish farm layout by moving buildings, changing crop areas, and adjusting paths to fit your own Riverland farm.",
      },
    ],
    cases: fishFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语鱼塘农场布局",
    metaTitle: "星露谷物语鱼塘农场布局：6 套河流农场案例",
    description:
      "查看 6 套为 Riverland Farm（河流农场）规划的星露谷物语鱼塘农场布局：鱼塘网格、一岛一职、蟹笼渔村、中岛作物田、西南畜牧区与水岸漫步。可预览完整地图或下载 JSON 项目。",
    intro:
      "这六套鱼塘主题布局都以 Riverland Farm（河流农场）为底图。多座岛屿通过桥梁相连，可以安排鱼塘、作物、畜牧、道路和装饰；每套都提供可下载的规划器 JSON 项目，方便按自己的存档继续调整。",
    categoryLabel: "农场地图",
    browseLabel: "浏览全部 6 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "六种河流农场分区思路",
    casesDescription:
      "从 31 座鱼塘的水产网格，到一岛一职、蟹笼渔村、中岛作物田、西南畜牧和水岸装饰，比较六种星露谷物语鱼塘农场布局。",
    ctaHeading: "按自己的想法调整河流农场",
    ctaDescription:
      "下载喜欢的规划器项目并导入 JSON，再根据自己的存档调整岛屿分区、建筑和作物区域。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是星露谷物语鱼塘农场布局？",
    whatIsParagraphs: [
      "星露谷物语鱼塘农场布局以 Riverland Farm（河流农场）为底图，把鱼塘、作物、建筑和道路安排在不同岛屿上。六套案例分别侧重水产网格、岛屿分区、蟹笼渔村、中岛作物、畜牧和水岸装饰。",
      "每套规划器项目都可以下载为 JSON 文件，导入后继续编辑，让岛屿分区和摆放位置适合自己的存档。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语鱼塘农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "下载布局项目",
        body: "从上方六套河流农场布局中选择一个，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开星露谷规划器，点击“本地项目” > “导入 JSON”，再选择下载的项目文件。",
      },
      {
        number: "03",
        title: "按存档调整布局",
        body: "根据自己的地图和已解锁建筑，调整作物区域、建筑摆放和道路位置。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语鱼塘农场布局常见问题",
    faqDescription:
      "了解鱼塘农场布局使用的地图、每套案例中的鱼塘数量，以及如何导入和调整下载的项目。",
    faqs: [
      {
        question: "这些案例使用的是哪张农场地图？",
        answer:
          "这些案例使用的是由多座岛屿相连组成的 Riverland Farm（河流农场），各套布局围绕鱼塘、钓鱼和岛屿分区展开。",
      },
      {
        question: "每套布局分别有多少座鱼塘？",
        answer:
          "按页面顺序，六套项目分别包含 31、11、11、6、10 和 3 座鱼塘。第一套鱼塘最多，最后一套只少量点缀鱼塘。",
      },
      {
        question: "下载的项目可以直接放进游戏存档吗？",
        answer:
          "JSON 文件会作为规划器项目打开。可以把它当作规划起点，再根据自己的存档确认建筑是否可用、位置是否合适，然后在游戏里调整。",
      },
      {
        question: "导入后还能修改布局吗？",
        answer:
          "可以。导入的是可编辑的规划器布局，你可以移动建筑、修改作物区域和道路，让它适合自己的河流农场存档。",
      },
    ],
    cases: fishFarmCasesZhCn,
  },
};

export function getFishFarmPageCopy(locale: PublicLocale): FishFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Fish Farm page locale: ${String(locale)}.`);
  }

  return fishFarmPageCopyByLocale[locale];
}

export function getFeaturedFishFarmCase(locale: PublicLocale): FishFarmCase {
  const featuredFishFarmCaseId = "island-zones";
  const pageCopy = getFishFarmPageCopy(locale);
  const featuredFishFarmCase = pageCopy.cases.find(
    (layoutCase) => layoutCase.id === featuredFishFarmCaseId,
  );

  if (!featuredFishFarmCase) {
    throw new Error(
      `Featured Fish Farm case ${JSON.stringify(featuredFishFarmCaseId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return featuredFishFarmCase;
}
