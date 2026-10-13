const fs = await import("node:fs/promises");
const path = await import("node:path");

const reviewDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/footer-v1/review";
const origin = "http://127.0.0.1:3004";

const task = await taskSpace(151);
if (task.spaceId !== 151 || task.ownership !== "agent") {
  throw new Error(`Refusing TaskSpace ${task.spaceId} ownership ${JSON.stringify(task.ownership)}.`);
}
const page = task.page("p1");

await page.cdp("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

async function portalText() {
  const documentResult = await page.cdp("DOM.getDocument", { depth: 0 });
  const portal = await page.cdp("DOM.querySelector", {
    nodeId: documentResult.root.nodeId,
    selector: "nextjs-portal",
  });
  if (!portal.nodeId) {
    return { found: false };
  }
  const described = await page.cdp("DOM.describeNode", { nodeId: portal.nodeId, pierce: true });
  const shadow = described.node.shadowRoots?.[0];
  if (!shadow?.nodeId) {
    return { found: true, shadow: false };
  }
  const outer = await page.cdp("DOM.getOuterHTML", { nodeId: shadow.nodeId });
  const text = outer.outerHTML.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { found: true, shadow: true, text: text.slice(0, 2500), textLength: text.length };
}

async function clickPortalButton() {
  const documentResult = await page.cdp("DOM.getDocument", { depth: 0 });
  const portal = await page.cdp("DOM.querySelector", {
    nodeId: documentResult.root.nodeId,
    selector: "nextjs-portal",
  });
  if (!portal.nodeId) {
    return { clicked: false, reason: "portal-missing" };
  }
  const described = await page.cdp("DOM.describeNode", { nodeId: portal.nodeId, pierce: true });
  const shadowId = described.node.shadowRoots?.[0]?.nodeId;
  if (!shadowId) {
    return { clicked: false, reason: "shadow-missing" };
  }
  const buttons = await page.cdp("DOM.querySelectorAll", { nodeId: shadowId, selector: "button" });
  const buttonIds = buttons.nodeIds ?? [];
  const buttonNotes = [];
  for (const nodeId of buttonIds.slice(0, 6)) {
    const node = await page.cdp("DOM.describeNode", { nodeId, pierce: true });
    let quads = [];
    try {
      const content = await page.cdp("DOM.getContentQuads", { nodeId });
      quads = content.quads ?? [];
    } catch (error) {
      quads = [error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160)];
    }
    buttonNotes.push({
      nodeName: node.node.nodeName,
      attrs: node.node.attributes?.slice(0, 12) ?? [],
      quads,
    });
  }
  const clickable = buttonNotes.find((note) => Array.isArray(note.quads) && Array.isArray(note.quads[0]));
  if (!clickable) {
    return { clicked: false, reason: "no-button-quad", buttonCount: buttonIds.length, buttonNotes };
  }
  const quad = clickable.quads[0];
  const x = Math.round((quad[0] + quad[2] + quad[4] + quad[6]) / 4);
  const y = Math.round((quad[1] + quad[3] + quad[5] + quad[7]) / 4);
  await page.mouse.click(x, y, { label: "open next dev badge" });
  return { clicked: true, x, y, buttonCount: buttonIds.length };
}

await page.goto(`${origin}/zh#planner`, { waitUntil: "load", timeout: 30000 });
await page.waitForFunction(() => location.hash === "#planner", undefined, { timeout: 20000 });
await page.waitForTimeout(1000);
const beforeClick = await portalText();
const click = await clickPortalButton();
await page.waitForTimeout(700);
const afterClick = await portalText();
const shot = await page.screenshot({
  path: path.join(reviewDirectory, "screenshots", "zh-1440-dev-issue-open.png"),
  fullPage: false,
  scale: "css",
});
await page.reload({ waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(1000);
const afterReload = await portalText();

await page.goto(`${origin}/how-to-harvest-stardew-valley`, { waitUntil: "load", timeout: 30000 });
const report = {
  beforeClick,
  click,
  afterClick,
  afterReload,
  screenshot: path.relative(reviewDirectory, shot),
  leftOn: await page.url(),
  taskSpaceFinished: false,
};
await fs.writeFile(path.join(reviewDirectory, "dev-issue-facts.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  event: "dev-issue-captured",
  click,
  before: beforeClick.text?.slice(0, 500) ?? beforeClick,
  after: afterClick.text?.slice(0, 800) ?? afterClick,
  reload: afterReload.text?.slice(0, 500) ?? afterReload,
}));
