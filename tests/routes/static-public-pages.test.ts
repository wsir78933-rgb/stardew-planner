import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
      "Local use",
    ],
  ],
  ["/farm/standard", "farm/standard.html", "Standard Farm | Stardew Valley Farm Planner", "Standard Farm farm guide. Highest raw crop output and full layout flexibility.", "Standard Farm", "en"],
  ["/farm/riverland", "farm/riverland.html", "Riverland Farm | Stardew Valley Farm Planner", "Riverland Farm farm guide. Fishing runs. Most of Pelican Town's pool is catchable without leaving home.", "Riverland Farm", "en"],
  ["/farm/forest", "farm/forest.html", "Forest Farm | Stardew Valley Farm Planner", "Forest Farm farm guide. Hardwood and forage passive income. Good match for the Foraging profession.", "Forest Farm", "en"],
  ["/farm/hilltop", "farm/hilltop.html", "Hill-top Farm | Stardew Valley Farm Planner", "Hill-top Farm farm guide. Mining-heavy runs. A steady passive trickle of stone and ore from day one.", "Hill-top Farm", "en"],
  ["/farm/wilderness", "farm/wilderness.html", "Wilderness Farm | Stardew Valley Farm Planner", "Wilderness Farm farm guide. Combat farming. The only farm that spawns Iridium Golems, and the best Living Hat drop rate in the game.", "Wilderness Farm", "en"],
  ["/farm/four-corners", "farm/four-corners.html", "Four Corners Farm | Stardew Valley Farm Planner", "Four Corners Farm farm guide. Multiplayer runs. Solo players get a taste of every farm in one map.", "Four Corners Farm", "en"],
  ["/farm/beach", "farm/beach.html", "Beach Farm | Stardew Valley Farm Planner", "Beach Farm farm guide. Fishing, foraging, scenic ocean builds, and ranch layouts.", "Beach Farm", "en"],
  ["/farm/meadowlands", "farm/meadowlands.html", "Meadowlands Farm | Stardew Valley Farm Planner", "Meadowlands Farm farm guide. Ranching. Blue Grass removes the winter hay scramble.", "Meadowlands Farm", "en"],
  ["/zh", "zh.html", "星露谷农场规划器", "使用本地地图、物品和项目规划你的星露谷农场布局。", "星露谷农场规划器", "zh-CN"],
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
      "本地使用",
    ],
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

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected prebuilt static page file: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
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

      if (staticPageFile === "index.html") {
        expect(staticPageHtml).toContain("WebApplication");
        expect(staticPageHtml).toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
        expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
        expect(staticPageHtml).toContain(
          `<h1>Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> for Every Farm Layout</h1>`,
        );
        for (const capabilityDescription of [
          "Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.",
          "Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.",
          "Create and save local projects without an account or cloud sync.",
        ]) {
          expect(staticPageHtml).toContain(capabilityDescription);
        }
        for (const faqAnswer of [
          "Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.",
          "The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.",
          "You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.",
          "Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.",
          "Yes. The planner provides standard and high-quality screenshot downloads.",
        ]) {
          expect(staticPageHtml).toContain(faqAnswer);
        }
        expect(staticPageHtml).toContain("About this planner");
        expect(staticPageHtml).toContain(
          "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
        );
        expect(staticPageHtml.match(/data-homepage-farm-guide-link=/g)).toHaveLength(
          officialFarmTypes.length,
        );
        expect(staticPageHtml).toContain('href="/farm-comparison"');
        expect(staticPageHtml).toContain('href="/mods">Modded farms</a>');
        continue;
      }

      expect(staticPageHtml).toContain(`<h1>${expectedHeading}`);
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

    expect(readStaticPageHtml("zh.html")).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
    expect(readStaticPageHtml("zh.html")).not.toContain("reference-runtime-root");
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          !pathname.startsWith("/zh") && expectedDocumentLanguage === "en",
      ),
    ).toHaveLength(13);
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          pathname.startsWith("/zh") && expectedDocumentLanguage === "zh-CN",
      ),
    ).toHaveLength(13);
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
