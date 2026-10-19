import type { HomepageDisplayLocale } from "./homepage-locale";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";
import { russianHomepageCopy } from "./homepage-copy.ru";

type HomepageFarmLayoutSlide = Readonly<{
  quote: string;
  name: string;
  designation: string;
  src: string;
  imageAlt: string;
}>;

type HomepageHowToStep = Readonly<{
  title: string;
  description: string;
  benefits: readonly string[];
}>;

type HomepageWhatIsItem = Readonly<{
  title: string;
  description: string;
}>;

export type HomepageCaseStudyGroup = Readonly<{
  id: string;
  heading: string;
  imagePosition: "left" | "right";
  previousLabel: string;
  nextLabel: string;
  testimonials: readonly Readonly<{
    name: string;
    designation: string;
    quote: string;
    src: string;
    alt: string;
  }>[];
}>;

export type HomepageFeatureIntroductionIcon =
  | "map"
  | "layout"
  | "coverage"
  | "seasons"
  | "projects"
  | "export";

export type HomepageFeatureIntroductionItem = Readonly<{
  icon: HomepageFeatureIntroductionIcon;
  title: string;
  description: string;
}>;

type HomepageFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type HomepageHeroFanImage = Readonly<{
  src: string;
  alt: string;
}>;

export type HomepageCopy = Readonly<{
  navigation: Readonly<{
    productName: string;
    capabilitiesLabel: string;
    faqLabel: string;
    blogLabel: string;
    plannerActionLabel: string;
    languageLabel: string;
  }>;
  hero: Readonly<{
    headlineBefore: string;
    headlineEmphasis: string;
    headlineAfter: string;
    supportingCopy: string;
    primaryActionLabel: string;
    trustedBy: string;
    fanImages: readonly [
      HomepageHeroFanImage,
      HomepageHeroFanImage,
      HomepageHeroFanImage,
    ];
  }>;
  plannerPreview: Readonly<{
    imageAlt: string;
  }>;
  whatIs: Readonly<{
    heading: string;
    imageAlt: string;
    description: string;
    items: readonly [HomepageWhatIsItem, HomepageWhatIsItem, HomepageWhatIsItem];
  }>;
  caseStudiesHeading: string;
  caseStudiesDescription: string;
  caseStudies: readonly [
    HomepageCaseStudyGroup,
    HomepageCaseStudyGroup,
    HomepageCaseStudyGroup,
  ];
  featureIntroduction: Readonly<{
    heading: string;
    description: string;
    items: readonly HomepageFeatureIntroductionItem[];
  }>;
  features: Readonly<{
    heading: string;
    previousLabel: string;
    nextLabel: string;
    testimonials: readonly [
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
    ];
  }>;
  whyChoose: Readonly<{
    heading: string;
    previousLabel: string;
    nextLabel: string;
    testimonials: readonly [
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
    ];
  }>;
  howTo: Readonly<{
    heading: string;
    description: string;
    steps: readonly [HomepageHowToStep, HomepageHowToStep, HomepageHowToStep];
  }>;
  toolComparison: Readonly<{
    heading: string;
    description: string;
    tableLabel: string;
    dimensionHeading: string;
    columns: readonly [
      Readonly<{ name: string; href: string }>,
      Readonly<{ name: string; href: string }>,
      Readonly<{ name: string; href: string }>,
    ];
    rows: readonly Readonly<{
      dimension: string;
      cells: readonly [string, string, string];
    }>[];
  }>;
  closingCta: Readonly<{
    heading: string;
    supportLine: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    heading: string;
    description: string;
    items: readonly [
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
    ];
  }>;
  footer: SiteFooterCopy;
}>;

export const homepageCopyByLocale: Readonly<Record<HomepageDisplayLocale, HomepageCopy>> = {
  en: {
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "Farm examples",
      faqLabel: "FAQ",
      blogLabel: "Blog",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    hero: {
      headlineBefore: "Stardew Valley ",
      headlineEmphasis: "Planner",
      headlineAfter: "Free Online Farm Layout Tool",
      supportingCopy:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      primaryActionLabel: "Start planning",
      trustedBy: "Free fan-made planner. Save locally or sync selected projects.",
      fanImages: [
        {
          src: "/homepage/hero/spring-crops.webp",
          alt: "Pixel-art farm with purple houses, crop fields, trees, and a winding river",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "Pixel-art Standard Farm with a red farmhouse, crop fields, barns, trees, and ponds",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "Pixel-art island farm with red-roof buildings, crop fields, trees, and surrounding water",
        },
      ],
    },
    plannerPreview: {
      imageAlt:
        "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
    },
    whatIs: {
      heading: "What is Stardew Valley Planner?",
      imageAlt: "Stardew Valley farm layout with buildings, crop fields, paths, and ponds in autumn",
      description:
        "Stardew Valley Planner is a free online farm layout tool. Preview and adjust your layout on a map before building in-game, so you can decide how to use the space and work from a clear plan.",
      items: [
        {
          title: "Planning features",
          description:
            "Choose from all eight farm types, including Standard, Forest, Beach, and Meadowlands, plus Ginger Island. Place buildings, crops, trees, paths, and decorations; display sprinkler and scarecrow coverage; preview each season; save projects in this browser; and export layout screenshots.",
        },
        {
          title: "When it is useful",
          description:
            "Before starting a farm, decide where fields, barns, and paths will go. When expanding or rearranging, try positions for the greenhouse, coops, and processing areas while leaving routes between buildings. For a redesign, experiment with paths, trees, and garden spaces.",
        },
        {
          title: "Who can use it",
          description:
            "New players planning their first farm, experienced players expanding or reorganizing, and anyone who enjoys designing paths, gardens, and farm scenery.",
        },
      ],
    },
    caseStudiesHeading: "Stardew Valley Planner Examples",
    caseStudiesDescription:
      "Explore 12 farm layouts across different maps. Get ideas for arranging fields, buildings, fish ponds, and paths when starting a farm, reorganizing its zones, or designing a garden.",
    caseStudies: [
      {
        id: "farm-cases",
        heading: "Standard Farm Layouts",
        imagePosition: "left",
        previousLabel: "Previous case",
        nextLabel: "Next case",
        testimonials: [
          {
            name: "Obelisks & Clock Garden",
            designation: "Standard Farm",
            quote:
              "Four obelisks mark the left and center-left, while paths split the crop beds around a central clock garden. A large pond anchors the lower middle, with four fish ponds and another garden on the right.",
            src: "/homepage/cases/farm-case-01.webp",
            alt: "Standard Farm layout with obelisks on the left, crop beds around a central clock garden, and ponds below and to the right",
          },
          {
            name: "Clockside Crop Grid",
            designation: "Standard Farm",
            quote:
              "A Gold Clock and flowering-tree rows divide the crop beds into four bands. Four fish ponds sit at the lower left, while the animal yard and barns occupy the right side.",
            src: "/homepage/cases/farm-case-02.webp",
            alt: "Standard Farm with four crop bands around a Gold Clock, fish ponds at lower left, and barns along the right",
          },
          {
            name: "Big Sheds & Melon Fields",
            designation: "Standard Farm",
            quote:
              "Four Big Sheds sit above a three-by-three fish-pond block, with obelisks and paired barns near the center. A straight path separates these areas from the right-side crop fields, where giant melons stand out.",
            src: "/homepage/cases/farm-case-03.webp",
            alt: "Standard Farm with four Big Sheds above nine fish ponds, central obelisks and barns, and giant melons among right-side crops",
          },
          {
            name: "Moonfall's Melon Fields",
            designation: "Standard Farm · Summer",
            quote:
              "Big Sheds and silos line the upper-left, while fish ponds border the melon fields. An orchard fills the lower-left, with bee houses beside the farm pond and an animal yard at the lower-right.",
            src: "/homepage/cases/farm-case-04.webp",
            alt: "Summer Standard Farm with a Big Shed block, silos, fish ponds, melon fields, lower-left orchard, and lower-right animal yard",
          },
        ],
      },
      {
        id: "farm-cases-2",
        heading: "Garden Zones Across Farm Maps",
        imagePosition: "right",
        previousLabel: "Previous case",
        nextLabel: "Next case",
        testimonials: [
          {
            name: "Ten-Year Farm & Clock Garden",
            designation: "Standard Farm · Fall",
            quote:
              "An obelisk garden and Gold Clock sit in the northwest, with crop plots spreading through the center and west. Ponds and sheds frame the plots, while the workshop and animal area fill the east.",
            src: "/homepage/cases/farm-case-05.webp",
            alt: "Fall Standard Farm with an obelisk garden and clock in the northwest, crop plots across the center, and a workshop and animal area in the east",
          },
          {
            name: "Crossroads on the Forest Farm",
            designation: "Forest Farm · Spring",
            quote:
              "North-south and crosswise paths meet around the central pond, with a greenhouse and farmhouse at the upper corners. A fenced tree grove and bee-house cluster fill the upper middle; fish ponds sit to the east and an animal yard to the southwest.",
            src: "/homepage/cases/farm-case-06.webp",
            alt: "Forest Farm with crossing paths around a central pond, a fenced grove and bee houses above, fish ponds east, and an animal yard southwest",
          },
          {
            name: "Meadowlands Clock & Barn Row",
            designation: "Meadowlands · Spring",
            quote:
              "Four Big Sheds surround the central Gold Clock, while a large crop field and a row of barns occupy the east. Fenced garden pockets, bee houses, a Mill, and cabins spread across the west and lower-left.",
            src: "/homepage/cases/farm-case-07.webp",
            alt: "Spring Meadowlands Farm with four Big Sheds around a central clock, eastern crop fields and barns, and western garden pockets",
          },
          {
            name: "Four Corners Clock Garden",
            designation: "Four Corners Farm · Spring",
            quote:
              "The farmhouse and crop plots occupy the northeast, opposite the greenhouse and animal yard in the northwest. A clock-centered garden divides the map, with ponds to the southwest and an orchard and apiary in the southeast.",
            src: "/homepage/cases/farm-case-08.webp",
            alt: "Spring Four Corners Farm with a farmhouse and crops in the northeast, greenhouse and animal yard in the northwest, and distinct southern zones",
          },
        ],
      },
      {
        id: "farm-cases-3",
        heading: "Layouts Shaped by Terrain",
        imagePosition: "left",
        previousLabel: "Previous case",
        nextLabel: "Next case",
        testimonials: [
          {
            name: "Four Corners Crop & Pond Zones",
            designation: "Four Corners Farm",
            quote:
              "Five silos span the north above broad crop beds, while the greenhouse, clock, and obelisks form a central landmark cluster. A three-by-three fish-pond block and Slime Hutch sit southwest; orchard and utility areas occupy the southeast.",
            src: "/homepage/cases/farm-case-09.webp",
            alt: "Four Corners Farm with five northern silos, broad crop beds, a central greenhouse and landmark cluster, and a southwest pond block",
          },
          {
            name: "Hilltop Terraces",
            designation: "Hilltop Farm",
            quote:
              "A wheat plot rests below the northern cliff, with the farmhouse and nearby buildings on the upper-right shelf. Separate crop beds follow the middle terraces; a streamside greenhouse and lower-left orchard lead toward the mill and animal buildings below.",
            src: "/homepage/cases/farm-case-10.webp",
            alt: "Hilltop Farm with wheat below the northern cliff, buildings on the upper-right shelf, terrace crop beds, and a greenhouse beside the stream",
          },
          {
            name: "Beach Farm Fish-Pond Shore",
            designation: "Beach Farm · Fall",
            quote:
              "Eleven fish ponds form a single row across the central beach below the north-shore buildings. Crop plots and giant crops fill the southwest, while fenced animal yards and a Slime Hutch sit in the southeast.",
            src: "/homepage/cases/farm-case-11.webp",
            alt: "Fall Beach Farm with a row of eleven fish ponds across the central beach, crops to the southwest, and animal yards to the southeast",
          },
          {
            name: "Riverland Island Plots",
            designation: "Riverland Farm · Summer",
            quote:
              "Crop plots occupy several separate islands, with the greenhouse on the west shore and farm buildings across the northern islands. A Big Barn and cabin anchor the southern island, while a fish pond sits on the east.",
            src: "/homepage/cases/farm-case-12.webp",
            alt: "Summer Riverland Farm with crop plots on separate islands, a west-shore greenhouse, northern farm buildings, and an eastern fish pond",
          },
        ],
      },
    ],
    featureIntroduction: {
      heading: "Plan Your Farm Layout",
      description:
        "Try out your farm layout on the overhead map before building in-game. Compare seasonal views and coverage, then save a project or export an image to guide future changes.",
      items: [
        {
          icon: "map",
          title: "Choose a farm map",
          description:
            "Choose among eight farm maps—Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, or Meadowlands—or choose Ginger Island. Match the map to your game and shape the layout around its terrain.",
        },
        {
          icon: "layout",
          title: "Place and edit your layout",
          description:
            "Place buildings, crops, trees, paths, and decorations, then move selected items as plans change. Fill rectangular areas with supported items, erase an area, or undo and redo edits to refine each zone.",
        },
        {
          icon: "coverage",
          title: "Check coverage ranges",
          description:
            "Show sprinkler, scarecrow, Bee House, and Junimo Hut ranges on the map. Check how crop areas line up with nearby facilities as you plan where fields and farm areas should go.",
        },
        {
          icon: "seasons",
          title: "Preview four seasons",
          description:
            "Switch between spring, summer, fall, and winter to preview the map in each season. See the seasonal landscape while arranging paths, trees, and garden areas.",
        },
        {
          icon: "projects",
          title: "Save and transfer projects",
          description:
            "Projects are saved in this browser, so you can reopen a plan later. Export JSON to keep a separate project file, or import an existing JSON project to continue from it.",
        },
        {
          icon: "export",
          title: "Export layout screenshots",
          description:
            "Export the current layout as a PNG at 1× or 2× resolution. Keep the image with your design notes or use it as a visual reference while building in-game.",
        },
      ],
    },
    features: {
      heading: "Meadowlands Farm Layout Examples",
      previousLabel: "Previous example",
      nextLabel: "Next example",
      testimonials: [
        {
          quote:
            "Autumn colors run through a dense mix of crop rows, paths, ponds, and farm buildings.",
          name: "Meadowlands Farm in Fall",
          designation: "Meadowlands · Fall",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in fall",
        },
        {
          quote:
            "Spring trees and decorations surround crop plots, ponds, paths, and farm buildings.",
          name: "Spring Colors Across Meadowlands",
          designation: "Meadowlands · Spring",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in spring",
        },
        {
          quote:
            "Fields, trees, ponds, and farm buildings share the map in a bright summer palette.",
          name: "Summer Fields Around the Ponds",
          designation: "Meadowlands · Summer",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in summer",
        },
        {
          quote:
            "A forested map brings paths, crop plots, ponds, buildings, and decorative areas together.",
          name: "Modded Meadowlands Overview",
          designation: "Modded Meadowlands",
          src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          imageAlt: "Pixel-art modded Meadowlands farm overview layout",
        },
        {
          quote:
            "This vanilla Year 7 layout places crop plots, buildings, paths, and ponds across Meadowlands.",
          name: "Vanilla Meadowlands in Year 7",
          designation: "Vanilla Meadowlands · Year 7",
          src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
          imageAlt: "Pixel-art vanilla Meadowlands farm layout in year 7",
        },
      ],
    },
    whyChoose: {
      heading: "Beach & Four Corners Farm Layout Examples",
      previousLabel: "Previous example",
      nextLabel: "Next example",
      testimonials: [
        {
          quote:
            "Flowering trees, small garden plots, and paths give this coastal layout a garden-like feel.",
          name: "Decorative Beach Farm",
          designation: "machooo · Year 15",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "Decorative Beach farm layout by machooo, year 15",
        },
        {
          quote:
            "Paths and crop plots form a diamond pattern around the farm buildings.",
          name: "Diamond-Path Beach Farm",
          designation: "jennameeps · Beach Farm",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "Geometric diamond Beach farm layout by jennameeps",
        },
        {
          quote:
            "Stone paths connect the fields and buildings while tracing the coastal map.",
          name: "Beach Farm with Stone Paths",
          designation: "justkuwl · Beach Farm",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "Organized Beach farm with stone paths by justkuwl",
        },
        {
          quote:
            "Rows of processing machines sit among paths, crop plots, and farm buildings.",
          name: "Beach Farm with a Processing Yard",
          designation: "shady kegyard · Beach Farm",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "Processing-focused Beach farm layout by shady kegyard",
        },
        {
          quote:
            "Paths, crop plots, trees, and buildings occupy separate areas across the map.",
          name: "Balanced Four Corners Farm",
          designation: "rp2-phobos · Four Corners Farm",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "Balanced Four Corners farm layout by rp2-phobos",
        },
        {
          quote:
            "Crop plots, farm buildings, paths, and water share this map in a balanced layout.",
          name: "Four Corners Farm with Balanced Zones",
          designation: "emerald · Four Corners Farm",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "Balanced Four Corners farm layout by emerald",
        },
        {
          quote:
            "Rows of coops and crop fields fill the map alongside paths and work areas.",
          name: "Coops and Crops on Four Corners",
          designation: "hallofax · Year 5",
          src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
          imageAlt: "Coop-focused Four Corners farm layout by hallofax, year 5",
        },
      ],
    },
    howTo: {
      heading: "Lay out the farm in three passes",
      description:
        "Pin the tiles that never move. Reserve work zones, then place barns, coops, sheds, and fields. Walk one ordinary day's route last, and fix blocked paths on this grid.",
      steps: [
        {
          title: "Pin the tiles that never move",
          description:
            "Pick the farm map you actually play. Water, cliffs, bridges, and exits stay put. Use the farmhouse and shipping bin as route anchors, and leave the ground around them open.",
          benefits: [
            "Ponds, rivers, and cliffs will not shift later.",
            "Bridges and exits stay put, so keep those paths open.",
            "The farmhouse and shipping bin pin the day's start and end.",
          ],
        },
        {
          title: "Zone the work, then drop the large pieces",
          description:
            "Give crops, animals, trees, storage, and processing their own areas. Draw wide boundaries first. Then place barns, coops, sheds, and fields. Decor comes last.",
          benefits: [
            "Crops, animals, trees, storage, and processing each get a block.",
            "Barns, coops, sheds, and fields set the scale of the map.",
            "Leave room at each entrance and in front of the buildings.",
          ],
        },
        {
          title: "Walk the day's chores on this grid",
          description:
            "Start at the farmhouse, then fields, animals, chests, and the shipping bin. If a path is blocked, change the plan here instead of rebuilding in-game.",
          benefits: [
            "Farmhouse → fields → animals → chests → shipping bin.",
            "A blocked tile is cheaper to move here than in-game.",
          ],
        },
      ],
    },
    toolComparison: {
      heading: "Stardew Valley Planner vs StardewPlan vs Stardew Planner V3",
      description:
        "Plan your farm for free with an interface that is easy to use. Clear controls bring project management, JSON backup and 1× / 2× PNG export together, with English and Chinese support.",
      tableLabel: "Tool comparison",
      dimensionHeading: "Feature",
      columns: [
        {
          name: "Stardew Valley Planner",
          href: "#planner",
        },
        {
          name: "StardewPlan",
          href: "https://stardewplan.com/",
        },
        {
          name: "Stardew Planner V3",
          href: "https://v3.stardew.info/planner/",
        },
      ],
      rows: [
        {
          dimension: "Pricing",
          cells: [
            "Planning, local saves, JSON backups and 1× / 2× PNG export are all free, with no paid membership tier.",
            "All planner features are free; unlimited account syncing is a supporter benefit.",
            "Basic planning is free; Patreon membership offers ad removal.",
          ],
        },
        {
          dimension: "Ease of use",
          cells: [
            "Clear labels and grouped controls: browse or search items; project management, JSON backups and PNG export share one save window.",
            "A toolbar and categorized item list; Library manages plans, while the plan menu provides sharing and screenshots.",
            "Top category menus and icon tools, with additional controls in the options and right-click menus.",
          ],
        },
        {
          dimension: "Saving multiple plans",
          cells: [
            "Save multiple plans without fixed slots or a set plan limit; capacity depends on browser storage.",
            "Use without an account and save on-device; free accounts can sync 5 plans, and supporters can sync unlimited plans.",
            "Each save gets a unique URL; plan history is listed as a Patreon supporter benefit.",
          ],
        },
        {
          dimension: "English and Chinese interface",
          cells: [
            "Switch planning and saving screens between English and Chinese.",
            "English interface; Chinese support has not been confirmed.",
            "Supports English and Simplified Chinese among its interface languages.",
          ],
        },
        {
          dimension: "Project file backup",
          cells: [
            "Export or import one project as JSON, including all its maps, for backup or migration.",
            "Export a plan as farm-plan.json.",
            "Save and share a plan with its unique URL.",
          ],
        },
        {
          dimension: "PNG export",
          cells: [
            "Download 1× standard or 2× high-quality PNG screenshots for sharing or in-game building reference.",
            "Download a PNG screenshot using Screenshot.",
            "Export a farm plan as a PNG image.",
          ],
        },
      ],
    },
    closingCta: {
      heading: "Finish the layout on this page, then build in-game.",
      supportLine: "Plan without an account; sign in to sync projects you choose.",
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Frequently Asked Questions",
      description:
        "Where your plan is stored, which farms you can use, and what you can export.",
      items: [
        {
          question: "Will I lose my work?",
          answer:
            "Projects stay in this browser unless you choose to sync them. Sign in to access synced layout data on another device; map preview images stay on this device.",
        },
        {
          question: "Is my farm type here?",
          answer:
            "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, Meadowlands, plus Ginger Island.",
        },
        {
          question: "Can I see seasons and coverage?",
          answer:
            "Spring, summer, fall, and winter. Sprinkler, scarecrow, Bee House, and Junimo Hut coverage can be turned on.",
        },
        {
          question: "Can I import a save?",
          answer: "Yes, but it is experimental. Modded items may not map.",
        },
        {
          question: "Can I export a screenshot?",
          answer: "Yes. Standard and high-quality downloads.",
        },
      ],
    },
    footer: {
      brandName: "Stardew Valley Farm Planner",
      description:
        "A browser-based fan-made farm planner with local projects and optional cloud sync for selected layouts.",
      copyright: "© Stardew Valley Farm Planner",
      planner: {
        title: "Planner",
        home: "Planner",
      },
      explore: {
        title: "Explore",
        capabilities: "Farm examples",
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
  },
  "zh-CN": {
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "案例展示",
      faqLabel: "常见问题",
      blogLabel: "博客",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    hero: {
      headlineBefore: "星露谷物语",
      headlineEmphasis: "规划器",
      headlineAfter: "免费在线农场布局工具",
      supportingCopy:
        "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
      primaryActionLabel: "开始规划",
      trustedBy: "免费玩家规划器。可本地保存，也可同步所选项目。",
      fanImages: [
        {
          src: "/homepage/hero/spring-crops.webp",
          alt: "像素风农场：紫色房屋、作物田、树木和蜿蜒河道",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "像素风标准农场：红色农舍、作物田、畜棚、树木和水塘",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "像素风水上岛屿农场：红色屋顶建筑、作物田、树木和环绕水域",
        },
      ],
    },
    plannerPreview: {
      imageAlt: "像素风标准农场地图，中央是空地，含农舍、温室和两处水塘",
    },
    whatIs: {
      heading: "什么是星露谷物语农场规划器？",
      imageAlt: "星露谷物语秋季农场布局：建筑、农田、道路和水塘分布在地图上",
      description:
        "星露谷物语农场规划器是一款免费的在线布局设计工具，帮助你在游戏内动工前确定农场方案。通过俯视地图预览整体布局，调整各个区域的位置，让后续建造有清晰的参考。",
      items: [
        {
          title: "主要功能",
          description:
            "支持标准、森林、海滩、草原等 8 种农场和姜岛地图，可以摆放建筑、作物、树木、道路与装饰，查看洒水器和稻草人的覆盖范围。你也可以切换四季外观，将规划项目保存在当前浏览器，并导出布局截图。",
        },
        {
          title: "使用场景",
          description:
            "开新农场时，先决定农田、畜棚和道路的位置；扩建或重排现有农场时，试摆温室、鸡舍和加工区，给建筑之间的通路留出空间；准备重新装饰时，先尝试道路、树木和庭院的不同组合。",
        },
        {
          title: "适用人群",
          description:
            "适合第一次规划农场的新手、准备扩建或重新分区的老玩家，以及喜欢设计道路、庭院和农场景观的玩家。",
        },
      ],
    },
    caseStudiesHeading: "星露谷物语农场规划案例",
    caseStudiesDescription:
      "浏览 12 个不同地图的农场布局，参考田地、建筑、鱼塘与道路的分区方式，为新农场规划、现有布局调整和庭院设计寻找灵感。",
    caseStudies: [
      {
        id: "farm-cases",
        heading: "标准农场布局",
        imagePosition: "left",
        previousLabel: "上一个案例",
        nextLabel: "下一个案例",
        testimonials: [
          {
            name: "方尖碑与时钟花园",
            designation: "标准农场",
            quote:
              "四座方尖碑分布在左侧与中左区域，道路把中央时钟花园周围的田块分隔开。大水塘位于下方中央，右侧还有四个鱼塘和一处花园。",
            src: "/homepage/cases/farm-case-01.webp",
            alt: "标准农场布局：方尖碑位于左侧，田块围绕中央时钟花园分布，水塘在下方和右侧",
          },
          {
            name: "时钟旁的田块网格",
            designation: "标准农场",
            quote:
              "黄金时钟和成排的开花树把田块分成四个区域。四个鱼塘位于左下方，畜棚与围栏草地则集中在右侧。",
            src: "/homepage/cases/farm-case-02.webp",
            alt: "标准农场布局：黄金时钟周围分布四片田地，左下有鱼塘，右侧有畜棚",
          },
          {
            name: "大型棚屋与甜瓜田",
            designation: "标准农场",
            quote:
              "四座大型棚屋排在左上方，下方是九个鱼塘组成的方阵；方尖碑和两座畜棚位于中部。直路把这些区域与右侧田地分开，巨型甜瓜点缀在作物区中。",
            src: "/homepage/cases/farm-case-03.webp",
            alt: "标准农场布局：左上四座大型棚屋和九个鱼塘，中部有方尖碑与畜棚，右侧田地种有巨型甜瓜",
          },
          {
            name: "Moonfall 甜瓜田",
            designation: "标准农场 · 夏季",
            quote:
              "大型棚屋和筒仓排列在左上，鱼塘沿甜瓜田分布。果树园位于左下，蜂房靠近农场水塘，右下则是围栏畜牧区。",
            src: "/homepage/cases/farm-case-04.webp",
            alt: "夏季标准农场：左上方大型棚屋与筒仓、鱼塘旁的甜瓜田、左下果树园和右下畜牧区",
          },
        ],
      },
      {
        id: "farm-cases-2",
        heading: "不同农场地图的庭院分区",
        imagePosition: "right",
        previousLabel: "上一个案例",
        nextLabel: "下一个案例",
        testimonials: [
          {
            name: "十年农场与时钟花园",
            designation: "标准农场 · 秋季",
            quote:
              "方尖碑花园和黄金时钟位于西北，田地铺展在中央与西侧。水塘和大型棚屋围着田区分布，东侧则安排了加工区和畜牧区。",
            src: "/homepage/cases/farm-case-05.webp",
            alt: "秋季标准农场：西北方尖碑花园和黄金时钟、中央田地，以及东侧加工与畜牧区",
          },
          {
            name: "森林农场的十字路口",
            designation: "森林农场 · 春季",
            quote:
              "南北道路与横向小路在中央水塘周围交汇，温室和农舍分处上方两角。围栏树园和蜂房群在上方中部，鱼塘位于东侧，畜牧区在西南。",
            src: "/homepage/cases/farm-case-06.webp",
            alt: "森林农场布局：道路围绕中央水塘交汇，上方有围栏树园和蜂房，东侧有鱼塘，西南有畜牧区",
          },
          {
            name: "中央时钟与东侧畜棚",
            designation: "草原农场 · 春季",
            quote:
              "四座大型棚屋围绕中央黄金时钟排列，大块田地和一排畜棚占据东侧。西侧与左下方分布着围栏花圃、蜂房、磨坊和小屋。",
            src: "/homepage/cases/farm-case-07.webp",
            alt: "春季草原农场：中央四座大型棚屋围绕时钟，东侧田地与畜棚成排，西侧分布花圃",
          },
          {
            name: "四角农场时钟花园",
            designation: "四角农场 · 春季",
            quote:
              "农舍和田地位于东北，温室与畜牧区在西北。中央花园围绕时钟展开，鱼塘在西南，果树园和蜂房区在东南。",
            src: "/homepage/cases/farm-case-08.webp",
            alt: "春季四角农场：东北农舍与田地、西北温室与畜牧区、中央时钟花园及南侧分区",
          },
        ],
      },
      {
        id: "farm-cases-3",
        heading: "顺应地形的农场布局",
        imagePosition: "left",
        previousLabel: "上一个案例",
        nextLabel: "下一个案例",
        testimonials: [
          {
            name: "四角农场田区与鱼塘",
            designation: "四角农场",
            quote:
              "五个筒仓沿北侧排开，宽阔田地位于其下；温室、黄金时钟和方尖碑组成中央地标区。九个鱼塘与史莱姆屋在西南，东南则是果树园和工具区。",
            src: "/homepage/cases/farm-case-09.webp",
            alt: "四角农场布局：北侧五个筒仓与宽阔田地，中央温室地标区，西南鱼塘方阵",
          },
          {
            name: "山顶农场阶地",
            designation: "山顶农场",
            quote:
              "麦田位于北侧悬崖下，农舍和邻近建筑在东北高台。田块沿中部阶地分开，溪边有温室，左下是果树园，磨坊和畜舍则在下方。",
            src: "/homepage/cases/farm-case-10.webp",
            alt: "山顶农场布局：北侧悬崖下有麦田，东北高台有建筑，中部阶地分布田地，溪边设温室",
          },
          {
            name: "海滩农场鱼塘海岸",
            designation: "海滩农场 · 秋季",
            quote:
              "十一座鱼塘排成一列横贯中央海滩，北岸分布着农场建筑。西南有田地和巨型作物，东南则安排了围栏畜牧区与史莱姆屋。",
            src: "/homepage/cases/farm-case-11.webp",
            alt: "秋季海滩农场：中央海滩排列十一座鱼塘，西南有田地，东南有畜牧区",
          },
          {
            name: "河流农场岛屿田区",
            designation: "河流农场 · 夏季",
            quote:
              "作物田分布在数座岛屿上，温室靠西岸，农场建筑散布在北侧岛屿。大畜棚和小屋位于南侧岛屿，鱼塘则在东边。",
            src: "/homepage/cases/farm-case-12.webp",
            alt: "夏季河流农场：多座岛屿分布作物田，西岸有温室，北部有农场建筑，东侧有鱼塘",
          },
        ],
      },
    ],
    featureIntroduction: {
      heading: "规划你的农场布局",
      description:
        "进游戏建造前，先在俯视地图上试排整体布局。对比四季外观和设施覆盖，再保存项目或导出图片，方便后续调整。",
      items: [
        {
          icon: "map",
          title: "选择农场地图",
          description:
            "可从标准、河流、森林、山顶、荒野、四角、海滩和草原八种农场地图中选择，也可规划姜岛。选定正在游玩的地图后，可按地形安排各个区域。",
        },
        {
          icon: "layout",
          title: "摆放和调整布局",
          description:
            "在地图上摆放建筑、作物、树木、道路和装饰，选中后即可移动位置。支持填充的物品可以在矩形区域批量铺放，还可擦除区域、撤销或重做修改，逐步调整农场分区。",
        },
        {
          icon: "coverage",
          title: "查看覆盖范围",
          description:
            "可在地图上显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。布置田地与设施时，查看作物区域是否落在对应范围内，再据此调整位置。",
        },
        {
          icon: "seasons",
          title: "预览四季外观",
          description:
            "切换春、夏、秋、冬，预览地图在不同季节的外观。规划道路、树木和庭院时，可先查看季节变化下的场景，再决定布局是否合适。",
        },
        {
          icon: "projects",
          title: "保存和导入导出项目",
          description:
            "项目保存在当前浏览器，之后可以重新打开继续规划。需要留存或转移文件时，可导出 JSON；也可导入已有 JSON 项目，接着调整布局。",
        },
        {
          icon: "export",
          title: "导出布局截图",
          description:
            "可将当前布局导出为 PNG 图片，选择 1 倍或 2 倍分辨率。保存截图作为规划记录，也可在游戏内建造时对照布局。",
        },
      ],
    },
    features: {
      heading: "草原农场布局案例",
      previousLabel: "上一个案例",
      nextLabel: "下一个案例",
      testimonials: [
        {
          quote:
            "秋色铺满草原农场，田地、道路、水塘和建筑分布在各处。",
          name: "草原农场秋季布局",
          designation: "草原农场 · 秋季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          imageAlt: "像素风草原农场棱镜风格秋季布局",
        },
        {
          quote:
            "春色树木和装饰围绕着田地、水塘、道路与农场建筑。",
          name: "草原农场春日景色",
          designation: "草原农场 · 春季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          imageAlt: "像素风草原农场棱镜风格春季布局",
        },
        {
          quote:
            "田地、树木、水塘和农场建筑铺在明亮的夏日配色中。",
          name: "水塘边的夏日田地",
          designation: "草原农场 · 夏季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          imageAlt: "像素风草原农场棱镜风格夏季布局",
        },
        {
          quote:
            "这张林木茂密的地图里，田地、水塘、建筑、道路和装饰区交错分布。",
          name: "模组草原农场总览",
          designation: "模组草原农场",
          src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          imageAlt: "像素风模组草原农场总览布局",
        },
        {
          quote:
            "这张原版第 7 年农场把田地、建筑、道路和水塘分布在草原农场各处。",
          name: "原版草原农场：第 7 年",
          designation: "原版草原农场 · 第 7 年",
          src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
          imageAlt: "像素风原版草原农场第 7 年布局",
        },
      ],
    },
    whyChoose: {
      heading: "海滩与四角农场布局案例",
      previousLabel: "上一个案例",
      nextLabel: "下一个案例",
      testimonials: [
        {
          quote:
            "开花树木、小块花园和道路让这张海岸布局显得像一座花园。",
          name: "装饰风格的海滩农场",
          designation: "machooo · 第 15 年",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "machooo 的海滩农场装饰向布局，第 15 年",
        },
        {
          quote:
            "道路和田地围绕农场建筑排成菱形图案。",
          name: "菱形道路海滩农场",
          designation: "jennameeps · 海滩农场",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "jennameeps 的海滩农场几何菱形布局",
        },
        {
          quote:
            "石路把田地和建筑连在一起，并沿着海岸地图延伸。",
          name: "石路整理的海滩农场",
          designation: "justkuwl · 海滩农场",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "justkuwl 用石路整理过的海滩农场",
        },
        {
          quote:
            "成排的加工设备位于农场中央，周围分布道路、田地和建筑。",
          name: "海滩农场加工区布局",
          designation: "shady kegyard · 海滩农场",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "shady kegyard 以加工区为主的海滩农场布局",
        },
        {
          quote:
            "道路、田地、树木和建筑分布在地图的不同区域。",
          name: "分区均衡的四角农场",
          designation: "rp2-phobos · 四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "rp2-phobos 的均衡四角农场布局",
        },
        {
          quote:
            "田地、农场建筑、道路和水塘构成一张分布均衡的农场布局。",
          name: "均衡布局的四角农场",
          designation: "emerald · 四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "emerald 的均衡四角农场完美布局",
        },
        {
          quote:
            "多排鸡舍与作物田分布在地图各处，并由道路和工作区连接。",
          name: "四角农场的鸡舍与田地",
          designation: "hallofax · 第 5 年",
          src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
          imageAlt: "hallofax 以鸡舍为主的四角农场布局，第 5 年",
        },
      ],
    },
    howTo: {
      heading: "分三步排出农场",
      description:
        "先标不会动的地，再分区放大件，最后按一天的活走一遍。堵住了就改这张图，别等进游戏再建。",
      steps: [
        {
          title: "先标出不会动的地",
          description:
            "选你正在玩的那张农场。水、悬崖、桥和出口不会挪。农舍和出货箱当路线锚点，周围先别填满。",
          benefits: [
            "池塘、河流、悬崖后面改不了。",
            "桥和出口决定你每天怎么进出。",
            "农舍和出货箱钉死一天的起点和终点。",
          ],
        },
        {
          title: "先分区，再放大件",
          description:
            "作物、动物、树木、储存、加工先各留一块，边界画宽一点。再放畜棚、鸡舍、棚屋和田地。小装饰最后填。",
          benefits: [
            "作物、动物、树木、储存、加工各占一块。",
            "畜棚、鸡舍、棚屋、田地决定整张图的尺度。",
            "入口和建筑正前方先留出路。",
          ],
        },
        {
          title: "按一天的活把路走通",
          description:
            "从农舍出发，再到田地、动物区、箱子、出货箱。哪条路堵住了，就改这张图，别等游戏里拆。",
          benefits: [
            "农舍 → 田地 → 动物 → 箱子 → 出货箱。",
            "格子上挪一块，比进游戏拆重建便宜。",
          ],
        },
      ],
    },
    toolComparison: {
      heading: "Stardew Valley Planner vs StardewPlan vs Stardew Planner V3",
      description:
        "免费使用，轻松上手。清晰的操作标签与分组面板，让方案管理、JSON 备份和 1× / 2× PNG 导出更直观；支持中英文操作。",
      tableLabel: "工具对比",
      dimensionHeading: "对比项目",
      columns: [
        {
          name: "Stardew Valley Planner",
          href: "#planner",
        },
        {
          name: "StardewPlan",
          href: "https://stardewplan.com/",
        },
        {
          name: "Stardew Planner V3",
          href: "https://v3.stardew.info/planner/",
        },
      ],
      rows: [
        {
          dimension: "使用费用",
          cells: [
            "规划、本地保存、JSON 备份和 1× / 2× PNG 导出全部免费，无付费会员档位。",
            "规划功能免费；无限方案同步为支持者权益。",
            "基础规划免费；Patreon 会员可去除广告。",
          ],
        },
        {
          dimension: "上手与操作",
          cells: [
            "操作标签清晰、功能分组直观：按分类或搜索找物品，方案管理、JSON 备份与 PNG 导出在同一保存窗口中分区展示。",
            "工具栏配合分类物品栏；Library 管理方案，方案菜单提供分享和截图。",
            "顶部分类菜单与图标工具，更多操作通过选项菜单和右键菜单进入。",
          ],
        },
        {
          dimension: "多方案保存",
          cells: [
            "本地保存多个方案，不设固定槽位或数量配额；容量受浏览器存储空间限制。",
            "可无账户使用并保存在设备；免费账户可同步 5 个方案，支持者可无限同步。",
            "每次保存生成独立链接；方案历史标注为 Patreon 支持者权益。",
          ],
        },
        {
          dimension: "中英文操作",
          cells: [
            "规划与保存界面均可切换中英文，可用熟悉的语言操作。",
            "英文界面；中文支持尚未核实。",
            "支持英语、简体中文等界面语言。",
          ],
        },
        {
          dimension: "方案文件备份",
          cells: [
            "单个项目（含其全部地图）可导入或导出 JSON，方便备份、继续编辑或手动迁移。",
            "可将方案导出为 farm-plan.json 文件。",
            "通过独立链接保存与分享方案。",
          ],
        },
        {
          dimension: "PNG 导出",
          cells: [
            "可下载标准 1× 或高清 2× PNG 截图，用于分享或进游戏建造参考。",
            "可通过 Screenshot 下载 PNG 截图。",
            "可将农场方案导出为 PNG 图片。",
          ],
        },
      ],
    },
    closingCta: {
      heading: "先在这页摆完，再进游戏建。",
      supportLine: "不用登录也能规划；登录后可同步你选择的项目。",
    },
    faq: {
      eyebrow: "FAQ",
      heading: "常见问题",
      description: "方案存在哪、农场有哪些、能导出什么。",
      items: [
        {
          question: "会丢吗？",
          answer:
            "项目默认保存在当前浏览器；你可以登录后选择同步项目，在其他设备访问布局数据。地图预览图片仍保留在此设备上。",
        },
        {
          question: "我玩的农场有吗？",
          answer: "标准、河流、森林、山顶、荒野、四角、海滩、草原，加上姜岛。",
        },
        {
          question: "四季和覆盖能看吗？",
          answer:
            "春夏秋冬都能切。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以打开。",
        },
        {
          question: "能导存档吗？",
          answer: "能，但是实验功能。模组物品可能对不上。",
        },
        {
          question: "能导出图吗？",
          answer: "能。普通和高清截图都可以下。",
        },
      ],
    },
    footer: {
      brandName: "星露谷物语农场规划器",
      description: "用于规划《星露谷物语》农场布局的浏览器玩家工具，支持本地项目和可选的所选布局云端同步。",
      copyright: "© 星露谷物语农场规划器",
      planner: {
        title: "规划器",
        home: "规划器",
      },
      explore: {
        title: "探索",
        capabilities: "案例展示",
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
  },
  ja: {
    navigation: {
      productName: "スターデューバレー プランナー",
      capabilitiesLabel: "牧場の例",
      faqLabel: "よくある質問",
      blogLabel: "ブログ",
      plannerActionLabel: "プランナーを開く",
      languageLabel: "言語",
    },
    hero: {
      headlineBefore: "スターデューバレー ",
      headlineEmphasis: "プランナー",
      headlineAfter: "無料で使えるオンラインのスタバレ レイアウト ツール",
      supportingCopy:
        "スターデューバレー プランナーで、ゲーム内で建てる前に牧場を計画できます。スタバレ レイアウト ツールでは、8種類の牧場から選び、建物や作物を配置できます。季節の切り替え、スプリンクラーなどの範囲確認、セーブデータの読み込みにも対応しています。",
      primaryActionLabel: "計画をはじめる",
      trustedBy: "無料で使えるファンメイドのスターデューバレー プランナーです。スタバレ レイアウト ツールの計画は、このブラウザに保存でき、選んだプロジェクトは同期できます。",
      fanImages: [
        {
          src: "/homepage/hero/spring-crops.webp",
          alt: "紫の家、畑、木、曲がりくねった川があるドット絵の牧場",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "赤い牧場の家、畑、家畜小屋、木、池がある、スタンダード牧場のドット絵",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "赤い屋根の建物、畑、木、周囲の水がある、島の牧場のドット絵",
        },
      ],
    },
    plannerPreview: {
      imageAlt:
        "中央に土の空き地があり、牧場の家、温室、池が2つある、スタンダード牧場のドット絵地図",
    },
    whatIs: {
      heading: "スターデューバレー プランナーとは？",
      imageAlt: "建物、畑、道、池が並んだ、秋のスターデューバレーの牧場レイアウト",
      description:
        "スターデューバレー プランナーは、無料のオンラインのスタバレ レイアウト ツールです。ゲーム内で建てる前に地図上でレイアウトをプレビューして調整できるので、土地の使い方を決めてから、はっきりした計画で作業できます。",
      items: [
        {
          title: "計画の機能",
          description:
            "スターデューバレー プランナーでは、スタンダード牧場、フォレスト牧場、ビーチの牧場、メドウランズ牧場を含む8種類の牧場と、ジンジャーアイランドを選べます。スタバレ レイアウト ツールで、建物、作物、木、道、装飾を置き、スプリンクラーとカカシの範囲を表示できます。季節ごとの見た目に切り替え、スターデューバレー プランナーに計画したプロジェクトを保存し、レイアウトのスクリーンショットを書き出せます。",
        },
        {
          title: "使う場面",
          description:
            "スターデューバレー プランナーなら、新しい牧場を始める前に、畑、家畜小屋、道の位置を決められます。拡張や配置換えでは、スタバレ レイアウト ツールで温室、小屋、加工エリアの位置を試し、建物の間の通り道を残せます。模様替えでは、道、木、庭の組み合わせを試せます。",
        },
        {
          title: "使う人",
          description:
            "スターデューバレー プランナーは、初めて牧場を計画する人、拡張や区画の組み替えをする経験者、道や庭、牧場の景色をデザインするのが好きな人に向いています。",
        },
      ],
    },
    caseStudiesHeading: "スターデューバレー プランナーのレイアウト例",
    caseStudiesDescription:
      "スターデューバレー プランナーでは、異なる地図の牧場レイアウトを12件見られます。スタバレ レイアウト ツールで、新しく始めるとき、区画を組み替えるとき、庭をつくるときに、畑、建物、魚のいる池、道の置き方を、スターデューバレー プランナーの例として参考にできます。",
    caseStudies: [
      {
        id: "farm-cases",
        heading: "スタンダード牧場のレイアウト",
        imagePosition: "left",
        previousLabel: "前の事例",
        nextLabel: "次の事例",
        testimonials: [
          {
            name: "オベリスクと金時計の庭",
            designation: "スタンダード牧場",
            quote:
              "オベリスク4基が左側と中左にあり、道が中央の金時計の庭を囲む畑を区切っています。大きな池が下側の中央にあり、右側には魚のいる池が4つと、もう一つの庭があります。",
            src: "/homepage/cases/farm-case-01.webp",
            alt: "左側にオベリスク、中央の金時計の庭を囲む畑、下と右に池があるスタンダード牧場のレイアウト",
          },
          {
            name: "金時計のそばの畑の区切り",
            designation: "スタンダード牧場",
            quote:
              "金時計と、花の咲いた木の列が畑を4つの帯に分けています。魚のいる池4つは左下、家畜エリアと家畜小屋は右側です。",
            src: "/homepage/cases/farm-case-02.webp",
            alt: "金時計のまわりに4つの畑の帯、左下に魚のいる池、右に家畜小屋があるスタンダード牧場",
          },
          {
            name: "ビッグシェッドとメロン畑",
            designation: "スタンダード牧場",
            quote:
              "ビッグシェッド4棟が、3×3に並んだ魚のいる池の上にあります。オベリスクと2棟の家畜小屋は中央付近です。まっすぐな道がこれらの区域と右側の畑を分け、畑では巨大メロンが目立ちます。",
            src: "/homepage/cases/farm-case-03.webp",
            alt: "魚のいる池9つの上にビッグシェッド4棟、中央にオベリスクと家畜小屋、右側の作物の中に巨大メロンがあるスタンダード牧場",
          },
          {
            name: "Moonfallのメロン畑",
            designation: "スタンダード牧場・夏",
            quote:
              "ビッグシェッドとサイロが左上に並び、魚のいる池がメロン畑に沿っています。果樹園は左下にあり、ハチの巣箱は牧場の池のそば、家畜エリアは右下です。",
            src: "/homepage/cases/farm-case-04.webp",
            alt: "ビッグシェッドとサイロ、魚のいる池、メロン畑、左下の果樹園、右下の家畜エリアがある夏のスタンダード牧場",
          },
        ],
      },
      {
        id: "farm-cases-2",
        heading: "牧場の地図ごとの庭の区域",
        imagePosition: "right",
        previousLabel: "前の事例",
        nextLabel: "次の事例",
        testimonials: [
          {
            name: "十年牧場と金時計の庭",
            designation: "スタンダード牧場・秋",
            quote:
              "オベリスクの庭と金時計が北西にあり、畑は中央と西側に広がっています。池と納屋が畑を囲み、東側は加工エリアと家畜エリアです。",
            src: "/homepage/cases/farm-case-05.webp",
            alt: "北西にオベリスクの庭と金時計、中央に畑、東に加工エリアと家畜エリアがある秋のスタンダード牧場",
          },
          {
            name: "フォレスト牧場の交差点",
            designation: "フォレスト牧場・春",
            quote:
              "南北の道と横切る道が中央の池のまわりで交わり、温室と牧場の家は上の両角にあります。柵で囲んだ木立とハチの巣箱の集まりが上の中央、魚のいる池は東、家畜エリアは南西です。",
            src: "/homepage/cases/farm-case-06.webp",
            alt: "中央の池を囲んで道が交わり、上に柵の木立とハチの巣箱、東に魚のいる池、南西に家畜エリアがあるフォレスト牧場",
          },
          {
            name: "金時計と家畜小屋の列",
            designation: "メドウランズ牧場・春",
            quote:
              "ビッグシェッド4棟が中央の金時計を囲み、東側には広い畑と家畜小屋の列があります。西側と左下には、柵で囲んだ庭、ハチの巣箱、製粉機、マルチ用の小屋が散らばっています。",
            src: "/homepage/cases/farm-case-07.webp",
            alt: "中央の金時計をビッグシェッド4棟が囲み、東に畑と家畜小屋、西に庭がある春のメドウランズ牧場",
          },
          {
            name: "4コーナーズファームの金時計の庭",
            designation: "4コーナーズファーム・春",
            quote:
              "牧場の家と畑は北東、温室と家畜エリアは北西です。金時計を中心にした庭が地図を分け、南西に池、南東に果樹園とハチの巣箱の区画があります。",
            src: "/homepage/cases/farm-case-08.webp",
            alt: "北東に牧場の家と畑、北西に温室と家畜エリア、南は分かれた区域がある春の4コーナーズファーム",
          },
        ],
      },
      {
        id: "farm-cases-3",
        heading: "地形に合わせたレイアウト",
        imagePosition: "left",
        previousLabel: "前の事例",
        nextLabel: "次の事例",
        testimonials: [
          {
            name: "畑と魚のいる池の区域",
            designation: "4コーナーズファーム",
            quote:
              "サイロ5基が北側に並び、その下に広い畑があります。温室、金時計、オベリスクが中央の目印になっています。南西には3×3の魚のいる池とスライムハッチ、南東には果樹園と作業エリアがあります。",
            src: "/homepage/cases/farm-case-09.webp",
            alt: "北側にサイロ5基と広い畑、中央に温室と目印の集まり、南西に池の区画がある4コーナーズファーム",
          },
          {
            name: "ヒルトップの段々",
            designation: "ヒルトップ牧場",
            quote:
              "小麦の畑は北側の崖の下にあり、牧場の家と近くの建物は右上の高台にあります。畑は中段の段々に分かれ、小川のそばの温室と左下の果樹園から、下の製粉機と家畜の建物へ続いています。",
            src: "/homepage/cases/farm-case-10.webp",
            alt: "北側の崖の下に小麦、右上の高台に建物、段々の畑、小川のそばに温室があるヒルトップ牧場",
          },
          {
            name: "魚のいる池が並ぶ岸",
            designation: "ビーチの牧場・秋",
            quote:
              "魚のいる池11個が、北岸の建物の下、中央の砂浜を一列に横切っています。南西は畑と巨大作物、南東は柵で囲んだ家畜エリアとスライムハッチです。",
            src: "/homepage/cases/farm-case-11.webp",
            alt: "中央の砂浜に魚のいる池11個が並び、南西に作物、南東に家畜エリアがある秋のビーチの牧場",
          },
          {
            name: "島ごとの畑",
            designation: "リバーランド牧場・夏",
            quote:
              "畑は分かれた複数の島にあり、温室は西岸、牧場の建物は北側の島に散らばっています。大型の家畜小屋とマルチ用の小屋が南の島にあり、魚のいる池は東側です。",
            src: "/homepage/cases/farm-case-12.webp",
            alt: "分かれた島に畑、西岸に温室、北に牧場の建物、東に魚のいる池がある夏のリバーランド牧場",
          },
        ],
      },
    ],
    featureIntroduction: {
      heading: "スターデューバレー プランナーで牧場のレイアウトを計画する",
      description:
        "スタバレ レイアウト ツールで、ゲーム内で建てる前に、上から見た地図で牧場のレイアウトを試せます。スターデューバレー プランナーでは、季節の見た目と範囲を比べてから、プロジェクトを保存するか、画像を書き出します。あとから直すときの参考になります。",
      items: [
        {
          icon: "map",
          title: "スターデューバレー プランナーで地図を選ぶ",
          description:
            "スターデューバレー プランナーでは、スタンダード牧場、リバーランド牧場、フォレスト牧場、ヒルトップ牧場、ワイルド牧場、4コーナーズファーム、ビーチの牧場、メドウランズ牧場の8種類から選べます。ジンジャーアイランドも選べます。スタバレ レイアウト ツールで、遊んでいる地図に合わせ、地形に沿ってレイアウトを組めます。",
        },
        {
          icon: "layout",
          title: "スタバレ レイアウト ツールで配置を直す",
          description:
            "スターデューバレー プランナーでは、建物、作物、木、道、装飾を置き、計画が変わったら選んだものを動かせます。スタバレ レイアウト ツールでは、対応しているアイテムを四角い範囲にまとめて敷けます。範囲を消したり、編集を元に戻したり、やり直したりして、各区域を整えられます。",
        },
        {
          icon: "coverage",
          title: "スターデューバレー プランナーで範囲を確認する",
          description:
            "スターデューバレー プランナーでは、スプリンクラー、カカシ、ハチの巣箱、ジュニモ小屋の範囲を地図に表示できます。畑や牧場の区域をどこに置くか決めるとき、スタバレ レイアウト ツールで作物の区域が近くの設備とどう重なるかを確認できます。",
        },
        {
          icon: "seasons",
          title: "スタバレ レイアウト ツールで4つの季節をプレビューする",
          description:
            "スターデューバレー プランナーでは、春、夏、秋、冬を切り替えて、地図の季節ごとの見た目をプレビューできます。スタバレ レイアウト ツールで、道、木、庭を配置しながら、季節の景色を見られます。",
        },
        {
          icon: "projects",
          title: "スターデューバレー プランナーで保存して移す",
          description:
            "スターデューバレー プランナーのプロジェクトは、このブラウザに保存されるので、後から計画を開き直せます。スタバレ レイアウト ツールでは、JSONを書き出して別のプロジェクトファイルを残すか、既存のJSONプロジェクトを読み込んで、そこから続けられます。",
        },
        {
          icon: "export",
          title: "スタバレ レイアウト ツールでスクリーンショットを書き出す",
          description:
            "スターデューバレー プランナーでは、今のレイアウトを、1倍または2倍の解像度のPNGで書き出せます。その画像は、デザインのメモと一緒に保管するか、ゲーム内で建てるときの見た目の参照に使えます。",
        },
      ],
    },
    features: {
      heading: "メドウランズ牧場のレイアウト例",
      previousLabel: "前の例",
      nextLabel: "次の例",
      testimonials: [
        {
          quote:
            "秋の色が、作物の列、道、池、牧場の建物が密集した配置に広がっています。",
          name: "秋のメドウランズ牧場",
          designation: "メドウランズ牧場・秋",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          imageAlt: "秋のプリズム調の色合いで描かれた、メドウランズ牧場のドット絵レイアウト",
        },
        {
          quote:
            "春の木と装飾が、畑、池、道、牧場の建物を囲んでいます。",
          name: "メドウランズに広がる春の色",
          designation: "メドウランズ牧場・春",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          imageAlt: "春のプリズム調の色合いで描かれた、メドウランズ牧場のドット絵レイアウト",
        },
        {
          quote:
            "畑、木、池、牧場の建物が、明るい夏の色合いで同じ地図に並んでいます。",
          name: "池のまわりの夏の畑",
          designation: "メドウランズ牧場・夏",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          imageAlt: "夏のプリズム調の色合いで描かれた、メドウランズ牧場のドット絵レイアウト",
        },
        {
          quote:
            "木の多い地図に、道、畑、池、建物、装飾の区域が集まっています。",
          name: "モッド入りメドウランズ牧場の全体",
          designation: "モッド入りメドウランズ牧場",
          src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          imageAlt: "モッド入りメドウランズ牧場の全体を示すドット絵レイアウト",
        },
        {
          quote:
            "このバニラの7年目レイアウトでは、畑、建物、道、池がメドウランズ牧場全体に配置されています。",
          name: "バニラのメドウランズ牧場、7年目",
          designation: "バニラのメドウランズ牧場・7年目",
          src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
          imageAlt: "7年目のバニラのメドウランズ牧場を示すドット絵レイアウト",
        },
      ],
    },
    whyChoose: {
      heading: "ビーチの牧場と4コーナーズファームのレイアウト例",
      previousLabel: "前の例",
      nextLabel: "次の例",
      testimonials: [
        {
          quote:
            "花の咲く木、小さな庭、道が、この海岸のレイアウトを庭のように見せています。",
          name: "装飾を重視したビーチの牧場",
          designation: "machooo・15年目",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "machooo による装飾を重視したビーチの牧場のレイアウト、15年目",
        },
        {
          quote: "道と畑が、牧場の建物のまわりで菱形になっています。",
          name: "菱形の道があるビーチの牧場",
          designation: "jennameeps・ビーチの牧場",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "jennameeps による、菱形に組んだビーチの牧場のレイアウト",
        },
        {
          quote: "石の道が畑と建物をつなぎ、海岸の地図に沿って延びています。",
          name: "石の道で整理したビーチの牧場",
          designation: "justkuwl・ビーチの牧場",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "justkuwl による、石の道で整理したビーチの牧場",
        },
        {
          quote: "加工設備の列が、道、畑、牧場の建物のあいだに並んでいます。",
          name: "加工エリアがあるビーチの牧場",
          designation: "shady kegyard・ビーチの牧場",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "shady kegyard による、加工を中心にしたビーチの牧場のレイアウト",
        },
        {
          quote: "道、畑、木、建物が、地図上の別々の区域を占めています。",
          name: "均衡の取れた4コーナーズファーム",
          designation: "rp2-phobos・4コーナーズファーム",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "rp2-phobos による、均衡の取れた4コーナーズファームのレイアウト",
        },
        {
          quote: "畑、牧場の建物、道、水場が、均衡の取れた配置でこの地図を分け合っています。",
          name: "区域の均衡が取れた4コーナーズファーム",
          designation: "emerald・4コーナーズファーム",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "emerald による、均衡の取れた4コーナーズファームのレイアウト",
        },
        {
          quote: "小屋の列と畑が、道と作業エリアとともに地図を埋めています。",
          name: "4コーナーズファームの小屋と畑",
          designation: "hallofax・5年目",
          src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
          imageAlt: "hallofax による、小屋を中心にした4コーナーズファームのレイアウト、5年目",
        },
      ],
    },
    howTo: {
      heading: "スタバレ レイアウト ツールで3回に分けて牧場を置く",
      description:
        "スタバレ レイアウト ツールでは、動かないマスを先に固定します。作業の区域を取ってから、家畜小屋、小屋、納屋、畑を置きます。最後にふだんの1日の順路を歩き、ふさがった道は、スターデューバレー プランナーで直します。",
      steps: [
        {
          title: "スターデューバレー プランナーで動かないマスを固定する",
          description:
            "スターデューバレー プランナーで、実際に遊んでいる牧場の地図を選びます。水、崖、橋、出口は動きません。牧場の家と出荷箱を順路の基準にし、その周囲の地面は空けておきます。",
          benefits: [
            "池、川、崖は、スターデューバレー プランナーでも後から動きません。",
            "橋と出口はそのままなので、そこへ続く道は空けておきます。",
            "牧場の家と出荷箱が、スターデューバレー プランナーでは1日の始まりと終わりを固定します。",
          ],
        },
        {
          title: "作業を区分けしてから、大きいものを置く",
          description:
            "スタバレ レイアウト ツールでは、作物、動物、木、保管、加工には、それぞれ区域を取ります。境界は先に広めに引きます。その後で家畜小屋、小屋、納屋、畑を置きます。装飾は最後です。",
          benefits: [
            "作物、動物、木、保管、加工が、スターデューバレー プランナーではそれぞれ一つの区画を持ちます。",
            "家畜小屋、小屋、納屋、畑が、配置の規模を決めます。",
            "各入口と、建物の正面に、スターデューバレー プランナーでは余地を残します。",
          ],
        },
        {
          title: "スターデューバレー プランナーで、1日の作業を歩いてみる",
          description:
            "牧場の家から始め、畑、動物、箱、出荷箱へ進みます。道がふさがっていたら、ゲーム内で建て直すのではなく、スタバレ レイアウト ツールで計画を変えます。",
          benefits: [
            "牧場の家 → 畑 → 動物 → 箱 → 出荷箱。",
            "ふさがったマスは、ゲーム内で動かすより、スターデューバレー プランナーで動かす方が手間がかかりません。",
          ],
        },
      ],
    },
    toolComparison: {
      heading: "Stardew Valley Planner vs StardewPlan vs Stardew Planner V3",
      description:
        "スターデューバレー プランナーは、無料で牧場を計画でき、操作もわかりやすいです。スタバレ レイアウト ツールは、はっきりした操作で、プロジェクト管理、JSONバックアップ、1× / 2×のPNG書き出しがまとまっています。英語と中国語に対応しています。",
      tableLabel: "ツール比較",
      dimensionHeading: "項目",
      columns: [
        {
          name: "Stardew Valley Planner",
          href: "#planner",
        },
        {
          name: "StardewPlan",
          href: "https://stardewplan.com/",
        },
        {
          name: "Stardew Planner V3",
          href: "https://v3.stardew.info/planner/",
        },
      ],
      rows: [
        {
          dimension: "料金",
          cells: [
            "スターデューバレー プランナーでは、計画、ローカル保存、JSONバックアップ、1× / 2×のPNG書き出しはすべて無料で、有料会員の段階はありません。",
            "プランナーの機能はすべて無料です。アカウントでの無制限同期は、支援者向けの特典です。",
            "基本的な計画は無料です。Patreon会員は広告を非表示にできます。",
          ],
        },
        {
          dimension: "操作のしやすさ",
          cells: [
            "スタバレ レイアウト ツールは、ラベルが明確で、操作がグループに分かれています。スターデューバレー プランナーでは、アイテムを一覧から選ぶか検索できます。プロジェクト管理、JSONバックアップ、PNG書き出しは、同じ保存ウィンドウにまとまっています。",
            "ツールバーと、分類されたアイテム一覧があります。Libraryで計画を管理し、計画メニューから共有とスクリーンショットができます。",
            "上部のカテゴリメニューとアイコンのツールがあり、追加の操作はオプションメニューと右クリックメニューにあります。",
          ],
        },
        {
          dimension: "複数の計画の保存",
          cells: [
            "スターデューバレー プランナーには、固定の枠や件数の上限はなく、複数の計画を保存できます。容量はブラウザの保存領域によります。",
            "アカウントなしでも使え、端末内に保存できます。無料アカウントは5件まで同期でき、支援者は無制限に同期できます。",
            "保存するたびに固有のURLが付きます。計画の履歴は、Patreon支援者の特典とされています。",
          ],
        },
        {
          dimension: "英語と中国語の画面",
          cells: [
            "スタバレ レイアウト ツールでは、スターデューバレー プランナーの計画画面と保存画面を、英語と中国語で切り替えられます。",
            "英語の画面です。中国語対応は確認できていません。",
            "対応する画面言語には、英語と簡体字中国語があります。",
          ],
        },
        {
          dimension: "プロジェクトファイルのバックアップ",
          cells: [
            "スターデューバレー プランナーでは、1つのプロジェクトをJSONで書き出したり、読み込んだりできます。中の地図はすべて含まれ、バックアップや移行に使えます。",
            "計画を farm-plan.json として書き出せます。",
            "固有のURLで計画を保存し、共有できます。",
          ],
        },
        {
          dimension: "PNG書き出し",
          cells: [
            "スタバレ レイアウト ツールでは、共有やゲーム内での建築の参照用に、標準の1×、または高画質の2×のPNGスクリーンショットをダウンロードできます。書き出しはスターデューバレー プランナーで行います。",
            "ScreenshotからPNGのスクリーンショットをダウンロードできます。",
            "牧場の計画をPNG画像として書き出せます。",
          ],
        },
      ],
    },
    closingCta: {
      heading: "このページで配置を終えてから、ゲーム内で建てる。",
      supportLine: "アカウントなしでも計画できます。ログインすると、選んだプロジェクトを同期できます。",
    },
    faq: {
      eyebrow: "質問",
      heading: "よくある質問",
      description: "スターデューバレー プランナーでの計画の保存場所、使える牧場、書き出せるものについてです。",
      items: [
        {
          question: "スターデューバレー プランナーで作業は消えませんか？",
          answer:
            "スターデューバレー プランナーのプロジェクトは、同期を選ばない限りこのブラウザに残ります。ログインすると、同期したレイアウトデータを別の端末から開けます。スタバレ レイアウト ツールの地図のプレビュー画像は、この端末に残ります。",
        },
        {
          question: "スタバレ レイアウト ツールに自分の牧場はありますか？",
          answer:
            "スターデューバレー プランナーには、スタンダード牧場、リバーランド牧場、フォレスト牧場、ヒルトップ牧場、ワイルド牧場、4コーナーズファーム、ビーチの牧場、メドウランズ牧場に加え、ジンジャーアイランドもあります。",
        },
        {
          question: "スターデューバレー プランナーで季節と範囲は見られますか？",
          answer:
            "スタバレ レイアウト ツールでは、春、夏、秋、冬に切り替えられます。スプリンクラー、カカシ、ハチの巣箱、ジュニモ小屋の範囲を表示できます。",
        },
        {
          question: "スタバレ レイアウト ツールでセーブデータは読み込めますか？",
          answer: "スターデューバレー プランナーでは読み込めます。ただし実験的な機能です。モッドのアイテムは対応しないことがあります。",
        },
        {
          question: "スターデューバレー プランナーでスクリーンショットは書き出せますか？",
          answer: "スタバレ レイアウト ツールでは書き出せます。標準画質と高画質をダウンロードできます。",
        },
      ],
    },
    footer: {
      brandName: "スターデューバレー プランナー",
      description:
        "ブラウザで使うファンメイドの牧場プランナーです。プロジェクトはローカルに保存でき、選んだレイアウトはクラウド同期もできます。",
      copyright: "© スターデューバレー プランナー",
      planner: {
        title: "プランナー",
        home: "プランナー",
      },
      explore: {
        title: "探す",
        capabilities: "牧場の例",
        faq: "よくある質問",
        blog: "ブログ",
      },
      legal: {
        title: "法務",
        privacy: "プライバシーポリシー",
        terms: "利用規約",
        contact: "お問い合わせ",
      },
    },
  },
  ru: russianHomepageCopy,
};
