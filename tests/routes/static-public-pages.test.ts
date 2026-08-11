import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DOMParser,
  type Document as XmlDocument,
  type Element as XmlElement,
} from "@xmldom/xmldom";
import { describe, expect, it } from "vitest";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
  shouldIndex: boolean;
  coverImages: readonly Readonly<{ src: string; alt: string }>[];
}>;

type StaticHomepageExpectation = Readonly<{
  staticPageFile: "index.html" | "zh.html";
  heroMarkup: string;
  heroSupportingCopy: string;
  capabilityHeading: string;
  capabilityDescriptions: readonly string[];
  faqHeading: string;
  faqAnswers: readonly string[];
  trustHeading: string;
  trustDescription: string;
  plannerHref: string;
  blogHref: string;
  blogLabel: string;
  homepageHref: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdUrl: string;
  jsonLdLocale: "en" | "zh-CN";
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
  ["/zh", "zh.html", "星露谷农场规划器", "使用本地地图、物品和项目规划你的星露谷农场布局。", "适用于各种农场布局的星露谷物语规划器", "zh-CN"],
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
] as const;

const staticBlogPageExpectations: readonly StaticBlogPageExpectation[] = [
  {
    pathname: "/blog",
    staticPageFile: "blog.html",
    heading: "Stardew Valley Planning Guides",
    documentLanguage: "en",
    schemaType: "CollectionPage",
    shouldIndex: false,
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
    shouldIndex: false,
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
    heading: "Carpenter in Stardew Valley: Robin's Hours and Services",
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: false,
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
    heading: "Where Is Robin in Stardew Valley? Location and Hours",
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: false,
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
    shouldIndex: false,
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
    shouldIndex: false,
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
    heading: "星露谷木匠罗宾：营业时间、建筑服务与下单规划",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: false,
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
    heading: "罗宾在星露谷物语的哪里？位置、营业时间与特殊行程",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: false,
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
      '<h1>Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> – Free Online Farm Layout Tool</h1>',
    heroSupportingCopy:
      "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    capabilityHeading: "Plan with the map in view",
    capabilityDescriptions: [
      "Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.",
      "Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.",
      "Create and save local projects without an account or cloud sync.",
    ],
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
    blogHref: "/blog",
    blogLabel: "Blog",
    homepageHref: "/",
    jsonLdName: "Stardew Valley Farm Planner",
    jsonLdDescription:
      "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    jsonLdUrl: "https://stardewvalleyplanner.art",
    jsonLdLocale: "en",
  },
  {
    staticPageFile: "zh.html",
    heroMarkup:
      '<h1>星露谷物语<em data-homepage-hero-emphasis="true">规划器</em>——免费在线农场布局工具</h1>',
    heroSupportingCopy:
      "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
    capabilityHeading: "在地图中完成规划",
    capabilityDescriptions: [
      "从标准、河流、森林、山顶、荒野、四角、海滩或草原农场开始规划。地图选择器中还提供姜岛。",
      "放置建筑、作物、可放置物和装饰，同时查看洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
      "无需账号或云同步，直接在当前浏览器中创建并保存本地项目。",
    ],
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
    blogHref: "/zh/blog",
    blogLabel: "博客",
    homepageHref: "/zh",
    jsonLdName: "星露谷农场规划器",
    jsonLdDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
    jsonLdUrl: "https://stardewvalleyplanner.art/zh",
    jsonLdLocale: "zh-CN",
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

function readJsonLdStructuredData(
  staticPageHtml: string,
  staticPageFile: string,
): readonly Record<string, unknown>[] {
  const staticPageDocument = parseStaticPageDocument(
    staticPageHtml,
    staticPageFile,
  );
  const jsonLdScriptElements = Array.from(
    staticPageDocument.getElementsByTagName("script"),
  ).filter(
    (scriptElement) =>
      scriptElement.getAttribute("type") === "application/ld+json",
  );

  if (jsonLdScriptElements.length === 0) {
    throw new Error(
      `Expected ${staticPageFile} to contain at least one JSON-LD script.`,
    );
  }

  return jsonLdScriptElements.map((scriptElement, index) => {
    const serializedStructuredData = scriptElement.textContent ?? "";
    let structuredData: unknown;

    try {
      structuredData = JSON.parse(serializedStructuredData);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Expected ${staticPageFile} JSON-LD script ${index + 1} to contain valid JSON. Received: ${JSON.stringify(serializedStructuredData)}.`,
        );
      }

      throw error;
    }

    if (typeof structuredData !== "object" || structuredData === null) {
      throw new Error(
        `Expected ${staticPageFile} JSON-LD script ${index + 1} to be an object. Received: ${JSON.stringify(structuredData)}.`,
      );
    }

    return structuredData as Record<string, unknown>;
  });
}

function findStructuredDataByType(
  structuredDataEntries: readonly Record<string, unknown>[],
  schemaType: string,
): readonly Record<string, unknown>[] {
  return structuredDataEntries.filter(
    (structuredData) => structuredData["@type"] === schemaType,
  );
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
  expect(staticPageHtml).not.toContain("data-homepage-farm-guides");
  expect(staticPageHtml).not.toContain("data-homepage-farm-guide-links");
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
  ).toHaveLength(3);
  expect(staticPageHtml).toContain(
    `<a href="${expectedHomepage.blogHref}">${expectedHomepage.blogLabel}</a>`,
  );
  expect(staticPageHtml).not.toContain('href="/farm-comparison"');
  expect(staticPageHtml).not.toContain('href="/mods"');
  expect(staticPageHtml).not.toContain('href="/zh/farm-comparison"');
  expect(staticPageHtml).not.toContain('href="/zh/mods"');
  expect(staticPageHtml).toContain(`href="${expectedHomepage.homepageHref}"`);
  const structuredDataEntries = readJsonLdStructuredData(
    staticPageHtml,
    expectedHomepage.staticPageFile,
  );
  const webApplications = findStructuredDataByType(
    structuredDataEntries,
    "WebApplication",
  );
  const websites = findStructuredDataByType(structuredDataEntries, "WebSite");

  expect(webApplications).toHaveLength(1);
  expect(webApplications[0]).toMatchObject({
    "@type": "WebApplication",
    name: expectedHomepage.jsonLdName,
    description: expectedHomepage.jsonLdDescription,
    url: expectedHomepage.jsonLdUrl,
    inLanguage: expectedHomepage.jsonLdLocale,
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });

  if (expectedHomepage.jsonLdLocale === "en") {
    expect(websites).toHaveLength(1);
    expect(websites[0]).toMatchObject({
      "@type": "WebSite",
      "@id": "https://stardewvalleyplanner.art/#website",
      name: "Stardew Valley Planner",
      url: "https://stardewvalleyplanner.art",
      inLanguage: ["en", "zh-CN"],
    });
  } else {
    expect(websites).toHaveLength(0);
  }
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

  it("reads real JSON-LD script elements while ignoring commented markup", () => {
    const fixtureStructuredData = readJsonLdStructuredData(
      `<!doctype html>
      <html><head>
        <!-- <script type="application/ld+json">{"@type":"Ignored"}</script> -->
        <script data-test="website" type="application/ld+json">{"@type":"WebSite"}</script>
        <script nonce="fixture" type="application/ld+json">{"@type":"WebApplication"}</script>
      </head><body></body></html>`,
      "json-ld-parser-fixture.html",
    );

    expect(fixtureStructuredData).toHaveLength(2);
    expect(fixtureStructuredData.map((entry) => entry["@type"])).toEqual([
      "WebSite",
      "WebApplication",
    ]);
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
      shouldIndex,
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
        `<meta name="robots" content="${shouldIndex ? "index" : "noindex"}, follow"`,
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
        expect(staticPageHtml).toMatch(
          new RegExp(
            `<h2(?:\\s[^>]*)?>${escapeRegularExpression(expectedSectionHeading)}</h2>`,
          ),
        );
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
    ).toHaveLength(4);
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          pathname.startsWith("/zh") && expectedDocumentLanguage === "zh-CN",
      ),
    ).toHaveLength(4);
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
