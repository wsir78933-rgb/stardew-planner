import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = "/Users/wusir/orca/workspaces/stardew planner/博客-2";
const reviewDir = path.join(
  repoRoot,
  "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/reviews/pages",
);
const screenshotDir = path.join(reviewDir, "screenshots");
const fetchDir = path.join(reviewDir, "raw-fetch");
const origin = "http://127.0.0.1:3010";

const viewports = [
  { locale: "en", width: 1280, height: 800, path: "/house-upgrade-stardew" },
  { locale: "en", width: 390, height: 844, path: "/house-upgrade-stardew" },
  { locale: "zh", width: 1280, height: 800, path: "/zh/house-upgrade-stardew" },
  { locale: "zh", width: 390, height: 844, path: "/zh/house-upgrade-stardew" },
];

const imageRoles = [
  { role: "cover", srcIncludes: "house-upgrade-stardew-cover" },
  { role: "interior", srcIncludes: "tier-rooms" },
  { role: "construction", srcIncludes: "upgrade-or-renovation" },
];

const handoffPaths = {
  en: path.join(repoRoot, "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/en.json"),
  zh: path.join(repoRoot, "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/zh-CN.json"),
};

const manifestPath = path.join(
  repoRoot,
  "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/AssemblyManifest.json",
);

export async function runReview(task) {
  const page = task.page("p1");
  await mkdir(screenshotDir, { recursive: true });
  await mkdir(fetchDir, { recursive: true });
  const expected = await readExpected();
  const capture = {
    spaceId: task.spaceId,
    pageLabel: page.label,
    startedAt: new Date().toISOString(),
    origin,
    viewports: [],
    spotChecks: null,
    assetFetches: [],
    errors: [],
  };

  for (const viewport of viewports) {
    const viewportResult = await captureViewport(page, viewport, expected);
    capture.viewports.push(viewportResult);
    await writeFile(path.join(reviewDir, "checks.partial.json"), JSON.stringify(capture, null, 2));
    console.log(JSON.stringify({
      phase: "viewport-done",
      id: viewportResult.id,
      url: viewportResult.url,
      status: viewportResult.navigationStatus,
      inner: viewportResult.inner,
      images: viewportResult.images.map((image) => ({
        role: image.role,
        currentSrc: image.currentSrc,
        natural: [image.naturalWidth, image.naturalHeight],
        complete: image.complete,
        decodeOk: image.decode.ok,
        visibleFraction: image.visibleFraction,
      })),
    }));
  }

  capture.spotChecks = await captureSpotChecks(page);
  console.log(JSON.stringify({ phase: "spot-checks", spotChecks: capture.spotChecks }));
  capture.assetFetches = await fetchManifestAssets(page, expected.media);
  capture.finishedAt = new Date().toISOString();
  await writeFile(path.join(reviewDir, "checks.json"), JSON.stringify(capture, null, 2));
  console.log(JSON.stringify({
    phase: "capture-written",
    checks: path.join(reviewDir, "checks.json"),
    assetPass: capture.assetFetches.filter((item) => item.shaMatchesManifest && item.status === 200).length,
    assetCount: capture.assetFetches.length,
  }));
}

async function readExpected() {
  const [enHandoff, zhHandoff, manifest] = await Promise.all([
    readJson(handoffPaths.en),
    readJson(handoffPaths.zh),
    readJson(manifestPath),
  ]);
  return {
    en: seoExpectation(enHandoff),
    zh: seoExpectation(zhHandoff),
    media: manifest.media.map((item) => ({
      locale: item.locale,
      mediaId: item.mediaId,
      role: item.role,
      publicPath: item.publicPath,
      format: item.format,
      sha256: item.sha256,
      bytes: item.bytes,
    })),
  };
}

function seoExpectation(handoff) {
  const mediaText = {};
  for (const item of handoff.seo.mediaText) {
    mediaText[item.mediaId] = { alt: item.alt, caption: item.caption };
  }
  return {
    title: handoff.seo.title,
    h1: handoff.seo.h1,
    description: handoff.seo.description,
    mediaText,
  };
}

async function captureViewport(page, viewport, expected) {
  const id = `${viewport.locale}-${viewport.width}x${viewport.height}`;
  await setViewport(page, viewport.width, viewport.height);
  await armObservation(page);
  const url = `${origin}${viewport.path}`;
  await page.goto(url, { waitUntil: "load", timeout: 30_000 });
  await page.waitForSelector("[data-blog-article] h1", { state: "visible", timeout: 15_000 });
  const info = await page.info();
  const inner = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
  }));
  if (inner.innerWidth !== viewport.width || inner.innerHeight !== viewport.height) {
    throw new Error(
      `Viewport ${id} inner size is ${inner.innerWidth}x${inner.innerHeight}; requested ${viewport.width}x${viewport.height}.`,
    );
  }
  const identity = await readIdentity(page);
  const images = [];
  for (const imageRole of imageRoles) {
    images.push(await captureImage(page, id, imageRole));
  }
  const layout = await readLayout(page, viewport.width < 500);
  const events = summarizeEvents(await page.events());
  const localeExpected = expected[viewport.locale];
  return {
    id,
    requestedUrl: url,
    url: await page.url(),
    navigationStatus: identity.navigationStatus,
    info,
    inner,
    identity,
    expected: localeExpected,
    identityMatches: {
      title: identity.title === localeExpected.title,
      h1: identity.h1 === localeExpected.h1,
      description: identity.description === localeExpected.description,
    },
    images,
    layout,
    events,
  };
}

async function setViewport(page, width, height) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 500,
    screenWidth: width,
    screenHeight: height,
  });
}

async function armObservation(page) {
  await page.cdp("Network.enable");
  await page.cdp("Network.setCacheDisabled", { cacheDisabled: true });
  await page.cdp("Runtime.enable");
  await page.cdp("Log.enable");
  await page.events();
}

async function captureImage(page, viewportId, imageRole) {
  const prepared = await page.evaluate((srcIncludes) => {
    const matches = [...document.querySelectorAll("img")].filter((img) =>
      (img.getAttribute("src") || "").includes(srcIncludes),
    );
    if (matches.length !== 1) {
      return {
        ok: false,
        count: matches.length,
        srcs: matches.map((img) => img.getAttribute("src")),
      };
    }
    matches[0].scrollIntoView({ block: "center", inline: "nearest" });
    return { ok: true };
  }, imageRole.srcIncludes);
  if (!prepared.ok) {
    throw new Error(
      `Viewport ${viewportId} role ${imageRole.role} expected 1 img containing ${JSON.stringify(imageRole.srcIncludes)}; count=${prepared.count}; srcs=${JSON.stringify(prepared.srcs)}.`,
    );
  }
  await page.waitForFunction((srcIncludes) => {
    const img = [...document.querySelectorAll("img")].find((node) =>
      (node.getAttribute("src") || "").includes(srcIncludes),
    );
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }, imageRole.srcIncludes, { timeout: 15_000 });
  const record = await page.evaluate(async (srcIncludes) => {
    const img = [...document.querySelectorAll("img")].find((node) =>
      (node.getAttribute("src") || "").includes(srcIncludes),
    );
    let decode = { ok: false, name: "", message: "" };
    try {
      await img.decode();
      decode = { ok: true, name: "", message: "" };
    } catch (error) {
      decode = {
        ok: false,
        name: error && error.name ? error.name : "",
        message: error && error.message ? String(error.message) : String(error),
      };
    }
    const rect = img.getBoundingClientRect();
    const style = getComputedStyle(img);
    const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    const area = rect.width * rect.height;
    const picture = img.closest("picture");
    const figure = img.closest("figure");
    const sources = picture
      ? [...picture.querySelectorAll("source")].map((source) => ({
        srcset: source.getAttribute("srcset"),
        type: source.getAttribute("type"),
      }))
      : [];
    return {
      src: img.getAttribute("src"),
      currentSrc: img.currentSrc,
      alt: img.getAttribute("alt"),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      visibleFraction: area > 0 ? (visibleWidth * visibleHeight) / area : 0,
      objectFit: style.objectFit,
      objectPosition: style.objectPosition,
      decode,
      sources,
      caption: figure?.querySelector("figcaption")?.textContent?.trim() ?? "",
    };
  }, imageRole.srcIncludes);
  const screenshotPath = path.join(screenshotDir, `${viewportId}-${imageRole.role}.png`);
  await page.screenshot({ path: screenshotPath, scale: "css" });
  return {
    role: imageRole.role,
    screenshotPath,
    ...record,
    crop: cropFractions(record),
  };
}

function cropFractions(record) {
  const naturalRatio = record.naturalWidth / record.naturalHeight;
  const clientRatio = record.clientWidth / record.clientHeight;
  if (!Number.isFinite(naturalRatio) || !Number.isFinite(clientRatio) || record.clientWidth === 0) {
    return { naturalRatio, clientRatio, cropX: null, cropY: null, uniformScale: null };
  }
  const scaleX = record.clientWidth / record.naturalWidth;
  const scaleY = record.clientHeight / record.naturalHeight;
  if (record.objectFit === "cover") {
    const scale = Math.max(scaleX, scaleY);
    const renderedWidth = record.naturalWidth * scale;
    const renderedHeight = record.naturalHeight * scale;
    return {
      naturalRatio,
      clientRatio,
      cropX: (renderedWidth - record.clientWidth) / renderedWidth,
      cropY: (renderedHeight - record.clientHeight) / renderedHeight,
      uniformScale: true,
    };
  }
  return {
    naturalRatio,
    clientRatio,
    cropX: 0,
    cropY: 0,
    uniformScale: Math.abs(scaleX - scaleY) / Math.max(scaleX, scaleY) < 0.01,
  };
}

async function readIdentity(page) {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "";
    return {
      title: document.title,
      h1: document.querySelector("[data-blog-article] h1")?.textContent?.trim() ?? "",
      description,
      ogTitle,
      lang: document.documentElement.lang,
      navigationStatus: navigation && "responseStatus" in navigation ? navigation.responseStatus : null,
      navigationUrl: navigation ? navigation.name : "",
    };
  });
}

async function readLayout(page, probeTableScroll) {
  return page.evaluate((shouldScrollTable) => {
    const root = document.documentElement;
    const overflowing = [];
    for (const element of document.querySelectorAll("body *")) {
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        overflowing.push({
          tag: element.tagName,
          id: element.id,
          className: String(element.className).slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
        if (overflowing.length >= 12) break;
      }
    }
    const scroller = document.querySelector("[data-blog-article] .blog-table-scroll");
    let table = { found: false };
    if (scroller) {
      const before = scroller.scrollLeft;
      const max = scroller.scrollWidth - scroller.clientWidth;
      let after = before;
      if (shouldScrollTable) scroller.scrollLeft = max;
      after = scroller.scrollLeft;
      const tableElement = scroller.querySelector("table");
      table = {
        found: true,
        className: String(scroller.className),
        tableClassName: tableElement ? String(tableElement.className) : "",
        before,
        after,
        max,
        scrollWidth: scroller.scrollWidth,
        clientWidth: scroller.clientWidth,
        overflowX: getComputedStyle(scroller).overflowX,
        scrolled: after > before + 1,
      };
    }
    const exportButtons = [...document.querySelectorAll("a,button,div")].filter((element) =>
      (element.innerText || "").includes("导出外链") && element.querySelector("a,button") === null,
    ).slice(0, 4).map((element) => ({
      tag: element.tagName,
      text: (element.innerText || "").trim().slice(0, 80),
      inArticle: Boolean(element.closest("[data-blog-article]")),
    }));
    return {
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      overflowing,
      table,
      exportButtons,
    };
  }, probeTableScroll);
}

async function captureSpotChecks(page) {
  await setViewport(page, 1280, 800);
  await armObservation(page);
  await page.goto(`${origin}/house-upgrade-stardew`, { waitUntil: "load", timeout: 30_000 });
  await page.waitForSelector('a[href="/zh/house-upgrade-stardew"]', { timeout: 15_000 });
  await page.click('a[href="/zh/house-upgrade-stardew"] >> nth=0', { label: "open zh article" });
  await page.waitForURL((url) => url.pathname === "/zh/house-upgrade-stardew", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const zh = await readIdentity(page);
  await page.click('a[href="/house-upgrade-stardew"] >> nth=0', { label: "return en article" });
  await page.waitForURL((url) => url.pathname === "/house-upgrade-stardew", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const en = await readIdentity(page);
  await page.click('a[href="/blog"] >> nth=0', { label: "open blog catalog" });
  await page.waitForURL((url) => url.pathname === "/blog", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const catalog = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      url: location.href,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      navigationStatus: navigation && "responseStatus" in navigation ? navigation.responseStatus : null,
    };
  });
  const events = summarizeEvents(await page.events());
  return {
    languageRoundtrip: {
      zhUrl: zh.navigationUrl,
      zhTitle: zh.title,
      zhH1: zh.h1,
      zhStatus: zh.navigationStatus,
      enUrl: en.navigationUrl,
      enTitle: en.title,
      enH1: en.h1,
      enStatus: en.navigationStatus,
    },
    catalog,
    events,
  };
}

async function fetchManifestAssets(page, media) {
  const results = [];
  for (const item of media) {
    const url = `${origin}${item.publicPath}`;
    const dest = path.join(fetchDir, item.publicPath.replaceAll("/", "__"));
    const response = await page.fetch(url, {
      cache: "reload",
      saveAs: dest,
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
    });
    const bytes = await readFile(dest);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const record = {
      publicPath: item.publicPath,
      url: response.url,
      status: response.status,
      ok: response.ok,
      byteLength: bytes.length,
      sha256,
      expectedSha256: item.sha256,
      expectedBytes: item.bytes,
      shaMatchesManifest: sha256 === item.sha256,
      bytesMatchManifest: bytes.length === item.bytes,
      contentType: response.headers?.["content-type"] ?? response.headers?.["Content-Type"] ?? "",
    };
    if (record.shaMatchesManifest) await rm(dest, { force: true });
    results.push(record);
    console.log(JSON.stringify({
      phase: "asset-fetch",
      publicPath: item.publicPath,
      status: response.status,
      byteLength: bytes.length,
      sha256,
      shaMatchesManifest: record.shaMatchesManifest,
    }));
  }
  return results;
}

function summarizeEvents(events) {
  if (!Array.isArray(events)) {
    throw new Error(`page.events() returned ${typeof events}: ${JSON.stringify(events).slice(0, 500)}`);
  }
  const methods = {};
  const requestUrls = new Map();
  const failed = [];
  const consoleErrors = [];
  const exceptions = [];
  const imageResponses = [];
  for (const event of events) {
    const method = event.method || event.name || event.type || "unknown";
    methods[method] = (methods[method] || 0) + 1;
    const params = event.params || event;
    if (method === "Network.requestWillBeSent" && params.requestId) {
      requestUrls.set(params.requestId, params.request?.url || "");
    }
    if (method === "Network.loadingFailed") {
      const requestUrl = requestUrls.get(params.requestId) || params.url || params.request?.url || "";
      failed.push({
        requestUrl,
        errorText: params.errorText || "",
        canceled: params.canceled === true,
        type: params.type || "",
      });
    }
    if (method === "Network.responseReceived") {
      const responseUrl = params.response?.url || "";
      if (responseUrl.includes("/blog/") && /\.(avif|webp)(\?|$)/.test(responseUrl)) {
        imageResponses.push({
          url: responseUrl,
          status: params.response?.status ?? null,
          mimeType: params.response?.mimeType || "",
          fromCache: params.response?.fromDiskCache === true || params.response?.fromPrefetchCache === true,
        });
      }
    }
    if (method === "Runtime.exceptionThrown") {
      exceptions.push({
        text: params.exceptionDetails?.text || "",
        url: params.exceptionDetails?.url || "",
        description: params.exceptionDetails?.exception?.description || "",
      });
    }
    if (method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(params.type)) {
      consoleErrors.push({
        type: params.type,
        text: (params.args || []).map((arg) => arg.value || arg.description || arg.type).join(" ").slice(0, 300),
      });
    }
    if (method === "Log.entryAdded" && ["error", "warning"].includes(params.entry?.level)) {
      consoleErrors.push({
        type: params.entry.level,
        text: String(params.entry.text || "").slice(0, 300),
        url: params.entry.url || "",
      });
    }
  }
  const unresolvedFailed = failed.filter((item) => !isCancelledAnalytics(item));
  return {
    eventCount: events.length,
    methods,
    failed,
    unresolvedFailed,
    cancelledAnalyticsCount: failed.length - unresolvedFailed.length,
    consoleErrors,
    exceptions,
    imageResponses,
    sampleKeys: events[0] ? Object.keys(events[0]) : [],
  };
}

function isCancelledAnalytics(item) {
  const url = `${item.requestUrl || ""} ${item.url || ""}`;
  const analytics = /google-analytics|googletagmanager|\/g\/collect|analytics\.google|doubleclick|googlesyndication|google\.com\/ccm/i.test(url);
  const cancelled = item.canceled === true || /ERR_ABORTED|ERR_BLOCKED_BY_CLIENT|canceled|cancelled/i.test(item.errorText || "");
  return analytics && cancelled;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
