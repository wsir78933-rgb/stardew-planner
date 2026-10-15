const previewDirectory =
  "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/verification/preview";
const origin = "http://127.0.0.1:3004";

const task = await taskSpace("harvest restart reread");
const page = task.page("p1");
console.log(JSON.stringify({ spaceId: task.spaceId, page: page.label }));

async function setViewport(width, height, mobile) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });
}

async function readPageState() {
  await page.waitForSelector("h1", { timeout: 20000 });
  return page.evaluate(() => {
    const root = document.documentElement;
    const viewportWidth = window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("img, table, figure, pre, article")) {
      const rect = el.getBoundingClientRect();
      const overflowX = el.scrollWidth - el.clientWidth;
      if (rect.right > viewportWidth + 1 || rect.left < -1 || overflowX > 1) {
        offenders.push({
          tag: el.tagName,
          className: String(el.className),
          rectLeft: Math.round(rect.left),
          rectRight: Math.round(rect.right),
          rectWidth: Math.round(rect.width),
        });
      }
    }
    const figure = document.querySelector("figure.blog-article-media");
    const figureImage = figure?.querySelector("img") ?? null;
    const figureRect = figure?.getBoundingClientRect() ?? null;
    return {
      url: location.href,
      pathname: location.pathname,
      title: document.title,
      h1: document.querySelector("h1")?.textContent ?? null,
      viewportWidth,
      viewportHeight: window.innerHeight,
      pageOverflow: root.scrollWidth - root.clientWidth,
      sources: document.querySelector(".blog-sources") !== null,
      plannerCta: document.querySelector("[data-blog-planner-cta]") !== null,
      offenders,
      figure: figureRect
        ? {
            left: Math.round(figureRect.left),
            top: Math.round(figureRect.top),
            width: Math.round(figureRect.width),
            height: Math.round(figureRect.height),
            right: Math.round(figureRect.right),
            naturalWidth: figureImage?.naturalWidth ?? 0,
            naturalHeight: figureImage?.naturalHeight ?? 0,
            currentSrc: figureImage?.currentSrc ?? null,
            loading: figureImage?.getAttribute("loading") ?? null,
            decoding: figureImage?.getAttribute("decoding") ?? null,
            attrWidth: figureImage?.getAttribute("width") ?? null,
            attrHeight: figureImage?.getAttribute("height") ?? null,
          }
        : null,
    };
  });
}

async function openArticle(pathname) {
  await page.goto(`${origin}${pathname}`);
  await page.waitForLoadState("load");
  await page.waitForSelector("h1", { timeout: 20000 });
}

async function settleFigure() {
  await page.evaluate(() => {
    document.querySelector("figure.blog-article-media")?.scrollIntoView({
      block: "center",
    });
  });
  await page.waitForFunction(
    () => {
      const image = document.querySelector("figure.blog-article-media img");
      return image instanceof HTMLImageElement && image.naturalWidth > 0;
    },
    undefined,
    { timeout: 15000 },
  );
  await page.waitForTimeout(800);
}

const shots = [];

await setViewport(1280, 800, false);
await openArticle("/how-to-harvest-stardew-valley");
const englishDesktop = await readPageState();
const englishDesktopShot = await page.screenshot({
  path: `${previewDirectory}/restart-en-desktop.png`,
});
shots.push(englishDesktopShot);

await setViewport(390, 844, true);
await settleFigure();
const englishMobile = await readPageState();
const englishMobileShot = await page.screenshot({
  path: `${previewDirectory}/restart-en-390.png`,
});
shots.push(englishMobileShot);

await setViewport(1280, 800, false);
await page.click("[data-homepage-language-trigger]", {
  label: "open language menu",
});
await page.waitForFunction(
  () =>
    document
      .querySelector("[data-homepage-language-trigger]")
      ?.getAttribute("aria-expanded") === "true",
  undefined,
  { timeout: 5000 },
);
await page.click(
  "[data-homepage-language-option][href='/zh/how-to-harvest-stardew-valley']",
  { label: "choose Chinese article" },
);
await page.waitForFunction(
  () => location.pathname === "/zh/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
const chineseDesktop = await readPageState();
const chineseDesktopShot = await page.screenshot({
  path: `${previewDirectory}/restart-zh-desktop.png`,
});
shots.push(chineseDesktopShot);

await setViewport(390, 844, true);
await settleFigure();
const chineseMobile = await readPageState();
const chineseMobileShot = await page.screenshot({
  path: `${previewDirectory}/restart-zh-390.png`,
});
shots.push(chineseMobileShot);

await setViewport(1280, 800, false);
await page.click("[data-homepage-language-trigger]", {
  label: "open language menu again",
});
await page.waitForFunction(
  () =>
    document
      .querySelector("[data-homepage-language-trigger]")
      ?.getAttribute("aria-expanded") === "true",
  undefined,
  { timeout: 5000 },
);
await page.click(
  "[data-homepage-language-option][href='/how-to-harvest-stardew-valley']",
  { label: "choose English article" },
);
await page.waitForFunction(
  () => location.pathname === "/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
const englishReturn = await readPageState();

const report = {
  spaceId: task.spaceId,
  shots,
  englishDesktop,
  englishMobile,
  chineseDesktop,
  chineseMobile,
  englishReturn: {
    pathname: englishReturn.pathname,
    h1: englishReturn.h1,
    pageOverflow: englishReturn.pageOverflow,
  },
};
console.log(JSON.stringify(report));
await task.finish({ keep: [] });
