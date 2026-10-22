import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const fruitTreeLayoutCanonicalPath =
  "/stardew-valley-fruit-tree-layout" as const;

export type FruitTreeLayoutCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type FruitTreeLayoutCase = Readonly<{
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

export type FruitTreeLayoutPageCopy = Readonly<{
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
  cover: FruitTreeLayoutCover;
  cases: readonly FruitTreeLayoutCase[];
}>;

const fruitTreeLayoutPreviewWidth = 1600;
const fruitTreeLayoutPreviewHeight = 1300;
const fruitTreeLayoutImageDirectory = "/farm-layouts/fruit-tree/images";
const fruitTreeLayoutProjectDirectory = "/farm-layouts/fruit-tree/projects";
const fruitTreeLayoutCoverStem = "01-greenhouse-18-optimal-wiki";

function fruitTreeLayoutImagePath(stem: string, extension: string): string {
  return `${fruitTreeLayoutImageDirectory}/${stem}.${extension}`;
}

function fruitTreeLayoutProjectPath(stem: string): string {
  return `${fruitTreeLayoutProjectDirectory}/${stem}.json`;
}

function createFruitTreeLayoutCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): FruitTreeLayoutCase {
  return {
    id: stem,
    title,
    summary,
    imageSrc: fruitTreeLayoutImagePath(stem, "webp"),
    imageOriginalSrc: fruitTreeLayoutImagePath(stem, "jpg"),
    imageAlt,
    imageWidth: fruitTreeLayoutPreviewWidth,
    imageHeight: fruitTreeLayoutPreviewHeight,
    projectHref: fruitTreeLayoutProjectPath(stem),
  };
}

function createFruitTreeLayoutCover(
  imageAlt: string,
  caption: string,
): FruitTreeLayoutCover {
  return {
    imageSrc: fruitTreeLayoutImagePath(fruitTreeLayoutCoverStem, "webp"),
    imageOriginalSrc: fruitTreeLayoutImagePath(fruitTreeLayoutCoverStem, "jpg"),
    imageAlt,
    imageWidth: fruitTreeLayoutPreviewWidth,
    imageHeight: fruitTreeLayoutPreviewHeight,
    caption,
  };
}

const fruitTreeLayoutCasesEn: readonly FruitTreeLayoutCase[] = [
  createFruitTreeLayoutCase(
    "01-greenhouse-18-optimal-wiki",
    "18-Tree Greenhouse Reference",
    "This 18-tree greenhouse mock-up surrounds a 12×10 crop bed with six Iridium Sprinklers on Standard Farm ground. Before planting, adjust spacing and clear paths or flooring from each 3×3 growth area.",
    "Standard Farm mock-up of a greenhouse ring with 18 fruit trees around a central crop bed.",
  ),
  createFruitTreeLayoutCase(
    "02-outdoor-orchard-3x3-grid",
    "Outdoor Orchard Grid",
    "Sixty-four Cherry, Apricot, Orange, Peach, Pomegranate, and Apple trees fill a regular outdoor grid. This fruit tree layout Stardew Valley players can edit leaves the planting spaces open in the saved project.",
    "Standard Farm orchard with 64 fruit trees arranged in a regular grid and paths around the outside.",
  ),
  createFruitTreeLayoutCase(
    "03-greenhouse-two-of-each",
    "Greenhouse Tree Mix Reference",
    "This 18-tree greenhouse mock-up mixes six classic fruit types on Standard Farm ground, not indoors. Before planting, adjust spacing and clear paths or flooring from each 3×3 growth area.",
    "Standard Farm mock-up of an 18-tree greenhouse reference with a mixed ring of classic fruit trees.",
  ),
  createFruitTreeLayoutCase(
    "04-outdoor-seasonal-fruit-rows",
    "Seasonal Orchard Rows",
    "Sixty-three outdoor trees form three seasonal bands, with paths beside some trunks. Plant first; add nearby paths or flooring after trees mature. This fruit tree layout Stardew Valley project is easy to adapt.",
    "Standard Farm orchard with 63 fruit trees arranged in three seasonal rows separated by paths.",
  ),
  createFruitTreeLayoutCase(
    "05-mature-orchard-path-packed",
    "Mature Orchard with Paths",
    "Fifty-six fruit trees sit in a dense orchard with flooring between trunks. The project illustrates a finished orchard; keep the growing area clear while saplings are still developing.",
    "Standard Farm view of 56 fruit trees in a mature orchard with flooring packed between the trees.",
  ),
  createFruitTreeLayoutCase(
    "06-orchard-beehive-gaps",
    "Orchard with Bee House Gaps",
    "After 36 fruit trees mature, place 74 Bee Houses in the gaps and flowers nearby. This fruit tree layout Stardew Valley project combines an orchard and Bee House setup outdoors.",
    "Standard Farm orchard with 36 fruit trees, Bee Houses in the gaps, and nearby flower crops.",
  ),
  createFruitTreeLayoutCase(
    "07-farmhouse-adjacent-fruit-border",
    "Fruit Tree Border beside the Farmhouse",
    "Thirty-three fruit trees border the Farmhouse, with paths beside some trunks. Plant first; add nearby paths or flooring only after they mature. This fruit tree layout Stardew Valley example fits a compact yard.",
    "Standard Farm with a border of 33 fruit trees beside the Farmhouse and paths through the yard.",
  ),
];

const fruitTreeLayoutCasesZhCn: readonly FruitTreeLayoutCase[] = [
  createFruitTreeLayoutCase(
    "01-greenhouse-18-optimal-wiki",
    "18 棵果树温室参考示意",
    "这套 18 棵果树温室示意图在中央 12×10 作物床周围安排了 6 个铱金洒水器，画在标准农场空地上，不是室内地图。种植前需调整树距，并清除树苗 3×3 生长区内的路径和地板。",
    "标准农场空地上的温室参考示意，18 棵果树围绕中央作物床排列。",
  ),
  createFruitTreeLayoutCase(
    "02-outdoor-orchard-3x3-grid",
    "户外果园网格",
    "64 棵樱桃、杏、橙、桃、石榴和苹果树排成规则网格。项目保留了幼树周围的空位，可按自己的农场继续调整。",
    "标准农场上的 64 棵果树按规则网格排列，外侧设有路径。",
  ),
  createFruitTreeLayoutCase(
    "03-greenhouse-two-of-each",
    "温室果树混合参考示意",
    "第二套 18 棵果树温室示意图混合了六种经典果树，画在标准农场空地上，不是室内地图。种植前需调整树距，并清除树苗 3×3 生长区内的路径和地板。",
    "标准农场空地上的 18 棵果树温室参考示意，环绕中央作物床混合排列。",
  ),
  createFruitTreeLayoutCase(
    "04-outdoor-seasonal-fruit-rows",
    "按收获季节分排",
    "63 棵户外果树分成三个季节区域，部分树干旁已有路径。先种树，等果树成熟后再铺近邻路径或地板。",
    "标准农场上的 63 棵果树分成三条季节行列，中间有路径。",
  ),
  createFruitTreeLayoutCase(
    "05-mature-orchard-path-packed",
    "成熟果园与铺路",
    "56 棵果树组成紧凑果园，树干之间铺有地板。项目展示的是成熟后的果园状态；树苗生长期间，要让周围空间保持空旷。",
    "标准农场上的成熟果园有 56 棵果树，树木之间铺满地板。",
  ),
  createFruitTreeLayoutCase(
    "06-orchard-beehive-gaps",
    "果园与蜂房空隙",
    "36 棵果树成熟后，再把 74 个蜂房放入树间空隙，并在附近安排花朵。",
    "标准农场上的果园有 36 棵果树，空隙中放有蜂房，附近种着花朵作物。",
  ),
  createFruitTreeLayoutCase(
    "07-farmhouse-adjacent-fruit-border",
    "农舍旁的果树边框",
    "33 棵果树沿农舍排成边框，部分树干旁已有路径。先种树，等果树成熟后再铺近邻路径或地板。",
    "标准农场上有 33 棵果树沿农舍附近排列成边框，并以路径连接。",
  ),
];

const fruitTreeLayoutPageCopyByLocale: Readonly<
  Record<PublicLocale, FruitTreeLayoutPageCopy>
> = {
  en: {
    title: "A Fruit Tree Layout Stardew Valley Players Can Adapt",
    metaTitle: "Fruit Tree Layout Stardew Valley: 7 Orchard Plans",
    description:
      "Compare seven Stardew Valley fruit tree plans: an 18-tree greenhouse reference, outdoor orchard spacing, seasonal rows, a mature paved orchard, and Bee House or Farmhouse examples.",
    intro:
      "Choose a fruit tree layout Stardew Valley players can edit from seven Standard Farm plans: a greenhouse reference, outdoor rows, a mature orchard, and a farmhouse border.",
    categoryLabel: "Planting Layouts",
    browseLabel: "Browse all seven layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Seven fruit tree layout Stardew Valley plans",
    casesDescription:
      "All seven plans use the Standard Farm. Compare tree mixes, paths, and open space, then download a project to edit.",
    ctaHeading: "Make a fruit tree layout Stardew Valley plan your own",
    ctaDescription:
      "Download the editable project and choose Library → Import JSON in the planner. Each file opens on Standard Farm and does not modify a game save.",
    ctaButtonLabel: "Start planning",
    whatIsHeading: "Choosing a fruit tree layout Stardew Valley plan",
    whatIsParagraphs: [
      "A fruit tree layout Stardew Valley plan can show a greenhouse reference, mixed orchard, seasonal rows, or mature paths. Compare the seven editable Standard Farm projects, then adjust tree positions for your farm.",
      "Keep a clear 3×3 area around each sapling while it grows; add paths and objects after it matures. Case 7 sits beside the Farmhouse, a permanent-building exception. Both greenhouse mock-ups use Standard Farm ground.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to adapt a fruit tree layout Stardew Valley project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Compare the seven fruit tree layout Stardew Valley projects and download the one that fits your farm idea.",
      },
      {
        number: "02",
        title: "Import the project",
        body: "Open the planner, choose Library → Import JSON, and select the file you downloaded.",
      },
      {
        number: "03",
        title: "Adjust the orchard",
        body: "Move trees, flooring, flowers, or Bee Houses to make the fruit tree layout Stardew Valley plan fit your own map.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Fruit tree layout Stardew Valley questions",
    faqDescription:
      "Answers on maps, greenhouse mock-ups, tree spacing, and importing projects.",
    faqs: [
      {
        question: "Which map do these fruit tree layout Stardew Valley projects use?",
        answer:
          "All seven files use Standard Farm, Farm.tmx. The two greenhouse mock-ups are shown on farm ground; adjust their tree positions before planting.",
      },
      {
        question: "How much space do fruit tree saplings need?",
        answer:
          "A sapling needs a clear 3×3 ground area while it grows, and that area cannot overlap another fruit tree's growing area. Paths can be placed beside a tree after it matures.",
      },
      {
        question: "Does the Bee House example work inside the Greenhouse?",
        answer:
          "The Bee House layout is an outdoor Standard Farm project. Bee Houses inside the Greenhouse do not produce honey, even when flowers are nearby.",
      },
      {
        question: "Can a fruit tree grow beside the Farmhouse?",
        answer:
          "The Farmhouse is a permanent-building exception to the usual clear 3×3 space. Case 7 shows a fruit border beside the house; other objects still need to stay clear while a sapling grows.",
      },
      {
        question: "Will importing a fruit tree layout Stardew Valley project change my save?",
        answer:
          "No. The JSON file opens as an editable planner project and does not change a Stardew Valley game save.",
      },
    ],
    cover: createFruitTreeLayoutCover(
      "Standard Farm mock-up of a greenhouse reference with 18 fruit trees around a central crop bed.",
      "Greenhouse visual reference on Standard Farm ground, not indoors. Before planting, adjust spacing and clear paths or flooring from each 3×3 growth area.",
    ),
    cases: fruitTreeLayoutCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语果树布局：7 套规划方案",
    metaTitle: "星露谷物语果树布局：7 套果园规划",
    description:
      "浏览 7 套星露谷物语果树项目：18 棵树的温室参考示意、户外果园间距、季节行列、成熟后铺路，以及蜂房和农舍布局。",
    intro:
      "从 7 套标准农场项目中挑选果树方案。页面以温室参考示意开场，后面依次展示户外果园、成熟果园和农舍边框，可下载项目继续编辑。",
    categoryLabel: "种植布局",
    browseLabel: "浏览全部 7 套布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "7 套星露谷物语果树布局",
    casesDescription:
      "7 个项目都使用标准农场地图。可比较果树组合、空位、路径和其他摆放，再下载项目到规划器里调整。",
    ctaHeading: "在规划器中继续编辑果树布局",
    ctaDescription:
      "下载项目后，在规划器中选择本地项目 → 导入 JSON。每个文件都是可编辑的标准农场项目，不是游戏存档。两套温室参考图都画在农场空地上。",
    ctaButtonLabel: "开始规划",
    whatIsHeading: "怎样挑选星露谷物语果树布局",
    whatIsParagraphs: [
      "果树方案可以展示温室参考、户外混种果园、季节行列或成熟后铺路。这组内容提供 7 个可编辑的标准农场项目，你可以先比较树木位置，再按自己的农场改动。",
      "果树树苗生长时需要留出空旷的 3×3 地面；成熟后，旁边可以铺路或摆放物品。农舍布局对应永久建筑例外。两套温室参考图都在标准农场空地上。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个项目",
    howToEyebrow: "使用说明",
    howToHeading: "如何导入和调整果树布局",
    howToSteps: [
      {
        number: "01",
        title: "选择方案",
        body: "浏览 7 套果树项目，下载符合你农场构想的那一套。",
      },
      {
        number: "02",
        title: "导入项目",
        body: "打开规划器，选择本地项目 → 导入 JSON，再选中下载的文件。",
      },
      {
        number: "03",
        title: "调整果园",
        body: "移动果树、地板、花朵或蜂房，让果树布局适合自己的农场地图。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "关于果树布局的问题",
    faqDescription:
      "了解标准农场项目、温室参考示意、树苗生长空间和项目导入方法。",
    faqs: [
      {
        question: "这些果树项目使用哪张地图？",
        answer:
          "7 个项目都使用标准农场地图 Farm.tmx。两套温室参考示意画在农场空地上，不是温室室内地图；树位需调整间距后再种植。",
      },
      {
        question: "果树树苗生长时需要留多少空间？",
        answer:
          "树苗生长期间，周围 3×3 地面需要保持空旷，并且不能与另一棵果树的生长区域重叠。果树成熟后，旁边可以铺设路径。",
      },
      {
        question: "蜂房方案可以放进温室吗？",
        answer:
          "这套蜂房布局是户外标准农场项目。温室室内的蜂房不会产蜜，即使附近有花朵也一样。",
      },
      {
        question: "果树可以种在农舍旁边吗？",
        answer:
          "农舍属于永久建筑，不受通常的 3×3 空地规则限制。第 7 例展示了靠近农舍的果树边框；树苗生长时，其他物品仍需避开生长区域。",
      },
      {
        question: "导入果树布局会修改游戏存档吗？",
        answer:
          "不会。JSON 文件会作为可编辑的规划器项目打开，不会修改星露谷物语游戏存档。",
      },
    ],
    cover: createFruitTreeLayoutCover(
      "标准农场空地上的温室参考示意，18 棵果树围绕中央作物床排列。",
      "标准农场空地上的温室参考示意，并非室内图。种植前需调整树距，并清除树苗 3×3 生长区内的路径和地板。",
    ),
    cases: fruitTreeLayoutCasesZhCn,
  },
};

export function getFruitTreeLayoutPageCopy(
  locale: PublicLocale,
): FruitTreeLayoutPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new TypeError(
      `Unsupported Fruit Tree Layout page locale: ${JSON.stringify(locale)}.`,
    );
  }

  return fruitTreeLayoutPageCopyByLocale[locale];
}
