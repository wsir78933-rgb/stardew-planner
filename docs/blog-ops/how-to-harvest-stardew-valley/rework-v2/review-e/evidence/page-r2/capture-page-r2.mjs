const fs = await import("node:fs/promises");
const path = await import("node:path");
const crypto = await import("node:crypto");

const evidenceDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/page-r2";
const articleSlug = "how-to-harvest-stardew-valley";
const origin = "http://127.0.0.1:3004";

function articleUrl(locale) {
  if (locale !== "en" && locale !== "zh") {
    throw new Error(`Unsupported locale for article URL. Received: ${JSON.stringify(locale)}.`);
  }
  return locale === "en"
    ? `${origin}/${articleSlug}`
    : `${origin}/zh/${articleSlug}`;
}

function requireObject(value, label) {
  if (value === null || typeof value !== "object") {
    throw new Error(`${label} must be an object. Received: ${JSON.stringify(value)}.`);
  }
  return value;
}

async function writeJson(fileName, value) {
  const filePath = path.join(evidenceDirectory, fileName);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
  return filePath;
}

const task = await taskSpace("harvest page r2 acceptance");
const spaceRecord = {
  spaceId: task.spaceId,
  name: task.name,
  ownership: task.ownership,
  pageLabel: "p1",
};
await writeJson("taskspace.json", spaceRecord);
console.log(JSON.stringify({ event: "taskspace-created", ...spaceRecord }));

const page = task.page("p1");

async function setCssViewport(width, height, mobile) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  const info = requireObject(await page.info(), "page.info()");
  const measured = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
  }));
  if (measured.innerWidth !== width || measured.innerHeight !== height) {
    throw new Error(
      `Viewport inner size mismatch. Requested ${width}x${height}, mobile ${JSON.stringify(mobile)}. Measured ${JSON.stringify(measured)}. page.info ${JSON.stringify(info)}.`,
    );
  }
  return { info, measured };
}

async function collectPageFacts(locale, viewportName) {
  return page.evaluate(
    ({ expectedLocale, expectedViewport }) => {
      const article = document.querySelector("[data-blog-article='true']");
      if (!(article instanceof HTMLElement)) {
        return {
          error: `Missing [data-blog-article='true'] on ${location.href}.`,
        };
      }
      const bodyRoot = document.querySelector("#blog-article-how-to-harvest-stardew-valley");
      if (!(bodyRoot instanceof HTMLElement)) {
        return {
          error: `Missing #blog-article-how-to-harvest-stardew-valley on ${location.href}.`,
        };
      }

      function metaContent(selector) {
        const element = document.head.querySelector(selector);
        return element instanceof HTMLMetaElement ? element.content : null;
      }

      function linkHref(selector) {
        const element = document.head.querySelector(selector);
        return element instanceof HTMLLinkElement ? element.href : null;
      }

      const blocks = [...bodyRoot.querySelectorAll("h2, h3, p, li, figcaption")].map((node) => ({
        tag: node.tagName.toLowerCase(),
        id: node.id || null,
        text: node.textContent.replace(/\s+/g, " ").trim(),
      }));

      const images = [...article.querySelectorAll("img")].map((image) => {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        const figure = image.closest("figure");
        const caption = figure?.querySelector("figcaption");
        const picture = image.closest("picture");
        const avifSource = picture?.querySelector("source[type='image/avif']");
        return {
          alt: image.alt,
          src: image.getAttribute("src"),
          currentSrc: image.currentSrc,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          complete: image.complete,
          loading: image.getAttribute("loading"),
          widthAttr: image.getAttribute("width"),
          heightAttr: image.getAttribute("height"),
          figureId: figure?.id || null,
          caption: caption ? caption.textContent.replace(/\s+/g, " ").trim() : null,
          avifSrcSet: avifSource?.getAttribute("srcset") || null,
          objectFit: style.objectFit,
          objectPosition: style.objectPosition,
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
          rectLeft: Math.round(rect.left),
          rectRight: Math.round(rect.right),
        };
      });

      const articleLinks = [...bodyRoot.querySelectorAll("a")].map((anchor) => ({
        text: anchor.textContent.replace(/\s+/g, " ").trim(),
        href: anchor.getAttribute("href"),
        absoluteHref: anchor.href,
      }));

      const navigationLinks = [...document.querySelectorAll("nav a")].map((anchor) => ({
        text: anchor.textContent.replace(/\s+/g, " ").trim(),
        href: anchor.getAttribute("href"),
        hidden: anchor.closest("[hidden]") !== null,
      }));

      const jsonLd = [...document.querySelectorAll("script[type='application/ld+json']")].map(
        (script) => script.textContent,
      );

      const offenders = [];
      const viewportWidth = window.innerWidth;
      for (const element of document.body.querySelectorAll("h1, h2, h3, p, img, figure, nav, table, pre")) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          continue;
        }
        if (rect.left < -1 || rect.right > viewportWidth + 1) {
          offenders.push({
            tag: element.tagName.toLowerCase(),
            id: element.id || null,
            className: String(element.className).slice(0, 120),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          });
          if (offenders.length >= 12) {
            break;
          }
        }
      }

      const h1 = article.querySelector("header h1");
      const description = article.querySelector(".blog-article-description");
      return {
        error: null,
        expectedLocale,
        expectedViewport,
        url: location.href,
        title: document.title,
        h1: h1 ? h1.textContent.replace(/\s+/g, " ").trim() : null,
        visibleDescription: description
          ? description.textContent.replace(/\s+/g, " ").trim()
          : null,
        metaDescription: metaContent("meta[name='description']"),
        canonical: linkHref("link[rel='canonical']"),
        alternates: [...document.head.querySelectorAll("link[rel='alternate']")].map((link) => ({
          hreflang: link.getAttribute("hreflang"),
          href: link.href,
        })),
        openGraph: {
          title: metaContent("meta[property='og:title']"),
          description: metaContent("meta[property='og:description']"),
          url: metaContent("meta[property='og:url']"),
          type: metaContent("meta[property='og:type']"),
          image: metaContent("meta[property='og:image']"),
        },
        twitter: {
          card: metaContent("meta[name='twitter:card']"),
          title: metaContent("meta[name='twitter:title']"),
          description: metaContent("meta[name='twitter:description']"),
          image: metaContent("meta[name='twitter:image']"),
        },
        robots: metaContent("meta[name='robots']"),
        jsonLd,
        blocks,
        images,
        articleLinks,
        navigationLinks,
        overflow: {
          innerWidth: window.innerWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          documentClientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          offenders,
        },
        bodyText: bodyRoot.innerText,
        headerText: article.querySelector("header")?.innerText || "",
      };
    },
    { expectedLocale: locale, expectedViewport: viewportName },
  );
}

async function waitForDecodedImage(selector, label) {
  try {
    await page.waitForFunction(
      (imageSelector) => {
        const image = document.querySelector(imageSelector);
        return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      },
      selector,
      { timeout: 15000 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Image did not decode: ${label}. Selector: ${selector}. Cause: ${message}`);
  }
}

async function screenshotViewport(fileName) {
  const filePath = path.join(evidenceDirectory, fileName);
  const savedPath = await page.screenshot({ path: filePath, fullPage: false, scale: "css" });
  return savedPath;
}

async function scrollToSelector(selector) {
  const found = await page.evaluate((targetSelector) => {
    const element = document.querySelector(targetSelector);
    if (!(element instanceof Element)) {
      return false;
    }
    element.scrollIntoView({ block: "center", inline: "nearest" });
    return true;
  }, selector);
  if (!found) {
    throw new Error(`Cannot scroll to missing element. Selector: ${selector}. URL: ${await page.url()}.`);
  }
}

const captures = [];

async function captureLocale(locale, viewportName) {
  const facts = await collectPageFacts(locale, viewportName);
  if (facts.error) {
    throw new Error(
      `Page fact collection failed for ${locale} ${viewportName}. URL: ${await page.url()}. Error: ${facts.error}`,
    );
  }
  const beforeImages = facts.images.map((image) => ({
    figureId: image.figureId,
    src: image.src,
    currentSrc: image.currentSrc,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    loading: image.loading,
    complete: image.complete,
  }));
  const prefix = `${locale}-${viewportName}`;
  const topShot = await screenshotViewport(`${prefix}-top.png`);
  const topSnapshotPath = path.join(evidenceDirectory, `${prefix}-top.snapshot.txt`);
  await fs.writeFile(topSnapshotPath, String(await page.snapshot()));

  await scrollToSelector("[data-blog-article='true'] > header img");
  await waitForDecodedImage("[data-blog-article='true'] > header img", `${prefix} cover`);
  const coverShot = await screenshotViewport(`${prefix}-cover.png`);

  await scrollToSelector("#media-mature-crops img");
  await waitForDecodedImage("#media-mature-crops img", `${prefix} mature crops`);
  const matureShot = await screenshotViewport(`${prefix}-mature.png`);

  await scrollToSelector("#media-trellis-paths img");
  await waitForDecodedImage("#media-trellis-paths img", `${prefix} trellis paths`);
  const trellisShot = await screenshotViewport(`${prefix}-trellis.png`);

  await scrollToSelector("#blog-article-how-to-harvest-stardew-valley h2:last-of-type");
  const bottomShot = await screenshotViewport(`${prefix}-bottom.png`);

  const fullSnapshotPath = path.join(evidenceDirectory, `${prefix}-full.snapshot.txt`);
  await fs.writeFile(fullSnapshotPath, String(await page.snapshot({ scope: "full_page" })));

  const afterFacts = await collectPageFacts(locale, viewportName);
  if (afterFacts.error) {
    throw new Error(
      `Post-scroll fact collection failed for ${locale} ${viewportName}. Error: ${afterFacts.error}`,
    );
  }
  const record = {
    locale,
    viewportName,
    url: afterFacts.url,
    title: afterFacts.title,
    h1: afterFacts.h1,
    beforeImages,
    screenshots: {
      top: topShot,
      cover: coverShot,
      mature: matureShot,
      trellis: trellisShot,
      bottom: bottomShot,
    },
    snapshots: {
      top: topSnapshotPath,
      full: fullSnapshotPath,
    },
    facts: afterFacts,
  };
  const factsPath = await writeJson(`${prefix}-facts.json`, record);
  captures.push({ locale, viewportName, url: record.url, factsPath });
  console.log(JSON.stringify({ event: "captured", locale, viewportName, url: record.url, factsPath }));
  return record;
}

async function openArticle(locale) {
  const url = articleUrl(locale);
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector("[data-blog-article='true'] h1", { state: "visible", timeout: 15000 });
  const landed = await page.url();
  if (landed !== url && landed !== `${url}/`) {
    throw new Error(`Article navigation landed on an unexpected URL. Requested ${url}. Received ${landed}.`);
  }
}

async function clickBlogNavigation(locale, viewportName) {
  const blogHref = locale === "en" ? "/blog" : "/zh/blog";
  await page.click(`[data-public-page-navigation-links] a[href='${blogHref}']`, {
    label: "open blog navigation",
  });
  await page.waitForURL((url) => url.pathname === blogHref, { timeout: 15000 });
  const landed = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || null,
  }));
  const shot = await screenshotViewport(`${locale}-${viewportName}-nav-blog.png`);
  if (!landed.url.includes(blogHref)) {
    throw new Error(
      `Blog navigation did not reach ${blogHref}. Locale ${locale}. Viewport ${viewportName}. Received ${JSON.stringify(landed)}.`,
    );
  }
  return { landed, shot };
}

async function clickLanguage(targetLocale) {
  const targetHref = targetLocale === "zh" ? `/zh/${articleSlug}` : `/${articleSlug}`;
  await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
  await page.waitForSelector(`a[data-homepage-language-option][href='${targetHref}']`, {
    state: "visible",
    timeout: 5000,
  });
  const optionSnapshot = String(await page.snapshot());
  await fs.writeFile(
    path.join(evidenceDirectory, `language-menu-before-${targetLocale}.snapshot.txt`),
    optionSnapshot,
  );
  await page.click(`a[data-homepage-language-option][href='${targetHref}']`, {
    label: targetLocale === "zh" ? "switch to Chinese article" : "switch to English article",
  });
  await page.waitForURL((url) => url.pathname === targetHref, { timeout: 15000 });
  await page.waitForSelector("[data-blog-article='true'] h1", { state: "visible", timeout: 15000 });
  const landed = await page.url();
  if (!landed.endsWith(targetHref)) {
    throw new Error(
      `Language switch landed on an unexpected URL. Requested path ${targetHref}. Received ${landed}.`,
    );
  }
}

const operationStore = JSON.parse(
  await fs.readFile(
    path.resolve(evidenceDirectory, "../../../../operation-store.json"),
    "utf8",
  ),
);
if (typeof operationStore.canary !== "string" || operationStore.canary.length === 0) {
  throw new Error(
    `operation-store canary must be a non-empty string. Received type ${typeof operationStore.canary}.`,
  );
}

const desktopViewport = await setCssViewport(1440, 900, false);
await openArticle("en");
const desktopEnglishNavigation = await clickBlogNavigation("en", "desktop-1440x900");
await openArticle("en");
const desktopEnglish = await captureLocale("en", "desktop-1440x900");
await clickLanguage("zh");
const desktopChinese = await captureLocale("zh", "desktop-1440x900");

const mobileViewport = await setCssViewport(390, 844, true);
await openArticle("en");
const mobileEnglishNavigation = await clickBlogNavigation("en", "mobile-390x844");
await openArticle("en");
const mobileEnglish = await captureLocale("en", "mobile-390x844");
await clickLanguage("zh");
const mobileChinese = await captureLocale("zh", "mobile-390x844");

await setCssViewport(1440, 900, false);
await openArticle("en");

const fetchedImages = [];
for (const record of [desktopEnglish, desktopChinese]) {
  for (const image of record.facts.images) {
    if (typeof image.currentSrc !== "string" || image.currentSrc.length === 0) {
      throw new Error(
        `Decoded image is missing currentSrc. Locale ${record.locale}. Image ${JSON.stringify(image)}.`,
      );
    }
    const sourceUrl = new URL(image.currentSrc);
    const fileName = `${record.locale}-${path.basename(sourceUrl.pathname)}`;
    const savePath = path.join(evidenceDirectory, fileName);
    await page.fetch(image.currentSrc, { saveAs: savePath });
    const bytes = await fs.readFile(savePath);
    fetchedImages.push({
      locale: record.locale,
      figureId: image.figureId,
      currentSrc: image.currentSrc,
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      savePath,
    });
  }
}

const markerNeedles = [
  "ResearchTrace",
  "operation-store",
  "rework-v2",
  "docs/blog-ops",
  "placeholder",
  "lorem ipsum",
  "TODO",
  "FIXME",
  "as an AI",
  "私有",
  "研究痕迹",
  "worker_done",
];
const markerHits = [];
for (const record of [desktopEnglish, desktopChinese, mobileEnglish, mobileChinese]) {
  const haystack = `${record.facts.headerText}\n${record.facts.bodyText}\n${record.facts.title}`;
  const hits = markerNeedles.filter((needle) => haystack.toLowerCase().includes(needle.toLowerCase()));
  const canaryPresent = haystack.includes(operationStore.canary) || JSON.stringify(record.facts.jsonLd).includes(operationStore.canary);
  markerHits.push({
    locale: record.locale,
    viewportName: record.viewportName,
    hits,
    canaryPresent,
  });
}

const summary = {
  spaceId: task.spaceId,
  finished: false,
  restingUrl: await page.url(),
  desktopViewport,
  mobileViewport,
  navigation: {
    desktopEnglish: desktopEnglishNavigation,
    mobileEnglish: mobileEnglishNavigation,
  },
  captures,
  fetchedImages,
  markerHits,
};
const summaryPath = await writeJson("capture-summary.json", summary);
console.log(JSON.stringify({ event: "capture-complete", spaceId: task.spaceId, summaryPath, restingUrl: summary.restingUrl }));
