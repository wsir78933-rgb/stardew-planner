const SOURCE_URLS = {
  englishBing:
    "https://www.bing.com/search?q=stardew%20valley%20speed%20gro&setlang=en-US&cc=US",
  chineseBing:
    "https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&setlang=zh-CN&cc=CN",
  changelog:
    "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
  chineseSpeedGro:
    "https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0",
};

function describeThrownValue(thrownValue) {
  if (thrownValue instanceof Error) {
    return `${thrownValue.name}: ${thrownValue.message}`;
  }
  return `Thrown value: ${String(thrownValue)}`;
}

function pageMatchesRequestedUrl(observedUrl, requestedUrl) {
  if (!observedUrl) {
    return false;
  }
  const observed = new URL(observedUrl);
  const requested = new URL(requestedUrl);
  return (
    observed.origin === requested.origin &&
    observed.pathname === requested.pathname &&
    observed.search === requested.search &&
    observed.hash === requested.hash
  );
}

async function readBingResult(page, query, requestedUrl) {
  const result = await page.evaluate(
    ({ expectedQuery, expectedUrl }) => {
      const collectUniqueLines = (lines) => [...new Set(lines.map((line) => line.trim()).filter(Boolean))];
      const visibleText = document.body?.innerText ?? "";
      const resultItems = [...document.querySelectorAll("li.b_algo")]
        .slice(0, 10)
        .map((item, index) => ({
          rank: index + 1,
          title: item.querySelector("h2")?.textContent?.trim() ?? "",
          url: item.querySelector("h2 a")?.href ?? item.querySelector("a")?.href ?? "",
          snippet: item.querySelector(".b_caption p")?.textContent?.trim() ?? "",
        }))
        .filter((item) => item.title || item.url || item.snippet);
      const regionLines = collectUniqueLines(
        visibleText
          .split(/\n+/)
          .filter((line) =>
            /^(?:United States|美国|中国大陆|China mainland)$/i.test(line.trim()) ||
            /^(?:location|region|country\/region|国家\/地区|地区)\s*[:：]/i.test(line.trim()),
          ),
      ).slice(0, 8);
      return {
        expectedQuery,
        expectedUrl,
        title: document.title,
        resultCount: resultItems.length,
        results: resultItems,
        navigatorLanguage: navigator.language,
        navigatorLanguages: [...navigator.languages],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        visibleRegionLines: regionLines,
        hasExplicitRegionText: regionLines.length > 0,
      };
    },
    { expectedQuery: query, expectedUrl: requestedUrl },
  );
  return {
    ...result,
    contentCheckPassed: result.resultCount > 0,
  };
}

async function readOfficialChangelog(page) {
  return page.evaluate(() => {
    const collectUniqueLines = (lines) => [...new Set(lines.map((line) => line.trim()).filter(Boolean))];
    const visibleText = document.body?.innerText ?? "";
    const lines = collectUniqueLines(visibleText.split(/\n+/));
    const keyLines = lines.filter((line) =>
      /Speed-Gro now requires|Deluxe Speed-Gro now requires/i.test(line),
    );
    const requiredPhrases = [
      "Speed-Gro now requires 5 Moss instead of 1 Clam",
      "Deluxe Speed-Gro now requires 5 bone fragments instead of 1 coral",
    ];
    const phraseChecks = requiredPhrases.map((phrase) => ({
      phrase,
      found: visibleText.toLowerCase().includes(phrase.toLowerCase()),
    }));
    return {
      title: document.title,
      keyLines,
      phraseChecks,
      contentCheckPassed: phraseChecks.every((check) => check.found),
    };
  });
}

async function readChineseSpeedGroPage(page) {
  return page.evaluate(() => {
    const collectUniqueLines = (lines) => [...new Set(lines.map((line) => line.trim()).filter(Boolean))];
    const visibleText = document.body?.innerText ?? "";
    const lines = collectUniqueLines(visibleText.split(/\n+/));
    const signalPatterns = [
      { signal: "ten-percent-growth", pattern: /10%/i },
      { signal: "pine-tar", pattern: /松焦油/ },
      { signal: "moss", pattern: /苔藓/ },
    ];
    const signalChecks = signalPatterns.map(({ signal, pattern }) => ({
      signal,
      found: pattern.test(visibleText),
    }));
    const keyLines = lines
      .filter((line) => /10%|松焦油|苔藓|耕种 3|春季 15|100 金|100g/i.test(line))
      .slice(0, 20);
    return {
      title: document.title,
      keyLines,
      signalChecks,
      contentCheckPassed: signalChecks.every((check) => check.found),
    };
  });
}

async function executePageRead(page, sampleName, requestedUrl, contentReader) {
  let navigationError = null;
  let loadError = null;
  let evaluationError = null;
  let observedUrl = null;
  let observedTitle = null;
  let content = null;

  try {
    await page.goto(requestedUrl);
  } catch (thrownValue) {
    navigationError = describeThrownValue(thrownValue);
  }

  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
  } catch (thrownValue) {
    loadError = describeThrownValue(thrownValue);
  }

  try {
    observedUrl = await page.url();
    observedTitle = await page.title();
    content = await contentReader(page);
  } catch (thrownValue) {
    evaluationError = describeThrownValue(thrownValue);
  }

  const pageMatchesUrl = pageMatchesRequestedUrl(observedUrl, requestedUrl);
  const contentCheckPassed = content?.contentCheckPassed === true;
  let status = "pass";
  if (evaluationError) {
    status = "read-failed";
  } else if (!pageMatchesUrl) {
    status = "unexpected-page";
  } else if (!contentCheckPassed) {
    status = "content-check-failed";
  } else if (navigationError || loadError) {
    status = "read-after-navigation-warning";
  }

  return {
    sampleName,
    requestedUrl,
    observedUrl,
    observedTitle,
    pageMatchesUrl,
    navigationError,
    loadError,
    evaluationError,
    status,
    content,
  };
}

async function executeRepresentativeSamples(page) {
  const samples = [];
  samples.push(
    await executePageRead(page, "english-bing-us-parameter", SOURCE_URLS.englishBing, (currentPage) =>
      readBingResult(currentPage, "stardew valley speed gro", SOURCE_URLS.englishBing),
    ),
  );
  samples.push(
    await executePageRead(page, "chinese-bing-cn-parameter", SOURCE_URLS.chineseBing, (currentPage) =>
      readBingResult(currentPage, "星露谷物语 生长激素", SOURCE_URLS.chineseBing),
    ),
  );
  samples.push(
    await executePageRead(page, "official-1-6-changelog", SOURCE_URLS.changelog, (currentPage) =>
      readOfficialChangelog(currentPage),
    ),
  );
  samples.push(
    await executePageRead(page, "chinese-speed-gro-page", SOURCE_URLS.chineseSpeedGro, (currentPage) =>
      readChineseSpeedGroPage(currentPage),
    ),
  );
  return samples;
}

const startedAt = new Date().toISOString();
let taskSpace = null;
let samples = [];
let fatalError = null;
let finishReceipt = null;
let finishError = null;
let requestedExitCode = 0;

try {
  taskSpace = await globalThis.taskSpace("stardew speed gro reproducibility sample");
  const page = taskSpace.page("p1");
  samples = await executeRepresentativeSamples(page);
  if (samples.some((sample) => sample.status !== "pass")) {
    requestedExitCode = 1;
  }
} catch (thrownValue) {
  fatalError = describeThrownValue(thrownValue);
  requestedExitCode = 1;
} finally {
  if (taskSpace) {
    try {
      finishReceipt = await taskSpace.finish({ keep: [] });
    } catch (thrownValue) {
      finishError = describeThrownValue(thrownValue);
      requestedExitCode = 1;
    }
  }
}

const finishedAt = new Date().toISOString();
const replayReport = {
  startedAt,
  finishedAt,
  taskSpaceName: "stardew speed gro reproducibility sample",
  samples,
  regionBoundary:
    "setlang and cc are request parameters only. navigator language, timezone, visible page text, and result order do not prove physical US/CN location or a personalized US/CN SERP. No CAPTCHA was bypassed.",
  fatalError,
  finishReceipt,
  finishError,
  requestedExitCode,
};
console.log(JSON.stringify(replayReport, null, 2));
process.exitCode = requestedExitCode;
