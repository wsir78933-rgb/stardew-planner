import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const greenhouseSprinklerLayoutCanonicalPath =
  "/greenhouse-sprinkler-layout-stardew" as const;

export type GreenhouseSprinklerLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type GreenhouseSprinklerLayoutCase = Readonly<{
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

export type GreenhouseSprinklerLayoutPageCopy = Readonly<{
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
  cover: GreenhouseSprinklerLayoutCover;
  cases: readonly GreenhouseSprinklerLayoutCase[];
}>;

const greenhouseSprinklerLayoutImageWidth = 640;
const greenhouseSprinklerLayoutImageHeight = 768;
const greenhouseSprinklerLayoutImageDirectory =
  "/farm-layouts/greenhouse-sprinkler/images";
const greenhouseSprinklerLayoutProjectDirectory =
  "/farm-layouts/greenhouse-sprinkler/projects";
const greenhouseSprinklerLayoutCoverStem =
  "01-greenhouse-sprinkler-layout-stardew";

function greenhouseSprinklerLayoutImageSrc(stem: string): string {
  return `${greenhouseSprinklerLayoutImageDirectory}/${stem}.webp`;
}

function greenhouseSprinklerLayoutProjectHref(stem: string): string {
  return `${greenhouseSprinklerLayoutProjectDirectory}/${stem}.json`;
}

function createGreenhouseSprinklerLayoutCover(
  imageAlt: string,
  caption: string,
): GreenhouseSprinklerLayoutCover {
  const imageSrc = greenhouseSprinklerLayoutImageSrc(
    greenhouseSprinklerLayoutCoverStem,
  );

  return {
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: greenhouseSprinklerLayoutImageWidth,
    imageHeight: greenhouseSprinklerLayoutImageHeight,
    caption,
  };
}

function createGreenhouseSprinklerLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): GreenhouseSprinklerLayoutCase {
  const imageSrc = greenhouseSprinklerLayoutImageSrc(stem);

  return {
    id: stem,
    title,
    summary,
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: greenhouseSprinklerLayoutImageWidth,
    imageHeight: greenhouseSprinklerLayoutImageHeight,
    projectHref: greenhouseSprinklerLayoutProjectHref(stem),
  };
}

const greenhouseSprinklerLayoutCoverEn = createGreenhouseSprinklerLayoutCover(
  "Greenhouse interior with crops, sprinklers, and fruit trees arranged around the planting bed.",
  "Cover preview for the greenhouse sprinkler collection. Each of the six numbered cases has its own planner project.",
);

const greenhouseSprinklerLayoutCasesEn: readonly GreenhouseSprinklerLayoutCase[] =
  [
    createGreenhouseSprinklerLayoutCase(
      "02-greenhouse-iridium-sprinkler-layout",
      "Six Iridium Sprinklers with 116 Crop Tiles",
      "This greenhouse sprinkler layout stardew plan has 18 fruit trees, six standard Iridium Sprinklers, and 116 crop placements. All 116 crop tiles fall within the sprinklers' standard range. The Stardew Valley Wiki also describes a six-Iridium greenhouse arrangement that leaves room for 116 plants. Open the planner project to inspect how the sprinklers sit in relation to the tilled bed.",
      "Eighteen fruit trees frame 116 crop placements and six Iridium Sprinklers in the greenhouse.",
    ),
    createGreenhouseSprinklerLayoutCase(
      "03-stardew-valley-greenhouse-layout-quality-sprinklers",
      "A Mixed Iridium and Quality Sprinkler Grid",
      "Compare four Iridium Sprinklers and 14 Quality Sprinklers around 116 crops, with 14 fruit trees around the greenhouse. This greenhouse sprinkler layout stardew example puts two sprinkler tiers in one map. With the standard ranges, 20 of its 116 crop tiles in the two center columns are out of reach and need hand watering or a repositioned sprinkler. The project shows the exact placements to adjust.",
      "A greenhouse plan combines four Iridium Sprinklers, 14 Quality Sprinklers, crops, and fruit trees.",
    ),
    createGreenhouseSprinklerLayoutCase(
      "04-best-sprinkler-layout-stardew-valley-greenhouse",
      "Sixteen Quality Sprinklers with Twelve Trees",
      "This greenhouse sprinkler layout stardew plan pairs 16 standard Quality Sprinklers with 104 crop placements and 12 fruit trees. All 104 crops are within the sprinklers' standard range. Open the planner project to compare sprinkler positions with the planted rows, then decide whether a Quality-only pattern fits the way you want to use the bed.",
      "Sixteen Quality Sprinklers and 12 fruit trees are arranged around 104 greenhouse crop placements.",
    ),
    createGreenhouseSprinklerLayoutCase(
      "05-optimal-sprinkler-layout-stardew-greenhouse",
      "119-Crop High-Density Plan: 45 Tiles Need Extra Water",
      "This greenhouse sprinkler layout stardew plan has 18 banana trees, six standard Iridium Sprinklers, and 119 crop placements. No Pressure Nozzle is fitted. At the sprinklers' standard range, 45 of the 119 crop tiles are out of reach and need hand watering or a layout change. The Stardew Valley Wiki's 119-plant reference uses five Iridium Sprinklers fitted with Pressure Nozzles, so compare the actual equipment and watering range before using that reference.",
      "A 119-crop greenhouse plan with six Iridium Sprinklers and banana trees; no Pressure Nozzle is fitted.",
    ),
    createGreenhouseSprinklerLayoutCase(
      "06-greenhouse-sprinkler-layout-stardew-mixed",
      "A Mixed Grid with Four Iridium and Eight Quality Sprinklers",
      "Twelve fruit trees sit around this mix of four Iridium Sprinklers, eight Quality Sprinklers, and 116 crop placements. Use this greenhouse sprinkler layout stardew example to compare how the two sprinkler tiers are distributed across the map. At standard range, 16 of the 116 crop tiles in the two center columns are out of reach and need hand watering or repositioned sprinklers. Open the planner project to adjust the layout.",
      "A mixed greenhouse plan has four Iridium and eight Quality Sprinklers, 116 crops, and 12 fruit trees.",
    ),
    createGreenhouseSprinklerLayoutCase(
      "07-greenhouse-sprinkler-layout-stardew-symmetry",
      "A Symmetrical Mixed Sprinkler Arrangement",
      "This greenhouse sprinkler layout stardew plan combines four Iridium Sprinklers and 12 Quality Sprinklers with 116 crops and 10 fruit trees. All 116 crop tiles fall within the sprinklers' standard range. Import the planner project to inspect exact positions, then move the crops or sprinklers to match your own plan.",
      "Four Iridium and 12 Quality Sprinklers form a balanced pattern around greenhouse crops and fruit trees.",
    ),
  ];

const greenhouseSprinklerLayoutCoverZhCn =
  createGreenhouseSprinklerLayoutCover(
    "温室内部的作物、洒水器和果树围绕种植区排布。",
    "星露谷物语温室洒水器布局封面预览；六张编号案例图各有对应的规划器项目。",
  );

const greenhouseSprinklerLayoutCasesZhCn: readonly GreenhouseSprinklerLayoutCase[] =
  [
    createGreenhouseSprinklerLayoutCase(
      "02-greenhouse-iridium-sprinkler-layout",
      "六个铱制洒水器与 116 个作物格",
      "这套星露谷物语温室洒水器布局包含 18 棵果树、6 个普通铱制洒水器和 116 个作物位置。按洒水器的标准范围计算，116 格作物都能被浇到。星露谷物语 Wiki 展示的六铱温室方案也能留出 116 个种植位置。打开规划器项目可以查看洒水器与耕地的实际位置。",
      "温室里有 18 棵果树、116 个作物位置和 6 个铱制洒水器。",
    ),
    createGreenhouseSprinklerLayoutCase(
      "03-stardew-valley-greenhouse-layout-quality-sprinklers",
      "铱制与优质洒水器混合排布",
      "案例在 116 个作物位置周围放置 4 个铱制洒水器和 14 个优质洒水器，温室外围还有 14 棵果树。这套星露谷物语温室洒水器布局把两种等级放在同一张地图里，方便对照。按普通洒水器范围，中央两列共 20 格作物未覆盖，需要手动浇水或调整洒水器位置；具体坐标可在项目中查看。",
      "温室布局混合使用 4 个铱制洒水器、14 个优质洒水器、作物和果树。",
    ),
    createGreenhouseSprinklerLayoutCase(
      "04-best-sprinkler-layout-stardew-valley-greenhouse",
      "16 个优质洒水器与 12 棵果树",
      "这套星露谷物语温室洒水器布局包含 16 个普通优质洒水器、104 个作物位置和 12 棵果树。按洒水器的标准范围计算，104 格作物都能被浇到。打开规划器项目查看洒水器和作物行的位置，再判断这种只用优质洒水器的摆法是否适合自己的规划。",
      "16 个优质洒水器和 12 棵果树围绕 104 个温室作物位置排布。",
    ),
    createGreenhouseSprinklerLayoutCase(
      "05-optimal-sprinkler-layout-stardew-greenhouse",
      "119株高密度方案：45格需补浇",
      "这套星露谷物语温室洒水器布局包含 18 棵香蕉树、6 个普通铱制洒水器和 119 个作物位置，没有安装加压喷头。按洒水器的标准范围计算，119 格作物中有 45 格超出浇水范围，需要手动浇水或调整布局。星露谷物语 Wiki 的 119 株参考排法使用 5 个安装加压喷头的铱制洒水器；使用该参考时，请先核对实际设备和浇水范围。",
      "一套包含 119 个作物位置和 6 个铱制洒水器的温室布局；其中 45 格作物需要补浇。",
    ),
    createGreenhouseSprinklerLayoutCase(
      "06-greenhouse-sprinkler-layout-stardew-mixed",
      "四个铱制与八个优质洒水器混合布局",
      "温室外围摆放 12 棵果树，耕地中安排 4 个铱制洒水器、8 个优质洒水器和 116 个作物位置。这套星露谷物语温室洒水器布局可用来比较两种洒水器等级在同一张图中的分布。按普通洒水器范围，中央两列共 16 格作物未覆盖，需要手动浇水或调整洒水器；具体坐标可以在 JSON 中查看。",
      "混合布局使用 4 个铱制、8 个优质洒水器、116 个作物位置和 12 棵果树。",
    ),
    createGreenhouseSprinklerLayoutCase(
      "07-greenhouse-sprinkler-layout-stardew-symmetry",
      "对称的混合洒水器排布",
      "案例组合了 4 个铱制洒水器、12 个优质洒水器、116 个作物位置和 10 棵果树。按洒水器的标准范围计算，116 格作物都能被浇到。这套星露谷物语温室洒水器布局便于对照两种洒水器等级和耕地空间的分布；导入项目查看坐标后，也可以按自己的计划调整。",
      "四个铱制和十二个优质洒水器在温室作物与果树周围形成均衡排布。",
    ),
  ];

const greenhouseSprinklerLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, GreenhouseSprinklerLayoutPageCopy>
> = {
  en: {
    title: "Greenhouse Sprinkler Layout Stardew: 6 Plans",
    metaTitle: "Greenhouse Sprinkler Layout Stardew: Compare 6 Plans",
    description:
      "Compare six Stardew Valley greenhouse sprinkler layouts with Iridium and Quality Sprinklers, crop counts, and downloadable planner projects.",
    intro:
      "Compare six greenhouse sprinkler layout stardew examples rebuilt on the Greenhouse map. The collection includes Iridium-only, Quality-only, and mixed sprinkler grids, with different crop counts and fruit-tree arrangements. Each greenhouse sprinkler layout stardew case links to its planner JSON so you can inspect actual placements instead of judging coverage from a screenshot alone.",
    categoryLabel: "Greenhouse Layouts",
    browseLabel: "Browse the six plans",
    openPlannerLabel: "Open the planner",
    casesHeading: "Greenhouse Sprinkler Layout Stardew: Six Plans to Compare",
    casesDescription:
      "Each greenhouse sprinkler layout stardew example comes with a Greenhouse map image and a downloadable planner project. Compare sprinkler tiers, crop-space tradeoffs, and tree placements, then inspect their positions in the planner. A greenhouse sprinkler layout stardew plan is easiest to compare when you open it in the planner.",
    ctaHeading: "Plan Your Greenhouse Sprinkler Layout in Stardew Valley",
    ctaDescription:
      "Choose a greenhouse sprinkler layout stardew project, open it in the planner, and adjust crops or sprinkler positions for your own bed. Check each tile's watering range before you use a layout in game. Test the greenhouse sprinkler layout stardew arrangement before you plant.",
    ctaButtonLabel: "Plan a greenhouse layout",
    whatIsHeading: "What Is a Greenhouse Sprinkler Layout in Stardew Valley?",
    whatIsParagraphs: [
      "The Greenhouse has a 12 by 10 tillable plot, giving you 120 crop tiles to plan around. Sprinklers water nearby tilled tiles: a Quality Sprinkler reaches the eight surrounding tiles in a 3 by 3 area, and an Iridium Sprinkler reaches 24 tiles in a 5 by 5 area. Sprinklers can also sit on the wooden border when their range reaches the bed. A greenhouse sprinkler layout stardew plan therefore balances watering range against the crop tiles used by equipment.",
      "The six cases show different item counts rather than one universal arrangement. The Wiki describes six standard Iridium Sprinklers as a way to leave room for 116 plants. This greenhouse sprinkler layout stardew collection includes mixed tiers, fruit trees, and varying crop counts; three plans have 20, 45, and 16 crop tiles outside the sprinklers' standard ranges. Check the actual map, because an upgrade mentioned in a title or image may not be installed.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to Use a Greenhouse Sprinkler Layout",
    howToSteps: [
      {
        number: "01",
        title: "Compare sprinkler tiers",
        body: "Choose a greenhouse sprinkler layout stardew example by its Iridium, Quality, or mixed sprinkler pattern and the crop space it leaves.",
      },
      {
        number: "02",
        title: "Download and import",
        body: "Download the case JSON, open the planner, and choose Library → Import JSON to view its Greenhouse map.",
      },
      {
        number: "03",
        title: "Check each tile",
        body: "Inspect crop and sprinkler coordinates, confirm any upgrades you plan to use, then adapt the greenhouse sprinkler layout stardew project before planting.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Greenhouse Sprinkler Layout Stardew: Common Questions",
    faqDescription:
      "Check sprinkler ranges, crop tiles that need extra watering, and what a 119-crop plan actually includes. Compare each greenhouse sprinkler layout stardew case in the planner before planting.",
    faqs: [
      {
        question: "How many crop tiles does a greenhouse sprinkler layout stardew plan use?",
        answer:
          "The tillable plot is 12 columns by 10 rows, or 120 crop tiles. Sprinklers placed on the wooden border can reach into the plot. A greenhouse sprinkler layout stardew plan can mix border and soil positions, so inspect its map instead of assuming every sprinkler occupies a crop tile.",
      },
      {
        question: "How many tiles do Quality and Iridium Sprinklers water?",
        answer:
          "A Quality Sprinkler waters the eight adjacent tiles in a 3 by 3 area. An Iridium Sprinkler waters the 24 adjacent tiles in a 5 by 5 area. Those are their standard ranges; a Pressure Nozzle extends the range, so check that a greenhouse sprinkler layout stardew project actually includes the upgrade before relying on it.",
      },
      {
        question: "Does the 119-crop plan include a Pressure Nozzle?",
        answer:
          "No. The plan has six standard Iridium Sprinklers and 119 crop placements; 45 crop tiles are outside their standard range. No Pressure Nozzle is fitted. The Stardew Valley Wiki's 119-plant reference uses five Iridium Sprinklers with Pressure Nozzles, so check the actual equipment before using that reference. This greenhouse sprinkler layout stardew example needs extra watering or a layout change.",
      },
      {
        question: "Do the six layouts guarantee complete watering coverage?",
        answer:
          "No. The four-Iridium plus 14-Quality plan has 20 crop tiles outside range; the 119-crop plan has 45; and the four-Iridium plus eight-Quality plan has 16. The six-Iridium, 16-Quality, and four-Iridium plus 12-Quality plans cover their listed crop placements. Import a greenhouse sprinkler layout stardew project, check its map, and confirm any upgrades before using it as an in-game watering plan.",
      },
      {
        question: "Will a greenhouse sprinkler layout stardew project change my save?",
        answer:
          "No. Each JSON is a planner project that you can inspect or edit. Importing a greenhouse sprinkler layout stardew file into the planner does not change your game save. The page has one cover image and six downloadable case projects; the cover is a preview.",
      },
    ],
    cover: greenhouseSprinklerLayoutCoverEn,
    cases: greenhouseSprinklerLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语温室洒水器布局：六套案例",
    metaTitle: "星露谷物语温室洒水器布局｜六套规划案例",
    description:
      "对比六套星露谷物语温室洒水器布局，查看铱制与优质洒水器、作物数量和可下载的规划器项目。",
    intro:
      "这组星露谷物语温室洒水器布局以温室地图为基础，包含铱制、优质和混合洒水器方案，也呈现不同的作物数量与果树排布。每套案例都提供对应的规划器 JSON，打开后可以核对实际坐标，不必只凭截图猜测覆盖范围。对比星露谷物语温室洒水器布局时，建议把洒水器等级、耕地占格和作物数量一起看。",
    categoryLabel: "温室布局",
    browseLabel: "浏览六套案例",
    openPlannerLabel: "打开规划器",
    casesHeading: "星露谷物语温室洒水器布局：六套案例",
    casesDescription:
      "每套星露谷物语温室洒水器布局都配有温室地图图片和可下载项目。对比洒水器等级、种植空间取舍和果树摆放，再到规划器中检查坐标。",
    ctaHeading: "规划你的星露谷物语温室洒水器布局",
    ctaDescription:
      "选择一份星露谷物语温室洒水器布局项目，在规划器中打开 JSON，再按自己的种植区调整作物和洒水器。用于游戏前，按星露谷物语温室洒水器布局地图逐格核对实际浇水范围。",
    ctaButtonLabel: "规划温室布局",
    whatIsHeading: "什么是星露谷物语温室洒水器布局？",
    whatIsParagraphs: [
      "温室可耕地为 12 列×10 行，共 120 个作物格。洒水器会浇灌周围耕地：优质洒水器覆盖 3×3 范围内相邻的 8 格，铱制洒水器覆盖 5×5 范围内相邻的 24 格。洒水器也可以放在木质边框上，只要范围能到达耕地。星露谷物语温室洒水器布局需要在浇水范围与设备占用的种植格之间取舍。",
      "六个案例展示不同物品数量，并不存在唯一通用排法。Wiki 的温室参考方案中，6 个普通铱制洒水器可为 116 株作物留出位置。这组星露谷物语温室洒水器布局还包括混合等级、果树和不同作物数量；其中四铱加十四优质洒水器方案有 20 格、119 株方案有 45 格、四铱加八优质洒水器方案有 16 格作物超出标准范围。请查看地图位置；标题或图片提到的升级不一定已经安装。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个项目",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语温室洒水器布局",
    howToSteps: [
      {
        number: "01",
        title: "比较洒水器等级",
        body: "按铱制、优质或混合洒水器，以及布局保留的作物空间，挑选星露谷物语温室洒水器布局案例。",
      },
      {
        number: "02",
        title: "下载并导入",
        body: "下载案例 JSON，打开规划器并选择“本地项目 → 导入 JSON”，查看 Greenhouse 温室地图。",
      },
      {
        number: "03",
        title: "逐格核对范围",
        body: "检查作物与洒水器坐标，确认打算使用的升级，再调整星露谷物语温室洒水器布局后开始种植。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语温室洒水器布局常见问题",
    faqDescription:
      "了解洒水器范围、六套规划器方案的内容，以及 119 株方案是否安装加压喷头。比较星露谷物语温室洒水器布局时，先看地图位置。",
    faqs: [
      {
        question: "星露谷物语温室洒水器布局有多少个作物格？",
        answer:
          "可耕地为 12 列×10 行，共 120 格。木质边框上的洒水器也能覆盖到耕地。星露谷物语温室洒水器布局会把洒水器放在边框或耕地位置，不能只按洒水器数量推断占格情况，应打开地图查看。",
      },
      {
        question: "优质和铱制洒水器分别浇多少格？",
        answer:
          "优质洒水器会浇灌 3×3 范围内相邻的 8 格；铱制洒水器会浇灌 5×5 范围内相邻的 24 格。这是标准范围。加压喷头会扩大范围，因此使用星露谷物语温室洒水器布局前，应先确认方案里确实装有加压喷头。",
      },
      {
        question: "119 株方案真的装了加压喷头吗？",
        answer:
          "没有。方案有 6 个普通铱制洒水器和 119 个作物位置，其中 45 格超出标准范围。Wiki 的 119 株参考排法使用 5 个安装加压喷头的铱制洒水器；这套方案没有安装加压喷头。请核对实际设备和范围，不要只看标题或图片就判断星露谷物语温室洒水器布局能否浇到全部作物。",
      },
      {
        question: "六套布局都能保证作物全部浇到吗？",
        answer:
          "不能保证。四铱加十四优质洒水器方案有 20 格、119 株方案有 45 格、四铱加八优质洒水器方案有 16 格作物未覆盖；六铱、十六优质、四铱加十二优质洒水器方案的作物都在范围内。导入星露谷物语温室洒水器布局后，请检查地图和设备，再决定是否照此浇水。",
      },
      {
        question: "导入星露谷物语温室洒水器布局项目会修改存档吗？",
        answer:
          "不会。每个 JSON 都是供查看或编辑的规划器项目，导入规划器不会修改游戏存档。页面提供一张封面预览和六个可下载案例项目，封面本身没有单独的案例下载。",
      },
    ],
    cover: greenhouseSprinklerLayoutCoverZhCn,
    cases: greenhouseSprinklerLayoutCasesZhCn,
  },
};

export function getGreenhouseSprinklerLayoutPageCopy(
  locale: PublicLocale,
): GreenhouseSprinklerLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Greenhouse Sprinkler Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return greenhouseSprinklerLayoutPageCopyByLocale[locale];
}
