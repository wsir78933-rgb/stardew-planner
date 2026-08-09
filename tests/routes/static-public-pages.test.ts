import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DOMParser,
  type Document as XmlDocument,
  type Element as XmlElement,
} from "@xmldom/xmldom";
import { describe, expect, it } from "vitest";
import { officialFarmTypes } from "../../src/reference/official-farm-guides";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

type StaticPublicPageExpectation = readonly [
  pathname: string,
  staticPageFile: string,
  title: string,
  description: string,
  heading: string,
  documentLanguage: string,
  sectionHeadings?: readonly string[],
];

type StaticBlogPageExpectation = Readonly<{
  pathname: string;
  staticPageFile: string;
  heading: string;
  documentLanguage: "en" | "zh-CN";
  schemaType: "Article" | "CollectionPage";
  coverImages: readonly Readonly<{ src: string; alt: string }>[];
}>;

type StaticHomepageExpectation = Readonly<{
  staticPageFile: "index.html" | "zh.html";
  heroMarkup: string;
  heroSupportingCopy: string;
  capabilityHeading: string;
  capabilityDescriptions: readonly string[];
  farmGuideHeading: string;
  faqHeading: string;
  faqAnswers: readonly string[];
  trustHeading: string;
  trustDescription: string;
  plannerHref: string;
  farmComparisonHref: string;
  moddedFarmsHref: string;
  homepageHref: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdUrl: string;
}>;

const staticPublicPageExpectations: readonly StaticPublicPageExpectation[] = [
  [
    "/",
    "index.html",
    "Stardew Valley Planner – Free Online Farm Layout Tool",
    "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    "Stardew Valley Planner for Every Farm Layout",
    "en",
  ],
  [
    "/farm-comparison",
    "farm-comparison.html",
    "Stardew Valley Farm Types Compared",
    "Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.",
    "Stardew Valley Farm Types Compared",
    "en",
  ],
  [
    "/mods",
    "mods.html",
    "Modded Stardew Valley Farms",
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    "Modded Stardew Valley Farms",
    "en",
  ],
  [
    "/privacy",
    "privacy.html",
    "Privacy Policy",
    "Learn how Stardew Valley Planner keeps projects in your browser without accounts, cloud sync, or tracking.",
    "Privacy Policy",
    "en",
    [
      "What we collect",
      "Farm data",
      "Online features",
      "Analytics",
      "Cookies",
      "Third parties",
      "Data deletion",
      "Local use",
      "Contact messages",
    ],
  ],
  [
    "/terms",
    "terms.html",
    "Terms of Service",
    "Read the browser-local terms for Stardew Valley Planner, including local projects, optional JSON import and export, and fan-made status.",
    "Terms of Service",
    "en",
    [
      "What this is",
      "Accounts",
      "Online features",
      "Your data",
      "Availability",
      "Game assets",
      "Contact messages",
    ],
  ],
  [
    "/contact",
    "contact.html",
    "Contact us | Stardew Valley Farm Planner",
    "Send a message to the Stardew Valley Farm Planner team.",
    "Contact us",
    "en",
  ],
  ["/farm/standard", "farm/standard.html", "Standard Farm | Stardew Valley Farm Planner", "Standard Farm farm guide. Highest raw crop output and full layout flexibility.", "Standard Farm", "en"],
  ["/farm/riverland", "farm/riverland.html", "Riverland Farm | Stardew Valley Farm Planner", "Riverland Farm farm guide. Fishing runs. Most of Pelican Town's pool is catchable without leaving home.", "Riverland Farm", "en"],
  ["/farm/forest", "farm/forest.html", "Forest Farm | Stardew Valley Farm Planner", "Forest Farm farm guide. Hardwood and forage passive income. Good match for the Foraging profession.", "Forest Farm", "en"],
  ["/farm/hilltop", "farm/hilltop.html", "Hill-top Farm | Stardew Valley Farm Planner", "Hill-top Farm farm guide. Mining-heavy runs. A steady passive trickle of stone and ore from day one.", "Hill-top Farm", "en"],
  ["/farm/wilderness", "farm/wilderness.html", "Wilderness Farm | Stardew Valley Farm Planner", "Wilderness Farm farm guide. Combat farming. The only farm that spawns Iridium Golems, and the best Living Hat drop rate in the game.", "Wilderness Farm", "en"],
  ["/farm/four-corners", "farm/four-corners.html", "Four Corners Farm | Stardew Valley Farm Planner", "Four Corners Farm farm guide. Multiplayer runs. Solo players get a taste of every farm in one map.", "Four Corners Farm", "en"],
  ["/farm/beach", "farm/beach.html", "Beach Farm | Stardew Valley Farm Planner", "Beach Farm farm guide. Fishing, foraging, scenic ocean builds, and ranch layouts.", "Beach Farm", "en"],
  ["/farm/meadowlands", "farm/meadowlands.html", "Meadowlands Farm | Stardew Valley Farm Planner", "Meadowlands Farm farm guide. Ranching. Blue Grass removes the winter hay scramble.", "Meadowlands Farm", "en"],
  ["/zh", "zh.html", "星露谷农场规划器", "使用本地地图、物品和项目规划你的星露谷农场布局。", "适用于各种农场布局的星露谷物语规划器", "zh-CN"],
  ["/zh/farm-comparison", "zh/farm-comparison.html", "星露谷农场类型对比", "在规划布局前，对比《星露谷物语》的全部官方农场地图。", "星露谷农场类型对比", "zh-CN"],
  ["/zh/mods", "zh/mods.html", "星露谷模组规划器", "规划你的星露谷模组组合。", "星露谷模组规划器", "zh-CN"],
  [
    "/zh/privacy",
    "zh/privacy.html",
    "隐私政策",
    "了解星露谷农场规划器如何将项目保留在此浏览器中，不提供账户、云端同步或跟踪服务。",
    "隐私政策",
    "zh-CN",
    [
      "我们收集什么",
      "农场数据",
      "在线功能",
      "分析",
      "Cookie",
      "第三方",
      "数据删除",
      "本地使用",
      "联系消息",
    ],
  ],
  [
    "/zh/terms",
    "zh/terms.html",
    "服务条款",
    "阅读星露谷农场规划器的浏览器本地服务条款，包括本地项目、由你选择的 JSON 导入和导出，以及同人创作说明。",
    "服务条款",
    "zh-CN",
    [
      "这是什么",
      "账户",
      "在线功能",
      "你的数据",
      "可用性",
      "游戏素材",
      "联系消息",
    ],
  ],
  [
    "/zh/contact",
    "zh/contact.html",
    "联系我们 | 星露谷农场规划器",
    "向星露谷农场规划器团队发送消息。",
    "联系我们",
    "zh-CN",
  ],
  ["/zh/farm/standard", "zh/farm/standard.html", "标准农场 指南 | 星露谷规划器", "了解标准农场地图，并开始规划你的星露谷农场布局。", "标准农场", "zh-CN"],
  ["/zh/farm/riverland", "zh/farm/riverland.html", "河流农场 指南 | 星露谷规划器", "了解河流农场地图，并开始规划你的星露谷农场布局。", "河流农场", "zh-CN"],
  ["/zh/farm/forest", "zh/farm/forest.html", "森林农场 指南 | 星露谷规划器", "了解森林农场地图，并开始规划你的星露谷农场布局。", "森林农场", "zh-CN"],
  ["/zh/farm/hilltop", "zh/farm/hilltop.html", "山顶农场 指南 | 星露谷规划器", "了解山顶农场地图，并开始规划你的星露谷农场布局。", "山顶农场", "zh-CN"],
  ["/zh/farm/wilderness", "zh/farm/wilderness.html", "荒野农场 指南 | 星露谷规划器", "了解荒野农场地图，并开始规划你的星露谷农场布局。", "荒野农场", "zh-CN"],
  ["/zh/farm/four-corners", "zh/farm/four-corners.html", "四角农场 指南 | 星露谷规划器", "了解四角农场地图，并开始规划你的星露谷农场布局。", "四角农场", "zh-CN"],
  ["/zh/farm/beach", "zh/farm/beach.html", "海滩农场 指南 | 星露谷规划器", "了解海滩农场地图，并开始规划你的星露谷农场布局。", "海滩农场", "zh-CN"],
  ["/zh/farm/meadowlands", "zh/farm/meadowlands.html", "草原农场 指南 | 星露谷规划器", "了解草原农场地图，并开始规划你的星露谷农场布局。", "草原农场", "zh-CN"],
] as const;

const staticBlogPageExpectations: readonly StaticBlogPageExpectation[] = [
  {
    pathname: "/blog",
    staticPageFile: "blog.html",
    heading: "Stardew Valley Planning Guides",
    documentLanguage: "en",
    schemaType: "CollectionPage",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "Illustration of a timber workshop beneath pine-covered mountains",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "Illustration of a path leading from a farm toward a mountain workshop",
      },
    ],
  },
  {
    pathname: "/blog/archive",
    staticPageFile: "blog/archive.html",
    heading: "All articles",
    documentLanguage: "en",
    schemaType: "CollectionPage",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "Illustration of a timber workshop beneath pine-covered mountains",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "Illustration of a path leading from a farm toward a mountain workshop",
      },
    ],
  },
  {
    pathname: "/carpenter-stardew",
    staticPageFile: "carpenter-stardew.html",
    heading: "Carpenter in Stardew Valley: Robin's Shop, Hours, and Building Services",
    documentLanguage: "en",
    schemaType: "Article",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "Illustration of a timber workshop beneath pine-covered mountains",
      },
    ],
  },
  {
    pathname: "/where-is-robin-stardew-valley",
    staticPageFile: "where-is-robin-stardew-valley.html",
    heading: "Where Is Robin in Stardew Valley? Location, Hours, and Schedule",
    documentLanguage: "en",
    schemaType: "Article",
    coverImages: [
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "Illustration of a path leading from a farm toward a mountain workshop",
      },
    ],
  },
  {
    pathname: "/zh/blog",
    staticPageFile: "zh/blog.html",
    heading: "星露谷农场规划指南",
    documentLanguage: "zh-CN",
    schemaType: "CollectionPage",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "松林山脚下木工工坊的原创插画",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "从农场通往山间工坊的小路原创插画",
      },
    ],
  },
  {
    pathname: "/zh/blog/archive",
    staticPageFile: "zh/blog/archive.html",
    heading: "全部文章",
    documentLanguage: "zh-CN",
    schemaType: "CollectionPage",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "松林山脚下木工工坊的原创插画",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "从农场通往山间工坊的小路原创插画",
      },
    ],
  },
  {
    pathname: "/zh/carpenter-stardew",
    staticPageFile: "zh/carpenter-stardew.html",
    heading: "星露谷木匠指南：罗宾商店、营业时间与建筑升级",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "松林山脚下木工工坊的原创插画",
      },
    ],
  },
  {
    pathname: "/zh/where-is-robin-stardew-valley",
    staticPageFile: "zh/where-is-robin-stardew-valley.html",
    heading: "罗宾在星露谷物语的哪里？每日行程指南",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    coverImages: [
      {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "从农场通往山间工坊的小路原创插画",
      },
    ],
  },
];

const staticHomepageExpectations: readonly StaticHomepageExpectation[] = [
  {
    staticPageFile: "index.html",
    heroMarkup:
      '<h1>Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> for Every Farm Layout</h1>',
    heroSupportingCopy:
      "Design your farm directly in the browser. Choose from eight official farm types, place buildings, crops and decor, switch between seasons, and visualize important coverage ranges.",
    capabilityHeading: "Plan with the map in view",
    capabilityDescriptions: [
      "Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.",
      "Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.",
      "Create and save local projects without an account or cloud sync.",
    ],
    farmGuideHeading: "Choose a farm type before you plan",
    faqHeading: "Frequently asked questions",
    faqAnswers: [
      "Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.",
      "The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.",
      "You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.",
      "Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.",
      "Yes. The planner provides standard and high-quality screenshot downloads.",
    ],
    trustHeading: "About this planner",
    trustDescription:
      "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
    plannerHref: "#planner",
    farmComparisonHref: "/farm-comparison",
    moddedFarmsHref: "/mods",
    homepageHref: "/",
    jsonLdName: "Stardew Valley Farm Planner",
    jsonLdDescription:
      "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    jsonLdUrl: "https://stardewvalleyplanner.art",
  },
  {
    staticPageFile: "zh.html",
    heroMarkup:
      '<h1>适用于各种农场布局的<em data-homepage-hero-emphasis="true">星露谷物语</em>规划器</h1>',
    heroSupportingCopy:
      "直接在浏览器中设计农场。选择八种官方农场类型，放置建筑、作物和装饰，切换季节，并查看重要设施的覆盖范围。",
    capabilityHeading: "在地图中完成规划",
    capabilityDescriptions: [
      "从标准、河流、森林、山顶、荒野、四角、海滩或草原农场开始规划。地图选择器中还提供姜岛。",
      "放置建筑、作物、可放置物和装饰，同时查看洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
      "无需账号或云同步，直接在当前浏览器中创建并保存本地项目。",
    ],
    farmGuideHeading: "规划前先选择农场类型",
    faqHeading: "常见问题",
    faqAnswers: [
      "项目保存在当前浏览器本地。这里没有账号或云同步功能，因此请使用同一浏览器和设备重新打开项目。",
      "规划器包含标准、河流、森林、山顶、荒野、四角、海滩和草原农场。地图选择器中还提供姜岛。",
      "你可以在春、夏、秋、冬之间切换，并显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
      "可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。",
      "可以。规划器提供标准画质和高画质的截图下载。",
    ],
    trustHeading: "关于这个规划器",
    trustDescription:
      "这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。",
    plannerHref: "#planner",
    farmComparisonHref: "/zh/farm-comparison",
    moddedFarmsHref: "/zh/mods",
    homepageHref: "/zh",
    jsonLdName: "星露谷农场规划器",
    jsonLdDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
    jsonLdUrl: "https://stardewvalleyplanner.art/zh",
  },
];

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected prebuilt static page file: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

function parseStaticPageDocument(
  staticPageHtml: string,
  staticPageFile: string,
): XmlDocument {
  return new DOMParser({
    onError(errorLevel, errorMessage) {
      throw new Error(
        `Could not parse static page ${staticPageFile}: ${errorLevel}: ${errorMessage}`,
      );
    },
  }).parseFromString(staticPageHtml, "text/html");
}

function findMatchingCoverImageElements(
  staticPageDocument: XmlDocument,
  expectedCoverImage: Readonly<{ src: string; alt: string }>,
): XmlElement[] {
  return Array.from(staticPageDocument.getElementsByTagName("img")).filter(
    (imageElement) =>
      imageElement.getAttribute("src") === expectedCoverImage.src &&
      imageElement.getAttribute("alt") === expectedCoverImage.alt,
  );
}

function readInitialDocumentLanguage(
  staticPageHtml: string,
  pathname: string,
  staticPageFile: string,
): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);
  const firstHtmlTag = staticPageHtml.match(/<html\b[^>]*>/i)?.[0];

  if (!firstHtmlTag) {
    throw new Error(
      `Expected ${pathname} static artifact ${staticPagePath} to contain a generated <html ...> tag.`,
    );
  }

  const documentLanguage = firstHtmlTag.match(/\slang\s*=\s*(["'])([^"']*)\1/i)?.[2];

  if (!documentLanguage) {
    throw new Error(
      `Expected ${pathname} static artifact ${staticPagePath} first <html ...> tag to include a lang attribute.`,
    );
  }

  return documentLanguage;
}

function expectedCanonicalUrl(pathname: string): string {
  return `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;
}

function escapeHtmlAttributeValue(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function readWebApplicationStructuredData(
  staticPageHtml: string,
  staticPageFile: string,
): Record<string, unknown> {
  const serializedStructuredData = staticPageHtml.match(
    /<script type="application\/ld\+json">([^<]+)<\/script>/,
  )?.[1];

  if (serializedStructuredData === undefined) {
    throw new Error(
      `Expected ${staticPageFile} to contain a WebApplication JSON-LD script.`,
    );
  }

  const structuredData: unknown = JSON.parse(serializedStructuredData);

  if (typeof structuredData !== "object" || structuredData === null) {
    throw new Error(
      `Expected ${staticPageFile} WebApplication JSON-LD to be an object. Received: ${JSON.stringify(structuredData)}.`,
    );
  }

  return structuredData as Record<string, unknown>;
}

function expectStaticHomepageContent(
  staticPageHtml: string,
  expectedHomepage: StaticHomepageExpectation,
): void {
  expect(staticPageHtml).toContain('data-homepage-shell="true"');
  expect(staticPageHtml).toContain(expectedHomepage.heroMarkup);
  expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(staticPageHtml).toContain(expectedHomepage.heroSupportingCopy);
  expect(staticPageHtml).toContain(
    `<h2>${expectedHomepage.capabilityHeading}</h2>`,
  );
  for (const capabilityDescription of expectedHomepage.capabilityDescriptions) {
    expect(staticPageHtml).toContain(capabilityDescription);
  }
  expect(staticPageHtml).toContain(
    `<h2 id="homepage-farm-guides-heading">${expectedHomepage.farmGuideHeading}</h2>`,
  );
  expect(staticPageHtml).toContain(`<h2>${expectedHomepage.faqHeading}</h2>`);
  for (const faqAnswer of expectedHomepage.faqAnswers) {
    expect(staticPageHtml).toContain(faqAnswer);
  }
  expect(staticPageHtml).toContain(`<h2>${expectedHomepage.trustHeading}</h2>`);
  expect(staticPageHtml).toContain(expectedHomepage.trustDescription);
  expect(staticPageHtml).toContain('data-homepage-workspace="true"');
  expect(staticPageHtml).toContain('role="status">Loading planner…');
  expect(
    staticPageHtml.match(
      new RegExp(`href="${expectedHomepage.plannerHref}"`, "g"),
    ),
  ).toHaveLength(4);
  expect(staticPageHtml).toContain(`href="${expectedHomepage.farmComparisonHref}"`);
  expect(staticPageHtml).toContain(`href="${expectedHomepage.moddedFarmsHref}"`);
  expect(staticPageHtml).toContain(`href="${expectedHomepage.homepageHref}"`);
  expect(staticPageHtml.match(/data-homepage-farm-guide-link=/g)).toHaveLength(
    officialFarmTypes.length,
  );
  expect(
    readWebApplicationStructuredData(
      staticPageHtml,
      expectedHomepage.staticPageFile,
    ),
  ).toMatchObject({
    "@type": "WebApplication",
    name: expectedHomepage.jsonLdName,
    description: expectedHomepage.jsonLdDescription,
    url: expectedHomepage.jsonLdUrl,
  });
  expect(staticPageHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
  expect(staticPageHtml).not.toContain("reference-runtime-root");
  expect(staticPageHtml).not.toContain("/reference-runtime/bootstrap.mjs");
}

describe("static public pages", () => {
  it("requires a whitespace-delimited lang attribute on the first document html tag", () => {
    for (const nonLanguageAttributeHtml of [
      '<html data-lang="en">',
      '<html aria-lang="en">',
      '<html xml:lang="en">',
    ]) {
      expect(() =>
        readInitialDocumentLanguage(
          nonLanguageAttributeHtml,
          "/parser-fixture",
          "parser-fixture.html",
        ),
      ).toThrow(/first <html \.\.\.> tag to include a lang attribute/);
    }
  });

  it("exports crawler-discovery files alongside the public pages", () => {
    expect(existsSync(join(process.cwd(), "out", "robots.txt"))).toBe(true);
    expect(existsSync(join(process.cwd(), "out", "sitemap.xml"))).toBe(true);
  });

  it("exports all bilingual blog pages with article discovery metadata and original covers", () => {
    for (const {
      pathname,
      staticPageFile,
      heading,
      documentLanguage,
      schemaType,
      coverImages,
    } of staticBlogPageExpectations) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);
      const staticPageDocument = parseStaticPageDocument(
        staticPageHtml,
        staticPageFile,
      );
      const englishPathname = pathname.startsWith("/zh")
        ? pathname.replace(/^\/zh/, "") || "/"
        : pathname;
      const chinesePathname = `/zh${englishPathname === "/" ? "" : englishPathname}`;

      expect(
        readInitialDocumentLanguage(staticPageHtml, pathname, staticPageFile),
      ).toBe(documentLanguage);
      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(staticPageHtml).toContain(
        `<h1>${escapeHtmlAttributeValue(heading)}</h1>`,
      );
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${expectedCanonicalUrl(pathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="en" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="zh-CN" href="${expectedCanonicalUrl(chinesePathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="x-default" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        '<meta name="robots" content="noindex, follow"',
      );
      expect(staticPageHtml).toContain(`\"@type\":\"${schemaType}\"`);
      expect(staticPageHtml).not.toContain('id="reference-runtime-root"');
      expect(staticPageHtml).not.toContain(
        'src="/reference-runtime/bootstrap.mjs"',
      );

      for (const coverImage of coverImages) {
        const matchingCoverImageElements = findMatchingCoverImageElements(
          staticPageDocument,
          coverImage,
        );

        expect(
          matchingCoverImageElements,
          `Expected ${pathname} to contain a cover image with src=${coverImage.src} and alt=${coverImage.alt}.`,
        ).not.toHaveLength(0);

        for (const matchingCoverImageElement of matchingCoverImageElements) {
          expect(matchingCoverImageElement.getAttribute("width")).toBe("1672");
          expect(matchingCoverImageElement.getAttribute("height")).toBe("941");

          if (schemaType === "CollectionPage") {
            expect(matchingCoverImageElement.getAttribute("loading")).toBe(
              "lazy",
            );
          } else {
            expect(matchingCoverImageElement.getAttribute("loading")).not.toBe(
              "lazy",
            );
          }
        }
      }
    }
  });

  it("exports all bilingual public pages with static metadata and paired language alternates", () => {
    for (const [
      pathname,
      staticPageFile,
      expectedTitle,
      expectedDescription,
      expectedHeading,
      expectedDocumentLanguage,
      expectedSectionHeadings,
    ] of staticPublicPageExpectations) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);
      const englishPathname = pathname.startsWith("/zh")
        ? pathname.replace(/^\/zh/, "") || "/"
        : pathname;
      const chinesePathname = `/zh${englishPathname === "/" ? "" : englishPathname}`;
      const expectedNavigationLabel = pathname.startsWith("/zh")
        ? "公共导航"
        : "Public navigation";

      expect(
        readInitialDocumentLanguage(
          staticPageHtml,
          pathname,
          staticPageFile,
        ),
        `Expected ${pathname} static artifact ${join(process.cwd(), "out", staticPageFile)} to emit lang=${expectedDocumentLanguage} from its first <html ...> tag.`,
      ).toBe(expectedDocumentLanguage);

      expect(staticPageHtml).toContain(`<title>${expectedTitle}</title>`);
      expect(staticPageHtml).toContain(
        `<meta name="description" content="${escapeHtmlAttributeValue(expectedDescription)}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<meta property="og:image" content="${expectedSocialImageUrl}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<meta name="twitter:image" content="${expectedSocialImageUrl}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${expectedCanonicalUrl(pathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="en" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="zh-CN" href="${expectedCanonicalUrl(chinesePathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="x-default" href="${expectedCanonicalUrl(englishPathname)}"`,
      );

      if (pathname === "/contact" || pathname === "/zh/contact") {
        expect(staticPageHtml).toContain(
          '<meta name="robots" content="noindex, follow"/>',
        );
      }

      const expectedHomepage = staticHomepageExpectations.find(
        (homepageExpectation) =>
          homepageExpectation.staticPageFile === staticPageFile,
      );

      if (expectedHomepage !== undefined) {
        expectStaticHomepageContent(staticPageHtml, expectedHomepage);
        continue;
      }

      expect(staticPageHtml).toMatch(
        new RegExp(`<h1(?:\\s[^>]*)?>${expectedHeading}`),
      );
      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      for (const expectedSectionHeading of expectedSectionHeadings ?? []) {
        expect(staticPageHtml).toContain(`<h2>${expectedSectionHeading}</h2>`);
      }
      expect(staticPageHtml).toContain(`aria-label="${expectedNavigationLabel}"`);
      expect(staticPageHtml).not.toContain("data-homepage-farm-guides");
      expect(staticPageHtml).not.toContain("data-homepage-farm-guide-links");
      expect(staticPageHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
      expect(staticPageHtml).not.toContain("reference-runtime-root");
      expect(staticPageHtml).not.toContain(
        "/reference-runtime/bootstrap.mjs",
      );
    }

    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          !pathname.startsWith("/zh") && expectedDocumentLanguage === "en",
      ),
    ).toHaveLength(14);
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          pathname.startsWith("/zh") && expectedDocumentLanguage === "zh-CN",
      ),
    ).toHaveLength(14);
    expect(
      existsSync(
        join(
          process.cwd(),
          "out",
          "social-images",
          "stardew-valley-farm-planner.png",
        ),
      ),
    ).toBe(true);
  });

  it("exports all English and Chinese legal artifacts", () => {
    for (const staticPageFile of [
      "privacy.html",
      "terms.html",
      "zh/privacy.html",
      "zh/terms.html",
    ]) {
      expect(existsSync(join(process.cwd(), "out", staticPageFile))).toBe(true);
    }
  });

  it("exports global 404 artifacts with the English root document shell", () => {
    for (const staticPageFile of ["404.html", "_not-found.html"]) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);

      expect(
        readInitialDocumentLanguage(
          staticPageHtml,
          "/unknown-path",
          staticPageFile,
        ),
      ).toBe("en");
      expect(staticPageHtml).toMatch(
        /<link rel="stylesheet" href="\/_next\/static\/chunks\/[^"/]+\.css"/,
      );
      expect(staticPageHtml).toContain('<link rel="icon" href="/favicon.ico"/>');
      expect(staticPageHtml).toContain(
        '<body data-sveltekit-preload-data="hover">',
      );
      expect(staticPageHtml).toContain(
        "<title>404: This page could not be found.</title>",
      );
      expect(staticPageHtml).toContain("This page could not be found.");
      expect(staticPageHtml).toContain('<meta name="robots" content="noindex"/>');
    }
  });
});
