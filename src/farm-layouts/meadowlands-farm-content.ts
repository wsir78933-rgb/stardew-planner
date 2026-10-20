import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const meadowlandsFarmCanonicalPath = "/meadowlands-farm-layout" as const;

export type MeadowlandsFarmCase = Readonly<{
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

export type MeadowlandsFarmPageCopy = Readonly<{
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
  cases: readonly MeadowlandsFarmCase[];
}>;

const meadowlandsFarmCasesEn: readonly MeadowlandsFarmCase[] = [
  {
    id: "01-starter-coop-mayo-lane",
    title: "A Starter Coop and Mayo-Machine Lane",
    summary:
      "Keep the Coop and six Mayo Machines near the farmhouse, with a compact crop patch to the southwest and fenced pasture to the east. This Stardew Valley Meadowlands farm layout keeps daily routes close while leaving much of the center open.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-01-starter-coop-mayo-lane.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-01-starter-coop-mayo-lane.jpg",
    imageAlt:
      "Meadowlands Farm plan with the Coop and Mayo Machines near the farmhouse, a small southwest crop patch, and a fenced pasture to the east.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-01-starter-coop-mayo-lane.json",
  },
  {
    id: "02-blue-grass-pasture-ring",
    title: "A Broad Blue Grass Pasture",
    summary:
      "Build one broad fenced pasture through the center and group the Barn, Coop, and Silo along its edge. The surrounding Meadowlands farm layout leaves the north and east open for paths, crops, or later changes.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-02-blue-grass-pasture-ring.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-02-blue-grass-pasture-ring.jpg",
    imageAlt:
      "Meadowlands Farm plan with a broad fenced blue grass pasture across the lower middle and animal buildings grouped along its edge.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-02-blue-grass-pasture-ring.json",
  },
  {
    id: "03-southwest-compact-crops",
    title: "Compact Crops in the Southwest",
    summary:
      "Set compact crop beds in the southwest, with the Well close by and a small fenced pasture just east of the fields. This Stardew Valley Meadowlands farm layout keeps the middle clear while giving the crop patch a defined edge.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-03-southwest-compact-crops.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-03-southwest-compact-crops.jpg",
    imageAlt:
      "Meadowlands Farm plan with compact southwest crop beds, a nearby Well, and a small fenced pasture to the east.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-03-southwest-compact-crops.json",
  },
  {
    id: "04-housefront-garden-well",
    title: "A Housefront Garden and Well",
    summary:
      "Place the Well beside small crop beds in front of the farmhouse, with the Coop and a fenced grass patch nearby. In this Stardew Valley Meadowlands farm layout, the garden stays within a short walk of the door without covering the whole farm in fields.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-04-housefront-garden-well.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-04-housefront-garden-well.jpg",
    imageAlt:
      "Meadowlands Farm plan with a small garden and Well in front of the farmhouse, plus a nearby Coop and fenced grass patch.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-04-housefront-garden-well.json",
  },
  {
    id: "05-northwest-greenhouse",
    title: "A Northwest Greenhouse Route",
    summary:
      "Use paths and crop beds to make the greenhouse part of the northwest farm route, then group the Coop, Silo, and fenced pasture nearby. This Stardew Valley Meadowlands farm layout works around the greenhouse already shown on the map and leaves other areas open.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-05-northwest-greenhouse.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-05-northwest-greenhouse.jpg",
    imageAlt:
      "Meadowlands Farm plan with paths and crop beds around the northwest greenhouse, with a Coop, Silo, and fenced pasture nearby.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-05-northwest-greenhouse.json",
  },
  {
    id: "06-north-bridge-silos",
    title: "Three Silos Along the North Edge",
    summary:
      "Place three Silos along the north edge and connect them by path to the Coop, Well, and fenced pasture below. The route keeps storage and the animal area easy to read, while the rest of this Meadowlands farm layout stays open for later buildings.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-06-north-bridge-silos.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-06-north-bridge-silos.jpg",
    imageAlt:
      "Meadowlands Farm plan with three Silos along the north edge and a path leading toward the Coop, Well, and fenced pasture.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-06-north-bridge-silos.json",
  },
  {
    id: "07-east-barns-west-sheds",
    title: "Barns in the East, Sheds in the West",
    summary:
      "Arrange the Barn upgrades along the east side, put two Sheds near the western river, and use the Coop as a central link. Two fenced blue grass pastures sit along the south, making this Stardew Valley Meadowlands farm layout easy to read by zone.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-07-east-barns-west-sheds.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-07-east-barns-west-sheds.jpg",
    imageAlt:
      "Meadowlands Farm plan with Barns to the east, two Sheds near the western river, a central Coop, and two southern fenced pastures.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-07-east-barns-west-sheds.json",
  },
  {
    id: "08-clock-hub-twin-pastures",
    title: "A Clock Hub with Twin Pastures",
    summary:
      "Place the Gold Clock at the center, with a fenced blue grass pasture on either side and the Deluxe Coop, Barn, and two Silos nearby. This Stardew Valley Meadowlands farm layout gives the farm a clear landmark and two distinct pasture wings.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-08-clock-hub-twin-pastures.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-08-clock-hub-twin-pastures.jpg",
    imageAlt:
      "Meadowlands Farm plan with the Gold Clock as a central landmark and a fenced blue grass pasture on each side.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-08-clock-hub-twin-pastures.json",
  },
  {
    id: "09-riverside-fish-ponds",
    title: "Fish Ponds Along the River",
    summary:
      "Line up five Fish Ponds beside the western river and farther south, using paths to connect them to the nearby Coop, Silo, and fenced pasture. This Stardew Valley Meadowlands farm layout gives water-side buildings their own strip while keeping other farm areas legible.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-09-riverside-fish-ponds.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-09-riverside-fish-ponds.jpg",
    imageAlt:
      "Meadowlands Farm plan with five Fish Ponds by the western river and south side, connected to a Coop, Silo, and fenced pasture.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-09-riverside-fish-ponds.json",
  },
  {
    id: "10-late-barns-cellar",
    title: "A Large Pasture for Three Deluxe Barns",
    summary:
      "Gather three Deluxe Barns in a large southern fenced pasture and place two Silos just beyond it. Near the farmhouse, group the Mill, Big Shed, and Cabin together; this Stardew Valley Meadowlands farm layout keeps the animal yard and utility buildings in clear zones.",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-10-late-barns-cellar.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-10-late-barns-cellar.jpg",
    imageAlt:
      "Meadowlands Farm plan with three Deluxe Barns in a large southern fenced pasture, two Silos beyond the fence, and a Mill, Big Shed, and Cabin near the farmhouse.",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-10-late-barns-cellar.json",
  },
];

const meadowlandsFarmCasesZhCn: readonly MeadowlandsFarmCase[] = [
  {
    id: "01-starter-coop-mayo-lane",
    title: "鸡舍与蛋黄酱机小巷",
    summary:
      "把鸡舍和六台蛋黄酱机安排在农舍附近，西南侧留一块紧凑菜地，东侧围出草地牧场。这套星露谷物语草原农场布局让日常照料集中在农舍周围，同时保留农场中央的开阔空间。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-01-starter-coop-mayo-lane.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-01-starter-coop-mayo-lane.jpg",
    imageAlt:
      "草原农场布局：鸡舍和蛋黄酱机靠近农舍，西南侧有小块菜地，东侧围出牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-01-starter-coop-mayo-lane.json",
  },
  {
    id: "02-blue-grass-pasture-ring",
    title: "中央蓝草围栏牧场",
    summary:
      "在农场中部围出一片宽阔牧场，把畜棚、鸡舍和筒仓集中在牧场边缘。这个星露谷物语草原农场布局将北侧与东侧留得更开阔，之后可以继续安排道路、种植区或其他建筑。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-02-blue-grass-pasture-ring.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-02-blue-grass-pasture-ring.jpg",
    imageAlt:
      "草原农场布局：中南部是一片宽阔的围栏蓝草牧场，畜牧建筑集中在牧场一侧。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-02-blue-grass-pasture-ring.json",
  },
  {
    id: "03-southwest-compact-crops",
    title: "西南角紧凑作物田",
    summary:
      "在西南侧把作物分成几块紧凑田地，并在附近放置水井，田地东侧另设小型围栏牧场。这套星露谷物语草原农场布局让种植区边界清楚，也为农场中央留出通行和调整空间。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-03-southwest-compact-crops.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-03-southwest-compact-crops.jpg",
    imageAlt:
      "草原农场布局：西南侧紧凑作物田旁有水井，田地东侧设有小型围栏牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-03-southwest-compact-crops.json",
  },
  {
    id: "04-housefront-garden-well",
    title: "农舍前菜园与水井",
    summary:
      "把水井和几块小菜地布置在农舍门前，鸡舍与一小片围栏草地放在附近。这种星露谷物语草原农场布局把日常种植区放在出门就能照料的位置，不必把整片农场都铺成田地。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-04-housefront-garden-well.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-04-housefront-garden-well.jpg",
    imageAlt:
      "草原农场布局：农舍前有小菜园和水井，附近安排鸡舍与围栏草地。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-04-housefront-garden-well.json",
  },
  {
    id: "05-northwest-greenhouse",
    title: "西北温室周边动线",
    summary:
      "用道路和作物田把西北区域的温室连入日常动线，再把鸡舍、筒仓和围栏牧场安排在附近。这套星露谷物语草原农场布局围绕地图中已有的温室规划通道，其他区域仍可按存档继续调整。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-05-northwest-greenhouse.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-05-northwest-greenhouse.jpg",
    imageAlt:
      "草原农场布局：道路和作物田围绕西北区域的温室，附近还有鸡舍、筒仓和围栏牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-05-northwest-greenhouse.json",
  },
  {
    id: "06-north-bridge-silos",
    title: "北侧三座筒仓",
    summary:
      "沿农场北侧摆放三座筒仓，再用道路连接下方的鸡舍、水井和围栏牧场。这样的星露谷物语草原农场布局把储草设施与动物活动区分开，也让其他地块可以留待后续规划。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-06-north-bridge-silos.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-06-north-bridge-silos.jpg",
    imageAlt:
      "草原农场布局：三座筒仓排在北侧，道路连接下方的鸡舍、水井与围栏牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-06-north-bridge-silos.json",
  },
  {
    id: "07-east-barns-west-sheds",
    title: "东侧畜棚与西侧棚屋",
    summary:
      "把不同等级的畜棚沿东侧安排，两座棚屋放在西侧河边，鸡舍则作为中间的连接点。南侧分出两片围栏蓝草牧场，这套星露谷物语草原农场布局让畜牧、加工和通行区域一目了然。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-07-east-barns-west-sheds.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-07-east-barns-west-sheds.jpg",
    imageAlt:
      "草原农场布局：畜棚在东侧，两座棚屋靠近西侧河岸，鸡舍居中，南侧有两片围栏牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-07-east-barns-west-sheds.json",
  },
  {
    id: "08-clock-hub-twin-pastures",
    title: "黄金时钟与双牧场枢纽",
    summary:
      "把黄金时钟放在中心，两侧各围出一片蓝草牧场，豪华鸡舍、畜棚和两座筒仓集中在附近。这套星露谷物语草原农场布局用醒目的地标串起两侧牧场，形成清楚的左右分区。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-08-clock-hub-twin-pastures.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-08-clock-hub-twin-pastures.jpg",
    imageAlt:
      "草原农场布局：黄金时钟位于中央，两侧各有一片围栏蓝草牧场。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-08-clock-hub-twin-pastures.json",
  },
  {
    id: "09-riverside-fish-ponds",
    title: "沿河排列的鱼塘",
    summary:
      "沿西侧河流和南侧安排五座鱼塘，再用道路连接附近的鸡舍、筒仓与围栏牧场。这个星露谷物语草原农场布局为鱼塘留出连续区域，其他农场用途也能保持清晰分区。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-09-riverside-fish-ponds.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-09-riverside-fish-ponds.jpg",
    imageAlt:
      "草原农场布局：五座鱼塘沿西侧河流和南侧排列，并与鸡舍、筒仓和牧场相连。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-09-riverside-fish-ponds.json",
  },
  {
    id: "10-late-barns-cellar",
    title: "三座豪华畜棚与大型牧场",
    summary:
      "把三座豪华畜棚集中在南侧的大型围栏牧场内，筒仓放在围栏外侧；农舍附近则安排磨坊、大棚屋和小屋。这套星露谷物语草原农场布局将畜牧空间与农场设施分区，方便按当前存档继续调整。",
    imageSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-10-late-barns-cellar.webp",
    imageOriginalSrc:
      "/farm-layouts/meadowlands/images/meadowlands-farm-layout-10-late-barns-cellar.jpg",
    imageAlt:
      "草原农场布局：南侧大型围栏牧场内有三座豪华畜棚，牧场外侧有两座筒仓；磨坊、大棚屋和小屋靠近农舍。",
    imageWidth: 1600,
    imageHeight: 1200,
    projectHref:
      "/farm-layouts/meadowlands/projects/meadowlands-farm-layout-10-late-barns-cellar.json",
  },
];

const meadowlandsFarmPageCopyByLocale: Readonly<
  Record<PublicLocale, MeadowlandsFarmPageCopy>
> = {
  en: {
    title: "Stardew Valley Meadowlands Farm Layout",
    metaTitle: "Stardew Valley Meadowlands Farm Layouts: 10 Ideas",
    description:
      "Explore ten Stardew Valley Meadowlands farm layout ideas for coops, pastures, crop beds, greenhouse paths, fish ponds, and late-game buildings. View each plan or download its JSON project for the planner.",
    intro:
      "The Meadowlands Farm starts with a Coop, two chickens, and hay instead of starter seeds. Compare each Stardew Valley Meadowlands farm layout to see how a pasture, compact crops, or work areas can fit around the map, then download a project to adapt in the planner.",
    categoryLabel: "Meadowlands Farm",
    browseLabel: "Browse the 10 layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Find a Meadowlands farm layout for your play style",
    casesDescription:
      "These ten Stardew Valley Meadowlands farm layout examples range from a starter Coop and compact crops to split pastures, riverside ponds, and grouped late-game buildings.",
    ctaHeading: "Make your Meadowlands Farm your own",
    ctaDescription:
      "Choose a Stardew Valley Meadowlands farm layout that suits your plans, download its project, and import it into the planner. Then adjust buildings, paths, and placements to match your save.",
    ctaButtonLabel: "Start planning your farm",
    whatIsHeading: "What is a Meadowlands Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Meadowlands farm layout is a plan for arranging crops, buildings, pastures, and paths across the Meadowlands map.",
      "The map’s open grass and separated crop spaces invite different layouts, from a single fenced pasture to compact fields beside the farmhouse. Use each Stardew Valley Meadowlands farm layout here as a visual starting point, then shape the open areas around your own routine.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Meadowlands farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Choose a layout",
        body: "Pick a Stardew Valley Meadowlands farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, click “Library”, choose “Import JSON”, and select the downloaded project file.",
      },
      {
        number: "03",
        title: "Adjust it for your save",
        body: "Review the imported Stardew Valley Meadowlands farm layout, then adjust buildings and placements to fit your farm.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Meadowlands Farm layout questions",
    faqDescription:
      "Get practical answers about the starting Coop, crop areas, greenhouse routes, and how to use a Meadowlands farm layout project in the planner.",
    faqs: [
      {
        question: "What does the Meadowlands Farm start with?",
        answer:
          "The map starts with a Coop, two chickens, and hay instead of the usual starter seeds. A Stardew Valley Meadowlands farm layout can keep that first animal area near the farmhouse while leaving room for crops and paths.",
      },
      {
        question: "Where should I put crops on the Meadowlands map?",
        answer:
          "Try the compact crop spaces shown in the layouts, such as the southwest beds or a small garden near the farmhouse. Compare each Stardew Valley Meadowlands farm layout with your save and leave clear paths between fields and buildings.",
      },
      {
        question: "How do these plans fit around the greenhouse?",
        answer:
          "The plans show paths and nearby spaces arranged around the greenhouse already present on the map. You can adapt the surrounding paths and crop beds in the planner to match the state of your own farm.",
      },
      {
        question: "Does the downloaded JSON change my game save?",
        answer:
          "No. The JSON is a planner project file. Import it through Library → Import JSON, review the plan, and use it as a reference when you arrange your in-game farm.",
      },
      {
        question: "Can I customize a Meadowlands farm layout before using it?",
        answer:
          "Yes. Open the project in the planner and adjust buildings, paths, crop beds, and other placements to match the features and space available in your save.",
      },
    ],
    cases: meadowlandsFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语草原农场布局",
    metaTitle: "星露谷物语草原农场布局：10 个案例",
    description:
      "查看 10 个星露谷物语草原农场布局案例，涵盖鸡舍牧场、紧凑作物田、温室周边道路、鱼塘和后期建筑分区。可浏览完整地图，或下载 JSON 项目到规划器继续调整。",
    intro:
      "草原农场开局自带鸡舍、两只鸡和干草，而不是种子。你可以对比每套星露谷物语草原农场布局，看看牧场、小块作物田和加工建筑如何安排，再下载 JSON 项目到规划器中继续调整。",
    categoryLabel: "草原农场",
    browseLabel: "浏览 10 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "按你的玩法规划草原农场",
    casesDescription:
      "这十套星露谷物语草原农场布局从开局鸡舍、紧凑田地，到分区牧场、沿河鱼塘和后期建筑组合，展示不同的空间安排。",
    ctaHeading: "打造自己的草原农场",
    ctaDescription:
      "选一套喜欢的星露谷物语草原农场布局，下载项目并导入规划器，再按照自己的存档调整建筑、道路和摆放位置。",
    ctaButtonLabel: "开始规划农场",
    whatIsHeading: "什么是草原农场布局？",
    whatIsParagraphs: [
      "星露谷物语草原农场布局，是在草原地图上安排作物、建筑、牧场和道路的规划方案。",
      "地图上有开阔草地和分散的种植空间，可以选择围出一片大牧场，也可以在农舍附近规划紧凑作物田。这里的星露谷物语草原农场布局可作为视觉参考，再根据自己的日常路线调整空地用途。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语草原农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "选择布局",
        body: "从上方挑选一套星露谷物语草原农场布局，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，点击“本地项目”，再选择“导入 JSON”并选中下载的项目文件。",
      },
      {
        number: "03",
        title: "按存档调整",
        body: "查看导入的星露谷物语草原农场布局，再按自己的农场调整建筑和摆放位置。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语草原农场布局常见问题",
    faqDescription:
      "了解草原农场的开局配置、作物区和温室周边动线，并查看如何在规划器中使用星露谷物语草原农场布局项目。",
    faqs: [
      {
        question: "草原农场开局有什么？",
        answer:
          "地图开局有鸡舍、两只鸡和干草，而不是常见的初始种子。规划星露谷物语草原农场布局时，可以让这片畜牧区靠近农舍，并为作物和道路留出空间。",
      },
      {
        question: "草原地图的作物适合种在哪里？",
        answer:
          "可以参考案例中的紧凑种植区，例如西南侧田地或农舍旁的小菜园。对比星露谷物语草原农场布局与自己的存档，并在田地和建筑之间留出通道。",
      },
      {
        question: "温室周边路线如何融入星露谷物语草原农场布局？",
        answer:
          "案例展示的是围绕地图已有温室规划道路和周边空间。你可以在规划器中调整温室附近的道路和作物田，让路线符合自己的农场进度。",
      },
      {
        question: "下载的 JSON 会修改游戏存档吗？",
        answer:
          "不会。JSON 是规划器项目文件。通过“本地项目”里的“导入 JSON”打开后，可以查看布局，再把它作为游戏内摆放建筑的参考。",
      },
      {
        question: "导入后还能调整布局吗？",
        answer:
          "可以。在规划器中打开项目后，按存档条件调整建筑、道路、作物田和其他摆放位置，再决定如何应用到自己的农场规划中。",
      },
    ],
    cases: meadowlandsFarmCasesZhCn,
  },
};

export function getMeadowlandsFarmPageCopy(
  locale: PublicLocale,
): MeadowlandsFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Meadowlands Farm page locale: ${String(locale)}.`);
  }

  return meadowlandsFarmPageCopyByLocale[locale];
}
