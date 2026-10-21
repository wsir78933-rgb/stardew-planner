import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const forestFarmCanonicalPath =
  "/stardew-valley-forest-farm-layout" as const;

export type ForestFarmCase = Readonly<{
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

export type ForestFarmPageCopy = Readonly<{
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
  cases: readonly ForestFarmCase[];
}>;

const forestFarmCasesEn: readonly ForestFarmCase[] = [
  {
    id: "01-central-crop-spine",
    title: "A Long Crop Field beside the Main Pond",
    summary:
      "Set a long crop block west of the main pond and connect the greenhouse, farmhouse, and farm buildings with a straight path. Three Junimo Huts are spaced through the field, while smaller ponds and obelisks occupy the east side. This Stardew Valley Forest Farm layout keeps the crop rows together and the western woods distinct.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection-full.webp",
    imageAlt:
      "Long west-side crop rows beside the central pond, with a greenhouse above and farm buildings to the east.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection.json",
  },
  {
    id: "02-vertical-crop-columns",
    title: "Vertical Crop Columns and Pondside Cabins",
    summary:
      "Divide crops into two tall blocks on opposite sides of a path, then let smaller paths frame the pond and nearby cabins. Dense trees stay grouped in the western clearings, while walkways separate the growing areas. This Stardew Valley Forest Farm layout gives the farm a clear rhythm without hiding its wooded edges.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-02-spinney-vertical-columns.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-02-spinney-vertical-columns-full.webp",
    imageAlt:
      "Two vertical crop areas and paths around the pond, with cabins nearby and dense trees in the western clearings.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-02-spinney-vertical-columns.json",
  },
  {
    id: "03-west-alcove-animals",
    title: "A Western Animal Yard and Layered Fields",
    summary:
      "Place the Barn, Coop, and two Silos together in the west clearing, then stack crop blocks along its eastern edge. A flower strip and three Fish Ponds fill the lower-left area beside the pond. This Stardew Valley Forest Farm layout keeps animal buildings, crops, and waterside space in separate, easy-to-read zones.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip-full.webp",
    imageAlt:
      "Animal buildings in the west clearing, layered crop plots, a flower strip, and three Fish Ponds beside the pond.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip.json",
  },
  {
    id: "04-east-field-fishponds",
    title: "East Crop Fields and a Six-Pond Deck",
    summary:
      "Group Barns and Coops in a western yard, with a large central field and another crop block just south of the farmhouse. Six Fish Ponds sit together on a deck south of the main pond. This Stardew Valley Forest Farm layout uses the eastern space for crops and keeps the pond area in one cluster.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery-full.webp",
    imageAlt:
      "Crop blocks across the center and east, animal buildings to the west, and six Fish Ponds on a deck south of the main pond.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery.json",
  },
  {
    id: "05-tapper-hardwood-forage",
    title: "Tapped Tree Rows and Forest Clearings",
    summary:
      "Arrange tapped tree rows across the upper farm, then keep the western stump clearing and lower-left grove as their own wooded areas. A small pumpkin plot sits beside the pond, with scattered trees tracing the water’s edge. This Stardew Valley Forest Farm layout puts tree-lined paths and open woodland ahead of broad crop fields.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage-full.webp",
    imageAlt:
      "Tapped tree rows across the upper farm, a stump clearing in the west, and a small pumpkin plot near the pond.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage.json",
  },
  {
    id: "06-pond-ring-animal-row",
    title: "A Tree-Ringed Pond and South Barn Row",
    summary:
      "Use the main pond as a visual center, line trees around its shore, and connect the northern greenhouse fields to paths leading south. Four Fish Ponds sit to the east, with Barns, Coops, and Silos aligned below. This Stardew Valley Forest Farm layout links the separate sections with a simple north-to-south route.",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-06-pond-ring-animal-row.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-06-pond-ring-animal-row-full.webp",
    imageAlt:
      "Trees around the central pond, crop beds near the northern greenhouse, four Fish Ponds to the east, and animal buildings along the south.",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-06-pond-ring-animal-row.json",
  },
];

const forestFarmCasesZhCn: readonly ForestFarmCase[] = [
  {
    id: "01-central-crop-spine",
    title: "主池塘旁的长条作物田",
    summary:
      "把长条作物田布置在中央池塘西侧，再用直路连接温室、农舍和畜牧建筑。三座祝尼魔小屋分散在田地中，东侧则留给小池塘和方尖碑。这套星露谷物语森林农场布局将作物集中成区，也保留西侧林地的独立空间。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection-full.webp",
    imageAlt:
      "中央池塘西侧是长条作物田，温室在上方，东侧集中安排农场建筑。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-01-central-crop-spine-perfection.json",
  },
  {
    id: "02-vertical-crop-columns",
    title: "竖列作物田与池边小屋",
    summary:
      "把作物分成两条纵向田区，放在道路两侧，再用小路串起池塘周围的小屋。西侧林地保持成片，通道则把种植区域划分清楚。这种星露谷物语森林农场布局让田地与树林各有边界，整体路线也更整齐。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-02-spinney-vertical-columns.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-02-spinney-vertical-columns-full.webp",
    imageAlt:
      "两块纵向作物田和道路围绕池塘布置，池边有多间小屋，西侧保留成片树林。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-02-spinney-vertical-columns.json",
  },
  {
    id: "03-west-alcove-animals",
    title: "西侧牧场与层叠田地",
    summary:
      "把畜棚、鸡舍和两座筒仓集中放在西侧空地，东边依次安排几块作物田。下方用花带和三座鱼塘围绕池塘展开。这套星露谷物语森林农场布局将畜牧、种植和水边空间分开规划，路线清晰又保留了林地边缘。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip-full.webp",
    imageAlt:
      "西侧空地集中安排畜牧建筑，旁边有层叠作物田、花带和三座鱼塘。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-03-west-alcove-animals-chip.json",
  },
  {
    id: "04-east-field-fishponds",
    title: "东侧作物田与六座鱼塘平台",
    summary:
      "把畜棚和鸡舍集中在西侧，中部安排一大片田地，农舍南侧再留一块作物区。六座鱼塘在主池塘南侧的木平台上排成一组。这套星露谷物语森林农场布局把东侧空间留给种植，也让鱼塘区集中好打理。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery-full.webp",
    imageAlt:
      "中央和东侧安排作物田，西侧集中畜牧建筑，主池塘南侧木平台上排列着六座鱼塘。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-04-east-field-fishpond-battery.json",
  },
  {
    id: "05-tapper-hardwood-forage",
    title: "树液采集行与林间空地",
    summary:
      "沿农场上方排出几行装有树液采集器的树木，西侧和西南侧则保留树桩与树林空地。池塘旁只安排一小块南瓜田，水边点缀树木。这套星露谷物语森林农场布局更突出林地、树木和穿行道路，不把空地全部改成作物田。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage-full.webp",
    imageAlt:
      "农场上方排列着装有树液采集器的树木，西侧留有树桩林地，池塘边有一小块南瓜田。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-05-tapper-hardwood-forage.json",
  },
  {
    id: "06-pond-ring-animal-row",
    title: "环池树带与南侧畜棚排",
    summary:
      "以中央池塘作为视觉中心，在岸边围出树带，再用道路连接北侧温室田地和南侧区域。四座鱼塘排在东侧，畜棚、鸡舍和筒仓则沿南边排列。这套星露谷物语森林农场布局用一条南北动线串起各处分区。",
    imageSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-06-pond-ring-animal-row.webp",
    imageOriginalSrc:
      "/farm-layouts/forest/images/stardew-valley-forest-farm-layout-06-pond-ring-animal-row-full.webp",
    imageAlt:
      "树木环绕中央池塘，北侧温室旁有作物田，东侧排列四座鱼塘，南侧是一排畜牧建筑。",
    imageWidth: 1600,
    imageHeight: 1300,
    projectHref:
      "/farm-layouts/forest/projects/stardew-valley-forest-farm-layout-06-pond-ring-animal-row.json",
  },
];

const forestFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, ForestFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley Forest Farm Layout",
    metaTitle: "Stardew Valley Forest Farm Layouts: 6 Ideas",
    description:
      "Explore six Stardew Valley Forest Farm layout ideas for long crop fields, wooded paths, animal buildings, and fish ponds. View each map or download its JSON project to adjust in the planner.",
    intro:
      "The Forest Farm map places a central pond among wooded edges and open clearings. Compare six Stardew Valley Forest Farm layout ideas to see how crop fields, animal buildings, fish ponds, and paths can fit around that landscape, then download a project to adapt in the planner.",
    categoryLabel: "Forest Farm",
    browseLabel: "Browse the 6 layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Find a Stardew Valley Forest Farm layout that suits your play",
    casesDescription:
      "Compare a long crop field, vertical growing lanes, waterside paths, a western animal yard, and tree-lined clearings across six Forest Farm plans.",
    ctaHeading: "Make your Forest Farm your own",
    ctaDescription:
      "Choose a Stardew Valley Forest Farm layout you like, download its project, and import it into the planner. Adjust fields, paths, and buildings to fit your save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Forest Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Forest Farm layout is a plan for arranging crops, buildings, trees, and paths across the Forest Farm map.",
      "The ponds and wooded clearings create distinct spaces to plan around. A Stardew Valley Forest Farm layout connects these areas while leaving room to shape each open zone around your own routine.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Forest Farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Select a Stardew Valley Forest Farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, click “Library”, choose “Import JSON”, and select the downloaded project file.",
      },
      {
        number: "03",
        title: "Adjust it to your save",
        body: "Review the imported project and adjust buildings, crops, and paths, using the Stardew Valley Forest Farm layout as a starting point.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Forest Farm layout questions",
    faqDescription:
      "Find practical answers about comparing a Stardew Valley Forest Farm layout, planning around ponds and woods, and importing a project into the planner.",
    faqs: [
      {
        question: "How should I choose a Stardew Valley Forest Farm layout?",
        answer:
          "Each plan arranges crops, buildings, paths, and trees around the map’s ponds and wooded clearings. Compare the six examples to see which spaces you want to connect or keep separate.",
      },
      {
        question: "Where can I place crop fields in these plans?",
        answer:
          "The examples use different open areas: a long field west of the central pond, paired crop blocks, or a large eastern field. Choose the Stardew Valley Forest Farm layout that best matches how you want to organize your farm.",
      },
      {
        question: "Does the downloaded JSON change my game save?",
        answer:
          "No. The JSON is a planner project file. Import it through Library → Import JSON, review the arrangement, and use it as a reference for your in-game farm.",
      },
      {
        question: "Can I change the paths and buildings after importing?",
        answer:
          "Yes. Open the project in the planner and adjust its buildings, crop plots, paths, and other placements to match the spaces available in your farm.",
      },
    ],
    cases: forestFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语森林农场布局",
    metaTitle: "星露谷物语森林农场布局：6 个规划案例",
    description:
      "查看 6 个星露谷物语森林农场布局案例，涵盖长条作物田、林间道路、畜牧建筑和鱼塘规划。可浏览完整地图，或下载 JSON 项目到规划器继续调整。",
    intro:
      "森林农场的中央池塘、林地边缘和开阔空地各有空间特点。对比这六套星露谷物语森林农场布局，看看作物田、畜牧建筑、鱼塘和道路如何围绕地形安排，再下载项目到规划器中继续调整。",
    categoryLabel: "森林农场",
    browseLabel: "浏览 6 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "选择适合你的星露谷物语森林农场布局",
    casesDescription:
      "六个案例从长条作物田、竖列种植区，到水边道路、西侧牧场和林间空地，展示不同的森林农场分区思路。每套星露谷物语森林农场布局都围绕池塘和树林安排空间。",
    ctaHeading: "规划属于你的森林农场",
    ctaDescription:
      "选一套喜欢的星露谷物语森林农场布局，下载项目并导入规划器，再根据自己的存档调整田地、道路和建筑。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是森林农场布局？",
    whatIsParagraphs: [
      "星露谷物语森林农场布局，是在森林农场地图上安排作物、建筑、树木和道路的规划方案。",
      "规划星露谷物语森林农场布局时，可以先标出池塘和林间空地，再用道路连接不同分区。每块开阔地也可以按自己的日常习惯安排用途。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语森林农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "从上方挑选一套星露谷物语森林农场布局，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，点击“本地项目”，再选择“导入 JSON”并选中下载的项目文件。",
      },
      {
        number: "03",
        title: "按存档调整",
        body: "查看导入的星露谷物语森林农场布局项目，再按自己的存档调整建筑、作物田和道路。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "森林农场布局常见问题",
    faqDescription:
      "了解如何比较星露谷物语森林农场布局、规划池塘与林地周边空间，以及在规划器中导入项目。",
    faqs: [
      {
        question: "森林农场布局需要考虑哪些空间？",
        answer:
          "每套案例都围绕地图上的池塘、树林和空地安排作物、建筑与道路。可以先比较六套星露谷物语森林农场布局，看看哪些区域适合连接，哪些适合分开规划。",
      },
      {
        question: "这些案例把作物田安排在哪里？",
        answer:
          "不同案例分别展示中央池塘西侧的长田、两块竖列田地和东侧大田。可以根据自己的种植习惯，选择更合适的星露谷物语森林农场布局作为参考。",
      },
      {
        question: "星露谷物语森林农场布局项目会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目文件。通过“本地项目”里的“导入 JSON”打开后，可以查看分区，再把它作为游戏内农场规划的参考。",
      },
      {
        question: "导入后可以调整道路和建筑吗？",
        answer:
          "可以。在规划器中打开项目后，按自己的地图空间调整建筑、作物田、道路和其他摆放位置。",
      },
    ],
    cases: forestFarmCasesZhCn,
  },
};

export function getForestFarmPageCopy(locale: PublicLocale): ForestFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Forest Farm page locale: ${String(locale)}.`);
  }

  return forestFarmPageCopyByLocale[locale];
}
