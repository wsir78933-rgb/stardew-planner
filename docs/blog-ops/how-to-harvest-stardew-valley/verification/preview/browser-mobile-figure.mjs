const previewDirectory =
  "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/verification/preview";
const task = await taskSpace("harvest 390 figure readability");
const page = task.page("p1");
console.log({ spaceId: task.spaceId });
await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});

async function capture(name, path) {
  await page.goto(`http://127.0.0.1:3004${path}`);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.querySelector("figure img")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(700);
  const box = await page.evaluate(() => {
    const img = document.querySelector("figure img");
    if (!(img instanceof HTMLImageElement)) {
      return { error: "figure img missing" };
    }
    const rect = img.getBoundingClientRect();
    const root = document.documentElement;
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      pageOverflow: root.scrollWidth - root.clientWidth,
      src: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom),
    };
  });
  const shot = `${previewDirectory}/${name}-390-figure-wait.png`;
  await page.screenshot({ path: shot });
  console.log(JSON.stringify({ name, shot, box }));
}

await capture("en", "/how-to-harvest-stardew-valley");
await capture("zh", "/zh/how-to-harvest-stardew-valley");
await page.cdp("Emulation.clearDeviceMetricsOverride");
await task.finish({ keep: [] });
