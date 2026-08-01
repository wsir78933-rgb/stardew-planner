import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const staticPublicPageExpectations = [
  [
    "/",
    "index.html",
    "Stardew Valley Farm Planner",
    "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    "Plan a farm",
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

      expect(staticPageHtml).toContain(`<h1>${expectedHeading}`);
      expect(staticPageHtml).toContain(`<title>${expectedTitle}</title>`);
      expect(staticPageHtml).toContain(
        `<meta name="description" content="${escapeHtmlAttributeValue(expectedDescription)}"/>`,
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
        continue;
      }

      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(staticPageHtml).toContain(`aria-label="${expectedNavigationLabel}"`);
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
    ).toHaveLength(11);
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          pathname.startsWith("/zh") && expectedDocumentLanguage === "zh-CN",
      ),
    ).toHaveLength(11);
  });

  it("does not export deleted legal artifacts", () => {
    expect(existsSync(join(process.cwd(), "out", "privacy.html"))).toBe(false);
    expect(existsSync(join(process.cwd(), "out", "terms.html"))).toBe(false);
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
