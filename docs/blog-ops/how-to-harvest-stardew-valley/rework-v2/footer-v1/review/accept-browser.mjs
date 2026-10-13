const fs = await import("node:fs/promises");
const path = await import("node:path");

const reviewDirectory = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/footer-v1/review";
const shotDirectory = path.join(reviewDirectory, "screenshots");
const origin = "http://127.0.0.1:3004";
const operationStorePath = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/operation-store.json";

await fs.mkdir(shotDirectory, { recursive: true });

function articleUrl(locale) {
  if (locale !== "en" && locale !== "zh") {
    throw new Error(`Unsupported article locale. Received: ${JSON.stringify(locale)}.`);
  }
  return locale === "en" ? `${origin}/how-to-harvest-stardew-valley` : `${origin}/zh/how-to-harvest-stardew-valley`;
}

function articlePath(locale) {
  return locale === "en" ? "/how-to-harvest-stardew-valley" : "/zh/how-to-harvest-stardew-valley";
}

function expectedCopy(locale) {
  if (locale === "en") {
    return {
      title: "How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe",
      description: "Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.",
      canonical: "https://stardewvalleyplanner.art/how-to-harvest-stardew-valley",
      plannerHref: "/#planner",
      faqHeading: "How to Harvest Stardew Valley FAQ",
      sourcesHeading: "Sources",
      htmlLang: "en",
      inLanguage: "en",
      coverAlt: "An evening farm with orange pumpkins in a tilled bed, dirt paths around the plots, and wooden trellis rows beside the pumpkins.",
      bodyAlts: [
        "Full orange pumpkins on tilled soil beside a dirt path.",
        "Two wooden trellises with an open dirt path between them and purple grapes on the trellis beside the path.",
      ],
    };
  }
  return {
    title: "星露谷物语怎么收作物：徒手、镰刀或斧头",
    description: "防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。",
    canonical: "https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley",
    plannerHref: "/zh#planner",
    faqHeading: "星露谷物语收作物常见问题",
    sourcesHeading: "来源",
    htmlLang: "zh-CN",
    inLanguage: "zh-CN",
    coverAlt: "傍晚的农场：一块耕地里是橙色南瓜，田块周围是土路，南瓜旁边是一排排木棚架。",
    bodyAlts: [
      "土路旁的耕地上长着饱满的橙色南瓜。",
      "两排木棚架中间有一条空土路，路旁的棚架上有紫色葡萄。",
    ],
  };
}

const task = await taskSpace(151);
if (task.spaceId !== 151 || task.ownership !== "agent" || task.name !== "harvest page r2 acceptance") {
  throw new Error(
    `Refusing TaskSpace. Received id ${task.spaceId}, ownership ${JSON.stringify(task.ownership)}, name ${JSON.stringify(task.name)}.`,
  );
}
const page = task.page("p1");
console.log(JSON.stringify({ event: "resumed", spaceId: task.spaceId, ownership: task.ownership, url: await page.url() }));

const operationStore = JSON.parse(await fs.readFile(operationStorePath, "utf8"));
if (typeof operationStore.canary !== "string" || operationStore.canary.length === 0) {
  throw new Error("Operation store canary is missing. Refusing to scan the live page without it.");
}

async function setCssViewport(width, height, mobile) {
  await page.cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  const measured = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  if (measured.innerWidth !== width || measured.innerHeight !== height) {
    throw new Error(`Viewport mismatch. Requested ${width}x${height}. Measured ${JSON.stringify(measured)}.`);
  }
  return measured;
}

async function screenshot(fileName) {
  const filePath = path.join(shotDirectory, fileName);
  const savedPath = await page.screenshot({ path: filePath, fullPage: false, scale: "css" });
  return path.relative(reviewDirectory, savedPath);
}

async function scrollTo(selector) {
  const found = await page.evaluate((targetSelector) => {
    const element = document.querySelector(targetSelector);
    if (!(element instanceof Element)) {
      return false;
    }
    element.scrollIntoView({ block: "center", inline: "nearest" });
    return true;
  }, selector);
  if (!found) {
    throw new Error(`Scroll target is missing. Selector: ${selector}. URL: ${await page.url()}.`);
  }
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function isTimeout(error) {
  return /timeout/i.test(errorMessage(error));
}

async function openArticle(locale) {
  const url = articleUrl(locale);
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector("css:.blog-faq-list", { timeout: 20000 });
  const triggerCount = await page.evaluate(() => document.querySelectorAll(".blog-faq-trigger").length);
  if (triggerCount !== 5) {
    throw new Error(`FAQ trigger count is ${triggerCount} at ${url}. Expected 5.`);
  }
}

async function readOverlay() {
  return page.evaluate(() => {
    const portals = [...document.querySelectorAll("nextjs-portal")];
    return {
      portalCount: portals.length,
      texts: portals
        .map((portal) => (portal.shadowRoot?.innerText || portal.innerText || "").replace(/\s+/g, " ").trim())
        .filter((text) => text.length > 0),
    };
  });
}

async function faqItems() {
  return page.evaluate(() => [...document.querySelectorAll(".blog-faq-item")].map((item, index) => {
    const trigger = item.querySelector(".blog-faq-trigger");
    const answer = item.querySelector(".blog-faq-answer");
    const triggerRect = trigger instanceof HTMLElement ? trigger.getBoundingClientRect() : null;
    const answerRect = answer instanceof HTMLElement ? answer.getBoundingClientRect() : null;
    return {
      index,
      state: item.getAttribute("data-state"),
      question: trigger instanceof HTMLElement ? trigger.textContent.replace(/\s+/g, " ").trim() : null,
      answerText: answer instanceof HTMLElement ? answer.textContent.replace(/\s+/g, " ").trim() : null,
      answerHeight: answerRect === null ? null : Math.round(answerRect.height),
      triggerWidth: triggerRect === null ? null : Math.round(triggerRect.width),
      triggerHeight: triggerRect === null ? null : Math.round(triggerRect.height),
    };
  }));
}

async function waitItemState(index, state) {
  await page.waitForFunction(
    ({ itemIndex, expectedState }) => document.querySelectorAll(".blog-faq-item")[itemIndex]?.getAttribute("data-state") === expectedState,
    { itemIndex: index, expectedState: state },
    { timeout: 5000 },
  );
}

async function waitAnswerHeight(index, open) {
  await page.waitForFunction(
    ({ itemIndex, expectOpen }) => {
      const answer = document.querySelectorAll(".blog-faq-answer")[itemIndex];
      if (!(answer instanceof HTMLElement)) {
        return false;
      }
      const height = answer.getBoundingClientRect().height;
      return expectOpen ? height > 8 : height < 2;
    },
    { itemIndex: index, expectOpen: open },
    { timeout: 5000 },
  );
}

async function clickFaq(index, label) {
  await page.click(`css:.blog-faq-trigger >> nth=${index}`, { label });
}

function collectFooterFacts(canary) {
  function parseColor(value) {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (match === null) {
      return null;
    }
    const parts = match[1].split(",").map((part) => Number(part.trim()));
    if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) {
      return null;
    }
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  }

  function channel(component) {
    const scale = component / 255;
    return scale <= 0.04045 ? scale / 12.92 : ((scale + 0.055) / 1.055) ** 2.4;
  }

  function composite(front, back) {
    const alpha = front.a;
    return {
      r: front.r * alpha + back.r * (1 - alpha),
      g: front.g * alpha + back.g * (1 - alpha),
      b: front.b * alpha + back.b * (1 - alpha),
      a: 1,
    };
  }

  function opaqueBackground(element) {
    const layers = [];
    let node = element;
    while (node instanceof Element) {
      const parsed = parseColor(getComputedStyle(node).backgroundColor);
      if (parsed !== null && parsed.a > 0) {
        layers.push(parsed);
        if (parsed.a >= 1) {
          break;
        }
      }
      node = node.parentElement;
    }
    let color = { r: 255, g: 255, b: 255, a: 1 };
    for (let index = layers.length - 1; index >= 0; index -= 1) {
      color = composite(layers[index], color);
    }
    return color;
  }

  function contrast(element) {
    const style = getComputedStyle(element);
    const foreground = parseColor(style.color);
    if (foreground === null) {
      return { error: `Unparsed color ${style.color}` };
    }
    const background = opaqueBackground(element);
    const painted = composite(foreground, background);
    function luminance(rgb) {
      return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
    }
    const lighter = Math.max(luminance(painted), luminance(background));
    const darker = Math.min(luminance(painted), luminance(background));
    return {
      ratio: Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2)),
      color: style.color,
      background: `rgb(${Math.round(background.r)} ${Math.round(background.g)} ${Math.round(background.b)})`,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    };
  }

  function box(element) {
    const rect = element.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      pass44: rect.width >= 44 && rect.height >= 44,
    };
  }

  const bodyRoot = document.querySelector("#blog-article-how-to-harvest-stardew-valley");
  const faqList = bodyRoot?.querySelector(".blog-faq-list");
  const faqHeading = faqList?.previousElementSibling?.tagName === "H2" ? faqList.previousElementSibling : null;
  const nodes = [
    bodyRoot?.querySelector(".blog-faq-list"),
    bodyRoot?.querySelector("[data-blog-planner-cta='true']"),
    bodyRoot?.querySelector(".blog-sources"),
  ];
  const order = ["faq", "cta", "sources"].map((name, index) => ({
    name,
    present: nodes[index] instanceof Element,
    top: nodes[index] instanceof Element ? Math.round(nodes[index].getBoundingClientRect().top + window.scrollY) : null,
  }));
  const sourceCard = document.querySelector(".blog-sources__card");
  const sourceItem = document.querySelector(".blog-sources__item");
  const ctaContent = document.querySelector(".blog-planner-cta__content");
  const ctaAction = document.querySelector("[data-blog-planner-cta-action='true']");
  const cardStyle = sourceCard instanceof Element ? getComputedStyle(sourceCard) : null;
  const itemStyle = sourceItem instanceof Element ? getComputedStyle(sourceItem) : null;
  const ctaStyle = ctaContent instanceof Element ? getComputedStyle(ctaContent) : null;
  const actionStyle = ctaAction instanceof Element ? getComputedStyle(ctaAction) : null;
  const html = document.documentElement.outerHTML;
  const offenders = [];
  for (const element of document.body.querySelectorAll("h1, h2, h3, p, a, img, figure, nav, section")) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      continue;
    }
    if (rect.left < -1 || rect.right > window.innerWidth + 1) {
      offenders.push({
        tag: element.tagName.toLowerCase(),
        className: String(element.className).slice(0, 100),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      });
      if (offenders.length >= 8) {
        break;
      }
    }
  }
  const contrastTargets = [
    [".blog-faq-trigger", "faq trigger"],
    [".blog-faq-answer p", "faq answer"],
    [".blog-planner-cta__heading", "cta heading"],
    ["[data-blog-planner-cta-action='true']", "cta action"],
    [".blog-sources__title h2", "sources heading"],
    [".blog-sources__item-title", "source label"],
    [".blog-sources__item-icon", "source icon decorative"],
    [".blog-sources__item-chevron", "source chevron decorative"],
  ];
  return {
    order,
    monotonicallyDown: order.every((item) => item.top !== null) && order.every((item, index) => index === 0 || item.top > order[index - 1].top),
    counts: {
      h1: document.querySelectorAll("h1").length,
      faqList: document.querySelectorAll(".blog-faq-list").length,
      faqTrigger: document.querySelectorAll(".blog-faq-trigger").length,
      cta: document.querySelectorAll("[data-blog-planner-cta='true']").length,
      sourceLinks: document.querySelectorAll(".blog-sources__item").length,
      articlePlannerHrefs: [...(bodyRoot?.querySelectorAll("a") ?? [])].filter((anchor) => anchor.getAttribute("href") === (document.documentElement.lang === "zh-CN" ? "/zh#planner" : "/#planner")).length,
    },
    faqHeading: faqHeading instanceof HTMLElement ? faqHeading.textContent.replace(/\s+/g, " ").trim() : null,
    sourcesHeading: document.querySelector(".blog-sources__title h2")?.textContent.replace(/\s+/g, " ").trim() ?? null,
    ctaHref: ctaAction instanceof HTMLAnchorElement ? ctaAction.getAttribute("href") : null,
    ctaText: ctaAction instanceof HTMLElement ? ctaAction.textContent.replace(/\s+/g, " ").trim() : null,
    sourceHrefs: [...document.querySelectorAll(".blog-sources__item")].map((anchor) => anchor.getAttribute("href")),
    sourceLabels: [...document.querySelectorAll(".blog-sources__item-title")].map((node) => node.textContent.replace(/\s+/g, " ").trim()),
    touch: {
      triggers: [...document.querySelectorAll(".blog-faq-trigger")].map((element) => box(element)),
      cta: ctaAction instanceof Element ? box(ctaAction) : null,
      sources: [...document.querySelectorAll(".blog-sources__item")].map((element) => box(element)),
    },
    contrast: contrastTargets.map(([selector, name]) => {
      const element = document.querySelector(selector);
      return {
        name,
        ...(element instanceof Element ? contrast(element) : { error: `Missing ${selector}` }),
      };
    }),
    visual: {
      cardBackground: cardStyle?.backgroundColor ?? null,
      cardRadius: cardStyle?.borderRadius ?? null,
      itemBackground: itemStyle?.backgroundColor ?? null,
      itemRadius: itemStyle?.borderRadius ?? null,
      hasLinkIcon: document.querySelector(".blog-sources__item-icon") instanceof Element,
      hasChevron: document.querySelector(".blog-sources__item-chevron") instanceof Element,
      ctaBackground: ctaStyle?.backgroundColor ?? null,
      ctaRadius: ctaStyle?.borderRadius ?? null,
      actionBackground: actionStyle?.backgroundColor ?? null,
      actionColor: actionStyle?.color ?? null,
    },
    overflow: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
      offenders,
    },
    leak: {
      canaryPresent: html.includes(canary),
      docsBlogOpsPresent: html.includes("docs/blog-ops"),
      operationStorePresent: html.includes("operation-store"),
      bodyHashPresent: html.includes("bodyHash"),
    },
  };
}

function collectHeadFacts() {
  function metaContent(selector) {
    const element = document.head.querySelector(selector);
    return element instanceof HTMLMetaElement ? element.content : null;
  }
  const article = document.querySelector("[data-blog-article='true']");
  const images = [...(article?.querySelectorAll("img") ?? [])].map((image) => ({
    alt: image.alt,
    src: image.getAttribute("src"),
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    caption: image.closest("figure")?.querySelector("figcaption")?.textContent.replace(/\s+/g, " ").trim() ?? null,
  }));
  const jsonLd = [...document.querySelectorAll("script[type='application/ld+json']")].map((script) => {
    try {
      return JSON.parse(script.textContent || "");
    } catch (error) {
      return { parseError: error instanceof Error ? error.message : String(error) };
    }
  });
  return {
    url: location.href,
    htmlLang: document.documentElement.lang,
    title: document.title,
    h1Count: document.querySelectorAll("h1").length,
    h1: document.querySelector("[data-blog-article='true'] h1")?.textContent.replace(/\s+/g, " ").trim() ?? null,
    description: document.querySelector(".blog-article-description")?.textContent.replace(/\s+/g, " ").trim() ?? null,
    metaDescription: metaContent("meta[name='description']"),
    canonical: document.head.querySelector("link[rel='canonical']")?.href ?? null,
    alternates: [...document.head.querySelectorAll("link[rel='alternate']")].map((link) => ({
      hreflang: link.getAttribute("hreflang"),
      href: link.href,
    })),
    robots: metaContent("meta[name='robots']"),
    openGraph: {
      title: metaContent("meta[property='og:title']"),
      description: metaContent("meta[property='og:description']"),
      url: metaContent("meta[property='og:url']"),
      type: metaContent("meta[property='og:type']"),
      image: metaContent("meta[property='og:image']"),
      locale: metaContent("meta[property='og:locale']"),
    },
    twitter: {
      card: metaContent("meta[name='twitter:card']"),
      title: metaContent("meta[name='twitter:title']"),
      description: metaContent("meta[name='twitter:description']"),
      image: metaContent("meta[name='twitter:image']"),
    },
    jsonLd,
    images,
    emptyAltImages: [...document.querySelectorAll("img")].filter((image) => image.alt.trim() === "").map((image) => image.getAttribute("src")),
  };
}

function gradeHead(locale, head) {
  const expected = expectedCopy(locale);
  const articles = head.jsonLd.filter((item) => item["@type"] === "Article");
  const article = articles[0] ?? null;
  const hreflang = Object.fromEntries(head.alternates.map((item) => [item.hreflang, item.href]));
  return {
    title: head.title === expected.title && head.h1 === expected.title && head.h1Count === 1,
    description: head.metaDescription === expected.description && head.description === expected.description,
    canonical: head.canonical === expected.canonical,
    hreflang: hreflang.en === "https://stardewvalleyplanner.art/how-to-harvest-stardew-valley"
      && hreflang["zh-CN"] === "https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley"
      && hreflang["x-default"] === "https://stardewvalleyplanner.art/how-to-harvest-stardew-valley",
    robots: head.robots === "index, follow",
    htmlLang: head.htmlLang === expected.htmlLang,
    openGraphPresent: head.openGraph.title === expected.title && head.openGraph.type === "article" && head.openGraph.url === expected.canonical,
    twitterPresent: head.twitter.card === "summary" && head.twitter.title === expected.title,
    articleType: articles.length === 1 && article?.["@type"] === "Article",
    headline: article?.headline === expected.title,
    jsonUrl: article?.url === expected.canonical,
    inLanguage: article?.inLanguage === expected.inLanguage,
    imageMissing: article?.image === undefined,
    authorMissing: article?.author === undefined,
    dateMissing: article?.datePublished === undefined && article?.dateModified === undefined,
    noFaqPage: !head.jsonLd.some((item) => item["@type"] === "FAQPage" || item["@type"] === "QAPage"),
    coverAlt: head.images.some((image) => image.src === "/blog/how-to-harvest-stardew-valley-cover.webp" && image.alt === expected.coverAlt && image.caption === null),
    bodyAlts: expected.bodyAlts.every((alt) => head.images.some((image) => image.alt === alt && image.naturalWidth > 0)),
    coverCaptionAbsent: head.images.filter((image) => image.src === "/blog/how-to-harvest-stardew-valley-cover.webp").every((image) => image.caption === null),
  };
}

const results = {
  taskSpace: { spaceId: task.spaceId, name: task.name, ownership: task.ownership, page: "p1", finished: false },
  locales: [],
  failures: [],
};

function fail(id, detail) {
  results.failures.push({ id, detail });
  console.error(JSON.stringify({ event: "fail", id, detail }));
}

async function save() {
  await fs.writeFile(path.join(reviewDirectory, "browser-facts.json"), `${JSON.stringify(results, null, 2)}\n`);
}

async function exerciseFaq(locale, viewportName) {
  const initial = await faqItems();
  if (initial.length !== 5 || initial.some((item) => item.state !== "closed" || item.answerHeight >= 2)) {
    fail(`${locale}-${viewportName}-initial-closed`, JSON.stringify(initial.map((item) => ({ state: item.state, answerHeight: item.answerHeight }))));
  }
  await scrollTo(".blog-faq-list");
  const initialShot = await screenshot(`${locale}-${viewportName}-faq-initial.png`);
  await clickFaq(0, "open first FAQ");
  await waitItemState(0, "open");
  await waitAnswerHeight(0, true);
  const opened = await faqItems();
  if (opened[0].answerHeight <= 8 || opened[0].answerText.length === 0) {
    fail(`${locale}-${viewportName}-first-answer-visible`, JSON.stringify(opened[0]));
  }
  await scrollTo(".blog-faq-item");
  const openShot = await screenshot(`${locale}-${viewportName}-faq-open.png`);
  await clickFaq(0, "close first FAQ");
  await waitItemState(0, "closed");
  await waitAnswerHeight(0, false);
  const reclosedShot = await screenshot(`${locale}-${viewportName}-faq-reclosed.png`);

  await page.focus("css:.blog-faq-item:nth-child(2) .blog-faq-trigger");
  await page.keyboard.press("Enter");
  await waitItemState(1, "open");
  await waitAnswerHeight(1, true);
  await page.keyboard.press("Enter");
  await waitItemState(1, "closed");
  await waitAnswerHeight(1, false);

  await page.focus("css:.blog-faq-item:nth-child(3) .blog-faq-trigger");
  await page.keyboard.press("Space");
  await waitItemState(2, "open");
  await waitAnswerHeight(2, true);
  await page.keyboard.press("Space");
  await waitItemState(2, "closed");
  await waitAnswerHeight(2, false);

  const answers = [];
  for (let index = 0; index < 5; index += 1) {
    await clickFaq(index, `open FAQ ${index + 1}`);
    await waitItemState(index, "open");
    await waitAnswerHeight(index, true);
    const current = await faqItems();
    answers.push(current[index]);
    if (current[index].answerHeight <= 8 || current[index].answerText.length < 8) {
      fail(`${locale}-${viewportName}-answer-${index}`, JSON.stringify(current[index]));
    }
  }
  return { initialShot, openShot, reclosedShot, initialClosed: initial.every((item) => item.state === "closed"), answers };
}

async function decodeArticleImages(locale) {
  const selectors = [
    "img[src='/blog/how-to-harvest-stardew-valley-cover.webp']",
    "img[src='/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp']",
    "img[src='/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp']",
  ];
  const decoded = [];
  for (const selector of selectors) {
    await scrollTo(selector);
    try {
      await page.waitForFunction(
        (imageSelector) => {
          const image = document.querySelector(imageSelector);
          return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
        },
        selector,
        { timeout: 15000 },
      );
      decoded.push({ selector, ok: true });
    } catch (error) {
      if (!isTimeout(error)) {
        throw error;
      }
      decoded.push({ selector, ok: false, error: errorMessage(error) });
      fail(`${locale}-image-decode`, `${selector} ${errorMessage(error)}`);
    }
  }
  return decoded;
}

async function captureLocale(locale) {
  const record = { locale, viewports: {}, head: null, headGrade: null, cta: null, sourceClick: null, overlay: null };
  await setCssViewport(1440, 900, false);
  await openArticle(locale);
  record.overlay = await readOverlay();
  const overlayText = record.overlay.texts.join(" ");
  if (/error|exception|unhandled/i.test(overlayText)) {
    record.overlayFirstError = overlayText;
    await page.reload({ waitUntil: "load", timeout: 30000 });
    await page.waitForSelector("css:.blog-faq-list", { timeout: 20000 });
    record.overlayAfterReload = await readOverlay();
    fail(`${locale}-runtime-overlay`, overlayText);
  }
  record.imageDecode = await decodeArticleImages(locale);
  record.head = await page.evaluate(collectHeadFacts);
  record.headGrade = gradeHead(locale, record.head);
  record.footerDesktop = await page.evaluate(collectFooterFacts, operationStore.canary);
  record.viewports.desktop = await exerciseFaq(locale, "1440");
  await scrollTo(".blog-sources");
  record.viewports.desktop.sourcesShot = await screenshot(`${locale}-1440-sources.png`);

  const expected = expectedCopy(locale);
  await scrollTo("[data-blog-planner-cta-action='true']");
  await page.click("css=[data-blog-planner-cta-action='true']", { label: "open planner CTA" });
  try {
    await page.waitForFunction(
      () => location.hash === "#planner" && document.querySelector("#planner") instanceof HTMLElement,
      undefined,
      { timeout: 20000 },
    );
  } catch (error) {
    if (!isTimeout(error)) {
      throw error;
    }
    fail(`${locale}-cta-navigation`, errorMessage(error));
  }
  record.cta = await page.evaluate(() => {
    const element = document.querySelector("#planner");
    const rect = element instanceof HTMLElement ? element.getBoundingClientRect() : null;
    return {
      url: location.href,
      hash: location.hash,
      plannerPresent: element instanceof HTMLElement,
      plannerVisible: rect !== null && rect.width > 0 && rect.height > 0,
      plannerWidth: rect === null ? null : Math.round(rect.width),
      plannerHeight: rect === null ? null : Math.round(rect.height),
    };
  });
  if (record.cta.plannerPresent) {
    await scrollTo("#planner");
    record.cta.screenshot = await screenshot(`${locale}-1440-planner.png`);
  }
  if (record.cta.hash !== "#planner" || record.cta.plannerVisible !== true || !record.cta.url.includes(expected.plannerHref.replace("#planner", ""))) {
    fail(`${locale}-cta-visible`, JSON.stringify(record.cta));
  }

  await openArticle(locale);
  await scrollTo(".blog-sources__item");
  const sourceHref = await page.evaluate(() => document.querySelector(".blog-sources__item")?.href ?? null);
  await page.click("css:.blog-sources__item >> nth=0", { label: "open first source" });
  try {
    await page.waitForFunction(
      (startPath) => location.pathname !== startPath,
      articlePath(locale),
      { timeout: 30000 },
    );
    record.sourceClick = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      bodyStart: document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 180),
    }));
    record.sourceClick.screenshot = await screenshot(`${locale}-1440-source-destination.png`);
    record.sourceClick.requestedHref = sourceHref;
    record.sourceClick.externalContentClaimed = false;
  } catch (error) {
    if (!isTimeout(error)) {
      throw error;
    }
    record.sourceClick = {
      requestedHref: sourceHref,
      url: await page.url(),
      timeout: errorMessage(error),
      externalContentClaimed: false,
    };
    fail(`${locale}-source-click`, errorMessage(error));
  }

  await setCssViewport(375, 812, true);
  await openArticle(locale);
  record.footerMobile = await page.evaluate(collectFooterFacts, operationStore.canary);
  record.viewports.mobile = await exerciseFaq(locale, "375");
  await scrollTo(".blog-sources");
  record.viewports.mobile.sourcesShot = await screenshot(`${locale}-375-sources.png`);
  results.locales.push(record);
  await save();
  console.log(JSON.stringify({ event: "locale-done", locale, failures: results.failures.length }));
}

try {
  await captureLocale("en");
  await captureLocale("zh");
  await setCssViewport(1440, 900, false);
  await openArticle("en");
  results.leftOn = { url: await page.url(), viewport: "1440x900", taskSpaceFinished: false };
  await save();
} catch (error) {
  results.uncaught = errorMessage(error);
  results.leftOn = { url: await page.url(), taskSpaceFinished: false };
  await save();
  throw error;
}
if (results.failures.length > 0) {
  throw new Error(`Browser acceptance recorded ${results.failures.length} failures. See browser-facts.json.`);
}
console.log(JSON.stringify({ event: "browser-pass", failures: 0 }));
