import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const iridiumSprinklerLayoutCanonicalPath =
  "/stardew-valley-iridium-sprinkler-layout" as const;

export type IridiumSprinklerLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type IridiumSprinklerLayoutCase = Readonly<{
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

export type IridiumSprinklerLayoutPageCopy = Readonly<{
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
  cover: IridiumSprinklerLayoutCover;
  cases: readonly IridiumSprinklerLayoutCase[];
}>;

const iridiumSprinklerLayoutPreviewWidth = 1600;
const iridiumSprinklerLayoutPreviewHeight = 1300;
const iridiumSprinklerLayoutImageDirectory =
  "/farm-layouts/iridium-sprinkler/images";
const iridiumSprinklerLayoutProjectDirectory =
  "/farm-layouts/iridium-sprinkler/projects";
const iridiumSprinklerLayoutCoverStem = "01-iridium-5x5-grid";

function iridiumSprinklerLayoutImagePath(stem: string, extension: string): string {
  return `${iridiumSprinklerLayoutImageDirectory}/${stem}.${extension}`;
}

function iridiumSprinklerLayoutProjectPath(stem: string): string {
  return `${iridiumSprinklerLayoutProjectDirectory}/${stem}.json`;
}

function createIridiumSprinklerLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): IridiumSprinklerLayoutCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: iridiumSprinklerLayoutImagePath(stem, "webp"),
    imageOriginalSrc: iridiumSprinklerLayoutImagePath(stem, "jpg"),
    imageAlt,
    imageWidth: iridiumSprinklerLayoutPreviewWidth,
    imageHeight: iridiumSprinklerLayoutPreviewHeight,
    projectHref: iridiumSprinklerLayoutProjectPath(stem),
  };
}

function createIridiumSprinklerLayoutCover(
  imageAlt: string,
  caption: string,
): IridiumSprinklerLayoutCover {
  return {
    imageSrc: iridiumSprinklerLayoutImagePath(
      iridiumSprinklerLayoutCoverStem,
      "webp",
    ),
    imageOriginalSrc: iridiumSprinklerLayoutImagePath(
      iridiumSprinklerLayoutCoverStem,
      "jpg",
    ),
    imageAlt,
    imageWidth: iridiumSprinklerLayoutPreviewWidth,
    imageHeight: iridiumSprinklerLayoutPreviewHeight,
    caption,
  };
}

const iridiumSprinklerLayoutCasesEn: readonly IridiumSprinklerLayoutCase[] = [
  createIridiumSprinklerLayoutCase(
    "01-iridium-5x5-grid",
    "20×20 Starfruit Grid",
    "Sixteen Iridium Sprinklers sit five tiles apart on both axes, watering a 20×20 block of 384 Starfruit. This iridium sprinkler layout is a regular grid that is easy to count and adapt.",
    "Standard Farm view of a square Starfruit field with 16 Iridium Sprinklers arranged in five-tile spacing.",
  ),
  createIridiumSprinklerLayoutCase(
    "02-iridium-farm-patches-paths-scarecrows",
    "Crop Patches, Paths, and Scarecrows",
    "Eight Iridium Sprinklers serve separate crop patches with 192 crops: 72 Melons, 72 Starfruit, 24 Blueberries, and 24 Hot Peppers. Wood paths, stone flooring, and seven Scarecrows connect the beds across this Standard Farm.",
    "Standard Farm view of separate crop patches divided by paths, with Iridium Sprinklers and seven Scarecrows.",
  ),
  createIridiumSprinklerLayoutCase(
    "03-scarecrow-radius-iridium",
    "Scarecrow Radius with Iridium Sprinklers",
    "Eight Iridium Sprinklers and 147 Starfruit form an irregular field around one Scarecrow. The image shows how the crop block fits around that protection point on open farm ground.",
    "Standard Farm view of an irregular Starfruit field with eight Iridium Sprinklers and a central Scarecrow.",
  ),
  createIridiumSprinklerLayoutCase(
    "04-greenhouse-6-iridium-116",
    "Six-Sprinkler Greenhouse Reference",
    "This 12×10 bed holds 116 Starfruit and six base Iridium Sprinklers. Four sit among the soil tiles and two sit on the wood edge. It is drawn on Standard Farm ground, not inside the greenhouse.",
    "Standard Farm view of a wood-bordered 12 by 10 crop bed with 116 Starfruit and six Iridium Sprinklers.",
  ),
  createIridiumSprinklerLayoutCase(
    "05-greenhouse-4-iridium-pressure-118",
    "Four Pressure Nozzles in a Greenhouse Reference",
    "This companion 12×10 bed stores 118 Starfruit and four Iridium Sprinklers set to Pressure Nozzle mode. Two occupy soil tiles and two sit on the wood edge; the mock-up is on Standard Farm ground, not indoors.",
    "Standard Farm view of a wood-bordered crop bed with 118 Starfruit and four Iridium Sprinklers upgraded with Pressure Nozzles.",
  ),
  createIridiumSprinklerLayoutCase(
    "06-iridium-pressure-7x7-outdoor",
    "Outdoor Pressure Nozzle Grid",
    "Four Iridium Sprinklers with Pressure Nozzles sit seven tiles apart across a 14×14 field, leaving room for 192 Starfruit. This iridium sprinkler layout shows the wider outdoor grid in one view.",
    "Standard Farm view of a square Starfruit field with four Pressure Nozzle Iridium Sprinklers spaced seven tiles apart.",
  ),
  createIridiumSprinklerLayoutCase(
    "07-junimo-hut-iridium-5x5",
    "Junimo Hut Crop Ring",
    "Eight Iridium Sprinklers divide 192 crops into four surrounding blocks, with a Junimo Hut in the center and four Scarecrows along the paths. The crop mix has 48 each of Starfruit, Melons, Blueberries, and Hot Peppers.",
    "Standard Farm view of four crop blocks around a central Junimo Hut, with Iridium Sprinklers, Scarecrows, and paths.",
  ),
];

const iridiumSprinklerLayoutCasesZhCn: readonly IridiumSprinklerLayoutCase[] = [
  createIridiumSprinklerLayoutCase(
    "01-iridium-5x5-grid",
    "20×20 杨桃方田",
    "16 个铱金洒水器横竖间距均为 5 格，覆盖一块 20×20 方田，保存了 384 株杨桃。这套规则网格方便查看和调整。",
    "标准农场中的杨桃方田，16 个铱金洒水器按五格间距排列。",
  ),
  createIridiumSprinklerLayoutCase(
    "02-iridium-farm-patches-paths-scarecrows",
    "田块、路径与稻草人",
    "8 个铱金洒水器分布在几块独立田地中，共有 192 株作物：72 株甜瓜、72 株杨桃、24 株蓝莓和 24 株辣椒。木路径、石地板和 7 个稻草人连接起各块田地。",
    "标准农场中的分区田块，以路径分隔，田中有铱金洒水器和 7 个稻草人。",
  ),
  createIridiumSprinklerLayoutCase(
    "03-scarecrow-radius-iridium",
    "稻草人半径与铱金洒水器",
    "8 个铱金洒水器和 147 株杨桃围绕一处稻草人形成不规则田区。画面展示作物区在空地上如何绕开稻草人。",
    "标准农场上的不规则杨桃田，设有 8 个铱金洒水器和一个稻草人。",
  ),
  createIridiumSprinklerLayoutCase(
    "04-greenhouse-6-iridium-116",
    "六洒水器温室参考示意",
    "这块 12×10 田地保存了 116 株杨桃和 6 个基础铱金洒水器，其中 4 个在土格中，2 个放在木边上。它画在标准农场空地上，不是温室室内布局。",
    "标准农场空地上的木边田区，包含 116 株杨桃和 6 个铱金洒水器。",
  ),
  createIridiumSprinklerLayoutCase(
    "05-greenhouse-4-iridium-pressure-118",
    "四个压力喷嘴温室参考示意",
    "这块 12×10 田地保存了 118 株杨桃和 4 个装有压力喷嘴的铱金洒水器。2 个占用土格，另 2 个位于木边上；示意位置在标准农场空地，不在温室室内。",
    "标准农场空地上的木边田区，包含 118 株杨桃和 4 个升级了压力喷嘴的铱金洒水器。",
  ),
  createIridiumSprinklerLayoutCase(
    "06-iridium-pressure-7x7-outdoor",
    "户外压力喷嘴方格",
    "4 个装有压力喷嘴的铱金洒水器相隔 7 格，围出一块 14×14 田地，存有 192 株杨桃。画面可以直接查看户外的大间距网格。",
    "标准农场上的杨桃方田，4 个带压力喷嘴的铱金洒水器间隔七格排列。",
  ),
  createIridiumSprinklerLayoutCase(
    "07-junimo-hut-iridium-5x5",
    "祝尼魔屋作物环区",
    "8 个铱金洒水器将 192 株作物分成四块，中央是祝尼魔屋（Junimo Hut），路径旁还有 4 个稻草人。杨桃、甜瓜、蓝莓和辣椒各 48 株。",
    "标准农场上的四块作物田围绕中央祝尼魔屋，田中有铱金洒水器、稻草人和路径。",
  ),
];

const iridiumSprinklerLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, IridiumSprinklerLayoutPageCopy>
> = {
  en: {
    title: "Stardew Valley Iridium Sprinkler Layout",
    metaTitle: "Iridium Sprinkler Layout: 7 Stardew Valley Plans",
    description:
      "Compare seven Standard Farm projects, including a 5×5 Starfruit grid, scarecrow placements, greenhouse references, Pressure Nozzle coverage, and a Junimo Hut field.",
    intro:
      "Compare seven Standard Farm plans, from a 5×5 Starfruit grid to Pressure Nozzle coverage and a Junimo Hut field. Each download is an editable project for a different iridium sprinkler layout: crop rows, separated patches, scarecrow coverage, or a greenhouse reference.",
    categoryLabel: "Planting Layouts",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven iridium sprinkler layout plans",
    casesDescription:
      "All seven projects use the Standard Farm. Check each crop, sprinkler, path, and Scarecrow count, then open its matching project to rearrange the saved objects.",
    ctaHeading: "Edit an iridium sprinkler layout in the planner",
    ctaDescription:
      "Download a JSON project and use Library → Import JSON to open the plan. It opens on the Standard Farm and does not change a game save. Cases 4 and 5 are greenhouse references drawn on farm ground.",
    ctaButtonLabel: "Start planning",
    whatIsHeading: "What an iridium sprinkler layout can show",
    whatIsParagraphs: [
      "An iridium sprinkler layout can be a compact crop grid, separated fields, a Scarecrow-radius example, or a greenhouse reference. The collection also includes a crop field around a Junimo Hut, so you can compare coverage with the way you harvest.",
      "Use the 5×5 grid for a compact Iridium pattern, or compare the 7×7 Pressure Nozzle field when wider coverage matters. Cases 4 and 5 are greenhouse references drawn on Standard Farm ground. Import the matching JSON project to adjust crops and sprinkler positions in the planner.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to import an iridium sprinkler layout",
    howToSteps: [
      {
        number: "01",
        title: "Choose a plan",
        body: "Pick one of the seven iridium sprinkler layout examples and download its JSON project.",
      },
      {
        number: "02",
        title: "Import the project",
        body: "Open the planner, choose Library → Import JSON, and select the downloaded iridium sprinkler layout file.",
      },
      {
        number: "03",
        title: "Adjust placements",
        body: "Move crops, sprinklers, paths, or Scarecrows to fit your farm. The saved iridium sprinkler layout is a starting point, not a game save.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Questions about iridium sprinkler layout projects",
    faqDescription:
      "Answers about the Standard Farm map, Pressure Nozzle variants, greenhouse references, and importing a project.",
    faqs: [
      {
        question: "Which map does each iridium sprinkler layout use?",
        answer:
          "All seven projects use Standard Farm, and their map file is Farm.tmx. Cases 4 and 5 draw greenhouse references on this farm map instead of using the greenhouse interior.",
      },
      {
        question: "Which iridium sprinkler layout uses Pressure Nozzles?",
        answer:
          "Cases 5 and 6 save the Iridium Sprinkler variant for Pressure Nozzle mode. The other five cases use the base Iridium Sprinkler.",
      },
      {
        question: "How many crop tiles are saved in the 5×5 grid?",
        answer:
          "Case 1 stores 384 Starfruit with 16 Iridium Sprinklers in a 20×20 block.",
      },
      {
        question: "Can I change an imported iridium sprinkler layout?",
        answer:
          "Yes. Import the JSON through Library → Import JSON, then move or replace the saved crops, sprinklers, and paths in the planner.",
      },
      {
        question: "Will importing a project change my game save?",
        answer:
          "No. An iridium sprinkler layout JSON is a planner project used as a visual plan; it does not update a Stardew Valley save.",
      },
    ],
    cover: createIridiumSprinklerLayoutCover(
      "Standard Farm screenshot of a square Starfruit field with 16 Iridium Sprinklers arranged in five-tile spacing.",
      "A 20×20 Starfruit field with 16 Iridium Sprinklers, saved as an editable Standard Farm project.",
    ),
    cases: iridiumSprinklerLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语铱金洒水器布局",
    metaTitle: "铱金洒水器布局：7 套星露谷物语规划方案",
    description:
      "查看 7 套标准农场项目，包含 5×5 杨桃网格、稻草人防护、温室参考示意、压力喷嘴覆盖和祝尼魔屋田区。",
    intro:
      "比较 7 套标准农场方案：从 5×5 杨桃方田，到压力喷嘴和祝尼魔屋（Junimo Hut）田区。每个项目都可以继续编辑，涵盖作物行、分区田地、稻草人防护或温室参考示意。",
    categoryLabel: "种植布局",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "7 套铱金洒水器布局",
    casesDescription:
      "7 个项目都使用标准农场。可先对照作物、洒水器、路径和稻草人数量，再打开对应项目调整已保存的摆放。",
    ctaHeading: "在规划器里编辑铱金洒水器布局",
    ctaDescription:
      "下载 JSON 项目，在规划器中选择本地项目 → 导入 JSON。项目会在标准农场中打开，不会修改游戏存档。第 4 和第 5 例是在农场空地上画出的温室参考示意。",
    ctaButtonLabel: "开始规划",
    whatIsHeading: "铱金洒水器布局可以展示什么？",
    whatIsParagraphs: [
      "铱金洒水器布局可以是紧凑作物网格、分区田地、稻草人防护或温室参考；这组方案还包含一块围绕祝尼魔屋布置的作物田，方便比较灌溉与收割动线。",
      "想排紧凑田区，可先看 5×5 网格；想扩大单台覆盖，可比较 7×7 压力喷嘴示例。第 4、5 例是画在标准农场空地上的温室参考。导入对应 JSON 后，可以继续调整作物和洒水器位置。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个项目",
    howToEyebrow: "使用说明",
    howToHeading: "如何导入铱金洒水器布局",
    howToSteps: [
      {
        number: "01",
        title: "选择方案",
        body: "从 7 套铱金洒水器布局中选一套，下载对应的 JSON 项目。",
      },
      {
        number: "02",
        title: "导入项目",
        body: "打开规划器，选择本地项目 → 导入 JSON，再选中下载的文件。",
      },
      {
        number: "03",
        title: "调整摆放",
        body: "按你的农场调整作物、洒水器、路径或稻草人。导入的铱金洒水器布局是规划起点，不是游戏存档。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "关于铱金洒水器项目的问题",
    faqDescription:
      "了解标准农场地图、压力喷嘴变体、温室参考示意和项目导入方法。",
    faqs: [
      {
        question: "这些铱金洒水器布局使用哪张地图？",
        answer:
          "7 个项目都使用标准农场，地图文件为 Farm.tmx。第 4 和第 5 例是画在这张农场地图上的温室参考，不使用温室室内地图。",
      },
      {
        question: "哪些铱金洒水器布局使用压力喷嘴？",
        answer:
          "第 5 和第 6 例保存为压力喷嘴模式。其他 5 例使用基础铱金洒水器。",
      },
      {
        question: "5×5 网格保存了多少作物格？",
        answer: "第 1 例在 20×20 区域保存了 384 株杨桃和 16 个铱金洒水器。",
      },
      {
        question: "导入后可以修改铱金洒水器布局吗？",
        answer:
          "可以。通过本地项目 → 导入 JSON 打开项目后，可以在规划器里移动或替换作物、洒水器和路径。",
      },
      {
        question: "导入项目会修改游戏存档吗？",
        answer:
          "不会。铱金洒水器布局 JSON 是用于查看和编辑的规划器项目，不会更新星露谷物语存档。",
      },
    ],
    cover: createIridiumSprinklerLayoutCover(
      "标准农场中的杨桃方田，16 个铱金洒水器按五格间距排列。",
      "20×20 杨桃田中有 16 个铱金洒水器，可作为标准农场规划器项目继续编辑。",
    ),
    cases: iridiumSprinklerLayoutCasesZhCn,
  },
};

export function getIridiumSprinklerLayoutPageCopy(
  locale: PublicLocale,
): IridiumSprinklerLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new TypeError(
      `Unsupported Iridium Sprinkler Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return iridiumSprinklerLayoutPageCopyByLocale[locale];
}
