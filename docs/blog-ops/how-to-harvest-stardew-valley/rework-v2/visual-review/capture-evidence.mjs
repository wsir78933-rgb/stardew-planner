import fs from "node:fs/promises";
import path from "node:path";

const REVIEW_DIR = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/visual-review";

async function setViewport(page, width, height, deviceScaleFactor, isMobile) {
  if (!page || typeof width !== "number" || typeof height !== "number") {
    throw new Error(`Invalid viewport parameters: width=${width}, height=${height}`);
  }
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor,
    mobile: isMobile,
    screenOrientation: { angle: 0, type: "portraitPrimary" },
  });
  await page.waitForTimeout(300);
}

async function prepareAndMeasureElement(page, selector) {
  if (!selector || typeof selector !== "string") {
    throw new Error(`Invalid selector: ${selector}`);
  }
  const result = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) {
      return { found: false, error: `Element not found for selector: ${sel}` };
    }
    el.scrollIntoView({ behavior: "instant", block: "center" });
    const rect = el.getBoundingClientRect();
    const isImage = el.tagName.toLowerCase() === "img";
    const imgInfo = isImage ? {
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete,
      currentSrc: el.currentSrc || el.src,
    } : null;
    const computed = window.getComputedStyle(el);
    return {
      found: true,
      tagName: el.tagName,
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      },
      computedStyle: {
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        objectFit: computed.objectFit,
        display: computed.display,
      },
      imgInfo,
    };
  }, selector);

  if (!result.found) {
    throw new Error(`Failed to measure element: ${result.error}`);
  }

  // If it's an image, decode it explicitly
  if (result.imgInfo) {
    await page.evaluate(async (sel) => {
      const img = document.querySelector(sel);
      if (img && img.decode) {
        try {
          await img.decode();
        } catch {
          // If already decoded or error, continue
        }
      }
    }, selector);
  }

  await page.waitForTimeout(500);
  return result;
}

async function runInspection() {
  const task = await taskSpace(118);
  const page = task.page("p1");

  const metrics = {
    taskSpaceId: task.spaceId,
    timestamp: new Date().toISOString(),
    viewports: {},
  };

  const targets = [
    {
      locale: "en",
      url: "http://127.0.0.1:3004/how-to-harvest-stardew-valley",
      coverSelector: "img[src*='how-to-harvest-stardew-valley-cover']",
      figureSelector: "img[src*='how-to-harvest-stardew-valley-en-methods']",
    },
    {
      locale: "zh",
      url: "http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley",
      coverSelector: "img[src*='how-to-harvest-stardew-valley-cover']",
      figureSelector: "img[src*='how-to-harvest-stardew-valley-zh-methods']",
    },
  ];

  const viewports = [
    { name: "desktop", width: 1280, height: 800, dpr: 1, isMobile: false },
    { name: "mobile", width: 390, height: 844, dpr: 3, isMobile: true },
  ];

  for (const target of targets) {
    metrics.viewports[target.locale] = {};

    for (const vp of viewports) {
      console.log(`Inspecting ${target.locale} on ${vp.name} (${vp.width}x${vp.height})...`);
      await setViewport(page, vp.width, vp.height, vp.dpr, vp.isMobile);
      await page.goto(target.url, { waitUntil: "load" });
      await page.waitForTimeout(500);

      // Measure & capture Cover
      const coverMetrics = await prepareAndMeasureElement(page, target.coverSelector);
      const coverScreenshotPath = path.join(REVIEW_DIR, `${target.locale}-${vp.name}-cover.png`);
      await page.screenshot({ path: coverScreenshotPath });

      // Measure & capture Figure
      const figureMetrics = await prepareAndMeasureElement(page, target.figureSelector);
      const figureScreenshotPath = path.join(REVIEW_DIR, `${target.locale}-${vp.name}-figure.png`);
      await page.screenshot({ path: figureScreenshotPath });

      metrics.viewports[target.locale][vp.name] = {
        viewportConfig: vp,
        cover: {
          metrics: coverMetrics,
          screenshotPath: coverScreenshotPath,
        },
        figure: {
          metrics: figureMetrics,
          screenshotPath: figureScreenshotPath,
        },
      };
    }
  }

  const jsonPath = path.join(REVIEW_DIR, "dom-metrics.json");
  await fs.writeFile(jsonPath, JSON.stringify(metrics, null, 2), "utf8");
  console.log(`Saved metrics to ${jsonPath}`);
  console.log("Inspection completed successfully.");
}

await runInspection();
