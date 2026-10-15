const fs = await import("node:fs/promises");
const path = await import("node:path");

const reviewDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/footer-v1/review";
const shotDirectory = path.join(reviewDirectory, "screenshots");
const origin = "http://127.0.0.1:3004";

const task = await taskSpace(151);
if (task.spaceId !== 151 || task.ownership !== "agent") {
  throw new Error(`Refusing TaskSpace ${task.spaceId} ownership ${JSON.stringify(task.ownership)}.`);
}
const page = task.page("p1");

async function setCssViewport(width, height, mobile) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  const measured = await page.evaluate(() => ({ innerWidth: window.innerWidth, innerHeight: window.innerHeight }));
  if (measured.innerWidth !== width || measured.innerHeight !== height) {
    throw new Error(`Viewport mismatch. Requested ${width}x${height}. Measured ${JSON.stringify(measured)}.`);
  }
}

async function screenshot(fileName) {
  const savedPath = await page.screenshot({
    path: path.join(shotDirectory, fileName),
    fullPage: false,
    scale: "css",
  });
  return path.relative(reviewDirectory, savedPath);
}

function collectDevIssueText() {
  const snippets = [];
  function visit(root, depth) {
    if (root === null || depth > 6) {
      return;
    }
    const text = "innerText" in root ? root.innerText : root.textContent;
    if (typeof text === "string" && /issue|error|warning/i.test(text) && text.length < 1200) {
      snippets.push(text.replace(/\s+/g, " ").trim());
    }
    const nodes = root.querySelectorAll ? [...root.querySelectorAll("*")] : [];
    for (const node of nodes) {
      if (node.shadowRoot) {
        visit(node.shadowRoot, depth + 1);
      }
    }
  }
  visit(document, 0);
  return [...new Set(snippets)].slice(0, 20);
}

async function stableAnswers() {
  const rows = [];
  for (let index = 0; index < 5; index += 1) {
    await page.click(`css:.blog-faq-trigger >> nth=${index}`, { label: `recheck FAQ ${index + 1}` });
    let waitError = null;
    try {
    await page.waitForFunction(
      (itemIndex) => {
        const item = document.querySelectorAll(".blog-faq-item")[itemIndex];
        const answer = item?.querySelector(".blog-faq-answer");
        if (!(item instanceof HTMLElement) || !(answer instanceof HTMLElement)) {
          return false;
        }
        if (item.getAttribute("data-state") !== "open") {
          return false;
        }
        const height = Math.round(answer.getBoundingClientRect().height);
        const previous = answer.dataset.stableHeight ?? "";
        answer.dataset.stableHeight = String(height);
        return previous === String(height) && height > 24 && answer.scrollHeight <= answer.clientHeight + 2;
      },
      index,
      { timeout: 5000 },
    );
    } catch (error) {
      waitError = error instanceof Error ? error.message.slice(0, 300) : String(error).slice(0, 300);
    }
    const row = await page.evaluate((itemIndex) => {
      const item = document.querySelectorAll(".blog-faq-item")[itemIndex];
      const answer = item.querySelector(".blog-faq-answer");
      return {
        index: itemIndex,
        state: item.getAttribute("data-state"),
        height: Math.round(answer.getBoundingClientRect().height),
        scrollHeight: answer.scrollHeight,
        clientHeight: answer.clientHeight,
        text: answer.textContent.replace(/\s+/g, " ").trim(),
      };
    }, index);
    if (waitError) {
      row.waitError = waitError;
    }
    rows.push(row);
    if (index === 1 && captureItemTwo) {
      await page.evaluate((itemIndex) => {
        document.querySelectorAll(".blog-faq-item")[itemIndex].scrollIntoView({ block: "center" });
      }, index);
      itemTwoShot = await screenshot("zh-1440-faq-item-2-open.png");
    }
  }
  return rows;
}

await setCssViewport(1440, 900, false);
await page.goto(`${origin}/how-to-harvest-stardew-valley`, { waitUntil: "load", timeout: 30000 });
await page.waitForSelector("css:.blog-faq-list", { timeout: 20000 });
await page.waitForTimeout(1500);
const beforeClick = await page.evaluate(collectDevIssueText);
const snapshotText = await page.snapshot();
const snapshotIssueLines = String(snapshotText)
  .split("\n")
  .filter((line) => /issue|error|warning/i.test(line))
  .slice(0, 40);
const issueButtonLine = snapshotIssueLines.find((line) => /button/i.test(line) && /issue/i.test(line));
const issueRefMatch = issueButtonLine?.match(/@(\d+)/) ?? issueButtonLine?.match(/ref=(\d+)/);
let clickResult = { found: false, method: "none" };
try {
  if (issueRefMatch) {
    await page.click(`@${issueRefMatch[1]}`, { label: "open dev issue badge" });
    clickResult = { found: true, method: "snapshot-ref", ref: issueRefMatch[1] };
  } else {
    await page.click("text=1 Issue", { label: "open dev issue badge" });
    clickResult = { found: true, method: "text-1-issue" };
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  clickResult = {
    found: false,
    method: issueRefMatch ? "snapshot-ref" : "text-1-issue",
    error: message.slice(0, 400),
  };
}
const domClickResult = await page.evaluate(() => {
  function findButton(root, depth) {
    if (root === null || depth > 6 || !root.querySelectorAll) {
      return null;
    }
    for (const button of root.querySelectorAll("button")) {
      const text = button.innerText || button.getAttribute("aria-label") || "";
      if (/issue/i.test(text)) {
        return button;
      }
    }
    for (const node of root.querySelectorAll("*")) {
      if (node.shadowRoot) {
        const found = findButton(node.shadowRoot, depth + 1);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  const button = findButton(document, 0);
  if (!(button instanceof HTMLButtonElement)) {
    return { found: false };
  }
  const label = button.innerText.replace(/\s+/g, " ").trim();
  button.click();
  return { found: true, label };
});
await page.waitForTimeout(500);
const afterClick = await page.evaluate(collectDevIssueText);
const afterClickSnapshotLines = String(await page.snapshot())
  .split("\n")
  .filter((line) => /issue|error|warning/i.test(line))
  .slice(0, 60);
const issueShot = await screenshot("en-1440-dev-issue.png");
console.log(JSON.stringify({
  event: "issue-text",
  beforeClick,
  snapshotIssueLines,
  clickResult,
  domClickResult,
  afterClick,
  afterClickSnapshotLines,
  afterReloadPending: true,
}));

await page.reload({ waitUntil: "load", timeout: 30000 });
await page.waitForSelector("css:.blog-faq-list", { timeout: 20000 });
await page.waitForTimeout(1000);
const afterReload = await page.evaluate(collectDevIssueText);
await fs.writeFile(
  path.join(reviewDirectory, "recheck-facts.json"),
  `${JSON.stringify({
    partial: true,
    devIssue: {
      beforeClick,
      snapshotIssueLines,
      clickResult,
      domClickResult,
      afterClick,
      afterClickSnapshotLines,
      issueShot,
      afterReload,
    },
  }, null, 2)}\n`,
);

let captureItemTwo = false;
let itemTwoShot = null;
const answerRecheck = [];
for (const locale of ["en", "zh"]) {
  for (const viewport of [
    { name: "1440", width: 1440, height: 900, mobile: false },
    { name: "375", width: 375, height: 812, mobile: true },
  ]) {
    await setCssViewport(viewport.width, viewport.height, viewport.mobile);
    const url = locale === "en"
      ? `${origin}/how-to-harvest-stardew-valley`
      : `${origin}/zh/how-to-harvest-stardew-valley`;
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector("css:.blog-faq-list", { timeout: 20000 });
    captureItemTwo = locale === "zh" && viewport.name === "1440";
    const rows = await stableAnswers();
    captureItemTwo = false;
    answerRecheck.push({
      locale,
      viewport: viewport.name,
      rows,
      shot: locale === "zh" && viewport.name === "1440" ? itemTwoShot : null,
    });
  }
}

await setCssViewport(1440, 900, false);
await page.goto(`${origin}/zh/how-to-harvest-stardew-valley`, { waitUntil: "load", timeout: 30000 });
await page.click("css=[data-blog-planner-cta-action='true']", { label: "recheck Chinese planner" });
await page.waitForFunction(
  () => location.hash === "#planner" && document.querySelector("#planner") instanceof HTMLElement,
  undefined,
  { timeout: 20000 },
);
let plannerPaint = "not-waited";
try {
  await page.waitForFunction(
    () => {
      const planner = document.querySelector("#planner");
      if (!(planner instanceof HTMLElement)) {
        return false;
      }
      const image = planner.querySelector("img");
      const canvas = planner.querySelector("canvas");
      const imageReady = image instanceof HTMLImageElement && image.naturalWidth > 0;
      const canvasReady = canvas instanceof HTMLCanvasElement && canvas.width > 0;
      return imageReady || canvasReady;
    },
    undefined,
    { timeout: 15000 },
  );
  plannerPaint = "image-or-canvas-ready";
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  plannerPaint = `paint-wait-ended: ${message.slice(0, 300)}`;
}
await page.evaluate(() => document.querySelector("#planner")?.scrollIntoView({ block: "center" }));
const zhPlannerShot = await screenshot("zh-1440-planner-r2.png");
const zhPlanner = await page.evaluate(() => {
  const planner = document.querySelector("#planner");
  const box = planner instanceof HTMLElement ? planner.getBoundingClientRect() : null;
  return {
    url: location.href,
    hash: location.hash,
    plannerVisible: planner instanceof HTMLElement && box !== null && box.width > 0 && box.height > 0,
    plannerBox: box === null ? null : { width: Math.round(box.width), height: Math.round(box.height) },
  };
});

await setCssViewport(1440, 900, false);
await page.goto(`${origin}/how-to-harvest-stardew-valley`, { waitUntil: "load", timeout: 30000 });

const report = {
  devIssue: {
    beforeClick,
    snapshotIssueLines,
    clickResult,
    domClickResult,
    afterClick,
    afterClickSnapshotLines,
    issueShot,
    afterReload,
  },
  answerRecheck,
  zhPlanner: { ...zhPlanner, plannerPaint, screenshot: zhPlannerShot },
  leftOn: { url: await page.url(), viewport: "1440x900" },
  taskSpaceFinished: false,
};
await fs.writeFile(path.join(reviewDirectory, "recheck-facts.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  event: "recheck-done",
  click: clickResult,
  beforeCount: beforeClick.length,
  afterCount: afterClick.length,
  reloadCount: afterReload.length,
  answers: answerRecheck.map((item) => ({
    locale: item.locale,
    viewport: item.viewport,
    heights: item.rows.map((row) => row.height),
  })),
}, null, 2));
