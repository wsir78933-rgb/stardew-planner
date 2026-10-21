import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const fourCornersFarmCanonicalPath =
  "/stardew-valley-four-corners-farm-layout" as const;

export type FourCornersFarmCase = Readonly<{
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

export type FourCornersFarmPageCopy = Readonly<{
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
  cases: readonly FourCornersFarmCase[];
}>;

const fourCornersFarmCasesEn: readonly FourCornersFarmCase[] = [
  {
    id: "01-formal-garden",
    title: "A Symmetrical Garden with a Central Cross",
    summary:
      "The greenhouse and Gold Clock meet at a paved crossroads, with crop plots, five Fish Ponds, orchards, and flower beds arranged in repeating blocks. A central route links the garden areas.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry-full.webp",
    imageAlt:
      "A greenhouse and Gold Clock at a paved crossroads, with crop plots, fish ponds, orchard trees, and flower rows around them.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry.json",
  },
  {
    id: "02-mushroom-village",
    title: "A Mushroom Village along the Paths",
    summary:
      "Mushroom-shaped trees punctuate paths around the Gold Clock, while cabins, crops, and three Fish Ponds occupy separate parts of the map. Paths connect these zones and give the farm a village-like feel.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village-full.webp",
    imageAlt:
      "Mushroom-shaped trees line paths between cabins, crop plots, fish ponds, and buildings around the farm.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village.json",
  },
  {
    id: "03-themed-quadrants",
    title: "Four Themes around a Clock Garden",
    summary:
      "Build a clock garden at the center and give the surrounding areas distinct roles for crops, animal buildings, ponds, and cabins. Connecting paths tie the themed sections together.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park-full.webp",
    imageAlt:
      "A central Gold Clock garden links four areas with crop fields, animal buildings, ponds, and cabins.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park.json",
  },
  {
    id: "04-twelve-fish-ponds",
    title: "Twelve Fish Ponds and Two Junimo Huts",
    summary:
      "Group twelve Fish Ponds together beside paved paths, then place two Junimo Huts by crop blocks elsewhere. This Stardew Valley Four Corners Farm layout keeps the pond cluster and fields in separate, connected zones.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop-full.webp",
    imageAlt:
      "Twelve Fish Ponds fill one paved area, with crop fields and two Junimo Huts in separate sections.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop.json",
  },
  {
    id: "05-bees-and-animals",
    title: "Bee Houses beside Flower and Crop Rows",
    summary:
      "Place Bee Houses beside the flower and crop rows in the northeast. Barns and Coops occupy the northwest, while a line of Silos marks the southeast edge. This Stardew Valley Four Corners Farm layout separates livestock buildings from the garden and field blocks.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row-full.webp",
    imageAlt:
      "Bee Houses and flower and crop plots occupy the northeast, with Barns and Coops in the northwest and Silos along the southeast edge.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row.json",
  },
  {
    id: "06-junimo-columns",
    title: "Twin Junimo Crop Columns",
    summary:
      "Split the crops into two long columns and spread four Junimo Huts along the planting area. In this Stardew Valley Four Corners Farm layout, paths link the fields with nearby sheds and farm buildings.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row-full.webp",
    imageAlt:
      "Two long crop columns with four Junimo Huts, paths, sheds, and nearby farm buildings.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row.json",
  },
  {
    id: "07-clock-garden",
    title: "A Clock Garden at the Crossroads",
    summary:
      "Place the Gold Clock on a paved crossroads, then let paths lead toward separate crop, pond, and animal-building areas. The central garden stands out as a landmark for the surrounding sections.",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads-full.webp",
    imageAlt:
      "A Gold Clock and garden at a central crossroads, with crop fields, fish ponds, and buildings in the surrounding areas.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads.json",
  },
];

const fourCornersFarmCasesZhCn: readonly FourCornersFarmCase[] = [
  {
    id: "01-formal-garden",
    title: "中央十字路旁的对称花园",
    summary:
      "以铺装十字路作为中心，在温室和金钟周围安排作物田、五座鱼塘、果树与花田。中央道路把规则的花园分区串联起来。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry-full.webp",
    imageAlt:
      "温室和金钟位于铺装十字路中央，周围安排作物田、鱼塘、果树和花田。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-01-french-formal-garden-symmetry.json",
  },
  {
    id: "02-mushroom-village",
    title: "道路两旁的蘑菇村",
    summary:
      "沿道路点缀蘑菇形树木，再把小屋、作物区和三座鱼塘分布在不同区域，营造出村落般的景观。通道把各个区域连接起来。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village-full.webp",
    imageAlt:
      "蘑菇形树木点缀在道路之间，周围分布小屋、作物田、鱼塘和农场建筑。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-02-y15-perfection-mushroom-village.json",
  },
  {
    id: "03-themed-quadrants",
    title: "围绕钟园划分的四角主题区",
    summary:
      "把中央钟园作为视觉中心，周围安排作物田、畜牧建筑、鱼塘和小屋等不同分区。道路连接四角，让每个区域都有自己的重点。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park-full.webp",
    imageAlt:
      "中央金钟花园连接四个区域，各区安排作物田、畜牧建筑、鱼塘或小屋。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-03-y19-themed-quadrants-clock-park.json",
  },
  {
    id: "04-twelve-fish-ponds",
    title: "十二座鱼塘与两座祝尼魔小屋",
    summary:
      "把十二座鱼塘集中在铺装道路旁，再将两座祝尼魔小屋放在另一侧的作物田边。这套星露谷物语四角农场布局将鱼塘区与种植区分开，也留出相互连接的道路。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop-full.webp",
    imageAlt:
      "一片铺装区域集中排列十二座鱼塘，其他分区安排作物田和两座祝尼魔小屋。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-04-fadith-twelve-pond-junimo-coop.json",
  },
  {
    id: "05-bees-and-animals",
    title: "花田旁的蜂房与畜牧区",
    summary:
      "东北侧把蜂房排在花田与作物田旁；西北侧集中畜棚和鸡舍，东南边缘则排成一列筒仓。这套星露谷物语四角农场布局将种植、畜牧和储粮区分开安排，分区一目了然。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row-full.webp",
    imageAlt:
      "东北侧是蜂房、花田和作物田，西北侧安排畜棚与鸡舍，东南边缘排着筒仓。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-05-y20-industrial-bees-animal-row.json",
  },
  {
    id: "06-junimo-columns",
    title: "双列祝尼魔作物田",
    summary:
      "把作物田分成两条长列，并在种植区中安排四座祝尼魔小屋。这套星露谷物语四角农场布局通过道路连接田地、工棚和附近建筑，路线层次更清楚。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row-full.webp",
    imageAlt:
      "两条长作物田旁分布四座祝尼魔小屋，周围有道路、工棚和其他农场建筑。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-06-y5-dual-junimo-columns-shed-row.json",
  },
  {
    id: "07-clock-garden",
    title: "十字路口的中央钟园",
    summary:
      "让金钟成为铺装十字路口的中心，再用道路延伸到各角落的作物田、鱼塘和畜牧建筑。中央花园成为容易辨认的地标。",
    imageSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads.webp",
    imageOriginalSrc:
      "/farm-layouts/four-corners/images/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads-full.webp",
    imageAlt:
      "金钟和花园位于中央十字路口，周围分区安排作物田、鱼塘和农场建筑。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/four-corners/projects/stardew-valley-four-corners-farm-layout-07-planner-clock-garden-crossroads.json",
  },
];

const fourCornersFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, FourCornersFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley Four Corners Farm Layout",
    metaTitle: "Stardew Valley Four Corners Farm Layouts: 7 Ideas",
    description:
      "Explore seven Stardew Valley Four Corners Farm layout ideas, from formal gardens and mushroom-lined paths to fish-pond clusters, bee rows, and crop fields. View each map or download its JSON project to adjust in the planner.",
    intro:
      "Four Corners Farm gives the map four distinct areas to plan around. Compare seven Stardew Valley Four Corners Farm layout ideas for crops, ponds, animals, and gardens, then download a project to adapt in the planner.",
    categoryLabel: "Four Corners Farm",
    browseLabel: "Browse the 7 layouts",
    openPlannerLabel: "Open the planner",
    casesHeading:
      "Find a Stardew Valley Four Corners Farm layout for your plan",
    casesDescription:
      "Compare formal symmetry, a mushroom-lined village, themed quadrants, pond blocks, bee rows, and two Junimo crop columns across seven Four Corners examples.",
    ctaHeading: "Make your Four Corners Farm your own",
    ctaDescription:
      "Pick a Stardew Valley Four Corners Farm layout you like, download its JSON project, and import it into the planner. Adjust fields, paths, and buildings to fit your save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Stardew Valley Four Corners Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Four Corners Farm layout is a plan for organizing crops, buildings, ponds, and paths across the map’s four sections.",
      "The examples show how one Stardew Valley Four Corners Farm layout can give each corner a different focus while keeping routes between them clear.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Four Corners Farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Choose a Stardew Valley Four Corners Farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, click “Library”, choose “Import JSON”, then select the downloaded file.",
      },
      {
        number: "03",
        title: "Adjust it to your save",
        body: "Review the imported project and adjust crops, buildings, paths, and decorations to match your save. Use the Stardew Valley Four Corners Farm layout as your starting point.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Four Corners Farm layout questions",
    faqDescription:
      "Get answers about choosing a Stardew Valley Four Corners Farm layout, placing ponds and crops, and importing its JSON project into the planner.",
    faqs: [
      {
        question: "Which Stardew Valley Four Corners Farm layout should I start with?",
        answer:
          "Start with the map that matches how you want to organize space: repeating symmetry, themed sections, pond clusters, bee rows, or crop fields. Each Stardew Valley Four Corners Farm layout makes a different arrangement visible.",
      },
      {
        question: "Where do crops and ponds go in these plans?",
        answer:
          "The examples spread crop blocks across different sections, while some group fish ponds together near paths. Compare each Stardew Valley Four Corners Farm layout to see which balance of growing space and water features suits your plan.",
      },
      {
        question: "Can I adjust a Stardew Valley Four Corners Farm layout after importing?",
        answer:
          "Yes. The JSON opens as a planner project. Use the planner to move or add crops, paths, buildings, and decorative items, then download the revised project if you need it.",
      },
      {
        question: "Does the JSON change my game save?",
        answer:
          "No. It is a planner project file. Import it from Library → Import JSON and use its Four Corners arrangement as a visual reference for your save.",
      },
    ],
    cases: fourCornersFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语四角农场布局",
    metaTitle: "星露谷物语四角农场布局：7 个规划案例",
    description:
      "查看 7 个星露谷物语四角农场布局案例，从对称花园、蘑菇村到鱼塘与作物分区。可浏览地图，或下载 JSON 项目到规划器中继续调整。",
    intro:
      "四角农场由四片区域组成，可以按不同用途安排空间。对比七套星露谷物语四角农场布局，看看作物田、鱼塘、畜牧建筑和花园如何分区，再下载项目到规划器继续调整。",
    categoryLabel: "四角农场",
    browseLabel: "浏览 7 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "选择适合你的星露谷物语四角农场布局",
    casesDescription:
      "从对称花园、蘑菇林和主题象限，到鱼塘集中区、蜂房排列与双列种植，七套星露谷物语四角农场布局展示不同的空间组织方式。",
    ctaHeading: "规划属于你的四角农场",
    ctaDescription:
      "选一套喜欢的星露谷物语四角农场布局，下载 JSON 项目并导入规划器。再按存档调整田地、道路和建筑，规划成适合自己的农场。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是星露谷物语四角农场布局？",
    whatIsParagraphs: [
      "星露谷物语四角农场布局，是在地图上规划作物、建筑、鱼塘和道路的方案。",
      "这些案例展示不同的星露谷物语四角农场布局如何给每个角落安排不同用途，同时用道路保持区域之间的联系。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语四角农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "从上方选择一套星露谷物语四角农场布局，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，点击“本地项目”，再选择“导入 JSON”并选中下载的文件。",
      },
      {
        number: "03",
        title: "按存档调整",
        body: "查看导入的项目，按自己的存档调整作物、建筑、道路和装饰。将这套星露谷物语四角农场布局作为规划起点。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "四角农场布局常见问题",
    faqDescription:
      "了解如何选择星露谷物语四角农场布局、安排鱼塘与作物田，以及在规划器中导入 JSON 项目。",
    faqs: [
      {
        question: "哪套星露谷物语四角农场布局适合作为起点？",
        answer:
          "先看自己希望如何组织空间：对称花园、主题分区、鱼塘集中、蜂房排列或长条作物田。每套星露谷物语四角农场布局呈现不同的区块组合。",
      },
      {
        question: "这些案例把作物田和鱼塘安排在哪里？",
        answer:
          "不同案例会在多个区域安排作物，也有案例把鱼塘集中在一处，再用道路连接其他分区。比较星露谷物语四角农场布局时，可以先看哪种种植空间与水景组合更合自己的构想。",
      },
      {
        question: "导入后还能调整星露谷物语四角农场布局吗？",
        answer:
          "可以。JSON 会作为规划器项目打开，你可以移动或添加作物、道路、建筑和装饰物，调整完成后也可以下载修改后的项目。",
      },
      {
        question: "JSON 会直接修改游戏存档吗？",
        answer:
          "不会。这是规划器项目文件，可从“本地项目”选择“导入 JSON”打开，再把四角农场的分区作为自己存档的布局参考。",
      },
    ],
    cases: fourCornersFarmCasesZhCn,
  },
};

export function getFourCornersFarmPageCopy(
  locale: PublicLocale,
): FourCornersFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Four Corners Farm page locale: ${String(locale)}.`);
  }

  return fourCornersFarmPageCopyByLocale[locale];
}
