import { writeFile } from "node:fs/promises";

const previewDirectory =
  "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/verification/preview";
const origin = "http://127.0.0.1:3004";

const task = await taskSpace("harvest article local review");
const page = task.page("p1");
console.log({ spaceId: task.spaceId, page: page.label });

async function setViewport(width, height, mobile) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });
}

async function readPageState() {
  await page.waitForFunction(
    () => document.querySelector("h1") !== null && [...document.images].every((img) => img.complete),
    undefined,
    { timeout: 20000 },
  );
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
          src: el.getAttribute("src"),
          rectLeft: Math.round(rect.left),
          rectRight: Math.round(rect.right),
          rectWidth: Math.round(rect.width),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        });
      }
    }
    return {
      url: location.href,
      title: document.title,
      h1: document.querySelector("h1")?.textContent ?? null,
      viewportWidth,
      viewportHeight: window.innerHeight,
      pageOverflow: root.scrollWidth - root.clientWidth,
      sources: document.querySelector(".blog-sources") !== null,
      cta: document.querySelector("[data-blog-planner-cta]") !== null,
      offenders,
      images: [...document.images].map((img) => ({
        src: img.currentSrc || img.getAttribute("src"),
        attrWidth: img.getAttribute("width"),
        attrHeight: img.getAttribute("height"),
        loading: img.getAttribute("loading"),
        decoding: img.getAttribute("decoding"),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      })),
      languageOptions: [...document.querySelectorAll("[data-homepage-language-option]")].map((anchor) => ({
        href: anchor.getAttribute("href"),
        text: (anchor.textContent || "").trim(),
      })),
      articleHrefs: [...document.querySelectorAll("article a")].map((anchor) => anchor.getAttribute("href")),
    };
  });
}

const views = [
  { name: "en-desktop", path: "/how-to-harvest-stardew-valley", width: 1280, height: 800, mobile: false },
  { name: "en-mobile", path: "/how-to-harvest-stardew-valley", width: 390, height: 844, mobile: true },
  { name: "zh-desktop", path: "/zh/how-to-harvest-stardew-valley", width: 1280, height: 800, mobile: false },
  { name: "zh-mobile", path: "/zh/how-to-harvest-stardew-valley", width: 390, height: 844, mobile: true },
];

const reports = [];
for (const view of views) {
  await setViewport(view.width, view.height, view.mobile);
  await page.goto(`${origin}${view.path}`);
  await page.waitForLoadState("load");
  const state = await readPageState();
  const screenshotPath = `${previewDirectory}/${view.name}.png`;
  await page.screenshot({ path: screenshotPath });
  const figureShot = `${previewDirectory}/${view.name}-figure.png`;
  await page.evaluate(() => {
    document.querySelector("figure")?.scrollIntoView({ block: "center" });
  });
  await page.screenshot({ path: figureShot });
  reports.push({ view: view.name, screenshotPath, figureShot, state });
  console.log(JSON.stringify({ view: view.name, state }));
}

await setViewport(1280, 800, false);
await page.goto(`${origin}/how-to-harvest-stardew-valley`);
await page.waitForLoadState("load");
await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
await page.waitForSelector("[data-homepage-language-menu]:not([hidden]) a[href='/zh/how-to-harvest-stardew-valley']", {
  state: "visible",
  timeout: 5000,
});
await page.click("a[href='/zh/how-to-harvest-stardew-valley']", { label: "open Chinese article" });
await page.waitForFunction(
  () => location.pathname === "/zh/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
const switchedToChinese = await page.url();
await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
await page.waitForSelector("[data-homepage-language-menu]:not([hidden]) a[href='/how-to-harvest-stardew-valley']", {
  state: "visible",
  timeout: 5000,
});
await page.click("a[href='/how-to-harvest-stardew-valley']", { label: "open English article" });
await page.waitForFunction(
  () => location.pathname === "/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
const switchedToEnglish = await page.url();

const reportPath = `${previewDirectory}/browser-self-test.json`;
await writeFile(reportPath, JSON.stringify({
  switchedToChinese,
  switchedToEnglish,
  reports,
}, null, 2));
console.log({ reportPath, switchedToChinese, switchedToEnglish });
await page.cdp("Emulation.clearDeviceMetricsOverride");
await task.finish({ keep: [] });
