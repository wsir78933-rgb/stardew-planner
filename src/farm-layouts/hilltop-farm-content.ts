import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const hilltopFarmCanonicalPath =
  "/stardew-valley-hilltop-farm-layout" as const;

export type HilltopFarmCase = Readonly<{
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

export type HilltopFarmPageCopy = Readonly<{
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
  cases: readonly HilltopFarmCase[];
}>;

const hilltopFarmCasesEn: readonly HilltopFarmCase[] = [
  {
    id: "naturalistic-village",
    title: "Naturalistic Village",
    summary:
      "This hilltop farm layout puts five cabins among trees and paths beside the river. Crop rows fill the middle, while five silos and two deluxe barns stand on the west. Two fish ponds sit by the lower left water, and the fields hold 16 iridium sprinklers.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.jpg",
    imageAlt:
      "Spring hilltop map with cabins and trees along the river, central crop rows, western silos and barns, and two fish ponds at the lower left.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.json",
  },
  {
    id: "victorian-homestead",
    title: "River Homestead",
    summary:
      "A greenhouse and red roofed buildings sit above the river, with purple fruit trees on the upper right. A barn and silo stand by the water, crop rows fill the lower left, and four fish ponds line the east. Cobblestone paths join those zones.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.jpg",
    imageAlt:
      "Spring hilltop map with a greenhouse and red roofed buildings above the river, purple fruit trees, a barn and silo, crop rows, and four eastern fish ponds.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.json",
  },
  {
    id: "peak-to-ranch",
    title: "Peak to Ranch",
    summary:
      "The farmhouse and sheds stay on the upper ground. A deluxe barn, coops, and a slime hutch sit lower down, with two fish ponds and fenced crop blocks through the middle and east. The project places 6 bee houses and 11 iridium sprinklers.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.jpg",
    imageAlt:
      "Spring hilltop map with upper sheds and a farmhouse, lower barns, coops, and a slime hutch, plus fenced crops and two fish ponds.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.json",
  },
  {
    id: "sprinkler-forest",
    title: "Sprinkler Forest",
    summary:
      "Pine trees stand around several crop blocks on this summer plan. This hilltop farm layout places 50 quality sprinklers in those fields, along with 26 bee houses, four fish ponds, a barn, and a coop.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.jpg",
    imageAlt:
      "Summer hilltop map with pine trees around crop blocks, fish ponds, a barn, a coop, and a greenhouse near the river.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.json",
  },
  {
    id: "urbanized-paths",
    title: "Urban Paths",
    summary:
      "Weathered floors and wood paths connect the greenhouse, the crop rows, and five fish ponds at the lower left. Obelisks and a gold clock stand near the farmhouse, and a slime hutch sits on the left.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.jpg",
    imageAlt:
      "Spring hilltop map with paths linking a central greenhouse, crop rows, five lower left fish ponds, obelisks, and a slime hutch.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.json",
  },
  {
    id: "quarry-ranch",
    title: "Quarry Ranch",
    summary:
      "This hilltop farm layout places three deluxe barns, two deluxe coops, and three silos on the left side beside the rocky quarry edge. Crop plots cross the river, 26 bee houses sit with the fields, and two fish ponds are on the upper ground.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.jpg",
    imageAlt:
      "Summer hilltop map with barns, coops, and silos beside the rocky left edge, crop plots across the river, and two upper fish ponds.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.json",
  },
  {
    id: "heart-apiary",
    title: "Fall Apiary",
    summary:
      "Fall trees and 13 mushroom trees color the map. A group of 69 bee houses is the main cluster, with two deluxe barns, two deluxe coops, and one fish pond on the west.",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.jpg",
    imageAlt:
      "Fall hilltop map with autumn trees, mushroom trees, a large bee house group, western barns and coops, and one fish pond.",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.json",
  },
];

const hilltopFarmCasesZhCn: readonly HilltopFarmCase[] = [
  {
    id: "naturalistic-village",
    title: "自然村落",
    summary:
      "五座小屋分布在河边的树木和道路之间，中部是成片作物田，西侧有五座筒仓和两座豪华畜棚。左下方水边有两座鱼塘，田里放了 16 个铱洒水器。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.jpg",
    imageAlt:
      "春季山顶农场：河边有小屋和树木，中部是作物田，西侧有筒仓和畜棚，左下有两座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-01-y7-naturalistic-village-perfection.json",
  },
  {
    id: "victorian-homestead",
    title: "河畔宅院",
    summary:
      "温室和红顶建筑在河的上方，右上角有紫色果树。河边有一座畜棚和一座筒仓，左下是作物田，东侧排着四座鱼塘。卵石路把这些区域连在一起。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.jpg",
    imageAlt:
      "春季山顶农场：河上方有温室和红顶建筑，右上有紫色果树，河边有畜棚和筒仓，东侧有四座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-02-modded-white-victorian-homestead.json",
  },
  {
    id: "peak-to-ranch",
    title: "高地到牧场",
    summary:
      "农舍和棚屋留在高处，豪华畜棚、鸡舍和史莱姆屋在更低的位置。中部和东侧有两座鱼塘，以及围起来的作物田。项目里有 6 个蜂房和 11 个铱洒水器。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.jpg",
    imageAlt:
      "春季山顶农场：高处是农舍和棚屋，低处有畜棚、鸡舍和史莱姆屋，旁边是围起来的作物田和两座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-03-sofluffin-peak-to-ranch.json",
  },
  {
    id: "sprinkler-forest",
    title: "洒水器林地",
    summary:
      "这张夏季图上，松树围着几块作物田。田里放了 50 个优质洒水器，另外还有 26 个蜂房、四座鱼塘、一座畜棚和一座鸡舍。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.jpg",
    imageAlt:
      "夏季山顶农场：松树围着作物田，附近有鱼塘、畜棚、鸡舍，河边还有温室。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-04-quality-sprinkler-forest-midgame.json",
  },
  {
    id: "urbanized-paths",
    title: "城镇式道路",
    summary:
      "风化地板和木制道路把温室、作物田和左下角的五座鱼塘连在一起。方尖碑和黄金时钟靠近农舍，左侧还有史莱姆屋。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.jpg",
    imageAlt:
      "春季山顶农场：道路连接中央温室、作物田和左下五座鱼塘，农舍附近有方尖碑，左侧有史莱姆屋。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-05-y5-hires-urbanized-paths.json",
  },
  {
    id: "quarry-ranch",
    title: "采石场牧场",
    summary:
      "三座豪华畜棚、两座豪华鸡舍和三座筒仓占着左侧，紧挨岩石采石场边缘。作物田跨过河流，田边有 26 个蜂房，高处还有两座鱼塘。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.jpg",
    imageAlt:
      "夏季山顶农场：左侧岩石边排列着畜棚、鸡舍和筒仓，作物田跨过河流，高处有两座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-06-greenroof-quarry-ranch.json",
  },
  {
    id: "heart-apiary",
    title: "秋季蜂园",
    summary:
      "地图是秋季，另外种了 13 棵蘑菇树。69 个蜂房组成主要的蜂箱区，西侧有两座豪华畜棚、两座豪华鸡舍和一座鱼塘。",
    imageSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.webp",
    imageOriginalSrc:
      "/farm-layouts/hilltop/images/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.jpg",
    imageAlt:
      "秋季山顶农场：秋色树木和蘑菇树之间有一大片蜂房，西侧是畜棚、鸡舍和一座鱼塘。",
    imageWidth: 2560,
    imageHeight: 2080,
    projectHref:
      "/farm-layouts/hilltop/projects/stardew-valley-hilltop-farm-layout-07-y7-fall-perfection-heart-apiary.json",
  },
];

const hilltopFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, HilltopFarmPageCopy>
> = {
  en: {
    title: "Hilltop Farm Layout Ideas",
    metaTitle: "7 Hilltop Farm Layout Ideas",
    description:
      "Browse seven hilltop farm layout projects: a cabin village, a river homestead, a ranch below the upper buildings, sprinkler fields among pines, linked paths, a quarry barn row, and a fall apiary. Download a JSON file and import it in the planner.",
    intro:
      "The river, cliffs, and open ground leave several ways to group crops, animals, and buildings. Each hilltop farm layout is a planner JSON project you can download, with those placements already set.",
    categoryLabel: "Farm maps",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven hilltop farm layout plans",
    casesDescription:
      "Look through a cabin village, a river homestead, a ranch under the upper buildings, pine fields with quality sprinklers, linked paths, barns beside the quarry, and a fall apiary. Every hilltop farm layout uses the same map file.",
    ctaHeading: "Start from a hilltop farm layout",
    ctaDescription:
      "Download the hilltop farm layout JSON whose zones you want, import it, and move buildings, crops, and paths while the imported map stays in place.",
    ctaButtonLabel: "Plan with this map",
    whatIsHeading: "What is a hilltop farm layout?",
    whatIsParagraphs: [
      "A hilltop farm layout is a planner project for Stardew Valley's Hilltop Farm. These seven examples keep that map and change how cabins, barns, crop rows, ponds, trees, and paths share the ground.",
      "The pictures are planner views of the projects. A hilltop farm layout JSON lets you inspect every placement in Stardew Valley Planner. It does not edit a game save by itself.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a hilltop farm layout",
    howToSteps: [
      {
        number: "01",
        title: "Download a project",
        body:
          "Choose one hilltop farm layout above and download its JSON file.",
      },
      {
        number: "02",
        title: "Import the JSON project",
        body:
          "Open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the file you downloaded.",
      },
      {
        number: "03",
        title: "Confirm the imported map",
        body:
          "After import, check that Current map: Hilltop Farm is shown for this hilltop farm layout. Then move buildings, crops, and paths. Do not pick a different map before the import.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Hilltop farm layout questions",
    faqDescription:
      "See which map the projects use, how import sets that map, and what the JSON file can change.",
    faqs: [
      {
        question: "Which map do these projects use?",
        answer:
          "All seven hilltop farm layout projects use Stardew Valley's Hilltop Farm. After import, the Library status reads Current map: Hilltop Farm. The file selects that map for you.",
      },
      {
        question: "Should I select the map before import?",
        answer:
          "No. Import the hilltop farm layout JSON first. Confirm Current map: Hilltop Farm after the file loads instead of choosing a map by hand.",
      },
      {
        question: "Can I open the JSON in a game save?",
        answer:
          "No. The download is a planner project. Check the placements in the planner, then recreate them in a save.",
      },
      {
        question: "Can I edit a project after importing it?",
        answer:
          "Yes. You can move buildings, redraw crop areas, and change paths, then save your own version.",
      },
    ],
    cases: hilltopFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语山顶农场布局",
    metaTitle: "星露谷山顶农场布局：7 套思路",
    description:
      "查看 7 套山顶农场规划：河边小屋村落、河畔宅院、高处到牧场、松林里的洒水器田、连成网的道路、采石场旁的畜棚，以及秋季蜂园。可下载 JSON 并导入规划器。",
    intro:
      "河流、悬崖和开阔地面可以按不同方式安排作物、动物和建筑。这七套都是已经摆好的规划器 JSON 项目，下载后可以继续改。",
    categoryLabel: "农场地图",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "同一张地图上的七套规划",
    casesDescription:
      "可以比较河边小屋村落、河畔宅院、高处到低处的牧场、松林洒水器田、互相连接的道路、采石场旁的畜棚，以及秋季蜂园。七套项目使用同一张地图文件。",
    ctaHeading: "从一套山顶农场规划开始",
    ctaDescription:
      "下载想要的分区项目并导入 JSON，然后在导入后的地图上调整建筑、作物和道路。",
    ctaButtonLabel: "用这张地图开始规划",
    whatIsHeading: "什么是山顶农场布局？",
    whatIsParagraphs: [
      "这里的山顶农场布局是为星露谷物语的山顶农场制作的规划器项目。七套案例都使用这张地图，差别在于小屋、畜棚、作物田、鱼塘、树木和道路怎么分区。",
      "下面的图片是这些项目在规划器中的画面。JSON 用来查看和修改摆放，它本身不会改动游戏存档。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载此布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用山顶农场布局",
    howToSteps: [
      {
        number: "01",
        title: "下载项目",
        body: "从上面七套规划里选一套，下载对应的 JSON 文件。",
      },
      {
        number: "02",
        title: "导入 JSON 项目",
        body:
          "打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择刚下载的文件。",
      },
      {
        number: "03",
        title: "确认导入后的地图",
        body:
          "导入后确认当前地图显示为 Hilltop Farm。然后再移动建筑、作物和道路。导入之前不用先手动另选一张地图。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "山顶农场布局常见问题",
    faqDescription:
      "了解这些项目使用的地图、导入后地图如何出现，以及 JSON 文件能改什么。",
    faqs: [
      {
        question: "这些项目使用哪张地图？",
        answer:
          "七套都使用星露谷物语的山顶农场。导入后，本地项目状态会显示当前地图：Hilltop Farm。地图由文件带入，不用事先手选。",
      },
      {
        question: "导入前要先选好地图吗？",
        answer:
          "不用。先导入 JSON。文件加载后确认当前地图：Hilltop Farm，而不是在导入前手动换成别的地图。",
      },
      {
        question: "JSON 能直接放进游戏存档吗？",
        answer:
          "不能。下载的是规划器项目。先在规划器里核对摆放，再按需要在存档中重做。",
      },
      {
        question: "导入后还能改布局吗？",
        answer:
          "可以。你可以移动建筑、重画作物区域、调整道路，然后保存自己的版本。",
      },
    ],
    cases: hilltopFarmCasesZhCn,
  },
};

export function getHilltopFarmPageCopy(
  locale: PublicLocale,
): HilltopFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Hilltop Farm page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return hilltopFarmPageCopyByLocale[locale];
}

export function getFeaturedHilltopFarmCase(
  locale: PublicLocale,
): HilltopFarmCase {
  const expectedFeaturedCaseId = "naturalistic-village";
  const pageCopy = getHilltopFarmPageCopy(locale);
  const featuredCase = pageCopy.cases[0];

  if (!featuredCase) {
    throw new Error(
      `Featured Hilltop Farm case ${JSON.stringify(expectedFeaturedCaseId)} is missing for locale ${JSON.stringify(locale)}. Received first case ID: <missing>.`,
    );
  }

  if (featuredCase.id !== expectedFeaturedCaseId) {
    throw new Error(
      `Featured Hilltop Farm case must be first for locale ${JSON.stringify(locale)}. Expected ${JSON.stringify(expectedFeaturedCaseId)}; received ${JSON.stringify(featuredCase.id)}.`,
    );
  }

  return featuredCase;
}
