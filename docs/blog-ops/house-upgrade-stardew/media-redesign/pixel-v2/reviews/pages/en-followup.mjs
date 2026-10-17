import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const reviewDir = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/reviews/pages";
const origin = "http://127.0.0.1:3010";
const assets = [
  { publicPath: "/blog/house-upgrade-stardew-cover.webp", sha256: "d58aaaf3bbe7b02e04fb0a366b3e0b8c61b257abc993eea6ff02a358782f57c8", bytes: 2550052 },
  { publicPath: "/blog/house-upgrade-stardew-cover.avif", sha256: "8c0da21da4d59de4d3f4d1bbadc6e38cefe3880ba47d67aaacf8f5ff892662d0", bytes: 653604 },
  { publicPath: "/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp", sha256: "9f806c5cb39ac3bd298415ff3ac80fb056446dcff9fb1a839d9c4afb29946671", bytes: 1984240 },
  { publicPath: "/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif", sha256: "e2578074f100a6e185d73d5034f6fe2d79861df3787aac3777137a5854571221", bytes: 446411 },
  { publicPath: "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp", sha256: "526a5afa8836bba315ffa3b15b64d0483726ee3c07d3284222e47ed935c93bfb", bytes: 2453712 },
  { publicPath: "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif", sha256: "c5c957be221fa5b140cef500771c1eeb51ae2b143fa645662a5644c43d05cf27", bytes: 617005 },
];

export async function runFollowup(task) {
  const page = task.page("p1");
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1280,
    screenHeight: 800,
  });
  await page.cdp("Network.enable");
  await page.cdp("Network.setCacheDisabled", { cacheDisabled: true });
  await page.cdp("Runtime.enable");
  await page.cdp("Log.enable");
  await page.events();
  await page.goto(`${origin}/house-upgrade-stardew`, { waitUntil: "load", timeout: 30_000 });
  const dom = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll("a")].map((anchor) => ({
      href: anchor.getAttribute("href"),
      text: (anchor.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
    })).filter((anchor) => /zh|blog|house-upgrade|English|中文|语言/.test(`${anchor.href} ${anchor.text}`));
    const bodyText = document.body.innerText;
    return {
      url: location.href,
      anchors,
      coverCaptionPresent: bodyText.includes("Illustration of one farmhouse in an original pixel scene"),
      zhCoverCaptionPresent: bodyText.includes("插画。一栋农舍的原创像素场景"),
    };
  });
  console.log(JSON.stringify({ phase: "dom", dom }));
  const zhAnchor = dom.anchors.find((anchor) => (anchor.href || "").includes("/zh/house-upgrade-stardew"));
  if (!zhAnchor) {
    throw new Error(`No anchor href contains /zh/house-upgrade-stardew. anchors=${JSON.stringify(dom.anchors)}`);
  }
  await page.click(`a[href="${zhAnchor.href}"] >> nth=0`, { label: "open zh article" });
  await page.waitForURL((url) => url.pathname === "/zh/house-upgrade-stardew", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const zh = await readIdentity(page);
  const enAnchorHref = await page.evaluate(() => {
    const anchor = [...document.querySelectorAll("a")].find((item) => {
      const href = item.getAttribute("href") || "";
      return href.endsWith("/house-upgrade-stardew") && !href.includes("/zh/");
    });
    return anchor ? anchor.getAttribute("href") : "";
  });
  if (!enAnchorHref) throw new Error("ZH page has no anchor back to /house-upgrade-stardew.");
  await page.click(`a[href="${enAnchorHref}"] >> nth=0`, { label: "return en article" });
  await page.waitForURL((url) => url.pathname === "/house-upgrade-stardew", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const en = await readIdentity(page);
  const blogHref = await page.evaluate(() => {
    const anchor = [...document.querySelectorAll("a")].find((item) => item.getAttribute("href") === "/blog");
    return anchor ? "/blog" : "";
  });
  if (!blogHref) throw new Error('EN page has no a[href="/blog"].');
  await page.click('a[href="/blog"] >> nth=0', { label: "open blog catalog" });
  await page.waitForURL((url) => url.pathname === "/blog", { timeout: 20_000 });
  await page.waitForLoadState("load");
  const catalog = await readIdentity(page);
  const events = summarizeEvents(await page.events());
  await page.goto(`${origin}/house-upgrade-stardew`, { waitUntil: "load", timeout: 30_000 });
  const fetched = [];
  const fetchDir = path.join(reviewDir, "raw-fetch");
  await mkdir(fetchDir, { recursive: true });
  for (const asset of assets) {
    const dest = path.join(fetchDir, asset.publicPath.replaceAll("/", "__"));
    const response = await page.fetch(`${origin}${asset.publicPath}`, {
      cache: "reload",
      saveAs: dest,
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
    });
    const bytes = await readFile(dest);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const record = {
      publicPath: asset.publicPath,
      responseUrl: response.url,
      status: response.status,
      ok: response.ok,
      byteLength: bytes.length,
      sha256,
      expectedSha256: asset.sha256,
      expectedBytes: asset.bytes,
      shaMatchesManifest: sha256 === asset.sha256,
      bytesMatchManifest: bytes.length === asset.bytes,
    };
    if (record.shaMatchesManifest) await rm(dest, { force: true });
    fetched.push(record);
    console.log(JSON.stringify({ phase: "asset-fetch", ...record }));
  }
  const output = {
    spaceId: task.spaceId,
    pageLabel: page.label,
    finishedAt: new Date().toISOString(),
    dom,
    languageRoundtrip: { zh, en, zhClickedHref: zhAnchor.href, enClickedHref: enAnchorHref },
    catalog,
    events,
    enAssetFetches: fetched,
  };
  await writeFile(path.join(reviewDir, "en-followup.json"), JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ phase: "followup-written", assetPass: fetched.filter((item) => item.shaMatchesManifest && item.status === 200).length }));
}

async function readIdentity(page) {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      url: location.href,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      navigationStatus: navigation && "responseStatus" in navigation ? navigation.responseStatus : null,
    };
  });
}

function summarizeEvents(events) {
  if (!Array.isArray(events)) {
    throw new Error(`page.events() returned ${typeof events}: ${JSON.stringify(events).slice(0, 400)}`);
  }
  const requestUrls = new Map();
  const consoleMessages = [];
  const failed = [];
  const cached = [];
  for (const event of events) {
    const params = event.params || {};
    if (event.method === "Network.requestWillBeSent" && params.requestId) {
      requestUrls.set(params.requestId, params.request?.url || "");
    }
    if (event.method === "Network.requestServedFromCache") {
      cached.push(requestUrls.get(params.requestId) || params.requestId || "");
    }
    if (event.method === "Network.loadingFailed") {
      failed.push({
        url: requestUrls.get(params.requestId) || "",
        errorText: params.errorText || "",
        canceled: params.canceled === true,
        type: params.type || "",
      });
    }
    if (event.method === "Runtime.consoleAPICalled") {
      consoleMessages.push({
        type: params.type || "",
        text: (params.args || []).map((arg) => arg.value || arg.description || "").join(" ").slice(0, 240),
      });
    }
    if (event.method === "Runtime.exceptionThrown") {
      consoleMessages.push({
        type: "exception",
        text: params.exceptionDetails?.text || params.exceptionDetails?.exception?.description || "",
      });
    }
    if (event.method === "Log.entryAdded") {
      consoleMessages.push({
        type: params.entry?.level || "log",
        text: String(params.entry?.text || "").slice(0, 240),
        url: params.entry?.url || "",
      });
    }
  }
  return { failed, cached, consoleMessages };
}
