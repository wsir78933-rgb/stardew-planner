import fs from "node:fs/promises";
import path from "node:path";

const QA_DIR = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/faq-addition/qa";
const BASE_URL = "http://127.0.0.1:3010";

function failFast(condition, message) {
  if (!condition) {
    throw new Error(`[QA-ASSERTION-FAILED] ${message}`);
  }
}

async function getFaqBoundingBox(page) {
  return await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll("h2")).find(
      (el) => el.textContent.includes("FAQ") || el.textContent.includes("常见问题")
    );
    const faqList = document.querySelector(".blog-faq-list");
    if (!h2 || !faqList) {
      return null;
    }
    const h2Rect = h2.getBoundingClientRect();
    const faqRect = faqList.getBoundingClientRect();
    const top = window.scrollY + Math.min(h2Rect.top, faqRect.top);
    const bottom = window.scrollY + Math.max(h2Rect.bottom, faqRect.bottom);
    const left = window.scrollX + Math.min(h2Rect.left, faqRect.left);
    const right = window.scrollX + Math.max(h2Rect.right, faqRect.right);
    return {
      x: Math.max(0, Math.floor(left) - 10),
      y: Math.max(0, Math.floor(top) - 10),
      width: Math.ceil(right - left) + 20,
      height: Math.ceil(bottom - top) + 20,
    };
  });
}

async function extractDomFaqData(page) {
  return await page.evaluate(() => {
    const allH2 = Array.from(document.querySelectorAll("h2")).filter(
      (el) => el.textContent.includes("FAQ") || el.textContent.includes("常见问题")
    );
    const faqLists = Array.from(document.querySelectorAll(".blog-faq-list"));
    const faqItems = Array.from(document.querySelectorAll(".blog-faq-item"));
    const triggers = Array.from(document.querySelectorAll(".blog-faq-trigger"));
    const answers = Array.from(document.querySelectorAll(".blog-faq-answer"));
    const contents = Array.from(document.querySelectorAll(".blog-faq-content"));

    const itemStates = faqItems.map((item, index) => {
      const trigger = triggers[index];
      const answer = answers[index];
      const content = contents[index];
      const answerRect = answer ? answer.getBoundingClientRect() : null;
      return {
        index,
        triggerText: trigger ? trigger.textContent.trim() : null,
        ariaExpanded: trigger ? trigger.getAttribute("aria-expanded") : null,
        dataStateItem: item ? item.getAttribute("data-state") : null,
        dataStateContent: content ? content.getAttribute("data-state") : null,
        answerText: answer ? answer.textContent.trim() : null,
        answerHeight: answerRect ? answerRect.height : 0,
        isAnswerRendered: answerRect ? answerRect.height > 0 : false,
      };
    });

    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    const externalButtons = Array.from(document.querySelectorAll("*"))
      .filter((el) => {
        const text = el.textContent || "";
        return (
          text.includes("导出外链") &&
          (el.tagName === "BUTTON" ||
            el.getAttribute("role") === "button" ||
            el.className.includes("outlink"))
        );
      })
      .map((el) => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent.trim(),
      }));

    return {
      h2Count: allH2.length,
      h2Text: allH2.length > 0 ? allH2[0].textContent.trim() : null,
      faqListCount: faqLists.length,
      faqItemCount: faqItems.length,
      triggerCount: triggers.length,
      answerCount: answers.length,
      items: itemStates,
      viewport: {
        scrollWidth,
        clientWidth,
        hasHorizontalOverflow,
      },
      externalButtons,
    };
  });
}

async function runFaqQa() {
  const qaResults = {
    timestamp: new Date().toISOString(),
    taskSpaceId: null,
    pages: [],
    views: {},
    assertionsPassed: 0,
    assertionsFailed: 0,
    consoleEvents: [],
  };

  const task = await taskSpace("house-upgrade-stardew-faq-qa");
  try {
    qaResults.taskSpaceId = task.spaceId;
    const page = task.page("p1");
    const targetId = page.targetId;

    await page.cdp("Console.enable");
    await page.cdp("Runtime.enable");

    const viewConfigs = [
      {
        id: "desktop_en",
        name: "Desktop English",
        url: `${BASE_URL}/house-upgrade-stardew`,
        viewport: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
        expectedH2: "Farmhouse Upgrade FAQ",
        screenshotPath: path.join(QA_DIR, "faq-desktop-en.png"),
        isDesktop: true,
        testKeyboard: true,
      },
      {
        id: "desktop_zh",
        name: "Desktop Chinese",
        url: `${BASE_URL}/zh/house-upgrade-stardew`,
        viewport: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
        expectedH2: "星露谷房屋升级常见问题",
        screenshotPath: path.join(QA_DIR, "faq-desktop-zh.png"),
        isDesktop: true,
        testKeyboard: false,
      },
      {
        id: "mobile_en",
        name: "Mobile English",
        url: `${BASE_URL}/house-upgrade-stardew`,
        viewport: { width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
        expectedH2: "Farmhouse Upgrade FAQ",
        screenshotPath: path.join(QA_DIR, "faq-mobile-en.png"),
        isDesktop: false,
        testKeyboard: false,
      },
      {
        id: "mobile_zh",
        name: "Mobile Chinese",
        url: `${BASE_URL}/zh/house-upgrade-stardew`,
        viewport: { width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
        expectedH2: "星露谷房屋升级常见问题",
        screenshotPath: path.join(QA_DIR, "faq-mobile-zh.png"),
        isDesktop: false,
        testKeyboard: false,
      },
    ];

    for (const config of viewConfigs) {
      console.log(`\n=== Running View: ${config.name} (${config.viewport.width}x${config.viewport.height}) ===`);

      await page.cdp("Emulation.setDeviceMetricsOverride", config.viewport);
      if (config.viewport.mobile) {
        await page.cdp("Emulation.setTouchEmulationEnabled", { enabled: true });
      } else {
        await page.cdp("Emulation.setTouchEmulationEnabled", { enabled: false });
      }

      await page.goto(config.url, { waitUntil: "load" });
      await page.waitForSelector(".blog-faq-list", { state: "visible", timeout: 5000 });

      const currentUrl = await page.url();
      const currentTitle = await page.title();
      const rawEvents = await page.events();

      const viewConsoleEvents = rawEvents
        .filter((e) => e.method?.startsWith("Console.") || e.method?.startsWith("Runtime.consoleAPICalled"))
        .map((e) => ({
          method: e.method,
          text: e.params?.message?.text || e.params?.args?.[0]?.value || null,
          url: e.params?.message?.url || e.params?.stackTrace?.callFrames?.[0]?.url || null,
        }));

      qaResults.consoleEvents.push({
        viewId: config.id,
        events: viewConsoleEvents,
      });

      const initialDom = await extractDomFaqData(page);

      failFast(initialDom.h2Count === 1, `Expected exactly 1 FAQ H2 in ${config.id}, got ${initialDom.h2Count}`);
      qaResults.assertionsPassed++;

      failFast(
        initialDom.h2Text === config.expectedH2,
        `Expected FAQ H2 "${config.expectedH2}", got "${initialDom.h2Text}" in ${config.id}`
      );
      qaResults.assertionsPassed++;

      failFast(
        initialDom.triggerCount === 6,
        `Expected 6 triggers in ${config.id}, got ${initialDom.triggerCount}`
      );
      qaResults.assertionsPassed++;

      failFast(
        initialDom.answerCount === 6,
        `Expected 6 answers in ${config.id}, got ${initialDom.answerCount}`
      );
      qaResults.assertionsPassed++;

      failFast(
        initialDom.faqItemCount === 6,
        `Expected 6 faq-items in ${config.id}, got ${initialDom.faqItemCount}`
      );
      qaResults.assertionsPassed++;

      for (let i = 0; i < 6; i++) {
        const item = initialDom.items[i];
        failFast(
          item.ariaExpanded === "false",
          `Expected initial item ${i} aria-expanded to be 'false', got ${item.ariaExpanded} in ${config.id}`
        );
        failFast(
          item.dataStateItem === "closed",
          `Expected initial item ${i} data-state to be 'closed', got ${item.dataStateItem} in ${config.id}`
        );
        failFast(
          item.answerHeight === 0,
          `Expected initial item ${i} answer height to be 0, got ${item.answerHeight} in ${config.id}`
        );
        qaResults.assertionsPassed += 3;
      }

      if (!config.isDesktop) {
        failFast(
          !initialDom.viewport.hasHorizontalOverflow,
          `Expected no horizontal overflow in ${config.id}. scrollWidth: ${initialDom.viewport.scrollWidth}, clientWidth: ${initialDom.viewport.clientWidth}`
        );
        qaResults.assertionsPassed++;
      }

      const clickInteractionResults = [];

      if (config.isDesktop) {
        for (let i = 0; i < 6; i++) {
          const triggerSelector = `.blog-faq-trigger >> nth=${i}`;

          await page.click(triggerSelector, { label: `open faq ${i}` });
          await page.waitForTimeout(250);

          const afterOpen = await extractDomFaqData(page);
          const openedItem = afterOpen.items[i];

          failFast(
            openedItem.ariaExpanded === "true",
            `Expected item ${i} aria-expanded='true' after click, got ${openedItem.ariaExpanded} in ${config.id}`
          );
          failFast(
            openedItem.dataStateItem === "open",
            `Expected item ${i} data-state='open' after click, got ${openedItem.dataStateItem} in ${config.id}`
          );
          failFast(
            openedItem.answerHeight > 0,
            `Expected item ${i} answer height > 0 after click, got ${openedItem.answerHeight} in ${config.id}`
          );
          qaResults.assertionsPassed += 3;

          for (let j = 0; j < 6; j++) {
            if (j !== i) {
              const otherItem = afterOpen.items[j];
              failFast(
                otherItem.ariaExpanded === "false",
                `Single-expand violated: item ${j} was not closed when item ${i} opened (got ${otherItem.ariaExpanded}) in ${config.id}`
              );
              failFast(
                otherItem.answerHeight === 0,
                `Single-expand violated: item ${j} height was not 0 when item ${i} opened (got ${otherItem.answerHeight}) in ${config.id}`
              );
              qaResults.assertionsPassed += 2;
            }
          }

          await page.click(triggerSelector, { label: `collapse faq ${i}` });
          await page.waitForTimeout(250);

          const afterCollapse = await extractDomFaqData(page);
          const collapsedItem = afterCollapse.items[i];

          failFast(
            collapsedItem.ariaExpanded === "false",
            `Expected item ${i} aria-expanded='false' after second click, got ${collapsedItem.ariaExpanded} in ${config.id}`
          );
          failFast(
            collapsedItem.answerHeight === 0,
            `Expected item ${i} answer height=0 after second click, got ${collapsedItem.answerHeight} in ${config.id}`
          );
          qaResults.assertionsPassed += 2;

          clickInteractionResults.push({
            itemIndex: i,
            question: openedItem.triggerText,
            answerExcerpt: openedItem.answerText.slice(0, 40) + "...",
            afterOpenExpanded: openedItem.ariaExpanded,
            afterOpenHeight: openedItem.answerHeight,
            afterCollapseExpanded: collapsedItem.ariaExpanded,
            afterCollapseHeight: collapsedItem.answerHeight,
            singleExpandVerified: true,
          });
        }
      } else {
        const triggerSelector = ".blog-faq-trigger >> nth=0";
        await page.click(triggerSelector, { label: "open mobile faq 0" });
        await page.waitForTimeout(250);

        const afterOpen = await extractDomFaqData(page);
        failFast(
          afterOpen.items[0].ariaExpanded === "true" && afterOpen.items[0].answerHeight > 0,
          `Expected mobile item 0 open in ${config.id}`
        );
        qaResults.assertionsPassed += 2;

        await page.click(triggerSelector, { label: "collapse mobile faq 0" });
        await page.waitForTimeout(250);

        const afterCollapse = await extractDomFaqData(page);
        failFast(
          afterCollapse.items[0].ariaExpanded === "false" && afterCollapse.items[0].answerHeight === 0,
          `Expected mobile item 0 collapsed in ${config.id}`
        );
        qaResults.assertionsPassed += 2;

        clickInteractionResults.push({
          itemIndex: 0,
          question: afterOpen.items[0].triggerText,
          afterOpenExpanded: afterOpen.items[0].ariaExpanded,
          afterOpenHeight: afterOpen.items[0].answerHeight,
          afterCollapseExpanded: afterCollapse.items[0].ariaExpanded,
          afterCollapseHeight: afterCollapse.items[0].answerHeight,
        });
      }

      const keyboardResults = {};
      if (config.testKeyboard) {
        const triggerSelector = ".blog-faq-trigger >> nth=0";

        await page.press(triggerSelector, "Enter");
        await page.waitForTimeout(250);
        let dom = await extractDomFaqData(page);
        failFast(
          dom.items[0].ariaExpanded === "true" && dom.items[0].answerHeight > 0,
          `Enter key did not expand trigger 0 in ${config.id}`
        );
        keyboardResults.enterOpen = true;
        qaResults.assertionsPassed++;

        await page.press(triggerSelector, "Enter");
        await page.waitForTimeout(250);
        dom = await extractDomFaqData(page);
        failFast(
          dom.items[0].ariaExpanded === "false" && dom.items[0].answerHeight === 0,
          `Enter key did not collapse trigger 0 in ${config.id}`
        );
        keyboardResults.enterCollapse = true;
        qaResults.assertionsPassed++;

        await page.press(triggerSelector, "Space");
        await page.waitForTimeout(250);
        dom = await extractDomFaqData(page);
        failFast(
          dom.items[0].ariaExpanded === "true" && dom.items[0].answerHeight > 0,
          `Space key did not expand trigger 0 in ${config.id}`
        );
        keyboardResults.spaceOpen = true;
        qaResults.assertionsPassed++;

        await page.press(triggerSelector, "Space");
        await page.waitForTimeout(250);
        dom = await extractDomFaqData(page);
        failFast(
          dom.items[0].ariaExpanded === "false" && dom.items[0].answerHeight === 0,
          `Space key did not collapse trigger 0 in ${config.id}`
        );
        keyboardResults.spaceCollapse = true;
        qaResults.assertionsPassed++;
      }

      await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll("h2")).find(
          (el) => el.textContent.includes("FAQ") || el.textContent.includes("常见问题")
        );
        h2?.scrollIntoView({ block: "start" });
      });
      await page.waitForTimeout(300);

      const clipBox = await getFaqBoundingBox(page);
      failFast(clipBox !== null, `Failed to compute clip bounding box for FAQ in ${config.id}`);
      qaResults.assertionsPassed++;

      await page.screenshot({ path: config.screenshotPath, clip: clipBox });
      const stat = await fs.stat(config.screenshotPath);
      failFast(stat.size > 0, `Screenshot file is empty at ${config.screenshotPath}`);
      qaResults.assertionsPassed++;

      qaResults.views[config.id] = {
        viewName: config.name,
        url: currentUrl,
        title: currentTitle,
        viewport: config.viewport,
        h2: initialDom.h2Text,
        initialItemsCount: initialDom.faqItemCount,
        initialTriggersCount: initialDom.triggerCount,
        initialAnswersCount: initialDom.answerCount,
        items: initialDom.items.map((it) => ({
          index: it.index,
          question: it.triggerText,
          answer: it.answerText,
        })),
        clickInteractions: clickInteractionResults,
        keyboardInteractions: config.testKeyboard ? keyboardResults : null,
        horizontalOverflow: initialDom.viewport.hasHorizontalOverflow,
        externalButtons: initialDom.externalButtons,
        screenshot: {
          path: config.screenshotPath,
          bytes: stat.size,
          clip: clipBox,
        },
        status: "PASS",
      };

      console.log(`✓ ${config.name} PASSED all assertions. Screenshot: ${config.screenshotPath} (${stat.size} bytes)`);
    }

    qaResults.pages.push({
      label: page.label,
      spaceId: task.spaceId,
      targetId,
    });

    const jsonOutputPath = path.join(QA_DIR, "browser-eval.json");
    await fs.writeFile(jsonOutputPath, JSON.stringify(qaResults, null, 2), "utf8");
    console.log(`\nBrowser evaluation JSON saved to: ${jsonOutputPath}`);
    console.log(`Total assertions passed: ${qaResults.assertionsPassed}`);
    console.log(`Total assertions failed: ${qaResults.assertionsFailed}`);

    return qaResults;
  } finally {
    await task.finish({ keep: [] });
  }
}

runFaqQa().catch((err) => {
  console.error("FATAL QA ERROR:", err);
  process.exit(1);
});
