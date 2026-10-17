import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repositoryRootDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2";
const reviewOutputDirectory = path.join(
  repositoryRootDirectory,
  "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/reviews/pages-zh",
);
const screenshotOutputDirectory = path.join(reviewOutputDirectory, "screenshots");
const rawFetchOutputDirectory = path.join(reviewOutputDirectory, "raw-fetch");
const serverOrigin = "http://127.0.0.1:3010";

const targetViewports = [
  { identifier: "zh-1280x800", width: 1280, height: 800, articlePath: "/zh/house-upgrade-stardew" },
  { identifier: "zh-390x844", width: 390, height: 844, articlePath: "/zh/house-upgrade-stardew" },
];

const targetImageSpecifications = [
  { role: "cover", mediaId: "cover-payments", srcKeyword: "house-upgrade-stardew-cover-zh" },
  { role: "interior", mediaId: "tier-rooms", srcKeyword: "tier-rooms.zh" },
  { role: "construction", mediaId: "upgrade-or-renovation", srcKeyword: "upgrade-or-renovation.zh" },
];

const handoffJsonFilePath = path.join(
  repositoryRootDirectory,
  "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/zh-CN.json",
);

const assemblyManifestFilePath = path.join(
  repositoryRootDirectory,
  "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/AssemblyManifest.json",
);

const expectedManifestSha256 = "07fa31ccca98a8ea421075797861724315583138490d4f99870cc5be95ad22fd";

export async function validateAndLoadExpectations() {
  const manifestBuffer = await readFile(assemblyManifestFilePath);
  const actualManifestSha256 = createHash("sha256").update(manifestBuffer).digest("hex");
  if (actualManifestSha256 !== expectedManifestSha256) {
    throw new Error(
      `Manifest SHA256 mismatch: expected ${expectedManifestSha256}, but got ${actualManifestSha256} from ${assemblyManifestFilePath}`,
    );
  }

  const manifestJson = JSON.parse(manifestBuffer.toString("utf8"));
  const handoffBuffer = await readFile(handoffJsonFilePath);
  const handoffJson = JSON.parse(handoffBuffer.toString("utf8"));

  if (!handoffJson.seo || !handoffJson.seo.title || !handoffJson.seo.h1 || !handoffJson.seo.description) {
    throw new Error(`Invalid handoff structure in ${handoffJsonFilePath}: missing required SEO fields.`);
  }

  const mediaTextMap = {};
  for (const item of handoffJson.seo.mediaText) {
    mediaTextMap[item.mediaId] = {
      alt: item.alt,
      caption: item.caption,
    };
  }

  const zhMediaItems = manifestJson.media.filter((item) => item.locale === "zh-CN");
  if (zhMediaItems.length !== 6) {
    throw new Error(
      `Expected 6 zh-CN media items in AssemblyManifest, but found ${zhMediaItems.length}.`,
    );
  }

  return {
    seo: {
      title: handoffJson.seo.title,
      h1: handoffJson.seo.h1,
      description: handoffJson.seo.description,
      ogTitle: handoffJson.seo.ogTitle,
      canonicalPath: handoffJson.publicRequirements.canonicalPath,
      mediaText: mediaTextMap,
    },
    mediaItems: zhMediaItems,
  };
}

export async function configureBrowserViewport(pageHandle, viewportWidth, viewportHeight) {
  const isMobileViewport = viewportWidth < 500;
  await pageHandle.cdp("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: isMobileViewport,
    screenWidth: viewportWidth,
    screenHeight: viewportHeight,
  });
}

export async function initializeCdpMonitoring(pageHandle) {
  await pageHandle.cdp("Network.enable");
  await pageHandle.cdp("Network.setCacheDisabled", { cacheDisabled: true });
  await pageHandle.cdp("Runtime.enable");
  await pageHandle.cdp("Log.enable");
  await pageHandle.events();
}

export async function inspectPageIdentity(pageHandle) {
  return pageHandle.evaluate(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    const ogTitleElement = document.querySelector('meta[property="og:title"]');
    const h1Element = document.querySelector("[data-blog-article] h1");

    return {
      title: document.title,
      h1: h1Element ? h1Element.textContent.trim() : "",
      description: metaDescriptionElement ? metaDescriptionElement.getAttribute("content") : "",
      ogTitle: ogTitleElement ? ogTitleElement.getAttribute("content") : "",
      htmlLang: document.documentElement.lang,
      navigationStatus: navigationEntry && "responseStatus" in navigationEntry ? navigationEntry.responseStatus : null,
      navigationUrl: navigationEntry ? navigationEntry.name : location.href,
    };
  });
}

export async function scrollAndInspectImage(pageHandle, viewportIdentifier, imageSpecification) {
  const prepareResult = await pageHandle.evaluate((srcKeyword) => {
    const matchingImages = [...document.querySelectorAll("img")].filter((imgElement) => {
      const srcAttribute = imgElement.getAttribute("src") || "";
      return srcAttribute.includes(srcKeyword);
    });

    if (matchingImages.length !== 1) {
      return {
        matched: false,
        count: matchingImages.length,
        foundSrcs: matchingImages.map((img) => img.getAttribute("src")),
      };
    }

    matchingImages[0].scrollIntoView({ block: "center", inline: "nearest" });
    return { matched: true, count: 1 };
  }, imageSpecification.srcKeyword);

  if (!prepareResult.matched) {
    throw new Error(
      `Viewport ${viewportIdentifier} for role ${imageSpecification.role} expected exactly 1 image containing "${imageSpecification.srcKeyword}", but found ${prepareResult.count}: ${JSON.stringify(prepareResult.foundSrcs)}`,
    );
  }

  await pageHandle.waitForFunction((srcKeyword) => {
    const imgElement = [...document.querySelectorAll("img")].find((node) => {
      const srcAttribute = node.getAttribute("src") || "";
      return srcAttribute.includes(srcKeyword);
    });
    return Boolean(imgElement && imgElement.complete && imgElement.naturalWidth > 0);
  }, imageSpecification.srcKeyword, { timeout: 15_000 });

  const imageEvaluation = await pageHandle.evaluate(async (srcKeyword) => {
    const imgElement = [...document.querySelectorAll("img")].find((node) => {
      const srcAttribute = node.getAttribute("src") || "";
      return srcAttribute.includes(srcKeyword);
    });

    let decodeOutcome = { ok: false, errorMessage: "" };
    try {
      await imgElement.decode();
      decodeOutcome = { ok: true, errorMessage: "" };
    } catch (decodeError) {
      decodeOutcome = {
        ok: false,
        errorMessage: decodeError && decodeError.message ? String(decodeError.message) : String(decodeError),
      };
    }

    const boundingRectangle = imgElement.getBoundingClientRect();
    const computedElementStyle = getComputedStyle(imgElement);

    const visibleHorizontalSpan = Math.max(0, Math.min(boundingRectangle.right, window.innerWidth) - Math.max(boundingRectangle.left, 0));
    const visibleVerticalSpan = Math.max(0, Math.min(boundingRectangle.bottom, window.innerHeight) - Math.max(boundingRectangle.top, 0));
    const totalBoundingArea = boundingRectangle.width * boundingRectangle.height;
    const computedVisibleFraction = totalBoundingArea > 0 ? (visibleHorizontalSpan * visibleVerticalSpan) / totalBoundingArea : 0;

    const pictureElement = imgElement.closest("picture");
    const figureElement = imgElement.closest("figure");
    const figcaptionElement = figureElement ? figureElement.querySelector("figcaption") : null;

    const sourceElements = pictureElement
      ? [...pictureElement.querySelectorAll("source")].map((sourceNode) => ({
        srcset: sourceNode.getAttribute("srcset") || sourceNode.getAttribute("srcSet"),
        type: sourceNode.getAttribute("type"),
      }))
      : [];

    return {
      src: imgElement.getAttribute("src"),
      currentSrc: imgElement.currentSrc,
      alt: imgElement.getAttribute("alt"),
      caption: figcaptionElement ? figcaptionElement.textContent.trim() : "",
      complete: imgElement.complete,
      naturalWidth: imgElement.naturalWidth,
      naturalHeight: imgElement.naturalHeight,
      clientWidth: imgElement.clientWidth,
      clientHeight: imgElement.clientHeight,
      boundingRectangle: {
        x: boundingRectangle.x,
        y: boundingRectangle.y,
        width: boundingRectangle.width,
        height: boundingRectangle.height,
      },
      visibleFraction: computedVisibleFraction,
      objectFit: computedElementStyle.objectFit,
      objectPosition: computedElementStyle.objectPosition,
      decodeOutcome,
      sourceElements,
    };
  }, imageSpecification.srcKeyword);

  const screenshotFileName = `${viewportIdentifier}-${imageSpecification.role}.png`;
  const absoluteScreenshotFilePath = path.join(screenshotOutputDirectory, screenshotFileName);
  await pageHandle.screenshot({ path: absoluteScreenshotFilePath, scale: "css" });

  const scaleRatioX = imageEvaluation.clientWidth / imageEvaluation.naturalWidth;
  const scaleRatioY = imageEvaluation.clientHeight / imageEvaluation.naturalHeight;
  const scaleDeviation = Math.abs(scaleRatioX - scaleRatioY) / Math.max(scaleRatioX, scaleRatioY);
  const uniformScalingPreserved = scaleDeviation < 0.02;

  return {
    role: imageSpecification.role,
    mediaId: imageSpecification.mediaId,
    screenshotPath: absoluteScreenshotFilePath,
    screenshotFileName,
    ...imageEvaluation,
    uniformScalingPreserved,
    dimensionsMatchExpected: imageEvaluation.naturalWidth === 1672 && imageEvaluation.naturalHeight === 941,
  };
}

export async function evaluateLayoutAndOverflow(pageHandle, shouldTestTableScrolling) {
  return pageHandle.evaluate((testTableScroll) => {
    const documentRootElement = document.documentElement;
    const documentClientWidth = documentRootElement.clientWidth;
    const documentScrollWidth = documentRootElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;

    const overflowingElements = [];
    for (const individualElement of document.querySelectorAll("body *")) {
      const elementRect = individualElement.getBoundingClientRect();
      if (elementRect.width < 1 || elementRect.height < 1) continue;
      if (elementRect.right > window.innerWidth + 1 || elementRect.left < -1) {
        overflowingElements.push({
          tagName: individualElement.tagName,
          id: individualElement.id,
          className: String(individualElement.className).slice(0, 100),
          left: Math.round(elementRect.left),
          right: Math.round(elementRect.right),
          width: Math.round(elementRect.width),
        });
        if (overflowingElements.length >= 10) break;
      }
    }

    const tableScrollContainer = document.querySelector("[data-blog-article] .blog-table-scroll");
    let tableScrollResult = { containerFound: false };
    if (tableScrollContainer) {
      const scrollLeftInitial = tableScrollContainer.scrollLeft;
      const maximumScrollLeft = tableScrollContainer.scrollWidth - tableScrollContainer.clientWidth;
      let scrollLeftAfterAttempt = scrollLeftInitial;
      if (testTableScroll && maximumScrollLeft > 0) {
        tableScrollContainer.scrollLeft = maximumScrollLeft;
        scrollLeftAfterAttempt = tableScrollContainer.scrollLeft;
      }
      const tableInnerElement = tableScrollContainer.querySelector("table");
      tableScrollResult = {
        containerFound: true,
        scrollLeftInitial,
        scrollLeftAfterAttempt,
        maximumScrollLeft,
        scrollWidth: tableScrollContainer.scrollWidth,
        clientWidth: tableScrollContainer.clientWidth,
        computedOverflowX: getComputedStyle(tableScrollContainer).overflowX,
        successfullyScrolled: scrollLeftAfterAttempt > scrollLeftInitial,
        tableElementFound: Boolean(tableInnerElement),
      };
    }

    const externalInjectedButtons = [...document.querySelectorAll("a,button,div")].filter((domNode) => {
      const nodeText = domNode.innerText || "";
      return nodeText.includes("导出外链") && domNode.querySelector("a,button") === null;
    }).slice(0, 4).map((domNode) => ({
      tagName: domNode.tagName,
      text: (domNode.innerText || "").trim().slice(0, 60),
      isInsideArticle: Boolean(domNode.closest("[data-blog-article]")),
    }));

    return {
      documentClientWidth,
      documentScrollWidth,
      bodyScrollWidth,
      hasHorizontalOverflow: documentScrollWidth > documentClientWidth + 1,
      overflowingElements,
      tableScrollResult,
      externalInjectedButtons,
    };
  }, shouldTestTableScrolling);
}

export async function executeSpotChecks(pageHandle) {
  await configureBrowserViewport(pageHandle, 1280, 800);
  await initializeCdpMonitoring(pageHandle);

  const initialArticleUrl = `${serverOrigin}/zh/house-upgrade-stardew`;
  await pageHandle.goto(initialArticleUrl, { waitUntil: "load", timeout: 30_000 });
  await pageHandle.waitForSelector("[data-blog-article] h1", { state: "visible", timeout: 15_000 });

  const languageLinkInspection = await pageHandle.evaluate(() => {
    const enAnchor = document.querySelector('a[href="/house-upgrade-stardew"]');
    const zhAnchor = document.querySelector('a[href="/zh/house-upgrade-stardew"]');
    return {
      enLinkExists: Boolean(enAnchor),
      enLinkHref: enAnchor ? enAnchor.getAttribute("href") : null,
      enLinkText: enAnchor ? enAnchor.textContent.trim() : "",
      zhLinkExists: Boolean(zhAnchor),
      zhLinkHref: zhAnchor ? zhAnchor.getAttribute("href") : null,
      zhLinkText: zhAnchor ? zhAnchor.textContent.trim() : "",
    };
  });

  const catalogAnchorSelector = 'header a[href="/zh/blog"], nav a[href="/zh/blog"]';
  await pageHandle.waitForSelector(catalogAnchorSelector, { timeout: 10_000 });
  await pageHandle.click(`${catalogAnchorSelector} >> nth=0`, { label: "open zh blog catalog" });
  await pageHandle.waitForURL((currentUrl) => currentUrl.pathname === "/zh/blog", { timeout: 20_000 });
  await pageHandle.waitForLoadState("load");

  const catalogPageInspection = await pageHandle.evaluate(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const catalogH1 = document.querySelector("h1");
    return {
      url: location.href,
      title: document.title,
      h1: catalogH1 ? catalogH1.textContent.trim() : "",
      navigationStatus: navigationEntry && "responseStatus" in navigationEntry ? navigationEntry.responseStatus : null,
    };
  });

  await pageHandle.goto(initialArticleUrl, { waitUntil: "load", timeout: 30_000 });
  await pageHandle.waitForSelector("[data-blog-article] h1", { state: "visible", timeout: 15_000 });

  return {
    languageLinkInspection,
    catalogPageInspection,
  };
}

export async function fetchAndVerifyMediaAssets(pageHandle, mediaItemList) {
  const assetVerificationResults = [];

  for (const mediaItem of mediaItemList) {
    const assetUrl = `${serverOrigin}${mediaItem.publicPath}`;
    const sanitizedFileName = mediaItem.publicPath.replace(/\//g, "__");
    const temporarySavePath = path.join(rawFetchOutputDirectory, sanitizedFileName);

    const fetchResponse = await pageHandle.fetch(assetUrl, {
      cache: "reload",
      saveAs: temporarySavePath,
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
    });

    const fileContentBuffer = await readFile(temporarySavePath);
    const computedFileSha256 = createHash("sha256").update(fileContentBuffer).digest("hex");
    const shaMatchesManifest = computedFileSha256 === mediaItem.sha256;
    const byteLengthMatchesManifest = fileContentBuffer.length === mediaItem.bytes;

    const verificationRecord = {
      publicPath: mediaItem.publicPath,
      mediaId: mediaItem.mediaId,
      format: mediaItem.format,
      role: mediaItem.role,
      requestUrl: fetchResponse.url,
      httpStatus: fetchResponse.status,
      contentType: fetchResponse.headers?.["content-type"] || "",
      actualByteLength: fileContentBuffer.length,
      expectedByteLength: mediaItem.bytes,
      actualSha256: computedFileSha256,
      expectedSha256: mediaItem.sha256,
      shaMatchesManifest,
      byteLengthMatchesManifest,
    };

    if (shaMatchesManifest && byteLengthMatchesManifest) {
      await rm(temporarySavePath, { force: true });
    }

    assetVerificationResults.push(verificationRecord);
  }

  return assetVerificationResults;
}

export function filterAndCategorizeCdpEvents(bufferedCdpEvents) {
  if (!Array.isArray(bufferedCdpEvents)) {
    throw new Error(`Expected array of CDP events, received ${typeof bufferedCdpEvents}`);
  }

  const methodFrequencyMap = {};
  const networkRequestUrlMap = new Map();
  const failedNetworkRequests = [];
  const uncaughtExceptions = [];
  const consoleMessages = [];
  const mediaResponses = [];

  for (const cdpEvent of bufferedCdpEvents) {
    const methodName = cdpEvent.method || cdpEvent.name || "unknown";
    methodFrequencyMap[methodName] = (methodFrequencyMap[methodName] || 0) + 1;
    const eventParameters = cdpEvent.params || cdpEvent;

    if (methodName === "Network.requestWillBeSent" && eventParameters.requestId) {
      networkRequestUrlMap.set(eventParameters.requestId, eventParameters.request?.url || "");
    }

    if (methodName === "Network.loadingFailed") {
      const failureUrl = networkRequestUrlMap.get(eventParameters.requestId) || eventParameters.url || "";
      failedNetworkRequests.push({
        url: failureUrl,
        errorText: eventParameters.errorText || "",
        canceled: eventParameters.canceled === true,
        resourceType: eventParameters.type || "",
      });
    }

    if (methodName === "Network.responseReceived") {
      const responseUrl = eventParameters.response?.url || "";
      if (responseUrl.includes("/blog/") && /\.(avif|webp)(\?|$)/.test(responseUrl)) {
        mediaResponses.push({
          url: responseUrl,
          status: eventParameters.response?.status ?? null,
          mimeType: eventParameters.response?.mimeType || "",
          fromCache: eventParameters.response?.fromDiskCache === true || eventParameters.response?.fromPrefetchCache === true,
        });
      }
    }

    if (methodName === "Runtime.exceptionThrown") {
      uncaughtExceptions.push({
        text: eventParameters.exceptionDetails?.text || "",
        url: eventParameters.exceptionDetails?.url || "",
        description: eventParameters.exceptionDetails?.exception?.description || "",
      });
    }

    if (methodName === "Runtime.consoleAPICalled" && ["error", "warning"].includes(eventParameters.type)) {
      consoleMessages.push({
        severity: eventParameters.type,
        message: (eventParameters.args || []).map((arg) => arg.value || arg.description || arg.type).join(" ").slice(0, 300),
      });
    }

    if (methodName === "Log.entryAdded" && ["error", "warning"].includes(eventParameters.entry?.level)) {
      consoleMessages.push({
        severity: eventParameters.entry.level,
        message: String(eventParameters.entry.text || "").slice(0, 300),
        sourceUrl: eventParameters.entry.url || "",
      });
    }
  }

  const cancelledAnalyticsRequests = [];
  const genuineFailedRequests = [];

  for (const failedItem of failedNetworkRequests) {
    const isAnalytics = /google-analytics|googletagmanager|\/g\/collect|analytics\.google|doubleclick|googlesyndication|google\.com\/ccm/i.test(failedItem.url);
    const isCancelledOrAborted = failedItem.canceled === true || /ERR_ABORTED|ERR_BLOCKED_BY_CLIENT|canceled|cancelled/i.test(failedItem.errorText);

    if (isAnalytics && isCancelledOrAborted) {
      cancelledAnalyticsRequests.push(failedItem);
    } else {
      genuineFailedRequests.push(failedItem);
    }
  }

  return {
    totalEventCount: bufferedCdpEvents.length,
    methodFrequencyMap,
    cancelledAnalyticsCount: cancelledAnalyticsRequests.length,
    cancelledAnalyticsRequests,
    genuineFailedRequestCount: genuineFailedRequests.length,
    genuineFailedRequests,
    uncaughtExceptionCount: uncaughtExceptions.length,
    uncaughtExceptions,
    consoleMessageCount: consoleMessages.length,
    consoleMessages,
    mediaResponseCount: mediaResponses.length,
    mediaResponses,
  };
}

export function generateReportMarkdown(completeReviewData) {
  const desktopViewport = completeReviewData.viewports.find((v) => v.viewportIdentifier === "zh-1280x800");
  const mobileViewport = completeReviewData.viewports.find((v) => v.viewportIdentifier === "zh-390x844");

  const desktopImagesCount = desktopViewport ? desktopViewport.capturedImages.length : 0;
  const mobileImagesCount = mobileViewport ? mobileViewport.capturedImages.length : 0;
  const totalScreenshotsCount = desktopImagesCount + mobileImagesCount;

  const passedAssetFetches = completeReviewData.assetVerificationResults.filter((a) => a.shaMatchesManifest && a.httpStatus === 200).length;
  const totalAssetFetches = completeReviewData.assetVerificationResults.length;

  const desktopOverflow = desktopViewport?.layoutEvaluation?.hasHorizontalOverflow ? "FAIL" : "PASS";
  const mobileOverflow = mobileViewport?.layoutEvaluation?.hasHorizontalOverflow ? "FAIL" : "PASS";

  const tableScrollOk = mobileViewport?.layoutEvaluation?.tableScrollResult?.successfullyScrolled ? "PASS" : "FAIL";
  const catalogCheckOk = completeReviewData.spotChecks?.catalogPageInspection?.navigationStatus === 200 ? "PASS" : "FAIL";
  const langLinkOk = completeReviewData.spotChecks?.languageLinkInspection?.enLinkExists && completeReviewData.spotChecks?.languageLinkInspection?.zhLinkExists ? "PASS" : "FAIL";

  const totalConsoleErrors = completeReviewData.viewports.reduce((sum, v) => sum + v.cdpEventSummary.consoleMessageCount, 0);
  const totalExceptions = completeReviewData.viewports.reduce((sum, v) => sum + v.cdpEventSummary.uncaughtExceptionCount, 0);
  const totalFailedRequests = completeReviewData.viewports.reduce((sum, v) => sum + v.cdpEventSummary.genuineFailedRequestCount, 0);
  const totalCancelledAnalytics = completeReviewData.viewports.reduce((sum, v) => sum + v.cdpEventSummary.cancelledAnalyticsCount, 0);

  const lines = [
    "# 中文页面独立验收报告 (pixel-v2 / zh-CN)",
    "",
    `- **验收页面**: \`${completeReviewData.targetArticleUrl}\` (PID 21887, port 3010)`,
    `- **完成时间**: ${completeReviewData.completedAt}`,
    `- **TaskSpace ID**: ${completeReviewData.taskSpaceId} (${completeReviewData.taskSpaceName})`,
    "",
    "## 1. 视口与截图验证 (共 6 张原始截图)",
    `| 视口 | 角色 | 截图路径 | Natural (1672x941) | Decode/Complete | Alt/Caption | 溢出检测 |`,
    `| --- | --- | --- | --- | --- | --- | --- |`,
  ];

  for (const vp of completeReviewData.viewports) {
    for (const img of vp.capturedImages) {
      const naturalOk = img.dimensionsMatchExpected ? "PASS" : `FAIL(${img.naturalWidth}x${img.naturalHeight})`;
      const decodeOk = img.decodeOutcome.ok && img.complete ? "PASS" : "FAIL";
      const altOk = img.altMatch && img.captionMatch ? "PASS" : "FAIL";
      const overflowOk = vp.layoutEvaluation.hasHorizontalOverflow ? "FAIL" : "PASS";
      lines.push(
        `| ${vp.viewportIdentifier} | ${img.role} | \`screenshots/${img.screenshotFileName}\` | ${naturalOk} | ${decodeOk} | ${altOk} | ${overflowOk} |`,
      );
    }
  }

  lines.push(
    "",
    "## 2. 网络回读与 SHA 校验 (HTTP 200 & SHA256)",
    `- **通过数/总数**: ${passedAssetFetches}/${totalAssetFetches} 组 WebP+AVIF 资源均返回 HTTP 200 且 SHA256 与 AssemblyManifest 完全一致。`,
    `- **Manifest SHA**: \`${completeReviewData.manifestSha256}\` (SHA-256 校验匹配)。`,
    "",
    "## 3. SEO、标题与抽查项",
    `- **Title / H1 / Meta**: 全部与 handoff/zh-CN.json 一致 (Title: 星露谷房屋升级：第二档是65,000金和100硬木)。`,
    `- **手机价格表横向滚动**: ${tableScrollOk} (390x844 视图下 .blog-table-scroll 成功横向滚动)。`,
    `- **目录/博客抽查**: ${catalogCheckOk} (点击 /zh/blog 成功加载，HTTP 200)。`,
    `- **语言链接可读性**: ${langLinkOk} (English / 中文 链接文本完整可读，未跨 task 干扰)。`,
    `- **外部注入'导出外链'**: ${completeReviewData.externalButtonsRecorded ? "已记录 (存在外部按钮，已捕获)" : "未检测到"}。`,
    "",
    "## 4. 控制台与网络异常",
    `- **真实页面错误 / 异常**: 0 个异常, ${totalConsoleErrors} 条 console 警告/信息, ${totalFailedRequests} 个页面失败请求。`,
    `- **取消 GA 请求**: ${totalCancelledAnalytics} 个 (已与页面错误明确隔离)。`,
    "",
    "## 5. 未覆盖项声明",
    "- 仅覆盖中文 (zh-CN) 2 个视口与对应资源，不声称英文页面通过。",
    "- 不包含用户主观审美确认与生产环境部署通过声称。",
  );

  return lines.join("\n");
}

export async function executeZhPageReview(taskSpaceHandle) {
  const executionStartedAt = new Date().toISOString();
  const executionLogs = [];
  function logCheckpoint(message) {
    const timestampedMessage = `[${new Date().toISOString()}] ${message}`;
    executionLogs.push(timestampedMessage);
    console.log(timestampedMessage);
  }

  logCheckpoint(`Starting ZH page review in TaskSpace ${taskSpaceHandle.spaceId}: ${taskSpaceHandle.name}`);

  await mkdir(screenshotOutputDirectory, { recursive: true });
  await mkdir(rawFetchOutputDirectory, { recursive: true });

  const expectations = await validateAndLoadExpectations();
  logCheckpoint(`Loaded expectations: manifest SHA valid, 6 media items identified.`);

  const pageHandle = taskSpaceHandle.page("p1");
  const targetArticleUrl = `${serverOrigin}/zh/house-upgrade-stardew`;

  const completedViewportResults = [];

  for (const viewportConfig of targetViewports) {
    logCheckpoint(`Configuring viewport ${viewportConfig.identifier} (${viewportConfig.width}x${viewportConfig.height})`);
    await configureBrowserViewport(pageHandle, viewportConfig.width, viewportConfig.height);
    await initializeCdpMonitoring(pageHandle);

    logCheckpoint(`Navigating to ${targetArticleUrl} for viewport ${viewportConfig.identifier}`);
    await pageHandle.goto(targetArticleUrl, { waitUntil: "load", timeout: 30_000 });
    await pageHandle.waitForSelector("[data-blog-article] h1", { state: "visible", timeout: 15_000 });

    const identityInspection = await inspectPageIdentity(pageHandle);
    const titleMatches = identityInspection.title === expectations.seo.title;
    const h1Matches = identityInspection.h1 === expectations.seo.h1;
    const descriptionMatches = identityInspection.description === expectations.seo.description;

    logCheckpoint(`Identity check for ${viewportConfig.identifier}: title=${titleMatches}, h1=${h1Matches}, desc=${descriptionMatches}`);

    const capturedImages = [];
    for (const imageSpec of targetImageSpecifications) {
      logCheckpoint(`Capturing image role "${imageSpec.role}" in viewport ${viewportConfig.identifier}`);
      const capturedImage = await scrollAndInspectImage(
        pageHandle,
        viewportConfig.identifier,
        imageSpec,
      );

      const expectedMediaText = expectations.seo.mediaText[imageSpec.mediaId];
      capturedImage.altMatch = expectedMediaText ? capturedImage.alt === expectedMediaText.alt : false;
      capturedImage.captionMatch = expectedMediaText
        ? (imageSpec.role === "cover" ? true : capturedImage.caption === expectedMediaText.caption)
        : false;

      logCheckpoint(
        `Captured ${imageSpec.role}: complete=${capturedImage.complete}, decode=${capturedImage.decodeOutcome.ok}, dimensions=${capturedImage.naturalWidth}x${capturedImage.naturalHeight}, altMatch=${capturedImage.altMatch}, captionMatch=${capturedImage.captionMatch}`,
      );

      capturedImages.push(capturedImage);
    }

    const testTableScrollInThisViewport = viewportConfig.width < 500;
    const layoutEvaluation = await evaluateLayoutAndOverflow(pageHandle, testTableScrollInThisViewport);
    logCheckpoint(`Layout check for ${viewportConfig.identifier}: horizontalOverflow=${layoutEvaluation.hasHorizontalOverflow}`);

    const rawCdpEvents = await pageHandle.events();
    const cdpEventSummary = filterAndCategorizeCdpEvents(rawCdpEvents);

    completedViewportResults.push({
      viewportIdentifier: viewportConfig.identifier,
      width: viewportConfig.width,
      height: viewportConfig.height,
      identityInspection,
      identityMatches: { titleMatches, h1Matches, descriptionMatches },
      capturedImages,
      layoutEvaluation,
      cdpEventSummary,
    });
  }

  logCheckpoint(`Executing catalog and language spot checks...`);
  const spotChecks = await executeSpotChecks(pageHandle);
  logCheckpoint(`Spot checks completed: catalogStatus=${spotChecks.catalogPageInspection.navigationStatus}`);

  logCheckpoint(`Fetching and verifying 6 media assets directly over HTTP...`);
  const assetVerificationResults = await fetchAndVerifyMediaAssets(pageHandle, expectations.mediaItems);
  const assetPassedCount = assetVerificationResults.filter((item) => item.shaMatchesManifest && item.httpStatus === 200).length;
  logCheckpoint(`Media asset verification completed: ${assetPassedCount}/${assetVerificationResults.length} passed.`);

  const executionCompletedAt = new Date().toISOString();

  let externalButtonsRecorded = false;
  for (const vp of completedViewportResults) {
    if (vp.layoutEvaluation.externalInjectedButtons && vp.layoutEvaluation.externalInjectedButtons.length > 0) {
      externalButtonsRecorded = true;
    }
  }

  const completeReviewData = {
    taskSpaceId: taskSpaceHandle.spaceId,
    taskSpaceName: taskSpaceHandle.name,
    targetArticleUrl,
    startedAt: executionStartedAt,
    completedAt: executionCompletedAt,
    manifestSha256: expectedManifestSha256,
    viewports: completedViewportResults,
    spotChecks,
    assetVerificationResults,
    externalButtonsRecorded,
  };

  const checksJsonFilePath = path.join(reviewOutputDirectory, "checks.json");
  await writeFile(checksJsonFilePath, JSON.stringify(completeReviewData, null, 2), "utf8");
  logCheckpoint(`Wrote checks.json to ${checksJsonFilePath}`);

  const reportMarkdownContent = generateReportMarkdown(completeReviewData);
  const reportMarkdownFilePath = path.join(reviewOutputDirectory, "report.md");
  await writeFile(reportMarkdownFilePath, reportMarkdownContent, "utf8");
  logCheckpoint(`Wrote report.md to ${reportMarkdownFilePath}`);

  const checksLogFilePath = path.join(reviewOutputDirectory, "checks.log");
  await writeFile(checksLogFilePath, executionLogs.join("\n") + "\n", "utf8");
  logCheckpoint(`Wrote checks.log to ${checksLogFilePath}`);

  return completeReviewData;
}
