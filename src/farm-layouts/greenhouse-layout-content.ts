import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const greenhouseLayoutCanonicalPath =
  "/stardew-greenhouse-layout" as const;

export type GreenhouseLayoutCase = Readonly<{
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

export type GreenhouseLayoutPageCopy = Readonly<{
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
  cases: readonly GreenhouseLayoutCase[];
}>;

const greenhouseImageDirectory = "/farm-layouts/greenhouse/images";
const greenhouseProjectDirectory = "/farm-layouts/greenhouse/projects";

function greenhouseCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): GreenhouseLayoutCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: `${greenhouseImageDirectory}/${stem}.webp`,
    imageOriginalSrc: `${greenhouseImageDirectory}/${stem}.png`,
    imageAlt,
    imageWidth: 640,
    imageHeight: 768,
    projectHref: `${greenhouseProjectDirectory}/${stem}.json`,
  };
}

const greenhouseLayoutCasesEn: readonly GreenhouseLayoutCase[] = [
  greenhouseCase(
    "01-stardew-greenhouse-layout",
    "Stardew Greenhouse Layout",
    "A T-shaped stone path divides this Stardew greenhouse layout into four crop beds. Four Iridium Sprinklers sit inside the field; four Quality Sprinklers line the southern wooden edge, and 12 fruit trees surround the greenhouse. The 86 crop placements mix berries, grapes, peppers, tomatoes, and strawberries.",
    "Greenhouse plan with a central T-shaped stone walkway, four crop sections, eight sprinklers, and fruit trees around the glass room.",
  ),
  greenhouseCase(
    "02-best-greenhouse-layout-stardew",
    "Best Greenhouse Layout Stardew",
    "Mixed crop rows fill 116 tiles between six Iridium Sprinklers, with 18 fruit trees around the perimeter.",
    "Greenhouse layout with mixed crop rows, six Iridium Sprinklers, and fruit trees around the outside edge.",
  ),
  greenhouseCase(
    "03-greenhouse-setup-stardew",
    "Greenhouse Setup Stardew",
    "In this Stardew greenhouse layout, a regular grid holds 116 Cranberries, with six Iridium Sprinklers between the rows. Twelve fruit trees, including Banana and Mango, line the walls.",
    "Greenhouse setup with a cranberry field, six Iridium Sprinklers, and a mix of regular and tropical fruit trees.",
  ),
  greenhouseCase(
    "04-optimal-stardew-valley-greenhouse-layout",
    "Optimal Stardew Valley Greenhouse Layout",
    "The 114 crop tiles form vertical strips between six Iridium Sprinklers, with six fruit trees along the north side.",
    "Greenhouse layout with six Iridium Sprinklers inside the crop field, six trees along the north wall, and vertical crop strips.",
  ),
  greenhouseCase(
    "05-best-greenhouse-setup-stardew",
    "Best Greenhouse Setup Stardew",
    "A uniform grid of 116 Ancient Fruit fills the field; six Iridium Sprinklers sit among the rows, and 18 fruit trees line the perimeter.",
    "Greenhouse setup with rows of Ancient Fruit, six Iridium Sprinklers, and 18 fruit trees around the perimeter.",
  ),
  greenhouseCase(
    "06-ideal-greenhouse-layout-stardew",
    "Ideal Greenhouse Layout Stardew",
    "Ten fruit trees, including Banana and Mango, share the crop rectangle with 110 Ancient Fruit and six Iridium Sprinklers. The sprinklers cover 59 of the 110 crop tiles, leaving 51 for hand watering unless you reposition them. The image shows mature trees with crops nearby; in a save, move close trees apart and keep each sapling's eight surrounding tiles clear until it matures, then restore crops.",
    "Greenhouse layout with Banana and Mango trees among Ancient Fruit rows and six Iridium Sprinklers.",
  ),
  greenhouseCase(
    "07-stardew-greenhouse-layout-packed",
    "Stardew Greenhouse Layout Packed",
    "This packed Stardew greenhouse layout combines 48 Ancient Fruit, 34 Starfruit, and 34 Pineapple placements with six Iridium Sprinklers. Eighteen fruit trees, including Banana and Mango, fill the outer planting spaces.",
    "Packed greenhouse layout with Ancient Fruit, Starfruit, Pineapple, six Iridium Sprinklers, and 18 fruit trees.",
  ),
];

const greenhouseLayoutCasesZhCn: readonly GreenhouseLayoutCase[] = [
  greenhouseCase(
    "01-stardew-greenhouse-layout",
    "星露谷温室布局",
    "T 形石路把这套温室布局的种植区分成四块。田内有 4 个铱制洒水器，南侧木边一排摆放 4 个优质洒水器，温室外围有 12 棵果树。86 个作物位置混种了浆果、葡萄、辣椒、番茄和草莓。",
    "温室规划图：中央 T 形石路将种植区分成四块，周围摆放洒水器和果树。",
  ),
  greenhouseCase(
    "02-best-greenhouse-layout-stardew",
    "星露谷最佳温室布局",
    "116 个作物格排成混合作物行，行间放置 6 个铱制洒水器，外围有 18 棵果树。",
    "温室布局图：混合作物行、6 个铱制洒水器和外围果树。",
  ),
  greenhouseCase(
    "03-greenhouse-setup-stardew",
    "星露谷温室摆放方案",
    "规整田块中种了 116 株蔓越莓，行间放置 6 个铱制洒水器。墙边有 12 棵果树，包括香蕉树和芒果树，呈现单一作物田与热带果树并列的布局。",
    "温室摆放图：蔓越莓田、6 个铱制洒水器，以及普通和热带果树。",
  ),
  greenhouseCase(
    "04-optimal-stardew-valley-greenhouse-layout",
    "星露谷物语温室布局方案",
    "田块内 114 个作物位置排成纵向种植带，6 个铱制洒水器分布其间，北侧另有 6 棵果树。",
    "温室布局图：耕地区域内有 6 个铱制洒水器，北侧有 6 棵树，作物分成纵向种植带。",
  ),
  greenhouseCase(
    "05-best-greenhouse-setup-stardew",
    "星露谷最佳温室摆放方案",
    "116 株远古水果按规整网格种植，6 个铱制洒水器分布在作物行间，18 棵果树沿温室外围摆放。",
    "温室摆放图：远古水果种植行、6 个铱制洒水器和外围 18 棵果树。",
  ),
  greenhouseCase(
    "06-ideal-greenhouse-layout-stardew",
    "星露谷理想温室布局",
    "耕地区域里混排 10 棵果树（香蕉树和芒果树）、110 株远古水果与 6 个铱制洒水器。洒水器覆盖 110 个作物格中的 59 格，剩余 51 格需手动浇水或调整洒水器位置。图片展示的是成熟树木与周围已种作物的状态；在存档中重现时先拉开过近的树位，让每棵树苗周围八格保持空地，成熟后再补种作物。",
    "温室布局图：香蕉树和芒果树分布在远古水果种植行之间，并配有 6 个铱制洒水器。",
  ),
  greenhouseCase(
    "07-stardew-greenhouse-layout-packed",
    "星露谷密植温室布局",
    "田里混种 48 株远古水果、34 株杨桃和 34 株菠萝，并配有 6 个铱制洒水器。外围种着 18 棵果树，包括香蕉树和芒果树。",
    "密植温室布局图：远古水果、杨桃、菠萝、6 个铱制洒水器和 18 棵果树。",
  ),
];

const greenhouseLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, GreenhouseLayoutPageCopy>
> = {
  en: {
    title: "Stardew Greenhouse Layout",
    heading: "Stardew Greenhouse Layout",
    metaTitle: "Stardew Greenhouse Layout: 7 Plans | Stardew Valley Planner",
    description:
      "Compare seven Stardew greenhouse layout projects, from a four-bed walkway and mixed crops to Ancient Fruit rows and a packed tropical tree plan. View each greenhouse map and download its JSON project.",
    intro:
      "A Stardew greenhouse layout can leave room for a clear path, mixed crop rows, fruit trees, or a single-crop field. Browse all seven plans for the Greenhouse map, then open an image or download its project file.",
    categoryLabel: "Greenhouse Layouts",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven Stardew Greenhouse Layout Ideas",
    casesDescription:
      "Each Stardew greenhouse layout below uses the same 20-by-24 interior, with a different arrangement for the 12-by-10 crop plot. Compare crop mixes, tree counts, sprinkler positions, and paths before choosing a plan to adapt.",
    ctaHeading: "Choose a Stardew Greenhouse Layout to Adapt",
    ctaDescription:
      "Start with the Stardew greenhouse layout that fits your crop and tree choices. Download its JSON project, import it into the planner, and move placements to fit your greenhouse.",
    ctaButtonLabel: "Plan in the greenhouse",
    whatIsHeading: "What is a Stardew Greenhouse Layout?",
    whatIsParagraphs: [
      "A Stardew greenhouse layout is a planner project showing where crops, sprinklers, fruit trees, and paths go inside the Greenhouse. These seven examples use the same room in different ways: the cover has a T-shaped walkway, some plans mix crop rows, and others place trees along the wall or inside the soil rectangle.",
      "The Greenhouse map has a 12-by-10 crop plot, a one-tile wooden border for sprinklers, and fruit-tree planting spaces around the room. With six Iridium Sprinklers, four can sit on soil and two on the border, leaving 116 crop spaces. Sprinklers water only tilled tiles. Paths, trees, and sprinklers placed on soil leave less room for crops.",
      "Every plan shown here has at least one pair of trees whose 3-by-3 growing areas overlap. Move those positions apart before planting and keep each sapling's eight neighboring tiles clear until it matures. Crops can go nearby once a tree is mature; waiting does not fix overlapping positions.",
    ],
    enlargeImageLabel: "View full greenhouse layout",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to Use a Stardew Greenhouse Layout",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body:
          "Choose a Stardew greenhouse layout above and open its image to check crop, tree, and path positions.",
      },
      {
        number: "02",
        title: "Download and import the project",
        body:
          "Download the JSON file, open Stardew Valley Planner, choose “Library” > “Import JSON”, and select the downloaded project.",
      },
      {
        number: "03",
        title: "Review the greenhouse map",
        body:
          "Confirm the project uses the Greenhouse map. Then move crops, sprinklers, or trees in the planner to fit your plan.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Greenhouse Layout Questions",
    faqDescription:
      "Answers about planning a Stardew greenhouse layout, growing fruit trees, and watering crops.",
    faqs: [
      {
        question: "Which map do the Stardew greenhouse layout projects use?",
        answer:
          "All seven JSON projects use the indoor Greenhouse map. The images show the room interior rather than an outdoor farm.",
      },
      {
        question: "How many crops can the six-sprinkler plans hold?",
        answer:
          "Plans with six Iridium Sprinklers, four on soil and two on the wooden border, show 116 crop placements. Others use more space for trees, sprinklers, or paths, so their counts differ.",
      },
      {
        question: "Do all six-sprinkler projects water every crop automatically?",
        answer:
          "No. In the tropical-tree plan, six Iridium Sprinklers cover 59 of the 110 crop tiles. Hand-water the other 51 or move the sprinklers before using this arrangement in a save.",
      },
      {
        question: "Can fruit trees grow beside crops in a greenhouse?",
        answer:
          "Yes, after the trees mature. Before then, each sapling needs its own clear 3-by-3 growing area, and neighboring tree areas cannot overlap. Every plan has at least one close pair; move those trees apart before planting and keep each tree's eight surrounding tiles clear until it matures. Nearby crops can go in afterward, but maturity does not fix overlapping positions. Greenhouse trees can grow in suitable soil or border spaces, but not in corners.",
      },
      {
        question: "Which plan should I choose?",
        answer:
          "The best Stardew greenhouse layout for you depends on the crop mix, tree positions, path space, and sprinkler reach. Choose the one that fits what you want to grow and how you want to move through the room.",
      },
      {
        question: "Will importing a project change my game save?",
        answer:
          "No. These files are planner projects. Import one to inspect or edit the plan; recreating it in a save is a separate in-game step.",
      },
    ],
    cases: greenhouseLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语温室布局",
    heading: "星露谷物语温室布局",
    metaTitle: "星露谷物语温室布局：7 套规划方案",
    description:
      "查看 7 套星露谷物语温室规划，涵盖 T 形石路、混合作物、远古水果种植行和热带果树。可浏览温室地图并下载对应 JSON 项目。",
    intro:
      "星露谷物语温室布局可以为通道、混种作物、果树或单一种植田留出空间。这里有 7 套温室规划，可查看布局图或下载对应项目。",
    categoryLabel: "温室布局",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "7 套星露谷物语温室布局方案",
    casesDescription:
      "7 套方案都使用相同的 20×24 室内地图，但耕地区域的安排各不相同。可以比较作物组合、果树数量、洒水器位置和道路，再挑选想继续调整的一套。",
    ctaHeading: "选择一套温室布局继续规划",
    ctaDescription:
      "按想种的作物和果树挑选方案，下载 JSON 项目并导入规划器，再逐个调整摆放位置。",
    ctaButtonLabel: "在温室地图中规划",
    whatIsHeading: "什么是星露谷物语温室布局？",
    whatIsParagraphs: [
      "温室布局是展示作物、洒水器、果树和道路位置的规划器项目。这里的 7 套方案使用同一间温室：首图用 T 形石路分区，有些方案混种作物，也有沿墙或耕地区域内摆放果树的安排。",
      "温室内有 12×10 耕地，外侧一格宽的木边可放置洒水器，房间周围也有果树种植位。洒水器只浇已耕地。六个铱制洒水器中，4 个放在耕地、2 个放在木边，可留下 116 个作物格。",
      "每棵果树树苗都需要独立、畅通的 3×3 生长区，彼此不能重叠。7 套里都至少有一组树位过近：01–05、07 在北侧树列，06 在热带果树区。先拉开树位，再让每棵树苗周围八格保持空地，直到成熟后再种回作物；等成熟不能解决树位重叠。",
    ],
    enlargeImageLabel: "查看完整温室布局图",
    closeImageLabel: "关闭布局大图",
    downloadProjectLabel: "下载此布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语温室布局",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "打开图片查看作物、果树和道路位置，再挑选想调整的一套。",
      },
      {
        number: "02",
        title: "下载并导入项目",
        body:
          "下载 JSON 文件，打开星露谷规划器，选择“本地项目” > “导入 JSON”，再选择刚下载的项目。",
      },
      {
        number: "03",
        title: "确认温室地图",
        body:
          "确认项目使用温室地图，然后在规划器中移动作物、洒水器或果树，按需调整布局。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷温室布局常见问题",
    faqDescription:
      "了解温室地图、洒水器覆盖、果树间距和项目导入方式。",
    faqs: [
      {
        question: "这些温室布局项目使用哪张地图？",
        answer:
          "七个项目都使用温室室内地图，图片展示的是温室内部，不是室外农场。",
      },
      {
        question: "六个洒水器的方案能种多少作物？",
        answer:
          "4 个铱制洒水器放在耕地、2 个放在木边的方案可安排 116 个作物格。其余方案会为果树、洒水器或道路留出不同空间，作物格数量也各不相同。",
      },
      {
        question: "所有六洒水器方案都能自动浇灌每个作物吗？",
        answer:
          "不能。第 06 套热带果树布局里，6 个铱制洒水器覆盖 110 个作物格中的 59 格；其余 51 格需要手动浇水或调整洒水器。",
      },
      {
        question: "温室里的果树可以和作物相邻吗？",
        answer:
          "可以，但树苗成熟前需要独立、畅通且不重叠的 3×3 生长区，周围八格也要留空。先拉开过近的树位，等成熟后再种回邻近作物。温室果树可种在合适的耕地或边缘位置，不能种在四角。",
      },
      {
        question: "我该怎么挑选布局？",
        answer:
          "对照作物组合、果树位置、道路和洒水器覆盖，再按种植目标和行走习惯挑选。",
      },
      {
        question: "导入项目会修改我的游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目；导入后可以查看或编辑布局。在游戏存档里重现摆放需要另行操作。",
      },
    ],
    cases: greenhouseLayoutCasesZhCn,
  },
};

export function getGreenhouseLayoutPageCopy(
  locale: PublicLocale,
): GreenhouseLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Greenhouse Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return greenhouseLayoutPageCopyByLocale[locale];
}

export function getFeaturedGreenhouseLayoutCase(
  locale: PublicLocale,
): GreenhouseLayoutCase {
  const expectedFeaturedCaseId = "01-stardew-greenhouse-layout";
  const pageCopy = getGreenhouseLayoutPageCopy(locale);
  const featuredCase = pageCopy.cases[0];

  if (!featuredCase) {
    throw new Error(
      `Featured Greenhouse Layout case ${JSON.stringify(expectedFeaturedCaseId)} is missing for locale ${JSON.stringify(locale)}. Received first case ID: <missing>.`,
    );
  }

  if (featuredCase.id !== expectedFeaturedCaseId) {
    throw new Error(
      `Featured Greenhouse Layout case must be first for locale ${JSON.stringify(locale)}. Expected ${JSON.stringify(expectedFeaturedCaseId)}; received ${JSON.stringify(featuredCase.id)}.`,
    );
  }

  return featuredCase;
}
