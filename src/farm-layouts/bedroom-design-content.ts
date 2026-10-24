import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const bedroomDesignCanonicalPath =
  "/stardew-valley-bedroom-design" as const;

export type BedroomDesignCase = Readonly<{
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

export type BedroomDesignPageCopy = Readonly<{
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
  cases: readonly BedroomDesignCase[];
}>;

const bedroomDesignImageDirectory = "/farm-layouts/bedroom-design/images";
const bedroomDesignProjectDirectory = "/farm-layouts/bedroom-design/projects";
const featuredBedroomDesignCaseId =
  "01-stardew-valley-bedroom-design-warm-red-classic";

function createBedroomDesignCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): BedroomDesignCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: `${bedroomDesignImageDirectory}/${stem}.webp`,
    imageOriginalSrc: `${bedroomDesignImageDirectory}/${stem}.jpg`,
    imageAlt,
    imageWidth: 2240,
    imageHeight: 1472,
    projectHref: `${bedroomDesignProjectDirectory}/${stem}.json`,
  };
}

const featuredBedroomDesignCasesByLocale: Readonly<
  Record<PublicLocale, BedroomDesignCase>
> = {
  en: createBedroomDesignCase(
    featuredBedroomDesignCaseId,
    "Warm Red Classic Bedroom",
    "The full farmhouse plan pairs a warm-red bedroom with a patterned rug and wood furniture, tying the space into the neighboring rooms.",
    "Full farmhouse layout with a warm-red bedroom, patterned rug, wood furniture, and connected rooms.",
  ),
  "zh-CN": createBedroomDesignCase(
    featuredBedroomDesignCaseId,
    "暖红经典卧室",
    "整套农舍布局以暖红色卧室为主，搭配图案地毯和木质家具，并与相邻房间相连。",
    "完整农舍布局图，暖红色卧室配有图案地毯和木质家具，并与相邻房间连通。",
  ),
};

const bedroomDesignCasesEn: readonly BedroomDesignCase[] = [
  createBedroomDesignCase(
    "02-stardew-valley-bedroom-design-emily-ocean-aquarium",
    "Ocean Aquarium Bedroom",
    "Blue-green bedding and aquarium displays bring ocean tones to the bedroom, while blue furnishings carry the palette into nearby rooms.",
    "Full farmhouse layout with a blue-green bedroom, aquarium displays, and blue furnishings in connected rooms.",
  ),
  createBedroomDesignCase(
    "03-stardew-valley-bedroom-design-penny-spouse-suite",
    "Book-Lined Bedroom",
    "Bookshelves frame the bed above a green rug, with a chair nearby; warm wood furniture completes the quiet reading corner.",
    "Full farmhouse layout featuring a bed framed by bookshelves, a green rug, a nearby chair, and warm wood furniture.",
  ),
  createBedroomDesignCase(
    "04-stardew-valley-bedroom-design-cozy-kids-loft",
    "Soft Neutral Sleeping Areas",
    "Several beds sit among pale patterned rugs and bookshelves, with open wood flooring connecting the sleeping areas.",
    "Full farmhouse layout with several beds, pale patterned rugs, bookshelves, and open wooden floor space.",
  ),
  createBedroomDesignCase(
    "05-stardew-valley-bedroom-design-attic-cozy",
    "Warm-Wood Bedroom",
    "A dark-blue bed and patterned rug set the room apart, with bookshelves, plants, and warm wood furniture nearby.",
    "Full farmhouse layout with a dark-blue bed, patterned rug, bookshelves, plants, and warm wood furniture.",
  ),
  createBedroomDesignCase(
    "06-stardew-valley-bedroom-design-cottagecore-kids",
    "Leafy Cottage Bedroom",
    "Leafy wall patterns, houseplants, green rugs, and bookshelves give the room a cottage feel.",
    "Full farmhouse layout with leafy wall patterns, houseplants, green rugs, bookshelves, and a decorated bedroom.",
  ),
  createBedroomDesignCase(
    "07-stardew-valley-bedroom-design-wizard-junimo-bedroom",
    "Wizard and Junimo Bedroom",
    "Moon-and-star textiles, bookshelves, a crystal ball, and Junimo decor create a wizard-inspired bedroom.",
    "Full farmhouse layout with moon-and-star textiles, bookshelves, a crystal ball, and Junimo decor.",
  ),
];

const bedroomDesignCasesZhCn: readonly BedroomDesignCase[] = [
  createBedroomDesignCase(
    "02-stardew-valley-bedroom-design-emily-ocean-aquarium",
    "海洋水族箱卧室",
    "蓝绿色床品和水族箱营造清爽的海洋感，相邻房间延续了蓝色家具配色。",
    "完整农舍布局图，蓝绿色卧室配有水族箱，相连房间中还有蓝色家具。",
  ),
  createBedroomDesignCase(
    "03-stardew-valley-bedroom-design-penny-spouse-suite",
    "书架环绕卧室",
    "书架围绕床铺，绿色地毯和一把椅子点出阅读角，木质家具让空间显得温暖安静。",
    "完整农舍布局图，床铺周围有书架、绿色地毯和椅子，并搭配温暖的木质家具。",
  ),
  createBedroomDesignCase(
    "04-stardew-valley-bedroom-design-cozy-kids-loft",
    "柔和色调休息区",
    "多张床搭配浅色图案地毯和书架，木地板留出连通各处的开阔空间。",
    "完整农舍布局图，包含多张床、浅色图案地毯、书架和开阔的木地板空间。",
  ),
  createBedroomDesignCase(
    "05-stardew-valley-bedroom-design-attic-cozy",
    "温暖木色卧室",
    "深蓝色床铺和图案地毯成为视觉焦点，周围点缀书架、绿植和木质家具。",
    "完整农舍布局图，深蓝色床铺搭配图案地毯，周围还有书架、绿植和木质家具。",
  ),
  createBedroomDesignCase(
    "06-stardew-valley-bedroom-design-cottagecore-kids",
    "绿意乡村风卧室",
    "植物图案墙面、盆栽、绿色地毯和书架，营造出带有乡村气息的卧室风格。",
    "完整农舍布局图，包含植物图案墙面、盆栽、绿色地毯、书架和装饰过的卧室。",
  ),
  createBedroomDesignCase(
    "07-stardew-valley-bedroom-design-wizard-junimo-bedroom",
    "巫师与祝尼魔卧室",
    "月亮与星星图案床品、书架、占卜水晶球和祝尼魔装饰，组合出巫师主题卧室。",
    "完整农舍布局图，配有月亮与星星图案床品、书架、占卜水晶球和祝尼魔装饰。",
  ),
];

const bedroomDesignPageCopyByLocale: Readonly<
  Record<PublicLocale, BedroomDesignPageCopy>
> = {
  en: {
    title: "Stardew Valley Bedroom Design",
    heading: "Stardew Valley Bedroom Design",
    metaTitle:
      "Stardew Valley Bedroom Design: 6 Ideas | Stardew Valley Planner",
    description:
      "Explore six Stardew Valley bedroom design ideas, from ocean-inspired rooms and book-lined spaces to leafy decor and wizard-themed details. View the full farmhouse plans and download their JSON projects.",
    intro:
      "Explore six bedroom styles, from ocean colors and book-lined spaces to leafy decor and wizard-themed details. Each full farmhouse plan includes a JSON project you can download and adjust.",
    categoryLabel: "Buildings & Interiors",
    browseLabel: "Browse six bedroom designs",
    openPlannerLabel: "Open the planner",
    casesHeading: "Six Stardew Valley Bedroom Design Ideas",
    casesDescription:
      "Each image shows the full farmhouse, with the bedroom styled alongside nearby rooms. Compare palettes, furniture, rugs, bookshelves, plants, and themed decor across all six plans.",
    ctaHeading: "Plan a Bedroom Around Your Style",
    ctaDescription:
      "Choose a favorite, download its JSON project, and adjust the full farmhouse layout in the planner.",
    ctaButtonLabel: "Plan in the farmhouse",
    whatIsHeading: "What is a Stardew Valley bedroom design?",
    whatIsParagraphs: [
      "These bedroom design examples come from full Farmhouse (Upgrade 2) projects. The images show each bedroom in context with neighboring rooms, so you can compare the complete floor plan as you explore each theme.",
      "Download a JSON project to view and edit its placements in Stardew Valley Planner. Compare the colors, furniture, and room arrangement, then adjust the plan to suit your farm.",
    ],
    enlargeImageLabel: "View the full farmhouse layout",
    closeImageLabel: "Close the full layout image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to Use a Bedroom Design Project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body:
          "Open an image to compare the bedroom style with the rest of the farmhouse, then choose a plan to explore.",
      },
      {
        number: "02",
        title: "Download and import the project",
        body:
          "Download the JSON file, open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the downloaded project.",
      },
      {
        number: "03",
        title: "Adjust the room arrangement",
        body:
          "The project opens with its room settings. Move furniture and decorations to make the layout your own.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Valley Bedroom Design Questions",
    faqDescription:
      "Answers about these farmhouse plans, their bedroom styles, and importing JSON projects.",
    faqs: [
      {
        question: "Which farmhouse map do these projects use?",
        answer:
          "The six projects use the Farmhouse (Upgrade 2) map in the planner.",
      },
      {
        question: "Will the expanded rooms appear after importing?",
        answer:
          "Yes. Each project includes the room settings used in its image. You can adjust them under Map > Renovations.",
      },
      {
        question: "Do the images show only the bedroom?",
        answer:
          "No. Each image shows the full farmhouse plan, so you can see the bedroom alongside its connected rooms.",
      },
      {
        question: "How do I open a downloaded design in the planner?",
        answer:
          "Open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the downloaded project file.",
      },
      {
        question: "Will importing a project change my game save?",
        answer:
          "No. These are planner projects. Import one to inspect or edit the arrangement; recreating it in a game save is a separate step.",
      },
      {
        question: "Can I change a layout after importing it?",
        answer:
          "Yes. Move or remove furniture and decorations in the planner to create a room arrangement that suits your farm.",
      },
    ],
    cases: bedroomDesignCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语卧室设计",
    heading: "星露谷物语卧室设计",
    metaTitle: "星露谷物语卧室设计：6 套农舍布局",
    description:
      "浏览 6 套星露谷物语卧室设计案例，涵盖海洋配色、书架环绕、柔和休息区、温暖木色、绿植装饰和巫师主题。查看完整农舍布局并下载 JSON 项目。",
    intro:
      "从海洋配色、书架环绕到绿植装饰和巫师主题，这 6 套卧室设计各有风格。每套都展示完整农舍布局，并提供可下载、可继续调整的 JSON 项目。",
    categoryLabel: "建筑与室内",
    browseLabel: "浏览 6 套卧室设计",
    openPlannerLabel: "打开规划器",
    casesHeading: "6 套星露谷物语卧室设计",
    casesDescription:
      "每张图都展示完整农舍，卧室与相邻房间一同呈现。可以对比 6 套方案的配色、家具、地毯、书架、绿植和主题装饰。",
    ctaHeading: "按喜欢的风格规划卧室",
    ctaDescription:
      "挑选喜欢的方案，下载 JSON 项目并导入规划器，再调整整套农舍布局。",
    ctaButtonLabel: "在农舍地图中规划",
    whatIsHeading: "什么是星露谷物语卧室设计？",
    whatIsParagraphs: [
      "这些卧室方案来自完整的 Farmhouse（升级 2）项目。图片保留了卧室与相邻房间的关系，方便对照整套平面布局查看不同主题。",
      "下载 JSON 项目后，可以在星露谷规划器中查看和编辑摆放。对比配色、家具与房间安排，再按自己的农场规划进行调整。",
    ],
    enlargeImageLabel: "查看完整农舍布局图",
    closeImageLabel: "关闭布局大图",
    downloadProjectLabel: "下载此项目",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用卧室设计项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body:
          "打开图片，对照卧室与整套农舍的摆放，再挑选想查看的方案。",
      },
      {
        number: "02",
        title: "下载并导入项目",
        body:
          "下载 JSON 文件，打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择刚下载的项目。",
      },
      {
        number: "03",
        title: "调整房间摆放",
        body:
          "项目会保留配图中的房间设置。导入后，按自己的喜好调整家具和装饰即可。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语卧室设计常见问题",
    faqDescription:
      "了解农舍布局、卧室风格和 JSON 项目导入方式。",
    faqs: [
      {
        question: "这些项目使用哪张农舍地图？",
        answer:
          "这六套项目使用规划器中的 Farmhouse（升级 2）地图。",
      },
      {
        question: "导入后会保留扩建房间吗？",
        answer:
          "会。项目已保存配图使用的房间设置，导入后即可查看完整房型。想调整房间时，可以在“地图”的 Renovations 中修改。",
      },
      {
        question: "图片只展示卧室吗？",
        answer:
          "不是。每张图都展示完整农舍布局，可以看到卧室与相连房间的关系。",
      },
      {
        question: "如何在规划器中打开下载的设计？",
        answer:
          "打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择下载的项目文件。",
      },
      {
        question: "导入项目会修改我的游戏存档吗？",
        answer:
          "不会。这些是规划器项目，导入后可以查看或编辑布局；在游戏存档中重现摆放需要另行操作。",
      },
      {
        question: "导入后可以调整布局吗？",
        answer:
          "可以。在规划器中移动或移除家具与装饰，按自己的农场规划调整房间摆放。",
      },
    ],
    cases: bedroomDesignCasesZhCn,
  },
};

function requireSupportedBedroomDesignLocale(locale: unknown): asserts locale is PublicLocale {
  if (!publicLocales.some((supportedLocale) => supportedLocale === locale)) {
    throw new Error(
      `Unsupported Bedroom Design page locale: ${JSON.stringify(locale)}.`,
    );
  }
}

export function getBedroomDesignPageCopy(
  locale: PublicLocale,
): BedroomDesignPageCopy {
  requireSupportedBedroomDesignLocale(locale);
  const pageCopy = bedroomDesignPageCopyByLocale[locale];

  if (pageCopy === undefined) {
    throw new Error(
      `Bedroom Design page copy is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return pageCopy;
}

export function getFeaturedBedroomDesignCase(
  locale: PublicLocale,
): BedroomDesignCase {
  requireSupportedBedroomDesignLocale(locale);
  const featuredCase = featuredBedroomDesignCasesByLocale[locale];

  if (featuredCase === undefined) {
    throw new Error(
      `Featured Bedroom Design case ${JSON.stringify(featuredBedroomDesignCaseId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return featuredCase;
}
