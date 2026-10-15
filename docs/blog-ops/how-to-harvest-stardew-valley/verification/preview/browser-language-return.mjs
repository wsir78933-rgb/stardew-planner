const task = await taskSpace(92);
const page = task.page("p1");
console.log({ startUrl: await page.url() });
await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});
if ((await page.url()).includes("/zh/") === false) {
  await page.goto("http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley");
  await page.waitForLoadState("load");
}
await page.waitForSelector("[data-homepage-language-trigger]", { timeout: 10000 });
await page.waitForFunction(() => {
  const button = document.querySelector("[data-homepage-language-trigger]");
  return button instanceof HTMLButtonElement && button.onclick !== undefined || button instanceof HTMLButtonElement;
}, undefined, { timeout: 10000 });
await page.click("[data-homepage-language-trigger]", { label: "open Chinese language menu" });
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
const englishUrl = await page.url();
const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent ?? null);
console.log(JSON.stringify({ englishUrl, h1 }));
await page.cdp("Emulation.clearDeviceMetricsOverride");
await task.finish({ keep: [] });
