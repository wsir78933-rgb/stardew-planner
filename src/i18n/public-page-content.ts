import {
  getModFarmCards,
  type ModFarmCard,
} from "../reference/mod-farm-cards";
import {
  getOfficialFarmGuide,
  type OfficialFarmGuide,
  type OfficialFarmType,
} from "../reference/official-farm-guides";
import {
  publicNavigation,
  type PublicNavigationPath,
} from "../reference/public-navigation";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";
import { publicLocales, type PublicLocale } from "./public-locale";

type LocalizedOfficialFarmGuideText = Pick<
  OfficialFarmGuide,
  "title" | "introduction" | "bestFor" | "features" | "note"
>;

type LocalizedModFarmCardText = Pick<
  ModFarmCard,
  "displayName" | "description"
>;

export type PublicPageCopy = Readonly<{
  footer: SiteFooterCopy;
  navigationLabel: string;
  navigation: readonly Readonly<{ label: string; path: PublicNavigationPath }>[];
  brandLabel: string;
  counterpartLabel: string;
  plannerTitle: string;
  plannerDescription: string;
  plannerIntroduction: string;
  planFarmLabel: string;
  planFarmTemplate: string;
  farmComparisonTitle: string;
  farmComparisonDescription: string;
  farmGuideTitleTemplate: string;
  farmGuideDescriptionTemplate: string;
  modsTitle: string;
  modsDescription: string;
  quickComparisonLabel: string;
  farmDetailsLabel: string;
  tillableTilesLabel: string;
  totalBuildableLabel: string;
  addedInLabel: string;
  knownForLabel: string;
  bestForLabel: string;
  noteLabel: string;
  previewTemplate: string;
  planThisFarmLabel: string;
  availableCommunityFarmsLabel: string;
  byTemplate: string;
  breadcrumbLabel: string;
  farmTypesLabel: string;
  compareAllFarmsLabel: string;
  whatMakesItDifferentLabel: string;
  otherFarmsLabel: string;
  comparisonPrompt: string;
  fullComparisonLabel: string;
  comparisonSentenceEnding: string;
}>;

const chineseOfficialFarmGuideTexts: Readonly<
  Record<OfficialFarmType, LocalizedOfficialFarmGuideText>
> = {
  standard: {
    title: "标准农场",
    introduction:
      "这是《星露谷物语》最初的农场，也是至今能提供最多可耕种格数的农场。没有独特机制或特殊生成物，只有充足空间。想规划高收益作物布局且不想受条件限制时，就选这张地图。",
    bestFor: "最高的纯作物产出，以及完整的布局自由度。",
    features: [
      "拥有所有农场中最大的连续可耕地矩形：63 × 31 格",
      "没有独特机制或免费开局物品；唯一例外是每个农场开局都会获得的 15 颗防风草种子",
    ],
  },
  riverland: {
    title: "河流农场",
    introduction:
      "这是一座以河流为中心的农场，拥有岛屿、桥梁和农场内钓鱼。它用作物空间换来了围绕水域设计的布局。",
    bestFor: "钓鱼玩法。无需离家就能钓到鹈鹕镇鱼池中的大多数鱼类。",
    features: [
      "河流占据了南半部的大部分区域",
      "农场内钓鱼：70% 为小镇河流鱼，30% 为煤矿森林鱼",
      "这里会随机出现气泡点，其他农场不会出现",
      "有 6 丛灌木可用铜斧或更高级斧头砍除",
      "1.6：开局自带一台熏鱼机",
    ],
  },
  forest: {
    title: "森林农场",
    introduction:
      "这座林地农场能稳定产出硬木和每日季节采集物。西侧空地用大面积作物田换来了可靠的资源。",
    bestFor: "硬木和采集的被动收入；很适合采集者职业。",
    features: [
      "西侧空地有 8 个大树桩（硬木），每天可再生",
      "季节采集物每天重新生成（每季 4 种物品，概率相同）",
      "独特杂草必定掉落混合种子",
      "钓鱼：5% 几率钓到木跃鱼（另受每日幸运影响），45% 为煤矿森林鱼，其余为垃圾",
      "有 16 丛灌木可用铜斧或更高级斧头砍除",
    ],
  },
  hilltop: {
    title: "山顶农场",
    introduction:
      "这座分层农场被悬崖和水道切开，西南角有一座小采石场。平台之间的路线和可放置空间同样重要。",
    bestFor: "偏采矿的玩法。从第一天起就能稳定获得少量石头和矿石。",
    features: [
      "西南角的小采石场会生成石头、矿石和晶洞节点",
      "清空后的采石场每天约生成 2.4 个节点，另有 15% 概率出现古物斑点",
      "晶洞类型与采矿等级相关：5 级以下只有晶洞；5 至 7 级为晶洞或冰封晶洞；8 级及以上可出现任意晶洞",
      "采矿等级达到 4 级后会解锁铁矿节点",
      "悬崖把农场分成多层区域",
    ],
  },
  wilderness: {
    title: "荒野农场",
    introduction:
      "这是一张夜晚会出现怪物的宽阔地图。它是偏战斗的选择，拥有中央池塘和分开的种植区域。",
    bestFor: "战斗型种田。它是唯一会生成铱魔像的农场，也是游戏中获得活帽的最佳地点。",
    features: [
      "夜晚会生成怪物，种类和数量随你的战斗等级提升",
      "荒野魔像是农场原生的唯一活帽来源（每次击杀有万分之一概率）",
      "战斗等级达到 9 级后会生成铱魔像，生成概率 50%，掉落铱矿石和种子点种子（1.6+）",
      "农场内钓鱼：35% 为山区湖泊鱼，65% 为垃圾",
      "1.6：农场内战斗经验降为正常值的三分之一",
    ],
    note:
      "天黑后怪物会在农场出现。它们不会伤害作物、建筑或动物；只有玩家会面临风险。",
  },
  "four-corners": {
    title: "四角农场",
    introduction:
      "四个相连的农场区域把熟悉的地形风格组合到一张地图中。它为多人合作设计，也适合把单人布局划分为不同功能区。",
    bestFor: "多人合作。单人玩家也能在一张地图里体验每种农场的特色。",
    features: [
      "四个象限分别致敬不同农场：",
      "左上：森林风格，有大树桩和混合种子杂草",
      "右上：标准农场风格，拥有最大的作物区域",
      "左下：池塘有 50% 概率出现煤矿森林池塘鱼",
      "右下：山顶农场的小采石场，有石头、矿石和晶洞",
      "为多人游戏设计，每位玩家可使用一个象限",
    ],
  },
  beach: {
    title: "海滩农场",
    introduction:
      "这座大型沿海农场可以海钓、采集，并有宽阔的沙地建造空间。它的土壤让洒水器规划成为核心限制。",
    bestFor: "钓鱼、采集、海景建造和畜牧布局。",
    features: [
      "南岸海钓：53% 为海鱼，15% 为海藻，5% 为随机贝壳物品（牡蛎、珊瑚、贻贝、鸟蛤），27% 为垃圾",
      "补给箱偶尔会被海浪冲到海滩上",
      "森林和海滩采集物都会生成；海滩采集物任何季节都可能出现",
      "草会在沙地上生长，动物可在任何地方吃草",
      "有 15 丛灌木可用铜斧或更高级斧头砍除",
    ],
    note:
      "洒水器不能在沙地上工作。整座农场只有约 230 格不是沙地：一块 10 × 20 的地块，以及池塘附近约 28 格零散土地。请围绕这些区域规划作物，或专注于不受沙地影响的动物和建筑。",
  },
  meadowlands: {
    title: "草原农场",
    introduction:
      "这是一座以畜牧为导向的农场，开局就有鸡舍、鸡和蓝草。它有充足的建造空间，同时保留了适合动物布局的地面。",
    bestFor: "畜牧。蓝草能免去冬季抢购干草的烦恼。",
    features: [
      "开局自带一座鸡舍和 2 只随机命名的鸡",
      "刘易斯镇长会给你 15 份干草，而不是通常的 15 颗防风草种子",
      "蓝草全年都会重新生长（包括冬季），动物非常喜欢它",
      "它拥有所有农场中最多的不可耕种但可建造空间",
      "农场内钓鱼：40% 为煤矿森林池塘鱼，60% 为垃圾",
    ],
  },
};

const chineseModFarmCardTexts: Readonly<
  Record<string, LocalizedModFarmCardText>
> = {
  if2r: { displayName: "沉浸式农场 2", description: "一大片为多人游戏优化的土地，也适合想挑战自己的单人玩家。这里有可耕种的草地、任务和许多秘密。" },
  frontier: { displayName: "边境农场", description: "这是《星露谷扩展版》推荐使用的农场。它拥有毗邻弗恩群岛共和国边境的广阔土地，遍布多种野生树木，也藏着等待发现的秘密。开局时你会拥有一棵梨树。" },
  grandpas: { displayName: "爷爷的农场", description: "这是《星露谷扩展版》中朴实的一座农场。它以适中的耕地、可耕种草地、不同的地标位置、捷径和秘密，替换标准农场布局。" },
  "capitalist-dream": { displayName: "资本家之梦农场", description: "一张非常大且规划整齐的农场地图，设有专门的作物区和建筑区。" },
  "capitalist-dream-2": { displayName: "资本家之梦 2 农场", description: "一张沉浸感很强的大型农场地图，包含采石场、温泉、私人海滩等设施。" },
  "overgrown-garden": { displayName: "杂草丛生的花园农场", description: "一张可爱、杂乱、充满林地气息的小型森林农场地图。" },
  "yet-another": { displayName: "又一个农场", description: "一张宽敞的通用农场布局。" },
  "solo-four-corners": { displayName: "单人四角农场", description: "对四角农场的重新构想，同时适合单人和多人游戏。" },
  "strawberry-fields": { displayName: "草莓田农场", description: "一张开放式农场地图，拥有充足的建造空间。" },
  "blackberry-fields": { displayName: "黑莓田农场", description: "一座大型新农场，拥有采石场、采集物、硬木等资源。" },
  zenith: { displayName: "天顶农场", description: "一张坐落在高山之巅的农场地图，可俯瞰下方山谷。" },
  everfarm: { displayName: "永恒农场", description: "一张取代四角农场的巨大地图（约大 6 倍）。" },
  "sea-breeze-island": { displayName: "海风岛农场", description: "一张拥有海景的海滩与岛屿农场地图。" },
  "aimon-s-small-hilltop": { displayName: "Aimon 的小山顶农场", description: "对山顶农场更整洁的改造，提供山顶景观和多项便利性调整。" },
  "aimon-s-small-forest": { displayName: "Aimon 的小森林农场", description: "对森林农场更整洁的改造，拥有更好的鱼池、可再生硬木树桩，以及通往周边森林的捷径。" },
  "more-lively-meadowlands": { displayName: "更有活力的草原农场", description: "一座更有生气的草原农场，增加了空间、一条带桥的额外河道、池塘、水槽和码头。" },
  "modest-maps-standard": { displayName: "适度地图：标准农场", description: "对标准农场进行适度、折中的重新设计：空间充足但不过大，布局也更整洁。" },
  "waterfall-forest": { displayName: "瀑布森林农场", description: "一座围绕瀑布打造、拥有更多水域和采集资源的茂密森林风格农场。" },
  "sve-winery": { displayName: "SVE 酒庄", description: "《星露谷扩展版》的酒庄室内地图，可作为本地规划地图使用。" },
  "sve-grandpas-shed-1": { displayName: "SVE 爷爷的棚屋一层", description: "《星露谷扩展版》爷爷棚屋的一层，可作为本地规划地图使用。" },
  "sve-grandpas-shed-2": { displayName: "SVE 爷爷的棚屋二层", description: "《星露谷扩展版》爷爷棚屋的二层，可作为本地规划地图使用。" },
};

const publicPageCopy: Readonly<Record<PublicLocale, PublicPageCopy>> = {
  en: {
    footer: {
      brandName: "Stardew Valley Farm Planner",
      description:
        "A browser-local fan-made tool for planning Stardew Valley farm layouts.",
      copyright: "© Stardew Valley Farm Planner",
      planner: {
        title: "Planner",
        home: "Planner",
        farmComparison: "Farm comparison",
        moddedFarms: "Modded farms",
      },
      explore: {
        title: "Explore",
        capabilities: "How it works",
        faq: "FAQ",
      },
      legal: {
        title: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact us",
      },
    },
    navigationLabel: "Public navigation",
    navigation: publicNavigation,
    brandLabel: "Stardew Valley Farm Planner",
    counterpartLabel: "简体中文",
    plannerTitle: "Stardew Valley Farm Planner",
    plannerDescription: "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    plannerIntroduction: "The editing interface opens in English.",
    planFarmLabel: "Start planning",
    planFarmTemplate: "Plan a {farmName} →",
    farmComparisonTitle: "Stardew Valley Farm Types Compared",
    farmComparisonDescription: "Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.",
    farmGuideTitleTemplate: "{farmName} Guide | Stardew Planner",
    farmGuideDescriptionTemplate: "Explore the {farmName} map and start planning its Stardew Valley layout.",
    modsTitle: "Modded Stardew Valley Farms",
    modsDescription: "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    quickComparisonLabel: "Quick comparison",
    farmDetailsLabel: "Farm details",
    tillableTilesLabel: "Tillable tiles",
    totalBuildableLabel: "Total buildable",
    addedInLabel: "Added in",
    knownForLabel: "Known for",
    bestForLabel: "Best for:",
    noteLabel: "Note:",
    previewTemplate: "{farmName} preview",
    planThisFarmLabel: "Plan this farm →",
    availableCommunityFarmsLabel: "Available community farms",
    byTemplate: "by {authorName}",
    breadcrumbLabel: "Breadcrumb",
    farmTypesLabel: "Farm types",
    compareAllFarmsLabel: "Compare all farms",
    whatMakesItDifferentLabel: "What makes it different",
    otherFarmsLabel: "Other farms",
    comparisonPrompt: "Want them side by side? See the",
    fullComparisonLabel: "full comparison",
    comparisonSentenceEnding: ".",
  },
  "zh-CN": {
    footer: {
      brandName: "星露谷物语农场规划器",
      description: "在浏览器中本地规划《星露谷物语》农场布局的玩家工具。",
      copyright: "© 星露谷物语农场规划器",
      planner: {
        title: "规划器",
        home: "规划器",
        farmComparison: "农场对比",
        moddedFarms: "模组农场",
      },
      explore: {
        title: "探索",
        capabilities: "使用方式",
        faq: "常见问题",
      },
      legal: {
        title: "法律",
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
      },
    },
    navigationLabel: "公共导航",
    navigation: [
      { label: "规划器", path: "/" },
      { label: "农场对比", path: "/farm-comparison" },
      { label: "模组", path: "/mods" },
    ],
    brandLabel: "星露谷规划器",
    counterpartLabel: "English",
    plannerTitle: "星露谷农场规划器",
    plannerDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
    plannerIntroduction: "The editing interface opens in English.",
    planFarmLabel: "规划器",
    planFarmTemplate: "规划 {farmName} →",
    farmComparisonTitle: "星露谷农场类型对比",
    farmComparisonDescription: "在规划布局前，对比《星露谷物语》的全部官方农场地图。",
    farmGuideTitleTemplate: "{farmName} 指南 | 星露谷规划器",
    farmGuideDescriptionTemplate: "了解{farmName}地图，并开始规划你的星露谷农场布局。",
    modsTitle: "星露谷模组规划器",
    modsDescription: "规划你的星露谷模组组合。",
    quickComparisonLabel: "快速对比",
    farmDetailsLabel: "农场详情",
    tillableTilesLabel: "可耕种格数",
    totalBuildableLabel: "可建造格数",
    addedInLabel: "加入版本",
    knownForLabel: "特色",
    bestForLabel: "最适合：",
    noteLabel: "注意：",
    previewTemplate: "{farmName} 预览图",
    planThisFarmLabel: "规划此农场 →",
    availableCommunityFarmsLabel: "可用的社区农场",
    byTemplate: "作者：{authorName}",
    breadcrumbLabel: "面包屑导航",
    farmTypesLabel: "农场",
    compareAllFarmsLabel: "对比所有农场",
    whatMakesItDifferentLabel: "它有什么不同",
    otherFarmsLabel: "其他农场",
    comparisonPrompt: "想并排查看？请查看",
    fullComparisonLabel: "完整对比",
    comparisonSentenceEnding: "。",
  },
};

function assertPublicLocale(locale: unknown): asserts locale is PublicLocale {
  if (!publicLocales.includes(locale as PublicLocale)) {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }
}

export function formatPublicPageCopy(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  const formattedCopy = Object.entries(values).reduce(
    (copy, [valueName, value]) => copy.replaceAll(`{${valueName}}`, value),
    template,
  );

  if (/\{[^}]+\}/.test(formattedCopy)) {
    throw new Error(
      `Public page copy template has unresolved placeholders. Received: ${JSON.stringify(formattedCopy)}.`,
    );
  }

  return formattedCopy;
}

export function getLocalizedOfficialFarmGuide(
  locale: PublicLocale,
  farmType: OfficialFarmType,
): OfficialFarmGuide {
  assertPublicLocale(locale);

  const officialFarmGuide = getOfficialFarmGuide(farmType);

  if (!officialFarmGuide) {
    throw new Error(`Unknown official farm id. Received: ${JSON.stringify(farmType)}.`);
  }

  if (locale === "en") {
    return officialFarmGuide;
  }

  const localizedText = chineseOfficialFarmGuideTexts[officialFarmGuide.id];

  if (!localizedText) {
    throw new Error(
      `Missing Chinese public content for official farm id. Received: ${JSON.stringify(officialFarmGuide.id)}.`,
    );
  }

  return { ...officialFarmGuide, ...localizedText };
}

export function getLocalizedModFarmCards(
  locale: PublicLocale,
): readonly ModFarmCard[] {
  assertPublicLocale(locale);

  return getModFarmCards().map((modFarmCard) => {
    if (locale === "en") {
      return modFarmCard;
    }

    const localizedText = chineseModFarmCardTexts[modFarmCard.id];

    if (!localizedText) {
      throw new Error(
        `Missing Chinese public content for mod farm id. Received: ${JSON.stringify(modFarmCard.id)}.`,
      );
    }

    return { ...modFarmCard, ...localizedText };
  });
}

export function getPublicPageCopy(locale: PublicLocale): PublicPageCopy {
  assertPublicLocale(locale);
  const copy = publicPageCopy[locale];

  return copy;
}
