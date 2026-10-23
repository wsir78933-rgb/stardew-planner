import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const wildernessFarmCanonicalPath =
  "/stardew-valley-wilderness-farm-layout" as const;

export type WildernessFarmCase = Readonly<{
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

export type WildernessFarmPageCopy = Readonly<{
  title: string;
  heading: string;
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
  cases: readonly WildernessFarmCase[];
}>;

const wildernessFarmCasesEn: readonly WildernessFarmCase[] = [
  {
    id: "forest-integrated-village",
    title: "Forest-Integrated Village",
    summary:
      "This wilderness farm layout mixes wooded edges with a village of cabins, sheds, and barns. Two Junimo Huts sit by the central pond, with crop beds on either side and open trees around the farm.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.jpg",
    imageAlt:
      "Spring Wilderness Farm map with wooded edges, buildings, two Junimo Huts, crop beds, and a central pond.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.json",
  },
  {
    id: "forest-shed-courts",
    title: "Forest Shed Courts",
    summary:
      "Three fish ponds and a group of large sheds share the wooded west side of this wilderness farm layout. Crop blocks, paths, and four silos occupy the middle and east, with animal buildings farther south.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.jpg",
    imageAlt:
      "Wilderness Farm map with three western fish ponds, large sheds, crop blocks, paths, and four silos.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.json",
  },
  {
    id: "summer-mushroom-garden",
    title: "Summer Mushroom Garden",
    summary:
      "Thirty mushroom trees give this summer plan a distinct wooded frame. A greenhouse, sheds, paths, crop strips, and a large mushroom-tree border sit around the central pond and buildings.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.jpg",
    imageAlt:
      "Summer Wilderness Farm map with mushroom trees, a greenhouse, crop strips, paths, sheds, and a central pond.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.json",
  },
  {
    id: "circular-crop-ring",
    title: "Circular Crop Ring",
    summary:
      "A broad fenced crop ring curves around the central pond in this wilderness farm layout. Stone paths follow the outside edge, while the greenhouse and farm buildings sit beyond the ring.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.jpg",
    imageAlt:
      "Wilderness Farm map with a fenced ring of crops around the central pond and buildings around its edge.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.json",
  },
  {
    id: "stone-grid-fish-ponds",
    title: "Stone Grid and Fish Ponds",
    summary:
      "Stone paths divide this summer wilderness farm layout into crop and building zones. Three fish ponds line the southwest, while rectangular crop plots, trees, a greenhouse, and farm buildings fill the rest of the map.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.jpg",
    imageAlt:
      "Summer Wilderness Farm map with stone path grids, three fish ponds along the southwest, crop plots, and trees.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.json",
  },
  {
    id: "fenced-shed-village",
    title: "Fenced Shed Village",
    summary:
      "This wilderness farm layout places four sheds across the upper middle and six silos from the west toward the center. Fences divide crop blocks to the east, and trees follow the lower edge beside the water.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.jpg",
    imageAlt:
      "Spring Wilderness Farm map with four sheds across the upper middle, six silos from west to center, fenced eastern crop blocks, and trees by the water.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.json",
  },
  {
    id: "autumn-symmetry",
    title: "Autumn Symmetry",
    summary:
      "This fall wilderness farm layout balances crop beds and animal buildings around the central pond. Three fish ponds sit north of the water, with Junimo Huts and paired barns and coops among the lower fields.",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.jpg",
    imageAlt:
      "Fall Wilderness Farm map with three fish ponds north of the central pond, crop beds, Junimo Huts, barns, and coops.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.json",
  },
];

const wildernessFarmCasesZhCn: readonly WildernessFarmCase[] = [
  {
    id: "forest-integrated-village",
    title: "森林村落",
    summary:
      "这套荒野农场布局把林地边缘和小屋、棚屋及畜棚组合在一起。中央池塘两侧是作物区，附近有两座祝尼魔屋，农场外围保留了树木空间。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.jpg",
    imageAlt:
      "春季荒野农场地图：林地边缘、小屋和畜棚围绕中央池塘，附近有两座祝尼魔屋与作物区。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village.json",
  },
  {
    id: "forest-shed-courts",
    title: "林间棚屋庭院",
    summary:
      "三个鱼塘和一组大棚集中在西侧林地附近。中东部安排了作物区、道路和四座筒仓，动物建筑则分布在更靠南的位置。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.jpg",
    imageAlt:
      "荒野农场地图：西侧有三个鱼塘和大棚，中东部是作物区、道路与四座筒仓。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery.json",
  },
  {
    id: "summer-mushroom-garden",
    title: "夏日蘑菇树花园",
    summary:
      "这套夏季规划用 30 棵蘑菇树形成醒目的林地边框。温室、棚屋、道路和作物带分布在中央池塘及建筑区周围。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.jpg",
    imageAlt:
      "夏季荒野农场地图：蘑菇树、温室、作物带、道路和棚屋分布在中央池塘周围。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted.json",
  },
  {
    id: "circular-crop-ring",
    title: "环形作物田",
    summary:
      "宽阔的围栏作物区沿中央池塘形成环形，石路贴着外缘延伸。温室和其他农场建筑安排在环形田之外。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.jpg",
    imageAlt:
      "荒野农场地图：围栏环形作物区围绕中央池塘，温室和建筑位于外缘。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner.json",
  },
  {
    id: "stone-grid-fish-ponds",
    title: "石路网格与鱼塘",
    summary:
      "石路把夏季规划分成作物区和建筑区。西南侧排列着三个鱼塘，其余区域安排了矩形田块、树木、温室和农场建筑。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.jpg",
    imageAlt:
      "夏季荒野农场地图：石路分区，西南侧有三个鱼塘，其他区域是作物田和树木。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds.json",
  },
  {
    id: "fenced-shed-village",
    title: "围栏棚屋村落",
    summary:
      "四座棚屋位于上方中部，六座筒仓从西侧延伸到中部。东侧围栏分隔作物区，南侧临水处留有树木区域。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.jpg",
    imageAlt:
      "春季荒野农场地图：四座棚屋位于上方中部，六座筒仓从西侧延伸到中部，东侧为围栏田块，南侧临水处有树木。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village.json",
  },
  {
    id: "autumn-symmetry",
    title: "秋日对称布局",
    summary:
      "秋季田块和动物建筑围绕中央池塘分布。池塘北侧有三个鱼塘，下方田区之间安排了祝尼魔屋、成对畜棚和鸡舍。",
    imageSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.webp",
    imageOriginalSrc:
      "/farm-layouts/wilderness/images/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.jpg",
    imageAlt:
      "秋季荒野农场地图：中央池塘北侧有三个鱼塘，下方是作物区、祝尼魔屋、畜棚和鸡舍。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/wilderness/projects/stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry.json",
  },
];

const wildernessFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, WildernessFarmPageCopy>
> = {
  en: {
    title: "Wilderness Farm Layout Ideas",
    heading: "Stardew Valley Wilderness Farm Layout Ideas",
    metaTitle: "7 Wilderness Farm Layout Ideas | Stardew Valley Planner",
    description:
      "Compare seven Wilderness Farm layouts, from a forest village and mushroom-tree garden to a circular crop ring, stone-grid fields, and a shed village. Download each planner project as JSON.",
    intro:
      "A wilderness farm layout can leave room for trees while still grouping crops, ponds, paths, and buildings. Explore seven planner projects for the Wilderness Farm map, then download a layout to inspect or adapt.",
    categoryLabel: "Farm maps",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven wilderness farm layout plans",
    casesDescription:
      "Compare a wooded village, shed courts, summer mushroom trees, a circular crop ring, stone-grid fields, a fenced shed village, and an autumn plan. Each wilderness farm layout uses the same map file, with different placements for crops, paths, trees, and buildings.",
    ctaHeading: "Start with a wilderness farm layout",
    ctaDescription:
      "Choose the wilderness farm layout whose crop and building zones suit your plan. Download its JSON project, import it into the planner, and adjust the placements there.",
    ctaButtonLabel: "Plan with this map",
    whatIsHeading: "What is a wilderness farm layout?",
    whatIsParagraphs: [
      "A wilderness farm layout is a Stardew Valley Planner project for the Wilderness Farm map. These seven examples keep the same map file while arranging crop beds, sheds, ponds, paths, trees, and farm buildings in different ways. The cover plan places a wooded village around the central pond; other projects use mushroom trees, broad stone paths, or a circular crop ring.",
      "The images show planner placements, and each download is a JSON project you can reopen in the planner. A wilderness farm layout file gives you a starting arrangement to inspect and change, while your game save remains separate.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a wilderness farm layout",
    howToSteps: [
      {
        number: "01",
        title: "Download a project",
        body:
          "Choose a wilderness farm layout above and download its JSON project.",
      },
      {
        number: "02",
        title: "Import the JSON",
        body:
          "Open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the file you downloaded.",
      },
      {
        number: "03",
        title: "Check the map",
        body:
          "After import, confirm that Current map: Wilderness Farm appears. Then review or move the buildings, crops, and paths in the project.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Wilderness farm layout questions",
    faqDescription:
      "Learn which map the projects use, how to import a layout, and what you can edit in the planner.",
    faqs: [
      {
        question: "Which map do these projects use?",
        answer:
          "All seven project files use the Wilderness Farm map, identified by Farm_Combat.tmx in the project files.",
      },
      {
        question: "Do I need to choose the map before importing?",
        answer:
          "Import the JSON project, then check that Current map: Wilderness Farm appears. Each example already points to that map file.",
      },
      {
        question: "Can I edit a layout after importing it?",
        answer:
          "Yes. In the planner, move buildings, change crop areas, or adjust paths, then save your own version of the wilderness farm layout.",
      },
      {
        question: "Does the JSON change my game save?",
        answer:
          "No. This is a planner project file. Review the placements in the planner, then recreate any choices in your save yourself.",
      },
    ],
    cases: wildernessFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语荒野农场布局",
    heading: "星露谷物语荒野农场布局",
    metaTitle: "星露谷物语荒野农场布局：7 套规划方案",
    description:
      "查看 7 套荒野农场规划：森林村落、蘑菇树花园、环形作物田、石路网格与围栏棚屋村落。可下载 JSON 项目并在规划器中调整。",
    intro:
      "荒野农场布局可以保留树木空间，也能把作物、鱼塘、道路和建筑分区安排。这里有 7 套荒野农场地图项目，可下载后在规划器中查看和修改。",
    categoryLabel: "农场地图",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "七套荒野农场布局方案",
    casesDescription:
      "可以比较森林村落、林间棚屋、夏日蘑菇树、环形作物田、石路网格、围栏棚屋村落和秋季布局。七套荒野农场布局使用同一张地图文件，但作物、道路、树木与建筑的摆放各不相同。",
    ctaHeading: "从一套荒野农场布局开始",
    ctaDescription:
      "选择符合你分区想法的荒野农场布局，下载 JSON 项目并导入规划器，然后继续调整里面的摆放。",
    ctaButtonLabel: "用这张地图开始规划",
    whatIsHeading: "什么是荒野农场布局？",
    whatIsParagraphs: [
      "这里的荒野农场布局是为星露谷物语荒野农场制作的规划器项目。七套方案使用同一张地图文件，区别在于作物田、棚屋、鱼塘、道路、树木和其他建筑的安排。封面方案把林地、小屋和作物区放在中央池塘周围，其他项目还展示了蘑菇树、石路分区和环形作物田。",
      "图片展示的是规划器中的摆放，每个下载文件都是可以重新打开的 JSON 项目。荒野农场布局文件提供一套可查看和修改的起始方案，游戏存档与规划器项目彼此独立。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载此布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用荒野农场布局",
    howToSteps: [
      {
        number: "01",
        title: "下载项目",
        body: "从上面的荒野农场布局中选择一套，下载对应的 JSON 项目。",
      },
      {
        number: "02",
        title: "导入 JSON",
        body:
          "打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择刚下载的文件。",
      },
      {
        number: "03",
        title: "确认地图",
        body:
          "导入后确认当前地图显示为 Wilderness Farm，再查看或调整项目里的建筑、作物和道路。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "荒野农场布局常见问题",
    faqDescription:
      "了解这些项目使用的地图、JSON 导入方式，以及可以在规划器中修改的内容。",
    faqs: [
      {
        question: "这些项目使用哪张地图？",
        answer:
          "七套荒野农场布局项目都使用荒野农场地图，项目文件中的地图标识为 Farm_Combat.tmx。",
      },
      {
        question: "导入前要先选择地图吗？",
        answer:
          "先导入 JSON 项目，再确认当前地图显示为 Wilderness Farm。这些荒野农场布局已经指向对应的地图文件。",
      },
      {
        question: "导入后还能调整布局吗？",
        answer:
          "可以。在规划器中移动建筑、调整作物区或修改道路，然后保存自己的荒野农场布局版本。",
      },
      {
        question: "JSON 会修改我的游戏存档吗？",
        answer:
          "不会。下载文件是规划器项目。你可以先在规划器中查看荒野农场布局，再根据需要在存档中自行摆放。",
      },
    ],
    cases: wildernessFarmCasesZhCn,
  },
};

export function getWildernessFarmPageCopy(
  locale: PublicLocale,
): WildernessFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Wilderness Farm page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return wildernessFarmPageCopyByLocale[locale];
}

export function getFeaturedWildernessFarmCase(
  locale: PublicLocale,
): WildernessFarmCase {
  const expectedFeaturedCaseId = "forest-integrated-village";
  const pageCopy = getWildernessFarmPageCopy(locale);
  const featuredCase = pageCopy.cases[0];

  if (!featuredCase) {
    throw new Error(
      `Featured Wilderness Farm case ${JSON.stringify(expectedFeaturedCaseId)} is missing for locale ${JSON.stringify(locale)}. Received first case ID: <missing>.`,
    );
  }

  if (featuredCase.id !== expectedFeaturedCaseId) {
    throw new Error(
      `Featured Wilderness Farm case must be first for locale ${JSON.stringify(locale)}. Expected ${JSON.stringify(expectedFeaturedCaseId)}; received ${JSON.stringify(featuredCase.id)}.`,
    );
  }

  return featuredCase;
}
