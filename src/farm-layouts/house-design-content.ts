import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export const houseDesignCanonicalPath = "/stardew-valley-house-design" as const;

export type HouseDesignCover = Readonly<{
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}>;

export type HouseDesignCase = Readonly<{
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

export type HouseDesignPageCopy = Readonly<{
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
  cover: HouseDesignCover;
  cases: readonly HouseDesignCase[];
}>;

const houseDesignImageWidth = 2240;
const houseDesignImageHeight = 1472;
const houseDesignImageDirectory = "/farm-layouts/house-design/images";
const houseDesignProjectDirectory = "/farm-layouts/house-design/projects";
const houseDesignCoverStem =
  "01-stardew-valley-house-design-cottagecore-green";

function houseDesignImageSrc(stem: string): string {
  return `${houseDesignImageDirectory}/${stem}.webp`;
}

function houseDesignProjectHref(stem: string): string {
  return `${houseDesignProjectDirectory}/${stem}.json`;
}

function createHouseDesignCover(
  imageAlt: string,
  caption: string,
): HouseDesignCover {
  const imageSrc = houseDesignImageSrc(houseDesignCoverStem);

  return {
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: houseDesignImageWidth,
    imageHeight: houseDesignImageHeight,
    caption,
  };
}

function createHouseDesignCase(
  stem: string,
  title: string,
  summary: string,
  imageAlt: string,
): HouseDesignCase {
  const imageSrc = houseDesignImageSrc(stem);

  return {
    id: stem,
    title,
    summary,
    imageSrc,
    imageOriginalSrc: imageSrc,
    imageAlt,
    imageWidth: houseDesignImageWidth,
    imageHeight: houseDesignImageHeight,
    projectHref: houseDesignProjectHref(stem),
  };
}

const houseDesignCoverEn = createHouseDesignCover(
  "A cottagecore farmhouse interior with leafy plants, wood furniture, rugs, and a coordinated green palette.",
  "A green cottagecore farmhouse preview to inspire your Stardew Valley house design. Six separate cases below include planner projects you can download and adapt.",
);

const houseDesignCasesEn: readonly HouseDesignCase[] = [
  createHouseDesignCase(
    "02-stardew-valley-house-design-witch-junimo",
    "Witchy Rooms with a Junimo Corner",
    "This Stardew Valley house design pairs violet and blue finishes with the playful shapes of Junimo cushions, plants, and small themed ornaments. A few darker magical accents give the rooms contrast without making every surface busy. Use the project to compare how one theme can carry from the living area into the bedroom, then leave clear routes between furniture groups so the decoration still feels comfortable to walk through.",
    "A farmhouse interior in violet and blue, decorated with Junimo pieces, plants, and witchy accents.",
  ),
  createHouseDesignCase(
    "03-stardew-valley-house-design-serene-plant-tour",
    "A Calm Home Built Around Houseplants",
    "Potted greenery is the strongest visual thread in this Stardew Valley house design. Warm wall patterns and tiled floors keep the plant groupings from blending into one green mass, while open patches between chairs, tables, and plants preserve useful walking space. If you like a lived-in room, start with two or three plant clusters rather than placing greenery on every spare tile; the planner project lets you inspect the balance and make a lighter version for your own rooms.",
    "A warm farmhouse interior with clusters of potted plants, patterned walls, and open floor paths.",
  ),
  createHouseDesignCase(
    "04-stardew-valley-house-design-whimsical-attic-music",
    "A Whimsical Music Room with a Piano",
    "A piano gives this Stardew Valley house design a clear focal point, with star motifs and a night-sky bed adding a playful, dreamlike mood. The darker floor helps the pale decorations stand out. When borrowing the idea, place the largest instrument or bed first, then arrange smaller accents around its footprint; this keeps a themed room from feeling like a pile of unrelated objects. Open the project to study how the music corner connects to the rest of the farmhouse.",
    "A whimsical farmhouse room with a piano, star decorations, and a night-sky bed.",
  ),
  createHouseDesignCase(
    "05-stardew-valley-house-design-cozy-tea-greenhouse",
    "A Cozy, Greenhouse-Inspired Sitting Room",
    "This Stardew Valley house design uses warm wood, leafy accents, and small seating groups to suggest a quiet conservatory without turning the room into a literal crop greenhouse. The softer palette makes a good backdrop for favorite furniture, while plants add height around the lower tables and chairs. Keep one central surface as the anchor, then use rugs or wall color to define a reading or tea-time corner. The downloadable project shows the full indoor arrangement for closer comparison.",
    "A cozy farmhouse interior with warm wood, leafy decorations, and small seating areas.",
  ),
  createHouseDesignCase(
    "06-stardew-valley-house-design-italian-grandma-rustic",
    "A Rustic Family Dining Room",
    "A long dining table and the mix of smaller wooden tables make this Stardew Valley house design feel like a practical family home. Green patterned walls and pink-toned floors add color without hiding the furniture shapes. This is a useful reference when the dining room should feel connected to everyday living rather than staged for a single screenshot: group seating near the table, keep doorways clear, and repeat one wood tone in nearby rooms to tie the rooms together.",
    "A rustic farmhouse dining room with a long wooden table, smaller tables, and green patterned walls.",
  ),
  createHouseDesignCase(
    "07-stardew-valley-house-design-wizard-mystic-16",
    "A Wizard’s Study with Stars and Books",
    "Books, crystal-ball decorations, a cauldron, and violet star patterns give this Stardew Valley house design a focused wizard-study theme. The repeated purple details make the rooms read as one home, while shelves and larger furniture give smaller props a clear setting. To adapt the look, choose one main magical color and reserve the brightest ornaments for a few focal spots. The project is a practical way to inspect item placement before you make changes to your own farmhouse.",
    "A wizard-themed farmhouse interior with books, a crystal ball, a cauldron, and violet star patterns.",
  ),
];

const houseDesignCoverZhCn = createHouseDesignCover(
  "乡村绿意风格的农舍室内，摆有绿植、木质家具、地毯，并使用协调的绿色配色。",
  "这张封面展示星露谷物语房屋设计中的绿色乡村风格。下方六个案例各有独立规划器项目，可下载后继续调整。",
);

const houseDesignCasesZhCn: readonly HouseDesignCase[] = [
  createHouseDesignCase(
    "02-stardew-valley-house-design-witch-junimo",
    "女巫氛围与祝尼魔角落",
    "这套星露谷物语房屋设计用蓝紫色墙面与地板衬托祝尼魔靠垫、绿植和主题摆件。少量深色魔法装饰形成对比，避免整个房间都显得拥挤。打开项目可以对照起居区和卧室如何延续同一主题；规划时，也可以在家具组之间留出通行空间，让装饰好的房间仍然方便走动。",
    "蓝紫色农舍室内摆有祝尼魔装饰、绿植和女巫主题摆件。",
  ),
  createHouseDesignCase(
    "03-stardew-valley-house-design-serene-plant-tour",
    "以室内绿植为主角的安静居所",
    "盆栽是这套星露谷物语房屋设计中最明显的视觉线索。暖色墙纸和瓷砖地板让成组的绿叶更突出，也让植物不会混成一大片绿色；椅子、桌子与盆栽之间仍留有行走空间。如果你喜欢有生活气息的房间，可以先布置两三组植物，而不是把每个空格都摆满。规划器项目能帮助你查看各组之间的平衡，再按自己的房间缩减或移动装饰。",
    "暖色农舍室内摆放成组盆栽、图案墙纸，并保留通行空间。",
  ),
  createHouseDesignCase(
    "04-stardew-valley-house-design-whimsical-attic-music",
    "钢琴与星空装饰组成的奇想音乐室",
    "钢琴成为这套星露谷物语房屋设计的视觉中心，星星图案与夜空床铺则增添轻松、梦幻的气氛。较深的地板让浅色装饰更醒目。参考这类主题房时，可以先放置钢琴或床这样的大件，再围绕它安排小装饰，避免家具看起来只是随意堆在一起。打开项目还能查看音乐角和农舍其他空间之间如何衔接。",
    "奇想风格的农舍室内有钢琴、星星装饰和夜空主题床铺。",
  ),
  createHouseDesignCase(
    "05-stardew-valley-house-design-cozy-tea-greenhouse",
    "温室灵感的舒适休息角",
    "这套星露谷物语房屋设计把暖木色、绿叶装饰和小型座椅组合在一起，营造安静的玻璃花房氛围，但房间本身仍是起居空间，并非种植温室。柔和的配色可以衬托自己喜欢的家具，植物则为低矮的桌椅增加层次。可以先选一张桌子作为中心，再用地毯或墙面颜色划出阅读、喝茶的小角落。下载项目后可查看完整室内摆放。",
    "温馨农舍室内以暖木色、绿叶装饰和小型座椅区域为主。",
  ),
  createHouseDesignCase(
    "06-stardew-valley-house-design-italian-grandma-rustic",
    "带有乡村气息的家庭餐厅",
    "长餐桌与几张小木桌让这套星露谷物语房屋设计更像日常生活中的家庭住宅。绿色图案墙面和偏粉的木地板提供色彩，但不会盖过家具轮廓。如果你想让餐厅融入起居空间，而不是只适合截图，可以把座椅集中放在餐桌周围、保持门口通畅，并在相邻房间重复一种木色，让几个空间自然连起来。",
    "乡村风农舍餐厅摆有长木桌、小桌和绿色图案墙面。",
  ),
  createHouseDesignCase(
    "07-stardew-valley-house-design-wizard-mystic-16",
    "星纹、书籍与魔法道具组成的巫师书房",
    "书籍、水晶球装饰、坩埚和紫色星纹让这套星露谷物语房屋设计拥有明确的巫师书房主题。重复出现的紫色细节使几个房间看起来属于同一套住宅；书架与大件家具也为小摆件提供了合适背景。参考时可以先挑一种主色，再把最亮眼的装饰留给少数焦点位置。规划器项目便于在调整自家农舍前查看摆件的位置。",
    "巫师主题农舍室内摆有书籍、水晶球、坩埚和紫色星纹装饰。",
  ),
];

const houseDesignPageCopyByLocale: Readonly<
  Record<PublicLocale, HouseDesignPageCopy>
> = {
  en: {
    title: "Stardew Valley House Design Ideas for Every Room",
    metaTitle: "Stardew Valley House Design: 6 Farmhouse Interiors",
    description:
      "Explore six Stardew Valley farmhouse interiors, from plant-filled cottagecore rooms to a wizard’s study, and download editable planner projects.",
    intro:
      "Explore six Stardew Valley house design examples inside the farmhouse, from leafy cottagecore and Junimo rooms to a piano corner, rustic dining, and a wizard’s study. Each case includes an image and project so you can compare furniture, color, and walking space before adapting it to your home.",
    categoryLabel: "Buildings & Interiors",
    browseLabel: "Browse the six interiors",
    openPlannerLabel: "Open the planner",
    casesHeading: "Six Stardew Valley House Design Examples",
    casesDescription:
      "Use the gallery as a set of practical room references. Each Stardew Valley house design highlights a different mood and a few choices you can reuse: a focal piece, a limited color palette, repeated decor, or a clear path through the room. Compare each Stardew Valley house design with the rooms you already have before downloading its project to inspect furniture placement more closely.",
    ctaHeading: "Make a Farmhouse Interior Your Own",
    ctaDescription:
      "Pick a Stardew Valley house design that matches the way you want your rooms to feel. Open its planner project, move the furniture, and try another floor or wall combination before you decorate in game.",
    ctaButtonLabel: "Start planning a room",
    whatIsHeading: "What Is Stardew Valley House Design?",
    whatIsParagraphs: [
      "Stardew Valley house design is the process of arranging furniture, rugs, flooring, wallpaper, and decorative objects inside the farmhouse. A useful room plan starts with the way you want to use the space: a clear route between doors, a seating group for a living room, or a table that anchors a dining area. Then choose one large piece as the focal point and build around its shape. These small decisions give a Stardew Valley house design a readable center, even when you use many themed items.",
      "The farmhouse changes as you progress. Robin offers upgrades: the first adds a kitchen and bedroom, while the second adds rooms and unlocks renovations. The official Farmhouse guide notes that rooms can have their own wallpaper and floors, letting a reading nook stay quiet while the dining room feels warmer. Renovations can alter the floor plan, so check room shape before placing furniture. This flexibility gives a Stardew Valley house design distinct room purposes within one shared look.",
      "A Stardew Valley house design can be decorative and practical. Keep doors and the bed reachable, leave floor open for walking, and use rugs or repeated colors to mark zones. Furniture need not match as a set; one shared material, color, or motif can link different pieces. Repeat a detail from the main rooms when decorating an extension so it feels connected.",
      "The six examples below show different ways to balance mood and use. Compare their focal objects, open floor, and the way walls and floors support the theme. Each Stardew Valley house design is a starting point: replace items you do not own with similar shapes and adjust routes to fit your farmhouse. Inspect the planner project before recreating your changes in game.",
    ],
    enlargeImageLabel: "View full interior image",
    closeImageLabel: "Close full interior image",
    downloadProjectLabel: "Download this project",
    howToEyebrow: "How to use",
    howToHeading: "How to Plan a Farmhouse Interior",
    howToSteps: [
      {
        number: "01",
        title: "Choose a room’s purpose",
        body: "Start your Stardew Valley house design with the room’s main use and the route you need to keep clear. A table, piano, bed, or favorite chair can be the anchor.",
      },
      {
        number: "02",
        title: "Set the palette and large pieces",
        body: "Choose a floor and wall pairing, place the largest furniture first, then add rugs and a few repeated accents to connect separate areas. This gives a Stardew Valley house design a consistent base before small decor is added.",
      },
      {
        number: "03",
        title: "Check the layout at room scale",
        body: "Open a project in the planner, review entrances and open floor, and replace objects you do not own. Adjust the Stardew Valley house design before decorating in your save.",
      },
    ],
    faqEyebrow: "FAQ",
    faqHeading: "Stardew Valley House Design Questions",
    faqDescription:
      "Learn how farmhouse upgrades affect room planning, how to use these Stardew Valley house design examples, and what planner downloads do.",
    faqs: [
      {
        question: "How do I start a Stardew Valley house design?",
        answer:
          "Choose the room’s purpose, mark door routes, and place one large anchor piece. Pick a floor and wallpaper, then add small decor. A simple Stardew Valley house design makes it easier to spot objects that help the room and items that only take up space.",
      },
      {
        question: "Can each farmhouse room have different wallpaper and flooring?",
        answer:
          "Yes. Each room can have separate wallpaper and flooring. A Stardew Valley house design can give a dining room a warm palette and a bedroom a quieter one, then link them with a repeated color or material.",
      },
      {
        question: "When do farmhouse renovations become available?",
        answer:
          "After the second farmhouse upgrade, Robin offers renovations. Check the updated room shape and connections; move furniture if needed to keep routes open in your Stardew Valley house design.",
      },
      {
        question: "Are the six examples fixed furniture sets?",
        answer:
          "No. Use each Stardew Valley house design as a visual reference: keep the plant cluster, piano focal point, rustic dining group, or wizard palette and substitute furniture you own. The project lets you test edits without copying every object.",
      },
      {
        question: "Will downloading a project change my game save?",
        answer:
          "No. JSON downloads are planner projects; they do not change a game save. Plan your Stardew Valley house design in the project, then place the furniture in game.",
      },
    ],
    cover: houseDesignCoverEn,
    cases: houseDesignCasesEn,
  },
  "zh-CN": {
    title: "星露谷物语房屋设计：六套农舍室内灵感",
    metaTitle: "星露谷物语房屋设计｜六种农舍室内布局",
    description:
      "浏览六套星露谷物语农舍室内设计，从绿植乡村风到巫师书房，并下载可编辑的规划器项目。",
    intro:
      "这里整理了六套星露谷物语房屋设计案例，展示农舍室内的不同布置方向：绿植乡村风、祝尼魔装饰、钢琴角落、乡村餐厅和巫师书房。每个案例都配有图片和规划器项目，方便你比较家具组合、配色与通行空间，再按自己的房间进行调整。先从星露谷物语房屋设计的整体氛围入手，再挑选适合自己的细节。",
    categoryLabel: "建筑与室内",
    browseLabel: "浏览六套室内案例",
    openPlannerLabel: "打开规划器",
    casesHeading: "六套星露谷物语房屋设计案例",
    casesDescription:
      "把这组图片当作实用的室内参考。每套星露谷物语房屋设计都有不同氛围，也展示了可以借鉴的布置方法：确定视觉中心、控制配色数量、重复使用装饰元素，或为房间留出清楚的行走路线。对照自己的农舍阅读星露谷物语房屋设计案例，再挑出真正需要的布置方法。想细看家具位置时，可以下载对应项目。",
    ctaHeading: "把农舍室内布置成自己喜欢的样子",
    ctaDescription:
      "选择一套符合你房间氛围的星露谷物语房屋设计，打开规划器项目移动家具，也可以先尝试不同的地板与墙面组合，再到游戏里布置。",
    ctaButtonLabel: "开始规划星露谷物语房屋设计",
    whatIsHeading: "什么是星露谷物语房屋设计？",
    whatIsParagraphs: [
      "星露谷物语房屋设计，是在农舍里安排家具、地毯、地板、墙纸和装饰品的过程。规划一个房间，可以先想清楚它要怎么使用：门口之间需要怎样通行，起居区是否需要一组座椅，餐厅是否需要一张能聚拢空间的桌子。接着选一件大件家具作为视觉中心，再根据它的形状安排周围物品。这样，即使使用了很多主题装饰，星露谷物语房屋设计依然会有清楚的重点。",
      "农舍会随着游戏进度扩建。罗宾出售农舍升级：第一次升级增加厨房和卧室，第二次升级增加房间并开放改造选项。官方农舍资料还说明，不同房间可以分别选择墙纸和地板。因此，可以给阅读角落用安静的配色，同时让餐厅保留更温暖的风格。升级或改造会改变可用的房间布局，摆家具前先确认房间形状，有助于避免通道被挡住。合理使用不同房间的墙面与地面，也是星露谷物语房屋设计的一部分。",
      "星露谷物语房屋设计不必只顾装饰，也可以兼顾日常使用。门口和床边留出足够的地面空间，把常用家具放在容易走到的位置，再用地毯或重复配色划分不同区域。家具不必成套搭配；只要共享一种材质、颜色或主题，几件不同风格的物品也能产生联系。新增房间时，可以从主空间重复一个细节，让扩建后的空间连贯起来，而不只是照搬旧房间。",
      "下面六个案例展示了如何让这些取舍更直观。对比它们的视觉中心、地面留白，以及墙面和地板如何衬托主题。每套星露谷物语房屋设计都只是起点，并不是必须照搬的规则：没有的家具可以换成形状相近的物品，走动空间也可以按自己的农舍调整。通过规划器项目先检查修改后的摆放，再到游戏中还原会更方便。",
    ],
    enlargeImageLabel: "查看完整室内图片",
    closeImageLabel: "关闭完整室内图片",
    downloadProjectLabel: "下载这个项目",
    howToEyebrow: "使用方法",
    howToHeading: "如何规划农舍室内空间",
    howToSteps: [
      {
        number: "01",
        title: "先确定房间用途",
        body: "从房间的主要用途和需要保持通畅的路线开始规划星露谷物语房屋设计。餐桌、钢琴、床或喜欢的椅子都可以作为布置中心。",
      },
      {
        number: "02",
        title: "确定配色并放置大件",
        body: "先选地板和墙纸的搭配，把大件家具放好，再用地毯和少量重复出现的装饰连接不同区域。这样能让星露谷物语房屋设计先有稳定的配色基础，再逐步添入小装饰。",
      },
      {
        number: "03",
        title: "按房间大小检查摆放",
        body: "在规划器中打开项目，检查入口和地面留白，把没有的家具换掉。进存档装饰前，先调整这套星露谷物语房屋设计。",
      },
    ],
    faqEyebrow: "常见问题",
    faqHeading: "星露谷物语房屋设计常见问题",
    faqDescription:
      "了解农舍升级对房间规划的影响、六套星露谷物语房屋设计案例的使用方法，以及规划器下载文件的用途。",
    faqs: [
      {
        question: "星露谷物语房屋设计应该从哪里开始？",
        answer:
          "先确定房间的主要用途，标出门口和需要留通道的位置，再放置一件大件家具作为中心。选好地板与墙纸组合后，最后添加小装饰。先从简单的星露谷物语房屋设计开始，更容易判断哪些物品能改善房间，哪些只是占用空间。",
      },
      {
        question: "农舍里的每个房间都能用不同墙纸和地板吗？",
        answer:
          "可以。官方农舍资料说明，不同房间能够分别使用墙纸和地板。这样，星露谷物语房屋设计可以让餐厅更温暖、卧室更安静，再通过重复的颜色或材质把空间联系起来。",
      },
      {
        question: "什么时候可以改造农舍房间？",
        answer:
          "完成第二次农舍升级后，可以找罗宾进行房间改造。升级后先确认农舍的房间形状和连接方式；如果原有星露谷物语房屋设计不适合新布局，就移动家具并重新留出通道。",
      },
      {
        question: "六套案例是固定的家具套装吗？",
        answer:
          "不是。把每套星露谷物语房屋设计当作视觉参考即可。保留其中的思路，例如植物分组、钢琴焦点、乡村餐桌组合或巫师配色，再换成自己拥有的家具。规划器项目可以帮助你先试摆，不必一件件照搬。",
      },
      {
        question: "下载项目会改动我的游戏存档吗？",
        answer:
          "不会。下载的 JSON 是供查看和编辑的规划器项目，不会修改星露谷物语存档。你可以先用它规划星露谷物语房屋设计，准备好后再到游戏中自行摆放家具。",
      },
    ],
    cover: houseDesignCoverZhCn,
    cases: houseDesignCasesZhCn,
  },
};

export function getHouseDesignPageCopy(
  locale: PublicLocale,
): HouseDesignPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `House Design: locale must be a supported public locale; received ${JSON.stringify(locale)}.`,
    );
  }

  return houseDesignPageCopyByLocale[locale];
}
