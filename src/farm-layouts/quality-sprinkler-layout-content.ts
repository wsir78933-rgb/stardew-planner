import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const qualitySprinklerLayoutCanonicalPath =
  "/stardew-valley-quality-sprinkler-layout" as const;

export type QualitySprinklerLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type QualitySprinklerLayoutCase = Readonly<{
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

export type QualitySprinklerLayoutPageCopy = Readonly<{
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
  cover: QualitySprinklerLayoutCover;
  cases: readonly QualitySprinklerLayoutCase[];
}>;

const qualitySprinklerLayoutPreviewWidth = 1600;
const qualitySprinklerLayoutPreviewHeight = 1300;
const qualitySprinklerLayoutImageDirectory =
  "/farm-layouts/quality-sprinkler/images";
const qualitySprinklerLayoutProjectDirectory =
  "/farm-layouts/quality-sprinkler/projects";
const qualitySprinklerLayoutCoverStem = "01-quality-3x3-grid";

function qualitySprinklerLayoutPreviewSrc(stem: string): string {
  return `${qualitySprinklerLayoutImageDirectory}/${stem}.webp`;
}

function qualitySprinklerLayoutOriginalSrc(stem: string): string {
  return `${qualitySprinklerLayoutImageDirectory}/${stem}-full.webp`;
}

function qualitySprinklerLayoutProjectHref(stem: string): string {
  return `${qualitySprinklerLayoutProjectDirectory}/${stem}.json`;
}

function createQualitySprinklerLayoutCover(
  imageAlt: string,
  caption: string,
): QualitySprinklerLayoutCover {
  return {
    imageSrc: qualitySprinklerLayoutPreviewSrc(qualitySprinklerLayoutCoverStem),
    imageOriginalSrc: qualitySprinklerLayoutOriginalSrc(
      qualitySprinklerLayoutCoverStem,
    ),
    imageAlt,
    imageWidth: qualitySprinklerLayoutPreviewWidth,
    imageHeight: qualitySprinklerLayoutPreviewHeight,
    caption,
  };
}

function createQualitySprinklerLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): QualitySprinklerLayoutCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: qualitySprinklerLayoutPreviewSrc(stem),
    imageOriginalSrc: qualitySprinklerLayoutOriginalSrc(stem),
    imageAlt,
    imageWidth: qualitySprinklerLayoutPreviewWidth,
    imageHeight: qualitySprinklerLayoutPreviewHeight,
    projectHref: qualitySprinklerLayoutProjectHref(stem),
  };
}

const qualitySprinklerLayoutCoverEn = createQualitySprinklerLayoutCover(
  "Standard Farm crop grid with 25 Quality Sprinklers and 200 blueberries.",
  "A 15 by 15 crop block with 25 Quality Sprinklers and 200 blueberries.",
);

const qualitySprinklerLayoutCasesEn: readonly QualitySprinklerLayoutCase[] = [
  createQualitySprinklerLayoutCase(
    "02-quality-clean-patchwork",
    "Clean Patchwork Quality Sprinkler Layout",
    "32 Quality Sprinklers sit among 256 crops: 96 blueberries, 96 melons, 32 hot peppers, and 32 starfruit. Seven scarecrows stand among the crop modules. A grid of 112 Wood Path tiles and 50 Stone Floor tiles separates the mixed beds. This quality sprinkler layout suits mixed crop blocks with marked walkways; its rows are less uniform than the single-crop grids.",
    "Quality Sprinkler crop modules separated by paths in a patchwork field.",
  ),
  createQualitySprinklerLayoutCase(
    "03-scarecrow-radius-quality",
    "Central Scarecrow Melon Layout",
    "20 Quality Sprinklers and 148 melons fill a field with one scarecrow near the middle at (36, 36). With no path tiles between the crops, this quality sprinkler layout suits a continuous melon bed; the scarecrow is placed inside the field rather than on its perimeter.",
    "A Quality Sprinkler crop arrangement with a scarecrow placed within the field.",
  ),
  createQualitySprinklerLayoutCase(
    "04-quality-simple-grid-edge-scarecrows",
    "Quality Grid with Edge Scarecrows",
    "25 Quality Sprinklers and 200 blueberries fill a 15 by 15 crop block. Eight scarecrows sit around its four edges; 25 Wood Path tiles align with the sprinkler positions in five rows. This quality sprinkler layout keeps the scarecrows outside the planting rectangle while retaining a single-crop field.",
    "A large Quality Sprinkler grid with scarecrows placed along the outer edge.",
  ),
  createQualitySprinklerLayoutCase(
    "05-quality-lines-scarecrow-gaps",
    "Line-Based Quality Sprinkler Layout",
    "28 Quality Sprinklers water 197 melons in three rows of 10, 10, and 8 sprinklers. Two scarecrows occupy openings in the final row, while a nine-tile Stone Floor strip marks one column through the field. This quality sprinkler layout leaves deliberate gaps instead of forming a complete rectangle.",
    "Rows of Quality Sprinklers with deliberate gaps for scarecrow placements.",
  ),
  createQualitySprinklerLayoutCase(
    "06-quality-pressure-5x5-outdoor",
    "Four Pressure Nozzle Quality Sprinkler Blocks",
    "Four Quality Sprinklers equipped with Pressure Nozzles form a 2 by 2 grid at (32, 32), (38, 32), (32, 38), and (38, 38). Each nozzle waters a 5 by 5 square of 24 surrounding tiles planted with starfruit, for 96 plants total. A scarecrow stands at (35, 35), where the one-tile-wide bare-ground cross lane meets. The lanes separate the four beds without floor tiles. This quality sprinkler layout demonstrates four separate nozzle zones on Standard Farm.",
    "Four starfruit beds on Standard Farm are separated by a one-tile-wide bare-ground cross lane, with a scarecrow at the center and Pressure Nozzle Quality Sprinklers.",
  ),
  createQualitySprinklerLayoutCase(
    "07-greenhouse-16-quality-108",
    "Greenhouse Reference with Quality Sprinklers",
    "16 Quality Sprinklers form a 4 by 4 grid beside 108 blueberries in a 12 by 10 crop rectangle, framed by 48 Wood Path tiles. The lowest sprinkler row shares the lower path edge. This quality sprinkler layout is a greenhouse reference drawn outdoors on Standard Farm, not an indoor greenhouse map.",
    "A greenhouse-style crop bed with Quality Sprinklers arranged on the Standard Farm map.",
  ),
];

const qualitySprinklerLayoutCoverZhCn = createQualitySprinklerLayoutCover(
  "标准农场上的作物方田，有 25 个优质洒水器和 200 株蓝莓。",
  "15×15 作物田里有 25 个优质洒水器和 200 株蓝莓。",
);

const qualitySprinklerLayoutCasesZhCn: readonly QualitySprinklerLayoutCase[] = [
  createQualitySprinklerLayoutCase(
    "02-quality-clean-patchwork",
    "优质洒水器拼布田",
    "32 个优质洒水器分布在 256 个作物位置中：蓝莓、甜瓜各 96 格，辣椒和杨桃各 32 格。田间分布着 7 个稻草人；112 格木路径和 50 格石质地板将多种作物分隔成拼布模块。这套优质洒水器布局适合展示多种作物与道路穿插的排法，各块形状不如单一作物方田整齐。",
    "道路分隔多个优质洒水器作物模块，组成拼布式田区。",
  ),
  createQualitySprinklerLayoutCase(
    "03-scarecrow-radius-quality",
    "中央稻草人与甜瓜田",
    "20 个优质洒水器和 148 株甜瓜排在同一田区，稻草人位于田块中部附近，坐标是 (36, 36)。作物之间没有铺设道路，适合参考连续甜瓜田的排法；稻草人放在田内，而不是外围。这套优质洒水器布局重点是稻草人位置与甜瓜田的组合。",
    "优质洒水器作物田中放置了一处稻草人。",
  ),
  createQualitySprinklerLayoutCase(
    "04-quality-simple-grid-edge-scarecrows",
    "优质洒水器方格田与边沿稻草人",
    "25 个优质洒水器和 200 株蓝莓排成 15×15 作物田。8 个稻草人沿田块四边摆放，25 格木路径与五行洒水器位置重合。这套优质洒水器布局把稻草人留在种植矩形之外，并保留单一作物田。",
    "大块优质洒水器方格田，稻草人位于外围。",
  ),
  createQualitySprinklerLayoutCase(
    "05-quality-lines-scarecrow-gaps",
    "留出稻草人空位的优质洒水器行列",
    "28 个优质洒水器为 197 株甜瓜供水，分成三行：10、10、8 个。末行留出两个位置摆放稻草人，田间另有一条由 9 格石质地板组成的纵向标记。这套优质洒水器布局保留了明显缺口，不是完整矩形。",
    "优质洒水器排成多行，并留有稻草人位置。",
  ),
  createQualitySprinklerLayoutCase(
    "06-quality-pressure-5x5-outdoor",
    "加压喷头与四块优质洒水器田",
    "4 个安装加压喷头的优质洒水器按 2×2 排列，坐标是 (32, 32)、(38, 32)、(32, 38) 和 (38, 38)。每个喷头覆盖 5×5 范围内的 24 格，四块共种植 96 株杨桃，每块 24 株。稻草人位于 (35, 35) 的通道交汇处；四块田之间留出一格宽的裸地十字通道，不铺地砖。这套优质洒水器布局展示了标准农场上的四个独立加压喷头田区。",
    "标准农场上的四块杨桃田以一格宽的裸地十字通道分开，中央交汇处放有稻草人；四个优质洒水器均装有加压喷头。",
  ),
  createQualitySprinklerLayoutCase(
    "07-greenhouse-16-quality-108",
    "温室参考田中的优质洒水器",
    "16 个优质洒水器组成 4×4 方阵，为 108 株蓝莓供水；种植区为 12×10 矩形，外围由 48 格木路径描边。最下面一行洒水器与下沿路径重合。这套优质洒水器布局画在标准农场室外，只是温室参考示意，不是温室室内地图。",
    "标准农场地图上的温室风格作物田与优质洒水器。",
  ),
];

const qualitySprinklerLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, QualitySprinklerLayoutPageCopy>
> = {
  en: {
    title: "Stardew Valley Quality Sprinkler Layout",
    metaTitle: "Stardew Valley Quality Sprinkler Layout: Six Farm Plans",
    description:
      "Compare six Stardew Valley quality sprinkler layout examples, from patchwork crop blocks and scarecrow placements to an outdoor nozzle study and a greenhouse reference.",
    intro:
      "This Stardew Valley quality sprinkler layout collection follows one sprinkler type across six farm plans. Compare modular crop beds, scarecrow positions, an outdoor nozzle study, and a greenhouse reference, then open the projects to inspect each arrangement.",
    categoryLabel: "Planting Layouts",
    browseLabel: "Compare the six plans",
    openPlannerLabel: "Open the planner",
    casesHeading: "Six Quality Sprinkler Layout Examples",
    casesDescription:
      "Each quality sprinkler layout here focuses on a different field shape or placement choice. Compare the crop blocks and open paths in the screenshots, then use the project files to inspect the map placements.",
    ctaHeading: "Start with a Quality Sprinkler Layout",
    ctaDescription:
      "Download one project and open it in the planner to compare its crop blocks, paths, and sprinkler positions with your own farm plan.",
    ctaButtonLabel: "Plan your farm",
    whatIsHeading: "What Is a Quality Sprinkler Layout?",
    whatIsParagraphs: [
      "A Quality Sprinkler waters the eight surrounding tiles in a 3 by 3 square. A Pressure Nozzle expands the reach to 24 surrounding tiles in a 5 by 5 square. This page compares six quality sprinkler layout examples built around those two sizes: repeating grids, mixed crop blocks, scarecrow positions, and a greenhouse reference.",
      "Each quality sprinkler layout shows a different way to use the field: keep one crop rectangle together, divide it with paths, or leave openings for scarecrows. The greenhouse plan is drawn outdoors on Standard Farm, not inside the game's greenhouse. Use the images and JSON projects to adapt a pattern to your own farm.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Quality Sprinkler Layout",
    howToSteps: [
      {
        number: "01",
        title: "Choose a plan",
        body: "Compare the six quality sprinkler layout examples and pick the crop pattern you want to inspect.",
      },
      {
        number: "02",
        title: "Download and import",
        body: "Download the matching JSON project, open the planner, and choose Library → Import JSON.",
      },
      {
        number: "03",
        title: "Adjust the placements",
        body: "Move the crops, paths, and sprinklers to make the quality sprinkler layout fit your farm and your own route through the field.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Questions about Quality Sprinkler Layouts",
    faqDescription:
      "Answers about the six quality sprinkler layout files, their cover image, the greenhouse reference, and importing a project.",
    faqs: [
      {
        question: "What is included in this quality sprinkler layout collection?",
        answer:
          "It includes six downloadable planner projects. The separate cover is an image preview and does not have a project download.",
      },
      {
        question: "Which farm map do the projects use?",
        answer:
          "These projects are arranged on the Standard Farm map. The greenhouse example is a reference drawn on that map, not the greenhouse interior.",
      },
      {
        question: "What does the outdoor nozzle case show?",
        answer:
          "All four Quality Sprinklers use Pressure Nozzles, so each covers the 24 surrounding tiles in a 5 by 5 square. The plan fills those four zones with 24 starfruit each (96 total), with a scarecrow at (35, 35) where the one-tile-wide bare-ground cross lane meets. The lanes separate the beds without floor tiles.",
      },
      {
        question: "Can I edit a quality sprinkler layout after importing it?",
        answer:
          "Yes. Library → Import JSON opens the plan in the planner, where you can change the placements and save a revised project.",
      },
      {
        question: "Does importing the JSON change a game save?",
        answer:
          "No. The downloaded JSON is a planner project. It can be edited in the planner and does not import into a Stardew Valley game save.",
      },
    ],
    cover: qualitySprinklerLayoutCoverEn,
    cases: qualitySprinklerLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语优质洒水器布局",
    metaTitle: "星露谷物语优质洒水器布局：六种农场排法",
    description:
      "比较六套星露谷物语优质洒水器布局，查看拼布式作物田、稻草人摆位、户外加压喷头案例和温室参考示意。",
    intro:
      "这组星露谷物语优质洒水器布局围绕同一种洒水器，整理了六种农场排法。你可以对比模块田、稻草人位置、户外加压喷头案例和温室参考示意，再打开项目查看具体摆放。",
    categoryLabel: "种植布局",
    browseLabel: "比较六种排法",
    openPlannerLabel: "打开规划器",
    casesHeading: "六种优质洒水器布局示例",
    casesDescription:
      "每套优质洒水器布局都展示不同的田块形状或摆放方式。先比较图片中的作物田和通道，再打开项目查看地图上的物件位置。",
    ctaHeading: "从一套优质洒水器布局开始",
    ctaDescription:
      "下载一份项目，在规划器中打开，对照自己的农场调整作物田、道路和洒水器位置。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是优质洒水器布局？",
    whatIsParagraphs: [
      "未安装加压喷头的优质洒水器会浇灌周围 3×3 格中的 8 格。安装加压喷头后，范围扩大到 5×5 格中的 24 格。本页比较六种优质洒水器布局，涵盖重复方格、多作物模块、稻草人摆位和温室参考示意，呈现两种范围下的田块排法。",
      "每套优质洒水器布局都展示不同的田区安排：整块种植、用道路分隔，或为稻草人留出空位。温室案例画在标准农场的室外，不是游戏里的温室室内地图。你可以参考图片和 JSON 项目，再按自己的农场调整摆放。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用优质洒水器布局",
    howToSteps: [
      {
        number: "01",
        title: "选择排法",
        body: "比较六套优质洒水器布局示例，选出你想查看的作物田排法。",
      },
      {
        number: "02",
        title: "下载并导入",
        body: "下载对应的 JSON 项目，打开规划器，再选择本地项目 → 导入 JSON。",
      },
      {
        number: "03",
        title: "调整摆放",
        body: "移动作物、道路和洒水器，让这套优质洒水器布局适合你的农场与田间动线。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "优质洒水器布局常见问题",
    faqDescription:
      "了解六份优质洒水器布局项目、封面图片、温室参考示意和项目导入方式。",
    faqs: [
      {
        question: "这组优质洒水器布局包含什么？",
        answer:
          "本页提供六份可下载的规划器项目。封面是单独的预览图片，没有对应的项目下载。",
      },
      {
        question: "这些项目使用哪种农场地图？",
        answer:
          "这些项目排在标准农场地图上。温室案例是画在该地图上的参考示意，不是温室室内地图。",
      },
      {
        question: "户外加压喷头案例展示了什么？",
        answer:
          "4 个优质洒水器都安装了加压喷头，每个喷头覆盖 5×5 范围内的 24 格。四个田区各有 24 株杨桃，共 96 株；稻草人位于 (35, 35) 的通道交汇处，田块之间是一格宽的裸地十字通道，不铺地砖。",
      },
      {
        question: "导入后还能编辑优质洒水器布局吗？",
        answer:
          "可以。本地项目 → 导入 JSON 会在规划器中打开布局，你可以调整摆放后另存为新的项目。",
      },
      {
        question: "导入 JSON 会修改游戏存档吗？",
        answer:
          "不会。下载的 JSON 是规划器项目，可以在规划器中编辑，不会导入星露谷物语游戏存档。",
      },
    ],
    cover: qualitySprinklerLayoutCoverZhCn,
    cases: qualitySprinklerLayoutCasesZhCn,
  },
};

export function getQualitySprinklerLayoutPageCopy(
  locale: PublicLocale,
): QualitySprinklerLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Quality Sprinkler Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return qualitySprinklerLayoutPageCopyByLocale[locale];
}
