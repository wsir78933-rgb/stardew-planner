import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const greenhouseTreeLayoutCanonicalPath =
  "/stardew-greenhouse-tree-layout" as const;

export type GreenhouseTreeLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type GreenhouseTreeLayoutCase = Readonly<{
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

export type GreenhouseTreeLayoutPageCopy = Readonly<{
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
  cover: GreenhouseTreeLayoutCover;
  cases: readonly GreenhouseTreeLayoutCase[];
}>;

const greenhouseTreeLayoutImageWidth = 640;
const greenhouseTreeLayoutImageHeight = 768;
const greenhouseTreeLayoutImageDirectory =
  "/farm-layouts/greenhouse-tree/images";
const greenhouseTreeLayoutProjectDirectory =
  "/farm-layouts/greenhouse-tree/projects";
const greenhouseTreeLayoutCoverStem = "01-stardew-greenhouse-tree-layout";

function greenhouseTreeLayoutImageSrc(stem: string): string {
  return `${greenhouseTreeLayoutImageDirectory}/${stem}.webp`;
}

function greenhouseTreeLayoutProjectHref(stem: string): string {
  return `${greenhouseTreeLayoutProjectDirectory}/${stem}.json`;
}

function createGreenhouseTreeLayoutCover(
  imageAlt: string,
  caption: string,
): GreenhouseTreeLayoutCover {
  const imageSrc = greenhouseTreeLayoutImageSrc(
    greenhouseTreeLayoutCoverStem,
  );

  return {
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: greenhouseTreeLayoutImageWidth,
    imageHeight: greenhouseTreeLayoutImageHeight,
    caption,
  };
}

function createGreenhouseTreeLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): GreenhouseTreeLayoutCase {
  const imageSrc = greenhouseTreeLayoutImageSrc(stem);

  return {
    id: stem,
    title,
    summary,
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: greenhouseTreeLayoutImageWidth,
    imageHeight: greenhouseTreeLayoutImageHeight,
    projectHref: greenhouseTreeLayoutProjectHref(stem),
  };
}

const greenhouseTreeLayoutCoverEn = createGreenhouseTreeLayoutCover(
  "A Greenhouse map with fruit trees arranged around a central crop and sprinkler area.",
  "Cover preview for this greenhouse fruit tree collection; the six numbered case images have separate planner projects.",
);

const greenhouseTreeLayoutCasesEn: readonly GreenhouseTreeLayoutCase[] = [
  createGreenhouseTreeLayoutCase(
    "02-fruit-tree-layout-greenhouse-stardew",
    "Six Fruit Tree Varieties Around a Greenhouse Crop Bed",
    "The full ring uses 18 fruit trees around the Greenhouse map: three each of cherry, apricot, orange, peach, pomegranate, and apple. This stardew greenhouse tree layout fills the central 12 by 10 bed with 116 starfruit, using 12 Quality Sprinklers and four Iridium Sprinklers. Open the project to compare the ring with its crop and sprinkler pattern.",
    "Six fruit tree varieties surround the greenhouse crop bed and sprinkler pattern.",
  ),
  createGreenhouseTreeLayoutCase(
    "03-stardew-greenhouse-tree-layout-seasonal",
    "Fourteen Trees with an Open Greenhouse Entrance",
    "To keep the south entrance row open, this plan places 14 fruit trees along the other sides. Its stardew greenhouse tree layout also combines 116 blueberries with 12 Quality Sprinklers and four Iridium Sprinklers. Compare it with the full ring to see how fewer trees open space near the doorway.",
    "Fourteen fruit trees line the greenhouse sides while the south entrance remains open.",
  ),
  createGreenhouseTreeLayoutCase(
    "04-stardew-greenhouse-tree-layout-mature-ring",
    "Banana and Mango Trees Mixed into an Ancient Fruit Bed",
    "The main growing area holds nine tropical fruit trees: five mango trees and four banana trees. Treat this stardew greenhouse tree layout as a mature-tree example; clear each sapling's 3 by 3 growth area until it matures. The same 12 by 10 bed contains 111 Ancient Fruit with four Iridium Sprinklers.",
    "Five mango trees and four banana trees are mixed with Ancient Fruit and Iridium Sprinklers.",
  ),
  createGreenhouseTreeLayoutCase(
    "05-stardew-greenhouse-tree-layout-planting-order",
    "An Eighteen Tree Banana and Mango Mix",
    "Here, 14 banana trees and four mango trees form an 18-tree greenhouse ring. This stardew greenhouse tree layout pairs them with 119 Ancient Fruit and six Iridium Sprinklers. The project shows the final placement pattern rather than a required sapling planting order.",
    "A ring of banana and mango trees surrounds a dense Ancient Fruit and sprinkler arrangement.",
  ),
  createGreenhouseTreeLayoutCase(
    "06-stardew-greenhouse-tree-layout-spring",
    "Twelve Trees with Melon and Cranberry Rows",
    "The outer lanes hold 12 fruit trees, two of each of six standard varieties. This stardew greenhouse tree layout pairs 58 melons with 58 cranberries and six Iridium Sprinklers. Its saved map season is summer; crops grown indoors are not restricted by the outdoor season.",
    "Twelve fruit trees frame melon and cranberry crop rows with six Iridium Sprinklers.",
  ),
  createGreenhouseTreeLayoutCase(
    "07-fruit-tree-layout-greenhouse-stardew-fall",
    "An Eighteen Tree Mix with Fall Crops",
    "On the fall map, 14 trees span cherry, apricot, orange, peach, apple, and pomegranate; two bananas and two mangoes complete the 18. This stardew greenhouse tree layout also has 57 cranberries, 57 eggplants, and six Iridium Sprinklers. The saved fall season matches the crop pairing in the planner project.",
    "Eighteen mixed fruit trees frame cranberries, eggplants, and six Iridium Sprinklers.",
  ),
];

const greenhouseTreeLayoutCoverZhCn = createGreenhouseTreeLayoutCover(
  "温室地图中的果树环绕中央作物区与洒水器田块。",
  "本专题封面预览；六张编号案例图各有对应的规划器项目。",
);

const greenhouseTreeLayoutCasesZhCn: readonly GreenhouseTreeLayoutCase[] = [
  createGreenhouseTreeLayoutCase(
    "02-fruit-tree-layout-greenhouse-stardew",
    "六种果树环绕温室作物田",
    "温室地图上的完整树环共有 18 棵果树：樱桃、杏子、橙子、桃子、石榴和苹果各 3 棵。这套星露谷物语温室果树布局在中央 12×10 种植区安排了 116 株杨桃、12 个优质洒水器和 4 个铱制洒水器。打开项目即可查看树环、作物和洒水器的排布。",
    "六种果树环绕温室作物田与洒水器。",
  ),
  createGreenhouseTreeLayoutCase(
    "03-stardew-greenhouse-tree-layout-seasonal",
    "保留温室入口的十四棵果树",
    "案例 03 为南侧入口留出一整排空位，其余边缘摆放 14 棵果树。对应的星露谷物语温室果树布局还包括 116 株蓝莓、12 个优质洒水器和 4 个铱制洒水器。与完整树环对照，可以看到树木数量减少后入口附近多出的空间。",
    "十四棵果树沿温室其他边缘摆放，南侧入口保持空闲。",
  ),
  createGreenhouseTreeLayoutCase(
    "04-stardew-greenhouse-tree-layout-mature-ring",
    "香蕉树与芒果树混种上古水果田",
    "主要种植区摆有 9 棵热带果树，其中 5 棵芒果树、4 棵香蕉树。按成熟果树来理解这套星露谷物语温室果树布局；幼树生长期间，周围 3×3 格需要保持空旷。同一块 12×10 种植区还有 111 株上古水果和 4 个铱制洒水器。",
    "五棵芒果树和四棵香蕉树与上古水果、铱制洒水器混合排布。",
  ),
  createGreenhouseTreeLayoutCase(
    "05-stardew-greenhouse-tree-layout-planting-order",
    "十八棵香蕉树与芒果树环绕种植",
    "14 棵香蕉树与 4 棵芒果树组成 18 棵树的环形排布。这套星露谷物语温室果树布局还搭配 119 株上古水果和 6 个铱制洒水器。项目展示完成后的摆放方式，不代表树苗种植的先后顺序。",
    "香蕉树与芒果树围绕上古水果和六个铱制洒水器排成一圈。",
  ),
  createGreenhouseTreeLayoutCase(
    "06-stardew-greenhouse-tree-layout-spring",
    "十二棵果树搭配甜瓜与蔓越莓",
    "外围通道摆放 12 棵果树，六种常见品种各两棵。对应的星露谷物语温室果树布局以 58 株甜瓜、58 株蔓越莓和 6 个铱制洒水器填充种植区。项目保存的地图季节是夏季；温室作物不受室外季节限制。",
    "十二棵果树环绕甜瓜、蔓越莓和六个铱制洒水器。",
  ),
  createGreenhouseTreeLayoutCase(
    "07-fruit-tree-layout-greenhouse-stardew-fall",
    "十八棵果树搭配秋季作物",
    "秋季地图中的案例 07 有 18 棵果树：樱桃、杏子、橙子、桃子、苹果和石榴共 14 棵，另有 2 棵香蕉树和 2 棵芒果树。这套星露谷物语温室果树布局还种有 57 株蔓越莓、57 株茄子，并摆放 6 个铱制洒水器。保存的地图季节为秋季，与作物组合一致。",
    "十八棵混合果树环绕蔓越莓、茄子和六个铱制洒水器。",
  ),
];

const greenhouseTreeLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, GreenhouseTreeLayoutPageCopy>
> = {
  en: {
    title: "Stardew Greenhouse Tree Layout Ideas",
    metaTitle: "Stardew Greenhouse Tree Layout: 6 Fruit Tree Plans",
    description:
      "Compare six greenhouse fruit tree plans with 9 to 18 trees, crop combinations, and sprinkler placements in Stardew Valley.",
    intro:
      "Compare six stardew greenhouse tree layout examples built on the actual Greenhouse map. Each plan balances tree count, crop space, and room near the south entrance differently. Open the matching projects to inspect the tree varieties, crop mixes, and saved seasons for each stardew greenhouse tree layout.",
    categoryLabel: "Greenhouse Layouts",
    browseLabel: "Browse the six plans",
    openPlannerLabel: "Open the planner",
    casesHeading: "Six Stardew Greenhouse Tree Layout Examples",
    casesDescription:
      "Each stardew greenhouse tree layout below is based on a planner project with a Greenhouse.tmx map. Compare the tree counts, crops, and sprinkler arrangements, then open the matching JSON project to inspect tile placements.",
    ctaHeading: "Plan a Stardew Greenhouse Tree Layout",
    ctaDescription:
      "Choose a stardew greenhouse tree layout, download its project, and adjust the trees, crops, and sprinklers in the planner to suit your greenhouse routine. A stardew greenhouse tree layout is easier to adapt when you can inspect its saved tile placements.",
    ctaButtonLabel: "Plan your greenhouse",
    whatIsHeading: "What Is a Stardew Greenhouse Tree Layout?",
    whatIsParagraphs: [
      "A stardew greenhouse tree layout shows how fruit trees, crops, and sprinklers can share the Greenhouse map. Its indoor crop plot measures 12 by 10 tiles, while fruit trees can also grow around the outer border. Fruit trees planted inside the greenhouse can produce fruit throughout the year, and crops there are not limited to the outdoor season.",
      "Keep growth stage in mind when using a stardew greenhouse tree layout: an immature fruit tree needs a clear 3 by 3 area while it grows. Once the tree is fully grown, the surrounding tiles no longer have to stay clear. A project that combines mature trees and crops is a placement reference; establish young trees before filling their neighboring spaces.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to Use a Stardew Greenhouse Tree Layout",
    howToSteps: [
      {
        number: "01",
        title: "Compare the arrangements",
        body: "Choose a stardew greenhouse tree layout by tree count, crop mix, or the space left by the entrance.",
      },
      {
        number: "02",
        title: "Download and import",
        body: "Download the case JSON, open the planner, and choose Library → Import JSON.",
      },
      {
        number: "03",
        title: "Adapt the planting",
        body: "Use the project to place the trees first, allow saplings to mature, then adapt nearby crops and sprinklers to your plan.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Greenhouse Tree Layout Questions",
    faqDescription:
      "Find out what the six projects contain, how fruit tree growth space works, and what happens when you import a planner file.",
    faqs: [
      {
        question: "What is included in this stardew greenhouse tree layout collection?",
        answer:
          "There is one cover image and six case images. Each case has a downloadable JSON planner project; the cover is only a preview and has no project file.",
      },
      {
        question: "How many fruit trees do the six projects show?",
        answer:
          "The examples show 18 trees in cases 02, 05, and 07; 14 in case 03; 12 in case 06; and nine in case 04. A stardew greenhouse tree layout here is a comparison example, not a claim that one tree count is best for every player.",
      },
      {
        question: "Do fruit trees need open space while growing?",
        answer:
          "Yes. Keep the 3 by 3 area around an immature fruit tree clear of placed objects, flooring, and terrain features while it grows. After the tree is fully grown, neighboring tiles can be used. In a stardew greenhouse tree layout with crops beside trees, establish the trees before filling the nearby crop spaces.",
      },
      {
        question: "Can greenhouse fruit trees and crops grow in every season?",
        answer:
          "Fruit trees inside the greenhouse can produce fruit year-round, and greenhouse crops ignore normal outdoor season limits. The saved season shown in each planner project describes that project map; it does not restrict in-game greenhouse planting.",
      },
      {
        question: "Does importing a greenhouse tree layout change my game save?",
        answer:
          "No. The JSON file is a planner project. Import it into the planner to inspect or edit the arrangement; it does not modify a Stardew Valley save file.",
      },
    ],
    cover: greenhouseTreeLayoutCoverEn,
    cases: greenhouseTreeLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语温室果树布局方案",
    metaTitle: "星露谷物语温室果树布局：六种果树排法",
    description:
      "对比六套温室果树方案，查看 9 至 18 棵果树、作物组合和洒水器在温室地图中的摆放。",
    intro:
      "本页整理了六套星露谷物语温室果树布局示例，均使用真实的温室地图。各方案对树木数量、作物空间和南侧入口的取舍不同。打开对应项目，可查看每套星露谷物语温室果树布局的树种、作物组合和保存季节。",
    categoryLabel: "温室布局",
    browseLabel: "浏览六种方案",
    openPlannerLabel: "打开规划器",
    casesHeading: "六套星露谷物语温室果树布局案例",
    casesDescription:
      "下面每套星露谷物语温室果树布局都来自使用 Greenhouse.tmx 地图的规划器项目。对比树木数量、作物组合和洒水器排法，再打开对应 JSON 项目查看具体格子位置。",
    ctaHeading: "规划一套星露谷物语温室果树布局",
    ctaDescription:
      "选择一套星露谷物语温室果树布局，下载项目后在规划器中调整果树、作物和洒水器，适配自己的温室动线。查看已保存的格子摆放后，修改这套星露谷物语温室果树布局会更直观。",
    ctaButtonLabel: "规划温室布局",
    whatIsHeading: "什么是星露谷物语温室果树布局？",
    whatIsParagraphs: [
      "星露谷物语温室果树布局展示果树、作物与洒水器如何共同使用温室地图。室内可耕地是 12×10 格，果树也能种在外围区域。种在温室里的果树可以全年结果，室内作物也不受室外季节限制。",
      "参考星露谷物语温室果树布局时，要留意果树的生长阶段：幼树生长期间，周围 3×3 格需要保持空旷；完全成熟后，附近格子不必继续留空。若项目把成熟树和作物放在一起，应先让幼树长成，再使用相邻空间种植。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个项目",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语温室果树布局",
    howToSteps: [
      {
        number: "01",
        title: "对比摆放方式",
        body: "按果树数量、作物组合或入口留白，选择一套星露谷物语温室果树布局。",
      },
      {
        number: "02",
        title: "下载并导入",
        body: "下载案例对应的 JSON 文件，打开规划器并选择本地项目 → 导入 JSON。",
      },
      {
        number: "03",
        title: "调整种植安排",
        body: "先放置果树并等待幼树成熟，再根据自己的计划安排附近作物和洒水器。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语温室果树布局常见问题",
    faqDescription:
      "了解六份项目的内容、果树生长空间规则，以及导入规划器文件后的用途。",
    faqs: [
      {
        question: "这组星露谷物语温室果树布局包含什么？",
        answer:
          "页面有一张封面图和六张案例图。每个案例都提供可下载的 JSON 规划器项目；封面只作预览，没有单独的项目文件。",
      },
      {
        question: "六个项目分别有多少棵果树？",
        answer:
          "案例 02、05、07 各有 18 棵，案例 03 有 14 棵，案例 06 有 12 棵，案例 04 有 9 棵。这里的星露谷物语温室果树布局是供比较的案例，不表示某个树木数量适合所有玩家。",
      },
      {
        question: "果树生长期间需要留出空地吗？",
        answer:
          "需要。幼树生长时，周围 3×3 格要避开放置物品、地板和地形障碍；完全成熟后，附近格子可以使用。若星露谷物语温室果树布局中果树旁边还有作物，应先种树并等它成熟，再填充相邻种植格。",
      },
      {
        question: "温室里的果树和作物可以全年生长吗？",
        answer:
          "温室里的果树可以全年结果，温室作物也不受室外季节限制。每份规划器项目保存的季节只描述地图状态，不会限制游戏内温室的种植季节。",
      },
      {
        question: "导入温室果树布局会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目，导入后可以查看或编辑排布，不会修改星露谷物语的游戏存档。",
      },
    ],
    cover: greenhouseTreeLayoutCoverZhCn,
    cases: greenhouseTreeLayoutCasesZhCn,
  },
};

export function getGreenhouseTreeLayoutPageCopy(
  locale: PublicLocale,
): GreenhouseTreeLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported Greenhouse Tree Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return greenhouseTreeLayoutPageCopyByLocale[locale];
}
