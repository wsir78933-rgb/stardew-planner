const task = await taskSpace(92);
const page = task.page("p1");
console.log({ spaceId: task.spaceId, page: page.label, url: await page.url() });

await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});
await page.goto("http://127.0.0.1:3004/how-to-harvest-stardew-valley");
await page.waitForLoadState("load");
await page.evaluate(() => {
  document.querySelector("figure img")?.scrollIntoView({ block: "center" });
});
await page.waitForFunction(() => {
  const img = document.querySelector("figure img");
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
}, undefined, { timeout: 10000 });
const pixels = await page.evaluate(() => {
  const img = document.querySelector("figure img");
  if (!(img instanceof HTMLImageElement)) {
    return { error: "figure img missing" };
  }
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext("2d");
  if (context === null) {
    return { error: "canvas context missing" };
  }
  context.drawImage(img, 0, 0, 8, 8);
  const sample = [...context.getImageData(0, 0, 8, 8).data];
  let dark = 0;
  for (let index = 0; index < sample.length; index += 4) {
    const red = sample[index] ?? 0;
    const green = sample[index + 1] ?? 0;
    const blue = sample[index + 2] ?? 0;
    if (red + green + blue < 600) {
      dark += 1;
    }
  }
  const rect = img.getBoundingClientRect();
  return {
    currentSrc: img.currentSrc,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    clientWidth: img.clientWidth,
    clientHeight: img.clientHeight,
    rectWidth: Math.round(rect.width),
    rectHeight: Math.round(rect.height),
    darkSamples: dark,
  };
});
console.log(JSON.stringify({ pixels }));
const figureShot = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/verification/preview/en-mobile-figure-after-decode.png";
await page.screenshot({ path: figureShot });

await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});
await page.goto("http://127.0.0.1:3004/how-to-harvest-stardew-valley");
await page.waitForLoadState("load");
await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
const menuState = await page.evaluate(() => {
  const button = document.querySelector("[data-homepage-language-trigger]");
  const menu = document.querySelector("[data-homepage-language-menu]");
  return {
    triggerCount: document.querySelectorAll("[data-homepage-language-trigger]").length,
    expanded: button?.getAttribute("aria-expanded") ?? null,
    hidden: menu?.hasAttribute("hidden") ?? null,
    optionCount: document.querySelectorAll("[data-homepage-language-option]").length,
  };
});
console.log(JSON.stringify({ menuState }));
if (menuState.expanded !== "true") {
  await page.click("button[aria-label='Language']", { label: "open language by label" });
}
await page.waitForFunction(
  () => document.querySelector("[data-homepage-language-trigger]")?.getAttribute("aria-expanded") === "true",
  undefined,
  { timeout: 5000 },
);
await page.click("[data-homepage-language-option][href='/zh/how-to-harvest-stardew-valley']", {
  label: "choose Chinese article",
});
await page.waitForFunction(
  () => location.pathname === "/zh/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
const chineseUrl = await page.url();
await page.click("[data-homepage-language-trigger]", { label: "open language menu" });
await page.waitForFunction(
  () => document.querySelector("[data-homepage-language-trigger]")?.getAttribute("aria-expanded") === "true",
  undefined,
  { timeout: 5000 },
);
await page.click("[data-homepage-language-option][href='/how-to-harvest-stardew-valley']", {
  label: "choose English article",
});
await page.waitForFunction(
  () => location.pathname === "/how-to-harvest-stardew-valley",
  undefined,
  { timeout: 15000 },
);
console.log(JSON.stringify({ chineseUrl, englishUrl: await page.url(), figureShot }));
await page.cdp("Emulation.clearDeviceMetricsOverride");
await task.finish({ keep: [] });
