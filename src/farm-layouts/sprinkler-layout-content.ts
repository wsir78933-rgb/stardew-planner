import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const sprinklerLayoutCanonicalPath =
  "/stardew-valley-sprinkler-layout" as const;

export type SprinklerLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type SprinklerLayoutCase = Readonly<{
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

export type SprinklerLayoutPageCopy = Readonly<{
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
  cover: SprinklerLayoutCover;
  cases: readonly SprinklerLayoutCase[];
}>;

const sprinklerLayoutPreviewWidth = 1600;
const sprinklerLayoutPreviewHeight = 1300;
const sprinklerLayoutImageDirectory = "/farm-layouts/sprinkler/images";
const sprinklerLayoutProjectDirectory = "/farm-layouts/sprinkler/projects";
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";

function sprinklerLayoutPreviewSrc(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}.webp`;
}

function sprinklerLayoutOriginalSrc(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}-full.webp`;
}

function sprinklerLayoutProjectHref(stem: string): string {
  return `${sprinklerLayoutProjectDirectory}/${stem}.json`;
}

function createSprinklerLayoutCover(
  imageAlt: string,
  caption: string,
): SprinklerLayoutCover {
  return {
    imageSrc: sprinklerLayoutPreviewSrc(sprinklerLayoutCoverStem),
    imageOriginalSrc: sprinklerLayoutOriginalSrc(sprinklerLayoutCoverStem),
    imageAlt,
    imageWidth: sprinklerLayoutPreviewWidth,
    imageHeight: sprinklerLayoutPreviewHeight,
    caption,
  };
}

function createSprinklerLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): SprinklerLayoutCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: sprinklerLayoutPreviewSrc(stem),
    imageOriginalSrc: sprinklerLayoutOriginalSrc(stem),
    imageAlt,
    imageWidth: sprinklerLayoutPreviewWidth,
    imageHeight: sprinklerLayoutPreviewHeight,
    projectHref: sprinklerLayoutProjectHref(stem),
  };
}

const sprinklerLayoutCoverEn: SprinklerLayoutCover = createSprinklerLayoutCover(
  "Standard Farm screenshot with eight separated iridium-sprinkler crop patches, paths between them, and seven scarecrows on the paths.",
  "8 separated iridium patches, wood paths, stone floor, and 7 scarecrows standing on the paths. The source project for this stardew valley sprinkler layout picture has 72 melons, 72 starfruit, 24 blueberries, and 24 hot peppers.",
);

const sprinklerLayoutCasesEn: readonly SprinklerLayoutCase[] = [
  createSprinklerLayoutCase(
    "01-basic-knights-move-staggered",
    "Knight-move basic sprinklers",
    "25 basic sprinklers and 92 melons form one staggered block. Neighboring sprinklers sit a knight move apart, one tile on one axis and two tiles on the other. 8 tiles inside sprinkler range have no crop.",
    "Standard Farm screenshot with one central staggered block of basic sprinklers and melons.",
  ),
  createSprinklerLayoutCase(
    "02-quality-3x3-grid",
    "Quality sprinklers on a 15 by 15 block",
    "25 quality sprinklers and 200 blueberries occupy a 15 by 15 tile block, and the sprinklers are 3 tiles apart on both axes.",
    "Standard Farm screenshot with one filled rectangular block of quality sprinklers and blueberries.",
  ),
  createSprinklerLayoutCase(
    "03-iridium-5x5-grid",
    "Iridium sprinklers on a 20 by 20 block",
    "16 iridium sprinklers and 384 starfruit occupy a 20 by 20 tile block, with the sprinklers 5 tiles apart on both axes.",
    "Standard Farm screenshot with one large rectangular block of iridium sprinklers and starfruit.",
  ),
  createSprinklerLayoutCase(
    "04-scarecrow-radius-quality",
    "Quality sprinklers beside one scarecrow",
    "20 quality sprinklers and 148 melons make an irregular patch, and one scarecrow is placed at tile (36, 36). Nearest sprinklers are 3 tiles apart on an axis, but they do not form a complete rectangle. 12 tiles in sprinkler range have no crop.",
    "Standard Farm screenshot with one irregular melon patch and a scarecrow near the middle.",
  ),
  createSprinklerLayoutCase(
    "05-scarecrow-radius-iridium",
    "Iridium sprinklers beside one scarecrow",
    "8 iridium sprinklers and 147 starfruit sit in an irregular patch, with one scarecrow at tile (36, 36). Nearest sprinklers are 5 tiles apart on an axis. 45 tiles in sprinkler range have no crop.",
    "Standard Farm screenshot with one irregular starfruit patch and a scarecrow near the middle.",
  ),
  createSprinklerLayoutCase(
    "06-greenhouse-6-iridium-116",
    "Greenhouse reference on open ground",
    "This is a greenhouse reference drawn on the Standard Farm, not the greenhouse interior. It places a 12 by 10 soil rectangle, a one-tile wood path border, 116 starfruit, and 6 iridium sprinklers: 4 on the soil and 2 on the right-hand wood border. 28 tiles in sprinkler range lie outside that soil rectangle and have no crop.",
    "Standard Farm screenshot with a small wood-bordered crop rectangle and six iridium sprinklers, placed on open farm ground rather than inside the greenhouse.",
  ),
];

const sprinklerLayoutCoverZhCn: SprinklerLayoutCover = createSprinklerLayoutCover(
  "标准农场截图：八块分开的铱金洒水器作物田，田块之间有路径，七个稻草人在路径上。",
  "八块分开的铱金洒水器田、木路径和石质地板，七个稻草人站在路径上。这张星露谷物语洒水器布局封面的源工程有 72 株甜瓜、72 株杨桃、24 株蓝莓和 24 株辣椒。",
);

const sprinklerLayoutCasesZhCn: readonly SprinklerLayoutCase[] = [
  createSprinklerLayoutCase(
    "01-basic-knights-move-staggered",
    "骑士步交错的普通洒水器",
    "25 个普通洒水器和 92 株甜瓜排成一块交错田。相邻洒水器沿一个方向隔 1 格，另一个方向隔 2 格。洒水器范围内有 8 格没有作物。",
    "标准农场截图，中央一块交错排列的普通洒水器和甜瓜。",
  ),
  createSprinklerLayoutCase(
    "02-quality-3x3-grid",
    "15×15 格子上的优质洒水器",
    "25 个优质洒水器和 200 株蓝莓占着一块 15×15 的格子，洒水器横竖都相距 3 格。",
    "标准农场截图，中央一块铺满的优质洒水器和蓝莓方田。",
  ),
  createSprinklerLayoutCase(
    "03-iridium-5x5-grid",
    "20×20 格子上的铱金洒水器",
    "16 个铱金洒水器和 384 株杨桃占着一块 20×20 的格子，横竖间距都是 5 格。",
    "标准农场截图，中央一大块铱金洒水器和杨桃方田。",
  ),
  createSprinklerLayoutCase(
    "04-scarecrow-radius-quality",
    "一个稻草人旁边的优质洒水器",
    "20 个优质洒水器和 148 株甜瓜组成不规则田块，一个稻草人放在坐标 (36, 36)。相邻洒水器沿横或竖相距 3 格，但没有排成完整矩形。洒水器范围内有 12 格没有作物。",
    "标准农场截图，一块不规则甜瓜田，稻草人在田块中部。",
  ),
  createSprinklerLayoutCase(
    "05-scarecrow-radius-iridium",
    "一个稻草人旁边的铱金洒水器",
    "8 个铱金洒水器和 147 株杨桃排成不规则田块，一个稻草人在坐标 (36, 36)。相邻洒水器横竖相距 5 格。洒水器范围内有 45 格没有作物。",
    "标准农场截图，一块不规则杨桃田，稻草人在田块中部。",
  ),
  createSprinklerLayoutCase(
    "06-greenhouse-6-iridium-116",
    "空地上的温室参考示意",
    "这是标准农场上的温室参考示意，不是温室室内地图。一块 12×10 土壤，外围一圈一格宽的木路径，116 株杨桃，6 个铱金洒水器：4 个在土壤上，2 个在右侧木路径上。洒水器范围内有 28 格落在土壤矩形之外，而且没有作物。",
    "标准农场截图：空地上一块带木边的小作物田和六个铱金洒水器，不是温室室内。",
  ),
];

const sprinklerLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, SprinklerLayoutPageCopy>
> = {
  en: {
    title: "Stardew Valley Sprinkler Layout",
    metaTitle: "Stardew Valley Sprinkler Layout: Six Standard Farm Studies",
    description:
      "A stardew valley sprinkler layout comparison of six Standard Farm studies: knight-move basic sprinklers, quality and iridium grids, two scarecrow placements, and a greenhouse reference on open ground.",
    intro:
      "Six Standard Farm studies sit on this page: a knight-move stagger, two rectangular grids, two scarecrow placements, and a greenhouse reference drawn on open ground. Read the sprinkler count, the crop count, and the spacing in each stardew valley sprinkler layout before you download it.",
    categoryLabel: "Sprinkler Layouts",
    browseLabel: "Compare the six plans",
    openPlannerLabel: "Open the planner",
    casesHeading: "Six stardew valley sprinkler layout studies",
    casesDescription:
      "The studies stay on the Standard Farm. Compare the sprinkler count, the crop count, and the spacing in each stardew valley sprinkler layout.",
    ctaHeading: "Open a stardew valley sprinkler layout in the planner",
    ctaDescription:
      "Download a stardew valley sprinkler layout JSON file and import it with Library → Import JSON. Change the Standard Farm plan for your own notes. The file is a planner project, not a game save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a stardew valley sprinkler layout?",
    whatIsParagraphs: [
      "A stardew valley sprinkler layout is a planner project that records sprinklers, crops, paths, and scarecrows on the Standard Farm. The six downloadable files each keep one pattern. The cover picture is separate: several iridium patches with paths, and it has no project file on this page.",
      "Figures on the page come from those files: which sprinkler is placed, how many crop tiles are stored, and how far apart the sprinklers sit. A stardew valley sprinkler layout here does not rank the patterns.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to import a stardew valley sprinkler layout",
    howToSteps: [
      {
        number: "01",
        title: "Choose a file",
        body: "Pick one stardew valley sprinkler layout above and download its JSON project.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, then use Library → Import JSON and select the downloaded file.",
      },
      {
        number: "03",
        title: "Adjust the plan",
        body: "Move sprinklers, crops, paths, and scarecrows in the planner. Keep the stardew valley sprinkler layout as a starting project, not as a game save.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Questions about these sprinkler studies",
    faqDescription:
      "These answers name the farm, the scarecrow coordinates, the greenhouse reference, and the import command for a stardew valley sprinkler layout.",
    faqs: [
      {
        question: "Which farm do these six projects use?",
        answer:
          "Every file uses the Standard Farm, including the cover picture. A stardew valley sprinkler layout in this set places sprinklers, crops, paths, or scarecrows on that farm.",
      },
      {
        question: "How do cases 4 and 5 place the scarecrow?",
        answer:
          "Each of those two files places one scarecrow at tile (36, 36).",
      },
      {
        question: "Is case 6 the greenhouse interior?",
        answer:
          "No. Case 6 is a greenhouse reference drawn on the Standard Farm: a 12 by 10 soil rectangle with a wood border on open farm ground, not the greenhouse interior.",
      },
      {
        question: "Can I edit a file after import?",
        answer:
          "Yes. Library → Import JSON opens the stardew valley sprinkler layout as a planner project. You can move objects and download another copy of the revised project.",
      },
      {
        question: "Does importing a project change a game save?",
        answer:
          "No. The JSON is a planner project, not a game save. Import a stardew valley sprinkler layout through Library → Import JSON and use it as a visual plan.",
      },
    ],
    cover: sprinklerLayoutCoverEn,
    cases: sprinklerLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语洒水器布局",
    metaTitle: "星露谷物语洒水器布局：标准农场上的六个例子",
    description:
      "比较六套标准农场上的星露谷物语洒水器布局：骑士步普通洒水器、优质与铱金方格、两例稻草人放置，以及温室参考示意。",
    intro:
      "这一页有六个标准农场例子：骑士步交错、两块矩形格子、两处稻草人放置，以及画在空地上的温室参考。下载前先看每套星露谷物语洒水器布局的洒水器数量、作物数量和间距。",
    categoryLabel: "洒水器布局",
    browseLabel: "比较这六个方案",
    openPlannerLabel: "打开规划器",
    casesHeading: "六套星露谷物语洒水器布局",
    casesDescription:
      "六套都在标准农场上。对照每套星露谷物语洒水器布局的数量和间距。",
    ctaHeading: "在规划器里打开一套星露谷物语洒水器布局",
    ctaDescription:
      "下载一套星露谷物语洒水器布局的 JSON 文件，用本地项目 → 导入 JSON 打开，再按自己的笔记改摆放。这个文件是规划器项目，不是游戏存档。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是星露谷物语洒水器布局？",
    whatIsParagraphs: [
      "星露谷物语洒水器布局是规划器项目，记录标准农场上的洒水器、作物、路径和稻草人。六个可下载文件各保留一种摆法。封面另有几块带路径的铱金田，本页不提供封面的项目文件。",
      "洒水器种类、作物格数和间距来自这些文件。这里的星露谷物语洒水器布局不给摆法排名。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何导入星露谷物语洒水器布局",
    howToSteps: [
      {
        number: "01",
        title: "选择文件",
        body: "从上方选一套星露谷物语洒水器布局，下载 JSON 项目。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，使用本地项目 → 导入 JSON，然后选中下载的文件。",
      },
      {
        number: "03",
        title: "按计划调整",
        body: "在规划器里移动洒水器、作物、路径和稻草人。把星露谷物语洒水器布局当作起点，而不是游戏存档。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "这些洒水器例子的问题",
    faqDescription:
      "农场种类、稻草人坐标、温室参考，以及导入星露谷物语洒水器布局的命令。",
    faqs: [
      {
        question: "这六个星露谷物语洒水器布局用的是哪种农场？",
        answer: "六个项目和封面图都是标准农场。",
      },
      {
        question: "第 4 例和第 5 例怎样放置稻草人？",
        answer:
          "这两例都只放一个稻草人，坐标是 (36, 36)。",
      },
      {
        question: "第 6 例是温室室内地图吗？",
        answer:
          "不是。第 6 例是标准农场上的温室参考示意：空地上一块 12×10 土壤和木边，不是温室室内地图。",
      },
      {
        question: "导入之后还能改吗？",
        answer:
          "可以。本地项目 → 导入 JSON 会把星露谷物语洒水器布局作为规划器项目打开。移动后还能再下载一份。",
      },
      {
        question: "导入项目会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目，不是游戏存档。用本地项目 → 导入 JSON 打开星露谷物语洒水器布局，当作画面参考。",
      },
    ],
    cover: sprinklerLayoutCoverZhCn,
    cases: sprinklerLayoutCasesZhCn,
  },
};

export function getSprinklerLayoutPageCopy(
  locale: PublicLocale,
): SprinklerLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Sprinkler Layout page locale: ${String(locale)}.`,
    );
  }

  return sprinklerLayoutPageCopyByLocale[locale];
}
