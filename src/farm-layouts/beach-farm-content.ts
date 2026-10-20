import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const beachFarmCanonicalPath = "/stardew-valley-beach-farm-layout" as const;

export type BeachFarmCase = Readonly<{
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

export type BeachFarmPageCopy = Readonly<{
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
  cases: readonly BeachFarmCase[];
}>;

const beachFarmCasesEn: readonly BeachFarmCase[] = [
  {
    id: "dirt-patch-sprinkler-island",
    title: "Sprinkler Crops on the Dirt Patch",
    summary: "For a Stardew Valley Beach Farm layout with sprinkler crops, use the tillable dirt patch for the main field and keep the surrounding sand open. This gives crop rows a clear home while leaving nearby space for paths, buildings, or later expansion.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.jpg",
    imageAlt:
      "Beach Farm plan with a compact sprinkler crop field arranged on the central-left dirt patch and open sand around it.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.json",
  },
  {
    id: "crab-pot-supply-crate-shore",
    title: "Crab Pots Along the South Shore",
    summary: "Keep the south shore clear for crab pots, with a continuous path to the farm. Supply crates can wash ashore, so this Stardew Valley Beach Farm layout preserves access to the coast while leaving inland space available for buildings or crops.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.jpg",
    imageAlt:
      "Beach Farm shore plan with a crab-pot route, a supply-crate access strip, and open space along the coast.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.json",
  },
  {
    id: "fish-pond-shore-row",
    title: "A Fish Pond Row on the Open Sand",
    summary: "Arrange fish ponds in a row on the open sand near the crop patch, with a path connecting them to the rest of the farm. This Stardew Valley Beach Farm layout groups the ponds together while keeping the dirt patch available for sprinkler crops.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.jpg",
    imageAlt:
      "Beach Farm layout with a row of fish ponds on the central open sand and a separate tillable dirt patch for crops.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.json",
  },
  {
    id: "southeast-sandy-pasture",
    title: "A Sandy Pasture in the Southeast",
    summary: "For a Stardew Valley Beach Farm layout centered on livestock, use southeast sand for a fenced pasture where grass can grow, then group the barn, coop, and silo nearby. The dirt patch stays available for sprinkler crops, with animal space clearly separated.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.jpg",
    imageAlt:
      "Beach Farm plan with a fenced animal yard, barns, coop, and silo grouped in the southeast.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.json",
  },
  {
    id: "sand-orchard-tapped-trees",
    title: "Fruit Trees and a Tapper Grove",
    summary: "This Stardew Valley Beach Farm layout separates an open fruit orchard from a grove of tapped trees, leaving both tree areas easy to navigate around the crop patch. Fruit trees do not need watering, but each young sapling needs its surrounding 3×3 area clear while it grows.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.jpg",
    imageAlt:
      "Beach Farm layout with a spacious fruit-tree orchard, a separate line of tapped trees, and beach space left open.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.json",
  },
  {
    id: "greenhouse-second-field",
    title: "The Greenhouse as a Second Field",
    summary: "Bring the repaired greenhouse into your daily crop route with a path to the outdoor dirt patch. In this Stardew Valley Beach Farm layout, the greenhouse entrance stays easy to reach, and the open sand remains available for other farm zones.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-06-greenhouse-second-field.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-06-greenhouse-second-field.jpg",
    imageAlt:
      "Beach Farm plan showing a path to the greenhouse and a separate outdoor crop area.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-06-greenhouse-second-field.json",
  },
  {
    id: "retaining-soil-boutique-plots",
    title: "Small Beds with Deluxe Retaining Soil",
    summary: "In a Stardew Valley Beach Farm layout for a small hand-tended garden, divide sand into compact crop beds. Deluxe Retaining Soil helps watered soil stay moist overnight, but it does not water dry soil the first time, so each bed still needs an initial watering.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.jpg",
    imageAlt:
      "Beach Farm plan with several small sandy crop beds and Deluxe Retaining Soil displayed beside them.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.json",
  },
  {
    id: "coastal-village-aesthetic",
    title: "A Coastal Village Layout",
    summary: "Group buildings around paths to form a village-like center, keeping views toward the shoreline open. The paths and open spaces in this Stardew Valley Beach Farm layout connect the farm’s building clusters without crowding the coast.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.jpg",
    imageAlt:
      "Decorative Beach Farm design with clustered buildings, a village-like path, and an open view toward the shoreline.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.json",
  },
  {
    id: "bee-artisan-shed-district",
    title: "Bee Houses and an Artisan Workyard",
    summary: "This Stardew Valley Beach Farm layout places Bee Houses outdoors beside flowering crops and groups artisan sheds nearby. Flowers within range affect the type of honey, and Bee Houses do not produce honey indoors, so the garden stays outside and the workshop sits beside it.",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.jpg",
    imageAlt:
      "Beach Farm layout with a flower garden, outdoor Bee Houses, and an artisan shed district.",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.json",
  },
];

const beachFarmCasesZhCn: readonly BeachFarmCase[] = [
  {
    id: "dirt-patch-sprinkler-island",
    title: "泥地洒水器种植区",
    summary: "这份星露谷物语海滩农场布局将主要作物集中在可耕泥地区，让洒水器有合适的摆放位置；周围沙地留白，可以安排道路、建筑或以后扩展。这样种植区和其他用途各有边界，容易按存档逐步调整。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.jpg",
    imageAlt: "海滩农场布局：洒水器和作物集中在中左侧泥地，周围沙地保持开阔。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-01-dirt-patch-sprinkler-island.json",
  },
  {
    id: "crab-pot-supply-crate-shore",
    title: "南岸蟹笼与海岸通道",
    summary: "规划星露谷物语海滩农场布局时，可以沿着南岸安排蟹笼，并在水边和农场内部之间留出连续通道。补给箱有时会被冲到岸边，通道方便查看海岸，也让内侧空间能继续用于建筑或种植，日常往返更顺畅。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.jpg",
    imageAlt: "海滩农场海岸布局：规划蟹笼、补给箱通道，并为岸边保留开阔空间。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-02-crab-pot-supply-crate-shore.json",
  },
  {
    id: "fish-pond-shore-row",
    title: "沙地区鱼塘排布",
    summary: "案例展示的星露谷物语海滩农场布局把鱼塘排在作物田附近的开阔沙地上，再用道路连接农场其他区域。鱼塘集中成组，可耕泥地仍能留给洒水器作物，两种用途各有位置，日常动线也更清晰。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.jpg",
    imageAlt: "海滩农场布局：中部开阔沙地上排列着一排鱼塘，旁边保留独立的可耕泥地区。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-03-fish-pond-shore-row.json",
  },
  {
    id: "southeast-sandy-pasture",
    title: "东南沙地牧场",
    summary: "利用东南角沙地安排围栏和草地，把畜棚、鸡舍、筒仓集中放在牧场旁。海滩农场的沙地可以长草，可耕泥地则留给作物种植，让畜牧区和种植区各自清晰。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.jpg",
    imageAlt: "海滩农场东南角的围栏牧场，集中摆放畜棚、鸡舍和筒仓。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-04-southeast-sandy-pasture.json",
  },
  {
    id: "sand-orchard-tapped-trees",
    title: "果园与树液采集林",
    summary: "在这套星露谷物语海滩农场布局中，果树排成疏朗果园，安装树液采集器的树木则集中成片，两种树区分开来，也不会挤占作物田。果树无需浇水；幼苗生长期间，每棵周围的 3×3 范围都要保持空旷。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.jpg",
    imageAlt: "海滩农场布局：疏朗的果园与单独的树液采集带，海滩空间保持开阔。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-05-sand-orchard-tapped-trees.json",
  },
  {
    id: "greenhouse-second-field",
    title: "把温室作为第二块种植区",
    summary: "温室修复后，这套星露谷物语海滩农场布局把入口接到日常照料作物的路线上。道路串起温室和室外泥地，两处种植区各有位置，其他沙地仍能留给牧场、建筑或装饰。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-06-greenhouse-second-field.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-06-greenhouse-second-field.jpg",
    imageAlt: "海滩农场布局：道路连接温室与农场，室外另有一块作物区。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-06-greenhouse-second-field.json",
  },
  {
    id: "retaining-soil-boutique-plots",
    title: "保水肥沙地小田",
    summary: "沙地小田是星露谷物语海滩农场布局中的一种种植安排：把沙地划分成几块小型种植床，适合集中照料少量作物。豪华保水肥能让已经浇过水的土壤在夜间保持湿润，但不能代替首次浇水，因此每块土在开始种植前都要先浇水。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.jpg",
    imageAlt: "海滩农场布局：几块小型沙地作物床旁展示保水肥，不使用沙地洒水器。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-07-retaining-soil-boutique-plots.json",
  },
  {
    id: "coastal-village-aesthetic",
    title: "海岸村落布局",
    summary: "把建筑分成几组，沿道路组织出村落般的农场中心，并让通向海岸的视线保持开阔。道路和装饰一起构成整体氛围，分区之间留出空间，方便按照自己喜欢的主题继续布置。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.jpg",
    imageAlt: "装饰风海滩农场布局：建筑和道路组成海岸村落，并保留开阔海景。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-08-coastal-village-aesthetic.json",
  },
  {
    id: "bee-artisan-shed-district",
    title: "蜂房花田与工匠棚屋",
    summary: "这套星露谷物语海滩农场布局把蜂房放在室外花田旁，工匠棚屋集中安排在附近，形成相连的花园与加工区。范围内的花朵会影响蜂蜜类型，蜂房在室内不会产蜜；因此把花田和蜂房安排在室外，作物区则另行规划。",
    imageSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.webp",
    imageOriginalSrc:
      "/farm-layouts/beach/images/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.jpg",
    imageAlt: "海滩农场布局：花园、室外蜂房和工匠棚屋集中规划在一片区域。",
    imageWidth: 1600,
    imageHeight: 1600,
    projectHref:
      "/farm-layouts/beach/projects/stardew-valley-beach-farm-layout-09-bee-artisan-shed-district.json",
  },
];

const beachFarmPageCopyByLocale: Readonly<Record<PublicLocale, BeachFarmPageCopy>> = {
  en: {
    title: "Stardew Valley Beach Farm Layout",
    metaTitle: "Stardew Valley Beach Farm Layouts: 9 Ideas",
    description:
      "Explore nine Beach Farm layout ideas for crop patches, shore access, fish ponds, animal yards, orchards, greenhouses, and decorating. View the full plans or import a project into the planner.",
    intro:
      "Planning a Stardew Valley Beach Farm layout means working around one clear limit: sprinklers cannot be placed on sand, while the open shoreline leaves room for paths, buildings, and distinct themes. Compare these Stardew Valley Beach Farm layout examples, created in the Stardew Valley Planner, and download a project if you want to adapt one to your save.",
    categoryLabel: "Farm maps",
    browseLabel: "Browse the nine layouts",
    openPlannerLabel: "Open the planner",
    casesHeading: "Find a Beach Farm layout that fits how you play",
    casesDescription: "These Stardew Valley Beach Farm layout examples cover a sprinkler crop patch, shoreline access, fish ponds, livestock, trees, greenhouse routes, small sandy beds, and decorative or artisan areas.",
    whatIsHeading: "What is a Beach Farm layout?",
    whatIsParagraphs: [
      "A Stardew Valley Beach Farm layout shows how crops, buildings, animal areas, trees, and paths can be arranged on the Beach Farm map.",
      "When planning a Stardew Valley Beach Farm layout, keep sprinkler crops on the tillable dirt patch because sprinklers cannot be placed on sand. The open sand can instead hold buildings, livestock areas, trees, paths, and other farm zones.",
    ],
    enlargeImageLabel: "View full layout image",
    closeImageLabel: "Close full layout image",
    downloadProjectLabel: "Download this layout",
    howToEyebrow: "How to use",
    howToHeading: "How to use a Stardew Valley Beach Farm layout project",
    howToSteps: [
      {
        number: "01",
        title: "Download a layout",
        body: "Choose a Stardew Valley Beach Farm layout above and download its JSON project file.",
      },
      {
        number: "02",
        title: "Import it in the planner",
        body: "Open the planner, click “Library”, choose “Import JSON”, and select the downloaded project for the Stardew Valley Beach Farm layout you chose.",
      },
      {
        number: "03",
        title: "Make it your own",
        body: "Adjust buildings and placements to match your save; the imported Stardew Valley Beach Farm layout is your starting point.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Valley Beach Farm layout questions",
    faqDescription:
      "Find practical answers about sprinkler limits, outdoor space, retaining soil, and using each Stardew Valley Beach Farm layout project in the planner.",
    faqs: [
      {
        question: "Can I place sprinklers on the Beach Farm sand?",
        answer:
          "No. Sprinklers cannot be placed on sand. Plan sprinkler crops on valid farm tiles, use the repaired greenhouse, or consider hand-watering and Retaining Soil for a smaller crop area.",
      },
      {
        question: "What can I do with the open sandy areas?",
        answer:
          "Use them to plan farm buildings, animal yards, fish ponds, trees, processing areas, paths, or decoration. Check the placement rules for each building or tree as you adapt a layout.",
      },
      {
        question: "Can I copy a downloaded layout directly into my save?",
        answer:
          "The JSON opens as a planner project. Treat it as a starting plan, then check it against your farm map, unlocked buildings, and current save before placing anything in game.",
      },
      {
        question: "Does Retaining Soil water a crop the first time?",
        answer:
          "No. Water the tilled soil once first. Deluxe Retaining Soil can then keep it watered overnight while the crop grows.",
      },
    ],
    ctaHeading: "Make this Beach Farm your own",
    ctaDescription: "Choose a layout you like, download its project, and import it into the planner. Then adjust buildings, paths, and details to match your save.",
    ctaButtonLabel: "Start planning your farm",
    cases: beachFarmCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语海滩农场布局",
    metaTitle: "星露谷物语海滩农场布局：9 个规划案例",
    description:
      "查看 9 个星露谷物语海滩农场布局案例，涵盖作物区、海岸通道、鱼塘、牧场、果园、温室和装饰规划。可查看完整地图或下载项目到规划器继续编辑。",
    intro:
      "规划星露谷物语海滩农场布局时，先考虑洒水器不能放在沙地上；开阔海岸则适合安排道路、建筑和装饰主题。这里收录了 9 个在星露谷规划器中制作的农场案例。你可以查看完整地图、比较各自分区，也可以下载项目继续调整。",
    categoryLabel: "农场地图",
    browseLabel: "浏览 9 个布局",
    openPlannerLabel: "打开规划器",
    casesHeading: "海滩农场，按你的玩法来规划",
    casesDescription: "这九个星露谷物语海滩农场布局案例，从泥地作物区、南岸通道，到鱼塘、牧场、果园、温室周边路线和装饰布局，展示不同的空间安排。",
    whatIsHeading: "什么是海滩农场布局？",
    whatIsParagraphs: [
      "星露谷物语海滩农场布局，是在海滩地图上安排作物、建筑、畜牧区、树木和道路的规划方案。",
      "这套星露谷物语海滩农场布局思路把泥地区留给自动浇水的作物，沙地区域则用来安排建筑、畜牧区、树木和道路。下面的九个案例展示了不同的分区思路。",
    ],
    enlargeImageLabel: "查看完整布局图",
    closeImageLabel: "关闭完整布局图",
    downloadProjectLabel: "下载这个布局",
    howToEyebrow: "使用说明",
    howToHeading: "如何使用星露谷物语海滩农场布局项目",
    howToSteps: [
      {
        number: "01",
        title: "下载布局项目",
        body: "从上方选择一个星露谷物语海滩农场布局案例，下载对应的 JSON 项目文件。",
      },
      {
        number: "02",
        title: "导入规划器",
        body: "打开规划器，点击“本地项目”，再选择“导入 JSON”并选中下载的文件。",
      },
      {
        number: "03",
        title: "调整农场布局",
        body: "导入星露谷物语海滩农场布局项目后，按自己的存档调整建筑、道路和物品位置。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语海滩农场布局常见问题",
    faqDescription:
      "了解星露谷物语海滩农场布局的空间取舍，以及如何在规划器中查看和调整下载的布局项目。",
    faqs: [
      {
        question: "星露谷物语海滩农场布局中的洒水器能放在沙地上吗？",
        answer:
          "不能。洒水器不能放在沙地上。请把洒水器作物安排在可放置的农场地块或修复后的温室，也可以用手动浇水和保水肥管理小块田地。",
      },
      {
        question: "开阔的沙地区域可以怎么规划？",
        answer:
          "可以用来规划农场建筑、动物活动区、鱼塘、树木、加工区、道路或装饰。调整布局时，请逐项确认建筑和树木的放置规则。",
      },
      {
        question: "星露谷物语海滩农场布局项目能直接放进我的存档吗？",
        answer:
          "不能直接导入游戏存档。JSON 文件会作为规划器项目打开。建议把它当作起点，再结合自己的农场地图、已解锁建筑和当前存档确认后续摆放。",
      },
      {
        question: "保水肥能代替第一次浇水吗？",
        answer:
          "不能。安排星露谷物语海滩农场布局中的沙地小田时，先给耕过的土壤浇一次水；之后，豪华保水肥可以让土壤在夜间保持湿润，帮助作物继续生长。",
      },
    ],
    ctaHeading: "开始规划你的海滩农场",
    ctaDescription: "从喜欢的星露谷物语海滩农场布局案例开始，下载项目并导入规划器，再根据自己的存档调整建筑、道路和细节。",
    ctaButtonLabel: "打开农场规划器",
    cases: beachFarmCasesZhCn,
  },
};

export function getBeachFarmPageCopy(locale: PublicLocale): BeachFarmPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported Beach Farm page locale: ${String(locale)}.`);
  }

  return beachFarmPageCopyByLocale[locale];
}
