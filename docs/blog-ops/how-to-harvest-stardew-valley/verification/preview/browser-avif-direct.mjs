const previewDirectory =
  "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/verification/preview";
const task = await taskSpace("harvest avif paint check");
const page = task.page("p1");
console.log({ spaceId: task.spaceId });
await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 800,
  height: 500,
  deviceScaleFactor: 1,
  mobile: false,
});

const urls = [
  ["methods", "http://127.0.0.1:3004/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif"],
  ["cover", "http://127.0.0.1:3004/blog/how-to-harvest-stardew-valley-cover.avif"],
];
for (const [name, url] of urls) {
  await page.goto(url);
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  const shot = `${previewDirectory}/direct-${name}-avif.png`;
  await page.screenshot({ path: shot });
  console.log(JSON.stringify({ name, url: await page.url(), shot }));
}

await page.goto("http://127.0.0.1:3004/how-to-harvest-stardew-valley");
await page.waitForLoadState("load");
await page.evaluate(() => document.querySelector("figure img")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(500);
const style = await page.evaluate(() => {
  const img = document.querySelector("figure img");
  if (!(img instanceof HTMLImageElement)) {
    return { error: "missing" };
  }
  const computed = getComputedStyle(img);
  const rect = img.getBoundingClientRect();
  return {
    opacity: computed.opacity,
    visibility: computed.visibility,
    display: computed.display,
    objectFit: computed.objectFit,
    background: computed.backgroundColor,
    width: computed.width,
    height: computed.height,
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    currentSrc: img.currentSrc,
  };
});
console.log(JSON.stringify({ style }));
await page.screenshot({
  path: `${previewDirectory}/en-figure-after-wait.png`,
});
await page.cdp("Emulation.clearDeviceMetricsOverride");
await task.finish({ keep: [] });
