import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const expandedFarmCanonicalPath =
  "/stardew-valley-expanded-farm-layout" as const;

export type ExpandedFarmCase = Readonly<{
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

export type ExpandedFarmPageCopy = Readonly<{
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
  cases: readonly ExpandedFarmCase[];
}>;

const expandedFarmCasesEn: readonly ExpandedFarmCase[] = [
  {
    id: "if2r-clover-crop-hub",
    title: "IF2R Crop Hub",
    summary:
      "This Stardew Valley Expanded Farm layout uses IF2R's northwest crop plots as a hub, with a broad wooded center, beehives and farm buildings along the east, and southern swamp and tree islands left open.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.jpg",
    imageAlt:
      "IF2R plan with four northwest crop plots, a wooded center, eastern beehives and farm buildings, and open southern wetlands and tree islands.",
    imageWidth: 3200,
    imageHeight: 3062,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.json",
  },
  {
    id: "grandpas-naturalistic-forest",
    title: "Grandpa's Naturalistic Forest",
    summary:
      "For a naturalistic Stardew Valley Expanded Farm layout, Grandpa's Farm uses dense trees and flower-lined paths around its central house, crop plots and barns, with a greenhouse on the western island.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.jpg",
    imageAlt:
      "Grandpa's Farm surrounded by trees, with a central farmhouse and crop plots, barns, a western greenhouse, and flowering paths.",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.json",
  },
  {
    id: "if2r-functional-blend",
    title: "IF2R Fields and Open Wetlands",
    summary:
      "This IF2R Stardew Valley Expanded Farm layout balances rectangular crop beds across the north and center with a western greenhouse, eastern farm buildings, and southern wetlands kept open.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.jpg",
    imageAlt:
      "IF2R plan with rectangular crop beds across the north and center, a western greenhouse, eastern farm buildings, and open southern wetlands.",
    imageWidth: 3200,
    imageHeight: 3062,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.json",
  },
  {
    id: "grandpas-dense-industrial",
    title: "Grandpa's Dense Crop Grid",
    summary:
      "On Grandpa's Farm, this Stardew Valley Expanded Farm layout puts a broad crop grid in the southeast, with barns, a greenhouse and small ponds around the western and southern routes.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.jpg",
    imageAlt:
      "Grandpa's Farm plan with a large southeast crop grid, barns, a greenhouse, small ponds, and path-linked sections.",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.json",
  },
  {
    id: "grandpas-purple-symmetrical",
    title: "Grandpa's Purple Symmetry",
    summary:
      "Purple tree canopies and straight paths shape a symmetrical Stardew Valley Expanded Farm layout on Grandpa's Farm, with livestock to the southwest, a western greenhouse and wooded space to the east.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.jpg",
    imageAlt:
      "Grandpa's Farm with a symmetrical crop field, purple trees, southwest livestock buildings, a western greenhouse, and eastern woodland.",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.json",
  },
  {
    id: "grandpas-winery-spiral-honey",
    title: "Grandpa's Spiral Apiary",
    summary:
      "A spiral apiary stands out in this Stardew Valley Expanded Farm layout for Grandpa's Farm, while broad fields fill the south and farm buildings and a greenhouse occupy the west.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.jpg",
    imageAlt:
      "Grandpa's Farm plan with broad southern fields, farm buildings, a greenhouse, and a spiral hive garden in the east.",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.json",
  },
  {
    id: "grandpas-summer-fish-battery",
    title: "Grandpa's Summer Fish and Battery Layout",
    summary:
      "On Grandpa's Farm, this Stardew Valley Expanded Farm layout centers on a broad crop field, with barns to the west and fish ponds and tall production buildings across the east.",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.jpg",
    imageAlt:
      "Grandpa's Farm with a central crop field, western barns and greenhouse, and eastern fish ponds and tall production buildings.",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.json",
  },
];

const expandedFarmCasesZhCn: readonly ExpandedFarmCase[] = [
  {
    id: "if2r-clover-crop-hub",
    title: "IF2R 作物中枢",
    summary:
      "这套 IF2R（Immersive Farm 2 Remastered）布局以西北侧四块田地为起点，中央保留大片树林，东侧安排蜂箱与农场建筑，南部沼泽和树岛则留出开阔空间。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.jpg",
    imageAlt:
      "IF2R 布局：西北侧四块田地、中央树林、东侧蜂箱与农场建筑，以及南部开阔的沼泽和树岛。",
    imageWidth: 3200,
    imageHeight: 3062,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-01-if2r-clover-crop-hub.json",
  },
  {
    id: "grandpas-naturalistic-forest",
    title: "Grandpa's Farm 自然林地",
    summary:
      "Grandpa's Farm 以密集树木和花径围合农舍、田地与畜棚，温室则安排在西侧岛区，整体保留自然林地的层次。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.jpg",
    imageAlt:
      "Grandpa's Farm 林地布局：中央农舍与田地、畜棚、西侧温室，以及沿途的树木和花径。",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-02-grandpas-naturalistic-forest-y4.json",
  },
  {
    id: "if2r-functional-blend",
    title: "IF2R 田地与湿地分区",
    summary:
      "这套 IF2R 布局把成片矩形田地安排在北侧和中央，西侧有温室，东侧集中农场建筑，南部湿地则保留自然空间。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.jpg",
    imageAlt:
      "IF2R 布局：北侧和中央的矩形田地、西侧温室、东侧农场建筑，以及南部开放湿地。",
    imageWidth: 3200,
    imageHeight: 3062,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-03-if2r-y4-functional-blend.json",
  },
  {
    id: "grandpas-dense-industrial",
    title: "Grandpa's Farm 密集田区",
    summary:
      "东南侧的大面积田地是这套 Grandpa's Farm 布局的主体；畜棚和温室分布在西侧，几座小池塘沿西侧与南侧道路排列。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.jpg",
    imageAlt:
      "Grandpa's Farm 布局：东南侧的大块田地、畜棚、温室、小池塘和相连道路。",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-04-grandpas-dense-industrial-y5.json",
  },
  {
    id: "grandpas-purple-symmetrical",
    title: "Grandpa's Farm 紫色对称田区",
    summary:
      "紫色树冠和笔直道路围出对称田区，畜牧建筑集中在西南侧，温室位于西侧，东侧则保留较多树林。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.jpg",
    imageAlt:
      "Grandpa's Farm 对称田区：紫色树木环绕作物田，西南有畜牧建筑，西侧有温室，东侧保留树林。",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-05-grandpas-sevinc-purple-symmetrical.json",
  },
  {
    id: "grandpas-winery-spiral-honey",
    title: "Grandpa's Farm 螺旋蜂园",
    summary:
      "东侧的螺旋蜂园是这套 Grandpa's Farm 布局的视觉重点；南部和中央安排了多片田地，农场建筑与温室则分布在西侧。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.jpg",
    imageAlt:
      "Grandpa's Farm 布局：南部田地、西侧农场建筑和温室，以及东侧的螺旋蜂园。",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-06-grandpas-winery-spiral-honey.json",
  },
  {
    id: "grandpas-summer-fish-battery",
    title: "Grandpa's Farm 夏日鱼塘与生产区",
    summary:
      "中央的大块作物田面向西侧畜棚；东侧布置鱼塘和高耸的生产建筑，温室则位于西侧岛区。",
    imageSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/expanded/images/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.jpg",
    imageAlt:
      "Grandpa's Farm 布局：中央作物田、西侧畜棚和温室，以及东侧的鱼塘与高耸生产建筑。",
    imageWidth: 3200,
    imageHeight: 2125,
    projectHref:
      "/farm-layouts/expanded/projects/stardew-valley-expanded-farm-layout-07-grandpas-summer-fish-battery.json",
  },
];

const expandedFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, ExpandedFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley Expanded Farm Layout Ideas",
    metaTitle:
      "Stardew Valley Expanded Farm Layouts: 7 IF2R and Grandpa's Farm Plans",
    description:
      "Browse seven SVE farm layout projects for Immersive Farm 2 Remastered and Grandpa's Farm. Compare crop fields, wooded paths, livestock areas, ponds, and other zones, then open a matching JSON plan in the planner.",
    intro:
      "Explore this Stardew Valley Expanded Farm layout collection for IF2R and Grandpa's Farm. The seven JSON projects show different ways to organize crop plots, tree cover, buildings, ponds and paths. Choose the plan for your map, then import and edit it in the Stardew Valley Planner.",
    categoryLabel: "SVE farm maps",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven layouts for two SVE farm maps",
    casesDescription:
      "Compare each Stardew Valley Expanded Farm layout across two maps: IF2R's crop-centered areas and wetlands, or Grandpa's Farm with forest scenery, dense fields, livestock, ponds and decorative paths.",
    ctaHeading: "Choose the SVE plan that fits your save",
    ctaDescription:
      "Download a Stardew Valley Expanded Farm layout JSON for your installed map, import it in the planner, and adjust crop plots, buildings and paths to suit your save.",
    ctaButtonLabel: "Plan with this map",
    whatIsHeading: "What is a Stardew Valley Expanded Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Expanded Farm layout is a planner project made for one SVE farm map. This collection covers Immersive Farm 2 Remastered (IF2R) and Grandpa's Farm; each case identifies which map its project uses.",
      "The seven examples show crop grids, wooded decoration, farm buildings, ponds and path-led zones. Download a JSON project into Stardew Valley Planner to inspect and edit its placements; the file does not install a map or change a game save.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Expanded Farm layout",
    howToSteps: [
      {
        number: "01",
        title: "Choose the matching map",
        body:
          "Choose a Stardew Valley Expanded Farm layout labeled for the same map as your save: IF2R or Grandpa's Farm.",
      },
      {
        number: "02",
        title: "Import the JSON project",
        body:
          "Open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the project file you downloaded.",
      },
      {
        number: "03",
        title: "Adapt the placements",
        body:
          "Review the arrangement in the planner and adjust it for your farm. Recreate the placements in a game save using the matching SVE map.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Valley Expanded Farm layout questions",
    faqDescription:
      "Find which SVE maps the layouts use, how to import their JSON projects, and what you need to recreate a plan in a save.",
    faqs: [
      {
        question: "Which maps do these projects use?",
        answer:
          "The seven planner projects are for Immersive Farm 2 Remastered (IF2R) or Grandpa's Farm, both SVE farm maps. Use each Stardew Valley Expanded Farm layout with its matching map installed for your save; the JSON stores planner placements, not the farm map itself.",
      },
      {
        question: "Do I need the matching SVE farm map?",
        answer:
          "To recreate a Stardew Valley Expanded Farm layout in game, use the map named on that case: IF2R for cases 01 and 03, or Grandpa's Farm for cases 02 and 04–07. After importing, check that Current map shows IF2R or Grandpa's Farm, as appropriate for the case.",
      },
      {
        question: "Can I open the JSON directly in a game save?",
        answer:
          "No. The download is a Stardew Valley Planner project, not a game save file. Import it into the planner, then recreate or adapt its placements in a save with the matching farm map.",
      },
      {
        question: "Can I edit a project after importing it?",
        answer:
          "Yes. The planner project is editable, so you can move buildings, redraw crop areas and change paths before saving your own version.",
      },
    ],
    cases: expandedFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语扩展农场布局",
    metaTitle: "星露谷扩展农场布局：7 套 IF2R 与 Grandpa's Farm 案例",
    description:
      "查看 7 套为 IF2R（Immersive Farm 2 Remastered）和 Grandpa's Farm 规划的 SVE 农场布局，比较田地、树林、畜牧、鱼塘与道路分区，并下载对应 JSON 项目到规划器中调整。",
    intro:
      "这组扩展农场布局包含 IF2R（Immersive Farm 2 Remastered）和 Grandpa's Farm 两种 SVE 农场地图。七套 JSON 项目展示了作物田、树林、建筑、鱼塘和道路的不同安排；先选与存档地图匹配的案例，再导入规划器继续调整。",
    categoryLabel: "SVE 农场地图",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "两种 SVE 农场地图的七套布局",
    casesDescription:
      "从 IF2R 的田地区域与南部湿地，到 Grandpa's Farm 的林地、密集田区、畜牧、鱼塘和装饰道路，查看不同的分区思路。",
    ctaHeading: "选择适合存档地图的规划",
    ctaDescription:
      "下载对应农场地图的 JSON 项目并导入规划器，再按自己的存档调整田地、建筑和道路位置。",
    ctaButtonLabel: "开始规划",
    whatIsHeading: "什么是星露谷物语扩展农场布局？",
    whatIsParagraphs: [
      "这里的扩展农场布局是为 SVE 农场地图制作的规划器项目，涵盖 Immersive Farm 2 Remastered（IF2R）和 Grandpa's Farm；每个案例都会标明对应地图。",
      "七套案例展示了田地区块、树林装饰、农场建筑、鱼塘和道路分区。下载 JSON 后可在星露谷规划器中查看和编辑；JSON 是规划项目，不会安装农场地图或修改游戏存档。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载此布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷扩展农场布局",
    howToSteps: [
      {
        number: "01",
        title: "选择匹配的地图",
        body:
          "先确认存档使用的是 IF2R 还是 Grandpa's Farm，再选择标明对应地图的案例。",
      },
      {
        number: "02",
        title: "导入 JSON 项目",
        body:
          "打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择下载的项目文件。",
      },
      {
        number: "03",
        title: "按存档调整摆放",
        body:
          "在规划器中检查并调整分区，再使用对应的 SVE 农场地图在存档里按需还原或修改。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷扩展农场布局常见问题",
    faqDescription:
      "了解案例对应的 SVE 农场地图、JSON 项目的导入方式，以及如何在存档中使用布局思路。",
    faqs: [
      {
        question: "这些项目使用哪两种农场地图？",
        answer:
          "七套规划器项目对应 Immersive Farm 2 Remastered（IF2R）或 Grandpa's Farm，两者都是 SVE 农场地图。要在存档中还原布局，需要使用案例标明的对应地图；JSON 文件只保存规划器中的摆放信息。",
      },
      {
        question: "需要安装对应的 SVE 农场地图吗？",
        answer:
          "如果要在游戏存档中还原布局，需要使用案例标注的地图：01 和 03 对应 IF2R，02 和 04–07 对应 Grandpa's Farm。导入 JSON 后，检查当前地图是否显示对应的 IF2R 或 Grandpa's Farm。",
      },
      {
        question: "JSON 能直接导入游戏存档吗？",
        answer:
          "不能。下载的是星露谷规划器项目文件，不是游戏存档；先导入规划器查看，再在使用对应农场地图的存档中按需还原和调整。",
      },
      {
        question: "导入后还能编辑布局吗？",
        answer:
          "可以。规划器项目可以继续编辑，你可以移动建筑、重画作物区域和调整道路，再保存自己的版本。",
      },
    ],
    cases: expandedFarmCasesZhCn,
  },
};

export function getExpandedFarmPageCopy(
  locale: PublicLocale,
): ExpandedFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Expanded Farm page locale: ${String(locale)}.`);
  }

  return expandedFarmPageCopyByLocale[locale];
}

export function getFeaturedExpandedFarmCase(
  locale: PublicLocale,
): ExpandedFarmCase {
  const expectedFeaturedCaseId = "if2r-clover-crop-hub";
  const pageCopy = getExpandedFarmPageCopy(locale);
  const featuredCase = pageCopy.cases[0];

  if (!featuredCase) {
    throw new Error(
      `Featured Expanded Farm case ${JSON.stringify(expectedFeaturedCaseId)} is missing for locale ${JSON.stringify(locale)}. Received first case ID: <missing>.`,
    );
  }

  if (featuredCase.id !== expectedFeaturedCaseId) {
    throw new Error(
      `Featured Expanded Farm case must be first for locale ${JSON.stringify(locale)}. Expected ${JSON.stringify(expectedFeaturedCaseId)}; received ${JSON.stringify(featuredCase.id)}.`,
    );
  }

  return featuredCase;
}
