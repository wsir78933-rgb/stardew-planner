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
  getOfficialFarmComparisonCards,
  type OfficialFarmComparisonCard,
  type OfficialFarmComparisonText,
} from "../reference/official-farm-comparison-content";
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

type LocalizedOfficialFarmComparisonText = OfficialFarmComparisonText;

type LocalizedModFarmCardText = Pick<
  ModFarmCard,
  "displayName" | "description" | "bestFor" | "planningNote"
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
  farmComparisonMetaTitle: string;
  farmComparisonTitle: string;
  farmComparisonDescription: string;
  farmComparisonIntroduction: string;
  farmComparisonRecommendationsTitle: string;
  farmComparisonRecommendations: readonly Readonly<{
    farmType: OfficialFarmType;
    heading: string;
    description: string;
  }>[];
  farmComparisonNoUniversalBest: string;
  farmComparisonMethodTitle: string;
  farmComparisonMethodDescription: string;
  farmComparisonSourceLabel: string;
  farmComparisonCardsTitle: string;
  farmComparisonBestForLabel: string;
  farmComparisonTradeoffLabel: string;
  farmComparisonPlanningNoteLabel: string;
  farmComparisonFactsLabel: string;
  farmComparisonGuideLabel: string;
  farmGuideTitleTemplate: string;
  farmGuideDescriptionTemplate: string;
  modsMetaTitle: string;
  modsTitle: string;
  modsDescription: string;
  modsIntroduction: string;
  modsPlannerScope: string;
  modsFarmMapsTitle: string;
  modsFarmMapsDescription: string;
  modsInteriorsTitle: string;
  modsInteriorsDescription: string;
  modBestForLabel: string;
  modPlanningNoteLabel: string;
  modSourceLabel: string;
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

const chineseOfficialFarmComparisonTexts: Readonly<
  Record<OfficialFarmType, LocalizedOfficialFarmComparisonText>
> = {
  standard: {
    summary: "地图主体是一整片开阔农田，作物、畜舍、棚屋和道路都能随着农场扩张而调整。",
    bestFor: "初次游玩、大面积喷头农田，以及需要随时调整的混合型农场。",
    tradeoff: "它没有专属资源区或额外的开局机器，优势就在于空间。",
    planningNote: "先定主干道，再填中央区域。63 × 31 是最大的连续作物区，不是整张地图的可耕种总数。",
    knownFor: "可耕种空间最多",
    facts: [
      "共有 3,427 个可耕种格，是八种官方农场中最多的",
      "最大的连续可耕种矩形为 63 × 31 格",
    ],
  },
  riverland: {
    summary: "河流把农场切成小岛和紧凑地块，跨区移动大多要经过桥梁。",
    bestFor: "以钓鱼为主、不需要一整片大型作物田的水边布局。",
    tradeoff: "大片水域让作物、建筑和动物活动区变得零散。",
    planningNote: "放建筑前先确定过桥路线。岛屿入口一旦被堵住，原本很短的日常动线就会绕远。",
    knownFor: "农场内钓鱼与开局熏鱼机",
    facts: [
      "农场钓鱼时，70% 为小镇河流鱼，30% 为森林鱼",
      "这里会随机出现气泡点，其他官方农场不会",
      "1.6 版本开始，开局设备中增加了一台熏鱼机",
    ],
  },
  forest: {
    summary: "林地空地形成多个较小的工作区，而不是一整片连续农田。",
    bestFor: "稳定获取硬木、季节采集物，以及顺着自然边缘安排的紧凑布局。",
    tradeoff: "池塘、草地和固定植被把可耕种面积压缩到 1,413 格。",
    planningNote: "若要持续收集硬木和采集物，应为西侧空地保留清楚的通行路线。",
    knownFor: "可再生硬木与采集物",
    facts: [
      "西侧空地的 8 个大树桩每天都会再生",
      "西侧会出现季节采集物，以及必定掉落混合种子的特殊杂草",
      "农场内可以钓到木跃鱼，概率会受到每日运气影响",
    ],
  },
  hilltop: {
    summary: "悬崖和溪流把农场分成多层区域，西南角还有一座小型采石区。",
    bestFor: "以采矿为主题，或更喜欢多个明确分区而非一整片空地的存档。",
    tradeoff: "桥梁和高差限制了直达路线，也会切断大面积喷头农田。",
    planningNote: "为西南采石区保留生成节点的空格，并在填满各层之前先确定过桥路线。",
    knownFor: "随采矿等级变化的农场采石区",
    facts: [
      "采石区会生成石头、矿石和晶洞节点",
      "节点种类会随采矿等级提升，因此采石区也会随着存档进度变化",
    ],
  },
  wilderness: {
    summary: "中央大池塘把种植区域分开，天黑后农场里还可能出现怪物。",
    bestFor: "希望把夜间行动也纳入布局考虑的战斗主题农场。",
    tradeoff: "农场怪物给的战斗经验只有正常值的三分之一，不适合拿来快速练级。",
    planningNote: "晚归时最好让南侧入口到农舍的路线保持直接。",
    knownFor: "夜间怪物与铱魔像",
    facts: [
      "夜间怪物的种类和数量会随玩家的战斗等级变化",
      "战斗等级达到 9 级后，这张地图可能生成铱魔像",
      "1.6 版本把农场怪物的战斗经验降为正常值的三分之一",
    ],
  },
  "four-corners": {
    summary: "四个天然分区组合了大片农田、池塘、树桩空地和小型采石区。",
    bestFor: "多人联机，或希望把作物、动物、资源和加工区明确分开的单人农场。",
    tradeoff: "悬崖和连接通道让土地不如标准农场连贯。",
    planningNote: "先给每个象限定好用途，再铺路和放建筑，后期就不用频繁跨区跑。",
    knownFor: "四个分区与多种农场特点",
    facts: [
      "左上象限有可再生大树桩和混合种子杂草",
      "右下象限有一座随采矿等级变化的小型采石区",
      "地图有 2,952 个可耕种格，设计时考虑了多人联机",
    ],
  },
  beach: {
    summary: "海岸区域能为建筑和动物提供宽阔空间，但大部分可耕种地面都是沙地。",
    bestFor: "海钓、采集、畜牧、海岸建筑，或不依赖大片喷头田的作物布局。",
    tradeoff: "沙地可以耕种和手动浇水，但洒水器无法工作。",
    planningNote: "安排自动化作物前，先留出 202 格连在一起的可用喷头地，以及另外 28 格零散土壤。",
    knownFor: "海岸资源与洒水器限制",
    facts: [
      "补给箱会被冲上岸，森林和海滩采集物也会出现",
      "南岸可能钓到海鱼、海藻、贝类物品或垃圾",
      "建筑、鱼塘和草仍可使用农场的沙地区域",
    ],
  },
  meadowlands: {
    summary: "这张地图从畜牧起步，可建造但不能耕种的空间比可耕种地面更多。",
    bestFor: "以动物为主的开局，以及需要充足鸡舍、畜棚和加工建筑空间的牧场。",
    tradeoff: "2,066 个可耕种格被水域和地形分开，大型作物田需要比标准农场更多规划。",
    planningNote: "初始鸡舍、鸡和蓝草可以组成第一个功能区，但不会限制后续玩法。",
    knownFor: "蓝草、鸡舍和两只鸡",
    facts: [
      "开局自带一座鸡舍和两只随机命名的鸡",
      "玩家获得 15 份干草，而不是 15 颗防风草种子",
      "蓝草是效率更高的动物饲料，但户外草在冬季不会扩散",
    ],
  },
};

const chineseModFarmCardTexts: Readonly<
  Record<string, LocalizedModFarmCardText>
> = {
  if2r: {
    displayName: "沉浸式农场 2",
    description: "沉浸式农场 2 会替换标准农场，是一张为多人游戏准备的大型 SVE 地图，也适合想挑战大面积经营的单人玩家。这里有可耕种草地、任务线和隐藏区域，配置中还能移除围栏或改变主作物区。",
    bestFor: "多人联机、大型生产分区，或准备长期扩建的单人存档。",
    planningNote: "先核对沙盒布局、围栏、作物区、温室和洞穴设置，再安排道路与建筑；不同配置下的实际地图会与预览有所差异。",
  },
  frontier: {
    displayName: "边境农场",
    description: "边境农场是 SVE 推荐的农场地图。起始区域紧邻弗恩群岛共和国边境，后续任务还会开放更多农地、采石洞、温泉和农场矿车。",
    bestFor: "想先经营主农场，同时为后期作物或畜牧预留第二片区域的玩家。",
    planningNote: "西侧扩展区、矿车、采石洞和温泉都受进度限制；围栏、道路、桥梁与沙盒地形设置也会改变可用空间。",
  },
  grandpas: {
    displayName: "爷爷的农场",
    description: "爷爷的农场会替换标准农场，是一张中等规模的 SVE 地图。可耕种草地、紧凑地标、捷径和两条资源任务线，让它能从早期小农场逐步扩展。",
    bestFor: "喜欢前期布局紧凑，又希望完成任务后继续扩建的单人玩家。",
    planningNote: "长期规划时要保留任务区域和通往爷爷棚屋的桥；沙盒布局与移除围栏设置会明显改变中央建筑区。",
  },
  "capitalist-dream": {
    displayName: "资本家之梦农场",
    description: "资本家之梦农场会替换标准农场，地图面积大，作物区和建筑区划分得很明确。可耕种草地、浆果灌木、传送点及整洁版配置会改变细节。",
    bestFor: "需要从开局就分开安排作物、畜牧和建筑的大型生产农场。",
    planningNote: "先选整洁版或装饰版，并确认单人或多人文件；固定灌木、传送点和动物区域边界都会影响道路与建筑位置。",
  },
  "capitalist-dream-2": {
    displayName: "资本家之梦 2 农场",
    description: "资本家之梦 2 是大型标准农场替换地图，预设田块按铱制洒水器覆盖范围划分。采石场、硬木与采集区、温泉和私人海滩各有固定位置。",
    bestFor: "希望用现成田块和独立资源区组织高产布局的存档。",
    planningNote: "规划时绕开采石场、海滩、温泉、动物边界和固定通道；洞穴与矿车属于可配置项目，应以实际安装文件为准。",
  },
  "overgrown-garden": {
    displayName: "杂草丛生的花园农场",
    description: "杂草丛生的花园农场会替换森林农场。地图不大，固定绿植和自然边缘压缩了连续空地，整体更像一座紧凑的林间花园。",
    bestFor: "小片作物、少量动物和装饰布局，不追求超大型加工区的玩家。",
    planningNote: "先确定标准版或整洁版，再围绕固定树木与装饰留出空间，不要把每一块草地都当作可放建筑的位置。",
  },
  "yet-another": {
    displayName: "又一个农场",
    description: "又一个农场提供多种布局版本，地图包含东西两侧区域、东侧可再生硬木和可选的大型农场洞穴；另有不替换原版农场的独立类型版本。",
    bestFor: "需要把作物、动物与资源采集分开，又希望各区域保持连通的混合农场。",
    planningNote: "先确认安装的是替换版还是独立农场版，并核对 v1、v2 与洞穴选项；这些选择会直接改变地图轮廓。",
  },
  "solo-four-corners": {
    displayName: "单人四角农场",
    description: "单人四角农场会替换四角农场，并保留适合分区的象限结构。固定围栏、升级洞穴、水槽和动物区域边界都可通过文件或配置调整。",
    bestFor: "想把四个象限分别交给作物、畜牧、树林和加工区的单人玩家，也可用于联机。",
    planningNote: "先决定是否保留围栏和扩展洞穴，再规划跨区道路；固定水槽与动物边界可能缩窄入口或改变畜舍位置。",
  },
  "strawberry-fields": {
    displayName: "草莓田农场",
    description: "草莓田农场可以替换标准农场，开放地面被分成数块现成田区。可耕种草地、动物区域边界、瀑布和夜间灯光为大面积空地提供了清楚的结构。",
    bestFor: "希望使用多个独立洒水器田块，并在田块之间安排建筑的作物型农场。",
    planningNote: "瀑布、灯光、入口和动物边界都是地图的一部分，应提前留空，不能等其他区域排满后再随意移动。",
  },
  "blackberry-fields": {
    displayName: "黑莓田农场",
    description: "黑莓田农场是一张大型地图，采石、采集和可再生硬木各有独立区域。可选动物边界、大型洞穴、矿车与小船捷径又增加了固定功能区。",
    bestFor: "想让大型生产区与农场内资源采集、快速移动同时存在的长期存档。",
    planningNote: "先确认它替换哪一种原版农场，并同步修改对应的 Farm Type Manager 设置；洞穴、捷径和动物区选项也会影响布局。",
  },
  zenith: {
    displayName: "天顶农场",
    description: "天顶农场是独立的山地农场类型，不替换原版农场。峡谷把主要空间一分为二，坡地上还有可耕种草地、季节采集物、浆果灌木和硬木资源。",
    bestFor: "愿意利用峡谷自然分隔作物、动物和景观区域的山地布局。",
    planningNote: "为峡谷、桥、全景边缘、传送点和可选矿车留出空间；装饰、石桥、杂物与捷径设置应和实际配置保持一致。",
  },
  everfarm: {
    displayName: "永恒农场",
    description: "永恒农场会替换四角农场，面积约为原图的六倍。宽阔分区借用了多种原版农场的资源特点，采集物和可再生树桩由 Farm Type Manager 处理。",
    bestFor: "需要独立作物、畜牧、林地和水域分区的超大型单人项目或多人农场。",
    planningNote: "先画主干道和大区边界，再填充单个地块；规划器展示地图几何和原版物件，不会复现全部采集或资源刷新规则。",
  },
  "sea-breeze-island": {
    displayName: "海风岛农场",
    description: "海风岛农场是一张以岛屿地形和开阔海景为主的 Content Patcher 地图。作者页面还记录了日落景观，以及不显示窗口的可选资源文件。",
    bestFor: "沿海岸安排紧凑建筑群、保留视野并让道路顺着水边延伸的装饰型布局。",
    planningNote: "水边、桥梁和出口周围要保持通行，并以安装版本确认可建造格；岛屿主题不代表它沿用原版海滩农场的钓鱼或洒水器规则。",
  },
  "aimon-s-small-hilltop": {
    displayName: "Aimon 的小山顶农场",
    description: "Aimon 的小山顶农场提供独立农场版和山顶农场替换版。地图有山顶景观、第二座小采石场、矿车、采集角落，以及可配置的桥、围栏和传送点。",
    bestFor: "想把采矿区与作物、建筑分开，又不需要超大地图的紧凑单人农场。",
    planningNote: "先选独立版或替换版；狭窄桥面、坡道、采石场边缘和传送点都应保持畅通，可配置通道要按实际设置规划。",
  },
  "aimon-s-small-forest": {
    displayName: "Aimon 的小森林农场",
    description: "Aimon 的小森林农场提供独立农场版和森林农场替换版。这里有可耕种草地、不同鱼池、可再生硬木树桩，以及可配置的池塘、桥梁与森林出口。",
    bestFor: "重视硬木、采集、小块农田和短动线，而不是最大耕地面积的紧凑农场。",
    planningNote: "树桩刷新区、传送口和保留的池塘周围要能通行；独立版与替换版的兼容边界不同，水域和桥梁选项也会改变道路。",
  },
  "more-lively-meadowlands": {
    displayName: "更有活力的草原农场",
    description: "更有活力的草原农场重新整理了草原农场，增加可用地面、河道、桥、湖、池塘、水槽、码头和可再生硬木区域。",
    bestFor: "想保留草原农场畜牧定位，同时需要更清楚作物区和水边道路的玩家。",
    planningNote: "可以把河道和桥当作固定分区线；森林出口、额外采石洞、草地行为和部分通道可配置，应按安装选项规划。",
  },
  "modest-maps-standard": {
    displayName: "适度地图：标准农场",
    description: "适度地图重新设计了标准农场，但没有把它扩成超大地图。后院可放晚期设施，地图还加入补水槽、悬崖凹位和可配置的池塘位置。",
    bestFor: "希望保留标准农场感觉，同时平衡作物、动物和功能建筑空间的玩家。",
    planningNote: "首次载入前先选择池塘版本，并在规划器中使用对应布局；后院和悬崖凹位适合特定建筑，应在填满主田前预留。",
  },
  "waterfall-forest": {
    displayName: "瀑布森林农场",
    description: "瀑布森林农场是独立农场类型，有可耕种草地、森林采集物、再生树桩和东南采石场。洞穴、疗愈水池、快速移动与海滩样式属于可选功能，WaFFLE 是更大版本。",
    bestFor: "想把耕种、采集、采矿与多人建筑区分布在多个相连区域的复杂森林布局。",
    planningNote: "先确认使用 WaFF 还是 WaFFLE，并核对所有可选区域；编辑器不会复现疗愈、采集、洞穴升级或资源生成机制。",
  },
  "sve-winery": {
    displayName: "SVE 酒庄",
    description: "酒庄是 SVE 的农场建筑，不是替换农场的地图。达到游戏进度要求后，它会提供独立生产室内，SVE 规则会让其中的酒桶更快完成陈酿。",
    bestFor: "需要整齐酒桶行列，并希望缩短入口到各条通道距离的后期酿酒布局。",
    planningNote: "规划室内前，先在农场预留建筑的 12×5 外部占地；编辑器不会解锁酒庄，也不模拟造价、施工时间或生产速度加成。",
  },
  "sve-grandpas-shed-1": {
    displayName: "SVE 爷爷的棚屋一层",
    description: "爷爷的棚屋一层是 SVE 任务建筑修复后的下层室内，不是农场地图。修复后可放机器和酒桶，通往二层的楼梯路线比塞满所有格子更重要。",
    bestFor: "采用直线通道，并让入口到楼梯保持清楚的大型酒桶或机器布局。",
    planningNote: "不要为了占满可放置格而堵住楼梯；编辑器可以安排房间，但进入条件、修复材料、酒桶配方和任务进度仍需在游戏中完成。",
  },
  "sve-grandpas-shed-2": {
    displayName: "SVE 爷爷的棚屋二层",
    description: "爷爷的棚屋二层是完成 SVE 棚屋修复后开放的温室。10×15 种植区共有 150 个作物格，配置中还可以移除固定装饰。",
    bestFor: "全年作物行列、果树规划，或与一层生产空间搭配的混合温室布局。",
    planningNote: "填充规划前先核对装饰设置，并保留返回一层的路线；即使编辑器能显示地图，实际房间仍受 SVE 任务进度限制。",
  },
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
        blog: "Blog",
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
    farmComparisonMetaTitle: "Stardew Valley Farm Types: Compare All 8 Maps",
    farmComparisonTitle: "Which Stardew Valley Farm Type Should You Choose?",
    farmComparisonDescription: "Compare all 8 Stardew Valley farm types by usable space, unique resources, and layout trade-offs. Find the right map for crops, fishing, animals, co-op, or a challenge run.",
    farmComparisonIntroduction: "Every official farm map changes the usable ground, daily resources, fishing, and travel routes. Start with the quick picks, then compare the space and trade-offs before opening a layout in the planner.",
    farmComparisonRecommendationsTitle: "Quick picks by play style",
    farmComparisonRecommendations: [
      {
        farmType: "standard",
        heading: "First save or large crop fields",
        description: "Standard Farm gives you the clearest crop space and the fewest layout constraints.",
      },
      {
        farmType: "riverland",
        heading: "Fishing at home",
        description: "Riverland is a better fit when fishing matters more than one large crop grid.",
      },
      {
        farmType: "forest",
        heading: "Hardwood and forage",
        description: "Forest Farm keeps renewable hardwood and seasonal forage close at hand.",
      },
      {
        farmType: "meadowlands",
        heading: "Animals from day one",
        description: "Meadowlands starts with a Coop, chickens, and Blue Grass.",
      },
      {
        farmType: "four-corners",
        heading: "Co-op or clear zones",
        description: "Four Corners gives each player, or each farm job, a distinct area.",
      },
      {
        farmType: "beach",
        heading: "Coastal builds and a crop constraint",
        description: "Beach Farm suits a coastal layout, but set aside its sprinkler-friendly soil before anything else.",
      },
    ],
    farmComparisonNoUniversalBest: "There is no universal best map. The right choice depends on what you want to build around.",
    farmComparisonMethodTitle: "How to read this comparison",
    farmComparisonMethodDescription: "Tile counts use the current Stardew Valley Wiki figures, while the planner previews the supported 1.6.15 map geometry. The numbers show space and shape, but save progress, tools, and settings can still change what is available in-game. Test roads, buildings, crops, and paths here before starting a save.",
    farmComparisonSourceLabel: "Check the current Farm Maps data on the Stardew Valley Wiki",
    farmComparisonCardsTitle: "All 8 farm maps",
    farmComparisonBestForLabel: "Best for:",
    farmComparisonTradeoffLabel: "Trade-off:",
    farmComparisonPlanningNoteLabel: "Plan around:",
    farmComparisonFactsLabel: "Map facts",
    farmComparisonGuideLabel: "Read farm guide",
    farmGuideTitleTemplate: "{farmName} Guide | Stardew Planner",
    farmGuideDescriptionTemplate: "Explore the {farmName} map and start planning its Stardew Valley layout.",
    modsMetaTitle: "Stardew Valley Farm Map Mods | Stardew Planner",
    modsTitle: "Stardew Valley Farm Map Mods and SVE Interiors",
    modsDescription: "Compare 18 Stardew Valley farm map mods and 3 SVE interiors, see who each layout suits, and open every supported map in the online planner.",
    modsIntroduction: "Choose from 18 Stardew Valley farm map mods, then open the matching layout in the planner before you commit to crops, buildings, or paths in-game. Each entry explains the map's fixed structure, who it suits, and which configuration choices can change the space you are planning.",
    modsPlannerScope: "The planner displays supported map geometry with its available placement catalog. It does not install Mods, unlock SVE areas, or reproduce every custom spawn, quest, fishing, forage, and production rule.",
    modsFarmMapsTitle: "Farm map mods",
    modsFarmMapsDescription: "These maps replace a vanilla farm or add a new farm type. Check the named edition and configuration before copying a finished plan into your save.",
    modsInteriorsTitle: "SVE interior spaces",
    modsInteriorsDescription: "These are a building and two unlockable rooms from Stardew Valley Expanded, not farm replacements. Their in-game availability depends on SVE progress.",
    modBestForLabel: "Best for:",
    modPlanningNoteLabel: "Plan around:",
    modSourceLabel: "View source",
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
        blog: "博客",
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
    ],
    brandLabel: "星露谷规划器",
    counterpartLabel: "English",
    plannerTitle: "星露谷农场规划器",
    plannerDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
    plannerIntroduction: "The editing interface opens in English.",
    planFarmLabel: "规划器",
    planFarmTemplate: "规划 {farmName} →",
    farmComparisonMetaTitle: "星露谷物语农场类型对比：8 种地图怎么选",
    farmComparisonTitle: "星露谷物语 8 种农场怎么选？",
    farmComparisonDescription: "对比《星露谷物语》8 种农场地图的可用空间、独特资源与布局取舍，快速找到适合作物、钓鱼、畜牧、多人联机或挑战玩法的农场。",
    farmComparisonIntroduction: "不同的官方农场地图，会带来不同的可用土地、日常资源、钓鱼条件和行走路线。先从快速推荐找到方向，再比较空间与布局取舍，最后打开规划器试排。",
    farmComparisonRecommendationsTitle: "按玩法快速选择",
    farmComparisonRecommendations: [
      {
        farmType: "standard",
        heading: "初次游玩或大片作物田",
        description: "标准农场的作物空间最完整，布局限制也最少。",
      },
      {
        farmType: "riverland",
        heading: "在家钓鱼",
        description: "如果更在意农场内钓鱼，而不是一整片大型作物田，河流农场更合适。",
      },
      {
        farmType: "forest",
        heading: "硬木与采集",
        description: "森林农场把可再生硬木和季节采集物放在离家不远的地方。",
      },
      {
        farmType: "meadowlands",
        heading: "从第一天开始养动物",
        description: "草原农场开局就有鸡舍、鸡和蓝草。",
      },
      {
        farmType: "four-corners",
        heading: "多人联机或明确分区",
        description: "四角农场能让每位玩家，或每一种功能，都有自己的区域。",
      },
      {
        farmType: "beach",
        heading: "海岸布局与作物限制",
        description: "海滩农场适合海岸风格，但要先留出可使用洒水器的土地。",
      },
    ],
    farmComparisonNoUniversalBest: "没有适合所有人的“最佳农场”，关键在于你想围绕什么来布局。",
    farmComparisonMethodTitle: "本页数据说明",
    farmComparisonMethodDescription: "格数采用《星露谷物语》Wiki 的当前数据，规划器则显示受支持的 1.6.15 地图。数字用于比较空间和形状，不涵盖会随存档进度、工具或设置变化的所有条件。正式开档前，先在这里试排道路、建筑、作物和装饰。",
    farmComparisonSourceLabel: "查看《星露谷物语》Wiki 的最新农场地图资料",
    farmComparisonCardsTitle: "8 种农场地图",
    farmComparisonBestForLabel: "适合：",
    farmComparisonTradeoffLabel: "取舍：",
    farmComparisonPlanningNoteLabel: "规划时注意：",
    farmComparisonFactsLabel: "地图特点",
    farmComparisonGuideLabel: "查看农场指南",
    farmGuideTitleTemplate: "{farmName} 指南 | 星露谷规划器",
    farmGuideDescriptionTemplate: "了解{farmName}地图，并开始规划你的星露谷农场布局。",
    modsMetaTitle: "星露谷物语农场地图 Mod | 星露谷规划器",
    modsTitle: "星露谷物语农场地图 Mod 与 SVE 室内地图",
    modsDescription: "对比 18 张星露谷物语农场地图 Mod 和 3 张 SVE 室内地图，了解每张地图适合谁，并在在线规划器中打开受支持的布局。",
    modsIntroduction: "这里收录 18 张星露谷物语农场地图 Mod。你可以先了解地图的固定结构、适合的布局方式和会改变空间的配置，再打开对应地图安排作物、建筑与道路。",
    modsPlannerScope: "规划器会显示受支持的地图地形和可放置内容，但不会安装 Mod、解锁 SVE 区域，也不会复现所有自定义资源生成、任务、钓鱼、采集或生产规则。",
    modsFarmMapsTitle: "农场地图 Mod",
    modsFarmMapsDescription: "这些地图会替换一种原版农场，或增加新的农场类型。把完成的方案搬进存档前，请先核对版本与配置。",
    modsInteriorsTitle: "SVE 室内空间",
    modsInteriorsDescription: "这里是一座 SVE 建筑和两层可解锁房间，并非农场替换地图；是否可用取决于 SVE 的任务进度。",
    modBestForLabel: "适合：",
    modPlanningNoteLabel: "规划时注意：",
    modSourceLabel: "查看来源",
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

export function getLocalizedOfficialFarmComparisonCards(
  locale: PublicLocale,
): readonly OfficialFarmComparisonCard[] {
  assertPublicLocale(locale);

  return getOfficialFarmComparisonCards().map((comparisonCard) => {
    if (locale === "en") {
      return comparisonCard;
    }

    const localizedText = chineseOfficialFarmComparisonTexts[comparisonCard.id];

    if (!localizedText) {
      throw new Error(
        `Missing Chinese comparison content for official farm id. Received: ${JSON.stringify(comparisonCard.id)}.`,
      );
    }

    const localizedFarmGuide = getLocalizedOfficialFarmGuide(
      locale,
      comparisonCard.id,
    );

    return {
      ...comparisonCard,
      title: localizedFarmGuide.title,
      ...localizedText,
    };
  });
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
