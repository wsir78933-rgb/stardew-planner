const fs = await import("node:fs/promises");
const path = await import("node:path");

const evidenceDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/page-r2";
const articleSlug = "how-to-harvest-stardew-valley";
const origin = "http://127.0.0.1:3004";

function articleUrl(locale) {
  if (locale !== "en" && locale !== "zh") {
    throw new Error(`Unsupported locale for article URL. Received: ${JSON.stringify(locale)}.`);
  }
  return locale === "en" ? `${origin}/${articleSlug}` : `${origin}/zh/${articleSlug}`;
}

const task = await taskSpace(151);
if (task.spaceId !== 151) {
  throw new Error(`Resumed an unexpected TaskSpace. Requested 151. Received ${task.spaceId}.`);
}
const page = task.page("p1");
console.log(JSON.stringify({ event: "resumed", spaceId: task.spaceId, ownership: task.ownership }));

await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
const measured = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
}));
if (measured.innerWidth !== 390 || measured.innerHeight !== 844) {
  throw new Error(`Mobile viewport mismatch. Requested 390x844. Measured ${JSON.stringify(measured)}.`);
}

async function writeJson(fileName, value) {
  const filePath = path.join(evidenceDirectory, fileName);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
  return filePath;
}

async function openArticle(locale) {
  const url = articleUrl(locale);
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  let ready = await page.evaluate(() => ({
    h1: document.querySelector("[data-blog-article='true'] h1")?.textContent || null,
    start: document.body.innerText.slice(0, 400),
  }));
  if (!ready.h1) {
    await fs.writeFile(
      path.join(evidenceDirectory, `${locale}-mobile-390x844-overlay.txt`),
      ready.start,
    );
    await page.reload({ waitUntil: "load", timeout: 30000 });
    ready = await page.evaluate(() => ({
      h1: document.querySelector("[data-blog-article='true'] h1")?.textContent || null,
      url: location.href,
      start: document.body.innerText.slice(0, 400),
    }));
    if (!ready.h1) {
      throw new Error(
        `Mobile article did not render after one reload. Locale ${locale}. Requested ${url}. Received ${JSON.stringify(ready)}.`,
      );
    }
  }
  const landed = await page.url();
  if (landed !== url && landed !== `${url}/`) {
    throw new Error(`Mobile article landed on an unexpected URL. Requested ${url}. Received ${landed}.`);
  }
}

async function waitForPaintedImage(selector) {
  try {
    await page.waitForFunction((targetSelector) => {
      const image = document.querySelector(targetSelector);
      if (!(image instanceof HTMLImageElement) || !image.complete || image.naturalWidth < 1) {
        return false;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 4;
      canvas.height = 4;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        return false;
      }
      context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, 4, 4);
      const pixels = context.getImageData(0, 0, 4, 4).data;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        if (!(red > 245 && green > 245 && blue > 245)) {
          return true;
        }
      }
      return false;
    }, selector, { timeout: 15000 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Image did not paint: ${selector}. Cause: ${message}`);
  }
}

async function collectFacts(locale) {
  return page.evaluate((expectedLocale) => {
    const article = document.querySelector("[data-blog-article='true']");
    const bodyRoot = document.querySelector("#blog-article-how-to-harvest-stardew-valley");
    if (!(article instanceof HTMLElement) || !(bodyRoot instanceof HTMLElement)) {
      return { error: `Missing article nodes at ${location.href}.` };
    }
    const viewportWidth = window.innerWidth;
    const offenders = [];
    for (const element of document.body.querySelectorAll("h1, h2, p, img, figure, nav, a")) {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        continue;
      }
      if (rect.left < -1 || rect.right > viewportWidth + 1) {
        offenders.push({
          tag: element.tagName.toLowerCase(),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
        });
        if (offenders.length >= 8) {
          break;
        }
      }
    }
    return {
      error: null,
      expectedLocale,
      url: location.href,
      title: document.title,
      h1: article.querySelector("header h1")?.textContent.replace(/\s+/g, " ").trim() || null,
      images: [...article.querySelectorAll("img")].map((image) => {
        const rect = image.getBoundingClientRect();
        return {
          alt: image.alt,
          src: image.getAttribute("src"),
          currentSrc: image.currentSrc,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          loading: image.getAttribute("loading"),
          figureId: image.closest("figure")?.id || null,
          caption: image.closest("figure")?.querySelector("figcaption")?.textContent.replace(/\s+/g, " ").trim() || null,
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
          rectLeft: Math.round(rect.left),
          rectRight: Math.round(rect.right),
        };
      }),
      articleLinks: [...bodyRoot.querySelectorAll("a")].map((anchor) => ({
        text: anchor.textContent.replace(/\s+/g, " ").trim(),
        href: anchor.getAttribute("href"),
      })),
      overflow: {
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        documentClientWidth: document.documentElement.clientWidth,
        offenders,
      },
    };
  }, locale);
}

async function capture(locale) {
  const prefix = `${locale}-mobile-390x844`;
  const before = await collectFacts(locale);
  if (before.error) {
    throw new Error(`Mobile fact collection failed for ${locale}. ${before.error}`);
  }
  await fs.writeFile(
    path.join(evidenceDirectory, `${prefix}-top.snapshot.txt`),
    String(await page.snapshot()),
  );
  const shots = {};
  shots.top = await page.screenshot({
    path: path.join(evidenceDirectory, `${prefix}-top.png`),
    fullPage: false,
    scale: "css",
  });
  const targets = [
    ["cover", "[data-blog-article='true'] > header img"],
    ["mature", "#media-mature-crops img"],
    ["trellis", "#media-trellis-paths img"],
  ];
  for (const [name, selector] of targets) {
    const found = await page.evaluate((targetSelector) => {
      const element = document.querySelector(targetSelector);
      if (!(element instanceof Element)) {
        return false;
      }
      element.scrollIntoView({ block: "center", inline: "nearest" });
      return true;
    }, selector);
    if (!found) {
      throw new Error(`Missing mobile image. Locale ${locale}. Selector ${selector}.`);
    }
    await waitForPaintedImage(selector);
    shots[name] = await page.screenshot({
      path: path.join(evidenceDirectory, `${prefix}-${name}.png`),
      fullPage: false,
      scale: "css",
    });
  }
  await fs.writeFile(
    path.join(evidenceDirectory, `${prefix}-full.snapshot.txt`),
    String(await page.snapshot({ scope: "full_page" })),
  );
  const after = await collectFacts(locale);
  if (after.error) {
    throw new Error(`Mobile post-scroll facts failed for ${locale}. ${after.error}`);
  }
  const factsPath = await writeJson(`${prefix}-facts.json`, { beforeImages: before.images, shots, facts: after });
  console.log(JSON.stringify({ event: "captured", locale, factsPath, overflow: after.overflow }));
  return after;
}

await openArticle("en");
await page.click("[data-public-page-navigation-links] a[href='/blog']", { label: "open blog navigation" });
await page.waitForURL((url) => url.pathname === "/blog", { timeout: 15000 });
const blogShot = await page.screenshot({
  path: path.join(evidenceDirectory, "en-mobile-390x844-nav-blog.png"),
  fullPage: false,
  scale: "css",
});
const blogState = await page.evaluate(() => ({ url: location.href, h1: document.querySelector("h1")?.textContent || null }));
if (!blogState.url.includes("/blog")) {
  throw new Error(`Mobile blog navigation failed. Received ${JSON.stringify(blogState)}.`);
}
await openArticle("en");
const english = await capture("en");
await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
await page.waitForSelector("a[data-homepage-language-option][href='/zh/how-to-harvest-stardew-valley']", {
  state: "visible",
  timeout: 5000,
});
await fs.writeFile(
  path.join(evidenceDirectory, "language-menu-mobile-zh.snapshot.txt"),
  String(await page.snapshot()),
);
await page.click("a[data-homepage-language-option][href='/zh/how-to-harvest-stardew-valley']", {
  label: "switch to Chinese article",
});
await page.waitForURL((url) => url.pathname === "/zh/how-to-harvest-stardew-valley", { timeout: 15000 });
await page.waitForSelector("[data-blog-article='true'] h1", { state: "visible", timeout: 15000 });
const chinese = await capture("zh");

const portalText = await page.evaluate(() => {
  const portal = document.querySelector("nextjs-portal");
  const shadowText = portal?.shadowRoot?.textContent?.replace(/\s+/g, " ").trim() || "";
  return shadowText.slice(0, 500);
});
await fs.writeFile(path.join(evidenceDirectory, "next-portal-text.txt"), `${portalText}\n`);

await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await openArticle("en");
console.log(JSON.stringify({
  event: "mobile-complete",
  spaceId: task.spaceId,
  finished: false,
  restingUrl: await page.url(),
  blogShot,
  blogState,
  englishTitle: english.title,
  chineseTitle: chinese.title,
  portalText,
}));
